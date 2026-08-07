import React, { useState, useEffect } from 'react';
import { Settings, X, Key, Shield, AlertTriangle, Save, Paintbrush, Building, Image, Link } from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey } from '../services/llmService';
import { getWhiteLabelConfig, setWhiteLabelConfig, WhiteLabelConfig } from '../services/whiteLabelService';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>({
    agencyName: '',
    logoUrl: '',
    primaryColor: '#0ea5e9',
    checkoutUrlStarter: '',
    checkoutUrlPro: '',
    checkoutUrlAgency: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const existing = getGeminiApiKey();
    if (existing) setApiKey(existing);
    
    setWhiteLabel(getWhiteLabelConfig());
  }, []);

  const handleSave = () => {
    setGeminiApiKey(apiKey.trim());
    setWhiteLabelConfig(whiteLabel);
    setSaved(true);
    
    // Dispatch event to update UI globally if needed
    window.dispatchEvent(new Event('whitelabel-updated'));

    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Configurações Gerais</h2>
              <p className="text-sm text-slate-400">Personalize a plataforma e a inteligência artificial.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* Sessão White Label */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">White Label (Sua Agência)</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Nome da Empresa / Agência
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={whiteLabel.agencyName}
                    onChange={(e) => setWhiteLabel({ ...whiteLabel, agencyName: e.target.value })}
                    placeholder="Sua Agência..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  Cor Primária (Hex)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Paintbrush className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="color"
                    value={whiteLabel.primaryColor}
                    onChange={(e) => setWhiteLabel({ ...whiteLabel, primaryColor: e.target.value })}
                    className="absolute inset-y-0 right-2 top-1.5 h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <input
                    type="text"
                    value={whiteLabel.primaryColor}
                    onChange={(e) => setWhiteLabel({ ...whiteLabel, primaryColor: e.target.value })}
                    placeholder="#0ea5e9"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-12 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono text-sm uppercase"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                URL da Logo (Opcional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Image className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={whiteLabel.logoUrl}
                  onChange={(e) => setWhiteLabel({ ...whiteLabel, logoUrl: e.target.value })}
                  placeholder="https://sua-empresa.com/logo.png"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Sessão Pagamentos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Pagamentos (Links de Checkout)</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  URL Checkout - Plano Starter
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={whiteLabel.checkoutUrlStarter}
                    onChange={(e) => setWhiteLabel({ ...whiteLabel, checkoutUrlStarter: e.target.value })}
                    placeholder="https://pay.kiwify.com.br/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  URL Checkout - Plano Pro
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={whiteLabel.checkoutUrlPro}
                    onChange={(e) => setWhiteLabel({ ...whiteLabel, checkoutUrlPro: e.target.value })}
                    placeholder="https://pay.kiwify.com.br/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">
                  URL Checkout - Plano Agency
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="w-4 h-4 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={whiteLabel.checkoutUrlAgency}
                    onChange={(e) => setWhiteLabel({ ...whiteLabel, checkoutUrlAgency: e.target.value })}
                    placeholder="https://pay.kiwify.com.br/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sessão IA */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-2">Motor Neural (IA)</h3>
            
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
              <div className="text-sm text-amber-200/90 leading-relaxed">
                <strong>Integração LLM Ativada:</strong> O sistema usará a Inteligência Artificial (Google Gemini 2.5) para as auditorias. Caso a chave seja inválida ou esteja em branco, será utilizado o motor de contingência estático.
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-slate-300">
                Chave de API (Google Gemini)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="w-5 h-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-mono text-sm"
                />
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Sua chave é armazenada de forma segura apenas no seu navegador local.
              </p>
            </div>
          </div>
          
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saved}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 disabled:opacity-50"
          >
            {saved ? (
              <>Salvo com sucesso!</>
            ) : (
              <><Save className="w-4 h-4" /> Salvar Configurações</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
