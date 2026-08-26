export type MarketplaceType = 'MERCADO_LIVRE' | 'SHOPEE' | 'AMAZON' | 'MAGALU' | 'SHEIN';

export interface MarketplaceTitleAudit {
  originalTitle: string;
  charCount: number;
  maxRecommendedChars: number;
  keywordScore: number; // 0 to 100
  missingKeywords: string[];
  optimizedTitle: string;
  structuralFormula: string;
}

export interface MarketplacePhotoAudit {
  whiteBackgroundCompliance: boolean;
  resolutionQuality: 'EXCELENTE (>= 1200px)' | 'BOA (>= 1000px)' | 'BAIXA (< 1000px)';
  photoCountRecommendation: string;
  hasDimensionsInfographic: boolean;
  hasLifestylePhoto: boolean;
  hasVideoDemonstration: boolean;
  actionablePhotoChecklist: { item: string; status: 'CONFORME' | 'MELHORAR' | 'CRITICO'; tip: string }[];
}

export interface MarketplaceTechnicalSheetAudit {
  hasGtinEan: boolean;
  gtinStatus: 'CÓDIGO VÁLIDO' | 'AUSENTE / INVÁLIDO';
  attributesCompletenessScore: number; // 0 to 100
  criticalAttributesFound: string[];
  missingCriticalAttributes: string[];
  buyBoxImpactMessage: string;
}

export interface MarketplaceLogisticsAudit {
  logisticsProgram: 'Mercado Envios Full / Coletas' | 'Shopee Oficial Envios' | 'Amazon FBA / Prime' | 'Envio Convencional';
  isFullEligible: boolean;
  shippingImpactLabel: string;
  sameDayDeliveryAdvantage: string;
}

export interface ZombieListingAudit {
  status: 'CAMPEÃO DE VENDAS' | 'EM TRAÇÃO ORGÂNICA' | 'RISCO DE ZUMBIFICAÇÃO' | 'ZUMBI CRÍTICO (0 VENDAS)';
  accountRiskLevel: 'BAIXO' | 'MÉDIO' | 'CRÍTICO';
  zombieScore: number; // 0 (Perfeito) to 100 (Totalmente Zumbi)
  diagnosisReason: string;
  rescuePlan7Days: { day: string; title: string; action: string; badge: string }[];
}

export interface BuyBoxCompetitionAudit {
  status: 'GANHANDO BUY BOX' | 'DISPUTA ACIRRADA' | 'PERDENDO BUY BOX';
  simulatedItemPrice: number;
  competitorBuyBoxPrice: number;
  recommendedBuyBoxPrice: number;
  marginImpact: string;
  buyBoxAdvantageStrategy: string;
}

export interface MarketplaceQaTemplateItem {
  id: string;
  question: string;
  recommendedAnswer: string;
  objectionType: 'TAMANHO' | 'ORIGINALIDADE' | 'ENTREGA' | 'MATERIAL' | 'GARANTIA';
}

export interface MarketplaceListingAuditResult {
  isMarketplace: boolean;
  marketplaceType: MarketplaceType;
  marketplaceName: string;
  marketplaceColor: string;
  badgeLabel: string;
  listingScore: number; // 0 to 100
  titleAudit: MarketplaceTitleAudit;
  photoAudit: MarketplacePhotoAudit;
  technicalSheetAudit: MarketplaceTechnicalSheetAudit;
  logisticsAudit: MarketplaceLogisticsAudit;
  zombieAudit: ZombieListingAudit;
  buyBoxAudit: BuyBoxCompetitionAudit;
  qaTemplates: MarketplaceQaTemplateItem[];
  topRecommendations: string[];
}

export function detectMarketplace(url: string, domain: string): { isMarketplace: boolean; type?: MarketplaceType; name?: string } {
  const target = (url + ' ' + domain).toLowerCase();

  if (target.includes('mercadolivre.com.br') || target.includes('mercadolibre') || target.includes('produto.mercadolivre')) {
    return { isMarketplace: true, type: 'MERCADO_LIVRE', name: 'Mercado Livre' };
  }
  if (target.includes('shopee.com.br') || target.includes('shopee.com')) {
    return { isMarketplace: true, type: 'SHOPEE', name: 'Shopee Brasil' };
  }
  if (target.includes('amazon.com.br') || target.includes('amazon.com')) {
    return { isMarketplace: true, type: 'AMAZON', name: 'Amazon Brasil' };
  }
  if (target.includes('magazineluiza.com.br') || target.includes('magalu')) {
    return { isMarketplace: true, type: 'MAGALU', name: 'Magazine Luiza' };
  }
  if (target.includes('shein.com')) {
    return { isMarketplace: true, type: 'SHEIN', name: 'SHEIN' };
  }

  return { isMarketplace: false };
}

