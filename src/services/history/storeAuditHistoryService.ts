// ==============================================================================
// 🗄️ ADSHIELD STORE AUDIT HISTORY & EVOLUTION SERVICE
// Manages continuous storage of audits in Supabase PostgreSQL (audit_reports)
// with resilient localStorage offline fallback to power score growth timelines!
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AgentDiagnosticResult } from '../../types';

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

/**
 * 💾 Saves an audit to Supabase PostgreSQL (audit_reports) and syncs local cache
 */
export async function saveAuditToDatabase(result: AgentDiagnosticResult): Promise<string | null> {
  const domain = result.realSiteData.domain.toLowerCase().trim();
  const brokenCount = (result.realSiteData.catalogAudit?.issues || [])
    .filter(i => !i.isFullPrintExempt && i.missingSizes.length > 0).length;
  
  const monthlyLoss = result.realSiteData.catalogAudit?.catalogHealthScore === 100 || brokenCount === 0
    ? 0
    : brokenCount * (result.input.averageOrderValue || 180) * 8; // monthly ad waste model

  const auditRecord = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    domain: domain,
    brand_name: result.realSiteData.brandName || domain,
    growth_score: result.growthScore,
    estimated_revenue_lift_min: result.estimatedRevenueLiftMin || 0,
    estimated_revenue_lift_max: result.estimatedRevenueLiftMax || 0,
    raw_payload: result,
    is_public: true,
    created_at: new Date().toISOString()
  };

  // 1. Persist to LocalStorage for instant zero-latency retrieval
  try {
    const existingLocal = getLocalStoreHistory(domain);
    const updatedHistory: AuditHistoryEntry[] = [
      {
        id: auditRecord.id,
        domain: domain,
        brandName: auditRecord.brand_name,
        growthScore: auditRecord.growth_score,
        brokenSkusCount: brokenCount,
        monthlyLossBRL: monthlyLoss,
        auditedAt: auditRecord.created_at
      },
      ...existingLocal.filter(e => {
        // deduplicate audits run in the same minute
        const entryTime = new Date(e.auditedAt).getTime();
        const curTime = new Date(auditRecord.created_at).getTime();
        return Math.abs(curTime - entryTime) > 60000;
      })
    ].slice(0, 15); // keep last 15 audits

    localStorage.setItem(
      `${LOCAL_STORAGE_HISTORY_PREFIX}${domain}`,
      JSON.stringify(updatedHistory)
    );
  } catch (err) {
    console.warn('[storeAuditHistoryService] LocalStorage write error:', err);
  }

  // 2. Persist to Supabase if configured
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('audit_reports')
        .insert([{
          domain: auditRecord.domain,
          brand_name: auditRecord.brand_name,
          growth_score: auditRecord.growth_score,
          estimated_revenue_lift_min: auditRecord.estimated_revenue_lift_min,
          estimated_revenue_lift_max: auditRecord.estimated_revenue_lift_max,
          raw_payload: auditRecord.raw_payload,
          is_public: auditRecord.is_public
        }])
        .select('id')
        .single();

      if (!error && data?.id) {
        return data.id;
      }
    } catch (dbErr) {
      console.warn('[storeAuditHistoryService] Supabase insert fallback to local:', dbErr);
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
  const cleanDomain = domain.toLowerCase().trim();
  let rawEntries: AuditHistoryEntry[] = [];

  // 1. Try fetching from Supabase
  if (isSupabaseConfigured) {
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
          const broken = (payload?.realSiteData?.catalogAudit?.issues || [])
            .filter(i => !i.isFullPrintExempt && i.missingSizes.length > 0).length;
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
    } catch (err) {
      console.warn('[storeAuditHistoryService] Supabase query fallback to local:', err);
    }
  }

  // 2. Fallback to LocalStorage if empty or offline
  if (rawEntries.length === 0) {
    rawEntries = getLocalStoreHistory(cleanDomain);
  }

  // If no history exists yet, simulate baseline from current or return null
  if (rawEntries.length === 0) {
    if (!currentDiagnostic) return null;

    const currentBroken = (currentDiagnostic.realSiteData.catalogAudit?.issues || [])
      .filter(i => !i.isFullPrintExempt && i.missingSizes.length > 0).length;
    const currentLoss = currentBroken === 0 ? 0 : currentBroken * (currentDiagnostic.input.averageOrderValue || 180) * 8;

    // Create an initial entry for today
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

  // Calculate score deltas across entries
  // rawEntries is in descending order (latest first)
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

/**
 * 📦 LocalStorage Helper
 */
function getLocalStoreHistory(domain: string): AuditHistoryEntry[] {
  try {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_HISTORY_PREFIX}${domain.toLowerCase().trim()}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore parse error
  }
  return [];
}
