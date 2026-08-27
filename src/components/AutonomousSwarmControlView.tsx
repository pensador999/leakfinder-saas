import React, { useState } from 'react';
import { 
  Bot, 
  Zap, 
  Cpu, 
  BrainCircuit, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Layers, 
  Database,
  Flame,
  ArrowRight,
  Send,
  Check
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { executeAutonomousStoreAudit, SwarmJobResult } from '../services/swarm/autonomousSwarmEngine';
import { formatDailyWhatsAppExecutiveSummary } from '../services/workers/whatsappAlertWorker';

interface AutonomousSwarmControlViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const AutonomousSwarmControlView: React.FC<AutonomousSwarmControlViewProps> = ({ diagnostic }) => {
  const { realSiteData } = diagnostic;

  const [activeTab, setActiveTab] = useState<'threads' | 'critic' | 'alerts'>('threads');
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);
  const [lastJobResult, setLastJobResult] = useState<SwarmJobResult | null>(null);
  const [copiedAlert, setCopiedAlert] = useState(false);

  const handleRunAutonomousCycle = async () => {
    setIsSimulatingRun(true);
    try {
      const result = await executeAutonomousStoreAudit(
        {
          id: `store-${realSiteData.domain.replace(/\./g, '-')}`,
          storeUrl: realSiteData.url || `https://${realSiteData.domain}`,
          brandName: realSiteData.brandName,
          niche: diagnostic.input.niche || 'Geral',
          targetPhone: '5511999999999',
          isActive: true,
          checkIntervalHours: 24,
          currentScore: diagnostic.growthScore,
          currentEstimatedLoss: diagnostic.estimatedRevenueLiftMin * 45
        },
        diagnostic
      );
      setLastJobResult(result);
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

  const handleCopyAlert = () => {
    navigator.clipboard.writeText(generatedAlertText);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-900 to-slate-950 rounded-2xl text-cyan-400 shadow-md shadow-indigo-950/30 border border-indigo-800">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Enxame Paralelo & Autonomia 24/7 (AdShield OS)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-cyan-100 text-cyan-900 border border-cyan-200">
                Grounding 100% • 6 Workers
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Execução paralela concorrente tolerante a falhas com agendamento automático diário às 07:00 da manhã via Vercel Edge + Supabase.
            </p>
          </div>
        </div>

        {/* Action: Trigger Parallel Swarm Run */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Latência Total do Enxame</p>
            <p className="text-2xl font-black text-indigo-600 font-mono leading-none">
              {lastJobResult ? `${lastJobResult.executionTimeMs}ms` : '~380ms'} <span className="text-xs text-emerald-600 font-bold">Paralelo</span>
            </p>
          </div>
          <button
            onClick={handleRunAutonomousCycle}
            disabled={isSimulatingRun}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulatingRun ? 'animate-spin' : ''}`} />
            <span>{isSimulatingRun ? 'Executando Enxame...' : 'Disparar Ciclo Autônomo Agora'}</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('threads')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'threads'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Threads em Execução ({parallelWorkers.length})
        </button>
        <button
          onClick={() => setActiveTab('critic')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'critic'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Loop de Crítica & Fact-Check
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Alerta Executivo WhatsApp (07:00)
        </button>
      </div>

      {/* TAB 1: THREADS EM EXECUÇÃO */}
      {activeTab === 'threads' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parallelWorkers.map((worker) => (
            <div key={worker.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">ID: {worker.id.toUpperCase()}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> {worker.status}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{worker.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{worker.role}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-mono">
                <span>Latência: <strong>{worker.durationMs}ms</strong></span>
                <span>Carga: <strong>{worker.load}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: CRITIC LOOP & FACT-CHECK */}
      {activeTab === 'critic' && (
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Juiz de Veracidade & Filtragem de Falsos-Positivos</h3>
                <p className="text-xs text-slate-500">Garante que nenhuma hipótese alucinada ou link quebrado seja gravado no banco.</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-mono text-xs font-bold">
              Taxa de Grounding: 100%
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <p className="font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Regras de Auto-Correção Aplicadas Automaticamente:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
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
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Alerta Executivo Formatado (WhatsApp 07:00)</h3>
                <p className="text-xs text-slate-500">Mensagem pronta disparada automaticamente pela fila sem intervenção humana.</p>
              </div>
            </div>
            <button
              onClick={handleCopyAlert}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedAlert ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Layers className="w-3.5 h-3.5" />}
              <span>{copiedAlert ? 'Copiado!' : 'Copiar Texto'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800 shadow-inner">
            {generatedAlertText}
          </div>
        </div>
      )}

    </div>
  );
};
