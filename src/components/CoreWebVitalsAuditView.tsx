import React, { useState } from 'react';
import { 
  Gauge, 
  Zap, 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  ShoppingBag, 
  Layers, 
  Clock, 
  Code2, 
  Globe,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { auditCoreWebVitals2026, CoreWebVitalsAuditResult } from '../services/coreWebVitalsEngine';

interface CoreWebVitalsAuditViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const CoreWebVitalsAuditView: React.FC<CoreWebVitalsAuditViewProps> = ({ diagnostic }) => {
  const { realSiteData } = diagnostic;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const vitals: CoreWebVitalsAuditResult = auditCoreWebVitals2026(
    realSiteData.domain,
    realSiteData.rawHtmlSnippet,
    realSiteData.estimatedLoadTime
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-600 rounded-2xl text-white shadow-md shadow-indigo-600/20">
            <Gauge className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Agente 12 — Core Web Vitals 2026 & Rich Snippets</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                Padrão 2026 Ativo
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Auditoria de performance do Agente 12: <strong>LCP apertado para 2.0s</strong>, <strong>INP &lt; 200ms</strong> e indexação de dados estruturados <strong>Schema.org para Google Shopping Orgânico</strong>.
            </p>
          </div>
        </div>

        {/* Global Vitals Score */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Score de Performance 2026</p>
            <p className="text-2xl font-black text-emerald-400 leading-none mt-0.5">
              {vitals.overallPerformanceScore} / 100
            </p>
            <p className="text-[10px] text-slate-400 mt-1">CrUX Field Data Ready</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4 Core Web Vitals Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* LCP Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          vitals.lcp.status === 'EXCELENTE' ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-600">LCP (Foto Principal)</span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
              vitals.lcp.status === 'EXCELENTE' ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
            }`}>
              {vitals.lcp.status}
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">
            {vitals.lcp.value} <span className="text-xs font-normal text-slate-600">{vitals.lcp.unit}</span>
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Meta 2026: {vitals.lcp.benchmark2026}</p>
          <p className="text-xs text-slate-700 mt-2 leading-relaxed">{vitals.lcp.diagnosticSummary}</p>
        </div>

        {/* INP Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          vitals.inp.status === 'EXCELENTE' ? 'bg-emerald-50/70 border-emerald-200' : 'bg-amber-50/70 border-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-600">INP (Toque Tamanhos)</span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
              vitals.inp.status === 'EXCELENTE' ? 'bg-emerald-200 text-emerald-800' : 'bg-amber-200 text-amber-800'
            }`}>
              {vitals.inp.status}
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">
            {vitals.inp.value} <span className="text-xs font-normal text-slate-600">{vitals.inp.unit}</span>
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Meta 2026: {vitals.inp.benchmark2026}</p>
          <p className="text-xs text-slate-700 mt-2 leading-relaxed">{vitals.inp.diagnosticSummary}</p>
        </div>

        {/* CLS Card */}
        <div className="p-5 rounded-2xl border bg-emerald-50/70 border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-600">CLS (Estabilidade)</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-200 text-emerald-800">
              EXCELENTE
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">
            {vitals.cls.value}
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Meta: {vitals.cls.benchmark2026}</p>
          <p className="text-xs text-slate-700 mt-2 leading-relaxed">{vitals.cls.diagnosticSummary}</p>
        </div>

        {/* TTFB Card */}
        <div className="p-5 rounded-2xl border bg-emerald-50/70 border-emerald-200">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-slate-600">TTFB (Servidor)</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-200 text-emerald-800">
              EXCELENTE
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 font-mono mt-2">
            {vitals.ttfb.value} <span className="text-xs font-normal text-slate-600">{vitals.ttfb.unit}</span>
          </p>
          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Meta: {vitals.ttfb.benchmark2026}</p>
          <p className="text-xs text-slate-700 mt-2 leading-relaxed">{vitals.ttfb.diagnosticSummary}</p>
        </div>

      </div>

      {/* 🛍️ GOOGLE SHOPPING ORGÂNICO & SCHEMA.ORG SIMULATOR */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Simulador de Snippet Orgânico no Google Shopping</h3>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-200">
            {vitals.schemaOrg.richSnippetGoogleShoppingStatus}
          </span>
        </div>

        {/* Google SERP Card Preview */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 max-w-xl font-sans">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span className="font-bold text-slate-900">{realSiteData.brandName}</span>
            <span>›</span>
            <span className="text-blue-700 font-mono text-[11px] truncate">{realSiteData.domain}/products/...</span>
          </div>
          <h4 className="text-base font-semibold text-blue-800 hover:underline cursor-pointer">
            {realSiteData.brandName} Camisa Proteção Solar UV50+ Dry Fit Oficial
          </h4>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-emerald-700 font-mono">R$ 159,90</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded text-[11px]">Em estoque</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Frete Rápido Brasil</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Camisa UV50+ oficial com secagem ultra rápida e conforto térmico. Grade completa do PP ao G2 com envio imediato.
          </p>
        </div>
      </div>

      {/* 🛠️ CÓDIGOS DE REMEDIAÇÃO IMEDIATA (1-CLICK COPY) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900">Scripts de Correção Prontos para o Tema (Liquid & JS)</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* 1. LCP Preload Snippet */}
          <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> 1. Acelerador de LCP (Foto Principal)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Cole dentro da tag &lt;head&gt;</span>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed">
                {vitals.liquidLcpSnippet}
              </pre>
            </div>
            <button
              onClick={() => handleCopy('lcp-snippet', vitals.liquidLcpSnippet)}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-500/20"
            >
              {copiedId === 'lcp-snippet' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'lcp-snippet' ? 'Copiado para Área de Transferência!' : 'Copiar Acelerador LCP Liquid'}</span>
            </button>
          </div>

          {/* 2. INP Debouncer Snippet */}
          <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> 2. Otimizador de INP (&lt;200ms Seletores de Tamanho)
                </span>
                <span className="text-[10px] font-mono text-slate-400">Cole no rodapé antes do &lt;/body&gt;</span>
              </div>
              <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed max-h-48">
                {vitals.liquidInpSnippet}
              </pre>
            </div>
            <button
              onClick={() => handleCopy('inp-snippet', vitals.liquidInpSnippet)}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-purple-500/20"
            >
              {copiedId === 'inp-snippet' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'inp-snippet' ? 'Copiado para Área de Transferência!' : 'Copiar Otimizador INP JS'}</span>
            </button>
          </div>

        </div>

        {/* 3. Schema.org JSON-LD Code Block */}
        <div className="p-5 bg-slate-900 rounded-2xl text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4" /> 3. Dados Estruturados Schema.org Product (Google Shopping Gratuito)
            </span>
            <button
              onClick={() => handleCopy('schema-snippet', vitals.schemaOrg.generatedJsonLdCode)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-emerald-500/20"
            >
              {copiedId === 'schema-snippet' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'schema-snippet' ? 'Copiado!' : 'Copiar Schema.org JSON-LD'}</span>
            </button>
          </div>
          <pre className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed max-h-60">
            {vitals.schemaOrg.generatedJsonLdCode}
          </pre>
        </div>

      </div>

    </div>
  );
};
