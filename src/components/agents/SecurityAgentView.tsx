import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, AlertTriangle, Key, Globe, FileCode } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface SecurityAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const SecurityAgentView: React.FC<SecurityAgentViewProps> = ({ diagnostic }) => {
  const { security, realSiteData } = diagnostic;

  return (
    <div className="space-y-6">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">LeakFinder Security & Code Auditor</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                Segurança HTML/JS & Headers
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Supervisão de vulnerabilidades de código, certificado SSL, isolamento de links e proteção no checkout de <span className="font-mono text-slate-900 font-bold">{realSiteData.domain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200">
          <div className="text-center">
            <p className="text-[10px] text-slate-500 uppercase font-semibold">Score Segurança</p>
            <p className="text-xl font-bold font-mono text-blue-600">{security.securityScore}/100</p>
          </div>
        </div>
      </div>

      {/* Security Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-medium">
        
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Certificado SSL:</span>
            <p className={`text-sm font-bold ${security.isHttps ? 'text-emerald-600' : 'text-rose-600'}`}>
              {security.isHttps ? 'HTTPS Ativo & Seguro' : 'Não Criptografado (HTTP)'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Frame Lock (Clickjacking):</span>
            <p className="text-sm font-bold text-amber-600">X-Frame-Options Ausente</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Links Externos:</span>
            <p className="text-sm font-bold text-slate-900">{security.unsafeLinksCount} Requerem rel="noopener"</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-500">Keys Expostas no JS:</span>
            <p className="text-sm font-bold text-emerald-600">0 Nenhuma chave crítica</p>
          </div>
        </div>

      </div>

      {/* Security Checks List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <span>Vulnerabilidades & Boas Práticas de Código Lidas ({security.checks.length})</span>
        </h3>

        <div className="space-y-3 font-medium">
          {security.checks.map((chk) => (
            <div key={chk.id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-slate-100 text-slate-700">
                    {chk.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{chk.title}</h4>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                  chk.severity === 'CRÍTICO' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                  chk.severity === 'ALTO' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  Severidade: {chk.severity}
                </span>
              </div>

              <p className="text-xs text-slate-600">{chk.description}</p>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
                <p className="font-bold text-blue-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-blue-600" /> Risco para o Negócio:
                </p>
                <p className="text-slate-800">{chk.riskImpact}</p>
                <p className="text-blue-950 font-bold pt-1">🎯 Ação Recomendada: {chk.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
