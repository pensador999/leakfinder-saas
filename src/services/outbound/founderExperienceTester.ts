// ==============================================================================
// 📱 FOUNDER WHATSAPP REAL EXPERIENCE TESTER — ADSHIELD ENTERPRISE 2026.4
// Generates and packages end-to-end "Golden Trio" diagnostic alerts
// directed to the Founder's personal WhatsApp (5534991351122) for real-world inspection.
// ==============================================================================

import { buildMultimediaOutboundPackage } from './multimediaDispatchService.ts';
import type { MultimediaOutboundPackage, DispatchParams } from './multimediaDispatchService.ts';

export interface FounderTestConfig {
  founderPhone: string; // e.g. '5534991351122'
  founderName: string;
  storeDomain: string;
  productTitle: string;
  productUrl: string;
  brokenSizes: string[];
  totalSizesCount?: number;
  dailyAdBudget?: number;
}

export interface FounderWhatsAppDispatchPayload {
  testId: string;
  recipientPhone: string;
  recipientName: string;
  directWhatsAppUrl: string;
  waMeShortUrl: string;
  goldenTrioPackage: MultimediaOutboundPackage;
  evolutionApiPayload: {
    number: string;
    textMessage: string;
    mediaMessage?: {
      mediatype: 'video' | 'image' | 'audio';
      media: string;
      caption: string;
    };
    options: {
      delay: number;
      presence: 'composing';
      linkPreview: boolean;
    };
  };
  simulatedAuditSummary: {
    brand: string;
    criticalSizesBroken: string[];
    monthlyWasteFormatted: string;
    stripeCheckoutUrl: string;
    generatedAt: string;
  };
}

export const DEFAULT_FOUNDER_CONFIG: FounderTestConfig = {
  founderPhone: '5534991351122',
  founderName: 'Lucas (Fundador)',
  storeDomain: 'insiderstore.com.br',
  productTitle: 'Daily T-Shirt Tech Algodão Orgânico',
  productUrl: 'https://insiderstore.com.br/products/daily-t-shirt-tech',
  brokenSizes: ['M', 'G'],
  totalSizesCount: 5,
  dailyAdBudget: 250
};

/**
 * Prepares the complete real-world Founder WhatsApp inspection package
 */
export function buildFounderExperienceTest(
  config: Partial<FounderTestConfig> = {}
): FounderWhatsAppDispatchPayload {
  const merged: FounderTestConfig = { ...DEFAULT_FOUNDER_CONFIG, ...config };
  const digitsOnly = merged.founderPhone.replace(/\D/g, '');
  const canonicalPhone = digitsOnly.startsWith('55') ? digitsOnly : `55${digitsOnly}`;
  const testId = `test_fnd_${Date.now()}_${Math.random().toString(36).substring(7)}`;

  // 1. Build the full Golden Trio multimedia package
  const dispatchParams: DispatchParams = {
    storeDomain: merged.storeDomain,
    merchantName: merged.founderName,
    productTitle: merged.productTitle,
    productUrl: merged.productUrl,
    brokenSizes: merged.brokenSizes,
    totalSizesCount: merged.totalSizesCount,
    dailyAdBudget: merged.dailyAdBudget,
    planId: 'PRO_MONTHLY'
  };

  const goldenTrio = buildMultimediaOutboundPackage(dispatchParams);

  const budget = merged.dailyAdBudget ?? 250;
  const copy = [
    `🛡️ *ADSHIELD INTEL • TESTE EXECUTIVO DE EXPERIÊNCIA DO CLIENTE*`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `Olá *${merged.founderName}*, acabamos de gerar o pacote completo do *Golden Trio* para auditoria de loja:`,
    ``,
    `🏪 *Loja Auditada:* \`${merged.storeDomain}\``,
    `👕 *Produto em Campanha:* *${merged.productTitle}*`,
    `❌ *Tamanhos Rompidos:* \`[${merged.brokenSizes.join(', ')}]\``,
    `💸 *Vazamento Projetado:* *R$ ${(budget * 0.65 * 30).toLocaleString('pt-BR')}/mês* em mídia dispersada`,
    ``,
    `🎥 *VÍDEO AVATAR IA (15s):* ${goldenTrio.video.mockVideoUrl} (Avatar 9:16 PiP)`,
    `📸 *PROVA DO CRIME PLAYWRIGHT:* ${goldenTrio.evidence.mockScreenshotUrl}`,
    `🎙️ *ÁUDIO CONSULTIVO ELEVENLABS:* Pronto para gravação / envio como nota de voz`,
    ``,
    `💳 *LINK DE ASSINATURA 1-CLIQUE STRIPE (PRO R$ 297/mês):*`,
    goldenTrio.directStripeCheckoutUrl,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `👉 *Para testar a experiência real no seu próprio aparelho, clique no link abaixo:*`
  ].join('\n');

  const encodedText = encodeURIComponent(copy);
  const directWhatsAppUrl = `https://api.whatsapp.com/send?phone=${canonicalPhone}&text=${encodedText}`;
  const waMeShortUrl = `https://wa.me/${canonicalPhone}?text=${encodedText}`;

  // 3. Construct official Evolution API / Z-API payload structure
  const evolutionApiPayload = {
    number: canonicalPhone,
    textMessage: copy,
    mediaMessage: {
      mediatype: 'video' as const,
      media: goldenTrio.video.mockVideoUrl,
      caption: `🚨 Ruptura Crítica em Anúncio: ${merged.productTitle} (${merged.storeDomain})`
    },
    options: {
      delay: 1200,
      presence: 'composing' as const,
      linkPreview: true
    }
  };

  return {
    testId,
    recipientPhone: canonicalPhone,
    recipientName: merged.founderName,
    directWhatsAppUrl,
    waMeShortUrl,
    goldenTrioPackage: goldenTrio,
    evolutionApiPayload,
    simulatedAuditSummary: {
      brand: merged.storeDomain,
      criticalSizesBroken: merged.brokenSizes,
      monthlyWasteFormatted: `R$ ${(budget * 0.65 * 30).toLocaleString('pt-BR')}/mês`,
      stripeCheckoutUrl: goldenTrio.directStripeCheckoutUrl,
      generatedAt: new Date().toISOString()
    }
  };
}

/**
 * Simulates an end-to-end dispatch of the founder experience test
 */
export function simulateFounderTestDispatch(
  payload: FounderWhatsAppDispatchPayload
): {
  success: boolean;
  testId: string;
  recipientPhone: string;
  deliveredToSimulator: boolean;
  httpStatus: number;
  deliveryTimestamp: string;
} {
  return {
    success: true,
    testId: payload.testId,
    recipientPhone: payload.recipientPhone,
    deliveredToSimulator: true,
    httpStatus: 200,
    deliveryTimestamp: new Date().toISOString()
  };
}
