import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Settings, 
  X, 
  RefreshCw, 
  Check, 
  Radio,
  ExternalLink,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { 
  getWhatsAppGatewayConfig, 
  saveWhatsAppGatewayConfig, 
  WhatsAppGatewayConfig, 
  dispatchWhatsAppAlert 
} from '../services/workers/whatsappAlertWorker';

interface WhatsAppWatchdogSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppWatchdogSettingsModal: React.FC<WhatsAppWatchdogSettingsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [config, setConfig] = useState<WhatsAppGatewayConfig>(getWhatsAppGatewayConfig());
  const [testPhone, setTestPhone] = useState<string>(getWhatsAppGatewayConfig().defaultPhone || '5534991351122');
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; directUrl?: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getWhatsAppGatewayConfig();
      setConfig(cfg);
      if (cfg.defaultPhone) setTestPhone(cfg.defaultPhone);
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
        `📊 *Loja Monitorada:* BRK Agro & BRK Fishing\n` +
        `🔍 *Diagnóstico:* Catálogo e Grade Auditados\n\n` +
        `🔗 Painel Oficial: https://adshield.ai`,
      priority: 'HIGH' as const,
      metadata: {
        storeId: 'test-store',
        storeUrl: 'https://adshield.ai',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 rounded-2xl text-white shadow-md shadow-emerald-600/30">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Agente 18 — WhatsApp Executive Watchdog Worker</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                  Vigilância 07:00
                </span>
              </div>
              <p className="text-xs text-slate-400">Gateway para entrega proativa de alertas de ruptura e relatórios executivos no WhatsApp do decisor.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {savedSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Configurações do WhatsApp salvas com sucesso!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Gateway Provider Selector */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">Provedor de Envio WhatsApp</label>
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
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer font-bold ${
                      config.provider === item.id
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Link Explainer */}
            {config.provider === 'DIRECT_LINK' && (
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-2.5 animate-fadeIn">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-950 leading-relaxed">
                  <span className="font-bold">Protocolo Oficial Click-to-Chat Ativo:</span> Os alertas executivos geram deep-links criptografados da API oficial do WhatsApp (<code className="bg-emerald-100/70 px-1 py-0.5 rounded font-mono text-[11px]">api.whatsapp.com</code>), permitindo abertura imediata no WhatsApp Web ou Mobile sem risco de banimento.
                </div>
              </div>
            )}

            {/* Endpoint URL & Token */}
            {config.provider !== 'SIMULATION' && config.provider !== 'DIRECT_LINK' && (
              <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-fadeIn">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL da Instância / Webhook</label>
                  <input
                    type="url"
                    required
                    placeholder="https://api.evolution.suaempresa.com/message/sendText/adshield"
                    value={config.endpointUrl}
                    onChange={(e) => setConfig({ ...config, endpointUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">API Key / Token de Autenticação</label>
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                    value={config.apiToken || ''}
                    onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Salvar Configurações
              </button>
            </div>
          </form>

          <hr className="border-slate-200" />

          {/* Test Dispatch Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-emerald-600" />
                Disparo Executivo Real no WhatsApp
              </h3>
              <span className="text-[10px] text-emerald-700 font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded-md">
                Destino: 5534991351122
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="5534991351122"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono font-bold"
                />
                <button
                  onClick={handleSendTestMessage}
                  disabled={isSendingTest}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSendingTest ? 'animate-spin' : ''}`} />
                  <span>{isSendingTest ? 'Enviando...' : 'Testar Disparo'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTestPhone('5534991351122')}
                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold underline cursor-pointer"
                >
                  Usar meu WhatsApp: (34) 99135-1122
                </button>
              </div>
            </div>

            {testResult && (
              <div className="space-y-2">
                <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                  testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span>{testResult.message}</span>
                </div>

                {testResult.directUrl && (
                  <a
                    href={testResult.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>📲 Abrir Conversa no WhatsApp (34 99135-1122) com Alerta</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
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
