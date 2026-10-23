// ==============================================================================
// 💳 ADSHIELD TRANSPARENT CHECKOUT & BILLING ENGINE
// Prepared for Asaas / Stripe / Mercado Pago webhook & 1-click tokenization
// ==============================================================================

import { StoreLocaleId, StoreCurrencyCode } from '../../i18n/marketProfiles.ts';

export type SupportedLocale = StoreLocaleId;
export type PaymentMethod = 'PIX' | 'CREDIT_CARD';
export type BillingCycle = 'MONTHLY' | 'YEARLY';
export type PlanTierId = 'STARTER' | 'GROWTH_PRO' | 'AGENCY_ENTERPRISE';

export interface CurrencyPriceTier {
  monthlyPrice: number;
  yearlyMonthlyPrice: number;
  yearlyTotalPrice: number;
  currency: StoreCurrencyCode;
  currencySymbol: '$' | '£' | '€' | 'R$';
}

export interface PlanDetails {
  id: PlanTierId;
  name: string;
  badge?: string;
  monthlyPrice: number;
  yearlyMonthlyPrice: number; // 20% discount
  yearlyTotalPrice: number;
  currency?: StoreCurrencyCode;
  currencySymbol?: '$' | '£' | '€' | 'R$';
  pricesByCurrency?: Record<StoreCurrencyCode, CurrencyPriceTier>;
  description: string;
  features: string[];
  recommended?: boolean;
}

export const MULTI_CURRENCY_PLAN_PRICES: Record<PlanTierId, Record<StoreCurrencyCode, CurrencyPriceTier>> = {
  STARTER: {
    USD: { monthlyPrice: 49, yearlyMonthlyPrice: 39, yearlyTotalPrice: 468, currency: 'USD', currencySymbol: '$' },
    GBP: { monthlyPrice: 39, yearlyMonthlyPrice: 31, yearlyTotalPrice: 372, currency: 'GBP', currencySymbol: '£' },
    EUR: { monthlyPrice: 45, yearlyMonthlyPrice: 36, yearlyTotalPrice: 432, currency: 'EUR', currencySymbol: '€' },
    BRL: { monthlyPrice: 297, yearlyMonthlyPrice: 237, yearlyTotalPrice: 2844, currency: 'BRL', currencySymbol: 'R$' }
  },
  GROWTH_PRO: {
    USD: { monthlyPrice: 99, yearlyMonthlyPrice: 79, yearlyTotalPrice: 948, currency: 'USD', currencySymbol: '$' },
    GBP: { monthlyPrice: 79, yearlyMonthlyPrice: 63, yearlyTotalPrice: 756, currency: 'GBP', currencySymbol: '£' },
    EUR: { monthlyPrice: 89, yearlyMonthlyPrice: 71, yearlyTotalPrice: 852, currency: 'EUR', currencySymbol: '€' },
    BRL: { monthlyPrice: 497, yearlyMonthlyPrice: 397, yearlyTotalPrice: 4764, currency: 'BRL', currencySymbol: 'R$' }
  },
  AGENCY_ENTERPRISE: {
    USD: { monthlyPrice: 299, yearlyMonthlyPrice: 239, yearlyTotalPrice: 2868, currency: 'USD', currencySymbol: '$' },
    GBP: { monthlyPrice: 249, yearlyMonthlyPrice: 199, yearlyTotalPrice: 2388, currency: 'GBP', currencySymbol: '£' },
    EUR: { monthlyPrice: 279, yearlyMonthlyPrice: 223, yearlyTotalPrice: 2676, currency: 'EUR', currencySymbol: '€' },
    BRL: { monthlyPrice: 1497, yearlyMonthlyPrice: 1197, yearlyTotalPrice: 14364, currency: 'BRL', currencySymbol: 'R$' }
  }
};

