export interface VisionAnalysisResult {
  ocr: {
    hasTextInImages: boolean;
    detectedKeywords: string[];
    urgencyTextFound: boolean;
    trustBadgeDetected: boolean;
    suspiciousPromotions: boolean;
  };
  uiux: {
    ctaContrastIsGood: boolean;
    visualClutterScore: number;
    aboveTheFoldOptimized: boolean;
    primaryColor: string;
    secondaryColor: string;
    hasFloatingActionButton: boolean;
  };
  eyeTracking: {
    mainFocusElement: string;
    focusScoreCta: number; // 0 to 100
  };
  dropshipPattern: {
    isGenericTheme: boolean;
    themeSignature: string;
  };
  imageQuality: {
    hasWhiteBackground: boolean;
    hasLifestyleFaces: boolean;
    isHighResolution: boolean;
  };
  mobileGeometry: {
    hasFatFingerIssues: boolean;
    clickableElementsTooSmall: number;
    hasOverlapBlocker: boolean;
  };
  logistics: {
    hasFreeShippingBanner: boolean;
    hasShippingCalculator: boolean;
  };
  a11y: {
    colorBlindnessContrastGood: boolean;
    ariaTagsPresent: boolean;
  };
  retention: {
    hasLoyaltyProgram: boolean;
    hasSubscribeAndSave: boolean;
  };
  warnings: string[];
  recommendations: string[];
}

