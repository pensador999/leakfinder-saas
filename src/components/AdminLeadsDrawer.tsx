import React, { useState, useEffect } from 'react';
import { 
  Users, 
  X, 
  MessageCircle, 
  Trash2,
  Download,
  Search,
  Plus,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import {
  getStoredLeads,
  saveLead,
  updateLeadStatus,
  deleteStoredLead,
  CapturedLead,
  generateWhatsAppLink
} from '../services/whatsappLeadService';
import { AgentDiagnosticResult } from '../types';
import { isCatalogProductBroken } from '../services/siteInspector';

interface AdminLeadsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentDiagnostic?: AgentDiagnosticResult | null;
  onOpenWhatsAppCapture?: () => void;
  onOpenBatchAuditor?: () => void;
}

export const AdminLeadsDrawer: React.FC<AdminLeadsDrawerProps> = ({
  isOpen,
  onClose,
  currentDiagnostic,
  onOpenWhatsAppCapture,
  onOpenBatchAuditor
}) => {
  const [leads, setLeads] = useState<CapturedLead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CapturedLead['status']>('ALL');
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStoreUrl, setNewStoreUrl] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLeads(getStoredLeads());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClearLeads = () => {
    if (window.confirm('Tem certeza que deseja limpar a lista de leads capturados localmente?')) {
      localStorage.removeItem('ADSHIELD_CAPTURED_LEADS');
      localStorage.removeItem('LEAKFINDER_CAPTURED_LEADS');
      localStorage.removeItem('adshield_custom_prospect_leads');
      setLeads([]);
    }
  };

  const handleSaveCurrentAuditedStore = () => {
    if (!currentDiagnostic) return;
    const { realSiteData, growthScore } = currentDiagnostic;
    const brokenIssue = (realSiteData.catalogAudit?.issues || []).find(isCatalogProductBroken);
    const loss = Math.round(realSiteData.catalogAudit?.monthlyLossEstimateBRL ?? (currentDiagnostic.estimatedRevenueLiftMin * 45));

    saveLead({
      merchantName: `Decisor (${realSiteData.brandName})`,
      whatsappNumber: '',
      storeUrl: realSiteData.url || `https://${realSiteData.domain}`,
      brandName: realSiteData.brandName,
      estimatedLossRevenue: loss,
      growthScore,
      source: 'MANUAL',
      topBrokenSku: brokenIssue ? `${brokenIssue.productTitle} (Falta: ${brokenIssue.missingSizes.join(', ')})` : undefined
    });
    setLeads(getStoredLeads());
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreUrl.trim()) return;
    const cleanDomain = newStoreUrl.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const brand = cleanDomain.split('.')[0].toUpperCase();

    saveLead({
      merchantName: newName.trim() || `Gestor (${brand})`,
      whatsappNumber: newPhone.trim(),
      storeUrl: `https://${cleanDomain}`,
      brandName: brand,
      estimatedLossRevenue: 8500,
      growthScore: 74,
      source: 'MANUAL'
    });
    setLeads(getStoredLeads());
    setNewName('');
    setNewPhone('');
    setNewStoreUrl('');
    setIsAddingManual(false);
  };

  const handleStatusChange = (leadId: string, status: CapturedLead['status']) => {
    const updated = updateLeadStatus(leadId, status);
    setLeads(updated);
  };

  const handleDeleteLead = (leadId: string) => {
    const updated = deleteStoredLead(leadId);
    setLeads(updated);
  };

  const handleCopyPitch = (lead: CapturedLead) => {
    const pitch = lead.customPitch ||
      `Olá ${lead.merchantName}! Analisamos a loja *${lead.brandName}* (${lead.storeUrl}) no AdShield (Score: ${lead.growthScore}/100) e identificamos ~R$ ${lead.estimatedLossRevenue.toLocaleString('pt-BR')}/mês em risco de conversão e ruptura de grade${lead.topBrokenSku ? ` (${lead.topBrokenSku})` : ''}. Posso te enviar o dossiê completo por aqui?`;
    navigator.clipboard.writeText(pitch);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    if (leads.length === 0) return;
    const headers = 'ID,Nome,WhatsApp,Loja,Marca,PerdaEstimada,Score,Origem,SKU_Critico,Data,Status\n';
    const rows = leads.map(l => 
      `"${l.id}","${l.merchantName}","${l.whatsappNumber}","${l.storeUrl}","${l.brandName}","${l.estimatedLossRevenue}","${l.growthScore}","${l.source || 'WHATSAPP_FUNNEL'}","${(l.topBrokenSku || '').replace(/"/g, '""')}","${l.capturedAt}","${l.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_adshield_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.storeUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.whatsappNumber.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPipelineBRL = leads.reduce((sum, l) => sum + (l.estimatedLossRevenue || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-5xl bg-[#101211] rounded-3xl shadow-2xl overflow-hidden my-8 border border-white/10 flex flex-col max-h-[90vh] text-[#FFFCE1]">
        
        {/* Header */}
        <div className="p-6 bg-[#0E100F] text-[#FFFCE1] flex flex-wrap items-center justify-between gap-4 shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/15 text-[#0AE448] rounded-2xl border border-[#0AE448]/30">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#FFFCE1]">CRM Local-First & Funil de WhatsApp</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30 rounded-md">
                  {leads.length} Lojistas no Pipeline
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6]">
                Unifica leads do botão WhatsApp, Scanner em Lote e prospecção ativa • Sangria mapeada: <strong className="text-rose-400 font-mono">R$ {totalPipelineBRL.toLocaleString('pt-BR')}/mês</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {currentDiagnostic && (
              <button
                onClick={handleSaveCurrentAuditedStore}
                className="px-3 py-1.5 bg-[#0AE448]/15 hover:bg-[#0AE448]/25 text-[#0AE448] border border-[#0AE448]/30 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Salvar a loja auditada agora diretamente neste CRM"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Salvar {currentDiagnostic.realSiteData.brandName} no CRM</span>
              </button>
            )}

            <button
              onClick={() => setIsAddingManual(!isAddingManual)}
              className="px-3 py-1.5 bg-[#141716] hover:bg-[#191C1B] text-[#FFFCE1] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            >
              <Plus className="w-3.5 h-3.5 text-[#00BAE2]" />
              <span>Novo Lead</span>
            </button>

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
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer ml-1 hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Add Manual Lead Drawer */}
        {isAddingManual && (
          <form onSubmit={handleManualSubmit} className="p-4 bg-[#141716] border-b border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end text-xs">
            <div>
              <label className="block font-bold text-[#BBBAA6] mb-1">URL da Loja *</label>
              <input
                type="text"
                required
                value={newStoreUrl}
                onChange={(e) => setNewStoreUrl(e.target.value)}
                placeholder="ex: minimalclub.com.br"
                className="w-full px-3 py-2 bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] font-mono text-xs focus:outline-none focus:border-[#0AE448]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#BBBAA6] mb-1">Nome do Lojista / Decisor</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Lucas (Head E-commerce)"
                className="w-full px-3 py-2 bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] text-xs focus:outline-none focus:border-[#0AE448]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#BBBAA6] mb-1">WhatsApp (com DDD)</label>
              <input
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="5511999999999"
                className="w-full px-3 py-2 bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] font-mono text-xs focus:outline-none focus:border-[#0AE448]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs cursor-pointer"
              >
                Adicionar ao Pipeline
              </button>
            </div>
          </form>
        )}

        {/* Filter Bar */}
        <div className="p-4 bg-[#141716] border-b border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-[260px]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome, marca, URL ou WhatsApp..."
                className="w-full pl-9 pr-3 py-2 bg-[#101211] border border-white/10 rounded-xl text-xs text-[#FFFCE1] placeholder-slate-500 focus:outline-none focus:border-[#0AE448] font-medium"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 bg-[#101211] border border-white/10 rounded-xl text-xs font-bold text-[#FFFCE1] focus:outline-none focus:border-[#0AE448]"
            >
              <option value="ALL">Todos os Status ({leads.length})</option>
              <option value="NOVO">Novos</option>
              <option value="CONTATADO">Contatados</option>
              <option value="REUNIAO_AGENDADA">Reunião Agendada</option>
              <option value="CLIENTE_FECHADO">Clientes Fechados</option>
            </select>
          </div>

          {leads.length > 0 && (
            <button
              onClick={handleClearLeads}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar CRM</span>
            </button>
          )}
        </div>

        {/* Leads Table */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#101211]">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-[#FFFCE1]">Seu Funil Local-First está pronto para receber leads</h4>
                <p className="text-xs text-[#BBBAA6] max-w-lg mx-auto">
                  Os contatos aparecem aqui automaticamente quando você: (1) envia um Raio-X pelo botão <strong>WhatsApp</strong> no topo, (2) salva lojas na <strong>Máquina de Prospecção em Lote</strong> ou (3) clica abaixo para salvar a loja atual.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                {currentDiagnostic && (
                  <button
                    onClick={handleSaveCurrentAuditedStore}
                    className="px-4 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#0AE448]/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Salvar Loja Atual ({currentDiagnostic.realSiteData.brandName}) no CRM</span>
                  </button>
                )}
                {onOpenWhatsAppCapture && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWhatsAppCapture();
                    }}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#0AE448]" />
                    <span>Testar Disparo no Funil WhatsApp</span>
                  </button>
                )}
                {onOpenBatchAuditor && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBatchAuditor();
                    }}
                    className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-[#00BAE2] border border-[#00BAE2]/30 font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-4 h-4" />
                    <span>Abrir Scanner em Lote (20 Lojas)</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#141716] border-b border-white/10 text-[#BBBAA6] font-bold">
                    <th className="p-3">Lojista / Marca & SKU Crítico</th>
                    <th className="p-3">WhatsApp</th>
                    <th className="p-3">Sangria Est.</th>
                    <th className="p-3">Score</th>
                    <th className="p-3">Estágio do Funil</th>
                    <th className="p-3 text-right">Ações de Fechamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredLeads.map((lead) => {
                    const pitchText = lead.customPitch ||
                      `Olá ${lead.merchantName}! Analisamos a loja *${lead.brandName}* (${lead.storeUrl}) no AdShield (Score: ${lead.growthScore}/100) e identificamos ~R$ ${lead.estimatedLossRevenue.toLocaleString('pt-BR')}/mês em risco de conversão e ruptura de grade${lead.topBrokenSku ? ` (${lead.topBrokenSku})` : ''}. Posso te enviar o dossiê completo por aqui?`;
                    const waLink = lead.whatsappNumber
                      ? generateWhatsAppLink(lead.whatsappNumber, pitchText)
                      : `https://api.whatsapp.com/send?text=${encodeURIComponent(pitchText)}`;

                    return (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-sans">
                          <div className="flex items-center gap-1.5">
                            <p className="font-bold text-[#FFFCE1]">{lead.brandName}</p>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/5 text-[#BBBAA6] border border-white/10 font-mono">
                              {lead.source === 'BATCH_AUDITOR' ? 'Lote' : lead.source === 'MANUAL' ? 'Manual' : 'Funil WA'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#BBBAA6] truncate max-w-xs">{lead.merchantName} • {lead.storeUrl}</p>
                          {lead.topBrokenSku && (
                            <p className="text-[10px] text-amber-400 font-semibold mt-0.5 truncate max-w-xs" title={lead.topBrokenSku}>
                              🎯 {lead.topBrokenSku}
                            </p>
                          )}
                        </td>
                        <td className="p-3 font-bold text-white">{lead.whatsappNumber || '—'}</td>
                        <td className="p-3 font-bold text-rose-400">
                          R$ {lead.estimatedLossRevenue.toLocaleString('pt-BR')}/mês
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-white/10 rounded-md font-bold text-[#FFFCE1] border border-white/10">
                            {lead.growthScore}/100
                          </span>
                        </td>
                        <td className="p-3 font-sans">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as CapturedLead['status'])}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
                              lead.status === 'CLIENTE_FECHADO'
                                ? 'bg-[#0AE448]/15 text-[#0AE448] border-[#0AE448]/30'
                                : lead.status === 'REUNIAO_AGENDADA'
                                  ? 'bg-[#00BAE2]/15 text-[#00BAE2] border-[#00BAE2]/30'
                                  : lead.status === 'CONTATADO'
                                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                    : 'bg-white/5 text-[#FFFCE1] border-white/10'
                            }`}
                          >
                            <option value="NOVO" className="bg-[#101211] text-[#FFFCE1]">Novo Lead</option>
                            <option value="CONTATADO" className="bg-[#101211] text-amber-300">Contatado</option>
                            <option value="REUNIAO_AGENDADA" className="bg-[#101211] text-[#00BAE2]">Reunião Agendada</option>
                            <option value="CLIENTE_FECHADO" className="bg-[#101211] text-[#0AE448]">Cliente Fechado</option>
                          </select>
                        </td>
                        <td className="p-3 text-right font-sans">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleCopyPitch(lead)}
                              className="p-1.5 bg-white/5 hover:bg-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] border border-white/10 rounded-xl transition-all cursor-pointer"
                              title="Copiar Pitch de WhatsApp"
                            >
                              {copiedId === lead.id ? <Check className="w-3.5 h-3.5 text-[#0AE448]" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                if (lead.status === 'NOVO') {
                                  handleStatusChange(lead.id, 'CONTATADO');
                                }
                              }}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>Abordar</span>
                            </a>
                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
                              title="Excluir lead"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
