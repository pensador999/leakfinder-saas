import React, { useState } from 'react';
import { KeyRound, Cpu } from 'lucide-react';

interface MetaAdsConnectTabProps {
  onConnected?: (accountId: string) => void;
}

export const MetaAdsConnectTab: React.FC<MetaAdsConnectTabProps> = ({ onConnected }) => {
  const [accountId, setAccountId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId.trim()) return;
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      if (onConnected) onConnected(accountId);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#0E100F] border border-white/10 rounded-2xl space-y-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#00BAE2]" />
          <span className="font-bold text-xs text-[#FFFCE1]">Meta Ads Graph API (Marketing API v19.0)</span>
        </div>
        <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
          Permite ao AdShield monitorar o gasto diário das campanhas e acionar o Stop-Loss (pausa preventiva de AdSets) quando houver ruptura de estoque no armazém.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#BBBAA6] mb-1">
            ID da Conta de Anúncios (Meta Ads Account ID)
          </label>
          <input
            type="text"
            placeholder="act_10482910482"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
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
          <span>{isConnecting ? 'Conectando ao Meta Graph...' : 'Conectar Meta Ads Graph API'}</span>
        </button>
      </form>
    </div>
  );
};
