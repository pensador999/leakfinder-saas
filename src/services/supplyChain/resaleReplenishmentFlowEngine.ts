// ==============================================================================
// 📦 MOTOR DE REPOSIÇÃO DE PEÇAS & FLUXO CONTÍNUO (REVENDA & ENVIO IMEDIATO)
// Especializado em produtos de compra/lote fechado (não sublimados sob demanda),
// como camisas com tag "Envio Imediato", linha casual/algodão, bonés, bandanas e calçados.
// ==============================================================================

import type { CatalogProductIssue } from '../siteInspector.ts';
import { isCatalogProductBroken } from '../siteInspector.ts';

export type ReplenishmentPipelineStatus = 
  | 'RUPTURA_DETECTADA'    // 🔴 Detectado pelo AdShield com estoque furado / zerado
  | 'PEDIDO_EMITIDO'       // 🟡 Ordem de compra enviada ao fornecedor
  | 'EM_TRANSITO'          // 🚚 Mercadoria despachada / com rastreio
  | 'RECEBIDO_GALPAO'      // 📦 Chegou no estoque físico / conferência
  | 'ESTOQUE_REGULARIZADO';// 🟢 Grade 100% pronta e tráfego liberado

export interface SuggestedSizeBatch {
  size: string;
  isMissingCurrently: boolean;
  suggestedQuantity: number;
  unitCostEstimated: number;
  totalBatchCostEstimated: number;
}

export interface ResaleReplenishmentItem {
  id: string;
  sku: string;
  productTitle: string;
  productUrl: string;
  imageSrc: string;
  price: number;
  category: 'CAMISA_ENVIO_IMEDIATO' | 'ACESSORIO_REVENDA' | 'CALCADO_REVENDA' | 'EQUIPAMENTO_PESCA_REVENDA' | 'VESTUARIO_CASUAL';
  ruptureType: 'RUPTURA_GRADE_ANCORA' | 'RUPTURA_TOTAL' | 'ESTOQUE_CRITICO';
  availableSizes: string[];
  missingSizes: string[];
  suggestedBatches: SuggestedSizeBatch[];
  totalSuggestedUnits: number;
  estimatedTotalReplenishmentCostBRL: number;
  estimatedProtectedRevenueMonthlyBRL: number;
  status: ReplenishmentPipelineStatus;
  statusUpdatedAt: string;
  supplierNotes?: string;
  trackingCode?: string;
  adTrafficAction: 'PAUSAR_ANUNCIOS' | 'MANTER_PAUSADO' | 'LIBERAR_TRAFEGO_ESCALA';
}

export interface ResaleReplenishmentSummary {
  totalResaleProductsAudited: number;
  totalNeedingReplenishment: number;
  totalSuggestedUnitsToOrder: number;
  totalInvestmentRequiredBRL: number;
  totalMonthlyRevenueAtRiskBRL: number;
  items: ResaleReplenishmentItem[];
}

const STORAGE_KEY_PREFIX = 'adshield_replenishment_flow_';

/**
 * Identifica se um produto é de Revenda, Lote ou Linha de Envio Imediato
 */
export function isResaleOrImmediateDispatch(item: {
  productTitle?: string;
  productUrl?: string;
  sku?: string;
  manufacturingType?: 'REVENDA' | 'FABRICACAO_PROPRIA';
  isResaleAccessory?: boolean;
}): boolean {
  const t = (item.productTitle || '').toUpperCase();
  const u = (item.productUrl || '').toUpperCase();
  const s = (item.sku || '').toUpperCase();

  const isImmediate = t.includes('ENVIO IMEDIATO') || 
                      t.includes('PRONTA ENTREGA') || 
                      u.includes('ENVIO-IMEDIATO') || 
                      u.includes('PRONTA-ENTREGA');

  const isResaleGood = item.manufacturingType === 'REVENDA' || item.isResaleAccessory === true;

  const isAccessory = 
    t.includes('BONÉ') || t.includes('BONE') || 
    t.includes('BANDANA') || t.includes('MANGUITO') || 
    t.includes('COPO') || t.includes('CANIVETE') || 
    t.includes('ÓCULOS') || t.includes('OCULOS') ||
    t.includes('CARTEIRA') || t.includes('CINTO') ||
    t.includes('MEIA') || t.includes('CHAPÉU') || t.includes('CHAPEU');

  const isPlainCottonOrCasual = 
    s.startsWith('APC') || s.startsWith('CMB') || s.startsWith('CBT') || s.startsWith('BT') ||
    t.includes('ALGODÃO') || t.includes('ALGODAO') || t.includes('WORK') || t.includes('CASUAL') ||
    t.includes('BOTA') || t.includes('BOTINA') || t.includes('CALÇADO') || t.includes('CALCADO');

  return isImmediate || isResaleGood || isAccessory || isPlainCottonOrCasual;
}

