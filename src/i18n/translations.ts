// ==============================================================================
// 🌐 NATIVE INTERNATIONALIZATION (i18n) DICTIONARY — ADSHIELD 2026
// Supports: en-US ($), en-GB (£), de-DE (€), fr-FR (€), es-ES (€), pt-BR (R$)
// ==============================================================================

import { StoreLocaleId } from './marketProfiles';

export interface UiTranslations {
  localeLabel: string;
  currencySymbol: string;
  regionDefault: string;
  header: {
    watchdog24hActive: string;
    watchdogActive: string;
    lastCycle: string;
    todayAt: string;
    groundingFactCheck: string;
    audited100: string;
    mitigationHub: string;
    mitigationCenter: string;
    subtitle: string;
    neuralAuditSubtitle: string;
    auditedSite: string;
    status: string;
    statusLabel: string;
    inspected100: string;
    subscriberPortal: string;
    viewPlans: string;
    newSite: string;
    auditStore: string;
    monitoredBrands: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    inspectingBtn: string;
    inspecting: string;
    auditStoreBtn: string;
    ctaButton: string;
    calibrateToggleShow: string;
    calibrateToggleHide: string;
    calibrateType: string;
    hideCalibration: string;
    operationalModel: string;
    autoDetect: string;
    ownManufacturing: string;
    physicalWarehouse: string;
    resaleMultibrand: string;
    shortcuts: string;
    nicheParamsShow: string;
    nicheParamsHide: string;
    nicheParams: string;
    hideParams: string;
    nicheLabel: string;
    aovLabel: string;
  };
  nav: {
    merchantMode: string;
    warRoomMode: string;
    leadSniperB2b: string;
    whatsappWatchdog: string;
    connectStore: string;
    toolsAndDossiers: string;
    executiveSummary: string;
    catalogSkus: string;
    trafficAds: string;
    actionPlan: string;
    calculator: string;
    pillar1: string;
    pillar2: string;
    pillar3: string;
    aiLab18Agents: string;
  };
  summary: {
    liveDomAudited: string;
    downloadPdf: string;
    generatingPdf: string;
    pdfDownloaded: string;
    viewStore: string;
    inHouseProduction: string;
    externalResale: string;
    fullRuleExempt: string;
    imageSensor: string;
    merchantExecutiveActive: string;
    merchantExecutiveDesc: string;
    openWarRoomBtn: string;
    financialRiskTitle: string;
    simulationBadge: string;
    auditedTier: string;
    howMuchLosingQuestion: string;
    efficiencyDiagnosis: string;
    shieldedGrid: string;
    annualAdRisk: string;
    adWasteZero: string;
    recoveryLift: string;
    netMargin: string;
    adSpendSimulatorTitle: string;
    merchantAdjustable: string;
    monthlySpendLabel: string;
    frequentBudgets: string;
    inspectMathFormula: string;
    hideMathFormula: string;
  };
  calculator: {
    title: string;
    subtitle: string;
    businessParams: string;
    monthlyAdSpend: string;
    avgCpc: string;
    conversionRate: string;
    aov: string;
    grossMargin: string;
    roasAchieved: string;
    breakEven: string;
    grossRevenue: string;
    estNetProfit: string;
    avgCac: string;
    strategicVerdict: string;
  };
  consent: {
    title: string;
    description: string;
    privacyLink: string;
    termsLink: string;
    essentialOnly: string;
    acceptAll: string;
  };
  footer: {
    platformTitle: string;
    platformSubtitle: string;
    aboutUs: string;
    termsOfUse: string;
    privacyPolicy: string;
  };
}

