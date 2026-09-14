// ==============================================================================
// 🎣 AUDITORIA DE PROFUNDIDADE TOTAL — BRK FISHING (12.000+ SKUS REAIS)
// Varre todas as páginas públicas (/products.json?limit=250) sem truncamento.
// ==============================================================================

import fs from 'fs';
import { falsifyProductAnomaly } from './modules/popperianFalsifier.mjs';
import { detectProductManufacturingType } from './universalCatalogAdapter.mjs';

async function auditAllSkusBrkFishing() {
  console.log('================================================================');
  console.log(' 🚀 INICIANDO VARREDURA DE CATÁLOGO TOTAL — BRK FISHING');
  console.log(' Objetivo: Penetrar em 100% dos SKUs (Sem truncar em 30 produtos)');
  console.log('================================================================\n');

  const t0 = Date.now();
  let page = 1;
  const allProducts = [];

  while (true) {
    const pageUrl = `https://www.brkfishing.com.br/products.json?limit=250&page=${page}`;
    const pStart = Date.now();
    try {
      const res = await fetch(pageUrl, {
        headers: { 'User-Agent': 'AdShield-Deep-War-Crawler/2026.4' }
      });
      if (!res.ok) {
        console.warn(`   ⚠️ Página ${page} retornou HTTP ${res.status}. Encerrando paginação.`);
        break;
      }
      const data = await res.json();
      const list = data.products || [];
      if (list.length === 0) break;

      allProducts.push(...list);
      console.log(`   📄 Página ${page}: Baixados ${list.length} produtos em ${Date.now() - pStart}ms (Acumulado: ${allProducts.length})`);
      if (list.length < 250) break;
      page++;
      await new Promise(r => setTimeout(r, 150));
    } catch (err) {
      console.error(`   ❌ Erro ao baixar página ${page}:`, err.message);
      break;
    }
  }

  const downloadTimeSec = ((Date.now() - t0) / 1000).toFixed(2);
  console.log(`\n✅ Coleta concluída: ${allProducts.length} produtos pai baixados em ${downloadTimeSec}s!`);

  // Agora processar e auditar cada produto e suas variantes
  let totalSkus = 0;
  let apparelCount = 0;
  let exemptCount = 0;
  let inHouseBroken = [];
  let resaleBroken = [];

  for (const p of allProducts) {
    const variants = p.variants || [];
    totalSkus += variants.length;

    // Verificar isenção de acessórios
    const titleUpper = (p.title || '').toUpperCase();
    const typeUpper = (p.product_type || '').toUpperCase();
    const isExempt = 
      titleUpper.includes('ISCA') || titleUpper.includes('VARA') || titleUpper.includes('CARRETILHA') ||
      titleUpper.includes('MOLINETE') || titleUpper.includes('LINHA') || titleUpper.includes('ANZOL') ||
      titleUpper.includes('BONÉ') || titleUpper.includes('BONE') || titleUpper.includes('MANGUITO') ||
      titleUpper.includes('BANDANA') || titleUpper.includes('ADESIVO') || titleUpper.includes('CHAVEIRO') ||
      titleUpper.includes('_FULL') || typeUpper.includes('ACESSÓRIO');

    if (isExempt) {
      exemptCount++;
      continue;
    }

    // Verificar se tem tamanhos de vestuário
    const sizeNames = ['P', 'M', 'G', 'GG', 'XG', 'XXG', 'G1', 'G2'];
    const hasApparelVariants = variants.some(v => sizeNames.includes(String(v.title || '').trim().toUpperCase()));
    if (!hasApparelVariants) continue;

    apparelCount++;

    // Mapear disponibilidade de P, M, G, GG
    const coreSizes = ['P', 'M', 'G', 'GG'];
    const missingCore = [];
    const availableSizes = [];

    coreSizes.forEach(sz => {
      const variant = variants.find(v => String(v.title || '').trim().toUpperCase() === sz);
      if (!variant || !variant.available) {
        missingCore.push(sz);
      } else {
        availableSizes.push(sz);
      }
    });

    if (missingCore.length > 0) {
      const manufacturing = detectProductManufacturingType(p);
      const brokenItem = {
        id: p.id,
        title: p.title,
        handle: p.handle,
        url: `https://www.brkfishing.com.br/products/${p.handle}`,
        price: parseFloat(variants[0]?.price || '169.90'),
        missingSizes: missingCore,
        availableSizes,
        isResale: manufacturing.isResale,
        manufacturingType: manufacturing.manufacturingType,
        category: manufacturing.category,
        action: manufacturing.recommendedSupplyAction
      };

      // Rigor Popperiano
      const falsification = falsifyProductAnomaly(brokenItem);
      if (falsification.isResistant) {
        if (manufacturing.isResale) {
          resaleBroken.push(brokenItem);
        } else {
          inHouseBroken.push(brokenItem);
        }
      }
    }
  }

  console.log('\n================================================================');
  console.log(' 📊 RESULTADO DA AUDITORIA MASSIVA REAL (SEM TRUNCAMENTO):');
  console.log('================================================================');
  console.log(` • Produtos Pai Auditados: ${allProducts.length}`);
  console.log(` • Total de SKUs de Variantes Auditados: ${totalSkus.toLocaleString('pt-BR')}`);
  console.log(` • Produtos de Vestuário com Grade: ${apparelCount}`);
  console.log(` • Itens Isentos (Acessórios, Equipamentos, _FULL): ${exemptCount}`);
  console.log(` • 🏭 Confecção Própria com Furo de Grade: ${inHouseBroken.length} produtos`);
  console.log(` • 🛍️ Revenda Externa com Furo de Grade: ${resaleBroken.length} produtos`);

  const inHouseMonthlyLoss = inHouseBroken.reduce((acc, p) => acc + (p.price * 30), 0);
  const resaleMonthlyLoss = resaleBroken.reduce((acc, p) => acc + (p.price * 30), 0);
  const totalMonthlyBleed = inHouseMonthlyLoss + resaleMonthlyLoss;

  console.log(`\n💰 SANGRIAS REAIS EM MÍDIA CALCULADAS:`);
  console.log(` • Sangria Confecção Própria (PCP): R$ ${inHouseMonthlyLoss.toLocaleString('pt-BR')}/mês`);
  console.log(` • Sangria Revenda Externa: R$ ${resaleMonthlyLoss.toLocaleString('pt-BR')}/mês`);
  console.log(` • Sangria Total em Risco: R$ ${totalMonthlyBleed.toLocaleString('pt-BR')}/mês`);

  if (inHouseBroken.length > 0) {
    console.log(`\n🏭 Top 5 Itens de Fabricação Própria com Ruptura Real:`);
    inHouseBroken.slice(0, 5).forEach((p, idx) => {
      console.log(`   [${idx + 1}] "${p.title}" sem [${p.missingSizes.join(', ')}] | R$ ${p.price.toFixed(2)}`);
      console.log(`       URL: ${p.url}`);
    });
  }

  if (resaleBroken.length > 0) {
    console.log(`\n🛍️ Top 5 Itens de Revenda Externa com Ruptura Real:`);
    resaleBroken.slice(0, 5).forEach((p, idx) => {
      console.log(`   [${idx + 1}] "${p.title}" sem [${p.missingSizes.join(', ')}] | R$ ${p.price.toFixed(2)}`);
      console.log(`       URL: ${p.url}`);
    });
  }

  // Salvar relatório completo de profundidade
  const fullReport = {
    audited_at: new Date().toISOString(),
    store: 'BRK Fishing',
    url: 'https://www.brkfishing.com.br',
    total_parent_products: allProducts.length,
    total_variants_skus: totalSkus,
    apparel_products_count: apparelCount,
    exempt_items_count: exemptCount,
    in_house_broken_count: inHouseBroken.length,
    resale_broken_count: resaleBroken.length,
    in_house_monthly_loss_brl: inHouseMonthlyLoss,
    resale_monthly_loss_brl: resaleMonthlyLoss,
    total_monthly_loss_brl: totalMonthlyBleed,
    in_house_broken_sample: inHouseBroken.slice(0, 20),
    resale_broken_sample: resaleBroken.slice(0, 20)
  };

  fs.writeFileSync('data/brk_fishing_deep_audit.json', JSON.stringify(fullReport, null, 2), 'utf8');
  console.log('\n💾 Dossiê massivo salvo em: data/brk_fishing_deep_audit.json');
}

auditAllSkusBrkFishing();