/**
 * Categoriza o item para fins de lote de reposição e lead time
 */
function classifyCategory(title: string, sku: string): ResaleReplenishmentItem['category'] {
  const t = title.toUpperCase();
  if (t.includes('ENVIO IMEDIATO') || t.includes('PRONTA ENTREGA')) return 'CAMISA_ENVIO_IMEDIATO';
  if (t.includes('BOTA') || t.includes('BOTINA') || t.includes('SAPATO')) return 'CALCADO_REVENDA';
  if (t.includes('ISCA') || t.includes('ANZOL') || t.includes('CARRETILHA') || t.includes('VARA')) return 'EQUIPAMENTO_PESCA_REVENDA';
  if (sku.startsWith('APC') || t.includes('ALGODÃO') || t.includes('CASUAL')) return 'VESTUARIO_CASUAL';
  return 'ACESSORIO_REVENDA';
}

/**
 * Calcula a sugestão de lote de reposição com base na Curva ABC de vendas do e-commerce brasileiro
 */
function calculateReplenishmentBatch(
  category: ResaleReplenishmentItem['category'],
  missingSizes: string[],
  availableSizes: string[],
  retailPrice: number
): { batches: SuggestedSizeBatch[]; totalUnits: number; totalCost: number } {
  // Custo estimado de compra: ~35% do valor de venda no varejo
  const unitCost = Math.round(retailPrice * 0.35);
  const batches: SuggestedSizeBatch[] = [];

  if (category === 'CALCADO_REVENDA') {
    // Calçados: Curva 38 a 44 (39 a 42 concentram 75%)
    const shoeDistribution: Record<string, number> = {
      '38': 5,
      '39': 20,
      '40': 30,
      '41': 30,
      '42': 10,
      '43': 5
    };

    Object.entries(shoeDistribution).forEach(([size, qty]) => {
      const isMissing = missingSizes.includes(size) || !availableSizes.includes(size);
      // Se está em falta, priorizar quantidade cheia; se ainda tem, buffer mínimo
      const suggestedQuantity = isMissing ? qty : Math.round(qty * 0.3);
      batches.push({
        size,
        isMissingCurrently: isMissing,
        suggestedQuantity,
        unitCostEstimated: unitCost,
        totalBatchCostEstimated: suggestedQuantity * unitCost
      });
    });
  } else if (category === 'ACESSORIO_REVENDA' || category === 'EQUIPAMENTO_PESCA_REVENDA') {
    // Acessório / Tamanho Único: lote padrão de 50 ou 100 peças
    const suggestedQuantity = 60;
    batches.push({
      size: 'ÚNICO',
      isMissingCurrently: missingSizes.length > 0 || availableSizes.length === 0,
      suggestedQuantity,
      unitCostEstimated: unitCost,
      totalBatchCostEstimated: suggestedQuantity * unitCost
    });
  } else {
    // Vestuário (Camisas Envio Imediato / Algodão): Curva P a G2 (M e G concentram ~68%)
    const apparelDistribution: Record<string, number> = {
      'P': 10,
      'M': 35,
      'G': 35,
      'GG': 15,
      'G1': 5
    };

    Object.entries(apparelDistribution).forEach(([size, qty]) => {
      const isMissing = missingSizes.includes(size) || !availableSizes.includes(size);
      const suggestedQuantity = isMissing ? qty : Math.round(qty * 0.3);
      batches.push({
        size,
        isMissingCurrently: isMissing,
        suggestedQuantity,
        unitCostEstimated: unitCost,
        totalBatchCostEstimated: suggestedQuantity * unitCost
      });
    });
  }

  const totalUnits = batches.reduce((acc, curr) => acc + curr.suggestedQuantity, 0);
  const totalCost = batches.reduce((acc, curr) => acc + curr.totalBatchCostEstimated, 0);

  return { batches, totalUnits, totalCost };
}

