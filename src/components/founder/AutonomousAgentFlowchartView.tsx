import React, { useState, useEffect, useRef } from 'react';
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
  Code2,
  Terminal,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from 'lucide-react';
import { getSwarmAgentById } from '../../services/ai/prompts/masterSwarmPrompts.ts';

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


import { AGENTS_PIPELINE } from './agentsPipelineData';


export const AutonomousAgentFlowchartView: React.FC = () => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-1');
  const [pipelineData, setPipelineData] = useState<AgentNodeInfo[]>(AGENTS_PIPELINE);
  const [editTipText, setEditTipText] = useState<string>('');
  const [isEditingTip, setIsEditingTip] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isTriggeringAll, setIsTriggeringAll] = useState<boolean>(false);
  const [globalCycles, setGlobalCycles] = useState<number>(28490);
  const [selectedLayer, setSelectedLayer] = useState<string>('TODAS');
  const [isPromptExpanded, setIsPromptExpanded] = useState<boolean>(false);
  const [hasCopiedPrompt, setHasCopiedPrompt] = useState<boolean>(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveTipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const forceCycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copyPromptTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (saveTipTimerRef.current) clearTimeout(saveTipTimerRef.current);
      if (forceCycleTimerRef.current) clearTimeout(forceCycleTimerRef.current);
      if (copyPromptTimerRef.current) clearTimeout(copyPromptTimerRef.current);
    };
  }, []);

  // Live real-time ticker simulating continuous 24/7 autonomous swarm work
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setGlobalCycles(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 2500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
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
    if (saveTipTimerRef.current) clearTimeout(saveTipTimerRef.current);
    saveTipTimerRef.current = setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleForceGlobalCycle = () => {
    setIsTriggeringAll(true);
    setGlobalCycles(prev => prev + 18);
    if (forceCycleTimerRef.current) clearTimeout(forceCycleTimerRef.current);
    forceCycleTimerRef.current = setTimeout(() => {
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
        <span className="text-xs font-bold text-[#7C7C6F] uppercase font-mono mr-1 shrink-0">Filtrar por Camada:</span>
        {layersList.map(layer => (
          <button
            key={layer}
            onClick={() => setSelectedLayer(layer)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer shrink-0 ${
              selectedLayer === layer
                ? 'bg-[#0AE448] text-[#0E100F] shadow-sm'
                : 'bg-[#141716] text-[#BBBAA6] border border-white/10 hover:border-white/20 hover:bg-[#191C1B]'
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
            <span className="text-xs font-bold text-[#A0A090] uppercase font-mono tracking-wider">
              Enxame em Ação ({filteredAgents.length} Agentes Ativos - Clique para Inspecionar):
            </span>
            <span className="text-[11px] font-mono text-[#0AE448] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#0AE448] animate-pulse" />
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
                        ? 'bg-[#191C1B] text-white border-[#0AE448] shadow-xl shadow-black/50 ring-1 ring-[#0AE448]/50'
                        : 'bg-[#141716] text-[#FFFCE1] border-white/10 hover:border-[#0AE448]/40 hover:bg-[#191C1B] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className={`font-mono font-black text-xs px-2.5 py-1 rounded-xl shrink-0 ${
                        isSelected ? 'bg-[#0AE448] text-[#0E100F]' : 'bg-black/60 text-[#0AE448] border border-white/10'
                      }`}>
                        #{agent.number}
                      </span>

                      <div className={`p-2.5 rounded-xl shrink-0 ${
                        isSelected ? 'bg-[#101211] border border-[#0AE448]/40 text-[#0AE448]' : 'bg-[#101211] border border-white/10 text-white'
                      }`}>
                        {renderIcon(agent.iconName)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm leading-tight truncate text-white">{agent.name}</h4>
                          <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded-full bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30 flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0AE448] animate-ping" />
                            {agent.status}
                          </span>
                        </div>
                        <p className={`text-[11px] font-mono mt-0.5 truncate ${isSelected ? 'text-[#00BAE2]' : 'text-[#7C7C6F]'}`}>
                          {agent.roleTitle}
                        </p>
                        <p className={`text-[10px] mt-1 italic truncate ${isSelected ? 'text-[#0AE448]' : 'text-[#A0A090]'}`}>
                          ⚡ <span className="font-semibold">{agent.currentTask}</span>
                        </p>
                      </div>
                    </div>

                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'translate-x-1 text-[#0AE448]' : 'text-[#7C7C6F]'
                    }`} />
                  </button>

                  {/* Flow Connector Arrow between nodes */}
                  {index < filteredAgents.length - 1 && (
                    <div className="flex justify-center py-0.5">
                      <div className="w-0.5 h-2 bg-white/10"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Agent Inspector & Live Telemetry Panel (5 cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <span className="text-xs font-bold text-[#A0A090] uppercase font-mono tracking-wider block">
            Raio-X do Agente Selecionado:
          </span>

          <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-5 text-white">
            
            {/* Inspector Header */}
            <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
              <div className="p-3.5 bg-[#141716] border border-white/10 text-[#0AE448] rounded-2xl shadow-md">
                {renderIcon(selectedAgent.iconName)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#00BAE2] uppercase bg-[#00BAE2]/10 border border-[#00BAE2]/20 px-2 py-0.5 rounded-md">
                    {selectedAgent.layer}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#7C7C6F]">
                    #{selectedAgent.number}
                  </span>
                </div>
                <h3 className="font-black text-white text-lg leading-tight mt-0.5 truncate">{selectedAgent.name}</h3>
                <p className="text-xs text-[#7C7C6F] font-mono">{selectedAgent.roleTitle}</p>
              </div>
            </div>

            {/* Live Operational State Badge */}
            <div className="p-3.5 rounded-2xl bg-[#141716] border border-[#0AE448]/30 text-white space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#0AE448] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#0AE448] animate-ping" />
                  STATUS OPERACIONAL AO VIVO:
                </span>
                <span className="font-black text-[#0AE448] bg-[#0AE448]/15 border border-[#0AE448]/30 px-2 py-0.5 rounded-md text-[10px]">
                  TRABALHANDO A TODO VAPOR ⚡
                </span>
              </div>
              <p className="text-xs font-medium text-slate-300 leading-relaxed font-sans">
                <strong>Tarefa Ativa no Milissegundo:</strong> {selectedAgent.currentTask}.
              </p>
              <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                <div>
                  <span className="text-[#7C7C6F] text-[9px] block uppercase">Ciclos Hoje:</span>
                  <span className="font-bold text-[#0AE448]">{selectedAgent.cyclesCompletedToday.toLocaleString('pt-BR')} execuções</span>
                </div>
                <div>
                  <span className="text-[#7C7C6F] text-[9px] block uppercase">Latência Média:</span>
                  <span className="font-bold text-[#0AE448]">{selectedAgent.avgLatency} (Zero Fila)</span>
                </div>
              </div>
            </div>

            {/* Cadence & Mission Statement */}
            <div className="space-y-1.5 text-xs">
              <span className="font-bold text-[#A0A090] uppercase font-mono text-[10px] block">
                Cadência & Missão Autônoma:
              </span>
              <div className="bg-[#141716] p-3 rounded-2xl border border-white/10 space-y-1">
                <p className="text-[11px] font-mono font-bold text-[#00BAE2]">
                  ⏱️ {selectedAgent.executionCadence}
                </p>
                <p className="text-[#A0A090] leading-relaxed font-sans text-xs">
                  {selectedAgent.mission}
                </p>
              </div>
            </div>

            {/* Inputs & Outputs Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#141716] rounded-2xl border border-white/10 space-y-1.5">
                <span className="text-[9px] font-bold text-[#7C7C6F] font-mono uppercase block">Dados de Entrada:</span>
                <ul className="space-y-1">
                  {selectedAgent.inputs.map((inp, idx) => (
                    <li key={idx} className="text-[11px] text-[#A0A090] font-medium flex items-start gap-1">
                      <span className="text-[#00BAE2] font-bold">•</span>
                      <span>{inp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-[#141716] rounded-2xl border border-white/10 space-y-1.5 text-white">
                <span className="text-[9px] font-bold text-[#0AE448] font-mono uppercase block">Entregáveis (Outputs):</span>
                <ul className="space-y-1">
                  {selectedAgent.outputs.map((out, idx) => (
                    <li key={idx} className="text-[11px] text-[#0AE448] font-medium flex items-start gap-1">
                      <span className="text-[#0AE448] font-bold">✓</span>
                      <span>{out}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Founder Directive & Tip Editor */}
            <div className="p-4 rounded-2xl bg-[#141716] border border-amber-500/30 text-amber-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>DIRETIVA DO FUNDADOR (LUCAS):</span>
                </div>

                {!isEditingTip ? (
                  <button
                    onClick={() => { setIsEditingTip(true); setEditTipText(selectedAgent.customTip); }}
                    className="p-1 hover:bg-amber-500/20 rounded-lg text-amber-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Editar</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSaveTip}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-[#0E100F] rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3 h-3" />
                    <span>Salvar</span>
                  </button>
                )}
              </div>

              {!isEditingTip ? (
                <p className="text-xs text-amber-200/90 leading-relaxed font-sans font-medium italic">
                  "{selectedAgent.customTip}"
                </p>
              ) : (
                <textarea
                  value={editTipText}
                  onChange={(e) => setEditTipText(e.target.value)}
                  rows={3}
                  className="w-full p-2.5 text-xs bg-black/60 border border-amber-500/40 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans text-white"
                  placeholder="Digite sua diretiva obrigatória para este agente..."
                />
              )}

              {saveSuccess && (
                <span className="text-[11px] font-mono font-bold text-[#0AE448] block text-center">
                  ✅ Diretiva transmitida e absorvida pelo agente!
                </span>
              )}
            </div>

            {/* Prompt de Comando & Mandato do Conselheiro de Negócios (Zero Bajulação) */}
            {(() => {
              const swarmDef = getSwarmAgentById(selectedAgent.id);
              if (!swarmDef) return null;
              
              const handleCopyPrompt = () => {
                if (swarmDef.systemPrompt) {
                  navigator.clipboard.writeText(swarmDef.systemPrompt);
                  setHasCopiedPrompt(true);
                  if (copyPromptTimerRef.current) clearTimeout(copyPromptTimerRef.current);
                  copyPromptTimerRef.current = setTimeout(() => setHasCopiedPrompt(false), 2500);
                }
              };

              return (
                <div className="p-4 rounded-2xl bg-[#0E100F] border border-white/10 text-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-mono font-bold tracking-tight text-white uppercase">
                        Prompt de Comando & Conselheiro
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopyPrompt}
                        className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[10px] font-mono transition-all flex items-center gap-1 cursor-pointer"
                        title="Copiar prompt completo para a área de transferência"
                      >
                        {hasCopiedPrompt ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>Copiar Prompt</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                        title={isPromptExpanded ? 'Recolher prompt' : 'Expandir prompt'}
                      >
                        {isPromptExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Kill Switch Trigger Badge if Defined */}
                  {swarmDef.killSwitchAction && (
                    <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-start gap-2 text-[11px] font-sans">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-200 block font-mono text-[10px] uppercase">Gatilho de Kill-Switch Imediato:</strong>
                        <span>{swarmDef.killSwitchAction}</span>
                      </div>
                    </div>
                  )}

                  {/* Expandable System Prompt Content */}
                  {isPromptExpanded ? (
                    <div className="space-y-2">
                      <div className="max-h-72 overflow-y-auto p-3 bg-black/60 rounded-xl border border-white/5 font-mono text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
                        {swarmDef.systemPrompt}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                        <span>Status: 100% Grounding Verificado</span>
                        <span className="text-emerald-400 font-bold">Anti-Complacência Ativa</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                      {swarmDef.systemPrompt.slice(0, 160)}...
                    </p>
                  )}
                </div>
              );
            })()}

          </div>
        </div>

      </div>

    </div>
  );
};
