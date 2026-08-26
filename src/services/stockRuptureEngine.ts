export interface StockRuptureInput {
  dailyAdSpend: number; // e.g. R$ 250/day
  productPrice: number; // e.g. R$ 159.90
  grossMarginPercent: number; // e.g. 60%
  rupturedSizes: string[]; // e.g. ['G', 'GG']
  totalSkusMonitored: number;
}

export interface StockRuptureAnalysisResult {
  estimatedDemandLossPercent: number;
  dailyWastedAdSpend: number;
  monthlyWastedAdSpend: number;
  monthlyLostGrossMargin: number;
  totalMonthlyFinancialBleed: number;
  recommendedActions: {
    priority: 'URGENTE' | 'ALTA' | 'MEDIA';
    title: string;
    description: string;
    estimatedSavings: string;
  }[];
  whatsAppAlertPreview: string;
}

// Distribuição estatística de demanda de vestuário no Brasil (E-Commerce D2C Benchmark)
const SIZE_DEMAND_DISTRIBUTION: Record<string, number> = {
  'PP': 5,
  'P': 15,
  'M': 25,
  'G': 30,
  'GG': 18,
  'G1': 5,
  'G2': 2
};

export function analyzeStockRupture(input: StockRuptureInput): StockRuptureAnalysisResult {
  const { dailyAdSpend, productPrice, grossMarginPercent, rupturedSizes } = input;

  // Calcula a porcentagem de demanda perdida somando os tamanhos em falta
  let demandLossPercent = 0;
  for (const size of rupturedSizes) {
    const upperSize = size.toUpperCase().trim();
    if (SIZE_DEMAND_DISTRIBUTION[upperSize]) {
      demandLossPercent += SIZE_DEMAND_DISTRIBUTION[upperSize];
    } else {
      demandLossPercent += 10; // Fallback para outros tamanhos
    }
  }

  // Teto de perda
  demandLossPercent = Math.min(90, Math.max(0, demandLossPercent));

  // Dinheiro de anúncio desperdiçado (tráfego pago que chega no site e não encontra o tamanho)
  const dailyWastedAdSpend = Math.round(dailyAdSpend * (demandLossPercent / 100));
  const monthlyWastedAdSpend = dailyWastedAdSpend * 30;

  // Margem bruta perdida em vendas que deixaram de acontecer
  const estimatedDailyLostOrders = (dailyAdSpend / 35) * (demandLossPercent / 100); // CAC médio de R$ 35
  const dailyLostMargin = estimatedDailyLostOrders * (productPrice * (grossMarginPercent / 100));
  const monthlyLostGrossMargin = Math.round(dailyLostMargin * 30);

  const totalMonthlyBleed = monthlyWastedAdSpend + monthlyLostGrossMargin;

  const actions: StockRuptureAnalysisResult['recommendedActions'] = [];

  if (demandLossPercent >= 30) {
    actions.push({
      priority: 'URGENTE',
      title: 'Pausar Anúncios Diretos no Meta Ads para este SKU',
      description: `Como os tamanhos ${rupturedSizes.join(', ')} representam ${demandLossPercent}% da procura, continuar anunciando está queimando R$ ${dailyWastedAdSpend}/dia sem retorno.`,
      estimatedSavings: `Economia imediata de R$ ${monthlyWastedAdSpend.toLocaleString('pt-BR')}/mês em anúncios.`
    });
  }

  actions.push({
    priority: 'ALTA',
    title: 'Redirecionar Tráfego para Produto com Grade 100% Cheia',
    description: 'Substitua a URL de destino das campanhas de tráfego pago por um modelo similar que tenha todos os tamanhos disponíveis.',
    estimatedSavings: 'Recupera até 85% das conversões perdidas.'
  });

  actions.push({
    priority: 'MEDIA',
    title: 'Ativar Captura de Lead "Avise-me Quando Chegar" no Tema',
    description: 'Instale o widget de fila de espera com WhatsApp no botão do tamanho esgotado para reter os clientes e avisar no dia da reposição.',
    estimatedSavings: 'Gera uma lista de compradores quentes prontos para compra.'
  });

  const whatsAppAlertPreview = `🚨 *ALERTA VIGIA 24H: RUPTURA DE ESTOQUE DETECTADA* 🚨

⚠️ *Atenção Gestor de Tráfego:*
O produto principal de anúncios esgotou os seguintes tamanhos:
❌ *Tamanhos em Falta:* ${rupturedSizes.join(', ')} (${demandLossPercent}% da demanda total)

🔥 *Desperdício em Ads:* ~R$ ${dailyWastedAdSpend}/dia (R$ ${monthlyWastedAdSpend.toLocaleString('pt-BR')}/mês)
📉 *Impacto Total de Margem:* R$ ${totalMonthlyBleed.toLocaleString('pt-BR')}/mês

👉 *Ação Recomendada Imediata:*
Pause o criativo correspondente no Gerenciador de Anúncios ou aponte o tráfego para um SKU com grade completa.`;

  return {
    estimatedDemandLossPercent: demandLossPercent,
    dailyWastedAdSpend,
    monthlyWastedAdSpend,
    monthlyLostGrossMargin,
    totalMonthlyFinancialBleed: totalMonthlyBleed,
    recommendedActions: actions,
    whatsAppAlertPreview
  };
}
