import assert from 'node:assert';
import crypto from 'node:crypto';
import { 
  validateShopifyHmac, 
  processShopifyInventoryWebhook 
} from '../src/services/webhooks/shopifyWebhookHandler.ts';
import { 
  MetaAdsGraphClient 
} from '../src/services/ads/metaAdsGraphClient.ts';

console.log('⚡ INICIANDO SUÍTE DE TESTES: ZERO-SECOND KILL-SWITCH & WEBHOOK SECURITY');

// --------------------------------------------------------------------------
// TESTE 1: Validação Criptográfica HMAC SHA-256
// --------------------------------------------------------------------------
console.log('\n▶ Teste 1: Validação Criptográfica HMAC SHA-256');

const testSecret = 'adshield_super_secret_webhook_key_2026';
const testPayload = JSON.stringify({
  inventory_item_id: 8492019482,
  location_id: 1029384,
  available: 0,
  updated_at: '2026-09-18T16:00:00Z'
});

// Gera assinatura HMAC válida usando crypto do Node
const validHmac = crypto.createHmac('sha256', testSecret).update(testPayload).digest('base64');
const isSignatureValid = await validateShopifyHmac(testPayload, validHmac, testSecret);
assert.strictEqual(isSignatureValid, true, 'HMAC válido deve retornar true');

// Assinatura forjada / corrompida
const invalidHmac = 'YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXoxMjM0NTY=';
const isInvalidRejected = await validateShopifyHmac(testPayload, invalidHmac, testSecret);
assert.strictEqual(isInvalidRejected, false, 'HMAC forjado deve ser rejeitado (false)');

console.log('✅ Teste 1 passou: Validação criptográfica HMAC SHA-256 blindada contra adulteração!');

// --------------------------------------------------------------------------
// TESTE 2: Execução de Ruptura de Estoque (Estoque = 0 -> Pausa no Meta Ads)
// --------------------------------------------------------------------------
console.log('\n▶ Teste 2: Disparo de Ruptura Imediata (available: 0)');

const rupturePayload = {
  inventory_item_id: 8492019482,
  location_id: 1029384,
  available: 0,
  sku: 'BON-YEL-001',
  product_title: 'Boné Trucker Yellowstone Dutton Ranch',
  updated_at: '2026-09-18T16:00:00Z'
};

const ruptureStart = Date.now();
const killResult = await processShopifyInventoryWebhook(rupturePayload, {
  rawBody: JSON.stringify(rupturePayload),
  hmacHeader: crypto.createHmac('sha256', testSecret).update(JSON.stringify(rupturePayload)).digest('base64'),
  shopifyWebhookSecret: testSecret,
  metaAccessToken: 'simulated'
});
const totalExecutionMs = Date.now() - ruptureStart;

assert.strictEqual(killResult.success, true, 'Execução do Kill-Switch deve retornar sucesso');
assert.strictEqual(killResult.action, 'AD_PAUSED', 'Ação deve ser AD_PAUSED');
assert(killResult.latencyMs < 3000, `Latência deve ser menor que 3000ms (obteve ${killResult.latencyMs}ms)`);
assert(killResult.whatsAppAlertText.includes('Boné Trucker Yellowstone Dutton Ranch'), 'Alerta de WhatsApp deve conter o título do produto');
assert(killResult.whatsAppAlertText.includes('PAUSADO COM SUCESSO'), 'Alerta deve indicar status pausado');
assert(killResult.estimatedDailyBurnSavedBrl > 0, 'Deve calcular verba diária economizada');

console.log(`✅ Teste 2 passou: Anúncio pausado no Meta Ads em ${killResult.latencyMs}ms com economia de R$ ${killResult.estimatedDailyBurnSavedBrl}/dia!`);

// --------------------------------------------------------------------------
// TESTE 3: Comportamento quando o Estoque é Positivo (available: 15)
// --------------------------------------------------------------------------
console.log('\n▶ Teste 3: Estoque Regularizado (available: 15)');

const healthyPayload = {
  inventory_item_id: 8492019482,
  location_id: 1029384,
  available: 15,
  sku: 'BON-YEL-001',
  product_title: 'Boné Trucker Yellowstone Dutton Ranch',
  updated_at: '2026-09-18T16:00:00Z'
};

const healthyResult = await processShopifyInventoryWebhook(healthyPayload, {
  shopifyWebhookSecret: 'development_bypass'
});

assert.strictEqual(healthyResult.success, true);
assert.strictEqual(healthyResult.action, 'STOCK_AVAILABLE_NO_ACTION', 'Não deve pausar anúncio se estoque for positivo');
assert.strictEqual(healthyResult.estimatedDailyBurnSavedBrl, 0, 'Economia deve ser 0 quando há estoque');
console.log('✅ Teste 3 passou: Nenhum falso-positivo disparado quando há estoque em depósito!');

// --------------------------------------------------------------------------
// TESTE 4: Cliente MetaAdsGraphClient Direto
// --------------------------------------------------------------------------
console.log('\n▶ Teste 4: Verificação da Meta Graph API Client');

const metaDirectPause = await MetaAdsGraphClient.pauseAd('ad_99887766', 'simulated');
assert.strictEqual(metaDirectPause.success, true);
assert.strictEqual(metaDirectPause.status, 'PAUSED');
assert(metaDirectPause.latencyMs < 100, `Latência direta deve ser instantânea (obteve ${metaDirectPause.latencyMs}ms)`);

console.log(`✅ Teste 4 passou: Cliente da Meta Graph API respondeu em ${metaDirectPause.latencyMs}ms!`);

console.log('\n🏆 TODOS OS 4 TESTES DO ZERO-SECOND KILL-SWITCH PASSARAM COM SUCESSO!\n');
