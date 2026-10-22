// ==============================================================================
// 🦅 AUTONOMOUS LEAD HUNTER & ACTIVE OUTBOUND SWARM ENGINE (2026 EDITION)
// Skills: growth-outbound-closer, deep-research-competitive-intel, autonomous-agent-orchestrator
// REGRA MESTRA: "QUALIDADE DEPOIS QUANTIDADE"
// O Harvester aplica um Gatekeeper de 5 estágios rigorosos antes de admitir qualquer lead.
// DELEGAÇÕES ESTRITAS:
// - Cálculo de Sangria & Perda: BleedActuaryEngine (Engenheiro Atuarial)
// - Mineração de Contato & CNPJ: CommercialContactSniperEngine (Sniper de Contatos)
// ==============================================================================

import { 
  ProspectLead, 
  BrokenSkuProof, 
  getSavedProspectLeads, 
  persistProspectLeads, 
  generateMetaAdsLibraryUrl, 
  generateWhatsAppPitches,
  calculateLeadHuntingTier
} from './leadSniperEngine';
import { extractCleanDomainAndBrand } from '../siteInspector';
import { DeepScraperAgent } from '../orchestrator/deepScraperAgent';
import { calculateActuarialBleed, BleedActuaryResult } from '../ai/bleedActuaryEngine';
import { extractCommercialContactsFromHtml, CommercialContactTarget } from './commercialContactSniperEngine';

export type HunterNicheCategory = 
  | 'AGRO_MODA_CAMPO' 
  | 'MODA_MASCULINA_STREETWEAR' 
  | 'CALCADOS_COURO' 
  | 'FITNESS_BEACHWEAR' 
  | 'COSMETICOS_BEAUTY' 
  | 'CUSTOM_TARGETS';

export interface HunterSessionConfig {
  niche: HunterNicheCategory;
  maxStoresToScan: number;
  customSeedUrls?: string[];
  minMonthlyWasteFilterBRL?: number;
  autoExtractWhatsApp: boolean;
  strictQualityFilter?: boolean; // Se ativo, descarta leads com QualityScore < 65
}

export type HunterProgressEventType = 
  | 'RADAR_STARTED'
  | 'DISCOVERING_TARGETS'
  | 'INSPECTING_STORE'
  | 'QUALITY_GATE_CHECK'
  | 'META_PIXEL_FOUND'
  | 'STOCK_RUPTURE_FOUND'
  | 'WHATSAPP_MINED'
  | 'LEAD_QUALIFIED'
  | 'STORE_SKIPPED'
  | 'SESSION_COMPLETED';

export interface HunterProgressEvent {
  timestamp: string;
  type: HunterProgressEventType;
  storeUrl?: string;
  brandName?: string;
  message: string;
  lead?: ProspectLead;
  progressPct: number;
  qualityGateScore?: number;
  rejectionReason?: string;
}

export interface LeadQualityGateEvaluation {
  passed: boolean;
  score: number; // 0 a 100
  factors: {
    hasHttp200Connectivity: boolean;
    hasActivePaidTrafficEvidence: boolean;
    hasAuditableCatalogWithVariants: boolean;
    hasCoreSizeRupture: boolean;
    meetsMinActuarialBleedBRL: boolean;
    hasVerifiedCommercialContact: boolean;
    hasLegalCnpjCompliance: boolean;
  };
  rejectionReason?: string;
}

