// ==============================================================================
// 🏢 ADSHIELD BATCH PROSPECTING & MASS AUDITOR ENGINE FOR AGENCIES (LOCAL-FIRST)
// Audits up to 50 e-commerce domains with controlled concurrency (CONCURRENCY=2),
// extracts the #1 broken SKU, calibrates by vertical, and ranks leads by bleed.
// ==============================================================================

import { extractCleanDomainAndBrand, inspectRealWebsite, isCatalogProductBroken } from '../siteInspector';
import { calculateStoreFinancialGrounding, formatBRL } from '../ai/storeFinancialGroundingEngine';
import { auditSupplyChainDiscrepancy } from '../supplyChain/erpHubDiscrepancyEngine';
import { resolveDynamicVertical } from '../ai/dynamicVerticalContext';
import { saveLead } from '../whatsappLeadService';

export interface BatchProspectingLead {
  id: string;
  domain: string;
  url: string;
  brandName: string;
  status: 'PENDING' | 'AUDITING' | 'COMPLETED' | 'ERROR';
  platform: string;
  verticalLabel: string;
  totalProductsScanned: number;
  totalSkusAudited: number;
  monthlyAdWasteBRL: number;
  brokenSkusCount: number;
  topBrokenProductTitle?: string;
  topBrokenProductUrl?: string;
  topBrokenSizes?: string[];
  hasCnpjInFooter: boolean;
  dealPriority: 'ALTÍSSIMA_OPORTUNIDADE' | 'ALTA' | 'MODERADA' | 'GRADE_BLINDADA';
  closingArgument: string;
  whatsAppPitchScript: string;
  pdfDossierUrl: string;
}

export interface BatchAuditProgress {
  total: number;
  completed: number;
  currentDomain: string;
  totalMonthlyWasteIdentifiedBRL: number;
  highPriorityDealsCount: number;
}

const BATCH_STORAGE_KEY = 'adshield_batch_prospecting_results_v1';

export function getSavedBatchProspectingLeads(): BatchProspectingLead[] {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    const raw = window.localStorage.getItem(BATCH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearSavedBatchProspectingLeads(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(BATCH_STORAGE_KEY);
    }
  } catch {
    // Non-fatal
  }
}

function persistBatchProspectingLeads(leads: BatchProspectingLead[]): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(leads));
    }
  } catch {
    // Non-fatal
  }
}

/**
 * Parses raw text input (comma-separated, newlines, or CSV) into clean URL list
 */
export function parseDomainListInput(rawText: string): string[] {
  const lines = rawText.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
  const cleanUrls = lines.map(line => {
    const u = line.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    return u;
  }).filter(u => u.includes('.') && u.length > 3);

  // Return unique domains up to 50
  return Array.from(new Set(cleanUrls)).slice(0, 50);
}

/**
 * Saves a BatchProspectingLead into the Local-First CRM (ADSHIELD_CAPTURED_LEADS)
 */
export function saveBatchLeadToLocalCrm(lead: BatchProspectingLead, phone: string = '5511999999999') {
  return saveLead({
    merchantName: `Diretoria ${lead.brandName}`,
    whatsappNumber: phone,
    storeUrl: lead.url,
    brandName: lead.brandName,
    estimatedLossRevenue: Math.round(lead.monthlyAdWasteBRL),
    growthScore: lead.brokenSkusCount > 10 ? 64 : lead.brokenSkusCount > 0 ? 74 : 92,
    source: 'BATCH_AUDITOR',
    topBrokenSku: lead.topBrokenProductTitle
      ? `${lead.topBrokenProductTitle}${lead.topBrokenSizes && lead.topBrokenSizes.length > 0 ? ` (${lead.topBrokenSizes.slice(0, 4).join(', ')})` : ''}`
      : undefined,
    customPitch: lead.whatsAppPitchScript
  });
}

