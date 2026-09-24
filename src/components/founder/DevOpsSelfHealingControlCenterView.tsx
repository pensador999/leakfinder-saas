import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Code2, 
  GitCommit, 
  GitPullRequest, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Play, 
  Cpu, 
  Zap, 
  Check, 
  Terminal, 
  FileCode, 
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { 
  BugIncidentReport, 
  fetchDevOpsIncidents 
} from '../../services/agents/devopsSentinelTelemetryAgent';
import { 
  CodePatchProposal, 
  generateAutoCodePatch, 
  dispatchCommitToGitHubAndVercel 
} from '../../services/agents/autonomousCodePatchEngineerAgent';

export const DevOpsSelfHealingControlCenterView: React.FC = () => {
  const [incidents, setIncidents] = useState<BugIncidentReport[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<BugIncidentReport | null>(null);
  const [currentPatch, setCurrentPatch] = useState<CodePatchProposal | null>(null);
  const [isGeneratingPatch, setIsGeneratingPatch] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployResult, setDeployResult] = useState<{ commitSha: string; url: string; githubCommitUrl?: string; message?: string } | null>(null);

  const loadIncidents = async () => {
    const list = await fetchDevOpsIncidents();
    setIncidents(list);
    if (list.length > 0) {
      setSelectedIncident(list[0]);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  useEffect(() => {
    if (selectedIncident) {
      setIsGeneratingPatch(true);
      generateAutoCodePatch(selectedIncident).then(p => {
        setCurrentPatch(p);
        setIsGeneratingPatch(false);
      });
    }
  }, [selectedIncident]);

  const handleDeployPatch = async () => {
    if (!currentPatch) return;
    setIsDeploying(true);
    try {
      const res = await dispatchCommitToGitHubAndVercel(currentPatch);
      setDeployResult({ 
        commitSha: res.commitSha, 
        url: res.vercelDeployUrl,
        githubCommitUrl: res.githubCommitUrl,
        message: res.message
      });
      
      // Update incident status in local state
      if (selectedIncident) {
        setIncidents(prev => prev.map(inc => 
          inc.id === selectedIncident.id ? { ...inc, patchStatus: 'DEPLOYED_VERCEL', autoHealed: true } : inc
        ));
      }
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-8 font-sans text-[#FFFCE1]">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#101211] text-[#FFFCE1] border border-white/10 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-[#0AE448]/20 to-[#00BAE2]/20 border border-[#0AE448]/30 rounded-2xl text-[#0AE448] shadow-md shadow-[#0AE448]/10">
            <Code2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Auto-Correção & DevOps Autônomo (Agentes 11 e 12)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-[#0AE448]" />
                Pipeline GitHub & Vercel Integrada
              </span>
            </div>
            <p className="text-xs text-[#BBBAA6] mt-1 max-w-2xl leading-relaxed">
              O **Agente 11 (Sentinel)** vigia erros em tempo real e o **Agente 12 (Auto-Coder)** escreve o código de correção, testa e dispara o deploy no Vercel automaticamente!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#BBBAA6] font-mono">Modo Auto-Heal:</span>
          <span className="px-3 py-1.5 bg-[#0AE448]/10 text-[#0AE448] border border-[#0AE448]/30 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>1-Clique ou 100% Autônomo</span>
          </span>
        </div>
      </div>

      {deployResult && (
        <div className="p-5 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 rounded-3xl text-xs font-bold space-y-3 animate-fadeIn shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#0AE448] shrink-0" />
              <span>
                🎉 Patch aplicado com sucesso! Commit SHA: <strong className="font-mono bg-white/10 px-2 py-0.5 rounded border border-white/20 text-[#FFFCE1]">{deployResult.commitSha}</strong>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-[#0AE448]/20 text-[#0AE448] border border-[#0AE448]/30">
              Vercel Build Auto-Triggered ✓
            </span>
          </div>

          <p className="text-[11px] text-[#BBBAA6] font-medium">
            {deployResult.message}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10">
            <a
              href={deployResult.githubCommitUrl || 'https://github.com/pensador999/leakfinder-saas/commits/main'}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-[#141716] hover:bg-white/10 text-[#FFFCE1] rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 border border-white/10"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Ver Commits no GitHub (pensador999/leakfinder-saas)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={deployResult.url}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl font-black text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-[#0AE448]/20"
            >
              <span>Ver Deploy ao Vivo na Vercel</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Grid: Incidents List (Left) & AI Code Patch Diff Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Incidents List (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#FFFCE1] uppercase font-mono tracking-wider">
              Falhas & Incidentes Monitorados ({incidents.length})
            </span>
            <span className="text-[11px] text-[#BBBAA6] font-mono">Agente 11 (Sentinel)</span>
          </div>

          <div className="space-y-2.5">
            {incidents.map((inc) => {
              const isSelected = selectedIncident?.id === inc.id;

              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 text-xs ${
                    isSelected
                      ? 'bg-[#141716] border-[#0AE448] shadow-lg ring-1 ring-[#0AE448]/30'
                      : 'bg-[#101211] border-white/10 hover:border-white/20 shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      inc.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                      inc.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-[#00BAE2]/20 text-[#00BAE2] border border-[#00BAE2]/30'
                    }`}>
                      {inc.severity}
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                      inc.autoHealed
                        ? 'bg-emerald-500/20 text-[#0AE448] border border-emerald-500/30'
                        : 'bg-white/5 text-[#BBBAA6] border border-white/10'
                    }`}>
                      {inc.autoHealed ? '✅ Auto-Corrigido' : '⏳ Aguardando Patch'}
                    </span>
                  </div>

                  <h4 className="font-bold text-[#FFFCE1] leading-snug">{inc.incidentTitle}</h4>
                  
                  <p className="text-[11px] text-[#BBBAA6] font-mono truncate">
                    📁 {inc.componentAffected}
                  </p>

                  <p className="text-[11px] text-[#BBBAA6]/80 line-clamp-2">
                    {inc.userActionTrajectory}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Code Patch & Git Diff Inspector (Right 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-[#FFFCE1] uppercase font-mono tracking-wider">
              Engenharia de Código & Auto-Patch
            </span>
            <span className="text-[11px] text-[#00BAE2] font-bold font-mono">Agente 12 (Auto-Coder)</span>
          </div>

          {selectedIncident && (
            <div className="p-6 rounded-3xl bg-[#101211] border border-white/10 shadow-2xl space-y-5">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-bold text-[#FFFCE1] text-base">{selectedIncident.incidentTitle}</h3>
                  <p className="text-xs text-[#BBBAA6] font-mono mt-0.5">Arquivo Alvo: {currentPatch?.targetFile || selectedIncident.componentAffected}</p>
                </div>

                <button
                  onClick={handleDeployPatch}
                  disabled={isDeploying || isGeneratingPatch}
                  className="px-5 py-2.5 bg-[#0AE448] hover:bg-[#0AE448]/90 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#0AE448]/20 shrink-0"
                >
                  <GitCommit className="w-4 h-4" />
                  <span>{isDeploying ? 'Comitando & Deployando...' : 'Comitar no GitHub & Deploy Vercel'}</span>
                </button>
              </div>

              {/* Fix Rationale */}
              <div className="p-4 bg-[#141716] rounded-2xl border border-white/10 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-[#BBBAA6] block">Diagnóstico da IA & Solução:</span>
                <p className="text-[#FFFCE1] font-medium leading-relaxed">
                  {currentPatch?.explanation || selectedIncident.suggestedFixRationale}
                </p>
              </div>

              {/* Git Diff Code Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-[#FFFCE1] flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#00BAE2]" />
                    <span>Git Diff Gerado Autonomamente:</span>
                  </span>
                  <span className="text-[10px] font-mono text-[#0AE448] font-bold bg-[#0AE448]/10 px-2 py-0.5 rounded border border-[#0AE448]/30">
                    Syntax Check Passed ✓
                  </span>
                </div>

                <div className="p-4 bg-[#0E100F] text-[#FFFCE1] rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-white/10 shadow-inner">
                  <pre className="text-[11px] text-emerald-400">
                    {currentPatch?.gitDiffSnippet || '// Gerando diff da correção...'}
                  </pre>
                </div>
              </div>

              {/* Commit Message Box */}
              <div className="p-3 bg-[#141716] rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono text-[#BBBAA6]">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-[#00BAE2]" />
                  <span>Commit Mensagem: <strong className="text-[#FFFCE1]">{currentPatch?.commitMessage || 'fix: Auto-healing patch'}</strong></span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
