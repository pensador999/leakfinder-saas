// ==============================================================================
// 🧠 STORE CONTEXT MEMORY SERVICE (MEM0 PATTERN) — ADSHIELD ENTERPRISE 2026.4
// Manages episodic store memory, SKU/size historical snapshots, restock detection
// and proactive celebration notifications for the 24/7 Sentinel Watchdog.
// ==============================================================================

export interface SkuVariantSnapshot {
  productHandle: string;
  productTitle: string;
  productUrl: string;
  brokenSizes: string[];
  availableSizes: string[];
  lastInspectedAt: string;
}

export interface RestockEvent {
  productHandle: string;
  productTitle: string;
  productUrl: string;
  restockedSizes: string[];
  detectedAt: string;
}

export interface StoreMemoryProfile {
  domain: string;
  brandName: string;
  firstSeenAt: string;
  lastAuditedAt: string;
  auditCount: number;
  dailyAdBudget: number; // Configured or inferred budget
  merchantPhone?: string;
  merchantName?: string;
  knownSkus: Record<string, SkuVariantSnapshot>;
  recentRestocks: RestockEvent[];
}

const MEMORY_STORAGE_KEY_PREFIX = 'adshield_store_memory_';

// In-memory runtime cache for serverless / edge execution
const memoryRuntimeCache: Map<string, StoreMemoryProfile> = new Map();

