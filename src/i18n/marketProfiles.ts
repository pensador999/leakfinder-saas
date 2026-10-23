// ==============================================================================
// 🌍 GLOBAL MULTI-MARKET E-COMMERCE PROFILES & DETECTION ENGINE — ADSHIELD 2026
// Native calibration for United States (en-US), United Kingdom (en-GB),
// Germany/DACH (de-DE), France (fr-FR), Spain (es-ES), and Brazil (pt-BR).
// ==============================================================================

export type StoreLocaleId = 'en-US' | 'en-GB' | 'de-DE' | 'fr-FR' | 'es-ES' | 'pt-BR';
export type StoreCurrencyCode = 'USD' | 'GBP' | 'EUR' | 'BRL';

export interface MarketProfile {
  id: StoreLocaleId;
  locale: StoreLocaleId;
  country: string;
  countryName: string;
  regionLabel: string;
  flagEmoji: string;
  currency: 'USD' | 'GBP' | 'EUR' | 'BRL';
  currencyCode: 'USD' | 'GBP' | 'EUR' | 'BRL';
  currencySymbol: '$' | '£' | '€' | 'R$';
  decimalSeparator: '.' | ',';
  thousandsSeparator: ',' | '.';
  legalFrameworkName: string;
  legalEntityKeywords: string[];
  privacyLawKeywords: string[];
  returnRightKeywords: string[];
  localPaymentIncentiveKeywords: string[];
  freeShippingKeywords: string[];
  paymentIncentiveBadgeLabel: string;
  paymentIncentives: {
    primaryMethodName: string;
    badgeLabel: string;
    detectionPatterns: RegExp[];
    bnplProviders: string[];
  };
  shippingKeywords: string[];
  sizeGuideKeywords: string[];
  buyButtonKeywords: string[];
  apparelLetterSizes: {
    all: string[];
    core: string[];
    demandWeights: Record<string, number>;
  };
  footwearSizes: {
    all: string[];
    core: string[];
    demandWeights: Record<string, number>;
  };
  apparelProductKeywords: RegExp;
  footwearProductKeywords: RegExp;
  legalCompliance: {
    taxIdLabel: string;
    privacyLawName: string;
    returnWindowDays: number;
    returnLawName: string;
    mandatoryImprintLabel?: string;
    detectionKeywords: {
      privacy: string[];
      returns: string[];
      imprintOrId: string[];
    };
  };
  dominantErpSystems: string[];
}

