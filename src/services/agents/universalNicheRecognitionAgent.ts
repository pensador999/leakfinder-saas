// ==============================================================================
// 🌐 ADSHIELD UNIVERSAL NICHE & E-COMMERCE STRUCTURE RECOGNITION AGENT
// Detects ANY e-commerce niche (fashion, auto parts, electronics, beauty, furniture, agro)
// and adapts catalog audit rules, variant checks & conversion leakage metrics dynamically!
// ==============================================================================

import type { RealSiteData } from '../siteInspector.ts';

export type UniversalNicheCategory = 
  | 'MODA_VESTUARIO'
  | 'CALCADOS_CALCADISTA'
  | 'AUTOPECAS_FERRAMENTAS'
  | 'BELEZA_COSMETICOS'
  | 'CASA_MOVEIS_DECORACAO'
  | 'ELETRONICOS_INFORMATICA'
  | 'SUPLEMENTOS_FARMACIA'
  | 'AGROPECUARIA_PET'
  | 'PESCA_CAMPING_OUTDOOR'
  | 'JOIAS_ACESSORIOS'
  | 'VAREJO_GERAL_MULTI';

export interface NicheAdaptationProfile {
  nicheId: UniversalNicheCategory;
  nicheLabel: string;
  iconName: string;
  primaryVariantTypes: string[]; // e.g. ['Tamanho (PP-G2)'] vs ['Voltagem (110V/220V)', 'Ano/Modelo']
  mandatoryAddonWidget: string;  // e.g. 'Tabela de Medidas' vs 'Filtro de Compatibilidade Veicular'
  criticalLeakPoints: string[];
  recommendedCallToAction: string;
  sampleBrands: string[];
  description: string;
}

export interface UniversalNicheAnalysisResult {
  detectedNiche: UniversalNicheCategory;
  confidenceScore: number;
  nicheProfile: NicheAdaptationProfile;
  detectedKeywords: string[];
  navigationStructureType: 'MEGA_MENU' | 'CATEGORIA_SIMPLES' | 'DROPSHIPPING_MINIMALISTA';
  adaptedRulesSummary: string;
  allAvailableNiches: NicheAdaptationProfile[];
}