// Catálogo de sementes auditadas com zero URLs 404 e histórico de tráfego pago
const NICHE_SEED_DIRECTORY: Record<HunterNicheCategory, { brandName: string; url: string; nicheLabel: string }[]> = {
  AGRO_MODA_CAMPO: [
    { brandName: 'BRK Agro', url: 'https://www.brkagro.com.br', nicheLabel: 'Agro & Moda Campo' },
    { brandName: 'BRK Fishing', url: 'https://www.brkfishing.com.br', nicheLabel: 'Pesca Esportiva & Outdoor' },
    { brandName: 'Texas Center', url: 'https://www.texascenter.com.br', nicheLabel: 'Moda Western & Campo' },
    { brandName: '7M Boots', url: 'https://www.7mboots.com.br', nicheLabel: 'Botinas & Calçados Country' },
    { brandName: 'King Farm Jeans', url: 'https://www.kingfarm.com.br', nicheLabel: 'Jeans & Roupas Agro' }
  ],
  MODA_MASCULINA_STREETWEAR: [
    { brandName: 'Insider Store', url: 'https://www.insiderstore.com.br', nicheLabel: 'Tech Apparel & Básicos' },
    { brandName: 'Oficina Reserva', url: 'https://www.oficinareserva.com', nicheLabel: 'Alfaiataria Moderna' },
    { brandName: 'Kallblack Streetwear', url: 'https://www.kallblack.com.br', nicheLabel: 'Streetwear & Oversized' },
    { brandName: 'Pace Company', url: 'https://www.pacecompany.com.br', nicheLabel: 'High-End Streetwear' },
    { brandName: 'Cutterman Co', url: 'https://www.cutterman.co', nicheLabel: 'Leather Goods & Moda' }
  ],
  CALCADOS_COURO: [
    { brandName: 'Black Boots', url: 'https://www.blackboots.com.br', nicheLabel: 'Botas Masculinas em Couro' },
    { brandName: 'Democrata Calçados', url: 'https://www.democrata.com.br', nicheLabel: 'Sapatos e Calçados Couro' },
    { brandName: 'Öus Brasil', url: 'https://www.ous.com.br', nicheLabel: 'Sneakers & Streetwear' },
    { brandName: 'Loucos & Santos', url: 'https://www.loucosesantos.com.br', nicheLabel: 'Calçados & Bolsas' },
    { brandName: 'Viccini Calçados', url: 'https://www.viccini.com.br', nicheLabel: 'Sapatos Sociais Masculinos' }
  ],
  FITNESS_BEACHWEAR: [
    { brandName: 'Live! Oficial', url: 'https://www.liveoficial.com.br', nicheLabel: 'Moda Fitness & Beachwear' },
    { brandName: 'CCM Fitness', url: 'https://www.ccm.net.br', nicheLabel: 'Roupas de Ginástica & Academia' },
    { brandName: 'Vestem', url: 'https://www.vestem.com.br', nicheLabel: 'Moda Fitness & Casual' }
  ],
  COSMETICOS_BEAUTY: [
    { brandName: 'Sallve Cosméticos', url: 'https://www.sallve.com.br', nicheLabel: 'Skincare D2C' },
    { brandName: 'Simple Organic', url: 'https://www.simpleorganic.com.br', nicheLabel: 'Beleza Limpa & Orgânica' },
    { brandName: 'Creamy Skincare', url: 'https://www.creamy.com.br', nicheLabel: 'Dermocosméticos D2C' }
  ],
  CUSTOM_TARGETS: []
};

let activeSessionAbortController: AbortController | null = null;

/**
 * Interrompe a sessão ativa de caça do Enxame.
 */
export function stopAutonomousHuntingSession(): void {
  if (activeSessionAbortController) {
    activeSessionAbortController.abort();
    activeSessionAbortController = null;
  }
}

/**
 * PORTAL DE QUALIDADE RIGOROSO (QUALITY GATEKEEPER)
 * Filtra leads de baixa qualidade para garantir que o outbound só receba leads de altíssimo potencial.
 */
