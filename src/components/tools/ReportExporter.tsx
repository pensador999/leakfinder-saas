import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  Sparkles, 
  Layers, 
  Eye, 
  CheckCircle2, 
  Zap 
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { calculateStoreFinancialGrounding } from '../../services/ai/storeFinancialGroundingEngine';
import { auditSupplyChainDiscrepancy } from '../../services/supplyChain/erpHubDiscrepancyEngine';

interface ReportExporterProps {
  diagnostic: AgentDiagnosticResult;
  onClose: () => void;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({ diagnostic, onClose }) => {
  const { input, realSiteData, growthScore, estimatedRevenueLiftMin, estimatedRevenueLiftMax, visionAnalysis, social } = diagnostic;
  const [copiedMd, setCopiedMd] = useState(false);
  const agencyName = 'AdShield Growth Intelligence';

  const finances = calculateStoreFinancialGrounding(realSiteData, input, social);
  const supplyChainAudit = auditSupplyChainDiscrepancy(realSiteData, input);

  const markdownContent = `# RELATÓRIO EXECUTIVO DE AUDITORIA & TELEMETRIA — ADSHIELD
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
*Relatório gerado por ${agencyName} via AdShield SaaS.*
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E100F]/90 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      <div className="relative w-full max-w-4xl bg-[#101211] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:my-0 print:border-none text-[#FFFCE1]">
        
        {/* Top Control Bar (Hidden on Print) */}
        <div className="p-4 bg-[#141716] border-b border-white/10 flex items-center justify-between text-[#FFFCE1] print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0AE448]" />
            <h3 className="font-bold text-sm">Relatório Executivo Diagramado (Pronto para PDF / Diretoria)</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyMarkdown}
              className="px-3.5 py-1.5 text-xs font-bold bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-[#0AE448]" /> : <Copy className="w-3.5 h-3.5 text-[#BBBAA6]" />}
              <span>{copiedMd ? 'Copiado!' : 'Copiar Markdown'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-black bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#0AE448]/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Salvar em PDF / Imprimir</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#BBBAA6] hover:text-white rounded-lg transition-colors cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 overflow-y-auto space-y-8 print:p-6 print:overflow-visible text-[#FFFCE1] font-sans bg-[#0E100F]">
          
          {/* Executive Header */}
          <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-extrabold font-mono uppercase tracking-widest text-[#0AE448] bg-[#0AE448]/10 px-2.5 py-1 rounded-md border border-[#0AE448]/20">
                AUDITORIA DE PERFORMANCE & CATÁLOGO
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#FFFCE1] tracking-tight mt-2">
                Relatório de Crescimento: {realSiteData.brandName}
              </h1>
              <p className="text-xs text-[#BBBAA6] font-mono mt-1">
                Domínio: <strong className="text-[#FFFCE1]">{realSiteData.domain}</strong> • Plataforma: <strong className="text-[#FFFCE1]">{realSiteData.ecommercePlatform}</strong> • Data: {diagnostic.analyzedAt || new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>

            {/* Growth Score Badge */}
            <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl text-center shrink-0 min-w-[140px] shadow-xl">
              <p className="text-[10px] font-mono uppercase font-bold text-[#BBBAA6]">AdShield Score</p>
              <p className="text-3xl font-black text-[#0AE448] leading-none mt-1 font-mono">
                {growthScore} <span className="text-xs text-[#BBBAA6] font-normal">/ 100</span>
              </p>
            </div>
          </div>

          {/* 4-Card Executive KPI Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className={`p-4 rounded-2xl border space-y-1 ${
              finances.financialRisk.totalMonthlyLoss > 0 
                ? 'bg-[#141716] border-rose-500/30' 
                : 'bg-[#141716] border-[#0AE448]/30'
            }`}>
              <p className={`text-[10px] font-bold uppercase font-mono ${
                finances.financialRisk.totalMonthlyLoss > 0 ? 'text-rose-400' : 'text-[#0AE448]'
              }`}>
                {finances.financialRisk.totalMonthlyLoss > 0 ? 'Vazamento em Mídia' : 'Status do Catálogo'}
              </p>
              <p className={`text-xl font-black font-mono ${
                finances.financialRisk.totalMonthlyLoss > 0 ? 'text-rose-400' : 'text-[#0AE448]'
              }`}>
                {finances.financialRisk.totalMonthlyLoss > 0 
                  ? finances.financialRisk.formattedMonthlyLoss 
                  : 'Grade Blindada (R$ 0)'}
              </p>
              <p className="text-[10px] text-[#BBBAA6]">
                {finances.financialRisk.totalMonthlyLoss > 0 
                  ? `${finances.brokenSkusCount} SKU(s) com ruptura` 
                  : 'Zero perda em anúncios'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141716] border border-[#0AE448]/30 space-y-1">
              <p className="text-[10px] font-bold uppercase text-[#0AE448] font-mono">Lift Projetado</p>
              <p className="text-xl font-black text-[#0AE448] font-mono">
                +{estimatedRevenueLiftMin}% a +{estimatedRevenueLiftMax}%
              </p>
              <p className="text-[10px] text-[#BBBAA6]">Recuperação em 90 dias</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-1">
              <p className="text-[10px] font-bold uppercase text-[#00BAE2] font-mono">Saúde do Catálogo</p>
              <p className="text-xl font-black text-[#FFFCE1] font-mono">
                {realSiteData.catalogAudit?.catalogHealthScore || 0}%
              </p>
              <p className="text-[10px] text-[#BBBAA6]">{realSiteData.catalogAudit?.totalProductsScanned || 0} SKUs auditados</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-1">
              <p className="text-[10px] font-bold uppercase text-[#BBBAA6] font-mono">Contraste WCAG 2.1</p>
              <p className="text-xl font-black text-[#FFFCE1] font-mono">
                {visionAnalysis.contrastAudit.contrastRatio}:1
              </p>
              <p className="text-[10px] text-[#BBBAA6]">{visionAnalysis.contrastAudit.wcagAaPassed ? 'Aprovado AA' : 'Abaixo do Padrão'}</p>
            </div>
          </div>

          {/* Section 1: Catalog SKU Doctor Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-white/10 pb-2">
              <Layers className="w-4 h-4 text-[#00BAE2]" />
              <h3 className="font-bold text-sm text-[#FFFCE1]">1. Auditoria Cirúrgica de SKUs e Estoque Ativo</h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10 text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#141716] border-b border-white/10 text-[#BBBAA6] font-mono uppercase text-[10px]">
                    <th className="p-2.5">SKU</th>
                    <th className="p-2.5">Produto</th>
                    <th className="p-2.5">Diagnóstico de Grade</th>
                    <th className="p-2.5 text-right">Perda Estimada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {(realSiteData.catalogAudit?.issues || []).slice(0, 6).map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-2.5 font-bold text-[#FFFCE1]">{item.sku}</td>
                      <td className="p-2.5 font-sans truncate max-w-xs text-[#FFFCE1]">{item.productTitle}</td>
                      <td className="p-2.5 font-sans">
                        {item.categoryType === 'EQUIPAMENTO_PESCA' ? (
                          <span className="text-[#00BAE2] font-bold text-[11px]">Equipamento de Pesca (Conforme)</span>
                        ) : item.isResaleAccessory ? (
                          <span className="text-white/60 font-bold text-[11px]">Acessório / Tamanho Único</span>
                        ) : item.isFullPrintExempt ? (
                          <span className="text-[#0AE448] font-bold text-[11px]">Isento Regra _FULL</span>
                        ) : item.missingSizes.length > 0 ? (
                          <span className="text-rose-400 font-bold text-[11px]">Faltam ({item.missingSizes.join(', ')})</span>
                        ) : (
                          <span className="text-[#0AE448] font-bold text-[11px]">Grade Completa</span>
                        )}
                      </td>
                      <td className="p-2.5 text-right font-bold text-rose-400">
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
            <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#FFFCE1]">
                <Eye className="w-4 h-4 text-[#00BAE2]" />
                <span>Visão Computacional & Eye-Tracking</span>
              </div>
              <p className="text-xs text-[#BBBAA6] leading-relaxed">
                <strong className="text-[#FFFCE1]">Ímã Visual Dominante:</strong> {visionAnalysis.eyeTracking.mainFocusElement}.  
                Foco no CTA de compra avaliado em <strong className="text-[#FFFCE1]">{visionAnalysis.eyeTracking.focusScoreCta}%</strong>.
              </p>
              <p className="text-xs text-[#BBBAA6]">
                {visionAnalysis.contrastAudit.recommendation}
              </p>
            </div>

            <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-xs text-[#FFFCE1]">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Ergonomia Mobile (Lei de Fitts)</span>
              </div>
              <p className="text-xs text-[#BBBAA6] leading-relaxed">
                <strong className="text-[#FFFCE1]">Localização do Botão:</strong> {visionAnalysis.thumbZone.ctaZoneLocation === 'EASY' ? 'Área Natural do Polegar' : 'Área de Estiramento'}.
              </p>
              <p className="text-xs text-[#BBBAA6]">
                {visionAnalysis.thumbZone.recommendation}
              </p>
            </div>
          </div>

          {/* Section 3: Recommended Action Plan */}
          <div className="p-5 bg-[#141716] border border-[#0AE448]/30 rounded-2xl space-y-3 shadow-xl">
            <h3 className="font-bold text-sm text-[#0AE448] flex items-center gap-1.5 font-mono">
              <Sparkles className="w-4 h-4" /> Plano de Ação & Remediação Imediata (Códigos Disponíveis)
            </h3>
            <ul className="space-y-1.5 text-xs text-[#BBBAA6]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448] shrink-0" />
                <span><strong className="text-[#FFFCE1]">Sticky Buy Button Mobile:</strong> Código Liquid pronto para fixar botão no celular (+24% conversão).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448] shrink-0" />
                <span><strong className="text-[#FFFCE1]">Botões de Tamanho 48px:</strong> CSS pronto para expandir área de toque dos tamanhos no mobile.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448] shrink-0" />
                <span><strong className="text-[#FFFCE1]">Desconto Pix 10%:</strong> Box Liquid pronto com cálculo de economia imediata à vista.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448] shrink-0" />
                <span><strong className="text-[#FFFCE1]">Defesa Tabnabbing:</strong> Script de proteção de segurança para links externos.</span>
              </li>
            </ul>
          </div>

          {/* Footer Branding */}
          <div className="border-t border-white/10 pt-4 flex items-center justify-between text-[11px] text-[#BBBAA6] font-mono">
            <span>Relatório Oficial emitido por {agencyName}</span>
            <span>https://adshield.vercel.app</span>
          </div>

        </div>

      </div>
    </div>
  );
};
