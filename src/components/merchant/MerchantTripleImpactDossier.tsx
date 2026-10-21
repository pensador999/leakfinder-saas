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
  ShoppingBag,
  Info,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { calculateStoreFinancialGrounding, formatBRL } from '../../services/ai/storeFinancialGroundingEngine';
import { auditSupplyChainDiscrepancy } from '../../services/supplyChain/erpHubDiscrepancyEngine';
import { isCatalogProductBroken } from '../../services/siteInspector';
import { AuditScoreEvolutionTimeline } from '../history/AuditScoreEvolutionTimeline';
import { getWhiteLabelConfig } from '../../services/whiteLabelService';
import { useAuditStore } from '../../store/auditStore';
import { ProductImageWithFallback } from '../common/ProductImageWithFallback';
import { WhatsAppIcon } from '../common/WhatsAppIcon';

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
  const customAdSpend = useAuditStore(state => state.customMonthlyAdSpend);
  const setCustomAdSpend = useAuditStore(state => state.setCustomMonthlyAdSpend);

  const finances = calculateStoreFinancialGrounding(realSiteData, input, diagnostic.social, customAdSpend);
  const supplyChainAudit = auditSupplyChainDiscrepancy(realSiteData, input);

  const [copiedScript, setCopiedScript] = useState(false);
  const [showAdvancedScripts, setShowAdvancedScripts] = useState(false);
  const [showMathFormula, setShowMathFormula] = useState<boolean>(false);

  const brokenSkus = (realSiteData.catalogAudit?.issues || []).filter(isCatalogProductBroken);

  // Fonte Única da Verdade Financeira (100% sincronizada com Header, Resumo Executivo, ToT e PDF)
  const activeSpend = finances.estimatedAdSpend.monthly;
  const brokenRatio = finances.financialRisk.brokenRatio;
  const dynamicAdWaste = finances.financialRisk.adWasteMonthly;
  const dynamicTotalLoss = finances.financialRisk.totalMonthlyLoss;
  const dynamicAnnualLoss = finances.financialRisk.annualizedLoss;
  const formattedDynamicLoss = finances.financialRisk.formattedMonthlyLoss;
  const formattedDynamicAnnualLoss = finances.financialRisk.formattedAnnualizedLoss;

  const whiteLabel = getWhiteLabelConfig();
  const cleanConsultantPhone = (whiteLabel.consultantWhatsApp || '5511999999999').replace(/\D/g, '');
  const phoneWithCountry = cleanConsultantPhone.startsWith('55') ? cleanConsultantPhone : `55${cleanConsultantPhone}`;
  const agencyBrand = whiteLabel.agencyName || 'AdShield AI';

  const whatsappMessage = encodeURIComponent(
    brokenSkus.length > 0
      ? `Olá ${whiteLabel.consultantName || agencyBrand}! Acabei de gerar o Dossiê Executivo da ${realSiteData.brandName} (${realSiteData.domain}) no ${agencyBrand}. Identificamos ${formatBRL(dynamicAdWaste)}/mês em risco por produtos com grade furada em anúncios ativos. Gostaria de falar com um especialista sobre a blindagem e monitoramento 24h.`
      : `Olá ${whiteLabel.consultantName || agencyBrand}! Acabei de gerar o Dossiê Executivo da ${realSiteData.brandName} (${realSiteData.domain}) no ${agencyBrand} e confirmei que nosso catálogo está 100% íntegro (R$ 0 em perda de anúncios). Gostaria de conhecer o monitoramento contínuo 24h para manter nossa operação blindada.`
  );
  const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${whatsappMessage}`;

  const trafficAlertScript = brokenSkus.length > 0
    ? `*RELATÓRIO DE AUDITORIA: TRÁFEGO & ESTOQUE • ADSHIELD*\n\nTime, identificamos ${brokenSkus.length} produto(s) com anúncios ativos na Meta Ads Library, porém com as variantes centrais esgotadas na loja (${realSiteData.domain}).\n\n*Impacto Estimado:* ~${formatBRL(dynamicAdWaste)}/mês em cliques perdidos (baseado em ${formatBRL(activeSpend)}/mês de investimento).\n*Ação Recomendada:* Pausar os criativos dos SKUs rompidos ou substituir a URL de destino para coleções com grade completa.`
    : `*RELATÓRIO DE AUDITORIA: TRÁFEGO & ESTOQUE • ADSHIELD*\n\nTime, confirmamos que 100% dos produtos auditados na loja (${realSiteData.domain}) possuem grade central íntegra.\n\n*Status:* R$ 0,00 de desperdício em anúncios ativos.\n*Recomendação:* Manter monitoramento contínuo ativo via AdShield.`;

  const handleCopyTrafficScript = () => {
    navigator.clipboard.writeText(trafficAlertScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      
      {/* Switcher Bar for Advanced Users */}
      <div className="flex items-center justify-between p-3 bg-[#141716] rounded-2xl border border-white/10 shadow-xs flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-[#0AE448]/10 text-[#0AE448] text-xs font-bold rounded-lg border border-[#0AE448]/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" />
            <span>Modo Executivo do Lojista Ativo</span>
          </span>
          <span className="text-xs text-[#7C7C6F] hidden sm:inline">Visualização direta de 3 blocos comerciais sem jargões técnicos.</span>
        </div>

        <button
          onClick={onSwitchToWarRoom}
          className="px-4 py-1.5 bg-[#191C1B] hover:bg-white/10 text-[#FFFCE1] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10 shadow-xs"
        >
          <Cpu className="w-3.5 h-3.5 text-[#00BAE2]" />
          <span>Abrir Modo War Room (18 Agentes de IA)</span>
          <ArrowRight className="w-3 h-3 text-[#7C7C6F]" />
        </button>
      </div>

      {/* 🔴 PERGUNTA 1: QUANTO DINHEIRO VOCÊ ESTÁ PERDENDO HOJE? */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl text-white relative overflow-hidden space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#FF4757]/15 text-[#FF4757] border border-[#FF4757]/30 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF4757]" />
              <span>Diagnóstico de Risco Financeiro</span>
            </span>
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-[10px] font-mono font-bold">
              [Simulação Baseada em Benchmark]
            </span>
          </div>
          <span className="text-xs text-[#7C7C6F] font-mono">
            Porte Auditado: <strong className="text-white">{finances.tierLabel}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <h2 className={`text-xs font-bold uppercase tracking-wider font-mono ${dynamicAdWaste > 0 ? 'text-[#FF4757]' : 'text-[#0AE448]'}`}>
                {dynamicAdWaste > 0 ? 'Quanto dinheiro sua loja está perdendo em anúncios hoje?' : 'Diagnóstico de Eficiência de Tráfego & Estoque'}
              </h2>
            </div>
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {dynamicAdWaste > 0 ? (
                <>
                  Estimamos <span className="text-[#FF4757] font-mono">{formatBRL(dynamicAdWaste)}/mês</span> em risco nos anúncios da <span className="text-[#0AE448] font-bold">{realSiteData.brandName}</span>
                </>
              ) : (
                <>
                  <span className="text-[#0AE448]">Grade Blindada!</span> R$ 0,00 de desperdício em anúncios para a <span className="text-[#0AE448] font-bold">{realSiteData.brandName}</span>
                </>
              )}
            </p>
            <p className="text-xs text-[#A0A090] leading-relaxed max-w-2xl font-sans">
              {dynamicAdWaste > 0 ? (
                <>
                  Inspeção ao vivo de <strong>{realSiteData.domain}</strong>: detectados <strong>{brokenSkus.length} produto(s) com tráfego pago ativo mas com os tamanhos de maior giro (P, M, G) esgotados no HTML público</strong>.
                </>
              ) : (
                <>
                  Inspeção ao vivo de <strong>{realSiteData.domain}</strong>: 100% da grade disponível nos tamanhos centrais auditados ou catálogo composto por itens de tamanho único/revenda isentos. {finances.financialRisk.checkoutFrictionMonthly > 0 ? `Identificamos apenas uma oportunidade simulada de ganho de margem no checkout (${finances.financialRisk.formattedCheckoutFriction}/mês via incentivo ao Pix).` : 'Nenhum desperdício em mídia detectado.'}
                </>
              )}
            </p>
          </div>

          {/* Quick Metrics Breakdown */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className={`p-4 bg-[#141716] rounded-2xl border text-center ${dynamicAdWaste > 0 ? 'border-white/10' : 'border-[#0AE448]/30'}`}>
              <span className={`text-[10px] uppercase font-bold font-mono block ${dynamicAdWaste > 0 ? 'text-[#7C7C6F]' : 'text-[#0AE448]'}`}>
                {dynamicAdWaste > 0 ? 'Risco Anual Anúncios' : 'Desperdício Anúncios'}
              </span>
              <span className={`text-2xl font-black font-mono ${dynamicAdWaste > 0 ? 'text-[#FF4757]' : 'text-[#0AE448]'}`}>
                {dynamicAdWaste > 0 ? formatBRL(dynamicAdWaste * 12) : 'R$ 0,00'}
              </span>
              <span className="text-[10px] text-[#A0A090] block font-medium">
                {dynamicAdWaste > 0 ? 'em 12 meses' : '100% Blindado'}
              </span>
            </div>

            <div className="p-4 bg-[#141716] rounded-2xl border border-[#0AE448]/30 text-center text-[#0AE448]">
              <span className="text-[10px] uppercase font-bold text-[#0AE448] font-mono block">Recuperação</span>
              <span className="text-2xl font-black text-[#0AE448] font-mono">+{estimatedRevenueLiftMin}%</span>
              <span className="text-[10px] text-[#A0A090] block font-medium">Margem Líquida</span>
            </div>
          </div>
        </div>

        {/* 🎛️ SIMULADOR DINÂMICO DE VERBA REAL DE TRÁFEGO PAGO */}
        <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00BAE2]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Simulador de Verba Real de Tráfego Pago
              </span>
              <span className="px-2 py-0.5 bg-[#00BAE2]/15 text-[#00BAE2] border border-[#00BAE2]/30 rounded text-[9px] font-mono font-bold">
                Ajustável pelo Lojista
              </span>
            </div>
            <span className="text-xs font-mono text-[#00BAE2] font-bold">
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
              className="w-full h-2 bg-[#191C1B] rounded-lg appearance-none cursor-pointer accent-[#0AE448]"
            />
            <div className="flex items-center justify-between text-[10px] font-mono text-[#7C7C6F]">
              <span>R$ 1.000/mês</span>
              <span>R$ 25.000/mês</span>
              <span>R$ 50.000/mês</span>
              <span>R$ 100.000/mês</span>
            </div>
          </div>

          {/* Presets rápidos */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-[#7C7C6F] font-mono">Verbas Frequentes:</span>
            {[2000, 5000, 10000, 25000, 50000].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setCustomAdSpend(preset)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                  activeSpend === preset
                    ? 'bg-[#0AE448] text-[#0E100F] shadow-xs'
                    : 'bg-[#191C1B] hover:bg-white/10 text-slate-300 border border-white/10'
                }`}
              >
                {formatBRL(preset)}
              </button>
            ))}
          </div>

          {/* Botão de Toggle da Fórmula Matemática Exata */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={() => setShowMathFormula(!showMathFormula)}
              className="text-[11px] font-mono text-[#00BAE2] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showMathFormula ? 'Ocultar Fórmula Matemática de Grounding' : 'Inspecionar Fórmula Matemática Auditada'}</span>
              {showMathFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] font-mono text-[#7C7C6F]">
              Zero Alucinação • Proporcional ao Orçamento Real
            </span>
          </div>

          {/* Gaveta da Fórmula Matemática Exata */}
          {showMathFormula && (
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-[#A0A090] space-y-2">
              <div className="text-white font-bold flex items-center justify-between">
                <span>FÓRMULA EXATA DE AUDITORIA:</span>
                <span className="text-[#0AE448]">Fator Curva ABC: 65%</span>
              </div>
              <div className="p-2.5 bg-[#0E100F] rounded-lg border border-white/5 text-slate-300">
                <code>Perda Anúncios = Investimento ({formatBRL(activeSpend)}) × Proporção de SKUs Rompidos ({brokenRatio.toFixed(3)}) × 0.65 = {formatBRL(dynamicAdWaste)}/mês</code>
                <br />
                <code>Oportunidade Checkout = Atrito Pix ({formatBRL(finances.financialRisk.checkoutFrictionMonthly)})/mês</code>
                <br />
                <code className={dynamicAdWaste > 0 ? "text-[#FF4757] font-bold" : "text-[#0AE448] font-bold"}>
                  {dynamicAdWaste > 0 ? `Total em Risco de Mídia = ${formatBRL(dynamicAdWaste)}/mês` : 'Risco em Mídia = R$ 0,00 (Grade 100% Blindada)'}
                </code>
              </div>
              <p className="text-[10px] text-[#7C7C6F] leading-relaxed">
                *O fator de 65% reflete o benchmark de mercado onde tamanhos P, M e G concentram dois terços das compras de vestuário no Brasil. Quando esses tamanhos estão zerados, 65% dos cliques de anúncios são perdidos na página sem conversão.
              </p>
            </div>
          )}
        </div>

        <div className="p-3.5 bg-[#141716] rounded-xl border border-white/10 text-xs text-[#A0A090] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0AE448] shrink-0" />
            <span><strong>Origem Auditada do Cálculo:</strong> {finances.financialRisk.methodologyExplanation}</span>
          </div>
          <span className="px-2 py-0.5 bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30 rounded text-[10px] font-mono font-bold shrink-0">
            Dado Auditado ao Vivo
          </span>
        </div>
      </div>

      {/* 2. INVENTÁRIO EM RISCO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141716] border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00BAE2] font-mono block">
              2. Inventário em Risco no Meta & Google Ads
            </span>
            <h3 className="text-xl font-bold text-[#FFFCE1]">
              Quais produtos estão queimando anúncios agora?
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-[#FF4757]/15 text-[#FF4757] rounded-full border border-[#FF4757]/30">
            {brokenSkus.length} produtos com ruptura na curva ABC
          </span>
        </div>

        {brokenSkus.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {brokenSkus.map((skuItem, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#191C1B] border border-white/10 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all">
                <div className="space-y-2">
                  <div className="flex items-start gap-3">
                    <ProductImageWithFallback
                      src={skuItem.imageSrc}
                      alt={skuItem.productTitle}
                      category={input.niche}
                      className="w-14 h-14"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-mono font-bold text-[#7C7C6F] uppercase block">SKU: {skuItem.sku}</span>
                      <h4 className="text-xs font-bold text-[#FFFCE1] truncate">{skuItem.productTitle}</h4>
                      <span className="text-xs font-bold text-[#0AE448] font-mono block mt-0.5">
                        {skuItem.price && skuItem.price > 0 ? formatBRL(skuItem.price) : finances.formattedAverageTicket}
                      </span>
                    </div>
                  </div>

                  {/* Missing sizes badge */}
                  <div className="p-2.5 bg-[#FF4757]/10 rounded-xl border border-[#FF4757]/20 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-[#FF4757] uppercase font-mono flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 text-[#FF4757] shrink-0" />
                      <span>Variantes Esgotadas na Vitrine:</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {skuItem.missingSizes.map((sz, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-[#FF4757]/20 text-[#FF4757] text-[10px] font-black rounded border border-[#FF4757]/30">
                          {sz} (Sem Estoque)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#FF4757] font-bold font-mono">
                    Perda Estimada: ~{formatBRL(Math.round(dynamicAdWaste / Math.max(1, brokenSkus.length)))}/mês
                  </span>
                  <a
                    href={skuItem.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00BAE2] hover:text-[#FFFCE1] font-bold flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <span>Ver no site</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#0AE448]/10 border border-[#0AE448]/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#0AE448] mx-auto" />
            <h4 className="text-sm font-bold text-[#FFFCE1]">Catálogo com Grade 100% Blindada!</h4>
            <p className="text-xs text-[#0AE448]">Nenhum produto com anúncios ativos apresentou ruptura crítica nos tamanhos centrais.</p>
          </div>
        )}
      </div>

      {/* 3. PLANO DE AÇÃO IMEDIATA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141716] text-[#FFFCE1] border border-white/10 shadow-2xl space-y-6">
        <div className="space-y-2 border-b border-white/10 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0AE448] font-mono block">
            3. Plano de Ação Imediata & Blindagem 24h
          </span>
          <h3 className="text-2xl font-black text-[#FFFCE1]">
            Como estancar essa sangria e recuperar as vendas perdidas?
          </h3>
          <p className="text-xs text-[#BBBAA6] max-w-2xl leading-relaxed">
            Você pode ativar o monitoramento 24h para pausar anúncios no Meta Ads automaticamente quando o estoque zerar, ou falar diretamente com nosso especialista.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-[#0AE448] hover:bg-[#09cb40] text-[#0E100F] font-black transition-all shadow-lg shadow-[#0AE448]/20 flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-black/15 rounded-xl text-[#0E100F] flex items-center justify-center">
                <WhatsAppIcon className="w-5 h-5 text-[#0E100F]" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-[#0E100F]/80 uppercase tracking-wider font-mono block font-extrabold">Canal Direto</span>
                <span className="text-xs font-black text-[#0E100F]">Falar no WhatsApp</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          <button
            onClick={onOpenMetaAutoKill}
            className="p-4 rounded-2xl bg-[#191C1B] hover:bg-white/5 text-[#FFFCE1] font-bold transition-all border border-white/10 flex items-center justify-between cursor-pointer group text-left shadow-lg"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#FF8709]/20 text-[#FF8709] rounded-xl border border-[#FF8709]/30">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#FF8709] uppercase tracking-wider font-mono block font-bold">Piloto Automático</span>
                <span className="text-xs font-bold text-[#FFFCE1]">Meta Ads Auto-Kill</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#7C7C6F] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenPricing}
            className="p-4 rounded-2xl bg-[#191C1B] hover:bg-white/5 text-[#FFFCE1] font-bold transition-all border border-white/10 flex items-center justify-between cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#00BAE2]/20 text-[#00BAE2] rounded-xl border border-[#00BAE2]/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-[#00BAE2] uppercase tracking-wider font-mono block">Monitoramento 24h</span>
                <span className="text-xs font-bold text-[#FFFCE1]">Ver Planos (R$ 297+)</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#7C7C6F] group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Quick WhatsApp Alert Script to Team */}
        <div className="pt-2">
          <button
            onClick={() => setShowAdvancedScripts(!showAdvancedScripts)}
            className="text-xs text-[#00BAE2] hover:text-[#FFFCE1] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <span>{showAdvancedScripts ? 'Ocultar script para o gestor de tráfego' : 'Copiar script pronto para enviar ao seu gestor de tráfego'}</span>
            {showAdvancedScripts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvancedScripts && (
            <div className="mt-3 p-4 bg-[#101211] rounded-2xl border border-white/10 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#7C7C6F]">Mensagem Formatada para WhatsApp:</span>
                <button
                  onClick={handleCopyTrafficScript}
                  className="px-3 py-1 bg-[#0AE448] hover:bg-[#09cb40] text-[#0E100F] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-[#0E100F]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copiado!' : 'Copiar Script'}</span>
                </button>
              </div>
              <pre className="text-xs font-mono text-[#BBBAA6] whitespace-pre-wrap leading-relaxed">
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
