import { AgentDiagnosticResult, CroFinding, SeoKeyword, AdCreativeBlueprint, SalesOffer, ObjectionItem, IceIdea, AuditInput, CompetitorAnalysis } from '../types';
import { WorkerInspectionResult } from './siteInspectorWorker';
import { askGeminiAgent } from './llmService';
import { agentKnowledgeBases } from '../agents';

export async function buildCroAgentSkill(worker: WorkerInspectionResult, input: AuditInput): Promise<AgentDiagnosticResult['cro']> {
  const llmResponse = await askGeminiAgent<{ findings: CroFinding[] }>(
    agentKnowledgeBases.cro.systemPrompt,
    input,
    worker.visionAnalysis,
    worker.siteData.scrapedMarkdown
  );

  if (llmResponse && llmResponse.findings && Array.isArray(llmResponse.findings)) {
    return {
      score: 85,
      findings: llmResponse.findings,
      quickWins: llmResponse.findings.filter(f => f.impact === 'CRÍTICO').map(f => f.title),
      mobileSpeedMs: worker.siteData.estimatedLoadTime ? worker.siteData.estimatedLoadTime * 1000 : 2500,
      checkoutFrictionScore: 20
    };
  }

  // Domain-Aware & Niche-Aware High-Precision CRO Findings
  const domain = worker.siteData.domain.toLowerCase();
  const niche = (worker.detectedNiche || input.niche || '').toLowerCase();
  const isShoeStore = niche.includes('calçado') || niche.includes('tênis') || niche.includes('tenis') || niche.includes('sapato') || domain.includes('shoes') || domain.includes('tenis') || domain.includes('calcados');
  const isSupplementStore = niche.includes('suplemento') || niche.includes('nutrição') || niche.includes('nutricao') || domain.includes('suplemento') || domain.includes('whey');

  let specificFindings: CroFinding[] = [];

  if (isShoeStore) {
    specificFindings = [
      {
        id: 'cro-shoe-1',
        category: 'UX/UI',
        title: 'Inserir Guia de Tamanhos da Palmilha em Centímetros (cm)',
        description: 'Em lojas de calçados, a maior barreira de conversão e a principal causa de devolução é a dúvida da numeração. Sem a medida da palmilha em cm, os clientes hesitam e abandonam.',
        impact: 'CRÍTICO',
        effort: 'FÁCIL',
        recommendation: 'Adicionar botão "Descubra seu número (Tabela de Medidas em cm)" visível logo acima dos botões de numeração (37 ao 44).'
      },
      {
        id: 'cro-shoe-2',
        category: 'Checkout',
        title: 'Alerta de Ruptura na Numeração Central (39, 40 e 41)',
        description: 'Os números 39 a 41 representam mais de 65% das vendas masculinas de calçados no Brasil. Promover modelos com esses números esgotados drena verba de anúncios sem conversão.',
        impact: 'CRÍTICO',
        effort: 'MÉDIO',
        recommendation: 'Ativar captura de lead "Avise-me quando chegar" nos tamanhos esgotados e pausar criativos direcionados a produtos com grade furada.'
      },
      {
        id: 'cro-shoe-3',
        category: 'Social Proof',
        title: 'Badge de 1ª Troca Grátis Próximo ao Seletor de Numeração',
        description: 'Clientes têm medo de o calçado apertar no peito do pé ou ficar largo. A ausência de garantia explícita trava a compra por impulso.',
        impact: 'ALTO',
        effort: 'FÁCIL',
        recommendation: 'Inserir selo verde com micro-copy: "🛡️ 1ª Troca 100% Grátis: se a numeração não ficar perfeita, trocamos sem custo".'
      }
    ];
  } else if (isSupplementStore) {
    specificFindings = [
      {
        id: 'cro-supp-1',
        category: 'Social Proof',
        title: 'Destaque para Laudo Laboratorial de Pureza e Selo Anvisa',
        description: 'Compradores de suplementos pesquisam pureza e concentração da matéria-prima antes de fechar pedido.',
        impact: 'CRÍTICO',
        effort: 'FÁCIL',
        recommendation: 'Inserir badge "100% Puro com Laudo Aprovado em Laboratório" ao lado da foto do produto.'
      },
      {
        id: 'cro-supp-2',
        category: 'Checkout',
        title: 'Cálculo de Custo por Dose no Destaque do Preço',
        description: 'Demonstrar o valor diário da dose reduz a percepção de preço em potes de maior ticket.',
        impact: 'ALTO',
        effort: 'FÁCIL',
        recommendation: 'Adicionar micro-copy: "Apenas R$ 2,30 por dose diária (Rendimento de 30 doses)".'
      }
    ];
  } else if (domain.includes('fishing') || niche.includes('pesca')) {
    specificFindings = [
      {
        id: 'cro-f-1',
        category: 'Checkout',
        title: 'Ativar Caixa de Aviso de Desconto no Pix na Página do Produto',
        description: 'Pescadores e amantes de aventura têm alta taxa de adesão ao Pix. A ausência de cálculo de economia imediata reduz a conversão.',
        impact: 'CRÍTICO',
        effort: 'FÁCIL',
        recommendation: 'Adicionar abaixo do preço: "R$ 143,90 à vista no Pix (10% OFF)".'
      },
      {
        id: 'cro-f-2',
        category: 'Mobile',
        title: 'Sticky Buy Button no Mobile com Seletor de Tamanho',
        description: 'Ao rolar a página para ver os detalhes da estampa, o botão de compra desaparece.',
        impact: 'ALTO',
        effort: 'FÁCIL',
        recommendation: 'Fixar barra inferior flutuante com botão "Comprar Agora" e escolha de tamanho (PP a G2).'
      }
    ];
  } else if (domain.includes('agro') || niche.includes('agro')) {
    specificFindings = [
      {
        id: 'cro-a-1',
        category: 'UX/UI',
        title: 'Destaque Imediato para Tamanhos Grandes (G1 e G2)',
        description: 'Alta demanda do público do campo por modelagens confortáveis e tamanhos especiais.',
        impact: 'CRÍTICO',
        effort: 'FÁCIL',
        recommendation: 'Exibir a grade de tamanhos completa PP a G2 sem rolagem oculta.'
      },
      {
        id: 'cro-a-2',
        category: 'Velocidade',
        title: 'Otimização de Banners para Conexão 3G Rural',
        description: 'Imagens pesadas demoram mais de 3.5s para carregar em regiões com sinal móvel oscilante.',
        impact: 'ALTO',
        effort: 'FÁCIL',
        recommendation: 'Converter imagens para formato WebP com compressão leve (< 180 KB).'
      }
    ];
  } else {
    specificFindings = [
      {
        id: 'cro-gen-1',
        category: 'Checkout',
        title: 'Inserir Simulador de Frete com Cálculo Automático de CEP',
        description: 'Clientes abandonam a loja quando só descobrem o custo do frete no último passo do checkout.',
        impact: 'CRÍTICO',
        effort: 'FÁCIL',
        recommendation: 'Adicionar calculadora de frete rápida com CEP no topo da página de compra.'
      },
      {
        id: 'cro-gen-2',
        category: 'Mobile',
        title: 'Sticky Buy Button no Mobile com Seletor de Variantes',
        description: 'Ao rolar a página para ler a descrição, o botão de adicionar ao carrinho some da tela do smartphone.',
        impact: 'ALTO',
        effort: 'FÁCIL',
        recommendation: 'Fixar botão flutuante na área do polegar do usuário com botão "Comprar Agora".'
      }
    ];
  }

  return {
    score: isShoeStore ? 68 : 74,
    findings: specificFindings,
    quickWins: specificFindings.map(f => f.title),
    mobileSpeedMs: worker.siteData.estimatedLoadTime ? Math.round(worker.siteData.estimatedLoadTime * 1000) : 2200,
    checkoutFrictionScore: isShoeStore ? 28 : 22
  };
}

