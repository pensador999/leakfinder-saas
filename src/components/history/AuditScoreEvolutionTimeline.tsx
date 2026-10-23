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
import { useTranslation } from '../../i18n/useTranslation';

interface AuditScoreEvolutionTimelineProps {
  diagnostic: AgentDiagnosticResult;
  onRefresh?: () => void;
}

export const AuditScoreEvolutionTimeline: React.FC<AuditScoreEvolutionTimelineProps> = ({ 
  diagnostic,
  onRefresh 
}) => {
  const { uiLocale, formatMoney } = useTranslation();
  const isPt = uiLocale === 'pt-BR';
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
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl animate-pulse space-y-4">
        <div className="h-5 w-48 bg-white/10 rounded" />
        <div className="h-20 bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (!evolution || evolution.audits.length === 0) {
    return null;
  }

  const hasMultipleAudits = evolution.audits.length > 1;

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#101211] text-[#FFFCE1] shadow-2xl border border-white/10 relative overflow-hidden font-sans">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0AE448]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold uppercase tracking-wider border border-indigo-500/30 flex items-center gap-1.5">
              <Database className="w-3 h-3 text-indigo-400" />
              {isPt ? 'Persistência Supabase PostgreSQL' : 'Supabase PostgreSQL Persistence'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              • {evolution.totalAuditsRan} {isPt ? 'registro(s) auditado(s)' : 'audited record(s)'}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            {isPt ? 'Linha do Tempo & Evolução de Saúde do E-commerce' : 'E-commerce Health Evolution & Timeline'}
          </h3>
          <p className="text-xs text-slate-400">
            {isPt ? (
              <>Acompanhamento histórico contínuo da marca <strong>{evolution.brandName}</strong> ({evolution.domain}).</>
            ) : (
              <>Continuous historical tracking for <strong>{evolution.brandName}</strong> ({evolution.domain}).</>
            )}
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
              <p className="text-[10px] font-mono uppercase font-bold text-slate-400">{isPt ? 'Evolução do Score' : 'Score Evolution'}</p>
              <p className="text-lg font-black leading-none">
                {evolution.netScoreGain >= 0 ? `+${evolution.netScoreGain}` : evolution.netScoreGain} pts
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3 Executive Evolution KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 relative z-10">
        <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-1">
          <p className="text-[10px] font-mono uppercase font-bold text-[#BBBAA6] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#00BAE2]" />
            {isPt ? 'Score Inicial vs Atual' : 'Initial vs Current Score'}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-slate-500 line-through">
              {evolution.initialScore}
            </span>
            <span className="text-2xl font-black text-[#0AE448]">
              {evolution.currentScore}
            </span>
            <span className="text-xs text-[#BBBAA6]">/ 100</span>
          </div>
          <p className="text-[11px] text-[#BBBAA6]">
            {hasMultipleAudits
              ? (isPt ? `Primeira auditoria em ${new Date(evolution.firstAuditDate).toLocaleDateString('pt-BR')}` : `First audit on ${new Date(evolution.firstAuditDate).toLocaleDateString(uiLocale)}`)
              : (isPt ? 'Primeira auditoria da loja' : 'First store audit')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-1">
          <p className="text-[10px] font-mono uppercase font-bold text-[#BBBAA6] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0AE448]" />
            {isPt ? 'Sangria em Mídia Estancada' : 'Ad Spend Bleed Prevented'}
          </p>
          <p className="text-2xl font-black text-[#0AE448] font-mono">
            {evolution.totalMonthlyWastePrevented > 0 
              ? `+${formatMoney(evolution.totalMonthlyWastePrevented)}${isPt ? '/mês' : '/mo'}` 
              : (isPt ? 'Grade Blindada' : 'Shielded Grid')}
          </p>
          <p className="text-[11px] text-[#BBBAA6]">
            {isPt ? 'Economia contínua de verba de tráfego' : 'Continuous paid traffic savings'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-1">
          <p className="text-[10px] font-mono uppercase font-bold text-[#BBBAA6] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#00BAE2]" />
            {isPt ? 'Status da Telemetria' : 'Telemetry Status'}
          </p>
          <p className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0AE448] animate-pulse" />
            {isPt ? 'Sincronizado ao Vivo' : 'Synced Live'}
          </p>
          <p className="text-[11px] text-[#BBBAA6] font-mono">
            {isPt ? 'Última checagem:' : 'Last check:'} {new Date(evolution.latestAuditDate).toLocaleTimeString(uiLocale, { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      {/* Visual Timeline Nodes */}
      <div className="space-y-3 relative z-10">
        <p className="text-[10px] font-mono uppercase font-bold text-[#BBBAA6] tracking-wider">
          {isPt ? 'Histórico Granular de Varreduras' : 'Granular Scan History'}
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
                    ? 'bg-[#141716] border-[#0AE448]/40 shadow-inner'
                    : 'bg-[#141716]/60 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                    audit.isCurrent ? 'bg-[#0AE448] text-slate-950 font-black' : 'bg-white/10 text-[#BBBAA6]'
                  }`}>
                    #{evolution.audits.length - idx}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">
                        {isToday ? (isPt ? 'Hoje' : 'Today') : auditDate.toLocaleDateString(uiLocale)} {isPt ? 'às' : 'at'} {auditDate.toLocaleTimeString(uiLocale, { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {audit.isCurrent && (
                        <span className="px-2 py-0.5 rounded-md bg-[#0AE448]/20 text-[#0AE448] text-[10px] font-mono font-bold border border-[#0AE448]/30">
                          {isPt ? 'AUDITORIA ATIVA' : 'ACTIVE AUDIT'}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#BBBAA6]">
                      {audit.brokenSkusCount > 0 
                        ? (isPt ? `${audit.brokenSkusCount} SKU(s) com ruptura de grade` : `${audit.brokenSkusCount} SKU(s) with size grid stockouts`)
                        : (isPt ? 'Grade 100% Blindada e Saudável' : '100% Shielded & Healthy Size Grid')}
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
