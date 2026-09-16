import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  Zap, 
  CreditCard, 
  Lock, 
  Sparkles, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { 
  ADSHIELD_STRIPE_PLANS, 
  SubscriptionPlanId, 
  createStripeCheckoutSession 
} from '../../services/billing/stripeCheckoutService';

interface StripeSubscriptionModalProps {
  onClose: () => void;
  currentDomain?: string;
  initialPlan?: SubscriptionPlanId;
}

export const StripeSubscriptionModal: React.FC<StripeSubscriptionModalProps> = ({
  onClose,
  currentDomain = 'minhaloja.com.br',
  initialPlan = 'PRO_MONTHLY'
}) => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>(initialPlan);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');

  const plans = Object.values(ADSHIELD_STRIPE_PLANS);

  const handleProceedToCheckout = () => {
    setLoading(true);
    const session = createStripeCheckoutSession({
      planId: selectedPlan,
      customerEmail: emailInput,
      storeDomain: currentDomain
    });

    setTimeout(() => {
      window.open(session.checkoutUrl, '_blank');
      setLoading(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[90] flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative flex flex-col text-slate-100 animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Ativar Proteção Sentinela 24/7</h3>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-mono font-bold">
                  Checkout Seguro Stripe
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Monitore sua loja dia e noite. Receba alertas de ruptura e economize milhares de reais em tráfego pago.
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

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Active Store Indicator */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Loja vinculada para proteção:</span>
            <span className="font-mono font-bold text-sky-400">{currentDomain}</span>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((p) => {
              const isSelected = selectedPlan === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                    isSelected 
                      ? 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-500/20 scale-[1.02]' 
                      : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {p.recommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white rounded-full text-[9px] font-bold font-mono tracking-wider uppercase">
                      Mais Popular
                    </span>
                  )}

                  <div>
                    <div className="font-bold text-sm text-white">{p.name}</div>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white font-mono">R$ {p.priceBrl}</span>
                      <span className="text-xs text-slate-400">/mês</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                      {p.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-bold">
                    <span className={isSelected ? 'text-indigo-400' : 'text-slate-500'}>
                      {isSelected ? 'Selecionado' : 'Escolher plano'}
                    </span>
                    <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Email input for prefilling Stripe Checkout */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Seu e-mail profissional (para receber nota fiscal e acesso):
            </label>
            <input 
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="voce@sualoja.com.br"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none font-mono"
            />
          </div>

          {/* Guarantee & Action Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleProceedToCheckout}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {loading ? 'Carregando Stripe Checkout...' : `Prosseguir para Checkout Seguro (R$ ${ADSHIELD_STRIPE_PLANS[selectedPlan].priceBrl}/mês)`}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-500" /> Criptografia 256-bit Stripe
              </span>
              <span>•</span>
              <span>Garantia de 7 Dias (Cancele a Qualquer Momento)</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
