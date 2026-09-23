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
  ArrowRight,
  Check,
  X
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
        handleOrUrl || selectedHandle,
        realSiteData.catalogAudit?.issues || []
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
      <div className="py-16 text-center space-y-3 bg-[#101211] border border-white/10 rounded-3xl">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0AE448]" />
        <p className="text-sm font-bold text-[#FFFCE1]">Auditando Coleção & Vínculos de Hero Banner...</p>
        <p className="text-xs text-[#BBBAA6]">Inspecionando estoque e grade produto por produto na coleção selecionada.</p>
      </div>
    );
  }

  const { selectedCollection, allDetectedCollections } = auditData;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] rounded-2xl text-[#0AE448] shadow-md border border-[#0AE448]/20">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-[#FFFCE1]">Auditoria Granular de Coleções & Banners</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20">
                Coleção em Foco
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              Cole o link de <strong className="text-[#FFFCE1]">qualquer coleção ou categoria</strong> de e-commerce para auditar a grade de estoque e tráfego de anúncios daquela seção específica.
            </p>
          </div>
        </div>

        <div className="text-left lg:text-right bg-[#141716] p-4 rounded-2xl border border-white/5">
          <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Saúde da Coleção</span>
          <span className={`text-2xl font-black font-mono ${
            selectedCollection.collectionHealthScore >= 80 ? 'text-[#0AE448]' : 'text-amber-400'
          }`}>
            {selectedCollection.collectionHealthScore}/100
          </span>
        </div>
      </div>

      {/* 🔗 ATTACH CUSTOM COLLECTION URL BAR */}
      <div className="p-5 bg-[#141716] rounded-3xl text-[#FFFCE1] border border-white/10 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm flex items-center gap-2 text-[#00BAE2]">
            <Link2 className="w-4 h-4" />
            Anexar Link de Coleção Personalizada para Auditar
          </h3>
          <span className="text-[10px] text-[#BBBAA6] font-mono">Suporta qualquer URL /collections/...</span>
        </div>

        <form onSubmit={handleCustomUrlSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            required
            placeholder="Ex: https://www.brkagro.com.br/collections/camisas-work ou qualquer loja..."
            value={customUrlInput}
            onChange={(e) => setCustomUrlInput(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs bg-[#0E100F] text-[#FFFCE1] placeholder:text-white/30 border border-white/15 rounded-2xl focus:outline-none focus:border-[#0AE448] font-mono"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md shadow-[#0AE448]/20 cursor-pointer shrink-0"
          >
            <span>Auditar Coleção</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {successFeedback && (
          <div className="p-2.5 rounded-xl bg-[#0AE448]/10 border border-[#0AE448]/30 text-[#0AE448] text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-[#0AE448]" />
            <span>{successFeedback}</span>
          </div>
        )}
      </div>

      {/* Collection Selector Chips */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#BBBAA6] block uppercase font-mono tracking-wider">
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
                    ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] font-black shadow-md shadow-[#0AE448]/20'
                    : 'bg-[#101211] text-[#BBBAA6] border-white/10 hover:border-white/20 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Tag className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-[#0AE448]'}`} />
                <span>{col.title}</span>
                {col.heroBannerLinked && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-extrabold ${
                    isSelected ? 'bg-black/20 text-slate-950' : 'bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30'
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
        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#00BAE2] rounded-xl border border-[#00BAE2]/20">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Produtos na Coleção</span>
            <span className="text-xl font-black text-[#FFFCE1] font-mono">{selectedCollection.totalProductsInCollection} SKUs</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#0AE448] rounded-xl border border-[#0AE448]/20">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Preço Médio da Linha</span>
            <span className="text-xl font-black text-[#0AE448] font-mono">R$ {selectedCollection.averageCollectionPrice}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Itens com Grade Furada</span>
            <span className="text-xl font-black text-rose-400 font-mono">{selectedCollection.brokenSizesCount} Peças</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-lg flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Mídia em Risco</span>
            <span className="text-base font-black text-amber-300 font-mono">R$ {selectedCollection.estimatedAdSpendWastedMonthly}/mês</span>
          </div>
        </div>
      </div>

      {/* Hero Banner Diagnostic Box */}
      <div className="p-5 rounded-3xl bg-[#141716] text-[#FFFCE1] space-y-2 border border-white/10 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0AE448] font-bold text-xs font-mono">
            <Target className="w-4 h-4" />
            <span>DIAGNÓSTICO DA COLEÇÃO ({selectedCollection.collectionTitle}):</span>
          </div>
          <a
            href={selectedCollection.collectionUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#BBBAA6] hover:text-[#0AE448] font-mono flex items-center gap-1 transition-colors"
          >
            <span>Abrir Coleção ao Vivo</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <p className="text-[#BBBAA6] text-xs leading-relaxed font-sans">
          {selectedCollection.primaryConversionBottleneck}
        </p>
      </div>

      {/* Product-by-Product Detailed Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-[#FFFCE1] text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#0AE448]" />
            Grade de Tamanhos Produto por Produto nesta Coleção:
          </h3>
          <span className="text-xs text-[#0AE448] font-mono">Grounding 100% Verificado</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {selectedCollection.products.map((product) => (
            <div 
              key={product.id} 
              className={`p-4 rounded-2xl bg-[#101211] border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl ${
                product.isBrokenSize ? 'border-amber-500/30 hover:border-amber-500/50' : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-[#FFFCE1]">{product.title}</span>
                  <span className="font-mono font-bold text-xs text-[#0AE448] bg-[#0AE448]/10 px-2 py-0.5 rounded-md border border-[#0AE448]/20">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>

                {/* Sizes Pill Display */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-[#BBBAA6] text-[11px] font-bold">Tamanhos:</span>
                  
                  {/* Available Sizes */}
                  {product.availableSizes.map(size => (
                    <span key={size} className="px-2 py-0.5 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 rounded-md font-mono font-bold text-[10px] inline-flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-[#0AE448]" />
                      <span>{size}</span>
                    </span>
                  ))}

                  {/* Missing Sizes */}
                  {product.missingSizes.map(size => (
                    <span key={size} className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-md font-mono font-bold text-[10px] inline-flex items-center gap-1 opacity-75">
                      <X className="w-2.5 h-2.5 text-rose-400" />
                      <span className="line-through">{size}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Status & Link Action */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                {product.isBrokenSize ? (
                  <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-xl text-xs font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Grade Furada</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 rounded-xl text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" />
                    <span>Grade 100% OK</span>
                  </span>
                )}

                <a
                  href={product.productUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-white/5 hover:bg-white/10 text-[#BBBAA6] hover:text-white rounded-xl transition-all border border-white/10"
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
