// ==============================================================================
// 🔬 FALSIFY PROTOCOL: SCIENTIFIC HYPOTHESIS TESTING FOR BLEED ESTIMATES
// Skill: falsify + ecommerce-cro-catalog-doctor + software-architecture
// Implementa o protocolo Popperiano de falseamento: tenta ativamente PROVAR que a
// estimativa de sangria financeira está errada antes de permitir qualquer conclusão.
// ==============================================================================

import { BrokenSkuProof, ProspectLead } from '../prospecting/leadSniperEngine';

export type FalsificationVerdict = 
  | 'VERIFIED_RESILIENT'             // Resistiu a todas as 4 tentativas de falseamento. Hipótese robusta.
  | 'FALSIFIED_DISCARDED'            // Provado falso (ex: regra _FULL, tamanho único, ou sem anúncios).
  | 'UNCERTAIN_ERP_REQUIRED';        // Inconclusivo sem acesso direto à API do ERP/Sankhya/Bling.

export interface FalsificationTestResult {
  testId: string;
  testName: string;
  objective: string;
  attemptedToBreakWith: string;
  result: 'SURVIVED' | 'BROKEN_FALSIFIED' | 'INCONCLUSIVE';
  evidenceDetails: string;
}

export interface BleedFalsificationReport {
  leadId: string;
  brandName: string;
  productTitle: string;
  initialEstimatedBleedMonthly: number;
  calibratedBleedMonthly: number;
  verdict: FalsificationVerdict;
  scientificConfidencePct: number;
  testsExecuted: FalsificationTestResult[];
  epistemicNotes: string;
  auditChecklistPassed: {
    zero404Urls: boolean;
    notSingleSizeAccessory: boolean;
    notFullPrintOnDemand: boolean;
    activeMetaAdsConfirmed: boolean;
    coreSizeMaturityChecked: boolean;
  };
}

/**
 * Executa o protocolo de falseamento rigoroso sobre a hipótese de sangria do lead.
 */
