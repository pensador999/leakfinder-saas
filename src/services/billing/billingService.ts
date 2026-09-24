/**
 * 💳 SERVIÇO UNIFICADO DE BILLING & MONETIZAÇÃO (STRIPE + ASAAS PIX)
 * Arquitetura preparada para Due Diligence e Compradores do Acquire.com
 */

export interface PricingPlan {
  id: 'FREE' | 'PRO_MONTHLY' | 'AGENCY_SCALE' | 'ENTERPRISE';
  name: string;
  priceBrlMonthly: number;
  priceUsdMonthly: number;
  creditsPerMonth: number;
  features: string[];
  stripePriceId?: string;
  isPopular?: boolean;
}

export const SAAS_PRICING_PLANS: PricingPlan[] = [
  {
    id: 'FREE',
    name: 'Diagnóstico Gratuito',
    priceBrlMonthly: 0,
    priceUsdMonthly: 0,
    creditsPerMonth: 3,
    features: [
      '3 Auditorias Rápidas de E-Commerce',
      'Detecção de Pixels e Scripts Básicos',
      'Diagnóstico Heurístico de Conversão',
      'Visualização Web do Relatório'
    ]
  },
  {
    id: 'PRO_MONTHLY',
    name: 'Lojista Pro & Vigia 24h',
    priceBrlMonthly: 147,
    priceUsdMonthly: 29,
    creditsPerMonth: 50,
    isPopular: true,
    stripePriceId: 'price_pro_monthly_live',
    features: [
      '50 Auditorias Completas por Mês',
      'Vigia 24h com Alertas no WhatsApp às 07:00',
      'Simulador Dinâmico de Elasticidade Pix',
      'Inspeção SKU por SKU do Catálogo',
      'Exportação de Planilhas em Excel (.CSV)',
      'Exportação de Relatórios Executivos em PDF'
    ]
  },
  {
    id: 'AGENCY_SCALE',
    name: 'Agência & Consultoria Scale',
    priceBrlMonthly: 497,
    priceUsdMonthly: 99,
    creditsPerMonth: 9999,
    stripePriceId: 'price_agency_scale_live',
    features: [
      'Auditorias Ilimitadas de Lojas',
      'Relatórios 100% White-Label (Seu Logo e Marca)',
      'Acesso ao Servidor MCP para Claude e Cursor',
      'Conexão de Múltiplas Lojas Shopify/Meta Ads',
      'Suporte Prioritário Direto com Engenharia',
      'Pitch Pronto em 1 Clique para WhatsApp'
    ]
  }
];

export class BillingService {
  /**
   * Inicia o fluxo de checkout com Stripe ou Asaas (Pix)
   */
  public static async createCheckoutSession(params: {
    planId: 'PRO_MONTHLY' | 'AGENCY_SCALE';
    gateway: 'STRIPE' | 'ASAAS_PIX';
    userEmail: string;
    userName?: string;
  }): Promise<{ checkoutUrl?: string; pixQrCode?: string; pixCopyPaste?: string }> {
    const plan = SAAS_PRICING_PLANS.find(p => p.id === params.planId);
    if (!plan) throw new Error('Plano não encontrado');

    if (params.gateway === 'ASAAS_PIX') {
      // Simulação estruturada do gateway Asaas Pix
      const mockPixCode = `00020126580014br.gov.bcb.pix0136adshield-prod-${Date.now()}520400005303986540${plan.priceBrlMonthly}.005802BR5908ADSHIELD6009SAOPAULO62070503***6304`;
      
      return {
        pixQrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(mockPixCode)}`,
        pixCopyPaste: mockPixCode
      };
    }

    // Stripe Checkout Session URL
    return {
      checkoutUrl: `https://checkout.stripe.com/c/pay/cs_live_${Date.now()}?plan=${plan.id}`
    };
  }

  /**
   * Verifica se o usuário tem créditos suficientes para rodar a auditoria
   */
  public static hasSufficientCredits(creditsLeft: number, userTier: string): boolean {
    if (userTier === 'AGENCY_SCALE' || userTier === 'ENTERPRISE') return true;
    return creditsLeft > 0;
  }
}
