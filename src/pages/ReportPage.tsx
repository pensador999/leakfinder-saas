import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Header } from '../components/Header';
import { ExecutiveSummary } from '../components/ExecutiveSummary';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CookieBanner } from '../components/CookieBanner';
import { TabLoadingSkeleton } from '../components/TabLoadingSkeleton';
import { detectMarketplace } from '../services/marketplaceInspector';
import { AgentDiagnosticResult } from '../types';
import { LayoutDashboard, Eye, ShoppingCart, Calculator, ShieldCheck, Sword, KanbanSquare, Layers, Activity, Code2, Store, Gauge, Flame, Cpu, Search, Scale, BrainCircuit } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// ⚡ LAZY LOADED ANALYTICAL TABS (Demanded only when tab is active)
const ComputerVisionInspectionView = lazy(() => import('../components/agents/ComputerVisionInspectionView').then(m => ({ default: m.ComputerVisionInspectionView })));
const BlindspotAuditView = lazy(() => import('../components/BlindspotAuditView').then(m => ({ default: m.BlindspotAuditView })));
const SecurityAgentView = lazy(() => import('../components/agents/SecurityAgentView').then(m => ({ default: m.SecurityAgentView })));
const SocialAgentView = lazy(() => import('../components/agents/SocialAgentView').then(m => ({ default: m.SocialAgentView })));
const CroAgentView = lazy(() => import('../components/agents/CroAgentView').then(m => ({ default: m.CroAgentView })));
const SeoAgentView = lazy(() => import('../components/agents/SeoAgentView').then(m => ({ default: m.SeoAgentView })));
const AdsAgentView = lazy(() => import('../components/agents/AdsAgentView').then(m => ({ default: m.AdsAgentView })));
const SalesCopyAgentView = lazy(() => import('../components/agents/SalesCopyAgentView').then(m => ({ default: m.SalesCopyAgentView })));
const PmGrowthAgentView = lazy(() => import('../components/agents/PmGrowthAgentView').then(m => ({ default: m.PmGrowthAgentView })));
const CompetitorAgentView = lazy(() => import('../components/agents/CompetitorAgentView').then(m => ({ default: m.CompetitorAgentView })));
const ActionPlanKanban = lazy(() => import('../components/agents/ActionPlanKanban').then(m => ({ default: m.ActionPlanKanban })));
const AgentChatView = lazy(() => import('../components/agents/AgentChatView').then(m => ({ default: m.AgentChatView })));
const RoasCalculator = lazy(() => import('../components/tools/RoasCalculator').then(m => ({ default: m.RoasCalculator })));
const ShopifyTelemetryView = lazy(() => import('../components/ShopifyTelemetryView').then(m => ({ default: m.ShopifyTelemetryView })));
const ThemeScriptGeneratorView = lazy(() => import('../components/ThemeScriptGeneratorView').then(m => ({ default: m.ThemeScriptGeneratorView })));
const MarketplaceAuditView = lazy(() => import('../components/MarketplaceAuditView').then(m => ({ default: m.MarketplaceAuditView })));
const CoreWebVitalsAuditView = lazy(() => import('../components/CoreWebVitalsAuditView').then(m => ({ default: m.CoreWebVitalsAuditView })));
const PricingElasticitySimulatorView = lazy(() => import('../components/PricingElasticitySimulatorView').then(m => ({ default: m.PricingElasticitySimulatorView })));
const TrustBadgeGeneratorView = lazy(() => import('../components/TrustBadgeGeneratorView').then(m => ({ default: m.TrustBadgeGeneratorView })));
const StockRuptureMonitorView = lazy(() => import('../components/StockRuptureMonitorView').then(m => ({ default: m.StockRuptureMonitorView })));
const OrchestratorControlTowerView = lazy(() => import('../components/OrchestratorControlTowerView').then(m => ({ default: m.OrchestratorControlTowerView })));
const DeepScraperDossierView = lazy(() => import('../components/DeepScraperDossierView').then(m => ({ default: m.DeepScraperDossierView })));
const TruthAuditorTribunalView = lazy(() => import('../components/TruthAuditorTribunalView').then(m => ({ default: m.TruthAuditorTribunalView })));
const AutonomousSwarmControlView = lazy(() => import('../components/AutonomousSwarmControlView').then(m => ({ default: m.AutonomousSwarmControlView })));

