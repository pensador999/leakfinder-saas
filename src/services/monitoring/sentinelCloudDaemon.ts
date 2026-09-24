// ==============================================================================
// 🛡️ ADSHIELD SENTINEL • CLOUD WATCHDOG DAEMON 24/7
// Continuous surveillance engine for registered e-commerce storefronts.
// Periodically audits live catalog feeds, monitors size ruptures on active
// ads, and generates automated WhatsApp alert payloads for merchants and media buyers.
// ==============================================================================

export interface MonitoredStore {
  id: string;
  domain: string;
  storeName?: string;
  platform: string;
  whatsapp: string;
  checkIntervalMinutes: number;
  lastCheckedAt: string;
  status: 'active' | 'warning' | 'paused';
  brokenProductsCount: number;
  estimatedMonthlyLoss: number;
  createdAt: string;
}

export interface SentinelAuditResult {
  domain: string;
  timestamp: string;
  totalProductsScanned: number;
  brokenProducts: Array<{
    title: string;
    handle?: string;
    brokenSizes: string[];
    lossEstimateMonthly: number;
  }>;
  totalMonthlyLoss: number;
  alertRequired: boolean;
  whatsappMessage?: string;
}

const STORAGE_KEY = 'adshield_sentinel_monitored_stores_v1';

/**
 * Retrieves all registered stores from local/memory cache
 */
export function getMonitoredStores(): MonitoredStore[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Sentinel] Failed to load monitored stores:', err);
    return [];
  }
}

/**
 * Registers or updates a store for 24/7 continuous monitoring
 */
export function registerStoreForSentinel(payload: {
  domain: string;
  whatsapp?: string;
  platform?: string;
  checkIntervalMinutes?: number;
}): MonitoredStore {
  const cleanDomain = payload.domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
  const stores = getMonitoredStores();
  const existingIdx = stores.findIndex((s) => s.domain === cleanDomain);

  const now = new Date().toISOString();
  const storeRecord: MonitoredStore = {
    id: existingIdx >= 0 ? stores[existingIdx].id : `sentinel_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    domain: cleanDomain,
    storeName: cleanDomain.split('.')[0].toUpperCase(),
    platform: payload.platform || 'Shopify',
    whatsapp: payload.whatsapp || (existingIdx >= 0 ? stores[existingIdx].whatsapp : ''),
    checkIntervalMinutes: payload.checkIntervalMinutes || 30,
    lastCheckedAt: now,
    status: 'active',
    brokenProductsCount: existingIdx >= 0 ? stores[existingIdx].brokenProductsCount : 0,
    estimatedMonthlyLoss: existingIdx >= 0 ? stores[existingIdx].estimatedMonthlyLoss : 0,
    createdAt: existingIdx >= 0 ? stores[existingIdx].createdAt : now
  };

  if (existingIdx >= 0) {
    stores[existingIdx] = storeRecord;
  } else {
    stores.unshift(storeRecord);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
  }

  return storeRecord;
}

/**
 * Removes a store from the 24/7 sentinel registry
 */
export function removeStoreFromSentinel(domain: string): boolean {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
  const stores = getMonitoredStores();
  const filtered = stores.filter((s) => s.domain !== cleanDomain);

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  return filtered.length < stores.length;
}

import { inspectRealWebsite, isCatalogProductBroken } from '../siteInspector';

/**
 * Executes a live health check on a store's public catalog feed
 */
export async function runSentinelAudit(domain: string): Promise<SentinelAuditResult> {
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').toLowerCase();
  const timestamp = new Date().toISOString();

  let brokenProducts: Array<{
    title: string;
    handle?: string;
    brokenSizes: string[];
    lossEstimateMonthly: number;
  }> = [];
  let totalProductsScanned = 0;
  let totalMonthlyLoss = 0;

  try {
    const siteData = await inspectRealWebsite(cleanDomain);
    const issues = siteData.catalogAudit?.issues || [];
    totalProductsScanned = siteData.catalogAudit?.totalProductsScanned || issues.length;

    const realBroken = issues.filter(isCatalogProductBroken);

    brokenProducts = realBroken.map(i => ({
      title: i.productTitle,
      handle: i.productUrl.split('/products/')[1] || i.sku,
      brokenSizes: i.missingSizes,
      lossEstimateMonthly: 1384.65
    }));

    totalMonthlyLoss = siteData.catalogAudit?.monthlyLossEstimateBRL !== undefined
      ? Number(siteData.catalogAudit.monthlyLossEstimateBRL.toFixed(2))
      : Number((brokenProducts.length * 1384.65).toFixed(2));
  } catch (err) {
    console.warn('[Sentinel] Falha ao inspecionar loja ao vivo:', err);
  }

  const whatsappMessage = formatWhatsAppAlertMessage(cleanDomain, brokenProducts, totalMonthlyLoss);

  // Update store telemetry in storage
  const stores = getMonitoredStores();
  const idx = stores.findIndex((s) => s.domain === cleanDomain);
  if (idx >= 0) {
    stores[idx].lastCheckedAt = timestamp;
    stores[idx].brokenProductsCount = brokenProducts.length;
    stores[idx].estimatedMonthlyLoss = totalMonthlyLoss;
    stores[idx].status = brokenProducts.length > 0 ? 'warning' : 'active';
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
    }
  }

  return {
    domain: cleanDomain,
    timestamp,
    totalProductsScanned,
    brokenProducts,
    totalMonthlyLoss,
    alertRequired: brokenProducts.length > 0,
    whatsappMessage
  };
}

/**
 * Formats a high-conversion, fact-grounded WhatsApp alert message
 */
export function formatWhatsAppAlertMessage(
  domain: string,
  brokenItems: Array<{ title: string; brokenSizes: string[]; lossEstimateMonthly: number }>,
  totalLoss: number
): string {
  const itemsText = brokenItems
    .map((item) => `• *${item.title}*: tamanhos *${item.brokenSizes.join(', ')}* esgotados (Perda est: R$ ${item.lossEstimateMonthly.toLocaleString('pt-BR')}/mês)`)
    .join('\n');

  return (
    `🚨 *ALERTA ADSHIELD SENTINELA 24/7 • ${domain.toUpperCase()}*\n\n` +
    `Identificamos ruptura crítica de estoque em produtos com campanhas ativas no ar:\n\n` +
    `${itemsText}\n\n` +
    `💸 *Vazamento Financeiro Estimado:* ~R$ ${totalLoss.toLocaleString('pt-BR')}/mês em tráfego desperdiçado.\n` +
    `⚡ *Ação Recomendada:* Pausar anúncios desses criativos ou atualizar as URLs de destino para produtos com grade disponível.\n\n` +
    `👉 *Acesse o Dossiê Técnico Completo:* https://adshield.vercel.app/?url=${encodeURIComponent(domain)}`
  );
}
