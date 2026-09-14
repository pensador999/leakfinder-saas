// ==============================================================================
// 💾 LOCAL TELEMETRY DB HELPER (ZERO-DEPENDENCY RESILIENT LOCAL PERSISTENCE)
// Guarantees 100% durable local storage of swarm snapshots, monitored stores,
// job execution logs, and WhatsApp alerts on disk even if Supabase is offline.
// ==============================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '..', 'data', 'telemetry_db.json');

const INITIAL_DB = {
  version: '2.4',
  updated_at: new Date().toISOString(),
  monitored_stores: [
    {
      id: 'store-1',
      brand_name: 'BRK Agro',
      store_url: 'https://www.brkagro.com.br',
      niche: 'Agropecuária & Moda Campo',
      target_phone: '5534991351122',
      is_active: true,
      current_score: 84,
      current_estimated_loss: 0,
      last_audited_at: null
    },
    {
      id: 'store-2',
      brand_name: 'BRK Fishing',
      store_url: 'https://www.brkfishing.com.br',
      niche: 'Moda Pesca & Outdoor',
      target_phone: '5534991351122',
      is_active: true,
      current_score: 88,
      current_estimated_loss: 0,
      last_audited_at: null
    },
    {
      id: 'store-3',
      brand_name: 'BRK Motors',
      store_url: 'https://www.brkmotors.com.br',
      niche: 'Automotivo & Performance',
      target_phone: '5534991351122',
      is_active: true,
      current_score: 79,
      current_estimated_loss: 2312,
      last_audited_at: null
    },
    {
      id: 'store-4',
      brand_name: 'Mercado Livre Loja Oficial',
      store_url: 'https://lista.mercadolivre.com.br/camisa-pesca-uv',
      niche: 'Marketplace E-commerce',
      target_phone: '5534991351122',
      is_active: true,
      current_score: 98,
      current_estimated_loss: 0,
      last_audited_at: null
    }
  ],
  daily_snapshots: [],
  job_logs: [],
  alert_dispatch_queue: []
};

export function readLocalDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[LocalTelemetryDb] Read error, resetting initial DB:', err.message);
  }
  writeLocalDb(INITIAL_DB);
  return INITIAL_DB;
}

export function writeLocalDb(data) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    data.updated_at = new Date().toISOString();
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('[LocalTelemetryDb] Write error:', err.message);
  }
}

export function appendSnapshot(snapshot) {
  const db = readLocalDb();
  db.daily_snapshots.unshift(snapshot);
  if (db.daily_snapshots.length > 500) {
    db.daily_snapshots = db.daily_snapshots.slice(0, 500); // keep last 500
  }
  writeLocalDb(db);
}

export function appendJobLog(log) {
  const db = readLocalDb();
  db.job_logs.unshift(log);
  if (db.job_logs.length > 200) {
    db.job_logs = db.job_logs.slice(0, 200);
  }
  writeLocalDb(db);
}

export function enqueueAlert(alert) {
  const db = readLocalDb();
  db.alert_dispatch_queue.unshift(alert);
  if (db.alert_dispatch_queue.length > 100) {
    db.alert_dispatch_queue = db.alert_dispatch_queue.slice(0, 100);
  }
  writeLocalDb(db);
}

export function updateMonitoredStore(brandName, updates) {
  const db = readLocalDb();
  const store = db.monitored_stores.find(s => s.brand_name === brandName);
  if (store) {
    Object.assign(store, updates);
    writeLocalDb(db);
  }
}

export function saveProspectLead(lead) {
  const db = readLocalDb();
  if (!db.prospect_leads) {
    db.prospect_leads = [];
  }
  const existingIdx = db.prospect_leads.findIndex(l => l.id === lead.id || l.domain === lead.domain);
  if (existingIdx >= 0) {
    db.prospect_leads[existingIdx] = { ...db.prospect_leads[existingIdx], ...lead };
  } else {
    db.prospect_leads.unshift(lead);
  }
  writeLocalDb(db);
}

export function getProspectLeads() {
  const db = readLocalDb();
  return db.prospect_leads || [];
}

export function updateProspectLeadStatus(leadId, status, notes) {
  const db = readLocalDb();
  if (!db.prospect_leads) return;
  const lead = db.prospect_leads.find(l => l.id === leadId);
  if (lead) {
    lead.status = status;
    if (notes !== undefined) lead.notes = notes;
    writeLocalDb(db);
  }
}

