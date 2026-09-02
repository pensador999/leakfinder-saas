import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Sword, 
  Search, 
  BrainCircuit, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink,
  ArrowRight,
  TrendingDown,
  Layers,
  Award
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { 
  queryVectorMemoryBank, 
  VectorMemoryQueryResponse, 
  ProvenSolutionPlaybook 
} from '../../services/ai/supabaseVectorMemoryBank';
import { 
  computeCompetitorRadarBenchmark, 
  CompetitorRadarReport 
} from '../../services/ai/liveCompetitorBenchmarkingEngine';

interface VectorMemoryCompetitorRadarViewProps {
  diagnostic: AgentDiagnosticResult;
}

type TabOption = 'RAG_PLAYBOOKS' | 'COMPETITOR_RADAR';

export const VectorMemoryCompetitorRadarView: React.FC<VectorMemoryCompetitorRadarViewProps> = ({ diagnostic }) => {
  const [activeTab, setActiveTab] = useState<TabOption>('RAG_PLAYBOOKS');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ragData, setRagData] = useState<VectorMemoryQueryResponse | null>(null);
  const [radarData, setRadarData] = useState<CompetitorRadarReport | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  const loadData = async (query = '') => {
    setIsSearching(true);
    try {
      const rag = await queryVectorMemoryBank(query);
      const radar = computeCompetitorRadarBenchmark(diagnostic);
      setRagData(rag);
      setRadarData(radar);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [diagnostic]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData(searchQuery);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2500);
  };

  return (
    <div className="space-y-8 font-sans animate-fadeIn">
      
      {/* Top Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-2xl text-white shadow-md shadow-indigo-500/30">
            <Database className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Memória Vetorial RAG & Radar Competitivo de Nicho</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" />
                1.056 Vetores no Supabase
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Consulte playbooks comprovados de recuperação de vendas acumulados em mais de 1.000 lojas e compare sua performance 1-a-1 com o líder de mercado.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl text-xs font-bold font-mono shrink-0">
          <button
            onClick={() => setActiveTab('RAG_PLAYBOOKS')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'RAG_PLAYBOOKS'
                ? 'bg-purple-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Memória Vetorial RAG</span>
          </button>

          <button
            onClick={() => setActiveTab('COMPETITOR_RADAR')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'COMPETITOR_RADAR'
                ? 'bg-purple-500 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Sword className="w-3.5 h-3.5" />
            <span>Radar Competitivo 1-a-1</span>
          </button>
        </div>
      </div>

      {/* 🧠 1. SUB-TAB: RAG PLAYBOOKS & SEMANTIC VECTOR SEARCH */}
      {activeTab === 'RAG_PLAYBOOKS' && ragData && (
        <div className="space-y-6">
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque soluções comprovadas (ex: 'ruptura tamanho G', 'desconto pix', 'frete interior')..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-sm"
            >
              <span>{isSearching ? 'Consultando...' : 'Consultar Banco RAG'}</span>
            </button>
          </form>

          {/* Guidance Banner */}
          <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-purple-950 font-medium">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>{ragData.executiveGuidance}</span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-purple-200/80 px-2 py-0.5 rounded text-purple-900 shrink-0">
              Cosine Similarity &gt; 92%
            </span>
          </div>

          {/* Playbooks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ragData.playbooks.map((playbook) => (
              <div key={playbook.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between hover:border-purple-300 transition-all">
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-100 text-purple-800">
                      {playbook.nicheLabel.split(',')[0]}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold font-mono">
                      Similaridade: {playbook.similarityScorePct}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Gargalo Identificado:</span>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug mt-0.5">
                      {playbook.problemSignature}
                    </h4>
                  </div>

                  <div>
                    <span className="text-[10px] text-purple-700 font-mono uppercase font-bold block">Playbook Validado:</span>
                    <p className="text-xs text-slate-600 leading-relaxed mt-0.5 font-sans">
                      {playbook.provenSolution}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[9px] text-slate-400 uppercase block">Lift Médio</span>
                      <strong className="text-emerald-600 text-sm">+{playbook.averageConversionLiftPct}%</strong>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[9px] text-slate-400 uppercase block">Casos Reais</span>
                      <strong className="text-slate-800 text-sm">{playbook.historicalSuccessCasesCount} lojas</strong>
                    </div>
                  </div>

                  {playbook.codeSnippetRecommendation && (
                    <button
                      onClick={() => handleCopyCode(playbook.id, playbook.codeSnippetRecommendation!)}
                      className="w-full py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[11px] font-mono font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedSnippetId === playbook.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedSnippetId === playbook.id ? 'Código Copiado!' : 'Copiar Script da Solução'}</span>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* 🦅 2. SUB-TAB: LIVE COMPETITOR RADAR BENCHMARKING */}
      {activeTab === 'COMPETITOR_RADAR' && radarData && (
        <div className="space-y-6">
          
          {/* Top Comparison Banner */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">Duelo Direto de E-Commerce</span>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-900">{radarData.analyzedBrandName}</h3>
                <span className="text-sm font-black text-slate-400 font-mono">VS</span>
                <h3 className="text-xl font-bold text-indigo-600">{radarData.competitorBrandName}</h3>
              </div>
              <p className="text-xs text-slate-500 font-mono">Comparação de 5 pilares operacionais contra o líder nacional</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center min-w-[120px]">
                <span className="text-[10px] text-slate-500 font-mono uppercase font-bold block">Seu Score</span>
                <span className="text-2xl font-black text-amber-500 font-mono">{radarData.overallCompetitiveScoreYou}/100</span>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-200 text-center min-w-[120px]">
                <span className="text-[10px] text-indigo-700 font-mono uppercase font-bold block">Score Líder</span>
                <span className="text-2xl font-black text-indigo-700 font-mono">{radarData.overallCompetitiveScoreCompetitor}/100</span>
              </div>

              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-center min-w-[150px]">
                <span className="text-[10px] text-rose-700 font-mono uppercase font-bold block">Vazamento Estimado</span>
                <span className="text-xl font-black text-rose-800 font-mono">R$ {radarData.marketShareLeakMonthly.toLocaleString('pt-BR')}/mês</span>
              </div>
            </div>

          </div>

          {/* 5 Dimensions Benchmarking Table */}
          <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Matriz Comparativa das 5 Dimensões Críticas</span>
            </h4>

            <div className="space-y-3">
              {radarData.dimensions.map((dim, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <span className="font-bold text-slate-900 text-sm">{dim.dimensionName}</span>
                    <span className={`px-2.5 py-0.5 rounded-lg font-mono font-bold text-[10px] border ${
                      dim.status === 'VANTAGEM'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : dim.status === 'EMPATE'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}>
                      Status: {dim.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono uppercase font-bold block">Na sua loja ({radarData.analyzedBrandName}):</span>
                      <p className="font-bold text-slate-800">{dim.yourStoreValue}</p>
                    </div>

                    <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-200 space-y-1">
                      <span className="text-[10px] text-indigo-700 font-mono uppercase font-bold block">No líder ({radarData.competitorBrandName}):</span>
                      <p className="font-bold text-indigo-950">{dim.competitorStoreValue}</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 text-slate-600 font-medium">
                    <p className="text-xs">
                      🔍 <strong>Análise de Gap:</strong> {dim.gapAnalysis}
                    </p>
                    {dim.revenueImpactMonthly > 0 && (
                      <span className="text-rose-700 font-mono font-bold shrink-0">
                        Perda: R$ {dim.revenueImpactMonthly.toLocaleString('pt-BR')}/mês
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Counter-Strategies Recommendations */}
          <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase block">
              🛡️ Plano de Contra-Ataque Recomendado pela IA:
            </span>
            <ul className="space-y-2 text-xs text-slate-200 font-medium">
              {radarData.urgentRecommendations.map((rec, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}

    </div>
  );
};
