/// <reference types="node" />
// ==============================================================================
// 🔔 VERCEL SERVERLESS FUNCTION: /api/webhook-stripe
// Handles Stripe Webhook events for subscription lifecycle
// Events: checkout.session.completed, customer.subscription.updated/deleted
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

export const config = {
  maxDuration: 10,
};

function sendResponse(statusCode: number, data: unknown) {
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return sendResponse(405, { error: 'Método não permitido.' });
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!stripeSecretKey || !stripeWebhookSecret) {
    console.error('[Webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET');
    return sendResponse(503, { error: 'Webhook não configurado.' });
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('[Webhook] Missing Supabase config for webhook processing');
    return sendResponse(503, { error: 'Supabase não configurado para webhooks.' });
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return sendResponse(400, { error: 'Missing stripe-signature header.' });
  }

  let event: any;
  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2024-12-18.acacia' as any,
    });
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret);
  } catch (err: any) {
    console.error('[Webhook] Signature verification failed:', err?.message);
    return sendResponse(400, { error: `Webhook signature verification failed: ${err?.message}` });
  }

  // Initialize Supabase Admin client (service_role key bypasses RLS)
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerEmail = session.customer_email || session.customer_details?.email;
        const planId = session.metadata?.plan_id || 'PRO';
        const stripeCustomerId = session.customer;
        const subscriptionId = session.subscription;

        if (customerEmail) {
          // Find user by email and update their profile
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', customerEmail)
            .limit(1);

          if (profiles && profiles.length > 0) {
            await supabase
              .from('profiles')
              .update({
                subscription_status: 'active',
                subscription_plan: planId,
                stripe_customer_id: stripeCustomerId,
                updated_at: new Date().toISOString(),
              })
              .eq('id', profiles[0].id);

            console.log(`[Webhook] ✅ Subscription activated for ${customerEmail} — Plan: ${planId}`);
          } else {
            console.warn(`[Webhook] ⚠️ No profile found for email: ${customerEmail}`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const stripeCustomerId = subscription.customer;
        const status = subscription.status; // active, past_due, canceled, unpaid

        const mappedStatus = ['active', 'trialing'].includes(status) ? 'active' :
                             status === 'past_due' ? 'past_due' :
                             ['canceled', 'unpaid', 'incomplete_expired'].includes(status) ? 'canceled' : 'free';

        const { error } = await supabase
          .from('profiles')
          .update({
            subscription_status: mappedStatus,
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', stripeCustomerId);

        if (error) {
          console.error(`[Webhook] Error updating subscription status:`, error);
        } else {
          console.log(`[Webhook] 🔄 Subscription updated for customer ${stripeCustomerId}: ${mappedStatus}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const stripeCustomerId = subscription.customer;

        await supabase
          .from('profiles')
          .update({
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_customer_id', stripeCustomerId);

        console.log(`[Webhook] ❌ Subscription canceled for customer ${stripeCustomerId}`);
        break;
      }

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err: any) {
    console.error('[Webhook] Processing error:', err?.message);
    return sendResponse(500, { error: 'Webhook processing error.' });
  }

  return sendResponse(200, { received: true });
}
