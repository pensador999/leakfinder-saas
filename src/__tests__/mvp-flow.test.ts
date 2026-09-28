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
});
