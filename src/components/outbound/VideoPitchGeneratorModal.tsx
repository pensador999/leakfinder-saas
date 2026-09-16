import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Check, 
  Copy, 
  ExternalLink, 
  Play, 
  ShieldAlert, 
  X,
  Smartphone,
  Layers,
  Send,
  Clock
} from 'lucide-react';
import { generateVideoPitchScript, VideoPitchScript } from '../../services/outbound/videoPitchGenerator';
import { createAvatarVideoSpec, AvatarVideoCompositionSpec } from '../../services/outbound/avatarVideoAdapter';
import { generateVisualEvidencePayload } from '../../services/vision/playwrightEvidenceCapture';

interface VideoPitchGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeDomain: string;
  merchantName?: string;
  productTitle?: string;
  brokenSizes?: string[];
  estimatedMonthlyLoss?: number;
}

export const VideoPitchGeneratorModal: React.FC<VideoPitchGeneratorModalProps> = ({
  isOpen,
  onClose,
  storeDomain,
  merchantName = 'Gestor',
  productTitle = 'Camisa Masculina Premium UV50+',
  brokenSizes = ['M', 'G'],
  estimatedMonthlyLoss = 5280
}) => {
  const [activeTab, setActiveTab] = useState<'PREVIEW' | 'SCRIPT' | 'DISPATCH'>('PREVIEW');
  const [copied, setCopied] = useState(false);
  const [isPlayingMock, setIsPlayingMock] = useState(false);

  if (!isOpen) return null;

  // Generate real data payload
  const script: VideoPitchScript = generateVideoPitchScript({
    storeDomain,
    merchantName,
    productTitle,
    brokenSizes,
    estimatedMonthlyLoss
  });

  const evidence = generateVisualEvidencePayload({
    storeDomain,
    productTitle,
    productUrl: `https://${storeDomain}/products/sample`,
    brokenSizes
  });

  const composition: AvatarVideoCompositionSpec = createAvatarVideoSpec({ script, evidence });

  const handleCopyScript = () => {
    navigator.clipboard.writeText(script.fullSpeechText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/20">
              <Video className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Gerador de Vídeo-Avatar Outbound</h3>
                <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-400 border border-amber-500/20">
                  Duix-Avatar • 15s
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Prospecção hyper-personalizada chamando {merchantName} pelo nome com o site ao fundo
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('PREVIEW')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'PREVIEW'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="h-4 w-4" />
            Preview Vertical (9:16)
          </button>
          <button
            onClick={() => setActiveTab('SCRIPT')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'SCRIPT'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="h-4 w-4" />
            Roteiro Calibrado ({script.estimatedDurationSeconds}s)
          </button>
          <button
            onClick={() => setActiveTab('DISPATCH')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'DISPATCH'
                ? 'border-orange-500 text-orange-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="h-4 w-4" />
            A Trinca de Fechamento (WhatsApp)
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'PREVIEW' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Phone Mockup (9:16) */}
              <div className="md:col-span-5 flex justify-center">
                <div className="relative w-64 h-[440px] rounded-[36px] border-4 border-slate-700 bg-slate-950 p-2 shadow-2xl shadow-orange-950/30 overflow-hidden flex flex-col justify-between">
                  
                  {/* Speaker notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-3 bg-slate-800 rounded-full z-20" />

                  {/* Background: Store Website Evidence Screenshot */}
                  <div className="absolute inset-0 bg-slate-900 flex flex-col justify-center items-center p-3 text-center">
                    <div className="w-full bg-slate-950/90 rounded-xl p-3 border border-red-500/40 shadow-lg">
                      <span className="text-[10px] font-bold text-red-400 flex items-center justify-center gap-1">
                        <ShieldAlert className="h-3 w-3" /> PROVA DO CRIME • {storeDomain.toUpperCase()}
                      </span>
                      <p className="text-xs font-extrabold text-white mt-1">{productTitle}</p>
                      <div className="mt-2 flex justify-center gap-1">
                        {brokenSizes.map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-red-500/20 text-red-400 border border-red-500 line-through">
                            {s} [OFF]
                          </span>
                        ))}
                      </div>
                      <span className="mt-2 block text-[9px] text-slate-400 bg-slate-800/80 rounded py-1">
                        Botão de Compra Desabilitado
                      </span>
                    </div>
                  </div>

                  {/* Top Notification Badge */}
                  <div className="relative z-10 mt-6 flex justify-between items-center px-2">
                    <span className="rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                      ⚡ WhatsApp Pitch
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">00:15</span>
                  </div>

                  {/* Avatar PiP (Bottom-Right Circle) */}
                  <div className="relative z-10 flex justify-end p-2 items-end">
                    <div className="relative h-20 w-20 rounded-full border-2 border-orange-400 bg-gradient-to-tr from-slate-800 to-slate-700 shadow-xl overflow-hidden flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-xl">🎙️</span>
                        <span className="block text-[8px] font-extrabold text-orange-400">AVATAR IA</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-black/70 py-0.5 text-[7px] font-bold text-center text-white">
                        LUCAS
                      </div>
                    </div>
                  </div>

                  {/* Live Subtitles Strip */}
                  <div className="relative z-10 mb-2 mx-1 bg-black/80 backdrop-blur rounded-lg p-1.5 text-center border border-yellow-500/30">
                    <p className="text-[10px] font-extrabold text-yellow-300 leading-tight">
                      "Fala, {merchantName}! Vi que os tamanhos [{brokenSizes.join(', ')}] estão zerados no seu site..."
                    </p>
                  </div>
                </div>
              </div>

              {/* Pitch Summary & Specs */}
              <div className="md:col-span-7 space-y-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                    Engenharia de Conversão do Vídeo
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Chama pelo nome próprio:</strong> Abertura quebrando qualquer defesa de mensagem automática.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Tela real ao fundo:</strong> Exibe a prova de que o tamanho M/G está rompido no e-commerce dele.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Risco em R$:</strong> Apresenta a perda mensal estimada de R$ {estimatedMonthlyLoss.toLocaleString('pt-BR')}/mês com o simulador.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Fechamento 1-Clique:</strong> Link direto da assinatura do Sentinela anexado na mensagem.</span>
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsPlayingMock(!isPlayingMock)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 py-3 px-4 text-xs font-bold text-white hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg shadow-orange-500/20"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    {isPlayingMock ? 'Pausar Simulação' : 'Simular Vídeo Falante'}
                  </button>
                  <button
                    onClick={handleCopyScript}
                    className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    {copied ? 'Copiado!' : 'Copiar Roteiro'}
                  </button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'SCRIPT' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Duração Alvo</span>
                  <p className="text-lg font-bold text-orange-400">~{script.estimatedDurationSeconds}s</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Total de Palavras</span>
                  <p className="text-lg font-bold text-white">{script.wordCount} palavras</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Velocidade da Fala</span>
                  <p className="text-lg font-bold text-emerald-400">2.9 pal/seg</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400">Formato de Saída</span>
                  <p className="text-lg font-bold text-amber-400">MP4 (9:16)</p>
                </div>
              </div>

              {/* Script Blocks */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80">
                  <div className="flex justify-between text-[11px] font-bold text-orange-400 mb-1">
                    <span>BLOCO 1: GANCHO & QUEBRA DE PADRÃO (0-4s)</span>
                    <span className="text-slate-500 font-mono">00:00 - 00:04</span>
                  </div>
                  <p className="text-xs text-slate-200">{script.scriptBlocks.hook}</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80">
                  <div className="flex justify-between text-[11px] font-bold text-orange-400 mb-1">
                    <span>BLOCO 2: A PROVA DO CRIME AO FUNDO (4-9s)</span>
                    <span className="text-slate-500 font-mono">00:04 - 00:09</span>
                  </div>
                  <p className="text-xs text-slate-200">{script.scriptBlocks.proof}</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80">
                  <div className="flex justify-between text-[11px] font-bold text-orange-400 mb-1">
                    <span>BLOCO 3: IMPACTO FINANCEIRO AUDITADO (9-14s)</span>
                    <span className="text-slate-500 font-mono">00:09 - 00:14</span>
                  </div>
                  <p className="text-xs text-slate-200">{script.scriptBlocks.financial}</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-800 bg-slate-950/80">
                  <div className="flex justify-between text-[11px] font-bold text-orange-400 mb-1">
                    <span>BLOCO 4: CALL TO ACTION IMEDIATO (14-18s)</span>
                    <span className="text-slate-500 font-mono">00:14 - 00:18</span>
                  </div>
                  <p className="text-xs text-slate-200">{script.scriptBlocks.cta}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'DISPATCH' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <Check className="h-4 w-4" /> A Trinca de Ouro (Estrutura Completa de Entrega)
                </span>
                <p className="text-xs text-slate-300 mb-3">
                  Quando o disparador do WhatsApp envia a prospecção, o lojista recebe a sequência cirúrgica:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-bold text-orange-400 block mb-1">1. VÍDEO VERTICAL 9:16</span>
                    <p className="text-xs text-slate-300">Avatar IA falando o nome dele com o site e selo esgotado ao fundo.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-bold text-orange-400 block mb-1">2. PRINT EM ALTA RESOLUÇÃO</span>
                    <p className="text-xs text-slate-300">Screenshot Playwright com moldura vermelha do botão desabilitado.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] font-bold text-orange-400 block mb-1">3. LAUDO COM CHECKOUT STRIPE</span>
                    <p className="text-xs text-slate-300">Fórmula transparente + Link de 1-clique com garantia de 7 dias.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-3 flex justify-between items-center text-xs text-slate-400">
          <span>Modo de Operação: <strong>Simulação Local / Sandbox 100% Protegido</strong></span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