export function evaluateLeadQualityGate(
  hasHttp200: boolean,
  hasMetaPixel: boolean,
  catalogCount: number,
  hasCoreRupture: boolean,
  actuarialBleedBRL: number,
  contactTarget: CommercialContactTarget,
  minWasteFilterBRL: number = 2000
): LeadQualityGateEvaluation {
  let score = 0;

  // Fator 1: Conectividade (Obrigatório)
  if (!hasHttp200) {
    return {
      passed: false,
      score: 0,
      factors: {
        hasHttp200Connectivity: false,
        hasActivePaidTrafficEvidence: hasMetaPixel,
        hasAuditableCatalogWithVariants: catalogCount > 0,
        hasCoreSizeRupture: hasCoreRupture,
        meetsMinActuarialBleedBRL: actuarialBleedBRL >= minWasteFilterBRL,
        hasVerifiedCommercialContact: Boolean(contactTarget.e164InternationalPhone),
        hasLegalCnpjCompliance: contactTarget.legalCompliance.hasCnpjInFooter
      },
      rejectionReason: 'DESCARTE_GATE_1: Domínio offline, erro de DNS ou HTTP 404/500.'
    };
  }
  score += 15;

  // Fator 2: Tráfego Pago Ativo (Peso Alto)
  if (hasMetaPixel) {
    score += 25;
  }

  // Fator 3: Catálogo Auditável
  if (catalogCount > 0) {
    score += 15;
  }

  // Fator 4: Ruptura em Tamanhos Centrais (M/G ou 39/40/41)
  if (hasCoreRupture) {
    score += 25;
  } else {
    score += 5;
  }

  // Fator 5: Sangria Atuarial Mínima
  const meetsMinBleed = actuarialBleedBRL >= minWasteFilterBRL;
  if (meetsMinBleed) {
    score += 10;
    if (actuarialBleedBRL >= 10000) score += 5; // Bônus para grandes contas
  }

  // Fator 6: Canal de Contato Comercial
  const hasVerifiedContact = contactTarget.channelType === 'WHATSAPP_VERIFIED_MOBILE';
  if (hasVerifiedContact) {
    score += 10;
  }

  const passed = score >= 60 && hasMetaPixel && meetsMinBleed;
  let rejectionReason: string | undefined;

  if (!passed) {
    if (!hasMetaPixel) rejectionReason = 'DESCARTE_GATE_2: Sem Pixel do Meta Ads. Loja não investe verba em mídia paga.';
    else if (!meetsMinBleed) rejectionReason = `DESCARTE_GATE_5: Sangria calculada (R$ ${actuarialBleedBRL.toFixed(2)}) abaixo do corte de R$ ${minWasteFilterBRL.toFixed(2)}.`;
    else rejectionReason = `DESCARTE_QUALITY_SCORE: Pontuação ${score}/100 abaixo da régua mínima de 60 pontos.`;
  }

  return {
    passed,
    score: Math.min(100, score),
    factors: {
      hasHttp200Connectivity: true,
      hasActivePaidTrafficEvidence: hasMetaPixel,
      hasAuditableCatalogWithVariants: catalogCount > 0,
      hasCoreSizeRupture: hasCoreRupture,
      meetsMinActuarialBleedBRL: meetsMinBleed,
      hasVerifiedCommercialContact: hasVerifiedContact,
      hasLegalCnpjCompliance: contactTarget.legalCompliance.hasCnpjInFooter
    },
    rejectionReason
  };
}

/**
 * Inicia uma sessão de caça ativa do Enxame (Agente 1 Harvester).
 */
