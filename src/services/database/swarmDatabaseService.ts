import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AgentDiagnosticResult } from '../../types';
import { MonitoredStore, StoreSnapshotDelta, SwarmJobResult } from '../swarm/autonomousSwarmEngine';
import { WhatsAppAlertPayload } from '../workers/whatsappAlertWorker';
import { isCatalogProductBroken } from '../siteInspector';

const LOCAL_SNAPSHOTS_KEY = 'adshield_local_store_snapshots';
const LOCAL_MONITORED_STORES_KEY = 'adshield_local_monitored_stores';
const LOCAL_JOB_LOGS_KEY = 'adshield_local_swarm_job_logs';

const memorySwarmStore = new Map<string, string>();

function safeGetLocal(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      return localStorage.getItem(key);
    }
  } catch {}
  return memorySwarmStore.get(key) ?? null;
}

function safeSetLocal(key: string, value: string): void {
  memorySwarmStore.set(key, value);
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(key, value);
    }
  } catch {}
}

export interface LocalStoreSnapshotRecord {
  id: string;
  store_id: string;
  score: number;
  lift_min: number;
  lift_max: number;
  broken_skus_count: number;
  total_skus_count: number;
  estimated_monthly_loss: number;
  contrast_ratio: number;
  wcag_passed: boolean;
  audited_at: string;
  delta?: StoreSnapshotDelta;
  top_broken_skus_summary?: Array<{
    sku: string;
    title: string;
    missingSizes: string[];
    url?: string;
  }>;
}

export interface LocalSwarmJobLogRecord {
  id: string;
  store_id: string;
  job_status: string;
  execution_time_ms: number;
  agents_executed: string[];
  grounding_score: number;
  false_positives_prevented: number;
  created_at: string;
}

/**
 * 1. Busca todas as lojas ativas para o Enxame auditar (Merge Supabase + LocalStorage + Default Multi-Vertical Portfolio)
 */
export async function getMonitoredStores(): Promise<MonitoredStore[]> {
  // Portfólio Multi-Vertical D2C brasileiro para seed de primeira inicialização (Zero vínculo exclusivo com uma única marca)
  const seedStores: MonitoredStore[] = [
    {
      id: 'store-minimal-club',
      storeUrl: 'https://www.minimalclub.com.br',
      brandName: 'Minimal Club',
      niche: 'Moda Masculina & Básicos Tech',
      targetPhone: '5511999999999',
      isActive: true,
      checkIntervalHours: 24,
      currentScore: 82,
      currentEstimatedLoss: 1450
    },
    {
      id: 'store-sallve',
      storeUrl: 'https://www.sallve.com.br',
      brandName: 'Sallve',
      niche: 'Cosméticos & Dermocosméticos',
      targetPhone: '5511999999999',
      isActive: true,
      checkIntervalHours: 24,
      currentScore: 88,
      currentEstimatedLoss: 620
    },
    {
      id: 'store-insider-store',
      storeUrl: 'https://www.insiderstore.com.br',
      brandName: 'Insider Store',
      niche: 'Vestuário Tecnológico & Performance',
      targetPhone: '5511999999999',
      isActive: true,
      checkIntervalHours: 24,
      currentScore: 86,
      currentEstimatedLoss: 980
    },
    {
      id: 'store-brk-agro',
      storeUrl: 'https://www.brkagro.com.br',
      brandName: 'BRK Agro',
      niche: 'Agropecuária & Moda Campo',
      targetPhone: '5511999999999',
      isActive: true,
      checkIntervalHours: 24,
      currentScore: 78,
      currentEstimatedLoss: 1840
    }
  ];

  let supabaseStores: MonitoredStore[] = [];

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('swarm_monitored_stores')
        .select('*')
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        supabaseStores = data.map(item => ({
          id: item.id || `store-${item.brand_name.toLowerCase().replace(/\s+/g, '-')}`,
          storeUrl: item.store_url,
          brandName: item.brand_name,
          niche: item.niche,
          targetPhone: item.target_phone,
          isActive: item.is_active,
          checkIntervalHours: item.check_interval_hours || 24,
          lastAuditedAt: item.last_audited_at,
          currentScore: item.current_score || 80,
          currentEstimatedLoss: item.current_estimated_loss || 0
        }));
      }
    } catch {
      // Fallback
    }
  }

  // Local Storage Stores (Respeita exclusões manuais feitas pelo usuário, mas migra seed legado exclusivo BRK)
  let localStores: MonitoredStore[] = [];
  const local = safeGetLocal(LOCAL_MONITORED_STORES_KEY);
  if (local !== null) {
    try {
      const parsed: MonitoredStore[] = JSON.parse(local);
      const isLegacyBrkOnlySeed =
        Array.isArray(parsed) &&
        parsed.length > 0 &&
        parsed.every(s => s.storeUrl.toLowerCase().includes('brk'));
      localStores = isLegacyBrkOnlySeed ? [...seedStores, ...parsed] : parsed;
    } catch {
      localStores = seedStores;
    }
  } else {
    localStores = seedStores;
  }

  // Merge map by normalized URL (Prioriza Supabase + Lojas do Usuário)
  const map = new Map<string, MonitoredStore>();
  localStores.forEach(s => map.set(s.storeUrl.toLowerCase().replace(/\/$/, ''), s));
  supabaseStores.forEach(s => map.set(s.storeUrl.toLowerCase().replace(/\/$/, ''), s));

  const allMerged = Array.from(map.values());
  safeSetLocal(LOCAL_MONITORED_STORES_KEY, JSON.stringify(allMerged));
  return allMerged;
}

