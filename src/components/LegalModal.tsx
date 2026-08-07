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
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col animate-scale-in">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              {isPrivacy ? <Shield className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {isPrivacy ? 'Política de Privacidade' : 'Termos de Uso'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <div className="prose prose-slate prose-sm max-w-none">
            {isPrivacy ? (
              <>
                <p><strong>Última atualização: [Data Atual]</strong></p>
                <p>
                  A LeakFinder respeita a sua privacidade. Esta Política de Privacidade explica como coletamos, 
                  usamos, divulgamos e protegemos as suas informações quando você visita nosso site e utiliza nosso serviço SaaS de auditoria.
                </p>
                <h3>1. Informações que Coletamos</h3>
                <p>
                  Coletamos informações pessoais que você nos fornece voluntariamente ao se registrar no site, 
                  expressar interesse em obter informações sobre nós ou nossos produtos, e ao usar nossos serviços.
                </p>
                <h3>2. Uso das Suas Informações</h3>
                <p>
                  Utilizamos informações pessoais coletadas através do nosso site para diversos fins comerciais 
                  descritos abaixo, como fornecer os serviços de auditoria, melhorar a plataforma e comunicação de suporte.
                </p>
                <h3>3. Compartilhamento de Informações</h3>
                <p>
                  A LeakFinder não vende, aluga ou compartilha suas informações pessoais com terceiros não 
                  relacionados para fins de marketing sem seu consentimento explícito.
                </p>
                <p className="text-slate-400 italic mt-8">
                  * Este é um texto modelo (placeholder). Substitua pelo seu texto jurídico definitivo e preencha os dados da empresa.
                </p>
              </>
            ) : (
              <>
                <p><strong>Última atualização: [Data Atual]</strong></p>
                <p>
                  Bem-vindo à LeakFinder. Estes Termos de Uso regem o seu acesso e uso do nosso 
                  aplicativo e site (o "Serviço").
                </p>
                <h3>1. Aceitação dos Termos</h3>
                <p>
                  Ao acessar ou usar o Serviço, você concorda em ficar vinculado a estes Termos. Se você discordar de qualquer parte dos termos, não poderá acessar o Serviço.
                </p>
                <h3>2. Uso do Serviço</h3>
                <p>
                  Você concorda em usar a plataforma LeakFinder apenas para fins legais e de acordo com as diretrizes do sistema. É estritamente proibido o uso de nossos crawlers para ataques de negação de serviço ou engenharia reversa.
                </p>
                <h3>3. Propriedade Intelectual</h3>
                <p>
                  O Serviço e seu conteúdo original, recursos e funcionalidade são e continuarão sendo propriedade exclusiva da LeakFinder e de seus licenciadores.
                </p>
                <h3>4. Limitação de Responsabilidade</h3>
                <p>
                  Em nenhuma circunstância a LeakFinder, nem seus diretores, funcionários ou agentes, 
                  serão responsabilizados por quaisquer danos indiretos, incidentais ou punitivos, incluindo, sem limitação, perda de lucros, dados ou uso, decorrentes do uso das auditorias geradas.
                </p>
                <p className="text-slate-400 italic mt-8">
                  * Este é um texto modelo (placeholder). Substitua pelo seu texto jurídico definitivo e preencha os dados da empresa.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
