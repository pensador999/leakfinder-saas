import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Zap, 
  Cpu, 
  ChevronDown, 
  Sparkles, 
  Eye, 
  Gauge, 
  Activity, 
  GitFork, 
  Scale, 
  Database, 
  Compass, 
  Wrench, 
  BarChart3, 
  Crown, 
  Code2, 
  KanbanSquare, 
  Sword, 
  Target, 
  Store, 
  Calculator, 
  Share2, 
  Factory, 
  Flame, 
  Globe, 
  GitCompare, 
  Search,
  CheckCircle2,
  SlidersHorizontal,
  Bot
} from 'lucide-react';

export type MainNavPillar = 'PROFIT_DIAGNOSTIC' | 'CATALOG_STOCK' | 'ACTIONS_SHIELD' | 'SWARM_LAB';

export interface SimplifiedPillarNavProps {
  activePillar: MainNavPillar;
  onChangePillar: (pillar: MainNavPillar) => void;
  activeTab: string;
  onChangeTab: (tabId: string) => void;
  isMarketplaceStore?: boolean;
  totalCatalogAlerts?: number;
  isFounderAuthenticated?: boolean;
  onOpenMetaAutoKill: () => void;
  onOpenWhatsAppWatchdog: () => void;
}

export const SimplifiedPillarNav: React.FC<SimplifiedPillarNavProps> = ({
  activePillar,
  onChangePillar,
  activeTab,
  onChangeTab,
  isMarketplaceStore = false,
  totalCatalogAlerts = 0,
  isFounderAuthenticated = false,
  onOpenMetaAutoKill,
  onOpenWhatsAppWatchdog
}) => {
  const [isSwarmDrawerOpen, setIsSwarmDrawerOpen] = useState(false);

  // Sub-abas do Pilar 1: Diagnóstico & Lucro
  const diagnosticTabs = [
    { id: 'summary', label: 'Dossiê Executivo', icon: ShieldCheck },
    { id: 'pricing', label: 'Simulador Pix & Margem', icon: Calculator },
    ...(isMarketplaceStore ? [{ id: 'marketplace', label: 'Marketplace & Buy Box', icon: Store }] : []),
    { id: 'collection_audit', label: 'Coleções & Banners', icon: Target },
    { id: 'omnichannel_social', label: 'Redes Sociais & Tráfego', icon: Share2 },
    { id: 'trust_badge', label: 'Selo de Confiança Legal', icon: CheckCircle2 }
  ];

  // Sub-abas do Pilar 2: Grade & Ruptura
  const catalogTabs = [
    { id: 'catalog', label: 'Grade PP ao G2', icon: Layers, badge: totalCatalogAlerts > 0 ? `${totalCatalogAlerts} falhas` : undefined },
    { id: 'rupture_monitor', label: 'Vigia 24h Ruptura', icon: Flame },
    { id: 'sku_crossing', label: 'Cruzamento SKUs & Abandonos', icon: GitCompare },
    { id: 'supply_chain_discrepancy', label: 'Descompasso ERP Sankhya/Magis5', icon: Factory },
    { id: 'niche_recognition', label: 'Reconhecimento de Nicho', icon: Globe }
  ];

  // Sub-abas do Pilar 3: Ações & Salvaguardas
  const actionTabs = [
    { id: 'scripts', label: 'Scripts Liquid & CSS', icon: Code2 },
    { id: 'kanban', label: 'Plano de Ação (Kanban)', icon: KanbanSquare }
  ];

  // Cluster dos 18 Agentes no Laboratório
  const swarmClusters = [
    {
      title: 'Visão & Ergonomia Mobile',
      agents: [
        { id: 'vision', label: 'Visão WCAG & Heatmap', icon: Eye, desc: 'Contraste e saliência visual' },
        { id: 'vitals', label: 'Core Web Vitals 2026', icon: Gauge, desc: 'Tempo de resposta mobile' },
        { id: 'telemetry', label: 'Telemetria Shopify', icon: Activity, desc: 'Eventos de navegação' }
      ]
    },
    {
      title: 'Raciocínio Profundo & Consenso',
      agents: [
        { id: 'tree_of_thought', label: 'Debate ToT', icon: GitFork, desc: 'Árvore de pensamento multi-ângulo' },
        { id: 'truth_auditor', label: 'Tribunal de Consenso', icon: Scale, desc: 'Zero falso-positivo auditado' },
        { id: 'vector_radar', label: 'Memória RAG Vetorial', icon: Database, desc: 'Aprendizado contínuo' },
        { id: 'agent_flowchart', label: 'Fluxograma do Enxame', icon: Zap, desc: 'Topologia autônoma' }
      ]
    },
    {
      title: 'Mercado, Concorrentes & Copy',
      agents: [
        { id: 'competitor', label: 'Espião de Concorrentes', icon: Sword, desc: 'Preço e posicionamento' },
        { id: 'market_hunter', label: 'Caçador de Mercado', icon: Compass, desc: 'Mineração e benchmarks' },
        { id: 'product_evolution', label: 'Auto-Evolução do Produto', icon: Wrench, desc: 'Recomendações técnicas' },
        { id: 'customer_success', label: 'VoC & Precificação', icon: BarChart3, desc: 'Voz do cliente e elasticidade' }
      ]
    },
    {
      title: 'Orquestração & Comando',
      agents: [
        { id: 'ceo_orchestrator', label: 'Orquestrador CEO', icon: Crown, desc: 'Priorização executiva' },
        { id: 'orchestrator', label: 'Torre do Maestro', icon: Cpu, desc: 'Roteamento de agentes' },
        { id: 'scraper_dossier', label: 'Dossiê Forense', icon: Search, desc: 'Inspeção profunda de DOM' },
        ...(isFounderAuthenticated ? [{ id: 'founder_hq', label: 'Torre do Fundador (HQ)', icon: Crown, desc: 'Comando confidencial' }] : [])
      ]
    }
  ];

  return (
    <div className="space-y-3 font-sans">
      
      {/* 1. Barra de Pilares Principais (Minimalista e Focada) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#101211] p-2 rounded-2xl border border-white/10 shadow-lg">
        
        {/* As 3 Abas Mestras do Lojista */}
        <div className="grid grid-cols-3 gap-1.5 flex-1 max-w-2xl">
          <button
            type="button"
            onClick={() => {
              onChangePillar('PROFIT_DIAGNOSTIC');
              onChangeTab('summary');
              setIsSwarmDrawerOpen(false);
            }}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center sm:justify-start gap-2 transition-all cursor-pointer ${
              activePillar === 'PROFIT_DIAGNOSTIC' && !isSwarmDrawerOpen
                ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="truncate">1. Diagnóstico & Lucro</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChangePillar('CATALOG_STOCK');
              onChangeTab('catalog');
              setIsSwarmDrawerOpen(false);
            }}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center sm:justify-start gap-2 transition-all cursor-pointer relative ${
              activePillar === 'CATALOG_STOCK' && !isSwarmDrawerOpen
                ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span className="truncate">2. Grade & Ruptura</span>
            {totalCatalogAlerts > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-black ${
                activePillar === 'CATALOG_STOCK' && !isSwarmDrawerOpen ? 'bg-slate-950 text-[#0AE448]' : 'bg-[#FF4757] text-[#FFFCE1]'
              }`}>
                {totalCatalogAlerts}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              onChangePillar('ACTIONS_SHIELD');
              onChangeTab('scripts');
              setIsSwarmDrawerOpen(false);
            }}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center sm:justify-start gap-2 transition-all cursor-pointer ${
              activePillar === 'ACTIONS_SHIELD' && !isSwarmDrawerOpen
                ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
            }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span className="truncate">3. Ações & Correção</span>
          </button>
        </div>

        {/* Botão de Abertura do Laboratório de 18 Agentes */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSwarmDrawerOpen(!isSwarmDrawerOpen)}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
              isSwarmDrawerOpen
                ? 'bg-[#00BAE2] text-slate-950 border-[#00BAE2] font-black shadow-md shadow-[#00BAE2]/20'
                : 'bg-white/5 hover:bg-white/10 text-[#00BAE2] border-[#00BAE2]/30'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Laboratório IA (18 Agentes)</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSwarmDrawerOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

      </div>

      {/* 2. Gaveta Expansível do Laboratório de IA (Quando Ativada) */}
      {isSwarmDrawerOpen && (
        <div className="p-5 bg-[#141716] rounded-2xl border border-[#00BAE2]/30 shadow-2xl animate-fadeIn space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-[#00BAE2]" />
              <h4 className="text-sm font-bold text-[#FFFCE1]">
                Laboratório de Inteligência • Enxame dos 18 Agentes Autônomos
              </h4>
            </div>
            <span className="text-[11px] text-[#7C7C6F] font-mono">
              Clique em qualquer agente para auditar sua tese técnica
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {swarmClusters.map((cluster, idx) => (
              <div key={idx} className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7C7C6F] block">
                  {cluster.title}
                </span>

                <div className="space-y-1">
                  {cluster.agents.map((agent) => {
                    const AgentIcon = agent.icon;
                    const isSelected = activeTab === agent.id;

                    return (
                      <button
                        key={agent.id}
                        type="button"
                        onClick={() => {
                          onChangePillar('SWARM_LAB');
                          onChangeTab(agent.id);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left transition-all cursor-pointer flex items-start gap-2.5 border ${
                          isSelected
                            ? 'bg-[#00BAE2]/15 text-[#00BAE2] border-[#00BAE2]/50 shadow-sm'
                            : 'bg-[#101211] text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5 border-white/5'
                        }`}
                      >
                        <AgentIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-[#00BAE2]' : 'text-[#7C7C6F]'}`} />
                        <div className="min-w-0">
                          <span className="text-xs font-bold block truncate text-[#FFFCE1]">
                            {agent.label}
                          </span>
                          <span className="text-[10px] text-[#7C7C6F] block truncate leading-tight">
                            {agent.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Sub-Abas do Pilar Selecionado (Quando NÃO estiver no Laboratório de IA) */}
      {!isSwarmDrawerOpen && (
        <div className="flex flex-wrap items-center gap-1.5 bg-[#141716] p-2 rounded-2xl border border-white/10 shadow-sm">
          
          {/* Sub-abas de Diagnóstico */}
          {activePillar === 'PROFIT_DIAGNOSTIC' && diagnosticTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isTabActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                  isTabActive
                    ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] shadow-md shadow-[#0AE448]/20 font-black'
                    : 'bg-[#101211] text-[#BBBAA6] border-white/10 hover:border-white/20 hover:text-[#FFFCE1] hover:bg-[#191C1B]'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Sub-abas de Catálogo & Grade */}
          {activePillar === 'CATALOG_STOCK' && catalogTabs.map((tab) => {
            const TabIcon = tab.icon;
            const isTabActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onChangeTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                  isTabActive
                    ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] shadow-md shadow-[#0AE448]/20 font-black'
                    : 'bg-[#101211] text-[#BBBAA6] border-white/10 hover:border-white/20 hover:text-[#FFFCE1] hover:bg-[#191C1B]'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black ${
                    isTabActive ? 'bg-slate-950 text-[#0AE448]' : 'bg-[#FF4757] text-[#FFFCE1]'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Sub-abas de Ações & Correção */}
          {activePillar === 'ACTIONS_SHIELD' && (
            <>
              {actionTabs.map((tab) => {
                const TabIcon = tab.icon;
                const isTabActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => onChangeTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                      isTabActive
                        ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] shadow-md shadow-[#0AE448]/20 font-black'
                        : 'bg-[#101211] text-[#BBBAA6] border-white/10 hover:border-white/20 hover:text-[#FFFCE1] hover:bg-[#191C1B]'
                    }`}
                  >
                    <TabIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

              {/* Botões de Ação Rápida em 1-Clique */}
              <button
                type="button"
                onClick={onOpenMetaAutoKill}
                className="px-3 py-1.5 bg-[#FF4757]/15 hover:bg-[#FF4757]/25 text-[#FF4757] border border-[#FF4757]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-[#FF4757]" />
                <span>Disparar Kill-Switch Meta</span>
              </button>

              <button
                type="button"
                onClick={onOpenWhatsAppWatchdog}
                className="px-3 py-1.5 bg-[#0AE448]/15 hover:bg-[#0AE448]/25 text-[#0AE448] border border-[#0AE448]/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-[#0AE448]" />
                <span>Configurar Alerta das 07:00</span>
              </button>
            </>
          )}

        </div>
      )}

    </div>
  );
};
