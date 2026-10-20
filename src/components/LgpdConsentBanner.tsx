import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, X, Check, Lock } from 'lucide-react';

const STORAGE_KEY_CONSENT = 'ADSHIELD_LGPD_CONSENT_GIVEN';

export const LgpdConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY_CONSENT);
      if (!consent) {
        // Exibe com pequeno delay para fluidez de renderização
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // Ignora erro de localStorage desabilitado em modo anônimo
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(STORAGE_KEY_CONSENT, JSON.stringify({
        acceptedAt: new Date().toISOString(),
        version: '3.2',
        consentLevel: 'ALL'
      }));
    } catch {
      // no-op
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY_CONSENT, JSON.stringify({
        acceptedAt: new Date().toISOString(),
        version: '3.2',
        consentLevel: 'ESSENTIAL_ONLY'
      }));
    } catch {
      // no-op
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside 
      aria-label="Consentimento de Privacidade e Cookies"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-fade-in"
    >
      <div className="p-4 sm:p-5 rounded-2xl bg-[#101211]/95 backdrop-blur-md border border-white/10 shadow-2xl shadow-black/80 text-[#FFFCE1] flex flex-col gap-3 font-sans">
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0AE448]">
            <ShieldCheck className="w-4 h-4 text-[#0AE448] shrink-0" />
            <span className="uppercase tracking-wider font-mono text-[11px]">Privacidade & LGPD Brasil</span>
          </div>

          <button
            onClick={handleDismiss}
            className="text-[#BBBAA6] hover:text-[#FFFCE1] transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer"
            aria-label="Fechar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#BBBAA6] leading-relaxed">
          O AdShield Intelligence utiliza armazenamento local (<code className="text-[#0AE448]">localStorage</code>), cookies essenciais e metadados técnicos públicos para diagnosticar vitrines de e-commerce e simular sangria de tráfego pago, em estrita conformidade com a <strong className="text-[#FFFCE1]">LGPD (Lei 13.709/2018)</strong> e o Marco Civil da Internet.
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/10 text-[11px]">
          <div className="flex items-center gap-2">
            <Link to="/privacy" className="text-[#BBBAA6] hover:text-[#0AE448] underline transition-colors">
              Política de Privacidade
            </Link>
            <span className="text-white/20">•</span>
            <Link to="/terms" className="text-[#BBBAA6] hover:text-[#0AE448] underline transition-colors">
              Termos
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDismiss}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] font-semibold text-[11px] transition-all cursor-pointer"
            >
              Apenas Essenciais
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-3.5 py-1.5 rounded-lg bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-bold text-[11px] transition-all flex items-center gap-1 shadow-md shadow-[#0AE448]/20 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Concordar</span>
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
};
