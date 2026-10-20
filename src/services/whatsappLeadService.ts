import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface CapturedLead {
  id: string;
  merchantName: string;
  whatsappNumber: string;
  storeUrl: string;
  brandName: string;
  estimatedLossRevenue: number;
  growthScore: number;
  capturedAt: string;
  status: 'NOVO' | 'CONTATADO' | 'REUNIAO_AGENDADA' | 'CLIENTE_FECHADO';
  source?: 'WHATSAPP_FUNNEL' | 'BATCH_AUDITOR' | 'LEAD_SNIPER' | 'MANUAL';
  topBrokenSku?: string;
  customPitch?: string;
}

const PRIMARY_STORAGE_KEY = 'ADSHIELD_CAPTURED_LEADS';
const LEGACY_STORAGE_KEY = 'LEAKFINDER_CAPTURED_LEADS';
const PROSPECT_STORAGE_KEY = 'adshield_custom_prospect_leads';

const memoryLeadStore = new Map<string, string>();

function safeGetStorageItem(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function') {
      return localStorage.getItem(key);
    }
  } catch {}
  return memoryLeadStore.get(key) ?? null;
}

function safeSetStorageItem(key: string, value: string): void {
  memoryLeadStore.set(key, value);
  try {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(key, value);
    }
  } catch {}
}

export function getStoredLeads(): CapturedLead[] {
  const mergedMap = new Map<string, CapturedLead>();

  try {
    const rawPrimary = safeGetStorageItem(PRIMARY_STORAGE_KEY) || safeGetStorageItem(LEGACY_STORAGE_KEY);
    if (rawPrimary) {
      const primaryList: CapturedLead[] = JSON.parse(rawPrimary);
      if (Array.isArray(primaryList)) {
        for (const item of primaryList) {
          const key = (item.storeUrl || item.id).toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
          mergedMap.set(key, {
            ...item,
            source: item.source || 'WHATSAPP_FUNNEL'
          });
        }
      }
    }
  } catch {
    // ignore
  }

  // Também unifica os leads salvos via Scanner em Lote / Lead Sniper / Founder HQ (adshield_custom_prospect_leads)
  try {
    const rawProspects = safeGetStorageItem(PROSPECT_STORAGE_KEY);
    if (rawProspects) {
      const prospectList: any[] = JSON.parse(rawProspects);
      if (Array.isArray(prospectList)) {
        for (const p of prospectList) {
          const domainKey = String(p.domain || p.storeUrl || p.id || '').toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
          if (!domainKey || mergedMap.has(domainKey)) continue;
          const mappedStatus: CapturedLead['status'] =
            p.status === 'FECHADO' ? 'CLIENTE_FECHADO' :
            p.status === 'REUNIAO_AGENDADA' ? 'REUNIAO_AGENDADA' :
            p.status === 'ABORDADO' ? 'CONTATADO' : 'NOVO';

          mergedMap.set(domainKey, {
            id: p.id || `lead-${domainKey}`,
            merchantName: p.contactPerson || `Decisor (${p.brandName || domainKey})`,
            whatsappNumber: p.contactWhatsApp || '',
            storeUrl: p.domain?.startsWith('http') ? p.domain : `https://${p.domain}`,
            brandName: p.brandName || domainKey,
            estimatedLossRevenue: Number(p.estimatedMonthlyLoss) || 0,
            growthScore: Number(p.growthScore) || 72,
            capturedAt: p.capturedAt || new Date().toLocaleDateString('pt-BR'),
            status: mappedStatus,
            source: 'BATCH_AUDITOR',
            topBrokenSku: p.criticalDefect,
            customPitch: p.outreachPitch
          });
        }
      }
    }
  } catch {
    // ignore
  }

  return Array.from(mergedMap.values());
}

export function updateLeadStatus(leadId: string, status: CapturedLead['status']): CapturedLead[] {
  const current = getStoredLeads();
  const updated = current.map(item => item.id === leadId ? { ...item, status } : item);
  safeSetStorageItem(PRIMARY_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteStoredLead(leadId: string): CapturedLead[] {
  const current = getStoredLeads();
  const updated = current.filter(item => item.id !== leadId);
  safeSetStorageItem(PRIMARY_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function saveLead(lead: Omit<CapturedLead, 'id' | 'capturedAt' | 'status'>): CapturedLead {
  const existing = getStoredLeads();
  const newLead: CapturedLead = {
    ...lead,
    id: 'lead-' + Date.now(),
    capturedAt: new Date().toLocaleString('pt-BR'),
    status: 'NOVO',
    source: lead.source || 'WHATSAPP_FUNNEL'
  };

  const cleanDomain = (lead.storeUrl || '').toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
  const filtered = existing.filter(
    item => (item.storeUrl || '').toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '') !== cleanDomain
  );
  const updated = [newLead, ...filtered];
  safeSetStorageItem(PRIMARY_STORAGE_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured) {
    let storeDomain = lead.storeUrl;
    try {
      storeDomain = new URL(lead.storeUrl.startsWith('http') ? lead.storeUrl : `https://${lead.storeUrl}`).hostname;
    } catch {}

    try {
      Promise.resolve(
        supabase.from('leads').insert({
          store_url: lead.storeUrl,
          store_domain: storeDomain,
          contact_name: lead.merchantName,
          contact_phone: lead.whatsappNumber,
          contact_email: '', 
          source: 'manual',
          notes: `Brand: ${lead.brandName} | Score: ${lead.growthScore} | Loss: ${lead.estimatedLossRevenue}`,
        })
      ).catch(() => {});
    } catch {}
  }

  return newLead;
}

export function formatWhatsAppMessage(
  merchantName: string,
  brandName: string,
  domain: string,
  growthScore: number,
  estimatedLossRevenue: number,
  reportUrl: string,
  topBrokenProductTitle?: string,
  topBrokenSizes?: string[]
): string {
  const skuHighlight = topBrokenProductTitle
    ? `\n🎯 *SKU Crítico Detectado:* "${topBrokenProductTitle}"${topBrokenSizes && topBrokenSizes.length > 0 ? ` (Grade furada: ${topBrokenSizes.join(', ')})` : ''}`
    : '';

  return `🚨 *DIAGNÓSTICO EXECUTIVO ADSHIELD* 🚨

Olá *${merchantName || 'Lojista'}*, acabamos de rodar a auditoria técnica e financeira da sua loja *${brandName}* (${domain}):

📊 *AdShield Growth Score:* ${growthScore}/100
💰 *Sangria Estimada em Tráfego & Carrinho:* R$ ${estimatedLossRevenue.toLocaleString('pt-BR')}/mês${skuHighlight}
⚡ *Core Web Vitals 2026:* Avaliado (LCP + INP)
📦 *Catálogo & Estoque:* SKUs inspecionados ao vivo

📄 *Acesse o seu Relatório Executivo Diagramado:*
${reportUrl}

🛠️ *Gostaria de aplicar os códigos de correção e estancar esse vazamento hoje?*
Responda esta mensagem para agendarmos uma sessão de implementação rápida de 15 minutos!`;
}

export function generateWhatsAppLink(cleanPhone: string, message: string): string {
  // Remove non-numeric characters
  const digitsOnly = cleanPhone.replace(/\D/g, '');
  const phoneWithCountry = digitsOnly.startsWith('55') ? digitsOnly : `55${digitsOnly}`;
  const encodedText = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodedText}`;
}
