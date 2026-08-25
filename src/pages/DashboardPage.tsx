import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { HeroUrlBar } from '../components/HeroUrlBar';
import { AnalysisLoadingState } from '../components/AnalysisLoadingState';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { runAgentDiagnosticAsync } from '../services/agentEngine';
import { extractCleanDomainAndBrand } from '../services/siteInspector';
import { AuditInput } from '../types';
import { LayoutDashboard, LogOut, Plus, ChevronRight, Calendar } from 'lucide-react';

export function DashboardPage() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingUrl, setAnalyzingUrl] = useState('');
  
  // Audits state
  const [audits, setAudits] = useState<any[]>([]);
  const [isFetchingAudits, setIsFetchingAudits] = useState(true);

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

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
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

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">L</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">LeakFinder</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">{user.email}</span>
            <button 
              onClick={signOut}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 w-full py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Meus Relatórios</h1>
            <p className="text-slate-500">Histórico de auditorias realizadas na nuvem</p>
          </div>
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
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-500" />
              Nova Auditoria
            </h2>
            <HeroUrlBar
              onAnalyze={handleStartAudit}
              isAnalyzing={isAnalyzing}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isFetchingAudits ? (
             <div className="col-span-full py-12 text-center text-slate-500">Carregando seus relatórios...</div>
          ) : audits.length === 0 ? (
            <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <LayoutDashboard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700">Nenhum relatório gerado</h3>
              <p className="text-slate-500 mt-1">Cole a URL do seu site acima para começar a primeira auditoria profunda.</p>
            </div>
          ) : (
            audits.map((audit) => (
              <div 
                key={audit.id} 
                onClick={() => navigate(`/report/${audit.id}`)}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1">{audit.business_name}</h3>
                  <p className="text-sm text-slate-500 mb-4 truncate">{audit.site_url}</p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(audit.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                    Ver <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
