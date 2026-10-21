import React, { useState, useEffect } from 'react';
import { Calculator, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useAuditStore } from '../../store/auditStore';
import { calculateStoreFinancialGrounding } from '../../services/ai/storeFinancialGroundingEngine';

export const RoasCalculator: React.FC = () => {
  const diagnostic = useAuditStore(state => state.diagnostic);
  const customMonthlyAdSpend = useAuditStore(state => state.customMonthlyAdSpend);
  const setCustomMonthlyAdSpend = useAuditStore(state => state.setCustomMonthlyAdSpend);

  const finances = diagnostic
    ? calculateStoreFinancialGrounding(diagnostic.realSiteData, diagnostic.input, diagnostic.social, customMonthlyAdSpend)
    : null;

  const initialSpend = finances ? Math.round(finances.estimatedAdSpend.monthly) : 5000;
  const initialAov = finances ? Math.round(finances.groundedAverageTicket) : 180;

  const [adSpend, setAdSpendState] = useState(initialSpend);
  const [cpc, setCpc] = useState(1.50);
  const [conversionRate, setConversionRate] = useState(1.8);
  const [aov, setAov] = useState(initialAov);
  const [marginPercent, setMarginPercent] = useState(60);

  useEffect(() => {
    if (finances) {
      setAdSpendState(Math.round(finances.estimatedAdSpend.monthly));
      setAov(Math.round(finances.groundedAverageTicket));
    }
  }, [diagnostic?.realSiteData.domain, customMonthlyAdSpend]);

  const setAdSpend = (val: number) => {
    setAdSpendState(val);
    setCustomMonthlyAdSpend(val);
  };

  // Dynamic calculations with exact cents precision
  const estimatedClicks = Math.round(adSpend / (cpc || 1));
  const estimatedOrders = Math.round(estimatedClicks * (conversionRate / 100));
  const grossRevenue = Number((estimatedOrders * aov).toFixed(2));
  const roas = adSpend > 0 ? (grossRevenue / adSpend).toFixed(2) : '0';
  const cogs = grossRevenue * (1 - marginPercent / 100);
  const netProfit = Number((grossRevenue - adSpend - cogs).toFixed(2));
  const breakEvenRoas = (100 / marginPercent).toFixed(2);
  const currentCac = estimatedOrders > 0 ? Number((adSpend / estimatedOrders).toFixed(2)) : 0;

  return (
    <div className="space-y-6 text-[#FFFCE1]">
      
      {/* Tool Header */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 flex items-center justify-between shadow-2xl">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0AE448]/20 text-[#0AE448] rounded-xl border border-[#0AE448]/30">
              <Calculator className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-[#FFFCE1]">Simulador AdShield de Funil & ROAS de Equilíbrio</h2>
          </div>
          <p className="text-xs text-[#BBBAA6] mt-1 font-medium">
            Simule variações de tráfego, taxa de conversão do site e margem bruta para prever o lucro real.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sliders Form */}
        <div className="lg:col-span-1 p-5 rounded-3xl bg-[#101211] border border-white/10 space-y-5 shadow-2xl font-medium">
          <h3 className="text-xs font-bold text-[#BBBAA6] uppercase tracking-wider font-mono">Parâmetros do Seu Negócio</h3>

          {/* Ad Spend Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#BBBAA6]">Investimento em Ads/Mês:</span>
              <span className="font-mono font-bold text-[#0AE448]">R$ {adSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-full accent-[#0AE448] cursor-pointer"
            />
          </div>

          {/* CPC Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#BBBAA6]">Custo por Clique (CPC Médio):</span>
              <span className="font-mono font-bold text-white">R$ {cpc.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="10.00"
              step="0.10"
              value={cpc}
              onChange={(e) => setCpc(Number(e.target.value))}
              className="w-full accent-[#0AE448] cursor-pointer"
            />
          </div>

          {/* Conversion Rate Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#BBBAA6]">Taxa de Conversão do Site:</span>
              <span className="font-mono font-bold text-[#00BAE2]">{conversionRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              className="w-full accent-[#00BAE2] cursor-pointer"
            />
          </div>

          {/* AOV Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#BBBAA6]">Ticket Médio (AOV):</span>
              <span className="font-mono font-bold text-[#0AE448]">R$ {aov}</span>
            </div>
            <input
              type="range"
              min="30"
              max="1000"
              step="10"
              value={aov}
              onChange={(e) => setAov(Number(e.target.value))}
              className="w-full accent-[#0AE448] cursor-pointer"
            />
          </div>

          {/* Margin Percent Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#BBBAA6]">Margem Bruta do Produto:</span>
              <span className="font-mono font-bold text-amber-400">{marginPercent}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="5"
              value={marginPercent}
              onChange={(e) => setMarginPercent(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        {/* Dynamic KPI Outputs */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl shadow-xl">
              <span className="text-[10px] text-[#BBBAA6] uppercase font-semibold font-mono">ROAS Obtido</span>
              <p className={`text-2xl font-bold font-mono mt-0.5 ${Number(roas) >= Number(breakEvenRoas) ? 'text-[#0AE448]' : 'text-rose-400'}`}>
                {roas}x
              </p>
              <span className="text-[10px] text-slate-500 font-medium">Equilíbrio: {breakEvenRoas}x</span>
            </div>

            <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl shadow-xl">
              <span className="text-[10px] text-[#BBBAA6] uppercase font-semibold font-mono">Faturamento Bruto</span>
              <p className="text-2xl font-bold font-mono text-[#00BAE2] mt-0.5">R$ {grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <span className="text-[10px] text-slate-500 font-medium">{estimatedOrders} vendas</span>
            </div>

            <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl shadow-xl">
              <span className="text-[10px] text-[#BBBAA6] uppercase font-semibold font-mono">Lucro Líquido Est.</span>
              <p className={`text-2xl font-bold font-mono mt-0.5 ${netProfit >= 0 ? 'text-[#0AE448]' : 'text-rose-400'}`}>
                R$ {netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <span className="text-[10px] text-slate-500 font-medium">Após Ads e Custos</span>
            </div>

            <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl shadow-xl">
              <span className="text-[10px] text-[#BBBAA6] uppercase font-semibold font-mono">CAC Médio</span>
              <p className="text-2xl font-bold font-mono text-white mt-0.5">R$ {currentCac.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <span className="text-[10px] text-slate-500 font-medium">Custo por Cliente</span>
            </div>

          </div>

          {/* Strategic Analysis Box */}
          <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 space-y-3 shadow-2xl">
            <h3 className="text-sm font-bold text-[#FFFCE1] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#0AE448]" />
              <span>Veredito Estratégico AdShield</span>
            </h3>

            {Number(roas) < Number(breakEvenRoas) ? (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-300 space-y-1 font-medium">
                <p className="font-bold flex items-center gap-1.5 text-amber-400">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Alerta: Campanha Operando no Prejuízo ou Margem Apertada
                </p>
                <p className="text-[#BBBAA6]">
                  Seu ROAS ({roas}x) está abaixo do ponto de equilíbrio ({breakEvenRoas}x). Ações para recuperar a margem:
                </p>
                <ul className="list-disc pl-4 space-y-1 pt-1 text-[#FFFCE1]">
                  <li>Aumente a Taxa de Conversão do site de {conversionRate}% para {(conversionRate + 0.8).toFixed(1)}% ativando o Sticky Buy Button mobile.</li>
                  <li>Crie Bundles para subir o Ticket Médio de R$ {aov} para R$ {Math.round(aov * 1.3)}.</li>
                </ul>
              </div>
            ) : (
              <div className="p-4 bg-[#0AE448]/10 border border-[#0AE448]/30 rounded-2xl text-xs text-[#0AE448] space-y-1 font-medium">
                <p className="font-bold flex items-center gap-1.5 text-[#0AE448]">
                  <ShieldCheck className="w-4 h-4 text-[#0AE448]" />
                  Operação Lucrativa com Escala Liberada!
                </p>
                <p className="text-[#FFFCE1]">
                  Seu ROAS atual de <strong className="text-[#0AE448]">{roas}x</strong> supera o limite de equilíbrio de <strong className="text-[#0AE448]">{breakEvenRoas}x</strong>, gerando um lucro líquido estimado de <strong className="text-[#0AE448]">R$ {netProfit.toLocaleString('pt-BR')}</strong>.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
