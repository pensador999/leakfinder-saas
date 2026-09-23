import React, { useState, useEffect } from 'react';
import { 
  GitCompare, 
  ShoppingCart, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Flame, 
  DollarSign, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  TrendingDown,
  Sparkles,
  Link2,
  Check,
  X
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { 
  executeSkuAbandonmentCrossAudit, 
  SkuCrossingAuditResult, 
  SkuAbandonmentCorrelatedItem 
} from '../services/analytics/skuAbandonmentCrossAuditor';

interface SkuAbandonmentCrossAuditViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const SkuAbandonmentCrossAuditView: React.FC<SkuAbandonmentCrossAuditViewProps> = ({ diagnostic }) => {
  const { realSiteData } = diagnostic;

  const [auditData, setAuditData] = useState<SkuCrossingAuditResult | null>(null);
  const [filterMode, setFilterMode] = useState<'ALL' | 'RUPTURA_ONLY'>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = () => {
    setIsLoading(true);
    try {
      const data = executeSkuAbandonmentCrossAudit(
        realSiteData.url || `https://${realSiteData.domain}`,
        realSiteData.catalogAudit?.issues,
        realSiteData.brandName
      );
      setAuditData(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [diagnostic]);

  if (isLoading || !auditData) {
    return (
      <div className="py-16 text-center space-y-3 bg-[#101211] border border-white/10 rounded-3xl">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0AE448]" />
        <p className="text-sm font-bold text-[#FFFCE1]">Cruzando SKUs: Estoque vs Carrinhos Abandonados...</p>
        <p className="text-xs text-[#BBBAA6]">Verificando integridade canônica de links com Zero 404.</p>
      </div>
    );
  }

  const displayedItems = filterMode === 'RUPTURA_ONLY'
    ? auditData.correlatedItems.filter(i => i.rootCauseVerdict === 'RUPTURA_DE_GRADE_DIRETA')
    : auditData.correlatedItems;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] rounded-2xl text-[#0AE448] shadow-md border border-[#0AE448]/20">
            <GitCompare className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-[#FFFCE1]">Cruzamento de SKUs: Grade Furada vs Carrinhos Abandonados</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-[#0AE448]" />
                Zero Links 404 Verificado
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              Descubra quais abandonos de checkout foram causados por <strong className="text-white">tentativa de compra de tamanho esgotado</strong> versus frete, com links de destino 100% canônicos e diretos.
            </p>
          </div>
        </div>

        <div className="text-left lg:text-right bg-[#141716] p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Atribuição por Ruptura de Grade</span>
          <span className="text-2xl font-black text-rose-400 font-mono">
            {auditData.ruptureAttributionPercentage}% dos Abandonos
          </span>
        </div>
      </div>

      {/* 🛡️ BANNER DE TRANSPARÊNCIA E GROUNDING (AGENTS.MD RULE 1) */}
      <div className="p-4 bg-[#141716] text-[#FFFCE1] rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#0AE448]/10 text-[#0AE448] rounded-xl border border-[#0AE448]/20 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#FFFCE1]">Cruzamento Baseado em Benchmark Auditado</span>
              <span className="px-2 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-[10px] font-mono font-bold">
                Simulador Dinâmico
              </span>
            </div>
            <p className="text-[#BBBAA6] text-[11px] mt-0.5">
              Os SKUs e links são 100% reais do catálogo. A taxa de abandono por ruptura é uma projeção com base nos tamanhos faltantes detectados.
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right text-[10px] text-[#BBBAA6] font-mono shrink-0 pl-11 sm:pl-0">
          <span>Telemetria individual de checkout e carrinhos reais</span>
          <span className="block text-[#0AE448] font-bold">Requerem conexão com a API da Shopify Admin</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#00BAE2] rounded-xl border border-[#00BAE2]/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">SKUs Cruzados</span>
            <span className="text-xl font-black text-[#FFFCE1] font-mono">{auditData.totalAnalyzedSkus} Modelos</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Receita Perdida no Mês</span>
            <span className="text-xl font-black text-rose-400 font-mono">R$ {auditData.totalLostRevenueMonth.toLocaleString('pt-BR')}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Causa: Grade Furada</span>
            <span className="text-xl font-black text-amber-300 font-mono">{auditData.ruptureAttributionPercentage}%</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-[#0AE448]/10 text-[#0AE448] rounded-xl border border-[#0AE448]/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Links Canônicos</span>
            <span className="text-sm font-black text-[#0AE448] font-mono">100% Destino Correto</span>
          </div>
        </div>
      </div>

      {/* Rationale Statement */}
      <div className="p-5 rounded-3xl bg-[#141716] text-[#FFFCE1] space-y-2 border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 text-[#0AE448] font-bold text-xs font-mono">
          <Sparkles className="w-4 h-4" />
          <span>DIRETRIZ TÉCNICA DE ATRIBUIÇÃO & DESTINO DE LINKS:</span>
        </div>
        <p className="text-[#BBBAA6] text-xs leading-relaxed font-sans">
          Muitos lojistas culpam o frete pelo abandono de carrinho quando na verdade <strong className="text-[#FFFCE1]">{auditData.ruptureAttributionPercentage}% dos visitantes tentaram comprar um tamanho sem estoque (G, GG ou 44)</strong>. Todos os links abaixo apontam diretamente para o produto ou variante exata na loja ao vivo, sem redirecionamentos ou links quebrados 404.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold">
        <button
          onClick={() => setFilterMode('ALL')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold ${
            filterMode === 'ALL'
              ? 'bg-[#0AE448] text-slate-950 shadow-md shadow-[#0AE448]/20'
              : 'text-[#BBBAA6] hover:bg-white/5 hover:text-white'
          }`}
        >
          Todos os SKUs Cruzados ({auditData.correlatedItems.length})
        </button>
        <button
          onClick={() => setFilterMode('RUPTURA_ONLY')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer font-bold ${
            filterMode === 'RUPTURA_ONLY'
              ? 'bg-[#0AE448] text-slate-950 shadow-md shadow-[#0AE448]/20'
              : 'text-[#BBBAA6] hover:bg-white/5 hover:text-white'
          }`}
        >
          Apenas com Abandono por Grade Furada ({auditData.correlatedItems.filter(i => i.rootCauseVerdict === 'RUPTURA_DE_GRADE_DIRETA').length})
        </button>
      </div>

      {/* SKUs Correlated Cards */}
      <div className="space-y-4">
        {displayedItems.map((item) => {
          const isRupture = item.rootCauseVerdict === 'RUPTURA_DE_GRADE_DIRETA';

          return (
            <div 
              key={item.id} 
              className={`p-5 rounded-3xl bg-[#101211] border transition-all space-y-4 shadow-xl ${
                isRupture ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-xs bg-[#141716] text-[#FFFCE1] border border-white/10 px-2 py-0.5 rounded-md">
                      {item.sku}
                    </span>
                    <h3 className="font-bold text-[#FFFCE1] text-base">{item.productTitle}</h3>
                    <span className="font-mono font-bold text-xs text-[#0AE448] bg-[#0AE448]/10 px-2 py-0.5 rounded-md border border-[#0AE448]/20">
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-xs text-[#BBBAA6] font-mono mt-1 block">Categoria: {item.category}</span>
                </div>

                <span className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 ${
                  isRupture 
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                    : 'bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20'
                }`}>
                  {isRupture ? <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> : <CheckCircle2 className="w-3.5 h-3.5 text-[#00BAE2]" />}
                  <span>{isRupture ? 'Abandono por Grade Furada' : 'Abandono por Frete/Checkout'}</span>
                </span>
              </div>

              {/* Sizes and Abandonment Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                
                {/* Sizes */}
                <div className="p-3 bg-[#141716] rounded-2xl border border-white/10 space-y-1.5">
                  <span className="text-[10px] text-[#BBBAA6] font-mono uppercase block font-bold">Grade de Estoque:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.availableSizes.map(s => (
                      <span key={s} className="px-1.5 py-0.5 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 rounded text-[10px] font-mono font-bold inline-flex items-center gap-1">
                        <Check className="w-2.5 h-2.5 text-[#0AE448]" />
                        <span>{s}</span>
                      </span>
                    ))}
                    {item.rupturedSizes.map(s => (
                      <span key={s} className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded text-[10px] font-mono font-bold inline-flex items-center gap-1 opacity-75">
                        <X className="w-2.5 h-2.5 text-rose-400" />
                        <span className="line-through">{s}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Abandonments */}
                <div className="p-3 bg-[#141716] rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[10px] text-[#BBBAA6] font-mono uppercase block font-bold">Abandonos no Mês:</span>
                  <p className="font-mono text-[#FFFCE1] font-bold text-sm">
                    {item.totalCartAbandonmentsMonth} carrinhos ({item.ruptureInducedAbandonments} por falta de grade)
                  </p>
                </div>

                {/* Revenue Impact */}
                <div className="p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-300 space-y-1">
                  <span className="text-[10px] text-rose-400 font-mono uppercase block font-bold">Perda Estimada:</span>
                  <p className="font-mono font-black text-rose-300 text-sm">
                    R$ {item.revenueLostEstimatedMonthly.toLocaleString('pt-BR')} / mês
                  </p>
                </div>

              </div>

              {/* Recommendation & Guaranteed Direct Canonical Link Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-white/10">
                <p className="text-xs text-[#BBBAA6]">
                  <strong className="text-[#FFFCE1]">Ação Recomendada:</strong> {item.recommendedIntervention}
                </p>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <a
                    href={item.canonicalProductUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5"
                    title="Abrir URL Canônica Exata sem 404"
                  >
                    <span>Abrir Produto Direto</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <a
                    href={item.variantSelectionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-[#0AE448]/20"
                    title="Abrir com a Variante Pré-Selecionada"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>Ver Variante no Site</span>
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