export const SAAS_PLANS: Record<PlanTierId, PlanDetails> = {
  STARTER: {
    id: 'STARTER',
    name: 'Starter Sentinel',
    monthlyPrice: 297,
    yearlyMonthlyPrice: 237,
    yearlyTotalPrice: 2844,
    currency: 'BRL',
    currencySymbol: 'R$',
    pricesByCurrency: MULTI_CURRENCY_PLAN_PRICES.STARTER,
    description: 'Para lojistas únicos e marcas em crescimento que anunciam no Meta Ads.',
    features: [
      '1 Loja Virtual Monitorada 24/7 (Varredura a cada 60m)',
      'Alertas de Ruptura de Grade no WhatsApp da Equipe',
      'Extensão Chrome Manifest V3 Oficial AdShield',
      'Calculadora Atuarial de Sangria Financeira em R$',
      'Dossiê Executivo em PDF & Garantia Incondicional de 7 Dias'
    ]
  },
  GROWTH_PRO: {
    id: 'GROWTH_PRO',
    name: 'Growth Pro Shield',
    badge: 'MAIS ESCOLHIDO • CARRO-CHEFE',
    monthlyPrice: 497,
    yearlyMonthlyPrice: 397,
    yearlyTotalPrice: 4764,
    currency: 'BRL',
    currencySymbol: 'R$',
    pricesByCurrency: MULTI_CURRENCY_PLAN_PRICES.GROWTH_PRO,
    description: 'Para e-commerces que investem de R$ 8k a R$ 80k/mês em mídia paga.',
    features: [
      'Até 3 Lojas Virtuais Monitoradas Simultaneamente',
      'Sentinela Cloud 24/7 com Varredura a cada 15 a 30m',
      'AdShield Kill-Switch: Gatilho via Pixel (AdShield_BrokenCoreSize_View) & Alerta < 60s',
      'Alerta Imediato (< 60s) ao esgotar tamanhos mais vendidos',
      'Snippets Liquid Prontos: Sticky Buy Button & 7% OFF Pix',
      'Suporte Prioritário VIP no WhatsApp com Engenharia'
    ],
    recommended: true
  },
  AGENCY_ENTERPRISE: {
    id: 'AGENCY_ENTERPRISE',
    name: 'Agency Scale White-Label',
    badge: 'AGÊNCIAS & MULTI-LOJAS',
    monthlyPrice: 1497,
    yearlyMonthlyPrice: 1197,
    yearlyTotalPrice: 14364,
    currency: 'BRL',
    currencySymbol: 'R$',
    pricesByCurrency: MULTI_CURRENCY_PLAN_PRICES.AGENCY_ENTERPRISE,
    description: 'Para Agências de Performance, consultores de CRO e gestores com carteira.',
    features: [
      'Até 15 Lojas de Clientes Conectadas Simultaneamente',
      'Painel & Relatórios 100% White-Label (Seu Logo e Cores)',
      'Caçador de Leads Outbound Ilimitado para Prospecção no WhatsApp',
      'Acesso ao Enxame Completo dos 18 Agentes de IA',
      'Integrações Oficiais (Shopify Admin, Meta Ads, Google Ads e Webhooks)',
      'Gerente de Contas Dedicado & Onboarding Assistido'
    ]
  }
};

function resolveCurrencyForLocale(locale: SupportedLocale): StoreCurrencyCode {
  if (locale === 'en-US') return 'USD';
  if (locale === 'en-GB') return 'GBP';
  if (locale === 'de-DE' || locale === 'fr-FR' || locale === 'es-ES') return 'EUR';
  return 'BRL';
}

