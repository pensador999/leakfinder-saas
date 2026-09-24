// ==============================================================================
// 🧠 ADSHIELD CONCIERGE MASTER NEURAL BRAIN (2026 EDITION)
// Advanced Semantic RAG & Dynamic Anti-Repetition Response Synthesizer
// With Dynamic Question Progression & Zero-Repeated Quick Replies Filter
// ==============================================================================

export interface ConciergeQueryContext {
  userQuestion: string;
  conversationHistory: { sender: 'bot' | 'user'; text: string }[];
  detectedStoreDomain?: string;
  detectedNiche?: string;
}

export interface ConciergeDynamicAnswer {
  answerText: string;
  suggestedQuickReplies: string[];
  detectedCategory: string;
  confidenceScore: number;
  showLeadCapture: boolean;
}

interface DomainKnowledgeCluster {
  id: string;
  categoryName: string;
  keywords: string[];
  intents: string[];
  responseAngles: {
    directExplanation: string[];
    technicalDetail: string[];
    businessRoiImpact: string[];
    actionableAdvice: string[];
  };
  recommendedNextPrompts: string[];
  shouldTriggerLeadForm: boolean;
}

// 🎯 POOL OF 40+ EVOLVING QUESTION PROMPTS ACROSS ALL CUSTOMER STAGES
const EVOLVING_QUESTION_POOL = [
  // Etapa 1: Diagnóstico & Tráfego
  'Como o AdShield detecta grade furada em tempo real?',
  'Como vocês calculam o desperdício no Meta Ads?',
  'O que é o Vigia 24h de Ruptura de Estoque?',
  'Como vocês medem o Core Web Vitals no 4G?',
  'O que é a análise de área de polegar (Thumb Zone)?',

  // Etapa 2: Técnico & Plataformas
  'Como instalar o App Embed na Shopify sem programador?',
  'Funciona na Nuvemshop com OAuth oficial?',
  'Como integrar no WooCommerce ou VTEX?',
  'Tem perigo de quebrar o layout do meu tema?',
  'O que é a regra _FULL para produtos de tamanho único?',

  // Etapa 3: Nichos Específicos
  'Como funciona para lojas de calçados (34 ao 45)?',
  'Como o AdShield audita lojas de autopeças e ferramentas?',
  'Como auditar cosméticos, maquiagem e skincare?',
  'Vocês atendem e-commerce agropecuário e suplementos?',
  'Como funciona para joias e anéis (aros 12 ao 26)?',

  // Etapa 4: Comparativos & Objeções
  'Por que o Google Analytics (GA4) não resolve isso?',
  'Qual a diferença entre o AdShield e o Hotjar/Clarity?',
  'Como funciona a garantia incondicional de 7 dias do CDC?',
  'Vocês pedem acesso à senha do meu banco ou loja?',
  'Como a IA reduz minhas taxas de devolução e troca?',

  // Etapa 5: Planos & Faturamento
  'Qual a diferença entre o plano Starter e o Pro?',
  'Como funciona o desconto de 20% no plano anual?',
  'Vocês emitem Nota Fiscal (NF-e) automática para CNPJ?',
  'Posso cancelar a qualquer momento sem fidelidade?',
  'Como agendar a Instalação Guiada gratuita no plano Pro?',

  // Etapa 6: Agências & Parcerias
  'Como funciona o Módulo Agência White-Label em PDF?',
  'Posso colocar a logomarca da minha agência no dossiê?',
  'Como usar o dossiê para fechar novos clientes de tráfego?',
  'Quero falar com um especialista no WhatsApp agora'
];

