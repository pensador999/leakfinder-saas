import React, { useState, useEffect } from 'react';
import { 
  Plug, 
  ShoppingBag, 
  Store, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles, 
  ExternalLink, 
  ShieldCheck, 
  Code2, 
  X, 
  Database, 
  ArrowRight,
  Flame,
  Check,
  Lock,
  Layers,
  Radio,
  Globe
} from 'lucide-react';
import { 
  getStoredIntegrations, 
  saveStoredIntegrations, 
  ConnectedIntegrationRecord, 
  PlatformType,
  connectPlatformOneClick,
  syncWarehouseStockLive,
  injectAppEmbedScriptTagViaApi,
  generateShopifyOAuthUrl,
  generateNuvemshopOAuthUrl
} from '../services/integrations/ecommercePlatformHub';

interface EcommerceIntegrationsHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStoreToAudit?: (url: string) => void;
}

export const EcommerceIntegrationsHubModal: React.FC<EcommerceIntegrationsHubModalProps> = ({
  isOpen,
  onClose,
  onSelectStoreToAudit
}) => {
  const [integrations, setIntegrations] = useState<ConnectedIntegrationRecord[]>([]);
  const [activePlatformModal, setActivePlatformModal] = useState<PlatformType | null>(null);
  const [newStoreDomain, setNewStoreDomain] = useState<string>('brk-agro.myshopify.com');
  const [newStoreName, setNewStoreName] = useState<string>('BRK Agro Oficial');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);
  const [isInjectingId, setIsInjectingId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const loadIntegrations = () => {
    setIntegrations(getStoredIntegrations());
  };

  useEffect(() => {
    if (isOpen) {
      loadIntegrations();
      setFeedbackMsg(null);
    }
  }, [isOpen]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlatformModal || !newStoreDomain.trim()) return;

    setIsConnecting(true);
    try {
      const record = await connectPlatformOneClick(activePlatformModal, newStoreDomain, newStoreName);
      setFeedbackMsg({
        text: `Loja ${record.storeName} conectada com sucesso via OAuth 2.0 oficial da ${activePlatformModal}.`,
        type: 'success'
      });
      loadIntegrations();
      setActivePlatformModal(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSyncStock = async (id: string) => {
    setIsSyncingId(id);
    try {
      const res = await syncWarehouseStockLive(id);
      setFeedbackMsg({
        text: `Sincronização de estoque concluída em ${res.syncLatencyMs}ms. ${res.syncedProducts} produtos e ${res.syncedVariants} variantes verificadas (${res.rupturesFound} rupturas de grade encontradas).`,
        type: 'success'
      });
      loadIntegrations();
    } finally {
      setIsSyncingId(null);
    }
  };

  const handleInjectScript = async (id: string) => {
    setIsInjectingId(id);
    try {
      const res = await injectAppEmbedScriptTagViaApi(id);
      setFeedbackMsg({
        text: `${res.message} (ScriptTag ID: ${res.scriptTagId})`,
        type: 'success'
      });
      loadIntegrations();
    } finally {
      setIsInjectingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-[#101211] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col text-[#FFFCE1]">
        
        {/* Header */}
        <div className="p-6 bg-[#141716] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded-2xl shadow-md">
              <Plug className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#FFFCE1]">Hub de Integrações Oficiais 1-Click</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 rounded-md">
                  OAuth 2.0 API Live
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6]">Conecte Shopify, Nuvemshop e WooCommerce para sincronização de estoque físico.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-[#BBBAA6] hover:text-[#FFFCE1] transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {feedbackMsg && (
            <div className="p-4 rounded-2xl bg-[#0AE448]/10 border border-[#0AE448]/30 text-[#0AE448] font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-[#0AE448] shrink-0" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Platform Connection Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Shopify */}
            <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 shadow-xs space-y-3 flex flex-col justify-between hover:border-[#0AE448]/40 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-[#0AE448]/10 text-[#0AE448] rounded-xl font-bold font-mono text-xs flex items-center gap-1.5 border border-[#0AE448]/20">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shopify</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-[#0AE448]/20 text-[#0AE448]">
                    Admin API 2026
                  </span>
                </div>
                <h4 className="font-bold text-[#FFFCE1] text-sm">Shopify App Bridge</h4>
                <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
                  Sincronize estoque de armazém e injete App Embeds sem editar o theme.liquid.
                </p>
              </div>

              <button
                onClick={() => {
                  setActivePlatformModal('SHOPIFY');
                  setNewStoreDomain('minimalclub.myshopify.com');
                  setNewStoreName('Minimal Club');
                }}
                className="w-full py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#0AE448]/20"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Conectar Shopify</span>
              </button>
            </div>

            {/* Nuvemshop */}
            <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 shadow-xs space-y-3 flex flex-col justify-between hover:border-blue-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-500/10 text-blue-300 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5 border border-blue-500/20">
                    <Store className="w-4 h-4" />
                    <span>Nuvemshop</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-blue-500/20 text-blue-300">
                    API v1
                  </span>
                </div>
                <h4 className="font-bold text-[#FFFCE1] text-sm">Nuvemshop Brasil</h4>
                <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
                  Conexão oficial para lojas na maior plataforma da América Latina.
                </p>
              </div>

              <button
                onClick={() => {
                  setActivePlatformModal('NUVEMSHOP');
                  setNewStoreDomain('sualoja.lojavirtualnuvem.com.br');
                  setNewStoreName('Loja Nuvemshop');
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-[#00BAE2] border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plug className="w-3.5 h-3.5" />
                <span>Conectar Nuvemshop</span>
              </button>
            </div>

            {/* WooCommerce */}
            <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 shadow-xs space-y-3 flex flex-col justify-between hover:border-purple-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-purple-500/10 text-purple-300 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5 border border-purple-500/20">
                    <Globe className="w-4 h-4" />
                    <span>WooCommerce</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-purple-500/20 text-purple-300">
                    REST v3
                  </span>
                </div>
                <h4 className="font-bold text-[#FFFCE1] text-sm">WooCommerce WP</h4>
                <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
                  Chaves de API Consumer Key & Secret com Webhooks em tempo real.
                </p>
              </div>

              <button
                onClick={() => {
                  setActivePlatformModal('WOOCOMMERCE');
                  setNewStoreDomain('sua-loja-woocommerce.com.br');
                  setNewStoreName('Loja WooCommerce');
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-purple-300 border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Conectar WooCommerce</span>
              </button>
            </div>

            {/* VTEX */}
            <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 shadow-xs space-y-3 flex flex-col justify-between hover:border-rose-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-rose-500/10 text-rose-300 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5 border border-rose-500/20">
                    <ShieldCheck className="w-4 h-4" />
                    <span>VTEX</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-rose-500/20 text-rose-300">
                    Enterprise
                  </span>
                </div>
                <h4 className="font-bold text-[#FFFCE1] text-sm">VTEX IO / Master</h4>
                <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
                  AppKey & AppToken para grandes operações enterprise com múltiplos estoques.
                </p>
              </div>

              <button
                onClick={() => {
                  setActivePlatformModal('VTEX');
                  setNewStoreDomain('sualoja.vtexcommercestable.com.br');
                  setNewStoreName('Operação VTEX');
                }}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-rose-300 border border-white/10 rounded-xl font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plug className="w-3.5 h-3.5" />
                <span>Conectar VTEX</span>
              </button>
            </div>

          </div>

          {/* Connection Modal Drawer Form */}
          {activePlatformModal && (
            <form onSubmit={handleConnect} className="p-5 bg-[#141716] border border-white/10 rounded-2xl space-y-4 animate-slideDown">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-[#FFFCE1] text-sm flex items-center gap-2">
                  <Plug className="w-4 h-4 text-[#0AE448]" />
                  Conectar Loja Oficial ({activePlatformModal})
                </h3>
                <button 
                  type="button" 
                  onClick={() => setActivePlatformModal(null)}
                  className="text-[#BBBAA6] hover:text-[#FFFCE1] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">Nome da Marca / Loja</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: BRK Agro"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] focus:border-[#0AE448] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">Domínio da Plataforma (.myshopify.com ou URL)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: brk-agro.myshopify.com"
                    value={newStoreDomain}
                    onChange={(e) => setNewStoreDomain(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] focus:border-[#0AE448] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-[#BBBAA6] flex items-center gap-1 font-mono">
                  <Lock className="w-3.5 h-3.5 text-[#0AE448]" />
                  Conexão segura criptografada TLS 1.3
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePlatformModal(null)}
                    className="px-3 py-1.5 text-xs text-[#BBBAA6] hover:bg-white/10 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="px-4 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl font-black transition-all flex items-center gap-1.5 shadow-lg shadow-[#0AE448]/20 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
                    <span>{isConnecting ? 'Autorizando OAuth...' : 'Autorizar 1-Click'}</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Active Connections List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#FFFCE1] text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-[#0AE448]" />
                Lojas Conectadas & Sincronizadas ({integrations.length})
              </h3>
              <span className="text-[11px] text-[#BBBAA6] font-mono">Status: Sincronização Automática Ativa</span>
            </div>

            {integrations.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-3xl bg-[#141716] border border-white/10 hover:border-[#0AE448]/40 transition-all space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-[#FFFCE1] text-base">{item.storeName}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30">
                        {item.platform}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-white/5 text-[#BBBAA6] border border-white/10">
                        {item.accessTokenMasked}
                      </span>
                    </div>
                    <p className="text-xs text-[#BBBAA6]/70 font-mono mt-0.5">{item.storeDomain} {item.myshopifyDomain ? `(${item.myshopifyDomain})` : ''}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 rounded-full font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" />
                      <span>Conectado ao Vivo</span>
                    </span>
                  </div>
                </div>

                {/* Metrics Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#0E100F] border border-white/10">
                    <span className="text-[10px] text-[#BBBAA6] font-mono uppercase block">Produtos Sincronizados</span>
                    <span className="text-base font-black text-[#FFFCE1] font-mono">{item.totalSyncedProducts} SKUs</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0E100F] border border-white/10">
                    <span className="text-[10px] text-[#BBBAA6] font-mono uppercase block">Variantes / Grades</span>
                    <span className="text-base font-black text-[#FFFCE1] font-mono">{item.totalSyncedVariants} Variações</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300">
                    <span className="text-[10px] text-amber-400 font-mono uppercase block">Rupturas no Armazém</span>
                    <span className="text-base font-black font-mono text-amber-300">{item.warehouseStockRupturesDetected} Produtos</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0AE448]/10 border border-[#0AE448]/20 text-[#0AE448]">
                    <span className="text-[10px] text-[#0AE448] font-mono uppercase block">App Embed no Tema</span>
                    <span className="text-sm font-black font-mono text-[#0AE448]">
                      {item.scriptTagActive ? 'Ativo (Zero Code)' : 'Não Injetado'}
                    </span>
                  </div>
                </div>

                {/* 1-Click Operational Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5">
                  <span className="text-[11px] text-[#BBBAA6]/60 font-mono">
                    Última sincronização: {new Date(item.lastSyncedAt).toLocaleTimeString('pt-BR')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSyncStock(item.id)}
                      disabled={isSyncingId === item.id}
                      className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingId === item.id ? 'animate-spin' : ''}`} />
                      <span>{isSyncingId === item.id ? 'Sincronizando...' : 'Sincronizar Estoque Agora'}</span>
                    </button>

                    <button
                      onClick={() => handleInjectScript(item.id)}
                      disabled={isInjectingId === item.id}
                      className="px-3.5 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#0AE448]/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isInjectingId === item.id ? 'Injetando no Tema...' : 'Injetar App Embed via API'}</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
