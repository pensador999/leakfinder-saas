import React, { useState } from 'react';
import { DollarSign, Sparkles, Copy, Check, Gift, HelpCircle } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface SalesCopyAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const SalesCopyAgentView: React.FC<SalesCopyAgentViewProps> = ({ diagnostic }) => {
  const { salesCopy, realSiteData } = diagnostic;
  const [copiedHeadlineIndex, setCopiedHeadlineIndex] = useState<number | null>(null);

  const copyHeadline = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedHeadlineIndex(idx);
    setTimeout(() => setCopiedHeadlineIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Agente de Copywriting & Psicologia de Vendas</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Aumento de Ticket Médio & Ofertas
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Site Analisado: <span className="font-mono text-slate-900 font-bold">{realSiteData.domain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Elevador AOV</p>
            <p className="text-xl font-bold font-mono text-emerald-600">+14% a +38%</p>
          </div>
        </div>
      </div>

      {/* Semantic NLP Copy Analysis (Deep Inspection) */}
      {salesCopy.copyNlpAnalysis && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Análise Semântica NLP da Copy (Dados Reais)</span>
          </h3>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 font-mono block">Score de Persuasão LeakFinder</span>
                <span className={`text-2xl font-black font-mono tracking-tight ${salesCopy.copyNlpAnalysis.score > 70 ? 'text-emerald-600' : salesCopy.copyNlpAnalysis.score > 40 ? 'text-amber-500' : 'text-rose-600'}`}>
                  {salesCopy.copyNlpAnalysis.score}/100
                </span>
                <span className="text-xs font-bold text-slate-600 ml-2">({salesCopy.copyNlpAnalysis.sentiment})</span>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-[10px] font-bold rounded border ${salesCopy.copyNlpAnalysis.urgencyDetected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>Urgência: {salesCopy.copyNlpAnalysis.urgencyDetected ? 'OK' : 'Falha'}</span>
                <span className={`px-2 py-1 text-[10px] font-bold rounded border ${salesCopy.copyNlpAnalysis.scarcityDetected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>Escassez: {salesCopy.copyNlpAnalysis.scarcityDetected ? 'OK' : 'Falha'}</span>
                <span className={`px-2 py-1 text-[10px] font-bold rounded border ${salesCopy.copyNlpAnalysis.socialProofDetected ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>Prova Social: {salesCopy.copyNlpAnalysis.socialProofDetected ? 'OK' : 'Falha'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium space-y-2">
              <p><strong className="text-slate-900">Análise do Título (H1):</strong> {salesCopy.copyNlpAnalysis.headlineAnalysis}</p>
              <p><strong className="text-slate-900">Verbos de Ação Fortes Lidos:</strong> {salesCopy.copyNlpAnalysis.actionWordsCount}</p>
            </div>

            {salesCopy.copyNlpAnalysis.recommendations.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase text-rose-600">Recomendações Críticas da IA:</span>
                <ul className="text-xs text-slate-600 font-medium space-y-1 list-disc pl-4">
                  {salesCopy.copyNlpAnalysis.recommendations.map((rec: string, i: number) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Headlines Frameworks */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Headlines Persuasivas LeakFinder</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {salesCopy.headlineFrameworks.map((hl, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between space-y-3 shadow-xs">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-slate-100 text-slate-700">
                  {hl.framework}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                  "{hl.headline}"
                </h4>
                <p className="text-xs text-slate-500 mt-1 italic font-medium">
                  {hl.subheadline}
                </p>
              </div>

              <button
                onClick={() => copyHeadline(`${hl.headline}\n${hl.subheadline}`, idx)}
                className="w-full py-2 px-3 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedHeadlineIndex === idx ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHeadlineIndex === idx ? 'Copiado!' : 'Copiar Headline'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Offers Architecture */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Gift className="w-4 h-4 text-blue-600" />
          <span>Matriz de Ofertas para Aumentar o Ticket Médio</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {salesCopy.offers.map((offer, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {offer.type}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    {offer.estimatedAovLift}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-3">{offer.title}</h4>
                <p className="text-xs text-slate-600 mt-1 font-medium">{offer.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium">
                <span className="text-slate-500">Preço Sugerido:</span>
                <span className="font-bold font-mono text-slate-900 text-sm">{offer.suggestedPrice}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Objections Matrix */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span>Matriz de Quebra de Objeções LeakFinder</span>
        </h3>

        <div className="space-y-3">
          {salesCopy.objections.map((obj, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-medium">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">Objeção: {obj.objection}</span>
                <span className="text-[10px] text-slate-400 font-mono">Estratégia Anti-Atrito</span>
              </div>
              <p className="text-xs text-slate-600">
                <strong className="text-slate-900">Ação no Site:</strong> {obj.counterStrategy}
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-mono text-blue-700 font-bold">
                {obj.suggestedCopySnippet}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
