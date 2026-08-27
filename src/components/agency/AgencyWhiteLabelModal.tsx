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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white shadow-md shadow-blue-600/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Módulo Agência White-Label & Gerador de PDF</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md">
                  Formato A4 Executivo
                </span>
              </div>
              <p className="text-xs text-slate-400">Exporte dossiês de auditoria com a sua marca para envio aos lojistas.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {savedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Configurações da agência salvas com sucesso!</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT FORM: AGENCY BRAND SETTINGS (7 COLS) */}
            <form onSubmit={handleSaveConfig} className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  Identidade Visual da sua Agência
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">Personalização Completa</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome da Agência / Empresa</label>
                  <input
                    type="text"
                    required
                    value={config.agencyName}
                    onChange={(e) => setConfig({ ...config, agencyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">URL do Logo (Opcional)</label>
                  <input
                    type="url"
                    placeholder="https://suaagencia.com.br/logo.png"
                    value={config.agencyLogoUrl}
                    onChange={(e) => setConfig({ ...config, agencyLogoUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome do Consultor / Especialista</label>
                  <input
                    type="text"
                    required
                    value={config.consultantName}
                    onChange={(e) => setConfig({ ...config, consultantName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cargo / Especialidade</label>
                  <input
                    type="text"
                    value={config.consultantRole}
                    onChange={(e) => setConfig({ ...config, consultantRole: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp de Contato</label>
                  <input
                    type="tel"
                    value={config.consultantWhatsApp}
                    onChange={(e) => setConfig({ ...config, consultantWhatsApp: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail Profissional</label>
                  <input
                    type="email"
                    value={config.consultantEmail}
                    onChange={(e) => setConfig({ ...config, consultantEmail: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Commercial Proposal Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.includeCommercialProposal}
                      onChange={(e) => setConfig({ ...config, includeCommercialProposal: e.target.checked })}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    />
                    <span>Anexar Proposta Comercial da Agência no PDF</span>
                  </label>
                </div>

                {config.includeCommercialProposal && (
                  <div className="pt-2">
                    <label className="block font-bold text-slate-700 mb-1">Valor do Retainer / Setup (R$):</label>
                    <input
                      type="number"
                      value={config.proposedRetainerValue}
                      onChange={(e) => setConfig({ ...config, proposedRetainerValue: Number(e.target.value) })}
                      className="w-full sm:w-48 px-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold text-emerald-700"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer"
              >
                Salvar Padrão da Agência
              </button>
            </form>

            {/* RIGHT PREVIEW & ACTION (5 COLS) */}
            <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
              
              <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl space-y-4 border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] uppercase font-mono font-bold text-blue-400">Prévia do Dossiê</span>
                  <span className="text-[10px] text-slate-400 font-mono">Cliente: {diagnostic.realSiteData.brandName}</span>
                </div>

                <div className="space-y-1">
                  <h4 className="font-bold text-base text-white">{config.agencyName}</h4>
                  <p className="text-xs text-slate-300 font-medium">Diagnóstico de Conversão & Blindagem de Mídia</p>
                </div>

                <div className="p-3 bg-slate-800/80 rounded-2xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">Score de Conversão</span>
                    <span className="text-lg font-black font-mono text-emerald-400">{diagnostic.growthScore}/100</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-slate-400 uppercase font-mono block">Rupturas no Estoque</span>
                    <span className="text-base font-black font-mono text-rose-400">
                      {diagnostic.realSiteData.catalogAudit?.issues.length || 2} SKUs
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  "Relatório executivo estruturado com capa, dados reais de catálogo, conformidade legal CDC e proposta de consultoria."
                </p>
              </div>

              {/* Big Print / Download Action Button */}
              <button
                onClick={handlePrintPdf}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                <Printer className="w-5 h-5" />
                <span>Gerar / Salvar PDF em Alta Resolução</span>
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
