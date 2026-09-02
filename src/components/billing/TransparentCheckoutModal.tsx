import React, { useState } from 'react';
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
  Rocket
} from 'lucide-react';
import { 
  SAAS_PLANS, 
  PlanTierId, 
  BillingCycle, 
  PaymentMethod, 
  BuyerFormData, 
  CreditCardFormData, 
  PaymentTransactionResult,
  generatePixPayment,
  processCreditCardPayment,
  saveActiveLicense
} from '../../services/billing/checkoutService';
import { formatBRL } from '../../services/ai/storeFinancialGroundingEngine';

interface TransparentCheckoutModalProps {
  onClose: () => void;
  initialPlan?: PlanTierId;
}

export const TransparentCheckoutModal: React.FC<TransparentCheckoutModalProps> = ({
  onClose,
  initialPlan = 'GROWTH_PRO'
}) => {
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

  const handleGeneratePix = (e: React.FormEvent) => {
    e.preventDefault();
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
    if (!buyer.fullName || !buyer.email || !buyer.document) {
      setErrorMessage('Por favor, preencha seus dados de contato.');
      return;
    }
    if (!card.cardNumber || !card.holderName || !card.cvv) {
      setErrorMessage('Por favor, preencha os dados do cartão de crédito.');
      return;
    }
    setErrorMessage('');
    setIsProcessing(true);

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
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[70] flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 relative flex flex-col max-h-[92vh] border border-slate-200 animate-fadeIn">
        
        {/* Top Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">AdShield • Checkout 100% Seguro</h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Criptografia SSL de 256 bits • Ativação Imediata</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">

          {isSuccess ? (
            /* SUCCESS STATE */
            <div className="text-center py-12 space-y-6 max-w-md mx-auto">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-mono font-bold rounded-full border border-emerald-200">
                  PAGAMENTO APROVADO & LICENÇA ATIVADA
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Bem-vindo ao AdShield {selectedPlan.name}!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sua conta foi ativada com sucesso. O recibo oficial e o token de acesso foram enviados para <strong>{buyer.email || 'seu e-mail'}</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs font-mono space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plano Ativado:</span>
                  <strong>{selectedPlan.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ciclo:</span>
                  <strong>{billingCycle === 'MONTHLY' ? 'Mensal' : 'Anual (20% OFF)'}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Valor Pago:</span>
                  <strong className="text-emerald-600">{formatBRL(finalPrice)}</strong>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Acessar Painel de Monitoramento 24h</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : pixResult ? (
            /* PIX SCREEN */
            <div className="text-center py-4 space-y-6 max-w-lg mx-auto">
              <div className="space-y-1">
                <span className="px-3 py-1 bg-teal-50 text-teal-700 text-xs font-mono font-bold rounded-full border border-teal-200">
                  ⚡ PAGAMENTO VIA PIX INSTANTÂNEO
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  Escaneie o QR Code ou Copie o Código
                </h3>
                <p className="text-xs text-slate-500">
                  Abra o app do seu banco e pague para liberação imediata.
                </p>
              </div>

              {/* QR Code Container */}
              <div className="p-4 bg-white border-2 border-slate-200 rounded-3xl inline-block shadow-md">
                <img 
                  src={pixResult.pixPayload?.qrCodeBase64} 
                  alt="QR Code Pix" 
                  className="w-52 h-52 mx-auto rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 px-1">
                  <span>Valor do Pix: <strong className="text-slate-900">{formatBRL(finalPrice)}</strong></span>
                  <span className="flex items-center gap-1 text-amber-600">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Expira em: {pixResult.pixPayload?.expiresAt}</span>
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixResult.pixPayload?.copiaECola}
                    className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 truncate select-all"
                  />
                  <button
                    onClick={handleCopyPix}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {copiedPix ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar Pix'}</span>
                  </button>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Aguardando identificação do pagamento...</span>
                </div>
                <button
                  onClick={handleSimulatePixPaid}
                  className="text-[11px] font-bold text-emerald-700 underline cursor-pointer"
                >
                  Simular Confirmação
                </button>
              </div>

              <button
                onClick={() => setPixResult(null)}
                className="text-xs text-slate-500 hover:text-slate-700 underline"
              >
                Voltar e alterar dados ou forma de pagamento
              </button>
            </div>
          ) : (
            /* PLAN SELECTION & CHECKOUT FORM */
            <div className="space-y-6">
              
              {/* Billing Cycle Toggle */}
              <div className="flex items-center justify-center gap-3 p-1.5 bg-slate-100 rounded-2xl max-w-xs mx-auto text-xs font-bold">
                <button
                  onClick={() => setBillingCycle('MONTHLY')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${billingCycle === 'MONTHLY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setBillingCycle('YEARLY')}
                  className={`flex-1 py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${billingCycle === 'YEARLY' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <span>Anual</span>
                  <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[9px] font-black rounded-md">20% OFF</span>
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
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                        isSelected 
                          ? 'border-indigo-600 bg-indigo-50/20 shadow-md ring-2 ring-indigo-600/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {p.badge && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-full">
                          {p.badge}
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-slate-900">{p.name}</h4>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'}`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </div>
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black font-mono text-slate-900">{formatBRL(displayPrice)}</span>
                          <span className="text-[11px] text-slate-500">/mês</span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-tight">{p.description}</p>
                      </div>

                      <ul className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                        {p.features.slice(0, 3).map((feat, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Checkout Two-Column: Buyer Details & Payment Method */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4 border-t border-slate-200">
                
                {/* Left: Buyer Details */}
                <div className="md:col-span-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    1. Seus Dados de Acesso
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                      <input
                        type="text"
                        placeholder="Ex: Roberto Alcantara"
                        value={buyer.fullName}
                        onChange={(e) => setBuyer({ ...buyer, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Corporativo</label>
                      <input
                        type="email"
                        placeholder="seuemail@empresa.com.br"
                        value={buyer.email}
                        onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                        <input
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={buyer.phone}
                          onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600 font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">CPF ou CNPJ</label>
                        <input
                          type="text"
                          placeholder="000.000.000-00"
                          value={buyer.document}
                          onChange={(e) => setBuyer({ ...buyer, document: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600 font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Payment Method */}
                <div className="md:col-span-6 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                    2. Forma de Pagamento
                  </h4>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('PIX')}
                      className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'PIX'
                          ? 'border-emerald-500 bg-emerald-50/30 text-emerald-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>Pix Instantâneo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('CREDIT_CARD')}
                      className={`p-3 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        paymentMethod === 'CREDIT_CARD'
                          ? 'border-indigo-500 bg-indigo-50/30 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-indigo-600" />
                      <span>Cartão de Crédito</span>
                    </button>
                  </div>

                  {paymentMethod === 'PIX' ? (
                    <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold">
                        <Zap className="w-4 h-4 text-emerald-600" />
                        <span>Liberação imediata sem esperar compensação bancária</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Ao clicar no botão abaixo, geraremos um QR Code exclusivo do Banco Central para você pagar via app bancário.
                      </p>
                      <button
                        onClick={handleGeneratePix}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Gerar QR Code Pix de {formatBRL(finalPrice)}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Número do Cartão</label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          maxLength={19}
                          value={card.cardNumber}
                          onChange={(e) => setCard({ ...card, cardNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-indigo-600 font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Nome no Cartão</label>
                          <input
                            type="text"
                            placeholder="Como impresso no cartão"
                            value={card.holderName}
                            onChange={(e) => setCard({ ...card, holderName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600 font-medium uppercase"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">CVV</label>
                          <input
                            type="password"
                            placeholder="123"
                            maxLength={4}
                            value={card.cvv}
                            onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-indigo-600 font-medium"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleProcessCard}
                        disabled={isProcessing}
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer"
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
                    <p className="text-xs text-rose-600 font-bold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errorMessage}</span>
                    </p>
                  )}

                  <div className="pt-2 text-[10px] text-slate-400 text-center space-y-1">
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
