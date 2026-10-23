import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldCheck, Mail, Lock, Loader2, Globe } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { SUPPORTED_LOCALES, StoreLocaleId } from '../i18n/marketProfiles';

const LOGIN_I18N: Record<StoreLocaleId, {
  welcomeBack: string;
  subtitle: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  signInButton: string;
  noAccountText: string;
  registerLink: string;
}> = {
  'pt-BR': {
    welcomeBack: 'Bem-vindo de volta',
    subtitle: 'Acesse o painel analítico do AdShield',
    emailLabel: 'E-mail',
    emailPlaceholder: 'seu@email.com',
    passwordLabel: 'Senha',
    signInButton: 'Entrar na Conta',
    noAccountText: 'Não tem uma conta?',
    registerLink: 'Cadastre-se'
  },
  'en-US': {
    welcomeBack: 'Welcome back',
    subtitle: 'Access the AdShield analytical control tower',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@company.com',
    passwordLabel: 'Password',
    signInButton: 'Sign In',
    noAccountText: "Don't have an account?",
    registerLink: 'Create Account'
  },
  'en-GB': {
    welcomeBack: 'Welcome back',
    subtitle: 'Access the AdShield analytical control tower',
    emailLabel: 'Email Address',
    emailPlaceholder: 'you@company.co.uk',
    passwordLabel: 'Password',
    signInButton: 'Sign In',
    noAccountText: "Don't have an account?",
    registerLink: 'Create Account'
  },
  'de-DE': {
    welcomeBack: 'Willkommen zurück',
    subtitle: 'Zugriff auf das AdShield-Analyse-Dashboard',
    emailLabel: 'E-Mail-Adresse',
    emailPlaceholder: 'name@unternehmen.de',
    passwordLabel: 'Passwort',
    signInButton: 'Anmelden',
    noAccountText: 'Noch kein Konto?',
    registerLink: 'Jetzt registrieren'
  },
  'fr-FR': {
    welcomeBack: 'Bon retour',
    subtitle: 'Accédez au tableau de bord analytique AdShield',
    emailLabel: 'Adresse E-mail',
    emailPlaceholder: 'vous@entreprise.fr',
    passwordLabel: 'Mot de passe',
    signInButton: 'Se Connecter',
    noAccountText: 'Pas encore de compte ?',
    registerLink: "S'inscrire"
  },
  'es-ES': {
    welcomeBack: 'Bienvenido de nuevo',
    subtitle: 'Accede al panel analítico de AdShield',
    emailLabel: 'Correo Electrónico',
    emailPlaceholder: 'tu@empresa.es',
    passwordLabel: 'Contraseña',
    signInButton: 'Iniciar Sesión',
    noAccountText: '¿No tienes una cuenta?',
    registerLink: 'Regístrate'
  }
};

export function LoginPage() {
  const navigate = useNavigate();
  const { uiLocale, setUiLocale } = useTranslation();
  const copy = LOGIN_I18N[uiLocale] || LOGIN_I18N['pt-BR'];
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
      <div className="w-full max-w-md bg-[#101211] rounded-3xl shadow-2xl border border-white/10 p-8 relative">
        <div className="flex justify-end mb-2">
          <div className="flex items-center gap-1.5 bg-[#141716] border border-white/10 rounded-xl px-2.5 py-1">
            <Globe className="w-3 h-3 text-[#0AE448] shrink-0" />
            <select
              aria-label="Global Language Selector"
              value={uiLocale}
              onChange={(e) => setUiLocale(e.target.value as StoreLocaleId)}
              className="bg-transparent text-[10px] font-mono font-bold text-[#FFFCE1] outline-none cursor-pointer"
            >
              {SUPPORTED_LOCALES.map((loc) => (
                <option key={loc.locale} value={loc.locale} className="bg-slate-900 text-white">
                  {loc.flag} {loc.locale.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-2xl flex items-center justify-center mb-4 text-[#0AE448] shadow-md shadow-[#0AE448]/10">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-[#FFFCE1] tracking-tight">{copy.welcomeBack}</h2>
          <p className="text-xs text-[#BBBAA6] mt-1 font-mono">{copy.subtitle}</p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-500/10 text-rose-300 text-xs p-3 rounded-xl border border-rose-500/20 text-center font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#BBBAA6] mb-1.5">{copy.emailLabel}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BBBAA6]" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:ring-1 focus:ring-[#0AE448] transition-all outline-none text-sm"
                placeholder={copy.emailPlaceholder}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#BBBAA6] mb-1.5">{copy.passwordLabel}</label>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : copy.signInButton}
          </button>
        </form>

        <p className="text-center text-xs text-[#BBBAA6] mt-6">
          {copy.noAccountText} <button onClick={() => navigate('/register')} className="text-[#0AE448] font-bold hover:underline ml-1 cursor-pointer">{copy.registerLink}</button>
        </p>
      </div>
    </div>
  );
}

