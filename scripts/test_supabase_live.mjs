// Live Verification Script for Supabase PostgreSQL
import { createClient } from '@supabase/supabase-js';
import './utils/envLoader.mjs';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://sstirifglteqmhvpsjbz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  throw new Error('AdShield Security Guard: SUPABASE_SERVICE_ROLE_KEY is required in environment variables or .env file.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testSupabaseLive() {
  console.log('🔍 [AdShield Live Verification] Testando tabelas criadas no Supabase...');

  const { data: stores, error: errStores } = await supabase.from('swarm_monitored_stores').select('*');
  console.log('📦 Lojas cadastradas no swarm_monitored_stores:', stores?.length || 0);

  const { data: snapshots, error: errSnapshots } = await supabase.from('store_daily_snapshots').select('*');
  console.log('📸 Snapshots históricos no store_daily_snapshots:', snapshots?.length || 0);

  if (!errStores && !errSnapshots) {
    console.log('🎉 BANCO DE DADOS 100% ATIVO E INTEGRADO COM O SUPABASE!');
  } else {
    console.error('⚠️ Erro:', errStores || errSnapshots);
  }
}

testSupabaseLive();
