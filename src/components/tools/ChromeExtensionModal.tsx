import React, { useState } from 'react';
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
  Check,
  Play,
  Monitor,
  Sparkles,
  Send
} from 'lucide-react';

interface ChromeExtensionModalProps {
  onClose: () => void;
}

interface SimulatedStoreAudit {
  domain: string;
  platform: string;
  score: number;
  estimatedLoss: number;
  hasPixel: boolean;
  brokenGrid: string;
  sizeChart: string;
  cnpjStatus: string;
}

const SAMPLE_SIMULATIONS: Record<string, SimulatedStoreAudit> = {
  'brkagro.com.br': {
    domain: 'brkagro.com.br',
    platform: 'Shopify',
    score: 75,
    estimatedLoss: 101727,
    hasPixel: true,
    brokenGrid: '14 SKUs (Tamanhos M e G esgotados)',
    sizeChart: 'Instalada (<product-addons>)',
    cnpjStatus: 'Conforme (No Rodapé)'
  },
  'brkfishing.com.br': {
    domain: 'brkfishing.com.br',
    platform: 'Shopify',
    score: 75,
    estimatedLoss: 68673,
    hasPixel: true,
    brokenGrid: '9 SKUs (Tamanho GG esgotado)',
    sizeChart: 'Instalada (<product-addons>)',
    cnpjStatus: 'Conforme (No Rodapé)'
  },
  'countrylifestore.com.br': {
    domain: 'countrylifestore.com.br',
    platform: 'Nuvemshop',
    score: 62,
    estimatedLoss: 14500,
    hasPixel: true,
    brokenGrid: '4 SKUs (Camisa Work G/GG rompidas)',
    sizeChart: 'Ausente na PDP',
    cnpjStatus: 'Conforme (No Rodapé)'
  }
};

