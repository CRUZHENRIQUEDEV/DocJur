/* ================================================================
   DocJur — assets/js/app.js
   Entry point: orquestra inicialização dos módulos + liga
   os botões globais (header / painel esquerdo) que não pertencem
   a um módulo específico.
   Ordem de carregamento (via script tags no HTML):
     utils > store > templates > ui > editor > io > app
   ================================================================ */
/* global DocJurUtils, DocJurStore, DocJurTemplates, DocJurUI, DocJurEditor, DocJurIO */
const DocJurApp = (() => {
  const { $, $$ } = DocJurUtils;

  /** @type {import("./utils.js").AppState} — estado compartilhado */
  const STATE = {
    docTitle: "Documento sem título",
    currentDocId: null,
    zoomLevel: 1,
    colorMode: "foreColor",
    editorLocked: false
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
      actual = window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    if (actual === "dark") {
      html.setAttribute("data-theme", "dark");
      html.classList.add("dark-mode");
    } else {
      html.setAttribute("data-theme", "light");
      html.classList.remove("dark-mode");
    }
    const icon = /** @type {HTMLElement|null} */ ($("#icon-theme"));
    if (icon) icon.setAttribute("data-lucide", actual === "dark" ? "sun" : "moon");
    if (window.lucide) {
      // Re-renderiza apenas o ícone de tema (evita re-criar tudo)
      window.lucide.createIcons({ attrs: icon ? { "data-lucide": icon.getAttribute("data-lucide") || "" } : {} });
    }
  }

  function initTheme() {
    const prefs = DocJurStore.getPrefs();
    applyTheme(prefs.theme || "light");

    // Listener do botão
    $("#btn-theme-toggle")?.addEventListener("click", () => {
      const current = DocJurStore.getPrefs().theme || "light";
      const next = current === "light" ? "dark" : current === "dark" ? "system" : "light";
      DocJurStore.setPrefs({ theme: next });
      applyTheme(next);
      DocJurUI.toast(`Tema: ${next === "light" ? "Claro" : next === "dark" ? "Escuro" : "Sistema"}`, "info");
    });

    // Acompanha tema do sistema se estiver em "system"
    window.matchMedia?.("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
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
      if (prefs.confirmClearData !== false && !confirm("Criar novo documento? Alterações não salvas serão perdidas.")) return;
      STATE.currentDocId = null;
      STATE.docTitle = "Documento sem título";
      const title = /** @type {HTMLElement|null} */ ($("#editor-title"));
      if (title) title.textContent = STATE.docTitle;
      const ed = DocJurEditor.editorEl;
      if (ed) ed.innerHTML = DocJurTemplates.DEFAULT_HTML;
      DocJurEditor.applyPlaceholders();
      DocJurEditor.updateStats();
      DocJurUI.toast("Novo documento criado", "success");
    });

    $("#btn-open")?.addEventListener("click", () => DocJurIO.openDocBrowser());
    $("#btn-save")?.addEventListener("click", () => DocJurIO.saveCurrentDoc(false));
    $("#btn-docx")?.addEventListener("click", () => DocJurIO.exportDOCX());
    $("#btn-pdf")?.addEventListener("click", () => DocJurIO.exportPDF());

    // ----- Painel esquerdo (dados) -----
    $("#btn-apply-data")?.addEventListener("click", () => {
      DocJurEditor.applyPlaceholders();
      DocJurUI.toast("Placeholders atualizados", "success");
    });
    $("#btn-clear-data")?.addEventListener("click", () => {
      const prefs = DocJurStore.getPrefs();
      if (prefs.confirmClearData !== false && !confirm("Limpar todos os dados do formulário?")) return;
      DocJurStore.clearData();
      DocJurStore.persistData();
      DocJurEditor.applyPlaceholders();
      DocJurUI.toast("Dados do formulário limpos", "success");
    });

    // ----- Input de título do documento -----
    const docTitulo = /** @type {HTMLInputElement|null} */ ($("#doc_titulo"));
    docTitulo?.addEventListener("input", (e) => {
      STATE.docTitle =
        /** @type {HTMLInputElement} */ (e.target).value || "Documento sem título";
      const title = /** @type {HTMLElement|null} */ ($("#editor-title"));
      if (title) title.textContent = STATE.docTitle;
    });

    // ----- Keyboard shortcut: Ctrl+S = salvar -----
    window.addEventListener("keydown", (ev) => {
      const e = /** @type {KeyboardEvent} */ (ev);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        DocJurIO.saveCurrentDoc(false);
      }
    });
  }

  // ================================================================
  //                       BOOTSTRAP
  // ================================================================
  function initAfterDomReady() {
    // Garante Lucide (CDN) inicializado
    if (window.lucide) window.lucide.createIcons();

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
      const wrap = /** @type {HTMLElement|null} */ ($("#editor-wrap"));
      if (wrap) wrap.style.transform = `scale(${STATE.zoomLevel})`;
    }
    if (prefs.defaultEditorFont) {
      const ed = /** @type {HTMLElement|null} */ ($("#editor"));
      if (ed) ed.style.fontFamily = prefs.defaultEditorFont;
      const fontSel = /** @type {HTMLSelectElement|null} */ ($("#tb-font"));
      if (fontSel) {
        for (const opt of Array.from(fontSel.options)) {
          if (opt.value === prefs.defaultEditorFont) { fontSel.value = opt.value; break; }
        }
      }
    }

    // 4) Aplica placeholders inicial + liga header/botões
    DocJurEditor.applyPlaceholders();
    DocJurEditor.updateStats();
    bindGlobalActions();

    // 5) Se houver último doc aberto, pergunta se continua
    DocJurIO.promptRestoreLastDoc();

    // 6) Inicializa ícones novamente (para recém-renderizados)
    if (window.lucide) window.lucide.createIcons();

    // 7) Expose para debug / integração futura (IA, API)
    window.DocJur = Object.freeze({
      STATE,
      Utils: DocJurUtils,
      Store: DocJurStore,
      Templates: DocJurTemplates,
      UI: DocJurUI,
      Editor: DocJurEditor,
      IO: DocJurIO,
      applyTheme,
      /** Hooks / slots para integração de IA (futuro). */
      Hooks: {
        /** @type {Array<(prompt:string)=>Promise<string>>} */
        beforeAiCall: [],
        /** @type {Array<(resp:string,ctx:unknown)=>void>} */
        afterAiCall: []
      }
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
