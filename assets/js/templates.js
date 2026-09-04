/* ================================================================
   DocJur — assets/js/templates.js
   Catálogo de categorias, tipos de documento e templates HTML.
   Módulo puro — só exporta dados + funções de lookup.
   ================================================================ */
/* global DocJurUtils */
const DocJurTemplates = (() => {
  /** @type {import("./utils.js").DocTemplateCategory[]} */
  const CATEGORIES = [
    {
      id: "judiciais",
      icon: "scale",
      name: "📑 Documentos Judiciais",
      items: [
        {
          id: "peticao-inicial",
          name: "Petição Inicial",
          icon: "file-signature",
        },
        {
          id: "contestacao",
          name: "Contestação",
          icon: "message-square-reply",
        },
        { id: "replica", name: "Réplica", icon: "messages-square" },
        { id: "apelacao", name: "Recurso / Apelação", icon: "arrow-up-circle" },
        { id: "contra-razoes", name: "Contrarrazões", icon: "reply-all" },
        {
          id: "embargos-declaracao",
          name: "Embargos de Declaração",
          icon: "help-circle",
        },
        { id: "alegacoes-finais", name: "Alegações Finais", icon: "list-end" },
        {
          id: "peticao-juntada",
          name: "Petição de Juntada",
          icon: "paperclip",
        },
        {
          id: "cumprimento-sentenca",
          name: "Cumprimento de Sentença",
          icon: "gavel",
        },
      ],
    },
    {
      id: "contratos",
      icon: "handshake",
      name: "📝 Contratos e Societários",
      items: [
        {
          id: "contrato-servicos",
          name: "Contrato de Prestação de Serviços",
          icon: "briefcase",
        },
        {
          id: "contrato-compra-venda",
          name: "Contrato de Compra e Venda",
          icon: "shopping-cart",
        },
        { id: "contrato-locacao", name: "Contrato de Locação", icon: "home" },
        {
          id: "contrato-social",
          name: "Contrato Social / Estatuto",
          icon: "building-2",
        },
        {
          id: "acordo-socios",
          name: "Acordo de Sócios (Quotas)",
          icon: "users",
        },
        {
          id: "nda",
          name: "NDA — Termo de Confidencialidade",
          icon: "shield-check",
        },
        {
          id: "mou",
          name: "MOU — Memorando de Entendimento",
          icon: "file-text",
        },
        { id: "distrato", name: "Distrato (Rescisão)", icon: "file-x" },
      ],
    },
    {
      id: "representacao",
      icon: "user-check",
      name: "⚖️ Representação e Atendimento",
      items: [
        { id: "procuracao", name: "Procuração Ad Judicia", icon: "id-card" },
        { id: "substabelecimento", name: "Substabelecimento", icon: "share-2" },
        { id: "honorarios", name: "Contrato de Honorários", icon: "coins" },
        {
          id: "ficha-atendimento",
          name: "Ficha de Atendimento",
          icon: "clipboard-list",
        },
        {
          id: "hipossuficiencia",
          name: "Declaração de Hipossuficiência",
          icon: "heart-handshake",
        },
      ],
    },
    {
      id: "notificacoes",
      icon: "mail",
      name: "✉️ Notificações e Comunicações",
      items: [
        {
          id: "notificacao-extrajudicial",
          name: "Notificação Extrajudicial",
          icon: "send",
        },
        { id: "contranotificacao", name: "Contranotificação", icon: "inbox" },
        { id: "oficio", name: "Ofício", icon: "mail-open" },
      ],
    },
    {
      id: "consultoria",
      icon: "search",
      name: "🔍 Consultoria e Pareceres",
      items: [
        {
          id: "parecer-juridico",
          name: "Parecer Jurídico",
          icon: "book-open-check",
        },
        {
          id: "due-diligence",
          name: "Relatório Due Diligence",
          icon: "file-search",
        },
        {
          id: "memorando-interno",
          name: "Memorando Interno",
          icon: "sticky-note",
        },
        {
          id: "termos-privacidade",
          name: "Termos de Uso e Privacidade",
          icon: "shield",
        },
      ],
    },
    {
      id: "familia",
      icon: "heart",
      name: "🏡 Família e Sucessões",
      items: [
        { id: "pacto-antenupcial", name: "Pacto Antenupcial", icon: "gem" },
        {
          id: "uniao-estavel",
          name: "Contrato de União Estável",
          icon: "link-2",
        },
        { id: "testamento", name: "Testamento", icon: "scroll" },
        {
          id: "dav",
          name: "Diretiva Antecipada de Vontade",
          icon: "heart-pulse",
        },
        {
          id: "inventario",
          name: "Inventário Extrajudicial",
          icon: "notebook-pen",
        },
      ],
    },
  ];

  /**
   * Template padrão do editor (página inicial antes de qualquer seleção).
   * IMPORTANTE: mantém exatamente o mesmo conteúdo que vinha hardcoded no HTML.
   * @type {string}
   */
  const DEFAULT_HTML = `
<h1 style="text-align:center;font-size:18pt;margin-bottom:16pt;">{{DOC_TITULO}}</h1>
<p style="text-align:justify;margin-bottom:10pt;">
  <strong>{{CLI_NOME}}</strong>, {{CLI_NAC}}, {{CLI_EC}}, {{CLI_PROF}}, portador do CPF nº {{CLI_DOC}},
  residente e domiciliado em {{CLI_END}}, {{CLI_CIDADE}}/{{CLI_UF}}, CEP {{CLI_CEP}},
  por intermédio do advogado abaixo assinado, vem, respeitosamente, à presença de Vossa Excelência,
  perante a {{PROC_VARA}} do {{PROC_FORUM}} da Comarca de {{PROC_COMARCA}}/{{PROC_UF}},
  interpor a presente
</p>
<h2 style="text-align:center;font-size:14pt;margin:14pt 0;">{{DOC_TITULO}}</h2>
<p style="text-align:justify;margin-bottom:10pt;">
  Em face de <strong>{{REU_NOME}}</strong>, {{REU_TIPO}}, inscrito no CPF/CNPJ sob o nº {{REU_DOC}},
  residente/domiciliado em {{REU_END}}, {{REU_CIDADE}}/{{REU_UF}}, pelos fatos e fundamentos de direito a seguir expostos,
  vem requerer o que segue:
</p>
<h3 style="margin:12pt 0 6pt;font-size:13pt;">I — DOS FATOS</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">{{GEN_3}}</p>
<h3 style="margin:12pt 0 6pt;font-size:13pt;">II — DO DIREITO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
  Diante dos fatos narrados, aplica-se ao caso o disposto nos artigos 186, 187 e 927 do Código Civil,
  bem assim os princípios da responsabilidade civil objetiva, ensejando a reparação integral dos danos
  causados ao autor.
</p>
<h3 style="margin:12pt 0 6pt;font-size:13pt;">III — DOS PEDIDOS</h3>
<p style="text-align:justify;margin-bottom:6pt;">Diante do exposto, requer:</p>
<ol style="margin-left:1.5cm;margin-bottom:10pt;">
  <li style="margin-bottom:4pt;">Seja deferida a citação do réu para, querendo, defender-se no prazo legal;</li>
  <li style="margin-bottom:4pt;">Seja julgada procedente a ação, para condenar o réu ao pagamento das indenizações pleiteadas;</li>
  <li style="margin-bottom:4pt;">Seja concedida a tutela provisória de urgência, nos termos do art. 300 do CPC;</li>
  <li>Sejam condenados o réu ao pagamento de custas, despesas processuais e honorários advocatícios.</li>
</ol>
<p style="text-align:justify;margin-bottom:14pt;">Dá-se à causa o valor de R$ {{PROC_VALOR}}.</p>
<p style="text-align:center;margin:20pt 0 6pt;">Nestes termos, pede deferimento.</p>
<p style="text-align:center;margin-bottom:24pt;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>
<div style="text-align:center;margin-top:40pt;">
  <div style="width:200px;border-top:1px solid #000;margin:0 auto 4pt;"></div>
  <div style="font-weight:600;">{{ADV_NOME}}</div>
  <div style="font-size:11pt;">OAB/{{ADV_UF}} nº {{ADV_OAB}}</div>
</div>`;

  /**
   * Dicionário id -> html (apenas os modelos com HTML completo; o resto cai no esqueleto padrão).
   * Para expandir: basta adicionar chaves neste objeto — c/ mesma ID da CATEGORIES.
   * @type {Record<string, string>}
   */
  const TEMPLATES = {
    "peticao-inicial": `
<h1 style="text-align:center;font-size:18pt;margin-bottom:18pt;">PETIÇÃO INICIAL</h1>
<p style="text-align:justify;margin-bottom:12pt;">
<strong>{{CLI_NOME}}</strong>, {{CLI_NAC}}, {{CLI_EC}}, {{CLI_PROF}}, portador do CPF nº {{CLI_DOC}},
residente e domiciliado em {{CLI_END}}, {{CLI_CIDADE}}/{{CLI_UF}}, CEP {{CLI_CEP}},
e-mail {{CLI_EMAIL}}, telefone {{CLI_TEL}}, por intermédio do advogado abaixo assinado,
vem, respeitosamente, à presença de Vossa Excelência, perante a {{PROC_VARA}} do
{{PROC_FORUM}} da Comarca de {{PROC_COMARCA}}/{{PROC_UF}}, interpor a presente
</p>
<h2 style="text-align:center;font-size:14pt;margin:18pt 0;">PETIÇÃO INICIAL</h2>
<p style="text-align:justify;margin-bottom:12pt;">
em face de <strong>{{REU_NOME}}</strong>, {{REU_TIPO}}, inscrito no CPF/CNPJ sob o nº {{REU_DOC}},
residentemente/domiciliado em {{REU_END}}, {{REU_CIDADE}}/{{REU_UF}}, CEP {{REU_CEP}},
pelos fatos e fundamentos de direito a seguir expostos, vem requerer o que segue:
</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">I — DOS FATOS</h3>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">{{GEN_3}}</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">II — DO DIREITO</h3>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">
Diante dos fatos narrados, aplica-se ao caso o disposto nos arts. 186, 187 e 927 do Código Civil,
bem como os princípios da responsabilidade civil objetiva e da reparação integral dos danos (art. 5º, V e X, CF/88).
</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">III — DOS PEDIDOS</h3>
<p style="margin-bottom:6pt;">Nestes termos, requer:</p>
<ol style="margin-left:1.5cm;margin-bottom:12pt;">
<li style="margin-bottom:6pt;">Seja deferida a citação do réu para, querendo, defender-se no prazo legal;</li>
<li style="margin-bottom:6pt;">Seja julgada TOTALMENTE PROCEDENTE a ação para condenar o réu aos pagamentos pleiteados;</li>
<li style="margin-bottom:6pt;">Seja concedida a tutela provisória de urgência (art. 300 CPC);</li>
<li>Condenação em custas, despesas e honorários advocatícios (art. 85 CPC).</li>
</ol>
<p style="text-align:justify;margin-bottom:24pt;">Dá-se à causa o valor de <strong>R$ {{PROC_VALOR}}</strong>.</p>
<p style="text-align:center;margin:40pt 0 10pt;">Nestes termos, pede deferimento.</p>
<p style="text-align:center;margin-bottom:40pt;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>
<div style="text-align:center;margin-top:80pt;">
<div style="width:220px;border-top:1px solid #000;margin:0 auto 4pt;"></div>
<div style="font-weight:600;">{{ADV_NOME}}</div>
<div style="font-size:11pt;">OAB/{{ADV_UF}} nº {{ADV_OAB}}</div>
<div style="font-size:10pt;">{{ADV_END}} · {{ADV_EMAIL}}</div>
</div>`,

    contestacao: `
<h1 style="text-align:center;font-size:18pt;margin-bottom:18pt;">CONTESTAÇÃO</h1>
<p style="text-align:justify;margin-bottom:12pt;">
<strong>{{REU_NOME}}</strong>, {{REU_TIPO}}, inscrito no CPF/CNPJ nº {{REU_DOC}},
residentemente/domiciliado em {{REU_END}}, {{REU_CIDADE}}/{{REU_UF}},
por intermédio do advogado abaixo assinado, vem, respeitosamente, em face do Processo nº <strong>{{PROC_NUM}}</strong>,
tramitado na {{PROC_VARA}} do {{PROC_FORUM}} de {{PROC_COMARCA}}/{{PROC_UF}}, opôr a presente
</p>
<h2 style="text-align:center;font-size:14pt;margin:18pt 0;">CONTESTAÇÃO</h2>
<p style="text-align:justify;margin-bottom:12pt;">
às alegações constantes da Petição Inicial proposta por <strong>{{CLI_NOME}}</strong>, pelos fatos,
fundamentos e pedidos que passa a expor nos seguintes termos:
</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">I — DA EXCEÇÃO DE INCOMPETÊNCIA (se for o caso)</h3>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">
Eventualmente argui-se preliminarmente a incompetência desta Vara para o processamento do feito, considerando [...].
</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">II — DA IMPROCEDÊNCIA DA AÇÃO</h3>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">
Adentrando ao mérito, a pretensão autoral carece de lastro fático e jurídico, porquanto [...]
</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">III — DA CONTRADIÇÃO</h3>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">{{GEN_3}}</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">IV — DOS PEDIDOS</h3>
<p style="margin-bottom:6pt;">Face ao exposto, requer:</p>
<ol style="margin-left:1.5cm;margin-bottom:12pt;">
<li style="margin-bottom:6pt;">Seja julgada TOTALMENTE IMPROCEDENTE a ação proposta pelo autor;</li>
<li style="margin-bottom:6pt;">Seja o autor condenado ao pagamento de custas, despesas processuais e honorários advocatícios;</li>
<li>Seja concedida a assistência judiciária gratuita (se for o caso).</li>
</ol>
<p style="text-align:center;margin:40pt 0 10pt;">Nestes termos, pede deferimento.</p>
<p style="text-align:center;margin-bottom:40pt;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>
<div style="text-align:center;margin-top:80pt;">
<div style="width:220px;border-top:1px solid #000;margin:0 auto 4pt;"></div>
<div style="font-weight:600;">{{ADV_NOME}}</div>
<div style="font-size:11pt;">OAB/{{ADV_UF}} nº {{ADV_OAB}}</div>
</div>`,

    apelacao: `
<h1 style="text-align:center;font-size:18pt;margin-bottom:18pt;">RECURSO DE APELAÇÃO</h1>
<p style="text-align:justify;margin-bottom:12pt;">
<strong>{{CLI_NOME}}</strong>, na qualidade de Apelante no Processo nº <strong>{{PROC_NUM}}</strong>,
{{PROC_INST}} da Comarca de {{PROC_COMARCA}}/{{PROC_UF}}, Rel. Exa. Des(a) {{PROC_JUIZ}},
por intermédio de seu advogado abaixo assinado, vem, respeitosamente, interpor o presente
</p>
<h2 style="text-align:center;font-size:14pt;margin:18pt 0;">RECURSO DE APELAÇÃO</h2>
<p style="text-align:justify;margin-bottom:12pt;">
em face da sentença proferida em {{PROC_DATA}}, que julgou parcialmente procedente/improcedente a ação,
pelos fatos e fundamentos a seguir expostos:
</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">I — DA SENTENÇA RECORRIDA</h3>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">
Inicialmente, registra-se o conteúdo da decisão recorrida, cuja ementa dispõe sobre [...].
</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">II — DOS ERROS DA DECISÃO</h3>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">
A decisão recorrida macula-se por vícios de índole jurídica e fática, a saber: (a) erro na aplicação de direito material;
(b) desconsideração de provas coligidas nos autos; (c) inobservância de princípios informadores do processo civil.
</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">III — DOS ARGUMENTOS</h3>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">{{GEN_3}}</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">IV — DOS PEDIDOS</h3>
<ol style="margin-left:1.5cm;margin-bottom:12pt;">
<li style="margin-bottom:6pt;">Sejam conhecidos e providos os presentes recursos de apelação;</li>
<li style="margin-bottom:6pt;">Seja reformada a sentença recorrida, para reconhecer integralmente os direitos do apelante;</li>
<li style="margin-bottom:6pt;">Condenação do apelado em custas e honorários advocatícios recursais.</li>
</ol>
<p style="text-align:center;margin:40pt 0 10pt;">Nestes termos, pede deferimento.</p>
<p style="text-align:center;margin-bottom:40pt;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>
<div style="text-align:center;margin-top:80pt;">
<div style="width:220px;border-top:1px solid #000;margin:0 auto 4pt;"></div>
<div style="font-weight:600;">{{ADV_NOME}}</div>
<div style="font-size:11pt;">OAB/{{ADV_UF}} nº {{ADV_OAB}}</div>
</div>`,

    "contrato-servicos": `
<h1 style="text-align:center;font-size:16pt;margin-bottom:20pt;">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
<p style="text-align:center;margin-bottom:24pt;font-size:11pt;font-style:italic;">CLÁUSULAS E CONDIÇÕES ESPECIAIS</p>
<p style="text-align:justify;margin-bottom:18pt;">
<strong>CONTRATANTE:</strong> {{CLI_NOME}}, {{CLI_TIPO}}, inscrito no CPF/CNPJ nº {{CLI_DOC}},
residente/domiciliado em {{CLI_END}}, {{CLI_CIDADE}}/{{CLI_UF}}.
</p>
<p style="text-align:justify;margin-bottom:18pt;">
<strong>CONTRATADA:</strong> {{REU_NOME}}, {{REU_TIPO}}, inscrita no CPF/CNPJ nº {{REU_DOC}},
residente/domiciliada em {{REU_END}}, {{REU_CIDADE}}/{{REU_UF}},
representada neste ato por {{REU_REP}}.
</p>
<p style="text-align:justify;margin-bottom:12pt;">
As partes acima identificadas têm, entre si, justo e acertado o presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS,
que se regerá pelas cláusulas a seguir:
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">CLÁUSULA 1. OBJETO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
O presente contrato tem como objeto a prestação dos serviços por parte da CONTRATADA em favor da CONTRATANTE,
especificados no Anexo I, parte integrante deste instrumento.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">CLÁUSULA 2. VALOR E FORMA DE PAGAMENTO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
2.1 Pela execução dos serviços ora contratados, a CONTRATANTE pagará à CONTRATADA a importância de
<strong>R$ {{PROC_VALOR}}</strong>, na seguinte forma: {{GEN_2}}.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">CLÁUSULA 3. PRAZO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
O prazo para conclusão dos serviços será de {{GEN_1}}, contado da assinatura deste instrumento.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">CLÁUSULA 4. CONFIDENCIALIDADE</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
As partes se comprometem a manter sigilo sobre todas as informações técnicas e comerciais obtidas em razão
deste contrato, sob pena de ressarcimento integral dos danos.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">CLÁUSULA 5. RESCISÃO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">{{GEN_3}}</p>
<p style="text-align:center;margin:40pt 0 20pt;">
E, por estarem assim justas e acordadas, assinam o presente contrato em 2 (duas) vias de igual teor e forma,
na presença das testemunhas abaixo.
</p>
<p style="text-align:center;margin-bottom:20pt;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>
<div style="margin-top:60pt;">
<p style="text-align:center;">_______________________________________________________<br>
<strong>CONTRATANTE</strong><br>{{CLI_NOME}}<br>{{CLI_DOC}}</p>
<p style="text-align:center;margin-top:50pt;">_______________________________________________________<br>
<strong>CONTRATADA</strong><br>{{REU_NOME}}<br>{{REU_DOC}}</p>
<p style="text-align:center;margin-top:50pt;">
________________________________________ &nbsp;&nbsp;&nbsp; ________________________________________<br>
TESTEMUNHA 1: _______________ / CPF ______ &nbsp;&nbsp;&nbsp; TESTEMUNHA 2: _______________ / CPF ______
</p>
</div>`,

    procuracao: `
<h1 style="text-align:center;font-size:16pt;margin-bottom:18pt;">PROCURAÇÃO AD JUDICIA ET EXTRA</h1>
<p style="text-align:justify;margin-bottom:14pt;">
<strong>{{CLI_NOME}}</strong>, {{CLI_NAC}}, {{CLI_EC}}, {{CLI_PROF}},
portador do CPF nº {{CLI_DOC}}, RG nº {{CLI_RG}}, residente e domiciliado em {{CLI_END}},
{{CLI_CIDADE}}/{{CLI_UF}}, no uso de seus direitos civis, por meio deste instrumento particular de PROCURAÇÃO,
nomeia e constitui como seu verdadeiro e legítimo procurador:
</p>
<p style="text-align:justify;margin:18pt 0;padding:12pt;border:1px solid #000;">
<strong>{{ADV_NOME}}</strong>, advogado(a), inscrito(a) na OAB/{{ADV_UF}} sob o nº {{ADV_OAB}},
CPF nº {{ADV_CPF}}, com escritório profissional situado em {{ADV_END}},
{{ADV_CIDADE}}/{{ADV_UF}}, CEP {{ADV_CEP}}, telefone {{ADV_TEL}}, e-mail {{ADV_EMAIL}}.
</p>
<h3 style="margin:18pt 0 10pt;font-size:13pt;">DOS PODERES</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
A presente procuração confere ao procurador acima qualificado os poderes <strong>ad judicia</strong>
para representar o outorgante em juízo, em qualquer instância, grau de jurisdição ou tribunal,
quer em âmbito judicial, quer administrativo, podendo:
</p>
<ul style="margin-left:1.5cm;margin-bottom:12pt;">
<li style="margin-bottom:5pt;">Patrocinar ações cíveis, criminais, trabalhistas, previdenciárias, tributárias e de família;</li>
<li style="margin-bottom:5pt;">Propor petições iniciais, recursos, embargos, contestações, defesas e manifestações de qualquer espécie;</li>
<li style="margin-bottom:5pt;">Arguir exceções, apresentar defesas, deduções e pretensões de qualquer ordem;</li>
<li style="margin-bottom:5pt;">Transigir, renunciar, reconhecer a procedência do pedido, confessar e firmar compromisso;</li>
<li style="margin-bottom:5pt;">Receber intimações e citações, dar quitação e receber valores e alvarás;</li>
<li>Substabelecer, total ou parcialmente, com ou sem reserva de poderes (cláusula especial).</li>
</ul>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">
Os poderes <strong>extra judicia</strong> compreendem a prática de todos os atos necessários à defesa dos direitos
do outorgante, incluindo a assinatura de recibos, quitações, acordos e documentos em geral.
</p>
<p style="text-align:center;margin:40pt 0 10pt;">
E, para que surta os efeitos legais e administrativos a que deva servir, lavrou-se a presente procuração,
que será assinada pelo outorgante.
</p>
<p style="text-align:center;margin-bottom:40pt;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>
<div style="text-align:center;margin-top:80pt;">
<div style="width:260px;border-top:1px solid #000;margin:0 auto 4pt;"></div>
<div style="font-weight:600;">OUTORGANTE: {{CLI_NOME}}</div>
<div style="font-size:10pt;">CPF: {{CLI_DOC}}</div>
</div>
<div style="text-align:center;margin-top:50pt;">
<div style="width:260px;border-top:1px solid #000;margin:0 auto 4pt;"></div>
<div style="font-weight:600;">ACEITO OS PODERES: {{ADV_NOME}}</div>
<div style="font-size:10pt;">OAB/{{ADV_UF}}: {{ADV_OAB}}</div>
</div>`,

    "notificacao-extrajudicial": `
<h1 style="text-align:center;font-size:16pt;margin-bottom:18pt;">NOTIFICAÇÃO EXTRAJUDICIAL</h1>
<p style="text-align:justify;margin-bottom:14pt;">
<strong>Remetente/Notificante:</strong> {{CLI_NOME}}, {{CLI_TIPO}}, inscrito no CPF/CNPJ nº {{CLI_DOC}},
residente/domiciliado em {{CLI_END}}, {{CLI_CIDADE}}/{{CLI_UF}},
representado por {{ADV_NOME}}, OAB/{{ADV_UF}} nº {{ADV_OAB}}.
</p>
<p style="text-align:justify;margin-bottom:14pt;">
<strong>Destinatário/Notificado:</strong> {{REU_NOME}}, {{REU_TIPO}}, inscrito no CPF/CNPJ nº {{REU_DOC}},
residentemente/domiciliado em {{REU_END}}, {{REU_CIDADE}}/{{REU_UF}}.
</p>
<h2 style="text-align:center;font-size:14pt;margin:18pt 0;">REF: COBRANÇA DE DÍVIDA / CUMPRIMENTO DE OBRIGAÇÃO</h2>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">
Vimos, mui respeitosamente, por intermédio desta, NOTIFICAR Vossa Senhoria, em caráter de cobrança extrajudicial,
no sentido de, num prazo de ____ dias úteis contados do recebimento desta, proceda ao:
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">1. PAGAMENTO INTEGRAL DO VALOR DEVIDO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
Quantia correspondente a R$ {{PROC_VALOR}}, referente a {{GEN_1}}, conforme documentos que instruem o presente
(os quais fazem parte integrante deste ato).
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">2. FUNDAMENTAÇÃO JURÍDICA</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">{{GEN_3}}</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">3. ADVERTÊNCIA FINAL</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
Caso o pagamento/solução não seja efetuado dentro do prazo supramencionado, adotaremos as medidas judiciais cabíveis,
inclusive a propositura de ação para exigir o cumprimento da obrigação, acrescidos de juros, multa, correção monetária,
honorários advocatícios e custas processuais, na forma da lei.
</p>
<p style="text-align:justify;margin-bottom:18pt;">
Informamos que o depósito deverá ser efetuado na conta abaixo: {{GEN_2}}
</p>
<p style="text-align:center;margin:40pt 0 10pt;">Atenciosamente,</p>
<div style="text-align:center;margin-top:60pt;">
<div style="width:260px;border-top:1px solid #000;margin:0 auto 4pt;"></div>
<div style="font-weight:600;">{{ADV_NOME}}</div>
<div style="font-size:10pt;">OAB/{{ADV_UF}} nº {{ADV_OAB}} · Representante Legal do Notificante</div>
</div>
<p style="text-align:center;margin:30pt 0 0;font-size:10pt;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>`,

    honorarios: `
<h1 style="text-align:center;font-size:16pt;margin-bottom:18pt;">CONTRATO DE HONORÁRIOS ADVOCATÍCIOS</h1>
<p style="text-align:justify;margin-bottom:14pt;">
<strong>CONTRATANTE (CLIENTE):</strong> {{CLI_NOME}}, {{CLI_TIPO}}, CPF/CNPJ nº {{CLI_DOC}},
residente/domiciliado em {{CLI_END}}, {{CLI_CIDADE}}/{{CLI_UF}}, telefone {{CLI_TEL}}, e-mail {{CLI_EMAIL}}.
</p>
<p style="text-align:justify;margin-bottom:14pt;">
<strong>CONTRATADA (ADVOGADA/O):</strong> {{ADV_NOME}}, inscrita(o) na OAB/{{ADV_UF}} sob o nº {{ADV_OAB}},
CPF nº {{ADV_CPF}}, com escritório em {{ADV_END}}, {{ADV_CIDADE}}/{{ADV_UF}},
telefone {{ADV_TEL}}, e-mail {{ADV_EMAIL}}.
</p>
<p style="text-align:justify;margin-bottom:12pt;">
As partes, na melhor forma de direito, têm entre si justo e acertado o presente contrato de prestação de serviços
advocatícios, nos termos das cláusulas a seguir:
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">CLÁUSULA 1. OBJETO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
Constitui o objeto do presente contrato o patrocínio jurídico dos interesses do Contratante perante a
{{PROC_VARA}} / Comarca de {{PROC_COMARCA}}, no Processo nº {{PROC_NUM}}, observando-se as normas estatutárias
e éticas da OAB.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">CLÁUSULA 2. DOS HONORÁRIOS</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
2.1 Os honorários advocatícios profissionais, em decorrência do presente contrato, ficam fixados no valor de
<strong>R$ {{PROC_VALOR}}</strong> + {{GEN_1}}% de êxito sobre o valor arbitrado em eventual sentença,
acordo ou execução favorável ao contratante.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">CLÁUSULA 3. FORMA DE PAGAMENTO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
O pagamento dos honorários será efetuado na seguinte forma: {{GEN_2}}.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">CLÁUSULA 4. DESPESAS</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
Custas judiciais, emolumentos, despesas cartorárias, periciais, traslados, viagens e demais eventuais
desembolsos necessários à causa correrão por conta exclusiva do CONTRATANTE, mediante prévia anuência ou
ressarcimento posterior mediante apresentação de comprovantes.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">CLÁUSULA 5. RESCISÃO E RESOLUÇÃO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">{{GEN_3}}</p>
<p style="text-align:center;margin:40pt 0 18pt;">
E, por estarem assim justas e acordadas, assinam as partes o presente contrato em 2 (duas) vias de igual teor.
</p>
<p style="text-align:center;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>
<div style="margin-top:50pt;">
<p style="text-align:center;">_______________________________________________________<br>
<strong>CONTRATANTE</strong><br>{{CLI_NOME}}</p>
<p style="text-align:center;margin-top:40pt;">_______________________________________________________<br>
<strong>CONTRATADA</strong><br>{{ADV_NOME}} · OAB/{{ADV_UF}} {{ADV_OAB}}</p>
</div>`,

    nda: `
<h1 style="text-align:center;font-size:16pt;margin-bottom:18pt;">TERMO DE CONFIDENCIALIDADE — NDA</h1>
<p style="text-align:justify;margin-bottom:14pt;">
<strong>PARTE RECEPTORA (Disclosing Party):</strong> {{CLI_NOME}}, {{CLI_TIPO}}, CPF/CNPJ nº {{CLI_DOC}}.
</p>
<p style="text-align:justify;margin-bottom:14pt;">
<strong>PARTE RECEBEDORA (Receiving Party):</strong> {{REU_NOME}}, {{REU_TIPO}}, CPF/CNPJ nº {{REU_DOC}}.
</p>
<p style="text-align:justify;margin-bottom:12pt;">
Considerando a intenção das partes de discutir e desenvolver atividades conjuntas relativas a {{GEN_1}}
(o "Propósito"), as partes celebram o presente Termo de Confidencialidade:
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">1. INFORMAÇÕES CONFIDENCIAIS</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
Entende-se por "Informações Confidenciais" todos os dados, documentos, projetos, segredos comerciais,
informações financeiras, técnicas, estratégicas, listas de clientes e quaisquer outros materiais
fornecidos por uma parte à outra em razão do Propósito, quer de forma oral, escrita ou digital.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">2. OBRIGAÇÕES</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
A Parte Recebedora compromete-se a: (a) tratar como confidenciais todas as Informações recebidas;
(b) não utilizar tais informações para qualquer finalidade diversa do Propósito;
(c) não divulgar as Informações a terceiros sem prévia e expressa autorização por escrito.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">3. PRAZO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
Este Termo vigorará por 5 (cinco) anos contados da data de assinatura, ou até que a informação
passe a ser pública, o que ocorrer primeiro.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">4. LEGISLAÇÃO E FORO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">{{GEN_3}}</p>
<p style="text-align:center;margin:40pt 0 18pt;">E, assim, firmam o presente termo em 2 (duas) vias.</p>
<p style="text-align:center;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>
<div style="margin-top:60pt;">
<p style="text-align:center;">_______________________________________________________<br>
<strong>PARTE RECEPTORA</strong><br>{{CLI_NOME}}</p>
<p style="text-align:center;margin-top:40pt;">_______________________________________________________<br>
<strong>PARTE RECEBEDORA</strong><br>{{REU_NOME}}</p>
</div>`,

    "parecer-juridico": `
<h1 style="text-align:center;font-size:16pt;margin-bottom:6pt;">PARECER JURÍDICO</h1>
<p style="text-align:center;font-size:11pt;margin-bottom:18pt;font-style:italic;">
Processo nº {{PROC_NUM}} · {{PROC_INST}} · Rel. {{PROC_JUIZ}}
</p>
<p style="text-align:justify;margin-bottom:12pt;">
<strong>1. CONSULTANTE:</strong> {{CLI_NOME}} — {{CLI_DOC}}
<br><strong>2. ADVOGADO/PARECERISTA:</strong> {{ADV_NOME}} — OAB/{{ADV_UF}} {{ADV_OAB}}
<br><strong>3. OBJETO:</strong> {{GEN_1}}
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">I — RELATO DOS FATOS</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">{{GEN_3}}</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">II — ANÁLISE JURÍDICA</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
Diante dos fatos narrados, cumpre analisar a questão sob o prisma dos artigos 186 e seguintes do Código Civil,
bem assim o disposto no art. 5º, XXXV, da Constituição Federal, que assegura a plenitude da defesa e do contraditório.
</p>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
Aplicam-se ao caso concreto, ainda, os dispositivos do Código de Processo Civil pertinentes à matéria,
especialmente aqueles atinentes à legitimidade das partes, interesse processual e procedência da causa de pedir.
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">III — RISCOS IDENTIFICADOS</h3>
<ul style="margin-left:1.5cm;margin-bottom:10pt;">
<li style="margin-bottom:5pt;">Risco 1: [preencher]</li>
<li style="margin-bottom:5pt;">Risco 2: [preencher]</li>
<li>Risco 3: [preencher]</li>
</ul>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">IV — CONCLUSÃO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">{{GEN_2}}</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">V — RECOMENDAÇÃO FINAL</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
Diante de toda a análise empreendida, recomenda-se a adoção de medida [cautelar / litigiosa / alternativa]
para a proteção dos direitos do consultante, observada a razoabilidade e a proporcionalidade dos atos.
</p>
<p style="text-align:center;margin:40pt 0 8pt;">Este é o parecer.</p>
<p style="text-align:center;margin-bottom:20pt;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>
<div style="text-align:center;margin-top:60pt;">
<div style="width:240px;border-top:1px solid #000;margin:0 auto 4pt;"></div>
<div style="font-weight:600;">{{ADV_NOME}}</div>
<div style="font-size:10pt;">Parecerista · OAB/{{ADV_UF}} nº {{ADV_OAB}}</div>
</div>`,

    "ficha-atendimento": `
<h1 style="text-align:center;font-size:16pt;margin-bottom:18pt;">FICHA DE ATENDIMENTO</h1>
<p style="text-align:justify;margin-bottom:12pt;">
<strong>Data do Atendimento:</strong> {{DOC_DATA}}
<br><strong>Advogado(a) Responsável:</strong> {{ADV_NOME}} / OAB {{ADV_OAB}}
<br><strong>Área do Direito:</strong> {{PROC_ASSUNTO}}
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">DADOS DO CLIENTE</h3>
<p style="text-align:justify;margin-bottom:10pt;">
<strong>Nome:</strong> {{CLI_NOME}} &nbsp;|&nbsp; <strong>Tipo:</strong> {{CLI_TIPO}}
<br><strong>CPF/CNPJ:</strong> {{CLI_DOC}} &nbsp;|&nbsp; <strong>RG/IE:</strong> {{CLI_RG}}
<br><strong>Nacionalidade:</strong> {{CLI_NAC}} &nbsp;|&nbsp; <strong>Estado Civil:</strong> {{CLI_EC}}
<br><strong>Profissão:</strong> {{CLI_PROF}} &nbsp;|&nbsp; <strong>Data Nasc.:</strong> {{CLI_NASC}}
<br><strong>Endereço:</strong> {{CLI_END}} — {{CLI_CIDADE}}/{{CLI_UF}} — CEP {{CLI_CEP}}
<br><strong>Tel:</strong> {{CLI_TEL}} &nbsp;|&nbsp; <strong>E-mail:</strong> {{CLI_EMAIL}}
</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">RELATO FATUAL</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">{{GEN_3}}</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">ANÁLISE PRELIMINAR</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">{{GEN_2}}</p>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">MEDIDAS A SEREM ADOTADAS</h3>
<ul style="margin-left:1.5cm;margin-bottom:10pt;">
<li style="margin-bottom:5pt;">Ato 1: {{GEN_1}}</li>
<li style="margin-bottom:5pt;">Ato 2: [preencher]</li>
<li>Ato 3: [preencher]</li>
</ul>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">DOCUMENTOS APRESENTADOS</h3>
<ul style="margin-left:1.5cm;margin-bottom:10pt;">
<li style="margin-bottom:5pt;">[] CPF / RG</li>
<li style="margin-bottom:5pt;">[] Comprovante de residência</li>
<li style="margin-bottom:5pt;">[] Contratos</li>
<li style="margin-bottom:5pt;">[] Extratos / Comprovantes</li>
<li>[] Outros: ______________________________</li>
</ul>
<h3 style="margin:14pt 0 8pt;font-size:12pt;">HONORÁRIOS</h3>
<p style="text-align:justify;margin-bottom:10pt;">
Valor estimado da causa: R$ {{PROC_VALOR}}
<br>Honorários acordados: [preencher]
<br>Forma de pagamento: [preencher]
</p>
<div style="display:flex;justify-content:space-between;margin-top:60pt;">
<div style="width:48%;">
<div style="border-top:1px solid #000;margin-bottom:4pt;"></div>
<p style="text-align:center;font-size:11pt;">Cliente: {{CLI_NOME}}</p>
</div>
<div style="width:48%;">
<div style="border-top:1px solid #000;margin-bottom:4pt;"></div>
<p style="text-align:center;font-size:11pt;">Advogado: {{ADV_NOME}}</p>
</div>
</div>`,

    testamento: `
<h1 style="text-align:center;font-size:16pt;margin-bottom:18pt;">TESTAMENTO PÚBLICO</h1>
<p style="text-align:justify;margin-bottom:14pt;">
No dia {{DOC_DATA}}, em {{DOC_CIDADE}}, diante do Tabelião abaixo assinado, compareceu:
</p>
<p style="text-align:justify;margin:16pt 0;padding:12pt;border:1px solid #000;">
<strong>{{CLI_NOME}}</strong>, {{CLI_NAC}}, {{CLI_EC}}, {{CLI_PROF}},
portador do CPF nº {{CLI_DOC}}, RG nº {{CLI_RG}}, residente em {{CLI_END}},
{{CLI_CIDADE}}/{{CLI_UF}}, CEP {{CLI_CEP}}, nascido em {{CLI_NASC}}, aos quais o tabelião declarou
conhecer e reconhecer a identidade.
</p>
<h3 style="margin:16pt 0 10pt;font-size:13pt;">DECLARAÇÕES DO TESTAMENTEIRO</h3>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
O testamenteiro, em gozo de suas faculdades mentais, declara ser este seu testamento público, por meio do qual:
</p>
<p style="text-align:justify;margin-bottom:10pt;"><strong>I — DO ESTADO CIVIL E FAMÍLIA</strong></p>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
Declara estar atualmente {{CLI_EC}}; tem como herdeiros necessários: {{GEN_1}}.
</p>
<p style="text-align:justify;margin-bottom:10pt;"><strong>II — DO INVENTÁRIO</strong></p>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
O monte a ser partilhado compreende os bens arrolados no Anexo I, parte integrante deste testamento,
perfazendo o valor aproximado de R$ {{PROC_VALOR}}.
</p>
<p style="text-align:justify;margin-bottom:10pt;"><strong>III — DAS DISPOSIÇÕES DE ÚLTIMA VONTADE</strong></p>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">{{GEN_3}}</p>
<p style="text-align:justify;margin-bottom:10pt;"><strong>IV — DO EXECUTOR TESTAMENTÁRIO</strong></p>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">
Nomeia, para a função de executor testamentário, {{REU_NOME}}, CPF {{REU_DOC}},
com poderes para praticar todos os atos necessários à fiel execução das disposições de última vontade.
</p>
<p style="text-align:justify;margin-bottom:10pt;"><strong>V — DO INVENTÁRIO E PARTILHA</strong></p>
<p style="text-align:justify;margin-bottom:10pt;text-indent:1.5cm;">{{GEN_2}}</p>
<p style="text-align:center;margin:40pt 0 10pt;">
E, assim, lido e aprovado pelo testamenteiro e pelas testemunhas, foi assinado o presente
testamento, em 3 (três) vias de igual teor e forma.
</p>
<p style="text-align:center;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>
<div style="margin-top:50pt;">
<p style="text-align:center;">_______________________________________________________<br>
<strong>TESTAMENTEIRO</strong><br>{{CLI_NOME}}</p>
<p style="text-align:center;margin-top:40pt;">_______________________________________________________<br>
<strong>TABELIÃO</strong></p>
<p style="display:flex;justify-content:space-between;margin-top:40pt;gap:20pt;">
<span style="flex:1;text-align:center;">________________________________<br>Testemunha 1<br>CPF:</span>
<span style="flex:1;text-align:center;">________________________________<br>Testemunha 2<br>CPF:</span>
</p>
</div>`,
  };

  /**
   * Esqueleto padrão para tipos que ainda não têm HTML completo.
   * Garante coerência e evita telas em branco durante a prototipagem.
   * @param {string} id
   */
  function skeletonFor(id) {
    const title = templateTitle(id) || "Documento Jurídico";
    return `
<h1 style="text-align:center;font-size:16pt;margin-bottom:18pt;">${DocJurUtils.escHtml(title.toUpperCase())}</h1>
<p style="text-align:justify;margin-bottom:14pt;">
<strong>{{CLI_NOME}}</strong>, {{CLI_NAC}}, {{CLI_EC}}, {{CLI_PROF}}, CPF nº {{CLI_DOC}},
domiciliado em {{CLI_END}}, {{CLI_CIDADE}}/{{CLI_UF}}, por intermédio de
{{ADV_NOME}}, OAB/{{ADV_UF}} nº {{ADV_OAB}}, vem, mui respeitosamente, perante Vossa Excelência,
por meio deste, apresentar o presente <strong>${DocJurUtils.escHtml(title)}</strong>.
</p>
<h3 style="margin:18pt 0 8pt;font-size:13pt;">1. DOS FATOS</h3>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">{{GEN_3}}</p>
<h3 style="margin:18pt 0 8pt;font-size:13pt;">2. DA FUNDAMENTAÇÃO</h3>
<p style="text-align:justify;margin-bottom:12pt;text-indent:1.5cm;">
Diante da hipótese fática descrita, aplica-se ao caso o disposto nos arts. [...] do Código Civil e
artigos pertinentes da legislação processual vigente, observados os princípios da boa-fé,
confiança e da moralidade administrativa.
</p>
<h3 style="margin:18pt 0 8pt;font-size:13pt;">3. DOS PEDIDOS</h3>
<ol style="margin-left:1.5cm;margin-bottom:12pt;">
<li style="margin-bottom:6pt;">[Pedido 1]</li>
<li style="margin-bottom:6pt;">[Pedido 2]</li>
<li>[Pedido 3]</li>
</ol>
<p style="text-align:justify;margin-bottom:24pt;">Dá-se à causa o valor de R$ {{PROC_VALOR}}.</p>
<p style="text-align:center;margin:40pt 0 10pt;">Nestes termos, pede deferimento.</p>
<p style="text-align:center;margin-bottom:40pt;">{{DOC_CIDADE}}/{{DOC_UF}}, {{DOC_DATA}}.</p>
<div style="text-align:center;margin-top:80pt;">
<div style="width:220px;border-top:1px solid #000;margin:0 auto 4pt;"></div>
<div style="font-weight:600;">{{ADV_NOME}}</div>
<div style="font-size:11pt;">OAB/{{ADV_UF}} nº {{ADV_OAB}}</div>
</div>`;
  }

  /**
   * Lookup do nome amigável de um template (por ID).
   * @param {string} id
   * @returns {string}
   */
  function templateTitle(id) {
    for (const cat of CATEGORIES) {
      const it = cat.items.find((i) => i.id === id);
      if (it) return it.name;
    }
    return "Documento";
  }

  /**
   * Retorna HTML do template (preenchido ou skeleton fallback).
   * @param {string} id
   * @returns {string}
   */
  function getHtml(id) {
    return TEMPLATES[id] || skeletonFor(id);
  }

  return {
    CATEGORIES,
    DEFAULT_HTML,
    TEMPLATES,
    templateTitle,
    getHtml,
    skeletonFor,
  };
})();

window.DocJurTemplates = DocJurTemplates;
