import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  Award,
  Zap,
  DollarSign,
  ArrowRight,
  TrendingUp,
  FileText,
  BadgeCheck
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { 
  executeDualAgentCrossVerification, 
  DualAgentConsensusReport, 
  VerifiedFindingConsensus 
} from '../../services/ai/dualAgentConsensusGatekeeper';

interface DualAgentConsensusTribunalViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const DualAgentConsensusTribunalView: React.FC<DualAgentConsensusTribunalViewProps> = ({ diagnostic }) => {
  const [report, setReport] = useState<DualAgentConsensusReport | null>(null);
  const [activeFilter, setActiveFilter] = useState<'APPROVED' | 'INTERCEPTED'>('APPROVED');
  const [isAuditing, setIsAuditing] = useState<boolean>(false);

  const loadConsensusReport = () => {
    const data = executeDualAgentCrossVerification(diagnostic);
    setReport(data);
  };

  useEffect(() => {
    loadConsensusReport();
  }, [diagnostic]);

  const handleRerunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      loadConsensusReport();
      setIsAuditing(false);
    }, 600);
  };

  if (!report) return null;

  return (
    <div className="space-y-8 font-sans animate-fadeIn">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-600 rounded-2xl text-white shadow-md shadow-emerald-500/30">
            <Scale className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Tribunal de Consenso & Dupla Verificação (Zero Falso-Positivo)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                Acurácia: {report.globalConsensusAccuracyPct}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Regra Inquebrável de Grounding: <strong>Nenhuma falha é exibida sem antes ser verificada e co-assinada por pelo menos 2 agentes independentes.</strong>
            </p>
          </div>
        </div>

        <button
          onClick={handleRerunAudit}
          disabled={isAuditing}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <RotateCcw className={`w-4 h-4 ${isAuditing ? 'animate-spin' : ''}`} />
          <span>{isAuditing ? 'Auditando Consenso...' : 'Reavaliar Tribunal com 2 Agentes'}</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Falhas Submetidas</span>
          <span className="text-2xl font-black text-slate-900 font-mono">{report.totalFindingsEvaluated}</span>
          <p className="text-[11px] text-slate-500 font-medium">Inspecionadas pelo enxame</p>
        </div>

        <div className="p-5 bg-emerald-50/70 rounded-3xl border border-emerald-200 shadow-xs space-y-1">
          <span className="text-[10px] text-emerald-700 font-mono uppercase font-bold block">Aprovadas por 2 Agentes</span>
          <span className="text-2xl font-black text-emerald-800 font-mono">{report.approvedFindingsCount} Falhas</span>
          <p className="text-[11px] text-emerald-700 font-medium">100% Confirmadas no DOM ✓</p>
        </div>

        <div className="p-5 bg-purple-50/70 rounded-3xl border border-purple-200 shadow-xs space-y-1">
          <span className="text-[10px] text-purple-700 font-mono uppercase font-bold block">Falsos-Positivos Eliminados</span>
          <span className="text-2xl font-black text-purple-800 font-mono">{report.falsePositivesInterceptedCount} Descartados</span>
          <p className="text-[11px] text-purple-700 font-medium">Bloqueados pelo revisor</p>
        </div>

        <div className="p-5 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xs space-y-1">
          <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block">Índice de Certeza</span>
          <span className="text-2xl font-black text-amber-300 font-mono">{report.globalConsensusAccuracyPct}%</span>
          <p className="text-[11px] text-slate-400 font-medium">Zero alucinação garantida</p>
        </div>

      </div>

      {/* Filter Selector */}
      <div className="flex items-center justify-between p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 text-xs font-bold font-mono">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveFilter('APPROVED')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeFilter === 'APPROVED'
                ? 'bg-white text-emerald-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Falhas Aprovadas com Duplo Visto ({report.approvedFindingsCount})</span>
          </button>

          <button
            onClick={() => setActiveFilter('INTERCEPTED')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              activeFilter === 'INTERCEPTED'
                ? 'bg-white text-purple-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Falsos-Positivos Interceptados ({report.falsePositivesInterceptedCount})</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 pr-3 hidden sm:inline">
          {report.gatekeeperSummary}
        </span>
      </div>

      {/* Cards List */}
      <div className="space-y-4">
        {(activeFilter === 'APPROVED' ? report.verifiedFindings : report.interceptedFalsePositives).map((item) => {
          const isApproved = item.consensusStatus === 'APROVADO_DUPLO_CONSENSO';

          return (
            <div
              key={item.id}
              className={`p-6 rounded-3xl bg-white border-2 shadow-xs space-y-5 transition-all ${
                isApproved ? 'border-slate-200 hover:border-emerald-300' : 'border-purple-200 bg-purple-50/20'
              }`}
            >
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl font-bold font-mono text-xs ${
                    isApproved ? 'bg-emerald-50 text-emerald-700' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {isApproved ? '✅ 2/2 APROVADO' : '🛡️ FALSO-POSITIVO ELIMINADO'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{item.findingTitle}</h3>
                    <span className="text-xs text-slate-400 font-mono">Categoria: {item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-xl font-mono font-bold text-xs">
                    Consenso: {item.consensusScorePct}%
                  </span>
                  {item.financialImpactMonthly > 0 && (
                    <span className="px-3 py-1 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl font-mono font-bold text-xs">
                      R$ {item.financialImpactMonthly.toLocaleString('pt-BR')} / mês
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                {item.findingDescription}
              </p>

              {/* Dual-Agent Voting Box (Proposer VS Reviewer) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                
                {/* Agent 1: Proposing Agent */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">1º Agente (Propositor):</span>
                    <span className="text-indigo-600 font-bold">{item.proposingAgent.confidencePct}% Certeza</span>
                  </div>
                  <strong className="text-slate-900 block font-sans text-xs">{item.proposingAgent.agentName}</strong>
                  <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                    🔍 <strong>Método:</strong> {item.proposingAgent.detectionMethod}
                  </p>
                </div>

                {/* Agent 2: Independent Reviewing Agent */}
                <div className={`p-4 rounded-2xl border space-y-2 ${
                  isApproved ? 'bg-emerald-50/60 border-emerald-200' : 'bg-purple-50/60 border-purple-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] uppercase font-bold ${
                      isApproved ? 'text-emerald-700' : 'text-purple-700'
                    }`}>
                      2º Agente (Revisor Independente):
                    </span>
                    <span className={`font-bold ${isApproved ? 'text-emerald-800' : 'text-purple-800'}`}>
                      {item.reviewingAgent.validationVote} ✓
                    </span>
                  </div>
                  <strong className="text-slate-900 block font-sans text-xs">{item.reviewingAgent.agentName}</strong>
                  <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
                    🛡️ <strong>Checagem:</strong> {item.reviewingAgent.independentVerificationCheck}
                  </p>
                </div>

              </div>

              {/* Raw Verified Evidence Tag */}
              <div className="p-3 bg-slate-900 text-slate-300 rounded-2xl text-[11px] font-mono flex items-center justify-between gap-3">
                <span className="text-slate-400">Evidência Extraída do DOM: <strong className="text-emerald-400">{item.rawEvidenceVerified}</strong></span>
                <span className="text-[10px] text-emerald-400 font-bold uppercase shrink-0">Auditado ao Vivo ✓</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
