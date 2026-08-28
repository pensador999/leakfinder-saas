import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, X, CheckCircle2, ArrowRight } from 'lucide-react';

interface FounderAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FounderAuthModal: React.FC<FounderAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pinCode, setPinCode] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Master PIN definition (Default: 2026 or ADSHIELD2026)
    if (pinCode.trim() === '2026' || pinCode.trim().toUpperCase() === 'ADSHIELD' || pinCode.trim() === '777') {
      sessionStorage.setItem('adshield_founder_authenticated', 'true');
      setErrorMsg('');
      onSuccess();
    } else {
      setErrorMsg('Senha Master do Fundador incorreta. Acesso restrito e sigiloso.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn font-sans">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-2xl">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight flex items-center gap-1.5">
              Área Sigilosa do Fundador
            </h3>
            <p className="text-xs text-slate-400 font-mono">Master Business HQ & Gestão de MRR</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50">
          🔒 Esta área contém dados financeiros confidenciais, CRM de prospecção de clientes e controle mestre dos 10 agentes. Digite sua Senha Master para desbloquear.
        </p>

        {/* Form */}
        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
              Senha Master / PIN do Fundador:
            </label>
            <div className="relative">
              <input
                type="password"
                autoFocus
                placeholder="Digite a senha (padrão: 2026)"
                value={pinCode}
                onChange={(e) => { setPinCode(e.target.value); setErrorMsg(''); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
            {errorMsg && (
              <span className="text-xs font-bold text-rose-400 block mt-1.5 font-mono">
                {errorMsg}
              </span>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <span>Desbloquear Painel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
