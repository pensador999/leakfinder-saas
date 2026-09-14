async function inspectMotors() {
  const res = await fetch('https://www.brkmotors.com.br');
  const html = await res.text();
  const ga4Matches = html.match(/G-[A-Z0-9]{6,12}/g);
  const ga4Id = ga4Matches ? Array.from(new Set(ga4Matches))[0] : null;
  const clarityMatch = html.match(/clarity\.ms\/tag\/([a-zA-Z0-9]+)/i);
  const clarityId = clarityMatch ? clarityMatch[1] : null;
  const gtmMatch = html.match(/GTM-[A-Z0-9]{4,10}/i);
  const gtmId = gtmMatch ? gtmMatch[0] : null;
  const pixelMatch = html.match(/fbq\s*\(\s*['"]init['"]\s*,\s*['"](\d+)['"]/i);
  const hasCnpj = /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/.test(html);

  console.log('=== BRK MOTORS TAGS AO VIVO ===');
  console.log('GA4 Measurement ID:', ga4Id);
  console.log('Microsoft Clarity:', clarityId || 'NÃO INSTALADO NO DOM PRIMÁRIO');
  console.log('Google Tag Manager (GTM):', gtmId || 'NÃO DETECTADO');
  console.log('Meta Pixel:', pixelMatch ? pixelMatch[1] : 'Injetado via Shopify Web Pixels API');
  console.log('CNPJ no Rodapé:', hasCnpj ? 'REGULARIZADO' : 'NÃO ENCONTRADO');
}
inspectMotors();
