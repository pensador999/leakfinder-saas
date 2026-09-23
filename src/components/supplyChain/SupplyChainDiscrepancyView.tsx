import React, { useState } from 'react';
import { 
  Factory, 
  Layers, 
  RefreshCw, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  Sliders, 
  TrendingDown, 
  Sparkles,
  Zap,
  Box,
  Truck,
  MessageSquare,
  Package
} from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';
import { auditSupplyChainDiscrepancy, SupplyChainSyncAuditResult, SkuDiscrepancyAlert } from '../../services/supplyChain/erpHubDiscrepancyEngine';
import { formatBRL } from '../../services/ai/storeFinancialGroundingEngine';
import { ResaleReplenishmentFlowSection } from './ResaleReplenishmentFlowSection';

interface SupplyChainDiscrepancyViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const SupplyChainDiscrepancyView: React.FC<SupplyChainDiscrepancyViewProps> = ({ diagnostic }) => {
  const { realSiteData, input } = diagnostic;
  const syncAudit: SupplyChainSyncAuditResult = auditSupplyChainDiscrepancy(realSiteData, input);

  const [mainViewMode, setMainViewMode] = useState<'REPLENISHMENT_FLOW' | 'DISCREPANCY_ERP'>('REPLENISHMENT_FLOW');
  const [copiedScriptId, setCopiedScriptId] = useState<string | null>(null);
  const [safetyBuffer, setSafetyBuffer] = useState<number>(syncAudit.suggestedSafetyBufferUnits || 2);
  const [selectedRoleTab, setSelectedRoleTab] = useState<'traffic' | 'magis5' | 'sankhya'>('traffic');

