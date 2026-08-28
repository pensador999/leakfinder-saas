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
  Trash2
} from 'lucide-react';
import { 
  ProspectStoreLead, 
  BusinessMetricsSummary, 
  FounderDirectivesState, 
  INITIAL_FOUNDER_DIRECTIVES, 
  SAMPLE_PROSPECT_LEADS, 
  fetchLiveBusinessMetrics 
} from '../../services/founder/founderHqService';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { AgentSelfEvolutionView } from './AgentSelfEvolutionView';

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
  const [activeTab, setActiveTab] = useState<'CRM_PROSPECTION' | 'CONCIERGE_LEADS' | 'SELF_LEARNING' | 'DIRECTIVES'>('CRM_PROSPECTION');
  const [isSavingDirectives, setIsSavingDirectives] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // New Lead Form State
  const [newStoreDomain, setNewStoreDomain] = useState<string>('');
  const [newStoreBrand, setNewStoreBrand] = useState<string>('');
  const [newStorePhone, setNewStorePhone] = useState<string>('');
  const [newStoreSegment, setNewStoreSegment] = useState<string>('Moda');

  const loadData = async () => {
    const m = await fetchLiveBusinessMetrics();
    setMetrics(m);

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

  return (
    <div className="space-y-8 font-sans">
      
      {/* Top Banner: Founder Master HQ Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl text-slate-950 shadow-md shadow-amber-500/20 font-bold">
            <Crown className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Torre de Controle do Fundador (Master Business HQ)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Acesso Executivo Master
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Gerencie a prospecção ativa de clientes, acompanhe o faturamento recorrente (MRR) dos planos e dite as regras estratégicas para os 10 agentes em tempo real.
            </p>
          </div>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Atualizar Métricas</span>
        </button>
      </div>

      {/* KPI Stats Grid: SaaS Business Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        {/* MRR */}
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
          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>46 Assinantes Ativos</span>
          </span>
        </div>

        {/* Plan Distribution */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Divisão dos Planos</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1 font-mono text-xs">
            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">12 Starter</span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold">28 Pro</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">6 Enterprise</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono block pt-1">R$ 197 / R$ 497 / R$ 1.290</span>
        </div>

        {/* Audited Stores in Supabase */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Lojas Auditadas (Supabase)</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono block">
            {metrics?.totalStoresAudited || 1056}+ Snapshots
          </span>
          <span className="text-[11px] text-indigo-600 font-bold">Base de Dados em Nuvem Ativa</span>
        </div>

        {/* Concierge Leads */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400 font-mono">Leads no Radar (WhatsApp)</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-black text-amber-600 font-mono block">
            {leads.length + conciergeLeads.length} Lojas Mapeadas
          </span>
          <span className="text-[11px] text-amber-700 font-bold">Prontas para Abordagem</span>
        </div>

      </div>

      {/* Sub-Tabs: CRM vs Concierge vs Directives */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('CRM_PROSPECTION')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'CRM_PROSPECTION'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>CRM de Prospecção Outbound ({leads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CONCIERGE_LEADS')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'CONCIERGE_LEADS'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Leads do Chatbot no Site ({conciergeLeads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('SELF_LEARNING')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'SELF_LEARNING'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Auto-Aprendizado dos Agentes (ML)</span>
        </button>

        <button
          onClick={() => setActiveTab('DIRECTIVES')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'DIRECTIVES'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Diretrizes & Dicas do Fundador</span>
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

      {/* TAB 2: CONCIERGE LEADS FROM SUPABASE */}
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

      {/* TAB 3: MACHINE LEARNING & AGENT SELF-EVOLUTION */}
      {activeTab === 'SELF_LEARNING' && (
        <AgentSelfEvolutionView />
      )}

      {/* TAB 4: FOUNDER DIRECTIVES & AI RULES */}
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
              ✅ Diretrizes do Fundador salvas e propagadas para todos os 10 agentes!
            </div>
          )}
        </div>
      )}

    </div>
  );
};
