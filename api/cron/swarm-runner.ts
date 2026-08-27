// Vercel Serverless / Edge Function: /api/cron/swarm-runner
// Triggered automatically via Vercel Cron at 07:00 UTC-3 (10:00 UTC)

import { executeAutonomousStoreAudit, MonitoredStore } from '../../src/services/swarm/autonomousSwarmEngine';
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // 1. Verificação de Segurança via CRON_SECRET Bearer header
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET || 'adshield_cron_super_secret_2026';

  if (authHeader !== `Bearer ${cronSecret}` && process.env.NODE_ENV === 'production') {
    return new Response(JSON.stringify({ error: 'Unauthorized: Invalid CRON_SECRET token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const startTime = Date.now();
  const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://sstirifglteqmhvpsjbz.supabase.co';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_iziVMX78wmE0Duxc59_sXQ_sbjmmQ6i';

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  // 2. Busca dinâmica de lojas ativas cadastradas no Supabase
  let storesToAudit: MonitoredStore[] = [];

  try {
    const { data: dbStores, error: dbError } = await supabase
      .from('swarm_monitored_stores')
      .select('*')
      .eq('is_active', true);

    if (!dbError && dbStores && dbStores.length > 0) {
      storesToAudit = dbStores.map(item => ({
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
    // fallback
  }

  // Fallback se o banco ainda estiver vazio
  if (storesToAudit.length === 0) {
    storesToAudit = [
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
  }

  // 3. Execução Concorrente e Persistência no Supabase
  const executionResults = [];

  for (const store of storesToAudit) {
    try {
      const jobResult = await executeAutonomousStoreAudit(store);

      // Salva snapshot no Supabase
      if (jobResult.diagnostic) {
        await supabase.from('store_daily_snapshots').insert([
          {
            store_id: store.id.startsWith('store-') ? null : store.id,
            score: jobResult.diagnostic.growthScore,
            lift_min: jobResult.diagnostic.estimatedRevenueLiftMin,
            lift_max: jobResult.diagnostic.estimatedRevenueLiftMax,
            broken_skus_count: jobResult.diagnostic.realSiteData.catalogAudit?.issues.length || 0,
            total_skus_count: jobResult.diagnostic.realSiteData.catalogAudit?.totalProductsScanned || 24,
            estimated_monthly_loss: jobResult.diagnostic.estimatedRevenueLiftMin * 45,
            contrast_ratio: jobResult.diagnostic.visionAnalysis.contrastAudit.contrastRatio,
            wcag_passed: jobResult.diagnostic.visionAnalysis.contrastAudit.wcagAaPassed,
            raw_diagnostic_json: jobResult.diagnostic,
            audited_at: new Date().toISOString()
          }
        ]);

        // Grava Log do Enxame
        await supabase.from('swarm_job_logs').insert([
          {
            store_id: store.id.startsWith('store-') ? null : store.id,
            job_status: jobResult.status,
            execution_time_ms: jobResult.executionTimeMs,
            agents_executed: ['CatalogDoctor', 'CoreWebVitals', 'PixElasticity', 'VisionEngineer', 'SecurityAuditor', 'TruthAuditor'],
            grounding_score: jobResult.groundingScore,
            false_positives_prevented: jobResult.falsePositivesPrevented,
            created_at: new Date().toISOString()
          }
        ]);

        // Enfileira Alerta WhatsApp se houver ruptura crítica
        if (jobResult.alertGenerated && store.targetPhone) {
          await supabase.from('alert_dispatch_queue').insert([
            {
              store_id: store.id.startsWith('store-') ? null : store.id,
              phone_number: store.targetPhone,
              message_body: jobResult.alertGenerated,
              alert_type: 'DAILY_EXECUTIVE_SUMMARY',
              priority: 'HIGH',
              status: 'PENDING',
              created_at: new Date().toISOString()
            }
          ]);
        }
      }

      executionResults.push({
        storeId: jobResult.storeId,
        brandName: jobResult.brandName,
        status: jobResult.status,
        score: jobResult.diagnostic?.growthScore,
        executionTimeMs: jobResult.executionTimeMs,
        groundingScore: jobResult.groundingScore,
        falsePositivesPrevented: jobResult.falsePositivesPrevented,
        alertEnqueued: Boolean(jobResult.alertGenerated)
      });
    } catch (err: any) {
      executionResults.push({
        storeId: store.id,
        brandName: store.brandName,
        status: 'FAILED',
        error: err?.message || 'Execution error',
        executionTimeMs: 0
      });
    }
  }

  const totalTime = Date.now() - startTime;

  return new Response(
    JSON.stringify({
      success: true,
      engine: 'AdShield Autonomous Swarm 24/7 (Vercel Serverless Edge)',
      totalStoresAudited: storesToAudit.length,
      totalExecutionTimeMs: totalTime,
      auditedAt: new Date().toISOString(),
      results: executionResults
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
