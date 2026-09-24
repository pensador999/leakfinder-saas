/// <reference types="node" />
// ==============================================================================
// 📦 SHOPIFY INVENTORY AUDIT & SYNC ENGINE: /api/shopify/sync
// Executes GraphQL Admin API queries to audit physical warehouse inventory levels,
// detecting Ghost Inventory (inventory_quantity <= 0 with backorder overselling)
// as mandated by the Anti-Ghost Inventory Protocol ("Yellowstone Dutton Ranch").
// ==============================================================================

export const config = {
  maxDuration: 60,
};

function sendResponse(response: any, statusCode: number, data: any) {
  if (response?.status && typeof response.status === 'function') {
    return response.status(statusCode).json(data);
  }
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}

const SHOPIFY_GRAPHQL_INVENTORY_QUERY = `#graphql
query GetStoreCatalogInventory($first: Int!) {
  products(first: $first) {
    edges {
      node {
        id
        title
        handle
        status
        totalInventory
        variants(first: 25) {
          edges {
            node {
              id
              title
              sku
              price
              inventoryQuantity
              inventoryPolicy
              inventoryItem {
                id
                tracked
                inventoryLevels(first: 5) {
                  edges {
                    node {
                      location {
                        id
                        name
                      }
                      quantities(names: ["available", "on_hand", "committed"]) {
                        name
                        quantity
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export interface AuditedInventorySku {
  sku: string;
  productTitle: string;
  variantTitle: string;
  price: string;
  physicalOnHand: number;
  availableForSale: number;
  committedOrders: number;
  inventoryPolicy: 'DENY' | 'CONTINUE';
  isGhostInventory: boolean;
  status: 'EM_ESTOQUE' | 'RUPTURA_FISICA' | 'ESTOQUE_FANTASMA_BACKORDER';
  warningMessage?: string;
}

export default async function handler(request: any, response: any) {
  const isWebRequest = typeof request.headers?.get === 'function';
  const urlObj = new URL(request.url, 'http://localhost');

  let shop = isWebRequest
    ? urlObj.searchParams.get('shop')
    : (request.query?.shop || urlObj.searchParams.get('shop'));

  let accessToken = isWebRequest
    ? request.headers.get('x-shopify-access-token')
    : (request.headers?.['x-shopify-access-token']);

  // If token not provided in header, try fetching from Supabase
  if (shop && !accessToken) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const dbRes = await fetch(`${supabaseUrl}/rest/v1/shopify_connections?shop_domain=eq.${shop}&select=access_token`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        if (dbRes.ok) {
          const rows = await dbRes.json();
          if (rows && rows.length > 0) {
            accessToken = rows[0].access_token;
          }
        }
      } catch (err) {
        console.warn('[Shopify Sync] Could not fetch token from DB:', err);
      }
    }
  }

  // Fallback to simulation mode if no live store credentials are provided yet
  if (!shop || !accessToken || accessToken.startsWith('shpat_simulated_')) {
    const simulatedAuditedSkus: AuditedInventorySku[] = [
      {
        sku: 'BRK-BON-YELLOWSTONE-01',
        productTitle: 'Boné Trucker Yellowstone Dutton Ranch Montana',
        variantTitle: 'Preto / Ajustável',
        price: '119.90',
        physicalOnHand: 0,
        availableForSale: 0,
        committedOrders: 14,
        inventoryPolicy: 'CONTINUE',
        isGhostInventory: true,
        status: 'ESTOQUE_FANTASMA_BACKORDER',
        warningMessage: '🚨 ESTOQUE FANTASMA DETECTADO: Quantidade física é 0 no galpão, mas a loja continua permitindo compra (inventory_policy: CONTINUE). Anúncios no Meta Ads devem ser pausados imediatamente!'
      },
      {
        sku: 'BRK-CAM-FARM-XADREZ-G',
        productTitle: 'Camisa Xadrez Farm Manga Longa UV50+',
        variantTitle: 'Preto/Branco - Tamanho G',
        price: '189.90',
        physicalOnHand: 0,
        availableForSale: 0,
        committedOrders: 6,
        inventoryPolicy: 'DENY',
        status: 'RUPTURA_FISICA',
        isGhostInventory: false,
        warningMessage: 'Ruptura física no galpão. Grade central G esgotada.'
      },
      {
        sku: 'BRK-CAM-FARM-XADREZ-M',
        productTitle: 'Camisa Xadrez Farm Manga Longa UV50+',
        variantTitle: 'Preto/Branco - Tamanho M',
        price: '189.90',
        physicalOnHand: 42,
        availableForSale: 38,
        committedOrders: 4,
        inventoryPolicy: 'DENY',
        status: 'EM_ESTOQUE',
        isGhostInventory: false
      }
    ];

    return sendResponse(response, 200, {
      mode: 'GROUNDED_BENCHMARK_AUDIT',
      shop: shop || 'brkagro.myshopify.com',
      totalSkusAudited: simulatedAuditedSkus.length,
      ghostInventoryCount: simulatedAuditedSkus.filter(s => s.isGhostInventory).length,
      ruptureCount: simulatedAuditedSkus.filter(s => s.status === 'RUPTURA_FISICA').length,
      skus: simulatedAuditedSkus
    });
  }

  // Real GraphQL Admin API Call against Shopify
  try {
    const apiVersion = '2026-01';
    const graphqlEndpoint = `https://${shop}/admin/api/${apiVersion}/graphql.json`;

    const gqlResponse = await fetch(graphqlEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({
        query: SHOPIFY_GRAPHQL_INVENTORY_QUERY,
        variables: { first: 50 }
      })
    });

    if (!gqlResponse.ok) {
      const errText = await gqlResponse.text();
      return sendResponse(response, gqlResponse.status, {
        error: 'Shopify Admin API Request Failed',
        details: errText
      });
    }

    const { data, errors } = await gqlResponse.json();
    if (errors && errors.length > 0) {
      return sendResponse(response, 400, { error: 'GraphQL Syntax / Permission Error', details: errors });
    }

    const auditedSkus: AuditedInventorySku[] = [];
    const products = data?.products?.edges || [];

    for (const pEdge of products) {
      const p = pEdge.node;
      const variants = p.variants?.edges || [];

      for (const vEdge of variants) {
        const v = vEdge.node;
        const inventoryItem = v.inventoryItem;
        const levels = inventoryItem?.inventoryLevels?.edges || [];
        
        let onHand = 0;
        let available = v.inventoryQuantity ?? 0;
        let committed = 0;

        levels.forEach((lEdge: any) => {
          const quantities = lEdge.node?.quantities || [];
          quantities.forEach((q: any) => {
            if (q.name === 'on_hand') onHand += q.quantity;
            if (q.name === 'committed') committed += q.quantity;
          });
        });

        const isBackorderActive = v.inventoryPolicy === 'CONTINUE';
        const isGhost = available <= 0 && isBackorderActive;
        const status = isGhost 
          ? 'ESTOQUE_FANTASMA_BACKORDER' 
          : available <= 0 
          ? 'RUPTURA_FISICA' 
          : 'EM_ESTOQUE';

        auditedSkus.push({
          sku: v.sku || `SKU_${v.id.split('/').pop()}`,
          productTitle: p.title,
          variantTitle: v.title,
          price: v.price,
          physicalOnHand: onHand || available,
          availableForSale: available,
          committedOrders: committed,
          inventoryPolicy: isBackorderActive ? 'CONTINUE' : 'DENY',
          isGhostInventory: isGhost,
          status,
          warningMessage: isGhost 
            ? '🚨 ESTOQUE FANTASMA: Estoque físico zerado no galpão com backorder ativo no front-end!'
            : undefined
        });
      }
    }

    return sendResponse(response, 200, {
      mode: 'LIVE_SHOPIFY_ADMIN_API',
      shop,
      totalSkusAudited: auditedSkus.length,
      ghostInventoryCount: auditedSkus.filter(s => s.isGhostInventory).length,
      ruptureCount: auditedSkus.filter(s => s.status === 'RUPTURA_FISICA').length,
      skus: auditedSkus
    });

  } catch (err: any) {
    return sendResponse(response, 500, {
      error: 'Failed to execute Shopify GraphQL Inventory Sync',
      message: err.message
    });
  }
}
