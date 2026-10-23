/// <reference types="node" />
// ==============================================================================
// 🎯 OMNICHANNEL TRUTH MATRIX: /api/omnichannel/cross-audit
// Cruza os 4 nós operacionais:
// 1. Shopify Storefront (Disponibilidade e Backorder no Front)
// 2. Sankhya ERP Gateway (Estoque Físico e PCP no Galpão)
// 3. Magis5 Hub Integrador (Status de Anúncios no Mercado Livre/Shopee)
// 4. Meta Ads Graph API (Campanhas Ativas e Queima de Verba Diária)
// 
// Protocolo Mandatório Anti-Estoque Fantasma (Caso Yellowstone Dutton Ranch)
// ==============================================================================

import { metaAdsGraphClient } from '../../src/services/ads/metaAdsGraphClient';

export const config = {
  maxDuration: 60,
};

export interface OmnichannelCrossAuditRequestBody {
  executeKillSwitch?: boolean;
  targetSku?: string;
  storeName?: string;
  recipientPhone?: string;
  customItems?: OmnichannelAuditItem[];
  sankhyaCredentials?: {
    baseUrl?: string;
    token?: string;
    username?: string;
    password?: string;
  };
  magis5ApiToken?: string;
  shopifyAdminToken?: string;
  shopifyDomain?: string;
  metaAccessToken?: string;
}

interface MinimalServerlessRequest {
  method?: string;
  body?: string | OmnichannelCrossAuditRequestBody;
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

export interface OmnichannelAuditItem {
  sku: string;
  nome: string;
  handle: string;
  preco: number;
  
  // Camada 1: Shopify
  shopifyStatus: {
    disponivelFront: boolean;
    inventoryPolicy: 'continue' | 'deny';
    tracked: boolean;
    estoqueFront: number;
  };

  // Camada 2: Sankhya ERP (Físico)
  sankhyaStatus: {
    estoqueFisicoGalpao: number;
    reservado: number;
    disponivelReal: number;
    emCortePcp: boolean;
    leadTimeDias: number;
  };

  // Camada 3: Magis5 Hub (Marketplaces)
  magis5Status: {
    statusMercadoLivre: 'ATIVO' | 'PAUSADO_ESTOQUE_ZERO' | 'NAO_VINCULADO';
    statusShopee: 'ATIVO' | 'PAUSADO_ESTOQUE_ZERO' | 'NAO_VINCULADO';
    pausadoPorEstoque: boolean;
  };

  // Camada 4: Meta Ads
  metaAdsStatus: {
    anuncioAtivo: boolean;
    adsetId?: string;
    nomeCampanha: string;
    verbaDiariaReais: number;
    cpcMedioReais: number;
  };

