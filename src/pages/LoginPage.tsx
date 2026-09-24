import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E100F] flex items-center justify-center p-4 text-[#FFFCE1] selection:bg-[#0AE448] selection:text-slate-950">
      <div className="w-full max-w-md bg-[#101211] rounded-3xl shadow-2xl border border-white/10 p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-2xl flex items-center justify-center mb-4 text-[#0AE448] shadow-md shadow-[#0AE448]/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#FFFCE1] tracking-tight">Bem-vindo de volta</h2>
          <p className="text-xs text-[#BBBAA6] mt-1 font-mono">Acesse o painel analítico do AdShield</p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-500/10 text-rose-300 text-xs p-3 rounded-xl border border-rose-500/20 text-center font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#BBBAA6] mb-1.5">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BBBAA6]" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:ring-1 focus:ring-[#0AE448] transition-all outline-none text-sm"
                placeholder="seu@email.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#BBBAA6] mb-1.5">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BBBAA6]" />
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:ring-1 focus:ring-[#0AE448] transition-all outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 uppercase text-xs tracking-wider shadow-lg shadow-[#0AE448]/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : 'Entrar na Conta'}
          </button>
        </form>

        <p className="text-center text-xs text-[#BBBAA6] mt-6">
          Não tem uma conta? <button onClick={() => navigate('/register')} className="text-[#0AE448] font-bold hover:underline ml-1 cursor-pointer">Cadastre-se</button>
        </p>
      </div>
    </div>
  );
}
