import React, { useState } from 'react';
import { Target, Video, Copy, Check, Layers } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface AdsAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const AdsAgentView: React.FC<AdsAgentViewProps> = ({ diagnostic }) => {
  const { ads, input } = diagnostic;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyAdText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Agente de Mídia Paga (Ads Strategist)</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Meta Ads, Google Ads & TikTok
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Foco: Escala de tráfego pago com ROAS saudável, controle de CAC e criativos de alta conversão.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">ROAS Alvo</p>
            <p className="text-xl font-bold font-mono text-emerald-600">{ads.targetRoas}x</p>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">CAC Limite</p>
            <p className="text-xl font-bold font-mono text-blue-600">R$ {ads.maxCacAllowed}</p>
          </div>
        </div>
      </div>

      {/* Budget Allocation Breakdown */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Divisão de Orçamento (Orçamento Mensal Sugerido: R$ {ads.monthlyAdBudgetSuggested.toLocaleString('pt-BR')})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-medium">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Top de Funil (Tráfego Frio)</span>
              <span className="font-mono font-bold text-blue-600">{ads.budgetAllocation.coldProspecting}%</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Públicos Abertos, Interesses em {input.niche} e Lookalikes de Compradores.
            </p>
            <p className="text-xs font-mono text-slate-900 font-bold">
              R$ {Math.round(ads.monthlyAdBudgetSuggested * (ads.budgetAllocation.coldProspecting / 100)).toLocaleString('pt-BR')}/mês
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Meio & Fundo de Funil (Retargeting)</span>
              <span className="font-mono font-bold text-blue-600">{ads.budgetAllocation.retargeting}%</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Engajadores Instagram 30d, Visitantes do Site e Abandono de Carrinho.
            </p>
            <p className="text-xs font-mono text-slate-900 font-bold">
              R$ {Math.round(ads.monthlyAdBudgetSuggested * (ads.budgetAllocation.retargeting / 100)).toLocaleString('pt-BR')}/mês
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Validação de Novos Criativos</span>
              <span className="font-mono font-bold text-blue-600">{ads.budgetAllocation.testing}%</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Ambiente CBO isolado para testar novos ganchos de vídeos e imagens estáticas.
            </p>
            <p className="text-xs font-mono text-slate-900 font-bold">
              R$ {Math.round(ads.monthlyAdBudgetSuggested * (ads.budgetAllocation.testing / 100)).toLocaleString('pt-BR')}/mês
            </p>
          </div>

        </div>
      </div>

      {/* Ad Creatives Blueprint & Copy Generator */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Video className="w-4 h-4 text-blue-600" />
          <span>Ganchos & Copys de Anúncios Prontos</span>
        </h3>

        <div className="grid grid-cols-1 gap-4 font-medium">
          {ads.creatives.map((creative, index) => (
            <div key={index} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {creative.format}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{creative.angleName}</h4>
                </div>
                <span className="text-xs text-slate-400 italic">Público: {creative.targetAudience}</span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Gancho Inicial (0 a 3 seg):</span>
                  <p className="text-sm font-semibold text-slate-900 italic mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {creative.hook}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Texto Principal / Corpo do Anúncio:</span>
                  <p className="text-slate-700 mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    {creative.bodyCopy}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-blue-700 font-semibold">
                    <span>CTA:</span>
                    <span className="text-slate-900">{creative.cta}</span>
                  </div>

                  <button
                    onClick={() => copyAdText(`${creative.hook}\n\n${creative.bodyCopy}\n\n👉 ${creative.cta}`, index)}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedIndex === index ? 'Copiado!' : 'Copiar Anúncio'}</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
