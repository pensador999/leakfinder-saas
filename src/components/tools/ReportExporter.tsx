import React, { useState } from 'react';
import { X, Printer, Copy, Check, FileText } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface ReportExporterProps {
  diagnostic: AgentDiagnosticResult;
  onClose: () => void;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({ diagnostic, onClose }) => {
  const { input, cro, seo, ads, salesCopy, pmGrowth } = diagnostic;
  const [copiedMd, setCopiedMd] = useState(false);

  const markdownContent = `# PLANO ESTRATÉGICO DE CRESCIMENTO E VENDAS - NEXUS GROWTH AI

**Domínio:** ${input.siteUrl}
**Marca:** ${input.businessName}
**Nicho:** ${input.niche}
**Ticket Médio (AOV):** R$ ${input.averageOrderValue}
**Faturamento Mensal:** ${input.monthlyRevenue}
**Growth Health Score:** ${diagnostic.growthScore}/100
**Projeção de Incremento de Receita:** +${diagnostic.estimatedRevenueLiftMin}% a +${diagnostic.estimatedRevenueLiftMax}%

---

## 1. DIAGNÓSTICO DE CRO & USUABILIDADE (SITE AUDIT)
**Score CRO:** ${cro.score}/100 | **Velocidade Mobile:** ${(cro.mobileSpeedMs / 1000).toFixed(1)}s

### Gargalos Críticos Identificados:
${cro.findings.map(f => `- **[${f.impact}] ${f.title}:** ${f.description}\n  *Recomendação:* ${f.recommendation}`).join('\n')}

### Quick Wins Imediatos:
${cro.quickWins.map(w => `- [ ] ${w}`).join('\n')}

---

## 2. ESTRATÉGIA DE SEO & BUSCA ORGÂNICA
**Score SEO:** ${seo.score}/100

### Palavras-Chave de Ouro:
${seo.topKeywords.map(k => `- **"${k.keyword}"** (${k.funnelStage} - ${k.volume}): Título sugerido: "${k.suggestedTitle}"`).join('\n')}

---

## 3. PLANO DE MÍDIA PAGA (META & GOOGLE ADS)
- **ROAS Alvo:** ${ads.targetRoas}x
- **CAC Limite:** R$ ${ads.maxCacAllowed}
- **Orçamento Mensal Sugerido:** R$ ${ads.monthlyAdBudgetSuggested.toLocaleString('pt-BR')} (60% Frio / 30% Retargeting / 10% Testes)

### Anúncios Recomendados:
${ads.creatives.map(c => `#### ${c.angleName} (${c.format})\n- **Gancho:** "${c.hook}"\n- **Corpo:** ${c.bodyCopy}\n- **CTA:** ${c.cta}`).join('\n\n')}

---

## 4. COPYWRITING & MATRIZ DE OFERTAS
### Bundles & Upsells para Aumentar Ticket Médio:
${salesCopy.offers.map(o => `- **${o.title} (${o.type}):** ${o.description} | Preço: ${o.suggestedPrice} (${o.estimatedAovLift})`).join('\n')}

---

## 5. MATRIZ ICE DE PRIORIZAÇÃO DE EXPERIMENTOS
${pmGrowth.iceMatrix.map(i => `- **[Score ICE: ${i.iceScore}]** ${i.title} (${i.category})`).join('\n')}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Relatório Executivo de Crescimento (Print/Export)</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyMarkdown}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? 'Copiado!' : 'Copiar Markdown'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Content View */}
        <div className="p-8 overflow-y-auto text-slate-200 space-y-6 text-sm font-sans print:p-0 print:text-black">
          
          <div className="border-b border-slate-800 pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-black text-white">PLANO ESTRATÉGICO DE CRESCIMENTO</h1>
                <p className="text-xs text-indigo-400 mt-0.5">Gerado por Nexus Growth AI Multi-Agent Suite</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold font-mono text-emerald-400">
                  {diagnostic.growthScore}/100
                </span>
                <p className="text-[10px] text-slate-400">Growth Health Score</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block">Domínio:</span>
                <span className="font-semibold text-white font-mono">{input.siteUrl}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Nicho:</span>
                <span className="font-semibold text-white">{input.niche}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Ticket Médio:</span>
                <span className="font-semibold text-emerald-400 font-mono">R$ {input.averageOrderValue}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Incremento Estimado:</span>
                <span className="font-semibold text-emerald-400 font-mono">+{diagnostic.estimatedRevenueLiftMin}% a +{diagnostic.estimatedRevenueLiftMax}%</span>
              </div>
            </div>
          </div>

          {/* Section 1: CRO */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1">
              <span>1. Auditoria de CRO & Usabilidade</span>
            </h2>
            <div className="space-y-2 text-xs">
              {cro.findings.map((f, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="font-bold text-rose-400">[{f.impact}] {f.title}</span>
                  <p className="text-slate-300 mt-1">{f.description}</p>
                  <p className="text-indigo-300 mt-1"><strong>Ação:</strong> {f.recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: SEO */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1">
              <span>2. Estratégia de SEO & Palavras-Chave</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-300">
              {seo.topKeywords.map((k, i) => (
                <li key={i}>
                  <strong className="text-white font-mono">{k.keyword}</strong> ({k.funnelStage} - {k.volume}) — Título sugerido: <em>"{k.suggestedTitle}"</em>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Ads */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-1">
              <span>3. Mídia Paga & Criativos (ROAS {ads.targetRoas}x)</span>
            </h2>
            <div className="space-y-2 text-xs">
              {ads.creatives.map((c, i) => (
                <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="font-bold text-pink-400">{c.angleName} ({c.format})</span>
                  <p className="text-slate-200"><strong>Gancho:</strong> "{c.hook}"</p>
                  <p className="text-slate-400">{c.bodyCopy}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
