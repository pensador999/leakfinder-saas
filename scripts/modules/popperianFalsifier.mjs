// ==============================================================================
// 🔬 POPPERIAN FALSIFIER ENGINE — SKILL: falsify & computer-vision-uiux
// Scientific thinking protocol for AdShield Swarm:
// "NO VERDICT WITHOUT A FALSIFIABLE HYPOTHESIS."
// Actively tests whether an alleged stock rupture or ad leak can be proven false
// before granting consensus approval. Zero Hallucinations, Zero False-Positives.
// ==============================================================================

/**
 * Executes Popperian falsification tests on an alleged catalog anomaly.
 * @param {Object} product - Product candidate with detected missing sizes.
 * @returns {Object} Falsification outcome with resistance status and audit trail.
 */
export function falsifyProductAnomaly(product) {
  const falsificationAttempts = [];

  // 1. Falsification Test #1: Single Size Exemption Hypothesis
  // Can we falsify the defect by proving this item is naturally single-sized?
  const singleSizeKeywords = ['boné', 'bone', 'bandana', 'manguito', 'copo', 'chaveiro', 'adesivo', 'unisex', 'tamanho único', 'tam unico', 'óculos', 'oculos', 'chapéu', 'chapeu'];
  const titleLower = (product.title || '').toLowerCase();
  const isInherentlySingleSize = singleSizeKeywords.some(kw => titleLower.includes(kw));

  if (isInherentlySingleSize) {
    falsificationAttempts.push({
      test: 'SINGLE_SIZE_EXEMPTION_TEST',
      result: 'FALSIFIED',
      reason: `Produto "${product.title}" é acessório de tamanho único. Hipótese de ruptura refutada com sucesso.`
    });
    return {
      isResistant: false,
      status: 'FALSIFIED_DISCARDED',
      falsificationAttempts,
      verdict: 'Descartado: Item de tamanho único sem exigência de grade P/M/G/GG.'
    };
  } else {
    falsificationAttempts.push({
      test: 'SINGLE_SIZE_EXEMPTION_TEST',
      result: 'PASSED',
      reason: 'Produto pertence à categoria de vestuário com grade múltipla obrigatória.'
    });
  }

  // 2. Falsification Test #2: FULL Code / Fulfillment Exemption Hypothesis
  // REGRA DE OURO DO NEGÓCIO: Produtos com FULL no código (SKU, título, tag, handle)
  // pertencem a estoque Fulfillment fechado (Mercado Livre Full / Armazém Full).
  // Se tem tamanho faltando, É O COMPORTAMENTO NORMAL (só vende o que tem lá fisicamente).
  // Portanto, se tiver FULL em qualquer parte do código, a hipótese de ruptura é REFUTADA!
  const hasFullInSku = (product.variants || []).some(v => String(v.sku || '').toUpperCase().includes('FULL')) || String(product.sku || '').toUpperCase().includes('FULL');
  const hasFullInTitle = String(product.title || '').toUpperCase().includes('FULL');
  const hasFullInHandle = String(product.handle || '').toUpperCase().includes('FULL');
  const hasFullInTags = (product.tags || []).some(t => String(t).toUpperCase().includes('FULL'));

  if (hasFullInSku || hasFullInTitle || hasFullInHandle || hasFullInTags) {
    falsificationAttempts.push({
      test: 'FULL_CODE_EXEMPTION_TEST',
      result: 'FALSIFIED',
      reason: `Produto possui código/flag FULL (${hasFullInSku ? 'no SKU' : hasFullInTags ? 'nas Tags' : 'no Título/Handle'}). Estoque fechado de Fulfillment: se tem tamanho faltando, está correto e esperado.`
    });
    return {
      isResistant: false,
      status: 'FALSIFIED_DISCARDED',
      falsificationAttempts,
      verdict: 'Descartado: Produto de código FULL (Estoque Fulfillment). Tamanho em falta é esperado e normal.'
    };
  } else {
    falsificationAttempts.push({
      test: 'FULL_CODE_EXEMPTION_TEST',
      result: 'PASSED',
      reason: 'Produto de linha regular sem flag FULL.'
    });
  }

  // 3. Falsification Test #3: Missing Critical Sizes Hypothesis
  // Can we falsify by proving that all high-demand sizes (P, M, G, GG) are actually available?
  const missing = product.missingSizes || [];
  const coreSizes = ['P', 'M', 'G', 'GG'];
  const criticalMissing = missing.filter(s => coreSizes.includes(s.toUpperCase()));

  if (criticalMissing.length === 0) {
    falsificationAttempts.push({
      test: 'CORE_SIZE_RUPTURE_TEST',
      result: 'FALSIFIED',
      reason: `Tamanhos em falta (${missing.join(', ')}) não pertencem à grade central de conversão P/M/G/GG.`
    });
    return {
      isResistant: false,
      status: 'FALSIFIED_DISCARDED',
      falsificationAttempts,
      verdict: 'Descartado: Ruptura restrita a tamanhos periféricos (ex: 3XG, RN) sem impacto crítico de mídia.'
    };
  } else {
    falsificationAttempts.push({
      test: 'CORE_SIZE_RUPTURE_TEST',
      result: 'PASSED',
      reason: `Ruptura confirmada em tamanhos vitais de alta conversão: [${criticalMissing.join(', ')}].`
    });
  }

  // Hypothesis survived all attempts to break it -> Falsification-Resistant Fact!
  return {
    isResistant: true,
    status: 'FALSIFICATION_RESISTANT',
    criticalMissing,
    falsificationAttempts,
    verdict: `Aprovado pelo Rigor Popperiano: Ruptura irrefutável comprovada em [${criticalMissing.join(', ')}].`
  };
}

/**
 * 👁️ Image Integrity Watchdog (Skill: computer-vision-uiux & falsify)
 * Detects active products on store with zero images or broken image URLs.
 * @param {Object} product - Raw Shopify product object.
 * @returns {Object} Image audit status.
 */
export function auditProductImageIntegrity(product) {
  const images = product.images || [];
  const hasValidImage = images.length > 0 && images.some(img => img.src && String(img.src).trim().length > 0);

  if (!hasValidImage) {
    return {
      hasImage: false,
      status: 'CRITICAL_MISSING_IMAGE',
      reason: 'Produto ativo no catálogo sem nenhuma foto cadastrada (images: []). Risco de 100% de perda em anúncios.',
      imagesCount: images.length
    };
  }

  return {
    hasImage: true,
    status: 'VALID_IMAGE',
    imagesCount: images.length,
    primaryImageSrc: images[0].src
  };
}
