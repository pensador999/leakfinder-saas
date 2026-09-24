import React, { useState } from 'react';
import { 
  TrendingUp, 
  ExternalLink, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Scale, 
  Flame, 
  Store, 
  ShoppingBag 
} from 'lucide-react';
import { 
  conductMarketPriceStudy, 
  ProductMarketComparisonItem, 
  PricePositionStatus 
} from '../../services/ai/productPriceMarketBenchmarkEngine';
import { CatalogProductIssue } from '../../services/siteInspector';
import { formatBRL } from '../../services/ai/storeFinancialGroundingEngine';

interface ProductMarketPriceBenchmarkViewProps {
  catalogIssues: CatalogProductIssue[];
  domain: string;
  brandName: string;
}

export const ProductMarketPriceBenchmarkView: React.FC<ProductMarketPriceBenchmarkViewProps> = ({
  catalogIssues,
  domain,
  brandName
}) => {
  const study = conductMarketPriceStudy(catalogIssues, domain, brandName);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PROFIT_LIFT' | 'ARBITRAGE' | 'ABOVE_MARKET'>('ALL');
  const [selectedItem, setSelectedItem] = useState<ProductMarketComparisonItem | null>(study.items[0] || null);

  const filteredItems = study.items.filter(item => {
    if (selectedFilter === 'PROFIT_LIFT') return item.positioning === 'MUITO_ABAIXO_DO_MERCADO';
    if (selectedFilter === 'ARBITRAGE') return item.positioning === 'ARBITRAGEM_ESTOQUE_OURO';
    if (selectedFilter === 'ABOVE_MARKET') return item.positioning === 'ACIMA_DO_MERCADO';
    return true;
  });

  const getPositioningBadge = (pos: PricePositionStatus) => {
    switch (pos) {
      case 'ARBITRAGEM_ESTOQUE_OURO':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Arbitragem de Estoque
          </span>
        );
      case 'MUITO_ABAIXO_DO_MERCADO':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-[#0AE448]" />
            Oportunidade de Margem
          </span>
        );
      case 'ACIMA_DO_MERCADO':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            Acima do Mercado
          </span>
        );
      case 'COMPETITIVO_ALINHADO':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/30 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00BAE2]" />
            Paridade Competitiva
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFCE1]">
      
      {/* 1. Header do Estudo de Mercado */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#141716] via-[#101211] to-[#141716] border border-white/10 text-[#FFFCE1] shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                <span>Estudo de Mercado & Inteligência Competitiva de Preços</span>
              </span>
              <span className="px-2.5 py-0.5 bg-white/5 text-[#BBBAA6] border border-white/10 rounded-full text-xs font-mono">
                Pareamento Cruzado Produto a Produto
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Índice de Preços: <span className="text-[#0AE448] font-mono">{study.marketCompetitivenessIndex}%</span> da média dos concorrentes diretos
            </h3>

            <p className="text-xs sm:text-sm text-[#BBBAA6] leading-relaxed">
              {study.executiveSummary}
            </p>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0 text-center">
            <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Lucro Adicional Possível</span>
              <span className="text-2xl sm:text-3xl font-black text-[#0AE448] font-mono">
                {formatBRL(study.potentialProfitGainFromRepricingMonthlyBRL)}
              </span>
              <span className="text-[10px] text-[#0AE448] block font-mono">via reprecificação segura</span>
            </div>

            <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 shadow-xl">
              <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Arbitragens de Estoque</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                {study.totalArbitrageOpportunitiesCount} SKUs
              </span>
              <span className="text-[10px] text-amber-300 block font-mono">concorrentes esgotados</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filtros Rápidos */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-mono font-bold text-[#BBBAA6] uppercase shrink-0 mr-1">Filtrar Visão:</span>
        {[
          { id: 'ALL', label: `Todos os Produtos (${study.items.length})` },
          { id: 'PROFIT_LIFT', label: `Oportunidade de Subir Preço (${study.items.filter(i => i.positioning === 'MUITO_ABAIXO_DO_MERCADO').length})` },
          { id: 'ARBITRAGE', label: `Concorrente Esgotado (${study.items.filter(i => i.positioning === 'ARBITRAGEM_ESTOQUE_OURO').length})` },
          { id: 'ABOVE_MARKET', label: `Acima do Mercado (${study.items.filter(i => i.positioning === 'ACIMA_DO_MERCADO').length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all shrink-0 cursor-pointer border ${
              selectedFilter === tab.id
                ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] font-black shadow-lg shadow-[#0AE448]/20'
                : 'bg-[#101211] text-[#BBBAA6] border-white/10 hover:bg-white/5 hover:text-[#FFFCE1]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Grid Lado a Lado: Produtos Pareados */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Coluna Esquerda: Lista de Produtos Comparados (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#BBBAA6] px-1">
            <span>SELECIONE UM PRODUTO</span>
            <span>{filteredItems.length} ITENS ANALISADOS</span>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {filteredItems.map(item => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#141716] border-[#0AE448] shadow-2xl ring-1 ring-[#0AE448]' 
                      : 'bg-[#101211] border-white/10 hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {item.yourImageSrc ? (
                      <img src={item.yourImageSrc} alt={item.yourProductTitle} className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0" />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 text-[#BBBAA6]">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold bg-white/5 text-[#FFFCE1] px-1.5 py-0.5 rounded border border-white/5">
                          {item.yourSku}
                        </span>
                        {getPositioningBadge(item.positioning)}
                      </div>

                      <h4 className="text-xs font-bold text-[#FFFCE1] truncate" title={item.yourProductTitle}>
                        {item.yourProductTitle}
                      </h4>

                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-black text-[#0AE448]">{formatBRL(item.yourPrice)}</span>
                        <span className="text-[#BBBAA6]">Média: {formatBRL(item.marketAveragePrice)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coluna Direita: Raio-X Detalhado do Pareamento de Concorrentes (7 cols) */}
        <div className="lg:col-span-7">
          {selectedItem ? (
            <div className="p-6 bg-[#101211] rounded-3xl border border-white/10 shadow-2xl space-y-6 sticky top-6 text-[#FFFCE1]">
              
              {/* Top Title Row */}
              <div className="space-y-2 border-b border-white/10 pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-mono font-bold text-[#00BAE2] bg-[#00BAE2]/10 px-2.5 py-1 rounded-md border border-[#00BAE2]/20">
                    Categoria: {selectedItem.category}
                  </span>
                  {getPositioningBadge(selectedItem.positioning)}
                </div>

                <h3 className="text-lg font-black text-[#FFFCE1]">
                  {selectedItem.yourProductTitle}
                </h3>

                <div className="flex items-center gap-4 text-xs font-mono text-[#BBBAA6]">
                  <span>Preço Atual: <strong className="text-[#FFFCE1] text-sm">{formatBRL(selectedItem.yourPrice)}</strong></span>
                  <span>•</span>
                  <span>Média de Mercado: <strong className="text-[#0AE448] text-sm">{formatBRL(selectedItem.marketAveragePrice)}</strong></span>
                  <span>•</span>
                  <span>Faixa: <strong>{formatBRL(selectedItem.marketMinPrice)} – {formatBRL(selectedItem.marketMaxPrice)}</strong></span>
                </div>
              </div>

              {/* Strategic Advice Card */}
              <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0AE448] font-mono uppercase">
                  <Sparkles className="w-4 h-4 text-[#0AE448]" />
                  <span>Diagnóstico Estratégico de Precificação</span>
                </div>
                <p className="text-xs text-[#BBBAA6] leading-relaxed">
                  {selectedItem.explanation}
                </p>

                {selectedItem.monthlyProfitLiftPotentialBRL > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-[#BBBAA6]">Sugestão de Reprecificação Inteligente:</span>
                    <span className="text-[#0AE448] font-black">
                      Subir para {formatBRL(selectedItem.recommendedPriceBRL)} (+{formatBRL(selectedItem.monthlyProfitLiftPotentialBRL)}/mês de lucro)
                    </span>
                  </div>
                )}
              </div>

              {/* Concorrentes Pareados Lado a Lado */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#BBBAA6] uppercase font-mono flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-[#00BAE2]" />
                  <span>Lojas Concorrentes & Produtos Idênticos/Equivalentes:</span>
                </h4>

                <div className="space-y-2.5">
                  {selectedItem.competitors.map((comp, idx) => {
                    const diffIsPositive = comp.priceDifferenceBRL > 0;
                    return (
                      <div key={idx} className="p-4 bg-[#141716] rounded-2xl border border-white/10 shadow-xl hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <strong className="text-xs font-bold text-[#FFFCE1]">{comp.competitorBrand}</strong>
                            <span className="text-[10px] font-mono text-[#BBBAA6]">({comp.competitorStoreUrl.replace(/^https?:\/\//, '')})</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                              comp.isCompetitorInStock ? 'bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                            }`}>
                              {comp.isCompetitorInStock ? 'Em Estoque' : 'Esgotado / Ruptura'}
                            </span>
                          </div>

                          <p className="text-xs text-[#00BAE2] font-medium">
                            <a href={comp.matchedProductUrl} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1">
                              {comp.matchedProductTitle}
                              <ExternalLink className="w-3 h-3 text-[#BBBAA6]" />
                            </a>
                          </p>
                        </div>

                        {/* Price & Spread */}
                        <div className="text-right shrink-0 w-full sm:w-auto border-t border-white/5 sm:border-t-0 pt-2 sm:pt-0">
                          <span className="text-sm font-black text-[#FFFCE1] font-mono block">
                            {formatBRL(comp.competitorPrice)}
                          </span>
                          <span className={`text-[11px] font-mono font-bold ${
                            diffIsPositive ? 'text-rose-400' : 'text-[#0AE448]'
                          }`}>
                            {diffIsPositive ? `+${formatBRL(comp.priceDifferenceBRL)} (+${comp.priceDifferencePercent}%)` : `${formatBRL(comp.priceDifferenceBRL)} (${comp.priceDifferencePercent}%)`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-[#101211] rounded-3xl border border-white/10 text-[#BBBAA6]">
              <Scale className="w-12 h-12 text-[#BBBAA6]/40 mx-auto mb-3" />
              <h4 className="text-base font-bold text-[#FFFCE1]">Selecione um produto para visualizar o estudo detalhado.</h4>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
