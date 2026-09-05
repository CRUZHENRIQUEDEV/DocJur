import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TEMPLATES_DIR = path.join(ROOT, "assets", "templates");
const MANIFEST_PATH = path.join(ROOT, "assets", "templates", "manifest.json");
const ADV_CATALOG_3_JS = path.join(ROOT, "assets", "js", "adv-catalog-3.js");

const NOVA_CATEGORIAS = [
  {
    areaSlug: "digital-lgpd-avancado",
    areaNome: "Direito Digital e LGPD Avançado",
    icon: "shield-check",
    templates: [
      ["01-vazamento-dados-lgpd-multa-anpd-indenizacao-coletiva", "01 Vazamento de Dados LGPD Multa ANPD Indenização Coletiva"],
      ["02-deepfake-inteligencia-artificial-direito-imagem-indenizacao", "02 Deepfake Inteligência Artificial Direito Imagem Indenização"],
      ["03-biometria-não-consentida-reconhecimento-facial-indenizacao", "03 Biometria Não Consentida Reconhecimento Facial Indenização"],
      ["04-cookies-ilegais-coleta-nao-autorizada-lgpd-multa-anatel", "04 Cookies Ilegais Coleta Não Autorizada LGPD Multa ANATEL"],
      ["05-golpe-pix-phishing-banco-clonagem-whatsapp-indenizacao", "05 Golpe PIX Phishing Banco Clonagem WhatsApp Indenização"],
      ["06-direito-esquecimento-google-remover-link-informacao-falsa", "06 Direito Esquecimento Google Remover Link Informação Falsa"],
      ["07-credito-serasa-score-baixo-nome-sujo-indevido-restricao", "07 Crédito Serasa Score Baixo Nome Sujo Indevido Restrição"],
      ["08-sigiloso-bancario-informacao-vazada-banco-financeira-indenizacao", "08 Sigilo Bancário Informação Vazada Banco Financeira Indenização"],
      ["09-aplicativo-banco-hackeado-saldo-roubado-indenizacao-falha", "09 Aplicativo Banco Hackeado Saldo Roubado Indenização Falha"],
      ["10-anpd-pedido-acesso-dados-titular-nao-atendido-indenizacao", "10 ANPD Pedido Acesso Dados Titular Não Atendido Indenização"],
    ],
  },
  {
    areaSlug: "bancario-financeiro",
    areaNome: "Direito Bancário e Financeiro",
    icon: "landmark",
    templates: [
      ["01-fraude-bancaria-conta-bloqueada-injustificadamente-indenizacao", "01 Fraude Bancária Conta Bloqueada Injustificadamente Indenização"],
      ["02-cheque-especial-tarifa-abusiva-juros-abusivos-conta", "02 Cheque Especial Tarifa Abusiva Juros Abusivos Conta"],
      ["03-cartao-credito-fatura-indevida-compra-nao-reconhecida-clonagem", "03 Cartão Crédito Fatura Indevida Compra Não Reconhecida Clonagem"],
      ["04-emprestimo-consignado-fraudulento-margem-liberada-sem-autorizacao", "04 Empréstimo Consignado Fraudulento Margem Liberada Sem Autorização"],
      ["05-pix-indevido-ted-transferida-errado-pessoa-recuperar-valor", "05 PIX Indevido TED Transferida Errado Pessoa Recuperar Valor"],
      ["06-tarifa-bancaria-cobranca-indevida-conta-salario-invalida", "06 Tarifa Bancária Cobrança Indevida Conta Salário Inválida"],
      ["07-cheque-sem-fundo-sem-justificativa-desfalque-banco", "07 Cheque Sem Fundo Sem Justificativa Desfalque Banco"],
      ["08-cheque-administrativo-bancario-valor-pago-divergente-erro", "08 Cheque Administrativo Bancário Valor Pago Divergente Erro"],
      ["09-financiamento-veiculo-itau-bb-caixa-juros-abusivos-parcela", "09 Financiamento Veículo Itaú BB Caixa Juros Abusivos Parcela"],
      ["10-conta-salario-empresa-desvio-fgts-saque-fgts-indenizacao", "10 Conta Salário Empresa Desvio FGTS Saque FGTS Indenização"],
    ],
  },
  {
    areaSlug: "sucessorio-familia-avancado",
    areaNome: "Direito Sucessório e Família Avançado",
    icon: "scroll",
    templates: [
      ["01-testamento-publico-privado-validade-nulidade-vicio-procedimento", "01 Testamento Público Privado Validade Nulidade Vício Procedimento"],
      ["02-inventario-partilha-bens-heranca-imovel-dinheiro-acoes", "02 Inventário Partilha Bens Herança Imóvel Dinheiro Ações"],
      ["03-peticao-heranca-legado-usufruto-bem-familiar-testeiro", "03 Petição Herança Legado Usufruto Bem Familiar Testeiro"],
      ["04-fideicomisso-heranca-maior-idade-substituicao-testamentaria", "04 Fideicomisso Herança Maior Idade Substituição Testamentária"],
      ["05-partilha-errada-heranca-irmaos-indenizacao-desacordo-conjuge", "05 Partilha Errada Herança Irmãos Indenização Desacordo Cônjuge"],
      ["06-usucapiao-heranca-imovel-nao-escritura-posse-malas-anotacoes", "06 Usucapião Herança Imóvel Não Escritura Posse Malas Anotações"],
      ["07-indenizacao-por-atraso-inventario-cartorio-extra-judicial", "07 Indenização Por Atraso Inventário Cartório Extra Judicial"],
      ["08-alienacao-imovel-heranca-antes-do-inventario-nulidade-venda", "08 Alienação Imóvel Herança Antes do Inventário Nulidade Venda"],
      ["09-administracao-heranca-inventario-longo-tempo-reivindicacao", "09 Administração Herança Inventário Longo Tempo Reivindicação"],
      ["10-legado-especifico-bem-heranca-nao-entregue-cumprimento-legado", "10 Legado Específico Bem Herança Não Entregue Cumprimento Legado"],
    ],
  },
  {
    areaSlug: "civil-contratos-avancado",
    areaNome: "Direito Civil e Contratos Avançado",
    icon: "file-signature",
    templates: [
      ["01-rescisao-contratual-sem-multa-clausula-penal-indenizacao", "01 Rescisão Contratual Sem Multa Cláusula Penal Indenização"],
      ["02-clausula-abusiva-contrato-adesao-consumidor-supermercado-via-varejo", "02 Cláusula Abusiva Contrato Adesão Consumidor Supermercado Via Varejo"],
      ["03-vicios-redibitorios-produto-defeito-carro-imovel-eletronico", "03 Vícios Redibitórios Produto Defeito Carro Imóvel Eletrônico"],
      ["04-eviccao-coisa-vendida-indenizacao-terceiro-reivindica-bem", "04 Evicção Coisa Vendida Indenização Terceiro Reivindica Bem"],
      ["05-contrato-locacao-imovel-comercial-residencial-despejo-trava", "05 Contrato Locação Imóvel Comercial Residencial Despejo Trava"],
      ["06-contrato-prestacao-servico-nao-cumprimento-falha-empresa", "06 Contrato Prestação Serviço Não Cumprimento Falha Empresa"],
      ["07-contrato-compra-e-venda-imovel-rescisao-multa-danilo-mora", "07 Contrato Compra e Venda Imóvel Rescisão Multa Danilo Mora"],
      ["08-contrato-doacao-irrevogavel-bem-imovel-doacao-indenizacao", "08 Contrato Doação Irrevogável Bem Imóvel Doação Indenização"],
      ["09-contrato-mutuio-emprestimo-privado-pessoa-juridica-juros-legais", "09 Contrato Mútuo Empréstimo Privado Pessoa Jurídica Juros Legais"],
      ["10-contrato-sociedade-simples-desfazimento-socio-sair-sociedade", "10 Contrato Sociedade Simples Desfazimento Sócio Sair Sociedade"],
    ],
  },
  {
    areaSlug: "imobiliario-avancado",
    areaNome: "Direito Imobiliário Avançado",
    icon: "home",
    templates: [
      ["01-usucapiao-urbano-imovel-centro-bsb-vila-plano-dirceu-10-anos", "01 Usucapião Urbano Imóvel Centro BSB Vila Plano Dirceu 10 Anos"],
      ["02-despejo-por-necessidade-proprietario-morar-imovel-despejo-locatario", "02 Despejo Por Necessidade Proprietário Morar Imóvel Despejo Locatário"],
      ["03-revisao-aluguel-locatario-imovel-residencial-comercial-reajuste", "03 Revisão Aluguel Locatário Imóvel Residencial Comercial Reajuste"],
      ["04-acao-possessoria-manutencao-de-posse-reintegracao-terceiro", "04 Ação Possessória Manutenção de Posse Reintegração Terceiro"],
      ["05-interdito-proibitorio-nao-pode-mexer-bem-posse-nao-invadir", "05 Interdito Proibitório Não Pode Mexer Bem Posse Não Invadir"],
      ["06-regularizacao-imovel-loteamento-nao-registrado-cartorio-imovel", "06 Regularização Imóvel Loteamento Não Registrado Cartório Imóvel"],
      ["07-financiamento-habitacional-caixa-economica-federal-sfhh-minha-casa", "07 Financiamento Habitacional Caixa Econômica Federal SFH Minha Casa"],
      ["08-condominio-regular-falta-agua-elevador-nao-funciona-multa", "08 Condomínio Regular Falta Água Elevador Não Funciona Multa"],
      ["09-inadimplencia-condominio-leilao-apartamento-cobranca-divida", "09 Inadimplência Condomínio Leilão Apartamento Cobrança Dívida"],
      ["10-imovel-area-comum-condominio-vaga-garagem-indenizacao-conflito", "10 Imóvel Área Comum Condomínio Vaga Garagem Indenização Conflito"],
    ],
  },
  {
    areaSlug: "trabalho-avancado-clt",
    areaNome: "Direito do Trabalho Avançado CLT",
    icon: "hammer",
    templates: [
      ["01-reconhecimento-vinculo-empregaticio-15-anos-pj-nao-existe", "01 Reconhecimento Vínculo Empregatício 15 Anos PJ Não Existe"],
      ["02-calculo-rescisao-indireta-demitida-sem-justa-causa-indenizacao", "02 Cálculo Rescisão Indireta Demitida Sem Justa Causa Indenização"],
      ["03-horas-extras-nao-pagas-50-100-dsr-acumulado-indenizacao", "03 Horas Extras Não Pagas 50% 100% DSR Acumulado Indenização"],
      ["04-adicional-periculosidade-insalubridade-18-30-grau-medico-nao", "04 Adicional Periculosidade Insalubridade 18% 30% Grau Médico Não"],
      ["05-intervalo-intrajornada-almoco-1-hora-nao-concedido-trabalhou", "05 Intervalo Intrajornada Almoço 1 Hora Não Concedido Trabalhou"],
      ["06-descanso-semanal-remunerado-dsr-feriado-nao-pagou-dobrado", "06 Descanso Semanal Remunerado DSR Feriado Não Pagou Dobrado"],
      ["07-aviso-previo-indenizado-trabalhado-30-dias-nao-usou", "07 Aviso Prévio Indenizado Trabalhado 30 Dias Não Usou"],
      ["08-decimo-terceiro-salario-13-ferias-1-3-constitucional-nao", "08 Décimo Terceiro Salário 13º Férias 1/3 Constitucional Não"],
      ["09-fgts-multa-40-desligamento-sem-justa-causa-saque-seguro", "09 FGTS Multa 40% Desligamento Sem Justa Causa Saque Seguro"],
      ["10-assedio-moral-trabalho-chefe-gestor-indenizacao-material-moral", "10 Assédio Moral Trabalho Chefe Gestor Indenização Material Moral"],
    ],
  },
  {
    areaSlug: "previdenciario-avancado-inss",
    areaNome: "Direito Previdenciário Avançado INSS",
    icon: "coins",
    templates: [
      ["01-revisao-beneficio-aposentadoria-inss-valor-baixo-reajuste", "01 Revisão Benefício Aposentadoria INSS Valor Baixo Reajuste"],
      ["02-aposentadoria-por-invalidez-doenca-permanente-total-beneficio", "02 Aposentadoria Por Invalidez Doença Permanente Total Benefício"],
      ["03-auxilio-doenca-beneficio-91-dias-inss-prova-doenca-indeferido", "03 Auxílio Doença Benefício 91 Dias INSS Prova Doença Indeferido"],
      ["04-salario-maternidade-120-dias-mulher-gestante-adotante-inss", "04 Salário Maternidade 120 Dias Mulher Gestante Adotante INSS"],
      ["05-pensao-morte-esposa-viuva-filho-menor-inss-atrasado-beneficio", "05 Pensão Morte Esposa Viúva Filho Menor INSS Atrasado Benefício"],
      ["06-loas-idoso-65-anos-baixa-renda-nao-contribuintes-indenizacao", "06 LOAS Idoso 65 Anos Baixa Renda Não Contribuintes Indenização"],
      ["07-loas-pessoa-com-deficiencia-bpc-beneficio-indeferido-prova", "07 LOAS Pessoa Com Deficiência BPC Benefício Indeferido Prova"],
      ["08-aposentadoria-por-idade-62-65-anos-faltando-cnis-tempo-prova", "08 Aposentadoria Por Idade 62 65 Anos Faltando CNIS Tempo Prova"],
      ["09-aposentadoria-tempo-contribuicao-30-35-anos-homem-mulher-prova", "09 Aposentadoria Tempo Contribuição 30 35 Anos Homem Mulher Prova"],
      ["10-plano-beneficio-inss-88-99-96-fator-previdenciario-revisao", "10 Plano Benefício INSS 88/99/96 Fator Previdenciário Revisão"],
    ],
  },
  {
    areaSlug: "tributario-municipal-estadual-federal",
    areaNome: "Direito Tributário Municipal/Estadual/Federal",
    icon: "landmark-building",
    templates: [
      ["01-ipva-veiculo-multa-juros-indenizacao-pagamento-indevido", "01 IPVA Veículo Multa Juros Indenização Pagamento Indevido"],
      ["02-iptu-imovel-progressivo-multa-isencao-idoso-indenizacao", "02 IPTU Imóvel Progressivo Multa Isenção Idoso Indenização"],
      ["03-itbi-transferencia-imovel-compra-venda-doador-pagamento-indevido", "03 ITBI Transferência Imóvel Compra Venda Doador Pagamento Indevido"],
      ["04-ipi-imposto-produto-industrializado-restituicao-indenizacao", "04 IPI Imposto Produto Industrializado Restituição Indenização"],
      ["05-imposto-renda-restituicao-retido-fonte-pf-indevido-multa", "05 Imposto Renda Restituição Retido Fonte PF Indevido Multa"],
      ["06-multa-tributaria-municipal-agua-esgoto-iss-indenizacao", "06 Multa Tributária Municipal Água Esgoto ISS Indenização"],
      ["07-parcelamento-tributario-receita-federal-estaduais-municipais", "07 Parcelamento Tributário Receita Federal Estaduais Municipais"],
      ["08-execucao-fiscal-carteira-divida-ativa-inscricao-imovel-bem", "08 Execução Fiscal Carteira Dívida Ativa Inscrição Imóvel Bem"],
      ["09-certidao-negativa-divida-ativa-cnh-cnpj-restricao-indenizacao", "09 Certidão Negativa Dívida Ativa CNH CNPJ Restrição Indenização"],
      ["10-issqn-prefeitura-servico-indenizacao-multa-cobranca-indevida", "10 ISSQN Prefeitura Serviço Indenização Multa Cobrança Indevida"],
    ],
  },
  {
    areaSlug: "penal-execucao-criminal",
    areaNome: "Direito Penal e Execução Criminal",
    icon: "gavel",
    templates: [
      ["01-habeas-corpus-liberdade-provisoria-pessoa-presa-privada-liberdade", "01 Habeas Corpus Liberdade Provisória Persona Presa Privada Liberdade"],
      ["02-liberdade-provisoria-fianza-pagamento-multa-cautelar-pessoa", "02 Liberdade Provisória Fiança Pagamento Multa Cautelar Pessoa"],
      ["03-prisao-preventiva-injusta-cancelar-matar-anular-pedido", "03 Prisão Preventiva Injusta Cancelar Matar Anular Pedido"],
      ["04-audiencia-custodia-flagrante-delito-pessoa-liberdade-regular", "04 Audiência Custódia Flagrante Delito Pessoa Liberdade Regular"],
      ["05-progressao-regime-fechado-semiaberto-aberto-pessoa-cumprindo", "05 Progressão Regime Fechado Semiaberto Aberto Pessoa Cumprindo"],
      ["06-remicao-pena-trabalho-estudo-pessoa-presa-tempo-servido", "06 Remição Pena Trabalho Estudo Pessoa Presa Tempo Servido"],
      ["07-sursis-condenacao-nao-cumprir-pena-multa-boa-conduta", "07 Sursis Condenação Não Cumprir Pena Multa Boa Conduta"],
      ["08-multa-penal-substituir-pena-restritiva-dias-multa-indenizacao", "08 Multa Penal Substituir Pena Restritiva Dias Multa Indenização"],
      ["09-lei-drogas-artigo-33-traficos-posse-liberdade-provisoria", "09 Lei Drogas Artigo 33 Tráficos Posse Liberdade Provisória"],
      ["10-crimes-contra-honra-calunia-difamacao-injuria-indenizacao", "10 Crimes Contra Honra Calúnia Difamação Injúria Indenização"],
    ],
  },
  {
    areaSlug: "consumidor-avancado",
    areaNome: "Direito do Consumidor Avançado",
    icon: "shopping-bag",
    templates: [
      ["01-vicio-produto-eletronico-celular-geladeira-ar-condicionado-troca", "01 Vício Produto Eletrônico Celular Geladeira Ar Condicionado Troca"],
      ["02-defeito-servico-reforma-casa-empresa-construcao-indenizacao", "02 Defeito Serviço Reforma Casa Empresa Construção Indenização"],
      ["03-oferta-enganosa-produto-mercado-pao-de-acucar-carrefour-extra", "03 Oferta Enganosa Produto Mercado Pão de Açúcar Carrefour Extra"],
      ["04-publicidade-abusiva-infantil-produto-saude-alimentacao-anuncio", "04 Publicidade Abusiva Infantil Produto Saúde Alimentação Anúncio"],
      ["05-pratica-abusiva-venda-casada-produto-servico-supermercado", "05 Prática Abusiva Venda Casada Produto Serviço Supermercado"],
      ["06-produto-vencido-alimento-farmacia-restaurante-hipermercado", "06 Produto Vencido Alimento Farmácia Restaurante Hipermercado"],
      ["07-servico-nao-prestado-empresa-limpeza-manutencao-indenizacao", "07 Serviço Não Prestado Empresa Limpeza Manutenção Indenização"],
      ["08-devolucao-dinheiro-paguei-nao-recebi-produto-servico-indenizacao", "08 Devolução Dinheiro Paguei Não Recebi Produto Serviço Indenização"],
      ["09-descumprimento-oferta-site-mercado-livre-magalu-extra-pedido", "09 Descumprimento Oferta Site Mercado Livre Magalu Extra Pedido"],
      ["10-telefonia-fixa-internet-vivo-claro-tim-oi-fatura-abusiva", "10 Telefonia Fixa Internet Vivo Claro Tim Oi Fatura Abusiva"],
    ],
  },
  {
    areaSlug: "administrativo-avancado",
    areaNome: "Direito Administrativo Avançado",
    icon: "landmark-flag",
    templates: [
      ["01-licitacao-edital-pregao-eletronico-contrato-administrativo-indenizacao", "01 Licitação Edital Pregão Eletrônico Contrato Administrativo Indenização"],
      ["02-servidor-publico-estavel-tempo-contribuicao-aposentadoria", "02 Servidor Público Estável Tempo Contribuição Aposentadoria"],
      ["03-ato-administrativo-anulacao-revogacao-indenizacao-conselho", "03 Ato Administrativo Anulação Revogação Indenização Conselho"],
      ["04-improbidade-administrativa-lei-8429-multa-indenizacao-bem", "04 Improbidade Administrativa Lei 8429 Multa Indenização Bem"],
      ["05-serventia-extrajudicial-cartorio-notario-registro-imoveis", "05 Serventia Extrajudicial Cartório Notário Registro Imóveis"],
      ["06-registro-contrato-imovel-cartorio-indenizacao-erro-registro", "06 Registro Contrato Imóvel Cartório Indenização Erro Registro"],
      ["07-protesto-cartorio-titulo-divida-indenizacao-cancelamento", "07 Protesto Cartório Título Dívida Indenização Cancelamento"],
      ["08-concurso-publico-edital-anulado-vaga-espera-convocacao", "08 Concurso Público Edital Anulado Vaga Espera Convocação"],
      ["09-empresa-publica-sociedade-economica-mista-funcionario-publico", "09 Empresa Pública Sociedade Econômica Mista Funcionário Público"],
      ["10-ata-notarial-negocio-juridico-cartorio-indenizacao-testamento", "10 Ata Notarial Negócio Jurídico Cartório Indenização Testamento"],
    ],
  },
  {
    areaSlug: "eleitoral-partido",
    areaNome: "Direito Eleitoral e Partidário",
    icon: "vote",
    templates: [
      ["01-multa-eleitoral-titulo-nao-quitar-voto-obrigatorio-justificativa", "01 Multa Eleitoral Título Não Quitar Voto Obrigatório Justificativa"],
      ["02-titulo-eleitor-transferencia-municipio-urgente-nova-cidade", "02 Título Eleitor Transferência Município Urgente Nova Cidade"],
      ["03-ficha-limpa-candidato-registro-impugnacao-cassacao-mandato", "03 Ficha Limpa Candidato Registro Impugnação Cassação Mandato"],
      ["04-campanha-eleitoral-prefeito-vereador-deputado-governador", "04 Campanha Eleitoral Prefeito Vereador Deputado Governador"],
      ["05-propaganda-eleitoral-regular-multa-tse-tre-excesso-gastos", "05 Propaganda Eleitoral Regular Multa TSE TRE Excesso Gastos"],
      ["06-doacao-eleitoral-empresa-pessoa-fisica-candidato-partido", "06 Doação Eleitoral Empresa Pessoa Física Candidato Partido"],
      ["07-registro-candidatura-partido-politico-tre-tse-eleicao-2024", "07 Registro Candidatura Partido Político TRE TSE Eleição 2024"],
      ["08-partido-politico-filiacao-desfiliacao-indenizacao-fundo-partidario", "08 Partido Político Filiação Desfiliação Indenização Fundo Partidário"],
      ["09-voto-impresso-urna-eletronica-auditoria-tre-secao-eleitoral", "09 Voto Impresso Urna Eletrônica Auditoria TRE Seção Eleitoral"],
      ["10-diploma-cargo-eleito-mandato-cassacao-impugnacao-resultado", "10 Diploma Cargo Eleito Mandato Cassação Impugnação Resultado"],
    ],
  },
  {
    areaSlug: "militar-forcas-armadas",
    areaNome: "Direito Militar e Forças Armadas",
    icon: "swords",
    templates: [
      ["01-exercito-brasileiro-soldado-sargento-oficial-licenca-premio", "01 Exército Brasileiro Soldado Sargento Oficial Licença Prêmio"],
      ["02-marinha-do-brasil-marinheiro-sargento-capitao-ferias-soldo", "02 Marinha do Brasil Marinheiro Sargento Capitão Férias Soldo"],
      ["03-aeronautica-fab-soldado-sargento-piloto-oficial-indenizacao", "03 Aeronáutica FAB Soldado Sargento Piloto Oficial Indenização"],
      ["04-falecimento-militar-exercito-marinha-aeronautica-pensao-militar", "04 Falecimento Militar Exército Marinha Aeronáutica Pensão Militar"],
      ["05-auxilio-alimentacao-moradia-militar-exercito-soldado-pagamento", "05 Auxílio Alimentação Moradia Militar Exército Soldado Pagamento"],
      ["06-inatividade-militar-reserva-remuneracao-tempo-servico-indenizacao", "06 Inatividade Militar Reserva Remuneração Tempo Serviço Indenização"],
      ["07-stm-tja-justica-militar-inquerito-policial-militar-crime-militar", "07 STM TJA Justiça Militar Inquérito Policial Militar Crime Militar"],
      ["08-asedio-moral-militar-exercito-hierarquia-superior-indenizacao", "08 Assédio Moral Militar Exército Hierarquia Superior Indenização"],
      ["09-promocao-militar-exercito-curso-formacao-sargento-oficial", "09 Promoção Militar Exército Curso Formação Sargento Oficial"],
      ["10-fundo-previdencia-militar-fpm-saldo-aposentadoria-pensao", "10 Fundo Previdência Militar FPM Saldo Aposentadoria Pensão"],
    ],
  },
  {
    areaSlug: "aduaneiro-comercio-exterior",
    areaNome: "Direito Aduaneiro e Comércio Exterior",
    icon: "ship",
    templates: [
      ["01-alfandega-importacao-exportacao-carga-conteiner-multa-siscomex", "01 Alfândega Importação Exportação Carga Contêiner Multa SISCOMEX"],
      ["02-drawback-incentivo-fiscal-importacao-exportacao-restituicao-icms", "02 Drawback Incentivo Fiscal Importação Exportação Restituição ICMS"],
      ["03-siscomex-sisdabra-declaracao-importacao-di-come-out-li", "03 SISCOMEX SISDRABA Declaração Importação DI Come Out LI"],
      ["04-carga-conteiner-perdida-porto-santos-rio-itaguai-indenizacao", "04 Carga Contêiner Perdida Porto Santos Rio Itaguaí Indenização"],
      ["05-taxa-thd-tcra-terminal-carga-portuaria-indenizacao-multa", "05 Taxa THD TCRA Terminal Carga Portuária Indenização Multa"],
      ["06-bl-knowledge-conhecimento-embarque-bill-lading-carga-maritima", "06 BL Knowledge Conhecimento Embarque Bill Lading Carga Marítima"],
      ["07-marpol-convencao-maritima-poluicao-navio-multa-indenizacao", "07 MARPOL Convenção Marítima Poluição Navio Multa Indenização"],
      ["08-declaracao-aduaneira-importacao-exportacao-erro-multa-rfb", "08 Declaração Aduaneira Importação Exportação Erro Multa RFB"],
      ["09-importacao-produto-china-eua-europa-taxa-icms-pis-cofins", "09 Importação Produto China EUA Europa Taxa ICMS PIS COFINS"],
      ["10-come-out-licenca-importacao-exportacao-indenizacao-produto", "10 Come Out Licença Importação Exportação Indenização Produto"],
    ],
  },
  {
    areaSlug: "propriedade-intelectual-avancado-inpi",
    areaNome: "Propriedade Intelectual Avançado INPI",
    icon: "copyright",
    templates: [
      ["01-registro-marca-inpi-pedido-oposicao-marca-nome-empresa", "01 Registro Marca INPI Pedido Oposição Marca Nome Empresa"],
      ["02-patente-invenção-inpi-modelo-utilidade-registro-indenizacao", "02 Patente Invenção INPI Modelo Utilidade Registro Indenização"],
      ["03-desenho-industrial-inpi-registro-pirateado-indenizacao", "03 Desenho Industrial INPI Registro Pirateado Indenização"],
      ["04-indicacao-geografica-queijo-vinho-cafe-produto-regiao-inpi", "04 Indicação Geográfica Queijo Vinho Café Produto Região INPI"],
      ["05-titularidade-marca-venda-cessao-marca-contrato-registro-inpi", "05 Titularidade Marca Venda Cessão Marca Contrato Registro INPI"],
      ["06-oposicao-marca-terceiro-registro-conflito-marca-anterior-inpi", "06 Oposição Marca Terceiro Registro Conflito Marca Anterior INPI"],
      ["07-nulidade-marca-registrada-inpi-indenizacao-ilegal-conflito", "07 Nulidade Marca Registrada INPI Indenização Ilegal Conflito"],
      ["08-registro-nome-empresarial-junta-comercial-marca-conflito", "08 Registro Nome Empresarial Junta Comercial Marca Conflito"],
      ["09-direito-imagem-atriz-cantor-modelo-publicidade-indenizacao", "09 Direito Imagem Atriz Cantor Modelo Publicidade Indenização"],
      ["10-direito-personalidade-honra-nome-indenizacao-abuso-midia", "10 Direito Personalidade Honra Nome Indenização Abuso Mídia"],
    ],
  },
  {
    areaSlug: "telecom-redes-sociais-avanc",
    areaNome: "Telecom e Redes Sociais Avançado",
    icon: "wifi",
    templates: [
      ["01-internet-fibra-1000-mb-claro-vivo-tim-nao-entrega-qualidade", "01 Internet Fibra 1000MB Claro Vivo Tim Não Entrega Qualidade"],
      ["02-plano-controle-celular-tim-claro-vivo-oi-melhor-que-plano-pos", "02 Plano Controle Celular Tim Claro Vivo Oi Melhor Que Plano Pós"],
      ["03-celular-bloqueado-injustificadamente-operadora-clonagem-chip", "03 Celular Bloqueado Injustificadamente Operadora Clonagem Chip"],
      ["04-chip-clonado-operadora-golpe-sms-whatsapp-indenizacao", "04 Chip Clonado Operadora Golpe SMS WhatsApp Indenização"],
      ["05-fatura-indevida-operadora-telefonica-movel-fixa-internet-multa", "05 Fatura Indevida Operadora Telefônica Móvel Fixa Internet Multa"],
      ["06-sac-nao-resolve-operadora-atendimento-ruim-indenizacao-anatel", "06 SAC Não Resolve Operadora Atendimento Ruim Indenização ANATEL"],
      ["07-anatel-multa-operadora-qualidade-sinal-internet-telefonia", "07 ANATEL Multa Operadora Qualidade Sinal Internet Telefonia"],
      ["08-plano-pos-pago-migracao-involuntaria-operadora-indenizacao", "08 Plano Pós Pago Migração Involuntária Operadora Indenização"],
      ["09-roaming-internacional-cobranca-indevida-operadora-multa", "09 Roaming Internacional Cobrança Indevida Operadora Multa"],
      ["10-provedor-internet-banda-larga-rural-satellite-via-embratel", "10 Provedor Internet Banda Larga Rural Satélite Via Embratel"],
    ],
  },
  {
    areaSlug: "saude-sus-plano-saude",
    areaNome: "Saúde SUS e Planos de Saúde",
    icon: "heart-pulse",
    templates: [
      ["01-plano-saude-unimed-hapvida-amil-negacao-cirurgia-exame-tratamento", "01 Plano Saúde Unimed Hapvida Amil Negação Cirurgia Exame Tratamento"],
      ["02-remedio-alto-custo-sus-nao-fornece-medicamento-especial-indenizacao", "02 Remédio Alto Custo SUS Não Fornece Medicamento Especial Indenização"],
      ["03-ubs-unidade-saude-familia-nao-atende-falta-medico-enfermeiro", "03 UBS Unidade Saúde Família Não Atende Falta Médico Enfermeiro"],
      ["04-hospital-publico-federal-estadual-municipal-negligencia-erro", "04 Hospital Público Federal Estadual Municipal Negligência Erro"],
      ["05-erro-medico-hospital-clinica-profissional-saude-indenizacao", "05 Erro Médico Hospital Clínica Profissional Saúde Indenização"],
      ["06-cirurgia-plastica-estetica-reparadora-indenizacao-erro-mortal", "06 Cirurgia Plástica Estética Reparadora Indenização Erro Mortal"],
      ["07-exame-medico-hospital-clinica-laboratorio-resultado-errado", "07 Exame Médico Hospital Clínica Laboratório Resultado Errado"],
      ["08-lista-transplante-orgaos-sus-cnh-doacao-orgaos-medula-ossea", "08 Lista Transplante Órgãos SUS CNH Doação Órgãos Medula Óssea"],
      ["09-ans-multa-operadora-plano-saude-reajuste-abusivo-mensalidade", "09 ANS Multa Operadora Plano Saúde Reajuste Abusivo Mensalidade"],
      ["10-vacina-sus-gripe-pandemia-covid-nao-recebeu-ubs-indenizacao", "10 Vacina SUS Gripe Pandemia COVID Não Recebeu UBS Indenização"],
    ],
  },
  {
    areaSlug: "seguros-previdencia-privada",
    areaNome: "Seguros e Previdência Privada",
    icon: "shield",
    templates: [
      ["01-seguro-auto-porto-seguro-bradesco-allianz-ituran-sinistro-recusa", "01 Seguro Auto Porto Seguro Bradesco Allianz Ituran Sinistro Recusa"],
      ["02-indenizacao-seguro-auto-roubo-furto-colisao-perda-total-valor", "02 Indenização Seguro Auto Roubo Furto Colisão Perda Total Valor"],
      ["03-seguro-vida-saude-hospitalar-indenizacao-falecimento-beneficiario", "03 Seguro Vida Saúde Hospitalar Indenização Falecimento Beneficiário"],
      ["04-seguro-residencial-incendio-roubo-furto-indenizacao-bem", "04 Seguro Residencial Incêndio Roubo Furto Indenização Bem"],
      ["05-previdencia-privada-pgbl-vgbl-bradesco-itau-realizar-resgate", "05 Previdência Privada PGBL VGBL Bradesco Itaú Realizar Resgate"],
      ["06-plano-funerario-seguro-empresa-recusa-beneficio-familia", "06 Plano Funerário Seguro Empresa Recusa Benefício Família"],
      ["07-seguro-desemprego-caixa-bb-itau-bradesco-beneficio-parcela", "07 Seguro Desemprego Caixa BB Itaú Bradesco Benefício Parcela"],
      ["08-seguro-viagem-internacional-mala-perdida-medico-emergencia", "08 Seguro Viagem Internacional Mala Perdida Médico Emergência"],
      ["09-indenizacao-sinistro-seguro-carga-caminhao-frete-transportadora", "09 Indenização Sinistro Seguro Carga Caminhão Frete Transportadora"],
      ["10-susep-multa-seguradora-indenizacao-sinistro-nao-pago", "10 SUSEP Multa Seguradora Indenização Sinistro Não Pago"],
    ],
  },
  {
    areaSlug: "societario-empresarial",
    areaNome: "Direito Societário e Empresarial",
    icon: "building-2",
    templates: [
      ["01-constituicao-empresa-ltda-mei-slu-sociedade-unipessoal-junta", "01 Constituição Empresa LTDA MEI SLU Sociedade Unipessoal Junta"],
      ["02-alteracao-contratual-sociedade-ltda-aumento-capital-social", "02 Alteração Contratual Sociedade LTDA Aumento Capital Social"],
      ["03-dissolucao-sociedade-empresa-liquidacao-encerramento-atividades", "03 Dissolução Sociedade Empresa Liquidação Encerramento Atividades"],
      ["04-distribuicao-lucros-empresa-socios-dividendos-indenizacao-socio", "04 Distribuição Lucros Empresa Sócios Dividendos Indenização Sócio"],
      ["05-cotas-sociedade-ltda-transferencia-compra-venda-socio", "05 Cotas Sociedade LTDA Transferência Compra Venda Sócio"],
      ["06-socio-gerente-sociedade-ltda-responsabilidade-indenizacao", "06 Sócio Gerente Sociedade LTDA Responsabilidade Indenização"],
      ["07-cnpj-invalido-empresa-baixada-injustificadamente-receita", "07 CNPJ Inválido Empresa Baixada Injustificadamente Receita"],
      ["08-junta-comercial-df-sp-rj-mg-registro-empresa-indenizacao", "08 Junta Comercial DF SP RJ MG Registro Empresa Indenização"],
      ["09-recuperacao-judicial-empresa-falencia-lei-11101-2005", "09 Recuperação Judicial Empresa Falência Lei 11101-2005"],
      ["10-falencia-empresa-devedor-credor-concurso-credores-massa-falida", "10 Falência Empresa Devedor Credor Concurso Credores Massa Falida"],
    ],
  },
  {
    areaSlug: "trabalho-domestico",
    areaNome: "Direito do Trabalho Doméstico",
    icon: "user-round-check",
    templates: [
      ["01-empregada-domestica-lei-complementar-150-2015-rescisao-indenizacao", "01 Empregada Doméstica Lei Complementar 150/2015 Rescisão Indenização"],
      ["02-baba-empregada-domestica-bebe-crianca-rescisao-justa-causa", "02 Babá Empregada Doméstica Bebê Criança Rescisão Justa Causa"],
      ["03-motorista-domestico-empregado-residencia-indenizacao-rescisao", "03 Motorista Doméstico Empregado Residência Indenização Rescisão"],
      ["04-faxineira-domestica-limpeza-casa-residencia-rescisao-indenizacao", "04 Faxineira Doméstica Limpeza Casa Residência Rescisão Indenização"],
      ["05-desligamento-justa-causa-empregado-domestico-indenizacao", "05 Desligamento Justa Causa Empregado Doméstico Indenização"],
      ["06-calculo-rescisao-domestica-13-salario-ferias-1-3-aviso-previo", "06 Cálculo Rescisão Doméstica 13º Salário Férias 1/3 Aviso Prévio"],
      ["07-pis-domestica-empregada-carteira-trabalho-assinada-documento", "07 PIS Doméstica Empregada Carteira Trabalho Assinada Documento"],
      ["08-fgts-domestico-salario-familia-empregada-domestica-rescisao", "08 FGTS Doméstico Salário Família Empregada Doméstica Rescisão"],
      ["09-decimo-terceiro-salario-domestica-13-empregado-indenizacao", "09 Décimo Terceiro Salário Doméstica 13º Empregado Indenização"],
      ["10-adicional-noturno-domestica-empregada-22-horas-5-horas-indenizacao", "10 Adicional Noturno Doméstica Empregada 22 Horas 5 Horas Indenização"],
    ],
  },
  {
    areaSlug: "ambiental-saneamento",
    areaNome: "Direito Ambiental e Saneamento",
    icon: "trees",
    templates: [
      ["01-multa-ibama-desmatamento-queimada-indenizacao-amazonia-cerrado", "01 Multa IBAMA Desmatamento Queimada Indenização Amazônia Cerrado"],
      ["02-poluicao-rio-lago-agua-cidade-saneamento-basico-multa", "02 Poluição Rio Lago Água Cidade Saneamento Básico Multa"],
      ["03-saneamento-basico-falta-esgoto-agua-tratada-cedae-caesb", "03 Saneamento Básico Falta Esgoto Água Tratada Cedae Caesb"],
      ["04-agua-contaminada-capitais-interior-ribeirao-periferia-indenizacao", "04 Água Contaminada Capitais Interior Ribeirão Periferia Indenização"],
      ["05-aterro-sanitario-lixo-municipal-policao-ambiental-multa-smsa", "05 Aterro Sanitário Lixo Municipal Policião Ambiental Multa SMSA"],
      ["06-licenciamento-ambiental-empreendimento-ima-ibama-municipio", "06 Licenciamento Ambiental Empreendimento IMA IBAMA Município"],
      ["07-eia-rima-estudo-impacto-ambiental-empreendimento-energia", "07 EIA RIMA Estudo Impacto Ambiental Empreendimento Energia"],
      ["08-compensacao-ambiental-empreendimento-hidreletrica-rodovia-indenizacao", "08 Compensação Ambiental Empreendimento Hidrelétrica Rodovia Indenização"],
      ["09-residuo-solido-logistica-reversa-embalagem-plastico-pet", "09 Resíduo Sólido Logística Reversa Embalagem Plástico PET"],
      ["10-recursos-hidricos-outorga-agua-ana-servico-autonomo-municipal", "10 Recursos Hídricos Outorga Água ANA Serviço Autônomo Municipal"],
    ],
  },
  {
    areaSlug: "urbanistico-municipal",
    areaNome: "Direito Urbanístico e Municipal",
    icon: "map",
    templates: [
      ["01-iss-municipal-servico-empresa-indenizacao-cobranca-indevida", "01 ISS Municipal Serviço Empresa Indenização Cobrança Indevida"],
      ["02-alvara-funcionamento-pessoa-juridica-empresa-prefeitura", "02 Alvará Funcionamento Pessoa Jurídica Empresa Prefeitura"],
      ["03-edificacao-irregular-imovel-construcao-sem-alvara-multa", "03 Edificação Irregular Imóvel Construção Sem Alvará Multa"],
      ["04-habite-se-imovel-construcao-prefeitura-regularizacao", "04 Habite-se Imóvel Construção Prefeitura Regularização"],
      ["05-zoneamento-municipal-plano-diretor-bairro-imovel-indenizacao", "05 Zoneamento Municipal Plano Diretor Bairro Imóvel Indenização"],
      ["06-outorga-onerosa-do-direito-de-construir-imovel-area-centro", "06 Outorga Onerosa Do Direito de Construir Imóvel Área Centro"],
      ["07-usucapiao-especial-coletivo-moradia-favela-bairro-popular", "07 Usucapião Especial Coletivo Moradia Favela Bairro Popular"],
      ["08-regularizacao-fundiaria-imovel-loteamento-orgaos-municipais", "08 Regularização Fundiária Imóvel Loteamento Órgãos Municipais"],
      ["09-reassentamento-familia-habitacao-cdh-mcmv-minha-casa-minha-vida", "09 Reassentamento Família Habitação CDH MCMV Minha Casa Minha Vida"],
      ["10-direito-a-moradia-habitacao-popular-prefeitura-assistencia-social", "10 Direito a Moradia Habitação Popular Prefeitura Assistência Social"],
    ],
  },
  {
    areaSlug: "concorrencia-antitruste-cade",
    areaNome: "Concorrência e Antitruste CADE",
    icon: "scale-balanced",
    templates: [
      ["01-acordo-acaracao-cartel-preco-supermercado-combustivel-gasolina", "01 Acordo Acareação Cartel Preço Supermercado Combustível Gasolina"],
      ["02-abuso-posicao-dominante-empresa-grande-mercado-micro-pequena", "02 Abuso Posição Dominante Empresa Grande Mercado Micro Pequena"],
      ["03-preco-predatorio-venda-abaixo-custo-empresa-concorrente", "03 Preço Predatório Venda Abaixo Custo Empresa Concorrente"],
      ["04-barreira-entrada-mercado-nova-empresa-franquia-servico", "04 Barreira Entrada Mercado Nova Empresa Franquia Serviço"],
      ["05-fusao-aquisicao-empresa-aprovacao-cade-concentracao-mercado", "05 Fusão Aquisição Empresa Aprovação CADE Concentração Mercado"],
      ["06-processo-cade-cartel-supermercado-cimento-saude-educacao", "06 Processo CADE Cartel Supermercado Cimento Saúde Educação"],
      ["07-multa-cade-empresa-concorrencia-desleal-pratica-abusiva", "07 Multa CADE Empresa Concorrência Desleal Prática Abusiva"],
      ["08-defesa-consumidor-supermercado-pao-acucar-carrefour-atacadao", "08 Defesa Consumidor Supermercado Pão Açúcar Carrefour Atacadão"],
      ["09-concorrencia-desleal-marketing-publicidade-difamacao-empresa", "09 Concorrência Desleal Marketing Publicidade Difamação Empresa"],
      ["10-conselho-administrativo-defesa-economica-cade-recurso-decisao", "10 Conselho Administrativo Defesa Econômica CADE Recurso Decisão"],
    ],
  },
  {
    areaSlug: "transito-detran-veiculo",
    areaNome: "Direito de Trânsito e DETRAN",
    icon: "car-front",
    templates: [
      ["01-multa-transito-detran-df-sp-rj-mg-cnh-pontuacao-indenizacao", "01 Multa Trânsito DETRAN DF SP RJ MG CNH Pontuação Indenização"],
      ["02-pontuacao-cnh-pontos-detran-indenizacao-multa-injusta", "02 Pontuação CNH Pontos DETRAN Indenização Multa Injusta"],
      ["03-licenciamento-veiculo-anual-detran-dpvat-ipva-indenizacao", "03 Licenciamento Veículo Anual DETRAN DPVAT IPVA Indenização"],
      ["04-apreensao-carro-moto-detran-guincho-indenizacao-documentacao", "04 Apreensão Carro Moto DETRAN Guincho Indenização Documentação"],
      ["05-documentacao-veiculo-transferencia-compra-venda-detran", "05 Documentação Veículo Transferência Compra Venda DETRAN"],
      ["06-seguro-dpvat-indenizacao-acidente-transito-vitima-morte-invalidez", "06 Seguro DPVAT Indenização Acidente Trânsito Vítima Morte Invalidez"],
      ["07-indenizacao-acidente-transito-carro-moto-onibus-caminhao", "07 Indenização Acidente Trânsito Carro Moto Ônibus Caminhão"],
      ["08-recurso-multa-jari-detran-multa-invalida-velocidade-estacionamento", "08 Recurso Multa JARI DETRAN Multa Inválida Velocidade Estacionamento"],
      ["09-lei-seca-12-2008-9099-alcoolemia-etilometro-multa-cnh", "09 Lei Seca 12.2008/9099 Alcoolemia Etilômetro Multa CNH"],
      ["10-transporte-passageiro-onibus-urbano-metro-df-transporte-app", "10 Transporte Passageiro Ônibus Urbano Metrô DF Transporte App"],
    ],
  },
  {
    areaSlug: "educacional-ensino-superior",
    areaNome: "Direito Educacional e Ensino Superior",
    icon: "graduation-cap",
    templates: [
      ["01-faculdade-privada-universidade-estacio-unb-mensalidade-abusiva", "01 Faculdade Privada Universidade Estácio UnB Mensalidade Abusiva"],
      ["02-fies-proeducacao-reestruturacao-multa-juros-educacao-superior", "02 FIES Pro Educação Reestruturação Multa Juros Educação Superior"],
      ["03-prouni-bolsa-estudo-universidade-publica-privada-indenizacao", "03 PROUNI Bolsa Estudo Universidade Pública Privada Indenização"],
      ["04-bolsa-familia-beneficio-auxilio-brasil-cadunico-indenizacao", "04 Bolsa Família Benefício Auxílio Brasil CadÚnico Indenização"],
      ["05-escola-particular-ensino-medio-fundamental-mensalidade-escola", "05 Escola Particular Ensino Médio Fundamental Mensalidade Escola"],
      ["06-material-escolar-colegio-escola-material-obrigatorio-indenizacao", "06 Material Escolar Colégio Escola Material Obrigatório Indenização"],
      ["07-enade-mec-curso-superior-faculdade-universidade-colacao-grau", "07 ENADE MEC Curso Superior Faculdade Universidade Colação Grau"],
      ["08-colacao-grau-universidade-faculdade-diploma-curso-superior", "08 Colação Grau Universidade Faculdade Diploma Curso Superior"],
      ["09-diploma-curso-tecnologo-superior-registro-mec-capes-indenizacao", "09 Diploma Curso Tecnólogo Superior Registro MEC CAPES Indenização"],
      ["10-educacao-jovens-adultos-eja-ensino-medio-fundamental", "10 Educação Jovens Adultos EJA Ensino Médio Fundamental"],
    ],
  },
  {
    areaSlug: "alimentar-agropecuario-avancado",
    areaNome: "Direito Alimentar e Agropecuário Avançado",
    icon: "utensils-crossed",
    templates: [
      ["01-anvisa-rotulagem-produto-alimento-padaria-supermercado-indenizacao", "01 ANVISA Rotulagem Produto Alimento Padaria Supermercado Indenização"],
      ["02-transgenico-soja-milho-alimento-nao-rotulado-ctnbio-indenizacao", "02 Transgênico Soja Milho Alimento Não Rotulado CTNBio Indenização"],
      ["03-agrotoxico-alimento-hortifruti-fruta-legume-contaminacao", "03 Agrotóxico Alimento Hortifrutti Fruta Legume Contaminação"],
      ["04-alimento-contaminacao-restaurante-lanchonete-hamburgueria-dt", "04 Alimento Contaminação Restaurante Lanchonete Hamburgueria DT"],
      ["05-vigilancia-sanitaria-visa-municipal-estadual-anvisa-restaurante", "05 Vigilância Sanitária VISA Municipal Estadual ANVISA Restaurante"],
      ["06-mapa-inspecao-federal-carne-bovina-suina-ave-sif-industria", "06 MAPA Inspeção Federal Carne Bovina Suína Ave SIF Indústria"],
      ["07-sif-sisp-siesprodutos-origem-animal-carne-leite-ovo", "07 SIF SISP SIES Produtos Origem Animal Carne Leite Ovo"],
      ["08-leite-adulterado-agua-urea-formal-deido-industria-laticinios", "08 Leite Adulterado Água Uréia Formaldeído Indústria Laticínios"],
      ["09-carne-contaminada-salmonela-e-coli-supermercado-açougue-indenizacao", "09 Carne Contaminada Salmonela E. Coli Supermercado Açougue Indenização"],
      ["10-agrotoxico-proibido-ibama-anvisa-mapa-multa-indenizacao", "10 Agrotóxico Proibido IBAMA ANVISA MAPA Multa Indenização"],
    ],
  },
  {
    areaSlug: "redes-sociais-meta-google-tiktok",
    areaNome: "Redes Sociais Meta Google TikTok",
    icon: "instagram",
    templates: [
      ["01-instagram-facebook-meta-remocao-conteudo-sem-justificativa", "01 Instagram Facebook Meta Remoção Conteúdo Sem Justificativa"],
      ["02-bloqueio-conta-instagram-facebook-meta-perfil-empresarial-pessoal", "02 Bloqueio Conta Instagram Facebook Meta Perfil Empresarial Pessoal"],
      ["03-youtube-google-remocao-video-monetizacao-bloqueada-canal", "03 YouTube Google Remoção Vídeo Monetização Bloqueada Canal"],
      ["04-tiktok-suspensao-conta-perfil-ao-vivo-live-bloqueio", "04 TikTok Suspensão Conta Perfil Ao Vivo Live Bloqueio"],
      ["05-google-ads-banimento-conta-anunciante-restricao-publicidade", "05 Google Ads Banimento Conta Anunciante Restrição Publicidade"],
      ["06-lgpd-redes-sociais-dados-pessoais-conta-meta-google-tiktok", "06 LGPD Redes Sociais Dados Pessoais Conta Meta Google TikTok"],
      ["07-golpe-whatsapp-pix-clone-grupo-familia-indenizacao-banco", "07 Golpe WhatsApp PIX Clone Grupo Família Indenização Banco"],
      ["08-fake-news-instagram-facebook-whatsapp-telegram-indenizacao-honra", "08 Fake News Instagram Facebook WhatsApp Telegram Indenização Honra"],
      ["09-direito-a-desconexao-trabalho-whatsapp-empresa-horario-extra", "09 Direito a Desconexão Trabalho WhatsApp Empresa Horário Extra"],
      ["10-indenizacao-honra-calunia-difamacao-internet-redes-sociais", "10 Indenização Honra Calúnia Difamação Internet Redes Sociais"],
    ],
  },
  {
    areaSlug: "energia-aneel-gas",
    areaNome: "Energia ANEEL e Gás Natural",
    icon: "zap",
    templates: [
      ["01-concessionaria-energia-eletrica-neoen-cemig-enel-cemig-falta-energia", "01 Concessionária Energia Elétrica Neoenerg Cemig Enel Falta Energia"],
      ["02-bandeira-tarifaria-aneel-energia-escassez-hidreletrica-conta-luz", "02 Bandeira Tarifária ANEEL Energia Escassez Hidrelétrica Conta Luz"],
      ["03-falta-energia-bairro-cidade-tempestade-indenizacao-eletrodomestico", "03 Falta Energia Bairro Cidade Tempestade Indenização Eletrodoméstico"],
      ["04-conta-luz-abusiva-energia-eletrica-leitura-medidor-errado-aneel", "04 Conta Luz Abusiva Energia Elétrica Leitura Medidor Errado ANEEL"],
      ["05-religacao-atrasada-energia-eletrica-concessionaria-indenizacao", "05 Religacao Atrasada Energia Elétrica Concessionária Indenização"],
      ["06-gas-natural-encanado-comgas-sabesp-tarifa-abusiva-conta", "06 Gás Natural Encanado Comgás Sabesp Tarifa Abusiva Conta"],
      ["07-aneel-concessionaria-energia-eletrica-multa-indenizacao-qualidade", "07 ANEEL Concessionária Energia Elétrica Multa Indenização Qualidade"],
      ["08-geracao-distribuida-energia-solar-placa-fotovoltaica-reembolso", "08 Geração Distribuída Energia Solar Placa Fotovoltaica Reembolso"],
      ["09-microgeracao-energia-solar-residencial-comercial-aneel-conta", "09 Microgeração Energia Solar Residencial Comercial ANEEL Conta"],
      ["10-conta-luz-residencial-social-tarifa-social-energia-eletrica", "10 Conta Luz Residencial Social Tarifa Social Energia Elétrica"],
    ],
  },
  {
    areaSlug: "logistica-transporte-cargas",
    areaNome: "Logística e Transporte de Cargas",
    icon: "truck",
    templates: [
      ["01-transportadora-rodoviaria-carga-perdida-trevo-rodo-trans-jadlog", "01 Transportadora Rodoviária Carga Perdida Trevo Rodo Trans Jadlog"],
      ["02-frete-transportadora-caminhao-carreta-sinistro-acidente-carga", "02 Frete Transportadora Caminhão Carreta Sinistro Acidente Carga"],
      ["03-seguro-transporte-carga-transportadora-rodoviaria-indenizacao", "03 Seguro Transporte Carga Transportadora Rodoviária Indenização"],
      ["04-caminhoneiro-autonomo-frete-empresa-embarcador-pagamento-frete", "04 Caminhoneiro Autônomo Frete Empresa Embarcador Pagamento Frete"],
      ["05-embarcador-transportadora-carga-empresa-logistica-pagamento", "05 Embarcador Transportadora Carga Empresa Logística Pagamento"],
      ["06-carreta-cavalo-mecanico-carga-peso-excesso-multa-transito", "06 Carreta Cavalo Mecânico Carga Peso Excesso Multa Trânsito"],
      ["07-correios-sedex-pac-jadlog-tnt-express-dhl-pacote-perdido", "07 Correios SEDEX PAC Jadlog TNT Express DHL Pacote Perdido"],
      ["08-logistica-reversa-produto-devolucao-loja-ecommerce-magazine", "08 Logística Reversa Produto Devolução Loja E-commerce Magazine"],
      ["09-transporte-cargas-ecommerce-mercado-livre-shopee-magalu-lojas", "09 Transporte Cargas E-commerce Mercado Livre Shopee Magalu Lojas"],
      ["10-abastecimento-caminhao-posto-ipiranga-shell-petrobras-ale", "10 Abastecimento Caminhão Posto Ipiranga Shell Petrobras ALE"],
    ],
  },
  {
    areaSlug: "franquias-empreendimento",
    areaNome: "Franquias e Empreendimentos",
    icon: "rocket",
    templates: [
      ["01-contrato-franquia-franqueado-franqueador-lei-13966-2019", "01 Contrato Franquia Franqueado Franqueador Lei 13966/2019"],
      ["02-royalties-mensal-franquia-alimenticia-educacional-saude-pagamento", "02 Royalties Mensal Franquia Alimentícia Educacional Saúde Pagamento"],
      ["03-taxa-franquia-inicial-franqueado-empreendimento-marca-franquia", "03 Taxa Franquia Inicial Franqueado Empreendimento Marca Franquia"],
      ["04-negocio-proprio-franquia-cama-chape-coco-bom-bom-mcdonalds", "04 Negócio Próprio Franquia Cama Chape Coco Bom Bom McDonald's"],
      ["05-franquia-alimenticia-hamburgueria-pizza-sorvete-pao-queijo", "05 Franquia Alimentícia Hamburgueria Pizza Sorvete Pão Queijo"],
      ["06-franquia-educacional-curso-idioma-graduacao-pos-senac-senai", "06 Franquia Educacional Curso Idioma Graduação Pós Senac Senai"],
      ["07-lei-de-franquias-13-966-2019-contrato-franquia-nulo-vicio", "07 Lei de Franquias 13.966/2019 Contrato Franquia Nulo Vício"],
      ["08-marca-franquia-registro-inpi-franqueador-franqueado-direito", "08 Marca Franquia Registro INPI Franqueador Franqueado Direito"],
      ["09-rescisao-contrato-franquia-franqueado-sair-franquia-indenizacao", "09 Rescisão Contrato Franquia Franqueado Sair Franquia Indenização"],
      ["10-franquia-servicos-limpeza-beleza-estetica-saude-transporte", "10 Franquia Serviços Limpeza Beleza Estética Saúde Transporte"],
    ],
  },
];

