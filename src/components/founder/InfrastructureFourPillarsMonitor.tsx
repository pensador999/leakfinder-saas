import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  GitBranch, 
  Layers, 
  Database, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Cpu, 
  Activity, 
  ShieldCheck,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { 
  FourPillarsHealthReport, 
  probeAllPillarsLive 
} from '../../services/infrastructure/livePillarHealthService';
import { circuitBreaker } from '../../lib/circuitBreaker';

export const InfrastructureFourPillarsMonitor: React.FC = () => {
  const [report, setReport] = useState<FourPillarsHealthReport | null>(null);
  const [isProbing, setIsProbing] = useState<boolean>(false);

  const runProbe = async () => {
    setIsProbing(true);
    try {
      const data = await probeAllPillarsLive();
      setReport(data);
    } catch {
      // ignore
    } finally {
      setTimeout(() => setIsProbing(false), 500);
    }
  };

  useEffect(() => {
    runProbe();
  }, []);

  const getPillarIcon = (id: string) => {
    switch (id) {
      case 'internet': return <Globe className="w-5 h-5 text-sky-400" />;
      case 'github': return <GitBranch className="w-5 h-5 text-purple-400" />;
      case 'vercel': return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'database': return <Database className="w-5 h-5 text-amber-400" />;
      default: return <Activity className="w-5 h-5 text-indigo-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            100% OPERACIONAL
          </span>
        );
      case 'OFFLINE_RESILIENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Zap className="w-3 h-3 text-amber-400" />
            MODO LOCAL RESILIENTE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3 h-3 text-rose-400" />
            INSTÁVEL
          </span>
        );
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl space-y-6">
      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-mono rounded-lg border border-amber-500/20 mb-4">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>[Telemetria Simulada via localStorage]</span>
      </div>
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl shadow-inner">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Agente 16 — DevOps Sentinel & Circuit Breaker</h3>
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase font-extrabold bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                SLA: 99.98%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditoria ativa dos 4 pilares de resiliência: Cloudflare Edge, GitHub CI/CD, Borda Vercel e Dual-Persistence (Local + Supabase).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
          {report && (
            <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
              Último ping: {report.timestamp}
            </span>
          )}
          <button
            onClick={runProbe}
            disabled={isProbing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/30 hover:scale-105 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProbing ? 'animate-spin' : ''}`} />
            <span>{isProbing ? 'Auditando Pilares...' : 'Executar Ping 360º'}</span>
          </button>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {report?.pillars.map((pillar) => (
          <div 
            key={pillar.id}
            className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-sm"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                  {getPillarIcon(pillar.id)}
                </div>
                {getStatusBadge(pillar.status)}
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                  {pillar.category}
                </span>
                <h4 className="text-sm font-bold text-white mt-0.5">
                  {pillar.name}
                </h4>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {pillar.details}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 text-[10px]">{pillar.metricLabel}:</span>
              <span className="font-bold text-emerald-400">{pillar.metricValue}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Grounding Note */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong className="text-slate-200">Arquitetura Tolerante a Falhas:</strong> O SaaS nunca trava em quedas externas graças ao Circuit Breaker e persistência híbrida em disco.
          </span>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
          <span className="text-slate-400">Deploy Ativo:</span>
          <a 
            href="https://adshield.vercel.app/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-bold"
          >
            <span>adshield.vercel.app</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
};
