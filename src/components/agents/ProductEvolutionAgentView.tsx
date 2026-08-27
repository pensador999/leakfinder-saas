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
  const [approvedProposalIds, setApprovedProposalIds] = useState<string[]>([]);

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

  const handleApproveProposal = (id: string) => {
    if (!approvedProposalIds.includes(id)) {
      setApprovedProposalIds([...approvedProposalIds, id]);
    }
  };

  if (isLoading || !dossier) {
    return (
      <div className="py-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
        <p className="text-sm font-bold text-slate-700">Engenheiro de Auto-Evolução inspecionando codebase e banco de dados...</p>
        <p className="text-xs text-slate-400">Avaliando bundle size, latência de consultas Supabase e atrito de conversão.</p>
      </div>
    );
  }

  const filteredProposals = activeCategoryFilter === 'TODAS'
    ? dossier.activeProposals
    : dossier.activeProposals.filter(p => p.category === activeCategoryFilter);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl text-cyan-400 shadow-md shadow-indigo-950/30 border border-indigo-800">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Engenheiro de Auto-Evolução do AdShield (Product Evolution)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                Score de Saúde: {dossier.overallHealthScore}/100
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Auto-inspeção contínua da arquitetura, queries PostgreSQL do Supabase e UX de conversão com propostas fundamentadas em ROI técnico.
            </p>
          </div>
        </div>

        <button
          onClick={loadDossier}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Re-inspecionar Sistema</span>
        </button>
      </div>

      {/* System Health Radar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Eficiência do Bundle JS</span>
            <span className="text-xl font-black text-indigo-600 font-mono">{dossier.bundleEfficiencyPct}% Ótimo</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Índices do Supabase</span>
            <span className="text-sm font-black text-emerald-600 font-mono">{dossier.databaseIndexHealth}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Fluidez do Funil</span>
            <span className="text-xl font-black text-blue-600 font-mono">{dossier.conversionFrictionScore}/100</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Propostas Ativas</span>
            <span className="text-xl font-black text-amber-600 font-mono">{dossier.activeProposals.length} Melhorias</span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        {['TODAS', 'PERFORMANCE', 'NOVA_FERRAMENTA', 'SEGURANCA_BANCO', 'UX_CONVERSAO'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
              activeCategoryFilter === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
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
            <div key={proposal.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {proposal.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-400 font-mono">ICE Score:</span>
                    <span className="font-mono font-black text-indigo-600 text-xs px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-200">
                      {proposal.iceScore}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{proposal.title}</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">Alvo: {proposal.targetComponent}</p>
                </div>

                {/* Problem Identified */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Gargalo Diagnosticado:</span>
                  <p className="text-slate-700 text-xs leading-relaxed">{proposal.problemIdentified}</p>
                </div>

                {/* Technical Solution */}
                <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-indigo-500 font-mono block">Solução de Engenharia:</span>
                  <p className="text-indigo-950 font-medium text-xs leading-relaxed">{proposal.technicalSolution}</p>
                </div>

                {/* Technical ROI */}
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 font-mono block">Justificativa de ROI Técnico:</span>
                  <p className="font-bold text-xs">{proposal.estimatedRoiJustification}</p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  Status: <strong className="text-slate-700">{isApproved ? 'Aprovado pelo Maestro' : 'Submetido ao CEO'}</strong>
                </span>

                <button
                  onClick={() => handleApproveProposal(proposal.id)}
                  disabled={isApproved}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isApproved
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-900 hover:bg-indigo-600 text-white shadow-xs'
                  }`}
                >
                  {isApproved ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
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
