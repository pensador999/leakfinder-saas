// ==============================================================================
// 🚀 CLOUD MCP HEADLESS WORKER SERVER (SSE & REST)
// Official Model Context Protocol Server with SSE Transport + REST Scraper API
// ==============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { 
  CallToolRequestSchema, 
  ListToolsRequestSchema 
} from '@modelcontextprotocol/sdk/types.js';

import { BrowserPool } from './browserPool.js';
import { inspectEcommerceStore } from './inspector.js';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3001', 10);
const MCP_API_KEY = process.env.MCP_API_KEY || '';
const MAX_CONCURRENT_PAGES = parseInt(process.env.MAX_CONCURRENT_PAGES || '4', 10);

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

// Inicializa o Pool de Navegadores Chromium
const browserPool = new BrowserPool(MAX_CONCURRENT_PAGES);

// Middleware de Autenticação Opcional
const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!MCP_API_KEY) return next();

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '');
  const apiKeyHeader = req.headers['x-api-key'];

  if (token === MCP_API_KEY || apiKeyHeader === MCP_API_KEY) {
    return next();
  }

  res.status(401).json({ error: 'Unauthorized: Invalid or missing MCP_API_KEY.' });
};

// ==============================================================================
// 🤖 CONFIGURAÇÃO DO SERVIDOR MODEL CONTEXT PROTOCOL (MCP)
// ==============================================================================
const mcpServer = new Server(
  {
    name: 'adshield-mcp-headless-worker',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// 1. Lista de Ferramentas MCP Disponíveis
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'inspect_ecommerce_store',
        description: 'Audita profundamente uma loja virtual via Chromium Headless: detecta Meta Pixel, GTM, TikTok Pixel, botões de compra, WhatsApp de atendimento e furos críticos de grade de estoque (M, G, GG, 40-42).',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'URL completa do e-commerce (ex: https://www.insiderstore.com.br)'
            },
            includeScreenshot: {
              type: 'boolean',
              description: 'Se true, captura e retorna o screenshot da vitrine em base64'
            }
          },
          required: ['url']
        }
      },
      {
        name: 'get_worker_health',
        description: 'Retorna a telemetria do worker: instâncias ativas do Chromium, uptime e uso de memória.',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ]
  };
});

// 2. Execução de Ferramentas MCP
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'inspect_ecommerce_store') {
    const url = String(args?.url || '');
    const includeScreenshot = Boolean(args?.includeScreenshot);

    if (!url) {
      throw new Error('O parâmetro "url" é obrigatório.');
    }

    const audit = await inspectEcommerceStore(url, browserPool, includeScreenshot);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(audit, null, 2)
        }
      ]
    };
  }

  if (name === 'get_worker_health') {
    const metrics = browserPool.getMetrics();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(metrics, null, 2)
        }
      ]
    };
  }

  throw new Error(`Ferramenta desconhecida: ${name}`);
});

// ==============================================================================
// 📡 ENDPOINTS DE TRANSPORTE SSE (SERVER-SENT EVENTS) DO MCP
// ==============================================================================
let sseTransport: SSEServerTransport | null = null;

app.get('/sse', authMiddleware, async (req, res) => {
  console.log('[MCP SSE] Nova conexão cliente SSE estabelecida.');
  sseTransport = new SSEServerTransport('/messages', res);
  await mcpServer.connect(sseTransport);
});

app.post('/messages', authMiddleware, async (req, res) => {
  if (!sseTransport) {
    res.status(400).json({ error: 'Nenhuma conexão SSE ativa. Conecte-se em /sse primeiro.' });
    return;
  }
  await sseTransport.handlePostMessage(req, res);
});

// ==============================================================================
// 🌐 ENDPOINTS REST DIRETOS (FALLBACK & HEALTHCHECK)
// ==============================================================================
app.get('/health', (req, res) => {
  const metrics = browserPool.getMetrics();
  res.json({
    status: metrics.isHealthy ? 'HEALTHY' : 'DEGRADED',
    worker: 'adshield-mcp-headless-worker',
    version: '1.0.0',
    concurrency: {
      max: MAX_CONCURRENT_PAGES,
      active: metrics.activePages
    },
    system: {
      uptimeSeconds: metrics.browserUptimeSeconds,
      memoryUsageMb: metrics.memoryUsageMb,
      totalAuditsServed: metrics.totalRequestsServed
    }
  });
});

app.post('/api/audit', authMiddleware, async (req, res) => {
  const { url, includeScreenshot } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL é obrigatória no body da requisição.' });
  }

  try {
    const result = await inspectEcommerceStore(url, browserPool, Boolean(includeScreenshot));
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Erro durante a auditoria headless.' });
  }
});

// Inicialização do Servidor HTTP
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🦅 [ADSHIELD CLOUD MCP WORKER] Inicializado com sucesso!`);
  console.log(`   - Porta: ${PORT}`);
  console.log(`   - MCP SSE Endpoint: http://0.0.0.0:${PORT}/sse`);
  console.log(`   - REST Healthcheck: http://0.0.0.0:${PORT}/health`);
  console.log(`   - REST Audit API:   http://0.0.0.0:${PORT}/api/audit`);
  console.log(`   - Capacidade Concorrente: ${MAX_CONCURRENT_PAGES} páginas simultâneas\n`);
});

// Encerramento Gracioso
const handleShutdown = async () => {
  console.log('\n[Worker] Encerrando servidor e liberando recursos...');
  server.close();
  await browserPool.shutdown();
  process.exit(0);
};

process.on('SIGTERM', handleShutdown);
process.on('SIGINT', handleShutdown);