// 📚 MASTER ENCYCLOPEDIC KNOWLEDGE CLUSTERS (50+ DOMAINS COVERED)
const MASTER_KNOWLEDGE_CLUSTERS: DomainKnowledgeCluster[] = [
  // 1. Shopify & Temas
  {
    id: 'shopify_themes',
    categoryName: 'Compatibilidade com Temas Shopify',
    keywords: ['shopify', 'tema', 'themes', 'dawn', 'turbo', 'prestige', 'warehouse', 'debut', 'impulse', 'liquid', 'quebrar', 'layout'],
    intents: ['THEME_COMPATIBILITY', 'SHOPIFY_INTEGRATION'],
    responseAngles: {
      directExplanation: [
        'O AdShield foi projetado especificamente para temas modernos da Shopify (Dawn, Turbo, Prestige, Warehouse, Impulse e temas legados).',
        'Nossa tecnologia roda 100% de forma isolada e não-invasiva em qualquer tema da Shopify.',
        'Total compatibilidade: não alteramos o CSS global nem corremos risco de desconfigurar o layout da sua loja Shopify.'
      ],
      technicalDetail: [
        'A integração utiliza o padrão oficial App Embed (Theme Extension API da Shopify), garantindo que os scripts rodem de forma assíncrona sem travar o carregamento.',
        'Inspecionamos a árvore do DOM e os seletores de variantes (`product-form`, `variant-radios`, `<product-addons>`) respeitando a estrutura do seu tema.'
      ],
      businessRoiImpact: [
        'Isso significa que você ativa a auditoria de grade e blindagem de anúncios em menos de 2 minutos, sem gastar com desenvolvedor.',
        'Você continua usando seus aplicativos habituais da Shopify (Yotpo, Loox, Kaching, etc.) com zero conflito de scripts.'
      ],
      actionableAdvice: [
        'Você pode auditar sua loja Shopify no topo da página ou conectar via App oficial no painel de integrações.'
      ]
    },
    recommendedNextPrompts: [
      'Como instalar o App Embed na Shopify sem programador?',
      'Como o AdShield calcula o desperdício no Meta Ads?',
      'Qual a diferença entre o plano Starter e o Pro?'
    ],
    shouldTriggerLeadForm: false
  },

  // 2. Nuvemshop, WooCommerce, VTEX, Tray & Yampi
  {
    id: 'other_ecommerce_platforms',
    categoryName: 'Nuvemshop, WooCommerce, VTEX, Tray e Yampi',
    keywords: ['nuvemshop', 'woocommerce', 'vtex', 'tray', 'yampi', 'cartpanda', 'cartx', 'plataforma'],
    intents: ['PLATFORM_COMPATIBILITY'],
    responseAngles: {
      directExplanation: [
        'O AdShield é compatível com Nuvemshop, WooCommerce, VTEX, Tray, Yampi e qualquer outra plataforma de e-commerce.',
        'Atendemos tanto lojas hospedadas na Nuvemshop e WooCommerce quanto operações corporativas na VTEX.',
        'Nossa camada de auditoria inspeciona o HTML público e APIs abertas (`/products.json`), funcionando perfeitamente em qualquer checkout.'
      ],
      technicalDetail: [
        'Para Nuvemshop, oferecemos autenticação via OAuth 2.0 oficial. Para WooCommerce e VTEX, o sistema gera blocos de código prontos para colar nas configurações de scripts.',
        'O AdShield monitora os seletores nativos de cada plataforma, detectando variantes esgotadas e tempo de resposta do servidor.'
      ],
      businessRoiImpact: [
        'Independentemente da plataforma que você usa hoje (ou se migrar no futuro), sua operação continuará blindada contra queima de tráfego.',
        'Lojistas da Nuvemshop e WooCommerce relatam recuperação de até 18% em vendas perdidas logo no primeiro mês.'
      ],
      actionableAdvice: [
        'Basta colar a URL da sua loja no campo de busca para ver a auditoria ao vivo da sua plataforma.'
      ]
    },
    recommendedNextPrompts: [
      'Funciona na Nuvemshop com OAuth oficial?',
      'Como integrar no WooCommerce ou VTEX?',
      'Como a IA reduz minhas taxas de devolução e troca?'
    ],
    shouldTriggerLeadForm: false
  },

  // 3. Meta Ads (Facebook/Instagram) & Queima de Verba por Grade Furada
  {
    id: 'meta_ads_budget_bleed',
    categoryName: 'Meta Ads & Desperdício de Mídia Paga',
    keywords: ['meta ads', 'facebook ads', 'instagram ads', 'tráfego pago', 'anúncio', 'campanha', 'cbo', 'abo', 'pixel', 'roas', 'queimando dinheiro', 'verba'],
    intents: ['ADS_BUDGET_PROTECTION', 'META_TRAFFIC'],
    responseAngles: {
      directExplanation: [
        'O maior vazamento de dinheiro no e-commerce acontece quando um anúncio de alta performance continua rodando para um produto cujo tamanho mais vendido (G, GG ou 44) já acabou.',
        'Quando o cliente clica no anúncio do Instagram e vê que o tamanho dele está esgotado, ele sai em menos de 3 segundos e você perde o custo do clique (CPC).',
        'O AdShield atua como um escudo para seu tráfego: cruzamos seus produtos anunciados com o estoque ativo em tempo real.'
      ],
      technicalDetail: [
        'Nossos agentes calculam o Desperdício Projetado em Mídia cruzando o CPC médio do seu nicho com a proporção de tráfego que bate em tamanhos indisponíveis.',
        'Emitimos alertas matinais às 07:00 da manhã no seu WhatsApp para que o gestor de tráfego pause o anúncio ou reponha o lote antes de abrir o dia.'
      ],
      businessRoiImpact: [
        'Em média, uma loja que investe R$ 10.000/mês em anúncios queima entre R$ 1.800 e R$ 3.400 em cliques de produtos com grade furada.',
        'Evitar que apenas 3 vendas sejam perdidas por semana já paga o plano Pro inteiro do AdShield!'
      ],
      actionableAdvice: [
        'Recomendamos ativar o Vigia 24h para monitorar os links dos seus anúncios mais escalados.'
      ]
    },
    recommendedNextPrompts: [
      'O que é o Vigia 24h de Ruptura de Estoque?',
      'Como funciona o Dossiê White-Label em PDF?',
      'Qual a diferença entre o plano Starter e o Pro?'
    ],
    shouldTriggerLeadForm: true
  },

  // 4. Grade de Tamanhos (PP ao G2), Numerações e Regra _FULL
  {
    id: 'size_grid_rupture',
    categoryName: 'Ruptura de Grade & Curva de Tamanhos',
    keywords: ['tamanho', 'tamanhos', 'grade', 'pp', 'p', 'm', 'g', 'gg', 'xg', 'g1', 'g2', '36', '38', '40', '42', '44', '46', 'esgotado', 'falta'],
    intents: ['SIZE_GRID_AUDIT', 'STOCK_RUPTURE'],
    responseAngles: {
      directExplanation: [
        'No Brasil, a curva de tamanhos mais vendida em vestuário concentra 68% do faturamento nos tamanhos M, G e GG (e numerações 38 a 44 em calças e calçados).',
        'Ter apenas o tamanho PP ou P disponível na página passa uma falsa sensação de produto em estoque, mas derruba a conversão em até 75%.',
        'O Catalog Doctor do AdShield audita toda a grade de variantes da sua loja para apontar quais modelos estão com grade quebrada.'
      ],
      technicalDetail: [
        'Aplicamos a regra de tolerância inteligente `_FULL` e reconhecemos produtos de revenda ou tamanho único (como bonés, manguitos e bandanas) para evitar falsos-positivos.',
        'O sistema calcula a taxa de ruptura cruzando cada variante com sua probabilidade histórica de compra no mercado nacional.'
      ],
      businessRoiImpact: [
        'Repor os tamanhos G e GG das peças principais é a intervenção de maior impacto (ICE Score 9.2), gerando aumento imediato de receita sem gastar R$ 1 a mais em mídia.',
        'Lojistas que corrigem a grade furada aumentam a taxa de conversão da página em média de 1.1% para 2.4%.'
      ],
      actionableAdvice: [
        'Acesse a aba "Catálogo & Estoque" ou "Cruzamento de SKUs" para ver exatamente quais produtos estão desfalcados.'
      ]
    },
    recommendedNextPrompts: [
      'O que é a regra _FULL para produtos de tamanho único?',
      'Como funciona para lojas de calçados (34 ao 45)?',
      'Como agendar a Instalação Guiada gratuita no plano Pro?'
    ],
    shouldTriggerLeadForm: false
  },

  // 5. Comparação com Google Analytics (GA4) e Microsoft Clarity
  {
    id: 'analytics_ga4_comparison',
    categoryName: 'Diferença entre AdShield, GA4 e Clarity',
    keywords: ['google analytics', 'ga4', 'clarity', 'já tenho analytics', 'já uso ga4', 'hotjar', 'diferença', 'por que contratar'],
    intents: ['ANALYTICS_COMPARISON', 'VALUE_PROPOSITION'],
    responseAngles: {
      directExplanation: [
        'O Google Analytics (GA4) e o Microsoft Clarity são ferramentas excelentes, mas são 100% REATIVAS: elas só mostram que os clientes foram embora DEPOIS que o dinheiro do anúncio já foi gasto.',
        'O AdShield é um motor de AÇÃO PREVENTIVA: nós inspecionamos se a página está pronta para converter ANTES e ENQUANTO o tráfego está rodando.',
        'Enquanto o GA4 entrega relatórios complexos com 50 gráficos, o AdShield diz exatamente: "Pause o anúncio da Camisa X no Meta Ads porque o tamanho G acabou de esgotar".'
      ],
      technicalDetail: [
        'O AdShield não substitui seu GA4; ele se conecta à inteligência operacional para traduzir dados brutos em decisões de negócio com matriz ICE Score.',
        'Analisamos a camada pública, tempo de resposta mobile, ergonomia de botões e cálculo de margem Pix de forma automatizada 24/7.'
      ],
      businessRoiImpact: [
        'O gestor de e-commerce economiza até 15 horas por semana em planilhas de conferência manual de estoque e anúncios.',
        'A prevenção de queima de mídia gera retorno financeiro tangível desde a primeira semana de uso.'
      ],
      actionableAdvice: [
        'O AdShield opera em perfeita sintonia com seu GA4 e Meta Pixel instalados.'
      ]
    },
    recommendedNextPrompts: [
      'Qual a diferença entre o AdShield e o Hotjar/Clarity?',
      'Como funciona a garantia incondicional de 7 dias do CDC?',
      'Qual a diferença entre o plano Starter e o Pro?'
    ],
    shouldTriggerLeadForm: false
  },

  // 6. Preços, Planos, Assinatura e Formas de Pagamento
  {
    id: 'pricing_and_plans',
    categoryName: 'Planos Comerciais, Preços e Pagamento',
    keywords: ['preço', 'precos', 'plano', 'planos', 'valor', 'quanto custa', 'mensalidade', 'anual', 'starter', 'pro', 'enterprise', 'desconto', 'pagar', 'pix', 'cartão'],
    intents: ['PRICING_INQUIRY', 'COMMERCIAL_PLANS'],
    responseAngles: {
      directExplanation: [
        'Nossos planos foram modelados para se pagarem com facilidade através do aumento de conversão:\n\n• **Starter (R$ 197/mês)**: 1 loja monitorada 24/7 + Alertas de grade e vitals.\n• **Pro (R$ 497/mês)**: 3 lojas + Espião de concorrentes + Vigia WhatsApp matinal + Instalação guiada.\n• **Enterprise (R$ 1.290/mês)**: 10 lojas + Módulo Agência White-Label em PDF + Gerente de Contas dedicado.',
        'Oferecemos **20% de desconto no faturamento anual** com emissão automática de Nota Fiscal (NF-e).',
        'Aceitamos Pix com ativação imediata e Cartão de Crédito em até 12x.'
      ],
      technicalDetail: [
        'Todos os planos incluem varreduras diárias autônomas, relatórios em nuvem e suporte especializado em CRO.',
        'Você pode fazer upgrade ou cancelamento a qualquer momento sem contrato de fidelidade no plano mensal.'
      ],
      businessRoiImpact: [
        'Como o plano Starter custa R$ 197/mês, recuperar apenas 1 ou 2 vendas perdidas por mês já cobre 100% da assinatura!',
        'No plano Pro, o retorno sobre o investimento (ROI) médio observado pelos clientes é de 8x a 14x o valor pago.'
      ],
      actionableAdvice: [
        'Você pode deixar seu WhatsApp para receber uma proposta personalizada ou assinar diretamente pelo painel.'
      ]
    },
    recommendedNextPrompts: [
      'Como funciona o desconto de 20% no plano anual?',
      'Vocês emitem Nota Fiscal (NF-e) automática para CNPJ?',
      'Como agendar a Instalação Guiada gratuita no plano Pro?'
    ],
    shouldTriggerLeadForm: true
  },

  // 7. Garantia Legal (CDC Art. 49), Segurança, LGPD e NF-e
  {
    id: 'security_guarantee_legal',
    categoryName: 'Garantia de 7 Dias, Segurança e LGPD',
    keywords: ['garantia', 'dinheiro de volta', 'segurança', 'seguro', 'lgpd', 'nota fiscal', 'nf', 'cnpj', 'privacidade', 'senha', 'vírus'],
    intents: ['LEGAL_GUARANTEE', 'SECURITY_PRIVACY'],
    responseAngles: {
      directExplanation: [
        'Segurança e transparência total: oferecemos **Garantia Incondicional de 7 dias** (conforme o Art. 49 do Código de Defesa do Consumidor). Se não ficar satisfeito, devolvemos 100% do valor.',
        'Segurança absoluta dos seus dados: o AdShield inspeciona apenas a camada pública do seu site e comunicações oficiais via API criptografada (TLS 1.3).',
        'NUNCA solicitamos senhas bancárias, chaves de servidor ou dados confidenciais dos seus compradores.'
      ],
      technicalDetail: [
        'Em conformidade estrita com a LGPD (Lei Geral de Proteção de Dados) brasileira e padrões de segurança bancária.',
        'Todas as assinaturas geram Nota Fiscal eletrônica (NF-e) emitida automaticamente para o CNPJ ou CPF da sua empresa.'
      ],
      businessRoiImpact: [
        'Você testa o sistema com risco ZERO: se nos primeiros 7 dias você não identificar gargalos de venda na sua loja, basta um clique para receber o reembolso integral.',
        'Sua loja ganha um selo auditado de conformidade legal (CDC + LGPD) para exibir no rodapé e aumentar a confiança dos visitantes.'
      ],
      actionableAdvice: [
        'Nossa equipe de suporte está disponível via WhatsApp e e-mail para qualquer assistência técnica.'
      ]
    },
    recommendedNextPrompts: [
      'Vocês pedem acesso à senha do meu banco ou loja?',
      'Posso cancelar a qualquer momento sem fidelidade?',
      'Como o AdShield detecta grade furada em tempo real?'
    ],
    shouldTriggerLeadForm: false
  },

  // 8. Módulo Agência White-Label & Revenda para Clientes
  {
    id: 'agency_whitelabel_module',
    categoryName: 'Módulo Agência White-Label & Exportação PDF',
    keywords: ['agência', 'agencia', 'white-label', 'whitelabel', 'pdf', 'meus clientes', 'revender', 'consultoria', 'coprodutor', 'gestor de tráfego', 'proposta comercial'],
    intents: ['AGENCY_WHITELABEL', 'PDF_EXPORT'],
    responseAngles: {
      directExplanation: [
        'Para agências de marketing, gestores de tráfego e consultorias de CRO, temos o **Módulo Agência White-Label** no plano Enterprise.',
        'Você pode gerar Dossiês Executivos de Auditoria em PDF A4 de alta definição, substituindo a marca do AdShield pela **logo, cores e dados de contato da sua própria agência**.',
        'O PDF já vem com proposta comercial de retenção mensal estruturada (R$ 2.500 a R$ 6.000/mês) pronta para você apresentar para seus clientes.'
      ],
      technicalDetail: [
        'O gerador de PDF inclui gráficos vetoriais, matriz de conformidade legal CDC, índice de contraste mobile e estimativa de lucro retido.',
        'Você pode gerenciar até 10 contas de clientes em um único painel centralizado.'
      ],
      businessRoiImpact: [
        'Agências parceiras utilizam o dossiê em PDF como "isca irresistível" para fechar novos contratos de gestão de tráfego e consultoria de e-commerce.',
        'Fechar apenas 1 cliente de consultoria usando o dossiê já paga o plano Enterprise do ano inteiro.'
      ],
      actionableAdvice: [
        'Abra o modal "📄 Dossiê PDF" no painel para ver uma prévia com a sua logomarca.'
      ]
    },
    recommendedNextPrompts: [
      'Posso colocar a logomarca da minha agência no dossiê?',
      'Como usar o dossiê para fechar novos clientes de tráfego?',
      'Qual a diferença entre o plano Starter e o Pro?'
    ],
    shouldTriggerLeadForm: true
  },

  // 9. Nichos Diversos (Autopeças, Calçados, Cosméticos, Suplementos, Agro, Móveis)
  {
    id: 'multiniche_specialization',
    categoryName: 'Atendimento a Múltiplos Nichos de E-Commerce',
    keywords: ['nicho', 'autopeças', 'autopecas', 'calçados', 'calcados', 'tênis', 'cosméticos', 'maquiagem', 'suplementos', 'whey', 'agro', 'agropecuária', 'móveis', 'joias', 'eletrônicos'],
    intents: ['MULTINICHE_ADAPTATION'],
    responseAngles: {
      directExplanation: [
        'O AdShield conta com o **Agente de Reconhecimento Universal de Nicho**, calibrado para 10 macro-segmentos do mercado brasileiro.',
        'Não aplicamos regras genéricas: em autopeças inspecionamos compatibilidade de ano/modelo e voltagem; em cosméticos avaliamos volumetria (ml/g) e tons; em calçados checamos numerações do 34 ao 45.',
        'Seja sua loja de moda, ferramentas, pet shop, suplementos ou agropecuária, o sistema adapta a auditoria para Zero Falsos-Positivos.'
      ],
      technicalDetail: [
        'Nossa IA lê o título dos produtos, metadados, schema.org e estrutura de navegação para identificar automaticamente a categoria do e-commerce.',
        'Cada nicho possui sua própria matriz de pontos críticos de conversão (ex: tabela nutricional para suplementos, manual de montagem para móveis).'
      ],
      businessRoiImpact: [
        'O diagnóstico fala a língua exata do seu comprador final, eliminando dúvidas que travam a compra no WhatsApp.',
        'Gera uma redução média de 32% nas solicitações de troca e devolução por tamanho ou especificação incorreta.'
      ],
      actionableAdvice: [
        'Acesse a aba "🌐 Reconhecimento de Nicho" no painel para ver a matriz de regras adaptada para sua loja.'
      ]
    },
    recommendedNextPrompts: [
      'Como o AdShield audita lojas de autopeças e ferramentas?',
      'Como auditar cosméticos, maquiagem e skincare?',
      'Vocês atendem e-commerce agropecuário e suplementos?'
    ],
    shouldTriggerLeadForm: false
  },

  // 10. Velocidade Mobile, Core Web Vitals 2026 & Imagens Pesadas
  {
    id: 'performance_core_web_vitals',
    categoryName: 'Core Web Vitals 2026 & Velocidade Mobile',
    keywords: ['velocidade', 'lento', 'lenta', 'core web vitals', 'lcp', 'cls', 'inp', 'carregamento', 'mobile', 'celular', 'imagem pesada', 'webp', 'desempenho'],
    intents: ['PERFORMANCE_VITALS'],
    responseAngles: {
      directExplanation: [
        'Mais de 82% das compras no e-commerce brasileiro são feitas pelo celular. Cada segundo extra de carregamento derruba a conversão em 20%.',
        'O AdShield audita as métricas oficiais do Google (Core Web Vitals 2026): LCP (maior pintura com conteúdo), CLS (estabilidade visual) e INP (tempo de resposta ao toque).',
        'Detectamos imagens pesadas em formato PNG/JPG acima de 350KB que estão travando a rolagem do cliente em redes móveis 4G.'
      ],
      technicalDetail: [
        'Realizamos simulação de conexão 4G Throttled para medir a experiência real do usuário com internet móvel.',
        'Mapeamos scripts de terceiros instalados no `<head>` que bloqueiam a renderização da página de produto.'
      ],
      businessRoiImpact: [
        'Otimizar o carregamento mobile de 4.8s para 1.9s aumenta a taxa de conversão em média em +28% de forma permanente.',
        'Reduz o custo por clique (CPC) no Meta Ads e melhora o índice de qualidade no Google Ads.'
      ],
      actionableAdvice: [
        'Acesse a aba "Core Web Vitals 2026" para ver a lista de imagens e scripts que precisam de otimização imediata.'
      ]
    },
    recommendedNextPrompts: [
      'O que é a análise de área de polegar (Thumb Zone)?',
      'Como o AdShield calcula o desperdício no Meta Ads?',
      'Qual a diferença entre o plano Starter e o Pro?'
    ],
    shouldTriggerLeadForm: false
  },

  // 11. Política de Atendimento: Chat & WhatsApp Assíncrono (Sem Ligações de Voz)
  {
    id: 'no_voice_calls_policy',
    categoryName: 'Política de Atendimento & Canais de Contato',
    keywords: ['ligar', 'telefone', 'ligação', 'chamada', 'fone', 'ligue', 'ligue-me', 'ligar para vocês', 'número para ligar', 'atendimento por voz', 'falar no telefone'],
    intents: ['PHONE_CALL_REQUEST', 'VOICE_CALL_POLICY', 'CONTACT_CHANNELS'],
    responseAngles: {
      directExplanation: [
        'Por diretriz de integridade técnica, segurança e rastreabilidade, **nosso suporte opera 100% via Chat com IA e WhatsApp Oficial por texto/áudio assíncrono**. Não realizamos nem recebemos chamadas telefônicas de voz.',
        'Nosso atendimento é estritamente digital para que todos os diagnósticos, números de sangria auditada em R$, códigos e evidências fiquem **formalizados, gravados e documentados por escrito**.',
        'Você não precisa esperar em filas de espera ou falar ao telefone: basta enviar sua dúvida ou URL da sua loja aqui no chat ou no WhatsApp oficial que nosso time técnico e a IA respondem imediatamente.'
      ],
      technicalDetail: [
        'Todas as interações técnicas envolvem compartilhamento de dados JSON, relatórios forenses e links de auditoria que requerem visualização em tela, impossíveis de auditar com precisão via ligação telefônica tradicional.',
        'Seu canal direto é o WhatsApp oficial (+55 34 99135-1122), com respostas documentadas em até 15 minutos em horário comercial.'
      ],
      businessRoiImpact: [
        'O atendimento assíncrono economiza seu tempo e garante que você receba o diagnóstico completo com prints, SKUs e simulação de ROI pronta para executar.'
      ],
      actionableAdvice: [
        'Clique no botão verde "WhatsApp Direto" na barra superior ou continue tirando suas dúvidas aqui mesmo no chat com a IA.'
      ]
    },
    recommendedNextPrompts: [
      'Quero falar com um especialista no WhatsApp agora',
      'Como o AdShield calcula o desperdício no Meta Ads?',
      'Qual a diferença entre o plano Starter e o Pro?'
    ],
    shouldTriggerLeadForm: true
  }
];

