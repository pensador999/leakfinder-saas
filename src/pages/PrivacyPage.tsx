import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function PrivacyPage() {
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

        <h1 className="text-3xl font-bold text-slate-900 mb-6">Política de Privacidade</h1>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <p>Última atualização: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Informações que Coletamos</h2>
          <p>O LeakFinder coleta as URLs fornecidas para a realização das auditorias, bem como dados básicos de contato e perfil inseridos no cadastro (nome, e-mail). O sistema realiza web scraping automatizado nas URLs públicas fornecidas exclusivamente para gerar os diagnósticos solicitados.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Como Usamos as Informações</h2>
          <p>Utilizamos os dados capturados das páginas web para processamento através de Inteligência Artificial (Google Gemini e Jina AI), visando identificar gargalos de conversão, erros técnicos e oportunidades de marketing. O conteúdo escrapeado não é utilizado para treinar nossos próprios modelos além do escopo da sua auditoria.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. Compartilhamento de Dados</h2>
          <p>Seus dados (URLs e metadados gerados) são trafegados via APIs seguras de terceiros estritamente essenciais para o funcionamento do SaaS (Jina AI para extração, Google para processamento LLM, Supabase para autenticação e banco de dados). Não vendemos seus dados para terceiros.</p>

          <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. Segurança</h2>
          <p>Implementamos medidas de segurança em nível de aplicação e banco de dados para proteger suas auditorias salvas, utilizando criptografia SSL e políticas rígidas de acesso (Row Level Security) via Supabase.</p>
        </div>
      </div>
    </div>
  );
}