function isBrowserLocalStorageAvailable(): boolean {
  try {
    return typeof window !== 'undefined' && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

/**
 * Normalizes store domain to a canonical lowercase format
 */
export function normalizeDomain(rawDomain: string): string {
  return rawDomain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');
}

/**
 * Retrieves store memory profile from runtime cache or persistent storage
 */
export function getStoreMemory(rawDomain: string): StoreMemoryProfile {
  const domain = normalizeDomain(rawDomain);

  // 1. Check runtime in-memory cache
  if (memoryRuntimeCache.has(domain)) {
    return memoryRuntimeCache.get(domain)!;
  }

  // 2. Check local storage if in browser environment
  if (isBrowserLocalStorageAvailable()) {
    try {
      const stored = window.localStorage.getItem(`${MEMORY_STORAGE_KEY_PREFIX}${domain}`);
      if (stored) {
        const parsed: StoreMemoryProfile = JSON.parse(stored);
        memoryRuntimeCache.set(domain, parsed);
        return parsed;
      }
    } catch (e) {
      console.warn('[storeContextMemory] Failed to read from localStorage:', e);
    }
  }

  // 3. Fallback to fresh initial profile
  const freshProfile: StoreMemoryProfile = {
    domain,
    brandName: domain,
    firstSeenAt: new Date().toISOString(),
    lastAuditedAt: new Date().toISOString(),
    auditCount: 0,
    dailyAdBudget: 150,
    knownSkus: {},
    recentRestocks: []
  };

  memoryRuntimeCache.set(domain, freshProfile);
  return freshProfile;
}

/**
 * Saves store memory profile to runtime cache and persistent storage
 */
export function saveStoreMemory(profile: StoreMemoryProfile): void {
  const domain = normalizeDomain(profile.domain);
  profile.domain = domain;
  profile.lastAuditedAt = new Date().toISOString();

  // 1. Save to in-memory map
  memoryRuntimeCache.set(domain, profile);

  // 2. Save to localStorage if in browser environment
  if (isBrowserLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(`${MEMORY_STORAGE_KEY_PREFIX}${domain}`, JSON.stringify(profile));
    } catch (e) {
      console.warn('[storeContextMemory] Failed to write to localStorage:', e);
    }
  }
}

/**
 * Compares current audit against previous SKU snapshot to detect restocked variants
 */
export function detectRestockEvents(
  rawDomain: string,
  currentProducts: Array<{
    handle: string;
    title: string;
    url?: string;
    brokenSizes: string[];
    availableSizes: string[];
  }>
): RestockEvent[] {
  const memory = getStoreMemory(rawDomain);
  const restockEvents: RestockEvent[] = [];
  const now = new Date().toISOString();

  for (const prod of currentProducts) {
    const handle = prod.handle.toLowerCase().trim();
    const prevSnapshot = memory.knownSkus[handle];

    if (prevSnapshot && prevSnapshot.brokenSizes.length > 0) {
      // Find sizes that WERE broken previously, but are NOW available
      const nowAvailableSet = new Set(prod.availableSizes.map(s => s.toUpperCase().trim()));
      const restocked = prevSnapshot.brokenSizes
        .map(s => s.toUpperCase().trim())
        .filter(brokenSize => nowAvailableSet.has(brokenSize));

      if (restocked.length > 0) {
        restockEvents.push({
          productHandle: handle,
          productTitle: prod.title || prevSnapshot.productTitle,
          productUrl: prod.url || prevSnapshot.productUrl,
          restockedSizes: restocked,
          detectedAt: now
        });
      }
    }
  }

  return restockEvents;
}

/**
 * Records a new store inspection, updates known SKUs and tracks restocks
 */
export function recordStoreInspection(
  rawDomain: string,
  auditData: {
    brandName?: string;
    dailyAdBudget?: number;
    merchantName?: string;
    merchantPhone?: string;
    products: Array<{
      handle: string;
      title: string;
      url?: string;
      brokenSizes: string[];
      availableSizes: string[];
    }>;
  }
): {
  profile: StoreMemoryProfile;
  restockEvents: RestockEvent[];
} {
  const domain = normalizeDomain(rawDomain);
  const memory = getStoreMemory(domain);
  const now = new Date().toISOString();

  // 1. Detect any restocks before overwriting snapshots
  const restockEvents = detectRestockEvents(domain, auditData.products);

  // 2. Update store profile metadata
  memory.brandName = auditData.brandName || memory.brandName;
  memory.dailyAdBudget = auditData.dailyAdBudget ?? memory.dailyAdBudget;
  memory.merchantName = auditData.merchantName || memory.merchantName;
  memory.merchantPhone = auditData.merchantPhone || memory.merchantPhone;
  memory.auditCount += 1;
  memory.lastAuditedAt = now;

  // 3. Update known SKUs snapshots
  for (const prod of auditData.products) {
    const handle = prod.handle.toLowerCase().trim();
    memory.knownSkus[handle] = {
      productHandle: handle,
      productTitle: prod.title,
      productUrl: prod.url || `https://${domain}/products/${handle}`,
      brokenSizes: prod.brokenSizes.map(s => s.toUpperCase().trim()),
      availableSizes: prod.availableSizes.map(s => s.toUpperCase().trim()),
      lastInspectedAt: now
    };
  }

  // 4. Record new restocks in history (keep last 20)
  if (restockEvents.length > 0) {
    memory.recentRestocks = [...restockEvents, ...memory.recentRestocks].slice(0, 20);
  }

  saveStoreMemory(memory);

  return {
    profile: memory,
    restockEvents
  };
}

/**
 * Formats a high-impact celebration message for WhatsApp when restock is detected
 */
export function formatRestockCelebrationMessage(params: {
  storeDomain: string;
  merchantName?: string;
  restockEvents: RestockEvent[];
}): string {
  const { storeDomain, merchantName = 'Gestor', restockEvents } = params;
  const domain = normalizeDomain(storeDomain);

  if (restockEvents.length === 0) {
    return '';
  }

  const itemsFormatted = restockEvents
    .map(ev => `  • *${ev.productTitle}*: tamanhos *[${ev.restockedSizes.join(', ')}]* voltaram ao estoque!`)
    .join('\n');

  return (
    `🎉 *SENTINELA ADSHIELD • REPOSIÇÃO DETECTADA COM SUCESSO!*\n\n` +
    `Olá, ${merchantName}! Boas notícias para a operação da *${domain}*:\n\n` +
    `Identificamos que os seguintes itens foram repostos no seu catálogo:\n` +
    `${itemsFormatted}\n\n` +
    `✅ *Ação Recomendada:* Se as campanhas deste anúncio estavam pausadas, agora você já pode reativá-las com segurança máxima no Meta Ads.\n\n` +
    `🛡️ *Seu Sentinela AdShield continua ativo e vigiando seu estoque 24/7.*`
  );
}
