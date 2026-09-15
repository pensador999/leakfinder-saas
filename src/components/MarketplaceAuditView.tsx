import React, { useState } from 'react';
import { 
  Store, 
  Copy, 
  Check, 
  Sparkles, 
  Image as ImageIcon, 
  FileText, 
  Truck, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  Tag,
  Lightbulb,
  Zap,
  HelpCircle
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { generateMarketplaceListingAudit, MarketplaceListingAuditResult } from '../services/marketplaceInspector';

interface MarketplaceAuditViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const MarketplaceAuditView: React.FC<MarketplaceAuditViewProps> = ({ diagnostic }) => {
  const { realSiteData } = diagnostic;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const audit: MarketplaceListingAuditResult = generateMarketplaceListingAudit(
    realSiteData.url,
    realSiteData.domain,
    realSiteData.brandName,
    realSiteData.title,
    realSiteData.rawHtmlSnippet
  );

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isMeli = audit.marketplaceType === 'MERCADO_LIVRE';
  const isShopee = audit.marketplaceType === 'SHOPEE';
  const isAmazon = audit.marketplaceType === 'AMAZON';

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl text-white shadow-md" style={{ backgroundColor: isMeli ? '#2D3277' : isShopee ? '#EE4D2D' : '#232F3E' }}>
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Auditoria Especialista em Marketplace & Anúncios</h2>
              <span className={`px-2.5 py-0.5 text-xs font-extrabold rounded-full inline-flex items-center gap-1.5 ${
                isMeli ? 'bg-amber-100 text-amber-900' : isShopee ? 'bg-orange-100 text-orange-900' : 'bg-blue-100 text-blue-900'
              }`}>
                <Store className="w-3.5 h-3.5" />
                <span>{audit.marketplaceName} Detectado</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Diagnóstico focado em <strong>Algoritmo de Ranqueamento Orgânico, Ficha Técnica, Qualidade de Fotos e Conversão de Anúncios</strong> sem necessidade de editar código.
            </p>
          </div>
        </div>

        {/* Listing Health Score */}
        <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center gap-4 text-right w-full lg:w-auto justify-between lg:justify-end">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Score do Anúncio (SEO & CRO)</p>
            <p className="text-2xl font-black text-emerald-400 leading-none mt-0.5">
              {audit.listingScore} / 100
            </p>
            <p className="text-[10px] text-slate-400 mt-1">Algoritmo {audit.marketplaceName}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 🏬 IDENTIFICAÇÃO EXATA DA LOJA & ANÚNCIO (GROUNDING DE SELLER) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-inner" style={{ backgroundColor: isMeli ? '#2D3277' : isShopee ? '#EE4D2D' : '#232F3E' }}>
            {isShopee ? 'S' : isMeli ? 'ML' : 'AZ'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-indigo-300 font-mono font-bold uppercase tracking-wider">Vendedor Auditado:</span>
              <strong className="text-sm font-black text-white">{realSiteData.brandName}</strong>
              {audit.sellerIdentifier && (
                <span className="px-2 py-0.5 bg-white/10 text-white rounded-md text-[10px] font-mono border border-white/20">
                  Seller ID: {audit.sellerIdentifier}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Plataforma: <strong>{audit.marketplaceName}</strong></span>
              {audit.itemId && (
                <>
                  <span className="text-slate-500">•</span>
                  <span>Anúncio / Item: <strong className="text-amber-300 font-mono">#{audit.itemId}</strong></span>
                </>
              )}
              {audit.categoryId && (
                <>
                  <span className="text-slate-500">•</span>
                  <span>Categoria: <strong className="text-slate-300 font-mono">#{audit.categoryId}</strong></span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={realSiteData.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold font-mono transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Abrir Anúncio na {audit.marketplaceName}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 🏷️ 1. OTIMIZADOR DE TÍTULO ALGORÍTMICO */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">1. Otimizador de Título para o Algoritmo de Busca</h3>
          </div>
          <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 font-mono font-bold text-xs rounded-lg border border-indigo-200">
            Fórmula: [Produto] + [Marca] + [Modelo] + [Benefício] + [Garantia]
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Título Atual */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Título Atual do Anúncio:</span>
              <span className="text-xs font-mono font-bold text-slate-700">{audit.titleAudit.charCount} caracteres</span>
            </div>
            <p className="text-xs font-medium text-slate-800 leading-relaxed">{audit.titleAudit.originalTitle}</p>
          </div>

          {/* Título Otimizado pela IA */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Título Sugerido (Mais Buscas & Cliques):
              </span>
              <button
                onClick={() => handleCopy('optimized-title', audit.titleAudit.optimizedTitle)}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
              >
                {copiedId === 'optimized-title' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedId === 'optimized-title' ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-xs font-bold text-emerald-950 leading-relaxed">{audit.titleAudit.optimizedTitle}</p>
          </div>

        </div>
      </div>

      {/* 📸 2. AUDITORIA DE FOTOS E DIRETRIZES DO ALGORITMO */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ImageIcon className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900">2. Checklist de Fotos de Alta Conversão</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {audit.photoAudit.actionablePhotoChecklist.map((photo, idx) => {
            const isGood = photo.status === 'CONFORME';
            const isCritical = photo.status === 'CRITICO';

            return (
              <div 
                key={idx}
                className={`p-4 rounded-xl border space-y-1.5 transition-all ${
                  isCritical 
                    ? 'bg-rose-50/70 border-rose-200' 
                    : isGood 
                    ? 'bg-emerald-50/70 border-emerald-200' 
                    : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">{photo.item}</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    isCritical 
                      ? 'bg-rose-200 text-rose-800' 
                      : isGood 
                      ? 'bg-emerald-200 text-emerald-800' 
                      : 'bg-amber-200 text-amber-800'
                  }`}>
                    {photo.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{photo.tip}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📋 3. FICHA TÉCNICA, GTIN/EAN & LOGÍSTICA FULL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Ficha Técnica & GTIN */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Ficha Técnica & Elegibilidade Buy Box</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-700">Código de Barras (EAN / GTIN):</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{audit.technicalSheetAudit.gtinStatus}</span>
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              {audit.technicalSheetAudit.buyBoxImpactMessage}
            </p>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] space-y-1">
              <p className="font-bold">Atributos Obrigatórios Encontrados:</p>
              <p className="text-blue-800">{audit.technicalSheetAudit.criticalAttributesFound.join(' • ')}</p>
            </div>
          </div>
        </div>

        {/* Logística & Full */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Truck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Logística & Envio Rápido (Full / Prime)</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <span className="font-bold text-emerald-900">Programa Logístico:</span>
              <span className="font-bold text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-md">
                {audit.logisticsAudit.logisticsProgram}
              </span>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              {audit.logisticsAudit.sameDayDeliveryAdvantage}
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-600 shrink-0" />
              <span><strong>Vantagem Competitiva:</strong> {audit.logisticsAudit.shippingImpactLabel}</span>
            </div>
          </div>
        </div>

      </div>

      {/* 🧟 MOTOR B: RADAR ANTI-ANÚNCIOS ZUMBIS (DIRETRIZES ALGORÍTMICAS 2026) */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-sm text-slate-900">4. Radar Anti-Anúncios Zumbis & Saúde da Conta (Algoritmo 2026)</h3>
          </div>
          <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-200">
            Status: {audit.zombieAudit.status}
          </span>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Diagnóstico de Risco Operacional:</span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              Índice Zumbi: {audit.zombieAudit.zombieScore}/100 (Risco Baixo)
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {audit.zombieAudit.diagnosisReason}
          </p>
        </div>

        {/* 7-Day Rescue Plan */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" /> Plano de Ação de 7 Dias para Blindar o Anúncio contra a Zumbificação:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {audit.zombieAudit.rescuePlan7Days.map((step, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-blue-700">{step.day}: {step.title}</span>
                  <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-600">
                    {step.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{step.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 👑 MOTOR B: SIMULADOR DE DISPUTA DE BUY BOX & CATÁLOGO */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900">5. Simulador de Preço & Conquista da Buy Box (Catálogo)</h3>
          </div>
          <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 font-bold text-xs rounded-lg border border-amber-200">
            {audit.buyBoxAudit.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-500">Seu Preço Cadastrado</span>
            <p className="text-xl font-black text-slate-800 font-mono">
              R$ {audit.buyBoxAudit.simulatedItemPrice.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
            <span className="text-[10px] font-bold uppercase text-rose-700">Preço Atual da Buy Box Rival</span>
            <p className="text-xl font-black text-rose-900 font-mono">
              R$ {audit.buyBoxAudit.competitorBuyBoxPrice.toFixed(2).replace('.', ',')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 space-y-1 shadow-xs">
            <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Preço Recomendado para Ganhar
            </span>
            <p className="text-xl font-black text-emerald-700 font-mono">
              R$ {audit.buyBoxAudit.recommendedBuyBoxPrice.toFixed(2).replace('.', ',')}
            </p>
          </div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-950 flex items-start gap-2">
          <Zap className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Estratégia Tática:</strong> {audit.buyBoxAudit.buyBoxAdvantageStrategy} ({audit.buyBoxAudit.marginImpact})
          </p>
        </div>
      </div>

      {/* 💬 6. RESPOSTAS RÁPIDAS PARA QUEBRA DE OBJEÇÕES (< 5 MIN) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-sm text-slate-900">Respostas Rápidas para as 4 Maiores Dúvidas de Compradores</h3>
          </div>
          <span className="text-xs text-slate-500">Responda em &lt; 5 min para pontuar no algoritmo</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audit.qaTemplates.map((qa) => {
            const isCopied = copiedId === qa.id;

            return (
              <div key={qa.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-800 font-bold text-[10px] uppercase rounded-md">
                    Objeção: {qa.objectionType}
                  </span>
                  <button
                    onClick={() => handleCopy(qa.id, qa.recommendedAnswer)}
                    className="px-2 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copiado!' : 'Copiar Resposta'}</span>
                  </button>
                </div>
                
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>{qa.question}</span>
                </p>
                <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-200/80 italic">
                  "{qa.recommendedAnswer}"
                </p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
