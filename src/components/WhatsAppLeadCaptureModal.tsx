import React, { useState } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Check, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Copy
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { saveLead, formatWhatsAppMessage, generateWhatsAppLink } from '../services/whatsappLeadService';
import { generateShopifyTelemetryAnalysis } from '../services/shopifyTelemetryService';

interface WhatsAppLeadCaptureModalProps {
  diagnostic: AgentDiagnosticResult;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppLeadCaptureModal: React.FC<WhatsAppLeadCaptureModalProps> = ({
  diagnostic,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const { realSiteData, growthScore } = diagnostic;
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const telemetry = generateShopifyTelemetryAnalysis(
    realSiteData.domain,
    realSiteData.catalogAudit?.issues || [],
    realSiteData.rawHtmlSnippet
  );

  const reportUrl = `${window.location.origin}/#report-${realSiteData.brandName.toLowerCase()}`;
  
  const formattedMessage = formatWhatsAppMessage(
    name,
    realSiteData.brandName,
    realSiteData.domain,
    growthScore,
    telemetry.totalEstimatedRevenueLoss,
    reportUrl
  );

  // Phone Mask: (XX) 9XXXX-XXXX
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);

    if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    setPhone(v);
  };

  const handleSendWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    // Save lead to local database / storage
    saveLead({
      merchantName: name || 'Lojista',
      whatsappNumber: phone,
      storeUrl: realSiteData.url,
      brandName: realSiteData.brandName,
      estimatedLossRevenue: telemetry.totalEstimatedRevenueLoss,
      growthScore
    });

    // Generate direct WhatsApp dispatch link
    const waUrl = generateWhatsAppLink(phone, formattedMessage);
    window.open(waUrl, '_blank');
    setIsSent(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 text-white/80 hover:text-white rounded-full bg-black/10 hover:bg-black/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="px-2 py-0.5 bg-white/20 text-emerald-100 text-[10px] font-mono font-extrabold uppercase rounded-md tracking-wider">
                Envio Instantâneo D2C
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">
                Receba o Raio-X no seu WhatsApp
              </h3>
            </div>
          </div>

          <p className="text-xs text-emerald-100 mt-2 leading-relaxed max-w-md">
            Enviamos o resumo executivo de <strong>{realSiteData.brandName}</strong> com o valor de vazamento financeiro em R$ e os códigos de correção para aplicar na loja.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Key Value Highlight */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-emerald-800">Vazamento Estimado Identificado</p>
              <p className="text-xl font-black text-emerald-950 font-mono">
                R$ {telemetry.totalEstimatedRevenueLoss.toLocaleString('pt-BR')} / mês
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs">
              Score: {growthScore}/100
            </span>
          </div>

          {/* Capture Form */}
          <form onSubmit={handleSendWhatsApp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Seu Nome ou da sua Marca:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Marcos (BRK Fishing)"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Seu WhatsApp (com DDD):
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-600/25 active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Abrir WhatsApp com o Relatório Formatado</span>
            </button>
          </form>

          {/* Message Preview Accordion */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Prévia da Mensagem Formatada:
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedLink ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
            <pre className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] font-mono text-slate-700 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {formattedMessage}
            </pre>
          </div>

          {/* Privacy Note */}
          <p className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Spam. Relatório privado e seguro para a sua tomada de decisão.</span>
          </p>

        </div>

      </div>
    </div>
  );
};
