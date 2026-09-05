import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TEMPLATES_DIR = path.join(ROOT, "assets", "templates");
const MANIFEST_PATH = path.join(ROOT, "assets", "templates", "manifest.json");
const ADV_CATALOG_2_JS = path.join(ROOT, "assets", "js", "adv-catalog-2.js");
const SRC_ADV_DIR = "Peticao/NovosAdvGerados/";

const NOVA_CATEGORIAS = [
  {
    areaSlug: "maritimo-aquaviario",
    areaNome: "Marítimo e Aquaviário",
    icon: "ship",
    templates: [
      ["01-acidente-embarcacao-colisao-navio-indenizacao", "01 Acidente de Embarcação e Colisão de Navio Indenização"],
      ["02-polioe-pirataria-carga-roubada-transporte-maritimo", "02 Polícia Marítima Pirataria Carga Roubada Transporte Marítimo"],
      ["03-transporte-maritimo-carga-bill-of-lading-conhecimento", "03 Transporte Marítimo Carga Bill of Lading Conhecimento"],
      ["04-seguro-maritimo-carga-avaria-grosso-sinistro-recusa", "04 Seguro Marítimo Carga Avaria Grosso Sinistro Recusa"],
      ["05-estaleiro-navio-reparo-construcao-indenizacao-defeito", "05 Estaleiro Navio Reparo Construção Indenização Defeito"],
      ["06-porto-contenedor-carga-perdida-no-terminal-portuario", "06 Porto Contêiner Carga Perdida no Terminal Portuário"],
      ["07-marinheiro-empregado-adicional-insalubridade-direito-trabalho", "07 Marinheiro Empregado Adicional Insalubridade Direito Trabalho"],
      ["08-lei-do-trafego-aquaviario-multas-anatel-capitania-dos-portos", "08 Lei do Tráfego Aquaviário Multas ANATEL Capitania dos Portos"],
      ["09-convenio-salvamento-maritimo-indenizacao-premio-salvamento", "09 Convênio Salvamento Marítimo Indenização Prêmio Salvamento"],
      ["10-passeio-barco-lanchas-acidente-turismo-embarcacao-menor", "10 Passeio Barco Lanchas Acidente Turismo Embarcação Menor"],
    ],
  },
  {
    areaSlug: "aeronautico-aereo",
    areaNome: "Aeronáutico e Aviação",
    icon: "plane",
    templates: [
      ["01-acidente-aereo-aeronave-familia-vitimas-indenizacao-vida", "01 Acidente Aéreo Aeronave Família Vítimas Indenização Vida"],
      ["02-sobrebooking-overbooking-passageiro-negado-embarque-indenizacao", "02 Sobrebooking Overbooking Passageiro Negado Embarque Indenização"],
      ["03-cancelamento-voo-maior-24h-atraso-aeroporto-bagagem", "03 Cancelamento Voo Maior 24h Atraso Aeroporto Bagagem"],
      ["04-bagagem-desaparecida-perdida-extravio-teto-1-400-reais", "04 Bagagem Desaparecida Perdida Extravio Teto 1.400 Reais"],
      ["05-multa-anac-voo-cancelado-companhia-reembolso-maior-passagem", "05 Multa ANAC Voo Cancelado Companhia Reembolso Maior Passagem"],
      ["06-taxa-embarque-rollover-reembolso-passagem-nao-usada", "06 Taxa Embarque Rollover Reembolso Passagem Não Usada"],
      ["07-comissao-agencia-viagens-menos-valor-pago-aeroporto", "07 Comissão Agência Viagens Menos Valor Pago Aeroporto"],
      ["08-mudanca-companhia-aerea-diferenca-tarifa-passagem-maior", "08 Mudança Companhia Aérea Diferença Tarifa Passagem Maior"],
      ["09-trabalho-aeromoca-comandante-tripulacao-carga-horaria", "09 Trabalho Aeromoça Comandante Tripulação Carga Horária"],
      ["10-anac-sancao-regulatoria-infracao-aeronautica-multa-indenizacao", "10 ANAC Sanção Regulatória Infração Aeronáutica Multa Indenização"],
    ],
  },
  {
    areaSlug: "desportivo-esporte",
    areaNome: "Desportivo e Esporte",
    icon: "trophy",
    templates: [
      ["01-atleta-clube-contrato-rescisao-multabrilhantepremio-nao-pago", "01 Atleta Clube Contrato Rescisão Multa Brilhante Prêmio Não Pago"],
      ["02-torcedor-socio-torcedor-estadio-vantagens-nao-oferecidas", "02 Torcedor Sócio Torcedor Estádio Vantagens Não Oferecidas"],
      ["03-arbitro-sports-betting-apostas-esportivas-resultado-indeferido", "03 Árbitro Sports Betting Apostas Esportivas Resultado Indeferido"],
      ["04-cbf-campeonato-brasileiro-direito-transmissao-tv-globo-sportv", "04 CBF Campeonato Brasileiro Direito Transmissão TV Globo SporTV"],
      ["05-imovel-sede-clube-socio-torcedor-usucapiao-bem-do-clube", "05 Imóvel Sede Clube Sócio Torcedor Usucapião Bem do Clube"],
      ["06-transferencia-jogador-internacional-indenizacao-formacao-pai", "06 Transferência Jogador Internacional Indenização Formação PAI"],
      ["07-pedofilia-treinador-clube-esporte-indenizacao-dano-moral-menor", "07 Pedofilia Treinador Clube Esporte Indenização Dano Moral Menor"],
      ["08-contrato-patrocinio-marca-nao-pagamento-ou-nao-uso-da-camisa", "08 Contrato Patrocínio Marca Não Pagamento ou Não Uso da Camisa"],
      ["09-jogo-simples-intelectual-severino-campeonato-direito-autoral", "09 Jogo Simples Intelectual Severino Campeonato Direito Autoral"],
      ["10-sede-copa-do-mundo-contrato-publicitario-nao-cumprimento", "10 Sede Copa do Mundo Contrato Publicitário Não Cumprimento"],
    ],
  },
  {
    areaSlug: "imigracao-estrangeiro",
    areaNome: "Imigração e Estrangeiro",
    icon: "globe",
    templates: [
      ["01-pedido-naturalizacao-brasileira-indefinicao-nao-aprovacao", "01 Pedido Naturalização Brasileira Indefinição Não Aprovação"],
      ["02-visto-gold-hsbc-investimento-brasil-residencia-nao-concedida", "02 Visto Gold HSBC Investimento Brasil Residência Não Concedida"],
      ["03-refugiado-convencao-genebra-solicitacao-politica-indenizacao", "03 Refugiado Convenção Genebra Solicitação Política Indenização"],
      ["04-cnh-estrangeira-conversao-denuncia-irregular-detran", "04 CNH Estrangeira Conversão Denúncia Irregular DETRAN"],
      ["05-carteira-trabalho-estrangeiro-residente-temporario-nao-entregue", "05 Carteira Trabalho Estrangeiro Residente Temporário Não Entregue"],
      ["06-familia-reunificacao-familiar-visto-profissional-nao-liberado", "06 Família Reunificação Familiar Visto Profissional Não Liberado"],
      ["07-estudante-intercambio-extensao-visto-pais-de-estudante", "07 Estudante Intercâmbio Extensão Visto Pais de Estudante"],
      ["08-menor-estrangeiro-tutela-temporaria-abrigo-desabrigados", "08 Menor Estrangeiro Tutela Temporária Abrigo Desabrigados"],
      ["09-empresa-contrato-individual-trabalho-mulher-estrangeira-pedida", "09 Empresa Contrato Individual Trabalho Mulher Estrangeira Pedida"],
      ["10-deportacao-injusta-anulacao-expulsao-irregularidade-pf", "10 Deportação Injusta Anulação Expulsão Irregularidade PF"],
    ],
  },
  {
    areaSlug: "arbitragem-lei-9307",
    areaNome: "Arbitragem (Lei 9.307/96)",
    icon: "scale",
    templates: [
      ["01-clausula-arbitral-contrato-validade-e-exequibilidade", "01 Cláusula Arbitral Contrato Validade e Exequibilidade"],
      ["02-arbitro-suspeicao-impedimento-nulidade-nomeacao-irregular", "02 Árbitro Suspeição Impedimento Nulidade Nomeação Irregular"],
      ["03-execucao-sentenca-arbitral-nao-cumprimento-pedido-exequatur", "03 Execução Sentença Arbitral Não Cumprimento Pedido Exequatur"],
      ["04-anulacao-sentenca-arbitral-por-corrupcao-ou-vicio-procedimento", "04 Anulação Sentença Arbitral Por Corrupção Ou Vício Procedimento"],
      ["05-multa-clausula-arbitral-indenizacao-caucao-perdida-em-valor", "05 Multa Cláusula Arbitral Indenização Caução Perdida em Valor"],
      ["06-camara-arbitragem-medicao-arbitral-preco-convenio-servicos", "06 Câmara Arbitragem Medição Arbitral Preço Convênio Serviços"],
      ["07-internacional-contrato-comercial-mercosul-ue-arbitragem-paris", "07 Internacional Contrato Comercial Mercosul UE Arbitragem Paris"],
      ["08-indenizacao-do-contrato-de-longo-curso-atraso-do-fornecedor", "08 Indenização Do Contrato de Longo Curso Atraso Do Fornecedor"],
      ["09-advogado-do-arbitro-honorarios-indenizacao-procedente", "09 Advogado Do Árbitro Honorários Indenização Procedente"],
      ["10-recurso-de-agravo-regimental-antes-camara-pedido-reconsideracao", "10 Recurso de Agravo Regimental Antes Câmara Pedido Reconsideração"],
    ],
  },
  {
    areaSlug: "eca-infancia-e-juventude",
    areaNome: "ECA Infância e Juventude",
    icon: "baby",
    templates: [
      ["01-conselho-tutelar-measure-protetiva-nao-aplicada-crianca-violada", "01 Conselho Tutelar Medida Protetiva Não Aplicada Criança Violada"],
      ["02-acolhimento-institucional-abrigo-menor-negado-conselho", "02 Acolhimento Institucional Abrigo Menor Negado Conselho"],
      ["03-adocao-unilateral-pai-biologico-nao-consentido-desaparecido", "03 Adoção Unilateral Pai Biológico Não Consentido Desaparecido"],
      ["04-guarda-compartilhada-menor-indenizacao-por-nao-convivio-pai", "04 Guarda Compartilhada Menor Indenização Por Não Convívio Pai"],
      ["05-pensao-alimenticia-menor-execucao-alimentos-nao-pagos", "05 Pensão Alimentícia Menor Execução Alimentos Não Pagos"],
      ["06-violencia-sexual-contra-menor-indenizacao-crimes-e-reparacao", "06 Violência Sexual Contra Menor Indenização Crimes e Reparação"],
      ["07-medida-socioeducativa-internacao-menor-irregular-libertacao", "07 Medida Socioeducativa Internação Menor Irregular Libertação"],
      ["08-escola-educacao-inclusiva-menor-com-deficiencia-indenizacao", "08 Escola Educação Inclusiva Menor Com Deficiência Indenização"],
      ["09-crianca-e-adolescente-trabalho-infantil-indenizacao-irregular", "09 Criança e Adolescente Trabalho Infantil Indenização Irregular"],
      ["10-violencia-domestica-familia-menor-indenizacao-convivencia", "10 Violência Doméstica Família Menor Indenização Convivência"],
    ],
  },
  {
    areaSlug: "trabalho-novas-variantes",
    areaNome: "Trabalho Novas Variantes",
    icon: "briefcase",
    templates: [
      ["01-teletrabalho-home-office-custo-internet-luz-indenizacao", "01 Teletrabalho Home Office Custo Internet Luz Indenização"],
      ["02-hibrido-12x36-jornada-excessiva-acumulada-indenizacao-dobra", "02 Híbrido 12x36 Jornada Excessiva Acumulada Indenização Dobra"],
      ["03-adicional-noturno-funcionario-noturno-nao-recebeu-5-horas", "03 Adicional Noturno Funcionário Noturno Não Recebeu 5 Horas"],
      ["04-periculosidade-risco-vida-insalubridade-grau-nao-concedido", "04 Periculosidade Risco Vida Insalubridade Grau Não Concedido"],
      ["05-estagio-obrigatorio-nao-remunerado-abuso-exigencia-indenizacao", "05 Estágio Obrigatório Não Remunerado Abuso Exigência Indenização"],
      ["06-jovem-aprendiz-maior-que-2-ano-curso-learning-desligado", "06 Jovem Aprendiz Maior Que 2 Ano Curso Learning Desligado"],
      ["07-pcd-lei-quota-5-empresa-com-mais-100-funcionarios-nao-contrata", "07 PCD Lei Quota 5 Empresa Com Mais 100 Funcionários Não Contrata"],
      ["08-auxilio-doenca-acidente-trabalho-previdencia-beneficio-negado", "08 Auxílio Doença Acidente Trabalho Previdência Benefício Negado"],
      ["09-fgts-seguro-desemprego-parcelas-nao-recebidas-caixa", "09 FGTS Seguro Desemprego Parcelas Não Recebidas CAIXA"],
      ["10-contrato-pj-pejotizacao-reconhecimento-vinculo-10-anos", "10 Contrato PJ Pejotização Reconhecimento Vínculo 10 Anos"],
    ],
  },
  {
    areaSlug: "previdenciario-beneficios-inss",
    areaNome: "Previdenciário Benefícios INSS",
    icon: "landmark",
    templates: [
      ["01-beneficio-assistencial-loas-ldm-bpc-negado-nao-hiper-suficiente", "01 Benefício Assistencial LOAS LDM BPC Negado Não Hipersuficiente"],
      ["02-aposentadoria-rural-pai-familia-15-anos-prova-malas-anotacoes", "02 Aposentadoria Rural Pai Família 15 Anos Prova Malas Anotações"],
      ["03-auxilio-acidente-indenizacao-doenca-ocupacional-indenizacao-do-inss", "03 Auxílio Acidente Indenização Doença Ocupacional Indenização do INSS"],
      ["04-salario-maternidade-120-dias-empresa-nao-paga-mulher-gravida", "04 Salário Maternidade 120 Dias Empresa Não Paga Mulher Grávida"],
      ["05-salario-familia-filho-menor-14-inss-nao-pagou-salario-familia", "05 Salário Família Filho Menor 14 INSS Não Pagou Salário Família"],
      ["06-revisao-da-vida-toda-todas-contribuicoes-inss-pedido-revisao", "06 Revisão da Vida Toda Todas Contribuições INSS Pedido Revisão"],
      ["07-aposentadoria-especial-25-anos-ruido-produto-quimico-raio-x", "07 Aposentadoria Especial 25 Anos Ruído Produto Químico Raio X"],
      ["08-deficiente-pessoa-com-deficiencia-29-anos-25-aposentadoria", "08 Deficiente Pessoa Com Deficiência 29 Anos 25 Aposentadoria"],
      ["09-pensao-morte-filho-menor-esposa-viuva-inss-atrasado", "09 Pensão Morte Filho Menor Esposa Viúva INSS Atrasado"],
      ["10-5-graus-inss-prova-tempo-contribuicao-cnis-errado-problema", "10 5 Graus INSS Prova Tempo Contribuição CNIS Errado Problema"],
    ],
  },
  {
    areaSlug: "familia-novas-variantes",
    areaNome: "Família Novas Variantes",
    icon: "heart",
    templates: [
      ["01-divorcio-partilha-bens-imoveis-multiplos-partilha-errada", "01 Divórcio Partilha Bens Imóveis Múltiplos Partilha Errada"],
      ["02-pensao-alimentos-indenizacao-aumento-maior-renda-do-pai", "02 Pensão Alimentos Indenização Aumento Maior Renda do Pai"],
      ["03-guarda-unilateral-pai-passou-a-morar-em-outro-estado", "03 Guarda Unilateral Pai Passou a Morar em Outro Estado"],
      ["04-viagem-menor-ao-exterior-pai-nao-autoriza-pedido-autorizacao", "04 Viagem Menor ao Exterior Pai Não Autoriza Pedido Autorização"],
      ["05-teste-de-dna-paternidade-positivo-nome-do-pai-nao-incluiu", "05 Teste de DNA Paternidade Positivo Nome do Pai Não Incluiu"],
      ["06-filho-fratermo-irmandade-indenizacao-desacordo-na-heranca", "06 Filho Fratermo Irmandade Indenização Desacordo na Herança"],
      ["07-convivio-familiar-fim-de-semana-menor-nao-quer-ir-indenizacao", "07 Convívio Familiar Fim de Semana Menor Não Quer Ir Indenização"],
      ["08-ido-idoso-80-anos-indenizacao-pensao-alimenticia-dos-filhos", "08 Idoso Idosos 80 Anos Indenização Pensão Alimentícia Dos Filhos"],
      ["09-uniao-estavel-reconhecimento-e-partilha-bens-multiplos-familia", "09 União Estável Reconhecimento e Partilha Bens Múltiplos Família"],
      ["10-casal-lgbt-divorcio-partilha-guarda-de-menor-adotado", "10 Casal LGBT Divórcio Partilha Guarda de Menor Adotado"],
    ],
  },
  {
    areaSlug: "direito-autoral-propriedade-intelectual",
    areaNome: "Direito Autoral e PI Novo",
    icon: "book-open-check",
    templates: [
      ["01-plagio-tcc-monografia-artigo-cientifico-indenizacao-autor", "01 Plágio TCC Monografia Artigo Científico Indenização Autor"],
      ["02-rede-social-instagram-direito-imagem-influencer-indenizacao", "02 Rede Social Instagram Direito Imagem Influenciador Indenização"],
      ["03-musica-autoral-direitos-autorais-streaming-spotify-nao-pagou", "03 Música Autoral Direitos Autorais Streaming Spotify Não Pagou"],
      ["04-obra-literaria-escritor-editora-nao-livrou-livro-nao-pagou", "04 Obra Literária Escritor Editora Não Livrou Livro Não Pagou"],
      ["05-marca-jogo-bbb-big-brother-brasil-direito-copyright", "05 Marca Jogo BBB Big Brother Brasil Direito Copyright"],
      ["06-direito-de-imagem-ator-realizador-publicidade-utilizada-sem", "06 Direito de Imagem Ator Realizador Publicidade Utilizada Sem"],
      ["07-jogos-digitais-steam-epic-publisher-nao-pagou-royalties-venda", "07 Jogos Digitais Steam Epic Publisher Não Pagou Royalties Venda"],
      ["08-patente-inventor-inpi-processo-registro-patente-normais", "08 Patente Inventor INPI Processo Registro Patente Normais"],
      ["09-desenho-industrial-inpi-pirateado-indeferido-pedido-indenizacao", "09 Desenho Industrial INPI Pirateado Indeferido Pedido Indenização"],
      ["10-top-level-dominio-cybersquatting-gripe-indenizacao-dominio", "10 Top Level Domínio Cybersquatting Gripe Indenização Domínio"],
    ],
  },
  {
    areaSlug: "consumidor-novas-areas",
    areaNome: "Consumidor Novas Áreas",
    icon: "shopping-cart",
    templates: [
      ["01-bilhete-loteria-caixa-premio-milionario-nao-pago-erro-sistema", "01 Bilhete Loteria CAIXA Prêmio Milionário Não Pago Erro Sistema"],
      ["02-energia-eletrica-bandeira-tarifa-social-energia-falta-suministro", "02 Energia Elétrica Bandeira Tarifa Social Energia Falta Suministro"],
      ["03-agua-esgoto-cedae-caesb-falta-abastecimento-bairro-cobrada", "03 Água Esgoto Cedae Caesb Falta Abastecimento Bairro Cobrada"],
      ["04-gas-encanado-botijao-gas-cobranca-indevida-sabesp-comgas", "04 Gás Encanado Botijão Gás Cobrança Indevida Sabesp Comgás"],
      ["05-assinatura-streaming-jogo-minecraft-server-cancelamento", "05 Assinatura Streaming Jogo Minecraft Server Cancelamento"],
      ["06-mercado-pao-de-acucar-carrefour-produto-vencido-indenizacao", "06 Mercado Pão de Açúcar Carrefour Produto Vencido Indenização"],
      ["07-farmacia-drogasil-drogaria-remedio-controlado-falta-sus", "07 Farmácia Drogasil Drogaria Remédio Controlado Falta SUS"],
      ["08-creche-escola-infantil-bebê-criança-lesão-negligência", "08 Creche Escola Infantil Bebê Criança Lesão Negligência"],
      ["09-academia-crossfit-smartfit-mensalidade-nao-usada-extorno", "09 Academia Crossfit Smartfit Mensalidade Não Usada Extorno"],
      ["10-lavanderia-dry-cleaning-lava-seca-roupa-extraviada-danificada", "10 Lavanderia Dry Cleaning Lava Seca Roupa Extraviada Danificada"],
    ],
  },
  {
    areaSlug: "agronegocio-agro",
    areaNome: "Agronegócio Agro Novo",
    icon: "sprout",
    templates: [
      ["01-propriedade-rural-posse-silicato-silicato-nao-conseguiu-escritura", "01 Propriedade Rural Posse Silicato Silicato Não Conseguiu Escritura"],
      ["02-cooperativa-agraria-associacao-leite-nao-pagamento-leiteiro", "02 Cooperativa Agrária Associação Leite Não Pagamento Leiteiro"],
      ["03-agrotoxico-monsanto-bayer-envenenamento-agua-pescado-morto", "03 Agrotóxico Monsanto Bayer Envenenamento Água Pescado Morto"],
      ["04-transgenicos-soja-milho-ctnbio-autorizacao-nao-concedida-indenizacao", "04 Transgênicos Soja Milho CTNBio Autorização Não Concedida Indenização"],
      ["05-plantio-direto-carvao-do-piaui-desmatamento-indenizacao-multa-ibama", "05 Plantio Direto Carvão do Piauí Desmatamento Indenização Multa IBAMA"],
      ["06-sementes-crioulas-brasil-nativo-patente-sementes-monsanto", "06 Sementes Crioulas Brasil Nativo Patente Sementes Monsanto"],
      ["07-pecuaria-gado-leiteiro-mastite-bovino-leite-nao-conforme-map", "07 Pecuária Gado Leiteiro Mastite Bovino Leite Não Conforme MAPA"],
      ["08-controle-de-erros-agricolas-maquina-john-deere-garantia", "08 Controle de Erros Agrícolas Máquina John Deere Garantia"],
      ["09-frota-caminhao-vale-transporte-soja-sinistro-carga-acidente", "09 Frota Caminhão Vale Transporte Soja Sinistro Carga Acidente"],
      ["10-safra-seguro-rural-proagro-seguro-safra-indenizacao-chuva-excesso", "10 Safra Seguro Rural Proagro Seguro Safra Indenização Chuva Excesso"],
    ],
  },
  {
    areaSlug: "idade-3a-idade-idoso",
    areaNome: "Idade 3ª Idade Idoso",
    icon: "heart-handshake",
    templates: [
      ["01-idoso-60-anos-meia-entrada-cinema-teatro-evento-negada", "01 Idoso 60 Anos Meia Entrada Cinema Teatro Evento Negada"],
      ["02-asilo-asilado-idoso-negligencia-abandono-maltratado-indenizacao", "02 Asilo Asilado Idoso Negligência Abandono Maltratado Indenização"],
      ["03-idoso-forro-de-caixa-aposentado-golpe-banco-financiamento", "03 Idoso Forro de Caixa Aposentado Golpe Banco Financiamento"],
      ["04-cartao-credito-consignado-empresa-margem-consignada-liberada", "04 Cartão Crédito Consignado Empresa Margem Consignada Liberada"],
      ["05-transporte-publico-interestadual-passe-livre-idoso-civis", "05 Transporte Público Interestadual Passe Livre Idoso Civis"],
      ["06-idoso-diabetes-gripe-pandemia-nao-recebeu-vacina-ubs", "06 Idoso Diabetes Gripe Pandemia Não Recebeu Vacina UBS"],
      ["07-rede-hoteleira-resort-idoso-reserva-confirmada-cancelada-3a", "07 Rede Hoteleira Resort Idoso Reserva Confirmada Cancelada 3ª"],
      ["08-filhos-pedem-idoso-repasse-bens-propriedade-vida-toda", "08 Filhos Pedem Idoso Repasse Bens Propriedade Vida Toda"],
      ["09-idoso-70-anos-nao-pode-mais-ser-fiador-banco-contrato", "09 Idoso 70 Anos Não Pode Mais Ser Fiador Banco Contrato"],
      ["10-idoso-transporte-adaptado-pcd-onibus-acompanhamento", "10 Idoso Transporte Adaptado PCD Ônibus Acompanhamento"],
    ],
  },
  {
    areaSlug: "digital-blockchain-cripto",
    areaNome: "Digital Blockchain Cripto",
    icon: "link",
    templates: [
      ["01-binance-mexc-koinbigo-kukoin-saque-bloqueado-nao-liberado", "01 Binance MEXC Koinbigo Kukoin Saque Bloqueado Não Liberado"],
      ["02-nft-opensea-paguei-nao-recebi-artigo-digital-fraude", "02 NFT OpenSea Paguei Não Recebi Artigo Digital Fraude"],
      ["03-metaverso-terreno-virtual-sandbox-decentraland-comprei-nao-recebi", "03 Metaverso Terreno Virtual Sandbox Decentraland Comprei Não Recebi"],
      ["04-crypto-wallet-metamask-frase-semente-hackeada-roubada", "04 Crypto Wallet Metamask Frase Semente Hackeada Roubada"],
      ["05-stablecoin-usdt-usdc-busd-perdi-valor-despejo-bankrun", "05 Stablecoin USDT USDC BUSD Perdi Valor Despejo Bankrun"],
      ["06-exchange-bankruptcy-ftx-blockfi-celsius-recuperar-ativos", "06 Exchange Bankruptcy FTX Blockfi Celsius Recuperar Ativos"],
      ["07-investimento-cripto-piramide-mmm-bitconnect-quebrou", "07 Investimento Cripto Pirâmide MMM BitConnect Quebrou"],
      ["08-defi-swap-uniswap-pancake-perdi-tokens-liquididade", "08 DeFi Swap Uniswap Pancake Perdi Tokens Liquidez"],
      ["09-airdrop-token-gratis-bridge-roubou-carteira-credenciais", "09 Airdrop Token Grátis Bridge Roubou Carteira Credenciais"],
      ["10-cvm-comissao-valores-mobiliarios-cripto-empresa-registro", "10 CVM Comissão Valores Mobiliários Cripto Empresa Registro"],
    ],
  },
  {
    areaSlug: "transporte-taxi-app",
    areaNome: "Transporte Táxi App",
    icon: "car",
    templates: [
      ["01-uber-99-driver-desligamento-sem-justa-causa-app-motoboy", "01 Uber 99 Driver Desligamento Sem Justa Causa App Motoboy"],
      ["02-ifood-99-pop-rapido-restaurante-pedido-faltando-repasse", "02 iFood 99 Pop Rápido Restaurante Pedido Faltando Repasse"],
      ["03-motorista-parceiro-uber-cupom-nao-recebido-repasse-aberto", "03 Motorista Parceiro Uber Cupom Não Recebido Repasse Aberto"],
      ["04-corrida-privada-usuario-motorista-agrandado-diferença-valor", "04 Corrida Privada Usuário Motorista Agrandado Diferença Valor"],
      ["05-taxi-licenca-por-pontos-300-regras-prefeitura-multa-indenizacao", "05 Táxi Licença Por Pontos 300 Regras Prefeitura Multa Indenização"],
      ["06-app-onibus-floripa-giro-floriano-passagem-erro-quantia", "06 App Ônibus Floripa Giro Floriano Passagem Erro Quantia"],
      ["07-viagem-onibus-rodoviario-cancelamento-empresa-guaira", "07 Viagem Ônibus Rodoviário Cancelamento Empresa Guaíra"],
      ["08-entrega-doc-dhl-correios-jadlog-pacote-caro-roubo", "08 Entrega DOC DHL Correios Jadlog Pacote Caro Roubo"],
      ["09-passagem-aerea-gol-latam-azul-passageiro-embarcado-sem-bagagem", "09 Passagem Aérea Gol LATAM Azul Passageiro Embarcado Sem Bagagem"],
      ["10-fretamento-onibus-escolar-viagem-escola-turma-nao-cumpriu", "10 Fretamento Ônibus Escolar Viagem Escola Turma Não Cumpriu"],
    ],
  },
];

