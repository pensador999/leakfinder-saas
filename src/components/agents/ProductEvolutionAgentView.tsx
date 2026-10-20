import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Cpu, 
  Zap, 
  Database, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Layers, 
  ArrowUpRight,
  ShieldCheck,
  Gauge,
  Check,
  BrainCircuit,
  TrendingUp,
  Globe,
  Activity,
  Download,
  Upload
} from 'lucide-react';
import { 
  runProductEvolutionAudit, 
  PlatformHealthDossier, 
  ProductEvolutionProposal 
} from '../../services/agents/productEvolutionEngineerAgent';
import {
  getSwarmEvolutionSummary,
  runFieldCalibrationPass,
  learnFromStoreDiagnostic,
  exportSwarmMemoryVaultJson,
  importSwarmMemoryVaultJson
} from '../../services/memory/swarmEvolutionaryLearningEngine';
import { DYNAMIC_VERTICAL_REGISTRY } from '../../services/ai/dynamicVerticalContext';
import { useAuditStore } from '../../store/auditStore';

export const ProductEvolutionAgentView: React.FC = () => {
  const diagnostic = useAuditStore(state => state.diagnostic);
  const [dossier, setDossier] = useState<PlatformHealthDossier | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeViewTab, setActiveViewTab] = useState<'padroes_campo' | 'calibracao_bayesiana' | 'roadmap_propostas'>('padroes_campo');
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

  const loadDossier = async (forceFieldCalibration = false) => {
    setIsLoading(true);
    try {
      const currentSummary = getSwarmEvolutionSummary();
      if (forceFieldCalibration || currentSummary.totalAuditsProcessed === 0) {
        runFieldCalibrationPass(diagnostic);
      } else if (diagnostic) {
        learnFromStoreDiagnostic(diagnostic);
      }
      const data = await runProductEvolutionAudit();
      setDossier(data);
      if (forceFieldCalibration) {
        setFeedbackSuccess(
          `🧠 Memória Evolutiva recalibrada com sucesso! Maturidade Neural (SIQ): ${data.swarmMaturityScore}% | ${data.learnedPatternsCount} padrões estruturais ativos em ${data.storesLearnedCount} lojas de referência.`
        );
        setTimeout(() => setFeedbackSuccess(''), 6000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDossier(false);
  }, [diagnostic?.realSiteData?.domain]);

  const handleApproveProposal = (proposal: ProductEvolutionProposal) => {
    if (!approvedProposalIds.includes(proposal.id)) {
      const updated = [...approvedProposalIds, proposal.id];
      setApprovedProposalIds(updated);
      localStorage.setItem('adshield_approved_pm_proposals', JSON.stringify(updated));
      setFeedbackSuccess(`🎉 Proposta "${proposal.title}" aprovada! Incorporada ao pipeline do Chief Executive Orchestrator (Agente 01).`);
      setTimeout(() => setFeedbackSuccess(''), 6000);
    }
  };

  const handleExportVaultJson = () => {
    const jsonContent = exportSwarmMemoryVaultJson();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adshield-memory-vault-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setFeedbackSuccess('💾 Backup JSON do Cofre Local (Memória Evolutiva + Contexto de Lojas) exportado com sucesso!');
    setTimeout(() => setFeedbackSuccess(''), 6000);
  };

  const handleImportVaultJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = String(e.target?.result || '');
      const res = importSwarmMemoryVaultJson(text);
      if (res.success) {
        const updated = await runProductEvolutionAudit();
        setDossier(updated);
        setFeedbackSuccess(
          `📥 Cofre Local restaurado! ${res.restoredDomainsCount} lojas e ${res.restoredPatternsCount} padrões carregados (Maturidade SIQ: ${res.swarmMaturityScore}%).`
        );
      } else {
        setFeedbackSuccess(`⚠️ Falha ao importar JSON: ${res.error}`);
      }
      setTimeout(() => setFeedbackSuccess(''), 6000);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  if (isLoading || !dossier) {
    return (
      <div className="py-16 text-center space-y-3 bg-[#101211] border border-white/10 rounded-3xl">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#0AE448]" />
        <p className="text-sm font-bold text-[#FFFCE1]">Sincronizando Memória Evolutiva & Padrões de Campo dos 18 Agentes...</p>
        <p className="text-xs text-[#BBBAA6]">Carregando assinaturas estruturais aprendidas, calibração bayesiana por vertical e telemetria Local-First.</p>
      </div>
    );
  }

  const filteredProposals = activeCategoryFilter === 'TODAS'
    ? dossier.activeProposals
    : dossier.activeProposals.filter(p => p.category === activeCategoryFilter);

  return (
    <div className="space-y-6 font-sans text-[#FFFCE1]">
      {/* Live Grounding Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 bg-[#0AE448]/10 text-[#0AE448] text-xs font-mono rounded-xl border border-[#0AE448]/25">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 shrink-0" />
          <span>[Memória Evolutiva Local-First Ativa • {dossier.learnedPatternsCount} Padrões Assimilados em Campo • Harmonia Inter-Agentes {dossier.crossAgentHarmonyPct}%]</span>
        </div>
        <span className="text-[11px] text-[#BBBAA6]">Última atualização: {dossier.auditedAt}</span>
      </div>
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] border border-[#0AE448]/25 rounded-2xl text-[#0AE448] shadow-md">
            <Wrench className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-[#FFFCE1]">Agente 16 — Swarm Evolutionary Learning & Product Engineer</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30">
                Maturidade Neural (SIQ): {dossier.swarmMaturityScore}%
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#00BAE2]/15 text-[#00BAE2] border border-[#00BAE2]/30">
                Harmonia 18 Agentes: {dossier.crossAgentHarmonyPct}%
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1.5 max-w-3xl leading-relaxed">
              {dossier.engineerVerdict}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleExportVaultJson}
            className="px-3.5 py-2.5 bg-[#141716] hover:bg-white/10 text-[#FFFCE1] border border-white/15 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            title="Baixar Snapshot JSON da Memória Evolutiva e Contexto de Lojas"
          >
            <Download className="w-4 h-4 text-[#00BAE2]" />
            <span>Exportar Cofre JSON</span>
          </button>

          <label
            className="px-3.5 py-2.5 bg-[#141716] hover:bg-white/10 text-[#FFFCE1] border border-white/15 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
            title="Restaurar Snapshot JSON do Cofre Local"
          >
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Importar JSON</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleImportVaultJson}
              className="hidden"
            />
          </label>

          <button
            onClick={() => loadDossier(true)}
            className="px-4 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-[#0AE448]/20 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sincronizar & Recalibrar Campo</span>
          </button>
        </div>
      </div>

      {/* Success Feedback Banner */}
      {feedbackSuccess && (
        <div className="p-4 bg-[#0AE448]/10 border border-[#0AE448]/30 text-[#0AE448] rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-[#0AE448] shrink-0" />
          <span>{feedbackSuccess}</span>
        </div>
      )}

      {/* System & Swarm Evolution KPI Radar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#0AE448] rounded-xl border border-[#0AE448]/20">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Maturidade do Enxame (SIQ)</span>
            <span className="text-xl font-black text-[#0AE448] font-mono">{dossier.swarmMaturityScore}%</span>
            <span className="text-[10px] text-[#BBBAA6] block">{dossier.totalAuditsProcessed} ciclos evolutivos</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#00BAE2] rounded-xl border border-[#00BAE2]/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Padrões de Campo Ativos</span>
            <span className="text-xl font-black text-[#00BAE2] font-mono">{dossier.learnedPatternsCount} Assinaturas</span>
            <span className="text-[10px] text-[#BBBAA6] block">Em {dossier.storesLearnedCount} domínios aprendidos</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-purple-400 rounded-xl border border-purple-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Coerência Matemática</span>
            <span className="text-xl font-black text-purple-300 font-mono">{dossier.crossAgentHarmonyPct}% Paridade</span>
            <span className="text-[10px] text-[#BBBAA6] block">Auto-Cura Cross-Agent Ativa</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-amber-400 rounded-xl border border-amber-500/20">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Persistência de Memória</span>
            <span className="text-sm font-black text-amber-300 font-mono">{dossier.databaseIndexHealth}</span>
            <span className="text-[10px] text-[#BBBAA6] block">Eficiência Bundle: {dossier.bundleEfficiencyPct}%</span>
          </div>
        </div>
      </div>

      {/* Domains Learned Pills */}
      {(dossier.uniqueDomainsLearned || []).length > 0 && (
        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#BBBAA6] flex items-center gap-1.5 mr-1">
            <Globe className="w-3.5 h-3.5 text-[#0AE448]" />
            <span>Domínios que Alimentaram a Inteligência do Enxame:</span>
          </span>
          {(dossier.uniqueDomainsLearned || []).map((dom) => (
            <span
              key={dom}
              className="px-2.5 py-1 rounded-lg bg-[#141716] border border-[#0AE448]/25 text-xs font-mono font-bold text-[#0AE448]"
            >
              {dom}
            </span>
          ))}
        </div>
      )}

      {/* Primary Section Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveViewTab('padroes_campo')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeViewTab === 'padroes_campo'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-lg shadow-[#0AE448]/20'
              : 'bg-[#141716] text-[#BBBAA6] border border-white/10 hover:text-white'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>1. Padrões Estruturais Aprendidos ({dossier.learnedPatternsCount || 0})</span>
        </button>

        <button
          onClick={() => setActiveViewTab('calibracao_bayesiana')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeViewTab === 'calibracao_bayesiana'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-lg shadow-[#0AE448]/20'
              : 'bg-[#141716] text-[#BBBAA6] border border-white/10 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>2. Calibração Bayesiana por Vertical ({(dossier.verticalBenchmarksList || []).length})</span>
        </button>

        <button
          onClick={() => setActiveViewTab('roadmap_propostas')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
            activeViewTab === 'roadmap_propostas'
              ? 'bg-[#0AE448] text-slate-950 font-black shadow-lg shadow-[#0AE448]/20'
              : 'bg-[#141716] text-[#BBBAA6] border border-white/10 hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Propostas de Engenharia & Auto-Melhoria ({dossier.activeProposals.length})</span>
        </button>
      </div>

      {/* TAB 1: LEARNED FIELD PATTERNS */}
      {activeViewTab === 'padroes_campo' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#FFFCE1]">Assinaturas Técnicas Assimiladas pelos 18 Agentes em Campo</h3>
              <p className="text-xs text-[#BBBAA6]">
                Cada padrão abaixo foi extraído de lojas reais auditadas e transformado em regra determinística permanente para eliminar falsos positivos.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#0AE448]/10 border border-[#0AE448]/30 text-[#0AE448] font-mono text-xs font-bold shrink-0">
              Zero Alucinação • 100% Grounded
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(dossier.learnedPatternsList || []).map((pat) => (
              <div
                key={pat.id}
                className="p-5 rounded-3xl bg-[#101211] border border-white/10 hover:border-[#0AE448]/40 transition-all shadow-xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#0AE448]/10 border border-[#0AE448]/25 text-[#0AE448] font-mono text-[10px] font-bold">
                      {pat.patternType}
                    </span>
                    <span className="text-[11px] font-mono text-[#BBBAA6]">
                      {pat.occurrencesCount}x detectado
                    </span>
                  </div>

                  <div>
                    <p className="text-[11px] font-mono text-[#00BAE2]">
                      Origem: <strong className="text-[#FFFCE1]">{pat.firstLearnedFromDomain}</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#141716] border border-white/10 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#BBBAA6] block">
                      Anomalia / Estrutura Descoberta:
                    </span>
                    <p className="text-xs text-[#FFFCE1] leading-relaxed">{pat.description}</p>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#0AE448]/5 border border-[#0AE448]/20 space-y-1">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#0AE448] block">
                      Regra Autônoma Incorporada:
                    </span>
                    <p className="text-xs text-[#BBBAA6] leading-relaxed font-medium">{pat.activeRuleApplied}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-[#BBBAA6]">
                  <span className="flex items-center gap-1 text-[#0AE448] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Regra Ativa no Pipeline
                  </span>
                  <span>{new Date(pat.lastSeenAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: BAYESIAN EMPIRICAL CALIBRATION PER VERTICAL */}
      {activeViewTab === 'calibracao_bayesiana' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#FFFCE1] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#00BAE2]" />
                  <span>Matriz de Calibração Bayesiana Empírica por Vertical</span>
                </h3>
                <p className="text-xs text-[#BBBAA6] mt-0.5">
                  Compara o Benchmark Teórico Inicial da vertical com a Média Real Observada nas lojas auditadas pelo enxame.
                </p>
              </div>
              <span className="text-xs font-mono text-[#0AE448] font-bold">
                [Dado Empírico Calibrado Localmente]
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#141716] border-b border-white/10 text-[#BBBAA6] font-mono uppercase text-[10px]">
                    <th className="p-3.5">Vertical / Nicho</th>
                    <th className="p-3.5">Amostragem Real</th>
                    <th className="p-3.5">Ticket Teórico vs. Observado</th>
                    <th className="p-3.5">Taxa Média de Ruptura Core</th>
                    <th className="p-3.5">Densidade SKUs / Produto</th>
                    <th className="p-3.5">Índice Multi-Cor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {(dossier.verticalBenchmarksList || []).map((vb) => {
                    const profile = DYNAMIC_VERTICAL_REGISTRY[vb.verticalId];
                    const theoreticalTicket = profile?.averageTicketBRL || 200;
                    const diffPct = Math.round(((vb.observedAvgTicketBRL - theoreticalTicket) / theoreticalTicket) * 100);

                    return (
                      <tr key={vb.verticalId} className="hover:bg-white/5 transition-colors">
                        <td className="p-3.5 font-sans">
                          <span className="font-bold text-[#FFFCE1] block">{profile?.label || vb.verticalId}</span>
                          <span className="text-[10px] font-mono text-[#00BAE2]">{vb.verticalId}</span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-[#FFFCE1] font-bold">{vb.storesSampled} loja(s)</span>
                          <span className="text-[10px] text-[#BBBAA6] block">
                            {vb.totalProductsSampled} prods • {vb.totalSkusSampled} SKUs
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[#BBBAA6] line-through text-[11px]">R$ {theoreticalTicket}</span>
                            <span className="text-[#0AE448] font-bold text-sm">R$ {vb.observedAvgTicketBRL.toFixed(2)}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              diffPct >= 0 ? 'bg-[#0AE448]/15 text-[#0AE448]' : 'bg-[#00BAE2]/15 text-[#00BAE2]'
                            }`}>
                              {diffPct >= 0 ? `+${diffPct}%` : `${diffPct}%`}
                            </span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                            {vb.observedCoreRuptureRatePct}% dos itens
                          </span>
                        </td>
                        <td className="p-3.5 text-[#FFFCE1] font-bold">
                          {vb.avgSkusPerProduct} SKUs/prod
                        </td>
                        <td className="p-3.5 text-[#00BAE2] font-bold">
                          {Math.round(vb.multiColorDensityRatio * 100)}% multi-cor
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROPOSALS GRID */}
      {activeViewTab === 'roadmap_propostas' && (
        <div className="space-y-4">
          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-3 text-xs font-bold">
            {['TODAS', 'AUTO_APRENDIZADO_CAMPO', 'PERFORMANCE', 'NOVA_FERRAMENTA', 'MEMORIA_LOCAL', 'UX_CONVERSAO'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-mono transition-all cursor-pointer ${
                  activeCategoryFilter === cat
                    ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                    : 'bg-[#141716] text-[#BBBAA6] border border-white/10 hover:bg-white/5 hover:text-white'
                }`}
              >
                {cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProposals.map((proposal) => {
              const isApproved = proposal.status === 'APROVADO' || approvedProposalIds.includes(proposal.id);

              return (
                <div key={proposal.id} className="p-5 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-4 flex flex-col justify-between hover:border-white/20 transition-all">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-[#141716] text-[#00BAE2] border border-[#00BAE2]/20">
                        {proposal.category.replace(/_/g, ' ')}
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
                      Status: <strong className="text-[#FFFCE1]">{isApproved ? 'Ativo & Incorporado' : 'Submetido ao CEO'}</strong>
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
                      <span>{isApproved ? 'Incorporado no Motor' : 'Aprovar Proposta'}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
