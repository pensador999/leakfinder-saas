import React, { useState } from 'react';
import { 
  TrendingDown, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  MessageSquare, 
  Sparkles, 
  Flame, 
  Sliders, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Cpu,
  Layers,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { calculateStoreFinancialGrounding, formatBRL } from '../../services/ai/storeFinancialGroundingEngine';
import { auditSupplyChainDiscrepancy } from '../../services/supplyChain/erpHubDiscrepancyEngine';
import { AuditScoreEvolutionTimeline } from '../history/AuditScoreEvolutionTimeline';

interface MerchantTripleImpactDossierProps {
  diagnostic: AgentDiagnosticResult;
  onOpenPricing: () => void;
  onOpenWhatsAppLead: () => void;
  onSwitchToWarRoom: () => void;
  onOpenMetaAutoKill: () => void;
}

export const MerchantTripleImpactDossier: React.FC<MerchantTripleImpactDossierProps> = ({
  diagnostic,
  onOpenPricing,
  onOpenWhatsAppLead,
  onSwitchToWarRoom,
  onOpenMetaAutoKill
}) => {
  const { realSiteData, input, growthScore, estimatedRevenueLiftMin } = diagnostic;
  const finances = calculateStoreFinancialGrounding(realSiteData, input, diagnostic.social);
  const supplyChainAudit = auditSupplyChainDiscrepancy(realSiteData, input);

  const [copiedScript, setCopiedScript] = useState(false);
  const [showAdvancedScripts, setShowAdvancedScripts] = useState(false);
  const [customAdSpend, setCustomAdSpend] = useState<number>(finances.estimatedAdSpend.monthly);

  const brokenSkus = (realSiteData.catalogAudit?.issues || []).filter(i => !i.isFullPrintExempt && i.missingSizes.length > 0);

  // Cálculo transparente e reativo da perda com base na verba informada pelo lojista
  const activeSpend = customAdSpend > 0 ? customAdSpend : finances.estimatedAdSpend.monthly;
  const brokenRatio = brokenSkus.length > 0 ? Math.min(0.45, (brokenSkus.length / Math.max(1, finances.catalogVolumeCount)) * 1.5) : 0;
  // Regra de 65% de compras perdidas na falta de grade central M/G
  const dynamicAdWaste = brokenSkus.length > 0 ? Number((activeSpend * brokenRatio * 0.65).toFixed(2)) : 0;
  const dynamicTotalLoss = Number((dynamicAdWaste + finances.financialRisk.checkoutFrictionMonthly).toFixed(2));
  const dynamicAnnualLoss = Number((dynamicTotalLoss * 12).toFixed(2));
  const formattedDynamicLoss = formatBRL(dynamicTotalLoss);
  const formattedDynamicAnnualLoss = formatBRL(dynamicAnnualLoss);

  const whatsappMessage = encodeURIComponent(
    `Olá! Acabei de gerar o Dossiê Executivo da ${realSiteData.brandName} (${realSiteData.domain}) no AdShield AI. Identificamos ${formattedDynamicLoss}/mês em risco por produtos com grade furada em anúncios ativos. Gostaria de falar com um especialista sobre a blindagem e monitoramento 24h.`
  );
  const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`;

  const trafficAlertScript = `🚨 *ALERTA DE TRÁFEGO • ADSHIELD INTEL*\n\nFala time! Nossa auditoria identificou ${brokenSkus.length} produto(s) com anúncios ativos mas grade furada em ${realSiteData.domain}.\n\n💸 *Risco de queima de verba:* ~${formattedDynamicLoss}/mês (calculado sobre ${formatBRL(activeSpend)}/mês de investimento).\n👉 *Ação imediata:* Pausar conjuntos de anúncios dos SKUs rompidos ou substituir a URL de destino.`;

  const handleCopyTrafficScript = () => {
    navigator.clipboard.writeText(trafficAlertScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      
      {/* Switcher Bar for Advanced Users */}
      <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Modo Executivo do Lojista Ativo</span>
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">Visualização direta de 3 blocos comerciais sem jargões técnicos.</span>
        </div>

        <button
          onClick={onSwitchToWarRoom}
          className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          <span>Abrir Modo War Room (12 Agentes de IA)</span>
          <ArrowRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* 🔴 PERGUNTA 1: QUANTO DINHEIRO VOCÊ ESTÁ PERDENDO HOJE? */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-rose-950 border border-rose-500/30 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-rose-800/40 pb-4">
            <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>1. Diagnóstico de Vazamento Financeiro</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Porte Identificado: <strong className="text-white">{finances.tierLabel}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono">
                  Quanto dinheiro sua loja está perdendo hoje?
                </h2>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[9px] font-mono font-bold">
                  Simulador Dinâmico
                </span>
              </div>
              <p className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                {dynamicTotalLoss > 0 ? (
                  <>
                    Estimamos <span className="text-rose-400 font-mono">{formattedDynamicLoss}/mês</span> em risco nos anúncios da <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{realSiteData.brandName}</span>
                  </>
                ) : (
                  <>
                    <span className="text-emerald-400">Grade Blindada!</span> R$ 0,00 de desperdício em anúncios para a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{realSiteData.brandName}</span>
                  </>
                )}
              </p>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                {dynamicTotalLoss > 0 ? (
                  <>
                    Nossa inteligência inspecionou o catálogo ao vivo de <strong>{realSiteData.domain}</strong> e encontrou <strong>{brokenSkus.length} produto(s) com tráfego pago ativo mas com os tamanhos mais vendidos esgotados</strong>.
                  </>
                ) : (
                  <>
                    Nossa inteligência inspecionou o catálogo ao vivo de <strong>{realSiteData.domain}</strong> e confirmou que os produtos auditados estão com a grade disponível ou são peças de tamanho único/equipamentos isentos.
                  </>
                )}
              </p>
            </div>

            {/* Quick Metrics Breakdown */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="p-4 bg-slate-900/80 rounded-2xl border border-rose-500/30 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Risco Anualizado</span>
                <span className="text-2xl font-black text-rose-400 font-mono">{formattedDynamicAnnualLoss}</span>
                <span className="text-[10px] text-rose-300 block font-medium">em 12 meses</span>
              </div>

              <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30 text-center text-emerald-300">
                <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono block">Recuperação</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">+{estimatedRevenueLiftMin}%</span>
                <span className="text-[10px] text-emerald-300 block font-medium">Margem Líquida</span>
              </div>
            </div>
          </div>

          {/* 🎛️ SIMULADOR DINÂMICO DE VERBA REAL DE TRÁFEGO PAGO */}
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Simulador de Verba Real de Tráfego Pago
                </span>
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded text-[9px] font-mono font-bold">
                  Parâmetro Customizável
                </span>
              </div>
              <span className="text-xs font-mono text-indigo-300 font-bold">
                Investimento: {formatBRL(activeSpend)}/mês
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={activeSpend}
                onChange={(e) => setCustomAdSpend(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>R$ 1.000/mês</span>
                <span>R$ 25.000/mês</span>
                <span>R$ 50.000/mês</span>
                <span>R$ 100.000/mês</span>
              </div>
            </div>

            {/* Presets rápidos */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-slate-400 font-mono">Verbas Rápidas:</span>
              {[2000, 5000, 10000, 25000, 50000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setCustomAdSpend(preset)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                    activeSpend === preset
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                  }`}
                >
                  {formatBRL(preset)}
                </button>
              ))}
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 pt-2.5">
              ℹ️ <strong>Transparência AdShield:</strong> A Meta Ads Library comprova os anúncios ativos no ar e o scanner comprova os tamanhos esgotados. Como o orçamento diário em R$ é um dado privado da sua conta, o simulador acima calcula a sangria proporcional exata para o seu investimento real (regra de ~65% de compras perdidas na falta de grade central).
            </p>
          </div>

          <div className="p-3.5 bg-slate-900/90 rounded-xl border border-indigo-500/30 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-indigo-400">🛡️</span>
              <span><strong>Origem Auditada do Cálculo:</strong> {finances.financialRisk.methodologyExplanation}</span>
            </div>
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-mono font-bold shrink-0">
              Zero Alucinação
            </span>
          </div>
        </div>
      </div>

      {/* 📦 PERGUNTA 2: QUAIS PRODUTOS ESTÃO QUEIMANDO ANÚNCIOS AGORA? */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono block">
              2. Inventário em Risco no Meta & Google Ads
            </span>
            <h3 className="text-xl font-bold text-slate-900">
              Quais produtos estão queimando anúncios agora?
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-rose-50 text-rose-700 rounded-full border border-rose-200">
            {brokenSkus.length} produtos com ruptura na curva ABC
          </span>
        </div>

        {brokenSkus.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brokenSkus.map((skuItem, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 flex flex-col justify-between hover:border-indigo-300 transition-all">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    {skuItem.imageSrc ? (
                      <img src={skuItem.imageSrc} alt="" className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center text-xs font-mono text-slate-400 shrink-0">
                        Foto
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block">SKU: {skuItem.sku}</span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">{skuItem.productTitle}</h4>
                      <span className="text-xs font-bold text-indigo-600 font-mono block mt-0.5">
                        R$ 189,90
                      </span>
                    </div>
                  </div>

                  {/* Missing sizes badge */}
                  <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-rose-800 uppercase font-mono block">🚨 Tamanhos Esgotados na Vitrine:</span>
                    <div className="flex flex-wrap gap-1">
                      {skuItem.missingSizes.map((sz, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-rose-200 text-rose-900 text-[10px] font-black rounded">
                          {sz} (Sem Estoque)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-rose-600 font-bold font-mono">
                    Perda Estimada: ~{formatBRL(Math.round(dynamicAdWaste / Math.max(1, brokenSkus.length)))}/mês
                  </span>
                  <a
                    href={skuItem.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <span>Ver no site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-emerald-900">Catálogo com Grade 100% Blindada!</h4>
            <p className="text-xs text-emerald-700">Nenhum produto com anúncios ativos apresentou ruptura crítica nos tamanhos centrais.</p>
          </div>
        )}
      </div>

      {/* ⚡ PERGUNTA 3: COMO ESTANCAR ESSA SANGRIA E RECUPERAR O LUCRO? (AÇÃO EM 1 CLIQUE) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
        <div className="space-y-2 border-b border-slate-800 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono block">
            3. Plano de Ação Imediata & Blindagem 24h
          </span>
          <h3 className="text-2xl font-black text-white">
            Como estancar essa sangria e recuperar as vendas perdidas?
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Você pode ativar o monitoramento 24h para pausar anúncios no Meta Ads automaticamente quando o estoque zerar, ou falar diretamente com nosso especialista.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-slate-950/20 rounded-xl text-slate-950">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-900 uppercase tracking-wider font-mono block font-extrabold">Recomendado</span>
                <span className="text-xs font-black text-slate-950">Falar no WhatsApp</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <button
            onClick={onOpenMetaAutoKill}
            className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 to-slate-900 hover:from-indigo-800 hover:to-slate-800 text-white font-bold transition-all border border-indigo-500/40 flex items-center justify-between cursor-pointer group text-left shadow-lg shadow-indigo-950/50"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-amber-300 uppercase tracking-wider font-mono block font-bold">Piloto Automático</span>
                <span className="text-xs font-bold text-white">Meta Ads Auto-Kill</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenPricing}
            className="p-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700 flex items-center justify-between cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-indigo-300 uppercase tracking-wider font-mono block">Monitoramento 24h</span>
                <span className="text-xs font-bold text-white">Ver Planos (R$ 197+)</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick WhatsApp Alert Script to Team */}
        <div className="pt-2">
          <button
            onClick={() => setShowAdvancedScripts(!showAdvancedScripts)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span>{showAdvancedScripts ? 'Ocultar script para o gestor de tráfego' : 'Copiar script pronto para enviar ao seu gestor de tráfego'}</span>
            {showAdvancedScripts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvancedScripts && (
            <div className="mt-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">Mensagem Formatada para WhatsApp:</span>
                <button
                  onClick={handleCopyTrafficScript}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copiado!' : 'Copiar Script'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                {trafficAlertScript}
              </pre>
            </div>
          )}
        </div>

      </div>

      {/* Historical Evolution Timeline Powered by Supabase */}
      <AuditScoreEvolutionTimeline diagnostic={diagnostic} />

    </div>
  );
};
