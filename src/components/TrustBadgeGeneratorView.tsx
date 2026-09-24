import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Award, 
  CheckCircle2, 
  Layers, 
  Eye, 
  Sparkles, 
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
    <div className="space-y-6 font-sans text-[#FFFCE1]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md shadow-[#0AE448]/10">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#FFFCE1]">Selo Dinâmico de Confiança & Certificação</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20">
                Growth Hacking • Prova Social
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              Aumente a taxa de conversão da sua loja em até <strong className="text-[#FFFCE1]">+14%</strong> instalando o selo oficial de catálogo e estoque auditados no seu tema.
            </p>
          </div>
        </div>

        {/* Certificate Button */}
        <button
          onClick={() => setShowCertificateModal(true)}
          className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 text-xs font-bold rounded-2xl flex items-center gap-2 transition-colors cursor-pointer shadow-md"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>Ver Certificado Oficial</span>
        </button>
      </div>

      {/* Live Badge Style Switcher & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Style Switcher & Checklist */}
        <div className="p-6 bg-[#101211] rounded-3xl border border-white/10 shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#FFFCE1] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0AE448]" /> Escolha o Formato de Exibição na Loja:
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSelectedStyle('floating')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedStyle === 'floating'
                    ? 'border-[#0AE448] bg-[#0AE448]/10 shadow-xs ring-1 ring-[#0AE448]'
                    : 'border-white/10 bg-[#141716] hover:bg-white/5'
                }`}
              >
                <p className="font-bold text-xs text-[#FFFCE1]">1. Selo Flutuante (Canto)</p>
                <p className="text-[11px] text-[#BBBAA6] mt-1 leading-relaxed">Fica visível no canto inferior direito em todas as páginas.</p>
              </button>

              <button
                onClick={() => setSelectedStyle('footer')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  selectedStyle === 'footer'
                    ? 'border-[#0AE448] bg-[#0AE448]/10 shadow-xs ring-1 ring-[#0AE448]'
                    : 'border-white/10 bg-[#141716] hover:bg-white/5'
                }`}
              >
                <p className="font-bold text-xs text-[#FFFCE1]">2. Selo de Rodapé (Footer)</p>
                <p className="text-[11px] text-[#BBBAA6] mt-1 leading-relaxed">Ideal para ficar ao lado das bandeiras de cartão no rodapé.</p>
              </button>
            </div>

            {/* Verified Pillars */}
            <div className="space-y-2.5 pt-2">
              <p className="text-xs font-mono font-bold text-[#BBBAA6] uppercase tracking-wider">Pilares Verificados pelo AdShield:</p>
              <div className="space-y-2">
                {config.verifiedPillars.map((p, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs p-2.5 bg-[#141716] rounded-xl border border-white/5">
                    <CheckCircle2 className="w-4 h-4 text-[#0AE448] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#FFFCE1]">{p.title}: </span>
                      <span className="text-[#BBBAA6]">{p.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-[#141716] rounded-2xl border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>O selo inclui link criptografado com ID exclusivo de validação em tempo real.</span>
          </div>
        </div>

        {/* Right: Live Visual Preview Box */}
        <div className="p-6 bg-[#101211] border border-white/10 rounded-3xl text-[#FFFCE1] shadow-2xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold text-[#BBBAA6] uppercase tracking-wider flex items-center gap-2 font-mono">
                <Eye className="w-4 h-4 text-[#00BAE2]" /> Prévia Visual ao Vivo na sua Loja:
              </span>
              <span className="px-2 py-0.5 bg-[#0AE448]/10 text-[#0AE448] font-mono text-[10px] font-bold rounded-md border border-[#0AE448]/20">
                ID: {config.verificationId}
              </span>
            </div>

            {/* Mock Store Screen */}
            <div className="mt-6 p-6 bg-[#0E100F] rounded-2xl border border-white/10 relative min-h-48 flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-2 opacity-40">
                <Globe className="w-8 h-8 mx-auto text-[#BBBAA6]" />
                <p className="text-xs font-mono text-[#BBBAA6]">www.{realSiteData.domain}</p>
                <div className="w-32 h-2 bg-white/10 rounded-full mx-auto" />
                <div className="w-24 h-2 bg-white/10 rounded-full mx-auto" />
              </div>

              {/* Rendered Badge Sample */}
              {selectedStyle === 'floating' ? (
                <div className="absolute bottom-4 right-4 animate-bounce-subtle">
                  <div className="flex items-center gap-2 bg-[#101211] text-[#FFFCE1] px-3.5 py-2 rounded-full border border-[#0AE448] shadow-2xl">
                    <div className="bg-[#0AE448] text-slate-950 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black">
                      ✓
                    </div>
                    <div className="text-left">
                      <p className="text-[8px] font-bold text-[#0AE448] uppercase leading-none font-mono">Loja Auditada</p>
                      <p className="text-[10px] font-black text-[#FFFCE1] leading-tight">AdShield Verified</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-2 bg-[#101211] text-[#FFFCE1] px-3.5 py-1.5 rounded-xl border border-white/20 shadow-xl">
                    <ShieldCheck className="w-4 h-4 text-[#0AE448]" />
                    <div className="text-left">
                      <p className="text-[9px] font-black text-[#FFFCE1] uppercase">Catálogo & Estoque Auditados</p>
                      <p className="text-[8px] text-[#BBBAA6] font-mono">AdShield Official • {config.verificationId}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Copy Snippet Actions */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#BBBAA6]">Código para o Tema Shopify:</span>
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-[#0AE448]/20"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Código Copiado!' : 'Copiar Código'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#0E100F] rounded-xl text-[11px] font-mono text-[#BBBAA6] overflow-x-auto border border-white/10 max-h-28">
              {currentSnippet}
            </pre>
          </div>
        </div>

      </div>

      {/* Certificate Modal Preview */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0E100F]/90 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#101211] rounded-3xl shadow-2xl p-8 border-2 border-amber-400/60 space-y-6 text-center text-[#FFFCE1]">
            
            <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/20 rounded-full flex items-center justify-center mx-auto text-amber-400 shadow-md">
              <Award className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 bg-amber-400/10 text-amber-300 font-extrabold font-mono text-xs rounded-full uppercase tracking-wider border border-amber-400/20">
                Certificado Oficial de Conformidade
              </span>
              <h3 className="text-2xl font-black text-[#FFFCE1] mt-3">{realSiteData.brandName}</h3>
              <p className="text-xs text-[#BBBAA6] font-mono mt-0.5">{realSiteData.domain}</p>
            </div>

            <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 text-left space-y-2 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-[#BBBAA6]">ID do Certificado:</span>
                <span className="font-bold text-[#FFFCE1]">{config.verificationId}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#BBBAA6]">Data de Emissão:</span>
                <span className="font-bold text-[#FFFCE1]">{config.verifiedDate}</span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-[#BBBAA6]">Status da Auditoria:</span>
                <span className="font-bold text-[#0AE448] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>APROVADO COM EXCELÊNCIA</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowCertificateModal(false)}
              className="w-full py-3 bg-white/10 hover:bg-white/15 text-[#FFFCE1] font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Fechar Certificado
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
