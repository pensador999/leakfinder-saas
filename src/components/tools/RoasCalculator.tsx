import React, { useState } from 'react';
import { Calculator, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

export const RoasCalculator: React.FC = () => {
  const [adSpend, setAdSpend] = useState(5000);
  const [cpc, setCpc] = useState(1.50);
  const [conversionRate, setConversionRate] = useState(1.8);
  const [aov, setAov] = useState(180);
  const [marginPercent, setMarginPercent] = useState(60);

  // Dynamic calculations
  const estimatedClicks = Math.round(adSpend / (cpc || 1));
  const estimatedOrders = Math.round(estimatedClicks * (conversionRate / 100));
  const grossRevenue = Math.round(estimatedOrders * aov);
  const roas = adSpend > 0 ? (grossRevenue / adSpend).toFixed(2) : '0';
  const cogs = grossRevenue * (1 - marginPercent / 100);
  const netProfit = Math.round(grossRevenue - adSpend - cogs);
  const breakEvenRoas = (100 / marginPercent).toFixed(2);
  const currentCac = estimatedOrders > 0 ? Math.round(adSpend / estimatedOrders) : 0;

  return (
    <div className="space-y-6">
      
      {/* Tool Header */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-900">Simulador LeakFinder de Funil & ROAS de Equilíbrio</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Simule variações de tráfego, taxa de conversão do site e margem bruta para prever o lucro real.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sliders Form */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-white border border-slate-200 space-y-5 shadow-xs font-medium">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Parâmetros do Seu Negócio</h3>

          {/* Ad Spend Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-600">Investimento em Ads/Mês:</span>
              <span className="font-mono font-bold text-blue-600">R$ {adSpend.toLocaleString('pt-BR')}</span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* CPC Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-600">Custo por Clique (CPC Médio):</span>
              <span className="font-mono font-bold text-slate-900">R$ {cpc.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="10.00"
              step="0.10"
              value={cpc}
              onChange={(e) => setCpc(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Conversion Rate Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-600">Taxa de Conversão do Site:</span>
              <span className="font-mono font-bold text-blue-700">{conversionRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* AOV Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-600">Ticket Médio (AOV):</span>
              <span className="font-mono font-bold text-emerald-600">R$ {aov}</span>
            </div>
            <input
              type="range"
              min="30"
              max="1000"
              step="10"
              value={aov}
              onChange={(e) => setAov(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Margin Percent Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-slate-600">Margem Bruta do Produto:</span>
              <span className="font-mono font-bold text-amber-600">{marginPercent}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={marginPercent}
              onChange={(e) => setMarginPercent(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Dynamic KPI Outputs */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">ROAS Obtido</span>
              <p className={`text-2xl font-bold font-mono ${Number(roas) >= Number(breakEvenRoas) ? 'text-emerald-600' : 'text-rose-600'}`}>
                {roas}x
              </p>
              <span className="text-[10px] text-slate-400 font-medium">Equilíbrio: {breakEvenRoas}x</span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Faturamento Bruto</span>
              <p className="text-2xl font-bold font-mono text-blue-600">R$ {grossRevenue.toLocaleString('pt-BR')}</p>
              <span className="text-[10px] text-slate-400 font-medium">{estimatedOrders} vendas</span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Lucro Líquido Est.</span>
              <p className={`text-2xl font-bold font-mono ${netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                R$ {netProfit.toLocaleString('pt-BR')}
              </p>
              <span className="text-[10px] text-slate-400 font-medium">Após Ads e Custos</span>
            </div>

            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">CAC Médio</span>
              <p className="text-2xl font-bold font-mono text-slate-900">R$ {currentCac}</p>
              <span className="text-[10px] text-slate-400 font-medium">Custo por Cliente</span>
            </div>

          </div>

          {/* Strategic Analysis Box */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Veredito Estratégico LeakFinder</span>
            </h3>

            {Number(roas) < Number(breakEvenRoas) ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1 font-medium">
                <p className="font-bold flex items-center gap-1.5 text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Alerta: Campanha Operando no Prejuízo ou Margem Apertada
                </p>
                <p>
                  Seu ROAS ({roas}x) está abaixo do ponto de equilíbrio ({breakEvenRoas}x). Ações para recuperar a margem:
                </p>
                <ul className="list-disc pl-4 space-y-1 pt-1 text-slate-700">
                  <li>Aumente a Taxa de Conversão do site de {conversionRate}% para {(conversionRate + 0.8).toFixed(1)}% ativando o Sticky Buy Button mobile.</li>
                  <li>Crie Bundles para subir o Ticket Médio de R$ {aov} para R$ {Math.round(aov * 1.3)}.</li>
                </ul>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1 font-medium">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Operação Lucrativa com Escala Liberada!
                </p>
                <p>
                  Seu ROAS atual de **{roas}x** supera o limite de equilíbrio de **{breakEvenRoas}x**, gerando um lucro líquido estimado de **R$ {netProfit.toLocaleString('pt-BR')}**.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
