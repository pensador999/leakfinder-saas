// ==============================================================================
// 🛍️ SHOPIFY OAUTH CLIENT SERVICE: shopifyOAuthService.ts
// Initiates the 1-click Shopify App Store OAuth flow, monitors connection status,
// and invokes real-time physical inventory synchronization.
// ==============================================================================

import { AuditedInventorySku } from '../../../api/shopify/sync';

export interface ShopifyConnectionInfo {
  shopDomain: string;
  isConnected: boolean;
  installedAt?: string;
  scopes?: string[];
  totalSkusAudited?: number;
  ghostInventoryCount?: number;
  ruptureCount?: number;
}

/**
 * Sanitizes shop domain or handles myshopify format
 */
export function sanitizeShopInput(input: string): string {
  if (!input) return '';
  let cleaned = input.trim().toLowerCase();
  cleaned = cleaned.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  if (!cleaned.includes('.')) {
    cleaned = `${cleaned}.myshopify.com`;
  }
  return cleaned;
}

/**
 * Initiates the 1-Click OAuth flow by redirecting the browser to /api/shopify/auth
 */
export function startShopifyOAuthHandshake(shopDomain: string): void {
  const sanitized = sanitizeShopInput(shopDomain);
  if (!sanitized) {
    throw new Error('Por favor, informe um domínio válido da loja Shopify (ex: minhaloja.myshopify.com)');
  }

  // Save pending shop in localStorage for post-redirect correlation
  try {
    localStorage.setItem('adshield_pending_shopify_oauth', sanitized);
  } catch {}

  // Redirect to serverless auth route
  window.location.href = `/api/shopify/auth?shop=${encodeURIComponent(sanitized)}`;
}

/**
 * Checks connection state from local cache or URL parameters
 */
export function getActiveShopifyConnection(): ShopifyConnectionInfo | null {
  try {
    const saved = localStorage.getItem('adshield_active_shopify_connection');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {}

  // Check URL query parameters for freshly completed OAuth
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('shopify_connected') === 'true' && params.get('shop')) {
      const shopDomain = params.get('shop')!;
      const connection: ShopifyConnectionInfo = {
        shopDomain,
        isConnected: true,
        installedAt: new Date().toISOString(),
        scopes: ['read_products', 'read_inventory', 'read_orders']
      };
      try {
        localStorage.setItem('adshield_active_shopify_connection', JSON.stringify(connection));
      } catch {}
      return connection;
    }
  }

  return null;
}

/**
 * Fetches real-time inventory audit from /api/shopify/sync
 */
export async function syncShopifyPhysicalInventory(shopDomain: string): Promise<{
  mode: string;
  shop: string;
  totalSkusAudited: number;
  ghostInventoryCount: number;
  ruptureCount: number;
  skus: AuditedInventorySku[];
}> {
  const sanitized = sanitizeShopInput(shopDomain);
  const response = await fetch(`/api/shopify/sync?shop=${encodeURIComponent(sanitized)}`);
  
  if (!response.ok) {
    throw new Error(`Falha na sincronização com Shopify Admin API: ${response.statusText}`);
  }

  return response.json();
}
