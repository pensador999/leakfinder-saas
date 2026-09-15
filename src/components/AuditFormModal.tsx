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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-950/60 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="relative p-6 bg-gradient-to-r from-slate-950 via-indigo-950/60 to-purple-950/50 border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
              <Layers className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white font-mono">LeakFinder</span>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                  AUTONOMOUS AUDIT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure os parâmetros da sua empresa para que os 6 agentes LeakFinder executem a auditoria completa de receita.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Step 1: URL & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                URL do Seu Site / Loja <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://suamarca.com.br"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                Nome da Marca
              </label>
              <input
                type="text"
                placeholder="Ex: Aurora Store"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Step 2: Business Type & Niche */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Modelo de Negócio
              </label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none transition-all"
              >
                <option value="ecommerce">E-commerce / D2C (Produtos Físicos)</option>
                <option value="saas">SaaS / Software Online</option>
                <option value="infoproduct">Infoproduto / Cursos / Mentoria</option>
                <option value="leadgen">Prestador de Serviços / B2B</option>
                <option value="landing_page">Landing Page de Produto Único</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nicho / Segmento
              </label>
              <input
                type="text"
                placeholder="Auto-detectado pela IA (ex: Calçados, Suplementos, Moda)"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all mb-4"
              />

              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                Mercado Alvo (CV Engine Profile)
              </label>
              <select
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value as TargetRegion)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white outline-none transition-all font-bold text-blue-400"
              >
                <option value="Brasil">Brasil (WhatsApp + Pix Focus)</option>
                <option value="Ásia">Ásia (High Clutter + Social Proof)</option>
                <option value="Europa">Europa (GDPR Strict + Minimalismo)</option>
                <option value="EUA">Estados Unidos (Fast Checkout)</option>
                <option value="Global">Global (Padrão Internacional)</option>
              </select>
            </div>
          </div>

          {/* Removed Step 3 (Metrics) & Main Challenge to reduce friction */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                URL do Principal Concorrente <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://concorrente.com.br"
                value={competitorsUrl}
                onChange={(e) => setCompetitorsUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all font-mono mb-4"
              />
              
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                @ Instagram (Opcional)
              </label>
              <input
                type="text"
                placeholder="@loja"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all font-mono mb-4"
              />
              
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex justify-between">
                <span>CNPJ da Loja (Opcional)</span>
                <span className="text-[10px] text-indigo-400">Ajuda a IA</span>
              </label>
              <input
                type="text"
                placeholder="12.345.678/0001-99"
                value={manualCnpj}
                onChange={(e) => setManualCnpj(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all font-mono"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-6 font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Executar Auditoria LeakFinder de 6 Agentes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
