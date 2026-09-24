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
