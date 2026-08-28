import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '../components/Header';
import { HeroUrlBar } from '../components/HeroUrlBar';
import { ExecutiveSummary } from '../components/ExecutiveSummary';
import { ComputerVisionInspectionView } from '../components/agents/ComputerVisionInspectionView';
import { BlindspotAuditView } from '../components/BlindspotAuditView';
import { SecurityAgentView } from '../components/agents/SecurityAgentView';
import { SocialAgentView } from '../components/agents/SocialAgentView';
import { CroAgentView } from '../components/agents/CroAgentView';
import { SeoAgentView } from '../components/agents/SeoAgentView';
import { AdsAgentView } from '../components/agents/AdsAgentView';
import { SalesCopyAgentView } from '../components/agents/SalesCopyAgentView';
import { PmGrowthAgentView } from '../components/agents/PmGrowthAgentView';
import { CompetitorAgentView } from '../components/agents/CompetitorAgentView';
import { ActionPlanKanban } from '../components/agents/ActionPlanKanban';
import { AgentChatView } from '../components/agents/AgentChatView';
import { RoasCalculator } from '../components/tools/RoasCalculator';
import { AuditFormModal } from '../components/AuditFormModal';
import { AnalysisLoadingState } from '../components/AnalysisLoadingState';
import { ExecutivePdfExportModal } from '../components/ExecutivePdfExportModal';
import { SettingsModal } from '../components/SettingsModal';
import { AdminLeadsDashboard } from '../components/AdminLeadsDashboard';
import { PricingModal } from '../components/PricingModal';
import { WhatsAppLeadCaptureModal } from '../components/WhatsAppLeadCaptureModal';
import { AdminLeadsDrawer } from '../components/AdminLeadsDrawer';
import { MonitoredStoresManagerModal } from '../components/MonitoredStoresManagerModal';
import { WhatsAppWatchdogSettingsModal } from '../components/WhatsAppWatchdogSettingsModal';
import { EcommerceIntegrationsHubModal } from '../components/EcommerceIntegrationsHubModal';
import { AgencyWhiteLabelModal } from '../components/agency/AgencyWhiteLabelModal';
import { FloatingAiChatWidget } from '../components/FloatingAiChatWidget';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CookieBanner } from '../components/CookieBanner';
import { runAgentDiagnosticAsync } from '../services/agentEngine';
import { extractCleanDomainAndBrand } from '../services/siteInspector';
import { AuditInput, AgentDiagnosticResult } from '../types';
import { ShopifyTelemetryView } from '../components/ShopifyTelemetryView';
import { ThemeScriptGeneratorView } from '../components/ThemeScriptGeneratorView';
import { MarketplaceAuditView } from '../components/MarketplaceAuditView';
import { CoreWebVitalsAuditView } from '../components/CoreWebVitalsAuditView';
import { PricingElasticitySimulatorView } from '../components/PricingElasticitySimulatorView';
import { TrustBadgeGeneratorView } from '../components/TrustBadgeGeneratorView';
import { StockRuptureMonitorView } from '../components/StockRuptureMonitorView';
import { OrchestratorControlTowerView } from '../components/OrchestratorControlTowerView';
import { DeepScraperDossierView } from '../components/DeepScraperDossierView';
import { TruthAuditorTribunalView } from '../components/TruthAuditorTribunalView';
import { AutonomousSwarmControlView } from '../components/AutonomousSwarmControlView';
import { MarketHunterAgentView } from '../components/agents/MarketHunterAgentView';
import { ProductEvolutionAgentView } from '../components/agents/ProductEvolutionAgentView';
import { CustomerSuccessVocAgentView } from '../components/agents/CustomerSuccessVocAgentView';
import { ChiefExecutiveOrchestratorAgentView } from '../components/agents/ChiefExecutiveOrchestratorAgentView';
import { CollectionDeepAuditView } from '../components/CollectionDeepAuditView';
import { UniversalNicheRecognitionView } from '../components/agents/UniversalNicheRecognitionView';
import { SkuAbandonmentCrossAuditView } from '../components/SkuAbandonmentCrossAuditView';
import { FounderMasterHqView } from '../components/founder/FounderMasterHqView';
import { AutonomousAgentFlowchartView } from '../components/founder/AutonomousAgentFlowchartView';
import { FounderAuthModal } from '../components/founder/FounderAuthModal';
import { detectMarketplace } from '../services/marketplaceInspector';
import { LayoutDashboard, Eye, ShoppingCart, Target, Calculator, ShieldCheck, Sword, KanbanSquare, Layers, Activity, Code2, Store, Gauge, Flame, Cpu, Search, Scale, BrainCircuit, Compass, Wrench, BarChart3, Crown, Plug, FileText, Globe, GitCompare, Zap, Lock, Unlock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [diagnostic, setDiagnostic] = useState<AgentDiagnosticResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState<boolean>(false);
  const [isLeadsDrawerOpen, setIsLeadsDrawerOpen] = useState<boolean>(false);
  const [isStoresManagerOpen, setIsStoresManagerOpen] = useState<boolean>(false);
  const [isWhatsAppWatchdogOpen, setIsWhatsAppWatchdogOpen] = useState<boolean>(false);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState<boolean>(false);
  const [isWhiteLabelModalOpen, setIsWhiteLabelModalOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingUrl, setAnalyzingUrl] = useState<string>('');
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);

  // 🔒 Master Founder Confidential Auth State
  const [isFounderAuthenticated, setIsFounderAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('adshield_founder_authenticated') === 'true';
  });
  const [isFounderModalOpen, setIsFounderModalOpen] = useState<boolean>(false);

  // Auto trigger founder auth modal if URL param exists
  useEffect(() => {
    if (searchParams.get('founder') === 'true' || searchParams.get('mode') === 'founder' || window.location.hash.includes('founder')) {
      if (!isFounderAuthenticated) {
        setIsFounderModalOpen(true);
      }
    }
  }, [searchParams, isFounderAuthenticated]);

  // Initial load dynamically for sample domain so user gets instant value
  useEffect(() => {
    const sampleUrl = 'https://www.brkagro.com.br';
    const { cleanUrl, brandName } = extractCleanDomainAndBrand(sampleUrl);

    const initialInput: AuditInput = {
      siteUrl: cleanUrl,
      businessName: brandName,
      businessType: 'ecommerce',
      niche: 'Agropecuária & Soluções no Campo',
      monthlyRevenue: 'R$ 50k a R$ 200k',
      averageOrderValue: 180,
      mainChallenge: 'low_conversion',
      targetRegion: 'Brasil',
      grossMargin: 45,
      competitorsUrl: 'https://concorrente.com.br'
    };
    runAgentDiagnosticAsync(initialInput).then(res => setDiagnostic(res));
  }, []);

  const handleStartRealAudit = async (input: AuditInput) => {
    setIsAuditModalOpen(false);
    setIsAnalyzing(true);
    setAnalyzingUrl(input.siteUrl);

    try {
      const { cleanUrl, brandName } = extractCleanDomainAndBrand(input.siteUrl);
      const cleanInput: AuditInput = {
        ...input,
        siteUrl: cleanUrl,
        businessName: brandName
      };

      const result = await runAgentDiagnosticAsync(cleanInput);
      setDiagnostic(result);
      setIsAnalyzing(false);
      setActiveTab('summary');

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Audit execution error:', err);
      setIsAnalyzing(false);
    }
  };

  const [viewMode, setViewMode] = useState<'merchant' | 'war_room' | 'lead_demo'>('merchant');

  const totalCatalogAlerts = ((diagnostic?.realSiteData.catalogAudit?.productsWithBrokenGrid || 0) + 
                             (diagnostic?.realSiteData.catalogAudit?.productsWithMissingImages || 0));

  const isMarketplaceStore = diagnostic 
    ? detectMarketplace(diagnostic.realSiteData.url, diagnostic.realSiteData.domain).isMarketplace 
    : false;

  // 🛍️ 1. MODO LOJISTA: As 6 Abas Essenciais de Negócio & Lucro (100% Limpo para Clientes)
  const merchantTabs = [
    { id: 'summary', label: 'Visão Executiva', icon: LayoutDashboard },
    ...(isFounderAuthenticated ? [
      { id: 'founder_hq', label: 'Torre do Fundador (HQ)', icon: Crown, highlight: true },
      { id: 'agent_flowchart', label: 'Fluxograma do Enxame', icon: Zap, highlight: true }
    ] : []),
    { id: 'sku_crossing', label: 'Cruzamento SKUs & Abandonos', icon: GitCompare, highlight: true },
    { id: 'niche_recognition', label: 'Reconhecimento de Nicho', icon: Globe, highlight: true },
    { id: 'rupture_monitor', label: 'Vigia 24h Ruptura', icon: Flame, highlight: true },
    { id: 'collection_audit', label: 'Coleções & Hero Banner', icon: Target, highlight: true },
    { id: 'pricing', label: 'Simulador Pix & Margem', icon: Calculator, highlight: true },
    { id: 'catalog', label: 'Catálogo & Estoque', icon: Layers, badge: totalCatalogAlerts > 0 ? totalCatalogAlerts : undefined },
    { id: 'market_hunter', label: 'Caçador de Mercado & Leads', icon: Compass, highlight: true },
    { id: 'product_evolution', label: 'Auto-Evolução do Produto', icon: Wrench, highlight: true },
    { id: 'customer_success', label: 'Clientes & Precificação (VoC)', icon: BarChart3, highlight: true },
    { id: 'ceo_orchestrator', label: 'Orquestrador CEO', icon: Crown, highlight: true },
    { id: 'trust_badge', label: 'Selo de Confiança', icon: ShieldCheck, highlight: true },
    ...(!isMarketplaceStore ? [{ id: 'scripts', label: 'Scripts Liquid & CSS', icon: Code2, highlight: true }] : [])
  ];

  // 🔐 2. MODO ENGENHARIA / WAR ROOM: As 4 Abas Profundas + Especialistas
  const warRoomTabs = [
    { id: 'summary', label: 'Visão Executiva', icon: LayoutDashboard },
    ...(isFounderAuthenticated ? [
      { id: 'founder_hq', label: 'Torre do Fundador (HQ)', icon: Crown, highlight: true },
      { id: 'agent_flowchart', label: 'Fluxograma do Enxame', icon: Zap, highlight: true }
    ] : []),
    { id: 'sku_crossing', label: 'Cruzamento SKUs & Abandonos', icon: GitCompare, highlight: true },
    { id: 'niche_recognition', label: 'Reconhecimento de Nicho', icon: Globe, highlight: true },
    { id: 'ceo_orchestrator', label: 'Orquestrador CEO', icon: Crown, highlight: true },
    { id: 'collection_audit', label: 'Coleções & Hero Banner', icon: Target, highlight: true },
    { id: 'orchestrator', label: 'Torre do Maestro', icon: Cpu, highlight: true },
    { id: 'market_hunter', label: 'Caçador de Mercado & Leads', icon: Compass, highlight: true },
    { id: 'product_evolution', label: 'Auto-Evolução do Produto', icon: Wrench, highlight: true },
    { id: 'customer_success', label: 'Clientes & Precificação (VoC)', icon: BarChart3, highlight: true },
    { id: 'scraper_dossier', label: 'Dossier de Evidências', icon: Search, highlight: true },
    { id: 'truth_auditor', label: 'Tribunal de Veracidade', icon: Scale, highlight: true },
    { id: 'swarm_control', label: 'Enxame Paralelo 24h', icon: BrainCircuit, highlight: true },
    { id: 'rupture_monitor', label: 'Vigia 24h Ruptura', icon: Flame, highlight: true },
    { id: 'pricing', label: 'Simulador Pix & Margem', icon: Calculator, highlight: true },
    { id: 'catalog', label: 'Catálogo & Estoque', icon: Layers, badge: totalCatalogAlerts > 0 ? totalCatalogAlerts : undefined },
    { id: 'vitals', label: 'Core Web Vitals 2026', icon: Gauge, highlight: true },
    { id: 'vision', label: 'Visão & Heatmap', icon: Eye, badge: diagnostic?.visionAnalysis.warnings.length },
    { id: 'telemetry', label: 'Telemetria & Clarity', icon: Activity },
    { id: 'trust_badge', label: 'Selo de Confiança', icon: ShieldCheck, highlight: true },
    ...(!isMarketplaceStore ? [{ id: 'scripts', label: 'Scripts Liquid & CSS', icon: Code2, highlight: true }] : []),
    { id: 'competitor', label: 'Espião', icon: Sword },
    { id: 'kanban', label: 'Plano de Ação', icon: KanbanSquare }
  ];

  const tabs = viewMode === 'merchant' ? merchantTabs : warRoomTabs;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-20">
      
      {/* Sticky Header */}
      <Header 
        diagnostic={diagnostic} 
        onOpenAuditModal={() => setIsAuditModalOpen(true)} 
        onExportReport={() => setIsExportModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAdmin={() => setIsLeadsDrawerOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
        onOpenWhatsAppLeadModal={() => setIsWhatsAppModalOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        
        {/* Prominent Link Input Inspector Hero */}
        <HeroUrlBar
          onAnalyze={handleStartRealAudit}
          isAnalyzing={isAnalyzing}
          currentUrl={diagnostic?.input.siteUrl}
        />

        {isAnalyzing ? (
          <AnalysisLoadingState
            siteUrl={analyzingUrl || 'seu site'}
            onComplete={() => {}}
          />
        ) : diagnostic ? (
          <div className="space-y-4">
            
            {/* 🎛️ 3-MODE SELECTOR SWITCHER (PROGRESSIVE DISCLOSURE) */}
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase font-mono">Modo de Visualização:</span>
              </div>

              <div className="flex items-center bg-slate-100 p-1 rounded-xl gap-1 text-xs font-bold w-full sm:w-auto">
                <button
                  onClick={() => {
                    setViewMode('merchant');
                    if (['orchestrator', 'scraper_dossier', 'truth_auditor', 'swarm_control', 'vitals', 'vision', 'telemetry', 'competitor', 'kanban'].includes(activeTab)) {
                      setActiveTab('summary');
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'merchant'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
                  <span>🛍️ Modo Lojista (6 Abas de Lucro)</span>
                </button>

                <button
                  onClick={() => setViewMode('war_room')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'war_room'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>⚡ Modo Engenheiro / War Room</span>
                </button>

                <button
                  onClick={() => setIsStoresManagerOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all flex items-center gap-1.5 cursor-pointer font-bold border border-blue-200"
                >
                  <Store className="w-3.5 h-3.5 text-blue-600" />
                  <span>📡 Lojas no Radar</span>
                </button>

                <button
                  onClick={() => setIsWhatsAppWatchdogOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all flex items-center gap-1.5 cursor-pointer font-bold border border-emerald-200"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>📲 Vigia WhatsApp (07:00)</span>
                </button>

                {/* 🔒 Master Founder Secret Trigger */}
                {!isFounderAuthenticated ? (
                  <button
                    onClick={() => setIsFounderModalOpen(true)}
                    className="p-2 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-amber-50 transition-all flex items-center gap-1 cursor-pointer"
                    title="Acesso Sigiloso do Fundador"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setActiveTab('founder_hq')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                        activeTab === 'founder_hq' || activeTab === 'agent_flowchart'
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                      }`}
                    >
                      <Crown className="w-3.5 h-3.5" />
                      <span>👑 Painel Fundador</span>
                    </button>
                    <button
                      onClick={() => {
                        sessionStorage.removeItem('adshield_founder_authenticated');
                        setIsFounderAuthenticated(false);
                        setActiveTab('summary');
                      }}
                      className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 text-xs"
                      title="Sair do Modo Fundador"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setIsIntegrationsModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center gap-1.5 cursor-pointer font-bold shadow-xs"
                >
                  <Plug className="w-3.5 h-3.5" />
                  <span>🔌 Conectar Loja (1-Click)</span>
                </button>

                <button
                  onClick={() => setIsWhiteLabelModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer font-bold border border-indigo-200"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span>📄 Dossiê PDF (Agência)</span>
                </button>
              </div>
            </div>

            {/* Clean Tab Navigation (Wrap Responsive, 100% Visible) */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer border ${
                      isActive
                        ? tab.highlight
                          ? 'bg-[#0056b3] text-white border-[#0056b3] shadow-md shadow-blue-500/20'
                          : 'bg-[#0056b3] text-white border-[#0056b3] shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-[#0056b3] hover:bg-slate-50'
                    }`}
                  >
                    <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Content Area Rendering */}
            <div className="animate-in fade-in duration-200">
              <ErrorBoundary>
                {activeTab === 'summary' && (
                  <ExecutiveSummary
                    diagnostic={diagnostic}
                    onSelectAgentTab={(tab) => setActiveTab(tab)}
                  />
                )}

                {activeTab === 'founder_hq' && (
                  <FounderMasterHqView />
                )}

                {activeTab === 'agent_flowchart' && (
                  <AutonomousAgentFlowchartView />
                )}

                {activeTab === 'sku_crossing' && diagnostic && (
                  <SkuAbandonmentCrossAuditView diagnostic={diagnostic} />
                )}

                {activeTab === 'niche_recognition' && diagnostic && (
                  <UniversalNicheRecognitionView diagnostic={diagnostic} />
                )}

                {activeTab === 'orchestrator' && (
                  <OrchestratorControlTowerView diagnostic={diagnostic} />
                )}

                {activeTab === 'ceo_orchestrator' && (
                  <ChiefExecutiveOrchestratorAgentView />
                )}

                {activeTab === 'collection_audit' && diagnostic && (
                  <CollectionDeepAuditView diagnostic={diagnostic} />
                )}

                {activeTab === 'scraper_dossier' && (
                  <DeepScraperDossierView diagnostic={diagnostic} />
                )}

                {activeTab === 'market_hunter' && (
                  <MarketHunterAgentView />
                )}

                {activeTab === 'product_evolution' && (
                  <ProductEvolutionAgentView />
                )}

                {activeTab === 'customer_success' && (
                  <CustomerSuccessVocAgentView />
                )}

                {activeTab === 'truth_auditor' && (
                  <TruthAuditorTribunalView diagnostic={diagnostic} />
                )}

                {activeTab === 'swarm_control' && (
                  <AutonomousSwarmControlView diagnostic={diagnostic} />
                )}

                {activeTab === 'marketplace' && (
                  <MarketplaceAuditView diagnostic={diagnostic} />
                )}

                {activeTab === 'vitals' && (
                  <CoreWebVitalsAuditView diagnostic={diagnostic} />
                )}

                {activeTab === 'pricing' && (
                  <PricingElasticitySimulatorView diagnostic={diagnostic} />
                )}

                {activeTab === 'rupture_monitor' && (
                  <StockRuptureMonitorView diagnostic={diagnostic} />
                )}

                {activeTab === 'trust_badge' && (
                  <TrustBadgeGeneratorView diagnostic={diagnostic} />
                )}

                {activeTab === 'catalog' && (
                  <BlindspotAuditView diagnostic={diagnostic} />
                )}

                {activeTab === 'telemetry' && (
                  <ShopifyTelemetryView diagnostic={diagnostic} />
                )}

                {activeTab === 'scripts' && (
                  <ThemeScriptGeneratorView diagnostic={diagnostic} />
                )}

                {activeTab === 'vision' && (
                  <ComputerVisionInspectionView diagnostic={diagnostic} />
                )}

                {activeTab === 'competitor' && (
                  <CompetitorAgentView diagnostic={diagnostic} />
                )}

                {activeTab === 'kanban' && (
                  <ActionPlanKanban diagnostic={diagnostic} />
                )}

                {activeTab === 'code_security' && (
                  <div className="space-y-6">
                    <SecurityAgentView diagnostic={diagnostic} />
                    <SeoAgentView diagnostic={diagnostic} />
                  </div>
                )}

                {activeTab === 'cro_copy' && (
                  <div className="space-y-6">
                    <CroAgentView diagnostic={diagnostic} />
                    <SalesCopyAgentView diagnostic={diagnostic} />
                    <AdsAgentView diagnostic={diagnostic} />
                  </div>
                )}

                {activeTab === 'social_pm' && (
                  <div className="space-y-6">
                    <SocialAgentView diagnostic={diagnostic} />
                    <PmGrowthAgentView diagnostic={diagnostic} />
                  </div>
                )}

                {activeTab === 'tools' && (
                  <div className="space-y-6">
                    <AgentChatView diagnostic={diagnostic} />
                    <RoasCalculator />
                  </div>
                )}
              </ErrorBoundary>
            </div>

          </div>
        ) : null}

      </main>

      {/* Audit Modal */}
      <AuditFormModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        onSubmit={handleStartRealAudit}
        initialData={diagnostic?.input}
      />

      {/* Export Report Modal (White-Label PDF) */}
      {isExportModalOpen && diagnostic && (
        <ExecutivePdfExportModal
          diagnostic={diagnostic}
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal onClose={() => setIsSettingsModalOpen(false)} />
      )}

      {isAdminDashboardOpen && (
        <AdminLeadsDashboard onClose={() => setIsAdminDashboardOpen(false)} />
      )}

      {isPricingModalOpen && (
        <PricingModal onClose={() => setIsPricingModalOpen(false)} />
      )}

      {diagnostic && (
        <WhatsAppLeadCaptureModal
          diagnostic={diagnostic}
          isOpen={isWhatsAppModalOpen}
          onClose={() => setIsWhatsAppModalOpen(false)}
        />
      )}

      <AdminLeadsDrawer
        isOpen={isLeadsDrawerOpen}
        onClose={() => setIsLeadsDrawerOpen(false)}
      />

      <MonitoredStoresManagerModal
        isOpen={isStoresManagerOpen}
        onClose={() => setIsStoresManagerOpen(false)}
        onSelectStoreToAudit={(url) => {
          setAnalyzingUrl(url);
          setIsAnalyzing(true);
        }}
      />

      <WhatsAppWatchdogSettingsModal
        isOpen={isWhatsAppWatchdogOpen}
        onClose={() => setIsWhatsAppWatchdogOpen(false)}
      />

      <EcommerceIntegrationsHubModal
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
      />

      {diagnostic && (
        <AgencyWhiteLabelModal
          isOpen={isWhiteLabelModalOpen}
          onClose={() => setIsWhiteLabelModalOpen(false)}
          diagnostic={diagnostic}
        />
      )}

      {/* 🔒 Master Founder Auth Gate */}
      <FounderAuthModal
        isOpen={isFounderModalOpen}
        onClose={() => setIsFounderModalOpen(false)}
        onSuccess={() => {
          setIsFounderAuthenticated(true);
          setIsFounderModalOpen(false);
          setActiveTab('founder_hq');
        }}
      />

      <FloatingAiChatWidget />

      {/* Footer Legal & Institucional */}
      <footer className="max-w-7xl mx-auto py-8 px-4 border-t border-slate-200 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          <p className="font-bold text-slate-700">AdShield • Ecossistema BRK Group</p>
          <p className="text-[11px] text-slate-400">Auditoria 360º de Conversão, Catálogo & Visão Computacional.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <button onClick={() => navigate('/about')} className="hover:text-blue-600 font-bold transition-colors cursor-pointer">Quem Somos</button>
          <button onClick={() => navigate('/terms')} className="hover:text-blue-600 transition-colors cursor-pointer">Termos de Uso</button>
          <button onClick={() => navigate('/privacy')} className="hover:text-blue-600 transition-colors cursor-pointer">Política de Privacidade & LGPD</button>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
