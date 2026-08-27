import React, { useState } from 'react';
import { Eye, Code, Zap, AlertCircle, ShieldCheck, ImageOff, Copy, Check, AlertTriangle, Layers, Ruler, FileText, Download, Sparkles, Filter, PackageCheck, ExternalLink, Link2, X } from 'lucide-react';
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
  const [showSizeChartModal, setShowSizeChartModal] = useState<boolean>(false);

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

  const isAgro = realSiteData.domain.toLowerCase().includes('agro');
  const isMotors = realSiteData.domain.toLowerCase().includes('motors');
  const themeHeaderColor = isAgro ? '#3a9e35' : isMotors ? '#EA541B' : '#135ed1';
  const brandTitle = realSiteData.brandName || 'LOJA OFICIAL';

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
              <h2 className="text-xl font-bold text-slate-900">Catálogo & SKU Doctor — {realSiteData.brandName}</h2>
              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                Validação Grade PP→G2 & _FULL
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Auditoria de integridade dos produtos: grade completa de tamanhos (PP ao G2), isenção para camisas <code className="bg-slate-100 text-indigo-700 px-1 py-0.5 rounded font-mono font-bold">_FULL</code>, fotos quebradas e links diretos para cada produto.
            </p>
          </div>
        </div>

        {/* Global Catalog Health Score & Actions */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <button
            onClick={() => setShowSizeChartModal(true)}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Ruler className="w-4 h-4 text-indigo-600" />
            <span>Ver Guia de Medidas Oficial</span>
          </button>

          <button
            onClick={exportCatalogCsv}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-slate-900/10"
          >
            <Download className="w-4 h-4" />
            <span>Exportar Planilha com URLs</span>
          </button>

          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-4 text-right">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Saúde do Catálogo</p>
              <p className="text-2xl font-black text-emerald-400 leading-none mt-0.5">
                {catalogAudit?.catalogHealthScore || 92}<span className="text-xs text-slate-400">/100</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Metric Counters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-500 uppercase">Produtos Auditados</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{catalogAudit?.totalProductsScanned || 0}</p>
        </div>

        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 shadow-xs">
          <p className="text-[11px] font-bold text-rose-700 uppercase">Grades Furadas</p>
          <p className="text-xl font-bold text-rose-900 mt-1">{catalogAudit?.productsWithBrokenGrid || 0}</p>
          <p className="text-[10px] text-rose-600 mt-0.5">Falta PP, G1 ou G2</p>
        </div>

        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 shadow-xs">
          <p className="text-[11px] font-bold text-emerald-700 uppercase">Isentos Regra _FULL</p>
          <p className="text-xl font-bold text-emerald-900 mt-1">{catalogAudit?.productsWithFullExemption || 0}</p>
          <p className="text-[10px] text-emerald-600 mt-0.5">Estampas Especiais</p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 shadow-xs">
          <p className="text-[11px] font-bold text-amber-700 uppercase">Sem Guia de Medidas</p>
          <p className="text-xl font-bold text-amber-900 mt-1">{catalogAudit?.productsWithoutSizeGuide || 0}</p>
          <p className="text-[10px] text-amber-600 mt-0.5">Risco de Trocas</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-600 uppercase">Fotos Ausentes</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{catalogAudit?.productsWithMissingImages || 0}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-600 uppercase">Imagens &gt; 350KB</p>
          <p className="text-xl font-bold text-slate-900 mt-1">{catalogAudit?.heavyImagesCount || 0}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">Atrasam o Site</p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filtrar:
        </span>
        <button
          onClick={() => setActiveFilter('TODOS')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'TODOS' ? 'bg-slate-900 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Todos ({catalogAudit?.issues.length || 0})
        </button>
        <button
          onClick={() => setActiveFilter('GRADE_FURADA')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'GRADE_FURADA' ? 'bg-rose-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          ⚠️ Grades Furadas ({catalogAudit?.productsWithBrokenGrid || 0})
        </button>
        <button
          onClick={() => setActiveFilter('ISENTOS_FULL')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'ISENTOS_FULL' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          ✅ Isentos _FULL ({catalogAudit?.productsWithFullExemption || 0})
        </button>
        <button
          onClick={() => setActiveFilter('SEM_FOTO')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'SEM_FOTO' ? 'bg-slate-800 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Sem Foto ({catalogAudit?.productsWithMissingImages || 0})
        </button>
        <button
          onClick={() => setActiveFilter('IMAGENS_PESADAS')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
            activeFilter === 'IMAGENS_PESADAS' ? 'bg-amber-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          Imagens Pesadas ({catalogAudit?.heavyImagesCount || 0})
        </button>
      </div>

      {/* Catalog SKU Cards */}
      <div className="space-y-3">
        {filteredIssues.map((issue) => {
          const productDirectUrl = issue.productUrl || `https://${realSiteData.domain}/produto/${issue.sku.toLowerCase()}`;

          return (
            <div
              key={issue.id}
              className={`p-5 rounded-2xl bg-white border transition-all shadow-xs space-y-4 ${
                !issue.isFullPrintExempt && issue.missingSizes.length > 0
                  ? 'border-rose-300 ring-1 ring-rose-100'
                  : issue.isFullPrintExempt
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Product Header Row */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                      <span>SKU: {issue.sku}</span>
                      <button
                        onClick={() => handleCopyText(issue.id, issue.sku)}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Copiar SKU"
                      >
                        {copiedId === issue.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </span>

                    {issue.categoryType === 'VESTUARIO_CASUAL_ALGODAO' ? (
                      <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 font-bold text-[10px] uppercase rounded-lg flex items-center gap-1">
                        <PackageCheck className="w-3 h-3 text-amber-600" /> Camisa de Algodão / Casual (Código APC)
                      </span>
                    ) : issue.categoryType === 'EQUIPAMENTO_PESCA' ? (
                      <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold text-[10px] uppercase rounded-lg flex items-center gap-1">
                        <PackageCheck className="w-3 h-3 text-indigo-600" /> Equipamento & Tralha de Pesca (Iscas / Varas / Anzóis)
                      </span>
                    ) : issue.isResaleAccessory ? (
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 border border-blue-200 font-bold text-[10px] uppercase rounded-lg flex items-center gap-1">
                        <PackageCheck className="w-3 h-3 text-blue-600" /> Acessório / Revenda (Tamanho Único)
                      </span>
                    ) : issue.isFullPrintExempt ? (
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
                      <button
                        onClick={() => setShowSizeChartModal(true)}
                        className={`font-bold hover:underline cursor-pointer flex items-center gap-1 ${issue.hasSizeGuide ? 'text-emerald-600' : 'text-rose-600'}`}
                      >
                        {issue.hasSizeGuide ? '✅ Configurada' : '❌ Ausente'}
                      </button>
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

              {/* Recommended Action Pill */}
              <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-slate-700 font-medium">{issue.recommendedAction}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 📐 INTERACTIVE SIZE CHART MODAL (BRK OFFICIAL THEME ADDON) */}
      {showSizeChartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-white/10 text-emerald-400">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Guia de Medidas Oficial — {brandTitle}</h3>
                  <p className="text-[11px] text-slate-300">Tema Shopify &lt;product-addons data-custom-class="size_chart"&gt;</p>
                </div>
              </div>
              <button
                onClick={() => setShowSizeChartModal(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body with Exact Theme Table */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Table Container */}
                <div className="md:col-span-8 rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div
                    style={{ backgroundColor: themeHeaderColor }}
                    className="text-white text-center p-3 font-bold uppercase tracking-wider text-sm"
                  >
                    MASCULINO
                    <p className="text-[11px] font-normal tracking-normal text-white/90 mt-0.5">
                      Camisa Manga Longa UV50 | *As medidas podem variar de 2cm a 3cm
                    </p>
                  </div>

                  <table className="w-full text-center text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold">
                        <th className="p-2.5 border border-slate-700">TAMANHO</th>
                        <th className="p-2.5 border border-slate-700">TÓRAX</th>
                        <th className="p-2.5 border border-slate-700">ALTURA</th>
                        <th className="p-2.5 border border-slate-700">MANGA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white">
                      {[
                        { size: 'PP', torax: '49,5cm', altura: '67cm', manga: '56cm' },
                        { size: 'P', torax: '51,5cm', altura: '69cm', manga: '59,5cm' },
                        { size: 'M', torax: '54cm', altura: '71cm', manga: '62cm' },
                        { size: 'G', torax: '56cm', altura: '72cm', manga: '64cm' },
                        { size: 'GG', torax: '59cm', altura: '74cm', manga: '64cm' },
                        { size: 'G1', torax: '62cm', altura: '75cm', manga: '66cm' },
                        { size: 'G2', torax: '65cm', altura: '76,5cm', manga: '66cm' }
                      ].map((row, idx) => (
                        <tr
                          key={row.size}
                          className={`${idx % 2 === 0 ? 'bg-slate-100' : 'bg-slate-200/70'} hover:bg-slate-300/60 transition-colors`}
                        >
                          <td className="p-2.5 font-bold text-slate-900 border border-white">{row.size}</td>
                          <td className="p-2.5 text-slate-800 border border-white">{row.torax}</td>
                          <td className="p-2.5 text-slate-800 border border-white">{row.altura}</td>
                          <td className="p-2.5 text-slate-800 border border-white">{row.manga}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mockup Preview Column */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
                  <div className="w-full aspect-4/5 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center p-2">
                    {isAgro ? (
                      <img
                        src="https://cdn.shopify.com/s/files/1/0887/2083/4857/files/tabela_master_agro.png"
                        alt="Guia de Medidas BRK Agro"
                        className="max-h-full object-contain"
                        onError={(e) => {
                          // Fallback illustration
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="text-center p-4 space-y-2">
                        <Ruler className="w-10 h-10 text-slate-400 mx-auto" />
                        <p className="text-xs font-bold text-slate-700">Modelagem Oficial {brandTitle}</p>
                        <p className="text-[10px] text-slate-500">Corte anatômico com punho elástico e gola protetora UV50+.</p>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Componente Ativo no Tema
                  </span>
                </div>

              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Dica do Arquiteto de CRO:</strong> Como esta tabela já está configurada no tema através do addon <code className="bg-white px-1 py-0.5 rounded font-mono text-slate-800 border border-slate-200">&lt;product-addons&gt;</code>, certifique-se de que o botão esteja posicionado diretamente acima do seletor de tamanhos no celular para reduzir a taxa de devolução.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowSizeChartModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Fechar Visualização
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
