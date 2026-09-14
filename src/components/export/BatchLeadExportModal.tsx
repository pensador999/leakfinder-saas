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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[80] flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[92vh] border border-slate-200 animate-fadeIn">
        
        {/* Header Executive Deep Obsidian */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-600/30">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Exportador de Leads em Lote & Disparo em Massa</h3>
                <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-[10px] font-mono font-bold">
                  Multi-Format Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exporte listas de lojas com anúncios ativos no Meta Ads para CRMs e disparadores de WhatsApp sem risco de bloqueio.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Top KPI Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Leads Selecionados</span>
              <div className="text-2xl font-black text-white font-mono mt-1">
                {filteredLeads.length} <span className="text-xs text-slate-400 font-normal">de {leads.length} lojas</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold block">Sangria Total em Mídia</span>
              <div className="text-2xl font-black text-emerald-700 font-mono mt-1">
                R$ {totalRecoverable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                <span className="text-xs text-emerald-600 font-normal">/mês</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] font-mono uppercase text-blue-800 font-bold block">Anúncios Meta sob Radar</span>
              <div className="text-2xl font-black text-blue-700 font-mono mt-1">
                ~{totalAds} <span className="text-xs text-blue-600 font-normal">campanhas ativas</span>
              </div>
            </div>
          </div>

          {/* Format Selector Cards */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider block">
              1. Selecione o Destino da Exportação:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              
              {/* Card 1: Excel Brasil */}
              <button
                type="button"
                onClick={() => setSelectedFormat('EXCEL_BR')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedFormat === 'EXCEL_BR'
                    ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  {selectedFormat === 'EXCEL_BR' && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Excel Brasil (.CSV)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Padrão brasileiro com separador <code>;</code> e UTF-8 com BOM. Sem acentos corrompidos.
                  </p>
                </div>
              </button>

              {/* Card 2: WhatsApp Bulk */}
              <button
                type="button"
                onClick={() => setSelectedFormat('WHATSAPP_BULK')}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  selectedFormat === 'WHATSAPP_BULK'
                    ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  {selectedFormat === 'WHATSAPP_BULK' && <Check className="w-4 h-4 text-blue-600" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">Disparo WhatsApp</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
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
                    ? 'bg-indigo-50/70 border-indigo-500 shadow-sm ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-indigo-100 text-indigo-800">
                    <Building2 className="w-5 h-5" />
                  </div>
                  {selectedFormat === 'CRM_B2B' && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">CRMs B2B (.CSV)</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
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
                    ? 'bg-amber-50/70 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                    <Code2 className="w-5 h-5" />
                  </div>
                  {selectedFormat === 'JSON_AUTOMATION' && <Check className="w-4 h-4 text-amber-600" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">JSON Automações</h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Payload estruturado completo para workflows n8n, Make e Zapier.
                  </p>
                </div>
              </button>

            </div>
          </div>

          {/* Filters Row */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 font-mono uppercase">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>2. Filtrar Segmento de Leads:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-500 block mb-1 font-medium">Status no Funil CRM:</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
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
                <label className="text-[11px] text-slate-500 block mb-1 font-medium">Nicho de Mercado:</label>
                <select
                  value={selectedNiche}
                  onChange={(e) => setSelectedNiche(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono text-slate-800 focus:outline-none"
                >
                  <option value="TODOS">Todos os Nichos</option>
                  {uniqueNiches.map(niche => (
                    <option key={niche} value={niche}>{niche}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 text-xs text-slate-700 font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyMetaPixel}
                    onChange={(e) => setOnlyMetaPixel(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Somente com Meta Pixel Ativo</span>
                </label>
              </div>
            </div>
          </div>

          {/* Live Preview Sample */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider block">
              3. Prévia das Primeiras Linhas Formatadas:
            </span>
            <div className="border border-slate-200 rounded-2xl overflow-x-auto bg-slate-50 text-xs">
              <table className="w-full text-left border-collapse font-mono text-[11px]">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <th className="p-2.5">Marca</th>
                    <th className="p-2.5">Telefone Normalizado</th>
                    <th className="p-2.5">SKU Rompido</th>
                    <th className="p-2.5">Desperdício Estimado</th>
                    <th className="p-2.5">Amostra do Pitch (Spintax)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredLeads.slice(0, 3).map((lead, idx) => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">{lead.brandName}</td>
                      <td className="p-2.5 text-blue-600">{normalizePhoneForWhatsApp(lead.contactTargetPhone)}</td>
                      <td className="p-2.5 text-slate-700">{lead.primaryBrokenSku.productTitle.substring(0, 26)}...</td>
                      <td className="p-2.5 text-emerald-600 font-bold">R$ {lead.totalMonthlyWasteEstimated.toLocaleString('pt-BR')}</td>
                      <td className="p-2.5 text-slate-500 italic max-w-xs truncate">{generateSpintaxPitch(lead, idx)}</td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-slate-400 font-sans">
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
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-500 font-mono">
            {exportedSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1.5 animate-fadeIn">
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
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Fechar
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting || filteredLeads.length === 0}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo ({filteredLeads.length} Leads)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
