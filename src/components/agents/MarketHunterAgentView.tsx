import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Target, 
  TrendingUp, 
  Flame, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Download, 
  DollarSign, 
  ShieldCheck,
  Zap,
  ArrowRight,
  Send,
  Sword,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Layers,
  ShoppingBag
} from 'lucide-react';
import { 
  runMarketHunterScan, 
  WeeklyMarketReport, 
  DiscoveredLeadOpportunity,
  SkuPriceCrossBenchmark 
} from '../../services/agents/marketHunterAgent';
import { AgentDiagnosticResult } from '../../types';

interface MarketHunterAgentViewProps {
  diagnostic?: AgentDiagnosticResult;
}

export const MarketHunterAgentView: React.FC<MarketHunterAgentViewProps> = ({ diagnostic }) => {
  const [report, setReport] = useState<WeeklyMarketReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);
  const [copiedHookId, setCopiedHookId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'sku_radar' | 'leads' | 'trends'>('sku_radar');

  const loadHunterReport = async () => {
    setIsLoading(true);
    try {
      const data = await runMarketHunterScan(diagnostic);
      setReport(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHunterReport();
  }, [diagnostic]);

  const handleCopyHook = (lead: DiscoveredLeadOpportunity) => {
    navigator.clipboard.writeText(lead.contactHook);
    setCopiedLeadId(lead.id);
    setTimeout(() => setCopiedLeadId(null), 2500);
  };

  const handleCopyCounterOffer = (sku: SkuPriceCrossBenchmark) => {
    navigator.clipboard.writeText(sku.counterOfferMetaAdHook);
    setCopiedHookId(sku.id);
    setTimeout(() => setCopiedHookId(null), 2500);
  };

  if (isLoading || !report) {
    return (
      <div className="py-16 text-center space-y-3 font-sans">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <p className="text-sm font-bold text-slate-700">Caçador de Mercado (Agente 06) cruzando preços de produtos no nicho...</p>
        <p className="text-xs text-slate-400">Cruzando catálogo da loja, concorrência direta e biblioteca do Meta Ads em tempo real.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans animate-fadeIn">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 rounded-2xl text-white shadow-md shadow-blue-500/30">
            <Compass className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Caçador de Mercado & Radar de Preços (Agente 06)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Semana {report.weekNumber} • Inteligência Ativa
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Varredura contínua de preços de produtos, políticas de frete de concorrentes e oportunidades de contra-ataque no tráfego pago.
            </p>
          </div>
        </div>

        <button
          onClick={loadHunterReport}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Escanear Concorrentes Agora</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200 overflow-x-auto scrollbar-none text-xs font-bold font-mono">
        
        <button
          onClick={() => setActiveSubTab('sku_radar')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'sku_radar'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sword className="w-4 h-4 text-blue-600" />
          <span>🦅 Duelo de Preços SKU-a-SKU ({report.skuPriceCrossBenchmarks.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('leads')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'leads'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Target className="w-4 h-4 text-indigo-600" />
          <span>🎯 Prospecção Outbound de Lojas ({report.highValueProspects.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('trends')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'trends'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-500" />
          <span>⚡ Tendências Globais de CRO ({report.topEmergingTrends.length})</span>
        </button>

      </div>

      {/* 🦅 1. SUB-TAB: SKU-TO-SKU PRICE MATCHING RADAR */}
      {activeSubTab === 'sku_radar' && (
        <div className="space-y-4">
          
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-blue-950 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>O Agente 03 cruzou seus produtos com os concorrentes diretos que estão anunciando no mesmo nicho:</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-blue-200/80 px-2.5 py-1 rounded text-blue-900 shrink-0">
              Zero Falso-Positivo Verificado ✓
            </span>
          </div>

          <div className="space-y-4">
            {report.skuPriceCrossBenchmarks.map((sku) => {
              const isDisadvantage = sku.priceAdvantageStatus === 'DESVANTAGEM_SUA';

              return (
                <div key={sku.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5 hover:border-blue-300 transition-all">
                  
                  {/* Card Header: Product VS Competitor */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2.5 rounded-2xl font-bold font-mono text-sm ${
                        isDisadvantage ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {isDisadvantage ? '⚠️ DESVIO DE PREÇO' : '🏆 VANTAGEM COMPETITIVA'}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-base">{sku.yourProductTitle}</h3>
                        <span className="text-xs text-slate-400 font-mono">Concorrente Monitorado: {sku.competitorStoreName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-xl font-bold font-mono text-xs border ${
                        isDisadvantage 
                          ? 'bg-rose-50 text-rose-800 border-rose-200' 
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {isDisadvantage ? `+${sku.priceDifferencePercent}% Mais Caro no Checkout` : `${sku.priceDifferencePercent}% Mais Barato`}
                      </span>
                    </div>
                  </div>

                  {/* Pricing Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    
                    {/* Your Store Product Box */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Sua Loja:</span>
                      <p className="font-sans font-bold text-slate-900 text-sm">{sku.yourProductTitle}</p>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-600">
                        <span>Preço de Vitrine:</span>
                        <strong className="text-slate-900">R$ {sku.yourProductPrice.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Frete Médio Calculado:</span>
                        <strong className="text-slate-900">R$ {sku.yourProductShippingFee.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-slate-900 font-bold text-sm">
                        <span>Preço Final no Checkout:</span>
                        <strong className="text-blue-600">R$ {sku.yourTotalFinalPrice.toFixed(2)}</strong>
                      </div>

                      <div className="pt-2 text-[10px] text-slate-500">
                        <span>Grade Disponível: </span>
                        <span className="font-bold text-slate-700">{sku.yourAvailableSizes.join(' • ')}</span>
                      </div>
                    </div>

                    {/* Competitor Product Box */}
                    <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-2">
                      <span className="text-[10px] text-indigo-700 uppercase font-bold block">Concorrente ({sku.competitorStoreName}):</span>
                      <p className="font-sans font-bold text-indigo-950 text-sm">{sku.competitorProductTitle}</p>
                      
                      <div className="flex items-center justify-between pt-1 border-t border-indigo-200 text-slate-600">
                        <span>Preço de Vitrine:</span>
                        <strong className="text-slate-900">R$ {sku.competitorPrice.toFixed(2)}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-600">
                        <span>Frete (Política):</span>
                        <strong className="text-emerald-700">{sku.competitorShippingFee === 0 ? 'Frete Grátis ✓' : `R$ ${sku.competitorShippingFee.toFixed(2)}`}</strong>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-indigo-200 text-slate-900 font-bold text-sm">
                        <span>Preço Final no Checkout:</span>
                        <strong className="text-indigo-700">R$ {sku.competitorTotalFinalPrice.toFixed(2)}</strong>
                      </div>

                      <div className="pt-2 text-[10px] text-indigo-700">
                        <span>Grade Concorrente: </span>
                        <span className="font-bold text-indigo-950">{sku.competitorAvailableSizes.join(' • ')}</span>
                      </div>
                    </div>

                  </div>

                  {/* Tactical Insight & Counter-Offer Box */}
                  <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3">
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono uppercase font-bold block">
                        🔍 Análise Tática do Caçador (Risco de Troca de Aba: {sku.tabSwitchingDropoffRiskPct}%):
                      </span>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed mt-1">
                        {sku.hunterTacticalRecommendation}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="text-xs">
                        <span className="text-[10px] text-emerald-400 font-mono uppercase font-bold block">
                          🎯 Roteiro de Anúncio / Contra-Oferta no Meta Ads:
                        </span>
                        <p className="text-slate-300 italic text-[11px] mt-0.5">
                          {sku.counterOfferMetaAdHook}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopyCounterOffer(sku)}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                      >
                        {copiedHookId === sku.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedHookId === sku.id ? 'Copiado!' : 'Copiar Roteiro Ads'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* 🎯 2. SUB-TAB: OUTBOUND LEADS */}
      {activeSubTab === 'leads' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.highValueProspects.map((lead) => (
              <div key={lead.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-100 text-blue-900">
                      {lead.niche}
                    </span>
                    <span className="text-xs font-bold text-amber-600 font-mono">ICE: {lead.iceScore}/10</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{lead.brandName}</h4>
                    <span className="text-xs text-slate-400 font-mono">{lead.storeUrl}</span>
                  </div>

                  <div className="p-3 bg-rose-50/70 rounded-xl border border-rose-200 space-y-1 text-xs">
                    <span className="text-[10px] text-rose-700 font-mono uppercase font-bold block">Vazamento Detectado:</span>
                    <p className="text-rose-950 font-medium">{lead.primaryLeakDetected}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500">Recuperação Estimada:</span>
                    <strong className="text-emerald-600 font-bold">R$ {lead.potentialRecoverableRevenue.toLocaleString('pt-BR')}/mês</strong>
                  </div>

                  <button
                    onClick={() => handleCopyHook(lead)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {copiedLeadId === lead.id ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLeadId === lead.id ? 'Gancho Copiado!' : 'Copiar Mensagem WhatsApp'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ⚡ 3. SUB-TAB: EMERGING CRO TRENDS */}
      {activeSubTab === 'trends' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {report.topEmergingTrends.map((trend) => (
              <div key={trend.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-100 text-purple-900">
                      {trend.category}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 font-mono">{trend.globalAdoptionRatePct}% Adoção Global</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-base">{trend.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{trend.description}</p>
                </div>

                <div className="p-3 bg-slate-900 text-white rounded-2xl text-[11px] font-mono space-y-1">
                  <span className="text-[9px] text-amber-400 uppercase font-bold block">Implementação Prática:</span>
                  <p className="text-slate-300 font-sans">{trend.actionableImplementation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
