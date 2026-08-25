import React, { useState } from 'react';
import { 
  Activity, 
  ExternalLink, 
  Video, 
  MousePointerClick, 
  Flame, 
  ShoppingCart, 
  AlertTriangle, 
  DollarSign, 
  Check, 
  Copy, 
  Upload, 
  Sparkles, 
  Info, 
  Layers, 
  ArrowRight,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { generateShopifyTelemetryAnalysis, extractClarityProject } from '../services/shopifyTelemetryService';

interface ShopifyTelemetryViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const ShopifyTelemetryView: React.FC<ShopifyTelemetryViewProps> = ({ diagnostic }) => {
  const { realSiteData } = diagnostic;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [customAov, setCustomAov] = useState<number>(diagnostic.input.averageOrderValue || 159.90);

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
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl text-white shadow-md shadow-indigo-500/20">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Telemetria Real & Comportamento (Shopify + Clarity)</h2>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                clarityDetected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
              }`}>
                {clarityDetected ? '✅ Microsoft Clarity Conectado' : 'Telemetria por Benchmark'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Cruzamento de sessões reais, gravações de tela de usuários e carrinhos abandonados com a auditoria de grade furada do catálogo para identificar o vazamento financeiro exato.
            </p>
          </div>
        </div>

        {/* Global Lost Revenue Metric Card */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Vazamento Financeiro Estimado</p>
            <p className="text-2xl font-black text-rose-400 leading-none mt-0.5">
              R$ {telemetryData.totalEstimatedRevenueLoss.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">~{telemetryData.totalCartAbandonments} carrinhos abandonados</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 🎥 MICROSOFT CLARITY DEEP LINKS DASHBOARD */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Atalhos Diretos para Gravações de Tela (Microsoft Clarity)</h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">Project ID:</span>
            <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">
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
            className="p-4 rounded-xl bg-slate-50 hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 transition-all group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900 group-hover:text-rose-900">Gravações com Rage Clicks</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Usuários clicando repetidamente em tamanhos sem estoque ou botões travados.
              </p>
            </div>
          </a>

          {/* Scroll Heatmaps */}
          <a
            href={telemetryData.clarityInfo.scrollHeatmapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 transition-all group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                <Flame className="w-4 h-4" />
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900 group-hover:text-amber-900">Mapas de Calor de Rolagem</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Veja onde os visitantes param de rolar antes de ver a tabela de medidas.
              </p>
            </div>
          </a>

          {/* Dead Clicks */}
          <a
            href={telemetryData.clarityInfo.deadClicksUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 transition-all group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                <MousePointerClick className="w-4 h-4" />
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900 group-hover:text-blue-900">Cliques Mortos (Dead Clicks)</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Banners e imagens não-clicáveis que frustram o cliente mobile.
              </p>
            </div>
          </a>

          {/* Checkout Drop-offs */}
          <a
            href={telemetryData.clarityInfo.checkoutAbandonmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 transition-all group cursor-pointer space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <div>
              <p className="font-bold text-xs text-slate-900 group-hover:text-emerald-900">Abandono de Checkout</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Sessões de usuários que foram para o pagamento e desistiram.
              </p>
            </div>
          </a>

        </div>
      </div>

      {/* 🛒 SHOPIFY CART ABANDONMENT CORRELATION TABLE */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">
                Cruzamento de SKUs: Grade Furada vs Carrinhos Abandonados
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Produtos que mais perdem vendas por falta de tamanhos (PP ao G2) ou fotos quebradas:
            </p>
          </div>

          <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold rounded-lg flex items-center gap-1.5 self-start sm:self-auto">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>[Simulador Correlacionado com Grade Real]</span>
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3">SKU</th>
                <th className="p-3">Produto & URL Real</th>
                <th className="p-3">Gargalo Identificado</th>
                <th className="p-3 text-center">Abandonos Estimados</th>
                <th className="p-3 text-right">Perda Financeira</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {telemetryData.topLeakingSkus.map((item) => {
                const isCritical = item.primaryReason === 'GRADE_FURADA';

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* SKU */}
                    <td className="p-3 font-mono font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <span>{item.sku}</span>
                        <button
                          onClick={() => handleCopyText(item.id, item.sku)}
                          className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          title="Copiar SKU"
                        >
                          {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    {/* Title & Real Link */}
                    <td className="p-3 max-w-xs">
                      <p className="font-bold text-slate-900 truncate">{item.productTitle}</p>
                      <a
                        href={item.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline truncate block text-[11px] font-mono mt-0.5"
                      >
                        {item.productUrl}
                      </a>
                    </td>

                    {/* Bottleneck */}
                    <td className="p-3">
                      {item.isFullPrintExempt ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md border border-emerald-200">
                          Isento pela Regra _FULL
                        </span>
                      ) : item.missingSizes.length > 0 ? (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold text-[10px] rounded-md border border-rose-200 flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
                          Faltam ({item.missingSizes.join(', ')})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-[10px] rounded-md">
                          Grade Regular
                        </span>
                      )}
                    </td>

                    {/* Abandonments */}
                    <td className="p-3 text-center font-mono font-bold text-slate-700">
                      {item.abandonedCount} carrinhos
                    </td>

                    {/* Revenue Loss */}
                    <td className="p-3 text-right font-mono font-bold text-rose-600">
                      R$ {item.estimatedRevenueLoss.toLocaleString('pt-BR')}
                    </td>

                    {/* Direct Action Link */}
                    <td className="p-3 text-center">
                      <a
                        href={item.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] rounded-lg border border-blue-200 transition-all inline-flex items-center gap-1 cursor-pointer"
                        title="Abrir página na loja"
                      >
                        <span>Abrir</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
