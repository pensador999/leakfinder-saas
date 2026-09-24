// ==============================================================================
// 📐 BLEED ACTUARY AGENT (ENGENHEIRO ATUARIAL DE SANGRIA & ROI)
// Skill: software-architecture + ecommerce-cro-catalog-doctor + falsify
// PAPEL EXCLUSIVO: O Alicerce Matemático do AdShield. Modela com rigor atuarial
// a curva gaussiana de demanda, a sangria diária/mensal em anúncios e o lucro cessante.
// VERTICALIZAÇÃO: Conectado diretamente ao DynamicVerticalContext para alimentar
// parâmetros exatos de nicho (demanda, CPC de Meta Ads, vocabulário e ticket médio).
// ==============================================================================

import { 
  resolveDynamicVertical, 
  DynamicVerticalProfile, 
  SupportedVerticalId,
  DYNAMIC_VERTICAL_REGISTRY 
} from './dynamicVerticalContext';

export type ProductNicheCategory = 
  | 'VESTUARIO_MODA' 
  | 'CALCADOS_COURO_TENIS' 
  | 'AGRO_CAMPO_OUTDOOR' 
  | 'FITNESS_BEACHWEAR' 
  | 'COSMETICOS_BEAUTY' 
  | 'ACESSORIOS_JOIAS' 
  | 'GENERICO';

export type BleedSeverityLevel = 'LEVE' | 'MODERADA' | 'CRITICA' | 'CATASTROFICA';

export interface SizeDemandWeight {
  size: string;
  demandWeightPct: number; // Porcentagem da curva normal de compra (ex: M = 35%)
  isCoreDemand: boolean;   // Tamanho de altíssimo giro
}

export interface BleedActuaryInput {
  productTitle: string;
  productPriceBRL: number;
  availableSizes: string[];
  outOfStockSizes: string[];
  niche?: ProductNicheCategory | string;
  estimatedDailyVisitors?: number;
  adSpendMonthlyEstimatedBRL?: number;
  grossMarginPct?: number; // Padrão 55%
  cvrBaselinePct?: number; // Padrão baseado no nicho
}

export interface BleedActuaryResult {
  productTitle: string;
  unitPriceBRL: number;
  nicheDetected: ProductNicheCategory;
  nicheLabel: string;
  verticalProfile: DynamicVerticalProfile;
  
  // Análise da Grade
  sizeDemandDistribution: SizeDemandWeight[];
  rupturedDemandPct: number;        // Porcentagem da demanda que está batendo na porta fechada
  hasCoreRupture: boolean;           // M/G ou 39/40/41 zerados
  
  // Modelagem Financeira da Sangria
  dailyTrafficEstimated: number;
  dailyConversionsLost: number;
  
  lostRevenueDailyBRL: number;       // Faturamento bruto perdido por dia
  lostRevenueMonthlyBRL: number;     // Faturamento bruto projetado em 30 dias
  
  wastedMediaAdDailyBRL: number;     // Verba do Meta/Google Ads queimada em cliques inúteis
  wastedMediaAdMonthlyBRL: number;   // Verba mensal de tráfego queimada
  
  totalMonthlyBleedBRL: number;      // Total da sangria atuarial combinada
  annualizedBleedProjectionBRL: number; // Sangria em 12 meses se não corrigida
  
  inflatedCacFactor: number;         // Multiplicador de aumento do CAC (ex: 2.2x)
  estimatedNormalCacBRL: number;
  estimatedInflatedCacBRL: number;
  
  severity: BleedSeverityLevel;
  methodologyNote: string;
  plainTextExecutivePitch: string;
  visceralLossHook: string;
}

/**
 * AGENTE ATUARIAL DE SANGRIA
 * Calcula a perda financeira real com precisão matemática, adaptando dinamicamente
 * à vertical detectada pelo DynamicVerticalContext.
 */
