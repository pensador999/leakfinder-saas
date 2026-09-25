/**
 * 📊 SERVIÇO DE EXPORTAÇÃO DE PLANILHAS INTELIGENTES (ADSHIELD SAAS)
 * Gera arquivos CSV perfeitamente compatíveis com Microsoft Excel e Google Sheets no Brasil:
 * - Separador de colunas padrão brasileiro (ponto e vírgula ;)
 * - Codificação UTF-8 com BOM (\uFEFF) para preservar acentos e cedilhas sem erros
 * - Nomes de colunas claros, organizados e sem termos técnicos complexos
 */

import type { RealSiteData, CatalogProductIssue } from '../siteInspector.ts';
import type { AgentDiagnosticResult, CroFinding, IceIdea } from '../../types/index.ts';
import { ShopeeSeoOptimizer } from '../marketplaces/shopeeSeoOptimizer.ts';

export class SpreadsheetExporter {
  /**
   * Helper seguro para download no navegador (com blindagem defensiva e limpeza de memória)
   */
  private static triggerDownload(csvContent: string, filename: string): void {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.warn('triggerDownload chamado fora do ambiente DOM/navegador.');
        return;
      }

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        try {
          if (link.parentNode) {
            link.parentNode.removeChild(link);
          }
          URL.revokeObjectURL(url);
        } catch {
          // ignore cleanup errors
        }
      }, 200);
    } catch (err) {
      console.error('Falha ao exportar CSV no navegador:', err);
    }
  }

  /**
   * 📦 Planilha 1: Auditoria Completa de Catálogo e Estoque (SKU a SKU)
   */
  public static exportCatalogAudit(realSiteData: RealSiteData): void {
    try {
      const issues: CatalogProductIssue[] = realSiteData?.catalogAudit?.issues || [];
      const brandName = (realSiteData?.brandName || 'Loja').trim();
      const domain = realSiteData?.domain || 'loja.com.br';

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

      const rows = issues.map((item: CatalogProductIssue) => {
        const sku = String(item.sku || 'SKU-001');
        const title = String(item.productTitle || 'Produto sem título').replace(/"/g, '""');
        const url = item.productUrl || `https://${domain}/products/${sku.toLowerCase()}`;
        const imageQuality = item.hasValidImage ? 'Foto Conforme' : 'Sem Imagem Principal';
        const imageWeight = typeof item.imageWeightKb === 'number' ? item.imageWeightKb : 120;
        const availableSizes = Array.isArray(item.availableSizes) && item.availableSizes.length > 0
          ? item.availableSizes.join(', ')
          : 'Nenhum';
        const missingSizes = item.isFullPrintExempt
          ? 'Grade Especial (Sem Pendências)'
          : (Array.isArray(item.missingSizes) && item.missingSizes.length > 0 ? item.missingSizes.join(', ') : 'Grade Completa');
        const productType = item.isFullPrintExempt ? 'Linha Casual / Isento' : 'Linha Esportiva Padrão';
        const sizeGuide = item.hasSizeGuide ? 'Sim (Instalada)' : 'Não (Adicionar Tabela)';
        const recommendedAction = String(item.recommendedAction || 'Catálogo Conforme').replace(/"/g, '""');

        return [
          `"${sku}"`,
          `"${title}"`,
          `"${url}"`,
          `"${imageQuality}"`,
          imageWeight,
          `"${availableSizes}"`,
          `"${missingSizes}"`,
          `"${productType}"`,
          `"${sizeGuide}"`,
          `"${recommendedAction}"`
        ];
      });

      const csvContent = [
        headers.join(';'),
        ...rows.map((row: (string | number)[]) => row.join(';'))
      ].join('\r\n');

      this.triggerDownload(
        csvContent,
        `Planilha_Estoque_e_Catalogo_${brandName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`
      );
    } catch (err) {
      console.error('Erro ao gerar Planilha de Auditoria de Catálogo:', err);
    }
  }

  /**
   * 🔬 Planilha 1.1: Inventário Granular SKU por SKU (100% dos SKUs & Variantes)
   * Desdobra cada variante individualmente, sintetizando variantes caso detailedSkus não esteja populado
   */
  public static exportAllSkusCsv(realSiteData: RealSiteData): void {
    try {
      const brandName = (realSiteData?.brandName || 'Loja').trim();
      const domain = realSiteData?.domain || 'loja.com.br';
      const deepAudit = realSiteData?.catalogAudit?.deepSkuAudit;
      const issues = realSiteData?.catalogAudit?.issues || [];

      const headers = [
        'Código SKU',
        'ID da Variante',
        'Nome do Produto',
        'Tamanho / Opção',
        'Preço Unitário (R$)',
        'Situação de Estoque',
        'Classificação Fabril',
        'Isenção _FULL / Marketplace',
        'Demanda do Tamanho no Brasil (%)',
        'Sangria Estimada em Tráfego (R$/mês)',
        'Ação Operacional Recomendada',
        'Link Direto na Loja'
      ];

      const rows: (string | number)[][] = [];

      if (deepAudit && Array.isArray(deepAudit.allProducts) && deepAudit.allProducts.length > 0) {
        for (const prod of deepAudit.allProducts) {
          const prodTitle = String(prod.title || 'Produto sem título').replace(/"/g, '""');
          const prodUrl = prod.url || `https://${domain}/products/${prod.handle || ''}`;

          if (Array.isArray(prod.skus)) {
            for (const sku of prod.skus) {
              const skuCode = String(sku.skuCode || 'SKU-001');
              const skuId = String(sku.skuId || 'VAR-001');
              const variantTitle = String(sku.variantTitle || 'Tamanho Único').replace(/"/g, '""');
              const priceFormatted = typeof sku.price === 'number'
                ? `R$ ${sku.price.toFixed(2).replace('.', ',')}`
                : 'R$ 149,90';
              const status = sku.available ? 'EM ESTOQUE' : '🚨 RUPTURA CRÍTICA';
              const mfgType = sku.manufacturingType === 'FABRICACAO_PROPRIA'
                ? 'Fabricação Própria (PCP)'
                : 'Revenda Homologada';
              const fullExempt = sku.isFullExempt
                ? 'Isento Fulfillment / Revenda'
                : 'Grade Ativa Obrigatória';
              const demand = typeof sku.sizeDemandWeight === 'number' ? sku.sizeDemandWeight : 15;
              const wastedSpend = typeof sku.estimatedWastedAdSpendDay === 'number'
                ? `R$ ${(sku.estimatedWastedAdSpendDay * 30).toLocaleString('pt-BR')}`
                : 'R$ 0,00';
              const action = String(sku.operationalAction || 'Estoque auditado').replace(/"/g, '""');

              rows.push([
                `"${skuCode}"`,
                `"${skuId}"`,
                `"${prodTitle}"`,
                `"${variantTitle}"`,
                priceFormatted,
                `"${status}"`,
                `"${mfgType}"`,
                `"${fullExempt}"`,
                `${demand}%`,
                wastedSpend,
                `"${action}"`,
                `"${prodUrl}"`
              ]);
            }
          }
        }
      } else {
        // Fallback from issues and detailedSkus, with full variant synthesis
        for (const issue of issues) {
          const prodTitle = String(issue.productTitle || 'Produto sem título').replace(/"/g, '""');
          const prodUrl = issue.productUrl || `https://${domain}/products/${String(issue.sku || '').toLowerCase()}`;
          const isPcp = issue.manufacturingType === 'FABRICACAO_PROPRIA';
          const mfgType = isPcp ? 'Fabricação Própria (PCP)' : 'Revenda Homologada';
          const fullExempt = issue.isFullPrintExempt ? 'Isento Fulfillment / Revenda' : 'Grade Ativa Obrigatória';

          if (Array.isArray(issue.detailedSkus) && issue.detailedSkus.length > 0) {
            for (const sku of issue.detailedSkus) {
              const skuCode = String(sku.skuCode || `${issue.sku}-${sku.variantTitle || 'VAR'}`);
              const skuId = String(sku.skuId || `VAR-${issue.id}`);
              const variantTitle = String(sku.variantTitle || 'Tamanho Único').replace(/"/g, '""');
              const priceFormatted = typeof sku.price === 'number'
                ? `R$ ${sku.price.toFixed(2).replace('.', ',')}`
                : 'R$ 149,90';
              const status = sku.available ? 'EM ESTOQUE' : '🚨 RUPTURA CRÍTICA';
              const skuMfg = sku.manufacturingType === 'FABRICACAO_PROPRIA' ? 'Fabricação Própria (PCP)' : 'Revenda Homologada';
              const skuExempt = sku.isFullExempt ? 'Isento Fulfillment / Revenda' : 'Grade Ativa Obrigatória';
              const demand = typeof sku.sizeDemandWeight === 'number' ? sku.sizeDemandWeight : 15;
              const wastedSpend = typeof sku.estimatedWastedAdSpendDay === 'number'
                ? `R$ ${(sku.estimatedWastedAdSpendDay * 30).toLocaleString('pt-BR')}`
                : 'R$ 0,00';
              const action = String(sku.operationalAction || issue.recommendedAction || 'Manter conformidade').replace(/"/g, '""');

              rows.push([
                `"${skuCode}"`,
                `"${skuId}"`,
                `"${prodTitle}"`,
                `"${variantTitle}"`,
                priceFormatted,
                `"${status}"`,
                `"${skuMfg}"`,
                `"${skuExempt}"`,
                `${demand}%`,
                wastedSpend,
                `"${action}"`,
                `"${prodUrl}"`
              ]);
            }
          } else {
            // 🧠 SÍNTESE INTELIGENTE DE VARIANTES SE DETAILEDSKUS NÃO ESTIVER PREENCHIDO
            const avail = Array.isArray(issue.availableSizes) ? issue.availableSizes : [];
            const miss = (Array.isArray(issue.missingSizes) ? issue.missingSizes : []).filter(
              sz => !['ESGOTADO', 'ESTOQUE_FANTASMA_SUSPEITO', 'ESTOQUE_FANTASMA', 'ÚNICO (ESGOTADO)'].includes(sz)
            );

            if (avail.length === 0 && miss.length === 0) {
              const isOut = (issue.missingSizes || []).some(m => ['ESGOTADO', 'ESTOQUE_FANTASMA_SUSPEITO', 'ÚNICO (ESGOTADO)'].includes(m));
              rows.push([
                `"${issue.sku || 'SKU-001'}"`,
                `"VAR-${issue.id || '0'}-UNICO"`,
                `"${prodTitle}"`,
                `"Tamanho Único"`,
                `"R$ 149,90"`,
                `"${isOut ? '🚨 RUPTURA CRÍTICA' : 'EM ESTOQUE'}"`,
                `"${mfgType}"`,
                `"${fullExempt}"`,
                `100%`,
                `"${isOut ? 'R$ 450,00' : 'R$ 0,00'}"`,
                `"${String(issue.recommendedAction || 'Catálogo Conforme').replace(/"/g, '""')}"`,
                `"${prodUrl}"`
              ]);
            } else {
              // Desdobra tamanhos disponíveis
              for (let idx = 0; idx < avail.length; idx++) {
                const sz = avail[idx];
                const weight = sz === 'M' || sz === 'G' ? 28 : sz === 'GG' || sz === 'P' ? 18 : 8;
                rows.push([
                  `"${issue.sku}-${sz}"`,
                  `"VAR-${issue.id || '0'}-AV-${idx + 1}"`,
                  `"${prodTitle}"`,
                  `"Tamanho ${sz}"`,
                  `"R$ 149,90"`,
                  `"EM ESTOQUE"`,
                  `"${mfgType}"`,
                  `"${fullExempt}"`,
                  `${weight}%`,
                  `"R$ 0,00"`,
                  `"Estoque ativo em conformidade operacional"`,
                  `"${prodUrl}"`
                ]);
              }

              // Desdobra tamanhos em falta
              for (let idx = 0; idx < miss.length; idx++) {
                const sz = miss[idx];
                const weight = sz === 'M' || sz === 'G' ? 28 : sz === 'GG' || sz === 'P' ? 18 : 8;
                rows.push([
                  `"${issue.sku}-${sz}"`,
                  `"VAR-${issue.id || '0'}-MS-${idx + 1}"`,
                  `"${prodTitle}"`,
                  `"Tamanho ${sz}"`,
                  `"R$ 149,90"`,
                  `"🚨 RUPTURA CRÍTICA"`,
                  `"${mfgType}"`,
                  `"${fullExempt}"`,
                  `${weight}%`,
                  `"R$ 450,00"`,
                  `"${String(issue.recommendedAction || 'Repor tamanho ou pausar criativo de tráfego').replace(/"/g, '""')}"`,
                  `"${prodUrl}"`
                ]);
              }
            }
          }
        }
      }

      const csvContent = [
        headers.join(';'),
        ...rows.map((row: (string | number)[]) => row.join(';'))
      ].join('\r\n');

      this.triggerDownload(
        csvContent,
        `Inventario_Granular_SKUs_${brandName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`
      );
    } catch (err) {
      console.error('Erro ao gerar Planilha Granular de SKUs:', err);
    }
  }

  /**
   * 💰 Planilha 2: Oportunidades de Lucro & Plano de Ação Prático
   */
  public static exportFinancialActionPlan(diagnostic: AgentDiagnosticResult): void {
    try {
      const brandName = (diagnostic?.realSiteData?.brandName || 'Loja').trim();

      const headers = [
        'Ordem de Prioridade',
        'Oportunidade de Melhoria',
        'Categoria',
        'Impacto no Faturamento',
        'Nível de Facilidade',
        'O Que Fazer (Recomendação Direta)'
      ];

      const findings: CroFinding[] = diagnostic?.cro?.findings || [];
      const iceIdeas: IceIdea[] = diagnostic?.pmGrowth?.iceMatrix || [];

      const rows: (string | number)[][] = [
        ...findings.map((item: CroFinding, idx: number) => [
          `"${idx + 1}º Lugar"`,
          `"${String(item.title || 'Melhoria de CRO').replace(/"/g, '""')}"`,
          `"${item.category || 'CRO'}"`,
          `"${item.impact === 'CRÍTICO' ? 'Muito Alto (Crítico)' : item.impact === 'ALTO' ? 'Alto' : 'Médio'}"`,
          `"${item.effort === 'FÁCIL' ? 'Fácil (Em minutos)' : item.effort === 'MÉDIO' ? 'Médio (1 dia)' : 'Requer Desenvolvedor'}"`,
          `"${String(item.recommendation || 'Implementar otimização').replace(/"/g, '""')}"`
        ]),
        ...iceIdeas.map((idea: IceIdea, idx: number) => [
          `"${findings.length + idx + 1}º Lugar"`,
          `"${String(idea.title || 'Iniciativa de Crescimento').replace(/"/g, '""')}"`,
          `"${idea.category || 'Growth'}"`,
          `"Score ICE: ${idea.iceScore || 8}/10"`,
          `"Facilidade: ${idea.ease || 7}/10"`,
          `"Implementar ${String(idea.title || '').replace(/"/g, '""')} (Impacto ${idea.impact || 8}/10)"`
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
    } catch (err) {
      console.error('Erro ao gerar Plano de Ação Financeiro:', err);
    }
  }

  /**
   * 🎯 Planilha 3: Exportação em Lote de Leads B2B & Pitches de WhatsApp (Lead Sniper)
   */
  public static exportProspectLeads(leads: any[]): void {
    try {
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

      const rows = (Array.isArray(leads) ? leads : []).map((lead: any) => {
        const primarySku = lead.primaryBrokenSku || {};
        const pitches = lead.pitches || {};
        const cleanPhone = (lead.contactTargetPhone || '').replace(/\D/g, '');
        const clickToChatUrl = cleanPhone 
          ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(pitches.directFounder || '')}`
          : '';

        return [
          `"${String(lead.brandName || '').replace(/"/g, '""')}"`,
          `"${lead.storeUrl || ''}"`,
          `"${String(lead.niche || '').replace(/"/g, '""')}"`,
          `"${lead.status || 'NOVO_LEAD'}"`,
          `"${lead.hasMetaPixel ? 'Sim (Ativo)' : 'Não'}"`,
          `"${lead.metaAdsLibraryUrl || ''}"`,
          `"${String(primarySku.productTitle || '').replace(/"/g, '""')}"`,
          primarySku.price || 0,
          `"${(Array.isArray(primarySku.missingSizes) ? primarySku.missingSizes : []).join(', ')}"`,
          lead.totalMonthlyWasteEstimated || 0,
          `"${lead.contactTargetPhone || ''}"`,
          lead.iceScore || 8.5,
          `"${String(pitches.directFounder || '').replace(/"/g, '""')}"`,
          `"${String(pitches.technicalMediaBuyer || '').replace(/"/g, '""')}"`,
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
    } catch (err) {
      console.error('Erro ao exportar Leads Prospectados:', err);
    }
  }

  /**
   * 🛍️ Planilha 4: Otimização em Massa de Títulos e Catálogo Shopee (120 Caracteres SEO)
   * Compatível com a Central do Vendedor Shopee e Microsoft Excel
   */
  public static exportShopeeMassUpdateCsv(realSiteData: RealSiteData): void {
    try {
      const brandName = (realSiteData?.brandName || 'Loja').trim();
      const products = ShopeeSeoOptimizer.generateShopeeCatalogAudit(realSiteData);

      const headers = [
        'Código SKU (Parent SKU)',
        'ID do Item Shopee',
        'Título Atual (Curto)',
        'Tamanho Atual (Chars)',
        'Título Otimizado Shopee (Até 120 Chars)',
        'Tamanho Otimizado (Chars)',
        'Ganho de Visibilidade (+Chars)',
        'Palavras-Chave de Busca Injetadas',
        'Categoria Shopee Recomendada',
        'Preço Base (R$)',
        'Preço Promocional Sugerido (R$)',
        'Prazo SLA de Envio (Dias)',
        'Modelo de Operação',
        'Foto 3 Obrigatória (Guia de Medidas)',
        'Link do Produto na Shopee'
      ];

      const rows = (Array.isArray(products) ? products : []).map((item) => {
        const sku = String(item.sku || 'SKU-001');
        const id = String(item.id || 'ITEM-001');
        const originalTitle = String(item.originalTitle || '').replace(/"/g, '""');
        const optimizedTitle = String(item.optimizedTitle || '').replace(/"/g, '""');
        const originalLen = typeof item.originalLength === 'number' ? item.originalLength : originalTitle.length;
        const optimizedLen = typeof item.optimizedLength === 'number' ? item.optimizedLength : optimizedTitle.length;
        const charGain = typeof item.charGain === 'number' ? item.charGain : Math.max(0, optimizedLen - originalLen);
        const keywords = Array.isArray(item.injectedKeywords) ? item.injectedKeywords.join(', ') : '';
        const category = String(item.category || 'Geral');
        const price = typeof item.price === 'number' ? item.price.toFixed(2).replace('.', ',') : '99,90';
        const discPrice = typeof item.discountPrice === 'number' ? item.discountPrice.toFixed(2).replace('.', ',') : price;
        const sla = item.slaDays || 2;
        const mfg = item.manufacturingType === 'FABRICACAO_PROPRIA' ? 'Fabricação Própria (PCP)' : 'Revenda Homologada';
        const photo3 = item.hasSizeChartInPhoto3 ? 'Conforme (Foto 3 Ativa)' : 'Adicionar Infográfico na Foto 3';
        const url = String(item.productUrl || '');

        return [
          `"${sku}"`,
          `"${id}"`,
          `"${originalTitle}"`,
          originalLen,
          `"${optimizedTitle}"`,
          optimizedLen,
          `"+${charGain} chars"`,
          `"${keywords}"`,
          `"${category}"`,
          `R$ ${price}`,
          `R$ ${discPrice}`,
          `${sla} dias úteis`,
          `"${mfg}"`,
          `"${photo3}"`,
          `"${url}"`
        ];
      });

      const csvContent = [
        headers.join(';'),
        ...rows.map((row: (string | number)[]) => row.join(';'))
      ].join('\r\n');

      this.triggerDownload(
        csvContent,
        `Shopee_Catalogo_Otimizado_120Chars_${brandName.replace(/[^a-zA-Z0-9]/g, '_')}.csv`
      );
    } catch (err) {
      console.error('Erro ao gerar Planilha Shopee:', err);
    }
  }
}
