/**
 * 💳 SERVIÇO UNIFICADO DE BILLING & MONETIZAÇÃO (STRIPE + ASAAS PIX)
 * Arquitetura preparada para Due Diligence e Compradores do Acquire.com
 */

export interface PricingPlan {
  id: 'FREE' | 'STARTER_MONTHLY' | 'PRO_MONTHLY' | 'AGENCY_SCALE' | 'ENTERPRISE';
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
    name: 'Diagnóstico Gratuito (Lead Magnet)',
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
    id: 'STARTER_MONTHLY',
    name: 'Starter Sentinel',
    priceBrlMonthly: 297,
    priceUsdMonthly: 59,
    creditsPerMonth: 50,
    stripePriceId: 'price_adshield_starter_297',
    features: [
      '1 Loja Virtual Monitorada 24/7 (Varredura a cada 60m)',
      'Alertas de Ruptura de Grade no WhatsApp da Equipe',
      'Extensão Chrome Manifest V3 Oficial AdShield',
      'Calculadora Atuarial de Sangria Financeira em R$',
      'Dossiê Executivo em PDF & Garantia Incondicional de 7 Dias'
    ]
  },
  {
    id: 'PRO_MONTHLY',
    name: 'Growth Pro Shield & Vigia 24h',
    priceBrlMonthly: 497,
    priceUsdMonthly: 97,
    creditsPerMonth: 150,
    isPopular: true,
    stripePriceId: 'price_adshield_pro_497',
    features: [
      'Até 3 Lojas Inspecionadas 24/7 (Varredura 15-30m)',
      'AdShield Kill-Switch: Gatilho via Pixel (AdShield_BrokenCoreSize_View) & Alerta < 60s',
      'Vigia 24h com Alertas no WhatsApp às 07:00 ou < 60s',
      'Simulador Dinâmico de Elasticidade e Desconto Pix',
      'Inspeção SKU por SKU do Catálogo ao Vivo',
      'Snippets Liquid Prontos (Sticky Button + Desconto Pix)',
      'Exportação de Planilhas em Excel (.CSV) e PDF',
      'Garantia Incondicional de 7 Dias (CDC Art. 49)'
    ]
  },
  {
    id: 'AGENCY_SCALE',
    name: 'Agency Scale White-Label',
    priceBrlMonthly: 1497,
    priceUsdMonthly: 297,
    creditsPerMonth: 9999,
    stripePriceId: 'price_adshield_agency_1497',
    features: [
      'Até 15 Lojas de Clientes Conectadas Simultaneamente',
      'Auditorias Ilimitadas e Relatórios 100% White-Label',
      'Caçador de Leads Outbound Ilimitado para WhatsApp',
      'Acesso ao Servidor MCP e aos 18 Agentes de IA',
      'Painel de Controle Unificado de Clientes da Agência',
      'Suporte Prioritário Direto com Engenharia no WhatsApp',
      'Pitches de Fechamento B2B Prontos em 1 Clique'
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
