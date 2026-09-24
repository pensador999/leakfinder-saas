import React, { useState } from 'react';
import { Network, RefreshCw, AlertTriangle } from 'lucide-react';
import { 
  fetchMagis5Audit, 
  saveMagis5Config, 
  Magis5ConnectionConfig 
} from '../../services/integrations/magis5HubService';
import { Magis5AuditedProduct } from '../../../api/magis5/sync';

interface Magis5ConnectTabProps {
  initialConfig: Magis5ConnectionConfig | null;
  onConnected?: (config: Magis5ConnectionConfig) => void;
}

export const Magis5ConnectTab: React.FC<Magis5ConnectTabProps> = ({
  initialConfig,
  onConnected
}) => {
  const [tokenInput, setTokenInput] = useState(initialConfig?.apiToken || '');
  const [isAuditing, setIsAuditing] = useState(false);
  const [products, setProducts] = useState<Magis5AuditedProduct[]>([]);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditing(true);
    try {
      const config: Magis5ConnectionConfig = {
        apiToken: tokenInput.trim() || 'mg5_live_brk_tok_99182',
        isConnected: true,
        lastSyncAt: new Date().toISOString()
      };
      saveMagis5Config(config);
      if (onConnected) onConnected(config);

      const res = await fetchMagis5Audit({
        apiToken: config.apiToken
      });

      setProducts(res.products || []);
    } catch (err) {
      console.error('[Magis5 Tab Error]:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#0E100F] border border-white/10 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[#00BAE2]" />
            <span className="font-bold text-xs text-[#FFFCE1]">Magis5 Hub Integrador (Marketplaces)</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#00BAE2]/20 text-[#00BAE2] border border-[#00BAE2]/30">
            MERCADO LIVRE • SHOPEE
          </span>
        </div>
        <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
          Monitora anúncios espelhados nos marketplaces. Se a Magis5 pausou um anúncio no Mercado Livre para proteger a reputação por falta de estoque, o AdShield usa essa evidência para cessar a queima no Meta Ads.
        </p>

        <form onSubmit={handleAudit} className="space-y-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-[#BBBAA6] mb-1">Chave de API / App Token (Magis5)</label>
            <input
              type="password"
              placeholder="mg5_live_token_xxxxxxxxxxxxxxxx"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full px-3 py-2 bg-[#141716] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448]"
            />
          </div>

          <button
            type="submit"
            disabled={isAuditing}
            className="w-full py-2.5 bg-[#00BAE2] hover:bg-[#00BAE2]/90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#00BAE2]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
            <span>{isAuditing ? 'Consultando Magis5...' : 'Auditar Status nos Marketplaces'}</span>
          </button>
        </form>
      </div>

      {products.length > 0 && (
        <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#FFFCE1] font-mono">
              Anúncios Sincronizados na Magis5 ({products.length})
            </span>
            <span className="text-[10px] font-mono text-[#00BAE2] bg-[#00BAE2]/10 px-2 py-0.5 rounded border border-[#00BAE2]/30">
              STATUS MULTICANAL
            </span>
          </div>

          <div className="space-y-2">
            {products.map((p) => (
              <div key={p.sku} className="p-3 bg-[#0E100F] border border-white/10 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#FFFCE1]">{p.nome}</span>
                    <div className="text-[10px] text-[#BBBAA6] font-mono">SKU: {p.sku}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    p.pausadoNosMarketplaces ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-[#0AE448] border border-emerald-500/30'
                  }`}>
                    {p.pausadoNosMarketplaces ? 'PAUSADO NO ML' : 'ATIVO NO ML'}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                  {p.canais.map((c) => (
                    <div key={c.marketplace} className="px-2 py-1 bg-white/5 rounded-lg border border-white/10 flex items-center gap-1.5">
                      <span className="text-[#BBBAA6]">{c.marketplace}:</span>
                      <span className={c.status === 'PAUSADO_ESTOQUE_ZERO' ? 'text-rose-400 font-bold' : 'text-[#0AE448] font-bold'}>
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>

                {p.discrepanciaComShopify && (
                  <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-[10px] font-mono flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{p.alertaRisco}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
