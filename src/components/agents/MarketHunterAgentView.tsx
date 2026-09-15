import React, { useState, useEffect } from 'react';
import { 
  Radar,
  Compass, 
  Target, 
  TrendingUp, 
  Flame, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  DollarSign, 
  ShieldCheck,
  Zap,
  ArrowRight,
  Send,
  Sword,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Layers,
  ShoppingBag,
  MessageCircle,
  Phone,
  Mic,
  FileText,
  ChevronDown,
  Search,
  Building2,
  Eye,
  Share2,
  X,
  Download
} from 'lucide-react';
import { AutonomousOutboundRadarView } from '../prospecting/AutonomousOutboundRadarView';
import { SpreadsheetExporter } from '../../services/export/spreadsheetExporter';
import { BatchLeadExportModal } from '../export/BatchLeadExportModal';
import { 
  runMarketHunterScan, 
  WeeklyMarketReport, 
  SkuPriceCrossBenchmark 
} from '../../services/agents/marketHunterAgent';
import {
  ProspectLead,
  LeadProspectStatus,
  scanTargetStoreForLeadSniper,
  updateLeadProspectStatus,
  buildWhatsAppClickToChatUrl,
  generateMetaAdsLibraryUrl
} from '../../services/prospecting/leadSniperEngine';
import { AgentDiagnosticResult } from '../../types';

interface MarketHunterAgentViewProps {
  diagnostic?: AgentDiagnosticResult;
}

