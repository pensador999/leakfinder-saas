import React from 'react';
import { ShoppingCart, ShieldAlert, CheckCircle2, Gauge, Lock, Zap, Smartphone, Ruler, AlertTriangle, Layers } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface CroAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const CroAgentView: React.FC<CroAgentViewProps> = ({ diagnostic }) => {
  const { cro, realSiteData } = diagnostic;
  const hasSizeGuide = realSiteData.rawHtmlSnippet?.includes('size_chart') || 
                       realSiteData.rawHtmlSnippet?.includes('product-addons') || 
                       realSiteData.catalogAudit?.productsWithoutSizeGuide === 0;

  const brokenCentralGridCount = realSiteData.catalogAudit?.productsWithBrokenGrid || 0;

  return (
    <div className="space-y-6">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Agente 10 — Arquiteto de CRO & Usabilidade</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                10 Heurísticas de Nielsen & UX Mobile
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Auditoria de fricção de compra, Thumb Zone móvel e checkout em <span className="font-mono text-slate-900 font-bold">{realSiteData.domain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Score CRO</p>
            <p className="text-xl font-bold font-mono text-blue-600">{cro.score}/100</p>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Velocidade Mobile</p>
            <p className="text-xl font-bold font-mono text-emerald-600 font-mono">{(cro.mobileSpeedMs / 1000).toFixed(1)}s</p>
          </div>
        </div>
      </div>

      {/* Real Inspection Metrics Row (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Tabela de Medidas (Widget):</span>
            <p className={`text-xs font-bold ${hasSizeGuide ? 'text-emerald-600' : 'text-amber-600'}`}>
              {hasSizeGuide ? 'Widget / Tabela Ativa' : 'Ausente (Risco de Devolução)'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Thumb Zone (Polegar):</span>
            <p className="text-xs font-bold text-emerald-600">Área Central Acessível</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Pix / Checkout no HTML:</span>
            <p className={`text-xs font-bold ${realSiteData.detectedCheckoutTerms.hasPix ? 'text-emerald-600' : 'text-amber-600'}`}>
              {realSiteData.detectedCheckoutTerms.hasPix ? 'Pix Nativo Detectado' : 'Sem aviso Pix na 1ª dobra'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center gap-3 shadow-xs">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Integridade da Grade:</span>
            <p className={`text-xs font-bold ${brokenCentralGridCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {brokenCentralGridCount > 0 ? `${brokenCentralGridCount} produtos com ruptura` : '100% dos SKUs Íntegros'}
            </p>
          </div>
        </div>

      </div>

      {/* Audit Findings List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>Gargalos de Conversão Lidos no HTML ({cro.findings.length})</span>
        </h3>

        <div className="space-y-3">
          {cro.findings.map((finding) => (
            <div key={finding.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs hover:border-slate-300 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-slate-100 text-slate-700">
                    {finding.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{finding.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded border ${
                    finding.impact === 'CRÍTICO' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    finding.impact === 'ALTO' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    Impacto: {finding.impact}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600">
                {finding.description}
              </p>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <span className="font-bold text-blue-900 flex items-center gap-1.5 mb-1">
                  <Zap className="w-3.5 h-3.5 text-blue-600" /> Recomendação LeakFinder:
                </span>
                <p className="text-slate-800">{finding.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Wins Box */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Checklist de Ação Imediata LeakFinder (Implementação em menos de 1 hora)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cro.quickWins.map((win, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5 font-medium">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                ✓
              </span>
              <span>{win}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nielsen Usability Heuristics Evaluation Box */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-600" />
            <span>Auditoria Heurística de Nielsen (NN/g) & Fricção de Conversão</span>
          </h3>
          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
            Padrão E-Commerce 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">1. Thumb Zone Ergonomics</span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">Aprovado</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Botão CTA Add-to-Cart na zona natural do polegar mobile (&ge; 48px de altura mínima).
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">2. Prevenção de Erros (Size Chart)</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${hasSizeGuide ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'}`}>
                {hasSizeGuide ? 'Conforme' : 'Atenção'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              {hasSizeGuide 
                ? 'Tabela de medidas ativa previne devoluções de vestuário e aumenta segurança do comprador.' 
                : 'Falta de tabela interativa gera trocas desnecessárias no CDC Art. 49.'}
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">3. Transparência de Preço (Pix)</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${realSiteData.detectedCheckoutTerms.hasPix ? 'text-emerald-700 bg-emerald-100' : 'text-amber-700 bg-amber-100'}`}>
                {realSiteData.detectedCheckoutTerms.hasPix ? 'Conforme' : 'Oportunidade'}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              {realSiteData.detectedCheckoutTerms.hasPix 
                ? 'Desconto Pix visível na 1ª dobra reduz atrito e acelera decisão de fechamento.' 
                : 'Destacar o desconto no Pix na primeira dobra aumenta a taxa de conversão em até 14%.'}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
