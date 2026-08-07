import React, { useState } from 'react';
import { Brain, Layers, Filter, RefreshCw, MessageSquare, Mail } from 'lucide-react';
import { AgentDiagnosticResult, IceIdea } from '../../types';

interface PmGrowthAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const PmGrowthAgentView: React.FC<PmGrowthAgentViewProps> = ({ diagnostic }) => {
  const { pmGrowth } = diagnostic;
  const [iceList, setIceList] = useState<IceIdea[]>(pmGrowth.iceMatrix);

  const toggleStatus = (id: string) => {
    setIceList(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'A Fazer' ? 'Em Teste' : item.status === 'Em Teste' ? 'Concluído' : 'A Fazer';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Agente Product Manager & Growth Loops</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Priorização ICE & Funil AAARRR
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Foco: Organizar o roadmap de experimentos em ordem de maior impacto e menor esforço.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Experimentos</p>
            <p className="text-xl font-bold font-mono text-blue-600">{iceList.length}</p>
          </div>
        </div>
      </div>

      {/* Interactive ICE Prioritization Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Matriz ICE Interativa LeakFinder</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Score ICE = (Impacto + Confiança + Facilidade) / 3</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs text-slate-700 font-medium">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Categoria</th>
                <th className="p-3.5">Experimento / Hipótese</th>
                <th className="p-3.5 text-center">Impacto</th>
                <th className="p-3.5 text-center">Confiança</th>
                <th className="p-3.5 text-center">Facilidade</th>
                <th className="p-3.5 text-center">Score ICE</th>
                <th className="p-3.5 text-right">Status (Clique)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {iceList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-900">{item.title}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-blue-600">{item.impact}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-slate-700">{item.confidence}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-emerald-600">{item.ease}</td>
                  <td className="p-3.5 text-center font-mono font-extrabold text-blue-700 text-sm">{item.iceScore}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`px-3 py-1 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                        item.status === 'Concluído' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        item.status === 'Em Teste' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {item.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pirate Funnel AAARRR & Automation Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 font-medium">
        
        {/* AAARRR Gaps */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Funil Pirata AAARRR — Análise de Gargalos</span>
          </h3>

          <div className="space-y-3">
            {pmGrowth.funnelGaps.map((gap, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{gap.stage}</span>
                  <span className="text-[10px] font-mono text-slate-500">Score: {gap.currentScore}/100</span>
                </div>
                <p className="text-amber-700 font-semibold text-[11px]">⚠️ {gap.bottleneck}</p>
                <p className="text-slate-800 font-medium">🎯 Ação: {gap.actionItem}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Workflows */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-600" />
            <span>Automações de Retenção & Recompra</span>
          </h3>

          <div className="space-y-3">
            {pmGrowth.automationWorkflows.map((auto, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">Gatilho: {auto.trigger}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded flex items-center gap-1 ${
                    auto.channel === 'WhatsApp' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {auto.channel === 'WhatsApp' ? <MessageSquare className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                    {auto.channel}
                  </span>
                </div>
                <p className="text-slate-600">Objetivo: {auto.goal}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
