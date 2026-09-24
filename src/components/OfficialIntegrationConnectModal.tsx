import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  ShoppingBag, 
  Building2, 
  Network, 
  Cpu, 
  Activity, 
  Radio 
} from 'lucide-react';
import { 
  getActiveShopifyConnection, 
  ShopifyConnectionInfo 
} from '../services/shopify/shopifyOAuthService';
import { 
  getSavedSankhyaConfig, 
  SankhyaConnectionConfig 
} from '../services/integrations/sankhyaErpService';
import { 
  getSavedMagis5Config, 
  Magis5ConnectionConfig 
} from '../services/integrations/magis5HubService';

// Subcomponentes modulares de integração
import { ShopifyConnectTab } from './integrations/ShopifyConnectTab';
import { SankhyaConnectTab } from './integrations/SankhyaConnectTab';
import { Magis5ConnectTab } from './integrations/Magis5ConnectTab';
import { MetaAdsConnectTab } from './integrations/MetaAdsConnectTab';
import { Ga4ConnectTab } from './integrations/Ga4ConnectTab';
import { OmnichannelTruthMatrixSection } from './integrations/OmnichannelTruthMatrixSection';

interface OfficialIntegrationConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  brandName: string;
  domain: string;
  onSuccessConnected?: (platform: string) => void;
}

type PlatformType = 'shopify' | 'sankhya' | 'magis5' | 'meta_ads' | 'ga4';

