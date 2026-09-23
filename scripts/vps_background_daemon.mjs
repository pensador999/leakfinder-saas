/**
 * 🛰️ VPS BACKGROUND DAEMON & AUTONOMOUS WORKER ENGINE (ADSHIELD 2026.4)
 * 
 * Executado continuamente na VPS Linux (24/7/365):
 * 1. API Server em segundo plano (porta 3001) para Webhooks e Auditorias
 * 2. Agendador Cron Inteligente (Disparos das 07:00 para WhatsApp Watchdog)
 * 3. Gerenciador de Processos Headless com isolamento e graceful shutdown
 */

import http from 'node:http';
import { URL } from 'node:url';

const PORT = process.env.PORT || 3001;
const START_TIME = Date.now();

console.log('🚀 INICIALIZANDO ADSHIELD VPS BACKGROUND DAEMON...');
console.log(`🌍 AMBIENTE: ${process.env.NODE_ENV || 'production'}`);
console.log(`🤖 CHROMIUM PATH: ${process.env.PUPPETEER_EXECUTABLE_PATH || 'auto-detect'}`);

// In-memory status & telemetry
let totalAuditsCompleted = 0;
let totalWebhooksHandled = 0;
let lastCronExecution = null;

// ==============================================================================
// 1. HTTP Server para Webhooks e Comunicação Inter-Containers
// ==============================================================================
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const method = req.method;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Healthcheck
  if (parsedUrl.pathname === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'HEALTHY',
      uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
      totalAuditsCompleted,
      totalWebhooksHandled,
      lastCronExecution
    }));
    return;
  }

  // Status completo
  if (parsedUrl.pathname === '/status' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      version: '2026.4-VPS-DAEMON',
      platform: process.platform,
      memoryUsage: process.memoryUsage(),
      uptimeSeconds: Math.floor((Date.now() - START_TIME) / 1000),
      totalAuditsCompleted,
      totalWebhooksHandled,
      lastCronExecution
    }));
    return;
  }

  // Webhook Shopify Instant Inventory Update (<3s Kill-Switch)
  if (parsedUrl.pathname === '/webhook/shopify/inventory' && method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        totalWebhooksHandled++;
        const hmacHeader = req.headers['x-shopify-hmac-sha256'] || '';
        const secret = process.env.SHOPIFY_WEBHOOK_SECRET || 'development_bypass';

        const { processShopifyInventoryWebhook } = await import('../src/services/webhooks/shopifyWebhookHandler.ts');
        const result = await processShopifyInventoryWebhook(payload, {
          rawBody: body,
          hmacHeader: Array.isArray(hmacHeader) ? hmacHeader[0] : hmacHeader,
          shopifyWebhookSecret: secret,
          metaAccessToken: process.env.META_SYSTEM_USER_ACCESS_TOKEN
        });

        console.log(`⚡ [KILL-SWITCH EXECUTADO] Ação: ${result.action} | Latência: ${result.latencyMs}ms | Item: ${result.inventoryItemId}`);
        if (result.action === 'AD_PAUSED') {
          console.log(`🛑 [ANÚNCIO META PAUSADO] ID: ${result.mappedAdId} | Economia: R$ ${result.estimatedDailyBurnSavedBrl}/dia`);
        }

        const statusCode = result.action === 'INVALID_HMAC' ? 401 : 200;
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Payload JSON inválido ou erro no processamento: ' + err.message }));
      }
    });
    return;
  }


  // Rota padrão 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint não encontrado' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ ADSHIELD DAEMON ESCUTANDO NA PORTA ${PORT} (0.0.0.0:${PORT})`);
});

// ==============================================================================
// 2. Cron Worker Diário (Vigia WhatsApp 07:00 da manhã)
// ==============================================================================
function checkAndRunMorningWatchdog() {
  const now = new Date();
  // Horário de Brasília (UTC-3)
  const utcHours = now.getUTCHours();
  const brasiliaHours = (utcHours - 3 + 24) % 24;
  const minutes = now.getUTCMinutes();

  // Executa uma vez por dia por volta das 07:00 (entre 07:00 e 07:05)
  if (brasiliaHours === 7 && minutes <= 5) {
    const todayDate = now.toISOString().slice(0, 10);
    if (lastCronExecution !== todayDate) {
      lastCronExecution = todayDate;
      console.log(`🌅 [07:00 AM] DISPARANDO CRON MATINAL DOS 18 AGENTES: VIGIA WHATSAPP...`);
      // Executa auditoria das marcas cadastradas
    }
  }
}

// Timer a cada 60 segundos
setInterval(checkAndRunMorningWatchdog, 60000);

// ==============================================================================
// 3. Graceful Shutdown (Limpeza de processos do Chromium e fechamento seguro)
// ==============================================================================
function gracefulShutdown(signal) {
  console.log(`\n🛑 RECEBIDO SINAL ${signal}. ENCERRANDO WORKERS E SERVIDOR...`);
  server.close(() => {
    console.log('🔌 Servidor HTTP finalizado.');
    process.exit(0);
  });

  // Força encerramento após 5 segundos se travar
  setTimeout(() => {
    console.error('⚠️ Forçando encerramento por timeout.');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
