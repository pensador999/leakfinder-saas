import React, { useState } from 'react';
import { KeyRound, Activity } from 'lucide-react';

interface Ga4ConnectTabProps {
  onConnected?: (propertyId: string) => void;
}

export const Ga4ConnectTab: React.FC<Ga4ConnectTabProps> = ({ onConnected }) => {
  const [propertyId, setPropertyId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyId.trim()) return;
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      if (onConnected) onConnected(propertyId);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#0E100F] border border-white/10 rounded-2xl space-y-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-xs text-[#FFFCE1]">Google Analytics 4 (Data API)</span>
        </div>
        <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
          Permite correlacionar a taxa de conversão real, engajamento por canal e abandono de sacola com as rupturas de grade da vitrine.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#BBBAA6] mb-1">
            ID da Propriedade GA4 (Measurement ID / Property ID)
          </label>
          <input
            type="text"
            placeholder="ex: 345678912"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448]"
          />
        </div>

        <button
          type="submit"
          disabled={isConnecting}
          className="w-full py-3 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0AE448]/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <KeyRound className="w-4 h-4 text-slate-950" />
          <span>{isConnecting ? 'Conectando ao GA4...' : 'Conectar Google Analytics 4'}</span>
        </button>
      </form>
    </div>
  );
};
