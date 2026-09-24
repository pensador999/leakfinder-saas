import React, { useState, useEffect, useRef } from 'react';
import { 
  Radar, 
  Play, 
  Square, 
  Send, 
  MessageCircle, 
  Phone, 
  Flame, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  Settings, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Filter, 
  Mic, 
  FileText, 
  UserCheck, 
  ArrowRight,
  TrendingDown,
  Terminal,
  Zap,
  Clock,
  Cpu,
  Lock,
  FlaskConical
} from 'lucide-react';
import { TechReverseEngineeringInspectorModal } from '../reverseEngineering/TechReverseEngineeringInspectorModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFire, 
  faBolt, 
  faClock, 
  faShieldHalved, 
  faBullseye, 
  faCircleExclamation 
} from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp, faMeta } from '@fortawesome/free-brands-svg-icons';
import { 
  startAutonomousHuntingSession, 
  stopAutonomousHuntingSession, 
  HunterNicheCategory, 
  HunterProgressEvent 
} from '../../services/prospecting/autonomousLeadHunterEngine';
import { 
  ProspectLead, 
  getSavedProspectLeads, 
  updateLeadProspectStatus, 
  buildWhatsAppClickToChatUrl,
  generateMetaAdsLibraryUrl,
  HuntingTier
} from '../../services/prospecting/leadSniperEngine';
import { 
  getSavedOutboundConfig, 
  persistOutboundConfig, 
  enqueueLeadForOutreach, 
  dispatchSingleQueueItem, 
  OutboundWebhookConfig 
} from '../../services/prospecting/outboundWebhookDispatcher';

interface AutonomousOutboundRadarViewProps {
  onSelectLeadForDossier?: (lead: ProspectLead) => void;
}