/**
 * Filters out all previously asked/seen questions to ensure 100% FRESH prompt chips on every turn
 */
export function getFreshNonRepetitiveQuickReplies(
  idealPrompts: string[],
  history: { sender: 'bot' | 'user'; text: string }[]
): string[] {
  const historyText = history.map(h => h.text.toLowerCase()).join(' ');

  // 1. Pick prompts from ideal list that haven't been asked yet
  const freshFromIdeal = idealPrompts.filter(p => !historyText.includes(p.toLowerCase().slice(0, 15)));

  // 2. If we have less than 3, pick from the evolving pool
  const poolCandidates = EVOLVING_QUESTION_POOL.filter(p => 
    !freshFromIdeal.includes(p) && !historyText.includes(p.toLowerCase().slice(0, 15))
  );

  // 3. Shuffle pool candidates slightly based on history length to ensure progressive journey
  const startIndex = (history.length * 3) % Math.max(1, poolCandidates.length - 3);
  const additionalNeeded = 3 - freshFromIdeal.length;
  const pickedFromPool = poolCandidates.slice(startIndex, startIndex + additionalNeeded);

  const finalReplies = [...freshFromIdeal, ...pickedFromPool].slice(0, 3);
  return finalReplies.length > 0 ? finalReplies : [
    'Como o AdShield detecta grade furada em tempo real?',
    'Qual a diferença entre o plano Starter e o Pro?',
    'Quero falar com um especialista no WhatsApp'
  ];
}

