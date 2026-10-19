import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { HeroUrlBar } from '../components/HeroUrlBar';
import { AnalysisLoadingState } from '../components/AnalysisLoadingState';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { runAgentDiagnosticAsync } from '../services/agentEngine';
import { extractCleanDomainAndBrand } from '../services/siteInspector';
import { AuditInput } from '../types';
import { 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  ChevronRight, 
  Calendar, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Sparkles,
  Layers,
  Store,
  Crown
} from 'lucide-react';
import { PdfExportService } from '../services/export/pdfExportService';
import { getActiveLicense, SAAS_PLANS } from '../services/billing/checkoutService';

// ⚡ Lazy Loaded Sub-Views & Modals
const SubscriberPortalHub = lazy(() => import('../components/dashboard/SubscriberPortalHub').then(m => ({ default: m.SubscriberPortalHub })));
const SubscriberOnboardingModal = lazy(() => import('../components/onboarding/SubscriberOnboardingModal').then(m => ({ default: m.SubscriberOnboardingModal })));
const MonitoredStoresManagerModal = lazy(() => import('../components/MonitoredStoresManagerModal').then(m => ({ default: m.MonitoredStoresManagerModal })));
const WhatsAppWatchdogSettingsModal = lazy(() => import('../components/WhatsAppWatchdogSettingsModal').then(m => ({ default: m.WhatsAppWatchdogSettingsModal })));

