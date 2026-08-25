---
name: ecommerce-cro-catalog-doctor
description: >-
  E-commerce conversion rate optimization, size grid auditing (PP to G2), _FULL exemption rules,
  and product catalog integrity verification.
---

# 🛒 E-Commerce CRO & Catalog Doctor Skill

## 1. Catalog & Size Grid Audit Rules
- **Standard Size Grid (`PP, P, M, G, GG, G1, G2`):** Line apparel products must maintain stock availability across all standard sizes. Missing sizes must be flagged as "Grade Furada".
- **Special `_FULL` Exemption Rule:** Products containing `_FULL` in SKU or title (full-print or special cut models) are exempted from the standard grid requirement.
- **Resale & One-Size Accessories Rule (Bandanas, Manguitos, Bonés, etc.):** Resale items, one-size accessories (Bandana Tubo, Manguito com Proteção UV, Bonés, Meias, Chaveiros) do not use multi-size apparel grids and must be classified as "Acessório / Revenda (Tamanho Único)" with zero broken-grid penalization.
- **Image & Content Validation:** Verify product photography resolution (> 600px), background purity (white studio background for the 1st photo), and presence of Size Measurement Guides (Tabela de Medidas).
- **Direct Live Links:** Always extract the authentic live product URL from the store's `/products.json` or DOM `<a>` tags. Never invent fake slugs.

## 2. Friction-Free Checkout Optimization
- Ensure Pix discount banner (5% to 10% OFF) is visible before the fold.
- Validate Fitts's Law on mobile touch targets (minimum 48x48px for size pickers and CTA buttons).
- Recommend Sticky Buy Buttons for long product descriptions.