const memoryStore: Record<string, Record<string, { status: ReplenishmentPipelineStatus; notes?: string; tracking?: string; updatedAt: string }>> = {};

/**
 * Carrega os estados salvos de fluxo contínuo do localStorage ou da memória fallback
 */
function loadPersistedStatuses(domain: string): Record<string, { status: ReplenishmentPipelineStatus; notes?: string; tracking?: string; updatedAt: string }> {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${domain}`);
      if (raw) return JSON.parse(raw);
    }
  } catch {
    // fallback
  }
  return memoryStore[domain] || {};
}

/**
 * Salva a alteração de status de um SKU no fluxo contínuo
 */
export function persistReplenishmentStatus(
  domain: string,
  itemId: string,
  status: ReplenishmentPipelineStatus,
  meta?: { notes?: string; tracking?: string }
): void {
  const current = loadPersistedStatuses(domain);
  current[itemId] = {
    status,
    notes: meta?.notes || current[itemId]?.notes,
    tracking: meta?.tracking || current[itemId]?.tracking,
    updatedAt: new Date().toISOString()
  };
  memoryStore[domain] = current;

  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${domain}`, JSON.stringify(current));
    }
  } catch {
    // storage fallback
  }
}

/**
 * Audita o catálogo e constrói a lista de reposição contínua
 */
export function auditResaleReplenishmentFlow(
  catalogIssues: CatalogProductIssue[],
  domain: string = 'loja.com.br'
): ResaleReplenishmentSummary {
  const persisted = loadPersistedStatuses(domain);

  // 1. Filtrar apenas os produtos de Revenda / Envio Imediato
  const resaleCandidates = catalogIssues.filter(isResaleOrImmediateDispatch);
  const replenishmentItems: ResaleReplenishmentItem[] = [];

  let totalInvestment = 0;
  let totalProtectedRevenue = 0;
  let totalUnits = 0;

  for (const item of resaleCandidates) {
    const isBroken = isCatalogProductBroken(item);
    const hasCoreMissing = (item.missingSizes || []).some(s => ['M', 'G', '39', '40', '41', '42', 'ESGOTADO'].includes(s.toUpperCase()));

    // Incluir se estiver rompido ou com estoque crítico
    if (isBroken || hasCoreMissing) {
      const category = classifyCategory(item.productTitle, item.sku);
      const retailPrice = item.price || 159.90;
      const { batches, totalUnits: itemUnits, totalCost } = calculateReplenishmentBatch(
        category,
        item.missingSizes || [],
        item.availableSizes || [],
        retailPrice
      );

      const savedState = persisted[item.id];
      const status: ReplenishmentPipelineStatus = savedState?.status || 'RUPTURA_DETECTADA';
      const statusUpdatedAt = savedState?.updatedAt || new Date().toISOString();

      let adTrafficAction: ResaleReplenishmentItem['adTrafficAction'] = 'PAUSAR_ANUNCIOS';
      if (status === 'PEDIDO_EMITIDO' || status === 'EM_TRANSITO') {
        adTrafficAction = 'MANTER_PAUSADO';
      } else if (status === 'RECEBIDO_GALPAO' || status === 'ESTOQUE_REGULARIZADO') {
        adTrafficAction = 'LIBERAR_TRAFEGO_ESCALA';
      }

      const ruptureType: ResaleReplenishmentItem['ruptureType'] = (item.missingSizes || []).includes('ESGOTADO')
        ? 'RUPTURA_TOTAL'
        : hasCoreMissing
        ? 'RUPTURA_GRADE_ANCORA'
        : 'ESTOQUE_CRITICO';

      // Faturamento protegido estimado mensal = unidades sugeridas * preço de varejo
      const protectedRevenue = itemUnits * retailPrice;

      replenishmentItems.push({
        id: item.id,
        sku: item.sku,
        productTitle: item.productTitle,
        productUrl: item.productUrl,
        imageSrc: item.imageSrc,
        price: retailPrice,
        category,
        ruptureType,
        availableSizes: item.availableSizes || [],
        missingSizes: item.missingSizes || [],
        suggestedBatches: batches,
        totalSuggestedUnits: itemUnits,
        estimatedTotalReplenishmentCostBRL: totalCost,
        estimatedProtectedRevenueMonthlyBRL: protectedRevenue,
        status,
        statusUpdatedAt,
        supplierNotes: savedState?.notes,
        trackingCode: savedState?.tracking,
        adTrafficAction
      });

      totalInvestment += totalCost;
      totalProtectedRevenue += protectedRevenue;
      totalUnits += itemUnits;
    }
  }

  return {
    totalResaleProductsAudited: resaleCandidates.length,
    totalNeedingReplenishment: replenishmentItems.length,
    totalSuggestedUnitsToOrder: totalUnits,
    totalInvestmentRequiredBRL: totalInvestment,
    totalMonthlyRevenueAtRiskBRL: totalProtectedRevenue,
    items: replenishmentItems
  };
}

