import React from 'react';
import { KanbanSquare, Download, CheckCircle } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface ActionPlanKanbanProps {
  diagnostic: AgentDiagnosticResult;
}

export const ActionPlanKanban: React.FC<ActionPlanKanbanProps> = ({ diagnostic }) => {
  const { cro, seo, salesCopy, competitorIntelligence } = diagnostic;

  // Compile all tasks into a single list
  const tasks = [
    ...(cro.findings || []).map(f => ({
      id: f.id,
      title: f.title,
      description: f.recommendation,
      impact: f.impact,
      effort: f.effort,
      source: 'CRO'
    })),
    ...(seo.onPageFixes || []).map((issue, idx) => ({
      id: `seo-iss-${idx}`,
      title: `Corrigir: ${issue}`,
      description: 'Problema técnico de SEO que está barrando rastreamento ou rankeamento.',
      impact: 'ALTO' as const,
      effort: 'MÉDIO' as const,
      source: 'SEO'
    })),
    ...(salesCopy.objections || []).map((obj, idx) => ({
      id: `obj-${idx}-${Math.random()}`,
      title: `Quebrar objeção: ${obj.objection}`,
      description: `Argumento a usar: ${obj.counterStrategy}`,
      impact: 'ALTO' as const,
      effort: 'FÁCIL' as const,
      source: 'COPY'
    })),
    ...(competitorIntelligence?.opportunitiesToSteal || []).map((opp, idx) => ({
      id: `comp-opp-${idx}`,
      title: opp.title,
      description: opp.action,
      impact: 'ALTO' as const,
      effort: opp.effort,
      source: 'INTELIGÊNCIA COMPETITIVA'
    }))
  ];

  const downloadCsv = () => {
    const headers = ['Origem', 'Impacto', 'Esforço', 'Tarefa', 'Ação / Recomendação'];
    const rows = tasks.map(t => [
      t.source,
      t.impact,
      t.effort,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Plano_Acao_${diagnostic.realSiteData.brandName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'CRÍTICO': return 'bg-red-100 text-red-700';
      case 'ALTO': return 'bg-orange-100 text-orange-700';
      case 'MÉDIO': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <KanbanSquare className="w-6 h-6 text-indigo-600" />
            Plano de Ação Integrado
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Todas as recomendações geradas pelos agentes reunidas em tarefas práticas para sua equipe.
          </p>
        </div>
        <button 
          onClick={downloadCsv}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors font-bold rounded-lg whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Exportar Trello/CSV
        </button>
      </div>

      <div className="grid md:grid-cols-1 gap-4">
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {task.source}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${getImpactColor(task.impact)}`}>
                  Impacto {task.impact}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800">{task.title}</h3>
              <p className="text-sm text-slate-600">{task.description}</p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400 font-medium">Esforço</span>
                <span className="text-sm font-bold text-slate-700">{task.effort}</span>
              </div>
              <button className="p-2 border border-slate-200 text-slate-400 rounded-lg hover:border-green-400 hover:text-green-500 hover:bg-green-50 transition-colors">
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
            Nenhuma tarefa pendente encontrada na auditoria.
          </div>
        )}
      </div>
    </div>
  );
};
