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
  Eye, 
  Layers, 
  CheckCircle2, 
  Sliders, 
  Ruler, 
  Info,
  ExternalLink
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { generateShopifyThemeScripts, ThemeScriptSnippet } from '../services/shopifyThemeScriptGenerator';

interface ThemeScriptGeneratorViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const ThemeScriptGeneratorView: React.FC<ThemeScriptGeneratorViewProps> = ({ diagnostic }) => {
  const { realSiteData } = diagnostic;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [previewSnippetId, setPreviewSnippetId] = useState<string>('snippet-sticky-buy');

  const snippets = generateShopifyThemeScripts(realSiteData.domain, realSiteData.brandName);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2200);
  };

  const filteredSnippets = snippets.filter(s => {
    if (activeCategory === 'ALL') return true;
    return s.category === activeCategory;
  });

  const isAgro = realSiteData.domain.toLowerCase().includes('agro');
  const isMotors = realSiteData.domain.toLowerCase().includes('motors');
  const brandColor = isAgro ? '#3a9e35' : isMotors ? '#EA541B' : '#135ed1';

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white shadow-md shadow-emerald-500/20">
            <Code2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Gerador de Scripts de Correção (.liquid & CSS)</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                Pronto para Copiar & Colar
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Códigos otimizados e customizados com a paleta visual de <strong className="text-slate-900">{realSiteData.brandName}</strong> para resolver na hora os gargalos identificados na auditoria.
            </p>
          </div>
        </div>

        {/* Action Status Pill */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Snippets Disponíveis</p>
            <p className="text-2xl font-black text-emerald-400 leading-none mt-0.5">
              {snippets.length} Soluções
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Shopify Liquid & CSS</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Categories */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeCategory === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Todos os Scripts ({snippets.length})
        </button>
        <button
          onClick={() => setActiveCategory('MOBILE_UX')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'MOBILE_UX' ? 'bg-blue-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" /> Sticky Mobile
        </button>
        <button
          onClick={() => setActiveCategory('FITTS_LAW')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'FITTS_LAW' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Ruler className="w-3.5 h-3.5" /> Tamanhos 48px
        </button>
        <button
          onClick={() => setActiveCategory('CHECKOUT_PIX')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'CHECKOUT_PIX' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Desconto Pix 10%
        </button>
        <button
          onClick={() => setActiveCategory('SECURITY')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeCategory === 'SECURITY' ? 'bg-slate-800 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Segurança Tabnabbing
        </button>
      </div>

      {/* Snippets List & Code Blocks */}
      <div className="space-y-6">
        {filteredSnippets.map((snippet) => {
          const isCopied = copiedId === snippet.id;

          return (
            <div key={snippet.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              
              {/* Snippet Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-800 font-mono font-bold text-[11px] rounded-lg border border-slate-200 flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5 text-blue-600" />
                      {snippet.targetFile}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase rounded-lg border border-emerald-200">
                      {snippet.impactLabel}
                    </span>
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] uppercase rounded-lg">
                      {snippet.difficulty}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 pt-1">{snippet.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{snippet.description}</p>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => handleCopyCode(snippet.id, snippet.code)}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-xs ${
                    isCopied 
                      ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/10'
                  }`}
                >
                  {isCopied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
                  <span>{isCopied ? 'Código Copiado!' : 'Copiar Código'}</span>
                </button>
              </div>

              {/* Install Instruction Box */}
              <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Instrução no Tema Shopify:</strong> {snippet.installLocation}
                </div>
              </div>

              {/* Code Container */}
              <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 text-slate-100 text-xs font-mono">
                <div className="p-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{snippet.targetFile} ({snippet.language})</span>
                  <span>{snippet.code.split('\n').length} linhas</span>
                </div>
                <pre className="p-4 overflow-x-auto max-h-72 leading-relaxed text-emerald-400/90 font-medium">
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