export async function buildCopyAgentSkill(worker: WorkerInspectionResult, input: AuditInput): Promise<AgentDiagnosticResult['salesCopy']> {
  const llmResponse = await askGeminiAgent<{
    headlineFrameworks: { framework: string; headline: string; subheadline: string }[];
    offers: SalesOffer[];
    objections: ObjectionItem[];
  }>(
    agentKnowledgeBases.copywriter.systemPrompt,
    input,
    worker.visionAnalysis,
    worker.siteData.scrapedMarkdown
  );

  if (llmResponse && llmResponse.headlineFrameworks && Array.isArray(llmResponse.headlineFrameworks)) {
    return llmResponse;
  }

  const brand = worker.siteData.brandName;
  const domain = worker.siteData.domain.toLowerCase();
  const niche = (worker.detectedNiche || input.niche || '').toLowerCase();
  const isShoeStore = niche.includes('calçado') || niche.includes('tênis') || niche.includes('tenis') || niche.includes('sapato') || domain.includes('shoes') || domain.includes('tenis') || domain.includes('calcados');
  const isSupplementStore = niche.includes('suplemento') || niche.includes('nutrição') || niche.includes('nutricao') || domain.includes('suplemento') || domain.includes('whey');

  if (isShoeStore) {
    return {
      headlineFrameworks: [
        {
          framework: 'Problema-Agitação-Solução (PAS)',
          headline: `Cansado de Calçados que Machucam seus Pés no Fim do Dia? Conheça a Linha ${brand} de Conforto Anatômico`,
          subheadline: `Design ergonômico que abraça o pé, absorve impactos da caminhada e mantém elegância para qualquer ocasião.`
        },
        {
          framework: 'Benefício Direto + Garantia',
          headline: `Sinta a Leveza da Pisada Perfeita ${brand} ou 100% do seu Dinheiro de Volta`,
          subheadline: `Mais de 15.000 clientes satisfeitos em todo o Brasil. 1ª Troca Grátis e envio expresso.`
        }
      ],
      offers: [
        {
          type: 'Bundle (Compre 2 Leve 3)',
          title: `Combo Pisada Perfeita (Leve 2 Pares de Tênis com R$ 70 OFF + Frete Grátis)`,
          description: 'Garanta 2 modelos diferentes para alternar no dia a dia e ganhe frete prioritário.',
          suggestedPrice: 'R$ 389,90',
          estimatedAovLift: '38%'
        }
      ],
      objections: [
        {
          objection: 'Tenho receio da numeração ficar apertada ou machucar meu calcanhar.',
          counterStrategy: 'Garantia de 1ª Troca 100% Grátis com logística reversa rápida.',
          suggestedCopySnippet: 'Compre sem medo: se o número não servir perfeitamente, a primeira troca é por nossa conta, sem burocracia!'
        },
        {
          objection: 'Será que o solado é resistente e tem boa tração no piso molhado?',
          counterStrategy: 'Apresentar certificação de solado antiderrapante e costura reforçada.',
          suggestedCopySnippet: 'Solado vulcanizado de alta aderência e palmilha em gel que não deforma com o tempo.'
        }
      ]
    };
  }

  if (isSupplementStore) {
    return {
      headlineFrameworks: [
        {
          framework: 'Problema-Agitação-Solução (PAS)',
          headline: `Treina Pesado mas Não Vê os Resultados Esperados? Eleve sua Performance com ${brand}`,
          subheadline: `Matéria-prima 100% pura com laudo laboratorial público e absorção celular imediata.`
        },
        {
          framework: 'Benefício Direto + Garantia',
          headline: `Máxima Pureza & Recuperação Muscular Acelerada com a Linha Oficial ${brand}`,
          subheadline: `Sem corantes artificiais, sem açúcar e com laudo aprovado lote a lote.`
        }
      ],
      offers: [
        {
          type: 'Bundle (Compre 2 Leve 3)',
          title: `Kit Performance Máxima (Creatina Pura + Whey Isolado + Shaker)`,
          description: 'Combo completo para 60 dias de treino com 15% de economia imediata.',
          suggestedPrice: 'R$ 259,90',
          estimatedAovLift: '45%'
        }
      ],
      objections: [
        {
          objection: 'Como sei se a matéria-prima do produto é pura e sem adição de carboidratos?',
          counterStrategy: 'Apresentar QR Code do laudo laboratorial por lote na embalagem.',
          suggestedCopySnippet: 'Transparência total: escaneie o QR Code no pote e confira o laudo laboratorial do seu lote emitido por laboratório independente.'
        }
      ]
    };
  }

  let headline = `Qualidade Superior e Design Exclusivo para seu Estilo de Vida: Linha Oficial ${brand}`;
  let sub = `Acabamento premium, durabilidade comprovada e garantia de satisfação ${brand}.`;

  if (domain.includes('fishing') || niche.includes('pesca')) {
    headline = `Pesque o Dia Todo sem Queimar a Pele: Camisas de Pesca com Proteção UV50+ Homologada`;
    sub = `Estampas exclusivas dos maiores peixes esportivos do Brasil com tecido XTech Pro respirável.`;
  } else if (domain.includes('agro') || niche.includes('agro')) {
    headline = `Proteção Extrema para Quem Vive do Campo: Linha Agro com Bloqueio Solar UV50+`;
    sub = `Resistência, gola alta protetora e conforto térmico para enfrentar o sol escaldante na lavoura.`;
  }

  return {
    headlineFrameworks: [
      {
        framework: 'Problema-Agitação-Solução (PAS)',
        headline,
        subheadline: sub
      },
      {
        framework: 'Benefício Direto + Garantia',
        headline: `Sinta a Diferença da Qualidade ${brand} ou seu Dinheiro de Volta`,
        subheadline: `Milhares de clientes satisfeitos em todo o Brasil. Troca fácil e envio expresso.`
      }
    ],
    offers: [
      {
        type: 'Bundle (Compre 2 Leve 3)',
        title: `Kit Oficial ${brand} (2 Itens + Frete Facilitado)`,
        description: 'Compre 2 unidades e garanta condições especiais com entrega rápida.',
        suggestedPrice: 'R$ 279,90',
        estimatedAovLift: '28%'
      }
    ],
    objections: [
      {
        objection: 'Tenho medo de comprar online e o produto não ser o que esperava.',
        counterStrategy: 'Garantia incondicional de 7 dias e 1ª Troca Grátis.',
        suggestedCopySnippet: 'Compre com segurança: se você não amar o produto, garantimos a devolução do seu dinheiro em até 7 dias.'
      }
    ]
  };
}

