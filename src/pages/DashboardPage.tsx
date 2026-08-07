import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { HeroUrlBar } from '../components/HeroUrlBar';
import { AnalysisLoadingState } from '../components/AnalysisLoadingState';
import { useAuth } from '../contexts/AuthContext';
import { runAgentDiagnosticAsync } from '../services/agentEngine';
import { extractCleanDomainAndBrand } from '../services/siteInspector';
import { AuditInput } from '../types';
import { LayoutDashboard, LogOut, Plus } from 'lucide-react';

export function DashboardPage() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingUrl, setAnalyzingUrl] = useState('');

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
      
      // TODO: Save to Supabase 'audits' table here before navigating
      // For now, pass state via react-router (in memory) or localStorage
      localStorage.setItem('latestAudit', JSON.stringify(result));
      navigate(`/report/${Date.now()}`);
      
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
            <p className="text-slate-500">Histórico de auditorias realizadas</p>
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
          {/* Empty state for now since we don't fetch from DB yet */}
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
            <LayoutDashboard className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700">Nenhum relatório gerado</h3>
            <p className="text-slate-500 mt-1">Cole a URL do seu site acima para começar a primeira auditoria profunda.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
