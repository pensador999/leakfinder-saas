import React, { useState } from 'react';
import { Camera, Share2, Copy, Check, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface SocialAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const SocialAgentView: React.FC<SocialAgentViewProps> = ({ diagnostic }) => {
  const { social, realSiteData } = diagnostic;
  const [copiedBio, setCopiedBio] = useState(false);

  const copyBioText = () => {
    navigator.clipboard.writeText(social.instagramBioStrategy.bioCtaHook);
    setCopiedBio(true);
    setTimeout(() => setCopiedBio(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-[#FFFCE1]">AdShield Instagram & Social Conversion Auditor</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#00BAE2]/10 text-[#00BAE2] rounded-full border border-[#00BAE2]/20">
                Engajamento & Funil de Bio
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 font-medium">
              Análise da jornada do seguidor do Instagram para a compra direta em <span className="font-mono text-[#FFFCE1] font-bold">{realSiteData.domain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-5 py-3 bg-[#141716] rounded-2xl border border-white/10">
          <div className="text-center">
            <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-bold">Score Redes Sociais</p>
            <p className="text-xl font-black font-mono text-[#0AE448]">{social.socialScore}/100</p>
          </div>
        </div>
      </div>

      {/* Social Tracking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-medium">
        
        <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl shadow-xl">
          <span className="text-[10px] text-[#BBBAA6] uppercase font-mono font-semibold block">Meta Pixel (FBQ)</span>
          <p className="text-sm font-bold text-[#0AE448] flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4 text-[#0AE448]" /> Pixel Detectado no HTML
          </p>
        </div>

        <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl shadow-xl">
          <span className="text-[10px] text-[#BBBAA6] uppercase font-mono font-semibold block">Google Tag Manager (GTM)</span>
          <p className="text-sm font-bold text-[#0AE448] flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4 text-[#0AE448]" /> GTM Ativo
          </p>
        </div>

        <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl shadow-xl">
          <span className="text-[10px] text-[#BBBAA6] uppercase font-mono font-semibold block">Tags OpenGraph WhatsApp/Insta</span>
          <p className={`text-sm font-bold flex items-center gap-1.5 mt-1 ${social.hasOgImage ? 'text-[#0AE448]' : 'text-amber-400'}`}>
            {social.hasOgImage ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {social.hasOgImage ? 'Prévia Social Otimizada' : 'Sem imagem og:image'}
          </p>
        </div>

      </div>

      {/* OpenGraph Preview Card (Como o site aparece quando compartilhado no WhatsApp/DM) */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 space-y-4 shadow-2xl">
        <h3 className="text-sm font-black text-[#FFFCE1] uppercase tracking-wider flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#0AE448]" />
          <span>Prévia do Link quando Compartilhado no WhatsApp & Instagram DM</span>
        </h3>

        <div className="max-w-md mx-auto p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-2 shadow-inner font-sans">
          <div className="w-full h-40 bg-gradient-to-br from-emerald-950 to-slate-900 border border-[#0AE448]/20 rounded-xl flex items-center justify-center text-[#FFFCE1] font-bold text-sm shadow-xs">
            <span>[ Prévia da Imagem Social de {realSiteData.domain} ]</span>
          </div>
          <div className="p-2 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#0AE448] font-mono">{realSiteData.domain}</span>
            <h4 className="text-sm font-bold text-[#FFFCE1] truncate">{social.ogTitleDetected}</h4>
            <p className="text-xs text-[#BBBAA6] line-clamp-2">{realSiteData.metaDescription}</p>
          </div>
        </div>
      </div>

      {/* Instagram Bio Link Strategy Generator */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 space-y-4 shadow-2xl font-medium">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm font-black text-[#FFFCE1] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00BAE2]" />
            <span>Gerador de Chamada para a Bio do Instagram (Bio CTA Strategy)</span>
          </h3>

          <button
            onClick={copyBioText}
            className="px-3.5 py-1.5 text-xs font-black bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#0AE448]/20"
          >
            {copiedBio ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedBio ? 'Copiado!' : 'Copiar Texto da Bio'}</span>
          </button>
        </div>

        <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 text-xs space-y-2">
          <span className="text-[10px] uppercase font-mono font-bold text-[#00BAE2] tracking-wider block">Texto Recomendado para a Bio do Instagram:</span>
          <p className="text-[#0AE448] font-bold text-sm bg-[#0E100F] p-3 rounded-xl border border-white/5 font-mono">
            {social.instagramBioStrategy.bioCtaHook}
          </p>

          <p className="text-[#BBBAA6] pt-1">
            <strong className="text-[#FFFCE1]">Dica AdShield de Conversão:</strong> {social.instagramBioStrategy.conversionFunnelTip}
          </p>
        </div>
      </div>

    </div>
  );
};
