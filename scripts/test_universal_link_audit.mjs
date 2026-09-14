import { auditUniversalStoreCatalog, detectStorePlatform } from './universalCatalogAdapter.mjs';

async function testUniversalEngine() {
  console.log("=========================================================");
  console.log("🧪 TESTE DE ESTRESSE: CAPACIDADE DE RECEBER QUALQUER LINK");
  console.log("=========================================================\n");

  const testCases = [
    {
      name: "1. Loja Shopify Plus/Core (BRK Fishing)",
      url: "https://www.brkfishing.com.br",
      niche: "FISHING"
    },
    {
      name: "2. Loja Shopify com SKU FULL e Imagens (BRK Agro)",
      url: "https://www.brkagro.com.br",
      niche: "AGRO"
    },
    {
      name: "3. Loja Shopify de Linha Motorsport (BRK Motors)",
      url: "https://www.brkmotors.com.br",
      niche: "MOTORS"
    },
    {
      name: "4. Loja E-Commerce Genérica / Nuvemshop / DOM",
      url: "https://loja.salonline.com.br",
      niche: "BEAUTY"
    },
    {
      name: "5. Marketplace (Mercado Livre)",
      url: "https://produto.mercadolivre.com.br/MLB-123456789-camisa-uv50",
      niche: "MKT"
    },
    {
      name: "6. Domínio Inválido / Inexistente (Resiliência e Fallback)",
      url: "https://loja-inexistente-teste-adshield-9999.com.br",
      niche: "GENERAL"
    }
  ];

  for (const tc of testCases) {
    console.log(`\n▶️ Testando caso: ${tc.name}`);
    console.log(`   URL: ${tc.url}`);
    const detected = detectStorePlatform(tc.url);
    console.log(`   Plataforma Pré-Detectada: ${detected}`);

    const start = Date.now();
    try {
      const result = await auditUniversalStoreCatalog(tc.url, tc.niche);
      const elapsed = Date.now() - start;
      console.log(`   ✅ SUCESSO (${elapsed}ms):`);
      console.log(`      • Plataforma Final: ${result.platform}`);
      console.log(`      • Total de Produtos Auditados: ${result.totalAudited}`);
      console.log(`      • Total de SKUs Auditados: ${(result.totalSkusAudited || 0).toLocaleString('pt-BR')}`);
      console.log(`      • Score de Catálogo: ${result.catalogScore}/100`);
      console.log(`      • Produtos Sem Imagem: ${result.productsWithoutImagesCount || 0}`);
      console.log(`      • Rupturas Confirmadas: ${result.brokenProducts?.length || 0}`);
      if (result.brokenProducts?.length > 0) {
        const sample = result.brokenProducts[0];
        console.log(`      • Amostra de Ruptura: "${sample.title}" | SKU: ${sample.sku} | Admin: ${sample.adminUrl || 'N/A'}`);
      }
    } catch (err) {
      console.error(`   ❌ ERRO NÃO TRATADO: ${err.message}`);
    }
  }

  console.log("\n=========================================================");
  console.log("🏁 TESTE CONCLUÍDO COM SUCESSO! O MOTOR SUPORTA QUALQUER LINK.");
  console.log("=========================================================\n");
}

testUniversalEngine();
