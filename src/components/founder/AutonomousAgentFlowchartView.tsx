import React, { useState } from 'react';
import { 
  Cpu, 
  Crown, 
  Compass, 
  Globe, 
  Layers, 
  GitCompare, 
  Gauge, 
  Eye, 
  Calculator, 
  Phone, 
  CheckCircle2, 
  ArrowDown, 
  ArrowRight, 
  Sparkles, 
  Settings, 
  Edit3, 
  Save, 
  Bot, 
  Zap, 
  ShieldCheck, 
  Play,
  RotateCcw
} from 'lucide-react';

interface AgentNodeInfo {
  id: string;
  number: string;
  name: string;
  roleTitle: string;
  iconName: string;
  executionTime: string;
  phase: string;
  mission: string;
  inputs: string[];
  outputs: string[];
  status: 'ONLINE' | 'RUNNING' | 'STANDBY';
  customTip: string;
}

const AGENTS_PIPELINE: AgentNodeInfo[] = [
  {
    id: 'agent-1',
    number: '01',
    name: 'Despertador Cron Edge',
    roleTitle: 'Vercel Serverless Master Trigger',
    iconName: 'Zap',
    executionTime: '07:00 AM UTC-3',
    phase: 'Gatilho Inicial',
    mission: 'Despertar o enxame na nuvem diariamente às 07:00 sem depender de computador ligado.',
    inputs: ['Horário UTC (10:00 UTC)', 'CRON_SECRET Bearer Token'],
    outputs: ['Disparo do Master Autonomous Pipeline', 'Log de Execução no Supabase'],
    status: 'ONLINE',
    customTip: 'Sempre manter o agendamento fixo às 07:00 para entregar relatórios antes do horário comercial.'
  },
  {
    id: 'agent-2',
    number: '02',
    name: 'Orquestrador Executivo CEO',
    roleTitle: 'Chief Executive Orchestrator',
    iconName: 'Crown',
    executionTime: '07:01 AM UTC-3',
    phase: 'Cérebro Decisório',
    mission: 'Avaliar todas as propostas dos agentes com a Matriz ICE Score (Impact, Confidence, Ease >= 8.0) e planejar as Sprints.',
    inputs: ['Propostas de CRO', 'Evidências de perda financeira', 'Histórico de Faturamento'],
    outputs: ['Sprint 48h Quick Wins', 'Sprint 7d Expansão', 'Sprint 30d Escala'],
    status: 'ONLINE',
    customTip: 'Somente aprovar intervenções com ICE Score >= 8.0 para garantir foco em ações de alto ROI.'
  },
  {
    id: 'agent-3',
    number: '03',
    name: 'Caçador de Mercado & Leads',
    roleTitle: 'Market Hunter & Lead Scout',
    iconName: 'Compass',
    executionTime: '07:02 AM UTC-3',
    phase: 'Prospecção & Inteligência',
    mission: 'Varrer anúncios ativos no Meta Ads, Google Shopping e mapear tendências de conversão.',
    inputs: ['Biblioteca de Anúncios Meta', 'Google Trends', 'Taxas de Mercado'],
    outputs: ['Lista de Lojas Prospecto', 'Dossiê de Tendências CRO 2026'],
    status: 'ONLINE',
    customTip: 'Focar em e-commerces que estão investindo mais de R$ 5.000/mês em anúncios pagos.'
  },
  {
    id: 'agent-4',
    number: '04',
    name: 'Reconhecedor Universal de Nicho',
    roleTitle: 'Universal E-Commerce Taxonomy',
    iconName: 'Globe',
    executionTime: '07:03 AM UTC-3',
    phase: 'Reconhecimento de Campo',
    mission: 'Classificar a loja em 1 dos 10 macro-segmentos e adaptar as regras de auditoria para Zero Falsos-Positivos.',
    inputs: ['HTML / DOM', 'Meta Tags', 'Categorias da Navegação', 'Títulos de Produtos'],
    outputs: ['Classificação do Nicho (Moda, Autopeças, etc.)', 'Matriz de Variantes Adaptadas'],
    status: 'ONLINE',
    customTip: 'Não auditar grade PP-G2 em autopeças ou eletrônicos; aplicar regras de voltagem e compatibilidade.'
  },
  {
    id: 'agent-5',
    number: '05',
    name: 'Doutor de Catálogo & Ruptura',
    roleTitle: 'Catalog Integrity & Size Auditor',
    iconName: 'Layers',
    executionTime: '07:04 AM UTC-3',
    phase: 'Auditoria de Produto',
    mission: 'Inspecionar a disponibilidade de tamanhos (PP ao G2), regras _FULL, peso de imagens e tabela de medidas.',
    inputs: ['/products.json da loja', 'DOM da Página de Produto', 'Grades de Estoque'],
    outputs: ['Lista de SKUs com Grade Furada', 'Cálculo de Perda Mensal de Tráfego'],
    status: 'ONLINE',
    customTip: 'Identificar se o produto tem widget <product-addons> antes de alertar ausência de tabela de medidas.'
  },
  {
    id: 'agent-6',
    number: '06',
    name: 'Cruzamento SKUs vs Carrinhos',
    roleTitle: 'SKU Cart Abandonment Cross-Auditor',
    iconName: 'GitCompare',
    executionTime: '07:05 AM UTC-3',
    phase: 'Atribuição de Causa-Raiz',
    mission: 'Cruzar tamanhos sem estoque com carrinhos abandonados e gerar links canônicos 100% verificados (Zero 404).',
    inputs: ['Variantes Selecionadas no Checkout', 'Estoque por Tamanho', 'URLs dos Produtos'],
    outputs: ['Taxa de Atribuição por Grade Furada (~54%)', 'Deep Links Canônicos com Variante'],
    status: 'ONLINE',
    customTip: 'Garantir que todos os links gerados nas mensagens levem direto para o produto sem redirecionamentos.'
  },
  {
    id: 'agent-7',
    number: '07',
    name: 'Engenheiro Core Web Vitals',
    roleTitle: 'Core Web Vitals 2026 Engineer',
    iconName: 'Gauge',
    executionTime: '07:06 AM UTC-3',
    phase: 'Performance Técnica',
    mission: 'Medir LCP (< 2.5s), CLS (< 0.1) e INP (< 200ms) sob simulação mobile 4G throttled.',
    inputs: ['Network Headers', 'DOM Render Time', 'Scripts Terceiros no <head>'],
    outputs: ['Score de Velocidade Mobile', 'Diagnóstico de Imagens Pesadas (> 350KB)'],
    status: 'ONLINE',
    customTip: 'Recomendar compressão WebP/AVIF para todas as imagens de banners hero da loja.'
  },
  {
    id: 'agent-8',
    number: '08',
    name: 'Engenheiro de Visão & Heatmap',
    roleTitle: 'Vision & Ergonomics Engineer',
    iconName: 'Eye',
    executionTime: '07:07 AM UTC-3',
    phase: 'Ergonomia & Design',
    mission: 'Inspecionar contraste de cores WCAG 2.1 AAA, área de polegar mobile e mapa de calor dos primeiros 2.500ms.',
    inputs: ['Paleta de Cores do Botão CTA', 'Layout Mobile', 'Saliência Visual'],
    outputs: ['Índice de Contraste Luminoso', 'Score de Ergonomia Mobile'],
    status: 'ONLINE',
    customTip: 'Garantir que o botão "Comprar Agora" esteja sempre na Thumb Zone (zona de fácil alcance).'
  },
  {
    id: 'agent-9',
    number: '09',
    name: 'Simulador Pix & Elasticidade',
    roleTitle: 'Pricing & Margin Simulator',
    iconName: 'Calculator',
    executionTime: '07:08 AM UTC-3',
    phase: 'Margem & Checkout',
    mission: 'Calcular a margem real de desconto no Pix vs Cartão de Crédito e simular aumento de conversão.',
    inputs: ['Taxas de Gateway (Cartão 3.5% vs Pix 0.99%)', 'Ticket Médio da Loja'],
    outputs: ['Desconto Ideal no Pix (3% a 7%)', 'Projeção de Lucro Líquido Adicional'],
    status: 'ONLINE',
    customTip: 'Destacar para o lojista o ganho de fluxo de caixa imediato proporcionado pelo Pix.'
  },
  {
    id: 'agent-10',
    number: '10',
    name: 'Vigia WhatsApp & Concierge 24h',
    roleTitle: 'WhatsApp Watchdog & Generative Concierge',
    iconName: 'Phone',
    executionTime: '07:10 AM & 24h Online',
    phase: 'Comunicação & Vendas',
    mission: 'Disparar alertas matinais executivos no WhatsApp do lojista e atender visitantes 24h no site.',
    inputs: ['Fila alert_dispatch_queue do Supabase', 'Perguntas Aleatórias no Chat'],
    outputs: ['Mensagens no WhatsApp com Relatório', 'Captura de Leads e Fechamento de Planos'],
    status: 'ONLINE',
    customTip: 'Sempre incluir o valor financeiro em risco no primeiro parágrafo da mensagem do WhatsApp.'
  }
];

