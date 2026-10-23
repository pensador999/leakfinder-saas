// ==============================================================================
// 💳 ADSHIELD REAL STRIPE CHECKOUT CLIENT SERVICE
// Calls the Vercel serverless /api/create-checkout-session endpoint
// Replaces the fake localStorage-based checkout flow for production
// ==============================================================================

export type StripePlanId = 'STARTER' | 'PRO' | 'AGENCY' | 'GROWTH_PRO' | 'AGENCY_ENTERPRISE';

export interface StripeCheckoutRequest {
  planId: StripePlanId;
  currency?: 'USD' | 'GBP' | 'EUR' | 'BRL';
  locale?: string;
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface StripeCheckoutResponse {
  success: boolean;
  checkoutUrl: string;
  sessionId: string;
  planName: string;
  currency?: 'USD' | 'GBP' | 'EUR' | 'BRL';
  unitPrice?: number;
  priceBrl: number;
}

/**
 * Initiates a real Stripe Checkout Session via the backend API.
 * Redirects the user to Stripe's hosted checkout page.
 * 
 * @throws Error if the API call fails or Stripe is not configured
 */
export async function createRealStripeCheckout(req: StripeCheckoutRequest): Promise<StripeCheckoutResponse> {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'Erro ao criar sessão de checkout.');
  }

  return data as StripeCheckoutResponse;
}

/**
 * Opens Stripe Checkout in a new tab or redirects current page.
 * Returns true if redirect was initiated, false if checkout creation failed.
 */
export async function redirectToStripeCheckout(
  planId: StripePlanId,
  customerEmail?: string,
  openInNewTab = false,
  options?: { currency?: 'USD' | 'GBP' | 'EUR' | 'BRL'; locale?: string }
): Promise<boolean> {
  try {
    const { checkoutUrl } = await createRealStripeCheckout({
      planId,
      customerEmail,
      currency: options?.currency,
      locale: options?.locale,
    });

    if (openInNewTab) {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = checkoutUrl;
    }

    return true;
  } catch (err) {
    console.error('[Stripe Checkout] Failed:', err);
    return false;
  }
}

/**
 * Checks if Stripe checkout is configured on the backend.
 * Makes a lightweight OPTIONS call to verify the endpoint exists.
 */
export async function isStripeConfigured(): Promise<boolean> {
  try {
    const res = await fetch('/api/create-checkout-session', { method: 'OPTIONS' });
    return res.status === 204 || res.status === 200;
  } catch {
    return false;
  }
}
