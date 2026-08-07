import React, { useState } from 'react';
import { Eye, Code, Zap, AlertCircle, ShieldCheck, ImageOff, Copy, Check, SpellCheck, AlertTriangle } from 'lucide-react';
import { AgentDiagnosticResult } from '../types';

interface BlindspotAuditViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const BlindspotAuditView: React.FC<BlindspotAuditViewProps> = ({ diagnostic }) => {
  const { realSiteData, guardrailReport } = diagnostic;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyProductName = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">LeakFinder Pontos Cegos, Imagens Quebradas & Grafia</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" /> Auditado pelo Guardrail Agent
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Análise de gargalos de código, fotos ausentes e ortografia lida em <span className="font-mono text-slate-900 font-bold">{realSiteData.domain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Sem Imagem / Alt</p>
            <p className="text-xl font-bold font-mono text-rose-600">{realSiteData.brokenProductImages.length} Fotos</p>
          </div>

          <div className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Gargalos Código</p>
            <p className="text-xl font-bold font-mono text-blue-600">{guardrailReport.validatedFindings.length} Pontos</p>
          </div>
        </div>
      </div>

      {/* 🖼️ NEW SECTION: Productos Sem Imagem no HTML + Botão de Copiar Texto */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <ImageOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Produtos com Imagem Quebrada ou Sem Atributo Alt</h3>
              <p className="text-xs text-slate-500 font-medium">Copie o nome do produto para localizar e corrigir no seu painel (Shopify, Nuvemshop, VTEX)</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 font-medium">
          {realSiteData.brokenProductImages.map((item) => (
            <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-300 transition-all">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                    item.reason === 'SEM_ALT' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.reason === 'SEM_ALT' ? 'Falta Tag Alt' : item.reason === 'PLACEHOLDER' ? 'Imagem Placeholder' : 'Src Quebrado / Vazio'}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900">{item.productTitle}</h4>
                </div>

                <p className="text-[11px] font-mono text-slate-500">
                  <span className="text-slate-400">Src lido:</span> {item.src} • <span className="text-blue-600 font-semibold">{item.locationHint}</span>
                </p>
              </div>

              <button
                onClick={() => handleCopyProductName(item.id, item.productTitle)}
                className="px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
              >
                {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copiedId === item.id ? 'Nome Copiado!' : 'Copiar Nome do Produto'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ✍️ NEW SECTION: Alertas de Erros de Escrita / Ortografia */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
            <SpellCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Auditoria de Erros de Escrita & Grafia no Texto do Site</h3>
            <p className="text-xs text-slate-500 font-medium">Pequenos erros de digitação em palavras de vendas (ex: promosão, garatia) reduzem a autoridade da loja</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-medium">
          {realSiteData.typoAlerts.map((typo) => (
            <div key={typo.id} className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-900 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Palavra Errada: <code className="text-rose-700 bg-white px-1.5 py-0.5 rounded border border-rose-200">{typo.foundWord}</code>
                </span>
                <span className="text-[10px] text-amber-700 font-mono font-semibold">{typo.location}</span>
              </div>

              <p className="text-xs text-slate-700 font-mono bg-white p-2.5 rounded-lg border border-amber-200/80">
                {typo.contextSnippet}
              </p>

              <div className="flex items-center justify-between mt-2">
                <div className="text-xs text-emerald-800 font-bold flex items-center gap-1.5 pt-1">
                  <span>✓ Sugestão de Correção:</span>
                  <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono">{typo.suggestedFix}</span>
                </div>
                
                <button
                  onClick={() => handleCopyProductName(typo.id, typo.foundWord)}
                  className="px-3 py-1.5 text-[10px] font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedId === typo.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                  <span>{copiedId === typo.id ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Validated Blindspots with Code Snippets & Exact Line Locations */}
      <div className="space-y-4 font-medium">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Code className="w-4 h-4 text-blue-600" />
          <span>Vulnerabilidades de Código & Tags HTML Lidas ({guardrailReport.validatedFindings.length})</span>
        </h3>

        {guardrailReport.validatedFindings.map((bs, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs hover:border-slate-300 transition-all">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded border ${
                  bs.severity === 'CRÍTICO' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  bs.severity === 'ALTO' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {bs.severity}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{bs.title}</h4>
              </div>

              <span className="text-xs font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 font-bold">
                {bs.category}
              </span>
            </div>

            {/* Code Location & Snippet */}
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1">
                <span className="flex items-center gap-1 font-bold text-blue-400">
                  <Code className="w-3.5 h-3.5" /> Localização no HTML: {bs.codeLocation}
                </span>
                <span className="text-emerald-400">✓ Revalidado pelo Guardrail Agent</span>
              </div>
              <p className="text-amber-300 pt-1">
                {bs.codeSnippet}
              </p>
            </div>

            {/* Impact & Fix Action */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Impacto Direto nas Vendas / Código:
                </span>
                <p className="text-amber-800">
                  {bs.impactExplanation}
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1 text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-blue-600" /> Código / Ação Recomendada para Solução:
                </span>
                <p className="text-blue-950 font-mono text-[11px] font-bold">
                  {bs.fixAction}
                </p>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