export const UNIVERSAL_NICHE_PROFILES: Record<UniversalNicheCategory, NicheAdaptationProfile> = {
  MODA_VESTUARIO: {
    nicheId: 'MODA_VESTUARIO',
    nicheLabel: 'Moda, Roupas & Vestuário',
    iconName: 'Shirt',
    primaryVariantTypes: ['Tamanho (PP, P, M, G, GG, XG, G1, G2)', 'Cor / Estampa'],
    mandatoryAddonWidget: 'Tabela de Medidas & Provador Virtual',
    criticalLeakPoints: [
      'Anúncio de produto com grade furada nos tamanhos de maior curva (G/GG)',
      'Ausência de Guia de Medidas com busto/cintura/quadril em cm',
      'Fotos sem modelo humano vestindo a peça'
    ],
    recommendedCallToAction: 'Adicionar à Sacola / Comprar Agora',
    sampleBrands: ['Renner', 'Amaro', 'Insider Store', 'BRK Agro'],
    description: 'Audita disponibilidade de tamanhos do PP ao G2, tabela de medidas interativa e fotos com modelo.'
  },
  CALCADOS_CALCADISTA: {
    nicheId: 'CALCADOS_CALCADISTA',
    nicheLabel: 'Calçados, Tênis & Botas',
    iconName: 'Footprints',
    primaryVariantTypes: ['Numeração (34 a 45)', 'Largura de Forma', 'Cor'],
    mandatoryAddonWidget: 'Guia de Calce / Medidor de Pé em Centímetros',
    criticalLeakPoints: [
      'Falta das numerações mais vendidas (36/37 feminino e 40/41 masculino)',
      'Falta de indicação de "Forma Normal / Forma Pequena"',
      'Ausência de política explícita de primeira troca grátis'
    ],
    recommendedCallToAction: 'Selecionar Numeração & Comprar',
    sampleBrands: ['Anacapri', 'Yuool', 'Kildare', 'Botas Agro'],
    description: 'Verifica numerações de calçados, orientação de tamanho de forma e garantia de troca sem custo.'
  },
  AUTOPECAS_FERRAMENTAS: {
    nicheId: 'AUTOPECAS_FERRAMENTAS',
    nicheLabel: 'Autopeças, Moto & Ferramentas',
    iconName: 'Wrench',
    primaryVariantTypes: ['Ano / Modelo do Veículo', 'Lado (Direito/Esquerdo)', 'Voltagem (110V/220V/Bivolt)'],
    mandatoryAddonWidget: 'Seletor de Compatibilidade Veicular (Ano/Marca/Modelo)',
    criticalLeakPoints: [
      'Produto sem especificação de código OEM ou montadora compatível',
      'Falta de indicação de voltagem ou lado da peça',
      'Ausência de cálculo de frete pesado / transportadora'
    ],
    recommendedCallToAction: 'Verificar Compatibilidade & Comprar',
    sampleBrands: ['Hipervarejo', 'Connect Parts', 'Dutra Máquinas'],
    description: 'Inspeciona código original OEM, compatibilidade de ano/modelo e seleção de voltagem.'
  },
  BELEZA_COSMETICOS: {
    nicheId: 'BELEZA_COSMETICOS',
    nicheLabel: 'Beleza, Cosméticos & Skincare',
    iconName: 'Sparkles',
    primaryVariantTypes: ['Tom de Pele / Cor', 'Volumetria (30ml, 50ml, 100ml)', 'Tipo de Pele (Oleosa/Seca)'],
    mandatoryAddonWidget: 'Composição de Ingredientes & Registro Anvisa',
    criticalLeakPoints: [
      'Falta de swatch ou amostra visual do tom de pele',
      'Ausência da volumetria (ml/g) no título do produto',
      'Falta de selo Cruelty-Free, Vegano ou Dermatologicamente Testado'
    ],
    recommendedCallToAction: 'Adicionar ao Carrinho',
    sampleBrands: ['Simple Organic', 'Sallve', 'O Boticário', 'Creamy'],
    description: 'Audita tons de maquiagem, volumetria clara (ml/g), selos dermatológicos e modo de uso.'
  },
  CASA_MOVEIS_DECORACAO: {
    nicheId: 'CASA_MOVEIS_DECORACAO',
    nicheLabel: 'Casa, Móveis & Decoração',
    iconName: 'Armchair',
    primaryVariantTypes: ['Dimensões (Altura x Largura x Profundidade)', 'Acabamento / Madeira', 'Tecido / Cor'],
    mandatoryAddonWidget: 'Guia de Medidas do Móvel & Manual de Montagem',
    criticalLeakPoints: [
      'Produto sem dimensões exatas (AxLxP) visíveis antes da rolagem',
      'Falta de aviso se o produto é entregue montado ou desmontado',
      'Prazo de fabricação ou frete cubado não transparentes'
    ],
    recommendedCallToAction: 'Comprar Móvel',
    sampleBrands: ['Mobly', 'MadeiraMadeira', 'Tok&Stok', 'Westwing'],
    description: 'Inspeciona dimensões técnicas em cm, acabamento de cor e clareza sobre montagem e frete.'
  },
  ELETRONICOS_INFORMATICA: {
    nicheId: 'ELETRONICOS_INFORMATICA',
    nicheLabel: 'Eletrônicos, Celulares & Informática',
    iconName: 'Smartphone',
    primaryVariantTypes: ['Capacidade (128GB, 256GB, 512GB)', 'Voltagem (110V / 220V)', 'Cor'],
    mandatoryAddonWidget: 'Tabela de Especificações Técnicas & Homologação Anatel',
    criticalLeakPoints: [
      'Voltagem do equipamento não selecionável (gera devoluções por queima)',
      'Ausência do selo de homologação Anatel e garantia de 12 meses',
      'Falta de especificações de processador, memória RAM e conexões'
    ],
    recommendedCallToAction: 'Comprar Agora',
    sampleBrands: ['Kabum', 'Pichau', 'Fast Shop', 'iPlace'],
    description: 'Audita seleção de voltagem, capacidade de armazenamento, garantia e selo Anatel.'
  },
  SUPLEMENTOS_FARMACIA: {
    nicheId: 'SUPLEMENTOS_FARMACIA',
    nicheLabel: 'Suplementos, Saúde & Nutrição',
    iconName: 'HeartPulse',
    primaryVariantTypes: ['Sabor (Baunilha, Chocolate, Morango)', 'Peso / Porções (900g, 1.8kg)', 'Cápsulas'],
    mandatoryAddonWidget: 'Tabela Nutricional Completa & Modo de Ingestão',
    criticalLeakPoints: [
      'Sabores mais populares esgotados com anúncio ativo',
      'Foto ilegível da tabela nutricional e laudo de pureza',
      'Falta de data de validade garantida do lote'
    ],
    recommendedCallToAction: 'Escolher Sabor & Comprar',
    sampleBrands: ['Growth Supplements', 'Max Titanium', 'Dr. Peanut', 'IntegralMedica'],
    description: 'Verifica sabores em estoque, imagem nítida da tabela nutricional e laudos laboratoriais.'
  },
  AGROPECUARIA_PET: {
    nicheId: 'AGROPECUARIA_PET',
    nicheLabel: 'Agropecuária, Campo & Pet Shop',
    iconName: 'Tractor',
    primaryVariantTypes: ['Porte / Idade do Animal', 'Volume (1kg, 15kg, 20L)', 'Tamanho / Medida'],
    mandatoryAddonWidget: 'Bula de Aplicação / Modo de Uso no Campo',
    criticalLeakPoints: [
      'Falta de indicação para qual espécie animal o item se destina',
      'Falta de dosagem por hectare ou por peso do animal',
      'Ausência de cálculo de frete para zona rural / transportadora'
    ],
    recommendedCallToAction: 'Adicionar ao Carrinho',
    sampleBrands: ['Petz', 'Cobasi', 'BRK Agro', 'Agroline'],
    description: 'Inspeciona dosagem, porte do animal, especificações de uso no campo e frete agro.'
  },
  JOIAS_ACESSORIOS: {
    nicheId: 'JOIAS_ACESSORIOS',
    nicheLabel: 'Joias, Relógios & Semijoias',
    iconName: 'Gem',
    primaryVariantTypes: ['Aro do Anel (12 ao 26)', 'Banho (Ouro 18k, Prata 925, Ródio)', 'Comprimento (45cm, 60cm)'],
    mandatoryAddonWidget: 'Medidor Virtual de Anel & Certificado de Autenticidade',
    criticalLeakPoints: [
      'Aros mais comuns de anel (16, 18, 20) esgotados',
      'Falta de certificado de garantia do teor do metal (Prata 925/Ouro 18k)',
      'Ausência de foto do produto no corpo para noção de escala'
    ],
    recommendedCallToAction: 'Adicionar à Sacola',
    sampleBrands: ['Vivara', 'Pandora', 'Monte Carlo', 'Romanel'],
    description: 'Audita tabela de aros de anel, certificado de garantia dos metais nobres e fotos de escala.'
  },
  PESCA_CAMPING_OUTDOOR: {
    nicheId: 'PESCA_CAMPING_OUTDOOR',
    nicheLabel: 'Pesca Esportiva, Náutica & Outdoor',
    iconName: 'Fish',
    primaryVariantTypes: ['Ação / Libragem (Varas)', 'Tamanho / Peso (Iscas)', 'Tamanho UV50+ (Vestuário)'],
    mandatoryAddonWidget: 'Especificações de Libragem, Ação & Proteção Solar UV50+',
    criticalLeakPoints: [
      'Equipamentos de pesca (iscas, varas, carretilhas) avaliados erroneamente como vestuário',
      'Falta de indicação de proteção solar UV50+ no vestuário técnico esportivo',
      'Ausência de especificações de gramatura e profundidade de nado em iscas artificiais'
    ],
    recommendedCallToAction: 'Comprar Equipamento / Vestuário',
    sampleBrands: ['BRK Fishing', 'Marine Sports', 'Daiwa', 'Shimano'],
    description: 'Aplica regras especializadas para pesca e esportes náuticos: isenta equipamentos e acessórios de grade PP-G2 e audita proteção UV50+.'
  },
  VAREJO_GERAL_MULTI: {
    nicheId: 'VAREJO_GERAL_MULTI',
    nicheLabel: 'Varejo Geral, Presentes & Multi-Categorias',
    iconName: 'ShoppingBag',
    primaryVariantTypes: ['Modelo / Variação', 'Cor', 'Kit / Quantidade'],
    mandatoryAddonWidget: 'Calculador de Frete & Política de Garantia',
    criticalLeakPoints: [
      'Variações de kit sem desconto progressivo visível',
      'Falta de depoimentos com foto de clientes reais',
      'Botão de compra fora da área de toque no celular'
    ],
    recommendedCallToAction: 'Comprar Agora',
    sampleBrands: ['Magalu', 'Americanas', 'Shopee', 'Mercado Livre'],
    description: 'Aplica regras universais de CRO, checkout ágil, prova social e ergonomia mobile.'
  }
};

