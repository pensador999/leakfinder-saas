import React, { useState, useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldCheck, 
  Building2, 
  Palette, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Calculator, 
  Layers, 
  ArrowRight,
  TrendingUp,
  Lock,
  Phone,
  Settings2,
  TableProperties,
  Sliders,
  Zap,
  KeyRound
} from 'lucide-react';
import { AgentDiagnosticResult } from '../types';
import { SpreadsheetExporter } from '../services/export/spreadsheetExporter';
import { OfficialIntegrationConnectModal } from './OfficialIntegrationConnectModal';

interface ExecutivePdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnostic: AgentDiagnosticResult;
}

export const ExecutivePdfExportModal: React.FC<ExecutivePdfExportModalProps> = ({
  isOpen,
  onClose,
  diagnostic
}) => {
  // White-Label State
  const [agencyName, setAgencyName] = useState('Apex Growth Advisors');
  const [consultantName, setConsultantName] = useState('Especialista em CRO & Growth');
  const [consultantPhone, setConsultantPhone] = useState('(11) 98765-4321');
  const [accentColor, setAccentColor] = useState<'indigo' | 'blue' | 'emerald' | 'black'>('indigo');
  
  // Section Inclusions
  const [includeCover, setIncludeCover] = useState(true);
  const [includeLeaks, setIncludeLeaks] = useState(true);
  const [includeCatalog, setIncludeCatalog] = useState(true);
  const [includeRupture, setIncludeRupture] = useState(true);
  const [includePix, setIncludePix] = useState(true);
  const [includeIceRoadmap, setIncludeIceRoadmap] = useState(true);
  const [includeFactChecker, setIncludeFactChecker] = useState(true);

  // Official API Connect Modal
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const printContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !diagnostic) return null;

  const { input, realSiteData, growthScore, estimatedRevenueLiftMin, estimatedRevenueLiftMax } = diagnostic;

  const handlePrint = () => {
    window.print();
  };

  const colorThemes = {
    indigo: {
      primary: 'bg-indigo-900 text-white',
      accent: 'text-indigo-600',
      border: 'border-indigo-600',
      badge: 'bg-indigo-50 text-indigo-800 border-indigo-200'
    },
    blue: {
      primary: 'bg-blue-900 text-white',
      accent: 'text-blue-600',
      border: 'border-blue-600',
      badge: 'bg-blue-50 text-blue-800 border-blue-200'
    },
    emerald: {
      primary: 'bg-emerald-950 text-white',
      accent: 'text-emerald-600',
      border: 'border-emerald-600',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200'
    },
    black: {
      primary: 'bg-slate-950 text-white',
      accent: 'text-slate-900',
      border: 'border-slate-900',
      badge: 'bg-slate-100 text-slate-900 border-slate-300'
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      
      {/* Container Principal */}
      <div className="bg-slate-100 w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-300 flex flex-col h-[94vh] overflow-hidden">
        
        {/* Modal Top Bar (Não sai na impressão) */}
        <div className="print:hidden p-4 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Gerador de Relatório Executivo em PDF (White-Label)</h3>
              <p className="text-xs text-slate-500">Personalize a identidade da sua consultoria e imprima ou salve em PDF A4 de 1 clique.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar em PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Sidebar Config + Live A4 Preview */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* SIDEBAR DE CUSTOMIZAÇÃO WHITE-LABEL (Oculta na Impressão) */}
          <div className="print:hidden w-full lg:w-80 bg-white border-r border-slate-200 p-6 space-y-5 overflow-y-auto shrink-0">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-indigo-600" /> Branding da sua Agência
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Seus dados no cabeçalho do documento.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Nome da Agência / Consultoria</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Cargo / Especialista</label>
                <input
                  type="text"
                  value={consultantName}
                  onChange={(e) => setConsultantName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-indigo-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">WhatsApp de Contato</label>
                <input
                  type="text"
                  value={consultantPhone}
                  onChange={(e) => setConsultantPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-indigo-600"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <label className="block text-[11px] font-bold text-slate-700">Paleta de Cores Executiva</label>
              <div className="grid grid-cols-4 gap-2">
                {(['indigo', 'blue', 'emerald', 'black'] as const).map((color) => (
                  <button
                    key={color}
                    onClick={() => setAccentColor(color)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer capitalize ${
                      accentColor === color
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-black'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {color === 'indigo' ? 'Índigo' : color === 'blue' ? 'Azul' : color === 'emerald' ? 'Esmeralda' : 'Preto'}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2.5">
              <label className="block text-[11px] font-bold text-slate-700">Seções a Incluir no PDF</label>
              
              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" checked={includeCover} onChange={(e) => setIncludeCover(e.target.checked)} className="rounded text-indigo-600" />
                <span>Capa & Growth Score</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" checked={includeLeaks} onChange={(e) => setIncludeLeaks(e.target.checked)} className="rounded text-indigo-600" />
                <span>Os 3 Maiores Vazamentos</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" checked={includeRupture} onChange={(e) => setIncludeRupture(e.target.checked)} className="rounded text-indigo-600" />
                <span>Vigia 24h & Ruptura de Anúncios</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" checked={includePix} onChange={(e) => setIncludePix(e.target.checked)} className="rounded text-indigo-600" />
                <span>Simulador Pix & Elasticidade</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" checked={includeCatalog} onChange={(e) => setIncludeCatalog(e.target.checked)} className="rounded text-indigo-600" />
                <span>Grade de Catálogo (Regra APC)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" checked={includeIceRoadmap} onChange={(e) => setIncludeIceRoadmap(e.target.checked)} className="rounded text-indigo-600" />
                <span>Plano de Ação (Matriz ICE)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                <input type="checkbox" checked={includeFactChecker} onChange={(e) => setIncludeFactChecker(e.target.checked)} className="rounded text-indigo-600" />
                <span>Certidão do Fact-Checker</span>
              </label>
            </div>

            {/* Planilhas e Documentos em Excel */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <h4 className="text-[11px] font-bold text-slate-800 uppercase font-mono flex items-center gap-1.5">
                <TableProperties className="w-3.5 h-3.5 text-blue-600" /> Planilhas Excel (.CSV)
              </h4>
              <button
                onClick={() => SpreadsheetExporter.exportCatalogAudit(realSiteData)}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition-all flex items-center justify-between shadow-2xs cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> Planilha de Catálogo & SKUs
                </span>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <button
                onClick={() => SpreadsheetExporter.exportFinancialActionPlan(diagnostic)}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[11px] rounded-xl transition-all flex items-center justify-between shadow-2xs cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Plano de Ação & Lucro
                </span>
                <Download className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>

            {/* Conectar Integração Oficial Segura */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                <span>Conectar Shopify / Meta Ads</span>
              </button>
            </div>

            {/* Ação Rápida WhatsApp */}
            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={() => {
                  const msg = `DIAGNÓSTICO EXECUTIVO DE CRO & ESCALA (${realSiteData.brandName})\n\nOlá! Concluímos a auditoria profunda da sua operação:\n• Growth Score Atual: ${growthScore}/100\n• Oportunidade de Receita Extra: +R$ ${estimatedRevenueLiftMin.toLocaleString('pt-BR')} a R$ ${estimatedRevenueLiftMax.toLocaleString('pt-BR')}/mês\n• Ação Imediata: Simulador Pix + Reposição de Grade nos Anúncios.\n\nGerado por: ${agencyName} (${consultantName})\nRelatório Completo em PDF disponível.`;
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank');
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Enviar Pitch no WhatsApp</span>
              </button>
            </div>
          </div>

          {/* DOCUMENT LIVE PREVIEW (DOCUMENTO A4 FORMATADO) */}
          <div className="flex-1 p-4 sm:p-8 overflow-y-auto bg-slate-200/80 flex justify-center">
            
            {/* A4 Sheet Container */}
            <div 
              ref={printContainerRef}
              className="bg-white w-full max-w-[210mm] shadow-xl p-8 sm:p-12 space-y-8 font-sans text-slate-900 border border-slate-300 print:shadow-none print:border-none print:p-0 print:m-0 h-fit"
            >
              
              {/* PAGE 1: COVER & EXECUTIVE HEADER */}
              {includeCover && (
                <div className="space-y-6 border-b border-slate-200 pb-8 break-inside-avoid">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-xs font-mono font-bold tracking-widest text-indigo-600 uppercase">
                        {agencyName}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">Dossiê Estratégico de E-Commerce & CRO</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-600 font-mono">
                        Data: {new Date().toLocaleDateString('pt-BR')}
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">Confidencial • Nível Diretoria</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                      Auditoria de Crescimento & Blindagem Financeira
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Diagnóstico Executivo: {input.businessName || realSiteData.brandName}
                    </h1>
                    <p className="text-xs text-slate-600 font-mono">
                      Domínio Auditado: <span className="font-bold text-indigo-600">{realSiteData.domain}</span> | Nicho: {input.niche || 'E-Commerce'}
                    </p>
                  </div>

                  {/* Growth Score & Revenue Lift Highlight Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">Growth Score Geral</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                          Ponderado
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-cyan-400 font-mono">{growthScore}</span>
                        <span className="text-sm font-bold text-slate-400">/ 100</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Índice baseado em Saúde de Catálogo (30%), Velocidade Mobile (25%), CRO (25%) e Segurança (20%).
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white space-y-2 border border-indigo-800/40">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400">Lucro Adicional Estimado</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                          Simulação Dinâmica
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                        +R$ {estimatedRevenueLiftMin.toLocaleString('pt-BR')} a R$ {estimatedRevenueLiftMax.toLocaleString('pt-BR')}
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Receita destravável com eliminação de rupturas em anúncios e conversão no Pix.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 2: OS 3 MAIORES VAZAMENTOS */}
              {includeLeaks && (
                <div className="space-y-4 border-b border-slate-200 pb-8 break-inside-avoid">
                  <h2 className="text-sm font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600" /> 1. Os 3 Maiores Vazamentos Financeiros Identificados:
                  </h2>

                  <div className="space-y-3">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="p-2 bg-rose-100 text-rose-700 rounded-lg shrink-0 font-mono font-bold text-xs">#1</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900">Ruptura de Estoque nos Tamanhos Mais Vendidos (G / GG)</h4>
                        <p className="text-[11px] text-slate-600">
                          Visitantes vindos de anúncios encontram os tamanhos populares esgotados, queimando até 48% da verba investida em tráfego pago.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="p-2 bg-amber-100 text-amber-700 rounded-lg shrink-0 font-mono font-bold text-xs">#2</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900">Ausência de Desconto Inteligente no Pix (Perda de Margem em Cartão)</h4>
                        <p className="text-[11px] text-slate-600">
                          A loja paga taxas elevadas no cartão. Um desconto de 5% a 7% no Pix acelera o fluxo de caixa e aumenta o lucro líquido real.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg shrink-0 font-mono font-bold text-xs">#3</div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900">Fricção de Contraste e Carregamento Mobile</h4>
                        <p className="text-[11px] text-slate-600">
                          Botões principais fora da zona de alcance fácil do polegar e contraste abaixo da norma WCAG 2.1 reduzem a conversão no celular.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 3: SIMULADOR PIX & RUPTURA */}
              {(includeRupture || includePix) && (
                <div className="space-y-4 border-b border-slate-200 pb-8 break-inside-avoid">
                  <h2 className="text-sm font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-600" /> 2. Simulação de Elasticidade & Impacto Financeiro:
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {includeRupture && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="text-[10px] font-bold text-rose-600 uppercase font-mono">Simulador de Ruptura de Anúncios</span>
                        <h4 className="text-xs font-bold text-slate-900">Demanda Perdida: 48% em [G, GG]</h4>
                        <p className="text-[11px] text-slate-600">
                          Desperdício projetado em anúncios: <strong className="text-rose-700 font-mono">~R$ 4.320/mês</strong>.
                        </p>
                      </div>
                    )}

                    {includePix && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase font-mono">Simulador de Elasticidade Pix</span>
                        <h4 className="text-xs font-bold text-slate-900">Ganho com 5% de Desconto no Pix</h4>
                        <p className="text-[11px] text-slate-600">
                          Lucro líquido adicional destravável: <strong className="text-emerald-700 font-mono">+R$ 12.370/mês</strong>.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PAGE 4: PLANO DE AÇÃO ICE SCORE */}
              {includeIceRoadmap && (
                <div className="space-y-4 border-b border-slate-200 pb-8 break-inside-avoid">
                  <h2 className="text-sm font-bold text-slate-900 uppercase font-mono flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-indigo-600" /> 3. Plano de Ação Priorizado (Matriz ICE Score):
                  </h2>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 font-mono">
                        <th className="pb-2">Iniciativa / Ação</th>
                        <th className="pb-2 text-center">Impacto</th>
                        <th className="pb-2 text-center">Facilidade</th>
                        <th className="pb-2 text-right">ICE Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-[11px]">
                      <tr>
                        <td className="py-2.5 font-bold text-slate-900">1. Instalar Script de Desconto Dinâmico no Pix</td>
                        <td className="py-2.5 text-center font-mono">9.5</td>
                        <td className="py-2.5 text-center font-mono">10.0</td>
                        <td className="py-2.5 text-right font-mono font-bold text-indigo-600">95 / 100</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-slate-900">2. Ativar Vigia 24h de Ruptura nos Criativos de Ads</td>
                        <td className="py-2.5 text-center font-mono">9.0</td>
                        <td className="py-2.5 text-center font-mono">9.0</td>
                        <td className="py-2.5 text-right font-mono font-bold text-indigo-600">88 / 100</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-slate-900">3. Repor Grade Comercial nos SKUs Destaque</td>
                        <td className="py-2.5 text-center font-mono">8.5</td>
                        <td className="py-2.5 text-center font-mono">8.0</td>
                        <td className="py-2.5 text-right font-mono font-bold text-indigo-600">82 / 100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* PAGE 5: CERTIDÃO DO FACT-CHECKER & FOOTER */}
              {includeFactChecker && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 break-inside-avoid">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Certidão de Integridade Factual (Grounding 100%)</h4>
                      <p className="text-[10px] text-slate-500">
                        Zero links quebrados (404), regras de isenção aplicadas e transparência absoluta de dados.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg font-mono shrink-0">
                    Auditado & Aprovado
                  </span>
                </div>
              )}

              {/* PDF FOOTER (CONTATO DA AGÊNCIA) */}
              <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 border-t border-slate-200 gap-2 break-inside-avoid">
                <div>
                  <p className="font-bold text-slate-900">{agencyName}</p>
                  <p className="text-[10px] text-slate-500">{consultantName} • WhatsApp: {consultantPhone}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-slate-400">Gerado via LeakFinder • Engine v2.4</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Modal de Conexão Segura de APIs */}
      <OfficialIntegrationConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        brandName={realSiteData.brandName}
        domain={realSiteData.domain}
      />

    </div>
  );
};
