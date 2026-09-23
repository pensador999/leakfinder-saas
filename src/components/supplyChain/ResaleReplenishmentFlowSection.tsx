import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Download, 
  MessageSquare, 
  ExternalLink, 
  Layers, 
  ArrowRight,
  TrendingUp,
  DollarSign,
  Boxes,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';
import { 
  auditResaleReplenishmentFlow, 
  persistReplenishmentStatus, 
  generatePurchaseOrderWhatsApp, 
  exportReplenishmentCsv,
  ResaleReplenishmentItem,
  ReplenishmentPipelineStatus
} from '../../services/supplyChain/resaleReplenishmentFlowEngine';
import { formatBRL } from '../../services/ai/storeFinancialGroundingEngine';
import { CatalogProductIssue } from '../../services/siteInspector';

interface ResaleReplenishmentFlowSectionProps {
  catalogIssues: CatalogProductIssue[];
  domain: string;
  brandName: string;
}

export const ResaleReplenishmentFlowSection: React.FC<ResaleReplenishmentFlowSectionProps> = ({
  catalogIssues,
  domain,
  brandName
}) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const summary = auditResaleReplenishmentFlow(catalogIssues, domain);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | ReplenishmentPipelineStatus>('ALL');

  const handleStatusChange = (itemId: string, newStatus: ReplenishmentPipelineStatus) => {
    persistReplenishmentStatus(domain, itemId, newStatus);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDownloadCsv = () => {
    const csvData = exportReplenishmentCsv(summary.items);
    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ordem_reposicao_revenda_${domain}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenWhatsAppOrder = (item: ResaleReplenishmentItem) => {
    const msg = generatePurchaseOrderWhatsApp(item, brandName);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  const filteredItems = selectedFilter === 'ALL'
    ? summary.items
    : summary.items.filter(i => i.status === selectedFilter);

  const getStatusBadge = (status: ReplenishmentPipelineStatus) => {
    switch (status) {
      case 'RUPTURA_DETECTADA':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Ruptura Detectada</span>;
      case 'PEDIDO_EMITIDO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-400" /> Pedido Emitido</span>;
      case 'EM_TRANSITO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20 flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-[#00BAE2]" /> Em Trânsito</span>;
      case 'RECEBIDO_GALPAO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-purple-500/10 text-purple-300 border border-purple-500/20 flex items-center gap-1"><Boxes className="w-3.5 h-3.5 text-purple-400" /> Recebido no Galpão</span>;
      case 'ESTOQUE_REGULARIZADO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" /> Estoque Regularizado</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner de Gestão Contínua */}
      <div className="p-6 rounded-3xl bg-[#101211] text-[#FFFCE1] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#0AE448]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>Gestão de Lotes de Revenda & Envio Imediato</span>
              </span>
              <span className="px-2.5 py-0.5 bg-[#141716] text-[#BBBAA6] border border-white/10 rounded-full text-xs font-mono">
                Fluxo Contínuo de Recompra
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-[#FFFCE1]">
              Lista de Reposição Contínua: <span className="text-amber-400 font-mono">{summary.totalNeedingReplenishment} produtos</span> requerem ordem de compra
            </h3>

            <p className="text-xs sm:text-sm text-[#BBBAA6] leading-relaxed">
              Camisas com tag <em className="text-white">"Envio Imediato"</em>, linha casual e acessórios de revenda dependem de compras em lotes fechados com fornecedores. Acompanhe cada SKU desde a identificação da ruptura até a chegada física no galpão para liberar o tráfego pago com segurança.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={handleDownloadCsv}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-xs font-black font-mono transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-[#0AE448]" />
              <span>Exportar CSV (ERP)</span>
            </button>
          </div>
        </div>

        {/* Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-center">
          <div className="p-3 bg-[#141716] rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Itens em Revenda</span>
            <span className="text-2xl font-black text-[#FFFCE1] font-mono">{summary.totalResaleProductsAudited}</span>
          </div>
          <div className="p-3 bg-[#141716] rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Peças para Recompra</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{summary.totalSuggestedUnitsToOrder} un</span>
          </div>
          <div className="p-3 bg-[#141716] rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Custo Estimado Lote</span>
            <span className="text-2xl font-black text-[#00BAE2] font-mono">{formatBRL(summary.totalInvestmentRequiredBRL)}</span>
          </div>
          <div className="p-3 bg-[#141716] rounded-2xl border border-white/10">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Receita Protegida</span>
            <span className="text-2xl font-black text-[#0AE448] font-mono">{formatBRL(summary.totalMonthlyRevenueAtRiskBRL)}</span>
          </div>
        </div>
      </div>

      {/* 2. Filtros de Pipeline em Fluxo Contínuo */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-mono font-bold text-[#BBBAA6] uppercase shrink-0 mr-1">Filtrar Estágio:</span>
        {[
          { id: 'ALL', label: `Todos (${summary.items.length})` },
          { id: 'RUPTURA_DETECTADA', label: `Ruptura (${summary.items.filter(i => i.status === 'RUPTURA_DETECTADA').length})` },
          { id: 'PEDIDO_EMITIDO', label: `Pedido Emitido (${summary.items.filter(i => i.status === 'PEDIDO_EMITIDO').length})` },
          { id: 'EM_TRANSITO', label: `Em Trânsito (${summary.items.filter(i => i.status === 'EM_TRANSITO').length})` },
          { id: 'RECEBIDO_GALPAO', label: `No Galpão (${summary.items.filter(i => i.status === 'RECEBIDO_GALPAO').length})` },
          { id: 'ESTOQUE_REGULARIZADO', label: `Regularizado (${summary.items.filter(i => i.status === 'ESTOQUE_REGULARIZADO').length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all shrink-0 cursor-pointer ${
              selectedFilter === tab.id
                ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                : 'bg-[#101211] text-[#BBBAA6] border border-white/10 hover:bg-white/5 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Lista de Produtos & Lotes Sugeridos de Reposição */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-[#101211] rounded-3xl border border-white/10 shadow-xl">
          <CheckCircle2 className="w-12 h-12 text-[#0AE448] mx-auto mb-3" />
          <h4 className="text-base font-black text-[#FFFCE1]">Nenhum produto neste estágio do fluxo.</h4>
          <p className="text-xs text-[#BBBAA6] mt-1">Selecione outro filtro ou altere o status dos itens para acompanhar a reposição.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div key={item.id} className="p-5 sm:p-6 bg-[#101211] rounded-3xl border border-white/10 shadow-xl hover:border-white/20 transition-all space-y-4">
              
              {/* Product Header Row */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {item.imageSrc ? (
                    <img src={item.imageSrc} alt={item.productTitle} className="w-16 h-16 rounded-2xl object-cover border border-white/10 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#141716] flex items-center justify-center shrink-0 border border-white/10 text-[#BBBAA6]">
                      <Package className="w-7 h-7" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#141716] text-[#FFFCE1] rounded-md border border-white/10">
                        SKU: {item.sku}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#00BAE2]/10 text-[#00BAE2] rounded-md border border-[#00BAE2]/20">
                        {item.category.replace(/_/g, ' ')}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>

                    <h4 className="text-base font-bold text-[#FFFCE1] leading-snug">
                      <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#0AE448] inline-flex items-center gap-1.5 transition-colors">
                        {item.productTitle}
                        <ExternalLink className="w-3.5 h-3.5 text-[#BBBAA6]" />
                      </a>
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-[#BBBAA6] font-mono flex-wrap">
                      <span>Preço Varejo: <strong className="text-[#FFFCE1]">{formatBRL(item.price)}</strong></span>
                      <span>•</span>
                      <span>Lote Sugerido: <strong className="text-amber-400">{item.totalSuggestedUnits} peças</strong></span>
                      <span>•</span>
                      <span>Custo de Compra: <strong className="text-[#00BAE2]">{formatBRL(item.estimatedTotalReplenishmentCostBRL)}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Traffic Guard Indicator & WhatsApp PO Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 border ${
                    item.adTrafficAction === 'LIBERAR_TRAFEGO_ESCALA'
                      ? 'bg-[#0AE448]/10 text-[#0AE448] border-[#0AE448]/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {item.adTrafficAction === 'LIBERAR_TRAFEGO_ESCALA' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" />
                        <span>Tráfego Liberado para Escala</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                        <span>Pausar Anúncios na Meta/Google</span>
                      </>
                    )}
                  </span>

                  <button
                    onClick={() => handleOpenWhatsAppOrder(item)}
                    className="px-3.5 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl text-xs font-black font-mono transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#0AE448]/20 cursor-pointer active:scale-95"
                    title="Enviar Ordem de Reposição via WhatsApp para o Fornecedor"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ordem WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Grid Sugerida de Reposição (ABC) */}
              <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono flex-wrap gap-2">
                  <span className="font-bold text-[#FFFCE1] uppercase flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#0AE448]" />
                    Grade Sugerida de Reposição por Tamanho (Curva ABC):
                  </span>
                  <span className="text-[#BBBAA6]">
                    Foco: <strong className="text-white">Tamanhos Centrais M e G (68% da demanda)</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {item.suggestedBatches.map(batch => (
                    <div 
                      key={batch.size} 
                      className={`p-2.5 rounded-xl border text-center font-mono ${
                        batch.isMissingCurrently
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 shadow-xs'
                          : 'bg-[#0E100F] border-white/5 text-[#FFFCE1]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-black text-xs">{batch.size}</span>
                        {batch.isMissingCurrently ? (
                          <span className="text-[9px] px-1 py-0.2 bg-rose-500/20 text-rose-300 font-bold rounded">ESGOTADO</span>
                        ) : (
                          <span className="text-[9px] text-[#BBBAA6]">Ativo</span>
                        )}
                      </div>
                      <div className="text-sm font-black text-[#FFFCE1]">
                        {batch.suggestedQuantity} un
                      </div>
                      <div className="text-[10px] text-[#BBBAA6] mt-0.5">
                        {formatBRL(batch.totalBatchCostEstimated)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Stage Selector (Controle de Fluxo Contínuo) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-[#BBBAA6]">Mover Estágio no Fluxo:</span>
                  <div className="inline-flex rounded-xl border border-white/10 bg-[#141716] p-0.5 flex-wrap">
                    {[
                      { id: 'RUPTURA_DETECTADA', label: '1. Ruptura' },
                      { id: 'PEDIDO_EMITIDO', label: '2. Pedido Emitido' },
                      { id: 'EM_TRANSITO', label: '3. Em Trânsito' },
                      { id: 'RECEBIDO_GALPAO', label: '4. No Galpão' },
                      { id: 'ESTOQUE_REGULARIZADO', label: '5. Regularizado' }
                    ].map(st => (
                      <button
                        key={st.id}
                        onClick={() => handleStatusChange(item.id, st.id as ReplenishmentPipelineStatus)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all cursor-pointer ${
                          item.status === st.id
                            ? 'bg-[#0AE448] text-slate-950 font-black shadow-xs'
                            : 'text-[#BBBAA6] hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-[11px] text-[#BBBAA6] font-mono">
                  Atualizado em: {new Date(item.statusUpdatedAt).toLocaleDateString('pt-BR')} às {new Date(item.statusUpdatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
