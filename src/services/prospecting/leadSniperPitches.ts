// ==============================================================================
// 🎯 LEAD SNIPER PITCH GENERATOR & WHATSAPP SCRIPTS
// Standalone module to avoid circular dependencies between leadSniperEngine
// and pilotProspectsCatalog during bundle initialization.
// ==============================================================================

import { resolveDynamicVertical } from '../ai/dynamicVerticalContext';

export interface BrokenSkuPitchInput {
  productTitle: string;
  productUrl: string;
  price: number;
  missingSizes: string[];
  explanation: string;
  imageSrc?: string;
  [key: string]: any;
}

/**
 * Gera a URL canônica para inspecionar criativos ao vivo na Meta Ads Library (Facebook Ad Library).
 */
export function generateMetaAdsLibraryUrl(brandName: string): string {
  const query = encodeURIComponent((brandName || '').trim());
  return `https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=BR&q=${query}&search_type=keyword_unordered&media_type=all`;
}

/**
 * Constrói a URL oficial de Click-to-Chat da WhatsApp API.
 */
export function buildWhatsAppClickToChatUrl(phone: string, message: string): string {
  const cleanPhone = (phone || '').replace(/\D/g, '');
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(message)}`;
}

/**
 * Monta os pitches irresistíveis em 3 passos com base nas diretrizes da skill growth-outbound-closer.
 */
export function generateWhatsAppPitches(
  brandName: string,
  primarySku: BrokenSkuPitchInput,
  totalWasteMonthly: number,
  storeUrl: string
): { directFounder: string; technicalMediaBuyer: string; audioScript45s: string } {
  const missingText = (primarySku?.missingSizes && primarySku.missingSizes.length > 0)
    ? primarySku.missingSizes.join(' e ') 
    : 'M e G';

  const formattedWaste = (totalWasteMonthly || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formattedPrice = (primarySku?.price || 159.90).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const sUrl = storeUrl || '';

  // 🛡️ Grounding Guard: Se não houver sangria comprovada ou grade íntegra, NUNCA gerar pitch com "R$ 0,00 de sangria"
  const isHealthyCatalog = (totalWasteMonthly || 0) <= 0 || !primarySku?.missingSizes || primarySku.missingSizes.length === 0;
  if (isHealthyCatalog) {
    const vertical = resolveDynamicVertical(`${primarySku?.productTitle || ''} ${sUrl} ${brandName}`);
    const directFounder = `Fala, tudo bem? 👊 Passamos nosso scanner de auditoria na vitrine da *${brandName}* [${vertical.label}]:

Primeiramente, parabéns: o catálogo e a grade dos produtos auditados estão 100% íntegros (zero rupturas centrais identificadas).

Porém, identificamos uma oportunidade imediata de retenção de margem: a loja pode estar deixando entre 2,5% e 4% de receita líquida na mesa por não incentivar o Pix Dinâmico frente às taxas de cartão de crédito no checkout.

Geramos um dossiê executivo com a simulação atuarial dessa recuperação para o seu nicho. Posso te enviar o link confidencial aqui no WhatsApp? É só responder *"QUERO"*.`;

    const technicalMediaBuyer = `Opa, tudo bem? Mensagem rápida para o time de tráfego/growth da *${brandName}* 🎯

Auditamos os criativos e a vitrine de vocês: a sincronia de catálogo está excelente (zero rupturas críticas identificadas nos principais anúncios). 
Notamos, contudo, oportunidades no checkout e retenção de margem líquida via Pix Dinâmico no segmento [${vertical.label}].
Tenho o laudo técnico com esse estudo de caso. Posso te encaminhar aqui?`;

    const audioScript45s = `Fala pessoal da ${brandName}, tudo certo? Passei nosso scanner de performance na loja de vocês e queria parabenizar a equipe: a grade de produtos anunciados tá muito bem gerenciada, sem rupturas nos tamanhos centrais. O motivo do meu contato é uma alavanca de margem no checkout: a operação pode reter bastante lucro trocando taxas de cartão por Pix com desconto calibrado. No benchmark do segmento de vocês, isso gera um ganho relevante. Se quiserem que eu envie o estudo rápido, me dá um toque aqui!`;

    return { directFounder, technicalMediaBuyer, audioScript45s };
  }

  // 1. Gancho Direto para o Dono/Fundador (Baseado em 4 Arquétipos Reais com Sangria Comprovada)
  let directFounder = '';
  const explanation = primarySku?.explanation || '';
  const isSchemaIssue = sUrl.includes('7mboots') || explanation.includes('Schema') || explanation.includes('Nuvemshop');
  const isTraySitemapIssue = sUrl.includes('texascenter') || explanation.includes('Tray') || explanation.includes('sitemap');
  const isGhostInventoryIssue = (primarySku?.missingSizes || []).some(s => s.includes('ESTOQUE_FANTASMA')) || explanation.includes('Yellowstone');

  if (isSchemaIssue) {
    directFounder = `Fala, tudo bem? 👊 Passamos nosso scanner de auditoria técnica na vitrine da *${brandName}* e identificamos uma falha crítica de tráfego:

A *"${primarySku.productTitle}"* (R$ ${formattedPrice}) está sendo vendida na loja (${primarySku.productUrl}), mas o código Schema.org da Nuvemshop declara *"OutOfStock"* para o Google. Isso faz o Google Merchant Center reprovar ou derrubar a entrega dos anúncios de vocês no Google Shopping.

Além disso, notamos que o CNPJ de vocês não está visível no rodapé, o que gera bloqueios de conformidade pelo Decreto Federal nº 7.962/2013 e suspensão de contas no Meta Ads.

