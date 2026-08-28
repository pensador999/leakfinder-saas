// ==============================================================================
// 🌅 ADSHIELD MORNING TELEMETRY AUDITOR (07:00 AM EXECUTION CHECK)
// Inspects Supabase logs, snapshots and queues for today's run
// ==============================================================================

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sstirifglteqmhvpsjbz.supabase.co';
const SUPABASE_KEY = 'sb_secret_iziVMX78wmE0Duxc59_sXQ_sbjmmQ6i';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkMorningRun() {
  console.log('================================================================');
  console.log('🌅 [TELEMETRIA DAS 07:00 AM] Verificando Atividade dos Agentes');
  console.log('================================================================\n');

  try {
    // 1. Total Snapshots & Latest Snapshot
    const { data: latestSnapshots, error: errSnap } = await supabase
      .from('store_daily_snapshots')
      .select('id, store_id, score, broken_skus_count, audited_at')
      .order('audited_at', { ascending: false })
      .limit(10);

    const { count: totalSnapshots } = await supabase
      .from('store_daily_snapshots')
      .select('*', { count: 'exact', head: true });

    // 2. Active Monitored Stores
    const { data: stores, error: errStores } = await supabase
      .from('swarm_monitored_stores')
      .select('id, brand_name, store_url, is_active, last_audited_at, current_score');

    // 3. Dispatch Queue Items
    const { data: queueItems, error: errQueue } = await supabase
      .from('alert_dispatch_queue')
      .select('id, phone_number, alert_type, status, created_at, sent_at')
      .order('created_at', { ascending: false })
      .limit(10);

    // 4. Job Logs
    const { data: jobLogs, error: errLogs } = await supabase
      .from('swarm_job_logs')
      .select('id, store_id, job_status, execution_time_ms, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    console.log(`📊 [Snapshots Gravados no Banco]: ${totalSnapshots} registros no total.`);
    if (latestSnapshots && latestSnapshots.length > 0) {
      console.log(`🕒 Último Snapshot Registrado em: ${latestSnapshots[0].audited_at} (Score: ${latestSnapshots[0].score}, SKUs furados: ${latestSnapshots[0].broken_skus_count})`);
    }

    console.log(`\n🏪 [Lojas Monitoradas Ativas]: ${stores?.length || 0}`);
    stores?.forEach(s => {
      console.log(` - ${s.brand_name} (${s.store_url}) | Ativa: ${s.is_active} | Score: ${s.current_score} | Última Auditoria: ${s.last_audited_at}`);
    });

    console.log(`\n📲 [Fila de Alertas WhatsApp]: ${queueItems?.length || 0} mensagens recentes`);
    queueItems?.forEach(q => {
      console.log(` - Destino: ${q.phone_number} | Tipo: ${q.alert_type} | Status: ${q.status} | Criado: ${q.created_at} | Enviado: ${q.sent_at || 'Pendente'}`);
    });

    console.log(`\n📜 [Logs de Jobs do Enxame]: ${jobLogs?.length || 0} logs recentes`);
    jobLogs?.forEach(l => {
      console.log(` - Status: ${l.job_status} | Latência: ${l.execution_time_ms}ms | Data: ${l.created_at}`);
    });

  } catch (err) {
    console.error('Erro ao verificar telemetria:', err);
  }
  console.log('\n================================================================');
}

checkMorningRun();
