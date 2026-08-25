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
