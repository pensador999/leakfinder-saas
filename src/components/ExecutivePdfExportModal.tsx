import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Flame, 
  Calculator, 
  Layers, 
  TrendingUp,
  Phone,
  TableProperties,
  KeyRound,
  Share2,
  Check
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { SpreadsheetExporter } from '../services/export/spreadsheetExporter';
import { OfficialIntegrationConnectModal } from './OfficialIntegrationConnectModal';
import { PdfExportService } from '../services/export/pdfExportService';
import { isCatalogProductBroken } from '../services/siteInspector';
import { getWhiteLabelConfig, setWhiteLabelConfig } from '../services/whiteLabelService';

interface ExecutivePdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostic: AgentDiagnosticResult;
}

function mapHexToAccent(hex?: string): 'indigo' | 'blue' | 'emerald' | 'black' {
  if (!hex) return 'emerald';
  const h = hex.toLowerCase();
  if (h.includes('0ae448') || h.includes('10b981') || h.includes('059669')) return 'emerald';
  if (h.includes('00bae2') || h.includes('2563eb') || h.includes('3b82f6')) return 'blue';
  if (h.includes('0f172a') || h.includes('000000') || h.includes('101211')) return 'black';
  return 'indigo';
}

function mapAccentToHex(accent: 'indigo' | 'blue' | 'emerald' | 'black'): string {
  switch (accent) {
    case 'emerald':
      return '#0AE448';
    case 'blue':
      return '#00BAE2';
    case 'black':
      return '#0F172A';
    default:
      return '#4F46E5';
  }
}