Montamos um relatório técnico de 2 páginas com as correções imediatas. Posso te enviar aqui pelo WhatsApp? É só responder *"QUERO"*.`;
  } else if (isTraySitemapIssue) {
    directFounder = `Fala, tudo bem? 👊 Passamos nosso scanner na vitrine da *${brandName}* (via Tray) e cruzamos com as campanhas de Google Shopping:

Identificamos que produtos de altíssimo valor como o *"${primarySku.productTitle}"* (R$ ${formattedPrice}) estão com estoque 100% zerado no site (${primarySku.productUrl}), mas continuam indexados no sitemap consumindo lances automáticos de campanhas Performance Max.

Estimamos uma sangria de ~*R$ ${formattedWaste}/mês* em cliques que batem em páginas sem botão de compra disponível.

Quer que eu te envie a lista completa dos produtos esgotados para o seu gestor de tráfego pausar no Google Shopping? Responda *"QUERO"*.`;
  } else if (isGhostInventoryIssue) {
    directFounder = `Fala, tudo bem? 👊 Identificamos um vazamento grave de verba de tráfego na *${brandName}*:

Vocês estão rodando anúncios ativos no Meta Ads para o produto *"${primarySku.productTitle}"* (R$ ${formattedPrice}), mas ele está com ruptura física no galpão (Estoque Fantasma / Backorder sem pronta entrega).

O anúncio promete envio rápido, o cliente clica, mas o pedido atrasa gerando cancelamentos e risco de bloqueio no Facebook por baixa pontuação de feedback do cliente (Customer Feedback Score).

Mapeamos os criativos ativos e os SKUs afetados. Quer que eu te envie o link aqui pelo WhatsApp? É só responder *"QUERO"*.`;
  } else {
    const vertical = resolveDynamicVertical(`${primarySku?.productTitle || ''} ${sUrl} ${brandName}`);
    let verticalContextHook = `Como ${missingText} respondem por cerca de 65% das compras de vestuário no Brasil, a cada R$ 1.000 investidos nessa campanha, cerca de R$ 650 viram cliques perdidos de clientes que chegam e desistem`;

    if (vertical.verticalId === 'CALCADOS_COURO') {
      verticalContextHook = `Como as numerações ${missingText} respondem por cerca de 70% das compras masculinas de calçados no Brasil, a cada R$ 1.000 investidos na campanha do calçado, ~R$ 700 são queimados com clientes que não encontram seu calce exato`;
    } else if (vertical.verticalId === 'AGRO_CAMPO_OUTDOOR') {
      verticalContextHook = `No segmento agro e moda campo, os tamanhos ${missingText} concentram mais de 75% da procura dos clientes. O comprador clica no anúncio mas encontra a porteira fechada pela grade furada`;
    } else if (vertical.verticalId === 'STREETWEAR_MODA_URBANA') {
      verticalContextHook = `No streetwear e tech apparel, ${missingText} concentram mais de 69% da demanda dos drops. O cliente busca a peça no corte ideal, vê indisponível e migra para a concorrência`;
    } else if (vertical.verticalId === 'FITNESS_BEACHWEAR') {
      verticalContextHook = `No público fitness e activewear, os tamanhos ${missingText} concentram mais de 72% da demanda feminina. Sem esse tamanho disponível, a perda de conversão no primeiro scroll é imediata`;
    }

    directFounder = `Fala, tudo bem? 👊 Passamos nosso scanner de auditoria na vitrine da *${brandName}* e cruzamos com a biblioteca de anúncios de vocês no Meta Ads:

Vocês estão rodando tráfego pago ativo para o produto *"${primarySku.productTitle}"* (R$ ${formattedPrice}) no nicho [${vertical.label}], mas os tamanhos *${missingText}* estão esgotados no checkout do site (${primarySku.productUrl}).

${verticalContextHook} (estimamos uma sangria de ~*R$ ${formattedWaste}/mês* baseada no CPC setorial do seu nicho).

Montamos um dossiê confidencial de 1 página mostrando o flagrante com links da Meta Ads Library e a simulação de impacto financeiro baseada na verba real de vocês.

Quer que eu te envie o link aqui pelo WhatsApp? É só responder *"QUERO"*.`;
  }

  // 2. Abordagem Técnica para Gestor de Tráfego / Media Buyer / Agência
  const technicalMediaBuyer = `Opa, tudo bem? Mensagem rápida para o gestor de tráfego da *${brandName}* 🎯

Fizemos uma varredura de sincronia entre criativos e estoque: identificamos que a campanha promovendo a *"${primarySku.productTitle}"* continua consumindo orçamento no Meta Ads, porém as variantes mais vendidas (*${missingText}*) estão zeradas no estoque (${primarySku.productUrl}).

Isso está inflando artificialmente o CPA do conjunto de anúncios e derrubando o ROAS consolidado da conta no segmento [${resolveDynamicVertical(sUrl).label}].

Tenho o relatório técnico com os SKUs e a taxa de fuga para você negativar o produto ou pausar o ad set em 1 minuto. Posso te mandar o resumo aqui?`;

  // 3. Roteiro para Gravação de Áudio no WhatsApp (45 segundos)
  const audioScript45s = `Fala pessoal da ${brandName}, tudo certo? Tô passando rápido aqui porque vi que vocês estão com anúncio rodando forte para ${primarySku.productTitle}. Só que quando o cliente clica para comprar no site, os tamanhos ${missingText} estão esgotados. Como esse é o miolo da grade que mais vende, vocês estão pagando por clique de gente que quer comprar mas não consegue. Eu gerei um dossiê mostrando a estimativa dessa perda — no benchmark do segmento isso pode passar de R$ ${formattedWaste} no mês. Se fizer sentido dar uma olhada pra pausar o criativo ou repor a grade, me dá um toque que eu te mando o link!`;

  return {
    directFounder,
    technicalMediaBuyer,
    audioScript45s
  };
}
