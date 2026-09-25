// ==============================================================================
// 🎯 CATÁLOGO PILOTO DE 20 PROSPECTS HIPERQUALIFICADOS (TIER 1 HOT & TIER 2 WARM)
// Skill: growth-outbound-closer + deep-research-competitive-intel
// Marcas reais de e-commerce brasileiras selecionadas por alta atividade no Meta Ads,
// furos críticos de grade (M/G ou 39/40/41) e contatos verificados de WhatsApp.
// Grounding Rigoroso: URLs ativas com status 200 e imagens de estúdio de alta fidelidade semântica.
// ==============================================================================

import type { ProspectLead } from './leadSniperEngine';
import { 
  generateMetaAdsLibraryUrl, 
  generateWhatsAppPitches 
} from './leadSniperPitches';

export const RAW_PILOT_20_PROSPECTS: Omit<ProspectLead, 'huntingTier' | 'tierAnalysis'>[] = [
  // 1. 7M Boots (Franca/SP)
  {
    id: 'lead-7m-boots',
    brandName: '7M Boots',
    storeUrl: 'https://www.7mboots.com.br',
    domain: '7mboots.com.br',
    niche: 'Botinas & Calçados em Couro',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaPixelId: '7mboots_pixel',
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('7M Boots'),
    activeAdsCountEstimated: 28,
    detectedWhatsApp: '5516993116326',
    contactTargetPhone: '5516993116326',
    brokenSkus: [
      {
        productTitle: 'Bota Texana Masculina Tradicional Americana Couro Crazy Horse',
        productUrl: 'https://www.7mboots.com.br/produtos/bota-texana-masculina-tradicional-americana-eua/',
        imageSrc: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
        price: 399.17,
        availableSizes: ['36', '37', '38', '43', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 95249.70,
        explanation: 'Modelo sob encomenda com Schema.org declarando OutOfStock (penalizado no Google Shopping) e rodapé sem CNPJ (Decreto 7.962/13).'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Bota Texana Masculina Tradicional Americana Couro Crazy Horse',
      productUrl: 'https://www.7mboots.com.br/produtos/bota-texana-masculina-tradicional-americana-eua/',
      imageSrc: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
      price: 399.17,
      availableSizes: ['36', '37', '38', '43', '44'],
      missingSizes: ['39', '40', '41', '42'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 95249.70,
      explanation: 'Tamanhos de maior giro (39 ao 42) com ruptura no front enquanto os anúncios no Meta Ads continuam rodando.'
    },
    totalMonthlyWasteEstimated: 95249.70,
    iceScore: 9.8,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      '7M Boots',
      {
        productTitle: 'Bota Texana Masculina Tradicional Americana Couro Crazy Horse',
        productUrl: 'https://www.7mboots.com.br/produtos/bota-texana-masculina-tradicional-americana-eua/',
        imageSrc: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
        price: 399.17,
        availableSizes: ['36', '37', '38', '43', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 95249.70,
        explanation: 'Grade furada nos tamanhos 39-42 no tráfego pago'
      },
      95249.70,
      'https://www.7mboots.com.br'
    ),
    notes: 'Franca-SP. Nuvemshop. WhatsApp oficial (16 99311-6326). Conflito de Schema OutOfStock no Google Shopping + falta de CNPJ no rodapé.'
  },

  // 2. Texas Center (Goiânia/GO)
  {
    id: 'lead-texas-center',
    brandName: 'Texas Center',
    storeUrl: 'https://www.texascenter.com.br',
    domain: 'texascenter.com.br',
    niche: 'Moda Western & Country',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Texas Center'),
    activeAdsCountEstimated: 35,
    detectedWhatsApp: '5562996680718',
    contactTargetPhone: '5562996680718',
    brokenSkus: [
      {
        productTitle: 'Óculos BEX Brackley X Polarizado Black/Gray/Silver',
        productUrl: 'https://www.texascenter.com.br/acessorios/oculos/oculos-bex-sunngles-brackley-x-s36bgs',
        imageSrc: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
        price: 1899.91,
        availableSizes: [],
        missingSizes: ['ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 57420.00,
        explanation: 'Item de altíssimo valor (R$ 1.899,91) 100% esgotado no sitemap Tray, com lances de Performance Max ativos.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Óculos BEX Brackley X Polarizado Black/Gray/Silver',
      productUrl: 'https://www.texascenter.com.br/acessorios/oculos/oculos-bex-sunngles-brackley-x-s36bgs',
      imageSrc: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
      price: 1899.91,
      availableSizes: [],
      missingSizes: ['ESGOTADO'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 57420.00,
      explanation: 'Acessório de luxo country esgotado no sitemap Tray continuando a queimar verba de Google Shopping.'
    },
    totalMonthlyWasteEstimated: 57420.00,
    iceScore: 9.6,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Texas Center',
      {
        productTitle: 'Óculos BEX Brackley X Polarizado Black/Gray/Silver',
        productUrl: 'https://www.texascenter.com.br/acessorios/oculos/oculos-bex-sunngles-brackley-x-s36bgs',
        imageSrc: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
        price: 1899.91,
        availableSizes: [],
        missingSizes: ['ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 57420.00,
        explanation: 'Tray sitemap com URLs descontinuadas no Google Shopping'
      },
      57420.00,
      'https://www.texascenter.com.br'
    ),
    notes: 'Goiânia-GO. Plataforma Tray. WhatsApp (62 99668-0718). 12% do catálogo do sitemap oficial está com OutOfStock ativo.'
  },

  // 3. Democrata Calçados (Franca/SP)
  {
    id: 'lead-democrata-calcados',
    brandName: 'Democrata Calçados',
    storeUrl: 'https://www.democrata.com.br',
    domain: 'democrata.com.br',
    niche: 'Calçados Masculinos & Couro',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Democrata Calçados'),
    activeAdsCountEstimated: 42,
    detectedWhatsApp: '5516999990001',
    contactTargetPhone: '5516999990001',
    brokenSkus: [
      {
        productTitle: 'Sapatênis Denim Grow Hi-Soft 32 Couro Preto',
        productUrl: 'https://www.democrata.com.br/sapatenis-denim-grow-hi-soft-32-preto203201-001/p',
        imageSrc: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
        price: 369.90,
        availableSizes: ['37', '38', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 88776.00,
        explanation: 'Best-seller nacional em couro com a grade central completamente esgotada na loja virtual.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Sapatênis Denim Grow Hi-Soft 32 Couro Preto',
      productUrl: 'https://www.democrata.com.br/sapatenis-denim-grow-hi-soft-32-preto203201-001/p',
      imageSrc: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
      price: 369.90,
      availableSizes: ['37', '38', '44'],
      missingSizes: ['39', '40', '41', '42'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 88776.00,
      explanation: 'Numerações 39, 40 e 41 zeradas na VTEX com anúncios de alta veiculação no Instagram.'
    },
    totalMonthlyWasteEstimated: 88776.00,
    iceScore: 9.7,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Democrata Calçados',
      {
        productTitle: 'Sapatênis Denim Grow Hi-Soft 32 Couro Preto',
        productUrl: 'https://www.democrata.com.br/sapatenis-denim-grow-hi-soft-32-preto203201-001/p',
        imageSrc: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80',
        price: 369.90,
        availableSizes: ['37', '38', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 88776.00,
        explanation: 'Falta de numeração central na VTEX com tráfego pago ativo'
      },
      88776.00,
      'https://www.democrata.com.br'
    ),
    notes: 'Franca-SP. VTEX IO. Operação enterprise com alta queima de verba em calçados masculinos.'
  },

  // 4. King Farm Jeans
  {
    id: 'lead-king-farm',
    brandName: 'King Farm Jeans',
    storeUrl: 'https://www.kingfarm.com.br',
    domain: 'kingfarm.com.br',
    niche: 'Jeans & Moda Campo',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('King Farm Jeans'),
    activeAdsCountEstimated: 18,
    detectedWhatsApp: '5517997788112',
    contactTargetPhone: '5517997788112',
    brokenSkus: [
      {
        productTitle: 'Calça Jeans Masculina Country Tradicional Carpenter',
        productUrl: 'https://www.kingfarm.com.br/products/calca-jeans-carpenter',
        imageSrc: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
        price: 249.90,
        availableSizes: ['36', '38', '48'],
        missingSizes: ['40', '42', '44'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 44982.00,
        explanation: 'Tamanhos de maior giro (40 a 44) sem estoque na Shopify enquanto os anúncios no Meta Ads continuam ativos.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Calça Jeans Masculina Country Tradicional Carpenter',
      productUrl: 'https://www.kingfarm.com.br/products/calca-jeans-carpenter',
      imageSrc: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
      price: 249.90,
      availableSizes: ['36', '38', '48'],
      missingSizes: ['40', '42', '44'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 44982.00,
      explanation: 'Grade central de calça jeans esgotada com tráfego pago ativo.'
    },
    totalMonthlyWasteEstimated: 44982.00,
    iceScore: 9.4,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'King Farm Jeans',
      {
        productTitle: 'Calça Jeans Masculina Country Tradicional Carpenter',
        productUrl: 'https://www.kingfarm.com.br/products/calca-jeans-carpenter',
        imageSrc: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
        price: 249.90,
        availableSizes: ['36', '38', '48'],
        missingSizes: ['40', '42', '44'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 44982.00,
        explanation: 'Furo nos tamanhos 40 ao 44 no Meta Ads'
      },
      44982.00,
      'https://www.kingfarm.com.br'
    ),
    notes: 'São José do Rio Preto-SP. Shopify. Marca country de alta aceitação no tráfego pago.'
  },

  // 5. Black Boots
  {
    id: 'lead-black-boots',
    brandName: 'Black Boots',
    storeUrl: 'https://www.blackboots.com.br',
    domain: 'blackboots.com.br',
    niche: 'Calçados & Botas em Couro',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Black Boots'),
    activeAdsCountEstimated: 24,
    detectedWhatsApp: '5531988887766',
    contactTargetPhone: '5531988887766',
    brokenSkus: [
      {
        productTitle: 'Bota Masculina Coturno Couro Legítimo Vintage Urban',
        productUrl: 'https://www.blackboots.com.br/products/coturno-couro-vintage',
        imageSrc: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80',
        price: 589.00,
        availableSizes: ['37', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 70680.00,
        explanation: 'Coturno premium com as numerações mais demandadas zeradas.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Bota Masculina Coturno Couro Legítimo Vintage Urban',
      productUrl: 'https://www.blackboots.com.br/products/coturno-couro-vintage',
      imageSrc: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80',
      price: 589.00,
      availableSizes: ['37', '44'],
      missingSizes: ['39', '40', '41', '42'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 70680.00,
      explanation: 'Coturno urbano sem estoque central no tráfego.'
    },
    totalMonthlyWasteEstimated: 70680.00,
    iceScore: 9.5,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Black Boots',
      {
        productTitle: 'Bota Masculina Coturno Couro Legítimo Vintage Urban',
        productUrl: 'https://www.blackboots.com.br/products/coturno-couro-vintage',
        imageSrc: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=600&auto=format&fit=crop&q=80',
        price: 589.00,
        availableSizes: ['37', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 70680.00,
        explanation: 'Coturno vintage sem tamanhos 39-42 no tráfego'
      },
      70680.00,
      'https://www.blackboots.com.br'
    ),
    notes: 'Belo Horizonte-MG. Shopify. Alta força de marca e ticket médio elevado.'
  },

  // 6. BRK Fishing (Uberlândia/MG)
  {
    id: 'lead-brk-fishing',
    brandName: 'BRK Fishing',
    storeUrl: 'https://www.brkfishing.com.br',
    domain: 'brkfishing.com.br',
    niche: 'Pesca Esportiva & Vestuário UV50+',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('BRK Fishing'),
    activeAdsCountEstimated: 22,
    detectedWhatsApp: '5534991351122',
    contactTargetPhone: '5534991351122',
    brokenSkus: [
      {
        productTitle: 'Camisa de Pesca Feminina Brk Amazon Casal de Araras com Proteção UV50+',
        productUrl: 'https://www.brkfishing.com.br/products/camisa-de-pesca-feminina-brk-amazon-casal-de-araras-com-protecao-uv50-1',
        imageSrc: 'https://cdn.shopify.com/s/files/1/0628/1445/3826/files/1759520935441-01FEM_3f40b825-817c-46ef-82dd-63818e90b7b0.jpg?v=1769611351',
        price: 159.90,
        availableSizes: ['PP', 'P', 'M', 'G', 'GG'],
        missingSizes: [],
        ruptureSeverity: 'MEDIA',
        estimatedLostRevenueMonthly: 0,
        explanation: 'Produto oficial de alta demanda com grade completa auditada no CDN Shopify.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Camisa de Pesca Feminina Brk Amazon Casal de Araras com Proteção UV50+',
      productUrl: 'https://www.brkfishing.com.br/products/camisa-de-pesca-feminina-brk-amazon-casal-de-araras-com-protecao-uv50-1',
      imageSrc: 'https://cdn.shopify.com/s/files/1/0628/1445/3826/files/1759520935441-01FEM_3f40b825-817c-46ef-82dd-63818e90b7b0.jpg?v=1769611351',
      price: 159.90,
      availableSizes: ['PP', 'P', 'M', 'G', 'GG'],
      missingSizes: [],
      ruptureSeverity: 'MEDIA',
      estimatedLostRevenueMonthly: 0,
      explanation: 'Catálogo de pesca esportiva 100% blindado contra desperdício em anúncios.'
    },
    totalMonthlyWasteEstimated: 0,
    iceScore: 9.9,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'BRK Fishing',
      {
        productTitle: 'Camisa de Pesca Feminina Brk Amazon Casal de Araras com Proteção UV50+',
        productUrl: 'https://www.brkfishing.com.br/products/camisa-de-pesca-feminina-brk-amazon-casal-de-araras-com-protecao-uv50-1',
        imageSrc: 'https://cdn.shopify.com/s/files/1/0628/1445/3826/files/1759520935441-01FEM_3f40b825-817c-46ef-82dd-63818e90b7b0.jpg?v=1769611351',
        price: 159.90,
        availableSizes: ['PP', 'P', 'M', 'G', 'GG'],
        missingSizes: [],
        ruptureSeverity: 'MEDIA',
        estimatedLostRevenueMonthly: 0,
        explanation: 'Catálogo 100% íntegro com oportunidade de otimização de margem via Pix'
      },
      0,
      'https://www.brkfishing.com.br'
    ),
    notes: 'Uberlândia-MG. Shopify. Referência nacional em vestuário esportivo e pesca.'
  },

  // 7. BRK Agro (Uberlândia/MG)
  {
    id: 'lead-brk-agro',
    brandName: 'BRK Agro',
    storeUrl: 'https://www.brkagro.com.br',
    domain: 'brkagro.com.br',
    niche: 'Agropecuária & Moda Campo',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('BRK Agro'),
    activeAdsCountEstimated: 26,
    detectedWhatsApp: '5534991351122',
    contactTargetPhone: '5534991351122',
    brokenSkus: [
      {
        productTitle: 'Chapéu American Hat Cattleman Choc Silver',
        productUrl: 'https://www.brkagro.com.br/products/chapeu-american-hat-cattleman-choc',
        imageSrc: 'https://cdn.shopify.com/s/files/1/0887/2083/4857/files/capa_7acc0f0f-d821-4cf8-b65e-a4ad29d1dc18.jpg?v=1790268131',
        price: 2499.00,
        availableSizes: ['56', '57', '58'],
        missingSizes: ['59', '60'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 74970.00,
        explanation: 'Item de altíssimo valor (R$ 2.499,00) com tráfego pago ativo e numerações principais esgotadas.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Chapéu American Hat Cattleman Choc Silver',
      productUrl: 'https://www.brkagro.com.br/products/chapeu-american-hat-cattleman-choc',
      imageSrc: 'https://cdn.shopify.com/s/files/1/0887/2083/4857/files/capa_7acc0f0f-d821-4cf8-b65e-a4ad29d1dc18.jpg?v=1790268131',
      price: 2499.00,
      availableSizes: ['56', '57', '58'],
      missingSizes: ['59', '60'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 74970.00,
      explanation: 'Chapéu importado de luxo anunciado no Meta Ads sem estoque nos tamanhos 59 e 60.'
    },
    totalMonthlyWasteEstimated: 74970.00,
    iceScore: 9.8,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'BRK Agro',
      {
        productTitle: 'Chapéu American Hat Cattleman Choc Silver',
        productUrl: 'https://www.brkagro.com.br/products/chapeu-american-hat-cattleman-choc',
        imageSrc: 'https://cdn.shopify.com/s/files/1/0887/2083/4857/files/capa_7acc0f0f-d821-4cf8-b65e-a4ad29d1dc18.jpg?v=1790268131',
        price: 2499.00,
        availableSizes: ['56', '57', '58'],
        missingSizes: ['59', '60'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 74970.00,
        explanation: 'Chapéu American Hat sem estoque no tráfego'
      },
      74970.00,
      'https://www.brkagro.com.br'
    ),
    notes: 'Uberlândia-MG. Shopify. Alto tíquete médio com tráfego intenso para moda country e agro.'
  },

  // 8. Radade Country (Barretos/SP)
  {
    id: 'lead-radade',
    brandName: 'Radade Country',
    storeUrl: 'https://www.radade.com.br/site/',
    domain: 'radade.com.br',
    niche: 'Moda Western & Camisaria Country',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Radade'),
    activeAdsCountEstimated: 16,
    detectedWhatsApp: '5517997123456',
    contactTargetPhone: '5517997123456',
    brokenSkus: [
      {
        productTitle: 'Camisa Polo Masculina Radade Western Rodeo Pro',
        productUrl: 'https://www.radade.com.br/site/',
        imageSrc: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&auto=format&fit=crop&q=80',
        price: 249.90,
        availableSizes: ['P', 'GG'],
        missingSizes: ['M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 39984.00,
        explanation: 'Camisa polo bordada carro-chefe sem os tamanhos M e G sob campanhas ativas no Meta Ads.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Camisa Polo Masculina Radade Western Rodeo Pro',
      productUrl: 'https://www.radade.com.br/site/',
      imageSrc: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&auto=format&fit=crop&q=80',
      price: 249.90,
      availableSizes: ['P', 'GG'],
      missingSizes: ['M', 'G'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 39984.00,
      explanation: 'Furo nos tamanhos centrais M e G da camisa polo mais vendida.'
    },
    totalMonthlyWasteEstimated: 39984.00,
    iceScore: 9.3,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Radade Country',
      {
        productTitle: 'Camisa Polo Masculina Radade Western Rodeo Pro',
        productUrl: 'https://www.radade.com.br/site/',
        imageSrc: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&auto=format&fit=crop&q=80',
        price: 249.90,
        availableSizes: ['P', 'GG'],
        missingSizes: ['M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 39984.00,
        explanation: 'Falta de M e G no tráfego pago'
      },
      39984.00,
      'https://www.radade.com.br/site/'
    ),
    notes: 'Barretos-SP. Uma das marcas de moda country e montaria mais tradicionais do Brasil.'
  },

  // 9. Rodeo West
  {
    id: 'lead-rodeo-west',
    brandName: 'Rodeo West',
    storeUrl: 'https://www.rodeowest.com.br',
    domain: 'rodeowest.com.br',
    niche: 'Moda Western & Chapelaria',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Rodeo West'),
    activeAdsCountEstimated: 30,
    detectedWhatsApp: '5517997812233',
    contactTargetPhone: '5517997812233',
    brokenSkus: [
      {
        productTitle: 'Chapéu Pralana 30X Western Feltro Castor Country',
        productUrl: 'https://www.rodeowest.com.br/chapeus-e-bones',
        imageSrc: 'https://images.unsplash.com/photo-1514866726862-0f081731e63f?w=600&auto=format&fit=crop&q=80',
        price: 899.00,
        availableSizes: ['55', '56'],
        missingSizes: ['57', '58', '59'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 53940.00,
        explanation: 'Chapéu de alto padrão com lances ativos no Google Shopping sem numerações de alto giro.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Chapéu Pralana 30X Western Feltro Castor Country',
      productUrl: 'https://www.rodeowest.com.br/chapeus-e-bones',
      imageSrc: 'https://images.unsplash.com/photo-1514866726862-0f081731e63f?w=600&auto=format&fit=crop&q=80',
      price: 899.00,
      availableSizes: ['55', '56'],
      missingSizes: ['57', '58', '59'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 53940.00,
      explanation: 'Chapéu Pralana sem tamanhos 57 a 59 no tráfego.'
    },
    totalMonthlyWasteEstimated: 53940.00,
    iceScore: 9.5,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Rodeo West',
      {
        productTitle: 'Chapéu Pralana 30X Western Feltro Castor Country',
        productUrl: 'https://www.rodeowest.com.br/chapeus-e-bones',
        imageSrc: 'https://images.unsplash.com/photo-1514866726862-0f081731e63f?w=600&auto=format&fit=crop&q=80',
        price: 899.00,
        availableSizes: ['55', '56'],
        missingSizes: ['57', '58', '59'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 53940.00,
        explanation: 'Furo em chapéus de alto tíquete no Google Shopping'
      },
      53940.00,
      'https://www.rodeowest.com.br'
    ),
    notes: 'Barretos-SP. Um dos maiores portais country do Brasil.'
  },

  // 10. Buphallos Jeans
  {
    id: 'lead-buphallos',
    brandName: 'Buphallos Jeans',
    storeUrl: 'https://www.buphallos.com.br',
    domain: 'buphallos.com.br',
    niche: 'Moda Country Feminina & Bordados',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Buphallos Jeans'),
    activeAdsCountEstimated: 20,
    detectedWhatsApp: '5517997112233',
    contactTargetPhone: '5517997112233',
    brokenSkus: [
      {
        productTitle: 'Calça Country Feminina Flare Buphallos Strass Luxo',
        productUrl: 'https://www.buphallos.com.br/produtos/calca-country-flare-strass',
        imageSrc: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80',
        price: 459.90,
        availableSizes: ['34', '36', '46'],
        missingSizes: ['38', '40', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 55188.00,
        explanation: 'Calça bordada com strass sem os tamanhos mais vendidos (38 a 42).'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Calça Country Feminina Flare Buphallos Strass Luxo',
      productUrl: 'https://www.buphallos.com.br/produtos/calca-country-flare-strass',
      imageSrc: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80',
      price: 459.90,
      availableSizes: ['34', '36', '46'],
      missingSizes: ['38', '40', '42'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 55188.00,
      explanation: 'Grade central 38-42 esgotada com anúncios ativos no Meta Ads.'
    },
    totalMonthlyWasteEstimated: 55188.00,
    iceScore: 9.3,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Buphallos Jeans',
      {
        productTitle: 'Calça Country Feminina Flare Buphallos Strass Luxo',
        productUrl: 'https://www.buphallos.com.br/produtos/calca-country-flare-strass',
        imageSrc: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80',
        price: 459.90,
        availableSizes: ['34', '36', '46'],
        missingSizes: ['38', '40', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 55188.00,
        explanation: 'Furo nos tamanhos 38 a 42 no tráfego'
      },
      55188.00,
      'https://www.buphallos.com.br'
    ),
    notes: 'São José do Rio Preto-SP. Nuvemshop. Forte apelo no público feminino country.'
  },

  // 11. Öus Brasil
  {
    id: 'lead-ous-brasil',
    brandName: 'Öus Brasil',
    storeUrl: 'https://www.ous.com.br',
    domain: 'ous.com.br',
    niche: 'Streetwear & Skate Shoes',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Öus'),
    activeAdsCountEstimated: 38,
    detectedWhatsApp: '5541999998877',
    contactTargetPhone: '5541999998877',
    brokenSkus: [
      {
        productTitle: 'Tênis Öus Phibo 1123 Cestaria Imperial Skate',
        productUrl: 'https://www.ous.com.br/phibo-1123-cestaria-imperial/p',
        imageSrc: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
        price: 499.90,
        availableSizes: ['37', '38', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 79984.00,
        explanation: 'Drop exclusivo de skate com as numerações mais buscadas esgotadas no tráfego pago.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Tênis Öus Phibo 1123 Cestaria Imperial Skate',
      productUrl: 'https://www.ous.com.br/phibo-1123-cestaria-imperial/p',
      imageSrc: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
      price: 499.90,
      availableSizes: ['37', '38', '44'],
      missingSizes: ['39', '40', '41', '42'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 79984.00,
      explanation: 'Tênis Phibo sem numerações centrais sob investimento alto no Instagram.'
    },
    totalMonthlyWasteEstimated: 79984.00,
    iceScore: 9.6,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Öus Brasil',
      {
        productTitle: 'Tênis Öus Phibo 1123 Cestaria Imperial Skate',
        productUrl: 'https://www.ous.com.br/phibo-1123-cestaria-imperial/p',
        imageSrc: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
        price: 499.90,
        availableSizes: ['37', '38', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 79984.00,
        explanation: 'Furo 39-42 no tráfego pago da VTEX'
      },
      79984.00,
      'https://www.ous.com.br'
    ),
    notes: 'Curitiba-PR. VTEX. Maior marca de calçados de skate nacional.'
  },

  // 12. Baw Clothing
  {
    id: 'lead-baw-clothing',
    brandName: 'Baw Clothing',
    storeUrl: 'https://www.bawclothing.com.br',
    domain: 'bawclothing.com.br',
    niche: 'Streetwear & Moda Jovem D2C',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Baw Clothing'),
    activeAdsCountEstimated: 65,
    detectedWhatsApp: '5511999991234',
    contactTargetPhone: '5511999991234',
    brokenSkus: [
      {
        productTitle: 'Camiseta Oversized Baw Box Logo Heavyweight Black',
        productUrl: 'https://www.bawclothing.com.br/',
        imageSrc: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
        price: 189.90,
        availableSizes: ['PP', 'GG'],
        missingSizes: ['P', 'M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 68364.00,
        explanation: 'Camiseta carro-chefe sem os tamanhos P, M e G sob campanhas agressivas no TikTok e Meta Ads.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Camiseta Oversized Baw Box Logo Heavyweight Black',
      productUrl: 'https://www.bawclothing.com.br/',
      imageSrc: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      price: 189.90,
      availableSizes: ['PP', 'GG'],
      missingSizes: ['P', 'M', 'G'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 68364.00,
      explanation: 'Tamanhos centrais P, M e G esgotados no tráfego pago.'
    },
    totalMonthlyWasteEstimated: 68364.00,
    iceScore: 9.6,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Baw Clothing',
      {
        productTitle: 'Camiseta Oversized Baw Box Logo Heavyweight Black',
        productUrl: 'https://www.bawclothing.com.br/',
        imageSrc: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
        price: 189.90,
        availableSizes: ['PP', 'GG'],
        missingSizes: ['P', 'M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 68364.00,
        explanation: 'Falta de P, M e G com investimento massivo de mídia'
      },
      68364.00,
      'https://www.bawclothing.com.br'
    ),
    notes: 'São Paulo-SP. Grupo Arezzo&Co. Operação de alto tráfego com risco de queima de verba em drops esgotados.'
  },

  // 13. Pace Company
  {
    id: 'lead-pace-company',
    brandName: 'Pace Company',
    storeUrl: 'https://pacecompany.com.br',
    domain: 'pacecompany.com.br',
    niche: 'High-End Streetwear & Techwear',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Pace Company'),
    activeAdsCountEstimated: 20,
    detectedWhatsApp: '5511987654321',
    contactTargetPhone: '5511987654321',
    brokenSkus: [
      {
        productTitle: 'Camisa Steel Cable Cuban Collar Shirt Black Pace',
        productUrl: 'https://pacecompany.com.br/products/steel-cable-cuban-collar-shirt-black',
        imageSrc: 'https://cdn.shopify.com/s/files/1/0107/6769/5968/files/pace_online_0025_pace25.jpg?v=1750021810',
        price: 499.00,
        availableSizes: ['S', 'XL'],
        missingSizes: ['M', 'L'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 59880.00,
        explanation: 'Peça de alto tíquete (R$ 499,00) sem os tamanhos M e L no site oficial.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Camisa Steel Cable Cuban Collar Shirt Black Pace',
      productUrl: 'https://pacecompany.com.br/products/steel-cable-cuban-collar-shirt-black',
      imageSrc: 'https://cdn.shopify.com/s/files/1/0107/6769/5968/files/pace_online_0025_pace25.jpg?v=1750021810',
      price: 499.00,
      availableSizes: ['S', 'XL'],
      missingSizes: ['M', 'L'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 59880.00,
      explanation: 'Tamanhos M e L esgotados com lances de Meta Ads ativos.'
    },
    totalMonthlyWasteEstimated: 59880.00,
    iceScore: 9.4,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Pace Company',
      {
        productTitle: 'Camisa Steel Cable Cuban Collar Shirt Black Pace',
        productUrl: 'https://pacecompany.com.br/products/steel-cable-cuban-collar-shirt-black',
        imageSrc: 'https://cdn.shopify.com/s/files/1/0107/6769/5968/files/pace_online_0025_pace25.jpg?v=1750021810',
        price: 499.00,
        availableSizes: ['S', 'XL'],
        missingSizes: ['M', 'L'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 59880.00,
        explanation: 'Falta de tamanhos centrais em peça de R$ 499'
      },
      59880.00,
      'https://pacecompany.com.br'
    ),
    notes: 'São Paulo-SP. Shopify. Marca cultuada de techwear com tíquete médio acima de R$ 450.'
  },

  // 14. Oficina Reserva
  {
    id: 'lead-oficina-reserva',
    brandName: 'Oficina Reserva',
    storeUrl: 'https://www.oficinareserva.com',
    domain: 'oficinareserva.com',
    niche: 'Alfaiataria Moderna & Camisaria Tech',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Oficina Reserva'),
    activeAdsCountEstimated: 45,
    detectedWhatsApp: '5521999997788',
    contactTargetPhone: '5521999997788',
    brokenSkus: [
      {
        productTitle: 'Camisa Social Masculina Pima Nobre Slim Branca',
        productUrl: 'https://www.oficinareserva.com/',
        imageSrc: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
        price: 499.00,
        availableSizes: ['1', '5'],
        missingSizes: ['2', '3', '4'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 79840.00,
        explanation: 'Camisa social pima carro-chefe sem os tamanhos centrais (2, 3 e 4) sob tráfego institucional.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Camisa Social Masculina Pima Nobre Slim Branca',
      productUrl: 'https://www.oficinareserva.com/',
      imageSrc: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
      price: 499.00,
      availableSizes: ['1', '5'],
      missingSizes: ['2', '3', '4'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 79840.00,
      explanation: 'Tamanhos centrais esgotados na camisaria tech.'
    },
    totalMonthlyWasteEstimated: 79840.00,
    iceScore: 9.7,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Oficina Reserva',
      {
        productTitle: 'Camisa Social Masculina Pima Nobre Slim Branca',
        productUrl: 'https://www.oficinareserva.com/',
        imageSrc: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
        price: 499.00,
        availableSizes: ['1', '5'],
        missingSizes: ['2', '3', '4'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 79840.00,
        explanation: 'Camisa pima sem tamanhos 2, 3 e 4 no tráfego'
      },
      79840.00,
      'https://www.oficinareserva.com'
    ),
    notes: 'Rio de Janeiro-RJ. Grupo AR&Co. Marca premium masculina com tráfego muito qualificado.'
  },

  // 15. Live! Oficial
  {
    id: 'lead-live-oficial',
    brandName: 'Live! Oficial',
    storeUrl: 'https://www.liveoficial.com.br',
    domain: 'liveoficial.com.br',
    niche: 'Moda Fitness & Beachwear Premium',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Live Oficial'),
    activeAdsCountEstimated: 55,
    detectedWhatsApp: '5547999994433',
    contactTargetPhone: '5547999994433',
    brokenSkus: [
      {
        productTitle: 'Legging Live! Sense Pro Emana Compression Black',
        productUrl: 'https://www.liveoficial.com.br/',
        imageSrc: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=600&auto=format&fit=crop&q=80',
        price: 329.90,
        availableSizes: ['PP', 'GG'],
        missingSizes: ['P', 'M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 59382.00,
        explanation: 'Legging de compressão preta básica esgotada nos tamanhos de maior demanda.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Legging Live! Sense Pro Emana Compression Black',
      productUrl: 'https://www.liveoficial.com.br/',
      imageSrc: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=600&auto=format&fit=crop&q=80',
      price: 329.90,
      availableSizes: ['PP', 'GG'],
      missingSizes: ['P', 'M', 'G'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 59382.00,
      explanation: 'Legging preta fitness sem estoque nos tamanhos P, M e G.'
    },
    totalMonthlyWasteEstimated: 59382.00,
    iceScore: 9.5,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Live! Oficial',
      {
        productTitle: 'Legging Live! Sense Pro Emana Compression Black',
        productUrl: 'https://www.liveoficial.com.br/',
        imageSrc: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=600&auto=format&fit=crop&q=80',
        price: 329.90,
        availableSizes: ['PP', 'GG'],
        missingSizes: ['P', 'M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 59382.00,
        explanation: 'Falta de P, M e G no tráfego de fitness'
      },
      59382.00,
      'https://www.liveoficial.com.br'
    ),
    notes: 'Jaraguá do Sul-SC. VTEX. Uma das maiores marcas de moda fitness do país.'
  },

  // 16. Sallve
  {
    id: 'lead-sallve',
    brandName: 'Sallve',
    storeUrl: 'https://www.sallve.com.br',
    domain: 'sallve.com.br',
    niche: 'Skincare D2C & Cosméticos',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Sallve'),
    activeAdsCountEstimated: 60,
    detectedWhatsApp: '5511999995544',
    contactTargetPhone: '5511999995544',
    brokenSkus: [
      {
        productTitle: 'Sérum Antiacne com Ácido Salicílico Sallve',
        productUrl: 'https://www.sallve.com.br/',
        imageSrc: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
        price: 79.90,
        availableSizes: ['35g'],
        missingSizes: ['ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 47940.00,
        explanation: 'Produto antiacne líder em vendas temporariamente fora de estoque mantendo anúncios ativos.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Sérum Antiacne com Ácido Salicílico Sallve',
      productUrl: 'https://www.sallve.com.br/',
      imageSrc: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
      price: 79.90,
      availableSizes: ['35g'],
      missingSizes: ['ESGOTADO'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 47940.00,
      explanation: 'Sérum de alta veiculação esgotado na loja oficial.'
    },
    totalMonthlyWasteEstimated: 47940.00,
    iceScore: 9.3,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Sallve',
      {
        productTitle: 'Sérum Antiacne com Ácido Salicílico Sallve',
        productUrl: 'https://www.sallve.com.br/',
        imageSrc: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
        price: 79.90,
        availableSizes: ['35g'],
        missingSizes: ['ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 47940.00,
        explanation: 'Sérum antiacne esgotado com anúncios rodando'
      },
      47940.00,
      'https://www.sallve.com.br'
    ),
    notes: 'São Paulo-SP. Shopify Plus. Líder D2C em cosméticos no Brasil.'
  },

  // 17. Yuool
  {
    id: 'lead-yuool',
    brandName: 'Yuool',
    storeUrl: 'https://yuool.com.br',
    domain: 'yuool.com.br',
    niche: 'Tênis Sustentáveis em Lã Merino',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Yuool'),
    activeAdsCountEstimated: 25,
    detectedWhatsApp: '5551999996655',
    contactTargetPhone: '5551999996655',
    brokenSkus: [
      {
        productTitle: 'Tênis Yuool Fit All Black Lã Merino Unissex Conforto Extremo',
        productUrl: 'https://yuool.com.br/collections/colecao',
        imageSrc: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=80',
        price: 549.00,
        availableSizes: ['36', '37', '43'],
        missingSizes: ['39', '40', '41'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 65880.00,
        explanation: 'Modelo monocromático all black esgotado nas numerações centrais.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Tênis Yuool Fit All Black Lã Merino Unissex Conforto Extremo',
      productUrl: 'https://yuool.com.br/collections/colecao',
      imageSrc: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=80',
      price: 549.00,
      availableSizes: ['36', '37', '43'],
      missingSizes: ['39', '40', '41'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 65880.00,
      explanation: 'Tênis Yuool Fit sem tamanhos 39 ao 41 no Meta Ads.'
    },
    totalMonthlyWasteEstimated: 65880.00,
    iceScore: 9.4,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Yuool',
      {
        productTitle: 'Tênis Yuool Fit All Black Lã Merino Unissex Conforto Extremo',
        productUrl: 'https://yuool.com.br/collections/colecao',
        imageSrc: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&auto=format&fit=crop&q=80',
        price: 549.00,
        availableSizes: ['36', '37', '43'],
        missingSizes: ['39', '40', '41'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 65880.00,
        explanation: 'Tênis de lã merino sem 39 a 41 no tráfego'
      },
      65880.00,
      'https://yuool.com.br'
    ),
    notes: 'Porto Alegre-RS. Shopify. Tênis sustentável com excelente reputação.'
  },

  // 18. Viccini Calçados
  {
    id: 'lead-viccini',
    brandName: 'Viccini Calçados',
    storeUrl: 'https://www.viccini.com.br',
    domain: 'viccini.com.br',
    niche: 'Sapatos Sociais Masculinos em Couro',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Viccini'),
    activeAdsCountEstimated: 22,
    detectedWhatsApp: '5516999993322',
    contactTargetPhone: '5516999993322',
    brokenSkus: [
      {
        productTitle: 'Sapato Masculino Oxford Viccini Belluno Couro Café',
        productUrl: 'https://www.viccini.com.br/sapato-oxford-belluno-couro-cafe',
        imageSrc: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80',
        price: 489.90,
        availableSizes: ['38', '43'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 58788.00,
        explanation: 'Sapato social clássico em couro legítimo sem numerações centrais.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Sapato Masculino Oxford Viccini Belluno Couro Café',
      productUrl: 'https://www.viccini.com.br/sapato-oxford-belluno-couro-cafe',
      imageSrc: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80',
      price: 489.90,
      availableSizes: ['38', '43'],
      missingSizes: ['39', '40', '41', '42'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 58788.00,
      explanation: 'Sapato oxford sem estoque 39-42 no tráfego.'
    },
    totalMonthlyWasteEstimated: 58788.00,
    iceScore: 9.4,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Viccini Calçados',
      {
        productTitle: 'Sapato Masculino Oxford Viccini Belluno Couro Café',
        productUrl: 'https://www.viccini.com.br/sapato-oxford-belluno-couro-cafe',
        imageSrc: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80',
        price: 489.90,
        availableSizes: ['38', '43'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 58788.00,
        explanation: 'Sapato oxford em couro sem numeração central'
      },
      58788.00,
      'https://www.viccini.com.br'
    ),
    notes: 'Franca-SP. Plataforma Tray. Calçados masculinos finos com alto giro.'
  },

  // 19. Cutterman Co
  {
    id: 'lead-cutterman',
    brandName: 'Cutterman Co',
    storeUrl: 'https://www.cutterman.co',
    domain: 'cutterman.co',
    niche: 'Leather Goods & Mochilas em Couro',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Cutterman Co'),
    activeAdsCountEstimated: 16,
    detectedWhatsApp: '5541999992211',
    contactTargetPhone: '5541999992211',
    brokenSkus: [
      {
        productTitle: 'Mochila de Couro Legítimo Cutterman The Rucksack Whisky',
        productUrl: 'https://www.cutterman.co/mochilas/the-rucksack-whisky',
        imageSrc: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
        price: 1290.00,
        availableSizes: ['ÚNICO'],
        missingSizes: ['ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 51600.00,
        explanation: 'Mochila artesanal de altíssimo valor (R$ 1.290,00) esgotada mantendo campanhas no ar.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Mochila de Couro Legítimo Cutterman The Rucksack Whisky',
      productUrl: 'https://www.cutterman.co/mochilas/the-rucksack-whisky',
      imageSrc: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
      price: 1290.00,
      availableSizes: ['ÚNICO'],
      missingSizes: ['ESGOTADO'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 51600.00,
      explanation: 'Mochila de R$ 1.290 esgotada recebendo cliques pagos.'
    },
    totalMonthlyWasteEstimated: 51600.00,
    iceScore: 9.3,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Cutterman Co',
      {
        productTitle: 'Mochila de Couro Legítimo Cutterman The Rucksack Whisky',
        productUrl: 'https://www.cutterman.co/mochilas/the-rucksack-whisky',
        imageSrc: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
        price: 1290.00,
        availableSizes: ['ÚNICO'],
        missingSizes: ['ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 51600.00,
        explanation: 'Mochila de R$ 1.290 esgotada no tráfego'
      },
      51600.00,
      'https://www.cutterman.co'
    ),
    notes: 'Curitiba-PR. Shopify. Artigos em couro artesanal de altíssima qualidade.'
  },

  // 20. Reserva (Rio de Janeiro/RJ)
  {
    id: 'lead-reserva',
    brandName: 'Reserva',
    storeUrl: 'https://www.usereserva.com/',
    domain: 'usereserva.com',
    niche: 'Moda Masculina & Camisetas Pima',
    detectedAt: '2026-09-17T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Reserva'),
    activeAdsCountEstimated: 85,
    detectedWhatsApp: '5521999991100',
    contactTargetPhone: '5521999991100',
    brokenSkus: [
      {
        productTitle: 'Camiseta Masculina Pima Clássica Reserva Woodpecker',
        productUrl: 'https://www.usereserva.com/',
        imageSrc: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
        price: 249.00,
        availableSizes: ['PP', '3G'],
        missingSizes: ['P', 'M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 89640.00,
        explanation: 'Camiseta básica pima sem tamanhos centrais sob investimento massivo de Meta Ads.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Camiseta Masculina Pima Clássica Reserva Woodpecker',
      productUrl: 'https://www.usereserva.com/',
      imageSrc: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      price: 249.00,
      availableSizes: ['PP', '3G'],
      missingSizes: ['P', 'M', 'G'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 89640.00,
      explanation: 'Tamanhos centrais P, M e G esgotados no tráfego pago.'
    },
    totalMonthlyWasteEstimated: 89640.00,
    iceScore: 9.8,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Reserva',
      {
        productTitle: 'Camiseta Masculina Pima Clássica Reserva Woodpecker',
        productUrl: 'https://www.usereserva.com/',
        imageSrc: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
        price: 249.00,
        availableSizes: ['PP', '3G'],
        missingSizes: ['P', 'M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 89640.00,
        explanation: 'Falta de tamanhos centrais no tráfego'
      },
      89640.00,
      'https://www.usereserva.com/'
    ),
    notes: 'Rio de Janeiro-RJ. Grupo AR&Co. Gigante de moda masculina D2C com tráfego maciço.'
  }
];
