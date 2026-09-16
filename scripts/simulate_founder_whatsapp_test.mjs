// ==============================================================================
// 📱 SIMULAÇÃO INTERNA: TESTE REAL NO WHATSAPP DO FUNDADOR
// Validação controlada da entrega do Golden Trio no telefone do fundador
// ==============================================================================

import { 
  buildFounderExperienceTest, 
  simulateFounderTestDispatch 
} from '../src/services/outbound/founderExperienceTester.ts';

console.log('================================================================================');
console.log('📱 [SIMULAÇÃO INTERNA] TESTE DE EXPERIÊNCIA DO CLIENTE NO WHATSAPP DO FUNDADOR');
console.log('   Destino Oficial: 5534991351122 (Fundador AdShield / Lucas)');
console.log('================================================================================\n');

// 1. GERAÇÃO DO PACOTE GOLDEN TRIO PARA O FUNDADOR
const founderPayload = buildFounderExperienceTest({
  founderPhone: '5534991351122',
  founderName: 'Lucas (Fundador AdShield)',
  storeDomain: 'insiderstore.com.br',
  productTitle: 'Daily T-Shirt Tech Algodão Orgânico',
  productUrl: 'https://insiderstore.com.br/products/daily-t-shirt-tech',
  brokenSizes: ['M', 'G'],
  dailyAdBudget: 350
});

console.log('📦 1. PACOTE "GOLDEN TRIO" MONTADO COM SUCESSO:');
console.log(`   - ID do Teste: ${founderPayload.testId}`);
console.log(`   - Destinatário: ${founderPayload.recipientName} (${founderPayload.recipientPhone})`);
console.log(`   - Loja Auditada: ${founderPayload.simulatedAuditSummary.brand}`);
console.log(`   - Tamanhos Rompidos: [${founderPayload.simulatedAuditSummary.criticalSizesBroken.join(', ')}]`);
console.log(`   - Queima Projetada: ${founderPayload.simulatedAuditSummary.monthlyWasteFormatted}`);
console.log(`   - Vídeo Avatar 15s: ${founderPayload.goldenTrioPackage.video.mockVideoUrl} (9:16 PiP)`);
console.log(`   - Print Playwright: ${founderPayload.goldenTrioPackage.evidence.mockScreenshotUrl}`);
console.log(`   - Stripe Checkout 1-Clique: ${founderPayload.goldenTrioPackage.directStripeCheckoutUrl}\n`);

console.log('💬 2. PRÉVIA DA MENSAGEM WHATSAPP A SER RECEBIDA:');
console.log('--------------------------------------------------------------------------------');
console.log(founderPayload.evolutionApiPayload.textMessage);
console.log('--------------------------------------------------------------------------------\n');

console.log('🔗 3. LINKS PARA TESTE REAL NO APARELHO:');
console.log(`   📲 Link Direto WhatsApp Web / Mobile:`);
console.log(`      ${founderPayload.directWhatsAppUrl}`);
console.log(`   ⚡ Link Curto wa.me:`);
console.log(`      ${founderPayload.waMeShortUrl}\n`);

// 2. DISPARO SIMULADO VIA EVOLUTION API GATEWAY
console.log('📡 4. SIMULAÇÃO DE DISPARO NO GATEWAY EVOLUTION API / Z-API:');
const dispatchResult = simulateFounderTestDispatch(founderPayload);
console.log(`   - Status HTTP: ${dispatchResult.httpStatus} OK`);
console.log(`   - Entregue ao Simulador: ${dispatchResult.deliveredToSimulator ? 'SIM (100% SUCESSO)' : 'NÃO'}`);
console.log(`   - Timestamp: ${dispatchResult.deliveryTimestamp}`);
console.log(`   - Delay Anti-Ban Configurado: ${founderPayload.evolutionApiPayload.options.delay}ms\n`);

console.log('================================================================================');
console.log('✅ TESTE DO FUNDADOR VALIDADO COM SUCESSO!');
console.log('   O fundador pode clicar no link wa.me acima para testar no próprio WhatsApp.');
console.log('================================================================================\n');
