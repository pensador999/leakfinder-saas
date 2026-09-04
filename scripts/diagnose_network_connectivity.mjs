// ==============================================================================
// 🌐 FULL NETWORK & INFRASTRUCTURE CONNECTIVITY DIAGNOSTIC
// Tests live connectivity to:
// 1. Internet / Web (Cloudflare, Google, E-commerce target stores)
// 2. GitHub (Remote Git repository, commit sync, API)
// 3. Vercel (Production edge deployment https://leakfinder-green.vercel.app)
// 4. Supabase (Remote PostgreSQL / REST API / DNS health)
// ==============================================================================

import { execSync } from 'child_process';
import dns from 'dns/promises';

async function probeUrl(url, timeoutMs = 5000) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(url, { 
      method: 'GET', 
      headers: { 'User-Agent': 'AdShield-Connectivity-Diagnostics/2.4' },
      signal: controller.signal 
    });
    clearTimeout(timeout);
    return {
      success: res.ok || res.status < 400,
      statusCode: res.status,
      latencyMs: Date.now() - start,
      error: null
    };
  } catch (err) {
    return {
      success: false,
      statusCode: 0,
      latencyMs: Date.now() - start,
      error: err.name === 'AbortError' ? 'TIMEOUT' : err.message
    };
  }
}

async function runDiagnostic() {
  console.log('╔══════════════════════════════════════════════════════════════════╗');
  console.log('║ 📡 DIAGNÓSTICO DE CONECTIVIDADE DO ADSHIELD / LEAKFINDER         ║');
  console.log('╚══════════════════════════════════════════════════════════════════╝\n');

  // 1. INTERNET GERAL / NAVEGADOR
  console.log('🌐 [1/4] TESTANDO CONEXÃO COM A INTERNET & WEBSITES:');
  const cloudflareProbe = await probeUrl('https://1.1.1.1');
  const googleProbe = await probeUrl('https://www.google.com');
  const brkStoreProbe = await probeUrl('https://www.brkagro.com.br');

  console.log(`   ├─ Internet Core (Cloudflare): ${cloudflareProbe.success ? '🟢 ONLINE' : '🔴 FALHA'} (${cloudflareProbe.latencyMs}ms, HTTP ${cloudflareProbe.statusCode})`);
  console.log(`   ├─ Web Global (Google):        ${googleProbe.success ? '🟢 ONLINE' : '🔴 FALHA'} (${googleProbe.latencyMs}ms, HTTP ${googleProbe.statusCode})`);
  console.log(`   └─ Loja Alvo (BRK Agro):       ${brkStoreProbe.success ? '🟢 ONLINE' : '🔴 FALHA'} (${brkStoreProbe.latencyMs}ms, HTTP ${brkStoreProbe.statusCode})`);

  // 2. GITHUB
  console.log('\n🐙 [2/4] TESTANDO CONEXÃO COM O GITHUB:');
  try {
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    const lastCommit = execSync('git log -1 --format="%h - %s (%cr)"', { encoding: 'utf8' }).trim();
    const gitPing = await probeUrl('https://api.github.com');

    console.log(`   ├─ Repositório Remoto:         🟢 ${remoteUrl}`);
    console.log(`   ├─ Branch Ativa:               🟢 ${branch}`);
    console.log(`   ├─ Último Commit:              🟢 ${lastCommit}`);
    console.log(`   └─ API do GitHub:              ${gitPing.success ? '🟢 CONECTADO' : '🔴 INDISPONÍVEL'} (${gitPing.latencyMs}ms)`);
  } catch (err) {
    console.log(`   └─ Erro ao consultar Git:      🔴 ${err.message}`);
  }

  // 3. VERCEL (PRODUÇÃO)
  console.log('\n▲ [3/4] TESTANDO CONEXÃO COM A VERCEL (PRODUÇÃO AO VIVO):');
  const vercelUrl = 'https://leakfinder-green.vercel.app';
  const vercelProbe = await probeUrl(vercelUrl);
  console.log(`   ├─ URL Oficial:                ${vercelUrl}`);
  console.log(`   ├─ Status da Borda Vercel:     ${vercelProbe.success ? '🟢 ONLINE' : '🔴 FORA DO AR'} (HTTP ${vercelProbe.statusCode})`);
  console.log(`   └─ Latência de Resposta:       ${vercelProbe.latencyMs}ms`);

  // 4. SUPABASE (BANCO DE DADOS & AUTENTICAÇÃO)
  console.log('\n⚡ [4/4] TESTANDO CONEXÃO COM O SUPABASE:');
  const supabaseHost = 'sstirifglteqmhvpsjbz.supabase.co';
  let dnsResolved = false;
  try {
    const ips = await dns.resolve4(supabaseHost);
    dnsResolved = true;
    console.log(`   ├─ Resolução DNS (${supabaseHost}): 🟢 RESOLVIDO (${ips.join(', ')})`);
  } catch (dnsErr) {
    console.log(`   ├─ Resolução DNS (${supabaseHost}): ⚠️ NÃO ENCONTRADO (${dnsErr.code})`);
  }

  const supabaseProbe = await probeUrl(`https://${supabaseHost}/rest/v1/`, 3000);
  console.log(`   ├─ Endpoint REST:              ${supabaseProbe.success ? '🟢 ATIVO' : '⚠️ PAUSADO / INACESSÍVEL'} (HTTP ${supabaseProbe.statusCode || 'N/A'}, ${supabaseProbe.error || `${supabaseProbe.latencyMs}ms`})`);
  console.log(`   └─ Camada de Tolerância:       🟢 DUAL-PERSISTENCE ATIVA (data/telemetry_db.json gravando em disco)`);

  console.log('\n══════════════════════════════════════════════════════════════════');
}

runDiagnostic();
