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
      icon: <Zap className="w-6 h-6 text-amber-400" />,
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
      icon: <Rocket className="w-6 h-6 text-[#0AE448]" />,
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
      icon: <ShieldCheck className="w-6 h-6 text-[#00BAE2]" />,
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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-[#101211] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative animate-scale-in text-[#FFFCE1]">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] rounded-full transition-colors z-10 border border-white/10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 lg:p-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0AE448]/10 border border-[#0AE448]/30 text-[#0AE448] text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <Zap className="w-3.5 h-3.5" />
            Planos AdShield OS
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-[#FFFCE1] tracking-tight mb-4">
            Acelere sua Inteligência de Vendas
          </h2>
          <p className="text-base text-[#BBBAA6] max-w-2xl mx-auto mb-12">
            Escolha o plano ideal para blindar sua operação, captar clientes com auditorias técnicas irrefutáveis e eliminar sangria de tráfego.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative rounded-3xl border p-8 flex flex-col transition-all ${
                  plan.popular 
                    ? 'bg-[#141716] border-[#0AE448] shadow-2xl shadow-[#0AE448]/10 ring-1 ring-[#0AE448]/50' 
                    : 'bg-[#141716] border-white/10 hover:border-white/20'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0AE448] text-slate-950 text-xs font-black uppercase tracking-wider rounded-full shadow-md shadow-[#0AE448]/30">
                    Mais Popular
                  </div>
                )}
                
                <div className="mb-6 flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#FFFCE1]">{plan.name}</h3>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-[#FFFCE1]">R$ {plan.price}</span>
                    <span className="text-[#BBBAA6] font-medium mb-1">/{plan.period}</span>
                  </div>
                  <p className="text-xs text-[#BBBAA6] mt-2 leading-relaxed">{plan.description}</p>
                </div>
                
                <div className="flex-1 space-y-4 mb-8">
                  <div className="text-xs font-mono uppercase tracking-wider font-bold text-[#BBBAA6]">O que está incluso:</div>
                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2.5 text-xs text-[#BBBAA6]">
                        <Check className="w-4 h-4 shrink-0 text-[#0AE448] mt-0.5" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button 
                  onClick={() => handleCheckout(plan.checkoutUrl)}
                  className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    plan.popular 
                    ? 'bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 shadow-lg shadow-[#0AE448]/20' 
                    : 'bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10'
                  }`}
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
