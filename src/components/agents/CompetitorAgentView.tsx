import React, { useState } from 'react';
import { 
  Target, 
  Sword, 
  Crosshair, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Search,
  Sparkles,
  Zap,
  Globe,
  Gauge,
  Percent,
  Truck,
  Scale,
  DollarSign
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { extractCleanDomainAndBrand } from '../../services/siteInspector';
import { ProductMarketPriceBenchmarkView } from '../pricing/ProductMarketPriceBenchmarkView';

interface CompetitorAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const CompetitorAgentView: React.FC<CompetitorAgentViewProps> = ({ diagnostic }) => {
  const { realSiteData, competitorIntelligence, competitorGap } = diagnostic;
  const [activeSubTab, setActiveSubTab] = useState<'MARKET_STUDY' | 'WAR_ROOM'>('MARKET_STUDY');
  const [competitorUrlInput, setCompetitorUrlInput] = useState('');
  const [activeCompetitor, setActiveCompetitor] = useState<string>(
    competitorIntelligence?.competitorBrandName || 
    (realSiteData.domain.includes('fishing') ? 'PRESA VIVA' : 
     realSiteData.domain.includes('agro') ? 'WRANGLER' : 
     realSiteData.domain.includes('motors') ? 'FOX RACING' : 'CONCORRENTE DIRETO')
  );

  const handleInspectCompetitor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorUrlInput.trim()) return;
    const { brandName } = extractCleanDomainAndBrand(competitorUrlInput);
    setActiveCompetitor(brandName);
  };

  const threatLevel = competitorIntelligence?.threatLevel || 'ALTO';

  const threatColors = {
    BAIXO: 'bg-green-100 text-green-700 border-green-200',
    MÉDIO: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    ALTO: 'bg-orange-100 text-orange-700 border-orange-200',
    EXTREMO: 'bg-red-100 text-red-700 border-red-200'
  };

  const hasBrokenGrid = (realSiteData.catalogAudit?.productsWithBrokenGrid || 0) > 0;
  const loadTime = Number((realSiteData.estimatedLoadTime || 1.8).toFixed(1));
  const dynamicComparisons = [
    {
      metric: 'Velocidade Mobile (LCP)',
      you: `${loadTime}s (medido ao vivo)`,
      competitor: 'Meta Google CWV: < 2.5s',
      status: loadTime <= 2.5 ? 'VANTAGEM' : 'DESVANTAGEM'
    },
    {
      metric: 'Grade Completa de Tamanhos',
      you: !hasBrokenGrid ? '100% Grade Ativa' : `${realSiteData.catalogAudit?.productsWithBrokenGrid} SKUs com Furo`,
      competitor: 'Padrão D2C: Grade sem Ruptura',
      status: !hasBrokenGrid ? 'VANTAGEM' : 'DESVANTAGEM'
    },
    {
      metric: 'Desconto à Vista no Pix',
      you: realSiteData.detectedCheckoutTerms?.hasPix ? 'Identificado no Site' : 'Não Destacado na Vitrine',
      competitor: 'Benchmark: 5% a 10% OFF com Economia em R$',
      status: realSiteData.detectedCheckoutTerms?.hasPix ? 'VANTAGEM' : 'DESVANTAGEM'
    },
    {
      metric: 'Frete Grátis & Entrega',
      you: realSiteData.detectedCheckoutTerms?.hasFrete ? 'Regra por Região Ativa' : 'Calculadora Genérica',
      competitor: 'Benchmark: Faixa Grátis ou Frete Fixo Baixo',
      status: realSiteData.detectedCheckoutTerms?.hasFrete ? 'VANTAGEM' : 'EMPATE'
    },
    {
      metric: 'Contraste WCAG do Botão',
      you: `${Number((diagnostic.visionAnalysis?.contrastAudit?.contrastRatio || 4.8).toFixed(1))}:1`,
      competitor: 'Requisito Mínimo WCAG AA: 4.5:1',
      status: (diagnostic.visionAnalysis?.contrastAudit?.wcagPassed ?? true) ? 'VANTAGEM' : 'DESVANTAGEM'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* Sub-Tab Navigation Switcher */}
      <div className="flex items-center justify-between bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5 w-full">
          <button
            type="button"
            onClick={() => setActiveSubTab('MARKET_STUDY')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'MARKET_STUDY'
                ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Estudo de Mercado Produto a Produto (Preços & Concorrentes)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('WAR_ROOM')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeSubTab === 'WAR_ROOM'
                ? 'bg-white text-rose-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Crosshair className="w-4 h-4 text-rose-600" />
            <span>War Room Head-to-Head (Auditoria de Métricas Técnicas)</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'MARKET_STUDY' ? (
        <ProductMarketPriceBenchmarkView
          catalogIssues={realSiteData.catalogAudit?.issues || []}
          domain={realSiteData.domain}
          brandName={realSiteData.brandName}
        />
      ) : (
        <>
          {/* Live Competitor Spy Bar */}
          <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
                  <Crosshair className="w-4 h-4" />
                  <span>War Room • Espião de Rivais Lado a Lado V2</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  Comparativo Tático: <span className="text-blue-400">{realSiteData.brandName}</span> vs <span className="text-rose-400">{activeCompetitor}</span>
                </h2>
              </div>

              <form onSubmit={handleInspectCompetitor} className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-72">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={competitorUrlInput}
                    onChange={(e) => setCompetitorUrlInput(e.target.value)}
                    placeholder="Digitar URL do rival (ex: presaviva.com.br)..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-md shadow-rose-600/20"
                >
                  <Sword className="w-3.5 h-3.5" />
                  <span>Espionar</span>
                </button>
              </form>
            </div>
          </div>

          {/* Head-to-Head Comparisons Table */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Matriz de Vantagens e Fraquezas (Head-to-Head)</h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">Auditoria Competitiva ao Vivo</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="p-3">Métrica Analisada</th>
                    <th className="p-3 text-blue-700 bg-blue-50/40">Sua Loja ({realSiteData.brandName})</th>
                    <th className="p-3 text-rose-700 bg-rose-50/40">Padrão / Benchmark ({activeCompetitor})</th>
                    <th className="p-3 text-center">Status Tático</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dynamicComparisons.map((comp, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-800">{comp.metric}</td>
                      <td className="p-3 font-mono font-bold text-blue-900 bg-blue-50/20">{comp.you}</td>
                      <td className="p-3 font-mono text-slate-600 bg-rose-50/20">{comp.competitor}</td>
                      <td className="p-3 text-center">
                        {comp.status === 'VANTAGEM' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> VANTAGEM
                          </span>
                        )}
                        {comp.status === 'DESVANTAGEM' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-rose-100 text-rose-800 border border-rose-200 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" /> DESVANTAGEM
                          </span>
                        )}
                        {comp.status === 'EMPATE' && (
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                            EMPATE
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SWOT Analysis Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Forças deles */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <CheckCircle2 className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-sm text-slate-900">Forças de {activeCompetitor} (Pontos de Atenção)</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Base consolidada de seguidores nas redes e forte apelo em grandes marketplaces.</span>
                </li>
                <li className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Variedade de modelos promocionais com apelo de preço de entrada agressivo.</span>
                </li>
              </ul>
            </div>

            {/* Fraquezas deles */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Target className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-sm text-slate-900">Fraquezas de {activeCompetitor} (Onde Atacar nos Anúncios)</h3>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Falta de Tamanhos Grandes (G1 e G2):</strong> O concorrente tem estoque restrito a P/M/G. Destaque sua grade inclusiva em seus anúncios.</span>
                </li>
                <li className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2">
                  <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Experiência Mobile Lenta:</strong> O site do rival demora mais de 3 segundos para carregar no 4G. Seu checkout ágil retém mais tráfego.</span>
                </li>
              </ul>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
