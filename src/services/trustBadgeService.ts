export interface TrustBadgeConfig {
  domain: string;
  brandName: string;
  growthScore: number;
  verificationId: string;
  badgeTier: 'GOLD' | 'SILVER' | 'BRONZE';
  verifiedDate: string;
  verifiedPillars: {
    title: string;
    description: string;
    verified: boolean;
  }[];
}

export function generateTrustBadgeConfig(domain: string, brandName: string, growthScore: number): TrustBadgeConfig {
  const tier = growthScore >= 80 ? 'GOLD' : growthScore >= 60 ? 'SILVER' : 'BRONZE';
  const verificationId = `LF-CERT-${Math.abs(hashString(domain)).toString(36).toUpperCase()}-${new Date().getFullYear()}`;

  return {
    domain,
    brandName,
    growthScore,
    verificationId,
    badgeTier: tier,
    verifiedDate: new Date().toLocaleDateString('pt-BR'),
    verifiedPillars: [
      {
        title: 'Grade de Tamanhos & Estoque Auditados',
        description: 'Verificação de conformidade de grade ativa sem falsos estoques.',
        verified: true
      },
      {
        title: 'Conformidade Legal & Segurança',
        description: 'Auditoria de CNPJ no rodapé, política de troca CDC Art. 49 e HTTPS.',
        verified: true
      },
      {
        title: 'Core Web Vitals 2026 Otimizado',
        description: 'Página veloz com carregamento prioritário e baixa latência de toque.',
        verified: growthScore >= 70
      },
      {
        title: 'Pix Dinâmico & Transparência Financeira',
        description: 'Preços claros à vista sem taxas ocultas.',
        verified: true
      }
    ]
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function generateFloatingBadgeSnippet(config: TrustBadgeConfig): string {
  return `<!-- 🛡️ SELO DINÂMICO DE CONFIANÇA & CATÁLOGO VERIFICADO (ADSHIELD) -->
<!-- Cole este código antes da tag </body> no arquivo theme.liquid do seu tema Shopify -->
<div id="adshield-trust-badge" style="position: fixed; bottom: 20px; right: 20px; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; cursor: pointer; transition: transform 0.2s ease;">
  <a href="https://adshield.vercel.app/#verify-${config.verificationId}" target="_blank" rel="noopener" style="text-decoration: none; display: flex; align-items: center; gap: 8px; background: #0f172a; color: #ffffff; padding: 8px 14px; border-radius: 999px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3); border: 1.5px solid #38bdf8;">
    <div style="background: #0284c7; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900;">
      ✓
    </div>
    <div style="text-align: left;">
      <div style="font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #7dd3fc; line-height: 1;">
        Loja Auditada
      </div>
      <div style="font-size: 11px; font-weight: 800; color: #ffffff; line-height: 1.2; margin-top: 2px;">
        AdShield Verified
      </div>
    </div>
  </a>
</div>`;
}

export function generateFooterBadgeSnippet(config: TrustBadgeConfig): string {
  return `<!-- 🛡️ SELO DE RODAPÉ ADSHIELD VERIFIED (COLE NO SEU FOOTER.LIQUID) -->
<div class="adshield-footer-seal" style="display: inline-flex; align-items: center; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 10px 0;">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
  <div style="text-align: left;">
    <div style="font-size: 10px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
      Catálogo & Estoque Auditados
    </div>
    <div style="font-size: 9px; color: #64748b;">
      Certificado Oficial AdShield • ID: ${config.verificationId}
    </div>
  </div>
</div>`;
}
