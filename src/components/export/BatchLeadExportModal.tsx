import React, { useState, useMemo } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  MessageCircle, 
  Building2, 
  Code2, 
  Check, 
  Filter, 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  Target, 
  Layers,
  ArrowRight,
  ChevronDown
} from 'lucide-react';
import { ProspectLead } from '../../services/prospecting/leadSniperEngine';
import { 
  BatchLeadExportService, 
  ExportTargetFormat,
  normalizePhoneForWhatsApp,
  generateSpintaxPitch
} from '../../services/export/batchLeadExportService';

interface BatchLeadExportModalProps {
  leads: ProspectLead[];
  onClose: () => void;
}

export const BatchLeadExportModal: React.FC<BatchLeadExportModalProps> = ({
  leads,
  onClose
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportTargetFormat>('EXCEL_BR');
  const [selectedStatus, setSelectedStatus] = useState<string>('TODOS');
  const [selectedNiche, setSelectedNiche] = useState<string>('TODOS');
  const [onlyMetaPixel, setOnlyMetaPixel] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportedSuccess, setExportedSuccess] = useState<boolean>(false);

  // Lista de nichos únicos presentes nos leads
  const uniqueNiches = useMemo(() => {
    const set = new Set<string>();
    leads.forEach(l => { if (l.niche) set.add(l.niche); });
    return Array.from(set);
  }, [leads]);

  // Filtro de leads ativo
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      if (selectedStatus !== 'TODOS' && lead.status !== selectedStatus) return false;
      if (selectedNiche !== 'TODOS' && lead.niche !== selectedNiche) return false;
      if (onlyMetaPixel && !lead.hasMetaPixel) return false;
      return true;
    });
  }, [leads, selectedStatus, selectedNiche, onlyMetaPixel]);

  // Métricas consolidadas dos leads filtrados
  const totalRecoverable = useMemo(() => {
    return filteredLeads.reduce((acc, l) => acc + l.totalMonthlyWasteEstimated, 0);
  }, [filteredLeads]);

  const totalAds = useMemo(() => {
    return filteredLeads.reduce((acc, l) => acc + (l.activeAdsCountEstimated || 12), 0);
  }, [filteredLeads]);

  const handleExport = () => {
    setIsExporting(true);
    try {
      BatchLeadExportService.exportBatch(filteredLeads, selectedFormat);
      setExportedSuccess(true);
      setTimeout(() => setExportedSuccess(false), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[80] flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-4xl bg-[#101211] rounded-3xl shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[92vh] border border-white/10 animate-fadeIn text-[#FFFCE1]">
        
        {/* Header Executive Deep Obsidian */}
        <div className="p-6 bg-[#0E100F] text-[#FFFCE1] border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0AE448]/10 text-[#0AE448] rounded-2xl border border-[#0AE448]/25 shadow-lg shadow-[#0AE448]/10">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[#FFFCE1]">Exportador de Leads em Lote & Disparo em Massa</h3>
                <span className="px-2.5 py-0.5 bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30 rounded-full text-[10px] font-mono font-bold">
                  Multi-Format Engine
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6] mt-0.5">
                Exporte listas de lojas com anúncios ativos no Meta Ads para CRMs e disparadores de WhatsApp sem risco de bloqueio.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] rounded-full transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Top KPI Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#141716] text-[#FFFCE1] border border-white/10">
              <span className="text-[10px] font-mono uppercase text-[#BBBAA6] font-bold block">Leads Selecionados</span>
              <div className="text-2xl font-black text-[#FFFCE1] font-mono mt-1">
                {filteredLeads.length} <span className="text-xs text-[#BBBAA6] font-normal">de {leads.length} lojas</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 text-[#FFFCE1]">
              <span className="text-[10px] font-mono uppercase text-[#0AE448] font-bold block">Sangria Total em Mídia</span>
              <div className="text-2xl font-black text-[#0AE448] font-mono mt-1">
                R$ {totalRecoverable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                <span className="text-xs text-[#BBBAA6] font-normal">/mês</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 text-[#FFFCE1]">
              <span className="text-[10px] font-mono uppercase text-[#00BAE2] font-bold block">Anúncios Meta sob Radar</span>
              <div className="text-2xl font-black text-[#00BAE2] font-mono mt-1">
                ~{totalAds} <span className="text-xs text-[#BBBAA6] font-normal">campanhas ativas</span>
              </div>
            </div>
          </div>

          {/* Format Selector Cards */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#BBBAA6] uppercase font-mono tracking-wider block">
              1. Selecione o Destino da Exportação:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Card 1: Excel Brasil */}
              <button
                type="button"
                onClick={() => setSelectedFormat('EXCEL_BR')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedFormat === 'EXCEL_BR'
                    ? 'bg-[#0E100F] border-[#0AE448] shadow-sm ring-1 ring-[#0AE448]/30'
                    : 'bg-[#141716] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/25">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  {selectedFormat === 'EXCEL_BR' && <Check className="w-4 h-4 text-[#0AE448]" />}
                </div>
                <div>
                  <h4 className="font-bold text-[#FFFCE1] text-xs">Excel Brasil (.CSV)</h4>
                  <p className="text-[11px] text-[#BBBAA6] mt-1 leading-relaxed">
                    Padrão brasileiro com separador <code className="text-[#0AE448] font-mono">;</code> e UTF-8 com BOM. Sem acentos corrompidos.
                  </p>
                </div>
              </button>

              {/* Card 2: WhatsApp Bulk */}
              <button
                type="button"
                onClick={() => setSelectedFormat('WHATSAPP_BULK')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedFormat === 'WHATSAPP_BULK'
                    ? 'bg-[#0E100F] border-[#00BAE2] shadow-sm ring-1 ring-[#00BAE2]/30'
                    : 'bg-[#141716] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/25">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  {selectedFormat === 'WHATSAPP_BULK' && <Check className="w-4 h-4 text-[#00BAE2]" />}
                </div>
                <div>
                  <h4 className="font-bold text-[#FFFCE1] text-xs">Disparo WhatsApp</h4>
                  <p className="text-[11px] text-[#BBBAA6] mt-1 leading-relaxed">
                    Pronto para Evolution API, Z-API e Botconversa com Spintax anti-bloqueio.
                  </p>
                </div>
              </button>

              {/* Card 3: CRM B2B */}
              <button
                type="button"
                onClick={() => setSelectedFormat('CRM_B2B')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedFormat === 'CRM_B2B'
                    ? 'bg-[#0E100F] border-indigo-500 shadow-sm ring-1 ring-indigo-500/30'
                    : 'bg-[#141716] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                    <Building2 className="w-5 h-5" />
                  </div>
                  {selectedFormat === 'CRM_B2B' && <Check className="w-4 h-4 text-indigo-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-[#FFFCE1] text-xs">CRMs B2B (.CSV)</h4>
                  <p className="text-[11px] text-[#BBBAA6] mt-1 leading-relaxed">
                    Campos universais para HubSpot, Pipedrive e RD Station CRM.
                  </p>
                </div>
              </button>

              {/* Card 4: JSON Automation */}
              <button
                type="button"
                onClick={() => setSelectedFormat('JSON_AUTOMATION')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedFormat === 'JSON_AUTOMATION'
                    ? 'bg-[#0E100F] border-amber-500 shadow-sm ring-1 ring-amber-500/30'
                    : 'bg-[#141716] border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25">
                    <Code2 className="w-5 h-5" />
                  </div>
                  {selectedFormat === 'JSON_AUTOMATION' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <div>
                  <h4 className="font-bold text-[#FFFCE1] text-xs">JSON Automações</h4>
                  <p className="text-[11px] text-[#BBBAA6] mt-1 leading-relaxed">
                    Payload estruturado completo para workflows n8n, Make e Zapier.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Filters Row */}
          <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#BBBAA6] font-mono uppercase">
              <Filter className="w-3.5 h-3.5 text-[#0AE448]" />
              <span>2. Filtrar Segmento de Leads:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-[#BBBAA6] block mb-1 font-medium">Status no Funil CRM:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] focus:border-[#0AE448] focus:outline-none"
                >
                  <option value="TODOS">Todos os Status ({leads.length})</option>
                  <option value="NOVO_LEAD">Somente Novos Leads</option>
                  <option value="CONTATADO">Somente Contatados</option>
                  <option value="DOSSIE_ENVIADO">Somente Dossiê Enviado</option>
                  <option value="REUNIAO_AGENDADA">Somente Reunião Agendada</option>
                  <option value="FECHADO">Somente Fechados</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-[#BBBAA6] block mb-1 font-medium">Nicho de Mercado:</label>
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] focus:border-[#0AE448] focus:outline-none"
                >
                  <option value="TODOS">Todos os Nichos</option>
                  {uniqueNiches.map(niche => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs text-[#FFFCE1] font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyMetaPixel}
                    onChange={(e) => setOnlyMetaPixel(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0AE448] focus:ring-[#0AE448] border-white/10 accent-[#0AE448]"
                  />
                  <span>Somente com Meta Pixel Ativo</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live Preview Sample */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#BBBAA6] uppercase font-mono tracking-wider block">
              3. Prévia das Primeiras Linhas Formatadas:
            </span>
            <div className="border border-white/10 rounded-2xl overflow-x-auto bg-[#141716] text-xs">
              <table className="w-full text-left border-collapse font-mono text-[11px]">
                <thead>
                  <tr className="bg-[#191C1B] border-b border-white/10 text-[#BBBAA6] font-bold uppercase text-[10px]">
                    <th className="p-2.5">Marca</th>
                    <th className="p-2.5">Telefone Normalizado</th>
                    <th className="p-2.5">SKU Rompido</th>
                    <th className="p-2.5">Desperdício Estimado</th>
                    <th className="p-2.5">Amostra do Pitch (Spintax)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-[#141716]">
                  {filteredLeads.slice(0, 3).map((lead, idx) => (
                    <tr key={lead.id} className="hover:bg-white/5 text-[#FFFCE1]">
                      <td className="p-2.5 font-bold text-[#FFFCE1]">{lead.brandName}</td>
                      <td className="p-2.5 text-[#00BAE2]">{normalizePhoneForWhatsApp(lead.contactTargetPhone)}</td>
                      <td className="p-2.5 text-[#BBBAA6]">{lead.primaryBrokenSku.productTitle.substring(0, 26)}...</td>
                      <td className="p-2.5 text-[#0AE448] font-bold">R$ {lead.totalMonthlyWasteEstimated.toLocaleString('pt-BR')}</td>
                      <td className="p-2.5 text-[#BBBAA6] italic max-w-xs truncate">{generateSpintaxPitch(lead, idx)}</td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-[#BBBAA6] font-sans">
                        Nenhum lead corresponde aos filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#0E100F] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-[#BBBAA6] font-mono">
            {exportedSuccess ? (
              <span className="text-[#0AE448] font-bold flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4" />
                Arquivo gerado e download iniciado com sucesso!
              </span>
            ) : (
              <span>Compatível com Z-API, Evolution, Botconversa, Excel e HubSpot ✓</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Fechar
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting || filteredLeads.length === 0}
              className="px-6 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 disabled:opacity-50 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-[#0AE448]/20 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950" />
              <span>Baixar Arquivo ({filteredLeads.length} Leads)</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
