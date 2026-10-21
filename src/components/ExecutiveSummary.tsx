import React, { useState, useRef, useEffect } from 'react';
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
  Zap,
  Download
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { generateShopifyTelemetryAnalysis } from '../services/shopifyTelemetryService';
import { isCatalogProductBroken } from '../services/siteInspector';
import { calculateStoreFinancialGrounding } from '../services/ai/storeFinancialGroundingEngine';
import { AuditScoreEvolutionTimeline } from './history/AuditScoreEvolutionTimeline';
import { OneClickMitigationService } from '../services/actions/oneClickMitigationService';
import { PdfExportService } from '../services/export/pdfExportService';
import { useAuditStore } from '../store/auditStore';

interface ExecutiveSummaryProps {
  diagnostic: AgentDiagnosticResult;
  onSelectAgentTab: (tabId: string) => void;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ diagnostic, onSelectAgentTab }) => {
  const { growthScore, estimatedRevenueLiftMin, estimatedRevenueLiftMax, realSiteData, visionAnalysis, social } = diagnostic;
  const customMonthlyAdSpend = useAuditStore(state => state.customMonthlyAdSpend);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const downloadTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
    };
  }, []);

  const finances = calculateStoreFinancialGrounding(realSiteData, diagnostic.input, social, customMonthlyAdSpend);

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
  const brokenGridCount = realSiteData.catalogAudit?.productsWithBrokenGrid || catalogIssues.filter(isCatalogProductBroken).length;
  const shopSlug = OneClickMitigationService.getShopSlug(realSiteData.domain);

  return (
    <div className="space-y-6 text-[#FFFCE1]">

      {/* STORE OVERVIEW & AUDIT GROUNDING BAR */}
      <div className="p-5 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-[#141716] to-[#191C1B] text-[#0AE448] rounded-2xl border border-white/10 shadow-md">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-[#FFFCE1] font-mono tracking-tight">
                {realSiteData.brandName || 'LOJA AUDITADA'}
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-[#0AE448]/20 text-[#0AE448] rounded-full border border-[#0AE448]/30 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" />
                DOM Auditado ao Vivo
              </span>
              {realSiteData.isMarketplaceSeller ? (
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-orange-500/20 text-orange-400 rounded-md border border-orange-500/30 inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" />
                  {realSiteData.ecommercePlatform} Seller: {realSiteData.sellerIdentifier || realSiteData.brandName}
                </span>
              ) : (
                <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md border inline-flex items-center gap-1 ${
                  realSiteData.ecommercePlatform === 'Shopify' ? 'bg-[#0AE448]/20 text-[#0AE448] border-[#0AE448]/30' :
                  realSiteData.ecommercePlatform === 'Tray' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  realSiteData.ecommercePlatform === 'Nuvemshop' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                  realSiteData.ecommercePlatform === 'VTEX' ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' :
                  'bg-white/10 text-[#BBBAA6] border-white/15'
                }`}>
                  CMS: {realSiteData.ecommercePlatform || 'E-Commerce'}
                </span>
              )}
              {realSiteData.googleShoppingShield && realSiteData.googleShoppingShield.discrepantProductsCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30 inline-flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  Google Shopping: {realSiteData.googleShoppingShield.discrepantProductsCount} Schema OutOfStock
                </span>
              )}
              {realSiteData.legalCompliance && (
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md border inline-flex items-center gap-1 ${
                  realSiteData.legalCompliance.isFullyCompliant ? 'bg-[#0AE448]/20 text-[#0AE448] border-[#0AE448]/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                }`}>
                  <ShieldCheck className="w-3 h-3" />
                  {realSiteData.legalCompliance.cnpjFound ? `CNPJ: ${realSiteData.legalCompliance.cnpjFound}` : 'Sem CNPJ no Rodapé'}
                </span>
              )}
            </div>
            <p className="text-xs text-[#BBBAA6] mt-0.5">
              {realSiteData.isMarketplaceSeller 
                ? `Auditoria de Seller em Marketplace: SEO de título, ficha técnica, Buy Box e conformidade algorítmica na ${realSiteData.ecommercePlatform}.`
                : 'Auditoria profunda de catálogo, imagens, grade de tamanhos e integridade de checkout.'}
            </p>
          </div>
        </div>

        {/* Quick Links & Direct Admin Button */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-start lg:justify-end flex-wrap">
          {!realSiteData.isMarketplaceSeller && shopSlug && (
            <a
              href={`https://admin.shopify.com/store/${shopSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 bg-[#141716] hover:bg-[#191C1B] text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-xs hover:border-[#0AE448]/40 cursor-pointer"
              title="Abrir painel administrativo da Shopify desta loja"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#0AE448]" />
              <span>Shopify Admin ({shopSlug})</span>
            </a>
          )}
          {realSiteData.isMarketplaceSeller && (
            <span className="px-3 py-2 bg-[#141716] text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />
              <span>Seller Oficial ({realSiteData.sellerIdentifier || realSiteData.brandName})</span>
            </span>
          )}
          <button
            onClick={async () => {
              setIsDownloadingPdf(true);
              try {
                await PdfExportService.downloadExecutivePdf(diagnostic);
                setDownloadSuccess(true);
                if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
                downloadTimerRef.current = setTimeout(() => setDownloadSuccess(false), 3000);
              } catch (err) {
                console.error('Erro ao baixar dossiê:', err);
              } finally {
                setIsDownloadingPdf(false);
              }
            }}
            disabled={isDownloadingPdf}
            className="px-3.5 py-2 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-[#0AE448]/20 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
            title="Baixar Relatório Executivo Oficial em PDF com 1 clique"
          >
            {isDownloadingPdf ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Gerando PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Dossiê Baixado!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-slate-950" />
                <span>Baixar Dossiê PDF</span>
              </>
            )}
          </button>

          <a
            href={realSiteData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Abrir vitrine da loja em nova aba"
          >
            <span>{realSiteData.isMarketplaceSeller ? `Ver Anúncio na ${realSiteData.ecommercePlatform}` : 'Ver Loja'}</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* STRIP DE METRICAS OPERACIONAIS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        
        {/* 1. Confecção Própria PCP */}
        <div className="p-3.5 bg-[#141716] border border-white/10 rounded-2xl space-y-1 shadow-md">
          <div className="flex items-center justify-between text-[#BBBAA6]">
            <span className="font-mono text-[10px] uppercase font-bold flex items-center gap-1">
              <Factory className="w-3.5 h-3.5 text-[#00BAE2]" /> Própria (PCP)
            </span>
            <span className="text-[10px] font-bold text-[#00BAE2]">Sublimação</span>
          </div>
          <p className="text-xl font-black font-mono text-[#FFFCE1]">{inHouseCount} SKUs</p>
          <p className="text-[10px] text-[#BBBAA6]">Costura sob demanda</p>
        </div>

        {/* 2. Revenda Externa */}
        <div className="p-3.5 bg-[#141716] border border-white/10 rounded-2xl space-y-1 shadow-md">
          <div className="flex items-center justify-between text-[#BBBAA6]">
            <span className="font-mono text-[10px] uppercase font-bold flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" /> Revenda Externa
            </span>
            <span className="text-[10px] font-bold text-amber-400">Compras</span>
          </div>
          <p className="text-xl font-black font-mono text-[#FFFCE1]">{resaleCount} SKUs</p>
          <p className="text-[10px] text-[#BBBAA6]">Botão, calçados, bonés</p>
        </div>

        {/* 3. Isenção Regra _FULL */}
        <div className="p-3.5 bg-[#141716] border border-white/10 rounded-2xl space-y-1 shadow-md">
          <div className="flex items-center justify-between text-[#BBBAA6]">
            <span className="font-mono text-[10px] uppercase font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" /> Regra _FULL
            </span>
            <span className="text-[10px] font-bold text-[#0AE448]">Isentos</span>
          </div>
          <p className="text-xl font-black font-mono text-[#0AE448]">{fullExemptCount} SKUs</p>
          <p className="text-[10px] text-[#BBBAA6]">Zero falso-positivo</p>
        </div>

        {/* 4. Sensor de Imagens */}
        <div className={`p-3.5 border rounded-2xl space-y-1 shadow-md ${
          missingImagesCount > 0 
            ? 'bg-rose-500/10 border-rose-500/30' 
            : 'bg-[#141716] border-white/10'
        }`}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase font-bold flex items-center gap-1 text-[#BBBAA6]">
              {missingImagesCount > 0 ? (
                <ImageOff className="w-3.5 h-3.5 text-rose-400" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" />
              )}
              Sensor de Imagens
            </span>
            <span className={`text-[10px] font-bold ${missingImagesCount > 0 ? 'text-rose-400' : 'text-[#0AE448]'}`}>
              {missingImagesCount > 0 ? 'Crítico' : '100% OK'}
            </span>
          </div>
          <p className={`text-xl font-black font-mono ${missingImagesCount > 0 ? 'text-rose-400' : 'text-[#FFFCE1]'}`}>
            {missingImagesCount > 0 ? `${missingImagesCount} Sem Foto` : 'Zero Quebradas'}
          </p>
          <p className={`text-[10px] ${missingImagesCount > 0 ? 'text-rose-400 font-bold' : 'text-[#BBBAA6]'}`}>
            {missingImagesCount > 0 ? 'Requer inativação imediata' : 'Todas fotos ativas'}
          </p>
        </div>

      </div>
      
      {/* Top Banner with Real Site Code Inspection & Speed Badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-medium">
        
        {/* Growth Score Badge Card */}
        <div className="p-5 rounded-2xl bg-[#101211] border border-white/10 shadow-2xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#BBBAA6] font-mono">AdShield Score</span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#0AE448]/20 text-[#0AE448] rounded-full border border-[#0AE448]/30">
              Auditado
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black font-mono text-[#FFFCE1] tracking-tight">{growthScore}</span>
            <span className="text-lg font-bold text-slate-500">/ 100</span>
          </div>

          <div className="w-full bg-[#191C1B] h-2 rounded-full overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-[#0AE448] to-[#00BAE2] h-full rounded-full transition-all duration-1000"
              style={{ width: `${growthScore}%` }}
            />
          </div>

          <p className="text-[11px] text-[#BBBAA6] leading-relaxed font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Oportunidades em <strong className="font-mono text-white">{realSiteData.domain}</strong></span>
          </p>
        </div>

        {/* Revenue Lift Projection Card */}
        <div className="p-5 rounded-2xl bg-[#101211] border border-white/10 shadow-2xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0AE448] font-mono">Projeção Lift</span>
            <div className="p-1.5 bg-[#0AE448]/10 text-[#0AE448] rounded-xl border border-[#0AE448]/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div>
            <span className="text-3xl font-black font-mono text-[#0AE448] tracking-tight">+{estimatedRevenueLiftMin}% a +{estimatedRevenueLiftMax}%</span>
            <p className="text-[11px] text-[#BBBAA6] mt-1 font-medium">
              Projeção de recuperação de receita corrigindo os gargalos de catálogo e checkout.
            </p>
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#BBBAA6]">
              <span className="w-14">Otimista</span>
              <div className="flex-1 bg-[#191C1B] h-1.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-[#0AE448] h-full rounded-full" style={{ width: '85%' }} />
              </div>
              <span className="text-[#0AE448] font-bold">+{estimatedRevenueLiftMax}%</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#BBBAA6]">
              <span className="w-14">Realista</span>
              <div className="flex-1 bg-[#191C1B] h-1.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-[#00BAE2] h-full rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-[#00BAE2] font-bold">+{estimatedRevenueLiftMin}%</span>
            </div>
          </div>
        </div>

        {/* Computer Vision & Heatmap Card */}
        <div className="p-5 rounded-2xl bg-[#101211] border border-white/10 shadow-2xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#00BAE2] font-mono flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#00BAE2]" /> Visão IA
            </span>
            <div className="p-1.5 bg-[#00BAE2]/10 text-[#00BAE2] rounded-xl border border-[#00BAE2]/20">
              <Eye className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1.5 bg-[#141716] p-3 rounded-xl border border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#BBBAA6] font-medium">Foco no CTA:</span>
              <span className={`font-mono font-bold ${visionAnalysis.eyeTracking.focusScoreCta >= 70 ? 'text-[#0AE448]' : 'text-amber-400'}`}>
                {visionAnalysis.eyeTracking.focusScoreCta}%
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#BBBAA6] font-medium">Contraste:</span>
              <span className="font-mono font-bold text-white flex items-center gap-1">
                {visionAnalysis.contrastAudit.contrastRatio}:1
                {visionAnalysis.contrastAudit.wcagAaPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448] inline" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 inline" />
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#BBBAA6] font-medium">Ímã Visual:</span>
              <span className="font-bold text-rose-400 truncate max-w-[120px] flex items-center gap-1">
                <Flame className="w-3 h-3 shrink-0" /> {visionAnalysis.eyeTracking.mainFocusElement}
              </span>
            </div>
          </div>

          <button
            onClick={() => onSelectAgentTab('vision')}
            className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <span>Ver Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0AE448]" />
          </button>
        </div>

        {/* Shopify Telemetry & Ad Waste Benchmark Card */}
        <div className="p-5 rounded-2xl bg-[#101211] border border-white/10 shadow-2xl space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-rose-400" /> Sangria Estimada
            </span>
            <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-md">
              Benchmark Nicho
            </span>
          </div>

          <div>
            {finances.financialRisk.adWasteMonthly > 0 ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black font-mono text-rose-400 tracking-tight">
                    ~{finances.financialRisk.formattedAdWaste}
                  </span>
                  <span className="text-xs text-[#BBBAA6] font-mono">/ mês</span>
                </div>
                <p className="text-[10px] text-[#BBBAA6] mt-1 leading-relaxed">
                  Projeção estatística: ~65% dos cliques desperdiçados nos {finances.brokenSkusCount} SKU(s) sem grade central.
                </p>
              </>
            ) : (
              <>
                <span className="text-2xl font-black font-mono text-[#0AE448] tracking-tight">
                  Grade Blindada (R$ 0)
                </span>
                <p className="text-[11px] text-[#0AE448] mt-0.5 font-medium">
                  Catálogo 100% íntegro. Zero desperdício em anúncios de produtos rompidos.
                </p>
              </>
            )}
          </div>

          <button
            onClick={() => onSelectAgentTab('telemetry')}
            className={`w-full py-2 px-3 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border ${
              finances.financialRisk.adWasteMonthly > 0
                ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/30'
                : 'bg-[#0AE448]/15 hover:bg-[#0AE448]/25 text-[#0AE448] border-[#0AE448]/30'
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
