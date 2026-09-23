/**
 * 🎯 OUTBOUND CLOSER & B2B SALES ENGINE (ADSHIELD REVENUE OS 2026.4)
 * 
 * Máquina de Prospecção e Fechamento de Contratos de R$ 997/mês:
 * 1. Abordagens de 3 Passos para WhatsApp baseadas no "Dossiê da Prova do Crime"
 * 2. Personalização White-Label para Agências de Tráfego Pago
 * 3. Fila com Cadência Anti-Ban para WhatsApp (Delays de 45s a 120s)
 * 4. Exportação Universal para CRMs (HubSpot, RD Station, Notion, Sheets)
 */

export interface MinedEcomLead {
  id: string;
  storeName: string;
  storeDomain: string;
  targetDecisionMakerName?: string;
  targetPhone: string;
  rupturedProductTitle: string;
  rupturedSku: string;
  brokenSizes: string[];
  metaAdLibraryUrl: string;
  estimatedMonthlyBleedBrl: number;
  niche: string;
  source: 'META_ADS_MINED' | 'MANUAL_INSPECTION' | 'INBOUND_AUDIT';
}

export interface ThreeStepPitch {
  step1Hook: string;
  step2Proof: string;
  step3Cta: string;
  fullWhatsAppMessage: string;
  directWhatsAppUrl: string;
}

export interface AgencyWhiteLabelPitch {
  agencyName: string;
  pitchSubject: string;
  pitchBody: string;
  proposedMonthlyPriceBrl: number;
  valueProposition: string;
  whatsAppDirectUrl: string;
}

export class OutboundCloserEngine {
  /**
   * Gera o Pitch de 3 Passos do "Dossiê da Prova do Crime" para WhatsApp
   */
  public static generateThreeStepPitch(
    lead: MinedEcomLead, 
    customAuditUrl?: string
  ): ThreeStepPitch {
    const auditLink = customAuditUrl || `https://adshield.app/?loja=${lead.storeDomain}`;
    const formattedBleed = lead.estimatedMonthlyBleedBrl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const brokenSizesStr = lead.brokenSizes.join(', ') || 'M e G';

    // 1. O Gancho (A Dor que Ninguém Viu)
    const step1Hook = 
      `Olá! Estava analisando os anúncios ativos de vocês na Biblioteca do Meta Ads e notei algo urgente: ` +
      `vocês estão com campanha ativa promovendo o produto *"${lead.rupturedProductTitle}"*, ` +
      `mas na vitrine os tamanhos mais vendidos (${brokenSizesStr}) estão *100% esgotados*.`;

    // 2. A Prova do Crime (O Custo da Inação em Reais)
    const step2Proof = 
      `Pelos nossos cálculos técnicos de tráfego, isso representa cerca de *${formattedBleed}/mês* sendo queimado em cliques de clientes que chegam na página e desistem porque não encontram o tamanho deles.`;

    // 3. O Fechamento sem Fricção (Baixíssimo Compromisso)
    const step3Cta = 
      `Montamos um dossiê técnico de 2 páginas mostrando a prova do anúncio e os códigos para pausar ou corrigir isso no tema. ` +
      `Posso te enviar aqui no WhatsApp para você ver? É só me responder *"QUERO"* que te mando em PDF.`;

    const optOutClause = `🔒 _LGPD: Caso não deseje receber mais auditorias técnicas gratuitas como esta, responda 'PARAR'._`;

    const fullMessage = `${step1Hook}\n\n${step2Proof}\n\n${step3Cta}\n\n🛡️ _Dossiê Interativo: ${auditLink}_\n\n${optOutClause}`;
    const cleanPhone = lead.targetPhone.replace(/\D/g, '');
    const directUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(fullMessage)}`;

    return {
      step1Hook,
      step2Proof,
      step3Cta,
      fullWhatsAppMessage: fullMessage,
      directWhatsAppUrl: directUrl
    };
  }

  /**
   * 📱 Valida se o número é um celular brasileiro legítimo (rejeita telefones fixos de rodapé)
   */
  public static isBrazilianMobilePhone(phone: string): boolean {
    const clean = (phone || '').replace(/\D/g, '');
    // Sem DDI ou com DDI 55
    let nationalNumber = clean;
    if (nationalNumber.startsWith('55') && nationalNumber.length >= 12) {
      nationalNumber = nationalNumber.slice(2);
    }

    // Celular BR: 2 dígitos DDD + 9 dígitos (iniciado por 9) = 11 dígitos
    if (nationalNumber.length === 11) {
      const ddd = parseInt(nationalNumber.slice(0, 2), 10);
      const firstDigit = nationalNumber[2];
      const isValidDdd = ddd >= 11 && ddd <= 99;
      const isMobileDigit = firstDigit === '9';
      return isValidDdd && isMobileDigit;
    }

    // Rejeita telefones fixos (10 dígitos começando com 2, 3, 4 ou 5)
    return false;
  }

  /**
   * Gera a proposta de parceria White-Label para Agências de Tráfego Pago (R$ 997/mês)
   */
  public static generateAgencyWhiteLabelOffer(agencyName: string, partnerPhone: string = ''): AgencyWhiteLabelPitch {
    const price = 997.00;
    const body = 
      `Olá equipe da *${agencyName}*! Tudo bem?\n\n` +
      `Sou fundador do *AdShield OS*. Acompanho o trabalho de tráfego de vocês e sei como é frustrante quando o cliente cobra resultado e a culpa é do estoque furado dele que esgotou sem avisar o gestor.\n\n` +
      `Criamos uma parceria exclusiva para Agências de Tráfego:\n` +
      `1. Entregamos o AdShield com a *logo e paleta de cores da ${agencyName}* (100% White-Label).\n` +
      `2. Monitoramento autônomo 24/7 das contas de até 20 clientes de vocês.\n` +
      `3. Kill-Switch que pausa anúncios automaticamente quando o estoque zerar no ERP.\n` +
      `4. O robô caçador (Lead Sniper) para a ${agencyName} prospectar novas marcas no Meta Ads e fechar clientes de tráfego com o Dossiê da Prova do Crime.\n\n` +
      `O investimento para sua agência é de apenas *R$ ${price.toFixed(2)}/mês* (menos de R$ 50/loja).\n\n` +
      `Tem 10 minutos para uma demonstração rápida de como blindar seus clientes hoje?\n\n` +
      `🔒 _LGPD: Caso não queira receber mais propostas de parceria, responda 'PARAR'._`;

    const cleanPhone = partnerPhone.replace(/\D/g, '');
    const whatsAppUrl = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(body)}`
      : '';

