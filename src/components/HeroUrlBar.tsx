import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Globe, Sparkles, Factory, Boxes, Tag, Bot, Info, X, Shirt, Flame, Sprout, SlidersHorizontal } from 'lucide-react';
import gsap from 'gsap';
import { AuditInput, StoreOperationMode } from '../types';
import { getWhiteLabelConfig, WhiteLabelConfig } from '../services/whiteLabelService';
import { extractCleanDomainAndBrand } from '../services/siteInspector';
import { GSAPMagneticButton } from './ui/GSAPMagneticButton';
import { useTranslation } from '../i18n/useTranslation';

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
  const [_whiteLabel] = useState<WhiteLabelConfig>(getWhiteLabelConfig());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { t, uiLocale, marketProfile } = useTranslation();

  const presets: CompanyPreset[] = [
    {
      id: 'minimal-club',
      name: 'Minimal Club',
      url: 'https://www.minimalclub.com.br',
      niche: 'Moda Masculina & Básicos Tech',
      aov: 280,
      instagram: 'minimalclub',
      icon: Shirt,
      accentColor: 'text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100',
      badgeBg: 'bg-emerald-600',
      operationMode: 'PHYSICAL_WAREHOUSE_STOCK'
    },
    {
      id: 'sallve',
      name: 'Sallve',
      url: 'https://www.sallve.com.br',
      niche: 'Cosméticos & Skincare',
      aov: 165,
      instagram: 'sallve',
      icon: Sparkles,
      accentColor: 'text-cyan-700 border-cyan-300 bg-cyan-50 hover:bg-cyan-100',
      badgeBg: 'bg-cyan-600',
      operationMode: 'PHYSICAL_WAREHOUSE_STOCK'
    },
    {
      id: 'insider-store',
      name: 'Insider Store',
      url: 'https://www.insiderstore.com.br',
      niche: 'Vestuário Tecnológico & Performance',
      aov: 310,
      instagram: 'insiderstore',
      icon: Flame,
      accentColor: 'text-orange-700 border-orange-300 bg-orange-50 hover:bg-orange-100',
      badgeBg: 'bg-orange-600',
      operationMode: 'PHYSICAL_WAREHOUSE_STOCK'
    },
    {
      id: 'brk-agro',
      name: 'BRK Agro',
      url: 'https://www.brkagro.com.br',
      niche: 'Agropecuária, Proteção Solar & Campo',
      aov: 260,
      instagram: 'brkagro',
      icon: Sprout,
      accentColor: 'text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100',
      badgeBg: 'bg-emerald-600',
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
      targetRegion: marketProfile.countryName,
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
      targetRegion: marketProfile.countryName,
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
          <span>{t.hero.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FFFCE1] tracking-tight leading-tight">
          {t.hero.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#BBBAA6] max-w-2xl mx-auto leading-relaxed">
          {t.hero.subtitle}
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
            placeholder={t.hero.inputPlaceholder}
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-2 py-3 bg-transparent text-sm font-semibold text-[#FFFCE1] placeholder-slate-500 outline-none w-full font-mono tracking-tight"
          />

          {urlInput && !isAnalyzing && (
            <button
              type="button"
              onClick={() => setUrlInput('')}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors mr-1 cursor-pointer shrink-0"
              title="Clear URL"
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
            {isAnalyzing ? t.hero.inspecting : t.hero.ctaButton}
          </GSAPMagneticButton>
        </div>

        {/* Toggle to show operation mode selector */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 mx-auto px-3 py-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
        >
          <Factory className="w-3 h-3" />
          <span>{showAdvanced ? t.hero.hideCalibration : t.hero.calibrateType}</span>
        </button>

        {/* 🏭 Seletor de Modelo Operacional da Loja (Calibração Anti-Falso-Positivo) */}
        {showAdvanced && (
        <>
        <div className="p-3 bg-[#101211] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px] uppercase tracking-wider font-mono">
            <Factory className="w-3.5 h-3.5 text-[#0AE448]" />
            <span>{t.hero.operationalModel}:</span>
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
            >
              <Bot className="w-3 h-3" />
              <span>{t.hero.autoDetect}</span>
            </button>

            <button
              type="button"
              onClick={() => setOperationMode('OWN_MANUFACTURING_ON_DEMAND')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                operationMode === 'OWN_MANUFACTURING_ON_DEMAND'
                  ? 'bg-[#0AE448]/20 text-[#0AE448] border-[#0AE448]/50 shadow-sm'
                  : 'bg-[#191C1B] text-slate-400 hover:text-white border-white/5 hover:border-white/20'
              }`}
            >
              <Factory className="w-3 h-3" />
              <span>{t.hero.ownManufacturing}</span>
            </button>

            <button
              type="button"
              onClick={() => setOperationMode('PHYSICAL_WAREHOUSE_STOCK')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                operationMode === 'PHYSICAL_WAREHOUSE_STOCK'
                  ? 'bg-[#FF8709]/20 text-[#FF8709] border-[#FF8709]/50 shadow-sm'
                  : 'bg-[#191C1B] text-slate-400 hover:text-white border-white/5 hover:border-white/20'
              }`}
            >
              <Boxes className="w-3 h-3" />
              <span>{t.hero.physicalWarehouse}</span>
            </button>

            <button
              type="button"
              onClick={() => setOperationMode('RESALE_MULTIBRAND')}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                operationMode === 'RESALE_MULTIBRAND'
                  ? 'bg-[#F100CB]/20 text-[#F100CB] border-[#F100CB]/50 shadow-sm'
                  : 'bg-[#191C1B] text-slate-400 hover:text-white border-white/5 hover:border-white/20'
              }`}
            >
              <Tag className="w-3 h-3" />
              <span>{t.hero.resaleMultibrand}</span>
            </button>
          </div>
        </div>

        {/* Informative calibration hint */}
        {operationMode === 'OWN_MANUFACTURING_ON_DEMAND' && (
          <div className="px-3.5 py-2 bg-[#0AE448]/10 border border-[#0AE448]/30 rounded-xl text-[11px] text-[#0AE448] flex items-center gap-2 animate-fadeIn font-medium">
            <Info className="w-4 h-4 text-[#0AE448] shrink-0" />
            <span>
              <strong>{t.hero.ownManufacturing}:</strong>{' '}
              {uiLocale === 'pt-BR'
                ? 'Foco em SLA de produção, Tabela de Medidas e SEO (isento de falso-positivo de estoque físico).'
                : uiLocale === 'de-DE'
                ? 'Fokus auf Produktions-SLA, Größentabelle & SEO.'
                : uiLocale === 'fr-FR'
                ? 'Focus sur SLA de production, Guide des Tailles & SEO.'
                : uiLocale === 'es-ES'
                ? 'Foco en SLA de producción, Guía de Tallas y SEO.'
                : 'SLA, Size Chart & SEO.'}
            </span>
          </div>
        )}
        {operationMode === 'PHYSICAL_WAREHOUSE_STOCK' && (
          <div className="px-3.5 py-2 bg-[#FF8709]/10 border border-[#FF8709]/30 rounded-xl text-[11px] text-[#FF8709] flex items-center gap-2 animate-fadeIn font-medium">
            <Info className="w-4 h-4 text-[#FF8709] shrink-0" />
            <span>
              <strong>{t.hero.physicalWarehouse}:</strong>{' '}
              {uiLocale === 'pt-BR'
                ? 'Auditoria rigorosa da grade central (P/M/G) e proteção contra estoque fantasma no Meta Ads.'
                : uiLocale === 'de-DE'
                ? 'Kerngrößen-Prüfung (S/M/L/XL) & Meta Ads Schutz vor Geisterbestand.'
                : uiLocale === 'fr-FR'
                ? 'Audit des tailles centrales (S/M/L/XL) & protection stock fantôme Meta Ads.'
                : uiLocale === 'es-ES'
                ? 'Auditoría de tallas centrales (S/M/L/XL) y protección contra stock fantasma en Meta Ads.'
                : 'Core size grid & Meta Ads ghost inventory protection.'}
            </span>
          </div>
        )}
        {operationMode === 'RESALE_MULTIBRAND' && (
          <div className="px-3.5 py-2 bg-[#F100CB]/10 border border-[#F100CB]/30 rounded-xl text-[11px] text-[#F100CB] flex items-center gap-2 animate-fadeIn font-medium">
            <Info className="w-4 h-4 text-[#F100CB] shrink-0" />
            <span>
              <strong>{t.hero.resaleMultibrand}:</strong>{' '}
              {uiLocale === 'pt-BR'
                ? 'Foco em margem comercial, Buy Box e isenção inteligente para acessórios de tamanho único.'
                : uiLocale === 'de-DE'
                ? 'Handelsmarge, Buy Box & Einheitsgrößen-Zubehör.'
                : uiLocale === 'fr-FR'
                ? 'Marge commerciale, Buy Box & accessoires taille unique.'
                : uiLocale === 'es-ES'
                ? 'Margen comercial, Buy Box y accesorios de talla única.'
                : 'Margin, Buy Box & single-size accessories.'}
            </span>
          </div>
        )}
        </>
        )}

        {/* Sleek Preset Chips & Advanced Controls Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-slate-500 uppercase font-semibold">{t.hero.shortcuts}:</span>
            {presets.map((preset) => {
              const PresetIcon = preset.icon;
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
                  title={`Instant audit: ${preset.name}`}
                >
                  <PresetIcon className="w-3 h-3 text-[#0AE448]" />
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
            <SlidersHorizontal className="w-2.5 h-2.5" />
            <span>{showAdvanced ? t.hero.hideParams : t.hero.nicheParams}</span>
          </button>
        </div>

        {/* Progressive Disclosure: Advanced Parameters */}
        {showAdvanced && (
          <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300 animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-400">{t.hero.nicheLabel}:</span>
              <input
                type="text"
                placeholder="Auto"
                value={nicheInput}
                onChange={(e) => setNicheInput(e.target.value)}
                className="px-2.5 py-1.5 bg-[#191C1B] border border-white/10 rounded-lg text-[#FFFCE1] font-semibold outline-none text-xs w-44 placeholder-slate-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-400">{t.hero.aovLabel}</span>
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
                placeholder="@brand"
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

