import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Layers, 
  Server, 
  Copy, 
  Check, 
  ExternalLink,
  FlaskConical,
  Flame,
  Radio,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';
import { ProspectLead } from '../../services/prospecting/leadSniperEngine';
import { reverseEngineerStoreTechStack, TechReverseEngineeringResult } from '../../services/reverseEngineering/techReverseEngineeringEngine';
import { runFalsifyProtocolOnBleedHypothesis, BleedFalsificationReport } from '../../services/audit/falsifyBleedHypothesisEngine';

interface TechReverseEngineeringInspectorModalProps {
  lead: ProspectLead;
  isOpen: boolean;
  onClose: () => void;
}

export const TechReverseEngineeringInspectorModal: React.FC<TechReverseEngineeringInspectorModalProps> = ({
  lead,
  isOpen,
  onClose
}) => {
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'REVERSE_TECH' | 'FALSIFY_AUDIT' | 'RAW_EVIDENCE'>('REVERSE_TECH');

  if (!isOpen) return null;

  // Executa engenharia reversa e teste de falseamento em tempo de renderização
  const reverseData: TechReverseEngineeringResult = reverseEngineerStoreTechStack(
    lead.storeUrl,
    '',
    {
      brandName: lead.brandName,
      domain: lead.domain
    }
  );

  const falsifyReport: BleedFalsificationReport = runFalsifyProtocolOnBleedHypothesis(lead);

  const handleCopyTechReport = () => {
    const reportText = `[DOSSIÊ DE ENGENHARIA REVERSA & GROUNDING]
Marca: ${lead.brandName} (${lead.domain})
Plataforma: ${reverseData.platform.label}
ERP Mapeado: ${reverseData.erpAndHubs.primaryErp} | Hub: ${reverseData.erpAndHubs.primaryHub}
Risco Estoque Fantasma: ${reverseData.ghostInventoryAudit.riskLevel}
Veredito Falsify: ${falsifyReport.verdict} (Confiança: ${falsifyReport.scientificConfidencePct}%)
Sangria Calibrada: R$ ${falsifyReport.calibratedBleedMonthly.toLocaleString('pt-BR')}/mês
Produto Auditado: ${lead.primaryBrokenSku.productTitle}
Falta nos tamanhos: ${lead.primaryBrokenSku.missingSizes.join(', ')}
Anúncios Meta Ativos: ${lead.activeAdsCountEstimated}
Air-Gap Lock: DISPARO BLOQUEADO PARA ESTUDO TÉCNICO INTERNO`;

    navigator.clipboard.writeText(reportText);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#101211] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl text-[#FFFCE1]">
        
        {/* Header com Trava de Segurança Air-Gap */}
        <div className="p-6 border-b border-white/10 flex items-start justify-between bg-gradient-to-r from-[#141716] via-[#101211] to-[#141716]">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="p-2 bg-[#00BAE2]/10 text-[#00BAE2] rounded-xl border border-[#00BAE2]/20">
                <Cpu className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold">Raio-X de Engenharia Reversa & Protocolo Falsify</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-black rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>AIR-GAP ATIVO: ZERO DISPARO</span>
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6]">
              Dissecação profunda da stack tecnológica de <strong className="text-[#FFFCE1]">{lead.brandName}</strong> ({lead.domain}) e teste Popperiano de falseamento de dados.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-white/10 bg-[#0E100F] text-xs font-bold">
          <button
            onClick={() => setActiveTab('REVERSE_TECH')}
            className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'REVERSE_TECH'
                ? 'bg-[#101211] text-[#00BAE2] border-t-2 border-[#00BAE2] font-black'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Stack Tecnológica & ERP/Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('FALSIFY_AUDIT')}
            className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'FALSIFY_AUDIT'
                ? 'bg-[#101211] text-[#0AE448] border-t-2 border-[#0AE448] font-black'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Protocolo Científico Falsify ({falsifyReport.verdict})</span>
          </button>

          <button
            onClick={() => setActiveTab('RAW_EVIDENCE')}
            className={`px-4 py-2.5 rounded-t-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'RAW_EVIDENCE'
                ? 'bg-[#101211] text-amber-400 border-t-2 border-amber-400 font-black'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Evidências de Estoque Fantasma</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">

          {/* TAB 1: STACK TECNOLÓGICA */}
          {activeTab === 'REVERSE_TECH' && (
            <div className="space-y-4">
              
              {/* Grid 4 Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Plataforma */}
                <div className="p-4 rounded-2xl bg-[#0E100F] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#BBBAA6]">Plataforma de E-Commerce</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/30">
                      {reverseData.platform.type}
                    </span>
                  </div>
                  <div className="text-sm font-black text-[#FFFCE1]">{reverseData.platform.label}</div>
                  <div className="space-y-1 pt-1">
                    {reverseData.platform.evidence.map((ev, i) => (
                      <div key={i} className="text-[11px] text-[#BBBAA6] flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00BAE2] shrink-0 mt-0.5" />
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ERP & Hub */}
                <div className="p-4 rounded-2xl bg-[#0E100F] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#BBBAA6]">ERP & Hub de Integração</span>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-emerald-500/10 text-[#0AE448] border border-emerald-500/30">
                      Confiança: {reverseData.erpAndHubs.confidence}
                    </span>
                  </div>
                  <div className="text-sm font-black text-[#FFFCE1]">
                    ERP: {reverseData.erpAndHubs.primaryErp} | Hub: {reverseData.erpAndHubs.primaryHub}
                  </div>
                  <div className="space-y-1 pt-1">
                    {reverseData.erpAndHubs.signals.map((sig, i) => (
                      <div key={i} className="text-[11px] text-[#BBBAA6] flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0AE448] shrink-0 mt-0.5" />
                        <span>{sig}</span>
                      </div>
                    ))}
                    <div className="text-[10px] font-mono text-[#BBBAA6]/70 pt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>Latência de Sync: {reverseData.erpAndHubs.syncLatencyEstimate}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Telemetria e Pixels */}
              <div className="p-4 rounded-2xl bg-[#0E100F] border border-white/10 space-y-3">
                <span className="text-[10px] font-mono uppercase text-[#BBBAA6] block">
                  Telemetria & Rastreamento no &lt;head&gt; ({reverseData.telemetryAndPixels.trackingScriptsCount} Scripts Detectados)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${reverseData.telemetryAndPixels.hasMetaPixel ? 'bg-emerald-500/10 border-emerald-500/30 text-[#0AE448]' : 'bg-white/5 border-white/10 text-[#BBBAA6]'}`}>
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>Meta Pixel: {reverseData.telemetryAndPixels.hasMetaPixel ? 'ATIVO' : 'AUSENTE'}</span>
                  </div>
                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${reverseData.telemetryAndPixels.hasGoogleTagManager ? 'bg-emerald-500/10 border-emerald-500/30 text-[#0AE448]' : 'bg-white/5 border-white/10 text-[#BBBAA6]'}`}>
                    <span>GTM: {reverseData.telemetryAndPixels.hasGoogleTagManager ? 'ATIVO' : 'AUSENTE'}</span>
                  </div>
                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${reverseData.telemetryAndPixels.hasMicrosoftClarity ? 'bg-[#00BAE2]/10 border-[#00BAE2]/30 text-[#00BAE2]' : 'bg-white/5 border-white/10 text-[#BBBAA6]'}`}>
                    <span>MS Clarity: {reverseData.telemetryAndPixels.hasMicrosoftClarity ? 'ATIVO' : 'AUSENTE'}</span>
                  </div>
                  <div className={`p-2 rounded-xl border flex items-center gap-1.5 ${reverseData.telemetryAndPixels.hasTikTokPixel ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/10 text-[#BBBAA6]'}`}>
                    <span>TikTok: {reverseData.telemetryAndPixels.hasTikTokPixel ? 'ATIVO' : 'AUSENTE'}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: PROTOCOLO FALSIFY */}
          {activeTab === 'FALSIFY_AUDIT' && (
            <div className="space-y-4">
              
              {/* Banner Veredito */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                falsifyReport.verdict === 'VERIFIED_RESILIENT'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-[#0AE448]'
                  : falsifyReport.verdict === 'FALSIFIED_DISCARDED'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                <div className="flex items-center gap-3">
                  <FlaskConical className="w-6 h-6 shrink-0" />
                  <div>
                    <div className="text-sm font-black font-mono">
                      Veredito Epistêmico: {falsifyReport.verdict} ({falsifyReport.scientificConfidencePct}% de Confiança)
                    </div>
                    <div className="text-[11px] text-[#BBBAA6] mt-0.5">
                      {falsifyReport.epistemicNotes}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-[10px] uppercase text-[#BBBAA6]">Sangria Calibrada</div>
                  <div className="text-lg font-black text-[#FFFCE1]">
                    R$ {falsifyReport.calibratedBleedMonthly.toLocaleString('pt-BR')}
                    <span className="text-xs font-normal text-[#BBBAA6]">/mês</span>
                  </div>
                </div>
              </div>

              {/* Os 4 Testes Popperianos Executados */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#BBBAA6] block">
                  As 4 Tentativas Ativas de Falseamento Científico (Karl Popper):
                </span>

                {falsifyReport.testsExecuted.map((t, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#0E100F] border border-white/10 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#FFFCE1]">{t.testName}</span>
                        <span className={`px-2 py-0.2 text-[9px] font-mono font-bold rounded ${
                          t.result === 'SURVIVED'
                            ? 'bg-emerald-500/10 text-[#0AE448] border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {t.result === 'SURVIVED' ? 'HIPÓTESE RESISTIU' : 'FALSIFICADA / QUEBRADA'}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#BBBAA6]">
                        <strong>Objetivo:</strong> {t.objective}
                      </div>
                      <div className="text-[11px] text-[#BBBAA6]/80 font-mono">
                        ↳ <em>{t.evidenceDetails}</em>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 3: EVIDÊNCIAS DE ESTOQUE FANTASMA */}
          {activeTab === 'RAW_EVIDENCE' && (
            <div className="space-y-4">
              
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Princípio Yellowstone Dutton Ranch: Risco de Ruptura Oculta</span>
                </div>
                <p className="text-[11px] text-amber-200/90 leading-relaxed">
                  {reverseData.ghostInventoryAudit.warningMessage || 'Nenhuma discrepância de backorder evidente, porém o estoque físico no ERP deve ser auditado para pronta entrega.'}
                </p>
              </div>

              {/* Detalhes do Produto Alvo */}
              <div className="p-4 rounded-2xl bg-[#0E100F] border border-white/10 space-y-3">
                <span className="text-[10px] font-mono uppercase text-[#BBBAA6] block">Produto Auditado ao Vivo</span>
                <div className="flex items-start gap-4">
                  {lead.primaryBrokenSku.imageSrc && (
                    <img 
                      src={lead.primaryBrokenSku.imageSrc} 
                      alt="" 
                      className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0" 
                    />
                  )}
                  <div className="space-y-1 flex-1">
                    <div className="text-sm font-bold text-[#FFFCE1]">{lead.primaryBrokenSku.productTitle}</div>
                    <div className="text-xs text-[#0AE448] font-mono font-bold">
                      R$ {lead.primaryBrokenSku.price.toFixed(2)}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[10px]">
                      <span className="text-rose-400 font-bold">
                        Tamanhos Esgotados: {lead.primaryBrokenSku.missingSizes.join(', ')}
                      </span>
                      <span className="text-[#BBBAA6]/40">•</span>
                      <span className="text-emerald-400">
                        Disponíveis: {lead.primaryBrokenSku.availableSizes.join(', ') || 'Nenhum'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer com Botão de Cópia Técnica e Fechamento */}
        <div className="p-4 border-t border-white/10 bg-[#0E100F] flex items-center justify-between gap-4">
          <div className="text-[11px] text-[#BBBAA6] font-mono flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Trava Air-Gap: Nenhuma mensagem será transmitida sem autorização explícita.</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyTechReport}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-[#FFFCE1] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copiedPayload ? <Check className="w-3.5 h-3.5 text-[#0AE448]" /> : <Copy className="w-3.5 h-3.5 text-[#00BAE2]" />}
              <span>{copiedPayload ? 'Copiado para Área de Transferência' : 'Copiar Dossiê Técnico'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#00BAE2] hover:bg-[#00BAE2]/90 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[#00BAE2]/20"
            >
              Concluir Auditoria
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
