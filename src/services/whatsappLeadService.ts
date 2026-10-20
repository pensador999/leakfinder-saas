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
}

const PRIMARY_STORAGE_KEY = 'ADSHIELD_CAPTURED_LEADS';
const LEGACY_STORAGE_KEY = 'LEAKFINDER_CAPTURED_LEADS';

export function getStoredLeads(): CapturedLead[] {
  try {
    const raw = localStorage.getItem(PRIMARY_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLead(lead: Omit<CapturedLead, 'id' | 'capturedAt' | 'status'>): CapturedLead {
  const existing = getStoredLeads();
  const newLead: CapturedLead = {
    ...lead,
    id: 'lead-' + Date.now(),
    capturedAt: new Date().toLocaleString('pt-BR'),
    status: 'NOVO'
  };

  const updated = [newLead, ...existing];
  localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(updated));

  if (isSupabaseConfigured) {
    let storeDomain = lead.storeUrl;
    try {
      storeDomain = new URL(lead.storeUrl.startsWith('http') ? lead.storeUrl : `https://${lead.storeUrl}`).hostname;
    } catch {}

    supabase.from('leads').insert({
      store_url: lead.storeUrl,
      store_domain: storeDomain,
      contact_name: lead.merchantName,
      contact_phone: lead.whatsappNumber,
      contact_email: '', 
      source: 'manual',
      notes: `Brand: ${lead.brandName} | Score: ${lead.growthScore} | Loss: ${lead.estimatedLossRevenue}`,
    }).then(({ error }: { error: any }) => {
      if (error) console.warn('[LeadService] Supabase save failed:', error.message);
    });
  }

  return newLead;
}

export function formatWhatsAppMessage(
  merchantName: string,
  brandName: string,
  domain: string,
  growthScore: number,
  estimatedLossRevenue: number,
  reportUrl: string
): string {
  return `🚨 *DIAGNÓSTICO EXECUTIVO ADSHIELD* 🚨

Olá *${merchantName || 'Lojista'}*, acabamos de rodar a auditoria técnica e financeira da sua loja *${brandName}* (${domain}):

📊 *AdShield Growth Score:* ${growthScore}/100
💰 *Sangria Estimada em Tráfego & Carrinho:* R$ ${estimatedLossRevenue.toLocaleString('pt-BR')}/mês
⚡ *Core Web Vitals 2026:* Avaliado (LCP + INP)
📦 *Catálogo & Estoque:* SKUs inspecionados

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
