// ==============================================================================
// 🔬 POPPERIAN FALSIFIER ENGINE — SKILL: falsify
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
  const singleSizeKeywords = ['boné', 'bone', 'bandana', 'manguito', 'copo', 'chaveiro', 'adesivo', 'unisex', 'tamanho único', 'tam unico'];
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

  // 2. Falsification Test #2: Theme Addon / _FULL Exemption Hypothesis
  // Can we falsify the defect by checking for the _FULL exemption tag?
  if (product.handle && product.handle.toLowerCase().includes('_full')) {
    falsificationAttempts.push({
      test: 'FULL_EXEMPTION_TAG_TEST',
      result: 'FALSIFIED',
      reason: 'Regra _FULL ativada no handle do produto. Hipótese de ruptura refutada.'
    });
    return {
      isResistant: false,
      status: 'FALSIFIED_DISCARDED',
      falsificationAttempts,
      verdict: 'Descartado: Isenção explícita _FULL detectada.'
    };
  } else {
    falsificationAttempts.push({
      test: 'FULL_EXEMPTION_TAG_TEST',
      result: 'PASSED',
      reason: 'Sem flag de isenção de catálogo _FULL.'
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