export const TRANSLATIONS: Record<StoreLocaleId, UiTranslations> = {
  'pt-BR': {
    localeLabel: '🇧🇷 PT-BR (R$)',
    currencySymbol: 'R$',
    regionDefault: 'Brasil',
    header: {
      watchdog24hActive: 'VIGIA 24H ATIVO',
      watchdogActive: 'VIGIA 24H ATIVO',
      lastCycle: 'ÚLTIMO CICLO',
      todayAt: 'HOJE 07:00',
      groundingFactCheck: 'GROUNDING FACT-CHECK',
      audited100: '100% AUDITADO',
      mitigationHub: 'CENTRAL DE MITIGAÇÕES',
      mitigationCenter: 'CENTRAL DE MITIGAÇÕES',
      subtitle: 'Auditoria Neural de Conversão & Faturamento em Risco',
      neuralAuditSubtitle: 'Auditoria Neural de Conversão & Faturamento em Risco',
      auditedSite: 'Site Auditado',
      status: 'Status',
      statusLabel: 'Status',
      inspected100: '100% Inspecionado',
      subscriberPortal: 'Portal do Assinante',
      viewPlans: 'Ver Planos',
      newSite: 'Novo Site',
      auditStore: 'Auditar Loja',
      monitoredBrands: 'Marcas Monitoradas:'
    },
    hero: {
      badge: 'AUDITORIA INTELIGENTE DE E-COMMERCE',
      title: 'Auditoria Autônoma de Conversão & Rupturas no Meta Ads',
      subtitle: 'Inspecione instantaneamente o catálogo público da sua loja ou de qualquer concorrente. Nossos agentes cruzam estoque real, criativos ativos e checkout para estancar desperdício de verba.',
      inputPlaceholder: 'cole o link da loja (ex: minimalclub.com.br, gymshark.com ou concorrente)',
      inspectingBtn: 'Inspecionando...',
      inspecting: 'Inspecionando...',
      auditStoreBtn: 'Auditar Loja',
      ctaButton: 'Auditar Loja',
      calibrateToggleShow: 'Calibrar tipo da loja (opcional)',
      calibrateToggleHide: 'Ocultar calibração',
      calibrateType: 'Calibrar tipo da loja (opcional)',
      hideCalibration: 'Ocultar calibração',
      operationalModel: 'Modelo Operacional',
      autoDetect: 'Auto-Detect',
      ownManufacturing: 'Fabricação Própria (Sob Demanda)',
      physicalWarehouse: 'Estoque Físico (Galpão)',
      resaleMultibrand: 'Revenda / Multimarcas',
      shortcuts: 'Atalhos',
      nicheParamsShow: 'Parâmetros de nicho',
      nicheParamsHide: 'Ocultar parâmetros',
      nicheParams: 'Parâmetros de nicho',
      hideParams: 'Ocultar parâmetros',
      nicheLabel: 'Nicho',
      aovLabel: 'Ticket Médio (R$):'
    },
    nav: {
      merchantMode: 'Visão Lojista (Lucro)',
      warRoomMode: 'War Room Técnico (18 Agentes)',
      leadSniperB2b: 'Lead Sniper B2B',
      whatsappWatchdog: 'Vigia WhatsApp (07:00)',
      connectStore: 'Conectar Loja',
      toolsAndDossiers: 'Ferramentas & Dossiês',
      executiveSummary: 'Resumo Executivo',
      catalogSkus: 'Catálogo & SKUs',
      trafficAds: 'Tráfego & Ads',
      actionPlan: 'Plano de Ação',
      calculator: 'Simulador ROAS',
      pillar1: '1. Diagnóstico & Lucro',
      pillar2: '2. Grade & Ruptura',
      pillar3: '3. Ações & Salvaguardas',
      aiLab18Agents: 'Laboratório IA (18 Agentes)'
    },
    summary: {
      liveDomAudited: 'DOM Auditado ao Vivo',
      downloadPdf: 'Baixar Relatório PDF',
      generatingPdf: 'Gerando PDF...',
      pdfDownloaded: 'PDF Baixado!',
      viewStore: 'Abrir Loja Real',
      inHouseProduction: 'Confecção Própria',
      externalResale: 'Revenda Externa',
      fullRuleExempt: 'Isenção Regra _FULL',
      imageSensor: 'Sensor de Imagens',
      merchantExecutiveActive: 'Modo Executivo do Lojista Ativo',
      merchantExecutiveDesc: 'Visualização direta de 3 blocos comerciais sem jargões técnicos.',
      openWarRoomBtn: 'Abrir Modo War Room (18 Agentes de IA)',
      financialRiskTitle: 'Diagnóstico de Risco Financeiro',
      simulationBadge: '[Simulação Baseada em Benchmark]',
      auditedTier: 'Porte Auditado',
      howMuchLosingQuestion: 'Quanto dinheiro sua loja está perdendo em anúncios hoje?',
      efficiencyDiagnosis: 'Diagnóstico de Eficiência de Tráfego & Estoque',
      shieldedGrid: 'Grade Blindada:',
      annualAdRisk: 'Risco Anual em Ads',
      adWasteZero: 'Desperdício Zero',
      recoveryLift: 'Potencial de Recuperação',
      netMargin: 'Margem Líquida',
      adSpendSimulatorTitle: 'Simulador Dinâmico de Verba de Tráfego Pago',
      merchantAdjustable: '[Simulador Ajustável pelo Lojista]',
      monthlySpendLabel: 'Verba Mensal Simulada',
      frequentBudgets: 'Orçamentos frequentes',
      inspectMathFormula: 'Inspecionar Fórmula Matemática de Cálculo',
      hideMathFormula: 'Ocultar Fórmula Matemática'
    },
    calculator: {
      title: 'Simulador AdShield de Funil & ROAS de Equilíbrio',
      subtitle: 'Simule variações de tráfego, taxa de conversão do site e margem bruta para prever o lucro real.',
      businessParams: 'Parâmetros do Seu Negócio',
      monthlyAdSpend: 'Investimento em Ads/Mês',
      avgCpc: 'Custo por Clique (CPC Médio)',
      conversionRate: 'Taxa de Conversão do Site',
      aov: 'Ticket Médio (AOV)',
      grossMargin: 'Margem Bruta do Produto',
      roasAchieved: 'ROAS Obtido',
      breakEven: 'Equilíbrio',
      grossRevenue: 'Faturamento Bruto',
      estNetProfit: 'Lucro Líquido Est.',
      avgCac: 'CAC Médio',
      strategicVerdict: 'Veredito Estratégico AdShield'
    },
    consent: {
      title: 'Privacidade & LGPD / GDPR',
      description: 'O AdShield Intelligence utiliza armazenamento local (localStorage), cookies essenciais e metadados técnicos públicos para diagnosticar vitrines de e-commerce e simular sangria de tráfego pago, em estrita conformidade com a LGPD, GDPR e CCPA.',
      privacyLink: 'Política de Privacidade',
      termsLink: 'Termos',
      essentialOnly: 'Apenas Essenciais',
      acceptAll: 'Concordar'
    },
    footer: {
      platformTitle: 'AdShield Intelligence • Plataforma Independente de Auditoria Global de E-Commerce',
      platformSubtitle: 'Diagnóstico Técnico 360º de Sites, Catálogos e Tráfego Pago • LGPD / GDPR / CCPA.',
      aboutUs: 'Quem Somos',
      termsOfUse: 'Termos de Uso',
      privacyPolicy: 'Política de Privacidade & LGPD'
    }
  },
  'en-US': {
    localeLabel: '🇺🇸 EN-US ($)',
    currencySymbol: '$',
    regionDefault: 'EUA',
    header: {
      watchdog24hActive: '24/7 WATCHDOG ACTIVE',
      watchdogActive: '24/7 WATCHDOG ACTIVE',
      lastCycle: 'LAST CYCLE',
      todayAt: 'TODAY 07:00 AM',
      groundingFactCheck: 'GROUNDING FACT-CHECK',
      audited100: '100% AUDITED',
      mitigationHub: 'MITIGATION HUB',
      mitigationCenter: 'MITIGATION HUB',
      subtitle: 'Neural Conversion Audit & Revenue-at-Risk Intelligence',
      neuralAuditSubtitle: 'Neural Conversion Audit & Revenue-at-Risk Intelligence',
      auditedSite: 'Audited Store',
      status: 'Status',
      statusLabel: 'Status',
      inspected100: '100% Inspected',
      subscriberPortal: 'Subscriber Portal',
      viewPlans: 'View Plans',
      newSite: 'New Store',
      auditStore: 'Audit Store',
      monitoredBrands: 'Monitored Brands:'
    },
    hero: {
      badge: 'INTELLIGENT E-COMMERCE AUDIT OS',
      title: 'Autonomous Conversion & Meta Ads Stockout Audit',
      subtitle: 'Instantly inspect your public store catalog or any competitor. Our 18 AI agents cross-reference live inventory, active ad creatives, and checkout friction to stop ad spend waste.',
      inputPlaceholder: 'paste store URL (e.g. gymshark.com, allbirds.com, or competitor)',
      inspectingBtn: 'Inspecting...',
      inspecting: 'Inspecting...',
      auditStoreBtn: 'Audit Store',
      ctaButton: 'Audit Store',
      calibrateToggleShow: 'Calibrate store model (optional)',
      calibrateToggleHide: 'Hide calibration',
      calibrateType: 'Calibrate store model (optional)',
      hideCalibration: 'Hide calibration',
      operationalModel: 'Operational Model',
      autoDetect: 'Auto-Detect',
      ownManufacturing: 'In-House Manufacturing (On-Demand)',
      physicalWarehouse: 'Physical Warehouse (3PL Stock)',
      resaleMultibrand: 'Resale / Multi-Brand',
      shortcuts: 'Presets',
      nicheParamsShow: 'Niche parameters',
      nicheParamsHide: 'Hide parameters',
      nicheParams: 'Niche parameters',
      hideParams: 'Hide parameters',
      nicheLabel: 'Niche',
      aovLabel: 'Avg. Order Value ($):'
    },
    nav: {
      merchantMode: 'Merchant View (Profit)',
      warRoomMode: 'Technical War Room (18 Agents)',
      leadSniperB2b: 'B2B Lead Sniper',
      whatsappWatchdog: '24/7 Alert Watchdog',
      connectStore: 'Connect Store',
      toolsAndDossiers: 'Tools & Dossiers',
      executiveSummary: 'Executive Summary',
      catalogSkus: 'Catalog & SKUs',
      trafficAds: 'Traffic & Ads',
      actionPlan: 'Action Plan',
      calculator: 'ROAS Simulator',
      pillar1: '1. Profit Diagnostic',
      pillar2: '2. Size Grid & Stockouts',
      pillar3: '3. Actions & Safeguards',
      aiLab18Agents: 'AI Lab (18 Agents)'
    },
    summary: {
      liveDomAudited: 'Live DOM Audited',
      downloadPdf: 'Download PDF Report',
      generatingPdf: 'Generating PDF...',
      pdfDownloaded: 'PDF Downloaded!',
      viewStore: 'Open Live Store',
      inHouseProduction: 'In-House Production',
      externalResale: 'External Resale',
      fullRuleExempt: '_FULL Rule Exempt',
      imageSensor: 'Image Sensor',
      merchantExecutiveActive: 'Merchant Executive Mode Active',
      merchantExecutiveDesc: 'Streamlined 3-pillar commercial overview with zero technical jargon.',
      openWarRoomBtn: 'Open War Room Mode (18 AI Agents)',
      financialRiskTitle: 'Financial Risk Diagnostic',
      simulationBadge: '[Benchmark-Based Simulation]',
      auditedTier: 'Audited Tier',
      howMuchLosingQuestion: 'How much money is your store losing on out-of-stock ads today?',
      efficiencyDiagnosis: 'Traffic & Inventory Efficiency Diagnostic',
      shieldedGrid: 'Shielded Grid:',
      annualAdRisk: 'Annual Ad Risk',
      adWasteZero: 'Zero Ad Waste',
      recoveryLift: 'Recovery Potential',
      netMargin: 'Net Margin',
      adSpendSimulatorTitle: 'Dynamic Paid Traffic Budget Simulator',
      merchantAdjustable: '[Merchant-Adjustable Simulator]',
      monthlySpendLabel: 'Simulated Monthly Ad Spend',
      frequentBudgets: 'Quick presets',
      inspectMathFormula: 'Inspect Exact Mathematical Formula',
      hideMathFormula: 'Hide Mathematical Formula'
    },
    calculator: {
      title: 'AdShield Funnel & Break-Even ROAS Simulator',
      subtitle: 'Simulate traffic, conversion rate, and gross margin scenarios to forecast net profit.',
      businessParams: 'Your Business Parameters',
      monthlyAdSpend: 'Monthly Ad Spend',
      avgCpc: 'Average Cost Per Click (CPC)',
      conversionRate: 'Store Conversion Rate',
      aov: 'Average Order Value (AOV)',
      grossMargin: 'Product Gross Margin',
      roasAchieved: 'Achieved ROAS',
      breakEven: 'Break-Even',
      grossRevenue: 'Gross Revenue',
      estNetProfit: 'Est. Net Profit',
      avgCac: 'Average CAC',
      strategicVerdict: 'AdShield Strategic Verdict'
    },
    consent: {
      title: 'Privacy & CCPA / GDPR Compliance',
      description: 'AdShield Intelligence uses localStorage, essential cookies, and public technical metadata to audit e-commerce storefronts and simulate paid media waste in strict compliance with CCPA, GDPR, and LGPD.',
      privacyLink: 'Privacy Policy',
      termsLink: 'Terms',
      essentialOnly: 'Essential Only',
      acceptAll: 'Accept All'
    },
    footer: {
      platformTitle: 'AdShield Intelligence • Independent Global E-Commerce Audit Platform',
      platformSubtitle: '360° Technical Storefront, Catalog & Paid Media Diagnostics • CCPA / GDPR / LGPD.',
      aboutUs: 'About Us',
      termsOfUse: 'Terms of Use',
      privacyPolicy: 'Privacy Policy'
    }
  },
  'en-GB': {
    localeLabel: '🇬🇧 EN-GB (£)',
    currencySymbol: '£',
    regionDefault: 'Europa',
    header: {
      watchdog24hActive: '24/7 WATCHDOG ACTIVE',
      watchdogActive: '24/7 WATCHDOG ACTIVE',
      lastCycle: 'LAST CYCLE',
      todayAt: 'TODAY 07:00',
      groundingFactCheck: 'GROUNDING FACT-CHECK',
      audited100: '100% AUDITED',
      mitigationHub: 'MITIGATION HUB',
      mitigationCenter: 'MITIGATION HUB',
      subtitle: 'Neural Conversion Audit & Revenue-at-Risk Intelligence',
      neuralAuditSubtitle: 'Neural Conversion Audit & Revenue-at-Risk Intelligence',
      auditedSite: 'Audited Store',
      status: 'Status',
      statusLabel: 'Status',
      inspected100: '100% Inspected',
      subscriberPortal: 'Subscriber Portal',
      viewPlans: 'View Plans',
      newSite: 'New Store',
      auditStore: 'Audit Store',
      monitoredBrands: 'Monitored Brands:'
    },
    hero: {
      badge: 'INTELLIGENT E-COMMERCE AUDIT OS',
      title: 'Autonomous Conversion & Meta Ads Stockout Audit',
      subtitle: 'Instantly inspect your public store catalogue or any competitor. Our 18 AI agents cross-reference live inventory, active ad creatives, and checkout friction to stop ad spend waste.',
      inputPlaceholder: 'paste store URL (e.g. uk.gymshark.com, representclo.com, or competitor)',
      inspectingBtn: 'Inspecting...',
      inspecting: 'Inspecting...',
      auditStoreBtn: 'Audit Store',
      ctaButton: 'Audit Store',
      calibrateToggleShow: 'Calibrate store model (optional)',
      calibrateToggleHide: 'Hide calibration',
      calibrateType: 'Calibrate store model (optional)',
      hideCalibration: 'Hide calibration',
      operationalModel: 'Operational Model',
      autoDetect: 'Auto-Detect',
      ownManufacturing: 'In-House Manufacturing (On-Demand)',
      physicalWarehouse: 'Physical Warehouse (3PL Stock)',
      resaleMultibrand: 'Resale / Multi-Brand',
      shortcuts: 'Presets',
      nicheParamsShow: 'Niche parameters',
      nicheParamsHide: 'Hide parameters',
      nicheParams: 'Niche parameters',
      hideParams: 'Hide parameters',
      nicheLabel: 'Niche',
      aovLabel: 'Avg. Order Value (£):'
    },
    nav: {
      merchantMode: 'Merchant View (Profit)',
      warRoomMode: 'Technical War Room (18 Agents)',
      leadSniperB2b: 'B2B Lead Sniper',
      whatsappWatchdog: '24/7 Alert Watchdog',
      connectStore: 'Connect Store',
      toolsAndDossiers: 'Tools & Dossiers',
      executiveSummary: 'Executive Summary',
      catalogSkus: 'Catalogue & SKUs',
      trafficAds: 'Traffic & Ads',
      actionPlan: 'Action Plan',
      calculator: 'ROAS Simulator',
      pillar1: '1. Profit Diagnostic',
      pillar2: '2. Size Grid & Stockouts',
      pillar3: '3. Actions & Safeguards',
      aiLab18Agents: 'AI Lab (18 Agents)'
    },
    summary: {
      liveDomAudited: 'Live DOM Audited',
      downloadPdf: 'Download PDF Report',
      generatingPdf: 'Generating PDF...',
      pdfDownloaded: 'PDF Downloaded!',
      viewStore: 'Open Live Store',
      inHouseProduction: 'In-House Production',
      externalResale: 'External Resale',
      fullRuleExempt: '_FULL Rule Exempt',
      imageSensor: 'Image Sensor',
      merchantExecutiveActive: 'Merchant Executive Mode Active',
      merchantExecutiveDesc: 'Streamlined 3-pillar commercial overview with zero technical jargon.',
      openWarRoomBtn: 'Open War Room Mode (18 AI Agents)',
      financialRiskTitle: 'Financial Risk Diagnostic',
      simulationBadge: '[Benchmark-Based Simulation]',
      auditedTier: 'Audited Tier',
      howMuchLosingQuestion: 'How much money is your store losing on out-of-stock ads today?',
      efficiencyDiagnosis: 'Traffic & Inventory Efficiency Diagnostic',
      shieldedGrid: 'Shielded Grid:',
      annualAdRisk: 'Annual Ad Risk',
      adWasteZero: 'Zero Ad Waste',
      recoveryLift: 'Recovery Potential',
      netMargin: 'Net Margin',
      adSpendSimulatorTitle: 'Dynamic Paid Traffic Budget Simulator',
      merchantAdjustable: '[Merchant-Adjustable Simulator]',
      monthlySpendLabel: 'Simulated Monthly Ad Spend',
      frequentBudgets: 'Quick presets',
      inspectMathFormula: 'Inspect Exact Mathematical Formula',
      hideMathFormula: 'Hide Mathematical Formula'
    },
    calculator: {
      title: 'AdShield Funnel & Break-Even ROAS Simulator',
      subtitle: 'Simulate traffic, conversion rate, and gross margin scenarios to forecast net profit.',
      businessParams: 'Your Business Parameters',
      monthlyAdSpend: 'Monthly Ad Spend',
      avgCpc: 'Average Cost Per Click (CPC)',
      conversionRate: 'Store Conversion Rate',
      aov: 'Average Order Value (AOV)',
      grossMargin: 'Product Gross Margin',
      roasAchieved: 'Achieved ROAS',
      breakEven: 'Break-Even',
      grossRevenue: 'Gross Revenue',
      estNetProfit: 'Est. Net Profit',
      avgCac: 'Average CAC',
      strategicVerdict: 'AdShield Strategic Verdict'
    },
    consent: {
      title: 'Privacy & UK GDPR Compliance',
      description: 'AdShield Intelligence uses localStorage, essential cookies, and public technical metadata to audit e-commerce storefronts and simulate paid media waste in strict compliance with UK GDPR and PECR.',
      privacyLink: 'Privacy Policy',
      termsLink: 'Terms',
      essentialOnly: 'Essential Only',
      acceptAll: 'Accept All'
    },
    footer: {
      platformTitle: 'AdShield Intelligence • Independent Global E-Commerce Audit Platform',
      platformSubtitle: '360° Technical Storefront, Catalogue & Paid Media Diagnostics • UK GDPR / Consumer Rights Act.',
      aboutUs: 'About Us',
      termsOfUse: 'Terms of Use',
      privacyPolicy: 'Privacy Policy'
    }
  },
  'de-DE': {
    localeLabel: '🇩🇪 DE-DE (€)',
    currencySymbol: '€',
    regionDefault: 'Europa',
    header: {
      watchdog24hActive: '24/7 WÄCHTER AKTIV',
      watchdogActive: '24/7 WÄCHTER AKTIV',
      lastCycle: 'LETZTER ZYKLUS',
      todayAt: 'HEUTE 07:00',
      groundingFactCheck: 'GROUNDING FACT-CHECK',
      audited100: '100% GEPRÜFT',
      mitigationHub: 'MITIGATIONS-ZENTRUM',
      mitigationCenter: 'MITIGATIONS-ZENTRUM',
      subtitle: 'Neurale Conversion-Prüfung & Umsatzrisiko-Intelligenz',
      neuralAuditSubtitle: 'Neurale Conversion-Prüfung & Umsatzrisiko-Intelligenz',
      auditedSite: 'Geprüfter Shop',
      status: 'Status',
      statusLabel: 'Status',
      inspected100: '100% Geprüft',
      subscriberPortal: 'Kundenportal',
      viewPlans: 'Tarife ansehen',
      newSite: 'Neuer Shop',
      auditStore: 'Shop prüfen',
      monitoredBrands: 'Überwachte Marken:'
    },
    hero: {
      badge: 'INTELLIGENTES E-COMMERCE AUDIT OS',
      title: 'Autonome Conversion- & Meta-Ads-Bestandsprüfung',
      subtitle: 'Prüfen Sie sofort Ihren öffentlichen Shop-Katalog oder Wettbewerber. Unsere 18 KI-Agenten gleichen Live-Bestand, aktive Werbeanzeigen und Checkout-Reibung ab.',
      inputPlaceholder: 'Shop-URL einfügen (z.B. snocks.com oder Wettbewerber)',
      inspectingBtn: 'Prüfung läuft...',
      inspecting: 'Prüfung läuft...',
      auditStoreBtn: 'Shop prüfen',
      ctaButton: 'Shop prüfen',
      calibrateToggleShow: 'Shop-Modell kalibrieren (optional)',
      calibrateToggleHide: 'Kalibrierung ausblenden',
      calibrateType: 'Shop-Modell kalibrieren (optional)',
      hideCalibration: 'Kalibrierung ausblenden',
      operationalModel: 'Betriebsmodell',
      autoDetect: 'Auto-Erkennung',
      ownManufacturing: 'Eigenproduktion (On-Demand)',
      physicalWarehouse: 'Eigenes Lager (3PL)',
      resaleMultibrand: 'Handel / Mehrmarken',
      shortcuts: 'Beispiele',
      nicheParamsShow: 'Nischen-Parameter',
      nicheParamsHide: 'Parameter ausblenden',
      nicheParams: 'Nischen-Parameter',
      hideParams: 'Parameter ausblenden',
      nicheLabel: 'Nische',
      aovLabel: 'Ø Warenkorbwert (€):'
    },
    nav: {
      merchantMode: 'Händler-Ansicht (Profit)',
      warRoomMode: 'Technischer War Room (18 Agenten)',
      leadSniperB2b: 'B2B Lead Sniper',
      whatsappWatchdog: '24/7 Alarm-Wächter',
      connectStore: 'Shop verbinden',
      toolsAndDossiers: 'Tools & Dossiers',
      executiveSummary: 'Management-Zusammenfassung',
      catalogSkus: 'Katalog & SKUs',
      trafficAds: 'Traffic & Ads',
      actionPlan: 'Maßnahmenplan',
      calculator: 'ROAS-Simulator',
      pillar1: '1. Profit-Diagnose',
      pillar2: '2. Größen & Bestand',
      pillar3: '3. Schutzmaßnahmen',
      aiLab18Agents: 'KI-Labor (18 Agenten)'
    },
    summary: {
      liveDomAudited: 'Live-DOM geprüft',
      downloadPdf: 'PDF-Bericht herunterladen',
      generatingPdf: 'PDF wird erstellt...',
      pdfDownloaded: 'PDF heruntergeladen!',
      viewStore: 'Live-Shop öffnen',
      inHouseProduction: 'Eigenproduktion',
      externalResale: 'Handelsware',
      fullRuleExempt: '_FULL-Regel befreit',
      imageSensor: 'Bild-Sensor',
      merchantExecutiveActive: 'Händler-Management-Modus Aktiv',
      merchantExecutiveDesc: 'Direkte 3-Säulen-Übersicht ohne technischen Fachjargon.',
      openWarRoomBtn: 'War-Room-Modus öffnen (18 KI-Agenten)',
      financialRiskTitle: 'Finanzrisiko-Diagnose',
      simulationBadge: '[Benchmark-Simulation]',
      auditedTier: 'Geprüfte Stufe',
      howMuchLosingQuestion: 'Wie viel Werbebudget verliert Ihr Shop heute durch Größen-Ausfälle?',
      efficiencyDiagnosis: 'Traffic- & Bestandseffizienz-Diagnose',
      shieldedGrid: 'Geschütztes Sortiment:',
      annualAdRisk: 'Jährliches Ad-Risiko',
      adWasteZero: 'Null Werbeverlust',
      recoveryLift: 'Rückgewinnungspotenzial',
      netMargin: 'Nettomarge',
      adSpendSimulatorTitle: 'Dynamischer Werbebudget-Simulator',
      merchantAdjustable: '[Vom Händler anpassbar]',
      monthlySpendLabel: 'Simuliertes Monatsbudget',
      frequentBudgets: 'Schnellauswahl',
      inspectMathFormula: 'Mathematische Berechnungsformel einsehen',
      hideMathFormula: 'Mathematische Formel ausblenden'
    },
    calculator: {
      title: 'AdShield Funnel- & Break-Even-ROAS-Simulator',
      subtitle: 'Simulieren Sie Traffic, Conversion-Rate und Bruttomarge zur Gewinnprognose.',
      businessParams: 'Ihre Geschäftsparameter',
      monthlyAdSpend: 'Monatliches Werbebudget',
      avgCpc: 'Durchschnittlicher CPC',
      conversionRate: 'Conversion-Rate',
      aov: 'Ø Warenkorbwert (AOV)',
      grossMargin: 'Bruttomarge',
      roasAchieved: 'Erzielter ROAS',
      breakEven: 'Break-Even',
      grossRevenue: 'Bruttoumsatz',
      estNetProfit: 'Geschätzter Nettogewinn',
      avgCac: 'Durchschnittlicher CAC',
      strategicVerdict: 'Strategisches AdShield-Urteil'
    },
    consent: {
      title: 'Datenschutz & DSGVO',
      description: 'AdShield Intelligence verwendet localStorage, essenzielle Cookies und öffentliche technische Metadaten zur Shop-Diagnose in strikter Übereinstimmung mit der DSGVO.',
      privacyLink: 'Datenschutz',
      termsLink: 'AGB',
      essentialOnly: 'Nur Essenzielle',
      acceptAll: 'Akzeptieren'
    },
    footer: {
      platformTitle: 'AdShield Intelligence • Unabhängige E-Commerce-Prüfplattform',
      platformSubtitle: '360° Technische Shop-, Katalog- & Paid-Media-Diagnose • DSGVO / DDG.',
      aboutUs: 'Über uns',
      termsOfUse: 'Nutzungsbedingungen',
      privacyPolicy: 'Datenschutzerklärung'
    }
  },
  'fr-FR': {
    localeLabel: '🇫🇷 FR-FR (€)',
    currencySymbol: '€',
    regionDefault: 'Europa',
    header: {
      watchdog24hActive: 'SENTINELLE 24/7 ACTIVE',
      watchdogActive: 'SENTINELLE 24/7 ACTIVE',
      lastCycle: 'DERNIER CYCLE',
      todayAt: "AUJOURD'HUI 07:00",
      groundingFactCheck: 'GROUNDING FACT-CHECK',
      audited100: '100% AUDITÉ',
      mitigationHub: 'CENTRE DE MITIGATION',
      mitigationCenter: 'CENTRE DE MITIGATION',
      subtitle: 'Audit Neural de Conversion & Revenus à Risque',
      neuralAuditSubtitle: 'Audit Neural de Conversion & Revenus à Risque',
      auditedSite: 'Boutique Auditée',
      status: 'Statut',
      statusLabel: 'Statut',
      inspected100: '100% Inspecté',
      subscriberPortal: 'Portail Abonné',
      viewPlans: 'Voir les Offres',
      newSite: 'Nouvelle Boutique',
      auditStore: 'Auditer la Boutique',
      monitoredBrands: 'Marques Surveillées :'
    },
    hero: {
      badge: 'OS AUDIT E-COMMERCE INTELLIGENT',
      title: 'Audit Autonome de Conversion & Ruptures Meta Ads',
      subtitle: 'Inspectez instantanément le catalogue public de votre boutique ou de vos concurrents. Nos 18 agents IA croisent stocks réels, publicités actives et friction checkout.',
      inputPlaceholder: 'collez le lien de la boutique (ex: sezane.com, gymshark.com)',
      inspectingBtn: 'Inspection...',
      inspecting: 'Inspection...',
      auditStoreBtn: 'Auditer la Boutique',
      ctaButton: 'Auditer la Boutique',
      calibrateToggleShow: 'Calibrer le modèle de boutique (optionnel)',
      calibrateToggleHide: 'Masquer la calibration',
      calibrateType: 'Calibrer le modèle de boutique (optionnel)',
      hideCalibration: 'Masquer la calibration',
      operationalModel: 'Modèle Opérationnel',
      autoDetect: 'Auto-Détection',
      ownManufacturing: 'Fabrication Propre (À la Demande)',
      physicalWarehouse: 'Entrepôt Physique (3PL)',
      resaleMultibrand: 'Revente / Multimarques',
      shortcuts: 'Raccourcis',
      nicheParamsShow: 'Paramètres de niche',
      nicheParamsHide: 'Masquer les paramètres',
      nicheParams: 'Paramètres de niche',
      hideParams: 'Masquer les paramètres',
      nicheLabel: 'Niche',
      aovLabel: 'Panier Moyen (€) :'
    },
    nav: {
      merchantMode: 'Vue Marchand (Profit)',
      warRoomMode: 'War Room Technique (18 Agents)',
      leadSniperB2b: 'Lead Sniper B2B',
      whatsappWatchdog: 'Sentinelle 24/7',
      connectStore: 'Connecter Boutique',
      toolsAndDossiers: 'Outils & Dossiers',
      executiveSummary: 'Résumé Exécutif',
      catalogSkus: 'Catalogue & SKUs',
      trafficAds: 'Trafic & Ads',
      actionPlan: "Plan d'Action",
      calculator: 'Simulateur ROAS',
      pillar1: '1. Diagnostic & Profit',
      pillar2: '2. Tailles & Ruptures',
      pillar3: '3. Actions & Bouclier',
      aiLab18Agents: 'Labo IA (18 Agents)'
    },
    summary: {
      liveDomAudited: 'DOM Audité en Direct',
      downloadPdf: 'Télécharger le PDF',
      generatingPdf: 'Génération PDF...',
      pdfDownloaded: 'PDF Téléchargé !',
      viewStore: 'Ouvrir la Boutique',
      inHouseProduction: 'Production Interne',
      externalResale: 'Revente Externe',
      fullRuleExempt: 'Exempté Règle _FULL',
      imageSensor: "Capteur d'Images",
      merchantExecutiveActive: 'Mode Exécutif Marchand Actif',
      merchantExecutiveDesc: 'Vue commerciale directe en 3 blocs sans jargon technique.',
      openWarRoomBtn: 'Ouvrir le War Room (18 Agents IA)',
      financialRiskTitle: 'Diagnostic de Risque Financier',
      simulationBadge: '[Simulation Basée sur Benchmark]',
      auditedTier: 'Taille Auditée',
      howMuchLosingQuestion: "Combien d'argent votre boutique perd-elle en publicités aujourd'hui ?",
      efficiencyDiagnosis: "Diagnostic d'Efficacité Trafic & Stock",
      shieldedGrid: 'Grille Protégée :',
      annualAdRisk: 'Risque Annuel Ads',
      adWasteZero: 'Zéro Gaspillage',
      recoveryLift: 'Potentiel de Récupération',
      netMargin: 'Marge Nette',
      adSpendSimulatorTitle: 'Simulateur Dynamique de Budget Publicitaire',
      merchantAdjustable: '[Ajustable par le Marchand]',
      monthlySpendLabel: 'Budget Mensuel Simulé',
      frequentBudgets: 'Budgets fréquents',
      inspectMathFormula: 'Inspecter la Formule Mathématique Exacte',
      hideMathFormula: 'Masquer la Formule Mathématique'
    },
    calculator: {
      title: 'Simulateur AdShield de Funnel & ROAS de Rentabilité',
      subtitle: 'Simulez le trafic, le taux de conversion et la marge brute pour prévoir le profit net.',
      businessParams: 'Paramètres de Votre Boutique',
      monthlyAdSpend: 'Budget Pub Mensuel',
      avgCpc: 'Coût Par Clic Moyen (CPC)',
      conversionRate: 'Taux de Conversion',
      aov: 'Panier Moyen (AOV)',
      grossMargin: 'Marge Brute Produit',
      roasAchieved: 'ROAS Obtenu',
      breakEven: 'Seuil de Rentabilité',
      grossRevenue: "Chiffre d'Affaires Brut",
      estNetProfit: 'Profit Net Est.',
      avgCac: 'CAC Moyen',
      strategicVerdict: 'Verdict Stratégique AdShield'
    },
    consent: {
      title: 'Confidentialité & RGPD',
      description: 'AdShield Intelligence utilise le stockage local, des cookies essentiels et des métadonnées publiques pour diagnostiquer les boutiques e-commerce en conformité avec le RGPD.',
      privacyLink: 'Confidentialité',
      termsLink: 'CGU',
      essentialOnly: 'Essentiels Uniquement',
      acceptAll: 'Accepter'
    },
    footer: {
      platformTitle: "AdShield Intelligence • Plateforme Indépendante d'Audit E-Commerce",
      platformSubtitle: 'Diagnostic Technique 360° des Boutiques, Catalogues et Médias Payants • RGPD.',
      aboutUs: 'À Propos',
      termsOfUse: "Conditions d'Utilisation",
      privacyPolicy: 'Politique de Confidentialité'
    }
  },
  'es-ES': {
    localeLabel: '🇪🇸 ES-ES (€)',
    currencySymbol: '€',
    regionDefault: 'Europa',
    header: {
      watchdog24hActive: 'VIGÍA 24/7 ACTIVO',
      watchdogActive: 'VIGÍA 24/7 ACTIVO',
      lastCycle: 'ÚLTIMO CICLO',
      todayAt: 'HOY 07:00',
      groundingFactCheck: 'GROUNDING FACT-CHECK',
      audited100: '100% AUDITADO',
      mitigationHub: 'CENTRO DE MITIGACIÓN',
      mitigationCenter: 'CENTRO DE MITIGACIÓN',
      subtitle: 'Auditoría Neural de Conversión y Facturación en Riesgo',
      neuralAuditSubtitle: 'Auditoría Neural de Conversión y Facturación en Riesgo',
      auditedSite: 'Tienda Auditada',
      status: 'Estado',
      statusLabel: 'Estado',
      inspected100: '100% Inspeccionado',
      subscriberPortal: 'Portal del Suscriptor',
      viewPlans: 'Ver Planes',
      newSite: 'Nueva Tienda',
      auditStore: 'Auditar Tienda',
      monitoredBrands: 'Marcas Monitoreadas:'
    },
    hero: {
      badge: 'AUDITORÍA INTELIGENTE DE E-COMMERCE',
      title: 'Auditoría Autónoma de Conversión y Quiebres de Stock en Meta Ads',
      subtitle: 'Inspeccione al instante el catálogo público de su tienda o de cualquier competidor. Nuestros 18 agentes de IA cruzan stock real, anuncios activos y checkout.',
      inputPlaceholder: 'pegue el enlace de la tienda (ej: hawkersco.com, gymshark.com)',
      inspectingBtn: 'Inspeccionando...',
      inspecting: 'Inspeccionando...',
      auditStoreBtn: 'Auditar Tienda',
      ctaButton: 'Auditar Tienda',
      calibrateToggleShow: 'Calibrar modelo de tienda (opcional)',
      calibrateToggleHide: 'Ocultar calibración',
      calibrateType: 'Calibrar modelo de tienda (opcional)',
      hideCalibration: 'Ocultar calibración',
      operationalModel: 'Modelo Operativo',
      autoDetect: 'Auto-Detectar',
      ownManufacturing: 'Fabricación Propia (Bajo Demanda)',
      physicalWarehouse: 'Almacén Físico (Stock 3PL)',
      resaleMultibrand: 'Reventa / Multimarca',
      shortcuts: 'Atajos',
      nicheParamsShow: 'Parámetros de nicho',
      nicheParamsHide: 'Ocultar parámetros',
      nicheParams: 'Parámetros de nicho',
      hideParams: 'Ocultar parámetros',
      nicheLabel: 'Nicho',
      aovLabel: 'Ticket Promedio (€):'
    },
    nav: {
      merchantMode: 'Vista Comerciante (Lucro)',
      warRoomMode: 'War Room Técnico (18 Agentes)',
      leadSniperB2b: 'Lead Sniper B2B',
      whatsappWatchdog: 'Vigía 24/7',
      connectStore: 'Conectar Tienda',
      toolsAndDossiers: 'Herramientas y Dossiers',
      executiveSummary: 'Resumen Ejecutivo',
      catalogSkus: 'Catálogo y SKUs',
      trafficAds: 'Tráfico y Ads',
      actionPlan: 'Plan de Acción',
      calculator: 'Simulador ROAS',
      pillar1: '1. Diagnóstico y Lucro',
      pillar2: '2. Tallas y Stock',
      pillar3: '3. Acciones y Escudo',
      aiLab18Agents: 'Laboratorio IA (18 Agentes)'
    },
    summary: {
      liveDomAudited: 'DOM Auditado en Vivo',
      downloadPdf: 'Descargar Informe PDF',
      generatingPdf: 'Generando PDF...',
      pdfDownloaded: '¡PDF Descargado!',
      viewStore: 'Abrir Tienda Real',
      inHouseProduction: 'Producción Propia',
      externalResale: 'Reventa Externa',
      fullRuleExempt: 'Exento Regla _FULL',
      imageSensor: 'Sensor de Imágenes',
      merchantExecutiveActive: 'Modo Ejecutivo del Comerciante Activo',
      merchantExecutiveDesc: 'Visualización directa de 3 bloques comerciales sin jerga técnica.',
      openWarRoomBtn: 'Abrir Modo War Room (18 Agentes IA)',
      financialRiskTitle: 'Diagnóstico de Riesgo Financiero',
      simulationBadge: '[Simulación Basada en Benchmark]',
      auditedTier: 'Escala Auditada',
      howMuchLosingQuestion: '¿Cuánto dinero está perdiendo su tienda en anuncios sin stock hoy?',
      efficiencyDiagnosis: 'Diagnóstico de Eficiencia de Tráfico y Stock',
      shieldedGrid: 'Catálogo Blindado:',
      annualAdRisk: 'Riesgo Anual en Ads',
      adWasteZero: 'Cero Desperdicio',
      recoveryLift: 'Potencial de Recuperación',
      netMargin: 'Margen Neto',
      adSpendSimulatorTitle: 'Simulador Dinámico de Presupuesto de Tráfico Pago',
      merchantAdjustable: '[Simulador Ajustable por el Comerciante]',
      monthlySpendLabel: 'Presupuesto Mensual Simulado',
      frequentBudgets: 'Presupuestos frecuentes',
      inspectMathFormula: 'Inspeccionar Fórmula Matemática Exacta',
      hideMathFormula: 'Ocultar Fórmula Matemática'
    },
    calculator: {
      title: 'Simulador AdShield de Embudo y ROAS de Equilibrio',
      subtitle: 'Simule variaciones de tráfico, tasa de conversión y margen bruto para prever el beneficio neto.',
      businessParams: 'Parámetros de Su Negocio',
      monthlyAdSpend: 'Inversión Mensual en Ads',
      avgCpc: 'Costo por Clic Promedio (CPC)',
      conversionRate: 'Tasa de Conversión',
      aov: 'Ticket Promedio (AOV)',
      grossMargin: 'Margen Bruto del Producto',
      roasAchieved: 'ROAS Obtenido',
      breakEven: 'Equilibrio',
      grossRevenue: 'Ingresos Brutos',
      estNetProfit: 'Beneficio Neto Est.',
      avgCac: 'CAC Promedio',
      strategicVerdict: 'Veredicto Estratégico AdShield'
    },
    consent: {
      title: 'Privacidad y RGPD',
      description: 'AdShield Intelligence utiliza almacenamiento local, cookies esenciales y metadatos técnicos públicos para diagnosticar tiendas de comercio electrónico en estricto cumplimiento del RGPD.',
      privacyLink: 'Política de Privacidad',
      termsLink: 'Términos',
      essentialOnly: 'Solo Esenciales',
      acceptAll: 'Aceptar'
    },
    footer: {
      platformTitle: 'AdShield Intelligence • Plataforma Independiente de Auditoría de E-Commerce',
      platformSubtitle: 'Diagnóstico Técnico 360° de Tiendas, Catálogos y Tráfico Pago • RGPD / LSSI.',
      aboutUs: 'Quiénes Somos',
      termsOfUse: 'Términos de Uso',
      privacyPolicy: 'Política de Privacidad'
    }
  }
};