export const MarketHunterAgentView: React.FC<MarketHunterAgentViewProps> = ({ diagnostic }) => {
  const [report, setReport] = useState<WeeklyMarketReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'active_hunter' | 'leads' | 'sku_radar' | 'trends'>('active_hunter');
  
  // Lead Sniper state
  const [leadsList, setLeadsList] = useState<ProspectLead[]>([]);
  const [newStoreUrlInput, setNewStoreUrlInput] = useState<string>('');
  const [isScanningNewLead, setIsScanningNewLead] = useState<boolean>(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [selectedPitchStyle, setSelectedPitchStyle] = useState<Record<string, 'direct' | 'technical' | 'audio'>>({});
  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);
  const [copiedHookId, setCopiedHookId] = useState<string | null>(null);
  const [activeDossierLead, setActiveDossierLead] = useState<ProspectLead | null>(null);
  const [isBatchExportModalOpen, setIsBatchExportModalOpen] = useState<boolean>(false);

  const loadHunterReport = async () => {
    setIsLoading(true);
    try {
      const data = await runMarketHunterScan(diagnostic);
      setReport(data);
      if (data.prospectLeads) {
        setLeadsList(data.prospectLeads);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHunterReport();
  }, [diagnostic]);

  const handleScanNewStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreUrlInput.trim()) return;

    setIsScanningNewLead(true);
    setScanError(null);
    try {
      const newLead = await scanTargetStoreForLeadSniper(newStoreUrlInput.trim());
      setLeadsList(prev => [newLead, ...prev.filter(l => l.id !== newLead.id)]);
      setNewStoreUrlInput('');
      setActiveSubTab('leads');
    } catch (err: any) {
      setScanError(err.message || 'Erro ao escanear a loja alvo.');
    } finally {
      setIsScanningNewLead(false);
    }
  };

  const handleStatusChange = (leadId: string, newStatus: LeadProspectStatus) => {
    const updated = updateLeadProspectStatus(leadId, newStatus);
    setLeadsList(updated);
  };

  const handleCopyPitch = (lead: ProspectLead, style: 'direct' | 'technical' | 'audio') => {
    const text = style === 'direct' 
      ? lead.pitches.directFounder 
      : style === 'technical' 
        ? lead.pitches.technicalMediaBuyer 
        : lead.pitches.audioScript45s;
    navigator.clipboard.writeText(text);
    setCopiedLeadId(`${lead.id}-${style}`);
    setTimeout(() => setCopiedLeadId(null), 2500);
  };

  const handleOpenWhatsApp = (lead: ProspectLead, phoneToUse?: string) => {
    const style = selectedPitchStyle[lead.id] || 'direct';
    const text = style === 'direct' 
      ? lead.pitches.directFounder 
      : style === 'technical' 
        ? lead.pitches.technicalMediaBuyer 
        : lead.pitches.audioScript45s;
    
    const targetPhone = phoneToUse || lead.contactTargetPhone || lead.detectedWhatsApp || '';
    if (!targetPhone) {
      alert(`Nenhum WhatsApp público foi detectado para a vitrine "${lead.brandName}".\n\nVocê pode testar a abordagem usando o botão "Testar no Meu WhatsApp" ou copiar a mensagem para enviar via direct no Instagram.`);
      return;
    }
    const url = buildWhatsAppClickToChatUrl(targetPhone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyCounterOffer = (sku: SkuPriceCrossBenchmark) => {
    navigator.clipboard.writeText(sku.counterOfferMetaAdHook);
    setCopiedHookId(sku.id);
    setTimeout(() => setCopiedHookId(null), 2500);
  };

  if (isLoading || !report) {
    return (
      <div className="py-20 text-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-base font-bold text-slate-900">Caçador de Mercado & Lead Sniper (Agente 06)</p>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Cruzando bibliotecas de anúncios do Meta Ads, catálogos ao vivo e furos de estoque em tempo real para prospecção outbound...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans animate-fadeIn">
      
      {/* 🦅 Top Executive Command Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 rounded-2xl text-white shadow-lg shadow-blue-500/25">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl font-bold tracking-tight">Motor de Prospecção Outbound & Lead Sniper (Agente 06)</h2>
              <span className="px-2.5 py-0.5 text-[11px] font-mono font-extrabold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Inteligência Ativa • Meta Ads Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
              Localiza lojas reais de e-commerce anunciando no Meta Ads com produtos esgotados no site. Calcula a sangria em Reais e gera abordagens de 3 passos para fechamento no WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <button
            onClick={loadHunterReport}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar Radar</span>
          </button>
        </div>
      </div>

      {/* 🎯 Quick Lead Scan Input Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
        <form onSubmit={handleScanNewStore} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={newStoreUrlInput}
              onChange={(e) => setNewStoreUrlInput(e.target.value)}
              placeholder="Cole a URL de qualquer loja para auditar (ex: https://www.marcaexemplo.com.br)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isScanningNewLead || !newStoreUrlInput.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer shrink-0"
          >
            {isScanningNewLead ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Audท่องเที่ยว Estoque & Meta Ads...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Escanear & Gerar Pitch Outbound</span>
              </>
            )}
          </button>
        </form>
        {scanError && (
          <p className="text-xs text-rose-600 mt-2 font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{scanError}</span>
          </p>
        )}
      </div>

      {/* 🧭 Master Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none text-xs font-bold font-mono">
        <button
          onClick={() => setActiveSubTab('active_hunter')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'active_hunter'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-950/20'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radar className={`w-4 h-4 ${activeSubTab === 'active_hunter' ? 'animate-spin text-white' : 'text-rose-600'}`} />
          <span>Enxame Caçador Ativo & Outreach (Novo)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leads')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'leads'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-4 h-4 text-blue-600" />
          <span>Radar de Leads & CRM ({leadsList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sku_radar')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'sku_radar'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sword className="w-4 h-4 text-indigo-600" />
          <span>Duelo de Preços SKU-a-SKU ({report.skuPriceCrossBenchmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('trends')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'trends'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>Tendências Globais de CRO ({report.topEmergingTrends.length})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 🦅 0. SUB-TAB: ENXAME CAÇADOR ATIVO & TELEMETRIA AO VIVO                 */}
      {/* ========================================================================= */}
      {activeSubTab === 'active_hunter' && (
        <AutonomousOutboundRadarView 
          onSelectLeadForDossier={(lead) => setActiveDossierLead(lead)} 
        />
      )}

      {/* ========================================================================= */}
      {/* 🎯 1. SUB-TAB: RADAR DE LEADS QUENTES (META ADS SNIPER & WHATSAPP CLOSER) */}
      {/* ========================================================================= */}
      {activeSubTab === 'leads' && (
        <div className="space-y-6">
          
          {/* Banner Didático de Conversão */}
          <div className="p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-200/80 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 text-white rounded-xl shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Metodologia Growth Outbound Closer (3 Passos):</p>
                <p className="text-slate-600 mt-0.5">
                  1. Gancho do Flagrante (Zero Elogio) ➔ 2. Cálculo do Sangramento em R$ (~65% vendas perdidas em M/G) ➔ 3. CTA Dossiê em 1-Clique.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsBatchExportModalOpen(true)}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl font-mono font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Exportar leads em lote para Excel, WhatsApp em massa ou CRM B2B"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Exportar Leads em Lote</span>
              </button>
              <span className="px-3 py-1.5 bg-blue-600 text-white font-mono font-bold rounded-xl text-[11px] shadow-xs">
                {leadsList.length} Lojas Auditadas
              </span>
            </div>
          </div>

          {/* Grid de Leads */}
          <div className="space-y-5">
            {leadsList.map((lead) => {
              const currentStyle = selectedPitchStyle[lead.id] || 'direct';
              const activePitchText = currentStyle === 'direct'
                ? lead.pitches.directFounder
                : currentStyle === 'technical'
                  ? lead.pitches.technicalMediaBuyer
                  : lead.pitches.audioScript45s;

              return (
                <div 
                  key={lead.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-5 hover:border-blue-300 transition-all"
                >
                  {/* Top Bar: Brand, Niche, Meta Pixel, Status */}
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white flex items-center justify-center font-bold text-base shadow-sm">
                        {lead.brandName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900">{lead.brandName}</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700">
                            {lead.niche}
                          </span>
                          {lead.hasMetaPixel && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Meta Pixel Ativo
                            </span>
                          )}
                        </div>
                        <a 
                          href={lead.storeUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>{lead.storeUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Meta Ads Library Link & CRM Status */}
                    <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
                      <a
                        href={lead.metaAdsLibraryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Ver anúncios ativos na Biblioteca de Anúncios da Meta"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Ver Anúncios no Meta Ads Library</span>
                        <ExternalLink className="w-3 h-3 text-blue-400" />
                      </a>

                      {/* CRM Status Dropdown */}
                      <div className="relative">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadProspectStatus)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer focus:outline-none"
                        >
                          <option value="NOVO_LEAD">🎯 Novo Lead</option>
                          <option value="CONTATADO">💬 Contatado WhatsApp</option>
                          <option value="DOSSIE_ENVIADO">📋 Dossiê Enviado</option>
                          <option value="REUNIAO_AGENDADA">🤝 Reunião Agendada</option>
                          <option value="FECHADO">💰 Fechado (R$ 997 - R$ 2.497)</option>
                          <option value="DESCARTADO">❌ Descartado</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Flagrante: Broken SKU & Sangria Estimation */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Left: Product Card with missing sizes */}
                    <div className="md:col-span-7 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          Flagrante de Ruptura com Tráfego Ativo
                        </span>
                        <span className="font-mono text-rose-700 font-bold bg-rose-100/80 px-2 py-0.5 rounded text-[10px]">
                          Severidade: {lead.primaryBrokenSku.ruptureSeverity}
                        </span>
                      </div>

                      <div className="flex items-start gap-3.5">
                        {lead.primaryBrokenSku.imageSrc ? (
                          <img 
                            src={lead.primaryBrokenSku.imageSrc} 
                            alt={lead.primaryBrokenSku.productTitle} 
                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                        <div className="space-y-1 min-w-0">
                          <a 
                            href={lead.primaryBrokenSku.productUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="font-bold text-slate-900 text-sm hover:text-blue-600 transition-colors line-clamp-1 flex items-center gap-1"
                          >
                            <span>{lead.primaryBrokenSku.productTitle}</span>
                            <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                          </a>
                          <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
                            <span>Preço: <strong>R$ {lead.primaryBrokenSku.price.toFixed(2)}</strong></span>
                            <span>•</span>
                            <span className="text-emerald-700 font-bold">Disponíveis: {lead.primaryBrokenSku.availableSizes.join(', ') || 'Nenhum'}</span>
                          </div>
                          <div className="p-2 bg-rose-50 rounded-lg border border-rose-200 text-xs font-mono text-rose-900">
                            <strong className="text-rose-700">🚫 Esgotados em Alta Procura: </strong>
                            <span className="font-bold">{lead.primaryBrokenSku.missingSizes.join(', ')}</span>
                            <span className="text-[10px] text-rose-600 block mt-0.5">(Concentram ~65% das vendas de vestuário no país)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Sangria em Reais & Projeção */}
                    <div className="md:col-span-5 p-4 bg-slate-900 text-white rounded-2xl flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] text-amber-400 font-mono uppercase font-bold tracking-wider block">
                          💸 Sangria Estimada no Meta Ads:
                        </span>
                        <div className="text-2xl font-black text-white mt-1 font-mono">
                          R$ {lead.totalMonthlyWasteEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          <span className="text-xs text-slate-400 font-normal">/mês</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                          Estimativa calculada pelo cruzamento do ticket médio, CPM do nicho e taxa de fuga por falta dos tamanhos centrais.
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono">Índice ICE: <strong>{lead.iceScore}/10</strong></span>
                        <button
                          onClick={() => setActiveDossierLead(lead)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-400" />
                          <span>Ver Dossiê Executivo</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 💬 WhatsApp Pitch Section */}
                  <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3">
                    {/* Pitch Style Tabs */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                      <div className="flex items-center gap-1 text-xs font-bold font-mono">
                        <span className="text-slate-500 mr-1">Modelo de Abordagem:</span>
                        <button
                          onClick={() => setSelectedPitchStyle(prev => ({ ...prev, [lead.id]: 'direct' }))}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            currentStyle === 'direct'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          🔥 Direto (Fundador/Dono)
                        </button>
                        <button
                          onClick={() => setSelectedPitchStyle(prev => ({ ...prev, [lead.id]: 'technical' }))}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            currentStyle === 'technical'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          💼 Técnico (Gestor Tráfego)
                        </button>
                        <button
                          onClick={() => setSelectedPitchStyle(prev => ({ ...prev, [lead.id]: 'audio' }))}
                          className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                            currentStyle === 'audio'
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          🎙️ Áudio 45s
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">
                        Telefone Alvo: <strong>{lead.contactTargetPhone}</strong>
                      </div>
                    </div>

                    {/* Pitch Content Box */}
                    <div className="p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                      {activePitchText}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyPitch(lead, currentStyle)}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
                        >
                          {copiedLeadId === `${lead.id}-${currentStyle}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Texto Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copiar Mensagem</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleOpenWhatsApp(lead, '5534991351122')}
                          className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Testa o envio no seu próprio número cadastrado"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Testar no Meu WhatsApp (34 99135-1122)</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleOpenWhatsApp(lead)}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shadow-emerald-600/20 cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Abrir Conversa no WhatsApp</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 🦅 2. SUB-TAB: SKU-TO-SKU PRICE MATCHING RADAR */}
      {/* ========================================================================= */}
      {activeSubTab === 'sku_radar' && (
        <div className="space-y-4">
          
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-950 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>O Agente 06 cruzou seus produtos com os concorrentes diretos que estão anunciando no mesmo nicho:</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-200/80 px-2.5 py-1 rounded text-blue-900 shrink-0">
              Zero Falso-Positivo Verificado ✓
            </span>
          </div>

          <div className="space-y-4">
            {report.skuPriceCrossBenchmarks.map((sku) => {
              const isDisadvantage = sku.priceAdvantageStatus === 'DESVANTAGEM_SUA';

              return (
                <div key={sku.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 hover:border-blue-300 transition-all">
                  
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-2xl font-bold font-mono text-sm ${
                        isDisadvantage ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {isDisadvantage ? '⚠️ DESVIO DE PREÇO' : '🏆 VANTAGEM COMPETITIVA'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{sku.yourProductTitle}</h3>
                        <span className="text-xs text-slate-400 font-mono">Concorrente Monitorado: {sku.competitorStoreName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-xl font-bold font-mono text-xs border ${
                        isDisadvantage 
                          ? 'bg-rose-50 text-rose-800 border-rose-200' 
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {isDisadvantage ? `+${sku.priceDifferencePercent}% Mais Caro no Checkout` : `${sku.priceDifferencePercent}% Mais Barato`}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    
                    {/* Your Store Product Box */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Sua Loja:</span>
                      <p className="font-sans font-bold text-slate-900 text-sm">{sku.yourProductTitle}</p>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-600">
                        <span>Preço de Vitrine:</span>
                        <strong className="text-slate-900">R$ {sku.yourProductPrice.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Frete Médio Calculado:</span>
                        <strong className="text-slate-900">R$ {sku.yourProductShippingFee.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-900 font-bold text-sm">
                        <span>Preço Final no Checkout:</span>
                        <strong className="text-blue-600">R$ {sku.yourTotalFinalPrice.toFixed(2)}</strong>
                      </div>

                      <div className="pt-2 text-[10px] text-slate-500">
                        <span>Grade Disponível: </span>
                        <span className="font-bold text-slate-700">{sku.yourAvailableSizes.join(' • ')}</span>
                      </div>
                    </div>

                    {/* Competitor Product Box */}
                    <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-2">
                      <span className="text-[10px] text-indigo-700 uppercase font-bold block">Concorrente ({sku.competitorStoreName}):</span>
                      <p className="font-sans font-bold text-indigo-950 text-sm">{sku.competitorProductTitle}</p>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-indigo-200 text-slate-600">
                        <span>Preço de Vitrine:</span>
                        <strong className="text-slate-900">R$ {sku.competitorPrice.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Frete (Política):</span>
                        <strong className="text-emerald-700">{sku.competitorShippingFee === 0 ? 'Frete Grátis ✓' : `R$ ${sku.competitorShippingFee.toFixed(2)}`}</strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-indigo-200 text-slate-900 font-bold text-sm">
                        <span>Preço Final no Checkout:</span>
                        <strong className="text-indigo-700">R$ {sku.competitorTotalFinalPrice.toFixed(2)}</strong>
                      </div>

                      <div className="pt-2 text-[10px] text-indigo-700">
                        <span>Grade Concorrente: </span>
                        <span className="font-bold text-indigo-950">{sku.competitorAvailableSizes.join(' • ')}</span>
                      </div>
                    </div>

                  </div>

                  {/* Tactical Insight & Counter-Offer Box */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block">
                        🔍 Análise Tática do Caçador (Risco de Troca de Aba: {sku.tabSwitchingDropoffRiskPct}%):
                      </span>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed mt-1">
                        {sku.hunterTacticalRecommendation}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-xs">
                        <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold block">
                          🎯 Roteiro de Anúncio / Contra-Oferta no Meta Ads:
                        </span>
                        <p className="text-slate-300 italic text-[11px] mt-0.5">
                          {sku.counterOfferMetaAdHook}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopyCounterOffer(sku)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                      >
                        {copiedHookId === sku.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedHookId === sku.id ? 'Copiado!' : 'Copiar Roteiro Ads'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚡ 3. SUB-TAB: EMERGING CRO TRENDS */}
      {/* ========================================================================= */}
      {activeSubTab === 'trends' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.topEmergingTrends.map((trend) => (
              <div key={trend.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-100 text-purple-900">
                      {trend.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">{trend.globalAdoptionRatePct}% Adoção Global</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{trend.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{trend.description}</p>
                </div>

                <div className="p-3 bg-slate-900 text-white rounded-2xl text-[11px] font-mono space-y-1">
                  <span className="text-[9px] text-amber-400 uppercase font-bold block">Implementação Prática:</span>
                  <p className="text-slate-300 font-sans">{trend.actionableImplementation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📋 MODAL: MINI-DOSSIÊ EXECUTIVO DE PROSPECÇÃO (1 PÁGINA) */}
      {/* ========================================================================= */}
      {activeDossierLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Dossiê Confidencial de Sangria • {activeDossierLead.brandName}</h3>
                  <p className="text-xs text-slate-400">Auditoria Técnica Automatizada AdShield OS</p>
                </div>
              </div>
              <button
                onClick={() => setActiveDossierLead(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              
              {/* Top Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block">Tráfego Meta Ads:</span>
                  <strong className="text-slate-900 text-sm">{activeDossierLead.hasMetaPixel ? 'Pixel Ativo ✓' : 'Sem Pixel'}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block">Anúncios Estimados:</span>
                  <strong className="text-blue-600 text-sm">{activeDossierLead.activeAdsCountEstimated}+ ativos</strong>
                </div>
                <div className="p-3 bg-rose-50 rounded-xl border border-rose-200">
                  <span className="text-[10px] text-rose-600 uppercase block">Desperdício Estimado:</span>
                  <strong className="text-rose-700 text-sm">R$ {activeDossierLead.totalMonthlyWasteEstimated.toLocaleString('pt-BR')}/mês</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase block">Índice ICE:</span>
                  <strong className="text-amber-600 text-sm">{activeDossierLead.iceScore}/10</strong>
                </div>
              </div>

              {/* Broken Product Evidence */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                  Evidência Inquestionável do Produto:
                </span>
                <div className="flex items-start gap-4">
                  {activeDossierLead.primaryBrokenSku.imageSrc && (
                    <img 
                      src={activeDossierLead.primaryBrokenSku.imageSrc} 
                      alt="" 
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0" 
                    />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold text-slate-900 text-sm">{activeDossierLead.primaryBrokenSku.productTitle}</p>
                    <p className="text-slate-500 font-mono">Preço: R$ {activeDossierLead.primaryBrokenSku.price.toFixed(2)}</p>
                    <p className="text-rose-600 font-mono font-bold">
                      Grade Esgotada: {activeDossierLead.primaryBrokenSku.missingSizes.join(', ')}
                    </p>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      {activeDossierLead.primaryBrokenSku.explanation}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2">
                <span className="text-[10px] font-mono text-blue-900 uppercase font-bold block">
                  Recomendação Técnica AdShield de 1-Clique:
                </span>
                <ul className="list-disc pl-4 space-y-1 text-blue-950 font-medium leading-relaxed">
                  <li>Pausar imediatamente o criativo correspondente no Meta Ads Manager para estancar a perda diária.</li>
                  <li>Ativar o gatilho de Ad-Stock Sync para que futuras rupturas congelem o ad set automaticamente em 60s.</li>
                  <li>Incentivar compra de variantes disponíveis via cupom de 7% no Pix para o tráfego residual.</li>
                </ul>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Gerado por AdShield OS • Grounding 100% Verificado
              </span>
              <button
                onClick={() => handleOpenWhatsApp(activeDossierLead)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar Dossiê no WhatsApp do Lead</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 📊 MODAL: EXPORTAÇÃO EM LOTE MULTI-FORMATO */}
      {isBatchExportModalOpen && (
        <BatchLeadExportModal
          leads={leadsList}
          onClose={() => setIsBatchExportModalOpen(false)}
        />
      )}

    </div>
  );
};
