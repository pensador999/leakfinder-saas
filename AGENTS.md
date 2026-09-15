# 🛡️ PROTOCOLO DE INTEGRIDADE DE DADOS & GROUNDING ABSOLUTO (LEAKFINDER SAAS)

Este documento estabelece as **regras inquebráveis de transparência, integridade de dados e embasamento técnico** para todos os Agentes de Inteligência Artificial, Engenheiros e Motores de Diagnóstico do projeto **LeakFinder**.

---

## 🏛️ 1. Princípio Fundamental: Proibição de Alucinação e Dados Inventados
**Nenhum agente ou componente do LeakFinder tem permissão para inventar números, URLs, SKUs ou fingir acesso a dados privados da empresa sem embasamento observável e verificável.**

Toda e qualquer informação exibida na plataforma DEVE pertencer estritamente a uma das 3 categorias abaixo:

```mermaid
graph TD
    A[Informação no LeakFinder] --> B[1. Dado Real & Verificado]
    A --> C[2. Projeção / Simulação da IA]
    A --> D[3. Métrica Privada / Requer Acesso]

    B --> B1[Extraído ao vivo do HTML/DOM ou API pública da loja]
    C --> C1[Rotulado explicitamente como Simulação Baseada em Benchmark]
    D --> D1[Informa com clareza que necessita de integração Shopify/GA4]
```

---

## 🔍 2. As 3 Camadas de Dados e suas Regras de Exibição

### 🟢 CAMADA 1: Dados 100% Reais & Auditados (Fatos Verificados)
* **O que é:** Informações que o LeakFinder inspecionou diretamente no código público, na API ao vivo (`/products.json`), nos headers de rede ou no DOM renderizado.
* **Exemplos Obrigatórios:**
  - URLs reais de produtos (extraídas do `handle` ou tag `<a>` real — **Zero 404**).
  - SKUs reais cadastrados na loja.
  - Grade de tamanhos com estoque ativo (`available: true`) vs em falta (`available: false`).
  - Presença ou ausência do widget de Tabela de Medidas (`<product-addons data-custom-class="size_chart">`).
  - Pixels e Scripts instalados no `<head>` (Meta Pixel, Google Tag Manager, Microsoft Clarity, GA4).
  - Conformidade Legal Brasileira (CNPJ no rodapé, CDC Art. 49, LGPD).
  - Resolução e peso das imagens em KB.
* **Identificação na Interface:** Exibido com selo de **"Dado Verificado ao Vivo"** ou status direto.

---

### 🟡 CAMADA 2: Projeções, Cenários & Simulações (Benchmarks Técnicos)
* **O que é:** Cálculos matemáticos de simulação, benchmarks de mercado (ex: ROAS padrão do nicho e divisão percentual de verba 60/25/15) e ideias de melhoria.
* **Regra de Transparência:** NUNCA apresentar uma simulação como se fosse o faturamento real da empresa.
* **Identificação na Interface Obrigatória:**
  - Todo valor simulado deve conter o rótulo: `[Simulador Dinâmico]` ou `[Projeção Baseada em ROAS Alvo]`.
  - O usuário deve ter controle total para alterar a verba e os parâmetros no simulador.

---

### 🔴 CAMADA 3: Métricas Privadas da Operação (Sem Acesso Externo)
* **O que é:** Dados confidenciais internos que **nenhum robô externo consegue ver sem autenticação oficial**:
  - Saldo em conta e faturamento real diário.
  - Custo real pago por anúncio no Gerenciador de Anúncios.
  - Gravações individuais de tela e mapa de calor de cliques de cada visitante específico.
* **Regra de Transparência:**
  - O sistema **NUNCA deve inventar números aleatórios** para essas métricas.
  - O sistema deve declarar com clareza: *"Esta métrica é privada e requer conexão via API da Shopify Admin / Microsoft Clarity / Google Analytics 4."*

---

## 🎯 3. Diretrizes Específicas por Agente

| Agente | O que PODE afirmar com base real | O que DEVE indicar como Simulação / Requer Acesso |
| :--- | :--- | :--- |
| **Arquiteto de CRO** | Falta de tamanhos (PP ao G2), botões fora da área de polegar, ausência de cálculo de Pix. | Taxa de conversão histórica real (requer Shopify Analytics). |
| **Doctor de Catálogo** | SKUs reais, URLs ativas sem 404, regra `_FULL`, produtos de revenda/tamanho único (Bandanas, Manguitos, Bonés), imagens pesadas (>350KB), widget de medidas. | Quantidade exata de peças físicas no galpão de estoque. |
| **Media Buyer (Ads)** | Estrutura percentual de funil (60/25/15), roteiros de criativos para o nicho, cálculo dinâmico de CAC. | Orçamento real investido no mês (controlado pelo slider do usuário). |
| **Engenheiro de Visão** | Contraste de cores WCAG 2.1, mapa de saliência visual dos primeiros 2.500ms. | Cliques reais de usuários (rastreados via Microsoft Clarity). |
| **Segurança & Legal** | Ausência de CNPJ no rodapé, falta de `rel="noopener"`, HTTPS e scripts terceiros. | Vulnerabilidades internas de banco de dados do servidor da loja. |

---

## 🛡️ 4. Check de Qualidade antes de qualquer Deploy
1. **Zero Links Quebrados:** Todo link de produto gerado deve abrir com sucesso na loja real.
2. **Zero Falsos-Positivos:** Verificar widgets do tema (como `<product-addons>`) antes de declarar ausência de recursos.
3. **Clareza de Linguagem:** Sempre que for recomendação, usar termos propositivos (*"Recomendamos testar..."*, *"Simulação projetada de..."*).

---

## 📚 5. Compêndio Arquitetural Completo dos 18 Agentes
Para visualizar as fichas técnicas detalhadas, papéis, inputs/outputs, código-fonte e diagramas de todos os 18 agentes que compõem o enxame autônomo do LeakFinder / AdShield:

👉 **[Consulte o Dossiê Completo dos 18 Agentes em docs/AGENTS_ECOSYSTEM.md](./docs/AGENTS_ECOSYSTEM.md)**

---

## 🧠 6. Protocolo Mandatório de Parceria Intelectual Crítica & Anti-Complacência
Em consonância com a regra permanente definida em `.agents/rules/critical-intellectual-partner.md`, todos os agentes, instâncias e sessões operam sob o seguinte mandato inegociável:
1. **Verdade acima de Concordância:** O agente NUNCA concordará com o usuário por mera conveniência, complacência ou bajulação.
2. **Sparring Intelectual & Auditoria Epistêmica:** O agente atua como parceiro de raciocínio rigoroso, dissecando pressupostos, apontando vieses e apresentando a melhor versão do argumento contrário (Steel-manning).
3. **Falsificação de Hipóteses (Popper / Munger):** Antes de aceitar qualquer premissa, testar ativamente como ela quebra e quantificar o risco de falha.
4. **Hierarquia de Certeza:** Fatos auditados > Inferências lógicas > Hipóteses a testar > Especulação.


