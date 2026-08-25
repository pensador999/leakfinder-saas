import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Globe, Sparkles, Fish, Wheat, Flame, Zap } from 'lucide-react';
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
  const [nicheInput, setNicheInput] = useState('E-commerce / Vendas');
  const [aovInput, setAovInput] = useState(180);
  const [instagramInput, setInstagramInput] = useState('');
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(getWhiteLabelConfig());

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

  useEffect(() => {
    const handleUpdate = () => setWhiteLabel(getWhiteLabelConfig());
    window.addEventListener('whitelabel-updated', handleUpdate);
    return () => window.removeEventListener('whitelabel-updated', handleUpdate);
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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6">
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div 
          className="inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider"
          style={{ color: whiteLabel.primaryColor, backgroundColor: `${whiteLabel.primaryColor}15`, borderColor: `${whiteLabel.primaryColor}30` }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Motor de Inteligência & Auditoria BRK Group</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Diagnóstico Profundo de Vendas, CRO & Visão Computacional
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Inspecione qualquer uma das lojas BRK com 1 clique ou digite uma nova URL para rodar a auditoria de 6 agentes com Deep Scraping.
        </p>
      </div>

      {/* 🚀 QUICK PRESET SHORTCUT BUTTONS (BRK FISHING, AGRO, MOTORS) */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Lojas BRK (Auditoria Instantânea em 1 Clique):
          </span>
          <span className="text-[11px] text-slate-400 font-medium">Selecione para inspecionar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presets.map((preset) => {
            const Icon = preset.icon;
            const isCurrent = urlInput.includes(preset.url.replace('https://', ''));

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isAnalyzing}
                className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between gap-3 cursor-pointer shadow-xs ${preset.accentColor} ${
                  isCurrent ? 'ring-2 ring-blue-600 font-bold shadow-md' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl text-white ${preset.badgeBg} shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{preset.name}</h4>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5 truncate max-w-[120px]">
                      {preset.url.replace('https://www.', '')}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Single Link Input Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-slate-50 border border-slate-300 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 rounded-2xl transition-all shadow-inner">
          <div className="flex items-center gap-2 px-3 text-slate-400 w-full sm:w-auto">
            <Globe className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="text-xs font-mono font-bold text-slate-500 hidden md:inline">https://</span>
          </div>

          <input
            type="text"
            required
            placeholder="cole qualquer link aqui (ex: brkfishing.com.br ou concorrente)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-2 py-3 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none w-full font-mono"
          />

          <button
            type="submit"
            disabled={isAnalyzing || !urlInput.trim()}
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>{isAnalyzing ? 'Inspecionando...' : 'Auditar Site'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Parameters */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <span>Segmento:</span>
            <input
              type="text"
              value={nicheInput}
              onChange={(e) => setNicheInput(e.target.value)}
              className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none text-xs w-48"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span>Ticket Médio (R$):</span>
            <input
              type="number"
              value={aovInput}
              onChange={(e) => setAovInput(Number(e.target.value))}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-semibold font-mono outline-none text-xs w-20"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span>@ Insta:</span>
            <input
              type="text"
              placeholder="@loja"
              value={instagramInput}
              onChange={(e) => setInstagramInput(e.target.value)}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none text-xs w-28"
            />
          </div>

          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Leitura segura e livre
          </div>
        </div>
      </form>
    </div>
  );
};
