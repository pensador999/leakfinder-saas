// ==============================================================================
// 🎯 VERTICAL SWARM COMMAND CENTER VIEW (ADSHIELD 2026)
// Skill: product-design-ux-architecture + autonomous-agent-orchestrator
// Painel central de visualização e calibração das 5 verticais hiper-especializadas:
// Calçados, Agro/Outdoor, Streetwear, Fitness/Beachwear e Cosméticos.
// ==============================================================================

import React, { useState } from 'react';
import { 
  DYNAMIC_VERTICAL_REGISTRY, 
  SupportedVerticalId, 
  DynamicVerticalProfile 
} from '../../services/ai/dynamicVerticalContext';
import { 
  Layers, 
  Target, 
  TrendingDown, 
  Cpu, 
  MessageSquare, 
  ShieldAlert, 
  CheckCircle2, 
  BarChart3, 
  DollarSign, 
  Zap, 
  AlertTriangle,
  ArrowRight,
  Database,
  Building,
  RefreshCw
} from 'lucide-react';
import { calculateActuarialBleed } from '../../services/ai/bleedActuaryEngine';

export const VerticalSwarmCommandCenterView: React.FC = () => {
  const [selectedVerticalId, setSelectedVerticalId] = useState<SupportedVerticalId>('CALCADOS_COURO');
  const [simulatedPrice, setSimulatedPrice] = useState<number>(249.90);
  const [simulatedVisitors, setSimulatedVisitors] = useState<number>(350);

  const activeVertical: DynamicVerticalProfile = DYNAMIC_VERTICAL_REGISTRY[selectedVerticalId];

  // Simulação Atuarial em Tempo Real baseada na vertical ativa
  const simulatedBleed = calculateActuarialBleed({
    productTitle: `Produto Estrela ${activeVertical.label}`,
    productPriceBRL: simulatedPrice,
    availableSizes: activeVertical.secondaryDemandSizes,
    outOfStockSizes: activeVertical.coreDemandSizes,
    niche: activeVertical.verticalId,
    estimatedDailyVisitors: simulatedVisitors
  });

  return (
    <div className="space-y-6 text-[#FFFCE1]">
      {/* Header com DNA Executivo */}
      <div className="p-6 bg-[#141716] border border-white/10 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-[#00BAE2]/15 text-[#00BAE2] text-xs font-mono font-bold rounded-lg border border-[#00BAE2]/30 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              Verticalização do Enxame (AdShield 2026)
            </span>
            <span className="px-3 py-1 bg-[#0AE448]/15 text-[#0AE448] text-xs font-mono font-bold rounded-lg border border-[#0AE448]/30">
              5 Verticais Calibradas
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Centro de Comando da Inteligência Verticalizada
          </h2>
          <p className="text-xs text-[#BBBAA6] mt-1">
            Cada vertical alimenta os 18 agentes com curvas gaussianas reais, CPCs de Meta Ads, ERPs dominantes e vocabulário visceral.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] text-[#BBBAA6] uppercase font-mono">Status do Protocolo</div>
            <div className="text-sm font-bold text-[#0AE448] flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-[#0AE448] animate-pulse"></span>
              Ativo & Grounded
            </div>
          </div>
        </div>
      </div>

      {/* Seletor Rápido das 5 Verticais Brasileiras */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(Object.keys(DYNAMIC_VERTICAL_REGISTRY) as SupportedVerticalId[])
          .filter(id => id !== 'VAREJO_GERAL')
          .map((id) => {
            const vert = DYNAMIC_VERTICAL_REGISTRY[id];
            const isSelected = selectedVerticalId === id;

            return (
              <button
                key={id}
                onClick={() => setSelectedVerticalId(id)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-[#1C201E] border-[#0AE448] shadow-lg shadow-[#0AE448]/10'
                    : 'bg-[#141716] border-white/10 hover:border-white/20 hover:bg-[#181B1A]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold font-mono ${isSelected ? 'text-[#0AE448]' : 'text-[#BBBAA6]'}`}>
                    {vert.geographicPoles[0]?.split(' ')[0] || 'Brasil'}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#0AE448]"></span>
                  )}
                </div>
                <div className="text-sm font-bold text-white leading-tight">
                  {vert.label}
                </div>
                <div className="text-[11px] text-[#BBBAA6] mt-1 font-mono">
                  Ticket Médio: R$ {vert.averageTicketBRL.toFixed(0)}
                </div>
              </button>
            );
          })}
      </div>

      {/* Grid Principal: Detalhamento da Vertical Ativa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna 1 & 2: Curva de Gauss, Econometria & Stack Tecnológica */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card Econométrico e Demanda Gaussiana */}
          <div className="p-6 bg-[#141716] border border-white/10 rounded-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#00BAE2]" />
                <h3 className="font-bold text-white text-base">
                  Curva Gaussiana de Demanda & Benchmarks: {activeVertical.label}
                </h3>
              </div>
              <span className="text-xs text-[#0AE448] font-mono font-bold">
                CPC Meta Ads: R$ {activeVertical.benchmarkMetaAdsCpcBRL.toFixed(2)}
              </span>
            </div>

            {/* Visualização de Distribuição de Tamanhos */}
            <div>
              <div className="text-xs font-mono text-[#BBBAA6] mb-3 flex items-center justify-between">
                <span>Concentração de Compra por Tamanho / Variante</span>
                <span className="text-[#0AE448] font-bold">
                  Core: {activeVertical.coreDemandSizes.join(', ')} (Maior Risco de Ruptura)
                </span>
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {Object.entries(activeVertical.gaussianDemandDistribution).map(([size, pct]) => {
                  const isCore = activeVertical.coreDemandSizes.includes(size);
                  return (
                    <div 
                      key={size}
                      className={`p-2.5 rounded-xl border text-center ${
                        isCore 
                          ? 'bg-[#E40A2D]/10 border-[#E40A2D]/40 text-[#E40A2D]' 
                          : 'bg-[#181B1A] border-white/10 text-[#BBBAA6]'
                      }`}
                    >
                      <div className="text-xs font-bold font-mono">{size}</div>
                      <div className="text-lg font-black mt-0.5">{pct}%</div>
                      <div className="text-[9px] mt-1 font-mono uppercase">
                        {isCore ? 'Crítico' : 'Periférico'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Painel de Métricas do Setor */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 bg-[#0E100F] border border-white/10 rounded-xl">
                <div className="text-[10px] text-[#BBBAA6] font-mono">Ticket Médio Setorial</div>
                <div className="text-lg font-bold text-white mt-0.5">
                  R$ {activeVertical.averageTicketBRL.toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-[#0E100F] border border-white/10 rounded-xl">
                <div className="text-[10px] text-[#BBBAA6] font-mono">Taxa Conversão (CVR)</div>
                <div className="text-lg font-bold text-[#00BAE2] mt-0.5">
                  {activeVertical.baselineCvrPct.toFixed(2)}%
                </div>
              </div>
              <div className="p-3 bg-[#0E100F] border border-white/10 rounded-xl">
                <div className="text-[10px] text-[#BBBAA6] font-mono">Taxa Troca/Devolução</div>
                <div className="text-lg font-bold text-[#FFB800] mt-0.5">
                  {activeVertical.averageReturnRatePct.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 bg-[#0E100F] border border-white/10 rounded-xl">
                <div className="text-[10px] text-[#BBBAA6] font-mono">Pólos Industriais</div>
                <div className="text-xs font-bold text-[#0AE448] mt-1 truncate" title={activeVertical.geographicPoles.join(', ')}>
                  {activeVertical.geographicPoles[0]?.split(' ')[0] || 'Nacional'}
                </div>
              </div>
            </div>
          </div>

          {/* Stack Tecnológica & ERPs Dominantes da Vertical */}
          <div className="p-6 bg-[#141716] border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Database className="w-5 h-5 text-[#0AE448]" />
              <h3 className="font-bold text-white text-base">
                Mapeamento de ERPs & Hubs Dominantes no Setor
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#0E100F] border border-white/10 rounded-xl space-y-2">
                <div className="text-xs font-mono text-[#00BAE2] font-bold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" />
                  ERP & Hub Principal
                </div>
                <div className="text-sm font-bold text-white">
                  {activeVertical.dominantTechStack.primaryErp}
                </div>
                <div className="text-xs text-[#BBBAA6]">
                  Hub de Tráfego: {activeVertical.dominantTechStack.primaryHub}
                </div>
                <div className="text-[11px] text-[#7C7C6F] font-mono">
                  Latência Média de Sync: ~{activeVertical.dominantTechStack.typicalSyncLatencyMinutes} min
                </div>
              </div>

              <div className="p-4 bg-[#0E100F] border border-white/10 rounded-xl space-y-2">
                <div className="text-xs font-mono text-[#0AE448] font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  Comportamento Operacional de Estoque
                </div>
                <p className="text-xs text-[#FFFCE1] leading-relaxed">
                  {activeVertical.dominantTechStack.inventoryPolicyBehavior}
                </p>
              </div>
            </div>

            {/* Isenções & Recursos Mandatórios do Tema */}
            <div className="p-4 bg-[#1C201E] border border-white/5 rounded-xl space-y-2">
              <div className="text-xs font-mono text-[#BBBAA6]">
                <strong className="text-white">Regras de Isenção do Catálogo Doctor:</strong> Itens com ({activeVertical.catalogExemptionPatterns.join(', ')}) são isentos de penalidade de grade.
              </div>
              <div className="text-xs font-mono text-[#BBBAA6]">
                <strong className="text-white">Recursos Obrigatórios no Tema:</strong> {activeVertical.mandatoryProductFeatures.join(' • ')}.
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 3: Simulador Atuarial em Tempo Real & Vocabulário Visceral */}
        <div className="space-y-6">
          {/* Simulador Atuarial Instantâneo */}
          <div className="p-6 bg-[#141716] border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <DollarSign className="w-5 h-5 text-[#0AE448]" />
              <h3 className="font-bold text-white text-base">
                Simulador Atuarial da Vertical
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#BBBAA6] block mb-1">Preço do Produto (R$)</label>
                <input 
                  type="number" 
                  value={simulatedPrice} 
                  onChange={(e) => setSimulatedPrice(Number(e.target.value))}
                  className="w-full bg-[#0E100F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>

              <div>
                <label className="text-xs text-[#BBBAA6] block mb-1">Visitantes Diários Estimados</label>
                <input 
                  type="number" 
                  value={simulatedVisitors} 
                  onChange={(e) => setSimulatedVisitors(Number(e.target.value))}
                  className="w-full bg-[#0E100F] border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono"
                />
              </div>
            </div>

            {/* Resultado Atuarial da Ruptura Central */}
            <div className="p-4 bg-[#0E100F] border border-[#E40A2D]/30 rounded-xl space-y-2">
              <div className="text-[10px] text-[#BBBAA6] font-mono uppercase">Sangria Atuarial Estimada</div>
              <div className="text-2xl font-black text-[#E40A2D] font-mono">
                R$ {simulatedBleed.totalMonthlyBleedBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                <span className="text-xs font-normal text-[#BBBAA6]">/mês</span>
              </div>
              <div className="text-xs text-[#BBBAA6]">
                Mídia Queimada: <strong className="text-white font-mono">R$ {simulatedBleed.wastedMediaAdMonthlyBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
              </div>
              <div className="text-xs text-[#BBBAA6]">
                Aumento no CAC: <strong className="text-[#E40A2D] font-mono">{simulatedBleed.inflatedCacFactor}x</strong>
              </div>
            </div>
          </div>

          {/* Vocabulário Visceral & Copy de Fechamento */}
          <div className="p-6 bg-[#141716] border border-white/10 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <MessageSquare className="w-5 h-5 text-[#00BAE2]" />
              <h3 className="font-bold text-white text-base">
                Vocabulário Visceral do Setor
              </h3>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-[#BBBAA6]">
                <strong className="text-white block mb-1">Termos Técnicos do Nicho:</strong>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeVertical.vocabulary.industryTerms.map((term, i) => (
                    <span key={i} className="px-2 py-0.5 bg-[#00BAE2]/10 text-[#00BAE2] text-[10px] font-mono rounded border border-[#00BAE2]/20">
                      {term}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-xs text-[#BBBAA6]">
                <strong className="text-white block mb-1">Gancho de Dor da Vertical:</strong>
                <p className="p-2.5 bg-[#0E100F] border border-white/10 rounded-lg text-[11px] text-[#FFFCE1] leading-relaxed italic">
                  "{activeVertical.vocabulary.lossPainHooks[0]}"
                </p>
              </div>

              <div className="text-xs text-[#BBBAA6]">
                <strong className="text-white block mb-1">Punchline de Fechamento:</strong>
                <p className="p-2.5 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-lg text-[11px] text-[#0AE448] font-medium leading-relaxed">
                  "{activeVertical.vocabulary.closingPunchlines[0]}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