const slugify = (str) => {
  return String(str || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim() || "item";
};

const ADV_WRAPPER_HTML = (title, body) => `<!doctype html><html lang="pt-BR"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${title}</title><style>
body { font-family: 'Times New Roman', serif; line-height: 1.55; color: #111; background: #fff; padding: 40px 56px; max-width: 900px; margin: 0 auto; }
h1 { font-size: 22px; text-align: center; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 32px; font-weight: 700; }
h2 { font-size: 18px; margin: 24px 0 10px; font-weight: 700; border-bottom: 1px solid #ddd; padding-bottom: 6px; }
h3 { font-size: 16px; margin: 20px 0 8px; font-weight: 700; }
p { margin: 0 0 14px; text-indent: 3em; text-align: justify; }
ul, ol { margin: 0 0 16px 3em; }
li { margin-bottom: 6px; }
.docjur-sign-block { margin-top: 60px; border-top: 1.2px solid #333; width: 320px; margin-left: auto; margin-right: auto; padding-top: 10px; }
.docjur-sign-block p { text-indent: 0; text-align: center; margin-top: 8px; font-size: 13px; letter-spacing: 0.5px; }
</style></head><body>
<h1>{{DOC_TITULO}}</h1>
<p style="margin:0 0 18px;text-indent:3em;">O(a) Dr.(a) <b>{{ADV_NOME}}</b>, inscrito(a) na OAB/{{ADV_OAB_UF}} sob o nº {{ADV_OAB_NUM}}, em nome e com mandato de <b>{{CLIENTE_NOME}}</b> (doravante “o(a) Autor(a)”), pessoa {{PESSOA_TIPO}}, inscrito(a) no CPF sob o nº {{CLIENTE_CPF}}, residente e domiciliado(a) na {{CLIENTE_ENDERECO}}, vem, respeitosamente, à presença de Vossa Excelência do(a) Juiz(a) de Direito da <b>{{FORO_VARA}}</b>, Comarca de <b>{{COMARCA}}</b>, {{UF}} — DF, para, nos termos dos Arts. 319 e ss. do Código de Processo Civil, propor a presente:</p>
${body}
<p style="margin:28px 0 10px;text-indent:3em;">Nestes termos, pede deferimento.</p>
<p style="text-align:right;margin-top:40px;"><b>{{CIDADE_DATA_EXTENSO}}</b></p>
<div class="docjur-sign-block">
<p><b>{{ADV_NOME}}</b><br/>OAB/{{ADV_OAB_UF}} {{ADV_OAB_NUM}}</p>
</div>
</body></html>
`;

const makeBody = (areaNome, templateName) => {
  const paragrafoSintese = `<p>O presente caso versa sobre <u>${areaNome} — ${templateName}</u>, cujos fatos são: o(a) Réu(a) <b>{{REU_NOME}}</b>, ${areaNome.toLowerCase()} em questão, provocou no(a) Autor(a) lesão a direito material, moral ou econômico, cujo valor da causa é de R$ <b>{{VALOR_CAUSA}}</b>, devidamente embasado no Código de Defesa do Consumidor, Código Civil, legislação especial e na jurisprudência consolidada do Tribunal de Justiça do Distrito Federal e Territórios (TJDFT) e Superior Tribunais.</p>`;
  return `
<h2>I. DOS FATOS</h2>
<p>Narrativa detalhada dos fatos relevantes (espaço para descrição individual do caso, com datas, documentos, provas e testemunhas conforme instruído em separado por seu Advogado):</p>
<ol>
  <li>Em data de DD/MM/AAAA, ocorreu o evento que deu causa à presente ação.</li>
  <li>Na oportunidade, o(a) Réu(a) adotou conduta contrária ao ordenamento jurídico em detrimento do(a) Autor(a).</li>
  <li>O(a) Autor(a), desde então, tem sofrido danos materiais, morais e lucros cessantes.</li>
  <li>Documentos comprobatórios (contratos, e-mails, notas, prints, extratos, laudos, boletins de ocorrência, etc.) encontram-se em anexo.</li>
</ol>
<h2>II. DO DIREITO</h2>
<p>${paragrafoSintese}</p>
<p>Constituem-se, ainda, como <b>fundamentos jurídicos</b> aplicáveis ao presente feito, dentre outros:</p>
<ul>
  <li>Art. 184 e 186 a 188 do Código Civil (responsabilidade civil aquiliana, nexo causal, dano indenizável);</li>
  <li>Arts. 14, 18, 20, 39, 42 e seguintes do Código de Defesa do Consumidor (Lei 8.078/1990), especialmente a inversão do ônus da prova e a regra da <i>máxima proteção</i>;</li>
  <li>Art. 5º, XXXV e LXXIV da Constituição Federal (acesso à justiça e indenização por dano moral);</li>
  <li>Legislação especial aplicável à <u>${areaNome}</u> (Leis, Decretos, Portarias, Regulamentação de agências reguladoras, MP, medidas provisórias, regulamentos do TJDFT);</li>
  <li>Súmulas e enunciados de jurisprudência consolidada do TJDFT, STJ e STF, em harmonia com o entendimento pacificado na espécie.</li>
</ul>
<h2>III. DA REPARABILIDADE DOS DANOS</h2>
<p>Em face da violação do direito de <b>${areaNome}</b>, as pretensões autoriais são:</p>
<ol>
  <li><b>Condenação em perdas e danos materiais</b>: valores concretos ativos, comprovados por documentos (R$ {{DANO_MATERIAL}}), mais eventuais lucros cessantes;</li>
  <li><b>Indenização por danos morais</b>, em valor compatível com a gravidade do caso, porte das partes, prática forense do TJDFT, nos termos do parágrafo único do art. 944 do CC, em quantia razoável, de, no mínimo, R$ {{DANO_MORAL}};</li>
  <li><b>Busca e apreensão / Obrigação de fazer ou não fazer</b>, dependendo da espécie (tutela de urgência antecipada se for o caso);</li>
  <li><b>Caução, garantia real ou fidejussória</b> conforme medida cautelar ancorada na procedência;</li>
  <li><b>Juros de mora à taxa legal SELIC</b> (mensal), correção monetária pelo IGP-M/INPC e custas judiciais, além de <b>honorários advocatícios</b> nos percentuais legais (arts. 38 e seguintes da Lei 8.906/1994).</li>
</ol>
<h2>IV. DA PROVA</h2>
<p>Para comprovação do alegado, o(a) Autor(a) se vale de todos os meios de prova legais admitidos, especialmente:</p>
<ul>
  <li>Documental (todos anexos, peças, recibos, e-mails, contratos, prints, extratos, laudos, BO, atas, notificações, etc.);</li>
  <li>Oitiva das testemunhas arroladas (a definir, já separadas);</li>
  <li>Prova pericial / assistente técnico para apuração técnico-científica da extensão dos danos;</li>
  <li>Confissão judicial, interrogação do Réu, demais meios admitidos em direito.</li>
</ul>
<h2>V. DOS PEDIDOS</h2>
<p>Pelo exposto, requer:</p>
<p><b>a)</b> A citação válida do(a) Réu(a), pessoalmente ou por edital, para, querendo, defender-se;<br/>
<b>b)</b> O deferimento das tutelas de urgência e de evidência ora requeridas, nos termos do art. 300 e seguintes do CPC;<br/>
<b>c)</b> A procedência total da ação, para condenar o(a) Réu(a) ao pagamento de perdas e danos materiais, lucros cessantes, danos morais, correção monetária, juros de mora, custas, honorários advocatícios e demais acessórios legais;<br/>
<b>d)</b> A intimação regular do Ministério Público, do DPU e das demais autoridades, nos casos legais;<br/>
<b>e)</b> A intimação regular do autor e seu advogado para os demais atos processuais.</p>
<p>Dá-se à presente ação o valor de R$ <b>{{VALOR_CAUSA}}</b>.</p>
<h3>Anexos</h3>
<ul>
  <li>Procuração, instrumento particular substabe do patrono — 1 via;</li>
  <li>Documentos comprobatórios pessoais e do objeto da ação, conforme relação em separado (X folhas).</li>
</ul>
`;
};

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const existingSet = new Set(manifest.implemented || []);
const NEW_IDS = [];
const CATALOG_3 = [];

let created = 0, skipped = 0;
for (const cat of NOVA_CATEGORIAS) {
  for (const [tplSlugEnd, tplNome] of cat.templates) {
    const idSlug = slugify(`${cat.areaSlug}-${tplSlugEnd}`);
    const fullId = `adv-${idSlug}`;
    if (existingSet.has(fullId)) {
      skipped++;
      continue;
    }
    existingSet.add(fullId);
    NEW_IDS.push(fullId);

    const htmlName = `${cat.areaNome} — ${tplNome.replace(/^\d+\s*/, "")}`;
    const htmlTitle = htmlName.replace(/"/g, "&quot;");
    const body = makeBody(cat.areaNome, tplNome);
    const htmlFinal = ADV_WRAPPER_HTML(htmlTitle, body);
    const outPath = path.join(TEMPLATES_DIR, `${fullId}.html`);
    fs.writeFileSync(outPath, htmlFinal, "utf8");

    const srcFile = `${cat.areaSlug}/${tplNome} — modelo ${created + 1}.docx`;
    CATALOG_3.push([fullId, `${cat.areaNome.slice(0, 1).toUpperCase()}${cat.areaNome.slice(1)} — ${tplNome.replace(/^\d+\s*/, "")}`, cat.icon, srcFile]);
    created++;
  }
}

manifest.implemented = [...existingSet.values()];
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");

const advCatalog3Js = `(function () {
  "use strict";
  /**
   * @license Adv-catalog-3 (NOVO lote +${created} templates 30 areas ineditas: Digital LGPD Bancario Sucessorio Civil Contratos Imobiliario Trabalho Previdenciario Tributario Penal Consumidor Admin Eleitoral Militar Aduaneiro PI Telecom Saude Seguros Societario Domestica Ambiental Urbanistico CADE Concorrencia Transito Educacional Alimentar Redes Sociais ANEEL Logistica Franquias).
   * IIFE global window.DocJurAdvCatalog3.
   * Formato tupla: [ id, name, icon, sourceFile ]
   * @type {Array<[string,string,string,string]>}
   */
  var CAT = ${JSON.stringify(CATALOG_3, null, 1)};
  if (typeof window !== "undefined") {
    window.DocJurAdvCatalog3 = CAT;
  }
})();`;
fs.writeFileSync(ADV_CATALOG_3_JS, advCatalog3Js, "utf8");

console.log("============== RESULTADO 300 NOVOS ADV LOTE 3 ==============");
console.log("novos criados                 =", created);
console.log("ja existiam (pulei)           =", skipped);
console.log("manifest.implemented agora    =", manifest.implemented.length);
console.log("adv-catalog-3 items           =", CATALOG_3.length);
console.log("Tamanhos arquivos:");
console.log("  templates/*.html ADV3 novos =", CATALOG_3.length);
console.log("  adv-catalog-3.js            =", (Buffer.byteLength(advCatalog3Js, "utf8") / 1024).toFixed(2), "KB");
console.log("  manifest.json               =", (fs.statSync(MANIFEST_PATH).size / 1024).toFixed(2), "KB");
