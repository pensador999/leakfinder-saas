import React, { useState } from 'react';
import { 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Wrench, 
  Footprints, 
  Shirt, 
  Armchair, 
  Smartphone, 
  HeartPulse, 
  Tractor, 
  Gem, 
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Compass,
  Check,
  Fish
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { 
  classifyUniversalNiche, 
  UniversalNicheCategory, 
  UNIVERSAL_NICHE_PROFILES, 
  NicheAdaptationProfile 
} from '../../services/agents/universalNicheRecognitionAgent';

interface UniversalNicheRecognitionViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const UniversalNicheRecognitionView: React.FC<UniversalNicheRecognitionViewProps> = ({ diagnostic }) => {
  const { realSiteData } = diagnostic;

  const initialClassification = classifyUniversalNiche(realSiteData);
  const [selectedNiche, setSelectedNiche] = useState<UniversalNicheCategory>(initialClassification.detectedNiche);

  const activeProfile = UNIVERSAL_NICHE_PROFILES[selectedNiche];

  const renderIcon = (nicheId: UniversalNicheCategory) => {
    switch (nicheId) {
      case 'MODA_VESTUARIO': return <Shirt className="w-5 h-5" />;
      case 'CALCADOS_CALCADISTA': return <Footprints className="w-5 h-5" />;
      case 'AUTOPECAS_FERRAMENTAS': return <Wrench className="w-5 h-5" />;
      case 'BELEZA_COSMETICOS': return <Sparkles className="w-5 h-5" />;
      case 'CASA_MOVEIS_DECORACAO': return <Armchair className="w-5 h-5" />;
      case 'ELETRONICOS_INFORMATICA': return <Smartphone className="w-5 h-5" />;
      case 'SUPLEMENTOS_FARMACIA': return <HeartPulse className="w-5 h-5" />;
      case 'AGROPECUARIA_PET': return <Tractor className="w-5 h-5" />;
      case 'PESCA_CAMPING_OUTDOOR': return <Fish className="w-5 h-5" />;
      case 'JOIAS_ACESSORIOS': return <Gem className="w-5 h-5" />;
      default: return <ShoppingBag className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl text-[#0AE448] shadow-md border border-[#0AE448]/30">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#FFFCE1]">Agente de Reconhecimento Universal de Nicho & Estrutura</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20">
                Taxonomia Universal de E-Commerce
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              O AdShield não se limita a vestuário: este agente lê a estrutura de **qualquer e-commerce** (autopeças, eletrônicos, cosméticos, móveis, agro) e adapta as regras de auditoria em tempo real!
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Nicho Detectado pela IA</span>
          <span className="text-sm font-black text-[#0AE448] font-mono block">
            {initialClassification.nicheProfile.nicheLabel}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono font-bold">
            {initialClassification.confidenceScore}% de Confiança
          </span>
        </div>
      </div>

      {/* Dynamic Rule Adaptation Statement */}
      <div className="p-5 rounded-3xl bg-[#141716] text-white space-y-2 border border-white/10 shadow-xl">
        <div className="flex items-center gap-2 text-[#0AE448] font-bold text-xs font-mono">
          <Sparkles className="w-4 h-4" />
          <span>CALIBRAÇÃO ADAPTATIVA DE REGRAS DO ENXAME:</span>
        </div>
        <p className="text-[#BBBAA6] text-xs leading-relaxed font-sans">
          {activeProfile.description} O motor substitui regras rígidas de vestuário pelas variáveis críticas deste nicho, garantindo **Zero Falsos-Positivos**.
        </p>
      </div>

      {/* 10 Universal Niches Selector Grid */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-[#BBBAA6] block uppercase font-mono tracking-wider">
          Selecione ou Alterne entre os Nichos Universais:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {Object.values(UNIVERSAL_NICHE_PROFILES).map((niche) => {
            const isSelected = selectedNiche === niche.nicheId;
            const isAutoDetected = initialClassification.detectedNiche === niche.nicheId;

            return (
              <button
                key={niche.nicheId}
                onClick={() => setSelectedNiche(niche.nicheId)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-[#0AE448] text-slate-950 font-black border-[#0AE448] shadow-md shadow-[#0AE448]/20'
                    : 'bg-[#101211] text-[#BBBAA6] border-white/10 hover:border-white/20 hover:bg-[#141716] hover:text-[#FFFCE1]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-white/5 text-[#FFFCE1]'}`}>
                    {renderIcon(niche.nicheId)}
                  </div>
                  {isAutoDetected && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-mono font-black ${
                      isSelected ? 'bg-slate-950 text-[#0AE448]' : 'bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30'
                    }`}>
                      AUTO
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-xs leading-tight">{niche.nicheLabel}</h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Niche Deep Dive Profile */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded-2xl">
              {renderIcon(activeProfile.nicheId)}
            </div>
            <div>
              <h3 className="font-bold text-[#FFFCE1] text-base">{activeProfile.nicheLabel}</h3>
              <p className="text-xs text-[#BBBAA6] font-mono">Exemplos de marcas: {activeProfile.sampleBrands.join(', ')}</p>
            </div>
          </div>

          <span className="px-3 py-1 bg-white/5 text-[#FFFCE1] border border-white/10 rounded-full font-bold text-xs font-mono">
            {activeProfile.recommendedCallToAction}
          </span>
        </div>

        {/* 3 Columns Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Col 1: Variantes Críticas */}
          <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">
              Variantes & Grades em Foco
            </span>
            <div className="space-y-1.5">
              {activeProfile.primaryVariantTypes.map((v, idx) => (
                <div key={idx} className="flex items-center gap-1.5 font-bold text-[#FFFCE1]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448] shrink-0" />
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: Widget Obrigatório */}
          <div className="p-4 rounded-2xl bg-[#141716] border border-[#0AE448]/20 text-[#FFFCE1] space-y-2">
            <span className="text-[10px] uppercase font-bold text-[#0AE448] font-mono block">
              Widget Obrigatório no Tema
            </span>
            <p className="font-black text-sm text-[#0AE448] leading-tight">
              {activeProfile.mandatoryAddonWidget}
            </p>
            <p className="text-[11px] text-[#BBBAA6] font-medium">
              Essencial para reduzir dúvidas no WhatsApp e taxa de devolução.
            </p>
          </div>

          {/* Col 3: Pontos de Fuga do Nicho */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-rose-300 font-mono block">
              Gargalos Críticos de Perda de Venda
            </span>
            <div className="space-y-1">
              {activeProfile.criticalLeakPoints.map((leak, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-rose-200 leading-tight">
                  <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0 mt-0.5" />
                  <span>{leak}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
