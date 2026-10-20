import React, { useEffect, useState } from 'react';
import { Cloud, Database, RefreshCw } from 'lucide-react';
import { circuitBreaker } from '../../lib/circuitBreaker';
import { isSupabaseConfigured } from '../../lib/supabase';

export const SupabaseStatusIndicator: React.FC = () => {
  const [isAutoSyncing, setIsAutoSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = circuitBreaker.subscribe(stats => {
      setIsAutoSyncing(stats.isAutoSyncing || false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div 
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all bg-[#0AE448]/10 border border-[#0AE448]/30 text-[#0AE448] shadow-xs backdrop-blur-xs select-none"
      title={isSupabaseConfigured ? 'Nuvem & Telemetria Durável Ativa' : 'Cofre Local-First Ativo no Navegador (Zero Dependência Externa)'}
    >
      <div className="relative flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-[#0AE448]" />
        <div className="absolute w-3.5 h-3.5 rounded-full bg-[#0AE448]/30 animate-ping" />
      </div>

      <span className="text-[11px] text-[#FFFCE1] font-mono flex items-center gap-1.5 font-bold">
        {isAutoSyncing ? (
          <>
            <RefreshCw className="w-3 h-3 text-[#0AE448] animate-spin" />
            <span>Sincronizando...</span>
          </>
        ) : isSupabaseConfigured ? (
          <>
            <Cloud className="w-3.5 h-3.5 text-[#0AE448]" />
            <span>Nuvem Sincronizada</span>
          </>
        ) : (
          <>
            <Database className="w-3.5 h-3.5 text-[#0AE448]" />
            <span>Local-First Vault</span>
          </>
        )}
      </span>

      <span className="text-[9px] bg-[#0AE448]/20 text-[#0AE448] px-1.5 py-0.2 rounded font-mono font-bold border border-[#0AE448]/30">
        24/7 Ativo
      </span>
    </div>
  );
};

