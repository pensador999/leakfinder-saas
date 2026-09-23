import React, { useState, useEffect } from 'react';
import { 
  Users, 
  X, 
  MessageCircle, 
  Phone, 
  ExternalLink, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trash2,
  Download,
  Search,
  Store
} from 'lucide-react';
import { getStoredLeads, CapturedLead } from '../services/whatsappLeadService';

interface AdminLeadsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminLeadsDrawer: React.FC<AdminLeadsDrawerProps> = ({ isOpen, onClose }) => {
  const [leads, setLeads] = useState<CapturedLead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLeads(getStoredLeads());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearLeads = () => {
    if (window.confirm('Tem certeza que deseja limpar a lista de leads capturados localmente?')) {
      localStorage.removeItem('LEAKFINDER_CAPTURED_LEADS');
      setLeads([]);
    }
  };

  const handleExportCsv = () => {
    if (leads.length === 0) return;
    const headers = 'ID,Nome,WhatsApp,Loja,Marca,PerdaEstimada,Score,Data,Status\n';
    const rows = leads.map(l => 
      `"${l.id}","${l.merchantName}","${l.whatsappNumber}","${l.storeUrl}","${l.brandName}","${l.estimatedLossRevenue}","${l.growthScore}","${l.capturedAt}","${l.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_leakfinder_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => 
    l.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.whatsappNumber.includes(searchTerm)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-4xl bg-[#101211] rounded-3xl shadow-2xl overflow-hidden my-8 border border-white/10 flex flex-col max-h-[90vh] text-[#FFFCE1]">
        
        {/* Header */}
        <div className="p-6 bg-[#0E100F] text-[#FFFCE1] flex items-center justify-between shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/20 text-[#0AE448] rounded-xl border border-[#0AE448]/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#FFFCE1]">Leads Capturados no Funil de WhatsApp</h3>
              <p className="text-xs text-[#BBBAA6]">
                {leads.length} lojistas solicitaram o Raio-X Financeiro
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {leads.length > 0 && (
              <button
                onClick={handleExportCsv}
                className="px-3 py-1.5 bg-[#141716] hover:bg-[#191C1B] text-[#FFFCE1] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
              >
                <Download className="w-3.5 h-3.5 text-[#0AE448]" />
                <span>Exportar CSV</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-2 hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-[#141716] border-b border-white/10 flex items-center justify-between gap-4 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, marca ou WhatsApp..."
              className="w-full pl-9 pr-3 py-2 bg-[#101211] border border-white/10 rounded-xl text-xs text-[#FFFCE1] placeholder-slate-500 focus:outline-none focus:border-[#0AE448] font-medium"
            />
          </div>

          {leads.length > 0 && (
            <button
              onClick={handleClearLeads}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Lista</span>
            </button>
          )}
        </div>

        {/* Leads Table */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#101211]">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="font-bold text-sm text-[#FFFCE1]">Nenhum lead capturado ainda</h4>
              <p className="text-xs text-[#BBBAA6] max-w-md mx-auto">
                Quando os visitantes da sua landing page clicarem em "Receber Raio-X no WhatsApp", os contatos e os dados de vazamento financeiro aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#141716] border-b border-white/10 text-[#BBBAA6] font-bold">
                    <th className="p-3">Lojista / Marca</th>
                    <th className="p-3">WhatsApp</th>
                    <th className="p-3">Perda Estimada</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Data</th>
                    <th className="p-3 text-right">Ação Direta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredLeads.map((lead) => {
                    const cleanPhone = lead.whatsappNumber.replace(/\D/g, '');
                    const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
                    const waLink = `https://api.whatsapp.com/send?phone=${phoneWithCountry}`;

                    return (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-sans">
                          <p className="font-bold text-[#FFFCE1]">{lead.merchantName}</p>
                          <p className="text-[11px] text-[#BBBAA6] truncate max-w-xs">{lead.brandName} ({lead.storeUrl})</p>
                        </td>
                        <td className="p-3 font-bold text-white">{lead.whatsappNumber}</td>
                        <td className="p-3 font-bold text-rose-400">
                          R$ {lead.estimatedLossRevenue.toLocaleString('pt-BR')}/mês
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-white/10 rounded-md font-bold text-[#FFFCE1] border border-white/10">
                            {lead.growthScore}/100
                          </span>
                        </td>
                        <td className="p-3 font-sans text-[11px] text-[#BBBAA6]">{lead.capturedAt}</td>
                        <td className="p-3 text-right font-sans">
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Chamar no Whats</span>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
