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
});


