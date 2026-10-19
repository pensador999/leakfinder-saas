import { 
  MASTER_SWARM_AGENTS, 
  getSwarmAgentById, 
  getAllSwarmAgents, 
  type SwarmAgentDefinition 
} from '../services/ai/prompts/masterSwarmPrompts.ts';
import { getVerticalizedPromptById } from '../services/ai/verticalContextInjector.ts';

// Knowledge Bases unificadas com os prompts maximizados dos 18 agentes no modo Conselheiro de Negócios
export const agentKnowledgeBases = {
  cro: {
    name: 'Arquiteto de Conversão (CRO)',
    systemPrompt: getSwarmAgentById('agent-10')?.systemPrompt || '',
  },
  copywriter: {
    name: 'Persuasor de Vendas & Copywriting',
    systemPrompt: getSwarmAgentById('agent-08')?.systemPrompt || '',
  },
  ads: {
    name: 'Media Buyer Sênior & Ads Risk',
    systemPrompt: getSwarmAgentById('agent-05')?.systemPrompt || '',
  },
  pmGrowth: {
    name: 'Estrategista Chefe (CEO do Enxame)',
    systemPrompt: getSwarmAgentById('agent-01')?.systemPrompt || '',
  },
  seo: {
    name: 'Engenheiro Orgânico & Core Web Vitals',
    systemPrompt: getSwarmAgentById('agent-12')?.systemPrompt || '',
  },
  catalogDoctor: {
    name: 'Doutor de Catálogo Universal',
    systemPrompt: getSwarmAgentById('agent-09')?.systemPrompt || '',
  },
  truthAuditor: {
    name: 'Auditor de Verdade & Grounding',
    systemPrompt: getSwarmAgentById('agent-03')?.systemPrompt || '',
  },
  supplyChain: {
    name: 'Auditor de Estoque Físico (ERP)',
    systemPrompt: getSwarmAgentById('agent-13')?.systemPrompt || '',
  }
};

export function getVerticalizedAgentPrompt(agentId: string, nicheRawInput: string, fallbackPrompt: string = ''): string {
  return getVerticalizedPromptById(agentId, nicheRawInput) || getSwarmAgentById(agentId)?.systemPrompt || fallbackPrompt;
}

export { MASTER_SWARM_AGENTS, getSwarmAgentById, getAllSwarmAgents, type SwarmAgentDefinition };

