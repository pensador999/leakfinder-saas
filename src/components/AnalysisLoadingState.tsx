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
      <div className="w-full max-w-xl bg-[#101211] border border-white/10 rounded-3xl p-8 shadow-2xl text-center space-y-6">
        
        {/* Animated Central Icon with GSAP Neon Pulse */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-16 h-16 bg-[#141716] border border-[#0AE448]/40 rounded-2xl flex items-center justify-center shadow-lg shadow-[#0AE448]/20">
            <Layers className="w-8 h-8 text-[#0AE448] animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#0AE448] rounded-full border-2 border-[#101211] animate-ping" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#0AE448] rounded-full border-2 border-[#101211]" />
        </div>

        <div>
          <h3 className="text-xl font-black text-white tracking-tight mb-1">
            Inspecionando <span className="text-[#0AE448] font-mono">{siteUrl}</span>
          </h3>
          <p className="text-xs text-[#7C7C6F]">
            Enxame de 18 agentes auditando DOM ao vivo, catálogo, conformidade legal e anúncios em tempo real...
          </p>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-full bg-[#191C1B] rounded-full h-2 p-0.5 border border-white/10 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#0AE448] to-[#00BAE2] h-full rounded-full transition-all duration-500 ease-out shadow-sm shadow-[#0AE448]/50"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Steps List in Dark Obsidian */}
        <div className="space-y-2.5 text-left">
          {steps.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            const StepIcon = step.icon;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3.5 ${
                  isCurrent
                    ? 'bg-[#191C1B] border-[#0AE448] shadow-md shadow-black/40 ring-1 ring-[#0AE448]/40'
                    : isDone
                    ? 'bg-[#141716] border-white/10 text-white'
                    : 'bg-[#101211] border-white/5 text-[#7C7C6F] opacity-40'
                }`}
              >
                <div className={`p-2 rounded-xl shrink-0 ${
                  isCurrent 
                    ? 'bg-[#0AE448] text-[#0E100F] shadow-sm' 
                    : isDone 
                    ? 'bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30' 
                    : 'bg-[#191C1B] border border-white/5 text-[#7C7C6F]'
                }`}>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-[#0AE448]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#0E100F]" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : isDone ? 'text-slate-200' : 'text-[#7C7C6F]'}`}>
                      {step.agent}
                    </span>
                    <span className="text-[10px] text-[#7C7C6F] font-mono shrink-0">
                      {step.role}
                    </span>
                  </div>
                  <p className="text-xs text-[#A0A090] truncate mt-0.5 font-sans">
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
