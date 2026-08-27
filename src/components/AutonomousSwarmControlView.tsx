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
  ArrowRight
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { AutonomousSelfHealingEngine, AutonomousEngineStatus } from '../services/orchestrator/autonomousSelfHealingEngine';

interface AutonomousSwarmControlViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const AutonomousSwarmControlView: React.FC<AutonomousSwarmControlViewProps> = ({ diagnostic }) => {
  const { realSiteData, input } = diagnostic;

  const [activeTab, setActiveTab] = useState<'threads' | 'memory' | 'healing'>('threads');
  const [isSimulatingRun, setIsSimulatingRun] = useState(false);

  const engine = new AutonomousSelfHealingEngine();
  const status: AutonomousEngineStatus = engine.getStatus();

  const handleSimulateParallelRun = () => {
    setIsSimulatingRun(true);
    setTimeout(() => {
      setIsSimulatingRun(false);
    }, 1200);
  };

  const parallelWorkers = [
    { id: 'w1', name: 'Doctor de Catálogo & SKUs', role: 'Auditoria de Grade PP-G2 e Regras APC', durationMs: 410, status: 'CONCLUÍDO', load: 88 },
    { id: 'w2', name: 'Auditor Core Web Vitals 2026', role: 'LCP 2.0s e INP Mobile', durationMs: 520, status: 'CONCLUÍDO', load: 92 },
    { id: 'w3', name: 'Analista de Elasticidade & Pix', role: 'Modelagem Financeira e Margem Gateway', durationMs: 190, status: 'CONCLUÍDO', load: 95 },
    { id: 'w4', name: 'Engenheiro de Visão & Contraste', role: 'WCAG 2.1 e Saliency Map', durationMs: 480, status: 'CONCLUÍDO', load: 85 },
    { id: 'w5', name: 'Auditor de Segurança & CNPJ', role: 'Decreto 7.962/13 e CDC Art. 49', durationMs: 310, status: 'CONCLUÍDO', load: 90 },
    { id: 'w6', name: 'Vigia 24h & Ruptura de Anúncios', role: 'Proteção de Tráfego Pago Meta Ads', durationMs: 260, status: 'CONCLUÍDO', load: 94 }
  ];

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
              <h2 className="text-xl font-bold text-slate-900">Enxame Paralelo & Autonomia Contínua (Swarm 24h)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-cyan-100 text-cyan-900 border border-cyan-200">
                Swarm Autônomo • 6 Workers
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Execução paralela concorrente (Promise.allSettled) com memória persistente de regras aprendidas e vigia 24h de auto-recuperação de erros.
            </p>
          </div>
        </div>

        {/* Action: Trigger Parallel Swarm Run */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">Latência Total do Enxame</p>
            <p className="text-2xl font-black text-indigo-600 font-mono leading-none">
              ~520ms <span className="text-xs text-emerald-600 font-bold">Paralelo</span>
            </p>
          </div>
          <button
            onClick={handleSimulateParallelRun}
            disabled={isSimulatingRun}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulatingRun ? 'animate-spin' : ''}`} />
            <span>{isSimulatingRun ? 'Enxame em Execução...' : 'Disparar Enxame Paralelo'}</span>
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
          1. Threads em Execução Concorrente ({parallelWorkers.length})
        </button>

        <button
          onClick={() => setActiveTab('memory')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'memory'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2. Memória Contínua & Regras Aprendidas ({status.learnedRules.length})
        </button>

        <button
          onClick={() => setActiveTab('healing')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'healing'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. Vigia 24h & Auto-Recuperação ({status.activeIncidents.length})
        </button>
      </div>

      {/* TAB 1: THREADS / PARALLEL WORKERS */}
      {activeTab === 'threads' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600" /> Execução Paralela dos 6 Especialistas (Isolamento de Falhas):
            </h3>
            <span className="text-xs text-slate-500 font-mono">Non-blocking • Promise.allSettled</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parallelWorkers.map((worker) => (
              <div 
                key={worker.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3 h-3" /> {worker.status}
                  </span>
                  <span className="text-xs font-mono font-bold text-indigo-600">{worker.durationMs}ms</span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900">{worker.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{worker.role}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                    <span>Aderência ao SLA</span>
                    <span>{worker.load}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${worker.load}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PERSISTENT MEMORY */}
      {activeTab === 'memory' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-600" /> Base de Conhecimento Aprendida pelo Ecossistema:
            </h3>
            <span className="text-xs text-slate-500 font-mono">Zero Esquecimento • Auto-Aprimoramento</span>
          </div>

          <div className="space-y-3">
            {status.learnedRules.map((rule, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 text-[10px] font-bold rounded font-mono">
                      {rule.ruleCategory}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{rule.domain}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">Padrão: {rule.pattern}</p>
                  <p className="text-xs text-slate-600">Ação Aprendida: {rule.appliedAction}</p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{rule.confidencePercent}% Confiança</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SELF-HEALING & 24H WATCHDOG */}
      {activeTab === 'healing' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Registro de Auto-Recuperação e Vigia 24h:
            </h3>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg font-bold border border-emerald-200">
              ● Vigia Ativo (Inspeção às 07:00)
            </span>
          </div>

          <div className="space-y-3">
            {status.activeIncidents.map((incident) => (
              <div 
                key={incident.id}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded font-mono">
                      {incident.timestamp}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded font-mono">
                      ✓ AUTO-RESOLVIDO
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{incident.description}</h4>
                  <p className="text-xs text-slate-600">{incident.resolutionSummary}</p>
                </div>

                <div className="shrink-0">
                  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-1 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Protegido</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
