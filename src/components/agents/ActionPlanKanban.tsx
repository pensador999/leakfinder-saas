import React, { useState, useMemo } from 'react';
import { KanbanSquare, Download, CheckCircle2, Circle, ArrowRight, Sparkles, Filter, Code2, Copy, Check, Eye, Flame, AlertOctagon, TrendingUp, HelpCircle } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface ActionPlanKanbanProps {
  diagnostic: AgentDiagnosticResult;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskCategory = 'TODOS' | 'CRO' | 'VISAO_COMPUTACIONAL' | 'SEO' | 'COPY' | 'COMPETITIVO';
export type TaskImpact = 'TODOS' | 'CRÍTICO' | 'ALTO' | 'MÉDIO';

export interface EnhancedTask {
  id: string;
  title: string;
  description: string;
  source: 'CRO' | 'VISÃO COMPUTACIONAL' | 'SEO' | 'COPY' | 'INTELIGÊNCIA COMPETITIVA';
  impact: 'CRÍTICO' | 'ALTO' | 'MÉDIO';
  effort: 'FÁCIL' | 'MÉDIO' | 'COMPLEXO';
  iceScore: number; // 0 to 100
  estimatedRoiLift: string;
  codeSnippet?: string;
  copySnippet?: string;
  status: TaskStatus;
}

export const ActionPlanKanban: React.FC<ActionPlanKanbanProps> = ({ diagnostic }) => {
  const { cro, seo, salesCopy, competitorIntelligence, visionAnalysis, realSiteData } = diagnostic;

  // Initialize unified task roadmap
  const initialTasks = useMemo<EnhancedTask[]>(() => {
    const rawTasks: EnhancedTask[] = [];

    // 1. CRO Tasks
    (cro.findings || []).forEach((f, idx) => {
      const impactScore = f.impact === 'CRÍTICO' ? 10 : f.impact === 'ALTO' ? 8 : 6;
      const easeScore = f.effort === 'FÁCIL' ? 9 : f.effort === 'MÉDIO' ? 6 : 4;
      const ice = Math.round((impactScore * 8 * easeScore) / 7.2);

      rawTasks.push({
        id: `cro-${f.id || idx}`,
        title: f.title,
        description: f.recommendation,
        source: 'CRO',
        impact: f.impact,
        effort: f.effort,
        iceScore: Math.min(99, Math.max(40, ice)),
        estimatedRoiLift: f.impact === 'CRÍTICO' ? '+15% a +28%' : '+8% a +14%',
        codeSnippet: f.category === 'Checkout' 
          ? '<!-- Otimização Checkout One-Page -->\n<div class="quick-checkout-container">\n  <button class="btn-express-buy">Comprar com 1 Clique (Pix / Cartão)</button>\n</div>'
          : f.category === 'Velocidade'
          ? '<!-- Otimização de Imagens Lazy Loading -->\n<img src="produto.jpg" loading="lazy" decoding="async" alt="Nome do Produto" />'
          : '/* Realce de CTA */\n.btn-cta-primary {\n  background: #10B981 !important;\n  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);\n}',
        status: 'todo'
      });
    });

    // 2. Computer Vision Tasks
    if (!visionAnalysis.uiux.ctaContrastIsGood) {
      rawTasks.push({
        id: 'cv-contrast',
        title: 'Corrigir Contraste Cromático do Botão de Compra (WCAG 4.5:1)',
        description: 'O botão de compra primário está se camuflando no fundo. Aumentar a luminância para destacar o CTA em menos de 1 segundo.',
        source: 'VISÃO COMPUTACIONAL',
        impact: 'CRÍTICO',
        effort: 'FÁCIL',
        iceScore: 94,
        estimatedRoiLift: '+12% a +19%',
        codeSnippet: `/* CSS de Alto Contraste WCAG 2.1 */\n.botao-compra {\n  background-color: ${visionAnalysis.contrastAudit.suggestedColors.bg} !important;\n  color: ${visionAnalysis.contrastAudit.suggestedColors.text} !important;\n  font-weight: 800;\n  padding: 16px 28px;\n  border-radius: 12px;\n}`,
        status: 'todo'
      });
    }

    if (!visionAnalysis.uiux.aboveTheFoldOptimized) {
      rawTasks.push({
        id: 'cv-abovethefold',
        title: 'Trazer Botão de Compra para a 1ª Dobra (Mobile)',
        description: 'No celular, o visitante precisa rolar a página para encontrar o botão. Implementar Sticky Bar no rodapé.',
        source: 'VISÃO COMPUTACIONAL',
        impact: 'CRÍTICO',
        effort: 'MÉDIO',
        iceScore: 91,
        estimatedRoiLift: '+18% a +25%',
        codeSnippet: '/* Barra de Compra Fixa Mobile */\n@media (max-width: 768px) {\n  .sticky-mobile-cta {\n    position: fixed;\n    bottom: 0;\n    left: 0;\n    right: 0;\n    background: #ffffff;\n    padding: 12px 16px;\n    border-top: 1px solid #e2e8f0;\n    z-index: 99999;\n  }\n}',
        status: 'todo'
      });
    }

    if (visionAnalysis.eyeTracking.mainFocusElement !== 'Botão Comprar' && visionAnalysis.eyeTracking.mainFocusElement !== 'Texto de Preço') {
      rawTasks.push({
        id: 'cv-eyetracking',
        title: `Reduzir Poluição Visual no(a) [${visionAnalysis.eyeTracking.mainFocusElement}]`,
        description: 'O mapa de calor por eye-tracking detectou que a atenção está sendo roubada antes do cliente ver o preço ou o botão.',
        source: 'VISÃO COMPUTACIONAL',
        impact: 'ALTO',
        effort: 'FÁCIL',
        iceScore: 84,
        estimatedRoiLift: '+9% a +15%',
        status: 'todo'
      });
    }

    // 3. SEO Tasks
    (seo.onPageFixes || []).forEach((issue, idx) => {
      rawTasks.push({
        id: `seo-fix-${idx}`,
        title: `SEO On-Page: ${issue}`,
        description: 'Gargalo técnico de indexação que impede o Google de posicionar a loja na 1ª página para termos comerciais.',
        source: 'SEO',
        impact: 'ALTO',
        effort: 'MÉDIO',
        iceScore: 78,
        estimatedRoiLift: '+10% a +22% Tráfego Orgânico',
        codeSnippet: '<meta name="description" content="Compre online com frete rápido, garantia e suporte exclusivo. Confira ofertas hoje!" />\n<link rel="canonical" href="https://' + realSiteData.domain + '/" />',
        status: 'todo'
      });
    });

    // 4. Copy & Objections
    (salesCopy.objections || []).forEach((obj, idx) => {
      rawTasks.push({
        id: `copy-obj-${idx}`,
        title: `Matar Objeção: "${obj.objection}"`,
        description: `Estratégia recomendada: ${obj.counterStrategy}`,
        source: 'COPY',
        impact: 'ALTO',
        effort: 'FÁCIL',
        iceScore: 88,
        estimatedRoiLift: '+14% a +20%',
        copySnippet: obj.suggestedCopySnippet || `Você tem total tranquilidade: ${obj.counterStrategy}. Se não gostar, devolvemos 100% do seu dinheiro.`,
        status: 'todo'
      });
    });

    // 5. Competitor Opportunities
    (competitorIntelligence?.opportunitiesToSteal || []).forEach((opp, idx) => {
      rawTasks.push({
        id: `comp-opp-${idx}`,
        title: opp.title,
        description: opp.action,
        source: 'INTELIGÊNCIA COMPETITIVA',
        impact: 'ALTO',
        effort: opp.effort,
        iceScore: opp.effort === 'FÁCIL' ? 89 : opp.effort === 'MÉDIO' ? 76 : 65,
        estimatedRoiLift: '+11% a +18%',
        status: 'todo'
      });
    });

    // Sort by ICE score descending
    return rawTasks.sort((a, b) => b.iceScore - a.iceScore);
  }, [cro, seo, salesCopy, competitorIntelligence, visionAnalysis, realSiteData]);

  const [tasks, setTasks] = useState<EnhancedTask[]>(initialTasks);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('TODOS');
  const [selectedImpact, setSelectedImpact] = useState<TaskImpact>('TODOS');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2500);
  };

  const handleMoveStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchCategory = 
        selectedCategory === 'TODOS' ? true :
        selectedCategory === 'CRO' ? t.source === 'CRO' :
        selectedCategory === 'VISAO_COMPUTACIONAL' ? t.source === 'VISÃO COMPUTACIONAL' :
        selectedCategory === 'SEO' ? t.source === 'SEO' :
        selectedCategory === 'COPY' ? t.source === 'COPY' :
        selectedCategory === 'COMPETITIVO' ? t.source === 'INTELIGÊNCIA COMPETITIVA' : true;

      const matchImpact = selectedImpact === 'TODOS' || t.impact === selectedImpact;
      return matchCategory && matchImpact;
    });
  }, [tasks, selectedCategory, selectedImpact]);

  const todoTasks = filteredTasks.filter(t => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'done');

  const completionRate = Math.round((tasks.filter(t => t.status === 'done').length / (tasks.length || 1)) * 100);

  const downloadCsv = () => {
    const headers = ['Origem', 'Impacto', 'Esforço', 'ICE Score', 'ROI Estimado', 'Status', 'Tarefa', 'Ação Recomendada', 'Snippet Código / Copy'];
    const rows = tasks.map(t => [
      `"${t.source}"`,
      `"${t.impact}"`,
      `"${t.effort}"`,
      t.iceScore,
      `"${t.estimatedRoiLift}"`,
      `"${t.status === 'done' ? 'Concluído' : t.status === 'in_progress' ? 'Em Andamento' : 'A Fazer'}"`,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      `"${(t.codeSnippet || t.copySnippet || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Plano_Acao_Enterprise_${realSiteData.brandName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'CRÍTICO': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'ALTO': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MÉDIO': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const renderTaskCard = (task: EnhancedTask) => {
    const isExpanded = expandedTaskId === task.id;

    return (
      <div 
        key={task.id}
        className={`p-4 rounded-2xl border transition-all space-y-3 bg-white shadow-xs ${
          task.status === 'done' ? 'border-emerald-200 opacity-85' : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
        }`}
      >
        {/* Source & Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {task.source}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getImpactBadge(task.impact)}`}>
              {task.impact}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> ICE {task.iceScore}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className={`text-xs font-bold leading-snug ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
          {task.title}
        </h4>

        {/* Description */}
        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
          {task.description}
        </p>

        {/* Metrics & Action Controls */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <span className="text-emerald-700 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> {task.estimatedRoiLift}
          </span>

          <button
            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
            className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            {isExpanded ? 'Ocultar' : 'Ver Solução'}
          </button>
        </div>

        {/* Expanded Solution & Code Area */}
        {isExpanded && (
          <div className="pt-3 border-t border-indigo-50 space-y-2.5 bg-slate-50 p-3 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Code2 className="w-3 h-3 text-indigo-600" /> Solução Pronta para Aplicar
              </span>
              {(task.codeSnippet || task.copySnippet) && (
                <button
                  onClick={() => handleCopy(task.id, task.codeSnippet || task.copySnippet || '')}
                  className="px-2 py-0.5 text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  {copiedCodeId === task.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCodeId === task.id ? 'Copiado!' : 'Copiar Snippet'}</span>
                </button>
              )}
            </div>

            {task.codeSnippet && (
              <pre className="p-2.5 bg-slate-900 text-slate-200 text-[10px] font-mono rounded-lg overflow-x-auto">
                {task.codeSnippet}
              </pre>
            )}

            {task.copySnippet && (
              <div className="p-2.5 bg-indigo-50/80 border border-indigo-200 text-indigo-950 text-xs font-medium rounded-lg">
                <p className="font-bold text-[10px] text-indigo-800 uppercase mb-1">Texto de Copy Recomendado:</p>
                "{task.copySnippet}"
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] text-slate-400">Esforço estimado: <strong className="text-slate-700">{task.effort}</strong></span>
              
              {/* Status Move Buttons */}
              <div className="flex items-center gap-1">
                {task.status !== 'todo' && (
                  <button
                    onClick={() => handleMoveStatus(task.id, 'todo')}
                    className="px-2 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded hover:bg-slate-100"
                  >
                    A Fazer
                  </button>
                )}
                {task.status !== 'in_progress' && (
                  <button
                    onClick={() => handleMoveStatus(task.id, 'in_progress')}
                    className="px-2 py-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100"
                  >
                    Em Progresso
                  </button>
                )}
                {task.status !== 'done' && (
                  <button
                    onClick={() => handleMoveStatus(task.id, 'done')}
                    className="px-2 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Concluir
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-600">
              <KanbanSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Plano de Ação Executivo & Matriz ICE</h2>
              <p className="text-xs text-slate-500">
                Tarefas priorizadas pelo algoritmo de maior retorno sobre esforço para <span className="font-mono font-bold text-slate-800">{realSiteData.domain}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracker & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-48 space-y-1 text-center sm:text-left">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Progresso</span>
              <span>{completionRate}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" 
                style={{ width: `${completionRate}%` }} 
              />
            </div>
          </div>

          <button 
            onClick={downloadCsv}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Notion / Trello / CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Área:
          </span>
          {(['TODOS', 'CRO', 'VISAO_COMPUTACIONAL', 'SEO', 'COPY', 'COMPETITIVO'] as TaskCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'VISAO_COMPUTACIONAL' ? 'Visão Computacional' : cat === 'COMPETITIVO' ? 'Concorrência' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Impacto:</span>
          {(['TODOS', 'CRÍTICO', 'ALTO', 'MÉDIO'] as TaskImpact[]).map((imp) => (
            <button
              key={imp}
              onClick={() => setSelectedImpact(imp)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                selectedImpact === imp ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {imp}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Interactive Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: A Fazer (To Do) */}
        <div className="bg-slate-100/70 p-4 rounded-2xl border border-slate-200 space-y-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-slate-500" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">A Fazer</h3>
            </div>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white text-slate-700 rounded-full border border-slate-200">
              {todoTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[850px] pr-1">
            {todoTasks.map(renderTaskCard)}
            {todoTasks.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-xl bg-white/50">
                Nenhuma tarefa pendente nesta categoria.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Em Execução (In Progress) */}
        <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-200 space-y-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">Em Andamento</h3>
            </div>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white text-blue-700 rounded-full border border-blue-200">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[850px] pr-1">
            {inProgressTasks.map(renderTaskCard)}
            {inProgressTasks.length === 0 && (
              <div className="p-8 text-center text-xs text-blue-400 border border-dashed border-blue-200 rounded-xl bg-white/50">
                Arraste ou clique em "Em Progresso" para mover tarefas aqui.
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Concluído (Done) */}
        <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-200 space-y-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Concluído</h3>
            </div>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-white text-emerald-700 rounded-full border border-emerald-200">
              {doneTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[850px] pr-1">
            {doneTasks.map(renderTaskCard)}
            {doneTasks.length === 0 && (
              <div className="p-8 text-center text-xs text-emerald-500 border border-dashed border-emerald-200 rounded-xl bg-white/50">
                Tarefas finalizadas aparecerão aqui.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
