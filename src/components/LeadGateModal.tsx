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
        // Se o erro for de duplicação, ainda assim liberamos o relatório, 
        // apenas logamos o aviso ou seguimos.
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
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1.5" style={{ backgroundColor: whiteLabel.primaryColor }}></div>
        
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center relative">
            <Lock className="w-8 h-8 text-slate-700" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white" style={{ backgroundColor: whiteLabel.primaryColor }}>
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">
              Auditoria Concluída!
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Encontramos falhas críticas e oportunidades ocultas de vendas no site <strong className="text-slate-900">{analyzedUrl}</strong>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left">
            <h3 className="font-bold text-slate-800 text-sm mb-3">O relatório inclui:</h3>
            <ul className="text-sm text-slate-600 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: whiteLabel.primaryColor }}></span>
                Score de UX/UI & CRO
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: whiteLabel.primaryColor }}></span>
                Vazamentos de Segurança e SEO
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: whiteLabel.primaryColor }}></span>
                Análise da Oferta & Copywriting
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: whiteLabel.primaryColor }}></span>
                Inteligência sobre a Concorrência
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-sm font-semibold text-slate-700 block">Para onde enviamos o relatório?</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail profissional"
                  className="w-full bg-white border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl py-3 pl-10 pr-4 text-slate-800 placeholder-slate-400 transition-all outline-none"
                  style={{ '--tw-ring-color': `${whiteLabel.primaryColor}50` } as any}
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-red-500 text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg"
              style={{ backgroundColor: whiteLabel.primaryColor, boxShadow: `0 4px 14px 0 ${whiteLabel.primaryColor}40` }}
            >
              {loading ? (
                'Liberando Acesso...'
              ) : (
                <>
                  Desbloquear Relatório Agora
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-xs text-slate-400">
              Ao continuar, você concorda em receber comunicações da {whiteLabel.agencyName}. 100% livre de spam.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
