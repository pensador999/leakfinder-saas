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
  Radio
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
        text: `🎉 Loja ${record.storeName} conectada com sucesso via OAuth 2.0 oficial da ${activePlatformModal}!`,
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
        text: `✅ Sincronização de estoque concluída em ${res.syncLatencyMs}ms! ${res.syncedProducts} produtos e ${res.syncedVariants} variantes verificadas. (${res.rupturesFound} rupturas de grade encontradas)`,
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
        text: `✨ ${res.message} (ScriptTag ID: ${res.scriptTagId})`,
        type: 'success'
      });
      loadIntegrations();
    } finally {
      setIsInjectingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl text-white shadow-md shadow-emerald-600/30">
              <Plug className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Hub de Integrações Oficiais 1-Click</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                  OAuth 2.0 API Live
                </span>
              </div>
              <p className="text-xs text-slate-400">Conecte Shopify, Nuvemshop e WooCommerce para sincronização de estoque físico.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {feedbackMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          {/* Platform Connection Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Shopify */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-emerald-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Shopify</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                    Admin API 2026
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Shopify App Bridge</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Sincronize estoque de armazém e injete App Embeds sem editar o theme.liquid.
                </p>
              </div>

              <button
                onClick={() => {
                  setActivePlatformModal('SHOPIFY');
                  setNewStoreDomain('brk-agro.myshopify.com');
                  setNewStoreName('BRK Agro');
                }}
                className="w-full py-2 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              >
                <Plug className="w-3.5 h-3.5" />
                <span>Conectar Shopify</span>
              </button>
            </div>

            {/* Nuvemshop */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-blue-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5">
                    <Store className="w-4 h-4" />
                    <span>Nuvemshop</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-blue-100 text-blue-800">
                    API v1
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Nuvemshop Brasil</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Conexão oficial para lojas na maior plataforma da América Latina.
                </p>
              </div>

              <button
                onClick={() => {
                  setActivePlatformModal('NUVEMSHOP');
                  setNewStoreDomain('sualoja.lojavirtualnuvem.com.br');
                  setNewStoreName('Loja Nuvemshop');
                }}
                className="w-full py-2 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              >
                <Plug className="w-3.5 h-3.5" />
                <span>Conectar Nuvemshop</span>
              </button>
            </div>

            {/* WooCommerce */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-purple-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5">
                    <Code2 className="w-4 h-4" />
                    <span>WooCommerce</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-purple-100 text-purple-800">
                    REST v3
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">WooCommerce WP</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Chaves de API Consumer Key & Secret com Webhooks em tempo real.
                </p>
              </div>

              <button
                onClick={() => {
                  setActivePlatformModal('WOOCOMMERCE');
                  setNewStoreDomain('sua-loja-woocommerce.com.br');
                  setNewStoreName('Loja WooCommerce');
                }}
                className="w-full py-2 bg-slate-900 hover:bg-purple-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              >
                <Plug className="w-3.5 h-3.5" />
                <span>Conectar WooCommerce</span>
              </button>
            </div>

            {/* VTEX */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-rose-400 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-rose-50 text-rose-600 rounded-xl font-bold font-mono text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>VTEX</span>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-rose-100 text-rose-800">
                    Enterprise
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">VTEX IO / Master</h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  AppKey & AppToken para grandes operações enterprise com múltiplos estoques.
                </p>
              </div>

              <button
                onClick={() => {
                  setActivePlatformModal('VTEX');
                  setNewStoreDomain('sualoja.vtexcommercestable.com.br');
                  setNewStoreName('Operação VTEX');
                }}
                className="w-full py-2 bg-slate-900 hover:bg-rose-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-xs"
              >
                <Plug className="w-3.5 h-3.5" />
                <span>Conectar VTEX</span>
              </button>
            </div>

          </div>

          {/* Connection Modal Drawer Form */}
          {activePlatformModal && (
            <form onSubmit={handleConnect} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-slideDown">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Plug className="w-4 h-4 text-emerald-600" />
                  Conectar Loja Oficial ({activePlatformModal})
                </h3>
                <button 
                  type="button" 
                  onClick={() => setActivePlatformModal(null)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome da Marca / Loja</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: BRK Agro"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Domínio da Plataforma (.myshopify.com ou URL)</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: brk-agro.myshopify.com"
                    value={newStoreDomain}
                    onChange={(e) => setNewStoreDomain(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Conexão segura criptografada TLS 1.3
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePlatformModal(null)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-all cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
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
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-600" />
                Lojas Conectadas & Sincronizadas ({integrations.length})
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Status: Sincronização Automática Ativa</span>
            </div>

            {integrations.map((item) => (
              <div 
                key={item.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 transition-all space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{item.storeName}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.platform}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-slate-100 text-slate-600">
                        {item.accessTokenMasked}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{item.storeDomain} {item.myshopifyDomain ? `(${item.myshopifyDomain})` : ''}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Conectado ao Vivo</span>
                    </span>
                  </div>
                </div>

                {/* Metrics Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Produtos Sincronizados</span>
                    <span className="text-base font-black text-slate-900 font-mono">{item.totalSyncedProducts} SKUs</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Variantes / Grades</span>
                    <span className="text-base font-black text-slate-900 font-mono">{item.totalSyncedVariants} Variações</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900">
                    <span className="text-[10px] text-amber-700 font-mono uppercase block">Rupturas no Armazém</span>
                    <span className="text-base font-black font-mono text-amber-800">{item.warehouseStockRupturesDetected} Produtos</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                    <span className="text-[10px] text-emerald-700 font-mono uppercase block">App Embed no Tema</span>
                    <span className="text-sm font-black font-mono text-emerald-800">
                      {item.scriptTagActive ? 'Ativo (Zero Code)' : 'Não Injetado'}
                    </span>
                  </div>
                </div>

                {/* 1-Click Operational Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Última sincronização: {new Date(item.lastSyncedAt).toLocaleTimeString('pt-BR')}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSyncStock(item.id)}
                      disabled={isSyncingId === item.id}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncingId === item.id ? 'animate-spin' : ''}`} />
                      <span>{isSyncingId === item.id ? 'Sincronizando...' : 'Sincronizar Estoque Agora'}</span>
                    </button>

                    <button
                      onClick={() => handleInjectScript(item.id)}
                      disabled={isInjectingId === item.id}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
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
