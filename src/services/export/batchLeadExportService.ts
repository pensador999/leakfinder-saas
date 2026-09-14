// ==============================================================================
// 📊 BATCH LEAD EXPORT SERVICE & BULK PROSPECTING HUB
// Skill: growth-outbound-closer + software-architecture
// Normaliza dados de leads do Lead Sniper para disparadores em massa de WhatsApp
// (Evolution API, Z-API, Botconversa) e CRMs B2B (HubSpot, Pipedrive, RD Station).
// ==============================================================================

import { ProspectLead } from '../prospecting/leadSniperEngine';

export type ExportTargetFormat = 
  | 'EXCEL_BR' 
  | 'WHATSAPP_BULK' 
  | 'CRM_B2B' 
  | 'JSON_AUTOMATION';

/**
 * Normaliza qualquer número de telefone brasileiro para o padrão E.164 (55 + DDD + 9 dígitos)
 */
export function normalizePhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '5534991351122';

  // Se já tem DDI 55
  if (digits.startsWith('55')) {
    return digits;
  }

  // Se tem DDD de 2 dígitos (ex: 34991351122 -> 5534991351122)
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }

  return `55${digits}`;
}

/**
 * Gera variações de saudação e abertura (Spintax) para proteção anti-bloqueio no WhatsApp
 */
export function generateSpintaxPitch(lead: ProspectLead, index: number): string {
  const greetings = [
    'Fala, tudo bem? 👊',
    'Opa, tudo certo? 🤝',
    'Olá, como vai? ⚡',
    'Tudo bem por aí? 🎯'
  ];

  const openingHooks = [
    `Passamos nosso scanner de auditoria na vitrine da *${lead.brandName}* e cruzamos com os anúncios ativos de vocês no Meta Ads:`,
    `Fizemos uma varredura técnica de estoque no site da *${lead.brandName}* confrontando com a biblioteca de anúncios da Meta:`,
    `Identificamos uma oportunidade crítica de estancar perda de tráfego na vitrine da *${lead.brandName}* via Meta Ads:`
  ];

  const greeting = greetings[index % greetings.length];
  const opening = openingHooks[index % openingHooks.length];
  const primarySku = lead.primaryBrokenSku;
  const missingSizes = (primarySku.missingSizes || []).join(' e ') || 'M e G';
  const formattedWaste = lead.totalMonthlyWasteEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  const formattedPrice = primarySku.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  return `${greeting} ${opening}

Vocês estão promovendo o produto *"${primarySku.productTitle}"* (R$ ${formattedPrice}), mas os tamanhos centrais *${missingSizes}* estão esgotados na loja.

Como ${missingSizes} respondem por cerca de 65% das vendas no Brasil, aproximadamente 65% dos cliques viram tráfego perdido sem conversão (calculamos um desperdício de ~*R$ ${formattedWaste}/mês*).

Geramos um dossiê confidencial de 1 página com o flagrante e o link para pausar o criativo antes de queimar mais verba.

Quer que eu te envie o link aqui pelo WhatsApp? É só responder *"QUERO"*.`;
}

