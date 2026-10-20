// ==============================================================================
// 🗄️ ADSHIELD STORE AUDIT HISTORY & INSTANT LRU VAULT SERVICE (LOCAL-FIRST)
// Manages continuous storage of audits in LocalStorage + Runtime LRU Cache (10 stores)
// with optional background sync to Supabase PostgreSQL (audit_reports).
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { circuitBreaker } from '../../lib/circuitBreaker';
import { AgentDiagnosticResult } from '../../types';
import { isCatalogProductBroken } from '../siteInspector';

export interface AuditHistoryEntry {
  id: string;
  domain: string;
  brandName: string;
  growthScore: number;
  scoreDelta?: number; // e.g. +14 pts from previous audit
  brokenSkusCount: number;
  monthlyLossBRL: number;
  lossDeltaBRL?: number; // e.g. -R$ 2.450 saved
  auditedAt: string;
  isCurrent?: boolean;
}

export interface RecentAuditedStoreSummary {
  domain: string;
  url: string;
  brandName: string;
  niche: string;
  growthScore: number;
  brokenSkusCount: number;
  monthlyLossBRL: number;
  auditedAt: string;
}

export interface StoreEvolutionSummary {
  domain: string;
  brandName: string;
  firstAuditDate: string;
  latestAuditDate: string;
  totalAuditsRan: number;
  initialScore: number;
  currentScore: number;
  netScoreGain: number;
  initialMonthlyLoss: number;
  currentMonthlyLoss: number;
  totalMonthlyWastePrevented: number;
  audits: AuditHistoryEntry[];
}

const LOCAL_STORAGE_HISTORY_PREFIX = 'adshield_audit_history_';
const RECENT_STORES_INDEX_KEY = 'adshield_recent_audited_stores_v1';
const RECENT_DIAGNOSTIC_PREFIX = 'adshield_recent_diag_';
const MAX_LRU_STORES = 10;

// In-memory runtime LRU cache for 0ms store switching and Node/Vitest compatibility
const runtimeDiagnosticLru = new Map<string, AgentDiagnosticResult>();
const memoryFallbackStorage = new Map<string, string>();

function safeGetStorage(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      return localStorage.getItem(key);
    }
  } catch {}
  return memoryFallbackStorage.get(key) ?? null;
}

function safeSetStorage(key: string, value: string): void {
  memoryFallbackStorage.set(key, value);
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(key, value);
    }
  } catch {}
}

function normalizeStoreDomain(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .split('/')[0];
}

/**
 * ⚡ Stores the full diagnostic in the 10-store LRU cache (0ms retrieval)
 * and persists a quota-safe compact copy in localStorage.
 */
export function cacheRecentAuditResult(result: AgentDiagnosticResult): void {
  const domain = normalizeStoreDomain(result.realSiteData.domain || result.input.siteUrl);
  if (!domain) return;

  // Refresh key order in Map (LRU)
  if (runtimeDiagnosticLru.has(domain)) {
    runtimeDiagnosticLru.delete(domain);
  }
  runtimeDiagnosticLru.set(domain, result);

  if (runtimeDiagnosticLru.size > MAX_LRU_STORES) {
    const oldestKey = runtimeDiagnosticLru.keys().next().value;
    if (oldestKey) runtimeDiagnosticLru.delete(oldestKey);
  }

  const brokenCount = (result.realSiteData.catalogAudit?.issues || []).filter(isCatalogProductBroken).length;
  const monthlyLoss = Math.round(
    result.realSiteData.catalogAudit?.monthlyLossEstimateBRL ??
      (brokenCount === 0 ? 0 : brokenCount * (result.input.averageOrderValue || 180) * 8)
  );

  const summaryEntry: RecentAuditedStoreSummary = {
    domain,
    url: result.realSiteData.url || `https://${domain}`,
    brandName: result.realSiteData.brandName || result.input.businessName || domain,
    niche: result.input.niche || 'E-Commerce D2C',
    growthScore: result.growthScore,
    brokenSkusCount: brokenCount,
    monthlyLossBRL: monthlyLoss,
    auditedAt: new Date().toISOString()
  };

  try {
    const existingList = getRecentAuditedStoresList();
    const updatedList = [
      summaryEntry,
      ...existingList.filter(item => normalizeStoreDomain(item.domain) !== domain)
    ].slice(0, MAX_LRU_STORES);

    safeSetStorage(RECENT_STORES_INDEX_KEY, JSON.stringify(updatedList));

    // Save a quota-safe pruned diagnostic for the top 5 recent stores
    const prunedDiag: AgentDiagnosticResult = {
      ...result,
      realSiteData: {
        ...result.realSiteData,
        rawHtmlSnippet: undefined,
        scrapedMarkdown: undefined,
        catalogAudit: result.realSiteData.catalogAudit
          ? {
              ...result.realSiteData.catalogAudit,
              issues: (result.realSiteData.catalogAudit.issues || []).slice(0, 40).map(issue => ({
                ...issue,
                detailedSkus: undefined
              }))
            }
          : result.realSiteData.catalogAudit
      }
    };
    safeSetStorage(`${RECENT_DIAGNOSTIC_PREFIX}${domain}`, JSON.stringify(prunedDiag));

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new Event('recent-audits-updated'));
    }
  } catch {
    // Non-fatal if storage quota is near limit
  }
}

