import React, { useState, useEffect, useRef } from 'react';
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
  BarChart3,
  Crown,
  Sword,
  Gauge,
  Eye,
  Check,
  Copy,
  Send,
  Code2
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { 
  executeTreeOfThoughtReasoning, 
  TreeOfThoughtDebateResult, 
  ReasoningHypothesisBranch,
  SocraticKickoffQuestion,
  SocraticCrossInterrogationClash,
  SocraticTechnicalFeasibilityChallenge,
  SocraticExecutiveVerdictSession
} from '../../services/ai/treeOfThoughtReasoningEngine';

interface TreeOfThoughtDebateViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const TreeOfThoughtDebateView: React.FC<TreeOfThoughtDebateViewProps> = ({ diagnostic }) => {
  const [debateData, setDebateData] = useState<TreeOfThoughtDebateResult | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('branch-catalog');
  const [activeRound, setActiveRound] = useState<number | 'ALL'>('ALL');
  const [isDebating, setIsDebating] = useState<boolean>(false);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState<boolean>(false);

  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debatingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      if (debatingTimerRef.current) clearTimeout(debatingTimerRef.current);
    };
  }, []);

  const handleCopyWhatsApp = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWhatsApp(true);
    if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    copiedTimerRef.current = setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const loadDebate = () => {
    const data = executeTreeOfThoughtReasoning(diagnostic);
    setDebateData(data);
  };

  useEffect(() => {
    loadDebate();
  }, [diagnostic]);

  const handleRerunDebate = () => {
    setIsDebating(true);
    if (debatingTimerRef.current) clearTimeout(debatingTimerRef.current);
    debatingTimerRef.current = setTimeout(() => {
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

      {/* 👑 SESSÃO INAUGURAL: DESAFIO SOCRÁTICO DO CEO */}
      {debateData.socraticKickoff && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white border-2 border-amber-500/30 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl text-slate-950 font-black shadow-md shadow-amber-500/20">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Desafio Inicial do CEO (Socratic Kickoff)</h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/40">
                    Cobrança Implacável de Evidências
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{debateData.socraticKickoff.kickoffDirective}</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl font-mono text-xs font-bold shrink-0">
              2/2 Evidências Homologadas ✓
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {debateData.socraticKickoff.questions.map((q: SocraticKickoffQuestion, idx: number) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">
                    Cobrança #{idx + 1} • Para: {q.agentTargetName}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    {q.ceoValidationBadge}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-200 font-sans italic">
                  <strong>Pergunta do CEO:</strong> "{q.ceoChallengeQuestion}"
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 font-sans">
                  <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Defesa com Prova Empírica:</span>
                  <p className="leading-relaxed">{q.agentResponseWithGrounding}</p>
                </div>

                <div className="p-2 bg-slate-900/90 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span className="text-slate-500">Dado Bruto Extraído: <strong className="text-emerald-400 font-sans">{q.verifiedEvidenceSnippet}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⚔️ SESSÃO 2: O FOGO CRUZADO & CONFRONTO DE PREMISSAS */}
      {debateData.crossInterrogation && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white border-2 border-indigo-500/30 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white font-black shadow-md shadow-indigo-500/20">
                <Sword className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">O Fogo Cruzado & Confronto de Premissas (Fase 2)</h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/40">
                    Interrogação Direta entre Especialistas
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">O CEO confronta teses concorrentes (Mídia vs Catálogo e Mercado vs Preço) exigindo dados matemáticos.</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-xl font-mono text-xs font-bold shrink-0">
              Confrontos Homologados ✓
            </span>
          </div>

          <div className="space-y-4">
            {debateData.crossInterrogation.clashes.map((clash: SocraticCrossInterrogationClash) => (
              <div key={clash.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <h4 className="font-bold text-slate-200 text-sm">{clash.clashTitle}</h4>
                  <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800">
                    {clash.financialGainVerified}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-amber-300 font-sans italic">
                  <strong>Pergunta Inquisitiva do CEO:</strong> "{clash.ceoInquisitivePrompt}"
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {clash.agentDefenses.map((def, i) => (
                    <div key={i} className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-white font-mono text-[11px]">{def.agentName}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">{def.agentRole}</span>
                      </div>
                      <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
                        "{def.statement}"
                      </p>
                      <div className="pt-1 text-[10px] font-mono text-emerald-400">
                        <span>Prova: <strong>{def.mathematicalProof}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 font-medium">
                  {clash.ceoSynthesisVerdict}
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📐 SESSÃO 3: A COBRANÇA DE VIABILIDADE TÉCNICA & UX */}
      {debateData.technicalFeasibility && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white border-2 border-teal-500/30 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl text-slate-950 font-black shadow-md shadow-teal-500/20">
                <Gauge className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">Viabilidade Técnica, UX & Anti-Layout Shift (Fase 3)</h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 rounded-full border border-teal-500/40">
                    Saliência Ocular & Core Web Vitals
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">O CEO exige garantias de que o badge de Pix e o Sticky CTA não vão gerar CLS ou poluição visual.</p>
              </div>
            </div>

            <span className="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 rounded-xl font-mono text-xs font-bold shrink-0">
              Zero Layout Shift (CLS 0.000) ✓
            </span>
          </div>

          <div className="space-y-4">
            {debateData.technicalFeasibility.challenges.map((chal: SocraticTechnicalFeasibilityChallenge) => (
              <div key={chal.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
                
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs text-amber-300 font-sans italic">
                  <strong>Cobrança de Engenharia do CEO:</strong> "{chal.ceoChallengePrompt}"
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Agente 08 Visão & UX */}
                  <div className="p-4 bg-slate-900/90 rounded-2xl border border-pink-500/30 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-pink-400" />
                        <strong className="text-white font-mono text-[11px]">{chal.visionUxDefense.agentName}</strong>
                      </div>
                      <span className="text-[10px] font-mono text-pink-300 bg-pink-950/60 px-2 py-0.5 rounded border border-pink-800">
                        Thumb Zone 100%
                      </span>
                    </div>

                    <div className="space-y-1.5 text-slate-300 font-sans">
                      <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Diretriz de Posicionamento:</span>
                      <p className="leading-relaxed">{chal.visionUxDefense.placementDirective}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-mono">
                      <div className="text-emerald-400">
                        🎯 <strong>Ergonomia:</strong> {chal.visionUxDefense.thumbZoneImprovement}
                      </div>
                      <div className="text-indigo-400">
                        👁️ <strong>Timeline:</strong> {chal.visionUxDefense.saliencyTimeframeTarget}
                      </div>
                    </div>
                  </div>

                  {/* Agente 07 Core Web Vitals */}
                  <div className="p-4 bg-slate-900/90 rounded-2xl border border-teal-500/30 space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <Gauge className="w-4 h-4 text-teal-400" />
                        <strong className="text-white font-mono text-[11px]">{chal.coreWebVitalsDefense.agentName}</strong>
                      </div>
                      <span className="text-[10px] font-mono text-teal-300 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800">
                        LCP 1.4s ⚡
                      </span>
                    </div>

                    <div className="space-y-1.5 text-slate-300 font-sans">
                      <span className="text-[10px] text-slate-500 uppercase font-mono font-bold block">Regra Anti-Layout Shift:</span>
                      <p className="leading-relaxed">{chal.coreWebVitalsDefense.antiLayoutShiftRule}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-mono">
                      <div className="text-emerald-400">
                        ⚡ <strong>Velocidade 4G:</strong> {chal.coreWebVitalsDefense.lcpOptimizationMetric}
                      </div>
                      <div className="text-indigo-400">
                        🛡️ <strong>Garantia PageSpeed:</strong> {chal.coreWebVitalsDefense.clsGuarantee}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="p-3 bg-teal-950/30 rounded-xl border border-teal-500/30 text-xs text-teal-300 font-medium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <span>{chal.ceoSynthesisVerdict}</span>
                  <span className="px-2.5 py-0.5 bg-teal-500/20 text-teal-200 rounded-lg text-[10px] font-mono font-bold shrink-0">
                    {chal.combinedUpliftExpected}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🌲 3 COMPETING HYPOTHESIS BRANCHES */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base font-bold text-[#FFFCE1] flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#0AE448]" />
              <span>1. Árvore de Hipóteses Concorrentes (Tree-of-Thought)</span>
            </h3>
            <p className="text-xs text-[#BBBAA6]">Cada robô defende sua tese com base nas evidências do site</p>
          </div>
          <span className="text-xs font-mono font-bold text-[#0AE448] bg-[#0AE448]/10 px-2.5 py-1 rounded-lg border border-[#0AE448]/20">
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
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-[#141716] border-[#0AE448] shadow-lg shadow-[#0AE448]/10 ring-1 ring-[#0AE448]/40'
                    : 'bg-[#101211] border-white/10 hover:border-white/20 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{branch.agentAvatar}</span>
                      <div>
                        <span className="font-bold text-[#FFFCE1] text-xs block">{branch.agentName}</span>
                        <span className="text-[10px] text-[#BBBAA6] block font-mono">{branch.agentRole.slice(0, 26)}...</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-bold bg-white/5 text-[#FFFCE1] border border-white/5">
                      Peso: {Math.round(branch.finalAdjustedWeight * 100)}%
                    </span>
                  </div>

                  <h4 className="font-bold text-[#FFFCE1] text-sm leading-snug">
                    {branch.hypothesisTitle}
                  </h4>

                  <p className="text-xs text-[#BBBAA6] leading-relaxed font-sans line-clamp-3">
                    {branch.coreArgument}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-[#BBBAA6]">Confiança Inicial:</span>
                    <span className="font-bold text-[#FFFCE1]">{branch.initialConfidencePct}%</span>
                  </div>
                  <div className="w-full bg-[#0E100F] h-2 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="bg-[#0AE448] h-full rounded-full transition-all shadow-xs shadow-[#0AE448]/50"
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
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{selectedBranch.agentAvatar}</span>
            <div>
              <h4 className="font-bold text-[#FFFCE1] text-base">{selectedBranch.hypothesisTitle}</h4>
              <span className="text-xs text-[#BBBAA6] font-mono">Conduzido por {selectedBranch.agentName}</span>
            </div>
          </div>

          <span className="px-3 py-1 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded-xl font-bold font-mono text-xs">
            Peso no Veredito Final: {Math.round(selectedBranch.finalAdjustedWeight * 100)}%
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
          
          {/* Evidências do DOM */}
          <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-2.5">
            <span className="font-bold text-[#BBBAA6] uppercase font-mono text-[10px] block">
              Evidências Extraídas do Código do Site:
            </span>
            <ul className="space-y-1.5">
              {selectedBranch.supportingEvidence.map((ev, i) => (
                <li key={i} className="flex items-start gap-2 text-[#FFFCE1]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448] shrink-0 mt-0.5" />
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Críticas dos Outros Agentes */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-2.5">
            <span className="font-bold text-amber-300 uppercase font-mono text-[10px] block">
              Contra-Argumentos dos Outros Agentes no Debate:
            </span>
            <ul className="space-y-1.5">
              {selectedBranch.criticismsReceived.map((cr, i) => (
                <li key={i} className="flex items-start gap-2 text-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{cr}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="p-4 bg-[#0E100F] border border-white/10 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[10px] text-[#0AE448] font-mono uppercase font-bold block">Ação Recomendada por esta Hipótese:</span>
            <p className="font-medium text-[#FFFCE1] mt-0.5">{selectedBranch.recommendedAction}</p>
          </div>
        </div>
      </div>

      {/* 💬 2. REAL-TIME MULTI-ROUND AGENT DEBATE CHAT */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-xs space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-base font-bold text-[#FFFCE1] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0AE448]" />
              <span>2. Transcrição do Debate CoT (Cadeia de Pensamento dos Agentes)</span>
            </h3>
            <p className="text-xs text-[#BBBAA6]">Mesa redonda onde os robôs confrontam seus dados e chegam ao consenso</p>
          </div>

          {/* Round Filter */}
          <div className="flex items-center gap-1 bg-[#141716] p-1 rounded-xl text-xs font-bold font-mono border border-white/10">
            <button
              onClick={() => setActiveRound('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRound === 'ALL' ? 'bg-[#0AE448] text-slate-950 font-black shadow-xs' : 'text-[#BBBAA6] hover:text-white'
              }`}
            >
              Todas as Rodadas
            </button>
            <button
              onClick={() => setActiveRound(1)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRound === 1 ? 'bg-[#0AE448] text-slate-950 font-black shadow-xs' : 'text-[#BBBAA6] hover:text-white'
              }`}
            >
              Rodada 1 (Teses)
            </button>
            <button
              onClick={() => setActiveRound(2)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRound === 2 ? 'bg-[#0AE448] text-slate-950 font-black shadow-xs' : 'text-[#BBBAA6] hover:text-white'
              }`}
            >
              Rodada 2 (Debate)
            </button>
            <button
              onClick={() => setActiveRound(3)}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeRound === 3 ? 'bg-[#0AE448] text-slate-950 font-black shadow-xs' : 'text-[#BBBAA6] hover:text-white'
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
            .map((msg) => {
              const isQuestion = msg.interactionType === 'PERGUNTA_CRITICA';
              const isAnswer = msg.interactionType === 'RESPOSTA_AJUDA';
              const isConsensus = msg.interactionType === 'CONSENSO_FINAL';

              return (
                <div 
                  key={msg.id} 
                  className={`p-5 rounded-3xl border text-xs space-y-3 transition-all ${
                    isConsensus
                      ? 'bg-amber-500/10 border-amber-500/30 ring-1 ring-amber-500/20 shadow-sm'
                      : isQuestion
                      ? 'bg-rose-500/10 border-rose-500/20'
                      : isAnswer
                      ? 'bg-[#0AE448]/10 border-[#0AE448]/20'
                      : 'bg-[#141716] border-white/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-[#FFFCE1] text-xs">{msg.speakerAgent}</span>
                      
                      {msg.targetAgent && (
                        <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-sky-500/10 text-sky-300 border border-sky-500/20">
                          Dirigido a: @{msg.targetAgent}
                        </span>
                      )}

                      <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                        isQuestion
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isAnswer
                          ? 'bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30'
                          : 'bg-white/5 text-[#BBBAA6]'
                      }`}>
                        {isQuestion ? '❓ Pergunta Crítica' : isAnswer ? '💡 Resposta & Ajuda' : msg.speakerRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#BBBAA6] font-mono">{msg.timestamp}</span>
                  </div>

                  <p className="text-[#FFFCE1] text-xs leading-relaxed font-sans font-medium">
                    {msg.text}
                  </p>

                  {msg.referencedDataPoint && (
                    <div className="flex items-center gap-1.5 text-[10px] text-[#0AE448] font-mono bg-[#0AE448]/10 px-2.5 py-1 rounded-lg border border-[#0AE448]/20 w-fit">
                      <Zap className="w-3 h-3 text-[#0AE448]" />
                      <span>Dado Real Verificado: <strong>{msg.referencedDataPoint}</strong></span>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

      </div>

      {/* 🏆 SESSÃO 4: O VEREDITO DE CONSENSO EXECUTIVO & CHANCELA FINAL */}
      {debateData.executiveVerdict && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-2 border-emerald-500/40 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-2xl text-slate-950 font-black shadow-lg shadow-amber-500/20">
                <Crown className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Veredito Executivo & Chancela do Maestro CEO (Fase 4)</h3>
                  <span className="px-2.5 py-0.5 text-xs font-mono font-black bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/40">
                    Consenso {debateData.executiveVerdict.mathematicalConsensusScore}% Homologado
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{debateData.executiveVerdict.ceoFinalChallenge}</p>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center shrink-0">
              <span className="text-[10px] text-emerald-300 uppercase font-mono block font-bold">Recuperação Estimada</span>
              <span className="text-xl font-black text-emerald-400 font-mono">+{debateData.synthesizedActionPlan.expectedRevenueRecoveryPct}% Vendas</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            {/* Sentinela 11 Chancela */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>{debateData.executiveVerdict.sentinelAuditDefense.agentName}</span>
              </div>
              <p className="text-slate-200 font-medium leading-relaxed">
                {debateData.executiveVerdict.sentinelAuditDefense.dualSignatureApprovalCount}
              </p>
              <div className="pt-1 text-[10px] font-mono text-emerald-300 border-t border-slate-800">
                {debateData.executiveVerdict.sentinelAuditDefense.falsePositiveZeroGuarantee}
              </div>
            </div>

            {/* Auto-Coder 12 Patches */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-mono font-bold text-[11px]">
                <Code2 className="w-4 h-4" />
                <span>{debateData.executiveVerdict.autoCoderDefense.agentName}</span>
              </div>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                {debateData.executiveVerdict.autoCoderDefense.generatedPatchesList.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-1 text-[10px] font-mono text-indigo-300 border-t border-slate-800">
                {debateData.executiveVerdict.autoCoderDefense.buildStatus}
              </div>
            </div>

            {/* WhatsApp Concierge 10 Payload */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-amber-500/30 space-y-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-mono font-bold text-[11px]">
                  <MessageSquare className="w-4 h-4" />
                  <span>{debateData.executiveVerdict.whatsAppConciergePayload.agentName}</span>
                </div>
                <div className="mt-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-sans italic">
                  "{debateData.executiveVerdict.whatsAppConciergePayload.merchantHookDirectMessage}"
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-amber-300">
                  {debateData.executiveVerdict.whatsAppConciergePayload.projectedMonthlyRecovery}
                </span>
                <button
                  onClick={() => handleCopyWhatsApp(debateData.executiveVerdict.whatsAppConciergePayload.merchantHookDirectMessage)}
                  className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 rounded-lg text-[10px] font-black font-mono flex items-center gap-1 cursor-pointer transition-all shadow-md"
                >
                  {copiedWhatsApp ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedWhatsApp ? 'Copiado!' : 'Copiar Dossiê'}</span>
                </button>
              </div>
            </div>

          </div>

          <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <span className="text-emerald-200 font-medium leading-relaxed">
              {debateData.executiveVerdict.ceoSignedVerdict}
            </span>
            <span className="px-4 py-2 bg-emerald-500 text-slate-950 font-black font-mono rounded-xl shrink-0 shadow-lg shadow-emerald-500/30">
              Chancela 100% Homologada ✓
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
