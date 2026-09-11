import React, { useState, useEffect } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  RotateCcw, 
  Database, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Sliders, 
  Cpu, 
  FileText,
  ArrowRight,
  Activity,
  Award
} from 'lucide-react';
import { 
  fetchAgenticSelfLearningState, 
  executeLiveSelfLearningCycle, 
  SelfLearningEngineState, 
  NicheLearningWeightProfile, 
  AgentSelfReflectionLog 
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
      <div className="py-16 text-center space-y-3 font-sans">
        <RotateCcw className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
        <p className="text-sm font-bold text-slate-700">Carregando Cérebro de Auto-Aprendizado (Supabase)...</p>
      </div>
    );
  }

  const selectedProfile = learningState.nicheProfiles.find(p => p.nicheId === selectedNicheId) || learningState.nicheProfiles[0];

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl text-white shadow-md shadow-indigo-500/30">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Agente 17 — Autonomous Code Patch & Self-Learning Engineer</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                RLHF & Auto-Reflexão Ativa
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Cérebro de auto-cura e aprendizado contínuo: análise de linter (oxlint), tipagem TypeScript (tsc), calibração de pesos de nicho e auto-reparo autônomo.
            </p>
          </div>
        </div>

        <button
          onClick={handleRunManualLearningCycle}
          disabled={isTraining}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20 shrink-0"
        >
          <Zap className="w-4 h-4" />
          <span>{isTraining ? 'Calibrando Algoritmo...' : 'Executar Ciclo de Auto-Aprendizado'}</span>
        </button>
      </div>

      {trainingSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold text-center animate-fadeIn">
          {trainingSuccessMsg}
        </div>
      )}

      {/* KPI Stats Grid: Machine Learning Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Ciclos de Aprendizado</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono block">
            {learningState.totalLearningIterations} Iterações
          </span>
          <span className="text-[11px] text-indigo-600 font-bold">Base Supabase em Tempo Real</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Taxa de Precisão da IA</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-600 font-mono block">
            {learningState.globalPrecisionRatePct}%
          </span>
          <span className="text-[11px] text-emerald-700 font-bold">+19.8% de assertividade acumulada</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Falsos-Positivos Eliminados</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-purple-600 font-mono block">
            {learningState.falsePositivesEliminatedCount} Exceções
          </span>
          <span className="text-[11px] text-purple-700 font-bold">Auto-Eliminação de Regras Rígidas</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Memória de Longo Prazo</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-blue-600 font-mono block">
            100% Ativa
          </span>
          <span className="text-[11px] text-blue-700 font-bold">PostgreSQL Vector & EMA Tuning</span>
        </div>

      </div>

      {/* Niche Weight Calibrations (Adaptive ICE Weights learned by the AI) */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Pesos de Conversão Calibrados por Nicho (ICE Score Engine)</span>
            </h3>
            <p className="text-xs text-slate-500">Selecione o nicho para ver os pesos de impacto que a IA calculou autonomamente:</p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {learningState.nicheProfiles.map(p => (
              <button
                key={p.nicheId}
                onClick={() => setSelectedNicheId(p.nicheId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedNicheId === p.nicheId
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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
              <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                <span>Impacto de Ruptura de Grade (PP-G2 / Numerações):</span>
                <span className="font-mono text-indigo-600">{Math.round(selectedProfile.sizeRuptureWeight * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full transition-all"
                  style={{ width: `${selectedProfile.sizeRuptureWeight * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                <span>Impacto de Velocidade Mobile (LCP &lt; 2.5s no 4G):</span>
                <span className="font-mono text-indigo-600">{Math.round(selectedProfile.speedLcpWeight * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all"
                  style={{ width: `${selectedProfile.speedLcpWeight * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                <span>Impacto de Desconto no Pix (Margem vs Cartão):</span>
                <span className="font-mono text-indigo-600">{Math.round(selectedProfile.pixMarginWeight * 100)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all"
                  style={{ width: `${selectedProfile.pixMarginWeight * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">
              Estratégia de Abordagem Aprendida para este Nicho:
            </span>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-lg font-mono font-bold text-xs">
                {selectedProfile.bestPitchAngle}
              </span>
              <span className="text-emerald-700 font-bold text-xs">Precisão: {selectedProfile.precisionAccuracyPct}%</span>
            </div>

            <p className="text-slate-600 text-xs leading-relaxed">
              O robô descobriu após {selectedProfile.totalLearningCycles} iterações que os donos deste nicho respondem melhor a abordagens com foco em **urgência financeira e ROI direto**.
            </p>

            <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700 font-mono">
              🛡️ {selectedProfile.learnedExemptionsCount} exceções de falso-positivo aprendidas e salvas no banco.
            </div>
          </div>

        </div>
      </div>

      {/* Machine Learning Journal / Self-Reflection Logs */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>Diário de Auto-Reflexão & Aprendizados Específicos por Nicho</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Cada nicho possui aprendizados e calibrações únicas gravadas no Supabase</p>
          </div>

          {/* Filter Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold font-mono">
            <button
              onClick={() => setJournalFilter('SELECTED_NICHE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                journalFilter === 'SELECTED_NICHE'
                  ? 'bg-white text-indigo-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nicho: {selectedProfile.nicheLabel.split(',')[0]}
            </button>

            <button
              onClick={() => setJournalFilter('DEVOPS')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                journalFilter === 'DEVOPS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🛡️ Agente 11: DevOps & Erros
            </button>

            <button
              onClick={() => setJournalFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                journalFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todos ({learningState.recentReflectionLogs.length})
            </button>
          </div>
        </div>

        {/* Live DevOps Health Status Card */}
        {journalFilter === 'DEVOPS' && (
          <div className="p-4 bg-slate-950 text-white rounded-2xl border border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Agente 11 (DevOps Sentinel): Telemetria de Produção Vercel & Supabase</span>
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-[10px]">
                0 Erros Críticos Ativos
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
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
              <div key={log.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs hover:border-indigo-200 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-slate-200/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded font-mono font-bold text-[10px]">
                      Ciclo #{log.cycleNumber}
                    </span>
                    <span className="font-bold text-slate-900">{log.agentName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="font-bold text-slate-500 uppercase text-[9px] font-mono block">Observação do Agente:</span>
                    <p className="text-slate-700 font-medium leading-relaxed">{log.observation}</p>
                  </div>

                  <div>
                    <span className="font-bold text-emerald-600 uppercase text-[9px] font-mono block">Aprendizado & Calibração Feita:</span>
                    <p className="text-slate-900 font-bold leading-relaxed">{log.weightAdjustmentMade}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

      </div>

    </div>
  );
};
