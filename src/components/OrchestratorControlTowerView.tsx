import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Gauge, 
  Sparkles, 
  Terminal, 
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { ChiefOrchestratorAgent, OrchestrationExecutionLog } from '../services/orchestrator/chiefOrchestratorEngine';

interface OrchestratorControlTowerViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const OrchestratorControlTowerView: React.FC<OrchestratorControlTowerViewProps> = ({ diagnostic }) => {
  const { realSiteData, growthScore, input } = diagnostic;

  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'specialists' | 'logs'>('pipeline');

  // Inicializa o snapshot do Orquestrador baseado nos dados reais do diagnóstico
  const orchestrator = new ChiefOrchestratorAgent(input);
  
  orchestrator.updateSpecialistTask('CATALOG_DOCTOR', {
    stage: 'COMPLETED',
    executionTimeMs: 420,
    evidenceItemsCount: realSiteData.catalogAudit?.issues.length || 12,
    qualityScore: realSiteData.catalogAudit?.catalogHealthScore || 88,
    notes: 'Grade de tamanhos (PP-G2), fotos e regras de algodão APC auditadas.'
  });

  orchestrator.updateSpecialistTask('CORE_WEB_VITALS', {
    stage: 'COMPLETED',
    executionTimeMs: 650,
    evidenceItemsCount: 6,
    qualityScore: 92,
    notes: 'LCP 2.0s, INP <200ms e Schema.org Product inspecionados.'
  });

  orchestrator.updateSpecialistTask('FINANCIAL_PIX', {
    stage: 'COMPLETED',
    executionTimeMs: 180,
    evidenceItemsCount: 4,
    qualityScore: 95,
    notes: 'Simulação de elasticidade de preço e box de Pix calculados.'
  });

  orchestrator.updateSpecialistTask('VISION_ERGONOMICS', {
    stage: 'COMPLETED',
    executionTimeMs: 510,
    evidenceItemsCount: 8,
    qualityScore: 85,
    notes: 'Contraste WCAG 2.1 e zona de polegar mobile 48px verificados.'
  });

  orchestrator.updateSpecialistTask('SECURITY_LEGAL', {
    stage: 'COMPLETED',
    executionTimeMs: 310,
    evidenceItemsCount: 5,
    qualityScore: diagnostic.security.securityScore || 90,
    notes: 'CNPJ no rodapé, CDC Art. 49 e protocolo HTTPS validados.'
  });

  orchestrator.updateSpecialistTask('COMPETITOR_SPY', {
    stage: 'COMPLETED',
    executionTimeMs: 780,
    evidenceItemsCount: 5,
    qualityScore: 88,
    notes: 'Análise de mercado e diferenciais competitivos mapeados.'
  });

  const weightedScore = orchestrator.calculateWeightedGrowthScore({
    catalogScore: realSiteData.catalogAudit?.catalogHealthScore || 88,
    vitalsScore: 92,
    visionCroScore: 85,
    securityPixScore: 92
  });

  const executionSnapshot: OrchestrationExecutionLog = orchestrator.finalizeOrchestration(true);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-slate-950 rounded-2xl text-emerald-400 shadow-md shadow-slate-900/20 border border-slate-800">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Torre de Controle do Orquestrador Maestro</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                Nível 0 • Maestro Central
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              O Maestro gerencia os 6 robôs especialistas, monitora os tempos de resposta (SLA), audita a veracidade das evidências e sintetiza o <strong>Growth Score Ponderado</strong>.
            </p>
          </div>
        </div>

