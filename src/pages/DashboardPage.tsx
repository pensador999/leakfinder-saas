import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { HeroUrlBar } from '../components/HeroUrlBar';
import { AnalysisLoadingState } from '../components/AnalysisLoadingState';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { runAgentDiagnosticAsync } from '../services/agentEngine';
import { extractCleanDomainAndBrand } from '../services/siteInspector';
import { AuditInput } from '../types';
import { LayoutDashboard, LogOut, Plus, ChevronRight, Calendar, Download, CheckCircle2 } from 'lucide-react';
import { PdfExportService } from '../services/export/pdfExportService';

export function DashboardPage() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingUrl, setAnalyzingUrl] = useState('');
  
  // Audits state
  const [audits, setAudits] = useState<any[]>([]);
  const [isFetchingAudits, setIsFetchingAudits] = useState(true);
  const [downloadingAuditId, setDownloadingAuditId] = useState<string | null>(null);
  const [downloadSuccessId, setDownloadSuccessId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchAudits();
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

  if (isLoading) return <div className="min-h-screen bg-[#0E100F] text-[#FFFCE1] flex items-center justify-center font-mono text-sm">Carregando painel AdShield...</div>;
  if (!user) return <Navigate to="/login" replace />;

  const handleStartAudit = async (input: AuditInput) => {
    setIsAnalyzing(true);
    setAnalyzingUrl(input.siteUrl);
    
    try {
      const { cleanUrl, brandName } = extractCleanDomainAndBrand(input.siteUrl);
      const cleanInput = { ...input, siteUrl: cleanUrl, businessName: brandName };
      
      // Call engine
      const result = await runAgentDiagnosticAsync(cleanInput);
      
      // Save to Supabase 'audits' table
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

      if (error) {
        console.error("Falha ao salvar auditoria no supabase:", error);
        alert("A auditoria terminou, mas falhou ao salvar na nuvem.");
        // Fallback
        localStorage.setItem('latestAudit', JSON.stringify(result));
        navigate(`/report/fallback-${Date.now()}`);
      } else {
        navigate(`/report/${data.id}`);
      }
      
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

  return (
    <div className="min-h-screen bg-[#0E100F] font-sans text-[#FFFCE1] flex flex-col selection:bg-[#0AE448] selection:text-slate-950">
      <header className="bg-[#101211]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-[#0AE448] rounded-xl flex items-center justify-center text-slate-950 font-black shadow-md shadow-[#0AE448]/20">
              <span className="leading-none text-sm">AS</span>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-[#FFFCE1]">AdShield<span className="text-[#0AE448]">.ai</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#BBBAA6] font-mono hidden sm:inline">{user.email}</span>
            <button 
              onClick={signOut}
              className="p-2 text-[#BBBAA6] hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
              title="Sair da Conta"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 w-full py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#FFFCE1] tracking-tight">Meus Relatórios de Auditoria</h1>
            <p className="text-xs text-[#BBBAA6] font-mono mt-0.5">Histórico de inteligência e varreduras salvas na nuvem</p>
          </div>

          {audits.length > 0 && (
            <button
              onClick={() => handleDownloadPdf(audits[0])}
              disabled={Boolean(downloadingAuditId)}
              className="px-4 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#0AE448]/20 cursor-pointer disabled:opacity-50"
              title="Baixar PDF da auditoria mais recente com 1 clique"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Último Dossiê (PDF)</span>
            </button>
          )}
        </div>

        {isAnalyzing ? (
          <div className="mb-8">
            <AnalysisLoadingState
              siteUrl={analyzingUrl || 'seu site'}
              onComplete={() => {}}
            />
          </div>
        ) : (
          <div className="mb-12">
            <h2 className="text-xs font-mono font-bold text-[#BBBAA6] uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#0AE448]" />
              Iniciar Nova Auditoria Profunda
            </h2>
            <HeroUrlBar
              onAnalyze={handleStartAudit}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isFetchingAudits ? (
             <div className="col-span-full py-12 text-center text-xs text-[#BBBAA6] font-mono">Carregando seus relatórios salvos...</div>
          ) : audits.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-[#101211] rounded-3xl border border-dashed border-white/20 p-8 space-y-3">
              <LayoutDashboard className="w-12 h-12 text-[#BBBAA6]/40 mx-auto" />
              <h3 className="text-base font-bold text-[#FFFCE1]">Nenhum relatório gerado ainda</h3>
              <p className="text-xs text-[#BBBAA6] max-w-md mx-auto">Cole a URL da loja no campo acima para disparar o enxame autônomo e salvar sua primeira auditoria.</p>
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
      </main>
    </div>
  );
}
