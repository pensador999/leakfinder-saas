import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Phone, 
  Target, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  Flame, 
  Building2, 
  MessageSquare, 
  Plus, 
  Save, 
  Check, 
  RefreshCw,
  Sliders,
  ShieldCheck,
  BrainCircuit,
  Trash2,
  Code2,
  Activity,
  Cpu,
  Zap,
  Clock,
  Download,
  ShieldAlert,
  Radio,
  FileSpreadsheet,
  AlertTriangle,
  Factory,
  ShoppingBag,
  ArrowUpRight,
  Shield,
  CheckCircle
} from 'lucide-react';
import { 
  ProspectStoreLead, 
  BusinessMetricsSummary, 
  FounderDirectivesState, 
  INITIAL_FOUNDER_DIRECTIVES, 
  SAMPLE_PROSPECT_LEADS, 
  fetchLiveBusinessMetrics,
  KillSwitchEventLog,
  StoreBleedMetric,
  TopRecurrentSkuItem,
  WhatsAppQueueItem,
  BleedHistoricalTrend,
  fetchKillSwitchLogs,
  fetchStoreBleedMetrics,
  fetchTopRecurrentSkus,
  fetchWhatsAppAlertQueue,
  fetchBleedHistoricalTrends,
  generateMasterHqCsvExport
} from '../../services/founder/founderHqService';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AgentSelfEvolutionView } from './AgentSelfEvolutionView';
import { DevOpsSelfHealingControlCenterView } from './DevOpsSelfHealingControlCenterView';
import { InfrastructureFourPillarsMonitor } from './InfrastructureFourPillarsMonitor';
import { BatchLeadExportModal } from '../export/BatchLeadExportModal';

