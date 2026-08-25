import React from 'react';
import { TrendingUp, Eye, Sparkles, Flame, CheckCircle2, ArrowRight } from 'lucide-react';
import { AgentDiagnosticResult } from '../types';

interface ExecutiveSummaryProps {
  diagnostic: AgentDiagnosticResult;
  onSelectAgentTab: (tabId: string) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ diagnostic, onSelectAgentTab }) => {
  const { growthScore, estimatedRevenueLiftMin, estimatedRevenueLiftMax, realSiteData, visionAnalysis } = diagnostic;

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

        {/* Computer Vision & Heatmap Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Visão Computacional IA
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Eye className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Foco no CTA (Eye-Tracking):</span>
              <span className={`font-mono font-bold ${visionAnalysis.eyeTracking.focusScoreCta >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {visionAnalysis.eyeTracking.focusScoreCta}%
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Contraste WCAG 2.1:</span>
              <span className="font-mono font-bold text-slate-900">
                {visionAnalysis.contrastAudit.contrastRatio}:1 {visionAnalysis.contrastAudit.wcagAaPassed ? '✅' : '⚠️'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Ímã Visual Dominante:</span>
              <span className="font-bold text-rose-600 truncate max-w-[140px] flex items-center gap-1">
                <Flame className="w-3 h-3 shrink-0" /> {visionAnalysis.eyeTracking.mainFocusElement}
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectAgentTab('vision')}
            className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ver Heatmap & Ergonomia</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
