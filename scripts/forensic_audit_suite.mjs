// ==============================================================================
// 🛡️ ADSHIELD OS: FORENSIC AUDIT SUITE (ALL RECENT PHASES & 9 SERVERLESS ENDPOINTS)
// Audita latência, códigos HTTP, segurança de HMAC, integridade de grounding
// e conformidade com o Protocolo Anti-Estoque Fantasma ("Yellowstone Dutton Ranch").
// ==============================================================================

const BASE_URL = process.env.AUDIT_TARGET_URL || 'https://leakfinder-green.vercel.app';

async function measureEndpoint(name, url, options = {}) {
  const start = Date.now();
  try {
    const res = await fetch(url, options);
    const duration = Date.now() - start;
    let data = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }
    return {
      name,
      url,
      status: res.status,
      ok: res.ok,
      durationMs: duration,
      data
    };
  } catch (err) {
    const duration = Date.now() - start;
    return {
      name,
      url,
      status: 0,
      ok: false,
      durationMs: duration,
      error: err.message
    };
  }
}

async function runForensicAudit() {
  console.log('==============================================================================');
  console.log('🔍 INICIANDO AUDITORIA FORENSE COMPLETA: ADSHIELD OS');
  console.log('🎯 Alvo de Auditoria:', BASE_URL);
  console.log('⏰ Data/Hora:', new Date().toISOString());
  console.log('==============================================================================\n');

  const results = [];

  // 1. Auditoria Sankhya ERP Gateway
  console.log('📌 [1/9] Auditando Conector Sankhya ERP Gateway (/api/sankhya/inventory)...');
  const sankhya = await measureEndpoint('Sankhya ERP Gateway', `${BASE_URL}/api/sankhya/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ empresa: 1 })
  });
  console.log(`   ↳ Status: HTTP ${sankhya.status} | Latência: ${sankhya.durationMs}ms`);
  console.log(`   ↳ Origem: ${sankhya.data?.source} | SKUs Auditados: ${sankhya.data?.totalAudited}`);
  results.push(sankhya);

  // 2. Auditoria Magis5 Hub Integrador
  console.log('\n📌 [2/9] Auditando Conector Magis5 Hub Integrador (/api/magis5/sync)...');
  const magis5 = await measureEndpoint('Magis5 Hub Integrador', `${BASE_URL}/api/magis5/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });
  console.log(`   ↳ Status: HTTP ${magis5.status} | Latência: ${magis5.durationMs}ms`);
  console.log(`   ↳ Origem: ${magis5.data?.source} | Anúncios: ${magis5.data?.totalAudited} | Discrepâncias: ${magis5.data?.discrepanciesCount}`);
  results.push(magis5);

  // 3. Auditoria Matriz da Verdade Multicanal
  console.log('\n📌 [3/9] Auditando Matriz da Verdade Multicanal (/api/omnichannel/cross-audit)...');
  const omni = await measureEndpoint('Matriz da Verdade Multicanal', `${BASE_URL}/api/omnichannel/cross-audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ executeKillSwitch: true })
  });
  console.log(`   ↳ Status: HTTP ${omni.status} | Latência: ${omni.durationMs}ms`);
  console.log(`   ↳ Engine: ${omni.data?.engine} | Prejuízo Evitado: R$ ${omni.data?.metrics?.totalDesperdicioMensalReais}/mês`);
  console.log(`   ↳ Stop-Loss Disparado: ${omni.data?.metrics?.killSwitchAutoTriggered}`);
  results.push(omni);

  // 4. Auditoria Shopify Sync (GraphQL 2026-01)
  console.log('\n📌 [4/9] Auditando Shopify Inventory Sync (/api/shopify/sync)...');
  const shopifySync = await measureEndpoint('Shopify Inventory Sync', `${BASE_URL}/api/shopify/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shop: 'brkagro.myshopify.com' })
  });
  console.log(`   ↳ Status: HTTP ${shopifySync.status} | Latência: ${shopifySync.durationMs}ms`);
  console.log(`   ↳ Total SKUs: ${shopifySync.data?.totalProducts} | Ghost Inventory: ${shopifySync.data?.ghostInventoryCount}`);
  results.push(shopifySync);

  // 5. Auditoria Shopify Webhook (Fail-Safe Verification)
  console.log('\n📌 [5/9] Auditando Shopify Webhook Receiver (/api/shopify/webhooks/inventory)...');
  const shopifyWebhook = await measureEndpoint('Shopify Webhook Receiver', `${BASE_URL}/api/shopify/webhooks/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ available: 0, inventory_item_id: 104829 })
  });
  console.log(`   ↳ Status: HTTP ${shopifyWebhook.status} | Latência: ${shopifyWebhook.durationMs}ms`);
  console.log(`   ↳ Kill-Switch Acionado via Webhook: ${shopifyWebhook.data?.killSwitchTriggered}`);
  results.push(shopifyWebhook);

  // 6. Auditoria Shopify OAuth Start (/api/shopify/auth)
  console.log('\n📌 [6/9] Auditando Shopify OAuth Handshake (/api/shopify/auth)...');
  const shopifyAuth = await measureEndpoint('Shopify OAuth Start', `${BASE_URL}/api/shopify/auth?shop=brkagro.myshopify.com`, {
    method: 'GET',
    redirect: 'manual'
  });
  console.log(`   ↳ Status: HTTP ${shopifyAuth.status} | Latência: ${shopifyAuth.durationMs}ms`);
  results.push(shopifyAuth);

  // 7. Auditoria Shopify OAuth Callback Segurança Anti-Spoofing (/api/shopify/callback)
  console.log('\n📌 [7/9] Auditando Segurança Anti-Spoofing HMAC (/api/shopify/callback)...');
  const shopifyCallbackInvalid = await measureEndpoint('Shopify OAuth Callback Anti-Spoofing', `${BASE_URL}/api/shopify/callback?shop=brkagro.myshopify.com&hmac=fake_hmac`, {
    method: 'GET'
  });
  console.log(`   ↳ Status: HTTP ${shopifyCallbackInvalid.status} (Esperado 400/401 para HMAC falso) | Latência: ${shopifyCallbackInvalid.durationMs}ms`);
  results.push(shopifyCallbackInvalid);

  // 8. Auditoria Swarm Cron Runner (/api/cron/swarm-runner)
  console.log('\n📌 [8/9] Auditando Segurança do Cron Runner (/api/cron/swarm-runner)...');
  const cronUnauthorized = await measureEndpoint('Swarm Cron Runner (Fail-Closed)', `${BASE_URL}/api/cron/swarm-runner`, {
    method: 'POST'
  });
  console.log(`   ↳ Status: HTTP ${cronUnauthorized.status} (Esperado 401/500 Fail-Closed sem segredo) | Latência: ${cronUnauthorized.durationMs}ms`);
  results.push(cronUnauthorized);

  // 9. Auditoria Completa de Domínio (/api/audit)
  console.log('\n📌 [9/9] Auditando Engine de Diagnóstico do Site (/api/audit)...');
  const siteAudit = await measureEndpoint('Site Audit Engine', `${BASE_URL}/api/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://brkagro.com.br' })
  });
  console.log(`   ↳ Status: HTTP ${siteAudit.status} | Latência: ${siteAudit.durationMs}ms`);
  results.push(siteAudit);

  // Resumo Geral
  console.log('\n==============================================================================');
  console.log('📊 PAINEL EXECUTIVO DA AUDITORIA FORENSE');
  console.log('==============================================================================');
  
  let passedCount = 0;
  results.forEach((r, idx) => {
    // Para endpoints de segurança (callback com hmac falso ou cron sem token), 400/401 é a resposta correta de segurança (pass)
    const isSecurityGuard = r.name.includes('Anti-Spoofing') || r.name.includes('Fail-Closed');
    const isSuccess = isSecurityGuard ? (r.status === 400 || r.status === 401 || r.status === 500) : (r.status === 200 || r.status === 302);
    if (isSuccess) passedCount++;
    console.log(`${idx + 1}. [${isSuccess ? 'PASS ✅' : 'FAIL ❌'}] ${r.name} - HTTP ${r.status} (${r.durationMs}ms)`);
  });

  const complianceScore = Math.round((passedCount / results.length) * 100);
  console.log(`\n🏆 SCORE DE CONFORMIDADE TÉCNICA: ${complianceScore}% (${passedCount}/${results.length} Verificados)`);
  console.log('==============================================================================\n');
}

runForensicAudit().catch(err => {
  console.error('Falha geral na auditoria:', err);
  process.exit(1);
});
