import React, { useState } from 'react';
import { Eye, Code, Zap, AlertCircle, ShieldCheck, ImageOff, Copy, Check, AlertTriangle, Layers, Ruler, FileText, Download, Sparkles, Filter, PackageCheck, ExternalLink, Link2 } from 'lucide-react';
import { AgentDiagnosticResult } from '../types';

interface BlindspotAuditViewProps {
  diagnostic: AgentDiagnosticResult;
}

type CatalogFilter = 'TODOS' | 'GRADE_FURADA' | 'ISENTOS_FULL' | 'SEM_FOTO' | 'SEM_DESCRICAO' | 'IMAGENS_PESADAS';

export const BlindspotAuditView: React.FC<BlindspotAuditViewProps> = ({ diagnostic }) => {
  const { realSiteData, guardrailReport } = diagnostic;
  const { catalogAudit } = realSiteData;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<CatalogFilter>('TODOS');

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const standardSizes = ['PP', 'P', 'M', 'G', 'GG', 'G1', 'G2'];

  const filteredIssues = (catalogAudit?.issues || []).filter(issue => {
    if (activeFilter === 'GRADE_FURADA') return !issue.isFullPrintExempt && issue.missingSizes.length > 0;
    if (activeFilter === 'ISENTOS_FULL') return issue.isFullPrintExempt;
    if (activeFilter === 'SEM_FOTO') return !issue.hasValidImage;
    if (activeFilter === 'SEM_DESCRICAO') return !issue.hasDescription || !issue.hasSizeGuide;
    if (activeFilter === 'IMAGENS_PESADAS') return issue.imageWeightKb > 350;
    return true;
  });

  const exportCatalogCsv = () => {
    const headers = ['SKU', 'Produto', 'Link Direto do Produto (URL)', 'Status Imagem', 'Peso Imagem (KB)', 'Grade Disponível', 'Tamanhos Faltantes (PP->G2)', 'Isenção _FULL', 'Tabela Medidas', 'Ação Recomendada'];
    const rows = (catalogAudit?.issues || []).map(i => [
      `"${i.sku}"`,
      `"${i.productTitle.replace(/"/g, '""')}"`,
      `"${i.productUrl || `https://${realSiteData.domain}/produto/${i.sku.toLowerCase()}`}"`,
      `"${i.imageResolutionStatus}"`,
      i.imageWeightKb,
      `"${i.availableSizes.join(', ')}"`,
      `"${i.isFullPrintExempt ? 'N/A (_FULL)' : i.missingSizes.join(', ') || 'Completa'}"`,
      `"${i.isFullPrintExempt ? 'SIM (Isento)' : 'NÃO (Obrigatório PP->G2)'}"`,
      `"${i.hasSizeGuide ? 'Presente' : 'AUSENTE'}"`,
      `"${i.recommendedAction.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Auditoria_Catalogo_SKUs_Links_${realSiteData.brandName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-md shadow-blue-500/20">
            <Layers className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Auditoria Avançada de Catálogo & Links Diretos BRK</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" /> Links dos Produtos & Grade PP→G2
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Acesse diretamente cada página de produto com erro em <span className="font-mono text-slate-900 font-bold">{realSiteData.domain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCatalogCsv}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Exportar Planilha com Links (CSV)</span>
          </button>
        </div>
      </div>

      {/* Catalog KPI Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] text-slate-400 font-bold uppercase">Produtos Lidos</span>
          <p className="text-xl font-bold font-mono text-slate-900 mt-0.5">{catalogAudit?.totalProductsScanned || 0}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] text-rose-500 font-bold uppercase">Sem Foto</span>
          <p className="text-xl font-bold font-mono text-rose-600 mt-0.5">{catalogAudit?.productsWithMissingImages || 0}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] text-amber-600 font-bold uppercase">Grade Furada</span>
          <p className="text-xl font-bold font-mono text-amber-600 mt-0.5">{catalogAudit?.productsWithBrokenGrid || 0}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] text-emerald-600 font-bold uppercase">Isentos _FULL</span>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-0.5">{catalogAudit?.productsWithFullExemption || 0}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] text-indigo-600 font-bold uppercase">Sem Tabela Medidas</span>
          <p className="text-xl font-bold font-mono text-indigo-600 mt-0.5">{catalogAudit?.productsWithoutSizeGuide || 0}</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] text-slate-500 font-bold uppercase">Fotos Pesadas (&gt;350k)</span>
          <p className="text-xl font-bold font-mono text-slate-700 mt-0.5">{catalogAudit?.heavyImagesCount || 0}</p>
        </div>
      </div>

      {/* 🏷️ FILTER BUTTONS */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1 ml-2 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filtrar:
        </span>
        {[
          { id: 'TODOS', label: 'Todos os SKUs' },
          { id: 'GRADE_FURADA', label: 'Grade Furada (Falta PP a G2)' },
          { id: 'ISENTOS_FULL', label: 'Isentos pela Regra _FULL' },
          { id: 'SEM_FOTO', label: 'Sem Foto / Quebrada' },
          { id: 'SEM_DESCRICAO', label: 'Sem Tabela de Medidas' },
          { id: 'IMAGENS_PESADAS', label: 'Imagens Pesadas (&gt;350 KB)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as CatalogFilter)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 📦 SKU ISSUE CARDS LIST WITH DIRECT PRODUCT LINKS */}
      <div className="space-y-4">
        {filteredIssues.map((issue) => {
          const productDirectUrl = issue.productUrl || `https://${realSiteData.domain}/produto/${issue.sku.toLowerCase()}`;

          return (
            <div 
              key={issue.id} 
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-slate-900 text-white font-mono font-bold text-xs rounded-lg">
                      {issue.sku}
                    </span>

                    {issue.isFullPrintExempt ? (
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px] uppercase rounded-lg flex items-center gap-1">
                        <PackageCheck className="w-3 h-3 text-emerald-600" /> Isento pela Regra _FULL (Estampa Especial)
                      </span>
                    ) : issue.missingSizes.length > 0 ? (
                      <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 font-bold text-[10px] uppercase rounded-lg flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" /> Grade Furada ({issue.missingSizes.length} tamanhos ausentes)
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase rounded-lg">
                        Grade Completa (PP a G2)
                      </span>
                    )}

                    {!issue.hasValidImage && (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 font-bold text-[10px] uppercase rounded-lg">
                        Sem Foto
                      </span>
                    )}

                    {issue.imageWeightKb > 350 && (
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-bold text-[10px] uppercase rounded-lg">
                        {issue.imageWeightKb} KB (Pesado)
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 pt-1">{issue.productTitle}</h3>
                  
                  {/* 🔗 DIRECT PRODUCT LINK DISPLAY */}
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-mono pt-0.5">
                    <Link2 className="w-3.5 h-3.5 text-slate-400" />
                    <a 
                      href={productDirectUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline flex items-center gap-1 text-slate-600 hover:text-blue-600 truncate max-w-md"
                    >
                      <span>{productDirectUrl}</span>
                    </a>
                  </div>
                </div>

                {/* Direct Action Buttons: Open Link & Copy Link */}
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={productDirectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Abrir página deste produto na loja em nova aba"
                  >
                    <span>Abrir na Loja</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => handleCopyText(`link-${issue.id}`, productDirectUrl)}
                    className="px-3 py-2 text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    title="Copiar URL deste produto"
                  >
                    {copiedId === `link-${issue.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedId === `link-${issue.id}` ? 'Link Copiado!' : 'Copiar Link'}</span>
                  </button>
                </div>
              </div>

              {/* Grid & Diagnostic Detail Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                
                {/* Size Grid Inspector */}
                <div className="md:col-span-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 uppercase text-[10px] flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-blue-600" /> Grade de Linha BRK (PP → G2):
                    </span>
                    {issue.isFullPrintExempt && (
                      <span className="text-[10px] text-emerald-700 font-bold">Grade livre para modelo _FULL</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {standardSizes.map((sz) => {
                      const isAvailable = issue.availableSizes.includes(sz);
                      const isMissing = issue.missingSizes.includes(sz);

                      return (
                        <span
                          key={sz}
                          className={`w-9 h-8 flex items-center justify-center font-mono font-bold text-xs rounded-lg border ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs'
                              : isMissing
                              ? 'bg-rose-50 text-rose-600 border-rose-300 line-through opacity-80'
                              : 'bg-slate-200/60 text-slate-400 border-slate-300'
                          }`}
                          title={isAvailable ? `Tamanho ${sz} disponível em estoque` : isMissing ? `Tamanho ${sz} em falta / não cadastrado` : `Tamanho ${sz}`}
                        >
                          {sz}
                        </span>
                      );
                    })}
                  </div>

                  {!issue.isFullPrintExempt && issue.missingSizes.length > 0 && (
                    <p className="text-[11px] text-rose-700 font-semibold pt-1">
                      ⚠️ Atenção: Clientes buscando tamanhos ({issue.missingSizes.join(', ')}) não conseguem comprar.
                    </p>
                  )}
                </div>

                {/* Photo & Description Attributes */}
                <div className="md:col-span-6 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="font-bold text-slate-700 uppercase text-[10px] flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" /> Atributos de Cadastro & Mídia:
                  </span>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500">Tabela Medidas:</span>
                      <span className={`font-bold ${issue.hasSizeGuide ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {issue.hasSizeGuide ? '✅ Configurada' : '❌ Ausente'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500">Foto Principal:</span>
                      <span className={`font-bold ${issue.hasValidImage ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {issue.hasValidImage ? `${issue.imageResolutionStatus}` : '❌ Quebrada'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500">Peso da Imagem:</span>
                      <span className={`font-mono font-bold ${issue.imageWeightKb > 350 ? 'text-amber-600' : 'text-slate-700'}`}>
                        {issue.imageWeightKb > 0 ? `${issue.imageWeightKb} KB` : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-slate-500">Texto Descritivo:</span>
                      <span className={`font-bold ${issue.hasDescription ? 'text-slate-800' : 'text-rose-600'}`}>
                        {issue.descriptionLength > 0 ? `${issue.descriptionLength} caracteres` : 'Vazio'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Recommended Action Box */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                <span className="text-blue-950 font-medium leading-snug">
                  <strong className="text-blue-900 font-bold">Ação Corretiva:</strong> {issue.recommendedAction}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* Validated Code & HTML Vulnerabilities List */}
      <div className="space-y-4 font-medium pt-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" /> Impacto Direto nas Vendas:
                </span>
                <p className="text-amber-800">{bs.impactExplanation}</p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                <span className="font-bold text-blue-900 flex items-center gap-1 text-[11px]">
                  <Zap className="w-3.5 h-3.5 text-blue-600" /> Solução Recomendada:
                </span>
                <p className="text-blue-950 font-mono text-[11px] font-bold">{bs.fixAction}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