export const AutonomousAgentFlowchartView: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-2');
  const [pipelineData, setPipelineData] = useState<AgentNodeInfo[]>(AGENTS_PIPELINE);
  const [editTipText, setEditTipText] = useState<string>('');
  const [isEditingTip, setIsEditingTip] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const selectedAgent = pipelineData.find(a => a.id === selectedAgentId) || pipelineData[0];

  const handleSelectAgent = (agent: AgentNodeInfo) => {
    setSelectedAgentId(agent.id);
    setEditTipText(agent.customTip);
    setIsEditingTip(false);
    setSaveSuccess(false);
  };

  const handleSaveTip = () => {
    setPipelineData(prev => prev.map(a => a.id === selectedAgentId ? { ...a, customTip: editTipText } : a));
    setIsEditingTip(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Crown': return <Crown className="w-5 h-5" />;
      case 'Compass': return <Compass className="w-5 h-5" />;
      case 'Globe': return <Globe className="w-5 h-5" />;
      case 'Layers': return <Layers className="w-5 h-5" />;
      case 'GitCompare': return <GitCompare className="w-5 h-5" />;
      case 'Gauge': return <Gauge className="w-5 h-5" />;
      case 'Eye': return <Eye className="w-5 h-5" />;
      case 'Calculator': return <Calculator className="w-5 h-5" />;
      default: return <Phone className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-900 to-slate-950 rounded-2xl text-indigo-400 shadow-md shadow-indigo-950/30 border border-indigo-800">
            <Cpu className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Fluxograma Visual do Enxame de Agentes 24/7</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                10 Agentes Conectados & Sincronizados
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Visualize o fluxo completo de execução autônoma na nuvem. Clique em qualquer agente para ver seus dados de entrada, entregáveis e **personalizar as diretivas do fundador**!
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Ciclo de Execução</span>
          <span className="text-sm font-black text-indigo-600 font-mono block">07:00 AM Diário + 24h Realtime</span>
          <span className="text-[10px] text-emerald-600 font-mono font-bold">100% Autônomo na Vercel</span>
        </div>
      </div>

      {/* Main Flowchart Grid: 2 Columns (Flow on Left, Inspector on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Visual Agent Pipeline Flow (8 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider block">
            Sequência do Pipeline Autônomo (Clique para Inspecionar):
          </span>

          <div className="space-y-2.5">
            {pipelineData.map((agent, index) => {
              const isSelected = selectedAgentId === agent.id;

              return (
                <React.Fragment key={agent.id}>
                  <button
                    onClick={() => handleSelectAgent(agent)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/30 scale-[1.01]'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className={`font-mono font-black text-xs px-2.5 py-1 rounded-xl ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600'
                      }`}>
                        {agent.number}
                      </span>

                      <div className={`p-2.5 rounded-xl ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'
                      }`}>
                        {renderIcon(agent.iconName)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm leading-tight">{agent.name}</h4>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                            isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-emerald-50 text-emerald-800'
                          }`}>
                            {agent.status}
                          </span>
                        </div>
                        <p className={`text-[11px] font-mono mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {agent.roleTitle} • <span className="font-semibold">{agent.executionTime}</span>
                        </p>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'translate-x-1 text-white' : 'text-slate-300'
                    }`} />
                  </button>

                  {/* Flow Connector Arrow between nodes */}
                  {index < pipelineData.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <div className="w-0.5 h-3 bg-indigo-200"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Agent Inspector & Founder Directive Editor (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider block">
            Painel de Inspeção & Diretivas do Agente:
          </span>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-6">
            
            {/* Inspector Header */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                {renderIcon(selectedAgent.iconName)}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">
                  Agente #{selectedAgent.number} • {selectedAgent.phase}
                </span>
                <h3 className="font-black text-slate-900 text-lg leading-tight">{selectedAgent.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedAgent.roleTitle}</p>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 uppercase font-mono text-[10px] block">
                Missão Principal:
              </span>
              <p className="text-slate-700 leading-relaxed font-sans bg-slate-50 p-3 rounded-2xl border border-slate-200">
                {selectedAgent.mission}
              </p>
            </div>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 font-mono uppercase block">Dados de Entrada (Inputs):</span>
                <ul className="space-y-1">
                  {selectedAgent.inputs.map((inp, idx) => (
                    <li key={idx} className="text-[11px] text-slate-700 font-medium flex items-start gap-1">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-1.5 text-indigo-950">
                <span className="text-[9px] font-bold text-indigo-600 font-mono uppercase block">Entregáveis (Outputs):</span>
                <ul className="space-y-1">
                  {selectedAgent.outputs.map((out, idx) => (
                    <li key={idx} className="text-[11px] text-indigo-900 font-medium flex items-start gap-1">
                      <span className="text-indigo-600 font-bold">✓</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Founder Directive & Tip Editor */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>DIRETIVA DO FUNDADOR (DICA DO CHEFE):</span>
                </div>

                {!isEditingTip ? (
                  <button
                    onClick={() => { setIsEditingTip(true); setEditTipText(selectedAgent.customTip); }}
                    className="p-1 hover:bg-amber-200/60 rounded-lg text-amber-800 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveTip}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3 h-3" />
                    <span>Salvar</span>
                  </button>
                )}
              </div>

              {!isEditingTip ? (
                <p className="text-xs text-amber-900 leading-relaxed font-sans font-medium italic">
                  "{selectedAgent.customTip}"
                </p>
              ) : (
                <textarea
                  value={editTipText}
                  onChange={(e) => setEditTipText(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 text-xs bg-white border border-amber-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans text-slate-800"
                  placeholder="Digite sua dica ou regra para este agente..."
                />
              )}

              {saveSuccess && (
                <span className="text-[11px] font-mono font-bold text-emerald-700 block text-center">
                  ✅ Diretiva salva e transmitida para o agente!
                </span>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
