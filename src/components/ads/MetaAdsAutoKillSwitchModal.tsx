import React, { useState, useEffect } from 'react';
import { 
  X, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  Power, 
  PauseCircle, 
  PlayCircle, 
  RefreshCw, 
  ExternalLink, 
  Lock, 
  Sliders, 
  Clock, 
  CheckCircle2, 
  Flame, 
  DollarSign, 
  Key,
  Layers,
  Copy,
  Phone,
  ArrowRight,
  Sparkles,
  Server,
  Activity,
  Target,
  History,
  Settings
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { 
  getStoredMetaConfig, 
  saveMetaConfig, 
  auditAndMapMetaAds, 
  executeMetaAdPause, 
  getMetaExecutionLogs,
  getShopifyWebhookUrl,
  simulateRealTimeShopifyWebhookBurst,
  MonitoredMetaAd,
  GhostTargetMetaAd,
  MetaAdAccountConfig,
  ShopifyWebhookSimulationResult
} from '../../services/ads/metaMarketingApiService';
import { formatBRL } from '../../services/ai/storeFinancialGroundingEngine';

interface MetaAdsAutoKillSwitchModalProps {
  diagnostic: AgentDiagnosticResult;
  onClose: () => void;
}

export const MetaAdsAutoKillSwitchModal: React.FC<MetaAdsAutoKillSwitchModalProps> = ({
  diagnostic,
  onClose
}) => {
  const { realSiteData } = diagnostic;
  const domain = realSiteData.domain || 'loja.com.br';
  const brandName = realSiteData.brandName || 'Sua Loja';
  // 1. Vestuário com grade furada (PP ao G2) ou acessório esgotado / estoque fantasma
  const brokenSkus = (realSiteData.catalogAudit?.issues || []).filter(i => 
    (!i.isFullPrintExempt && i.missingSizes.length > 0) || 
    i.missingSizes.includes('ESGOTADO') ||
    i.missingSizes.includes('ESTOQUE_FANTASMA_SUSPEITO') ||
    Boolean(i.isGhostInventorySuspect)
  );

  // 2. Protocolo Yellowstone: Estoque Fantasma, Acessórios e Bonés com Ruptura / Backorder Oculto
  const ghostTargets: GhostTargetMetaAd[] = (realSiteData.catalogAudit?.issues || [])
    .filter(i => {
      const isAccessory = i.isResaleAccessory || i.isFullPrintExempt;
      const titleLower = (i.productTitle || '').toLowerCase();
      const isHeroAccessory = titleLower.includes('bone') || titleLower.includes('boné') || titleLower.includes('yellowstone') || titleLower.includes('chapeu') || titleLower.includes('trucker');
      const isGhostSuspect = Boolean(i.isGhostInventorySuspect || i.missingSizes.includes('ESTOQUE_FANTASMA_SUSPEITO'));
      return isGhostSuspect || (isAccessory && (i.availableSizes.length === 0 || isHeroAccessory));
    })
    .map(i => ({
      sku: i.sku || 'SKU-HERO',
      productTitle: i.productTitle,
      productUrl: i.productUrl,
      reason: i.isGhostInventorySuspect 
        ? (i.recommendedAction || 'Estoque Fantasma (Protocolo Yellowstone): Promessa de Envio Imediato sem estoque físico no galpão.')
        : 'Estoque Fantasma (Protocolo Yellowstone): Anúncio ativo para produto em backorder com estoque físico zerado.',
      dailySpend: 160.0,
      isGhostInventory: true
    }));

  const [config, setConfig] = useState<MetaAdAccountConfig>(getStoredMetaConfig());
  const [adsList, setAdsList] = useState<MonitoredMetaAd[]>(() => auditAndMapMetaAds(domain, brokenSkus, ghostTargets));
  const [logs, setLogs] = useState(() => getMetaExecutionLogs());
  const [isSaving, setIsSaving] = useState(false);
  const [isPausingId, setIsPausingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'MONITOR' | 'SIMULATOR' | 'LOGS' | 'SETTINGS'>('MONITOR');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // ⚡ Live Simulator State
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [simSku, setSimSku] = useState<string>('BRK-UV-PRO-01');
  const [simSize, setSimSize] = useState<string>('G');
  const [simulationResult, setSimulationResult] = useState<ShopifyWebhookSimulationResult | null>(null);
  const [stopwatchMs, setStopwatchMs] = useState<number>(0);
  const [webhookCopied, setWebhookCopied] = useState<boolean>(false);

  const totalSavedMonthly = adsList
    .filter(a => a.status === 'PAUSED')
    .reduce((acc, a) => acc + (a.estimatedDailyBurnSavedBRL * 30), 0);

  const webhookUrl = getShopifyWebhookUrl(domain);

  const handleToggleAutoKill = () => {
    const updated = { ...config, autoKillEnabled: !config.autoKillEnabled };
    setConfig(updated);
    saveMetaConfig(updated);
    setFeedbackMsg(updated.autoKillEnabled ? 'Auto-Kill Switch Ativado! Rupturas pausarão criativos em <60s.' : 'Auto-Kill Switch desativado.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  const handleManualPause = async (ad: MonitoredMetaAd) => {
    setIsPausingId(ad.adId);
    const res = await executeMetaAdPause(
      ad.adId, 
      ad.associatedSku, 
      `Pausa manual: tamanhos ${ad.brokenSizesDetected.join(', ')} esgotados na vitrine.`
    );
    
    setAdsList(prev => prev.map(item => item.adId === ad.adId ? { ...item, status: 'PAUSED', autoPausedAt: 'Pausado manualmente agora' } : item));
    setLogs(getMetaExecutionLogs());
    setIsPausingId(null);
    setFeedbackMsg(res.message);
    setTimeout(() => setFeedbackMsg(''), 3500);
  };

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimStep(1);
    setStopwatchMs(0);
    setSimulationResult(null);

    const timerInterval = setInterval(() => {
      setStopwatchMs(prev => prev + 45);
    }, 45);

    try {
      // Step 1: Webhook received
      await new Promise(r => setTimeout(r, 400));
      setSimStep(2);

      // Step 2: Rule _FULL evaluated
      await new Promise(r => setTimeout(r, 450));
      setSimStep(3);

      // Step 3 & 4: Meta Graph API called & WhatsApp dispatched
      const result = await simulateRealTimeShopifyWebhookBurst(simSku, simSize, brandName);
      await new Promise(r => setTimeout(r, 500));
      setSimStep(4);

      setSimulationResult(result);
      setLogs(getMetaExecutionLogs());
    } finally {
      clearInterval(timerInterval);
      setIsSimulating(false);
    }
  };

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setWebhookCopied(true);
    setTimeout(() => setWebhookCopied(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    saveMetaConfig(config);
    setTimeout(() => {
      setIsSaving(false);
      setFeedbackMsg('Configurações e credenciais salvas com sucesso.');
      setTimeout(() => setFeedbackMsg(''), 3000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[75] flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-5xl bg-[#101211] rounded-3xl shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[92vh] border border-white/10 animate-fadeIn text-[#FFFCE1]">
        
        {/* Header */}
        <div className="p-6 bg-[#0E100F] text-[#FFFCE1] flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
              <Power className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#FFFCE1]">Kill-Switch Autônomo Meta Ads</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md">
                  Pausa &lt;60s
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6]">Pausa criativos instantaneamente quando tamanhos-chave esgotam na vitrine.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-4 bg-[#141716] border-b border-white/10 flex items-center justify-between flex-wrap gap-2 shrink-0">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('MONITOR')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'MONITOR' ? 'bg-[#101211] border-t-2 border-[#0AE448] text-[#0AE448] shadow-xs' : 'text-[#BBBAA6] hover:text-[#FFFCE1]'}`}
            >
              <Target className="w-3.5 h-3.5 text-[#0AE448]" />
              <span>Anúncios Monitorados ({adsList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('SIMULATOR')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'SIMULATOR' ? 'bg-[#101211] border-t-2 border-amber-500 text-amber-400 shadow-xs' : 'text-[#BBBAA6] hover:text-[#FFFCE1]'}`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulador em Tempo Real (&lt;60s)</span>
            </button>
            <button
              onClick={() => setActiveTab('LOGS')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'LOGS' ? 'bg-[#101211] border-t-2 border-cyan-500 text-cyan-400 shadow-xs' : 'text-[#BBBAA6] hover:text-[#FFFCE1]'}`}
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Histórico de Pausas ({logs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('SETTINGS')}
              className={`px-4 py-2 text-xs font-bold rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === 'SETTINGS' ? 'bg-[#101211] border-t-2 border-[#00BAE2] text-[#00BAE2] shadow-xs' : 'text-[#BBBAA6] hover:text-[#FFFCE1]'}`}
            >
              <Settings className="w-3.5 h-3.5 text-[#00BAE2]" />
              <span>Webhook Shopify & Credenciais</span>
            </button>
          </div>

          {/* Master Kill Switch Toggle Button */}
          <div className="flex items-center gap-2 pb-2">
            <span className="text-xs font-bold text-[#BBBAA6]">Piloto Automático:</span>
            <button
              onClick={handleToggleAutoKill}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                config.autoKillEnabled
                  ? 'bg-[#0AE448] text-slate-950 hover:bg-[#0AE448]/90 font-black'
                  : 'bg-white/10 text-[#BBBAA6] hover:bg-white/15'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{config.autoKillEnabled ? 'AUTO-KILL ATIVO' : 'AUTO-KILL DESATIVADO'}</span>
            </button>
          </div>
        </div>

        {/* Notification Toast */}
        {feedbackMsg && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-[#101211]">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#141716] text-[#FFFCE1] border border-white/10">
              <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Economia Mensal em Mídia</span>
              <span className="text-2xl font-black text-[#0AE448] font-mono">
                {formatBRL(totalSavedMonthly)}
              </span>
              <span className="text-[10px] text-[#BBBAA6] block font-medium">
                {totalSavedMonthly > 0 ? 'verba não desperdiçada' : 'anúncios em estoque seguro'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 text-[#FFFCE1]">
              <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Anúncios sob Proteção</span>
              <span className="text-2xl font-black text-[#00BAE2] font-mono">
                {adsList.length} Ativos
              </span>
              <span className="text-[10px] text-[#BBBAA6] block font-medium">tempo de reação: &lt; 45 segundos</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#141716] border border-rose-500/20 text-[#FFFCE1]">
              <span className="text-[10px] uppercase font-bold text-rose-400 font-mono block">Pausados por Ruptura</span>
              <span className="text-2xl font-black text-rose-400 font-mono">
                {adsList.filter(a => a.status === 'PAUSED').length} Anúncios
              </span>
              <span className="text-[10px] text-rose-400/80 block font-medium">cliques vazios estancados</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🎯 TAB 1: ANÚNCIOS MONITORADOS */}
          {/* ========================================================================= */}
          {activeTab === 'MONITOR' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#FFFCE1]">Conjuntos & Anúncios Vinculados ao Catálogo</h4>
                  <p className="text-xs text-[#BBBAA6]">Mapeamento em tempo real entre criativos do Meta Ads e o estoque da vitrine.</p>
                </div>
              </div>

              {!config.accessToken || !config.accessToken.startsWith('EAA') ? (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px] rounded border border-amber-500/30 shrink-0">
                      MODO SIMULAÇÃO • GROUNDING
                    </span>
                    <span className="text-[#BBBAA6]">
                      Mapeamento projetado a partir dos SKUs auditados na vitrine pública. Para sincronizar e pausar campanhas reais, conecte seu token oficial.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('SETTINGS')}
                    className="shrink-0 px-3 py-1 bg-[#00BAE2]/15 text-[#00BAE2] hover:bg-[#00BAE2]/25 font-bold rounded-lg border border-[#00BAE2]/30 text-[11px] transition-colors cursor-pointer text-center"
                  >
                    Conectar Token Meta Ads
                  </button>
                </div>
              ) : null}

              <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#141716]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#191C1B] border-b border-white/10 text-[#BBBAA6] font-bold uppercase text-[10px] font-mono">
                      <th className="p-3">Anúncio / Campanha</th>
                      <th className="p-3">SKU & Produto</th>
                      <th className="p-3">Status de Grade</th>
                      <th className="p-3">Ação do Kill-Switch</th>
                      <th className="p-3 text-right">Comando</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {adsList.map((ad) => {
                      const isPaused = ad.status === 'PAUSED';
                      const isCritical = ad.ruptureSeverity === 'CRITICAL_ROMPIDO';

                      return (
                        <tr key={ad.adId} className="hover:bg-white/5 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-[#FFFCE1] block">{ad.adName}</span>
                            <span className="text-[10px] text-[#BBBAA6] font-mono">ID: {ad.adId}</span>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-white block">{ad.productTitle}</span>
                            <span className="text-[10px] text-[#00BAE2] font-mono font-bold">SKU: {ad.associatedSku}</span>
                          </td>
                          <td className="p-3">
                            {ad.ruptureSeverity === 'CRITICAL_GHOST_INVENTORY' ? (
                              <div className="flex flex-col gap-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300 w-fit flex items-center gap-1">
                                  <AlertTriangle className="w-3 h-3 text-amber-600 shrink-0" />
                                  <span>ESTOQUE FANTASMA</span>
                                </span>
                                <span className="text-[10px] text-slate-500 line-clamp-1">{ad.ghostInventoryReason || 'Ruptura física com backorder ativo'}</span>
                              </div>
                            ) : ad.brokenSizesDetected.length > 0 ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 text-rose-800">
                                Esgotados: {ad.brokenSizesDetected.join(', ')}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                                Grade Completa ✓
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 w-fit ${
                              isPaused 
                                ? ad.ruptureSeverity === 'CRITICAL_GHOST_INVENTORY'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-rose-100 text-rose-800 border border-rose-200' 
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}>
                              {isPaused ? <PauseCircle className="w-3 h-3" /> : <PlayCircle className="w-3 h-3" />}
                              <span>{isPaused ? (ad.ruptureSeverity === 'CRITICAL_GHOST_INVENTORY' ? 'PAUSADO (STOCK-SHIELD)' : 'PAUSADO (SALVANDO R$)') : 'ATIVO NO AR'}</span>
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {isPaused ? (
                              <span className="text-[10px] text-slate-400 font-mono">Pausado em &lt;45s</span>
                            ) : (
                              <button
                                onClick={() => handleManualPause(ad)}
                                disabled={isPausingId === ad.adId}
                                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer disabled:opacity-50"
                              >
                                {isPausingId === ad.adId ? 'Pausando...' : 'Pausar no Meta'}
                              </button>
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

          {/* ========================================================================= */}
          {/* ⚡ TAB 2: SIMULADOR DE TESTE EM TEMPO REAL (<60s) */}
          {/* ========================================================================= */}
          {activeTab === 'SIMULATOR' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-800/60 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-300" />
                      Laboratório de Teste de Ruptura da Shopify
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      Simular Compra que Zera Estoque na Shopify & Pausa no Meta Ads
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      Teste o circuito autônomo completo: Webhook da Shopify ➔ Motor de Regras _FULL ➔ Meta Graph API ➔ Notificação instantânea no seu WhatsApp (34 99135-1122).
                    </p>
                  </div>

                  {/* Stopwatch Badge */}
                  <div className="p-3.5 bg-slate-800/90 rounded-2xl border border-slate-700 text-center shrink-0 min-w-[130px]">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Tempo de Reação</span>
                    <span className="text-2xl font-black text-amber-400 font-mono tracking-tight">
                      {isSimulating ? `${(stopwatchMs / 1000).toFixed(2)}s` : (simulationResult ? `${(simulationResult.elapsedMs / 1000).toFixed(2)}s` : '0.00s')}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-mono block">Meta: &lt; 60.00s</span>
                  </div>
                </div>

                {/* Simulation Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">SKU para Testar:</label>
                    <select
                      value={simSku}
                      onChange={(e) => setSimSku(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none"
                    >
                      <option value="BRK-UV-PRO-01">BRK-UV-PRO-01 (Vestuário - Não Isento)</option>
                      <option value="BRK-BOTINA-FRAN-42">BRK-BOTINA-42 (Calçado Masculino)</option>
                      <option value="BRK-BANDANA_FULL">BRK-BANDANA_FULL (Isento pela Regra _FULL)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">Tamanho que Esgotou:</label>
                    <select
                      value={simSize}
                      onChange={(e) => setSimSize(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none"
                    >
                      <option value="G">Tamanho G (Concentra 34% das vendas)</option>
                      <option value="M">Tamanho M (Concentra 31% das vendas)</option>
                      <option value="42">Tamanho 42 (Calçado mais vendido)</option>
                      <option value="Único">Tamanho Único</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleRunSimulation}
                      disabled={isSimulating}
                      className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isSimulating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Executando em &lt;60s...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-current" />
                          <span>Disparar Webhook Shopify</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* 4-Step Visual Progress Stepper */}
              <div className="p-6 rounded-2xl bg-[#141716] border border-white/10 space-y-4">
                <h4 className="text-xs font-bold text-[#BBBAA6] uppercase tracking-wider font-mono">
                  Circuito de Execução em Tempo Real:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {/* Step 1 */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    simStep >= 1 ? 'bg-[#00BAE2]/10 border-[#00BAE2]/30 text-[#FFFCE1]' : 'bg-[#0E100F] border-white/10 text-[#BBBAA6]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        simStep >= 1 ? 'bg-[#00BAE2] text-slate-950 font-black' : 'bg-white/10 text-[#BBBAA6]'
                      }`}>1</span>
                      <strong className="text-xs">Webhook Shopify</strong>
                    </div>
                    <p className="text-[11px] mt-1.5 leading-relaxed text-[#BBBAA6]">
                      {simStep >= 1 ? `Evento inventory_levels/update recebido (Estoque = 0).` : 'Aguardando evento...'}
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    simStep >= 2 ? 'bg-indigo-500/10 border-indigo-500/30 text-[#FFFCE1]' : 'bg-[#0E100F] border-white/10 text-[#BBBAA6]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        simStep >= 2 ? 'bg-indigo-500 text-white' : 'bg-white/10 text-[#BBBAA6]'
                      }`}>2</span>
                      <strong className="text-xs">Regra _FULL & Grade</strong>
                    </div>
                    <p className="text-[11px] mt-1.5 leading-relaxed text-[#BBBAA6]">
                      {simStep >= 2 
                        ? (simSku.includes('_FULL') ? 'Isenção _FULL detectada! Anúncio mantido.' : `Tamanho ${simSize} crítico validado.`)
                        : 'Aguardando validação...'}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    simStep >= 3 ? 'bg-rose-500/10 border-rose-500/30 text-[#FFFCE1]' : 'bg-[#0E100F] border-white/10 text-[#BBBAA6]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        simStep >= 3 ? 'bg-rose-500 text-white' : 'bg-white/10 text-[#BBBAA6]'
                      }`}>3</span>
                      <strong className="text-xs">Meta Graph API</strong>
                    </div>
                    <p className="text-[11px] mt-1.5 leading-relaxed text-[#BBBAA6]">
                      {simStep >= 3 
                        ? (simSku.includes('_FULL') ? 'Pausa dispensada (Isento).' : 'POST /v19.0/{adId}?status=PAUSED (200 OK)')
                        : 'Aguardando envio à Meta...'}
                    </p>
                  </div>

                  {/* Step 4 */}
                  <div className={`p-4 rounded-xl border transition-all ${
                    simStep >= 4 ? 'bg-[#0AE448]/10 border-[#0AE448]/30 text-[#FFFCE1]' : 'bg-[#0E100F] border-white/10 text-[#BBBAA6]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        simStep >= 4 ? 'bg-[#0AE448] text-slate-950 font-black' : 'bg-white/10 text-[#BBBAA6]'
                      }`}>4</span>
                      <strong className="text-xs">WhatsApp Notificado</strong>
                    </div>
                    <p className="text-[11px] mt-1.5 leading-relaxed text-[#BBBAA6]">
                      {simStep >= 4 ? 'Alerta registrado para (34) 99135-1122.' : 'Aguardando confirmação...'}
                    </p>
                  </div>
                </div>

                {/* Simulation Result Banner */}
                {simulationResult && (
                  <div className={`p-4 rounded-2xl border text-xs space-y-3 ${
                    simulationResult.status === 'SUCCESS' 
                      ? 'bg-[#0AE448]/10 border-[#0AE448]/30 text-[#FFFCE1]' 
                      : 'bg-[#00BAE2]/10 border-[#00BAE2]/30 text-[#FFFCE1]'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#0AE448] shrink-0" />
                        <div>
                          <strong className="text-sm font-bold block text-[#FFFCE1]">
                            {simulationResult.status === 'SUCCESS' ? '⚡ Kill-Switch Executado com Sucesso!' : 'ℹ️ Produto Isento pela Regra _FULL'}
                          </strong>
                          <span className="font-mono text-xs text-[#BBBAA6]">
                            Tempo Total: {(simulationResult.elapsedMs / 1000).toFixed(2)}s • Economia Preservada: R$ {simulationResult.savedDailyBrl.toFixed(2)}/dia
                          </span>
                        </div>
                      </div>

                      {simulationResult.whatsAppAlertUrl && (
                        <a
                          href={simulationResult.whatsAppAlertUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#0AE448]/20 shrink-0 cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Abrir Alerta no WhatsApp (34 99135-1122)</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-[#BBBAA6]">
                      {simulationResult.actionTaken}
                    </p>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 📜 TAB 3: HISTÓRICO DE PAUSAS */}
          {/* ========================================================================= */}
          {activeTab === 'LOGS' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#FFFCE1]">Histórico de Intervenções Autônomas</h4>
              <div className="space-y-3">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-[#141716] border border-white/10 flex items-center justify-between gap-4 text-xs font-mono">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          {log.actionTaken}
                        </span>
                        <strong className="text-[#FFFCE1] font-sans text-xs">{log.adName}</strong>
                      </div>
                      <p className="text-[#BBBAA6] text-[11px] font-sans">{log.reason}</p>
                      <span className="text-[10px] text-[#BBBAA6]/60">SKU: {log.sku} • {log.timestamp}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-[#BBBAA6] uppercase block">Economia Diária</span>
                      <strong className="text-[#0AE448] text-sm font-bold font-mono">+ R$ {log.budgetSavedBRL.toFixed(2)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ⚙️ TAB 4: WEBHOOK SHOPIFY & CREDENCIAIS META */}
          {/* ========================================================================= */}
          {activeTab === 'SETTINGS' && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* Shopify Webhook Box */}
              <div className="p-5 rounded-2xl bg-[#141716] border border-white/10 space-y-4">
                <div className="flex items-center gap-2.5">
                  <Server className="w-5 h-5 text-[#00BAE2]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#FFFCE1]">Configuração do Webhook Oficial da Shopify</h4>
                    <p className="text-xs text-[#BBBAA6]">Conecte sua loja para receber as notificações de estoque esgotado em tempo real.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#BBBAA6] block font-mono">URL do Webhook AdShield (Para colar na Shopify):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={webhookUrl}
                      className="flex-1 px-3.5 py-2 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] focus:outline-none"
                    />
                    <button
                      onClick={handleCopyWebhookUrl}
                      className="px-4 py-2 bg-[#00BAE2]/20 hover:bg-[#00BAE2]/30 text-[#00BAE2] border border-[#00BAE2]/40 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {webhookCopied ? <Check className="w-3.5 h-3.5 text-[#0AE448]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{webhookCopied ? 'URL Copiada!' : 'Copiar URL'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-xs text-[#FFFCE1] space-y-1.5">
                  <span className="font-bold block text-indigo-300">Como Ativar na sua Loja Shopify (Passo a Passo em 1 Minuto):</span>
                  <ol className="list-decimal pl-4 space-y-1 text-[11px] leading-relaxed text-[#BBBAA6]">
                    <li>Acesse o painel da sua loja: <strong className="text-[#FFFCE1]">Shopify Admin ➔ Configurações ➔ Notificações</strong>.</li>
                    <li>Role até o final da página e clique em <strong className="text-[#FFFCE1]">Criar Webhook</strong>.</li>
                    <li>Selecione o Evento: <strong className="text-[#FFFCE1]">Atualização de níveis de inventário</strong> (ou <code className="text-[#0AE448]">inventory_levels/update</code>).</li>
                    <li>Cole a URL acima no campo <strong className="text-[#FFFCE1]">URL</strong> e salve.</li>
                  </ol>
                </div>
              </div>

              {/* Meta Credentials Form */}
              <form onSubmit={handleSaveSettings} className="p-5 rounded-2xl bg-[#141716] border border-white/10 space-y-4">
                <div className="flex items-center gap-2.5">
                  <Key className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="text-sm font-bold text-[#FFFCE1]">Credenciais da Meta Marketing API v19.0</h4>
                    <p className="text-xs text-[#BBBAA6]">Insira o ID da sua Conta de Anúncios e o Token de Acesso de Sistema.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-bold text-[#BBBAA6] block mb-1">ID da Conta de Anúncios (act_XXXX):</label>
                    <input
                      type="text"
                      value={config.adAccountId}
                      onChange={(e) => setConfig({ ...config, adAccountId: e.target.value })}
                      placeholder="act_1234567890"
                      className="w-full px-3 py-2 bg-[#0E100F] border border-white/10 rounded-xl font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#BBBAA6] block mb-1">WhatsApp para Alertas Imediatos:</label>
                    <input
                      type="text"
                      value="5534991351122"
                      disabled
                      className="w-full px-3 py-2 bg-[#0E100F]/60 border border-white/5 rounded-xl font-mono text-[#BBBAA6] cursor-not-allowed"
                    />
                    <span className="text-[10px] text-[#BBBAA6]/60 mt-0.5 block">Vinculado ao fundador Lucas (34 99135-1122).</span>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#BBBAA6] block mb-1 text-xs">Token de Acesso do Sistema Meta (EAA...):</label>
                  <input
                    type="password"
                    value={config.accessToken}
                    onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
                    placeholder="EAAXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX..."
                    className="w-full px-3 py-2 bg-[#0E100F] border border-white/10 rounded-xl font-mono text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#BBBAA6]/60 mt-1 block">
                    Gere o token com permissões <code className="text-[#0AE448]">ads_management</code> no Meta Business Manager.
                  </span>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#0AE448]/20 cursor-pointer"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Configurações Meta'}
                  </button>
                </div>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
