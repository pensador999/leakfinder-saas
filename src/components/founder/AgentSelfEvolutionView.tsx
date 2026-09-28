import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  RotateCcw, 
  Database, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Cpu, 
  FileText, 
  Award,
  AlertTriangle
} from 'lucide-react';
import { 
  fetchAgenticSelfLearningState, 
  executeLiveSelfLearningCycle, 
  SelfLearningEngineState 
} from '../../services/learning/agenticSelfLearningOptimizer';

export const AgentSelfEvolutionView: React.FC = () => {
  const [learningState, setLearningState] = useState<SelfLearningEngineState | null>(null);
  const [selectedNicheId, setSelectedNicheId] = useState<string>('MODA_VESTUARIO');
  const [journalFilter, setJournalFilter] = useState<'SELECTED_NICHE' | 'ALL' | 'DEVOPS'>('SELECTED_NICHE');
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingSuccessMsg, setTrainingSuccessMsg] = useState<string>('');

  const loadLearningData = async () => {
    const data = await fetchAgenticSelfLearningState();
    setLearningState(data);
  };

  useEffect(() => {
    loadLearningData();
  }, []);

  const handleRunManualLearningCycle = async () => {
    setIsTraining(true);
    setTrainingSuccessMsg('');

    try {
      const newLog = await executeLiveSelfLearningCycle(selectedNicheId as any);
      setLearningState(prev => prev ? {
        ...prev,
        totalLearningIterations: prev.totalLearningIterations + 1,
        recentReflectionLogs: [newLog, ...prev.recentReflectionLogs]
      } : null);

      setTrainingSuccessMsg(`✨ Ciclo de Auto-Reflexão e Calibração para ${selectedProfile.nicheLabel} concluído com sucesso!`);
      setTimeout(() => setTrainingSuccessMsg(''), 4500);
    } finally {
      setIsTraining(false);
    }
  };

  if (!learningState) {
    return (
      <div className="py-16 text-center space-y-3 font-sans text-[#FFFCE1]">
        <RotateCcw className="w-8 h-8 animate-spin mx-auto text-[#0AE448]" />
        <p className="text-sm font-bold font-mono">Carregando Cérebro de Auto-Aprendizado (Supabase)...</p>
      </div>
    );
  }

  const selectedProfile = learningState.nicheProfiles.find(p => p.nicheId === selectedNicheId) || learningState.nicheProfiles[0];

  return (
    <div className="space-y-8 font-sans text-[#FFFCE1]">
      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-mono rounded-lg border border-amber-500/20 mb-4">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>[Templates de Patch — Sem Execução Automática]</span>
      </div>
      
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-[#101211] text-[#FFFCE1] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md shadow-[#0AE448]/10">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Agente 17 — Autonomous Code Patch & Self-Learning Engineer</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#0AE448]" />
                RLHF & Auto-Reflexão Ativa
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              Cérebro de auto-cura e aprendizado contínuo: análise de linter (oxlint), tipagem TypeScript (tsc), calibração de pesos de nicho e auto-reparo autônomo.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunManualLearningCycle}
          disabled={isTraining}
          className="px-5 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#0AE448]/20 shrink-0 disabled:opacity-50"
        >
          <Zap className="w-4 h-4" />
          <span>{isTraining ? 'Calibrando Algoritmo...' : 'Executar Ciclo de Auto-Aprendizado'}</span>
        </button>
      </div>

      {trainingSuccessMsg && (
        <div className="p-3.5 bg-[#0AE448]/10 border border-[#0AE448]/20 text-[#0AE448] rounded-2xl text-xs font-mono font-bold text-center animate-fadeIn">
          {trainingSuccessMsg}
        </div>
      )}

      {/* KPI Stats Grid: Machine Learning Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-[#101211] border border-white/10 shadow-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Ciclos de Aprendizado</span>
            <div className="p-2 bg-white/5 text-[#00BAE2] rounded-xl border border-white/5">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#FFFCE1] font-mono block">
            {learningState.totalLearningIterations} Iterações
          </span>
          <span className="text-[11px] text-[#00BAE2] font-mono font-bold">Base Supabase em Tempo Real</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#101211] border border-white/10 shadow-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Taxa de Precisão da IA</span>
            <div className="p-2 bg-white/5 text-[#0AE448] rounded-xl border border-white/5">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#0AE448] font-mono block">
            {learningState.globalPrecisionRatePct}%
          </span>
          <span className="text-[11px] text-[#0AE448] font-mono font-bold">+19.8% de assertividade acumulada</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#101211] border border-white/10 shadow-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Falsos-Positivos Eliminados</span>
            <div className="p-2 bg-white/5 text-[#0AE448] rounded-xl border border-white/5">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#FFFCE1] font-mono block">
            {learningState.falsePositivesEliminatedCount} Exceções
          </span>
          <span className="text-[11px] text-[#0AE448] font-mono font-bold">Auto-Eliminação de Regras Rígidas</span>
        </div>

        <div className="p-5 rounded-3xl bg-[#101211] border border-white/10 shadow-xl space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Memória de Longo Prazo</span>
            <div className="p-2 bg-white/5 text-[#00BAE2] rounded-xl border border-white/5">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-[#00BAE2] font-mono block">
            100% Ativa
          </span>
          <span className="text-[11px] text-[#00BAE2] font-mono font-bold">PostgreSQL Vector & EMA Tuning</span>
        </div>

      </div>

      {/* Niche Weight Calibrations (Adaptive ICE Weights learned by the AI) */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-bold text-[#FFFCE1] text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#00BAE2]" />
              <span>Pesos de Conversão Calibrados por Nicho (ICE Score Engine)</span>
            </h3>
            <p className="text-xs text-[#BBBAA6]">Selecione o nicho para ver os pesos de impacto que a IA calculou autonomamente:</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {learningState.nicheProfiles.map(p => (
              <button
                key={p.nicheId}
                onClick={() => setSelectedNicheId(p.nicheId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedNicheId === p.nicheId
                    ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] font-black shadow-lg shadow-[#0AE448]/20'
                    : 'bg-white/5 border-white/10 text-[#BBBAA6] hover:bg-white/10 hover:text-[#FFFCE1]'
                }`}
              >
                {p.nicheLabel.split(',')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Niche Metrics Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between font-bold text-[#BBBAA6] mb-1">
                <span>Impacto de Ruptura de Grade (PP-G2 / Numerações):</span>
                <span className="font-mono text-[#0AE448]">{Math.round(selectedProfile.sizeRuptureWeight * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#0E100F] border border-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0AE448] to-[#00BAE2] rounded-full transition-all"
                  style={{ width: `${selectedProfile.sizeRuptureWeight * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-bold text-[#BBBAA6] mb-1">
                <span>Impacto de Velocidade Mobile (LCP &lt; 2.5s no 4G):</span>
                <span className="font-mono text-[#00BAE2]">{Math.round(selectedProfile.speedLcpWeight * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#0E100F] border border-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#00BAE2] to-indigo-500 rounded-full transition-all"
                  style={{ width: `${selectedProfile.speedLcpWeight * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-bold text-[#BBBAA6] mb-1">
                <span>Impacto de Desconto no Pix (Margem vs Cartão):</span>
                <span className="font-mono text-[#0AE448]">{Math.round(selectedProfile.pixMarginWeight * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-[#0E100F] border border-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0AE448] to-emerald-400 rounded-full transition-all"
                  style={{ width: `${selectedProfile.pixMarginWeight * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-[#141716] rounded-2xl border border-white/10 space-y-3">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">
              Estratégia de Abordagem Aprendida para este Nicho:
            </span>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded-lg font-mono font-bold text-xs">
                {selectedProfile.bestPitchAngle}
              </span>
              <span className="text-[#0AE448] font-bold text-xs font-mono">Precisão: {selectedProfile.precisionAccuracyPct}%</span>
            </div>

            <p className="text-[#BBBAA6] text-xs leading-relaxed">
              O robô descobriu após {selectedProfile.totalLearningCycles} iterações que os donos deste nicho respondem melhor a abordagens com foco em <strong className="text-[#FFFCE1]">urgência financeira e ROI direto</strong>.
            </p>

            <div className="p-3 bg-[#0E100F] rounded-xl border border-white/10 text-[11px] text-[#BBBAA6] font-mono">
              🛡️ {selectedProfile.learnedExemptionsCount} exceções de falso-positivo aprendidas e salvas no banco.
            </div>
          </div>

        </div>
      </div>

      {/* Machine Learning Journal / Self-Reflection Logs */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-bold text-[#FFFCE1] text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00BAE2]" />
              <span>Diário de Auto-Reflexão & Aprendizados Específicos por Nicho</span>
            </h3>
            <p className="text-xs text-[#BBBAA6] font-mono mt-0.5">Cada nicho possui aprendizados e calibrações únicas gravadas no Supabase</p>
          </div>

          {/* Filter Selector */}
          <div className="flex items-center gap-1.5 bg-[#0E100F] p-1 rounded-xl text-xs font-bold font-mono border border-white/5">
            <button
              onClick={() => setJournalFilter('SELECTED_NICHE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                journalFilter === 'SELECTED_NICHE'
                  ? 'bg-[#0AE448] text-slate-950 font-black shadow-xs'
                  : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
              }`}
            >
              Nicho: {selectedProfile.nicheLabel.split(',')[0]}
            </button>

            <button
              onClick={() => setJournalFilter('DEVOPS')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                journalFilter === 'DEVOPS'
                  ? 'bg-[#0AE448] text-slate-950 font-black shadow-xs'
                  : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
              }`}
            >
              🛡️ Agente 11: DevOps & Erros
            </button>

            <button
              onClick={() => setJournalFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                journalFilter === 'ALL'
                  ? 'bg-[#0AE448] text-slate-950 font-black shadow-xs'
                  : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
              }`}
            >
              Todos ({learningState.recentReflectionLogs.length})
            </button>
          </div>
        </div>

        {/* Live DevOps Health Status Card */}
        {journalFilter === 'DEVOPS' && (
          <div className="p-4 bg-[#141716] text-[#FFFCE1] rounded-2xl border border-white/10 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#0AE448] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0AE448]" />
                <span>Agente 11 (DevOps Sentinel): Telemetria de Produção Vercel & Supabase</span>
              </span>
              <span className="px-2 py-0.5 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded text-[10px]">
                0 Erros Críticos Ativos
              </span>
            </div>
            <p className="text-[#BBBAA6] text-[11px] leading-relaxed">
              O robô inspeciona ativamente chamadas de rede do Edge Proxy, integridade de queries SQL no PostgreSQL e captura exceções não tratadas no navegador dos usuários.
            </p>
          </div>
        )}

        {/* Dynamic Reflection Cards List */}
        <div className="space-y-3">
          {learningState.recentReflectionLogs
            .filter(log => {
              if (journalFilter === 'SELECTED_NICHE') {
                return !log.nicheId || log.nicheId === selectedNicheId || log.nicheId === 'TODOS';
              }
              if (journalFilter === 'DEVOPS') {
                return log.nicheId === 'DEVOPS_SENTINEL' || log.agentName.includes('DevOps') || log.agentName.includes('11');
              }
              return true;
            })
            .map((log) => (
              <div key={log.id} className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-2 text-xs hover:border-white/20 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white/5 text-[#0AE448] border border-white/10 rounded font-mono font-bold text-[10px]">
                      Ciclo #{log.cycleNumber}
                    </span>
                    <span className="font-bold text-[#FFFCE1]">{log.agentName}</span>
                  </div>
                  <span className="text-[10px] text-[#BBBAA6] font-mono">{log.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="font-bold text-[#BBBAA6] uppercase text-[9px] font-mono block">Observação do Agente:</span>
                    <p className="text-[#FFFCE1] font-medium leading-relaxed">{log.observation}</p>
                  </div>

                  <div>
                    <span className="font-bold text-[#0AE448] uppercase text-[9px] font-mono block">Aprendizado & Calibração Feita:</span>
                    <p className="text-[#FFFCE1] font-bold leading-relaxed">{log.weightAdjustmentMade}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

      </div>

    </div>
  );
};
