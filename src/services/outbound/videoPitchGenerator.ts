// ==============================================================================
// 🎬 VIDEO PITCH GENERATOR SERVICE — ADSHIELD ENTERPRISE 2026.4
// Generates hyper-personalized 15 to 20-second video scripts for AI Avatars
// (Duix-Avatar / HeyGem), pointing directly to the merchant's out-of-stock sizes.
// ==============================================================================

export interface VideoPitchScript {
  id: string;
  storeDomain: string;
  merchantName: string;
  productTitle: string;
  brokenSizes: string[];
  estimatedMonthlyLoss: number;
  wordCount: number;
  estimatedDurationSeconds: number;
  scriptBlocks: {
    hook: string;       // 0-4s: Personal greeting + Pattern interrupt
    proof: string;      // 4-9s: Direct reference to background website screen
    financial: string;  // 9-14s: Grounded monthly loss simulation
    cta: string;        // 14-18s: Urgent action + 1-click Sentinel activation
  };
  fullSpeechText: string;
  subtitlesSrt: string;
}

export interface VideoPitchInput {
  storeDomain: string;
  merchantName?: string;
  productTitle: string;
  brokenSizes: string[];
  estimatedMonthlyLoss: number;
  senderName?: string;
}

/**
 * Normalizes merchant first name for natural conversational audio
 */
export function extractFirstName(fullName?: string): string {
  if (!fullName || !fullName.trim()) return 'Gestor';
  return fullName.trim().split(' ')[0];
}

/**
 * Generates an SRT subtitle file string for the 15-second speech
 */
function generateSrtSubtitles(blocks: { hook: string; proof: string; financial: string; cta: string }): string {
  return `
1
00:00:00,000 --> 00:00:04,200
${blocks.hook}

2
00:00:04,200 --> 00:00:09,000
${blocks.proof}

3
00:00:09,000 --> 00:00:13,800
${blocks.financial}

4
00:00:13,800 --> 00:00:18,500
${blocks.cta}
  `.trim();
}

/**
 * Generates a calibrated 15-20 second outbound video pitch
 */
export function generateVideoPitchScript(input: VideoPitchInput): VideoPitchScript {
  const {
    storeDomain,
    merchantName,
    productTitle,
    brokenSizes,
    estimatedMonthlyLoss,
    senderName = 'Lucas'
  } = input;

  const firstName = extractFirstName(merchantName);
  const cleanDomain = storeDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
  const sizesFormatted = brokenSizes.join(' e ');
  const formattedLoss = `R$ ${estimatedMonthlyLoss.toLocaleString('pt-BR')}`;

  const hook = `Fala, ${firstName}! Aqui é o ${senderName} do AdShield para a ${cleanDomain}.`;
  const proof = `Olha a tela atrás: "${productTitle}" tá anunciando, mas [${sizesFormatted}] esgotaram.`;
  const financial = `No simulador, isso dá ~${formattedLoss}/mês de tráfego perdido.`;
  const cta = `Pausa o anúncio agora ou ativa o Sentinela 24/7 no link abaixo. Um abraço!`;

  const fullSpeechText = `${hook} ${proof} ${financial} ${cta}`;
  const words = fullSpeechText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Average speaking rate in Brazilian Portuguese video pitches is ~2.8 to 3.0 words/second (170-180 wpm)
  const estimatedDurationSeconds = Number((wordCount / 2.9).toFixed(1));

  const subtitlesSrt = generateSrtSubtitles({ hook, proof, financial, cta });

  return {
    id: `pitch_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    storeDomain: cleanDomain,
    merchantName: firstName,
    productTitle,
    brokenSizes,
    estimatedMonthlyLoss,
    wordCount,
    estimatedDurationSeconds,
    scriptBlocks: {
      hook,
      proof,
      financial,
      cta
    },
    fullSpeechText,
    subtitlesSrt
  };
}
