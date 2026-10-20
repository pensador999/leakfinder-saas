import { describe, it, expect, beforeEach } from 'vitest';
import { auditDeepCatalog, auditProductDeepSkus } from '../services/catalog/deepSkuAuditEngine';
import { calculateActuarialBleed } from '../services/ai/bleedActuaryEngine';
import { auditBrazilianLegalCompliance } from '../services/audits/brazilianLegalComplianceEngine';
import { isCatalogProductBroken } from '../services/siteInspector';
import { runAgentDiagnostic } from '../services/agentEngine';
import { auditSupplyChainDiscrepancy } from '../services/supplyChain/erpHubDiscrepancyEngine';
import { runCeoOrchestratorEvaluation } from '../services/agents/chiefExecutiveOrchestratorAgent';
import { executeDualAgentCrossVerification } from '../services/ai/dualAgentConsensusGatekeeper';
import { executeTreeOfThoughtReasoning } from '../services/ai/treeOfThoughtReasoningEngine';
import { TruthAuditorAgent } from '../services/orchestrator/truthAuditorAgent';
import { runOmnichannelCrossAudit } from '../services/supplyChain/omnichannelTruthMatrixService';
import { runProductEvolutionAudit } from '../services/agents/productEvolutionEngineerAgent';
import { injectVerticalContextForAllAgents } from '../services/ai/verticalContextInjector';
import { useAuditStore } from '../store/auditStore';
import { recordStoreInspection, formatRestockCelebrationMessage } from '../services/memory/storeContextMemory';
import {
  learnFromStoreDiagnostic,
  verifyAndHealAgentOutputConsistency,
  getSwarmEvolutionSummary,
  resetSwarmEvolutionStateForTest
} from '../services/memory/swarmEvolutionaryLearningEngine';
import { analyzeComputerVision } from '../services/visionCoreEngine';
import { auditSiteSecurity } from '../services/securityInspector';
import { auditSocialConversion } from '../services/socialInspector';
import { analyzeOsint } from '../services/osintEngine';
import {
  extractUniversalPlatformProducts,
  buildIssuesFromUniversalProducts
} from '../services/catalog/universalPlatformExtractor';
import type { WorkerInspectionResult } from '../services/siteInspectorWorker';

async function buildFieldAccurateWorkerPayload(params: {
  domain: string;
  brandName: string;
  platform: string;
  niche: string;
  title: string;
  rawHtmlSnippet: string;
  products: any[];
  hasSizeGuide?: boolean;
}): Promise<WorkerInspectionResult> {
  const { domain, brandName, platform, niche, title, rawHtmlSnippet, products, hasSizeGuide = true } = params;
  const deepSkuAudit = auditDeepCatalog(products, {
    storeDomain: domain,
    dailyAdSpend: 250,
    isAdRunning: true,
    operationMode: 'AUTO_DETECT'
  });

  const issues = deepSkuAudit.allProducts.map((p, idx) => {
    const availSizes = Array.from(
      new Set(
        p.skus
          .filter(s => s.available)
          .map(s => {
            const parts = s.variantTitle.split('/').map(t => t.trim());
            return parts[parts.length - 1] || s.variantTitle;
          })
      )
    );
    const isArchived =
      deepSkuAudit.allProducts.length > 50 &&
      deepSkuAudit.allProducts.filter(x => x.activeSkusCount === 0).length > 50 &&
      p.activeSkusCount === 0;

    const missingSizes = isArchived
      ? ['ARQUIVO (ESGOTADO)']
      : p.activeSkusCount === 0
      ? ['ESGOTADO']
      : p.brokenCoreSizes;

    const isExempt = p.skus.length > 0 && p.skus.every(s => s.isFullExempt);

    return {
      id: p.id || `prod-${idx}`,
      sku: p.skus[0]?.skuCode || `SKU-${idx}`,
      productTitle: p.title,
      productUrl: p.url,
      price: p.skus[0]?.price || 199.9,
      imageSrc: p.images[0] || `https://cdn.shopify.com/s/files/1/0001/${idx}.jpg`,
      hasValidImage: true,
      imageResolutionStatus: 'ALTA' as const,
      availableSizes: isArchived
        ? ['ARQUIVO (ESGOTADO)']
        : availSizes.length > 0
        ? availSizes
        : ['NENHUM (100% ESGOTADO)'],
      missingSizes,
      brokenCoreSizes: p.brokenCoreSizes,
      isFullPrintExempt: isExempt,
      categoryType: isExempt ? ('FULL_PRINT' as const) : ('VESTUARIO_LINHA' as const),
      manufacturingType: p.manufacturingCategory,
      hasDescription: true,
      descriptionLength: 240,
      hasSizeGuide,
      imageWeightKb: 185,
      criticalIssuesCount: missingSizes.length > 0 && !isExempt && !isArchived ? 2 : 0,
      recommendedAction:
        missingSizes.length > 0 && !isExempt && !isArchived
          ? `Repor estoque na grade (${missingSizes.join(', ')}).`
          : 'Catálogo em conformidade.',
      detailedSkus: p.skus,
      isGhostInventorySuspect: p.ghostInventoryRisk?.isGhostInventorySuspect,
      ghostInventoryRisk: p.ghostInventoryRisk
    };
  });

  const brokenCount = issues.filter(isCatalogProductBroken).length;

  const siteData: any = {
    url: `https://${domain}`,
    domain,
    brandName,
    isHttps: true,
    ecommercePlatform: platform,
    isEnterpriseBrand: false,
    brandTier: 'D2C_GROWTH',
    operationMode: 'AUTO_DETECT',
    title,
    metaDescription: `${brandName} - Loja Oficial`,
    h1List: [brandName],
    h2Count: 8,
    totalImages: 24,
    imagesWithoutAlt: 0,
    brokenProductImages: [],
    typoAlerts: [],
    hasSchemaJsonLd: true,
    hasViewportMeta: true,
    hasOgTags: true,
    detectedKeywords: [niche.toLowerCase(), brandName.toLowerCase()],
    detectedCheckoutTerms: {
      hasPix: true,
      hasFrete: true,
      hasGarantia: true,
      hasCheckoutTransparente: true,
      hasCart: true
    },
    formCount: 2,
    buttonCount: 12,
    estimatedLoadTime: 1.6,
    inspectionStatus: 'SUCCESS',
    executionTimeMs: 420,
    rawHtmlSnippet,
    hasMetaPixel: true,
    hasGtm: true,
    hasTiktokPixel: false,
    hasWhatsapp: true,
    legalCompliance: auditBrazilianLegalCompliance(rawHtmlSnippet, false),
    catalogAudit: {
      totalProductsScanned: issues.length,
      totalSkusAudited: deepSkuAudit.totalSkusAudited,
      totalSkusInStock: deepSkuAudit.totalInStockSkus,
      totalSkusInStockout: deepSkuAudit.totalRupturedSkus,
      productsWithMissingImages: 0,
      productsWithBrokenGrid: brokenCount,
      productsWithFullExemption: issues.filter(i => i.isFullPrintExempt).length,
      productsWithoutDescription: 0,
      productsWithoutSizeGuide: hasSizeGuide ? 0 : issues.length,
      heavyImagesCount: 0,
      catalogHealthScore: deepSkuAudit.globalCatalogHealthScore,
      monthlyLossEstimateBRL: deepSkuAudit.totalMonthlyBleedBrl,
      issues,
      deepSkuAudit
    }
  };

  return {
    inferredBrandName: brandName,
    detectedNiche: niche,
    siteData,
    security: auditSiteSecurity(siteData),
    social: auditSocialConversion(siteData, ''),
    visionAnalysis: await analyzeComputerVision(domain, rawHtmlSnippet),
    osintData: await analyzeOsint(rawHtmlSnippet, domain)
  };
}

