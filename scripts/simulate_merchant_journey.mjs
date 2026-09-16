// ==============================================================================
// 🧪 SIMULAÇÃO DE JORNADA DO LOJISTA EM TEMPO REAL (STRESS-TEST END-TO-END)
// Simula a auditoria de uma loja real ao vivo, executa o extrator de variantes,
// calcula o simulador dinâmico e gera o laudo de WhatsApp para o fundador.
// ==============================================================================

import { 
  extractFromShopifyJson, 
  checkProductExemption,
  isFootwearProduct
} from '../src/services/catalog/universalVariantExtractor.ts';

import { 
  formatWhatsAppAlertMessage 
} from '../src/services/monitoring/sentinelCloudDaemon.ts';

console.log('╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║ 🛡️ SIMULAÇÃO AO VIVO • JORNADA DO LOJISTA NO ADSHIELD SENTINEL 24/7        ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

async function testLiveStore(domain) {
  console.log(`📡 [1/3] Conectando ao catálogo público ao vivo de https://${domain}...`);
  
  try {
    const url = `https://${domain}/products.json?limit=10`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) {
      console.log(`⚠️ Status ${res.status}: Loja com proteção Cloudflare ou catálogo restrito.`);
      return runFallbackSimulation(domain);
    }

    const data = await res.json();
    const products = data.products || [];
    console.log(`✅ Sucesso: ${products.length} produtos obtidos ao vivo da ${domain}!\n`);

    console.log(`🔬 [2/3] Executando Universal Variant Extractor em cada produto...`);
    const brokenItems = [];

    for (const prod of products) {
      const result = extractFromShopifyJson(prod);
      
      if (result.isSingleSizeOrExempt) {
        console.log(`  ⚪ [ISENTO] ${prod.title.substring(0, 40)}... -> ${result.exemptionReason}`);
      } else if (result.rupturedSizes.length > 0) {
        console.log(`  🚨 [RUPTURA] ${prod.title.substring(0, 40)}... -> Tamanhos em falta: [${result.rupturedSizes.join(', ')}]`);
        brokenItems.push({
          title: prod.title,
          handle: prod.handle,
          brokenSizes: result.rupturedSizes,
          lossEstimateMonthly: result.estimatedMonthlyLoss
        });
      } else {
        console.log(`  🟢 [ÍNTEGRO] ${prod.title.substring(0, 40)}... -> Todos os tamanhos ativos`);
      }
    }

    console.log(`\n📊 [3/3] Gerando Laudo Executivo e Alerta WhatsApp (Simulador Dinâmico)...`);
    const totalLoss = brokenItems.reduce((acc, curr) => acc + curr.lossEstimateMonthly, 0);
    const whatsappAlert = formatWhatsAppAlertMessage(domain, brokenItems, totalLoss);

    console.log('────────────────────────────────────────────────────────────────────────────');
    console.log('📱 MENSAGEM GERADA PARA O WHATSAPP DO LOJISTA:');
    console.log('────────────────────────────────────────────────────────────────────────────');
    console.log(whatsappAlert);
    console.log('────────────────────────────────────────────────────────────────────────────\n');

    console.log('🎉 SIMULAÇÃO CONCLUÍDA COM 100% DE GROUNDING!');
    console.log(`• Produtos auditados: ${products.length}`);
    console.log(`• Rupturas reais comprovadas: ${brokenItems.length}`);
    console.log(`• Risco mensal calculado no simulador: R$ ${totalLoss.toLocaleString('pt-BR')}`);

  } catch (err) {
    console.error('Erro na conexão ao vivo:', err.message);
    runFallbackSimulation(domain);
  }
}

function runFallbackSimulation(domain) {
  console.log('\n💡 Rodando simulação com produto auditado padrão:');
  const mockProduct = {
    title: 'Camiseta Modal Confort Classic',
    handle: 'camiseta-modal-confort-classic',
    tags: ['Masculino', 'Casual'],
    options: ['Tamanho'],
    variants: [
      { title: 'P', available: true, price: '169.00' },
      { title: 'M', available: false, price: '169.00', inventory_policy: 'deny' },
      { title: 'G', available: false, price: '169.00', inventory_policy: 'deny' },
      { title: 'GG', available: true, price: '169.00' }
    ]
  };

  const result = extractFromShopifyJson(mockProduct);
  const brokenItems = [{
    title: mockProduct.title,
    handle: mockProduct.handle,
    brokenSizes: result.rupturedSizes,
    lossEstimateMonthly: result.estimatedMonthlyLoss
  }];

  const alertMsg = formatWhatsAppAlertMessage(domain, brokenItems, result.estimatedMonthlyLoss);
  console.log(alertMsg);
}

// Executa com a loja passada como argumento ou default
const targetDomain = process.argv[2] || 'brkagro.com.br';
testLiveStore(targetDomain);
