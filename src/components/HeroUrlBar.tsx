import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ShieldCheck, Globe, Sparkles, Fish, Wheat, Flame, Zap } from 'lucide-react';
import gsap from 'gsap';
import { AuditInput } from '../types';
import { getWhiteLabelConfig, WhiteLabelConfig } from '../services/whiteLabelService';

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
}

export const HeroUrlBar: React.FC<HeroUrlBarProps> = ({ onAnalyze, isAnalyzing, currentUrl }) => {
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [nicheInput, setNicheInput] = useState('');
  const [aovInput, setAovInput] = useState(180);
  const [instagramInput, setInstagramInput] = useState('');
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
      icon: Fish,
      accentColor: 'text-cyan-700 border-cyan-300 bg-cyan-50 hover:bg-cyan-100',
      badgeBg: 'bg-cyan-600'
    },
    {
      id: 'brk-agro',
      name: 'BRK Agro',
      url: 'https://www.brkagro.com.br',
      niche: 'Agropecuária, Proteção Solar & Campo',
      aov: 260,
      instagram: 'brkagro',
      icon: Wheat,
      accentColor: 'text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100',
      badgeBg: 'bg-emerald-600'
    },
    {
      id: 'brk-motors',
      name: 'BRK Motors',
      url: 'https://www.brkmotors.com.br',
      niche: 'Motociclismo, Off-Road & Automotivo',
      aov: 240,
      instagram: 'brkmotors',
      icon: Flame,
      accentColor: 'text-orange-700 border-orange-300 bg-orange-50 hover:bg-orange-100',
      badgeBg: 'bg-orange-600'
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
      competitorsUrl: 'https://concorrente.com.br'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    let clean = urlInput.trim();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = `https://${clean}`;
    }

    const domainName = clean.replace(/^https?:\/\//, '').split('.')[0].toUpperCase();

    onAnalyze({
      siteUrl: clean,
      businessName: domainName,
      businessType: 'ecommerce',
      niche: nicheInput,
      monthlyRevenue: 'R$ 50k a R$ 200k',
      averageOrderValue: Number(aovInput) || 180,
      mainChallenge: 'low_conversion',
      instagramHandle: instagramInput.trim(),
      targetRegion: 'Brasil',
      grossMargin: 45,
      competitorsUrl: 'https://concorrente.com.br'
    });
  };

  return (
    <div ref={containerRef} className="relative overflow-hidden bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-premium space-y-6">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 -mt-16 w-96 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 -mb-16 w-96 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="gsap-hero-item max-w-3xl mx-auto text-center space-y-3 relative z-10">
        <div 
          className="inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-[11px] font-mono font-bold uppercase tracking-wider shadow-2xs"
          style={{ color: whiteLabel.primaryColor, backgroundColor: `${whiteLabel.primaryColor}10`, borderColor: `${whiteLabel.primaryColor}25` }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ADSHIELD NEURAL SCANNER • 18 AGENTES 24/7</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Auditoria Autônoma de Conversão & Rupturas no Meta Ads
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Inspecione instantaneamente o catálogo público da sua loja ou de qualquer concorrente. Nossos agentes cruzam estoque real, criativos ativos e checkout para estancar desperdício de verba.
        </p>
      </div>

      {/* Main Command Input Box */}
      <form onSubmit={handleSubmit} className="gsap-hero-item max-w-2xl mx-auto space-y-3 relative z-10">
        <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-50/90 border border-slate-300/80 focus-within:border-blue-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-600/10 rounded-2xl transition-all duration-200 shadow-inner">
          <div className="flex items-center gap-2 px-3 text-slate-400 w-full sm:w-auto">
            <Globe className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-400 hidden sm:inline">https://</span>
          </div>

          <input
            type="text"
            required
            placeholder="cole o link da loja (ex: brkagro.com.br ou concorrente)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-2 py-3 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none w-full font-mono tracking-tight"
          />

          <button
            type="submit"
            disabled={isAnalyzing || !urlInput.trim()}
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-blue-600/25 hover:shadow-blue-600/35 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>{isAnalyzing ? 'Inspecionando...' : 'Auditar Loja'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Sleek Preset Chips & Advanced Controls Trigger */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Atalhos:</span>
            {presets.map((preset) => {
              const Icon = preset.icon;
              const isCurrent = urlInput.includes(preset.url.replace('https://', ''));

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  disabled={isAnalyzing}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200 hover:border-slate-300'
                  }`}
                  title={`Auditoria instantânea de ${preset.name}`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
          >
            {showAdvanced ? '− Ocultar parâmetros' : '+ Parâmetros de nicho'}
          </button>
        </div>

        {/* Progressive Disclosure: Advanced Parameters */}
        {showAdvanced && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 animate-fadeIn">
            <div className="flex items-center gap-1.5">
              <span className="font-medium">Nicho:</span>
              <input
                type="text"
                placeholder="Auto (IA detecta)"
                value={nicheInput}
                onChange={(e) => setNicheInput(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none text-xs w-44 placeholder-slate-400"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-medium">Ticket Médio (R$):</span>
              <input
                type="number"
                value={aovInput}
                onChange={(e) => setAovInput(Number(e.target.value))}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold font-mono outline-none text-xs w-20"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="font-medium">Instagram:</span>
              <input
                type="text"
                placeholder="@marca"
                value={instagramInput}
                onChange={(e) => setInstagramInput(e.target.value)}
                className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none text-xs w-28"
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