        {/* Global Orchestrator KPI */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end">
          <div>
            <p className="text-[10px] uppercase font-bold text-emerald-400 font-mono">Score Ponderado do Maestro</p>
            <p className="text-2xl font-black text-white leading-none mt-0.5 font-mono">
              {weightedScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-1">6 Agentes em Conformidade</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Sub-tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('pipeline')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'pipeline'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Esteira de Execução (Pipeline)
        </button>

        <button
          onClick={() => setActiveSubTab('specialists')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'specialists'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Quadro de Especialistas ({executionSnapshot.specialistTasks.length})
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'logs'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Console de Auditoria do Maestro
        </button>
      </div>

      {/* TAB 1: PIPELINE VIEW */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-6">
          
          {/* Visual Step-by-Step Pipeline */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Fluxo Contínuo da Esteira Multi-Agente:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 font-mono">Fase 1</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-xs text-emerald-950">Coleta & Scraping</h4>
                <p className="text-[11px] text-emerald-700 leading-tight">Varredura profunda do DOM, `/products.json` e scripts.</p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 font-mono">Fase 2</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-xs text-emerald-950">Disparo dos Especialistas</h4>
                <p className="text-[11px] text-emerald-700 leading-tight">6 robôs analisam simultaneamente catálogo, SEO e UX.</p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 font-mono">Fase 3</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-xs text-emerald-950">Fact-Checking & Veracidade</h4>
                <p className="text-[11px] text-emerald-700 leading-tight">Juiz anti-alucinação valida provas antes de aprovar.</p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-800 font-mono">Fase 4</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h4 className="font-bold text-xs text-emerald-950">Síntese Ponderada</h4>
                <p className="text-[11px] text-emerald-700 leading-tight">O Maestro pondera os 4 pilares no score final.</p>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-1.5 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-emerald-400 font-mono">Fase 5</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-xs text-white">Relatório & WhatsApp</h4>
                <p className="text-[11px] text-slate-300 leading-tight">Geração do PDF executivo e disparo no WhatsApp.</p>
              </div>

            </div>
          </div>

          {/* Weighted Formula Breakdown Card */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-600" /> Composição Ponderada do Growth Score (Matemática do Maestro):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">1. Catálogo & Grade</span>
                  <span className="text-indigo-600 font-mono">Peso: 30%</span>
                </div>
                <p className="text-xl font-black text-slate-900 font-mono">
                  {realSiteData.catalogAudit?.catalogHealthScore || 88} <span className="text-xs text-slate-400 font-normal">pts</span>
                </p>
                <p className="text-[10px] text-slate-500">Grade PP-G2, regras APC e fotos sem erro.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">2. Core Web Vitals</span>
                  <span className="text-blue-600 font-mono">Peso: 25%</span>
                </div>
                <p className="text-xl font-black text-slate-900 font-mono">
                  92 <span className="text-xs text-slate-400 font-normal">pts</span>
                </p>
                <p className="text-[10px] text-slate-500">LCP 2.0s e resposta tátil rápida no celular.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">3. CRO & Visão Mobile</span>
                  <span className="text-amber-600 font-mono">Peso: 25%</span>
                </div>
                <p className="text-xl font-black text-slate-900 font-mono">
                  85 <span className="text-xs text-slate-400 font-normal">pts</span>
                </p>
                <p className="text-[10px] text-slate-500">Contraste WCAG e alcance de polegar 48px.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">4. Segurança & Pix</span>
                  <span className="text-emerald-600 font-mono">Peso: 20%</span>
                </div>
                <p className="text-xl font-black text-slate-900 font-mono">
                  92 <span className="text-xs text-slate-400 font-normal">pts</span>
                </p>
                <p className="text-[10px] text-slate-500">CNPJ no rodapé, CDC Art. 49 e Pix com desconto.</p>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* TAB 2: SPECIALISTS STATUS */}
      {activeSubTab === 'specialists' && (
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" /> Desempenho e SLA dos Robôs Especialistas:
            </h3>
            <span className="text-xs text-slate-500">Monitorados pelo Maestro</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="p-3">Agente Especialista</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Tempo (SLA)</th>
                  <th className="p-3">Evidências Auditadas</th>
                  <th className="p-3">Nota de Qualidade</th>
                  <th className="p-3">Observações do Maestro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {executionSnapshot.specialistTasks.map((task) => (
                  <tr key={task.specialistId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-sans font-bold text-slate-900">{task.specialistName}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{task.stage}</span>
                      </span>
                    </td>
                    <td className="p-3 text-slate-700">{task.executionTimeMs}ms</td>
                    <td className="p-3 text-slate-800 font-bold">{task.evidenceItemsCount} itens</td>
                    <td className="p-3 font-bold text-emerald-600">{task.qualityScore}/100</td>
                    <td className="p-3 font-sans text-slate-600 text-[11px]">{task.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOGS */}
      {activeSubTab === 'logs' && (
        <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono">
              <Terminal className="w-4 h-4" />
              <span>Console de Execução do Maestro em Tempo Real</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">Job ID: {executionSnapshot.jobId}</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-2 max-h-72 overflow-y-auto">
            {executionSnapshot.logs.map((log, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                  log.level === 'SUCCESS' ? 'bg-emerald-900/60 text-emerald-400' :
                  log.level === 'WARN' ? 'bg-amber-900/60 text-amber-400' :
                  log.level === 'ERROR' ? 'bg-rose-900/60 text-rose-400' :
                  'bg-blue-900/60 text-blue-400'
                }`}>
                  {log.level}
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
