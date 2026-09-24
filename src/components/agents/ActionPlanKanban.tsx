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
      case 'CRÍTICO': return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'ALTO': return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'MÉDIO': return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
      default: return 'bg-white/5 text-[#BBBAA6] border-white/10';
    }
  };

  const renderTaskCard = (task: EnhancedTask) => {
    const isExpanded = expandedTaskId === task.id;

    return (
      <div 
        key={task.id}
        className={`p-4 rounded-2xl border transition-all space-y-3 bg-[#101211] shadow-xs ${
          task.status === 'done' ? 'border-[#0AE448]/30 opacity-70' : 'border-white/10 hover:border-[#0AE448]/40 hover:shadow-md'
        }`}
      >
        {/* Source & Badges */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#BBBAA6] bg-white/5 px-2 py-0.5 rounded border border-white/5">
            {task.source}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getImpactBadge(task.impact)}`}>
              {task.impact}
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" /> ICE {task.iceScore}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className={`text-xs font-bold leading-snug ${task.status === 'done' ? 'line-through text-[#BBBAA6]/60' : 'text-[#FFFCE1]'}`}>
          {task.title}
        </h4>

        {/* Description */}
        <p className="text-[11px] text-[#BBBAA6] leading-relaxed line-clamp-2">
          {task.description}
        </p>

        {/* Metrics & Action Controls */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-[#0AE448] font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#0AE448]" /> {task.estimatedRoiLift}
          </span>

          <button
            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
            className="text-[#0AE448] hover:text-[#0AE448]/80 font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            {isExpanded ? 'Ocultar' : 'Ver Solução'}
          </button>
        </div>

        {/* Expanded Solution & Code Area */}
        {isExpanded && (
          <div className="pt-3 border-t border-white/10 space-y-2.5 bg-[#141716] p-3 rounded-xl border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#BBBAA6] flex items-center gap-1">
                <Code2 className="w-3 h-3 text-[#0AE448]" /> Solução Pronta para Aplicar
              </span>
              {(task.codeSnippet || task.copySnippet) && (
                <button
                  onClick={() => handleCopy(task.id, task.codeSnippet || task.copySnippet || '')}
                  className="px-2 py-0.5 text-[10px] font-bold bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
                >
                  {copiedCodeId === task.id ? <Check className="w-3 h-3 text-[#0AE448]" /> : <Copy className="w-3 h-3 text-[#BBBAA6]" />}
                  <span>{copiedCodeId === task.id ? 'Copiado!' : 'Copiar Snippet'}</span>
                </button>
              )}
            </div>

            {task.codeSnippet && (
              <pre className="p-2.5 bg-[#0E100F] border border-white/10 text-emerald-400 text-[10px] font-mono rounded-lg overflow-x-auto">
                {task.codeSnippet}
              </pre>
            )}

            {task.copySnippet && (
              <div className="p-2.5 bg-[#0AE448]/10 border border-[#0AE448]/20 text-[#FFFCE1] text-xs font-medium rounded-lg">
                <p className="font-bold text-[10px] text-[#0AE448] uppercase mb-1">Texto de Copy Recomendado:</p>
                "{task.copySnippet}"
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[10px] text-[#BBBAA6]">Esforço estimado: <strong className="text-[#FFFCE1]">{task.effort}</strong></span>
              
              {/* Status Move Buttons */}
              <div className="flex items-center gap-1">
                {task.status !== 'todo' && (
                  <button
                    onClick={() => handleMoveStatus(task.id, 'todo')}
                    className="px-2 py-1 text-[10px] font-bold text-[#BBBAA6] bg-white/5 border border-white/10 rounded hover:bg-white/10"
                  >
                    A Fazer
                  </button>
                )}
                {task.status !== 'in_progress' && (
                  <button
                    onClick={() => handleMoveStatus(task.id, 'in_progress')}
                    className="px-2 py-1 text-[10px] font-bold text-sky-400 bg-sky-500/10 border border-sky-500/20 rounded hover:bg-sky-500/20"
                  >
                    Em Progresso
                  </button>
                )}
                {task.status !== 'done' && (
                  <button
                    onClick={() => handleMoveStatus(task.id, 'done')}
                    className="px-2 py-1 text-[10px] font-bold text-[#0AE448] bg-[#0AE448]/10 border border-[#0AE448]/20 rounded hover:bg-[#0AE448]/20 flex items-center gap-1"
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
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-xl text-[#0AE448]">
              <KanbanSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#FFFCE1]">Plano de Ação Executivo & Matriz ICE</h2>
              <p className="text-xs text-[#BBBAA6]">
                Tarefas priorizadas pelo algoritmo de maior retorno sobre esforço para <span className="font-mono font-bold text-[#FFFCE1]">{realSiteData.domain}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress Tracker & Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-48 space-y-1 text-center sm:text-left">
            <div className="flex justify-between text-xs font-bold text-[#BBBAA6]">
              <span>Progresso</span>
              <span className="text-[#FFFCE1]">{completionRate}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#0E100F] rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-[#0AE448] transition-all duration-500 shadow-sm shadow-[#0AE448]/30" 
                style={{ width: `${completionRate}%` }} 
              />
            </div>
          </div>

          <button 
            onClick={downloadCsv}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-[#0AE448]/20 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Notion / Trello / CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-[#101211] rounded-2xl border border-white/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          <span className="text-xs font-bold text-[#BBBAA6] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#0AE448]" /> Área:
          </span>
          {(['TODOS', 'CRO', 'VISAO_COMPUTACIONAL', 'SEO', 'COPY', 'COMPETITIVO'] as TaskCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat ? 'bg-[#0AE448] text-slate-950 font-black' : 'bg-white/5 text-[#BBBAA6] hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'VISAO_COMPUTACIONAL' ? 'Visão Computacional' : cat === 'COMPETITIVO' ? 'Concorrência' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#BBBAA6]">Impacto:</span>
          {(['TODOS', 'CRÍTICO', 'ALTO', 'MÉDIO'] as TaskImpact[]).map((imp) => (
            <button
              key={imp}
              onClick={() => setSelectedImpact(imp)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                selectedImpact === imp ? 'bg-[#0AE448] text-slate-950 font-black shadow-lg shadow-[#0AE448]/20' : 'bg-white/5 text-[#BBBAA6] hover:bg-white/10 hover:text-white'
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
        <div className="bg-[#141716] p-4 rounded-3xl border border-white/10 space-y-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-[#BBBAA6]" />
              <h3 className="text-xs font-bold text-[#FFFCE1] uppercase tracking-wider">A Fazer</h3>
            </div>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#0E100F] text-[#FFFCE1] rounded-full border border-white/10">
              {todoTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[850px] pr-1 scrollbar-thin">
            {todoTasks.map(renderTaskCard)}
            {todoTasks.length === 0 && (
              <div className="p-8 text-center text-xs text-[#BBBAA6]/60 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                Nenhuma tarefa pendente nesta categoria.
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Em Execução (In Progress) */}
        <div className="bg-[#141716] p-4 rounded-3xl border border-sky-500/20 space-y-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold text-sky-300 uppercase tracking-wider">Em Andamento</h3>
            </div>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-sky-500/10 text-sky-300 rounded-full border border-sky-500/20">
              {inProgressTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[850px] pr-1 scrollbar-thin">
            {inProgressTasks.map(renderTaskCard)}
            {inProgressTasks.length === 0 && (
              <div className="p-8 text-center text-xs text-[#BBBAA6]/60 border border-dashed border-sky-500/20 rounded-xl bg-white/[0.02]">
                Arraste ou clique em "Em Progresso" para mover tarefas aqui.
              </div>
            )}
          </div>
        </div>

        {/* Column 3: Concluído (Done) */}
        <div className="bg-[#141716] p-4 rounded-3xl border border-[#0AE448]/20 space-y-3 flex flex-col">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0AE448]" />
              <h3 className="text-xs font-bold text-[#0AE448] uppercase tracking-wider">Concluído</h3>
            </div>
            <span className="px-2 py-0.5 text-xs font-mono font-bold bg-[#0AE448]/10 text-[#0AE448] rounded-full border border-[#0AE448]/20">
              {doneTasks.length}
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[850px] pr-1 scrollbar-thin">
            {doneTasks.map(renderTaskCard)}
            {doneTasks.length === 0 && (
              <div className="p-8 text-center text-xs text-[#BBBAA6]/60 border border-dashed border-[#0AE448]/20 rounded-xl bg-white/[0.02]">
                Tarefas finalizadas aparecerão aqui.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
