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
import { getMonitoredStores, deleteMonitoredStore } from '../services/database/swarmDatabaseService';
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

    const newStoreItem: MonitoredStore = {
      id: `store-custom-${Date.now()}`,
      storeUrl: cleanUrl,
      brandName: brandName,
      niche: newNiche,
      targetPhone: newPhone || '5511999999999',
      isActive: true,
      checkIntervalHours: 24,
      currentScore: 80,
      currentEstimatedLoss: 0
    };

    // 1. Immediately update local state & localStorage without waiting
    setStores(prev => {
      const filtered = prev.filter(s => s.storeUrl.toLowerCase().replace(/\/$/, '') !== cleanUrl.toLowerCase().replace(/\/$/, ''));
      const updated = [newStoreItem, ...filtered];
      localStorage.setItem('adshield_local_monitored_stores', JSON.stringify(updated));
      return updated;
    });

    // 2. Persist to Supabase
    if (isSupabaseConfigured) {
      try {
        await supabase.from('swarm_monitored_stores').insert([{
          store_url: cleanUrl,
          brand_name: brandName,
          niche: newNiche,
          target_phone: newPhone || '5511999999999',
          is_active: true,
          check_interval_hours: 24,
          current_score: 80,
          current_estimated_loss: 0
        }]);
      } catch {
        // Handled gracefully
      }
    }

    setFeedbackMsg(`Loja ${brandName} adicionada com sucesso ao radar 24h.`);
    setNewUrl('');
    setNewPhone('');
    setIsAdding(false);

    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleDeleteStore = async (storeId: string, storeUrl: string, brand: string) => {
    setStores(prev => {
      const updated = prev.filter(s => s.id !== storeId && s.storeUrl !== storeUrl);
      localStorage.setItem('adshield_local_monitored_stores', JSON.stringify(updated));
      return updated;
    });

    await deleteMonitoredStore(storeId, storeUrl);
    setFeedbackMsg(`Loja ${brand} removida do radar.`);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#101211] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col font-sans text-[#FFFCE1]">
        
        {/* Header */}
        <div className="p-6 bg-[#0E100F] text-[#FFFCE1] flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/10 border border-[#0AE448]/25 rounded-2xl text-[#0AE448] shadow-md shadow-[#0AE448]/10">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#FFFCE1]">Lojas no Radar do Enxame 24h</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30 rounded-md">
                  Supabase Live
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6]">Gerencie as lojas auditadas diariamente às 07:00 da manhã.</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl text-[#BBBAA6] hover:text-[#FFFCE1] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {feedbackMsg && (
            <div className="p-4 rounded-2xl bg-[#0AE448]/10 border border-[#0AE448]/25 text-[#0AE448] text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0AE448]" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-[#BBBAA6] uppercase tracking-wider font-mono">
              Total de Lojas Monitoradas: <span className="text-[#0AE448]">{stores.length}</span>
            </p>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="px-4 py-2 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 text-xs font-black rounded-xl flex items-center gap-1.5 transition-all shadow-lg shadow-[#0AE448]/20 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Nova Loja</span>
            </button>
          </div>

          {/* Form to Add Store */}
          {isAdding && (
            <form onSubmit={handleAddStore} className="p-5 bg-[#141716] border border-white/10 rounded-2xl space-y-4 animate-slideDown">
              <h3 className="font-bold text-[#FFFCE1] text-sm">Adicionar Loja para Monitoramento Autônomo</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#BBBAA6] mb-1">URL da Loja</label>
                  <input
                    type="url"
                    required
                    placeholder="https://sualoja.com.br"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:ring-1 focus:ring-[#0AE448] focus:border-[#0AE448] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#BBBAA6] mb-1">WhatsApp para Alertas (07:00)</label>
                  <input
                    type="tel"
                    placeholder="5511999999999"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#0E100F] border border-white/10 rounded-xl text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:ring-1 focus:ring-[#0AE448] focus:border-[#0AE448] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 text-xs text-[#BBBAA6] hover:bg-white/5 rounded-xl font-bold transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md shadow-[#0AE448]/20 cursor-pointer"
                >
                  Salvar no Radar
                </button>
              </div>
            </form>
          )}

          {/* Stores List */}
          {isLoading ? (
            <div className="py-12 text-center text-[#BBBAA6] space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#0AE448]" />
              <p className="text-xs">Buscando lojas no PostgreSQL...</p>
            </div>
          ) : stores.length === 0 ? (
            <div className="py-12 text-center text-[#BBBAA6] space-y-2 border border-dashed border-white/10 rounded-2xl">
              <Store className="w-8 h-8 mx-auto text-[#BBBAA6]/40" />
              <p className="text-xs">Nenhuma loja cadastrada ainda no radar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stores.map((store) => (
                <div 
                  key={store.id} 
                  className="p-4 rounded-2xl bg-[#141716] border border-white/10 hover:border-[#0AE448]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#FFFCE1]">{store.brandName}</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/25">
                        {store.niche}
                      </span>
                    </div>
                    <p className="text-xs text-[#BBBAA6] font-mono flex items-center gap-1.5">
                      <ExternalLink className="w-3 h-3 text-[#BBBAA6]/60" />
                      <span>{store.storeUrl}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right sm:pr-2">
                      <span className="text-[10px] text-[#BBBAA6] font-mono block">Score Atual</span>
                      <span className="font-mono font-black text-[#0AE448] text-sm">{store.currentScore}/100</span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectStoreToAudit(store.storeUrl);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#0AE448]/10 hover:bg-[#0AE448]/20 text-[#0AE448] rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border border-[#0AE448]/30"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Auditar Agora</span>
                    </button>

                    <button
                      onClick={() => handleDeleteStore(store.id, store.storeUrl, store.brandName)}
                      className="p-1.5 text-[#BBBAA6] hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all cursor-pointer"
                      title="Remover do radar"
                    >
                      <Trash2 className="w-4 h-4" />
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
