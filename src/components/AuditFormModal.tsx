import React, { useState } from 'react';
import { X, Globe, ShoppingBag, DollarSign, AlertCircle, ArrowRight, Layers } from 'lucide-react';
import { AuditInput, BusinessType, MainChallenge, TargetRegion } from '../types';

interface AuditFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AuditInput) => void;
  initialData?: AuditInput;
}

export const AuditFormModal: React.FC<AuditFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [siteUrl, setSiteUrl] = useState(initialData?.siteUrl || '');
  const [businessName, setBusinessName] = useState(initialData?.businessName || '');
  const [businessType, setBusinessType] = useState<BusinessType>(initialData?.businessType || 'ecommerce');
  const [niche, setNiche] = useState(initialData?.niche || '');
  const targetAudience = initialData?.targetAudience || 'Consumidores de 25 a 45 anos em busca de qualidade e agilidade';
  const [competitorsUrl, setCompetitorsUrl] = useState(initialData?.competitorsUrl || 'https://concorrente.com.br');
  const [instagramHandle, setInstagramHandle] = useState(initialData?.instagramHandle || '');
  const [targetRegion, setTargetRegion] = useState<TargetRegion>(initialData?.targetRegion || 'Brasil');
  const [manualCnpj, setManualCnpj] = useState(initialData?.manualCnpj || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteUrl) return;

    // Valores padrão injetados silenciosamente para a IA (Fricção Zero)
    onSubmit({
      siteUrl: siteUrl.trim(),
      businessName: businessName.trim() || siteUrl.replace(/^https?:\/\//, '').split('.')[0].toUpperCase(),
      businessType,
      niche,
      monthlyRevenue: 'R$ 50k a R$ 200k', // Default placeholder
      averageOrderValue: 150, // Default placeholder
      mainChallenge: 'low_conversion', // Default placeholder
      targetAudience,
      competitorsUrl: competitorsUrl.trim(),
      instagramHandle: instagramHandle.trim(),
      targetRegion,
      grossMargin: 45, // Default placeholder
      manualCnpj: manualCnpj.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl bg-[#101211] border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-8 text-[#FFFCE1]">
        
        {/* Modal Header */}
        <div className="relative p-6 bg-[#0E100F] border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-[#BBBAA6] hover:text-[#FFFCE1] bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0AE448]/10 border border-[#0AE448]/30 rounded-2xl text-[#0AE448] shadow-md shadow-[#0AE448]/10">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-[#FFFCE1] font-mono">AdShield</span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#0AE448]/15 text-[#0AE448] rounded-md border border-[#0AE448]/30">
                  AUTONOMOUS AUDIT
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6] mt-0.5">
                Configure os parâmetros da loja para que o Enxame de Agentes AdShield execute a auditoria completa de catálogo, receita e tráfego.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Step 1: URL & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#BBBAA6] mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#0AE448]" />
                URL do Site / Loja <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://suamarca.com.br"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 focus:border-[#0AE448] rounded-xl text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#BBBAA6] mb-1.5 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#00BAE2]" />
                Nome da Marca
              </label>
              <input
                type="text"
                placeholder="Ex: Minimal Club"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 focus:border-[#0AE448] rounded-xl text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 outline-none transition-all"
              />
            </div>
          </div>

          {/* Step 2: Business Type & Niche */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#BBBAA6] mb-1.5">
                Modelo de Negócio
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 focus:border-[#0AE448] rounded-xl text-xs text-[#FFFCE1] outline-none transition-all"
              >
                <option value="ecommerce">E-commerce / D2C (Produtos Físicos)</option>
                <option value="saas">SaaS / Software Online</option>
                <option value="infoproduct">Infoproduto / Cursos / Mentoria</option>
                <option value="leadgen">Prestador de Serviços / B2B</option>
                <option value="landing_page">Landing Page de Produto Único</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#BBBAA6] mb-1.5">
                Nicho / Segmento
              </label>
              <input
                type="text"
                placeholder="Auto-detectado pela IA (ex: Calçados, Suplementos, Moda)"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 focus:border-[#0AE448] rounded-xl text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 outline-none transition-all mb-4"
              />

              <label className="block text-xs font-bold text-[#BBBAA6] mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#00BAE2]" />
                Mercado Alvo (CV Engine Profile)
              </label>
              <select
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value as TargetRegion)}
                className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 focus:border-[#0AE448] rounded-xl text-xs text-[#0AE448] outline-none transition-all font-bold"
              >
                <option value="Brasil">Brasil (WhatsApp + Pix Focus)</option>
                <option value="Ásia">Ásia (High Clutter + Social Proof)</option>
                <option value="Europa">Europa (GDPR Strict + Minimalismo)</option>
                <option value="EUA">Estados Unidos (Fast Checkout)</option>
                <option value="Global">Global (Padrão Internacional)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#BBBAA6] mb-1.5">
                URL do Concorrente
              </label>
              <input
                type="text"
                required
                placeholder="https://concorrente.com.br"
                value={competitorsUrl}
                onChange={(e) => setCompetitorsUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 focus:border-[#0AE448] rounded-xl text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#BBBAA6] mb-1.5">
                @ Instagram (Opcional)
              </label>
              <input
                type="text"
                placeholder="@loja"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 focus:border-[#0AE448] rounded-xl text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#BBBAA6] mb-1.5 flex justify-between">
                <span>CNPJ (Opcional)</span>
                <span className="text-[10px] text-[#0AE448]">Grounding</span>
              </label>
              <input
                type="text"
                placeholder="00.000.000/0001-00"
                value={manualCnpj}
                onChange={(e) => setManualCnpj(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0E100F] border border-white/10 focus:border-[#0AE448] rounded-xl text-xs text-[#FFFCE1] placeholder-[#BBBAA6]/40 outline-none transition-all font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 font-black text-xs uppercase tracking-wider text-slate-950 bg-[#0AE448] hover:bg-[#0AE448]/90 rounded-xl shadow-lg shadow-[#0AE448]/20 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Executar Auditoria AdShield de 18 Agentes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
