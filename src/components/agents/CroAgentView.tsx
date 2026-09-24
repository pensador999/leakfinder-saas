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

  const thumbZone = diagnostic.visionAnalysis?.thumbZone;
  const isThumbZoneEasy = thumbZone ? thumbZone.ctaZoneLocation === 'EASY' : true;
  const thumbZoneText = thumbZone
    ? (thumbZone.ctaZoneLocation === 'EASY'
        ? 'Zona Natural de Alcance'
        : thumbZone.ctaZoneLocation === 'STRETCH'
        ? 'Zona de Estiramento'
        : 'Fora da Área do Polegar')
    : 'Área Central Acessível';

  return (
    <div className="space-y-6 font-sans">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-[#FFFCE1]">Agente 10 — Arquiteto de CRO & Usabilidade</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#00BAE2]/10 text-[#00BAE2] rounded-full border border-[#00BAE2]/20">
                10 Heurísticas de Nielsen & UX Mobile
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 font-medium">
              Auditoria de fricção de compra, Thumb Zone móvel e checkout em <span className="font-mono text-[#FFFCE1] font-bold">{realSiteData.domain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-5 py-3 bg-[#141716] rounded-2xl border border-white/10">
          <div className="text-center">
            <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-bold">Score CRO</p>
            <p className="text-xl font-black font-mono text-[#00BAE2]">{cro.score}/100</p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-bold">Velocidade Mobile</p>
            <p className="text-xl font-black font-mono text-[#0AE448]">{(cro.mobileSpeedMs / 1000).toFixed(1)}s</p>
          </div>
        </div>
      </div>

      {/* Real Inspection Metrics Row (4 Pillars) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 flex items-center gap-3 shadow-xl">
          <div className="p-2.5 bg-[#141716] text-[#00BAE2] rounded-xl border border-[#00BAE2]/20">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#BBBAA6] font-medium block">Tabela de Medidas (Widget):</span>
            <p className={`text-xs font-bold font-mono ${hasSizeGuide ? 'text-[#0AE448]' : 'text-amber-400'}`}>
              {hasSizeGuide ? 'Widget / Tabela Ativa' : 'Ausente (Risco de Troca)'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 flex items-center gap-3 shadow-xl">
          <div className="p-2.5 bg-[#141716] text-[#0AE448] rounded-xl border border-[#0AE448]/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#BBBAA6] font-medium block">Thumb Zone (Polegar):</span>
            <p className={`text-xs font-bold font-mono ${isThumbZoneEasy ? 'text-[#0AE448]' : 'text-amber-400'}`}>
              {thumbZoneText}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 flex items-center gap-3 shadow-xl">
          <div className="p-2.5 bg-[#141716] text-[#00BAE2] rounded-xl border border-[#00BAE2]/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#BBBAA6] font-medium block">Pix / Checkout no HTML:</span>
            <p className={`text-xs font-bold font-mono ${realSiteData.detectedCheckoutTerms.hasPix ? 'text-[#0AE448]' : 'text-amber-400'}`}>
              {realSiteData.detectedCheckoutTerms.hasPix ? 'Pix Nativo Detectado' : 'Sem aviso Pix na 1ª dobra'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 flex items-center gap-3 shadow-xl">
          <div className="p-2.5 bg-[#141716] text-rose-400 rounded-xl border border-rose-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#BBBAA6] font-medium block">Integridade da Grade:</span>
            <p className={`text-xs font-bold font-mono ${brokenCentralGridCount > 0 ? 'text-rose-400' : 'text-[#0AE448]'}`}>
              {brokenCentralGridCount > 0 ? `${brokenCentralGridCount} produtos com ruptura` : '100% dos SKUs Íntegros'}
            </p>
          </div>
        </div>

      </div>

      {/* Audit Findings List */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-[#FFFCE1] uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#0AE448]" />
          <span>Gargalos de Conversão Lidos no HTML ({cro.findings.length})</span>
        </h3>

        <div className="space-y-3">
          {cro.findings.map((finding) => (
            <div key={finding.id} className="p-5 rounded-3xl bg-[#101211] border border-white/10 space-y-3 shadow-2xl hover:border-white/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-extrabold uppercase rounded bg-[#141716] text-[#FFFCE1] border border-white/10">
                    {finding.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#FFFCE1]">{finding.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${
                    finding.impact === 'CRÍTICO' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                    finding.impact === 'ALTO' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                    'bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20'
                  }`}>
                    Impacto: {finding.impact}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#BBBAA6] leading-relaxed">
                {finding.description}
              </p>

              <div className="p-3.5 rounded-2xl bg-[#141716] border border-[#0AE448]/30 text-xs">
                <span className="font-bold text-[#0AE448] flex items-center gap-1.5 mb-1 font-mono">
                  <Zap className="w-3.5 h-3.5 text-[#0AE448]" /> Recomendação LeakFinder:
                </span>
                <p className="text-[#FFFCE1] leading-relaxed">{finding.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Wins Box */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-4">
        <h3 className="text-sm font-black text-[#FFFCE1] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0AE448]" />
          <span>Checklist de Ação Imediata LeakFinder (Implementação em menos de 1 hora)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {cro.quickWins.map((win, idx) => (
            <div key={idx} className="p-3.5 bg-[#141716] rounded-2xl border border-white/10 text-xs text-[#BBBAA6] flex items-start gap-2.5 font-medium">
              <span className="w-5 h-5 rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 font-mono text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                ✓
              </span>
              <span className="text-[#FFFCE1]">{win}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nielsen Usability Heuristics Evaluation Box */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-black text-[#FFFCE1] flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00BAE2]" />
            <span>Auditoria Heurística de Nielsen (NN/g) & Fricção de Conversão</span>
          </h3>
          <span className="text-[10px] font-mono font-bold bg-[#141716] text-[#BBBAA6] px-2.5 py-1 rounded-full border border-white/10">
            Padrão E-Commerce 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FFFCE1]">1. Thumb Zone Ergonomics</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                isThumbZoneEasy ? 'text-[#0AE448] bg-[#0AE448]/10 border-[#0AE448]/30' : 'text-amber-300 bg-amber-500/10 border-amber-500/20'
              }`}>
                {isThumbZoneEasy ? 'Aprovado' : 'Atenção Mobile'}
              </span>
            </div>
            <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
              {isThumbZoneEasy
                ? 'Botão CTA Add-to-Cart na zona natural do polegar mobile (≥ 48px de altura mínima).'
                : 'Botão de compra posicionado em área que exige estiramento do polegar ou rolagem excessiva no celular.'}
            </p>
          </div>

          <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FFFCE1]">2. Prevenção de Erros (Size Chart)</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${hasSizeGuide ? 'text-[#0AE448] bg-[#0AE448]/10 border-[#0AE448]/30' : 'text-amber-300 bg-amber-500/10 border-amber-500/20'}`}>
                {hasSizeGuide ? 'Conforme' : 'Atenção'}
              </span>
            </div>
            <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
              {hasSizeGuide 
                ? 'Tabela de medidas ativa previne devoluções de vestuário e aumenta segurança do comprador.' 
                : 'Falta de tabela interativa gera trocas desnecessárias no CDC Art. 49.'}
            </p>
          </div>

          <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FFFCE1]">3. Transparência de Preço (Pix)</span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${realSiteData.detectedCheckoutTerms.hasPix ? 'text-[#0AE448] bg-[#0AE448]/10 border-[#0AE448]/30' : 'text-amber-300 bg-amber-500/10 border-amber-500/20'}`}>
                {realSiteData.detectedCheckoutTerms.hasPix ? 'Conforme' : 'Oportunidade'}
              </span>
            </div>
            <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
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
