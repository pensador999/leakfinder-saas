import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Download, 
  Sparkles, 
  Layers, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Eye, 
  ExternalLink,
  Store,
  CheckCircle2,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { generateShopifyTelemetryAnalysis } from '../../services/shopifyTelemetryService';
import { calculateStoreFinancialGrounding } from '../../services/ai/storeFinancialGroundingEngine';
import { auditSupplyChainDiscrepancy } from '../../services/supplyChain/erpHubDiscrepancyEngine';

interface ReportExporterProps {
  diagnostic: AgentDiagnosticResult;
  onClose: () => void;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({ diagnostic, onClose }) => {
  const { input, realSiteData, growthScore, estimatedRevenueLiftMin, estimatedRevenueLiftMax, visionAnalysis, security, cro, social } = diagnostic;
  const [copiedMd, setCopiedMd] = useState(false);
  const [agencyName, setAgencyName] = useState('LeakFinder Growth Intelligence');

  const finances = calculateStoreFinancialGrounding(realSiteData, input, social);
  const supplyChainAudit = auditSupplyChainDiscrepancy(realSiteData, input);

  const telemetryData = generateShopifyTelemetryAnalysis(
    realSiteData.domain,
    realSiteData.catalogAudit?.issues || [],
    realSiteData.rawHtmlSnippet
  );

  const markdownContent = `# RELATÓRIO EXECUTIVO DE AUDITORIA & TELEMETRIA — LEAKFINDER
**Data da Auditoria:** ${diagnostic.analyzedAt || new Date().toLocaleDateString('pt-BR')}
**Loja / Domínio:** ${realSiteData.domain} (${realSiteData.url})
**Marca:** ${realSiteData.brandName}
**Porte do E-commerce:** ${finances.tierLabel}
**Plataforma Detectada:** ${realSiteData.ecommercePlatform} (${realSiteData.brandTier})
**Growth Score Global:** ${growthScore} / 100
**Projeção de Recuperação de Receita:** +${estimatedRevenueLiftMin}% a +${estimatedRevenueLiftMax}%

---

## 1. RESUMO EXECUTIVO DE IMPACTO FINANCEIRO
- **Impacto em Mídia:** ${finances.financialRisk.totalMonthlyLoss > 0 ? `${finances.financialRisk.formattedMonthlyLoss} / mês (${finances.financialRisk.formattedAnnualizedLoss} / ano)` : 'Grade 100% Blindada (R$ 0,00 de desperdício em anúncios)'}
- **Ticket Médio Ponderado:** ${finances.formattedAverageTicket}
- **Verba Estimada de Tráfego:** ${finances.estimatedAdSpend.formattedMonthly}
- **Produtos com Ruptura de Grade:** ${finances.brokenSkusCount} SKUs críticos
- **Origem Auditada:** ${finances.financialRisk.methodologyExplanation}

---

## 2. AUDITORIA DE DESCOMPASSO OPERACIONAL & TRÁFEGO (SANKHYA ERP ⟷ MAGIS5 ⟷ LOJA ⟷ ADS)
- **Score de Sincronia Operacional:** ${supplyChainAudit.operationalSyncScore}%
- **Risco Total por Descompasso:** ${supplyChainAudit.financialImpactSummary.formattedMonthlyTotalRisk} / mês
- **Desperdício em Cliques Fantasmas (Grau 1):** R$ ${supplyChainAudit.financialImpactSummary.monthlyAdWasteBRL.toLocaleString('pt-BR')} / mês
- **Risco de Venda Fantasma / Estorno (Grau 2):** R$ ${supplyChainAudit.financialImpactSummary.monthlyCancellationRiskBRL.toLocaleString('pt-BR')} / mês
- **Trava de Buffer Recomendada na Magis5:** ${supplyChainAudit.suggestedSafetyBufferUnits} unidades de segurança

---

## 3. GARGALOS CRÍTICOS IDENTIFICADOS NO CATÁLOGO
${(realSiteData.catalogAudit?.issues || []).map(i => `- **SKU ${i.sku} (${i.productTitle}):** ${i.isFullPrintExempt ? '[Isento Regra _FULL / Acessório]' : i.missingSizes.length > 0 ? `Faltam tamanhos: ${i.missingSizes.join(', ')}` : 'Grade Completa'} | URL: ${i.productUrl}`).join('\n')}

---

## 4. VISÃO COMPUTACIONAL & ERGONOMIA MOBILE
- **Ímã Visual Dominante:** ${visionAnalysis.eyeTracking.mainFocusElement}
- **Foco no CTA Principal:** ${visionAnalysis.eyeTracking.focusScoreCta}%
- **Contraste WCAG 2.1 AAA:** ${visionAnalysis.contrastAudit.contrastRatio}:1 (${visionAnalysis.contrastAudit.wcagAaPassed ? 'Aprovado' : 'Abaixo do Ideal'})
- **Recomendação Ergonômica:** ${visionAnalysis.thumbZone.recommendation}

---

## 5. PLANO DE AÇÃO & REMEDIAÇÃO IMEDIATA
1. Pausar no Meta Ads os criativos direcionados para SKUs com grade esgotada (M e G).
2. Ativar Trava de Buffer de Segurança (mínimo 2 un) na Magis5 para blindar o Sankhya ERP.
3. Implantação de Sticky Buy Button no rodapé mobile do tema.
4. Destaque do cálculo de 10% de desconto no Pix logo abaixo do preço.
5. Injeção da Tabela de Medidas (<product-addons>) nas páginas de produto.

---
*Relatório gerado por ${agencyName} via LeakFinder SaaS.*
`;

  const copyMarkdown = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:my-0 print:border-none">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-sm">Relatório Executivo Diagramado (Pronto para PDF / Diretoria)</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyMarkdown}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? 'Copiado!' : 'Copiar Markdown'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Salvar em PDF / Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 print:p-6 print:overflow-visible text-slate-900 font-sans">
          
