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
                AS
              </div>
              <span className="font-extrabold text-slate-900 tracking-tight text-base">AdShield<span className="text-blue-600">.ai</span></span>
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
              <span className="text-blue-600 font-mono">1.</span> Compromisso Institucional & Controladora dos Dados
            </h2>
            <p>
              O <strong>AdShield / LeakFinder</strong>, operado pela <strong>BRK GROUP TECNOLOGIA LTDA</strong> (CNPJ nº 52.894.218/0001-90), atua com compromisso inegociável em relação à transparência, segurança cibernética e privacidade.
            </p>
            <p>
              Esta Política de Privacidade disciplina o tratamento de dados em nossa plataforma SaaS, em estrita conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD)</strong>, com o <strong>Marco Civil da Internet (Lei nº 12.965/2014)</strong> e com os enunciados orientativos da <strong>Autoridade Nacional de Proteção de Dados (ANPD)</strong>.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">2.</span> Distinção Fundamental: Dados de Pessoas Jurídicas vs. Dados Pessoais
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> 1. Dados Públicos Comerciais (Pessoas Jurídicas — Fora do Escopo da LGPD)
                </h4>
                <p className="text-xs text-slate-600">
                  Em conformidade com o <strong>Art. 5º, inciso I da LGPD</strong>, a legislação protege exclusivamente dados de <em>pessoas naturais</em>. Informações públicas de e-commerces (títulos de produtos, SKUs, preços, catálogo aberto, tags HTML públicas, CNPJ e Razão Social) são dados eminentemente comerciais de pessoas jurídicas e <strong>não constituem dados pessoais</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> 2. Dados de Contato Comercial Publicizados no Rodapé
                </h4>
                <p className="text-xs text-slate-600">
                  Em lojas virtuais onde o e-mail ou WhatsApp corporativo corresponda ao contato direto do administrador (como MEIs), o tratamento desses dados para envio de notificações de auditoria técnica é amparado pelo <strong>Art. 7º, § 4º</strong> (dados manifestamente tornados públicos pelo próprio titular para fins de contato comercial) e pelo <strong>Art. 7º, inciso IX da LGPD (Legítimo Interesse)</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" /> 3. Dados Cadastrais dos Usuários da Plataforma
                </h4>
                <p className="text-xs text-slate-600">
                  Coletamos nome, e-mail corporativo e dados para emissão de nota fiscal (NFS-e) e personalização de relatórios white-label. Estes dados são tratados com a finalidade exclusiva de execução de contrato (Art. 7º, V da LGPD).
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">3.</span> Política de Opt-Out Imediato & Blacklist de Prospecção
            </h2>
            <p>
              O AdShield repudia veementemente práticas de spam e disparos abusivos. Caso sua loja tenha sido objeto de auditoria e você não deseje receber novas comunicações ou relatórios técnicos:
            </p>
            <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs text-blue-900 space-y-2">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> Como Solicitar a Exclusão Definitiva (Descadastramento em 1 Clique):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-blue-800">
                <li><strong>Via WhatsApp:</strong> Basta responder <strong>"PARAR"</strong> ou <strong>"SAIR"</strong> à mensagem recebida. Nosso sistema inclui automaticamente o número em nossa tabela de <em>Blacklist Permanente</em>.</li>
                <li><strong>Via E-mail:</strong> Envie solicitação para <strong>dpo@adshield.ai</strong> com a URL da loja ou número de contato. O bloqueio é processado em até 24 horas úteis.</li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">4.</span> Direitos dos Titulares de Dados (Art. 18 da LGPD)
            </h2>
            <p>Você pode, a qualquer momento e de forma gratuita, exercer seus direitos legalmente garantidos:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Confirmação e Acesso:</strong> Obter a confirmação de que tratamos seus dados e solicitar cópia integral.</li>
              <li><strong>Correção:</strong> Solicitar a atualização de dados incompletos, inexatos ou desatualizados.</li>
              <li><strong>Anonimização, Bloqueio ou Eliminação:</strong> Solicitar a exclusão definitiva de seus dados cadastrais.</li>
              <li><strong>Revogação do Consentimento:</strong> Revogar autorizações previamente concedidas para integrações de API.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">5.</span> Segurança da Informação & Não-Compartilhamento
            </h2>
            <p>
              Adotamos medidas técnicas e administrativas aptas a proteger seus dados contra acessos não autorizados e situações acidentais ou ilícitas:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Criptografia em Repouso e em Trânsito:</strong> Criptografia de ponta a ponta com protocolos TLS 1.3 e banco de dados com AES-256.</li>
              <li><strong>Vedação de Venda de Dados:</strong> O AdShield <strong>JAMAIS vende, aluga ou monetiza</strong> dados de clientes ou dados auditados para terceiros ou corretores de dados (data brokers).</li>
              <li><strong>Isolamento de Tenants:</strong> Relatórios executivos e simulações internas são estritamente isolados por conta e não são utilizados para treinar modelos públicos de inteligência artificial.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">6.</span> Encarregado de Proteção de Dados (DPO)
            </h2>
            <p>
              Em observância ao <strong>Art. 41 da LGPD</strong>, nomeamos nosso Encarregado pelo Tratamento de Dados Pessoais (Data Protection Officer - DPO), que atua como canal direto de comunicação entre os titulares de dados, a empresa e a Autoridade Nacional de Proteção de Dados (ANPD):
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-xs text-slate-700">
              <Mail className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <p className="font-bold text-slate-900">Encarregado pelo Tratamento de Dados Pessoais (DPO)</p>
                <p className="text-slate-600 font-mono">dpo@adshield.ai • privacidade@brkgroup.com.br</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Prazo regulamentar de resposta: até 48 horas úteis.</p>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Footer em Conformidade com Decreto 7.962/2013 */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-bold text-slate-800 text-sm">AdShield • BRK GROUP TECNOLOGIA LTDA</p>
          <p className="text-slate-500 font-mono text-[11px]">CNPJ: 52.894.218/0001-90 • Sede: Minas Gerais, Brasil</p>
          <div className="flex justify-center gap-4 text-[11px] text-slate-500 pt-1">
            <Link to="/terms" className="hover:text-blue-600 underline">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-blue-600 underline font-bold">Política de Privacidade & LGPD</Link>
            <Link to="/about" className="hover:text-blue-600 underline">Quem Somos</Link>
          </div>
          <p className="text-[10px] text-slate-400">© {new Date().getFullYear()} AdShield. Todos os direitos reservados. Conformidade estrita com a Lei 13.709/2018.</p>
        </div>
      </footer>

    </div>
  );
}
