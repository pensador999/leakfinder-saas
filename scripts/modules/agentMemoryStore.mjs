// ==============================================================================
// 🧠 AGENT MEMORY STORE (CoALA ARCHITECTURE) — SKILL: agent-memory-systems
// Cognitive long-term memory for AdShield Swarm:
// - Semantic Memory: Brands, product schemas, verified SKUs
// - Episodic Memory: Rupture history, duration streaks, historical ad loss
// - Procedural Memory: Proven supply chain playbooks (PCP textile vs supplier PO)
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const memoryFilePath = path.resolve(__dirname, '..', '..', 'data', 'agent_memory_store.json');

/**
 * Initializes or loads the agent memory store from disk.
 */
export function loadAgentMemory() {
  if (!fs.existsSync(memoryFilePath)) {
    const initialMemory = {
      version: '2026.4',
      last_updated: new Date().toISOString(),
      semantic: {
        registered_brands: {},
        catalog_skus: {}
      },
      episodic: {
        incident_streaks: {},
        cumulative_losses: {}
      },
      procedural: {
        supply_playbooks: {
          FABRICACAO_PROPRIA: 'Emitir Ordem de Produção (OP) de corte e sublimação no Sankhya ERP PCP.',
          REVENDA_EXTERNA: 'Emitir Pedido de Compra (PO) ao fornecedor homologado ou pausar criativo no Meta Ads.'
        }
      }
    };
    fs.mkdirSync(path.dirname(memoryFilePath), { recursive: true });
    fs.writeFileSync(memoryFilePath, JSON.stringify(initialMemory, null, 2), 'utf8');
    return initialMemory;
  }

  try {
    return JSON.parse(fs.readFileSync(memoryFilePath, 'utf8'));
  } catch {
    return { semantic: {}, episodic: {}, procedural: {} };
  }
}

/**
 * Commits updated agent memory to disk.
 */
export function saveAgentMemory(memory) {
  try {
    memory.last_updated = new Date().toISOString();
    fs.writeFileSync(memoryFilePath, JSON.stringify(memory, null, 2), 'utf8');
  } catch (err) {
    console.warn(`⚠️ [Agent Memory] Falha ao persistir memória no disco:`, err.message);
  }
}

/**
 * Records or updates an episodic memory entry for an identified rupture.
 */
export function recordEpisodicIncident(brand, productTitle, missingSizes, estimatedLoss) {
  const mem = loadAgentMemory();
  const productKey = `${brand}::${productTitle}`;

  if (!mem.episodic.incident_streaks[productKey]) {
    mem.episodic.incident_streaks[productKey] = {
      first_seen: new Date().toISOString(),
      last_seen: new Date().toISOString(),
      detection_cycles: 1,
      missing_sizes: missingSizes,
      cumulative_loss_brl: estimatedLoss
    };
  } else {
    const entry = mem.episodic.incident_streaks[productKey];
    entry.last_seen = new Date().toISOString();
    entry.detection_cycles += 1;
    entry.missing_sizes = Array.from(new Set([...entry.missing_sizes, ...missingSizes]));
    entry.cumulative_loss_brl += Math.round(estimatedLoss / 30); // Incremento proporcional diário
  }

  // Update cumulative loss by brand
  mem.episodic.cumulative_losses[brand] = (mem.episodic.cumulative_losses[brand] || 0) + estimatedLoss;

  saveAgentMemory(mem);
  return mem.episodic.incident_streaks[productKey];
}

/**
 * Retrieves memory context for a specific product to enrich agent decision-making.
 */
export function queryProductMemory(brand, productTitle) {
  const mem = loadAgentMemory();
  const productKey = `${brand}::${productTitle}`;
  return mem.episodic.incident_streaks[productKey] || null;
}