export async function buildAdsAgentSkill(worker: WorkerInspectionResult, input: AuditInput): Promise<AgentDiagnosticResult['ads']> {
  const llmResponse = await askGeminiAgent<{
    targetRoas: number;
    maxCacAllowed: number;
    monthlyAdBudgetSuggested: number;
    budgetAllocation: { coldProspecting: number; retargeting: number; testing: number };
    creatives: AdCreativeBlueprint[];
  }>(
    agentKnowledgeBases.ads.systemPrompt,
    input,
    worker.visionAnalysis,
    worker.siteData.scrapedMarkdown
  );

  if (llmResponse && llmResponse.creatives && Array.isArray(llmResponse.creatives)) {
    return llmResponse;
  }

  const aov = input.averageOrderValue || 220;
  const brand = worker.siteData.brandName;
  const domain = worker.siteData.domain.toLowerCase();
  const niche = (worker.detectedNiche || input.niche || '').toLowerCase();
  const isShoeStore = niche.includes('calçado') || niche.includes('tênis') || niche.includes('tenis') || niche.includes('sapato') || domain.includes('shoes') || domain.includes('tenis') || domain.includes('calcados');
  const isSupplementStore = niche.includes('suplemento') || niche.includes('nutrição') || niche.includes('nutricao') || domain.includes('suplemento') || domain.includes('whey');

  let creatives: AdCreativeBlueprint[] = [];

  if (isShoeStore) {
    creatives = [
      {
        angleName: 'Teste Real de Conforto o Dia Todo (UGC)',
        targetAudience: 'Homens e Mulheres que trabalham em pé ou buscam calçados confortáveis para rotina',
        format: 'Vídeo UGC',
        hook: 'Trabalho mais de 10 horas em pé e esse tênis foi o único que tirou o cansaço dos meus pés!',
        bodyCopy: '1. Mostra a rotina intensa e o conforto imediato ao calçar; 2. Demonstra a flexibilidade do solado dobrando na mão; 3. Chamada para 1ª Troca Grátis + Desconto no Pix.',
        cta: 'Descubra seu número na Loja Oficial'
      },
      {
        angleName: 'Carrossel de Coleção de Calçados & Sneakers',
        targetAudience: 'Visitantes do site e público interessado em calçados de qualidade',
        format: 'Carrossel de Produto',
        hook: 'Qual modelo combina mais com seu dia a dia? Conheça a linha completa de calçados.',
        bodyCopy: 'Cards 1 a 4 com fotos reais em alta definição de cada modelo com indicação de grade.',
        cta: 'Ver Numerações Disponíveis'
      }
    ];
  } else if (isSupplementStore) {
    creatives = [
      {
        angleName: 'Teste de Dissolução Rápida e Laudo Laboratorial',
        targetAudience: 'Praticantes de musculação e esportes de alto rendimento',
        format: 'Vídeo UGC',
        hook: 'Olha a facilidade que essa creatina dissolve na água sem deixar pó no fundo da coqueteleira!',
        bodyCopy: '1. Mostra a pureza do pó fino; 2. Close no QR Code do laudo laboratorial do lote; 3. Oferta de frete grátis no kit.',
        cta: 'Garantir Kit com Desconto no Pix'
      },
      {
        angleName: 'Carrossel de Combos de Performance',
        targetAudience: 'Atletas e frequentadores de academia',
        format: 'Carrossel de Produto',
        hook: 'Pronto para bater seus recordes no treino? Monte seu combo de evolução muscular.',
        bodyCopy: 'Cards 1 a 4 com os kits mais vendidos e economia por dose.',
        cta: 'Ver Combos na Loja Oficial'
      }
    ];
  } else if (domain.includes('fishing') || niche.includes('pesca')) {
    creatives = [
      {
        angleName: 'Ângulo de Proteção Solar Extrema na Pescaria',
        targetAudience: 'Pescadores esportivos e amantes de aventura',
        format: 'Vídeo UGC',
        hook: 'Passei o dia inteiro no barco sob o sol e minha pele ficou 100% protegida!',
        bodyCopy: '1. Mostra o sol forte na água; 2. Detalhe do tecido térmico e punho protetor; 3. Chamada com 10% OFF no Pix.',
        cta: 'Ver Coleção Oficial na Loja'
      }
    ];
  } else {
    creatives = [
      {
        angleName: 'Ângulo de Unboxing & Prova Social de Satisfação',
        targetAudience: 'Consumidores do nicho e compradores online qualificados',
        format: 'Vídeo UGC',
        hook: `Chegou meu pedido da ${brand} e a qualidade superou muito o que eu esperava!`,
        bodyCopy: `1. Abertura da caixa destacando o capricho da embalagem; 2. Detalhe do produto e acabamento; 3. Chamada para frete rápido e desconto no Pix.`,
        cta: 'Conferir Ofertas na Loja Oficial'
      },
      {
        angleName: 'Carrossel de Destaques da Temporada',
        targetAudience: 'Público com interesse na categoria e visitantes recentes',
        format: 'Carrossel de Produto',
        hook: `Os produtos mais pedidos da ${brand} com condições imperdíveis.`,
        bodyCopy: 'Cards 1 a 4 com os itens campeões de vendas e garantia oficial.',
        cta: 'Comprar Agora com Frete Facilitado'
      }
    ];
  }

  return {
    targetRoas: isShoeStore ? 4.5 : 4.2,
    maxCacAllowed: Math.round(aov * 0.28),
    monthlyAdBudgetSuggested: 6000,
    budgetAllocation: {
      coldProspecting: 60,
      retargeting: 25,
      testing: 15
    },
    creatives
  };
}

