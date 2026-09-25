import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Sparkles, 
  Copy, 
  Check, 
  Zap, 
  Layers, 
  Percent 
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { calculatePricingElasticity, PricingElasticityResult } from '../services/pricingElasticityEngine';
import { calculateStoreFinancialGrounding } from '../services/ai/storeFinancialGroundingEngine';

interface PricingElasticitySimulatorViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const PricingElasticitySimulatorView: React.FC<PricingElasticitySimulatorViewProps> = ({ diagnostic }) => {
  const { realSiteData, input, social } = diagnostic;
  const [copiedCode, setCopiedCode] = useState(false);

  const finances = calculateStoreFinancialGrounding(realSiteData, input, social);

  // Sliders State grounded in store's real average ticket and revenue tier
  const groundedTicket = Number(input.averageOrderValue) || finances.groundedAverageTicket || 165;
  const initialMonthlyOrders = Math.max(40, Math.round(finances.estimatedMonthlyRevenue.min / Math.max(50, groundedTicket)));

  const [productPrice, setProductPrice] = useState<number>(groundedTicket);
  const [monthlyOrders, setMonthlyOrders] = useState<number>(initialMonthlyOrders);
  const [pixDiscount, setPixDiscount] = useState<number>(10);
  const [creditCardMdr] = useState<number>(4.49);
  const [cogsPercent] = useState<number>(35);

  const simulation: PricingElasticityResult = calculatePricingElasticity({
    productPrice,
    monthlyOrders,
    creditCardSharePercent: 70,
    pixSharePercent: 30,
    creditCardMdrPercent: creditCardMdr,
    pixMdrPercent: 0.79,
    cogsPercent,
    selectedPixDiscountPercent: pixDiscount
  });

