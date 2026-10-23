/// <reference types="node" />
// ==============================================================================
// 💳 VERCEL SERVERLESS FUNCTION: /api/create-checkout-session
// Creates Multi-Currency Stripe Checkout Sessions for subscription plans
// Supports: STARTER, GROWTH_PRO (or PRO), AGENCY_ENTERPRISE (or AGENCY)
// Currencies: USD ($49/$99/$299), GBP (£39/£79/£249), EUR (€45/€89/€279), BRL (R$297/R$497/R$1497)
// ==============================================================================

export const config = {
  maxDuration: 10,
};

type SupportedCurrency = 'USD' | 'GBP' | 'EUR' | 'BRL';

interface PlanConfig {
  canonicalId: 'STARTER' | 'GROWTH_PRO' | 'AGENCY_ENTERPRISE';
  stripePriceIdEnv?: string;
  name: string;
  prices: Record<SupportedCurrency, number>;
}

const CANONICAL_PLANS: Record<'STARTER' | 'GROWTH_PRO' | 'AGENCY_ENTERPRISE', PlanConfig> = {
  STARTER: {
    canonicalId: 'STARTER',
    stripePriceIdEnv: process.env.STRIPE_PRICE_STARTER,
    name: 'Starter Sentinel',
    prices: { USD: 49, GBP: 39, EUR: 45, BRL: 297 },
  },
  GROWTH_PRO: {
    canonicalId: 'GROWTH_PRO',
    stripePriceIdEnv: process.env.STRIPE_PRICE_PRO,
    name: 'Growth Pro Shield',
    prices: { USD: 99, GBP: 79, EUR: 89, BRL: 497 },
  },
  AGENCY_ENTERPRISE: {
    canonicalId: 'AGENCY_ENTERPRISE',
    stripePriceIdEnv: process.env.STRIPE_PRICE_AGENCY,
    name: 'Agency Scale White-Label',
    prices: { USD: 299, GBP: 249, EUR: 279, BRL: 1497 },
  },
};

const PLAN_ALIASES: Record<string, PlanConfig> = {
  STARTER: CANONICAL_PLANS.STARTER,
  STARTER_MONTHLY: CANONICAL_PLANS.STARTER,
  PRO: CANONICAL_PLANS.GROWTH_PRO,
  PRO_MONTHLY: CANONICAL_PLANS.GROWTH_PRO,
  GROWTH_PRO: CANONICAL_PLANS.GROWTH_PRO,
  AGENCY: CANONICAL_PLANS.AGENCY_ENTERPRISE,
  AGENCY_MONTHLY: CANONICAL_PLANS.AGENCY_ENTERPRISE,
  AGENCY_ENTERPRISE: CANONICAL_PLANS.AGENCY_ENTERPRISE,
};

function resolveCurrency(currency?: string, locale?: string): SupportedCurrency {
  const upperCurr = (currency || '').toUpperCase().trim();
  if (upperCurr === 'USD' || upperCurr === 'GBP' || upperCurr === 'EUR' || upperCurr === 'BRL') {
    return upperCurr;
  }
  const loc = (locale || '').trim();
  if (loc === 'en-US') return 'USD';
  if (loc === 'en-GB') return 'GBP';
  if (loc === 'de-DE' || loc === 'fr-FR' || loc === 'es-ES') return 'EUR';
  return 'BRL';
}

function sendResponse(statusCode: number, data: unknown) {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}

export default async function handler(request: Request) {
  // CORS Preflight
  if (request.method === 'OPTIONS') {
    return sendResponse(204, {});
  }

  if (request.method !== 'POST') {
    return sendResponse(405, { error: 'Método não permitido. Use POST.' });
  }

  // Check Stripe secret key is configured
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecretKey) {
    console.error('[Stripe] STRIPE_SECRET_KEY not configured in environment variables');
    return sendResponse(503, {
      error: 'Sistema de pagamentos não configurado. Configure STRIPE_SECRET_KEY nas variáveis de ambiente.',
      _hint: 'Configure STRIPE_SECRET_KEY na Vercel Dashboard → Settings → Environment Variables',
    });
  }

  let body: {
    planId?: string;
    currency?: string;
    locale?: string;
    customerEmail?: string;
    successUrl?: string;
    cancelUrl?: string;
  };
  try {
    body = await request.json();
  } catch {
    return sendResponse(400, { error: 'Body JSON inválido.' });
  }

  const { planId, currency, locale, customerEmail, successUrl, cancelUrl } = body;
  const normalizedPlanKey = (planId || '').toUpperCase().trim();

  if (!normalizedPlanKey || !PLAN_ALIASES[normalizedPlanKey]) {
    return sendResponse(400, {
      error: `Plano inválido. Opções: ${Object.keys(PLAN_ALIASES).join(', ')}`,
    });
  }

  const plan = PLAN_ALIASES[normalizedPlanKey];
  const activeCurrency = resolveCurrency(currency, locale);
  const unitPrice = plan.prices[activeCurrency];

  try {
    // Dynamic import to avoid bundling Stripe in frontend
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia' as any,
    });

    const useConfiguredPriceId = Boolean(activeCurrency === 'BRL' && plan.stripePriceIdEnv);

    const lineItem = useConfiguredPriceId
      ? {
          price: plan.stripePriceIdEnv!,
          quantity: 1,
        }
      : {
          price_data: {
            currency: activeCurrency.toLowerCase(),
            product_data: {
              name: `AdShield ${plan.name}`,
              description: `Autonomous 24/7 E-Commerce Catalog & Paid Media Shield (${plan.canonicalId})`,
            },
            unit_amount: Math.round(unitPrice * 100),
            recurring: {
              interval: 'month' as const,
            },
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [lineItem],
      customer_email: customerEmail || undefined,
      success_url: successUrl || 'https://adshield.vercel.app/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl || 'https://adshield.vercel.app/?checkout=canceled',
      metadata: {
        plan_id: plan.canonicalId,
        requested_plan_id: planId || plan.canonicalId,
        plan_name: plan.name,
        currency: activeCurrency,
        source: 'adshield_global_checkout',
      },
      subscription_data: {
        metadata: {
          plan_id: plan.canonicalId,
          currency: activeCurrency,
        },
      },
    });

    return sendResponse(200, {
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      planId: plan.canonicalId,
      planName: plan.name,
      currency: activeCurrency,
      unitPrice,
      priceBrl: plan.prices.BRL,
    });
  } catch (err: any) {
    console.error('[Stripe Checkout Error]', err?.message || err);
    return sendResponse(500, {
      error: 'Erro ao criar sessão de checkout. Tente novamente.',
      details: process.env.NODE_ENV === 'development' ? err?.message : undefined,
    });
  }
}