export function calculateActuarialBleed(input: BleedActuaryInput): BleedActuaryResult {
  const unitPrice = input.productPriceBRL > 0 ? input.productPriceBRL : 149.90;
  
  // Resolve o perfil de vertical dinâmico hiper-especializado
  const vertical = resolveDynamicVertical(`${input.productTitle} ${input.niche || ''}`);
  
  const demandCurve = vertical.gaussianDemandDistribution;
  const outOfStockUpper = input.outOfStockSizes.map(s => s.toUpperCase().trim());
  const availableUpper = input.availableSizes.map(s => s.toUpperCase().trim());

  // 1. Mapeia a distribuição de demanda por variante
  let totalDemandCovered = 0;
  let rupturedDemandPct = 0;
  let hasCoreRupture = false;

  const sizeDemandDistribution: SizeDemandWeight[] = [];

  // Se o item estiver 100% esgotado
  if (outOfStockUpper.includes('ESGOTADO') || (availableUpper.length === 0 && outOfStockUpper.length > 0)) {
    rupturedDemandPct = 100;
    hasCoreRupture = true;
  } else {
    for (const [sizeKey, weight] of Object.entries(demandCurve)) {
      const isMissing = outOfStockUpper.some(o => o === sizeKey || o.includes(sizeKey));
      const isCore = vertical.coreDemandSizes.includes(sizeKey);

      sizeDemandDistribution.push({
        size: sizeKey,
        demandWeightPct: weight,
        isCoreDemand: isCore
      });

      if (isMissing) {
        rupturedDemandPct += weight;
        if (isCore) {
          hasCoreRupture = true;
        }
      }
      totalDemandCovered += weight;
    }

    // Se tamanhos fora da curva padrão estiverem esgotados (ex: GG, XG), garantir proporcionalidade
    if (rupturedDemandPct === 0 && outOfStockUpper.length > 0) {
      rupturedDemandPct = Math.min(85, outOfStockUpper.length * 20);
    }
  }

  // Normaliza proporção de ruptura (0.00 a 1.00)
  const ruptureRatio = Math.min(1, Math.max(0.05, rupturedDemandPct / 100));

  // 2. Parâmetros de Tráfego e Conversão calibrados pela vertical
  const dailyVisitors = input.estimatedDailyVisitors || Math.max(80, Math.round(3500 / Math.max(50, unitPrice)));
  const baselineCvr = (input.cvrBaselinePct || vertical.baselineCvrPct) / 100;
  const dailyPotentialConversions = dailyVisitors * baselineCvr;
  
  // Conversões frustradas por dia decorrentes da grade rompida
  const bounceRateOnRupture = 0.82;
  const dailyConversionsLost = Number((dailyPotentialConversions * ruptureRatio * bounceRateOnRupture).toFixed(2));

  // 3. Faturamento Perdido (Lucro Cessante Bruto)
  const lostRevenueDailyBRL = Number((dailyConversionsLost * unitPrice).toFixed(2));
  const lostRevenueMonthlyBRL = Number((lostRevenueDailyBRL * 30).toFixed(2));

  // 4. Mídia Desperdiçada no Meta/Google Ads (alimentada pelo CPC real da vertical)
  const benchmarkCpc = vertical.benchmarkMetaAdsCpcBRL;
  const wastedMediaAdDailyBRL = Number((dailyVisitors * ruptureRatio * benchmarkCpc * 0.70).toFixed(2));
  const wastedMediaAdMonthlyBRL = Number((wastedMediaAdDailyBRL * 30).toFixed(2));

  // 5. Total de Sangria Atuarial Combinada (Mídia + Margem de Venda Perdida)
  const grossMargin = (input.grossMarginPct || 55) / 100;
  const netContributionLostMonthly = lostRevenueMonthlyBRL * grossMargin;
  const totalMonthlyBleedBRL = Number((wastedMediaAdMonthlyBRL + netContributionLostMonthly).toFixed(2));
  const annualizedBleedProjectionBRL = Number((totalMonthlyBleedBRL * 12).toFixed(2));

  // 6. Impacto no CAC (Custo de Aquisição de Clientes)
  const estimatedNormalCacBRL = Number((unitPrice * 0.28).toFixed(2));
  const inflatedCacFactor = Number((1 / Math.max(0.2, 1 - (ruptureRatio * 0.75))).toFixed(2));
  const estimatedInflatedCacBRL = Number((estimatedNormalCacBRL * inflatedCacFactor).toFixed(2));

  // 7. Nível de Severidade
  let severity: BleedSeverityLevel = 'LEVE';
  if (totalMonthlyBleedBRL >= 3000) severity = 'MODERADA';
  if (totalMonthlyBleedBRL >= 9000 || hasCoreRupture) severity = 'CRITICA';
  if (totalMonthlyBleedBRL >= 25000) severity = 'CATASTROFICA';

  // 8. Escolha do gancho de dor visceral do nicho
  const visceralHooks = vertical.vocabulary.lossPainHooks;
  const visceralLossHook = visceralHooks[Math.floor(Math.random() * visceralHooks.length)] || visceralHooks[0];

  // Mapeamento de tipo para compatibilidade legada
  let legacyNicheCategory: ProductNicheCategory = 'GENERICO';
  if (vertical.verticalId === 'CALCADOS_COURO') legacyNicheCategory = 'CALCADOS_COURO_TENIS';
  else if (vertical.verticalId === 'AGRO_CAMPO_OUTDOOR') legacyNicheCategory = 'AGRO_CAMPO_OUTDOOR';
  else if (vertical.verticalId === 'STREETWEAR_MODA_URBANA') legacyNicheCategory = 'VESTUARIO_MODA';
  else if (vertical.verticalId === 'FITNESS_BEACHWEAR') legacyNicheCategory = 'FITNESS_BEACHWEAR';
  else if (vertical.verticalId === 'COSMETICOS_BEAUTY') legacyNicheCategory = 'COSMETICOS_BEAUTY';

  const plainTextExecutivePitch = 
    `Detectamos que o SKU "${input.productTitle}" (R$ ${unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}) ` +
    `está com ${rupturedDemandPct.toFixed(0)}% da curva de demanda rompida (${outOfStockUpper.join(', ')} esgotados) no nicho [${vertical.label}]. ` +
    `Com tráfego pago ativo (CPC de benchmark R$ ${benchmarkCpc.toFixed(2)}), a sangria mensal estimada é de R$ ${totalMonthlyBleedBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ` +
    `(sendo R$ ${wastedMediaAdMonthlyBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em cliques inúteis e ` +
    `R$ ${lostRevenueMonthlyBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em faturamento frustrado). ` +
    `Isso inflaciona seu CAC em ${inflatedCacFactor}x [Simulação Baseada em Curva de Gauss de ${vertical.label}].`;

  return {
    productTitle: input.productTitle,
    unitPriceBRL: unitPrice,
    nicheDetected: legacyNicheCategory,
    nicheLabel: vertical.label,
    verticalProfile: vertical,
    sizeDemandDistribution,
    rupturedDemandPct: Number(rupturedDemandPct.toFixed(1)),
    hasCoreRupture,
    dailyTrafficEstimated: dailyVisitors,
    dailyConversionsLost,
    lostRevenueDailyBRL,
    lostRevenueMonthlyBRL,
    wastedMediaAdDailyBRL,
    wastedMediaAdMonthlyBRL,
    totalMonthlyBleedBRL,
    annualizedBleedProjectionBRL,
    inflatedCacFactor,
    estimatedNormalCacBRL,
    estimatedInflatedCacBRL,
    severity,
    methodologyNote: `[Simulação Baseada em Curva Normal de Gauss de ${vertical.label} - Demanda Rompida: ${rupturedDemandPct.toFixed(1)}%]`,
    plainTextExecutivePitch,
    visceralLossHook
  };
}