export const AutonomousOutboundRadarView: React.FC<AutonomousOutboundRadarViewProps> = ({
  onSelectLeadForDossier
}) => {
  const [selectedNiche, setSelectedNiche] = useState<HunterNicheCategory>('AGRO_MODA_CAMPO');
  const [selectedTierFilter, setSelectedTierFilter] = useState<'ALL' | HuntingTier>('ALL');
  const [isHunting, setIsHunting] = useState<boolean>(false);
  const [radarLogs, setRadarLogs] = useState<HunterProgressEvent[]>([]);
  const [progressPct, setProgressPct] = useState<number>(0);
  const [leadsList, setLeadsList] = useState<ProspectLead[]>([]);
  const [activePitchType, setActivePitchType] = useState<Record<string, 'directFounder' | 'technicalMediaBuyer' | 'audioScript45s'>>({});
  const [copiedPitchId, setCopiedPitchId] = useState<string | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [webhookConfig, setWebhookConfig] = useState<OutboundWebhookConfig>(getSavedOutboundConfig());
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLeadsList(getSavedProspectLeads());
  }, []);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [radarLogs]);

  const handleStartHunting = async () => {
    setIsHunting(true);
    setProgressPct(5);
    setRadarLogs([]);

    const customSeeds = customUrlInput.trim() ? [customUrlInput.trim()] : undefined;

    try {
      const discovered = await startAutonomousHuntingSession(
        {
          niche: selectedNiche,
          maxStoresToScan: customSeeds ? 1 : 5,
          customSeedUrls: customSeeds,
          minMonthlyWasteFilterBRL: 5000,
          autoExtractWhatsApp: true
        },
        (event) => {
          setRadarLogs(prev => [...prev.slice(-40), event]);
          setProgressPct(event.progressPct);
          if (event.lead) {
            setLeadsList(prev => [event.lead!, ...prev.filter(l => l.id !== event.lead!.id)]);
          }
        }
      );

      setLeadsList(getSavedProspectLeads());
    } finally {
      setIsHunting(false);
      setProgressPct(100);
    }
  };

  const handleStopHunting = () => {
    stopAutonomousHuntingSession();
    setIsHunting(false);
  };

  const [isAirGapActive, setIsAirGapActive] = useState<boolean>(true); // 🔒 MODO LABORATÓRIO: Embargo Total de Disparos Ativo
  const [selectedLeadForTechInspection, setSelectedLeadForTechInspection] = useState<ProspectLead | null>(null);

  const handleCopyPitch = (leadId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPitchId(leadId);
    setTimeout(() => setCopiedPitchId(null), 2500);
  };

  const handleOpenWhatsApp = (lead: ProspectLead, pitchType: 'directFounder' | 'technicalMediaBuyer' | 'audioScript45s') => {
    const text = lead.pitches[pitchType];
    const phone = lead.contactTargetPhone || lead.detectedWhatsApp || '';
    
    // 🔒 TRAVA AIR-GAP: Bloqueia disparo externo involuntário e abre o Raio-X Técnico
    if (isAirGapActive) {
      handleCopyPitch(lead.id, text);
      setSelectedLeadForTechInspection(lead);
      return;
    }

    if (!phone) {
      handleCopyPitch(lead.id, text);
      alert(`⚠️ A vitrine "${lead.brandName}" não possui número público de WhatsApp detectado.\n\nO roteiro de abordagem foi copiado para sua área de transferência para contato via direct do Instagram ou SAC.`);
      return;
    }
    const url = buildWhatsAppClickToChatUrl(phone, text);
    updateLeadProspectStatus(lead.id, 'CONTATADO');
    setLeadsList(getSavedProspectLeads());
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleQueueAutomaticDispatch = async (lead: ProspectLead) => {
    // 🔒 TRAVA AIR-GAP: Bloqueia automação de webhook externo
    if (isAirGapActive) {
      setSelectedLeadForTechInspection(lead);
      return;
    }

    const pitchType = activePitchType[lead.id] || 'directFounder';
    const queuedItem = enqueueLeadForOutreach(lead, pitchType);
    await dispatchSingleQueueItem(queuedItem.id);
    setLeadsList(getSavedProspectLeads());
  };

  const totalFlaggedWaste = leadsList.reduce((acc, l) => acc + l.totalMonthlyWasteEstimated, 0);

  return (
    <div className="space-y-6 font-sans">
      
      {/* 🔒 Banner de Embargo & Modo Laboratório de Engenharia Reversa (Air-Gap) */}
      <div className="p-4 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-[#FFFCE1] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/40 shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm text-amber-300 font-mono">
                🔒 MODO LABORATÓRIO / EMBARGO DE DISPARO ATIVO (AIR-GAP)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                ZERO DISPARO EXTERNO
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-0.5 leading-relaxed">
              Nenhuma mensagem será transmitida aos leads. O sistema está em quarentena segura para <strong>Engenharia de Software</strong>, <strong>Engenharia Reversa de Plataformas/ERPs</strong> e <strong>Protocolo Falsify</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAirGapActive(!isAirGapActive)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 shadow-md ${
              isAirGapActive
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isAirGapActive ? 'Trava Air-Gap Ligada (Seguro)' : 'Trava Desligada (Atenção)'}</span>
          </button>
        </div>
      </div>

      {/* 1. Header Banner & Radar Swarm Controller */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full text-xs font-mono font-bold flex items-center gap-1.5">
                <Radar className={`w-4 h-4 ${isHunting ? 'animate-spin text-rose-400' : 'text-rose-400'}`} />
                <span>Enxame Caçador Ativo & Outreach Sniper</span>
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
                Modo Híbrido: Passivo + Caçador Ativo
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              O robô varre a web, flagra furos de estoque em anúncios e prepara o contato via WhatsApp
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Diferente do modo passivo onde esperamos o cliente digitar a URL, o <strong>Caçador Ativo</strong> navega de forma headless por lojas do seu nicho, valida o Meta Pixel, detecta variantes esgotadas (M e G) e extrai o canal de contato oficial com o cálculo da sangria em Reais.
            </p>
          </div>

          {/* Action Trigger Box */}
          <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-700/80 backdrop-blur-md w-full lg:w-80 shrink-0 space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Nicho da Varredura
              </label>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value as HunterNicheCategory)}
                disabled={isHunting}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="AGRO_MODA_CAMPO">Agropecuária & Moda Campo / Outdoor</option>
                <option value="MODA_MASCULINA_STREETWEAR">Moda Masculina & Streetwear</option>
                <option value="CALCADOS_COURO">Calçados, Tênis & Botas em Couro</option>
                <option value="FITNESS_BEACHWEAR">Moda Fitness & Beachwear</option>
                <option value="COSMETICOS_BEAUTY">Dermocosméticos & Beleza D2C</option>
                <option value="CUSTOM_TARGETS">Alvo Específico / Customizado</option>
              </select>
            </div>

            {selectedNiche === 'CUSTOM_TARGETS' && (
              <div>
                <input
                  type="url"
                  placeholder="https://loja-alvo.com.br"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  disabled={isHunting}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3 py-2 text-xs placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            )}

            <div className="pt-1 flex items-center gap-2">
              {!isHunting ? (
                <button
                  onClick={handleStartHunting}
                  className="w-full py-3 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Iniciar Varredura Ativa</span>
                </button>
              ) : (
                <button
                  onClick={handleStopHunting}
                  className="w-full py-3 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Square className="w-4 h-4 fill-white" />
                  <span>Pausar Varredura</span>
                </button>
              )}

              <button
                onClick={() => setIsConfigModalOpen(true)}
                title="Configurações de Webhook e Disparo"
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all cursor-pointer shrink-0"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Leads Qualificados</span>
            <span className="text-2xl font-black text-[#FFFCE1] font-mono">{leadsList.length} Lojas</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-[#0AE448] border border-emerald-500/20 rounded-xl">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Sangria Mapeada</span>
            <span className="text-xl font-black text-[#0AE448] font-mono">
              {totalFlaggedWaste.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/mês
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20 rounded-xl">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">WhatsApps Minerados</span>
            <span className="text-2xl font-black text-[#00BAE2] font-mono">
              {leadsList.filter(l => !!l.detectedWhatsApp).length} Canais
            </span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#101211] border border-white/10 shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#BBBAA6] font-mono block">Contatados no WhatsApp</span>
            <span className="text-2xl font-black text-indigo-300 font-mono">
              {leadsList.filter(l => l.status === 'CONTATADO' || l.status === 'DOSSIE_ENVIADO').length} Abordados
            </span>
          </div>
        </div>
      </div>

      {/* 3. Live Radar Terminal (Feed em Tempo Real) */}
      {(isHunting || radarLogs.length > 0) && (
        <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 shadow-xl text-slate-200 font-mono text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-indigo-400">
              <Terminal className="w-4 h-4" />
              <span className="font-bold tracking-wider">RADAR TELEMETRY FEED (AUTONOMOUS SWARM)</span>
            </div>
            <span className="text-[11px] text-slate-400 font-bold">{progressPct}% Concluído</span>
          </div>

          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="h-44 overflow-y-auto space-y-1.5 pr-2 custom-scrollbar">
            {radarLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                <span className={`shrink-0 font-bold ${
                  log.type === 'LEAD_QUALIFIED' ? 'text-emerald-400' :
                  log.type === 'STOCK_RUPTURE_FOUND' ? 'text-rose-400' :
                  log.type === 'META_PIXEL_FOUND' ? 'text-blue-400' :
                  log.type === 'WHATSAPP_MINED' ? 'text-amber-400' : 'text-slate-300'
                }`}>
                  {log.type === 'LEAD_QUALIFIED' ? '🎯' :
                   log.type === 'STOCK_RUPTURE_FOUND' ? '🚨' :
                   log.type === 'META_PIXEL_FOUND' ? '📡' :
                   log.type === 'WHATSAPP_MINED' ? '💬' : '🔍'}
                </span>
                <span className="text-slate-300">{log.message}</span>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      )}

      {/* 4. Leads Capturados com Prova do Crime & Disparo 1-Clique */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500" />
            <h3 className="font-bold text-lg text-slate-900">Leads Minerados & Prontos para Abordagem</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {leadsList.length} alvos com prova irrefutável
          </span>
        </div>

        {/* Tier Segmentation Selector (Hot / Warm / Cold) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 text-white shadow-md">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Funil de Prioridade:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedTierFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedTierFilter === 'ALL'
                  ? 'bg-[#0AE448] text-slate-950 font-black shadow-lg shadow-[#0AE448]/20'
                  : 'bg-[#141716] border border-white/10 text-[#BBBAA6] hover:bg-white/5 hover:text-[#FFFCE1]'
              }`}
            >
              <span>Todos os Alvos</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${selectedTierFilter === 'ALL' ? 'bg-slate-950 text-[#0AE448]' : 'bg-white/10 text-[#BBBAA6]'}`}>
                {leadsList.length}
              </span>
            </button>

            <button
              onClick={() => setSelectedTierFilter('TIER_1_HOT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedTierFilter === 'TIER_1_HOT'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 ring-2 ring-rose-400'
                  : 'bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/50'
              }`}
            >
              <FontAwesomeIcon icon={faFire} className="w-3 h-3" />
              <span>Tier 1: Atacar Hoje</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${selectedTierFilter === 'TIER_1_HOT' ? 'bg-rose-800 text-white' : 'bg-rose-900 text-rose-300'}`}>
                {leadsList.filter(l => l.huntingTier === 'TIER_1_HOT').length}
              </span>
            </button>

            <button
              onClick={() => setSelectedTierFilter('TIER_2_WARM')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedTierFilter === 'TIER_2_WARM'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30 ring-2 ring-amber-300'
                  : 'bg-amber-950/40 border border-amber-800/60 text-amber-300 hover:bg-amber-900/50'
              }`}
            >
              <FontAwesomeIcon icon={faBolt} className="w-3 h-3" />
              <span>Tier 2: Quase no Ponto</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${selectedTierFilter === 'TIER_2_WARM' ? 'bg-amber-700 text-slate-950' : 'bg-amber-900 text-amber-300'}`}>
                {leadsList.filter(l => l.huntingTier === 'TIER_2_WARM').length}
              </span>
            </button>

            <button
              onClick={() => setSelectedTierFilter('TIER_3_COLD')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedTierFilter === 'TIER_3_COLD'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-300'
                  : 'bg-blue-950/40 border border-blue-800/60 text-blue-300 hover:bg-blue-900/50'
              }`}
            >
              <FontAwesomeIcon icon={faClock} className="w-3 h-3" />
              <span>Tier 3: Radar Futuro</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${selectedTierFilter === 'TIER_3_COLD' ? 'bg-blue-800 text-white' : 'bg-blue-900 text-blue-300'}`}>
                {leadsList.filter(l => l.huntingTier === 'TIER_3_COLD').length}
              </span>
            </button>
          </div>
        </div>

        {(() => {
          const displayedLeads = selectedTierFilter === 'ALL'
            ? leadsList
            : leadsList.filter(l => l.huntingTier === selectedTierFilter);

          if (displayedLeads.length === 0) {
            return (
              <div className="p-12 text-center bg-[#101211] border border-white/10 rounded-2xl space-y-3 shadow-xl">
                <ShieldAlert className="w-10 h-10 text-[#BBBAA6] mx-auto" />
                <h4 className="font-bold text-[#FFFCE1] text-base">Nenhum lead encontrado neste Tier</h4>
                <p className="text-xs text-[#BBBAA6] max-w-md mx-auto">
                  Inicie uma nova sessão do Radar Autônomo para minerar mais lojas com flagrante de sangria.
                </p>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 gap-4">
              {displayedLeads.map((lead) => {
                const currentPitchType = activePitchType[lead.id] || 'directFounder';
                const currentPitchText = lead.pitches[currentPitchType];
                const isContacted = lead.status === 'CONTATADO' || lead.status === 'DOSSIE_ENVIADO';

                return (
                  <div 
                    key={lead.id}
                    className={`p-5 rounded-2xl bg-[#101211] border shadow-xl hover:border-white/20 transition-all space-y-4 ${
                      lead.huntingTier === 'TIER_1_HOT' 
                        ? 'border-rose-500/40 ring-1 ring-rose-500/20' 
                        : 'border-white/10'
                    }`}
                  >
                    {/* Lead Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#141716] border border-white/10 text-[#FFFCE1] font-black flex items-center justify-center text-sm">
                          {lead.brandName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-[#FFFCE1] text-base">{lead.brandName}</h4>
                            <a 
                              href={lead.storeUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[#BBBAA6] hover:text-[#00BAE2] transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {/* Tier Badge */}
                            {lead.huntingTier === 'TIER_1_HOT' && (
                              <span className="px-2.5 py-0.5 bg-rose-500/15 border border-rose-500/40 text-rose-700 text-[10px] font-black rounded-md uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                                <FontAwesomeIcon icon={faFire} className="w-3 h-3 text-rose-600" />
                                TIER 1 • ATACAR HOJE
                              </span>
                            )}
                            {lead.huntingTier === 'TIER_2_WARM' && (
                              <span className="px-2.5 py-0.5 bg-amber-500/15 border border-amber-500/40 text-amber-800 text-[10px] font-black rounded-md uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                                <FontAwesomeIcon icon={faBolt} className="w-3 h-3 text-amber-600" />
                                TIER 2 • QUASE NO PONTO
                              </span>
                            )}
                            {lead.huntingTier === 'TIER_3_COLD' && (
                              <span className="px-2.5 py-0.5 bg-blue-500/15 border border-blue-500/40 text-blue-700 text-[10px] font-black rounded-md uppercase tracking-wider flex items-center gap-1 shadow-2xs">
                                <FontAwesomeIcon icon={faClock} className="w-3 h-3 text-blue-600" />
                                TIER 3 • RADAR FUTURO
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">{lead.niche} • {lead.domain}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <span 
                          className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg text-xs font-mono font-bold flex items-center gap-1 shadow-2xs"
                          title="Estimativa matemática calculada sobre a proporção de 65% dos cliques perdidos na falta dos tamanhos centrais"
                        >
                          <span className="text-[9px] uppercase font-bold text-amber-300 bg-amber-500/20 px-1 py-0.2 rounded border border-amber-500/30 font-sans">Simulação</span>
                          <span>~R$ {lead.totalMonthlyWasteEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês</span>
                        </span>
                        <a
                          href={lead.metaAdsLibraryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs"
                          title="Abrir a Biblioteca Pública de Anúncios da Meta para ver os anúncios ativos desta marca ao vivo"
                        >
                          <span>Meta Ads Library</span>
                          <ExternalLink className="w-3 h-3 text-[#00BAE2]" />
                        </a>
                      </div>
                    </div>

                    {/* Proof of Crime (Flagrante) */}
                    <div className="p-3.5 bg-rose-950/20 border border-rose-500/20 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {lead.primaryBrokenSku.imageSrc ? (
                          <img 
                            src={lead.primaryBrokenSku.imageSrc} 
                            alt={lead.primaryBrokenSku.productTitle} 
                            className="w-14 h-14 object-cover rounded-lg border border-rose-500/30 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-center text-rose-400 shrink-0 font-bold text-xs">
                            SKU
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Furo Crítico de Grade</span>
                          <p className="text-xs font-extrabold text-[#FFFCE1]">{lead.primaryBrokenSku.productTitle}</p>
                          <p className="text-[11px] text-[#BBBAA6] mt-0.5">
                            Tamanhos Esgotados: <span className="font-bold text-rose-400">{lead.primaryBrokenSku.missingSizes.join(', ')}</span> 
                            {' '}(Disponíveis: {lead.primaryBrokenSku.availableSizes.join(', ')})
                          </p>
                        </div>
                      </div>

                      <div className="text-left md:text-right shrink-0">
                        <span className="text-[10px] uppercase font-bold text-[#BBBAA6] block">WhatsApp de Contato</span>
                        <span className="text-xs font-mono font-bold text-[#0AE448]">
                          {lead.contactTargetPhone || lead.detectedWhatsApp || 'Não minerado'}
                        </span>
                      </div>
                    </div>

                    {/* Tactical Tier Dossier Box */}
                    {lead.tierAnalysis && (
                      <div className={`p-3 rounded-xl border text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                        lead.huntingTier === 'TIER_1_HOT' 
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-200' 
                          : lead.huntingTier === 'TIER_2_WARM'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-200'
                          : 'bg-[#141716] border-white/10 text-[#FFFCE1]'
                      }`}>
                        <div className="space-y-0.5 flex-1">
                          <span className="text-[10px] uppercase font-mono font-bold tracking-wider opacity-70 flex items-center gap-1">
                            <span>🎯 Diagnóstico Forense de Prioridade</span>
                            <span>•</span>
                            <span className="font-bold">{lead.tierAnalysis.tierLabel}</span>
                          </span>
                          <p className="font-semibold text-xs leading-relaxed">{lead.tierAnalysis.tierReason}</p>
                        </div>
                        <div className="shrink-0 text-left md:text-right border-t md:border-t-0 pt-1.5 md:pt-0 border-current/10">
                          <span className="text-[10px] uppercase font-mono font-bold tracking-wider opacity-70 block">
                            Ação Recomendada
                          </span>
                          <span className="font-extrabold text-xs">{lead.tierAnalysis.recommendedAction}</span>
                        </div>
                      </div>
                    )}

                {/* Pitch Selector & Copy Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActivePitchType(prev => ({ ...prev, [lead.id]: 'directFounder' }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentPitchType === 'directFounder' ? 'bg-[#0AE448] text-slate-950 font-black' : 'bg-[#141716] border border-white/10 text-[#BBBAA6] hover:bg-white/5'
                        }`}
                      >
                        Dono / Fundador
                      </button>
                      <button
                        onClick={() => setActivePitchType(prev => ({ ...prev, [lead.id]: 'technicalMediaBuyer' }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentPitchType === 'technicalMediaBuyer' ? 'bg-[#0AE448] text-slate-950 font-black' : 'bg-[#141716] border border-white/10 text-[#BBBAA6] hover:bg-white/5'
                        }`}
                      >
                        Gestor de Tráfego
                      </button>
                      <button
                        onClick={() => setActivePitchType(prev => ({ ...prev, [lead.id]: 'audioScript45s' }))}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          currentPitchType === 'audioScript45s' ? 'bg-[#0AE448] text-slate-950 font-black' : 'bg-[#141716] border border-white/10 text-[#BBBAA6] hover:bg-white/5'
                        }`}
                      >
                        <Mic className="w-3 h-3" />
                        <span>Roteiro Áudio 45s</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleCopyPitch(lead.id, currentPitchText)}
                      className="text-xs text-[#00BAE2] hover:text-[#00BAE2]/80 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPitchId === lead.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#0AE448]" />
                          <span className="text-[#0AE448]">Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Texto</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 bg-[#0E100F] border border-white/10 rounded-xl text-xs text-[#BBBAA6] whitespace-pre-line leading-relaxed font-sans">
                    {currentPitchText}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isContacted ? 'bg-emerald-500/20 text-[#0AE448] border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {isContacted ? '✓ Contatado' : 'Aguardando Abordagem'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setSelectedLeadForTechInspection(lead)}
                      className="flex-1 sm:flex-none px-3.5 py-2 bg-[#00BAE2]/10 hover:bg-[#00BAE2]/20 text-[#00BAE2] border border-[#00BAE2]/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      title="Dissecar Stack Tecnológica (Plataforma, ERP, Hub) e rodar teste Popperiano Falsify"
                    >
                      <Cpu className="w-3.5 h-3.5 text-[#00BAE2]" />
                      <span>🔬 Raio-X & Falsify</span>
                    </button>

                    {onSelectLeadForDossier && (
                      <button
                        onClick={() => onSelectLeadForDossier(lead)}
                        className="flex-1 sm:flex-none px-3 py-2 bg-[#141716] hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#00BAE2]" />
                        <span>Ver Dossiê</span>
                      </button>
                    )}

                    {(() => {
                      const hasPhone = Boolean(lead.contactTargetPhone || lead.detectedWhatsApp);
                      return (
                        <button
                          onClick={() => handleOpenWhatsApp(lead, currentPitchType)}
                          className={`flex-1 sm:flex-none px-4 py-2 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[#0AE448]/20 ${
                            hasPhone ? 'bg-[#0AE448] hover:bg-[#0AE448]/90' : 'bg-[#BBBAA6] hover:bg-[#FFFCE1]'
                          }`}
                          title={hasPhone ? 'Abrir conversa no WhatsApp oficial da loja' : 'WhatsApp não detectado. Clique para copiar roteiro e abordar via Instagram/SAC'}
                        >
                          <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
                          <span>{hasPhone ? 'Disparar WhatsApp (1-Clique)' : 'Copiar Pitch (WhatsApp Pendente)'}</span>
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* 5. Modal de Configurações de Webhook (Evolution API / Z-API) */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#101211] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-white/10 space-y-4 text-[#FFFCE1]">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#00BAE2]" />
                <h4 className="font-extrabold text-base text-[#FFFCE1]">Automação de WhatsApp (Outreach)</h4>
              </div>
              <button 
                onClick={() => setIsConfigModalOpen(false)}
                className="text-[#BBBAA6] hover:text-[#FFFCE1] text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#FFFCE1] block mb-1">Provedor de WhatsApp</label>
                <select
                  value={webhookConfig.provider}
                  onChange={(e) => setWebhookConfig({ ...webhookConfig, provider: e.target.value as any })}
                  className="w-full bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl px-3 py-2 text-xs focus:border-[#0AE448]"
                >
                  <option value="MANUAL_ASSISTED" className="bg-[#101211]">Assistido 1-Clique (Abre WhatsApp Web oficial)</option>
                  <option value="EVOLUTION_API" className="bg-[#101211]">Evolution API (Instância Própria)</option>
                  <option value="Z_API" className="bg-[#101211]">Z-API (Instância Comercial)</option>
                  <option value="CUSTOM_WEBHOOK" className="bg-[#101211]">Webhook Customizado (n8n / Make / Node)</option>
                </select>
              </div>

              {webhookConfig.provider !== 'MANUAL_ASSISTED' && (
                <>
                  <div>
                    <label className="font-bold text-[#FFFCE1] block mb-1">URL da API / Webhook</label>
                    <input
                      type="text"
                      value={webhookConfig.apiUrl}
                      onChange={(e) => setWebhookConfig({ ...webhookConfig, apiUrl: e.target.value })}
                      className="w-full bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl px-3 py-2 text-xs placeholder-[#BBBAA6]/40 focus:border-[#0AE448]"
                      placeholder="https://sua-instancia.evolution-api.com/message/sendText"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#FFFCE1] block mb-1">API Key / Token de Autenticação</label>
                    <input
                      type="password"
                      value={webhookConfig.apiKey}
                      onChange={(e) => setWebhookConfig({ ...webhookConfig, apiKey: e.target.value })}
                      className="w-full bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl px-3 py-2 text-xs placeholder-[#BBBAA6]/40 focus:border-[#0AE448]"
                      placeholder="Sua chave secreta"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-bold text-[#FFFCE1] block mb-1">Delay Mínimo (s)</label>
                      <input
                        type="number"
                        value={webhookConfig.minDelaySeconds}
                        onChange={(e) => setWebhookConfig({ ...webhookConfig, minDelaySeconds: Number(e.target.value) })}
                        className="w-full bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl px-3 py-2 text-xs focus:border-[#0AE448]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#FFFCE1] block mb-1">Delay Máximo (s)</label>
                      <input
                        type="number"
                        value={webhookConfig.maxDelaySeconds}
                        onChange={(e) => setWebhookConfig({ ...webhookConfig, maxDelaySeconds: Number(e.target.value) })}
                        className="w-full bg-[#0E100F] border border-white/10 text-[#FFFCE1] rounded-xl px-3 py-2 text-xs focus:border-[#0AE448]"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="px-4 py-2 bg-[#141716] hover:bg-white/10 text-[#BBBAA6] border border-white/10 rounded-xl text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  persistOutboundConfig(webhookConfig);
                  setIsConfigModalOpen(false);
                }}
                className="px-4 py-2 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-[#0AE448]/20"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Modal de Raio-X de Engenharia Reversa e Protocolo Falsify */}
      {selectedLeadForTechInspection && (
        <TechReverseEngineeringInspectorModal
          lead={selectedLeadForTechInspection}
          isOpen={Boolean(selectedLeadForTechInspection)}
          onClose={() => setSelectedLeadForTechInspection(null)}
        />
      )}

    </div>
  );
};
