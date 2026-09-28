import React, { useState } from 'react';
import { Eye, Smartphone, Palette, ShieldCheck, AlertTriangle, CheckCircle2, Flame, Copy, Check, Sparkles, Sliders } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface ComputerVisionInspectionViewProps {
  diagnostic: AgentDiagnosticResult;
}

type VisionTab = 'heatmap' | 'thumbzone' | 'contrast' | 'trustbadges';
type DaltonismMode = 'NORMAL' | 'PROTANOPIA' | 'DEUTERANOPIA' | 'TRITANOPIA' | 'ACHROMATOPSIA';

export const ComputerVisionInspectionView: React.FC<ComputerVisionInspectionViewProps> = ({ diagnostic }) => {
  const { visionAnalysis, realSiteData } = diagnostic;
  const [activeSubTab, setActiveSubTab] = useState<VisionTab>('heatmap');
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(2500);
  const [daltonismMode, setDaltonismMode] = useState<DaltonismMode>('NORMAL');
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2500);
  };

  const currentTimelineStage = visionAnalysis.saliencyTimeline?.find(s => s.timeMs === currentTimeMs) || 
    visionAnalysis.saliencyTimeline?.[visionAnalysis.saliencyTimeline.length - 1] || {
      timeMs: 2500,
      stageName: '2.500ms: Decisão de Clique no CTA',
      fixationTarget: 'Botão de Compra Primário',
      cognitiveAction: 'Movimento motor do polegar em direção ao botão de compra ou abandono',
      attentionCtaPct: 78,
      attentionHeroPct: 8,
      attentionPricePct: 10,
      dropoffRiskPct: 34
    };

  const getIntensityGradient = (heatColor: string) => {
    const scaleFactor = currentTimeMs / 2500;
    switch (heatColor) {
      case 'red':
        return `radial-gradient(circle, rgba(239, 68, 68, ${0.85 * scaleFactor}) 0%, rgba(249, 115, 22, ${0.55 * scaleFactor}) 45%, rgba(234, 179, 8, ${0.25 * scaleFactor}) 75%, transparent 100%)`;
      case 'orange':
        return `radial-gradient(circle, rgba(249, 115, 22, ${0.8 * scaleFactor}) 0%, rgba(234, 179, 8, ${0.5 * scaleFactor}) 50%, transparent 100%)`;
      case 'yellow':
        return `radial-gradient(circle, rgba(234, 179, 8, ${0.75 * scaleFactor}) 0%, rgba(59, 130, 246, ${0.3 * scaleFactor}) 60%, transparent 100%)`;
      default:
        return `radial-gradient(circle, rgba(59, 130, 246, ${0.7 * scaleFactor}) 0%, rgba(99, 102, 241, ${0.2 * scaleFactor}) 60%, transparent 100%)`;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-mono rounded-lg border border-amber-500/20 mb-4">
        <AlertTriangle className="w-3.5 h-3.5" />
        <span>[Simulação Heurística — Sem Visão Computacional Real]</span>
      </div>
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md">
            <Eye className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-[#FFFCE1]">Agente 11 — Engenheiro de Visão Computacional</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#0AE448]/10 text-[#0AE448] rounded-full border border-[#0AE448]/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#0AE448]" /> Saliência Ocular & WCAG 2.1 AAA
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 font-medium">
              Simulação de eye-tracking (2.500ms), Ergonomia Mobile (Thumb Zone), Matriz de Contraste e Selos em <span className="font-mono text-[#FFFCE1] font-bold">{realSiteData.domain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-[#141716] rounded-2xl border border-white/10 text-center">
            <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-bold">Foco no CTA</p>
            <p className={`text-xl font-black font-mono ${visionAnalysis.eyeTracking.focusScoreCta >= 70 ? 'text-[#0AE448]' : 'text-amber-400'}`}>
              {visionAnalysis.eyeTracking.focusScoreCta}%
            </p>
          </div>

          <div className="px-4 py-2 bg-[#141716] rounded-2xl border border-white/10 text-center">
            <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-bold">Clutter Score</p>
            <p className={`text-xl font-black font-mono ${visionAnalysis.visualClutterMetrics.densityScore <= 45 ? 'text-[#0AE448]' : 'text-rose-400'}`}>
              {visionAnalysis.visualClutterMetrics.densityScore}/100
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Selector */}
      <div className="flex items-center gap-2 p-1.5 bg-[#101211] rounded-2xl border border-white/10 overflow-x-auto shadow-xl">
        <button
          onClick={() => setActiveSubTab('heatmap')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'heatmap' ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20' : 'text-[#BBBAA6] hover:text-white hover:bg-white/5'
          }`}
        >
          <Flame className="w-4 h-4 text-orange-400" />
          <span>Eye-Tracking & Saliência Preditiva [MIT Model]</span>
        </button>

        <button
          onClick={() => setActiveSubTab('thumbzone')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'thumbzone' ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20' : 'text-[#BBBAA6] hover:text-white hover:bg-white/5'
          }`}
        >
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span>Ergonomia Mobile (Thumb Zone)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contrast')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'contrast' ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20' : 'text-[#BBBAA6] hover:text-white hover:bg-white/5'
          }`}
        >
          <Palette className="w-4 h-4 text-purple-400" />
          <span>Contraste WCAG & Acessibilidade</span>
        </button>

        <button
          onClick={() => setActiveSubTab('trustbadges')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'trustbadges' ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20' : 'text-[#BBBAA6] hover:text-white hover:bg-white/5'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#00BAE2]" />
          <span>Selos de Confiança & OCR</span>
        </button>
      </div>

      {/* 1. EYE-TRACKING & HEATMAP VIEW */}
      {activeSubTab === 'heatmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulated Browser with Heatmap Overlay */}
          <div className="lg:col-span-8 bg-[#101211] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            
            {/* 🛡️ TRANSPARENCY & GROUNDING BADGE */}
            <div className="p-3 bg-[#141716] rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20">
                  Modelo Preditivo MIT
                </span>
                <span className="text-[#BBBAA6] font-medium">
                  Simulação matemática de saliência ocular baseada na hierarquia do DOM público.
                </span>
              </div>
              <span className="text-[10px] text-[#BBBAA6] shrink-0 font-mono">
                Mapas de cliques reais requerem integração Clarity/GA4
              </span>
            </div>
            
            {/* ⏱️ 2,500ms INTERACTIVE SALIENCY TIMELINE SCRUBBER */}
            <div className="p-4 bg-[#141716] text-[#FFFCE1] rounded-2xl border border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Timeline de Fixação Biológica Ocular (0 a 2.500ms):</span>
                </span>
                <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-lg text-xs font-mono font-bold">
                  Fixação Atual: {currentTimeMs}ms
                </span>
              </div>

              {/* Scrubber Stage Buttons */}
              <div className="grid grid-cols-4 gap-1.5 bg-[#0E100F] p-1 rounded-xl border border-white/5">
                {[
                  { ms: 0, label: '0ms: Carga' },
                  { ms: 500, label: '500ms: Hero' },
                  { ms: 1200, label: '1.200ms: Grade' },
                  { ms: 2500, label: '2.500ms: CTA' }
                ].map(stage => (
                  <button
                    key={stage.ms}
                    onClick={() => setCurrentTimeMs(stage.ms)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer text-center ${
                      currentTimeMs === stage.ms
                        ? 'bg-[#0AE448] text-slate-950 shadow-md font-black'
                        : 'text-[#BBBAA6] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {stage.label}
                  </button>
                ))}
              </div>

              {/* Cognitive State Breakdown Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono border-t border-white/10">
                <div className="text-[#BBBAA6]">
                  <span className="text-[9px] uppercase block">Alvo de Fixação:</span>
                  <strong className="text-[#FFFCE1]">{currentTimelineStage.fixationTarget}</strong>
                </div>
                <div className="text-[#BBBAA6]">
                  <span className="text-[9px] uppercase block">Ação Cognitiva:</span>
                  <span className="text-[#FFFCE1]">{currentTimelineStage.cognitiveAction}</span>
                </div>
                <div className="text-[#BBBAA6]">
                  <span className="text-[9px] uppercase block">Atenção no CTA:</span>
                  <strong className="text-[#0AE448]">{currentTimelineStage.attentionCtaPct}%</strong> • Fuga: <span className="text-rose-400">{currentTimelineStage.dropoffRiskPct}%</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-[#0AE448]" />
                <span className="text-xs font-mono text-[#BBBAA6] ml-2">https://{realSiteData.domain}</span>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#BBBAA6] bg-[#141716] px-2.5 py-1 rounded-md border border-white/5">
                Simulação em {currentTimeMs}ms
              </span>
            </div>

            {/* Visual Canvas Mockup */}
            <div className="relative w-full h-[420px] bg-[#0E100F] rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between p-6 select-none">
              {/* Simulated Website UI Layer */}
              <div className="space-y-4 opacity-25 pointer-events-none">
                <div className="flex items-center justify-between">
                  <div className="w-24 h-6 bg-slate-700 rounded" />
                  <div className="flex gap-3">
                    <div className="w-12 h-4 bg-slate-800 rounded" />
                    <div className="w-12 h-4 bg-slate-800 rounded" />
                    <div className="w-8 h-8 bg-slate-800 rounded-full" />
                  </div>
                </div>
                <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 text-xs font-mono">
                  [HERO BANNER DA LOJA]
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-20 bg-slate-800 rounded" />
                  <div className="h-20 bg-slate-800 rounded flex flex-col justify-center items-center gap-2">
                    <div className="w-20 h-4 bg-slate-700 rounded" />
                    <div className="w-28 h-7 bg-emerald-600 rounded" />
                  </div>
                </div>
              </div>

              {/* Heatmap Pulsing Saliency Spots */}
              {visionAnalysis.heatmapPoints.map((point) => (
                <div
                  key={point.id}
                  className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all animate-pulse"
                  style={{
                    left: `${point.xPercent}%`,
                    top: `${point.yPercent}%`,
                    width: `${point.radius * 2}px`,
                    height: `${point.radius * 2}px`,
                    background: getIntensityGradient(point.heatColor),
                    zIndex: Math.round(point.intensity * 10)
                  }}
                />
              ))}

              {/* Heatmap Marker Pin Labels */}
              <div className="absolute inset-0 p-4 pointer-events-none">
                {visionAnalysis.heatmapPoints.map((point) => (
                  <div
                    key={`label-${point.id}`}
                    className="absolute flex items-center gap-1.5 px-2.5 py-1 bg-[#101211]/90 backdrop-blur-md text-[#FFFCE1] text-[10px] font-bold rounded-lg border border-white/20 shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${point.xPercent}%`,
                      top: `${point.yPercent}%`
                    }}
                  >
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span>{point.label}</span>
                    <span className="text-orange-400 font-mono">({Math.round(point.intensity * 100)}%)</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#BBBAA6] pt-2 font-mono flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Zona Quente</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> Zona Média</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#00BAE2] inline-block" /> Zona Fria</span>
              </div>
              <span className="font-bold text-[#0AE448]">Taxa de Eficiência Visual: {visionAnalysis.eyeTracking.focusScoreCta}%</span>
            </div>
          </div>

          {/* Saliency & Distraction Diagnostics */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#101211] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
              <h3 className="text-sm font-black text-[#FFFCE1] uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#0AE448]" /> Diagnóstico de Atenção
              </h3>

              <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-2">
                <span className="text-[11px] text-[#BBBAA6] font-mono font-semibold uppercase">Principal Ímã Visual Detectado</span>
                <p className="text-base font-bold text-[#FFFCE1] flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-400" />
                  {visionAnalysis.eyeTracking.mainFocusElement}
                </p>
                <p className="text-xs text-[#BBBAA6] leading-relaxed">
                  {visionAnalysis.eyeTracking.mainFocusElement.toLowerCase().includes('botão') || visionAnalysis.eyeTracking.mainFocusElement.toLowerCase().includes('comprar')
                    ? '✅ O fluxo ocular dos primeiros 2.500ms converge diretamente para o botão de conversão e compra sem dispersão.'
                    : `👁️ A atenção visual inicial foca na proposta de valor de "${visionAnalysis.eyeTracking.mainFocusElement}", elemento dominante acima da dobra.`}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#BBBAA6]">Clareza da Hierarquia</span>
                  <span className="text-[#0AE448] bg-[#0AE448]/10 px-2.5 py-0.5 rounded-full border border-[#0AE448]/20 font-mono">
                    {visionAnalysis.visualClutterMetrics.visualHierarchyRating}
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#BBBAA6]">Espaço em Branco (Respiro)</span>
                  <span className="font-mono text-[#FFFCE1]">{visionAnalysis.visualClutterMetrics.whiteSpaceRatio}%</span>
                </div>

                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#BBBAA6]">Retenção Above The Fold</span>
                  <span className="font-mono text-[#0AE448]">{visionAnalysis.visualClutterMetrics.aboveTheFoldRetentionScore}%</span>
                </div>
              </div>
            </div>

            {/* Quick Recommendation */}
            <div className="p-5 bg-[#141716] border border-white/10 rounded-3xl space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#00BAE2] uppercase">Ação Recomendada de CRO Visual</span>
              <p className="text-xs text-[#BBBAA6] leading-relaxed">
                Diminua o contraste de elementos secundários (como banners promocionais piscantes) e isole o botão de compra com pelo menos 16px de margem limpa ao redor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. MOBILE ERGONOMICS (THUMB ZONE) VIEW */}
      {activeSubTab === 'thumbzone' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-[#101211] p-6 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center justify-center">
            <h3 className="text-sm font-black text-[#FFFCE1] mb-4">Simulação Ergonômica Mobile (Lei de Fitts)</h3>
            
            {/* Mobile Device Frame Mockup */}
            <div className="relative w-64 h-[440px] bg-[#0E100F] rounded-[36px] p-3 border-4 border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-between">
              {/* Camera Notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />

              {/* Thumb Zone Visual Layer Overlays */}
              <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/10 bg-[#101211] flex flex-col justify-between p-3 select-none">
                
                {/* Hard Zone (Top) */}
                <div className="h-28 bg-rose-500/20 border-b border-rose-500/30 rounded-t-lg p-2 text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold font-mono text-rose-300 uppercase tracking-wider">Zona Difícil (55% Esforço)</span>
                  <span className="text-[9px] text-rose-400 font-mono">Exige uso das duas mãos</span>
                </div>

                {/* Stretch Zone (Middle) */}
                <div className="h-28 bg-amber-500/15 border-y border-amber-500/30 p-2 text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold font-mono text-amber-300 uppercase tracking-wider">Zona de Extensão</span>
                  <span className="text-[9px] text-amber-400 font-mono">Alcance moderado do polegar</span>
                </div>

                {/* Natural Thumb Zone (Bottom) */}
                <div className="h-32 bg-[#0AE448]/20 border-t border-[#0AE448]/40 rounded-b-lg p-2 text-center flex flex-col justify-center relative">
                  <span className="text-[10px] font-bold font-mono text-[#0AE448] uppercase tracking-wider">Zona Natural (Polegar)</span>
                  <span className="text-[9px] text-[#BBBAA6] font-mono">Área de 80% dos cliques rápidos</span>

                  {/* Simulated CTA Button in Easy Zone */}
                  <div className="mt-2 w-full py-2 bg-[#0AE448] text-slate-950 font-black text-[10px] rounded-lg shadow-lg animate-pulse flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> [COMPRAR AGORA (STICKY)]
                  </div>
                </div>

              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-2" />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#101211] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
              <h3 className="text-sm font-black text-[#FFFCE1] uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#0AE448]" /> Resultados de Acessibilidade Mobile
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl">
                  <span className="text-[10px] text-[#0AE448] font-mono font-bold uppercase">Zona de Conforto</span>
                  <p className="text-2xl font-black font-mono text-[#0AE448]">{visionAnalysis.thumbZone.easyZoneCoverage}%</p>
                </div>
                <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl">
                  <span className="text-[10px] text-[#BBBAA6] font-mono font-bold uppercase">Score Lei de Fitts</span>
                  <p className="text-2xl font-black font-mono text-[#00BAE2]">{visionAnalysis.thumbZone.fittsLawScore}/100</p>
                </div>
              </div>

              <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-1">
                <span className="text-xs font-bold text-[#FFFCE1]">Posição do Botão Primário:</span>
                <p className="text-sm text-[#BBBAA6] font-medium">{visionAnalysis.thumbZone.recommendation}</p>
              </div>

              {visionAnalysis.mobileGeometry.hasFatFingerIssues && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200">
                    <p className="font-bold">Alerta Fat-Finger (Área de Toque Pequena):</p>
                    <p className="mt-0.5 text-[#BBBAA6]">Detectamos botões com menos de 48x48px no mobile. Isso gera cliques errados e abandono de carrinho.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky CTA Code Solution */}
            <div className="p-5 bg-[#101211] border border-white/10 rounded-3xl space-y-3 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#FFFCE1]">Código CSS: Barra de Compra Fixa (Sticky CTA)</span>
                <button
                  onClick={() => handleCopyCode('css-sticky', '/* Sticky CTA Mobile */\n@media (max-width: 768px) {\n  .btn-comprar-mobile {\n    position: fixed;\n    bottom: 12px;\n    left: 12px;\n    right: 12px;\n    z-index: 9999;\n    padding: 16px;\n    border-radius: 12px;\n    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);\n  }\n}')}
                  className="px-3 py-1.5 text-[11px] font-black bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-[#0AE448]/20"
                >
                  {copiedSnippetId === 'css-sticky' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSnippetId === 'css-sticky' ? 'Copiado!' : 'Copiar CSS'}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#0E100F] text-[#0AE448] rounded-2xl text-[11px] font-mono overflow-x-auto border border-white/5 leading-relaxed">
{`/* Sticky CTA Mobile para Shopify / Nuvemshop */
.btn-comprar-mobile {
  position: fixed;
  bottom: 12px;
  left: 12px;
  right: 12px;
  z-index: 9999;
  padding: 16px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.3);
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* 3. WCAG CONTRAST & COLOR ACCESSIBILITY VIEW */}
      {activeSubTab === 'contrast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-[#101211] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-6">
            <h3 className="text-sm font-black text-[#FFFCE1] uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-purple-400" /> Matriz de Contraste Cromático WCAG 2.1
            </h3>

            {/* Contrast Meter */}
            <div className="p-5 bg-[#141716] border border-white/10 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <span className="text-xs text-[#BBBAA6] font-mono font-semibold uppercase">Taxa de Luminância Medida</span>
                <p className="text-3xl font-black font-mono text-[#FFFCE1] mt-1">
                  {visionAnalysis.contrastAudit.contrastRatio}:1
                </p>
                <p className="text-xs text-[#BBBAA6] mt-1">Padrão WCAG AA requer no mínimo 4.5:1</p>
              </div>

              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border ${
                  visionAnalysis.contrastAudit.wcagAaPassed 
                    ? 'bg-[#0AE448]/10 text-[#0AE448] border-[#0AE448]/30' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {visionAnalysis.contrastAudit.wcagAaPassed ? '✅ Aprovado (WCAG AA)' : '❌ Reprovado (WCAG AA)'}
                </div>

                <div className={`px-4 py-2 rounded-xl text-xs font-mono font-bold border ${
                  visionAnalysis.contrastAudit.wcagAaaPassed 
                    ? 'bg-[#0AE448]/10 text-[#0AE448] border-[#0AE448]/30' 
                    : 'bg-white/5 text-[#BBBAA6] border-white/10'
                }`}>
                  {visionAnalysis.contrastAudit.wcagAaaPassed ? '⭐ Excelente (AAA)' : 'Normal (AAA 7:1)'}
                </div>
              </div>
            </div>

            {/* Live Button Simulation */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-[#FFFCE1]">Visualização do Botão Atual vs Recomendado:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-white/10 bg-[#141716] text-center space-y-3">
                  <span className="text-[11px] font-mono font-bold text-[#BBBAA6] uppercase">Design Atual</span>
                  <div 
                    className="py-3 px-6 rounded-xl font-bold text-sm shadow-sm"
                    style={{ 
                      backgroundColor: visionAnalysis.contrastAudit.ctaBgColor, 
                      color: visionAnalysis.contrastAudit.ctaTextColor 
                    }}
                  >
                    COMPRAR AGORA ({visionAnalysis.contrastAudit.contrastRatio}:1)
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-[#0AE448]/30 bg-[#141716] text-center space-y-3">
                  <span className="text-[11px] font-mono font-bold text-[#0AE448] uppercase">Sugestão Alta Conversão</span>
                  <div 
                    className="py-3 px-6 rounded-xl font-bold text-sm shadow-md"
                    style={{ 
                      backgroundColor: visionAnalysis.contrastAudit.suggestedColors.bg, 
                      color: visionAnalysis.contrastAudit.suggestedColors.text 
                    }}
                  >
                    COMPRAR AGORA ({visionAnalysis.contrastAudit.suggestedColors.ratio}:1)
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Daltonism Filter Selector */}
            <div className="p-4 bg-[#141716] text-[#FFFCE1] border border-white/10 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-purple-300">
                  Simulador Interativo de Daltonismo (Acessibilidade Visual):
                </span>
                <span className="text-[10px] font-mono text-[#BBBAA6] bg-[#0E100F] px-2 py-0.5 rounded border border-white/5">
                  Modo: {daltonismMode}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-[#0E100F] p-1 rounded-xl text-[10px] font-mono font-bold border border-white/5">
                {(['NORMAL', 'PROTANOPIA', 'DEUTERANOPIA', 'TRITANOPIA', 'ACHROMATOPSIA'] as DaltonismMode[]).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setDaltonismMode(mode)}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center ${
                      daltonismMode === mode
                        ? 'bg-purple-500 text-white shadow-md font-black'
                        : 'text-[#BBBAA6] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {mode === 'NORMAL' ? 'Normal' : mode === 'PROTANOPIA' ? 'Protanopia' : mode === 'DEUTERANOPIA' ? 'Deuteranopia' : mode === 'TRITANOPIA' ? 'Tritanopia' : 'Acromatopsia'}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-[#0E100F] rounded-xl border border-white/5 flex items-center justify-center">
                <div
                  className="py-2.5 px-6 rounded-xl font-bold text-xs text-white transition-all shadow-md"
                  style={{
                    backgroundColor: visionAnalysis.contrastAudit.ctaBgColor,
                    filter: daltonismMode === 'PROTANOPIA' ? 'grayscale(40%) sepia(30%) hue-rotate(180deg)' :
                            daltonismMode === 'DEUTERANOPIA' ? 'grayscale(40%) sepia(30%) hue-rotate(240deg)' :
                            daltonismMode === 'TRITANOPIA' ? 'grayscale(30%) sepia(40%) hue-rotate(60deg)' :
                            daltonismMode === 'ACHROMATOPSIA' ? 'grayscale(100%)' : 'none'
                  }}
                >
                  COMPRAR AGORA ({daltonismMode})
                </div>
              </div>
            </div>

            {/* Color Blindness Quick Checklist */}
            <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-[#FFFCE1]">Checklist de Conformidade Daltonismo:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span className="flex items-center gap-1.5 text-[#0AE448]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" /> Protanopia (Vermelho): Seguro
                </span>
                <span className="flex items-center gap-1.5 text-[#0AE448]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" /> Deuteranopia (Verde): Seguro
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#101211] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
              <h3 className="text-sm font-black text-[#FFFCE1] uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" /> Paleta & Recomendações
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-[#141716] border border-white/10 rounded-2xl text-xs font-medium">
                  <span className="text-[#BBBAA6]">Cor Primária</span>
                  <span className="font-mono font-bold text-[#FFFCE1]">{visionAnalysis.uiux.primaryColor}</span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-[#141716] border border-white/10 rounded-2xl text-xs font-medium">
                  <span className="text-[#BBBAA6]">Cor Secundária (Acento)</span>
                  <span className="font-mono font-bold text-[#0AE448]">{visionAnalysis.uiux.secondaryColor}</span>
                </div>

                <p className="text-xs text-[#BBBAA6] leading-relaxed pt-2">
                  {visionAnalysis.contrastAudit.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TRUST BADGES & OCR VIEW */}
      {activeSubTab === 'trustbadges' && (
        <div className="space-y-4">
          <div className="bg-[#101211] p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-black text-[#FFFCE1]">Auditoria de Selos Visuais & Gatilhos de Confiança</h3>
                <p className="text-xs text-[#BBBAA6] font-medium">Itens fundamentais para reduzir a taxa de rejeição no primeiro contato</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visionAnalysis.trustBadges.map((badge) => (
                <div key={badge.id} className="p-5 bg-[#141716] border border-white/10 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${badge.detected ? 'bg-[#0AE448]' : 'bg-rose-500'}`} />
                      <h4 className="text-sm font-bold text-[#FFFCE1]">{badge.name}</h4>
                    </div>
                    <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-lg border ${
                      badge.detected ? 'bg-[#0AE448]/10 text-[#0AE448] border-[#0AE448]/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {badge.detected ? 'Detectado' : 'Ausente no HTML'}
                    </span>
                  </div>

                  <p className="text-xs text-[#BBBAA6]">Local esperado: <span className="text-[#FFFCE1] font-semibold">{badge.location}</span></p>

                  {!badge.detected && (
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-[11px] text-rose-400 font-semibold">Impacto: {badge.impactOnTrust}</span>
                      <button
                        onClick={() => handleCopyCode(badge.id, badge.visualFixSnippet)}
                        className="px-3 py-1.5 text-[11px] font-black bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-[#0AE448]/20"
                      >
                        {copiedSnippetId === badge.id ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSnippetId === badge.id ? 'Copiado!' : 'Copiar Selo HTML'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Warnings & Alerts List */}
      {visionAnalysis.warnings.length > 0 && (
        <div className="p-5 bg-[#141716] border border-amber-500/30 rounded-3xl space-y-3">
          <h4 className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Alertas da Visão Computacional ({visionAnalysis.warnings.length})
          </h4>
          <ul className="space-y-1.5 text-xs text-[#BBBAA6] font-medium">
            {visionAnalysis.warnings.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
