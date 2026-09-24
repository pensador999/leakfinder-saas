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
                {isPrivacy ? 'Governança de Privacidade & LGPD' : 'Termos de Uso & Condições Gerais'}
              </h2>
              <p className="text-[11px] text-[#BBBAA6] font-mono">
                AdShield OS • BRK GROUP TECNOLOGIA LTDA (CNPJ 52.894.218/0001-90)
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
                  <span className="font-mono text-[10px] text-[#BBBAA6]">v3.2</span>
                </div>

                <p>
                  O <strong className="text-[#FFFCE1]">AdShield</strong> (operado por BRK GROUP TECNOLOGIA LTDA) atua sob princípios inquebráveis de transparência, privacidade e integridade no tratamento de metadados de e-commerce e informações cadastrais.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">1.</span> Dados de Pessoa Jurídica vs. Dados Pessoais (Art. 5º, I)
                </h3>
                <p>
                  A legislação brasileira protege dados de <em>pessoas naturais</em>. Informações públicas de lojas virtuais (catálogos, SKUs, variantes de estoque, preços, URLs e anúncios públicos no Meta Ads) são dados mercadológicos de pessoas jurídicas e não configuram dados pessoais.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">2.</span> Base Legal para Notificações B2B (Art. 7º, §4º e IX)
                </h3>
                <p>
                  Notificações de auditoria enviadas a contatos comerciais publicizados no rodapé do e-commerce amparam-se no <strong className="text-[#FFFCE1]">Art. 7º, §4º</strong> (dados manifestamente públicos pelo titular) e no <strong className="text-[#FFFCE1]">Legítimo Interesse (Art. 7º, IX c/c Art. 10 da LGPD)</strong> de prevenção contra perdas financeiras na operação do lojista.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">3.</span> Opt-Out Instantâneo & Blacklist Perpétua
                </h3>
                <p>
                  Qualquer lojista pode interromper contatos imediatamente respondendo <strong className="text-[#0AE448]">"PARAR"</strong> no WhatsApp ou enviando solicitação para <strong className="text-[#00BAE2]">dpo@adshield.ai</strong>. O número é inserido em Blacklist Permanente em até 24 horas úteis.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">4.</span> Canal Oficial do DPO / Encarregado (Art. 41 LGPD)
                </h3>
                <div className="p-3 bg-[#141716] border border-white/10 rounded-xl flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#0AE448] shrink-0" />
                  <div>
                    <strong className="text-[#FFFCE1] block">Encarregado de Proteção de Dados:</strong>
                    <span className="text-[#00BAE2] font-mono">dpo@adshield.ai • privacidade@brkgroup.com.br</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-3.5 bg-[#00BAE2]/10 border border-[#00BAE2]/25 rounded-2xl flex items-center justify-between text-[#00BAE2] font-bold text-xs">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4" />
                    <span>Contrato Vinculante • Marco Civil da Internet (Lei 12.965/2014)</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#BBBAA6]">v3.2</span>
                </div>

                <p>
                  Bem-vindo ao <strong className="text-[#FFFCE1]">AdShield OS</strong>. O uso da plataforma implica aceitação integral e irrestrita destas Condições Gerais de Contratação SaaS.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">1.</span> Legalidade da Auditoria Técnica de Dados Públicos
                </h3>
                <p>
                  O AdShield opera exclusivamente sobre informações ostensivamente públicas (HTML renderizado no navegador, metadados abertos e feeds públicos como <code className="text-[#0AE448]">/products.json</code>). A plataforma <strong className="text-[#FFFCE1]">NÃO invade dispositivos nem quebra firewalls</strong>, afastando a tipicidade do Art. 154-A do Código Penal, sob a proteção do Art. 3º, VI do Marco Civil da Internet e jurisprudência pacificada do STJ.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">2.</span> Limitação de Responsabilidade Civil & Grounding (Código Civil Arts. 421/421-A)
                </h3>
                <p>
                  Todo cálculo financeiro (sangria em anúncios, projeção de ganho com Pix) é <strong className="text-[#FFFCE1]">estritamente paramétrico e estimativo</strong>. O AdShield <strong className="text-[#FFFCE1]">não garante faturamento mínimo</strong> nem se responsabiliza por decisões comerciais, lucros cessantes ou flutuações de leilão de mídia tomada pelo contratante.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">3.</span> Uso Nominativo de Marcas de Terceiros (LPI Art. 132, IV)
                </h3>
                <p>
                  A citação de marcas em relatórios comparativos tem natureza estritamente referencial e de compatibilidade mercadológica, sem intenção de apropriação ou concorrência desleal.
                </p>

                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2 flex items-center gap-2">
                  <span className="text-[#0AE448] font-mono">4.</span> Arrependimento de 7 Dias (CDC Art. 49) & Foro de Eleição
                </h3>
                <p>
                  Garantia incondicional de reembolso integral em até 7 dias corridos da assinatura inicial. Foro exclusivo eleito da Comarca da sede da empresa em Minas Gerais, Brasil.
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
