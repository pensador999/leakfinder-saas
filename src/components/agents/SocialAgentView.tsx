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
    <div className="space-y-6">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">LeakFinder Instagram & Social Conversion Auditor</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Engajamento & Funil de Bio
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Análise da jornada do seguidor do Instagram para a compra direta em <span className="font-mono text-slate-900 font-bold">{realSiteData.domain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Score Redes Sociais</p>
            <p className="text-xl font-bold font-mono text-blue-600">{social.socialScore}/100</p>
          </div>
        </div>
      </div>

      {/* Social Tracking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-medium">
        
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Meta Pixel (FBQ)</span>
          <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Pixel Detectado no HTML
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Google Tag Manager (GTM)</span>
          <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> GTM Ativo
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tags OpenGraph WhatsApp/Insta</span>
          <p className={`text-sm font-bold flex items-center gap-1.5 mt-1 ${social.hasOgImage ? 'text-emerald-600' : 'text-amber-600'}`}>
            {social.hasOgImage ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {social.hasOgImage ? 'Prévia Social Otimizada' : 'Sem imagem og:image'}
          </p>
        </div>

      </div>

      {/* OpenGraph Preview Card (Como o site aparece quando compartilhado no WhatsApp/DM) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Share2 className="w-4 h-4 text-blue-600" />
          <span>Prévia do Link quando Compartilhado no WhatsApp & Instagram DM</span>
        </h3>

        <div className="max-w-md mx-auto p-4 bg-slate-100 rounded-2xl border border-slate-300 space-y-2 shadow-inner font-sans">
          <div className="w-full h-40 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs">
            <span>[ Prévia da Imagem Social de {realSiteData.domain} ]</span>
          </div>
          <div className="p-2 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">{realSiteData.domain}</span>
            <h4 className="text-sm font-bold text-slate-900 truncate">{social.ogTitleDetected}</h4>
            <p className="text-xs text-slate-500 line-clamp-2">{realSiteData.metaDescription}</p>
          </div>
        </div>
      </div>

      {/* Instagram Bio Link Strategy Generator */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs font-medium">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Gerador de Chamada para a Bio do Instagram (Bio CTA Strategy)</span>
          </h3>

          <button
            onClick={copyBioText}
            className="px-3 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {copiedBio ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedBio ? 'Copiado!' : 'Copiar Texto da Bio'}</span>
          </button>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
          <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">Texto Recomendado para a Bio do Instagram:</span>
          <p className="text-slate-900 font-bold text-sm bg-white p-3 rounded-lg border border-slate-200 font-mono">
            {social.instagramBioStrategy.bioCtaHook}
          </p>

          <p className="text-slate-600 pt-1">
            <strong className="text-slate-900">Dica LeakFinder de Conversão:</strong> {social.instagramBioStrategy.conversionFunnelTip}
          </p>
        </div>
      </div>

    </div>
  );
};
