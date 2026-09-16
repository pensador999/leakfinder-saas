import React, { useState } from 'react';
import { 
  Building2, 
  MessageSquare, 
  Cpu, 
  Check, 
  Copy, 
  X,
  Database
} from 'lucide-react';
import { 
  generateNotionDatabaseSchema, 
  syncAgencyWorkspaceToNotion, 
  type NotionClientRecord 
} from '../../services/integrations/notionWorkspaceSync';
import { 
  executeMassiveCatalogAnalysis, 
  type MassiveCatalogSku 
} from '../../services/analytics/e2bSandboxRunner';

interface AgencyEnterpriseHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  agencyName?: string;
}

export const AgencyEnterpriseHubModal: React.FC<AgencyEnterpriseHubModalProps> = ({
  isOpen,
  onClose,
  agencyName = 'Agência Escala Mídia'
}) => {
  const [activeTab, setActiveTab] = useState<'NOTION' | 'COMPOSIO' | 'E2B'>('NOTION');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Mock Agency Client Records
  const mockClients: NotionClientRecord[] = [
    {
      clientName: 'Insider Store',
      storeDomain: 'insiderstore.com.br',
      affectedProductTitle: 'Daily T-Shirt Tech Algodão Orgânico',
      brokenSizes: ['M', 'G'],
      estimatedMonthlyLoss: 6825,
      severity: 'CRÍTICA',
      campaignStatus: '🚨 ATIVO (PAUSAR)',
      evidenceScreenshotUrl: 'https://leakfinder-green.vercel.app/api/evidence-preview?domain=insiderstore.com.br&sizes=M,G',
      lastInspectedAt: new Date().toISOString()
    },
    {
      clientName: 'BRK Agro',
      storeDomain: 'brkagro.com.br',
      affectedProductTitle: 'Camisa Masculina Manga Longa UV50+',
      brokenSizes: ['M', 'G', 'GG'],
      estimatedMonthlyLoss: 5280,
      severity: 'CRÍTICA',
      campaignStatus: '🚨 ATIVO (PAUSAR)',
      evidenceScreenshotUrl: 'https://leakfinder-green.vercel.app/api/evidence-preview?domain=brkagro.com.br&sizes=M,G,GG',
      lastInspectedAt: new Date().toISOString()
    },
    {
      clientName: 'Calçados Conforto',
      storeDomain: 'calcadosconforto.com.br',
      affectedProductTitle: 'Tênis Esportivo CloudStride Ortopédico',
      brokenSizes: ['39', '40', '41'],
      estimatedMonthlyLoss: 2700,
      severity: 'ALTA',
      campaignStatus: '🚨 ATIVO (PAUSAR)',
      evidenceScreenshotUrl: 'https://leakfinder-green.vercel.app/api/evidence-preview?domain=calcadosconforto.com.br&sizes=39,40,41',
      lastInspectedAt: new Date().toISOString()
    }
  ];

  const notionSync = syncAgencyWorkspaceToNotion(agencyName, mockClients);
  const notionSchema = generateNotionDatabaseSchema();

  // E2B Sandbox Sample Run (Simulated 500 SKUs sample)
  const sampleSkus: MassiveCatalogSku[] = Array.from({ length: 150 }, (_, i) => ({
    sku: `SKU-MEGA-${1000 + i}`,
    title: `Produto de Alta Performance Linha #${i + 1}`,
    category: i % 3 === 0 ? 'Vestuário' : i % 3 === 1 ? 'Calçados' : 'Acessórios',
    price: 150 + (i % 5) * 40,
    monthlySalesVolume: Math.max(10, Math.round(500 - i * 3.2)),
    totalVariants: 6,
    brokenVariantsCount: i < 8 ? 3 : i < 20 ? 1 : 0,
    brokenSizes: i < 8 ? ['M', 'G', 'GG'] : i < 20 ? ['G'] : []
  }));

  const e2bResult = executeMassiveCatalogAnalysis({
    storeDomain: 'megastore-moda.com.br',
    skus: sampleSkus
  });

  const handleCopyNotionLink = () => {
    navigator.clipboard.writeText(notionSync.mockNotionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Hub de Agências & Enterprise (Fase 4)</h3>
                <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                  Agency Scale • R$ 990 a R$ 2.500/mês
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Notion MCP Workspace • Composio Slack/Discord • E2B Sandbox (10k+ SKUs)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('NOTION')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'NOTION'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="h-4 w-4" />
            Notion MCP Workspace Sync
          </button>
          <button
            onClick={() => setActiveTab('COMPOSIO')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'COMPOSIO'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="h-4 w-4" />
            Composio Slack & Discord
          </button>
          <button
            onClick={() => setActiveTab('E2B')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'E2B'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="h-4 w-4" />
            E2B Sandbox (Megastores 10k+)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'NOTION' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Database className="h-4 w-4 text-cyan-400" />
                    {notionSchema.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{notionSchema.description}</p>
                </div>
                <button
                  onClick={handleCopyNotionLink}
                  className="flex items-center gap-2 rounded-lg bg-cyan-600/20 border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-600/30 transition-all"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copiado!' : 'Copiar Link do Notion'}
                </button>
              </div>

              {/* Notion Synced Table Preview */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs text-slate-400">
                  <span className="font-bold text-slate-300">Base Sincronizada ({mockClients.length} Clientes Ativos)</span>
                  <span className="font-mono text-[10px]">ID: {notionSync.databaseId}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">Cliente / Loja</th>
                        <th className="py-2.5 px-3 font-semibold">Produto Afetado</th>
                        <th className="py-2.5 px-3 font-semibold">Tamanhos Rompidos</th>
                        <th className="py-2.5 px-3 font-semibold">Desperdício Estimado</th>
                        <th className="py-2.5 px-3 font-semibold">Severidade</th>
                        <th className="py-2.5 px-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-200">
                      {mockClients.map(c => (
                        <tr key={c.storeDomain} className="hover:bg-slate-900/30">
                          <td className="py-2.5 px-3 font-bold text-white">{c.clientName}</td>
                          <td className="py-2.5 px-3 text-slate-300">{c.affectedProductTitle}</td>
                          <td className="py-2.5 px-3">
                            <div className="flex gap-1">
                              {c.brokenSizes.map(s => (
                                <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-red-500/20 text-red-400 border border-red-500/40">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono font-bold text-red-400">
                            ~R$ {c.estimatedMonthlyLoss.toLocaleString('pt-BR')}/mês
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                              {c.severity}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-600/20 text-red-300 border border-red-600/40">
                              {c.campaignStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'COMPOSIO' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Slack Block Kit Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-emerald-400" /> Slack Channel (#alerta-estoque)
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Block Kit Format</span>
                </div>
                <div className="rounded-xl border border-slate-800 bg-[#1a1d21] p-4 font-sans text-xs space-y-3 shadow-lg">
                  <div className="flex items-center gap-2 border-b border-slate-700/60 pb-2">
                    <span className="text-red-400 font-bold text-sm">🚨 ADSHIELD AGÊNCIA • RUPTURA EM CONTA ATIVA</span>
                  </div>
                  <div className="text-slate-300 space-y-1">
                    <p><strong>Cliente:</strong> Insider Store (<code className="text-cyan-400">insiderstore.com.br</code>)</p>
                    <p><strong>Produto em Campanha:</strong> Daily T-Shirt Tech Algodão Orgânico</p>
                    <p><strong>Tamanhos Esgotados:</strong> <span className="text-red-400 font-bold">[M, G]</span></p>
                    <p><strong>Vazamento Estimado:</strong> ~<span className="text-red-400 font-bold">R$ 6.825/mês</span></p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-3 rounded text-[11px] transition-colors">
                      🛑 Pausar Anúncio no Meta
                    </button>
                    <button className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-1.5 px-3 rounded text-[11px] transition-colors">
                      📸 Ver Prova do Crime
                    </button>
                  </div>
                </div>
              </div>

              {/* Discord Rich Embed Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-indigo-400" /> Discord Server (#gestão-tráfego)
                  </h4>
                  <span className="text-[10px] font-mono text-slate-400">Rich Embed Format</span>
                </div>
                <div className="rounded-xl border-l-4 border-l-red-500 border border-slate-800 bg-[#2b2d31] p-4 font-sans text-xs space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold text-xs">🚨 Ruptura Crítica em Anúncio • Insider Store</span>
                    <span className="text-[10px] text-slate-400 font-mono">Hoje às 17:28</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    O produto <strong>Daily T-Shirt Tech</strong> está recebendo tráfego pago, mas os tamanhos campeões estão esgotados no site.
                  </p>
                  <div className="grid grid-cols-2 gap-2 bg-slate-900/60 p-2 rounded border border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tamanhos Rompidos:</span>
                      <strong className="text-red-400">[M, G]</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Risco Financeiro:</span>
                      <strong className="text-red-400">~R$ 6.825/mês</strong>
                    </div>
                  </div>
                  <div className="text-[10px] text-cyan-400">
                    <a href="#" className="underline">Abrir Print Playwright Demarcado ↗</a>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'E2B' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-amber-400" />
                    Análise Massiva de Megastore (E2B Cloud Sandbox)
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Processamento isolado em container de código para catálogos com mais de 10.000 SKUs.
                  </p>
                </div>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-mono text-emerald-400">
                  Sandbox: {e2bResult.executionTimeMs}ms • 150 SKUs Amostrados
                </span>
              </div>

              {/* ABC Curve Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/20">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-red-400">CURVA A (Top 80% Faturamento)</span>
                    <span className="text-[10px] font-bold bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                      {e2bResult.abcCurve.curvaA.stockoutSkusCount} Rompidos
                    </span>
                  </div>
                  <p className="text-lg font-bold text-white">R$ {e2bResult.abcCurve.curvaA.totalRevenueBRL.toLocaleString('pt-BR')}</p>
                  <span className="text-[10px] text-red-300 block mt-1">
                    Risco de Perda: <strong>R$ {e2bResult.abcCurve.curvaA.estimatedMonthlyLossBRL.toLocaleString('pt-BR')}/mês</strong>
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-amber-400">CURVA B (15% Faturamento)</span>
                    <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded">
                      {e2bResult.abcCurve.curvaB.stockoutSkusCount} Rompidos
                    </span>
                  </div>
                  <p className="text-lg font-bold text-white">R$ {e2bResult.abcCurve.curvaB.totalRevenueBRL.toLocaleString('pt-BR')}</p>
                  <span className="text-[10px] text-amber-300 block mt-1">
                    Risco de Perda: <strong>R$ {e2bResult.abcCurve.curvaB.estimatedMonthlyLossBRL.toLocaleString('pt-BR')}/mês</strong>
                  </span>
                </div>

                <div className="p-4 rounded-xl border border-slate-700 bg-slate-900/60">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-400">CURVA C (Cauda Longa 5%)</span>
                    <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {e2bResult.abcCurve.curvaC.stockoutSkusCount} Rompidos
                    </span>
                  </div>
                  <p className="text-lg font-bold text-white">R$ {e2bResult.abcCurve.curvaC.totalRevenueBRL.toLocaleString('pt-BR')}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Risco de Perda: <strong>R$ {e2bResult.abcCurve.curvaC.estimatedMonthlyLossBRL.toLocaleString('pt-BR')}/mês</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 bg-slate-950/80 px-6 py-3 flex justify-between items-center text-xs text-slate-400">
          <span>Modo de Operação: <strong>Simulação Local / Sandbox 100% Protegido</strong></span>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 px-4 py-2 font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