/**
 * ⚡ Retrieves a cached diagnostic for a domain in 0ms (if audited in current session or recent localStorage)
 */
export function getCachedAuditByDomain(rawDomain: string): AgentDiagnosticResult | null {
  const domain = normalizeStoreDomain(rawDomain);
  if (!domain) return null;

  if (runtimeDiagnosticLru.has(domain)) {
    return runtimeDiagnosticLru.get(domain)!;
  }

  try {
    const raw = safeGetStorage(`${RECENT_DIAGNOSTIC_PREFIX}${domain}`);
    if (raw) {
      const parsed: AgentDiagnosticResult = JSON.parse(raw);
      runtimeDiagnosticLru.set(domain, parsed);
      return parsed;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * 📋 Returns the list of up to 10 recently audited stores
 */
export function getRecentAuditedStoresList(): RecentAuditedStoreSummary[] {
  try {
    const raw = safeGetStorage(RECENT_STORES_INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * 💾 Saves an audit to LocalStorage + LRU Vault first (Local-First), then optionally syncs to Supabase
 */
export async function saveAuditToDatabase(result: AgentDiagnosticResult): Promise<string | null> {
  const domain = normalizeStoreDomain(result.realSiteData.domain || result.input.siteUrl);
  const brokenCount = (result.realSiteData.catalogAudit?.issues || []).filter(isCatalogProductBroken).length;

  const monthlyLoss = Math.round(
    result.realSiteData.catalogAudit?.monthlyLossEstimateBRL ??
      (result.realSiteData.catalogAudit?.catalogHealthScore === 100 || brokenCount === 0
        ? 0
        : brokenCount * (result.input.averageOrderValue || 180) * 8)
  );

  const auditRecord = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    domain,
    brand_name: result.realSiteData.brandName || domain,
    growth_score: result.growthScore,
    estimated_revenue_lift_min: result.estimatedRevenueLiftMin || 0,
    estimated_revenue_lift_max: result.estimatedRevenueLiftMax || 0,
    raw_payload: result,
    is_public: true,
    created_at: new Date().toISOString()
  };

  // 1. SEMPRE salva primeiro no Cache Instantâneo LRU (10 lojas) e no Histórico Local por domínio
  cacheRecentAuditResult(result);

  try {
    const existingLocal = getLocalStoreHistory(domain);
    const updatedHistory: AuditHistoryEntry[] = [
      {
        id: auditRecord.id,
        domain,
        brandName: auditRecord.brand_name,
        growthScore: auditRecord.growth_score,
        brokenSkusCount: brokenCount,
        monthlyLossBRL: monthlyLoss,
        auditedAt: auditRecord.created_at
      },
      ...existingLocal.filter(e => {
        const entryTime = new Date(e.auditedAt).getTime();
        const curTime = new Date(auditRecord.created_at).getTime();
        return Math.abs(curTime - entryTime) > 60000;
      })
    ].slice(0, 15);

    safeSetStorage(`${LOCAL_STORAGE_HISTORY_PREFIX}${domain}`, JSON.stringify(updatedHistory));
  } catch (err) {
    console.warn('[storeAuditHistoryService] LocalStorage write warning:', err);
  }

  // 2. Sincronização opcional em segundo plano com Supabase
  if (isSupabaseConfigured && !circuitBreaker.isCircuitOpen()) {
    try {
      await supabase
        .from('audit_reports')
        .insert([
          {
            domain: auditRecord.domain,
            brand_name: auditRecord.brand_name,
            growth_score: auditRecord.growth_score,
            estimated_revenue_lift_min: auditRecord.estimated_revenue_lift_min,
            estimated_revenue_lift_max: auditRecord.estimated_revenue_lift_max,
            raw_payload: auditRecord.raw_payload,
            is_public: auditRecord.is_public
          }
        ]);
    } catch {
      // Non-fatal in Local-First mode
    }
  }

  return auditRecord.id;
}

/**
 * 📈 Retrieves the complete history and computed score evolution for a domain
 */
export async function getStoreAuditEvolution(
  domain: string,
  currentDiagnostic?: AgentDiagnosticResult | null
): Promise<StoreEvolutionSummary | null> {
  const cleanDomain = normalizeStoreDomain(domain);
  let rawEntries: AuditHistoryEntry[] = getLocalStoreHistory(cleanDomain);

  if (rawEntries.length === 0 && isSupabaseConfigured && !circuitBreaker.isCircuitOpen()) {
    try {
      const { data, error } = await supabase
        .from('audit_reports')
        .select('id, domain, brand_name, growth_score, raw_payload, created_at')
        .ilike('domain', `%${cleanDomain}%`)
        .order('created_at', { ascending: false })
        .limit(10);

      if (!error && data && data.length > 0) {
        rawEntries = data.map(row => {
          const payload = row.raw_payload as AgentDiagnosticResult;
          const broken = (payload?.realSiteData?.catalogAudit?.issues || []).filter(isCatalogProductBroken).length;
          const loss = broken === 0 ? 0 : broken * (payload?.input?.averageOrderValue || 180) * 8;

          return {
            id: row.id,
            domain: row.domain,
            brandName: row.brand_name,
            growthScore: row.growth_score,
            brokenSkusCount: broken,
            monthlyLossBRL: loss,
            auditedAt: row.created_at
          };
        });
      }
    } catch {
      // Fallback to local
    }
  }

  if (rawEntries.length === 0) {
    if (!currentDiagnostic) return null;

    const currentBroken = (currentDiagnostic.realSiteData.catalogAudit?.issues || []).filter(isCatalogProductBroken).length;
    const currentLoss = currentBroken === 0 ? 0 : currentBroken * (currentDiagnostic.input.averageOrderValue || 180) * 8;

    const singleEntry: AuditHistoryEntry = {
      id: 'current-baseline',
      domain: cleanDomain,
      brandName: currentDiagnostic.realSiteData.brandName,
      growthScore: currentDiagnostic.growthScore,
      brokenSkusCount: currentBroken,
      monthlyLossBRL: currentLoss,
      auditedAt: new Date().toISOString(),
      isCurrent: true
    };

    return {
      domain: cleanDomain,
      brandName: currentDiagnostic.realSiteData.brandName,
      firstAuditDate: singleEntry.auditedAt,
      latestAuditDate: singleEntry.auditedAt,
      totalAuditsRan: 1,
      initialScore: singleEntry.growthScore,
      currentScore: singleEntry.growthScore,
      netScoreGain: 0,
      initialMonthlyLoss: singleEntry.monthlyLossBRL,
      currentMonthlyLoss: singleEntry.monthlyLossBRL,
      totalMonthlyWastePrevented: 0,
      audits: [singleEntry]
    };
  }

  const sortedDesc = [...rawEntries].sort((a, b) => new Date(b.auditedAt).getTime() - new Date(a.auditedAt).getTime());

  const entriesWithDeltas: AuditHistoryEntry[] = sortedDesc.map((entry, idx) => {
    const prev = sortedDesc[idx + 1];
    return {
      ...entry,
      scoreDelta: prev ? entry.growthScore - prev.growthScore : 0,
      lossDeltaBRL: prev ? prev.monthlyLossBRL - entry.monthlyLossBRL : 0,
      isCurrent: idx === 0
    };
  });

  const latest = entriesWithDeltas[0];
  const oldest = entriesWithDeltas[entriesWithDeltas.length - 1];

  const netScoreGain = latest.growthScore - oldest.growthScore;
  const wastePrevented = Math.max(0, oldest.monthlyLossBRL - latest.monthlyLossBRL);

  return {
    domain: cleanDomain,
    brandName: latest.brandName,
    firstAuditDate: oldest.auditedAt,
    latestAuditDate: latest.auditedAt,
    totalAuditsRan: entriesWithDeltas.length,
    initialScore: oldest.growthScore,
    currentScore: latest.growthScore,
    netScoreGain,
    initialMonthlyLoss: oldest.monthlyLossBRL,
    currentMonthlyLoss: latest.monthlyLossBRL,
    totalMonthlyWastePrevented: wastePrevented,
    audits: entriesWithDeltas
  };
}

function getLocalStoreHistory(domain: string): AuditHistoryEntry[] {
  try {
    const saved = safeGetStorage(`${LOCAL_STORAGE_HISTORY_PREFIX}${normalizeStoreDomain(domain)}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore parse error
  }
  return [];
}
