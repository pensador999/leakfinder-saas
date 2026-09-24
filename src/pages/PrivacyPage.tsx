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
  Printer,
  Scale,
  AlertCircle,
  Database,
  UserCheck,
  RefreshCw,
  Globe2,
  Trash2
} from 'lucide-react';

export function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0E100F] font-sans text-[#FFFCE1] flex flex-col justify-between selection:bg-[#0AE448] selection:text-slate-950">
      
      {/* Top Navbar */}
      <header className="bg-[#101211] border-b border-white/10 sticky top-0 z-30 px-4 sm:px-8 py-4 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0AE448] flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-[#0AE448]/20">
                AS
              </div>
              <span className="font-extrabold text-[#FFFCE1] tracking-tight text-base">AdShield<span className="text-[#0AE448]">.ai</span></span>
            </Link>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-xs font-bold text-[#BBBAA6] hidden sm:inline font-mono">Governança de Dados & LGPD</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Imprimir documento em A4"
            >
              <Printer className="w-3.5 h-3.5 text-[#0AE448]" />
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
        <div className="bg-[#101211] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00BAE2]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0AE448]/10 border border-[#0AE448]/25 rounded-full text-[#0AE448] text-xs font-bold font-mono uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FFFCE1] tracking-tight">
            Política de Privacidade, Tratamento de Dados & DPO
          </h1>

          <p className="text-xs sm:text-sm text-[#BBBAA6] leading-relaxed max-w-3xl">
            Este documento formaliza as práticas transparentes de governança, coleta de metadados, bases legais de tratamento, protocolos de opt-out imediato e direitos dos titulares perante a <strong className="text-[#FFFCE1]">Autoridade Nacional de Proteção de Dados (ANPD)</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#BBBAA6] font-mono pt-3 border-t border-white/10">
            <span>Última Revisão: {new Date().toLocaleDateString('pt-BR')}</span>
            <span>•</span>
            <span>Criptografia: AES-256 & TLS 1.3</span>
            <span>•</span>
            <span className="text-[#0AE448]">Canal DPO: dpo@adshield.ai</span>
          </div>
        </div>

        {/* Legal Text Cards */}
        <div className="bg-[#101211] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10 text-[#BBBAA6] leading-relaxed text-sm">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">1.</span> Identificação do Controlador de Dados & Compromisso com a Privacidade
            </h2>
            <p>
              A presente Política de Privacidade regula o tratamento de informações e dados realizado pela plataforma <strong className="text-[#FFFCE1]">AdShield</strong>, de titularidade do <strong className="text-[#FFFCE1]">BRK GROUP TECNOLOGIA LTDA</strong>, sociedade inscrita no CNPJ sob o nº <strong className="text-[#FFFCE1]">52.894.218/0001-90</strong>, na condição de <strong className="text-[#FFFCE1]">Controladora de Dados</strong> nos termos do Art. 5º, inciso VI da Lei nº 13.709/2018 (LGPD).
            </p>
            <p>
              Nossa operação de software foi concebida sob os princípios do <em className="text-[#FFFCE1]">Privacy by Design</em> e <em className="text-[#FFFCE1]">Privacy by Default</em>, assegurando que o tratamento de dados se restrinja ao estritamente necessário para o cumprimento das finalidades legítimas de auditoria técnica e prevenção contra perdas operacionais no comércio eletrônico.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">2.</span> Distinção Fundamental: Dados de Pessoas Jurídicas vs. Dados Pessoais
            </h2>
            <p>
              Para plena clareza jurídica, o AdShield categoriza os dados processados em 3 frentes distintas:
            </p>

            <div className="grid grid-cols-1 gap-3.5">
              <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-1.5">
                <h4 className="font-bold text-[#FFFCE1] text-xs flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00BAE2]" /> 
                  A. Dados Comerciais Públicos de E-Commerce (Pessoas Jurídicas — Fora do Escopo da LGPD)
                </h4>
                <p className="text-xs text-[#BBBAA6] leading-relaxed">
                  O <strong className="text-[#FFFCE1]">Art. 5º, inciso I da LGPD</strong> define expressamente que dado pessoal é apenas a informação relacionada a <em>pessoa natural</em> identificada ou identificável. Informações de catálogo aberto de lojas virtuais (título de produtos, SKUs, variantes de tamanho, preços, fotos públicas, arquivos <code className="text-[#0AE448]">/products.json</code> e anúncios veiculados na Meta Ads Library) constituem dados estritamente mercadológicos de pessoas jurídicas, <strong className="text-[#FFFCE1]">não se submetendo ao regime de proteção de dados pessoais</strong>.
                </p>
              </div>

              <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-1.5">
                <h4 className="font-bold text-[#FFFCE1] text-xs flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0AE448]" /> 
                  B. Dados de Contato Comercial Publicizados no Rodapé do E-Commerce
                </h4>
                <p className="text-xs text-[#BBBAA6] leading-relaxed">
                  Em pequenos comércios eletrônicos onde o número de WhatsApp ou e-mail divulgado no rodapé corresponda ao contato pessoal do administrador, o AdShield ampara o envio do laudo técnico nas seguintes hipóteses legais expressas da LGPD:
                </p>
                <ul className="list-disc pl-5 text-xs text-[#BBBAA6] space-y-1 pt-1">
                  <li><strong className="text-[#FFFCE1]">Art. 7º, § 4º da LGPD:</strong> Dispensa de exigência de consentimento prévio para dados tornados manifestamente públicos pelo próprio titular (publicação aberta no rodapé do site para atendimento ao cliente e fins comerciais).</li>
                  <li><strong className="text-[#FFFCE1]">Art. 7º, inciso IX c/c Art. 10 da LGPD (Legítimo Interesse):</strong> O envio de alerta de quebra de estoque em anúncios ativos atende à finalidade legítima de apoio ao negócio do destinatário, com expectativa razoável de proteção patrimonial contra queima indevida de verba publicitária.</li>
                </ul>
              </div>

              <div className="p-4 bg-[#141716] border border-white/10 rounded-2xl space-y-1.5">
                <h4 className="font-bold text-[#FFFCE1] text-xs flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> 
                  C. Dados Cadastrais dos Usuários da Plataforma SaaS
                </h4>
                <p className="text-xs text-[#BBBAA6] leading-relaxed">
                  Coletamos nome, e-mail corporativo, CPF/CNPJ e dados cadastrais unicamente para criação de conta, emissão de Nota Fiscal de Serviços Eletrônica (NFS-e) e execução do contrato de subscrição (Art. 7º, inciso V da LGPD).
                </p>
              </div>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">3.</span> Mecanismo de Opt-Out Imediato & Blacklist Permanente de Descadastramento
            </h2>
            <p>
              O AdShield mantém política de tolerância zero a comunicações invasivas ou não desejadas. Asseguramos a qualquer comerciante o direito de interrupção instantânea e definitiva de qualquer notificação técnica ou de auditoria:
            </p>

            <div className="p-5 bg-[#00BAE2]/10 border border-[#00BAE2]/25 rounded-2xl space-y-3 text-xs">
              <p className="font-bold text-[#00BAE2] flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-[#00BAE2]" /> Como Acionar o Descadastramento em 1 Clique (Zero Fricção):
              </p>
              <div className="space-y-2 text-[#BBBAA6]">
                <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-start gap-2.5">
                  <span className="font-mono text-[#0AE448] font-bold shrink-0">Opção 1:</span>
                  <span>
                    <strong className="text-[#FFFCE1]">Via WhatsApp:</strong> Basta enviar a palavra <strong className="text-[#0AE448]">"PARAR"</strong> ou <strong className="text-[#0AE448]">"SAIR"</strong> como resposta. O número é imediatamente registrado em nossa tabela de <em>Blacklist Permanente</em> e nunca mais receberá nenhum contato automático.
                  </span>
                </div>

                <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-start gap-2.5">
                  <span className="font-mono text-[#0AE448] font-bold shrink-0">Opção 2:</span>
                  <span>
                    <strong className="text-[#FFFCE1]">Via E-mail do DPO:</strong> Envie mensagem para <strong className="text-[#00BAE2]">dpo@adshield.ai</strong> informando o domínio da loja ou telefone. A exclusão é processada no banco de dados em até 24 horas úteis.
                  </span>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">4.</span> Direitos do Titular de Dados Pessoais (Artigo 18 da LGPD)
            </h2>
            <p>
              Em estrita conformidade com a legislação federal, o titular de dados poderá, a qualquer momento e mediante requisição gratuita ao nosso Encarregado (DPO), solicitar:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3.5 bg-[#141716] border border-white/10 rounded-xl space-y-1">
                <strong className="text-[#FFFCE1] block">I. Confirmação e Acesso:</strong>
                <span className="text-[#BBBAA6]">Confirmação da existência de tratamento e fornecimento de cópia integral dos dados cadastrais tratados.</span>
              </div>
              <div className="p-3.5 bg-[#141716] border border-white/10 rounded-xl space-y-1">
                <strong className="text-[#FFFCE1] block">II. Correção e Retificação:</strong>
                <span className="text-[#BBBAA6]">Atualização de dados cadastrais incompletos, inexatos ou desatualizados.</span>
              </div>
              <div className="p-3.5 bg-[#141716] border border-white/10 rounded-xl space-y-1">
                <strong className="text-[#FFFCE1] block">III. Anonimização ou Eliminação:</strong>
                <span className="text-[#BBBAA6]">Exclusão definitiva de dados pessoais tratados com base em consentimento ou considerados excessivos.</span>
              </div>
              <div className="p-3.5 bg-[#141716] border border-white/10 rounded-xl space-y-1">
                <strong className="text-[#FFFCE1] block">IV. Revogação de Autorizações:</strong>
                <span className="text-[#BBBAA6]">Desconexão de tokens de API da Shopify, Meta Ads ou Google Ads com 1 clique direto no painel do usuário.</span>
              </div>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">5.</span> Segurança Cibernética, Armazenamento & Vedação de Venda de Dados
            </h2>
            <p>
              O AdShield adota padrões de segurança técnica e organizacional rigorosos para salvaguardar a integridade dos dados:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#BBBAA6]">
              <li>
                <strong className="text-[#FFFCE1]">Criptografia Militar:</strong> Todos os dados em trânsito são cifrados via TLS 1.3 (HTTPS de alta performance) e os dados em repouso no banco de dados são protegidos por criptografia simétrica AES-256.
              </li>
              <li>
                <strong className="text-[#FFFCE1]">Proibição Absoluta de Comercialização de Dados:</strong> O AdShield <strong className="text-[#FFFCE1]">NÃO VENDE, NÃO ALUGA E NÃO MONETIZA</strong> bases de dados, contatos ou informações de clientes com terceiros, agências de publicidade ou corretores de dados (<em className="text-[#FFFCE1]">data brokers</em>).
              </li>
              <li>
                <strong className="text-[#FFFCE1]">Privacidade das IAs e Isolamento Multi-Tenant:</strong> Dados privados de lojas conectadas via API jamais são compartilhados com outros clientes ou utilizados para treinar modelos abertos de inteligência artificial de domínio público.
              </li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">6.</span> Política de Cookies & Tecnologias de Monitoramento do Navegador
            </h2>
            <p>
              Utilizamos cookies e tecnologias similares estritamente necessárias para a autenticação de sessão, segurança contra ataques de Cross-Site Request Forgery (CSRF) e medição anônima de telemetria de performance da aplicação.
            </p>
            <p>
              O Usuário pode, a qualquer tempo, gerenciar ou recusar os cookies através das configurações do seu navegador ou através de nosso banner de preferências de privacidade.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">7.</span> Encarregado pelo Tratamento de Dados Pessoais (DPO)
            </h2>
            <p>
              Em estrito cumprimento ao <strong className="text-[#FFFCE1]">Artigo 41 da Lei nº 13.709/2018 (LGPD)</strong>, a Controladora nomeou formalmente seu Encarregado de Dados (DPO), que permanece à disposição para atendimento aos titulares e para interlocução oficial com a Autoridade Nacional de Proteção de Dados (ANPD):
            </p>
            
            <div className="p-5 bg-[#141716] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-[#BBBAA6]">
              <div className="p-3 bg-[#0AE448]/10 text-[#0AE448] rounded-xl border border-[#0AE448]/25 shrink-0">
                <Mail className="w-6 h-6 text-[#0AE448]" />
              </div>
              <div className="space-y-1">
                <p className="font-bold text-[#FFFCE1] text-sm">Encarregado pelo Tratamento de Dados Pessoais (DPO Oficial)</p>
                <p className="text-[#0AE448] font-mono font-bold text-xs">dpo@adshield.ai • privacidade@brkgroup.com.br</p>
                <p className="text-[11px] text-[#BBBAA6]/70">
                  Prazo regulamentar de resposta: em até 48 horas úteis para solicitações de titulares ou notificações da ANPD.
                </p>
              </div>
            </div>
          </section>

        </div>

      </main>

      {/* Footer em Conformidade com Decreto 7.962/2013 */}
      <footer className="bg-[#101211] border-t border-white/10 py-8 px-4 text-center text-xs text-[#BBBAA6] mt-12">
        <div className="max-w-4xl mx-auto space-y-2.5">
          <p className="font-bold text-[#FFFCE1] text-sm flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0AE448]" />
            AdShield • BRK GROUP TECNOLOGIA LTDA
          </p>
          <p className="text-[#BBBAA6] font-mono text-[11px]">
            CNPJ: 52.894.218/0001-90 • Sede: Minas Gerais, Brasil • Encarregado LGPD Nomeado
          </p>
          <div className="flex justify-center gap-4 text-[11px] text-[#BBBAA6] pt-1">
            <Link to="/terms" className="hover:text-[#0AE448] underline">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-[#0AE448] underline font-bold text-[#0AE448]">Política de Privacidade & LGPD</Link>
            <Link to="/about" className="hover:text-[#0AE448] underline">Quem Somos</Link>
          </div>
          <p className="text-[10px] text-[#BBBAA6]/60">
            © {new Date().getFullYear()} AdShield. Todos os direitos reservados. Conformidade estrita com a Lei 13.709/2018 e diretrizes da ANPD.
          </p>
        </div>
      </footer>

    </div>
  );
}