export function DashboardPage() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Active license in browser session
  const [activeLicense, setActiveLicense] = useState(getActiveLicense());

  // Dashboard Tabs: 'SUBSCRIBER_HUB' (Default) | 'CLOUD_AUDITS'
  const [activeTab, setActiveTab] = useState<'SUBSCRIBER_HUB' | 'CLOUD_AUDITS'>('SUBSCRIBER_HUB');

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isStoreManagerOpen, setIsStoreManagerOpen] = useState(false);
  const [isWatchdogModalOpen, setIsWatchdogModalOpen] = useState(false);

  // Audits state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingUrl, setAnalyzingUrl] = useState('');
  const [audits, setAudits] = useState<any[]>([]);
  const [isFetchingAudits, setIsFetchingAudits] = useState(true);
  const [downloadingAuditId, setDownloadingAuditId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  // Check URL params for onboarding trigger
  useEffect(() => {
    const license = getActiveLicense();
    setActiveLicense(license);

    if (searchParams.get('onboarding') === 'true') {
      setIsOnboardingOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      fetchAudits();
    } else {
      setIsFetchingAudits(false);
    }
  }, [user]);

  const fetchAudits = async () => {
    setIsFetchingAudits(true);
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching audits:', error);
      } else {
        setAudits(data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingAudits(false);
    }
  };

  // If loading authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E100F] text-[#FFFCE1] flex items-center justify-center font-mono text-sm">
        Carregando painel AdShield...
      </div>
    );
  }

  // Allow access if user is logged in OR has an active license stored
  if (!user && !activeLicense) {
    return <Navigate to="/login" replace />;
  }

  const handleStartAudit = async (input: AuditInput) => {
    setIsAnalyzing(true);
    setAnalyzingUrl(input.siteUrl);
    
    try {
      const { cleanUrl, brandName } = extractCleanDomainAndBrand(input.siteUrl);
      const cleanInput = { ...input, siteUrl: cleanUrl, businessName: brandName };
      
      const result = await runAgentDiagnosticAsync(cleanInput);
      
      if (user) {
        const { data, error } = await supabase
          .from('audits')
          .insert({
            user_id: user.id,
            site_url: cleanUrl,
            business_name: brandName,
            result_data: result
          })
          .select('id')
          .single();

        if (!error && data) {
          navigate(`/report/${data.id}`);
          return;
        }
      }
      
      try {
        localStorage.setItem('latestAudit', JSON.stringify(result));
      } catch (storageErr) {
        console.warn('[DashboardPage] Non-fatal localStorage quota warning:', storageErr);
      }
      navigate(`/report/fallback-${Date.now()}`);
      
    } catch (e) {
      console.error(e);
      alert("Falha ao analisar o site. Tente novamente.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownloadPdf = async (audit: any) => {
    if (!audit?.result_data) return;
    setDownloadingAuditId(audit.id);
    try {
      const diagnosticData = typeof audit.result_data === 'string'
        ? JSON.parse(audit.result_data)
        : audit.result_data;

      await PdfExportService.downloadExecutivePdf(diagnosticData);
      setDownloadSuccessId(audit.id);
      setTimeout(() => setDownloadSuccessId(null), 3000);
    } catch (err) {
      console.error('Falha ao exportar PDF:', err);
      alert('Falha ao exportar o PDF. Tente novamente.');
    } finally {
      setDownloadingAuditId(null);
    }
  };

  const currentPlan = activeLicense?.planId 
    ? SAAS_PLANS[activeLicense.planId] 
    : SAAS_PLANS.GROWTH_PRO;

  return (
    <div className="min-h-screen bg-[#0E100F] font-sans text-[#FFFCE1] flex flex-col selection:bg-[#0AE448] selection:text-slate-950">
      
      {/* Top Header */}
      <header className="bg-[#101211]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-[#0AE448] rounded-xl flex items-center justify-center text-slate-950 font-black shadow-md shadow-[#0AE448]/20">
              <span className="leading-none text-sm">AS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-[#FFFCE1]">AdShield<span className="text-[#0AE448]">.ai</span></span>
              <span className="px-2 py-0.5 bg-[#0AE448]/10 text-[#0AE448] text-[10px] font-mono font-bold rounded-full border border-[#0AE448]/30 hidden sm:inline">
                PORTAL DO ASSINANTE
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#BBBAA6] font-mono hidden sm:inline">
              {user?.email || activeLicense?.customerEmail || 'Assinante Ativo'}
            </span>

            {user ? (
              <button 
                onClick={signOut}
                className="p-2 text-[#BBBAA6] hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                title="Sair da Conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-[#FFFCE1] rounded-xl border border-white/10 transition-colors"
              >
                Entrar com Senha
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 w-full py-8 space-y-6">

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-[#141716] p-1.5 rounded-2xl border border-white/10">
            <button
              onClick={() => setActiveTab('SUBSCRIBER_HUB')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'SUBSCRIBER_HUB'
                  ? 'bg-[#0AE448] text-slate-950 font-black shadow-lg shadow-[#0AE448]/20'
                  : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Torre de Proteção 24/7</span>
            </button>

            <button
              onClick={() => setActiveTab('CLOUD_AUDITS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'CLOUD_AUDITS'
                  ? 'bg-[#0AE448] text-slate-950 font-black shadow-lg shadow-[#0AE448]/20'
                  : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dossiês & Varreduras Salvas ({audits.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-xs font-bold text-[#FFFCE1] rounded-xl border border-white/10 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0AE448]" />
              <span>Assistente de Ativação</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SUBSCRIBER HUB */}
        {activeTab === 'SUBSCRIBER_HUB' && (
          <Suspense fallback={<div className="p-12 text-center text-xs text-[#BBBAA6] font-mono">Carregando Torre de Proteção...</div>}>
            <SubscriberPortalHub
              onOpenStoreAudit={(url) => navigate(`/?loja=${encodeURIComponent(url)}`)}
              onOpenNewStoreModal={() => setIsStoreManagerOpen(true)}
              onOpenWhatsAppWatchdog={() => setIsWatchdogModalOpen(true)}
              onOpenKillSwitch={() => navigate('/?tab=ads')}
              onOpenAgencyHub={() => navigate('/?tab=prospecting')}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
            />
          </Suspense>
        )}

        {/* TAB 2: CLOUD AUDITS & INSTANT SCAN */}
        {activeTab === 'CLOUD_AUDITS' && (
          <div className="space-y-8 animate-fadeIn">
            {isAnalyzing ? (
              <div className="mb-8">
                <AnalysisLoadingState
                  siteUrl={analyzingUrl || 'seu site'}
                  onComplete={() => {}}
                />
              </div>
            ) : (
              <div className="p-6 bg-[#141716] rounded-3xl border border-white/10 space-y-4">
                <h2 className="text-xs font-mono font-bold text-[#BBBAA6] uppercase tracking-wider flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#0AE448]" />
                  <span>Disparar Nova Varredura Instantânea</span>
                </h2>
                <HeroUrlBar
                  onAnalyze={handleStartAudit}
                  isAnalyzing={isAnalyzing}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isFetchingAudits ? (
                <div className="col-span-full py-12 text-center text-xs text-[#BBBAA6] font-mono">
                  Carregando seus relatórios salvos...
                </div>
              ) : audits.length === 0 ? (
                <div className="col-span-full py-16 text-center bg-[#101211] rounded-3xl border border-dashed border-white/20 p-8 space-y-3">
                  <LayoutDashboard className="w-12 h-12 text-[#BBBAA6]/40 mx-auto" />
                  <h3 className="text-base font-bold text-[#FFFCE1]">Nenhum relatório salvo ainda</h3>
                  <p className="text-xs text-[#BBBAA6] max-w-md mx-auto">
                    Cole a URL da loja no campo acima para disparar o enxame autônomo e salvar sua primeira auditoria.
                  </p>
                </div>
              ) : (
                audits.map((audit) => {
                  const resData = typeof audit.result_data === 'string'
                    ? (() => { try { return JSON.parse(audit.result_data); } catch { return null; } })()
                    : audit.result_data;
                  const score = resData?.growthScore;

                  return (
                    <div 
                      key={audit.id} 
                      onClick={() => navigate(`/report/${audit.id}`)}
                      className="bg-[#101211] border border-white/10 rounded-3xl p-6 hover:shadow-2xl hover:border-[#0AE448]/40 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="text-base font-bold text-[#FFFCE1] group-hover:text-[#0AE448] transition-colors line-clamp-1">{audit.business_name}</h3>
                          {score !== undefined && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 text-xs font-black font-mono">
                              {score}/100
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#BBBAA6] font-mono mb-4 truncate">{audit.site_url}</p>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-white/10 gap-2">
                        <div className="flex items-center gap-1.5 text-xs text-[#BBBAA6] font-mono">
                          <Calendar className="w-3.5 h-3.5 text-[#BBBAA6]/60" />
                          {new Date(audit.created_at).toLocaleDateString()}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPdf(audit);
                            }}
                            disabled={downloadingAuditId === audit.id}
                            className="px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title="Baixar Dossiê Executivo em PDF com 1 clique"
                          >
                            {downloadingAuditId === audit.id ? (
                              <>
                                <div className="w-3 h-3 border-2 border-[#0AE448] border-t-transparent rounded-full animate-spin" />
                                <span className="text-[11px] font-mono">Baixando...</span>
                              </>
                            ) : downloadSuccessId === audit.id ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" />
                                <span className="text-[#0AE448] text-[11px]">Baixado!</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5 text-[#0AE448]" />
                                <span className="text-[11px]">PDF</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center text-xs font-bold text-[#0AE448] group-hover:translate-x-1 transition-transform">
                            <span>Ver</span>
                            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

      </main>

      {/* Global Modals for Dashboard Operations */}
      <Suspense fallback={null}>
        {isOnboardingOpen && (
          <SubscriberOnboardingModal
            isOpen={isOnboardingOpen}
            onClose={() => setIsOnboardingOpen(false)}
            plan={currentPlan}
            onComplete={() => {
              setIsOnboardingOpen(false);
              setActiveLicense(getActiveLicense());
            }}
          />
        )}

        {isStoreManagerOpen && (
          <MonitoredStoresManagerModal
            isOpen={isStoreManagerOpen}
            onClose={() => setIsStoreManagerOpen(false)}
            onSelectStoreToAudit={(url) => navigate(`/?loja=${encodeURIComponent(url)}`)}
          />
        )}

        {isWatchdogModalOpen && (
          <WhatsAppWatchdogSettingsModal
            isOpen={isWatchdogModalOpen}
            onClose={() => setIsWatchdogModalOpen(false)}
          />
        )}
      </Suspense>

    </div>
  );
}