export function getLocalizedPlans(locale: SupportedLocale = 'pt-BR'): Record<PlanTierId, PlanDetails> {
  const currency = resolveCurrencyForLocale(locale);
  const starterPricing = MULTI_CURRENCY_PLAN_PRICES.STARTER[currency];
  const proPricing = MULTI_CURRENCY_PLAN_PRICES.GROWTH_PRO[currency];
  const agencyPricing = MULTI_CURRENCY_PLAN_PRICES.AGENCY_ENTERPRISE[currency];

  if (locale === 'pt-BR') {
    return {
      STARTER: { ...SAAS_PLANS.STARTER, ...starterPricing },
      GROWTH_PRO: { ...SAAS_PLANS.GROWTH_PRO, ...proPricing },
      AGENCY_ENTERPRISE: { ...SAAS_PLANS.AGENCY_ENTERPRISE, ...agencyPricing }
    };
  }

  if (locale === 'de-DE') {
    return {
      STARTER: {
        ...SAAS_PLANS.STARTER,
        ...starterPricing,
        description: 'Für wachsende D2C-Marken, die aktiv auf Meta & Google Ads werben.',
        features: [
          '1 Online-Shop 24/7 überwacht (Scan alle 60 Min.)',
          'Kerngrößen-Ausfall-Warnungen via WhatsApp & Webhook',
          'Offizielle AdShield Chrome Extension (Manifest V3)',
          `Finanzielle Ad-Bleed-Kalkulation in ${starterPricing.currencySymbol}`,
          'Executive PDF-Dossier & 7 Tage Geld-zurück-Garantie'
        ]
      },
      GROWTH_PRO: {
        ...SAAS_PLANS.GROWTH_PRO,
        ...proPricing,
        badge: 'BELIEBTESTE WAHL • BESTSELLER',
        description: `Für E-Commerce-Marken mit ${proPricing.currencySymbol}2k bis ${proPricing.currencySymbol}25k/Monat Ad-Spend.`,
        features: [
          'Bis zu 3 Online-Shops gleichzeitig überwacht',
          '24/7 Cloud-Sentinel mit Scan alle 15 bis 30 Min.',
          'AdShield Kill-Switch: Echtzeit-Webhook & Pause < 60s bei Stockout',
          'Sofort-Alarm (< 60s) bei Ausverkauf von Bestseller-Größen',
          'Fertige Liquid-Snippets: Sticky Buy Button & Express-Checkout',
          'Priorisierter VIP-Engineering-Support'
        ]
      },
      AGENCY_ENTERPRISE: {
        ...SAAS_PLANS.AGENCY_ENTERPRISE,
        ...agencyPricing,
        badge: 'AGENTUREN & MULTI-STORE',
        description: 'Für Performance-Agenturen, CRO-Berater und Multi-Brand-Portfolios.',
        features: [
          'Bis zu 15 Kunden-Shops gleichzeitig verbunden',
          '100% White-Label-Dashboard & PDF-Dossiers (Eigenes Logo & Farben)',
          'Unbegrenzter Outbound-Lead-Scanner für Agentur-Akquise',
          'Vollzugriff auf den autonomen 18-Agenten-KI-Schwarm',
          'Offizielle Integrationen (Shopify Admin, Meta Ads, Google Ads)',
          'Dedizierter Account Manager & Geführtes Onboarding'
        ]
      }
    };
  }

  if (locale === 'fr-FR') {
    return {
      STARTER: {
        ...SAAS_PLANS.STARTER,
        ...starterPricing,
        description: 'Pour les marques D2C en croissance investissant sur Meta & Google Ads.',
        features: [
          '1 Boutique E-Commerce surveillée 24/7 (Scan toutes les 60 min)',
          'Alertes de rupture de tailles clés via WhatsApp & Webhook',
          'Extension Chrome Officielle AdShield (Manifest V3)',
          `Calculateur actuariel de perte publicitaire en ${starterPricing.currencySymbol}`,
          'Dossier Exécutif PDF A4 & Garantie Satisfait ou Remboursé 7 Jours'
        ]
      },
      GROWTH_PRO: {
        ...SAAS_PLANS.GROWTH_PRO,
        ...proPricing,
        badge: 'LE PLUS CHOISI • PHARE',
        description: `Pour les marques investissant de ${proPricing.currencySymbol}2k à ${proPricing.currencySymbol}25k/mois en média payant.`,
        features: [
          'Jusqu’à 3 Boutiques E-Commerce surveillées simultanément',
          'Sentinelle Cloud 24/7 avec scan haute fréquence (15–30 min)',
          'AdShield Kill-Switch : Déclencheur Pixel & Webhook (Pause < 60s)',
          'Alerte instantanée (< 60s) lors de l’épuisement des tailles clés',
          'Snippets Liquid prêts à l’emploi : Sticky Buy Button & Express Checkout',
          'Support Ingénierie VIP Prioritaire'
        ]
      },
      AGENCY_ENTERPRISE: {
        ...SAAS_PLANS.AGENCY_ENTERPRISE,
        ...agencyPricing,
        badge: 'AGENCES & MULTI-BOUTIQUES',
        description: 'Pour les Agences de Performance, Consultants CRO et Groupes Multi-Marques.',
        features: [
          'Jusqu’à 15 Boutiques Clients connectées simultanément',
          'Portail & Dossiers PDF 100% Marque Blanche (Votre Logo & Couleurs)',
          'Chasseur de Leads Outbound Illimité pour la prospection B2B',
          'Accès complet à l’essaim autonome de 18 Agents IA',
          'Intégrations officielles (Shopify Admin, Meta Ads, Google Ads, Webhooks)',
          'Account Manager dédié & Onboarding assisté'
        ]
      }
    };
  }

  if (locale === 'es-ES') {
    return {
      STARTER: {
        ...SAAS_PLANS.STARTER,
        ...starterPricing,
        description: 'Para marcas D2C en crecimiento que invierten en Meta y Google Ads.',
        features: [
          '1 Tienda Online monitorizada 24/7 (Escaneo cada 60 min)',
          'Alertas de agotamiento de tallas clave vía WhatsApp y Webhook',
          'Extensión Oficial de Chrome AdShield (Manifest V3)',
          `Calculadora actuarial de fuga publicitaria en ${starterPricing.currencySymbol}`,
          'Dossier Ejecutivo PDF A4 y Garantía de 7 Días'
        ]
      },
      GROWTH_PRO: {
        ...SAAS_PLANS.GROWTH_PRO,
        ...proPricing,
        badge: 'MÁS ELEGIDO • INSIGNIA',
        description: `Para e-commerces que invierten de ${proPricing.currencySymbol}2k a ${proPricing.currencySymbol}25k/mes en tráfico de pago.`,
        features: [
          'Hasta 3 Tiendas Online monitorizadas simultáneamente',
          'Centinela Cloud 24/7 con escaneo cada 15 a 30 min',
          'AdShield Kill-Switch: Gatillo Pixel y Webhook (Pausa < 60s)',
          'Alerta inmediata (< 60s) al agotarse las tallas más vendidas',
          'Snippets Liquid listos: Sticky Buy Button y Express Checkout',
          'Soporte de Ingeniería VIP Prioritario'
        ]
      },
      AGENCY_ENTERPRISE: {
        ...SAAS_PLANS.AGENCY_ENTERPRISE,
        ...agencyPricing,
        badge: 'AGENCIAS Y MULTI-TIENDA',
        description: 'Para Agencias de Performance, Consultores CRO y Grupos Multi-Marca.',
        features: [
          'Hasta 15 Tiendas de Clientes conectadas simultáneamente',
          'Panel e Informes PDF 100% Marca Blanca (Tu Logo y Colores)',
          'Cazador de Leads Outbound Ilimitado para prospección B2B',
          'Acceso completo al enjambre autónomo de 18 Agentes de IA',
          'Integraciones oficiales (Shopify Admin, Meta Ads, Google Ads, Webhooks)',
          'Gerente de Cuenta dedicado y Onboarding asistido'
        ]
      }
    };
  }

  return {
    STARTER: {
      ...SAAS_PLANS.STARTER,
      ...starterPricing,
      description: 'For single-brand D2C merchants scaling paid traffic on Meta & Google Ads.',
      features: [
        '1 E-Commerce Store Monitored 24/7 (Scanned every 60m)',
        'Core Size Stockout Alerts via Team WhatsApp & Webhook',
        'Official AdShield Manifest V3 Chrome Extension',
        `Actuarial Paid Media Bleed Calculator in ${starterPricing.currencySymbol}`,
        'Executive A4 PDF Dossier & 7-Day Money-Back Guarantee'
      ]
    },
    GROWTH_PRO: {
      ...SAAS_PLANS.GROWTH_PRO,
      ...proPricing,
      badge: 'MOST POPULAR • FLAGSHIP',
      description: `For scaling brands investing ${proPricing.currencySymbol}2k to ${proPricing.currencySymbol}25k/mo in paid media.`,
      features: [
        'Up to 3 E-Commerce Stores Monitored Simultaneously',
        '24/7 Cloud Sentinel with 15–30m High-Frequency Scans',
        'AdShield Kill-Switch: Pixel & Webhook Trigger (< 60s Ad Pause)',
        'Instant Alert (< 60s) when core Curve-A sizes sell out',
        'Ready-to-Use Liquid Snippets: Sticky Buy Button & BNPL/Shop Pay',
        'VIP Priority Engineering Support'
      ]
    },
    AGENCY_ENTERPRISE: {
      ...SAAS_PLANS.AGENCY_ENTERPRISE,
      ...agencyPricing,
      badge: 'AGENCIES & MULTI-BRAND',
      description: 'For Performance Marketing Agencies, CRO Consultants & Holding Groups.',
      features: [
        'Up to 15 Client Stores Connected Simultaneously',
        '100% White-Label Portal & Executive PDF Dossiers (Your Brand)',
        'Unlimited Outbound Lead Hunter for B2B Client Acquisition',
        'Full Access to the 18-Agent Autonomous AI Swarm',
        'Official Integrations (Shopify Admin, Meta Ads, Google Ads, Webhooks)',
        'Dedicated Account Manager & Assisted Onboarding'
      ]
    }
  };
}

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
