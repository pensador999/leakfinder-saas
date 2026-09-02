import React, { useEffect, useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Loader2, 
  Search, 
  Target, 
  DollarSign, 
  Brain, 
  BarChart3, 
  Globe, 
  ShieldCheck, 
  Crown, 
  Eye, 
  Gauge, 
  Zap, 
  MessageSquare 
} from 'lucide-react';

interface AnalysisLoadingStateProps {
  siteUrl: string;
  onComplete: () => void;
}

interface Step {
  id: number;
  agent: string;
  role: string;
  icon: any;
  message: string;
  detail: string;
}

export const AnalysisLoadingState: React.FC<AnalysisLoadingStateProps> = ({ siteUrl, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    {
      id: 1,
      agent: '04. Reconhecedor Universal de Nicho',
      role: 'Taxonomia & Isenções de Grade',
      icon: Globe,
      message: `Identificando nicho e regras de grade em ${siteUrl}...`,
      detail: 'Classificando setor e blindando itens de tamanho único'
    },
    {
      id: 2,
      agent: '05. Doutor de Catálogo & Ruptura PP-G2',
      role: 'Auditoria de Estoque em Anúncios',
      icon: Search,
      message: 'Escaneando /products.json e caçando rupturas no DOM...',
      detail: 'Mapeando variantes esgotadas em campanhas de tráfego ativo'
    },
    {
      id: 3,
      agent: '03. Caçador de Mercado & Radar SKU',
      role: 'Benchmarking de Preços ao Vivo',
      icon: Target,
      message: 'Cruzando ofertas SKU-a-SKU contra concorrentes diretos...',
      detail: 'Calculando risco de fuga de checkout e frete competitivo'
    },
    {
      id: 4,
      agent: '08. Visão Computacional & 07. Core Web Vitals',
      role: 'Ergonomia Mobile & Anti-CLS',
      icon: Eye,
      message: 'Testando fixação ocular 2.500ms e prevenindo layout shift...',
      detail: 'Avaliando Thumb Zone no mobile e garantindo CLS 0.000'
    },
    {
      id: 5,
      agent: '02. Orquestrador CEO (Maestro Socrático)',
      role: 'Mesa Redonda & Fogo Cruzado',
      icon: Crown,
      message: 'Confrontando teses dos especialistas em 4 fases de debate...',
      detail: 'Exigindo provas de DOM, cálculo de margem Pix e viabilidade técnica'
    },
    {
      id: 6,
      agent: '11. Sentinel & 10. WhatsApp Concierge',
      role: 'Chancela 2/2 & Dossiê Executivo',
      icon: ShieldCheck,
      message: 'Chancelando Zero Falso-Positivo e sintetizando Dossiê...',
      detail: 'Compilando patches de autocorreção e preparando o plano de ação'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return prev;
        }
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [onComplete, steps.length]);

  const progressPercentage = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="py-12 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-8 shadow-md text-center">
        
        {/* Animated Central Icon */}
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/25">
            <Layers className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-1">
          Inspecionando <span className="text-blue-600 font-mono">{siteUrl}</span>
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Nossa inteligência LeakFinder está fazendo o scraping e a auditoria em tempo real...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2.5 mb-8 p-0.5 border border-slate-200 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="space-y-3 text-left">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all duration-300 flex items-center gap-3.5 ${
                  isCurrent
                    ? 'bg-blue-50/80 border-blue-300 shadow-xs'
                    : isDone
                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                    : 'bg-white border-slate-100 text-slate-400 opacity-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  isCurrent ? 'bg-blue-600 text-white' : isDone ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isCurrent ? 'text-slate-900' : isDone ? 'text-slate-700' : 'text-slate-400'}`}>
                      {step.agent}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {step.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">
                    {step.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
