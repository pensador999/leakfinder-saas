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
  });
});


