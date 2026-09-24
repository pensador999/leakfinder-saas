/// <reference types="node" />
// ==============================================================================
// 🌐 MAGIS5 HUB CONNECTOR: /api/magis5/sync
// Conecta ao Hub Integrador Magis5 para auditar o status dos anúncios sincronizados
// nos marketplaces (Mercado Livre, Shopee, Amazon).
// Se a Magis5 pausou o anúncio no Mercado Livre por falta de estoque,
// o AdShield detecta a assimetria e confirma a ruptura física no galpão.
// ==============================================================================

export const config = {
  maxDuration: 60,
};

export interface Magis5RequestBody {
  apiToken?: string;
  skuFilter?: string;
}

interface MinimalServerlessRequest {
  method?: string;
  body?: string | Magis5RequestBody;
  headers?: Record<string, string>;
}

interface MinimalServerlessResponse {
  status?: (code: number) => { json: (data: unknown) => unknown };
}

function sendResponse(response: MinimalServerlessResponse | unknown, statusCode: number, data: unknown) {
  const resp = response as MinimalServerlessResponse;
  if (resp?.status && typeof resp.status === 'function') {
    return resp.status(statusCode).json(data);
  }
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

export interface Magis5ChannelStatus {
  marketplace: 'MERCADO_LIVRE' | 'SHOPEE' | 'AMAZON' | 'MAGALU';
  anuncioId: string;
  status: 'ATIVO' | 'PAUSADO_ESTOQUE_ZERO' | 'PAUSADO_MANUAL' | 'SINCRONIZANDO';
  estoqueSincronizado: number;
  ultimaSincronizacao: string;
}

export interface Magis5AuditedProduct {
  sku: string;
  nome: string;
  magis5Id: string;
  estoqueTotalHub: number;
  canais: Magis5ChannelStatus[];
  pausadoNosMarketplaces: boolean;
  motivoPausa?: string;
  discrepanciaComShopify: boolean;
  alertaRisco: string;
}

export default async function handler(req: MinimalServerlessRequest, res: MinimalServerlessResponse) {
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 200, { ok: true });
  }

  let body: Magis5RequestBody = {};
  if (req.body) {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  const { apiToken, skuFilter } = body;

  // Se um token real da Magis5 foi informado
  if (apiToken && apiToken.length > 10) {
    try {
      const magis5Endpoint = `https://api.magis5.com.br/v2/products${skuFilter ? `?sku=${encodeURIComponent(skuFilter)}` : ''}`;
      const magisResp = await fetch(magis5Endpoint, {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Accept': 'application/json'
        }
      });

      if (magisResp.ok) {
        const rawData = await magisResp.json();
        // Mapeia os dados da API Magis5
        const items = rawData.data || rawData.products || [];
        const mappedProducts: Magis5AuditedProduct[] = items.map((item: any) => {
          const channels: Magis5ChannelStatus[] = (item.marketplaces || []).map((m: any) => ({
            marketplace: m.name?.toUpperCase() || 'MERCADO_LIVRE',
            anuncioId: m.listing_id || m.id,
            status: m.status === 'paused' && m.stock <= 0 ? 'PAUSADO_ESTOQUE_ZERO' : (m.status === 'active' ? 'ATIVO' : 'PAUSADO_MANUAL'),
            estoqueSincronizado: Number(m.stock || 0),
            ultimaSincronizacao: m.updated_at || new Date().toISOString()
          }));

          const isPausedML = channels.some(c => c.status === 'PAUSADO_ESTOQUE_ZERO');
          return {
            sku: item.sku || '',
            nome: item.title || '',
            magis5Id: String(item.id || ''),
            estoqueTotalHub: Number(item.total_stock || 0),
            canais: channels,
            pausadoNosMarketplaces: isPausedML,
            motivoPausa: isPausedML ? 'Estoque físico zerado no ERP e propagado via Magis5' : undefined,
            discrepanciaComShopify: isPausedML,
            alertaRisco: isPausedML ? 'Pausado no Mercado Livre mas continua ativo no tráfego da Shopify!' : 'Operação Sincronizada'
          };
        });

        return sendResponse(res, 200, {
          ok: true,
          source: 'magis5_live_api',
          totalAudited: mappedProducts.length,
          products: mappedProducts,
          timestamp: new Date().toISOString()
        });
      }
    } catch (err: any) {
      console.warn('[Magis5 Live API Error]:', err.message);
    }
  }

  // ==============================================================================
  // FALLBACK GROUNDED: CENÁRIO REAL DE ASSIMETRIA MULTICANAL (BRK AGRO)
  // O Mercado Livre já pausou o item para não negativar reputação, mas a Shopify
  // e o Meta Ads continuam rodando às cegas!
  // ==============================================================================
  const groundedMagis5Catalog: Magis5AuditedProduct[] = [
    {
      sku: "BN-YELLOW-001",
      nome: "Boné Trucker Yellowstone Dutton Ranch Original - Preto Sarja",
      magis5Id: "MAGIS-9921",
      estoqueTotalHub: 0,
      canais: [
        {
          marketplace: "MERCADO_LIVRE",
          anuncioId: "MLB-48291048",
          status: "PAUSADO_ESTOQUE_ZERO",
          estoqueSincronizado: 0,
          ultimaSincronizacao: new Date(Date.now() - 3600000).toISOString()
        },
        {
          marketplace: "SHOPEE",
          anuncioId: "SHP-8839210",
          status: "PAUSADO_ESTOQUE_ZERO",
          estoqueSincronizado: 0,
          ultimaSincronizacao: new Date(Date.now() - 7200000).toISOString()
        }
      ],
      pausadoNosMarketplaces: true,
      motivoPausa: "Ruptura de estoque no galpão. Pausado automaticamente para evitar perda de medalha MercadoLíder Platinum.",
      discrepanciaComShopify: true,
      alertaRisco: "ASSIMETRIA CRÍTICA: Magis5 já pausou no Mercado Livre e Shopee, mas o Meta Ads continua gastando no criativo da Shopify!"
    },
    {
      sku: "PL-DRY-002-G1",
      nome: "Camisa Polo Manga Curta BRK Dry Comfort - Tamanho G1",
      magis5Id: "MAGIS-8812-G1",
      estoqueTotalHub: 0,
      canais: [
        {
          marketplace: "MERCADO_LIVRE",
          anuncioId: "MLB-39182741",
          status: "PAUSADO_ESTOQUE_ZERO",
          estoqueSincronizado: 0,
          ultimaSincronizacao: new Date().toISOString()
        }
      ],
      pausadoNosMarketplaces: true,
      motivoPausa: "Grade G1 esgotada.",
      discrepanciaComShopify: true,
      alertaRisco: "Tamanho G1 pausado na Magis5. Se o criativo foca em Plus Size, haverá perda de tráfego."
    },
    {
      sku: "CM-FISH-005",
      nome: "Camiseta Manga Longa BRK Agro Fishing UV50+ Especial",
      magis5Id: "MAGIS-7741",
      estoqueTotalHub: 150,
      canais: [
        {
          marketplace: "MERCADO_LIVRE",
          anuncioId: "MLB-55192847",
          status: "ATIVO",
          estoqueSincronizado: 150,
          ultimaSincronizacao: new Date().toISOString()
        },
        {
          marketplace: "SHOPEE",
          anuncioId: "SHP-19284711",
          status: "ATIVO",
          estoqueSincronizado: 150,
          ultimaSincronizacao: new Date().toISOString()
        }
      ],
      pausadoNosMarketplaces: false,
      discrepanciaComShopify: false,
      alertaRisco: "Operação Saudável: Estoque ativo em todos os marketplaces e pronto para escala de tráfego."
    }
  ];

  return sendResponse(res, 200, {
    ok: true,
    source: 'magis5_grounded_simulation',
    simulationBadge: '[Modo Simulação Grounded - Magis5 Hub]',
    transparencyNote: 'Auditoria de status de anúncios sincronizados nos canais Mercado Livre e Shopee.',
    totalAudited: groundedMagis5Catalog.length,
    discrepanciesCount: groundedMagis5Catalog.filter(p => p.discrepanciaComShopify).length,
    products: groundedMagis5Catalog,
    timestamp: new Date().toISOString()
  });
}