/**
 * Remove uma loja do monitoramento
 */
export async function deleteMonitoredStore(storeId: string, storeUrl: string): Promise<boolean> {
  const local = safeGetLocal(LOCAL_MONITORED_STORES_KEY);
  if (local) {
    try {
      const stores: MonitoredStore[] = JSON.parse(local);
      const filtered = stores.filter(s => s.id !== storeId && s.storeUrl.toLowerCase().replace(/\/$/, '') !== storeUrl.toLowerCase().replace(/\/$/, ''));
      safeSetLocal(LOCAL_MONITORED_STORES_KEY, JSON.stringify(filtered));
    } catch {}
  }

  if (isSupabaseConfigured) {
    try {
      await supabase.from('swarm_monitored_stores').delete().match({ store_url: storeUrl });
    } catch {}
  }

  return true;
}

/**
 * 2. Salva o Snapshot da Auditoria no PostgreSQL ou LocalStorage (Com comparador de evolução e proteção de quota)
 */
export async function saveStoreSnapshot(
  storeId: string,
  diagnostic: AgentDiagnosticResult,
  delta?: StoreSnapshotDelta
): Promise<boolean> {
  const catalogIssues = diagnostic.realSiteData.catalogAudit?.issues || [];
  const brokenSkus = catalogIssues.filter(isCatalogProductBroken);
  const brokenCount = brokenSkus.length;

  const estimatedMonthlyLoss = Math.round(
    diagnostic.realSiteData.catalogAudit?.monthlyLossEstimateBRL ??
    (diagnostic.estimatedRevenueLiftMin * 45)
  );

  const topBrokenSummary = brokenSkus.slice(0, 5).map(issue => ({
    sku: issue.sku,
    title: issue.productTitle,
    missingSizes: issue.missingSizes,
    url: issue.productUrl
  }));

  const snapshotRecord = {
    store_id: storeId,
    score: diagnostic.growthScore,
    lift_min: diagnostic.estimatedRevenueLiftMin,
    lift_max: diagnostic.estimatedRevenueLiftMax,
    broken_skus_count: brokenCount,
    total_skus_count: diagnostic.realSiteData.catalogAudit?.totalProductsScanned || 24,
    estimated_monthly_loss: estimatedMonthlyLoss,
    contrast_ratio: diagnostic.visionAnalysis.contrastAudit.contrastRatio,
    wcag_passed: diagnostic.visionAnalysis.contrastAudit.wcagAaPassed,
    audited_at: new Date().toISOString()
  };

  // 1. SEMPRE salva primeiro no Cofre Local (Local-First) sem raw_diagnostic_json gigante para evitar QuotaExceededError
  try {
    const existing = safeGetLocal(LOCAL_SNAPSHOTS_KEY);
    const snapshots: LocalStoreSnapshotRecord[] = existing ? JSON.parse(existing) : [];
    snapshots.unshift({
      id: `snap-${Date.now()}`,
      ...snapshotRecord,
      delta,
      top_broken_skus_summary: topBrokenSummary
    });
    safeSetLocal(LOCAL_SNAPSHOTS_KEY, JSON.stringify(snapshots.slice(0, 50)));
  } catch {
    try {
      const compactList: LocalStoreSnapshotRecord[] = [
        {
          id: `snap-${Date.now()}`,
          ...snapshotRecord,
          delta,
          top_broken_skus_summary: topBrokenSummary
        }
      ];
      safeSetLocal(LOCAL_SNAPSHOTS_KEY, JSON.stringify(compactList));
    } catch {
      // Safe to ignore
    }
  }

  // 2. Sincronização opcional em segundo plano com Supabase (se configurado)
  if (isSupabaseConfigured) {
    try {
      await supabase.from('store_daily_snapshots').insert([
        { ...snapshotRecord, raw_diagnostic_json: diagnostic }
      ]);
    } catch {
      // Non-fatal in Local-First mode
    }
  }

  return true;
}

