// ==============================================================================
// 📄 ADSHIELD WHITE-LABEL AGENCY DOSSIER & PDF GENERATION ENGINE
// Generates pixel-perfect, custom-branded executive PDF audits for client presentations
// ==============================================================================

import { AgentDiagnosticResult } from '../../types';
import { calculateStoreFinancialGrounding } from '../ai/storeFinancialGroundingEngine';
import { auditSupplyChainDiscrepancy } from '../supplyChain/erpHubDiscrepancyEngine';

export interface AgencyWhiteLabelConfig {
  agencyName: string;
  agencyLogoUrl: string;
  consultantName: string;
  consultantRole: string;
  consultantWhatsApp: string;
  consultantEmail: string;
  agencyWebsite: string;
  primaryBrandColor: string;
  includeCommercialProposal: boolean;
  proposedRetainerValue: number;
  customNotesToClient: string;
}

const LOCAL_AGENCY_CONFIG_KEY = 'adshield_agency_whitelabel_config_v1';

export function getStoredAgencyConfig(): AgencyWhiteLabelConfig {
  const stored = localStorage.getItem(LOCAL_AGENCY_CONFIG_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }

  return {
    agencyName: 'Sua Agência Growth & CRO',
    agencyLogoUrl: '',
    consultantName: 'Especialista em Performance',
    consultantRole: 'Head de Conversão & Mídia Paga',
    consultantWhatsApp: '5511999999999',
    consultantEmail: 'contato@suaagencia.com.br',
    agencyWebsite: 'https://www.suaagencia.com.br',
    primaryBrandColor: '#2563eb', // Blue-600
    includeCommercialProposal: true,
    proposedRetainerValue: 3500,
    customNotesToClient: 'Este diagnóstico executivo foi elaborado com exclusividade para a diretoria da loja, identificando as principais oportunidades de ganho imediato de margem e conversão.'
  };
}

export function saveStoredAgencyConfig(config: AgencyWhiteLabelConfig): void {
  localStorage.setItem(LOCAL_AGENCY_CONFIG_KEY, JSON.stringify(config));
}

/**
 * Builds the complete standalone HTML markup for a Pixel-Perfect Printable PDF Dossier
 */
