import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Scale, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink,
  Building2,
  Mail,
  Printer,
  ShieldCheck,
  FileText,
  AlertTriangle,
  HelpCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export function TermsPage() {
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
            <span className="text-xs font-bold text-[#BBBAA6] hidden sm:inline font-mono">Governança Jurídica & Termos</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title="Imprimir documento em A4"
            >
              <Printer className="w-3.5 h-3.5 text-[#0AE448]" />
              <span className="hidden sm:inline">Imprimir Documento</span>
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
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#0AE448]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00BAE2]/10 border border-[#00BAE2]/25 rounded-full text-[#00BAE2] text-xs font-bold font-mono uppercase">
            <Scale className="w-3.5 h-3.5" />
            <span>Instrumento Jurídico Vinculante • Brasil</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#FFFCE1] tracking-tight">
            Termos de Uso & Condições Gerais de Contratação SaaS
          </h1>

          <p className="text-xs sm:text-sm text-[#BBBAA6] leading-relaxed max-w-3xl">
            Este contrato estabelece as regras inquebráveis de governança, licenciamento de software, limites de responsabilidade e salvaguardas operacionais para o uso da plataforma <strong className="text-[#FFFCE1]">AdShield</strong> no território brasileiro, em estrita harmonia com o Marco Civil da Internet (Lei 12.965/2014), Código de Defesa do Consumidor (Lei 8.078/1990) e Código Civil (Lei 10.406/2002).
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#BBBAA6] font-mono pt-3 border-t border-white/10">
            <span>Última Revisão: {new Date().toLocaleDateString('pt-BR')}</span>
            <span>•</span>
            <span>Versão: 3.2 Enterprise (Conformidade STF / STJ)</span>
            <span>•</span>
            <span className="text-[#0AE448]">CNPJ: 52.894.218/0001-90</span>
          </div>
        </div>

        {/* Legal Text Cards */}
        <div className="bg-[#101211] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-10 text-[#BBBAA6] leading-relaxed text-sm">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">1.</span> Qualificação das Partes, Objeto & Aceitação Vinculante
            </h2>
            <p>
              Estes Termos de Uso e Condições Gerais regem a utilização da plataforma tecnológica <strong className="text-[#FFFCE1]">AdShield</strong>, provida pelo <strong className="text-[#FFFCE1]">BRK GROUP TECNOLOGIA LTDA</strong> (doravante designado "AdShield" ou "Licenciante"), sociedade empresária devidamente constituída e em situação regular perante a Junta Comercial do Estado de Minas Gerais e a Receita Federal do Brasil, inscrita no CNPJ sob o nº <strong className="text-[#FFFCE1]">52.894.218/0001-90</strong>.
            </p>
            <p>
              Ao navegar, cadastrar-se, simular relatórios, auditar domínios ou contratar quaisquer planos de subscrição na plataforma, a pessoa física ou jurídica (doravante "Usuário" ou "Contratante") declara expressamente ter capacidade civil plena e anui, de forma <strong className="text-[#FFFCE1]">livre, expressa, irrevogável e informada</strong>, com a totalidade das disposições deste instrumento e da nossa Política de Privacidade.
            </p>
            <p className="text-xs text-[#BBBAA6]/80 italic">
              Caso o Usuário discorde de qualquer cláusula, diretriz ou condição ora pactuada, deverá interromper imediatamente o acesso à plataforma e abster-se de utilizar qualquer funcionalidade do ecossistema.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">2.</span> Natureza do Serviço: Licença de Software SaaS por Subscrição
            </h2>
            <p>
              O AdShield concede ao Contratante uma licença de uso temporária, não-exclusiva, intransferível e revogável de seu software de diagnóstico analítico de tráfego pago, catalogação e auditoria de e-commerce na modalidade <em className="text-[#FFFCE1]">Software as a Service (SaaS)</em>.
            </p>
            <p>
              A outorga desta licença <strong className="text-[#FFFCE1]">NÃO transfere nem cede</strong> qualquer direito de propriedade intelectual, código-fonte, arquitetura de rede neural, patentes, marcas registradas ou know-how da Licenciante, permanecendo todo o ecossistema sob a propriedade exclusiva do BRK GROUP TECNOLOGIA LTDA.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">3.</span> Legalidade da Auditoria Pública, Web Scraping e Marco Civil da Internet
            </h2>
            <p>
              Os motores de inspeção do AdShield operam estritamente sobre elementos técnicos acessíveis de forma pública na World Wide Web (código-fonte HTML público renderizado no navegador, metadados públicos, arquivos de feeds públicos como <code className="text-[#0AE448]">/products.json</code> e bibliotecas públicas como a Meta Ads Library).
            </p>
            <p>
              Em estrita conformidade com a legislação brasileira:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#BBBAA6]">
              <li>
                <strong className="text-[#FFFCE1]">Marco Civil da Internet (Lei nº 12.965/2014, Art. 3º, VI):</strong> A indexação e leitura de dados disponibilizados publicamente para navegadores comuns constitui exercício legítimo da liberdade dos modelos de negócios na internet e do direito de acesso à informação pública.
              </li>
              <li>
                <strong className="text-[#FFFCE1]">Inocorrência do Crime de Invasão de Dispositivo (Art. 154-A do Código Penal):</strong> O AdShield <strong className="text-[#FFFCE1]">NÃO</strong> transpassa firewalls, não burla mecanismos de autenticação, não quebra senhas, não executa injeção SQL e não acessa áreas administrativas privadas (como bancos de dados internos de servidores ou painéis confidenciais da Shopify Admin sem autorização oficial via token de API).
              </li>
              <li>
                <strong className="text-[#FFFCE1]">Jurisprudência dos Tribunais Superiores (STJ - REsp 1.956.126/SP):</strong> É amplamente reconhecida pelo Superior Tribunal de Justiça a licitude do monitoramento de vitrines públicas para agregação de informações técnicas e benchmarking mercadológico, vedado apenas o prejuízo à infraestrutura do servidor de origem.
              </li>
              <li>
                <strong className="text-[#FFFCE1]">Respeito à Infraestrutura de Terceiros:</strong> Os robôs de inspeção operam com rate-limiting civilizado (intervalos mínimos entre requisições), impedindo qualquer sobrecarga de tráfego que caracterize ataque de negação de serviço.
              </li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">4.</span> Protocolo de Grounding, Caráter Estimativo das Métricas & Exclusão de Responsabilidade
            </h2>
            <p>
              A plataforma é regida pelo <strong className="text-[#FFFCE1]">Protocolo de Grounding Absoluto</strong>. Os dados observáveis (URLs de produtos, presença ou ausência de SKUs, estoque ativo vs. esgotado retornado pelo servidor público) refletem o estado factual do código inspecionado no milissegundo da checagem.
            </p>
            
            <div className="p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-[#FFFCE1] space-y-2.5">
              <p className="font-bold flex items-center gap-1.5 text-amber-400 text-sm">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" /> CLÁUSULA ESSENCIAL DE EXCLUSÃO DE RESPONSABILIDADE CIVIL & LUCROS CESSANTES:
              </p>
              <p className="text-[#BBBAA6] leading-relaxed">
                1. <strong className="text-[#FFFCE1]">Natureza Paramétrica dos Laudos:</strong> Todo e qualquer cálculo de "desperdício de mídia em anúncios", "sangria diária em R$", "projeção de ganho com Pix" ou "lift de faturamento" exibido na interface ou em relatórios PDF possui natureza <strong className="text-[#FFFCE1]">ESTRITAMENTE ESTIMATIVA, PROJETADA E BASEADA EM BENCHMARKS MÉDIOS</strong> do comércio eletrônico brasileiro.
              </p>
              <p className="text-[#BBBAA6] leading-relaxed">
                2. <strong className="text-[#FFFCE1]">Não-Garantia de Faturamento:</strong> O AdShield <strong className="text-[#FFFCE1]">NÃO GARANTE</strong> faturamento, lucro líquido, estabilidade nas contas de anúncios, conversão de vendas ou qualquer resultado comercial específico.
              </p>
              <p className="text-[#BBBAA6] leading-relaxed">
                3. <strong className="text-[#FFFCE1]">Autonomia do Gestor de Tráfego / Lojista:</strong> A decisão final de pausar campanhas, alterar criativos, produzir lotes em estoque, conceder descontos ou aplicar scripts no tema do e-commerce é de <strong className="text-[#FFFCE1]">competência única, exclusiva e indelegável do Usuário</strong>.
              </p>
              <p className="text-[#BBBAA6] leading-relaxed">
                4. <strong className="text-[#FFFCE1]">Limitação Máxima de Indenização (Arts. 421 e 421-A do Código Civil):</strong> Em conformidade com o princípio da intervenção mínima em relações empresariais B2B, na remota hipótese de arbitramento judicial de indenização, a responsabilidade total acumulada do AdShield por quaisquer perdas e danos fica estritamente limitada ao <strong className="text-[#FFFCE1]">valor total efetivamente pago pelo Contratante à Licenciante nos 3 (três) meses anteriores ao fato gerador</strong>, excluindo-se integralmente lucros cessantes, perdas indiretas ou dano reputacional.
              </p>
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">5.</span> Automações de Tráfego Pago, Ad-Stock Sync & Kill-Switch
            </h2>
            <p>
              Ao utilizar os recursos de automação de pausa de criativos (AdShield Kill-Switch via Meta Graph API ou Google Ads API), o Usuário declara e concorda que:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#BBBAA6]">
              <li>Concede à plataforma autorização prévia e expressa para emitir comandos técnicos de alteração de status em conjuntos de anúncios conforme os gatilhos configurados pelo próprio Usuário.</li>
              <li>A Licenciante não responde por oscilações no algoritmo de entrega do Meta/Google Ads decorrentes de pausas ou reativações, nem por custos cobrados pelas plataformas de mídia de terceiros.</li>
              <li>O Usuário mantém a faculdade de desativar as automações instantaneamente a qualquer momento diretamente no painel de configurações.</li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">6.</span> Uso Nominativo de Marcas de Terceiros e Benchmarking Competitivo
            </h2>
            <p>
              Nos módulos de radar concorrencial e auditoria comparativa, o AdShield referencia nomes de marcas, títulos de produtos e domínios de mercado.
            </p>
            <p>
              Em estrita obediência ao <strong className="text-[#FFFCE1]">Art. 132, inciso IV da Lei de Propriedade Industrial (Lei nº 9.279/1996)</strong>, a citação de marcas de terceiros nestes relatórios tem caráter estritamente <strong className="text-[#FFFCE1]">nominativo, descritivo, comparativo e técnico</strong>, com o fito de indicar compatibilidade mercadológica. Esse uso não gera direito de exclusividade para o Usuário, não implica aprovação ou patrocínio pelas marcas citadas, nem configura ato de difamação ou concorrência desleal.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">7.</span> Conduta Ética do Usuário & Práticas Terminantemente Vedadas
            </h2>
            <p>O Usuário compromete-se a utilizar a plataforma em estrita boa-fé, sendo-lhe expressamente vedado:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#BBBAA6]">
              <li>Utilizar robôs automatizados não autorizados para tentar derrubar a infraestrutura da plataforma AdShield ou de lojas de terceiros.</li>
              <li>Praticar engenharia reversa, descompilação ou cópia da lógica interna do enxame de 18 agentes ou dos códigos-fonte protegidos.</li>
              <li>Disparar mensagens em massa não solicitadas (Spam abusivo) que violem os termos de serviço do WhatsApp ou da Meta.</li>
              <li>Forjar falsos-positivos técnicos com dolo de coagir concorrentes ou lesar comerciantes.</li>
              <li>Revender ou sublicenciar a conta AdShield para terceiros fora dos limites autorizados no Plano Agency White-Label.</li>
            </ul>
            <p className="text-xs text-[#BBBAA6]/80">
              A violação de qualquer dessas proibições ensejará a rescisão imediata do contrato, bloqueio definitivo do acesso e responsabilização cível e criminal cabível.
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">8.</span> Planos, Preço, Regime Tributário e Direito de Arrependimento (CDC Art. 49)
            </h2>
            <p>
              A contratação do AdShield se dá mediante subscrição pré-paga recorrente nos termos dos planos descritos no site.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#BBBAA6]">
              <li>
                <strong className="text-[#FFFCE1]">Regime Tributário (Tema 726 STF):</strong> Conforme jurisprudência vinculante do Supremo Tribunal Federal nas ADIs 5659 e 5958, sobre o licenciamento SaaS incide o Imposto Sobre Serviços de Qualquer Natureza (ISSQN) de competência municipal, afastando-se o ICMS. As Notas Fiscais de Serviços Eletrônicas (NFS-e) são emitidas pelo BRK GROUP TECNOLOGIA LTDA sob o código de atividade tributária correspondente.
              </li>
              <li>
                <strong className="text-[#FFFCE1]">Direito de Arrependimento Incondicional de 7 Dias:</strong> Em estrito cumprimento ao <strong className="text-[#0AE448]">Artigo 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990)</strong> e ao Decreto Federal nº 7.962/2013, o Contratante poderá requerer o cancelamento da contratação inicial com <strong className="text-[#FFFCE1]">reembolso de 100% dos valores pagos</strong> no prazo de até 7 (sete) dias corridos contados da assinatura, sem qualquer questionamento ou retenção.
              </li>
              <li>
                <strong className="text-[#FFFCE1]">Cancelamento de Renovação:</strong> O cancelamento da renovação subsequente poderá ser solicitado a qualquer momento diretamente no painel do usuário, mantendo-se o acesso ativo até o término do ciclo mensal/anual já quitado.
              </li>
            </ul>
          </section>

          <hr className="border-white/10" />

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">9.</span> Nível de Serviço (SLA), Manutenção e Caso Fortuito
            </h2>
            <p>
              O AdShield emprega as melhores práticas globais de infraestrutura de alta disponibilidade na nuvem (CDN global, arquitetura serverless distribuída e banco de dados com redundância geográfica).
            </p>
            <p>
              A Licenciante envidará esforços para manter a disponibilidade mensal de 99,5% do sistema, ressalvadas paradas programadas de manutenção, falhas na rede mundial de computadores, indisponibilidade imprevista de APIs de plataformas terceiras (Shopify, Meta, Google, Stripe) e eventos de força maior ou caso fortuito (Art. 393 do Código Civil Brasileiro).
            </p>
          </section>

          <hr className="border-white/10" />

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#FFFCE1] flex items-center gap-2">
              <span className="text-[#0AE448] font-mono">10.</span> Legislação Aplicável, Foro de Eleição Exclusivo & Canal de Notificações
            </h2>
            <p>
              Este Contrato é regido, interpretado e executado inteiramente segundo as leis vigentes na República Federativa do Brasil.
            </p>
            <p>
              Para dirimir quaisquer controvérsias, dúvidas ou litígios oriundos deste instrumento ou do uso da plataforma, as partes <strong className="text-[#FFFCE1]">elegem exclusivamente o Foro da Comarca de Uberlândia / Belo Horizonte, Estado de Minas Gerais</strong>, com renúncia irrevogável e expressa a qualquer outro foro, por mais privilegiado que seja ou venha a ser.
            </p>
            
            <div className="p-5 bg-[#141716] border border-white/10 rounded-2xl space-y-2 text-xs text-[#BBBAA6]">
              <p className="font-bold text-[#FFFCE1] flex items-center gap-2 text-sm">
                <Building2 className="w-4 h-4 text-[#0AE448]" /> Canal Oficial de Notificações Jurídicas & Compliance
              </p>
              <p>
                Qualquer comunicação formal, interpelação, ofício judicial ou notificação extrajudicial deverá ser remetida formalmente para:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-[#BBBAA6] block">Departamento Jurídico:</span>
                  <strong className="text-[#00BAE2]">juridico@adshield.ai</strong>
                </div>
                <div className="p-2.5 bg-black/40 rounded-xl border border-white/5">
                  <span className="text-[#BBBAA6] block">Ouvidoria Corporativa:</span>
                  <strong className="text-[#0AE448]">contato@brkgroup.com.br</strong>
                </div>
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
            CNPJ: 52.894.218/0001-90 • Sede: Minas Gerais, Brasil • Inscrição Municipal Ativa
          </p>
          <div className="flex justify-center gap-4 text-[11px] text-[#BBBAA6] pt-1">
            <Link to="/terms" className="hover:text-[#0AE448] underline font-bold text-[#0AE448]">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-[#0AE448] underline">Política de Privacidade & LGPD</Link>
            <Link to="/about" className="hover:text-[#0AE448] underline">Quem Somos</Link>
          </div>
          <p className="text-[10px] text-[#BBBAA6]/60">
            © {new Date().getFullYear()} AdShield. Todos os direitos reservados. Plataforma legalmente auditada e protegida pelas leis da República Federativa do Brasil.
          </p>
        </div>
      </footer>

    </div>
  );
}
