import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Zap, Target, Search } from 'lucide-react';
import { Header } from '../components/Header';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Header 
        diagnostic={null}
        onOpenAuditModal={() => {}}
        onExportReport={() => {}} 
        onOpenSettings={() => {}} 
        onOpenAdmin={() => {}} 
        onOpenPricing={() => navigate('/register')} 
      />
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-4">
            <Zap className="w-4 h-4" /> LeakFinder SaaS 2.0
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Descubra onde seu e-commerce está <span className="text-blue-600">vazando dinheiro</span>.
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Auditoria profunda usando inteligência artificial (Jina AI & Gemini) para diagnosticar gargalos de conversão, copy e SEO no seu site.
          </p>
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <button 
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg shadow-blue-500/30"
            >
              Criar Conta Grátis <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg transition-colors"
            >
              Já tenho conta
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <Search className="w-10 h-10 text-blue-500 mb-4 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">Deep Scraping</h3>
              <p className="text-sm text-slate-500">Varredura profunda extraindo métricas reais do seu HTML e infraestrutura.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <ShieldCheck className="w-10 h-10 text-emerald-500 mb-4 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">Segurança & Legal</h3>
              <p className="text-sm text-slate-500">Diagnóstico de SSL, CSP, pixels de rastreio e conformidade.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <Target className="w-10 h-10 text-purple-500 mb-4 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">Otimização CRO</h3>
              <p className="text-sm text-slate-500">Análise de objeções e ofertas para aumentar a conversão de vendas.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
