import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from '../components/Header';
import { HeroUrlBar } from '../components/HeroUrlBar';
import { ExecutiveSummary } from '../components/ExecutiveSummary';
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
import { LeadGateModal } from '../components/LeadGateModal';
import { AdminLeadsDashboard } from '../components/AdminLeadsDashboard';
import { PricingModal } from '../components/PricingModal';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CookieBanner } from '../components/CookieBanner';
import { LegalModal } from '../components/LegalModal';
import { runAgentDiagnosticAsync } from '../services/agentEngine';
import { extractCleanDomainAndBrand } from '../services/siteInspector';
import { AuditInput, AgentDiagnosticResult } from '../types';
import { LayoutDashboard, ShoppingCart, Target, Calculator, ShieldCheck, Sword, KanbanSquare } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [diagnostic, setDiagnostic] = useState<AgentDiagnosticResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState<boolean>(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(false);

  useEffect(() => {
    // Carrega o relatório da memória (mock do DB)
    const saved = localStorage.getItem('latestAudit');
    if (saved) {
      setDiagnostic(JSON.parse(saved));
    } else {
      // Se não tiver, redireciona para o dashboard
      navigate('/dashboard');
    }
  }, [navigate]);
  const allTabs = [
    { id: 'summary', label: 'Visão Executiva', icon: LayoutDashboard },
    { id: 'competitor', label: 'Espião', icon: Sword },
    { id: 'kanban', label: 'Plano de Ação', icon: KanbanSquare },
    { id: 'code_security', label: 'Código & Segurança', icon: ShieldCheck, badge: diagnostic?.cro.findings.length, advanced: true },
    { id: 'cro_copy', label: 'CRO & Ofertas', icon: ShoppingCart, advanced: true },
    { id: 'social_pm', label: 'Social & Estratégia', icon: Target, advanced: true },
    { id: 'tools', label: 'Simulador & War Room', icon: Calculator, highlight: true }
  ];

  const tabs = isAdvancedMode ? allTabs : allTabs.filter(t => !t.advanced);

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased pb-20">
      
      {/* Sticky Header Actions */}
      <Header 
        diagnostic={diagnostic} 
        onOpenAuditModal={() => {}} 
        onExportReport={() => setIsExportModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAdmin={() => setIsAdminDashboardOpen(true)}
        onOpenPricing={() => {}}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        
        {diagnostic ? (
          <div className="space-y-6">
            
            {/* Clean Tab Navigation */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none bg-white p-2 rounded-2xl shadow-xs">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer border ${
                      isActive
                        ? tab.highlight
                          ? 'bg-[#0056b3] text-white border-[#0056b3] shadow-md shadow-blue-500/20'
                          : 'bg-[#0056b3] text-white border-[#0056b3] shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-[#0056b3]'
                    }`}
                  >
                    <TabIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
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

                {activeTab === 'competitor' && (
                  <CompetitorAgentView diagnostic={diagnostic} />
                )}

                {activeTab === 'kanban' && (
                  <ActionPlanKanban diagnostic={diagnostic} />
                )}

                {activeTab === 'code_security' && (
                  <div className="space-y-6">
                    <BlindspotAuditView diagnostic={diagnostic} />
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

      {/* Footer Legal */}
      <footer className="max-w-7xl mx-auto py-8 px-4 border-t border-slate-200 mt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© {new Date().getFullYear()} LeakFinder. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <button onClick={() => navigate('/privacy')} className="hover:text-slate-900 transition-colors">Política de Privacidade</button>
          <button onClick={() => navigate('/terms')} className="hover:text-slate-900 transition-colors">Termos de Uso</button>
        </div>
      </footer>

      <CookieBanner />
    </div>
  );
}
