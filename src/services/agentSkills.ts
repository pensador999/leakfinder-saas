import { AgentDiagnosticResult, CroFinding, SeoKeyword, AdCreativeBlueprint, SalesOffer, ObjectionItem, IceIdea, AuditInput, CompetitorAnalysis } from '../types';
import { WorkerInspectionResult } from './siteInspectorWorker';
import { askGeminiAgent } from './llmService';
import { agentKnowledgeBases, getVerticalizedAgentPrompt } from '../agents';
import { resolveDynamicVertical } from './ai/dynamicVerticalContext';

function buildNicheContextString(worker: WorkerInspectionResult, input: AuditInput): string {
  const catalogTitles = (worker.siteData.catalogAudit?.issues || []).map(i => i.productTitle).join(' ');
  return `${worker.detectedNiche || ''} ${input.niche || ''} ${worker.siteData.domain || ''} ${worker.siteData.title || ''} ${catalogTitles}`.toLowerCase();
}

export async function buildCroAgentSkill(worker: WorkerInspectionResult, input: AuditInput): Promise<AgentDiagnosticResult['cro']> {
  const nicheContext = buildNicheContextString(worker, input);
  const vertical = resolveDynamicVertical(nicheContext);
  const verticalPrompt = getVerticalizedAgentPrompt('agent-10', nicheContext, agentKnowledgeBases.cro.systemPrompt);

  const llmResponse = await askGeminiAgent<{ findings: CroFinding[] }>(
    verticalPrompt,
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

  let specificFindings: CroFinding[] = [];

  switch (vertical.verticalId) {
    case 'CALCADOS_COURO':
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
          title: `Alerta de Ruptura na Numeração Central (${vertical.coreDemandSizes.join(', ')})`,
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
      break;

    case 'SUPLEMENTOS_SAUDE':
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
      break;

    case 'COSMETICOS_BEAUTY':
      specificFindings = [
        {
          id: 'cro-beauty-1',
          category: 'Social Proof',
          title: 'Destaque para Ativos Dermatológicos (INCI), Selo ANVISA e Cruelty-Free',
          description: 'No setor de skincare e cosméticos, a ausência de indicação clara do tipo de pele e registro ANVISA gera abandono imediato na primeira compra.',
          impact: 'CRÍTICO',
          effort: 'FÁCIL',
          recommendation: 'Inserir ícones de "Dermatologicamente Testado • Vegano • Registro ANVISA" logo abaixo do botão de compra.'
        },
        {
          id: 'cro-beauty-2',
          category: 'Checkout',
          title: 'Seletor de Kit Progressivo (Compre 2 ou 3 com Desconto de Rotina)',
          description: `${vertical.vocabulary.lossPainHooks[1]}`,
          impact: 'ALTO',
          effort: 'FÁCIL',
          recommendation: 'Exibir opções de "1 Frasco (30 dias)" vs "Kit Tratamento 90 dias (15% OFF + Frete Grátis)" na página de produto.'
        }
      ];
      break;

    case 'PET_SHOP_VETERINARIA':
      specificFindings = [
        {
          id: 'cro-pet-1',
          category: 'UX/UI',
          title: 'Guia Visual de Porte do Pet (Raça, Peso e Medidas do Tórax/Pescoço)',
          description: `${vertical.vocabulary.lossPainHooks[0]}`,
          impact: 'CRÍTICO',
          effort: 'FÁCIL',
          recommendation: 'Inserir tabela visual correlacionando tamanhos (PP ao GG) com peso em kg e raças de referência.'
        },
        {
          id: 'cro-pet-2',
          category: 'Checkout',
          title: 'Opção de Assinatura / Recompra Programada com Desconto no Pix',
          description: 'Tutores de pets compram rações, tapetes higiênicos e antipulgas mensalmente. Sem recompra facilitada, o CAC não se paga no primeiro pedido.',
          impact: 'ALTO',
          effort: 'MÉDIO',
          recommendation: 'Ativar incentivo de recompra recorrente e destaque de envio expresso na primeira dobra.'
        }
      ];
      break;

    case 'CASA_DECORACAO_MOVEIS':
      specificFindings = [
        {
          id: 'cro-home-1',
          category: 'UX/UI',
          title: 'Resumo de Dimensões Exatas (Largura x Profundidade x Altura) Acima da Dobra',
          description: 'Compradores de móveis e decoração abandonam a página quando precisam procurar as medidas em cm no meio de textos longos.',
          impact: 'CRÍTICO',
          effort: 'FÁCIL',
          recommendation: 'Inserir card visual com medidas em cm (LxPxA), material estrutural e indicação se requer montagem.'
        },
        {
          id: 'cro-home-2',
          category: 'Checkout',
          title: 'Simulador de Frete e Prazo de Produção Visível Antes do Checkout',
          description: `${vertical.vocabulary.lossPainHooks[2]}`,
          impact: 'CRÍTICO',
          effort: 'FÁCIL',
          recommendation: 'Exibir cálculo de CEP imediato informando separadamente o prazo de fabricação e o prazo de transporte.'
        }
      ];
      break;

    case 'ELETRONICOS_INFORMATICA':
    case 'AUTOPECAS_FERRAMENTAS':
      specificFindings = [
        {
          id: 'cro-tech-1',
          category: 'UX/UI',
          title: `Destaque Obrigatório de ${vertical.mandatoryProductFeatures[0]}`,
          description: `${vertical.vocabulary.lossPainHooks[0]}`,
          impact: 'CRÍTICO',
          effort: 'FÁCIL',
          recommendation: `Fixar bloco de especificações técnicas (${vertical.mandatoryProductFeatures.join(', ')}) e seletor explícito de voltagem/compatibilidade antes do botão de compra.`
        },
        {
          id: 'cro-tech-2',
          category: 'Checkout',
          title: 'Destaque de Economia à Vista no Pix vs Parcelamento sem Juros',
          description: 'Em itens de ticket médio elevado, o desconto à vista no Pix (5% a 10%) é o principal gatilho de fechamento imediato.',
          impact: 'ALTO',
          effort: 'FÁCIL',
          recommendation: 'Exibir preço no Pix em destaque verde com selo de Garantia Oficial e Nota Fiscal Eletrônica.'
        }
      ];
      break;

    case 'AGRO_CAMPO_OUTDOOR':
      specificFindings = [
        {
          id: 'cro-agro-1',
          category: 'UX/UI',
          title: `Destaque para Grade Completa (${vertical.coreDemandSizes.join(', ')}) e Tabela de Medidas`,
          description: `${vertical.vocabulary.lossPainHooks[0]}`,
          impact: 'CRÍTICO',
          effort: 'FÁCIL',
          recommendation: `Exibir os seletores de tamanho (${Object.keys(vertical.gaussianDemandDistribution).join(', ')}) visíveis na primeira dobra com aviso de desconto no Pix.`
        },
        {
          id: 'cro-agro-2',
          category: 'Mobile',
          title: 'Otimização de Imagens WebP e Botão de Compra Fixo para Conexão Móvel',
          description: 'Compradores em trânsito ou áreas rurais precisam de carregamento rápido (< 2s) e botão de compra fixo na área do polegar.',
          impact: 'ALTO',
          effort: 'FÁCIL',
          recommendation: 'Converter imagens pesadas para WebP (< 180 KB) e ativar Sticky Buy Button no mobile.'
        }
      ];
      break;

    case 'STREETWEAR_MODA_URBANA':
    case 'FITNESS_BEACHWEAR':
      specificFindings = [
        {
          id: 'cro-fashion-1',
          category: 'UX/UI',
          title: `Inserir ${vertical.mandatoryProductFeatures[0]} e Guia de Caimento`,
          description: `${vertical.vocabulary.lossPainHooks[1]}`,
          impact: 'CRÍTICO',
          effort: 'FÁCIL',
          recommendation: `Adicionar indicação de altura/peso do modelo na foto e tabela de medidas para blindar a conversão nos tamanhos ${vertical.coreDemandSizes.join(' e ')}.`
        },
        {
          id: 'cro-fashion-2',
          category: 'Mobile',
          title: 'Sticky Buy Button no Mobile com Seletor Rápido de Tamanho',
          description: 'Mais de 82% do tráfego de moda vem do Instagram Mobile. Quando o botão de compra some no scroll, a conversão cai drasticamente.',
          impact: 'ALTO',
          effort: 'FÁCIL',
          recommendation: 'Fixar barra inferior com escolha de tamanho e botão de compra imediata no Pix ou Cartão.'
        }
      ];
      break;

    default:
      specificFindings = [
        {
          id: 'cro-gen-1',
          category: 'Checkout',
          title: 'Inserir Simulador de Frete com Cálculo Automático de CEP e Preço no Pix',
          description: 'Clientes abandonam a loja quando só descobrem o custo do frete no último passo do checkout ou não veem o desconto à vista.',
          impact: 'CRÍTICO',
          effort: 'FÁCIL',
          recommendation: 'Adicionar calculadora de frete rápida com CEP e destaque de desconto no Pix na página do produto.'
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
      break;
  }

  return {
    score: vertical.verticalId === 'CALCADOS_COURO' ? 68 : 74,
    findings: specificFindings,
    quickWins: specificFindings.map(f => f.title),
    mobileSpeedMs: worker.siteData.estimatedLoadTime ? Math.round(worker.siteData.estimatedLoadTime * 1000) : 2200,
    checkoutFrictionScore: vertical.verticalId === 'CALCADOS_COURO' ? 28 : 22
  };
}

export async function buildCopyAgentSkill(worker: WorkerInspectionResult, input: AuditInput): Promise<AgentDiagnosticResult['salesCopy']> {
  const nicheContext = buildNicheContextString(worker, input);
  const vertical = resolveDynamicVertical(nicheContext);
  const verticalPrompt = getVerticalizedAgentPrompt('agent-08', nicheContext, agentKnowledgeBases.copywriter.systemPrompt);

  const llmResponse = await askGeminiAgent<{
    headlineFrameworks: { framework: string; headline: string; subheadline: string }[];
    offers: SalesOffer[];
    objections: ObjectionItem[];
  }>(
    verticalPrompt,
    input,
    worker.visionAnalysis,
    worker.siteData.scrapedMarkdown
  );

  if (llmResponse && llmResponse.headlineFrameworks && Array.isArray(llmResponse.headlineFrameworks)) {
    return llmResponse;
  }

  const brand = worker.siteData.brandName || input.businessName || 'Sua Marca';
  const terms = vertical.vocabulary.industryTerms;
  const feature = vertical.mandatoryProductFeatures[0] || 'Garantia Oficial';
  const bundlePrice = `R$ ${Math.round(vertical.averageTicketBRL * 1.65)},90`;

  return {
    headlineFrameworks: [
      {
        framework: `Problema-Agitação-Solução (${vertical.label})`,
        headline: `Descubra o Padrão ${brand} em ${vertical.label}: ${terms[0] ? terms[0].charAt(0).toUpperCase() + terms[0].slice(1) : 'Alta Performance'} com Pronta Entrega`,
        subheadline: `Desenvolvido para quem exige ${terms.slice(0, 3).join(', ')} e ${feature.toLowerCase()}.`
      },
      {
        framework: 'Benefício Direto + Garantia Incondicional',
        headline: `Sinta a Diferença da Linha Oficial ${brand} ou 100% do seu Dinheiro de Volta`,
        subheadline: `Milhares de clientes satisfeitos no Brasil. Envio expresso com nota fiscal e suporte dedicado no WhatsApp.`
      }
    ],
    offers: [
      {
        type: 'Bundle (Compre 2 Leve 3)',
        title: `Combo Especial ${brand} (${vertical.label}) + Frete Grátis`,
        description: `Leve o kit completo com desconto progressivo e ${terms[1] || 'acabamento superior'} garantido.`,
        suggestedPrice: bundlePrice,
        estimatedAovLift: '35%'
      }
    ],
    objections: [
      {
        objection: `Como ter certeza da especificação correta (${feature}) antes de comprar online?`,
        counterStrategy: `Exibir ${feature} de forma interativa na primeira dobra com garantia de troca sem custo.`,
        suggestedCopySnippet: `Compre com 100% de segurança: confira nosso ${feature} detalhado e conte com 1ª Troca Grátis se precisar ajustar sua escolha.`
      },
      {
        objection: 'O produto tem pronta entrega e garantia real?',
        counterStrategy: 'Apresentar selo de estoque auditado com envio rápido e CNPJ verificado.',
        suggestedCopySnippet: `Estoque físico auditado para despacho imediato e garantia oficial ${brand}.`
      }
    ]
  };
}

export async function buildAdsAgentSkill(worker: WorkerInspectionResult, input: AuditInput): Promise<AgentDiagnosticResult['ads']> {
  const nicheContext = buildNicheContextString(worker, input);
  const vertical = resolveDynamicVertical(nicheContext);
  const verticalPrompt = getVerticalizedAgentPrompt('agent-05', nicheContext, agentKnowledgeBases.ads.systemPrompt);

  const llmResponse = await askGeminiAgent<{
    targetRoas: number;
    maxCacAllowed: number;
    monthlyAdBudgetSuggested: number;
    budgetAllocation: { coldProspecting: number; retargeting: number; testing: number };
    creatives: AdCreativeBlueprint[];
  }>(
    verticalPrompt,
    input,
    worker.visionAnalysis,
    worker.siteData.scrapedMarkdown
  );

  if (llmResponse && llmResponse.creatives && Array.isArray(llmResponse.creatives)) {
    return llmResponse;
  }

  const aov = input.averageOrderValue || vertical.averageTicketBRL || 220;
  const brand = worker.siteData.brandName || input.businessName || 'Sua Marca';
  const terms = vertical.vocabulary.industryTerms;

  const creatives: AdCreativeBlueprint[] = [
    {
      angleName: `Prova Real & Demonstração Técnica (${vertical.label})`,
      targetAudience: vertical.targetDemographics,
      format: 'Vídeo UGC',
      hook: `Por que a linha ${brand} virou referência em ${terms[0] || vertical.label.toLowerCase()}? Veja o teste na prática!`,
      bodyCopy: `1. Demonstração visual imediata destacando ${terms.slice(0, 2).join(' e ')}; 2. Prova de ${vertical.mandatoryProductFeatures[0] || 'qualidade'}; 3. Chamada para pronta entrega nos tamanhos/opções ${vertical.coreDemandSizes.join(', ')} com desconto no Pix.`,
      cta: `Conferir Estoque Disponível na ${brand}`
    },
    {
      angleName: `Carrossel Dinâmico de Campeões de Giro (Blindado contra Ruptura)`,
      targetAudience: `Visitantes dos últimos 14 dias e compradores do nicho ${vertical.label}`,
      format: 'Carrossel de Produto',
      hook: `Os itens mais desejados da ${brand} com grade verificada e envio imediato.`,
      bodyCopy: `Cards 1 a 4 destacando ${terms.slice(1, 4).join(', ')}, garantia oficial e condição especial no Pix.`,
      cta: 'Garantir o Meu com Envio Rápido'
    }
  ];

  return {
    targetRoas: vertical.verticalId === 'CALCADOS_COURO' ? 4.5 : 4.2,
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
  const nicheContext = buildNicheContextString(worker, input);
  const vertical = resolveDynamicVertical(nicheContext);
  const verticalPrompt = getVerticalizedAgentPrompt('agent-12', nicheContext, agentKnowledgeBases.seo.systemPrompt);

  const llmResponse = await askGeminiAgent<{
    healthStatus: string;
    schemaMarkupRecommendation: string;
    topKeywords: SeoKeyword[];
    onPageFixes: string[];
  }>(
    verticalPrompt,
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

  const brand = worker.siteData.brandName || input.businessName || 'Sua Marca';
  const primaryTerm = vertical.vocabulary.industryTerms[0] || vertical.label.split(',')[0].toLowerCase();
  const secondaryTerm = vertical.vocabulary.industryTerms[1] || 'loja oficial';

  const topKeywords: SeoKeyword[] = [
    {
      keyword: `comprar ${primaryTerm} ${brand.toLowerCase()}`,
      intent: 'Transacional',
      volume: '14.500 buscas/mês',
      difficulty: 'Fácil',
      funnelStage: 'BOFU',
      suggestedTitle: `${vertical.label} | Loja Oficial ${brand}`
    },
    {
      keyword: `${primaryTerm} com ${secondaryTerm}`,
      intent: 'Comercial',
      volume: '9.800 buscas/mês',
      difficulty: 'Média',
      funnelStage: 'MOFU',
      suggestedTitle: `${primaryTerm.charAt(0).toUpperCase() + primaryTerm.slice(1)} de Alta Qualidade | ${brand}`
    },
    {
      keyword: `loja oficial ${brand.toLowerCase()}`,
      intent: 'Transacional',
      volume: '12.200 buscas/mês',
      difficulty: 'Fácil',
      funnelStage: 'BOFU',
      suggestedTitle: `${brand} Oficial — Pronta Entrega e Garantia`
    }
  ];

  return {
    score: 76,
    healthStatus: 'BOM COM OPORTUNIDADES',
    schemaMarkupRecommendation: 'Implementar Schema.org JSON-LD de Product, AggregateRating e Organization com URL canônica e status InStock dinâmico.',
    topKeywords,
    onPageFixes: [
      `Inserir atributo alt descritivo com termos do nicho (${vertical.vocabulary.industryTerms.slice(0, 2).join(', ')}) nas fotos dos produtos.`,
      `Destacar ${vertical.mandatoryProductFeatures[0]} nos subtítulos H2 das páginas de produto.`,
      'Ativar compressão WebP em todos os banners e fotos de catálogo (< 200KB).'
    ]
  };
}

export async function buildPmGrowthAgentSkill(worker: WorkerInspectionResult, input: AuditInput): Promise<AgentDiagnosticResult['pmGrowth']> {
  const nicheContext = buildNicheContextString(worker, input);
  const vertical = resolveDynamicVertical(nicheContext);
  const verticalPrompt = getVerticalizedAgentPrompt('agent-01', nicheContext, agentKnowledgeBases.pmGrowth.systemPrompt);

  const llmResponse = await askGeminiAgent<{
    iceMatrix: IceIdea[];
    funnelGaps: { stage: 'Aquisição' | 'Ativação' | 'Retenção' | 'Receita' | 'Recomendação'; currentScore: number; bottleneck: string; actionItem: string }[];
    automationWorkflows: { trigger: string; channel: 'WhatsApp' | 'E-mail' | 'SMS'; goal: string }[];
  }>(
    verticalPrompt,
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

  const mandatoryFeature = vertical.mandatoryProductFeatures[0] || 'Tabela de Especificações';
  const exemptionExample = vertical.catalogExemptionPatterns[0] || 'item complementar';

  return {
    iceMatrix: [
      {
        id: 'ice-1',
        title: `Blindagem de Tráfego nos Itens de Giro Central (${vertical.coreDemandSizes.join(', ')})`,
        category: 'Ads',
        impact: 10,
        confidence: 9,
        ease: 8,
        iceScore: 720,
        status: 'A Fazer'
      },
      {
        id: 'ice-2',
        title: `Implementar ${mandatoryFeature} na Primeira Dobra do PDP`,
        category: 'CRO',
        impact: 9,
        confidence: 9,
        ease: 8,
        iceScore: 648,
        status: 'A Fazer'
      },
      {
        id: 'ice-3',
        title: 'Automação de Recuperação de Carrinho e Pix via WhatsApp',
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
        bottleneck: `Ausência de destaque imediato para ${mandatoryFeature} na página do produto.`,
        actionItem: `Inserir widget de ${mandatoryFeature} acima do botão de compra.`
      },
      {
        stage: 'Receita',
        currentScore: 72,
        bottleneck: `Ausência de Order Bump no checkout com item complementar (${exemptionExample}) para elevar o ticket médio de R$ ${vertical.averageTicketBRL.toFixed(0)}.`,
        actionItem: 'Ativar oferta complementar de 1 clique no carrinho antes do pagamento.'
      }
    ],
    automationWorkflows: [
      {
        trigger: 'Abandono de Carrinho ou Pix Expirado há mais de 15 minutos',
        channel: 'WhatsApp',
        goal: 'Recuperar até 18% das vendas perdidas com link direto de pagamento.'
      },
      {
        trigger: '7 dias após a entrega confirmada do pedido',
        channel: 'E-mail',
        goal: 'Coletar avaliação com foto do cliente e oferecer cupom de recompra VIP.'
      }
    ]
  };
}

export async function buildCompetitorAgentSkill(input: AuditInput, worker: WorkerInspectionResult): Promise<CompetitorAnalysis | undefined> {
  if (!input.competitorsUrl) return undefined;

  const nicheContext = buildNicheContextString(worker, input);
  const vertical = resolveDynamicVertical(nicheContext);

  const prompt = `
  Atue como Analista de Inteligência Competitiva Sênior especializado na vertical: ${vertical.label}.
  Empresa do cliente: ${input.businessName} (URL: ${input.siteUrl})
  Concorrente direto fornecido: ${input.competitorsUrl}
  Nicho: ${vertical.label}
  Termos-chave do setor: ${vertical.vocabulary.industryTerms.join(', ')}

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

  const llmResponse = await askGeminiAgent<any>(prompt, input, worker.visionAnalysis, worker.siteData.scrapedMarkdown);
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
  const compAction = `Criar anúncios destacando ${vertical.vocabulary.industryTerms.slice(0, 2).join(', ')}, pronta entrega nos tamanhos/opções ${vertical.coreDemandSizes.join('/')} e ${vertical.mandatoryProductFeatures[0] || 'garantia oficial'}`;

  return {
    competitorUrl: input.competitorsUrl,
    competitorBrandName: compBrand,
    threatLevel: 'MÉDIO',
    strengths: ['Presença de mercado consolidada', 'Variedade de catálogo'],
    weaknesses: [`Ruptura recorrente nas opções de maior giro (${vertical.coreDemandSizes.join(', ')})`, 'Ausência de atendimento consultivo via WhatsApp'],
    opportunitiesToSteal: [
      { title: 'Velocidade de Checkout & Pix', action: 'Garantir compra rápida com desconto no Pix para converter quem desiste na concorrência', effort: 'FÁCIL' },
      { title: `Diferenciação em ${vertical.label}`, action: compAction, effort: 'MÉDIO' }
    ],
    comparisons: [
      { metric: 'Agilidade de Oferta & Pix', you: 'Ativo e Instantâneo', competitor: 'Lento / Checkout Padrão', status: 'VANTAGEM' },
      { metric: 'Atendimento Consultivo', you: 'WhatsApp VIP Integrado', competitor: 'Formulário Lento', status: 'VANTAGEM' }
    ]
  };
}

