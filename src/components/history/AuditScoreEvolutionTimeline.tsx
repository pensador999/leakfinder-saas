import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  Sparkles,
  Database,
  History
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { 
  getStoreAuditEvolution, 
  StoreEvolutionSummary, 
  AuditHistoryEntry 
} from '../../services/history/storeAuditHistoryService';

interface AuditScoreEvolutionTimelineProps {
  diagnostic: AgentDiagnosticResult;
  onRefresh?: () => void;
}

export const AuditScoreEvolutionTimeline: React.FC<AuditScoreEvolutionTimelineProps> = ({ 
  diagnostic,
  onRefresh 
}) => {
  const [evolution, setEvolution] = useState<StoreEvolutionSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getStoreAuditEvolution(diagnostic.realSiteData.domain, diagnostic).then(data => {
      if (isMounted) {
        setEvolution(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [diagnostic]);

  if (isLoading) {
    return (
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm animate-pulse space-y-4">
        <div className="h-5 w-48 bg-slate-200 rounded" />
        <div className="h-20 bg-slate-100 rounded-2xl" />
      </div>
    );
  }

  if (!evolution || evolution.audits.length === 0) {
    return null;
  }

  const hasMultipleAudits = evolution.audits.length > 1;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white shadow-xl border border-slate-800/80 relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1.5">
              <Database className="w-3 h-3 text-indigo-400" />
              Persistência Supabase PostgreSQL
            </span>
            <span className="text-xs text-slate-400 font-mono">
              • {evolution.totalAuditsRan} registro(s) auditado(s)
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Linha do Tempo & Evolução de Saúde do E-commerce
          </h3>
          <p className="text-xs text-slate-400">
            Acompanhamento histórico contínuo da marca <strong>{evolution.brandName}</strong> ({evolution.domain}).
          </p>
        </div>

        {/* Global Delta Badge */}
        {hasMultipleAudits && (
          <div className={`px-4 py-2.5 rounded-2xl border flex items-center gap-3 shrink-0 ${
            evolution.netScoreGain >= 0 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            <div className={`p-2 rounded-xl ${evolution.netScoreGain >= 0 ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
              {evolution.netScoreGain >= 0 ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase font-bold text-slate-400">Evolução do Score</p>
              <p className="text-lg font-black leading-none">
                {evolution.netScoreGain >= 0 ? `+${evolution.netScoreGain}` : evolution.netScoreGain} pts
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3 Executive Evolution KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 relative z-10">
        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm space-y-1">
          <p className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Score Inicial vs Atual
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-400 line-through">
              {evolution.initialScore}
            </span>
            <span className="text-2xl font-black text-emerald-400">
              {evolution.currentScore}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <p className="text-[11px] text-slate-400">
            {hasMultipleAudits ? `Primeira auditoria em ${new Date(evolution.firstAuditDate).toLocaleDateString('pt-BR')}` : 'Primeira auditoria da loja'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm space-y-1">
          <p className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Sangria em Mídia Estancada
          </p>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            {evolution.totalMonthlyWastePrevented > 0 
              ? `+R$ ${evolution.totalMonthlyWastePrevented.toLocaleString('pt-BR')}/mês` 
              : 'Grade Blindada'}
          </p>
          <p className="text-[11px] text-slate-400">
            Economia contínua de verba de tráfego
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 backdrop-blur-sm space-y-1">
          <p className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            Status da Telemetria
          </p>
          <p className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Sincronizado ao Vivo
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Última checagem: {new Date(evolution.latestAuditDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Visual Timeline Nodes */}
      <div className="space-y-3 relative z-10">
        <p className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider">
          Histórico Granular de Varreduras
        </p>
        
        <div className="space-y-2">
          {evolution.audits.map((audit, idx) => {
            const auditDate = new Date(audit.auditedAt);
            const isToday = auditDate.toDateString() === new Date().toDateString();

            return (
              <div 
                key={audit.id}
                className={`p-3.5 sm:p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  audit.isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-inner'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                    audit.isCurrent ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{evolution.audits.length - idx}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">
                        {isToday ? 'Hoje' : auditDate.toLocaleDateString('pt-BR')} às {auditDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {audit.isCurrent && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/30">
                          AUDITORIA ATIVA
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      {audit.brokenSkusCount > 0 
                        ? `${audit.brokenSkusCount} SKU(s) com ruptura de grade` 
                        : 'Grade 100% Blindada e Saudável'}
                    </p>
                  </div>
                </div>

                {/* Score and Delta */}
                <div className="flex items-center gap-4 self-end sm:self-auto">
                  {audit.scoreDelta !== undefined && audit.scoreDelta !== 0 && (
                    <span className={`text-xs font-mono font-bold flex items-center gap-0.5 ${
                      audit.scoreDelta > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {audit.scoreDelta > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {audit.scoreDelta > 0 ? `+${audit.scoreDelta}` : audit.scoreDelta} pts
                    </span>
                  )}

                  <div className="text-right">
                    <span className="text-lg font-black text-white font-mono">
                      {audit.growthScore}
                    </span>
                    <span className="text-xs text-slate-400 font-normal"> / 100</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
