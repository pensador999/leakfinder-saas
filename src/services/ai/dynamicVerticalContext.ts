// ==============================================================================
// 🌐 DYNAMIC VERTICAL CONTEXT ENGINE (ADSHIELD 2026)
// Skill: software-architecture + ecommerce-cro-catalog-doctor + growth-marketing-intelligence
// PAPEL: Orquestrador de Contexto Hiper-Especializado por Nicho do E-commerce Brasileiro.
// Injeta dinamicamente a curva gaussiana de demanda, benchmarks de CPC no Meta Ads,
// vocabulário visceral do setor, stack de ERPs dominantes e regras de isenção no enxame.
// ==============================================================================

export type SupportedVerticalId = 
  | 'CALCADOS_COURO'
  | 'AGRO_CAMPO_OUTDOOR'
  | 'STREETWEAR_MODA_URBANA'
  | 'FITNESS_BEACHWEAR'
  | 'COSMETICOS_BEAUTY'
  | 'SUPLEMENTOS_SAUDE'
  | 'PET_SHOP_VETERINARIA'
  | 'CASA_DECORACAO_MOVEIS'
  | 'ELETRONICOS_INFORMATICA'
  | 'AUTOPECAS_FERRAMENTAS'
  | 'VAREJO_GERAL';

export interface DominantErpStackProfile {
  primaryErp: string;
  primaryHub: string;
  typicalSyncLatencyMinutes: number;
  inventoryPolicyBehavior: string;
  logisticsHubNotes: string;
}

export interface VisceralVocabularyProfile {
  industryTerms: string[];
  lossPainHooks: string[];
  urgencyTriggers: string[];
  closingPunchlines: string[];
}

export interface DynamicVerticalProfile {
  verticalId: SupportedVerticalId;
  label: string;
  icon: string;
  targetDemographics: string;
  geographicPoles: string[];
  
  // Modelagem Financeira & Benchmarks Setoriais
  averageTicketBRL: number;
  benchmarkMetaAdsCpcBRL: number;
  baselineCvrPct: number;
  averageReturnRatePct: number; // Taxa de troca/devolução
  
  // Curva de Demanda Atuarial (Gaussiana)
  gaussianDemandDistribution: Record<string, number>;
  coreDemandSizes: string[];
  secondaryDemandSizes: string[];
  
  // Infraestrutura de ERPs e Hubs Dominantes
  dominantTechStack: DominantErpStackProfile;
  
  // Linguagem & Copywriting Visceral B2B
  vocabulary: VisceralVocabularyProfile;
  
  // Regras de Isenção de Catálogo
  catalogExemptionPatterns: string[];
  allowBackorderKeywords: string[];
  mandatoryProductFeatures: string[];
}

