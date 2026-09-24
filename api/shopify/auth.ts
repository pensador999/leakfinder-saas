/// <reference types="node" />
// ==============================================================================
// 🛍️ SHOPIFY OAUTH INITIATOR: /api/shopify/auth
// Validates store domain, generates cryptographic anti-CSRF state token,
// and redirects the merchant to the official Shopify approval screen.
// ==============================================================================

import crypto from 'crypto';

export const config = {
  maxDuration: 15,
};

function sendResponse(response: any, statusCode: number, data: any, headers: Record<string, string> = {}) {
  if (response?.status && typeof response.status === 'function') {
    Object.entries(headers).forEach(([k, v]) => response.setHeader(k, v));
    return response.status(statusCode).json(data);
  }
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0',
      ...headers
    }
  });
}

function sendRedirect(response: any, redirectUrl: string, cookieHeader?: string) {
  if (response?.redirect && typeof response.redirect === 'function') {
    if (cookieHeader) response.setHeader('Set-Cookie', cookieHeader);
    return response.redirect(redirectUrl);
  }
  const headers: Record<string, string> = {
    Location: redirectUrl,
    'Cache-Control': 'no-store, max-age=0'
  };
  if (cookieHeader) {
    headers['Set-Cookie'] = cookieHeader;
  }
  return new Response(null, {
    status: 302,
    headers
  });
}

/**
 * Normalizes and sanitizes user input to a valid myshopify.com domain
 */
export function sanitizeShopDomain(rawShop: string): string | null {
  if (!rawShop || typeof rawShop !== 'string') return null;

  let cleaned = rawShop.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  // If user typed only store name (e.g., 'brkagro'), append .myshopify.com
  if (!cleaned.includes('.')) {
    cleaned = `${cleaned}.myshopify.com`;
  }

  // Strict regex for Shopify shop domain
  const shopifyDomainRegex = /^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/;
  if (!shopifyDomainRegex.test(cleaned)) {
    return null;
  }

  return cleaned;
}

export default async function handler(request: any, response: any) {
  const isWebRequest = typeof request.headers?.get === 'function';
  const urlObj = new URL(request.url, 'http://localhost');
  
  // Extract shop from query params
  const rawShop = isWebRequest
    ? urlObj.searchParams.get('shop')
    : (request.query?.shop || urlObj.searchParams.get('shop'));

  if (!rawShop) {
    return sendResponse(response, 400, {
      error: 'Missing Shop Parameter',
      message: 'Informe o domínio da loja Shopify (ex: ?shop=minhaloja.myshopify.com)'
    });
  }

  const sanitizedShop = sanitizeShopDomain(rawShop);
  if (!sanitizedShop) {
    return sendResponse(response, 400, {
      error: 'Invalid Shop Domain',
      message: 'O formato do domínio é inválido. Utilize o formato sualoja.myshopify.com'
    });
  }

  // Shopify App API Key (Client ID)
  const apiKey = process.env.SHOPIFY_API_KEY || process.env.VITE_SHOPIFY_API_KEY || 'shopify_app_client_id_placeholder';
  
  // Define Read-Only Scopes for Anti-Ghost Inventory & Catalog Auditing
  const scopes = [
    'read_products',
    'read_inventory',
    'read_orders'
  ].join(',');

  // Determine App Host for Redirect URI
  const host = isWebRequest
    ? (request.headers.get('x-forwarded-host') || request.headers.get('host') || 'leakfinder-green.vercel.app')
    : (request.headers?.['x-forwarded-host'] || request.headers?.host || 'leakfinder-green.vercel.app');
  
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/shopify/callback`;

  // Generate high-entropy state nonce for CSRF defense
  const state = crypto.randomBytes(16).toString('hex');
  const cookieValue = `shopify_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=900; ${protocol === 'https' ? 'Secure;' : ''}`;

  // Build Official Shopify OAuth Authorize URL
  const authUrl = `https://${sanitizedShop}/admin/oauth/authorize?client_id=${encodeURIComponent(apiKey)}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${encodeURIComponent(state)}`;

  return sendRedirect(response, authUrl, cookieValue);
}
