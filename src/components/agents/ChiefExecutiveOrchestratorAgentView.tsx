import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RefreshCw, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  Flame, 
  ArrowRight,
  Clock,
  KanbanSquare,
  Bot,
  Zap
} from 'lucide-react';
import { 
  runCeoOrchestratorEvaluation, 
  CeoExecutiveBoardroomDossier, 
  CeoProposalDecision, 
  StrategicSprint 
} from '../../services/agents/chiefExecutiveOrchestratorAgent';

export const ChiefExecutiveOrchestratorAgentView: React.FC = () => {
  const [dossier, setDossier] = useState<CeoExecutiveBoardroomDossier | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'decisions' | 'roadmap'>('decisions');

  const loadDossier = async () => {
    setIsLoading(true);
    try {
      const data = await runCeoOrchestratorEvaluation();
      setDossier(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDossier();
  }, []);

  if (isLoading || !dossier) {
    return (
      <div className="py-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500" />
        <p className="text-sm font-bold text-slate-700">Orquestrador Executivo (CEO Agent) avaliando propostas via ICE Score...</p>
        <p className="text-xs text-slate-400">Filtrando iniciativas com corte mínimo de 8.0 para priorização de sprints.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-amber-900 to-slate-950 rounded-2xl text-amber-400 shadow-md shadow-amber-950/30 border border-amber-800">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Orquestrador Executivo de Negócios (CEO Agent)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Filtro ICE &ge; 8.0 Ativo
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              O cérebro decisório central. Avalia com rigor matemático todas as propostas dos agentes, descartando o que não gera ROI e aprovando sprints prioritárias.
            </p>
          </div>
        </div>

        <button
          onClick={loadDossier}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reavaliar Mesa Diretora</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Propostas Avaliadas</span>
            <span className="text-xl font-black text-slate-900 font-mono">{dossier.totalProposalsEvaluated} Submissões</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Aprovadas (ICE &ge; 8.0)</span>
            <span className="text-xl font-black text-emerald-600 font-mono">{dossier.approvedCount} Iniciativas</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Rejeitadas / Baixo ROI</span>
            <span className="text-xl font-black text-rose-600 font-mono">{dossier.rejectedCount} Descartadas</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Projeção de MRR</span>
            <span className="text-sm font-black text-indigo-600 font-mono">{dossier.projectedMrrLiftNextQuarter}</span>
          </div>
        </div>
      </div>

      {/* CEO Boardroom Statement */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-2 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs font-mono">
          <Crown className="w-4 h-4" />
          <span>DIRETRIZ ESTRATÉGICA DO ORQUESTRADOR EXECUTIVO (CEO):</span>
        </div>
        <p className="text-slate-200 text-xs leading-relaxed font-sans">
          "{dossier.boardroomSpeech}"
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('decisions')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'decisions'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tribunal de Decisões & ICE Score ({dossier.decisions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('roadmap')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'roadmap'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Roadmap Estratégico de Sprints ({dossier.sprints.length})
        </button>
      </div>

      {/* SUB-TAB 1: TRIBUNAL DE DECISÕES */}
      {activeSubTab === 'decisions' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Todas as propostas submetidas pelos agentes Caçador, Engenheiro e Analista de Clientes passando pelo crivo do CEO.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {dossier.decisions.map((item) => {
              const isApproved = item.decision === 'APROVADO_PARA_EXECUCAO';
              const isRejected = item.decision === 'REJEITADO_PELO_CEO';

              return (
                <div 
                  key={item.id} 
                  className={`p-5 rounded-3xl bg-white border shadow-xs space-y-4 transition-all ${
                    isApproved ? 'border-emerald-200 hover:border-emerald-400' : 'border-slate-200 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-slate-100 text-slate-700">
                          {item.sourceAgentName}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base">{item.proposalTitle}</h3>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Categoria: {item.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-slate-50 rounded-xl text-center border border-slate-200">
                        <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block">ICE Score</span>
                        <span className={`text-base font-black font-mono ${isApproved ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {item.iceScore}
                        </span>
                      </div>

                      <span className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border border-rose-300'
                      }`}>
                        {isApproved ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                        <span>{isApproved ? 'Aprovado para Execução' : 'Rejeitado pelo CEO'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Verdict Rationale */}
                  <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                    isApproved ? 'bg-emerald-50/70 border border-emerald-200 text-emerald-950' : 'bg-rose-50/70 border border-rose-200 text-rose-950'
                  }`}>
                    <span className="font-bold font-mono text-[10px] uppercase block">
                      Veredito Oficial do Orquestrador CEO:
                    </span>
                    <p className="leading-relaxed font-medium">{item.ceoVerdictRationale}</p>
                  </div>

                  {/* Metrics Footer */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Alocação: <strong>{item.allocatedSprint.replace(/_/g, ' ')}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-emerald-700 font-bold">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                      Impacto em MRR: {item.estimatedMrrImpact}
                    </span>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ROADMAP DE SPRINTS */}
      {activeSubTab === 'roadmap' && (
        <div className="space-y-6">
          {dossier.sprints.map((sprint) => (
            <div key={sprint.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{sprint.sprintName}</h3>
                  <p className="text-xs text-slate-500 font-mono">Foco: {sprint.focusArea}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-mono font-bold">
                  {sprint.timeframe}
                </span>
              </div>

              {sprint.initiatives.length === 0 ? (
                <p className="text-xs text-slate-400 font-mono py-4 text-center">Nenhuma iniciativa alocada nesta sprint.</p>
              ) : (
                <div className="space-y-3">
                  {sprint.initiatives.map((ini) => (
                    <div key={ini.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 block">{ini.sourceAgentName}</span>
                        <h4 className="font-bold text-slate-900 text-sm">{ini.proposalTitle}</h4>
                      </div>
                      <span className="text-xs font-mono font-black text-emerald-600 shrink-0">
                        ICE {ini.iceScore}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