  const handleCopyCode = () => {
    navigator.clipboard.writeText(simulation.liquidPixBadgeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const customScenario = simulation.scenarios.custom;

  return (
    <div className="space-y-6 font-sans text-[#FFFCE1]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md shadow-[#0AE448]/10">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#FFFCE1]">Simulador de Elasticidade de Preço & Pix Dinâmico</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20">
                Motor C • Modelo Financeiro D2C
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              Calcule o impacto real no <strong className="text-[#FFFCE1]">Lucro Líquido (R$)</strong> e na <strong className="text-[#FFFCE1]">Taxa de Conversão (+%)</strong> ao trocar taxas pesadas de cartão por descontos agressivos no Pix.
            </p>
          </div>
        </div>

        {/* Extra Net Profit Highlight */}
        <div className="p-4 bg-[#141716] border border-white/10 text-[#FFFCE1] rounded-2xl flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end shadow-xl">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Lucro Líquido Adicional / Mês</p>
            <p className="text-2xl font-black text-[#0AE448] leading-none mt-0.5 font-mono">
              +R$ {customScenario.netMarginDeltaMonthly.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] text-[#BBBAA6] mt-1 font-mono">com {pixDiscount}% de Desconto no Pix</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#0AE448]/10 border border-[#0AE448]/20 flex items-center justify-center text-[#0AE448]">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Sliders Grid */}
      <div className="p-6 bg-[#101211] rounded-3xl border border-white/10 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-[#00BAE2]" />
            <h3 className="font-bold text-sm text-[#FFFCE1]">Ajuste os Parâmetros da sua Operação em Tempo Real</h3>
          </div>
          <span className="text-xs text-[#BBBAA6] font-mono">Cálculo instantâneo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Slider 1: Ticket Médio (Preço do Produto) */}
          <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#BBBAA6]">Preço / Ticket Médio:</label>
              <span className="text-xs font-mono font-bold text-[#00BAE2] bg-[#00BAE2]/10 px-2 py-0.5 rounded-md border border-[#00BAE2]/20">
                R$ {productPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="600"
              step="5"
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              className="w-full h-2 bg-[#0E100F] rounded-lg appearance-none cursor-pointer accent-[#0AE448]"
            />
            <p className="text-[10px] text-[#BBBAA6]">Preço base antes do desconto</p>
          </div>

          {/* Slider 2: Volume de Pedidos / Mês */}
          <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#BBBAA6]">Volume de Pedidos / Mês:</label>
              <span className="text-xs font-mono font-bold text-[#0AE448] bg-[#0AE448]/10 px-2 py-0.5 rounded-md border border-[#0AE448]/20">
                {monthlyOrders} pedidos
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="3000"
              step="50"
              value={monthlyOrders}
              onChange={(e) => setMonthlyOrders(Number(e.target.value))}
              className="w-full h-2 bg-[#0E100F] rounded-lg appearance-none cursor-pointer accent-[#0AE448]"
            />
            <p className="text-[10px] text-[#BBBAA6]">Volume atual de vendas</p>
          </div>

          {/* Slider 3: Desconto no Pix */}
          <div className="p-4 bg-[#141716] border border-[#0AE448]/30 rounded-2xl space-y-2 shadow-lg shadow-[#0AE448]/5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#0AE448]">Desconto Oferecido no Pix:</label>
              <span className="text-xs font-mono font-bold text-[#0AE448] bg-[#0AE448]/20 px-2 py-0.5 rounded-md border border-[#0AE448]/30">
                {pixDiscount}% OFF
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={pixDiscount}
              onChange={(e) => setPixDiscount(Number(e.target.value))}
              className="w-full h-2 bg-[#0E100F] rounded-lg appearance-none cursor-pointer accent-[#0AE448]"
            />
            <p className="text-[10px] text-[#0AE448] font-medium font-mono">Preço com Pix: R$ {(productPrice * (1 - pixDiscount / 100)).toFixed(2).replace('.', ',')}</p>
          </div>

        </div>
      </div>

      {/* 3 Main Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#101211] border border-[#0AE448]/30 space-y-1 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#0AE448] font-mono">Lift de Conversão (+%)</span>
            <span className="px-2 py-0.5 bg-[#0AE448]/10 text-[#0AE448] text-[10px] font-bold rounded-md font-mono border border-[#0AE448]/20">+Elasticidade</span>
          </div>
          <p className="text-2xl font-black text-[#0AE448] font-mono">
            +{customScenario.expectedConversionLiftPercent}%
          </p>
          <p className="text-xs text-[#BBBAA6] leading-relaxed">
            De {monthlyOrders} para <strong className="text-[#FFFCE1]">{customScenario.projectedMonthlyOrders} pedidos/mês</strong> pela queda de atrito no checkout.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#101211] border border-white/10 space-y-1 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#00BAE2] font-mono">Faturamento Projetado</span>
            <span className="px-2 py-0.5 bg-[#00BAE2]/10 text-[#00BAE2] text-[10px] font-bold rounded-md font-mono border border-[#00BAE2]/20">Receita Bruta</span>
          </div>
          <p className="text-2xl font-black text-[#FFFCE1] font-mono">
            R$ {customScenario.grossRevenueMonthly.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-[#BBBAA6] leading-relaxed">
            Aumento de volume compensa a margem unitária, gerando mais capital de giro.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#141716] border border-[#0AE448]/40 text-[#FFFCE1] space-y-1 shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#BBBAA6] font-mono">Margem Líquida Total</span>
            <span className="px-2 py-0.5 bg-[#0AE448]/20 text-[#0AE448] text-[10px] font-bold rounded-md font-mono border border-[#0AE448]/30">Lucro no Bolso</span>
          </div>
          <p className="text-2xl font-black text-[#0AE448] font-mono">
            R$ {customScenario.netMarginTotalMonthly.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-[#BBBAA6] leading-relaxed">
            {customScenario.roiSummary}
          </p>
        </div>

      </div>

      {/* Scenarios Comparison Matrix Table */}
      <div className="p-6 bg-[#101211] rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#00BAE2]" />
            <h3 className="font-bold text-sm text-[#FFFCE1]">Matriz Comparativa de Cenários de Desconto Pix</h3>
          </div>
          <span className="text-xs text-[#BBBAA6] font-mono">Comparação com o Cenário Atual</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#141716] border-b border-white/10 text-[#BBBAA6] font-mono uppercase text-[10px]">
                <th className="p-3">Estratégia</th>
                <th className="p-3">Preço Pix</th>
                <th className="p-3">Lift Pedidos</th>
                <th className="p-3">Pedidos/mês</th>
                <th className="p-3">Taxas Gateway</th>
                <th className="p-3 text-right">Lucro Líquido Extra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              
              {/* Baseline */}
              <tr className="bg-white/5">
                <td className="p-3 font-sans font-bold text-[#BBBAA6]">Sem Desconto Pix (Atual)</td>
                <td className="p-3 text-[#BBBAA6]">R$ {productPrice.toFixed(2)}</td>
                <td className="p-3 text-[#BBBAA6]">0%</td>
                <td className="p-3 text-[#FFFCE1]">{simulation.baseline.monthlyOrders}</td>
                <td className="p-3 text-rose-400">R$ {simulation.baseline.gatewayFeesMonthly.toLocaleString('pt-BR')}</td>
                <td className="p-3 text-right font-sans text-[#BBBAA6]">Linha Base</td>
              </tr>

              {/* Pix 5% */}
              <tr className={`transition-colors ${pixDiscount === 5 ? 'bg-[#0AE448]/10 font-bold' : 'hover:bg-white/5'}`}>
                <td className="p-3 font-sans font-bold text-[#FFFCE1]">Pix com 5% OFF</td>
                <td className="p-3 text-[#FFFCE1]">R$ {simulation.scenarios.pix5.priceAfterDiscount.toFixed(2)}</td>
                <td className="p-3 text-[#0AE448]">+{simulation.scenarios.pix5.expectedConversionLiftPercent}%</td>
                <td className="p-3 text-[#FFFCE1]">{simulation.scenarios.pix5.projectedMonthlyOrders}</td>
                <td className="p-3 text-[#BBBAA6]">R$ {simulation.scenarios.pix5.gatewayFeesTotalMonthly.toLocaleString('pt-BR')}</td>
                <td className="p-3 text-right font-bold text-[#0AE448]">+R$ {simulation.scenarios.pix5.netMarginDeltaMonthly.toLocaleString('pt-BR')}</td>
              </tr>

              {/* Pix 7% */}
              <tr className={`transition-colors ${pixDiscount === 7 ? 'bg-[#0AE448]/10 font-bold' : 'hover:bg-white/5'}`}>
                <td className="p-3 font-sans font-bold text-[#FFFCE1]">Pix com 7% OFF</td>
                <td className="p-3 text-[#FFFCE1]">R$ {simulation.scenarios.pix7.priceAfterDiscount.toFixed(2)}</td>
                <td className="p-3 text-[#0AE448]">+{simulation.scenarios.pix7.expectedConversionLiftPercent}%</td>
                <td className="p-3 text-[#FFFCE1]">{simulation.scenarios.pix7.projectedMonthlyOrders}</td>
                <td className="p-3 text-[#BBBAA6]">R$ {simulation.scenarios.pix7.gatewayFeesTotalMonthly.toLocaleString('pt-BR')}</td>
                <td className="p-3 text-right font-bold text-[#0AE448]">+R$ {simulation.scenarios.pix7.netMarginDeltaMonthly.toLocaleString('pt-BR')}</td>
              </tr>

              {/* Pix 10% */}
              <tr className={pixDiscount === 10 ? 'bg-[#0AE448]/15 font-bold border-2 border-[#0AE448]' : 'bg-[#0AE448]/5'}>
                <td className="p-3 font-sans font-bold text-[#0AE448] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#0AE448]" /> Pix com 10% OFF (Campeão D2C)
                </td>
                <td className="p-3 text-[#0AE448] font-bold">R$ {simulation.scenarios.pix10.priceAfterDiscount.toFixed(2)}</td>
                <td className="p-3 text-[#0AE448] font-bold">+{simulation.scenarios.pix10.expectedConversionLiftPercent}%</td>
                <td className="p-3 text-[#FFFCE1] font-bold">{simulation.scenarios.pix10.projectedMonthlyOrders}</td>
                <td className="p-3 text-[#BBBAA6]">R$ {simulation.scenarios.pix10.gatewayFeesTotalMonthly.toLocaleString('pt-BR')}</td>
                <td className="p-3 text-right font-bold text-[#0AE448] text-sm">+R$ {simulation.scenarios.pix10.netMarginDeltaMonthly.toLocaleString('pt-BR')}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* 📦 Ready-to-Paste Shopify Liquid Dynamic Banner Snippet */}
      <div className="p-6 bg-[#101211] rounded-3xl border border-white/10 text-[#FFFCE1] space-y-4 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div>
            <h3 className="font-bold text-sm text-[#0AE448] flex items-center gap-1.5 font-mono">
              <Zap className="w-4 h-4" /> Código do Box Dinâmico de Pix ({pixDiscount}% OFF) para o Tema
            </h3>
            <p className="text-xs text-[#BBBAA6] mt-0.5">
              Calcula a economia e o preço no Pix automaticamente na página do produto.
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-4 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-lg shadow-[#0AE448]/20"
          >
            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Código Copiado!' : 'Copiar Box Liquid Pix'}</span>
          </button>
        </div>

        <pre className="p-4 bg-[#0E100F] rounded-2xl text-xs font-mono text-[#BBBAA6] overflow-x-auto border border-white/10 leading-relaxed max-h-56">
          {simulation.liquidPixBadgeSnippet}
        </pre>
      </div>

    </div>
  );
};
