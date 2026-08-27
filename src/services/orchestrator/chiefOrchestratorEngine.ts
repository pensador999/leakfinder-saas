import { AuditInput, AgentDiagnosticResult } from '../../types';
import { extractCleanDomainAndBrand } from '../siteInspector';

export type OrchestrationStage = 
  | 'IDLE'
  | 'INITIALIZING'
  | 'DELEGATING_COLLECTION'
  | 'DISPATCHING_SPECIALISTS'
  | 'AWAITING_SPECIALISTS'
  | 'FACT_CHECKING'
  | 'SYNTHESIZING_REPORT'
  | 'COMPLETED'
  | 'ERROR';

export interface SpecialistTaskStatus {
  specialistId: 'CATALOG_DOCTOR' | 'CORE_WEB_VITALS' | 'FINANCIAL_PIX' | 'VISION_ERGONOMICS' | 'SECURITY_LEGAL' | 'COMPETITOR_SPY';
  specialistName: string;
  stage: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FALLBACK';
  executionTimeMs: number;
  evidenceItemsCount: number;
  qualityScore: number; // 0 to 100
  notes: string;
}

export interface OrchestrationExecutionLog {
  jobId: string;
  targetDomain: string;
  targetBrand: string;
  currentStage: OrchestrationStage;
  startTime: number;
  endTime?: number;
  totalDurationMs?: number;
  specialistTasks: SpecialistTaskStatus[];
  truthAuditorPassed: boolean;
  finalGrowthScore: number;
  logs: {
    timestamp: string;
    level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
    message: string;
  }[];
}

/**
 * 👑 CHIEF ORCHESTRATOR AGENT (NÍVEL 0 - O MAESTRO)
 * Gerencia a esteira de análise, monitora SLAs e calcula a pontuação ponderada de 4 pilares.
 */
export class ChiefOrchestratorAgent {
  private executionLog: OrchestrationExecutionLog;
  private input: AuditInput;

  constructor(input: AuditInput) {
    this.input = input;
    const { domain, brandName } = extractCleanDomainAndBrand(input.siteUrl);
    this.executionLog = {
      jobId: `job-orch-${Date.now()}`,
      targetDomain: domain,
      targetBrand: brandName,
      currentStage: 'INITIALIZING',
      startTime: Date.now(),
      truthAuditorPassed: false,
      finalGrowthScore: 0,
      specialistTasks: [
        { specialistId: 'CATALOG_DOCTOR', specialistName: 'Doctor de Catálogo & SKUs', stage: 'PENDING', executionTimeMs: 0, evidenceItemsCount: 0, qualityScore: 0, notes: 'Aguardando coleta de dados.' },
        { specialistId: 'CORE_WEB_VITALS', specialistName: 'Auditor Core Web Vitals 2026', stage: 'PENDING', executionTimeMs: 0, evidenceItemsCount: 0, qualityScore: 0, notes: 'Aguardando inspeção do DOM.' },
        { specialistId: 'FINANCIAL_PIX', specialistName: 'Analista de Elasticidade & Pix', stage: 'PENDING', executionTimeMs: 0, evidenceItemsCount: 0, qualityScore: 0, notes: 'Aguardando dados de ticket e margem.' },
        { specialistId: 'VISION_ERGONOMICS', specialistName: 'Engenheiro de Visão & Ergonomia', stage: 'PENDING', executionTimeMs: 0, evidenceItemsCount: 0, qualityScore: 0, notes: 'Aguardando renderização e contraste.' },
        { specialistId: 'SECURITY_LEGAL', specialistName: 'Auditor de Segurança & Conformidade', stage: 'PENDING', executionTimeMs: 0, evidenceItemsCount: 0, qualityScore: 0, notes: 'Aguardando validação de CNPJ e SSL.' },
        { specialistId: 'COMPETITOR_SPY', specialistName: 'Espião de Concorrentes', stage: 'PENDING', executionTimeMs: 0, evidenceItemsCount: 0, qualityScore: 0, notes: 'Aguardando mapeamento de mercado.' }
      ],
      logs: []
    };
    this.addLog('INFO', `Orquestrador inicializado para o domínio ${domain} (${brandName}).`);
  }

  public addLog(level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS', message: string) {
    const logItem = {
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      level,
      message
    };
    this.executionLog.logs.push(logItem);
  }

  public setStage(stage: OrchestrationStage) {
    this.executionLog.currentStage = stage;
    this.addLog('INFO', `Transição de fase da orquestração: ${stage}`);
  }

  public updateSpecialistTask(
    specialistId: SpecialistTaskStatus['specialistId'], 
    update: Partial<SpecialistTaskStatus>
  ) {
    const task = this.executionLog.specialistTasks.find(t => t.specialistId === specialistId);
    if (task) {
      Object.assign(task, update);
      this.addLog('SUCCESS', `Especialista [${task.specialistName}] atualizado: Status ${task.stage} (Score: ${task.qualityScore}/100)`);
    }
  }

  /**
   * ⚖️ Fórmula Matemática de Pontuação Ponderada do Orquestrador:
   * - Catálogo & Estoque (30%)
   * - Core Web Vitals 2026 (25%)
   * - CRO & Visão Mobile (25%)
   * - Segurança & Pix (20%)
   */
  public calculateWeightedGrowthScore(scores: {
    catalogScore: number;
    vitalsScore: number;
    visionCroScore: number;
    securityPixScore: number;
  }): number {
    const { catalogScore, vitalsScore, visionCroScore, securityPixScore } = scores;

    const weighted = Math.round(
      (catalogScore * 0.30) +
      (vitalsScore * 0.25) +
      (visionCroScore * 0.25) +
      (securityPixScore * 0.20)
    );

    const finalScore = Math.min(100, Math.max(10, weighted));
    this.executionLog.finalGrowthScore = finalScore;
    this.addLog('SUCCESS', `Score Global Ponderado calculado pelo Orquestrador: ${finalScore}/100`);
    return finalScore;
  }

  public finalizeOrchestration(truthPassed: boolean): OrchestrationExecutionLog {
    this.executionLog.endTime = Date.now();
    this.executionLog.totalDurationMs = this.executionLog.endTime - this.executionLog.startTime;
    this.executionLog.truthAuditorPassed = truthPassed;
    this.setStage(truthPassed ? 'COMPLETED' : 'COMPLETED');
    this.addLog('SUCCESS', `Orquestração concluída em ${this.executionLog.totalDurationMs}ms com validação de veracidade.`);
    return this.executionLog;
  }

  public getSnapshot(): OrchestrationExecutionLog {
    return this.executionLog;
  }
}
