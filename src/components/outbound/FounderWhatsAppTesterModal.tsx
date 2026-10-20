import React, { useState } from 'react';
import { 
  Smartphone, 
  Video, 
  Camera, 
  ExternalLink, 
  Check, 
  Copy, 
  X,
  Play,
  ShieldCheck,
  Send
} from 'lucide-react';
import { 
  buildFounderExperienceTest, 
  simulateFounderTestDispatch, 
  DEFAULT_FOUNDER_CONFIG 
} from '../../services/outbound/founderExperienceTester';
import { useAuditStore } from '../../store/auditStore';
import { isCatalogProductBroken } from '../../services/siteInspector';

interface FounderWhatsAppTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FounderWhatsAppTesterModal: React.FC<FounderWhatsAppTesterModalProps> = ({
  isOpen,
  onClose
}) => {
  const diagnostic = useAuditStore(state => state.diagnostic);
  const [phone, setPhone] = useState(DEFAULT_FOUNDER_CONFIG.founderPhone);
  const [selectedStore, setSelectedStore] = useState<'active_store' | 'insider' | 'minimal' | 'texas'>(
    diagnostic ? 'active_store' : 'insider'
  );
  const [copied, setCopied] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const brokenItems = (diagnostic?.realSiteData?.catalogAudit?.issues || []).filter(isCatalogProductBroken);
  const activeBrokenItem = brokenItems[0] || diagnostic?.realSiteData?.catalogAudit?.issues?.[0];
  const activeBrokenSizes =
    activeBrokenItem?.brokenCoreSizes && activeBrokenItem.brokenCoreSizes.length > 0
      ? activeBrokenItem.brokenCoreSizes
      : activeBrokenItem?.missingSizes && activeBrokenItem.missingSizes.length > 0
      ? activeBrokenItem.missingSizes
      : ['M', 'G'];

  const storePresets = {
    active_store: {
      domain: diagnostic?.realSiteData?.domain || 'minimalclub.com.br',
      productTitle: activeBrokenItem?.productTitle || 'Camisa Henley Tricot Algodão Egípcio',
      productUrl: activeBrokenItem?.productUrl || `https://${diagnostic?.realSiteData?.domain || 'minimalclub.com.br'}`,
      brokenSizes: activeBrokenSizes,
      budget: 250
    },
    insider: {
      domain: 'insiderstore.com.br',
      productTitle: 'Tech T-Shirt® Algodão Modal',
      productUrl: 'https://insiderstore.com.br/products/tech-t-shirt',
      brokenSizes: ['M', 'G'],
      budget: 250
    },
    minimal: {
      domain: 'minimalclub.com.br',
      productTitle: 'Camisa Henley Tricot Algodão Egípcio',
      productUrl: 'https://minimalclub.com.br/products/camisa-henley-tricot-preta',
      brokenSizes: ['M', 'G'],
      budget: 220
    },
    texas: {
      domain: 'texascenter.com.br',
      productTitle: 'Bota Texana Country Couro Nobuck',
      productUrl: 'https://texascenter.com.br/products/bota-texana-couro',
      brokenSizes: ['39', '40', '41'],
      budget: 300
    }
  };

  const currentConfig = storePresets[selectedStore] || storePresets.insider;

  const testPayload = buildFounderExperienceTest({
    founderPhone: phone,
    storeDomain: currentConfig.domain,
    productTitle: currentConfig.productTitle,
    productUrl: currentConfig.productUrl,
    brokenSizes: currentConfig.brokenSizes,
    dailyAdBudget: currentConfig.budget
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(testPayload.evolutionApiPayload.textMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateDispatch = () => {
    const res = simulateFounderTestDispatch(testPayload);
    setSimulationStatus(`✅ Simulação concluída! ID: ${res.testId} (Status ${res.httpStatus})`);
    setTimeout(() => setSimulationStatus(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Teste Real no WhatsApp do Fundador</h3>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                  Golden Trio • Ancorado no SKU Real
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Disparo do pacote completo (Vídeo 15s + Print Playwright + Copy Ancorada + Checkout Stripe)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Store & Phone Controls */}
        <div className="border-b border-slate-800 bg-slate-950/40 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">WhatsApp para Teste:</label>
            <input 
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
              placeholder="Ex: 5534991351122"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Loja para Gerar o Alerta:</label>
            <div className="flex flex-wrap gap-2">
              {diagnostic && (
                <button 
                  onClick={() => setSelectedStore('active_store')}
                  className={`py-2 px-3 rounded-lg font-semibold border transition-all cursor-pointer ${
                    selectedStore === 'active_store'
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🎯 {diagnostic.realSiteData.brandName || diagnostic.realSiteData.domain}
                </button>
              )}
              <button 
                onClick={() => setSelectedStore('insider')}
                className={`py-2 px-3 rounded-lg font-semibold border transition-all cursor-pointer ${
                  selectedStore === 'insider'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Insider Store
              </button>
              <button 
                onClick={() => setSelectedStore('minimal')}
                className={`py-2 px-3 rounded-lg font-semibold border transition-all cursor-pointer ${
                  selectedStore === 'minimal'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Minimal Club
              </button>
              <button 
                onClick={() => setSelectedStore('texas')}
                className={`py-2 px-3 rounded-lg font-semibold border transition-all cursor-pointer ${
                  selectedStore === 'texas'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Texas Center
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Golden Trio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Avatar Video Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <Video className="h-4 w-4" />
                <span>1. Vídeo Pitch 15s</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Avatar 9:16 PiP com sincronia labial e áudio consultivo.
              </p>
              <div className="bg-slate-900 rounded p-2 text-[10px] font-mono text-cyan-300 border border-slate-800 truncate">
                SKU: {currentConfig.productTitle}
              </div>
            </div>

            {/* 2. Playwright Proof Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Camera className="h-4 w-4" />
                <span>2. Print Demarcado</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Evidência visual dos tamanhos centrais esgotados na vitrine.
              </p>
              <div className="bg-slate-900 rounded p-2 text-[10px] font-mono text-amber-300 border border-slate-800">
                Ruptura: [{currentConfig.brokenSizes.join(', ')}]
              </div>
            </div>

            {/* 3. Stripe Checkout Card */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="h-4 w-4" />
                <span>3. Checkout 1-Clique</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Link de ativação imediata com cartão ou Pix (R$ 297/mês).
              </p>
              <div className="bg-slate-900 rounded p-2 text-[10px] font-mono text-emerald-300 border border-slate-800 truncate">
                buy.stripe.com/live_adshield...
              </div>
            </div>

          </div>

          {/* WhatsApp Message Preview */}
          <div className="rounded-xl border border-slate-800 bg-[#0b141a] p-4 space-y-3 font-sans shadow-lg">
            <div className="flex items-center justify-between border-b border-[#202c33] pb-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-200">Prévia do WhatsApp (Formato Real Recebido)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Destino: +{phone}</span>
            </div>

            <div className="bg-[#1f2c34] text-slate-100 p-4 rounded-xl text-xs space-y-2 max-w-2xl border border-[#2a3942] leading-relaxed">
              <pre className="font-sans whitespace-pre-wrap text-[11px] text-slate-200">
                {testPayload.evolutionApiPayload.textMessage}
              </pre>
            </div>
          </div>

          {/* Status Message */}
          {simulationStatus && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs font-semibold text-emerald-300 text-center animate-in fade-in">
              {simulationStatus}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-4 flex flex-wrap gap-3 justify-between items-center text-xs">
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2 border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copiado!' : 'Copiar Texto'}
            </button>
            <button
              onClick={handleSimulateDispatch}
              className="flex items-center gap-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-3 py-2 border border-slate-700 transition-colors cursor-pointer"
            >
              <Play className="h-4 w-4 text-cyan-400" />
              Simular Envio no Gateway
            </button>
          </div>

          <div className="flex gap-2">
            <a
              href={testPayload.directWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Send className="h-4 w-4" />
              <span>Abrir no Meu WhatsApp</span>
              <ExternalLink className="h-3 w-3 opacity-80" />
            </a>
            <button
              onClick={onClose}
              className="rounded-lg bg-slate-800 px-4 py-2 font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
