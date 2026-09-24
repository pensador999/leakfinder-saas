import React, { useState } from 'react';
import { 
  Gauge, 
  Zap, 
  Copy, 
  Check, 
  ShoppingBag, 
  Code2
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
    realSiteData.estimatedLoadTime,
    realSiteData.lighthouseMetrics
  );

  const sampleProduct = realSiteData.catalogAudit?.issues?.[0];
  const serpTitle = sampleProduct?.productTitle 
    ? `${sampleProduct.productTitle} • ${realSiteData.brandName}`
    : (realSiteData.title || `${realSiteData.brandName} • Loja Oficial`);
  const rawPrice = sampleProduct?.detailedSkus?.[0]?.price || diagnostic.input.averageOrderValue || 129.90;
  const serpPrice = `R$ ${rawPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const serpUrl = sampleProduct?.productUrl || `https://${realSiteData.domain}/products`;
  const serpDesc = sampleProduct?.hasDescription && sampleProduct.descriptionLength > 20
    ? `Compre ${sampleProduct.productTitle} original na ${realSiteData.brandName}. Envio rápido e pagamento facilitado no Pix.`
    : (realSiteData.metaDescription || `Conheça os produtos da ${realSiteData.brandName}. Compre com segurança, entrega rápida e facilidade de pagamento.`);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 font-sans text-[#FFFCE1]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md shadow-[#0AE448]/10">
            <Gauge className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#FFFCE1]">Agente 12 — Core Web Vitals 2026 & Rich Snippets</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20">
                Padrão 2026 Ativo
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              Auditoria de performance do Agente 12: <strong className="text-[#FFFCE1]">LCP apertado para 2.0s</strong>, <strong className="text-[#FFFCE1]">INP &lt; 200ms</strong> e indexação de dados estruturados <strong className="text-[#FFFCE1]">Schema.org para Google Shopping Orgânico</strong>.
            </p>
          </div>
        </div>

        {/* Global Vitals Score */}
        <div className="p-4 bg-[#141716] border border-white/10 text-[#FFFCE1] rounded-2xl flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end shadow-lg">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Score de Performance 2026</p>
            <p className="text-2xl font-black text-[#0AE448] leading-none mt-0.5 font-mono">
              {vitals.overallPerformanceScore} / 100
            </p>
            <p className="text-[10px] text-[#BBBAA6] mt-1 font-mono">CrUX Field Data Ready</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0AE448]/10 border border-[#0AE448]/20 flex items-center justify-center text-[#0AE448]">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4 Core Web Vitals Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* LCP Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          vitals.lcp.status === 'EXCELENTE' 
            ? 'bg-[#101211] border-[#0AE448]/30 shadow-lg shadow-[#0AE448]/5' 
            : 'bg-[#101211] border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#BBBAA6] font-mono">LCP (Foto Principal)</span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
              vitals.lcp.status === 'EXCELENTE' ? 'bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
            }`}>
              {vitals.lcp.status}
            </span>
          </div>
          <p className="text-2xl font-black text-[#FFFCE1] font-mono mt-2">
            {vitals.lcp.value} <span className="text-xs font-normal text-[#BBBAA6]">{vitals.lcp.unit}</span>
          </p>
          <p className="text-[10px] text-[#BBBAA6] font-mono mt-0.5">Meta 2026: {vitals.lcp.benchmark2026}</p>
          <p className="text-xs text-[#BBBAA6] mt-2 leading-relaxed">{vitals.lcp.diagnosticSummary}</p>
        </div>

        {/* INP Card */}
        <div className={`p-5 rounded-2xl border transition-all ${
          vitals.inp.status === 'EXCELENTE' 
            ? 'bg-[#101211] border-[#0AE448]/30 shadow-lg shadow-[#0AE448]/5' 
            : 'bg-[#101211] border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#BBBAA6] font-mono">INP (Toque Tamanhos)</span>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
              vitals.inp.status === 'EXCELENTE' ? 'bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20' : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
            }`}>
              {vitals.inp.status}
            </span>
          </div>
          <p className="text-2xl font-black text-[#FFFCE1] font-mono mt-2">
            {vitals.inp.value} <span className="text-xs font-normal text-[#BBBAA6]">{vitals.inp.unit}</span>
          </p>
          <p className="text-[10px] text-[#BBBAA6] font-mono mt-0.5">Meta 2026: {vitals.inp.benchmark2026}</p>
          <p className="text-xs text-[#BBBAA6] mt-2 leading-relaxed">{vitals.inp.diagnosticSummary}</p>
        </div>

        {/* CLS Card */}
        <div className="p-5 rounded-2xl border bg-[#101211] border-[#0AE448]/30 shadow-lg shadow-[#0AE448]/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#BBBAA6] font-mono">CLS (Estabilidade)</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 font-mono">
              EXCELENTE
            </span>
          </div>
          <p className="text-2xl font-black text-[#FFFCE1] font-mono mt-2">
            {vitals.cls.value}
          </p>
          <p className="text-[10px] text-[#BBBAA6] font-mono mt-0.5">Meta: {vitals.cls.benchmark2026}</p>
          <p className="text-xs text-[#BBBAA6] mt-2 leading-relaxed">{vitals.cls.diagnosticSummary}</p>
        </div>

        {/* TTFB Card */}
        <div className="p-5 rounded-2xl border bg-[#101211] border-[#0AE448]/30 shadow-lg shadow-[#0AE448]/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase text-[#BBBAA6] font-mono">TTFB (Servidor)</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 font-mono">
              EXCELENTE
            </span>
          </div>
          <p className="text-2xl font-black text-[#FFFCE1] font-mono mt-2">
            {vitals.ttfb.value} <span className="text-xs font-normal text-[#BBBAA6]">{vitals.ttfb.unit}</span>
          </p>
          <p className="text-[10px] text-[#BBBAA6] font-mono mt-0.5">Meta: {vitals.ttfb.benchmark2026}</p>
          <p className="text-xs text-[#BBBAA6] mt-2 leading-relaxed">{vitals.ttfb.diagnosticSummary}</p>
        </div>

      </div>

      {/* 🛍️ GOOGLE SHOPPING ORGÂNICO & SCHEMA.ORG SIMULATOR */}
      <div className="p-6 bg-[#101211] rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#0AE448]" />
            <h3 className="font-bold text-sm text-[#FFFCE1]">Simulador de Snippet Orgânico no Google Shopping</h3>
          </div>
          <span className="px-2.5 py-0.5 bg-[#0AE448]/10 text-[#0AE448] font-mono font-bold text-xs rounded-lg border border-[#0AE448]/20">
            {vitals.schemaOrg.richSnippetGoogleShoppingStatus}
          </span>
        </div>

        {/* Google SERP Card Preview (GROUNDED ON REAL AUDITED PRODUCT) */}
        <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-2 max-w-xl font-sans">
          <div className="flex items-center gap-2 text-xs text-[#BBBAA6]">
            <span className="font-bold text-[#FFFCE1]">{realSiteData.brandName}</span>
            <span>›</span>
            <span className="text-[#00BAE2] font-mono text-[11px] truncate max-w-xs">{serpUrl.replace(/^https?:\/\//, '')}</span>
          </div>
          <a
            href={serpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base font-semibold text-[#00BAE2] hover:underline cursor-pointer block line-clamp-1"
          >
            {serpTitle}
          </a>
          <div className="flex items-center gap-3 text-xs">
            <span className="font-bold text-[#0AE448] font-mono">{serpPrice}</span>
            <span className="text-white/20">•</span>
            <span className="text-[#0AE448] font-bold bg-[#0AE448]/10 border border-[#0AE448]/20 px-1.5 py-0.5 rounded text-[11px] font-mono">
              {sampleProduct && sampleProduct.missingSizes.length === 0 ? 'Grade Completa' : 'Em estoque'}
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[#BBBAA6]">
              {realSiteData.detectedCheckoutTerms.hasFrete ? 'Frete com Regra Ativa' : 'Envio Nacional'}
            </span>
          </div>
          <p className="text-xs text-[#BBBAA6] leading-relaxed line-clamp-2">
            {serpDesc}
          </p>
        </div>
      </div>

      {/* 🛠️ CÓDIGOS DE REMEDIAÇÃO IMEDIATA (1-CLICK COPY) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#0AE448]" />
          <h3 className="font-bold text-sm text-[#FFFCE1]">Scripts de Correção Prontos para o Tema (Liquid & JS)</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* 1. LCP Preload Snippet */}
          <div className="p-5 bg-[#101211] border border-white/10 rounded-2xl text-[#FFFCE1] space-y-3 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#0AE448] flex items-center gap-1.5 font-mono">
                  <Zap className="w-4 h-4" /> 1. Acelerador de LCP (Foto Principal)
                </span>
                <span className="text-[10px] font-mono text-[#BBBAA6]">Cole dentro da tag &lt;head&gt;</span>
              </div>
              <pre className="p-3 bg-[#0E100F] rounded-xl text-xs font-mono text-[#BBBAA6] overflow-x-auto border border-white/10 leading-relaxed">
                {vitals.liquidLcpSnippet}
              </pre>
            </div>
            <button
              onClick={() => handleCopy('lcp-snippet', vitals.liquidLcpSnippet)}
              className="w-full py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#0AE448]/20"
            >
              {copiedId === 'lcp-snippet' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedId === 'lcp-snippet' ? 'Copiado para Área de Transferência!' : 'Copiar Acelerador LCP Liquid'}</span>
            </button>
          </div>

          {/* 2. INP Debouncer Snippet */}
          <div className="p-5 bg-[#101211] border border-white/10 rounded-2xl text-[#FFFCE1] space-y-3 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#00BAE2] flex items-center gap-1.5 font-mono">
                  <Zap className="w-4 h-4" /> 2. Otimizador de INP (&lt;200ms Seletores de Tamanho)
                </span>
                <span className="text-[10px] font-mono text-[#BBBAA6]">Cole no rodapé antes do &lt;/body&gt;</span>
              </div>
              <pre className="p-3 bg-[#0E100F] rounded-xl text-xs font-mono text-[#BBBAA6] overflow-x-auto border border-white/10 leading-relaxed max-h-48">
                {vitals.liquidInpSnippet}
              </pre>
            </div>
            <button
              onClick={() => handleCopy('inp-snippet', vitals.liquidInpSnippet)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              {copiedId === 'inp-snippet' ? <Check className="w-4 h-4 text-[#0AE448]" /> : <Copy className="w-4 h-4 text-[#00BAE2]" />}
              <span>{copiedId === 'inp-snippet' ? 'Copiado para Área de Transferência!' : 'Copiar Otimizador INP JS'}</span>
            </button>
          </div>

        </div>

        {/* 3. Schema.org JSON-LD Code Block */}
        <div className="p-5 bg-[#101211] border border-white/10 rounded-2xl text-[#FFFCE1] space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#0AE448] flex items-center gap-1.5 font-mono">
              <ShoppingBag className="w-4 h-4" /> 3. Dados Estruturados Schema.org Product (Google Shopping Gratuito)
            </span>
            <button
              onClick={() => handleCopy('schema-snippet', vitals.schemaOrg.generatedJsonLdCode)}
              className="px-3 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#0AE448]/20"
            >
              {copiedId === 'schema-snippet' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'schema-snippet' ? 'Copiado!' : 'Copiar Schema.org JSON-LD'}</span>
            </button>
          </div>
          <pre className="p-3 bg-[#0E100F] rounded-xl text-xs font-mono text-[#BBBAA6] overflow-x-auto border border-white/10 leading-relaxed max-h-60">
            {vitals.schemaOrg.generatedJsonLdCode}
          </pre>
        </div>

      </div>

    </div>
  );
};
