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
      'GG': 10
    },
    coreDemandSizes: ['M', 'G'],
    secondaryDemandSizes: ['P', 'GG'],
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

/**
 * Identifica a vertical correspondente a partir de palavras-chave, nicho ou título
 */
export function resolveDynamicVertical(rawInput: string): DynamicVerticalProfile {
  const norm = rawInput.toLowerCase();

  if (norm.includes('sapato') || norm.includes('bota') || norm.includes('calçado') || norm.includes('calcado') || norm.includes('tênis') || norm.includes('tenis') || norm.includes('couro') || norm.includes('coturno')) {
    return DYNAMIC_VERTICAL_REGISTRY.CALCADOS_COURO;
  }
  if (norm.includes('agro') || norm.includes('campo') || norm.includes('country') || norm.includes('western') || norm.includes('pesca') || norm.includes('chapeu') || norm.includes('chapéu') || norm.includes('camper')) {
    return DYNAMIC_VERTICAL_REGISTRY.AGRO_CAMPO_OUTDOOR;
  }
  if (norm.includes('streetwear') || norm.includes('oversized') || norm.includes('urban') || norm.includes('tech apparel') || norm.includes('drop') || norm.includes('skate') || norm.includes('insider')) {
    return DYNAMIC_VERTICAL_REGISTRY.STREETWEAR_MODA_URBANA;
  }
  if (norm.includes('fitness') || norm.includes('beachwear') || norm.includes('legging') || norm.includes('biquíni') || norm.includes('biquini') || norm.includes('academia') || norm.includes('treino')) {
    return DYNAMIC_VERTICAL_REGISTRY.FITNESS_BEACHWEAR;
  }
  if (norm.includes('cosmético') || norm.includes('cosmetico') || norm.includes('skincare') || norm.includes('beleza') || norm.includes('sérum') || norm.includes('serum') || norm.includes('creme') || norm.includes('maquiagem')) {
    return DYNAMIC_VERTICAL_REGISTRY.COSMETICOS_BEAUTY;
  }

  return DYNAMIC_VERTICAL_REGISTRY.VAREJO_GERAL;
}
