import React, { useState } from 'react';
import { 
  Rocket, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  Filter, 
  X, 
  TrendingUp, 
  ExternalLink,
  Users,
  Play
} from 'lucide-react';
import { 
  getVerifiedOutboundPilotLeads, 
  simulateOutboundPilotCampaign, 
  type OutboundTargetLead,
  type OutboundCampaignReport
} from '../../services/outbound/outboundCampaignEngine';

interface OutboundCampaignManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OutboundCampaignManagerModal: React.FC<OutboundCampaignManagerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedTier, setSelectedTier] = useState<'ALL' | 'TIER_1_HOT' | 'TIER_2_WARM' | 'TIER_3_COLD'>('ALL');
  const [campaignReport, setCampaignReport] = useState<OutboundCampaignReport | null>(null);

  if (!isOpen) return null;

  const leads = getVerifiedOutboundPilotLeads();
  const filteredLeads = selectedTier === 'ALL' 
    ? leads 
    : leads.filter(l => l.tier === selectedTier);

  const totalWaste = leads.reduce((sum, l) => sum + l.monthlyWasteBRL, 0);

  const handleRunSimulation = () => {
    const report = simulateOutboundPilotCampaign();
    setCampaignReport(report);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20">
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Campanha Piloto Outbound em Massa (Opção 3)</h3>
                <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-semibold text-purple-400 border border-purple-500/20">
                  40 Lojas Auditadas • Anti-Ban Jitter
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cadência humanizada com delays de 45s a 120s e aquecimento progressivo de chip
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-slate-950/40 border-b border-slate-800 text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Lojas no Radar</span>
            <strong className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
              <Users className="h-4 w-4 text-purple-400" />
              {leads.length} Marcas Reais
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Desperdício Total Mapeado</span>
            <strong className="text-sm font-bold text-red-400 flex items-center gap-1.5 mt-0.5">
              <TrendingUp className="h-4 w-4" />
              R$ {Math.round(totalWaste).toLocaleString('pt-BR')}/mês
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Cadência Anti-Ban</span>
            <strong className="text-sm font-bold text-amber-400 flex items-center gap-1.5 mt-0.5">
              <Clock className="h-4 w-4" />
              45s a 120s de Jitter
            </strong>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Proteção Operacional</span>
            <strong className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="h-4 w-4" />
              Aquecimento 25/dia
            </strong>
          </div>
        </div>

        {/* Funnel Results Bar (When Simulated) */}
        {campaignReport && (
          <div className="p-4 bg-purple-950/20 border-b border-purple-500/30 text-xs space-y-2">
            <div className="flex justify-between items-center text-purple-300 font-bold">
              <span>🎯 Funil de Conversão Projetado ({campaignReport.totalLeads} Disparos)</span>
              <span className="text-emerald-400 font-mono text-[11px]">
                Novo ARR: +R$ {campaignReport.funnelMetrics.projectedNewArrBRL.toLocaleString('pt-BR')} (3 Clientes Fechados)
              </span>
            </div>
            <div className="grid grid-cols-6 gap-2 text-center">
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Enviados</span>
                <strong className="text-white text-xs">{campaignReport.funnelMetrics.dispatched}</strong>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Entregues</span>
                <strong className="text-cyan-400 text-xs">{campaignReport.funnelMetrics.delivered} (97%)</strong>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Lidos</span>
                <strong className="text-blue-400 text-xs">{campaignReport.funnelMetrics.readReceipts} (85%)</strong>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Respostas</span>
                <strong className="text-amber-400 text-xs">{campaignReport.funnelMetrics.responded} (35%)</strong>
              </div>
              <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Reuniões</span>
                <strong className="text-purple-400 text-xs">{campaignReport.funnelMetrics.meetingBooked} (15%)</strong>
              </div>
              <div className="bg-emerald-950/40 p-2 rounded border border-emerald-500/40">
                <span className="text-[10px] text-emerald-300 block">Assinantes Stripe</span>
                <strong className="text-emerald-400 text-xs">{campaignReport.funnelMetrics.convertedStripeSubscribers} Clientes</strong>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Actions Bar */}
        <div className="flex flex-wrap justify-between items-center p-4 border-b border-slate-800 bg-slate-950/30 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <span className="text-slate-400 font-semibold">Filtrar por Tier:</span>
            <div className="flex gap-1">
              {(['ALL', 'TIER_1_HOT', 'TIER_2_WARM', 'TIER_3_COLD'] as const).map(tier => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all ${
                    selectedTier === tier
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tier === 'ALL' ? 'Todos (40)' : tier === 'TIER_1_HOT' ? '🔥 Tier 1 Hot' : tier === 'TIER_2_WARM' ? '⚡ Tier 2 Warm' : '❄️ Tier 3 Cold'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRunSimulation}
            className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs shadow-lg shadow-purple-600/20 transition-all"
          >
            <Play className="h-3.5 w-3.5" />
            Simular Cadência Anti-Ban & Funil
          </button>
        </div>

        {/* Leads Table */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Loja / Marca</th>
                    <th className="py-2.5 px-3 font-semibold">Nicho</th>
                    <th className="py-2.5 px-3 font-semibold">Tier</th>
                    <th className="py-2.5 px-3 font-semibold">Tamanhos Rompidos</th>
                    <th className="py-2.5 px-3 font-semibold">Perda Estimada</th>
                    <th className="py-2.5 px-3 font-semibold">Contato / WhatsApp</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredLeads.slice(0, 20).map((lead: OutboundTargetLead) => (
                    <tr key={lead.id} className="hover:bg-slate-900/40">
                      <td className="py-2.5 px-3 font-bold text-white">
                        <div>{lead.brandName}</div>
                        <span className="text-[10px] text-slate-500 font-mono">{lead.storeUrl.replace('https://', '')}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{lead.niche}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lead.tier === 'TIER_1_HOT' 
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : lead.tier === 'TIER_2_WARM'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {lead.tier}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex gap-1">
                          {lead.brokenSizes.map(s => (
                            <span key={s} className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-red-600/20 text-red-400 border border-red-600/40">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-red-400">
                        {lead.monthlyWasteFormatted}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-200">{lead.contactPerson}</div>
                        <div className="text-[10px] font-mono text-slate-400">{lead.whatsapp}</div>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <a
                          href={`https://wa.me/${lead.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] font-semibold text-emerald-400 border border-slate-700 transition-colors"
                        >
                          <MessageSquare className="h-3 w-3" />
                          <span>wa.me</span>
                          <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {filteredLeads.length > 20 && (
            <p className="text-[11px] text-slate-500 mt-2 text-center">
              Mostrando os primeiros 20 de {filteredLeads.length} leads do lote.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-3 flex justify-between items-center text-xs text-slate-400">
          <span>Modo de Operação: <strong>Sandbox de Campanha 100% Protegido</strong></span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
