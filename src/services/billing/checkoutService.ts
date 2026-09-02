// ==============================================================================
// 💳 ADSHIELD TRANSPARENT CHECKOUT & BILLING ENGINE
// Prepared for Asaas / Stripe / Mercado Pago webhook & 1-click tokenization
// ==============================================================================

export type PaymentMethod = 'PIX' | 'CREDIT_CARD';
export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type PlanTierId = 'STARTER' | 'GROWTH_PRO' | 'AGENCY_ENTERPRISE';

export interface PlanDetails {
  id: PlanTierId;
  name: string;
  badge?: string;
  monthlyPrice: number;
  yearlyMonthlyPrice: number; // 20% discount
  yearlyTotalPrice: number;
  description: string;
  features: string[];
  recommended?: boolean;
}

export const SAAS_PLANS: Record<PlanTierId, PlanDetails> = {
  STARTER: {
    id: 'STARTER',
    name: 'Starter Monitor',
    monthlyPrice: 197,
    yearlyMonthlyPrice: 157,
    yearlyTotalPrice: 1884,
    description: 'Para lojistas únicos e consultores independentes.',
    features: [
      '1 Loja Virtual Monitorada 24/7',
      'Auditoria de Ruptura de Grade (PP a G2)',
      'Alertas de Anúncio Fantasma via E-mail',
      'Diagnóstico de Conformidade CDC Art. 49 e CNPJ',
      'Dossiê Executivo em PDF'
    ]
  },
  GROWTH_PRO: {
    id: 'GROWTH_PRO',
    name: 'Growth Pro Shield',
    badge: 'MAIS ESCOLHIDO',
    monthlyPrice: 497,
    yearlyMonthlyPrice: 397,
    yearlyTotalPrice: 4764,
    description: 'Para e-commerces em escala e operações multicanal (Sankhya/Magis5).',
    features: [
      'Até 3 Lojas Virtuais Monitoradas',
      'Módulo de Descompasso Sankhya ERP & Magis5 Hub',
      'Alertas Instantâneos no WhatsApp da Equipe',
      'Visão Computacional & Ergonomia Mobile (Fitts / WCAG)',
      'Playbooks de Ação em 1-Clique para Tráfego e PCP',
      'Suporte Prioritário VIP via WhatsApp'
    ],
    recommended: true
  },
  AGENCY_ENTERPRISE: {
    id: 'AGENCY_ENTERPRISE',
    name: 'Agency Enterprise',
    badge: 'AGÊNCIAS & MULTI-LOJAS',
    monthlyPrice: 997,
    yearlyMonthlyPrice: 797,
    yearlyTotalPrice: 9564,
    description: 'Para Agências de Performance e grandes operações industriais.',
    features: [
      'Lojas e Auditorias Ilimitadas',
      'PDF White-Label Completo (Sua Logo e Cores)',
      'Radar de Prospecção Ativa de Clientes',
      'Acesso a todos os 12 Agentes de Inteligência Artificial',
      'Integração via Webhook / CRM / Zapier',
      'Gerente de Contas Dedicado'
    ]
  }
};

export interface BuyerFormData {
  fullName: string;
  email: string;
  phone: string;
  document: string; // CPF or CNPJ
}

export interface CreditCardFormData {
  cardNumber: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  installments: number;
}

export interface PaymentTransactionResult {
  transactionId: string;
  status: 'APPROVED' | 'PENDING_PIX' | 'REJECTED';
  planId: PlanTierId;
  cycle: BillingCycle;
  amount: number;
  paymentMethod: PaymentMethod;
  pixPayload?: {
    qrCodeBase64: string;
    copiaECola: string;
    expiresAt: string;
  };
  paidAt?: string;
  customerEmail: string;
}

const LOCAL_STORAGE_LICENSE_KEY = 'adshield_active_license_v1';

/**
 * Simulates or executes 1-click PIX generation with dynamic QR Code
 */
export function generatePixPayment(
  plan: PlanDetails,
  cycle: BillingCycle,
  buyer: BuyerFormData
): PaymentTransactionResult {
  const amount = cycle === 'MONTHLY' ? plan.monthlyPrice : plan.yearlyTotalPrice;
  const transactionId = `PIX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  // Synthetic valid EMV standard Pix Copy and Paste payload
  const syntheticPixCopyPaste = `00020101021226580014br.gov.bcb.pix0136${transactionId}520400005303986540${amount.toFixed(2)}5802BR5915ADSHIELD SAAS6009SAO PAULO62070503***6304E8A2`;

  const expiresDate = new Date();
  expiresDate.setMinutes(expiresDate.getMinutes() + 15);

  return {
    transactionId,
    status: 'PENDING_PIX',
    planId: plan.id,
    cycle,
    amount,
    paymentMethod: 'PIX',
    customerEmail: buyer.email,
    pixPayload: {
      qrCodeBase64: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(syntheticPixCopyPaste)}`,
      copiaECola: syntheticPixCopyPaste,
      expiresAt: expiresDate.toLocaleTimeString('pt-BR')
    }
  };
}

/**
 * Simulates or executes 1-click Credit Card charge
 */
export function processCreditCardPayment(
  plan: PlanDetails,
  cycle: BillingCycle,
  buyer: BuyerFormData,
  card: CreditCardFormData
): Promise<PaymentTransactionResult> {
  const amount = cycle === 'MONTHLY' ? plan.monthlyPrice : plan.yearlyTotalPrice;
  const transactionId = `CC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

  return new Promise((resolve) => {
    setTimeout(() => {
      const result: PaymentTransactionResult = {
        transactionId,
        status: 'APPROVED',
        planId: plan.id,
        cycle,
        amount,
        paymentMethod: 'CREDIT_CARD',
        paidAt: new Date().toISOString(),
        customerEmail: buyer.email
      };

      // Persist active license in localStorage
      saveActiveLicense(result);
      resolve(result);
    }, 1500);
  });
}

export function saveActiveLicense(payment: PaymentTransactionResult) {
  try {
    localStorage.setItem(LOCAL_STORAGE_LICENSE_KEY, JSON.stringify({
      ...payment,
      activatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (payment.cycle === 'YEARLY' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString()
    }));
  } catch (e) {
    console.error('Error saving license:', e);
  }
}

export function getActiveLicense(): PaymentTransactionResult | null {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_LICENSE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