    return {
      agencyName,
      pitchSubject: `Parceria White-Label AdShield para ${agencyName} (Blindagem de Anúncios)`,
      pitchBody: body,
      proposedMonthlyPriceBrl: price,
      valueProposition: 'Nunca mais perca um cliente de tráfego por culpa do estoque quebrado dele.',
      whatsAppDirectUrl: whatsAppUrl
    };
  }


  /**
   * Calcula a cadência de disparos com delay humano para evitar banimento no WhatsApp
   */
  public static calculateAntiBanSchedule(leadsCount: number): {
    totalEstimatedMinutes: number;
    recommendedBatches: number;
    delaysPerLeadMs: number[];
  } {
    const delaysPerLeadMs: number[] = [];
    let totalMs = 0;

    for (let i = 0; i < leadsCount; i++) {
      // Delay randômico entre 45s (45000ms) e 110s (110000ms)
      const delay = Math.floor(Math.random() * (110000 - 45000 + 1)) + 45000;
      delaysPerLeadMs.push(delay);
      totalMs += delay;
    }

    const totalMinutes = Math.ceil(totalMs / 60000);
    const recommendedBatches = Math.ceil(leadsCount / 20); // Blocos de 20 mensagens por dia por chip

    return {
      totalEstimatedMinutes: totalMinutes,
      recommendedBatches,
      delaysPerLeadMs
    };
  }

  /**
   * Exporta a lista de leads minerados para formato CSV:
   * - Modo ';' (Padrão Excel/Sheets Brasil): Inclui UTF-8 BOM (\uFEFF) e separador ponto e vírgula para não achatar colunas no Windows
   * - Modo ',' (Padrão CRM Internacional / APIs): Compatível com HubSpot, RD Station, Salesforce e parsers RFC 4180
   */
  public static exportLeadsToCrmCsv(leads: MinedEcomLead[], delimiter: ';' | ',' = ';'): string {
    const isExcelBr = delimiter === ';';

    const headers = isExcelBr ? [
      'ID',
      'Loja',
      'Domínio',
      'Telefone WhatsApp',
      'Produto Rompido',
      'SKU',
      'Tamanhos em Falta',
      'Sangria Mensal Estimada',
      'Nicho de Mercado',
      'Link Meta Ads',
      'Status de Contato'
    ] : [
      'ID',
      'Loja',
      'Dominio',
      'Telefone',
      'Produto Rompido',
      'SKU',
      'Tamanhos em Falta',
      'Sangria Mensal (BRL)',
      'Nicho',
      'Link Meta Ads',
      'Status de Contato'
    ];

    const rows = leads.map(l => {
      const bleedStr = isExcelBr
        ? l.estimatedMonthlyBleedBrl.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : l.estimatedMonthlyBleedBrl.toFixed(2);

      return [
        `"${l.id}"`,
        `"${l.storeName.replace(/"/g, '""')}"`,
        `"${l.storeDomain}"`,
        `"${l.targetPhone}"`,
        `"${l.rupturedProductTitle.replace(/"/g, '""')}"`,
        `"${l.rupturedSku}"`,
        `"${l.brokenSizes.join(', ').replace(/"/g, '""')}"`,
        `"${bleedStr}"`,
        `"${l.niche.replace(/"/g, '""')}"`,
        `"${l.metaAdLibraryUrl.replace(/"/g, '""')}"`,
        `"NOVO_PRONTO_PARA_CONTATO"`
      ];
    });

    const headerLine = headers.map(h => isExcelBr ? `"${h}"` : h).join(delimiter);
    const content = [headerLine, ...rows.map(r => r.join(delimiter))].join(isExcelBr ? '\r\n' : '\n');

    return isExcelBr ? ('\uFEFF' + content) : content;
  }
}
