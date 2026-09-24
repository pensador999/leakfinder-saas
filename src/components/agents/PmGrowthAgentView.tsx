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
    <div className="space-y-6 font-sans">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-[#FFFCE1]">Agente Product Manager & Growth Loops</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#00BAE2]/10 text-[#00BAE2] rounded-full border border-[#00BAE2]/20">
                Priorização ICE & Funil AAARRR
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 font-medium">
              Foco: Organizar o roadmap de experimentos em ordem de maior impacto e menor esforço.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-5 py-3 bg-[#141716] rounded-2xl border border-white/10">
          <div className="text-center">
            <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-bold">Experimentos</p>
            <p className="text-xl font-black font-mono text-[#0AE448]">{iceList.length}</p>
          </div>
        </div>
      </div>

      {/* Interactive ICE Prioritization Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#FFFCE1] uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#0AE448]" />
            <span>Matriz ICE Interativa AdShield</span>
          </h3>
          <span className="text-xs text-[#BBBAA6] font-mono font-medium">Score ICE = (Impacto + Confiança + Facilidade) / 3</span>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#101211] shadow-2xl">
          <table className="w-full text-left text-xs text-[#FFFCE1] font-medium">
            <thead className="bg-[#141716] text-[#BBBAA6] uppercase text-[10px] font-mono font-bold border-b border-white/10">
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
            <tbody className="divide-y divide-white/5">
              {iceList.map((item) => (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-lg font-mono font-extrabold text-[10px] bg-[#141716] text-[#00BAE2] border border-white/10">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-[#FFFCE1]">{item.title}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-[#00BAE2]">{item.impact}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-[#BBBAA6]">{item.confidence}</td>
                  <td className="p-3.5 text-center font-mono font-bold text-[#0AE448]">{item.ease}</td>
                  <td className="p-3.5 text-center font-mono font-extrabold text-[#0AE448] text-sm">{item.iceScore}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => toggleStatus(item.id)}
                      className={`px-3 py-1 text-[11px] font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                        item.status === 'Concluído' ? 'bg-[#0AE448]/20 text-[#0AE448] border-[#0AE448]/30' :
                        item.status === 'Em Teste' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                        'bg-white/5 text-[#BBBAA6] border-white/10 hover:border-white/20'
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
        <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 space-y-4 shadow-2xl">
          <h3 className="text-sm font-black text-[#FFFCE1] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00BAE2]" />
            <span>Funil Pirata AAARRR — Análise de Gargalos</span>
          </h3>

          <div className="space-y-3">
            {pmGrowth.funnelGaps.map((gap, idx) => (
              <div key={idx} className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#FFFCE1]">{gap.stage}</span>
                  <span className="text-[10px] font-mono text-[#BBBAA6]">Score: {gap.currentScore}/100</span>
                </div>
                <p className="text-amber-400 font-semibold text-[11px]">⚠️ {gap.bottleneck}</p>
                <p className="text-[#FFFCE1] font-medium">🎯 Ação: {gap.actionItem}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Automation Workflows */}
        <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 space-y-4 shadow-2xl">
          <h3 className="text-sm font-black text-[#FFFCE1] flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-[#0AE448]" />
            <span>Automações de Retenção & Recompra</span>
          </h3>

          <div className="space-y-3">
            {pmGrowth.automationWorkflows.map((auto, idx) => (
              <div key={idx} className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#FFFCE1]">Gatilho: {auto.trigger}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold font-mono rounded-lg flex items-center gap-1 ${
                    auto.channel === 'WhatsApp' ? 'bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30' :
                    'bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20'
                  }`}>
                    {auto.channel === 'WhatsApp' ? <MessageSquare className="w-3 h-3" /> : <Mail className="w-3 h-3" />}
                    {auto.channel}
                  </span>
                </div>
                <p className="text-[#BBBAA6]">Objetivo: {auto.goal}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
