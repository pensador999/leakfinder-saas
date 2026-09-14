// ==============================================================================
// 🛡️ ADSHIELD CHROME EXTENSION POPUP SCRIPT 2.0
// Receives live audit telemetry from content.js, formats risk calculations,
// provides 1-click WhatsApp copy, and deep-links directly into the SaaS dossier.
// ==============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  let currentDomain = '';
  let currentPlatform = 'E-commerce';
  let estimatedLoss = 2500;
  let ruptureInfo = '2 tamanhos esgotados';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) return;

    const url = new URL(tab.url);
    currentDomain = url.hostname.replace(/^www\./, '');

    const domainLabelEl = document.getElementById('domainLabel');
    if (domainLabelEl) domainLabelEl.textContent = currentDomain;

    // Send audit message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'AUDIT_PAGE' }, (response) => {
      if (chrome.runtime.lastError || !response || !response.success) {
        // Fallback for pages where content script didn't respond (e.g. chrome:// or restricted)
        const platformEl = document.getElementById('platformBadge');
        if (platformEl) platformEl.textContent = 'Modo Sandbox';
        return;
      }

      // Update Platform
      if (response.platform) {
        currentPlatform = response.platform;
        const platformEl = document.getElementById('platformBadge');
        if (platformEl) platformEl.textContent = currentPlatform;
      }

      // Update Score
      const scoreBadgeEl = document.getElementById('scoreBadge');
      if (scoreBadgeEl && response.integrityScore !== undefined) {
        scoreBadgeEl.textContent = `Score: ${response.integrityScore}/100`;
        scoreBadgeEl.style.color = response.integrityScore >= 80 ? '#34d399' : (response.integrityScore >= 60 ? '#fbbf24' : '#fb7185');
      }

      // Update Meta Pixel
      const pixelEl = document.getElementById('metaPixelStatus');
      if (pixelEl) {
        if (response.hasMetaPixel) {
          pixelEl.textContent = 'Ativo (Meta Pixel)';
          pixelEl.className = 'check-status status-green';
        } else {
          pixelEl.textContent = 'Não Detectado';
          pixelEl.className = 'check-status status-red';
        }
      }

      // Update Rupture
      const ruptureEl = document.getElementById('brokenGridStatus');
      if (ruptureEl) {
        if (response.ruptureDetected) {
          ruptureInfo = response.ruptureDetails || 'Tamanhos esgotados';
          ruptureEl.textContent = ruptureInfo;
          ruptureEl.className = 'check-status status-red';
        } else {
          ruptureInfo = 'Grade íntegra';
          ruptureEl.textContent = response.ruptureDetails || 'Grade Íntegra';
          ruptureEl.className = 'check-status status-green';
        }
      }

      // Update Size Chart
      const sizeChartEl = document.getElementById('sizeChartStatus');
      if (sizeChartEl) {
        if (response.hasSizeChart) {
          sizeChartEl.textContent = 'Instalada';
          sizeChartEl.className = 'check-status status-green';
        } else {
          sizeChartEl.textContent = 'Ausente na PDP';
          sizeChartEl.className = 'check-status status-amber';
        }
      }

      // Update CNPJ
      const cnpjEl = document.getElementById('cnpjStatus');
      if (cnpjEl) {
        if (response.hasCnpj) {
          cnpjEl.textContent = 'Conforme (No Rodapé)';
          cnpjEl.className = 'check-status status-green';
        } else {
          cnpjEl.textContent = 'Não Encontrado';
          cnpjEl.className = 'check-status status-amber';
        }
      }

      // Update Loss Estimate
      if (response.estimatedWasteMonthly && response.estimatedWasteMonthly > 0) {
        estimatedLoss = response.estimatedWasteMonthly;
      }
      const lossEl = document.getElementById('adWasteValue');
      if (lossEl) {
        lossEl.textContent = `R$ ${estimatedLoss.toLocaleString('pt-BR')} /mês`;
      }
    });

    // WhatsApp Script Copy Button
    const btnCopyAlert = document.getElementById('btnCopyAlert');
    if (btnCopyAlert) {
      btnCopyAlert.addEventListener('click', () => {
        const text = `🚨 *DIAGNÓSTICO ADSHIELD • SINAL DE RISCO EM ANÚNCIOS*\n\n` +
          `Olá! Inspecionamos a loja *${currentDomain}* (${currentPlatform}) e identificamos que há produtos ativos em campanhas sofrendo com *${ruptureInfo}*.\n\n` +
          `💸 *Desperdício Estimado em Cliques:* ~R$ ${estimatedLoss.toLocaleString('pt-BR')}/mês\n` +
          `🎯 *Recomendação Imediata:* Pausar anúncios desses SKUs ou substituir pelas URLs com grade disponível.\n\n` +
          `👉 Veja o laudo técnico completo e auditado: https://leakfinder-green.vercel.app/?url=${encodeURIComponent(currentDomain)}`;

        navigator.clipboard.writeText(text).then(() => {
          btnCopyAlert.innerHTML = '<span>✅ Script Copiado com Sucesso!</span>';
          setTimeout(() => {
            btnCopyAlert.innerHTML = '<span>📋 Copiar Alerta WhatsApp para o Gestor</span>';
          }, 2500);
        });
      });
    }

    // Open Full SaaS Dossier Button
    const btnOpenFullDossier = document.getElementById('btnOpenFullDossier');
    if (btnOpenFullDossier) {
      btnOpenFullDossier.addEventListener('click', () => {
        const saasUrl = `https://leakfinder-green.vercel.app/?url=${encodeURIComponent(currentDomain)}`;
        chrome.tabs.create({ url: saasUrl });
      });
    }

  } catch (e) {
    console.error('Extension popup initialization error:', e);
  }
});