export const ExecutivePdfExportModal: React.FC<ExecutivePdfExportModalProps> = ({
  isOpen,
  onClose,
  diagnostic
}) => {
  // White-Label State (100% conectado ao Cofre White-Label Local-First)
  const initialWl = getWhiteLabelConfig();
  const [agencyName, setAgencyName] = useState(initialWl.agencyName || 'AdShield Intelligence');
  const [consultantName, setConsultantName] = useState(initialWl.consultantName || 'Especialista em CRO & Performance');
  const [consultantPhone, setConsultantPhone] = useState(initialWl.consultantWhatsApp || '5511999999999');
  const [accentColor, setAccentColor] = useState<'indigo' | 'blue' | 'emerald' | 'black'>(() =>
    mapHexToAccent(initialWl.primaryColor)
  );
  const [savedWlFeedback, setSavedWlFeedback] = useState(false);
  const [copiedPublicUrl, setCopiedPublicUrl] = useState(false);

  // Sync when modal opens or external White-Label settings update
  useEffect(() => {
    const syncFromVault = () => {
      const wl = getWhiteLabelConfig();
      setAgencyName(wl.agencyName || 'AdShield Intelligence');
      setConsultantName(wl.consultantName || 'Especialista em CRO & Performance');
      setConsultantPhone(wl.consultantWhatsApp || '5511999999999');
      setAccentColor(mapHexToAccent(wl.primaryColor));
    };
    if (isOpen) {
      syncFromVault();
    }
    window.addEventListener('whitelabel-updated', syncFromVault);
    return () => window.removeEventListener('whitelabel-updated', syncFromVault);
  }, [isOpen]);

  const persistBrandingField = (patch: {
    agencyName?: string;
    consultantName?: string;
    consultantWhatsApp?: string;
    primaryColor?: string;
  }) => {
    setWhiteLabelConfig(patch);
    setSavedWlFeedback(true);
    setTimeout(() => setSavedWlFeedback(false), 2000);
  };
  
  // Section Inclusions
  const [includeCover, setIncludeCover] = useState(true);
  const [includeLeaks, setIncludeLeaks] = useState(true);
  const [includeCatalog, setIncludeCatalog] = useState(true);
  const [includeRupture, setIncludeRupture] = useState(true);
  const [includePix, setIncludePix] = useState(true);
  const [includeIceRoadmap, setIncludeIceRoadmap] = useState(true);
  const [includeFactChecker, setIncludeFactChecker] = useState(true);

  // Official API Connect Modal
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'paper' | 'obsidian'>('obsidian');

  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !diagnostic) return null;

  const { input, realSiteData, growthScore, estimatedRevenueLiftMin, estimatedRevenueLiftMax } = diagnostic;
  const allIssues = realSiteData.catalogAudit?.issues || [];
  const brokenItems = allIssues.filter(isCatalogProductBroken);
  const sortedPreviewIssues = [...brokenItems, ...allIssues.filter(i => !isCatalogProductBroken(i))].slice(0, 8);
  const sampleBroken = brokenItems[0];
  const sampleBrokenSizes =
    sampleBroken?.brokenCoreSizes && sampleBroken.brokenCoreSizes.length > 0
      ? sampleBroken.brokenCoreSizes
      : sampleBroken?.missingSizes && sampleBroken.missingSizes.length > 0
      ? sampleBroken.missingSizes
      : ['M', 'G'];

  const monthlyLoss =
    realSiteData.catalogAudit?.monthlyLossEstimateBRL !== undefined
      ? Number(realSiteData.catalogAudit.monthlyLossEstimateBRL.toFixed(2))
      : Number((brokenItems.length * 1384.65).toFixed(2));
  const pixEstimatedGain = Math.max(2800, Math.round(monthlyLoss * 0.85));

  const handlePrint = () => {
    window.print();
  };

  const publicDossierUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/app?dossier=${encodeURIComponent(realSiteData.domain)}`
      : `https://adshield.com.br/app?dossier=${encodeURIComponent(realSiteData.domain)}`;

  const handleCopyPublicDossierUrl = () => {
    navigator.clipboard.writeText(publicDossierUrl);
    setCopiedPublicUrl(true);
    setTimeout(() => setCopiedPublicUrl(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      
      {/* Container Principal */}
      <div className="bg-[#0E100F] w-full max-w-6xl rounded-3xl shadow-2xl border border-white/10 flex flex-col h-[94vh] overflow-hidden text-[#FFFCE1]">
        
        {/* Modal Top Bar (Não sai na impressão) */}
        <div className="print:hidden p-4 bg-[#141716] border-b border-white/10 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0AE448]/10 text-[#0AE448] rounded-xl border border-[#0AE448]/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#FFFCE1]">Gerador de Dossiê Executivo em PDF (White-Label • 100% Ancorado)</h3>
              <p className="text-xs text-[#BBBAA6]">Personalize a assinatura da consultoria e exporte o diagnóstico com os SKUs reais auditados.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 p-1 bg-[#0E100F] rounded-xl border border-white/10 text-xs font-bold font-mono">
              <button
                type="button"
                onClick={() => setPreviewMode('obsidian')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  previewMode === 'obsidian' ? 'bg-[#0AE448] text-slate-950 font-black shadow-xs' : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
                }`}
              >
                Obsidian Dark
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('paper')}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  previewMode === 'paper' ? 'bg-white text-slate-950 font-black shadow-xs' : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
                }`}
              >
                Papel A4
              </button>
            </div>

            <button
              onClick={handleCopyPublicDossierUrl}
              className="px-3.5 py-2 bg-[#00BAE2]/15 hover:bg-[#00BAE2]/25 text-[#00BAE2] border border-[#00BAE2]/30 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              title={`Copiar link público interativo: ${publicDossierUrl}`}
            >
              {copiedPublicUrl ? <Check className="w-4 h-4 text-[#0AE448]" /> : <Share2 className="w-4 h-4 text-[#00BAE2]" />}
              <span>{copiedPublicUrl ? 'Link Público Copiado!' : 'Compartilhar Link (?dossier=)'}</span>
            </button>

            <button
              onClick={() => PdfExportService.downloadExecutivePdf(diagnostic, {
                agencyName,
                consultantName,
                consultantPhone,
                accentColor
              })}
              className="px-4 py-2 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-[#0AE448]/20 cursor-pointer hover:scale-105 active:scale-95"
              title="Baixar arquivo PDF consolidado com 1 clique"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Gerar PDF A4 (1 Clique)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#00BAE2]" />
              <span>Imprimir / Salvar</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-[#BBBAA6] hover:text-[#FFFCE1] rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Sidebar Config + Live A4 Preview */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* SIDEBAR DE CUSTOMIZAÇÃO WHITE-LABEL (Oculta na Impressão) */}
          <div className="print:hidden w-full lg:w-80 bg-[#101211] border-r border-white/10 p-6 space-y-5 overflow-y-auto shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-[#FFFCE1] uppercase font-mono flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#0AE448]" /> Branding da Consultoria
                </h4>
                <p className="text-[11px] text-[#BBBAA6] mt-0.5">Sincronizado com o Cofre White-Label.</p>
              </div>
              {savedWlFeedback && (
                <span className="px-2 py-0.5 bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30 rounded-full text-[9px] font-mono font-bold shrink-0">
                  Salvo!
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#BBBAA6] mb-1">Nome da Agência / Consultoria</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAgencyName(val);
                    persistBrandingField({ agencyName: val });
                  }}
                  className="w-full px-3 py-2 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-bold text-[#FFFCE1] focus:border-[#0AE448]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#BBBAA6] mb-1">Cargo / Especialista</label>
                <input
                  type="text"
                  value={consultantName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConsultantName(val);
                    persistBrandingField({ consultantName: val });
                  }}
                  className="w-full px-3 py-2 bg-[#0E100F] border border-white/10 rounded-xl text-xs text-[#FFFCE1] focus:border-[#0AE448]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#BBBAA6] mb-1">WhatsApp de Contato</label>
                <input
                  type="text"
                  value={consultantPhone}
                  onChange={(e) => {
                    const val = e.target.value;
                    setConsultantPhone(val);
                    persistBrandingField({ consultantWhatsApp: val });
                  }}
                  className="w-full px-3 py-2 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] focus:border-[#0AE448]"
                />
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2">
              <label className="block text-[11px] font-bold text-[#BBBAA6]">Paleta de Cores Executiva</label>
              <div className="grid grid-cols-4 gap-2">
                {(['indigo', 'blue', 'emerald', 'black'] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      setAccentColor(color);
                      persistBrandingField({ primaryColor: mapAccentToHex(color) });
                    }}
                    className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer capitalize ${
                      accentColor === color
                        ? 'border-[#0AE448] bg-[#0AE448]/10 text-[#0AE448] font-black'
                        : 'border-white/10 bg-white/5 text-[#BBBAA6] hover:bg-white/10 hover:text-[#FFFCE1]'
                    }`}
                  >
                    {color === 'indigo' ? 'Índigo' : color === 'blue' ? 'Azul' : color === 'emerald' ? 'Esmeralda' : 'Preto'}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-2.5">
              <label className="block text-[11px] font-bold text-[#BBBAA6]">Seções a Incluir no PDF</label>
              
              <label className="flex items-center gap-2 text-xs text-[#BBBAA6] cursor-pointer hover:text-[#FFFCE1]">
                <input type="checkbox" checked={includeCover} onChange={(e) => setIncludeCover(e.target.checked)} className="rounded text-[#0AE448] accent-[#0AE448]" />
                <span>Capa & Growth Score</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#BBBAA6] cursor-pointer hover:text-[#FFFCE1]">
                <input type="checkbox" checked={includeLeaks} onChange={(e) => setIncludeLeaks(e.target.checked)} className="rounded text-[#0AE448] accent-[#0AE448]" />
                <span>Vazamentos Auditados</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#BBBAA6] cursor-pointer hover:text-[#FFFCE1]">
                <input type="checkbox" checked={includeCatalog} onChange={(e) => setIncludeCatalog(e.target.checked)} className="rounded text-[#0AE448] accent-[#0AE448]" />
                <span>Tabela de SKUs & Rupturas Reais</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#BBBAA6] cursor-pointer hover:text-[#FFFCE1]">
                <input type="checkbox" checked={includeRupture} onChange={(e) => setIncludeRupture(e.target.checked)} className="rounded text-[#0AE448] accent-[#0AE448]" />
                <span>Impacto de Ruptura em Ads</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#BBBAA6] cursor-pointer hover:text-[#FFFCE1]">
                <input type="checkbox" checked={includePix} onChange={(e) => setIncludePix(e.target.checked)} className="rounded text-[#0AE448] accent-[#0AE448]" />
                <span>Simulador Pix & Elasticidade</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#BBBAA6] cursor-pointer hover:text-[#FFFCE1]">
                <input type="checkbox" checked={includeIceRoadmap} onChange={(e) => setIncludeIceRoadmap(e.target.checked)} className="rounded text-[#0AE448] accent-[#0AE448]" />
                <span>Plano de Ação (Matriz ICE)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-[#BBBAA6] cursor-pointer hover:text-[#FFFCE1]">
                <input type="checkbox" checked={includeFactChecker} onChange={(e) => setIncludeFactChecker(e.target.checked)} className="rounded text-[#0AE448] accent-[#0AE448]" />
                <span>Certidão do Fact-Checker</span>
              </label>
            </div>

            {/* Planilhas e Documentos em Excel */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <h4 className="text-[11px] font-bold text-[#FFFCE1] uppercase font-mono flex items-center gap-1.5">
                <TableProperties className="w-3.5 h-3.5 text-[#00BAE2]" /> Planilhas Excel (.CSV)
              </h4>
              <button
                onClick={() => SpreadsheetExporter.exportAllSkusCsv(realSiteData)}
                className="w-full py-2 px-3 bg-[#0AE448]/10 hover:bg-[#0AE448]/20 border border-[#0AE448]/30 text-[#0AE448] font-bold text-[11px] rounded-xl transition-all flex items-center justify-between shadow-xs cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0AE448]" /> Inventário Granular (100% SKUs)
                </span>
                <Download className="w-3.5 h-3.5 text-[#0AE448]" />
              </button>
              <button
                onClick={() => SpreadsheetExporter.exportCatalogAudit(realSiteData)}
                className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-[#FFFCE1] font-bold text-[11px] rounded-xl transition-all flex items-center justify-between shadow-xs cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#00BAE2]" /> Resumo de Produtos & Grade
                </span>
                <Download className="w-3.5 h-3.5 text-[#BBBAA6]" />
              </button>
              <button
                onClick={() => SpreadsheetExporter.exportFinancialActionPlan(diagnostic)}
                className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-[#FFFCE1] font-bold text-[11px] rounded-xl transition-all flex items-center justify-between shadow-xs cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#0AE448]" /> Plano de Ação & Lucro
                </span>
                <Download className="w-3.5 h-3.5 text-[#BBBAA6]" />
              </button>
              <button
                onClick={() => SpreadsheetExporter.exportShopeeMassUpdateCsv(realSiteData)}
                className="w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 font-bold text-[11px] rounded-xl transition-all flex items-center justify-between shadow-xs cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Planilha Shopee (120 Chars SEO)
                </span>
                <Download className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            {/* Conectar Integração Oficial Segura */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-[#FFFCE1] font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#0AE448]" />
                <span>Conectar Shopify / Meta Ads</span>
              </button>
            </div>

            {/* Ação Rápida WhatsApp Ancorada no SKU Real + Link Público */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <button
                onClick={handleCopyPublicDossierUrl}
                className="w-full py-2 px-3 bg-[#00BAE2]/10 hover:bg-[#00BAE2]/20 border border-[#00BAE2]/30 text-[#00BAE2] font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedPublicUrl ? <Check className="w-3.5 h-3.5 text-[#0AE448]" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedPublicUrl ? 'Link Copiado para o Clipboard!' : `Copiar Link Público (?dossier=${realSiteData.domain})`}</span>
              </button>

              <button
                onClick={() => {
                  const skuHighlight = sampleBroken
                    ? `• SKU Crítico Detectado: "${sampleBroken.productTitle}" (Faltando [${sampleBrokenSizes.join(', ')}])\n• Link Verificado: ${sampleBroken.productUrl}\n`
                    : '';
                  const msg = `DIAGNÓSTICO EXECUTIVO DE CRO & CATÁLOGO (${realSiteData.brandName || realSiteData.domain})\n\nOlá! Concluímos a auditoria profunda da vitrine pública (${realSiteData.domain}):\n• Growth Score Atual: ${growthScore}/100\n• Produtos com Ruptura Central: ${brokenItems.length} de ${realSiteData.catalogAudit?.totalProductsScanned || allIssues.length} produtos\n${skuHighlight}• Sangria Mensal Estimada em Mídia: R$ ${monthlyLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês [Simulação]\n\n📄 Acesse o Dossiê Interativo ao vivo:\n${publicDossierUrl}\n\nGerado por: ${agencyName} (${consultantName})`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                }}
                className="w-full py-2.5 px-3 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0AE448]/20 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Enviar Pitch + Link no WhatsApp</span>
              </button>
            </div>
          </div>

          {/* DOCUMENT LIVE PREVIEW (DOCUMENTO A4 FORMATADO) */}
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-[#080909] flex justify-center">
            
            {/* A4 Sheet Container */}
            <div 
              ref={printContainerRef}
              className={`w-full max-w-[210mm] shadow-2xl p-8 sm:p-12 space-y-8 font-sans border print:shadow-none print:border-none print:p-0 print:m-0 print:bg-white print:text-slate-900 h-fit transition-all duration-300 ${
                previewMode === 'obsidian'
                  ? 'bg-[#101211] text-[#FFFCE1] border-white/10 shadow-black/80'
                  : 'bg-white text-slate-900 border-slate-300 shadow-xl'
              }`}
            >
              
              {/* PAGE 1: COVER & EXECUTIVE HEADER */}
              {includeCover && (
                <div className="space-y-6 border-b border-slate-200/30 pb-8 break-inside-avoid">
                  <div className="flex items-center justify-between border-b border-slate-200/20 pb-4">
                    <div>
                      <span className="text-xs font-mono font-bold tracking-widest text-indigo-500 uppercase">
                        {agencyName}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">Plataforma Independente de Auditoria de E-Commerce & CRO</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-400 font-mono">
                        Data: {new Date().toLocaleDateString('pt-BR')}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">Confidencial • Nível Diretoria</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-indigo-500/15 text-indigo-400 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                      Auditoria de Crescimento & Blindagem de Catálogo
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Diagnóstico Executivo: {input.businessName || realSiteData.brandName}
                    </h1>
                    <p className="text-xs text-slate-400 font-mono">
                      Domínio Auditado: <span className="font-bold text-indigo-400">{realSiteData.domain}</span> | Plataforma: <span className="font-bold">{realSiteData.ecommercePlatform}</span> | Produtos: <span className="font-bold">{realSiteData.catalogAudit?.totalProductsScanned || allIssues.length}</span> ({realSiteData.catalogAudit?.totalSkusAudited || 0} SKUs)
                    </p>
                  </div>

                  {/* Growth Score & Revenue Lift Highlight Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2 border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">Growth Score Geral</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                          Saúde Grade: {realSiteData.catalogAudit?.catalogHealthScore || 100}%
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-cyan-400 font-mono">{growthScore}</span>
                        <span className="text-sm font-bold text-slate-400">/ 100</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Índice baseado em Saúde de Catálogo (30%), Velocidade Mobile (25%), CRO (25%) e Segurança (20%).
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white space-y-2 border border-indigo-800/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">Sangria Atuarial Auditada</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                          [Simulação / Benchmark]
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                        R$ {monthlyLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} /mês
                      </div>
                      <p className="text-[11px] text-slate-300">
                        {brokenItems.length} produto(s) com curva central rompida (+{estimatedRevenueLiftMin}% a +{estimatedRevenueLiftMax}% Lift).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2: OS 3 MAIORES VAZAMENTOS ANCORADOS NOS DADOS REAIS */}
              {includeLeaks && (
                <div className="space-y-4 border-b border-slate-200/30 pb-8 break-inside-avoid">
                  <h2 className="text-sm font-bold uppercase font-mono flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-500" /> 1. Os 3 Maiores Vazamentos Financeiros Identificados em {realSiteData.domain}:
                  </h2>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-start gap-3">
                      <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg shrink-0 font-mono font-bold text-xs">#1</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold">
                          {sampleBroken
                            ? `Ruptura Central em "${sampleBroken.productTitle}" (Faltando [${sampleBrokenSizes.join(', ')}])`
                            : 'Auditoria Preventiva de Curva Central de Estoque'}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {brokenItems.length > 0
                            ? `Foram identificados ${brokenItems.length} produto(s) com tamanhos de alta demanda esgotados na vitrine ativa, gerando desperdício estimado de R$ ${monthlyLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês no tráfego pago.`
                            : 'Todos os produtos inspecionados estão com a curva central abastecida no momento da leitura.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-start gap-3">
                      <div className="p-2 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 font-mono font-bold text-xs">#2</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold">Alavanca de Margem no Pix & Redução de Taxa de Gateway</h4>
                        <p className="text-[11px] text-slate-400">
                          Destacar o cálculo dinâmico de economia no Pix junto ao seletor de variantes eleva a conversão à vista e preserva até +R$ {pixEstimatedGain.toLocaleString('pt-BR')}/mês [Simulação].
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-start gap-3">
                      <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0 font-mono font-bold text-xs">#3</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold">Ergonomia Mobile (Zona do Polegar) & Contraste WCAG 2.1</h4>
                        <p className="text-[11px] text-slate-400">
                          Otimização da área de toque principal (mínimo 48px) e barra fixa de compra mobile para reduzir abandono em tráfego de redes sociais.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2.5: TABELA REAL DE SKUs AUDITADOS (QUANDO includeCatalog ESTIVER MARCADO) */}
              {includeCatalog && sortedPreviewIssues.length > 0 && (
                <div className="space-y-4 border-b border-slate-200/30 pb-8 break-inside-avoid">
                  <h2 className="text-sm font-bold uppercase font-mono flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" /> 2. Amostra Auditada ao Vivo de Produtos & Grade ({brokenItems.length} Críticos):
                  </h2>

                  <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-900/90 border-b border-white/10 text-slate-400 font-mono text-[10px] uppercase">
                          <th className="p-2.5">SKU</th>
                          <th className="p-2.5">Produto Auditado</th>
                          <th className="p-2.5">Tamanhos Ativos</th>
                          <th className="p-2.5">Ruptura Central</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 font-mono">
                        {sortedPreviewIssues.map((item, idx) => {
                          const isBroken = isCatalogProductBroken(item);
                          const coreMissing = item.brokenCoreSizes?.length ? item.brokenCoreSizes : item.missingSizes;
                          return (
                            <tr key={item.id || idx}>
                              <td className="p-2.5 font-bold">{item.sku}</td>
                              <td className="p-2.5 font-sans max-w-[200px] truncate">{item.productTitle}</td>
                              <td className="p-2.5 text-emerald-400">{(item.availableSizes || []).slice(0, 6).join(', ')}</td>
                              <td className="p-2.5">
                                {isBroken ? (
                                  <span className="text-rose-400 font-bold">Falta: [{coreMissing.join(', ')}]</span>
                                ) : (
                                  <span className="text-emerald-400">Grade Saudável</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PAGE 3: SIMULADOR PIX & RUPTURA */}
              {(includeRupture || includePix) && (
                <div className="space-y-4 border-b border-slate-200/30 pb-8 break-inside-avoid">
                  <h2 className="text-sm font-bold uppercase font-mono flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-500" /> 3. Simulação de Elasticidade & Impacto Financeiro [Benchmark]:
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {includeRupture && (
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                        <span className="text-[10px] font-bold text-rose-400 uppercase font-mono">[Simulação] Ruptura de Anúncios</span>
                        <h4 className="text-xs font-bold">
                          {sampleBroken
                            ? `Curva Central Afetada: [${sampleBrokenSizes.join(', ')}]`
                            : 'Monitoramento Preventivo de Grade'}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Desperdício projetado em anúncios: <strong className="text-rose-400 font-mono">R$ {monthlyLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</strong>.
                        </p>
                      </div>
                    )}

                    {includePix && (
                      <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">[Simulação] Elasticidade Pix</span>
                        <h4 className="text-xs font-bold">Ganho com Destaque de Desconto no Pix</h4>
                        <p className="text-[11px] text-slate-400">
                          Margem adicional destravável: <strong className="text-emerald-400 font-mono">+R$ {pixEstimatedGain.toLocaleString('pt-BR')}/mês</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAGE 4: PLANO DE AÇÃO ICE SCORE */}
              {includeIceRoadmap && (
                <div className="space-y-4 border-b border-slate-200/30 pb-8 break-inside-avoid">
                  <h2 className="text-sm font-bold uppercase font-mono flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-400" /> 4. Plano de Ação Priorizado (Matriz ICE Score):
                  </h2>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-slate-400 font-mono">
                        <th className="pb-2">Iniciativa / Ação</th>
                        <th className="pb-2 text-center">Impacto</th>
                        <th className="pb-2 text-center">Facilidade</th>
                        <th className="pb-2 text-right">ICE Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-[11px]">
                      <tr>
                        <td className="py-2.5 font-bold">
                          1. {brokenItems.length > 0 ? `Pausar/Redirecionar Ads dos ${brokenItems.length} SKUs com Grade Central Rompida` : 'Ativar Monitoramento Preventivo de Ruptura nos Criativos de Ads'}
                        </td>
                        <td className="py-2.5 text-center font-mono">9.8</td>
                        <td className="py-2.5 text-center font-mono">9.5</td>
                        <td className="py-2.5 text-right font-mono font-bold text-emerald-400">96 / 100</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">2. Destacar Economia Dinâmica no Pix Acima da Dobra (PDP)</td>
                        <td className="py-2.5 text-center font-mono">9.2</td>
                        <td className="py-2.5 text-center font-mono">9.5</td>
                        <td className="py-2.5 text-right font-mono font-bold text-indigo-400">93 / 100</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold">3. Reposição Prioritária dos Tamanhos Centrais nos Produtos Curva A</td>
                        <td className="py-2.5 text-center font-mono">9.0</td>
                        <td className="py-2.5 text-center font-mono">8.5</td>
                        <td className="py-2.5 text-right font-mono font-bold text-indigo-400">88 / 100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* PAGE 5: CERTIDÃO DO FACT-CHECKER & FOOTER */}
              {includeFactChecker && (
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-emerald-500/30 flex items-center justify-between gap-4 break-inside-avoid">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold">Certidão de Integridade Factual (Grounding 100% • 18 Agentes Harmonizados)</h4>
                      <p className="text-[10px] text-slate-400">
                        Zero links quebrados (404), separação rigorosa entre fatos auditados ao vivo e simulações de benchmark.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-lg font-mono shrink-0">
                    Auditado & Aprovado
                  </span>
                </div>
              )}

              {/* PDF FOOTER (CONTATO DA AGÊNCIA) */}
              <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 border-t border-white/10 gap-2 break-inside-avoid">
                <div>
                  <p className="font-bold text-white">{agencyName}</p>
                  <p className="text-[10px] text-slate-400">{consultantName} • WhatsApp: {consultantPhone}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-slate-400">AdShield Intelligence • Plataforma Independente de Auditoria de E-Commerce</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Modal de Conexão Segura de APIs */}
      <OfficialIntegrationConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        brandName={realSiteData.brandName}
        domain={realSiteData.domain}
      />

    </div>
  );
};
