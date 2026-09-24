import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { getWhiteLabelConfig } from '../services/whiteLabelService';
import { supabase } from '../lib/supabase';

interface LeadGateModalProps {
  onUnlock: (email: string) => void;
  analyzedUrl: string;
}

export const LeadGateModal: React.FC<LeadGateModalProps> = ({ onUnlock, analyzedUrl }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const whiteLabel = getWhiteLabelConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setLoading(true);
    setErrorMsg('');

    try {
      // Inserir lead no Supabase
      const { error } = await supabase
        .from('leads')
        .insert([
          { 
            email: email.trim(), 
            analyzed_url: analyzedUrl,
            white_label_agency: whiteLabel.agencyName
          }
        ]);

      if (error) {
        console.warn('Erro ao salvar lead:', error.message);
      }
      
      // Delay de UX para o "Desbloqueando..."
      setTimeout(() => {
        onUnlock(email);
      }, 800);

    } catch (err) {
      console.error(err);
      setErrorMsg('Ocorreu um erro. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#101211] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-[#FFFCE1]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0AE448] via-[#00BAE2] to-[#0AE448]" />
        
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
            <Lock className="w-8 h-8 text-[#0AE448]" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#101211] bg-[#0AE448]">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-black text-[#FFFCE1] mb-2">
              Auditoria Concluída!
            </h2>
            <p className="text-[#BBBAA6] text-xs leading-relaxed">
              Encontramos falhas críticas e oportunidades ocultas de vendas no site <strong className="text-[#00BAE2]">{analyzedUrl}</strong>.
            </p>
          </div>

          <div className="bg-[#141716] border border-white/10 rounded-2xl p-4 text-left">
            <h3 className="font-bold text-[#FFFCE1] text-xs uppercase tracking-wider font-mono mb-3">O relatório inclui:</h3>
            <ul className="text-xs text-[#BBBAA6] space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0AE448]" />
                Score de UX/UI & CRO e Mapa de Calor
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0AE448]" />
                Vazamentos de Tráfego Pago & Ruptura de Estoque
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0AE448]" />
                Auditoria de Catálogo (Grade PP ao G2)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0AE448]" />
                Inteligência Competitiva & Espião de Anúncios
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-[#BBBAA6] block">Para onde enviamos o relatório?</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-[#BBBAA6]/60" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail profissional"
                  className="w-full bg-[#0E100F] border border-white/10 focus:border-[#0AE448] rounded-xl py-3 pl-10 pr-4 text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 transition-all outline-none"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-rose-400 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-xs uppercase tracking-wider py-3.5 px-4 rounded-xl transition-all shadow-lg shadow-[#0AE448]/20 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                'Liberando Acesso...'
              ) : (
                <>
                  <span>Desbloquear Relatório Agora</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-[#BBBAA6]/60">
              Ao continuar, você concorda em receber comunicações da {whiteLabel.agencyName}. 100% livre de spam.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
