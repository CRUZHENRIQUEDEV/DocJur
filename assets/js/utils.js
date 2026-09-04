/* ================================================================
   DocJur — assets/js/utils.js
   Funções puras utilitárias e tipos JSDoc.
   Módulo puro — não toca DOM. Ideal para unit tests e TS.
   ================================================================ */
/* eslint-disable no-unused-vars */
// ---- Tipos (TypeScript-ready via JSDoc) ----
/**
 * @typedef {Object} PhData  — Dicionário de placeholder => valor (ambos string)
 * @property {string} [k]  — ex: { ADV_NOME: "Dr. Fulano", CLI_DOC: "000.000.000-00" }
 *
 * @typedef {Object} DocTemplate
 * @property {string} id       — identificador único (ex: "peticao-inicial")
 * @property {string} name     — nome amigável (UI)
 * @property {string} icon     — nome de ícone Lucide
 * @property {string} html     — string HTML com placeholders `{{CHAVE}}`
 *
 * @typedef {Object} DocTemplateCategory
 * @property {string} id          — ex: "judiciais"
 * @property {string} name        — nome da categoria
 * @property {string} icon        — ícone Lucide
 * @property {DocTemplate[]} items
 *
 * @typedef {Object} SavedDoc
 * @property {string} id            — ex: doc_1710000000000
 * @property {string} title
 * @property {string} createdAt     — ISO string
 * @property {string} updatedAt     — ISO string
 * @property {string} content       — innerHTML do editor
 * @property {PhData} data          — dados dos campos do formulário
 *
 * @typedef {Object} AppState
 * @property {string} docTitle
 * @property {string | null} currentDocId
 * @property {number} zoomLevel
 * @property {"foreColor"|"hiliteColor"} colorMode
 * @property {boolean} editorLocked
 */

const DocJurUtils = (() => {
  const MESES = [
    "janeiro","fevereiro","março","abril","maio","junho",
    "julho","agosto","setembro","outubro","novembro","dezembro"
  ];

  /**
   * querySelector curto (fins de legibilidade / similar a $ do jQuery)
   * @template {Element} T
   * @param {string} sel
   * @param {ParentNode} [root=document]
   * @returns {T | null}
   */
  const $ = (sel, root = document) => /** @type {T|null} */ (root.querySelector(sel));

  /**
   * querySelectorAll -> array
   * @template {Element} T
   * @param {string} sel
   * @param {ParentNode} [root=document]
   * @returns {T[]}
   */
  const $$ = (sel, root = document) =>
    Array.from(root.querySelectorAll(sel));

  /**
   * HTML-escape para evitar XSS ao injetar valores de usuário no editor
   * @param {unknown} s
   * @returns {string}
   */
  function escHtml(s) {
    const str = (s == null ? "" : String(s));
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Converte data ISO ("2026-01-31") -> "31 de janeiro de 2026"
   * @param {string} dateStr
   * @returns {string}
   */
  function formatDateBR(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`;
  }

  /**
   * Data de hoje em formato ISO (para <input type="date">)
   * @returns {string}
   */
  function currentDateBR() {
    const h = new Date();
    return `${h.getFullYear()}-${String(h.getMonth() + 1).padStart(2, "0")}-${String(h.getDate()).padStart(2, "0")}`;
  }

  /**
   * Conta palavras e caracteres a partir de texto plano
   * @param {string} txt
   * @returns {{ words:number, chars:number, charsNoSpace:number }}
   */
  function countText(txt) {
    const t = txt || "";
    return {
      words: t.trim() ? t.trim().split(/\s+/).length : 0,
      chars: t.length,
      charsNoSpace: t.replace(/\s+/g, "").length
    };
  }

  /**
   * Substitui placeholders {{CHAVE}} por valores de `data`, com classe de estilo.
   * Preserva spans já existentes (.ph) com o mesmo atributo data-ph.
   * @param {string} html
   * @param {PhData} data
   * @returns {{ html:string, filled:number, total:number }}
   */
  function replacePlaceholders(html, data) {
    let filled = 0;
    let total = 0;
    const d = data || /** @type {PhData} */ ({});

    const resolve = (/** @type {string} */ key) => {
      total++;
      const v = d[key];
      const ok = typeof v === "string" && v.trim() !== "";
      if (ok) filled++;
      const cls = ok ? "ph ph-filled" : "ph";
      const inner = ok ? escHtml(v) : `{{${key}}}`;
      return `<span class="${cls}" data-ph="${key}">${inner}</span>`;
    };

    // 1) Raw {{CHAVE}} (novos)
    let out = html.replace(/\{\{(\w+)\}\}/g, (_m, key) => resolve(key));

    // 2) Spans .ph existentes com chave em data-ph (refresh)
    out = out.replace(
      /<span class="ph(?: ph-filled)?" data-ph="(\w+)">([^<]+)<\/span>/g,
      (_m, key) => resolve(key)
    );

    return { html: out, filled, total };
  }

  /**
   * Gera ID único para documentos salvos
   * @returns {string}
   */
  const genDocId = () => `doc_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  /**
   * Formato brasileiro de data/hora a partir de ISO string (para listagem de docs)
   * @param {string} iso
   * @returns {string}
   */
  function fmtBRDateTime(iso) {
    try {
      return new Date(iso).toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
      });
    } catch { return iso; }
  }

  /**
   * Lê arquivo como ArrayBuffer (Promise wrapper)
   * @param {File} f
   * @returns {Promise<ArrayBuffer>}
   */
  function fileToArrayBuffer(f) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(/** @type {ArrayBuffer} */ (r.result));
      r.onerror = () => rej(r.error);
      r.readAsArrayBuffer(f);
    });
  }

  /**
   * Lê arquivo como texto (Promise wrapper)
   * @param {File} f
   * @returns {Promise<string>}
   */
  function fileToText(f) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onload = () => res(/** @type {string} */ (r.result));
      r.onerror = () => rej(r.error);
      r.readAsText(f, "utf-8");
    });
  }

  /**
   * Trigger de download navegador via blob
   * @param {Blob} blob
   * @param {string} filename
   */
  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  // Expose para outros módulos clássicos (script tag)
  return {
    $, $$, escHtml, formatDateBR, currentDateBR, countText,
    replacePlaceholders, genDocId, fmtBRDateTime,
    fileToArrayBuffer, fileToText, downloadBlob,
    MESES
  };
})();

// Export global para uso nos outros scripts (sem module bundler)
window.DocJurUtils = DocJurUtils;
