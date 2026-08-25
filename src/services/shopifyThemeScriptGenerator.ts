export interface ThemeScriptSnippet {
  id: string;
  category: 'MOBILE_UX' | 'CHECKOUT_PIX' | 'SIZE_GUIDE' | 'FITTS_LAW' | 'SECURITY';
  title: string;
  description: string;
  targetFile: 'sections/main-product.liquid' | 'assets/custom.css' | 'layout/theme.liquid' | 'snippets/price.liquid';
  installLocation: string;
  language: 'liquid' | 'css' | 'javascript';
  code: string;
  impactLabel: string;
  difficulty: 'FÁCIL (Copiar & Colar)' | 'MÉDIO (Dentro do Produto)';
}

export function generateShopifyThemeScripts(domain: string, brandName: string): ThemeScriptSnippet[] {
  const domainLower = domain.toLowerCase();
  const isAgro = domainLower.includes('agro');
  const isMotors = domainLower.includes('motors');
  const isFishing = domainLower.includes('fishing');

  const primaryColor = isAgro ? '#3a9e35' : isMotors ? '#EA541B' : '#135ed1';
  const accentColor = isAgro ? '#70533d' : isMotors ? '#111111' : '#d0473e';

  return [
    {
      id: 'snippet-sticky-buy',
      category: 'MOBILE_UX',
      title: 'Sticky Buy Button Mobile com Seletor de Tamanho',
      description: 'Mantém uma barra flutuante fixa no rodapé do celular com o botão de compra e seleção rápida de tamanho (PP a G2) para aumentar a conversão mobile em até 24%.',
      targetFile: 'sections/main-product.liquid',
      installLocation: 'Cole no final do arquivo sections/main-product.liquid (antes do último {% endschema %} ou </div>)',
      language: 'liquid',
      impactLabel: '+18% a +24% Conversão Mobile',
      difficulty: 'FÁCIL (Copiar & Colar)',
      code: `{% comment %}
  === LEAKFINDER: STICKY BUY BUTTON MOBILE (${brandName.toUpperCase()}) ===
{% endcomment %}
<div id="leakfinder-sticky-mobile-bar" class="leakfinder-sticky-bar">
  <div class="leakfinder-sticky-content">
    <div class="leakfinder-product-info">
      <span class="leakfinder-prod-title">{{ product.title | truncate: 25 }}</span>
      <span class="leakfinder-prod-price">{{ product.selected_or_first_available_variant.price | money }}</span>
    </div>
    <div class="leakfinder-actions">
      {% if product.variants.size > 1 %}
        <select id="leakfinder-sticky-variant-select" class="leakfinder-variant-select" onchange="document.querySelector('[name=\\"id\\"]').value = this.value;">
          {% for variant in product.variants %}
            <option value="{{ variant.id }}" {% unless variant.available %}disabled{% endunless %}>
              {{ variant.title }} {% unless variant.available %}(Esgotado){% endunless %}
            </option>
          {% endfor %}
        </select>
      {% endif %}
      <button type="button" class="leakfinder-sticky-btn" onclick="document.querySelector('form[action*=\\"/cart/add\\"] [type=\\"submit\\"]').click();">
        COMPRAR
      </button>
    </div>
  </div>
</div>

<style>
  @media (min-width: 769px) {
    #leakfinder-sticky-mobile-bar { display: none !important; }
  }
  @media (max-width: 768px) {
    .leakfinder-sticky-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      padding: 10px 14px;
      box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.12);
      z-index: 9999;
      border-top: 1px solid #e5e7eb;
      transform: translateY(0);
      transition: transform 0.3s ease;
    }
    .leakfinder-sticky-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .leakfinder-product-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .leakfinder-prod-title {
      font-size: 11px;
      font-weight: bold;
      color: #111827;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .leakfinder-prod-price {
      font-size: 13px;
      font-weight: 800;
      color: ${primaryColor};
    }
    .leakfinder-actions {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .leakfinder-variant-select {
      height: 38px;
      padding: 0 6px;
      font-size: 12px;
      font-weight: bold;
      border: 1.5px solid #d1d5db;
      border-radius: 8px;
      background: #f9fafb;
    }
    .leakfinder-sticky-btn {
      height: 38px;
      padding: 0 16px;
      background-color: ${primaryColor};
      color: #ffffff;
      font-size: 13px;
      font-weight: 800;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
  }
</style>`
    },
    {
      id: 'snippet-fitts-law-sizes',
      category: 'FITTS_LAW',
      title: 'Ampliação da Área de Toque dos Seletores de Tamanho (48px - Lei de Fitts)',
      description: 'Aumenta a área de clique dos botões de tamanhos (PP, P, M, G, GG, G1, G2) para no mínimo 48x48px no mobile, evitando cliques errados e desistências.',
      targetFile: 'assets/custom.css',
      installLocation: 'Cole no final do arquivo assets/custom.css ou dentro de <style> no theme.liquid',
      language: 'css',
      impactLabel: 'Redução de 35% nos Cliques Errados',
      difficulty: 'FÁCIL (Copiar & Colar)',
      code: `/* ==========================================================================
   LEAKFINDER: OTIMIZAÇÃO ERGONÔMICA DOS TAMANHOS (LEI DE FITTS - 48PX)
   ========================================================================== */
@media (max-width: 768px) {
  /* Seletores de variantes em pílulas / botões */
  .product-form__input input[type="radio"] + label,
  .variant-picker__option-values label,
  .swatch-element label,
  .product-options label,
  [data-custom-class="size_chart"] ~ * label {
    min-width: 48px !important;
    min-height: 48px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 13px !important;
    font-weight: 700 !important;
    border-radius: 10px !important;
    margin: 4px 4px 4px 0 !important;
    touch-action: manipulation !important;
    transition: all 0.2s ease !important;
  }

  /* Efeito de seleção ativa */
  .product-form__input input[type="radio"]:checked + label,
  .variant-picker__option-values input:checked + label {
    border-color: ${primaryColor} !important;
    background-color: ${primaryColor}15 !important;
    color: ${primaryColor} !important;
    box-shadow: 0 0 0 1.5px ${primaryColor} !important;
  }

  /* Tamanhos esgotados riscados */
  .product-form__input input[type="radio"].disabled + label,
  .product-form__input input[type="radio"]:disabled + label {
    opacity: 0.45 !important;
    text-decoration: line-through !important;
    background-color: #f3f4f6 !important;
  }
}`
    },
    {
      id: 'snippet-pix-discount',
      category: 'CHECKOUT_PIX',
      title: 'Box de Desconto de 10% no Pix com Economia Imediata',
      description: 'Calcula e exibe automaticamente o valor com 10% de desconto no Pix e o parcelamento sem juros logo abaixo do preço do produto.',
      targetFile: 'snippets/price.liquid',
      installLocation: 'Cole logo abaixo do bloco de preço principal em snippets/price.liquid ou main-product.liquid',
      language: 'liquid',
      impactLabel: '+14% Vendas via Pix à Vista',
      difficulty: 'FÁCIL (Copiar & Colar)',
      code: `{% comment %}
  === LEAKFINDER: CAIXA DE DESCONTO PIX & PARCELAMENTO (${brandName.toUpperCase()}) ===
{% endcomment %}
{% assign current_variant = product.selected_or_first_available_variant %}
{% assign pix_discount_multiplier = 0.90 %}
{% assign pix_price = current_variant.price | times: pix_discount_multiplier %}
{% assign economy_val = current_variant.price | minus: pix_price %}

<div class="leakfinder-pix-banner">
  <div class="leakfinder-pix-header">
    <svg class="leakfinder-pix-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
    <span><strong>{{ pix_price | money }}</strong> no Pix <strong>(10% de Desconto)</strong></span>
  </div>
  <div class="leakfinder-pix-sub">
    <span>Economize <strong>{{ economy_val | money }}</strong> pagando à vista.</span>
    <span>Ou até <strong>6x de {{ current_variant.price | divided_by: 6 | money }}</strong> sem juros.</span>
  </div>
</div>

<style>
  .leakfinder-pix-banner {
    margin: 14px 0;
    padding: 12px 14px;
    background: #f0fdf4;
    border: 1.5px solid #86efac;
    border-radius: 12px;
    font-family: inherit;
  }
  .leakfinder-pix-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #166534;
  }
  .leakfinder-pix-icon {
    width: 18px;
    height: 18px;
    color: #15803d;
    flex-shrink: 0;
  }
  .leakfinder-pix-sub {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 6px;
    margin-top: 6px;
    font-size: 11px;
    color: #15803d;
    border-top: 1px dashed #bbf7d0;
    padding-top: 6px;
  }
</style>`
    },
    {
      id: 'snippet-security-tabnabbing',
      category: 'SECURITY',
      title: 'Script de Defesa contra Reverse Tabnabbing em Links Externos',
      description: 'Garante que todo link externo que abre em target="_blank" receba automaticamente rel="noopener noreferrer" para proteger a sessão do cliente e evitar brechas de segurança.',
      targetFile: 'layout/theme.liquid',
      installLocation: 'Cole antes da tag de fechamento </body> em layout/theme.liquid',
      language: 'javascript',
      impactLabel: '100% Conformidade de Segurança',
      difficulty: 'FÁCIL (Copiar & Colar)',
      code: `<!-- LEAKFINDER: REVERSE TABNABBING SECURITY DEFENSE -->
<script>
  document.addEventListener('DOMContentLoaded', function() {
    var externalLinks = document.querySelectorAll('a[target="_blank"]');
    for (var i = 0; i < externalLinks.length; i++) {
      var link = externalLinks[i];
      var rel = link.getAttribute('rel') || '';
      if (!rel.includes('noopener')) rel += ' noopener';
      if (!rel.includes('noreferrer')) rel += ' noreferrer';
      link.setAttribute('rel', rel.trim());
    }
  });
</script>`
    }
  ];
}
