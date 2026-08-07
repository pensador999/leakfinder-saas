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

  // Fallback heurístico
  const croFindings: CroFinding[] = [{
    id: 'cro-fallback',
    category: 'Checkout',
    title: 'Adicionar Simulador de Frete',
    description: 'Nenhum simulador de frete visível. Falha na API do LLM.',
    impact: 'CRÍTICO',
    effort: 'FÁCIL',
    recommendation: 'Adicione calculadora na página.'
  }];

  return {
    score: 55,
    findings: croFindings,
    quickWins: ['Falha LLM - Usando Fallback Heurístico'],
    mobileSpeedMs: worker.siteData.estimatedLoadTime ? worker.siteData.estimatedLoadTime * 1000 : 2500,
    checkoutFrictionScore: 20
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
    return {
      headlineFrameworks: llmResponse.headlineFrameworks,
      offers: llmResponse.offers || [],
      objections: llmResponse.objections || []
    };
  }

  // Fallback
  return {
    headlineFrameworks: [{ framework: 'PAS', headline: 'Produto Incrível que Resolve seu Problema', subheadline: 'Compre hoje com desconto.' }],
    offers: [{ type: 'Bundle (Compre 2 Leve 3)', title: 'Oferta Fallback', description: 'Garantia de 7 dias', suggestedPrice: '10', estimatedAovLift: '10%' }],
    objections: []
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

  if (llmResponse && llmResponse.budgetAllocation) {
    return {
      targetRoas: llmResponse.targetRoas,
      maxCacAllowed: llmResponse.maxCacAllowed,
      monthlyAdBudgetSuggested: llmResponse.monthlyAdBudgetSuggested || (input.averageOrderValue * 60),
      budgetAllocation: llmResponse.budgetAllocation,
      creatives: llmResponse.creatives || []
    };
  }

  return {
    targetRoas: 3,
    maxCacAllowed: input.averageOrderValue * (input.grossMargin / 100),
    monthlyAdBudgetSuggested: input.averageOrderValue * 60,
    budgetAllocation: { coldProspecting: 70, retargeting: 20, testing: 10 },
    creatives: []
  };
}

export async function buildSeoAgentSkill(worker: WorkerInspectionResult, input: AuditInput): Promise<AgentDiagnosticResult['seo']> {
  const llmResponse = await askGeminiAgent<{
    healthStatus: 'CRÍTICO' | 'BOM' | 'EXCELENTE';
    schemaMarkupRecommendation: string;
    topKeywords: SeoKeyword[];
    onPageFixes: string[];
  }>(
    agentKnowledgeBases.seo.systemPrompt,
    input,
    worker.visionAnalysis,
    worker.siteData.scrapedMarkdown
  );

  if (llmResponse && llmResponse.healthStatus) {
    return {
      score: 78,
      ...llmResponse
    };
  }

  return {
    score: 50,
    healthStatus: 'CRÍTICO',
    schemaMarkupRecommendation: 'Adicionar Product Schema.',
    topKeywords: [],
    onPageFixes: ['Otimizar LCP']
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

  return {
    iceMatrix: [],
    funnelGaps: [],
    automationWorkflows: []
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

  // Fallback
  return {
    competitorUrl: input.competitorsUrl,
    competitorBrandName: 'Concorrente Desconhecido',
    threatLevel: 'MÉDIO',
    strengths: ['Presença estabelecida', 'Audiência aquecida'],
    weaknesses: ['Falta de personalização', 'Velocidade mobile ruim'],
    opportunitiesToSteal: [
      { title: 'Ataque em Mobile', action: 'Garantir velocidade menor que 2s para ganhar em Core Web Vitals', effort: 'MÉDIO' }
    ],
    comparisons: [
      { metric: 'Agilidade de Oferta', you: 'Dinâmico', competitor: 'Lento', status: 'VANTAGEM' }
    ]
  };
}

