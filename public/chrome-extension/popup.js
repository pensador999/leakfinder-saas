// ==============================================================================
// 🛡️ ADSHIELD CHROME EXTENSION POPUP SCRIPT
// ==============================================================================

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url) return;

    const url = new URL(tab.url);
    const domain = url.hostname.replace('www.', '');

    document.getElementById('domainLabel').textContent = domain;

    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'AUDIT_PAGE' }, (response) => {
      if (response) {
        if (response.platform) document.getElementById('platformBadge').textContent = response.platform;
        if (response.hasPixel !== undefined) {
          document.getElementById('metaPixelStatus').textContent = response.hasPixel ? 'Detectado (Ativo)' : 'Não detectado';
          document.getElementById('metaPixelStatus').className = response.hasPixel ? 'green' : 'red';
        }
      }
    });

    document.getElementById('btnCopyAlert').addEventListener('click', () => {
      const text = `🚨 *ALERTA DE TRÁFEGO • ADSHIELD EXTENSION*\n\nIdentificamos que a loja *${domain}* está com anúncios ativos mas sofrendo com produtos em grade furada nos tamanhos de maior giro (M/G).\n\n💸 *Risco Estimado:* ~R$ 2.450/mês em cliques perdidos.\n👉 Recomenda-se pausar criativos ou substituir URLs.`;
      navigator.clipboard.writeText(text);
      document.getElementById('btnCopyAlert').textContent = '✅ Alerta Copiado!';
      setTimeout(() => {
        document.getElementById('btnCopyAlert').textContent = '📋 Copiar Alerta WhatsApp para o Gestor';
      }, 2000);
    });

    document.getElementById('btnOpenFullDossier').addEventListener('click', () => {
      chrome.tabs.create({ url: `https://leakfinder-green.vercel.app/?url=${encodeURIComponent(domain)}` });
    });

  } catch (e) {
    console.error('Extension popup error:', e);
  }
});
