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
              <span className="text-blue-600 font-mono">1.</span> Objeto e Aceitação dos Termos
            </h2>
            <p>
              Ao acessar, navegar ou utilizar a plataforma <strong>AdShield</strong>, operada pelo ecossistema tecnológico <strong>BRK Group</strong>, você declara ter lido, compreendido e concordado integralmente com estes Termos de Uso e com a nossa Política de Privacidade.
            </p>
            <p>
              Caso você não concorde com qualquer disposição aqui estabelecida, solicitamos que interrompa imediatamente o uso de nossos serviços e ferramentas de diagnóstico.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">2.</span> Escopo dos Serviços & Motor de Diagnóstico
            </h2>
            <p>
              O AdShield é uma plataforma de inteligência analítica, auditoria de catálogo e conversão para e-commerce. A plataforma opera por meio de:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Inspeção Pública de DOM e Metadados:</strong> Leitura automatizada e não-intrusiva de tags públicas, scripts de rastreamento e catálogo público (`/products.json`).</li>
              <li><strong>Visão Computacional & Acessibilidade:</strong> Avaliação técnica de contraste cromático WCAG 2.1 e ergonomia de botões móveis.</li>
              <li><strong>Simulações Financeiras & Benchmarks:</strong> Projeções matemáticas de elasticidade no Pix e contenção de desperdício em anúncios de tráfego pago.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">3.</span> Protocolo de Integridade & Não-Alucinação (Grounding 100%)
            </h2>
            <p>
              Nossa plataforma é regida pelo <strong>Protocolo de Grounding Absoluto</strong>. Os dados observáveis (URLs, SKUs, tamanhos e tags) são extraídos com fidelidade de 100% da loja pública auditada.
            </p>
            <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs text-blue-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" /> Natureza das Simulações Financeiras:
              </p>
              <p className="text-blue-800">
                Todo cálculo de faturamento adicional projetado ou economia de mídia é rotulado expressamente como <strong>Simulação Baseada em Parâmetros</strong>. O AdShield não garante faturamento fixo, atuando como bússola estratégica orientada a dados.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">4.</span> Uso Autorizado & Proibição de Práticas Abusivas
            </h2>
            <p>É terminantemente proibido utilizar o AdShield para:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Executar ataques de negação de serviço (DDoS) ou sobrecarregar servidores de terceiros.</li>
              <li>Tentar realizar engenharia reversa ou cópia não autorizada dos algoritmos de auditoria.</li>
              <li>Utilizar robôs automatizados de alta frequência sem chave de API corporativa contratada.</li>
            </ul>
          </section>

          <hr className="border-slate-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">5.</span> Planos, Assinaturas e Direito de Arrependimento (CDC Art. 49)
            </h2>
            <p>
              As assinaturas do AdShield são renovadas periodicamente conforme o plano contratado. Em conformidade com o <strong>Artigo 49 do Código de Defesa do Consumidor (Lei 8.078/1990)</strong>, o cliente possui o prazo de até <strong>7 (sete) dias corridos</strong> a partir da contratação para solicitar o cancelamento com reembolso integral.
            </p>
          </section>

          <hr className="border-slate-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="text-blue-600 font-mono">6.</span> Foro de Eleição & Legislação Aplicável
            </h2>
            <p>
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, incluindo o Marco Civil da Internet (Lei 12.965/2014) e a Lei Geral de Proteção de Dados (Lei 13.709/2018). Fica eleito o Foro da Comarca da sede da empresa para dirimir quaisquer controvérsias decorrentes deste contrato.
            </p>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-bold text-slate-700">AdShield • Ecossistema BRK Group</p>
          <div className="flex justify-center gap-4 text-[11px] text-slate-500">
            <Link to="/terms" className="hover:text-blue-600 underline">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-blue-600 underline">Política de Privacidade</Link>
            <Link to="/about" className="hover:text-blue-600 underline">Quem Somos</Link>
          </div>
          <p className="text-[10px] text-slate-400">© {new Date().getFullYear()} AdShield. Todos os direitos reservados.</p>
        </div>
      </footer>

    </div>
  );
}
