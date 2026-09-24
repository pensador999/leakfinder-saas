import React, { useState } from 'react';
import { 
  Activity, 
  ExternalLink, 
  Video, 
  MousePointerClick, 
  Flame, 
  ShoppingCart, 
  AlertTriangle, 
  Check, 
  Copy, 
  Info, 
  Layers, 
  TrendingDown, 
  CheckCircle2, 
  Zap, 
  X 
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { generateShopifyTelemetryAnalysis } from '../services/shopifyTelemetryService';
import { OneClickActionModal, OneClickTargetProduct } from './actions/OneClickActionModal';
import { OneClickMitigationService } from '../services/actions/oneClickMitigationService';

interface ShopifyTelemetryViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const ShopifyTelemetryView: React.FC<ShopifyTelemetryViewProps> = ({ diagnostic }) => {
  const { realSiteData } = diagnostic;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedOneClickProduct, setSelectedOneClickProduct] = useState<OneClickTargetProduct | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const telemetryData = generateShopifyTelemetryAnalysis(
    realSiteData.domain,
    realSiteData.catalogAudit?.issues || [],
    realSiteData.rawHtmlSnippet
  );

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clarityDetected = telemetryData.clarityInfo.projectId !== 'Não Detectado';

  return (
    <div className="space-y-6 font-sans text-[#FFFCE1]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md shadow-[#0AE448]/10">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#FFFCE1]">Telemetria & Comportamento (Shopify + Clarity)</h2>
              <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full inline-flex items-center gap-1.5 border ${
                clarityDetected ? 'bg-[#0AE448]/10 text-[#0AE448] border-[#0AE448]/20' : 'bg-white/5 text-[#BBBAA6] border-white/10'
              }`}>
                {clarityDetected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" />}
                <span>{clarityDetected ? 'Microsoft Clarity Conectado' : 'Simulador Dinâmico'}</span>
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              Projeção de perdas em carrinhos baseada no ticket dos SKUs e na severidade de grade furada. Métricas privadas requerem conexão via Shopify Admin API.
            </p>
          </div>
        </div>

        {/* Global Lost Revenue Metric Card */}
        <div className="p-4 bg-[#141716] border border-white/10 text-[#FFFCE1] rounded-2xl flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end shadow-xl">
          <div>
            <p className="text-[10px] uppercase font-bold text-amber-400 font-mono">[Simulador de Impacto]</p>
            <p className="text-[10px] uppercase font-bold text-[#BBBAA6]">Vazamento Estimado em Carrinhos</p>
            <p className="text-2xl font-black text-rose-400 leading-none mt-0.5 font-mono">
              R$ {telemetryData.totalEstimatedRevenueLoss.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] text-[#BBBAA6] mt-1 font-mono">projeção baseada em ~{telemetryData.totalCartAbandonments} desistências</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 🎥 MICROSOFT CLARITY DEEP LINKS DASHBOARD */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#00BAE2]" />
            <h3 className="font-bold text-sm text-[#FFFCE1]">Atalhos Diretos para Gravações de Tela (Microsoft Clarity)</h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#BBBAA6]">Project ID:</span>
            <span className="font-bold text-[#0AE448] bg-[#0E100F] px-2.5 py-0.5 rounded-lg border border-white/10">
              {telemetryData.clarityInfo.projectId}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Rage Clicks */}
          <a
            href={telemetryData.clarityInfo.rageClicksUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-[#141716] hover:bg-white/5 border border-white/10 hover:border-rose-500/30 transition-all group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <ExternalLink className="w-4 h-4 text-[#BBBAA6] group-hover:text-rose-400 transition-colors" />
            </div>
            <div>
              <p className="font-bold text-xs text-[#FFFCE1] group-hover:text-rose-400 transition-colors">Gravações com Rage Clicks</p>
              <p className="text-[11px] text-[#BBBAA6] mt-0.5 leading-relaxed">
                Usuários clicando repetidamente em tamanhos sem estoque ou botões travados.
              </p>
            </div>
          </a>

          {/* Scroll Heatmaps */}
          <a
            href={telemetryData.clarityInfo.scrollHeatmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-[#141716] hover:bg-white/5 border border-white/10 hover:border-amber-500/30 transition-all group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Flame className="w-4 h-4" />
              </div>
              <ExternalLink className="w-4 h-4 text-[#BBBAA6] group-hover:text-amber-400 transition-colors" />
            </div>
            <div>
              <p className="font-bold text-xs text-[#FFFCE1] group-hover:text-amber-400 transition-colors">Mapas de Calor de Rolagem</p>
              <p className="text-[11px] text-[#BBBAA6] mt-0.5 leading-relaxed">
                Veja onde os visitantes param de rolar antes de ver a tabela de medidas.
              </p>
            </div>
          </a>

          {/* Dead Clicks */}
          <a
            href={telemetryData.clarityInfo.deadClicksUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-[#141716] hover:bg-white/5 border border-white/10 hover:border-[#00BAE2]/30 transition-all group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-[#00BAE2]/20 text-[#00BAE2] border border-[#00BAE2]/30">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <ExternalLink className="w-4 h-4 text-[#BBBAA6] group-hover:text-[#00BAE2] transition-colors" />
            </div>
            <div>
              <p className="font-bold text-xs text-[#FFFCE1] group-hover:text-[#00BAE2] transition-colors">Cliques Mortos (Dead Clicks)</p>
              <p className="text-[11px] text-[#BBBAA6] mt-0.5 leading-relaxed">
                Banners e imagens não-clicáveis que frustram o cliente mobile.
              </p>
            </div>
          </a>

          {/* Checkout Drop-offs */}
          <a
            href={telemetryData.clarityInfo.checkoutAbandonmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-[#141716] hover:bg-white/5 border border-white/10 hover:border-[#0AE448]/30 transition-all group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-xl bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <ExternalLink className="w-4 h-4 text-[#BBBAA6] group-hover:text-[#0AE448] transition-colors" />
            </div>
            <div>
              <p className="font-bold text-xs text-[#FFFCE1] group-hover:text-[#0AE448] transition-colors">Abandono de Checkout</p>
              <p className="text-[11px] text-[#BBBAA6] mt-0.5 leading-relaxed">
                Sessões de usuários que foram para o pagamento e desistiram.
              </p>
            </div>
          </a>

        </div>
      </div>

      {/* 🛒 SHOPIFY CART ABANDONMENT CORRELATION TABLE */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#0AE448]" />
              <h3 className="font-bold text-sm text-[#FFFCE1]">
                Cruzamento de SKUs: Grade Furada vs Carrinhos Abandonados
              </h3>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-0.5">
              Produtos que mais perdem vendas por falta de tamanhos (PP ao G2) ou fotos quebradas:
            </p>
          </div>

          <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold rounded-xl flex items-center gap-1.5 self-start sm:self-auto font-mono">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>[Simulador Correlacionado com Grade Real]</span>
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#141716] border-b border-white/10 text-[#BBBAA6] font-mono uppercase text-[10px]">
                <th className="p-3">SKU</th>
                <th className="p-3">Produto & URL Real</th>
                <th className="p-3">Gargalo Identificado</th>
                <th className="p-3 text-center">Abandonos Estimados</th>
                <th className="p-3 text-right">Perda Financeira</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {telemetryData.topLeakingSkus.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    
                    {/* SKU */}
                    <td className="p-3 font-mono font-bold text-[#FFFCE1]">
                      <div className="flex items-center gap-1.5">
                        <span>{item.sku}</span>
                        <button
                          onClick={() => handleCopyText(item.id, item.sku)}
                          className="text-[#BBBAA6] hover:text-[#0AE448] cursor-pointer transition-colors"
                          title="Copiar SKU"
                        >
                          {copiedId === item.id ? <Check className="w-3 h-3 text-[#0AE448]" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    {/* Title & Real Link */}
                    <td className="p-3 max-w-xs">
                      <p className="font-bold text-[#FFFCE1] truncate">{item.productTitle}</p>
                      <a
                        href={item.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00BAE2] hover:underline truncate block text-[11px] font-mono mt-0.5"
                      >
                        {item.productUrl}
                      </a>
                    </td>

                    {/* Bottleneck */}
                    <td className="p-3">
                      {item.categoryType === 'EQUIPAMENTO_PESCA' ? (
                        <span className="px-2 py-0.5 bg-[#00BAE2]/10 text-[#00BAE2] font-bold text-[10px] rounded-md border border-[#00BAE2]/20 font-mono">
                          Equipamento / Tralha
                        </span>
                      ) : item.isResaleAccessory ? (
                        <span className="px-2 py-0.5 bg-white/5 text-[#FFFCE1] font-bold text-[10px] rounded-md border border-white/10 font-mono">
                          Acessório / Tamanho Único
                        </span>
                      ) : item.isFullPrintExempt ? (
                        <span className="px-2 py-0.5 bg-[#0AE448]/10 text-[#0AE448] font-bold text-[10px] rounded-md border border-[#0AE448]/20 font-mono">
                          Isento pela Regra _FULL
                        </span>
                      ) : item.missingSizes.length > 0 ? (
                        <span className="px-2 py-0.5 bg-rose-500/10 text-rose-300 font-bold text-[10px] rounded-md border border-rose-500/20 flex items-center gap-1 w-fit font-mono">
                          <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                          Faltam ({item.missingSizes.join(', ')})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-white/5 text-[#BBBAA6] font-bold text-[10px] rounded-md font-mono">
                          Grade Regular
                        </span>
                      )}
                    </td>

                    {/* Abandonments */}
                    <td className="p-3 text-center font-mono font-bold text-[#BBBAA6]">
                      {item.abandonedCount} carrinhos
                    </td>

                    {/* Revenue Loss */}
                    <td className="p-3 text-right font-mono font-black text-rose-400">
                      R$ {item.estimatedRevenueLoss.toLocaleString('pt-BR')}
                    </td>

                    {/* Direct Action Link */}
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {(item.missingSizes.length > 0 || item.primaryReason === 'SEM_FOTO') && (
                          <button
                            onClick={() => {
                              const shopSlug = OneClickMitigationService.getShopSlug(realSiteData.domain);
                              const directAdminUrl = shopSlug && item.id ? `https://admin.shopify.com/store/${shopSlug}/products/${item.id}` : undefined;
                              setSelectedOneClickProduct({
                                id: item.id,
                                title: item.productTitle,
                                sku: item.sku,
                                price: item.productPrice,
                                url: item.productUrl,
                                adminUrl: directAdminUrl,
                                missingSizes: item.missingSizes,
                                reason: item.primaryReason === 'SEM_FOTO' ? 'MISSING_IMAGE' : 'BROKEN_SIZES'
                              });
                            }}
                            className="px-2.5 py-1 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-[11px] rounded-lg transition-all inline-flex items-center gap-1 cursor-pointer shadow-md shadow-[#0AE448]/20 uppercase tracking-wider"
                            title="1-Clique: Mitigar sangria na Shopify ou Meta Ads"
                          >
                            <Zap className="w-3 h-3" />
                            <span>1-Clique</span>
                          </button>
                        )}
                        <a
                          href={item.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-white/5 hover:bg-white/10 text-[#FFFCE1] font-bold text-[11px] rounded-lg border border-white/10 transition-all inline-flex items-center gap-1 cursor-pointer"
                          title="Abrir página na loja"
                        >
                          <span>Abrir</span>
                          <ExternalLink className="w-3 h-3 text-[#0AE448]" />
                        </a>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ⚡ ONE-CLICK ACTIVE MITIGATION MODAL */}
      {selectedOneClickProduct && (
        <OneClickActionModal
          product={selectedOneClickProduct}
          storeSlug={OneClickMitigationService.getShopSlug(realSiteData.domain)}
          onClose={() => setSelectedOneClickProduct(null)}
          onActionSuccess={(record) => {
            setActionSuccessMessage(`Ação executada: ${record.notes || record.actionType}`);
            setTimeout(() => setActionSuccessMessage(null), 5000);
          }}
        />
      )}

      {/* Toast Feedback */}
      {actionSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-[90] p-4 bg-[#101211] border border-[#0AE448]/50 rounded-2xl shadow-2xl flex items-center gap-3 text-[#FFFCE1] max-w-md animate-slideUp">
          <div className="p-2 bg-[#0AE448]/20 text-[#0AE448] rounded-xl border border-[#0AE448]/30">
            <Check className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium leading-relaxed flex-1">{actionSuccessMessage}</p>
          <button onClick={() => setActionSuccessMessage(null)} className="text-[#BBBAA6] hover:text-[#FFFCE1] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
