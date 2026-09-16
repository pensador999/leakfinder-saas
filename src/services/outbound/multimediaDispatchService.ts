// ==============================================================================
// 📦 MULTIMEDIA OUTBOUND DISPATCHER — ADSHIELD ENTERPRISE 2026.4
// Packages the "Golden Trio": 15s AI Avatar Video + Playwright Visual Proof +
// Grounded WhatsApp Offer with 1-Click Stripe Checkout link.
// ==============================================================================

import { generateVideoPitchScript } from './videoPitchGenerator.ts';
import type { VideoPitchScript } from './videoPitchGenerator.ts';
import { createAvatarVideoSpec } from './avatarVideoAdapter.ts';
import type { AvatarVideoCompositionSpec } from './avatarVideoAdapter.ts';
import { generateVisualEvidencePayload } from '../vision/playwrightEvidenceCapture.ts';
import type { VisualEvidenceResult } from '../vision/playwrightEvidenceCapture.ts';
import { formatWhatsAppOfferWithStripe } from '../billing/stripeCheckoutService.ts';
import type { SubscriptionPlanId } from '../billing/stripeCheckoutService.ts';

export interface MultimediaOutboundPackage {
  packageId: string;
  storeDomain: string;
  merchantName: string;
  createdAt: string;
  video: AvatarVideoCompositionSpec;
  evidence: VisualEvidenceResult;
  whatsappPitchText: string;
  directStripeCheckoutUrl: string;
  estimatedRoi: string;
}

export interface DispatchParams {
  storeDomain: string;
  merchantName?: string;
  productTitle: string;
  productUrl: string;
  brokenSizes: string[];
  totalSizesCount?: number;
  dailyAdBudget?: number;
  planId?: SubscriptionPlanId;
}

/**
 * Creates the complete 360-degree multimedia pitch package ready for WhatsApp dispatch
 */
export function buildMultimediaOutboundPackage(params: DispatchParams): MultimediaOutboundPackage {
  const {
    storeDomain,
    merchantName = 'Gestor',
    productTitle,
    productUrl,
    brokenSizes,
    totalSizesCount = 5,
    dailyAdBudget = 150,
    planId = 'PRO_MONTHLY'
  } = params;

  const packageId = `pkg_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // 1. Generate Visual Proof of Crime (Playwright)
  const evidence = generateVisualEvidencePayload({
    storeDomain,
    productTitle,
    productUrl,
    brokenSizes,
    totalSizesCount
  });

  // 2. Generate Calibrated 15-second Video Script
  const estimatedMonthlyLoss = Math.round(dailyAdBudget * (brokenSizes.includes('M') && brokenSizes.includes('G') ? 0.65 : 0.40) * 30);
  const script = generateVideoPitchScript({
    storeDomain,
    merchantName,
    productTitle,
    brokenSizes,
    estimatedMonthlyLoss
  });

  // 3. Create Avatar Video Composition Spec
  const video = createAvatarVideoSpec({ script, evidence });

  // 4. Format WhatsApp Offer with 1-Click Stripe Link
  const whatsappPitchText = formatWhatsAppOfferWithStripe({
    storeDomain,
    merchantName,
    productTitle,
    brokenSizes,
    totalSizesCount,
    dailyAdBudget,
    planId
  });

  // Extract direct checkout link from formatted copy
  const stripeLinkMatch = whatsappPitchText.match(/https:\/\/buy\.stripe\.com\/[^\s]+/);
  const directStripeCheckoutUrl = stripeLinkMatch ? stripeLinkMatch[0] : 'https://buy.stripe.com/live_adshield_pro_monthly';

  // Extract ROI
  const roiMatch = whatsappPitchText.match(/\*(\d+\.?\d*x)\*/);
  const estimatedRoi = roiMatch ? roiMatch[1] : '10.0x';

  return {
    packageId,
    storeDomain: evidence.storeDomain,
    merchantName,
    createdAt: new Date().toISOString(),
    video,
    evidence,
    whatsappPitchText,
    directStripeCheckoutUrl,
    estimatedRoi
  };
}