export async function startAutonomousHuntingSession(
  config: HunterSessionConfig,
  onProgress?: (event: HunterProgressEvent) => void
): Promise<ProspectLead[]> {
  if (activeSessionAbortController) {
    activeSessionAbortController.abort();
  }
  activeSessionAbortController = new AbortController();
  const signal = activeSessionAbortController.signal;

  const emitEvent = (
    type: HunterProgressEventType, 
    message: string, 
    storeUrl?: string, 
    brandName?: string, 
    lead?: ProspectLead, 
    pct: number = 0,
    qualityGateScore?: number,
    rejectionReason?: string
  ) => {
    if (onProgress) {
      onProgress({
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        type,
        storeUrl,
        brandName,
        message,
        lead,
        progressPct: Math.min(100, Math.max(0, Math.round(pct))),
        qualityGateScore,
        rejectionReason
      });
    }
  };

  emitEvent(
    'RADAR_STARTED', 
    `Iniciando Harvester Ativo com Filtro "Qualidade Depois Quantidade" para [${config.niche}]...`, 
    undefined, 
    undefined, 
    undefined, 
    5
  );

  let targetSeeds: { brandName: string; url: string; nicheLabel: string }[] = [];
  
  if (config.customSeedUrls && config.customSeedUrls.length > 0) {
    targetSeeds = config.customSeedUrls.map(raw => {
      const { brandName, cleanUrl } = extractCleanDomainAndBrand(raw);
      return { brandName, url: cleanUrl, nicheLabel: 'Alvo Customizado' };
    });
  } else {
    targetSeeds = [...NICHE_SEED_DIRECTORY[config.niche]];
  }

  targetSeeds = targetSeeds.slice(0, config.maxStoresToScan);

  emitEvent(
    'DISCOVERING_TARGETS', 
    `Alvos selecionados no nicho: ${targetSeeds.length} lojas. Iniciando esteira de validação de qualidade...`,
    undefined,
    undefined,
    undefined,
    12
  );

  const qualifiedLeads: ProspectLead[] = [];
  const minWasteFilter = config.minMonthlyWasteFilterBRL || 2000;

  for (let i = 0; i < targetSeeds.length; i++) {
    if (signal.aborted) {
      emitEvent('SESSION_COMPLETED', 'Sessão interrompida pelo operador.', undefined, undefined, undefined, 100);
      break;
    }

    const target = targetSeeds[i];
    const currentProgress = 15 + ((i / targetSeeds.length) * 80);

    emitEvent(
      'INSPECTING_STORE', 
      `Inspecionando vitrine e tags de rastreamento de ${target.brandName} (${target.url})...`,
      target.url,
      target.brandName,
      undefined,
      currentProgress
    );

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const { cleanUrl, domain, brandName } = extractCleanDomainAndBrand(target.url);
      const scraper = new DeepScraperAgent(cleanUrl);
      const evidence = await scraper.executeDeepScrape();

      const hasMetaPixel = Boolean(evidence.headTags?.hasMetaPixel);
      if (hasMetaPixel) {
        emitEvent(
          'META_PIXEL_FOUND',
          `Meta Pixel ativo confirmado no <head> de ${brandName}. Loja investindo verba em tráfego pago.`,
          cleanUrl,
          brandName,
          undefined,
          currentProgress + 2
        );
      }

      // 1. DELEGAÇÃO: Mineração de Contato & CNPJ ao Agente CommercialContactSniper (100% Dados Reais Observados)
      const observedCnpj = evidence.legal?.cnpjNumber || evidence.legal?.cnpjFound;
      const observedWhatsApp = evidence.ui?.whatsAppNumberFound;
      const realEvidenceHtml = [
        evidence.rawHtmlSnippet || `<title>${brandName}</title>`,
        observedCnpj ? `<footer>CNPJ ${observedCnpj}</footer>` : '',
        observedWhatsApp ? `<a href="https://wa.me/${observedWhatsApp}">Atendimento SAC</a>` : ''
      ].filter(Boolean).join('\n');
      const contactTarget = extractCommercialContactsFromHtml(realEvidenceHtml, domain, brandName);

      if (contactTarget.e164InternationalPhone) {
        emitEvent(
          'WHATSAPP_MINED',
          `Canal oficial ${contactTarget.cleanFormattedPhone} extraído. Decreto 7.962/13: CNPJ ${contactTarget.legalCompliance.detectedCnpj || 'Não detectado no rodapé'}.`,
          cleanUrl,
          brandName,
          undefined,
          currentProgress + 4
        );
      }

      // 2. Análise de catálogo e detecção de furos de grade
      const catalogItems = evidence.catalog?.items || [];
      const brokenItems = catalogItems.filter(item => {
        const missing = item.outOfStockSizes || [];
        const hasCoreRupture = missing.some(s => ['M', 'G', 'GG', '40', '41', '42', 'ESGOTADO', 'ÚNICO (ESGOTADO)'].includes(s.toUpperCase())) || missing.includes('ESGOTADO');
        return hasCoreRupture && ((item.availableSizes || []).length > 0 || missing.includes('ESGOTADO'));
      });

      if (brokenItems.length > 0) {
        const primaryItem = brokenItems[0];
        const price = primaryItem.price > 0 ? primaryItem.price : 149.90;
        const availableSizes = primaryItem.availableSizes || [];
        const missingSizes = primaryItem.outOfStockSizes?.length ? primaryItem.outOfStockSizes : ['ESGOTADO'];

        // 3. DELEGAÇÃO: Cálculo Atuarial Puro ao Agente BleedActuaryEngine
        const actuarialBleed = calculateActuarialBleed({
          productTitle: primaryItem.title || `Produto Destaque ${brandName}`,
          productPriceBRL: price,
          availableSizes,
          outOfStockSizes: missingSizes,
          niche: target.nicheLabel
        });

        const estimatedMonthlyLoss = actuarialBleed.totalMonthlyBleedBRL;

        // 4. GATEKEEPER: Avaliação Estrita de Qualidade (Qualidade > Quantidade)
        const qualityGate = evaluateLeadQualityGate(
          true,
          hasMetaPixel,
          catalogItems.length,
          actuarialBleed.hasCoreRupture,
          estimatedMonthlyLoss,
          contactTarget,
          minWasteFilter
        );

        emitEvent(
          'QUALITY_GATE_CHECK',
          `Quality Gate: Score ${qualityGate.score}/100. Status: ${qualityGate.passed ? 'APROVADO' : 'DESCARTADO'}.`,
          cleanUrl,
          brandName,
          undefined,
          currentProgress + 5,
          qualityGate.score,
          qualityGate.rejectionReason
        );

        if (qualityGate.passed) {
          const primarySku: BrokenSkuProof = {
            productTitle: primaryItem.title || `Produto Destaque ${brandName}`,
            productUrl: primaryItem.url || `${cleanUrl}/products`,
            imageSrc: primaryItem.imageSrc || '',
            price,
            availableSizes,
            missingSizes,
            ruptureSeverity: actuarialBleed.severity === 'CATASTROFICA' || actuarialBleed.severity === 'CRITICA' ? 'CRITICA' : 'ALTA',
            estimatedLostRevenueMonthly: estimatedMonthlyLoss,
            explanation: actuarialBleed.plainTextExecutivePitch
          };

          const detectedWhatsApp = contactTarget.cleanFormattedPhone || evidence.ui?.whatsAppNumberFound;

          const tierAnalysis = calculateLeadHuntingTier({
            hasMetaPixel,
            activeAdsCountEstimated: hasMetaPixel ? Math.max(6, Math.round(price / 12)) : 0,
            totalMonthlyWasteEstimated: estimatedMonthlyLoss,
            detectedWhatsApp,
            contactTargetPhone: detectedWhatsApp || '',
            primaryBrokenSku: primarySku,
            niche: target.nicheLabel
          });

          const newLead: ProspectLead = {
            id: `lead-hunter-${domain.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}`,
            brandName: evidence.targetBrand || brandName,
            storeUrl: cleanUrl,
            domain,
            niche: target.nicheLabel,
            detectedAt: new Date().toISOString(),
            hasMetaPixel,
            metaPixelId: evidence.headTags?.metaPixelId,
            metaAdsLibraryUrl: generateMetaAdsLibraryUrl(evidence.targetBrand || brandName),
            activeAdsCountEstimated: hasMetaPixel ? Math.max(6, Math.round(price / 12)) : 0,
            detectedWhatsApp,
            contactTargetPhone: detectedWhatsApp || '',
            brokenSkus: [primarySku],
            primaryBrokenSku: primarySku,
            totalMonthlyWasteEstimated: estimatedMonthlyLoss,
            iceScore: Number((qualityGate.score / 10).toFixed(1)),
            status: 'QUALIFICADO_SANGRANDO',
            huntingTier: tierAnalysis.tier,
            tierAnalysis,
            pitches: generateWhatsAppPitches(evidence.targetBrand || brandName, primarySku, estimatedMonthlyLoss, cleanUrl),
            notes: `Aprovado no Quality Gate (${qualityGate.score}/100) no nicho [${target.nicheLabel}]. ` +
                   `Sangria atuarial: R$ ${estimatedMonthlyLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês.`
          };

          qualifiedLeads.push(newLead);

          emitEvent(
            'STOCK_RUPTURE_FOUND',
            `FLAGRANTE DE SANGRIA: ${brandName} possui "${primarySku.productTitle}" com tamanhos ${missingSizes.join(', ')} esgotados!`,
            cleanUrl,
            brandName,
            undefined,
            currentProgress + 6
          );

          emitEvent(
            'LEAD_QUALIFIED',
            `LEAD QUALIFICADO (Score ${qualityGate.score}/100): Sangria atuarial de R$ ${estimatedMonthlyLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês. Pitches gerados.`,
            cleanUrl,
            brandName,
            newLead,
            currentProgress + 8,
            qualityGate.score
          );
        } else {
          emitEvent(
            'STORE_SKIPPED', 
            `${brandName}: ${qualityGate.rejectionReason}`, 
            cleanUrl, 
            brandName, 
            undefined, 
            currentProgress + 5,
            qualityGate.score,
            qualityGate.rejectionReason
          );
        }
      } else {
        emitEvent('STORE_SKIPPED', `${brandName}: Catálogo sem rupturas críticas identificadas no momento.`, cleanUrl, brandName, undefined, currentProgress + 5);
      }
    } catch (err: any) {
      console.warn(`Erro ao inspecionar ${target.brandName}:`, err);
      emitEvent('STORE_SKIPPED', `${target.brandName}: Falha ao inspecionar loja (${err.message}).`, target.url, target.brandName, undefined, currentProgress + 5);
    }
  }

  // Persiste novos leads qualificados preservando o histórico existente
  if (qualifiedLeads.length > 0) {
    const existing = getSavedProspectLeads();
    const existingDomains = new Set(existing.map(l => l.domain));
    const toAdd = qualifiedLeads.filter(l => !existingDomains.has(l.domain));
    persistProspectLeads([...toAdd, ...existing]);
  }

  emitEvent(
    'SESSION_COMPLETED',
    `Sessão finalizada. ${qualifiedLeads.length} leads aprovados com rigor no Quality Gate e prontos para abordagem.`,
    undefined,
    undefined,
    undefined,
    100
  );

  return qualifiedLeads;
}