describe('🧠 BATERIA EXTREMA DE LÓGICA MULTI-AMBIENTE & AUTOMELHORIA EVOLUTIVA DOS 18 AGENTES', () => {
  beforeEach(() => {
    resetSwarmEvolutionStateForTest();
  });

  it('Ambiente 1 (Colisão Léxica & Determinismo Atuarial): XGG e GG nunca falsificam ruptura em G, e grades numéricas não se misturam com alfabéticas', () => {
    // 1.1: Apenas XGG esgotado (tamanho periférico de 5%) enquanto PP, P, M, G, GG estão 100% em estoque
    const bleedOnlyXggOut = calculateActuarialBleed({
      productTitle: 'Tech T-Shirt® Preta',
      productPriceBRL: 179.0,
      availableSizes: ['PP', 'P', 'M', 'G', 'GG'],
      outOfStockSizes: ['XGG'],
      niche: 'STREETWEAR_MODA_URBANA'
    });

    // Antes da correção, 'XGG'.includes('G') marcava G (26%), GG (10%) e XG (5%) e hasCoreRupture=true!
    expect(bleedOnlyXggOut.hasCoreRupture).toBe(false);
    expect(bleedOnlyXggOut.rupturedDemandPct).toBeLessThanOrEqual(10);

    // 1.2: Apenas GG esgotado enquanto PP, P, M, G estão disponíveis -> G (core, 26%) NÃO está rompido
    const bleedOnlyGgOut = calculateActuarialBleed({
      productTitle: 'Camiseta Algodão Egípcio Minimal',
      productPriceBRL: 159.0,
      availableSizes: ['PP', 'P', 'M', 'G'],
      outOfStockSizes: ['GG'],
      niche: 'STREETWEAR_MODA_URBANA'
    });
    const sizeGEntry = bleedOnlyGgOut.sizeDemandDistribution.find(s => s.size === 'G');
    expect(sizeGEntry).toBeDefined();
    expect(bleedOnlyGgOut.hasCoreRupture).toBe(false);
    expect(bleedOnlyGgOut.rupturedDemandPct).toBe(10); // Exatamente o peso de GG (10%) em STREETWEAR_MODA_URBANA, sem somar G (26%)!

    // 1.3: Calça com grade 100% numérica (38, 40, 42 disponíveis; 44 esgotado) -> sizeDemandDistribution contém apenas chaves numéricas
    const bleedNumericPants = calculateActuarialBleed({
      productTitle: 'Calça Alfaiataria Minimal 2.0',
      productPriceBRL: 349.0,
      availableSizes: ['38', '40', '42', '46'],
      outOfStockSizes: ['44'],
      niche: 'STREETWEAR_MODA_URBANA'
    });
    expect(bleedNumericPants.sizeDemandDistribution.every(s => /^\d{2}$/.test(s.size))).toBe(true);
    expect(bleedNumericPants.rupturedDemandPct).toBe(15); // Peso exato do 44 (15% na curva numérica de STREETWEAR_MODA_URBANA)

    // 1.4: Produto 100% em estoque (outOfStockSizes = []) deve ter sangria R$ 0.00
    const bleedHealthy = calculateActuarialBleed({
      productTitle: 'Saia Envelope Breeze (P/M e G/GG)',
      productPriceBRL: 249.0,
      availableSizes: ['P', 'M', 'G', 'GG'],
      outOfStockSizes: [],
      niche: 'STREETWEAR_MODA_URBANA'
    });
    expect(bleedHealthy.rupturedDemandPct).toBe(0);
    expect(bleedHealthy.totalMonthlyBleedBRL).toBe(0);

    // 1.5: Determinismo estrito (Zero Math.random)
    const hooks = Array.from({ length: 10 }, () =>
      calculateActuarialBleed({
        productTitle: 'Tech T-Shirt® Preta',
        productPriceBRL: 179.0,
        availableSizes: ['P', 'G'],
        outOfStockSizes: ['M'],
        niche: 'STREETWEAR_MODA_URBANA'
      }).visceralLossHook
    );
    expect(new Set(hooks).size).toBe(1);
  });

  it('Ambiente 2 (Matriz Multi-Cor Alta Densidade — Padrão Insider Store): 72 SKUs (12 cores × 6 tamanhos) normalizam sangria por cor vs ruptura total do tamanho', () => {
    const colors = [
      'PRETO', 'BRANCO', 'AZUL MARINHO', 'CINZA', 'VERDE MILITAR', 'VINHO',
      'BEGE', 'TERRA', 'AZUL ROYAL', 'GRAFITE', 'OFF WHITE', 'CAQUI'
    ];
    const sizes = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

    // Cenário A: Tamanho M esgotou em 6 cores sazonais, mas continua disponível em 6 cores principais (Preto, Branco, etc.)
    const partialColorVariants: any[] = [];
    colors.forEach((color, cIdx) => {
      sizes.forEach((size, sIdx) => {
        const isSeasonalMOut = size === 'M' && cIdx >= 6;
        partialColorVariants.push({
          id: `v-part-${cIdx}-${sIdx}`,
          sku: `TECH-TSHIRT-${cIdx}-${size}`,
          title: `${color} / ${size}`,
          option1: color,
          option2: size,
          price: '179.00',
          available: !isSeasonalMOut
        });
      });
    });

    const partialAudit = auditProductDeepSkus(
      {
        id: 1001,
        title: 'Tech T-Shirt® Multi-Cor (Parcial)',
        handle: 'tech-tshirt-parcial',
        product_type: 'T-Shirts',
        tags: ['algodao', 'techwear'],
        variants: partialColorVariants
      },
      { storeDomain: 'insiderstore.com.br', dailyAdSpend: 250, isAdRunning: true }
    );

    // Cenário B: Tamanho M esgotou em TODAS as 12 cores (bloqueio real da curva central M)
    const fullSizeOutVariants = partialColorVariants.map(v =>
      v.option2 === 'M' ? { ...v, available: false } : v
    );
    const fullOutAudit = auditProductDeepSkus(
      {
        id: 1002,
        title: 'Tech T-Shirt® Multi-Cor (M 100% Zerado)',
        handle: 'tech-tshirt-full-out',
        product_type: 'T-Shirts',
        tags: ['algodao', 'techwear'],
        variants: fullSizeOutVariants
      },
      { storeDomain: 'insiderstore.com.br', dailyAdSpend: 250, isAdRunning: true }
    );

    // No Cenário A, M ainda tem 6 cores ativas, portanto brokenCoreSizes deve ser vazio [] e a perda muito menor que no Cenário B
    expect(partialAudit.brokenCoreSizes).toEqual([]);
    expect(fullOutAudit.brokenCoreSizes).toContain('M');
    expect(fullOutAudit.criticalBleedBrlMonth).toBeGreaterThan(partialAudit.criticalBleedBrlMonth * 4);
    // Teto atuarial por produto garante que nunca ultrapasse 85% do dailyAdSpend * 30 (R$ 6.375/mês)
    expect(fullOutAudit.criticalBleedBrlMonth).toBeLessThanOrEqual(250 * 0.85 * 30);
  });

  it('Ambiente 3 (Moda Autoral com Backlog Histórico > 75% Esgotado + HTML > 750KB — Padrão Duas Design): Isola arquivo morto e extrai CNPJ no rodapé distante', () => {
    const products: any[] = [];

    // 70 produtos de coleções antigas 100% esgotados (Arquivo Morto)
    for (let i = 1; i <= 70; i++) {
      products.push({
        id: `arch-${i}`,
        title: `Vestido Coleção Inverno 2023 #${i}`,
        handle: `vestido-inverno-2023-${i}`,
        product_type: 'Vestidos',
        tags: ['inverno-23'],
        variants: [
          { id: `va-${i}-p`, sku: `DD-23-${i}-P`, title: 'P', price: '389.00', available: false },
          { id: `va-${i}-m`, sku: `DD-23-${i}-M`, title: 'M', price: '389.00', available: false },
          { id: `va-${i}-g`, sku: `DD-23-${i}-G`, title: 'G', price: '389.00', available: false }
        ]
      });
    }

    // 25 produtos da coleção atual ativa (5 com grade furada no M, 20 completos)
    for (let i = 1; i <= 25; i++) {
      const isBrokenM = i <= 5;
      products.push({
        id: `active-${i}`,
        title: `Blusa Linho Verão 2026 #${i}`,
        handle: `blusa-linho-verao-2026-${i}`,
        product_type: 'Blusas',
        tags: ['verao-26'],
        variants: [
          { id: `v-${i}-p`, sku: `DD-26-${i}-P`, title: 'P', price: '299.00', available: true },
          { id: `v-${i}-m`, sku: `DD-26-${i}-M`, title: 'M', price: '299.00', available: !isBrokenM },
          { id: `v-${i}-g`, sku: `DD-26-${i}-G`, title: 'G', price: '299.00', available: true }
        ]
      });
    }

    const summary = auditDeepCatalog(products, {
      storeDomain: 'duasdesign.com',
      dailyAdSpend: 250,
      isAdRunning: true
    });

    // Os 70 produtos 100% esgotados devem ter bleed zerado pelo isolamento de arquivo histórico
    const archivedItem = summary.allProducts.find(p => p.handle === 'vestido-inverno-2023-1')!;
    expect(archivedItem.criticalBleedBrlMonth).toBe(0);
    expect(archivedItem.skus[0].operationalAction).toContain('Arquivo Histórico');

    // Apenas os 5 produtos ativos com M esgotado devem estar em criticalProducts
    expect(summary.criticalProducts.length).toBe(5);
    expect(summary.globalCatalogHealthScore).toBeGreaterThanOrEqual(75);

    // Simula HTML de 760KB com CNPJ posicionado após o byte 750.000
    const giantPadding = '<!-- megamenu-svg-block -->'.repeat(28000); // ~756KB
    const giantHtml = `<html><head><title>Duas Design</title></head><body>${giantPadding}<footer><p>DUAS DESIGN LTDA - CNPJ: 16.097.130/0001-24 - Rua Oscar Freire, 100, São Paulo - SP, CEP: 01426-000 - Trocas e Devoluções conforme CDC - Política de Privacidade LGPD - WhatsApp (11) 99999-8888</p></footer></body></html>`;
    expect(giantHtml.length).toBeGreaterThan(750000);

    const legal = auditBrazilianLegalCompliance(giantHtml, false);
    expect(legal.hasCnpjInFooter).toBe(true);
    expect(legal.cnpjFound).toBe('16.097.130/0001-24');
    expect(legal.complianceScore).toBe(100);
  });

  it('Ambiente 4 (Agro & Pesca Híbrida + Caso Yellowstone Estoque Fantasma — Padrão BRK): Isenta Pesca/_FULL/APC na BRK e aciona Kill-Switch no SKU Yellowstone em backorder', async () => {
    const brkProducts = [
      {
        id: 'brk-1',
        title: 'Carretilha Marine Sports Titan Pro 12000',
        handle: 'carretilha-titan-pro',
        product_type: 'Carretilhas',
        tags: ['pesca'],
        variants: [{ id: 'v1', sku: 'CARR-01', title: 'Direita', price: '499.00', available: true }]
      },
      {
        id: 'brk-2',
        title: 'Camisa Pesca UV50+ Tucunaré _FULL',
        handle: 'camisa-tucunare-full',
        product_type: 'Camisas UV',
        tags: ['_FULL'],
        variants: [
          { id: 'v2-p', sku: 'BRK-UV-P_FULL', title: 'P', price: '169.90', available: true },
          { id: 'v2-m', sku: 'BRK-UV-M_FULL', title: 'M', price: '169.90', available: false }
        ]
      },
      {
        id: 'brk-3',
        title: 'Camiseta Casual Algodão Pima Agro',
        handle: 'camiseta-casual-algodao-agro',
        product_type: 'Camisetas',
        tags: ['algodão', 'casual'],
        variants: [
          { id: 'v3-p', sku: 'APC-001-P', title: 'P', price: '129.90', available: true },
          { id: 'v3-m', sku: 'APC-001-M', title: 'M', price: '129.90', available: false }
        ]
      },
      {
        id: 'brk-yellowstone',
        title: 'Boné Trucker Yellowstone Dutton Ranch — Envio Imediato Pronta Entrega',
        handle: 'bone-yellowstone-dutton-ranch',
        product_type: 'Bonés',
        tags: ['envio imediato', 'pronta entrega'],
        variants: [
          {
            id: 'vy-1',
            sku: 'BONE-YEL-01',
            title: 'Único',
            price: '149.90',
            available: true,
            inventory_policy: 'continue',
            inventory_quantity: 0
          }
        ]
      }
    ];

    const worker = await buildFieldAccurateWorkerPayload({
      domain: 'brkagro.com.br',
      brandName: 'BRK Agro',
      platform: 'Shopify',
      niche: 'Moda Agro e Pesca UV50+',
      title: 'BRK Agro — Loja Oficial de Moda Agro e Pesca',
      rawHtmlSnippet: '<html><body><footer>CNPJ: 12.345.678/0001-90 Troca e Devolução Privacidade LGPD Pix WhatsApp</footer></body></html>',
      products: brkProducts
    });

    const diag = await runAgentDiagnostic(
      {
        businessName: 'BRK Agro',
        siteUrl: 'https://brkagro.com.br',
        niche: 'Moda Agro e Pesca UV50+',
        targetRegion: 'Brasil',
        averageOrderValue: 220,
        grossMargin: 60
      },
      worker
    );

    const catIssues = diag.realSiteData.catalogAudit!.issues;
    const camisaFull = catIssues.find(i => i.productTitle.includes('_FULL'))!;
    const camisetaApc = catIssues.find(i => i.sku.startsWith('APC'))!;
    const boneYellowstone = catIssues.find(i => i.productTitle.includes('Yellowstone'))!;

    expect(isCatalogProductBroken(camisaFull)).toBe(false);
    expect(isCatalogProductBroken(camisetaApc)).toBe(false);
    expect(boneYellowstone.isGhostInventorySuspect).toBe(true);
    expect(isCatalogProductBroken(boneYellowstone)).toBe(true);

    const ceo = await runCeoOrchestratorEvaluation(diag);
    expect(ceo.decisions[0].id).toBe('ceo-dec-ghost-inventory-pause');
    expect(ceo.decisions[0].iceScore).toBe(10.0);
  });

  it('Ambiente 5 (Coerência Matemática 100% entre os 18 Agentes): Catalog Doctor, CEO, Supply Chain, Omnichannel, Dual-Agent Consensus e Tree-of-Thought convergem sem divergência', async () => {
    const minimalProducts = [
      {
        id: 'mc-1',
        title: 'Calça Alfaiataria Minimal 2.0',
        handle: 'calca-alfaiataria-minimal',
        product_type: 'Calças',
        tags: ['alfaiataria'],
        variants: [
          { id: 'c38', sku: 'CALCA-38', title: '38', price: '349.00', available: true },
          { id: 'c40', sku: 'CALCA-40', title: '40', price: '349.00', available: true },
          { id: 'c42', sku: 'CALCA-42', title: '42', price: '349.00', available: true },
          { id: 'c44', sku: 'CALCA-44', title: '44', price: '349.00', available: true },
          { id: 'c48', sku: 'CALCA-48', title: '48', price: '349.00', available: false } // Ponta periférica (não quebra grade!)
        ]
      },
      {
        id: 'mc-2',
        title: 'Camisa Henley Tricot Algodão Egípcio',
        handle: 'camisa-henley-tricot',
        product_type: 'Camisas',
        tags: ['algodão egípcio', 'casual'],
        variants: [
          { id: 'h-p', sku: 'HENLEY-P', title: 'P', price: '229.00', available: true },
          { id: 'h-m', sku: 'HENLEY-M', title: 'M', price: '229.00', available: false }, // Curva central M rompida!
          { id: 'h-g', sku: 'HENLEY-G', title: 'G', price: '229.00', available: false }, // Curva central G rompida!
          { id: 'h-gg', sku: 'HENLEY-GG', title: 'GG', price: '229.00', available: true }
        ]
      },
      {
        id: 'mc-3',
        title: 'Kit 3 Camisetas Minimal Classic',
        handle: 'kit-3-camisetas-minimal',
        product_type: 'Kits',
        tags: ['kit'],
        variants: [
          { id: 'k-p', sku: 'KIT3-P', title: 'P', price: '399.00', available: false },
          { id: 'k-m', sku: 'KIT3-M', title: 'M', price: '399.00', available: false },
          { id: 'k-g', sku: 'KIT3-G', title: 'G', price: '399.00', available: true }
        ]
      }
    ];

    const worker = await buildFieldAccurateWorkerPayload({
      domain: 'minimalclub.com.br',
      brandName: 'Minimal Club',
      platform: 'Shopify',
      niche: 'Moda Masculina e Camisetas Básicas',
      title: 'Minimal Club — Camisetas de Algodão Egípcio e Alfaiataria',
      rawHtmlSnippet: '<html><head><script src="https://minimalclub.com.br/wpm/web-pixels-manager.js"></script></head><body><footer>CNPJ: 42.034.830/0001-80 Política de Privacidade Trocas e Devoluções Pix WhatsApp</footer></body></html>',
      products: minimalProducts
    });

    const diag = await runAgentDiagnostic(
      {
        businessName: 'Minimal Club',
        siteUrl: 'https://minimalclub.com.br',
        niche: 'Moda Masculina e Camisetas Básicas',
        targetRegion: 'Brasil',
        averageOrderValue: 280,
        grossMargin: 62
      },
      worker
    );

    useAuditStore.getState().setDiagnostic(diag);
    const supply = auditSupplyChainDiscrepancy(diag.realSiteData, diag.input);
    const ceo = await runCeoOrchestratorEvaluation(diag);
    const dual = executeDualAgentCrossVerification(diag);
    const tot = executeTreeOfThoughtReasoning(diag);
    const omni = await runOmnichannelCrossAudit();
    const truthAuditor = new TruthAuditorAgent({
      dossierId: 'dossier-mc',
      targetDomain: diag.realSiteData.domain,
      targetBrand: diag.realSiteData.brandName,
      collectedAt: new Date().toISOString(),
      responseStatus: 200,
      isShopifyPlatform: true,
      isVtexPlatform: false,
      isNuvemshopPlatform: false,
      isWooCommercePlatform: false,
      catalog: { totalProductsFound: 3, items: [] },
      headTags: { hasMetaPixel: true, hasGtm: true, hasGa4: true, hasClarity: false, hasTikTokPixel: false, hasHotjar: false },
      legal: { hasCnpjInFooter: true, hasReturnPolicyLink: true, hasPrivacyPolicyLink: true, hasTermsOfServiceLink: true },
      conversion: { hasWhatsAppButton: true, hasPixDiscountMention: true, hasFreeShippingBar: true, hasSizeChartAddon: true, hasCustomerReviewsWidget: true }
    }).auditDiagnostic(diag);

    const consistency = verifyAndHealAgentOutputConsistency({
      diagnostic: diag,
      supplyChain: supply,
      ceoDossier: ceo,
      dualConsensus: dual,
      treeOfThought: tot
    });

    // Exatamente 2 produtos estão quebrados (Henley e Kit 3 Camisetas); Calça Alfaiataria (só 48 esgotado) NÃO está quebrada!
    expect(consistency.canonicalBrokenProductsCount).toBe(2);
    expect(consistency.is100PercentHarmonized).toBe(true);
    expect(consistency.crossAgentHarmonyPct).toBe(100);
    expect(consistency.agentMetricsChecked.catalogDoctorBroken).toBe(2);
    expect(consistency.agentMetricsChecked.ceoBrokenItems).toBe(2);
    expect(consistency.agentMetricsChecked.supplyChainBrokenSkus).toBe(2);
    expect(omni.items.filter(i => i.veredito.nivelRisco !== 'SEGURO').length).toBe(2);
    expect(truthAuditor.overallStatus).toBe('APROVADO_100_VERIFICADO');

    // Todos os 18 agentes recebem contexto verticalizado para STREETWEAR_MODA_URBANA
    const all18Prompts = injectVerticalContextForAllAgents('Moda Masculina Minimal Club');
    expect(all18Prompts.verticalProfile.verticalId).toBe('STREETWEAR_MODA_URBANA');
    expect(all18Prompts.agentPrompts.size).toBe(18);
  });

  it('Ambiente 6 (Ciclo Evolutivo Multi-Loja & Memória de Reposição): O Enxame aprende padrões a cada loja, calibra benchmarks bayesianos, eleva seu SIQ e detecta reposição de estoque', async () => {
    const initialSummary = getSwarmEvolutionSummary();
    expect(initialSummary.totalAuditsProcessed).toBe(0);
    const initialMaturity = initialSummary.swarmMaturityScore;

    // Loja 1: Minimal Club (Grade Numérica + Web Pixels Manager)
    const workerMinimal = await buildFieldAccurateWorkerPayload({
      domain: 'minimalclub.com.br',
      brandName: 'Minimal Club',
      platform: 'Shopify',
      niche: 'Moda Masculina',
      title: 'Minimal Club Alfaiataria',
      rawHtmlSnippet: '<html><script src="/web-pixels-manager.js"></script><footer>CNPJ: 42.034.830/0001-80</footer></html>',
      products: [
        {
          id: 'p1',
          title: 'Calça Alfaiataria Minimal',
          handle: 'calca-alfaiataria',
          variants: [
            { id: 'v1', sku: 'CA-40', title: '40', price: '349.00', available: true },
            { id: 'v2', sku: 'CA-42', title: '42', price: '349.00', available: false }
          ]
        }
      ]
    });
    const diag1 = await runAgentDiagnostic(
      { businessName: 'Minimal Club', siteUrl: 'https://minimalclub.com.br', niche: 'Moda Masculina', targetRegion: 'Brasil' },
      workerMinimal
    );

    // Loja 2: Insider Store (Grade Dupla P/M + Matriz Multi-Cor >= 12 SKUs)
    const multiColorSkus = Array.from({ length: 14 }, (_, idx) => ({
      id: `ins-${idx}`,
      sku: `INS-TECH-${idx}`,
      title: idx === 0 ? 'PRETA / P/M' : `COR-${idx} / M`,
      price: '179.00',
      available: idx % 3 !== 0
    }));
    const workerInsider = await buildFieldAccurateWorkerPayload({
      domain: 'insiderstore.com.br',
      brandName: 'Insider Store',
      platform: 'Shopify',
      niche: 'Moda Funcional Techwear',
      title: 'Insider Store Techwear',
      rawHtmlSnippet: '<html><script src="/trekkie.js"></script><footer>CNPJ: 26.520.188/0001-92</footer></html>',
      products: [{ id: 'ins-p1', title: 'Saia & Tech T-Shirt', handle: 'saia-tech', variants: multiColorSkus }]
    });
    await runAgentDiagnostic(
      { businessName: 'Insider Store', siteUrl: 'https://insiderstore.com.br', niche: 'Moda Funcional Techwear', targetRegion: 'Brasil' },
      workerInsider
    );

    // Loja 3: Mash (VTEX Search SKU Concatenado)
    const workerMash = await buildFieldAccurateWorkerPayload({
      domain: 'mash.com.br',
      brandName: 'Mash',
      platform: 'VTEX',
      niche: 'Moda Íntima e Vestuário',
      title: 'Mash Cuecas e Moda Íntima',
      rawHtmlSnippet: '<html><footer>CNPJ: 17.678.232/0001-04</footer></html>',
      products: [
        {
          id: 'mash-1',
          title: 'Kit 10 Cuecas Boxer Cotton',
          handle: 'kit-10-cuecas',
          variants: [
            { id: 'm1', sku: 'MASH-M', title: 'M', price: '189.90', available: false },
            { id: 'm2', sku: 'MASH-G', title: 'G', price: '189.90', available: true }
          ]
        }
      ]
    });
    await runAgentDiagnostic(
      { businessName: 'Mash', siteUrl: 'https://mash.com.br', niche: 'Moda Íntima e Vestuário', targetRegion: 'Brasil' },
      workerMash
    );

    const evolved = getSwarmEvolutionSummary();
    expect(evolved.totalAuditsProcessed).toBe(3);
    expect(evolved.uniqueDomainsLearned).toEqual(['minimalclub.com.br', 'insiderstore.com.br', 'mash.com.br']);
    expect(evolved.swarmMaturityScore).toBeGreaterThan(initialMaturity);

    // Padrões assimilados automaticamente durante a bateria
    expect(evolved.learnedPatterns['GRADE_NUMERICA_ALFAIATARIA']).toBeDefined();
    expect(evolved.learnedPatterns['GRADE_DUPLA_COMBINADA']).toBeDefined();
    expect(evolved.learnedPatterns['MATRIZ_MULTICOR_ALTA_DENSIDADE']).toBeDefined();
    expect(evolved.learnedPatterns['VTEX_SKU_CONCATENADO']).toBeDefined();
    expect(evolved.learnedPatterns['WEB_PIXELS_SANDBOX']).toBeDefined();

    // Calibração Bayesiana Empírica da vertical STREETWEAR_MODA_URBANA após 3 lojas
    const streetwearStats = evolved.verticalEmpiricalBenchmarks['STREETWEAR_MODA_URBANA']!;
    expect(streetwearStats).toBeDefined();
    expect(streetwearStats.storesSampled).toBe(3);
    expect(streetwearStats.observedAvgTicketBRL).toBeGreaterThan(150);

    // O Agente 16 (Product Evolution Engineer) agora incorpora os aprendizados de campo no topo do dossiê!
    const evolutionDossier = await runProductEvolutionAudit();
    expect(evolutionDossier.storesLearnedCount).toBe(3);
    expect(evolutionDossier.learnedPatternsCount).toBeGreaterThanOrEqual(5);
    expect(evolutionDossier.activeProposals[0].id).toContain('evo-learned-');
    expect(evolutionDossier.activeProposals[0].status).toBe('APROVADO');

    // Simulação de Reposição de Estoque na Minimal Club (Tamanho 42 da Calça Alfaiataria voltou ao estoque!)
    recordStoreInspection('minimalclub.com.br', {
      brandName: 'Minimal Club',
      products: [
        {
          handle: 'calca-alfaiataria',
          title: 'Calça Alfaiataria Minimal',
          brokenSizes: ['42'],
          availableSizes: ['40']
        }
      ]
    });

    const secondInspection = recordStoreInspection('minimalclub.com.br', {
      brandName: 'Minimal Club',
      products: [
        {
          handle: 'calca-alfaiataria',
          title: 'Calça Alfaiataria Minimal',
          brokenSizes: [],
          availableSizes: ['40', '42']
        }
      ]
    });

    expect(secondInspection.restockEvents.length).toBe(1);
    expect(secondInspection.restockEvents[0].restockedSizes).toContain('42');
    const celebrationMsg = formatRestockCelebrationMessage({
      storeDomain: 'minimalclub.com.br',
      merchantName: 'Lucas',
      restockEvents: secondInspection.restockEvents
    });
    expect(celebrationMsg).toContain('Calça Alfaiataria Minimal');
    expect(celebrationMsg).toContain('[42]');
    expect( diag1.growthScore ).toBeGreaterThan(0);
  });

  it('Ambiente 7 (Extrator Universal SSR/DOM — Nuvemshop, Tray, Wake/Fbits e WooCommerce): Extrai variantes reais e sangria financeira sem /products.json', () => {
    // 1. Nuvemshop com LS.variants (Camiseta Oversized com M e G esgotados, PP periférico esgotado e P/GG em estoque)
    const nuvemHtml = `
      <html>
        <head><title>Camiseta Oversized Heavy Cotton | Studio Street</title></head>
        <body>
          <h1>Camiseta Oversized Heavy Cotton</h1>
          <script>
            LS.variants = [
              {"id": 101, "product_id": 900, "option0": "PP", "stock": 0, "available": false, "price_number": 179.90, "sku": "ST-OV-PP"},
              {"id": 102, "product_id": 900, "option0": "P", "stock": 8, "available": true, "price_number": 179.90, "sku": "ST-OV-P"},
              {"id": 103, "product_id": 900, "option0": "M", "stock": 0, "available": false, "price_number": 179.90, "sku": "ST-OV-M"},
              {"id": 104, "product_id": 900, "option0": "G", "stock": 0, "available": false, "price_number": 179.90, "sku": "ST-OV-G"},
              {"id": 105, "product_id": 900, "option0": "GG", "stock": 5, "available": true, "price_number": 179.90, "sku": "ST-OV-GG"}
            ];
          </script>
        </body>
      </html>
    `;
    const nuvemProducts = extractUniversalPlatformProducts(
      nuvemHtml,
      undefined,
      'studiostreet.com.br',
      'Studio Street',
      'https://studiostreet.com.br/produtos/camiseta-oversized'
    );
    expect(nuvemProducts.length).toBe(1);
    expect(nuvemProducts[0].sourcePlatform).toBe('NUVEMSHOP');
    expect(nuvemProducts[0].variants.length).toBe(5);

    const nuvemBuilt = buildIssuesFromUniversalProducts(
      nuvemProducts,
      'studiostreet.com.br',
      true,
      nuvemHtml
    );
    expect(nuvemBuilt.issues[0].brokenCoreSizes).toEqual(['M', 'G']);
    expect(isCatalogProductBroken(nuvemBuilt.issues[0])).toBe(true);
    expect(nuvemBuilt.deepSkuAudit.totalMonthlyBleedBrl).toBeGreaterThan(0);

    // 2. WooCommerce com data-product_variations codificado em HTML entities
    const wooVariationsJson = JSON.stringify([
      { variation_id: 201, sku: 'WOO-JAQ-P', attributes: { attribute_pa_tamanho: 'P' }, is_in_stock: true, is_purchasable: true, display_price: 349.9, max_qty: 4 },
      { variation_id: 202, sku: 'WOO-JAQ-M', attributes: { attribute_pa_tamanho: 'M' }, is_in_stock: false, is_purchasable: true, display_price: 349.9, max_qty: 0 },
      { variation_id: 203, sku: 'WOO-JAQ-G', attributes: { attribute_pa_tamanho: 'G' }, is_in_stock: true, is_purchasable: true, display_price: 349.9, max_qty: 6 }
    ]).replace(/"/g, '&quot;');

    const wooHtml = `
      <html>
        <head><title>Jaqueta Puffer Impermeável - Loja Woo</title></head>
        <body>
          <h1>Jaqueta Puffer Impermeável</h1>
          <form class="variations_form cart" data-product_variations="${wooVariationsJson}"></form>
        </body>
      </html>
    `;
    const wooProducts = extractUniversalPlatformProducts(
      wooHtml,
      undefined,
      'lojawoo.com.br',
      'Loja Woo',
      'https://lojawoo.com.br/produto/jaqueta-puffer'
    );
    expect(wooProducts.length).toBe(1);
    expect(wooProducts[0].sourcePlatform).toBe('WOOCOMMERCE');
    const wooBuilt = buildIssuesFromUniversalProducts(wooProducts, 'lojawoo.com.br', true, wooHtml);
    expect(wooBuilt.issues[0].brokenCoreSizes).toEqual(['M']);
    expect(isCatalogProductBroken(wooBuilt.issues[0])).toBe(true);

    // 3. Wake / Fbits com Fbits.Produto (Calçado 38..42 com 39 e 40 esgotados)
    const wakeHtml = `
      <html>
        <head><title>Bota Chelsea Couro Legítimo</title></head>
        <body>
          <script>
            Fbits.Produto = {
              "ProdutoId": 7788,
              "Nome": "Bota Chelsea Couro Legítimo",
              "PrecoPor": 429.90,
              "Variantes": [
                {"ProdutoVarianteId": 1, "SKU": "BOTA-38", "Tamanho": "38", "Estoque": 4, "Disponivel": true},
                {"ProdutoVarianteId": 2, "SKU": "BOTA-39", "Tamanho": "39", "Estoque": 0, "Disponivel": false},
                {"ProdutoVarianteId": 3, "SKU": "BOTA-40", "Tamanho": "40", "Estoque": 0, "Disponivel": false},
                {"ProdutoVarianteId": 4, "SKU": "BOTA-41", "Tamanho": "41", "Estoque": 3, "Disponivel": true}
              ]
            };
          </script>
        </body>
      </html>
    `;
    const wakeProducts = extractUniversalPlatformProducts(
      wakeHtml,
      undefined,
      'calcadoswake.com.br',
      'Calçados Wake',
      'https://calcadoswake.com.br/bota-chelsea'
    );
    expect(wakeProducts.length).toBe(1);
    expect(wakeProducts[0].sourcePlatform).toBe('WAKE_FBITS');
    const wakeBuilt = buildIssuesFromUniversalProducts(wakeProducts, 'calcadoswake.com.br', true, wakeHtml);
    expect(wakeBuilt.issues[0].brokenCoreSizes).toEqual(['39', '40']);
    expect(isCatalogProductBroken(wakeBuilt.issues[0])).toBe(true);

    // 4. Tray Commerce com Schema.org Multi-Offer (Apenas tamanho periférico G2 esgotado -> Zero Falso-Positivo!)
    const trayHtml = `
      <html>
        <head>
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Camisa Polo Piquet Premium",
              "sku": "TRAY-POLO-01",
              "offers": [
                {"@type": "Offer", "name": "Tamanho P", "sku": "TRAY-POLO-P", "price": "149.90", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Tamanho M", "sku": "TRAY-POLO-M", "price": "149.90", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Tamanho G", "sku": "TRAY-POLO-G", "price": "149.90", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Tamanho GG", "sku": "TRAY-POLO-GG", "price": "149.90", "availability": "https://schema.org/InStock"},
                {"@type": "Offer", "name": "Tamanho G2", "sku": "TRAY-POLO-G2", "price": "149.90", "availability": "https://schema.org/OutOfStock"}
              ]
            }
          </script>
        </head>
        <body data-tray-tst="page-product"><h1>Camisa Polo Piquet Premium</h1></body>
      </html>
    `;
    const trayProducts = extractUniversalPlatformProducts(
      trayHtml,
      undefined,
      'lojatray.com.br',
      'Loja Tray',
      'https://lojatray.com.br/camisa-polo'
    );
    expect(trayProducts.length).toBe(1);
    expect(trayProducts[0].sourcePlatform).toBe('TRAY');
    const trayBuilt = buildIssuesFromUniversalProducts(trayProducts, 'lojatray.com.br', true, trayHtml);
    expect(trayBuilt.issues[0].missingSizes).toEqual(['G2']);
    expect(trayBuilt.issues[0].brokenCoreSizes).toEqual([]);
    expect(isCatalogProductBroken(trayBuilt.issues[0])).toBe(false);
  });
});
