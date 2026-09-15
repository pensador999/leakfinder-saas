// ==============================================================================
// 🧪 TESTE DA SERVERLESS FUNCTION VERCEL: api/audit.ts
// ==============================================================================

import handler from '../api/audit.js';

console.log('🧪 Testando /api/audit Serverless Function...');

const mockRequest = {
  method: 'POST',
  body: {
    url: 'https://www.insiderstore.com.br',
    includeScreenshot: false
  }
};

let capturedStatusCode = 0;
let capturedData = null;

const mockResponse = {
  status(code) {
    capturedStatusCode = code;
    return this;
  },
  json(payload) {
    capturedData = payload;
    return this;
  }
};

async function runTest() {
  try {
    await handler(mockRequest, mockResponse);
    console.log(`HTTP Status: ${capturedStatusCode}`);
    console.log(`Success: ${capturedData?.success}`);
    console.log(`Environment: ${capturedData?.environment}`);
    console.log(`Page Title: ${capturedData?.data?.pageTitle}`);
    console.log(`Meta Pixel: ${capturedData?.data?.headTags?.hasMetaPixel}`);
    console.log(`CTAs Count: ${capturedData?.data?.conversionElements?.ctaCount}`);
    console.log(`WhatsApp: ${capturedData?.data?.contactChannels?.detectedWhatsApp}`);
    console.log('\n✅ TESTE DA SERVERLESS FUNCTION VERCEL CONCLUÍDO COM SUCESSO!');
  } catch (err) {
    console.error('❌ Erro no teste:', err);
  }
}

runTest();
