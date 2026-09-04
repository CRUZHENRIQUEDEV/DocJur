import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import mammoth from "mammoth";
import JSZip from "jszip";

const ROOT = process.cwd();
const ADV_CATALOG_JS = path.join(ROOT, "assets", "js", "adv-catalog.js");
const TEMPLATES_DIR = path.join(ROOT, "assets", "templates");
const SRC_ADV_DIR = path.join(ROOT, "Peticao", "AdvogadoGerados");

// ---------- 1. Load ADV catalog (910 tuplas) ----------
const advCatalogSource = fs.readFileSync(ADV_CATALOG_JS, "utf8");
const fakeWindow = {};
const sandbox = { window: fakeWindow };
vm.createContext(sandbox);
vm.runInContext(advCatalogSource, sandbox, { filename: "adv-catalog.vm.js" });
const ALL_CATALOG = fakeWindow.DocJurAdvCatalog;
if (!Array.isArray(ALL_CATALOG) || ALL_CATALOG.length === 0) {
  console.error("[ERRO] catalogo invalido");
  process.exit(1);
}

// ---------- 2. Decidir alvo: APENAS adv-*.html <=5KB (esqueletos restantes). ----------
const ALL_ENTRIES_BY_ID = new Map(
  ALL_CATALOG.map((t) => [String(t[0] || ""), t]),
);
/** @type {Array<{id:string, srcFile:string}>} */
const targetList = [];
for (const f of fs.readdirSync(TEMPLATES_DIR)) {
  if (!f.startsWith("adv-") || !f.endsWith(".html")) continue;
  const abs = path.join(TEMPLATES_DIR, f);
  const sz = fs.statSync(abs).size;
  if (sz <= 5000) {
    const id = f.slice(0, -5);
    const entry = ALL_ENTRIES_BY_ID.get(id);
    if (entry) targetList.push({ id, srcFile: String(entry[3] || "") });
  }
}
console.log(
  `[INFO] alvos = adv-*.html <=5KB que ainda existem no catalog: ${targetList.length}`,
);

// ---------- 3. Helpers match normalizado ----------
const realDirEntries = fs
  .readdirSync(SRC_ADV_DIR)
  .filter((n) => n.toLowerCase().endsWith(".docx"))
  .map((n) => {
    const norm = n.normalize("NFKD").replace(/\s+/g, " ").trim().toLowerCase();
    return { orig: n, norm };
  });
const resolveSrcFile = (srcFile) => {
  const direct = path.join(
    SRC_ADV_DIR,
    String(srcFile || "")
      .replace(/\//g, path.sep)
      .replace(/\\/g, path.sep),
  );
  if (fs.existsSync(direct)) return direct;
  const normQ = String(srcFile || "")
    .normalize("NFKD")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  const match = realDirEntries.find((e) => e.norm === normQ);
  if (match) return path.join(SRC_ADV_DIR, match.orig);
  // fallback: includes (mais generico - apenas se unico)
  const incl = realDirEntries.filter(
    (e) => e.norm.includes(normQ) || normQ.includes(e.norm),
  );
  if (incl.length === 1) return path.join(SRC_ADV_DIR, incl[0].orig);
  return null;
};

// ---------- 4. Sanitize DOCX: abrir zip, escapar QUALQUER < invalido em texto (nao tags xml verdadeiras) ----------
/**
 * @param {Buffer} docxBuffer
 * @returns {Promise<Buffer>} novo docx buffer com caracter < em TEXTO (nao tag valida) escapados p xmldom nao crashar
 */
async function sanitizeDocxXml(docxBuffer) {
  const zip = await JSZip.loadAsync(docxBuffer);
  const xmlNames = Object.keys(zip.files).filter(
    (k) => /\.xml$/i.test(k) && !zip.files[k].dir,
  );
  /**
   * < invalido = NAO eh tag xml verdadeira. Tag xml verdadeira apos < comeca com:
   *   · ?xml  |  !--  |  ![  |  !DOCTYPE  (diretivas)
   *   · /[A-Za-z_:] (fechamento tag valida)
   *   · [A-Za-z_:] (abertura tag valida com nome comecando por letra/_/:)
   * Qualquer outro < = invalido placeholder em texto → &lt;
   */
  const LT_INVALIDO = /<(?![A-Za-z_:]|\?xml|!--|!\[|!DOCTYPE|\/[A-Za-z_:])/g;
  const GT_INVALIDO_FECHAMENTO = /<\/(?![A-Za-z_:])/g;
  for (const name of xmlNames) {
    let text = await zip.file(name).async("string");
    let mudou = false;
    if (LT_INVALIDO.test(text)) {
      LT_INVALIDO.lastIndex = 0;
      text = text.replace(LT_INVALIDO, () => {
        mudou = true;
        return "&lt;";
      });
    }
    if (GT_INVALIDO_FECHAMENTO.test(text)) {
      GT_INVALIDO_FECHAMENTO.lastIndex = 0;
      text = text.replace(GT_INVALIDO_FECHAMENTO, () => {
        mudou = true;
        return "&lt;/";
      });
    }
    if (mudou) zip.file(name, text);
  }
  return await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
  });
}

