/* ================================================================
   DocJur — assets/js/app.js
   Entry point: orquestra inicialização dos módulos + liga
   os botões globais (header / painel esquerdo) que não pertencem
   a um módulo específico.
   Ordem de carregamento (via script tags no HTML):
     utils > store > templates > ui > editor > io > app
   ================================================================ */
/* global DocJurUtils, DocJurStore, DocJurTemplates, DocJurUI, DocJurEditor, DocJurIO */
/** @typedef {{ docTitle: string, currentDocId: string|null, templateId: string|null, zoomLevel: number, colorMode: "foreColor"|"backColor"|"highlight"|"hiliteColor", editorLocked: boolean }} AppAppState */
/** @typedef {any} AppLucideApi */
/** @returns {AppLucideApi} */
function getLucide() {
  return /** @type {any} */ (window)["lucide"];
}
/** @typedef {"left"|"right"|"editor"} PanelSide */
/** @typedef {{ cls: string, pref: string, icons: { open: string, closed: string } }} PanelCfg */
const DocJurApp = (() => {
  const { $ } = DocJurUtils;

  /** @type {AppAppState} — estado compartilhado */
  const STATE = {
    docTitle: "Documento sem título",
    currentDocId: null,
    templateId: null,
    zoomLevel: 1,
    colorMode: "foreColor",
    editorLocked: false,
  };

  // ================================================================
  //                   TEMA CLARO / ESCURO
  // ================================================================
  /**
   * Aplica o tema no <html> via atributo [data-theme].
   * @param {"light"|"dark"|"system"} theme
   */
  function applyTheme(theme) {
    const html = document.documentElement;
    let actual = theme;
    if (theme === "system") {
      actual = window.matchMedia?.("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    if (actual === "dark") {
      html.setAttribute("data-theme", "dark");
      html.classList.add("dark-mode");
    } else {
      html.setAttribute("data-theme", "light");
      html.classList.remove("dark-mode");
    }
    const icon = /** @type {HTMLElement|null} */ ($("#icon-theme"));
    if (icon)
      icon.setAttribute("data-lucide", actual === "dark" ? "sun" : "moon");
    const luc = getLucide();
    if (luc) {
      // Re-renderiza apenas o ícone de tema (evita re-criar tudo)
      luc.createIcons({
        attrs: icon
          ? { "data-lucide": icon.getAttribute("data-lucide") || "" }
          : {},
      });
    }
  }

  function initTheme() {
    const prefs = DocJurStore.getPrefs();
    applyTheme(prefs.theme || "light");

    // Listener do botão
    $("#btn-theme-toggle")?.addEventListener("click", () => {
      const current = DocJurStore.getPrefs().theme || "light";
      const next =
        current === "light" ? "dark" : current === "dark" ? "system" : "light";
      DocJurStore.setPrefs({ theme: next });
      applyTheme(next);
      DocJurUI.toast(
        `Tema: ${next === "light" ? "Claro" : next === "dark" ? "Escuro" : "Sistema"}`,
        "info",
      );
    });

    // Acompanha tema do sistema se estiver em "system"
    window
      .matchMedia?.("(prefers-color-scheme: dark)")
      .addEventListener?.("change", () => {
        const t = DocJurStore.getPrefs().theme || "light";
        if (t === "system") applyTheme("system");
      });
  }

  // ================================================================
  //              BOTÕES HEADER / PAINEL ESQUERDO
  // ================================================================
  function bindGlobalActions() {
    // ----- Header -----
    $("#btn-new")?.addEventListener("click", () => {
      const prefs = DocJurStore.getPrefs();
      if (
        prefs.confirmClearData !== false &&
        !confirm("Criar novo documento? Alterações não salvas serão perdidas.")
      )
        return;
      STATE.currentDocId = null;
      STATE.docTitle = "Documento sem título";
      const title = /** @type {HTMLElement|null} */ ($("#editor-title"));
      if (title) title.textContent = STATE.docTitle;
      const ed = DocJurEditor.editorEl;
      if (ed) ed.innerHTML = DocJurTemplates.DEFAULT_HTML;
      // Limpa hash para não reabrir template/doc
      if (history.replaceState)
        history.replaceState(null, "", location.pathname);
      DocJurEditor.applyPlaceholders();
      DocJurEditor.updateStats();
      DocJurUI.toast("Novo documento criado", "success");
    });

    $("#btn-open")?.addEventListener("click", () => DocJurIO.openDocBrowser());
    $("#btn-save")?.addEventListener("click", () =>
      DocJurIO.saveCurrentDoc(false),
    );
    $("#btn-save-as")?.addEventListener("click", () =>
      DocJurIO.saveCurrentDoc(true),
    );
    $("#btn-docx")?.addEventListener("click", () => DocJurIO.exportDOCX());
    $("#btn-pdf")?.addEventListener("click", () => DocJurIO.exportPDF());

    // ----- Painel esquerdo (dados) -----
    $("#btn-apply-data")?.addEventListener("click", () => {
      DocJurEditor.applyPlaceholders();
      DocJurUI.toast("Placeholders atualizados", "success");
    });
    $("#btn-clear-data")?.addEventListener("click", () => {
      const prefs = DocJurStore.getPrefs();
      if (
        prefs.confirmClearData !== false &&
        !confirm("Limpar todos os dados do formulário?")
      )
        return;
      DocJurStore.clearData();
      DocJurStore.persistData();
      DocJurEditor.applyPlaceholders();
      DocJurUI.toast("Dados do formulário limpos", "success");
    });

    // ----- Input de título do documento -----
    const docTitulo = /** @type {HTMLInputElement|null} */ ($("#doc_titulo"));
    docTitulo?.addEventListener("input", (e) => {
      STATE.docTitle =
        /** @type {HTMLInputElement} */ (e.target).value ||
        "Documento sem título";
      const title = /** @type {HTMLElement|null} */ ($("#editor-title"));
      if (title) title.textContent = STATE.docTitle;
    });

    // ----- Keyboard shortcuts: Ctrl+S = salvar / Ctrl+Shift+S = salvar como -----
    window.addEventListener("keydown", (ev) => {
      const e = /** @type {KeyboardEvent} */ (ev);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (e.shiftKey) DocJurIO.saveCurrentDoc(true);
        else DocJurIO.saveCurrentDoc(false);
      }
    });
  }

  /** Interpreta #tpl=xxx ou #doc=xxx no URL e abre direto. */
  function handleUrlHash() {
    const h = (window.location.hash || "").replace(/^#/, "");
    if (!h) return;
    const params = new URLSearchParams(h);
    const tpl = params.get("tpl");
    const docId = params.get("doc");
    let acted = false;
    const fire = () => {
      if (docId) {
        try {
          DocJurIO.loadDocById(docId);
          acted = true;
        } catch (e) {
          console.warn("hash loadDocById", e);
        }
      } else if (tpl) {
        try {
          DocJurEditor.loadTemplate(tpl);
          acted = true;
        } catch (e) {
          console.warn("hash loadTemplate", e);
        }
      }
      if (acted && history.replaceState)
        history.replaceState(null, "", location.pathname);
    };
    setTimeout(fire, 50);
  }

  // ================================================================
  //              PAINÉIS COLAPSÁVEIS (minimizar)
  // ================================================================
  /** @type {Record<PanelSide, PanelCfg>} */
  const PANEL_STATE = {
    left: {
      cls: "left-collapsed",
      pref: "uiLeftCollapsed",
      icons: { open: "panel-left-close", closed: "panel-left-open" },
    },
    right: {
      cls: "right-collapsed",
      pref: "uiRightCollapsed",
      icons: { open: "panel-right-close", closed: "panel-right-open" },
    },
    editor: {
      cls: "editor-collapsed",
      pref: "uiEditorCollapsed",
      icons: { open: "minimize-2", closed: "maximize-2" },
    },
  };

  /** Aplica ícone correto no botão minimizar conforme estado collapsed.
   * @param {PanelSide} side
   * @param {boolean} collapsed */
  function updateMinimizeIcon(side, collapsed) {
    const btn = document.querySelector(`[data-panel-toggle="${side}"]`);
    if (!btn) return;
    const i = btn.querySelector("i");
    if (!i) return;
    const cfg = PANEL_STATE[side];
    const next = collapsed ? cfg.icons.closed : cfg.icons.open;
    i.setAttribute("data-lucide", next);
    const luc = getLucide();
    if (luc)
      luc.createIcons({
        attrs: {},
        nameAttr: "data-lucide",
        nameAttrStrict: true,
      });
  }

  /** Aplica estado collapsed no DOM: classes em .main + .panel + atributo aria + preferências persistido.
   * @param {PanelSide} side
   * @param {boolean} collapsed
   * @param {boolean} [persist] */
  function setPanelCollapsed(side, collapsed, persist = true) {
    const cfg = PANEL_STATE[side];
    if (!cfg) return;
    const main = document.querySelector("main.main");
    const panel = document.querySelector(`section.panel[data-panel="${side}"]`);
    if (!main || !panel) return;
    main.classList.toggle(cfg.cls, !!collapsed);
    panel.classList.toggle("collapsed", !!collapsed);
    panel.setAttribute("aria-collapsed", collapsed ? "true" : "false");
    updateMinimizeIcon(side, !!collapsed);
    if (persist) {
      /** @type {Record<string, boolean>} */
      const patch = {};
      patch[cfg.pref] = !!collapsed;
      DocJurStore.setPrefs(patch);
    }
  }

  /** Restaura preferências salvas (deve ser chamado APÓS lucide.createIcons inicial já ter rodado 1x no init). */
  function restorePanelState() {
    const prefs = DocJurStore.getPrefs();
    /** @type {PanelSide[]} */
    const sides = ["left", "right", "editor"];
    for (const side of sides) {
      const cfg = PANEL_STATE[side];
      const collapsed = !!(
        /** @type {Record<string, unknown>} */ (prefs)[cfg.pref]
      );
      setPanelCollapsed(side, collapsed, false);
    }
  }

  function bindPanelMinimize() {
    document.querySelectorAll("[data-panel-toggle]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const raw = btn.getAttribute("data-panel-toggle");
        if (!raw) return;
        /** @type {PanelSide} */
        const side = /** @type {any} */ (raw);
        const panel = document.querySelector(
          `section.panel[data-panel="${side}"]`,
        );
        const collapsed = panel
          ? !panel.classList.contains("collapsed")
          : false;
        setPanelCollapsed(side, collapsed, true);
      });
    });
  }

  // ================================================================
  //                       BOOTSTRAP
  // ================================================================
  function initAfterDomReady() {
    // Garante Lucide (CDN) inicializado
    const lucideApi = getLucide();
    if (lucideApi) lucideApi.createIcons();

    // 0) Tema primeiro (para não dar FOUS - Flash Of Unstyled Theme)
    initTheme();

    // 1) UI primeiro (paineis, toasts, tabs, tree)
    DocJurUI.init();

    // 2) Inicializa state compartilhado nos módulos que dependem dele
    DocJurEditor.init(STATE);
    DocJurIO.init(STATE);

    // 3) Restaura valores do formulário e liga eventos de change
    DocJurStore.restoreData();
    DocJurStore.bindFormEvents(() => DocJurEditor.applyPlaceholders());

    // Aplica preferências de zoom e fonte default
    const prefs = DocJurStore.getPrefs();
    if (prefs.zoom && prefs.zoom !== 1.0) {
      STATE.zoomLevel = prefs.zoom;
      DocJurEditor.setZoom(STATE.zoomLevel);
    }
    if (prefs.defaultEditorFont) {
      const ed = /** @type {HTMLElement|null} */ ($("#editor"));
      if (ed) ed.style.fontFamily = prefs.defaultEditorFont;
      const fontSel = /** @type {HTMLSelectElement|null} */ ($("#tb-font"));
      if (fontSel) {
        for (const opt of Array.from(fontSel.options)) {
          if (opt.value === prefs.defaultEditorFont) {
            fontSel.value = opt.value;
            break;
          }
        }
      }
    }

    // 4) Aplica placeholders inicial + liga header/botões
    DocJurEditor.applyPlaceholders();
    DocJurEditor.updateStats();
    bindGlobalActions();

    // 4b) Painéis minimizáveis — liga botões e restaura preferências ANTES de lucide re-render
    bindPanelMinimize();

    // 6) Inicializa ícones novamente (para recém-renderizados)
    const lucideApi2 = getLucide();
    if (lucideApi2) lucideApi2.createIcons();

    // 6b) Restaura estado colapsado dos painéis (DEPOIS do createIcons)
    restorePanelState();

    // 5) Hash URL: #tpl=id_tjdft_xxx ou #doc=id_doc_salvo
    handleUrlHash();

    // 7) Se houver último doc aberto, pergunta se continua
    // (pulamos a pergunta se hash já agiu para abrir algo)
    if (!window.location.hash) {
      DocJurIO.promptRestoreLastDoc();
    }

    // 8) Expose para debug / integração futura (IA, API)
    /** @type {any} */ (window).DocJur = Object.freeze({
      STATE,
      Utils: DocJurUtils,
      Store: DocJurStore,
      Templates: DocJurTemplates,
      UI: DocJurUI,
      Editor: DocJurEditor,
      IO: DocJurIO,
      applyTheme,
      /** Aplica/desfaz colapsamento de painel (left/right/editor) — debug */
      setPanelCollapsed,
      /** Hooks / slots para integração de IA (futuro). */
      Hooks: {
        /** @type {Array<(prompt:string)=>Promise<string>>} */
        beforeAiCall: [],
        /** @type {Array<(resp:string,ctx:unknown)=>void>} */
        afterAiCall: [],
      },
    });

    console.debug("[DocJur] ready. State:", STATE);
  }

  function init() {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", initAfterDomReady);
    } else {
      initAfterDomReady();
    }
  }

  return { init };
})();

// Boot
DocJurApp.init();
