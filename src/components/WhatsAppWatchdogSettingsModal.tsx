import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck 
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { 
  getWhatsAppGatewayConfig, 
  saveWhatsAppGatewayConfig, 
  WhatsAppGatewayConfig, 
  dispatchWhatsAppAlert 
} from '../services/workers/whatsappAlertWorker';
import { getWhiteLabelConfig } from '../services/whiteLabelService';

interface WhatsAppWatchdogSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppWatchdogSettingsModal: React.FC<WhatsAppWatchdogSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const whiteLabel = getWhiteLabelConfig();
  const [config, setConfig] = useState<WhatsAppGatewayConfig>(getWhatsAppGatewayConfig());
  const [testPhone, setTestPhone] = useState<string>(
    getWhatsAppGatewayConfig().defaultPhone || whiteLabel.consultantWhatsApp || '5511999999999'
  );
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; directUrl?: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getWhatsAppGatewayConfig();
      const wl = getWhiteLabelConfig();
      setConfig(cfg);
      setTestPhone(cfg.defaultPhone || wl.consultantWhatsApp || '5511999999999');
      setTestResult(null);
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveWhatsAppGatewayConfig({ ...config, defaultPhone: testPhone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSendTestMessage = async () => {
    setIsSendingTest(true);
    setTestResult(null);

    const testPayload = {
      to: testPhone,
      message: `🛡️ *ADSHIELD VIGIA 24H • TESTE DE CONEXÃO*\n\n` +
        `✅ Seu canal de WhatsApp está ativo e conectado com sucesso!\n` +
        `⏱️ As auditorias diárias automáticas serão entregues neste número às 07:00 da manhã.\n\n` +
        `📊 *Portfólio Monitorado:* Minimal Club, Sallve, Insider Store & Clientes\n` +
        `🔍 *Diagnóstico:* Catálogo, Grade e Tráfego Pago Auditados\n\n` +
        `🔗 Painel Oficial: ${window.location.origin}`,
      priority: 'HIGH' as const,
      metadata: {
        storeId: 'test-store',
        storeUrl: window.location.origin,
        score: 95
      }
    };

    try {
      const res = await dispatchWhatsAppAlert(testPayload, config);
      if (res.success) {
        setTestResult({
          success: true,
          message: `Alerta formatado com sucesso para ${testPhone}! (ID: ${res.dispatchId})`,
          directUrl: res.directUrl
        });
        if (config.provider === 'DIRECT_LINK' && res.directUrl) {
          window.open(res.directUrl, '_blank');
        }
      } else {
        setTestResult({
          success: false,
          message: `Falha no envio: ${res.error || 'Verifique a URL e Token da API'}`,
          directUrl: res.directUrl
        });
      }
    } finally {
      setIsSendingTest(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#101211] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col font-sans text-[#FFFCE1]">
        
        {/* Header */}
        <div className="p-6 bg-[#141716] text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded-2xl shadow-md">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#FFFCE1]">Agente 18 — WhatsApp Executive Watchdog Worker</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-black bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 rounded-md">
                  Vigilância 07:00
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6]">Gateway para entrega proativa de alertas de ruptura e relatórios executivos no WhatsApp do decisor.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl text-[#BBBAA6] hover:text-[#FFFCE1] transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-[#0AE448]/10 border border-[#0AE448]/30 text-[#0AE448] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0AE448]" />
              <span>Configurações do WhatsApp salvas com sucesso!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Gateway Provider Selector */}
            <div className="space-y-2">
              <label className="block font-bold text-[#BBBAA6]">Provedor de Envio WhatsApp</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'DIRECT_LINK', label: '1-Clique Direto (Oficial)' },
                  { id: 'EVOLUTION_API', label: 'Evolution API' },
                  { id: 'Z_API', label: 'Z-API Brasil' },
                  { id: 'GENERIC_WEBHOOK', label: 'Webhook Custom' },
                  { id: 'SIMULATION', label: 'Simulador Local' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setConfig({ ...config, provider: item.id as any })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-bold text-xs ${
                      config.provider === item.id
                        ? 'bg-[#0AE448]/10 border-[#0AE448] text-[#0AE448] shadow-xs'
                        : 'bg-white/5 border-white/10 text-[#BBBAA6] hover:bg-white/10 hover:text-[#FFFCE1]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Link Explainer */}
            {config.provider === 'DIRECT_LINK' && (
              <div className="p-3.5 bg-[#141716] border border-[#0AE448]/30 rounded-2xl flex items-start gap-2.5 animate-fadeIn">
                <ShieldCheck className="w-5 h-5 text-[#0AE448] shrink-0 mt-0.5" />
                <div className="text-xs text-[#BBBAA6] leading-relaxed">
                  <span className="font-bold text-[#FFFCE1]">Protocolo Oficial Click-to-Chat Ativo:</span> Os alertas executivos geram deep-links criptografados da API oficial do WhatsApp (<code className="bg-white/5 border border-white/10 text-[#0AE448] px-1 py-0.5 rounded font-mono text-[11px]">api.whatsapp.com</code>), permitindo abertura imediata no WhatsApp Web ou Mobile sem risco de banimento.
                </div>
              </div>
            )}

            {/* Endpoint URL & Token */}
            {config.provider !== 'SIMULATION' && config.provider !== 'DIRECT_LINK' && (
              <div className="space-y-3 p-4 bg-[#141716] border border-white/10 rounded-2xl animate-fadeIn">
                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">URL da Instância / Webhook</label>
                  <input
                    type="url"
                    required
                    placeholder="https://api.evolution.suaempresa.com/message/sendText/adshield"
                    value={config.endpointUrl}
                    onChange={(e) => setConfig({ ...config, endpointUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl focus:border-[#0AE448] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">API Key / Token de Autenticação</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    value={config.apiToken || ''}
                    onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl focus:border-[#0AE448] focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#0AE448]/20 transition-all cursor-pointer"
              >
                Salvar Configurações
              </button>
            </div>
          </form>

          <hr className="border-white/10" />

          {/* Test Dispatch Box */}
          <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-[#FFFCE1] flex items-center gap-2">
                <Send className="w-4 h-4 text-[#0AE448]" />
                Disparo Executivo Real no WhatsApp
              </h3>
              <span className="text-[10px] text-[#0AE448] font-mono font-bold bg-[#0AE448]/10 border border-[#0AE448]/30 px-2 py-0.5 rounded-md">
                Destino: {testPhone || whiteLabel.consultantWhatsApp}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="5511999999999"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl focus:border-[#0AE448] focus:outline-none font-mono font-bold"
                />
                <button
                  onClick={handleSendTestMessage}
                  disabled={isSendingTest}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-[#FFFCE1] font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-spin' : ''}`} />
                  <span>{isSendingTest ? 'Enviando...' : 'Testar Disparo'}</span>
                </button>
              </div>

              {whiteLabel.consultantWhatsApp && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTestPhone(whiteLabel.consultantWhatsApp)}
                    className="text-[11px] text-[#0AE448] hover:underline font-semibold cursor-pointer"
                  >
                    Usar WhatsApp da Agência: {whiteLabel.consultantWhatsApp}
                  </button>
                </div>
              )}
            </div>

            {testResult && (
              <div className="space-y-2">
                <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  testResult.success ? 'bg-[#0AE448]/10 border-[#0AE448]/30 text-[#0AE448]' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                }`}>
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 text-[#0AE448] shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                  <span>{testResult.message}</span>
                </div>

                {testResult.directUrl && (
                  <a
                    href={testResult.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0AE448]/20 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4 text-slate-950" />
                    <span>Abrir Conversa no WhatsApp ({testPhone}) com Alerta</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-950" />
                  </a>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
