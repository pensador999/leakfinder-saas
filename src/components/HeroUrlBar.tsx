import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { AuditInput } from '../types';
import { getWhiteLabelConfig, WhiteLabelConfig } from '../services/whiteLabelService';

interface HeroUrlBarProps {
  onAnalyze: (input: AuditInput) => void;
  isAnalyzing: boolean;
  currentUrl?: string;
}

export const HeroUrlBar: React.FC<HeroUrlBarProps> = ({ onAnalyze, isAnalyzing, currentUrl }) => {
  const [urlInput, setUrlInput] = useState(currentUrl || '');
  const [nicheInput, setNicheInput] = useState('E-commerce / Vendas');
  const [aovInput, setAovInput] = useState(180);
  const [instagramInput, setInstagramInput] = useState('');
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(getWhiteLabelConfig());

  useEffect(() => {
    const handleUpdate = () => setWhiteLabel(getWhiteLabelConfig());
    window.addEventListener('whitelabel-updated', handleUpdate);
    return () => window.removeEventListener('whitelabel-updated', handleUpdate);
  }, []);

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
    <div className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm">
      <div className="max-w-3xl mx-auto text-center space-y-3 mb-6">
        <div 
          className="inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-bold uppercase tracking-wider"
          style={{ color: whiteLabel.primaryColor, backgroundColor: `${whiteLabel.primaryColor}15`, borderColor: `${whiteLabel.primaryColor}30` }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Motor de Inteligência & Inspeção de URL {whiteLabel.agencyName}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cole o Link do seu Site para Receber o Diagnóstico Real de Vendas
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Nossa inteligência inspeciona o código HTML, velocidade, metadados e usabilidade do seu site em tempo real para gerar o plano de ação de 6 agentes.
        </p>
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
            placeholder="cole o link do seu site aqui (ex: minhaloja.com.br)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-2 py-3 bg-transparent text-sm font-semibold text-slate-900 placeholder-slate-400 outline-none w-full font-mono"
          />

          <button
            type="submit"
            disabled={isAnalyzing || !urlInput.trim()}
            className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>{isAnalyzing ? 'Inspecionando...' : 'Analisar Site Agora'}</span>
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
              className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none text-xs w-36"
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
            <span>@ Insta (opc):</span>
            <input
              type="text"
              placeholder="@loja"
              value={instagramInput}
              onChange={(e) => setInstagramInput(e.target.value)}
              className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-lg text-slate-800 font-semibold outline-none text-xs w-28"
            />
          </div>

          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Leitura segura e sem login
          </div>
        </div>
      </form>
    </div>
  );
};
