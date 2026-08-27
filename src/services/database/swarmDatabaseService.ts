import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AgentDiagnosticResult } from '../../types';
import { MonitoredStore, StoreSnapshotDelta, SwarmJobResult } from '../swarm/autonomousSwarmEngine';
import { WhatsAppAlertPayload } from '../workers/whatsappAlertWorker';

const LOCAL_SNAPSHOTS_KEY = 'adshield_local_store_snapshots';
const LOCAL_MONITORED_STORES_KEY = 'adshield_local_monitored_stores';
const LOCAL_JOB_LOGS_KEY = 'adshield_local_swarm_job_logs';

/**
 * 1. Busca todas as lojas ativas para o Enxame auditar
 */
export async function getMonitoredStores(): Promise<MonitoredStore[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('swarm_monitored_stores')
        .select('*')
        .eq('is_active', true);

      if (!error && data && data.length > 0) {
        return data.map(item => ({
          id: item.id,
          storeUrl: item.store_url,
          brandName: item.brand_name,
          niche: item.niche,
          targetPhone: item.target_phone,
          isActive: item.is_active,
          checkIntervalHours: item.check_interval_hours,
          lastAuditedAt: item.last_audited_at,
          currentScore: item.current_score,
          currentEstimatedLoss: item.current_estimated_loss
        }));
      }
    } catch {
      // Fallback to local storage below
    }
  }

  // Fallback Local Storage
  const local = localStorage.getItem(LOCAL_MONITORED_STORES_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // fallback
    }
  }

  const defaultStores: MonitoredStore[] = [
    {
      id: 'store-brk-agro',
      storeUrl: 'https://www.brkagro.com.br',
      brandName: 'BRK Agro',
      niche: 'Agropecuária & Moda Campo',
      targetPhone: '5511999999999',
      isActive: true,
      checkIntervalHours: 24,
      currentScore: 78,
      currentEstimatedLoss: 840
    },
    {
      id: 'store-brk-fishing',
      storeUrl: 'https://www.brkfishing.com.br',
      brandName: 'BRK Fishing',
      niche: 'Moda Pesca & Outdoor',
      targetPhone: '5511888888888',
      isActive: true,
      checkIntervalHours: 24,
      currentScore: 84,
      currentEstimatedLoss: 520
    }
  ];

  localStorage.setItem(LOCAL_MONITORED_STORES_KEY, JSON.stringify(defaultStores));
  return defaultStores;
}

/**
 * 2. Salva o Snapshot da Auditoria no PostgreSQL (Com comparador de evolução)
 */
export async function saveStoreSnapshot(
  storeId: string,
  diagnostic: AgentDiagnosticResult,
  delta?: StoreSnapshotDelta
): Promise<boolean> {
  const catalogIssues = diagnostic.realSiteData.catalogAudit?.issues || [];
  const brokenCount = catalogIssues.filter(i => !i.isFullPrintExempt && i.missingSizes.length > 0).length;

  const snapshotRecord = {
    store_id: storeId,
    score: diagnostic.growthScore,
    lift_min: diagnostic.estimatedRevenueLiftMin,
    lift_max: diagnostic.estimatedRevenueLiftMax,
    broken_skus_count: brokenCount,
    total_skus_count: diagnostic.realSiteData.catalogAudit?.totalProductsScanned || 24,
    estimated_monthly_loss: diagnostic.estimatedRevenueLiftMin * 45,
    contrast_ratio: diagnostic.visionAnalysis.contrastAudit.contrastRatio,
    wcag_passed: diagnostic.visionAnalysis.contrastAudit.wcagAaPassed,
    raw_diagnostic_json: diagnostic,
    audited_at: new Date().toISOString()
  };

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('store_daily_snapshots').insert([snapshotRecord]);
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  // Local Storage Fallback
  const existing = localStorage.getItem(LOCAL_SNAPSHOTS_KEY);
  const snapshots = existing ? JSON.parse(existing) : [];
  snapshots.unshift({ id: `snap-${Date.now()}`, ...snapshotRecord, delta });
  localStorage.setItem(LOCAL_SNAPSHOTS_KEY, JSON.stringify(snapshots.slice(0, 50)));
  return true;
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

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from('swarm_job_logs').insert([logEntry]);
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  const existing = localStorage.getItem(LOCAL_JOB_LOGS_KEY);
  const logs = existing ? JSON.parse(existing) : [];
  logs.unshift({ id: `log-${Date.now()}`, ...logEntry });
  localStorage.setItem(LOCAL_JOB_LOGS_KEY, JSON.stringify(logs.slice(0, 50)));
  return true;
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
