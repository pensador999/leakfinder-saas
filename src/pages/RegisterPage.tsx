import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ShieldCheck, Mail, Lock, Loader2, User, Globe } from 'lucide-react';
import { useTranslation } from '../i18n/useTranslation';
import { SUPPORTED_LOCALES, StoreLocaleId } from '../i18n/marketProfiles';

const REGISTER_I18N: Record<StoreLocaleId, {
  createAccountTitle: string;
  subtitle: string;
  confirmEmailNotice: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  createAccountButton: string;
  termsPrefix: string;
  termsLink: string;
  andConnector: string;
  privacyLink: string;
  alreadyHaveAccount: string;
  signInLink: string;
}> = {
  'pt-BR': {
    createAccountTitle: 'Crie sua Conta',
    subtitle: 'Comece a usar o AdShield gratuitamente',
    confirmEmailNotice: 'Por favor, verifique a caixa de entrada do seu E-mail para confirmar a conta antes de entrar.',
    fullNameLabel: 'Nome Completo',
    fullNamePlaceholder: 'Nome do Fundador ou Gestor',
    emailLabel: 'E-mail Corporativo',
    emailPlaceholder: 'seu@email.com',
    passwordLabel: 'Crie uma Senha',
    createAccountButton: 'Criar Conta Agora',
    termsPrefix: 'Ao se cadastrar, você concorda com nossos',
    termsLink: 'Termos de Uso',
    andConnector: 'e',
    privacyLink: 'Política de Privacidade',
    alreadyHaveAccount: 'Já tem uma conta?',
    signInLink: 'Entrar'
  },
  'en-US': {
    createAccountTitle: 'Create Your Account',
    subtitle: 'Start protecting your e-commerce with AdShield',
    confirmEmailNotice: 'Please check your email inbox to confirm your account before signing in.',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Founder or Growth Manager Name',
    emailLabel: 'Work Email',
    emailPlaceholder: 'you@company.com',
    passwordLabel: 'Create a Password',
    createAccountButton: 'Create Account Now',
    termsPrefix: 'By signing up, you agree to our',
    termsLink: 'Terms of Use',
    andConnector: 'and',
    privacyLink: 'Privacy Policy',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign In'
  },
  'en-GB': {
    createAccountTitle: 'Create Your Account',
    subtitle: 'Start protecting your e-commerce with AdShield',
    confirmEmailNotice: 'Please check your email inbox to confirm your account before signing in.',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Founder or Growth Manager Name',
    emailLabel: 'Work Email',
    emailPlaceholder: 'you@company.co.uk',
    passwordLabel: 'Create a Password',
    createAccountButton: 'Create Account Now',
    termsPrefix: 'By signing up, you agree to our',
    termsLink: 'Terms of Use',
    andConnector: 'and',
    privacyLink: 'Privacy Policy',
    alreadyHaveAccount: 'Already have an account?',
    signInLink: 'Sign In'
  },
  'de-DE': {
    createAccountTitle: 'Konto erstellen',
    subtitle: 'Starten Sie kostenlos mit AdShield',
    confirmEmailNotice: 'Bitte überprüfen Sie Ihren Posteingang, um Ihr Konto vor der Anmeldung zu bestätigen.',
    fullNameLabel: 'Vollständiger Name',
    fullNamePlaceholder: 'Name des Gründers oder Managers',
    emailLabel: 'Geschäftliche E-Mail',
    emailPlaceholder: 'name@unternehmen.de',
    passwordLabel: 'Passwort erstellen',
    createAccountButton: 'Jetzt Konto erstellen',
    termsPrefix: 'Mit der Registrierung stimmen Sie unseren',
    termsLink: 'Nutzungsbedingungen',
    andConnector: 'und der',
    privacyLink: 'Datenschutzerklärung',
    alreadyHaveAccount: 'Bereits ein Konto?',
    signInLink: 'Anmelden'
  },
  'fr-FR': {
    createAccountTitle: 'Créez votre Compte',
    subtitle: 'Commencez à utiliser AdShield gratuitement',
    confirmEmailNotice: 'Veuillez vérifier votre boîte de réception pour confirmer votre compte avant de vous connecter.',
    fullNameLabel: 'Nom Complet',
    fullNamePlaceholder: 'Nom du Fondateur ou Responsable',
    emailLabel: 'E-mail Professionnel',
    emailPlaceholder: 'vous@entreprise.fr',
    passwordLabel: 'Créer un Mot de Passe',
    createAccountButton: 'Créer un Compte',
    termsPrefix: 'En vous inscrivant, vous acceptez nos',
    termsLink: "Conditions d'Utilisation",
    andConnector: 'et notre',
    privacyLink: 'Politique de Confidentialité',
    alreadyHaveAccount: 'Vous avez déjà un compte ?',
    signInLink: 'Se Connecter'
  },
  'es-ES': {
    createAccountTitle: 'Crea tu Cuenta',
    subtitle: 'Empieza a usar AdShield gratuitamente',
    confirmEmailNotice: 'Por favor, revisa tu bandeja de entrada para confirmar tu cuenta antes de iniciar sesión.',
    fullNameLabel: 'Nombre Completo',
    fullNamePlaceholder: 'Nombre del Fundador o Gestor',
    emailLabel: 'Correo Corporativo',
    emailPlaceholder: 'tu@empresa.es',
    passwordLabel: 'Crea una Contraseña',
    createAccountButton: 'Crear Cuenta Ahora',
    termsPrefix: 'Al registrarte, aceptas nuestros',
    termsLink: 'Términos de Uso',
    andConnector: 'y',
    privacyLink: 'Política de Privacidad',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    signInLink: 'Iniciar Sesión'
  }
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { uiLocale, setUiLocale } = useTranslation();
  const copy = REGISTER_I18N[uiLocale] || REGISTER_I18N['pt-BR'];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { data: { full_name: name } }
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.user && !data.session) {
      setError(copy.confirmEmailNotice);
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
          <h2 className="text-2xl font-black text-[#FFFCE1] tracking-tight">{copy.createAccountTitle}</h2>
          <p className="text-xs text-[#BBBAA6] mt-1 font-mono">{copy.subtitle}</p>
        </div>

        {error && (
          <div className="mb-6 bg-rose-500/10 text-rose-300 text-xs p-3 rounded-xl border border-rose-500/20 text-center font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-[#BBBAA6] mb-1.5">{copy.fullNameLabel}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BBBAA6]" />
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] focus:ring-1 focus:ring-[#0AE448] transition-all outline-none text-sm"
                placeholder={copy.fullNamePlaceholder}
              />
            </div>
          </div>
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : copy.createAccountButton}
          </button>
        </form>

        <p className="text-center text-xs text-[#BBBAA6] mt-6 leading-relaxed">
          {copy.termsPrefix} <button onClick={() => navigate('/terms')} className="text-[#0AE448] hover:underline cursor-pointer">{copy.termsLink}</button> {copy.andConnector} <button onClick={() => navigate('/privacy')} className="text-[#0AE448] hover:underline cursor-pointer">{copy.privacyLink}</button>.
        </p>

        <p className="text-center text-xs text-[#BBBAA6] mt-6 border-t border-white/10 pt-6">
          {copy.alreadyHaveAccount} <button onClick={() => navigate('/login')} className="text-[#0AE448] font-bold hover:underline ml-1 cursor-pointer">{copy.signInLink}</button>
        </p>
      </div>
    </div>
  );
}

