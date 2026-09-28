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
import { AgentDiagnosticResult } from '../../types';

interface ChiefExecutiveOrchestratorAgentViewProps {
  diagnostic?: AgentDiagnosticResult;
}

export const ChiefExecutiveOrchestratorAgentView: React.FC<ChiefExecutiveOrchestratorAgentViewProps> = ({ diagnostic }) => {
  const [dossier, setDossier] = useState<CeoExecutiveBoardroomDossier | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'decisions' | 'roadmap'>('decisions');

  const loadDossier = async () => {
    setIsLoading(true);
    try {
      const data = await runCeoOrchestratorEvaluation(diagnostic);
      setDossier(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDossier();
  }, [diagnostic]);

  if (isLoading || !dossier) {
    return (
      <div className="py-16 text-center space-y-3 bg-[#101211] border border-white/10 rounded-3xl">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0AE448]" />
        <p className="text-sm font-bold text-[#FFFCE1]">Orquestrador Executivo (CEO Agent) avaliando propostas via ICE Score...</p>
        <p className="text-xs text-[#BBBAA6]">Filtrando iniciativas com corte mínimo de 8.0 para priorização de sprints.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-mono rounded-lg border border-amber-500/20 mb-4">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>[Decisões Baseadas em Regras Estáticas]</span>
      </div>
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-[#FFFCE1]">Orquestrador Executivo de Negócios (CEO Agent)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30">
                Filtro ICE &ge; 8.0 Ativo
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              O cérebro decisório central. Avalia com rigor matemático todas as propostas dos agentes, descartando o que não gera ROI e aprovando sprints prioritárias.
            </p>
          </div>
        </div>

        <button
          onClick={loadDossier}
          className="px-4 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-[#0AE448]/20 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reavaliar Mesa Diretora</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#00BAE2] rounded-xl border border-[#00BAE2]/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Propostas Avaliadas</span>
            <span className="text-xl font-black text-[#FFFCE1] font-mono">{dossier.totalProposalsEvaluated} Submissões</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#0AE448] rounded-xl border border-[#0AE448]/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Aprovadas (ICE &ge; 8.0)</span>
            <span className="text-xl font-black text-[#0AE448] font-mono">{dossier.approvedCount} Iniciativas</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-rose-400 rounded-xl border border-rose-500/20">
            <XCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Rejeitadas / Baixo ROI</span>
            <span className="text-xl font-black text-rose-400 font-mono">{dossier.rejectedCount} Descartadas</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-purple-400 rounded-xl border border-purple-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Projeção de MRR</span>
            <span className="text-sm font-black text-purple-300 font-mono">{dossier.projectedMrrLiftNextQuarter}</span>
          </div>
        </div>
      </div>

      {/* CEO Boardroom Statement */}
      <div className="p-5 rounded-3xl bg-[#141716] text-[#FFFCE1] space-y-2 border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 text-[#0AE448] font-bold text-xs font-mono">
          <Crown className="w-4 h-4" />
          <span>DIRETRIZ ESTRATÉGICA DO ORQUESTRADOR EXECUTIVO (CEO):</span>
        </div>
        <p className="text-[#BBBAA6] text-xs leading-relaxed font-sans">
          "{dossier.boardroomSpeech}"
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('decisions')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold shrink-0 ${
            activeSubTab === 'decisions'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
              : 'text-[#BBBAA6] hover:bg-white/5 hover:text-white'
          }`}
        >
          Tribunal de Decisões & ICE Score ({dossier.decisions.length})
        </button>
        <button
          onClick={() => setActiveSubTab('roadmap')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold shrink-0 ${
            activeSubTab === 'roadmap'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
              : 'text-[#BBBAA6] hover:bg-white/5 hover:text-white'
          }`}
        >
          Roadmap Estratégico de Sprints ({dossier.sprints.length})
        </button>
      </div>

      {/* SUB-TAB 1: TRIBUNAL DE DECISÕES */}
      {activeSubTab === 'decisions' && (
        <div className="space-y-4">
          <p className="text-xs text-[#BBBAA6] font-medium">
            Todas as propostas submetidas pelos agentes Caçador, Engenheiro e Analista de Clientes passando pelo crivo do CEO.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {dossier.decisions.map((item) => {
              const isApproved = item.decision === 'APROVADO_PARA_EXECUCAO';

              return (
                <div 
                  key={item.id} 
                  className={`p-5 rounded-3xl bg-[#101211] border shadow-2xl space-y-4 transition-all ${
                    isApproved ? 'border-[#0AE448]/40 hover:border-[#0AE448]' : 'border-white/10 opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-[#141716] text-[#00BAE2] border border-[#00BAE2]/20">
                          {item.sourceAgentName}
                        </span>
                        <h3 className="font-bold text-[#FFFCE1] text-base">{item.proposalTitle}</h3>
                      </div>
                      <span className="text-xs text-[#BBBAA6] font-mono mt-0.5 block">Categoria: {item.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-[#141716] rounded-xl text-center border border-white/10">
                        <span className="text-[9px] font-mono uppercase font-bold text-[#BBBAA6] block">ICE Score</span>
                        <span className={`text-base font-black font-mono ${isApproved ? 'text-[#0AE448]' : 'text-[#BBBAA6]'}`}>
                          {item.iceScore}
                        </span>
                      </div>

                      <span className={`px-3 py-1.5 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5 ${
                        isApproved
                          ? 'bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {isApproved ? <CheckCircle2 className="w-4 h-4 text-[#0AE448]" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                        <span>{isApproved ? 'Aprovado para Execução' : 'Rejeitado pelo CEO'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Verdict Rationale */}
                  <div className={`p-4 rounded-2xl text-xs space-y-1 ${
                    isApproved ? 'bg-[#141716] border border-[#0AE448]/20 text-[#FFFCE1]' : 'bg-[#141716] border border-rose-500/20 text-[#BBBAA6]'
                  }`}>
                    <span className="font-bold font-mono text-[10px] uppercase block text-[#0AE448]">
                      Veredito Oficial do Orquestrador CEO:
                    </span>
                    <p className="leading-relaxed font-medium">{item.ceoVerdictRationale}</p>
                  </div>

                  {/* Metrics Footer */}
                  <div className="flex flex-wrap items-center justify-between text-xs text-[#BBBAA6] pt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#BBBAA6]" />
                      Alocação: <strong className="text-[#FFFCE1]">{item.allocatedSprint.replace(/_/g, ' ')}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-[#0AE448] font-bold">
                      <TrendingUp className="w-3.5 h-3.5 text-[#0AE448]" />
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
            <div key={sprint.id} className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <h3 className="font-bold text-[#FFFCE1] text-base">{sprint.sprintName}</h3>
                  <p className="text-xs text-[#BBBAA6] font-mono">Foco: {sprint.focusArea}</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20 text-xs font-mono font-bold">
                  {sprint.timeframe}
                </span>
              </div>

              {sprint.initiatives.length === 0 ? (
                <p className="text-xs text-[#BBBAA6] font-mono py-4 text-center">Nenhuma iniciativa alocada nesta sprint.</p>
              ) : (
                <div className="space-y-3">
                  {sprint.initiatives.map((ini) => (
                    <div key={ini.id} className="p-4 rounded-2xl bg-[#141716] border border-white/10 flex items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#BBBAA6] block">{ini.sourceAgentName}</span>
                        <h4 className="font-bold text-[#FFFCE1] text-sm">{ini.proposalTitle}</h4>
                      </div>
                      <span className="text-xs font-mono font-black text-[#0AE448] shrink-0">
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
