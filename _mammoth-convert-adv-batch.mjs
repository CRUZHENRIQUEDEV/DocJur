import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import mammoth from "mammoth";

const ROOT = process.cwd();
const ADV_CATALOG_JS = path.join(ROOT, "assets", "js", "adv-catalog.js");
const TEMPLATES_DIR = path.join(ROOT, "assets", "templates");
const SRC_ADV_DIR = path.join(ROOT, "Peticao", "AdvogadoGerados");

if (!fs.existsSync(ADV_CATALOG_JS)) {
  console.error("[ERRO] arquivo nao encontrado:", ADV_CATALOG_JS);
  process.exit(1);
}

// ---------------- Parse adv-catalog.js (IIFE browser) via Node VM ----------------
const advCatalogSource = fs.readFileSync(ADV_CATALOG_JS, "utf8");
const fakeWindow = {};
const sandbox = { window: fakeWindow };
vm.createContext(sandbox);
try {
  vm.runInContext(advCatalogSource, sandbox, { filename: "adv-catalog.vm.js" });
} catch (e) {
  console.error("[ERRO] nao consegui executar adv-catalog.js em VM:", String(e));
  process.exit(2);
}
/** @type {Array<[string,string,string,string]>} */
const CATALOG = Array.isArray(fakeWindow.DocJurAdvCatalog)
  ? fakeWindow.DocJurAdvCatalog
  : null;
if (!CATALOG || CATALOG.length === 0) {
  console.error("[ERRO] DocJurAdvCatalog vazio ou nao encontrado. length=", CATALOG && CATALOG.length);
  process.exit(3);
}
console.log(`[INFO] adv-catalog carregado: ${CATALOG.length} tuplas [id,name,icon,srcFile]`);

// ---------------- estatisticas ----------------
const stats = { total: CATALOG.length, ok: 0, fail: 0, naoEncontrado: 0, bytesGerados: 0, falhasDetalhadas: [] };

// ---------------- wrapper ADV (igual ao DEFAULT_HTML adv template para manter consistencia) ----------------
const ADV_WRAPPER_TOP = (titulo) => `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${titulo}</title><style>
body { font-family: 'Times New Roman', serif; line-height: 1.55; color: #111; background: #fff; padding: 40px 56px; max-width: 900px; margin: 0 auto; }
h1 { font-size: 22px; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 32px; font-weight: 700; }
h2 { font-size: 18px; margin: 24px 0 10px; font-weight: 700; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
h3 { font-size: 16px; margin: 20px 0 8px; font-weight: 700; }
p { margin: 0 0 14px; text-indent: 3em; text-align: justify; }
ul, ol { margin: 0 0 16px 3em; }
li { margin-bottom: 6px; }
table { border-collapse: collapse; margin: 16px 0; width: 100%; }
td, th { border: 1px solid #ddd; padding: 6px 10px; }
.docjur-sign-block { margin-top: 60px; border-top: 1.2px solid #333; width: 320px; margin-left: auto; margin-right: auto; padding-top: 10px; }
.docjur-sign-block p { text-indent: 0; text-align: center; margin-top: 8px; font-size: 13px; letter-spacing: 0.5px; }
</style></head><body>
<h1>{{DOC_TITULO}}</h1>
<p style="margin:0 0 18px;text-indent:3em;">O(a) Dr.(a) <b>{{ADV_NOME}}</b>, inscrito(a) na OAB/{{ADV_OAB_UF}} sob o nº {{ADV_OAB_NUM}}, neste ato de <b>{{NATUREZA_AÇÃO}}</b>, perante o Juízo competente da <b>{{FORO_VARA}}</b>, Comarca de <b>{{COMARCA}}</b>, {{UF}} — DF — por seu advogado abaixo assinado, vem, respeitosamente, à presença de Vossa Excelência, apresentar a presente:</p>
`;

