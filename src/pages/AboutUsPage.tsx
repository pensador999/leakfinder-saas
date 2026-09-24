import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  TrendingUp, 
  Eye, 
  Flame, 
  Compass, 
  Lock,
  ArrowRight
} from 'lucide-react';

export function AboutUsPage() {
  const navigate = useNavigate();

  const agents = [
    {
      name: 'Arquiteto de CRO & Usabilidade',
      icon: TrendingUp,
      badge: 'Conversão Mobile',
      desc: 'Analisa zonas de alcance fácil de polegar, fricção no checkout e oportunidades de aceleração de vendas.'
    },
    {
      name: 'Doctor de Catálogo & SKUs',
      icon: Layers,
      badge: 'Saúde de Grade',
      desc: 'Inspeciona grades comerciais (PP ao G2), regras de isenção de peças casuais e pesos de imagem.'
    },
    {
      name: 'Media Buyer & Elasticidade',
      icon: Flame,
      badge: 'Proteção de Tráfego',
      desc: 'Calcula o desperdício em anúncios de Meta/Google Ads causados por ruptura de estoque e simula lucro no Pix.'
    },
    {
      name: 'Engenheiro de Visão Computacional',
      icon: Eye,
      badge: 'WCAG 2.1 AAA',
      desc: 'Calcula a matriz de contraste dos botões principais para garantir legibilidade sob luz intensa do sol.'
    },
    {
      name: 'Auditor de Segurança & Conformidade',
      icon: Lock,
      badge: 'Marco Civil & LGPD',
      desc: 'Verifica CNPJ, políticas obrigatórias, certificado SSL e integridade de scripts instalados no código.'
    },
    {
      name: 'Juiz de Veracidade (Fact-Checker)',
      icon: ShieldCheck,
      badge: 'Grounding 100%',
      desc: 'Filtra alucinações e garante que todo link abra na loja real sem 404 e com dados 100% auditados.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E100F] font-sans text-[#FFFCE1] flex flex-col justify-between selection:bg-[#0AE448] selection:text-slate-950">
      
      {/* Top Navbar */}
      <header className="bg-[#101211]/90 backdrop-blur-md border-b border-white/10 sticky top-0 z-30 px-4 sm:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#0AE448] flex items-center justify-center text-slate-950 font-black text-sm shadow-md shadow-[#0AE448]/20">
                AS
              </div>
              <span className="font-extrabold text-[#FFFCE1] tracking-tight text-base">AdShield<span className="text-[#0AE448]">.ai</span></span>
            </Link>
            <span className="text-white/20 hidden sm:inline">|</span>
            <span className="text-xs font-bold text-[#BBBAA6] hidden sm:inline font-mono">Quem Somos</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate(-1)} 
              className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-[#FFFCE1] border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#0AE448]" />
              <span>Voltar para o Painel</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto py-12 px-4 sm:px-6 w-full space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-full text-[#0AE448] text-xs font-bold font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Engenharia de Conversão & Proteção de Anúncios</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[#FFFCE1] tracking-tight leading-tight">
            Nascido no Campo de Batalha do E-Commerce Real.
          </h1>

          <p className="text-base sm:text-lg text-[#BBBAA6] leading-relaxed">
            O <strong className="text-[#FFFCE1]">AdShield</strong> foi criado para resolver a maior dor silenciosa das lojas virtuais: <strong className="text-[#FFFCE1]">o dinheiro queimado em tráfego pago para produtos sem estoque, checkouts lentos e fricção visual</strong>.
          </p>
        </div>

        {/* Story Card */}
        <div className="bg-[#101211] border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-2.5 bg-[#0AE448]/10 border border-[#0AE448]/20 rounded-xl text-[#0AE448] shadow-md shadow-[#0AE448]/10">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#FFFCE1]">A Nossa História & Origem</h2>
              <p className="text-xs text-[#BBBAA6]">Do ecossistema BRK Group para a elite do e-commerce brasileiro.</p>
            </div>
          </div>

          <div className="space-y-4 text-[#BBBAA6] leading-relaxed text-sm">
            <p>
              Operando grandes marcas de moda esportiva, pesca, agro e vestuário de alta performance no Brasil, nossa equipe de engenharia e mídia descobriu um padrão crítico: <strong className="text-[#FFFCE1]">milhares de reais eram investidos diariamente em anúncios para atrair compradores qualificados, apenas para fazê-los encontrar tamanhos esgotados ou checkouts com alta fricção</strong>.
            </p>
            <p>
              Decidimos construir uma solução definitiva. Em vez de relatórios genéricos que apontam erros sem contexto, criamos uma <strong className="text-[#FFFCE1]">arquitetura de enxame com agentes de inteligência artificial ultra-especializados</strong>, capazes de auditar o código público, o catálogo SKU por SKU e a visão computacional em segundos.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-center">
            <div className="p-4 bg-[#141716] rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-[#0AE448] font-mono">100%</span>
              <p className="text-xs font-bold text-[#FFFCE1] mt-1">Grounding & Fatos Reais</p>
              <p className="text-[10px] text-[#BBBAA6] mt-0.5">Zero alucinações de dados</p>
            </div>

            <div className="p-4 bg-[#141716] rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-[#00BAE2] font-mono">18 Agentes</span>
              <p className="text-xs font-bold text-[#FFFCE1] mt-1">Enxame Especialista</p>
              <p className="text-[10px] text-[#BBBAA6] mt-0.5">Auditoria Multidimensional 24h</p>
            </div>

            <div className="p-4 bg-[#141716] rounded-2xl border border-white/10">
              <span className="text-2xl font-black text-[#FFFCE1] font-mono">AES-256</span>
              <p className="text-xs font-bold text-[#FFFCE1] mt-1">Segurança Bancária</p>
              <p className="text-[10px] text-[#BBBAA6] mt-0.5">Permissões Read-Only & TLS 1.3</p>
            </div>
          </div>
        </div>

        {/* 6 AI Agents Section */}
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#FFFCE1]">Núcleo do Enxame Especialista AdShield</h2>
            <p className="text-xs text-[#BBBAA6]">Agentes autônomos operando sob rigor epistêmico e verificação cruzada contra falsos-positivos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((ag, idx) => {
              const Icon = ag.icon;
              return (
                <div key={idx} className="p-5 bg-[#101211] border border-white/10 rounded-3xl space-y-3 shadow-xl hover:border-[#0AE448]/40 transition-all flex flex-col justify-between group">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-[#141716] rounded-xl text-[#0AE448] border border-white/5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-white/5 text-[#0AE448] border border-white/10 font-mono">
                        {ag.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-[#FFFCE1] group-hover:text-[#0AE448] transition-colors">{ag.name}</h3>
                    <p className="text-xs text-[#BBBAA6] leading-relaxed">{ag.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision Banner */}
        <div className="bg-gradient-to-br from-[#141716] to-[#101211] border border-white/10 text-[#FFFCE1] rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="max-w-2xl space-y-3">
            <span className="px-3 py-1 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/20 rounded-full text-xs font-bold font-mono uppercase tracking-wider">
              Nosso Compromisso Ético & Jurídico
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FFFCE1]">
              Democratizar a Tecnologia dos Maiores E-Commerces do Mundo.
            </h2>
            <p className="text-xs sm:text-sm text-[#BBBAA6] leading-relaxed">
              Acreditamos que toda operação de comércio eletrônico, de marcas em escala a novas lojas em crescimento, merece ter acesso à inteligência analítica de nível institucional para vender mais e lucrar com precisão cirúrgica, em estrito respeito à privacidade e à legislação vigente.
            </p>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#BBBAA6]">
              <ShieldCheck className="w-4 h-4 text-[#0AE448]" />
              <span>Tecnologia Desenvolvida no Brasil • 100% Conforme com LGPD e Marco Civil</span>
            </div>

            <Link
              to="/"
              className="px-5 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#0AE448]/20 uppercase tracking-wider"
            >
              <span>Fazer uma Auditoria Gratuita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </main>

      {/* Footer em Conformidade com Decreto 7.962/2013 */}
      <footer className="bg-[#0E100F] border-t border-white/10 py-8 px-4 text-center text-xs text-[#BBBAA6] mt-12">
        <div className="max-w-4xl mx-auto space-y-2">
          <p className="font-bold text-[#FFFCE1] text-sm">AdShield • BRK GROUP TECNOLOGIA LTDA</p>
          <p className="text-[#BBBAA6] font-mono text-[11px]">CNPJ: 52.894.218/0001-90 • Sede: Minas Gerais, Brasil</p>
          <div className="flex justify-center gap-4 text-[11px] text-[#BBBAA6] pt-1">
            <Link to="/terms" className="hover:text-[#0AE448] underline transition-colors">Termos de Uso</Link>
            <Link to="/privacy" className="hover:text-[#0AE448] underline transition-colors">Política de Privacidade & LGPD</Link>
            <Link to="/about" className="hover:text-[#0AE448] underline font-bold transition-colors">Quem Somos</Link>
          </div>
          <p className="text-[10px] text-[#BBBAA6]/60">© {new Date().getFullYear()} AdShield. Todos os direitos reservados. Plataforma auditada sob o Marco Civil da Internet e LGPD.</p>
        </div>
      </footer>

    </div>
  );
}
