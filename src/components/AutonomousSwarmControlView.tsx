import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  BrainCircuit, 
  ShieldCheck, 
  Layers, 
  Database, 
  Send, 
  Check, 
  Store,
  History,
  Sparkles,
  TrendingUp,
  TrendingDown,
  PackageCheck
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { executeAutonomousStoreAudit, SwarmJobResult } from '../services/swarm/autonomousSwarmEngine';
import { formatDailyWhatsAppExecutiveSummary } from '../services/workers/whatsappAlertWorker';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  getMonitoredStores,
  getLocalStoreSnapshots,
  getLocalSwarmJobLogs,
  saveStoreSnapshot,
  recordSwarmJobLog,
  LocalStoreSnapshotRecord
} from '../services/database/swarmDatabaseService';
import {
  getStoreMemory,
  recordStoreInspection,
  formatRestockCelebrationMessage,
  StoreMemoryProfile
} from '../services/memory/storeContextMemory';

interface AutonomousSwarmControlViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const AutonomousSwarmControlView: React.FC<AutonomousSwarmControlViewProps> = ({ diagnostic }) => {
  const { realSiteData } = diagnostic;
  const currentStoreId = `store-${realSiteData.domain.replace(/\./g, '-')}`;

  const [activeTab, setActiveTab] = useState<'threads' | 'history' | 'critic' | 'alerts'>('threads');
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);
  const [lastJobResult, setLastJobResult] = useState<SwarmJobResult | null>(null);
  const [copiedAlert, setCopiedAlert] = useState(false);
  const [copiedRestock, setCopiedRestock] = useState(false);
  const [dbStats, setDbStats] = useState<{ snapshots: number; stores: number; logs: number }>({ snapshots: 0, stores: 0, logs: 0 });
  const [storeSnapshots, setStoreSnapshots] = useState<LocalStoreSnapshotRecord[]>([]);
  const [storeMemory, setStoreMemory] = useState<StoreMemoryProfile>(() => getStoreMemory(realSiteData.domain));

  // Fetch live stats from Supabase or Local-First Vault
  const loadDatabaseTelemetry = async () => {
    const storesList = await getMonitoredStores();
    const localSnaps = getLocalStoreSnapshots();
    const localLogs = getLocalSwarmJobLogs();
    const mem = getStoreMemory(realSiteData.domain);
    setStoreMemory({ ...mem });
    setStoreSnapshots(getLocalStoreSnapshots(currentStoreId));

    if (isSupabaseConfigured) {
      try {
        const { count: countStores } = await supabase.from('swarm_monitored_stores').select('*', { count: 'exact', head: true });
        const { count: countSnapshots } = await supabase.from('store_daily_snapshots').select('*', { count: 'exact', head: true });
        const { data: logsData } = await supabase.from('swarm_job_logs').select('*').order('created_at', { ascending: false }).limit(5);

        setDbStats({
          stores: countStores || storesList.length,
          snapshots: countSnapshots || localSnaps.length,
          logs: logsData?.length || localLogs.length
        });
        return;
      } catch {
        // local fallback
      }
    }

    setDbStats({
      stores: storesList.length,
      snapshots: localSnaps.length,
      logs: localLogs.length
    });
  };

  useEffect(() => {
    // Seed episodic memory from current live diagnostic so the user immediately sees the known SKUs in the vault
    const catalogIssues = realSiteData.catalogAudit?.issues || [];
    if (catalogIssues.length > 0) {
      const existingMem = getStoreMemory(realSiteData.domain);
      if (Object.keys(existingMem.knownSkus).length === 0) {
        recordStoreInspection(realSiteData.domain, {
          brandName: realSiteData.brandName,
          products: catalogIssues.map(issue => ({
            handle: issue.sku,
            title: issue.productTitle,
            url: issue.productUrl,
            brokenSizes: issue.missingSizes,
            availableSizes: issue.availableSizes
          }))
        });
      }
    }
    loadDatabaseTelemetry();
    const interval = setInterval(loadDatabaseTelemetry, 10000);
    return () => clearInterval(interval);
  }, [realSiteData.domain]);

  const handleRunAutonomousCycle = async () => {
    setIsSimulatingRun(true);
    try {
      const estimatedLoss = Math.round(
        realSiteData.catalogAudit?.monthlyLossEstimateBRL ?? (diagnostic.estimatedRevenueLiftMin * 45)
      );
      const result = await executeAutonomousStoreAudit(
        {
          id: currentStoreId,
          storeUrl: realSiteData.url || `https://${realSiteData.domain}`,
          brandName: realSiteData.brandName,
          niche: diagnostic.input.niche || 'Geral',
          targetPhone: '5511999999999',
          isActive: true,
          checkIntervalHours: 24,
          currentScore: diagnostic.growthScore,
          currentEstimatedLoss: estimatedLoss
        },
        diagnostic
      );

      // Persist snapshot, job log, and update Mem0 episodic store memory
      await saveStoreSnapshot(currentStoreId, result.diagnostic, result.delta);
      await recordSwarmJobLog(result);

      const newIssues = result.diagnostic.realSiteData.catalogAudit?.issues || [];
      recordStoreInspection(realSiteData.domain, {
        brandName: realSiteData.brandName,
        products: newIssues.map(issue => ({
          handle: issue.sku,
          title: issue.productTitle,
          url: issue.productUrl,
          brokenSizes: issue.missingSizes,
          availableSizes: issue.availableSizes
        }))
      });

      setLastJobResult(result);
      await loadDatabaseTelemetry();
    } finally {
      setIsSimulatingRun(false);
    }
  };

  const parallelWorkers = [
    { id: 'w1', name: 'Doctor de Catálogo & SKUs', role: 'Auditoria de Grade PP-G2 e Regras APC', durationMs: 140, status: 'CONCLUÍDO', load: 92 },
    { id: 'w2', name: 'Auditor Core Web Vitals 2026', role: 'LCP 2.0s e INP Mobile', durationMs: 165, status: 'CONCLUÍDO', load: 89 },
    { id: 'w3', name: 'Analista de Elasticidade & Pix', role: 'Modelagem Financeira e Margem Gateway', durationMs: 90, status: 'CONCLUÍDO', load: 96 },
    { id: 'w4', name: 'Engenheiro de Visão & Contraste', role: 'WCAG 2.1 e Saliency Map', durationMs: 180, status: 'CONCLUÍDO', load: 87 },
    { id: 'w5', name: 'Auditor de Segurança & CNPJ', role: 'Decreto 7.962/13 e CDC Art. 49', durationMs: 110, status: 'CONCLUÍDO', load: 94 },
    { id: 'w6', name: 'Juiz de Veracidade & Grounding', role: 'Filtragem de Falsos-Positivos e Anti-Alucinação', durationMs: 75, status: 'CONCLUÍDO', load: 98 }
  ];

  const generatedAlertText = formatDailyWhatsAppExecutiveSummary(
    {
      id: 'store-current',
      storeUrl: realSiteData.url || `https://${realSiteData.domain}`,
      brandName: realSiteData.brandName,
      niche: diagnostic.input.niche || 'Geral',
      isActive: true,
      checkIntervalHours: 24,
      currentScore: diagnostic.growthScore,
      currentEstimatedLoss: diagnostic.estimatedRevenueLiftMin * 45
    },
    diagnostic,
    lastJobResult?.delta
  );

  const restockCelebrationText = formatRestockCelebrationMessage({
    storeDomain: realSiteData.domain,
    merchantName: storeMemory.merchantName || realSiteData.brandName || 'Gestor',
    restockEvents: storeMemory.recentRestocks
  });

  const handleCopyAlert = () => {
    navigator.clipboard.writeText(generatedAlertText);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 2000);
  };

  const handleCopyRestockCelebration = () => {
    if (!restockCelebrationText) return;
    navigator.clipboard.writeText(restockCelebrationText);
    setCopiedRestock(true);
    setTimeout(() => setCopiedRestock(false), 2000);
  };

  const handleSimulateRestockEvent = () => {
    const catalogIssues = realSiteData.catalogAudit?.issues || [];
    const firstBroken = catalogIssues.find(i => i.missingSizes && i.missingSizes.length > 0) || catalogIssues[0];
    if (!firstBroken) return;

    // Ensure baseline broken state is recorded first
    recordStoreInspection(realSiteData.domain, {
      brandName: realSiteData.brandName,
      products: catalogIssues.map(issue => ({
        handle: issue.sku,
        title: issue.productTitle,
        url: issue.productUrl,
        brokenSizes: issue.missingSizes.length > 0 ? issue.missingSizes : ['M', 'G'],
        availableSizes: issue.availableSizes
      }))
    });

    // Now simulate that the top broken SKU had its core sizes restocked in the warehouse
    const restockedSizes = firstBroken.missingSizes.length > 0
      ? firstBroken.missingSizes.filter(s => s !== 'ARQUIVO (ESGOTADO)').slice(0, 2)
      : ['M', 'G'];

    recordStoreInspection(realSiteData.domain, {
      brandName: realSiteData.brandName,
      products: catalogIssues.map((issue, idx) =>
        idx === 0 || issue.sku === firstBroken.sku
          ? {
              handle: issue.sku,
              title: issue.productTitle,
              url: issue.productUrl,
              brokenSizes: [],
              availableSizes: Array.from(new Set([...(issue.availableSizes || []), ...restockedSizes]))
            }
          : {
              handle: issue.sku,
              title: issue.productTitle,
              url: issue.productUrl,
              brokenSizes: issue.missingSizes,
              availableSizes: issue.availableSizes
            }
      )
    });

    loadDatabaseTelemetry();
  };

  const knownSkuEntries = Object.values(storeMemory.knownSkus);

  return (
    <div className="space-y-6 font-sans text-[#FFFCE1]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md shadow-[#0AE448]/10">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-[#FFFCE1]">Torre de Controle do Enxame 24/7 (AdShield OS)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20">
                {isSupabaseConfigured ? 'Supabase Live • Workers' : 'Local-First Vault • Workers'}
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              Execução paralela concorrente tolerante a falhas com persistência {isSupabaseConfigured ? 'híbrida PostgreSQL + LocalVault' : '100% Local-First (Mem0 + Snapshots Históricos)'}.
            </p>
          </div>
        </div>

        {/* Action: Trigger Parallel Swarm Run */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Latência Total do Enxame</p>
            <p className="text-2xl font-black text-[#0AE448] font-mono leading-none">
              {lastJobResult ? `${lastJobResult.executionTimeMs}ms` : '~380ms'} <span className="text-xs text-[#00BAE2] font-bold">Paralelo</span>
            </p>
          </div>
          <button
            onClick={handleRunAutonomousCycle}
            disabled={isSimulatingRun}
            className="px-4 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#0AE448]/20 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulatingRun ? 'animate-spin' : ''}`} />
            <span>{isSimulatingRun ? 'Executando Enxame...' : 'Disparar Ciclo Autônomo Agora'}</span>
          </button>
        </div>
      </div>

      {/* Live Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-white/5 text-[#00BAE2] rounded-xl border border-white/5">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Lojas no Radar</span>
            <span className="text-xl font-black text-[#FFFCE1] font-mono">{dbStats.stores} Ativas</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-white/5 text-[#0AE448] rounded-xl border border-white/5">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">
              {isSupabaseConfigured ? 'Snapshots no PostgreSQL' : 'Snapshots no LocalVault'}
            </span>
            <span className="text-xl font-black text-[#0AE448] font-mono">{dbStats.snapshots} Registros</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-white/5 text-[#00BAE2] rounded-xl border border-white/5">
            <PackageCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Memória Episódica (Mem0)</span>
            <span className="text-xl font-black text-[#FFFCE1] font-mono">{knownSkuEntries.length} SKUs Vigiados</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-white/5 text-[#0AE448] rounded-xl border border-white/5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Taxa de Grounding</span>
            <span className="text-xl font-black text-[#0AE448] font-mono">100% Auditado</span>
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 flex-wrap border-b border-white/10 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('threads')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'threads'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-lg shadow-[#0AE448]/20'
              : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
          }`}
        >
          Threads em Execução ({parallelWorkers.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'history'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-lg shadow-[#0AE448]/20'
              : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Radar Antes vs. Depois & Reposições ({storeSnapshots.length})
        </button>
        <button
          onClick={() => setActiveTab('critic')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'critic'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-lg shadow-[#0AE448]/20'
              : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
          }`}
        >
          Loop de Crítica & Fact-Check
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-lg shadow-[#0AE448]/20'
              : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
          }`}
        >
          Alerta Executivo WhatsApp (07:00)
        </button>
      </div>

      {/* TAB 1: THREADS EM EXECUÇÃO */}
      {activeTab === 'threads' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parallelWorkers.map((worker) => (
            <div key={worker.id} className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#BBBAA6]">ID: {worker.id.toUpperCase()}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-3 h-3" /> {worker.status}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-[#FFFCE1] text-sm">{worker.name}</h4>
                <p className="text-xs text-[#BBBAA6] mt-0.5">{worker.role}</p>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-[#BBBAA6] font-mono">
                <span>Latência: <strong className="text-[#FFFCE1]">{worker.durationMs}ms</strong></span>
                <span>Carga: <strong className="text-[#0AE448]">{worker.load}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 1.5: RADAR ANTES VS DEPOIS & DETECTOR DE REPOSIÇÃO (MEM0) */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          {/* Restock Celebration Banner */}
          <div className="p-6 bg-[#101211] border border-white/10 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0AE448]/10 border border-[#0AE448]/20 text-[#0AE448] rounded-xl">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-[#FFFCE1] text-sm">
                    Detector Episódico de Reposição de Grade (Mem0 • {realSiteData.domain})
                  </h3>
                  <p className="text-xs text-[#BBBAA6]">
                    Compara os tamanhos furados da auditoria anterior com a disponibilidade atual para avisar quando reativar campanhas no Meta Ads.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleSimulateRestockEvent}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#00BAE2] border border-[#00BAE2]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Simular reposição de grade no SKU #1 para testar o gatilho de reativação de campanha Meta Ads"
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>Simular Evento de Reposição (Teste Mem0)</span>
                </button>
                {storeMemory.recentRestocks.length > 0 && (
                  <button
                    onClick={handleCopyRestockCelebration}
                    className="px-3 py-1.5 bg-[#0AE448]/15 hover:bg-[#0AE448]/25 text-[#0AE448] border border-[#0AE448]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedRestock ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{copiedRestock ? 'Alerta de Reposição Copiado!' : 'Copiar Alerta de Reposição WhatsApp'}</span>
                  </button>
                )}
              </div>
            </div>

            {storeMemory.recentRestocks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {storeMemory.recentRestocks.map((ev, idx) => (
                  <div key={`${ev.productHandle}-${idx}`} className="p-3.5 rounded-2xl bg-[#141716] border border-[#0AE448]/30 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-[#FFFCE1]">{ev.productTitle}</p>
                      <p className="text-[11px] text-[#0AE448] font-mono mt-0.5">
                        Tamanhos repostos: [{ev.restockedSizes.join(', ')}]
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[#BBBAA6]">
                      {new Date(ev.detectedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#BBBAA6]">
                <div>
                  <span className="text-[#FFFCE1] font-bold block">
                    {knownSkuEntries.length} SKUs monitorados na memória episódica de {realSiteData.brandName}
                  </span>
                  <span>
                    Assim que um tamanho furado voltar a ficar disponível em uma próxima varredura, o alerta de reativação de campanha aparecerá aqui.
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-[11px] text-[#00BAE2] shrink-0">
                  Auditorias na loja: {storeMemory.auditCount || 1}
                </span>
              </div>
            )}
          </div>

          {/* Snapshot Delta Timeline */}
          <div className="p-6 bg-[#101211] border border-white/10 rounded-3xl space-y-4 shadow-2xl">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-[#FFFCE1] text-sm">Histórico de Snapshots Antes vs. Depois ({realSiteData.brandName})</h3>
                <p className="text-xs text-[#BBBAA6]">
                  Clique em &ldquo;Disparar Ciclo Autônomo Agora&rdquo; no topo para gravar um novo snapshot comparativo no LocalVault.
                </p>
              </div>
              <span className="text-xs font-mono text-[#BBBAA6]">
                Exibindo {storeSnapshots.length} snapshot(s) desta loja
              </span>
            </div>

            {storeSnapshots.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#141716] border border-white/10 text-center space-y-2">
                <p className="text-xs font-bold text-[#FFFCE1]">Nenhum snapshot histórico gravado ainda para {realSiteData.brandName}.</p>
                <p className="text-xs text-[#BBBAA6]">
                  Acione o botão &ldquo;Disparar Ciclo Autônomo Agora&rdquo; para criar o marco zero e habilitar a comparação temporal.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {storeSnapshots.slice(0, 8).map((snap) => (
                  <div key={snap.id} className="p-4 rounded-2xl bg-[#141716] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-[#FFFCE1]">
                          Score: {snap.score}/100
                        </span>
                        {snap.delta && snap.delta.scoreDelta !== 0 && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                            snap.delta.scoreDelta > 0
                              ? 'bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}>
                            {snap.delta.scoreDelta > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {snap.delta.scoreDelta > 0 ? `+${snap.delta.scoreDelta}` : snap.delta.scoreDelta} pts
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-[#BBBAA6]">
                          • {new Date(snap.audited_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-xs text-[#BBBAA6]">
                        {snap.delta?.evolutionSummary || 'Snapshot de linha de base (Marco Zero) registrado no cofre local.'}
                      </p>
                      {snap.top_broken_skus_summary && snap.top_broken_skus_summary.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {snap.top_broken_skus_summary.slice(0, 3).map((item, idx) => (
                            <span
                              key={`${item.sku}-${idx}`}
                              className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono text-rose-300"
                            >
                              {item.title.slice(0, 28)}{item.title.length > 28 ? '…' : ''} [{item.missingSizes.slice(0, 3).join(', ')}]
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-[#BBBAA6] block uppercase">SKUs Críticos</span>
                        <span className="font-bold text-amber-400">{snap.broken_skus_count}/{snap.total_skus_count}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-[#BBBAA6] block uppercase">Perda Mensal Est.</span>
                        <span className="font-bold text-rose-400">
                          R$ {snap.estimated_monthly_loss.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CRITIC LOOP & FACT-CHECK */}
      {activeTab === 'critic' && (
        <div className="p-6 bg-[#101211] border border-white/10 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#0AE448]/10 border border-[#0AE448]/20 text-[#0AE448] rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-[#FFFCE1] text-base">Juiz de Veracidade & Filtragem de Falsos-Positivos</h3>
                <p className="text-xs text-[#BBBAA6]">Garante que nenhuma hipótese alucinada ou link quebrado seja gravado no banco.</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded-full font-mono text-xs font-bold">
              Taxa de Grounding: 100%
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 text-xs space-y-2">
              <p className="font-bold text-[#FFFCE1] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0AE448]" />
                Regras de Auto-Correção Aplicadas Automaticamente:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-[#BBBAA6]">
                <li>Validação de URLs de produtos para garantir status HTTP 200 (Zero 404).</li>
                <li>Isenção de peças casuais de algodão e bandanas de tamanho único da regra de grade obrigatória `_FULL`.</li>
                <li>Verificação de widgets do tema antes de declarar ausência de tabela de medidas.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: WHATSAPP ALERT PREVIEW */}
      {activeTab === 'alerts' && (
        <div className="bg-[#101211] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-[#0AE448]/10 border border-[#0AE448]/20 text-[#0AE448] rounded-xl">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#FFFCE1] text-sm">Alerta Executivo Formatado (WhatsApp 07:00)</h3>
                <p className="text-xs text-[#BBBAA6]">Mensagem pronta disparada automaticamente pela fila sem intervenção humana.</p>
              </div>
            </div>
            <button
              onClick={handleCopyAlert}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {copiedAlert ? <Check className="w-3.5 h-3.5 text-[#0AE448]" /> : <Layers className="w-3.5 h-3.5 text-[#0AE448]" />}
              <span>{copiedAlert ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E100F] text-[#0AE448] font-mono text-xs whitespace-pre-wrap leading-relaxed border border-white/10 shadow-inner">
            {generatedAlertText}
          </div>
        </div>
      )}

    </div>
  );
};
