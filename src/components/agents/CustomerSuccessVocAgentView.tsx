import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  MessageSquare, 
  DollarSign, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  TrendingUp, 
  Check, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  Calculator
} from 'lucide-react';
import { 
  runCustomerSuccessVocAudit, 
  CustomerSuccessVocDossier, 
  CustomerObjectionItem, 
  PricingPlanTier 
} from '../../services/agents/customerSuccessVocAgent';

export const CustomerSuccessVocAgentView: React.FC = () => {
  const [dossier, setDossier] = useState<CustomerSuccessVocDossier | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeSubTab, setActiveSubTab] = useState<'objections' | 'pricing' | 'roi_calc'>('objections');
  
  // Interactive ROI Calculator State
  const [calcMonthlyRev, setCalcMonthlyRev] = useState<number>(80000);
  const [calcTicketMedio, setCalcTicketMedio] = useState<number>(190);

  const loadDossier = async () => {
    setIsLoading(true);
    try {
      const data = await runCustomerSuccessVocAudit();
      setDossier(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDossier();
  }, []);

  if (isLoading || !dossier) {
    return (
      <div className="py-16 text-center space-y-3 bg-[#101211] border border-white/10 rounded-3xl">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0AE448]" />
        <p className="text-sm font-bold text-[#FFFCE1]">Analista de Clientes & Preços processando interações e objeções...</p>
        <p className="text-xs text-[#BBBAA6]">Modelando elasticidade de planos e calibrando a base de conhecimento do chatbot.</p>
      </div>
    );
  }

  // ROI Math
  const estimatedLostOrdersPerMonth = Math.round((calcMonthlyRev / calcTicketMedio) * 0.08); // 8% perda em grade furada
  const estimatedRecoveredRevenue = estimatedLostOrdersPerMonth * calcTicketMedio;
  const proPlanMonthlyCost = 497;
  const calculatedMonthlyRoi = Math.max(1, Math.round(estimatedRecoveredRevenue / proPlanMonthlyCost));

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-mono rounded-lg border border-amber-500/20 mb-4">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>[Dados de Demonstração — Sem Scraping de Reviews]</span>
      </div>
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-[#FFFCE1]">Agente 14 — Customer Success VoC & NPS Agent</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30">
                {dossier.totalClientInteractionsSampled} Objeções Estratégicas [Playbook B2B]
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              Mineração de feedbacks do consumidor (Voice of Customer), mapeamento contínuo de objeções de lojistas e calibragem da base de conhecimento de vendas.
            </p>
          </div>
        </div>

        <button
          onClick={loadDossier}
          className="px-4 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-[#0AE448]/20 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Atualizar Análise VoC</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#0AE448] rounded-xl border border-[#0AE448]/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Objeções Treinadas</span>
            <span className="text-xl font-black text-[#FFFCE1] font-mono">{dossier.topObjections.length} Respostas Prontas</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#00BAE2] rounded-xl border border-[#00BAE2]/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Plano Mais Lucrativo</span>
            <span className="text-xl font-black text-[#00BAE2] font-mono">Pro (R$ 497/mês)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-purple-400 rounded-xl border border-purple-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">LTV Médio Projetado</span>
            <span className="text-xl font-black text-purple-300 font-mono">R$ 5.964 / cliente</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('objections')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold shrink-0 ${
            activeSubTab === 'objections'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
              : 'text-[#BBBAA6] hover:bg-white/5 hover:text-white'
          }`}
        >
          Base de Objeções do Chatbot ({dossier.topObjections.length})
        </button>
        <button
          onClick={() => setActiveSubTab('pricing')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold shrink-0 ${
            activeSubTab === 'pricing'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
              : 'text-[#BBBAA6] hover:bg-white/5 hover:text-white'
          }`}
        >
          Modelagem de Planos & Elasticidade SaaS
        </button>
        <button
          onClick={() => setActiveSubTab('roi_calc')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold shrink-0 ${
            activeSubTab === 'roi_calc'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
              : 'text-[#BBBAA6] hover:bg-white/5 hover:text-white'
          }`}
        >
          Calculadora de ROI do Lojista
        </button>
      </div>

      {/* SUB-TAB 1: BASE DE OBJEÇÕES DO CHATBOT */}
      {activeSubTab === 'objections' && (
        <div className="space-y-4">
          <p className="text-xs text-[#BBBAA6] font-medium">
            Respostas treinadas pela IA para serem usadas pelo Chatbot Concierge e time comercial para contornar dúvidas e objeções com precisão técnica.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {dossier.topObjections.map((item) => (
              <div key={item.id} className="p-5 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-3 hover:border-white/20 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-[#0AE448]/10 text-[#0AE448] rounded-lg border border-[#0AE448]/20">
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    <h3 className="font-bold text-[#FFFCE1] text-sm">"{item.objection}"</h3>
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-[#141716] text-[#BBBAA6] border border-white/10">
                    Frequência: {item.frequencyPct}% dos lojistas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-[#141716] border border-white/10">
                    <span className="text-[10px] font-bold text-[#BBBAA6] block uppercase font-mono">Gatilho Psicológico por trás da dúvida:</span>
                    <p className="font-bold text-[#FFFCE1] mt-0.5">{item.psychologicalTrigger}</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#141716] border border-[#0AE448]/20">
                    <span className="text-[10px] font-bold text-[#0AE448] block uppercase font-mono">Impacto na Conversão:</span>
                    <p className="font-bold text-[#FFFCE1] mt-0.5">{item.conversionImpact}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0E100F] text-[#0AE448] font-mono text-xs leading-relaxed border border-white/10 shadow-inner">
                  <span className="text-[10px] text-[#BBBAA6] font-bold block mb-1 uppercase">Resposta Treinada para o Chatbot IA / Comercial:</span>
                  "{item.aiTrainedResponse}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MODELAGEM DE PREÇOS */}
      {activeSubTab === 'pricing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dossier.pricingPlans.map((plan) => (
            <div 
              key={plan.id} 
              className={`p-6 rounded-3xl bg-[#101211] border transition-all flex flex-col justify-between space-y-6 shadow-2xl ${
                plan.id === 'pro'
                  ? 'border-[#0AE448] shadow-lg shadow-[#0AE448]/10 ring-2 ring-[#0AE448]/20'
                  : 'border-white/10'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                    plan.id === 'pro' ? 'bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30' : 'bg-[#141716] text-[#BBBAA6] border border-white/10'
                  }`}>
                    {plan.name}
                  </span>
                  <span className="text-[11px] font-mono text-[#BBBAA6] font-bold">
                    {plan.includedStoresQuota} Loja{plan.includedStoresQuota > 1 ? 's' : ''}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-[#FFFCE1] font-mono">R$ {plan.monthlyPrice}</span>
                    <span className="text-xs text-[#BBBAA6] font-bold">/mês</span>
                  </div>
                  <p className="text-[11px] text-[#0AE448] font-bold mt-0.5">
                    ou R$ {plan.annualPriceDiscount}/mês no plano anual
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#141716] border border-white/10 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-[#BBBAA6] block font-mono uppercase">Perfil Ideal do Lojista:</span>
                  <p className="font-bold text-[#FFFCE1]">{plan.targetMerchantMonthlyRevenue}</p>
                  <p className="text-[11px] text-[#BBBAA6]">{plan.idealForNiche}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[10px] font-bold text-[#BBBAA6] block font-mono uppercase">O que está incluído:</span>
                  <ul className="space-y-1.5 text-xs text-[#BBBAA6]">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448] shrink-0 mt-0.5" />
                        <span className="text-[#FFFCE1]">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#141716] border border-white/10 text-xs font-mono text-[#FFFCE1] space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#BBBAA6] text-[10px]">LTV Projetado:</span>
                  <strong className="text-[#0AE448]">R$ {plan.projectedLtv}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#BBBAA6] text-[10px]">Elasticidade Recomendada:</span>
                  <strong>{plan.recommendedPriceElasticityRange}</strong>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: CALCULADORA DE ROI DO LOJISTA */}
      {activeSubTab === 'roi_calc' && (
        <div className="p-6 bg-[#101211] border border-white/10 rounded-3xl space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2.5 bg-[#141716] text-[#0AE448] border border-[#0AE448]/20 rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-black text-[#FFFCE1] text-base">Simulador de ROI de Recuperação de Receita</h3>
              <p className="text-xs text-[#BBBAA6]">Mostre ao lojista em quantos dias o plano AdShield Pro se paga na operação dele.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#BBBAA6] mb-1">
                  Faturamento Mensal da Loja: <strong className="text-[#0AE448] font-mono">R$ {calcMonthlyRev.toLocaleString('pt-BR')}</strong>
                </label>
                <input
                  type="range"
                  min={15000}
                  max={500000}
                  step={5000}
                  value={calcMonthlyRev}
                  onChange={(e) => setCalcMonthlyRev(Number(e.target.value))}
                  className="w-full h-2 bg-[#141716] rounded-lg appearance-none cursor-pointer accent-[#0AE448]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#BBBAA6] mb-1">
                  Ticket Médio da Loja: <strong className="text-[#0AE448] font-mono">R$ {calcTicketMedio}</strong>
                </label>
                <input
                  type="range"
                  min={50}
                  max={800}
                  step={10}
                  value={calcTicketMedio}
                  onChange={(e) => setCalcTicketMedio(Number(e.target.value))}
                  className="w-full h-2 bg-[#141716] rounded-lg appearance-none cursor-pointer accent-[#0AE448]"
                />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-[#141716] text-[#FFFCE1] space-y-4 border border-white/10 shadow-xl">
              <span className="text-[10px] font-mono text-[#0AE448] uppercase font-bold block">Resultado da Simulação Matemática:</span>
              
              <div className="space-y-2">
                <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                  <span className="text-xs text-[#BBBAA6]">Receita Recuperável Estimada:</span>
                  <span className="text-xl font-mono font-black text-[#0AE448]">R$ {estimatedRecoveredRevenue.toLocaleString('pt-BR')}/mês</span>
                </div>

                <div className="flex justify-between items-baseline border-b border-white/10 pb-2">
                  <span className="text-xs text-[#BBBAA6]">Investimento no Plano Pro:</span>
                  <span className="text-sm font-mono font-bold text-[#FFFCE1]">R$ 497/mês</span>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-xs text-[#FFFCE1] font-bold">Retorno Estimado (ROI):</span>
                  <span className="text-2xl font-mono font-black text-[#0AE448]">{calculatedMonthlyRoi}x ao mês</span>
                </div>
              </div>

              <div className="p-3 bg-[#0E100F] rounded-xl text-[11px] text-[#BBBAA6] leading-relaxed border border-white/5">
                👉 <strong className="text-white">Conclusão Comercial:</strong> O lojista precisa recuperar apenas ~3 vendas perdidas no mês inteiro para o AdShield se pagar 100%.
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
