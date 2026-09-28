/// <reference types="node" />
// ==============================================================================
// 💳 VERCEL SERVERLESS FUNCTION: /api/create-checkout-session
// Creates Stripe Checkout Sessions for subscription plans
// Plans: Starter R$297, Pro R$497, Agency R$1.497
// ==============================================================================

export const config = {
  maxDuration: 10,
};

interface PlanConfig {
  stripePriceId: string;
  name: string;
  priceBrl: number;
}

const PLANS: Record<string, PlanConfig> = {
  STARTER: {
    stripePriceId: process.env.STRIPE_PRICE_STARTER || 'price_adshield_starter_297',
    name: 'Starter Sentinel',
    priceBrl: 297,
  },
  PRO: {
    stripePriceId: process.env.STRIPE_PRICE_PRO || 'price_adshield_pro_497',
    name: 'Growth Pro Shield',
    priceBrl: 497,
  },
  AGENCY: {
    stripePriceId: process.env.STRIPE_PRICE_AGENCY || 'price_adshield_agency_1497',
    name: 'Agency Scale White-Label',
    priceBrl: 1497,
  },
};

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

  let body: { planId?: string; customerEmail?: string; successUrl?: string; cancelUrl?: string };
  try {
    body = await request.json();
  } catch {
    return sendResponse(400, { error: 'Body JSON inválido.' });
  }

  const { planId, customerEmail, successUrl, cancelUrl } = body;

  if (!planId || !PLANS[planId]) {
    return sendResponse(400, {
      error: `Plano inválido. Opções: ${Object.keys(PLANS).join(', ')}`,
    });
  }

  const plan = PLANS[planId];

  try {
    // Dynamic import to avoid bundling Stripe in frontend
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia' as any,
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      customer_email: customerEmail || undefined,
      success_url: successUrl || 'https://adshield.vercel.app/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl || 'https://adshield.vercel.app/?checkout=canceled',
      metadata: {
        plan_id: planId,
        plan_name: plan.name,
        source: 'adshield_mvp',
      },
      subscription_data: {
        metadata: {
          plan_id: planId,
        },
      },
    });

    return sendResponse(200, {
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id,
      planName: plan.name,
      priceBrl: plan.priceBrl,
    });
  } catch (err: any) {
    console.error('[Stripe Checkout Error]', err?.message || err);
    return sendResponse(500, {
      error: 'Erro ao criar sessão de checkout. Tente novamente.',
      details: process.env.NODE_ENV === 'development' ? err?.message : undefined,
    });
  }
}
