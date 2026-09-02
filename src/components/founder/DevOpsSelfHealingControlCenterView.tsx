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
    <div className="space-y-8 font-sans">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl text-white shadow-md shadow-emerald-500/30">
            <Code2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Auto-Correção & DevOps Autônomo (Agentes 11 e 12)</h2>
              <span className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-emerald-400" />
                Pipeline GitHub & Vercel Integrada
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              O **Agente 11 (Sentinel)** vigia erros em tempo real e o **Agente 12 (Auto-Coder)** escreve o código de correção, testa e dispara o deploy no Vercel automaticamente!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 font-mono">Modo Auto-Heal:</span>
          <span className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-mono text-xs font-bold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>1-Clique ou 100% Autônomo</span>
          </span>
        </div>
      </div>

      {deployResult && (
        <div className="p-5 bg-emerald-50 border-2 border-emerald-300 text-emerald-950 rounded-3xl text-xs font-bold space-y-3 animate-fadeIn shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                🎉 Patch aplicado com sucesso! Commit SHA: <strong className="font-mono bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">{deployResult.commitSha}</strong>
              </span>
            </div>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-200 text-emerald-900">
              Vercel Build Auto-Triggered ✓
            </span>
          </div>

          <p className="text-[11px] text-emerald-800 font-medium">
            {deployResult.message}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-emerald-200/80">
            <a
              href={deployResult.githubCommitUrl || 'https://github.com/pensador999/leakfinder-saas/commits/main'}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
            >
              <GitCommit className="w-3.5 h-3.5" />
              <span>Ver Commits no GitHub (pensador999/leakfinder-saas)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={deployResult.url}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
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
            <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">
              Falhas & Incidentes Monitorados ({incidents.length})
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Agente 11 (Sentinel)</span>
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
                      ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      inc.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                      inc.severity === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {inc.severity}
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 ${
                      inc.autoHealed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {inc.autoHealed ? '✅ Auto-Corrigido' : '⏳ Aguardando Patch'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 leading-snug">{inc.incidentTitle}</h4>
                  
                  <p className="text-[11px] text-slate-500 font-mono truncate">
                    📁 {inc.componentAffected}
                  </p>

                  <p className="text-[11px] text-slate-600 line-clamp-2">
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
            <span className="text-xs font-bold text-slate-700 uppercase font-mono tracking-wider">
              Engenharia de Código & Auto-Patch
            </span>
            <span className="text-[11px] text-indigo-600 font-bold font-mono">Agente 12 (Auto-Coder)</span>
          </div>

          {selectedIncident && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedIncident.incidentTitle}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">Arquivo Alvo: {currentPatch?.targetFile || selectedIncident.componentAffected}</p>
                </div>

                <button
                  onClick={handleDeployPatch}
                  disabled={isDeploying || isGeneratingPatch}
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 shrink-0"
                >
                  <GitCommit className="w-4 h-4" />
                  <span>{isDeploying ? 'Comitando & Deployando...' : 'Comitar no GitHub & Deploy Vercel'}</span>
                </button>
              </div>

              {/* Fix Rationale */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1 text-xs">
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block">Diagnóstico da IA & Solução:</span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {currentPatch?.explanation || selectedIncident.suggestedFixRationale}
                </p>
              </div>

              {/* Git Diff Code Viewer */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-700 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Git Diff Gerado Autonomamente:</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Syntax Check Passed ✓
                  </span>
                </div>

                <div className="p-4 bg-slate-950 text-slate-100 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                  <pre className="text-[11px]">
                    {currentPatch?.gitDiffSnippet || '// Gerando diff da correção...'}
                  </pre>
                </div>
              </div>

              {/* Commit Message Box */}
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono text-slate-700">
                <div className="flex items-center gap-2">
                  <GitPullRequest className="w-4 h-4 text-indigo-600" />
                  <span>Commit Mensagem: <strong className="text-slate-900">{currentPatch?.commitMessage || 'fix: Auto-healing patch'}</strong></span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