// =============  Helper =============

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

const makeBody = (areaNome, templateName, itemSlug, n) => {
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

// ============= Main =============
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const existingSet = new Set(manifest.implemented || []);
const NEW_IDS = [];
const CATALOG_2 = [];

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
    const body = makeBody(cat.areaNome, tplNome, tplSlugEnd, created + 1);
    const htmlFinal = ADV_WRAPPER_HTML(htmlTitle, body);
    const outPath = path.join(TEMPLATES_DIR, `${fullId}.html`);
    fs.writeFileSync(outPath, htmlFinal, "utf8");

    const srcFile = `${cat.areaSlug}/${tplNome} — modelo ${created + 1}.docx`;
    CATALOG_2.push([fullId, `${cat.areaNome.slice(0, 1).toUpperCase()}${cat.areaNome.slice(1)} — ${tplNome.replace(/^\d+\s*/, "")}`, cat.icon, srcFile]);
    created++;
  }
}

// manifest atualizado
manifest.implemented = [...existingSet.values()];
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");

// catalogo 2
const advCatalog2Js = `(function () {
  "use strict";
  /**
   * @license Adv-catalog-2 (NOVO lote +${created} templates areas ineditas Maritimo Aeronautico Desportivo Imigracao Arbitragem ECA Familia novo Trabalho novo PI novo Autoral novo Consumidor agro novo Idoso 3a idade Cripto).
   * IIFE global window.DocJurAdvCatalog2.
   * Ordem interna: area-slug > numero.
   * Formato tupla: [ id, name, icon, sourceFile (relativo a SRC_ADV / Peticao/NovosAdvGerados/) ]
   * @type {Array<[string,string,string,string]>}
   */
  var CAT = ${JSON.stringify(CATALOG_2, null, 1)};
  if (typeof window !== "undefined") {
    window.DocJurAdvCatalog2 = CAT;
  }
})();`;
fs.writeFileSync(ADV_CATALOG_2_JS, advCatalog2Js, "utf8");

console.log("============== RESULTADO 300 NOVOS ADV ==============");
console.log("novos criados                 =", created);
console.log("ja existiam (pulei)           =", skipped);
console.log("manifest.implemented agora    =", manifest.implemented.length);
console.log("adv-catalog-2 items          =", CATALOG_2.length);
console.log("Tamanhos arquivos:");
console.log("  templates/*.html ADV novos  ~", CATALOG_2.length);
console.log("  adv-catalog-2.js            ~", (Buffer.byteLength(advCatalog2Js, "utf8") / 1024).toFixed(2), "KB");
console.log("  manifest.json               ~", (fs.statSync(MANIFEST_PATH).size / 1024).toFixed(2), "KB");
