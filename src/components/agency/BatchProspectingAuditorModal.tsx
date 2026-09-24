import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Play, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Flame, 
  DollarSign, 
  MessageSquare, 
  Download, 
  FileSpreadsheet, 
  Sparkles, 
  AlertTriangle,
  Building2,
  RefreshCw,
  Search,
  TrendingDown,
  Zap
} from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { 
  parseDomainListInput, 
  runBatchProspectingAudit, 
  BatchProspectingLead, 
  BatchAuditProgress 
} from '../../services/agency/batchAuditorService';
import { formatBRL } from '../../services/ai/storeFinancialGroundingEngine';

interface BatchProspectingAuditorModalProps {
  onClose: () => void;
  onOpenStoreDossier?: (domain: string) => void;
}

export const BatchProspectingAuditorModal: React.FC<BatchProspectingAuditorModalProps> = ({
  onClose,
  onOpenStoreDossier
}) => {
  const [rawInput, setRawInput] = useState(
    'brkmotors.com.br\nbrkagro.com.br\nlojavirtuallider.com.br\nmodasportfitness.com.br\ncalcadosbrasil.com.br'
  );
  const [agencyName, setAgencyName] = useState('Growth Performance Agency');
  const [isAuditing, setIsAuditing] = useState(false);
  const [progress, setProgress] = useState<BatchAuditProgress | null>(null);
  const [leads, setLeads] = useState<BatchProspectingLead[]>([]);
  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);
  const [copiedCsv, setCopiedCsv] = useState(false);

  const handleStartBatchAudit = async () => {
    const domains = parseDomainListInput(rawInput);
    if (domains.length === 0) {
      alert('Por favor, insira pelo menos 1 domínio válido.');
      return;
    }

    setIsAuditing(true);
    setLeads([]);
    setProgress({
      total: domains.length,
      completed: 0,
      currentDomain: domains[0],
      totalMonthlyWasteIdentifiedBRL: 0,
      highPriorityDealsCount: 0
    });

    try {
      const finalLeads = await runBatchProspectingAudit(
        domains,
        agencyName,
        (prog, currentLead) => {
          setProgress(prog);
          setLeads(prev => [currentLead, ...prev.filter(l => l.id !== currentLead.id)]);
        }
      );
      setLeads(finalLeads);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCopyPitch = (lead: BatchProspectingLead) => {
    navigator.clipboard.writeText(lead.whatsAppPitchScript);
    setCopiedLeadId(lead.id);
    setTimeout(() => setCopiedLeadId(null), 2500);
  };

  const handleExportCsv = () => {
    if (leads.length === 0) return;
    const headers = 'Marca,Dominio,Plataforma,Desperdicio_Mensal_BRL,SKUs_Rompidos,Prioridade,Pitch_WhatsApp\n';
    const rows = leads.map(l => 
      `"${l.brandName}","${l.domain}","${l.platform}","${l.monthlyAdWasteBRL}","${l.brokenSkusCount}","${l.dealPriority}","${l.whatsAppPitchScript.replace(/"/g, '""')}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AdShield_Prospecting_Leads_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[80] flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="w-full max-w-5xl bg-[#101211] rounded-3xl shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[92vh] border border-white/10 animate-fadeIn text-[#FFFCE1]">
        
        {/* Header */}
        <div className="p-5 bg-[#0E100F] border-b border-white/10 flex items-center justify-between text-[#FFFCE1] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/10 text-[#0AE448] rounded-xl border border-[#0AE448]/25">
              <Layers className="w-6 h-6 text-[#0AE448]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm tracking-tight text-[#FFFCE1]">Scanner em Lote para Prospecção de Agências</h3>
                <span className="px-2 py-0.5 bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30 rounded-full text-[10px] font-mono font-bold">
                  B2B Mass Auditor
                </span>
              </div>
              <p className="text-[11px] text-[#BBBAA6]">
                Audite até 50 e-commerces em 2 minutos e gere relatórios com scripts prontos para fechar contratos de tráfego.
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
          
          {/* Input Configuration Box */}
          <div className="p-5 rounded-2xl bg-[#141716] border border-white/10 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#BBBAA6] mb-1">Nome da sua Agência / Consultoria</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="Ex: Nexus Growth Media"
                  className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-bold text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:outline-none"
                />
              </div>

              <div className="flex items-end justify-between gap-2">
                <div className="text-xs text-[#BBBAA6]">
                  <span>Limite do lote: <strong className="text-[#FFFCE1]">até 50 lojas simultâneas</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => setRawInput('brkmotors.com.br\nbrkagro.com.br\nlojavirtuallider.com.br\nmodasportfitness.com.br\ncalcadosbrasil.com.br')}
                  className="text-xs text-[#0AE448] hover:underline font-bold cursor-pointer"
                >
                  Carregar Lojas de Exemplo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#BBBAA6] mb-1">
                Cole a lista de domínios ou URLs (uma por linha ou separadas por vírgula):
              </label>
              <textarea
                rows={3}
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="loja1.com.br&#10;loja2.com.br&#10;loja3.com.br"
                className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:outline-none"
              />
            </div>

            <button
              onClick={handleStartBatchAudit}
              disabled={isAuditing}
              className="w-full py-3.5 bg-[#0AE448] hover:bg-[#0AE448]/90 disabled:opacity-50 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0AE448]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isAuditing ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Auditando Lojas em Lote ({progress?.completed || 0}/{progress?.total || 0})...</span>
                </div>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Iniciar Varredura em Lote de {parseDomainListInput(rawInput).length} Lojas</span>
                </>
              )}
            </button>
          </div>

          {/* Progress Banner */}
          {progress && (
            <div className="p-4 rounded-2xl bg-[#0E100F] text-[#FFFCE1] border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                <span className="font-mono text-[#BBBAA6]">
                  Progresso: <strong className="text-[#FFFCE1]">{progress.completed} de {progress.total} lojas</strong> auditadas
                </span>
                <span className="font-mono font-bold text-rose-400 inline-flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                  <span>Desperdício Total Encontrado: {formatBRL(progress.totalMonthlyWasteIdentifiedBRL)}/mês</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#141716] border border-white/5 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#00BAE2] to-[#0AE448] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.round((progress.completed / progress.total) * 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#BBBAA6]">
                <span>Analisando agora: <strong className="text-[#FFFCE1] font-mono">{progress.currentDomain}</strong></span>
                <span className="text-[#0AE448] font-bold">{progress.highPriorityDealsCount} Oportunidades Quentes para Fechamento</span>
              </div>
            </div>
          )}

          {/* Leads Results Table */}
          {leads.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-sm font-bold text-[#FFFCE1]">Radar de Prospecção Ativa (Ordenado por Maior Vazamento)</h4>
                  <p className="text-xs text-[#BBBAA6]">Lojas com anúncios ativos sofrendo ruptura na grade de tamanhos.</p>
                </div>

                <button
                  onClick={handleExportCsv}
                  className="px-3.5 py-2 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#0AE448]/20"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-slate-950" />
                  <span>{copiedCsv ? 'Baixando CSV...' : 'Exportar Planilha CSV'}</span>
                </button>
              </div>

              <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#141716]">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#191C1B] border-b border-white/10 text-[#BBBAA6] font-bold uppercase text-[10px] font-mono">
                      <th className="p-3">Loja / Marca</th>
                      <th className="p-3">Desperdício em Mídia</th>
                      <th className="p-3">SKUs Rompidos</th>
                      <th className="p-3">Prioridade do Lead</th>
                      <th className="p-3 text-right">Ação de Prospecção</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium text-[#FFFCE1]">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-[#FFFCE1]">{lead.brandName}</div>
                          <div className="text-[10px] text-[#BBBAA6] font-mono flex items-center gap-1">
                            <span>{lead.domain}</span>
                            <span>•</span>
                            <span className="text-[#00BAE2] font-bold">{lead.platform}</span>
                          </div>
                        </td>

                        <td className="p-3">
                          <span className="text-sm font-black font-mono text-rose-400">
                            {formatBRL(lead.monthlyAdWasteBRL)}
                          </span>
                          <span className="text-[10px] text-[#BBBAA6] block font-normal">/mês em cliques perdidos</span>
                        </td>

                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-md font-mono font-bold text-[10px]">
                            {lead.brokenSkusCount} SKUs furados
                          </span>
                        </td>

                        <td className="p-3">
                          {lead.dealPriority === 'ALTÍSSIMA_OPORTUNIDADE' ? (
                            <span className="px-2.5 py-1 bg-rose-600 text-white text-[10px] font-bold uppercase rounded-full shadow-xs inline-flex items-center gap-1">
                              <Flame className="w-3 h-3 text-white" />
                              <span>Altíssima</span>
                            </span>
                          ) : lead.dealPriority === 'ALTA' ? (
                            <span className="px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full inline-flex items-center gap-1">
                              <Zap className="w-3 h-3 text-amber-400" />
                              <span>Alta</span>
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30 text-[10px] font-bold rounded-full inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-[#0AE448]" />
                              <span>Saudável</span>
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleCopyPitch(lead)}
                              className="px-2.5 py-1.5 bg-[#0AE448]/10 hover:bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30 rounded-xl font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer"
                              title="Copiar Script WhatsApp pronto"
                            >
                              {copiedLeadId === lead.id ? <Check className="w-3 h-3 text-[#0AE448]" /> : <FontAwesomeIcon icon={faWhatsapp} className="w-3 h-3 text-[#0AE448]" />}
                              <span>{copiedLeadId === lead.id ? 'Copiado!' : 'Script WhatsApp'}</span>
                            </button>

                            {onOpenStoreDossier && (
                              <button
                                onClick={() => onOpenStoreDossier(lead.domain)}
                                className="p-1.5 bg-white/5 hover:bg-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] border border-white/10 rounded-xl transition-all cursor-pointer"
                                title="Abrir Dossiê Individual"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
