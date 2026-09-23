---
description: Anti-Ghost Inventory & Backorder Protection Rule (The Yellowstone Dutton Ranch Principle).
trigger: always_on
---

# 🛡️ PROTOCOLO PERMANENTE ANTI-ESTOQUE FANTASMA & AUDITORIA DE ANÚNCIOS (CASO YELLOWSTONE DUTTON RANCH)

## 📌 Contexto & Lição Aprendida
Durante a auditoria no e-commerce BRK Agro, a inteligência humana sabia que o **Boné Trucker Yellowstone Dutton Ranch** estava esgotado fisicamente mas continuava recebendo tráfego pago.
A auditoria ingênua de scraping automatizado falhou porque:
1. O endpoint público da Shopify retornava `available: true`.
2. O botão no DOM exibia `Adicionar à Sacola` (sem string 'Fora de estoque').
3. O carrinho permitia avançar até o checkout (devido à política `inventory_policy: continue` / backorder / estoque não rastreado no front-end).

Esse erro revelou a maior dor silenciosa do tráfego pago: **O Estoque Fantasma (Ghost Inventory)**, no qual lojistas vendem sem estoque físico no galpão enquanto mantêm anúncios no Meta/Google Ads ativos, gerando atrasos, estornos, quebra de promessa ('Envio Imediato') e queima de verba.

---

## 🏛️ Mandatos Inegociáveis de Auditoria:

1. **PROIBIÇÃO DE VALIDAÇÃO SUPERFICIAL:**
   Nenhum agente do AdShield/LeakFinder pode declarar um produto como 'com estoque garantido' baseando-se unicamente no texto do botão de compra ('Adicionar ao Carrinho') ou no booleano `available: true` do Liquid público.

2. **AS 4 CAMADAS DO PROTOCOLO ANTI-ESTOQUE FANTASMA:**
   - **Camada A (Conexão Admin/ERP):** Auditar `inventory_quantity` físico real via GraphQL Shopify Admin API ou Webhooks de ERPs (Bling, Tiny, Sankhya, SAP). Se `inventory_quantity <= 0`, o produto deve ser classificado como *Ruptura de Estoque / Sob Encomenda*.
   - **Camada B (Fidelidade do Criativo vs Produto Entregue):** Verificar se o modelo exibido no criativo do anúncio (ex: bordado dourado `Y Yellowstone Dutton Ranch Montana` em sarja preta) é idêntico ao modelo que está sendo enviado, e não um produto substituto (ex: modelo denim com crânio longhorn) colocado na página para mascarar o esgotamento do original.
   - **Camada C (Conformidade com Promessa de Envio):** Se a página ou o anúncio promete 'Envio Imediato' ou 'Pronta Entrega', mas o item não possui estoque físico expedível no mesmo dia, o anúncio DEVE ser sinalizado como *Risco Crítico de Chargeback e Infração ao CDC*.
   - **Camada D (Ação Automática AdShield Stock-Pause):** Ao detectar campanha ativa na Meta Ads Library direcionando tráfego para produto com estoque zerado no ERP, o AdShield deve acionar a API de automação da Meta para pausar o conjunto de anúncios imediatamente.
