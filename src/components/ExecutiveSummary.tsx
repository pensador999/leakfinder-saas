import React from 'react';
import { TrendingUp, ShoppingCart, Search, Target, DollarSign, Brain, ShieldAlert, ArrowRight, Zap, Globe, Clock, ShieldCheck, Sparkles, Layers, ShoppingBag } from 'lucide-react';
import { AgentDiagnosticResult } from '../types';

interface ExecutiveSummaryProps {
  diagnostic: AgentDiagnosticResult;
  onSelectAgentTab: (tabId: string) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ diagnostic, onSelectAgentTab }) => {
  const { growthScore, estimatedRevenueLiftMin, estimatedRevenueLiftMax, realSiteData, cro, seo, ads, salesCopy, pmGrowth } = diagnostic;

  const agentCards = [
    {
      id: 'cro',
      title: 'CRO & Usabilidade',
      score: cro.score,
      subtitle: 'Fricção de Checkout & Mobile',
      topFinding: cro.quickWins[0] || 'Otimizar chamadas de compra no mobile.',
      countText: `${cro.findings.length} gargalos encontrados`,
      actionText: 'Ver relatórios',
      icon: ShoppingCart,
      color: 'blue'
    },
    {
      id: 'seo',
      title: 'SEO & Busca Orgânica',
      score: seo.score,
      subtitle: 'Tags On-Page & Schema',
      topFinding: seo.healthStatus,
      countText: `${seo.topKeywords.length} palavras de ouro`,
      actionText: 'Ver palavras',
      icon: Search,
      color: 'blue'
    },
    {
      id: 'ads',
      title: 'Mídia Paga (Ads)',
      score: Math.round(ads.targetRoas * 20),
      badgeRoas: `ROAS ${ads.targetRoas}x`,
      subtitle: 'ROAS & Criativos Meta/Google',
      topFinding: `CAC Limite recomendado: R$ ${ads.maxCacAllowed}. Orçamento sugerido: R$ ${ads.monthlyAdBudgetSuggested.toLocaleString('pt-BR')}/mês.`,
      countText: `${ads.creatives.length} ganchos de anúncios`,
      actionText: 'Ver anúncios',
      icon: Target,
      color: 'blue'
    },
    {
      id: 'salesCopy',
      title: 'Copywriting & Ofertas',
      score: 74,
      badgeAov: '+AOV',
      subtitle: 'Bundles & Objeções',
      topFinding: salesCopy.offers[0]?.title || 'Order Bump LeakFinder ativo.',
      countText: `elevação estimada de +${salesCopy.offers[0]?.estimatedAovLift || '14%'} no Ticket Médio`,
      actionText: 'Ver ofertas',
      icon: DollarSign,
      color: 'blue'
    },
    {
      id: 'pmGrowth',
      title: 'PM & Growth Loops',
      score: 82,
      subtitle: 'Matriz ICE & Experimentos',
      topFinding: `Prioridade #1: ${pmGrowth.iceMatrix[0]?.title || 'Otimizar checkout mobile.'}`,
      countText: `${pmGrowth.iceMatrix.length} Ideias`,
      actionText: 'Ver Matriz ICE',
      icon: Brain,
      color: 'blue'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Real Site Code Inspection & Speed Badge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-medium">
        
        {/* Growth Score Badge Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 font-mono">LeakFinder Growth Score</span>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Status: Ativo
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black font-mono text-slate-900 tracking-tight">{growthScore}</span>
            <span className="text-xl font-bold text-slate-400">/ 100</span>
          </div>

          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${growthScore}%` }}
            />
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            <span className="font-bold text-amber-700">⚠️ Alto potencial de alavancagem reprimida.</span> Corrigir as falhas encontradas no código de <span className="font-bold font-mono text-slate-900">{realSiteData.domain}</span> pode dobrar a conversão.
          </p>
        </div>

        {/* Revenue Lift Projection Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 font-mono">Projeção de Incremento</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-4xl font-black font-mono text-emerald-600 tracking-tight">+{estimatedRevenueLiftMin}% a +{estimatedRevenueLiftMax}%</span>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Estimativa de incremento de receita líquida nos próximos 90 dias corrigindo os gargalos lidos no site.
            </p>
          </div>
          
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span className="w-16">Otimista</span>
              <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-emerald-700 font-bold">+{estimatedRevenueLiftMax}%</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span className="w-16">Realista</span>
              <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-emerald-700 font-bold">+{estimatedRevenueLiftMin}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
