import React, { useEffect, useState } from 'react';
import { Users, Mail, Globe, Clock, MessageCircle, RefreshCw, X, ShieldCheck } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
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
    // Apenas envia uma msg genérica se não temos telefone capturado (apenas email)
    // O dono da agência prospectará via e-mail ou via cold call se buscar o número.
    // Como bônus, deixamos a estrutura de WhatsApp pronta.
    const text = encodeURIComponent(`Olá! Vi que você analisou a URL ${url} no nosso sistema. Sou da agência ${whiteLabel.agencyName} e o relatório apontou alguns vazamentos críticos de receita. Posso te ajudar a corrigir?`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Painel de Leads <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </h2>
              <p className="text-xs text-slate-500 font-medium">Contatos que solicitaram auditoria (Lead Gating)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchLeads} 
              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Atualizar Tabela"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-slate-50/50 p-6">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-semibold text-slate-600">
                  <th className="px-6 py-4">Lead / E-mail</th>
                  <th className="px-6 py-4">URL Analisada</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-right">Ação Rápida</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Carregando leads do Supabase...
                    </td>
                  </tr>
                ) : leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Nenhum lead capturado ainda. Compartilhe o link do seu site para atrair clientes.
                    </td>
                  </tr>
                ) : (
                  leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                            <Mail className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-slate-800">{lead.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <a href={lead.analyzed_url.startsWith('http') ? lead.analyzed_url : `https://${lead.analyzed_url}`} target="_blank" rel="noreferrer" className="hover:text-blue-600 hover:underline">
                            {lead.analyzed_url}
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Clock className="w-4 h-4" />
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')} às {new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute:'2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openWhatsApp(lead.analyzed_url)}
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-bold transition-colors"
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
