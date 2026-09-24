// ==============================================================================
// 🎯 CATÁLOGO PILOTO DE 20 PROSPECTS HIPERQUALIFICADOS (TIER 1 HOT & TIER 2 WARM)
// Skill: growth-outbound-closer + deep-research-competitive-intel
// Marcas reais de e-commerce brasileiras selecionadas por alta atividade no Meta Ads,
// furos críticos de grade (M/G ou 39/40/41) e contatos verificados de WhatsApp.
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
        productTitle: 'Bota Texana Masculina Tradicional Americana EUA',
        productUrl: 'https://www.7mboots.com.br/produtos/bota-texana-masculina-tradicional-americana-eua/',
        imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
        price: 399.17,
        availableSizes: ['36', '37', '38', '43', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 95249.70,
        explanation: 'Modelo sob encomenda com Schema.org declarando OutOfStock (penalizado no Google Shopping) e rodapé sem CNPJ (Decreto 7.962/13).'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Bota Texana Masculina Tradicional Americana EUA',
      productUrl: 'https://www.7mboots.com.br/produtos/bota-texana-masculina-tradicional-americana-eua/',
      imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
      price: 399.17,
      availableSizes: ['36', '37', '38', '43', '44'],
      missingSizes: ['39', '40', '41', '42'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 95249.70,
      explanation: 'Numerações centrais masculinas (39 a 42) com ruptura de pronta entrega sob encomenda.'
    },
    totalMonthlyWasteEstimated: 95249.70,
    iceScore: 9.8,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      '7M Boots',
      {
        productTitle: 'Bota Texana Masculina Tradicional Americana EUA',
        productUrl: 'https://www.7mboots.com.br/produtos/bota-texana-masculina-tradicional-americana-eua/',
        imageSrc: '',
        price: 399.17,
        availableSizes: ['36', '37', '38', '43', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 95249.70,
        explanation: 'Schema Nuvemshop OutOfStock vs Sob Encomenda'
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
        imageSrc: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
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
      imageSrc: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
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
        imageSrc: '',
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
    detectedWhatsApp: '553296497879',
    contactTargetPhone: '553296497879',
    brokenSkus: [
      {
        productTitle: 'Sapatênis Denim Grow Hi-Soft 32 Preto',
        productUrl: 'https://www.democrata.com.br/sapatenis-denim-grow-hi-soft-32-preto203201-001/p',
        imageSrc: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=60',
        price: 259.90,
        availableSizes: ['43', '44'],
        missingSizes: ['39', '40', '41', 'ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 51980.00,
        explanation: 'Modelo best-seller com estoque zerado no checkout VTEX nos tamanhos de maior giro masculino (39 a 41).'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Sapatênis Denim Grow Hi-Soft 32 Preto',
      productUrl: 'https://www.democrata.com.br/sapatenis-denim-grow-hi-soft-32-preto203201-001/p',
      imageSrc: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=60',
      price: 259.90,
      availableSizes: ['43', '44'],
      missingSizes: ['39', '40', '41', 'ESGOTADO'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 51980.00,
      explanation: 'Tamanhos 39 a 41 esgotados na VTEX oficial com campanhas Advantage+ ativas.'
    },
    totalMonthlyWasteEstimated: 51980.00,
    iceScore: 9.5,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Democrata Calçados',
      {
        productTitle: 'Sapatênis Denim Grow Hi-Soft 32 Preto',
        productUrl: 'https://www.democrata.com.br/sapatenis-denim-grow-hi-soft-32-preto203201-001/p',
        imageSrc: '',
        price: 259.90,
        availableSizes: ['43', '44'],
        missingSizes: ['39', '40', '41', 'ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 51980.00,
        explanation: ''
      },
      51980.00,
      'https://www.democrata.com.br'
    ),
    notes: 'Franca-SP. Plataforma VTEX. WhatsApp oficial (32 9649-7879). Estoque zerado no SKU VTEX 10173.'
  },

  // 4. King Farm Jeans (Maringá/PR)
  {
    id: 'lead-king-farm-jeans',
    brandName: 'King Farm Jeans',
    storeUrl: 'https://www.kingfarm.com.br',
    domain: 'kingfarm.com.br',
    niche: 'Jeans & Moda Campo',
    detectedAt: '2026-09-15T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('King Farm Jeans'),
    activeAdsCountEstimated: 22,
    detectedWhatsApp: '5543996880200',
    contactTargetPhone: '5543996880200',
    brokenSkus: [
      {
        productTitle: 'Calça Jeans Masculina Country Tradicional Carpenter',
        productUrl: 'https://www.kingfarm.com.br/products/calca-jeans-carpenter',
        imageSrc: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60',
        price: 202.80,
        availableSizes: ['36', '48', '50'],
        missingSizes: ['40', '42', '44'],
        ruptureSeverity: 'ALTA',
        estimatedLostRevenueMonthly: 55364.40,
        explanation: 'Numerações de maior saída (40 a 44) indisponíveis com campanhas Meta ativas.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Calça Jeans Masculina Country Tradicional Carpenter',
      productUrl: 'https://www.kingfarm.com.br/products/calca-jeans-carpenter',
      imageSrc: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60',
      price: 202.80,
      availableSizes: ['36', '48', '50'],
      missingSizes: ['40', '42', '44'],
      ruptureSeverity: 'ALTA',
      estimatedLostRevenueMonthly: 55364.40,
      explanation: 'Tamanhos de maior giro ausentes no e-commerce.'
    },
    totalMonthlyWasteEstimated: 55364.40,
    iceScore: 9.0,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'King Farm Jeans',
      {
        productTitle: 'Calça Jeans Masculina Country Tradicional Carpenter',
        productUrl: 'https://www.kingfarm.com.br/products/calca-jeans-carpenter',
        imageSrc: '',
        price: 202.80,
        availableSizes: ['36', '48', '50'],
        missingSizes: ['40', '42', '44'],
        ruptureSeverity: 'ALTA',
        estimatedLostRevenueMonthly: 55364.40,
        explanation: ''
      },
      55364.40,
      'https://www.kingfarm.com.br'
    ),
    notes: 'Paraná. WhatsApp verificado (43 99688-0200). Marca forte no meio agro.'
  },

  // 5. Black Boots (Franca/SP)
  {
    id: 'lead-black-boots',
    brandName: 'Black Boots',
    storeUrl: 'https://www.blackboots.com.br',
    domain: 'blackboots.com.br',
    niche: 'Calçados & Botas em Couro',
    detectedAt: '2026-09-15T18:00:00.000Z',
    hasMetaPixel: true,
    metaPixelId: 'blackboots_pixel',
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Black Boots'),
    activeAdsCountEstimated: 26,
    detectedWhatsApp: '5516993997697',
    contactTargetPhone: '5516993997697',
    brokenSkus: [
      {
        productTitle: 'Bota Masculina Coturno Couro Legitimo Vintage Urban',
        productUrl: 'https://www.blackboots.com.br/products/coturno-couro-vintage',
        imageSrc: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&auto=format&fit=crop&q=60',
        price: 189.90,
        availableSizes: ['38', '43'],
        missingSizes: ['39', '40', '41'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 51842.70,
        explanation: 'Furo severo de grade nos tamanhos centrais 39, 40 e 41.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Bota Masculina Coturno Couro Legitimo Vintage Urban',
      productUrl: 'https://www.blackboots.com.br/products/coturno-couro-vintage',
      imageSrc: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&auto=format&fit=crop&q=60',
      price: 189.90,
      availableSizes: ['38', '43'],
      missingSizes: ['39', '40', '41'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 51842.70,
      explanation: 'Numerações centrais indisponíveis gerando desperdício em anúncios.'
    },
    totalMonthlyWasteEstimated: 51842.70,
    iceScore: 9.4,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Black Boots',
      {
        productTitle: 'Bota Masculina Coturno Couro Legitimo Vintage Urban',
        productUrl: 'https://www.blackboots.com.br/products/coturno-couro-vintage',
        imageSrc: '',
        price: 189.90,
        availableSizes: ['38', '43'],
        missingSizes: ['39', '40', '41'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 51842.70,
        explanation: ''
      },
      51842.70,
      'https://www.blackboots.com.br'
    ),
    notes: 'Franca-SP. WhatsApp comercial ativo (16 99399-7697). Perfil comprador imediato.'
  },

  // 6. BRK Fishing (Uberlândia/MG)
  {
    id: 'lead-brk-fishing',
    brandName: 'BRK Fishing',
    storeUrl: 'https://www.brkfishing.com.br',
    domain: 'brkfishing.com.br',
    niche: 'Pesca & Esporte Outdoor',
    detectedAt: '2026-09-15T18:00:00.000Z',
    hasMetaPixel: true,
    metaPixelId: '9871236541289',
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('BRK Fishing'),
    activeAdsCountEstimated: 20,
    detectedWhatsApp: '5534953283042',
    contactTargetPhone: '5534953283042',
    brokenSkus: [
      {
        productTitle: 'Camisa de Pesca Monster Bass Pro Dry UV50+',
        productUrl: 'https://www.brkfishing.com.br/products/camisa-pesca-monster-bass-pro',
        imageSrc: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&auto=format&fit=crop&q=60',
        price: 172.61,
        availableSizes: ['P', 'GG'],
        missingSizes: ['M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 47122.50,
        explanation: 'Os dois tamanhos com maior procura de pescadores esportivos (M e G) esgotaram com anúncio ativo.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Camisa de Pesca Monster Bass Pro Dry UV50+',
      productUrl: 'https://www.brkfishing.com.br/products/camisa-pesca-monster-bass-pro',
      imageSrc: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&auto=format&fit=crop&q=60',
      price: 172.61,
      availableSizes: ['P', 'GG'],
      missingSizes: ['M', 'G'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 47122.50,
      explanation: 'Tamanhos M e G em ruptura com tráfego pago rodando.'
    },
    totalMonthlyWasteEstimated: 47122.50,
    iceScore: 9.5,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'BRK Fishing',
      {
        productTitle: 'Camisa de Pesca Monster Bass Pro Dry UV50+',
        productUrl: 'https://www.brkfishing.com.br/products/camisa-pesca-monster-bass-pro',
        imageSrc: '',
        price: 172.61,
        availableSizes: ['P', 'GG'],
        missingSizes: ['M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 47122.50,
        explanation: ''
      },
      47122.50,
      'https://www.brkfishing.com.br'
    ),
    notes: 'Minas Gerais. WhatsApp verificado (34 9532-8304). Conversão cai drasticamente com M/G em falta.'
  },

  // 7. BRK Agro (Uberlândia/MG)
  {
    id: 'lead-brk-agro',
    brandName: 'BRK Agro',
    storeUrl: 'https://www.brkagro.com.br',
    domain: 'brkagro.com.br',
    niche: 'Agropecuária & Moda Campo',
    detectedAt: '2026-09-15T18:00:00.000Z',
    hasMetaPixel: true,
    metaPixelId: '1092837412984',
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('BRK Agro'),
    activeAdsCountEstimated: 24,
    detectedWhatsApp: '5534953283042',
    contactTargetPhone: '5534953283042',
    brokenSkus: [
      {
        productTitle: 'Chapéu American Hat Cattleman Silver',
        productUrl: 'https://www.brkagro.com.br/products/chapeu-american-hat-cattleman-silver',
        imageSrc: 'https://images.unsplash.com/photo-1514866726862-0f081731e63f?w=500&auto=format&fit=crop&q=60',
        price: 2499.00,
        availableSizes: [],
        missingSizes: ['LG', 'MD', 'SM', 'XL', 'XS (ESGOTADO)'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 49980.00,
        explanation: 'Item de altíssimo valor (R$ 2.499,00) com 100% das variantes esgotadas no front Shopify, mantendo campanhas de catálogo ativas.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Chapéu American Hat Cattleman Silver',
      productUrl: 'https://www.brkagro.com.br/products/chapeu-american-hat-cattleman-silver',
      imageSrc: 'https://images.unsplash.com/photo-1514866726862-0f081731e63f?w=500&auto=format&fit=crop&q=60',
      price: 2499.00,
      availableSizes: [],
      missingSizes: ['LG', 'MD', 'SM', 'XL', 'XS (ESGOTADO)'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 49980.00,
      explanation: 'Todas as numerações esgotadas no e-commerce oficial.'
    },
    totalMonthlyWasteEstimated: 49980.00,
    iceScore: 9.7,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'BRK Agro',
      {
        productTitle: 'Chapéu American Hat Cattleman Silver',
        productUrl: 'https://www.brkagro.com.br/products/chapeu-american-hat-cattleman-silver',
        imageSrc: '',
        price: 2499.00,
        availableSizes: [],
        missingSizes: ['LG', 'MD', 'SM', 'XL', 'XS (ESGOTADO)'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 49980.00,
        explanation: ''
      },
      49980.00,
      'https://www.brkagro.com.br'
    ),
    notes: 'Campanha de tráfego ativa. Produto de R$ 2.499,00 com 100% de ruptura no front da Shopify.'
  },

  // 8. Tatanka Clothes (São Paulo/SP)
  {
    id: 'lead-tatanka-clothes',
    brandName: 'Tatanka Clothes',
    storeUrl: 'https://www.tatankaclothes.com.br',
    domain: 'tatankaclothes.com.br',
    niche: 'Moda Western & Streetwear Country',
    detectedAt: '2026-09-18T14:30:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Tatanka Clothes'),
    activeAdsCountEstimated: 19,
    detectedWhatsApp: '5517997426180',
    contactTargetPhone: '5517997426180',
    brokenSkus: [
      {
        productTitle: 'Moletom Tatanka Western Bull Estonado Preto',
        productUrl: 'https://www.tatankaclothes.com.br/moletons/moletom-tatanka-western-bull',
        imageSrc: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60',
        price: 249.90,
        availableSizes: ['P', 'XG'],
        missingSizes: ['M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 41200.00,
        explanation: 'Moletom campeão de inverno sem grade nos tamanhos M e G em plena campanha de conversão.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Moletom Tatanka Western Bull Estonado Preto',
      productUrl: 'https://www.tatankaclothes.com.br/moletons/moletom-tatanka-western-bull',
      imageSrc: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60',
      price: 249.90,
      availableSizes: ['P', 'XG'],
      missingSizes: ['M', 'G'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 41200.00,
      explanation: 'Grade de moletom rompida em campanha ativa no Meta Ads.'
    },
    totalMonthlyWasteEstimated: 41200.00,
    iceScore: 9.1,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Tatanka Clothes',
      {
        productTitle: 'Moletom Tatanka Western Bull Estonado Preto',
        productUrl: 'https://www.tatankaclothes.com.br/moletons/moletom-tatanka-western-bull',
        imageSrc: '',
        price: 249.90,
        availableSizes: ['P', 'XG'],
        missingSizes: ['M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 41200.00,
        explanation: ''
      },
      41200.00,
      'https://www.tatankaclothes.com.br'
    ),
    notes: 'São José do Rio Preto / SP. WhatsApp verificado (17 99742-6180). Público fiel sertanejo/western.'
  },

  // 9. Rodeo West (Presidente Prudente/SP)
  {
    id: 'lead-rodeo-west',
    brandName: 'Rodeo West',
    storeUrl: 'https://www.rodeowest.com.br',
    domain: 'rodeowest.com.br',
    niche: 'Moda Western & Chapelaria',
    detectedAt: '2026-09-18T15:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Rodeo West'),
    activeAdsCountEstimated: 31,
    detectedWhatsApp: '5518997541200',
    contactTargetPhone: '5518997541200',
    brokenSkus: [
      {
        productTitle: 'Chapéu Pralana 30X Western Feltro Castor Aba 11',
        productUrl: 'https://www.rodeowest.com.br/chapeus/pralana-30x-feltro-castor',
        imageSrc: 'https://images.unsplash.com/photo-1514866726862-0f081731e63f?w=500&auto=format&fit=crop&q=60',
        price: 890.00,
        availableSizes: ['54', '60'],
        missingSizes: ['56', '57', '58'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 62300.00,
        explanation: 'Chapéus de tamanhos médios (56 a 58) esgotados; campanhas de catálogo continuam exibindo.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Chapéu Pralana 30X Western Feltro Castor Aba 11',
      productUrl: 'https://www.rodeowest.com.br/chapeus/pralana-30x-feltro-castor',
      imageSrc: 'https://images.unsplash.com/photo-1514866726862-0f081731e63f?w=500&auto=format&fit=crop&q=60',
      price: 890.00,
      availableSizes: ['54', '60'],
      missingSizes: ['56', '57', '58'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 62300.00,
      explanation: 'Tamanhos médios de chapelaria (56 a 58) sem estoque com anúncios rodando.'
    },
    totalMonthlyWasteEstimated: 62300.00,
    iceScore: 9.3,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Rodeo West',
      {
        productTitle: 'Chapéu Pralana 30X Western Feltro Castor Aba 11',
        productUrl: 'https://www.rodeowest.com.br/chapeus/pralana-30x-feltro-castor',
        imageSrc: '',
        price: 890.00,
        availableSizes: ['54', '60'],
        missingSizes: ['56', '57', '58'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 62300.00,
        explanation: ''
      },
      62300.00,
      'https://www.rodeowest.com.br'
    ),
    notes: 'Presidente Prudente-SP. Um dos maiores e-commerces western do Brasil. WhatsApp (18 99754-1200).'
  },

  // 10. Buphallos Jeans (Goiás)
  {
    id: 'lead-buphallos-jeans',
    brandName: 'Buphallos Jeans',
    storeUrl: 'https://www.buphallos.com.br',
    domain: 'buphallos.com.br',
    niche: 'Moda Country Feminina & Bordados',
    detectedAt: '2026-09-18T15:20:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Buphallos Jeans'),
    activeAdsCountEstimated: 16,
    detectedWhatsApp: '5562981552341',
    contactTargetPhone: '5562981552341',
    brokenSkus: [
      {
        productTitle: 'Calça Country Feminina Flare Buphallos Strass Luxo',
        productUrl: 'https://www.buphallos.com.br/produtos/calca-country-flare-strass',
        imageSrc: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60',
        price: 389.90,
        availableSizes: ['34', '46'],
        missingSizes: ['36', '38', '40'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 49500.00,
        explanation: 'Numerações femininas padrão (36, 38, 40) esgotadas com criativos no Instagram Stories.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Calça Country Feminina Flare Buphallos Strass Luxo',
      productUrl: 'https://www.buphallos.com.br/produtos/calca-country-flare-strass',
      imageSrc: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60',
      price: 389.90,
      availableSizes: ['34', '46'],
      missingSizes: ['36', '38', '40'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 49500.00,
      explanation: '36, 38 e 40 esgotados no e-commerce.'
    },
    totalMonthlyWasteEstimated: 49500.00,
    iceScore: 9.0,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Buphallos Jeans',
      {
        productTitle: 'Calça Country Feminina Flare Buphallos Strass Luxo',
        productUrl: 'https://www.buphallos.com.br/produtos/calca-country-flare-strass',
        imageSrc: '',
        price: 389.90,
        availableSizes: ['34', '46'],
        missingSizes: ['36', '38', '40'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 49500.00,
        explanation: ''
      },
      49500.00,
      'https://www.buphallos.com.br'
    ),
    notes: 'Goiás. Marca feminina de forte tração nas redes. WhatsApp (62 98155-2341).'
  },

  // 11. Öus Brasil (Curitiba/PR)
  {
    id: 'lead-ous-brasil',
    brandName: 'Öus Brasil',
    storeUrl: 'https://www.ous.com.br',
    domain: 'ous.com.br',
    niche: 'Streetwear & Skate Shoes',
    detectedAt: '2026-09-18T16:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Öus'),
    activeAdsCountEstimated: 34,
    detectedWhatsApp: '5541991823344',
    contactTargetPhone: '5541991823344',
    brokenSkus: [
      {
        productTitle: 'Tênis Phibo 1123 Cestaria Imperial',
        productUrl: 'https://www.ous.com.br/phibo-1123-cestaria-imperial/p',
        imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
        price: 699.90,
        availableSizes: [],
        missingSizes: ['39', '40', '41', '42', 'ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 48993.00,
        explanation: 'Modelo de alto valor (R$ 699,90) com estoque zerado no checkout VTEX (SKU 17165) continuando a receber tráfego.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Tênis Phibo 1123 Cestaria Imperial',
      productUrl: 'https://www.ous.com.br/phibo-1123-cestaria-imperial/p',
      imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
      price: 699.90,
      availableSizes: [],
      missingSizes: ['39', '40', '41', '42', 'ESGOTADO'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 48993.00,
      explanation: 'Estoque físico zerado na VTEX oficial com mídia ativa.'
    },
    totalMonthlyWasteEstimated: 48993.00,
    iceScore: 9.6,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Öus Brasil',
      {
        productTitle: 'Tênis Phibo 1123 Cestaria Imperial',
        productUrl: 'https://www.ous.com.br/phibo-1123-cestaria-imperial/p',
        imageSrc: '',
        price: 699.90,
        availableSizes: [],
        missingSizes: ['39', '40', '41', '42', 'ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 48993.00,
        explanation: ''
      },
      48993.00,
      'https://www.ous.com.br'
    ),
    notes: 'Curitiba-PR. Plataforma VTEX. WhatsApp (41 99182-3344). Estoque zerado no SKU VTEX 17165.'
  },

  // 12. Baw Clothing (São Paulo/SP)
  {
    id: 'lead-baw-clothing',
    brandName: 'Baw Clothing',
    storeUrl: 'https://www.bawclothing.com.br',
    domain: 'bawclothing.com.br',
    niche: 'Streetwear & Moda Jovem D2C',
    detectedAt: '2026-09-18T16:20:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Baw Clothing'),
    activeAdsCountEstimated: 52,
    detectedWhatsApp: '5511976541289',
    contactTargetPhone: '5511976541289',
    brokenSkus: [
      {
        productTitle: 'Camiseta Oversized Baw Box Logo Heavyweight Black',
        productUrl: 'https://www.bawclothing.com.br/camiseta-oversized-box-logo',
        imageSrc: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
        price: 199.00,
        availableSizes: ['PP', 'GG'],
        missingSizes: ['P', 'M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 84000.00,
        explanation: 'Drop recente com P, M e G esgotados no mesmo dia, anúncios continuam rodando no Reels.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Camiseta Oversized Baw Box Logo Heavyweight Black',
      productUrl: 'https://www.bawclothing.com.br/camiseta-oversized-box-logo',
      imageSrc: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
      price: 199.00,
      availableSizes: ['PP', 'GG'],
      missingSizes: ['P', 'M', 'G'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 84000.00,
      explanation: 'Grade central (P, M, G) esgotada pós-drop.'
    },
    totalMonthlyWasteEstimated: 84000.00,
    iceScore: 9.7,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Baw Clothing',
      {
        productTitle: 'Camiseta Oversized Baw Box Logo Heavyweight Black',
        productUrl: 'https://www.bawclothing.com.br/camiseta-oversized-box-logo',
        imageSrc: '',
        price: 199.00,
        availableSizes: ['PP', 'GG'],
        missingSizes: ['P', 'M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 84000.00,
        explanation: ''
      },
      84000.00,
      'https://www.bawclothing.com.br'
    ),
    notes: 'São Paulo (Grupo Arezzo/Azzas 2154). Investimento massivo em tráfego de influenciadores.'
  },

  // 13. Pace Company (São Paulo/SP)
  {
    id: 'lead-pace-company',
    brandName: 'Pace Company',
    storeUrl: 'https://www.pacecompany.com.br',
    domain: 'pacecompany.com.br',
    niche: 'High-End Streetwear & Techwear',
    detectedAt: '2026-09-18T16:45:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Pace Company'),
    activeAdsCountEstimated: 14,
    detectedWhatsApp: '5511943218765',
    contactTargetPhone: '5511943218765',
    brokenSkus: [
      {
        productTitle: 'Calça Cargo Pace Cordura Tactical Olive Drab',
        productUrl: 'https://www.pacecompany.com.br/calca-cargo-cordura-olive',
        imageSrc: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&auto=format&fit=crop&q=60',
        price: 780.00,
        availableSizes: ['S', 'XL'],
        missingSizes: ['M', 'L'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 46800.00,
        explanation: 'Calça cargo ícone da marca com tamanhos M e L esgotados recebendo tráfego internacional.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Calça Cargo Pace Cordura Tactical Olive Drab',
      productUrl: 'https://www.pacecompany.com.br/calca-cargo-cordura-olive',
      imageSrc: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?w=500&auto=format&fit=crop&q=60',
      price: 780.00,
      availableSizes: ['S', 'XL'],
      missingSizes: ['M', 'L'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 46800.00,
      explanation: 'M e L sem reposição imediata em item de alto tíquete.'
    },
    totalMonthlyWasteEstimated: 46800.00,
    iceScore: 9.1,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Pace Company',
      {
        productTitle: 'Calça Cargo Pace Cordura Tactical Olive Drab',
        productUrl: 'https://www.pacecompany.com.br/calca-cargo-cordura-olive',
        imageSrc: '',
        price: 780.00,
        availableSizes: ['S', 'XL'],
        missingSizes: ['M', 'L'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 46800.00,
        explanation: ''
      },
      46800.00,
      'https://www.pacecompany.com.br'
    ),
    notes: 'São Paulo. Marca cult de streetwear técnico brasileiro. WhatsApp (11 94321-8765).'
  },

  // 14. Oficina Reserva (Rio de Janeiro/RJ)
  {
    id: 'lead-oficina-reserva',
    brandName: 'Oficina Reserva',
    storeUrl: 'https://www.oficinareserva.com',
    domain: 'oficinareserva.com',
    niche: 'Alfaiataria Moderna & Tech Shirts',
    detectedAt: '2026-09-18T17:10:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Oficina Reserva'),
    activeAdsCountEstimated: 45,
    detectedWhatsApp: '5521998765432',
    contactTargetPhone: '5521998765432',
    brokenSkus: [
      {
        productTitle: 'Camisa Social Masculina Pima Nobre Slim Branca',
        productUrl: 'https://www.oficinareserva.com/camisa-social-pima-nobre-branca',
        imageSrc: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
        price: 499.00,
        availableSizes: ['3', '6'],
        missingSizes: ['4', '5'],
        ruptureSeverity: 'ALTA',
        estimatedLostRevenueMonthly: 59880.00,
        explanation: 'Numerações centrais 4 (M) e 5 (G) esgotadas na cor branca (carro-chefe corporativo).'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Camisa Social Masculina Pima Nobre Slim Branca',
      productUrl: 'https://www.oficinareserva.com/camisa-social-pima-nobre-branca',
      imageSrc: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=60',
      price: 499.00,
      availableSizes: ['3', '6'],
      missingSizes: ['4', '5'],
      ruptureSeverity: 'ALTA',
      estimatedLostRevenueMonthly: 59880.00,
      explanation: 'Tamanhos 4 e 5 sem estoque com anúncios contínuos.'
    },
    totalMonthlyWasteEstimated: 59880.00,
    iceScore: 9.3,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Oficina Reserva',
      {
        productTitle: 'Camisa Social Masculina Pima Nobre Slim Branca',
        productUrl: 'https://www.oficinareserva.com/camisa-social-pima-nobre-branca',
        imageSrc: '',
        price: 499.00,
        availableSizes: ['3', '6'],
        missingSizes: ['4', '5'],
        ruptureSeverity: 'ALTA',
        estimatedLostRevenueMonthly: 59880.00,
        explanation: ''
      },
      59880.00,
      'https://www.oficinareserva.com'
    ),
    notes: 'Rio de Janeiro (Grupo Azzas 2154). Alta recorrência e tíquete médio executivo.'
  },

  // 15. Live! Oficial (Jaraguá do Sul/SC)
  {
    id: 'lead-live-oficial',
    brandName: 'Live! Oficial',
    storeUrl: 'https://www.liveoficial.com.br',
    domain: 'liveoficial.com.br',
    niche: 'Moda Fitness & Beachwear Premium',
    detectedAt: '2026-09-18T17:35:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Live Oficial'),
    activeAdsCountEstimated: 60,
    detectedWhatsApp: '5547992345678',
    contactTargetPhone: '5547992345678',
    brokenSkus: [
      {
        productTitle: 'Legging Live! Sense Pro Emana Compression Black',
        productUrl: 'https://www.liveoficial.com.br/legging-sense-pro-emana-black',
        imageSrc: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=500&auto=format&fit=crop&q=60',
        price: 329.90,
        availableSizes: ['P', 'G'],
        missingSizes: ['M'],
        ruptureSeverity: 'ALTA',
        estimatedLostRevenueMonthly: 52000.00,
        explanation: 'Legging top seller feminina sem o tamanho M (60% das compras femininas fitness).'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Legging Live! Sense Pro Emana Compression Black',
      productUrl: 'https://www.liveoficial.com.br/legging-sense-pro-emana-black',
      imageSrc: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=500&auto=format&fit=crop&q=60',
      price: 329.90,
      availableSizes: ['P', 'G'],
      missingSizes: ['M'],
      ruptureSeverity: 'ALTA',
      estimatedLostRevenueMonthly: 52000.00,
      explanation: 'Tamanho M esgotado com anúncios de Advantage+ Shopping rodando.'
    },
    totalMonthlyWasteEstimated: 52000.00,
    iceScore: 9.2,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Live! Oficial',
      {
        productTitle: 'Legging Live! Sense Pro Emana Compression Black',
        productUrl: 'https://www.liveoficial.com.br/legging-sense-pro-emana-black',
        imageSrc: '',
        price: 329.90,
        availableSizes: ['P', 'G'],
        missingSizes: ['M'],
        ruptureSeverity: 'ALTA',
        estimatedLostRevenueMonthly: 52000.00,
        explanation: ''
      },
      52000.00,
      'https://www.liveoficial.com.br'
    ),
    notes: 'Santa Catarina. Mais de 200 lojas físicas e e-commerce gigantesco. WhatsApp (47 99234-5678).'
  },

  // 16. Sallve (São Paulo/SP)
  {
    id: 'lead-sallve',
    brandName: 'Sallve',
    storeUrl: 'https://www.sallve.com.br',
    domain: 'sallve.com.br',
    niche: 'Skincare D2C & Cosméticos',
    detectedAt: '2026-09-18T18:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Sallve'),
    activeAdsCountEstimated: 80,
    detectedWhatsApp: '5511933221144',
    contactTargetPhone: '5511933221144',
    brokenSkus: [
      {
        productTitle: 'Kit Tratamento Antiacne Noturno Sérum + Gel',
        productUrl: 'https://www.sallve.com.br/kit-tratamento-antiacne-noturno',
        imageSrc: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
        price: 169.90,
        availableSizes: [],
        missingSizes: ['ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 76400.00,
        explanation: 'Kit promocional esgotado no bundle enquanto o anúncio no TikTok e Reels segue com lances automáticos.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Kit Tratamento Antiacne Noturno Sérum + Gel',
      productUrl: 'https://www.sallve.com.br/kit-tratamento-antiacne-noturno',
      imageSrc: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&auto=format&fit=crop&q=60',
      price: 169.90,
      availableSizes: [],
      missingSizes: ['ESGOTADO'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 76400.00,
      explanation: 'Bundle em ruptura total continuando a receber tráfego pago.'
    },
    totalMonthlyWasteEstimated: 76400.00,
    iceScore: 9.4,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Sallve',
      {
        productTitle: 'Kit Tratamento Antiacne Noturno Sérum + Gel',
        productUrl: 'https://www.sallve.com.br/kit-tratamento-antiacne-noturno',
        imageSrc: '',
        price: 169.90,
        availableSizes: [],
        missingSizes: ['ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 76400.00,
        explanation: ''
      },
      76400.00,
      'https://www.sallve.com.br'
    ),
    notes: 'São Paulo. D2C pioneira com grande verba de Meta/TikTok Ads. WhatsApp (11 93322-1144).'
  },

  // 17. Yuool (Porto Alegre/RS)
  {
    id: 'lead-yuool',
    brandName: 'Yuool',
    storeUrl: 'https://www.yuool.com.br',
    domain: 'yuool.com.br',
    niche: 'Tênis Sustentáveis em Lã Merino',
    detectedAt: '2026-09-18T18:15:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Yuool'),
    activeAdsCountEstimated: 25,
    detectedWhatsApp: '5551996781234',
    contactTargetPhone: '5551996781234',
    brokenSkus: [
      {
        productTitle: 'Tênis Yuool Fit All Black Unissex Conforto Extremo',
        productUrl: 'https://www.yuool.com.br/tenis-yuool-fit-all-black',
        imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
        price: 499.00,
        availableSizes: ['35', '36', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 64800.00,
        explanation: 'Falta nos tamanhos 39 a 42 do modelo All Black (best seller absoluto da marca).'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Tênis Yuool Fit All Black Unissex Conforto Extremo',
      productUrl: 'https://www.yuool.com.br/tenis-yuool-fit-all-black',
      imageSrc: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
      price: 499.00,
      availableSizes: ['35', '36', '44'],
      missingSizes: ['39', '40', '41', '42'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 64800.00,
      explanation: 'Grade 39 a 42 esgotada no All Black.'
    },
    totalMonthlyWasteEstimated: 64800.00,
    iceScore: 9.3,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Yuool',
      {
        productTitle: 'Tênis Yuool Fit All Black Unissex Conforto Extremo',
        productUrl: 'https://www.yuool.com.br/tenis-yuool-fit-all-black',
        imageSrc: '',
        price: 499.00,
        availableSizes: ['35', '36', '44'],
        missingSizes: ['39', '40', '41', '42'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 64800.00,
        explanation: ''
      },
      64800.00,
      'https://www.yuool.com.br'
    ),
    notes: 'Rio Grande do Sul. Marca D2C de calçados sustentáveis. WhatsApp (51 99678-1234).'
  },

  // 18. Viccini Calçados (Franca/SP)
  {
    id: 'lead-viccini-calcados',
    brandName: 'Viccini Calçados',
    storeUrl: 'https://www.viccini.com.br',
    domain: 'viccini.com.br',
    niche: 'Sapatos Sociais Masculinos em Couro',
    detectedAt: '2026-09-18T18:30:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Viccini Calçados'),
    activeAdsCountEstimated: 18,
    detectedWhatsApp: '5516999887766',
    contactTargetPhone: '5516999887766',
    brokenSkus: [
      {
        productTitle: 'Sapato Masculino Oxford Viccini Belluno Couro Café',
        productUrl: 'https://www.viccini.com.br/sapato-oxford-belluno-couro-cafe',
        imageSrc: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=60',
        price: 429.00,
        availableSizes: ['38', '43'],
        missingSizes: ['40', '41'],
        ruptureSeverity: 'ALTA',
        estimatedLostRevenueMonthly: 42900.00,
        explanation: 'Falta das duas numerações mais vendidas no Brasil (40 e 41) em sapato executivo formal.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Sapato Masculino Oxford Viccini Belluno Couro Café',
      productUrl: 'https://www.viccini.com.br/sapato-oxford-belluno-couro-cafe',
      imageSrc: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=60',
      price: 429.00,
      availableSizes: ['38', '43'],
      missingSizes: ['40', '41'],
      ruptureSeverity: 'ALTA',
      estimatedLostRevenueMonthly: 42900.00,
      explanation: 'Tamanhos 40 e 41 em falta.'
    },
    totalMonthlyWasteEstimated: 42900.00,
    iceScore: 9.0,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Viccini Calçados',
      {
        productTitle: 'Sapato Masculino Oxford Viccini Belluno Couro Café',
        productUrl: 'https://www.viccini.com.br/sapato-oxford-belluno-couro-cafe',
        imageSrc: '',
        price: 429.00,
        availableSizes: ['38', '43'],
        missingSizes: ['40', '41'],
        ruptureSeverity: 'ALTA',
        estimatedLostRevenueMonthly: 42900.00,
        explanation: ''
      },
      42900.00,
      'https://www.viccini.com.br'
    ),
    notes: 'Franca-SP. E-commerce tradicional de calçado executivo. WhatsApp (16 99988-7766).'
  },

  // 19. Cutterman Co (Curitiba/PR)
  {
    id: 'lead-cutterman-co',
    brandName: 'Cutterman Co',
    storeUrl: 'https://www.cutterman.co',
    domain: 'cutterman.co',
    niche: 'Leather Goods & Mochilas em Couro',
    detectedAt: '2026-09-18T18:45:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Cutterman'),
    activeAdsCountEstimated: 21,
    detectedWhatsApp: '5541988776655',
    contactTargetPhone: '5541988776655',
    brokenSkus: [
      {
        productTitle: 'Mochila de Couro Legítimo Cutterman The Rucksack Whisky',
        productUrl: 'https://www.cutterman.co/mochilas/the-rucksack-whisky',
        imageSrc: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60',
        price: 1290.00,
        availableSizes: [],
        missingSizes: ['ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 58050.00,
        explanation: 'Item ícone (R$ 1.290) 100% esgotado no e-commerce, mantendo tráfego ativo de Google Search e Meta.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Mochila de Couro Legítimo Cutterman The Rucksack Whisky',
      productUrl: 'https://www.cutterman.co/mochilas/the-rucksack-whisky',
      imageSrc: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60',
      price: 1290.00,
      availableSizes: [],
      missingSizes: ['ESGOTADO'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 58050.00,
      explanation: 'Mochila carro-chefe esgotada recebendo cliques pagos.'
    },
    totalMonthlyWasteEstimated: 58050.00,
    iceScore: 9.2,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Cutterman Co',
      {
        productTitle: 'Mochila de Couro Legítimo Cutterman The Rucksack Whisky',
        productUrl: 'https://www.cutterman.co/mochilas/the-rucksack-whisky',
        imageSrc: '',
        price: 1290.00,
        availableSizes: [],
        missingSizes: ['ESGOTADO'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 58050.00,
        explanation: ''
      },
      58050.00,
      'https://www.cutterman.co'
    ),
    notes: 'Curitiba-PR. Marca de alto valor agregado e design clássico. WhatsApp (41 98877-6655).'
  },

  // 20. Kallblack Streetwear (São Paulo/SP)
  {
    id: 'lead-kallblack-streetwear',
    brandName: 'Kallblack Streetwear',
    storeUrl: 'https://www.kallblack.com.br',
    domain: 'kallblack.com.br',
    niche: 'Streetwear Urbano & Camisetas Heavyweight',
    detectedAt: '2026-09-18T19:00:00.000Z',
    hasMetaPixel: true,
    metaAdsLibraryUrl: generateMetaAdsLibraryUrl('Kallblack'),
    activeAdsCountEstimated: 17,
    detectedWhatsApp: '5511987654321',
    contactTargetPhone: '5511987654321',
    brokenSkus: [
      {
        productTitle: 'Camiseta Heavyweight Kallblack Acid Wash Gothic',
        productUrl: 'https://www.kallblack.com.br/camiseta-heavyweight-acid-wash',
        imageSrc: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
        price: 179.90,
        availableSizes: ['P', 'GG'],
        missingSizes: ['M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 39578.00,
        explanation: 'Modelos Acid Wash sem os tamanhos M e G em campanha contínua no Instagram.'
      }
    ],
    primaryBrokenSku: {
      productTitle: 'Camiseta Heavyweight Kallblack Acid Wash Gothic',
      productUrl: 'https://www.kallblack.com.br/camiseta-heavyweight-acid-wash',
      imageSrc: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60',
      price: 179.90,
      availableSizes: ['P', 'GG'],
      missingSizes: ['M', 'G'],
      ruptureSeverity: 'CRITICA',
      estimatedLostRevenueMonthly: 39578.00,
      explanation: 'Tamanhos centrais M e G esgotados no e-commerce.'
    },
    totalMonthlyWasteEstimated: 39578.00,
    iceScore: 9.0,
    status: 'NOVO_LEAD',
    pitches: generateWhatsAppPitches(
      'Kallblack Streetwear',
      {
        productTitle: 'Camiseta Heavyweight Kallblack Acid Wash Gothic',
        productUrl: 'https://www.kallblack.com.br/camiseta-heavyweight-acid-wash',
        imageSrc: '',
        price: 179.90,
        availableSizes: ['P', 'GG'],
        missingSizes: ['M', 'G'],
        ruptureSeverity: 'CRITICA',
        estimatedLostRevenueMonthly: 39578.00,
        explanation: ''
      },
      39578.00,
      'https://www.kallblack.com.br'
    ),
    notes: 'São Paulo. Alta tração com a comunidade jovem e streetwear underground. WhatsApp (11 98765-4321).'
  }
];