export const OfficialIntegrationConnectModal: React.FC<OfficialIntegrationConnectModalProps> = ({
  isOpen,
  onClose,
  domain,
  onSuccessConnected
}) => {
  const [activePlatform, setActivePlatform] = useState<PlatformType>('shopify');
  const [shopifyConn, setShopifyConn] = useState<ShopifyConnectionInfo | null>(null);
  const [sankhyaConfig, setSankhyaConfig] = useState<SankhyaConnectionConfig | null>(null);
  const [magis5Config, setMagis5Config] = useState<Magis5ConnectionConfig | null>(null);

  useEffect(() => {
    setShopifyConn(getActiveShopifyConnection());
    setSankhyaConfig(getSavedSankhyaConfig());
    setMagis5Config(getSavedMagis5Config());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNotifySuccess = (platform: string) => {
    if (onSuccessConnected) onSuccessConnected(platform);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-[#101211] w-full max-w-3xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden flex flex-col text-[#FFFCE1] my-6">
        
        {/* Header */}
        <div className="p-5 bg-[#0E100F] text-[#FFFCE1] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/10 border border-[#0AE448]/25 rounded-2xl text-[#0AE448]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#FFFCE1] font-mono">Conectores Oficiais & Matriz da Verdade Multicanal</h3>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30">
                  ANTI-GHOST INVENTORY
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6]">Integração do ecossistema real (Shopify + Sankhya ERP + Magis5 Hub + Meta Ads).</p>
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
        <div className="p-2 bg-[#141716] border-b border-white/10 flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActivePlatform('shopify')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activePlatform === 'shopify'
                ? 'bg-[#0E100F] text-[#0AE448] shadow-xs border border-[#0AE448]/30'
                : 'text-[#BBBAA6] hover:bg-white/5 hover:text-[#FFFCE1]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#0AE448]" />
            <span>Shopify Store</span>
          </button>

          <button
            onClick={() => setActivePlatform('sankhya')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activePlatform === 'sankhya'
                ? 'bg-[#0E100F] text-[#0AE448] shadow-xs border border-[#0AE448]/30'
                : 'text-[#BBBAA6] hover:bg-white/5 hover:text-[#FFFCE1]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sankhya ERP (TGFEST)</span>
          </button>

          <button
            onClick={() => setActivePlatform('magis5')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activePlatform === 'magis5'
                ? 'bg-[#0E100F] text-[#00BAE2] shadow-xs border border-[#00BAE2]/30'
                : 'text-[#BBBAA6] hover:bg-white/5 hover:text-[#FFFCE1]'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-[#00BAE2]" />
            <span>Magis5 Hub (Marketplaces)</span>
          </button>

          <button
            onClick={() => setActivePlatform('meta_ads')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activePlatform === 'meta_ads'
                ? 'bg-[#0E100F] text-[#00BAE2] shadow-xs border border-[#00BAE2]/30'
                : 'text-[#BBBAA6] hover:bg-white/5 hover:text-[#FFFCE1]'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-[#00BAE2]" />
            <span>Meta Ads Graph</span>
          </button>

          <button
            onClick={() => setActivePlatform('ga4')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activePlatform === 'ga4'
                ? 'bg-[#0E100F] text-amber-400 shadow-xs border border-amber-500/30'
                : 'text-[#BBBAA6] hover:bg-white/5 hover:text-[#FFFCE1]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>GA4 Analytics</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Security Guarantee Notice */}
          <div className="p-3.5 rounded-2xl bg-[#00BAE2]/10 border border-[#00BAE2]/25 flex items-start gap-3">
            <Lock className="w-4 h-4 text-[#00BAE2] shrink-0 mt-0.5" />
            <div className="text-xs text-[#FFFCE1] space-y-0.5">
              <p className="font-bold text-[#00BAE2]">Protocolo de Leitura Segura (Read-Only) & Stop-Loss Automatizado:</p>
              <p className="text-[#BBBAA6] leading-relaxed text-[11px]">
                O AdShield lê dados físicos do armazém e métricas de anúncios com criptografia AES-256. A única ação ativa permitida é o acionamento do Stop-Loss (pausa preventiva de anúncios) quando há ruptura física comprovada.
              </p>
            </div>
          </div>

          {/* TAB 1: SHOPIFY */}
          {activePlatform === 'shopify' && (
            <ShopifyConnectTab 
              activeConnection={shopifyConn}
              domain={domain}
              onConnectedManual={(shop) => {
                setShopifyConn({
                  shopDomain: shop,
                  isConnected: true,
                  installedAt: new Date().toISOString()
                });
                handleNotifySuccess('shopify');
              }}
            />
          )}

          {/* TAB 2: SANKHYA ERP (TGFEST) */}
          {activePlatform === 'sankhya' && (
            <SankhyaConnectTab 
              initialConfig={sankhyaConfig}
              onConnected={(cfg) => {
                setSankhyaConfig(cfg);
                handleNotifySuccess('sankhya');
              }}
            />
          )}

          {/* TAB 3: MAGIS5 HUB */}
          {activePlatform === 'magis5' && (
            <Magis5ConnectTab 
              initialConfig={magis5Config}
              onConnected={(cfg) => {
                setMagis5Config(cfg);
                handleNotifySuccess('magis5');
              }}
            />
          )}

          {/* TAB 4: META ADS */}
          {activePlatform === 'meta_ads' && (
            <MetaAdsConnectTab 
              onConnected={() => handleNotifySuccess('meta_ads')}
            />
          )}

          {/* TAB 5: GA4 */}
          {activePlatform === 'ga4' && (
            <Ga4ConnectTab 
              onConnected={() => handleNotifySuccess('ga4')}
            />
          )}

          {/* MATRIZ DA VERDADE MULTICANAL INTEGRADA */}
          <OmnichannelTruthMatrixSection />

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0E100F] border-t border-white/10 px-6 flex items-center justify-between text-xs text-[#BBBAA6]">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#0AE448] animate-pulse" />
            <span>AdShield Engine v2.4 • Grounding & Stop-Loss Ativos</span>
          </div>
          <button 
            onClick={onClose}
            className="font-bold text-[#FFFCE1] hover:text-[#0AE448] transition-colors cursor-pointer"
          >
            Fechar Painel
          </button>
        </div>

      </div>
    </div>
  );
};
