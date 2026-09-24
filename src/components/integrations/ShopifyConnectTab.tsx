import React, { useState } from 'react';
import { 
  ShoppingBag, 
  KeyRound, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { 
  startShopifyOAuthHandshake, 
  syncShopifyPhysicalInventory, 
  ShopifyConnectionInfo 
} from '../../services/shopify/shopifyOAuthService';
import { AuditedInventorySku } from '../../../api/shopify/sync';

interface ShopifyConnectTabProps {
  activeConnection: ShopifyConnectionInfo | null;
  domain: string;
  onConnectedManual?: (shopDomain: string) => void;
}

export const ShopifyConnectTab: React.FC<ShopifyConnectTabProps> = ({
  activeConnection,
  domain,
  onConnectedManual
}) => {
  const [connectMethod, setConnectMethod] = useState<'oauth' | 'manual'>('oauth');
  const [shopDomainInput, setShopDomainInput] = useState(domain || '');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuditingInventory, setIsAuditingInventory] = useState(false);
  const [auditedSkus, setAuditedSkus] = useState<AuditedInventorySku[]>([]);

  const handleStartOAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopDomainInput.trim()) return;
    setIsConnecting(true);
    try {
      startShopifyOAuthHandshake(shopDomainInput);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao iniciar fluxo OAuth';
      alert(msg);
      setIsConnecting(false);
    }
  };

  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      if (onConnectedManual) onConnectedManual(shopDomainInput);
    }, 1200);
  };

  const handleRunAudit = async () => {
    setIsAuditingInventory(true);
    try {
      const res = await syncShopifyPhysicalInventory(shopDomainInput || 'brkagro.myshopify.com');
      setAuditedSkus(res.skus);
    } catch (err) {
      console.warn('[Shopify Inventory Audit Error]:', err);
    } finally {
      setIsAuditingInventory(false);
    }
  };

  if (activeConnection) {
    return (
      <div className="space-y-4">
        <div className="p-5 rounded-2xl bg-[#0AE448]/10 border border-[#0AE448]/30 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-[#0AE448]/20 text-[#0AE448] flex items-center justify-center mx-auto shadow-xs border border-[#0AE448]/30">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-sm text-[#FFFCE1]">Loja Conectada via Shopify Admin API!</h4>
          <p className="text-xs text-[#BBBAA6] max-w-md mx-auto">
            Loja: <strong className="text-[#FFFCE1] font-mono">{activeConnection.shopDomain}</strong>
          </p>
          <div className="flex items-center justify-center gap-2 pt-1">
            <button
              onClick={handleRunAudit}
              disabled={isAuditingInventory}
              className="px-4 py-2 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-[#0AE448]/20 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditingInventory ? 'animate-spin' : ''}`} />
              <span>{isAuditingInventory ? 'Auditando Armazém...' : 'Auditar Estoque Físico Agora'}</span>
            </button>
          </div>
        </div>

        {auditedSkus.length > 0 && (
          <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#FFFCE1] font-mono">
                Resultado da Auditoria Shopify ({auditedSkus.length} SKUs)
              </span>
              <span className="text-[10px] font-mono text-[#0AE448] bg-[#0AE448]/10 px-2 py-0.5 rounded border border-[#0AE448]/30">
                GraphQL API 2026-01
              </span>
            </div>

            <div className="space-y-2">
              {auditedSkus.map((sku) => (
                <div key={sku.sku} className="p-3 bg-[#0E100F] border border-white/10 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-[#FFFCE1]">{sku.productTitle}</div>
                    <div className="text-[11px] text-[#BBBAA6] font-mono">SKU: {sku.sku} • {sku.variantTitle}</div>
                    {sku.warningMessage && (
                      <div className="text-[11px] text-rose-400 font-bold mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{sku.warningMessage}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right font-mono">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      sku.isGhostInventory ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      sku.status === 'RUPTURA_FISICA' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-[#0AE448] border border-emerald-500/30'
                    }`}>
                      {sku.status}
                    </span>
                    <div className="text-[11px] text-[#BBBAA6] mt-1">Físico: {sku.physicalOnHand} un</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-1 bg-[#0E100F] rounded-xl border border-white/10 text-xs font-bold">
        <button
          type="button"
          onClick={() => setConnectMethod('oauth')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            connectMethod === 'oauth'
              ? 'bg-[#0AE448] text-slate-950 font-black'
              : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
          }`}
        >
          🚀 Conexão 1-Clique (Recomendada • OAuth 2.0)
        </button>
        <button
          type="button"
          onClick={() => setConnectMethod('manual')}
          className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
            connectMethod === 'manual'
              ? 'bg-white/10 text-[#FFFCE1]'
              : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
          }`}
        >
          🔑 Token Manual (Custom App)
        </button>
      </div>

      {connectMethod === 'oauth' ? (
        <form onSubmit={handleStartOAuth} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#BBBAA6] mb-1">
              Domínio da Loja Shopify (.myshopify.com)
            </label>
            <input
              type="text"
              placeholder="ex: brkagro.myshopify.com"
              value={shopDomainInput}
              onChange={(e) => setShopDomainInput(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448]"
            />
          </div>

          <button
            type="submit"
            disabled={isConnecting}
            className="w-full py-3 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0AE448]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-slate-950" />
            <span>{isConnecting ? 'Redirecionando para a Shopify...' : 'Instalar App Oficial em 1-Clique (OAuth 2.0)'}</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleManualConnect} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#BBBAA6] mb-1">Admin API Access Token</label>
            <input
              type="password"
              placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448]"
            />
          </div>
          <button
            type="submit"
            disabled={isConnecting}
            className="w-full py-3 bg-white/10 hover:bg-white/15 text-[#FFFCE1] border border-white/10 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" />
            <span>Conectar com Chave Privada</span>
          </button>
        </form>
      )}
    </div>
  );
};