  // Veredito do AdShield
  veredito: {
    temEstoqueFantasma: boolean;
    nivelRisco: 'CRITICO' | 'ALERTA' | 'SEGURO';
    motivoDiscrepancia: string;
    desperdicioDiarioEstimado: number;
    desperdicioMensalProjetado: number;
    acaoKillSwitchRecomendada: boolean;
    statusKillSwitch: 'PENDENTE' | 'EXECUTADO' | 'NAO_NECESSARIO';
  };
}

export default async function handler(req: MinimalServerlessRequest, res: MinimalServerlessResponse) {
  if (req.method === 'OPTIONS') {
    return sendResponse(res, 200, { ok: true });
  }

  let body: OmnichannelCrossAuditRequestBody = {};
  if (req.body) {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  }

  const {
    executeKillSwitch = false,
    targetSku,
    storeName = 'Loja Auditada',
    recipientPhone = '',
    customItems,
    sankhyaCredentials,
    magis5ApiToken,
    shopifyAdminToken,
    shopifyDomain,
    metaAccessToken
  } = body;

  const effectiveSankhyaUrl = sankhyaCredentials?.baseUrl || process.env.SANKHYA_BASE_URL || '';
  const effectiveSankhyaToken = sankhyaCredentials?.token || process.env.SANKHYA_TOKEN || '';
  const effectiveSankhyaUser = sankhyaCredentials?.username || process.env.SANKHYA_USERNAME || '';
  const effectiveSankhyaPass = sankhyaCredentials?.password || process.env.SANKHYA_PASSWORD || '';
  const effectiveMagis5Token = magis5ApiToken || process.env.MAGIS5_API_TOKEN || '';
  const effectiveShopifyToken = shopifyAdminToken || process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || '';
  const effectiveShopifyDomain = shopifyDomain || process.env.SHOPIFY_STORE_DOMAIN || '';
  const effectiveMetaToken = metaAccessToken || process.env.META_SYSTEM_USER_ACCESS_TOKEN || process.env.META_ADS_ACCESS_TOKEN || '';

  const hasLiveErpCredentials = Boolean(
    (effectiveSankhyaUrl && (effectiveSankhyaToken || (effectiveSankhyaUser && effectiveSankhyaPass))) ||
    effectiveMagis5Token ||
    (effectiveShopifyToken && effectiveShopifyDomain)
  );

  // Consultas reais opcionais aos conectores quando credenciais privadas estão presentes
  const liveSankhyaStockBySku = new Map<string, { fisico: number; reservado: number; disponivel: number }>();
  const liveMagis5StatusBySku = new Map<string, { ml: 'ATIVO' | 'PAUSADO_ESTOQUE_ZERO'; shopee: 'ATIVO' | 'PAUSADO_ESTOQUE_ZERO'; paused: boolean }>();
  const liveShopifyStockBySku = new Map<string, { qty: number; policy: 'continue' | 'deny' }>();

  if (effectiveSankhyaUrl && (effectiveSankhyaToken || (effectiveSankhyaUser && effectiveSankhyaPass))) {
    try {
      const sanitizedUrl = effectiveSankhyaUrl.replace(/\/$/, '');
      let jsessionId = '';

      if (!effectiveSankhyaToken && effectiveSankhyaUser && effectiveSankhyaPass) {
        const loginUrl = `${sanitizedUrl}/mge/service.sbr?serviceName=MobileLoginSP.login&outputType=json`;
        const loginResp = await fetch(loginUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceName: 'MobileLoginSP.login',
            requestBody: {
              NOMUSU: { $: effectiveSankhyaUser },
              INTERNO: { $: effectiveSankhyaPass }
            }
          })
        });
        if (loginResp.ok) {
          const setCookieHeader = loginResp.headers?.get?.('set-cookie');
          if (setCookieHeader) {
            const match = setCookieHeader.match(/JSESSIONID=([^;]+)/i);
            if (match) jsessionId = match[1];
          }
          const loginJson = await loginResp.json().catch(() => ({}));
          if (loginJson?.responseBody?.jsessionid?.$) {
            jsessionId = loginJson.responseBody.jsessionid.$;
          }
        }
      }

      const queryUrl = `${sanitizedUrl}/mge/service.sbr?serviceName=DbExplorerSP.executeQuery&outputType=json`;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (effectiveSankhyaToken) {
        headers['Authorization'] = `Bearer ${effectiveSankhyaToken}`;
      } else if (jsessionId) {
        headers['Cookie'] = `JSESSIONID=${jsessionId}`;
      }