// ---------- 5. Wrapper HTML ADV (mesmo do primeiro batch) ----------
const ADV_WRAPPER_TOP = (
  titulo,
) => `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${titulo}</title><style>
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

// ---------- 6. Main loop ----------
const stats = {
  total: targetList.length,
  ok: 0,
  failNotFound: 0,
  failParse: 0,
  bytesGerados: 0,
  novasFalhas: [],
};
const bar = (cur, tot, ok, f1, f2) => {
  const w = 40;
  const p = Math.min(1, Math.max(0, cur / tot));
  const filled = Math.round(w * p);
  return (
    "[" +
    "#".repeat(filled) +
    "-".repeat(w - filled) +
    "] " +
    cur +
    "/" +
    tot +
    " (" +
    (p * 100).toFixed(1) +
    "%) OK=" +
    ok +
    " NF=" +
    f1 +
    " XP=" +
    f2
  );
};

for (let i = 0; i < targetList.length; i++) {
  const t = targetList[i];
  const catEntry = ALL_CATALOG.find((x) => x && x[0] === t.id);
  const name = (catEntry && catEntry[1]) || t.id;
  let docxPath = resolveSrcFile(t.srcFile);
  if (!docxPath) {
    stats.failNotFound++;
    stats.novasFalhas.push({
      id: t.id,
      srcFile: t.srcFile,
      motivo: "NAO ENCONTRADO pos-match normalizado (ainda)",
    });
    process.stdout.write(
      "\r" +
        bar(i + 1, stats.total, stats.ok, stats.failNotFound, stats.failParse) +
        `     `,
    );
    continue;
  }
  try {
    let buf = fs.readFileSync(docxPath);
    let htmlInner;
    try {
      const res = await mammoth.convertToHtml({ buffer: buf });
      htmlInner =
        res && res.value && typeof res.value === "string"
          ? res.value.trim()
          : "";
      if (!htmlInner) throw new Error("vazio");
    } catch (_err1) {
      // TENTAR A SANITIZACAO ZIP CORRIGINDO placeholders <DIGITE
      try {
        const buf2 = await sanitizeDocxXml(buf);
        const res2 = await mammoth.convertToHtml({ buffer: buf2 });
        htmlInner =
          res2 && res2.value && typeof res2.value === "string"
            ? res2.value.trim()
            : "";
        if (!htmlInner) throw new Error("vazio-pos-sanitize");
      } catch (err2) {
        throw err2;
      }
    }
    const titulo = String(name || t.id).replace(/"/g, "&quot;");
    const finalHtml =
      ADV_WRAPPER_TOP(titulo) + "\n" + htmlInner + "\n" + ADV_WRAPPER_BOTTOM();
    const outPath = path.join(TEMPLATES_DIR, t.id + ".html");
    fs.writeFileSync(outPath, finalHtml, "utf8");
    stats.bytesGerados += Buffer.byteLength(finalHtml, "utf8");
    stats.ok++;
  } catch (e) {
    stats.failParse++;
    stats.novasFalhas.push({
      id: t.id,
      srcFile: t.srcFile,
      motivo: String(e && e.message ? e.message : e).slice(0, 200),
    });
  }
  if ((i + 1) % 20 === 0 || i + 1 === stats.total) {
    process.stdout.write(
      "\r" +
        bar(i + 1, stats.total, stats.ok, stats.failNotFound, stats.failParse) +
        "        ",
    );
  }
}

process.stdout.write("\n\n========== RESULTADO RE-RUN FIXES ==========\n");
console.log("total alvos      =", stats.total);
console.log("convertidos OK   =", stats.ok);
console.log("nao encontrados  =", stats.failNotFound);
console.log("parse fail AINDA =", stats.failParse);
console.log("KB gerados       =", (stats.bytesGerados / 1024).toFixed(2));

const logNewFailPath = path.join(ROOT, "_mammoth-adv-failures-v2.json");
if (stats.novasFalhas.length) {
  fs.writeFileSync(
    logNewFailPath,
    JSON.stringify(stats.novasFalhas, null, 2),
    "utf8",
  );
  console.log("falhas restantes =", logNewFailPath);
} else {
  console.log("ZERO falhas restantes! \\o/");
  try {
    fs.unlinkSync(logNewFailPath);
  } catch {}
}
console.log("Fim.");
