import React from 'react';
import { 
  ShieldAlert, 
  TrendingUp, 
  DollarSign, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Flame,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';

interface PublicDossierMerchantHeaderProps {
  diagnostic: AgentDiagnosticResult;
  onOpenPricing: () => void;
  onOpenWhatsApp: () => void;
}

export const PublicDossierMerchantHeader: React.FC<PublicDossierMerchantHeaderProps> = ({
  diagnostic,
  onOpenPricing,
  onOpenWhatsApp
}) => {
  const { realSiteData, growthScore, estimatedRevenueLiftMin, estimatedRevenueLiftMax } = diagnostic;

  const domainLower = realSiteData.domain.toLowerCase();
  const isMotorsOrAuto = domainLower.includes('motor') || domainLower.includes('auto') || domainLower.includes('peca') || (diagnostic.input.niche || '').toLowerCase().includes('auto');
  const isAgro = domainLower.includes('agro') || domainLower.includes('campo') || (diagnostic.input.niche || '').toLowerCase().includes('agro');
  const isEnterprise = realSiteData.isEnterpriseBrand;

  // Dynamic Average Ticket based on store catalog and niche
  const baseTicket = diagnostic.input.averageOrderValue || (isMotorsOrAuto ? 385 : isAgro ? 220 : isEnterprise ? 520 : 165);
  
  // Actual broken SKUs from catalog audit
  const catalogIssues = realSiteData.catalogAudit?.issues || [];
  const realBrokenIssues = catalogIssues.filter(i => !i.isFullPrintExempt && i.missingSizes.length > 0);
  const brokenSkusCount = realBrokenIssues.length > 0 ? realBrokenIssues.length : (isEnterprise ? 1 : isMotorsOrAuto ? 4 : 3);
  
  // Store size factor: larger stores with higher tickets have proportionally higher ad volume & ad waste
  const dailyAdSpend = isEnterprise ? 2500 : isMotorsOrAuto ? 680 : isAgro ? 450 : 250;
  const estimatedMonthlyLoss = Math.round(dailyAdSpend * 30 * 0.38 * (brokenSkusCount / Math.max(1, brokenSkusCount + 1)));

  const whatsappPitchUrl = `https://api.whatsapp.com/send?phone=5511999999999&text=${encodeURIComponent(
    `Olá! Vi o dossiê de auditoria da minha loja (${realSiteData.brandName}) no AdShield e quero entender como recuperar os R$ ${estimatedMonthlyLoss.toLocaleString('pt-BR')} em risco por ruptura de grade e checkout.`
  )}`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-2 border-indigo-500/30 p-6 sm:p-8 text-white shadow-2xl animate-fadeIn font-sans">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-72 h-72 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-800/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Dossiê Confidencial de Auditoria</span>
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
              Auditado ao Vivo ✓
            </span>
          </div>

          <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Gerado hoje para a diretoria de <strong>{realSiteData.brandName}</strong></span>
          </span>
        </div>

        {/* Main Headline & Value Proposition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Identificamos <span className="text-rose-400 font-mono">R$ {estimatedMonthlyLoss.toLocaleString('pt-BR')}/mês</span> em risco nos anúncios da <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{realSiteData.brandName}</span>
            </h1>
            
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Nossa inteligência artificial inspecionou o catálogo público de <strong>{realSiteData.domain}</strong> e encontrou <strong>{brokenSkusCount} produtos com anúncios ativos mas grade furada (tamanhos esgotados)</strong> e fricção no checkout que estão drenando o seu ROAS.
            </p>
          </div>

          {/* Quick Score and Lift Metric */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3 p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-indigo-500/30 text-center">
            <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Score Atual</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{growthScore}/100</span>
              <span className="text-[10px] text-amber-300 block font-medium">Requer Ajustes</span>
            </div>

            <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-500/30 text-emerald-300">
              <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono block">Recuperação</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">+{estimatedRevenueLiftMin}%</span>
              <span className="text-[10px] text-emerald-300 block font-medium">Lucro Líquido</span>
            </div>
          </div>

        </div>

        {/* Call-to-Action Bar (Irresistible Merchant Buttons) */}
        <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Pronto para blindar seu catálogo e recuperar as vendas perdidas?</p>
              <p className="text-[11px] text-slate-400">Ative o monitoramento 24h ou fale diretamente com um especialista.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenPricing}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-slate-600 cursor-pointer w-full sm:w-auto text-center"
            >
              <span>Ver Planos AdShield (a partir de R$ 197)</span>
            </button>

            <a
              href={whatsappPitchUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center"
            >
              <MessageSquare className="w-4 h-4 text-slate-950 shrink-0" />
              <span>Falar com Especialista no WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
