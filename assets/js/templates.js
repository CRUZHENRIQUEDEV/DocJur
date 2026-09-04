/* ================================================================
   DocJur — assets/js/templates.js
   Catálogo de categorias e templates.
   - Itens com sourceFile → baseados em documento real (Peticao/TJDFT/*.docx)
   - Itens com pending: true → modelo genérico SEM base de documento real (pendência)
   - PH_LABELS: mapa de chave técnica → label amigável em português
   ================================================================ */
/* global DocJurUtils */
/** @typedef {{ id: string, name: string, icon: string, sourceFile?: string, pending?: boolean, implemented?: boolean, html?: string }} TplTemplateItem */
/** @typedef {{ id: string, icon: string, name: string, items: TplTemplateItem[] }} TplDocTemplateCategory */
const DocJurTemplates = (() => {
  // ============================================================
  //  PH_LABELS — mapa de chave técnica -> rótulo amigável
  // ============================================================
  /** @type {Record<string, string>} */
  const PH_LABELS = {
    ADV_NOME: "Nome do Advogado(a)",
    ADV_OAB: "Número da OAB (Ex: 123.456)",
    ADV_UF: "UF da OAB (Ex: DF, SP, RJ)",
    ADV_CPF: "CPF do Advogado(a)",
    ADV_EMAIL: "E-mail do Advogado(a)",
    ADV_TEL: "Telefone do Advogado(a)",
    ADV_END: "Endereço do Escritório",
    ADV_CEP: "CEP do Escritório",
    ADV_CIDADE: "Cidade do Escritório",

    ESC_RAZAO: "Razão Social do Escritório",
    ESC_CNPJ: "CNPJ do Escritório",
    ESC_FANT: "Nome Fantasia do Escritório",

    CLI_NOME: "Nome Completo do Cliente / Autor",
    CLI_TIPO: "Tipo de Pessoa (Física ou Jurídica)",
    CLI_DOC: "CPF / CNPJ do Cliente",
    CLI_RG: "RG / Inscrição Estadual",
    CLI_NAC: "Nacionalidade",
    CLI_EC: "Estado Civil",
    CLI_PROF: "Profissão",
    CLI_NASC: "Data de Nascimento",
    CLI_EMAIL: "E-mail do Cliente",
    CLI_TEL: "Telefone do Cliente",
    CLI_END: "Endereço Completo do Cliente",
    CLI_CEP: "CEP do Cliente",
    CLI_CIDADE: "Cidade do Cliente",
    CLI_UF: "UF do Cliente",

    REU_NOME: "Nome / Razão Social do Réu",
    REU_TIPO: "Tipo de Pessoa (Física / Jurídica / Órgão Público)",
    REU_DOC: "CPF / CNPJ do Réu",
    REU_RG: "RG / IE do Réu",
    REU_NAC: "Nacionalidade do Réu",
    REU_REP: "Representante Legal do Réu",
    REU_EMAIL: "E-mail do Réu",
    REU_TEL: "Telefone do Réu",
    REU_END: "Endereço Completo do Réu",
    REU_CEP: "CEP do Réu",
    REU_CIDADE: "Cidade do Réu",
    REU_UF: "UF do Réu",

    GEN_1: "Campo Genérico 1 (uso livre)",
    GEN_2: "Campo Genérico 2 (uso livre)",
    GEN_3: "Campo Genérico 3 — Texto Longo (narrativa, fatos)",

    PROC_NUM: "Número do Processo Judicial",
    PROC_VARA: "Vara (Ex: 2ª Vara Cível)",
    PROC_FORUM: "Fórum (Ex: Fórum Desembargador ...)",
    PROC_COMARCA: "Comarca (Ex: Brasília)",
    PROC_UF: "UF do Processo",
    PROC_ASSUNTO: "Assunto / Classe Processual",
    PROC_VALOR: "Valor da Causa (R$)",
    PROC_VALOR_EXTENSO: "Valor da Causa (por extenso)",
    PROC_DATA: "Data dos Fatos / Decisão Recorrida",
    PROC_JUIZ: "Juiz(a) Relator(a)",
    PROC_INST: "Instância (1ª / 2ª / Superior)",
    PROC_TUTELA: "Tipo de Tutela (Urgência / Antecipada)",

    REU_EC: "Estado Civil do Réu (Pessoa Física)",
    REU_PROF: "Profissão do Réu (Pessoa Física)",

    CLI_FILIACAO: "Filiação do Autor (Pai e Mãe)",
    CLI_RG_ORGAO: "Órgão Expedidor RG (Ex: SSP/DF)",
    CLI_RG_EXPEDICAO: "Data de Expedição do RG",
    CLI_WHATSAPP: "WhatsApp do Cliente / Autor",

    REU_PJ_RAZAO: "Razão Social / Nome Fantasia (Réu PJ)",
    REU_PJ_CNPJ: "CNPJ (Réu PJ)",
    REU_PJ_END: "Endereço Completo (Réu PJ)",
    REU_PJ_CIDADE: "Cidade (Réu PJ)",
    REU_PJ_CEP: "CEP (Réu PJ)",
    REU_PJ_TEL: "Telefone (Réu PJ)",
    REU_PJ_WHATSAPP: "WhatsApp (Réu PJ)",
    REU_PJ_EMAIL: "E-mail (Réu PJ)",

    REU_GDF_ORGAO:
      "Órgão / Entidade do DF (Ex: GDF, DETRAN, DER, NOVACAP, CAESB, CEB)",
    REU_GDF_CNPJ: "CNPJ (Réu GDF / Entidade)",
    REU_GDF_END: "Endereço Sede (Réu GDF)",
    REU_GDF_CIDADE: "Cidade (Réu GDF)",
    REU_GDF_CEP: "CEP (Réu GDF)",
    REU_GDF_TEL: "Telefone (Réu GDF)",
    REU_GDF_WHATSAPP: "WhatsApp (Réu GDF)",
    REU_GDF_EMAIL: "E-mail (Réu GDF)",

    PROC_FORUM_CIDADE: "Fórum / Cidade (Juizado Especial Cível — TJDFT)",
    PROC_DATA_EVENTO: "Data do Evento / Celebração / Tomada de Conhecimento",
    REU_WHATSAPP: "WhatsApp do Réu (PF)",

    DOC_CIDADE: "Cidade (rodapé do documento)",
    DOC_UF: "UF (rodapé do documento)",
    DOC_DATA: "Data de Emissão",
    DOC_TITULO: "Título do Documento",
  };

  /**
   * Retorna label amigável do placeholder (ou a própria chave se não encontrado).
   * @param {string} key
   */
  function phLabel(key) {
    return PH_LABELS[key] || key;
  }

  // ============================================================
  //  HELPERS para construir catálogo de docs reais (TJDFT)
  // ============================================================
  const SRC = "Peticao/TJDFT/";
  const SRC_ADV = "Peticao/AdvogadoGerados/";

  /**
   * Cria um item de template BASEADO EM DOCUMENTO REAL.
   * @param {string} id
   * @param {string} name
   * @param {string} icon
   * @param {string} sourceFile — nome do arquivo .docx em Peticao/TJDFT/
   * @returns {TplTemplateItem}
   */
  const realTpl = (id, name, icon, sourceFile) => ({
    id,
    name,
    icon,
    sourceFile: SRC + sourceFile,
    implemented: true,
  });

  /**
   * Cria um item de template ADVOGADO baseado em arquivo em AdvogadoGerados/.
   * @param {string} id
   * @param {string} name
   * @param {string} icon
   * @param {string} sourceFile — nome do arquivo .docx em Peticao/AdvogadoGerados/
   * @returns {TplTemplateItem}
   */
  const realTplAdv = (id, name, icon, sourceFile) => ({
    id,
    name,
    icon,
    sourceFile: SRC_ADV + sourceFile,
    implemented: true,
  });

  /**
   * Cria um item PENDENTE (sem documento real, esqueleto genérico).
   * @param {string} id
   * @param {string} name
   * @param {string} icon
   * @returns {TplTemplateItem}
   */
  const pendingTpl = (id, name, icon) => ({
    id,
    name,
    icon,
    pending: true,
  });

  // ============================================================
  //  CATÁLOGO PRINCIPAL
  // ============================================================
  /** @type {TplDocTemplateCategory[]} */
  const CATEGORIES = [
    // ================================================================
    //  CATEGORIA 1 — Petições Iniciais (TJDFT) — BASEADAS EM DOCUMENTOS REAIS
    // ================================================================
    {
      id: "tjdft",
      icon: "scale",
      name: "⚖️ Petições Iniciais — TJDFT (Docs Reais)",
      items: [
        // ---- 1.x GERAL --------------------------------------------------
        realTpl(
          "tjdft-1-1",
          "Petição Inicial Geral — contra Pessoa Física",
          "file-signature",
          "1.1 PETIÇÃO INICIAL - GERAL - contra PESSOA FÍSICA.docx",
        ),
        realTpl(
          "tjdft-1-2",
          "Petição Inicial Geral — contra Pessoa Jurídica",
          "file-signature",
          "1.2 PETIÇÃO INICIAL - GERAL - contra PESSOA JURÍDICA.docx",
        ),
        realTpl(
          "tjdft-1-3",
          "Petição Inicial Geral — contra Órgão GDF (Juizado da Fazenda)",
          "file-signature",
          "1.3 PETIÇÃO INICIAL - GERAL - contra Órgão GDF - Juizado da Fazenda do DF.docx",
        ),

        // ---- 2.x ACIDENTE DE TRÂNSITO -----------------------------------
        realTpl(
          "tjdft-2-1",
          "Acidente de Trânsito — 1 Autor x 1 Réu",
          "car-front",
          "2.1 ACIDENTE de TRÂNSITO - UM autor x UM requerido - reparação de danos.docx",
        ),
        realTpl(
          "tjdft-2-2",
          "Acidente de Trânsito — 1 Autor x 2 Réus",
          "car-front",
          "2.2 ACIDENTE de TRÂNSITO - UM autor x DOIS requeridos - reparação de danos.docx",
        ),
        realTpl(
          "tjdft-2-3",
          "Acidente de Trânsito — 2 Autores x 1 Réu",
          "car-front",
          "2.3 ACIDENTE de TRÂNSITO - DOIS autores x UM requerido - reparação de danos.docx",
        ),
        realTpl(
          "tjdft-2-4",
          "Acidente de Trânsito — 2 Autores x 2 Réus",
          "car-front",
          "2.4 ACIDENTE de TRÂNSITO - DOIS autores x DOIS requeridos - reparação de danos.docx",
        ),

        // ---- 3.x BANCOS / CARTÕES --------------------------------------
        realTpl(
          "tjdft-3-01",
          "Banco — Desconto Indevido em Conta (Repetição de Indébito)",
          "landmark",
          "3.01 BANCO – desconto indevido em conta – GERAL -  REPETIÇÃO INDÉBITO.docx",
        ),
        realTpl(
          "tjdft-3-02",
          "Banco — Cheque Clonado e Compensado (Ressarcimento)",
          "landmark",
          "3.02 BANCO – CHEQUE CLONADO e COMPENSADO  – Ressarcimento.docx",
        ),
        realTpl(
          "tjdft-3-03",
          "Banco — Cheque Clonado Devolvido s/ Fundos (Obrigação de Fazer)",
          "landmark",
          "3.03 BANCO – CHEQUE CLONADO e DEVOLVIDO SEM FUNDOS  – Obrigação de fazer.docx",
        ),
        realTpl(
          "tjdft-3-04",
          "Banco — Conta Salário: Taxa de Manutenção Indevida",
          "landmark",
          "3.04 BANCO – Abertura de CONTA SALÁRIO – Taxa de Manutenção INDEVIDA - REPETIÇÃO INDÉBITO.docx",
        ),
        realTpl(
          "tjdft-3-05",
          "Banco — Transações Bancárias Clandestinas (Nulidade)",
          "landmark",
          "3.05 BANCO – Transações bancárias clandestinas – NULIDADE de negócio jurídico.docx",
        ),
        realTpl(
          "tjdft-3-05-1",
          "Banco — Transações Clandestinas: Devolução em Dobro + Danos Morais",
          "landmark",
          "3.05.1 BANCO – transações bancárias clandestinas – nulidade - devolução em dobro e dano moral.docx",
        ),
        realTpl(
          "tjdft-3-06",
          "Cartão de Crédito — Compras Clandestinas (Nulidade)",
          "credit-card",
          "3.06 CARTÃO CRÉDITO – Compras clandestinas – NULIDADE de negócio jurídico.docx",
        ),
        realTpl(
          "tjdft-3-08",
          "Banco — Dívidas Reconhecidas: Retenção de Salário Teto 30%",
          "landmark",
          "3.08-BANCO-dívidas-reconhecidas-retenção-de-salário-limitar-ao-teto-de30-danos-morais-tutela-de-urgência.docx",
        ),
        realTpl(
          "tjdft-3-09",
          "Banco — Demora na Fila (Indenização Moral)",
          "landmark",
          "3.09 BANCO - Demora na fila - indenização moral.docx",
        ),
        realTpl(
          "tjdft-3-10",
          "Banco — Empréstimo Consignado: Falso Empréstimo (Fraude)",
          "landmark",
          "3.10 BANCO – Empréstimo Consignado –  FALSO EMPRÉSTIMO - fraude - nulidade - Tutela de URGÊNCIA.docx",
        ),
        realTpl(
          "tjdft-3-11",
          "Banco — Empréstimo Consignado: Oferta Recusada (Fraude)",
          "landmark",
          "3.11 BANCO – Empréstimo Consignado – OFERTA RECUSADA - fraude - nulidade -  Tutela de URGÊNCIA.docx",
        ),
        realTpl(
          "tjdft-3-12",
          "Banco — Empréstimo Consignado: Golpe da Falsa Portabilidade",
          "landmark",
          "3.12 BANCO – Empréstimo Consignado –  GOLPE FALSA PORTABILIDADE – fraude - nulidade – Tutela de URGÊNCIA.docx",
        ),
        realTpl(
          "tjdft-3-13",
          "Banco — Golpe do Boleto Falso (Dever de Indenizar)",
          "landmark",
          "3.13 BANCO – GOLPE DO BOLETO FALSO – Pagamento para TERCEIRO – dever de indenizar.docx",
        ),
        realTpl(
          "tjdft-3-14",
          "Banco — Transações Clandestinas: Golpe do Motoboy",
          "landmark",
          "3.14 BANCO – transações clandestinas – GOLPE DO MOTOBOY - nulidade – dever de indenizar.docx",
        ),
        realTpl(
          "tjdft-3-15",
          "Cartão de Crédito — Envio Sem Solicitação (Nulidade + Negativação)",
          "credit-card",
          "3.15 CARTÃO CRÉDITO – Envio SEM solicitação – NULIDADE de Contrato - COM negativação - tutela de URGÊNCIA.docx",
        ),
        realTpl(
          "tjdft-3-16",
          "Cartão de Crédito — Envio Sem Solicitação (Nulidade SEM Negativação)",
          "credit-card",
          "3.16 CARTÃO CRÉDITO – Envio SEM solicitação – NULIDADE de Contrato - SEM negativação.docx",
        ),

        // ---- 4.x COBRANÇA (GERAL) --------------------------------------
        realTpl(
          "tjdft-4-1-0",
          "Cobrança — Venda de Mercadoria: Falta de Pagamento",
          "receipt",
          "4.1.0 COBRANÇA - Venda de mercadoria - falta de pagamento.docx",
        ),
        realTpl(
          "tjdft-4-1-1",
          "Cobrança — Venda de Mercadoria: Cheque Prescrito",
          "receipt",
          "4.1.1 COBRANÇA - Venda de mercadoria - cheque prescrito - falta de pagamento.docx",
        ),
        realTpl(
          "tjdft-4-2-0",
          "Cobrança — Prestação de Serviço: Falta de Pagamento",
          "receipt",
          "4.2.0 COBRANÇA - Prestação de serviço - falta de pagamento.docx",
        ),
        realTpl(
          "tjdft-4-2-1",
          "Cobrança — Prestação de Serviço c/ Réu PJ: Falta de Pagamento",
          "receipt",
          "4.2.1 COBRANÇA - Prestação de serviço – Réu PJ – falta de pagamento.docx",
        ),
        realTpl(
          "tjdft-4-3",
          "Cobrança — Empréstimo de Dinheiro: Falta de Pagamento",
          "receipt",
          "4.3 COBRANÇA - Empréstimo de dinheiro - falta de pagamento.docx",
        ),
        realTpl(
          "tjdft-4-4-0",
          "Cobrança — Aluguel: Somente Locatário",
          "home",
          "4.4.0 COBRANÇA - Aluguel - somente LOCATÁRIO.docx",
        ),
        realTpl(
          "tjdft-4-4-1",
          "Cobrança — Aluguel: Somente Fiador",
          "home",
          "4.4.1 COBRANÇA - Aluguel - somente FIADOR.docx",
        ),
        realTpl(
          "tjdft-4-4-2",
          "Cobrança — Aluguel: Locatário + Fiador",
          "home",
          "4.4.2 COBRANÇA - Aluguel - contra  LOCATÁRIO e FIADOR.docx",
        ),

        // ---- 5.x COMPRA E VENDA (CONSUMIDOR) ---------------------------
        realTpl(
          "tjdft-5-1-0",
          "Compra e Venda — Produto Não Entregue: Rescisão + Devolução",
          "shopping-cart",
          "5.1.0 COMPRA E VENDA – produto NÃO entregue – rescisão contratual e devolução de quantia paga.docx",
        ),
        realTpl(
          "tjdft-5-1-1",
          "Compra e Venda — Produto Não Entregue: Obrigação de Entregar",
          "shopping-cart",
          "5.1.1 COMPRA E VENDA – produto NÃO entregue – obrigação de entregar.docx",
        ),
        realTpl(
          "tjdft-5-2-0",
          "Compra e Venda — Produto Defeituoso: Rescisão + Devolução",
          "shopping-cart",
          "5.2.0 COMPRA E VENDA – produto DEFEITUOSO – rescisão contratual e devolução de quantia paga.docx",
        ),
        realTpl(
          "tjdft-5-2-1",
          "Compra e Venda — Produto Defeituoso: Substituição",
          "shopping-cart",
          "5.2.1 COMPRA E VENDA – produto DEFEITUOSO – Substituição do produto.docx",
        ),
        realTpl(
          "tjdft-5-2-2",
          "Compra e Venda — Produto Defeituoso: Falta de Peças (Indenização)",
          "shopping-cart",
          "5.2.2 COMPRA E VENDA – Produto DEFEITUOSO – FALTA DE PEÇAS - Indenização material.docx",
        ),
        realTpl(
          "tjdft-5-3",
          "Compra e Venda — Acidente de Consumo (Indenização Material)",
          "shopping-cart",
          "5.3 COMPRA E VENDA – Acidente de consumo – Indenização material.docx",
        ),
        realTpl(
          "tjdft-5-4",
          "Compra e Venda via Comércio Eletrônico — Rescisão + Devolução",
          "shopping-cart",
          "5.4 COMPRA E VENDA via COMÉRCIO ELETRÔNICO - rescisão contratual e devolução de quantia paga.docx",
        ),
        realTpl(
          "tjdft-5-5",
          "Compra e Venda via Site Falso — Indenização Material",
          "shopping-cart",
          "5.5 COMPRA E VENDA via COMÉRCIO ELETRÔNICO – SITE FALSO – Indenização material.docx",
        ),

        // ---- 6.x VIZINHANÇA / CONDOMÍNIO -------------------------------
        realTpl(
          "tjdft-6-1",
          "Vizinhança — Perturbação do Sossego (Barulho)",
          "volume-x",
          "6.1 VIZINHANÇA – Perturbação do sossego – BARULHO.docx",
        ),
        realTpl(
          "tjdft-6-2",
          "Vizinhança — Direito de Construir (Acesso ao Imóvel Vizinho)",
          "home",
          "6.2 VIZINHANÇA – direito de CONSTRUIR – permissão de acesso ao imóvel do vizinho.docx",
        ),
        realTpl(
          "tjdft-6-3",
          "Vizinhança — Dever de Cautela Animal: Ataque Canino",
          "dog",
          "6.3 VIZINHANÇA – Dever de cautela ANIMAL – ATAQUE CANINO – Indenização material.docx",
        ),
        realTpl(
          "tjdft-6-4-0",
          "Vizinhança — Construção de Obra Nova: Dano em Imóvel (Indenização)",
          "home",
          "6.4.0 VIZINHANÇA – Construção de OBRA NOVA – dano em imóvel – indenização material.docx",
        ),
        realTpl(
          "tjdft-6-4-1",
          "Vizinhança — Construção de Obra Nova: Dever de Reparar Danos",
          "home",
          "6.4.1 VIZINHANÇA – Construção de OBRA NOVA – dano em imóvel – dever de reparar os danos.docx",
        ),
        realTpl(
          "tjdft-6-5-0",
          "Vizinhança — Infiltração de Água: Indenização Material",
          "home",
          "6.5.0 VIZINHANÇA – Infiltração de água – dano em imóvel – indenização material.docx",
        ),
        realTpl(
          "tjdft-6-5-1",
          "Vizinhança — Infiltração de Água: Obrigação de Reparar",
          "home",
          "6.5.1 VIZINHANÇA – Infiltração de água – dano em imóvel – obrigação de reparar os danos.docx",
        ),
        realTpl(
          "tjdft-6-6",
          "Condomínio — Furto de Bicicleta (Indenização Material)",
          "building",
          "6.6 CONDOMÍNIO – FURTO DE BICICLETA – Indenização material.docx",
        ),
        realTpl(
          "tjdft-6-7-0",
          "Condomínio — Multa Indevida e Não Paga: Cancelamento",
          "building",
          "6.7.0 CONDOMÍNIO – MULTA INDEVIDA e NÃO PAGA - Cancelamento da multa.docx",
        ),
        realTpl(
          "tjdft-6-7-1",
          "Condomínio — Multa Indevida e Paga: Declaratória + Restituição",
          "building",
          "6.7.1 CONDOMÍNIO – MULTA INDEVIDA e PAGA - Declaratória e Restituição.docx",
        ),

        // ---- 7.x DESPEJO -----------------------------------------------
        realTpl(
          "tjdft-7-1",
          "Despejo para Uso Próprio",
          "door-open",
          "7.1 DESPEJO para uso próprio.docx",
        ),

        // ---- 8.x ENSINO ------------------------------------------------
        realTpl(
          "tjdft-8-3",
          "Ensino — Contrato Res. pelo Autor: Aulas Não Iniciadas (Devolução)",
          "graduation-cap",
          "8.3 ENSINO – Contrato rescindido pelo AUTOR – Aulas NÃO iniciadas – devolução de quantia.docx",
        ),
        realTpl(
          "tjdft-8-4",
          "Ensino — Contrato Res. pelo Réu: Devolução de Quantia",
          "graduation-cap",
          "8.4 ENSINO – Contrato rescindido pelo RÉU – devolução de quantia.docx",
        ),

        // ---- 9.x EXECUÇÃO EXTRAJUDICIAL --------------------------------
        realTpl(
          "tjdft-9-1",
          "Execução Extrajudicial — Cheque (Inadimplemento)",
          "scroll-text",
          "9.1 Execução Extrajudicial - CHEQUE - inadimplemento.docx",
        ),
        realTpl(
          "tjdft-9-2",
          "Execução Extrajudicial — Nota Promissória (Inadimplemento)",
          "scroll-text",
          "9.2 Execução Extrajudicial - NOTA PROMISSÓRIA - inadimplemento.docx",
        ),
        realTpl(
          "tjdft-9-3-0",
          "Execução Extrajudicial — Duplicata c/ Aceite (Inadimplemento)",
          "scroll-text",
          "9.3.0 Execução Extrajudicial - DUPLICATA - com aceite - inadimplemento.docx",
        ),
        realTpl(
          "tjdft-9-3-1",
          "Execução Extrajudicial — Duplicata s/ Aceite + Protesto",
          "scroll-text",
          "9.3.1 Execução Extrajudicial - DUPLICATA - sem aceite - protesto - inadimplemento.docx",
        ),
        realTpl(
          "tjdft-9-4-0",
          "Execução Extrajudicial — Contrato de Locação: Locatário",
          "scroll-text",
          "9.4.0 Execução Extrajudicial - CONTRATO DE LOCAÇÃO -  LOCATÁRIO.docx",
        ),
        realTpl(
          "tjdft-9-4-1",
          "Execução Extrajudicial — Contrato de Locação: Fiador Solidário",
          "scroll-text",
          "9.4.1 Execução Extrajudicial - CONTRATO DE LOCAÇÃO -  FIADOR SOLIDÁRIO.docx",
        ),
        realTpl(
          "tjdft-9-4-2",
          "Execução Extrajudicial — Contrato de Locação: Locatário + Fiador",
          "scroll-text",
          "9.4.2 Execução Extrajudicial - CONTRATO DE LOCAÇÃO -  LOCATÁRIO e FIADOR.docx",
        ),
        realTpl(
          "tjdft-9-5-0",
          "Execução Extrajudicial — Contrato c/ 2 Testemunhas: Obrigação de Fazer",
          "scroll-text",
          "9.5.0 Execução Extrajudicial - CONTRATO com 2 TESTEMUNHAS -  obrigação de fazer.docx",
        ),
        realTpl(
          "tjdft-9-5-1",
          "Execução Extrajudicial — Contrato c/ 2 Testemunhas: $ + Fazer",
          "scroll-text",
          "9.5.1 Execução Extrajudicial - CONTRATO com 2 TESTEMUNHAS -  pagar quantia certa e obrigação de fazer.docx",
        ),
        realTpl(
          "tjdft-9-5-2",
          "Execução Extrajudicial — Contrato c/ 2 Testemunhas: Pagar Quantia Certa",
          "scroll-text",
          "9.5.2 Execução Extrajudicial - CONTRATO com 2 TESTEMUNHAS -  pagar quantia certa.docx",
        ),

        // ---- 10.x EXECUÇÃO JUDICIAL ------------------------------------
        realTpl(
          "tjdft-10-1",
          "Execução — Título Judicial: Sent. Homologatória: Pagar Quantia Certa",
          "gavel",
          "10.1 EXECUÇÃO - título judicial - sentença homologatória - pagar quantia certa.docx",
        ),
        realTpl(
          "tjdft-10-2",
          "Execução — Título Judicial: Sent. Homologatória: Obrigação de Fazer",
          "gavel",
          "10.2 EXECUÇÃO - título judicial - sentença homologatória - obrigação de fazer.docx",
        ),
        realTpl(
          "tjdft-10-3",
          "Execução — Título Judicial: $ + Obrigação de Fazer",
          "gavel",
          "10.3 EXECUÇÃO - título judicial - sentença homologatória - pagar quantia certa e obrigação de fazer.docx",
        ),

        // ---- 11.x LOCAÇÃO DE IMÓVEL (AÇÕES DIVERSAS) ------------------
        realTpl(
          "tjdft-11-1-0",
          "Locação — Cobrança de Aluguel: Somente Locatário",
          "home",
          "11.1.0 COBRANÇA - Aluguel - somente LOCATÁRIO.docx",
        ),
        realTpl(
          "tjdft-11-1-1",
          "Locação — Cobrança de Aluguel: Somente Fiador",
          "home",
          "11.1.1 COBRANÇA - Aluguel - somente FIADOR.docx",
        ),
        realTpl(
          "tjdft-11-1-2",
          "Locação — Cobrança de Aluguel: Locatário + Fiador",
          "home",
          "11.1.2 COBRANÇA - Aluguel - contra  LOCATÁRIO e FIADOR.docx",
        ),
        realTpl(
          "tjdft-11-1-3",
          "Locação — Ação Regressiva: Fiador-avalista vs Inquilino",
          "home",
          "11.1.3 Locação de imóvel – Ação regressiva – Fiador-avalista contra inquilino - ressarcimento.docx",
        ),
        realTpl(
          "tjdft-11-2-0",
          "Locação — Exec. Extrajudicial Contrato: Locatário",
          "home",
          "11.2.0 Execução Extrajudicial - CONTRATO DE LOCAÇÃO -  LOCATÁRIO.docx",
        ),
        realTpl(
          "tjdft-11-2-1",
          "Locação — Exec. Extrajudicial Contrato: Fiador Solidário",
          "home",
          "11.2.1 Execução Extrajudicial - CONTRATO DE LOCAÇÃO -  FIADOR SOLIDÁRIO.docx",
        ),
        realTpl(
          "tjdft-11-2-2",
          "Locação — Exec. Extrajudicial Contrato: Locatário + Fiador",
          "home",
          "11.2.2 Execução Extrajudicial - CONTRATO DE LOCAÇÃO -  LOCATÁRIO e FIADOR.docx",
        ),
        realTpl(
          "tjdft-11-3",
          "Locação — Adm. de Imóvel: Quebra de Contrato (Rescisão + Indenização)",
          "home",
          "11.3 Locação de imóvel – administração de imóvel – quebra de contrato – rescisão e indenização.docx",
        ),
        realTpl(
          "tjdft-11-4",
          "Locação — Rescisão Antecipada pela Imobiliária: Indenização Material",
          "home",
          "11.4 Locação de imóvel – Locatário x Imobiliária – rescisão antecipada pela imobiliária – indenização material.docx",
        ),
        realTpl(
          "tjdft-11-4-1",
          "Locação — Rescisão Antecipada pelo Locador PF: Indenização Material",
          "home",
          "11.4.1 Locação de imóvel – Locatário x locador (PF) – rescisão antecipada pelo locador – indenização material.docx",
        ),
        realTpl(
          "tjdft-11-5",
          "Locação — Rescisão Imobiliária: Indenização Material + Moral",
          "home",
          "11.5 Locação de imóvel – Locatário x Imobiliária – rescisão antecipada pela imobiliária – indenização material e moral.docx",
        ),
        realTpl(
          "tjdft-11-5-1",
          "Locação — Rescisão Locador PF: Indenização Material + Moral",
          "home",
          "11.5.1 Locação de imóvel – Locatário x locador (PF) – rescisão antecipada pelo locador – indenização material e moral.docx",
        ),
        realTpl(
          "tjdft-11-6",
          "Locação — Caução Não Devolvida (Restituição)",
          "home",
          "11.6 Locação de imóvel – Locatário x Imobiliária – caução não devolvida – restituição.docx",
        ),
        realTpl(
          "tjdft-11-7",
          "Locação — Aluguel Antecipado: Desocupação (Restituição) — Imobiliária",
          "home",
          "11.7 Locação de imóvel – Locatário x Imobiliária – aluguel antecipado – desocupação do imóvel – restituição.docx",
        ),
        realTpl(
          "tjdft-11-7-1",
          "Locação — Aluguel Antecipado: Desocupação (Restituição) — Locador PF",
          "home",
          "11.7.1 Locação de imóvel – Locatário x locador (PF) – aluguel antecipado – desocupação do imóvel – restituição.docx",
        ),
        realTpl(
          "tjdft-11-8",
          "Locação — Vistoria Pendente: Rescisão + Entrega das Chaves — Imobiliária",
          "home",
          "11.8 Locação de imóvel – Locatário x Imobiliária – rescisão – vistoria pendente – rescisão e entrega das chaves.docx",
        ),
        realTpl(
          "tjdft-11-8-1",
          "Locação — Vistoria Pendente: Rescisão + Chaves — Locador PF",
          "home",
          "11.8.1 Locação de imóvel – Locatário x locador (PF) – rescisão - vistoria pendente – rescisão e entrega das chaves.docx",
        ),
        realTpl(
          "tjdft-11-9",
          "Locação — Cobrança Vexatória-Abusiva: Indenização Moral — Imobiliária",
          "home",
          "11.9 Locação de imóvel – Locatário x Imobiliária – cobrança vexatória-abusiva – indenização moral.docx",
        ),
        realTpl(
          "tjdft-11-9-1",
          "Locação — Cobrança Vexatória-Abusiva: Indenização Moral — Locador PF",
          "home",
          "11.9.1 Locação de imóvel – Locatário x locador (PF) – cobrança vexatória-abusiva – indenização moral.docx",
        ),
        realTpl(
          "tjdft-11-10",
          "Locação — Imóvel Sem Condições Habitáveis: Rescisão + Indenização — Imobiliária",
          "home",
          "11.10 Locação de imóvel – Locatário x Imobiliária – imóvel sem condições habitáveis  – rescisão e indenização.docx",
        ),
        realTpl(
          "tjdft-11-10-1",
          "Locação — Imóvel Sem Condições Habitáveis: Rescisão + Indenização — Locador PF",
          "home",
          "11.10.1 Locação de imóvel – Locatário x locador (PF) – imóvel sem condições habitáveis – rescisão e indenização.docx",
        ),
        realTpl(
          "tjdft-11-11",
          "Locação — Imóvel Sem Condições Habitáveis: Sanar Defeitos — Imobiliária",
          "home",
          "11.11 Locação de imóvel – Locatário x Imobiliária – imóvel sem condições habitáveis – sanar os defeitos.docx",
        ),
        realTpl(
          "tjdft-11-11-1",
          "Locação — Imóvel Sem Condições Habitáveis: Sanar Defeitos — Locador PF",
          "home",
          "11.11.1 Locação de imóvel – Locatário x Locador (PF) – imóvel sem condições habitáveis – sanar os defeitos.docx",
        ),

        // ---- 12.x NEGATIVAÇÃO INDEVIDA ---------------------------------
        realTpl(
          "tjdft-12-1",
          "Negativação Indevida — Dívida Paga: Baixa + Indenização + Tutela",
          "alert-triangle",
          "12.1 NEGATIVAÇÃO INDEVIDA - dívida paga - baixa da restrição - indenização - antecipação de tutela.docx",
        ),
        realTpl(
          "tjdft-12-2",
          "Negativação Indevida — Falta de Notificação Prévia: Baixa + Indenização",
          "alert-triangle",
          "12.2 NEGATIVAÇÃO INDEVIDA – FALTA DE NOTIFICAÇÃO PRÉVIA – baixa da restrição - indenização.docx",
        ),
        realTpl(
          "tjdft-12-3",
          "Negativação Indevida — Fraude Contratual: Baixa + Indenização",
          "alert-triangle",
          "12.3 NEGATIVAÇÃO INDEVIDA - fraude contratual - baixa da restrição - indenização.docx",
        ),
        realTpl(
          "tjdft-12-4",
          "Negativação Indevida — Reconhecimento Judicial Anterior: Baixa + $",
          "alert-triangle",
          "12.4 Negativação indevida – RECONHECIMENTO JUDICIAL ANTERIOR – baixa da restrição - indenização.docx",
        ),
        realTpl(
          "tjdft-12-5",
          "Negativação Indevida — Cheque Antecipado: Baixa + $ + Tutela Urgência",
          "alert-triangle",
          "12.5 Negativação indevida – CHEQUE ANTECIPADO – baixa da restrição - indenização - tutela de urgência.docx",
        ),
        realTpl(
          "tjdft-12-6",
          "Negativação Indevida — Dívida Não Reconhecida: Baixa + $ + Tutela",
          "alert-triangle",
          "12.6 NEGATIVAÇÃO INDEVIDA - dívida NÃO reconhecida - baixa da restrição - indenização - antecipação de tutela.docx",
        ),

        // ---- 13.x TURISMO ----------------------------------------------
        realTpl(
          "tjdft-13-1",
          "Turismo — Seguro Viagem: Não Cobertura de Gastos (Ressarcimento)",
          "plane",
          "13.1 TURISMO – Seguro Viagem – NÃO cobertura de gastos - Ressarcimentonovo.docx",
        ),
        realTpl(
          "tjdft-13-2-0",
          "Turismo — Rescisão pelo Autor: Multa Rescisória Abusiva — Cancelamento",
          "plane",
          "13.2.0 TURISMO – Rescisão pelo AUTOR – multa rescisória abusiva – rescisão de contrato vigente.docx",
        ),
        realTpl(
          "tjdft-13-2-1",
          "Turismo — Rescisão pelo Autor: Multa Abusiva — Revisão do Cancelamento",
          "plane",
          "13.2.1 TURISMO – Rescisão pelo AUTOR – multa rescisória abusiva – revisão do cancelamento.docx",
        ),
        realTpl(
          "tjdft-13-3-0",
          "Turismo — Falha do Serviço: Multa Abusiva — Rescisão",
          "plane",
          "13.3.0 TURISMO – FALHA  DO SERVIÇO  – multa rescisória abusiva – rescisão de contrato.docx",
        ),
        realTpl(
          "tjdft-13-3-1",
          "Turismo — Falha do Serviço: Multa Abusiva — Revisão Reembolso",
          "plane",
          "13.3.1 TURISMO – FALHA  DO SERVIÇO – multa rescisória abusiva – revisão do valor reembolsado.docx",
        ),

        // ---- 14.x PLANO DE SAÚDE ---------------------------------------
        realTpl(
          "tjdft-14-1",
          "Plano de Saúde — Portabilidade na Mesma Operadora: Não Efetivação",
          "heart-pulse",
          "14.1 PLANO DE SAÚDE – PORTABILIDADE na MESMA OPERADORA – NÃO EFETIVAÇÃO – Restituição.docx",
        ),
        realTpl(
          "tjdft-14-2",
          "Plano de Saúde — Portabilidade p/ Outra Operadora: Não Efetivação",
          "heart-pulse",
          "14.2 PLANO DE SAÚDE – PORTABILIDADE outra OPERADORA – NÃO EFETIVAÇÃO – Restituição.docx",
        ),
        realTpl(
          "tjdft-14-3",
          "Plano de Saúde — Cancelamento Indevido: Negativa de Atendimento (Reembolso)",
          "heart-pulse",
          "14.3 PLANO DE SAÚDE – Cancelamento indevido – NEGATIVA DE ATENDIMENTO - reembolso.docx",
        ),
        realTpl(
          "tjdft-14-4",
          "Plano de Saúde — Contrato Adimplente: Negativa de Cobertura (Reembolso)",
          "heart-pulse",
          "14.4 PLANO DE SAÚDE – contrato vigente e adimplido - NEGATIVA DE COBERTURA - reembolso.docx",
        ),

        // ---- 15.x PRESTAÇÃO DE SERVIÇO ---------------------------------
        realTpl(
          "tjdft-15-1",
          "Prestação de Serviço — Réu PJ: Serviço Não Executado (Cumprir Contrato)",
          "briefcase",
          "15.1 PRESTAÇÃO DE SERVIÇO – RÉU PJ - Serviço NÃO executado – Cumprir o Contrato.docx",
        ),
        realTpl(
          "tjdft-15-2",
          "Prestação de Serviço — Réu PF: Serviço Não Executado (Cumprir Contrato)",
          "briefcase",
          "15.2 PRESTAÇÃO DE SERVIÇO – RÉU PF - Serviço NÃO executado – Cumprir o Contrato.docx",
        ),
        realTpl(
          "tjdft-15-3",
          "Prestação de Serviço — Réu PJ: Serviço Não Exec (Rescisão + Restituição)",
          "briefcase",
          "15.3 PRESTAÇÃO DE SERVIÇO – RÉU PJ - Serviço NÃO executado – Rescisão com Restituição.docx",
        ),
        realTpl(
          "tjdft-15-4",
          "Prestação de Serviço — Réu PF: Serviço Não Exec (Rescisão + Restituição)",
          "briefcase",
          "15.4 PRESTAÇÃO DE SERVIÇO – RÉU PF - Serviço NÃO executado – Rescisão com restituição.docx",
        ),
        realTpl(
          "tjdft-15-5",
          "Prestação de Serviço — Motorista App: Descredenciamento Arbitrário",
          "briefcase",
          "15.5 Prestação de serviço – motorista por aplicativo – descredenciamento arbitrário – reativar conta e indenizar.docx",
        ),
        realTpl(
          "tjdft-15-6",
          "Prestação de Serviço — Réu PJ: Golpe da Falsa Agência de Veículo",
          "briefcase",
          "15.6 Prestação de serviço – RÉU PJ – GOLPE DA FALSA AGENCIA DE VEÍCULO.docx",
        ),

        // ---- 16.x TELEFONIA --------------------------------------------
        realTpl(
          "tjdft-16-1",
          "Telefonia — Cobranças Indevidas Geral (Descumprimento Contratual)",
          "phone",
          "16.1 TELEFONIA- cobranças indevidas GERAL – descumprimento contratual - GERAL.docx",
        ),
        realTpl(
          "tjdft-16-2",
          "Telefonia — Cobranças Indevidas: Faturas Pagas (Devolução em Dobro)",
          "phone",
          "16.2 TELEFONIA – cobranças indevidas GERAL – FATURAS PAGAS – devolução em dobro.docx",
        ),
        realTpl(
          "tjdft-16-3",
          "Telefonia — Cobranças Indevidas: Faturas Não Pagas (Revisão)",
          "phone",
          "16.3 TELEFONIA – cobranças indevidas GERAL – FATURAS NÃO PAGAS – revisão dos valores.docx",
        ),
        realTpl(
          "tjdft-16-4",
          "Telefonia — Pedido de Rescisão Não Efetivado: Faturas Pagas",
          "phone",
          "16.4 TELEFONIA – Pedido de RESCISÃO não efetivado – FATURAS PAGAS – devolução em dobro.docx",
        ),
        realTpl(
          "tjdft-16-5",
          "Telefonia — Pedido de Rescisão Não Efetivado: Faturas Não Pagas",
          "phone",
          "16.5 TELEFONIA – Pedido de RESCISÃO não efetivado – FATURAS NÃO PAGAS – revisão dos valores.docx",
        ),
        realTpl(
          "tjdft-16-6",
          "Telefonia — Inclusão de Serviço Não Solicitado (Revisão de Valores)",
          "phone",
          "16.6 TELEFONIA – inclusão de SERVIÇO NÃO SOLICITADO – revisar os valores.docx",
        ),
        realTpl(
          "tjdft-16-7",
          "Telefonia — Cancelamento/Bloqueio Indevido (Obrigação de Fazer)",
          "phone",
          "16.7 TELEFONIA – CANCELAMENTO-BLOQUEIO DE SERVIÇO indevido – obrigação de fazer.docx",
        ),

        // ---- 17.x TRANSPORTE AÉREO -------------------------------------
        realTpl(
          "tjdft-17-1",
          "Transporte Aéreo — Atraso de Voo (Indenização Material)",
          "plane",
          "17.1 TRANSPORTE AÉREO - Atraso de voo – indenização material.docx",
        ),
        realTpl(
          "tjdft-17-2",
          "Transporte Aéreo — Cancelamento Unilateral (Coronavírus): Multa Abusiva",
          "plane",
          "17.2 TRANSPORTE ÁEREO - Cancelamento unilateral - CORONAVÍRUS - Abusividade de multa - Reembolso.docx",
        ),
        realTpl(
          "tjdft-17-3",
          "Transporte Aéreo — Cancelamento pela Operadora (Indenização Material)",
          "plane",
          "17.3 TRANSPORTE AÉREO - Cancelamento de voo pela operadora – indenização material.docx",
        ),
        realTpl(
          "tjdft-17-4",
          "Transporte Aéreo — Dano em Mala (Indenização Material)",
          "briefcase-business",
          "17.4 TRANSPORTE AÉREO - Dano em mala - indenização material.docx",
        ),
        realTpl(
          "tjdft-17-5",
          "Transporte Aéreo — Desistência pelo Consumidor: Multa Abusiva",
          "plane",
          "17.5 TRANSPORTE AÉREO – Desistência pelo consumidor – tempo razoável - abusividade de multa - Reembolso.docx",
        ),
        realTpl(
          "tjdft-17-6",
          "Transporte Aéreo — Extravio de Bagagem (Indenização Material)",
          "briefcase-business",
          "17.6 TRANSPORTE AÉREO - Extravio de bagagem - indenização material.docx",
        ),
        realTpl(
          "tjdft-17-7",
          "Transporte Aéreo — Perda de Check-In / No-Show: Multa Rescisória Abusiva",
          "plane",
          "17.7 TRANSPORTE AÉREO - Perda de Check-In – No show - abusividade de multa rescisória – devolução integral.docx",
        ),
        realTpl(
          "tjdft-17-8",
          "Transporte Aéreo — Preterição no Embarque: Overbooking (Indenização Material)",
          "plane",
          "17.8 TRANSPORTE AÉREO – preterição no embarque - OVERBOOKING – indenização material.docx",
        ),
        realTpl(
          "tjdft-17-9",
          "Transporte Aéreo — Violação e Extravio de Objetos na Bagagem",
          "briefcase-business",
          "17.9 TRANSPORTE AÉREO - Violação e extravio de objetos na bagagem - indenização material.docx",
        ),

        // ---- 18.x TRANSPORTE RODOVIÁRIO --------------------------------
        realTpl(
          "tjdft-18-1",
          "Transporte Rodoviário — Pane Ônibus: Demora na Troca (Indenização)",
          "bus",
          "18.1 TRANSPORTE RODOVIÁRIO -  pane ônibus - demora na troca – indenização material.docx",
        ),
        realTpl(
          "tjdft-18-2",
          "Transporte Rodoviário — Atraso no Embarque (Indenização Material)",
          "bus",
          "18.2 TRANSPORTE RODOVIÁRIO - Atraso no embarque – indenização material.docx",
        ),
        realTpl(
          "tjdft-18-3",
          "Transporte Rodoviário — Dano em Mala (Indenização Material)",
          "briefcase-business",
          "18.3 TRANSPORTE RODOVIÁRIO - Dano em mala - indenização material.docx",
        ),
        realTpl(
          "tjdft-18-4",
          "Transporte Rodoviário — Extravio de Bagagem (Indenização Material)",
          "briefcase-business",
          "18.4 TRANSPORTE RODOVIÁRIO - Extravio de bagagem - indenização material.docx",
        ),
        realTpl(
          "tjdft-18-5",
          "Transporte Rodoviário — Preterição no Embarque: Overbooking",
          "bus",
          "18.5 TRANSPORTE RODOVIÁRIO – preterição no embarque - OVERBOOKING – indenização material.docx",
        ),
        realTpl(
          "tjdft-18-6",
          "Transporte Rodoviário — Violação e Extravio de Objetos",
          "briefcase-business",
          "18.6 TRANSPORTE RODOVIÁRIO - Violação e extravio de objetos na bagagem - indenização material.docx",
        ),

        // ---- 19.x VEÍCULO ----------------------------------------------
        realTpl(
          "tjdft-19-01",
          "Veículo — Dano Intencional: Crime de Dano (Indenização Material)",
          "car",
          "19.01 VEÍCULO – DANO INTENCIONAL – Crime de dano – Indenização material.docx",
        ),
        realTpl(
          "tjdft-19-02",
          "Veículo — Furto de Objetos em Estacionamento (Arrombamento)",
          "car",
          "19.02 VEÍCULO – FURTO de objetos em ESTACIONAMENTO - arrombamento – Indenização material.docx",
        ),
        realTpl(
          "tjdft-19-03",
          "Veículo — Furto do Veículo em Estacionamento (Irrecuperável)",
          "car",
          "19.03 VEÍCULO – FURTO do Veículo em ESTACIONAMENTO – irrecuperável – Indenização material.docx",
        ),
        realTpl(
          "tjdft-19-04-0",
          "Veículo — Réu PF: Compra e Venda c/ Vício Oculto (Ressarcimento)",
          "car",
          "19.04.0 VEÍCULO – Réu PF - Compra e venda – VÍCIO OCULTO – Ressarcimento.docx",
        ),
        realTpl(
          "tjdft-19-04-1",
          "Veículo — Réu PJ: Compra e Venda c/ Vício Oculto (Ressarcimento)",
          "car",
          "19.04.1 VEÍCULO – Réu PJ - Compra e venda – VÍCIO OCULTO – Ressarcimento.docx",
        ),
        realTpl(
          "tjdft-19-05",
          "Veículo — Réu PJ: Compra c/ Troca: Débitos + Transferência",
          "car",
          "19.05 VEÍCULO – Réu PJ - Compra com troca – débitos e TRANSFERÊNCIA.docx",
        ),
        realTpl(
          "tjdft-19-06-1",
          "Veículo — Réu PF: Compra e Venda Particular SEM Débitos + Transf.",
          "car",
          "19.06.1 VEÍCULO – Réu PF - Compra e Venda PARTICULAR – SEM débitos e TRANSFERÊNCIA.docx",
        ),
        realTpl(
          "tjdft-19-07",
          "Veículo — Réu PF: Venda c/ Ágio: Débitos Vencidos (Parte Pg. pelo Autor)",
          "car",
          "19.07 VEÍCULO – Réu PF - Venda com ÁGIO – Débitos vencidos – Em parte PAGOS pelo autor.docx",
        ),
        realTpl(
          "tjdft-19-08",
          "Veículo — Réu PF: Venda c/ Ágio: Débitos Vencidos NÃO Pagos",
          "car",
          "19.08 VEÍCULO – Réu PF - Venda com ÁGIO – Débitos vencidos e NÃO PAGOS pelo autor.docx",
        ),
        realTpl(
          "tjdft-19-09",
          "Veículo — Réu PF: Compra e Venda c/ Defeito Grave (Rescisão)",
          "car",
          "19.09 VEÍCULO – Réu PF - Compra e venda – DEFEITO GRAVE – Rescisão.docx",
        ),
        realTpl(
          "tjdft-19-09-1",
          "Veículo — Réu PJ: Compra e Venda c/ Defeito Grave (Rescisão)",
          "car",
          "19.09.1 VEÍCULO – Réu PJ - Compra e venda – DEFEITO GRAVE – Rescisão.docx",
        ),
        realTpl(
          "tjdft-19-10",
          "Veículo — Réu PF: Compra e Venda — Débitos Anteriores",
          "car",
          "19.10 VEÍCULO – Réu PF - Compra e Venda – DÉBITOS ANTERIORES – dever do vendedor.docx",
        ),
        realTpl(
          "tjdft-19-11-0",
          "Veículo — Réu PF: Compra e Venda — Documentação Pendente",
          "car",
          "19.11.0 VEÍCULO – Réu PF - Compra e Venda – DOCUMENTAÇÃO PENDENTE – dever do vendedor.docx",
        ),
        realTpl(
          "tjdft-19-11-1",
          "Veículo — Réu PJ: Compra e Venda — Documentação Pendente",
          "car",
          "19.11.1 VEÍCULO – Réu PJ - Compra e Venda – DOCUMENTAÇÃO PENDENTE – dever do vendedor.docx",
        ),
        realTpl(
          "tjdft-19-12",
          "Veículo — Contrato de Seguro: Sinistro — Não Cobertura do Conserto",
          "shield",
          "19.12 VEÍCULO – Contrato de SEGURO – sinistro – NÃO cobertura do conserto – dever de reparar.docx",
        ),
        realTpl(
          "tjdft-19-13",
          "Veículo — Contrato de Seguro: Sinistro — Ressarcimento",
          "shield",
          "19.13 VEÍCULO – Contrato de SEGURO – sinistro – NÃO cobertura do conserto - ressarcimento.docx",
        ),
        realTpl(
          "tjdft-19-14",
          "Veículo — Réu PF: Compra e Venda — Falta de Pagamento (Devolução)",
          "car",
          "19.14 VEÍCULO – Réu PF - Compra e venda – FALTA DE PAGAMENTO – devolução do veículo.docx",
        ),
        realTpl(
          "tjdft-19-15",
          "Veículo — Zero KM: Defeito no Produto (Garantia Recusada)",
          "car",
          "19.15 VEÍCULO – ZERO KM – DEFEITO NO PRODUTO – GARANTIA RECUSADA.docx",
        ),

        // ---- 20.x FAZENDA PÚBLICA / GDF --------------------------------
        realTpl(
          "tjdft-20-01",
          "Fazenda — Réu GDF: Servidor Ativo — Exercícios Financeiros Não Pagos",
          "building-2",
          "20.01 FAZENDA – Réu GDF - servidor ATIVO – Exercícios financeiros não pagos.docx",
        ),
        realTpl(
          "tjdft-20-02",
          "Fazenda — Réu GDF: Servidor Inativo — Exercícios Findos Não Pagos",
          "building-2",
          "20.02 FAZENDA - Réu GDF - servidor INATIVO - Exercícios findos não pagos.docx",
        ),
        realTpl(
          "tjdft-20-03",
          "Fazenda — Réu GDF: Servidor Ativo — Reconhecimento de Gratificação",
          "building-2",
          "20.03 FAZENDA – Réu GDF - servidor ATIVO – Reconhecimento de gratificação.docx",
        ),
        realTpl(
          "tjdft-20-04",
          "Fazenda — Réu GDF: Não Fornecimento de Medicação (Ressarcimento)",
          "building-2",
          "20.04 FAZENDA – Réu GDF – NÃO fornecimento de medicação – Ressarcimento.docx",
        ),
        realTpl(
          "tjdft-20-05",
          "Fazenda — Réu GDF: Saúde — Cirurgia (Tutela de Urgência)",
          "building-2",
          "20.05 FAZENDA – Réu GDF – Saúde – CIRURGIA - Tutela de URGÊNCIA.docx",
        ),
        realTpl(
          "tjdft-20-06",
          "Fazenda — Réu GDF: Saúde — Exame (Tutela de Urgência)",
          "building-2",
          "20.06 FAZENDA – Réu GDF – Saúde – EXAME - Tutela de URGÊNCIA.docx",
        ),
        realTpl(
          "tjdft-20-07",
          "Fazenda — Réu GDF: Saúde — Medicamento (Tutela de Urgência)",
          "building-2",
          "20.07 FAZENDA – Réu GDF – Saúde – MEDICAMENTO - Tutela de URGÊNCIA.docx",
        ),
        realTpl(
          "tjdft-20-08",
          "Fazenda — Réu GDF: Saúde — Tratamento (Tutela de Urgência)",
          "building-2",
          "20.08 FAZENDA – Réu GDF – Saúde – TRATAMENTO - Tutela de URGÊNCIA.docx",
        ),
        realTpl(
          "tjdft-20-09",
          "Fazenda — Réu GDF-DER: Buraco na Pista (Ressarcimento)",
          "construction",
          "20.09 FAZENDA – Réu GDF-DER – BURACO NA PISTA – ressarcimento de custo.docx",
        ),
        realTpl(
          "tjdft-20-10",
          "Fazenda — Réu GDF-NOVACAP: Buraco na Pista (Ressarcimento)",
          "construction",
          "20.10 FAZENDA – Réu GDF-NOVACAP – BURACO NA PISTA – ressarcimento de custo.docx",
        ),
        realTpl(
          "tjdft-20-11",
          "Fazenda — Réu GDF-DETRAN: Baixa de Registro de Veículo — IPVA",
          "building-2",
          "20.11 FAZENDA – Réu GDF-DETRAN – BAIXA DE REGISTRO DE VEÍCULO – débitos de IPVA.docx",
        ),
        realTpl(
          "tjdft-20-12-0",
          "Fazenda — Réu GDF-DETRAN: Venda de Veículo — Negativa de Propriedade",
          "building-2",
          "20.12.0 FAZENDA – Réu GDF-DETRAN – Venda de Veículo – NEGATIVA de PROPRIEDADE – Débitos de IPVA.docx",
        ),
        realTpl(
          "tjdft-20-12-1",
          "Fazenda — Réu DETRAN: Venda de Veículo — Comunicado + Negativa",
          "building-2",
          "20.12.1 FAZENDA – Réu DETRAN – Venda de Veículo – Comunicado de venda - NEGATIVA de PROPRIEDADE.docx",
        ),
        realTpl(
          "tjdft-20-13",
          "Fazenda — Réu DER + DETRAN: Nulidade de Multa",
          "building-2",
          "20.13 FAZENDA – Réu DER - DETRAN – NULIDADE DE MULTA.docx",
        ),
        realTpl(
          "tjdft-20-14",
          "Fazenda — Réu DETRAN: Nulidade de Multa",
          "building-2",
          "20.14 FAZENDA – Réu DETRAN – NULIDADE DE MULTA.docx",
        ),
        realTpl(
          "tjdft-20-15",
          "Fazenda — Réu DER: Nulidade de Multa",
          "building-2",
          "20.15 FAZENDA – Réu DER – NULIDADE DE MULTA.docx",
        ),
        realTpl(
          "tjdft-20-16",
          "Fazenda — Réu DER+DETRAN: Nulidade de Multa (Falta Notificação)",
          "building-2",
          "20.16 FAZENDA – Réu DER-DETRAN – NULIDADE DE MULTA – falta de NOTIFICAÇÃO.docx",
        ),
        realTpl(
          "tjdft-20-17",
          "Fazenda — Réu DETRAN: Nulidade de Multa (Falta Notificação)",
          "building-2",
          "20.17 FAZENDA – Réu DETRAN – NULIDADE DE MULTA – falta de NOTIFICAÇÃO.docx",
        ),
        realTpl(
          "tjdft-20-18",
          "Fazenda — Réu DER: Nulidade de Multa (Falta Notificação)",
          "building-2",
          "20.18 FAZENDA – Réu DER – NULIDADE DE MULTA – falta de NOTIFICAÇÃO.docx",
        ),
        realTpl(
          "tjdft-20-19",
          "Fazenda — Réu DETRAN: Baixa de Registro de Veículo",
          "building-2",
          "20.19 FAZENDA – Réu DETRAN – BAIXA DE REGISTRO DE VEÍCULO.docx",
        ),
        realTpl(
          "tjdft-20-20",
          "Fazenda — Réu DETRAN: Clonagem de Placa — Nulidade de Multa",
          "building-2",
          "20.20 FAZENDA – Réu DETRAN – CLONAGEM de PLACA – NULIDADE DE MULTA.docx",
        ),
        realTpl(
          "tjdft-20-21",
          "Fazenda — Réu DER+DETRAN: CNH — Transferência de Pontuação",
          "id-card",
          "20.21 FAZENDA – Réu DER-DETRAN – CNH - Transferência de PONTUAÇÃO.docx",
        ),
        realTpl(
          "tjdft-20-22",
          "Fazenda — Réu DER: CNH — Transferência de Pontuação",
          "id-card",
          "20.22 FAZENDA – Réu DER – CNH - Transferência de PONTUAÇÃO.docx",
        ),
        realTpl(
          "tjdft-20-23",
          "Fazenda — Réu DETRAN: CNH — Transferência de Pontuação",
          "id-card",
          "20.23 FAZENDA – Réu DETRAN – CNH - Transferência de PONTUAÇÃO.docx",
        ),
        realTpl(
          "tjdft-20-24",
          "Fazenda — Réu DETRAN: CNH Definitiva — Negativa de Renovação",
          "id-card",
          "20.24 FAZENDA – Réu DETRAN – CNH Definitiva – Negativa de RENOVAÇÃO.docx",
        ),
        realTpl(
          "tjdft-20-25",
          "Fazenda — Réu DETRAN: CNH Definitiva — Inclusão EAR (Demora)",
          "id-card",
          "20.25 FAZENDA – Réu DETRAN – CNH Definitiva – inclusão EAR - demora de RENOVAÇÃO.docx",
        ),
        realTpl(
          "tjdft-20-26",
          "Fazenda — Réu DETRAN: CNH Provisória — Negativa da Definitiva",
          "id-card",
          "20.26 FAZENDA – Réu DETRAN – CNH Provisória – Negativa da DEFINITIVA.docx",
        ),
        realTpl(
          "tjdft-20-27",
          "Fazenda — Réu DF-DETRAN: Venda Veículo — Nulidade Propriedade + Negativação + Danos Morais",
          "building-2",
          "20.27 FAZENDA –  Réu DF-DETRAN – Venda de Veículo – NULIDADE de PROPRIEDADE - negativação indevida – DANOS MORAIS - tutela de urgência.docx",
        ),
        realTpl(
          "tjdft-20-28",
          "Fazenda — Réu GDF: Cidadão — Excesso de Tributo (ITBI — Restituição)",
          "building-2",
          "20.28 FAZENDA – Réu GDF – Cidadão – Excesso de tributo – ITBI – restituição da diferença.docx",
        ),
        realTpl(
          "tjdft-20-29",
          "Fazenda — Réu INAS-GDF: Tratamento (Tutela de Urgência)",
          "building-2",
          "20.29 FAZENDA – Réu INAS-GDF – TRATAMENTO - Tutela de URGÊNCIA.docx",
        ),
        realTpl(
          "tjdft-20-29-1",
          "Fazenda — Réu INAS-GDF: Tratamento + Danos Morais (Tutela)",
          "building-2",
          "20.29.1 FAZENDA – Réu INAS-GDF – TRATAMENTO - Tutela de URGÊNCIA - DANOS MORAIS.docx",
        ),
        realTpl(
          "tjdft-20-30",
          "Fazenda — Réu INAS-GDF: Cirurgia (Tutela de Urgência)",
          "building-2",
          "20.30 FAZENDA – Réu INAS-GDF – CIRURGIA - Tutela de URGÊNCIA.docx",
        ),
        realTpl(
          "tjdft-20-30-1",
          "Fazenda — Réu INAS-GDF: Cirurgia + Danos Morais (Tutela)",
          "building-2",
          "20.30.1 FAZENDA – Réu INAS-GDF – CIRURGIA - Tutela de URGÊNCIA - DANOS MORAIS.docx",
        ),
        realTpl(
          "tjdft-20-31",
          "Fazenda — Réu INAS-GDF: Medicamento (Tutela de Urgência)",
          "building-2",
          "20.31 FAZENDA – Réu INAS-GDF – MEDICAMENTO - Tutela de URGÊNCIA.docx",
        ),
        realTpl(
          "tjdft-20-31-1",
          "Fazenda — Réu INAS-GDF: Medicamento + Danos Morais (Tutela)",
          "building-2",
          "20.31.1 FAZENDA – Réu INAS-GDF – MEDICAMENTO - Tutela de URGÊNCIA - DANOS MORAIS.docx",
        ),
        realTpl(
          "tjdft-20-32",
          "Fazenda — Réu GDF INAS-DF: Negativa de Cobertura (Ressarcimento)",
          "building-2",
          "20.32 FAZENDA – Réu GDF INAS-DF – negativa de cobertura – Ressarcimento.docx",
        ),
        realTpl(
          "tjdft-20-32-1",
          "Fazenda — Réu GDF INAS-DF: Negativa de Cobertura + Danos Morais",
          "building-2",
          "20.32.1 FAZENDA – Réu GDF INAS-DF – negativa de cobertura – Ressarcimento - DANOS MORAIS.docx",
        ),

        // ---- 21.x CAESB / CEB -----------------------------------------
        realTpl(
          "tjdft-21-1",
          "CAESB — Aumento Substancial (Contas Pagas): Caça-Vazamentos + Devolução em Dobro",
          "droplets",
          "21.1 CAESB – AUMENTO SUBSTANCIAL – CONTAS PAGAS - CAÇA-VAZAMENTOS - DEVOLUÇÃO EM DOBRO.docx",
        ),
        realTpl(
          "tjdft-21-2",
          "CAESB — Aumento Substancial (Contas Não Pagas): Corte de Água + Tutela",
          "droplets",
          "21.2 CAESB – AUMENTO SUBSTANCIAL - CONTAS NÃO PAGAS – CORTE DE ÁGUA - Tutela de Urgência.docx",
        ),
        realTpl(
          "tjdft-21-3",
          "CAESB — Aumento Substancial (Não Pagas): Ameaça de Corte + Tutela",
          "droplets",
          "21.3 CAESB – AUMENTO SUBSTANCIAL - CONTAS NÃO PAGAS – AMEAÇA DE CORTE - Tutela de Urgência.docx",
        ),
        realTpl(
          "tjdft-21-4",
          "CAESB — Multa Indevida (Conta Paga): Devolução em Dobro",
          "droplets",
          "21.4 CAESB – MULTA INDEVIDA – CONTA PAGA - DEVOLUÇÃO EM DOBRO.docx",
        ),
        realTpl(
          "tjdft-21-5",
          "CAESB — Multa Indevida (Não Paga): Corte de Água + Tutela",
          "droplets",
          "21.5 CAESB – MULTA INDEVIDA - CONTAS NÃO PAGAS – CORTE DE ÁGUA - Tutela de Urgência.docx",
        ),
        realTpl(
          "tjdft-21-6",
          "CAESB — Multa Indevida (Não Pagas): Ameaça de Corte + Tutela",
          "droplets",
          "21.6 CAESB – MULTA INDEVIDA – CONTAS NÃO PAGAS – AMEAÇA DE CORTE - Tutela de Urgência.docx",
        ),
        realTpl(
          "tjdft-21-7",
          "CEB-Neoenergia — Aumento Substancial (Pagas): Devolução em Dobro",
          "zap",
          "21.7 CEB-NEOENERGIA BRASILIA – AUMENTO SUBSTANCIAL – CONTAS PAGAS – DEVOLUÇÃO EM DOBRO.docx",
        ),
        realTpl(
          "tjdft-21-8",
          "CEB-Neoenergia — Aumento Substancial (Não Pagas): Corte de Energia + Tutela",
          "zap",
          "21.8 CEB-NEOENERGIA BRASILIA – AUMENTO SUBSTANCIAL – CONTAS NÃO PAGAS – CORTE DE ENERGIA - Tutela de Urgência.docx",
        ),
        realTpl(
          "tjdft-21-9",
          "CEB-Neoenergia — Aumento Substancial (Não Pagas): Ameaça de Corte + Tutela",
          "zap",
          "21.9 CEB-NEOENERGIA BRASILIA – AUMENTO SUBSTANCIAL – CONTAS NÃO PAGAS – AMEAÇA DE CORTE - Tutela de Urgência.docx",
        ),
        realTpl(
          "tjdft-21-10",
          "CEB-Neoenergia — Queda de Energia: Dano em Equipamento Elétrico (Indenização)",
          "zap",
          "21.10 CEB-NEOENERGIA BRASILIA – Queda de ENERGIA – DANO EQUIPAMENTO ELETRÍCO - INDENIZAÇÃO.docx",
        ),

        // ---- 22.x / 23.x OUTRAS ----------------------------------------
        realTpl(
          "tjdft-22-1",
          "Compra e Venda — Falta de Pagamento: Rescisão + Devolução do Bem",
          "shopping-cart",
          "22.1 COMPRA E VENDA – falta de pagamento – rescisão de contrato – devolução do bem.docx",
        ),
        realTpl(
          "tjdft-23-1",
          "Consórcio — Desistência Contratual: Restituição dos Valores Pagos",
          "piggy-bank",
          "23.1 CONSÓRCIO – Desistência Contratual – RESTITUIÇÃO dos valores pagos.docx",
        ),
      ],
    },

    // ================================================================
    //  CATEGORIA 2 — Documentos Judiciais (Peciais Processuais Diversas)
    //  TODAS PENDENTES (menos Petição Inicial — mas as reais estão na categoria acima)
    // ================================================================
    {
      id: "judiciais",
      icon: "file-text",
      name: "📑 Outras Peças Processuais (Pendentes — sem doc real)",
      items: [
        pendingTpl(
          "peticao-inicial",
          "Petição Inicial (genérica — usar categoria TJDFT acima)",
          "file-signature",
        ),
        pendingTpl("contestacao", "Contestação", "message-square-reply"),
        pendingTpl("replica", "Réplica", "messages-square"),
        pendingTpl("apelacao", "Recurso / Apelação", "arrow-up-circle"),
        pendingTpl("contra-razoes", "Contrarrazões", "reply-all"),
        pendingTpl(
          "embargos-declaracao",
          "Embargos de Declaração",
          "help-circle",
        ),
        pendingTpl("alegacoes-finais", "Alegações Finais", "list-end"),
        pendingTpl("peticao-juntada", "Petição de Juntada", "paperclip"),
        pendingTpl("cumprimento-sentenca", "Cumprimento de Sentença", "gavel"),
      ],
    },

    // ================================================================
    //  CATEGORIA 3 — Contratos e Societários (TODAS PENDENTES)
    // ================================================================
    {
      id: "contratos",
      icon: "handshake",
      name: "📝 Contratos e Societários (Pendentes — sem doc real)",
      items: [
        pendingTpl(
          "contrato-servicos",
          "Contrato de Prestação de Serviços",
          "briefcase",
        ),
        pendingTpl(
          "contrato-compra-venda",
          "Contrato de Compra e Venda",
          "shopping-cart",
        ),
        pendingTpl("contrato-locacao", "Contrato de Locação", "home"),
        pendingTpl(
          "contrato-social",
          "Contrato Social / Estatuto",
          "building-2",
        ),
        pendingTpl("acordo-socios", "Acordo de Sócios (Quotas)", "users"),
        pendingTpl("nda", "NDA — Termo de Confidencialidade", "shield-check"),
        pendingTpl("mou", "MOU — Memorando de Entendimento", "file-text"),
        pendingTpl("distrato", "Distrato (Rescisão)", "file-x"),
      ],
    },

    // ================================================================
    //  CATEGORIA 4 — Representação e Atendimento (TODAS PENDENTES)
    // ================================================================
    {
      id: "representacao",
      icon: "user-check",
      name: "⚖️ Representação e Atendimento (Pendentes — sem doc real)",
      items: [
        pendingTpl("procuracao", "Procuração Ad Judicia", "id-card"),
        pendingTpl("substabelecimento", "Substabelecimento", "share-2"),
        pendingTpl("honorarios", "Contrato de Honorários", "coins"),
        pendingTpl(
          "ficha-atendimento",
          "Ficha de Atendimento",
          "clipboard-list",
        ),
        pendingTpl(
          "hipossuficiencia",
          "Declaração de Hipossuficiência",
          "heart-handshake",
        ),
      ],
    },

    // ================================================================
    //  CATEGORIA 5 — Notificações e Comunicações (TODAS PENDENTES)
    // ================================================================
    {
      id: "notificacoes",
      icon: "mail",
      name: "✉️ Notificações e Comunicações (Pendentes — sem doc real)",
      items: [
        pendingTpl(
          "notificacao-extrajudicial",
          "Notificação Extrajudicial",
          "send",
        ),
        pendingTpl("contranotificacao", "Contranotificação", "inbox"),
        pendingTpl("oficio", "Ofício", "mail-open"),
      ],
    },

    // ================================================================
    //  CATEGORIA 6 — Consultoria e Pareceres (TODAS PENDENTES)
    // ================================================================
    {
      id: "consultoria",
      icon: "search",
      name: "🔍 Consultoria e Pareceres (Pendentes — sem doc real)",
      items: [
        pendingTpl("parecer-juridico", "Parecer Jurídico", "book-open-check"),
        pendingTpl("due-diligence", "Relatório Due Diligence", "file-search"),
        pendingTpl("memorando-interno", "Memorando Interno", "sticky-note"),
        pendingTpl(
          "termos-privacidade",
          "Termos de Uso e Privacidade",
          "shield",
        ),
      ],
    },

    // ================================================================
    //  CATEGORIA 7 — Família e Sucessões (TODAS PENDENTES)
    // ================================================================
    {
      id: "familia",
      icon: "heart",
      name: "🏡 Família e Sucessões (Pendentes — sem doc real)",
      items: [
        pendingTpl("pacto-antenupcial", "Pacto Antenupcial", "gem"),
        pendingTpl("uniao-estavel", "Contrato de União Estável", "link-2"),
        pendingTpl("testamento", "Testamento", "scroll"),
        pendingTpl("dav", "Diretiva Antecipada de Vontade", "heart-pulse"),
        pendingTpl("inventario", "Inventário Extrajudicial", "notebook-pen"),
      ],
    },

    // ================================================================
    //  CATEGORIA 8 — Modelos Advogado (910 templates, lazy-load HTML individual)
    //  Arquivos .docx reais em Peticao/AdvogadoGerados/
    //  Catalogo em arquivo SEPARADO assets/js/adv-catalog.js (carrega ANTES de templates.js)
    //  HTML de cada template em assets/templates/adv-*.html (fetch sob demanda 1 por clique)
    // ================================================================
    {
      id: "advogado",
      icon: "briefcase",
      name: "💼 Modelos Advogado — 910 Petições (Lazy-Load)",
      items: Array.isArray(/** @type {any} */ (window).DocJurAdvCatalog)
        ? /** @type {Array<[string,string,string,string]>} */ (
            /** @type {any} */ (window).DocJurAdvCatalog
          ).map((t) => realTplAdv(t[0], t[1], t[2], t[3]))
        : [],
    },
  ];

  // ================================================================
  //  DEFAULT_HTML — esqueleto vazio inicial
  // ================================================================
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
  bem assim os princípios da responsabilidade civil objetiva, ensejando a reparação
  integral dos danos causados ao autor.
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

  // ================================================================
  //  LAZY TEMPLATES — HTML carregado SOB DEMANDA via fetch()
  //  Arquivos em assets/templates/<id>.html + manifest.json
  //  TEMPLATES{}: markers truthy apenas para !!TEMPLATES[id] (UI checkmark)
  // ================================================================
  /** @typedef {{ formatVersion: number, generatedAt: string, implemented: string[] }} TplManifestFormat */
  const TEMPLATES_DIR = "assets/templates/";
  const MANIFEST_URL = TEMPLATES_DIR + "manifest.json";
  /** @type {Record<string, true>} */
  const IMPLEMENTED = {};
  const CACHE_CAP = 50;
  /** @type {Map<string, string>} */
  const HTML_CACHE = new Map();
  /** @param {string[]} ids */
  function populateImplemented(ids) {
    for (const id of ids) IMPLEMENTED[id] = true;
  }
  /** @returns {Promise<void>} */
  async function fetchManifestImpl() {
    try {
      const resp = await fetch(MANIFEST_URL, { cache: "no-cache" });
      if (!resp.ok) return;
      /** @type {TplManifestFormat} */
      const data = await resp.json();
      if (data && Array.isArray(data.implemented))
        populateImplemented(data.implemented);
    } catch (err) {
      console.warn(
        "[DocJurTemplates] manifesto templates não carregado (file:// sem servidor?); fallback skeleton:",
        err,
      );
    }
  }
  /** @type {Promise<void>|null} */
  let initPromise = null;
  /** @returns {Promise<void>} */
  function init() {
    if (!initPromise) initPromise = fetchManifestImpl();
    return initPromise;
  }
  /**
   * Carrega HTML do template sob demanda (cache LRU).
   * @param {string} id
   * @returns {Promise<string>}
   */
  async function getHtmlAsync(id) {
    if (HTML_CACHE.has(id)) return /** @type {string} */ (HTML_CACHE.get(id));
    if (!IMPLEMENTED[id]) return skeletonFor(id);
    try {
      const url = TEMPLATES_DIR + encodeURIComponent(id) + ".html";
      const resp = await fetch(url, { cache: "force-cache" });
      if (!resp.ok) return skeletonFor(id);
      const txt = await resp.text();
      // LRU evict mais antigo (ordem de inserção do Map)
      if (HTML_CACHE.size >= CACHE_CAP) {
        const firstKey = HTML_CACHE.keys().next().value;
        if (firstKey !== undefined) HTML_CACHE.delete(firstKey);
      }
      HTML_CACHE.set(id, txt);
      return txt;
    } catch (err) {
      console.warn("[DocJurTemplates] fetch template falhou id=" + id, err);
      return skeletonFor(id);
    }
  }
  // Backward compat: !!Tpl.TEMPLATES[id] retorna truthy para implementados.
  const TEMPLATES = IMPLEMENTED;

  // ================================================================
  //  SKELETON FALLBACK — p/ itens que ainda não têm HTML completo
  // ================================================================
  /** @param {string} id */
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

  // ================================================================
  //  HELPERS DE LOOKUP
  // ================================================================
  /** @param {string} id */
  function templateTitle(id) {
    for (const cat of CATEGORIES) {
      const it = cat.items.find((i) => i.id === id);
      if (it) return it.name;
    }
    return "Documento";
  }

  /**
   * Retorna os metadados do template por ID (c/ sourceFile, pending etc).
   * @param {string} id
   * @returns {TplTemplateItem|null}
   */
  function templateMeta(id) {
    for (const cat of CATEGORIES) {
      const it = cat.items.find((i) => i.id === id);
      if (it) return it;
    }
    return null;
  }

  /**
   * @param {string} id
   * @returns {string}
   */
  function getHtml(id) {
    return (HTML_CACHE && HTML_CACHE.get(id)) || skeletonFor(id);
  }

  return {
    CATEGORIES,
    DEFAULT_HTML,
    TEMPLATES,
    PH_LABELS,
    phLabel,
    templateTitle,
    templateMeta,
    init,
    getHtmlAsync,
    getHtml,
    skeletonFor,
  };
})();

/** @type {any} */ (window).DocJurTemplates = DocJurTemplates;
