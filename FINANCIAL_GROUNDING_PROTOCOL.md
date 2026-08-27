# 🛡️ PROTOCOLO DE INTEGRIDADE FINANCEIRA & CONEXÃO SEGURA DE APIS (LEAKFINDER SAAS)

Este documento estabelece as **diretrizes inquebráveis de ética, psicologia do usuário e integridade de métricas financeiras** para o LeakFinder SaaS.

---

## 🏛️ 1. O Princípio Psicológico do Lojista
**Apresentar estimativas de faturamento ou perda financeira sem a devida contextualização pode gerar ansiedade, desconfiança ou sensação de alucinação.**

Por isso, **nenhum número financeiro pode ser exibido sem que pertença estritamente a uma destas 2 categorias**:

```mermaid
graph TD
    A[Métrica Financeira no LeakFinder] --> B[1. Projeção Simulada / Benchmark]
    A --> C[2. Dado Contábil Real & Auditado]

    B --> B1[Exibição Obrigatória do Selo '[Simulação Baseada em Parâmetros]']
    B --> B2[Controle Total do Usuário via Sliders de Orçamento e Ticket]
    
    C --> C1[Exibição do Selo '[Dado Real Auditado via API Conectada]']
    C --> C2[Requer Conexão Oficial Read-Only Shopify / Meta / Google]
```

---

## 🔒 2. Como Funciona a Conexão Segura de Dados (Sem Riscos)

Para lojistas que desejam auditar números exatos de vendas, carrinhos e custo por anúncio:

1. **Permissões Estritamente Read-Only (Apenas Leitura):**
   - **Shopify Admin API:** Apenas `read_orders`, `read_products`, `read_analytics`. O LeakFinder **NUNCA solicita permissão de escrita ou alteração de loja**.
   - **Meta Ads API:** Apenas `ads_read` para puxar o gasto diário real de cada campanha de catálogo.
   - **Google Analytics 4 / Clarity:** Apenas leitura de eventos de tráfego e abandono de funil.

2. **Criptografia em Repouso & Zero Compartilhamento:**
   - Tokens de acesso são armazenados com criptografia AES-256 no Supabase Vault.
   - Nenhum dado de faturamento é compartilhado com terceiros ou usado para treinar modelos públicos.

---

## 🎨 3. Padrão Visual Obrigatório (Design & Ícones)
* **Proibição de Emojis Informais:** Todos os componentes do LeakFinder devem utilizar exclusivamente ícones vetoriais elegantes (Lucide / FontAwesome style), transmitindo autoridade corporativa estilo McKinsey, Goldman Sachs e Bloomberg.
* **Transparência de Cálculos:** Sempre exibir a fórmula matemática de forma clara e auditável (*ex: "48% de demanda perdida em tamanhos G/GG × R$ 300/dia em Meta Ads = R$ 4.320/mês"*).
