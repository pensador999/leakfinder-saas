// ==============================================================================
// 🌐 VERTICAL CONTEXT INJECTOR (ADSHIELD 2026)
// Injeta dinamicamente o contexto vertical (nicho, curva gaussiana, vocabulário,
// benchmarks de CPC e ERP dominante) nos system prompts de todos os 18 agentes.
// ==============================================================================

import { resolveDynamicVertical, DynamicVerticalProfile, SupportedVerticalId } from './dynamicVerticalContext';
import { MASTER_SWARM_AGENTS, SwarmAgentDefinition } from './prompts/masterSwarmPrompts';

export interface VerticalizedPromptSet {
  verticalProfile: DynamicVerticalProfile;
  agentPrompts: Map<string, string>; // agentId -> verticalizado system prompt
  nicheDetectedFrom: string;
}

/**
 * Gera o bloco de contexto vertical que será injetado no final de cada system prompt.
 */
function buildVerticalContextBlock(vertical: DynamicVerticalProfile): string {
  const demandEntries = Object.entries(vertical.gaussianDemandDistribution)
    .sort((a, b) => b[1] - a[1])
    .map(([size, pct]) => `${size}: ${pct}%`)
    .join(', ');

  return `
---
### 🌐 CONTEXTO VERTICAL ATIVO: ${vertical.label}
- **Nicho:** ${vertical.verticalId}
- **Público-Alvo:** ${vertical.targetDemographics}
- **Polos Geográficos:** ${vertical.geographicPoles.join(', ')}
- **Ticket Médio Setorial:** R$ ${vertical.averageTicketBRL.toFixed(2)}
- **CPC Benchmark Meta Ads:** R$ ${vertical.benchmarkMetaAdsCpcBRL.toFixed(2)}
- **CVR Baseline do Nicho:** ${vertical.baselineCvrPct}%
- **Taxa de Devolução do Nicho:** ${vertical.averageReturnRatePct}%
- **Curva Gaussiana de Demanda:** ${demandEntries}
- **Tamanhos de Alto Giro (NUNCA podem faltar):** ${vertical.coreDemandSizes.join(', ')}
- **Tamanhos Secundários:** ${vertical.secondaryDemandSizes.join(', ')}
- **ERP Dominante no Nicho:** ${vertical.dominantTechStack.primaryErp}
- **Hub de Integração:** ${vertical.dominantTechStack.primaryHub}
- **Latência Típica de Sync ERP→Loja:** ${vertical.dominantTechStack.typicalSyncLatencyMinutes} minutos
- **Comportamento de Estoque:** ${vertical.dominantTechStack.inventoryPolicyBehavior}
- **Vocabulário Visceral do Setor:** ${vertical.vocabulary.industryTerms.join(' | ')}
- **Gatilhos de Urgência:** ${vertical.vocabulary.urgencyTriggers.join(' | ')}
- **Padrões de Isenção de Catálogo:** ${vertical.catalogExemptionPatterns.join(', ')}
- **Keywords de Backorder Aceito:** ${vertical.allowBackorderKeywords.join(', ')}
- **Features Obrigatórias no PDP:** ${vertical.mandatoryProductFeatures.join(' | ')}
---
USE este contexto vertical para calibrar todas as suas análises, cálculos de sangria, recomendações de CRO e alertas ao nicho específico desta loja.
`;
}

/**
 * Gera o system prompt verticalizado para um agente específico.
 */
export function getVerticalizedSystemPrompt(
  agent: SwarmAgentDefinition,
  vertical: DynamicVerticalProfile
): string {
  return agent.systemPrompt + '\\n' + buildVerticalContextBlock(vertical);
}

/**
 * Gera o conjunto completo de prompts verticalizados para todos os 18 agentes.
 * @param nicheRawInput - Texto bruto para detectar o nicho (ex: título de produto, URL, categoria)
 * @returns Mapa completo de agentId -> prompt verticalizado
 */
export function injectVerticalContextForAllAgents(
  nicheRawInput: string
): VerticalizedPromptSet {
  const vertical = resolveDynamicVertical(nicheRawInput);
  const agentPrompts = new Map<string, string>();

  for (const agent of MASTER_SWARM_AGENTS) {
    agentPrompts.set(agent.id, getVerticalizedSystemPrompt(agent, vertical));
  }

  return {
    verticalProfile: vertical,
    agentPrompts,
    nicheDetectedFrom: nicheRawInput
  };
}

/**
 * Gera prompt verticalizado para um agente específico por ID.
 */
export function getVerticalizedPromptById(
  agentId: string,
  nicheRawInput: string
): string | null {
  const agent = MASTER_SWARM_AGENTS.find(a => a.id === agentId);
  if (!agent) return null;
  const vertical = resolveDynamicVertical(nicheRawInput);
  return getVerticalizedSystemPrompt(agent, vertical);
}

/**
 * Retorna o bloco de contexto vertical isolado (para uso em componentes UI).
 */
export function getVerticalContextSummary(
  nicheRawInput: string
): { label: string; coreSizes: string[]; ticket: number; cpc: number; vertical: DynamicVerticalProfile } {
  const v = resolveDynamicVertical(nicheRawInput);
  return {
    label: v.label,
    coreSizes: v.coreDemandSizes,
    ticket: v.averageTicketBRL,
    cpc: v.benchmarkMetaAdsCpcBRL,
    vertical: v
  };
}
