import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  KeyRound, 
  EyeOff, 
  Server, 
  FileText,
  Mail,
  Printer
} from 'lucide-react';

export function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col justify-between">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-600/20">
                LF
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">LeakFinder<span className="text-blue-600">.ai</span></span>
            </Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline font-mono">Privacidade & LGPD</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir Política</span>
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 w-full space-y-8">
        
        {/* Header Hero Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-bold font-mono uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Política de Privacidade & Segurança de Dados
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
            <span>Última Atualização: {new Date().toLocaleDateString('pt-BR')}</span>
            <span>•</span>
            <span>Criptografia: AES-256 & TLS 1.3</span>
          </div>
        </div>

        {/* Legal Text Cards */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">1.</span> Compromisso com a Privacidade
            </h2>
            <p>
              O <strong>LeakFinder</strong> valoriza e respeita a privacidade de cada cliente e visitante. Esta Política de Privacidade explica de forma transparente como coletamos, utilizamos, armazenamos e protegemos as informações fornecidas por você e os dados públicos auditados em nossa plataforma.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">2.</span> Quais Dados Coletamos e Como os Utilizamos
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> 1. Dados Públicos do E-Commerce (Auditoria Não-Intrusiva)
                </h4>
                <p className="text-xs text-slate-600">
                  Coletamos apenas informações publicamente acessíveis na loja online: títulos de produtos, URLs, imagens públicas, disponibilidade de tamanhos no DOM e scripts instalados no cabeçalho HTML.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> 2. Dados de Cadastro do Usuário
                </h4>
                <p className="text-xs text-slate-600">
                  Nome, e-mail corporativo e dados para emissão de relatórios white-label (marca e WhatsApp de contato). Estes dados são utilizados unicamente para personalizar seus relatórios e viabilizar o acesso à plataforma.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-600" /> 3. Integrações de APIs Oficiais (Read-Only)
                </h4>
                <p className="text-xs text-slate-600">
                  Quando você decide conectar integrações como Shopify Admin ou Meta Ads, os tokens recebem permissão exclusiva de <strong>Somente Leitura (Read-Only)</strong>. O LeakFinder <strong>nunca altera preços, produtos ou estoque</strong>.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">3.</span> Segurança, Criptografia & Sigilo Absoluto
            </h2>
            <p>
              Adotamos os mais rigorosos padrões de segurança da informação do mercado:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Criptografia em Trânsito e Repouso:</strong> Todas as comunicações utilizam protocolos TLS 1.3 e criptografia AES-256 no banco de dados.</li>
              <li><strong>Não-Compartilhamento de Dados:</strong> O LeakFinder <strong>nunca vende, aluga ou transfere</strong> dados da sua operação para terceiros, concorrentes ou corretores de dados.</li>
              <li><strong>Zero Treinamento Público com Dados Privados:</strong> Suas métricas confidenciais de faturamento jamais são utilizadas para treinar modelos públicos de IA.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">4.</span> Direitos do Titular de Dados (Art. 18 da LGPD)
            </h2>
            <p>Você possui total controle sobre seus dados pessoais, podendo a qualquer momento solicitar:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Confirmação da existência de tratamento e acesso aos dados.</li>
              <li>Correção de dados incompletos ou inexatos.</li>
              <li>Eliminação completa e irrevogável de seus dados de nossa base.</li>
              <li>Revogação instantânea de consentimento e tokens de integração.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">5.</span> Contato do Encarregado de Proteção de Dados (DPO)
            </h2>
            <p>
              Para exercer qualquer um de seus direitos ou esclarecer dúvidas sobre este documento, entre em contato diretamente com o nosso Encarregado de Proteção de Dados (DPO):
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-xs text-slate-700">
              <Mail className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Encarregado de Proteção de Dados (DPO) - LeakFinder</p>
                <p className="text-slate-500 font-mono">dpo@leakfinder.ai | privacidade@brkgroup.com.br</p>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-bold text-slate-700">LeakFinder SaaS • Ecossistema BRK Group</p>
          <div className="flex justify-center gap-4 text-[11px] text-slate-500">
            <Link to="/terms" className="hover:text-blue-600 underline">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-blue-600 underline">Política de Privacidade</Link>
            <Link to="/about" className="hover:text-blue-600 underline">Quem Somos</Link>
          </div>
          <p className="text-[10px] text-slate-400">© {new Date().getFullYear()} LeakFinder. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
