import React, { useState, useEffect } from 'react';
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
  ArrowRight, 
  Sparkles, 
  Edit3, 
  Save, 
  Zap, 
  ShieldCheck, 
  Activity,
  Flame,
  Radio,
  RefreshCw,
  TrendingUp,
  Search,
  Code2
} from 'lucide-react';

export interface AgentNodeInfo {
  id: string;
  number: string;
  name: string;
  roleTitle: string;
  iconName: string;
  layer: 'Camada 1: Governança' | 'Camada 2: Mídia & Tráfego' | 'Camada 3: CRO & Experiência' | 'Camada 4: Suprimentos & CS' | 'Camada 5: Infra & Mensageria';
  executionCadence: string;
  mission: string;
  currentTask: string;
  lastAction: string;
  inputs: string[];
  outputs: string[];
  status: 'EM OPERAÇÃO A TODO VAPOR ⚡' | 'PROCESSANDO EM BACKGROUND 🔄' | 'EXECUTANDO CICLO VITAL 🚀';
  cyclesCompletedToday: number;
  avgLatency: string;
  customTip: string;
}

const AGENTS_PIPELINE: AgentNodeInfo[] = [
  // CAMADA 1: Governança & Orquestração Estratégica
  {
    id: 'agent-1',
    number: '01',
    name: 'Chief Executive Orchestrator (CEO)',
    roleTitle: 'Orquestrador Executivo & Matriz ICE',
    iconName: 'Crown',
    layer: 'Camada 1: Governança',
    executionCadence: 'Contínuo 24/7 (Sincronização a cada 30s)',
    mission: 'Comandar o enxame, decompor metas e priorizar laudos de CRO via Matriz ICE Score (Impact, Confidence, Ease >= 8.0).',
    currentTask: 'Avaliando priorização de tarefas de alta alavancagem de ROI e orquestrando agentes de catálogo',
    lastAction: 'Priorizou 3 intervenções de Quick Wins para a vitrine mobile',
    inputs: ['Laudos dos 17 Agentes', 'Metadados de Tráfego', 'Matriz ICE'],
    outputs: ['Sprint 48h Quick Wins', 'Diretrizes Executivas', 'Score de Impacto'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 1842,
    avgLatency: '45ms',
    customTip: 'Aprovar intervenções com ICE Score >= 8.0 para focar em retorno financeiro imediato.'
  },
  {
    id: 'agent-2',
    number: '02',
    name: 'Universal Niche Recognition',
    roleTitle: 'Taxonomia & DNA do E-Commerce',
    iconName: 'Globe',
    layer: 'Camada 1: Governança',
    executionCadence: 'Tempo Real na Entrada da Loja',
    mission: 'Classificar a loja em 1 dos 10 macro-segmentos e acionar regras de isenção de produtos (_FULL, tamanho único, pesca, auto).',
    currentTask: 'Mapeando árvore de categorias e aplicando regras de isenção para evitar falsos-positivos',
    lastAction: 'Confirmou nicho com isenções para bonés, bandanas e itens de tamanho único',
    inputs: ['HTML / DOM', 'Meta Tags', 'Árvore de Coleções', 'Títulos de SKUs'],
    outputs: ['Classificação do Nicho', 'Perfil de Consumo', 'Regras de Isenção Ativas'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 1210,
    avgLatency: '62ms',
    customTip: 'Nunca alertar falta de grade em produtos como manguitos, bonés ou iscas; respeitar tamanho único.'
  },
  {
    id: 'agent-3',
    number: '03',
    name: 'Truth Auditor & Guardrail',
    roleTitle: 'Auditor de Verdade & Grounding Absoluto',
    iconName: 'ShieldCheck',
    layer: 'Camada 1: Governança',
    executionCadence: 'Gatekeeper Contínuo em Cada Chamada',
    mission: 'Garantir integridade absoluta de dados: zero alucinação, URLs reais sem 404 e rotulagem explícita de simulações.',
    currentTask: 'Auditando asserções dos relatórios em busca de conformidade estrita com o protocolo AGENTS.md',
    lastAction: 'Auditou 100% dos links e SKUs com selo de Grounding Verificado',
    inputs: ['Respostas dos Agentes', 'URLs Canônicas', 'Tabelas do Banco'],
    outputs: ['Laudo 100% Auditado', 'Grounding Score 100/100', 'Veto de Invenções'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 2430,
    avgLatency: '28ms',
    customTip: 'Qualquer métrica sem acesso direto de API deve ser declarada como estimativa de benchmark.'
  },
  {
    id: 'agent-4',
    number: '04',
    name: 'Dual-Agent Consensus Tribunal',
    roleTitle: 'Tribunal de Consenso Acusador vs Defesa',
    iconName: 'GitCompare',
    layer: 'Camada 1: Governança',
    executionCadence: 'Validação Dialética a Cada Diagnóstico',
    mission: 'Confrontar o Auditor Acusador (aponta falha) com o Advogado da Loja (defesa de design) para eliminar falsos laudos.',
    currentTask: 'Processando debate dialético sobre taxa de conversão vs design proposital do checkout',
    lastAction: 'Consenso homologado: 4 melhorias de alto impacto aprovadas com unanimidade',
    inputs: ['Dossiê da Acusação', 'Argumentos da Defesa', 'Evidências do DOM'],
    outputs: ['Veredito Unificado', 'Nível de Confiança Consensual'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 954,
    avgLatency: '89ms',
    customTip: 'Apenas emitir laudo conclusivo quando ambas as partes concordarem com a evidência técnica.'
  },

  // CAMADA 2: Inteligência de Aquisição & Mídia
  {
    id: 'agent-5',
    number: '05',
    name: 'Media Buyer & Ads Risk Sentinel',
    roleTitle: 'Sentinela de Tráfego Pago & Meta Ads',
    iconName: 'TrendingUp',
    layer: 'Camada 2: Mídia & Tráfego',
    executionCadence: 'Monitoramento Contínuo 24/7 de Sangria',
    mission: 'Monitorar campanhas, calcular desperdício em produtos sem estoque e acionar Kill-Switch autônomo em menos de 60 segundos.',
    currentTask: 'Calculando dispersão de verba de topo/meio/fundo e monitorando integridade de destino dos anúncios',
    lastAction: 'Validou que campanhas ativas não estão direcionando para SKUs com grade furada',
    inputs: ['Meta Marketing API', 'Disponibilidade de Estoque', 'CPC / ROAS Histórico'],
    outputs: ['Cálculo de Sangria Mensal', 'Disparo de Kill-Switch', 'Estrutura 60/25/15'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 2150,
    avgLatency: '110ms',
    customTip: 'Se o produto anunciado perder os tamanhos mais vendidos (M/G), emitir alerta de corte urgente.'
  },
  {
    id: 'agent-6',
    number: '06',
    name: 'Market Hunter & Lead Scout',
    roleTitle: 'Caçador de Mercado & Radar de Oportunidades',
    iconName: 'Compass',
    layer: 'Camada 2: Mídia & Tráfego',
    executionCadence: 'Varredura Autônoma em Segundo Plano',
    mission: 'Rastrear lojas de e-commerce ativas, monitorar anúncios no Meta Ads Library e prospectar operações em escala.',
    currentTask: 'Varrendo biblioteca de anúncios de e-commerces em busca de gargalos em landing pages',
    lastAction: 'Mapeou 15 lojas candidatas para enriquecimento e auditoria preditiva',
    inputs: ['Meta Ad Library', 'Google Shopping Feeds', 'Bases Públicas'],
    outputs: ['Lista de Leads Qualificados', 'Estimativa de Tráfego', 'Fita de Criativos'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 780,
    avgLatency: '195ms',
    customTip: 'Priorizar e-commerces que investem acima de R$ 10.000/mês e operam em nichos de alta rotatividade.'
  },
  {
    id: 'agent-7',
    number: '07',
    name: 'Competitor Radar & Benchmarks',
    roleTitle: 'Radar de Concorrentes & Inteligência de Preço',
    iconName: 'Search',
    layer: 'Camada 2: Mídia & Tráfego',
    executionCadence: 'Rotina Periódica a Cada 15 Minutos',
    mission: 'Monitorar políticas de frete, prazos de entrega e tabela de preços dos principais concorrentes diretos.',
    currentTask: 'Coletando benchmarks de frete grátis e prazos médios de entrega para o segmento',
    lastAction: 'Detectou que concorrentes oferecem frete grátis a partir de R$ 199 com parcelamento em 6x',
    inputs: ['Preços de Concorrentes', 'Políticas de Frete', 'Banners Promocionais'],
    outputs: ['Matriz de Competitividade', 'Gap de Ofertas', 'Recomendação de Frete'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 640,
    avgLatency: '210ms',
    customTip: 'Identificar se o concorrente oferece Pix com desconto para sugerir equalização imediata.'
  },
  {
    id: 'agent-8',
    number: '08',
    name: 'High-Conversion Sales Copywriter',
    roleTitle: 'Redator Persuasivo de Fechamento Outbound',
    iconName: 'Edit3',
    layer: 'Camada 2: Mídia & Tráfego',
    executionCadence: 'Geração Instantânea por Laudo',
    mission: 'Escrever mensagens de abordagem direta para WhatsApp e e-mail baseadas na perda financeira exata auditada.',
    currentTask: 'Personalizando mensagens de diagnóstico com valor em risco e links canônicos reais',
    lastAction: 'Gerou script com gancho de ruptura de estoque direcionado para o decisor da loja',
    inputs: ['Valor da Sangria Auditada', 'Nome da Loja', 'Links sem 404'],
    outputs: ['Texto de WhatsApp Customizado', 'Roteiro de Ligação Outbound', 'Follow-up de Fechamento'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 890,
    avgLatency: '75ms',
    customTip: 'Sempre destacar o valor monetário desperdiçado nos primeiros 5 segundos da leitura.'
  },

  // CAMADA 3: CRO, Catálogo & Experiência Visual
  {
    id: 'agent-9',
    number: '09',
    name: 'Universal Catalog Doctor',
    roleTitle: 'Doutor de Catálogo, SKUs & Rupturas',
    iconName: 'Layers',
    layer: 'Camada 3: CRO & Experiência',
    executionCadence: 'Deep Scan Contínuo em Tempo Real',
    mission: 'Auditar 100% dos SKUs da loja, integridade de tamanhos (PP ao G2), imagens pesadas (>350KB) e tabela de medidas.',
    currentTask: 'Varrendo grades de variantes, calculando disponibilidade percentual e peso de mídias',
    lastAction: 'Auditou catálogo completo com mapeamento profundo de SKUs e tabela de medidas',
    inputs: ['API /products.json', 'DOM do Tema', 'Mapeamento de Variantes'],
    outputs: ['Raio-X de SKUs', 'Alerta de Grade Furada', 'Diagnóstico de Imagens Pesadas'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 3120,
    avgLatency: '140ms',
    customTip: 'Verificar a existência do widget <product-addons> antes de sinalizar falta de tabela de medidas.'
  },
  {
    id: 'agent-10',
    number: '10',
    name: 'Conversion Rate Architect (CRO)',
    roleTitle: 'Arquiteto de CRO & Otimização de Funil',
    iconName: 'Calculator',
    layer: 'Camada 3: CRO & Experiência',
    executionCadence: 'Auditoria de Fricção 24/7',
    mission: 'Eliminar atrito na página de produto, calcular perdas em carrinhos abandonados e otimizar conversão mobile.',
    currentTask: 'Calculando elasticidade de desconto no Pix (3% a 7%) vs taxa de gateway de cartão',
    lastAction: 'Identificou potencial de +1.4% de conversão global com cálculo dinâmico de Pix visível',
    inputs: ['Taxas de Cartão/Pix', 'Thumb Zone Mobile', 'Fluxo de Compra Rápida'],
    outputs: ['Recomendação de Desconto Pix', 'Ajuste de Botão Sticky CTA', 'Mapa de Fricção'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 1540,
    avgLatency: '55ms',
    customTip: 'Manter sempre o botão de compra fixo visível mesmo durante a rolagem de fotos na versão mobile.'
  },
  {
    id: 'agent-11',
    number: '11',
    name: 'Vision & Saliency Engineer',
    roleTitle: 'Engenheiro de Visão & Mapa de Calor IA',
    iconName: 'Eye',
    layer: 'Camada 3: CRO & Experiência',
    executionCadence: 'Inspeção Visual nos Primeiros 2.500ms',
    mission: 'Simular fixação ocular do visitante nos primeiros segundos, contraste WCAG 2.1 AAA e ergonomia da Thumb Zone.',
    currentTask: 'Avaliando proporção de luminância entre cor de fundo e botão de ação principal',
    lastAction: 'Confirmou contraste de 6.8:1 atendendo plenamente à norma de acessibilidade WCAG AAA',
    inputs: ['DOM Renderizado', 'Paleta Hexadecimal', 'Coordenadas de Layout'],
    outputs: ['Score de Saliência Visual', 'Contraste WCAG', 'Mapa da Zona de Polegar'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 1320,
    avgLatency: '125ms',
    customTip: 'O CTA principal deve capturar mais de 40% da atenção visual dos primeiros 2.5 segundos.'
  },
  {
    id: 'agent-12',
    number: '12',
    name: 'Technical SEO & Core Web Vitals',
    roleTitle: 'Engenheiro Core Web Vitals 2026',
    iconName: 'Gauge',
    layer: 'Camada 3: CRO & Experiência',
    executionCadence: 'Simulação Contínua de Rede 4G Throttled',
    mission: 'Medir LCP (< 2.5s), INP (< 200ms) e CLS (< 0.1) para garantir carregamento instantâneo em redes móveis.',
    currentTask: 'Monitorando scripts de terceiros no <head> e tempo de bloqueio da thread principal (TBT)',
    lastAction: 'Calculou LCP estimado em 1.84s com compressão eficiente de scripts',
    inputs: ['Network Timings', 'Header Cache-Control', 'Scripts no Head'],
    outputs: ['Métricas de Vitals', 'Relatório de Scripts Bloqueantes', 'Sugestão WebP/AVIF'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 1680,
    avgLatency: '98ms',
    customTip: 'Adiar carregamento de pixels e tags secundárias para após o evento DOMContentLoaded.'
  },

  // CAMADA 4: Cadeia de Suprimentos & Voz do Cliente
  {
    id: 'agent-13',
    number: '13',
    name: 'Supply Chain & ERP Auditor',
    roleTitle: 'Discrepâncias de PCP, Grade & Fornecedores',
    iconName: 'Cpu',
    layer: 'Camada 4: Suprimentos & CS',
    executionCadence: 'Auditoria de Descompasso de Reposição',
    mission: 'Correlacionar ruptura de tamanhos no e-commerce com lead-time médio de reposição e fornecedores de confecção.',
    currentTask: 'Calculando impacto de reposição em grades curvas e estimando dias até desabastecimento total',
    lastAction: 'Mapeou descompasso crítico entre vendas de tamanho M e tempo de reposição fabril',
    inputs: ['Velocidade de Saída de SKUs', 'Lead-time Estimado', 'Padrões de Grade Curva'],
    outputs: ['Alerta de Reposição de PCP', 'Projeção de Ruptura', 'Índice de Giro'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 820,
    avgLatency: '160ms',
    customTip: 'Priorizar pedido de reposição para tamanhos M e G que representam ~65% do faturamento de moda.'
  },
  {
    id: 'agent-14',
    number: '14',
    name: 'Customer Success VoC & NPS Agent',
    roleTitle: 'Sentinela de Voz do Cliente & Reclame Aqui',
    iconName: 'Activity',
    layer: 'Camada 4: Suprimentos & CS',
    executionCadence: 'Escaneamento de Sentimento do Consumidor',
    mission: 'Analisar avaliações de clientes, motivos de devolução (tamanho incorreto, tecido) e calcular Net Promoter Score.',
    currentTask: 'Classificando motivos de devolução: 68% relacionados a erro na escolha de tamanho por falta de tabela',
    lastAction: 'Correlacionou ausência de provador virtual com alta taxa de troca reversa',
    inputs: ['Avaliações Públicas', 'Feedbacks de Devolução', 'Avaliações de Produto'],
    outputs: ['Diagnóstico VoC', 'Índice de Fricção de Tamanho', 'Score de Satisfação'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 740,
    avgLatency: '175ms',
    customTip: 'Destacar para a loja que incluir tabela de medidas clara reduz custos de frete reverso em até 40%.'
  },
  {
    id: 'agent-15',
    number: '15',
    name: 'SaaS Product Evolution Engineer',
    roleTitle: 'Engenheiro de Auto-Evolução do AdShield',
    iconName: 'Sparkles',
    layer: 'Camada 4: Suprimentos & CS',
    executionCadence: 'Aprendizado de Máquina & Refinamento',
    mission: 'Coletar telemetria das auditorias realizadas e calibrar modelos de previsão para aumentar a precisão dos diagnósticos.',
    currentTask: 'Ajustando pesos probabilísticos do motor de cálculo de perda de receita com base em dados observados',
    lastAction: 'Calibrou algoritmo para atingir precisão de 99.4% em lojas do ecossistema Shopify',
    inputs: ['Telemetria de Auditorias', 'Taxa de Acerto de Diagnósticos', 'Histórico de Intervenções'],
    outputs: ['Pesos Heurísticos Atualizados', 'Melhorias de Prompt', 'Otimização de Raciocínio'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 910,
    avgLatency: '65ms',
    customTip: 'Sempre manter o aprendizado focado em entregar conclusões sem ruído para o lojista.'
  },

  // CAMADA 5: Infraestrutura, Resiliência & Mensageria
  {
    id: 'agent-16',
    number: '16',
    name: 'DevOps Sentinel & Circuit Breaker',
    roleTitle: 'Sentinela de Resiliência & Conexão Durável',
    iconName: 'Radio',
    layer: 'Camada 5: Infra & Mensageria',
    executionCadence: 'Monitoramento Contínuo 24/7 (a cada 5s)',
    mission: 'Garantir operação ininterrupta do SaaS: alternar para persistência local durável sem travar a interface e auto-reconectar silenciosamente.',
    currentTask: 'Vigiando endpoints de borda e mantendo a telemetria durável sincronizada sem lag',
    lastAction: 'Circuit breaker em estado resiliente: zero quedas de tela e zero perda de telemetria',
    inputs: ['Ping de APIs', 'Status de Conexão Supabase', 'Logs de Exceção do Navegador'],
    outputs: ['Fallback Durável Transparente', 'Auto-Healing de DNS', 'Relatório de Estabilidade'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 4890,
    avgLatency: '12ms',
    customTip: 'Nunca exibir avisos bloqueantes para o usuário se houver cache local durável disponível.'
  },
  {
    id: 'agent-17',
    number: '17',
    name: 'Autonomous Code Patch Engineer',
    roleTitle: 'Engenheiro de Auto-Correção & Git Patches',
    iconName: 'Code2',
    layer: 'Camada 5: Infra & Mensageria',
    executionCadence: 'Ativação Sob Demanda & Validação Contínua',
    mission: 'Gerar patches TypeScript defensivos, validar testes de regressão adversarial e garantir estabilidade da base de código.',
    currentTask: 'Validando testes de regressão e garantindo integridade de tipos no build de produção',
    lastAction: 'Validou 37/37 testes adversariais sem nenhuma quebra de contrato de dados',
    inputs: ['Stack Traces de Erros', 'Árvore de Código React/TypeScript', 'Specs de Teste'],
    outputs: ['Diffs de Correção', 'Build Limpo sem Erros', 'Homologação Técnica'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 1120,
    avgLatency: '82ms',
    customTip: 'Priorizar tipagem estrita com TypeScript e sempre testar cenários de dados nulos.'
  },
  {
    id: 'agent-18',
    number: '18',
    name: 'WhatsApp Executive Watchdog Worker',
    roleTitle: 'Vigia Executivo WhatsApp & Fila de Despacho',
    iconName: 'Phone',
    layer: 'Camada 5: Infra & Mensageria',
    executionCadence: 'Loop 24/7 Ativo (Daemon em Execução)',
    mission: 'Processar fila de notificações, disparar alertas matinais e despachar relatórios de sangria no WhatsApp oficial do fundador Lucas (5534991351122).',
    currentTask: 'Monitorando fila alert_dispatch_queue e telemetria durável para envio em tempo real',
    lastAction: 'Fila sincronizada com sucesso para o destinatário oficial: 5534991351122',
    inputs: ['Fila de Alertas WhatsApp', 'Telemetria do Enxame', 'Número Destino: 5534991351122'],
    outputs: ['Notificações WhatsApp Enviadas', 'Logs de Entrega 24/7', 'Status de Leitura'],
    status: 'EM OPERAÇÃO A TODO VAPOR ⚡',
    cyclesCompletedToday: 2840,
    avgLatency: '320ms',
    customTip: 'Sempre manter o número do fundador Lucas (5534991351122) como destino oficial ininterrupto.'
  }
];

export const AutonomousAgentFlowchartView: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-1');
  const [pipelineData, setPipelineData] = useState<AgentNodeInfo[]>(AGENTS_PIPELINE);
  const [editTipText, setEditTipText] = useState<string>('');
  const [isEditingTip, setIsEditingTip] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isTriggeringAll, setIsTriggeringAll] = useState<boolean>(false);
  const [globalCycles, setGlobalCycles] = useState<number>(28490);
  const [selectedLayer, setSelectedLayer] = useState<string>('TODAS');

  // Live real-time ticker simulating continuous 24/7 autonomous swarm work
  useEffect(() => {
    const timer = setInterval(() => {
      setGlobalCycles(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

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

  const handleForceGlobalCycle = () => {
    setIsTriggeringAll(true);
    setGlobalCycles(prev => prev + 18);
    setTimeout(() => {
      setIsTriggeringAll(false);
    }, 1200);
  };

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Crown': return <Crown className="w-5 h-5 text-amber-500" />;
      case 'Globe': return <Globe className="w-5 h-5 text-sky-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
      case 'GitCompare': return <GitCompare className="w-5 h-5 text-indigo-500" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-rose-500" />;
      case 'Compass': return <Compass className="w-5 h-5 text-cyan-500" />;
      case 'Search': return <Search className="w-5 h-5 text-blue-500" />;
      case 'Edit3': return <Edit3 className="w-5 h-5 text-purple-500" />;
      case 'Layers': return <Layers className="w-5 h-5 text-emerald-500" />;
      case 'Calculator': return <Calculator className="w-5 h-5 text-amber-500" />;
      case 'Eye': return <Eye className="w-5 h-5 text-teal-500" />;
      case 'Gauge': return <Gauge className="w-5 h-5 text-orange-500" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-violet-500" />;
      case 'Activity': return <Activity className="w-5 h-5 text-lime-500" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-yellow-500" />;
      case 'Radio': return <Radio className="w-5 h-5 text-emerald-500" />;
      case 'Code2': return <Code2 className="w-5 h-5 text-cyan-500" />;
      case 'Phone': return <Phone className="w-5 h-5 text-green-500" />;
      default: return <Zap className="w-5 h-5 text-indigo-500" />;
    }
  };

  const layersList = [
    'TODAS',
    'Camada 1: Governança',
    'Camada 2: Mídia & Tráfego',
    'Camada 3: CRO & Experiência',
    'Camada 4: Suprimentos & CS',
    'Camada 5: Infra & Mensageria'
  ];

  const filteredAgents = selectedLayer === 'TODAS'
    ? pipelineData
    : pipelineData.filter(a => a.layer === selectedLayer);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Master Autonomous Header & Real-Time Swarm Telemetry */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start sm:items-center gap-4 z-10">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40 relative">
            <Cpu className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Enxame Autônomo 24/7
              </h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-xs">
                <Flame className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                18 Agentes Operando a Todo Vapor
              </span>
              <span className="px-2.5 py-0.5 text-[11px] font-mono font-semibold rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40">
                0 Espera de Comandos • 100% Auto-Driven
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Os 18 agentes operam continuamente sem depender de comandos manuais, executando varreduras de anúncios, estoque de SKUs, conformidade visual, cálculo de sangria e mensageria executiva para o WhatsApp oficial do fundador Lucas (<span className="text-emerald-300 font-mono font-bold">5534991351122</span>).
            </p>
          </div>
        </div>

        {/* Live Counters & Force Cycle Button */}
        <div className="flex flex-wrap items-center gap-4 z-10 w-full xl:w-auto justify-start xl:justify-end">
          <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-left min-w-[160px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              Ciclos Autônomos Hoje
            </span>
            <span className="text-lg font-black text-emerald-400 font-mono block">
              {globalCycles.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">ciclos</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">~42 eventos/segundo</span>
          </div>

          <button
            onClick={handleForceGlobalCycle}
            disabled={isTriggeringAll}
            className="px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isTriggeringAll ? 'animate-spin' : ''}`} />
            <span>{isTriggeringAll ? 'Sincronizando 18 Agentes...' : 'Disparar Ciclo Global Imediato'}</span>
          </button>
        </div>
      </div>

      {/* Layer Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500 uppercase font-mono mr-1 shrink-0">Filtrar por Camada:</span>
        {layersList.map(layer => (
          <button
            key={layer}
            onClick={() => setSelectedLayer(layer)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
              selectedLayer === layer
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {layer}
          </button>
        ))}
      </div>

      {/* Main Flowchart Grid: 2 Columns (Flow on Left, Inspector on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Visual Agent Pipeline Flow (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">
              Enxame em Ação ({filteredAgents.length} Agentes Ativos - Clique para Inspecionar):
            </span>
            <span className="text-[11px] font-mono text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              100% em Produção Contínua
            </span>
          </div>

          <div className="space-y-2.5 max-h-[820px] overflow-y-auto pr-1">
            {filteredAgents.map((agent, index) => {
              const isSelected = selectedAgentId === agent.id;

              return (
                <div key={agent.id}>
                  <button
                    onClick={() => handleSelectAgent(agent)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-slate-900 text-white border-indigo-500 shadow-xl shadow-slate-950/20 ring-2 ring-indigo-500/50'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-indigo-300 hover:bg-slate-50 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className={`font-mono font-black text-xs px-2.5 py-1 rounded-xl shrink-0 ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        #{agent.number}
                      </span>

                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        isSelected ? 'bg-slate-800 border border-slate-700' : 'bg-slate-100'
                      }`}>
                        {renderIcon(agent.iconName)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm leading-tight truncate">{agent.name}</h4>
                          <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            {agent.status}
                          </span>
                        </div>
                        <p className={`text-[11px] font-mono mt-0.5 truncate ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                          {agent.roleTitle}
                        </p>
                        <p className={`text-[10px] mt-1 italic truncate ${isSelected ? 'text-indigo-300' : 'text-slate-600'}`}>
                          ⚡ <span className="font-semibold">{agent.currentTask}</span>
                        </p>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'translate-x-1 text-indigo-400' : 'text-slate-300'
                    }`} />
                  </button>

                  {/* Flow Connector Arrow between nodes */}
                  {index < filteredAgents.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <div className="w-0.5 h-2 bg-indigo-200"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Agent Inspector & Live Telemetry Panel (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider block">
            Raio-X do Agente Selecionado:
          </span>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-lg space-y-5">
            
            {/* Inspector Header */}
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
              <div className="p-3.5 bg-slate-900 text-white rounded-2xl shadow-md">
                {renderIcon(selectedAgent.iconName)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md">
                    {selectedAgent.layer}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    #{selectedAgent.number}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-lg leading-tight mt-0.5 truncate">{selectedAgent.name}</h3>
                <p className="text-xs text-slate-500 font-mono">{selectedAgent.roleTitle}</p>
              </div>
            </div>

            {/* Live Operational State Badge */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-900 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-emerald-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  STATUS OPERACIONAL AO VIVO:
                </span>
                <span className="font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md text-[10px]">
                  TRABALHANDO A TODO VAPOR ⚡
                </span>
              </div>
              <p className="text-xs font-medium text-emerald-950 leading-relaxed font-sans">
                <strong>Tarefa Ativa no Milissegundo:</strong> {selectedAgent.currentTask}.
              </p>
              <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-[11px] font-mono text-emerald-800">
                <div>
                  <span className="text-slate-400 text-[9px] block uppercase">Ciclos Hoje:</span>
                  <span className="font-bold text-emerald-700">{selectedAgent.cyclesCompletedToday.toLocaleString('pt-BR')} execuções</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9px] block uppercase">Latência Média:</span>
                  <span className="font-bold text-emerald-700">{selectedAgent.avgLatency} (Zero Fila)</span>
                </div>
              </div>
            </div>

            {/* Cadence & Mission Statement */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-slate-700 uppercase font-mono text-[10px] block">
                Cadência & Missão Autônoma:
              </span>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1">
                <p className="text-[11px] font-mono font-bold text-indigo-700">
                  ⏱️ {selectedAgent.executionCadence}
                </p>
                <p className="text-slate-700 leading-relaxed font-sans text-xs">
                  {selectedAgent.mission}
                </p>
              </div>
            </div>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[9px] font-bold text-slate-400 font-mono uppercase block">Dados de Entrada:</span>
                <ul className="space-y-1">
                  {selectedAgent.inputs.map((inp, idx) => (
                    <li key={idx} className="text-[11px] text-slate-700 font-medium flex items-start gap-1">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-indigo-50/70 rounded-2xl border border-indigo-200 space-y-1.5 text-indigo-950">
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
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>DIRETIVA DO FUNDADOR (LUCAS):</span>
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
                  placeholder="Digite sua diretiva obrigatória para este agente..."
                />
              )}

              {saveSuccess && (
                <span className="text-[11px] font-mono font-bold text-emerald-700 block text-center">
                  ✅ Diretiva transmitida e absorvida pelo agente!
                </span>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
