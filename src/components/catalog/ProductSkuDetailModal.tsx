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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-[#101211] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#FFFCE1]">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#141716] text-[#FFFCE1] flex items-start justify-between gap-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-2 bg-[#0AE448]/10 text-[#0AE448] rounded-xl border border-[#0AE448]/20">
                <Layers className="w-5 h-5" />
              </span>
              <h3 className="text-base font-black text-[#FFFCE1]">{product.title}</h3>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-[#101211] text-[#BBBAA6] border border-white/10">
                {product.totalSkusCount} Variantes Mapeadas
              </span>
              {product.manufacturingCategory === 'FABRICACAO_PROPRIA' ? (
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20 flex items-center gap-1">
                  <Factory className="w-3.5 h-3.5" />
                  <span>Confecção Própria (Sankhya PCP)</span>
                </span>
              ) : (
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Revenda Homologada (PO Compras)</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#BBBAA6] pt-1">
              <span className="font-mono">URL Pública:</span>
              <a 
                href={product.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#0AE448] hover:underline flex items-center gap-1 truncate max-w-lg"
              >
                <span>{product.url}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#BBBAA6] hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Mini Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#0E100F] border-b border-white/10 text-xs">
          <div className="p-3 bg-[#141716] rounded-2xl border border-white/10 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">SKUs em Estoque</span>
            <span className="text-lg font-black text-[#0AE448] font-mono block">
              {product.activeSkusCount} / {product.totalSkusCount}
            </span>
            <span className="text-[10px] text-[#BBBAA6]">{(product.activeSkusCount / (product.totalSkusCount || 1) * 100).toFixed(0)}% de Cobertura</span>
          </div>

          <div className="p-3 bg-[#141716] rounded-2xl border border-white/10 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">SKUs com Ruptura</span>
            <span className="text-lg font-black text-rose-400 font-mono block">
              {product.rupturedSkusCount}
            </span>
            <span className="text-[10px] text-rose-400 font-semibold">Tamanhos Esgotados</span>
          </div>

          <div className="p-3 bg-[#141716] rounded-2xl border border-white/10 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Sangria Mensal Estimada</span>
            <span className="text-lg font-black text-rose-400 font-mono block">
              R$ {product.criticalBleedBrlMonth.toLocaleString('pt-BR')}
            </span>
            <span className="text-[10px] text-[#BBBAA6]">R$ {product.criticalBleedBrlDay.toLocaleString('pt-BR')}/dia</span>
          </div>

          <div className="p-3 bg-[#141716] rounded-2xl border border-white/10 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Score do Produto</span>
            <span className={`text-lg font-black font-mono block ${
              product.healthScore >= 80 ? 'text-[#0AE448]' : product.healthScore >= 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {product.healthScore} / 100
            </span>
            <span className="text-[10px] text-[#BBBAA6]">Integridade de Grade</span>
          </div>
        </div>

        {/* SKUs Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-[#FFFCE1] font-mono uppercase tracking-wider">
              Raio-X de Variantes e SKUs Cadastrados
            </h4>
            <span className="text-xs text-[#0AE448] font-mono">Auditoria 100% Exaustiva</span>
          </div>

          <div className="border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#141716] text-[#BBBAA6] font-mono text-[10px] uppercase border-b border-white/10">
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
              <tbody className="divide-y divide-white/5">
                {product.skus.map((sku) => (
                  <tr key={sku.skuId} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#FFFCE1]">
                      <span className="px-2.5 py-1 rounded-lg bg-[#141716] font-mono text-xs border border-white/10">
                        {sku.variantTitle}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#FFFCE1]">
                      <div className="flex items-center gap-1.5">
                        <span>{sku.skuCode}</span>
                        <button
                          onClick={() => handleCopySku(sku.skuCode)}
                          className="p-1 text-[#BBBAA6] hover:text-white rounded transition-colors cursor-pointer"
                          title="Copiar SKU"
                        >
                          {copiedSku === sku.skuCode ? <Check className="w-3 h-3 text-[#0AE448]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#0AE448]">
                      R$ {sku.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 font-mono text-[#BBBAA6] text-[11px]">
                      {sku.barcode || '—'}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-[#FFFCE1]">
                      {sku.sizeDemandWeight}%
                    </td>
                    <td className="py-3 px-4">
                      {sku.available ? (
                        <span className="px-2.5 py-1 rounded-full font-mono font-bold text-[10px] bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-[#0AE448]" />
                          <span>Em Estoque</span>
                        </span>
                      ) : sku.isFullExempt ? (
                        <span className="px-2.5 py-1 rounded-full font-mono font-bold text-[10px] bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20 flex items-center gap-1 w-fit">
                          <ShieldCheck className="w-3 h-3 text-[#00BAE2]" />
                          <span>Isento (_FULL)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full font-mono font-bold text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit">
                          <AlertOctagon className="w-3 h-3 text-rose-400" />
                          <span>Esgotado</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#BBBAA6] text-[11px]">
                      {sku.operationalAction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#141716] border-t border-white/10 flex items-center justify-between text-xs">
          <span className="text-[#BBBAA6] font-mono">
            Protocolo de Integridade: Cada SKU é inspecionado individualmente com base em dados reais do catálogo.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl font-black cursor-pointer transition-all shadow-md shadow-[#0AE448]/20"
          >
            Fechar Raio-X
          </button>
        </div>

      </div>
    </div>
  );
};
