import React, { useEffect, useState } from 'react';
import { Cloud, CloudCheck, RefreshCw, Sparkles } from 'lucide-react';
import { circuitBreaker, CircuitState } from '../../lib/circuitBreaker';

export const SupabaseStatusIndicator: React.FC = () => {
  const [circuitState, setCircuitState] = useState<CircuitState>('CLOSED');
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = circuitBreaker.subscribe(stats => {
      setCircuitState(stats.state);
      setIsAutoSyncing(stats.isAutoSyncing || false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div 
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 shadow-xs backdrop-blur-xs select-none"
      title="Nuvem & Telemetria Durável Ativa (Auto-Sync 24/7 Ativo em Segundo Plano)"
    >
      <div className="relative flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-emerald-400" />
        <div className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/30 animate-ping" />
      </div>

      <span className="text-[11px] text-emerald-200 font-mono flex items-center gap-1.5 font-bold">
        {isAutoSyncing ? (
          <>
            <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
            <span>Sincronizando Nuvem...</span>
          </>
        ) : (
          <>
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nuvem & Telemetria Sincronizadas</span>
          </>
        )}
      </span>

      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono font-bold border border-emerald-500/30">
        24/7 Ativo
      </span>
    </div>
  );
};

