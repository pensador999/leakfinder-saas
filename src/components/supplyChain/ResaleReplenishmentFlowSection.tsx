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
  const [copiedItemId, setCopiedItemId] = useState<string | null>(null);

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
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Ruptura Detectada</span>;
      case 'PEDIDO_EMITIDO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-600" /> Pedido Emitido</span>;
      case 'EM_TRANSITO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-blue-600" /> Em Trânsito</span>;
      case 'RECEBIDO_GALPAO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1"><Boxes className="w-3.5 h-3.5 text-indigo-600" /> Recebido no Galpão</span>;
      case 'ESTOQUE_REGULARIZADO':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Estoque Regularizado</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner de Gestão Contínua */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5 text-amber-400" />
                <span>Gestão de Lotes de Revenda & Envio Imediato</span>
              </span>
              <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-xs font-mono">
                Fluxo Contínuo de Recompra
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Lista de Reposição Contínua: <span className="text-amber-400 font-mono">{summary.totalNeedingReplenishment} produtos</span> requerem ordem de compra
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Camisas com tag <em>"Envio Imediato"</em>, linha casual e acessórios de revenda dependem de compras em lotes fechados com fornecedores. Acompanhe cada SKU desde a identificação da ruptura até a chegada física no galpão para liberar o tráfego pago com segurança.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={handleDownloadCsv}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4 text-slate-800" />
              <span>Exportar CSV (ERP)</span>
            </button>
          </div>
        </div>

        {/* Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-center">
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Itens em Revenda</span>
            <span className="text-2xl font-black text-white font-mono">{summary.totalResaleProductsAudited}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Peças para Recompra</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{summary.totalSuggestedUnitsToOrder} un</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Custo Estimado Lote</span>
            <span className="text-2xl font-black text-indigo-300 font-mono">{formatBRL(summary.totalInvestmentRequiredBRL)}</span>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Receita Protegida</span>
            <span className="text-2xl font-black text-emerald-400 font-mono">{formatBRL(summary.totalMonthlyRevenueAtRiskBRL)}</span>
          </div>
        </div>
      </div>

      {/* 2. Filtros de Pipeline em Fluxo Contínuo */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-mono font-bold text-slate-500 uppercase shrink-0 mr-1">Filtrar Estágio:</span>
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
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Lista de Produtos & Lotes Sugeridos de Reposição */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">Nenhum produto neste estágio do fluxo.</h4>
          <p className="text-xs text-slate-500 mt-1">Selecione outro filtro ou altere o status dos itens para acompanhar a reposição.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(item => (
            <div key={item.id} className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-indigo-300 transition-all space-y-4">
              
              {/* Product Header Row */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {item.imageSrc ? (
                    <img src={item.imageSrc} alt={item.productTitle} className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 text-slate-400">
                      <Package className="w-7 h-7" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                        SKU: {item.sku}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
                        {item.category.replace(/_/g, ' ')}
                      </span>
                      {getStatusBadge(item.status)}
                    </div>

                    <h4 className="text-base font-bold text-slate-900 leading-snug">
                      <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 inline-flex items-center gap-1.5 transition-colors">
                        {item.productTitle}
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                      <span>Preço Varejo: <strong className="text-slate-900">{formatBRL(item.price)}</strong></span>
                      <span>•</span>
                      <span>Lote Sugerido: <strong className="text-amber-600">{item.totalSuggestedUnits} peças</strong></span>
                      <span>•</span>
                      <span>Custo de Compra: <strong className="text-indigo-600">{formatBRL(item.estimatedTotalReplenishmentCostBRL)}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Traffic Guard Indicator & WhatsApp PO Button */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 border ${
                    item.adTrafficAction === 'LIBERAR_TRAFEGO_ESCALA'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}>
                    {item.adTrafficAction === 'LIBERAR_TRAFEGO_ESCALA' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tráfego Liberado para Escala</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span>Pausar Anúncios na Meta/Google</span>
                      </>
                    )}
                  </span>

                  <button
                    onClick={() => handleOpenWhatsAppOrder(item)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                    title="Enviar Ordem de Reposição via WhatsApp para o Fornecedor"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ordem WhatsApp</span>
                  </button>
                </div>
              </div>

              {/* Grid Sugerida de Reposição (ABC) */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-700 uppercase flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600" />
                    Grade Sugerida de Reposição por Tamanho (Curva ABC):
                  </span>
                  <span className="text-slate-500">
                    Foco: <strong className="text-slate-800">Tamanhos Centrais M e G (68% da demanda)</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                  {item.suggestedBatches.map(batch => (
                    <div 
                      key={batch.size} 
                      className={`p-2.5 rounded-xl border text-center font-mono ${
                        batch.isMissingCurrently
                          ? 'bg-rose-50/80 border-rose-300 text-rose-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-black text-xs">{batch.size}</span>
                        {batch.isMissingCurrently ? (
                          <span className="text-[9px] px-1 py-0.2 bg-rose-200 text-rose-800 font-bold rounded">ESGOTADO</span>
                        ) : (
                          <span className="text-[9px] text-slate-400">Ativo</span>
                        )}
                      </div>
                      <div className="text-sm font-black text-slate-900">
                        {batch.suggestedQuantity} un
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        {formatBRL(batch.totalBatchCostEstimated)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Stage Selector (Controle de Fluxo Contínuo) */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-slate-500">Mover Estágio no Fluxo:</span>
                  <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-0.5">
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
                            ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
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
