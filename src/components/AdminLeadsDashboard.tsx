import React, { useEffect, useState } from 'react';
import { Users, Mail, Globe, Clock, MessageCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getWhiteLabelConfig } from '../services/whiteLabelService';

interface Lead {
  id: string;
  email: string;
  analyzed_url: string;
  created_at: string;
  white_label_agency: string;
}

interface AdminLeadsDashboardProps {
  onClose: () => void;
}

export const AdminLeadsDashboard: React.FC<AdminLeadsDashboardProps> = ({ onClose }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const whiteLabel = getWhiteLabelConfig();

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erro ao buscar leads:', error.message);
    } else {
      setLeads(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const openWhatsApp = (url: string) => {
    const text = encodeURIComponent(`Olá! Vi que você analisou a URL ${url} no nosso sistema. Sou da agência ${whiteLabel.agencyName} e o relatório apontou alguns vazamentos críticos de receita. Posso te ajudar a corrigir?`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-[#0E100F]/80 backdrop-blur-md z-50 flex justify-end">
      <div className="w-full max-w-4xl bg-[#101211] border-l border-white/10 h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden text-[#FFFCE1]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#141716]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#FFFCE1] flex items-center gap-2">
                Painel de Leads <ShieldCheck className="w-4 h-4 text-[#0AE448]" />
              </h2>
              <p className="text-xs text-[#BBBAA6] font-mono">Contatos que solicitaram auditoria (Lead Gating)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchLeads} 
              className="p-2 text-[#BBBAA6] hover:text-[#0AE448] hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              title="Atualizar Tabela"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-[#BBBAA6] hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-[#0E100F] p-6">
          <div className="bg-[#101211] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#141716] border-b border-white/10 uppercase tracking-wider font-mono text-[10px] text-[#BBBAA6]">
                  <th className="px-6 py-4">Lead / E-mail</th>
                  <th className="px-6 py-4">URL Analisada</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ação Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[#BBBAA6] font-mono">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0AE448]" />
                      Carregando leads do Supabase...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-[#BBBAA6] font-mono">
                      Nenhum lead capturado ainda. Compartilhe o link do seu site para atrair clientes.
                    </td>
                  </tr>
                ) : (
                  leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[#BBBAA6] group-hover:bg-[#0AE448]/20 group-hover:text-[#0AE448] transition-colors border border-white/5">
                            <Mail className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-[#FFFCE1] font-mono">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[#00BAE2]">
                          <Globe className="w-4 h-4 text-[#BBBAA6]" />
                          <a href={lead.analyzed_url.startsWith('http') ? lead.analyzed_url : `https://${lead.analyzed_url}`} target="_blank" rel="noreferrer" className="hover:underline font-mono">
                            {lead.analyzed_url}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-[#BBBAA6] font-mono">
                          <Clock className="w-4 h-4 text-[#BBBAA6]/60" />
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')} às {new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openWhatsApp(lead.analyzed_url)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-[#0AE448]/20"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          Prospectar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
