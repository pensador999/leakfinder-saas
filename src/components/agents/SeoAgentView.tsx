import React, { useState } from 'react';
import { Search, Code2, Copy, Check, FileText, Key } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface SeoAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const SeoAgentView: React.FC<SeoAgentViewProps> = ({ diagnostic }) => {
  const { seo, input, realSiteData } = diagnostic;
  const [copiedSchema, setCopiedSchema] = useState(false);

  const sampleSchema = `{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "${input.businessName || realSiteData.domain}",
  "image": ["${realSiteData.url}/photo-1.jpg"],
  "description": "${realSiteData.metaDescription.slice(0, 120)}",
  "sku": "AdShield-PROD-2026",
  "offers": {
    "@type": "Offer",
    "url": "${realSiteData.url}",
    "priceCurrency": "BRL",
    "price": "${input.averageOrderValue}",
    "priceValidUntil": "2026-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "154"
  }
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleSchema);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-[#FFFCE1]">Agente 12 — Engenheiro de SEO Técnico & Core Web Vitals</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#00BAE2]/10 text-[#00BAE2] rounded-full border border-[#00BAE2]/20">
                Schema JSON-LD & Core Web Vitals
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 font-medium">
              Otimização de tráfego orgânico, Rich Snippets Google e indexação técnica em <span className="font-mono text-[#FFFCE1] font-bold">{realSiteData.domain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-5 py-3 bg-[#141716] rounded-2xl border border-white/10">
          <div className="text-center">
            <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-bold">Score SEO</p>
            <p className="text-xl font-black font-mono text-[#00BAE2]">{seo.score}/100</p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-bold">Schema JSON-LD</p>
            <p className={`text-xs font-bold font-mono ${realSiteData.hasSchemaJsonLd ? 'text-[#0AE448]' : 'text-amber-400'}`}>
              {realSiteData.hasSchemaJsonLd ? 'Detectado' : 'Faltando'}
            </p>
          </div>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#FFFCE1] uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-[#0AE448]" />
            <span>Palavras-Chave Transacionais de Alto Volume</span>
          </h3>
          <span className="text-xs text-[#BBBAA6] font-mono font-medium">Nicho: {input.niche}</span>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-[#101211] shadow-2xl">
          <table className="w-full text-left text-xs text-[#FFFCE1]">
            <thead className="bg-[#141716] text-[#BBBAA6] uppercase text-[10px] font-mono font-bold border-b border-white/10">
              <tr>
                <th className="p-3.5">Palavra-Chave</th>
                <th className="p-3.5">Funil</th>
                <th className="p-3.5">Intenção</th>
                <th className="p-3.5">Volume Busca</th>
                <th className="p-3.5">Dificuldade</th>
                <th className="p-3.5">Sugestão de Título SEO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium">
              {seo.topKeywords.map((kw, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5 font-bold text-[#FFFCE1] font-mono">{kw.keyword}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono font-extrabold text-[10px] bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20">
                      {kw.funnelStage}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#BBBAA6]">{kw.intent}</td>
                  <td className="p-3.5 font-mono text-[#0AE448] font-bold">{kw.volume}</td>
                  <td className="p-3.5 text-[#BBBAA6]">{kw.difficulty}</td>
                  <td className="p-3.5 text-[#FFFCE1] italic">{kw.suggestedTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* On-Page Fixes & Schema Markup Code Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* On-Page Checklist */}
        <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 space-y-4 shadow-2xl">
          <h3 className="text-sm font-black text-[#FFFCE1] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00BAE2]" />
            <span>Recomendações On-Page AdShield</span>
          </h3>

          <ul className="space-y-2.5 text-xs text-[#BBBAA6] font-medium">
            {seo.onPageFixes.map((fix, idx) => (
              <li key={idx} className="p-3.5 bg-[#141716] rounded-2xl border border-white/10 flex items-start gap-2.5">
                <span className="w-4 h-4 rounded bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-[#FFFCE1]">{fix}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* JSON-LD Schema Generator */}
        <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 space-y-4 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <h3 className="text-sm font-black text-[#FFFCE1] flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#0AE448]" />
                <span>Gerador de Schema JSON-LD (Estrelas no Google)</span>
              </h3>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1.5 text-xs font-black bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#0AE448]/20"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <p className="text-xs text-[#BBBAA6] mb-3">
              Cole este código no head das páginas de produtos para exibir fotos e estrelas nos resultados do Google.
            </p>

            <pre className="p-4 bg-[#0E100F] rounded-2xl border border-white/10 text-[11px] font-mono text-[#00BAE2] overflow-x-auto max-h-48 leading-relaxed">
              {sampleSchema}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
