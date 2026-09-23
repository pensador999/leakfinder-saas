import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  RotateCcw, 
  Zap, 
  Power, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Flame,
  Check,
  Package
} from 'lucide-react';
import { OneClickMitigationService, MitigationActionRecord } from '../../services/actions/oneClickMitigationService';

interface MitigationHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRollbackSuccess?: (message: string) => void;
}

export const MitigationHistoryDrawer: React.FC<MitigationHistoryDrawerProps> = ({
  isOpen,
  onClose,
  onRollbackSuccess
}) => {
  const [logs, setLogs] = useState<MitigationActionRecord[]>([]);
  const [revertingId, setRevertingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const refreshLogs = () => {
    setLogs(OneClickMitigationService.getActionLogs());
  };

  useEffect(() => {
    if (isOpen) {
      refreshLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalMonthlySaved = logs.reduce((acc, log) => {
    return acc + (log.status !== 'REVERTED' ? (log.budgetSavedDailyBRL * 30) : 0);
  }, 0);

  const activeActionsCount = logs.filter(l => l.status !== 'REVERTED').length;

  const handleRollback = async (actionId: string) => {
    setRevertingId(actionId);
    try {
      const res = await OneClickMitigationService.rollbackAction(actionId);
      refreshLogs();
      const msg = res.message || 'Ação desfeita com sucesso!';
      setFeedback(msg);
      if (onRollbackSuccess) onRollbackSuccess(msg);
      setTimeout(() => setFeedback(null), 3500);
    } catch {
      setFeedback('Erro ao reverter ação.');
      setTimeout(() => setFeedback(null), 3500);
    } finally {
      setRevertingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/70 backdrop-blur-xs animate-fadeIn font-sans">
      <div 
        className="w-full max-w-xl bg-[#101211] h-full shadow-2xl flex flex-col justify-between border-l border-white/10 animate-slideLeft text-[#FFFCE1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#0E100F] text-[#FFFCE1] flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/20 text-[#0AE448] rounded-xl border border-[#0AE448]/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#FFFCE1]">Central de Ações Mitigadas</h3>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#0AE448]/20 text-[#0AE448] rounded-full border border-[#0AE448]/30">
                  Audit Trail
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6] mt-0.5">
                Histórico imutável de 1-cliques efetuados na Shopify e Meta Ads
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Financial Bleed Shield Banner */}
        <div className="p-5 bg-gradient-to-r from-[#0AE448]/20 via-[#141716] to-[#0E100F] text-[#FFFCE1] border-b border-white/10 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#0AE448] font-mono">
              Economia Protegida Acumulada
            </span>
            <p className="text-2xl font-black text-[#0AE448] font-mono mt-0.5">
              R$ {totalMonthlySaved.toLocaleString('pt-BR')} / mês
            </p>
            <p className="text-[11px] text-[#BBBAA6]">
              {activeActionsCount} ação(ões) ativas estancando queima de tráfego
            </p>
          </div>
          <div className="p-3 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-2xl text-[#0AE448]">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div className="m-4 p-3 bg-[#0AE448]/20 border border-[#0AE448]/40 text-[#0AE448] text-xs font-bold rounded-xl flex items-center gap-2 animate-fadeIn shrink-0">
            <Check className="w-4 h-4 text-[#0AE448] shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {logs.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-[#141716] border border-white/10 rounded-full flex items-center justify-center mx-auto text-[#BBBAA6]">
                <ShieldCheck className="w-8 h-8 text-[#0AE448]" />
              </div>
              <p className="text-sm font-bold text-[#FFFCE1]">Nenhuma mitigação executada ainda</p>
              <p className="text-xs text-[#BBBAA6] max-w-sm mx-auto">
                Quando você utilizar os botões de <strong>1-Clique</strong> para pausar anúncios ou colocar produtos em rascunho, o registro aparecerá aqui com opção de rollback.
              </p>
            </div>
          ) : (
            logs.map((log) => {
              const isReverted = log.status === 'REVERTED';
              const isShopify = log.targetPlatform === 'SHOPIFY';

              return (
                <div 
                  key={log.id}
                  className={`p-4 rounded-2xl border transition-all space-y-3 ${
                    isReverted 
                      ? 'bg-[#141716]/60 border-white/5 opacity-60' 
                      : 'bg-[#141716] border-white/10 hover:border-[#0AE448]/40 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-md ${
                        isShopify ? 'bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30' : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}>
                        {log.targetPlatform}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                        isReverted 
                          ? 'bg-white/5 text-slate-500' 
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {log.actionType}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-[#FFFCE1] leading-tight">
                      {log.productTitle}
                    </h4>
                    {log.sku && (
                      <span className="text-[11px] font-mono text-[#BBBAA6]">
                        SKU: <strong className="text-white">{log.sku}</strong>
                      </span>
                    )}
                    {log.notes && (
                      <p className="text-[11px] text-[#BBBAA6] mt-1 leading-relaxed">
                        {log.notes}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <div className="text-[11px] font-mono">
                      {log.budgetSavedDailyBRL > 0 && (
                        <span className="font-bold text-[#0AE448]">
                          Economia: ~R$ {Math.round(log.budgetSavedDailyBRL * 30).toLocaleString('pt-BR')}/mês
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {log.adminUrl && (
                        <a
                          href={log.adminUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 border border-white/10"
                          title="Abrir no painel da Shopify"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Admin</span>
                        </a>
                      )}

                      {!isReverted ? (
                        <button
                          onClick={() => handleRollback(log.id)}
                          disabled={revertingId === log.id}
                          className="px-3 py-1 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          title="Reverter alteração e restaurar status anterior"
                        >
                          <RotateCcw className={`w-3 h-3 ${revertingId === log.id ? 'animate-spin' : ''}`} />
                          <span>{revertingId === log.id ? 'Revertendo...' : 'Desfazer'}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
                          Revertido ✓
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0E100F] border-t border-white/10 text-center shrink-0">
          <p className="text-[11px] text-[#BBBAA6]">
            AdShield Autonomous Active Mitigation Engine • Protocolo de Zero Ações Destrutivas
          </p>
        </div>
      </div>
    </div>
  );
};