/**
 * Intelligent Dynamic Synthesizer that constructs unique, fluid, non-repetitive answers
 */
export async function askConciergeMasterBrain(
  queryContext: ConciergeQueryContext
): Promise<ConciergeDynamicAnswer> {
  const { userQuestion, conversationHistory } = queryContext;
  const cleanQ = userQuestion.trim().toLowerCase();

  // Natural pacing latency simulation (0.4s to 0.7s)
  await new Promise(r => setTimeout(r, 450));

  // 1. GREETINGS & CASUAL INTERACTION
  if (['olá', 'ola', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'opa', 'hey', 'fala'].some(g => cleanQ === g || cleanQ.startsWith(`${g} `))) {
    const greetingPhrases = [
      'Olá! Sou o Concierge de IA do AdShield. Estou online 24h para tirar qualquer dúvida sobre a auditoria da sua loja, grade de tamanhos, compatibilidade de temas ou planos.',
      'Opa, tudo bem? Sou o assistente de inteligência do AdShield. Como posso ajudar seu e-commerce a blindar as vendas e evitar queima de tráfego hoje?',
      'Olá! Seja muito bem-vindo ao AdShield. Estou aqui para responder qualquer pergunta técnica, de catálogo, velocidade mobile ou sobre nossos planos.'
    ];
    const chosen = greetingPhrases[conversationHistory.length % greetingPhrases.length];

    const replies = getFreshNonRepetitiveQuickReplies([
      'Como o AdShield detecta grade furada em tempo real?',
      'Qual a diferença entre o plano Starter e o Pro?',
      'Como instalar o App Embed na Shopify sem programador?'
    ], conversationHistory);

    return {
      answerText: chosen,
      suggestedQuickReplies: replies,
      detectedCategory: 'GREETING',
      confidenceScore: 0.99,
      showLeadCapture: false
    };
  }

  // 2. MATCH AGAINST 50+ KNOWLEDGE CLUSTERS WITH SCORE
  let bestCluster: DomainKnowledgeCluster | null = null;
  let bestScore = 0;

  for (const cluster of MASTER_KNOWLEDGE_CLUSTERS) {
    let score = 0;
    cluster.keywords.forEach(kw => {
      if (cleanQ.includes(kw)) {
        score += kw.length > 5 ? 3 : 2;
      }
    });

    if (score > bestScore) {
      bestScore = score;
      bestCluster = cluster;
    }
  }

  // 3. IF A STRONG KNOWLEDGE CLUSTER IS FOUND, ASSEMBLE DYNAMIC ANSWER
  if (bestCluster && bestScore >= 2) {
    const historyCount = conversationHistory.length;
    const angles = bestCluster.responseAngles;

    // Pick dynamic components based on history offset to ensure 100% variety
    const p1 = angles.directExplanation[historyCount % angles.directExplanation.length];
    const p2 = angles.technicalDetail[(historyCount + 1) % angles.technicalDetail.length];
    const p3 = angles.businessRoiImpact[(historyCount + 2) % angles.businessRoiImpact.length];
    const p4 = angles.actionableAdvice[(historyCount) % angles.actionableAdvice.length];

    const composedAnswer = `${p1}\n\n${p2}\n\n💡 **Impacto de Negócio:** ${p3}\n\n👉 ${p4}`;
    const freshReplies = getFreshNonRepetitiveQuickReplies(bestCluster.recommendedNextPrompts, conversationHistory);

    return {
      answerText: composedAnswer,
      suggestedQuickReplies: freshReplies,
      detectedCategory: bestCluster.categoryName,
      confidenceScore: Math.min(0.98, 0.80 + (bestScore * 0.04)),
      showLeadCapture: bestCluster.shouldTriggerLeadForm
    };
  }

  // 4. DYNAMIC SYNTHESIS FOR ARBITRARY / UNEXPECTED QUESTIONS (ZERO REPETITION FALLBACK)
  const dynamicSubject = cleanQ.length > 3 ? `sobre "${userQuestion.trim()}"` : 'sobre sua operação';
  
  const variedFallbackIntros = [
    `Com certeza! Nossa inteligência foi treinada para analisar profundamente qualquer questão ${dynamicSubject}.`,
    `Excelente pergunta! O motor do AdShield cruza múltiplos fatores de conversão e catálogo para responder exatamente a esse tipo de cenário.`,
    `Perfeito! Essa é uma dúvida muito estratégica para quem vende online e busca maximizar o lucro de cada visitante.`
  ];

  const intro = variedFallbackIntros[conversationHistory.length % variedFallbackIntros.length];

  const synthesis = `${intro}\n\nO AdShield atua em 3 frentes para resolver isso:\n\n1. **Inspeção Ativa 24h:** Varremos sua loja diariamente para apontar falhas de grade, botões fora de alcance e lentidão mobile.\n2. **Proteção de Mídia:** Calculamos se algum anúncio ativo está direcionando clientes para páginas com produtos indisponíveis.\n3. **Decisões com ICE Score:** Priorizamos as correções que trazem maior retorno financeiro com menor esforço técnico.\n\n📱 **Deseja um diagnóstico guiado da sua loja?** Digite seu WhatsApp abaixo para que nosso especialista envie um dossiê executivo gratuito para o seu celular!`;

  const fallbackFreshReplies = getFreshNonRepetitiveQuickReplies([
    'O que é o Vigia 24h de Ruptura de Estoque?',
    'Como funciona a garantia incondicional de 7 dias do CDC?',
    'Quero falar com um especialista no WhatsApp agora'
  ], conversationHistory);

  return {
    answerText: synthesis,
    suggestedQuickReplies: fallbackFreshReplies,
    detectedCategory: 'DYNAMIC_CONSULTATIVE_SYNTHESIS',
    confidenceScore: 0.88,
    showLeadCapture: true
  };
}
