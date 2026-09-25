import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ShieldCheck, Globe, Sparkles, Zap, Factory, Boxes, Tag, Bot, Info, X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFish, faWheatAwn, faFire, faGlobe, faArrowRight as faArrowRightSolid, faSliders } from '@fortawesome/free-solid-svg-icons';
import gsap from 'gsap';
import { AuditInput, StoreOperationMode } from '../types';
import { getWhiteLabelConfig, WhiteLabelConfig } from '../services/whiteLabelService';
import { extractCleanDomainAndBrand } from '../services/siteInspector';
import { GSAPMagneticButton } from './ui/GSAPMagneticButton';

interface HeroUrlBarProps {
  onAnalyze: (input: AuditInput) => void;
  isAnalyzing: boolean;
  currentUrl?: string;
}

interface CompanyPreset {
  id: string;
  name: string;
  url: string;
  niche: string;
  aov: number;
  instagram: string;
  icon: any;
  accentColor: string;
  badgeBg: string;
  operationMode?: StoreOperationMode;
}

export const HeroUrlBar: React.FC<HeroUrlBarProps> = ({ onAnalyze, isAnalyzing, currentUrl }) => {
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [nicheInput, setNicheInput] = useState('');
  const [aovInput, setAovInput] = useState(180);
  const [instagramInput, setInstagramInput] = useState('');
  const [operationMode, setOperationMode] = useState<StoreOperationMode>('AUTO_DETECT');
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(getWhiteLabelConfig());
  const [showAdvanced, setShowAdvanced] = useState(false);

  const presets: CompanyPreset[] = [
    {
      id: 'brk-fishing',
      name: 'BRK Fishing',
      url: 'https://www.brkfishing.com.br',
      niche: 'Pesca Esportiva, Vestuário & Aventura',
      aov: 220,
      instagram: 'brkfishing',
      icon: faFish,
      accentColor: 'text-cyan-700 border-cyan-300 bg-cyan-50 hover:bg-cyan-100',
      badgeBg: 'bg-cyan-600',
      operationMode: 'OWN_MANUFACTURING_ON_DEMAND'
    },
    {
      id: 'brk-agro',
      name: 'BRK Agro',
      url: 'https://www.brkagro.com.br',
      niche: 'Agropecuária, Proteção Solar & Campo',
      aov: 260,
      instagram: 'brkagro',
      icon: faWheatAwn,
      accentColor: 'text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100',
      badgeBg: 'bg-emerald-600',
      operationMode: 'OWN_MANUFACTURING_ON_DEMAND'
    },
    {
      id: 'brk-motors',
      name: 'BRK Motors',
      url: 'https://www.brkmotors.com.br',
      niche: 'Motociclismo, Off-Road & Automotivo',
      aov: 240,
      instagram: 'brkmotors',
      icon: faFire,
      accentColor: 'text-orange-700 border-orange-300 bg-orange-50 hover:bg-orange-100',
      badgeBg: 'bg-orange-600',
      operationMode: 'OWN_MANUFACTURING_ON_DEMAND'
    }
  ];

  useEffect(() => {
    if (currentUrl) {
      setUrlInput(currentUrl);
    }
  }, [currentUrl]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-hero-item', {
        y: 16,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSelectPreset = (preset: CompanyPreset) => {
    setUrlInput(preset.url);
    setNicheInput(preset.niche);
    setAovInput(preset.aov);
    setInstagramInput(preset.instagram);
    const mode = preset.operationMode || 'AUTO_DETECT';
    setOperationMode(mode);

    const domainName = preset.url.replace(/^https?:\/\//, '').split('.')[0].toUpperCase();

    onAnalyze({
      siteUrl: preset.url,
      businessName: domainName,
      businessType: 'ecommerce',
      niche: preset.niche,
      monthlyRevenue: 'R$ 50k a R$ 200k',
      averageOrderValue: preset.aov,
      mainChallenge: 'low_conversion',
      instagramHandle: preset.instagram,
      targetRegion: 'Brasil',
      grossMargin: 45,
      competitorsUrl: 'https://concorrente.com.br',
      operationMode: mode
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    let clean = urlInput.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }

    const extraction = extractCleanDomainAndBrand(clean);
    const domainName = extraction.brandName || clean.replace(/^https?:\/\//, '').split('.')[0].toUpperCase();

    onAnalyze({
      siteUrl: clean,
      businessName: domainName,
      businessType: extraction.isMarketplaceSeller ? 'ecommerce' : 'ecommerce',
      niche: nicheInput || (extraction.isMarketplaceSeller ? 'Vendas em Marketplace (Shopee/Meli)' : ''),
      monthlyRevenue: 'R$ 50k a R$ 200k',
      averageOrderValue: Number(aovInput) || 180,
      mainChallenge: 'low_conversion',
      instagramHandle: instagramInput.trim(),
      targetRegion: 'Brasil',
      grossMargin: 45,
      competitorsUrl: 'https://concorrente.com.br',
      operationMode
    });
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-[#141716] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-[#F0EFE6]">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -mt-16 w-96 h-32 bg-[#0AE448]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-16 w-96 h-32 bg-[#00BAE2]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="gsap-hero-item max-w-3xl mx-auto text-center space-y-3 relative z-10">
        <div 
          className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#0AE448]/30 bg-[#0AE448]/10 text-[#0AE448] rounded-full text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#0AE448]" />
          <span>ADSHIELD NEURAL SCANNER • 18 AGENTES 24/7</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FFFCE1] tracking-tight leading-tight">
          Auditoria Autônoma de Conversão & Rupturas no Meta Ads
        </h1>
        <p className="text-xs sm:text-sm text-[#BBBAA6] max-w-2xl mx-auto leading-relaxed">
          Inspecione instantaneamente o catálogo público da sua loja ou de qualquer concorrente. Nossos agentes cruzam estoque real, criativos ativos e checkout para estancar desperdício de verba.
        </p>
      </div>

      {/* Main Command Input Box */}
      <form onSubmit={handleSubmit} className="gsap-hero-item max-w-2xl mx-auto space-y-3 relative z-10">
        <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-[#101211] border border-white/15 focus-within:border-[#0AE448] focus-within:ring-2 focus-within:ring-[#0AE448]/20 rounded-2xl transition-all duration-200">
          <div className="flex items-center gap-2 px-3 text-slate-400 w-full sm:w-auto">
            <Globe className="w-5 h-5 text-[#0AE448] shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-500 hidden sm:inline">https://</span>
          </div>

          <input
            type="text"
            required
            placeholder="cole o link da loja (ex: brkagro.com.br ou concorrente)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-2 py-3 bg-transparent text-sm font-semibold text-[#FFFCE1] placeholder-slate-500 outline-none w-full font-mono tracking-tight"
          />

          {urlInput && !isAnalyzing && (
            <button
              type="button"
              onClick={() => setUrlInput('')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors mr-1 cursor-pointer shrink-0"
              title="Limpar link da loja para digitar outro"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <GSAPMagneticButton
            type="submit"
            disabled={isAnalyzing || !urlInput.trim()}
            variant="primary"
            className="w-full sm:w-auto text-xs sm:text-sm px-6 py-3 cursor-pointer shrink-0"
            icon={<ArrowRight className="w-4 h-4 ml-1" />}
          >
            {isAnalyzing ? 'Inspecionando...' : 'Auditar Loja'}
          </GSAPMagneticButton>
        </div>

        {/* 🏭 Seletor de Modelo Operacional da Loja (Calibração Anti-Falso-Positivo) */}
        <div className="p-3 bg-[#101211] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px] uppercase tracking-wider font-mono">
            <Factory className="w-3.5 h-3.5 text-[#0AE448]" />
            <span>Modelo Operacional:</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setOperationMode('AUTO_DETECT')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                operationMode === 'AUTO_DETECT'
                  ? 'bg-[#00BAE2]/20 text-[#00BAE2] border-[#00BAE2]/50 shadow-sm'
                  : 'bg-[#191C1B] text-slate-400 hover:text-white border-white/5 hover:border-white/20'
              }`}
              title="A inteligência artificial detecta automaticamente as regras de catálogo da loja"
            >
              <Bot className="w-3 h-3" />
              <span>Auto-Detect</span>
            </button>

            <button
              type="button"
              onClick={() => setOperationMode('OWN_MANUFACTURING_ON_DEMAND')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                operationMode === 'OWN_MANUFACTURING_ON_DEMAND'
                  ? 'bg-[#0AE448]/20 text-[#0AE448] border-[#0AE448]/50 shadow-sm'
                  : 'bg-[#191C1B] text-slate-400 hover:text-white border-white/5 hover:border-white/20'
              }`}
              title="Fabricação própria / Sublimação sob demanda. Isenta falsas rupturas de grade física de vestuário."
            >
              <Factory className="w-3 h-3" />
              <span>Fabricação Própria (Sob Demanda)</span>
            </button>

            <button
              type="button"
              onClick={() => setOperationMode('PHYSICAL_WAREHOUSE_STOCK')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                operationMode === 'PHYSICAL_WAREHOUSE_STOCK'
                  ? 'bg-[#FF8709]/20 text-[#FF8709] border-[#FF8709]/50 shadow-sm'
                  : 'bg-[#191C1B] text-slate-400 hover:text-white border-white/5 hover:border-white/20'
              }`}
              title="Estoque físico tradicional em depósito. Audita furos de grade PP ao G2 e tráfego para itens zerados."
            >
              <Boxes className="w-3 h-3" />
              <span>Estoque Físico (Galpão)</span>
            </button>

            <button
              type="button"
              onClick={() => setOperationMode('RESALE_MULTIBRAND')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                operationMode === 'RESALE_MULTIBRAND'
                  ? 'bg-[#F100CB]/20 text-[#F100CB] border-[#F100CB]/50 shadow-sm'
                  : 'bg-[#191C1B] text-slate-400 hover:text-white border-white/5 hover:border-white/20'
              }`}
              title="Revenda multimarcas, importação e acessórios de tamanho único. Foco em margem e fornecedor."
            >
              <Tag className="w-3 h-3" />
              <span>Revenda / Multimarcas</span>
            </button>
          </div>
        </div>

        {/* Informative calibration hint */}
        {operationMode === 'OWN_MANUFACTURING_ON_DEMAND' && (
          <div className="px-3.5 py-2 bg-[#0AE448]/10 border border-[#0AE448]/30 rounded-xl text-[11px] text-[#0AE448] flex items-center gap-2 animate-fadeIn font-medium">
            <Info className="w-4 h-4 text-[#0AE448] shrink-0" />
            <span><strong>Modo Fabricação Própria Ativo:</strong> O motor isentará alertas falsos de ruptura de tamanho físico, priorizando SLA de produção, Tabela de Medidas e Títulos (SEO).</span>
          </div>
        )}
        {operationMode === 'PHYSICAL_WAREHOUSE_STOCK' && (
          <div className="px-3.5 py-2 bg-[#FF8709]/10 border border-[#FF8709]/30 rounded-xl text-[11px] text-[#FF8709] flex items-center gap-2 animate-fadeIn font-medium">
            <Info className="w-4 h-4 text-[#FF8709] shrink-0" />
            <span><strong>Modo Estoque Físico Ativo:</strong> O motor auditará furos de grade nos tamanhos mais vendidos (PP ao G2) e risco de estoque fantasma no Meta Ads.</span>
          </div>
        )}
        {operationMode === 'RESALE_MULTIBRAND' && (
          <div className="px-3.5 py-2 bg-[#F100CB]/10 border border-[#F100CB]/30 rounded-xl text-[11px] text-[#F100CB] flex items-center gap-2 animate-fadeIn font-medium">
            <Info className="w-4 h-4 text-[#F100CB] shrink-0" />
            <span><strong>Modo Revenda Ativo:</strong> O motor focará em margem, competitividade de Buy Box e produtos de tamanho único.</span>
          </div>
        )}

        {/* Sleek Preset Chips & Advanced Controls Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">Atalhos:</span>
            {presets.map((preset) => {
              const isCurrent = urlInput.includes(preset.url.replace('https://', ''));

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  disabled={isAnalyzing}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-white/15 text-[#FFFCE1] border-white/40 shadow-sm'
                      : 'bg-[#191C1B] text-slate-400 hover:text-[#FFFCE1] border-white/10 hover:border-white/20'
                  }`}
                  title={`Auditoria instantânea de ${preset.name}`}
                >
                  <FontAwesomeIcon icon={preset.icon} className="w-3 h-3 text-[#0AE448]" />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] font-semibold text-[#0AE448] hover:text-[#09c93f] transition-colors cursor-pointer flex items-center gap-1 font-mono"
          >
            <FontAwesomeIcon icon={faSliders} className="w-2.5 h-2.5" />
            <span>{showAdvanced ? 'Ocultar parâmetros' : 'Parâmetros de nicho'}</span>
          </button>
        </div>

        {/* Progressive Disclosure: Advanced Parameters */}
        {showAdvanced && (
          <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-400">Nicho:</span>
              <input
                type="text"
                placeholder="Auto (IA detecta)"
                value={nicheInput}
                onChange={(e) => setNicheInput(e.target.value)}
                className="px-2.5 py-1.5 bg-[#191C1B] border border-white/10 rounded-lg text-[#FFFCE1] font-semibold outline-none text-xs w-44 placeholder-slate-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-400">Ticket Médio (R$):</span>
              <input
                type="number"
                value={aovInput}
                onChange={(e) => setAovInput(Number(e.target.value))}
                className="px-2.5 py-1.5 bg-[#191C1B] border border-white/10 rounded-lg text-[#FFFCE1] font-semibold font-mono outline-none text-xs w-24"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-400">Instagram:</span>
              <input
                type="text"
                placeholder="@marca"
                value={instagramInput}
                onChange={(e) => setInstagramInput(e.target.value)}
                className="px-2.5 py-1.5 bg-[#191C1B] border border-white/10 rounded-lg text-[#FFFCE1] font-semibold outline-none text-xs w-32 placeholder-slate-500"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
