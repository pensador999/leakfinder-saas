import React, { useState } from 'react';
import { 
  Flame, 
  AlertTriangle, 
  TrendingDown, 
  DollarSign, 
  ShieldAlert, 
  Bell, 
  MessageCircle, 
  Check, 
  Copy, 
  Send, 
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  KeyRound,
  Sliders
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { analyzeStockRupture, StockRuptureAnalysisResult } from '../services/stockRuptureEngine';
import { generateWhatsAppLink } from '../services/whatsappLeadService';
import { OfficialIntegrationConnectModal } from './OfficialIntegrationConnectModal';
import { calculateStoreFinancialGrounding } from '../services/ai/storeFinancialGroundingEngine';

interface StockRuptureMonitorViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const StockRuptureMonitorView: React.FC<StockRuptureMonitorViewProps> = ({ diagnostic }) => {
  const { realSiteData, input, social } = diagnostic;

  const finances = calculateStoreFinancialGrounding(realSiteData, input, social);

  // Extract REAL broken sizes detected in the store's public catalog (Zero Hallucination)
  const realBrokenSizesFromCatalog = Array.from(
    new Set(
      (realSiteData.catalogAudit?.issues || [])
        .filter(i => !i.isFullPrintExempt)
        .flatMap(i => i.missingSizes || [])
    )
  );

  // Sliders & Selection State grounded in real audit data
  const [dailyAdSpend, setDailyAdSpend] = useState<number>(finances.estimatedAdSpend.daily || 300);
  const [productPrice, setProductPrice] = useState<number>(Number(input.averageOrderValue) || finances.groundedAverageTicket || 165);
  const [grossMargin, setGrossMargin] = useState<number>(Number(input.grossMargin) || 60);
  const [rupturedSizes, setRupturedSizes] = useState<string[]>(realBrokenSizesFromCatalog);
  const [alertPhone, setAlertPhone] = useState<string>('');
  const [copiedAlert, setCopiedAlert] = useState<boolean>(false);
  const [isAlertSubscribed, setIsAlertSubscribed] = useState<boolean>(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);

  const availableSizes = ['PP', 'P', 'M', 'G', 'GG', 'G1', 'G2'];

  const toggleSize = (size: string) => {
    if (rupturedSizes.includes(size)) {
      setRupturedSizes(rupturedSizes.filter(s => s !== size));
    } else {
      setRupturedSizes([...rupturedSizes, size]);
    }
  };

  const analysis: StockRuptureAnalysisResult = analyzeStockRupture({
    dailyAdSpend,
    productPrice,
    grossMarginPercent: grossMargin,
    rupturedSizes,
    totalSkusMonitored: realSiteData.catalogAudit?.issues.length || 24
  });

  const handleCopyAlert = () => {
    navigator.clipboard.writeText(analysis.whatsAppAlertPreview);
    setCopiedAlert(true);
    setTimeout(() => setCopiedAlert(false), 2000);
  };

  const handleTestWhatsAppAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertPhone.trim()) return;
    const waUrl = generateWhatsAppLink(alertPhone, analysis.whatsAppAlertPreview);
    window.open(waUrl, '_blank');
    setIsAlertSubscribed(true);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-rose-600 rounded-2xl text-white shadow-md shadow-rose-600/20">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Vigia 24h & Simulador de Ruptura de Estoque</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-rose-100 text-rose-900 border border-rose-200">
                Proteção de Tráfego Pago • MRR
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Descubra quanto dinheiro de anúncios no <strong>Meta Ads e Google Ads</strong> está sendo queimado em produtos com grade de tamanho esgotada.
            </p>
          </div>
        </div>

        {/* Financial Bleed Alert Badge */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Sangria Financeira Total Estimada</p>
            <p className="text-2xl font-black text-rose-400 leading-none mt-0.5 font-mono">
              -R$ {analysis.totalMonthlyFinancialBleed.toLocaleString('pt-BR')} / mês
            </p>
            <p className="text-[10px] text-slate-400 mt-1">{analysis.estimatedDemandLossPercent}% do tráfego pago sem tamanho</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Sliders & Size Selection Grid */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-sm text-slate-900">Simule a Ruptura de Estoque da sua Operação</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              SIMULADOR DINÂMICO
            </span>
          </div>
          
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
          >
            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conectar Meta Ads Real</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Slider 1: Verba Diária de Anúncios */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Verba em Anúncios (Dia):</label>
              <span className="text-xs font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                R$ {dailyAdSpend}/dia
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={dailyAdSpend}
              onChange={(e) => setDailyAdSpend(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <p className="text-[10px] text-slate-500">Total investido no Meta/Google Ads</p>
          </div>

          {/* Slider 2: Ticket Médio do Produto */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Preço do Produto Anunciado:</label>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                R$ {productPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="500"
              step="10"
              value={productPrice}
              onChange={(e) => setProductPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[10px] text-slate-500">Valor de venda na vitrine</p>
          </div>

          {/* Selection: Tamanhos em Falta */}
          <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-2">
            <label className="text-xs font-bold text-rose-900 block">
              Selecione os Tamanhos Esgotados:
            </label>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {availableSizes.map((size) => {
                const isSelected = rupturedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-rose-600 text-white shadow-xs scale-105'
                        : 'bg-white text-slate-700 border border-slate-200 hover:border-rose-400'
                    }`}
                  >
                    {size} {isSelected ? '✕' : ''}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-rose-700 font-medium">
              {rupturedSizes.length > 0 ? `${rupturedSizes.join(', ')} esgotados` : 'Nenhum tamanho em falta'}
            </p>
          </div>

        </div>
      </div>

      {/* 3 Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-rose-800">Verba de Ads Queimada</span>
            <span className="px-2 py-0.5 bg-rose-200 text-rose-800 text-[10px] font-bold rounded-md">Tráfego Desperdiçado</span>
          </div>
          <p className="text-2xl font-black text-rose-900 font-mono">
            R$ {analysis.monthlyWastedAdSpend.toLocaleString('pt-BR')} / mês
          </p>
          <p className="text-xs text-rose-700 leading-relaxed">
            R$ {analysis.dailyWastedAdSpend}/dia pago para atrair cliques que não conseguem comprar o tamanho desejado.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-amber-800">Demanda Represada / Perdida</span>
            <span className="px-2 py-0.5 bg-amber-200 text-amber-800 text-[10px] font-bold rounded-md">Fuga de Clientes</span>
          </div>
          <p className="text-2xl font-black text-amber-900 font-mono">
            {analysis.estimatedDemandLossPercent}%
          </p>
          <p className="text-xs text-amber-700 leading-relaxed">
            Quase metade dos clientes que clicam no anúncio abandonam para comprar no concorrente.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">Margem Bruta Perdida</span>
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-md">Vendas Não Faturadas</span>
          </div>
          <p className="text-2xl font-black text-rose-400 font-mono">
            R$ {analysis.monthlyLostGrossMargin.toLocaleString('pt-BR')} / mês
          </p>
          <p className="text-xs text-slate-300 leading-relaxed">
            Lucro direto que a fábrica deixou de colocar no caixa pela falta de reposição.
          </p>
        </div>

      </div>

      {/* Emergency Action Plan */}
      <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">Plano de Resgate Imediato para o Gestor de Tráfego</h3>
          </div>
          <span className="text-xs text-slate-500">Recomendações anti-desperdício</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.recommendedActions.map((action, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md font-mono ${
                  action.priority === 'URGENTE' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                  action.priority === 'ALTA' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                  'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {action.priority}
                </span>
                <h4 className="font-bold text-xs text-slate-900 leading-tight">{action.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{action.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60">
                <p className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> {action.estimatedSavings}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 24/7 WhatsApp Watchdog Configurator */}
      <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                Configurar Vigia 24h no WhatsApp (Alerta Diário às 07:00)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Receba um alerta no WhatsApp sempre que um produto em anúncio esgotar tamanhos críticos.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyAlert}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-slate-700"
          >
            {copiedAlert ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAlert ? 'Copiado!' : 'Copiar Alerta'}</span>
          </button>
        </div>

        <form onSubmit={handleTestWhatsAppAlert} className="flex flex-col sm:flex-row gap-3 pt-2">
          <input
            type="tel"
            value={alertPhone}
            onChange={(e) => setAlertPhone(e.target.value)}
            placeholder="Digite seu WhatsApp (ex: 11999999999)"
            required
            className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono font-bold"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-600/20 active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Testar Alerta no Meu WhatsApp</span>
          </button>
        </form>

        <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
          <p className="text-[10px] font-bold uppercase text-slate-500 mb-1">Prévia do Alerta Automático:</p>
          <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {analysis.whatsAppAlertPreview}
          </pre>
        </div>
      </div>

      <OfficialIntegrationConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        brandName={realSiteData.brandName}
        domain={realSiteData.domain}
      />

    </div>
  );
};
