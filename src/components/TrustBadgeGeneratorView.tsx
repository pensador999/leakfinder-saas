import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Layers, 
  Eye,
  Lock,
  Zap,
  Globe
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { 
  generateTrustBadgeConfig, 
  generateFloatingBadgeSnippet, 
  generateFooterBadgeSnippet,
  TrustBadgeConfig
} from '../services/trustBadgeService';

interface TrustBadgeGeneratorViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const TrustBadgeGeneratorView: React.FC<TrustBadgeGeneratorViewProps> = ({ diagnostic }) => {
  const { realSiteData, growthScore } = diagnostic;
  const [selectedStyle, setSelectedStyle] = useState<'floating' | 'footer'>('floating');
  const [copied, setCopied] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const config: TrustBadgeConfig = generateTrustBadgeConfig(
    realSiteData.domain,
    realSiteData.brandName,
    growthScore
  );

  const currentSnippet = selectedStyle === 'floating' 
    ? generateFloatingBadgeSnippet(config)
    : generateFooterBadgeSnippet(config);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-blue-600 rounded-2xl text-white shadow-md shadow-blue-600/20">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Selo Dinâmico de Confiança & Certificação</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                Growth Hacking • Prova Social
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Aumente a taxa de conversão da sua loja em até <strong>+14%</strong> instalando o selo oficial de catálogo e estoque auditados no seu tema.
            </p>
          </div>
        </div>

        {/* Certificate Button */}
        <button
          onClick={() => setShowCertificateModal(true)}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-colors cursor-pointer shadow-md"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Ver Certificado Oficial</span>
        </button>
      </div>

      {/* Live Badge Style Switcher & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Style Switcher & Checklist */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" /> Escolha o Formato de Exibição na Loja:
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedStyle('floating')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedStyle === 'floating'
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-bold text-xs text-slate-900">1. Selo Flutuante (Canto)</p>
                <p className="text-[11px] text-slate-500 mt-1">Fica visível no canto inferior direito em todas as páginas.</p>
              </button>

              <button
                onClick={() => setSelectedStyle('footer')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedStyle === 'footer'
                    ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-bold text-xs text-slate-900">2. Selo de Rodapé (Footer)</p>
                <p className="text-[11px] text-slate-500 mt-1">Ideal para ficar ao lado das bandeiras de cartão no rodapé.</p>
              </button>
            </div>

            {/* Verified Pillars */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pilares Verificados pelo LeakFinder:</p>
              <div className="space-y-2">
                {config.verifiedPillars.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">{p.title}: </span>
                      <span className="text-slate-600">{p.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>O selo inclui link criptografado com ID exclusivo de validação em tempo real.</span>
          </div>
        </div>

        {/* Right: Live Visual Preview Box */}
        <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-400" /> Prévia Visual ao Vivo na sua Loja:
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold rounded-md">
                ID: {config.verificationId}
              </span>
            </div>

            {/* Mock Store Screen */}
            <div className="mt-6 p-6 bg-slate-950 rounded-2xl border border-slate-800 relative min-h-48 flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-2 opacity-40">
                <Globe className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs font-mono text-slate-500">www.{realSiteData.domain}</p>
                <div className="w-32 h-2 bg-slate-800 rounded-full mx-auto" />
                <div className="w-24 h-2 bg-slate-800 rounded-full mx-auto" />
              </div>

              {/* Rendered Badge Sample */}
              {selectedStyle === 'floating' ? (
                <div className="absolute bottom-4 right-4 animate-bounce-subtle">
                  <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-2 rounded-full border border-sky-400 shadow-xl shadow-black/50">
                    <div className="bg-sky-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">
                      ✓
                    </div>
                    <div className="text-left">
                      <p className="text-[8px] font-bold text-sky-300 uppercase leading-none">Loja Auditada</p>
                      <p className="text-[10px] font-black text-white leading-tight">LeakFinder Verified</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl border border-slate-700 shadow-lg">
                    <ShieldCheck className="w-4 h-4 text-sky-400" />
                    <div className="text-left">
                      <p className="text-[9px] font-black text-white uppercase">Catálogo & Estoque Auditados</p>
                      <p className="text-[8px] text-slate-400">LeakFinder Official • {config.verificationId}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Copy Snippet Actions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">Código para o Tema Shopify:</span>
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Código Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800 max-h-28">
              {currentSnippet}
            </pre>
          </div>
        </div>

      </div>

      {/* Certificate Modal Preview */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 border-4 border-amber-400 space-y-6 text-center">
            
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-600">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 font-extrabold font-mono text-xs rounded-full uppercase tracking-wider border border-amber-300">
                Certificado Oficial de Conformidade
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-2">{realSiteData.brandName}</h3>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{realSiteData.domain}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">ID do Certificado:</span>
                <span className="font-bold text-slate-900">{config.verificationId}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Data de Emissão:</span>
                <span className="font-bold text-slate-900">{config.verifiedDate}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-500">Status da Auditoria:</span>
                <span className="font-bold text-emerald-600">✓ APROVADO COM EXCELÊNCIA</span>
              </div>
            </div>

            <button
              onClick={() => setShowCertificateModal(false)}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Fechar Certificado
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
