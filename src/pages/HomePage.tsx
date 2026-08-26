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
import { ReportExporter } from '../components/tools/ReportExporter';
import { SettingsModal } from '../components/SettingsModal';
import { AdminLeadsDashboard } from '../components/AdminLeadsDashboard';
import { PricingModal } from '../components/PricingModal';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CookieBanner } from '../components/CookieBanner';
import { runAgentDiagnosticAsync } from '../services/agentEngine';
import { extractCleanDomainAndBrand } from '../services/siteInspector';
import { AuditInput, AgentDiagnosticResult } from '../types';
import { ShopifyTelemetryView } from '../components/ShopifyTelemetryView';
import { ThemeScriptGeneratorView } from '../components/ThemeScriptGeneratorView';
import { MarketplaceAuditView } from '../components/MarketplaceAuditView';
import { detectMarketplace } from '../services/marketplaceInspector';
import { LayoutDashboard, Eye, ShoppingCart, Target, Calculator, ShieldCheck, Sword, KanbanSquare, Layers, Activity, Code2, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const [diagnostic, setDiagnostic] = useState<AgentDiagnosticResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingUrl, setAnalyzingUrl] = useState<string>('');
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);

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

  const totalCatalogAlerts = ((diagnostic?.realSiteData.catalogAudit?.productsWithBrokenGrid || 0) + 
                             (diagnostic?.realSiteData.catalogAudit?.productsWithMissingImages || 0));

  const isMarketplaceStore = diagnostic 
    ? detectMarketplace(diagnostic.realSiteData.url, diagnostic.realSiteData.domain).isMarketplace 
    : false;

  const allTabs = [
    { id: 'summary', label: 'Visão Executiva', icon: LayoutDashboard },
    ...(isMarketplaceStore ? [{ id: 'marketplace', label: 'Auditoria de Anúncio', icon: Store, highlight: true }] : []),
    { id: 'catalog', label: 'Catálogo & SKUs', icon: Layers, badge: totalCatalogAlerts > 0 ? totalCatalogAlerts : undefined },
    { id: 'telemetry', label: 'Telemetria & Clarity', icon: Activity },
    ...(!isMarketplaceStore ? [{ id: 'scripts', label: 'Scripts Liquid & CSS', icon: Code2, highlight: true }] : []),
    { id: 'vision', label: 'Visão Computacional & Heatmap', icon: Eye, badge: diagnostic?.visionAnalysis.warnings.length },
    { id: 'competitor', label: 'Espião', icon: Sword },
    { id: 'kanban', label: 'Plano de Ação', icon: KanbanSquare },
    { id: 'code_security', label: 'Código & Segurança', icon: ShieldCheck, badge: diagnostic?.cro.findings.length, advanced: true },
    { id: 'cro_copy', label: 'CRO & Ofertas', icon: ShoppingCart, advanced: true },
    { id: 'social_pm', label: 'Social & Estratégia', icon: Target, advanced: true },
    { id: 'tools', label: 'Simulador & War Room', icon: Calculator }
  ];

  const tabs = isAdvancedMode ? allTabs : allTabs.filter(t => !t.advanced);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased pb-20">
      
      {/* Sticky Header */}
      <Header 
        diagnostic={diagnostic} 
        onOpenAuditModal={() => setIsAuditModalOpen(true)} 
        onExportReport={() => setIsExportModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        onOpenPricing={() => setIsPricingModalOpen(true)}
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
          <div className="space-y-6">
            
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

            {/* Advanced Mode Toggle */}
            <div className="flex justify-end px-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">Modo Avançado (Auditoria Técnica)</span>
                <div className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors ${isAdvancedMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                  <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${isAdvancedMode ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isAdvancedMode} 
                  onChange={() => {
                    setIsAdvancedMode(!isAdvancedMode);
                    if (isAdvancedMode && ['code_security', 'cro_copy', 'social_pm'].includes(activeTab)) {
                      setActiveTab('summary');
                    }
                  }} 
                />
              </label>
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

                {activeTab === 'marketplace' && (
                  <MarketplaceAuditView diagnostic={diagnostic} />
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

      {/* Export Report Modal */}
      {isExportModalOpen && diagnostic && (
        <ReportExporter
          diagnostic={diagnostic}
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

      {/* Footer Legal */}
      <footer className="max-w-7xl mx-auto py-8 px-4 border-t border-slate-200 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} LeakFinder. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <button onClick={() => navigate('/privacy')} className="hover:text-slate-900 transition-colors cursor-pointer">Política de Privacidade</button>
          <button onClick={() => navigate('/terms')} className="hover:text-slate-900 transition-colors cursor-pointer">Termos de Uso</button>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
