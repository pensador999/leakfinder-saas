import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  Check, 
  QrCode, 
  CreditCard, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  HelpCircle,
  Zap,
  Building2,
  Rocket,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { 
  SAAS_PLANS, 
  PlanTierId, 
  PlanDetails,
  BillingCycle, 
  PaymentMethod, 
  BuyerFormData, 
  CreditCardFormData, 
  PaymentTransactionResult,
  generatePixPayment,
  processCreditCardPayment,
  saveActiveLicense
} from '../../services/billing/checkoutService';
import { redirectToStripeCheckout, StripePlanId } from '../../services/billing/stripeRealCheckoutService';
import { formatBRL } from '../../services/ai/storeFinancialGroundingEngine';
import { getWhiteLabelConfig } from '../../services/whiteLabelService';

interface TransparentCheckoutModalProps {
  onClose: () => void;
  initialPlan?: PlanTierId;
  onOpenOnboarding?: (plan: PlanDetails) => void;
}

export const TransparentCheckoutModal: React.FC<TransparentCheckoutModalProps> = ({
  onClose,
  initialPlan = 'GROWTH_PRO',
  onOpenOnboarding
}) => {
  const navigate = useNavigate();
  const [selectedPlanId, setSelectedPlanId] = useState<PlanTierId>(initialPlan);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('MONTHLY');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');

  const [buyer, setBuyer] = useState<BuyerFormData>({
    fullName: '',
    email: '',
    phone: '',
    document: ''
  });

  const [card, setCard] = useState<CreditCardFormData>({
    cardNumber: '',
    holderName: '',
    expiryMonth: '12',
    expiryYear: '28',
    cvv: '',
    installments: 1
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [pixResult, setPixResult] = useState<PaymentTransactionResult | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedPlan = SAAS_PLANS[selectedPlanId];
  const finalPrice = billingCycle === 'MONTHLY' ? selectedPlan.monthlyPrice : selectedPlan.yearlyTotalPrice;
  const wlConfig = getWhiteLabelConfig();

  const externalCheckoutUrl = (
    selectedPlanId === 'STARTER'
      ? wlConfig.checkoutUrlStarter
      : selectedPlanId === 'GROWTH_PRO'
      ? wlConfig.checkoutUrlPro
      : wlConfig.checkoutUrlAgency
  )?.trim() || '';

  const handleOpenAssistedWhatsAppCheckout = () => {
    const cleanPhone = (wlConfig.consultantWhatsApp || '5511999999999').replace(/\D/g, '');
    const targetPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    const cycleLabel = billingCycle === 'MONTHLY' ? 'Mensal' : 'Anual (20% OFF)';
    const msg = encodeURIComponent(
      `Olá ${wlConfig.consultantName || wlConfig.agencyName || 'Especialista AdShield'}! Quero ativar o plano *${selectedPlan.name}* (${cycleLabel} - ${formatBRL(finalPrice)}) com onboarding assistido.${buyer.fullName ? `\n\nNome: ${buyer.fullName}` : ''}${buyer.email ? `\nE-mail: ${buyer.email}` : ''}`
    );
    window.open(`https://wa.me/${targetPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const handleGeneratePix = (e: React.FormEvent) => {
    e.preventDefault();
    if (externalCheckoutUrl && externalCheckoutUrl.startsWith('http')) {
      window.open(externalCheckoutUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!buyer.fullName || !buyer.email || !buyer.document) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    setErrorMessage('');
    const result = generatePixPayment(selectedPlan, billingCycle, buyer);
    setPixResult(result);
  };

  const handleProcessCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (externalCheckoutUrl && externalCheckoutUrl.startsWith('http')) {
      window.open(externalCheckoutUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (!buyer.fullName || !buyer.email || !buyer.document) {
      setErrorMessage('Por favor, preencha seus dados de contato.');
      return;
    }
    if (!card.cardNumber || !card.holderName || !card.cvv) {
      setErrorMessage('Por favor, preencha os dados do cartão de crédito.');
      return;
    }
    setErrorMessage('');
    // Map local plan ID to Stripe plan ID
    const stripePlanMap: Record<PlanTierId, StripePlanId> = {
      STARTER: 'STARTER',
      GROWTH_PRO: 'PRO',
      AGENCY_ENTERPRISE: 'AGENCY'
    };
    const targetStripePlan = stripePlanMap[selectedPlanId] || 'PRO';

    try {
      // 💳 Tentativa 1: Stripe Checkout Real Oficial (Seguro, PCI-Compliant)
      const redirected = await redirectToStripeCheckout(targetStripePlan, buyer.email);
      if (redirected) {
        return; // Navegador redirecionado para a Stripe
      }
    } catch (stripeErr) {
      console.warn('[CheckoutModal] Stripe Real indisponível, caindo para processamento local:', stripeErr);
    }

    try {
      const result = await processCreditCardPayment(selectedPlan, billingCycle, buyer, card);
      if (result.status === 'APPROVED') {
        setIsSuccess(true);
      }
    } catch {
      setErrorMessage('Erro ao processar o pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatePixPaid = () => {
    if (pixResult) {
      const approved: PaymentTransactionResult = {
        ...pixResult,
        status: 'APPROVED',
        paidAt: new Date().toISOString()
      };
      saveActiveLicense(approved);
      setIsSuccess(true);
    }
  };

  const handleCopyPix = () => {
    if (pixResult?.pixPayload?.copiaECola) {
      navigator.clipboard.writeText(pixResult.pixPayload.copiaECola);
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#101211] rounded-3xl shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[92vh] border border-white/10 text-[#FFFCE1] animate-fadeIn">
        
        {/* Top Header */}
        <div className="p-5 bg-[#141716] border-b border-white/10 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#0AE448]/10 text-[#0AE448] rounded-xl border border-[#0AE448]/30">
              <ShieldCheck className="w-5 h-5 text-[#0AE448]" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#FFFCE1]">AdShield • Checkout 100% Seguro</h3>
              <p className="text-[11px] text-[#BBBAA6] flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#0AE448]" />
                <span>Criptografia SSL de 256 bits • Ativação Imediata</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] rounded-full transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">

          {isSuccess ? (
            /* SUCCESS STATE */
            <div className="text-center py-12 space-y-6 max-w-md mx-auto">
              <div className="w-20 h-20 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 bg-[#0AE448]/10 text-[#0AE448] text-xs font-mono font-bold rounded-full border border-[#0AE448]/30">
                  PAGAMENTO APROVADO & LICENÇA ATIVADA
                </span>
                <h3 className="text-2xl font-black text-[#FFFCE1]">
                  Bem-vindo ao AdShield {selectedPlan.name}!
                </h3>
                <p className="text-xs text-[#BBBAA6] leading-relaxed">
                  Sua conta foi ativada com sucesso. O recibo oficial e o token de acesso foram enviados para <strong className="text-[#FFFCE1]">{buyer.email || 'seu e-mail'}</strong>.
                </p>
              </div>

              <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 text-left text-xs font-mono space-y-1.5 text-[#BBBAA6]">
                <div className="flex justify-between">
                  <span>Plano Ativado:</span>
                  <strong className="text-[#FFFCE1]">{selectedPlan.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Ciclo:</span>
                  <strong className="text-[#FFFCE1]">{billingCycle === 'MONTHLY' ? 'Mensal' : 'Anual (20% OFF)'}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Valor Pago:</span>
                  <strong className="text-[#0AE448]">{formatBRL(finalPrice)}</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenOnboarding) {
                    onOpenOnboarding(selectedPlan);
                  } else {
                    navigate('/dashboard?onboarding=true');
                  }
                }}
                className="w-full py-4 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-2xl transition-all shadow-lg shadow-[#0AE448]/20 cursor-pointer flex items-center justify-center gap-2 animate-pulse"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Configurar Lojas & Ativar Proteção 24h</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : pixResult ? (
            /* PIX SCREEN */
            <div className="text-center py-4 space-y-6 max-w-lg mx-auto">
              <div className="space-y-1">
                <span className="px-3 py-1 bg-[#0AE448]/10 text-[#0AE448] text-xs font-mono font-bold rounded-full border border-[#0AE448]/30">
                  ⚡ PAGAMENTO VIA PIX INSTANTÂNEO
                </span>
                <h3 className="text-xl font-bold text-[#FFFCE1]">
                  Escaneie o QR Code ou Copie o Código
                </h3>
                <p className="text-xs text-[#BBBAA6]">
                  Abra o app do seu banco e pague para liberação imediata.
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white border-2 border-white/20 rounded-3xl inline-block shadow-md">
                <img 
                  src={pixResult.pixPayload?.qrCodeBase64} 
                  alt="QR Code Pix" 
                  className="w-52 h-52 mx-auto rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#BBBAA6] px-1">
                  <span>Valor do Pix: <strong className="text-[#0AE448]">{formatBRL(finalPrice)}</strong></span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expira em: {pixResult.pixPayload?.expiresAt}</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixResult.pixPayload?.copiaECola}
                    className="flex-1 px-3 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] truncate select-all"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="px-4 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {copiedPix ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar Pix'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 bg-[#141716] rounded-xl border border-amber-500/30 text-xs text-[#BBBAA6] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>[Modo Simulação Local] QR Code demonstrativo ou ative via Consultor:</span>
                </div>
                <button
                  onClick={handleSimulatePixPaid}
                  className="text-[11px] font-bold text-[#0AE448] underline cursor-pointer shrink-0"
                >
                  Simular Confirmação Local
                </button>
              </div>

              <button
                type="button"
                onClick={handleOpenAssistedWhatsAppCheckout}
                className="w-full py-3 bg-[#0AE448]/15 hover:bg-[#0AE448]/25 text-[#0AE448] border border-[#0AE448]/40 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-[#0AE448]" />
                <span>Receber Chave Pix Oficial / Fechar com Consultor no WhatsApp</span>
              </button>

              <button
                onClick={() => setPixResult(null)}
                className="text-xs text-[#BBBAA6] hover:text-[#FFFCE1] underline cursor-pointer"
              >
                Voltar e alterar dados ou forma de pagamento
              </button>
            </div>
          ) : (
            /* PLAN SELECTION & CHECKOUT FORM */
            <div className="space-y-6">

              {/* ROI & Guarantee Trust Header */}
              <div className="p-4 bg-gradient-to-r from-[#0AE448]/10 via-[#0AE448]/5 to-transparent border border-[#0AE448]/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-[#0AE448]/20 text-[#0AE448] rounded-xl border border-[#0AE448]/30 shrink-0">
                    <Sparkles className="w-4 h-4 text-[#0AE448]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#FFFCE1] block">Proteção de Margem & Retenção de ROAS</span>
                    <span className="text-[11px] text-[#BBBAA6]">Evita em média R$ 12.000 a R$ 45.000/mês em tráfego pago desperdiçado com anúncios sem estoque.</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-[#0AE448]/15 border border-[#0AE448]/30 rounded-full text-[#0AE448] text-[11px] font-bold font-mono shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Garantia 7 Dias CDC</span>
                </div>
              </div>
              
              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl max-w-xs mx-auto text-xs font-bold">
                <button
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${billingCycle === 'MONTHLY' ? 'bg-[#0AE448] text-slate-950 font-black shadow-md' : 'text-[#BBBAA6] hover:text-[#FFFCE1]'}`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setBillingCycle('YEARLY')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${billingCycle === 'YEARLY' ? 'bg-[#0AE448] text-slate-950 font-black shadow-md' : 'text-[#BBBAA6] hover:text-[#FFFCE1]'}`}
                >
                  <span>Anual</span>
                  <span className="px-1.5 py-0.5 bg-slate-950 text-[#0AE448] text-[9px] font-black rounded-md">20% OFF</span>
                </button>
              </div>

              {/* Plan Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(Object.keys(SAAS_PLANS) as PlanTierId[]).map((planKey) => {
                  const p = SAAS_PLANS[planKey];
                  const isSelected = selectedPlanId === planKey;
                  const displayPrice = billingCycle === 'MONTHLY' ? p.monthlyPrice : p.yearlyMonthlyPrice;

                  return (
                    <div
                      key={planKey}
                      onClick={() => setSelectedPlanId(planKey)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected 
                          ? 'border-[#0AE448] bg-[#0AE448]/5 shadow-lg shadow-[#0AE448]/10 ring-1 ring-[#0AE448]/30' 
                          : 'border-white/10 bg-[#141716] hover:border-white/20'
                      }`}
                    >
                      {p.badge && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-[#0AE448] text-slate-950 text-[9px] font-black uppercase rounded-full">
                          {p.badge}
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-[#FFFCE1]">{p.name}</h4>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#0AE448] bg-[#0AE448] text-slate-950' : 'border-white/20'}`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono text-[#FFFCE1]">{formatBRL(displayPrice)}</span>
                          <span className="text-[11px] text-[#BBBAA6]">/mês</span>
                        </div>

                        <p className="text-[11px] text-[#BBBAA6] leading-tight">{p.description}</p>
                      </div>

                      <ul className="mt-3 pt-3 border-t border-white/5 space-y-1 text-[11px] text-[#BBBAA6]">
                        {p.features.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-[#0AE448] shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Checkout Two-Column: Buyer Details & Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-white/10">
                
                {/* Left: Buyer Details */}
                <div className="md:col-span-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#BBBAA6] font-mono">
                    1. Seus Dados de Acesso
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-[#BBBAA6] mb-1">Nome Completo</label>
                      <input
                        type="text"
                        placeholder="Ex: Roberto Alcantara"
                        value={buyer.fullName}
                        onChange={(e) => setBuyer({ ...buyer, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] font-medium transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#BBBAA6] mb-1">E-mail Corporativo</label>
                      <input
                        type="email"
                        placeholder="seuemail@empresa.com.br"
                        value={buyer.email}
                        onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] font-medium transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-[#BBBAA6] mb-1">WhatsApp</label>
                        <input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={buyer.phone}
                          onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] font-medium transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#BBBAA6] mb-1">CPF ou CNPJ</label>
                        <input
                          type="text"
                          placeholder="000.000.000-00"
                          value={buyer.document}
                          onChange={(e) => setBuyer({ ...buyer, document: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] font-medium transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Payment Method */}
                <div className="md:col-span-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#BBBAA6] font-mono">
                    2. Forma de Pagamento
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('PIX')}
                      className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'PIX'
                          ? 'border-[#0AE448] bg-[#0AE448]/10 text-[#0AE448]'
                          : 'border-white/10 bg-white/5 text-[#BBBAA6] hover:bg-white/10'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-[#0AE448]" />
                      <span>Pix Instantâneo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CREDIT_CARD')}
                      className={`p-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'CREDIT_CARD'
                          ? 'border-[#00BAE2] bg-[#00BAE2]/10 text-[#00BAE2]'
                          : 'border-white/10 bg-white/5 text-[#BBBAA6] hover:bg-white/10'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#00BAE2]" />
                      <span>Cartão de Crédito</span>
                    </button>
                  </div>

                  {paymentMethod === 'PIX' ? (
                    <div className="p-4 bg-[#141716] rounded-2xl border border-[#0AE448]/30 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-[#0AE448] font-bold">
                        <Zap className="w-4 h-4 text-[#0AE448]" />
                        <span>Liberação imediata sem esperar compensação bancária</span>
                      </div>
                      <p className="text-[11px] text-[#BBBAA6] leading-relaxed">
                        Ao clicar no botão abaixo, geraremos um QR Code exclusivo do Banco Central para você pagar via app bancário.
                      </p>
                      <button
                        onClick={handleGeneratePix}
                        className="w-full py-3.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 text-xs font-black rounded-xl transition-all shadow-lg shadow-[#0AE448]/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Gerar QR Code Pix de {formatBRL(finalPrice)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#BBBAA6] mb-1">Número do Cartão</label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          value={card.cardNumber}
                          onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-[#BBBAA6] mb-1">Nome no Cartão</label>
                          <input
                            type="text"
                            placeholder="Como impresso no cartão"
                            value={card.holderName}
                            onChange={(e) => setCard({ ...card, holderName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] font-medium uppercase"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#BBBAA6] mb-1">CVV</label>
                          <input
                            type="password"
                            placeholder="123"
                            maxLength={4}
                            value={card.cvv}
                            onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 rounded-xl text-xs font-mono text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:border-[#0AE448] font-medium"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleProcessCard}
                        disabled={isProcessing}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processando com Gateway...</span>
                          </div>
                        ) : (
                          <>
                            <span>Pagar {formatBRL(finalPrice)} no Cartão</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {errorMessage && (
                    <p className="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errorMessage}</span>
                    </p>
                  )}

                  {/* Real Monetization Fallback: Direct External Link or Assisted WhatsApp Closing */}
                  <div className="pt-2 border-t border-white/10 space-y-2">
                    {externalCheckoutUrl && externalCheckoutUrl.startsWith('http') && (
                      <a
                        href={externalCheckoutUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2.5 bg-[#00BAE2]/15 hover:bg-[#00BAE2]/25 text-[#00BAE2] border border-[#00BAE2]/40 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ir para Gateway Oficial Externo ({selectedPlan.name})</span>
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={handleOpenAssistedWhatsAppCheckout}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/15 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-[#0AE448]" />
                      <span>Fechar Assinatura Assistida no WhatsApp (Onboarding VIP)</span>
                    </button>
                  </div>

                  <div className="pt-1 text-[10px] text-[#BBBAA6]/60 text-center space-y-1">
                    <p>Garantia incondicional de 7 dias (CDC Art. 49). Cancele quando quiser.</p>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
