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
  Radio,
  ExternalLink
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShieldHalved, 
  faFish, 
  faWheatAwn, 
  faFire, 
  faBolt, 
  faSliders, 
  faArrowsRotate,
  faLayerGroup
} from '@fortawesome/free-solid-svg-icons';
import { faShopify } from '@fortawesome/free-brands-svg-icons';
import gsap from 'gsap';
import { AgentDiagnosticResult } from '../types';
import { getWhiteLabelConfig, WhiteLabelConfig } from '../services/whiteLabelService';
import { SupabaseStatusIndicator } from './common/SupabaseStatusIndicator';
import { OneClickMitigationService } from '../services/actions/oneClickMitigationService';

export interface StorePreset {
  key: string;
  name: string;
  url: string;
  brandName: string;
  niche: string;
  aov: number;
  slug?: string;
  icon: any;
  activeClass: string;
}

interface HeaderProps {
  diagnostic: AgentDiagnosticResult | null;
  onOpenAuditModal: () => void;
  onExportReport: () => void;
  onOpenSettings: () => void;
  onOpenAdmin: () => void;
  onOpenPricing: () => void;
  onOpenWhatsAppLeadModal?: () => void;
  onSelectStorePreset?: (preset: StorePreset) => void;
  onOpenMitigationHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  diagnostic, 
  onOpenAuditModal, 
  onExportReport, 
  onOpenSettings, 
  onOpenAdmin, 
  onOpenPricing,
  onOpenWhatsAppLeadModal,
  onSelectStorePreset,
  onOpenMitigationHistory
}) => {
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(getWhiteLabelConfig());
  const headerRef = useRef<HTMLElement>(null);
  const logoIconRef = useRef<HTMLDivElement>(null);
  const pulseBadgeRef = useRef<HTMLDivElement>(null);
  const scoreBadgeRef = useRef<HTMLDivElement>(null);

  const brandPresets: StorePreset[] = [
    {
      key: 'fishing',
      name: 'BRK Fishing',
      url: 'https://www.brkfishing.com.br',
      brandName: 'BRK Fishing',
      niche: 'Pesca Esportiva & Vestuário',
      aov: 220,
      icon: faFish,
      activeClass: 'bg-[#00BAE2] text-[#0E100F] shadow-sm border border-[#00BAE2] font-black'
    },
    {
      key: 'agro',
      name: 'BRK Agro',
      url: 'https://www.brkagro.com.br',
      brandName: 'BRK Agro',
      niche: 'Agropecuária & Moda Campo',
      aov: 260,
      icon: faWheatAwn,
      activeClass: 'bg-[#0AE448] text-[#0E100F] shadow-sm border border-[#0AE448] font-black'
    },
    {
      key: 'motors',
      name: 'BRK Motors',
      url: 'https://www.brkmotors.com.br',
      brandName: 'BRK Motors',
      niche: 'Motociclismo & Off-Road',
      aov: 240,
      icon: faFire,
      activeClass: 'bg-[#FF8709] text-[#0E100F] shadow-sm border border-[#FF8709] font-black'
    }
  ];

  const currentDomain = diagnostic?.realSiteData.domain || '';
  const activeShopSlug = OneClickMitigationService.getShopSlug(currentDomain);
  const activeMitigationsCount = OneClickMitigationService.getActionLogs().filter(l => l.status !== 'REVERTED').length;

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
  const scoreBadgeColor = score >= 75 ? 'text-[#0AE448] bg-[#0AE448]/10 border-[#0AE448]/30 shadow-sm' : 
                          score >= 55 ? 'text-[#00BAE2] bg-[#00BAE2]/10 border-[#00BAE2]/30 shadow-sm' : 
                          'text-[#FF8709] bg-[#FF8709]/10 border-[#FF8709]/30 shadow-sm';

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-[#0E100F]/95 backdrop-blur-md border-b border-white/10 shadow-lg transition-all text-[#F0EFE6]">
      
      {/* Mini Ticker Superior Inteligente (Edge Telemetry Bar) */}
      <div className="bg-slate-900 text-slate-300 text-[10px] font-mono py-1 px-4 lg:px-8 border-b border-slate-800 flex items-center justify-between overflow-hidden select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span ref={pulseBadgeRef} className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shadow-xs shadow-emerald-400/80" />
            <span className="font-bold tracking-wider uppercase">VIGIA 24H ATIVO</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline text-slate-400">ÚLTIMO CICLO: <strong className="text-white font-bold">HOJE 07:00 (3 MARCAS)</strong></span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="hidden md:inline text-slate-400">GROUNDING FACT-CHECK: <strong className="text-emerald-400">100% AUDITADO</strong></span>
        </div>

        <div className="flex items-center gap-2">
          {onOpenMitigationHistory && (
            <button
              onClick={onOpenMitigationHistory}
              className="px-2 py-0.5 rounded-md bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-600/50 text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
              title="Abrir Central de Ações Mitigadas (Shopify & Meta Ads)"
            >
              <Zap className="w-2.5 h-2.5 text-amber-400" />
              <span>CENTRAL DE MITIGAÇÕES</span>
              {activeMitigationsCount > 0 && (
                <span className="px-1 bg-emerald-500 text-slate-950 rounded-full font-black text-[8px]">
                  {activeMitigationsCount}
                </span>
              )}
            </button>
          )}
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
                <span className="font-extrabold text-xl tracking-tight text-[#FFFCE1] font-mono uppercase">
                  {whiteLabel.agencyName}
                </span>
                <span 
                  className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase border rounded-md shadow-2xs font-mono"
                  style={{ color: '#0AE448', backgroundColor: 'rgba(10, 228, 72, 0.1)', borderColor: 'rgba(10, 228, 72, 0.3)' }}
                >
                  AUTONOMOUS GROWTH OS
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0AE448]" />
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
          <div className="gsap-header-item hidden lg:flex items-center gap-4 px-4 py-2 rounded-full bg-[#141716] hover:bg-[#1a1e1c] border border-white/10 text-xs shadow-sm transition-all">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Site Auditado:</span>
              <span className="font-bold text-[#FFFCE1] font-mono flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-[#0AE448]" />
                {diagnostic.input.siteUrl.replace(/^https?:\/\//, '')}
              </span>
            </div>
            <div className="h-4 w-px bg-white/10" />
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Status:</span>
              <span className="font-bold text-[#0AE448] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448]" /> 100% Inspecionado
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons with GSAP Micro-Interactions */}
        <div className="gsap-header-item flex items-center gap-2 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
          
          <SupabaseStatusIndicator />

          <button
            onClick={onOpenPricing}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-bold text-xs hover:bg-amber-500/20 transition-all shadow-sm cursor-pointer hover:scale-105 active:scale-95"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Fazer Upgrade</span>
          </button>

          {diagnostic && (
            <div ref={scoreBadgeRef} className={`hidden md:flex px-3.5 py-2 rounded-full border font-bold text-xs items-center gap-1.5 shadow-sm ${scoreBadgeColor}`}>
              <TrendingUp className="w-4 h-4" />
              <span>Score: {score}/100</span>
            </div>
          )}

          <button
            onClick={onOpenAuditModal}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-[#0E100F] bg-[#0AE448] hover:bg-[#09c93f] rounded-full transition-all shadow-md shadow-[#0AE448]/20 hover:scale-105 active:scale-95 cursor-pointer font-mono tracking-tight"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{diagnostic ? 'Novo Site' : 'Auditar Loja'}</span>
          </button>

          {diagnostic && onOpenWhatsAppLeadModal && (
            <button
              onClick={onOpenWhatsAppLeadModal}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#0AE448] bg-[#141716] hover:bg-[#1a1f1c] border border-[#0AE448]/30 rounded-full transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              title="Receber Raio-X no WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
          )}

          {diagnostic && (
            <button
              onClick={onExportReport}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#FFFCE1] bg-[#191C1B] hover:bg-[#222724] border border-white/15 rounded-full transition-all shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
              title="Exportar Relatório Estratégico Completo em PDF"
            >
              <Download className="w-3.5 h-3.5 text-[#0AE448]" />
              <span className="hidden sm:inline">PDF</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            className="flex items-center justify-center p-2 text-slate-400 bg-[#191C1B] hover:bg-[#222724] border border-white/10 rounded-full transition-all hover:text-[#0AE448] shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            title="CRM (Painel de Leads)"
          >
            <Users className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center justify-center p-2 text-[#BBBAA6] bg-[#191C1B] hover:bg-[#222724] border border-white/10 rounded-full transition-all hover:text-[#0AE448] shadow-sm hover:scale-105 active:scale-95 cursor-pointer"
            title="Configurações do Motor Neural"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* 🚀 STORE BRAND QUICK-SWITCHER BAR */}
      <div className="bg-[#101211]/95 backdrop-blur-md border-t border-white/10 px-4 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7C7C6F] font-mono flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#0AE448]" /> Marcas Monitoradas:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {brandPresets.map((preset) => {
                const isActive = currentDomain.toLowerCase().includes(preset.key);
                return (
                  <button
                    key={preset.key}
                    onClick={() => onSelectStorePreset && onSelectStorePreset(preset)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-200 cursor-pointer border ${
                      isActive 
                        ? preset.activeClass 
                        : 'bg-[#141716] text-[#BBBAA6] hover:text-[#FFFCE1] border-white/10 hover:border-white/20 hover:bg-[#191C1B] shadow-xs hover:scale-[1.02]'
                    }`}
                    title={`Auditar catálogo oficial de ${preset.name} (${preset.niche})`}
                  >
                    <FontAwesomeIcon icon={preset.icon} className="w-3.5 h-3.5" />
                    <span>{preset.name}</span>
                    {isActive ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-white inline-block ml-0.5 animate-pulse" />
                    ) : (
                      <span className="text-[10px] text-[#7C7C6F] font-mono font-normal">({preset.slug})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Deep Link to Active Store Shopify Admin */}
          {activeShopSlug && (
            <div className="flex items-center gap-2">
              <a
                href={`https://admin.shopify.com/store/${activeShopSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#191C1B] hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl font-mono text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                title={`Acessar painel administrativo da Shopify da loja ativa (${activeShopSlug})`}
              >
                <FontAwesomeIcon icon={faShopify} className="w-3.5 h-3.5 text-[#0AE448]" />
                <span>Shopify Admin ({activeShopSlug})</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
