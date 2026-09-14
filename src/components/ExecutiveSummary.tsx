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
  BarChart3,
  Factory,
  ShoppingBag,
  ImageOff,
  ExternalLink,
  Layers,
  Zap
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { generateShopifyTelemetryAnalysis } from '../services/shopifyTelemetryService';
import { calculateStoreFinancialGrounding } from '../services/ai/storeFinancialGroundingEngine';
import { AuditScoreEvolutionTimeline } from './history/AuditScoreEvolutionTimeline';
import { OneClickMitigationService } from '../services/actions/oneClickMitigationService';

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

  const catalogIssues = realSiteData.catalogAudit?.issues || [];
  const inHouseCount = catalogIssues.filter(i => i.manufacturingType === 'FABRICACAO_PROPRIA' && !i.isResaleAccessory).length;
  const resaleCount = catalogIssues.filter(i => i.manufacturingType === 'REVENDA' || i.isResaleAccessory).length;
  const fullExemptCount = realSiteData.catalogAudit?.productsWithFullExemption || catalogIssues.filter(i => i.isFullPrintExempt).length;
  const missingImagesCount = realSiteData.catalogAudit?.productsWithMissingImages || catalogIssues.filter(i => !i.hasValidImage).length;
  const brokenGridCount = realSiteData.catalogAudit?.productsWithBrokenGrid || catalogIssues.filter(i => !i.isFullPrintExempt && i.missingSizes.length > 0).length;
  const shopSlug = OneClickMitigationService.getShopSlug(realSiteData.domain);

  return (
    <div className="space-y-6">

      {/* 🏛️ STORE OVERVIEW & AUDIT GROUNDING BAR */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-slate-900 font-mono tracking-tight">
                {realSiteData.brandName || 'LOJA AUDITADA'}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                DOM Auditado ao Vivo ✓
              </span>
              {shopSlug && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                  Shopify: {shopSlug}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Auditoria profunda de catálogo, imagens, grade de tamanhos e integridade de checkout.
            </p>
          </div>
        </div>

        {/* Quick Links & Direct Admin Button */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-start lg:justify-end flex-wrap">
          {shopSlug && (
            <a
              href={`https://admin.shopify.com/store/${shopSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
              title="Abrir painel administrativo da Shopify desta loja"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shopify Admin ({shopSlug})</span>
            </a>
          )}
          <a
            href={realSiteData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="Abrir vitrine da loja em nova aba"
          >
            <span>Ver Loja</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 📊 4 NOVO STRIP DE METRICAS OPERACIONAIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        
        {/* 1. Confecção Própria PCP */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-mono text-[10px] uppercase font-bold flex items-center gap-1">
              <Factory className="w-3.5 h-3.5 text-blue-600" /> Própria (PCP)
            </span>
            <span className="text-[10px] font-bold text-blue-600">Sublimação</span>
          </div>
          <p className="text-xl font-black font-mono text-slate-900">{inHouseCount} SKUs</p>
          <p className="text-[10px] text-slate-500">Costura sob demanda</p>
        </div>

        {/* 2. Revenda Externa */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-mono text-[10px] uppercase font-bold flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-600" /> Revenda Externa
            </span>
            <span className="text-[10px] font-bold text-amber-600">Compras</span>
          </div>
          <p className="text-xl font-black font-mono text-slate-900">{resaleCount} SKUs</p>
          <p className="text-[10px] text-slate-500">Botão, calçados, bonés</p>
        </div>

        {/* 3. Isenção Regra _FULL */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-mono text-[10px] uppercase font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Regra _FULL
            </span>
            <span className="text-[10px] font-bold text-emerald-600">Isentos</span>
          </div>
          <p className="text-xl font-black font-mono text-emerald-600">{fullExemptCount} SKUs</p>
          <p className="text-[10px] text-slate-500">Zero falso-positivo</p>
        </div>

        {/* 4. Sensor de Imagens */}
        <div className={`p-3.5 border rounded-2xl space-y-1 shadow-2xs ${
          missingImagesCount > 0 
            ? 'bg-rose-50/70 border-rose-200' 
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold flex items-center gap-1 text-slate-600">
              {missingImagesCount > 0 ? (
                <ImageOff className="w-3.5 h-3.5 text-rose-600" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              )}
              Sensor de Imagens
            </span>
            <span className={`text-[10px] font-bold ${missingImagesCount > 0 ? 'text-rose-700' : 'text-emerald-600'}`}>
              {missingImagesCount > 0 ? 'Crítico' : '100% OK'}
            </span>
          </div>
          <p className={`text-xl font-black font-mono ${missingImagesCount > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {missingImagesCount > 0 ? `${missingImagesCount} Sem Foto` : 'Zero Quebradas'}
          </p>
          <p className={`text-[10px] ${missingImagesCount > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
            {missingImagesCount > 0 ? 'Requer inativação imediata' : 'Todas fotos ativas'}
          </p>
        </div>

      </div>
      
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
            {finances.financialRisk.totalMonthlyLoss > 0 ? (
              <>
                <span className="text-2xl font-black font-mono text-rose-600 tracking-tight">
                  {finances.financialRisk.formattedMonthlyLoss} / mês
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Risco em tráfego para {finances.brokenSkusCount} SKU(s) rompidos e fricção de checkout.
                </p>
              </>
            ) : (
              <>
                <span className="text-2xl font-black font-mono text-emerald-600 tracking-tight">
                  Grade Blindada (R$ 0)
                </span>
                <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                  Catálogo 100% íntegro. Zero desperdício em anúncios de produtos rompidos.
                </p>
              </>
            )}
          </div>

          <button
            onClick={() => onSelectAgentTab('telemetry')}
            className={`w-full py-2 px-3 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              finances.financialRisk.totalMonthlyLoss > 0
                ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
            }`}
          >
            <span>Ver Telemetria & Gravações</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Historical Evolution Timeline Powered by Supabase */}
      <AuditScoreEvolutionTimeline diagnostic={diagnostic} />
    </div>
  );
};