/**
 * Universal Classifier: Scans HTML, Meta Tags and Domain to categorize ANY e-commerce
 */
export function classifyUniversalNiche(realSiteData: RealSiteData): UniversalNicheAnalysisResult {
  const textCorpus = `${realSiteData.title} ${realSiteData.metaDescription} ${realSiteData.h1List.join(' ')} ${realSiteData.domain} ${realSiteData.detectedKeywords.join(' ')}`.toLowerCase();

  let detectedNiche: UniversalNicheCategory = 'VAREJO_GERAL_MULTI';
  let highestScore = 0;
  let matchedKeywords: string[] = [];

  // Keyword Matrix for instant high-confidence classification
  const NICHE_KEYWORDS: Record<UniversalNicheCategory, string[]> = {
    MODA_VESTUARIO: ['roupa', 'vestido', 'camisa', 'camiseta', 'calça', 'moda', 'fashion', 'jeans', 'casaco', 'tamanho', 'tabela de medidas', 'look', 'cropped', 'manga'],
    CALCADOS_CALCADISTA: ['sapato', 'tênis', 'bota', 'sandália', 'chinelo', 'calçado', 'sneaker', 'salto', 'mocassim', 'numeração', 'coturno', 'botina', 'calce'],
    AUTOPECAS_FERRAMENTAS: ['autopeças', 'carro', 'moto', 'veículo', 'motor', 'farol', 'freio', 'parafuso', 'ferramenta', 'óleo', 'bateria', 'suspensão', 'oem', 'peça', 'motors', 'racing', 'kart', 'track day', 'motocross', 'automotivo', 'balaclava'],
    BELEZA_COSMETICOS: ['cosmético', 'maquiagem', 'skincare', 'perfume', 'batom', 'cabelo', 'shampoo', 'creme', 'sérum', 'facial', 'beleza', 'dermatológico'],
    CASA_MOVEIS_DECORACAO: ['móvel', 'sofá', 'mesa', 'cadeira', 'cama', 'colchão', 'decoração', 'tapete', 'luminária', 'cozinha', 'quarto', 'sala', 'armário'],
    ELETRONICOS_INFORMATICA: ['celular', 'smartphone', 'notebook', 'computador', 'fone', 'gamer', 'placa', 'eletrônico', 'teclado', 'monitor', 'tv', '110v', '220v'],
    SUPLEMENTOS_FARMACIA: ['suplemento', 'whey', 'creatina', 'proteína', 'vitamina', 'farmácia', 'saúde', 'termogênico', 'cápsula', 'nutrição', 'anvisa'],
    AGROPECUARIA_PET: ['agro', 'campo', 'fazenda', 'pecuária', 'pet', 'ração', 'cão', 'gato', 'bovino', 'cavalo', 'agrícola', 'veterinário', 'sementes'],
    PESCA_CAMPING_OUTDOOR: ['pesca', 'fishing', 'isca', 'anzol', 'carretilha', 'molinete', 'vara de pescar', 'linha de pesca', 'multifilamento', 'fluorocarbon', 'camping', 'outdoor', 'peixe', 'tucunaré'],
    JOIAS_ACESSORIOS: ['joia', 'anel', 'colar', 'brinco', 'prata 925', 'ouro 18k', 'aliança', 'pingente', 'pulseira', 'relojaria', 'semijoia'],
    VAREJO_GERAL_MULTI: ['loja', 'comprar', 'oferta', 'produtos', 'brasil', 'frete grátis']
  };

  for (const [niche, keywords] of Object.entries(NICHE_KEYWORDS) as [UniversalNicheCategory, string[]][]) {
    let score = 0;
    const currentMatched: string[] = [];

    keywords.forEach(kw => {
      if (textCorpus.includes(kw)) {
        score += kw.length > 5 ? 2 : 1;
        currentMatched.push(kw);
      }
    });

    if (score > highestScore) {
      highestScore = score;
      detectedNiche = niche;
      matchedKeywords = currentMatched;
    }
  }

  // Specialized domain recognition
  if (realSiteData.domain.includes('fishing') || realSiteData.domain.includes('pesca')) {
    detectedNiche = 'PESCA_CAMPING_OUTDOOR';
    highestScore = Math.max(highestScore, 10);
  } else if (realSiteData.domain.includes('agro') || realSiteData.domain.includes('campo')) {
    detectedNiche = 'AGROPECUARIA_PET';
    highestScore = Math.max(highestScore, 8);
  } else if (realSiteData.domain.includes('motors') || realSiteData.domain.includes('racing') || realSiteData.domain.includes('automotivo')) {
    detectedNiche = 'AUTOPECAS_FERRAMENTAS';
    highestScore = Math.max(highestScore, 9);
  } else if (realSiteData.domain.includes('calcados') || realSiteData.domain.includes('botas') || realSiteData.domain.includes('shoes')) {
    detectedNiche = 'CALCADOS_CALCADISTA';
    highestScore = Math.max(highestScore, 9);
  }

  const confidenceScore = Math.min(99, Math.max(75, highestScore * 12));
  const profile = UNIVERSAL_NICHE_PROFILES[detectedNiche];

  return {
    detectedNiche,
    confidenceScore,
    nicheProfile: profile,
    detectedKeywords: matchedKeywords.slice(0, 8),
    navigationStructureType: 'MEGA_MENU',
    adaptedRulesSummary: `O motor AdShield calibrou as regras de auditoria para o nicho de "${profile.nicheLabel}". Os diagnósticos agora avaliam especificamente ${profile.primaryVariantTypes.join(', ')} e verificam a presença de ${profile.mandatoryAddonWidget}.`,
    allAvailableNiches: Object.values(UNIVERSAL_NICHE_PROFILES)
  };
}
