# DocJur

> **Automação de Documentos Jurídicos Brasileiros** · Interface densa em 3 painéis · Editor A4 WYSIWYG · 186 modelos base reais em DOCX/PDF · Storage extensível (LocalStorage hoje, SQLite/Supabase amanhã) · Zero build — abre no navegador com duplo clique.

---

## ⚠️ PRINCÍPIO FUNDAMENTAL — TUDO GIRA EM TORNO DA PASTA `Peticao/`

> **Os arquivos `.docx` e `.pdf` dentro de [`Peticao/`](./Peticao/) são SEMPRE os textos-base oficiais do projeto.**
>
> Todo o restante do código serve apenas para: (1) ler esses arquivos DOCX/PDF, (2) exibir eles no editor A4, (3) automatizar a substituição de dados dos advogados/clientes/réus/processos nos placeholders `{{VAR}}`, e (4) exportar o resultado final de volta para DOCX ou PDF.
>
> **Regra de ouro**: Se você precisa alterar o *conteúdo jurídico* de uma petição/contrato/procuração — **NÃO mexa no código**. Abra, edite e salve diretamente o arquivo `.docx` correspondente dentro de [`Peticao/`](./Peticao/). Essa pasta é *a única fonte da verdade (single source of truth)* para todos os textos jurídicos.

---

## 📋 Sumário