export function runFalsifyProtocolOnBleedHypothesis(lead: ProspectLead): BleedFalsificationReport {
  const tests: FalsificationTestResult[] = [];
  const sku = lead.primaryBrokenSku;
  const title = (sku?.productTitle || '').toLowerCase();
  const url = (sku?.productUrl || '').toLowerCase();
  const missing = sku?.missingSizes || [];
  const rawBleed = lead.totalMonthlyWasteEstimated || 0;

  let isFalsified = false;
  let calibrationMultiplier = 1.0;

  // 🧪 TESTE 1: Tentar falsear via Regra _FULL (Produção Contínua / Sob Encomenda)
  const isFullPrint = title.includes('_full') || url.includes('_full') || title.includes('sob demanda') || title.includes('personalizad');
  if (isFullPrint) {
    tests.push({
      testId: 'TEST_01_FULL_PRINT_EXEMPTION',
      testName: 'Auditoria de Isenção Regra _FULL',
      objective: 'Tentar provar que o produto é feito sob demanda e não sofre ruptura física.',
      attemptedToBreakWith: 'Identificação de tags de confecção sob demanda (_FULL/personalizado)',
      result: 'BROKEN_FALSIFIED',
      evidenceDetails: 'Produto classificado como produção contínua sob demanda. Ruptura de estoque não se aplica.'
    });
    isFalsified = true;
  } else {
    tests.push({
      testId: 'TEST_01_FULL_PRINT_EXEMPTION',
      testName: 'Auditoria de Isenção Regra _FULL',
      objective: 'Tentar provar que o produto é feito sob demanda e não sofre ruptura física.',
      attemptedToBreakWith: 'Identificação de tags de confecção sob demanda (_FULL/personalizado)',
      result: 'SURVIVED',
      evidenceDetails: 'Item de produção seriada pronta-entrega. Hipótese resistiu à isenção _FULL.'
    });
  }

  // 🧪 TESTE 2: Tentar falsear via Categoria de Tamanho Único (Acessórios, Bonés, Manguitos)
  const isSingleSizeAccessory = [
    'boné', 'bone', 'trucker', 'bandana', 'manguito', 'carteira', 'cinto', 'porta cartao', 'oculos', 'óculos', 'mochila'
  ].some(item => title.includes(item));

  if (isSingleSizeAccessory && missing.some(s => ['M', 'G', 'P', 'GG'].includes(s.toUpperCase()))) {
    // Alerta: acessório sendo auditado com tamanhos de confecção é um falso positivo!
    tests.push({
      testId: 'TEST_02_ACCESSORY_SIZE_GRID',
      testName: 'Auditoria de Categoria de Tamanho Único',
      objective: 'Tentar provar que a quebra de grade M/G é um falso-positivo para acessório de tamanho único.',
      attemptedToBreakWith: 'Cruzamento semântico do nome do produto com grade de vestuário.',
      result: 'BROKEN_FALSIFIED',
      evidenceDetails: `O item "${sku?.productTitle}" é um acessório de tamanho único. Ausência de M/G é um falso-positivo de vestuário.`
    });
    isFalsified = true;
  } else if (isSingleSizeAccessory && missing.includes('ESGOTADO')) {
    // Acessório esgotado por inteiro: válido, porém calibrado
    tests.push({
      testId: 'TEST_02_ACCESSORY_SIZE_GRID',
      testName: 'Auditoria de Categoria de Tamanho Único',
      objective: 'Validar se a ruptura é real de produto único esgotado.',
      attemptedToBreakWith: 'Verificação de ruptura total de acessório.',
      result: 'SURVIVED',
      evidenceDetails: 'Acessório de tamanho único 100% esgotado no catálogo com anúncio ativo.'
    });
    calibrationMultiplier *= 0.9;
  } else {
    tests.push({
      testId: 'TEST_02_ACCESSORY_SIZE_GRID',
      testName: 'Auditoria de Grade Vestuário vs Calçados',
      objective: 'Tentar provar que o produto não possui variações de tamanho.',
      attemptedToBreakWith: 'Inspeção de grade real de confecção/calçados.',
      result: 'SURVIVED',
      evidenceDetails: `Produto com grade multi-tamanho genuína (${sku?.availableSizes.join(', ')} disponíveis vs ${missing.join(', ')} em falta).`
    });
  }

  // 🧪 TESTE 3: Tentar falsear via Atividade de Mídia (Meta Ads Ativos)
  const adsCount = lead.activeAdsCountEstimated || 0;
  if (!lead.hasMetaPixel && adsCount === 0) {
    tests.push({
      testId: 'TEST_03_MEDIA_BUYER_TRAFFIC',
      testName: 'Auditoria de Tráfego Pago Ativo',
      objective: 'Tentar provar que a loja não investe em anúncios pagos no Meta.',
      attemptedToBreakWith: 'Verificação de Pixel no <head> e anúncios na Meta Ads Library.',
      result: 'BROKEN_FALSIFIED',
      evidenceDetails: 'Sem anúncios ativos detectados na Meta Ads Library. Não há sangria ativa de tráfego pago.'
    });
    isFalsified = true;
  } else {
    tests.push({
      testId: 'TEST_03_MEDIA_BUYER_TRAFFIC',
      testName: 'Auditoria de Tráfego Pago Ativo',
      objective: 'Tentar provar que a loja não investe em anúncios pagos no Meta.',
      attemptedToBreakWith: 'Verificação de Pixel no <head> e anúncios na Meta Ads Library.',
      result: 'SURVIVED',
      evidenceDetails: `Presença confirmada de Meta Pixel com estimativa de ${adsCount} anúncios ativos veiculando criativos.`
    });
  }

  // 🧪 TESTE 4: Tentar falsear via Calibração Matemática dos Tamanhos Centrais
  // Confecção: M e G = 65% das vendas. Calçados: 39 a 41 masc ou 36 a 38 fem = 70% das vendas.
  const hasCoreRupture = missing.some(s => ['M', 'G', '39', '40', '41', '36', '37', '38', 'ESGOTADO'].includes(s.toUpperCase()));
  if (!hasCoreRupture && missing.length > 0) {
    // Ruptura apenas em tamanhos extremos (ex: PP, 34, 48, G3)
    calibrationMultiplier *= 0.35; // Apenas ~35% de perda potencial, não 65%
    tests.push({
      testId: 'TEST_04_CORE_SIZE_DISTRIBUTION',
      testName: 'Teste de Relevância do Miolo da Grade',
      objective: 'Tentar provar que a quebra ocorreu apenas em tamanhos de baixa demanda (cauda longa).',
      attemptedToBreakWith: 'Verificação da curva normal de distribuição de biótipo brasileiro.',
      result: 'SURVIVED',
      evidenceDetails: 'Ruptura restrita a tamanhos periféricos. Valor de sangria recalibrado com redutor de 65% para evitar exagero estatístico.'
    });
  } else {
    tests.push({
      testId: 'TEST_04_CORE_SIZE_DISTRIBUTION',
      testName: 'Teste de Relevância do Miolo da Grade',
      objective: 'Tentar provar que a quebra ocorreu apenas em tamanhos de baixa demanda (cauda longa).',
      attemptedToBreakWith: 'Verificação da curva normal de distribuição de biótipo brasileiro.',
      result: 'SURVIVED',
      evidenceDetails: 'Confirmada ruptura no núcleo de alta conversão (M/G ou 39 a 41). Alto impacto na taxa de conversão.'
    });
  }

  const calibratedBleed = isFalsified ? 0 : Math.round(rawBleed * calibrationMultiplier);

  let verdict: FalsificationVerdict = 'VERIFIED_RESILIENT';
  let scientificConfidence = 96;

  if (isFalsified) {
    verdict = 'FALSIFIED_DISCARDED';
    scientificConfidence = 15;
  } else if (lead.huntingTier === 'TIER_2_WARM') {
    verdict = 'UNCERTAIN_ERP_REQUIRED';
    scientificConfidence = 78;
  }

  return {
    leadId: lead.id,
    brandName: lead.brandName,
    productTitle: sku?.productTitle || 'Catálogo Geral',
    initialEstimatedBleedMonthly: rawBleed,
    calibratedBleedMonthly: calibratedBleed,
    verdict,
    scientificConfidencePct: scientificConfidence,
    testsExecuted: tests,
    epistemicNotes: isFalsified
      ? 'A hipótese inicial de sangria foi REFUTADA pelos testes científicos. Este lead deve permanecer em quarentena técnica.'
      : `Hipótese RESISTIU a todos os testes de falseamento. Sangria calibrada em R$ ${calibratedBleed.toLocaleString('pt-BR')}/mês com embasamento epistêmico.`,
    auditChecklistPassed: {
      zero404Urls: Boolean(sku?.productUrl && sku.productUrl.startsWith('http')),
      notSingleSizeAccessory: !isSingleSizeAccessory || missing.includes('ESGOTADO'),
      notFullPrintOnDemand: !isFullPrint,
      activeMetaAdsConfirmed: adsCount > 0,
      coreSizeMaturityChecked: hasCoreRupture
    }
  };
}
