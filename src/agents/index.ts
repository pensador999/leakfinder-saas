import croAgentPrompt from './prompts/cro_agent.md?raw';
import copyAgentPrompt from './prompts/copy_agent.md?raw';
import adsAgentPrompt from './prompts/ads_agent.md?raw';
import pmGrowthAgentPrompt from './prompts/pm_growth_agent.md?raw';
import seoAgentPrompt from './prompts/seo_agent.md?raw';

import { 
  MASTER_SWARM_AGENTS, 
  getSwarmAgentById, 
  getAllSwarmAgents, 
  type SwarmAgentDefinition 
} from '../services/ai/prompts/masterSwarmPrompts.ts';

// Knowledge Bases unificadas com os prompts maximizados dos 18 agentes no modo Conselheiro de Negócios
export const agentKnowledgeBases = {
  cro: {
    name: 'Arquiteto de Conversão (CRO)',
    systemPrompt: getSwarmAgentById('agent-10')?.systemPrompt || croAgentPrompt,
  },
  copywriter: {
    name: 'Persuasor de Vendas & Copywriting',
    systemPrompt: getSwarmAgentById('agent-08')?.systemPrompt || copyAgentPrompt,
  },
  ads: {
    name: 'Media Buyer Sênior & Ads Risk',
    systemPrompt: getSwarmAgentById('agent-05')?.systemPrompt || adsAgentPrompt,
  },
  pmGrowth: {
    name: 'Estrategista Chefe (CEO do Enxame)',
    systemPrompt: getSwarmAgentById('agent-01')?.systemPrompt || pmGrowthAgentPrompt,
  },
  seo: {
    name: 'Engenheiro Orgânico & Core Web Vitals',
    systemPrompt: getSwarmAgentById('agent-12')?.systemPrompt || seoAgentPrompt,
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

export { MASTER_SWARM_AGENTS, getSwarmAgentById, getAllSwarmAgents, type SwarmAgentDefinition };
