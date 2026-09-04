/* ================================================================
   DocJur — assets/js/ui.js
   Contém: toasts, tabs, modal abertura/fechamento, tree de
   templates, modal de placeholders, modal de cor, listagem de docs.
   Lida apenas com apresentação/padroes visuais — não toca em regras
   de negócio (ficam em Editor/IO/Store/Templates/Utils).
   ================================================================ */
/* global DocJurUtils, DocJurTemplates, DocJurEditor, DocJurStore */
const DocJurUI = (() => {
  const { $, $$, escHtml, fmtBRDateTime } = DocJurUtils;

  // ================================================================
  //                       TOASTS
  // ================================================================
  /**
   * Mostra notificação toast no canto inferior direito.
   * @param {string} msg
   * @param {"success"|"error"|"info"} [type="info"]
   */
  function toast(msg, type = "info") {
    const icon = type === "success" ? "check-circle" : type === "error" ? "x-circle" : "info";
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.innerHTML = `<i data-lucide="${icon}" style="width:14px;height:14px;"></i> <span>${escHtml(msg)}</span>`;
    const host = /** @type {HTMLElement|null} */ ($("#toasts"));
    host?.appendChild(el);
    if (window.lucide) window.lucide.createIcons();
    setTimeout(() => {
      el.style.transition = "opacity .3s";
      el.style.opacity = "0";
      setTimeout(() => el.remove(), 320);
    }, 3000);
  }

  // ================================================================
  //                       TABS
  // ================================================================
  function initTabs() {
    $$("#data-tabs .tab").forEach((t) => {
      const tab = /** @type {HTMLButtonElement} */ (t);
      tab.addEventListener("click", () => {
        $$("#data-tabs .tab").forEach((x) => x.classList.remove("active"));
        $$(".tab-content").forEach((x) => x.classList.remove("active"));
        tab.classList.add("active");
        const tc = /** @type {HTMLElement|null} */ (document.getElementById(tab.dataset.tab || ""));
        tc?.classList.add("active");
      });
    });
  }

  // ================================================================
  //                  TEMPLATE TREE (painel direito)
  // ================================================================
  /**
   * @param {string} [filter=""]
   */
  function renderTemplates(filter = "") {
    const tree = /** @type {HTMLElement|null} */ ($("#tpl-tree"));
    if (!tree) return;
    tree.innerHTML = "";
    const f = filter.trim().toLowerCase();
    DocJurTemplates.CATEGORIES.forEach((cat) => {
      const items = cat.items.filter((it) =>
        !f || it.name.toLowerCase().includes(f) || it.id.includes(f)
      );
      if (f && items.length === 0) return;

      const li = document.createElement("li");
      li.className = "cat-item";
      li.innerHTML = `
        <div class="cat-head">
          <i data-lucide="${escHtml(cat.icon)}"></i>
          <span>${escHtml(cat.name)}</span>
          <i data-lucide="chevron-down" class="chev" style="margin-left:auto;color:var(--text-muted);"></i>
        </div>
        <ul class="tpl-list"></ul>`;
      const ul = /** @type {HTMLElement} */ (li.querySelector(".tpl-list"));

      items.forEach((tpl) => {
        const tl = document.createElement("li");
        tl.className = "tpl-item";
        tl.dataset.tpl = tpl.id;
        tl.innerHTML = `<i data-lucide="${escHtml(tpl.icon)}"></i><span>${escHtml(tpl.name)}</span>`;
        tl.addEventListener("click", () => DocJurEditor.loadTemplate(tpl.id));
        ul.appendChild(tl);
      });

      const head = /** @type {HTMLElement} */ (li.querySelector(".cat-head"));
      head.addEventListener("click", (e) => {
        if (/** @type {HTMLElement} */ (e.target).closest(".tpl-item")) return;
        li.classList.toggle("collapsed");
      });

      tree.appendChild(li);
    });
    if (window.lucide) window.lucide.createIcons();
  }

  // ================================================================
  //                    MODAL ABERTURA / FECHAMENTO
  // ================================================================
  /** @param {string} modalId */
  function openModal(modalId) {
    $(`#${modalId}`)?.classList.add("open");
  }
  /** @param {string} modalId */
  function closeModal(modalId) {
    $(`#${modalId}`)?.classList.remove("open");
  }

  // ================================================================
  //                 MODAL DE DOCUMENTOS SALVOS
  // ================================================================
  /**
   * Renderiza lista de documentos salvos e abre modal.
   * @param {(e:MouseEvent)=>void} [itemActionHandler] — opcional, ligado aos botoes da li.
   */
  function renderDocList(itemActionHandler) {
    const list = /** @type {HTMLElement|null} */ ($("#doc-list"));
    if (!list) return;
    const docs = Object.values(DocJurStore.loadAllDocs())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    list.innerHTML = "";

    if (docs.length === 0) {
      list.innerHTML = `<li style="justify-content:center;color:var(--text-muted);padding:20px;">Nenhum documento salvo.</li>`;
    } else {
      docs.forEach((d) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <div>
            <div style="font-weight:600;">${escHtml(d.title)}</div>
            <div class="doc-meta">Atualizado em ${fmtBRDateTime(d.updatedAt)}</div>
          </div>
          <div class="doc-actions">
            <button class="btn btn-sm btn-primary" data-act="load" data-id="${escHtml(d.id)}" title="Abrir">
              <i data-lucide="folder-open"></i>
            </button>
            <button class="btn btn-sm btn-ghost" data-act="del" data-id="${escHtml(d.id)}" title="Excluir">
              <i data-lucide="trash-2"></i>
            </button>
          </div>`;
        list.appendChild(li);
      });
      if (itemActionHandler) {
        list.querySelectorAll("button").forEach((b) => b.addEventListener("click", itemActionHandler));
      }
    }
    if (window.lucide) window.lucide.createIcons();
    openModal("modal-open");
  }

  // ================================================================
  //                 MODAL DE PLACEHOLDERS
  // ================================================================
  function openPhModal() {
    openModal("modal-ph");
    const inp = /** @type {HTMLInputElement|null} */ ($("#ph-search"));
    if (inp) { inp.value = ""; setTimeout(() => inp.focus(), 60); }
    renderPhList();
  }
  function closePhModal() { closeModal("modal-ph"); }

  /** Popula lista de placeholders com base nos inputs com [data-ph] */
  function renderPhList() {
    const list = /** @type {HTMLElement|null} */ ($("#ph-list"));
    if (!list) return;
    const q = (/** @type {HTMLInputElement|null} */ ($("#ph-search"))?.value || "").trim().toLowerCase();
    const phs = $$("input[data-ph], select[data-ph], textarea[data-ph]").map((el) => {
      const htmlEl = /** @type {HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement} */ (el);
      const labelEl = htmlEl.closest(".form-row")?.querySelector("label");
      return {
        key: htmlEl.dataset.ph || "",
        label: labelEl?.textContent?.trim() || (htmlEl.dataset.ph || ""),
        value: htmlEl.value || ""
      };
    }).filter(p => p.key);

    const filtered = q
      ? phs.filter(p => p.key.toLowerCase().includes(q) || p.label.toLowerCase().includes(q))
      : phs;

    list.innerHTML = "";
    if (filtered.length === 0) {
      list.innerHTML = `<li style="justify-content:center;color:var(--text-muted);padding:20px;">Nenhum placeholder encontrado.</li>`;
      return;
    }
    filtered.forEach((p) => {
      const filled = p.value.trim() !== "";
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <div style="font-weight:600;">{{${escHtml(p.key)}}}</div>
          <div class="doc-meta">${escHtml(p.label)}${filled ? " · ✅ " + escHtml(p.value.slice(0, 40)) : ""}</div>
        </div>
        <button class="btn btn-sm btn-primary" data-key="${escHtml(p.key)}">Inserir</button>`;
      li.querySelector("button")?.addEventListener("click", () => {
        DocJurEditor.insertPhAtCursor(p.key);
      });
      list.appendChild(li);
    });
    if (window.lucide) window.lucide.createIcons();
  }

  // ================================================================
  //                 MODAL DE COR
  // ================================================================
  /** @type {(color:string) => void} */
  let _colorCallback = (_c) => {};

  /**
   * @param {string} title
   * @param {(color:string)=>void} onPick
   */
  function openColorPicker(title, onPick) {
    const t = /** @type {HTMLElement|null} */ ($("#color-title"));
    if (t) t.textContent = title;
    _colorCallback = onPick;
    openModal("modal-color");
  }
  function closeColorPicker() { closeModal("modal-color"); }

  // ================================================================
  //                       INIT
  // ================================================================
  function init() {
    // Fechamento de modais via botões X / cancel / backdrop
    const modalIds = ["modal-open", "modal-ph", "modal-color"];
    modalIds.forEach((id) => {
      const root = /** @type {HTMLElement|null} */ ($(`#${id}`));
      if (!root) return;
      root.addEventListener("click", (e) => {
        if (e.target === root) closeModal(id);
      });
    });
    $("#btn-close-open")?.addEventListener("click", () => closeModal("modal-open"));
    $("#btn-cancel-open")?.addEventListener("click", () => closeModal("modal-open"));
    $("#btn-close-ph")?.addEventListener("click", closePhModal);
    $("#btn-close-color")?.addEventListener("click", closeColorPicker);

    // Botões do painel direito: pesquisar template
    $("#btn-search-tpl")?.addEventListener("click", () => {
      const q = prompt("Buscar modelo por nome:");
      if (q !== null) renderTemplates(q);
    });

    initTabs();
    renderTemplates();
  }

  return {
    init, toast,
    renderTemplates,
    openModal, closeModal,
    renderDocList, openDocBrowser: () => { /* placeholder compat */ },
    openPhModal, closePhModal, renderPhList,
    openColorPicker, closeColorPicker
  };
})();

window.DocJurUI = DocJurUI;
