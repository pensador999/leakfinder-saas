import React, { useState, useEffect, useRef } from 'react';
import {
  Settings,
  X,
  Key,
  ShieldCheck,
  Save,
  Paintbrush,
  Building2,
  Image,
  Link,
  User,
  Smartphone,
  Mail,
  Database,
  Download,
  Upload,
  CheckCircle2,
  Cpu,
  RotateCcw
} from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey } from '../services/llmService';
import { getWhiteLabelConfig, setWhiteLabelConfig, WhiteLabelConfig } from '../services/whiteLabelService';
import {
  exportSwarmMemoryVaultJson,
  importSwarmMemoryVaultJson,
  getSwarmEvolutionSummary
} from '../services/memory/swarmEvolutionaryLearningEngine';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<'branding' | 'neural' | 'vault' | 'checkout'>('branding');
  const [apiKey, setApiKey] = useState('');
  const [whiteLabel, setWhiteLabel] = useState<WhiteLabelConfig>(getWhiteLabelConfig());
  const [saved, setSaved] = useState(false);
  const [vaultMessage, setVaultMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const swarmSummary = getSwarmEvolutionSummary();

  useEffect(() => {
    const existing = getGeminiApiKey();
    if (existing) setApiKey(existing);
    setWhiteLabel(getWhiteLabelConfig());
  }, []);

  const handleSave = () => {
    setGeminiApiKey(apiKey.trim());
    setWhiteLabelConfig(whiteLabel);
    setSaved(true);
    window.dispatchEvent(new Event('whitelabel-updated'));

    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleExportVault = () => {
    const json = exportSwarmMemoryVaultJson();
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adshield_local_vault_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setVaultMessage({ type: 'ok', text: 'Backup JSON do Cofre Local exportado com sucesso!' });
  };

  const handleImportVault = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = importSwarmMemoryVaultJson(String(reader.result || ''));
      setVaultMessage({
        type: res.success ? 'ok' : 'err',
        text: res.success
          ? `Cofre restaurado com sucesso! ${res.restoredDomainsCount} loja(s) e ${res.restoredPatternsCount} padrão(ões) carregados (SIQ: ${res.swarmMaturityScore}/100).`
          : (res.error || 'Arquivo JSON inválido.')
      });
    };
    reader.readAsText(file);
  };

  const handleResetLocalVault = () => {
    if (window.confirm('Tem certeza que deseja limpar os snapshots históricos e a memória episódica de lojas do navegador?')) {
      localStorage.removeItem('adshield_local_store_snapshots');
      localStorage.removeItem('adshield_local_swarm_job_logs');
      localStorage.removeItem('adshield_batch_prospecting_results_v1');
      setVaultMessage({ type: 'ok', text: 'Cache de snapshots e lotes limpo com sucesso.' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-[#101211] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-[#FFFCE1]">
        
        {/* Header Obsidian Neon */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0E100F] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0AE448]/10 border border-[#0AE448]/30 flex items-center justify-center text-[#0AE448] shadow-md shadow-[#0AE448]/10">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-[#FFFCE1]">Configurações da Plataforma & White-Label</h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#0AE448]/15 text-[#0AE448] border border-[#0AE448]/30 rounded-md">
                  Local-First OS
                </span>
              </div>
              <p className="text-xs text-[#BBBAA6]">
                Personalize sua marca nos relatórios PDF, chave Gemini AI, WhatsApp de contato e Cofre Local.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-xl text-[#BBBAA6] hover:text-[#FFFCE1] transition-colors cursor-pointer border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 pb-2 bg-[#141716] border-b border-white/10 flex items-center gap-2 overflow-x-auto text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setActiveSection('branding')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'branding'
                ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Identidade & Consultor (PDF / WhatsApp)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('neural')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'neural'
                ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Motor Neural (Gemini API)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('vault')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'vault'
                ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Cofre Local & Backup JSON</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('checkout')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSection === 'checkout'
                ? 'bg-[#0AE448] text-slate-950 font-black shadow-md shadow-[#0AE448]/20'
                : 'text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Links de Checkout</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs">
          
          {activeSection === 'branding' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-[#BBBAA6]">Nome da Empresa / Agência</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#BBBAA6]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={whiteLabel.agencyName}
                      onChange={(e) => setWhiteLabel({ ...whiteLabel, agencyName: e.target.value })}
                      placeholder="Ex: AdShield Intelligence"
                      className="w-full bg-[#0E100F] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448] transition-all text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-[#BBBAA6]">Cor Primária da Marca (Hex)</label>
                  <div className="relative">
                    <Paintbrush className="w-4 h-4 text-[#BBBAA6]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="color"
                      value={whiteLabel.primaryColor}
                      onChange={(e) => setWhiteLabel({ ...whiteLabel, primaryColor: e.target.value })}
                      className="absolute right-2.5 top-1.5 h-7 w-7 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                    />
                    <input
                      type="text"
                      value={whiteLabel.primaryColor}
                      onChange={(e) => setWhiteLabel({ ...whiteLabel, primaryColor: e.target.value })}
                      placeholder="#0AE448"
                      className="w-full bg-[#0E100F] border border-white/10 rounded-xl py-2.5 pl-10 pr-12 text-[#FFFCE1] focus:outline-none focus:border-[#0AE448] transition-all font-mono text-xs uppercase font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-[#BBBAA6]">Nome do Consultor / Responsável</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#BBBAA6]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={whiteLabel.consultantName}
                      onChange={(e) => setWhiteLabel({ ...whiteLabel, consultantName: e.target.value })}
                      placeholder="Seu Nome (sai na assinatura do PDF)"
                      className="w-full bg-[#0E100F] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448] transition-all text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-[#BBBAA6]">WhatsApp Oficial da Agência (com DDI 55)</label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-[#0AE448] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={whiteLabel.consultantWhatsApp}
                      onChange={(e) => setWhiteLabel({ ...whiteLabel, consultantWhatsApp: e.target.value })}
                      placeholder="5534991351122"
                      className="w-full bg-[#0E100F] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448] transition-all font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-[#BBBAA6]">E-mail Corporativo (Rodapé PDF)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#BBBAA6]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={whiteLabel.consultantEmail}
                      onChange={(e) => setWhiteLabel({ ...whiteLabel, consultantEmail: e.target.value })}
                      placeholder="contato@suaagencia.com.br"
                      className="w-full bg-[#0E100F] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448] transition-all font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-[#BBBAA6]">URL da Logo (Opcional)</label>
                  <div className="relative">
                    <Image className="w-4 h-4 text-[#BBBAA6]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={whiteLabel.logoUrl}
                      onChange={(e) => setWhiteLabel({ ...whiteLabel, logoUrl: e.target.value })}
                      placeholder="https://sua-empresa.com/logo.png"
                      className="w-full bg-[#0E100F] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448] transition-all font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#141716] border border-white/10 text-[11px] text-[#BBBAA6] flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#0AE448] shrink-0" />
                <span>
                  Essas informações atualizam automaticamente o cabeçalho do sistema, a capa dos relatórios <strong>PDF A4 Executivo</strong> e o botão de contato nos dossiês enviados aos lojistas.
                </span>
              </div>
            </div>
          )}

          {activeSection === 'neural' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#141716] border border-[#0AE448]/30 flex gap-3.5">
                <Cpu className="w-5 h-5 text-[#0AE448] shrink-0 mt-0.5" />
                <div className="text-xs text-[#BBBAA6] leading-relaxed">
                  <strong className="text-[#FFFCE1] block mb-0.5">Motor Duplo: Heurístico Determinístico + Google Gemini 2.5</strong>
                  O AdShield audita 100% dos catálogos, variantes, tamanhos furados e conformidade jurídica de forma autônoma e determinística sem precisar de chave externa. Se desejar habilitar sínteses generativas extras com o Gemini 2.5 Flash, insira sua chave abaixo.
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-[#BBBAA6]">Chave de API (Google Gemini — Opcional)</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#0AE448] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy... (Deixe em branco para usar o Motor Determinístico Local)"
                    className="w-full bg-[#0E100F] border border-white/10 rounded-xl py-3 pl-10 pr-4 text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448] transition-all font-mono text-xs"
                  />
                </div>
                <p className="text-[11px] text-[#BBBAA6] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0AE448]" />
                  Armazenada exclusivamente no `localStorage` do seu navegador. Nunca é enviada a servidores terceiros.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'vault' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[#FFFCE1] text-sm">Cofre de Inteligência Evolutiva Local-First</h4>
                  <p className="text-xs text-[#BBBAA6] mt-0.5">
                    Lojas assimiladas: <strong className="text-[#0AE448]">{swarmSummary.uniqueDomainsLearned.length}</strong> • Auditorias processadas: <strong className="text-[#FFFCE1]">{swarmSummary.totalAuditsProcessed}</strong> • SIQ Score: <strong className="text-[#00BAE2]">{swarmSummary.swarmMaturityScore}/100</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleExportVault}
                    className="px-3.5 py-2 bg-[#0AE448]/15 hover:bg-[#0AE448]/25 text-[#0AE448] border border-[#0AE448]/30 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar Cofre (.JSON)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#00BAE2]" />
                    <span>Restaurar (.JSON)</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportVault}
                    className="hidden"
                  />
                </div>
              </div>

              {vaultMessage && (
                <div className={`p-3 rounded-xl border font-bold text-xs flex items-center gap-2 ${
                  vaultMessage.type === 'ok'
                    ? 'bg-[#0AE448]/10 border-[#0AE448]/30 text-[#0AE448]'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{vaultMessage.text}</span>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#141716] border border-white/10 flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-[#FFFCE1] text-xs">Manutenção de Cache Local (Snapshots & Lotes)</h4>
                  <p className="text-[11px] text-[#BBBAA6]">
                    Limpa snapshots antigos e resultados temporários de prospecção em lote mantendo suas configurações White-Label.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetLocalVault}
                  className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Limpar Cache de Snapshots</span>
                </button>
              </div>
            </div>
          )}

          {activeSection === 'checkout' && (
            <div className="space-y-4">
              <p className="text-xs text-[#BBBAA6]">
                Configure links personalizados de checkout (Kiwify, Stripe, Hotmart ou Asaas) caso comercialize planos de auditoria e monitoramento da sua própria agência:
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">URL Checkout — Plano Starter</label>
                  <input
                    type="text"
                    value={whiteLabel.checkoutUrlStarter}
                    onChange={(e) => setWhiteLabel({ ...whiteLabel, checkoutUrlStarter: e.target.value })}
                    placeholder="https://pay.kiwify.com.br/..."
                    className="w-full bg-[#0E100F] border border-white/10 rounded-xl py-2.5 px-3.5 text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448] font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">URL Checkout — Plano Pro</label>
                  <input
                    type="text"
                    value={whiteLabel.checkoutUrlPro}
                    onChange={(e) => setWhiteLabel({ ...whiteLabel, checkoutUrlPro: e.target.value })}
                    placeholder="https://pay.kiwify.com.br/..."
                    className="w-full bg-[#0E100F] border border-white/10 rounded-xl py-2.5 px-3.5 text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448] font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#BBBAA6] mb-1">URL Checkout — Plano Agency</label>
                  <input
                    type="text"
                    value={whiteLabel.checkoutUrlAgency}
                    onChange={(e) => setWhiteLabel({ ...whiteLabel, checkoutUrlAgency: e.target.value })}
                    placeholder="https://pay.kiwify.com.br/..."
                    className="w-full bg-[#0E100F] border border-white/10 rounded-xl py-2.5 px-3.5 text-[#FFFCE1] placeholder-[#BBBAA6]/40 focus:outline-none focus:border-[#0AE448] font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-white/10 bg-[#0E100F] flex justify-between items-center gap-3 shrink-0">
          <span className="text-[11px] font-mono text-[#BBBAA6]">
            Persistência Local Ativa • Zero Dependência Externa
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#BBBAA6] hover:text-[#FFFCE1] transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saved}
              className="px-5 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#0AE448]/20 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvo com sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Configurações</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
