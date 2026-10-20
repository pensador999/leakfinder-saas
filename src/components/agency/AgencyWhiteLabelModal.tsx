import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Sparkles, 
  Building2, 
  Palette, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  DollarSign, 
  CheckCircle2, 
  X, 
  Eye, 
  ExternalLink,
  ShieldCheck,
  Check
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { 
  getStoredAgencyConfig, 
  saveStoredAgencyConfig, 
  AgencyWhiteLabelConfig, 
  printDossierDirectly 
} from '../../services/agency/whiteLabelPdfService';

interface AgencyWhiteLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostic: AgentDiagnosticResult;
}

export const AgencyWhiteLabelModal: React.FC<AgencyWhiteLabelModalProps> = ({
  isOpen,
  onClose,
  diagnostic
}) => {
  const [config, setConfig] = useState<AgencyWhiteLabelConfig>(getStoredAgencyConfig());
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredAgencyConfig());
      setSavedSuccess(false);
    }
  }, [isOpen]);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredAgencyConfig(config);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePrintPdf = () => {
    saveStoredAgencyConfig(config);
    printDossierDirectly(diagnostic, config);
  };

  const handleCopyPublicDossierUrl = () => {
    saveStoredAgencyConfig(config);
    const domain = diagnostic.realSiteData.domain || diagnostic.input.siteUrl;
    const shareUrl = `${window.location.origin}/?dossier=${encodeURIComponent(domain)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-[#101211] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col text-[#FFFCE1]">
        
        {/* Header */}
        <div className="p-6 bg-[#0E100F] text-[#FFFCE1] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00BAE2]/10 border border-[#00BAE2]/25 rounded-2xl text-[#00BAE2] shadow-md shadow-[#00BAE2]/10">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#FFFCE1]">Módulo Agência White-Label & Gerador de PDF</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#00BAE2]/20 text-[#00BAE2] border border-[#00BAE2]/30 rounded-md">
                  Formato A4 Executivo
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6]">Exporte dossiês de auditoria com a sua marca para envio aos lojistas.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl text-[#BBBAA6] hover:text-[#FFFCE1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {savedSuccess && (
            <div className="p-3.5 rounded-2xl bg-[#0AE448]/10 border border-[#0AE448]/25 text-[#0AE448] font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-[#0AE448]" />
              <span>Configurações da agência salvas com sucesso!</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT FORM: AGENCY BRAND SETTINGS (7 COLS) */}
            <form onSubmit={handleSaveConfig} className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="font-bold text-[#FFFCE1] text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#00BAE2]" />
                  Identidade Visual da sua Agência
                </h3>
                <span className="text-[10px] text-[#BBBAA6] font-mono">Personalização Completa</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">Nome da Agência / Empresa</label>
                  <input
                    type="text"
                    required
                    value={config.agencyName}
                    onChange={(e) => setConfig({ ...config, agencyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">URL do Logo (Opcional)</label>
                  <input
                    type="url"
                    placeholder="https://suaagencia.com.br/logo.png"
                    value={config.agencyLogoUrl}
                    onChange={(e) => setConfig({ ...config, agencyLogoUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">Nome do Consultor / Especialista</label>
                  <input
                    type="text"
                    required
                    value={config.consultantName}
                    onChange={(e) => setConfig({ ...config, consultantName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">Cargo / Especialidade</label>
                  <input
                    type="text"
                    value={config.consultantRole}
                    onChange={(e) => setConfig({ ...config, consultantRole: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">WhatsApp de Contato</label>
                  <input
                    type="tel"
                    value={config.consultantWhatsApp}
                    onChange={(e) => setConfig({ ...config, consultantWhatsApp: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">E-mail Profissional</label>
                  <input
                    type="email"
                    value={config.consultantEmail}
                    onChange={(e) => setConfig({ ...config, consultantEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Commercial Proposal Box */}
              <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#FFFCE1] flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.includeCommercialProposal}
                      onChange={(e) => setConfig({ ...config, includeCommercialProposal: e.target.checked })}
                      className="rounded text-[#0AE448] focus:ring-[#0AE448] w-4 h-4 cursor-pointer accent-[#0AE448]"
                    />
                    <span>Anexar Proposta Comercial da Agência no PDF</span>
                  </label>
                </div>

                {config.includeCommercialProposal && (
                  <div className="pt-2">
                    <label className="block font-bold text-[#BBBAA6] mb-1">Valor do Retainer / Setup (R$):</label>
                    <input
                      type="number"
                      value={config.proposedRetainerValue}
                      onChange={(e) => setConfig({ ...config, proposedRetainerValue: Number(e.target.value) })}
                      className="w-full sm:w-48 px-3 py-1.5 text-xs bg-[#0E100F] border border-white/10 rounded-xl focus:border-[#0AE448] focus:outline-none font-mono font-bold text-[#0AE448]"
                    />
                  </div>
                )}
              </div>

              {/* External Checkout Gateway Links (Synced with TransparentCheckoutModal) */}
              <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#FFFCE1] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#0AE448]" />
                    <span>Links de Checkout Externo (Asaas / Kiwify / Stripe)</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#7C7C6F]">Opcional</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="url"
                    placeholder="Starter (R$ 297) URL"
                    value={config.checkoutUrlStarter || ''}
                    onChange={(e) => setConfig({ ...config, checkoutUrlStarter: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-[11px] bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 font-mono focus:border-[#0AE448] focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Growth Pro (R$ 497) URL"
                    value={config.checkoutUrlPro || ''}
                    onChange={(e) => setConfig({ ...config, checkoutUrlPro: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-[11px] bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 font-mono focus:border-[#0AE448] focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Agency (R$ 1.497) URL"
                    value={config.checkoutUrlAgency || ''}
                    onChange={(e) => setConfig({ ...config, checkoutUrlAgency: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-[11px] bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 font-mono focus:border-[#0AE448] focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl font-bold transition-all cursor-pointer"
              >
                Salvar Padrão da Agência
              </button>
            </form>

            {/* RIGHT PREVIEW & ACTION (5 COLS) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              
              <div className="p-5 rounded-3xl bg-[#141716] text-[#FFFCE1] shadow-xl space-y-4 border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-[#00BAE2]">Prévia do Dossiê</span>
                  <span className="text-[10px] text-[#BBBAA6] font-mono">Cliente: {diagnostic.realSiteData.brandName}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-base text-[#FFFCE1]">{config.agencyName}</h4>
                  <p className="text-xs text-[#BBBAA6] font-medium">Diagnóstico de Conversão & Blindagem de Mídia</p>
                </div>

                <div className="p-3 bg-[#0E100F] rounded-2xl border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-[#BBBAA6] uppercase font-mono block">Score de Conversão</span>
                    <span className="text-lg font-black font-mono text-[#0AE448]">{diagnostic.growthScore}/100</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-[#BBBAA6] uppercase font-mono block">Rupturas no Estoque</span>
                    <span className="text-base font-black font-mono text-rose-400">
                      {diagnostic.realSiteData.catalogAudit?.productsWithBrokenGrid ?? diagnostic.realSiteData.catalogAudit?.issues.length ?? 0} SKUs
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#BBBAA6] leading-relaxed italic">
                  "Relatório executivo estruturado com capa, dados reais de catálogo, conformidade legal CDC e proposta de consultoria."
                </p>
              </div>

              {/* Action Buttons: Share Public Link & Print High-Res PDF */}
              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={handleCopyPublicDossierUrl}
                  className="w-full py-3 bg-[#00BAE2]/15 hover:bg-[#00BAE2]/25 text-[#00BAE2] border border-[#00BAE2]/40 font-black rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-[#0AE448]" /> : <ExternalLink className="w-4 h-4" />}
                  <span>{copiedLink ? 'Link Público (?dossier=) Copiado!' : 'Copiar Link Público do Dossiê (?dossier=)'}</span>
                </button>

                <button
                  onClick={handlePrintPdf}
                  className="w-full py-3.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0AE448]/20 cursor-pointer"
                >
                  <Printer className="w-5 h-5 text-slate-950" />
                  <span>Gerar / Salvar PDF em Alta Resolução</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
