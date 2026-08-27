import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Target, 
  TrendingUp, 
  Flame, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  Download, 
  DollarSign, 
  ShieldCheck,
  Zap,
  ArrowRight,
  Send
} from 'lucide-react';
import { 
  runMarketHunterScan, 
  WeeklyMarketReport, 
  DiscoveredLeadOpportunity 
} from '../../services/agents/marketHunterAgent';

export const MarketHunterAgentView: React.FC = () => {
  const [report, setReport] = useState<WeeklyMarketReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedLeadId, setCopiedLeadId] = useState<string | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'leads' | 'trends'>('leads');

  const loadHunterReport = async () => {
    setIsLoading(true);
    try {
      const data = await runMarketHunterScan();
      setReport(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHunterReport();
  }, []);

  const handleCopyHook = (lead: DiscoveredLeadOpportunity) => {
    navigator.clipboard.writeText(lead.contactHook);
    setCopiedLeadId(lead.id);
    setTimeout(() => setCopiedLeadId(null), 2500);
  };

  if (isLoading || !report) {
    return (
      <div className="py-16 text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        <p className="text-sm font-bold text-slate-700">Caçador de Mercado navegando na web e bibliotecas de anúncios...</p>
        <p className="text-xs text-slate-400">Cruzando Google Trends, Meta Ads e gaps de catálogo em tempo real.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-blue-900 to-indigo-950 rounded-2xl text-blue-400 shadow-md shadow-blue-950/30 border border-blue-800">
            <Compass className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Caçador de Tendências & Prospecção Ativa (Market Hunter)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                Semana {report.weekNumber} • Inteligência Ativa
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Navegação autônoma em benchmarks de mercado, biblioteca de anúncios e tendências de busca para captação de clientes e novas estratégias de CRO.
            </p>
          </div>
        </div>

        <button
          onClick={loadHunterReport}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Escanear Mercado Agora</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Lojas Varridas na Web</span>
            <span className="text-xl font-black text-slate-900 font-mono">{report.totalLeadsScanned} E-commerces</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Oportunidades de Alto Ticket</span>
            <span className="text-xl font-black text-emerald-600 font-mono">{report.highValueProspects.length} Leads Quentes</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono block">Tendências de CRO Mapeadas</span>
            <span className="text-xl font-black text-indigo-600 font-mono">{report.topEmergingTrends.length} Inovações 2026</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('leads')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'leads'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Leads de Prospecção & Queima de Anúncios ({report.highValueProspects.length})
        </button>
        <button
          onClick={() => setActiveSubTab('trends')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'trends'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Tendências Globais de CRO ({report.topEmergingTrends.length})
        </button>
      </div>

      {/* SUB-TAB 1: LEADS QUENTES */}
      {activeSubTab === 'leads' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Lojas com investimento ativo em Meta/Google Ads detectadas com rupturas severas de grade ou checkouts lentos.
          </p>

          <div className="grid grid-cols-1 gap-4">
            {report.highValueProspects.map((lead) => (
              <div key={lead.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-all">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{lead.brandName}</h3>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {lead.niche}
                      </span>
                    </div>
                    <a href={lead.storeUrl} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-blue-600 font-mono flex items-center gap-1 mt-0.5">
                      <span>{lead.storeUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Verba de Mídia Estimada</span>
                      <span className="font-mono font-bold text-xs text-slate-700">{lead.estimatedMonthlyAdSpend}/mês</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-xl text-center border border-emerald-200">
                      <span className="text-[9px] font-mono uppercase font-bold text-emerald-600 block">ICE Score</span>
                      <span className="text-sm font-black font-mono text-emerald-700">{lead.iceScore}</span>
                    </div>
                  </div>
                </div>

                {/* Leak Details */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-600" />
                    Gargalo Crítico Detectado pelo Caçador:
                  </p>
                  <p className="text-amber-800 leading-relaxed text-[11px]">{lead.primaryLeakDetected}</p>
                </div>

                {/* Contact Hook Ready to Send */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-blue-600" />
                      Gancho de Abordagem Pronto (WhatsApp / E-mail):
                    </span>
                    <button
                      onClick={() => handleCopyHook(lead)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedLeadId === lead.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedLeadId === lead.id ? 'Abordagem Copiada!' : 'Copiar Mensagem'}</span>
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs leading-relaxed border border-slate-800">
                    "{lead.contactHook}"
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TENDÊNCIAS GLOBAIS DE CRO */}
      {activeSubTab === 'trends' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {report.topEmergingTrends.map((trend) => (
            <div key={trend.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {trend.category}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">
                    {trend.impactOnConversion}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{trend.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{trend.description}</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono space-y-1">
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Como Implementar:</span>
                <p className="text-slate-800 text-[11px]">{trend.actionableImplementation}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
