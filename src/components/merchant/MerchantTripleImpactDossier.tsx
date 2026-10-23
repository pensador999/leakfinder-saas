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
import { useTranslation } from '../../i18n/useTranslation';

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
  const { t, uiLocale, formatMoney, marketProfile } = useTranslation();

  const finances = calculateStoreFinancialGrounding(realSiteData, input, diagnostic.social, customAdSpend);
  const supplyChainAudit = auditSupplyChainDiscrepancy(realSiteData, input);

  const [copiedScript, setCopiedScript] = useState(false);
  const [showAdvancedScripts, setShowAdvancedScripts] = useState(false);
  const [showMathFormula, setShowMathFormula] = useState<boolean>(false);

  const brokenSkus = (realSiteData.catalogAudit?.issues || []).filter(isCatalogProductBroken);
  const localPaymentLabel = uiLocale === 'pt-BR' ? 'Pix' : marketProfile.paymentIncentives.primaryMethodName;

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
    uiLocale === 'pt-BR'
      ? brokenSkus.length > 0
        ? `Olá ${whiteLabel.consultantName || agencyBrand}! Acabei de gerar o Dossiê Executivo da ${realSiteData.brandName} (${realSiteData.domain}) no ${agencyBrand}. Identificamos ${formatMoney(dynamicAdWaste)}/mês em risco por produtos com grade furada em anúncios ativos. Gostaria de falar com um especialista sobre a blindagem e monitoramento 24h.`
        : `Olá ${whiteLabel.consultantName || agencyBrand}! Acabei de gerar o Dossiê Executivo da ${realSiteData.brandName} (${realSiteData.domain}) no ${agencyBrand} e confirmei que nosso catálogo está 100% íntegro (${formatMoney(0)} em perda de anúncios). Gostaria de conhecer o monitoramento contínuo 24h para manter nossa operação blindada.`
      : brokenSkus.length > 0
        ? `Hi ${whiteLabel.consultantName || agencyBrand}! I just generated the Executive Dossier for ${realSiteData.brandName} (${realSiteData.domain}) on ${agencyBrand}. We identified ${formatMoney(dynamicAdWaste)}/mo at risk from broken size grids on active ads. I'd like to speak with a specialist about 24/7 stockout shielding.`
        : `Hi ${whiteLabel.consultantName || agencyBrand}! I just generated the Executive Dossier for ${realSiteData.brandName} (${realSiteData.domain}) on ${agencyBrand} and confirmed our catalog is 100% healthy (${formatMoney(0)} ad waste). I'd like to learn about 24/7 continuous monitoring.`
  );
  const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${whatsappMessage}`;

  const trafficAlertScript =
    uiLocale === 'pt-BR'
      ? brokenSkus.length > 0
        ? `*RELATÓRIO DE AUDITORIA: TRÁFEGO & ESTOQUE • ADSHIELD*\n\nTime, identificamos ${brokenSkus.length} produto(s) com anúncios ativos na Meta Ads Library, porém com as variantes centrais esgotadas na loja (${realSiteData.domain}).\n\n*Impacto Estimado:* ~${formatMoney(dynamicAdWaste)}/mês em cliques perdidos (baseado em ${formatMoney(activeSpend)}/mês de investimento).\n*Ação Recomendada:* Pausar os criativos dos SKUs rompidos ou substituir a URL de destino para coleções com grade completa.`
        : `*RELATÓRIO DE AUDITORIA: TRÁFEGO & ESTOQUE • ADSHIELD*\n\nTime, confirmamos que 100% dos produtos auditados na loja (${realSiteData.domain}) possuem grade central íntegra.\n\n*Status:* ${formatMoney(0)} de desperdício em anúncios ativos.\n*Recomendação:* Manter monitoramento contínuo ativo via AdShield.`
      : brokenSkus.length > 0
        ? `*TRAFFIC & INVENTORY AUDIT REPORT • ADSHIELD*\n\nTeam, we identified ${brokenSkus.length} product(s) with active ads in the Meta Ads Library that are out of stock in core sizes on the storefront (${realSiteData.domain}).\n\n*Estimated Impact:* ~${formatMoney(dynamicAdWaste)}/mo in wasted clicks (based on ${formatMoney(activeSpend)}/mo ad spend).\n*Recommended Action:* Pause creatives for depleted SKUs or reroute destination URLs to full-stock collections.`
        : `*TRAFFIC & INVENTORY AUDIT REPORT • ADSHIELD*\n\nTeam, we confirmed that 100% of audited products on (${realSiteData.domain}) have healthy core size grids.\n\n*Status:* ${formatMoney(0)} wasted on active ads.\n*Recommendation:* Keep 24/7 continuous monitoring active via AdShield.`;

  const handleCopyTrafficScript = () => {
    navigator.clipboard.writeText(trafficAlertScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const monthSuffix = uiLocale === 'pt-BR' ? '/mês' : uiLocale === 'de-DE' ? '/Monat' : uiLocale === 'fr-FR' ? '/mois' : uiLocale === 'es-ES' ? '/mes' : '/mo';

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      
      {/* Switcher Bar for Advanced Users */}
      <div className="flex items-center justify-between p-3 bg-[#141716] rounded-2xl border border-white/10 shadow-xs flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-[#0AE448]/10 text-[#0AE448] text-xs font-bold rounded-lg border border-[#0AE448]/30 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" />
            <span>{t.summary.merchantExecutiveActive}</span>
          </span>
          <span className="text-xs text-[#7C7C6F] hidden sm:inline">{t.summary.merchantExecutiveDesc}</span>
        </div>

        <button
          onClick={onSwitchToWarRoom}
          className="px-4 py-1.5 bg-[#191C1B] hover:bg-white/10 text-[#FFFCE1] rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/10 shadow-xs"
        >
          <Cpu className="w-3.5 h-3.5 text-[#00BAE2]" />
          <span>{t.summary.openWarRoomBtn}</span>
          <ArrowRight className="w-3 h-3 text-[#7C7C6F]" />
        </button>
      </div>

      {/* 🔴 PERGUNTA 1: QUANTO DINHEIRO VOCÊ ESTÁ PERDENDO HOJE? */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl text-white relative overflow-hidden space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#FF4757]/15 text-[#FF4757] border border-[#FF4757]/30 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF4757]" />
              <span>{t.summary.financialRiskTitle}</span>
            </span>
            <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-[10px] font-mono font-bold">
              {t.summary.simulationBadge}
            </span>
          </div>
          <span className="text-xs text-[#7C7C6F] font-mono">
            {t.summary.auditedTier}: <strong className="text-white">{finances.tierLabel}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <h2 className={`text-xs font-bold uppercase tracking-wider font-mono ${dynamicAdWaste > 0 ? 'text-[#FF4757]' : 'text-[#0AE448]'}`}>
                {dynamicAdWaste > 0 ? t.summary.howMuchLosingQuestion : t.summary.efficiencyDiagnosis}
              </h2>
            </div>
            <p className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              {dynamicAdWaste > 0 ? (
                uiLocale === 'pt-BR' ? (
                  <>
                    Estimamos <span className="text-[#FF4757] font-mono">{formatMoney(dynamicAdWaste)}{monthSuffix}</span> em risco nos anúncios da <span className="text-[#0AE448] font-bold">{realSiteData.brandName}</span>
                  </>
                ) : uiLocale === 'de-DE' ? (
                  <>
                    Geschätzte <span className="text-[#FF4757] font-mono">{formatMoney(dynamicAdWaste)}{monthSuffix}</span> Werbebudget-Risiko bei <span className="text-[#0AE448] font-bold">{realSiteData.brandName}</span>
                  </>
                ) : uiLocale === 'fr-FR' ? (
                  <>
                    Environ <span className="text-[#FF4757] font-mono">{formatMoney(dynamicAdWaste)}{monthSuffix}</span> à risque sur les publicités de <span className="text-[#0AE448] font-bold">{realSiteData.brandName}</span>
                  </>
                ) : uiLocale === 'es-ES' ? (
                  <>
                    Estimamos <span className="text-[#FF4757] font-mono">{formatMoney(dynamicAdWaste)}{monthSuffix}</span> en riesgo en anuncios de <span className="text-[#0AE448] font-bold">{realSiteData.brandName}</span>
                  </>
                ) : (
                  <>
                    Estimated <span className="text-[#FF4757] font-mono">{formatMoney(dynamicAdWaste)}{monthSuffix}</span> at risk in active ads for <span className="text-[#0AE448] font-bold">{realSiteData.brandName}</span>
                  </>
                )
              ) : (
                uiLocale === 'pt-BR' ? (
                  <>
                    <span className="text-[#0AE448]">{t.summary.shieldedGrid}</span> {formatMoney(0)} de desperdício em anúncios para a <span className="text-[#0AE448] font-bold">{realSiteData.brandName}</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#0AE448]">{t.summary.shieldedGrid}</span> {formatMoney(0)} ad spend waste detected for <span className="text-[#0AE448] font-bold">{realSiteData.brandName}</span>
                  </>
                )
              )}
            </p>
            <p className="text-xs text-[#A0A090] leading-relaxed max-w-2xl font-sans">
              {dynamicAdWaste > 0 ? (
                uiLocale === 'pt-BR' ? (
                  <>
                    Inspeção ao vivo de <strong>{realSiteData.domain}</strong>: detectados <strong>{brokenSkus.length} produto(s) com tráfego pago ativo mas com os tamanhos de maior giro esgotados no HTML público</strong>.
                  </>
                ) : (
                  <>
                    Live inspection of <strong>{realSiteData.domain}</strong>: detected <strong>{brokenSkus.length} product(s) with active paid traffic but out of stock in high-velocity core sizes on the public storefront</strong>.
                  </>
                )
              ) : (
                uiLocale === 'pt-BR' ? (
                  <>
                    Inspeção ao vivo de <strong>{realSiteData.domain}</strong>: 100% da grade disponível nos tamanhos centrais auditados ou catálogo composto por itens de tamanho único/revenda isentos. {finances.financialRisk.checkoutFrictionMonthly > 0 ? `Identificamos apenas uma oportunidade simulada de ganho de margem no checkout via ${localPaymentLabel} (${formatMoney(finances.financialRisk.checkoutFrictionMonthly)}/mês).` : 'Nenhum desperdício em mídia detectado.'}
                  </>
                ) : (
                  <>
                    Live inspection of <strong>{realSiteData.domain}</strong>: 100% of core sizes available in stock or catalog composed of exempt single-size/resale items. {finances.financialRisk.checkoutFrictionMonthly > 0 ? `Identified a simulated checkout margin opportunity via ${localPaymentLabel} (${formatMoney(finances.financialRisk.checkoutFrictionMonthly)}${monthSuffix}).` : 'Zero paid media waste detected.'}
                  </>
                )
              )}
            </p>
          </div>

          {/* Quick Metrics Breakdown */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className={`p-4 bg-[#141716] rounded-2xl border text-center ${dynamicAdWaste > 0 ? 'border-white/10' : 'border-[#0AE448]/30'}`}>
              <span className={`text-[10px] uppercase font-bold font-mono block ${dynamicAdWaste > 0 ? 'text-[#7C7C6F]' : 'text-[#0AE448]'}`}>
                {dynamicAdWaste > 0 ? t.summary.annualAdRisk : t.summary.adWasteZero}
              </span>
              <span className={`text-2xl font-black font-mono ${dynamicAdWaste > 0 ? 'text-[#FF4757]' : 'text-[#0AE448]'}`}>
                {dynamicAdWaste > 0 ? formatMoney(dynamicAdWaste * 12) : formatMoney(0)}
              </span>
              <span className="text-[10px] text-[#A0A090] block font-medium">
                {dynamicAdWaste > 0 ? '12m' : '100% OK'}
              </span>
            </div>

            <div className="p-4 bg-[#141716] rounded-2xl border border-[#0AE448]/30 text-center text-[#0AE448]">
              <span className="text-[10px] uppercase font-bold text-[#0AE448] font-mono block">{t.summary.recoveryLift}</span>
              <span className="text-2xl font-black text-[#0AE448] font-mono">+{estimatedRevenueLiftMin}%</span>
              <span className="text-[10px] text-[#A0A090] block font-medium">{t.summary.netMargin}</span>
            </div>
          </div>
        </div>

        {/* 🎛️ SIMULADOR DINÂMICO DE VERBA REAL DE TRÁFEGO PAGO */}
        <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00BAE2]" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {t.summary.adSpendSimulatorTitle}
              </span>
              <span className="px-2 py-0.5 bg-[#00BAE2]/15 text-[#00BAE2] border border-[#00BAE2]/30 rounded text-[9px] font-mono font-bold">
                {t.summary.merchantAdjustable}
              </span>
            </div>
            <span className="text-xs font-mono text-[#00BAE2] font-bold">
              {t.summary.monthlySpendLabel}: {formatMoney(activeSpend)}
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
              <span>{formatMoney(1000)}</span>
              <span>{formatMoney(25000)}</span>
              <span>{formatMoney(50000)}</span>
              <span>{formatMoney(100000)}</span>
            </div>
          </div>

          {/* Presets rápidos */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-[#7C7C6F] font-mono">{t.summary.frequentBudgets}:</span>
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
                {formatMoney(preset)}
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
              <span>{showMathFormula ? t.summary.hideMathFormula : t.summary.inspectMathFormula}</span>
              {showMathFormula ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] font-mono text-[#7C7C6F]">
              {uiLocale === 'pt-BR' ? 'Zero Alucinação • Proporcional ao Orçamento Real' : 'Zero Hallucination • Proportional to Real Budget'}
            </span>
          </div>

          {/* Gaveta da Fórmula Matemática Exata */}
          {showMathFormula && (
            <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-[#A0A090] space-y-2">
              <div className="text-white font-bold flex items-center justify-between">
                <span>{uiLocale === 'pt-BR' ? 'FÓRMULA EXATA DE AUDITORIA:' : 'EXACT AUDIT MATHEMATICAL FORMULA:'}</span>
                <span className="text-[#0AE448]">{uiLocale === 'pt-BR' ? 'Fator Curva ABC: 65%' : 'ABC Curve Weight: 65%'}</span>
              </div>
              <div className="p-2.5 bg-[#0E100F] rounded-lg border border-white/5 text-slate-300">
                <code>
                  {uiLocale === 'pt-BR'
                    ? `Perda Anúncios = Investimento (${formatMoney(activeSpend)}) × Proporção de SKUs Rompidos (${brokenRatio.toFixed(3)}) × 0.65 = ${formatMoney(dynamicAdWaste)}/mês`
                    : `Ad Waste = Ad Spend (${formatMoney(activeSpend)}) × Broken SKU Ratio (${brokenRatio.toFixed(3)}) × 0.65 = ${formatMoney(dynamicAdWaste)}${monthSuffix}`}
                </code>
                <br />
                <code>
                  {uiLocale === 'pt-BR'
                    ? `Oportunidade Checkout (${localPaymentLabel}) = Atrito Checkout (${formatMoney(finances.financialRisk.checkoutFrictionMonthly)})/mês`
                    : `Checkout Opportunity (${localPaymentLabel}) = Checkout Friction (${formatMoney(finances.financialRisk.checkoutFrictionMonthly)})${monthSuffix}`}
                </code>
                <br />
                <code className={dynamicAdWaste > 0 ? "text-[#FF4757] font-bold" : "text-[#0AE448] font-bold"}>
                  {dynamicAdWaste > 0
                    ? (uiLocale === 'pt-BR' ? `Total em Risco de Mídia = ${formatMoney(dynamicAdWaste)}/mês` : `Total Media at Risk = ${formatMoney(dynamicAdWaste)}${monthSuffix}`)
                    : (uiLocale === 'pt-BR' ? `Risco em Mídia = ${formatMoney(0)} (Grade 100% Blindada)` : `Media at Risk = ${formatMoney(0)} (100% Shielded Grid)`)}
                </code>
              </div>
              <p className="text-[10px] text-[#7C7C6F] leading-relaxed">
                {uiLocale === 'pt-BR'
                  ? '*O fator de 65% reflete o benchmark de mercado onde os tamanhos centrais concentram dois terços das compras de vestuário. Quando esses tamanhos estão zerados, 65% dos cliques de anúncios são perdidos na página sem conversão.'
                  : '*The 65% factor reflects the industry benchmark where core sizes concentrate two-thirds of apparel orders. When these sizes are depleted, 65% of paid ad clicks bounce without converting.'}
              </p>
            </div>
          )}
        </div>

        <div className="p-3.5 bg-[#141716] rounded-xl border border-white/10 text-xs text-[#A0A090] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0AE448] shrink-0" />
            <span>
              <strong>{uiLocale === 'pt-BR' ? 'Origem Auditada do Cálculo:' : 'Audited Calculation Grounding:'}</strong>{' '}
              {uiLocale === 'pt-BR'
                ? finances.financialRisk.methodologyExplanation
                : brokenSkus.length === 0
                ? `Transparent calculation: 0 broken SKUs detected = ${formatMoney(0)} ad waste.${finances.financialRisk.checkoutFrictionMonthly > 0 ? ` Simulated checkout opportunity of ${formatMoney(finances.financialRisk.checkoutFrictionMonthly)}${monthSuffix} via ${localPaymentLabel}.` : ' Storefront and checkout 100% healthy.'}`
                : `Unified proportional calculation: ${brokenSkus.length} out-of-stock SKU(s) detected under ${formatMoney(activeSpend)}${monthSuffix} ad spend, resulting in ~${formatMoney(dynamicAdWaste)}${monthSuffix} in wasted clicks.${finances.financialRisk.checkoutFrictionMonthly > 0 ? ` Plus ${formatMoney(finances.financialRisk.checkoutFrictionMonthly)}${monthSuffix} checkout opportunity via ${localPaymentLabel}.` : ''}`}
            </span>
          </div>
          <span className="px-2 py-0.5 bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30 rounded text-[10px] font-mono font-bold shrink-0">
            {t.summary.liveDomAudited}
          </span>
        </div>
      </div>

      {/* 2. INVENTÁRIO EM RISCO */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141716] border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#00BAE2] font-mono block">
              {uiLocale === 'pt-BR'
                ? '2. Inventário em Risco no Meta & Google Ads'
                : uiLocale === 'de-DE'
                ? '2. Gefährdeter Bestand in Meta & Google Ads'
                : uiLocale === 'fr-FR'
                ? '2. Inventaire à Risque sur Meta & Google Ads'
                : uiLocale === 'es-ES'
                ? '2. Inventario en Riesgo en Meta y Google Ads'
                : '2. Inventory at Risk on Meta & Google Ads'}
            </span>
            <h3 className="text-xl font-bold text-[#FFFCE1]">
              {uiLocale === 'pt-BR'
                ? 'Quais produtos estão queimando anúncios agora?'
                : uiLocale === 'de-DE'
                ? 'Welche Produkte verbrennen gerade Werbebudget?'
                : uiLocale === 'fr-FR'
                ? 'Quels produits gaspillent le budget publicitaire ?'
                : uiLocale === 'es-ES'
                ? '¿Qué productos están quemando presupuesto de anuncios ahora?'
                : 'Which products are burning ad spend right now?'}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 bg-[#FF4757]/15 text-[#FF4757] rounded-full border border-[#FF4757]/30">
            {uiLocale === 'pt-BR'
              ? `${brokenSkus.length} produtos com ruptura na curva ABC`
              : `${brokenSkus.length} products with core ABC stockout`}
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
                        {skuItem.price && skuItem.price > 0 ? formatMoney(skuItem.price) : formatMoney(finances.groundedAverageTicket)}
                      </span>
                    </div>
                  </div>

                  {/* Missing sizes badge */}
                  <div className="p-2.5 bg-[#FF4757]/10 rounded-xl border border-[#FF4757]/20 text-xs space-y-1">
                    <span className="text-[10px] font-bold text-[#FF4757] uppercase font-mono flex items-center gap-1.5">
                      <AlertCircle className="w-3 h-3 text-[#FF4757] shrink-0" />
                      <span>{uiLocale === 'pt-BR' ? 'Variantes Esgotadas na Vitrine:' : 'Depleted Variants on Storefront:'}</span>
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {skuItem.missingSizes.map((sz, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-[#FF4757]/20 text-[#FF4757] text-[10px] font-black rounded border border-[#FF4757]/30">
                          {sz} ({uiLocale === 'pt-BR' ? 'Sem Estoque' : 'Out of Stock'})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#FF4757] font-bold font-mono">
                    {uiLocale === 'pt-BR' ? 'Perda Estimada' : 'Est. Loss'}: ~{formatMoney(Math.round(dynamicAdWaste / Math.max(1, brokenSkus.length)))}{monthSuffix}
                  </span>
                  <a
                    href={skuItem.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00BAE2] hover:text-[#FFFCE1] font-bold flex items-center gap-1 text-[11px] transition-colors"
                  >
                    <span>{uiLocale === 'pt-BR' ? 'Ver no site' : 'View live'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-[#0AE448]/10 border border-[#0AE448]/30 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#0AE448] mx-auto" />
            <h4 className="text-sm font-bold text-[#FFFCE1]">
              {uiLocale === 'pt-BR' ? 'Catálogo com Grade 100% Blindada!' : 'Catalog Size Grid 100% Shielded!'}
            </h4>
            <p className="text-xs text-[#0AE448]">
              {uiLocale === 'pt-BR'
                ? `Nenhum produto com anúncios ativos apresentou ruptura crítica nos tamanhos centrais. Recomendamos destacar incentivos de pagamento rápido via ${localPaymentLabel} acima da dobra.`
                : `No products with active ads showed critical stockouts in core sizes. We recommend highlighting express payment incentives (${localPaymentLabel}) above the fold.`}
            </p>
          </div>
        )}
      </div>

      {/* 3. PLANO DE AÇÃO IMEDIATA */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#141716] text-[#FFFCE1] border border-white/10 shadow-2xl space-y-6">
        <div className="space-y-2 border-b border-white/10 pb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0AE448] font-mono block">
            {uiLocale === 'pt-BR'
              ? '3. Plano de Ação Imediata & Blindagem 24h'
              : uiLocale === 'de-DE'
              ? '3. Sofortmaßnahmenplan & 24/7 Schutz'
              : uiLocale === 'fr-FR'
              ? "3. Plan d'Action Immédiat & Bouclier 24/7"
              : uiLocale === 'es-ES'
              ? '3. Plan de Acción Inmediata y Blindaje 24/7'
              : '3. Immediate Action Plan & 24/7 Shielding'}
          </span>
          <h3 className="text-2xl font-black text-[#FFFCE1]">
            {uiLocale === 'pt-BR'
              ? 'Como estancar essa sangria e recuperar as vendas perdidas?'
              : uiLocale === 'de-DE'
              ? 'Wie stoppen Sie diesen Werbeverlust und gewinnen verlorene Umsätze zurück?'
              : uiLocale === 'fr-FR'
              ? 'Comment stopper cette perte et récupérer les ventes manquées ?'
              : uiLocale === 'es-ES'
              ? '¿Cómo detener esta fuga y recuperar las ventas perdidas?'
              : 'How to stop this ad bleed and recover lost sales?'}
          </h3>
          <p className="text-xs text-[#BBBAA6] max-w-2xl leading-relaxed">
            {uiLocale === 'pt-BR'
              ? `Você pode ativar o monitoramento 24h para pausar anúncios no Meta Ads automaticamente quando o estoque zerar, otimizar a conversão à vista (${localPaymentLabel}) ou falar diretamente com nosso especialista.`
              : `You can activate 24/7 monitoring to automatically pause Meta Ads when core sizes sell out, optimize checkout conversion (${localPaymentLabel}), or speak directly with our specialist.`}
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
                <span className="text-[10px] text-[#0E100F]/80 uppercase tracking-wider font-mono block font-extrabold">
                  {uiLocale === 'pt-BR' ? 'Canal Direto' : 'Direct Channel'}
                </span>
                <span className="text-xs font-black text-[#0E100F]">
                  {uiLocale === 'pt-BR' ? 'Falar no WhatsApp' : 'Chat on WhatsApp'}
                </span>
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
                <span className="text-[10px] text-[#FF8709] uppercase tracking-wider font-mono block font-bold">
                  {uiLocale === 'pt-BR' ? 'Piloto Automático' : 'Autopilot'}
                </span>
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
                <span className="text-[10px] text-[#00BAE2] uppercase tracking-wider font-mono block">
                  {uiLocale === 'pt-BR' ? 'Monitoramento 24h' : '24/7 Monitoring'}
                </span>
                <span className="text-xs font-bold text-[#FFFCE1]">
                  {uiLocale === 'pt-BR' ? 'Ver Planos (R$ 297+)' : `${t.header.viewPlans} (${formatMoney(297)}+)`}
                </span>
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
            <span>
              {showAdvancedScripts
                ? (uiLocale === 'pt-BR' ? 'Ocultar script para o gestor de tráfego' : 'Hide media buyer alert script')
                : (uiLocale === 'pt-BR' ? 'Copiar script pronto para enviar ao seu gestor de tráfego' : 'Copy ready-to-send alert script for your media buyer')}
            </span>
            {showAdvancedScripts ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvancedScripts && (
            <div className="mt-3 p-4 bg-[#101211] rounded-2xl border border-white/10 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#7C7C6F]">
                  {uiLocale === 'pt-BR' ? 'Mensagem Formatada para WhatsApp / Slack:' : 'Formatted Message for WhatsApp / Slack:'}
                </span>
                <button
                  onClick={handleCopyTrafficScript}
                  className="px-3 py-1 bg-[#0AE448] hover:bg-[#09cb40] text-[#0E100F] text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-[#0E100F]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? (uiLocale === 'pt-BR' ? 'Copiado!' : 'Copied!') : (uiLocale === 'pt-BR' ? 'Copiar Script' : 'Copy Script')}</span>
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
