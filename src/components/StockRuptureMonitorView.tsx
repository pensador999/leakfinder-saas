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
  Sliders,
  ExternalLink,
  X
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { analyzeStockRupture, StockRuptureAnalysisResult } from '../services/stockRuptureEngine';
import { generateWhatsAppLink } from '../services/whatsappLeadService';
import { OfficialIntegrationConnectModal } from './OfficialIntegrationConnectModal';
import { MetaAdsAutoKillSwitchModal } from './ads/MetaAdsAutoKillSwitchModal';
import { OneClickActionModal, OneClickTargetProduct } from './actions/OneClickActionModal';
import { OneClickMitigationService } from '../services/actions/oneClickMitigationService';
import { calculateStoreFinancialGrounding } from '../services/ai/storeFinancialGroundingEngine';
import { isCatalogProductBroken } from '../services/siteInspector';

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
        .filter(isCatalogProductBroken)
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
  const [isMetaKillSwitchModalOpen, setIsMetaKillSwitchModalOpen] = useState<boolean>(false);
  const [selectedOneClickProduct, setSelectedOneClickProduct] = useState<OneClickTargetProduct | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const brokenCatalogProducts = (realSiteData.catalogAudit?.issues || []).filter(isCatalogProductBroken);

  // Detecção inteligente de categoria (Calçados vs Vestuário vs Acessórios)
  const allDetectedSizes = (realSiteData.catalogAudit?.issues || []).flatMap(i => [...(i.availableSizes || []), ...(i.missingSizes || [])]);
  const hasShoeSizes = allDetectedSizes.some(s => /^(3[5-9]|4[0-6])$/.test(s.trim())) || 
                        realSiteData.domain.toLowerCase().includes('boots') || 
                        realSiteData.domain.toLowerCase().includes('calcado') || 
                        realSiteData.domain.toLowerCase().includes('sapato') || 
                        realSiteData.domain.toLowerCase().includes('democrata') ||
                        (input.niche || '').toLowerCase().includes('calçado');

  const baseSizes = hasShoeSizes
    ? ['37', '38', '39', '40', '41', '42', '43', '44']
    : ['PP', 'P', 'M', 'G', 'GG', 'G1', 'G2'];

  const hasSpecialRupture = realBrokenSizesFromCatalog.some(s => ['ESGOTADO', 'ESTOQUE_FANTASMA_SUSPEITO', 'ÚNICO (ESGOTADO)'].includes(s));
  const availableSizes = hasSpecialRupture 
    ? [...baseSizes, 'ESGOTADO'] 
    : baseSizes;

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
    totalSkusMonitored: realSiteData.catalogAudit?.totalSkusAudited || realSiteData.catalogAudit?.issues.length || 24
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
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 text-[#FFFCE1]">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30 shadow-md">
            <Flame className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#FFFCE1]">Vigia 24h & Simulador de Ruptura de Estoque</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Proteção de Tráfego Pago • MRR
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl">
              Descubra quanto dinheiro de anúncios no <strong>Meta Ads e Google Ads</strong> está sendo queimado em produtos com grade de tamanho esgotada.
            </p>
          </div>
        </div>

        {/* Financial Bleed Alert Badge */}
        <div className="p-4 bg-[#141716] text-[#FFFCE1] rounded-2xl border border-white/10 flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end shadow-xl">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Sangria Financeira Total Estimada</p>
            <p className="text-2xl font-black text-rose-400 leading-none mt-0.5 font-mono">
              -R$ {analysis.totalMonthlyFinancialBleed.toLocaleString('pt-BR')} / mês
            </p>
            <p className="text-[10px] text-[#BBBAA6] mt-1">{analysis.estimatedDemandLossPercent}% do tráfego pago sem tamanho</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Sliders & Size Selection Grid */}
      <div className="p-6 bg-[#101211] rounded-3xl border border-white/10 shadow-2xl space-y-6 text-[#FFFCE1]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-sm text-[#FFFCE1]">Simule a Ruptura de Estoque da sua Operação</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono">
              SIMULADOR DINÂMICO
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMetaKillSwitchModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-[#0AE448]/20 cursor-pointer shrink-0"
              title="Pausar campanhas que anunciam produtos esgotados"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Meta Ads Kill-Switch (1-Clique)</span>
            </button>
            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="px-3 py-1.5 bg-[#141716] hover:bg-[#191C1B] text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 hover:border-white/20"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#0AE448]" />
              <span>Conectar Loja, Sankhya & Ads</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Slider 1: Verba Diária de Anúncios */}
          <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#BBBAA6]">Verba em Anúncios (Dia):</label>
              <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-md border border-rose-500/30">
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
              className="w-full h-2 bg-[#191C1B] rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <p className="text-[10px] text-[#BBBAA6]">Total investido no Meta/Google Ads</p>
          </div>

          {/* Slider 2: Ticket Médio do Produto */}
          <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#BBBAA6]">Preço do Produto Anunciado:</label>
              <span className="text-xs font-mono font-bold text-[#00BAE2] bg-[#00BAE2]/20 px-2 py-0.5 rounded-md border border-[#00BAE2]/30">
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
              className="w-full h-2 bg-[#191C1B] rounded-lg appearance-none cursor-pointer accent-[#00BAE2]"
            />
            <p className="text-[10px] text-[#BBBAA6]">Valor de venda na vitrine</p>
          </div>

          {/* Selection: Tamanhos em Falta */}
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-2">
            <label className="text-xs font-bold text-rose-300 block">
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
                    className={`px-3 py-1 text-xs font-bold font-mono rounded-lg transition-all cursor-pointer inline-flex items-center gap-1 ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-xs scale-105'
                        : 'bg-[#141716] text-[#BBBAA6] border border-white/10 hover:border-rose-400'
                    }`}
                  >
                    <span>{size}</span>
                    {isSelected && <X className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-rose-400 font-medium font-mono">
              {rupturedSizes.length > 0 ? `${rupturedSizes.join(', ')} esgotados` : 'Nenhum tamanho em falta'}
            </p>
          </div>

        </div>
      </div>

      {/* 3 Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#141716] border border-rose-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-rose-400 font-mono">Verba de Ads Queimada</span>
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-md font-mono">Tráfego Desperdiçado</span>
          </div>
          <p className="text-2xl font-black text-rose-400 font-mono">
            R$ {analysis.monthlyWastedAdSpend.toLocaleString('pt-BR')} / mês
          </p>
          <p className="text-xs text-[#BBBAA6] leading-relaxed">
            R$ {analysis.dailyWastedAdSpend}/dia pago para atrair cliques que não conseguem comprar o tamanho desejado.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#141716] border border-amber-500/20 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-amber-400 font-mono">Demanda Represada / Perdida</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded-md font-mono">Fuga de Clientes</span>
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">
            {analysis.estimatedDemandLossPercent}%
          </p>
          <p className="text-xs text-[#BBBAA6] leading-relaxed">
            Quase metade dos clientes que clicam no anúncio abandonam para comprar no concorrente.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#141716] border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-[#BBBAA6] font-mono">Margem Bruta Perdida</span>
            <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-md font-mono">Vendas Não Faturadas</span>
          </div>
          <p className="text-2xl font-black text-[#0AE448] font-mono">
            R$ {analysis.monthlyLostGrossMargin.toLocaleString('pt-BR')} / mês
          </p>
          <p className="text-xs text-[#BBBAA6] leading-relaxed">
            Lucro direto que a fábrica deixou de colocar no caixa pela falta de reposição.
          </p>
        </div>

      </div>

      {/* Emergency Action Plan */}
      <div className="p-6 bg-[#101211] rounded-3xl border border-white/10 shadow-2xl space-y-4 text-[#FFFCE1]">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#0AE448]" />
            <h3 className="font-bold text-sm text-[#FFFCE1]">Plano de Resgate Imediato para o Gestor de Tráfego</h3>
          </div>
          <span className="text-xs text-[#BBBAA6]">Recomendações anti-desperdício</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.recommendedActions.map((action, idx) => (
            <div key={idx} className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-2 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md font-mono ${
                  action.priority === 'URGENTE' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  action.priority === 'ALTA' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {action.priority}
                </span>
                <h4 className="font-bold text-xs text-[#FFFCE1] leading-tight">{action.title}</h4>
                <p className="text-[11px] text-[#BBBAA6] leading-relaxed">{action.description}</p>
              </div>

              <div className="pt-2 border-t border-white/10 space-y-2">
                <p className="text-[10px] font-bold text-[#0AE448] flex items-center gap-1 font-mono">
                  <Sparkles className="w-3 h-3" /> {action.estimatedSavings}
                </p>
                {action.priority === 'URGENTE' && (
                  <button
                    onClick={() => setIsMetaKillSwitchModalOpen(true)}
                    className="w-full py-1.5 px-3 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Disparar Auto-Kill no Meta Ads</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🚨 PRODUTOS CRÍTICOS IDENTIFICADOS NA AUDITORIA AO VIVO */}
      {brokenCatalogProducts.length > 0 && (
        <div className="p-6 bg-[#101211] rounded-3xl border border-rose-500/30 shadow-2xl space-y-4 text-[#FFFCE1]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/20 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#FFFCE1]">
                  {brokenCatalogProducts.length} Produtos com Grade Rompida Queimando Anúncios
                </h3>
                <p className="text-xs text-[#BBBAA6]">
                  Produtos ativos que perderam tamanhos centrais (M, G, GG). Ações de 1-clique disponíveis para estancar a perda.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsMetaKillSwitchModalOpen(true)}
              className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Pausar Todos os Anúncios Rompidos</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brokenCatalogProducts.map((issue) => {
              const shopSlug = OneClickMitigationService.getShopSlug(realSiteData.domain);
              const directAdminUrl = issue.adminUrl || (shopSlug && issue.id ? `https://admin.shopify.com/store/${shopSlug}/products/${issue.id}` : undefined);
              const estLoss = 1350;

              return (
                <div key={issue.id} className="p-4 rounded-2xl bg-[#141716] border border-white/10 flex flex-col justify-between gap-3 hover:border-rose-400/50 transition-all">
                  <div className="flex items-start gap-3">
                    {issue.imageSrc ? (
                      <img src={issue.imageSrc} alt="" className="w-14 h-14 object-cover rounded-xl border border-white/10 shrink-0 bg-[#101211]" />
                    ) : (
                      <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[10px] text-slate-500 shrink-0">Sem Foto</div>
                    )}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
                          {issue.sku || 'SEM SKU'}
                        </span>
                        {issue.barcode && (
                          <span className="font-mono text-[10px] text-[#BBBAA6]">
                            EAN: {issue.barcode}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-xs text-[#FFFCE1] truncate" title={issue.productTitle}>
                        {issue.productTitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-1 pt-0.5">
                        <span className="text-[10px] font-bold text-rose-400">Falta:</span>
                        {issue.missingSizes.map((sz) => (
                          <span key={sz} className="px-1.5 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold rounded border border-rose-500/30">
                            {sz}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono font-bold text-rose-400">
                      Perda: ~R$ {estLoss.toLocaleString('pt-BR')}/mês
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedOneClickProduct({
                          id: issue.id,
                          sku: issue.sku || 'SEM-SKU',
                          title: issue.productTitle,
                          barcode: issue.barcode,
                          imageSrc: issue.imageSrc,
                          hasValidImage: issue.hasValidImage,
                          url: issue.productUrl,
                          adminUrl: directAdminUrl,
                          missingSizes: issue.missingSizes,
                          price: 189.90,
                          reason: 'BROKEN_SIZES'
                        })}
                        className="px-2.5 py-1 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        title="Mitigar sangria com 1-clique"
                      >
                        <Zap className="w-3 h-3" />
                        <span>1-Clique Mitigar</span>
                      </button>

                      {directAdminUrl && (
                        <a
                          href={directAdminUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer border border-white/10"
                          title="Abrir no painel da Shopify"
                        >
                          <ExternalLink className="w-3 h-3 text-[#0AE448]" />
                          <span>Admin</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 24/7 WhatsApp Watchdog Configurator */}
      <div className="p-6 bg-[#101211] rounded-3xl text-[#FFFCE1] border border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/20 text-[#0AE448] rounded-xl border border-[#0AE448]/30">
              <Bell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#FFFCE1] flex items-center gap-1.5">
                Configurar Vigia 24h no WhatsApp (Alerta Diário às 07:00)
              </h3>
              <p className="text-xs text-[#BBBAA6] mt-0.5">
                Receba um alerta no WhatsApp sempre que um produto em anúncio esgotar tamanhos críticos.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyAlert}
            className="px-3.5 py-1.5 bg-[#141716] hover:bg-[#191C1B] text-[#FFFCE1] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 border border-white/10"
          >
            {copiedAlert ? <Check className="w-3.5 h-3.5 text-[#0AE448]" /> : <Copy className="w-3.5 h-3.5 text-[#BBBAA6]" />}
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
            className="flex-1 px-4 py-2.5 bg-[#141716] border border-white/15 rounded-xl text-xs text-[#FFFCE1] placeholder-slate-500 focus:outline-none focus:border-[#0AE448] font-mono font-bold"
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-[#0AE448]/20 active:scale-[0.98]"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Testar Alerta no Meu WhatsApp</span>
          </button>
        </form>

        <div className="p-3.5 bg-[#141716] rounded-2xl border border-white/10">
          <p className="text-[10px] font-bold uppercase text-[#BBBAA6] mb-1 font-mono">Prévia do Alerta Automático:</p>
          <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            {analysis.whatsAppAlertPreview}
          </pre>
        </div>
      </div>

      {/* Toast Feedback */}
      {actionSuccessMessage && (
        <div className="fixed bottom-6 right-6 z-[90] p-4 bg-emerald-950 border border-emerald-500/50 rounded-2xl shadow-2xl flex items-center gap-3 text-white max-w-md animate-slideUp">
          <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Check className="w-5 h-5" />
          </div>
          <p className="text-xs font-medium leading-relaxed">{actionSuccessMessage}</p>
        </div>
      )}

      {/* One-Click Action Modal */}
      {selectedOneClickProduct && (
        <OneClickActionModal
          product={selectedOneClickProduct}
          storeSlug={OneClickMitigationService.getShopSlug(realSiteData.domain)}
          onClose={() => setSelectedOneClickProduct(null)}
          onActionSuccess={(record) => {
            setActionSuccessMessage(`Ação executada: ${record.notes || record.actionType}`);
            setTimeout(() => setActionSuccessMessage(null), 5000);
          }}
        />
      )}

      {/* Meta Ads Auto-Kill Switch Modal */}
      {isMetaKillSwitchModalOpen && (
        <MetaAdsAutoKillSwitchModal
          diagnostic={diagnostic}
          onClose={() => setIsMetaKillSwitchModalOpen(false)}
        />
      )}

      <OfficialIntegrationConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        brandName={realSiteData.brandName}
        domain={realSiteData.domain}
      />

    </div>
  );
};