  const handleCopyScript = (scriptText: string, id: string) => {
    navigator.clipboard.writeText(scriptText);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2500);
  };

  return (
    <div className="space-y-8 font-sans">

      {/* Sub-Navigation: Reposição de Revenda vs Descompasso ERP */}
      <div className="flex items-center justify-between p-1.5 bg-[#101211] rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-1.5 w-full">
          <button
            onClick={() => setMainViewMode('REPLENISHMENT_FLOW')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mainViewMode === 'REPLENISHMENT_FLOW'
                ? 'bg-[#0AE448] text-slate-950 shadow-md shadow-[#0AE448]/20 font-black'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Reposição de Revenda & Envio Imediato (Fluxo Contínuo)</span>
          </button>

          <button
            onClick={() => setMainViewMode('DISCREPANCY_ERP')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mainViewMode === 'DISCREPANCY_ERP'
                ? 'bg-[#0AE448] text-slate-950 shadow-md shadow-[#0AE448]/20 font-black'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
            }`}
          >
            <Factory className="w-4 h-4" />
            <span>Descompasso ERP, Hub & Tráfego Pago (Sankhya/Magis5)</span>
          </button>
        </div>
      </div>

      {mainViewMode === 'REPLENISHMENT_FLOW' ? (
        <ResaleReplenishmentFlowSection
          catalogIssues={realSiteData.catalogAudit?.issues || []}
          domain={realSiteData.domain}
          brandName={realSiteData.brandName}
        />
      ) : (
        <>
      
      {/* 1. Header Banner & Executive Score */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl text-[#FFFCE1] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0AE448]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>Agente 13 — ERP & Supply Chain Discrepancy Engine</span>
              </span>
              <span className="px-2.5 py-0.5 bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20 rounded-full text-xs font-mono font-bold">
                ERP / WMS ⟷ Hub Integrador ⟷ Loja ⟷ Ads [Simulador Operacional]
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-[#FFFCE1]">
              Identificamos <span className="text-rose-400 font-mono">{syncAudit.financialImpactSummary.formattedMonthlyTotalRisk}/mês</span> em risco por descompasso entre Produção, Hub e Anúncios
            </h2>

            <p className="text-sm text-[#BBBAA6] leading-relaxed">
              O descompasso ocorre quando o tráfego pago envia clientes para produtos com grade esgotada na vitrine ou quando o estoque virtual vende sem peça física liberada no <strong className="text-white">ERP (Sankhya / Bling / Tiny / SAP)</strong> via <strong className="text-white">Hub (Magis5 / Anymarket / Plugg.to)</strong>.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-3 w-full lg:w-auto shrink-0 text-center">
            <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Score de Sincronia</span>
              <span className="text-3xl font-black text-amber-400 font-mono">{syncAudit.operationalSyncScore}%</span>
              <span className="text-[10px] text-amber-300 block font-medium">Requer Buffer de Trava</span>
            </div>

            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 text-rose-300 backdrop-blur-md">
              <span className="text-[10px] uppercase font-bold text-rose-400 font-mono block">Perda em Mídia</span>
              <span className="text-3xl font-black text-rose-400 font-mono">
                {formatBRL(syncAudit.financialImpactSummary.monthlyAdWasteBRL)}
              </span>
              <span className="text-[10px] text-rose-300 block font-medium">em Cliques Fantasmas</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive 4-Step Pipeline Visualizer */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0AE448]" />
            <h3 className="font-black text-base text-[#FFFCE1]">Pipeline Operacional de Ponta a Ponta: Onde o Dinheiro Vaza</h3>
          </div>
          <span className="text-xs font-mono text-[#0AE448] font-bold bg-[#0AE448]/10 border border-[#0AE448]/20 px-3 py-1 rounded-full">
            Fluxo Contínuo de Produção & Vendas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          
          {/* Step 1: Sankhya ERP */}
          <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#FFFCE1] flex items-center gap-1.5">
                <Factory className="w-4 h-4 text-[#00BAE2]" />
                1. Sankhya ERP
              </span>
              <span className="px-2 py-0.5 bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20 text-[10px] font-bold rounded-full">
                Fábrica / Estoque
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6]">
              Controla ordens de produção, cortes de grade (PP-G2) e saldo físico de armazém.
            </p>
            <div className="p-2 bg-[#0E100F] rounded-xl border border-white/5 text-[11px] font-mono text-[#FFFCE1]">
              Batches Auditados: <strong>{syncAudit.pipelineFlowMetrics.sankhyaProductionBatchesAudited} lotes</strong>
            </div>
          </div>

          {/* Step 2: Magis5 Hub */}
          <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#FFFCE1] flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-[#0AE448]" />
                2. Magis5 Hub
              </span>
              <span className="px-2 py-0.5 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 text-[10px] font-bold rounded-full">
                Integrador
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6]">
              Sincroniza anúncios, fotos, títulos e distribui o estoque para a loja e canais.
            </p>
            <div className="p-2 bg-[#0E100F] rounded-xl border border-white/5 text-[11px] font-mono text-[#FFFCE1]">
              Delay Médio de Fila: <strong>~{syncAudit.pipelineFlowMetrics.magis5QueueDelaySecondsEstimated}s</strong>
            </div>
          </div>

          {/* Step 3: Storefront */}
          <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[#FFFCE1] flex items-center gap-1.5">
                <Box className="w-4 h-4 text-amber-400" />
                3. Loja Virtual
              </span>
              <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold rounded-full">
                {syncAudit.pipelineFlowMetrics.storefrontBrokenSkusCount} Rupturas
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6]">
              Vitrine pública onde o cliente seleciona o tamanho e finaliza no checkout.
            </p>
            <div className="p-2 bg-[#0E100F] rounded-xl border border-white/5 text-[11px] font-mono text-rose-400 font-bold">
              Grade Furada Detectada ao Vivo
            </div>
          </div>

          {/* Step 4: Meta/Google Ads */}
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-rose-300 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-rose-400" />
                4. Meta & Google Ads
              </span>
              <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold rounded-full animate-pulse">
                Queima Ativa
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6]">
              Envia tráfego pago para os links. Se a grade estiver furada, o clique é perdido.
            </p>
            <div className="p-2 bg-[#0E100F] rounded-xl border border-white/5 text-[11px] font-mono text-rose-400 font-bold">
              Risco: {syncAudit.financialImpactSummary.formattedMonthlyTotalRisk}/mês
            </div>
          </div>

        </div>
      </div>

      {/* 3. SKU Discrepancies Table */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-black text-base text-[#FFFCE1]">SKUs com Descompasso Detectado na Vitrine</h3>
          </div>
          <span className="text-xs font-mono text-[#BBBAA6]">
            {syncAudit.discrepancyAlerts.length} produto(s) requerem intervenção
          </span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#141716] border-b border-white/10 text-[#BBBAA6] font-bold">
                <th className="p-3.5">SKU & Produto</th>
                <th className="p-3.5">Grau de Descompasso</th>
                <th className="p-3.5">Sintoma & Causa Operacional</th>
                <th className="p-3.5">Risco em Anúncios</th>
                <th className="p-3.5">Ação Recomendada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {syncAudit.discrepancyAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      {alert.imageSrc ? (
                        <img src={alert.imageSrc} alt="" className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0" />
                      ) : (
                        <div className="w-10 h-10 bg-[#141716] rounded-lg flex items-center justify-center text-[10px] text-[#BBBAA6] shrink-0 border border-white/5">
                          Foto
                        </div>
                      )}
                      <div>
                        <span className="font-bold text-[#FFFCE1] block">{alert.sku}</span>
                        <span className="text-[11px] font-sans text-[#BBBAA6] max-w-xs truncate block">{alert.productTitle}</span>
                        <a href={alert.productUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#0AE448] hover:underline flex items-center gap-1 mt-0.5">
                          <span>Ver no site</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border block text-center max-w-max ${alert.badgeColor}`}>
                      {alert.severityLabel}
                    </span>
                  </td>

                  <td className="p-3.5 font-sans max-w-xs space-y-1">
                    <p className="text-[#FFFCE1] font-medium text-[11px]">{alert.symptom}</p>
                    <p className="text-[#BBBAA6] text-[10px]">{alert.operationalCause}</p>
                  </td>

                  <td className="p-3.5">
                    <span className="text-rose-400 font-bold block">{formatBRL(alert.adWasteEstimatedMonthly)}/mês</span>
                    <span className="text-[10px] text-[#BBBAA6] font-sans">queima em tráfego</span>
                  </td>

                  <td className="p-3.5 font-sans">
                    <span className="text-xs text-[#FFFCE1] font-medium block max-w-xs">{alert.recommendedAction}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Playbooks Operacionais 1-Clique (Gestor de Tráfego, Magis5 e Sankhya) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#101211] text-[#FFFCE1] border border-white/10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="text-lg font-black flex items-center gap-2 text-[#FFFCE1]">
              <Sparkles className="w-5 h-5 text-[#0AE448]" />
              Playbooks de Ação Imediata em 1-Clique (Copiar & Executar)
            </h3>
            <p className="text-xs text-[#BBBAA6] mt-0.5">
              Instruções e mensagens prontas para enviar aos responsáveis da operação e estancar o descompasso agora.
            </p>
          </div>

          {/* Role Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#141716] p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setSelectedRoleTab('traffic')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedRoleTab === 'traffic' ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20' : 'text-[#BBBAA6] hover:text-white'
              }`}
            >
              1. Gestor de Tráfego
            </button>
            <button
              onClick={() => setSelectedRoleTab('magis5')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedRoleTab === 'magis5' ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20' : 'text-[#BBBAA6] hover:text-white'
              }`}
            >
              2. Operador Magis5
            </button>
            <button
              onClick={() => setSelectedRoleTab('sankhya')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedRoleTab === 'sankhya' ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20' : 'text-[#BBBAA6] hover:text-white'
              }`}
            >
              3. PCP / Sankhya ERP
            </button>
          </div>
        </div>

        {/* Dynamic Role Content */}
        {selectedRoleTab === 'traffic' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0AE448] flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" /> Script para WhatsApp do Gestor de Tráfego
                </span>
                <button
                  onClick={() => handleCopyScript(syncAudit.discrepancyAlerts[0]?.playbookScript.trafficManagerWhatsApp || '', 'traffic-script')}
                  className="px-3.5 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#0AE448]/20"
                >
                  {copiedScriptId === 'traffic-script' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScriptId === 'traffic-script' ? 'Copiado!' : 'Copiar para WhatsApp'}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#0E100F] rounded-xl text-xs font-mono text-[#FFFCE1] whitespace-pre-wrap leading-relaxed border border-white/5">
                {syncAudit.discrepancyAlerts[0]?.playbookScript.trafficManagerWhatsApp}
              </pre>
            </div>
          </div>
        )}

        {selectedRoleTab === 'magis5' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0AE448] flex items-center gap-1.5">
                  <RefreshCw className="w-4 h-4" /> Checklist Operacional no Hub Magis5
                </span>
                <button
                  onClick={() => handleCopyScript(syncAudit.discrepancyAlerts[0]?.playbookScript.magis5OperatorAction || '', 'magis5-script')}
                  className="px-3.5 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#0AE448]/20"
                >
                  {copiedScriptId === 'magis5-script' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScriptId === 'magis5-script' ? 'Copiado!' : 'Copiar Instrução'}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#0E100F] rounded-xl text-xs font-mono text-[#FFFCE1] whitespace-pre-wrap leading-relaxed border border-white/5">
                {syncAudit.discrepancyAlerts[0]?.playbookScript.magis5OperatorAction}
              </pre>
            </div>
          </div>
        )}

        {selectedRoleTab === 'sankhya' && (
          <div className="space-y-4">
            <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#0AE448] flex items-center gap-1.5">
                  <Factory className="w-4 h-4" /> Nota de Prioridade de Lote para PCP / Sankhya
                </span>
                <button
                  onClick={() => handleCopyScript(syncAudit.discrepancyAlerts[0]?.playbookScript.sankhyaPcpProductionNote || '', 'sankhya-script')}
                  className="px-3.5 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#0AE448]/20"
                >
                  {copiedScriptId === 'sankhya-script' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScriptId === 'sankhya-script' ? 'Copiado!' : 'Copiar Nota'}</span>
                </button>
              </div>
              <pre className="p-4 bg-[#0E100F] rounded-xl text-xs font-mono text-[#FFFCE1] whitespace-pre-wrap leading-relaxed border border-white/5">
                {syncAudit.discrepancyAlerts[0]?.playbookScript.sankhyaPcpProductionNote}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* 5. Safety Buffer Calculator (Magis5 x Sankhya Shield) */}
      <div className="p-6 bg-[#101211] rounded-3xl border border-white/10 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#0AE448]" />
            <h3 className="font-black text-base text-[#FFFCE1]">Simulador de Buffer de Segurança (Trava Anti-Estoque Negativo)</h3>
          </div>
          <span className="text-xs font-mono text-[#0AE448] font-bold bg-[#0AE448]/10 px-2.5 py-1 rounded-full border border-[#0AE448]/20">
            Buffer Recomendado: {safetyBuffer} unidades
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <p className="text-xs text-[#BBBAA6] leading-relaxed">
              O <strong className="text-white">Buffer de Segurança</strong> é a regra cadastrada na Magis5 para subtrair automaticamente um saldo de proteção do Sankhya antes de publicar na loja virtual. Isso impede que dois clientes comprem a última unidade ao mesmo tempo em canais diferentes.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#FFFCE1]">
                <span>Buffer de Proteção: {safetyBuffer} unidade(s)</span>
                <span className="text-[#0AE448] font-mono">
                  {safetyBuffer === 0 ? 'Sem Proteção (Alto Risco de Cancelamento)' : safetyBuffer <= 2 ? 'Equilíbrio Ideal (Recomendado)' : 'Proteção Conservadora'}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={safetyBuffer}
                onChange={(e) => setSafetyBuffer(Number(e.target.value))}
                className="w-full accent-[#0AE448] cursor-pointer"
              />
            </div>
          </div>

          <div className="md:col-span-4 p-4 bg-[#141716] rounded-2xl border border-white/10 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono">Cancelamentos Evitados</span>
            <span className="text-2xl font-black text-[#0AE448] font-mono block">
              ~{safetyBuffer * 4} pedidos/mês
            </span>
            <span className="text-[10px] text-[#BBBAA6] block">Blindagem de Reputação & Caixa</span>
          </div>
        </div>
      </div>
      </>
      )}

    </div>
  );
};