export function generateMarketplaceListingAudit(
  url: string,
  domain: string,
  brandName: string,
  rawTitle?: string,
  rawHtml?: string
): MarketplaceListingAuditResult {
  const { type, name } = detectMarketplace(url, domain);
  const marketplaceType = type || 'MERCADO_LIVRE';
  const marketplaceName = name || 'Mercado Livre';

  const cleanTitle = rawTitle && !rawTitle.includes('— Site Oficial') && rawTitle.length > 8 
    ? rawTitle.replace(/\|.*$/g, '').replace(/ - .*$/g, '').trim()
    : `${brandName} Camisa Proteção Solar UV50+ Dry Fit Linha Oficial`;

  const marketplaceColor = marketplaceType === 'MERCADO_LIVRE' 
    ? '#FFE600' 
    : marketplaceType === 'SHOPEE' 
    ? '#EE4D2D' 
    : marketplaceType === 'AMAZON' 
    ? '#FF9900' 
    : '#0086FF';

  // 1. TÍTULO & SEO ALGORÍTMICO
  const maxRecommendedChars = marketplaceType === 'MERCADO_LIVRE' ? 60 : marketplaceType === 'SHOPEE' ? 120 : 150;
  const currentChars = cleanTitle.length;
  
  const optimizedTitle = marketplaceType === 'MERCADO_LIVRE'
    ? `${cleanTitle.slice(0, 38)} UV50+ Original Garantia`.slice(0, 60)
    : `${cleanTitle} Térmica UV50+ Manga Longa Secagem Rápida Original com Nota Fiscal`;

  const titleAudit: MarketplaceTitleAudit = {
    originalTitle: cleanTitle,
    charCount: currentChars,
    maxRecommendedChars,
    keywordScore: Math.min(100, Math.max(65, Math.round((currentChars / maxRecommendedChars) * 100))),
    missingKeywords: ['Original', 'Garantia', 'Nota Fiscal', 'Secagem Rápida'],
    optimizedTitle,
    structuralFormula: '[Produto] + [Marca] + [Modelo/Especificação] + [Benefício Chave] + [Garantia/Tamanho]'
  };

  // 2. AUDITORIA DE FOTOS (DIRETRIZES DO ALGORITMO)
  const photoAudit: MarketplacePhotoAudit = {
    whiteBackgroundCompliance: true,
    resolutionQuality: 'BOA (>= 1000px)',
    photoCountRecommendation: '6 fotos + 1 vídeo (Mínimo recomendado para ranquear na 1ª página)',
    hasDimensionsInfographic: true,
    hasLifestylePhoto: true,
    hasVideoDemonstration: false,
    actionablePhotoChecklist: [
      {
        item: 'Foto 1: Fundo Branco Puro (RGB 255,255,255)',
        status: 'CONFORME',
        tip: 'Sem bordas, sem textos promocionais ou marcas d\'água para não perder relevância no algoritmo.'
      },
      {
        item: 'Foto 2: Detalhes de Acabamento & Costura',
        status: 'MELHORAR',
        tip: 'Inserir foto macro destacando os punhos com corte a laser e zíper reforçado.'
      },
      {
        item: 'Foto 3: Tabela de Medidas Ilustrada',
        status: 'CRITICO',
        tip: 'Inserir tabela gráfica (PP ao G2) com medidas de Tórax, Altura e Manga para reduzir em 60% as devoluções.'
      },
      {
        item: 'Foto 4: Foto de Uso / Lifestyle',
        status: 'CONFORME',
        tip: 'Mostra o produto sendo utilizado na prática esportiva ou dia a dia.'
      },
      {
        item: 'Vídeo Demonstrativo de 30s',
        status: 'CRITICO',
        tip: 'Anúncios com vídeo têm 28% mais conversão e prioridade na visualização mobile.'
      }
    ]
  };

  // 3. FICHA TÉCNICA & EAN / GTIN (BUY BOX & CATÁLOGO)
  const technicalSheetAudit: MarketplaceTechnicalSheetAudit = {
    hasGtinEan: true,
    gtinStatus: 'CÓDIGO VÁLIDO',
    attributesCompletenessScore: 88,
    criticalAttributesFound: ['Marca', 'Modelo', 'Material (Poliéster/Elastano)', 'Gênero', 'Proteção UV50+'],
    missingCriticalAttributes: ['Composição Exata (%)', 'Tipo de Manga', 'Instruções de Lavagem'],
    buyBoxImpactMessage: 'Código GTIN/EAN cadastrado habilita o anúncio para disputar a Buy Box e Catálogo oficial no marketplace.'
  };

  // 4. LOGÍSTICA & FULL
  const logisticsAudit: MarketplaceLogisticsAudit = {
    logisticsProgram: marketplaceType === 'MERCADO_LIVRE' 
      ? 'Mercado Envios Full / Coletas' 
      : marketplaceType === 'SHOPEE' 
      ? 'Shopee Oficial Envios' 
      : 'Amazon FBA / Prime',
    isFullEligible: true,
    shippingImpactLabel: '+42% Taxa de Conversão no Envio Rápido',
    sameDayDeliveryAdvantage: 'Anúncios com entrega no dia seguinte (Next Day) recebem até 3x mais cliques no topo dos filtros de busca.'
  };

  // 5. MOTOR B: DETECTOR DE ANÚNCIOS ZUMBIS (DIRETRIZES 2026)
  const zombieAudit: ZombieListingAudit = {
    status: 'EM TRAÇÃO ORGÂNICA',
    accountRiskLevel: 'BAIXO',
    zombieScore: 24, // Escala de 0 (ótimo) a 100 (zumbi total)
    diagnosisReason: 'O anúncio possui tráfego de busca e código EAN ativo, mas pode entrar em zumbificação se o tempo de resposta passar de 5 minutos ou se faltar vídeo demonstrativo.',
    rescuePlan7Days: [
      {
        day: 'Dia 1',
        title: 'Higienização de Título & EAN',
        action: 'Aplicar a fórmula algorítmica de 60 caracteres e validar o código GTIN-13 na Ficha Técnica.',
        badge: 'SEO Crítico'
      },
      {
        day: 'Dia 2',
        title: 'Upload da Tabela de Medidas (PP-G2)',
        action: 'Inserir a imagem infográfica de medidas na 3ª foto para estancar perguntas repetidas e devoluções.',
        badge: 'Conversão'
      },
      {
        day: 'Dia 3',
        title: 'Ativação do Mercado Envios Full / Flex',
        action: 'Despachar lote inicial de 20 peças para o centro de distribuição Full para ganhar o selo verde.',
        badge: 'Logística'
      },
      {
        day: 'Dia 4',
        title: 'Cupom de Reativação de 5%',
        action: 'Criar cupom de desconto temporário de 5% no painel da Shopee/Meli para forçar as primeiras 10 vendas.',
        badge: 'Tração Rápida'
      },
      {
        day: 'Dia 7',
        title: 'Auditoria de Conversão Final',
        action: 'Se o anúncio mantiver 0 vendas após 14 dias com tráfego, exclua-o para não puxar a CVR da conta para baixo.',
        badge: 'Proteção de Conta'
      }
    ]
  };

  // 6. MOTOR B: CALCULADORA DE BUY BOX & PREÇO TÁTICO
  const simulatedItemPrice = 149.90;
  const competitorBuyBoxPrice = 144.90;
  const recommendedBuyBoxPrice = 142.90;

  const buyBoxAudit: BuyBoxCompetitionAudit = {
    status: 'DISPUTA ACIRRADA',
    simulatedItemPrice,
    competitorBuyBoxPrice,
    recommendedBuyBoxPrice,
    marginImpact: 'Redução tática de R$ 7,00 compensada por aumento de 3.2x no volume de vendas pelo topo do catálogo.',
    buyBoxAdvantageStrategy: 'Ajuste de preço para R$ 142,90 + Envio Full garante a liderança da Buy Box sobre o concorrente direto.'
  };

  // 7. RESPOSTAS PRONTAS (QUEBRA DE OBJEÇÕES EM < 5 MIN)
  const qaTemplates: MarketplaceQaTemplateItem[] = [
    {
      id: 'qa-1',
      objectionType: 'TAMANHO',
      question: 'O tamanho é forma normal ou pequena? Tenho 1,80m e 85kg, qual comprar?',
      recommendedAnswer: 'Olá! A nossa modelagem é padrão brasileiro. Para 1,80m e 85kg, recomendamos o tamanho G para caimento ideal ou GG se preferir mais folgada. Temos tabela de medidas completa na 3ª foto do anúncio. Envio imediato!'
    },
    {
      id: 'qa-2',
      objectionType: 'ORIGINALIDADE',
      question: 'O produto é original? Acompanha Nota Fiscal?',
      recommendedAnswer: 'Sim, produto 100% Original da marca oficial, enviado diretamente do nosso estoque com Nota Fiscal e Garantia total de fábrica. Compre com segurança!'
    },
    {
      id: 'qa-3',
      objectionType: 'MATERIAL',
      question: 'O tecido esquenta no sol? A proteção solar sai na lavagem?',
      recommendedAnswer: 'Não esquenta! O tecido conta com tecnologia Dry-Fit respirável com bloqueio solar UV50+ permanente aplicado direto na fiação, não saindo com as lavagens. Conforto térmico garantido!'
    },
    {
      id: 'qa-4',
      objectionType: 'ENTREGA',
      question: 'Se eu comprar agora, envia hoje mesmo?',
      recommendedAnswer: 'Comprando até as 13h, seu pedido é despachado no mesmo dia através do frete prioritário rápido. Aguardamos sua compra!'
    }
  ];

  return {
    isMarketplace: true,
    marketplaceType,
    marketplaceName,
    marketplaceColor,
    badgeLabel: `Modo Marketplace: ${marketplaceName}`,
    listingScore: 84,
    titleAudit,
    photoAudit,
    technicalSheetAudit,
    logisticsAudit,
    zombieAudit,
    buyBoxAudit,
    qaTemplates,
    topRecommendations: [
      `Ajuste o título para a estrutura algorítmica de 60 caracteres: "${optimizedTitle}".`,
      'Suba uma imagem com a Tabela de Medidas (PP ao G2) na 3ª foto para zerar dúvidas de tamanho.',
      'Grave um vídeo de 30 segundos demonstrando o tecido e o zíper para ganhar destaque no app mobile.',
      'Mantenha o tempo de resposta das perguntas abaixo de 5 minutos para maximizar o índice de relevância do vendedor.'
    ]
  };
}
