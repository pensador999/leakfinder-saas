import React from 'react';
import { X, Check, Rocket, Zap, ShieldCheck } from 'lucide-react';
import { getWhiteLabelConfig } from '../services/whiteLabelService';

interface PricingModalProps {
  onClose: () => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ onClose }) => {
  const whiteLabel = getWhiteLabelConfig();

  const plans = [
    {
      name: 'Starter',
      price: '197',
      period: 'mês',
      description: 'Ideal para consultores independentes e lojistas únicos.',
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      features: [
        'Até 10 Auditorias por mês',
        'Acesso a 3 Agentes de IA (CRO, SEO, Copy)',
        'Exportação em PDF Simples',
        'Suporte via E-mail'
      ],
      cta: 'Começar com Starter',
      popular: false,
      checkoutUrl: whiteLabel.checkoutUrlStarter
    },
    {
      name: 'Pro Growth',
      price: '497',
      period: 'mês',
      description: 'Para E-commerces em escala e pequenas agências.',
      icon: <Rocket className="w-6 h-6 text-blue-500" />,
      features: [
        'Auditorias Ilimitadas',
        'Todos os 6 Agentes (Inclui Espião Competitivo)',
        'Exportação Avançada (Trello & CSV)',
        'Dashboard Analítico Completo'
      ],
      cta: 'Assinar Plano Pro',
      popular: true,
      checkoutUrl: whiteLabel.checkoutUrlPro
    },
    {
      name: 'Agency White-Label',
      price: '997',
      period: 'mês',
      description: 'A solução definitiva para Agências de Performance escalarem vendas.',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      features: [
        'Tudo do Plano Pro',
        'White-label Total (Sua Logo e Cores)',
        'Lead Gating (Captura de Leads Integrada)',
        'Integração via Webhook / CRM',
        'Acesso ao Painel Interno de Leads (CRM)'
      ],
      cta: 'Tornar-se Parceiro Agency',
      popular: false,
      checkoutUrl: whiteLabel.checkoutUrlAgency
    }
  ];

  const handleCheckout = (url: string) => {
    if (!url) {
      alert('Link de checkout não configurado no painel White-label.');
      return;
    }
    // Redirects user to the checkout in a new tab
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl overflow-hidden shadow-2xl relative animate-scale-in">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 lg:p-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Acelere sua Inteligência de Vendas
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
            Escolha o plano ideal para escalar os resultados do seu negócio. Comece a auditar, captar leads e vender mais hoje mesmo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative rounded-3xl border-2 p-8 flex flex-col ${plan.popular ? 'border-blue-500 shadow-xl shadow-blue-500/10' : 'border-slate-200 hover:border-slate-300'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-full">
                    Mais Popular
                  </div>
                )}
                
                <div className="mb-6 flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${plan.popular ? 'bg-blue-50' : 'bg-slate-50'}`}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-slate-900">R$ {plan.price}</span>
                    <span className="text-slate-500 font-medium mb-1">/{plan.period}</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
                </div>
                
                <div className="flex-1 space-y-4 mb-8">
                  <div className="text-sm font-bold text-slate-900">O que está incluso:</div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className={`w-5 h-5 shrink-0 ${plan.popular ? 'text-blue-500' : 'text-emerald-500'}`} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={() => handleCheckout(plan.checkoutUrl)}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                  style={plan.popular ? { backgroundColor: whiteLabel.primaryColor, boxShadow: `0 4px 14px 0 ${whiteLabel.primaryColor}33` } : {}}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
};
