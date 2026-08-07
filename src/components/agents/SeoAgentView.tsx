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
  "sku": "LeakFinder-PROD-2026",
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
    <div className="space-y-6">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600">
            <Search className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Agente de SEO & Busca Orgânica</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Otimização On-Page & Schema JSON-LD
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Foco: Dominar palavras-chave transacionais no Google e exibir estrelas nos resultados de busca.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Score SEO</p>
            <p className="text-xl font-bold font-mono text-blue-600">{seo.score}/100</p>
          </div>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            <span>Palavras-Chave Transacionais de Alto Volume</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">Nicho: {input.niche}</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Palavra-Chave</th>
                <th className="p-3.5">Funil</th>
                <th className="p-3.5">Intenção</th>
                <th className="p-3.5">Volume Busca</th>
                <th className="p-3.5">Dificuldade</th>
                <th className="p-3.5">Sugestão de Título SEO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {seo.topKeywords.map((kw, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3.5 font-bold text-slate-900 font-mono">{kw.keyword}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                      {kw.funnelStage}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600">{kw.intent}</td>
                  <td className="p-3.5 font-mono text-blue-600 font-bold">{kw.volume}</td>
                  <td className="p-3.5 text-slate-500">{kw.difficulty}</td>
                  <td className="p-3.5 text-slate-800 italic">{kw.suggestedTitle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* On-Page Fixes & Schema Markup Code Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* On-Page Checklist */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Recomendações On-Page LeakFinder</span>
          </h3>

          <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
            {seo.onPageFixes.map((fix, idx) => (
              <li key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                <span className="w-4 h-4 rounded bg-blue-100 text-blue-700 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{fix}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* JSON-LD Schema Generator */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-blue-600" />
                <span>Gerador de Schema JSON-LD (Estrelas no Google)</span>
              </h3>
              <button
                onClick={copyToClipboard}
                className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copiedSchema ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSchema ? 'Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Cole este código no head das páginas de produtos para exibir fotos e estrelas nos resultados do Google.
            </p>

            <pre className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] font-mono text-blue-300 overflow-x-auto max-h-48">
              {sampleSchema}
            </pre>
          </div>
        </div>

      </div>

    </div>
  );
};
