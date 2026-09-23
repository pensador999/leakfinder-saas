import assert from 'node:assert';
import { 
  neutralizeOverlaysAndPopupsInPage, 
  getInPagePopupBusterScript 
} from '../src/services/network/autoPopupBuster.ts';
import { 
  AdaptiveCrawlerQueue 
} from '../src/services/crawler/adaptiveCrawlerQueue.ts';
import { 
  detectEcommercePlatform, 
  extractUrlsFromXmlSitemap, 
  parseProductJsonLd,
  extractNavigationCollectionsFromHtml,
  parseVtexSearchProductItem,
  parseWooCommerceProductHtml
} from '../src/services/scrapers/platformAdapters.ts';

console.log('🧪 INICIANDO BATERIA DE TESTES: RESILIÊNCIA, POPUP BUSTER & MULTI-CMS CRAWLING');

// --------------------------------------------------------------------------
// TESTE 1: AutoPopupBuster Script Generation
// --------------------------------------------------------------------------
console.log('\n▶ Teste 1: Validação do AutoPopupBuster');
const script = getInPagePopupBusterScript();
assert(typeof script === 'string' && script.length > 50, 'Script deve ser string executável válida');
assert(script.includes('Escape'), 'Script deve incluir simulação de Escape');
assert(script.includes('pointer-events'), 'Script deve neutralizar pointer-events');
console.log('✅ Teste 1 passou: Script gerado e validado com sucesso!');

// --------------------------------------------------------------------------
// TESTE 2: AdaptiveCrawlerQueue com Jitter e Backoff
// --------------------------------------------------------------------------
console.log('\n▶ Teste 2: Validação da Fila com Cadência Humana (AdaptiveCrawlerQueue)');

let progressReports = [];
const queue = new AdaptiveCrawlerQueue({
  minDelayMs: 20, // Rápido para o teste unitário
  maxDelayMs: 50,
  concurrency: 1,
  timeoutPerTaskMs: 2000,
  onProgress: (p) => progressReports.push(p)
});

const mockTasks = [
  {
    id: 'task-1',
    url: 'https://exemplo.com/produtos/camisa-1',
    type: 'PRODUCT',
    execute: async () => ({ title: 'Camisa 1', price: 99.9 })
  },
  {
    id: 'task-2',
    url: 'https://exemplo.com/produtos/camisa-2',
    type: 'PRODUCT',
    execute: async () => ({ title: 'Camisa 2', price: 129.9 })
  },
  {
    id: 'task-3',
    url: 'https://exemplo.com/collections/novidades',
    type: 'COLLECTION',
    execute: async () => ({ title: 'Novidades', count: 10 })
  }
];

const queueStart = Date.now();
const queueResult = await queue.processAll(mockTasks);
const queueDuration = Date.now() - queueStart;

assert.strictEqual(queueResult.results.length, 3, 'Deve processar todas as 3 tarefas');
assert.strictEqual(queueResult.successRatePct, 100, 'Taxa de sucesso deve ser 100%');
assert(queueDuration >= 40, 'Deve ter aplicado o delay humano entre as tarefas');
assert.strictEqual(progressReports.length, 3, 'Deve emitir 3 notificações de progresso');
console.log(`✅ Teste 2 passou: 3 tarefas processadas com cadência controlada em ${queueDuration}ms!`);

// --------------------------------------------------------------------------
// TESTE 3: Detecção Multi-CMS Universal (Shopify, Nuvemshop, Tray, VTEX, WooCommerce)
// --------------------------------------------------------------------------
console.log('\n▶ Teste 3: Detecção de Plataformas Multi-CMS');

const platformsToTest = [
  { html: '<script src="https://cdn.shopify.com/s/files/1.js"></script>', url: 'https://brkagro.com.br', expected: 'Shopify' },
  { html: '<div data-tray-tst="catalog_product"><span class="preco-destaque">R$ 150,00</span></div>', url: 'https://agrostore.com.br', expected: 'Tray' },
  { html: '<div class="js-product-out-of-stock"><span class="js-price-display">R$ 89,90</span></div>', url: 'https://modafeminina.lojavirtualnuvem.com.br', expected: 'Nuvemshop' },
  { html: '<script src="https://vteximg.com.br/scripts.js"></script>', url: 'https://loja.com.br', expected: 'VTEX' },
  { html: '<link rel="stylesheet" href="/wp-content/plugins/woocommerce/assets/css/style.css">', url: 'https://artigos.com.br', expected: 'WooCommerce' }
];

for (const t of platformsToTest) {
  const detected = detectEcommercePlatform(t.html, t.url);
  assert.strictEqual(detected, t.expected, `Esperava ${t.expected}, obteve ${detected}`);
}
console.log('✅ Teste 3 passou: 5 plataformas brasileiras e globais detectadas com precisão!');

// --------------------------------------------------------------------------
// TESTE 4: Sitemap XML & Coleções & JSON-LD Microdados
// --------------------------------------------------------------------------
console.log('\n▶ Teste 4: Extração Universal via Sitemap XML, Coleções e JSON-LD');

const sampleSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://minhaloja.com.br/produtos/bota-texana</loc></url>
  <url><loc>https://minhaloja.com.br/produtos/chapeu-palha</loc></url>
  <url><loc>https://minhaloja.com.br/pagina/quem-somos</loc></url>
  <url><loc>https://minhaloja.com.br/blog/artigo-1</loc></url>
</urlset>`;

const urls = extractUrlsFromXmlSitemap(sampleSitemap);
assert.strictEqual(urls.length, 2, 'Deve filtrar páginas institucionais e blogs, mantendo apenas 2 produtos');
assert(urls[0].includes('bota-texana'), 'Primeira URL deve ser da bota');

const sampleHtmlWithCollections = `
<nav>
  <a href="/collections/camisas-masculinas">Camisas Masculinas</a>
  <a href="/collections/bones-trucker">Bonés Trucker</a>
  <a href="/institucional/sobre-nos">Sobre Nós</a>
</nav>
`;

const collections = extractNavigationCollectionsFromHtml(sampleHtmlWithCollections, 'https://brkagro.com.br');
assert.strictEqual(collections.length, 2, 'Deve extrair apenas as 2 coleções/categorias reais');
assert.strictEqual(collections[0].handle, 'camisas-masculinas');

const sampleJsonLd = `
<html>
<head>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": "Bota Campeira Couro Legítimo",
    "image": "https://cdn.loja.com/bota.jpg",
    "sku": "BOT-001",
    "offers": {
      "@type": "Offer",
      "price": "389.90",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock"
    }
  }
  </script>
</head>
</html>
`;

const parsedSchema = parseProductJsonLd(sampleJsonLd);
assert.strictEqual(parsedSchema.title, 'Bota Campeira Couro Legítimo');
assert.strictEqual(parsedSchema.price, 389.90);
assert.strictEqual(parsedSchema.sku, 'BOT-001');
assert.strictEqual(parsedSchema.availability, 'InStock');

console.log('✅ Teste 4 passou: Sitemap XML, Coleções de navegação e Schema.org JSON-LD extraídos 100%!');

console.log('\n🏆 TODOS OS 4 TESTES DE RESILIÊNCIA E AUDITORIA MULTI-CMS PASSARAM COM SUCESSO!\n');
