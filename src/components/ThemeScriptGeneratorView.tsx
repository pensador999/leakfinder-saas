import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Smartphone, 
  Zap, 
  ShieldCheck, 
  FileCode, 
  Sparkles, 
  Ruler, 
  Info,
  Flame,
  TableProperties
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { generateShopifyThemeScripts } from '../services/shopifyThemeScriptGenerator';
import { isCatalogProductBroken } from '../services/siteInspector';

interface ThemeScriptGeneratorViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const ThemeScriptGeneratorView: React.FC<ThemeScriptGeneratorViewProps> = ({ diagnostic }) => {
  const { realSiteData } = diagnostic;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const snippets = generateShopifyThemeScripts(realSiteData.domain, realSiteData.brandName, realSiteData);
  const brokenItems = (realSiteData.catalogAudit?.issues || []).filter(isCatalogProductBroken);
  const topBroken = brokenItems[0];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const filteredSnippets = snippets.filter(s => {
    if (activeCategory === 'ALL') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="space-y-6 font-sans text-[#FFFCE1]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md shadow-[#0AE448]/10">
            <Code2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-[#FFFCE1]">Gerador de Scripts de Correção (.liquid, JS & CSS)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded-full">
                Injetado com SKUs & Pixel Reais
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              Códigos customizados com os SKUs em ruptura, Meta Pixel e paleta de <strong className="text-[#FFFCE1]">{realSiteData.brandName}</strong> para estancar na hora os gargalos detectados na auditoria.
            </p>
          </div>
        </div>

        {/* Action Status Pill */}
        <div className="p-4 bg-[#141716] border border-white/10 text-[#FFFCE1] rounded-2xl flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end shadow-xl">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Snippets Disponíveis</p>
            <p className="text-2xl font-black text-[#0AE448] leading-none mt-0.5 font-mono">
              {snippets.length} Soluções
            </p>
            <p className="text-[10px] text-[#BBBAA6] mt-1 font-mono">
              {brokenItems.length} SKUs Críticos Injetados
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0AE448]/10 border border-[#0AE448]/20 flex items-center justify-center text-[#0AE448]">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Live Grounding Context Strip */}
      <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30 font-mono text-[10px] font-bold">
            GROUNDING ATIVO
          </span>
          <span className="text-[#BBBAA6]">
            Top SKU Injetado no Stock-Shield:{' '}
            <strong className="text-[#FFFCE1] font-mono">
              {topBroken ? `${topBroken.productTitle} (${topBroken.sku})` : 'Catálogo 100% em Estoque (Modo Preventivo)'}
            </strong>
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#BBBAA6]">
          <span>
            Meta Pixel: <strong className="text-[#00BAE2]">{realSiteData.metaPixelId || (realSiteData.hasMetaPixel ? 'Detectado' : 'Configurável')}</strong>
          </span>
          <span>•</span>
          <span>
            CNPJ Rodapé: <strong className={realSiteData.legalCompliance?.hasCnpjInFooter !== false ? 'text-[#0AE448]' : 'text-amber-400'}>
              {realSiteData.legalCompliance?.cnpjFound || (realSiteData.legalCompliance?.hasCnpjInFooter !== false ? 'OK' : 'Pendente')}
            </strong>
          </span>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer border ${
            activeCategory === 'ALL' 
              ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] font-black shadow-lg shadow-[#0AE448]/20' 
              : 'bg-[#141716] border-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
          }`}
        >
          Todos os Scripts ({snippets.length})
        </button>
        <button
          onClick={() => setActiveCategory('STOCK_SHIELD')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
            activeCategory === 'STOCK_SHIELD' 
              ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] font-black shadow-lg shadow-[#0AE448]/20' 
              : 'bg-[#141716] border-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
          }`}
        >
          <Flame className="w-3.5 h-3.5" /> Stock-Shield & Pixel
        </button>
        <button
          onClick={() => setActiveCategory('SIZE_GUIDE')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
            activeCategory === 'SIZE_GUIDE' 
              ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] font-black shadow-lg shadow-[#0AE448]/20' 
              : 'bg-[#141716] border-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
          }`}
        >
          <TableProperties className="w-3.5 h-3.5" /> Tabela de Medidas
        </button>
        <button
          onClick={() => setActiveCategory('MOBILE_UX')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
            activeCategory === 'MOBILE_UX' 
              ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] font-black shadow-lg shadow-[#0AE448]/20' 
              : 'bg-[#141716] border-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" /> Sticky Mobile
        </button>
        <button
          onClick={() => setActiveCategory('FITTS_LAW')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
            activeCategory === 'FITTS_LAW' 
              ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] font-black shadow-lg shadow-[#0AE448]/20' 
              : 'bg-[#141716] border-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" /> Tamanhos 48px
        </button>
        <button
          onClick={() => setActiveCategory('CHECKOUT_PIX')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
            activeCategory === 'CHECKOUT_PIX' 
              ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] font-black shadow-lg shadow-[#0AE448]/20' 
              : 'bg-[#141716] border-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Desconto Pix 10%
        </button>
        <button
          onClick={() => setActiveCategory('SECURITY')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
            activeCategory === 'SECURITY' 
              ? 'bg-[#0AE448] text-slate-950 border-[#0AE448] font-black shadow-lg shadow-[#0AE448]/20' 
              : 'bg-[#141716] border-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Segurança & CNPJ
        </button>
      </div>

      {/* Snippets List & Code Blocks */}
      <div className="space-y-6">
        {filteredSnippets.map((snippet) => {
          const isCopied = copiedId === snippet.id;

          return (
            <div key={snippet.id} className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-4">
              
              {/* Snippet Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-white/5 text-[#FFFCE1] font-mono font-bold text-[11px] rounded-lg border border-white/10 flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5 text-[#00BAE2]" />
                      {snippet.targetFile}
                    </span>
                    <span className="px-2.5 py-0.5 bg-[#0AE448]/10 text-[#0AE448] font-mono font-bold text-[10px] uppercase rounded-lg border border-[#0AE448]/20">
                      {snippet.impactLabel}
                    </span>
                    <span className="px-2.5 py-0.5 bg-white/5 text-[#BBBAA6] font-mono font-bold text-[10px] uppercase rounded-lg border border-white/5">
                      {snippet.difficulty}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#FFFCE1] pt-1">{snippet.title}</h3>
                  <p className="text-xs text-[#BBBAA6] leading-relaxed max-w-3xl">{snippet.description}</p>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopyCode(snippet.id, snippet.code)}
                  className={`px-4 py-2.5 rounded-xl font-black uppercase tracking-wider text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg ${
                    isCopied 
                      ? 'bg-[#0AE448] text-slate-950 shadow-[#0AE448]/20' 
                      : 'bg-white/10 hover:bg-white/15 text-[#FFFCE1] border border-white/10'
                  }`}
                >
                  {isCopied ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-[#0AE448]" />}
                  <span>{isCopied ? 'Código Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>

              {/* Install Instruction Box */}
              <div className="p-3.5 bg-[#141716] border border-amber-500/30 rounded-2xl text-xs text-amber-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong className="text-amber-200">Instrução no Tema:</strong> {snippet.installLocation}
                </div>
              </div>

              {/* Code Container */}
              <div className="relative rounded-2xl overflow-hidden bg-[#0E100F] border border-white/10 text-[#FFFCE1] text-xs font-mono">
                <div className="p-2.5 bg-[#141716] border-b border-white/10 flex items-center justify-between text-[11px] text-[#BBBAA6]">
                  <span>{snippet.targetFile} ({snippet.language})</span>
                  <span>{snippet.code.split('\n').length} linhas</span>
                </div>
                <pre className="p-4 overflow-x-auto max-h-72 leading-relaxed text-[#0AE448] font-medium">
                  <code>{snippet.code}</code>
                </pre>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
