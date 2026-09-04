# Refatoração DocJur — Templates Lazy-Load por Arquivo HTML Individual

## Repository Research

### Situação ATUAL (problema)
Arquivo monolítico [assets/js/templates.js](file:///C:/Users/Henrique%20da%20Cruz/source/repos/DocJur/assets/js/templates.js):
- **2928 linhas / ~1.58 MB** de arquivo JS
- Contém 207 templates HTML HARDCODED inline dentro de `const TEMPLATES = { "tjdft-X-Y": \`...10KB de HTML...\`, ...}`
- Cada template ocupa em média **~7.6 KB** de JS
- Hoje o projeto tem **~1110 modelos ADV+TJDFT** (580+330=910 ADV + 200 TJDFT)
- **Se todos os 1110+ forem inseridos inline no TEMPLATES{}**: templates.js vai chegar **~8.4 MB**
- **Projeção para 5.000 modelos** (milhares que o usuário mencionou): **~38 MB** de arquivo JS — INVIÁVEL.
  - Carregamento inicial demorado no navegador (pior UX, TTI alto)
  - Check de sintaxe / GetDiagnostics TypeScript LENTÍSSIMO (megabytes de string para parsear)
  - Merge conflitos impossíveis (2 arquivos editam o mesmo templates.js enorme)
  - Runtime memory bloat (todo HTML de 5000 petições em memória quando o usuário SÓ USA 1 por vez)

### Como templates.js é consumido HOJE (analisado via grep nos 6 módulos)
Pontos de acesso **confirmados**:

| Arquivo / Linha | Consumo | Requer HTML real? |
|---|---|---|
| [templates.js:L2909-L2911](file:///C:/Users/Henrique%20da%20Cruz/source/repos/DocJur/assets/js/templates.js#L2909-L2911) — `getHtml(id)` | `return TEMPLATES[id] \|\| skeletonFor(id)` | **SIM** — retorna string HTML |
| [editor.js:L78](file:///C:/Users/Henrique%20da%20Cruz/source/repos/DocJur/assets/js/editor.js#L78) — dentro de `loadTemplate(id)` L64 | `refs.editor.innerHTML = DocJurTemplates.getHtml(id)` | **SIM** — só ocorre 1x por clique do usuário (seleciona modelo no menu direito Modelos). Caminho quente = carregar 1 HTML. |
| [ui.js:L96-L98](file:///C:/Users/Henrique%20da%20Cruz/source/repos/DocJur/assets/js/ui.js#L96-L98) | `hasRealHtml = !!Tpl.TEMPLATES[tpl.id]` | **NÃO!** Apenas **booleano**: tem HTML implementado? Serve só para mostrar checkmark ✅ verde na UI do menu. Não lê NENHUM caractere de conteúdo HTML. |

**Conclusão arquitetural dourada**: 99.9% do volume do `TEMPLATES{}` (HTML string) **nunca é acessado** em um uso típico. Usuário baixa MBs de string HTML que nunca vai usar. O acesso real ao HTML é **1 clique → 1 arquivo**.

---

## Solução Proposta

**Lazy-Load assíncrono com arquivos HTML individuais + manifesto leve de IDs.**

Conceito:
- Extrair todo HTML de `TEMPLATES[id]` → **arquivo individual** `assets/templates/${id}.html` (ex: `assets/templates/tjdft-1-1.html`)
- Criar **manifesto leve** `assets/templates/manifest.json` = apenas `{ implemented: ["tjdft-1-1", "tjdft-1-2", ...] }` (sem HTML, só lista de ids). 1000 ids ≈ 10KB.
- Em `templates.js`, remover o objeto gigante `TEMPLATES = { ... 1.4MB ... }` e substituí-lo por:
  1. `TEMPLATES` → objeto minúsculo `{ "tjdft-1-1": true, ... }` — **apenas markers truthy** (boolean flag), para manter `!!Tpl.TEMPLATES[id]` do ui.js funcionando sem mudança.
  2. Cache LRU `HTML_CACHE = new Map<string,string>()` (últimos 50 templates clicados para não re-baixar se reabrir)
  3. `init()` → `fetch(manifest.json)` em boot para popular `TEMPLATES[id] = true`
  4. **Nova função async `getHtmlAsync(id)`** → `fetch(assets/templates/${id}.html)`, salva no cache, retorna HTML.
  5. `getHtml(id)` síncrona (mantida para retrocompatibilidade) → retorna cache se existir, senão `skeletonFor(id)` fallback.
- Em `editor.js:L64-L80`, transformar `loadTemplate(id)` em `async function loadTemplate(id)`: trocar `= DocJurTemplates.getHtml(id)` por `= await DocJurTemplates.getHtmlAsync(id)`. Adicionar estado loading temporário (skeleton + spinner opcional) enquanto baixa.

### Ganhos / Impacto
- **Primeiro load (Initial Download):** templates.js de 1.58MB → **~180KB** (só PH_LABELS, CATEGORIES[], helpers). **Redução ~89% no tamanho inicial**.
- **Escalar para 1000 modelos**: templates.js continua **~200KB**. Manifesto ~10KB. 0 impacto inicial.
- **Escalar para 5000 modelos**: templates.js continua **~300KB**. Manifesto ~50KB.
- **Arquitetura modular**: Cada novo modelo ADV é um `.html` novo em `assets/templates/`. Merge fácil, arquivos pequenos, edição independente.
- **Editores / ferramentas** abrem HTML individual de 7KB em 1 clique — muito mais ágil que abrir 38MB.

---

## Files and Modules

1. **`assets/js/templates.js`** — MODIFICAÇÃO PRINCIPAL
   - Remover o `const TEMPLATES = { ... }` com 1.4MB de template literals.
   - Adicionar constantes de URL: `TEMPLATES_DIR = "assets/templates/"`, `MANIFEST_URL`.
   - Adicionar `IMPLEMENTED` (Record<string, true>) = cache leve boolean (para ui.js `!!TEMPLATES[id]`).
   - Adicionar `HTML_CACHE: Map<string, string>` LRU (cap 50).
   - Nova `async function init() → Promise<void>`: fetch manifest, popula IMPLEMENTED.
   - Nova `async function getHtmlAsync(id) → Promise<string>`: busca cache → fetch arquivo → popula cache → retorna HTML.
   - Função síncrona `getHtml(id)` mantida → `HTML_CACHE.get(id) || skeletonFor(id)`.
   - `TEMPLATES` exposto via return deixa de ser string → agora é IMPLEMENTED (truthy marker).
   - `DEFAULT_HTML`, `skeletonFor()`, `CATEGORIES`, `PH_LABELS`, `templateTitle/Meta` mantidos SEM MUDANÇA.
   - Exportar `init` + `getHtmlAsync` no return global e no `window.DocJurTemplates`.

2. **`assets/js/editor.js`** — MODIFICAÇÃO PEQUENA (2 linhas)
   - L64: `function loadTemplate(id)` → virar `async function loadTemplate(id)`.
   - L78: `refs.editor.innerHTML = DocJurTemplates.getHtml(id)` → trocar por `refs.editor.innerHTML = await DocJurTemplates.getHtmlAsync(id)`.
   - Opcional entre L77-L78: mostrar texto `"Carregando modelo..."` ou spinner no editor enquanto await resolve (1 linha).
   - `applyPlaceholders()` / `updateStats()` depois continuam iguais.

3. **`assets/js/app.js`** — MODIFICAÇÃO MÍNIMA (1 init)
   - No bootstrap `init()` principal (hoje a ordem é Utils → Store → Templates → UI → Editor → Io → App), adicionar: no **início do boot do app**, chamar `await DocJurTemplates.init();` **antes** de renderizar a UI do menu de templates (para o ui.js poder checar `TEMPLATES[id]` correto na renderização inicial da lista Modelos).
   - Se init() falhar (ex: `file://` sem servidor web), fallback = IMPLEMENTED vazio + mostrar skeleton genérico ao invés de crash.

4. **`assets/js/ui.js`** — **NENHUMA ALTERAÇÃO** (🎉 zero)
   - `!!Tpl.TEMPLATES[tpl.id]` continua funcionando igual, pois `TEMPLATES` exposto é objeto truthy marker (`id: true`).

5. **`assets/js/io.js`, `assets/js/store.js`, `assets/js/utils.js`** — **NENHUMA ALTERAÇÃO** (nenhum acesso direto a TEMPLATES HTML; io.js exporta via `refs.editor.innerHTML` direto).

6. **`assets/templates/manifest.json`** — NOVO ARQUIVO (gerado automaticamente)
   - Estrutura: `{ "formatVersion": 1, "generatedAt": "2026-09-04", "implemented": ["tjdft-1-1", "tjdft-1-2", ... ] }`

7. **`assets/templates/<id>.html`** — ~207 NOVOS ARQUIVOS HTML INDIVIDUAIS (extraídos do TEMPLATES{} atual)
   - Ex: `assets/templates/tjdft-1-1.html` = exatamente o HTML da string literal `"tjdft-1-1"` de hoje.
   - UTF-8, sem BOM, sem wrapping `<script>` etc, só o fragmento HTML que vai pro `innerHTML`.

8. **`extract-templates-2-files.mjs`** — SCRIPT TEMPORÁRIO (deletado depois do commit final)
   - Lê `assets/js/templates.js` via `fs.readFileSync`, usa **2 REGEX** para extrair:
     1. Bloco `const TEMPLATES = { ... };` inteiro.
     2. Dentro do bloco, matches `"id-aqui": \`\` ` + conteúdo HTML + fechamento backtick.
   - Para cada entrada encontrada:
     - Escreve `assets/templates/<id>.html`
     - Adiciona id no array do manifest.json
   - Valida no final: quantidade `.html` = quantidade entradas TEMPLATES originais (207).
   - **Não altera templates.js ainda** (extração é read-only; o edit de templates.js é passo 2 manual/posterior).

9. **Verificações / Não inclusão**: `package.json`, `tsconfig.json`, `documentos-juridicos.html`, `index.html`, `tpl-checklist.html` — **ZERO mudanças**. Ordem de `<script>` continua exatamente a mesma.

---

## Implementation Steps (ordem estrita, dependências claras)

### Etapa 1 — Extração segura (SÓ LEITURA, sem quebrar nada)
1. Criar pasta `assets/templates/` caso não exista.
2. Criar script temporário `extract-templates-2-files.mjs`:
   - Ler templates.js.
   - Regex extrair todas as entradas `"id": \`conteudo\`` do bloco TEMPLATES.
   - Para cada id encontrado → escrever `assets/templates/<id>.html` (conteúdo = valor string literal, backticks removidos).
   - Gerar `assets/templates/manifest.json` com a lista ordenada dos ids.
3. Rodar script, validar contagem: `ls assets/templates/*.html | wc -l === 207`.
4. Apagar script temporário `.mjs`.

### Etapa 2 — Editar templates.js (substituir bloco TEMPLATES por lazy)
5. Abrir templates.js, **localizar e APAGAR TODO** o bloco `const TEMPLATES = { ... 1.4MB ... };` (linhas ~1800 até ~2845 onde começa HELPERS de lookup).
6. Inserir no lugar:
   - `const TEMPLATES_DIR = "assets/templates/";`
   - `const MANIFEST_URL = TEMPLATES_DIR + "manifest.json";`
   - `/** @type {Record<string, true>} */ const IMPLEMENTED = {};`
   - `/** @type {Map<string, string>} */ const HTML_CACHE = new Map(); const CACHE_CAP = 50;`
   - `async function fetchManifestImpl() { /* fetch, parse, popula IMPLEMENTED[id] = true */ }`
   - `let initPromise = null; function init() { if(!initPromise) initPromise = fetchManifestImpl(); return initPromise; }`
   - `async function getHtmlAsync(id) { /* cache check → fetch → cache set LRU evict → return */ }`
   - **Compatibilidade UI**: Para export, manter `const TEMPLATES = IMPLEMENTED;` (ui.js `!!Tpl.TEMPLATES[id]` = `!!true` = true, igual antes).
   - Atualizar função `getHtml(id)` síncrona → `return HTML_CACHE.get(id) || skeletonFor(id)`.
   - No `return` final do IIFE, adicionar novas exports: `init, getHtmlAsync` (mantém todas as antigas CATEGORIES/TEMPLATES/PH_LABELS/phLabel/templateTitle/templateMeta/getHtml/skeletonFor/DEFAULT_HTML; só substitui o que TEMPLATES aponta).

### Etapa 3 — Ajustar editor.js (loadTemplate → async + await getHtmlAsync)
7. Em [editor.js:L64-L80](file:///C:/Users/Henrique%20da%20Cruz/source/repos/DocJur/assets/js/editor.js#L64-L80):
   - `function loadTemplate(id)` → **`async function loadTemplate(id)`**.
   - Substituir L78: entre L77 (`if (refs.title) refs.title.textContent = title;`) e L78 (`if (refs.editor) refs.editor.innerHTML = DocJurTemplates.getHtml(id);`), inserir loading:
     - `if (refs.editor) refs.editor.innerHTML = '<p style="color:var(--text-muted)">Carregando modelo... aguarde.</p>';`
     - Depois `if (refs.editor) refs.editor.innerHTML = await DocJurTemplates.getHtmlAsync(id);`
8. Procurar **todos os callers de `loadTemplate`** dentro de editor.js/app.js/ui.js (ex: `DocJurEditor.loadTemplate("tjdft-1-1")`) — trocar para `await DocJurEditor.loadTemplate(...)` se houver. Se callers são event listeners (click do menu), async function listener é válido em DOM e funciona automaticamente.

### Etapa 4 — Ajustar app.js (boot chama init do Templates antes de render UI)
9. Localizar função `init()` principal do DocJurApp em [assets/js/app.js](file:///C:/Users/Henrique%20da%20Cruz/source/repos/DocJur/assets/js/app.js) (o bootstrap). Adicionar chamada **síncrona (não await bloqueante)** no início do boot:
   - `DocJurTemplates.init().catch(err => console.warn("[DocJur] templates manifest não carregado (file://?); usando skeleton fallback:", err));`
   - Porque a UI de lista Modelos roda logo depois; o manifesto baixa em paralelo. Se `IMPLEMENTED` ainda não carregou quando ui.js renderizar pela primeira vez, os itens caem em `implemented: true` via `realTpl` helper de qualquer forma (já hardcoded no objeto item). Manifesto é só para confiança extra. Tudo funciona mesmo com init ainda pendente.

### Etapa 5 — Validação
10. **Checagem de sintaxe**: `node --check assets/js/templates.js` → exit 0. Rodar para `editor.js`, `app.js` também.
11. **GetDiagnostics** nos 3 arquivos: 0 erros TS severity 8.
12. **Contagem arquivos**: 207 arquivos `.html` em `assets/templates/`.
13. **Teste funcional manual (navegador via vite server — fetch precisa de http://)**: Abrir `documentos-juridicos.html`, clicar em 5 templates aleatórios de categorias diferentes. Validar:
    - HTML do template carrega (mesmo resultado de antes da refatoração, mesmo placeholders).
    - Checkmark verde aparece em templates implementados (ui.js intacto).
    - Reabrir o mesmo template → não faz novo fetch, vem do cache.
14. **Fallback válido**: Simular 404 de arquivo (ex: renomear 1 html temporariamente) → cai em `skeletonFor(id)` esqueleto genérico, NÃO crasha o app.
15. **Tamanho final pós-refatoração**: `ls -lh assets/js/templates.js` → comparar tamanho com 1.58MB original. Esperado <200KB.

---

## Dependencies and Considerations

- **`fetch()` precisa de servidor web, não funciona via `file:///` diretamente (CORS / same-origin no protocolo file).**
  - Mitigação / fallback: Projeto **já depende de Vite / servidor** hoje no dev (package.json tem `"vite": "^5.4.0"`, scripts `npm run dev`). Rodar `npm run dev` já servidoriza tudo OK.
  - Se usuário quiser abrir HTML offline sem servidor: `skeletonFor(id)` sempre retorna esqueleto válido, templates continuam funcionando (só vem genéricos). Ou podemos embedar os **10 mais usados** direto no templates.js (~100KB extra) se quiser file:// 100% funcional. Decisão do usuário.
- **Backward compatibility**: `getHtml(id)` síncrona continua existindo para qualquer caller acidental.
- **Vulnerabilidades npm**: Plano não toca em `package.json`, não instala/remove nada. As 4 vulnerabilidades existentes do `docx` permanecem — não é escopo deste plano.
- **Novos templates ADV (910 em AdvogadoGerados/)**: ainda não estão no TEMPLATES / manifesto / arquivos HTML — este plano só move os **207 TJDFT já implementados hoje** FS → arquivos individuais para ganhar escala. Depois, para inserir ADV é trivial: gerar `advogado-001.html` em `assets/templates/`, adicionar id no manifest, adicionar item em `CATEGORIES[]` via `realTpl(id, name, icon)`. Templates.js não cresce.
- **Regra de tipagem TS do projeto**: typedefs têm nome canônico por módulo. Novos typedefs no templates.js devem usar prefixo `Tpl`: `TplManifestFormat`, `TplImplementedMap`. Já existe o prefixo `TplDocTemplateCategory` e `TplTemplateItem` — segue convenção.

---

## Validation Checklist (pré-aprovação plano)

1. ✅ `node --check` para templates.js, editor.js, app.js.
2. ✅ GetDiagnostics (TypeScript checkJs allowJs) → 0 erros nos 7 módulos.
3. ✅ 207 arquivos HTML individuais extraídos.
4. ✅ manifest.json tem os mesmos 207 ids.
5. ✅ `assets/js/templates.js` tamanho final < 200KB.
6. ✅ Ao clicar em um template aleatório no menu Modelos → HTML aparece igual (mesmo conteúdo pre-refatoração), placeholders substituem.
7. ✅ ui.js checkmark continua aparecendo para os 207.
8. ✅ Se fetch de 1 template falhar (404/rede caiu) → fallback skeleton, não crash.

---

## Risks

- **Risco 1 (Médio)**: Regex de extração falhar em 1-2 templates (HTML contém backtick escapado).
  - **Handling**: Validar no script de extração: iterar lista dos 207 ids **conhecidos via grep realTpl/pendingTpl no CATEGORIES[]** e garantir que todos tem HTML correspondente. Falhas individuais → inserir manualmente HTML via `skeletonFor` placeholder para aqueles 1-2.
- **Risco 2 (Baixo)**: Ordem de init no app faz ui.js render ANTES manifesto chegar, mostrando checkmark errado por 50ms.
  - **Handling**: Hoje os itens já vêm com `implemented: true` hardcoded no helper `realTpl()` em [templates.js:L134-L140](file:///C:/Users/Henrique%20da%20Cruz/source/repos/DocJur/assets/js/templates.js#L134-L140). Então checkmark verde é duplamente garantido (pelos dois mecanismos). Zero problema UX.
- **Risco 3 (Alto, mas evitável)**: Apagar bloco TEMPLATES errado e quebrar IIFE / perder vírgula / syntax error.
  - **Handling**: Antes de apagar, marcar linha exata inicial `^const TEMPLATES = {` e linha exata final `^};` do TEMPLATES com grep, e validar com `node --check` **imediatamente após substituição**. Se falhar → revert bloco de memória e ajusta.
- **Risco 4 (Baixo)**: Windows path `/` vs `\` ao ler `assets/templates/${id}.html`.
  - **Handling**: Fetch em URLs sempre usa forward slash `/` (RFC 3986). Funciona no navegador (protocolo HTTP), independe do separador do FS do Windows.
- **Risco 5 (Médio)**: Cache LRU pode crescer se usuário abrir +50 templates em 1 sessão longa.
  - **Handling**: Cap 50, evict oldest por ordem de inserção do Map.

---

## Resultado Esperado Após Aprovação & Execução
- `templates.js` **nunca mais cresce** por causa de volume de HTML.
- **Adicionar 1000 ADV = 1000 arquivos HTML novos + manifesto + items no CATEGORIES[]** (não 8MB no único arquivo).
- Build/dev muito mais rápidos, merges fáceis.
- Projeto pronto para crescer até **milhares de templates** sem preocupação de arquivo monolítico.
