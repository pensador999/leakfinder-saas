import React, { useState, useEffect } from 'react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('leakfinder_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('leakfinder_cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 shadow-2xl z-50 animate-fade-in-up">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-slate-300">
          Nós utilizamos cookies para melhorar a sua experiência no LeakFinder, analisar tráfego e personalizar conteúdo. 
          Ao continuar navegando, você concorda com a nossa política de privacidade.
        </p>
        <button
          onClick={acceptCookies}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-colors whitespace-nowrap"
        >
          Aceitar e Continuar
        </button>
      </div>
    </div>
  );
};
