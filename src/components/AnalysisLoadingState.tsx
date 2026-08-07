import React, { useEffect, useState } from 'react';
import { Layers, CheckCircle2, Loader2, Search, Target, DollarSign, Brain, BarChart3, Globe } from 'lucide-react';

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
      agent: 'LeakFinder Deep Scraper (Jina AI)',
      role: 'Leitura HTML Avançada',
      icon: Globe,
      message: `Extraindo textos e infraestrutura real de ${siteUrl}...`,
      detail: 'Bypass de Anti-Bot e Extração de Markdown (Isso leva uns 5-10s)'
    },
    {
      id: 2,
      agent: 'LeakFinder Crawler & NLP',
      role: 'Leitura Profunda',
      icon: Search,
      message: 'Processando as palavras exatas do site para a IA...',
      detail: 'Caçando Imagens Quebradas (Sem ALT/SRC) e Typos de Digitação'
    },
    {
      id: 3,
      agent: 'Agente SEO & Performance',
      role: 'Google Lighthouse API',
      icon: BarChart3,
      message: 'Avaliando Performance LCP/CLS e dados estruturados Schema...',
      detail: 'Injetando conteúdo real do site no LLM do Google Gemini'
    },
    {
      id: 4,
      agent: 'Agente de Mídia Paga',
      role: 'Especialista Ads',
      icon: Target,
      message: 'Calculando ROAS de equilíbrio e limite de CAC...',
      detail: 'Estruturando plano de orçamento 60/30/10 e ganchos em vídeo UGC'
    },
    {
      id: 5,
      agent: 'Agente Copywriting & Vendas',
      role: 'Engenharia de Ofertas',
      icon: DollarSign,
      message: 'Criando Bundles (Compre 2 Leve 3) e contornando objeções...',
      detail: 'Mapeando as 10 maiores objeções e redigindo headlines 4Us'
    },
    {
      id: 6,
      agent: 'Orquestrador LeakFinder',
      role: 'Síntese de Inteligência',
      icon: Brain,
      message: 'Consolidando o Relatório Executivo LeakFinder...',
      detail: 'Sintetizando LeakFinder Growth Score e projeção de receita líquida'
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
