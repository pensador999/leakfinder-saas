// ==============================================================================
// 🛡️ AGENT 11: DEVOPS SENTINEL & ERROR TELEMETRY AUDITOR
// Captures runtime exceptions, UX rage clicks, failed API calls, and broken user journeys,
// synthesizing structured incident reports for the AI Code Patch Engineer.
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../../lib/supabase.ts';

export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface BugIncidentReport {
  id: string;
  incidentTitle: string;
  timestamp: string;
  severity: IncidentSeverity;
  componentAffected: string;
  userActionTrajectory: string;
  rawErrorMessage: string;
  stackTraceSample: string;
  suggestedFixRationale: string;
  patchStatus: 'DETECTADO' | 'PATCH_GERADO' | 'APLICADO_GITHUB' | 'DEPLOYED_VERCEL';
  autoHealed: boolean;
}

export const INITIAL_BUG_INCIDENTS: BugIncidentReport[] = [
  {
    id: 'inc-101',
    incidentTitle: 'Deduplicação e Limite de Lojas no Radar LocalStorage',
    timestamp: 'Hoje às 09:50 AM',
    severity: 'HIGH',
    componentAffected: 'MonitoredStoresManagerModal.tsx & swarmDatabaseService.ts',
    userActionTrajectory: 'Usuário adicionou 3ª loja no modal de radar -> recarregamento sobrescrevia a lista para os 2 itens padrão.',
    rawErrorMessage: 'State overwrite on loadStores() due to static defaultStores array reset.',
    stackTraceSample: 'at getMonitoredStores (swarmDatabaseService.ts:45)\nat loadStores (MonitoredStoresManagerModal.tsx:43)',
    suggestedFixRationale: 'Implementar Merge Canônico por Map(storeUrl) unindo Supabase + LocalStorage + DefaultStores e adicionar botão delete.',
    patchStatus: 'DEPLOYED_VERCEL',
    autoHealed: true
  },
  {
    id: 'inc-102',
    incidentTitle: 'Chips de Perguntas Repetitivas no Concierge Chat',
    timestamp: 'Hoje às 09:30 AM',
    severity: 'MEDIUM',
    componentAffected: 'FloatingAiChatWidget.tsx & conciergeNeuralMasterBrain.ts',
    userActionTrajectory: 'Usuário enviou 3 perguntas seguidas -> os chips de sugestão rápida continuavam oferecendo "Como funciona a auditoria?".',
    rawErrorMessage: 'Static suggestedQuickReplies array rendered without filtering conversation history.',
    stackTraceSample: 'at askConciergeMasterBrain (conciergeNeuralMasterBrain.ts:210)\nat handleSendMessage (FloatingAiChatWidget.tsx:85)',
    suggestedFixRationale: 'Adicionar filtro de eliminação de histórico getFreshNonRepetitiveQuickReplies com pool de 40+ perguntas evolutivas em 6 etapas.',
    patchStatus: 'DEPLOYED_VERCEL',
    autoHealed: true
  },
  {
    id: 'inc-103',
    incidentTitle: 'Validação de Telefone DDD no Lead Capture Flutuante',
    timestamp: 'Hoje às 09:40 AM',
    severity: 'LOW',
    componentAffected: 'FloatingAiChatWidget.tsx:110',
    userActionTrajectory: 'Usuário enviou campo de telefone vazio ou com menos de 8 dígitos.',
    rawErrorMessage: 'Input submitted without sanitizing cleanPhone.length check.',
    stackTraceSample: 'at handleCaptureLeadPhone (FloatingAiChatWidget.tsx:115)',
    suggestedFixRationale: 'Adicionar regex replace(/\\D/g, "") com barreira de >= 8 dígitos antes de enviar para alert_dispatch_queue.',
    patchStatus: 'DEPLOYED_VERCEL',
    autoHealed: true
  }
];

let memoryIncidents: BugIncidentReport[] = [...INITIAL_BUG_INCIDENTS];

/**
 * Captures real-time client errors and logs them into incident tracking
 */
export function recordDevOpsIncident(
  error: Error,
  componentName: string,
  userAction: string,
  severity: IncidentSeverity = 'HIGH'
): BugIncidentReport {
  const newIncident: BugIncidentReport = {
    id: `inc-${Date.now()}`,
    incidentTitle: `Falha em ${componentName}: ${error.message.slice(0, 60)}`,
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    severity,
    componentAffected: componentName,
    userActionTrajectory: userAction,
    rawErrorMessage: error.message,
    stackTraceSample: error.stack?.slice(0, 200) || 'N/A',
    suggestedFixRationale: `Análise autônoma em andamento para o componente ${componentName}.`,
    patchStatus: 'DETECTADO',
    autoHealed: false
  };

  memoryIncidents = [newIncident, ...memoryIncidents].slice(0, 30);

  // Persist incident in localStorage when available
  try {
    if (typeof localStorage !== 'undefined') {
      const existing = localStorage.getItem('adshield_devops_incidents');
      const list: BugIncidentReport[] = existing ? JSON.parse(existing) : INITIAL_BUG_INCIDENTS;
      const updated = [newIncident, ...list];
      localStorage.setItem('adshield_devops_incidents', JSON.stringify(updated.slice(0, 30)));
    }
  } catch {}

  return newIncident;
}

/**
 * Fetches all tracked DevOps incident reports
 */
export async function fetchDevOpsIncidents(): Promise<BugIncidentReport[]> {
  try {
    if (typeof localStorage !== 'undefined') {
      const local = localStorage.getItem('adshield_devops_incidents');
      if (local) {
        return JSON.parse(local);
      }
    }
  } catch {}

  return memoryIncidents;
}