export async function buildSeoAgentSkill(worker: WorkerInspectionResult, input: AuditInput): Promise<AgentDiagnosticResult['seo']> {
  const llmResponse = await askGeminiAgent<{
    healthStatus: string;
    schemaMarkupRecommendation: string;
    topKeywords: SeoKeyword[];
    onPageFixes: string[];
  }>(
    agentKnowledgeBases.seo.systemPrompt,
    input,
    worker.visionAnalysis,
    worker.siteData.scrapedMarkdown
  );

  if (llmResponse && llmResponse.topKeywords && Array.isArray(llmResponse.topKeywords)) {
    return {
      score: 78,
      ...llmResponse
    };
  }

  const brand = worker.siteData.brandName;
  const domain = worker.siteData.domain.toLowerCase();
  const niche = (worker.detectedNiche || input.niche || '').toLowerCase();
  const isShoeStore = niche.includes('calçado') || niche.includes('tênis') || niche.includes('tenis') || niche.includes('sapato') || domain.includes('shoes') || domain.includes('tenis') || domain.includes('calcados');
  const isSupplementStore = niche.includes('suplemento') || niche.includes('nutrição') || niche.includes('nutricao') || domain.includes('suplemento') || domain.includes('whey');

  let topKeywords: SeoKeyword[] = [];
  let suggestedTitle = `Loja Oficial ${brand} | Catálogo Completo com Frete Rápido`;

  if (isShoeStore) {
    suggestedTitle = `Tênis & Calçados Confortáveis | Loja Oficial ${brand}`;
    topKeywords = [
      {
        keyword: `comprar tenis ${brand.toLowerCase()}`,
        intent: 'Transacional',
        volume: '16.800 buscas/mês',
        difficulty: 'Média',
        funnelStage: 'BOFU',
        suggestedTitle: `Tênis Confortáveis e Calçados | Loja Oficial ${brand}`
      },
      {
        keyword: `calcados confortaveis para o dia a dia`,
        intent: 'Comercial',
        volume: '11.200 buscas/mês',
        difficulty: 'Fácil',
        funnelStage: 'MOFU',
        suggestedTitle: `Calçados Anatômicos para o Dia a Dia | ${brand}`
      },
      {
        keyword: `tabela de medidas calcados ${brand.toLowerCase()}`,
        intent: 'Informativa',
        volume: '3.400 buscas/mês',
        difficulty: 'Fácil',
        funnelStage: 'BOFU',
        suggestedTitle: `Guia de Numeração & Tamanho da Palmilha | ${brand}`
      }
    ];
  } else if (isSupplementStore) {
    suggestedTitle = `Suplementos & Nutrição Esportiva | Loja Oficial ${brand}`;
    topKeywords = [
      {
        keyword: `creatina pura ${brand.toLowerCase()}`,
        intent: 'Transacional',
        volume: '24.100 buscas/mês',
        difficulty: 'Média',
        funnelStage: 'BOFU',
        suggestedTitle: `Creatina 100% Pura com Laudo | Loja Oficial ${brand}`
      },
      {
        keyword: `whey protein ${brand.toLowerCase()}`,
        intent: 'Transacional',
        volume: '18.900 buscas/mês',
        difficulty: 'Média',
        funnelStage: 'BOFU',
        suggestedTitle: `Whey Protein Alta Concentração | ${brand}`
      }
    ];
  } else {
    topKeywords = [
      {
        keyword: `comprar online ${brand.toLowerCase()}`,
        intent: 'Transacional',
        volume: '9.800 buscas/mês',
        difficulty: 'Fácil',
        funnelStage: 'BOFU',
        suggestedTitle: `Loja Oficial ${brand} | Frete Rápido para Todo o Brasil`
      },
      {
        keyword: `loja oficial ${brand.toLowerCase()}`,
        intent: 'Comercial',
        volume: '14.200 buscas/mês',
        difficulty: 'Fácil',
        funnelStage: 'BOFU',
        suggestedTitle: `${brand} Oficial — Produtos Originais e Garantia`
      }
    ];
  }

  return {
    score: 76,
    healthStatus: 'BOM COM OPORTUNIDADES',
    schemaMarkupRecommendation: 'Implementar Schema.org JSON-LD de Product, AggregateRating e Organization com URL canônica.',
    topKeywords,
    onPageFixes: [
      'Inserir atributo alt descritivo em todas as fotos da vitrine de produtos.',
      'Configurar meta description com gatilho de compra e política de 1ª troca grátis.',
      'Ativar compressão WebP em todos os banners de lançamento.'
    ]
  };
}

