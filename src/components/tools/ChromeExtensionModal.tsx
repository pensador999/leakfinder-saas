import React from 'react';
import { 
  X, 
  Puzzle, 
  Download, 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Zap,
  Globe,
  Copy,
  Check
} from 'lucide-react';

interface ChromeExtensionModalProps {
  onClose: () => void;
}

export const ChromeExtensionModal: React.FC<ChromeExtensionModalProps> = ({ onClose }) => {
  const [copiedUrl, setCopiedUrl] = React.useState(false);

  const handleCopyExtensionsUrl = () => {
    navigator.clipboard.writeText('chrome://extensions/');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[80] flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[92vh] border border-slate-200 animate-fadeIn">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30">
              <Puzzle className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm tracking-tight text-white">Extensão Oficial do Google Chrome</h3>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold">
                  Manifest V3
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Audite lojas em tempo real direto na barra do seu navegador ao visitar qualquer cliente.
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-sm">
                🚨
              </div>
              <h4 className="text-xs font-bold text-slate-900">Alerta de Grade Furada</h4>
              <p className="text-[11px] text-slate-600 leading-tight">
                Pisca na hora se a loja estiver rodando anúncios em produtos com tamanhos esgotados.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold text-sm">
                ⚡
              </div>
              <h4 className="text-xs font-bold text-slate-900">1-Clique para WhatsApp</h4>
              <p className="text-[11px] text-slate-600 leading-tight">
                Copia scripts prontos com cálculo de perda em R$ para enviar ao cliente imediatamente.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                🛡️
              </div>
              <h4 className="text-xs font-bold text-slate-900">Zero Instalação no Servidor</h4>
              <p className="text-[11px] text-slate-600 leading-tight">
                Inspeciona o DOM público da página sem precisar de permissão ou acesso do cliente.
              </p>
            </div>
          </div>

          {/* Installation Steps Guide */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              Tutorial de Instalação Rápida (2 Minutos):
            </h4>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  1
                </span>
                <div>
                  <strong>Abra a tela de Extensões do Google Chrome:</strong>
                  <p className="text-slate-400 mt-0.5">Digite na barra do navegador ou copie:</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg font-mono text-emerald-400 text-[11px]">
                      chrome://extensions/
                    </code>
                    <button
                      onClick={handleCopyExtensionsUrl}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUrl ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  2
                </span>
                <div>
                  <strong>Ative o "Modo do Desenvolvedor":</strong>
                  <p className="text-slate-400 mt-0.5">Ative a chave no canto superior direito da página do Chrome.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                  3
                </span>
                <div>
                  <strong>Clique em "Carregar sem compactação" (Load Unpacked):</strong>
                  <p className="text-slate-400 mt-0.5">Selecione a pasta <code className="text-indigo-300">public/chrome-extension</code> do projeto ou o pacote descompactado.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/chrome-extension/manifest.json"
                target="_blank"
                download="manifest.json"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Visualizar Pacote da Extensão (.JSON / Scripts)</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
