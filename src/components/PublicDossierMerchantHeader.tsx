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
  Zap,
  Check
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { calculateStoreFinancialGrounding } from '../services/ai/storeFinancialGroundingEngine';
import { getWhiteLabelConfig } from '../services/whiteLabelService';
import { useAuditStore } from '../store/auditStore';
import { WhatsAppIcon } from './common/WhatsAppIcon';
import { useTranslation } from '../i18n/useTranslation';

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
  const { uiLocale, formatMoney } = useTranslation();
  const isPt = uiLocale === 'pt-BR';
  const { realSiteData, growthScore, estimatedRevenueLiftMin, social } = diagnostic;
  const whiteLabel = getWhiteLabelConfig();
  const customMonthlyAdSpend = useAuditStore(state => state.customMonthlyAdSpend);

  const finances = calculateStoreFinancialGrounding(realSiteData, diagnostic.input, social, customMonthlyAdSpend);
  const brokenSkusCount = finances.brokenSkusCount;

  const cleanConsultantPhone = (whiteLabel.consultantWhatsApp || '5511999999999').replace(/\D/g, '');
  const phoneWithCountry = cleanConsultantPhone.startsWith('55') ? cleanConsultantPhone : `55${cleanConsultantPhone}`;

  const whatsappPitchUrl = `https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodeURIComponent(
    brokenSkusCount > 0
      ? (isPt
          ? `Olá! Vi o dossiê de auditoria da minha loja (${realSiteData.brandName}) no ${whiteLabel.agencyName || 'AdShield'} e quero entender como recuperar os ${finances.financialRisk.formattedAdWaste}/mês em risco por ruptura de grade nos anúncios.`
          : `Hi! I saw the audit dossier for my store (${realSiteData.brandName}) on ${whiteLabel.agencyName || 'AdShield'} and want to learn how to recover ${finances.financialRisk.formattedAdWaste}/mo at risk from broken size grids in active ads.`)
      : (isPt
          ? `Olá! Vi o dossiê de auditoria da minha loja (${realSiteData.brandName}) no ${whiteLabel.agencyName || 'AdShield'} e confirmei que nosso catálogo está 100% íntegro (${formatMoney(0)} em perda de anúncios). Gostaria de conhecer o monitoramento contínuo 24h para manter nossa operação blindada.`
          : `Hi! I saw the audit dossier for my store (${realSiteData.brandName}) on ${whiteLabel.agencyName || 'AdShield'} and confirmed our catalog is 100% intact (${formatMoney(0)} ad waste). I would like to learn about 24/7 continuous monitoring.`)
  )}`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#101211] border border-white/10 p-6 sm:p-8 text-[#FFFCE1] shadow-2xl animate-fadeIn font-sans">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-[#0AE448]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-rose-500/15 text-rose-300 border border-rose-500/30 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>{isPt ? 'Dossiê Confidencial de Auditoria' : 'Confidential Audit Dossier'}</span>
            </span>
            <span className="px-2.5 py-0.5 bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
              <Check className="w-3 h-3 text-[#0AE448]" />
              <span>{isPt ? 'Catálogo & Preços Auditados ao Vivo' : 'Catalog & Prices Audited Live'}</span>
            </span>
            <span className="px-2.5 py-0.5 bg-[#00BAE2]/15 text-[#00BAE2] border border-[#00BAE2]/30 rounded-full text-xs font-mono font-bold">
              {realSiteData.isMarketplaceSeller 
                ? (isPt ? `Loja Marketplace • ${realSiteData.ecommercePlatform}` : `Marketplace Store • ${realSiteData.ecommercePlatform}`)
                : (isPt ? `Simulação Dinâmica • ${finances.tierLabel}` : `Dynamic Simulation • ${finances.tierLabel}`)}
            </span>
          </div>

          <span className="text-xs text-[#BBBAA6] font-mono flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#BBBAA6]" />
            <span>{isPt ? 'Gerado hoje para a diretoria de' : 'Generated today for'} <strong className="text-[#FFFCE1]">{realSiteData.brandName}</strong></span>
          </span>
        </div>

        {/* Main Headline & Value Proposition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              {finances.financialRisk.adWasteMonthly > 0 ? (
                isPt ? (
                  <>
                    Identificamos <span className="text-rose-400 font-mono">{finances.financialRisk.formattedAdWaste}/mês</span> em risco nos anúncios da <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{realSiteData.brandName}</span>
                  </>
                ) : (
                  <>
                    We identified <span className="text-rose-400 font-mono">{finances.financialRisk.formattedAdWaste}/mo</span> at risk in active ads for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{realSiteData.brandName}</span>
                  </>
                )
              ) : (
                isPt ? (
                  <>
                    <span className="text-[#0AE448]">Grade Blindada!</span> {formatMoney(0)} de desperdício em anúncios para a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{realSiteData.brandName}</span>
                  </>
                ) : (
                  <>
                    <span className="text-[#0AE448]">Shielded Grid!</span> {formatMoney(0)} in ad waste for <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">{realSiteData.brandName}</span>
                  </>
                )
              )}
            </h1>
            
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              {realSiteData.isMarketplaceSeller ? (
                brokenSkusCount > 0 ? (
                  isPt ? (
                    <>
                      Nossa inteligência inspecionou a vitrine e o catálogo do vendedor <strong>{realSiteData.brandName}</strong> no marketplace <strong>{realSiteData.ecommercePlatform}</strong> {realSiteData.sellerIdentifier ? `(Seller ID: ${realSiteData.sellerIdentifier})` : ''} e detectou <strong>{brokenSkusCount} produto(s) com grade furada</strong> e atrito na conversão, calculando o risco com base no ticket médio auditado de <strong>{finances.formattedAverageTicket}</strong>.
                    </>
                  ) : (
                    <>
                      Our intelligence inspected the storefront and catalog of seller <strong>{realSiteData.brandName}</strong> on marketplace <strong>{realSiteData.ecommercePlatform}</strong> {realSiteData.sellerIdentifier ? `(Seller ID: ${realSiteData.sellerIdentifier})` : ''} and detected <strong>{brokenSkusCount} product(s) with broken size grids</strong> and conversion friction, calculating risk from the audited AOV of <strong>{finances.formattedAverageTicket}</strong>.
                    </>
                  )
                ) : (
                  isPt ? (
                    <>
                      Nossa inteligência inspecionou a vitrine do vendedor <strong>{realSiteData.brandName}</strong> no marketplace <strong>{realSiteData.ecommercePlatform}</strong> e confirmou <strong>100% de disponibilidade nas grades auditadas</strong> (0 rupturas com tráfego).
                    </>
                  ) : (
                    <>
                      Our intelligence inspected the storefront of seller <strong>{realSiteData.brandName}</strong> on marketplace <strong>{realSiteData.ecommercePlatform}</strong> and confirmed <strong>100% availability across audited grids</strong> (0 stockouts with paid traffic).
                    </>
                  )
                )
              ) : (
                brokenSkusCount > 0 ? (
                  isPt ? (
                    <>
                      Nossa inteligência inspecionou o catálogo público de <strong>{realSiteData.domain}</strong> e detectou <strong>{brokenSkusCount} produto(s) com grade furada</strong> e fuga no checkout, calculando o risco com base no ticket médio auditado de <strong>{finances.formattedAverageTicket}</strong>.
                    </>
                  ) : (
                    <>
                      Our intelligence inspected the public catalog of <strong>{realSiteData.domain}</strong> and detected <strong>{brokenSkusCount} product(s) with broken size grids</strong> and checkout friction, calculating risk from the audited AOV of <strong>{finances.formattedAverageTicket}</strong>.
                    </>
                  )
                ) : (
                  isPt ? (
                    <>
                      Nossa inteligência inspecionou o catálogo público de <strong>{realSiteData.domain}</strong> e comprovou <strong>100% de integridade na grade</strong> (0 rupturas comprovadas). {finances.financialRisk.checkoutFrictionMonthly > 0 ? `Identificamos apenas uma oportunidade simulada de otimização de margem no checkout (${finances.financialRisk.formattedCheckoutFriction}/mês via incentivo ao Pix).` : 'Vitrine e campanhas 100% blindadas contra queima de verba.'}
                    </>
                  ) : (
                    <>
                      Our intelligence inspected the public catalog of <strong>{realSiteData.domain}</strong> and verified <strong>100% size grid integrity</strong> (0 verified stockouts). {finances.financialRisk.checkoutFrictionMonthly > 0 ? `We identified only a simulated checkout optimization opportunity (${finances.financialRisk.formattedCheckoutFriction}/mo).` : 'Storefront and campaigns are 100% shielded against ad waste.'}
                    </>
                  )
                )
              )}
            </p>

            <div className="p-2.5 bg-[#141716] rounded-xl border border-white/10 text-[11px] text-[#BBBAA6] flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0AE448] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#FFFCE1]">{isPt ? 'Protocolo de Transparência:' : 'Transparency Protocol:'}</strong>{' '}
                {isPt
                  ? 'Preços e estoque são dados reais extraídos do DOM. Valores de faturamento e verba de mídia são simulações projetadas pelo porte do nicho.'
                  : 'Prices and stock are live facts extracted from the DOM. Revenue and ad spend figures are market-tier benchmark simulations.'}
              </span>
            </div>
          </div>

          {/* Quick Score and Lift Metric */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3 p-4 bg-[#141716] backdrop-blur-md rounded-2xl border border-white/10 text-center">
            <div className="p-3 bg-[#0E100F] rounded-xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">{isPt ? 'Score Atual' : 'Current Score'}</span>
              <span className="text-2xl font-black text-amber-400 font-mono">{growthScore}/100</span>
              <span className={`text-[10px] block font-medium ${growthScore >= 80 ? 'text-[#0AE448]' : 'text-amber-300'}`}>
                {growthScore >= 80 ? (isPt ? 'Catálogo Blindado' : 'Shielded Catalog') : (isPt ? 'Requer Ajustes' : 'Needs Tuning')}
              </span>
            </div>

            <div className="p-3 bg-[#0AE448]/10 rounded-xl border border-[#0AE448]/30 text-[#0AE448]">
              <span className="text-[10px] uppercase font-bold text-[#0AE448] font-mono block">{isPt ? 'Recuperação' : 'Recovery'}</span>
              <span className="text-2xl font-black text-[#0AE448] font-mono">+{estimatedRevenueLiftMin}%</span>
              <span className="text-[10px] text-[#FFFCE1] block font-medium">{isPt ? 'Lucro Líquido' : 'Net Margin'}</span>
            </div>
          </div>

        </div>

        {/* Call-to-Action Bar (Irresistible Merchant Buttons) */}
        <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/15 text-[#0AE448] rounded-xl border border-[#0AE448]/30 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#FFFCE1]">
                {isPt ? 'Pronto para blindar seu catálogo e recuperar as vendas perdidas?' : 'Ready to shield your catalog and recover lost revenue?'}
              </p>
              <p className="text-[11px] text-[#BBBAA6]">
                {isPt ? 'Receba o Raio-X no seu WhatsApp ou ative o monitoramento 24h.' : 'Receive the X-Ray on WhatsApp or activate 24/7 monitoring.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onOpenPricing}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] rounded-xl text-xs font-bold transition-all border border-white/10 cursor-pointer w-full sm:w-auto text-center"
            >
              <span>{isPt ? 'Ver Planos (R$ 297/mês)' : `View Plans (${formatMoney(297)}/mo)`}</span>
            </button>

            <button
              onClick={onOpenWhatsApp}
              className="px-5 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs transition-all shadow-lg shadow-[#0AE448]/20 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto text-center"
            >
              <WhatsAppIcon className="w-4 h-4 text-slate-950 shrink-0" />
              <span>{isPt ? 'Receber Raio-X no WhatsApp' : 'Get X-Ray via WhatsApp'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>

            <a
              href={whatsappPitchUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-[#101211] hover:bg-white/5 text-[#0AE448] border border-[#0AE448]/30 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto text-center"
            >
              <span>{isPt ? 'Falar com Especialista' : 'Talk to a Specialist'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
