/* ================================================================
   DocJur — assets/js/io.js
   Importação (DOCX, PDF) e exportação (DOCX via MS-Word HTML, PDF).
   Depende de CDNs globais: mammoth, pdfjsLib, html2pdf.
   Depende de DocJurUtils, DocJurStore, DocJurUI, DocJurEditor.
   ================================================================ */
/* global DocJurUtils, DocJurStore, DocJurUI, DocJurEditor, mammoth, pdfjsLib, html2pdf */
/** @typedef {{ docTitle: string, currentDocId: string|null, templateId: string|null, zoomLevel: number, colorMode: "foreColor"|"backColor"|"highlight"|"hiliteColor", editorLocked: boolean }} IoAppState */
const DocJurIO = (() => {
  const { $, fileToArrayBuffer, downloadBlob, escHtml } = DocJurUtils;

  /** @type {IoAppState|null} */
  let STATE = null;

  // ================================================================
  //                    DOCX / PDF UPLOAD
  // ================================================================

  function initImportHandlers() {
    const zone = /** @type {HTMLElement|null} */ ($("#upload-zone"));
    const input = /** @type {HTMLInputElement|null} */ ($("#file-input"));
    const btnImport = /** @type {HTMLElement|null} */ ($("#btn-import"));

    const trigger = () => input?.click();
    zone?.addEventListener("click", trigger);
    btnImport?.addEventListener("click", trigger);

    zone?.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("drag");
    });
    zone?.addEventListener("dragleave", () => zone.classList.remove("drag"));
    zone?.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag");
      const file = /** @type {DragEvent} */ (e).dataTransfer?.files?.[0];
      if (file) handleFile(file);
    });
    input?.addEventListener("change", (e) => {
      const f = /** @type {HTMLInputElement} */ (e.target).files?.[0];
      if (f) handleFile(f);
    });
  }

  /** @param {File} file */
  async function handleFile(file) {
    const name = file.name.toLowerCase();
    try {
      if (name.endsWith(".docx") || name.endsWith(".doc")) {
        DocJurUI.toast("Lendo DOCX...", "info");
        const buf = await fileToArrayBuffer(file);
        // @ts-ignore mammoth é global via CDN
        const res = await mammoth.convertToHtml({ arrayBuffer: buf });
        const editor = DocJurEditor.editorEl;
        if (editor)
          editor.innerHTML = `<div class="imported-docx">${res.value}</div>`;
        if (STATE) STATE.docTitle = file.name.replace(/\.[^.]+$/, "");
        const title = /** @type {HTMLElement|null} */ ($("#editor-title"));
        if (title && STATE) title.textContent = STATE.docTitle;
        DocJurEditor.applyPlaceholders();
        DocJurEditor.updateStats();
        DocJurUI.toast(`DOCX importado com sucesso: ${file.name}`, "success");
        if (res.messages && res.messages.length)
          console.warn("[mammoth]", res.messages);
      } else if (name.endsWith(".pdf")) {
        DocJurUI.toast("Lendo PDF (extraindo texto)...", "info");
        // @ts-ignore
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const buf = await fileToArrayBuffer(file);
        // @ts-ignore
        const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
        let html = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const parts = [];
          for (const it of /** @type {any[]} */ (content.items))
            parts.push(it.str || "");
          html += `<p style="text-align:justify;margin-bottom:8pt;">${escHtml(parts.join(" "))}</p>`;
          if (i < pdf.numPages)
            html += `<div style="page-break-after:always;"></div>`;
        }
        const editor = DocJurEditor.editorEl;
        if (editor) editor.innerHTML = html;
        if (STATE) STATE.docTitle = file.name.replace(/\.pdf$/i, "");
        const title = /** @type {HTMLElement|null} */ ($("#editor-title"));
        if (title && STATE) title.textContent = STATE.docTitle;
        DocJurEditor.applyPlaceholders();
        DocJurEditor.updateStats();
        DocJurUI.toast(`PDF importado: ${pdf.numPages} páginas`, "success");
      } else {
        DocJurUI.toast("Formato não suportado. Use .docx ou .pdf", "error");
      }
    } catch (err) {
      console.error("[DocJurIO.handleFile]", err);
      DocJurUI.toast(
        `Erro ao importar: ${/** @type {any} */ (err).message || err}`,
        "error",
      );
    }
  }

  // ================================================================
  //                       EXPORT PDF
  // ================================================================

  function exportPDF() {
    const editor = DocJurEditor.editorEl;
    if (!editor) return;
    DocJurUI.toast("Gerando PDF...", "info");
    const fileName = `${(STATE?.docTitle || "documento").replace(/[^\w\-]+/g, "_")}.pdf`;
    const opt = {
      margin: 0,
      filename: fileName,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "cm", format: "a4", orientation: "portrait" },
    };
    // @ts-ignore html2pdf global via CDN
    html2pdf()
      .from(editor)
      .set(opt)
      .save()
      .then(() => DocJurUI.toast("PDF gerado com sucesso!", "success"))
      .catch(
        /** @param {any} err */ (err) => {
          console.error(err);
          DocJurUI.toast("Erro ao gerar PDF", "error");
        },
      );
  }

  // ================================================================
  //              EXPORT .DOC (MS-WORD compatível via HTML)
  // ================================================================

  function exportDOCX() {
    DocJurUI.toast("Montando DOC (Word)...", "info");
    const editor = DocJurEditor.editorEl;
    const content = editor?.innerHTML || "";
    const title = STATE?.docTitle || "documento";

    const styles = `
      body { font-family:"Times New Roman",Georgia,serif; font-size:12pt; line-height:1.5; }
      h1 { font-size:18pt; text-align:center; }
      h2 { font-size:14pt; text-align:center; }
      h3 { font-size:13pt; }
    `;
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<title>${escHtml(title)}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>${styles}</style>
</head>
<body style="padding:2.5cm 2.5cm;">${content}</body></html>`;

    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const fname = `${title.replace(/[^\w\-]+/g, "_")}.doc`;
    downloadBlob(blob, fname);
    DocJurUI.toast("Download do DOC iniciado", "success");
  }

  // ================================================================
  //          SAVE / LOAD / DELETE DOCS via localStorage
  // ================================================================

  /**
   * Salva ou atualiza documento.
   * @param {boolean} forceAsNew
   */
  function saveCurrentDoc(forceAsNew = false) {
    const editor = DocJurEditor.editorEl;
    if (!editor || !STATE) return;
    const suggested =
      STATE.docTitle && STATE.docTitle !== "Documento sem título"
        ? STATE.docTitle
        : "";
    const msg = forceAsNew
      ? "Salvar como (novo documento no histórico):"
      : "Nome do documento:";
    const title = prompt(msg, suggested);
    if (title === null) return;
    STATE.docTitle = title.trim() || "Documento sem título";
    const titleEl = /** @type {HTMLElement|null} */ ($("#editor-title"));
    if (titleEl) titleEl.textContent = STATE.docTitle;

    const idToUpdate = forceAsNew ? null : STATE.currentDocId;
    const now = new Date().toISOString();
    // Detecta template ativo (se há algum tpl-item.active no menu) — salva no histórico como referência
    const activeTpl = /** @type {HTMLElement|null} */ (
      document.querySelector(".tpl-item.active")
    );
    const templateId =
      (activeTpl && activeTpl.dataset && activeTpl.dataset.tpl) ||
      STATE.templateId ||
      null;
    if (templateId) STATE.templateId = templateId;

    const { id, doc } = DocJurStore.upsertDoc(
      idToUpdate || null,
      STATE.docTitle,
      editor.innerHTML,
    );
    // Garante que templateId seja salvo na entidade (upsertDoc não sabe o template, então atualizamos)
    if (templateId && doc.templateId !== templateId) {
      DocJurStore.driver.update("documents", id, { templateId });
    }
    STATE.currentDocId = id;
    const verb = forceAsNew ? "novo salvo" : "salvo";
    DocJurUI.toast(`Documento ${verb}: "${doc.title}"`, "success");
  }

  /** Abre modal de listagem e delega load/delete para Store + Editor */
  function openDocBrowser() {
    DocJurUI.renderDocList((evt) => {
      const btn = /** @type {HTMLButtonElement} */ (evt.currentTarget);
      const id = btn.dataset.id || "";
      const act = btn.dataset.act || "";
      if (act === "load") loadDocById(id);
      else if (act === "del") {
        if (confirm("Excluir este documento?")) {
          DocJurStore.deleteDoc(id);
          DocJurUI.toast("Documento excluído", "success");
          DocJurUI.renderDocList(/* re-render*/ undefined);
        }
      }
    });
  }

  /**
   * Carrega documento do Store no editor.
   * @param {string} id
   */
  function loadDocById(id) {
    const docs = /** @type {Record<string, any>} */ (DocJurStore.loadAllDocs());
    const d = docs[id];
    if (!d || !STATE) return;
    STATE.currentDocId = id;
    STATE.docTitle = d.title;
    const titleEl = /** @type {HTMLElement|null} */ ($("#editor-title"));
    if (titleEl) titleEl.textContent = d.title;
    const dt = /** @type {HTMLInputElement|null} */ ($("#doc_titulo"));
    if (dt) dt.value = (d.data && d.data.DOC_TITULO) || d.title;
    const ed = DocJurEditor.editorEl;
    if (ed) ed.innerHTML = d.content;
    if (d.data) DocJurStore.loadData(d.data);
    DocJurStore.rememberDoc(id);
    DocJurUI.closeModal("modal-open");
    DocJurEditor.applyPlaceholders();
    DocJurEditor.updateStats();
    DocJurUI.toast(`Aberto: "${d.title}"`, "success");
  }

  /** Na inicialização, pergunta se quer continuar do último doc salvo. */
  function promptRestoreLastDoc() {
    const id = DocJurStore.lastDocId();
    if (!id || !STATE) return false;
    const allDocs = /** @type {Record<string, any>} */ (
      DocJurStore.loadAllDocs()
    );
    const doc = allDocs[id];
    if (!doc) return false;
    if (!confirm(`Continuar trabalhando em "${doc.title}"?`)) return false;
    loadDocById(id);
    return true;
  }

  /** @param {IoAppState} state */
  function init(state) {
    STATE = state;
    initImportHandlers();
  }

  return {
    init,
    saveCurrentDoc,
    openDocBrowser,
    loadDocById,
    promptRestoreLastDoc,
    exportPDF,
    exportDOCX,
  };
})();

/** @type {any} */ (window).DocJurIO = DocJurIO;
