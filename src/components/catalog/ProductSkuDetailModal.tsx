// ==============================================================================
// 🔬 PRODUCT SKU DETAIL MODAL — ADSHIELD ENTERPRISE 2026.4
// Detailed inspection of 100% of product variants & SKUs with zero generalization
// ==============================================================================

import React from 'react';
import { 
  X, 
  Layers, 
  CheckCircle2, 
  AlertOctagon, 
  ShieldCheck, 
  Barcode, 
  DollarSign, 
  Factory, 
  ShoppingBag,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { AuditedProductSkuItem, AuditedProductWithSkus } from '../../services/catalog/deepSkuAuditEngine';

interface ProductSkuDetailModalProps {
  product: AuditedProductWithSkus | null;
  onClose: () => void;
}

export const ProductSkuDetailModal: React.FC<ProductSkuDetailModalProps> = ({ product, onClose }) => {
  const [copiedSku, setCopiedSku] = React.useState<string | null>(null);

  if (!product) return null;

  const handleCopySku = (sku: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSku(sku);
    setTimeout(() => setCopiedSku(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between gap-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                <Layers className="w-5 h-5" />
              </span>
              <h3 className="text-base font-bold">{product.title}</h3>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {product.totalSkusCount} Variantes Mapeadas
              </span>
              {product.manufacturingCategory === 'FABRICACAO_PROPRIA' ? (
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                  <Factory className="w-3.5 h-3.5" />
                  <span>Confecção Própria (Sankhya PCP)</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Revenda Homologada (PO Compras)</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <span className="font-mono">URL Pública:</span>
              <a 
                href={product.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-1 truncate max-w-lg"
              >
                <span>{product.url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Mini Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">SKUs em Estoque</span>
            <span className="text-lg font-black text-emerald-600 font-mono block">
              {product.activeSkusCount} / {product.totalSkusCount}
            </span>
            <span className="text-[10px] text-slate-500">{(product.activeSkusCount / (product.totalSkusCount || 1) * 100).toFixed(0)}% de Cobertura</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">SKUs com Ruptura</span>
            <span className="text-lg font-black text-rose-600 font-mono block">
              {product.rupturedSkusCount}
            </span>
            <span className="text-[10px] text-rose-700 font-semibold">Tamanhos Esgotados</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Sangria Mensal Estimada</span>
            <span className="text-lg font-black text-slate-900 font-mono block">
              R$ {product.criticalBleedBrlMonth.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] text-slate-500">R$ {product.criticalBleedBrlDay.toLocaleString('pt-BR')}/dia</span>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Score do Produto</span>
            <span className={`text-lg font-black font-mono block ${
              product.healthScore >= 80 ? 'text-emerald-600' : product.healthScore >= 50 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {product.healthScore} / 100
            </span>
            <span className="text-[10px] text-slate-500">Integridade de Grade</span>
          </div>
        </div>

        {/* SKUs Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 font-mono uppercase tracking-wider">
              Raio-X de Variantes e SKUs Cadastrados
            </h4>
            <span className="text-xs text-slate-400 font-mono">Auditoria 100% Exaustiva</span>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Variante / Tamanho</th>
                  <th className="py-3 px-4 font-bold">Código SKU</th>
                  <th className="py-3 px-4 font-bold">Preço</th>
                  <th className="py-3 px-4 font-bold">Barcode (EAN)</th>
                  <th className="py-3 px-4 font-bold">Demanda BR</th>
                  <th className="py-3 px-4 font-bold">Status Estoque</th>
                  <th className="py-3 px-4 font-bold">Ação Operacional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {product.skus.map((sku) => (
                  <tr key={sku.skuId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-xs border border-slate-200">
                        {sku.variantTitle}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span>{sku.skuCode}</span>
                        <button
                          onClick={() => handleCopySku(sku.skuCode)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                          title="Copiar SKU"
                        >
                          {copiedSku === sku.skuCode ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      R$ {sku.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      {sku.barcode || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                      {sku.sizeDemandWeight}%
                    </td>
                    <td className="py-3 px-4">
                      {sku.available ? (
                        <span className="px-2.5 py-1 rounded-full font-mono font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Em Estoque</span>
                        </span>
                      ) : sku.isFullExempt ? (
                        <span className="px-2.5 py-1 rounded-full font-mono font-bold text-[10px] bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 w-fit">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          <span>Isento (_FULL)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full font-mono font-bold text-[10px] bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit">
                          <AlertOctagon className="w-3 h-3 text-rose-600" />
                          <span>Esgotado</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {sku.operationalAction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            Protocolo de Integridade: Cada SKU é inspecionado individualmente com base em dados reais do catálogo.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer transition-all"
          >
            Fechar Raio-X
          </button>
        </div>

      </div>
    </div>
  );
};
