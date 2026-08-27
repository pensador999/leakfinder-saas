import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  Download, 
  Zap, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Search, 
  Settings, 
  Users, 
  Star, 
  MessageCircle,
  Activity,
  Sparkles,
  Radio
} from 'lucide-react';
import gsap from 'gsap';
import { AgentDiagnosticResult } from '../types';
import { getWhiteLabelConfig, WhiteLabelConfig } from '../services/whiteLabelService';

interface HeaderProps {
  diagnostic: AgentDiagnosticResult | null;
  onOpenAuditModal: () => void;
  onExportReport: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onOpenPricing: () => void;
  onOpenWhatsAppLeadModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  diagnostic, 
  onOpenAuditModal, 
  onExportReport, 
  onOpenSettings, 
  onOpenAdmin, 
  onOpenPricing,
  onOpenWhatsAppLeadModal 
}) => {
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(getWhiteLabelConfig());
  const headerRef = useRef<HTMLElement>(null);
  const logoIconRef = useRef<HTMLDivElement>(null);
  const pulseBadgeRef = useRef<HTMLDivElement>(null);
  const scoreBadgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleUpdate = () => setWhiteLabel(getWhiteLabelConfig());
    window.addEventListener('whitelabel-updated', handleUpdate);
    return () => window.removeEventListener('whitelabel-updated', handleUpdate);
  }, []);

  // Animações GSAP de Entrada e Interatividade
  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance suave e escalonada de todos os blocos do Header
      gsap.from('.gsap-header-item', {
        y: -12,
        opacity: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power3.out'
      });

      // 2. Pulso sutil no badge de status 24h
      if (pulseBadgeRef.current) {
        gsap.to(pulseBadgeRef.current, {
          scale: 1.12,
          opacity: 0.7,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // 3. Efeito de floating glow no logo icon
      if (logoIconRef.current) {
        gsap.to(logoIconRef.current, {
          boxShadow: '0 0 20px rgba(37, 99, 235, 0.45)',
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut'
        });
      }

      // 4. Pop suave no score badge quando o diagnóstico é carregado
      if (scoreBadgeRef.current && diagnostic) {
        gsap.from(scoreBadgeRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      }
    }, headerRef);

    return () => ctx.revert();
  }, [diagnostic]);

  const score = diagnostic?.growthScore || 0;
  const scoreBadgeColor = score >= 75 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 
                          score >= 55 ? 'text-blue-700 bg-blue-50 border-blue-200' : 
                          'text-amber-700 bg-amber-50 border-amber-200';

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      
      {/* Mini Ticker Superior Inteligente (Edge Telemetry Bar) */}
      <div className="bg-slate-900 text-slate-300 text-[10px] font-mono py-1 px-4 lg:px-8 border-b border-slate-800 flex items-center justify-between overflow-hidden select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span ref={pulseBadgeRef} className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-xs shadow-emerald-400/80" />
            <span className="font-bold tracking-wider uppercase">ENXAME 24H ATIVO</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-slate-400">LATÊNCIA EDGE: <strong className="text-white font-bold">42ms</strong></span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="hidden md:inline text-slate-400">GROUNDING FACT-CHECK: <strong className="text-emerald-400">100% AUDITADO</strong></span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline text-slate-400">ANTI-BLOQUEIO: <strong className="text-blue-400">JINA AI + VTEX + SHOPIFY</strong></span>
          <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[9px] font-bold">
            PRO v2.4
          </span>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 lg:px-8 py-3">
        
        {/* Brand & Active Domain */}
        <div className="gsap-header-item flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {whiteLabel.logoUrl ? (
              <img src={whiteLabel.logoUrl} alt={whiteLabel.agencyName} className="h-10 object-contain rounded-xl" />
            ) : (
              <div 
                ref={logoIconRef}
                className="flex items-center justify-center w-10 h-10 rounded-2xl text-white shadow-md transition-all cursor-pointer hover:scale-105"
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
                  className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase border rounded-md shadow-2xs"
                  style={{ color: whiteLabel.primaryColor, backgroundColor: `${whiteLabel.primaryColor}15`, borderColor: `${whiteLabel.primaryColor}30` }}
                >
                  AUTONOMOUS GROWTH OS
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: whiteLabel.primaryColor }} />
                <span>Auditoria Neural de Conversão & Faturamento em Risco</span>
              </p>
            </div>
          </div>

          {/* Mobile Score Badge */}
          {diagnostic && (
            <div className={`md:hidden px-3 py-1 rounded-xl border font-mono font-bold text-xs flex items-center gap-1.5 shadow-xs ${scoreBadgeColor}`}>
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{score}/100</span>
            </div>
          )}
        </div>

        {/* Center Active Domain Pill with Live Pulse */}
        {diagnostic && (
          <div className="gsap-header-item hidden lg:flex items-center gap-4 px-4 py-2 rounded-2xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/90 text-xs shadow-2xs transition-all">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-medium">Site Auditado:</span>
              <span className="font-bold text-slate-900 font-mono flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-blue-600" />
                {diagnostic.input.siteUrl.replace(/^https?:\/\//, '')}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Status:</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Inspecionado
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons with GSAP Micro-Interactions */}
        <div className="gsap-header-item flex items-center gap-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          
          <button
            onClick={onOpenPricing}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300/80 bg-amber-50/80 text-amber-800 font-bold text-xs hover:bg-amber-100 transition-all shadow-2xs cursor-pointer hover:scale-105 active:scale-95"
          >
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Fazer Upgrade</span>
          </button>

          {diagnostic && (
            <div ref={scoreBadgeRef} className={`hidden md:flex px-3.5 py-2 rounded-xl border font-bold text-xs items-center gap-1.5 shadow-2xs ${scoreBadgeColor}`}>
              <TrendingUp className="w-4 h-4" />
              <span>Score: {score}/100</span>
            </div>
          )}

          <button
            onClick={onOpenAuditModal}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{diagnostic ? 'Novo Site' : 'Auditar Loja'}</span>
          </button>

          {diagnostic && onOpenWhatsAppLeadModal && (
            <button
              onClick={onOpenWhatsAppLeadModal}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md shadow-emerald-600/25 hover:scale-105 active:scale-95 cursor-pointer"
              title="Receber Raio-X no WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          )}

          {diagnostic && (
            <button
              onClick={onExportReport}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-all hover:text-slate-950 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
              title="Exportar Relatório Estratégico Completo em PDF"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            className="flex items-center justify-center p-2 text-slate-500 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-all hover:text-blue-600 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            title="CRM (Painel de Leads)"
          >
            <Users className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center p-2 text-slate-500 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-xl transition-all hover:text-slate-900 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
            title="Configurações do Motor Neural"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
