import React from 'react';
import { X, FileText, Shield } from 'lucide-react';

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
      <div className="bg-[#101211] border border-white/10 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-scale-in text-[#FFFCE1]">
        <div className="p-6 border-b border-white/10 bg-[#0E100F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/25 rounded-xl">
              {isPrivacy ? <Shield className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <h2 className="text-lg font-bold text-[#FFFCE1]">
              {isPrivacy ? 'Política de Privacidade' : 'Termos de Uso'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#BBBAA6] hover:text-[#FFFCE1] hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-xs">
          <div className="space-y-4 text-[#BBBAA6] leading-relaxed">
            {isPrivacy ? (
              <>
                <p className="text-[#FFFCE1] font-bold">Última atualização: 2026</p>
                <p>
                  O AdShield respeita a sua privacidade. Esta Política de Privacidade explica como coletamos, 
                  usamos, divulgamos e protegemos as suas informações quando você visita nosso site e utiliza nosso serviço SaaS de auditoria.
                </p>
                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2">1. Informações que Coletamos</h3>
                <p>
                  Coletamos informações técnicas públicas de catálogo (HTML/DOM, APIs abertas de e-commerce e Meta Ads Library) e informações fornecidas voluntariamente ao conectar integrações ou solicitar relatórios.
                </p>
                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2">2. Uso das Suas Informações</h3>
                <p>
                  Utilizamos informações coletadas estritamente para fornecer diagnósticos de CRO, auditoria de estoque fantasma, detecção de quebra de conformidade legal CDC e prevenção de desperdício em mídia paga.
                </p>
                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2">3. Compartilhamento de Informações</h3>
                <p>
                  O AdShield não vende, aluga ou compartilha suas informações pessoais ou dados da sua loja com terceiros para fins de marketing sem seu consentimento explícito.
                </p>
                <p className="text-[#BBBAA6]/60 italic mt-8 text-[11px]">
                  * Documento em estrita conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018).
                </p>
              </>
            ) : (
              <>
                <p className="text-[#FFFCE1] font-bold">Última atualização: 2026</p>
                <p>
                  Bem-vindo ao AdShield OS. Estes Termos de Uso regem o seu acesso e uso do nosso 
                  software e serviços de auditoria de e-commerce.
                </p>
                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2">1. Aceitação dos Termos</h3>
                <p>
                  Ao acessar ou usar a plataforma, você concorda em ficar vinculado a estes Termos. Se você discordar de qualquer parte dos termos, não poderá acessar o Serviço.
                </p>
                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2">2. Uso do Serviço</h3>
                <p>
                  Você concorda em usar o AdShield apenas para fins legítimos de diagnóstico e otimização de negócios e-commerce. É estritamente proibido o uso de automações para ataques de negação de serviço ou violação de propriedade intelectual.
                </p>
                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2">3. Propriedade Intelectual</h3>
                <p>
                  A plataforma AdShield, seus algoritmos de auditoria, heurísticas do Enxame de Agentes e design system Obsidian são propriedade exclusiva do AdShield OS e seus licenciadores.
                </p>
                <h3 className="text-sm font-bold text-[#FFFCE1] pt-2">4. Limitação de Responsabilidade</h3>
                <p>
                  O AdShield fornece diagnósticos com embasamento técnico auditado (Grounding Absoluto). Decisões de investimento em mídia e gestão de estoque físico são de responsabilidade operacional da loja.
                </p>
                <p className="text-[#BBBAA6]/60 italic mt-8 text-[11px]">
                  * Em conformidade com o Código de Defesa do Consumidor e Marco Civil da Internet.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-[#0E100F] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