export const ChromeExtensionModal: React.FC<ChromeExtensionModalProps> = ({ onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedEdgeUrl, setCopiedEdgeUrl] = useState(false);
  const [activeBrowserTab, setActiveBrowserTab] = useState<'CHROME' | 'EDGE'>('CHROME');
  const [selectedSimDomain, setSelectedSimDomain] = useState<string>('brkagro.com.br');
  const [copiedPitch, setCopiedPitch] = useState<boolean>(false);

  const activeAudit = SAMPLE_SIMULATIONS[selectedSimDomain] || SAMPLE_SIMULATIONS['brkagro.com.br'];

  const handleCopyUrl = (url: string, type: 'CHROME' | 'EDGE') => {
    navigator.clipboard.writeText(url);
    if (type === 'CHROME') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedEdgeUrl(true);
      setTimeout(() => setCopiedEdgeUrl(false), 2000);
    }
  };

  const handleCopySimulatedPitch = () => {
    const text = `🚨 *DIAGNÓSTICO ADSHIELD • SINAL DE RISCO EM ANÚNCIOS*\n\n` +
      `Olá! Inspecionamos a loja *${activeAudit.domain}* (${activeAudit.platform}) e identificamos que há produtos ativos em campanhas sofrendo com *${activeAudit.brokenGrid}*.\n\n` +
      `💸 *Desperdício Estimado em Cliques:* ~R$ ${activeAudit.estimatedLoss.toLocaleString('pt-BR')}/mês\n` +
      `🎯 *Recomendação Imediata:* Pausar anúncios desses SKUs ou substituir pelas URLs com grade disponível.\n\n` +
      `👉 Veja o laudo técnico completo: https://leakfinder-green.vercel.app/?url=${encodeURIComponent(activeAudit.domain)}`;

    navigator.clipboard.writeText(text);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[80] flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 relative flex flex-col max-h-[94vh] border border-slate-200 animate-fadeIn">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <Puzzle className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base tracking-tight text-white">Extensão Oficial AdShield Inspector 2.0</h3>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold">
                  Manifest V3 • Chrome & Edge
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Inspecione lojas em tempo real ao navegar, detecte rupturas de grade, pixels e gere scripts de fechamento para WhatsApp.
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
          
          {/* Main Download Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
                  📦 PACOTE .ZIP HOMOLOGADO
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">Versão 2.0.0 (6.85 KB)</span>
              </div>
              <h4 className="text-sm font-bold text-white">Baixe o Pacote da Extensão Pronto para Instalação</h4>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Arquivo compactado com todos os scripts (`manifest.json`, `content.js`, `popup.html`, ícones 16/48/128px) 100% pronto para carregar no navegador.
              </p>
            </div>

            <a
              href="/adshield-inspector-extension.zip"
              download="adshield-inspector-extension.zip"
              className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Extensão (.ZIP em 1 Clique)</span>
            </a>
          </div>

          {/* 2-Columns Grid: Installation Guide on Left, Interactive Live Simulator on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Installation Step-by-Step (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider">
                  Guia Rápido de Instalação (1 Minuto):
                </h4>

                {/* Browser Selector */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-mono font-bold">
                  <button
                    onClick={() => setActiveBrowserTab('CHROME')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeBrowserTab === 'CHROME' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Chrome
                  </button>
                  <button
                    onClick={() => setActiveBrowserTab('EDGE')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      activeBrowserTab === 'EDGE' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Edge
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4 text-xs">
                
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                    1
                  </span>
                  <div>
                    <strong>Descompacte o arquivo .ZIP baixado:</strong>
                    <p className="text-slate-400 mt-0.5">
                      Extraia o arquivo <code className="text-indigo-300">adshield-inspector-extension.zip</code> para uma pasta no seu computador.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                    2
                  </span>
                  <div>
                    <strong>Abra a página de Extensões do seu Navegador:</strong>
                    <div className="flex items-center gap-2 mt-1.5">
                      <code className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg font-mono text-emerald-400 text-[11px]">
                        {activeBrowserTab === 'CHROME' ? 'chrome://extensions/' : 'edge://extensions/'}
                      </code>
                      <button
                        onClick={() => handleCopyUrl(
                          activeBrowserTab === 'CHROME' ? 'chrome://extensions/' : 'edge://extensions/',
                          activeBrowserTab
                        )}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {(activeBrowserTab === 'CHROME' ? copiedUrl : copiedEdgeUrl) ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copiar</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                    3
                  </span>
                  <div>
                    <strong>Ative o "Modo do Desenvolvedor":</strong>
                    <p className="text-slate-400 mt-0.5">
                      {activeBrowserTab === 'CHROME' 
                        ? 'Ative a chave no canto superior direito da tela do Chrome.'
                        : 'Ative a chave no menu lateral esquerdo do Microsoft Edge.'
                      }
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-xs">
                    4
                  </span>
                  <div>
                    <strong>Clique em "Carregar sem compactação" (Load Unpacked):</strong>
                    <p className="text-slate-400 mt-0.5">
                      Selecione a pasta descompactada da extensão. O ícone 🛡️ aparecerá imediatamente na sua barra de ferramentas!
                    </p>
                  </div>
                </div>

              </div>

              {/* Security & Zero-Trust Notice */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Segurança Zero-Trust & Privacidade Absoluta:</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  A extensão lê apenas o DOM público do navegador para detectar pixels e rupturas. Ela nunca coleta senhas, cookies de sessão nem dados de pagamento.
                </p>
              </div>
            </div>

            {/* Right Column: Live Interactive Simulator (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Simulador Interativo da Extensão:</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Teste ao vivo</span>
              </div>

              {/* Store Switcher for Simulation */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {Object.keys(SAMPLE_SIMULATIONS).map(dom => (
                  <button
                    key={dom}
                    onClick={() => setSelectedSimDomain(dom)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
                      selectedSimDomain === dom
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>

              {/* Simulated Popup UI (Mirroring real popup.html) */}
              <div className="p-4 rounded-3xl bg-slate-950 border border-slate-800 text-white shadow-2xl space-y-3 font-sans max-w-sm mx-auto">
                
                {/* Popup Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-indigo-600/40">
                      🛡️
                    </div>
                    <span className="text-xs font-black">AdShield AI Inspector</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {activeAudit.platform}
                  </span>
                </div>

                {/* Domain & Score Bar */}
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono">
                  <span className="font-bold text-sky-400 truncate max-w-[170px]">{activeAudit.domain}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black text-[10px]">
                    Score: {activeAudit.score}/100
                  </span>
                </div>

                {/* Loss Card */}
                <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 border border-indigo-500/30 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase text-indigo-300 font-bold">
                    <span>Vazamento Financeiro Estimado</span>
                    <span className="text-rose-400">🚨 Em Ads</span>
                  </div>
                  <div className="text-xl font-black font-mono text-rose-400">
                    R$ {activeAudit.estimatedLoss.toLocaleString('pt-BR')} /mês
                  </div>
                  <div className="text-[9px] text-slate-400">Calculado com base em tamanhos rompidos no tráfego pago</div>
                </div>

                {/* Checklist */}
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-[11px]">
                  <div className="text-[9px] font-mono font-bold uppercase text-slate-400">Diagnóstico ao Vivo:</div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">🎯 Meta Pixel / Tráfego:</span>
                    <span className="text-emerald-400 font-bold font-mono">Ativo (Detectado)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">⚠️ Ruptura de Grade:</span>
                    <span className="text-rose-400 font-bold font-mono truncate max-w-[150px]">{activeAudit.brokenGrid}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">📏 Tabela de Medidas:</span>
                    <span className="text-emerald-400 font-bold font-mono">{activeAudit.sizeChart}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">⚖️ Conformidade CNPJ:</span>
                    <span className="text-emerald-400 font-bold font-mono">{activeAudit.cnpjStatus}</span>
                  </div>
                </div>

                {/* Simulated Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={handleCopySimulatedPitch}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{copiedPitch ? '✅ Script WhatsApp Copiado!' : 'Copiar Alerta WhatsApp para o Gestor'}</span>
                  </button>

                  <a
                    href={`/?loja=${encodeURIComponent(activeAudit.domain)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer block text-center"
                  >
                    <span>🚀 Abrir Diagnóstico Completo no SaaS</span>
                  </a>
                </div>

                <div className="text-center text-[9px] text-slate-500 font-mono pt-1">
                  Preview 1:1 da Extensão AdShield AI
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
