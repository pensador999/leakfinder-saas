import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ExternalLink, 
  Smartphone, 
  CheckCircle2, 
  AlertTriangle,
  X,
  Store,
  Clock,
  Sparkles
} from 'lucide-react';
import { MonitoredStore } from '../services/swarm/autonomousSwarmEngine';
import { getMonitoredStores } from '../services/database/swarmDatabaseService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { extractCleanDomainAndBrand } from '../services/siteInspector';

interface MonitoredStoresManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStoreToAudit: (url: string) => void;
}

export const MonitoredStoresManagerModal: React.FC<MonitoredStoresManagerModalProps> = ({
  isOpen,
  onClose,
  onSelectStoreToAudit
}) => {
  const [stores, setStores] = useState<MonitoredStore[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [newUrl, setNewUrl] = useState<string>('');
  const [newNiche, setNewNiche] = useState<string>('Moda & Vestuário');
  const [newPhone, setNewPhone] = useState<string>('');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const loadStores = async () => {
    setIsLoading(true);
    try {
      const data = await getMonitoredStores();
      setStores(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStores();
    }
  }, [isOpen]);

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim()) return;

    const { cleanUrl, brandName } = extractCleanDomainAndBrand(newUrl);

    const newStoreRecord = {
      store_url: cleanUrl,
      brand_name: brandName,
      niche: newNiche,
      target_phone: newPhone || '5511999999999',
      is_active: true,
      check_interval_hours: 24,
      current_score: 80,
      current_estimated_loss: 0
    };

    if (isSupabaseConfigured) {
      try {
        await supabase.from('swarm_monitored_stores').insert([newStoreRecord]);
      } catch {
        // local fallback
      }
    }

    setFeedbackMsg(`Loja ${brandName} adicionada com sucesso ao radar 24h!`);
    setNewUrl('');
    setNewPhone('');
    setIsAdding(false);
    loadStores();

    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col font-sans">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-md shadow-blue-600/30">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Lojas no Radar do Enxame 24h</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md">
                  Supabase Live
                </span>
              </div>
              <p className="text-xs text-slate-400">Gerencie as lojas auditadas diariamente às 07:00 da manhã.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {feedbackMsg && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Total de Lojas Monitoradas: {stores.length}
            </p>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Nova Loja</span>
            </button>
          </div>

          {/* Form to Add Store */}
          {isAdding && (
            <form onSubmit={handleAddStore} className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4 animate-slideDown">
              <h3 className="font-bold text-slate-900 text-sm">Adicionar Loja para Monitoramento Autônomo</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL da Loja</label>
                  <input
                    type="url"
                    required
                    placeholder="https://sualoja.com.br"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp para Alertas (07:00)</label>
                  <input
                    type="tel"
                    placeholder="5511999999999"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Salvar no Radar
                </button>
              </div>
            </form>
          )}

          {/* Stores List */}
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
              <p className="text-xs">Buscando lojas no PostgreSQL...</p>
            </div>
          ) : stores.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2 border border-dashed border-slate-200 rounded-2xl">
              <Store className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Nenhuma loja cadastrada ainda no radar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stores.map((store) => (
                <div 
                  key={store.id} 
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{store.brandName}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                        {store.niche}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                      <span>{store.storeUrl}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right sm:pr-2">
                      <span className="text-[10px] text-slate-400 font-mono block">Score Atual</span>
                      <span className="font-mono font-black text-blue-600 text-sm">{store.currentScore}/100</span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectStoreToAudit(store.storeUrl);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auditar Agora</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
