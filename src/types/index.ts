import { RealSiteData } from '../services/siteInspector';
import { SecurityAuditResult } from '../services/securityInspector';
import { SocialAuditResult } from '../services/socialInspector';
import { GuardrailValidationReport } from '../services/agentGuardrail';
import { VisionAnalysisResult } from '../services/visionCoreEngine';
import { OsintAnalysisResult } from '../services/osintEngine';

export type BusinessType = 'ecommerce' | 'saas' | 'infoproduct' | 'leadgen' | 'landing_page';

export type MainChallenge = 
  | 'low_conversion' 
  | 'low_traffic' 
  | 'bad_roas' 
  | 'cart_abandonment' 
  | 'low_repurchase' 
  | 'pricing_friction';

export type TargetRegion = 'Brasil' | 'Ásia' | 'Europa' | 'EUA' | 'Global';

export interface AuditInput {
  siteUrl: string;
  businessName: string;
  businessType: BusinessType;
  niche: string;
  monthlyRevenue: string;
  averageOrderValue: number;
  mainChallenge: MainChallenge;
  targetAudience?: string;
  competitorsUrl?: string;
  primaryGoal?: string;
  instagramHandle?: string;
  targetRegion: TargetRegion;
  grossMargin: number;
  manualCnpj?: string;
}

export interface CroFinding {
  id: string;
  category: 'UX/UI' | 'Velocidade' | 'Checkout' | 'Social Proof' | 'Mobile';
  title: string;
  description: string;
  impact: 'ALTO' | 'MÉDIO' | 'CRÍTICO';
  effort: 'FÁCIL' | 'MÉDIO' | 'COMPLEXO';
  recommendation: string;
}

export interface SeoKeyword {
  keyword: string;
  intent: 'Informativa' | 'Comercial' | 'Transacional';
  volume: string;
  difficulty: 'Fácil' | 'Média' | 'Difícil';
  funnelStage: 'TOFU' | 'MOFU' | 'BOFU';
  suggestedTitle: string;
}

export interface AdCreativeBlueprint {
  angleName: string;
  targetAudience: string;
  format: 'Vídeo UGC' | 'Carrossel de Produto' | 'Imagem Estática Minimalista' | 'Depoimento / Prova';
  hook: string;
  bodyCopy: string;
  cta: string;
}

export interface SalesOffer {
  type: 'Order Bump' | 'Bundle (Compre 2 Leve 3)' | 'Upsell Pós-Compra' | 'Downsell';
  title: string;
  description: string;
  suggestedPrice: string;
  estimatedAovLift: string;
}

export interface ObjectionItem {
  objection: string;
  counterStrategy: string;
  suggestedCopySnippet: string;
}

export interface IceIdea {
  id: string;
  title: string;
  category: 'CRO' | 'SEO' | 'Ads' | 'Copy' | 'Retenção';
  impact: number;
  confidence: number;
  ease: number;
  iceScore: number;
  status: 'A Fazer' | 'Em Teste' | 'Concluído';
}

export interface CompetitorAnalysis {
  competitorUrl: string;
  competitorBrandName: string;
  threatLevel: 'BAIXO' | 'MÉDIO' | 'ALTO' | 'EXTREMO';
  strengths: string[];
  weaknesses: string[];
  opportunitiesToSteal: {
    title: string;
    action: string;
    effort: 'FÁCIL' | 'MÉDIO' | 'COMPLEXO';
  }[];
  comparisons: {
    metric: string;
    you: string;
    competitor: string;
    status: 'VANTAGEM' | 'DESVANTAGEM' | 'EMPATE';
  }[];
}

export interface AgentDiagnosticResult {
  growthScore: number;
  estimatedRevenueLiftMin: number;
  estimatedRevenueLiftMax: number;
  analyzedAt: string;
  input: AuditInput;
  realSiteData: RealSiteData;
  security: SecurityAuditResult;
  social: SocialAuditResult;
  guardrailReport: GuardrailValidationReport;
  visionAnalysis: VisionAnalysisResult;
  osintData: OsintAnalysisResult;
  cro: {
    score: number;
    findings: CroFinding[];
    mobileSpeedMs: number;
    checkoutFrictionScore: number;
    quickWins: string[];
  };
  seo: {
    score: number;
    healthStatus: string;
    topKeywords: SeoKeyword[];
    schemaMarkupRecommendation: string;
    onPageFixes: string[];
  };
  ads: {
    targetRoas: number;
    maxCacAllowed: number;
    monthlyAdBudgetSuggested: number;
    budgetAllocation: {
      coldProspecting: number;
      retargeting: number;
      testing: number;
    };
    creatives: AdCreativeBlueprint[];
  };
  salesCopy: {
    copyNlpAnalysis?: any;
    headlineFrameworks: {
      framework: string;
      headline: string;
      subheadline: string;
    }[];
    offers: SalesOffer[];
    objections: ObjectionItem[];
  };
  pmGrowth: {
    iceMatrix: IceIdea[];
    funnelGaps: {
      stage: 'Aquisição' | 'Ativação' | 'Retenção' | 'Receita' | 'Recomendação';
      currentScore: number;
      bottleneck: string;
      actionItem: string;
    }[];
    automationWorkflows: {
      trigger: string;
      channel: 'WhatsApp' | 'E-mail' | 'SMS';
      goal: string;
    }[];
  };
  competitorGap: {
    metric: string;
    you: string;
    competitor: string;
    status: 'VANTAGEM' | 'DESVANTAGEM' | 'EMPATE';
  }[];
  competitorIntelligence?: CompetitorAnalysis;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  agentPersona?: 'CRO' | 'SEO' | 'Ads' | 'Copywriter' | 'PM' | 'Orquestrador';
  text: string;
  timestamp: string;
}

export * from './swarmAgentContract';

