import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Scale, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Building2,
  Phone,
  Mail,
  Printer
} from 'lucide-react';

export function TermsPage() {
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
            <span className="text-xs font-bold text-slate-500 hidden sm:inline font-mono">Termos de Uso</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Imprimir Termos</span>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-800 text-xs font-bold font-mono uppercase">
            <Scale className="w-3.5 h-3.5" />
            <span>Instrumento Jurídico Vinculante</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Termos de Uso & Condições Gerais
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
            <span>Última Atualização: {new Date().toLocaleDateString('pt-BR')}</span>
            <span>•</span>
            <span>Versão: 2.4 (Conformidade Marco Civil & CDC)</span>
          </div>
        </div>

        {/* Legal Text Cards */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 text-slate-700 leading-relaxed text-sm">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">1.</span> Objeto, Qualificação das Partes e Aceitação Vinculante
            </h2>
            <p>
              Estes Termos de Uso e Condições Gerais regem a utilização da plataforma tecnológica <strong>AdShield / LeakFinder</strong>, provida pelo <strong>BRK GROUP TECNOLOGIA LTDA</strong> (doravante denominado "AdShield"), sociedade empresária devidamente constituída sob as leis do Brasil, inscrita no CNPJ sob o nº <strong>52.894.218/0001-90</strong>.
            </p>
            <p>
              Ao criar uma conta, navegar, auditar URLs ou contratar quaisquer planos, você (doravante "Usuário" ou "Contratante") declara ciência inequívoca e aceitação integral e irrestrita deste instrumento e da nossa Política de Privacidade. Caso discorde de qualquer cláusula, abstenha-se de utilizar a plataforma.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">2.</span> Escopo Técnico dos Serviços & Mecanismo de Auditoria
            </h2>
            <p>
              O AdShield disponibiliza ferramentas SaaS de diagnóstico analítico de conversão, catalogação de e-commerce, acessibilidade visual e inteligência concorrencial. Nossos motores operam estritamente por meio de:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Inspeção Pública de DOM e Metadados:</strong> Requisições HTTP/HTTPS a elementos abertos ao público na World Wide Web (código-fonte HTML público, CSS, imagens e endpoints abertos como <code>/products.json</code>).</li>
              <li><strong>Visão Computacional & Acessibilidade:</strong> Simulação de contraste cromático conforme padrões internacionais WCAG 2.1 AAA e ergonomia de interfaces mobile.</li>
              <li><strong>Auditoria de Marketplace:</strong> Diagnósticos de SEO algorítmico de títulos, fichas técnicas e Buy Box para plataformas como Shopee, Mercado Livre e Amazon.</li>
            </ul>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">🔒 Salvaguarda Anti-Intrusão (Art. 154-A do Código Penal):</p>
              <p>
                O AdShield <strong>NÃO</strong> viola firewalls, não quebra credenciais de acesso restrito, não realiza engenharia reversa de bancos de dados internos e não acessa áreas administrativas privadas (como painel restrito da Shopify Admin ou servidores de checkout) sem expressa autorização e fornecimento de token oficial via API pelo próprio Usuário.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">3.</span> Protocolo de Grounding, Limitação de Responsabilidade & Não-Garantia de Faturamento
            </h2>
            <p>
              Nossa tecnologia é regida pelo <strong>Protocolo de Grounding Absoluto</strong>. Os dados observáveis (URLs ativas, SKUs cadastrados, tamanhos disponíveis na grade e tags instaladas) refletem fielmente o estado do código público no momento exato da consulta.
            </p>
            <div className="p-4 bg-amber-50/80 border border-amber-300 rounded-2xl text-xs text-amber-950 space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" /> CLÁUSULA EXPRESSA DE LIMITAÇÃO DE RESPONSABILIDADE:
              </p>
              <p>
                Todo e qualquer valor monetário, estimativa de desperdício financeiro em anúncios, projeção de lucro adicional com Pix ou cálculo de elasticidade exibido na plataforma possui caráter <strong>ESTRITAMENTE ESTIMATIVO, PARAMÉTRICO E ORIENTATIVO</strong>, derivado de benchmarks médios de mercado.
              </p>
              <p>
                O AdShield <strong>NÃO GARANTE</strong> faturamento, retorno financeiro, lucratividade mínima ou estabilidade de vendas. As decisões de compra de estoque, precificação, contratação de mídia e configuração técnica são de <strong>responsabilidade única e exclusiva do Usuário</strong>. Em nenhuma hipótese o AdShield será responsabilizado por lucros cessantes, perdas financeiras indiretas ou decisões comerciais tomadas com base nos relatórios emitidos.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">4.</span> Uso de Marcas de Terceiros & Benchmarking Competitivo Legítimo
            </h2>
            <p>
              Nos módulos de análise concorrencial e espionagem de mercado, o AdShield permite ao Usuário comparar parâmetros técnicos e de vitrine com concorrentes e referências do setor.
            </p>
            <p>
              Em estrita conformidade com o <strong>Art. 132, inciso IV da Lei de Propriedade Industrial (Lei nº 9.279/1996)</strong>, o uso e citação de marcas de terceiros nestes relatórios possui natureza exclusivamente <strong>nominativa, comparativa e informativa</strong>, não implicando qualquer apropriação indevida, patrocínio, associação comercial, intuito difamatório ou concorrência desleal.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">5.</span> Deveres do Usuário & Proibição de Práticas Abusivas
            </h2>
            <p>O Usuário se compromete expressamente a NÃO utilizar o AdShield para:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Executar varreduras em frequência abusiva que configurem ataques de negação de serviço (DDoS) a sites de terceiros.</li>
              <li>Realizar disparos não solicitados em massa (Spam) no WhatsApp ou qualquer canal, em desacordo com as diretrizes da Meta e da LGPD.</li>
              <li>Tentar copiar, revender a tecnologia de IA, descompilar ou realizar engenharia reversa do código-fonte do ecossistema.</li>
              <li>Utilizar relatórios para fins caluniosos, difamatórios ou concorrenciais ilícitos.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">6.</span> Planos, Cobrança, Tributação e Direito de Arrependimento (CDC Art. 49)
            </h2>
            <p>
              Os serviços são prestados na modalidade SaaS mediante contratação de planos periódicos (mensais ou anuais). Em cumprimento à tese vinculante do <strong>Tema 726 do Supremo Tribunal Federal (ADIs 5659 e 5958)</strong>, incide sobre as mensalidades o <strong>Imposto Sobre Serviços de Qualquer Natureza (ISSQN)</strong> municipal.
            </p>
            <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-2xl text-xs text-emerald-950 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Direito de Arrependimento Incondicional (7 Dias):
              </p>
              <p>
                Em observância ao <strong>Artigo 49 do Código de Defesa do Consumidor (Lei 8.078/1990)</strong> e ao Decreto nº 7.962/2013, o Usuário poderá solicitar o cancelamento e reembolso integral dos valores pagos em até <strong>7 (sete) dias corridos</strong> a partir da contratação inicial, bastando acionar o canal de suporte oficial.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">7.</span> Foro de Eleição & Disposições Gerais
            </h2>
            <p>
              Estes Termos são regidos integralmente pela legislação da República Federativa do Brasil, incluindo a Lei nº 12.965/2014 (Marco Civil da Internet), a Lei nº 13.709/2018 (LGPD) e o Código Civil Brasileiro.
            </p>
            <p>
              Fica eleito o Foro da Comarca de Uberlândia / Belo Horizonte (MG) para dirimir quaisquer controvérsias oriundas deste instrumento, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-900">Canal Jurídico & Compliance:</p>
              <p>Dúvidas contratuais, notificações ou solicitações formais: <strong>juridico@adshield.ai</strong> | <strong>contato@brkgroup.com.br</strong></p>
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
            <Link to="/terms" className="hover:text-blue-600 underline font-bold">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-blue-600 underline">Política de Privacidade & LGPD</Link>
            <Link to="/about" className="hover:text-blue-600 underline">Quem Somos</Link>
          </div>
          <p className="text-[10px] text-slate-400">© {new Date().getFullYear()} AdShield. Todos os direitos reservados. Plataforma auditada sob o Marco Civil da Internet e LGPD.</p>
        </div>
      </footer>

    </div>
  );
}
