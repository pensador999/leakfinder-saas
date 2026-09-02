// ==============================================================================
// 🛡️ ADSHIELD CHROME EXTENSION CONTENT SCRIPT
// Inspects active DOM for pixels, platform, and stock indicators
// ==============================================================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'AUDIT_PAGE') {
    const html = document.documentElement.outerHTML || '';
    
    // Detect Meta Pixel
    const hasPixel = html.includes('fbevents.js') || html.includes('fbq(') || html.includes('connect.facebook.net');

    // Detect Platform
    let platform = 'E-commerce';
    if (html.includes('cdn.shopify.com') || window.Shopify) platform = 'Shopify';
    else if (html.includes('vtexassets.com') || html.includes('vtex.com')) platform = 'VTEX';
    else if (html.includes('nuvemshop.com.br') || html.includes('d3ugyf2ht6aenh.cloudfront.net')) platform = 'Nuvemshop';
    else if (html.includes('tray.com.br')) platform = 'Tray';

    sendResponse({
      hasPixel,
      platform
    });
  }
  return true;
});
