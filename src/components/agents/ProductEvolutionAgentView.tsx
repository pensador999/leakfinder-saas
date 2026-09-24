import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Cpu, 
  Zap, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  ArrowUpRight,
  ShieldCheck,
  Code2,
  Gauge,
  Check
} from 'lucide-react';
import { 
  runProductEvolutionAudit, 
  PlatformHealthDossier, 
  ProductEvolutionProposal 
} from '../../services/agents/productEvolutionEngineerAgent';

export const ProductEvolutionAgentView: React.FC = () => {
  const [dossier, setDossier] = useState<PlatformHealthDossier | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('TODAS');
  const [approvedProposalIds, setApprovedProposalIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('adshield_approved_pm_proposals');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [feedbackSuccess, setFeedbackSuccess] = useState<string>('');

  const loadDossier = async () => {
    setIsLoading(true);
    try {
      const data = await runProductEvolutionAudit();
      setDossier(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDossier();
  }, []);

  const handleApproveProposal = (proposal: ProductEvolutionProposal) => {
    if (!approvedProposalIds.includes(proposal.id)) {
      const updated = [...approvedProposalIds, proposal.id];
      setApprovedProposalIds(updated);
      localStorage.setItem('adshield_approved_pm_proposals', JSON.stringify(updated));
      setFeedbackSuccess(`🎉 Proposta "${proposal.title}" aprovada! Ela foi enviada para o Chief Executive Orchestrator (Agente 01) na Sprint Ativa e para o Autonomous Code Patch Engineer (Agente 17) para aplicação.`);
      setTimeout(() => setFeedbackSuccess(''), 6000);
    }
  };

  if (isLoading || !dossier) {
    return (
      <div className="py-16 text-center space-y-3 bg-[#101211] border border-white/10 rounded-3xl">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0AE448]" />
        <p className="text-sm font-bold text-[#FFFCE1]">Engenheiro de Auto-Evolução inspecionando codebase e banco de dados...</p>
        <p className="text-xs text-[#BBBAA6]">Avaliando bundle size, latência de consultas Supabase e atrito de conversão.</p>
      </div>
    );
  }

  const filteredProposals = activeCategoryFilter === 'TODAS'
    ? dossier.activeProposals
    : dossier.activeProposals.filter(p => p.category === activeCategoryFilter);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-[#FFFCE1]">Agente 15 — SaaS Product Evolution Engineer</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20">
                Score de Saúde: {dossier.overallHealthScore}/100
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              Auto-inspeção contínua da arquitetura, consultas PostgreSQL do Supabase e roadmap técnico do produto orientado por telemetria e ROI.
            </p>
          </div>
        </div>

        <button
          onClick={loadDossier}
          className="px-4 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-[#0AE448]/20 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-inspecionar Sistema</span>
        </button>
      </div>

      {/* Success Feedback Banner */}
      {feedbackSuccess && (
        <div className="p-4 bg-[#0AE448]/10 border border-[#0AE448]/30 text-[#0AE448] rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-[#0AE448] shrink-0" />
          <span>{feedbackSuccess}</span>
        </div>
      )}

      {/* System Health Radar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#00BAE2] rounded-xl border border-[#00BAE2]/20">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Eficiência do Bundle JS</span>
            <span className="text-xl font-black text-[#00BAE2] font-mono">{dossier.bundleEfficiencyPct}% Ótimo</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#0AE448] rounded-xl border border-[#0AE448]/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Índices do Supabase</span>
            <span className="text-sm font-black text-[#0AE448] font-mono">{dossier.databaseIndexHealth}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-purple-400 rounded-xl border border-purple-500/20">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Fluidez do Funil</span>
            <span className="text-xl font-black text-purple-300 font-mono">{dossier.conversionFrictionScore}/100</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-amber-400 rounded-xl border border-amber-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Propostas Ativas</span>
            <span className="text-xl font-black text-amber-300 font-mono">{dossier.activeProposals.length} Melhorias</span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold">
        {['TODAS', 'PERFORMANCE', 'NOVA_FERRAMENTA', 'SEGURANCA_BANCO', 'UX_CONVERSAO'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl font-mono transition-all cursor-pointer ${
              activeCategoryFilter === cat
                ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                : 'bg-[#141716] text-[#BBBAA6] border border-white/10 hover:bg-white/5 hover:text-white'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProposals.map((proposal) => {
          const isApproved = approvedProposalIds.includes(proposal.id);

          return (
            <div key={proposal.id} className="p-5 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-4 flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-[#141716] text-[#00BAE2] border border-[#00BAE2]/20">
                    {proposal.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-[#BBBAA6] font-mono">ICE Score:</span>
                    <span className="font-mono font-black text-[#0AE448] text-xs px-2 py-0.5 bg-[#0AE448]/10 rounded-md border border-[#0AE448]/20">
                      {proposal.iceScore}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-[#FFFCE1] text-base leading-snug">{proposal.title}</h3>
                  <p className="text-[11px] text-[#BBBAA6] font-mono mt-0.5">Alvo: {proposal.targetComponent}</p>
                </div>

                {/* Problem Identified */}
                <div className="p-3.5 rounded-2xl bg-[#141716] border border-white/10 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Gargalo Diagnosticado:</span>
                  <p className="text-[#FFFCE1] text-xs leading-relaxed">{proposal.problemIdentified}</p>
                </div>

                {/* Technical Solution */}
                <div className="p-3.5 rounded-2xl bg-[#141716] border border-[#00BAE2]/20 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#00BAE2] font-mono block">Solução de Engenharia:</span>
                  <p className="text-[#BBBAA6] font-medium text-xs leading-relaxed">{proposal.technicalSolution}</p>
                </div>

                {/* Technical ROI */}
                <div className="p-3.5 rounded-2xl bg-[#141716] border border-[#0AE448]/20 text-xs text-[#0AE448] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#0AE448] font-mono block">Justificativa de ROI Técnico:</span>
                  <p className="font-bold text-xs">{proposal.estimatedRoiJustification}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#BBBAA6]">
                  Status: <strong className="text-[#FFFCE1]">{isApproved ? 'Aprovado pelo Maestro' : 'Submetido ao CEO'}</strong>
                </span>

                <button
                  onClick={() => handleApproveProposal(proposal)}
                  disabled={isApproved}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isApproved
                      ? 'bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/40'
                      : 'bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                  }`}
                >
                  {isApproved ? <Check className="w-3.5 h-3.5 text-[#0AE448]" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                  <span>{isApproved ? 'Aprovado para Execução' : 'Aprovar Proposta'}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