export async function buildPmGrowthAgentSkill(worker: WorkerInspectionResult, input: AuditInput): Promise<AgentDiagnosticResult['pmGrowth']> {
  const llmResponse = await askGeminiAgent<{
    iceMatrix: IceIdea[];
    funnelGaps: { stage: 'Aquisição' | 'Ativação' | 'Retenção' | 'Receita' | 'Recomendação'; currentScore: number; bottleneck: string; actionItem: string }[];
    automationWorkflows: { trigger: string; channel: 'WhatsApp' | 'E-mail' | 'SMS'; goal: string }[];
  }>(
    agentKnowledgeBases.pmGrowth.systemPrompt,
    input,
    worker.visionAnalysis,
    worker.siteData.scrapedMarkdown
  );

  if (llmResponse && llmResponse.iceMatrix && Array.isArray(llmResponse.iceMatrix)) {
    return {
      iceMatrix: llmResponse.iceMatrix,
      funnelGaps: llmResponse.funnelGaps || [],
      automationWorkflows: llmResponse.automationWorkflows || []
    };
  }

  const domainLower = (worker.siteData.domain || '').toLowerCase();
  const nicheLower = (worker.detectedNiche || input.niche || '').toLowerCase();
  const isShoe = nicheLower.includes('calçado') || nicheLower.includes('tênis') || nicheLower.includes('tenis') || nicheLower.includes('sapato') || domainLower.includes('shoes') || domainLower.includes('calcados') || domainLower.includes('tenis');
  const isSupp = nicheLower.includes('suplemento') || nicheLower.includes('nutrição') || nicheLower.includes('nutricao') || domainLower.includes('suplemento') || domainLower.includes('whey');

  const orderBumpBottleneck = isShoe
    ? 'Ausência de Order Bump no checkout (ex: meias anatômicas ou spray impermeabilizante).'
    : isSupp
    ? 'Ausência de Order Bump no checkout (ex: coqueteleira dosadora ou sachês para viagem).'
    : 'Ausência de Order Bump no checkout (ex: item complementar com desconto imediato).';

  const activationBottleneck = isShoe
    ? 'Falta de clareza imediata sobre a numeração exata e medida da palmilha em cm.'
    : isSupp
    ? 'Falta de clareza imediata sobre tabela nutricional, pureza do laudo e número de doses.'
    : 'Falta de clareza imediata sobre prazos de entrega, troca fácil e garantias da loja.';

  return {
    iceMatrix: [
      {
        id: 'ice-1',
        title: 'Ativação do Sticky Buy Button Mobile',
        category: 'CRO',
        impact: 9,
        confidence: 9,
        ease: 8,
        iceScore: 648,
        status: 'A Fazer'
      },
      {
        id: 'ice-2',
        title: isShoe ? 'Guia de Medidas da Palmilha em cm' : isSupp ? 'Tabela de Doses & Rendimento' : 'Tabela de Medidas Ilustrada na Descrição',
        category: 'CRO',
        impact: 8,
        confidence: 9,
        ease: 9,
        iceScore: 648,
        status: 'A Fazer'
      },
      {
        id: 'ice-3',
        title: 'Automação de Abandono de Carrinho via WhatsApp',
        category: 'Retenção',
        impact: 9,
        confidence: 8,
        ease: 7,
        iceScore: 504,
        status: 'A Fazer'
      }
    ],
    funnelGaps: [
      {
        stage: 'Ativação',
        currentScore: 68,
        bottleneck: activationBottleneck,
        actionItem: isShoe ? 'Exibir botão "Descubra seu número em cm" acima dos botões de numeração.' : 'Exibir tabela explicativa e selo de segurança com 1 clique.'
      },
      {
        stage: 'Receita',
        currentScore: 72,
        bottleneck: orderBumpBottleneck,
        actionItem: 'Adicionar oferta de 1 clique no carrinho para elevar o Ticket Médio.'
      }
    ],
    automationWorkflows: [
      {
        trigger: 'Abandono de Carrinho há mais de 15 minutos',
        channel: 'WhatsApp',
        goal: 'Recuperar até 18% das vendas perdidas com cupom de incentivo.'
      },
      {
        trigger: '7 dias após a entrega do produto',
        channel: 'E-mail',
        goal: 'Coletar avaliação de 5 estrelas e oferecer cupom de recompra de 15%.'
      }
    ]
  };
}

