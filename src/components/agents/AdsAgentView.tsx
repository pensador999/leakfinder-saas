import React, { useState } from 'react';
import { Target, Video, Copy, Check, Layers, DollarSign, Calculator, Sparkles, TrendingUp, ShieldAlert, ArrowRight, ExternalLink, ShoppingBag, Factory } from 'lucide-react';
import type { AgentDiagnosticResult } from '../../types/index.ts';
import { isCatalogProductBroken } from '../../services/siteInspector.ts';

interface AdsAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const AdsAgentView: React.FC<AdsAgentViewProps> = ({ diagnostic }) => {
  const { ads, input, realSiteData } = diagnostic;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Format helper with mandatory 2 decimal digits
  const formatBRLValue = (val: number) => `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Dynamic Custom Budget State (defaults to simulated spend or realistic non-rounded default)
  const defaultBudget = ads.monthlyAdBudgetSuggested || 5420.50;
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

  const catalogIssues = realSiteData.catalogAudit?.issues || [];
  const brokenItems = catalogIssues.filter(isCatalogProductBroken);
  const brokenInHouse = brokenItems.filter(i => i.manufacturingType !== 'REVENDA');
  const brokenResale = brokenItems.filter(i => i.manufacturingType === 'REVENDA');
  const monthlyLoss = realSiteData.catalogAudit?.monthlyLossEstimateBRL !== undefined
    ? Number(realSiteData.catalogAudit.monthlyLossEstimateBRL.toFixed(2))
    : Number((brokenItems.length * 1384.65).toFixed(2));

  const coldSpend = Number((customBudget * 0.60).toFixed(2));
  const retargetSpend = Number((customBudget * 0.25).toFixed(2));
  const testSpend = Number((customBudget * 0.15).toFixed(2));

  const estimatedReturnRevenue = Number((customBudget * ads.targetRoas).toFixed(2));
  const estimatedOrders = Math.round(estimatedReturnRevenue / (input.averageOrderValue || 220));

  return (
    <div className="space-y-6 font-sans">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md">
            <Target className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-[#FFFCE1]">Agente de Mídia Paga (Ads Strategist)</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#00BAE2]/10 text-[#00BAE2] rounded-full border border-[#00BAE2]/20">
                Meta Ads, Google Shopping & TikTok
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 font-medium max-w-xl">
              Estratégia de distribuição percentual de verba, cálculo de ROAS/CAC máximo tolerável e roteiros de criativos adaptados para {realSiteData.brandName}.
            </p>
          </div>
        </div>

        {/* Global Key Metrics */}
        <div className="flex items-center gap-6 px-5 py-3 bg-[#141716] rounded-2xl border border-white/10">
          <div className="text-center">
            <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-bold">ROAS Alvo</p>
            <p className="text-xl font-black font-mono text-[#0AE448]">{ads.targetRoas}x</p>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-bold">CAC Máximo</p>
            <p className="text-xl font-black font-mono text-[#00BAE2]">R$ {ads.maxCacAllowed}</p>
          </div>
        </div>
      </div>

      {/* 🚨 AD WASTE & RUPTURE RISK CARD (GROUNDED & TRANSPARENT) */}
      {brokenItems.length > 0 ? (
        <div className="p-6 rounded-3xl bg-[#101211] border border-rose-500/30 shadow-2xl space-y-4 text-[#FFFCE1]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-black text-rose-300">
                    Risco de Mídia Paga: SKUs com Grade Incompleta
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {brokenItems.length} SKUs com Furo de Grade
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-mono font-extrabold uppercase rounded-full border ${
                    realSiteData.hasMetaPixel
                      ? 'bg-[#0AE448]/10 text-[#0AE448] border-[#0AE448]/30'
                      : 'bg-white/5 text-[#BBBAA6] border-white/10'
                  }`}>
                    {realSiteData.hasMetaPixel ? '✓ Meta Pixel Ativo (<head>)' : '⚪ Pixel Meta Não Detectado'}
                  </span>
                </div>
                <p className="text-xs text-[#BBBAA6] mt-1">
                  <strong className="text-rose-300">Risco Condicional:</strong> SE houver anúncios no Meta Ads direcionando para estes SKUs, estima-se que ~60% dos cliques sejam perdidos pela falta dos tamanhos centrais (M, G, GG).
                </p>
              </div>
            </div>

            <div className="px-4 py-2 bg-[#141716] rounded-xl border border-rose-500/30 text-right shrink-0">
              <span className="text-[10px] uppercase font-mono font-bold text-[#BBBAA6] block">[Simulação] Sangria em Tráfego</span>
              <span className="text-lg font-black font-mono text-rose-400">- {formatBRLValue(monthlyLoss)}/mês</span>
            </div>
          </div>

          {/* Official Verification Button */}
          <div className="p-3 bg-[#141716] rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="text-[#BBBAA6]">
              <span className="font-bold text-[#FFFCE1]">Transparência Técnica AdShield:</span> Verifique se sua marca está veiculando anúncios para estes SKUs na ferramenta pública e oficial da Meta.
            </div>
            <a
              href={`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=${encodeURIComponent(realSiteData.brandName)}&search_type=keyword_unordered&media_type=all`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl font-black text-xs shrink-0 transition-colors shadow-md shadow-[#0AE448]/20"
            >
              <span>Consultar Meta Ad Library Oficial</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Breakdown Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 bg-[#141716] rounded-2xl border border-white/10 text-xs">
              <span className="font-bold text-[#FFFCE1] flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                <span>Linha de Revenda Externa ({brokenResale.length} itens)</span>
              </span>
              <p className="text-[#BBBAA6] text-[11px] mt-1">
                <strong className="text-rose-400">Ação Preventiva:</strong> Conferir campanhas ativas no Meta Ads. Se estiverem anunciados, pausar ou redirecionar o tráfego para produtos com grade cheia.
              </p>
            </div>
            <div className="p-3.5 bg-[#141716] rounded-2xl border border-white/10 text-xs">
              <span className="font-bold text-[#FFFCE1] flex items-center gap-1.5">
                <Factory className="w-3.5 h-3.5 text-[#00BAE2]" />
                <span>Fabricação Própria ({brokenInHouse.length} itens)</span>
              </span>
              <p className="text-[#BBBAA6] text-[11px] mt-1">
                <strong className="text-[#00BAE2]">Ação no PCP:</strong> Programar reposição prioritária dos tamanhos centrais e priorizar criativos das estampas com grade 100% ativa.
              </p>
            </div>
          </div>

          {/* Broken Items Table Preview */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono font-bold uppercase text-rose-300 tracking-wider">SKUs Inspecionados com Risco de Rejeição de Tráfego:</span>
            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {brokenItems.slice(0, 5).map((item, idx) => (
                <div key={idx} className="p-2.5 bg-[#141716] rounded-xl border border-white/5 flex items-center justify-between text-xs">
                  <div className="truncate max-w-md">
                    <span className="font-bold text-[#FFFCE1]">{item.productTitle}</span>
                    <span className="text-[10px] text-[#BBBAA6] ml-2">({item.manufacturingType === 'REVENDA' ? 'Revenda' : 'Própria'})</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-mono font-bold text-[10px]">
                      Faltam: [{item.missingSizes.join(', ')}]
                    </span>
                    <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="text-[#0AE448] hover:underline text-[10px] font-bold flex items-center gap-0.5">
                      Ver <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-3xl bg-[#101211] border border-[#0AE448]/30 shadow-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#FFFCE1]">Catálogo 100% Blindado contra Ruptura de Estoque</h4>
              <p className="text-xs text-[#BBBAA6]">Todos os produtos possuem tamanhos centrais disponíveis. Verba de mídia segura para escala.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-[#0AE448]/10 text-[#0AE448] font-bold font-mono text-xs rounded-full border border-[#0AE448]/30">
            R$ 0,00 Desperdício
          </span>
        </div>
      )}

      {/* 🎛️ DYNAMIC BUDGET CALCULATOR */}
      <div className="p-6 rounded-3xl bg-[#101211] text-[#FFFCE1] border border-white/10 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-[#0AE448]" />
              <h3 className="text-sm font-black uppercase tracking-wider text-[#0AE448]">
                Simulador Dinâmico de Investimento em Tráfego
              </h3>
            </div>
            <p className="text-xs text-[#BBBAA6]">
              Insira o orçamento mensal real que você deseja investir para ver a alocação técnica ideal entre Topo, Remarketing e Testes:
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {[3000, 5000, 10000, 20000].map((preset) => (
              <button
                key={preset}
                onClick={() => setCustomBudget(preset)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  customBudget === preset
                    ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                    : 'bg-[#141716] text-[#BBBAA6] border border-white/10 hover:bg-white/5 hover:text-white'
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
          <div className="md:col-span-4 p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-2">
            <label className="text-[11px] font-mono font-bold text-[#BBBAA6] uppercase flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#0AE448]" /> Orçamento Mensal em Anúncios:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-xs text-[#BBBAA6] font-bold">R$</span>
              <input
                type="number"
                min="500"
                step="500"
                value={customBudget}
                onChange={(e) => setCustomBudget(Math.max(0, Number(e.target.value)))}
                className="w-full bg-[#0E100F] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-sm font-mono font-bold text-[#FFFCE1] focus:outline-none focus:border-[#0AE448]"
              />
            </div>
            <p className="text-[10px] text-[#BBBAA6] font-mono">
              Média diária: <strong className="text-white">R$ {(customBudget / 30).toFixed(2)}/dia</strong>
            </p>
          </div>

          {/* Return Projection */}
          <div className="md:col-span-8 p-4 rounded-2xl bg-[#141716] border border-[#0AE448]/30 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="space-y-0.5">
              <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-semibold">Faturamento Projetado (ROAS {ads.targetRoas}x)</p>
              <p className="text-xl font-black font-mono text-[#0AE448]">
                {formatBRLValue(estimatedReturnRevenue)}
              </p>
            </div>
            <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0">
              <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-semibold">Pedidos Estimados</p>
              <p className="text-xl font-black font-mono text-[#FFFCE1]">
                ~{estimatedOrders} vendas
              </p>
            </div>
            <div className="space-y-0.5 border-t sm:border-t-0 sm:border-l border-white/10 pt-2 sm:pt-0">
              <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-semibold">Ticket Médio Estimado</p>
              <p className="text-xl font-black font-mono text-[#FFFCE1]">
                {formatBRLValue(input.averageOrderValue || 220)}
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Budget Allocation Breakdown (Percentage Based) */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 space-y-4 shadow-2xl">
        <h3 className="text-sm font-black text-[#FFFCE1] uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#0AE448]" />
          <span>Estrutura Percentual de Campanhas Recomendada</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-medium">
          
          <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#FFFCE1]">Topo de Funil (Tráfego Frio)</span>
              <span className="font-mono font-bold text-[#00BAE2] bg-[#00BAE2]/10 px-2 py-0.5 rounded-full border border-[#00BAE2]/20">
                60%
              </span>
            </div>
            <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
              {isFishing
                ? 'Públicos amplos de Pesca Esportiva, Náutica, Camping e Lookalikes de compradores.'
                : isAgro
                ? 'Públicos de Agronegócio, Pecuária, Vida no Campo e Regiões Produtoras (Centro-Oeste, Sul e Interior de SP/MG).'
                : isMotors
                ? 'Públicos de Motocross, Trilha Off-road, Enduro e Apaixonados por Duas Rodas.'
                : 'Públicos de interesse no nicho e Lookalikes de compradores 1%.'}
            </p>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-[#BBBAA6] text-[11px]">Orçamento:</span>
              <span className="font-mono text-[#FFFCE1] font-bold">{formatBRLValue(coldSpend)}/mês ({formatBRLValue(coldSpend / 30)}/dia)</span>
            </div>
          </div>

          <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#FFFCE1]">Meio & Fundo (Retargeting DPA)</span>
              <span className="font-mono font-bold text-[#0AE448] bg-[#0AE448]/10 px-2 py-0.5 rounded-full border border-[#0AE448]/20">
                25%
              </span>
            </div>
            <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
              Engajamento Instagram 30d, Visitantes da Loja 14d e Catálogo Dinâmico (DPA) para quem visualizou produtos ou abandonou carrinho.
            </p>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-[#BBBAA6] text-[11px]">Orçamento:</span>
              <span className="font-mono text-[#0AE448] font-bold">{formatBRLValue(retargetSpend)}/mês ({formatBRLValue(retargetSpend / 30)}/dia)</span>
            </div>
          </div>

          <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-[#FFFCE1]">Laboratório de Teste de Criativos</span>
              <span className="font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
                15%
              </span>
            </div>
            <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
              Campanha CBO isolada para testar semanalmente novos ganchos (Hooks de 3 segundos), depoimentos de clientes e carrosséis.
            </p>
            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
              <span className="text-[#BBBAA6] text-[11px]">Orçamento:</span>
              <span className="font-mono text-[#FFFCE1] font-bold">{formatBRLValue(testSpend)}/mês ({formatBRLValue(testSpend / 30)}/dia)</span>
            </div>
          </div>

        </div>
      </div>

      {/* Creatives Blueprints */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-[#FFFCE1] uppercase tracking-wider flex items-center gap-2">
          <Video className="w-4 h-4 text-[#0AE448]" />
          <span>Blueprints de Criativos Recomendados para {realSiteData.brandName}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ads.creatives.map((creative, index) => (
            <div key={index} className="p-5 rounded-3xl bg-[#101211] border border-white/10 space-y-4 shadow-2xl">
              
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 bg-[#00BAE2]/10 text-[#00BAE2] rounded-lg text-[10px] font-mono font-bold uppercase border border-[#00BAE2]/20">
                  {creative.format}
                </span>
                <span className="text-xs text-[#BBBAA6] font-mono font-medium">Ângulo #{index + 1}</span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#FFFCE1]">{creative.angleName}</h4>
                <p className="text-xs text-[#BBBAA6] mt-0.5">Público: {creative.targetAudience}</p>
              </div>

              {/* Hook Card */}
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 space-y-1">
                <p className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider">
                  Gancho dos Primeiros 3 Segundos (Hook):
                </p>
                <p className="text-xs text-[#FFFCE1] italic font-semibold">"{creative.hook}"</p>
              </div>

              {/* Script / Body Copy */}
              <div className="p-3 bg-[#141716] rounded-2xl border border-white/10 space-y-1">
                <p className="text-[10px] font-mono font-bold text-[#BBBAA6] uppercase tracking-wider">
                  Estrutura do Criativo:
                </p>
                <p className="text-xs text-[#BBBAA6] whitespace-pre-line leading-relaxed">{creative.bodyCopy}</p>
              </div>

              {/* CTA & Copy Action */}
              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <div className="text-xs">
                  <span className="text-[#BBBAA6] font-medium">CTA: </span>
                  <span className="font-bold text-[#FFFCE1]">{creative.cta}</span>
                </div>
                
                <button
                  onClick={() => copyAdText(creative.bodyCopy, index)}
                  className="p-2 hover:bg-white/10 text-[#BBBAA6] hover:text-white rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer border border-transparent hover:border-white/10"
                  title="Copiar Texto do Anúncio"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#0AE448]" />
                      <span className="text-[#0AE448]">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
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
