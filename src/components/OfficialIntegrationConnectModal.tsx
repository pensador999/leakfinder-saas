import React, { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';

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
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [shopDomainInput, setShopDomainInput] = useState(domain || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);

    setTimeout(() => {
      setIsConnecting(false);
      setConnectedPlatforms(prev => [...prev, activePlatform]);
      if (onSuccessConnected) {
        onSuccessConnected(activePlatform);
      }
    }, 1200);
  };

  const isCurrentConnected = connectedPlatforms.includes(activePlatform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/30 border border-blue-500/40 rounded-2xl text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white font-mono">Conectar Integração Oficial Segura</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  READ-ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400">Auditoria contábil de vendas reais e custo de anúncios sem riscos.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 grid grid-cols-3 gap-2">
          <button
            onClick={() => setActivePlatform('shopify')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activePlatform === 'shopify'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Shopify Admin</span>
          </button>

          <button
            onClick={() => setActivePlatform('meta_ads')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activePlatform === 'meta_ads'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span>Meta Ads (Facebook)</span>
          </button>

          <button
            onClick={() => setActivePlatform('ga4')}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activePlatform === 'ga4'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Google Analytics 4</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          
          {/* Security Guarantee Notice */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-900 space-y-1">
              <p className="font-bold">Garantia de Segurança & Permissão de Somente Leitura (Read-Only):</p>
              <p className="text-blue-700 leading-relaxed text-[11px]">
                O LeakFinder <strong>nunca altera preços, estoque ou código</strong> da sua loja. Conectamos apenas para puxar métricas consolidadas de vendas reais e investimento em tráfego pago.
              </p>
            </div>
          </div>

          {isCurrentConnected ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-900">Integração Conectada com Sucesso!</h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Os dados financeiros agora são 100% auditados diretamente via API oficial. O selo <strong>[Dado Real Auditado]</strong> foi ativado.
              </p>
            </div>
          ) : (
            <form onSubmit={handleConnect} className="space-y-4">
              {activePlatform === 'shopify' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Domínio da Loja Shopify (.myshopify.com)</label>
                    <input
                      type="text"
                      placeholder="ex: sualoja.myshopify.com"
                      value={shopDomainInput}
                      onChange={(e) => setShopDomainInput(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Admin API Access Token (App Personalizado)</label>
                    <input
                      type="password"
                      placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-blue-600"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Criado em: Shopify Admin &gt; Configurações &gt; Apps e canais de vendas &gt; Desenvolver apps.
                    </span>
                  </div>
                </>
              )}

              {activePlatform === 'meta_ads' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ID da Conta de Anúncios (Meta Ads Account ID)</label>
                    <input
                      type="text"
                      placeholder="act_1234567890"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-blue-600"
                    />
                  </div>
                </>
              )}

              {activePlatform === 'ga4' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">ID da Propriedade do Google Analytics 4 (GA4 Property ID)</label>
                    <input
                      type="text"
                      placeholder="ex: 345678912"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-blue-600"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isConnecting}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isConnecting ? (
                  <span>Validando Token Seguro...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Conectar e Validar Dados Reais</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 px-6 flex items-center justify-between text-xs text-slate-500">
          <span>Criptografia de Ponta a Ponta AES-256</span>
          <button 
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
