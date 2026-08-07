import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Download, Zap, TrendingUp, Layers, CheckCircle2, Search, Settings, Users, Star } from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { getWhiteLabelConfig, WhiteLabelConfig } from '../services/whiteLabelService';

interface HeaderProps {
  diagnostic: AgentDiagnosticResult | null;
  onOpenAuditModal: () => void;
  onExportReport: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onOpenPricing: () => void;
}

export const Header: React.FC<HeaderProps> = ({ diagnostic, onOpenAuditModal, onExportReport, onOpenSettings, onOpenAdmin, onOpenPricing }) => {
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(getWhiteLabelConfig());

  useEffect(() => {
    const handleUpdate = () => setWhiteLabel(getWhiteLabelConfig());
    window.addEventListener('whitelabel-updated', handleUpdate);
    return () => window.removeEventListener('whitelabel-updated', handleUpdate);
  }, []);

  const score = diagnostic?.growthScore || 0;
  const scoreBadgeColor = score >= 75 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 
                          score >= 55 ? 'text-blue-700 bg-blue-50 border-blue-200' : 
                          'text-amber-700 bg-amber-50 border-amber-200';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 lg:px-8 py-3.5 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Active Domain */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {whiteLabel.logoUrl ? (
              <img src={whiteLabel.logoUrl} alt={whiteLabel.agencyName} className="h-10 object-contain rounded-xl" />
            ) : (
              <div 
                className="flex items-center justify-center w-10 h-10 rounded-xl text-white shadow-md"
                style={{ backgroundColor: whiteLabel.primaryColor, boxShadow: `0 4px 14px 0 ${whiteLabel.primaryColor}33` }}
              >
                <Layers className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-mono uppercase">
                  {whiteLabel.agencyName}
                </span>
                <span 
                  className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase border rounded-md"
                  style={{ color: whiteLabel.primaryColor, backgroundColor: `${whiteLabel.primaryColor}15`, borderColor: `${whiteLabel.primaryColor}30` }}
                >
                  AUTONOMOUS GROWTH OS
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: whiteLabel.primaryColor }} />
                <span>Sistema de Inteligência de Receita & Análise de Sites</span>
              </p>
            </div>
          </div>

          {/* Mobile Score */}
          {diagnostic && (
            <div className={`md:hidden px-3 py-1 rounded-lg border font-mono font-bold text-xs flex items-center gap-1.5 ${scoreBadgeColor}`}>
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{score}/100</span>
            </div>
          )}
        </div>

        {/* Center Active Domain Info */}
        {diagnostic && (
          <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Site Analisado:</span>
              <span className="font-bold text-slate-900 font-mono flex items-center gap-1">
                <Search className="w-3 h-3 text-blue-600" />
                {diagnostic.input.siteUrl.replace(/^https?:\/\//, '')}
              </span>
            </div>
            <div className="h-3.5 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Status da Leitura:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Inspecionado
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          <button
            onClick={onOpenPricing}
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-amber-200 bg-amber-50 text-amber-700 font-bold text-xs hover:bg-amber-100 transition-colors shadow-xs mr-2"
          >
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            Fazer Upgrade
          </button>

          {diagnostic && (
            <div className={`hidden md:flex px-3.5 py-1.5 rounded-xl border font-bold text-xs items-center gap-1.5 shadow-xs ${scoreBadgeColor}`}>
              <TrendingUp className="w-4 h-4" />
              <span>LeakFinder Score: {score}/100</span>
            </div>
          )}

          <button
            onClick={onOpenAuditModal}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/20 active:scale-[0.98] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{diagnostic ? 'Analisar Outro Site' : 'Cole o Link do Site'}</span>
          </button>

          {diagnostic && (
            <button
              onClick={onExportReport}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all hover:text-slate-900 cursor-pointer shadow-xs"
              title="Exportar Relatório Estratégico Completo"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Exportar Relatório</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            className="flex items-center justify-center p-2.5 text-slate-500 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all hover:text-blue-600 cursor-pointer shadow-xs"
            title="CRM (Painel de Leads)"
          >
            <Users className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center p-2.5 text-slate-500 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all hover:text-slate-900 cursor-pointer shadow-xs"
            title="Configurações do Motor Neural"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
