import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  ShieldCheck,
  Flame,
  Phone,
  Headphones,
  RotateCcw,
  Calculator,
  TrendingUp,
  DollarSign,
  ArrowRight,
  Zap,
  Clock,
  UserCheck
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { askConciergeMasterBrain, getFreshNonRepetitiveQuickReplies } from '../services/agents/conciergeNeuralMasterBrain';
import { buildWhatsAppClickToChatUrl } from '../services/prospecting/leadSniperEngine';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  isRoiResult?: boolean;
  roiData?: {
    spend: number;
    savedMonthly: number;
    planRecommended: string;
  };
}

export const FloatingAiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hasNewBadge, setHasNewBadge] = useState<boolean>(true);
  const [leadPhone, setLeadPhone] = useState<string>('');
  const [leadCaptured, setLeadCaptured] = useState<boolean>(false);
  const [isRoiMode, setIsRoiMode] = useState<boolean>(false);
  const [roiSpendInput, setRoiSpendInput] = useState<number>(15000);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Olá! Sou o Concierge de IA do AdShield OS.\n\nEstou online 24h para responder dúvidas técnicas de catálogo, integração com Shopify/VTEX, métricas de sangria no Meta Ads ou valores de planos.\n\nComo posso acelerar seu resultado hoje?',
      timestamp: 'Agora',
      quickReplies: [
        'Calcular meu ROI em 15s',
        'Como o AdShield detecta grade furada em tempo real?',
        'Como vocês calculam a perda no Meta Ads?',
        'Falar direto com Lucas no WhatsApp'
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasNewBadge(false);
    }
  }, [messages, isOpen, isRoiMode]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Special trigger: ROI Calculator
    if (text.includes('Calcular meu ROI')) {
      setIsRoiMode(true);
      const userMsg: ChatMessage = {
        id: `u-${Date.now()}`,
        sender: 'user',
        text: 'Gostaria de calcular o ROI da minha loja no AdShield.',
        timestamp: 'Agora'
      };
      setMessages(prev => [...prev, userMsg]);
      setInputText('');
      return;
    }

    // Special trigger: WhatsApp Direct
    if (text.includes('Falar direto com Lucas')) {
      handleOpenWhatsAppWithLucas('Olá Lucas! Estava navegando no AdShield e gostaria de tirar uma dúvida sobre a proteção de anúncios da minha loja.');
      return;
    }

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Agora'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const history = messages.map(m => ({ sender: m.sender, text: m.text }));
      const result = await askConciergeMasterBrain({
        userQuestion: text.trim(),
        conversationHistory: history
      });

      const newBotMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: result.answerText,
        timestamp: 'Agora',
        quickReplies: result.suggestedQuickReplies
      };

      setMessages(prev => [...prev, newBotMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `b-err-${Date.now()}`,
        sender: 'bot',
        text: 'Estou pronto para ajudar! Você pode simular seu ROI agora, auditar sua loja no topo do site ou falar diretamente com o Lucas no WhatsApp (34 99135-1122).',
        timestamp: 'Agora',
        quickReplies: ['Calcular meu ROI em 15s', 'Falar direto com Lucas no WhatsApp']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCalculateRoi = (spend: number) => {
    // Cálculo: cerca de 18% a 24% da verba de anúncio de e-commerces de moda/calçados é desperdiçada em tamanhos esgotados
    const estimatedSaved = Math.round(spend * 0.21);
    const plan = spend > 30000 ? 'Plano Enterprise' : (spend > 10000 ? 'Plano Pro' : 'Plano Starter');

    const roiBotMsg: ChatMessage = {
      id: `roi-${Date.now()}`,
      sender: 'bot',
      text: `**Simulação de ROI Concluída:**\n\nInvestindo **R$ ${spend.toLocaleString('pt-BR')}/mês** em tráfego pago:\n\n• **Desperdício em Rupturas Evitado:** ~R$ ${estimatedSaved.toLocaleString('pt-BR')}/mês\n• **Recuperação Anual Estimada:** R$ ${(estimatedSaved * 12).toLocaleString('pt-BR')}\n• **Plano Recomendado:** ${plan}\n\nO AdShield se paga já nos primeiros 3 a 5 dias de operação ao congelar anúncios que levam para variantes esgotadas!`,
      timestamp: 'Agora',
      isRoiResult: true,
      roiData: {
        spend,
        savedMonthly: estimatedSaved,
        planRecommended: plan
      },
      quickReplies: [
        'Falar direto com Lucas no WhatsApp',
        'Como funciona a garantia de 7 dias?',
        'Como instalar na minha loja em 2 minutos?'
      ]
    };

    setMessages(prev => [...prev, roiBotMsg]);
    setIsRoiMode(false);
  };

  const handleOpenWhatsAppWithLucas = (customText?: string) => {
    const text = customText || `Olá Lucas! Vim pelo Concierge do AdShield. Gostaria de entender mais sobre como blindar os anúncios da minha loja contra produtos esgotados.`;
    const url = buildWhatsAppClickToChatUrl('5534991351122', text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCaptureLeadPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = leadPhone.replace(/\D/g, '');
    if (cleanPhone.length < 9) return;

    // Persiste no localStorage de leads do AdShield
    try {
      const existingLeads = JSON.parse(localStorage.getItem('adshield_concierge_leads') || '[]');
      existingLeads.unshift({
        phone: leadPhone.trim(),
        capturedAt: new Date().toISOString(),
        source: 'FLOATING_AI_CONCIERGE'
      });
      localStorage.setItem('adshield_concierge_leads', JSON.stringify(existingLeads));
    } catch {
      // ignore
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('alert_dispatch_queue').insert([
          {
            phone_number: leadPhone.trim(),
            message_body: 'Lead capturado via Chatbot Concierge Flutuante (IA 24h)',
            alert_type: 'CONCIERGE_LEAD',
            priority: 'HIGH',
            status: 'PENDING'
          }
        ]);
      } catch {
        // fallback
      }
    }

    const nextReplies = getFreshNonRepetitiveQuickReplies([
      'Calcular meu ROI em 15s',
      'Como funciona a garantia incondicional de 7 dias do CDC?',
      'Falar direto com Lucas no WhatsApp'
    ], messages.map(m => ({ sender: m.sender, text: m.text })));

    setLeadCaptured(true);
    setMessages(prev => [
      ...prev,
      {
        id: `b-captured-${Date.now()}`,
        sender: 'bot',
        text: `Perfeito! Seu WhatsApp (${leadPhone}) foi registrado. Nossa equipe técnica já recebeu seu contato e pode te enviar o dossiê da sua loja.\n\nSe preferir agilizar, você também pode clicar no botão verde abaixo para abrir a conversa direta com o Lucas agora mesmo!`,
        timestamp: 'Agora',
        quickReplies: nextReplies
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* 🔮 Trigger Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl shadow-2xl shadow-blue-950/40 flex items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer border border-blue-400/30"
          aria-label="Abrir Concierge de IA"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-cyan-300" />
            <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1.5 -right-1.5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          
          {hasNewBadge && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          )}

          <span className="absolute right-full mr-3 px-3.5 py-2 bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all shadow-xl pointer-events-none border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Concierge IA 24h • Tire Dúvidas ou Calcule ROI</span>
          </span>
        </button>
      )}

      {/* 🏛️ Floating Chat Window */}
      {isOpen && (
        <div className="bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-3xl w-[360px] sm:w-[420px] h-[580px] shadow-2xl shadow-slate-900/25 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header Executive Deep Obsidian */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2.5 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 rounded-xl text-white shadow-md shadow-blue-500/30">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight">AdShield Concierge</h3>
                  <span className="px-2 py-0.2 bg-blue-500/20 text-blue-300 text-[10px] font-mono font-bold rounded border border-blue-500/30">
                    IA 24h
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <span className="text-emerald-400 font-medium">Online</span> • Lucas & Time Técnico
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleOpenWhatsAppWithLucas()}
                className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer"
                title="Abrir WhatsApp oficial do Lucas (34 99135-1122)"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Ribbon: ROI Calculator & Fast WhatsApp Button */}
          <div className="px-3 py-2 bg-slate-100/90 border-b border-slate-200/80 flex items-center justify-between gap-2 text-xs font-bold font-mono">
            <button
              onClick={() => setIsRoiMode(prev => !prev)}
              className={`px-3 py-1 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-[11px] ${
                isRoiMode 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 hover:border-blue-300'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulador ROI 15s</span>
            </button>

            <button
              onClick={() => handleOpenWhatsAppWithLucas()}
              className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] transition-all flex items-center gap-1 cursor-pointer"
            >
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>Falar no WhatsApp</span>
            </button>
          </div>

          {/* Interactive ROI Calculator Drawer (Inline) */}
          {isRoiMode && (
            <div className="p-4 bg-gradient-to-br from-blue-900 to-indigo-950 text-white border-b border-blue-800 animate-fadeIn space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 font-mono">
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  Calculadora Expressa de Desperdício Evitado
                </span>
                <button 
                  onClick={() => setIsRoiMode(false)}
                  className="text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] text-slate-300 block">
                  Quanto sua loja investe no Meta Ads por mês?
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[5000, 15000, 30000, 60000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setRoiSpendInput(val)}
                      className={`py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                        roiSpendInput === val
                          ? 'bg-blue-500 text-white shadow-sm'
                          : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      R$ {val >= 1000 ? `${val / 1000}k` : val}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleCalculateRoi(roiSpendInput)}
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Calcular Economia com AdShield</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Messages Feed */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3.5 text-xs bg-slate-50/70">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[90%] whitespace-pre-wrap leading-relaxed shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none font-medium'
                      : msg.isRoiResult
                        ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-bl-none font-sans shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none font-sans'
                  }`}
                >
                  {msg.text}

                  {/* CTA button if ROI result */}
                  {msg.isRoiResult && msg.roiData && (
                    <div className="mt-3 pt-2.5 border-t border-emerald-200 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-700 font-bold">Payback: &lt; 5 dias</span>
                      <button
                        onClick={() => handleOpenWhatsAppWithLucas(`Olá Lucas! Fiz a simulação de ROI no AdShield: invisto R$ ${msg.roiData?.spend.toLocaleString('pt-BR')} e vi que posso salvar ~R$ ${msg.roiData?.savedMonthly.toLocaleString('pt-BR')}/mês. Gostaria de ativar a proteção!`)}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FontAwesomeIcon icon={faWhatsapp} className="w-3 h-3 text-white" />
                        <span>Ativar no WhatsApp</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Reply Chips */}
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 pt-1 max-w-[95%]">
                    {msg.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(reply)}
                        className="px-3 py-1.5 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer shadow-2xs text-left"
                      >
                        <span>{reply}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs p-3 bg-white rounded-2xl w-24 border border-slate-200 shadow-2xs">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Lead Capture Footer Bar */}
          {!leadCaptured && (
            <form onSubmit={handleCaptureLeadPhone} className="p-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-200 flex items-center gap-2">
              <input
                type="tel"
                placeholder="Seu WhatsApp (ex: 34 99135-1122)..."
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!leadPhone.trim()}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Receber Dossiê</span>
              </button>
            </form>
          )}

          {/* Input Footer Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Digite sua dúvida sobre catálogo ou anúncios..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 placeholder-slate-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 text-white rounded-xl transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
