import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  ExternalLink, 
  Power, 
  RotateCcw, 
  AlertTriangle,
  ArrowRight,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { OneClickMitigationService, MitigationActionRecord } from '../../services/actions/oneClickMitigationService';

export interface OneClickTargetProduct {
  id: string;
  title: string;
  sku: string;
  barcode?: string;
  price?: number | string;
  url?: string;
  adminUrl?: string;
  imageSrc?: string;
  hasValidImage?: boolean;
  missingSizes?: string[];
  reason: 'MISSING_IMAGE' | 'BROKEN_SIZES';
}

interface OneClickActionModalProps {
  product: OneClickTargetProduct;
  storeSlug?: string;
  onClose: () => void;
  onActionSuccess?: (record: MitigationActionRecord) => void;
}

export const OneClickActionModal: React.FC<OneClickActionModalProps> = ({
  product,
  storeSlug,
  onClose,
  onActionSuccess
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<MitigationActionRecord | null>(null);
  const [currentStatus, setCurrentStatus] = useState<'ACTIVE' | 'DRAFT'>(() => {
    return OneClickMitigationService.getProductStatusOverride(product.id) || 'ACTIVE';
  });

  const isMissingImage = product.reason === 'MISSING_IMAGE';
  const numericPrice = typeof product.price === 'string' ? parseFloat(product.price) || 169.90 : product.price || 169.90;
  const estimatedMonthlyBleed = numericPrice * 25;

  const handleSetDraft = async () => {
    setLoadingAction('DRAFT');
    try {
      const res = await OneClickMitigationService.setShopifyProductDraft({
        productId: product.id,
        productTitle: product.title,
        sku: product.sku,
        storeSlug: storeSlug || 'store',
        adminUrl: product.adminUrl,
        productUrl: product.url
      });
      setCurrentStatus('DRAFT');
      setLastAction(res.record);
      if (onActionSuccess) onActionSuccess(res.record);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRestoreActive = async () => {
    setLoadingAction('RESTORE');
    try {
      await OneClickMitigationService.restoreShopifyProductActive({
        productId: product.id,
        productTitle: product.title,
        storeSlug: storeSlug || 'store'
      });
      setCurrentStatus('ACTIVE');
      setLastAction(null);
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePauseMetaAd = async () => {
    setLoadingAction('META_PAUSE');
    try {
      const res = await OneClickMitigationService.pauseMetaAd({
        adId: `ad_${product.sku}`,
        adName: `DABA Dinâmico - ${product.title}`,
        sku: product.sku,
        productTitle: product.title,
        dailyBudgetBRL: Math.round(estimatedMonthlyBleed / 30)
      });
      setLastAction(res.record);
      if (onActionSuccess) onActionSuccess(res.record);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isMissingImage ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Ação Corretiva de 1-Clique
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Escudo Ativo
                </span>
              </h3>
              <p className="text-xs text-slate-400">Neutralize a queima de tráfego pago instantaneamente</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Details Card */}
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
              {product.hasValidImage && product.imageSrc ? (
                <img src={product.imageSrc} alt={product.title} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-1">
                  <ShieldAlert className="w-6 h-6 text-amber-400 mx-auto" />
                  <span className="text-[9px] text-amber-300 font-bold block">SEM FOTO</span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate" title={product.title}>
                {product.title}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs">
                <span className="font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  SKU: {product.sku}
                </span>
                {product.barcode && (
                  <span className="font-mono bg-slate-800/80 text-slate-400 px-2 py-0.5 rounded">
                    EAN: {product.barcode}
                  </span>
                )}
                <span className="text-emerald-400 font-bold">
                  R$ {numericPrice.toFixed(2)}
                </span>
              </div>

              {/* Status Badge */}
              <div className="mt-2.5 flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  currentStatus === 'DRAFT' 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${currentStatus === 'DRAFT' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  Status Loja: {currentStatus === 'DRAFT' ? 'Rascunho (Oculto)' : 'Ativo na Vitrine'}
                </span>

                {product.missingSizes && product.missingSizes.length > 0 && (
                  <span className="text-[11px] bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/20 font-medium">
                    Falta: {product.missingSizes.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bleed Warning Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-rose-950/40 to-amber-950/20 border border-rose-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <div>
                <span className="text-xs font-semibold text-rose-200 block">Sangria Estimada em Tráfego Pago:</span>
                <span className="text-[11px] text-rose-300/80">Tráfego de anúncios sendo enviado para item sem foto ou rompido</span>
              </div>
            </div>
            <span className="text-base font-black text-rose-400 whitespace-nowrap">
              ~R$ {estimatedMonthlyBleed.toLocaleString('pt-BR')}/mês
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Selecione a Ação Imediata:</p>

            {/* Action 1: Shopify Draft */}
            {currentStatus === 'ACTIVE' ? (
              <button
                onClick={handleSetDraft}
                disabled={loadingAction !== null}
                className="w-full group p-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all flex items-center justify-between shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-700/50">
                    <Power className="w-4 h-4 text-emerald-200" />
                  </div>
                  <div className="text-left">
                    <span className="block leading-tight font-bold">1-Clique: Colocar em Rascunho (Shopify)</span>
                    <span className="text-[11px] text-emerald-100 font-normal">Oculta do site e remove dos feeds de anúncios</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={handleRestoreActive}
                disabled={loadingAction !== null}
                className="w-full p-3.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-semibold text-sm transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <div className="text-left">
                    <span className="block leading-tight font-bold">Desfazer: Reativar Produto na Shopify</span>
                    <span className="text-[11px] text-slate-400">Volta o produto para a vitrine pública</span>
                  </div>
                </div>
                <span className="text-xs text-emerald-400 font-bold">Reverter</span>
              </button>
            )}

            {/* Action 2: Meta Ads Kill-Switch */}
            <button
              onClick={handlePauseMetaAd}
              disabled={loadingAction !== null}
              className="w-full group p-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-indigo-500/30 text-white font-semibold text-sm transition-all flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="block leading-tight font-bold">1-Clique: Pausar Anúncio no Meta Ads</span>
                  <span className="text-[11px] text-slate-400">Kill-Switch de criativos e anúncios dinâmicos deste SKU</span>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-400 px-2 py-1 rounded bg-indigo-500/10">Pausar</span>
            </button>

            {/* Action 3: Direct Admin Deep Link */}
            {product.adminUrl && (
              <a
                href={product.adminUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800 text-slate-300 border border-slate-700/60 text-xs font-medium transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                <span>Abrir Tela de Edição no Painel Shopify Admin</span>
              </a>
            )}
          </div>

          {/* Feedback & Confirmation */}
          {lastAction && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div className="text-xs text-emerald-300 leading-tight">
                <span className="font-bold block">Ação Executada com Sucesso!</span>
                {lastAction.notes}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Audit trail registrado com carimbo de segurança
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
