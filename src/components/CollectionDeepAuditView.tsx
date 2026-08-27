import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Layers, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  RefreshCw, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  Tag, 
  ChevronRight,
  TrendingUp,
  Store,
  LayoutGrid,
  Link2,
  ArrowRight
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { 
  auditSpecificCollection, 
  CollectionAuditResult 
} from '../services/collectionDeepInspector';

interface CollectionDeepAuditViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const CollectionDeepAuditView: React.FC<CollectionDeepAuditViewProps> = ({ diagnostic }) => {
  const { realSiteData } = diagnostic;

  const [auditData, setAuditData] = useState<CollectionAuditResult | null>(null);
  const [selectedHandle, setSelectedHandle] = useState<string>('camisas-work');
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [successFeedback, setSuccessFeedback] = useState<string>('');

  const loadCollectionData = async (handleOrUrl?: string) => {
    setIsLoading(true);
    try {
      const data = await auditSpecificCollection(
        realSiteData.url || `https://${realSiteData.domain}`,
        handleOrUrl || selectedHandle
      );
      setAuditData(data);
      if (handleOrUrl) {
        setSelectedHandle(data.selectedCollection.collectionHandle);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCollectionData();
  }, [diagnostic]);

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;

    loadCollectionData(customUrlInput.trim());
    setSuccessFeedback(`Coleção customizada "${customUrlInput.trim()}" auditada com sucesso!`);
    setCustomUrlInput('');
    setTimeout(() => setSuccessFeedback(''), 4000);
  };

  if (isLoading || !auditData) {
    return (
      <div className="py-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <p className="text-sm font-bold text-slate-700">Auditando Coleção & Vínculos de Hero Banner...</p>
        <p className="text-xs text-slate-400">Inspecionando estoque e grade produto por produto na coleção selecionada.</p>
      </div>
    );
  }

  const { selectedCollection, allDetectedCollections } = auditData;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-blue-900 to-indigo-950 rounded-2xl text-blue-400 shadow-md shadow-blue-950/30 border border-blue-800">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Auditoria Granular de Coleções & Banners</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                Coleção em Foco
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Cole o link de **qualquer coleção ou categoria** de e-commerce para auditar a grade de estoque e tráfego de anúncios daquela seção específica.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Saúde da Coleção</span>
          <span className={`text-2xl font-black font-mono ${
            selectedCollection.collectionHealthScore >= 80 ? 'text-emerald-600' : 'text-amber-600'
          }`}>
            {selectedCollection.collectionHealthScore}/100
          </span>
        </div>
      </div>

      {/* 🔗 ATTACH CUSTOM COLLECTION URL BAR */}
      <div className="p-5 bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl text-white shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2 text-blue-300">
            <Link2 className="w-4 h-4" />
            Anexar Link de Coleção Personalizada para Auditar
          </h3>
          <span className="text-[10px] text-slate-300 font-mono">Suporta qualquer URL /collections/...</span>
        </div>

        <form onSubmit={handleCustomUrlSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            required
            placeholder="Ex: https://www.brkagro.com.br/collections/camisas-work ou qualquer loja..."
            value={customUrlInput}
            onChange={(e) => setCustomUrlInput(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-slate-800/90 text-white placeholder:text-slate-400 border border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer shrink-0"
          >
            <span>Auditar Coleção</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {successFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successFeedback}</span>
          </div>
        )}
      </div>

      {/* Collection Selector Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-700 block uppercase font-mono tracking-wider">
          Coleções Detectadas no Radar / Exemplos de Campanhas:
        </span>
        <div className="flex flex-wrap gap-2">
          {allDetectedCollections.map((col) => {
            const isSelected = selectedCollection.collectionHandle === col.handle;

            return (
              <button
                key={col.handle}
                onClick={() => loadCollectionData(col.handle)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <Tag className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-blue-600'}`} />
                <span>{col.title}</span>
                {col.heroBannerLinked && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-extrabold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {col.isCustom ? 'Link Personalizado' : 'Hero Banner'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Collection Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Produtos na Coleção</span>
            <span className="text-xl font-black text-slate-900 font-mono">{selectedCollection.totalProductsInCollection} SKUs</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Preço Médio da Linha</span>
            <span className="text-xl font-black text-emerald-600 font-mono">R$ {selectedCollection.averageCollectionPrice}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Itens com Grade Furada</span>
            <span className="text-xl font-black text-rose-600 font-mono">{selectedCollection.brokenSizesCount} Peças</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Mídia em Risco</span>
            <span className="text-base font-black text-amber-600 font-mono">R$ {selectedCollection.estimatedAdSpendWastedMonthly}/mês</span>
          </div>
        </div>
      </div>

      {/* Hero Banner Diagnostic Box */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-2 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs font-mono">
            <Target className="w-4 h-4" />
            <span>DIAGNÓSTICO DA COLEÇÃO ({selectedCollection.collectionTitle}):</span>
          </div>
          <a
            href={selectedCollection.collectionUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-blue-400 font-mono flex items-center gap-1 transition-colors"
          >
            <span>Abrir Coleção ao Vivo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-slate-200 text-xs leading-relaxed font-sans">
          {selectedCollection.primaryConversionBottleneck}
        </p>
      </div>

      {/* Product-by-Product Detailed Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Grade de Tamanhos Produto por Produto nesta Coleção:
          </h3>
          <span className="text-xs text-slate-500 font-mono">Grounding 100% Verificado</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {selectedCollection.products.map((product) => (
            <div 
              key={product.id} 
              className={`p-4 rounded-2xl bg-white border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs ${
                product.isBrokenSize ? 'border-amber-200 hover:border-amber-400' : 'border-slate-200'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{product.title}</span>
                  <span className="font-mono font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>

                {/* Sizes Pill Display */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-500 text-[11px] font-bold">Tamanhos:</span>
                  
                  {/* Available Sizes */}
                  {product.availableSizes.map(size => (
                    <span key={size} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-mono font-bold text-[10px]">
                      {size} ✓
                    </span>
                  ))}

                  {/* Missing Sizes */}
                  {product.missingSizes.map(size => (
                    <span key={size} className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-md font-mono font-bold text-[10px] line-through">
                      {size} ✗
                    </span>
                  ))}
                </div>
              </div>

              {/* Status & Link Action */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                {product.isBrokenSize ? (
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Grade Furada</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Grade 100% OK</span>
                  </span>
                )}

                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-xl transition-all"
                  title="Abrir página do produto ao vivo"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