// 📚 BASE MESTRA DAS 5 VERTICAIS DE HIPER-ESPECIALIZAÇÃO (BRASIL 2026)
export const DYNAMIC_VERTICAL_REGISTRY: Record<SupportedVerticalId, DynamicVerticalProfile> = {
  CALCADOS_COURO: {
    verticalId: 'CALCADOS_COURO',
    label: 'Calçados, Botas & Couro',
    icon: 'Footprints',
    targetDemographics: 'Homens e Mulheres 25-55 anos buscando conforto, durabilidade e elegância',
    geographicPoles: ['Pólo Calçadista de Franca/SP', 'Pólo do Vale dos Sinos/RS', 'Nova Serrana/MG'],
    averageTicketBRL: 289.00,
    benchmarkMetaAdsCpcBRL: 1.45,
    baselineCvrPct: 1.35,
    averageReturnRatePct: 16.5, // Calçado tem a maior taxa de troca do e-commerce
    gaussianDemandDistribution: {
      '37': 4,
      '38': 8,
      '39': 22,
      '40': 28,
      '41': 20,
      '42': 12,
      '43': 4,
      '44': 2
    },
    coreDemandSizes: ['39', '40', '41'],
    secondaryDemandSizes: ['38', '42'],
    dominantTechStack: {
      primaryErp: 'Bling ERP (Edição Calçadista de Franca) / Tiny ERP',
      primaryHub: 'Plugg.to / AnyMarket / Magis5',
      typicalSyncLatencyMinutes: 20,
      inventoryPolicyBehavior: 'Comum estoque fracionado por fôrma. Lojas sofrem ruptura invisível ao esgotar 40/41.',
      logisticsHubNotes: 'Envio via Jadlog / Correios / Total Express com embalagem volumosa em caixa de sapato.'
    },
    vocabulary: {
      industryTerms: ['fôrma calçadista', 'couro floater', 'palmilha conformada em PU', 'solado costurado blaqueado', 'calce perfeito', 'couro legítimo'],
      lossPainHooks: [
        '70% dos homens no Brasil calçam entre 39 e 41. Seu anúncio ativo está atraindo clientes para uma vitrine com esses números zerados.',
        'O cliente clica no anúncio do sapato/bota, seleciona o 40, descobre que está indisponível e sai da loja sem navegar nas outras opções.',
        'Sua taxa de troca por erro de calce está inflacionando a logística reversa sem necessidade.'
      ],
      urgencyTriggers: ['Ruptura de fôrma central', 'CAC dobrado no Meta Ads', 'Estoque de numeração intermediária zerado'],
      closingPunchlines: [
        'Pausar esse conjunto de anúncios agora salva em média R$ 3.800 de verba nesta semana.',
        'Blindar a grade 39-41 é o atalho mais rápido para derrubar o CAC da conta de anúncios.'
      ]
    },
    catalogExemptionPatterns: ['meia', 'graxa', 'palmilha', 'cadarço', 'cinto', 'carteira', 'mochila'],
    allowBackorderKeywords: ['sob medida', 'artesanal', 'fabricacao exclusiva', 'encomenda'],
    mandatoryProductFeatures: ['Guia de Calce em Centímetros', 'Política de 1ª Troca Grátis', 'Fotos do solado e detalhes do couro']
  },

  AGRO_CAMPO_OUTDOOR: {
    verticalId: 'AGRO_CAMPO_OUTDOOR',
    label: 'Agropecuária, Moda Campo & Western',
    icon: 'Wheat',
    targetDemographics: 'Produtores rurais, veterinários, agrônomos, público sertanejo e entusiastas da lida no campo',
    geographicPoles: ['Centro-Oeste (Mato Grosso / Goiás)', 'Interior de SP (Ribeirão Preto / Barretos)', 'Sul Agropecuário'],
    averageTicketBRL: 349.00,
    benchmarkMetaAdsCpcBRL: 1.65,
    baselineCvrPct: 1.80,
    averageReturnRatePct: 8.2, // Agro tem menor taxa de devolução que moda urbana
    gaussianDemandDistribution: {
      'P': 8,
      'M': 28,
      'G': 38,
      'GG': 18,
      'XG': 5,
      'G2': 3
    },
    coreDemandSizes: ['G', 'GG', 'M'],
    secondaryDemandSizes: ['P', 'XG'],
    dominantTechStack: {
      primaryErp: 'Sankhya ERP (Operações Agro Industriais) / Tiny ERP',
      primaryHub: 'Magis5 Hub / Plugg.to',
      typicalSyncLatencyMinutes: 35,
      inventoryPolicyBehavior: 'Mistura produção própria de camisas e bonés com revenda de chapéus importados (ex: American Hat, PBR).',
      logisticsHubNotes: 'Despacho rodoviário para regiões rurais e fazendas com frete agro dedicado.'
    },
    vocabulary: {
      industryTerms: ['lida no campo', 'manga longa proteção UV50+', 'sarja pesada', 'bordado de alta definição', 'chapéu americano', 'estilo western', 'porteira aberta'],
      lossPainHooks: [
        'O homem do campo usa predominantemente os tamanhos G e GG. Rodar anúncio sem esses tamanhos é jogar verba de tráfego no mato.',
        'Produtos de revenda de alto valor (como chapéus importados) com estoque zerado no ERP continuam drenando investimento em tráfego pago.',
        'Falta de indicação de pronta entrega cria receio em compras corporativas para fazendas e eventos rurais.'
      ],
      urgencyTriggers: ['Ruptura de camisaria G/GG', 'Queima de verba em item importado esgotado', 'Descompasso Sankhya/Hub'],
      closingPunchlines: [
        'Identificamos que o produto estrela está sem estoque no galpão mas segue recebendo cliques pagos no Meta Ads.',
        'Estancar essa sangria protege o faturamento de toda a linha campeira.'
      ]
    },
    catalogExemptionPatterns: ['chapeu', 'chapeus', 'bone', 'bones', 'manguito', 'bandana', 'facas', 'canivete', 'laço', 'sela', '_FULL'],
    allowBackorderKeywords: ['sob encomenda', 'personalizacao de fazenda', 'sublimacao', 'uniforme agro'],
    mandatoryProductFeatures: ['Selo de Proteção Solar UV50+', 'Tabela de Medidas de Tórax e Manga em cm', 'Composição de Tecido Anti-Rasgo']
  },

  STREETWEAR_MODA_URBANA: {
    verticalId: 'STREETWEAR_MODA_URBANA',
    label: 'Streetwear & Tech Apparel',
    icon: 'Shirt',
    targetDemographics: 'Jovens 18-35 anos antenados em cultura urbana, skate, música e moda oversize',
    geographicPoles: ['São Paulo Capital', 'Curitiba/PR', 'Rio de Janeiro', 'Belo Horizonte'],
    averageTicketBRL: 219.00,
    benchmarkMetaAdsCpcBRL: 1.15,
    baselineCvrPct: 1.95,
    averageReturnRatePct: 11.0,
    gaussianDemandDistribution: {
      'PP': 3,
      'P': 18,
      'M': 38,
      'G': 31,
      'GG': 10,
      '36': 6,
      '38': 18,
      '40': 28,
      '42': 25,
      '44': 15,
      '46': 8
    },
    coreDemandSizes: ['M', 'G', '40', '42'],
    secondaryDemandSizes: ['P', 'GG', '38', '44'],
    dominantTechStack: {
      primaryErp: 'Bling ERP / Tiny ERP / Omie',
      primaryHub: 'Shopify Native Fulfillment / Plugg.to',
      typicalSyncLatencyMinutes: 10,
      inventoryPolicyBehavior: 'Estratégia de drops limitados. Ruptura intencional ou descompasso de estoque com a biblioteca do Meta Ads.',
      logisticsHubNotes: 'Fulfillment ágil via Correios Sedex, Loggi e Jadlog com foco em unboxing personalizado.'
    },
    vocabulary: {
      industryTerms: ['drop exclusivo', 'modelagem oversized', 'algodão 100% penteado 240g', 'gola canelada 3cm', 'silk em relevo', 'street culture'],
      lossPainHooks: [
        'Seu último drop esgotou os tamanhos M e G em 48h, mas as campanhas de topo de funil continuam ativas queimando CPC.',
        'O cliente do streetwear é extremamente imediatista: ao ver "Esgotado", ele não assina newsletter, ele migra para a concorrência.',
        'CAC subindo silenciosamente porque 69% do tráfego busca M/G e bate na porta fechada.'
      ],
      urgencyTriggers: ['Drop com grade central zerada', 'Anúncio de camiseta sem M/G rodando tráfego', 'Falta de provador virtual'],
      closingPunchlines: [
        'Ajustar os criativos do Meta Ads para os SKUs que ainda têm grade completa preserva o ROAS do drop.',
        'O AdShield pausa o anúncio no instante em que o tamanho M atinge zero peças no ERP.'
      ]
    },
    catalogExemptionPatterns: ['bone', 'gorro', 'bucket', 'meia', 'adesivo', 'shoulder bag', 'chaveiro'],
    allowBackorderKeywords: ['pre-venda', 'pre-order', 'drop 2'],
    mandatoryProductFeatures: ['Medidas de Ombro a Ombro e Comprimento', 'Altura e Peso do Modelo nas Fotos', 'Provador Virtual']
  },

  FITNESS_BEACHWEAR: {
    verticalId: 'FITNESS_BEACHWEAR',
    label: 'Fitness, Beachwear & Activewear',
    icon: 'Dumbbell',
    targetDemographics: 'Mulheres 20-45 anos praticantes de musculação, corrida, yoga, crossfit e praia',
    geographicPoles: ['Pólo Têxtil de Brusque/SC', 'Nova Friburgo/RJ', 'São Paulo (Brás/Bom Retiro)'],
    averageTicketBRL: 189.00,
    benchmarkMetaAdsCpcBRL: 1.25,
    baselineCvrPct: 1.60,
    averageReturnRatePct: 14.0,
    gaussianDemandDistribution: {
      'PP': 7,
      'P': 30,
      'M': 42,
      'G': 17,
      'GG': 4
    },
    coreDemandSizes: ['P', 'M'],
    secondaryDemandSizes: ['G'],
    dominantTechStack: {
      primaryErp: 'Tiny ERP / Bling ERP / Linx Microvix',
      primaryHub: 'Vnda / Tray / Shopify',
      typicalSyncLatencyMinutes: 15,
      inventoryPolicyBehavior: 'Venda de conjuntos casados (Top + Legging). Ruptura de uma peça derruba a venda do par.',
      logisticsHubNotes: 'Embalagens impermeáveis com frete econômico e forte apelo de unboxing fitness.'
    },
    vocabulary: {
      industryTerms: ['zero transparência', 'cós alto modelador', 'tecido poliamida com elastano', 'compressão muscular', 'secagem rápida dry', 'proteção solar'],
      lossPainHooks: [
        'A cliente fitness não compra o Top se a Legging correspondente no tamanho dela estiver esgotada.',
        'Se os tamanhos P e M estiverem em falta, mais de 72% do tráfego feminino que clica no anúncio é perdido no primeiro scroll.',
        'A falta de indicação explícita de "Zero Transparência no Agachamento" gera abandono em massa na página do produto.'
      ],
      urgencyTriggers: ['Ruptura de par de conjunto', 'Falta de tamanho P/M em lançamento', 'Dúvida de transparência no tecido'],
      closingPunchlines: [
        'Garantir o estoque casado do conjunto Top+Legging aumenta o ticket médio em +40% de forma imediata.',
        'O AdShield alerta no WhatsApp sempre que o cós P ou M estiver abaixo de 3 unidades.'
      ]
    },
    catalogExemptionPatterns: ['garrafa', 'squeeze', 'faixa', 'elastico', 'meia', 'viseira'],
    allowBackorderKeywords: ['colecao verao', 'reposicao expressa'],
    mandatoryProductFeatures: ['Selo de Teste de Zero Transparência', 'Tabela de Quadril e Cintura', 'Vídeo do Tecido Esticando']
  },

  COSMETICOS_BEAUTY: {
    verticalId: 'COSMETICOS_BEAUTY',
    label: 'Beleza, Skincare & Cosméticos D2C',
    icon: 'Sparkles',
    targetDemographics: 'Homens e Mulheres buscando tratamento dermatológico, bem-estar e cuidados faciais/corporais',
    geographicPoles: ['São Paulo', 'Grande Rio', 'Sul Cosmético'],
    averageTicketBRL: 165.00,
    benchmarkMetaAdsCpcBRL: 0.95,
    baselineCvrPct: 2.40, // Alta taxa de conversão natural por impulso e recompra
    averageReturnRatePct: 3.5, // Baixíssima taxa de devolução
    gaussianDemandDistribution: {
      'UNITARIO': 70,
      'KIT_DUPLO': 20,
      'KIT_TRIPLO': 10
    },
    coreDemandSizes: ['UNITARIO', 'KIT_TRIPLO'],
    secondaryDemandSizes: ['KIT_DUPLO'],
    dominantTechStack: {
      primaryErp: 'Bling ERP / Tiny ERP / SAP Business One',
      primaryHub: 'Shopify Plus / VTEX IO',
      typicalSyncLatencyMinutes: 10,
      inventoryPolicyBehavior: 'Produtos unitários e kits com bundle virtual. Ruptura de um componente do kit paralisa o SKU master.',
      logisticsHubNotes: 'Regras de ANVISA, lote, validade e proteção contra quebra de frascos de vidro.'
    },
    vocabulary: {
      industryTerms: ['fórmula vegana e cruelty-free', 'dermatologicamente testado', 'ácido hialurônico puro', 'textura leve sem oleosidade', 'alta absorção', 'recompra mensal'],
      lossPainHooks: [
        'Se o Sérum mais vendido esgota mas o anúncio no Meta segue ativo, o custo por lead (CPL) explode sem gerar vendas.',
        'Kits com o melhor desconto (Kit Tratamento Completo) estão indisponíveis, forçando o cliente a comprar unitário ou abandonar.',
        'Falta de exibição clara da data de validade e selo ANVISA no rodapé trava a primeira compra de novos clientes.'
      ],
      urgencyTriggers: ['Kit estrela com SKU componente zerado', 'Anúncio de produto esgotado no Meta', 'Falta de selo ANVISA'],
      closingPunchlines: [
        'Pausar as campanhas de topo para itens esgotados evita queimar a margem que sustenta a recompra da marca.',
        'Auditar a integridade dos kits garante que o cliente sempre compre a opção de maior ticket médio.'
      ]
    },
    catalogExemptionPatterns: ['ecobag', 'faixa de cabelo', 'espatula', 'pente'],
    allowBackorderKeywords: ['pre-venda', 'lote novo'],
    mandatoryProductFeatures: ['Selo ANVISA e Notificação', 'Composição Completa INCI', 'Resultados de Teste Clínico']
  },

  PET_SHOP_VETERINARIA: {
    verticalId: 'PET_SHOP_VETERINARIA',
    label: 'Pet Shop, Veterinária & Acessórios Animais',
    icon: 'PawPrint',
    targetDemographics: 'Tutores de cães e gatos 25-55 anos, veterinários e criadores',
    geographicPoles: ['São Paulo Capital', 'Rio de Janeiro', 'Curitiba/PR', 'Belo Horizonte'],
    averageTicketBRL: 149.00,
    benchmarkMetaAdsCpcBRL: 0.85,
    baselineCvrPct: 2.80, // Alta conversão por impulso emocional
    averageReturnRatePct: 4.5,
    gaussianDemandDistribution: { 'PP_MINI': 12, 'P': 28, 'M': 35, 'G': 18, 'GG': 7 },
    coreDemandSizes: ['P', 'M'],
    secondaryDemandSizes: ['G'],
    dominantTechStack: {
      primaryErp: 'Bling ERP / Tiny ERP / GestãoPet',
      primaryHub: 'Shopify / Tray Commerce / Nuvemshop',
      typicalSyncLatencyMinutes: 15,
      inventoryPolicyBehavior: 'Ração e medicamentos com controle de lote e validade. Acessórios de vestuário pet com grade de porte (PP a GG).',
      logisticsHubNotes: 'Itens pesados (rações 15kg+) com frete diferenciado. Medicamentos controlados exigem CRMV.'
    },
    vocabulary: {
      industryTerms: ['porte do pet', 'raça toy/mini', 'ração premium grain-free', 'antipulgas spot-on', 'comedouro inteligente', 'cama ortopédica pet'],
      lossPainHooks: [
        'O tutor pesquisa roupinha para o cachorro tamanho M e o único disponível é GG. Abandona e compra no concorrente em 2 cliques.',
        'Ração best-seller esgotada enquanto o anúncio roda no Meta Ads é a forma mais rápida de perder clientes recorrentes.',
        'Medicamentos antipulgas sem estoque geram urgência real no tutor — ele compra no concorrente no mesmo dia.'
      ],
      urgencyTriggers: ['Ração best-seller sem estoque', 'Roupinha pet sem tamanho M/P', 'Medicamento antipulgas zerado'],
      closingPunchlines: [
        'O tutor de pet tem ciclo de recompra de 30 dias em ração. Perder esse cliente agora custa 12x o valor do primeiro pedido.',
        'Pausar o anúncio da ração esgotada salva R$ 2.400/mês em tráfego desperdiçado.'
      ]
    },
    catalogExemptionPatterns: ['coleira', 'guia', 'plaquinha', 'brinquedo', 'osso', 'sachê unitário'],
    allowBackorderKeywords: ['importação direta', 'lote novo', 'pre-venda ração'],
    mandatoryProductFeatures: ['Tabela de Porte do Pet (PP ao GG em cm)', 'Composição Nutricional Completa', 'Validade do Lote']
  },

  CASA_DECORACAO_MOVEIS: {
    verticalId: 'CASA_DECORACAO_MOVEIS',
    label: 'Casa, Decoração & Móveis',
    icon: 'Sofa',
    targetDemographics: 'Casais 28-50 anos montando ou renovando casa, arquitetos de interiores',
    geographicPoles: ['Pólo Moveleiro de Bento Gonçalves/RS', 'Arapongas/PR', 'Mirassol/SP', 'São Paulo'],
    averageTicketBRL: 489.00,
    benchmarkMetaAdsCpcBRL: 1.85,
    baselineCvrPct: 0.95, // Baixa CVR por alto ticket e decisão consultada
    averageReturnRatePct: 7.0,
    gaussianDemandDistribution: { 'UNITARIO': 65, 'KIT_2_PECAS': 20, 'KIT_AMBIENTE': 15 },
    coreDemandSizes: ['UNITARIO'],
    secondaryDemandSizes: ['KIT_2_PECAS'],
    dominantTechStack: {
      primaryErp: 'Bling ERP / Tiny ERP / MadeiraMadeira Hub',
      primaryHub: 'VTEX IO / Tray Commerce / Loja Integrada',
      typicalSyncLatencyMinutes: 45,
      inventoryPolicyBehavior: 'Móveis com lead time de fabricação de 15 a 45 dias. Backorder frequente por indústria.',
      logisticsHubNotes: 'Frete de móveis montados é caro e volumoso. Logística reversa é inviável na maioria dos casos.'
    },
    vocabulary: {
      industryTerms: ['MDF revestido', 'freijó maciço', 'puxador couro ecológico', 'acabamento laca fosca', 'espuma D33', 'tecido suede impermeável'],
      lossPainHooks: [
        'O cliente encontrou o sofá ideal, mas a cor Terracota esgotou. Ele não vai aceitar Cinza Grafite — vai embora.',
        'Anúncio de rack para TV 65" com estoque zerado queima R$ 89 por clique no Google Shopping sem chance de conversão.',
        'Falta de prazo de entrega claro em móveis gera desconfiança imediata — o cliente abandona antes de adicionar ao carrinho.'
      ],
      urgencyTriggers: ['Cor mais vendida esgotada', 'Frete de móvel não calculável', 'Lead time não informado'],
      closingPunchlines: [
        'Em móveis, cada clique desperdiçado custa R$ 1.85. 50 cliques/dia em produto esgotado = R$ 2.775/mês jogados fora.',
        'Informar prazo de fabricação transparente aumenta a conversão em +35% vs ocultar o lead time.'
      ]
    },
    catalogExemptionPatterns: ['parafuso', 'feltro adesivo', 'rodízio', 'gancho', 'luminária decorativa avulsa'],
    allowBackorderKeywords: ['fabricação sob medida', 'produção 30 dias', 'sob encomenda'],
    mandatoryProductFeatures: ['Dimensões Exatas em cm (Largura x Profundidade x Altura)', 'Material e Acabamento', 'Prazo de Fabricação e Entrega']
  },

  ELETRONICOS_INFORMATICA: {
    verticalId: 'ELETRONICOS_INFORMATICA',
    label: 'Eletrônicos, Informática & Gadgets',
    icon: 'Smartphone',
    targetDemographics: 'Gamers, profissionais de TI e entusiastas de tecnologia 18-45 anos',
    geographicPoles: ['São Paulo (Santa Ifigênia)', 'Manaus/AM (Polo Industrial)', 'Nacional e-commerce'],
    averageTicketBRL: 599.00,
    benchmarkMetaAdsCpcBRL: 2.10,
    baselineCvrPct: 1.10,
    averageReturnRatePct: 6.0,
    gaussianDemandDistribution: { 'UNITARIO': 75, 'KIT_COMBO': 15, 'KIT_UPGRADE': 10 },
    coreDemandSizes: ['UNITARIO'],
    secondaryDemandSizes: ['KIT_COMBO'],
    dominantTechStack: {
      primaryErp: 'Bling ERP / SAP Business One / Omie',
      primaryHub: 'VTEX IO / Shopify Plus / Magento',
      typicalSyncLatencyMinutes: 10,
      inventoryPolicyBehavior: 'Estoque just-in-time com distribuidores (Ingram Micro, SND, Multilaser). Ruptura frequente por volatilidade cambial.',
      logisticsHubNotes: 'Seguro obrigatório para itens acima de R$ 500. Embalagem anti-impacto e nota fiscal detalhada com garantia.'
    },
    vocabulary: {
      industryTerms: ['clock speed GHz', 'memória DDR5', 'SSD NVMe Gen4', 'taxa de refresh 144Hz', 'certificação IP68', 'carregamento rápido 65W'],
      lossPainHooks: [
        'A placa de vídeo RTX mais vendida esgotou mas o anúncio continua ativo — cada clique custa R$ 2.10 sem chance de venda.',
        'O gamer pesquisa o monitor 144Hz, descobre que está "indisponível" e compra na Kabum ou Pichau em 30 segundos.',
        'Falta de comparativo técnico detalhado entre modelos gera dúvida e abandono no checkout.'
      ],
      urgencyTriggers: ['GPU/Processador best-seller esgotado', 'Monitor/Periférico sem estoque', 'Preço desatualizado vs dólar'],
      closingPunchlines: [
        'Em eletrônicos, a decisão de compra dura menos de 72h. Perder o momento por ruptura de estoque é perder o cliente para sempre.',
        'Pausar o anúncio do produto esgotado e redirecionar a verba para itens em estoque dobra o ROAS instantaneamente.'
      ]
    },
    catalogExemptionPatterns: ['cabo', 'adaptador', 'película', 'capa protetora', 'mouse pad', 'suporte'],
    allowBackorderKeywords: ['pre-venda', 'lançamento', 'importação direta'],
    mandatoryProductFeatures: ['Especificações Técnicas Completas', 'Garantia do Fabricante', 'Compatibilidade com Outros Dispositivos']
  },

  SUPLEMENTOS_SAUDE: {
    verticalId: 'SUPLEMENTOS_SAUDE',
    label: 'Suplementos, Nutrição Esportiva & Saúde',
    icon: 'HeartPulse',
    targetDemographics: 'Praticantes de musculação, atletas amadores e consumidores de longevidade 18-50 anos',
    geographicPoles: ['São Paulo', 'Sul (SC/PR)', 'Goiânia/GO', 'Nacional D2C'],
    averageTicketBRL: 229.00,
    benchmarkMetaAdsCpcBRL: 1.30,
    baselineCvrPct: 2.15,
    averageReturnRatePct: 2.5,
    gaussianDemandDistribution: {
      '900G': 45,
      '300G': 25,
      '1KG': 15,
      'KIT_COMBO': 15
    },
    coreDemandSizes: ['900G', '300G', 'UNITARIO'],
    secondaryDemandSizes: ['1KG', 'KIT_COMBO'],
    dominantTechStack: {
      primaryErp: 'Bling ERP / Tiny ERP / Omie',
      primaryHub: 'Shopify / VTEX / Nuvemshop',
      typicalSyncLatencyMinutes: 10,
      inventoryPolicyBehavior: 'Ruptura nos sabores campeões (Chocolate/Baunilha/Limão) trava a conversão mesmo com sabores exóticos em estoque.',
      logisticsHubNotes: 'Controle rigoroso de lote, validade e integridade do lacre térmico.'
    },
    vocabulary: {
      industryTerms: ['laudo laboratorial aprovado', 'matéria-prima importada 100% pura', 'custo por dose', 'zero adição de açúcares', 'alta biodisponibilidade', 'selo ANVISA'],
      lossPainHooks: [
        'Seu sabor mais vendido (Chocolate/Baunilha) esgotou, mas o anúncio segue rodando e levando o cliente para sabores de baixo giro.',
        'Falta de tabela nutricional legível e destaque para laudo de pureza derruba a conversão de novos clientes em até 35%.',
        'Não mostrar o cálculo de custo por dose faz o pote parecer caro diante de concorrentes inferiores.'
      ],
      urgencyTriggers: ['Sabor campeão esgotado em campanha ativa', 'Ausência de selo de pureza/laudo no PDP', 'Ruptura de Creatina/Whey carro-chefe'],
      closingPunchlines: [
        'Pausar anúncios de sabores esgotados e destacar o custo por dose eleva o ROAS da conta imediatamente.',
        'No mercado de suplementos, proteger a primeira compra garante LTV de recompra a cada 30 dias.'
      ]
    },
    catalogExemptionPatterns: ['coqueteleira', 'shaker', 'colher dosadora', 'scoop', 'adesivo', 'sacochila', '_FULL'],
    allowBackorderKeywords: ['lote novo', 'pre-venda'],
    mandatoryProductFeatures: ['Tabela Nutricional Legível', 'Laudo Laboratorial de Pureza / ANVISA', 'Cálculo de Custo por Dose']
  },

  AUTOPECAS_FERRAMENTAS: {
    verticalId: 'AUTOPECAS_FERRAMENTAS',
    label: 'Autopeças, Motociclismo & Ferramentas',
    icon: 'Wrench',
    targetDemographics: 'Proprietários de veículos, oficinas mecânicas, motociclistas e profissionais técnicos 22-60 anos',
    geographicPoles: ['São Paulo', 'ABC Paulista', 'Curitiba/PR', 'Campinas/SP'],
    averageTicketBRL: 389.00,
    benchmarkMetaAdsCpcBRL: 1.55,
    baselineCvrPct: 1.25,
    averageReturnRatePct: 9.5,
    gaussianDemandDistribution: {
      'PADRAO_OEM': 50,
      'BIVOLT': 20,
      '220V': 15,
      '110V': 15
    },
    coreDemandSizes: ['PADRAO_OEM', 'BIVOLT', '220V', '110V'],
    secondaryDemandSizes: ['KIT_PAR'],
    dominantTechStack: {
      primaryErp: 'Tiny ERP / Bling ERP / TOTVS Protheus',
      primaryHub: 'Plugg.to / AnyMarket / Mercado Livre Full',
      typicalSyncLatencyMinutes: 20,
      inventoryPolicyBehavior: 'Catálogo extenso de SKUs técnicos por ano/modelo/código OEM.',
      logisticsHubNotes: 'Despacho pesado via transportadoras rodoviárias (Braspress, Jamef, Jadlog) e Correios.'
    },
    vocabulary: {
      industryTerms: ['código original OEM', 'aplicação ano/modelo exato', 'peça de reposição homologada', 'garantia de fábrica', 'encaixe plug and play', 'certificação INMETRO'],
      lossPainHooks: [
        'O cliente clica no anúncio da peça ou ferramenta, não encontra a tabela clara de aplicação (Ano/Modelo/Motor) e abandona por medo de comprar errado.',
        'Devoluções por incompatibilidade técnica destroem a margem líquida com frete reverso pesado.',
        'Anúncios ativos para modelos ou voltagens esgotadas queimam orçamento de Google Shopping e Meta Ads.'
      ],
      urgencyTriggers: ['Falta de tabela de compatibilidade Ano/Modelo', 'Voltagem 110V/220V esgotada em anúncio ativo', 'Ausência de código OEM'],
      closingPunchlines: [
        'Exibir a tabela de compatibilidade veicular reduz devoluções técnicas em até 60%.',
        'Travar anúncios de peças sem estoque físico protege a reputação da loja nos marketplaces e no D2C.'
      ]
    },
    catalogExemptionPatterns: ['parafuso', 'arruela', 'abraçadeira', 'fita isolante', 'adesivo', 'chaveiro', '_FULL'],
    allowBackorderKeywords: ['encomenda fabrica', 'importacao direta'],
    mandatoryProductFeatures: ['Tabela de Compatibilidade (Marca / Modelo / Ano)', 'Código OEM / Referência Cruzada', 'Selo INMETRO e Garantia']
  },

  VAREJO_GERAL: {
    verticalId: 'VAREJO_GERAL',
    label: 'E-commerce & Varejo Geral',
    icon: 'ShoppingBag',
    targetDemographics: 'Consumidores de compras recorrentes online',
    geographicPoles: ['Nacional'],
    averageTicketBRL: 199.00,
    benchmarkMetaAdsCpcBRL: 1.20,
    baselineCvrPct: 1.50,
    averageReturnRatePct: 10.0,
    gaussianDemandDistribution: {
      'P': 20,
      'M': 35,
      'G': 30,
      'GG': 15
    },
    coreDemandSizes: ['M', 'G'],
    secondaryDemandSizes: ['P', 'GG'],
    dominantTechStack: {
      primaryErp: 'Bling / Tiny / Sankhya',
      primaryHub: 'Plugg.to / Magis5 / AnyMarket',
      typicalSyncLatencyMinutes: 20,
      inventoryPolicyBehavior: 'Auditoria de variantes e estoque físico.',
      logisticsHubNotes: 'Fulfillment padrão.'
    },
    vocabulary: {
      industryTerms: ['pronta entrega', 'envio em 24h', 'nota fiscal eletrônica', 'garantia oficial'],
      lossPainHooks: [
        'Anúncios rodando com variantes centrais em falta queimam o orçamento de marketing.',
        'O cliente abandona a compra se não encontrar a opção desejada de imediato.'
      ],
      urgencyTriggers: ['Ruptura de estoque', 'Tráfego sem conversão'],
      closingPunchlines: ['O AdShield estanca o desperdício em anúncios em tempo real.']
    },
    catalogExemptionPatterns: ['tamanho unico', '_FULL'],
    allowBackorderKeywords: ['sob encomenda'],
    mandatoryProductFeatures: ['Tabela de Medidas / Especificações', 'Calculador de Frete']
  }
};

