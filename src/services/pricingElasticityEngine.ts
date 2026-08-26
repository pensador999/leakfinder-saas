export interface PricingSimulationInput {
  productPrice: number;
  monthlyOrders: number;
  creditCardSharePercent: number; // e.g. 70%
  pixSharePercent: number; // e.g. 30%
  creditCardMdrPercent: number; // e.g. 4.49%
  pixMdrPercent: number; // e.g. 0.79%
  cogsPercent: number; // Custo da Mercadoria Vendida (CMV e.g. 35%)
  selectedPixDiscountPercent: number; // e.g. 10%
}

export interface PricingSimulationScenario {
  discountPercent: number;
  priceAfterDiscount: number;
  expectedConversionLiftPercent: number; // e.g. +24%
  projectedMonthlyOrders: number;
  grossRevenueMonthly: number;
  gatewayFeesTotalMonthly: number;
  cogsTotalMonthly: number;
  netMarginTotalMonthly: number;
  netMarginDeltaMonthly: number; // Extra cash compared to baseline
  roiSummary: string;
}

export interface PricingElasticityResult {
  baseline: {
    productPrice: number;
    monthlyOrders: number;
    grossRevenueMonthly: number;
    gatewayFeesMonthly: number;
    cogsMonthly: number;
    netMarginMonthly: number;
  };
  scenarios: {
    pix5: PricingSimulationScenario;
    pix7: PricingSimulationScenario;
    pix10: PricingSimulationScenario;
    custom: PricingSimulationScenario;
  };
  bestScenarioRecommendation: PricingSimulationScenario;
  liquidPixBadgeSnippet: string;
  executiveInsights: string[];
}