async function auditSingleDomainForBatch(
  rawDomain: string,
  index: number,
  agencyName: string
): Promise<BatchProspectingLead> {
  const { domain, brandName } = extractCleanDomainAndBrand(rawDomain);

  try {
    const realSite = await inspectRealWebsite(domain);
    const finances = calculateStoreFinancialGrounding(realSite);
    const supplyChain = auditSupplyChainDiscrepancy(realSite);

    const cat = realSite.catalogAudit;
    const issues = cat?.issues || [];
    const brokenItems = issues.filter(isCatalogProductBroken);
    const topBroken = brokenItems[0];
    const topBrokenSizes =
      topBroken?.brokenCoreSizes && topBroken.brokenCoreSizes.length > 0
        ? topBroken.brokenCoreSizes
        : (topBroken?.missingSizes || []).filter(s => s !== 'ARQUIVO (ESGOTADO)');

    const vertical = resolveDynamicVertical(`${realSite.title || ''} ${domain} ${issues.slice(0, 10).map(x => x.productTitle).join(' ')}`);

    const brokenSkusCount = cat?.productsWithBrokenGrid ?? brokenItems.length ?? finances.brokenSkusCount;
    const adWaste = Math.round(
      cat?.monthlyLossEstimateBRL ||
      supplyChain.financialImpactSummary.monthlyAdWasteBRL ||
      finances.financialRisk.adWasteMonthly ||
      0
    );

    let dealPriority: BatchProspectingLead['dealPriority'] = 'MODERADA';
    if (adWaste >= 2500 || brokenSkusCount >= 2) {
      dealPriority = 'ALTÍSSIMA_OPORTUNIDADE';
    } else if (adWaste > 800 || brokenSkusCount === 1) {
      dealPriority = 'ALTA';
    } else {
      dealPriority = brokenSkusCount === 0 ? 'GRADE_BLINDADA' : 'MODERADA';
    }

    const skuContextLine =
      brokenSkusCount > 0 && topBroken
        ? `identificamos *${brokenSkusCount} produto(s)* da linha ativa com ruptura na curva central de giro — em especial o item *"${topBroken.productTitle}"* (${topBroken.productUrl}), que está com ${topBrokenSizes.length > 0 ? `as opções *[${topBrokenSizes.join(', ')}] esgotadas*` : 'ruptura operacional'} na vitrine.`
        : `mapeamos *${cat?.totalProductsScanned || issues.length} produtos* e *${cat?.totalSkusAudited || 0} SKUs* na vitrine de ${domain} com oportunidades de otimização de conversão (Pix e Checkout).`;

    const hasCnpj = realSite.legalCompliance ? realSite.legalCompliance.hasCnpjInFooter : true;
    const cnpjNote = !hasCnpj
      ? `\n⚠️ *Nota de Compliance:* Também detectamos ausência de CNPJ visível no rodapé HTML (risco Decreto 7.962/13 e reprovação no Google Merchant).`
      : '';

    const pitchScript = `Olá time da *${realSite.brandName || brandName}*! Tudo bem?\n\nAqui é da inteligência comercial da *${agencyName}*. Rodamos uma auditoria técnica em *${domain}* (${vertical.label}) e ${skuContextLine}${cnpjNote}\n\n💸 *Impacto Financeiro Auditado:* Estimamos um vazamento de *~${formatBRL(adWaste)}/mês* em tráfego e conversão na vitrine atual.\n\nGeramos um Dossiê Técnico em PDF com a lista exata dos SKUs afetados e o plano de 48h para estancar essa perda. Posso enviar o relatório por aqui?`;

    return {
      id: `lead-${index + 1}-${domain}`,
      domain,
      url: realSite.url || `https://${domain}`,
      brandName: realSite.brandName || brandName,
      status: 'COMPLETED',
      platform: realSite.ecommercePlatform || 'E-Commerce D2C',
      verticalLabel: vertical.label,
      totalProductsScanned: cat?.totalProductsScanned || issues.length,
      totalSkusAudited: cat?.totalSkusAudited || issues.length,
      monthlyAdWasteBRL: adWaste,
      brokenSkusCount,
      topBrokenProductTitle: topBroken?.productTitle,
      topBrokenProductUrl: topBroken?.productUrl,
      topBrokenSizes,
      hasCnpjInFooter: hasCnpj,
      dealPriority,
      closingArgument:
        brokenSkusCount > 0 && topBroken
          ? `Ruptura real em "${topBroken.productTitle}" (${topBrokenSizes.join(', ') || 'Esgotado'}) drenando ${formatBRL(adWaste)}/mês.`
          : `Catálogo auditado (${cat?.totalSkusAudited || 0} SKUs). Oportunidade de CRO e Pix na primeira dobra.`,
      whatsAppPitchScript: pitchScript,
      pdfDossierUrl: topBroken?.productUrl || `https://${domain}`
    };
  } catch {
    return {
      id: `lead-${index + 1}-${domain}`,
      domain,
      url: `https://${domain}`,
      brandName,
      status: 'ERROR',
      platform: 'Inacessível / Timeout',
      verticalLabel: 'Varejo Geral',
      totalProductsScanned: 0,
      totalSkusAudited: 0,
      monthlyAdWasteBRL: 0,
      brokenSkusCount: 0,
      hasCnpjInFooter: true,
      dealPriority: 'MODERADA',
      closingArgument: `Domínio inacessível durante a auditoria automática. Requer validação manual.`,
      whatsAppPitchScript: `Olá equipe ${brandName}! Tentamos rodar uma auditoria técnica em ${domain}, mas o site não respondeu no momento da inspeção.`,
      pdfDossierUrl: `https://${domain}`
    };
  }
}

/**
 * Runs batch audit across domain list with controlled concurrency (2 workers)
 * and 100% real SKU grounding.
 */
export async function runBatchProspectingAudit(
  domains: string[],
  agencyName: string,
  onProgress: (progress: BatchAuditProgress, currentLead: BatchProspectingLead) => void
): Promise<BatchProspectingLead[]> {
  const results: BatchProspectingLead[] = [];
  let totalAdWaste = 0;
  let highPriorityDeals = 0;
  let completedCount = 0;
  let nextIndex = 0;

  const CONCURRENCY = Math.min(2, domains.length || 1);

  async function worker() {
    while (nextIndex < domains.length) {
      const i = nextIndex++;
      const rawDomain = domains[i];
      const lead = await auditSingleDomainForBatch(rawDomain, i, agencyName);

      results.push(lead);
      completedCount++;
      totalAdWaste += lead.monthlyAdWasteBRL;
      if (lead.dealPriority === 'ALTÍSSIMA_OPORTUNIDADE' || lead.dealPriority === 'ALTA') {
        highPriorityDeals++;
      }

      onProgress({
        total: domains.length,
        completed: completedCount,
        currentDomain: lead.domain,
        totalMonthlyWasteIdentifiedBRL: totalAdWaste,
        highPriorityDealsCount: highPriorityDeals
      }, lead);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  const sorted = results.sort((a, b) => b.monthlyAdWasteBRL - a.monthlyAdWasteBRL);
  persistBatchProspectingLeads(sorted);
  return sorted;
}
