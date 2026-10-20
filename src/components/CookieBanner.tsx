import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Cookie, Settings, Check, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [preferencesEnabled, setPreferencesEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('nocookie=1')) {
      return;
    }
    const consent = localStorage.getItem('adshield_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (type: 'ALL' | 'NECESSARY_ONLY' | 'CUSTOM') => {
    const consentData = {
      essential: true,
      analytics: type === 'ALL' ? true : type === 'NECESSARY_ONLY' ? false : analyticsEnabled,
      preferences: type === 'ALL' ? true : type === 'NECESSARY_ONLY' ? false : preferencesEnabled,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('adshield_cookie_consent', JSON.stringify(consentData));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-6 md:max-w-3xl md:mx-auto bg-[#141716]/95 backdrop-blur-xl text-[#FFFCE1] p-5 rounded-3xl border border-white/10 shadow-2xl z-50 animate-fade-in-up font-sans">
      <div className="space-y-4">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 shrink-0">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#FFFCE1] flex items-center gap-2">
                <span>Privacidade & Gestão de Cookies</span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30">
                  LGPD Conforme
                </span>
              </h4>
              <p className="text-xs text-[#7C7C6F] mt-0.5">
                Respeitamos sua privacidade e não comercializamos seus dados com terceiros.
              </p>
            </div>
          </div>
        </div>

        {/* Text */}
        <p className="text-xs text-[#BBBAA6] leading-relaxed">
          Utilizamos armazenamento local (<code className="text-[#0AE448]">localStorage</code>) e cookies essenciais para manter suas auditorias de sites, memória evolutiva dos 18 agentes e segurança da sessão diretamente no seu navegador, sem depender de bancos externos para operar. Com seu consentimento, também habilitamos telemetria de performance e preferências visuais. Saiba mais na nossa{' '}
          <Link to="/privacy" className="text-[#0AE448] hover:underline font-semibold">
            Política de Privacidade, Cookies & LGPD
          </Link>{' '}
          e nos{' '}
          <Link to="/terms" className="text-[#0AE448] hover:underline font-semibold">
            Termos de Uso
          </Link>.
        </p>

        {/* Detailed Controls (Expandable) */}
        {showDetails && (
          <div className="p-3.5 bg-[#101211] border border-white/10 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-white/10">
              <div>
                <span className="font-bold text-[#FFFCE1] block">1. Cookies & Armazenamento Local Estritamente Necessários</span>
                <span className="text-[11px] text-[#7C7C6F]">Estado do diagnóstico atual, segurança da sessão, histórico local de auditoria e rate-limit.</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-white/10 text-[#FFFCE1] px-2 py-0.5 rounded-md">Obrigatório</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-white/10">
              <div>
                <span className="font-bold text-[#FFFCE1] block">2. Memória Evolutiva & Telemetria de Performance</span>
                <span className="text-[11px] text-[#7C7C6F]">Calibração local de benchmarks por vertical, detecção de reposição de estoque e latência de inspeção.</span>
              </div>
              <button
                type="button"
                onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${analyticsEnabled ? 'bg-[#0AE448]' : 'bg-white/20'}`}
              >
                <span className={`w-3.5 h-3.5 bg-[#0E100F] rounded-full absolute top-0.75 transition-transform ${analyticsEnabled ? 'right-0.75' : 'left-0.75'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <span className="font-bold text-[#FFFCE1] block">3. Preferências de Interface & Relatórios White-Label</span>
                <span className="text-[11px] text-[#7C7C6F]">Salva parâmetros do simulador de ROAS, identidade visual de relatórios PDF e filtros de catálogo.</span>
              </div>
              <button
                type="button"
                onClick={() => setPreferencesEnabled(!preferencesEnabled)}
                className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${preferencesEnabled ? 'bg-[#0AE448]' : 'bg-white/20'}`}
              >
                <span className={`w-3.5 h-3.5 bg-[#0E100F] rounded-full absolute top-0.75 transition-transform ${preferencesEnabled ? 'right-0.75' : 'left-0.75'}`} />
              </button>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs font-semibold text-[#7C7C6F] hover:text-[#FFFCE1] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{showDetails ? 'Recolher Opções' : 'Configurar Preferências'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => saveConsent('NECESSARY_ONLY')}
              className="px-3.5 py-2 bg-[#191C1B] hover:bg-white/5 text-[#BBBAA6] hover:text-[#FFFCE1] text-xs font-bold rounded-xl transition-all cursor-pointer border border-white/10"
            >
              Apenas Necessários
            </button>
            <button
              id="btn-accept-all-cookies"
              type="button"
              onClick={() => saveConsent(showDetails ? 'CUSTOM' : 'ALL')}
              className="px-4 py-2 bg-[#0AE448] hover:bg-[#09cb40] text-[#0E100F] text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-[#0AE448]/20 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{showDetails ? 'Salvar Escolhas' : 'Aceitar Todos'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