const ADV_WRAPPER_BOTTOM = () => `
<p style="margin:28px 0 10px;text-indent:3em;">Nestes termos, pede deferimento.</p>
<p style="text-align:right;margin-top:40px;"><b>{{CIDADE_DATA_EXTENSO}}</b></p>
<div class="docjur-sign-block">
<p><b>{{ADV_NOME}}</b><br/>OAB/{{ADV_OAB_UF}} {{ADV_OAB_NUM}}</p>
</div>
</body></html>
`;

const bar = (cur, total) => {
  const w = 40;
  const p = Math.min(1, Math.max(0, cur / total));
  const filled = Math.round(w * p);
  return "[" + "#".repeat(filled) + "-".repeat(w - filled) + "] " + cur + "/" + total + " " + (p * 100).toFixed(1) + "%";
};

// ---------------- iterar cada tupla do catalog ----------------
for (let i = 0; i < CATALOG.length; i++) {
  const t = CATALOG[i];
  const [id, name, , srcFile] = t;
  if (!id || !srcFile) {
    stats.fail++;
    stats.falhasDetalhadas.push({ id: String(id), srcFile, motivo: "tupla invalida (id ou srcFile ausente)" });
    continue;
  }
  const docxPath = path.join(SRC_ADV_DIR, srcFile.replace(/\//g, path.sep).replace(/\\/g, path.sep));
  const outHtmlPath = path.join(TEMPLATES_DIR, `${id}.html`);

  if (!fs.existsSync(docxPath)) {
    stats.fail++;
    stats.naoEncontrado++;
    stats.falhasDetalhadas.push({ id, srcFile, docxPath, motivo: "ARQUIVO DOCX NAO ENCONTRADO" });
    process.stdout.write("\r" + bar(i + 1, stats.total) + ` FALTA docx id=${id}      `);
    continue;
  }

  try {
    const buf = fs.readFileSync(docxPath);
    const res = await mammoth.convertToHtml({ buffer: buf });
    const innerHtml = (res && res.value && typeof res.value === "string") ? res.value.trim() : "";
    if (!innerHtml) {
      stats.fail++;
      stats.falhasDetalhadas.push({ id, srcFile, motivo: "mammoth retornou html vazio" });
      process.stdout.write("\r" + bar(i + 1, stats.total) + ` VAZIO id=${id}      `);
      continue;
    }
    const titulo = (name || id).replace(/"/g, "&quot;");
    const finalHtml = ADV_WRAPPER_TOP(titulo) + "\n" + innerHtml + "\n" + ADV_WRAPPER_BOTTOM();
    fs.writeFileSync(outHtmlPath, finalHtml, "utf8");
    stats.bytesGerados += Buffer.byteLength(finalHtml, "utf8");
    stats.ok++;
  } catch (err) {
    stats.fail++;
    stats.falhasDetalhadas.push({ id, srcFile, motivo: String(err && err.message ? err.message : err).slice(0, 200) });
  }

  if ((i + 1) % 20 === 0 || i + 1 === stats.total) {
    process.stdout.write("\r" + bar(i + 1, stats.total) + " OK=" + stats.ok + " FALHAS=" + stats.fail + "        ");
  }
}

process.stdout.write("\n");
console.log("\n========== RESULTADO MAMMOTH ADV BATCH ==========");
console.log("total tuplas catalog  =", stats.total);
console.log("convertidos com SUCESSO =", stats.ok);
console.log("falhas =", stats.fail);
console.log(" · arquivos docx faltando =", stats.naoEncontrado);
console.log("KB gerados total =", (stats.bytesGerados / 1024).toFixed(2));
console.log("KB medio por template =", (stats.bytesGerados / 1024 / Math.max(1, stats.ok)).toFixed(2));

if (stats.fail > 0) {
  const logFailPath = path.join(ROOT, "_mammoth-adv-failures.json");
  fs.writeFileSync(logFailPath, JSON.stringify(stats.falhasDetalhadas, null, 2), "utf8");
  console.log("log de falhas em:", logFailPath);
}
console.log("\nConcluido.");
