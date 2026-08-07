import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function TermsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-6">Termos de Uso</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <p>Última atualização: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Aceitação dos Termos</h2>
          <p>Ao acessar e usar a plataforma LeakFinder, você concorda em cumprir e ficar vinculado a estes Termos de Uso. O serviço é destinado exclusivamente para fins de auditoria em sites sobre os quais você possui autorização legal para analisar.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Uso Apropriado (Anti-Scraping Abusivo)</h2>
          <p>O usuário se compromete a não utilizar o LeakFinder para lançar ataques de negação de serviço, scraping de dados em massa (crawling agressivo) contra terceiros sem consentimento, ou engenharia reversa para replicar a inteligência do nosso motor. O abuso identificável resultará em banimento imediato da conta.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Natureza das Recomendações</h2>
          <p>Os diagnósticos e Planos de Ação (Kanban) gerados pelo LeakFinder são produzidos por modelos avançados de Inteligência Artificial. Eles servem como orientação estratégica e hipóteses de teste, não como garantias absolutas de aumento de faturamento. A responsabilidade pela implementação de códigos e copys no seu e-commerce é inteiramente sua.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Assinaturas e Pagamentos</h2>
          <p>As análises dependem do motor de inteligência e de scraping. Planos premium fornecem capacidades expandidas. O não pagamento acarretará o rebaixamento automático para a modalidade restrita/heurística.</p>
        </div>
      </div>
    </div>
  );
}
