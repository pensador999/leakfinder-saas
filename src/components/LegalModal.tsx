import React from 'react';
import { Link } from 'react-router-dom';
import { X, FileText, Shield, ExternalLink, Printer, Scale, ShieldCheck, Mail, Building2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen || !type) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#101211] border border-white/10 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[88vh] flex flex-col animate-scale-in text-[#FFFCE1]">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-white/10 bg-[#0E100F] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/25 rounded-xl">
              {isPrivacy ? <Shield className="w-5 h-5" /> : <Scale className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#FFFCE1]">
                {isPrivacy ? 'Governança de Privacidade, Cookies & LGPD' : 'Termos de Uso & Condições Gerais SaaS'}
              </h2>
              <p className="text-[11px] text-[#BBBAA6] font-mono">
                AdShield Intelligence OS • Plataforma Independente de Auditoria Técnica de E-Commerce
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              title="Imprimir laudo legal"
            >
              <Printer className="w-4 h-4 text-[#0AE448]" />
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-xs">
          <div className="space-y-4 text-[#BBBAA6] leading-relaxed">
            {isPrivacy ? (
              <>
                <div className="p-3.5 bg-[#0AE448]/10 border border-[#0AE448]/25 rounded-2xl flex items-center justify-between text-[#0AE448] font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Conformidade Estrita com a Lei 13.709/2018 (LGPD Brasil)</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#BBBAA6]">v4.0</span>
                </div>

                <p>
                  O <strong className="text-[#FFFCE1]">AdShield Intelligence (LeakFinder SaaS)</strong> é uma plataforma tecnológica independente de auditoria analítica de sites e e-commerces, sem vínculo societário com as lojas auditadas, operando sob princípios inquebráveis de transparência, privacidade local (<em className="text-[#FFFCE1]">Local-First Storage</em>) e integridade no tratamento de metadados públicos.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">1.</span> Dados Públicos de E-Commerce vs. Dados Pessoais (Art. 5º, I)
                </h3>
                <p>
                  A legislação brasileira protege dados de <em>pessoas naturais</em>. Informações públicas de lojas virtuais (catálogos, SKUs, variantes de estoque, preços, URLs, HTML público e anúncios públicos na Meta Ads Library) são dados mercadológicos de vitrines comerciais e não configuram dados pessoais.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">2.</span> Armazenamento Local (<code className="text-[#0AE448]">localStorage</code>) & Cookies Técnicos
                </h3>
                <p>
                  Os diagnósticos dos 18 agentes, calibrações de vertical, simulações de ROAS e preferências de interface são processados e armazenados prioritariamente no próprio navegador do usuário (<code className="text-[#0AE448]">localStorage</code>), garantindo soberania de dados, velocidade instantânea e zero compartilhamento com corretores de dados.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">3.</span> Base Legal para Auditoria & Opt-Out Instantâneo
                </h3>
                <p>
                  A leitura técnica de domínios informados pelo usuário ampara-se no <strong className="text-[#FFFCE1]">Art. 7º, §4º</strong> (dados manifestamente públicos) e no <strong className="text-[#FFFCE1]">Legítimo Interesse (Art. 7º, IX c/c Art. 10 da LGPD)</strong>. Solicitações de descadastramento ou exclusão são atendidas imediatamente via <strong className="text-[#00BAE2]">dpo@adshield.ai</strong>.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">4.</span> Canal Oficial de Privacidade & DPO (Art. 41 LGPD)
                </h3>
                <div className="p-3 bg-[#141716] border border-white/10 rounded-xl flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#0AE448] shrink-0" />
                  <div>
                    <strong className="text-[#FFFCE1] block">Encarregado de Proteção de Dados (DPO):</strong>
                    <span className="text-[#00BAE2] font-mono">dpo@adshield.ai • privacidade@adshield.ai</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3.5 bg-[#00BAE2]/10 border border-[#00BAE2]/25 rounded-2xl flex items-center justify-between text-[#00BAE2] font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    <span>Termos de Uso SaaS • Marco Civil da Internet (Lei 12.965/2014)</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#BBBAA6]">v4.0</span>
                </div>

                <p>
                  Bem-vindo ao <strong className="text-[#FFFCE1]">AdShield Intelligence OS</strong>. Somos uma ferramenta independente de análise técnica de sites, auditoria de catálogo, CRO e simulação de tráfego pago, sem qualquer vínculo societário ou comercial com as marcas inspecionadas.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">1.</span> Legalidade da Auditoria Técnica de Dados Públicos
                </h3>
                <p>
                  O AdShield opera exclusivamente sobre informações ostensivamente públicas (HTML renderizado no navegador, metadados abertos e feeds públicos como <code className="text-[#0AE448]">/products.json</code>). A plataforma <strong className="text-[#FFFCE1]">NÃO invade dispositivos nem quebra firewalls</strong>, sob a proteção do Art. 3º, VI do Marco Civil da Internet.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">2.</span> Protocolo de Grounding & Natureza Paramétrica das Simulações
                </h3>
                <p>
                  Dados técnicos de catálogo e DOM são extraídos ao vivo, enquanto cálculos financeiros (sangria estimada em anúncios, projeções de ROAS e ganho no Pix) são <strong className="text-[#FFFCE1]">simulações matemáticas baseadas em benchmarks de mercado</strong>, parametrizáveis pelo próprio usuário.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">3.</span> Independência Técnica & Uso Nominativo (LPI Art. 132, IV)
                </h3>
                <p>
                  O AdShield não possui vínculo com as lojas analisadas. Qualquer menção a domínios, plataformas (Shopify, VTEX, Nuvemshop) ou marcas em diagnósticos possui caráter estritamente técnico, descritivo e nominativo.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">4.</span> Direito de Arrependimento (CDC Art. 49) & Governança
                </h3>
                <p>
                  Garantia incondicional de reembolso integral em até 7 dias corridos da contratação inicial, em total conformidade com a legislação brasileira aplicável a softwares SaaS.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-white/10 bg-[#0E100F] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <Link
            to={isPrivacy ? '/privacy' : '/terms'}
            onClick={onClose}
            className="text-xs text-[#0AE448] hover:underline flex items-center gap-1.5 font-bold"
          >
            <span>Ler documento completo na íntegra</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md shadow-[#0AE448]/20"
          >
            Entendido e Ciente
          </button>
        </div>
      </div>
    </div>
  );
};
