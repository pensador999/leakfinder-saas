// Live Telemetry Report Generator for Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://sstirifglteqmhvpsjbz.supabase.co';
const SUPABASE_KEY = 'sb_secret_iziVMX78wmE0Duxc59_sXQ_sbjmmQ6i';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function generateLiveReport() {
  console.log('📊 [AdShield Swarm Telemetry] Coletando métricas do Supabase...');

  const { data: stores } = await supabase.from('swarm_monitored_stores').select('*');
  const { data: snapshots } = await supabase.from('store_daily_snapshots').select('*');
  const { data: reports } = await supabase.from('audit_reports').select('*');
  const { data: alerts } = await supabase.from('alert_dispatch_queue').select('*');

  console.log('\n--- RELATÓRIO DO ENXAME EM TEMPO REAL ---');
  console.log(`🏢 Lojas Ativas no Radar: ${stores?.length || 0}`);
  console.log(`📸 Snapshots Históricos Gravados: ${snapshots?.length || 0}`);
  console.log(`📄 Relatórios Salvos: ${reports?.length || 0}`);
  console.log(`📲 Fila de Alertas WhatsApp: ${alerts?.length || 0}`);

  if (snapshots && snapshots.length > 0) {
    const lastSnap = snapshots[snapshots.length - 1];
    console.log(`\n🕒 Último Snapshot Gravado: Score ${lastSnap.score}/100 em ${lastSnap.audited_at}`);
  }
}

generateLiveReport();