// ⚡ LAZY LOADED MODALS
const ExecutivePdfExportModal = lazy(() => import('../components/ExecutivePdfExportModal').then(m => ({ default: m.ExecutivePdfExportModal })));
const SettingsModal = lazy(() => import('../components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const AdminLeadsDashboard = lazy(() => import('../components/AdminLeadsDashboard').then(m => ({ default: m.AdminLeadsDashboard })));

export function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnostic, setDiagnostic] = useState<AgentDiagnosticResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAudit = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      if (id.startsWith('fallback-') || id === 'latest') {
        const saved = localStorage.getItem('latestAudit');
        if (saved) {
          setDiagnostic(JSON.parse(saved));
        } else {
          navigate('/');
        }
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('audits')
          .select('result_data')
          .eq('id', id)
          .single();

        if (error || !data) {
          console.error("Audit not found in DB", error);
          navigate('/');
        } else {
          setDiagnostic(data.result_data);
        }
      } catch (err) {
        console.error("Error fetching audit:", err);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudit();
  }, [id, navigate]);

  const [viewMode, setViewMode] = useState<'merchant' | 'war_room'>('merchant');

  if (isLoading) {
    return <div className="min-h-screen bg-[#0E100F] text-[#FFFCE1] flex items-center justify-center font-mono text-sm">Carregando Relatório AdShield...</div>;
  }

  const totalCatalogAlerts = ((diagnostic?.realSiteData.catalogAudit?.productsWithBrokenGrid || 0) + 
                             (diagnostic?.realSiteData.catalogAudit?.productsWithMissingImages || 0));

  const isMarketplaceStore = diagnostic 
    ? (detectMarketplace(diagnostic.realSiteData.url, diagnostic.realSiteData.domain).isMarketplace || Boolean(diagnostic.realSiteData.isMarketplaceSeller))
    : false;

  // 🛍️ 1. MODO LOJISTA: As Abas Essenciais de Negócio & Lucro
  const merchantTabs = [
    { id: 'summary', label: 'Visão Executiva', icon: LayoutDashboard },
    ...(isMarketplaceStore ? [{ id: 'marketplace', label: 'Auditoria de Marketplace & Buy Box', icon: Store, highlight: true }] : []),
    { id: 'rupture_monitor', label: 'Vigia 24h Ruptura', icon: Flame, highlight: true },
    { id: 'pricing', label: 'Simulador Pix & Margem', icon: Calculator, highlight: true },
    { id: 'catalog', label: 'Catálogo & Estoque', icon: Layers, badge: totalCatalogAlerts > 0 ? totalCatalogAlerts : undefined },
    { id: 'trust_badge', label: 'Selo de Confiança', icon: ShieldCheck, highlight: true },
    ...(!isMarketplaceStore ? [{ id: 'scripts', label: 'Scripts Liquid & CSS', icon: Code2, highlight: true }] : [])
  ];

  // 🔐 2. MODO ENGENHARIA / WAR ROOM: As Abas Profundas + Especialistas
  const warRoomTabs = [
    { id: 'summary', label: 'Visão Executiva', icon: LayoutDashboard },
    ...(isMarketplaceStore ? [{ id: 'marketplace', label: 'Auditoria de Marketplace & Buy Box', icon: Store, highlight: true }] : []),
    { id: 'orchestrator', label: 'Torre do Maestro', icon: Cpu, highlight: true },
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
    <div className="min-h-screen bg-[#0E100F] text-[#FFFCE1] font-sans antialiased pb-20 selection:bg-[#0AE448] selection:text-slate-950">
      
      {/* Sticky Header Actions */}
      <Header 
        diagnostic={diagnostic} 
        onOpenAuditModal={() => navigate('/')} 
        onExportReport={() => setIsExportModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        onOpenPricing={() => {}}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        
        {diagnostic ? (
          <div className="space-y-4">
            
            {/* 🎛️ 3-MODE SELECTOR SWITCHER (PROGRESSIVE DISCLOSURE) */}
            <div className="p-3 bg-[#101211] rounded-2xl border border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-[#BBBAA6] uppercase tracking-wider">Modo de Visualização:</span>
              </div>

              <div className="flex items-center bg-[#0E100F] p-1 rounded-xl border border-white/5 gap-1 text-xs font-bold w-full sm:w-auto">
                <button
                  onClick={() => {
                    setViewMode('merchant');
                    if (['orchestrator', 'scraper_dossier', 'truth_auditor', 'swarm_control', 'vitals', 'vision', 'telemetry', 'competitor', 'kanban'].includes(activeTab)) {
                      setActiveTab('summary');
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'merchant'
                      ? 'bg-white/10 text-[#0AE448] border border-[#0AE448]/30 shadow-xs'
                      : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-[#0AE448]" />
                  <span>🛍️ Modo Lojista (6 Abas de Lucro)</span>
                </button>

                <button
                  onClick={() => setViewMode('war_room')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'war_room'
                      ? 'bg-[#0AE448] text-slate-950 shadow-md shadow-[#0AE448]/20 font-black'
                      : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>⚡ Modo Engenheiro / War Room</span>
                </button>
              </div>
            </div>

            {/* Clean Tab Navigation (Wrap Responsive, 100% Visible) */}
            <div className="flex flex-wrap items-center gap-1.5 bg-[#101211] p-2.5 rounded-2xl border border-white/10 shadow-xl">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs flex items-center gap-2 transition-all shrink-0 cursor-pointer border ${
                      isActive
                        ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] shadow-lg shadow-[#0AE448]/20 font-black'
                        : 'bg-[#141716] text-[#BBBAA6] border-white/5 hover:border-white/20 hover:text-[#FFFCE1] hover:bg-white/5 font-semibold'
                    }`}
                  >
                    <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-[#BBBAA6]'}`} />
                    <span>{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-mono font-black ${
                        isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-[#0AE448]'
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

                {/* Lazy Loaded Analytical Tabs with Skeleton Fallback */}
                <Suspense fallback={<TabLoadingSkeleton />}>
                  {activeTab === 'orchestrator' && (
                    <OrchestratorControlTowerView diagnostic={diagnostic} />
                  )}

                  {activeTab === 'scraper_dossier' && (
                    <DeepScraperDossierView diagnostic={diagnostic} />
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
                </Suspense>
              </ErrorBoundary>
            </div>

          </div>
        ) : null}

      </main>

      {/* Lazy Loaded Modals */}
      <Suspense fallback={null}>
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
      </Suspense>

      {/* Footer Legal & Institucional Independente */}
      <footer className="max-w-7xl mx-auto py-8 px-4 border-t border-white/10 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-[#BBBAA6] gap-4">
        <div>
          <p className="font-bold text-[#FFFCE1]">AdShield Intelligence • Plataforma Independente de Auditoria de E-Commerce</p>
          <p className="text-[11px] text-[#BBBAA6] font-mono">Diagnóstico Técnico 360º de Sites, Catálogos e Tráfego Pago • Marco Civil e LGPD.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <button onClick={() => navigate('/about')} className="hover:text-[#0AE448] font-bold transition-colors cursor-pointer">Quem Somos</button>
          <button onClick={() => navigate('/terms')} className="hover:text-[#0AE448] transition-colors cursor-pointer">Termos de Uso</button>
          <button onClick={() => navigate('/privacy')} className="hover:text-[#0AE448] font-semibold transition-colors cursor-pointer">Política de Privacidade & LGPD</button>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
