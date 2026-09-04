/* ================================================================
   DocJur — assets/js/editor.js
   Controla: editor rich text (toolbar, comandos), placeholders,
   contagem, zoom, lock/unlock, inserção de placeholder.
   Depende: DocJurUtils, DocJurStore, DocJurTemplates, DocJurUI
   (o último apenas para o toast; refatorável depois).
   ================================================================ */
/* global DocJurUtils, DocJurStore, DocJurTemplates, DocJurUI */
/** @typedef {{ docTitle: string, currentDocId: string|null, templateId: string|null, zoomLevel: number, colorMode: "foreColor"|"backColor"|"highlight"|"hiliteColor", editorLocked: boolean }} EditorAppState */
/** @typedef {any} EditorLucideApi */
/** @returns {EditorLucideApi} */
function getLucide() {
  return /** @type {any} */ (window)["lucide"];
}
/** @typedef {{ editor: HTMLElement|null, metaStats: HTMLElement|null, metaPh: HTMLElement|null, title: HTMLElement|null, editorWrap: HTMLElement|null }} EditorRefs */
const DocJurEditor = (() => {
  const { $, $$, escHtml, replacePlaceholders, countText } = DocJurUtils;

  /** @type {EditorAppState|null} — subconjunto do state global;
   *  compartilhado por referência com DocJurApp via init(state).
   *  Não re-declare valores aqui — são inicializados no módulo pai. */
  let STATE = /** @type {EditorAppState|null} */ (null);

  // ---- Referências DOM (avaliadas só após init) ----
  /** @type {EditorRefs} */
  const refs = {
    editor: null,
    metaStats: null,
    metaPh: null,
    title: null,
    editorWrap: null,
  };

  // ================================================================
  //                       PLACEHOLDERS
  // ================================================================

  /**
   * Aplica dados do formulário em todo {{CHAVE}} do editor;
   * atualiza contadores no rodapé.
   */
  function applyPlaceholders() {
    if (!refs.editor) return;
    const data = DocJurStore.collectData();
    const { html, filled, total } = replacePlaceholders(
      refs.editor.innerHTML,
      data,
    );
    refs.editor.innerHTML = html;
    updateStats();
    if (refs.metaPh)
      refs.metaPh.textContent = `Placeholders: ${filled} preenchidos / ${total}`;
  }

  // ================================================================
  //                       TEMPLATE LOADING
  // ================================================================

  /**
   * Carrega um template por ID, marcando ativo no painel direito,
   * definindo título, substituindo placeholders.
   * @param {string} id
   */
  function loadTemplate(id) {
    $$(".tpl-item").forEach((el) => {
      const h = /** @type {HTMLElement} */ (el);
      h.classList.toggle("active", h.dataset.tpl === id);
    });
    const data = DocJurStore.collectData();
    const title =
      data.DOC_TITULO && String(data.DOC_TITULO).trim()
        ? String(data.DOC_TITULO)
        : DocJurTemplates.templateTitle(id);
    const dtInput = /** @type {HTMLInputElement|null} */ ($("#doc_titulo"));
    if (dtInput) dtInput.value = title;
    if (STATE) STATE.docTitle = title;
    if (refs.title) refs.title.textContent = title;
    if (refs.editor) refs.editor.innerHTML = DocJurTemplates.getHtml(id);
    applyPlaceholders();
    updateStats();
    const ui = /** @type {any} */ (window)["DocJurUI"];
    if (ui)
      ui.toast(
        `Modelo carregado: ${DocJurTemplates.templateTitle(id)}`,
        "success",
      );
  }

  // ================================================================
  //                       STATS
  // ================================================================

  function updateStats() {
    if (!refs.editor) return;
    const { words, chars } = countText(refs.editor.innerText || "");
    if (refs.metaStats)
      refs.metaStats.textContent = `Palavras: ${words} · Caracteres: ${chars}`;
  }

  function wordCountAlert() {
    const { words, chars, charsNoSpace } = countText(
      refs.editor?.innerText || "",
    );
    alert(
      `Palavras: ${words}\nCaracteres: ${chars}\nCaracteres (s/ espaços): ${charsNoSpace}`,
    );
  }

  // ================================================================
  //                       ZOOM
  // ================================================================

  /** @param {number} z */
  function setZoom(z) {
    if (!refs.editorWrap || !STATE) return;
    STATE.zoomLevel = Math.max(0.5, Math.min(2, z));
    refs.editorWrap.style.transform = `scale(${STATE.zoomLevel})`;
    refs.editorWrap.style.transformOrigin = "top center";
  }

  // ================================================================
  //                       LOCK / UNLOCK
  // ================================================================

  function toggleLock() {
    if (!refs.editor || !STATE) return;
    STATE.editorLocked = !STATE.editorLocked;
    refs.editor.setAttribute(
      "contenteditable",
      STATE.editorLocked ? "false" : "true",
    );
    const btn = /** @type {HTMLButtonElement|null} */ ($("#btn-toggle-edit"));
    if (btn) {
      btn.innerHTML = STATE.editorLocked
        ? '<i data-lucide="lock"></i>'
        : '<i data-lucide="lock-open"></i>';
      const luc = getLucide();
      if (luc) luc.createIcons();
    }
    const ui = /** @type {any} */ (window)["DocJurUI"];
    if (ui) {
      ui.toast(
        STATE.editorLocked ? "Edição BLOQUEADA" : "Edição DESBLOQUEADA",
        STATE.editorLocked ? "info" : "info",
      );
    }
  }

  // ================================================================
  //                 RICH TEXT TOOLBAR
  // ================================================================

  /** Liga todos os botões e selects da toolbar. */
  function initToolbar() {
    if (!STATE)
      throw new Error(
        "[DocJurEditor] STATE não inicializado — chame Editor.init(state)",
      );
    refs.editor = /** @type {HTMLElement|null} */ ($("#editor"));
    refs.metaStats = /** @type {HTMLElement|null} */ ($("#meta-stats"));
    refs.metaPh = /** @type {HTMLElement|null} */ ($("#meta-ph"));
    refs.title = /** @type {HTMLElement|null} */ ($("#editor-title"));
    refs.editorWrap = /** @type {HTMLElement|null} */ ($("#editor-wrap"));

    // --- Command buttons ---
    $$(".tb-btn[data-cmd]").forEach((btn) => {
      const b = /** @type {HTMLButtonElement} */ (btn);
      b.addEventListener("mousedown", (e) => e.preventDefault());
      b.addEventListener("click", () => {
        document.execCommand(b.dataset.cmd || "", false, undefined);
        refs.editor?.focus();
        updateToolbarState();
      });
    });

    // --- Font family / size ---
    const tbFont = /** @type {HTMLSelectElement|null} */ ($("#tb-font"));
    tbFont?.addEventListener("change", (e) => {
      const val = /** @type {HTMLSelectElement} */ (e.target).value;
      document.execCommand("fontName", false, val);
      refs.editor?.focus();
    });
    const tbSize = /** @type {HTMLSelectElement|null} */ ($("#tb-size"));
    tbSize?.addEventListener("change", (e) => {
      const val = /** @type {HTMLSelectElement} */ (e.target).value;
      document.execCommand("fontSize", false, val);
      refs.editor?.focus();
    });

    // --- Heading / block format ---
    const tbHead = /** @type {HTMLSelectElement|null} */ ($("#tb-head"));
    tbHead?.addEventListener("change", (e) => {
      const sel = /** @type {HTMLSelectElement} */ (e.target);
      const v = sel.value;
      document.execCommand("formatBlock", false, v ? `<${v}>` : "<p>");
      refs.editor?.focus();
    });

    // --- Lists ---
    const tbList = /** @type {HTMLSelectElement|null} */ ($("#tb-list"));
    tbList?.addEventListener("change", (e) => {
      const sel = /** @type {HTMLSelectElement} */ (e.target);
      if (sel.value) document.execCommand(sel.value, false, undefined);
      setTimeout(() => {
        sel.value = "";
      }, 0);
      refs.editor?.focus();
    });

    // --- HR, link, unlink ---
    $("#btn-hr")?.addEventListener("click", () => {
      document.execCommand("insertHorizontalRule", false, undefined);
      refs.editor?.focus();
    });
    $("#btn-link")?.addEventListener("click", () => {
      const url = prompt("Digite a URL do link:", "https://");
      if (url) document.execCommand("createLink", false, url);
      refs.editor?.focus();
    });
    $("#btn-unlink")?.addEventListener("click", () => {
      document.execCommand("unlink", false, undefined);
      refs.editor?.focus();
    });

    // --- Clear format, select all ---
    $("#btn-clear-fmt")?.addEventListener("click", () => {
      document.execCommand("removeFormat", false, undefined);
      refs.editor?.focus();
    });
    $("#btn-select-all")?.addEventListener("click", () => {
      if (!refs.editor) return;
      const r = document.createRange();
      r.selectNodeContents(refs.editor);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(r);
    });

    // --- Color picker (cor do texto / destaque) ---
    $("#btn-color")?.addEventListener("click", () => {
      if (!STATE) return;
      STATE.colorMode = "foreColor";
      DocJurUI.openColorPicker("Cor do Texto", applyColor);
    });
    $("#btn-hl")?.addEventListener("click", () => {
      if (!STATE) return;
      STATE.colorMode = "hiliteColor";
      DocJurUI.openColorPicker("Cor de Destaque", applyColor);
    });
    const cc = /** @type {HTMLInputElement|null} */ ($("#color-custom"));
    cc?.addEventListener("input", (e) =>
      applyColor(/** @type {HTMLInputElement} */ (e.target).value),
    );
    buildColorPalette();

    // --- Placeholder inserter ---
    $("#btn-ph")?.addEventListener("click", DocJurUI.openPhModal);
    $("#ph-search")?.addEventListener("input", DocJurUI.renderPhList);
    DocJurUI.renderPhList();

    // --- Page break ---
    $("#btn-page-break")?.addEventListener("click", () => {
      document.execCommand(
        "insertHTML",
        false,
        '<div style="page-break-after:always;"></div>',
      );
      refs.editor?.focus();
    });

    // --- Editor events ---
    refs.editor?.addEventListener("keyup", updateToolbarState);
    refs.editor?.addEventListener("mouseup", updateToolbarState);
    refs.editor?.addEventListener("input", updateStats);

    // --- Keyboard shortcuts ---
    refs.editor?.addEventListener("keydown", (ev) => {
      const e = /** @type {KeyboardEvent} */ (ev);
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;
      const key = e.key.toLowerCase();
      if (key === "b") {
        e.preventDefault();
        document.execCommand("bold", false, undefined);
      } else if (key === "i") {
        e.preventDefault();
        document.execCommand("italic", false, undefined);
      } else if (key === "u") {
        e.preventDefault();
        document.execCommand("underline", false, undefined);
      }
    });

    // --- Zoom buttons ---
    $("#btn-zoom-in")?.addEventListener("click", () => {
      if (!STATE) return;
      setZoom(STATE.zoomLevel + 0.1);
    });
    $("#btn-zoom-out")?.addEventListener("click", () => {
      if (!STATE) return;
      setZoom(STATE.zoomLevel - 0.1);
    });

    // --- Lock button ---
    $("#btn-toggle-edit")?.addEventListener("click", toggleLock);
    $("#btn-word-count")?.addEventListener("click", wordCountAlert);
  }

  function updateToolbarState() {
    const cmds = [
      "bold",
      "italic",
      "underline",
      "strikeThrough",
      "subscript",
      "superscript",
      "justifyLeft",
      "justifyCenter",
      "justifyRight",
      "justifyFull",
    ];
    cmds.forEach((c) => {
      const btn = /** @type {HTMLElement|null} */ (
        document.querySelector(`.tb-btn[data-cmd="${c}"]`)
      );
      btn?.classList.toggle("active", document.queryCommandState(c));
    });
  }

  function buildColorPalette() {
    const COLORS = [
      "#000000",
      "#434343",
      "#666666",
      "#999999",
      "#b7b7b7",
      "#cccccc",
      "#d9d9d9",
      "#ffffff",
      "#980000",
      "#ff0000",
      "#ff9900",
      "#ffff00",
      "#00ff00",
      "#00ffff",
      "#4a86e8",
      "#0000ff",
      "#9900ff",
      "#ff00ff",
      "#e6b8af",
      "#f4cccc",
      "#fce5cd",
      "#fff2cc",
      "#d9ead3",
      "#d0e0e3",
      "#c9daf8",
      "#cfe2f3",
      "#d9d2e9",
      "#ead1dc",
      "#dd7e6b",
      "#ea9999",
      "#f9cb9c",
      "#ffe599",
      "#b6d7a8",
      "#a2c4c9",
      "#a4c2f4",
      "#9fc5e8",
      "#b4a7d6",
      "#d5a6bd",
      "#cc4125",
      "#e06666",
      "#f6b26b",
      "#ffd966",
      "#93c47d",
      "#76a5af",
      "#6d9eeb",
      "#6fa8dc",
      "#8e7cc3",
      "#c27ba0",
    ];
    const grid = /** @type {HTMLElement|null} */ ($("#color-grid"));
    if (!grid) return;
    grid.innerHTML = "";
    COLORS.forEach((c) => {
      const sw = document.createElement("div");
      sw.className = "color-swatch";
      sw.style.background = c;
      sw.addEventListener("click", () => applyColor(c));
      grid.appendChild(sw);
    });
  }

  /** @param {string} colorVal */
  function applyColor(colorVal) {
    if (!STATE) return;
    document.execCommand(STATE.colorMode, false, colorVal);
    DocJurUI.closeColorPicker();
    refs.editor?.focus();
  }

  // ================================================================
  //                       INJECT PH
  // ================================================================

  /** @param {string} key */
  function insertPhAtCursor(key) {
    DocJurUI.closePhModal();
    refs.editor?.focus();
    const tpl = /** @type {any} */ (window)["DocJurTemplates"];
    const label =
      tpl && typeof tpl.phLabel === "function" ? tpl.phLabel(key) : key;
    const snippet = `<span class="ph" data-ph="${escHtml(key)}" title="${escHtml(label)}">{{${escHtml(key)}}}</span>&nbsp;`;
    document.execCommand("insertHTML", false, snippet);
    applyPlaceholders();
  }

  // ================================================================
  //                       INIT
  // ================================================================

  /**
   * @param {EditorAppState} sharedState
   */
  function init(sharedState) {
    STATE = sharedState;
    initToolbar();
  }

  return {
    init,
    applyPlaceholders,
    loadTemplate,
    updateStats,
    updateToolbarState,
    setZoom,
    toggleLock,
    insertPhAtCursor,
    get editorEl() {
      return refs.editor;
    },
  };
})();

/** @type {any} */ (window).DocJurEditor = DocJurEditor;
