import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  GitFork, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  Target,
  Sliders,
  Award,
  Flame,
  Layers,
  BarChart3
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { 
  executeTreeOfThoughtReasoning, 
  TreeOfThoughtDebateResult, 
  ReasoningHypothesisBranch 
} from '../../services/ai/treeOfThoughtReasoningEngine';

interface TreeOfThoughtDebateViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const TreeOfThoughtDebateView: React.FC<TreeOfThoughtDebateViewProps> = ({ diagnostic }) => {
  const [debateData, setDebateData] = useState<TreeOfThoughtDebateResult | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('branch-catalog');
  const [activeRound, setActiveRound] = useState<number | 'ALL'>('ALL');
  const [isDebating, setIsDebating] = useState<boolean>(false);

  const loadDebate = () => {
    const data = executeTreeOfThoughtReasoning(diagnostic);
    setDebateData(data);
  };

  useEffect(() => {
    loadDebate();
  }, [diagnostic]);

  const handleRerunDebate = () => {
    setIsDebating(true);
    setTimeout(() => {
      loadDebate();
      setIsDebating(false);
    }, 600);
  };

  if (!debateData) return null;

  const selectedBranch = debateData.branches.find(b => b.id === selectedBranchId) || debateData.branches[0];

  return (
    <div className="space-y-8 font-sans animate-fadeIn">
      
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-600 rounded-2xl text-white shadow-md shadow-emerald-500/30">
            <GitFork className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Mesa Redonda & Raciocínio em Árvore (Tree-of-Thought)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Consenso: {debateData.consensusConfidencePct}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Os agentes debatem hipóteses concorrentes em 3 rodadas de raciocínio lógico (Tese, Antítese e Síntese) antes de emitir o diagnóstico oficial para <strong className="text-white font-mono">{debateData.brandName}</strong>.
            </p>
          </div>
        </div>

        <button
          onClick={handleRerunDebate}
          disabled={isDebating}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <RotateCcw className={`w-4 h-4 ${isDebating ? 'animate-spin' : ''}`} />
          <span>{isDebating ? 'Debatendo Hipóteses...' : 'Executar Novo Ciclo de Debate'}</span>
        </button>
      </div>

      {/* 🌲 3 COMPETING HYPOTHESIS BRANCHES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-emerald-600" />
              <span>1. Árvore de Hipóteses Concorrentes (Tree-of-Thought)</span>
            </h3>
            <p className="text-xs text-slate-500">Cada robô defende sua tese com base nas evidências do site</p>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            Divergência: {debateData.divergenceLevel}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {debateData.branches.map((branch) => {
            const isSelected = branch.id === selectedBranchId;

            return (
              <div
                key={branch.id}
                onClick={() => setSelectedBranchId(branch.id)}
                className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-white border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{branch.agentAvatar}</span>
                      <div>
                        <span className="font-bold text-slate-900 text-xs block">{branch.agentName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{branch.agentRole.slice(0, 26)}...</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-slate-100 text-slate-700">
                      Peso: {Math.round(branch.finalAdjustedWeight * 100)}%
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm leading-snug">
                    {branch.hypothesisTitle}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                    {branch.coreArgument}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Confiança Inicial:</span>
                    <span className="font-bold text-slate-900">{branch.initialConfidencePct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${branch.initialConfidencePct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🔍 DETAILED INSPECTION OF SELECTED HYPOTHESIS BRANCH */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{selectedBranch.agentAvatar}</span>
            <div>
              <h4 className="font-bold text-slate-900 text-base">{selectedBranch.hypothesisTitle}</h4>
              <span className="text-xs text-slate-400 font-mono">Conduzido por {selectedBranch.agentName}</span>
            </div>
          </div>

          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-bold font-mono text-xs">
            Peso no Veredito Final: {Math.round(selectedBranch.finalAdjustedWeight * 100)}%
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          
          {/* Evidências do DOM */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
            <span className="font-bold text-slate-500 uppercase font-mono text-[10px] block">
              Evidências Extraídas do Código do Site:
            </span>
            <ul className="space-y-1.5">
              {selectedBranch.supportingEvidence.map((ev, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Críticas dos Outros Agentes */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-amber-950 space-y-2.5">
            <span className="font-bold text-amber-800 uppercase font-mono text-[10px] block">
              Contra-Argumentos dos Outros Agentes no Debate:
            </span>
            <ul className="space-y-1.5">
              {selectedBranch.criticismsReceived.map((cr, i) => (
                <li key={i} className="flex items-start gap-2 text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{cr}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold block">Ação Recomendada por esta Hipótese:</span>
            <p className="font-medium text-slate-200 mt-0.5">{selectedBranch.recommendedAction}</p>
          </div>
        </div>
      </div>

      {/* 💬 2. REAL-TIME MULTI-ROUND AGENT DEBATE CHAT */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>2. Transcrição do Debate CoT (Cadeia de Pensamento dos Agentes)</span>
            </h3>
            <p className="text-xs text-slate-500">Mesa redonda onde os robôs confrontam seus dados e chegam ao consenso</p>
          </div>

          {/* Round Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold font-mono">
            <button
              onClick={() => setActiveRound('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRound === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas as Rodadas
            </button>
            <button
              onClick={() => setActiveRound(1)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRound === 1 ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rodada 1 (Teses)
            </button>
            <button
              onClick={() => setActiveRound(2)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRound === 2 ? 'bg-white text-indigo-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rodada 2 (Debate)
            </button>
            <button
              onClick={() => setActiveRound(3)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRound === 3 ? 'bg-white text-amber-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rodada 3 (Consenso)
            </button>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="space-y-4">
          {debateData.debateTranscript
            .filter(msg => activeRound === 'ALL' || msg.round === activeRound)
            .map((msg) => (
              <div 
                key={msg.id} 
                className={`p-4 rounded-2xl border text-xs space-y-2 transition-all ${
                  msg.speakerAgent.includes('CEO')
                    ? 'bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/20'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{msg.speakerAgent}</span>
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-200/80 text-slate-700">
                      {msg.speakerRole}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                </div>

                <p className="text-slate-800 text-xs leading-relaxed font-sans font-medium">
                  "{msg.text}"
                </p>

                {msg.referencedDataPoint && (
                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-700 font-mono bg-indigo-50/80 px-2.5 py-1 rounded-lg border border-indigo-200 w-fit">
                    <Zap className="w-3 h-3 text-indigo-600" />
                    <span>Dado Real Verificado: <strong>{msg.referencedDataPoint}</strong></span>
                  </div>
                )}
              </div>
            ))}
        </div>

      </div>

      {/* 🏆 3. CONSENSUS SYNTHESIS & ACTION PLAN */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-2 border-emerald-500/30 shadow-2xl space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Veredito Final por Consenso dos Agentes</h3>
              <p className="text-xs text-slate-400">Síntese matemática aprovada com {debateData.consensusConfidencePct}% de concordância</p>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center shrink-0">
            <span className="text-[10px] text-emerald-300 uppercase font-mono block font-bold">Recuperação Estimada</span>
            <span className="text-xl font-black text-emerald-400 font-mono">+{debateData.synthesizedActionPlan.expectedRevenueRecoveryPct}% Vendas</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          <div className="p-4 bg-slate-900/90 rounded-2xl border border-rose-500/30 space-y-1.5">
            <span className="text-[10px] text-rose-400 uppercase font-mono font-bold block">🚨 Prioridade Imediata (Hoje):</span>
            <p className="text-slate-200 font-medium leading-relaxed">{debateData.synthesizedActionPlan.immediatePriority}</p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/30 space-y-1.5">
            <span className="text-[10px] text-amber-400 uppercase font-mono font-bold block">⚡ Otimização Secundária:</span>
            <p className="text-slate-200 font-medium leading-relaxed">{debateData.synthesizedActionPlan.secondaryOptimization}</p>
          </div>

          <div className="p-4 bg-slate-900/90 rounded-2xl border border-emerald-500/30 space-y-1.5">
            <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold block">🛡️ Salvaguarda 24h:</span>
            <p className="text-slate-200 font-medium leading-relaxed">{debateData.synthesizedActionPlan.monitoringSafeguard}</p>
          </div>

        </div>

      </div>

    </div>
  );
};
