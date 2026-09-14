import React, { useState, useEffect, Suspense, lazy } from 'react';
import confetti from 'canvas-confetti';
import { Header, StorePreset } from '../components/Header';
import { HeroUrlBar } from '../components/HeroUrlBar';
import { ExecutiveSummary } from '../components/ExecutiveSummary';
import { MitigationHistoryDrawer } from '../components/actions/MitigationHistoryDrawer';
import { MerchantTripleImpactDossier } from '../components/merchant/MerchantTripleImpactDossier';
import { AnalysisLoadingState } from '../components/AnalysisLoadingState';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CookieBanner } from '../components/CookieBanner';
import { TabLoadingSkeleton } from '../components/TabLoadingSkeleton';
import { PublicDossierMerchantHeader } from '../components/PublicDossierMerchantHeader';
import { runAgentDiagnosticAsync } from '../services/agentEngine';
import { extractCleanDomainAndBrand } from '../services/siteInspector';
import { AuditInput, AgentDiagnosticResult } from '../types';
import { detectMarketplace } from '../services/marketplaceInspector';
import { saveAuditToDatabase } from '../services/history/storeAuditHistoryService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  LayoutDashboard, Eye, ShoppingCart, Target, Calculator, ShieldCheck, Sword, 
  KanbanSquare, Layers, Activity, Code2, Store, Gauge, Flame, Cpu, Search, 
  Scale, BrainCircuit, Compass, Wrench, BarChart3, Crown, Plug, FileText, 
  Globe, GitCompare, Zap, Lock, Unlock, GitFork, Database, BadgeCheck, Share2, Factory 
} from 'lucide-react';

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
const MarketHunterAgentView = lazy(() => import('../components/agents/MarketHunterAgentView').then(m => ({ default: m.MarketHunterAgentView })));
const ProductEvolutionAgentView = lazy(() => import('../components/agents/ProductEvolutionAgentView').then(m => ({ default: m.ProductEvolutionAgentView })));
const CustomerSuccessVocAgentView = lazy(() => import('../components/agents/CustomerSuccessVocAgentView').then(m => ({ default: m.CustomerSuccessVocAgentView })));
const ChiefExecutiveOrchestratorAgentView = lazy(() => import('../components/agents/ChiefExecutiveOrchestratorAgentView').then(m => ({ default: m.ChiefExecutiveOrchestratorAgentView })));
const CollectionDeepAuditView = lazy(() => import('../components/CollectionDeepAuditView').then(m => ({ default: m.CollectionDeepAuditView })));
const UniversalNicheRecognitionView = lazy(() => import('../components/agents/UniversalNicheRecognitionView').then(m => ({ default: m.UniversalNicheRecognitionView })));
const SkuAbandonmentCrossAuditView = lazy(() => import('../components/SkuAbandonmentCrossAuditView').then(m => ({ default: m.SkuAbandonmentCrossAuditView })));
const FounderMasterHqView = lazy(() => import('../components/founder/FounderMasterHqView').then(m => ({ default: m.FounderMasterHqView })));
const AutonomousAgentFlowchartView = lazy(() => import('../components/founder/AutonomousAgentFlowchartView').then(m => ({ default: m.AutonomousAgentFlowchartView })));
const TreeOfThoughtDebateView = lazy(() => import('../components/agents/TreeOfThoughtDebateView').then(m => ({ default: m.TreeOfThoughtDebateView })));
const VectorMemoryCompetitorRadarView = lazy(() => import('../components/agents/VectorMemoryCompetitorRadarView').then(m => ({ default: m.VectorMemoryCompetitorRadarView })));
const DualAgentConsensusTribunalView = lazy(() => import('../components/agents/DualAgentConsensusTribunalView').then(m => ({ default: m.DualAgentConsensusTribunalView })));
const OmnichannelSocialCommerceView = lazy(() => import('../components/social/OmnichannelSocialCommerceView').then(m => ({ default: m.OmnichannelSocialCommerceView })));
const SupplyChainDiscrepancyView = lazy(() => import('../components/supplyChain/SupplyChainDiscrepancyView').then(m => ({ default: m.SupplyChainDiscrepancyView })));

