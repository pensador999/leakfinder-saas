import React, { useState } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Check, 
  Sparkles, 
  ShieldCheck, 
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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const { realSiteData, growthScore } = diagnostic;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-xl bg-[#101211] rounded-3xl shadow-2xl overflow-hidden my-8 border border-white/10 text-[#FFFCE1]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-[#141716] to-[#101211] border-b border-white/10 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 text-[#BBBAA6] hover:text-[#FFFCE1] rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0AE448]/10 rounded-2xl border border-[#0AE448]/20 text-[#0AE448]">
              <MessageCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="px-2 py-0.5 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 text-[10px] font-mono font-black uppercase rounded-md tracking-wider">
                Envio Instantâneo D2C
              </span>
              <h3 className="text-xl font-black text-[#FFFCE1] mt-0.5">
                Receba o Raio-X no seu WhatsApp
              </h3>
            </div>
          </div>

          <p className="text-xs text-[#BBBAA6] mt-2 leading-relaxed max-w-md">
            Enviamos o resumo executivo de <strong className="text-[#FFFCE1]">{realSiteData.brandName}</strong> com o valor de vazamento financeiro em R$ e os códigos de correção para aplicar na loja.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          
          {/* Key Value Highlight */}
          <div className="p-4 bg-[#141716] border border-[#0AE448]/20 rounded-2xl flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase text-[#BBBAA6]">Vazamento Estimado Identificado</p>
              <p className="text-xl font-black text-[#0AE448] font-mono">
                R$ {telemetry.totalEstimatedRevenueLoss.toLocaleString('pt-BR')} / mês
              </p>
            </div>
            <span className="px-3 py-1 bg-[#0AE448]/10 border border-[#0AE448]/30 text-[#0AE448] font-black text-xs rounded-xl shadow-xs font-mono">
              Score: {growthScore}/100
            </span>
          </div>

          {/* Capture Form */}
          <form onSubmit={handleSendWhatsApp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#BBBAA6] mb-1">
                Seu Nome ou da sua Marca:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Marcos (BRK Fishing)"
                className="w-full px-4 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-sm text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448] font-medium transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#BBBAA6] mb-1">
                Seu WhatsApp (com DDD):
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(34) 99135-1122"
                required
                className="w-full px-4 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-sm text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448] font-mono font-bold transition-all"
              />
              <button
                type="button"
                onClick={() => setPhone('(34) 99135-1122')}
                className="mt-1 text-[11px] text-[#0AE448] hover:underline font-semibold cursor-pointer"
              >
                Usar meu WhatsApp: (34) 99135-1122
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-[#0AE448]/20 active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              <span>Abrir WhatsApp com o Relatório Formatado</span>
            </button>
          </form>

          {/* Message Preview Accordion */}
          <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#BBBAA6] uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#0AE448]" /> Prévia da Mensagem Formatada:
              </span>
              <button
                onClick={handleCopy}
                className="text-[11px] font-bold text-[#0AE448] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? <Check className="w-3 h-3 text-[#0AE448]" /> : <Copy className="w-3 h-3 text-[#0AE448]" />}
                <span>{copiedLink ? 'Copiado!' : 'Copiar Texto'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#0E100F] rounded-xl border border-white/10 text-[11px] font-mono text-[#FFFCE1] whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
              {formattedMessage}
            </pre>
          </div>

          {/* Privacy Note */}
          <p className="text-[11px] text-center text-[#BBBAA6]/60 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0AE448]" />
            <span>Zero Spam. Relatório privado e seguro para a sua tomada de decisão.</span>
          </p>

        </div>

      </div>
    </div>
  );
};
