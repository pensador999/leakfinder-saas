import React, { useEffect, useState } from 'react';
import { Database, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { circuitBreaker, CircuitState } from '../../lib/circuitBreaker';

export const SupabaseStatusIndicator: React.FC = () => {
  const [circuitState, setCircuitState] = useState<CircuitState>('CLOSED');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const unsubscribe = circuitBreaker.subscribe(stats => {
      setCircuitState(stats.state);
    });
    return () => unsubscribe();
  }, []);

  const handleTestReconnection = () => {
    setIsResetting(true);
    circuitBreaker.reset();
    setTimeout(() => {
      setIsResetting(false);
    }, 800);
  };

  const isLocalOnly = circuitState === 'OPEN';

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium transition-all bg-slate-900/80 border border-slate-800 text-slate-300">
      {isLocalOnly ? (
        <>
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] text-amber-300 font-mono flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            Modo Local Resiliente (Zero Lag)
          </span>
          <button
            onClick={handleTestReconnection}
            disabled={isResetting}
            title="Clique para testar reconexão com a nuvem"
            className="ml-1 text-[10px] text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-0.5"
          >
            <RefreshCw className={`w-2.5 h-2.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reconectar</span>
          </button>
        </>
      ) : (
        <>
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-emerald-300 font-mono flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-400" />
            Nuvem Sincronizada
          </span>
        </>
      )}
    </div>
  );
};
