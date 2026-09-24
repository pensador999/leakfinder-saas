import React, { useState } from 'react';
import { 
  Zap, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  Send 
} from 'lucide-react';
import { runOmnichannelCrossAudit } from '../../services/supplyChain/omnichannelTruthMatrixService';
import { OmnichannelAuditItem } from '../../../api/omnichannel/cross-audit';

export const OmnichannelTruthMatrixSection: React.FC = () => {
  const [isCrossAuditing, setIsCrossAuditing] = useState(false);
  const [items, setItems] = useState<OmnichannelAuditItem[]>([]);
  const [killSwitchTriggered, setKillSwitchTriggered] = useState(false);
  const [whatsAppDispatched, setWhatsAppDispatched] = useState(false);

  const handleRunAudit = async () => {
    setIsCrossAuditing(true);
    try {
      const res = await runOmnichannelCrossAudit();
      setItems(res.items || []);
    } catch (err) {
      console.error('[Omnichannel Cross-Audit Error]:', err);
    } finally {
      setIsCrossAuditing(false);
    }
  };

  const handleTriggerKillSwitch = async () => {
    setKillSwitchTriggered(true);
    setWhatsAppDispatched(true);
    try {
      await runOmnichannelCrossAudit({ executeKillSwitch: true });
    } catch (err) {
      console.warn('Kill switch call:', err);
    }
  };

  return (
    <div className="pt-4 border-t border-white/10 space-y-4">
      <div className="p-5 bg-gradient-to-br from-[#141716] to-[#0E100F] border border-[#0AE448]/30 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#0AE448]/20 rounded-xl text-[#0AE448]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-[#FFFCE1] font-mono">
                Matriz da Verdade Multicanal (Cruzamento Quádruplo)
              </h4>
              <p className="text-[10px] text-[#BBBAA6]">
                Shopify + Sankhya ERP + Magis5 Hub + Meta Ads em tempo real.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRunAudit}
            disabled={isCrossAuditing}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-[#FFFCE1] border border-white/10 rounded-xl text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isCrossAuditing ? 'animate-spin' : ''}`} />
            <span>{isCrossAuditing ? 'Cruzando...' : 'Rodar Cruzamento'}</span>
          </button>
        </div>

        {items.length > 0 && (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.sku}
                className={`p-4 rounded-xl border text-xs space-y-3 ${
                  item.veredito.nivelRisco === 'CRITICO'
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-100'
                    : 'bg-[#0E100F] border-white/10 text-[#FFFCE1]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-sm text-[#FFFCE1]">{item.nome}</div>
                    <div className="text-[10px] text-[#BBBAA6] font-mono">
                      SKU: {item.sku} • R$ {item.preco.toFixed(2)}
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono ${
                      item.veredito.nivelRisco === 'CRITICO'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : 'bg-emerald-500/20 text-[#0AE448] border border-emerald-500/40'
                    }`}
                  >
                    {item.veredito.nivelRisco === 'CRITICO' ? '🚨 ESTOQUE FANTASMA' : '✅ SEGURO'}
                  </span>
                </div>

                {/* 4 Pontos de Auditoria */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
                  <div className="p-2 bg-black/40 rounded-lg border border-white/10">
                    <span className="text-[#BBBAA6] block">1. Shopify Front:</span>
                    <span className="text-amber-400 font-bold">
                      {item.shopifyStatus.disponivelFront ? 'Botão Ativo (Backorder)' : 'Esgotado'}
                    </span>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg border border-white/10">
                    <span className="text-[#BBBAA6] block">2. Sankhya (Galpão):</span>
                    <span className={item.sankhyaStatus.disponivelReal <= 0 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {item.sankhyaStatus.disponivelReal} un físico
                    </span>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg border border-white/10">
                    <span className="text-[#BBBAA6] block">3. Magis5 Hub:</span>
                    <span className={item.magis5Status.pausadoPorEstoque ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {item.magis5Status.statusMercadoLivre}
                    </span>
                  </div>
                  <div className="p-2 bg-black/40 rounded-lg border border-white/10">
                    <span className="text-[#BBBAA6] block">4. Meta Ads:</span>
                    <span className="text-rose-400 font-bold">
                      R$ {item.metaAdsStatus.verbaDiariaReais}/dia
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-[#BBBAA6] leading-relaxed">
                  {item.veredito.motivoDiscrepancia}
                </div>

                {/* Stop-Loss Action Bar */}
                {item.veredito.acaoKillSwitchRecomendada && (
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-rose-500/20">
                    <div className="text-[11px] font-mono">
                      <span className="text-rose-400 font-bold">Queima Evitável: </span>
                      <span className="text-[#FFFCE1]">
                        R$ {item.veredito.desperdicioMensalProjetado.toLocaleString('pt-BR')}/mês
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      {killSwitchTriggered ? (
                        <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/40 text-[#0AE448] font-bold rounded-xl text-[11px] font-mono flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>STOP-LOSS ACIONADO: ANÚNCIO PAUSADO</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={handleTriggerKillSwitch}
                          className="w-full sm:w-auto px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>Disparar Kill-Switch Stop-Loss</span>
                        </button>
                      )}

                      {whatsAppDispatched && (
                        <div className="px-3 py-2 bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30 rounded-xl text-[10px] font-mono flex items-center gap-1">
                          <Send className="w-3 h-3" />
                          <span>WhatsApp (5534991351122) Notificado</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
