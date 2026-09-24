import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Store, 
  Smartphone, 
  Zap, 
  TrendingUp, 
  ExternalLink, 
  RefreshCw, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Download, 
  Sparkles, 
  Layers, 
  Sliders, 
  FileText,
  Target,
  Crown,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { PlanDetails, PaymentTransactionResult, SAAS_PLANS, getActiveLicense } from '../../services/billing/checkoutService';
import { MonitoredStore } from '../../services/swarm/autonomousSwarmEngine';
import { getMonitoredStores, deleteMonitoredStore } from '../../services/database/swarmDatabaseService';
import { formatBRL } from '../../services/ai/storeFinancialGroundingEngine';

interface SubscriberPortalHubProps {
  onOpenStoreAudit: (url: string) => void;
  onOpenNewStoreModal: () => void;
  onOpenWhatsAppWatchdog: () => void;
  onOpenKillSwitch: () => void;
  onOpenAgencyHub?: () => void;
  onOpenOnboarding: () => void;
}

export const SubscriberPortalHub: React.FC<SubscriberPortalHubProps> = ({
  onOpenStoreAudit,
  onOpenNewStoreModal,
  onOpenWhatsAppWatchdog,
  onOpenKillSwitch,
  onOpenAgencyHub,
  onOpenOnboarding
}) => {
  const [license, setLicense] = useState<PaymentTransactionResult | null>(null);
  const [stores, setStores] = useState<MonitoredStore[]>([]);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [watchdogPhone, setWatchdogPhone] = useState<string>('');
  const [watchdogHour, setWatchdogHour] = useState<string>('07:00');
  const [killSwitchActive, setKillSwitchActive] = useState<boolean>(true);

  // Load license and saved settings
  useEffect(() => {
    const active = getActiveLicense();
    setLicense(active);

    const savedPhone = localStorage.getItem('adshield_watchdog_phone') || '';
    const savedHour = localStorage.getItem('adshield_watchdog_hour') || '07:00';
    const savedKs = localStorage.getItem('adshield_killswitch_active') !== 'false';

    setWatchdogPhone(savedPhone);
    setWatchdogHour(savedHour);
    setKillSwitchActive(savedKs);

    loadStores();
  }, []);

  const loadStores = async () => {
    setIsLoadingStores(true);
    try {
      const data = await getMonitoredStores();
      setStores(data);
    } finally {
      setIsLoadingStores(false);
    }
  };

  const currentPlan: PlanDetails = license?.planId 
    ? SAAS_PLANS[license.planId] 
    : SAAS_PLANS.GROWTH_PRO; // Fallback to Growth Pro if previewing

  const maxStores = currentPlan.id === 'AGENCY_ENTERPRISE' ? 15 : currentPlan.id === 'GROWTH_PRO' ? 3 : 1;
  const isAgency = currentPlan.id === 'AGENCY_ENTERPRISE';

  // Calculate total bleed protected
  const totalBleedProtected = stores.reduce((acc, s) => acc + (s.currentEstimatedLoss || 12400), 0);

  const handleDelete = async (storeId: string, storeUrl: string) => {
    if (confirm(`Deseja remover ${storeUrl} do monitoramento contínuo?`)) {
      await deleteMonitoredStore(storeId, storeUrl);
      setStores(prev => prev.filter(s => s.id !== storeId && s.storeUrl !== storeUrl));
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-[#FFFCE1]">
      
      {/* 1. Subscription Governance Header */}
      <div className="p-6 sm:p-8 bg-[#141716] rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0AE448]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 bg-[#0AE448]/10 text-[#0AE448] text-xs font-mono font-bold rounded-full border border-[#0AE448]/30 flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-[#0AE448]" />
                <span>PLANO ATIVO: {currentPlan.name}</span>
              </span>

              <span className="px-3 py-1 bg-white/5 text-[#BBBAA6] text-xs font-mono rounded-full border border-white/10">
                {license?.cycle === 'YEARLY' ? 'Faturamento Anual (20% OFF)' : 'Faturamento Mensal'}
              </span>

              <span className="px-3 py-1 bg-[#00BAE2]/10 text-[#00BAE2] text-xs font-mono font-bold rounded-full border border-[#00BAE2]/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Garantia 7 Dias CDC Ativa</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-[#FFFCE1]">
              Torre de Proteção & Monitoramento Contínuo
            </h2>
            <p className="text-xs sm:text-sm text-[#BBBAA6] max-w-2xl leading-relaxed">
              Sua operação está blindada pelo enxame autônomo de 18 agentes. Varreduras ativas inspecionam rupturas de estoque no Meta Ads e gargalos de conversão 24 horas por dia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenOnboarding}
              className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-xs text-[#FFFCE1] font-bold rounded-xl border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#0AE448]" />
              <span>Reconfigurar Wizard</span>
            </button>

            <button
              onClick={onOpenNewStoreModal}
              disabled={stores.length >= maxStores}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                stores.length >= maxStores
                  ? 'bg-white/5 text-[#7C7C6F] border border-white/5 cursor-not-allowed'
                  : 'bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black shadow-lg shadow-[#0AE448]/20'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Monitorar Nova Loja</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Four Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Monitored Stores Quota */}
        <div className="p-5 bg-[#141716] rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#BBBAA6]">
            <span>Lojas sob Proteção</span>
            <Store className="w-4 h-4 text-[#0AE448]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#FFFCE1] font-mono">
              {stores.length}
            </span>
            <span className="text-xs text-[#7C7C6F] font-mono">
              / {maxStores} cota do plano
            </span>
          </div>
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-[#0AE448] h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, (stores.length / maxStores) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-[#A0A090] block">
            {stores.length >= maxStores ? 'Capacidade máxima atingida' : `${maxStores - stores.length} vaga(s) restante(s)`}
          </span>
        </div>

        {/* Card 2: Bleed Prevented in Ads */}
        <div className="p-5 bg-[#141716] rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#BBBAA6]">
            <span>Verba de Ads Protegida</span>
            <TrendingUp className="w-4 h-4 text-[#00BAE2]" />
          </div>
          <div className="text-2xl font-black text-[#0AE448] font-mono">
            {formatBRL(totalBleedProtected)}
          </div>
          <p className="text-[11px] text-[#BBBAA6] leading-tight">
            Economia estimada em tráfego que seria desperdiçado em produtos esgotados.
          </p>
        </div>

        {/* Card 3: WhatsApp Watchdog Status */}
        <div className="p-5 bg-[#141716] rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#BBBAA6]">
            <span>Vigia WhatsApp 24/7</span>
            <Smartphone className="w-4 h-4 text-[#0AE448]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#0AE448] rounded-full animate-ping" />
            <span className="text-sm font-bold text-[#FFFCE1] font-mono">
              Ativo ({watchdogHour})
            </span>
          </div>
          <p className="text-[11px] text-[#BBBAA6] truncate font-mono">
            {watchdogPhone ? `Para: ${watchdogPhone}` : 'Telefone não cadastrado'}
          </p>
          <button
            onClick={onOpenWhatsAppWatchdog}
            className="text-[10px] text-[#0AE448] hover:underline font-bold cursor-pointer"
          >
            Ajustar Alertas Matinais &rarr;
          </button>
        </div>

        {/* Card 4: Meta Ads Auto-Kill Switch */}
        <div className="p-5 bg-[#141716] rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#BBBAA6]">
            <span>Auto-Kill Switch</span>
            <Zap className="w-4 h-4 text-[#FF4757]" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${killSwitchActive ? 'bg-[#0AE448]' : 'bg-[#FF4757]'}`} />
            <span className="text-sm font-bold text-[#FFFCE1] font-mono">
              {killSwitchActive ? 'Armado via Meta API' : 'Pausado'}
            </span>
          </div>
          <p className="text-[11px] text-[#BBBAA6] leading-tight">
            Pausa automática de conjuntos de anúncios ao detectar ruptura física.
          </p>
          <button
            onClick={onOpenKillSwitch}
            className="text-[10px] text-[#00BAE2] hover:underline font-bold cursor-pointer"
          >
            Ver Logs de Interrupção &rarr;
          </button>
        </div>

      </div>

      {/* 3. Monitored Stores Table */}
      <div className="p-6 bg-[#141716] rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-bold text-base text-[#FFFCE1] flex items-center gap-2">
              <Store className="w-4 h-4 text-[#0AE448]" />
              <span>Lojas Virtuais em Monitoramento Contínuo ({stores.length})</span>
            </h3>
            <p className="text-xs text-[#BBBAA6]">
              O enxame executa varreduras automatizadas verificando estoque de grade e sinais vitais.
            </p>
          </div>

          <button
            onClick={loadStores}
            className="p-2 bg-white/5 hover:bg-white/10 text-[#BBBAA6] hover:text-[#FFFCE1] rounded-xl transition-all cursor-pointer"
            title="Recarregar Lojas"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingStores ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {stores.length === 0 ? (
          <div className="text-center py-12 space-y-3 bg-[#0E100F] rounded-2xl border border-white/5">
            <Store className="w-10 h-10 text-[#7C7C6F] mx-auto" />
            <h4 className="text-sm font-bold text-[#FFFCE1]">Nenhuma loja monitorada ainda</h4>
            <p className="text-xs text-[#BBBAA6] max-w-sm mx-auto">
              Adicione a URL do seu e-commerce para ativar a proteção contra queima de tráfego pago.
            </p>
            <button
              onClick={onOpenNewStoreModal}
              className="px-4 py-2 bg-[#0AE448] text-slate-950 font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-[#0AE448]/20"
            >
              + Adicionar Minha Primeira Loja
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-[#7C7C6F] uppercase text-[10px]">
                  <th className="py-3 px-4 font-bold">E-Commerce</th>
                  <th className="py-3 px-4 font-bold">Nicho</th>
                  <th className="py-3 px-4 font-bold">Score de Conversão</th>
                  <th className="py-3 px-4 font-bold">Risco Mensal Evitado</th>
                  <th className="py-3 px-4 font-bold text-right">Ações Rápidas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stores.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#FFFCE1]">{s.brandName}</div>
                      <a 
                        href={s.storeUrl.startsWith('http') ? s.storeUrl : `https://${s.storeUrl}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[11px] text-[#00BAE2] hover:underline flex items-center gap-1"
                      >
                        <span>{s.storeUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>

                    <td className="py-3.5 px-4 text-[#BBBAA6]">
                      {s.niche || 'Geral'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        (s.currentScore || 80) >= 80 
                          ? 'bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30'
                          : 'bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/30'
                      }`}>
                        {s.currentScore || 80} / 100
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#FF4757]">
                      {formatBRL(s.currentEstimatedLoss || 12400)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenStoreAudit(s.storeUrl)}
                          className="px-3 py-1.5 bg-[#0AE448]/10 hover:bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                          title="Abrir Dossiê Executivo da Loja"
                        >
                          <span>Ver Dossiê</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(s.id, s.storeUrl)}
                          className="p-1.5 text-[#7C7C6F] hover:text-[#FF4757] rounded-lg transition-colors cursor-pointer"
                          title="Remover do monitoramento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Plan-Exclusive Power Tools Drawer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tool 1: Agency Lead Sniper (for Agency Plan or Teaser for Pro) */}
        <div className="p-6 bg-[#141716] rounded-3xl border border-white/10 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-[#00BAE2]/15 text-[#00BAE2] text-[10px] font-mono font-bold rounded-full border border-[#00BAE2]/30">
              {isAgency ? 'EXCLUSIVO AGÊNCIAS' : 'RECURSO AGENCY SCALE'}
            </span>
            <Target className="w-5 h-5 text-[#00BAE2]" />
          </div>

          <h4 className="text-base font-bold text-[#FFFCE1]">
            Lead Sniper B2B • Prospecção no Meta Ads
          </h4>
          <p className="text-xs text-[#BBBAA6] leading-relaxed">
            Minere até 300 lojas virtuais por mês que estão rodando campanhas ativas para produtos com grade esgotada e gere o Pitch da Prova do Crime em 1-clique.
          </p>

          <button
            onClick={onOpenAgencyHub}
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-xs text-[#00BAE2] font-bold rounded-xl border border-[#00BAE2]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isAgency ? 'Abrir Central de Prospecção Lead Sniper' : 'Ver Demonstração de Prospecção'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Tool 2: Liquid Theme Snippets Generator */}
        <div className="p-6 bg-[#141716] rounded-3xl border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-1 bg-[#0AE448]/15 text-[#0AE448] text-[10px] font-mono font-bold rounded-full border border-[#0AE448]/30">
              INSTALAÇÃO SEM CÓDIGO
            </span>
            <FileText className="w-5 h-5 text-[#0AE448]" />
          </div>

          <h4 className="text-base font-bold text-[#FFFCE1]">
            Scripts Liquid & CSS Anti-Fuga (Shopify)
          </h4>
          <p className="text-xs text-[#BBBAA6] leading-relaxed">
            Copie blocos de código prontos para colar nas configurações da Shopify: Botão Fixo de Compra (Thumb Zone), Tabela de Medidas e Aviso de Desconto Pix.
          </p>

          <button
            onClick={() => onOpenStoreAudit(stores[0]?.storeUrl || 'https://www.brkagro.com.br')}
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-xs text-[#0AE448] font-bold rounded-xl border border-[#0AE448]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Acessar Gerador de Scripts & CSS</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