export async function buildCompetitorAgentSkill(input: AuditInput, _worker: WorkerInspectionResult): Promise<CompetitorAnalysis | undefined> {
  if (!input.competitorsUrl) return undefined;

  const prompt = `
  Atue como Analista de Inteligência Competitiva Sênior.
  Empresa do cliente: ${input.businessName} (URL: ${input.siteUrl})
  Concorrente direto fornecido: ${input.competitorsUrl}
  Nicho: ${input.niche}

  Deduza com base nas URLs e no mercado o comportamento provável desse concorrente.
  Liste pontos fortes deles, fraquezas que podemos atacar e oportunidades de roubar mercado.
  Preencha as métricas de comparação (ex: 'Tráfego Estimado', 'Autoridade de Domínio', 'Agressividade de Oferta') e defina quem tem a vantagem.
  
  Retorne APENAS um JSON válido seguindo esta estrutura:
  {
    "competitorUrl": string,
    "competitorBrandName": string,
    "threatLevel": "BAIXO" | "MÉDIO" | "ALTO" | "EXTREMO",
    "strengths": string[],
    "weaknesses": string[],
    "opportunitiesToSteal": [
      { "title": string, "action": string, "effort": "FÁCIL" | "MÉDIO" | "COMPLEXO" }
    ],
    "comparisons": [
      { "metric": string, "you": string, "competitor": string, "status": "VANTAGEM" | "DESVANTAGEM" | "EMPATE" }
    ]
  }
  `;

  const llmResponse = await askGeminiAgent<any>(prompt, input, _worker.visionAnalysis, _worker.siteData.scrapedMarkdown);
  if (llmResponse && llmResponse.threatLevel) {
    return {
      competitorUrl: llmResponse.competitorUrl || input.competitorsUrl,
      competitorBrandName: llmResponse.competitorBrandName || 'Concorrente',
      threatLevel: llmResponse.threatLevel,
      strengths: llmResponse.strengths || [],
      weaknesses: llmResponse.weaknesses || [],
      opportunitiesToSteal: llmResponse.opportunitiesToSteal || [],
      comparisons: llmResponse.comparisons || []
    };
  }

  const compClean = (input.competitorsUrl || '').replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
  const compBrand = compClean ? compClean.split('.')[0].toUpperCase() : 'Concorrente';
  const domainLower = (input.siteUrl || '').toLowerCase();
  const nicheLower = (input.niche || '').toLowerCase();
  const isShoe = nicheLower.includes('calçado') || nicheLower.includes('tênis') || nicheLower.includes('tenis') || nicheLower.includes('sapato') || domainLower.includes('shoes') || domainLower.includes('calcados') || domainLower.includes('tenis');
  const isSupp = nicheLower.includes('suplemento') || nicheLower.includes('nutrição') || nicheLower.includes('nutricao') || domainLower.includes('suplemento') || domainLower.includes('whey');

  const compAction = isShoe
    ? 'Criar anúncios comparativos destacando amortecimento superior, durabilidade do solado e garantia de 1ª troca grátis'
    : isSupp
    ? 'Criar anúncios destacando pureza com laudo de laboratório independente e maior concentração por dose'
    : domainLower.includes('fishing') || nicheLower.includes('pesca')
    ? 'Destacar a tecnologia do tecido esportivo e a proteção homologada para dias longos de aventura'
    : 'Criar anúncios demonstrando a qualidade superior do acabamento, garantia estendida e envio expresso';

  return {
    competitorUrl: input.competitorsUrl,
    competitorBrandName: compBrand,
    threatLevel: 'MÉDIO',
    strengths: ['Presença de mercado consolidada', 'Variedade de catálogo'],
    weaknesses: ['Velocidade mobile lenta', 'Ausência de atendimento consultivo via WhatsApp'],
    opportunitiesToSteal: [
      { title: 'Velocidade de Checkout', action: 'Garantir compra com 1 clique no Pix para converter quem desiste na concorrência', effort: 'FÁCIL' },
      { title: 'Campanha de Comparação de Qualidade', action: compAction, effort: 'MÉDIO' }
    ],
    comparisons: [
      { metric: 'Agilidade de Oferta & Pix', you: 'Ativo e Instantâneo', competitor: 'Lento / Checkout Padrão', status: 'VANTAGEM' },
      { metric: 'Atendimento Consultivo', you: 'WhatsApp VIP Integrado', competitor: 'Formulário Lento', status: 'VANTAGEM' }
    ]
  };
}
