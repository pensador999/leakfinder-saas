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
  Globe, GitCompare, Zap, Lock, Unlock, GitFork, Database, BadgeCheck, Share2, Factory,
  ChevronDown, Sparkles
} from 'lucide-react';
import { SimplifiedPillarNav, MainNavPillar } from '../components/navigation/SimplifiedPillarNav';

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
// 🔀 CompetitorAgentView substituído por VectorMemoryCompetitorRadarView (Fase 2 Verticalização)
// const CompetitorAgentView = lazy(() => import('../components/agents/CompetitorAgentView').then(m => ({ default: m.CompetitorAgentView })));
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

export type ActiveModalId =
  | 'audit'
  | 'export'
  | 'settings'
  | 'adminDashboard'
  | 'pricing'
  | 'whatsappLead'
  | 'leadsDrawer'
  | 'storesManager'
  | 'whatsappWatchdog'
  | 'integrations'
  | 'whiteLabel'
  | 'metaAutoKill'
  | 'batchAuditor'
  | 'chromeExtension'
  | 'mitigationHistory'
  | 'founderAuth'
  | null;

export function HomePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [diagnostic, setDiagnostic] = useState<AgentDiagnosticResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [activeModal, setActiveModal] = useState<ActiveModalId>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingUrl, setAnalyzingUrl] = useState<string>('');
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [isPublicDossierMode, setIsPublicDossierMode] = useState<boolean>(false);
  const [isToolsMenuOpen, setIsToolsMenuOpen] = useState<boolean>(false);

  // 🔒 Master Founder Confidential Auth State
  const [isFounderAuthenticated, setIsFounderAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('adshield_founder_authenticated') === 'true';
  });

  // Auto trigger founder auth modal if URL param exists
  useEffect(() => {
    if (searchParams.get('founder') === 'true' || searchParams.get('mode') === 'founder' || window.location.hash.includes('founder')) {
      if (!isFounderAuthenticated) {
        setActiveModal('founderAuth');
      }
    }
  }, [searchParams, isFounderAuthenticated]);

  // 🔗 Deep Linking para Modais via URL (?modal=pricing, ?modal=audit, etc.)
  useEffect(() => {
    const modalParam = searchParams.get('modal') as ActiveModalId;
    const validModals: ActiveModalId[] = [
      'audit', 'export', 'settings', 'adminDashboard', 'pricing',
      'whatsappLead', 'leadsDrawer', 'storesManager', 'whatsappWatchdog',
      'integrations', 'whiteLabel', 'metaAutoKill', 'batchAuditor',
      'chromeExtension', 'mitigationHistory', 'founderAuth'
    ];
    if (modalParam && validModals.includes(modalParam)) {
      setActiveModal(modalParam);
    }
  }, [searchParams]);

  // ⌨️ Acessibilidade & Ergonomia: Fecha modal ao pressionar ESC e bloqueia scroll de fundo
  useEffect(() => {
    if (!activeModal) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModal(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeModal]);

  // Initial load: dynamically check if a specific store was requested via query param
  useEffect(() => {
    const targetQueryUrl = searchParams.get('loja') || searchParams.get('url') || searchParams.get('dossier') || searchParams.get('store');
    
    if (targetQueryUrl) {
      setIsPublicDossierMode(true);
      const storeToScan = targetQueryUrl.startsWith('http') ? targetQueryUrl : `https://${targetQueryUrl}`;
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
    }
  }, [searchParams]);

  const handleStartRealAudit = async (input: AuditInput) => {
    setActiveModal(null);
    setIsAnalyzing(true);
    setAnalyzingUrl(input.siteUrl);
    setAuditError(null);

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

      const isMkt = result.realSiteData.isMarketplaceSeller || detectMarketplace(result.realSiteData.url, result.realSiteData.domain).isMarketplace;
      setActiveTab(isMkt ? 'marketplace' : 'summary');

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
      setAuditError('Não foi possível auditar esta loja. Verifique a URL e tente novamente.');
    }
  };

  const [viewMode, setViewMode] = useState<'merchant' | 'war_room' | 'lead_demo'>('merchant');

  const totalCatalogAlerts = ((diagnostic?.realSiteData.catalogAudit?.productsWithBrokenGrid || 0) + 
                             (diagnostic?.realSiteData.catalogAudit?.productsWithMissingImages || 0));

  const isMarketplaceStore = diagnostic 
    ? (detectMarketplace(diagnostic.realSiteData.url, diagnostic.realSiteData.domain).isMarketplace || Boolean(diagnostic.realSiteData.isMarketplaceSeller))
    : false;

  const [activePillar, setActivePillar] = useState<MainNavPillar>('PROFIT_DIAGNOSTIC');

  // Sincroniza o pilar principal de acordo com a aba ativa selecionada
  useEffect(() => {
    if (['scripts', 'kanban'].includes(activeTab)) {
      setActivePillar('ACTIONS_SHIELD');
    } else if (['sku_crossing', 'niche_recognition', 'catalog', 'rupture_monitor', 'supply_chain_discrepancy'].includes(activeTab)) {
      setActivePillar('CATALOG_STOCK');
    } else if (['summary', 'pricing', 'marketplace', 'collection_audit', 'omnichannel_social', 'trust_badge'].includes(activeTab)) {
      setActivePillar('PROFIT_DIAGNOSTIC');
    } else {
      setActivePillar('SWARM_LAB');
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#0E100F] obsidian-grid-pattern text-[#F0EFE6] font-sans antialiased pb-24">
      
      {/* Sticky Header */}
      <Header 
        diagnostic={diagnostic} 
        onOpenAuditModal={() => setActiveModal('audit')} 
        onExportReport={() => setActiveModal('export')}
        onOpenSettings={() => setActiveModal('settings')}
        onOpenAdmin={() => setActiveModal('leadsDrawer')}
        onOpenPricing={() => setActiveModal('pricing')}
        onOpenWhatsAppLeadModal={() => setActiveModal('whatsappLead')}
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
        onOpenMitigationHistory={() => setActiveModal('mitigationHistory')}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        
        {/* Prominent Link Input Inspector Hero */}
        <HeroUrlBar
          onAnalyze={handleStartRealAudit}
          isAnalyzing={isAnalyzing}
          currentUrl={diagnostic?.input.siteUrl}
        />

        {auditError && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm font-medium text-center">
            {auditError}
          </div>
        )}

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
              onOpenPricing={() => setActiveModal('pricing')}
              onOpenWhatsApp={() => setActiveModal('whatsappLead')}
            />

            {/* 🎛️ EXECUTIVE CONTROL & MODE CENTER (PROGRESSIVE DISCLOSURE) */}
            <div className="p-2.5 bg-[#141716] rounded-2xl border border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-3 relative z-30">
              
              {/* Left: Modern Segmented Mode Switcher */}
              <div className="flex items-center bg-[#101211] p-1 rounded-xl border border-white/10 text-xs font-bold font-mono">
                <button
                  onClick={() => {
                    setViewMode('merchant');
                    if (['orchestrator', 'scraper_dossier', 'truth_auditor', 'swarm_control', 'vitals', 'vision', 'telemetry', 'competitor', 'kanban'].includes(activeTab)) {
                      setActiveTab('summary');
                    }
                  }}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'merchant'
                      ? 'bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/40 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-[#0AE448]" />
                  <span>Visão Lojista (Lucro)</span>
                </button>

                <button
                  onClick={() => setViewMode('war_room')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'war_room'
                      ? 'bg-white/15 text-[#FFFCE1] border border-white/25 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-[#00BAE2]" />
                  <span>War Room Técnico</span>
                </button>
              </div>

              {/* Right: Clean Action Cluster */}
              <div className="flex items-center gap-2 flex-wrap">
                
                {/* 🎯 Lead Sniper B2B (Meta Ads & WhatsApp Closer) */}
                <button
                  onClick={() => {
                    setActivePillar('SWARM_LAB');
                    setActiveTab('market_hunter');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#101211] hover:bg-[#141716] text-[#00BAE2] border border-[#00BAE2]/30 hover:border-[#00BAE2]/60 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title="Abrir Motor de Prospecção Outbound B2B e Lead Sniper"
                >
                  <Target className="w-3.5 h-3.5 text-[#00BAE2]" />
                  <span>Lead Sniper B2B</span>
                </button>

                {/* 📲 Vigia WhatsApp 24/7 (High Priority Status Button) */}
                <button
                  onClick={() => setActiveModal('whatsappWatchdog')}
                  className="px-3 py-1.5 rounded-xl bg-[#101211] hover:bg-[#141716] text-[#0AE448] border border-[#0AE448]/30 hover:border-[#0AE448]/60 text-xs font-bold flex items-center gap-2 transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title="Configurar entrega diária dos relatórios executivos no WhatsApp"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0AE448] animate-pulse inline-block shadow-[0_0_8px_#0AE448]" />
                  <span>Vigia WhatsApp (07:00)</span>
                </button>

                {/* 🔌 Conectar Loja (1-Click) */}
                <button
                  onClick={() => setActiveModal('integrations')}
                  className="px-3.5 py-1.5 rounded-xl bg-[#101211] hover:bg-[#191C1B] text-[#FFFCE1] border border-white/10 hover:border-white/20 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  title="Conectar Shopify, Mercado Livre ou VTEX"
                >
                  <Plug className="w-3.5 h-3.5 text-[#0AE448]" />
                  <span>Conectar Loja</span>
                </button>

                {/* ⚡ Dropdown de Ferramentas & Dossiês */}
                <div className="relative">
                  <button
                    onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                      isToolsMenuOpen 
                        ? 'bg-[#191C1B] border-[#0AE448]/50 text-[#0AE448]' 
                        : 'bg-[#101211] hover:bg-[#141716] border-white/10 text-[#BBBAA6] hover:text-[#FFFCE1]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-[#00BAE2]" />
                    <span>Ferramentas & Dossiês</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-[#7C7C6F] transition-transform ${isToolsMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Popover Menu */}
                  {isToolsMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-[#141716] rounded-2xl border border-white/10 shadow-2xl p-1.5 z-50 animate-fadeIn space-y-0.5 font-sans backdrop-blur-md">
                      <button
                        onClick={() => { 
                          setActivePillar('SWARM_LAB');
                          setActiveTab('market_hunter'); 
                          setIsToolsMenuOpen(false); 
                        }}
                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-white/5 text-xs font-semibold text-[#00BAE2] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Target className="w-4 h-4 text-[#00BAE2] shrink-0" />
                        <div>
                          <span className="block text-[#FFFCE1] font-bold">Lead Sniper (Prospecção)</span>
                          <span className="text-[10px] text-[#7C7C6F] font-normal">Buscar lojas no Meta Ads com estoque furado</span>
                        </div>
                      </button>

                      <button
                        onClick={() => { 
                          setActiveModal('metaAutoKill'); 
                          setIsToolsMenuOpen(false); 
                        }}
                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-white/5 text-xs font-semibold text-rose-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Zap className="w-4 h-4 text-rose-400 shrink-0" />
                        <div>
                          <span className="block text-[#FFFCE1] font-bold">Kill-Switch Meta Ads</span>
                          <span className="text-[10px] text-[#7C7C6F] font-normal">Pausar campanhas em &lt;60s ao esgotar</span>
                        </div>
                      </button>

                      <button
                        onClick={() => { setActiveModal('storesManager'); setIsToolsMenuOpen(false); }}
                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-white/5 text-xs font-semibold text-[#BBBAA6] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Store className="w-4 h-4 text-blue-400 shrink-0" />
                        <div>
                          <span className="block text-[#FFFCE1] font-bold">Lojas no Radar</span>
                          <span className="text-[10px] text-[#7C7C6F] font-normal">Monitoramento de múltiplos domínios</span>
                        </div>
                      </button>

                      <button
                        onClick={() => { setActiveModal('batchAuditor'); setIsToolsMenuOpen(false); }}
                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-white/5 text-xs font-semibold text-[#BBBAA6] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
                        <div>
                          <span className="block text-[#FFFCE1] font-bold">Scanner em Lote</span>
                          <span className="text-[10px] text-[#7C7C6F] font-normal">Auditar 20 lojas de clientes em lote</span>
                        </div>
                      </button>

                      <button
                        onClick={() => { setActiveModal('chromeExtension'); setIsToolsMenuOpen(false); }}
                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-white/5 text-xs font-semibold text-[#BBBAA6] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-[#FF8709] shrink-0" />
                        <div>
                          <span className="block text-[#FFFCE1] font-bold">Extensão Chrome</span>
                          <span className="text-[10px] text-[#7C7C6F] font-normal">Auditar com 1 clique no navegador</span>
                        </div>
                      </button>

                      <button
                        onClick={() => { setActiveModal('export'); setIsToolsMenuOpen(false); }}
                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-white/5 text-xs font-semibold text-[#BBBAA6] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <FileText className="w-4 h-4 text-[#0AE448] shrink-0" />
                        <div>
                          <span className="block text-[#FFFCE1] font-bold">Exportar Dossiê PDF</span>
                          <span className="text-[10px] text-[#7C7C6F] font-normal">Relatório executivo para reuniões</span>
                        </div>
                      </button>

                      <button
                        onClick={() => { setActiveModal('whiteLabel'); setIsToolsMenuOpen(false); }}
                        className="w-full px-3 py-2 text-left rounded-xl hover:bg-white/5 text-xs font-semibold text-[#BBBAA6] flex items-center gap-2.5 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                        <div>
                          <span className="block text-[#FFFCE1] font-bold">Personalização White-Label</span>
                          <span className="text-[10px] text-[#7C7C6F] font-normal">Logo e paleta da sua agência</span>
                        </div>
                      </button>

                      <div className="h-px bg-white/10 my-1" />

                      {/* Founder Access Section */}
                      {!isFounderAuthenticated ? (
                        <button
                          onClick={() => { setActiveModal('founderAuth'); setIsToolsMenuOpen(false); }}
                          className="w-full px-3 py-2 text-left rounded-xl hover:bg-amber-500/10 text-xs font-semibold text-amber-400 flex items-center gap-2.5 transition-colors cursor-pointer"
                        >
                          <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <span className="block text-[#FFFCE1] font-bold">Acesso do Fundador</span>
                            <span className="text-[10px] text-amber-400/80 font-normal">Painel confidencial HQ</span>
                          </div>
                        </button>
                      ) : (
                        <button
                          onClick={() => { setActiveTab('founder_hq'); setIsToolsMenuOpen(false); }}
                          className="w-full px-3 py-2 text-left rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-400 flex items-center gap-2.5 transition-colors cursor-pointer border border-amber-500/20"
                        >
                          <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <span className="block font-bold">Painel Fundador Ativo</span>
                            <span className="text-[10px] text-amber-400/80 font-normal">Abrir Torre do Fundador (HQ)</span>
                          </div>
                        </button>
                      )}
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* 🏛️ NAVEGAÇÃO PROGRESSIVA INTUITIVA (SIMPLES, RÁPIDA E COMPLETA) */}
            <SimplifiedPillarNav
              activePillar={activePillar}
              onChangePillar={setActivePillar}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              isMarketplaceStore={isMarketplaceStore}
              totalCatalogAlerts={totalCatalogAlerts}
              isFounderAuthenticated={isFounderAuthenticated}
              onOpenMetaAutoKill={() => setActiveModal('metaAutoKill')}
              onOpenWhatsAppWatchdog={() => setActiveModal('whatsappWatchdog')}
              isAdvancedMode={isAdvancedMode}
            />

            {/* BOTÃO TOGGLE MODO AVANÇADO (MVP) */}
            <div className="flex justify-center mt-2">
              <button
                onClick={() => setIsAdvancedMode(!isAdvancedMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                  isAdvancedMode 
                    ? 'bg-[#191C1B] text-[#0AE448] border border-[#0AE448]/30 hover:bg-[#202422]' 
                    : 'bg-[#141716] text-[#BBBAA6] border border-white/10 hover:text-white hover:bg-[#191C1B]'
                }`}
              >
                {isAdvancedMode ? <ChevronDown className="w-4 h-4 rotate-180 transition-transform" /> : <Sparkles className="w-4 h-4 text-[#00BAE2]" />}
                🔬 Modo Avançado (33 agentes)
              </button>
            </div>

            {/* Content Area Rendering */}
            <div className="animate-in fade-in duration-200">
              <ErrorBoundary>
                {!isAdvancedMode ? (
                  <Suspense fallback={<TabLoadingSkeleton />}>
                    {activeTab === 'summary' && (
                      <div className="space-y-6">
                        <ExecutiveSummary
                          diagnostic={diagnostic}
                          onSelectAgentTab={(tab) => setActiveTab(tab)}
                        />
                        {diagnostic && <BlindspotAuditView diagnostic={diagnostic} />}
                      </div>
                    )}
                    {activeTab === 'catalog' && diagnostic && (
                      <CollectionDeepAuditView diagnostic={diagnostic} />
                    )}
                    {activeTab === 'ads' && diagnostic && (
                      <AdsAgentView diagnostic={diagnostic} />
                    )}
                    {activeTab === 'kanban' && diagnostic && (
                      <ActionPlanKanban diagnostic={diagnostic} />
                    )}
                    {activeTab === 'calculator' && (
                      <RoasCalculator />
                    )}
                  </Suspense>
                ) : (
                  <>
                    {activeTab === 'summary' && (
                      viewMode === 'merchant' ? (
                    <MerchantTripleImpactDossier
                      diagnostic={diagnostic}
                      onOpenPricing={() => setActiveModal('pricing')}
                      onOpenWhatsAppLead={() => setActiveModal('whatsappLead')}
                      onOpenMetaAutoKill={() => setActiveModal('metaAutoKill')}
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
                  <MarketHunterAgentView diagnostic={diagnostic} />
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

                {/* 🔀 Tab 'vitals' consolidada na tab 'code_security' (SEO + Security + Core Web Vitals) */}
                {activeTab === 'vitals' && (
                  <div className="space-y-6">
                    <SeoAgentView diagnostic={diagnostic} />
                    <CoreWebVitalsAuditView diagnostic={diagnostic} />
                  </div>
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

                {activeTab === 'competitor' && diagnostic && (
                  <VectorMemoryCompetitorRadarView diagnostic={diagnostic} />
                )}

                {activeTab === 'kanban' && (
                  <ActionPlanKanban diagnostic={diagnostic} />
                )}

                {activeTab === 'code_security' && (
                  <div className="space-y-6">
                    <SecurityAgentView diagnostic={diagnostic} />
                    <SeoAgentView diagnostic={diagnostic} />
                    <CoreWebVitalsAuditView diagnostic={diagnostic} />
                  </div>
                )}

                {activeTab === 'cro_copy' && (
                  <div className="space-y-6">
                    <CroAgentView diagnostic={diagnostic} />
                    <SalesCopyAgentView diagnostic={diagnostic} />
                    <AdsAgentView diagnostic={diagnostic} />
                    <PmGrowthAgentView diagnostic={diagnostic} />
                  </div>
                )}

                {/* 🔀 PmGrowthAgentView movido para tab 'cro_copy' (consolidação de overlaps) */}
                {activeTab === 'social_pm' && (
                  <SocialAgentView diagnostic={diagnostic} />
                )}

                {activeTab === 'tools' && (
                  <div className="space-y-6">
                    <AgentChatView diagnostic={diagnostic} />
                    <RoasCalculator />
                  </div>
                )}
                </Suspense>
              </>
            )}
              </ErrorBoundary>
            </div>

          </div>
        ) : null}

      </main>

      {/* Lazy Loaded Operational Modals */}
      <Suspense fallback={null}>
        {/* Audit Modal */}
        {activeModal === 'audit' && (
          <AuditFormModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            onSubmit={handleStartRealAudit}
            initialData={diagnostic?.input}
          />
        )}

        {/* Export Report Modal (White-Label PDF) */}
        {activeModal === 'export' && diagnostic && (
          <ExecutivePdfExportModal
            diagnostic={diagnostic}
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'settings' && (
          <SettingsModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'adminDashboard' && (
          <AdminLeadsDashboard onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'pricing' && (
          <TransparentCheckoutModal onClose={() => setActiveModal(null)} />
        )}

        {activeModal === 'metaAutoKill' && diagnostic && (
          <MetaAdsAutoKillSwitchModal
            diagnostic={diagnostic}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'batchAuditor' && (
          <BatchProspectingAuditorModal
            onClose={() => setActiveModal(null)}
            onOpenStoreDossier={(domain) => {
              setActiveModal(null);
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

        {activeModal === 'chromeExtension' && (
          <ChromeExtensionModal
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'whatsappLead' && diagnostic && (
          <WhatsAppLeadCaptureModal
            diagnostic={diagnostic}
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'leadsDrawer' && (
          <AdminLeadsDrawer
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'storesManager' && (
          <MonitoredStoresManagerModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            onSelectStoreToAudit={(url) => {
              setAnalyzingUrl(url);
              setIsAnalyzing(true);
              setActiveModal(null);
            }}
          />
        )}

        {activeModal === 'whatsappWatchdog' && (
          <WhatsAppWatchdogSettingsModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'integrations' && (
          <EcommerceIntegrationsHubModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}

        {activeModal === 'whiteLabel' && diagnostic && (
          <AgencyWhiteLabelModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            diagnostic={diagnostic}
          />
        )}

        {/* 🔒 Master Founder Auth Gate */}
        {activeModal === 'founderAuth' && (
          <FounderAuthModal
            isOpen={true}
            onClose={() => setActiveModal(null)}
            onSuccess={() => {
              setIsFounderAuthenticated(true);
              setActiveModal(null);
              setActiveTab('founder_hq');
            }}
          />
        )}

        {activeModal === 'mitigationHistory' && (
          <MitigationHistoryDrawer
            isOpen={true}
            onClose={() => setActiveModal(null)}
          />
        )}

        {diagnostic && <FloatingAiChatWidget />}
      </Suspense>

      {/* Footer Legal & Institucional em Conformidade com Decreto 7.962/2013 */}
      <footer className="max-w-7xl mx-auto py-8 px-4 border-t border-white/10 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-[#7C7C6F] gap-4">
        <div>
          <p className="font-bold text-[#FFFCE1]">AdShield • BRK GROUP TECNOLOGIA LTDA</p>
          <p className="text-[11px] text-[#7C7C6F] font-mono">CNPJ: 52.894.218/0001-90 • Auditoria 360º sob Marco Civil e LGPD.</p>
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
