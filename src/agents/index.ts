import croAgentPrompt from './prompts/cro_agent.md?raw';
import copyAgentPrompt from './prompts/copy_agent.md?raw';
import adsAgentPrompt from './prompts/ads_agent.md?raw';
import pmGrowthAgentPrompt from './prompts/pm_growth_agent.md?raw';
import seoAgentPrompt from './prompts/seo_agent.md?raw';

export const agentKnowledgeBases = {
  cro: {
    name: 'Arquiteto de Conversão',
    systemPrompt: croAgentPrompt,
  },
  copywriter: {
    name: 'Persuasor de Vendas',
    systemPrompt: copyAgentPrompt,
  },
  ads: {
    name: 'Media Buyer Sênior',
    systemPrompt: adsAgentPrompt,
  },
  pmGrowth: {
    name: 'Estrategista de Crescimento',
    systemPrompt: pmGrowthAgentPrompt,
  },
  seo: {
    name: 'Engenheiro Orgânico',
    systemPrompt: seoAgentPrompt,
  }
};
