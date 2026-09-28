import React, { useState, useEffect } from 'react';
import { Globe, Search, CheckCircle } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isComplete = localStorage.getItem('adshield_onboarding_complete');
    if (!isComplete) {
      setIsVisible(true);
    } else {
      onComplete();
    }
  }, [onComplete]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      localStorage.setItem('adshield_onboarding_complete', 'true');
      setIsVisible(false);
      onComplete();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-zinc-800 text-center flex flex-col items-center">
        
        {step === 1 && (
          <>
            <div className="bg-zinc-800 p-4 rounded-full mb-6">
              <Globe className="w-12 h-12 text-[#0AE448]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Vamos começar!</h2>
            <p className="text-zinc-400 mb-8 text-lg">
              Cole a URL da sua loja para uma análise automática gratuita.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className="bg-zinc-800 p-4 rounded-full mb-6">
              <Search className="w-12 h-12 text-[#0AE448]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Aguarde a análise automática</h2>
            <p className="text-zinc-400 mb-8 text-lg">
              Nossos 18 agentes de IA vão vasculhar sua loja em busca de rupturas de grade, problemas de catálogo e oportunidades escondidas.
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <div className="bg-zinc-800 p-4 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-[#0AE448]" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Veja seu plano de ação</h2>
            <p className="text-zinc-400 mb-8 text-lg">
              Receba um diagnóstico completo com plano de ação priorizado para aumentar sua conversão e reduzir desperdício em tráfego pago.
            </p>
          </>
        )}

        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full ${step === i ? 'bg-[#0AE448]' : 'bg-zinc-700'}`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-[#0AE448] hover:bg-[#09c940] text-black font-bold py-3 px-6 rounded-lg transition-colors"
        >
          {step === 3 ? 'Começar Auditoria' : 'Próximo'}
        </button>
      </div>
    </div>
  );
};
