import React from 'react';
import { 
  TrendingUp, 
  Eye, 
  Sparkles, 
  Flame, 
  Activity, 
  ArrowRight, 
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { generateShopifyTelemetryAnalysis } from '../services/shopifyTelemetryService';
import { calculateStoreFinancialGrounding } from '../services/ai/storeFinancialGroundingEngine';

interface ExecutiveSummaryProps {
  diagnostic: AgentDiagnosticResult;
  onSelectAgentTab: (tabId: string) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ diagnostic, onSelectAgentTab }) => {
  const { growthScore, estimatedRevenueLiftMin, estimatedRevenueLiftMax, realSiteData, visionAnalysis, social } = diagnostic;

  const finances = calculateStoreFinancialGrounding(realSiteData, diagnostic.input, social);

  const telemetryData = generateShopifyTelemetryAnalysis(
    realSiteData.domain,
    realSiteData.catalogAudit?.issues || [],
    realSiteData.rawHtmlSnippet
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Real Site Code Inspection & Speed Badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-medium">
        
        {/* Growth Score Badge Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">AdShield Score</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              Auditado
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-slate-900 tracking-tight">{growthScore}</span>
            <span className="text-lg font-bold text-slate-400">/ 100</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${growthScore}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Oportunidades em <strong className="font-mono text-slate-900">{realSiteData.domain}</strong></span>
          </p>
        </div>

        {/* Revenue Lift Projection Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 font-mono">Projeção Lift</span>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-3xl font-black font-mono text-emerald-600 tracking-tight">+{estimatedRevenueLiftMin}% a +{estimatedRevenueLiftMax}%</span>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">
              Projeção de recuperação de receita corrigindo os gargalos de catálogo e checkout.
            </p>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span className="w-14">Otimista</span>
              <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-emerald-700 font-bold">+{estimatedRevenueLiftMax}%</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <span className="w-14">Realista</span>
              <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-emerald-700 font-bold">+{estimatedRevenueLiftMin}%</span>
            </div>
          </div>
        </div>

        {/* Computer Vision & Heatmap Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-700 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Visão IA
            </span>
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <Eye className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Foco no CTA:</span>
              <span className={`font-mono font-bold ${visionAnalysis.eyeTracking.focusScoreCta >= 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {visionAnalysis.eyeTracking.focusScoreCta}%
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Contraste:</span>
              <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                {visionAnalysis.contrastAudit.contrastRatio}:1
                {visionAnalysis.contrastAudit.wcagAaPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 inline" />
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Ímã Visual:</span>
              <span className="font-bold text-rose-600 truncate max-w-[120px] flex items-center gap-1">
                <Flame className="w-3 h-3 shrink-0" /> {visionAnalysis.eyeTracking.mainFocusElement}
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectAgentTab('vision')}
            className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ver Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Shopify Telemetry & Clarity Card */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-rose-600" /> Risco & Perda Real
            </span>
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-xl">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-2xl font-black font-mono text-rose-600 tracking-tight">
              {finances.financialRisk.formattedMonthlyLoss} / mês
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Perda projetada em tráfego para {finances.brokenSkusCount} SKUs rompidos e fricção no checkout.
            </p>
          </div>

          <button
            onClick={() => onSelectAgentTab('telemetry')}
            className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ver Telemetria & Gravações</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