const RAW_MARKET_PROFILES: Record<StoreLocaleId, Omit<MarketProfile, 'id' | 'country' | 'currency' | 'legalFrameworkName' | 'legalEntityKeywords' | 'privacyLawKeywords' | 'returnRightKeywords' | 'localPaymentIncentiveKeywords' | 'freeShippingKeywords' | 'paymentIncentiveBadgeLabel'>> = {
  'en-US': {
    locale: 'en-US',
    countryName: 'United States',
    regionLabel: 'United States (North America)',
    flagEmoji: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    paymentIncentives: {
      primaryMethodName: 'Shop Pay / Apple Pay / BNPL (Klarna & Afterpay)',
      badgeLabel: 'Shop Pay / 4 Interest-Free Payments',
      detectionPatterns: [
        /shop\s*pay/i,
        /apple\s*pay/i,
        /afterpay/i,
        /klarna/i,
        /affirm/i,
        /4\s*interest[- ]free/i,
        /pay\s*in\s*4/i,
        /google\s*pay/i
      ],
      bnplProviders: ['Shop Pay Installments', 'Afterpay', 'Klarna', 'Affirm', 'Apple Pay']
    },
    shippingKeywords: ['free shipping', 'free delivery', 'complimentary shipping', 'fast shipping', 'ships today', 'express shipping'],
    sizeGuideKeywords: ['size chart', 'size guide', 'fit guide', 'sizing guide', 'measurement guide', 'find your fit', 'true to size', 'inches'],
    buyButtonKeywords: ['add to cart', 'add to bag', 'buy now', 'buy it now', 'shop now', 'pre-order', 'preorder', 'quick add'],
    apparelLetterSizes: {
      all: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'],
      core: ['S', 'M', 'L', 'XL'],
      demandWeights: {
        'XXS': 3,
        'XS': 8,
        'S': 18,
        'M': 28,
        'L': 26,
        'XL': 12,
        'XXL': 3,
        '2XL': 2,
        '3XL': 1
      }
    },
    footwearSizes: {
      all: ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '13', '14'],
      core: ['8', '8.5', '9', '9.5', '10', '10.5', '11'],
      demandWeights: {
        '6': 3,
        '6.5': 4,
        '7': 6,
        '7.5': 8,
        '8': 11,
        '8.5': 12,
        '9': 14,
        '9.5': 13,
        '10': 13,
        '10.5': 10,
        '11': 8,
        '11.5': 4,
        '12': 5,
        '13': 3,
        '14': 1
      }
    },
    apparelProductKeywords: /\b(shirt|t-shirt|tee|hoodie|sweatshirt|jacket|coat|pants|trousers|jeans|shorts|dress|skirt|leggings|sweater|cardigan|pullover|blazer|suit|jogger|activewear|swimwear|bikini|top|blouse|polo|apparel|clothing)\b/i,
    footwearProductKeywords: /\b(shoe|shoes|sneaker|sneakers|boot|boots|sandal|sandals|loafer|loafers|heel|heels|cleat|runner|trainer|trainers|slipper|footwear)\b/i,
    legalCompliance: {
      taxIdLabel: 'Corporate Entity / Terms of Service',
      privacyLawName: 'CCPA / CPRA & FTC Compliance',
      returnWindowDays: 30,
      returnLawName: 'FTC Mail Order Rule & Clear Return Policy',
      mandatoryImprintLabel: 'Terms of Service & Contact Info',
      detectionKeywords: {
        privacy: ['privacy policy', 'do not sell', 'ccpa', 'cpra', 'privacy notice', 'cookie policy'],
        returns: ['return policy', 'returns & exchanges', 'free returns', '30-day', '30 days', 'refund policy', 'refunds', 'returns', 'exchange'],
        imprintOrId: ['llc', 'inc.', 'corp', 'terms of service', 'terms & conditions', 'contact us', 'support@', 'customer service']
      }
    },
    dominantErpSystems: ['NetSuite ERP', 'ShipBob WMS', 'Cin7 Core', 'Skubana / Extensiv']
  },

  'en-GB': {
    locale: 'en-GB',
    countryName: 'United Kingdom',
    regionLabel: 'United Kingdom (UK)',
    flagEmoji: '🇬🇧',
    currencyCode: 'GBP',
    currencySymbol: '£',
    decimalSeparator: '.',
    thousandsSeparator: ',',
    paymentIncentives: {
      primaryMethodName: 'Klarna / Clearpay / Apple Pay / PayPal Pay in 3',
      badgeLabel: 'Klarna / Clearpay 3 Interest-Free Payments',
      detectionPatterns: [
        /klarna/i,
        /clearpay/i,
        /apple\s*pay/i,
        /pay\s*in\s*3/i,
        /shop\s*pay/i,
        /paypal/i
      ],
      bnplProviders: ['Klarna', 'Clearpay', 'PayPal Pay in 3', 'Apple Pay', 'Shop Pay']
    },
    shippingKeywords: ['free delivery', 'free uk delivery', 'free shipping', 'next day delivery', 'royal mail', 'dpd'],
    sizeGuideKeywords: ['size guide', 'size chart', 'fit guide', 'uk size', 'cm', 'inches'],
    buyButtonKeywords: ['add to bag', 'add to basket', 'add to cart', 'buy now', 'pre-order'],
    apparelLetterSizes: {
      all: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16'],
      core: ['S', 'M', 'L', 'XL', 'UK 8', 'UK 10', 'UK 12', 'UK 14'],
      demandWeights: {
        'XXS': 3,
        'XS': 8,
        'S': 18,
        'M': 28,
        'L': 26,
        'XL': 12,
        'XXL': 5,
        'UK 6': 6,
        'UK 8': 16,
        'UK 10': 24,
        'UK 12': 24,
        'UK 14': 16,
        'UK 16': 8
      }
    },
    footwearSizes: {
      all: ['3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '12'],
      core: ['6', '7', '8', '9', '10'],
      demandWeights: {
        '3': 3,
        '4': 6,
        '5': 8,
        '6': 12,
        '7': 16,
        '8': 18,
        '9': 18,
        '10': 14,
        '11': 8,
        '12': 4
      }
    },
    apparelProductKeywords: /\b(shirt|t-shirt|tee|hoodie|jumper|sweatshirt|jacket|coat|trousers|pants|jeans|shorts|dress|skirt|leggings|cardigan|blazer|suit|tracksuit|activewear|swimwear|top|blouse|polo)\b/i,
    footwearProductKeywords: /\b(shoe|shoes|trainer|trainers|sneaker|sneakers|boot|boots|sandal|sandals|loafer|heel|footwear)\b/i,
    legalCompliance: {
      taxIdLabel: 'Company Registration No. / VAT Number',
      privacyLawName: 'UK GDPR & Data Protection Act 2018',
      returnWindowDays: 14,
      returnLawName: 'Consumer Contracts Regulations (14-Day Cooling-Off)',
      mandatoryImprintLabel: 'Company Registration & VAT Details',
      detectionKeywords: {
        privacy: ['privacy policy', 'uk gdpr', 'gdpr', 'cookie policy', 'data protection'],
        returns: ['14 days', '14-day', '28 days', 'returns policy', 'return policy', 'refunds', 'returns', 'exchange'],
        imprintOrId: ['ltd', 'limited', 'plc', 'company number', 'registered in england', 'vat', 'terms & conditions', 'terms of service']
      }
    },
    dominantErpSystems: ['Brightpearl', 'Linnworks', 'Peoplevox WMS', 'NetSuite UK']
  },

  'de-DE': {
    locale: 'de-DE',
    countryName: 'Germany (DACH)',
    regionLabel: 'Germany / DACH (EU)',
    flagEmoji: '🇩🇪',
    currencyCode: 'EUR',
    currencySymbol: '€',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    paymentIncentives: {
      primaryMethodName: 'Klarna Rechnung / Sofort / PayPal / Apple Pay',
      badgeLabel: 'Kauf auf Rechnung (Klarna / PayPal)',
      detectionPatterns: [
        /klarna/i,
        /rechnung/i,
        /sofort/i,
        /paypal/i,
        /apple\s*pay/i,
        /ratenkauf/i
      ],
      bnplProviders: ['Klarna Rechnung', 'PayPal Ratenzahlung', 'Sofortüberweisung', 'Apple Pay']
    },
    shippingKeywords: ['kostenloser versand', 'versandkostenfrei', 'gratis versand', 'schnelle lieferung', 'dhl'],
    sizeGuideKeywords: ['größentabelle', 'grössentabelle', 'größenberater', 'passform', 'size guide', 'size chart', 'maßtabelle'],
    buyButtonKeywords: ['in den warenkorb', 'jetzt kaufen', 'in die einkaufstasche', 'warenkorb', 'vorbestellen', 'add to cart'],
    apparelLetterSizes: {
      all: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      core: ['S', 'M', 'L', 'XL'],
      demandWeights: {
        'XXS': 3,
        'XS': 8,
        'S': 18,
        'M': 28,
        'L': 26,
        'XL': 12,
        'XXL': 5
      }
    },
    footwearSizes: {
      all: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
      core: ['39', '40', '41', '42', '43'],
      demandWeights: {
        '36': 4,
        '37': 6,
        '38': 10,
        '39': 14,
        '40': 18,
        '41': 16,
        '42': 18,
        '43': 12,
        '44': 8,
        '45': 4,
        '46': 2
      }
    },
    apparelProductKeywords: /\b(hemd|t-shirt|shirt|hoodie|pullover|jacke|mantel|hose|jeans|shorts|kleid|rock|leggings|bluse|anzug|bekleidung)\b/i,
    footwearProductKeywords: /\b(schuh|schuhe|sneaker|stiefel|sandale|stiefelette|laufschuh|halbschuh)\b/i,
    legalCompliance: {
      taxIdLabel: 'Impressum (§ 5 DDG) & USt-IdNr.',
      privacyLawName: 'DSGVO (EU GDPR) & TDDDG',
      returnWindowDays: 14,
      returnLawName: '14-Tage Widerrufsrecht (§ 355 BGB)',
      mandatoryImprintLabel: 'Impressum & USt-IdNr.',
      detectionKeywords: {
        privacy: ['datenschutz', 'datenschutzerklärung', 'dsgvo', 'cookies', 'privacy'],
        returns: ['widerruf', 'widerrufsrecht', 'widerrufsbelehrung', '14 tage', 'rückgabe', 'retoure'],
        imprintOrId: ['impressum', 'gmbh', 'ug', 'ag', 'ust-idnr', 'handelsregister', 'hrb', 'agb']
      }
    },
    dominantErpSystems: ['JTL-Wawi', 'PlentyMarkets', 'SAP Business One', 'Weclapp']
  },

  'fr-FR': {
    locale: 'fr-FR',
    countryName: 'France',
    regionLabel: 'France (EU)',
    flagEmoji: '🇫🇷',
    currencyCode: 'EUR',
    currencySymbol: '€',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    paymentIncentives: {
      primaryMethodName: 'Alma 3x/4x / PayPal 4x / Apple Pay / Carte Bancaire',
      badgeLabel: 'Paiement en 3x ou 4x sans frais (Alma / Klarna)',
      detectionPatterns: [
        /alma/i,
        /klarna/i,
        /3x|4x/i,
        /sans\s*frais/i,
        /paypal/i,
        /apple\s*pay/i
      ],
      bnplProviders: ['Alma 3x/4x', 'PayPal 4x', 'Klarna', 'Apple Pay']
    },
    shippingKeywords: ['livraison gratuite', 'livraison offerte', 'frais de port offerts', 'expédition rapide', 'colissimo'],
    sizeGuideKeywords: ['guide des tailles', 'tableau des tailles', 'grille des tailles', 'size guide', 'size chart'],
    buyButtonKeywords: ['ajouter au panier', 'acheter maintenant', 'commander', 'précommander', 'add to cart'],
    apparelLetterSizes: {
      all: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      core: ['S', 'M', 'L', 'XL'],
      demandWeights: {
        'XXS': 4,
        'XS': 10,
        'S': 20,
        'M': 28,
        'L': 24,
        'XL': 10,
        'XXL': 4
      }
    },
    footwearSizes: {
      all: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
      core: ['38', '39', '40', '41', '42'],
      demandWeights: {
        '36': 5,
        '37': 8,
        '38': 14,
        '39': 16,
        '40': 18,
        '41': 15,
        '42': 15,
        '43': 10,
        '44': 6,
        '45': 3
      }
    },
    apparelProductKeywords: /\b(chemise|t-shirt|sweat|veste|manteau|pantalon|jean|short|robe|jupe|pull|chemisier|vêtement)\b/i,
    footwearProductKeywords: /\b(chaussure|chaussures|basket|baskets|botte|bottine|sandale|mocassin)\b/i,
    legalCompliance: {
      taxIdLabel: 'Mentions Légales & SIRET/SIREN',
      privacyLawName: 'RGPD & Directives CNIL',
      returnWindowDays: 14,
      returnLawName: 'Droit de rétractation de 14 jours (Code de la consommation)',
      mandatoryImprintLabel: 'Mentions Légales & CGV',
      detectionKeywords: {
        privacy: ['confidentialité', 'politique de confidentialité', 'rgpd', 'cnil', 'cookies'],
        returns: ['rétractation', '14 jours', 'retours', 'échange', 'remboursement'],
        imprintOrId: ['mentions légales', 'cgv', 'siret', 'siren', 'sas', 'sarl', 'rcs']
      }
    },
    dominantErpSystems: ['Cegid Retail', 'Odoo ERP', 'Shippingbo WMS', 'NetSuite']
  },

  'es-ES': {
    locale: 'es-ES',
    countryName: 'Spain',
    regionLabel: 'Spain (EU)',
    flagEmoji: '🇪🇸',
    currencyCode: 'EUR',
    currencySymbol: '€',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    paymentIncentives: {
      primaryMethodName: 'Bizum / Klarna / seQura / Apple Pay',
      badgeLabel: 'Pago con Bizum o 3 plazos sin intereses',
      detectionPatterns: [
        /bizum/i,
        /klarna/i,
        /sequra/i,
        /aplazame/i,
        /paypal/i,
        /apple\s*pay/i
      ],
      bnplProviders: ['Bizum', 'Klarna', 'seQura', 'Aplazame', 'Apple Pay']
    },
    shippingKeywords: ['envío gratis', 'envio gratis', 'envío gratuito', 'entrega 24h', 'envío rápido'],
    sizeGuideKeywords: ['guía de tallas', 'guia de tallas', 'tabla de tallas', 'size guide', 'size chart'],
    buyButtonKeywords: ['añadir al carrito', 'añadir a la cesta', 'comprar ahora', 'agregar al carrito', 'add to cart'],
    apparelLetterSizes: {
      all: ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'],
      core: ['S', 'M', 'L', 'XL'],
      demandWeights: {
        'XXS': 4,
        'XS': 10,
        'S': 20,
        'M': 28,
        'L': 24,
        'XL': 10,
        'XXL': 4
      }
    },
    footwearSizes: {
      all: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
      core: ['38', '39', '40', '41', '42'],
      demandWeights: {
        '36': 5,
        '37': 8,
        '38': 14,
        '39': 16,
        '40': 18,
        '41': 15,
        '42': 15,
        '43': 10,
        '44': 6,
        '45': 3
      }
    },
    apparelProductKeywords: /\b(camisa|camiseta|sudadera|chaqueta|abrigo|pantalón|pantalon|vaquero|jeans|vestido|falda|jersey|blusa|ropa)\b/i,
    footwearProductKeywords: /\b(zapato|zapatos|zapatilla|zapatillas|bota|botas|sandalia|mocasín|calzado)\b/i,
    legalCompliance: {
      taxIdLabel: 'Aviso Legal & NIF/CIF',
      privacyLawName: 'RGPD & LOPDGDD / LSSI-CE',
      returnWindowDays: 14,
      returnLawName: 'Derecho de desistimiento de 14 días (LGDCU)',
      mandatoryImprintLabel: 'Aviso Legal & Condiciones Generales',
      detectionKeywords: {
        privacy: ['política de privacidad', 'privacidad', 'rgpd', 'cookies', 'protección de datos'],
        returns: ['desistimiento', '14 días', 'devoluciones', 'cambios', 'reembolso'],
        imprintOrId: ['aviso legal', 's.l.', 's.a.', 'nif', 'cif', 'términos y condiciones']
      }
    },
    dominantErpSystems: ['Holded ERP', 'Odoo', 'SAP Business One', 'Amphora WMS']
  },

  'pt-BR': {
    locale: 'pt-BR',
    countryName: 'Brasil',
    regionLabel: 'Brasil (LATAM)',
    flagEmoji: '🇧🇷',
    currencyCode: 'BRL',
    currencySymbol: 'R$',
    decimalSeparator: ',',
    thousandsSeparator: '.',
    paymentIncentives: {
      primaryMethodName: 'Pix com Desconto + Parcelamento sem Juros',
      badgeLabel: '5% a 10% OFF no Pix Instantâneo',
      detectionPatterns: [
        /pix/i,
        /desconto\s+no\s+pix/i,
        /economize\s+no\s+pix/i,
        /à\s*vista\s+no\s+pix/i
      ],
      bnplProviders: ['Pix Instantâneo (BCB)', 'Parcelamento 12x sem Juros', 'NuPay']
    },
    shippingKeywords: ['frete grátis', 'frete gratis', 'envio imediato', 'entrega para todo o brasil', 'frete fixo'],
    sizeGuideKeywords: ['tabela de medidas', 'guia de tamanhos', 'provador virtual', 'sizebay', 'kiwisizing', 'size_chart', 'size-chart'],
    buyButtonKeywords: ['comprar', 'adicionar', 'adicionar à sacola', 'adicionar ao carrinho', 'comprar agora'],
    apparelLetterSizes: {
      all: ['PP', 'P', 'M', 'G', 'GG', 'XG', 'EG', 'XGG', 'G1', 'G2', 'G3', 'G4'],
      core: ['P', 'M', 'G', 'GG'],
      demandWeights: {
        'PP': 5,
        'P': 15,
        'M': 25,
        'G': 30,
        'GG': 18,
        'XG': 12,
        'XGG': 8,
        'EG': 8,
        'G1': 5,
        'G2': 2,
        'G3': 1
      }
    },
    footwearSizes: {
      all: ['33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
      core: ['37', '38', '39', '40', '41', '42'],
      demandWeights: {
        '34': 4,
        '35': 6,
        '36': 8,
        '37': 12,
        '38': 22,
        '39': 20,
        '40': 28,
        '41': 20,
        '42': 22,
        '43': 10,
        '44': 8,
        '46': 5
      }
    },
    apparelProductKeywords: /camis|blus|cal[cç]a|jaqueta|moletom|vestido|short|bermuda|conjunto|biqu[ií]ni|mai[oô]|legging|top|casaco|colete|polo|regata|macac[aã]o|jardineira|saia|kimono|cueca|suti[aã]|lingerie|pijama|su[eé]ter|tric[oô]/i,
    footwearProductKeywords: /bota|botina|t[eê]nis|sapato|sand[aá]lia|chinelo|coturno|mocassim|scarpin|sapatilha/i,
    legalCompliance: {
      taxIdLabel: 'CNPJ no Rodapé (Decreto 7.962/2013)',
      privacyLawName: 'LGPD (Lei nº 13.709/2018)',
      returnWindowDays: 7,
      returnLawName: 'CDC Art. 49 (7 Dias de Arrependimento)',
      mandatoryImprintLabel: 'CNPJ e Razão Social',
      detectionKeywords: {
        privacy: ['privacidade', 'lgpd', 'política de privacidade', 'termos de uso'],
        returns: ['7 dias', 'sete dias', 'devolu', 'troca', 'arrependimento'],
        imprintOrId: ['cnpj', 'ltda', 's.a.', 'razão social', 'razao social']
      }
    },
    dominantErpSystems: ['Sankhya ERP', 'Bling ERP', 'Tiny ERP', 'Magis5 Hub']
  }
};

export const MARKET_PROFILES: Record<StoreLocaleId, MarketProfile> = Object.fromEntries(
  (Object.entries(RAW_MARKET_PROFILES) as [StoreLocaleId, typeof RAW_MARKET_PROFILES['en-US']][]).map(([key, raw]) => [
    key,
    {
      ...raw,
      id: raw.locale,
      country: raw.countryName,
      currency: raw.currencyCode,
      legalFrameworkName: `${raw.legalCompliance.privacyLawName} / ${raw.legalCompliance.returnLawName}`,
      legalEntityKeywords: raw.legalCompliance.detectionKeywords.imprintOrId,
      privacyLawKeywords: raw.legalCompliance.detectionKeywords.privacy,
      returnRightKeywords: raw.legalCompliance.detectionKeywords.returns,
      localPaymentIncentiveKeywords: raw.paymentIncentives.bnplProviders.map(p => p.toLowerCase().split(' ')[0]),
      freeShippingKeywords: raw.shippingKeywords,
      paymentIncentiveBadgeLabel: raw.paymentIncentives.badgeLabel
    }
  ])
) as Record<StoreLocaleId, MarketProfile>;

export const SUPPORTED_LOCALES: { locale: StoreLocaleId; label: string; flag: string; currencySymbol: string }[] = [
  { locale: 'pt-BR', label: 'Português (BR)', flag: '🇧🇷', currencySymbol: 'R$' },
  { locale: 'en-US', label: 'English (US)', flag: '🇺🇸', currencySymbol: '$' },
  { locale: 'en-GB', label: 'English (UK)', flag: '🇬🇧', currencySymbol: '£' },
  { locale: 'de-DE', label: 'Deutsch (DE)', flag: '🇩🇪', currencySymbol: '€' },
  { locale: 'fr-FR', label: 'Français (FR)', flag: '🇫🇷', currencySymbol: '€' },
  { locale: 'es-ES', label: 'Español (ES)', flag: '🇪🇸', currencySymbol: '€' }
];

/**
 * 🌐 Automatically detects the store's target country/market profile from URL, HTML and currency signals.
 * Preserves 100% backward compatibility with Brazilian stores while accurately identifying US, UK, DE, FR, ES stores.
 */
export function detectStoreMarketProfile(
  urlOrDomain: string = '',
  html: string = '',
  currencyCode?: string,
  fallbackLocale: StoreLocaleId = 'pt-BR'
): MarketProfile {
  const rawUrlLower = String(urlOrDomain || '').toLowerCase();
  const cleanDom = rawUrlLower
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '');
  const htmlLower = String(html || '').toLowerCase();

  // Direct locale ID match if urlOrDomain or currencyCode is passed as a locale ID ('en-US', 'de-DE', etc.)
  if (urlOrDomain in MARKET_PROFILES) {
    return MARKET_PROFILES[urlOrDomain as StoreLocaleId];
  }
  if (currencyCode && currencyCode in MARKET_PROFILES) {
    return MARKET_PROFILES[currencyCode as StoreLocaleId];
  }

  // Extract currency code from HTML if not explicitly passed (e.g. Shopify.currency = {"active":"GBP"} or og:price:currency)
  let detectedCurrFromHtml = '';
  if (!currencyCode && htmlLower.length > 0) {
    const shopifyActiveMatch =
      htmlLower.match(/shopify\.currency\s*=\s*\{[^}]*"active"\s*:\s*"([a-z]{3})"/i) ||
      htmlLower.match(/"currency"\s*:\s*"([a-z]{3})"/i) ||
      htmlLower.match(/property=["'](?:og|product):price:currency["'][^>]+content=["']([a-z]{3})["']/i);
    if (shopifyActiveMatch && shopifyActiveMatch[1]) {
      detectedCurrFromHtml = shopifyActiveMatch[1].toUpperCase();
    }
  }
  const currUpper = String(currencyCode || detectedCurrFromHtml || '').toUpperCase().trim();

  // 1. Explicit Currency Code Override (if unambiguous)
  if (currUpper === 'BRL') return MARKET_PROFILES['pt-BR'];
  if (currUpper === 'GBP') return MARKET_PROFILES['en-GB'];
  if (currUpper === 'USD') {
    // Still check if HTML explicitly declares UK/DE/FR/ES locale before defaulting to en-US
    if (/lang=["']de/i.test(htmlLower)) return MARKET_PROFILES['de-DE'];
    if (/lang=["']fr/i.test(htmlLower)) return MARKET_PROFILES['fr-FR'];
    if (/lang=["']es/i.test(htmlLower)) return MARKET_PROFILES['es-ES'];
    if (/lang=["']pt/i.test(htmlLower)) return MARKET_PROFILES['pt-BR'];
    if (/lang=["']en-gb/i.test(htmlLower)) return MARKET_PROFILES['en-GB'];
    return MARKET_PROFILES['en-US'];
  }

  // 2. Country-Code Top-Level Domains (ccTLDs) & Explicit Country Subdomains (uk., de., fr., es., br.)
  if (cleanDom.endsWith('.com.br') || cleanDom.endsWith('.br') || cleanDom.startsWith('br.')) {
    return MARKET_PROFILES['pt-BR'];
  }
  if (cleanDom.endsWith('.co.uk') || cleanDom.endsWith('.uk') || cleanDom.startsWith('uk.') || rawUrlLower.includes('/en-gb')) {
    return MARKET_PROFILES['en-GB'];
  }
  if (cleanDom.endsWith('.de') || cleanDom.endsWith('.at') || cleanDom.endsWith('.ch') || cleanDom.startsWith('de.') || rawUrlLower.includes('/de-de')) {
    return MARKET_PROFILES['de-DE'];
  }
  if (cleanDom.endsWith('.fr') || cleanDom.startsWith('fr.') || rawUrlLower.includes('/fr-fr')) {
    return MARKET_PROFILES['fr-FR'];
  }
  if (cleanDom.endsWith('.es') || cleanDom.startsWith('es.') || rawUrlLower.includes('/es-es')) {
    return MARKET_PROFILES['es-ES'];
  }
  if (cleanDom.endsWith('.us') || cleanDom.startsWith('us.') || rawUrlLower.includes('/en-us')) {
    return MARKET_PROFILES['en-US'];
  }

  // 3. Explicit EUR currency with language disambiguation
  if (currUpper === 'EUR') {
    if (/lang=["']fr/i.test(htmlLower) || htmlLower.includes('mentions légales') || htmlLower.includes('ajouter au panier') || htmlLower.includes('livraison gratuite')) {
      return MARKET_PROFILES['fr-FR'];
    }
    if (/lang=["']es/i.test(htmlLower) || htmlLower.includes('añadir al carrito') || htmlLower.includes('envío gratis') || htmlLower.includes('aviso legal')) {
      return MARKET_PROFILES['es-ES'];
    }
    return MARKET_PROFILES['de-DE'];
  }

  // 4. HTML Language / Currency / Legal Signals on Generic TLDs (.com, .shop, .store, .co, .io)
  if (htmlLower.length > 0) {
    const hasBrazilianSignals =
      /\bcnpj\b|\d{2}\.\d{3}\.?\d{3}\/\d{4}-\d{2}|frete\s+gr[aá]tis|desconto\s+no\s+pix|\blgpd\b|trocas\s+e\s+devolu/i.test(htmlLower) ||
      /lang=["']pt/i.test(htmlLower);
    if (hasBrazilianSignals) {
      return MARKET_PROFILES['pt-BR'];
    }

    if (
      /lang=["']de/i.test(htmlLower) ||
      /\b(impressum|widerrufsrecht|in den warenkorb|kostenloser versand|größentabelle|dsgvo)\b/i.test(htmlLower)
    ) {
      return MARKET_PROFILES['de-DE'];
    }

    if (
      /lang=["']fr/i.test(htmlLower) ||
      /\b(mentions légales|ajouter au panier|livraison gratuite|guide des tailles)\b/i.test(htmlLower)
    ) {
      return MARKET_PROFILES['fr-FR'];
    }

    if (
      /lang=["']es/i.test(htmlLower) ||
      /\b(añadir al carrito|envío gratis|guía de tallas|derecho de desistimiento)\b/i.test(htmlLower)
    ) {
      return MARKET_PROFILES['es-ES'];
    }

    if (
      /lang=["']en-gb/i.test(htmlLower) ||
      /£\s*\d+|\bclearpay\b|\bfree uk delivery\b|\bregistered in england\b/i.test(htmlLower)
    ) {
      return MARKET_PROFILES['en-GB'];
    }

    if (
      /lang=["']en/i.test(htmlLower) ||
      /\$\s*\d+|\b(add to cart|add to bag|free shipping|size chart|size guide|shop pay|afterpay|ccpa|do not sell my personal information)\b/i.test(htmlLower)
    ) {
      return MARKET_PROFILES['en-US'];
    }
  }

  // 5. Domain-level heuristics when HTML is empty or minimal
  if (
    cleanDom.includes('duasdesign.com') ||
    cleanDom.includes('oficinareserva.com') ||
    cleanDom.includes('loja') ||
    cleanDom.includes('brasil') ||
    cleanDom.includes('agro') ||
    cleanDom.includes('couro') ||
    cleanDom.includes('whey')
  ) {
    return MARKET_PROFILES['pt-BR'];
  }

  if (/\b(uk|britain|london)\b/i.test(cleanDom)) {
    return MARKET_PROFILES['en-GB'];
  }

  const knownGlobalEnglishDomains = [
    'gymshark.com',
    'allbirds.com',
    'fashionnova.com',
    'brooklinen.com',
    'chubbies.com',
    'glossier.com',
    'skims.com',
    'kith.com',
    'aloyoga.com',
    'vuoriclothing.com',
    'warbyparker.com',
    'bombas.com',
    'ruggable.com',
    'colourpop.com',
    'steveradden.com',
    'princesspolly.com'
  ];
  if (
    knownGlobalEnglishDomains.some(d => cleanDom.includes(d)) ||
    /\b(us|usa|global|apparel|footwear|sneaker|streetwear|wear|clothing|athletic|fitness)\b/i.test(cleanDom)
  ) {
    return MARKET_PROFILES['en-US'];
  }

  return MARKET_PROFILES[fallbackLocale] || MARKET_PROFILES['pt-BR'];
}