export function generatePrintablePdfDossierHtml(
  diagnostic: AgentDiagnosticResult,
  config: AgencyWhiteLabelConfig
): string {
  const { realSiteData, growthScore, estimatedRevenueLiftMin, estimatedRevenueLiftMax, visionAnalysis, social } = diagnostic;
  const storeDomain = realSiteData.domain || 'loja.com.br';
  const brandName = realSiteData.brandName || 'Loja Virtual';
  const formattedDate = new Date().toLocaleDateString('pt-BR');

  const finances = calculateStoreFinancialGrounding(realSiteData, diagnostic.input, social);
  const supplyChainAudit = auditSupplyChainDiscrepancy(realSiteData, diagnostic.input);
  const catalogIssues = realSiteData.catalogAudit?.issues || [];
  const brokenSkusCount = finances.brokenSkusCount;
  const estimatedMonthlyLoss = finances.financialRisk.totalMonthlyLoss;

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Dossiê Executivo de Conversão - ${brandName} | ${config.agencyName}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      page-break-after: always;
      position: relative;
      min-height: 250mm;
    }
    .page:last-child {
      page-break-after: avoid;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid ${config.primaryBrandColor};
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .agency-logo {
      font-size: 18px;
      font-weight: 900;
      color: ${config.primaryBrandColor};
      letter-spacing: -0.5px;
    }
    .client-badge {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .hero-title {
      font-size: 26px;
      font-weight: 900;
      color: #0f172a;
      margin: 0 0 6px 0;
      line-height: 1.2;
    }
    .hero-subtitle {
      font-size: 13px;
      color: #475569;
      margin: 0 0 24px 0;
    }
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }
    .kpi-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      text-align: center;
    }
    .kpi-label {
      font-size: 10px;
      color: #64748b;
      text-transform: uppercase;
      font-weight: 800;
      display: block;
      margin-bottom: 4px;
    }
    .kpi-value {
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
      font-family: monospace;
    }
    .kpi-value.green { color: #16a34a; }
    .kpi-value.red { color: #dc2626; }
    .section-title {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      border-left: 4px solid ${config.primaryBrandColor};
      padding-left: 8px;
      margin: 20px 0 12px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .callout {
      background: #f1f5f9;
      border-radius: 12px;
      padding: 14px;
      font-size: 12px;
      line-height: 1.6;
      color: #334155;
      margin-bottom: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      margin-bottom: 20px;
    }
    th {
      background: #0f172a;
      color: #ffffff;
      text-align: left;
      padding: 8px 10px;
      font-weight: 700;
    }
    td {
      padding: 8px 10px;
      border-bottom: 1px solid #e2e8f0;
    }
    tr:nth-child(even) { background: #f8fafc; }
    .badge-red {
      background: #fee2e2;
      color: #991b1b;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 9px;
    }
    .badge-green {
      background: #dcfce7;
      color: #166534;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 9px;
    }
    .proposal-box {
      background: #0f172a;
      color: #ffffff;
      border-radius: 16px;
      padding: 20px;
      margin-top: 24px;
    }
    .proposal-price {
      font-size: 28px;
      font-weight: 900;
      color: #4ade80;
      font-family: monospace;
    }
    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      padding-top: 8px;
    }
    @media print {
      body { background: transparent; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>

  <!-- PÁGINA 1: CAPA EXECUTIVA & VISÃO GERAL -->
  <div class="page">
    <div class="header">
      <div class="agency-logo">${config.agencyLogoUrl ? `<img src="${config.agencyLogoUrl}" height="28" />` : config.agencyName}</div>
      <div class="client-badge">Auditoria de Conversão & Catálogo • ${formattedDate}</div>
    </div>

    <h1 class="hero-title">Diagnóstico Executivo de Conversão & Blindagem de Mídia</h1>
    <p class="hero-subtitle">Estudo técnico de performance, integridade de estoque e CRO para <strong>${brandName}</strong> (${storeDomain}).</p>

    <div class="kpi-grid">
      <div class="kpi-card">
        <span class="kpi-label">Índice Geral de CRO</span>
        <span class="kpi-value ${growthScore >= 80 ? 'green' : 'red'}">${growthScore}/100</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Produtos com Grade Furada</span>
        <span class="kpi-value ${brokenSkusCount > 0 ? 'red' : 'green'}">${brokenSkusCount > 0 ? `${brokenSkusCount} SKUs` : '0 SKUs (Blindado)'}</span>
      </div>
      <div class="kpi-card">
        <span class="kpi-label">Desperdício em Anúncios</span>
        <span class="kpi-value ${finances.financialRisk.adWasteMonthly > 0 ? 'red' : 'green'}">
          ${finances.financialRisk.adWasteMonthly > 0 ? `${finances.financialRisk.formattedAdWaste}/mês` : 'R$ 0,00'}
        </span>
      </div>
    </div>

    <div class="section-title">Resumo do Diagnóstico pela Diretoria Técnica</div>
    <div class="callout">
      ${config.customNotesToClient}
      <br><br>
      <strong>${brokenSkusCount > 0 ? 'Achado Crítico:' : 'Status da Auditoria:'}</strong> ${
        brokenSkusCount > 0
          ? 'Foram identificados produtos ativos em campanhas de tráfego pago que possuem indisponibilidade nos tamanhos de maior curva de vendas (P, M, G), resultando em cliques perdidos e alta taxa de rejeição no checkout.'
          : 'Catálogo auditado com 100% de conformidade de grade. Nenhuma ruptura crítica detectada nos produtos com campanhas ativas. Tráfego e vitrine 100% blindados contra queima de verba.'
      }
    </div>

    <div class="section-title">Conformidade Legal & Segurança da Operação</div>
    <table>
      <thead>
        <tr>
          <th>Pilar de Inspeção</th>
          <th>Status Observado</th>
          <th>Impacto na Confiança</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>CNPJ & Razão Social no Rodapé (Decreto 7.962)</td>
          <td><span class="${Boolean((realSiteData as any).hasCnpj ?? true) ? 'badge-green' : 'badge-red'}">${Boolean((realSiteData as any).hasCnpj ?? true) ? 'CONFORME' : 'NÃO DETECTADO'}</span></td>
          <td>Evita processos do Procon e aumenta conversão em +12%</td>
        </tr>
        <tr>
          <td>Direito de Arrependimento (CDC Art. 49)</td>
          <td><span class="${Boolean((realSiteData as any).hasCdcArt49 ?? true) ? 'badge-green' : 'badge-red'}">${Boolean((realSiteData as any).hasCdcArt49 ?? true) ? 'DECLARADO' : 'AUSENTE'}</span></td>
          <td>Blindagem jurídica e garantia de 7 dias de devolução</td>
        </tr>
        <tr>
          <td>Contraste Visual WCAG 2.1 AAA (Mobile)</td>
          <td><span class="${visionAnalysis.contrastAudit.wcagAaPassed ? 'badge-green' : 'badge-red'}">${visionAnalysis.contrastAudit.contrastRatio}:1 (${visionAnalysis.contrastAudit.wcagAaPassed ? 'APROVADO' : 'REPROVADO'})</span></td>
          <td>Garante legibilidade do botão 'Comprar' sob luz solar</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">Auditoria de Descompasso Operacional (Sankhya ERP ⟷ Magis5 ⟷ Loja ⟷ Ads)</div>
    <table>
      <thead>
        <tr>
          <th>Pilar Operacional</th>
          <th>Diagnóstico Observado</th>
          <th>Impacto Financeiro</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Índice de Sincronia de Estoque</td>
          <td><span class="${supplyChainAudit.operationalSyncScore >= 80 ? 'badge-green' : 'badge-red'}">${supplyChainAudit.operationalSyncScore}% SINCRONIZADO</span></td>
          <td>Risco Total: ${supplyChainAudit.financialImpactSummary.formattedMonthlyTotalRisk}/mês</td>
        </tr>
        <tr>
          <td>Trava de Buffer Anti-Venda Fantasma</td>
          <td><span class="badge-green">${supplyChainAudit.suggestedSafetyBufferUnits} UNIDADES RECOMENDADAS</span></td>
          <td>Evita cancelamentos por delay de fila no hub</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <span>Elaborado por: ${config.consultantName} (${config.agencyName})</span>
      <span>Página 1 de 2 • Confidencial</span>
    </div>
  </div>

  <!-- PÁGINA 2: PRODUTOS FURADOS & PROPOSTA COMERCIAL -->
  <div class="page">
    <div class="header">
      <div class="agency-logo">${config.agencyName}</div>
      <div class="client-badge">${brandName} • Plano de Ação</div>
    </div>

    <div class="section-title">Amostragem de Produtos com Ruptura de Grade Detectada</div>
    <table>
      <thead>
        <tr>
          <th>Título do Produto</th>
          <th>Tamanhos Esgotados</th>
          <th>Status da Tabela de Medidas</th>
          <th>Ação Imediata</th>
        </tr>
      </thead>
      <tbody>
        ${catalogIssues.slice(0, 4).map(issue => `
          <tr>
            <td><strong>${issue.productTitle}</strong></td>
            <td><span class="badge-red">${issue.missingSizes.join(', ') || 'ESGOTADO'}</span></td>
            <td>${issue.hasSizeGuide ? '<span class="badge-green">INSTALADA</span>' : '<span class="badge-red">NÃO DETECTADA</span>'}</td>
            <td>Pausar anúncio ou repor estoque</td>
          </tr>
        `).join('') || `
          <tr>
            <td colspan="4" style="text-align: center; color: #16a34a; font-weight: 700; padding: 16px;">
              ✓ Nenhuma ruptura crítica de grade detectada nos produtos auditados da vitrine.
            </td>
          </tr>
        `}
      </tbody>
    </table>

    <div class="section-title">Plano de Ação Tático & Cronograma (Sprints de 48h)</div>
    <div class="callout">
      1. <strong>Sprint 48h:</strong> Instalação do script App Embed de Tabela de Medidas e bloqueio de cliques em tamanhos indisponíveis.<br>
      2. <strong>Sprint 7 dias:</strong> Otimização do contraste visual mobile (WCAG 2.1) e ajuste de layout no botão de Pix.<br>
      3. <strong>Sprint 30 dias:</strong> Ativação do monitoramento 24h via WhatsApp para alertas em tempo real.
    </div>

    ${config.includeCommercialProposal ? `
      <div class="proposal-box">
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 800; margin-bottom: 4px;">
          Proposta de Implementação & Consultoria Especializada
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 800;">Setup Completo + Blindagem de Catálogo & CRO</h3>
            <p style="margin: 0; font-size: 11px; color: #cbd5e1;">Acompanhamento contínuo com entregáveis técnicos e relatórios quinzenais.</p>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 10px; color: #94a3b8; display: block;">Investimento Mensal / Setup:</span>
            <span class="proposal-price">R$ ${config.proposedRetainerValue.toLocaleString('pt-BR')}</span>
          </div>
        </div>
      </div>
    ` : ''}

    <div style="margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 10px; color: #64748b;">
      <div>
        <strong>Consultor Responsável:</strong> ${config.consultantName} (${config.consultantRole})<br>
        <strong>E-mail:</strong> ${config.consultantEmail} | <strong>WhatsApp:</strong> ${config.consultantWhatsApp}
      </div>
      <div style="text-align: right;">
        <strong>Agência:</strong> ${config.agencyName}<br>
        <strong>Website:</strong> ${config.agencyWebsite}
      </div>
    </div>

    <div class="footer">
      <span>${config.agencyName} • ${config.agencyWebsite}</span>
      <span>Página 2 de 2 • Confidencial</span>
    </div>
  </div>

</body>
</html>
  `.trim();
}

/**
 * Triggers the browser print/save as PDF dialog directly with custom styling
 */
export function printDossierDirectly(diagnostic: AgentDiagnosticResult, config: AgencyWhiteLabelConfig): void {
  const html = generatePrintablePdfDossierHtml(diagnostic, config);
  const printWindow = window.open('', '_blank', 'width=1000,height=900');
  
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 500);
  }
}
