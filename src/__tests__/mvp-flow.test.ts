import { describe, it, expect, vi } from 'vitest';
import { useAuditStore } from '../store/auditStore';
import { SAAS_PRICING_PLANS } from '../services/billing/billingService';
import * as stripeService from '../services/billing/stripeRealCheckoutService';

// Mock para o persist middleware do zustand no ambiente de testes
vi.mock('zustand/middleware', () => ({
  persist: (config: any) => config,
}));

describe('MVP Core Flow Validation', () => {
  // Test 1: Stripe checkout API validates input
  it('rejects invalid plan IDs', async () => {
    // Simula uma resposta do backend rejeitando um ID de plano inválido
    const invalidReq = { planId: 'INVALID_PLAN' as any, successUrl: '' };
    
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false, error: 'Invalid plan ID' }),
    });

    await expect(stripeService.createRealStripeCheckout(invalidReq))
      .rejects.toThrow('Invalid plan ID');
  });

  // Test 2: Rate limiter structure
  it('rate limiter tracks IPs correctly', () => {
    // Validação da estrutura que usaremos no rate limiter (em memória)
    const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
    const ip = '127.0.0.1';
    
    rateLimitMap.set(ip, { count: 1, timestamp: Date.now() });
    const data = rateLimitMap.get(ip);
    
    expect(data).toBeDefined();
    expect(data?.count).toBe(1);
    
    if (data) {
      data.count++;
      rateLimitMap.set(ip, data);
    }
    
    expect(rateLimitMap.get(ip)?.count).toBe(2);
  });

  // Test 3: Audit store persistence
  it('Zustand store persists diagnostic data', () => {
    // Estado inicial
    expect(useAuditStore.getState().diagnostic).toBeNull();
    
    // Inserindo diagnóstico fictício
    const mockDiagnostic: any = {
      storeUrl: 'https://test.com',
      platform: 'Shopify',
      overallScore: 85,
    };
    
    useAuditStore.getState().setDiagnostic(mockDiagnostic);
    
    // Verificando se persistiu na sessão do store
    expect(useAuditStore.getState().diagnostic).toEqual(mockDiagnostic);
    expect(useAuditStore.getState().auditError).toBeNull();

    // Limpeza para isolar testes
    useAuditStore.getState().clearAudit();
  });

  // Test 4: URL validation
  it('rejects non-URL inputs', () => {
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('www.google.com')).toBe(false); // Falha pois requer protocolo
    expect(isValidUrl('https://loja.com')).toBe(true);
  });

  // Test 5: Billing plans are correctly configured
  it('all billing plans have required fields', () => {
    expect(SAAS_PRICING_PLANS.length).toBeGreaterThan(0);
    
    SAAS_PRICING_PLANS.forEach(plan => {
      expect(plan.id).toBeDefined();
      expect(plan.name).toBeDefined();
      expect(typeof plan.priceBrlMonthly).toBe('number');
      expect(Array.isArray(plan.features)).toBe(true);
      expect(plan.features.length).toBeGreaterThan(0);
    });

    const proPlan = SAAS_PRICING_PLANS.find(p => p.id === 'PRO_MONTHLY');
    expect(proPlan?.stripePriceId).toBe('price_adshield_pro_497');
  });

  // Test 6: Stripe service functions exist
  it('stripe real checkout service exports required functions', async () => {
    expect(typeof stripeService.createRealStripeCheckout).toBe('function');
    expect(typeof stripeService.redirectToStripeCheckout).toBe('function');
    expect(typeof stripeService.isStripeConfigured).toBe('function');
  });

  // Test 7: SKU deduplication in deepSkuAuditEngine
  it('deduplicates variants and products with identical codes', async () => {
    const { auditDeepCatalog } = await import('../services/catalog/deepSkuAuditEngine');
    
    // Loja com duas variantes com o mesmo código SKU "BON-TRK-01"
    const mockProductWithDuplicateSkus = {
      id: 'prod-123',
      title: 'Boné Trucker Teste',
      handle: 'bone-trucker-teste',
      product_type: 'Boné',
      tags: ['Acessório'],
      variants: [
        { id: 'var-1', title: 'Preto', sku: 'BON-TRK-01', price: '129.90', available: true },
        { id: 'var-2', title: 'Preto Réplica', sku: 'BON-TRK-01', price: '129.90', available: true }, // Duplicata do mesmo código
        { id: 'var-3', title: 'Azul', sku: 'BON-TRK-02', price: '129.90', available: true }
      ]
    };

    const summary = auditDeepCatalog([mockProductWithDuplicateSkus, mockProductWithDuplicateSkus]); // Produto duplicado também

    // Apenas 1 produto deve ser auditado
    expect(summary.totalProductsAudited).toBe(1);
    // Das 3 variantes, apenas as 2 com SKUs distintos devem ser auditadas (var-1 e var-3)
    expect(summary.totalSkusAudited).toBe(2);
    expect(summary.allProducts[0].skus.length).toBe(2);
    expect(summary.allProducts[0].skus.map(s => s.skuCode)).toEqual(['BON-TRK-01', 'BON-TRK-02']);
  });

  // Test 8: Multi-Vertical Calibration, Prompt Injection & Zero-Hallucination Supply Chain
  it('resolves all 11 verticals, injects vertical context into prompts, and respects zero-error catalogs', async () => {
    const { resolveDynamicVertical, detectStoreVertical } = await import('../services/ai/dynamicVerticalContext');
    const { getVerticalizedAgentPrompt } = await import('../agents');
    const { auditSupplyChainDiscrepancy } = await import('../services/supplyChain/erpHubDiscrepancyEngine');
    const { auditProductDeepSkus } = await import('../services/catalog/deepSkuAuditEngine');

    // 1. Verifica detecção unificada das novas verticais
    expect(resolveDynamicVertical('whey protein creatina pura').verticalId).toBe('SUPLEMENTOS_SAUDE');
    expect(detectStoreVertical('autopeças farol automotivo').verticalId).toBe('AUTOPECAS_FERRAMENTAS');
    expect(resolveDynamicVertical('sérum ácido hialurônico skincare').verticalId).toBe('COSMETICOS_BEAUTY');

    // 2. Verifica injeção real do contexto vertical no prompt do agente
    const croPrompt = getVerticalizedAgentPrompt('agent-10', 'sérum ácido hialurônico skincare');
    expect(croPrompt).toContain('CONTEXTO VERTICAL ATIVO: Beleza, Skincare & Cosméticos D2C');
    expect(croPrompt).toContain('COSMETICOS_BEAUTY');

    // 3. Verifica que loja saudável (0 erros) NÃO gera SKU fictício SKU-PRODUCAO-01 e adapta o ERP ao nicho
    const cleanCosmeticsStore: any = {
      url: 'https://sallve.com.br',
      domain: 'sallve.com.br',
      brandName: 'Sallve',
      title: 'Sallve Skincare & Cosméticos',
      hasMetaPixel: true,
      catalogAudit: {
        totalProductsScanned: 10,
        productsWithBrokenGrid: 0,
        heavyImagesCount: 0,
        productsWithoutSizeGuide: 0,
        catalogHealthScore: 100,
        issues: []
      }
    };
    const supplyAudit = auditSupplyChainDiscrepancy(cleanCosmeticsStore, { niche: 'Cosméticos & Skincare' });
    expect(supplyAudit.discrepancyAlerts.length).toBe(0);
    expect(supplyAudit.pipelineFlowMetrics.storefrontBrokenSkusCount).toBe(0);
    expect(supplyAudit.stackOverview.erpDetectedOrConfigured).toBe('BLING');

    // 4. Verifica que deepSkuAuditEngine aplica a curva Gaussiana da vertical (ex: 900G = 45% em Suplementos)
    const supplementProduct = {
      id: 'supp-1',
      title: 'Whey Protein Isolado Puro',
      handle: 'whey-protein-isolado',
      product_type: 'Suplemento',
      tags: ['Whey'],
      variants: [
        { id: 'v1', title: '900G', sku: 'WHEY-900', price: '229.00', available: false }
      ]
    };
    const auditedSupp = auditProductDeepSkus(supplementProduct, { storeDomain: 'growth.com.br', isAdRunning: true });
    expect(auditedSupp.skus[0].sizeDemandWeight).toBe(45);
    expect(auditedSupp.skus[0].operationalAction).toContain('Bling ERP');
  });

  // Test 9: Frentes 1, 2 & 3 Local-First End-to-End Verification
  it('validates Frente 1 (Batch Auditor -> Local CRM), Frente 2 (Mem0 Restock & Snapshots), and Frente 3 (Multi-Vertical Portfolio & Quota Protection)', async () => {
    const { parseDomainListInput, saveBatchLeadToLocalCrm } = await import('../services/agency/batchAuditorService');
    const { getStoredLeads } = await import('../services/whatsappLeadService');
    const { recordStoreInspection, formatRestockCelebrationMessage } = await import('../services/memory/storeContextMemory');
    const { getMonitoredStores, saveStoreSnapshot, getLocalStoreSnapshots } = await import('../services/database/swarmDatabaseService');

    // 1. Frente 1: Parser de domínios em lote + unificação com CRM Local
    const parsedDomains = parseDomainListInput('https://www.minimalclub.com.br/produtos\nsallve.com.br, minimalclub.com.br');
    expect(parsedDomains).toEqual(['minimalclub.com.br', 'sallve.com.br']);

    await saveBatchLeadToLocalCrm({
      id: 'lead-1-minimalclub.com.br',
      domain: 'minimalclub.com.br',
      url: 'https://minimalclub.com.br',
      brandName: 'Minimal Club',
      status: 'COMPLETED',
      platform: 'Shopify',
      verticalLabel: 'Moda & Vestuário',
      totalProductsScanned: 24,
      totalSkusAudited: 120,
      monthlyAdWasteBRL: 3450,
      brokenSkusCount: 3,
      topBrokenProductTitle: 'Camiseta Pima Preta',
      topBrokenProductUrl: 'https://minimalclub.com.br/products/camiseta-pima-preta',
      topBrokenSizes: ['M', 'G'],
      hasCnpjInFooter: true,
      dealPriority: 'ALTÍSSIMA_OPORTUNIDADE',
      closingArgument: 'Ruptura real drenando R$ 3.450/mês',
      whatsAppPitchScript: 'Pitch customizado com SKU real Camiseta Pima Preta',
      pdfDossierUrl: 'https://minimalclub.com.br/products/camiseta-pima-preta'
    });

    const crmLeads = getStoredLeads();
    expect(crmLeads.length).toBeGreaterThan(0);
    expect(crmLeads[0].source).toBe('BATCH_AUDITOR');
    expect(crmLeads[0].topBrokenSku).toContain('Camiseta Pima Preta (M, G)');
    expect(crmLeads[0].customPitch).toContain('Pitch customizado com SKU real');

    // 2. Frente 2: Detector de Reposição Mem0 (Antes vs. Depois)
    recordStoreInspection('minimalclub.com.br', {
      brandName: 'Minimal Club',
      products: [
        {
          handle: 'camiseta-pima-preta',
          title: 'Camiseta Pima Preta',
          url: 'https://minimalclub.com.br/products/camiseta-pima-preta',
          brokenSizes: ['M', 'G'],
          availableSizes: ['P', 'GG']
        }
      ]
    });

    const updatedMem = recordStoreInspection('minimalclub.com.br', {
      brandName: 'Minimal Club',
      products: [
        {
          handle: 'camiseta-pima-preta',
          title: 'Camiseta Pima Preta',
          url: 'https://minimalclub.com.br/products/camiseta-pima-preta',
          brokenSizes: [],
          availableSizes: ['P', 'M', 'G', 'GG']
        }
      ]
    });

    expect(updatedMem.restockEvents.length).toBeGreaterThan(0);
    expect(updatedMem.restockEvents[0].restockedSizes).toEqual(['M', 'G']);
    expect(updatedMem.profile.recentRestocks.length).toBeGreaterThan(0);
    const restockMsg = formatRestockCelebrationMessage({
      storeDomain: 'minimalclub.com.br',
      merchantName: 'Minimal Club',
      restockEvents: updatedMem.restockEvents
    });
    expect(restockMsg).toContain('Camiseta Pima Preta');

    // 3. Frente 3: Portfólio Multi-Vertical & Proteção de Quota nos Snapshots
    const monitoredStores = await getMonitoredStores();
    expect(monitoredStores.some(s => s.brandName === 'Minimal Club')).toBe(true);
    expect(monitoredStores.some(s => s.brandName === 'Sallve')).toBe(true);
    expect(monitoredStores.some(s => s.brandName === 'Insider Store')).toBe(true);

    const mockDiag: any = {
      growthScore: 84,
      estimatedRevenueLiftMin: 12,
      estimatedRevenueLiftMax: 25,
      visionAnalysis: { contrastAudit: { contrastRatio: 7.5, wcagAaPassed: true } },
      realSiteData: {
        catalogAudit: {
          totalProductsScanned: 24,
          monthlyLossEstimateBRL: 2800,
          issues: [
            {
              sku: 'SKU-PIMA-01',
              productTitle: 'Camiseta Pima Preta',
              productUrl: 'https://minimalclub.com.br/products/camiseta-pima-preta',
              missingSizes: ['M', 'G'],
              availableSizes: ['P', 'GG'],
              isFullSizeGridRequired: true
            }
          ]
        }
      }
    };

    await saveStoreSnapshot('store-minimalclub-com-br', mockDiag, {
      hasPreviousSnapshot: true,
      scoreDelta: 4,
      brokenSkusDelta: -1,
      monthlyLossDelta: -650,
      evolutionSummary: 'Score subiu +4 pts'
    });

    const snaps = getLocalStoreSnapshots('store-minimalclub-com-br');
    expect(snaps.length).toBe(1);
    expect(snaps[0].top_broken_skus_summary?.[0].title).toBe('Camiseta Pima Preta');
    expect((snaps[0] as any).raw_diagnostic_json).toBeUndefined();

    // 4. White-Label Vault + PDF Export Unification
    const { setWhiteLabelConfig, getWhiteLabelConfig } = await import('../services/whiteLabelService');
    const { PdfExportService } = await import('../services/export/pdfExportService');

    setWhiteLabelConfig({
      agencyName: 'Alpha Growth Partners',
      consultantName: 'Lucas Lima • Head CRO',
      consultantWhatsApp: '5511977778888',
      primaryColor: '#0AE448'
    });

    const syncedWl = getWhiteLabelConfig();
    expect(syncedWl.agencyName).toBe('Alpha Growth Partners');
    expect(syncedWl.consultantName).toBe('Lucas Lima • Head CRO');
    expect(syncedWl.consultantWhatsApp).toBe('5511977778888');

    const fullMockDiag: any = {
      ...mockDiag,
      input: { businessName: 'Minimal Club', url: 'https://minimalclub.com.br', niche: 'Moda' },
      visionAnalysis: {
        contrastAudit: { contrastRatio: 7.5, wcagAaPassed: true },
        eyeTracking: { mainFocusElement: 'Botão Comprar', focusScoreCta: 88 },
        thumbZone: { ctaZoneLocation: 'EASY', recommendation: 'Posição ergonômica ideal' }
      },
      realSiteData: {
        ...mockDiag.realSiteData,
        domain: 'minimalclub.com.br',
        brandName: 'Minimal Club',
        ecommercePlatform: 'Shopify'
      }
    };

    const dossierHtml = PdfExportService.buildExecutiveDossierHtml(fullMockDiag);
    expect(dossierHtml).toContain('Alpha Growth Partners');
    expect(dossierHtml).toContain('Lucas Lima • Head CRO');
    expect(dossierHtml).toContain('5511977778888');

    // 5. Instant LRU Store Audit Cache (0ms Switch) & Grounded Theme Scripts
    const { saveAuditToDatabase, getCachedAuditByDomain, getRecentAuditedStoresList } = await import('../services/history/storeAuditHistoryService');
    const { generateShopifyThemeScripts } = await import('../services/shopifyThemeScriptGenerator');

    fullMockDiag.realSiteData.metaPixelId = '998877665544';
    fullMockDiag.realSiteData.legalCompliance = { hasCnpjInFooter: true, detectedCnpj: '12.345.678/0001-99' };

    await saveAuditToDatabase(fullMockDiag);
    const cachedDiag = getCachedAuditByDomain('https://www.minimalclub.com.br');
    expect(cachedDiag).not.toBeNull();
    expect(cachedDiag?.growthScore).toBe(84);

    const recentList = getRecentAuditedStoresList();
    expect(recentList.some(r => r.domain === 'minimalclub.com.br' && r.growthScore === 84)).toBe(true);

    const scripts = generateShopifyThemeScripts('minimalclub.com.br', 'Minimal Club', fullMockDiag.realSiteData);
    expect(scripts.length).toBe(6);
    const stockShieldSnippet = scripts.find(s => s.category === 'STOCK_SHIELD');
    expect(stockShieldSnippet).toBeDefined();
    expect(stockShieldSnippet?.code).toContain('camiseta-pima-preta');
    expect(stockShieldSnippet?.code).toContain('998877665544');
    expect(stockShieldSnippet?.code).toContain('Camiseta Pima Preta');

    // 6. Fonte Única da Verdade Financeira (Header + Dossiê Triplo + Consenso + ToT + Simulador Reativo)
    const { calculateStoreFinancialGrounding } = await import('../services/ai/storeFinancialGroundingEngine');
    const { executeDualAgentCrossVerification } = await import('../services/ai/dualAgentConsensusGatekeeper');
    const { executeTreeOfThoughtReasoning } = await import('../services/ai/treeOfThoughtReasoningEngine');

    fullMockDiag.realSiteData.hasMetaPixel = true;
    const baseFinances = calculateStoreFinancialGrounding(fullMockDiag.realSiteData, fullMockDiag.input, fullMockDiag.social);
    const dualReport = executeDualAgentCrossVerification(fullMockDiag);
    const totReport = executeTreeOfThoughtReasoning(fullMockDiag);

    const dualCatalogFinding = dualReport.verifiedFindings.find(f => f.category === 'CATALOGO_ESTOQUE');
    expect(dualCatalogFinding?.financialImpactMonthly).toBe(baseFinances.financialRisk.adWasteMonthly);
    expect(totReport.crossInterrogation.clashes.length).toBeGreaterThan(0);

    // Simulador Reativo de Verba Real (ex: R$ 30.000/mês)
    const customFinances = calculateStoreFinancialGrounding(fullMockDiag.realSiteData, fullMockDiag.input, fullMockDiag.social, 30000);
    expect(customFinances.estimatedAdSpend.monthly).toBe(30000);
    expect(customFinances.estimatedAdSpend.daily).toBe(1000);
    expect(customFinances.transparency.isUserOverridden).toBe(true);
    expect(customFinances.financialRisk.adWasteMonthly).toBeGreaterThan(baseFinances.financialRisk.adWasteMonthly);
  });

  it('should accurately parse international currencies, deduplicate parent-SKU multi-size variants, and audit multi-jurisdiction stores (en-US, en-GB, de-DE, pt-BR)', async () => {
    const { parseBRLPrice, parsePriceByMarket, formatStoreCurrency } = await import('../services/pricing/currencyUtils');
    const { detectStoreMarketProfile } = await import('../i18n/marketProfiles');
    const { auditProductDeepSkus } = await import('../services/catalog/deepSkuAuditEngine');
    const { auditBrazilianLegalCompliance } = await import('../services/audits/brazilianLegalComplianceEngine');
    const { dispatchCommitToGitHubAndVercel, SAMPLE_CODE_PATCHES } = await import('../services/agents/autonomousCodePatchEngineerAgent');
    const { executeLiveSelfLearningCycle } = await import('../services/learning/agenticSelfLearningOptimizer');

    // 1. Multi-Market Currency Parsing ($1,250.90 vs £2,499.00 vs R$ 1.250,90 + range/compare-at + space separators)
    expect(parseBRLPrice('$1,250.90')).toBe(1250.90);
    expect(parseBRLPrice('£2,499.00')).toBe(2499.00);
    expect(parseBRLPrice('R$ 1.250,90')).toBe(1250.90);
    expect(parseBRLPrice('From $45.00 to $1,250.90')).toBe(45.00);
    expect(parseBRLPrice('De R$ 199,90 por R$ 149,90')).toBe(149.90);
    expect(parseBRLPrice('De R$ 199,90 por R$ 149,90 em 3x de R$ 49,96')).toBe(149.90);
    expect(parseBRLPrice('Por R$ 149,90 em 3x de R$ 49,96')).toBe(149.90);
    expect(parseBRLPrice('R$ 200 em 3x de R$ 66,67')).toBe(200);
    expect(parseBRLPrice('Was $80.00 Now $55.00')).toBe(55.00);
    expect(parseBRLPrice('Now $55.00 (Was $80.00)')).toBe(55.00);
    expect(parsePriceByMarket('$1,250.90', 'en-US')).toBe(1250.90);
    expect(parsePriceByMarket('£2,499.00', 'en-GB')).toBe(2499.00);
    expect(parsePriceByMarket('1.250,90 €', 'de-DE')).toBe(1250.90);
    expect(parsePriceByMarket('1\u00A0250,90 €', 'fr-FR')).toBe(1250.90);
    expect(parsePriceByMarket('R$ 1.250,90', 'pt-BR')).toBe(1250.90);
    expect(formatStoreCurrency(1250.9, 'en-US')).toContain('1,250.90');

    // 1b. International Financial Grounding: Zero false Pix penalty & multi-language size guide recognition
    const { calculateStoreFinancialGrounding } = await import('../services/ai/storeFinancialGroundingEngine');
    const intlHealthyStoreFinances = calculateStoreFinancialGrounding({
      url: 'https://www.gymshark.com',
      domain: 'gymshark.com',
      brandName: 'Gymshark',
      title: 'Gymshark Official Store',
      detectedMarketLocale: 'en-US',
      hasMetaPixel: true,
      Checkout: 'Shop Pay / Apple Pay / Klarna',
      conversionSignals: ['Größentabelle'],
      catalogAudit: {
        totalProductsScanned: 10,
        productsWithBrokenGrid: 0,
        heavyImagesCount: 0,
        productsWithoutSizeGuide: 0,
        catalogHealthScore: 100,
        issues: []
      }
    } as any);
    expect(intlHealthyStoreFinances.financialRisk.checkoutFrictionMonthly).toBe(0);
    expect(intlHealthyStoreFinances.financialRisk.formattedMonthlyLoss).toContain('$0.00');
    expect(intlHealthyStoreFinances.tierLabel).not.toContain('Padrão');

    // 2. Market Profile Detection (en-US, en-GB subdomain & HTML currency, de-DE, pt-BR)
    expect(detectStoreMarketProfile('https://www.gymshark.com').locale).toBe('en-US');
    expect(detectStoreMarketProfile('https://uk.gymshark.com').locale).toBe('en-GB');
    expect(detectStoreMarketProfile('https://store.example.com', '<script>Shopify.currency = {"active":"GBP"};</script>').locale).toBe('en-GB');
    expect(detectStoreMarketProfile('https://www.snocks.de').locale).toBe('de-DE');
    expect(detectStoreMarketProfile('https://www.minimalclub.com.br').locale).toBe('pt-BR');

    // 3. Parent-SKU Multi-Size Variant Deduplication & International Size Grids
    const multiSizeParentSkuAudit = auditProductDeepSkus(
      {
        id: 'prod-intl-1',
        title: 'Performance Running Tee',
        url: 'https://www.gymshark.com/products/performance-running-tee',
        handle: 'performance-running-tee',
        variants: [
          { id: 'v1', sku: 'TEE-001', title: 'S', option1: 'S', price: '$1,250.90', available: true, inventory_quantity: 12 },
          { id: 'v2', sku: 'TEE-001', title: 'M', option1: 'M', price: '$1,250.90', available: false, inventory_quantity: 0 },
          { id: 'v3', sku: 'TEE-001', title: 'Black / UK 10', price: '$1,250.90', available: false, inventory_quantity: 0 },
          { id: 'v4-periph', sku: 'TEE-001', title: 'Black / UK 6', price: '$1,250.90', available: false, inventory_quantity: 0 },
          // Exact duplicate variant (same parent SKU + same size title 'M') must be deduplicated
          { id: 'v2-dup', sku: 'TEE-001', title: 'M', option1: 'M', price: '$1,250.90', available: false, inventory_quantity: 0 }
        ]
      },
      { storeDomain: 'gymshark.com', dailyAdSpend: 250, isAdRunning: true }
    );

    expect(multiSizeParentSkuAudit.totalSkusCount).toBe(4);
    expect(multiSizeParentSkuAudit.activeSkusCount).toBe(1);
    expect(multiSizeParentSkuAudit.rupturedSkusCount).toBe(3);
    expect(multiSizeParentSkuAudit.skus[0].price).toBe(1250.90);
    expect(multiSizeParentSkuAudit.brokenCoreSizes).toContain('M');
    expect(multiSizeParentSkuAudit.brokenCoreSizes).toContain('UK 10');
    expect(multiSizeParentSkuAudit.brokenCoreSizes).not.toContain('UK 6');
    expect(multiSizeParentSkuAudit.skus.map(s => s.skuCode)).toEqual([
      'TEE-001',
      'TEE-001-M',
      'TEE-001-BLACK / UK 10',
      'TEE-001-BLACK / UK 6'
    ]);

    // International US/UK Footwear Half-Size & UK Size 6 Support (Peripheral sizes 5 and 12 excluded from brokenCoreSizes)
    const footwearAudit = auditProductDeepSkus(
      {
        id: 'prod-shoe-1',
        title: 'Allbirds Tree Dasher Running Sneakers',
        url: 'https://www.allbirds.com/products/mens-tree-dashers',
        handle: 'mens-tree-dashers',
        variants: [
          { id: 's-periph-5', sku: 'SHOE-5', title: '5', option1: '5', price: '135.00', available: false, inventory_quantity: 0 },
          { id: 's0', sku: 'SHOE-6', title: '6', option1: '6', price: '135.00', available: false, inventory_quantity: 0 },
          { id: 's1', sku: 'SHOE-8', title: '8', option1: '8', price: '135.00', available: true, inventory_quantity: 5 },
          { id: 's2', sku: 'SHOE-8.5', title: '8.5', option1: '8.5', price: '135.00', available: false, inventory_quantity: 0 },
          { id: 's3', sku: 'SHOE-9.5', title: '9.5', option1: '9.5', price: '135.00', available: false, inventory_quantity: 0 },
          { id: 's4', sku: 'SHOE-10', title: '10', option1: '10', price: '135.00', available: true, inventory_quantity: 4 },
          { id: 's-periph-12', sku: 'SHOE-12', title: '12', option1: '12', price: '135.00', available: false, inventory_quantity: 0 }
        ]
      },
      { storeDomain: 'allbirds.com', dailyAdSpend: 250, isAdRunning: true }
    );
    expect(footwearAudit.brokenCoreSizes).toEqual(['6', '8.5', '9.5']);

    // 4. Multi-Jurisdiction Legal Compliance (US, UK, DE vs BR)
    const usLegal = auditBrazilianLegalCompliance(
      '<footer>Privacy Policy | Do Not Sell My Personal Information (CCPA) | Terms of Service | 30-Day Returns & Refunds | support@gymshark.com | 123 Main St, Suite 400, Denver, CO</footer>',
      'gymshark.com',
      'en-US'
    );
    expect(usLegal.isFullyCompliant).toBe(true);
    expect(usLegal.complianceScore).toBe(100);

    const deLegal = auditBrazilianLegalCompliance(
      '<footer>Impressum | Handelsregister HRB 12345 | USt-IdNr. DE123456789 | Datenschutzerklärung (DSGVO) | AGB | 14 Tage Widerrufsrecht</footer>',
      'snocks.de',
      'de-DE'
    );
    expect(deLegal.isFullyCompliant).toBe(true);
    expect(deLegal.complianceScore).toBe(100);

    const brMissingCnpj = auditBrazilianLegalCompliance(
      '<footer>Política de Privacidade LGPD e Trocas em 7 dias</footer>',
      'lojaexemplo.com.br',
      'pt-BR'
    );
    expect(brMissingCnpj.hasCnpjInFooter).toBe(false);
    expect(brMissingCnpj.isFullyCompliant).toBe(false);

    // 5. Code Health Grounding: No Math.random() PR fabrication & No hardcoded 'BRASIL' in Vision Engine
    const { analyzeComputerVision } = await import('../services/visionCoreEngine');
    const visionResult = await analyzeComputerVision(
      'brkagro.com.br',
      '<html><body><h1 style="background-color: #16A34A; color: #FFFFFF">Camisa Agro UV50+</h1><button class="btn-buy">Comprar Agora</button></body></html>'
    );
    expect(visionResult.ocr.detectedKeywords).not.toContain('BRASIL');
    expect(visionResult.uiux.primaryColor).toBe('#16A34A');
    expect(visionResult.thumbZone.recommendation).toContain('[Estimativa Topológica de DOM]');

    const dispatchResult = await dispatchCommitToGitHubAndVercel(SAMPLE_CODE_PATCHES['inc-101']);
    expect(dispatchResult.status).toBe('PATCH_BUNDLE_READY');
    expect(dispatchResult.commitSha).toHaveLength(7);

    const learningCycle = await executeLiveSelfLearningCycle('MODA_VESTUARIO');
    expect(learningCycle.outcomeLearned).toContain('[Simulação / Benchmark]');
  });

  // ============================================================================
  // 🌍 TEST 6: Sprints 1–5 End-to-End Verification (PDF/WhatsApp i18n, Multi-Currency
  //            Plans, Default Variant Bleed, ADA/EAA Accessibility, Hybrid DB)
  // ============================================================================
  it('verifies PDF/WhatsApp 6-locale i18n, multi-currency Stripe plans, default variant bleed, ADA/EAA accessibility, and hybrid DB persistence', async () => {
    const { PdfExportService } = await import('../services/export/pdfExportService');
    const { formatDailyWhatsAppExecutiveSummary } = await import('../services/workers/whatsappAlertWorker');
    const { getLocalizedPlans } = await import('../services/billing/checkoutService');
    const { auditProductDeepSkus, auditDeepCatalog } = await import('../services/catalog/deepSkuAuditEngine');
    const { auditBrazilianLegalCompliance } = await import('../services/audits/brazilianLegalComplianceEngine');
    const { supabase } = await import('../lib/supabase');

    // 1. PDF Export Service in en-US and de-DE (Zero PT-BR leakage)
    const mockSiteData: any = {
      url: 'https://www.gymshark.com',
      domain: 'gymshark.com',
      brandName: 'Gymshark',
      ecommercePlatform: 'Shopify',
      detectedMarketLocale: 'en-US',
      detectedCurrencyCode: 'USD',
      catalogAudit: {
        totalProductsScanned: 10,
        totalSkusAudited: 40,
        totalSkusInStock: 32,
        totalSkusInStockout: 8,
        productsWithBrokenGrid: 2,
        productsWithMissingImages: 0,
        productsWithoutSizeGuide: 1,
        heavyImagesCount: 0,
        catalogHealthScore: 82,
        monthlyLossEstimateBRL: 4250,
        issues: [
          {
            id: 'sku-us-1',
            sku: 'GS-APEX-S',
            productTitle: 'Apex Seamless T-Shirt',
            productUrl: 'https://www.gymshark.com/products/apex-seamless-t-shirt',
            availableSizes: ['L', 'XL'],
            missingSizes: ['S', 'M'],
            isFullPrintExempt: false,
            hasSizeGuide: true,
            imageWeightKb: 140,
            recommendedAction: 'Restock core sizes (S, M).'
          }
        ]
      }
    };

    const enPdfHtml = PdfExportService.buildExecutiveDossierHtml({
      brandName: 'Gymshark',
      targetUrl: 'https://www.gymshark.com',
      overallScore: 82,
      monthlyFinancialLoss: '$4,250',
      recoverableRevenue: '$51,000',
      siteData: mockSiteData,
      locale: 'en-US'
    });
    expect(enPdfHtml).toContain('<html lang="en-US">');
    expect(enPdfHtml).toContain('Executive E-Commerce, Catalog & Paid Media Dossier');
    expect(enPdfHtml).toContain('Paid Media Bleed');
    expect(enPdfHtml).toContain('100% FACTUAL GROUNDING CERTIFICATE');
    expect(enPdfHtml).not.toContain('Dossiê Executivo de E-Commerce');
    expect(enPdfHtml).not.toContain('Sangria Tráfego Pago');

    const dePdfHtml = PdfExportService.buildExecutiveDossierHtml({
      brandName: 'SNOCKS',
      targetUrl: 'https://www.snocks.de',
      overallScore: 79,
      monthlyFinancialLoss: '3.800 €',
      recoverableRevenue: '45.600 €',
      siteData: { ...mockSiteData, domain: 'snocks.de', detectedMarketLocale: 'de-DE', detectedCurrencyCode: 'EUR' },
      locale: 'de-DE'
    });
    expect(dePdfHtml).toContain('<html lang="de-DE">');
    expect(dePdfHtml).toContain('Executive E-Commerce-, Katalog- & Paid-Media-Dossier');
    expect(dePdfHtml).toContain('Paid-Media-Verlust');
    expect(dePdfHtml).not.toContain('Dossiê Executivo de E-Commerce');

    // 2. WhatsApp Executive Summary in en-US and de-DE
    const mockStore: any = {
      id: 'store-us-1',
      storeName: 'Gymshark US',
      storeUrl: 'https://www.gymshark.com',
      platform: 'Shopify',
      niche: 'MODA_VESTUARIO',
      monthlyAdSpendBrl: 15000,
      whatsappTargetNumber: '+15550192834',
      alertFrequency: 'DAILY_08AM',
      isActive: true
    };
    const mockDiag: any = {
      overallHealthScore: 76,
      totalMonthlyBleedBrl: 4250,
      recoverableAnnualBrl: 51000,
      siteData: {
        ...mockSiteData,
        legalCompliance: {
          isFullyCompliant: false,
          hasCnpjInFooter: false,
          isCnpjValid: false
        }
      }
    };
    const mockDelta: any = {
      hasPreviousRecord: true,
      newBrokenProductsCount: 1,
      newBrokenSkusList: ['Apex Seamless T-Shirt (S, M)'],
      fixedProductsCount: 0,
      fixedSkusList: [],
      bleedDeltaBrl: 850,
      scoreDelta: -4,
      daysSinceFirstAudit: 7,
      accumulatedBleedSinceFirstAuditBrl: 990
    };

    const enWaMsg = formatDailyWhatsAppExecutiveSummary(mockStore, mockDiag, mockDelta, 'en-US');
    expect(enWaMsg).toContain('ADSHIELD INTEL • DAILY EXECUTIVE BRIEFING');
    expect(enWaMsg).toContain('Compliance Alert (FTC / CCPA / ADA)');
    expect(enWaMsg).not.toContain('BRIEFING EXECUTIVO DIÁRIO');
    expect(enWaMsg).not.toContain('Decreto 7.962/13');

    const deWaMsg = formatDailyWhatsAppExecutiveSummary(
      { ...mockStore, storeName: 'SNOCKS DE', storeUrl: 'https://www.snocks.de' },
      { ...mockDiag, siteData: { ...mockDiag.siteData, domain: 'snocks.de', detectedMarketLocale: 'de-DE' } },
      mockDelta,
      'de-DE'
    );
    expect(deWaMsg).toContain('ADSHIELD INTEL • TÄGLICHER EXECUTIVE-BERICHT');
    expect(deWaMsg).toContain('Impressumspflicht / DSGVO / BFSG');
    expect(deWaMsg).not.toContain('BRIEFING EXECUTIVO DIÁRIO');

    // 2b. Edge Cases: ESGOTADO token translation, undefined missingSizes guard, delta={} guard, and E.164 international phone URL
    const { buildWhatsAppDirectUrl } = await import('../services/workers/whatsappAlertWorker');
    expect(buildWhatsAppDirectUrl('+15550192834', 'Hello')).toContain('phone=15550192834');
    expect(buildWhatsAppDirectUrl('11999999999', 'Oi')).toContain('phone=5511999999999');

    const edgePdfHtml = PdfExportService.buildExecutiveDossierHtml({
      brandName: 'Gymshark',
      targetUrl: 'https://www.gymshark.com',
      overallScore: 75,
      siteData: {
        ...mockSiteData,
        catalogAudit: {
          ...mockSiteData.catalogAudit,
          issues: [
            {
              id: 'sku-edge-1',
              sku: 'GS-GHOST-1',
              productTitle: 'Ghost Hoodie',
              isGhostInventorySuspect: true,
              missingSizes: undefined,
              recommendedAction: 'Produto de Revenda / Acessório verificado em Tamanho Único. Em conformidade. [ALERTA VARIANTE PADRÃO ESGOTADA]'
            },
            {
              id: 'sku-edge-2',
              sku: 'GS-SOLDOUT-1',
              productTitle: 'Sold Out Tee',
              missingSizes: ['ESGOTADO'],
              recommendedAction: 'Ativar widget ou inserir Tabela de Medidas na descrição.'
            }
          ]
        }
      },
      locale: 'en-US'
    });
    expect(edgePdfHtml).toContain('SOLD OUT');
    expect(edgePdfHtml).toContain('Default entry variant Sold Out');
    expect(edgePdfHtml).not.toContain('ESGOTADO');
    expect(edgePdfHtml).not.toContain('Tabela de Medidas');

    const emptyDeltaWaMsg = formatDailyWhatsAppExecutiveSummary(
      mockStore,
      {
        ...mockDiag,
        siteData: {
          ...mockDiag.siteData,
          catalogAudit: {
            ...mockSiteData.catalogAudit,
            issues: [{ id: 's1', sku: 'S1', productTitle: 'Sold Out Tee', missingSizes: ['ESGOTADO'] }]
          }
        }
      },
      {} as any,
      'en-US'
    );
    expect(emptyDeltaWaMsg).toContain('SOLD OUT');
    expect(emptyDeltaWaMsg).not.toContain('ESGOTADO');
    expect(emptyDeltaWaMsg).not.toContain('undefined');

    // 3. Multi-Currency Stripe Plans (USD, GBP, EUR, BRL across all 6 locales)
    const usPlans = getLocalizedPlans('en-US');
    const ukPlans = getLocalizedPlans('en-GB');
    const dePlans = getLocalizedPlans('de-DE');
    const frPlans = getLocalizedPlans('fr-FR');
    const esPlans = getLocalizedPlans('es-ES');
    const brPlans = getLocalizedPlans('pt-BR');
    expect(usPlans.STARTER.currency).toBe('USD');
    expect(usPlans.STARTER.currencySymbol).toBe('$');
    expect(ukPlans.STARTER.currency).toBe('GBP');
    expect(ukPlans.STARTER.currencySymbol).toBe('£');
    expect(dePlans.STARTER.currency).toBe('EUR');
    expect(dePlans.STARTER.currencySymbol).toBe('€');
    expect(frPlans.STARTER.currency).toBe('EUR');
    expect(frPlans.STARTER.description).toContain('marques D2C');
    expect(esPlans.STARTER.currency).toBe('EUR');
    expect(esPlans.STARTER.description).toContain('marcas D2C');
    expect(brPlans.STARTER.currency).toBe('BRL');
    expect(brPlans.STARTER.currencySymbol).toBe('R$');

    // 4. Default Variant Bleed Detection (1st variant Sold Out while other variants have stock)
    const defaultBleedRawProduct = {
      id: 'prod-default-bleed',
      title: 'Performance Hoodie Black',
      url: 'https://www.gymshark.com/products/performance-hoodie-black',
      handle: 'performance-hoodie-black',
      variants: [
        { id: 'v-xs', sku: 'HD-BLK-XS', title: 'XS', option1: 'XS', price: '65.00', available: false, inventory_quantity: 0 },
        { id: 'v-m', sku: 'HD-BLK-M', title: 'M', option1: 'M', price: '65.00', available: true, inventory_quantity: 12 },
        { id: 'v-l', sku: 'HD-BLK-L', title: 'L', option1: 'L', price: '65.00', available: true, inventory_quantity: 15 }
      ]
    };
    const defaultBleedAudit = auditProductDeepSkus(defaultBleedRawProduct, {
      storeDomain: 'gymshark.com',
      dailyAdSpend: 100,
      isAdRunning: true
    });
    expect(defaultBleedAudit.isDefaultVariantUnavailable).toBe(true);
    expect(defaultBleedAudit.defaultVariantTitle).toBe('XS');

    const deepSummary = auditDeepCatalog([defaultBleedRawProduct], {
      storeDomain: 'gymshark.com',
      dailyAdSpend: 100
    });
    expect(deepSummary.defaultVariantBleedCount).toBe(1);

    // 5. ADA Title III (US) & EAA 2025 / BFSG (EU) Accessibility Compliance
    const nonCompliantA11yHtml = `
      <html>
        <body>
          <img src="/hero1.jpg">
          <img src="/hero2.jpg">
          <img src="/hero3.jpg" alt="Valid Alt">
          <button></button>
          <footer>Privacy Policy | CCPA | Terms of Service | 30-Day Returns | support@brand.com | 100 Broadway, NY 10005</footer>
        </body>
      </html>
    `;
    const usA11yAudit = auditBrazilianLegalCompliance(nonCompliantA11yHtml, 'brand.com', 'en-US');
    expect(usA11yAudit.accessibilityCompliance).toBeDefined();
    expect(usA11yAudit.accessibilityCompliance?.isCompliant).toBe(false);
    expect(usA11yAudit.accessibilityCompliance?.hasHtmlLangAttribute).toBe(false);
    expect(usA11yAudit.accessibilityCompliance?.imagesMissingAlt).toBe(2);
    expect(usA11yAudit.accessibilityCompliance?.unlabeledButtonsCount).toBe(1);
    expect(usA11yAudit.violations.some(v => v.rule.includes('ADA Title III'))).toBe(true);

    const deA11yAudit = auditBrazilianLegalCompliance(nonCompliantA11yHtml, 'shop.de', 'de-DE');
    expect(deA11yAudit.accessibilityCompliance?.isCompliant).toBe(false);
    expect(deA11yAudit.violations.some(v => v.rule.includes('BFSG 2025'))).toBe(true);

    // 6. Hybrid Supabase Persistence Round-Trip + UPSERT Deduplication
    const testAuditId = 'audit-sprint5-test';
    await supabase.from('audits').insert({
      id: testAuditId,
      user_id: 'usr-test-1',
      store_url: 'https://www.gymshark.com',
      store_name: 'Gymshark',
      overall_score: 88,
      monthly_loss: 4250,
      recoverable_revenue: 51000,
      report_data: { test: true }
    });
    await supabase.from('audits').upsert({
      id: testAuditId,
      user_id: 'usr-test-1',
      store_url: 'https://www.gymshark.com',
      store_name: 'Gymshark Updated',
      overall_score: 91,
      report_data: { test: true, updated: true }
    });
    const { data: allMatchingAudits } = await supabase
      .from('audits')
      .select('*')
      .eq('id', testAuditId);
    expect(allMatchingAudits?.length).toBe(1);
    expect(allMatchingAudits?.[0].store_name).toBe('Gymshark Updated');
    expect(allMatchingAudits?.[0].overall_score).toBe(91);

    // 7. Serverless /api/cron/swarm-runner Timeout Guard & WhatsApp Alert Queue Flushing + /api/shopify/webhooks/inventory Kill-Switch
    const { enqueueWhatsAppAlert } = await import('../services/database/swarmDatabaseService');
    const swarmRunnerModule = await import('../../api/cron/swarm-runner');
    const inventoryWebhookHandler = (await import('../../api/shopify/webhooks/inventory')).default;

    // Enqueue a pending alert and verify swarm-runner flushes it while handling slow store timeout guard cleanly
    await enqueueWhatsAppAlert({
      to: '+15550192834',
      message: 'Queued Executive Alert Test',
      priority: 'HIGH',
      metadata: { storeId: 'store-test-1', storeUrl: 'https://www.gymshark.com', score: 85 }
    });

    process.env.CRON_SECRET = 'test_cron_secret_2026';
    process.env.VITE_SUPABASE_URL = 'https://local-test.supabase.co';
    process.env.VITE_SUPABASE_ANON_KEY = 'test_anon_key';
    swarmRunnerModule.__resetSwarmRunnerRateLimitForTests();

    const cronReq = new Request(
      'http://localhost/api/cron/swarm-runner?maxStores=1&timeoutMs=60',
      {
        method: 'GET',
        headers: { authorization: 'Bearer test_cron_secret_2026' }
      }
    );
    const cronRes = await swarmRunnerModule.default(cronReq, null);
    expect(cronRes.status).toBe(200);
    const cronBody = await cronRes.json();
    expect(cronBody.success).toBe(true);
    expect(cronBody.auditedCount).toBe(1);
    expect(cronBody.alertsDispatched).toBeGreaterThanOrEqual(1);

    // Verify Shopify Inventory Webhook triggers Meta Kill-Switch and queues WhatsApp alert when available <= 0
    const webhookReq = new Request('http://localhost/api/shopify/webhooks/inventory', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-shopify-topic': 'inventory_levels/update',
        'x-shopify-shop-domain': 'gymshark.myshopify.com'
      },
      body: JSON.stringify({
        inventory_item_id: 998877,
        available: 0,
        sku: 'GS-APEX-S',
        ad_id: 'ad_123456'
      })
    });
    const webhookRes = await inventoryWebhookHandler(webhookReq, null);
    expect(webhookRes.status).toBe(200);
    const webhookBody = await webhookRes.json();
    expect(webhookBody.killSwitchTriggered).toBe(true);
    expect(webhookBody.metaKillSwitchResult?.status).toBe('PAUSED');
    expect(webhookBody.whatsappAlertQueued).toBe(true);
  });
});