// ⚡ LAZY LOADED MODALS (Demanded only when modal is triggered)
const AuditFormModal = lazy(() => import('../components/AuditFormModal').then(m => ({ default: m.AuditFormModal })));
const ExecutivePdfExportModal = lazy(() => import('../components/ExecutivePdfExportModal').then(m => ({ default: m.ExecutivePdfExportModal })));
const SettingsModal = lazy(() => import('../components/SettingsModal').then(m => ({ default: m.SettingsModal })));
const AdminLeadsDashboard = lazy(() => import('../components/AdminLeadsDashboard').then(m => ({ default: m.AdminLeadsDashboard })));
const TransparentCheckoutModal = lazy(() => import('../components/billing/TransparentCheckoutModal').then(m => ({ default: m.TransparentCheckoutModal })));
const WhatsAppLeadCaptureModal = lazy(() => import('../components/WhatsAppLeadCaptureModal').then(m => ({ default: m.WhatsAppLeadCaptureModal })));
const AdminLeadsDrawer = lazy(() => import('../components/AdminLeadsDrawer').then(m => ({ default: m.AdminLeadsDrawer })));
const MonitoredStoresManagerModal = lazy(() => import('../components/MonitoredStoresManagerModal').then(m => ({ default: m.MonitoredStoresManagerModal })));
const WhatsAppWatchdogSettingsModal = lazy(() => import('../components/WhatsAppWatchdogSettingsModal').then(m => ({ default: m.WhatsAppWatchdogSettingsModal })));
const EcommerceIntegrationsHubModal = lazy(() => import('../components/EcommerceIntegrationsHubModal').then(m => ({ default: m.EcommerceIntegrationsHubModal })));
const AgencyWhiteLabelModal = lazy(() => import('../components/agency/AgencyWhiteLabelModal').then(m => ({ default: m.AgencyWhiteLabelModal })));
const FounderAuthModal = lazy(() => import('../components/founder/FounderAuthModal').then(m => ({ default: m.FounderAuthModal })));
const MetaAdsAutoKillSwitchModal = lazy(() => import('../components/ads/MetaAdsAutoKillSwitchModal').then(m => ({ default: m.MetaAdsAutoKillSwitchModal })));
const BatchProspectingAuditorModal = lazy(() => import('../components/agency/BatchProspectingAuditorModal').then(m => ({ default: m.BatchProspectingAuditorModal })));
const ChromeExtensionModal = lazy(() => import('../components/tools/ChromeExtensionModal').then(m => ({ default: m.ChromeExtensionModal })));
const FloatingAiChatWidget = lazy(() => import('../components/FloatingAiChatWidget').then(m => ({ default: m.FloatingAiChatWidget })));

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
  const [isMetaAutoKillModalOpen, setIsMetaAutoKillModalOpen] = useState<boolean>(false);
  const [isBatchAuditorOpen, setIsBatchAuditorOpen] = useState<boolean>(false);
  const [isChromeExtensionOpen, setIsChromeExtensionOpen] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingUrl, setAnalyzingUrl] = useState<string>('');
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [isPublicDossierMode, setIsPublicDossierMode] = useState<boolean>(false);
  const [isMitigationHistoryOpen, setIsMitigationHistoryOpen] = useState<boolean>(false);

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

  // Initial load: dynamically check if a specific store was requested via query param
  useEffect(() => {
    const targetQueryUrl = searchParams.get('loja') || searchParams.get('url') || searchParams.get('dossier') || searchParams.get('store');
    const storeToScan = targetQueryUrl ? (targetQueryUrl.startsWith('http') ? targetQueryUrl : `https://${targetQueryUrl}`) : 'https://www.brkagro.com.br';
    
    if (targetQueryUrl) {
      setIsPublicDossierMode(true);
    }

    const { cleanUrl, brandName } = extractCleanDomainAndBrand(storeToScan);

    const initialInput: AuditInput = {
      siteUrl: cleanUrl,
      businessName: brandName,
      businessType: 'ecommerce',
      niche: cleanUrl.includes('agro') ? 'Agropecuária & Moda Campo' : 'Moda & Varejo E-commerce',
      monthlyRevenue: 'R$ 50k a R$ 200k',
      averageOrderValue: 180,
      mainChallenge: 'low_conversion',
      targetRegion: 'Brasil',
      grossMargin: 45,
      competitorsUrl: 'https://concorrente.com.br'
    };
    runAgentDiagnosticAsync(initialInput).then(res => {
      setDiagnostic(res);
      saveAuditToDatabase(res).catch(e => console.warn('[Supabase Auto-Save] Initial audit save error:', e));
    });
  }, [searchParams]);

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

      // 🗄️ Save audit to Supabase and update continuous score evolution timeline
      saveAuditToDatabase(result).catch(e => console.warn('[Supabase Auto-Save] Manual audit save error:', e));

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

  type NavigationPillar = 'PROFIT_DIAGNOSTIC' | 'CATALOG_STOCK' | 'MEDIA_INTELLIGENCE' | 'FOUNDER_SUITE';
  const [activePillar, setActivePillar] = useState<NavigationPillar>('PROFIT_DIAGNOSTIC');

  // Keep activePillar synchronized whenever activeTab changes
  useEffect(() => {
    if (['founder_hq', 'agent_flowchart'].includes(activeTab)) {
      setActivePillar('FOUNDER_SUITE');
    } else if (['sku_crossing', 'niche_recognition', 'catalog', 'rupture_monitor'].includes(activeTab)) {
      setActivePillar('CATALOG_STOCK');
    } else if (['market_hunter', 'product_evolution', 'customer_success', 'ceo_orchestrator', 'scripts', 'orchestrator', 'scraper_dossier', 'truth_auditor', 'swarm_control', 'vitals', 'vision', 'telemetry', 'competitor', 'kanban'].includes(activeTab)) {
      setActivePillar('MEDIA_INTELLIGENCE');
    } else {
      setActivePillar('PROFIT_DIAGNOSTIC');
    }
  }, [activeTab]);

  // 🏛️ AS 3 GRANDES PILARES DIDÁTICOS DE NAVEGAÇÃO + SUITE DO FUNDADOR
  const pillarCategories = [
    {
      id: 'PROFIT_DIAGNOSTIC' as NavigationPillar,
      label: '📊 Diagnóstico & Lucro',
      badge: 'Essencial',
      tabs: [
        { id: 'summary', label: 'Visão Executiva', icon: LayoutDashboard },
        { id: 'pricing', label: 'Simulador Pix & Margem', icon: Calculator, highlight: true },
        { id: 'omnichannel_social', label: '📲 Redes Sociais & Venda Direta', icon: Share2, highlight: true },
        { id: 'collection_audit', label: 'Coleções & Hero Banner', icon: Target, highlight: true },
        { id: 'trust_badge', label: 'Selo de Confiança Legal', icon: ShieldCheck, highlight: true }
      ]
    },
    {
      id: 'CATALOG_STOCK' as NavigationPillar,
      label: '🩺 Catálogo & Estoque',
      badge: totalCatalogAlerts > 0 ? `${totalCatalogAlerts} Alertas` : undefined,
      tabs: [
        { id: 'supply_chain_discrepancy', label: '📦 Descompasso ERP & Hub (Sankhya/Magis5)', icon: Factory, highlight: true },
        { id: 'sku_crossing', label: 'Cruzamento SKUs & Abandonos', icon: GitCompare, highlight: true },
        { id: 'niche_recognition', label: 'Reconhecimento de Nicho', icon: Globe, highlight: true },
        { id: 'catalog', label: 'Catálogo & Grade PP-G2', icon: Layers, badge: totalCatalogAlerts > 0 ? totalCatalogAlerts : undefined },
        { id: 'rupture_monitor', label: 'Vigia 24h Ruptura', icon: Flame, highlight: true }
      ]
    },
    {
      id: 'MEDIA_INTELLIGENCE' as NavigationPillar,
      label: '⚡ Mídia & Inteligência',
      badge: viewMode === 'war_room' ? 'War Room' : 'IA 24h',
      tabs: viewMode === 'merchant' ? [
        { id: 'tree_of_thought', label: '🌲 Debate dos Agentes (ToT)', icon: GitFork, highlight: true },
        { id: 'truth_auditor', label: '🛡️ Tribunal de Consenso (2 Agentes)', icon: Scale, highlight: true },
        { id: 'vector_radar', label: '🗄️ Memória RAG & Radar', icon: Database, highlight: true },
        { id: 'market_hunter', label: 'Caçador de Mercado & Leads', icon: Compass, highlight: true },
        { id: 'product_evolution', label: 'Auto-Evolução do Produto', icon: Wrench, highlight: true },
        { id: 'customer_success', label: 'Clientes & Precificação (VoC)', icon: BarChart3, highlight: true },
        { id: 'ceo_orchestrator', label: 'Orquestrador CEO', icon: Crown, highlight: true },
        ...(!isMarketplaceStore ? [{ id: 'scripts', label: 'Scripts Liquid & CSS', icon: Code2, highlight: true }] : [])
      ] : [
        { id: 'tree_of_thought', label: '🌲 Debate dos Agentes (ToT)', icon: GitFork, highlight: true },
        { id: 'truth_auditor', label: '🛡️ Tribunal de Consenso (Zero Falso-Positivo)', icon: Scale, highlight: true },
        { id: 'vector_radar', label: '🗄️ Memória RAG & Radar', icon: Database, highlight: true },
        { id: 'ceo_orchestrator', label: 'Orquestrador CEO', icon: Crown, highlight: true },
        { id: 'orchestrator', label: 'Torre do Maestro', icon: Cpu, highlight: true },
        { id: 'market_hunter', label: 'Caçador de Mercado & Leads', icon: Compass, highlight: true },
        { id: 'product_evolution', label: 'Auto-Evolução do Produto', icon: Wrench, highlight: true },
        { id: 'customer_success', label: 'Clientes & Precificação (VoC)', icon: BarChart3, highlight: true },
        { id: 'scraper_dossier', label: 'Dossier de Evidências', icon: Search, highlight: true },
        { id: 'swarm_control', label: 'Enxame Paralelo 24h', icon: BrainCircuit, highlight: true },
        { id: 'vitals', label: 'Core Web Vitals 2026', icon: Gauge, highlight: true },
        { id: 'vision', label: 'Visão & Heatmap', icon: Eye, badge: diagnostic?.visionAnalysis.warnings.length },
        { id: 'telemetry', label: 'Telemetria & Clarity', icon: Activity },
        ...(!isMarketplaceStore ? [{ id: 'scripts', label: 'Scripts Liquid & CSS', icon: Code2, highlight: true }] : []),
        { id: 'competitor', label: 'Espião', icon: Sword },
        { id: 'kanban', label: 'Plano de Ação', icon: KanbanSquare }
      ]
    },
    ...(isFounderAuthenticated ? [{
      id: 'FOUNDER_SUITE' as NavigationPillar,
      label: '👑 Gestão do Fundador',
      badge: 'Sigiloso',
      tabs: [
        { id: 'founder_hq', label: 'Torre do Fundador (HQ)', icon: Crown, highlight: true },
        { id: 'agent_flowchart', label: 'Fluxograma do Enxame', icon: Zap, highlight: true }
      ]
    }] : [])
  ];

  const currentPillar = pillarCategories.find(p => p.id === activePillar) || pillarCategories[0];
  const activePillarTabs = currentPillar.tabs;

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
        onSelectStorePreset={(preset: StorePreset) => {
          handleStartRealAudit({
            siteUrl: preset.url,
            businessName: preset.brandName,
            businessType: 'ecommerce',
            niche: preset.niche,
            monthlyRevenue: 'R$ 50k a R$ 200k',
            averageOrderValue: preset.aov,
            mainChallenge: 'low_conversion',
            targetRegion: 'Brasil',
            grossMargin: 45,
            competitorsUrl: 'https://concorrente.com.br'
          });
        }}
        onOpenMitigationHistory={() => setIsMitigationHistoryOpen(true)}
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
            
            {/* 🚨 HIGH-CONVERTING PUBLIC DOSSIER MERCHANT BANNER */}
            <PublicDossierMerchantHeader
              diagnostic={diagnostic}
              onOpenPricing={() => setIsPricingModalOpen(true)}
              onOpenWhatsApp={() => setIsWhatsAppModalOpen(true)}
            />

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
                  onClick={() => setIsBatchAuditorOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-all flex items-center gap-1.5 cursor-pointer font-bold border border-indigo-200"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>🏢 Scanner em Lote (Agências)</span>
                </button>

                <button
                  onClick={() => setIsChromeExtensionOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 transition-all flex items-center gap-1.5 cursor-pointer font-bold border border-amber-200"
                >
                  <Globe className="w-3.5 h-3.5 text-amber-600" />
                  <span>🧩 Extensão Chrome</span>
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

            {/* 🏛️ 3-PILLAR MASTER DIDACTIC NAVIGATION */}
            <div className="space-y-2">
              
              {/* Top Segmented Pillar Selector (4 Pillars Max) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-200/70 p-1.5 rounded-2xl border border-slate-300/60 shadow-xs">
                {pillarCategories.map((pillar) => {
                  const isPillarActive = activePillar === pillar.id;
                  return (
                    <button
                      key={pillar.id}
                      onClick={() => {
                        setActivePillar(pillar.id);
                        if (!pillar.tabs.some(t => t.id === activeTab)) {
                          setActiveTab(pillar.tabs[0].id);
                        }
                      }}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-2 text-left font-bold text-xs ${
                        isPillarActive
                          ? pillar.id === 'FOUNDER_SUITE'
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                            : 'bg-white text-slate-900 shadow-md shadow-slate-900/10'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                      }`}
                    >
                      <span className="truncate">{pillar.label}</span>
                      {pillar.badge && (
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono shrink-0 ${
                          isPillarActive 
                            ? pillar.id === 'FOUNDER_SUITE' ? 'bg-amber-600/30 text-slate-950 font-black' : 'bg-slate-100 text-slate-700'
                            : 'bg-slate-300/60 text-slate-600'
                        }`}>
                          {pillar.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Focused Sub-Tabs Row (Only 3-4 Clean Buttons Max!) */}
              <div className="flex flex-wrap items-center gap-1.5 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs animate-fadeIn">
                {activePillarTabs.map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shrink-0 cursor-pointer border ${
                        isActive
                          ? activePillar === 'FOUNDER_SUITE'
                            ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md shadow-amber-500/20'
                            : 'bg-[#0056b3] text-white border-[#0056b3] shadow-md shadow-blue-500/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-[#0056b3] hover:bg-slate-50'
                      }`}
                    >
                      <TabIcon className={`w-3.5 h-3.5 ${isActive ? (activePillar === 'FOUNDER_SUITE' ? 'text-slate-950' : 'text-white') : 'text-slate-400'}`} />
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
            </div>

            {/* Content Area Rendering */}
            <div className="animate-in fade-in duration-200">
              <ErrorBoundary>
                {activeTab === 'summary' && (
                  viewMode === 'merchant' ? (
                    <MerchantTripleImpactDossier
                      diagnostic={diagnostic}
                      onOpenPricing={() => setIsPricingModalOpen(true)}
                      onOpenWhatsAppLead={() => setIsWhatsAppModalOpen(true)}
                      onOpenMetaAutoKill={() => setIsMetaAutoKillModalOpen(true)}
                      onSwitchToWarRoom={() => {
                        setViewMode('war_room');
                        setActiveTab('tree_of_thought');
                      }}
                    />
                  ) : (
                    <ExecutiveSummary
                      diagnostic={diagnostic}
                      onSelectAgentTab={(tab) => setActiveTab(tab)}
                    />
                  )
                )}

                {/* Lazy Loaded Analytical Tabs with Skeleton Fallback */}
                <Suspense fallback={<TabLoadingSkeleton />}>
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

                {activeTab === 'tree_of_thought' && diagnostic && (
                  <TreeOfThoughtDebateView diagnostic={diagnostic} />
                )}

                {activeTab === 'vector_radar' && diagnostic && (
                  <VectorMemoryCompetitorRadarView diagnostic={diagnostic} />
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

                {activeTab === 'truth_auditor' && diagnostic && (
                  <DualAgentConsensusTribunalView diagnostic={diagnostic} />
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

                {activeTab === 'supply_chain_discrepancy' && diagnostic && (
                  <SupplyChainDiscrepancyView diagnostic={diagnostic} />
                )}

                {activeTab === 'pricing' && (
                  <PricingElasticitySimulatorView diagnostic={diagnostic} />
                )}

                {activeTab === 'omnichannel_social' && diagnostic && (
                  <OmnichannelSocialCommerceView diagnostic={diagnostic} />
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

      {/* Lazy Loaded Operational Modals */}
      <Suspense fallback={null}>
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
        <TransparentCheckoutModal onClose={() => setIsPricingModalOpen(false)} />
      )}

      {isMetaAutoKillModalOpen && diagnostic && (
        <MetaAdsAutoKillSwitchModal
          diagnostic={diagnostic}
          onClose={() => setIsMetaAutoKillModalOpen(false)}
        />
      )}

      {isBatchAuditorOpen && (
        <BatchProspectingAuditorModal
          onClose={() => setIsBatchAuditorOpen(false)}
          onOpenStoreDossier={(domain) => {
            setIsBatchAuditorOpen(false);
            const { cleanUrl, brandName } = extractCleanDomainAndBrand(domain);
            handleStartRealAudit({
              siteUrl: cleanUrl,
              businessName: brandName,
              businessType: 'ecommerce',
              niche: cleanUrl.includes('agro') ? 'Agropecuária & Moda Campo' : 'Moda & Varejo E-commerce',
              monthlyRevenue: 'R$ 50k a R$ 200k',
              averageOrderValue: 180,
              mainChallenge: 'low_conversion',
              targetRegion: 'Brasil',
              grossMargin: 45,
              competitorsUrl: 'https://concorrente.com.br'
            });
          }}
        />
      )}

      {isChromeExtensionOpen && (
        <ChromeExtensionModal
          onClose={() => setIsChromeExtensionOpen(false)}
        />
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

      <MitigationHistoryDrawer
        isOpen={isMitigationHistoryOpen}
        onClose={() => setIsMitigationHistoryOpen(false)}
      />

      <FloatingAiChatWidget />
      </Suspense>

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
