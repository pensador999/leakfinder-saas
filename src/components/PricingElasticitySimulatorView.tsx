import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Sparkles, 
  Copy, 
  Check, 
  CreditCard, 
  Zap, 
  Layers, 
  Percent, 
  ShieldCheck, 
  ArrowRight,
  Info
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

  // Sliders State grounded in store's real average ticket
  const [productPrice, setProductPrice] = useState<number>(
    Number(input.averageOrderValue) || finances.groundedAverageTicket || 165
  );
  const [monthlyOrders, setMonthlyOrders] = useState<number>(450);
  const [pixDiscount, setPixDiscount] = useState<number>(10);
  const [creditCardMdr, setCreditCardMdr] = useState<number>(4.49);
  const [cogsPercent, setCogsPercent] = useState<number>(35);

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
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-emerald-600 rounded-2xl text-white shadow-md shadow-emerald-600/20">
            <Calculator className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Simulador de Elasticidade de Preço & Pix Dinâmico</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                Motor C • Modelo Financeiro D2C
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Calcule o impacto real no **Lucro Líquido (R$)** e na **Taxa de Conversão (+%)** ao trocar taxas pesadas de cartão por descontos agressivos no Pix.
            </p>
          </div>
        </div>

        {/* Extra Net Profit Highlight */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Lucro Líquido Adicional / Mês</p>
            <p className="text-2xl font-black text-emerald-400 leading-none mt-0.5 font-mono">
              +R$ {customScenario.netMarginDeltaMonthly.toLocaleString('pt-BR')}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">com {pixDiscount}% de Desconto no Pix</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Sliders Grid */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Percent className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Ajuste os Parâmetros da sua Operação em Tempo Real</h3>
          </div>
          <span className="text-xs text-slate-500">Cálculo instantâneo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Slider 1: Ticket Médio (Preço do Produto) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Preço / Ticket Médio:</label>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
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
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[10px] text-slate-500">Preço base antes do desconto</p>
          </div>

          {/* Slider 2: Volume de Pedidos / Mês */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Volume de Pedidos / Mês:</label>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
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
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <p className="text-[10px] text-slate-500">Volume atual de vendas</p>
          </div>

          {/* Slider 3: Desconto no Pix */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-900">Desconto Oferecido no Pix:</label>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-md">
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
              className="w-full h-2 bg-emerald-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-[10px] text-emerald-700 font-medium">Preço com Pix: R$ {(productPrice * (1 - pixDiscount / 100)).toFixed(2).replace('.', ',')}</p>
          </div>

        </div>
      </div>

      {/* 3 Main Result Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-emerald-800">Lift de Conversão (+%)</span>
            <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 text-[10px] font-bold rounded-md">+Elasticidade</span>
          </div>
          <p className="text-2xl font-black text-emerald-900 font-mono">
            +{customScenario.expectedConversionLiftPercent}%
          </p>
          <p className="text-xs text-emerald-700 leading-relaxed">
            De {monthlyOrders} para <strong>{customScenario.projectedMonthlyOrders} pedidos/mês</strong> pela queda de atrito no checkout.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-blue-800">Faturamento Projetado</span>
            <span className="px-2 py-0.5 bg-blue-200 text-blue-800 text-[10px] font-bold rounded-md">Receita Bruta</span>
          </div>
          <p className="text-2xl font-black text-blue-900 font-mono">
            R$ {customScenario.grossRevenueMonthly.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Aumento de volume compensa a margem unitária, gerando mais capital de giro.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Margem Líquida Total</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-md">Lucro no Bolso</span>
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            R$ {customScenario.netMarginTotalMonthly.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            {customScenario.roiSummary}
          </p>
        </div>

      </div>

      {/* Scenarios Comparison Matrix Table */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-slate-900">Matriz Comparativa de Cenários de Desconto Pix</h3>
          </div>
          <span className="text-xs text-slate-500">Comparação com o Cenário Atual</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                <th className="p-3">Estratégia</th>
                <th className="p-3">Preço Pix</th>
                <th className="p-3">Lift Pedidos</th>
                <th className="p-3">Pedidos/mês</th>
                <th className="p-3">Taxas Gateway</th>
                <th className="p-3 text-right">Lucro Líquido Extra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              
              {/* Baseline */}
              <tr className="bg-slate-50/50">
                <td className="p-3 font-sans font-bold text-slate-600">Sem Desconto Pix (Atual)</td>
                <td className="p-3 text-slate-500">R$ {productPrice.toFixed(2)}</td>
                <td className="p-3 text-slate-500">0%</td>
                <td className="p-3 text-slate-700">{simulation.baseline.monthlyOrders}</td>
                <td className="p-3 text-rose-600">R$ {simulation.baseline.gatewayFeesMonthly.toLocaleString('pt-BR')}</td>
                <td className="p-3 text-right font-sans text-slate-400">Linha Base</td>
              </tr>

              {/* Pix 5% */}
              <tr className={pixDiscount === 5 ? 'bg-emerald-50 font-bold' : ''}>
                <td className="p-3 font-sans font-bold text-slate-800">Pix com 5% OFF</td>
                <td className="p-3 text-slate-800">R$ {simulation.scenarios.pix5.priceAfterDiscount.toFixed(2)}</td>
                <td className="p-3 text-emerald-600">+{simulation.scenarios.pix5.expectedConversionLiftPercent}%</td>
                <td className="p-3 text-slate-800">{simulation.scenarios.pix5.projectedMonthlyOrders}</td>
                <td className="p-3 text-slate-700">R$ {simulation.scenarios.pix5.gatewayFeesTotalMonthly.toLocaleString('pt-BR')}</td>
                <td className="p-3 text-right font-bold text-emerald-600">+R$ {simulation.scenarios.pix5.netMarginDeltaMonthly.toLocaleString('pt-BR')}</td>
              </tr>

              {/* Pix 7% */}
              <tr className={pixDiscount === 7 ? 'bg-emerald-50 font-bold' : ''}>
                <td className="p-3 font-sans font-bold text-slate-800">Pix com 7% OFF</td>
                <td className="p-3 text-slate-800">R$ {simulation.scenarios.pix7.priceAfterDiscount.toFixed(2)}</td>
                <td className="p-3 text-emerald-600">+{simulation.scenarios.pix7.expectedConversionLiftPercent}%</td>
                <td className="p-3 text-slate-800">{simulation.scenarios.pix7.projectedMonthlyOrders}</td>
                <td className="p-3 text-slate-700">R$ {simulation.scenarios.pix7.gatewayFeesTotalMonthly.toLocaleString('pt-BR')}</td>
                <td className="p-3 text-right font-bold text-emerald-600">+R$ {simulation.scenarios.pix7.netMarginDeltaMonthly.toLocaleString('pt-BR')}</td>
              </tr>

              {/* Pix 10% */}
              <tr className={pixDiscount === 10 ? 'bg-emerald-50 font-bold border-2 border-emerald-400' : 'bg-emerald-50/30'}>
                <td className="p-3 font-sans font-bold text-emerald-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Pix com 10% OFF (Campeão D2C)
                </td>
                <td className="p-3 text-emerald-900 font-bold">R$ {simulation.scenarios.pix10.priceAfterDiscount.toFixed(2)}</td>
                <td className="p-3 text-emerald-600 font-bold">+{simulation.scenarios.pix10.expectedConversionLiftPercent}%</td>
                <td className="p-3 text-emerald-950 font-bold">{simulation.scenarios.pix10.projectedMonthlyOrders}</td>
                <td className="p-3 text-slate-700">R$ {simulation.scenarios.pix10.gatewayFeesTotalMonthly.toLocaleString('pt-BR')}</td>
                <td className="p-3 text-right font-bold text-emerald-700 text-sm">+R$ {simulation.scenarios.pix10.netMarginDeltaMonthly.toLocaleString('pt-BR')}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* 📦 Ready-to-Paste Shopify Liquid Dynamic Banner Snippet */}
      <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4" /> Código do Box Dinâmico de Pix ({pixDiscount}% OFF) para o Tema
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Calcula a economia e o preço no Pix automaticamente na página do produto.
            </p>
          </div>
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-md shadow-emerald-600/20"
          >
            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCode ? 'Código Copiado!' : 'Copiar Box Liquid Pix'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-950 rounded-2xl text-xs font-mono text-slate-300 overflow-x-auto border border-slate-800 leading-relaxed max-h-56">
          {simulation.liquidPixBadgeSnippet}
        </pre>
      </div>

    </div>
  );
};
