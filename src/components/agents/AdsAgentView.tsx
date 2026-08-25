import React, { useState } from 'react';
import { Target, Video, Copy, Check, Layers, DollarSign, Calculator, Sparkles, TrendingUp, ShieldAlert, ArrowRight } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface AdsAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const AdsAgentView: React.FC<AdsAgentViewProps> = ({ diagnostic }) => {
  const { ads, input, realSiteData } = diagnostic;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Dynamic Custom Budget State (defaults to simulated spend or allows custom manual entry)
  const defaultBudget = ads.monthlyAdBudgetSuggested || 5000;
  const [customBudget, setCustomBudget] = useState<number>(defaultBudget);

  const copyAdText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const domain = realSiteData.domain.toLowerCase();
  const isFishing = domain.includes('fishing');
  const isAgro = domain.includes('agro');
  const isMotors = domain.includes('motors');

  const coldSpend = Math.round(customBudget * 0.60);
  const retargetSpend = Math.round(customBudget * 0.25);
  const testSpend = Math.round(customBudget * 0.15);

  const estimatedReturnRevenue = Math.round(customBudget * ads.targetRoas);
  const estimatedOrders = Math.round(estimatedReturnRevenue / (input.averageOrderValue || 220));

  return (
    <div className="space-y-6 font-sans">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-md shadow-blue-500/20">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">Agente de Mídia Paga (Ads Strategist)</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full border border-blue-200">
                Meta Ads, Google Shopping & TikTok
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium max-w-xl">
              Estratégia de distribuição percentual de verba, cálculo de ROAS/CAC máximo tolerável e roteiros de criativos adaptados para {realSiteData.brandName}.
            </p>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">ROAS Alvo</p>
            <p className="text-xl font-bold font-mono text-emerald-600">{ads.targetRoas}x</p>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">CAC Máximo</p>
            <p className="text-xl font-bold font-mono text-blue-600">R$ {ads.maxCacAllowed}</p>
          </div>
        </div>
      </div>

      {/* 🎛️ DYNAMIC BUDGET CALCULATOR */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white border border-slate-800 shadow-md space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400">
                Simulador Dinâmico de Investimento em Tráfego
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Insira o orçamento mensal real que você deseja investir para ver a alocação técnica ideal entre Topo, Remarketing e Testes:
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[3000, 5000, 10000, 20000].map((preset) => (
              <button
                key={preset}
                onClick={() => setCustomBudget(preset)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  customBudget === preset
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                R$ {preset.toLocaleString('pt-BR')}
              </button>
            ))}
          </div>
        </div>

        {/* Input & Return Projection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
          
          {/* Custom Input */}
          <div className="md:col-span-4 p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <label className="text-[11px] font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Orçamento Mensal em Anúncios:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">R$</span>
              <input
                type="number"
                min="500"
                step="500"
                value={customBudget}
                onChange={(e) => setCustomBudget(Math.max(0, Number(e.target.value)))}
                className="w-full bg-slate-900 border border-white/20 rounded-lg pl-9 pr-3 py-2 text-sm font-mono font-bold text-white focus:outline-hidden focus:border-emerald-400"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Média diária: <strong className="text-white">R$ {(customBudget / 30).toFixed(2)}/dia</strong>
            </p>
          </div>

          {/* Return Projection */}
          <div className="md:col-span-8 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="space-y-0.5">
              <p className="text-[10px] text-emerald-300 uppercase font-semibold">Faturamento Projetado (ROAS {ads.targetRoas}x)</p>
              <p className="text-xl font-black font-mono text-emerald-400">
                R$ {estimatedReturnRevenue.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-emerald-500/20 pt-2 sm:pt-0">
              <p className="text-[10px] text-emerald-300 uppercase font-semibold">Pedidos Estimados</p>
              <p className="text-xl font-black font-mono text-white">
                ~{estimatedOrders} vendas
              </p>
            </div>
            <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-emerald-500/20 pt-2 sm:pt-0">
              <p className="text-[10px] text-emerald-300 uppercase font-semibold">Ticket Médio Estimado</p>
              <p className="text-xl font-black font-mono text-white">
                R$ {input.averageOrderValue || 220}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Budget Allocation Breakdown (Percentage Based) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Estrutura Percentual de Campanhas Recomendada</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-medium">
          
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Topo de Funil (Tráfego Frio)</span>
              <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                60%
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              {isFishing
                ? 'Públicos amplos de Pesca Esportiva, Náutica, Camping e Lookalikes de compradores.'
                : isAgro
                ? 'Públicos de Agronegócio, Pecuária, Vida no Campo e Regiões Produtoras (Centro-Oeste, Sul e Interior de SP/MG).'
                : isMotors
                ? 'Públicos de Motocross, Trilha Off-road, Enduro e Apaixonados por Duas Rodas.'
                : 'Públicos de interesse no nicho e Lookalikes de compradores 1%.'}
            </p>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">Orçamento:</span>
              <span className="font-mono text-slate-900 font-bold">R$ {coldSpend.toLocaleString('pt-BR')}/mês (R$ {(coldSpend / 30).toFixed(0)}/dia)</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Meio & Fundo (Retargeting DPA)</span>
              <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                25%
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Engajamento Instagram 30d, Visitantes da Loja 14d e Catálogo Dinâmico (DPA) para quem visualizou produtos ou abandonou carrinho.
            </p>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">Orçamento:</span>
              <span className="font-mono text-slate-900 font-bold">R$ {retargetSpend.toLocaleString('pt-BR')}/mês (R$ {(retargetSpend / 30).toFixed(0)}/dia)</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-900">Laboratório de Teste de Criativos</span>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                15%
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Campanha CBO isolada para testar semanalmente novos ganchos (Hooks de 3 segundos), depoimentos de clientes e carrosséis.
            </p>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-500 text-[11px]">Orçamento:</span>
              <span className="font-mono text-slate-900 font-bold">R$ {testSpend.toLocaleString('pt-BR')}/mês (R$ {(testSpend / 30).toFixed(0)}/dia)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Creatives Blueprints */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Video className="w-4 h-4 text-blue-600" />
          <span>Blueprints de Criativos Recomendados para {realSiteData.brandName}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ads.creatives.map((creative, index) => (
            <div key={index} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
              
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold uppercase border border-blue-200">
                  {creative.format}
                </span>
                <span className="text-xs text-slate-500 font-medium">Ângulo #{index + 1}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">{creative.angleName}</h4>
                <p className="text-xs text-slate-500 mt-0.5">Público: {creative.targetAudience}</p>
              </div>

              {/* Hook Card */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  Gancho dos Primeiros 3 Segundos (Hook):
                </p>
                <p className="text-xs text-slate-900 italic font-semibold">"{creative.hook}"</p>
              </div>

              {/* Script / Body Copy */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Estrutura do Criativo:
                </p>
                <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{creative.bodyCopy}</p>
              </div>

              {/* CTA & Copy Action */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="text-xs">
                  <span className="text-slate-400 font-medium">CTA: </span>
                  <span className="font-bold text-slate-800">{creative.cta}</span>
                </div>
                
                <button
                  onClick={() => copyAdText(creative.bodyCopy, index)}
                  className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  title="Copiar Texto do Anúncio"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
