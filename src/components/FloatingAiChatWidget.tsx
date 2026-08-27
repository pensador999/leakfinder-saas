import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  CheckCircle2, 
  ChevronRight, 
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Flame,
  Phone
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}

export const FloatingAiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [hasNewBadge, setHasNewBadge] = useState<boolean>(true);
  const [leadPhone, setLeadPhone] = useState<string>('');
  const [leadCaptured, setLeadCaptured] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: '👋 Olá! Sou o Concierge de IA do AdShield. Estou analisando o tráfego e catálogo da sua loja.\n\nComo posso te ajudar a recuperar vendas hoje?',
      timestamp: 'Agora',
      quickReplies: [
        'Como funciona a auditoria?',
        'Qual o plano ideal para mim?',
        'Preciso de programador para instalar?'
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
  }, [messages, isOpen]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Agora'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI Response Logic based on VoC trained knowledge
    setTimeout(() => {
      let botResponse = '';
      let replies: string[] | undefined = undefined;

      const lower = text.toLowerCase();

      if (lower.includes('como funciona') || lower.includes('auditoria')) {
        botResponse = 'O AdShield inspeciona a camada pública da sua loja em tempo real. Identificamos produtos anunciados com grade esgotada (PP-G2), botões fora da área de toque mobile e checkout lento, calculando a receita exata que você está perdendo.';
        replies = ['Quanto custam os planos?', 'Como instalar os scripts?'];
      } else if (lower.includes('plano') || lower.includes('preço') || lower.includes('quanto custa')) {
        botResponse = 'Nossos planos foram modelados para gerar ROI imediato:\n\n• Starter (R$ 197/mês): 1 loja monitorada 24/7\n• Pro (R$ 497/mês): 3 lojas + espião de concorrentes\n• Enterprise (R$ 1.290/mês): 10 lojas com White-label para agências.\n\nRecuperar apenas 3 vendas no mês já paga o plano Pro inteiro!';
        replies = ['Falar com especialista no WhatsApp', 'Testar auditoria grátis'];
      } else if (lower.includes('programador') || lower.includes('instalar') || lower.includes('código')) {
        botResponse = 'Não precisa de programador! O AdShield gera blocos de código App Embed prontos para Shopify, Nuvemshop e WooCommerce. Você cola em 1 clique ou nossa equipe faz a instalação guiada gratuita com você.';
        replies = ['Quero agendar instalação guiada'];
      } else if (lower.includes('whatsapp') || lower.includes('falar') || lower.includes('agendar')) {
        botResponse = 'Excelente! Digite seu WhatsApp abaixo para receber o relatório completo da sua loja diretamente no seu celular em menos de 5 minutos:';
      } else {
        botResponse = `Entendido! Nosso Enxame de IA está pronto para blindar sua operação. Você pode auditar sua loja agora pelo topo da página ou deixar seu WhatsApp para receber o diagnóstico executivo gratuito.`;
        replies = ['Qual o plano ideal para mim?', 'Falar com especialista'];
      }

      const newBotMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: 'Agora',
        quickReplies: replies
      };

      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleCaptureLeadPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadPhone.trim()) return;

    if (isSupabaseConfigured) {
      try {
        await supabase.from('alert_dispatch_queue').insert([
          {
            phone_number: leadPhone.trim(),
            message_body: 'Lead capturado via Chatbot Concierge Flutuante',
            alert_type: 'CONCIERGE_LEAD',
            priority: 'HIGH',
            status: 'PENDING'
          }
        ]);
      } catch {
        // fallback
      }
    }

    setLeadCaptured(true);
    setMessages(prev => [
      ...prev,
      {
        id: `b-captured-${Date.now()}`,
        sender: 'bot',
        text: `🎉 Perfeito! Seu número (${leadPhone}) foi registrado no nosso radar. Em instantes nosso especialista enviará seu relatório executivo detalhado no WhatsApp!`,
        timestamp: 'Agora'
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Button Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 bg-gradient-to-br from-indigo-600 to-blue-700 hover:from-indigo-500 hover:to-blue-600 text-white rounded-full shadow-2xl shadow-blue-600/50 flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer border border-white/20"
        >
          <MessageSquare className="w-6 h-6" />
          
          {hasNewBadge && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          )}

          <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
            Tire Dúvidas com o Concierge IA 🤖
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-3xl w-[360px] sm:w-[400px] h-[520px] shadow-2xl overflow-hidden flex flex-col animate-slideUp">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="p-2 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight flex items-center gap-1.5">
                  AdShield Concierge
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </h3>
                <p className="text-[10px] text-emerald-400 font-mono">IA Online 24h • Atendimento Imediato</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="p-4 overflow-y-auto flex-1 space-y-3 text-xs bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1.5`}
              >
                <div
                  className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Quick Reply Chips */}
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(reply)}
                        className="px-2.5 py-1 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                      >
                        <span>{reply}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs italic p-2 bg-white rounded-2xl w-24 border border-slate-200">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* WhatsApp Lead Capture Bar inside widget */}
          {!leadCaptured && (
            <form onSubmit={handleCaptureLeadPhone} className="p-2 bg-emerald-50 border-t border-emerald-200 flex gap-1.5">
              <input
                type="tel"
                placeholder="DDD + WhatsApp para relatório..."
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
              >
                <Phone className="w-3 h-3" />
                <span>Receber</span>
              </button>
            </form>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Digite sua dúvida de catálogo/CRO..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
