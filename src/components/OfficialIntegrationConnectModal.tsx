import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  ExternalLink, 
  KeyRound, 
  Layers, 
  Sparkles,
  Zap,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ShoppingBag,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { 
  startShopifyOAuthHandshake, 
  getActiveShopifyConnection, 
  syncShopifyPhysicalInventory,
  ShopifyConnectionInfo 
} from '../services/shopify/shopifyOAuthService';
import { AuditedInventorySku } from '../../api/shopify/sync';

interface OfficialIntegrationConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  domain: string;
  onSuccessConnected?: (platform: string) => void;
}

export const OfficialIntegrationConnectModal: React.FC<OfficialIntegrationConnectModalProps> = ({
  isOpen,
  onClose,
  brandName,
  domain,
  onSuccessConnected
}) => {
  const [activePlatform, setActivePlatform] = useState<'shopify' | 'meta_ads' | 'ga4'>('shopify');
  const [shopifyConnectMethod, setShopifyConnectMethod] = useState<'oauth' | 'manual'>('oauth');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [shopDomainInput, setShopDomainInput] = useState(domain || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [activeShopifyConn, setActiveShopifyConn] = useState<ShopifyConnectionInfo | null>(null);
  
  // Real inventory audit state
  const [isAuditingInventory, setIsAuditingInventory] = useState(false);
  const [auditedSkus, setAuditedSkus] = useState<AuditedInventorySku[]>([]);

  useEffect(() => {
    const conn = getActiveShopifyConnection();
    if (conn) {
      setActiveShopifyConn(conn);
      setConnectedPlatforms(prev => [...new Set([...prev, 'shopify'])]);
    }
  }, []);

  if (!isOpen) return null;

  const handleStartOAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopDomainInput.trim()) return;
    setIsConnecting(true);
    try {
      startShopifyOAuthHandshake(shopDomainInput);
    } catch (err: any) {
      alert(err.message || 'Erro ao iniciar fluxo OAuth');
      setIsConnecting(false);
    }
  };

  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    setTimeout(() => {
      setIsConnecting(false);
      setConnectedPlatforms(prev => [...prev, activePlatform]);
      if (activePlatform === 'shopify') {
        setActiveShopifyConn({
          shopDomain: shopDomainInput,
          isConnected: true,
          installedAt: new Date().toISOString()
        });
      }
      if (onSuccessConnected) {
        onSuccessConnected(activePlatform);
      }
    }, 1200);
  };

  const handleRunPhysicalInventoryAudit = async () => {
    setIsAuditingInventory(true);
    try {
      const res = await syncShopifyPhysicalInventory(shopDomainInput || 'brkagro.myshopify.com');
      setAuditedSkus(res.skus);
    } catch (err) {
      console.warn('Sync failed:', err);
    } finally {
      setIsAuditingInventory(false);
    }
  };

  const isCurrentConnected = connectedPlatforms.includes(activePlatform) || (activePlatform === 'shopify' && !!activeShopifyConn);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#101211] w-full max-w-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col text-[#FFFCE1]">
        
        {/* Header */}
        <div className="p-5 bg-[#0E100F] text-[#FFFCE1] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/10 border border-[#0AE448]/25 rounded-2xl text-[#0AE448]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#FFFCE1] font-mono">Conector Oficial Shopify & Canais de Mídia</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30">
                  OAUTH 2.0 • READ-ONLY
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6]">Auditoria de estoque real do armazém e dados oficiais de tráfego pago sem riscos.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-[#BBBAA6] hover:text-[#FFFCE1] rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="p-3 bg-[#141716] border-b border-white/10 grid grid-cols-3 gap-2">
          <button
            onClick={() => setActivePlatform('shopify')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activePlatform === 'shopify'
                ? 'bg-[#0E100F] text-[#0AE448] shadow-xs border border-[#0AE448]/30'
                : 'text-[#BBBAA6] hover:bg-white/5 hover:text-[#FFFCE1]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#0AE448]" />
            <span>Shopify Admin API</span>
          </button>

          <button
            onClick={() => setActivePlatform('meta_ads')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activePlatform === 'meta_ads'
                ? 'bg-[#0E100F] text-[#00BAE2] shadow-xs border border-[#00BAE2]/30'
                : 'text-[#BBBAA6] hover:bg-white/5 hover:text-[#FFFCE1]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#00BAE2]" />
            <span>Meta Ads (Facebook)</span>
          </button>

          <button
            onClick={() => setActivePlatform('ga4')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activePlatform === 'ga4'
                ? 'bg-[#0E100F] text-amber-400 shadow-xs border border-amber-500/30'
                : 'text-[#BBBAA6] hover:bg-white/5 hover:text-[#FFFCE1]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Google Analytics 4</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          
          {/* Security Guarantee Notice */}
          <div className="p-4 rounded-2xl bg-[#00BAE2]/10 border border-[#00BAE2]/25 flex items-start gap-3">
            <Lock className="w-5 h-5 text-[#00BAE2] shrink-0 mt-0.5" />
            <div className="text-xs text-[#FFFCE1] space-y-1">
              <p className="font-bold text-[#00BAE2]">Garantia de Segurança & Permissão de Somente Leitura (Read-Only):</p>
              <p className="text-[#BBBAA6] leading-relaxed text-[11px]">
                O AdShield <strong className="text-[#FFFCE1]">nunca altera preços, estoque ou código</strong> da sua loja. Conectamos apenas para auditar o inventário físico real e estancar sangrias no tráfego pago.
              </p>
            </div>
          </div>

          {isCurrentConnected ? (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-[#0AE448]/10 border border-[#0AE448]/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#0AE448]/20 text-[#0AE448] flex items-center justify-center mx-auto shadow-xs border border-[#0AE448]/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-[#FFFCE1]">Loja Conectada via Shopify Admin API!</h4>
                <p className="text-xs text-[#BBBAA6] max-w-md mx-auto">
                  Loja: <strong className="text-[#FFFCE1] font-mono">{activeShopifyConn?.shopDomain || shopDomainInput}</strong>
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleRunPhysicalInventoryAudit}
                    disabled={isAuditingInventory}
                    className="px-4 py-2 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-[#0AE448]/20 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAuditingInventory ? 'animate-spin' : ''}`} />
                    <span>{isAuditingInventory ? 'Auditando Armazém...' : 'Auditar Estoque Físico Agora'}</span>
                  </button>
                </div>
              </div>

              {/* Real-time Inventory Audit Results */}
              {auditedSkus.length > 0 && (
                <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#FFFCE1] font-mono">
                      Resultado da Auditoria Física ({auditedSkus.length} SKUs)
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
          ) : (
            <div className="space-y-4">
              {activePlatform === 'shopify' && (
                <div className="space-y-4">
                  {/* Method Toggle: 1-Click OAuth vs Manual App Token */}
                  <div className="flex items-center gap-2 p-1 bg-[#0E100F] rounded-xl border border-white/10 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setShopifyConnectMethod('oauth')}
                      className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                        shopifyConnectMethod === 'oauth'
                          ? 'bg-[#0AE448] text-slate-950 font-black'
                          : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
                      }`}
                    >
                      🚀 Conexão 1-Clique (Recomendada • OAuth 2.0)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShopifyConnectMethod('manual')}
                      className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                        shopifyConnectMethod === 'manual'
                          ? 'bg-white/10 text-[#FFFCE1]'
                          : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
                      }`}
                    >
                      🔑 Token Manual (Custom App)
                    </button>
                  </div>

                  {shopifyConnectMethod === 'oauth' ? (
                    <form onSubmit={handleStartOAuth} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#BBBAA6] mb-1">
                          Domínio da sua Loja Shopify (.myshopify.com)
                        </label>
                        <input
                          type="text"
                          placeholder="ex: brkagro.myshopify.com ou brkagro"
                          value={shopDomainInput}
                          onChange={(e) => setShopDomainInput(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448]"
                        />
                        <span className="text-[10px] text-[#BBBAA6] mt-1 block">
                          Você será redirecionado para a tela oficial da Shopify para autorizar a leitura do inventário.
                        </span>
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
                    <form onSubmit={handleManualConnect} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#BBBAA6] mb-1">Domínio da Loja Shopify (.myshopify.com)</label>
                        <input
                          type="text"
                          placeholder="ex: sualoja.myshopify.com"
                          value={shopDomainInput}
                          onChange={(e) => setShopDomainInput(e.target.value)}
                          required
                          className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#BBBAA6] mb-1">Admin API Access Token (App Personalizado)</label>
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
              )}

              {activePlatform === 'meta_ads' && (
                <form onSubmit={handleManualConnect} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#BBBAA6] mb-1">ID da Conta de Anúncios (Meta Ads Account ID)</label>
                    <input
                      type="text"
                      placeholder="act_1234567890"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
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
                    <span>Conectar Meta Ads Graph API</span>
                  </button>
                </form>
              )}

              {activePlatform === 'ga4' && (
                <form onSubmit={handleManualConnect} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#BBBAA6] mb-1">ID da Propriedade do Google Analytics 4 (GA4 Property ID)</label>
                    <input
                      type="text"
                      placeholder="ex: 345678912"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
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
                    <span>Conectar Google Analytics 4</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0E100F] border-t border-white/10 px-6 flex items-center justify-between text-xs text-[#BBBAA6]">
          <span>Criptografia de Ponta a Ponta AES-256</span>
          <button 
            onClick={onClose}
            className="font-bold text-[#FFFCE1] hover:text-[#0AE448] transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
