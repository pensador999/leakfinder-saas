import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Store, 
  Smartphone, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Clock, 
  Globe, 
  Lock, 
  Check, 
  AlertTriangle,
  Send,
  Building2,
  ExternalLink
} from 'lucide-react';
import { PlanDetails, PaymentTransactionResult, SAAS_PLANS } from '../../services/billing/checkoutService';
import { extractCleanDomainAndBrand } from '../../services/siteInspector';
import { MonitoredStore } from '../../services/swarm/autonomousSwarmEngine';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface SubscriberOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanDetails;
  transaction?: PaymentTransactionResult;
  onComplete: () => void;
}

export const SubscriberOnboardingModal: React.FC<SubscriberOnboardingModalProps> = ({
  isOpen,
  onClose,
  plan,
  transaction,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Maximum allowed stores based on tier
  const maxStores = plan.id === 'AGENCY_ENTERPRISE' ? 15 : plan.id === 'GROWTH_PRO' ? 3 : 1;

  // Step 1: Stores input
  const [storeUrls, setStoreUrls] = useState<string[]>(['']);
  const [storeNiches, setStoreNiches] = useState<string[]>(['Moda & Vestuário']);

  // Step 2: WhatsApp Watchdog
  const [phone, setPhone] = useState<string>('');
  const [preferredHour, setPreferredHour] = useState<string>('07:00');
  const [testSent, setTestSent] = useState<boolean>(false);

  // Step 3: Safeguards & Kill-Switch
  const [killSwitchEnabled, setKillSwitchEnabled] = useState<boolean>(true);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAddStoreInput = () => {
    if (storeUrls.length < maxStores) {
      setStoreUrls([...storeUrls, '']);
      setStoreNiches([...storeNiches, 'Moda & Vestuário']);
    }
  };

  const handleUpdateStoreUrl = (index: number, val: string) => {
    const updated = [...storeUrls];
    updated[index] = val;
    setStoreUrls(updated);
  };

  const handleUpdateStoreNiche = (index: number, val: string) => {
    const updated = [...storeNiches];
    updated[index] = val;
    setStoreNiches(updated);
  };

  const handleSendTestWhatsApp = () => {
    if (!phone.replace(/\D/g, '')) return;
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  const handleFinishOnboarding = async () => {
    setIsFinishing(true);

    try {
      // 1. Process and save stores to local storage & Supabase
      const newStores: MonitoredStore[] = [];
      const cleanPhone = phone.replace(/\D/g, '') || '5511999999999';

      for (let i = 0; i < storeUrls.length; i++) {
        const rawUrl = storeUrls[i].trim();
        if (rawUrl) {
          const { cleanUrl, brandName } = extractCleanDomainAndBrand(rawUrl);
          const storeObj: MonitoredStore = {
            id: `store-sub-${Date.now()}-${i}`,
            storeUrl: cleanUrl,
            brandName: brandName || `Loja ${i + 1}`,
            niche: storeNiches[i] || 'Moda & Vestuário',
            targetPhone: cleanPhone,
            isActive: true,
            checkIntervalHours: 24,
            currentScore: 82,
            currentEstimatedLoss: 0
          };
          newStores.push(storeObj);

          if (isSupabaseConfigured) {
            try {
              await supabase.from('swarm_monitored_stores').insert([{
                store_url: cleanUrl,
                brand_name: storeObj.brandName,
                niche: storeObj.niche,
                target_phone: cleanPhone,
                is_active: true,
                check_interval_hours: 24,
                current_score: 82,
                current_estimated_loss: 0
              }]);
            } catch (err) {
              console.warn('Supabase store save fallback:', err);
            }
          }
        }
      }

      // Merge with existing local stores
      const existingRaw = localStorage.getItem('adshield_local_monitored_stores');
      const existing: MonitoredStore[] = existingRaw ? JSON.parse(existingRaw) : [];
      const merged = [...newStores, ...existing.filter(e => !newStores.some(n => n.storeUrl === e.storeUrl))];
      localStorage.setItem('adshield_local_monitored_stores', JSON.stringify(merged));

      // 2. Save WhatsApp preference
      localStorage.setItem('adshield_watchdog_phone', cleanPhone);
      localStorage.setItem('adshield_watchdog_hour', preferredHour);
      localStorage.setItem('adshield_killswitch_active', killSwitchEnabled ? 'true' : 'false');
      localStorage.setItem('adshield_onboarding_completed', 'true');

      // Trigger Celebration Confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0AE448', '#00BAE2', '#FFFCE1']
      });

      onComplete();
    } catch (e) {
      console.error('Error during onboarding finish:', e);
      onComplete();
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[70] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#101211] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fadeIn text-[#FFFCE1]">
        
        {/* Header with Steps */}
        <div className="p-6 bg-[#141716] border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#0AE448]/10 text-[#0AE448] rounded-xl border border-[#0AE448]/30">
                <Sparkles className="w-5 h-5 text-[#0AE448]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#FFFCE1] flex items-center gap-2">
                  <span>Ativação Rápida AdShield</span>
                  <span className="px-2 py-0.5 bg-[#0AE448]/10 text-[#0AE448] text-[10px] font-mono font-bold rounded-full border border-[#0AE448]/30">
                    {plan.name}
                  </span>
                </h3>
                <p className="text-[11px] text-[#BBBAA6]">
                  Configure sua salvaguarda de tráfego em menos de 2 minutos
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-[#0AE448] font-bold">
              Passo {currentStep} de 3
            </span>
          </div>

          {/* Progress Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`h-1.5 rounded-full transition-all ${currentStep >= 1 ? 'bg-[#0AE448]' : 'bg-white/10'}`} />
            <div className={`h-1.5 rounded-full transition-all ${currentStep >= 2 ? 'bg-[#0AE448]' : 'bg-white/10'}`} />
            <div className={`h-1.5 rounded-full transition-all ${currentStep >= 3 ? 'bg-[#0AE448]' : 'bg-white/10'}`} />
          </div>
        </div>

        {/* Wizard Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">

          {/* ================= STEP 1 ================= */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#0AE448] font-mono text-xs font-bold uppercase tracking-wider">
                  <Store className="w-4 h-4" />
                  <span>Passo 1: Lojas Monitoradas 24/7</span>
                </div>
                <h4 className="text-lg font-bold text-[#FFFCE1]">
                  Qual e-commerce você quer colocar sob proteção hoje?
                </h4>
                <p className="text-xs text-[#BBBAA6] leading-relaxed">
                  Seu plano <strong>{plan.name}</strong> dá direito ao monitoramento contínuo de <strong>até {maxStores} loja(s)</strong> simultaneamente.
                </p>
              </div>

              <div className="space-y-3">
                {storeUrls.map((url, idx) => (
                  <div key={idx} className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#BBBAA6]">
                      <span className="font-bold text-[#FFFCE1]">Loja #{idx + 1}</span>
                      <span className="text-[10px] text-[#7C7C6F]">Varredura Contínua</span>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          placeholder="ex: sualoja.com.br"
                          value={url}
                          onChange={(e) => handleUpdateStoreUrl(idx, e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl text-xs font-mono focus:border-[#0AE448] focus:outline-none"
                        />
                      </div>

                      <div>
                        <select
                          value={storeNiches[idx]}
                          onChange={(e) => handleUpdateStoreNiche(idx, e.target.value)}
                          className="w-full px-3 py-2.5 bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl text-xs focus:border-[#0AE448] focus:outline-none"
                        >
                          <option value="Moda & Vestuário">Moda & Vestuário</option>
                          <option value="Calçados & Botas">Calçados & Botas</option>
                          <option value="Agropecuária & Campo">Agropecuária</option>
                          <option value="Pesca & Esportes">Pesca & Outdoor</option>
                          <option value="Autopeças & Moto">Autopeças</option>
                          <option value="Cosméticos & Beleza">Beleza & Saúde</option>
                          <option value="Geral & Acessórios">Outros Segmentos</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}

                {storeUrls.length < maxStores && (
                  <button
                    type="button"
                    onClick={handleAddStoreInput}
                    className="w-full py-2.5 border border-dashed border-white/20 hover:border-[#0AE448] text-xs font-mono text-[#BBBAA6] hover:text-[#0AE448] rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>+ Adicionar outra loja ({storeUrls.length}/{maxStores} usadas)</span>
                  </button>
                )}
              </div>

              <div className="p-3.5 bg-[#0AE448]/10 rounded-2xl border border-[#0AE448]/30 flex items-start gap-2.5 text-xs text-[#0AE448]">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  O AdShield inspecionará o HTML público e o catálogo em tempo real, sem necessidade de senhas ou acesso confidencial.
                </p>
              </div>
            </div>
          )}

          {/* ================= STEP 2 ================= */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#0AE448] font-mono text-xs font-bold uppercase tracking-wider">
                  <Smartphone className="w-4 h-4" />
                  <span>Passo 2: Vigia WhatsApp das 07:00</span>
                </div>
                <h4 className="text-lg font-bold text-[#FFFCE1]">
                  Para qual WhatsApp devemos enviar o raio-x diário matinal?
                </h4>
                <p className="text-xs text-[#BBBAA6] leading-relaxed">
                  Todos os dias às 07:00 da manhã, o AdShield avisa se algum anúncio ativo está promovendo produtos que esgotaram no estoque na noite anterior.
                </p>
              </div>

              <div className="p-5 bg-[#141716] rounded-2xl border border-white/10 space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#FFFCE1] block mb-1.5 font-mono">
                    WhatsApp do Gestor de Tráfego ou Dono da Loja:
                  </label>
                  <input
                    type="text"
                    placeholder="(34) 99135-1122"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl text-sm font-mono focus:border-[#0AE448] focus:outline-none"
                  />
                  <span className="text-[10px] text-[#7C7C6F] font-mono block mt-1">
                    Número com DDD utilizado para alertas operacionais de alta prioridade.
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <span className="text-xs font-bold text-[#FFFCE1] block">Horário do Resumo Matinal:</span>
                    <span className="text-[10px] text-[#7C7C6F]">Antes da subida de lances no Meta Ads</span>
                  </div>

                  <select
                    value={preferredHour}
                    onChange={(e) => setPreferredHour(e.target.value)}
                    className="px-3 py-1.5 bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl text-xs font-mono focus:border-[#0AE448]"
                  >
                    <option value="06:30">06:30 da manhã</option>
                    <option value="07:00">07:00 da manhã (Recomendado)</option>
                    <option value="07:30">07:30 da manhã</option>
                    <option value="08:00">08:00 da manhã</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSendTestWhatsApp}
                    disabled={!phone.trim() || testSent}
                    className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-xs font-bold text-[#0AE448] border border-[#0AE448]/30 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {testSent ? (
                      <>
                        <Check className="w-4 h-4 text-[#0AE448]" />
                        <span>Disparo de teste simulado com sucesso!</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Simular Envio de Teste no WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {testSent && (
                <div className="p-3.5 bg-[#0AE448]/10 border border-[#0AE448]/30 rounded-2xl text-xs text-[#0AE448] space-y-1 animate-fadeIn">
                  <span className="font-bold block">Mensagem Formatada Pronta:</span>
                  <p className="font-mono text-[11px] text-[#BBBAA6]">
                    "🛡️ [AdShield Alerta 07:00] Bom dia! Detectamos 2 produtos em campanha no Meta Ads com os tamanhos M e G esgotados. Verifique antes de ligar o orçamento de hoje."
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 3 ================= */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#0AE448] font-mono text-xs font-bold uppercase tracking-wider">
                  <Zap className="w-4 h-4" />
                  <span>Passo 3: Salvaguardas & Kill-Switch</span>
                </div>
                <h4 className="text-lg font-bold text-[#FFFCE1]">
                  Ativação das Proteções Ativas de Tráfego
                </h4>
                <p className="text-xs text-[#BBBAA6] leading-relaxed">
                  Configure o nível de automação contra queima de mídia paga em anúncios sem estoque.
                </p>
              </div>

              <div className="space-y-3">
                {/* Kill Switch Toggle */}
                <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5 max-w-sm">
                    <span className="text-xs font-bold text-[#FFFCE1] flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#0AE448]" />
                      <span>Auto-Kill Switch Meta Ads</span>
                    </span>
                    <p className="text-[11px] text-[#BBBAA6]">
                      Pausa automática de anúncios na Meta Graph API ao identificar ruptura nos tamanhos principais.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setKillSwitchEnabled(!killSwitchEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      killSwitchEnabled ? 'bg-[#0AE448]' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`bg-slate-950 w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        killSwitchEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Chrome Extension Download Card */}
                <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#FFFCE1] flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#00BAE2]" />
                      <span>Extensão Chrome Oficial AdShield (Manifest V3)</span>
                    </span>
                    <p className="text-[11px] text-[#BBBAA6]">
                      Inspeciona estoques e tabela de medidas direto na vitrine enquanto navega.
                    </p>
                  </div>

                  <a
                    href="#chrome-extension"
                    onClick={(e) => { e.preventDefault(); alert("O pacote .zip da Extensão Chrome Manifest V3 está pronto para carregamento via 'Modo Desenvolvedor' no seu navegador."); }}
                    className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-[#00BAE2] font-bold rounded-xl border border-[#00BAE2]/30 flex items-center gap-1 transition-all"
                  >
                    <span>Baixar</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* CDC Warranty Shield */}
                <div className="p-4 bg-[#0AE448]/10 rounded-2xl border border-[#0AE448]/30 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-[#0AE448] shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-[#FFFCE1] block">
                      Garantia Incondicional de 7 Dias Ativada (CDC Art. 49)
                    </span>
                    <span className="text-[#A0A090]">
                      Se o AdShield não poupar pelo menos 3x o valor da assinatura em tráfego protegido, você pode solicitar reembolso em 1-clique.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Wizard Footer Controls */}
        <div className="p-5 bg-[#141716] border-t border-white/10 flex items-center justify-between shrink-0">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
              className="px-4 py-2.5 text-xs text-[#BBBAA6] hover:text-[#FFFCE1] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
              className="px-6 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition-all shadow-md shadow-[#0AE448]/20 cursor-pointer"
            >
              <span>Avançar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinishOnboarding}
              disabled={isFinishing}
              className="px-6 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition-all shadow-lg shadow-[#0AE448]/30 cursor-pointer animate-pulse"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isFinishing ? 'Ativando Proteção...' : 'Concluir Ativação & Entrar no Painel'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
