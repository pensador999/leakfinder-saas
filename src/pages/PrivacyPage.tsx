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
    <div className="min-h-screen bg-[#0E100F] font-sans text-[#FFFCE1] flex flex-col justify-between">
      
      {/* Top Navbar */}
      <header className="bg-[#101211] border-b border-white/10 sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0AE448] flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-[#0AE448]/20">
                AS
              </div>
              <span className="font-extrabold text-[#FFFCE1] tracking-tight text-base">AdShield<span className="text-[#0AE448]">.ai</span></span>
            </Link>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-xs font-bold text-[#BBBAA6] hidden sm:inline font-mono">Privacidade & LGPD</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir Política</span>
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="px-3.5 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#0AE448]/20"
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
        <div className="bg-[#101211] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0AE448]/10 border border-[#0AE448]/25 rounded-full text-[#0AE448] text-xs font-bold font-mono uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FFFCE1] tracking-tight">
            Política de Privacidade & Segurança de Dados
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#BBBAA6] font-mono pt-2 border-t border-white/10">
            <span>Última Atualização: {new Date().toLocaleDateString('pt-BR')}</span>
            <span>•</span>
            <span>Criptografia: AES-256 & TLS 1.3</span>
          </div>
        </div>

        {/* Legal Text Cards */}
        <div className="bg-[#101211] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 text-[#BBBAA6] leading-relaxed text-sm">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">1.</span> Compromisso Institucional & Controladora dos Dados
            </h2>
            <p>
              O <strong className="text-[#FFFCE1]">AdShield</strong>, operado pela <strong className="text-[#FFFCE1]">BRK GROUP TECNOLOGIA LTDA</strong> (CNPJ nº 52.894.218/0001-90), atua com compromisso inegociável em relação à transparência, segurança cibernética e privacidade.
            </p>
            <p>
              Esta Política de Privacidade disciplina o tratamento de dados em nossa plataforma SaaS, em estrita conformidade com a <strong className="text-[#FFFCE1]">Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD)</strong>, com o <strong className="text-[#FFFCE1]">Marco Civil da Internet (Lei nº 12.965/2014)</strong> e com os enunciados orientativos da <strong className="text-[#FFFCE1]">Autoridade Nacional de Proteção de Dados (ANPD)</strong>.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">2.</span> Distinção Fundamental: Dados de Pessoas Jurídicas vs. Dados Pessoais
            </h2>
            <div className="space-y-3">
              <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-1">
                <h4 className="font-bold text-[#FFFCE1] text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00BAE2]" /> 1. Dados Públicos Comerciais (Pessoas Jurídicas — Fora do Escopo da LGPD)
                </h4>
                <p className="text-xs text-[#BBBAA6]">
                  Em conformidade com o <strong className="text-[#FFFCE1]">Art. 5º, inciso I da LGPD</strong>, a legislação protege exclusivamente dados de <em>pessoas naturais</em>. Informações públicas de e-commerces (títulos de produtos, SKUs, preços, catálogo aberto, tags HTML públicas, CNPJ e Razão Social) são dados eminentemente comerciais de pessoas jurídicas e <strong className="text-[#FFFCE1]">não constituem dados pessoais</strong>.
                </p>
              </div>

              <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-1">
                <h4 className="font-bold text-[#FFFCE1] text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0AE448]" /> 2. Dados de Contato Comercial Publicizados no Rodapé
                </h4>
                <p className="text-xs text-[#BBBAA6]">
                  Em lojas virtuais onde o e-mail ou WhatsApp corporativo corresponda ao contato direto do administrador (como MEIs), o tratamento desses dados para envio de notificações de auditoria técnica é amparado pelo <strong className="text-[#FFFCE1]">Art. 7º, § 4º</strong> (dados manifestamente tornados públicos pelo próprio titular para fins de contato comercial) e pelo <strong className="text-[#FFFCE1]">Art. 7º, inciso IX da LGPD (Legítimo Interesse)</strong>.
                </p>
              </div>

              <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-1">
                <h4 className="font-bold text-[#FFFCE1] text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" /> 3. Dados Cadastrais dos Usuários da Plataforma
                </h4>
                <p className="text-xs text-[#BBBAA6]">
                  Coletamos nome, e-mail corporativo e dados para emissão de nota fiscal (NFS-e) e personalização de relatórios white-label. Estes dados são tratados com a finalidade exclusiva de execução de contrato (Art. 7º, V da LGPD).
                </p>
              </div>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">3.</span> Política de Opt-Out Imediato & Blacklist de Prospecção
            </h2>
            <p>
              O AdShield repudia veementemente práticas de spam e disparos abusivos. Caso sua loja tenha sido objeto de auditoria e você não deseje receber novas comunicações ou relatórios técnicos:
            </p>
            <div className="p-4 bg-[#00BAE2]/10 border border-[#00BAE2]/25 rounded-2xl text-xs text-[#FFFCE1] space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-[#00BAE2]">
                <CheckCircle2 className="w-4 h-4 text-[#00BAE2]" /> Como Solicitar a Exclusão Definitiva (Descadastramento em 1 Clique):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#BBBAA6]">
                <li><strong className="text-[#FFFCE1]">Via WhatsApp:</strong> Basta responder <strong className="text-[#FFFCE1]">"PARAR"</strong> ou <strong className="text-[#FFFCE1]">"SAIR"</strong> à mensagem recebida. Nosso sistema inclui automaticamente o número em nossa tabela de <em>Blacklist Permanente</em>.</li>
                <li><strong className="text-[#FFFCE1]">Via E-mail:</strong> Envie solicitação para <strong className="text-[#00BAE2]">dpo@adshield.ai</strong> com a URL da loja ou número de contato. O bloqueio é processado em até 24 horas úteis.</li>
              </ul>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">4.</span> Direitos dos Titulares de Dados (Art. 18 da LGPD)
            </h2>
            <p>Você pode, a qualquer momento e de forma gratuita, exercer seus direitos legalmente garantidos:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#BBBAA6]">
              <li><strong className="text-[#FFFCE1]">Confirmação e Acesso:</strong> Obter a confirmação de que tratamos seus dados e solicitar cópia integral.</li>
              <li><strong className="text-[#FFFCE1]">Correção:</strong> Solicitar a atualização de dados incompletos, inexatos ou desatualizados.</li>
              <li><strong className="text-[#FFFCE1]">Anonimização, Bloqueio ou Eliminação:</strong> Solicitar a exclusão definitiva de seus dados cadastrais.</li>
              <li><strong className="text-[#FFFCE1]">Revogação do Consentimento:</strong> Revogar autorizações previamente concedidas para integrações de API.</li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">5.</span> Segurança da Informação & Não-Compartilhamento
            </h2>
            <p>
              Adotamos medidas técnicas e administrativas aptas a proteger seus dados contra acessos não autorizados e situações acidentais ou ilícitas:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#BBBAA6]">
              <li><strong className="text-[#FFFCE1]">Criptografia em Repouso e em Trânsito:</strong> Criptografia de ponta a ponta com protocolos TLS 1.3 e banco de dados com AES-256.</li>
              <li><strong className="text-[#FFFCE1]">Vedação de Venda de Dados:</strong> O AdShield <strong className="text-[#FFFCE1]">JAMAIS vende, aluga ou monetiza</strong> dados de clientes ou dados auditados para terceiros ou corretores de dados (data brokers).</li>
              <li><strong className="text-[#FFFCE1]">Isolamento de Tenants:</strong> Relatórios executivos e simulações internas são estritamente isolados por conta e não são utilizados para treinar modelos públicos de inteligência artificial.</li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">6.</span> Encarregado de Proteção de Dados (DPO)
            </h2>
            <p>
              Em observância ao <strong className="text-[#FFFCE1]">Art. 41 da LGPD</strong>, nomeamos nosso Encarregado pelo Tratamento de Dados Pessoais (Data Protection Officer - DPO), que atua como canal direto de comunicação entre os titulares de dados, a empresa e a Autoridade Nacional de Proteção de Dados (ANPD):
            </p>
            <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl flex items-center gap-3 text-xs text-[#BBBAA6]">
              <Mail className="w-6 h-6 text-[#0AE448] shrink-0" />
              <div>
                <p className="font-bold text-[#FFFCE1]">Encarregado pelo Tratamento de Dados Pessoais (DPO)</p>
                <p className="text-[#00BAE2] font-mono">dpo@adshield.ai • privacidade@brkgroup.com.br</p>
                <p className="text-[11px] text-[#BBBAA6]/60 mt-0.5">Prazo regulamentar de resposta: até 48 horas úteis.</p>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Footer em Conformidade com Decreto 7.962/2013 */}
      <footer className="bg-[#101211] border-t border-white/10 py-8 px-4 text-center text-xs text-[#BBBAA6] mt-12">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-bold text-[#FFFCE1] text-sm">AdShield • BRK GROUP TECNOLOGIA LTDA</p>
          <p className="text-[#BBBAA6] font-mono text-[11px]">CNPJ: 52.894.218/0001-90 • Sede: Minas Gerais, Brasil</p>
          <div className="flex justify-center gap-4 text-[11px] text-[#BBBAA6] pt-1">
            <Link to="/terms" className="hover:text-[#0AE448] underline">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-[#0AE448] underline font-bold">Política de Privacidade & LGPD</Link>
            <Link to="/about" className="hover:text-[#0AE448] underline">Quem Somos</Link>
          </div>
          <p className="text-[10px] text-[#BBBAA6]/60">© {new Date().getFullYear()} AdShield. Todos os direitos reservados. Conformidade estrita com a Lei 13.709/2018.</p>
        </div>
      </footer>

    </div>
  );
}