/**
 * 2.1. Recupera o histórico local de Snapshots (Antes vs. Depois)
 */
export function getLocalStoreSnapshots(storeId?: string): LocalStoreSnapshotRecord[] {
  try {
    const existing = safeGetLocal(LOCAL_SNAPSHOTS_KEY);
    if (!existing) return [];
    const parsed: LocalStoreSnapshotRecord[] = JSON.parse(existing);
    if (!Array.isArray(parsed)) return [];
    if (storeId) {
      return parsed.filter(s => s.store_id === storeId);
    }
    return parsed;
  } catch {
    return [];
  }
}

/**
 * 3. Grava o Log de Telemetria e Grounding do Enxame
 */
export async function recordSwarmJobLog(jobResult: SwarmJobResult): Promise<boolean> {
  const logEntry = {
    store_id: jobResult.storeId,
    job_status: jobResult.status,
    execution_time_ms: jobResult.executionTimeMs,
    agents_executed: ['CatalogDoctor', 'CoreWebVitals', 'PixElasticity', 'VisionEngineer', 'SecurityAuditor', 'TruthAuditor'],
    grounding_score: jobResult.groundingScore,
    false_positives_prevented: jobResult.falsePositivesPrevented,
    created_at: new Date().toISOString()
  };

  // 1. SEMPRE grava primeiro no Cofre Local (Local-First)
  try {
    const existing = safeGetLocal(LOCAL_JOB_LOGS_KEY);
    const logs: LocalSwarmJobLogRecord[] = existing ? JSON.parse(existing) : [];
    logs.unshift({ id: `log-${Date.now()}`, ...logEntry });
    safeSetLocal(LOCAL_JOB_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch {
    // Safe fallback
  }

  // 2. Sincronização opcional com Supabase
  if (isSupabaseConfigured) {
    try {
      await supabase.from('swarm_job_logs').insert([logEntry]);
    } catch {
      // Non-fatal in Local-First mode
    }
  }

  return true;
}

/**
 * 3.1. Recupera os logs locais de execução do Enxame
 */
export function getLocalSwarmJobLogs(): LocalSwarmJobLogRecord[] {
  try {
    const existing = safeGetLocal(LOCAL_JOB_LOGS_KEY);
    if (!existing) return [];
    const parsed: LocalSwarmJobLogRecord[] = JSON.parse(existing);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * 4. Enfileira Alerta Executivo WhatsApp no Banco
 */
export async function enqueueWhatsAppAlert(payload: WhatsAppAlertPayload): Promise<boolean> {
  const alertRecord = {
    store_id: payload.metadata.storeId,
    phone_number: payload.to,
    message_body: payload.message,
    alert_type: 'DAILY_EXECUTIVE_SUMMARY',
    priority: payload.priority,
    status: 'PENDING',
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('alert_dispatch_queue').insert([alertRecord]);
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  return true;
}
