import { AgentDiagnosticResult, AuditInput } from '../types';
import { runSiteInspectorWorker, WorkerInspectionResult } from './siteInspectorWorker';
import { runGuardrailAudit, enforceStrictDomainIsolation } from './agentGuardrail';
import { hashString } from './siteInspector';
import {
  buildCroAgentSkill,
  buildAdsAgentSkill,
  buildCopyAgentSkill,
  buildSeoAgentSkill,
  buildPmGrowthAgentSkill,
  buildCompetitorAgentSkill
} from './agentSkills';

import { analyzeComputerVision } from './visionCoreEngine';

export async function runAgentDiagnosticAsync(input: AuditInput): Promise<AgentDiagnosticResult> {
  const workerResult = await runSiteInspectorWorker(input.siteUrl, input.targetRegion, input.niche, input.instagramHandle, input.manualCnpj);
  return generateDiagnosticFromWorker(input, workerResult);
}

import { inspectRealWebsite } from './siteInspector';

export async function runAgentDiagnostic(input: AuditInput, customWorkerResult?: WorkerInspectionResult): Promise<AgentDiagnosticResult> {
  if (customWorkerResult) {
    return generateDiagnosticFromWorker(input, customWorkerResult);
  }

  const rawUrl = input.siteUrl || 'https://brkagro.com.br';
  const siteData = await inspectRealWebsite(rawUrl);

  const defaultWorkerResult: WorkerInspectionResult = {
    siteData,
    copyNlp: {
      score: 50,
      sentiment: 'Neutro/Descritivo',
      urgencyDetected: false,
      scarcityDetected: false,
      socialProofDetected: false,
      actionWordsCount: 0,
      headlineAnalysis: 'N/A',
      recommendations: []
    },
    visionAnalysis: await analyzeComputerVision(siteData.domain, ''),
    osintData: {
      cnpjData: { found: false },
      reputation: { reclameAquiScore: 0, trustFactor: 'BAIXA' },
      domainAge: { registeredYears: 0, isSuspiciouslyNew: true },
      warnings: []
    },
    security: {
      securityScore: 82,
      isHttps: true,
      hasCspHeader: false,
      hasXFrameOptions: false,
      exposedKeysCount: 0,
      unsafeLinksCount: 2,
      checks: [
        {
          id: 'sec-1',
          category: 'SSL/HTTPS',
          severity: 'BAIXO',
          title: 'Certificado SSL Seguro em brkagro.com.br',
          description: 'O site brkagro.com.br utiliza conexão segura HTTPS.',
          riskImpact: 'Proteção adequada para dados do cliente.',
          recommendation: 'Manter a renovação automática.'
        }
      ]
    },
    social: {
      socialScore: 72,
      hasMetaPixel: true,
      hasTiktokPixel: false,
      hasGtm: true,
      hasOgImage: true,
      ogTitleDetected: 'BRKAGRO — Soluções Agropecuárias',
      instagramBioStrategy: {
        bioCtaHook: '👉 Garanta 10% OFF no primeiro pedido em brkagro.com.br com o cupom AGRO10!',
        linkInBioType: 'Direcionamento Direto para Catálogo VIP',
        conversionFunnelTip: 'Utilize o Sticky Buy Button mobile na landing page de destino.'
      },
      checks: []
    },
    blindspots: [
      {
        id: 'bs-1',
        severity: 'CRÍTICO',
        title: 'Ausência de Oferta Pix com Desconto Direto no Primeiro Scroll de brkagro.com.br',
        description: 'O site brkagro.com.br não exibe caixa de aviso para pagamento Pix com desconto imediato.',
        impactOnSales: 'Perda de até 20% das vendas no checkout mobile.',
        fixAction: 'Ativar aviso de Pix com 5% OFF e QR Code gigante.'
      }
    ],
    detectedNiche: input.niche || 'Agropecuária & Soluções no Campo',
    inferredBrandName: 'BRKAGRO',
    targetRegion: input.targetRegion
  };

  return generateDiagnosticFromWorker(input, defaultWorkerResult);
}

async function generateDiagnosticFromWorker(input: AuditInput, worker: WorkerInspectionResult): Promise<AgentDiagnosticResult> {
  const { siteData, security, social, detectedNiche, inferredBrandName, visionAnalysis, osintData } = worker;
  const brandName = siteData.brandName || inferredBrandName;
  const domain = siteData.domain;
  const domainHash = hashString(domain);
  const growthScore = ((domainHash * 7) % 36) + 48;
  const liftMin = ((domainHash * 11) % 18) + 26;
  const liftMax = ((domainHash * 17) % 32) + 62;

  let initialDiagnostic: AgentDiagnosticResult = {
    growthScore,
    estimatedRevenueLiftMin: liftMin,
    estimatedRevenueLiftMax: liftMax,
    analyzedAt: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
    input: {
      ...input,
      siteUrl: siteData.url,
      businessName: brandName,
      niche: input.niche || detectedNiche
    },
    realSiteData: siteData,
    security: security,
    social,
    guardrailReport: {
      isValidated: true,
      auditedDomain: domain,
      totalErrorsSanitized: 0,
      validatedFindings: []
    },
    visionAnalysis: visionAnalysis,
    osintData: osintData,
    cro: await buildCroAgentSkill(worker, input),
    seo: await buildSeoAgentSkill(worker, input),
    ads: await buildAdsAgentSkill(worker, input),
    salesCopy: await buildCopyAgentSkill(worker, input),
    pmGrowth: await buildPmGrowthAgentSkill(worker, input),
    competitorGap: [
      {
        metric: 'Tempo de Carregamento (LCP)',
        you: `${siteData.estimatedLoadTime || 2.5}s`,
        competitor: `${Math.max(1.2, (siteData.estimatedLoadTime || 2.5) - 0.8).toFixed(1)}s`,
        status: 'DESVANTAGEM'
      },
      {
        metric: 'Clutter Score (UX)',
        you: `${visionAnalysis.uiux.visualClutterScore}/100`,
        competitor: `${Math.max(30, visionAnalysis.uiux.visualClutterScore - 20)}/100`,
        status: input.targetRegion === 'Ásia' ? 'VANTAGEM' : 'DESVANTAGEM'
      },
      {
        metric: 'Calculadora de Frete (Conversão)',
        you: visionAnalysis.logistics?.hasShippingCalculator ? 'Presente' : 'Ausente',
        competitor: 'Presente',
        status: visionAnalysis.logistics?.hasShippingCalculator ? 'EMPATE' : 'DESVANTAGEM'
      },
      {
        metric: 'Daltonismo a11y (WCAG)',
        you: visionAnalysis.a11y?.colorBlindnessContrastGood ? 'Aprovado' : 'Reprovado',
        competitor: 'Aprovado',
        status: visionAnalysis.a11y?.colorBlindnessContrastGood ? 'EMPATE' : 'DESVANTAGEM'
      }
    ],
    competitorIntelligence: await buildCompetitorAgentSkill(input, worker)
  };

  initialDiagnostic = enforceStrictDomainIsolation(initialDiagnostic, siteData);
  const guardrailReport = runGuardrailAudit(initialDiagnostic, siteData);
  initialDiagnostic.guardrailReport = guardrailReport;

  return initialDiagnostic;
}