export class BatchLeadExportService {
  /**
   * Dispara o download seguro de arquivos de texto/CSV no navegador
   */
  private static triggerDownload(content: string, filename: string, mimeType: string = 'text/csv;charset=utf-8;'): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * 🟢 Formato 1: Excel Brasil (.CSV com ponto-e-vírgula e UTF-8 com BOM)
   */
  public static generateExcelBrCsv(leads: ProspectLead[]): string {
    const headers = [
      'Nome da Marca',
      'URL da Loja',
      'Nicho de Mercado',
      'Status no CRM',
      'Meta Pixel Instalado',
      'Link Meta Ads Library',
      'Produto com Ruptura',
      'Preço de Venda (R$)',
      'Tamanhos Esgotados',
      'Desperdício Mensal Estimado (R$)',
      'WhatsApp Normalizado',
      'Score ICE',
      'Pitch WhatsApp Anti-Bloqueio',
      'Link Click-to-Chat Pronto'
    ];

    const rows = leads.map((lead, idx) => {
      const primarySku = lead.primaryBrokenSku;
      const cleanPhone = normalizePhoneForWhatsApp(lead.contactTargetPhone);
      const pitch = generateSpintaxPitch(lead, idx);
      const clickToChatUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(pitch)}`;

      return [
        `"${lead.brandName.replace(/"/g, '""')}"`,
        `"${lead.storeUrl}"`,
        `"${lead.niche.replace(/"/g, '""')}"`,
        `"${lead.status}"`,
        `"${lead.hasMetaPixel ? 'Sim (Ativo)' : 'Não'}"`,
        `"${lead.metaAdsLibraryUrl}"`,
        `"${primarySku.productTitle.replace(/"/g, '""')}"`,
        primarySku.price.toFixed(2).replace('.', ','),
        `"${primarySku.missingSizes.join(', ')}"`,
        lead.totalMonthlyWasteEstimated.toFixed(2).replace('.', ','),
        `"${cleanPhone}"`,
        lead.iceScore.toFixed(1).replace('.', ','),
        `"${pitch.replace(/"/g, '""')}"`,
        `"${clickToChatUrl}"`
      ];
    });

    return '\uFEFF' + [
      headers.join(';'),
      ...rows.map(row => row.join(';'))
    ].join('\r\n');
  }

  /**
   * 📲 Formato 2: Disparadores de WhatsApp em Massa (Evolution API, Z-API, Botconversa)
   * Colunas: phone, name, message, sku, waste_amount, cta_link
   */
  public static generateWhatsAppBulkCsv(leads: ProspectLead[]): string {
    const headers = [
      'phone',
      'name',
      'message',
      'product_title',
      'missing_sizes',
      'monthly_waste_brl',
      'meta_ads_url'
    ];

    const rows = leads.map((lead, idx) => {
      const primarySku = lead.primaryBrokenSku;
      const cleanPhone = normalizePhoneForWhatsApp(lead.contactTargetPhone);
      const pitch = generateSpintaxPitch(lead, idx);

      return [
        cleanPhone,
        `"${lead.brandName.replace(/"/g, '""')}"`,
        `"${pitch.replace(/"/g, '""')}"`,
        `"${primarySku.productTitle.replace(/"/g, '""')}"`,
        `"${primarySku.missingSizes.join(', ')}"`,
        lead.totalMonthlyWasteEstimated.toFixed(2),
        `"${lead.metaAdsLibraryUrl}"`
      ];
    });

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\r\n');
  }

  /**
   * 💼 Formato 3: CRMs B2B (HubSpot, Pipedrive, RD Station)
   */
  public static generateCrmB2bCsv(leads: ProspectLead[]): string {
    const headers = [
      'Company Name',
      'Website',
      'Industry/Niche',
      'Deal Stage',
      'Opportunity Value (BRL)',
      'Contact Phone',
      'Meta Pixel Active',
      'Meta Ads Library URL',
      'Audit Primary SKU',
      'Missing Sizes',
      'Lead Source',
      'Sales Notes'
    ];

    const rows = leads.map(lead => {
      const primarySku = lead.primaryBrokenSku;
      const cleanPhone = normalizePhoneForWhatsApp(lead.contactTargetPhone);

      return [
        `"${lead.brandName.replace(/"/g, '""')}"`,
        `"${lead.storeUrl}"`,
        `"${lead.niche.replace(/"/g, '""')}"`,
        `"${lead.status}"`,
        lead.totalMonthlyWasteEstimated.toFixed(2),
        `"${cleanPhone}"`,
        lead.hasMetaPixel ? 'TRUE' : 'FALSE',
        `"${lead.metaAdsLibraryUrl}"`,
        `"${primarySku.productTitle.replace(/"/g, '""')}"`,
        `"${primarySku.missingSizes.join(', ')}"`,
        '"AdShield OS Lead Sniper"',
        `"${lead.notes || 'Auditoria técnica de grade rompida'}"`
      ];
    });

    return [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\r\n');
  }

  /**
   * ⚡ Formato 4: JSON Estruturado para Webhooks (n8n, Make, Zapier)
   */
  public static generateAutomationJson(leads: ProspectLead[]): string {
    const payload = {
      exportedAt: new Date().toISOString(),
      source: 'AdShield OS Lead Sniper',
      totalLeads: leads.length,
      totalRecoverableRevenueBRL: leads.reduce((acc, l) => acc + l.totalMonthlyWasteEstimated, 0),
      leads: leads.map((lead, idx) => ({
        id: lead.id,
        brandName: lead.brandName,
        storeUrl: lead.storeUrl,
        domain: lead.domain,
        niche: lead.niche,
        status: lead.status,
        hasMetaPixel: lead.hasMetaPixel,
        metaAdsLibraryUrl: lead.metaAdsLibraryUrl,
        contactTargetPhone: normalizePhoneForWhatsApp(lead.contactTargetPhone),
        totalMonthlyWasteEstimated: lead.totalMonthlyWasteEstimated,
        iceScore: lead.iceScore,
        primaryBrokenSku: lead.primaryBrokenSku,
        spintaxPitch: generateSpintaxPitch(lead, idx),
        clickToChatUrl: `https://api.whatsapp.com/send?phone=${normalizePhoneForWhatsApp(lead.contactTargetPhone)}&text=${encodeURIComponent(generateSpintaxPitch(lead, idx))}`
      }))
    };

    return JSON.stringify(payload, null, 2);
  }

  /**
   * Executa o download de acordo com o formato escolhido
   */
  public static exportBatch(leads: ProspectLead[], format: ExportTargetFormat): void {
    const today = new Date().toISOString().split('T')[0];

    switch (format) {
      case 'EXCEL_BR': {
        const content = this.generateExcelBrCsv(leads);
        this.triggerDownload(content, `AdShield_Leads_Excel_Brasil_${today}.csv`);
        break;
      }
      case 'WHATSAPP_BULK': {
        const content = this.generateWhatsAppBulkCsv(leads);
        this.triggerDownload(content, `AdShield_Disparo_WhatsApp_Bulk_${today}.csv`);
        break;
      }
      case 'CRM_B2B': {
        const content = this.generateCrmB2bCsv(leads);
        this.triggerDownload(content, `AdShield_CRM_HubSpot_Pipedrive_${today}.csv`);
        break;
      }
      case 'JSON_AUTOMATION': {
        const content = this.generateAutomationJson(leads);
        this.triggerDownload(content, `AdShield_Leads_Automation_n8n_${today}.json`, 'application/json');
        break;
      }
    }
  }
}