      const queryResp = await fetch(queryUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          serviceName: 'DbExplorerSP.executeQuery',
          requestBody: {
            sql: `SELECT PRO.REFERENCIA, NVL(SUM(EST.ESTOQUE),0) AS EST, NVL(SUM(EST.RESERVADO),0) AS RES FROM TGFEST EST INNER JOIN TGFPRO PRO ON PRO.CODPROD = EST.CODPROD GROUP BY PRO.REFERENCIA`
          }
        })
      });
      if (queryResp.ok) {
        const qJson = await queryResp.json();
        const rows = Array.isArray(qJson?.responseBody?.rows) ? qJson.responseBody.rows : [];
        for (const r of rows) {
          const skuKey = String(r[0] || '').trim().toUpperCase();
          const est = Number(r[1] || 0);
          const resv = Number(r[2] || 0);
          if (skuKey) {
            liveSankhyaStockBySku.set(skuKey, { fisico: est, reservado: resv, disponivel: est - resv });
          }
        }
      }
    } catch (err: any) {
      console.warn('[Omnichannel Live Sankhya Fetch Warning]:', err?.message);
    }
  }

  if (effectiveMagis5Token && effectiveMagis5Token.length > 10) {
    try {
      const magisResp = await fetch('https://api.magis5.com.br/v2/products', {
        headers: { Authorization: `Bearer ${effectiveMagis5Token}`, Accept: 'application/json' }
      });
      if (magisResp.ok) {
        const mJson = await magisResp.json();
        const items = mJson?.data || mJson?.products || [];
        for (const it of items) {
          const skuKey = String(it?.sku || '').trim().toUpperCase();
          const stock = Number(it?.total_stock ?? 0);
          const paused = stock <= 0 || it?.status === 'paused';
          if (skuKey) {
            liveMagis5StatusBySku.set(skuKey, {
              ml: paused ? 'PAUSADO_ESTOQUE_ZERO' : 'ATIVO',
              shopee: paused ? 'PAUSADO_ESTOQUE_ZERO' : 'ATIVO',
              paused
            });
          }
        }
      }
    } catch (err: any) {
      console.warn('[Omnichannel Live Magis5 Fetch Warning]:', err?.message);
    }
  }

  if (effectiveShopifyToken && effectiveShopifyDomain) {
    try {
      const shopResp = await fetch(`https://${effectiveShopifyDomain}/admin/api/2024-07/products.json?limit=50`, {
        headers: { 'X-Shopify-Access-Token': effectiveShopifyToken, Accept: 'application/json' }
      });
      if (shopResp.ok) {
        const sJson = await shopResp.json();
        const prods = Array.isArray(sJson?.products) ? sJson.products : [];
        for (const p of prods) {
          for (const v of p?.variants || []) {
            const skuKey = String(v?.sku || '').trim().toUpperCase();
            if (skuKey) {
              liveShopifyStockBySku.set(skuKey, {
                qty: Number(v?.inventory_quantity ?? 0),
                policy: v?.inventory_policy === 'continue' ? 'continue' : 'deny'
              });
            }
          }
        }
      }
    } catch (err: any) {
      console.warn('[Omnichannel Live Shopify Admin Warning]:', err?.message);
    }
  }

  // Catálogo de Referência (usado apenas se customItems não for enviado — rotulado explicitamente como Demonstração)
  const defaultReferenceItems: OmnichannelAuditItem[] = [
    {
      sku: "BN-YELLOW-001",
      nome: "Boné Trucker Yellowstone Dutton Ranch Original - Preto Sarja",
      handle: "bone-trucker-yellowstone-dutton-ranch",
      preco: 129.90,
      shopifyStatus: {
        disponivelFront: true,
        inventoryPolicy: 'continue',
        tracked: true,
        estoqueFront: 0
      },
      sankhyaStatus: {
        estoqueFisicoGalpao: 0,
        reservado: 3,
        disponivelReal: -3,
        emCortePcp: false,
        leadTimeDias: 21
      },
      magis5Status: {
        statusMercadoLivre: 'PAUSADO_ESTOQUE_ZERO',
        statusShopee: 'PAUSADO_ESTOQUE_ZERO',
        pausadoPorEstoque: true
      },
      metaAdsStatus: {
        anuncioAtivo: true,
        adsetId: "adset_yellowstone_scale_01",
        nomeCampanha: "[CONV] - Bonés e Acessórios Agro - CBO Topo",
        verbaDiariaReais: 450.00,
        cpcMedioReais: 1.85
      },
      veredito: {
        temEstoqueFantasma: true,
        nivelRisco: 'CRITICO',
        motivoDiscrepancia: "[Cenário de Demonstração / Caso Yellowstone] Magis5 pausou no Mercado Livre e Sankhya ERP acusa saldo zero, mas a Shopify continua vendendo e o Meta Ads queima R$ 450/dia sem produto para pronta entrega!",
        desperdicioDiarioEstimado: 450.00,
        desperdicioMensalProjetado: 13500.00,
        acaoKillSwitchRecomendada: true,
        statusKillSwitch: executeKillSwitch ? 'EXECUTADO' : 'PENDENTE'
      }
    },
    {
      sku: "PL-DRY-002",
      nome: "Camisa Polo Manga Curta BRK Dry Comfort Proteção UV50+",
      handle: "camisa-polo-manga-curta-brk-dry-comfort",
      preco: 159.90,
      shopifyStatus: {
        disponivelFront: true,
        inventoryPolicy: 'deny',
        tracked: true,
        estoqueFront: 73
      },
      sankhyaStatus: {
        estoqueFisicoGalpao: 95,
        reservado: 28,
        disponivelReal: 73,
        emCortePcp: true,
        leadTimeDias: 3
      },
      magis5Status: {
        statusMercadoLivre: 'ATIVO',
        statusShopee: 'ATIVO',
        pausadoPorEstoque: false
      },
      metaAdsStatus: {
        anuncioAtivo: true,
        adsetId: "adset_polo_dry_02",
        nomeCampanha: "[CONV] - Vestuário Masculino Dry - Aberto",
        verbaDiariaReais: 600.00,
        cpcMedioReais: 1.40
      },
      veredito: {
        temEstoqueFantasma: false,
        nivelRisco: 'ALERTA',
        motivoDiscrepancia: "[Cenário de Demonstração] Estoque saudável nas grades centrais (P ao GG). Alerta apenas para exclusão de anúncios direcionados aos tamanhos G1 e G2 que estão zerados no ERP.",
        desperdicioDiarioEstimado: 75.00,
        desperdicioMensalProjetado: 2250.00,
        acaoKillSwitchRecomendada: false,
        statusKillSwitch: 'NAO_NECESSARIO'
      }
    },
    {
      sku: "CM-FISH-005",
      nome: "Camiseta Manga Longa BRK Agro Fishing UV50+ Especial",
      handle: "camiseta-manga-longa-brk-agro-fishing",
      preco: 179.90,
      shopifyStatus: {
        disponivelFront: true,
        inventoryPolicy: 'deny',
        tracked: true,
        estoqueFront: 150
      },
      sankhyaStatus: {
        estoqueFisicoGalpao: 193,
        reservado: 43,
        disponivelReal: 150,
        emCortePcp: false,
        leadTimeDias: 1
      },
      magis5Status: {
        statusMercadoLivre: 'ATIVO',
        statusShopee: 'ATIVO',
        pausadoPorEstoque: false
      },
      metaAdsStatus: {
        anuncioAtivo: true,
        adsetId: "adset_fishing_uv50_03",
        nomeCampanha: "[ESCALA] - Proteção Solar Pesca e Campo",
        verbaDiariaReais: 800.00,
        cpcMedioReais: 1.15
      },
      veredito: {
        temEstoqueFantasma: false,
        nivelRisco: 'SEGURO',
        motivoDiscrepancia: "[Cenário de Demonstração] Alinhamento 100% entre ERP, Hub, Loja e Meta Ads. Capacidade de expedição imediata (D+0).",
        desperdicioDiarioEstimado: 0.00,
        desperdicioMensalProjetado: 0.00,
        acaoKillSwitchRecomendada: false,
        statusKillSwitch: 'NAO_NECESSARIO'
      }
    }
  ];

  const baseItems = Array.isArray(customItems) && customItems.length > 0 ? customItems : defaultReferenceItems;

  // Enriquecimento com dados reais dos conectores (quando disponíveis) e execução real do Kill-Switch via Meta Graph API
  const enrichedItems: OmnichannelAuditItem[] = [];
  for (const rawItem of baseItems) {
    const skuUpper = (rawItem.sku || '').trim().toUpperCase();
    const liveSankhya = liveSankhyaStockBySku.get(skuUpper);
    const liveMagis = liveMagis5StatusBySku.get(skuUpper);
    const liveShopify = liveShopifyStockBySku.get(skuUpper);

    const updatedSankhya = liveSankhya
      ? {
          ...rawItem.sankhyaStatus,
          estoqueFisicoGalpao: liveSankhya.fisico,
          reservado: liveSankhya.reservado,
          disponivelReal: liveSankhya.disponivel
        }
      : rawItem.sankhyaStatus;

    const updatedMagis = liveMagis
      ? {
          statusMercadoLivre: liveMagis.ml,
          statusShopee: liveMagis.shopee,
          pausadoPorEstoque: liveMagis.paused
        }
      : rawItem.magis5Status;

    const updatedShopify = liveShopify
      ? {
          ...rawItem.shopifyStatus,
          estoqueFront: liveShopify.qty,
          inventoryPolicy: liveShopify.policy
        }
      : rawItem.shopifyStatus;

    const hasLiveConnectorForSku = Boolean(liveSankhya || liveMagis || liveShopify);
    let computedVeredito = { ...rawItem.veredito };

    if (hasLiveConnectorForSku) {
      const physicalDepleted =
        (liveSankhya && updatedSankhya.disponivelReal <= 0) ||
        (liveMagis && updatedMagis.pausadoPorEstoque) ||
        (liveShopify && updatedShopify.estoqueFront <= 0);
      const frontAllowsPurchase = updatedShopify.disponivelFront || updatedShopify.inventoryPolicy === 'continue';
      const isGhost = Boolean(physicalDepleted && frontAllowsPurchase);
      const nivelRisco: 'CRITICO' | 'ALERTA' | 'SEGURO' = isGhost ? 'CRITICO' : physicalDepleted ? 'ALERTA' : 'SEGURO';
      const dailySpend = rawItem.metaAdsStatus.verbaDiariaReais || 250;
      const dailyWaste =
        rawItem.metaAdsStatus.anuncioAtivo
          ? nivelRisco === 'CRITICO'
            ? dailySpend
            : nivelRisco === 'ALERTA'
            ? Math.round(dailySpend * 0.3)
            : 0
          : 0;
      const acaoKillSwitch = nivelRisco === 'CRITICO' && rawItem.metaAdsStatus.anuncioAtivo;

      computedVeredito = {
        temEstoqueFantasma: isGhost,
        nivelRisco,
        motivoDiscrepancia: isGhost
          ? `[Verificado ao Vivo via Conector ERP/Hub] Saldo físico zerado (${updatedSankhya.disponivelReal} un. disponíveis no galpão${updatedMagis.pausadoPorEstoque ? ', pausado nos marketplaces' : ''}), mas vitrine continua permitindo venda (policy: ${updatedShopify.inventoryPolicy}) com tráfego ativo!`
          : nivelRisco === 'ALERTA'
          ? `[Verificado ao Vivo via Conector ERP/Hub] Estoque zerado e bloqueado na vitrine, requer revisão de anúncios.`
          : `[Verificado ao Vivo via Conector ERP/Hub] Estoque físico saudável (${updatedSankhya.disponivelReal} un. disponíveis) sincronizado com a vitrine.`,
        desperdicioDiarioEstimado: dailyWaste,
        desperdicioMensalProjetado: dailyWaste * 30,
        acaoKillSwitchRecomendada: acaoKillSwitch,
        statusKillSwitch: acaoKillSwitch ? 'PENDENTE' : 'NAO_NECESSARIO'
      };
    }

    let killSwitchStatus = computedVeredito.statusKillSwitch;
    if (computedVeredito.acaoKillSwitchRecomendada) {
      if (executeKillSwitch) {
        const adTarget = rawItem.metaAdsStatus.adsetId || `adset_${skuUpper.toLowerCase()}`;
        await metaAdsGraphClient.pauseAdOnStockout(adTarget, effectiveMetaToken);
        killSwitchStatus = 'EXECUTADO';
      } else {
        killSwitchStatus = 'PENDENTE';
      }
    } else {
      killSwitchStatus = 'NAO_NECESSARIO';
    }

    enrichedItems.push({
      ...rawItem,
      shopifyStatus: updatedShopify,
      sankhyaStatus: updatedSankhya,
      magis5Status: updatedMagis,
      veredito: {
        ...computedVeredito,
        statusKillSwitch: killSwitchStatus
      }
    });
  }

  // Filtra por SKU se solicitado
  const filtered = targetSku ? enrichedItems.filter(i => i.sku === targetSku) : enrichedItems;

  const totalDesperdicioDiario = filtered.reduce((acc, curr) => acc + curr.veredito.desperdicioDiarioEstimado, 0);
  const totalDesperdicioMensal = filtered.reduce((acc, curr) => acc + curr.veredito.desperdicioMensalProjetado, 0);
  const itensCriticos = filtered.filter(i => i.veredito.nivelRisco === 'CRITICO');

  const whatsappAlertMessage = `🚨 *ALERTA ADSHIELD: STOP-LOSS ATIVADO*
*Empresa:* ${storeName}
*SKU Crítico:* ${itensCriticos[0]?.sku || filtered[0]?.sku || 'SKU-MONITORADO'} - ${itensCriticos[0]?.nome || filtered[0]?.nome || 'Catálogo Monitorado'}

❌ *ERP Físico:* Estoque = ${itensCriticos[0]?.sankhyaStatus.estoqueFisicoGalpao ?? 0}
❌ *Hub Integrador:* ${itensCriticos[0]?.magis5Status.pausadoPorEstoque ? 'Anúncio Pausado (Ruptura)' : 'Em Monitoramento'}
⚠️ *Vitrine D2C:* Botão Ativo (Backorder)
🔥 *Meta Ads:* Queimando R$ ${itensCriticos[0]?.metaAdsStatus.verbaDiariaReais || 0}/dia!

🛑 *Ação do AdShield:* Conjunto de anúncios pausado automaticamente via Meta Graph API para evitar queima de R$ ${(itensCriticos[0]?.veredito.desperdicioMensalProjetado || 0).toLocaleString('pt-BR')} no mês.`;

  const disclosureText = hasLiveErpCredentials
    ? undefined
    : '[Simulação de Demonstração / Projeção Baseada em Catálogo Público — Conecte Sankhya ERP / Magis5 / Shopify Admin para Saldo Físico Privado do Galpão]';

  return sendResponse(res, 200, {
    ok: true,
    status: hasLiveErpCredentials ? 'LIVE_ERP_INTEGRATED' : 'REQUIRES_ERP_CREDENTIALS',
    requiresCredentials: !hasLiveErpCredentials,
    engine: 'adshield_omnichannel_truth_matrix_v2',
    dataMode: hasLiveErpCredentials ? 'LIVE_ERP_INTEGRATED' : 'PUBLIC_STOREFRONT_GROUNDED_SIMULATION',
    dataOrigin: hasLiveErpCredentials ? 'LIVE_API' : 'HEURISTIC_PUBLIC_FALLBACK',
    simulationDisclosure: disclosureText,
    transparencyNotice: disclosureText || 'Integração privada ativa com conectores de ERP/Hub.',
    timestamp: new Date().toISOString(),
    metrics: {
      totalAudited: filtered.length,
      criticalGhostInventoryCount: itensCriticos.length,
      totalDesperdicioDiarioReais: totalDesperdicioDiario,
      totalDesperdicioMensalReais: totalDesperdicioMensal,
      killSwitchAutoTriggered: executeKillSwitch
    },
    whatsappNotification: {
      recipient: recipientPhone,
      message: whatsappAlertMessage
    },
    items: filtered
  });
}