1. [📚 Documentos Base — Catálogo Completo da Pasta `Peticao/`](#1--documentos-base--catálogo-completo-da-pasta-peticao)
2. [📂 Estrutura de Pastas](#2--estrutura-de-pastas)
3. [🚀 Como Rodar Localmente (zero build)](#3--como-rodar-localmente--zero-build)
4. [🖥️ Interface do Aplicativo — 3 Painéis Densos](#4--interface-do-aplicativo----3-painéis-densos)
5. [💾 Storage Extensível (Interface `StorageDriver`)](#5--storage-extensível--interface-storagedriver)
6. [🔖 Sistema de Placeholders `{{VAR}}`](#6--sistema-de-placeholders-var)
7. [🎨 Tema Claro / Escuro / Sistema](#7--tema-claro---escuro---sistema)
8. [🛠️ Tecnologias Usadas](#8--tecnologias-usadas)
9. [📈 Roadmap — Migração Futura para Vite + TypeScript](#9--roadmap----migração-futura-para-vite---typescript)
10. [➕ Como Adicionar Novos Modelos DOCX](#10--como-adicionar-novos-modelos-docx)
11. [❓ FAQ / Troubleshooting](#11--faq---troubleshooting)
12. [📦 Git & Deploy — Subir para o GitHub](#12--git---deploy----subir-para-o-github)

---

## 1. 📚 Documentos Base — Catálogo Completo da Pasta `Peticao/`

Pasta oficial: [`Peticao/`](./Peticao/)

### 1.1 Totais

| Tipo | Quantidade |
|---|---|
| Arquivos `.docx` (modelos base editáveis) | **181** |
| Arquivos `.pdf` (orientações de fluxo processual) | **5** |
| **Total de documentos base** | **186** |

### 1.2 Convenção de Nomenclatura

Todo arquivo em `Peticao/` segue o padrão:

```
{GRUPO}.{SUB-GRUPO}.{SUB-SUB}  TÍTULO DO DOCUMENTO - variação.docx
```

Exemplos:
```
11.10 Locação de imóvel – Locatário x Imobiliária – imóvel sem condições habitáveis – rescisão e indenização.docx
11.10.1 Locação de imóvel – Locatário x locador (PF) – imóvel sem condições habitáveis – rescisão e indenização.docx
```

- Grupos principais: **1 a 20** (número inteiro)
- Sub-grupos: `.1, .2, .3 ...` (ex. `17.4`, `9.5`, `20.12`)
- Sub-sub-grupos (variação dentro do mesmo tema): `.1, .2` (ex. `11.10.1` = PF, `11.10` = Imobiliária; `19.04.1` = Réu PJ; `20.12.0` = GDF, `20.12.1` = DETRAN apenas)
- Sufixo `*_ORIENTAÇÕES.pdf`: manual de fluxo processual de cada área (não são modelos para editar).
- `Peticao.docx`: modelo simplificado avulso de petição (esqueleto rápido, sem categoria numérica).

### 1.3 Catálogo por Categoria (20 grupos + 5 manuais PDF + 1 modelo avulso)

| # | Categoria | Qtd | Exemplos de modelos mais usados |
|---|---|---|---|
| **1** | **Petição Inicial** (Geral PF / PJ / GDF) | 3 | 1.1 Geral PF, 1.2 Geral PJ, 1.3 Juizado Fazenda DF |
| **2** | **Acidente de Trânsito** | 4 | 2.1 1x1, 2.2 1x2, 2.3 2x1, 2.4 2x2 |
| **3** | **Banco / Cartão de Crédito** | 16 | 3.01 Repetição Indébito, 3.02 Cheque Clonado, 3.05 Transações Clandestinas, 3.10 Falso Empréstimo Consignado, 3.12 Falsa Portabilidade, 3.13 Boleto Falso, 3.15 Cartão Sem Solicitação |
| **4** | **Cobrança** (Mercadoria / Serviço / Dinheiro / Aluguel) | 8 | 4.1 Mercadoria, 4.2 Serviço PF/PJ, 4.3 Dinheiro, 4.4 Aluguel Locatário/Fiador/Ambos |
| **5** | **Compra e Venda** (CDC) | 9 | 5.1 Produto Não Entregue, 5.2 Produto Defeituoso, 5.3 Acidente Consumo, 5.4 Comércio Eletrônico, 5.5 Site Falso |
| **6** | **Vizinhança / Condomínio** | 10 | 6.1 Barulho, 6.3 Ataque Canino, 6.4 Obra Nova, 6.5 Infiltração, 6.6 Furto Bicicleta, 6.7 Multa Indevida |
| **7** | **Despejo** | 1 | 7.1 Despejo para uso próprio |
| **8** | **Ensino** | 2 | 8.3 Contrato Rescindido Autor, 8.4 Rescindido Réu |
| **9** | **Execução Extrajudicial** (Títulos / Contratos) | 10 | 9.1 Cheque, 9.2 Nota Promissória, 9.3 Duplicata, 9.4 Contrato Locação (3 variações), 9.5 Contrato com 2 testemunhas (3 variações) |
| **10** | **Execução** (Sentença Judicial) | 3 | 10.1 Pagar Quantia Certa, 10.2 Obrigação de Fazer, 10.3 Ambos |
| **11** | **Locação de Imóvel** (variantes) | ⭐ **23** | 11.1 Cobrança Aluguel, 11.2 Execução Extrajudicial, 11.3 Quebra Contrato Adm, 11.4/11.5 Rescisão Antecipada (indenização), 11.6 Caução, 11.7 Aluguel Antecipado, 11.8 Vistoria Pendente, 11.9 Cobrança Vexatória, 11.10/11.11 Imóvel Inabitável (Locatário x Imobiliária x Locador PF) |
| **12** | **Negativação Indevida** (SERASA / SPC) | 6 | 12.1 Dívida Paga, 12.2 Sem Notificação Prévia, 12.3 Fraude, 12.4 Reconhecimento Judicial, 12.5 Cheque Antecipado, 12.6 Dívida Não Reconhecida |
| **13** | **Turismo / Seguro Viagem** | 5 | 13.1 Seguro Não Cobre, 13.2 Rescisão Autor, 13.3 Falha Serviço |
| **14** | **Plano de Saúde** | 4 | 14.1 Portabilidade Mesma Operadora, 14.2 Portabilidade Outra, 14.3 Cancelamento Indevido, 14.4 Negativa Cobertura |
| **15** | **Prestação de Serviço / Motorista App** | 6 | 15.1/15.2 Serviço Não Executado PF/PJ, 15.5 Descredenciamento Motorista App, 15.6 Golpe Falsa Agência Veículo |
| **16** | **Telefonia** | 7 | 16.1 Cobranças Indevidas Geral, 16.2 Faturas Pagas, 16.3 Faturas Não Pagas, 16.4 Rescisão Não Efetivada, 16.6 Serviço Não Solicitado, 16.7 Bloqueio Indevido |
| **17** | **Transporte Aéreo** | 10 | 17.1 Atraso Voo, 17.2 Cancelamento COVID, 17.3 Cancelamento Operadora, 17.4 Dano Mala, 17.5 Desistência Consumidor, 17.6 Extravio Bagagem, 17.7 No-Show, 17.8 Overbooking, 17.9 Violação Objetos |
| **18** | **Transporte Rodoviário** | 6 | 18.1 Pane Ônibus, 18.2 Atraso Embarque, 18.3 Dano Mala, 18.4 Extravio, 18.5 Overbooking, 18.6 Violação Objetos |
| **19** | **Veículo** (Compra e Venda / Estacionamento / Seguro) | 19 | 19.01 Dano Intencional, 19.02/19.03 Furto Estacionamento (objetos x veículo irrecuperável), 19.04.x Vício Oculto (PF/PJ), 19.05 Transferência com Débitos, 19.07/19.08 Venda com Ágio + Débitos (pagos/não pagos), 19.09.x Defeito Grave, 19.10 Débitos Anteriores, 19.11.x Documentação Pendente (PF/PJ), 19.12/19.13 Seguro — não cobrem conserto, 19.14 Falta de Pagamento, 19.15 Zero Km — Garantia Recusada |
| **20** | **Fazenda / GDF** (Juizados Fazendários · Poder Público) | ⭐ **28** | 20.01/20.02 Exercícios Financeiros Findos (servidor ativo/inativo), 20.03 Reconhecimento de Gratificação, 20.04 Medicamento não Fornecido (Ressarcimento), 20.05–20.08 Saúde Tutela Urgência (Cirurgia/Exame/Medicamento/Tratamento), 20.09/20.10 Buraco na Pista (DER/NOVACAP) — Ressarcimento, 20.11/20.12.x Baixa Registro / Negativa Propriedade (débitos IPVA) DETRAN/GDF, 20.13–20.18 Nulidade Multa (DER/DETRAN isolado/ambos) c/ s/ Notificação, 20.19 Baixa Registro Veículo DETRAN, 20.20 Clonagem de Placa — Nulidade Multa, 20.21–20.23 Transferência Pontuação CNH (DER + DETRAN, cada órgão separado, ambos) |
| — | **Orientações PDF + Modelo Avulso** (6 arquivos — 5 manuais + 1 DOCX) | 6 | 5 manuais de fluxo: `AçãoCONSUMIDOR_ORIENTAÇÕES.pdf`, `CobrançaDívida_ORIENTAÇÕES.pdf`, `DespejoUsoPróprio_ORIENTAÇÕES.pdf`, `ExecuçãoExtrajudicial_ORIENTAÇÕES.pdf`, `JuizadosFazendários_ORIENTAÇÕES.pdf` · 1 DOCX avulso: `Peticao.docx` (esqueleto rápido de petição) |

### 1.4 Como Usar Um Documento Base Dentro do App

1. Abra o DocJur (`documentos-juridicos.html`).
2. Clique no botão **📤 Importar** no header, ou arraste qualquer `.docx` ou `.pdf` da pasta [`Peticao/`](./Peticao/) para a **área de upload** do painel direito.
3. O Mammoth.js converte o DOCX para HTML puro e injeta no editor A4 central; o PDF.js extrai o texto do PDF.
4. Preencha os 4 painéis de dados (Advogado, Cliente, Réu, Processo) no painel esquerdo.
5. Clique no botão **▶️ Aplicar dados** (canto sup. esq. do header de Dados) — todos placeholders `{{VAR}}` são substituídos automaticamente no editor.
6. Exporta para DOCX (botão amarelo) ou PDF (botão verde).

---

## 2. 📂 Estrutura de Pastas

```
DocJur/
├── Peticao/                          ← ⭐ FONTE DA VERDADE (186 arquivos — 181 DOCX + 5 PDFs de orientação)
│   ├── 1.x ... 20.x                ← 20 categorias jurídicas numeradas (1 a 19 direito privado, 20 Fazenda/GDF público)
│   ├── *_ORIENTAÇÕES.pdf            ← 5 manuais de fluxo processual (Consumidor, Cobrança, Despejo, Execução, Juizados Fazendários)
│   └── Peticao.docx                ← 1 modelo DOCX avulso (esqueleto simples de petição)
│
├── assets/
│   ├── css/
│   │   ├── global-theme.css          ← Design system: tokens --ui-* e --renderer-* (TUDO vem daqui — NENHUMA cor hardcoded em main.css)
│   │   └── main.css                  ← Componentes DocJur compostos exclusivamente com tokens do global-theme.css
│   └── js/
│       ├── utils.js                  ← Helpers puros ($, escHtml, formatDateBR, replacePlaceholders 2-pass, countText, genDocId)
│       ├── store.js                  ← Interface StorageDriver + LocalStorageDriver + 7 entidades normalizadas + migrateLegacy
│       ├── templates.js              ← Árvore de categorias + DEFAULT_HTML (template em branco) + 11 modelos HTML completos
│       ├── ui.js                     ← Tabs, toasts, modais, árvore de templates, color picker, placeholder picker
│       ├── editor.js                 ← Rich text contenteditable, toolbar, zoom, lock/unlock, stats, applyPlaceholders 2-pass
│       ├── io.js                     ← Mammoth DOCX→HTML, PDF.js getText, export blob DOCX, html2pdf A4, open/save doc browser
│       └── app.js                    ← Orquestrador boot: tema (primeiro!), UI, Editor, IO, restoreData, bindGlobals, zoom default
│
├── documentos-juridicos.html         ← ☝️ Ponto de entrada (duplo clique abre, sem build)
├── package.json                      ← Dependências Vite/TS e aliases @ para migração futura
├── tsconfig.json                     ← allowJs + checkJs + paths @ prontos
├── .gitignore                        ← node_modules, dist, env, IDE, temp, OS files, .crdownload
├── .gitattributes                    ← Binários DOCX/PDF pré-configurados p/ Git LFS (opcional)
└── README.md                         ← Este arquivo
```

---

## 3. 🚀 Como Rodar Localmente (zero build)

**Opção 1 — Mais simples, duplo clique:**

```
abra DocJur/documentos-juridicos.html com duplo clique no navegador
```

> ⚠️ Ressalva: Mammoth.js e PDF.js dependem de CORS via `file://` em alguns navegadores. Se a importação DOCX/PDF falhar, use a Opção 2.

**Opção 2 — Servidor HTTP local (recomendado):**

```bash
cd DocJur
python -m http.server 8080
# depois abre: http://localhost:8080/documentos-juridicos.html
```

ou com Node: `npx serve .`

### Requisitos mínimos
- Navegador moderno (Chrome 110+, Edge 110+, Firefox 109+)
- Nenhum `npm install` necessário para rodar a versão protótipo

---

## 4. 🖥️ Interface do Aplicativo — 3 Painéis Densos

Layout Excel/Sheets conforme preferência do projeto: fontes 11-13pt, paddings reduzidos.

### Painel Esquerdo — Dados do Documento (4 abas)

| Aba | Campos salvos automaticamente (debounce 1500ms) | Placeholders gerados |
|---|---|---|
| **Advogado** | Nome, OAB, CPF, Email, Telefone, Endereço Comercial, CEP/Cidade/UF, + Escritório (Razão Social/CNPJ/Fantasia) | `ADV_NOME, ADV_OAB, ADV_CPF, ADV_EMAIL, ADV_TEL, ADV_END, ADV_CEP, ADV_CIDADE, ADV_UF, ESC_*` |
| **Cliente / Autor** | Nome, Tipo (PF/PJ), CPF/CNPJ, RG/IE, Nacionalidade, Estado Civil, Profissão, Nascimento, Email, Telefone, Endereço, CEP/Cidade/UF | `CLI_NOME, CLI_TIPO, CLI_DOC, CLI_RG, CLI_NAC, CLI_EC, CLI_PROF, CLI_NASC, CLI_*` |
| **Réu / Requerido** | Mesmos campos do Cliente + Representante Legal + 3 campos genéricos extras | `REU_NOME, REU_TIPO, REU_DOC, REU_REP, REU_*, GEN_1, GEN_2, GEN_3` |
| **Processo** | Número Processo, Vara, Fórum, Comarca, UF, Assunto, Valor Causa, Data Fatos, Juiz, Instância, Cidade/UF doc, Data doc, Título | `PROC_NUM, PROC_VARA, PROC_FORUM, PROC_VALOR, DOC_CIDADE, DOC_UF, DOC_DATA, DOC_TITULO, ...` |

### Painel Central — Editor A4 WYSIWYG

- Folha A4 física: **21cm × 29.7cm** com **padding 2.5cm** (margens reais para impressão)
- Sempre fundo **branco** (mesmo no tema escuro — garante WYSIWYG de impressão)
- Toolbar completa: Fonte/tamanho, B/I/U/Tachado, Cores Fundo/Texto, 4 alinhamentos, Listas, Recuo, H1/H2/H3/Cita/Pre, HR/Link, Undo/Redo/Limpar, Inserir Placeholder, Quebra de Página
- Zoom **0.5x → 2x** (aplicado no wrapper, NUNCA na folha — evita transbordamento do conteúdo fora da área branca)
- Barra de status: `Palavras · Caracteres` · `Placeholders: X preenchidos / Y`

### Painel Direito — Modelos + Upload

- Área de upload drag-and-drop: arraste `.docx` ou `.pdf` da pasta `Peticao/` para aqui
- Árvore de 6 categorias (configuráveis em [`templates.js`](./assets/js/templates.js)):
  1. 📑 Documentos Judiciais (9 tipos)
  2. 📝 Contratos e Societários (8 tipos)
  3. ⚖️ Representação e Atendimento (5 tipos)
  4. ✉️ Notificações e Comunicações (3)
  5. 🔍 Consultoria e Pareceres (4)
  6. 🏡 Família e Sucessões (5)
- Clique em um modelo → carrega HTML pré-definido no editor

---

## 5. 💾 Storage Extensível (Interface `StorageDriver`)

Arquivo: [`store.js`](./assets/js/store.js)

Por que existe? Porque o protótipo hoje usa `localStorage`, mas amanhã vai para SQLite/Supabase/Postgres **SEM QUEBRAR NENHUM CÓDIGO CHAMADOR**.

### Interface `StorageDriver` (7 métodos)

```
get(entity, id)         → retorna 1 obj ou null
set(entity, id, data)  → grava/atualiza 1 obj
remove(entity, id)      → deleta 1 obj
list(entity)            → array de todos ids da entidade
all(entity)             → array de todos objetos completos
insert(entity, data)    → gera ID automático + created_at + retorna obj
update(entity, id, patch) → merge + updated_at automático
```

### Implementação atual: `LocalStorageDriver`

Chave: `docjur_{entidade}__{id}` — exemplo: `docjur_lawyers__abc123`

### 7 Entidades Normalizadas (FKs para futuro SQL)

| Entidade | Prefixo no storage | Campo ID | Relacionamentos |
|---|---|---|---|
| **lawyers** (Advogados) | `docjur_lawyers__` | `lawyerId` | referenciado em documents.lawyerId |
| **clients** (Clientes) | `docjur_clients__` | `clientId` | documents.clientId |
| **defendants** (Réus) | `docjur_defendants__` | `defendantId` | documents.defendantId |
| **documents** (Documentos salvos) | `docjur_documents__` | `docId` | FKs lawyerId, clientId, defendantId + conteúdo HTML, title, stats |
| **preferences** (Preferências do usuário) | `docjur_preferences__` | — (entidade singleton) | theme, zoomLevel, defaultEditorFont, autoSaveFormMs, confirmClearData |
| **lastRefs** (Último doc aberto) | `docjur_last_ref__` | — | último docId + data |
| **dataSnapshots** (Backups de formulário) | `docjur_snap__` | — | full snapshot JSON do form + timestamp |

### Como trocar de driver em runtime (exemplo futuro SQLite):

```js
// app.js — antes da inicialização
const sqliteDriver = new SqliteStorageDriver('/data/docjur.db');  // nova classe, mesma interface
DocJurStore.useDriver(sqliteDriver);  // dados são migrados AUTOMATICAMENTE do antigo p/ novo
DocJurApp.boot();
```

### Persistência dos Formulários

Débounce **1500ms** (configurável via `preferences.autoSaveFormMs`) — evita I/O excessivo do localStorage a cada tecla. Dados não são perdidos no F5.

### Migração Legada

Chave flag `docjur__migrated` no storage. Na primeira inicialização, qualquer dado em 3 chaves antigas (`docjur_data`, `docjur_docs`, `docjur_last_doc`) é automaticamente desmembrado nas 7 entidades novas. Roda **apenas 1 vez**.

---

## 6. 🔖 Sistema de Placeholders `{{VAR}}`

Arquivos: [`utils.js`](./assets/js/utils.js) (função `replacePlaceholders` 2-pass) · [`editor.js`](./assets/js/editor.js) (`applyPlaceholders`)

### Regras

1. Formato sempre **MAIÚSCULO** + underline: `{{PROC_VALOR}}`, `{{ADV_NOME}}` — **não** use espaços, hífens ou camelCase.
2. Renderização no editor:
   - Placeholder vazio → `<span class="ph">` (fundo amarelo `#fff7cc`, borda tracejada)
   - Placeholder preenchido → `<span class="ph-filled">` (fundo verde `#d3f9d8`)
3. **Impressão e PDF**: ambas classes `.ph` e `.ph-filled` são apagadas (fundo transparente, sem cores) para folha limpa.
4. 2-pass: primeiro converte bruto `{{X}}` em spans; depois atualiza o `textContent` dos spans existentes — evita recriar o DOM todo e perder cursor/selection no editor.

### Todos placeholders reconhecidos por padrão

```
ADV_NOME, ADV_OAB, ADV_CPF, ADV_EMAIL, ADV_TEL, ADV_END, ADV_CEP, ADV_CIDADE, ADV_UF,
ESC_RAZAO, ESC_CNPJ, ESC_FANT,

CLI_NOME, CLI_TIPO, CLI_DOC, CLI_RG, CLI_NAC, CLI_EC, CLI_PROF, CLI_NASC,
CLI_EMAIL, CLI_TEL, CLI_END, CLI_CEP, CLI_CIDADE, CLI_UF,

REU_NOME, REU_TIPO, REU_DOC, REU_RG, REU_NAC, REU_REP,
REU_EMAIL, REU_TEL, REU_END, REU_CEP, REU_CIDADE, REU_UF,

GEN_1, GEN_2, GEN_3,

PROC_NUM, PROC_VARA, PROC_FORUM, PROC_COMARCA, PROC_UF, PROC_ASSUNTO,
PROC_VALOR, PROC_DATA, PROC_JUIZ, PROC_INST,

DOC_CIDADE, DOC_UF, DOC_DATA, DOC_TITULO
```

Para adicionar novos: basta inserir `{{NOVO_CAMPO}}` no conteúdo do editor — o `replacePlaceholders` pega automaticamente desde que haja um input no form com `data-ph="NOVO_CAMPO"`.

---

## 7. 🎨 Tema Claro / Escuro / Sistema

3 estados: botão no header (ao lado de IA) alterna **claro → escuro → sistema → claro**.

- Folha A4 permanece **sempre branca** no modo escuro — para WYSIWYG fiel de impressão (não existe folha azul-marinho em fórum).
- Arquivos envolvidos:
  - [`global-theme.css`](./assets/css/global-theme.css) — 100% das tokens `--ui-*` e `--renderer-*` (light em `:root`, dark em `[data-theme="dark"]`)
  - [`main.css`](./assets/css/main.css) — **nenhuma cor hardcoded própria**. Tudo compõe com tokens do global-theme.css.
  - [`app.js`](./assets/js/app.js#L22-L68) — `applyTheme()` + `initTheme()` roda ANTES de qualquer UI (evita flash FOUT). Listener `matchMedia('prefers-color-scheme')` para modo "sistema" ao vivo.
- Persistência: salvo em `preferences.theme` (storage extensível).

---

## 8. 🛠️ Tecnologias Usadas

### Bibliotecas (4 CDNs externos — 0 node_modules hoje)

| Lib | URL de referência | Usada onde |
|---|---|---|
| **Lucide Icons** | `https://unpkg.com/lucide@latest/dist/umd/lucide.min.js` | Todos ícones UI (100% Lucide — regra do projeto) |
| **Mammoth.js 1.6.0** | `https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js` | [`io.js`](./assets/js/io.js) — converte DOCX base de `Peticao/` em HTML para o editor |
| **PDF.js 3.11.174** | Worker incluso | [`io.js`](./assets/js/io.js) — extrai texto de PDFs de orientação ou modelos PDF |
| **html2pdf.js 0.10.1** | jsPDF + html2canvas bundle | [`io.js`](./assets/js/io.js) — exporta o editor A4 diretamente p/ PDF real escala=2 alta qualidade |

### Frontend puro (sem framework hoje, projetado p/ migrar)

- HTML5 semântico, CSS3 em tokens (design system), ES6+ modules pattern (IIFEs com `window.DocJurXxx = (()=>{})()` — futura migração para `import` do Vite).
- Convenção: código em INGLÊS, comentários e UI em PORTUGUÊS.

---

## 9. 📈 Roadmap — Migração Futura para Vite + TypeScript

Arquivos preparados: [`package.json`](./package.json) · [`tsconfig.json`](./tsconfig.json)

### Passo 1 único — reordenar arquivos (feito 99%):

| Hoje (assets/js) | Depois Vite (src) | Alias TS |
|---|---|---|
| `utils.js` | `src/utils.ts` | `@utils/*` |
| `store.js` | `src/store/index.ts` + `drivers/*` | `@store/*` |
| `templates.js` | `src/templates/index.ts` | `@templates/*` |
| `ui.js` | `src/ui/index.ts` + modais/toasts/tabs | `@ui/*` |
| `editor.js` | `src/editor/index.ts` | `@editor/*` |
| `io.js` | `src/io/index.ts` | `@io/*` |
| `app.js` | `src/main.ts` (bootstrap) | `@app/*` |
| `documentos-juridicos.html` | `index.html` entry point do Vite | |

### Aliases de import já declarados em `tsconfig.json` paths:

```
@utils/*, @store/*, @templates/*, @ui/*, @editor/*, @io/*, @app/*
```

### Dependências reais em `package.json` (hoje via CDN, amanhã via npm):

```
lucide, mammoth, pdfjs-dist, html2pdf.js
```

### Strict TypeScript já ligado em `tsconfig.json`:
- `strict: true`, `allowJs: true`, `checkJs: true` (gradual migration, sem obrigar reescrever tudo de uma vez).
- JSDoc já existe em utils.js, store.js, editor.js, io.js para inferência automática de tipos em checkJs.

---

## 10. ➕ Como Adicionar Novos Modelos DOCX

### Fluxo correto (não altera código):

1. **Salva o novo `.docx` DENTRO da pasta [`Peticao/`](./Peticao/)**, seguindo convenção: `{NUM}.{SUB} NOME - variação.docx`
2. Abra o DocJur no navegador → botão **📤 Importar** ou arraste o arquivo.
3. O Mammoth.js converte automaticamente. Ajuste formatação fina (títulos, parágrafos) direto no editor se precisar.
4. Clique em **💾 Salvar** (header) → documento é gravado no storage como `documents` reutilizável.

### Fluxo "template permanente" (altera templates.js se quiser na árvore):

1. Abra o DOCX importado e ajustado → copie o innerHTML do editor.
2. Abra [`templates.js`](./assets/js/templates.js), no objeto `TEMPLATES = {}`, adicione uma chave com mesmo id da categoria e cole o HTML.
3. Na constante `CATEGORIES` do mesmo arquivo, incremente a lista com o nome da opção.
4. Salve → próximo F5 o modelo aparece no painel direito permanente.

---

## 11. ❓ FAQ / Troubleshooting

**P: Ao aplicar zoom em 150% o conteúdo transborda fora da folha branca A4?**
R: Esse bug foi corrigido na revisão 2026-09-04. O `scale()` agora é aplicado EXCLUSIVAMENTE no `#editor-wrap` (elemento pai), NUNCA diretamente em `.editor-page` (a folha). Se acontecer de novo: limpe cache e confira `editor.js` linha `setZoom`.

**P: Importação DOCX falhou com erro CORS em `file://`?**
R: Chrome bloqueia XHR em protocolos file:// em CDN. Suba o servidor local: `python -m http.server 8080` na pasta DocJur, e abre por `localhost`.

**P: O tema escuro deixou a folha A4 azul-marinho?**
R: Por design a folha SEMPRE fica branca no dark (variável `background:#fdfdfd` em `[data-theme="dark"] .editor-page`). Se não estiver branca: checar ordem dos CSS no HEAD — `global-theme.css` DEVE vir ANTES de `main.css`.

**P: Meus dados do form sumiram?**
R: Dados ficam em `localStorage` do navegador. Limpeza de cache/limpar dados do site apaga. Faça backup clicando em **💾 Salvar** (documents são gravados com HTML completo) ou use future `storage-backups/`.

**P: Botão IA está cinza/desabilitado?**
R: Esperado. IA vem em release seguinte (hooks `beforeAiCall()` / `afterAiCall()` preparados na arquitetura). Por enquanto silenciosamente indisponível — sem mensagem de erro.

---

## 12. 📦 Git & Deploy — Subir para o GitHub

### Estado atual do repo local:

```
On branch main · 4 commits · working tree clean
```

### Passos para subir pela primeira vez:

**Passo 1** — Crie o repositório VAZIO em [github.com/new](https://github.com/new)
- Nome: `DocJur`
- ⚠️ **NÃO** marque "Add README / Add .gitignore / Choose license" — já temos tudo localmente.

**Passo 2** — Copie a URL (HTTPS ou SSH):
```
https://github.com/SEU-USUARIO/DocJur.git
```

**Passo 3** — Terminal dentro da pasta DocJur:

```bash
git remote add origin https://github.com/SEU-USUARIO/DocJur.git
git push -u origin main
```

### Sobre Git LFS e binários (~10 MB de DOCX/PDF)

Arquivo [`.gitattributes`](./.gitattributes) PRÉ-CONFIGURA `*.docx` e `*.pdf` para `filter=lfs diff=lfs merge=lfs -text`.

**Se NÃO quiser usar LFS**: funciona normalmente também. Git guarda DOCX/PDF como binários comuns. LFS só ajuda se futuramente houver commits frequentes nesses arquivos (evita inchaco do repo). Para ativar LFS de fato:

```bash
git lfs install
git lfs track "*.docx" "*.pdf"   # já incluso em .gitattributes, mas esse comando garante
```

### Commit pattern do projeto (Conventional Commits em INGLÊS):

```
feat:    nova feature (ex: feat: import DOCX templates from Peticao folder)
fix:     bug fix (ex: fix: zoom scale overflow outside A4 white page)
chore:   tooling, boilerplate, gitignore, docs (ex: chore: initial commit, chore: update .gitignore)
refactor: refatoração sem mudar comportamento
docs:    mudanças apenas em README
```

---

**Fim do README.** Lembrete final: **se o que você precisa mudar é texto jurídico, mexe somente nos arquivos em [`Peticao/`](./Peticao/) — é lá que mora a fonte da verdade de todo o projeto.**