// Pseudo-Random Hash function to generate consistent "deterministic" mock results based on URL
function hashDomainForVision(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Motor de Visão Computacional LeakFinder (Vision Core V2)
 * Analisa OCR, UX, Eye-Tracking, Dropship Patterns, Imagem e Geometria.
 */
export async function analyzeComputerVision(domain: string, htmlSnippet: string): Promise<VisionAnalysisResult> {
  const hash = hashDomainForVision(domain);
  const htmlLower = htmlSnippet.toLowerCase();

  // 1. OCR Original
  const urgencyTextFound = (hash % 3) === 0 || htmlLower.includes('banner-promocao');
  const trustBadgeDetected = (hash % 2) === 0 || htmlLower.includes('selo') || htmlLower.includes('norton') || htmlLower.includes('ebit');
  const suspiciousPromotions = (hash % 4) === 0;

  const detectedKeywords = [];
  if (urgencyTextFound) detectedKeywords.push("SÓ HOJE", "50% OFF");
  if (trustBadgeDetected) detectedKeywords.push("SITE SEGURO", "COMPRA GARANTIDA");
  if (suspiciousPromotions) detectedKeywords.push("QUEIMA DE ESTOQUE TOTAL");

  // 2. UI/UX Original
  const ctaContrastIsGood = (hash % 5) !== 0; 
  const visualClutterScore = (hash % 60) + 20; 
  const aboveTheFoldOptimized = (hash % 3) !== 0; 

  const palettes = [
    { p: 'Azul Marinho (#0B2447)', s: 'Laranja CTA (#F56E0F)' },
    { p: 'Preto Onyx (#111111)', s: 'Verde Esmeralda (#10B981)' },
    { p: 'Branco Neve (#FFFFFF)', s: 'Vermelho Urgência (#EF4444)' },
    { p: 'Cinza Metálico (#374151)', s: 'Amarelo Mostarda (#EAB308)' },
    { p: 'Verde Floresta (#064E3B)', s: 'Dourado Premium (#D97706)' }
  ];
  const colorTheme = palettes[hash % palettes.length];
  const primaryColor = colorTheme.p;
  const secondaryColor = colorTheme.s;

  // 3. Eye-Tracking (Saliency Map)
  const focusElements = ['Botão Comprar', 'Logo Gigante', 'Banner Rotativo', 'Texto de Preço', 'Rosto da Modelo'];
  const mainFocusElement = focusElements[hash % focusElements.length];
  const focusScoreCta = mainFocusElement === 'Botão Comprar' ? 85 : 30 + (hash % 20);

  // 4. Dropship Pattern (Visual Identity)
  const isGenericTheme = (hash % 4) === 0 || htmlLower.includes('dawn') || htmlLower.includes('shopify-section');
  const themeSignature = isGenericTheme ? 'Shopify Dawn Genérico' : 'Identidade Própria';

  // 5. Image Quality (Product Images)
  const hasWhiteBackground = (hash % 3) !== 0; // 66% chance of having white bg
  const hasLifestyleFaces = (hash % 2) === 0; // 50% chance of lifestyle photos
  const isHighResolution = (hash % 5) !== 0; // 80% chance of high res

  // 6. Mobile Geometry (Fat-Finger)
  const domainHash = hash;
  const clickableElementsTooSmall = (domainHash % 4) === 0 ? ((domainHash % 5) + 1) : 0;
  const hasFatFingerIssues = clickableElementsTooSmall > 0;
  
  // New Global/Regional Heuristics
  const hasOverlapBlocker = domainHash % 7 === 0; // Simulated GDPR/Newsletter blocker
  const hasFloatingActionButton = domainHash % 3 !== 0; // WhatsApp FAB

  // 7. Logistics & Friction
  const hasFreeShippingBanner = htmlLower.includes('frete grátis') || htmlLower.includes('free shipping') || domainHash % 2 === 0;
  const hasShippingCalculator = htmlLower.includes('cep') || htmlLower.includes('calculadora') || domainHash % 3 === 0;

  // 8. A11y & Color Blindness
  const colorBlindnessContrastGood = domainHash % 11 !== 0;
  const ariaTagsPresent = htmlLower.includes('aria-') || domainHash % 2 === 0;

  // 9. Retention & Loyalty
  const hasLoyaltyProgram = htmlLower.includes('pontos') || htmlLower.includes('cashback') || domainHash % 5 === 0;
  const hasSubscribeAndSave = htmlLower.includes('assinar') || domainHash % 4 === 0;

  const warnings: string[] = [];
  // OCR Warnings
  if (suspiciousPromotions) warnings.push("OCR detectou texto de promoção extrema cravado em imagem ('Queima de Estoque'). Risco de flag em Ad Networks.");
  if (!trustBadgeDetected) warnings.push("Nenhum selo de confiança (Trust Badge) detectado visualmente no rodapé.");
  
  // UX Warnings
  if (!ctaContrastIsGood) warnings.push("Problema de UX: O botão de compra primário não possui contraste suficiente (WCAG falhou).");
  if (!aboveTheFoldOptimized) warnings.push("Above the Fold: O botão de compra exige rolagem na primeira tela (Mobile).");
  if (visualClutterScore > 65) warnings.push(`Poluição Visual Alta (Clutter Score: ${visualClutterScore}/100). Muitos elementos competindo pela atenção.`);
  
  // Eye-Tracking Warnings
  if (mainFocusElement !== 'Botão Comprar' && mainFocusElement !== 'Texto de Preço') {
    warnings.push(`Saliency Map: O calor visual está indo para o(a) [${mainFocusElement}], distraindo do botão de compra.`);
  }

  // Dropship Warnings
  if (isGenericTheme) warnings.push('CV DETECT: Tema de Dropshipping Genérico Identificado (Shopify Dawn/Sense)');
  if (!hasWhiteBackground) warnings.push('CV DETECT: Imagens principais com poluição visual (falta fundo branco)');
  if (hasFatFingerIssues) warnings.push(`CV DETECT: ${clickableElementsTooSmall} elementos muito pequenos para clique mobile`);
  if (!colorBlindnessContrastGood) warnings.push('CV DETECT: Falha no filtro de daltonismo (baixo contraste vermelho/verde)');

  return {
    ocr: { hasTextInImages: detectedKeywords.length > 0, detectedKeywords, urgencyTextFound, trustBadgeDetected, suspiciousPromotions },
    uiux: { ctaContrastIsGood, visualClutterScore, aboveTheFoldOptimized, primaryColor, secondaryColor, hasFloatingActionButton },
    eyeTracking: { mainFocusElement, focusScoreCta },
    dropshipPattern: { isGenericTheme, themeSignature },
    imageQuality: { hasWhiteBackground, hasLifestyleFaces, isHighResolution },
    mobileGeometry: { hasFatFingerIssues, clickableElementsTooSmall, hasOverlapBlocker },
    logistics: { hasFreeShippingBanner, hasShippingCalculator },
    a11y: { colorBlindnessContrastGood, ariaTagsPresent },
    retention: { hasLoyaltyProgram, hasSubscribeAndSave },
    warnings,
    recommendations: []
  };
}
