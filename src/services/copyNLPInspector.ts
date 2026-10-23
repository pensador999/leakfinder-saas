import type { RealSiteData } from './siteInspector.ts';

export interface CopyNlpResult {
  score: number;
  sentiment: 'Positivo/Persuasivo' | 'Neutro/Descritivo' | 'Fraco/Passivo';
  urgencyDetected: boolean;
  scarcityDetected: boolean;
  socialProofDetected: boolean;
  actionWordsCount: number;
  headlineAnalysis: string;
  recommendations: string[];
}

const URGENCY_WORDS = [
  // PT
  'hoje', 'agora', 'últimas horas', 'termina', 'acaba', 'corra', 'imediato', 'urgente',
  // EN
  'today', 'now', 'last chance', 'ends soon', 'hurry', 'limited time', 'instant', 'flash sale',
  // DE / FR / ES
  'heute', 'jetzt', 'letzte chance', 'sofort', 'maintenant', 'dernière chance', 'hoy', 'ahora', 'últimas horas'
];
const SCARCITY_WORDS = [
  // PT
  'estoque', 'últimas unidades', 'limitado', 'exclusivo', 'restam', 'vagas', 'esgotando',
  // EN
  'in stock', 'low stock', 'only a few left', 'limited edition', 'exclusive', 'selling fast', 'almost gone',
  // DE / FR / ES
  'auf lager', 'limitiert', 'exklusiv', 'en stock', 'édition limitée', 'exclusif', 'agotando', 'edición limitada'
];
const SOCIAL_PROOF_WORDS = [
  // PT
  'avaliaram', 'estrelas', 'clientes', 'pessoas compraram', 'depoimento', 'comprovado',
  // EN
  'reviews', 'stars', 'customers', 'rated', 'verified', 'bestseller', 'best seller', 'trusted by',
  // DE / FR / ES
  'bewertungen', 'sterne', 'kunden', 'avis', 'étoiles', 'clients', 'reseñas', 'estrellas'
];
const ACTION_WORDS = [
  // PT
  'compre', 'garanta', 'descubra', 'leve', 'aproveite', 'assine', 'veja', 'receba', 'experimente', 'transforme',
  // EN
  'shop', 'buy', 'get', 'discover', 'claim', 'save', 'explore', 'order', 'upgrade', 'try',
  // DE / FR / ES
  'kaufen', 'entdecken', 'sichern', 'bestellen', 'acheter', 'découvrir', 'commander', 'comprar', 'descubre'
];

export function analyzeCopyNLP(siteData: RealSiteData): CopyNlpResult {
  const combinedText = [
    siteData.title,
    siteData.metaDescription,
    ...siteData.h1List,
    siteData.rawHtmlSnippet || ''
  ].join(' ').toLowerCase();

  let urgencyCount = 0;
  let scarcityCount = 0;
  let socialProofCount = 0;
  let actionCount = 0;

  URGENCY_WORDS.forEach(w => { if (combinedText.includes(w)) urgencyCount++; });
  SCARCITY_WORDS.forEach(w => { if (combinedText.includes(w)) scarcityCount++; });
  SOCIAL_PROOF_WORDS.forEach(w => { if (combinedText.includes(w)) socialProofCount++; });
  ACTION_WORDS.forEach(w => { if (combinedText.includes(w)) actionCount++; });

  let score = 30; // base score
  score += (urgencyCount > 0 ? 15 : 0);
  score += (scarcityCount > 0 ? 20 : 0);
  score += (socialProofCount > 0 ? 20 : 0);
  score += Math.min(actionCount * 5, 15);

  let sentiment: CopyNlpResult['sentiment'] = 'Neutro/Descritivo';
  if (score > 70) sentiment = 'Positivo/Persuasivo';
  if (score < 40) sentiment = 'Fraco/Passivo';

  const recommendations: string[] = [];
  
  if (urgencyCount === 0) {
    recommendations.push('Falta urgência na copy. Adicione termos como "Oferta termina hoje" para acelerar a decisão.');
  }
  if (scarcityCount === 0) {
    recommendations.push('Nenhum gatilho de escassez detectado. Mostre baixo estoque ("Últimas unidades") para gerar FOMO.');
  }
  if (socialProofCount === 0) {
    recommendations.push('Textos sem prova social. Fale sobre o número de clientes satisfeitos ou avaliações.');
  }
  if (actionCount < 2) {
    recommendations.push('Faltam verbos de ação imperativos (Compre, Garanta, Leve). A copy está muito descritiva e pouco ativa.');
  }

  const h1 = siteData.h1List[0] || '';
  const h1Lower = h1.toLowerCase();
  let headlineAnalysis = 'O título principal é genérico e focado apenas no nome da marca.';
  if (h1Lower.includes('frete') || h1Lower.includes('off') || h1Lower.includes('free shipping') || h1Lower.includes('sale')) {
    headlineAnalysis = 'O título principal ataca o bolso do cliente (oferta direta), muito bom para tráfego quente.';
  } else if (actionCount > 0 && h1.length > 20) {
    headlineAnalysis = 'O título principal possui boa extensão e verbos de ação, tendendo a conversões melhores.';
  }

  return {
    score,
    sentiment,
    urgencyDetected: urgencyCount > 0,
    scarcityDetected: scarcityCount > 0,
    socialProofDetected: socialProofCount > 0,
    actionWordsCount: actionCount,
    headlineAnalysis,
    recommendations
  };
}
