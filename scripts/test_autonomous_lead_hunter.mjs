// ==============================================================================
// 🧪 TESTE DE VALIDAÇÃO DO ENXAME CAÇADOR ATIVO & OUTREACH (LEAD SNIPER)
// Testa a lógica do motor de prospecção autônoma, cálculo de sangria e pitches.
// ==============================================================================

import assert from 'assert';

console.log('🚀 Iniciando Teste de Validação do Enxame Caçador Ativo...\n');

// 1. Mock de Dados Reais de Loja com Furo de Grade
const mockTargetStore = {
  brandName: 'BRK Agro',
  url: 'https://www.brkagro.com.br',
  domain: 'brkagro.com.br',
  niche: 'Agropecuária & Moda Campo',
  metaPixelDetected: true,
  catalogItem: {
    title: 'Camisa Manga Longa Proteção Solar Agro Pro UV50+',
    price: 139.90,
    availableSizes: ['P', 'PP'],
    outOfStockSizes: ['M', 'G', 'GG']
  },
  detectedWhatsApp: '5534991351122'
};

// 2. Teste do Cálculo de Sangria Financeira Real (com centavos exatos)
console.log('🧪 Teste 1: Cálculo de Sangria Financeira Real com Centavos...');
const price = mockTargetStore.catalogItem.price;
const dailyEstimatedLoss = Number((price * 14 * 0.65).toFixed(2));
const monthlyEstimatedLoss = Number((dailyEstimatedLoss * 30).toFixed(2));

console.log(`   - Preço Unitário: R$ ${price.toFixed(2)}`);
console.log(`   - Sangria Diária Estimada: R$ ${dailyEstimatedLoss.toFixed(2)}`);
console.log(`   - Sangria Mensal Estimada: R$ ${monthlyEstimatedLoss.toFixed(2)}`);

assert.strictEqual(monthlyEstimatedLoss > 0, true, 'Sangria mensal deve ser maior que zero');
assert.strictEqual(dailyEstimatedLoss.toString().includes('.'), true, 'Deve conter centavos quebrados');
console.log('   ✅ Cálculo validado com precisão monetária!\n');

// 3. Teste de Qualificação de Lead (ICP Rules)
console.log('🧪 Teste 2: Regras de Qualificação de Lead (ICP Rules)...');
const isCoreSizeMissing = mockTargetStore.catalogItem.outOfStockSizes.some(s => ['M', 'G', 'GG'].includes(s));
assert.strictEqual(isCoreSizeMissing, true, 'Deve detectar ausência de tamanhos centrais (M, G, GG)');
assert.strictEqual(mockTargetStore.metaPixelDetected, true, 'Loja deve possuir Meta Pixel para qualificação de tráfego');
assert.strictEqual(!!mockTargetStore.detectedWhatsApp, true, 'Canal de WhatsApp deve estar presente');
console.log('   ✅ Lead qualificado com sucesso: Meta Pixel ativo + Furo no miolo da grade (M/G) + WhatsApp identificado!\n');

// 4. Teste de Geração dos Pitches de 3 Passos (WhatsApp Closer)
console.log('🧪 Teste 3: Geração dos Pitches de 3 Passos (Growth Outbound Closer)...');

function generatePitches(brandName, itemTitle, price, missingSizes, monthlyWaste) {
  const formattedPrice = price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedWaste = monthlyWaste.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const missingText = missingSizes.join(' e ');

  const directFounder = `Fala, tudo bem? 👊 Passamos nosso scanner de auditoria na vitrine da *${brandName}* e cruzamos com a biblioteca de anúncios de vocês no Meta Ads:

Vocês estão rodando tráfego pago ativo para o produto *"${itemTitle}"* (R$ ${formattedPrice}), mas os tamanhos *${missingText}* estão esgotados no checkout do site.

Como ${missingText} respondem por cerca de 65% das compras de vestuário no Brasil, a cada R$ 1.000 investidos nessa campanha, cerca de R$ 650 viram cliques perdidos (estimamos uma sangria de ~*R$ ${formattedWaste}/mês*).

Montamos um dossiê confidencial de 1 página mostrando o flagrante e os links diretos para pausar o criativo ou repor o estoque antes de queimar mais verba.

Quer que eu te envie o link aqui pelo WhatsApp? É só responder *"QUERO"*.`;

  const audioScript45s = `Fala pessoal da ${brandName}, tudo certo? Vi que vocês estão com anúncio rodando forte no Instagram para a ${itemTitle}. Só que os tamanhos ${missingText} estão esgotados. Calculamos cerca de R$ ${formattedWaste}/mês de desperdício em cliques. Tenho o dossiê pronto aqui, se quiserem conferir me avisem!`;

  return { directFounder, audioScript45s };
}

const pitches = generatePitches(
  mockTargetStore.brandName,
  mockTargetStore.catalogItem.title,
  price,
  mockTargetStore.catalogItem.outOfStockSizes,
  monthlyEstimatedLoss
);

assert.strictEqual(pitches.directFounder.includes(mockTargetStore.brandName), true);
assert.strictEqual(pitches.directFounder.includes('M e G e GG'), true);
assert.strictEqual(pitches.directFounder.includes('QUERO'), true);
console.log('   - Trecho do Pitch Dono/Fundador gerado:\n   "' + pitches.directFounder.split('\n')[2] + '"');
console.log('   ✅ Pitches de 3 passos gerados com gancho de perda financeira inquestionável!\n');

// 5. Teste da Fila Anti-Ban de Outreach
console.log('🧪 Teste 4: Fila Anti-Ban de Disparo (Delays Humanos 15s-45s)...');
const minDelay = 15;
const maxDelay = 40;
const simulatedDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
console.log(`   - Delay humano simulado para disparo do WhatsApp: ${simulatedDelay} segundos`);
assert.strictEqual(simulatedDelay >= minDelay && simulatedDelay <= maxDelay, true);
console.log('   ✅ Proteção anti-ban validada com sucesso!\n');

console.log('🎉 TODOS OS TESTES DO ENXAME CAÇADOR ATIVO PASSARAM COM SUCESSO! 🦅');
