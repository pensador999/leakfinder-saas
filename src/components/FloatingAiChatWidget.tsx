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
  Phone,
  Headphones,
  RotateCcw
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { askConciergeMasterBrain } from '../services/agents/conciergeNeuralMasterBrain';

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
      text: '👋 Olá! Sou o Concierge de IA do AdShield.\n\nEstou online 24h para responder qualquer dúvida técnica, de catálogo, instalação em temas ou valores dos planos.\n\nComo posso te ajudar hoje?',
      timestamp: 'Agora',
      quickReplies: [
        'Como funciona a auditoria?',
        'Qual o plano ideal para minha loja?',
        'Funciona no meu tema Shopify/Nuvemshop?'
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

  const handleSendMessage = async (textToSend?: string) => {
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
        text: 'Estou pronto para ajudar! Você pode auditar sua loja no topo do site ou deixar seu WhatsApp para falarmos diretamente.',
        timestamp: 'Agora',
        quickReplies: ['Qual o plano ideal para mim?', 'Falar com especialista']
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCaptureLeadPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadPhone.trim()) return;

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

    setLeadCaptured(true);
    setMessages(prev => [
      ...prev,
      {
        id: `b-captured-${Date.now()}`,
        sender: 'bot',
        text: `🎉 Perfeito! Seu WhatsApp (${leadPhone}) foi registrado. Nosso especialista de CRO entrará em contato para te enviar o relatório detalhado da sua loja!`,
        timestamp: 'Agora',
        quickReplies: ['Como funciona a auditoria?', 'Qual o plano ideal?']
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
            Tire Dúvidas com a IA Online 24h 🤖
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-3xl w-[360px] sm:w-[410px] h-[540px] shadow-2xl overflow-hidden flex flex-col animate-slideUp">
          
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
                <p className="text-[10px] text-emerald-400 font-mono">IA Generativa Online 24h • Qualquer Dúvida</p>
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
                  className={`p-3.5 rounded-2xl max-w-[88%] whitespace-pre-wrap leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none font-sans'
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
            <form onSubmit={handleCaptureLeadPhone} className="p-2.5 bg-emerald-50 border-t border-emerald-200 flex gap-1.5">
              <input
                type="tel"
                placeholder="DDD + WhatsApp para falar com especialista..."
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-slate-800"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0 shadow-xs"
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
              placeholder="Pergunte qualquer coisa sobre sua loja..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
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
