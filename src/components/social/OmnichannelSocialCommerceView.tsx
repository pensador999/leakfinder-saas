import React, { useState } from 'react';
import { 
  MessageSquare, 
  Smartphone, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  Zap, 
  Share2, 
  Target, 
  Bot, 
  Layers, 
  DollarSign,
  Globe
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { auditOmnichannelSocialCommerce, OmnichannelSocialAuditResult } from '../../services/socialOmnichannelInspector';
import { calculateStoreFinancialGrounding } from '../../services/ai/storeFinancialGroundingEngine';

interface OmnichannelSocialCommerceViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const OmnichannelSocialCommerceView: React.FC<OmnichannelSocialCommerceViewProps> = ({ diagnostic }) => {
  const { realSiteData, input, social } = diagnostic;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const omniData: OmnichannelSocialAuditResult = auditOmnichannelSocialCommerce(realSiteData, input?.instagramHandle);
  const finances = calculateStoreFinancialGrounding(realSiteData, input, social);

  const handleCopyScript = (script: string, index: number) => {
    navigator.clipboard.writeText(script);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 text-[#FFFCE1]">
      
      {/* 🚀 TOP HERO BANNER: BUSINESS MODEL & MATURITY SCORE */}
      <div className="bg-[#101211] text-[#FFFCE1] rounded-3xl p-6 lg:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00BAE2]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5" />
                Inteligência Omnichannel & Social Commerce
              </span>
              <span className="px-3 py-1 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 rounded-full text-xs font-bold uppercase tracking-wider">
                {omniData.businessModel === 'HIBRIDO_SITE_WHATSAPP' ? '🤝 Modelo Híbrido (Site + WhatsApp)' :
                 omniData.businessModel === 'VENDA_DIRETA_SOCIAL' ? '📲 Venda Direta / Social Commerce' :
                 '🛒 E-commerce 100% Automatizado'}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-[#FFFCE1]">
              Canais Sociais, Venda Direta & Pixels de Anúncios
            </h2>
            <p className="text-[#BBBAA6] text-sm leading-relaxed">
              {omniData.businessModelDescription}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-[#141716] p-4 rounded-2xl border border-white/10 w-full lg:w-auto justify-between lg:justify-start shadow-xl">
            <div className="text-left">
              <div className="text-xs font-mono uppercase text-[#BBBAA6] font-bold">Maturidade Omnichannel</div>
              <div className="text-3xl font-black text-[#0AE448] font-mono">{omniData.omnichannelScore}/100</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#0AE448]/10 border border-[#0AE448]/30 flex items-center justify-center">
              <Zap className="w-6 h-6 text-[#0AE448]" />
            </div>
          </div>
        </div>
      </div>

      {/* 📊 3 KEY PILLARS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: Direct Sales (WhatsApp / Chat) */}
        <div className="bg-[#101211] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col justify-between text-[#FFFCE1]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[#0AE448]">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                omniData.directSales.hasWhatsappButton ? 'bg-emerald-500/20 text-[#0AE448] border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {omniData.directSales.hasWhatsappButton ? 'Conectado' : 'Não Detectado'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#FFFCE1]">Venda Direta & WhatsApp</h3>
              <p className="text-xs text-[#BBBAA6] mt-1">
                {omniData.directSales.chatWidgetBrand 
                  ? `Widget detectado: ${omniData.directSales.chatWidgetBrand}`
                  : 'Nenhum botão flutuante de atendimento 1-clique encontrado no DOM.'}
              </p>
            </div>

            <div className="p-3 bg-[#141716] rounded-xl border border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#BBBAA6]">
                <span>Número Identificado:</span>
                <span className="font-mono font-bold text-[#FFFCE1]">{omniData.directSales.whatsappPhoneNumber || 'Nenhum no HTML'}</span>
              </div>
              <div className="flex justify-between text-[#BBBAA6]">
                <span>Fechamento Assistido:</span>
                <span className="font-bold text-[#0AE448]">{omniData.directSales.hasDirectCheckoutAssistance ? 'SIM (1-Clique)' : 'NÃO'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 2: Meta Ads & Tracking Stack */}
        <div className="bg-[#101211] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col justify-between text-[#FFFCE1]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#00BAE2]/10 border border-[#00BAE2]/20 flex items-center justify-center text-[#00BAE2]">
                <Target className="w-5 h-5" />
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                omniData.trackingStack.hasMetaPixel ? 'bg-[#00BAE2]/20 text-[#00BAE2] border border-[#00BAE2]/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {omniData.trackingStack.hasMetaPixel ? 'Pixel Ativo' : 'Sem Pixel'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#FFFCE1]">Rastreamento de Tráfego</h3>
              <p className="text-xs text-[#BBBAA6] mt-1">
                Meta Pixel, TikTok Tag e Google Analytics 4 para públicos de alta intenção.
              </p>
            </div>

            <div className="p-3 bg-[#141716] rounded-xl border border-white/10 space-y-1.5 text-xs">
              <div className="flex justify-between text-[#BBBAA6]">
                <span>Meta Pixel (Facebook/Insta):</span>
                <span className="font-bold text-[#FFFCE1]">{omniData.trackingStack.hasMetaPixel ? '✅ Ativo' : '❌ Ausente'}</span>
              </div>
              <div className="flex justify-between text-[#BBBAA6]">
                <span>CAPI Server-Side:</span>
                <span className="font-bold text-[#FFFCE1]">{omniData.trackingStack.hasServerSideCapi ? '✅ Ativo' : '⚠️ Pendente'}</span>
              </div>
              <div className="flex justify-between text-[#BBBAA6]">
                <span>Google Analytics 4:</span>
                <span className="font-bold text-[#FFFCE1]">{omniData.trackingStack.hasGoogleAnalytics4 ? '✅ Ativo' : '❌ Ausente'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pillar 3: Instagram Funnel & Bio Strategy */}
        <div className="bg-[#101211] rounded-2xl border border-white/10 p-6 shadow-xl flex flex-col justify-between text-[#FFFCE1]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                {omniData.directSales.instagramHandleDetected ? `@${omniData.directSales.instagramHandleDetected}` : 'Bio Auditada'}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-[#FFFCE1]">Funil de Bio no Instagram</h3>
              <p className="text-xs text-[#BBBAA6] mt-1">
                Estratégia de captura direta de Stories e Tráfego Orgânico.
              </p>
            </div>

            <div className="p-3 bg-[#141716] rounded-xl border border-white/10 text-xs text-[#BBBAA6] italic">
              "{omniData.instagramBioStrategy.bioCtaHook}"
            </div>
          </div>
        </div>

      </div>

      {/* 📋 ACTIONABLE OMNICHANNEL PLAYBOOK SCRIPTS */}
      <div className="bg-[#101211] rounded-3xl border border-white/10 p-6 lg:p-8 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-black text-[#FFFCE1] flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#00BAE2]" />
              Playbook de Ação: Scripts de Venda Direta & Recuperação 1-Clique
            </h3>
            <p className="text-xs text-[#BBBAA6] mt-1">
              Copie e ative estes modelos validados pelo nosso enxame de agentes para recuperar vendas perdidas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {omniData.playbookActions.map((play, idx) => (
            <div key={idx} className="bg-[#141716] border border-white/10 rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#00BAE2]/20 text-[#00BAE2] border border-[#00BAE2]/30">
                    {play.channel}
                  </span>
                  <span className="text-xs font-bold text-[#0AE448]">
                    +{play.expectedConversionLiftPct}% Conv.
                  </span>
                </div>

                <h4 className="text-sm font-bold text-[#FFFCE1] leading-tight">
                  {play.title}
                </h4>

                <div className="p-3 bg-[#0E100F] rounded-xl border border-white/10 text-xs text-[#BBBAA6] font-mono leading-relaxed select-all">
                  {play.scriptTemplate}
                </div>
              </div>

              <button
                onClick={() => handleCopyScript(play.scriptTemplate, idx)}
                className="w-full py-2.5 px-3 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-[#0AE448]/20 cursor-pointer"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copiado para a Área de Transferência!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copiar Script 1-Clique
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🛡️ DETAILED AUDIT FINDINGS TABLE */}
      <div className="bg-[#101211] rounded-3xl border border-white/10 p-6 lg:p-8 shadow-2xl space-y-4">
        <h3 className="text-lg font-black text-[#FFFCE1]">
          Diagnóstico Minucioso de Conformidade Omnichannel
        </h3>

        <div className="space-y-3">
          {omniData.checks.map((chk, i) => (
            <div 
              key={chk.id || i}
              className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
                chk.status === 'CRÍTICO' ? 'bg-rose-500/10 border-rose-500/20 text-rose-200' :
                chk.status === 'ALERTA' ? 'bg-amber-500/10 border-amber-500/20 text-amber-200' :
                'bg-emerald-500/10 border-emerald-500/20 text-[#0AE448]'
              }`}
            >
              <div className="mt-0.5">
                {chk.status === 'CRÍTICO' ? <AlertTriangle className="w-5 h-5 text-rose-400" /> :
                 chk.status === 'ALERTA' ? <AlertTriangle className="w-5 h-5 text-amber-400" /> :
                 <CheckCircle2 className="w-5 h-5 text-[#0AE448]" />}
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 bg-white/10 rounded-md border border-white/20 text-[#FFFCE1]">
                    {chk.category}
                  </span>
                  <span className="text-sm font-bold text-[#FFFCE1]">{chk.title}</span>
                </div>
                <p className="text-xs text-[#BBBAA6] leading-relaxed">{chk.description}</p>
                <p className="text-xs font-semibold text-[#FFFCE1] mt-1.5 flex items-center gap-1">
                  💡 <span className="underline">Recomendação:</span> {chk.recommendation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
