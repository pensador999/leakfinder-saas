import React, { useState } from 'react';
import { Lock, KeyRound, X, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface FounderAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FounderAuthModal: React.FC<FounderAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Check if user has admin role
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profileData || profileData.role !== 'admin') {
          // Revert sign in if not admin
          await supabase.auth.signOut();
          setErrorMsg('Acesso restrito a administradores.');
        } else {
          onSuccess();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Credenciais inválidas.');
    } finally {
      setIsLoading(false);
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
          🔒 Esta área contém dados financeiros confidenciais, CRM de prospecção de clientes e controle mestre dos 10 agentes. Digite suas credenciais para desbloquear.
        </p>

        {/* Form */}
        <form onSubmit={handleUnlock} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
              E-mail do Administrador:
            </label>
            <div className="relative">
              <input
                type="email"
                autoFocus
                placeholder="admin@exemplo.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                className="w-full pl-4 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold text-slate-400 uppercase block mb-1.5">
              Senha:
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Digite a senha"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                disabled={isLoading}
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
              disabled={isLoading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              <span>{isLoading ? 'Verificando...' : 'Desbloquear Painel'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