const DEFAULT_FALLBACK_VERTICAL: DynamicVerticalProfile = DYNAMIC_VERTICAL_REGISTRY.VAREJO_GERAL;

/**
 * Identifica a vertical correspondente a partir de palavras-chave, nicho, domínio ou catálogo
 * utilizando pontuação ponderada multi-sinal (evita falso-positivo por palavra isolada como "Vitamina C" em Skincare).
 */
export function resolveDynamicVertical(rawInput: string): DynamicVerticalProfile {
  const norm = (rawInput || '').toLowerCase();
  const reg = DYNAMIC_VERTICAL_REGISTRY;
  if (!reg || !norm.trim()) {
    return DEFAULT_FALLBACK_VERTICAL;
  }

  const VERTICAL_SIGNALS: Record<Exclude<SupportedVerticalId, 'VAREJO_GERAL'>, string[]> = {
    CALCADOS_COURO: ['sapato', 'bota', 'botina', 'calçado', 'calcado', 'tênis', 'tenis', 'couro', 'coturno', 'sandália', 'sandalia', 'shoes', 'sneaker', 'palmilha', 'solado', 'mocassim'],
    COSMETICOS_BEAUTY: ['cosmético', 'cosmetico', 'skincare', 'beleza', 'sérum', 'serum', 'creme', 'maquiagem', 'perfume', 'shampoo', 'hidratante', 'limpador facial', 'antiacne', 'protetor solar', 'esfoliante', 'batom', 'dermocosmético', 'sallve', 'ácido hialurônico', 'niacinamida'],
    SUPLEMENTOS_SAUDE: ['suplemento', 'whey', 'creatina', 'nutrição esportiva', 'nutricao esportiva', 'pré-treino', 'pre-treino', 'hipercalórico', 'bcaa', 'glutamina', 'aminoácido', 'coqueteleira', 'proteína isolada', 'termogênico'],
    AUTOPECAS_FERRAMENTAS: ['autopeça', 'autopeca', 'ferramenta', 'motociclismo', 'motocross', 'racing', 'motors', 'automotivo', 'oficina', 'veículo', 'veiculo', 'amortecedor', 'pastilha de freio', 'farol'],
    AGRO_CAMPO_OUTDOOR: ['agro', 'campo', 'country', 'western', 'pesca', 'fishing', 'chapeu', 'chapéu', 'camper', 'fazenda', 'rodeio', 'pecuária', 'uv50+', 'tucunaré', 'anzol', 'carretilha', 'brk'],
    STREETWEAR_MODA_URBANA: ['streetwear', 'oversized', 'urban', 'tech apparel', 'techwear', 'moda', 'vestuário', 'vestuario', 'alfaiataria', 'camiseta', 'camisa', 'vestido', 'calça', 'calca', 'blusa', 'saia', 'tricô', 'tricot', 'suéter', 'sueter', 'cueca', 'lingerie', 'sutiã', 'sutia', 'pijama', 'algodão egípcio', 'minimal', 'insider', 'mash', 'duasdesign', 'moletom', 'hoodie', 'drop', 'skate'],
    FITNESS_BEACHWEAR: ['fitness', 'beachwear', 'legging', 'biquíni', 'biquini', 'academia', 'treino', 'activewear', 'moda praia', 'top fitness', 'maiô'],
    PET_SHOP_VETERINARIA: ['pet shop', 'petshop', 'ração', 'racao', 'cachorro', 'cães', 'gato', 'veterinári', 'veterinari', 'antipulgas', 'coleira', 'comedouro', 'pet'],
    CASA_DECORACAO_MOVEIS: ['móvel', 'movel', 'móveis', 'moveis', 'sofá', 'sofa', 'decoração', 'decoracao', 'cama', 'mesa', 'rack', 'estante', 'poltrona', 'colchão'],
    ELETRONICOS_INFORMATICA: ['eletrônico', 'eletronico', 'informática', 'informatica', 'notebook', 'monitor', 'placa de vídeo', 'processador', 'gamer', 'smartphone', 'celular', 'ssd', 'teclado']
  };

  let bestVerticalId: SupportedVerticalId = 'VAREJO_GERAL';
  let bestScore = 0;

  for (const [verticalId, keywords] of Object.entries(VERTICAL_SIGNALS) as [Exclude<SupportedVerticalId, 'VAREJO_GERAL'>, string[]][]) {
    let score = 0;
    for (const kw of keywords) {
      if (norm.includes(kw)) {
        // Peso base por palavra-chave distinta encontrada + bônus para termos compostos específicos
        score += kw.length >= 7 ? 3 : 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestVerticalId = verticalId;
    }
  }

  return reg[bestVerticalId] || DEFAULT_FALLBACK_VERTICAL;
}

export const detectStoreVertical = resolveDynamicVertical;


