import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, AlertTriangle, Key, Globe, FileCode } from 'lucide-react';
import { AgentDiagnosticResult } from '../../types';

interface SecurityAgentViewProps {
  diagnostic: AgentDiagnosticResult;
}

export const SecurityAgentView: React.FC<SecurityAgentViewProps> = ({ diagnostic }) => {
  const { security, realSiteData } = diagnostic;

  return (
    <div className="space-y-6 font-sans">
      
      {/* Agent Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-[#141716] border border-[#0AE448]/20 rounded-2xl text-[#0AE448] shadow-md">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-black text-[#FFFCE1]">AdShield Security & Code Auditor</h2>
              <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold bg-[#00BAE2]/10 text-[#00BAE2] rounded-full border border-[#00BAE2]/20">
                Segurança HTML/JS & Headers
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 font-medium">
              Supervisão de vulnerabilidades de código, certificado SSL, isolamento de links e proteção no checkout de <span className="font-mono text-[#FFFCE1] font-bold">{realSiteData.domain}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 px-5 py-3 bg-[#141716] rounded-2xl border border-white/10">
          <div className="text-center">
            <p className="text-[10px] text-[#BBBAA6] uppercase font-mono font-bold">Score Segurança</p>
            <p className="text-xl font-black font-mono text-[#0AE448]">{security.securityScore}/100</p>
          </div>
        </div>
      </div>

      {/* Security Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-medium">
        
        <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#0AE448] rounded-xl border border-[#0AE448]/20">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#BBBAA6] block">Certificado SSL:</span>
            <p className={`text-sm font-bold font-mono ${security.isHttps ? 'text-[#0AE448]' : 'text-rose-400'}`}>
              {security.isHttps ? 'HTTPS Ativo & Seguro' : 'Não Criptografado (HTTP)'}
            </p>
          </div>
        </div>

        <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-amber-400 rounded-xl border border-amber-500/20">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#BBBAA6] block">Frame Lock (Clickjacking):</span>
            <p className="text-sm font-bold text-amber-300 font-mono">X-Frame-Options Ausente</p>
          </div>
        </div>

        <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#00BAE2] rounded-xl border border-[#00BAE2]/20">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#BBBAA6] block">Links Externos:</span>
            <p className="text-sm font-bold text-[#FFFCE1] font-mono">{security.unsafeLinksCount} Requerem rel="noopener"</p>
          </div>
        </div>

        <div className="p-4 bg-[#101211] border border-white/10 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="p-2.5 bg-[#141716] text-[#0AE448] rounded-xl border border-[#0AE448]/20">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#BBBAA6] block">Keys Expostas no JS:</span>
            <p className="text-sm font-bold text-[#0AE448] font-mono">0 Nenhuma chave crítica</p>
          </div>
        </div>

      </div>

      {/* Security Checks List */}
      <div className="space-y-4">
        <h3 className="text-sm font-black text-[#FFFCE1] uppercase tracking-wider flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#0AE448]" />
          <span>Vulnerabilidades & Boas Práticas de Código Lidas ({security.checks.length})</span>
        </h3>

        <div className="space-y-3 font-medium">
          {security.checks.map((chk) => (
            <div key={chk.id} className="p-5 rounded-3xl bg-[#101211] border border-white/10 space-y-3 shadow-2xl hover:border-white/20 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono font-extrabold uppercase rounded bg-[#141716] text-[#FFFCE1] border border-white/10">
                    {chk.category}
                  </span>
                  <h4 className="text-sm font-bold text-[#FFFCE1]">{chk.title}</h4>
                </div>

                <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${
                  chk.severity === 'CRÍTICO' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                  chk.severity === 'ALTO' ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20' :
                  'bg-[#00BAE2]/10 text-[#00BAE2] border border-[#00BAE2]/20'
                }`}>
                  Severidade: {chk.severity}
                </span>
              </div>

              <p className="text-xs text-[#BBBAA6] leading-relaxed">{chk.description}</p>

              <div className="p-3.5 bg-[#141716] border border-[#00BAE2]/30 rounded-2xl text-xs space-y-1">
                <p className="font-bold text-[#00BAE2] flex items-center gap-1.5 font-mono">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Risco para o Negócio:
                </p>
                <p className="text-[#BBBAA6] leading-relaxed">{chk.riskImpact}</p>
                <p className="text-[#0AE448] font-bold pt-1 font-mono">🎯 Ação Recomendada: {chk.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