/**
 * Gera mensagem formatada para envio de Ordem de Compra / Reposição via WhatsApp
 */
export function generatePurchaseOrderWhatsApp(item: ResaleReplenishmentItem, brandName: string): string {
  let msg = `📦 *ORDEM DE REPOSIÇÃO CONTÍNUA • ${brandName.toUpperCase()}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `👕 Produto: *${item.productTitle}*\n`;
  msg += `🏷️ SKU: *${item.sku}*\n`;
  msg += `🔗 Link do Produto: ${item.productUrl}\n\n`;
  msg += `📋 *Grade Sugerida para Recompra Imediata:*\n`;

  item.suggestedBatches.forEach(b => {
    const statusMark = b.isMissingCurrently ? '🔴 ESGOTADO (URGENTE)' : '🟢 Regular';
    msg += `• Tamanho *${b.size}*: *${b.suggestedQuantity} peças* — ${statusMark}\n`;
  });

  msg += `\n📦 *Volume Total do Lote:* ${item.totalSuggestedUnits} peças\n`;
  msg += `💰 *Custo Previsto:* R$ ${item.estimatedTotalReplenishmentCostBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n`;
  msg += `⏱️ *Prioridade de Entrega:* IMEDIATA (Anúncios de tráfego dependem da chegada física).\n`;
  msg += `\nFavor confirmar prazo de despacho e chave da NFe para liberação da carga!`;

  return msg;
}

/**
 * Exporta a lista de reposição em formato CSV para importação no ERP (Sankhya, Bling, Tiny, SAP)
 */
export function exportReplenishmentCsv(items: ResaleReplenishmentItem[]): string {
  const headers = ['SKU', 'Produto', 'Categoria', 'Status_Fluxo', 'Tamanhos_Faltantes', 'Unidades_Sugeridas', 'Custo_Estimado_BRL', 'Receita_Protegida_BRL', 'Acao_Trafego', 'URL'];
  const rows = items.map(item => [
    `"${item.sku}"`,
    `"${item.productTitle.replace(/"/g, '""')}"`,
    `"${item.category}"`,
    `"${item.status}"`,
    `"${item.missingSizes.join(', ')}"`,
    item.totalSuggestedUnits,
    item.estimatedTotalReplenishmentCostBRL.toFixed(2),
    item.estimatedProtectedRevenueMonthlyBRL.toFixed(2),
    `"${item.adTrafficAction}"`,
    `"${item.productUrl}"`
  ]);

  return [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
}
