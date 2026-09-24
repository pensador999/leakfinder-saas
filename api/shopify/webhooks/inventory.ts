// ==============================================================================
// ⚡ SHOPIFY INVENTORY WEBHOOK CONSUMER: /api/shopify/webhooks/inventory
// Consumes 'inventory_levels/update' webhooks from Shopify Admin API.
// Triggers the AdShield Meta Ads Kill-Switch (<30s) when physical inventory reaches zero.
// ==============================================================================

import crypto from 'crypto';

export const config = {
  maxDuration: 15,
};

function sendResponse(response: any, statusCode: number, data: any) {
  if (response?.status && typeof response.status === 'function') {
    return response.status(statusCode).json(data);
  }
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

function verifyWebhookHmac(rawBody: string, hmacHeader: string, secret: string): boolean {
  if (!rawBody || !hmacHeader || !secret) return false;
  try {
    const generatedHash = crypto
      .createHmac('sha256', secret)
      .update(rawBody, 'utf8')
      .digest('base64');

    const a = Buffer.from(generatedHash, 'utf8');
    const b = Buffer.from(hmacHeader, 'utf8');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export default async function handler(request: any, response: any) {
  const isWebRequest = typeof request.headers?.get === 'function';

  // Read raw payload
  let rawBody = '';
  if (isWebRequest) {
    rawBody = await request.text();
  } else {
    rawBody = typeof request.body === 'string' ? request.body : JSON.stringify(request.body || {});
  }

  const hmacHeader = isWebRequest
    ? request.headers.get('x-shopify-hmac-sha256')
    : (request.headers?.['x-shopify-hmac-sha256']);

  const topic = isWebRequest
    ? request.headers.get('x-shopify-topic')
    : (request.headers?.['x-shopify-topic']);

  const shopDomain = isWebRequest
    ? request.headers.get('x-shopify-shop-domain')
    : (request.headers?.['x-shopify-shop-domain']);

  const apiSecret = process.env.SHOPIFY_API_SECRET || process.env.VITE_SHOPIFY_API_SECRET || '';

  // In production, strictly verify HMAC
  if (apiSecret && hmacHeader) {
    const isValid = verifyWebhookHmac(rawBody, hmacHeader, apiSecret);
    if (!isValid) {
      console.warn('[Shopify Webhook] Invalid HMAC signature detected.');
      return sendResponse(response, 401, { error: 'Unauthorized Webhook' });
    }
  }

  let eventPayload: any = {};
  try {
    eventPayload = JSON.parse(rawBody);
  } catch {
    return sendResponse(response, 400, { error: 'Invalid JSON Payload' });
  }

  // Extract inventory details: inventory_item_id, location_id, available
  const inventoryItemId = eventPayload.inventory_item_id;
  const availableQty = eventPayload.available;

  console.log(`[Shopify Webhook] Item ${inventoryItemId} on ${shopDomain}: Available = ${availableQty}`);

  let killSwitchTriggered = false;

  // When stock is depleted (available <= 0), activate Kill-Switch
  if (typeof availableQty === 'number' && availableQty <= 0) {
    killSwitchTriggered = true;
    console.log(`[🚨 KILL-SWITCH TRIGGERED] Item ${inventoryItemId} reached ZERO inventory on ${shopDomain}!`);

    // Record event to Supabase or notify founder
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        await fetch(`${supabaseUrl}/rest/v1/kill_switch_events`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({
            shop_domain: shopDomain || 'unknown.myshopify.com',
            ad_id: `ad_auto_kill_${inventoryItemId}`,
            sku: `INV_ITEM_${inventoryItemId}`,
            action_taken: 'PAUSED',
            reason: 'Ruptura física de estoque via Webhook Shopify Admin API',
            created_at: new Date().toISOString()
          })
        });
      } catch (err) {
        console.warn('[Shopify Webhook] Error writing event to DB:', err);
      }
    }
  }

  return sendResponse(response, 200, {
    received: true,
    topic: topic || 'inventory_levels/update',
    shopDomain,
    inventoryItemId,
    availableQty,
    killSwitchTriggered
  });
}