export const FounderMasterHqView: React.FC = () => {
  const [metrics, setMetrics] = useState<BusinessMetricsSummary | null>(null);
  const [leads, setLeads] = useState<ProspectStoreLead[]>(() => {
    const saved = localStorage.getItem('adshield_custom_prospect_leads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SAMPLE_PROSPECT_LEADS;
      }
    }
    return SAMPLE_PROSPECT_LEADS;
  });
  const [conciergeLeads, setConciergeLeads] = useState<any[]>([]);
  const [killSwitchLogs, setKillSwitchLogs] = useState<KillSwitchEventLog[]>([]);
  const [storeBleedMetrics, setStoreBleedMetrics] = useState<StoreBleedMetric[]>([]);
  const [topRecurrentSkus, setTopRecurrentSkus] = useState<TopRecurrentSkuItem[]>([]);
  const [whatsappQueue, setWhatsappQueue] = useState<WhatsAppQueueItem[]>([]);
  const [historicalTrends, setHistoricalTrends] = useState<BleedHistoricalTrend[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isSimulatingWebhook, setIsSimulatingWebhook] = useState<boolean>(false);
  const [simulationSuccess, setSimulationSuccess] = useState<boolean>(false);

  // Kill-Switch Radar Interactive Filters & Payload Inspector
  const [ksStatusFilter, setKsStatusFilter] = useState<'ALL' | 'PAUSED' | 'EXEMPTED'>('ALL');
  const [ksStoreFilter, setKsStoreFilter] = useState<string>('ALL');
  const [selectedKsLogForPayload, setSelectedKsLogForPayload] = useState<KillSwitchEventLog | null>(null);

  const [directives, setDirectives] = useState<FounderDirectivesState>(() => {
    const saved = localStorage.getItem('adshield_founder_directives');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_FOUNDER_DIRECTIVES;
      }
    }
    return INITIAL_FOUNDER_DIRECTIVES;
  });
  const [activeTab, setActiveTab] = useState<
    'CRM_PROSPECTION' | 'KILLSWITCH_RADAR' | 'BLEED_HISTORY' | 'WHATSAPP_QUEUE' | 'CONCIERGE_LEADS' | 'SELF_LEARNING' | 'DEVOPS_AUTO_HEAL' | 'DIRECTIVES' | 'INFRASTRUCTURE_360'
  >('CRM_PROSPECTION');
  const [isSavingDirectives, setIsSavingDirectives] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // New Lead Form State
  const [newStoreDomain, setNewStoreDomain] = useState<string>('');
  const [newStoreBrand, setNewStoreBrand] = useState<string>('');
  const [newStorePhone, setNewStorePhone] = useState<string>('');
  const [newStoreSegment, setNewStoreSegment] = useState<string>('Moda & Vestuário');

  const handleDownloadCsvExport = () => {
    const csvData = generateMasterHqCsvExport();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `adshield_balanco_executivo_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const loadData = async () => {
    const m = await fetchLiveBusinessMetrics();
    setMetrics(m);

    const ksLogs = await fetchKillSwitchLogs();
    setKillSwitchLogs(ksLogs);

    const bleed = await fetchStoreBleedMetrics();
    setStoreBleedMetrics(bleed);

    const topSkus = await fetchTopRecurrentSkus();
    setTopRecurrentSkus(topSkus);

    const waQueue = await fetchWhatsAppAlertQueue();
    setWhatsappQueue(waQueue);

    const trends = await fetchBleedHistoricalTrends();
    setHistoricalTrends(trends);

    if (isSupabaseConfigured) {
      try {
        const { data: qData } = await supabase
          .from('alert_dispatch_queue')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (qData) setConciergeLeads(qData);
      } catch {
        // fallback
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateLeadStatus = (leadId: string, newStatus: ProspectStoreLead['status']) => {
    setLeads(prev => {
      const updated = prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
      localStorage.setItem('adshield_custom_prospect_leads', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeleteProspectLead = (leadId: string) => {
    setLeads(prev => {
      const updated = prev.filter(l => l.id !== leadId);
      localStorage.setItem('adshield_custom_prospect_leads', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddNewProspectLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreDomain.trim()) return;

    const brand = newStoreBrand.trim() || newStoreDomain.replace('.com.br', '').replace('.com', '');
    const cleanPhone = newStorePhone.replace(/\D/g, '') || '5511999999999';

    const newLead: ProspectStoreLead = {
      id: `lead-custom-${Date.now()}`,
      brandName: brand,
      domain: newStoreDomain.trim(),
      segment: newStoreSegment,
      estimatedMonthlyLoss: 16500,
      criticalDefect: 'Ruptura nos tamanhos de maior curva anunciados no Meta Ads',
      contactWhatsApp: cleanPhone,
      contactPerson: 'Decisor Comercial',
      adCampaignRunning: true,
      dossierUrl: `https://leakfinder-green.vercel.app/?loja=${newStoreDomain.trim()}`,
      outreachPitch: `Olá! Notamos que os anúncios da ${brand} estão ativos no Instagram com grade furada nos tamanhos mais vendidos. O prejuízo estimado é de R$ 16.500/mês. Acesse o dossiê da sua loja aqui: https://leakfinder-green.vercel.app/?loja=${newStoreDomain.trim()}`,
      status: 'NOVO'
    };

    const updatedLeads = [newLead, ...leads];
    setLeads(updatedLeads);
    localStorage.setItem('adshield_custom_prospect_leads', JSON.stringify(updatedLeads));
    setNewStoreDomain('');
    setNewStoreBrand('');
    setNewStorePhone('');
  };

  const handleSaveDirectives = () => {
    setIsSavingDirectives(true);
    localStorage.setItem('adshield_founder_directives', JSON.stringify(directives));
    setTimeout(() => {
      setIsSavingDirectives(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 400);
  };

  const handleSimulateWebhook = () => {
    setIsSimulatingWebhook(true);
    setTimeout(() => {
      const newEvent: KillSwitchEventLog = {
        id: `ks-${Date.now()}`,
        brandName: 'BRK Agro',
        storeUrl: 'https://www.brkagro.com.br',
        adId: `act_409182390_ad_${Math.floor(1000 + Math.random() * 9000)}`,
        campaignName: '[CONVERSÃO] Linha Farm UV50+ - Brasil',
        sku: 'BRK-FARM-XADREZ-G',
        productTitle: 'Camisa Xadrez Farm Preto/Branco - Manga Longa',
        sizeOutOfStock: 'G',
        reactionTimeSeconds: 26.2,
        actionTaken: 'PAUSED',
        savingsEstimatedDay: 620.0,
        timestamp: new Date().toISOString(),
        whatsappDispatched: true,
        targetPhone: '5534991351122'
      };
      setKillSwitchLogs(prev => [newEvent, ...prev]);
      setIsSimulatingWebhook(false);
      setSimulationSuccess(true);
      setTimeout(() => setSimulationSuccess(false), 3500);
    }, 1200);
  };

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Banner: Founder Master HQ 2.0 Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl text-slate-950 shadow-md shadow-amber-500/20 font-bold">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">Torre de Controle do Fundador (Master HQ 2.0)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Acesso Executivo Master
              </span>
              <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Vigia 24/7 Ativo (&lt;60s)</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Métricas financeiras consolidadas, radar autônomo do Kill-Switch na Meta Graph API, histórico de sangria evitada e central de prospecção de alta conversão.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleDownloadCsvExport}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/30 shrink-0"
            title="Exportar balanço financeiro e logs em CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Balanço Executivo (.CSV)</span>
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/30 shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Leads em Lote</span>
          </button>

          <button
            onClick={loadData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid: SaaS Business Metrics 2.0 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* MRR SaaS */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">MRR Projetado (Mensal)</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono block">
            R$ {metrics?.mrrProjected.toLocaleString('pt-BR') || '24.020'}
          </span>
          <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
            <span className="text-emerald-600 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>46 Assinantes</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">12 Starter / 28 Pro / 6 Ent</span>
          </div>
        </div>

        {/* Sangria Protegida / Evitada Acumulada */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Sangria Protegida / Mês</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-indigo-600 font-mono block">
            R$ {(metrics?.totalBleedProtectedMonthly || 203976.30).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-indigo-800 font-bold flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-indigo-600" />
            <span>Auditado nas 3 Marcas Monitoradas</span>
          </span>
        </div>

        {/* Kill-Switch Autônomo Stats */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Kill-Switch Meta Graph API</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 font-mono block">
              {metrics?.killSwitchAvgResponseTimeSeconds || 28.4}s
            </span>
            <span className="text-[11px] font-bold text-slate-500">Latência Média</span>
          </div>
          <span className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>&lt;60s • 3 Pausas • 100% Regra _FULL</span>
          </span>
        </div>

        {/* WhatsApp Watchdog Queue */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Vigia WhatsApp Oficial</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-emerald-700 font-mono block">
            5534991351122
          </span>
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>Canal do Fundador Lucas Conectado</span>
          </span>
        </div>

      </div>

      {/* Sub-Tabs: Navigation Bar 2.0 */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('CRM_PROSPECTION')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'CRM_PROSPECTION'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>CRM de Prospecção ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('KILLSWITCH_RADAR')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'KILLSWITCH_RADAR'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>⚡ Kill-Switch Live Radar & Logs ({killSwitchLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('BLEED_HISTORY')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'BLEED_HISTORY'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>🛡️ Histórico de Sangria Evitada</span>
        </button>

        <button
          onClick={() => setActiveTab('WHATSAPP_QUEUE')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'WHATSAPP_QUEUE'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>📲 Fila WhatsApp ({whatsappQueue.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CONCIERGE_LEADS')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'CONCIERGE_LEADS'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Leads Chatbot ({conciergeLeads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SELF_LEARNING')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'SELF_LEARNING'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Auto-Aprendizado (ML)</span>
        </button>

        <button
          onClick={() => setActiveTab('DEVOPS_AUTO_HEAL')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'DEVOPS_AUTO_HEAL'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>DevOps & Self-Healing</span>
        </button>

        <button
          onClick={() => setActiveTab('DIRECTIVES')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'DIRECTIVES'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Diretrizes do Fundador</span>
        </button>

        <button
          onClick={() => setActiveTab('INFRASTRUCTURE_360')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
            activeTab === 'INFRASTRUCTURE_360'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Monitor 360º</span>
        </button>
      </div>

      {/* TAB 1: OUTBOUND PROSPECTION CRM */}
      {activeTab === 'CRM_PROSPECTION' && (
        <div className="space-y-6">
          
          {/* Quick Add Store to Hunt */}
          <form onSubmit={handleAddNewProspectLead} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-wrap gap-2.5 items-center">
            <span className="text-xs font-bold text-slate-700 font-mono uppercase flex items-center gap-1 shrink-0">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Adicionar Loja para Caçar:</span>
            </span>

            <input
              type="text"
              placeholder="Domínio (ex: lojafamosa.com.br)"
              value={newStoreDomain}
              onChange={(e) => setNewStoreDomain(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-slate-800 flex-1 min-w-[160px]"
            />

            <input
              type="text"
              placeholder="Nome da Marca (Opcional)"
              value={newStoreBrand}
              onChange={(e) => setNewStoreBrand(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800 w-44"
            />

            <input
              type="tel"
              placeholder="WhatsApp (DDD + Número)"
              value={newStorePhone}
              onChange={(e) => setNewStorePhone(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-slate-800 w-40"
            />

            <select
              value={newStoreSegment}
              onChange={(e) => setNewStoreSegment(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
            >
              <option value="Moda & Vestuário">Moda & Roupas</option>
              <option value="Calçados">Calçados</option>
              <option value="Autopeças">Autopeças</option>
              <option value="Beleza & Cosméticos">Beleza & Cosméticos</option>
              <option value="Suplementos">Suplementos</option>
            </select>

            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 shadow-xs"
            >
              <span>Minerar & Gerar Dossiê</span>
            </button>
          </form>

          {/* Leads Cards Table */}
          <div className="space-y-3">
            {leads.map((lead) => {
              const whatsappUrl = `https://api.whatsapp.com/send?phone=${lead.contactWhatsApp}&text=${encodeURIComponent(lead.outreachPitch)}`;

              return (
                <div key={lead.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
                  
                  {/* Lead Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl font-bold font-mono text-xs">
                        {lead.domain.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{lead.brandName}</h3>
                          <span className="text-xs text-slate-400 font-mono">({lead.domain})</span>
                        </div>
                        <span className="text-xs text-indigo-600 font-mono font-bold">{lead.segment} • Contato: {lead.contactPerson}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          lead.status === 'CLIENTE_ATIVO'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : lead.status === 'EM_NEGOCIACAO'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : lead.status === 'PROPOSTA_ENVIADA'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : 'bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="NOVO">Novo Lead</option>
                        <option value="PROPOSTA_ENVIADA">Proposta Enviada</option>
                        <option value="EM_NEGOCIACAO">Em Negociação</option>
                        <option value="CLIENTE_ATIVO">Cliente Ativo ✅</option>
                      </select>

                      <button
                        onClick={() => handleDeleteProspectLead(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Remover lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Defect and Financial Loss Metric */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 sm:col-span-2 space-y-1">
                      <span className="text-[10px] text-slate-400 font-mono uppercase block font-bold">Falha Crítica Identificada pela IA:</span>
                      <p className="text-slate-800 font-medium leading-relaxed">{lead.criticalDefect}</p>
                    </div>

                    <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-200 text-rose-950 space-y-1">
                      <span className="text-[10px] text-rose-700 font-mono uppercase block font-bold">Prejuízo Mensal em Mídia:</span>
                      <p className="font-mono font-black text-rose-900 text-base">
                        R$ {lead.estimatedMonthlyLoss.toLocaleString('pt-BR')} / mês
                      </p>
                    </div>
                  </div>

                  {/* Outreach Copywriting & 1-Click WhatsApp Pitch Button */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-2xl space-y-2 border border-slate-800">
                    <span className="text-[10px] text-amber-400 font-mono uppercase block font-bold">
                      Mensagem de Fechamento Personalizada (Pitch com ROI):
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
                      "{lead.outreachPitch}"
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                    <a
                      href={lead.dossierUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 underline"
                    >
                      <span>Visualizar Dossiê Público da Loja</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Disparar Pitch no WhatsApp ({lead.contactWhatsApp})</span>
                    </a>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: KILL-SWITCH LIVE RADAR & LOGS */}
      {activeTab === 'KILLSWITCH_RADAR' && (
        <div className="space-y-6">
          
          {/* Header & Quick Simulation Trigger */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <Zap className="w-5 h-5" />
                </span>
                <h3 className="text-base font-bold text-slate-900">Radar de Execução do Kill-Switch (&lt;60s)</h3>
                <span className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Meta Graph API v20.0
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Monitora os webhooks da Shopify (`inventory_levels/update`) e executa a pausa de anúncios na Meta Ads antes que ocorra queima de verba em grade rompida.
              </p>
            </div>

            <button
              onClick={handleSimulateWebhook}
              disabled={isSimulatingWebhook}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-amber-600/20 shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>{isSimulatingWebhook ? 'Simulando Webhook Shopify...' : 'Simular Evento de Ruptura ao Vivo'}</span>
            </button>
          </div>

          {simulationSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Evento de Ruptura capturado em 26.2s! Anúncio pausado na Meta Graph API e alerta despachado para 5534991351122.</span>
            </div>
          )}

          {/* Kill-Switch Event Logs Table & Filters */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-700 font-mono uppercase tracking-wider">Histórico de Intervenções Autônomas</h4>
                <p className="text-[11px] text-slate-400">Clique em qualquer evento para inspecionar o payload da Meta Graph API em tempo real:</p>
              </div>

              {/* Filter Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                  <span className="text-slate-500 px-1">Status:</span>
                  <button
                    onClick={() => setKsStatusFilter('ALL')}
                    className={`px-2 py-0.5 rounded-lg transition-all ${ksStatusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'}`}
                  >
                    Todos
                  </button>
                  <button
                    onClick={() => setKsStatusFilter('PAUSED')}
                    className={`px-2 py-0.5 rounded-lg transition-all ${ksStatusFilter === 'PAUSED' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'}`}
                  >
                    Pausados
                  </button>
                  <button
                    onClick={() => setKsStatusFilter('EXEMPTED')}
                    className={`px-2 py-0.5 rounded-lg transition-all ${ksStatusFilter === 'EXEMPTED' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600'}`}
                  >
                    Isentos
                  </button>
                </div>

                <select
                  value={ksStoreFilter}
                  onChange={(e) => setKsStoreFilter(e.target.value)}
                  className="px-2.5 py-1 text-[11px] font-bold rounded-xl bg-slate-100 border border-slate-200 text-slate-700"
                >
                  <option value="ALL">Todas as Lojas</option>
                  <option value="BRK Agro">BRK Agro</option>
                  <option value="BRK Fishing">BRK Fishing</option>
                  <option value="BRK Motors">BRK Motors</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-3 font-bold">Loja / Marca</th>
                    <th className="pb-3 font-bold">Anúncio Afetado</th>
                    <th className="pb-3 font-bold">SKU & Tamanho</th>
                    <th className="pb-3 font-bold">Latência</th>
                    <th className="pb-3 font-bold">Ação Executada</th>
                    <th className="pb-3 font-bold">Economia / Dia</th>
                    <th className="pb-3 font-bold">Payload API</th>
                    <th className="pb-3 font-bold">Alerta WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {killSwitchLogs
                    .filter(log => {
                      if (ksStatusFilter === 'PAUSED' && log.actionTaken !== 'PAUSED') return false;
                      if (ksStatusFilter === 'EXEMPTED' && log.actionTaken !== 'EXEMPTED_FULL_RULE') return false;
                      if (ksStoreFilter !== 'ALL' && log.brandName !== ksStoreFilter) return false;
                      return true;
                    })
                    .map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 font-bold text-slate-900">
                        <div>{log.brandName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{log.timestamp.slice(11, 19)} UTC</div>
                      </td>
                      <td className="py-3">
                        <div className="font-mono text-slate-800">{log.adId}</div>
                        <div className="text-[10px] text-slate-500 max-w-xs truncate">{log.campaignName}</div>
                      </td>
                      <td className="py-3">
                        <div className="font-mono font-bold text-slate-800">{log.sku}</div>
                        <div className="text-[11px] text-rose-600 font-semibold">Tamanho [{log.sizeOutOfStock}] esgotado</div>
                      </td>
                      <td className="py-3 font-mono font-bold text-slate-700">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                          {log.reactionTimeSeconds}s
                        </span>
                      </td>
                      <td className="py-3">
                        {log.actionTaken === 'PAUSED' ? (
                          <span className="px-2 py-0.5 rounded-full font-mono font-bold text-[10px] bg-rose-100 text-rose-800 border border-rose-200">
                            PAUSED (Meta API)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full font-mono font-bold text-[10px] bg-blue-100 text-blue-800 border border-blue-200">
                            ISENTO (Regra _FULL)
                          </span>
                        )}
                      </td>
                      <td className="py-3 font-mono font-bold text-emerald-600">
                        {log.savingsEstimatedDay > 0 ? `+ R$ ${log.savingsEstimatedDay.toLocaleString('pt-BR')}` : 'R$ 0 (Isento)'}
                      </td>
                      <td className="py-3">
                        <button
                          onClick={() => setSelectedKsLogForPayload(log)}
                          className="px-2 py-1 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                        >
                          <Code2 className="w-3 h-3 text-indigo-400" />
                          <span>Ver Payload</span>
                        </button>
                      </td>
                      <td className="py-3">
                        {log.whatsappDispatched ? (
                          <span className="flex items-center gap-1 text-emerald-700 font-bold text-[11px]">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>5534991351122</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono text-[10px]">Sem Disparo</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Meta Graph API Payload Modal / Inspector */}
            {selectedKsLogForPayload && selectedKsLogForPayload.metaPayload && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-emerald-400 text-sm">
                      Payload Meta Graph API • Anúncio {selectedKsLogForPayload.adId}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedKsLogForPayload(null)}
                    className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded-md hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    ✕ Fechar Inspetor
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Endpoint:</span>
                    <span className="text-indigo-400 font-bold">{selectedKsLogForPayload.metaPayload.endpoint}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Status / Latência:</span>
                    <span className="text-emerald-400 font-bold">{selectedKsLogForPayload.metaPayload.responseStatus} OK ({selectedKsLogForPayload.metaPayload.latencyMs}ms)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Timestamp do Disparo:</span>
                    <span className="text-slate-300">{selectedKsLogForPayload.metaPayload.apiTimestamp}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1 text-[10px] uppercase">Request Body (JSON):</span>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-emerald-300 overflow-x-auto text-[11px]">
                    {JSON.stringify(selectedKsLogForPayload.metaPayload.requestBody, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 3: HISTÓRICO DE SANGRIA EVITADA */}
      {activeTab === 'BLEED_HISTORY' && (
        <div className="space-y-6">
          
          {/* 📊 Visual Analytical Trend: 4-Week Bleed Prevention Progression */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <TrendingUp className="w-5 h-5" />
                  </span>
                  <h3 className="text-base font-black text-white">Evolução Analítica de Sangria Evitada (Últimas 4 Semanas)</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Progressão acumulada de verba preservada em tráfego pago e proteção de catálogo por semana de operação:
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Protegido no Mês</span>
                <span className="text-xl font-black text-emerald-400 font-mono">R$ 203.976,30</span>
                <span className="text-[10px] text-slate-400 font-mono block">~R$ 6.799,21 economizados/dia</span>
              </div>
            </div>

            {/* Visual Bar Progression */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              {historicalTrends.map((trend, idx) => {
                const maxVal = 60000;
                const pct = Math.round((trend.bleedPreventedBrl / maxVal) * 100);

                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-bold text-slate-300">Semana {idx + 1}</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        {trend.activeAdsProtectedCount} Anúncios
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-lg font-black text-emerald-400 font-mono block">
                        R$ {trend.bleedPreventedBrl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        Maior economia: <strong className="text-slate-200">{trend.topContributingStore}</strong>
                      </span>
                    </div>

                    {/* Visual Bar */}
                    <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Overview Cards per Store */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {storeBleedMetrics.map((store) => (
              <div key={store.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold font-mono text-xs">
                      {store.brandName.slice(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{store.brandName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{store.niche}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                    {store.status}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Sangria Mensal Protegida:</span>
                  <div className="text-xl font-black text-rose-600 font-mono">
                    R$ {store.currentEstimatedLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>{store.ruptureCount} produtos com ruptura</span>
                    <span className="font-bold text-indigo-600 font-mono">Score: {store.currentScore}/100</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recurrent SKUs & Factory Operational Actions */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Produtos com Maior Recorrência de Ruptura (Memória CoALA)</h4>
                <p className="text-xs text-slate-500">Roteamento automatizado entre Confecção Própria (Sankhya PCP) e Revenda Homologada (PO Compras):</p>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                Total Acumulado: R$ 203.976,30
              </span>
            </div>

            <div className="space-y-3">
              {topRecurrentSkus.map((sku) => (
                <div key={sku.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{sku.brandName}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-mono font-semibold text-slate-700">{sku.productTitle}</span>
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-amber-100 text-amber-800">
                        {sku.recurrenceCount}x Recorrente
                      </span>
                    </div>

                    <div className="text-slate-500 flex items-center gap-2">
                      <span className="text-rose-600 font-bold">Faltando: [{sku.missingSizes.join(', ')}]</span>
                      <span>•</span>
                      <span className="font-mono">Perda diária estimada: R$ {sku.dailyLossBrl.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {sku.manufacturingType === 'PROPRIA' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-xl font-bold font-mono text-[11px] border border-blue-200">
                        <Factory className="w-3.5 h-3.5" />
                        <span>Sankhya PCP (Própria)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-xl font-bold font-mono text-[11px] border border-amber-200">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>PO Compras (Revenda)</span>
                      </div>
                    )}

                    <div className="p-2 bg-white rounded-xl border border-slate-200 text-slate-700 text-[11px] font-medium max-w-xs">
                      {sku.recommendedAction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: WHATSAPP NOTIFICATION QUEUE */}
      {activeTab === 'WHATSAPP_QUEUE' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Fila de Disparos de WhatsApp do Vigia 24/7</h3>
                <p className="text-xs text-slate-500">Destinatário oficial cadastrado: <span className="font-mono font-bold text-emerald-700">5534991351122</span> (Lucas)</p>
              </div>

              <a
                href={`https://api.whatsapp.com/send?phone=5534991351122&text=${encodeURIComponent('🛡️ [TESTE ADSHIELD OS] Vigia 24/7 conectado com sucesso! O sistema está operando perfeitamente e protegendo o tráfego pago.')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Testar Disparo no WhatsApp</span>
              </a>
            </div>

            <div className="space-y-3">
              {whatsappQueue.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-200 text-slate-800">
                        {item.alertType}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{item.createdAt}</span>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                        item.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.priority}
                      </span>
                    </div>
                    <p className="text-slate-800 font-sans font-medium">{item.summaryText}</p>
                  </div>

                  <span className="px-2.5 py-1 rounded-xl font-mono text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
                    Status: {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONCIERGE LEADS FROM SUPABASE */}
      {activeTab === 'CONCIERGE_LEADS' && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Leads Capturados pelo Chatbot no Site (24h)</h3>
            <p className="text-xs text-slate-500">Telefones reais de visitantes que pediram diagnósticos no chat flutuante do site:</p>

            {conciergeLeads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-mono bg-slate-50 rounded-2xl border border-slate-200">
                Nenhum telefone registrado recentemente na fila. Novos contatos digitados no chat aparecerão aqui em tempo real.
              </div>
            ) : (
              <div className="space-y-2">
                {conciergeLeads.map((item) => (
                  <div key={item.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl font-bold font-mono">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 font-mono text-sm block">{item.phone_number}</span>
                        <span className="text-slate-500 text-[11px]">{item.message_body || 'Lead Capturado no Chatbot'}</span>
                      </div>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=${item.phone_number.replace(/\D/g, '')}&text=${encodeURIComponent('Olá! Vimos que você pediu um diagnóstico da sua loja no AdShield. Como podemos te ajudar a recuperar as vendas perdidas?')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chamar no WhatsApp</span>
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: MACHINE LEARNING & AGENT SELF-EVOLUTION */}
      {activeTab === 'SELF_LEARNING' && (
        <AgentSelfEvolutionView />
      )}

      {/* TAB 7: AUTONOMOUS DEVOPS & SELF-HEALING (AGENTS 11 & 12) */}
      {activeTab === 'DEVOPS_AUTO_HEAL' && (
        <DevOpsSelfHealingControlCenterView />
      )}

      {/* TAB 8: FOUNDER DIRECTIVES & AI RULES */}
      {activeTab === 'DIRECTIVES' && (
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Diretrizes & Dicas Estratégicas do Fundador</h3>
              <p className="text-xs text-slate-500">Configure as regras de negócio que governam o Enxame de Agentes:</p>
            </div>

            <button
              onClick={handleSaveDirectives}
              disabled={isSavingDirectives}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingDirectives ? 'Salvando...' : 'Salvar Diretrizes'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            
            {/* Directives Left */}
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nota Mínima da Matriz ICE Score para Aprovação (CEO Agent):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5.0"
                    max="10.0"
                    step="0.5"
                    value={directives.croMinIceScore}
                    onChange={(e) => setDirectives({ ...directives, croMinIceScore: parseFloat(e.target.value) })}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="font-mono font-bold text-sm bg-indigo-50 text-indigo-700 px-3 py-1 rounded-xl border border-indigo-200">
                    {directives.croMinIceScore.toFixed(1)} / 10
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">Ideias com ICE Score abaixo deste valor são descartadas pelo Orquestrador.</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Instruções & Dicas Gerais para o Cérebro da IA:
                </label>
                <textarea
                  rows={4}
                  value={directives.customAiInstructions}
                  onChange={(e) => setDirectives({ ...directives, customAiInstructions: e.target.value })}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans text-slate-800"
                />
              </div>
            </div>

            {/* Directives Right: Pricing Floors */}
            <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">
                Preços Mínimos dos Planos Comerciais:
              </span>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="font-bold text-slate-700 block">Starter (1 Loja)</span>
                  <input
                    type="number"
                    value={directives.priceFloorStarter}
                    onChange={(e) => setDirectives({ ...directives, priceFloorStarter: parseInt(e.target.value) || 197 })}
                    className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>

                <div>
                  <span className="font-bold text-slate-700 block">Pro (3 Lojas)</span>
                  <input
                    type="number"
                    value={directives.priceFloorPro}
                    onChange={(e) => setDirectives({ ...directives, priceFloorPro: parseInt(e.target.value) || 497 })}
                    className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>

                <div>
                  <span className="font-bold text-slate-700 block">Enterprise (10 Lojas)</span>
                  <input
                    type="number"
                    value={directives.priceFloorEnterprise}
                    onChange={(e) => setDirectives({ ...directives, priceFloorEnterprise: parseInt(e.target.value) || 1290 })}
                    className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 text-[11px] font-medium">
                💡 O robô usará esses valores ao calcular o ROI nas propostas do WhatsApp para os lojistas.
              </div>
            </div>

          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold text-center">
              ✅ Diretrizes do Fundador salvas e propagadas para todos os 18 agentes!
            </div>
          )}
        </div>
      )}

      {/* TAB 9: INFRASTRUCTURE 360 MONITOR */}
      {activeTab === 'INFRASTRUCTURE_360' && (
        <div className="space-y-6 animate-fadeIn">
          <InfrastructureFourPillarsMonitor />
        </div>
      )}

      {/* Batch Lead Export Modal */}
      {isExportModalOpen && (
        <BatchLeadExportModal
          onClose={() => setIsExportModalOpen(false)}
          leads={leads as any}
        />
      )}

    </div>
  );
};

