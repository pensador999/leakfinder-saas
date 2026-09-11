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
      <div className="py-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
        <p className="text-sm font-bold text-slate-700">Analista de Clientes & Preços processando interações e objeções...</p>
        <p className="text-xs text-slate-400">Modelando elasticidade de planos e calibrando a base de conhecimento do chatbot.</p>
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
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-emerald-900 to-slate-950 rounded-2xl text-emerald-400 shadow-md shadow-emerald-950/30 border border-emerald-800">
            <BarChart3 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Agente 14 — Customer Success VoC & NPS Agent</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                {dossier.totalClientInteractionsSampled} Interações Mapeadas
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Mineração de feedbacks do consumidor (Voice of Customer), mapeamento contínuo de objeções de lojistas e calibragem da base de conhecimento de vendas.
            </p>
          </div>
        </div>

        <button
          onClick={loadDossier}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Atualizar Análise VoC</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Objeções Treinadas</span>
            <span className="text-xl font-black text-slate-900 font-mono">{dossier.topObjections.length} Respostas Prontas</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Plano Mais Lucrativo</span>
            <span className="text-xl font-black text-blue-600 font-mono">Pro (R$ 497/mês)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">LTV Médio Projetado</span>
            <span className="text-xl font-black text-indigo-600 font-mono">R$ 5.964 / cliente</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('objections')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'objections'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Base de Objeções do Chatbot ({dossier.topObjections.length})
        </button>
        <button
          onClick={() => setActiveSubTab('pricing')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'pricing'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Modelagem de Planos & Elasticidade SaaS
        </button>
        <button
          onClick={() => setActiveSubTab('roi_calc')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'roi_calc'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Calculadora de ROI do Lojista
        </button>
      </div>

      {/* SUB-TAB 1: BASE DE OBJEÇÕES DO CHATBOT */}
      {activeSubTab === 'objections' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Respostas treinadas pela IA para serem usadas pelo Chatbot Concierge e time comercial para contornar dúvidas e objeções com precisão técnica.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {dossier.topObjections.map((item) => (
              <div key={item.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-emerald-300 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                      <HelpCircle className="w-4 h-4" />
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">"{item.objection}"</h3>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-md bg-slate-100 text-slate-600">
                    Frequência: {item.frequencyPct}% dos lojistas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase font-mono">Gatilho Psicológico por trás da dúvida:</span>
                    <p className="font-bold text-slate-800 mt-0.5">{item.psychologicalTrigger}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                    <span className="text-[10px] font-bold text-emerald-700 block uppercase font-mono">Impacto na Conversão:</span>
                    <p className="font-bold text-emerald-900 mt-0.5">{item.conversionImpact}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed border border-slate-800 shadow-inner">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1 uppercase">Resposta Treinada para o Chatbot IA / Comercial:</span>
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
              className={`p-6 rounded-3xl bg-white border transition-all flex flex-col justify-between space-y-6 ${
                plan.id === 'pro'
                  ? 'border-emerald-500 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                    plan.id === 'pro' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {plan.name}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-bold">
                    {plan.includedStoresQuota} Loja{plan.includedStoresQuota > 1 ? 's' : ''}
                  </span>
                </div>

                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900 font-mono">R$ {plan.monthlyPrice}</span>
                    <span className="text-xs text-slate-500 font-bold">/mês</span>
                  </div>
                  <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
                    ou R$ {plan.annualPriceDiscount}/mês no plano anual
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase">Perfil Ideal do Lojista:</span>
                  <p className="font-bold text-slate-800">{plan.targetMerchantMonthlyRevenue}</p>
                  <p className="text-[11px] text-slate-500">{plan.idealForNiche}</p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block font-mono uppercase">O que está incluído:</span>
                  <ul className="space-y-1.5 text-xs text-slate-600">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs font-mono text-emerald-950 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500 text-[10px]">LTV Projetado:</span>
                  <strong>R$ {plan.projectedLtv}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 text-[10px]">Elasticidade Recomendada:</span>
                  <strong>{plan.recommendedPriceElasticityRange}</strong>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: CALCULADORA DE ROI DO LOJISTA */}
      {activeSubTab === 'roi_calc' && (
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-xs">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Simulador de ROI de Recuperação de Receita</h3>
              <p className="text-xs text-slate-500">Mostre ao lojista em quantos dias o plano AdShield Pro se paga na operação dele.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Faturamento Mensal da Loja: <strong className="text-emerald-700 font-mono">R$ {calcMonthlyRev.toLocaleString('pt-BR')}</strong>
                </label>
                <input
                  type="range"
                  min={15000}
                  max={500000}
                  step={5000}
                  value={calcMonthlyRev}
                  onChange={(e) => setCalcMonthlyRev(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ticket Médio da Loja: <strong className="text-emerald-700 font-mono">R$ {calcTicketMedio}</strong>
                </label>
                <input
                  type="range"
                  min={50}
                  max={800}
                  step={10}
                  value={calcTicketMedio}
                  onChange={(e) => setCalcTicketMedio(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold block">Resultado da Simulação Matemática:</span>
              
              <div className="space-y-2">
                <div className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Receita Recuperável Estimada:</span>
                  <span className="text-xl font-mono font-black text-emerald-400">R$ {estimatedRecoveredRevenue.toLocaleString('pt-BR')}/mês</span>
                </div>

                <div className="flex justify-between items-baseline border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">Investimento no Plano Pro:</span>
                  <span className="text-sm font-mono font-bold text-slate-300">R$ 497/mês</span>
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-xs text-slate-300 font-bold">Retorno Estimado (ROI):</span>
                  <span className="text-2xl font-mono font-black text-emerald-400">{calculatedMonthlyRoi}x ao mês</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-xl text-[11px] text-slate-300 leading-relaxed">
                👉 <strong>Conclusão Comercial:</strong> O lojista precisa recuperar apenas ~3 vendas perdidas no mês inteiro para o AdShield se pagar 100%.
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
