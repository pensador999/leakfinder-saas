import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Cpu, ShoppingCart, Search, Target, FileText, Layers } from 'lucide-react';
import { AgentDiagnosticResult, ChatMessage } from '../../types';

interface AgentChatViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({ diagnostic }) => {
  const { input, realSiteData } = diagnostic;

  const [selectedAgent, setSelectedAgent] = useState<'Orquestrador' | 'CRO' | 'SEO' | 'Ads' | 'Copywriter' | 'PM'>('Orquestrador');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'agent',
      agentPersona: 'Orquestrador',
      text: `Olá! Sou o Orquestrador LeakFinder. Analisei o HTML e os metadados do site **${realSiteData.domain}** (${input.niche}) e estou pronto com nossa equipe de 6 especialistas para responder suas dúvidas. O que gostaria de otimizar agora?`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    'Como eliminar o abandono de carrinho nesta semana?',
    'Qual a melhor estrutura de campanha no Meta Ads para meu nicho?',
    'Escreva uma oferta de Bundle (Compre 2 Leve 3) para meus produtos',
    'Como otimizar o HTML lido para acelerar o SEO no Google?'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let agentResponseText = '';

      if (selectedAgent === 'CRO') {
        agentResponseText = `Para **${realSiteData.domain}**, a ação de conversão imediata é ativar o **Checkout Transparente LeakFinder com Pix 5% OFF** e colocar o **Sticky Buy Button** no rodapé mobile. Isso reduz a taxa de abandono no smartphone em até 38%.`;
      } else if (selectedAgent === 'Ads') {
        agentResponseText = `Com o Ticket Médio de R$ ${input.averageOrderValue}, recomendo alocar **60% da verba em Meta Ads (Tráfego Frio)** com vídeos estilo UGC e **30% em Retargeting Dinâmico**. Seu ROAS alvo ideal é **${diagnostic.ads.targetRoas}x**.`;
      } else if (selectedAgent === 'Copywriter') {
        agentResponseText = `Para quebrar objeções em **${input.niche}**, adicione este selo acima do botão de compra: *"Garantia Incondicional LeakFinder de 30 Dias: Teste em casa. Devolução 100% grátis sem perguntas."*`;
      } else if (selectedAgent === 'SEO') {
        agentResponseText = `O HTML de **${realSiteData.domain}** possui **${realSiteData.imagesWithoutAlt} imagens sem Alt tag**. Preencha o Alt text dessas imagens e adicione o código Schema JSON-LD de Produto para exibir estrelas no Google.`;
      } else if (selectedAgent === 'PM') {
        agentResponseText = `No seu funil AAARRR, a prioridade máxima (ICE Score 9.0) é configurar a **automação de WhatsApp para carrinho abandonado disparada aos 15 minutos**.`;
      } else {
        agentResponseText = `Com base no HTML e metadados lidos de **${realSiteData.domain}**, o maior alavancador de receita agora é corrigir a **taxa de conversão do checkout** e implementar **Order Bumps no carrinho**. Isso pode elevar seu faturamento de **+34% a +88%**.`;
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        agentPersona: selectedAgent,
        text: agentResponseText,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="space-y-4">
      
      {/* Agent Selector Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'Orquestrador', label: 'Orquestrador LeakFinder', icon: Cpu },
          { id: 'CRO', label: 'Agente CRO & Usabilidade', icon: ShoppingCart },
          { id: 'SEO', label: 'Agente SEO & Busca', icon: Search },
          { id: 'Ads', label: 'Agente de Ads', icon: Target },
          { id: 'Copywriter', label: 'Agente Copywriter', icon: FileText },
          { id: 'PM', label: 'Agente Product Manager', icon: Layers }
        ].map((agent) => {
          const IconComp = agent.icon;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgent(agent.id as any)}
              className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                selectedAgent === agent.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <IconComp className="w-3.5 h-3.5 shrink-0" />
              <span>{agent.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col h-[520px] shadow-sm">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'agent' && (
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-xs font-medium'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none font-medium'
              }`}>
                {msg.agentPersona && (
                  <div className="flex items-center justify-between gap-2 mb-1.5 text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                    <span>Agente {msg.agentPersona}</span>
                    <span className="text-slate-400 font-mono">{msg.timestamp}</span>
                  </div>
                )}
                <div>
                  {msg.text}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 p-3 rounded-xl border border-blue-200 w-fit font-medium">
              <Sparkles className="w-4 h-4 animate-spin text-blue-600" />
              <span>Agente {selectedAgent} está analisando os dados...</span>
            </div>
          )}
        </div>

        {/* Autopilot & Quick Suggestion Chips */}
        <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
          <button
            onClick={() => {
              setSelectedAgent('Orquestrador');
              handleSendMessage('[AUTOPILOT] Aja como CEO. Cruze os diagnósticos de todos os 6 agentes. Gere um Relatório Executivo de Alto Nível focando nos 3 maiores vazamentos de receita deste negócio e forneça um plano de ação tático. Retorne o resultado formatado de forma limpa e muito profissional.');
            }}
            disabled={isTyping}
            className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            Autopilot: Gerar Relatório de Diretoria
          </button>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0">Perguntas Rápidas:</span>
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                disabled={isTyping}
                className="px-2.5 py-1 text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 transition-all shrink-0 cursor-pointer font-medium disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-2 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Pergunte ao Agente ${selectedAgent} sobre ${realSiteData.domain}...`}
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-600 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none transition-all font-medium"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