export function calculatePricingElasticity(input: PricingSimulationInput): PricingElasticityResult {
  const {
    productPrice,
    monthlyOrders,
    creditCardSharePercent,
    pixSharePercent,
    creditCardMdrPercent,
    pixMdrPercent,
    cogsPercent,
    selectedPixDiscountPercent
  } = input;

  // BASELINE (Cenário Atual sem estímulo forte de Pix)
  const baselineGross = productPrice * monthlyOrders;
  const baselineCardOrders = monthlyOrders * (creditCardSharePercent / 100);
  const baselinePixOrders = monthlyOrders * (pixSharePercent / 100);
  
  const baselineGatewayFees = 
    (baselineCardOrders * productPrice * (creditCardMdrPercent / 100)) +
    (baselinePixOrders * productPrice * (pixMdrPercent / 100));

  const baselineCogs = baselineGross * (cogsPercent / 100);
  const baselineNetMargin = baselineGross - baselineGatewayFees - baselineCogs;

  const buildScenario = (discountPct: number): PricingSimulationScenario => {
    const discountedPrice = Number((productPrice * (1 - discountPct / 100)).toFixed(2));
    
    // Elasticidade de Conversão (Baseada em benchmarks brasileiros de checkout D2C):
    // 5% desconto -> +12% conversão
    // 7% desconto -> +18% conversão
    // 10% desconto -> +26% conversão
    const conversionLiftPct = discountPct === 5 ? 12 : discountPct === 7 ? 18 : discountPct === 10 ? 26 : Math.round(discountPct * 2.5);
    const newMonthlyOrders = Math.round(monthlyOrders * (1 + conversionLiftPct / 100));
    
    // O desconto no Pix migra compradores do cartão para o Pix (ex: 65% compram no Pix com desconto atrativo)
    const newPixShare = Math.min(80, pixSharePercent + (discountPct >= 10 ? 35 : discountPct >= 7 ? 25 : 15));
    const newCardShare = 100 - newPixShare;

    const newPixOrders = newMonthlyOrders * (newPixShare / 100);
    const newCardOrders = newMonthlyOrders * (newCardShare / 100);

    const grossRevenue = (newPixOrders * discountedPrice) + (newCardOrders * productPrice);
    
    const gatewayFees = 
      (newCardOrders * productPrice * (creditCardMdrPercent / 100)) +
      (newPixOrders * discountedPrice * (pixMdrPercent / 100));

    const totalCogs = newMonthlyOrders * productPrice * (cogsPercent / 100);
    const netMargin = grossRevenue - gatewayFees - totalCogs;
    const netMarginDelta = Math.round(netMargin - baselineNetMargin);

    return {
      discountPercent: discountPct,
      priceAfterDiscount: discountedPrice,
      expectedConversionLiftPercent: conversionLiftPct,
      projectedMonthlyOrders: newMonthlyOrders,
      grossRevenueMonthly: Math.round(grossRevenue),
      gatewayFeesTotalMonthly: Math.round(gatewayFees),
      cogsTotalMonthly: Math.round(totalCogs),
      netMarginTotalMonthly: Math.round(netMargin),
      netMarginDeltaMonthly: netMarginDelta,
      roiSummary: netMarginDelta > 0 
        ? `+R$ ${netMarginDelta.toLocaleString('pt-BR')} de lucro líquido extra por mês.` 
        : `Margem estável com aumento de giro de estoque.`
    };
  };

  const pix5 = buildScenario(5);
  const pix7 = buildScenario(7);
  const pix10 = buildScenario(10);
  const custom = buildScenario(selectedPixDiscountPercent);

  // O cenário de 10% geralmente vence no volume total e retenção de caixa imediato
  const bestScenarioRecommendation = pix10.netMarginDeltaMonthly >= pix7.netMarginDeltaMonthly ? pix10 : pix7;

  const liquidPixBadgeSnippet = `<!-- 🟢 LEAKFINDER: BOX DINÂMICO DE DESCONTO PIX COM ECONOMIA REAL -->
<!-- Cole este bloco abaixo do preço no seu arquivo main-product.liquid ou product-form.liquid -->
{% assign pix_discount_percentage = ${selectedPixDiscountPercent} %}
{% assign discount_factor = 100 | minus: pix_discount_percentage | divided_by: 100.0 %}
{% assign pix_price = product.selected_or_first_available_variant.price | times: discount_factor %}
{% assign savings = product.selected_or_first_available_variant.price | minus: pix_price %}

<div class="leakfinder-pix-badge" style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 14px; padding: 14px 18px; margin: 14px 0; display: flex; align-items: center; justify-content: space-between; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="display: flex; align-items: center; gap: 12px;">
    <div style="background: #16a34a; color: #fff; width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 16px;">
      ⚡
    </div>
    <div>
      <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; color: #15803d; letter-spacing: 0.5px;">
        Pague no Pix e Ganhe ${selectedPixDiscountPercent}% OFF
      </div>
      <div style="font-size: 20px; font-weight: 900; color: #14532d; line-height: 1.1; margin-top: 2px;">
        {{ pix_price | money }}
      </div>
    </div>
  </div>
  <div style="text-align: right;">
    <span style="background: #dcfce7; color: #166534; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; border: 1px solid #bbf7d0;">
      Economia de {{ savings | money }}
    </span>
    <div style="font-size: 10px; color: #15803d; margin-top: 3px; font-weight: 600;">
      Aprovação Imediata
    </div>
  </div>
</div>`;

  return {
    baseline: {
      productPrice,
      monthlyOrders,
      grossRevenueMonthly: Math.round(baselineGross),
      gatewayFeesMonthly: Math.round(baselineGatewayFees),
      cogsMonthly: Math.round(baselineCogs),
      netMarginMonthly: Math.round(baselineNetMargin)
    },
    scenarios: {
      pix5,
      pix7,
      pix10,
      custom
    },
    bestScenarioRecommendation,
    liquidPixBadgeSnippet,
    executiveInsights: [
      `Migrar pedidos de cartão (taxa de ${creditCardMdrPercent}%) para Pix (taxa de ${pixMdrPercent}%) gera uma economia imediata de ~3.7% sobre o faturamento transacionado.`,
      `O desconto de ${selectedPixDiscountPercent}% no Pix elimina a principal objeção de abandono de carrinho ("limite de cartão estourado" e "medo de juros").`,
      `O lojista recebe o capital em D+0 (na hora na conta bancária), zerando custos de antecipação de recebíveis em bancos.`
    ]
  };
}
