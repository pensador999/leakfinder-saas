import React from 'react';
import { Target, Sword, Crosshair, TrendingUp, AlertTriangle, CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface CompetitorAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const CompetitorAgentView: React.FC<CompetitorAgentViewProps> = ({ diagnostic }) => {
  const { competitorIntelligence, competitorGap } = diagnostic;

  if (!competitorIntelligence) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <Target className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-slate-700 mb-2">Sem Espionagem Ativa</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Você não forneceu a URL de um concorrente durante a auditoria. 
          Para ativar o Agente Espião, refaça a análise incluindo o site do seu maior rival.
        </p>
      </div>
    );
  }

  const { competitorBrandName, threatLevel, strengths, weaknesses, opportunitiesToSteal, comparisons } = competitorIntelligence;

  const threatColors = {
    BAIXO: 'bg-green-100 text-green-700 border-green-200',
    MÉDIO: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    ALTO: 'bg-orange-100 text-orange-700 border-orange-200',
    EXTREMO: 'bg-red-100 text-red-700 border-red-200'
  };

  return (
    <div className="space-y-6">
      
      {/* Header Profile */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Sword className="w-6 h-6 text-slate-700" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Alvo: {competitorBrandName}</h2>
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <Crosshair className="w-4 h-4" />
              Agente de Inteligência Competitiva focado na destruição de objeções.
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl border font-bold flex flex-col items-center justify-center ${threatColors[threatLevel]}`}>
            <span className="text-xs uppercase tracking-wider opacity-80">Nível de Ameaça</span>
            <span className="text-xl">{threatLevel}</span>
          </div>
        </div>
      </div>

      {/* SWOT Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-red-500" />
            Forças deles (Cuidado)
          </h3>
          <ul className="space-y-3">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-red-50/50 p-3 rounded-lg border border-red-100">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-green-500" />
            Fraquezas deles (Atacar)
          </h3>
          <ul className="space-y-3">
            {weaknesses.map((wk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-600 bg-green-50/50 p-3 rounded-lg border border-green-100">
                <Target className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>{wk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Opportunities */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Oportunidades de Roubo de Mercado
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {opportunitiesToSteal.map((opp, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all bg-slate-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600">
                  Esforço: {opp.effort}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 mb-2">{opp.title}</h4>
              <p className="text-sm text-slate-600">{opp.action}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Head-to-Head Comparisons */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Comparativo Head-to-Head</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-sm font-semibold text-slate-500">Métrica Analisada</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-500">Você</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-500">Eles</th>
                <th className="py-3 px-4 text-sm font-semibold text-slate-500 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Join AI comparisons and hardcoded gap comparisons */}
              {[...comparisons, ...competitorGap].map((comp, idx) => {
                const isAdvantage = comp.status === 'VANTAGEM';
                const isDisadvantage = comp.status === 'DESVANTAGEM';
                
                return (
                  <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-800">{comp.metric}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{comp.you}</td>
                    <td className="py-3 px-4 text-sm text-slate-600">{comp.competitor}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                        isAdvantage ? 'bg-green-100 text-green-700' : 
                        isDisadvantage ? 'bg-red-100 text-red-700' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {comp.status}
                        {isAdvantage && <ArrowRight className="w-3 h-3 -rotate-45" />}
                        {isDisadvantage && <ArrowRight className="w-3 h-3 rotate-45" />}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
