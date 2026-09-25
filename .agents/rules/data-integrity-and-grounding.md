---
description: Strict data integrity and grounding rules. Prohibits hallucination or presenting simulated data as live private analytics.
trigger: always_on
---

# 🛡️ Data Grounding & Transparency Rule

## Mandates:
1. **Never Invent Live Data:** Product URLs, SKUs, available sizes, image weights, and detected tags MUST come from the actual live website DOM or public API response.
2. **Explicit Labeling for Simulations:** Any projected financial metrics, ROAS multipliers, or funnel splits MUST be explicitly identified as `[Simulação / Benchmark]` and allow user customization.
3. **Transparent Boundaries:** When a metric requires private access (e.g. historical Shopify cart abandonments or private ad account spend), clearly state that it requires direct Shopify/Clarity integration rather than fabricating numbers.
4. **Theme Addon Awareness:** Always check for theme-level widgets (such as `<product-addons data-custom-class="size_chart">`) before flagging features as missing.
5. **Anti-Ghost Inventory & Backorder Protection (The "Yellowstone Dutton Ranch" Principle):**
   - NEVER assume that a button displaying "Adicionar à Sacola" or a Shopify variant returning `available: true` guarantees physical warehouse availability.
   - E-commerce stores routinely enable `inventory_policy: continue` (backorder / overselling) or disable stock tracking to prevent front-end purchase blocking, while the physical unit in the warehouse is 100% depleted.
   - When an ad campaign is active on Meta/Google Ads, auditing must evaluate: (a) actual physical inventory via Admin/ERP integration, (b) fulfillment promise ("Envio Imediato" vs actual lead time), (c) ad creative fidelity (matching the exact model promoted in the ad vs what is being delivered), and (d) checkout level stock reservations.
6. **Visual Grounding & Anti-Google Places Protocol:**
   - NEVER use Google Places / Google Maps physical facade photos or outdated store exterior photos to represent digital e-commerce products.
   - Product imagery MUST match the audited SKU semantically (sunglasses must show sunglasses, boots must show boots, never default to generic red sneakers).
   - All product links MUST be verified live (HTTP 200 OK, zero 404s).
   - Use `ProductImageWithFallback` to ensure robust category-based vector fallback without layout shifts if external CDNs block hotlinking.


