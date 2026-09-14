/**
 * 📊 SERVIÇO DE EXPORTAÇÃO DE PLANILHAS INTELIGENTES (LEAKFINDER SAAS)
 * Gera arquivos CSV perfeitamente compatíveis com Microsoft Excel e Google Sheets no Brasil:
 * - Separador de colunas padrão brasileiro (ponto e vírgula ;)
 * - Codificação UTF-8 com BOM (\uFEFF) para preservar acentos e cedilhas sem erros
 * - Nomes de colunas claros, organizados e sem termos técnicos complexos
 */

import { RealSiteData, CatalogProductIssue } from '../siteInspector';
import { AgentDiagnosticResult, CroFinding, IceIdea } from '../../types';

export class SpreadsheetExporter {
  /**
   * Helper seguro para download no navegador
   */
  private static triggerDownload(csvContent: string, filename: string): void {
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * 📦 Planilha 1: Auditoria Completa de Catálogo e Estoque (SKU a SKU)
   */
  public static exportCatalogAudit(realSiteData: RealSiteData): void {
    const issues: CatalogProductIssue[] = realSiteData.catalogAudit?.issues || [];
    const brandName = realSiteData.brandName || 'Loja';

    const headers = [
      'Código SKU',
      'Nome do Produto',
      'Link Direto na Loja',
      'Qualidade da Imagem',
      'Peso da Foto (KB)',
      'Tamanhos Disponíveis para Compra',
      'Tamanhos em Falta (Estoque Zerado)',
      'Tipo de Produto',
      'Tabela de Medidas',
      'O Que Fazer (Ação Prática de Lucro)'
    ];

    const rows = issues.map((item: CatalogProductIssue) => [
      `"${item.sku}"`,
      `"${item.productTitle.replace(/"/g, '""')}"`,
      `"${item.productUrl || `https://${realSiteData.domain}/products/${item.sku.toLowerCase()}`}"`,
      `"${item.hasValidImage ? 'Foto Conforme' : 'Sem Imagem Principal'}"`,
      item.imageWeightKb || 120,
      `"${item.availableSizes.join(', ') || 'Nenhum'}"`,
      `"${item.isFullPrintExempt ? 'Grade Especial (Sem Pendências)' : item.missingSizes.join(', ') || 'Grade Completa'}"`,
      `"${item.isFullPrintExempt ? 'Linha Casual / Isento' : 'Linha Esportiva Padrão'}"`,
      `"${item.hasSizeGuide ? 'Sim (Instalada)' : 'Não (Adicionar Tabela)'}"`,
      `"${item.recommendedAction.replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map((row: (string | number)[]) => row.join(';'))
    ].join('\r\n');

    this.triggerDownload(
      csvContent,
      `Planilha_Estoque_e_Catalogo_${brandName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`
    );
  }

  /**
   * 💰 Planilha 2: Oportunidades de Lucro & Plano de Ação Prático
   */
  public static exportFinancialActionPlan(diagnostic: AgentDiagnosticResult): void {
    const brandName = diagnostic.realSiteData.brandName || 'Loja';

    const headers = [
      'Ordem de Prioridade',
      'Oportunidade de Melhoria',
      'Categoria',
      'Impacto no Faturamento',
      'Nível de Facilidade',
      'O Que Fazer (Recomendação Direta)'
    ];

    const findings: CroFinding[] = diagnostic.cro?.findings || [];
    const iceIdeas: IceIdea[] = diagnostic.pmGrowth?.iceMatrix || [];

    const rows: (string | number)[][] = [
      ...findings.map((item: CroFinding, idx: number) => [
        `"${idx + 1}º Lugar"`,
        `"${item.title.replace(/"/g, '""')}"`,
        `"${item.category}"`,
        `"${item.impact === 'CRÍTICO' ? 'Muito Alto (Crítico)' : item.impact === 'ALTO' ? 'Alto' : 'Médio'}"`,
        `"${item.effort === 'FÁCIL' ? 'Fácil (Em minutos)' : item.effort === 'MÉDIO' ? 'Médio (1 dia)' : 'Requer Desenvolvedor'}"`,
        `"${item.recommendation.replace(/"/g, '""')}"`
      ]),
      ...iceIdeas.map((idea: IceIdea, idx: number) => [
        `"${findings.length + idx + 1}º Lugar"`,
        `"${idea.title.replace(/"/g, '""')}"`,
        `"${idea.category}"`,
        `"Score ICE: ${idea.iceScore}/10"`,
        `"Facilidade: ${idea.ease}/10"`,
        `"Implementar ${idea.title.replace(/"/g, '""')} (Impacto ${idea.impact}/10)"`
      ])
    ];

    const csvContent = [
      headers.join(';'),
      ...rows.map((row: (string | number)[]) => row.join(';'))
    ].join('\r\n');

    this.triggerDownload(
      csvContent,
      `Plano_de_Acao_e_Lucro_${brandName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`
    );
  }

  /**
   * 🎯 Planilha 3: Exportação em Lote de Leads B2B & Pitches de WhatsApp (Lead Sniper)
   */
  public static exportProspectLeads(leads: any[]): void {
    const headers = [
      'Nome da Marca',
      'URL da Loja',
      'Nicho de Mercado',
      'Status no Funil CRM',
      'Meta Pixel Instalado',
      'Link Meta Ads Library',
      'Produto com Ruptura Detectado',
      'Preço do Produto (R$)',
      'Tamanhos Esgotados',
      'Desperdício Estimado (R$/Mês)',
      'WhatsApp de Contato',
      'Score ICE',
      'Pitch WhatsApp (Dono/Fundador)',
      'Pitch Técnico (Gestor de Tráfego)',
      'Link Click-to-Chat Pronto'
    ];

    const rows = leads.map((lead: any) => {
      const primarySku = lead.primaryBrokenSku || {};
      const pitches = lead.pitches || {};
      const cleanPhone = (lead.contactTargetPhone || '').replace(/\D/g, '');
      const clickToChatUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(pitches.directFounder || '')}`;

      return [
        `"${(lead.brandName || '').replace(/"/g, '""')}"`,
        `"${lead.storeUrl || ''}"`,
        `"${(lead.niche || '').replace(/"/g, '""')}"`,
        `"${lead.status || 'NOVO_LEAD'}"`,
        `"${lead.hasMetaPixel ? 'Sim (Ativo)' : 'Não'}"`,
        `"${lead.metaAdsLibraryUrl || ''}"`,
        `"${(primarySku.productTitle || '').replace(/"/g, '""')}"`,
        primarySku.price || 0,
        `"${(primarySku.missingSizes || []).join(', ')}"`,
        lead.totalMonthlyWasteEstimated || 0,
        `"${lead.contactTargetPhone || ''}"`,
        lead.iceScore || 8.5,
        `"${(pitches.directFounder || '').replace(/"/g, '""')}"`,
        `"${(pitches.technicalMediaBuyer || '').replace(/"/g, '""')}"`,
        `"${clickToChatUrl}"`
      ];
    });

    const csvContent = [
      headers.join(';'),
      ...rows.map((row: (string | number)[]) => row.join(';'))
    ].join('\r\n');

    this.triggerDownload(
      csvContent,
      `AdShield_Leads_Prospectados_${new Date().toISOString().split('T')[0]}.csv`
    );
  }
}