          {/* Executive Header */}
          <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold font-mono uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                AUDITORIA DE PERFORMANCE & CATÁLOGO
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
                Relatório de Crescimento: {realSiteData.brandName}
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Domínio: <strong className="text-slate-800">{realSiteData.domain}</strong> • Plataforma: <strong className="text-slate-800">{realSiteData.ecommercePlatform}</strong> • Data: {diagnostic.analyzedAt || new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Growth Score Badge */}
            <div className="p-4 bg-slate-900 text-white rounded-2xl text-center shrink-0 min-w-[140px]">
              <p className="text-[10px] font-mono uppercase font-bold text-slate-400">LeakFinder Score</p>
              <p className="text-3xl font-black text-emerald-400 leading-none mt-1">
                {growthScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </p>
            </div>
          </div>

          {/* 4-Card Executive KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className={`p-4 rounded-2xl border space-y-1 ${
              finances.financialRisk.totalMonthlyLoss > 0 
                ? 'bg-rose-50/70 border-rose-200' 
                : 'bg-emerald-50/70 border-emerald-200'
            }`}>
              <p className={`text-[10px] font-bold uppercase ${
                finances.financialRisk.totalMonthlyLoss > 0 ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                {finances.financialRisk.totalMonthlyLoss > 0 ? 'Vazamento em Mídia' : 'Status do Catálogo'}
              </p>
              <p className={`text-xl font-black font-mono ${
                finances.financialRisk.totalMonthlyLoss > 0 ? 'text-rose-900' : 'text-emerald-800'
              }`}>
                {finances.financialRisk.totalMonthlyLoss > 0 
                  ? finances.financialRisk.formattedMonthlyLoss 
                  : 'Grade Blindada (R$ 0)'}
              </p>
              <p className={`text-[10px] ${
                finances.financialRisk.totalMonthlyLoss > 0 ? 'text-rose-600' : 'text-emerald-700'
              }`}>
                {finances.financialRisk.totalMonthlyLoss > 0 
                  ? `${finances.brokenSkusCount} SKU(s) com ruptura` 
                  : 'Zero perda em anúncios'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <p className="text-[10px] font-bold uppercase text-emerald-700">Lift Projetado</p>
              <p className="text-xl font-black text-emerald-900 font-mono">
                +{estimatedRevenueLiftMin}% a +{estimatedRevenueLiftMax}%
              </p>
              <p className="text-[10px] text-emerald-600">Recuperação em 90 dias</p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
              <p className="text-[10px] font-bold uppercase text-blue-700">Saúde do Catálogo</p>
              <p className="text-xl font-black text-blue-900 font-mono">
                {realSiteData.catalogAudit?.catalogHealthScore || 0}%
              </p>
              <p className="text-[10px] text-blue-600">{realSiteData.catalogAudit?.totalProductsScanned || 0} SKUs auditados</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <p className="text-[10px] font-bold uppercase text-slate-600">Contraste WCAG 2.1</p>
              <p className="text-xl font-black text-slate-900 font-mono">
                {visionAnalysis.contrastAudit.contrastRatio}:1
              </p>
              <p className="text-[10px] text-slate-500">{visionAnalysis.contrastAudit.wcagAaPassed ? 'Aprovado AA' : 'Abaixo do Padrão'}</p>
            </div>
          </div>

          {/* Section 1: Catalog SKU Doctor Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900">1. Auditoria Cirúrgica de SKUs e Estoque Ativo</h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="p-2.5">SKU</th>
                    <th className="p-2.5">Produto</th>
                    <th className="p-2.5">Diagnóstico de Grade</th>
                    <th className="p-2.5 text-right">Perda Estimada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {(realSiteData.catalogAudit?.issues || []).slice(0, 6).map((item) => (
                    <tr key={item.id}>
                      <td className="p-2.5 font-bold text-slate-900">{item.sku}</td>
                      <td className="p-2.5 font-sans truncate max-w-xs">{item.productTitle}</td>
                      <td className="p-2.5 font-sans">
                        {item.categoryType === 'EQUIPAMENTO_PESCA' ? (
                          <span className="text-indigo-700 font-bold text-[11px]">Equipamento de Pesca (Conforme)</span>
                        ) : item.isResaleAccessory ? (
                          <span className="text-blue-700 font-bold text-[11px]">Acessório / Tamanho Único</span>
                        ) : item.isFullPrintExempt ? (
                          <span className="text-emerald-700 font-bold text-[11px]">Isento Regra _FULL</span>
                        ) : item.missingSizes.length > 0 ? (
                          <span className="text-rose-600 font-bold text-[11px]">Faltam ({item.missingSizes.join(', ')})</span>
                        ) : (
                          <span className="text-emerald-600 font-bold text-[11px]">Grade Completa</span>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-bold text-rose-600">
                        R$ {Math.round((item.criticalIssuesCount > 0 ? 32 : 8) * 159.90).toLocaleString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Computer Vision & Mobile Ergonomics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Visão Computacional & Eye-Tracking</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Ímã Visual Dominante:</strong> {visionAnalysis.eyeTracking.mainFocusElement}.  
                Foco no CTA de compra avaliado em <strong>{visionAnalysis.eyeTracking.focusScoreCta}%</strong>.
              </p>
              <p className="text-xs text-slate-600">
                {visionAnalysis.contrastAudit.recommendation}
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Ergonomia Mobile (Lei de Fitts)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Localização do Botão:</strong> {visionAnalysis.thumbZone.ctaZoneLocation === 'EASY' ? 'Área Natural do Polegar' : 'Área de Estiramento'}.
              </p>
              <p className="text-xs text-slate-600">
                {visionAnalysis.thumbZone.recommendation}
              </p>
            </div>
          </div>

          {/* Section 3: Recommended Action Plan */}
          <div className="p-5 bg-slate-900 text-white rounded-2xl space-y-3">
            <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> Plano de Ação & Remediação Imediata (Códigos Disponíveis)
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Sticky Buy Button Mobile:</strong> Código Liquid pronto para fixar botão no celular (+24% conversão).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Botões de Tamanho 48px:</strong> CSS pronto para expandir área de toque dos tamanhos no mobile.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Desconto Pix 10%:</strong> Box Liquid pronto com cálculo de economia imediata à vista.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>Defesa Tabnabbing:</strong> Script de proteção de segurança para links externos.</span>
              </li>
            </ul>
          </div>

          {/* Footer Branding */}
          <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Relatório Oficial emitido por {agencyName}</span>
            <span>https://leakfinder-saas.vercel.app</span>
          </div>

        </div>

      </div>
    </div>
  );
};
