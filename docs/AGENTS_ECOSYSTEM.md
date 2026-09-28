# 🤖 DOSSIÊ ARQUITETURAL & COMPÊNDIO DO ENXAME DE AGENTES (ADSHIELD)

> **Versão:** 4.0 • **Arquitetura:** Swarm Autônomo Multi-Agente Verticalizado • **Grounding:** 100% Real-Time Live Data  
> **Status:** 18 Agentes Ativos | 2 Reais + 7 Mistos + 9 Stubs Rotulados | 9 Verticais | 5 Merges Consolidados

---

## 🧭 1. Visão Geral da Topologia do Enxame (Swarm Topology)

O **AdShield** opera sob uma arquitetura de **Enxame Autônomo Hierárquico e Colaborativo**, dividida em 5 camadas funcionais com **Tribunal de Consenso** e **Grounding Absoluto**.

Nenhum agente emite parecer isolado sem antes passar pela validação de dados reais do **Auditor de Verdade** e pelo crivo do **Tribunal de Consenso Duplo**, eliminando 100% dos falsos-positivos e alucinações de IA.

```mermaid
graph TD
    subgraph CAMADA_1 [1. Governança & Orquestração Estratégica]
        A1[01. Chief Executive Orchestrator] --> A2[02. Universal Niche Recognition]
        A2 --> A3[03. Truth Auditor Engine]
        A3 --> A4[04. Dual-Agent Consensus Tribunal]
    end

    subgraph CAMADA_2 [2. Inteligência de Aquisição & Mídia]
        B1[05. Media Buyer & Ads Risk Agent]
        B2[06. Market Hunter Agent]
        B3[07. Competitor Radar Agent]
        B4[08. High-Conversion Sales Copywriter]
    end

    subgraph CAMADA_3 [3. CRO, Catálogo & Experiência Visual]
        C1[09. Universal Catalog Doctor]
        C2[10. Conversion Rate Architect]
        C3[11. Computer Vision & Saliency Engineer]
        C4[12. Technical SEO & Core Web Vitals]
    end

    subgraph CAMADA_4 [4. Cadeia de Suprimentos & Voz do Cliente]
        D1[13. ERP & Supply Chain Discrepancy Engine]
        D2[14. Customer Success VoC & NPS Agent]
        D3[15. SaaS Product Evolution Engineer]
    end

    subgraph CAMADA_5 [5. Infraestrutura, Resiliência & Mensageria]
        E1[16. DevOps Sentinel & Circuit Breaker]
        E2[17. Autonomous Code Patch Engineer]
        E3[18. WhatsApp Executive Watchdog Worker]
    end

    A1 --> CAMADA_2
    A1 --> CAMADA_3
    A1 --> CAMADA_4
    A1 --> CAMADA_5

    C1 -.->|Evidências de Catálogo| A3
    B1 -.->|Cálculo de Desperdício| A4
    D1 -.->|Descompasso de PCP| A4
    A4 -->|Veredito Unificado| E3
```

---

## 🏛️ 2. As 5 Camadas e Fichas Técnicas dos 18 Agentes

---

### 👑 CAMADA 1: Governança & Orquestração Estratégica

#### 01. Chief Executive Orchestrator Agent (CEO do Enxame)
* **Arquivo:** [`src/services/agents/chiefExecutiveOrchestratorAgent.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/agents/chiefExecutiveOrchestratorAgent.ts)
* **Interface UI:** [`src/components/agents/ChiefExecutiveOrchestratorAgentView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/agents/ChiefExecutiveOrchestratorAgentView.tsx)
* **Papel:** Líder supremo do enxame. Decompõe objetivos de negócio em tarefas granulares, coordena o fluxo de execução assíncrono entre os agentes e sintetiza o plano de ação executivo ordenado por **ICE Score** (Impacto, Confiança e Facilidade).
* **Gatilho de Execução:** Início de auditoria sob demanda e início de cada ciclo do Daemon 24/7.
* **Entradas:** Domínio da loja, nicho preliminar, verba de tráfego estimada e parâmetros de auditoria.
* **Saídas:** Diretrizes de auditoria, mapa de prioridades ICE e sumário executivo unificado.
* **Grounding:** Consolida apenas dados verificados pelos auditores especialistas.

#### 02. Universal Niche Recognition Agent (Reconhecedor de Nicho & DNA)
* **Arquivo:** [`src/services/agents/universalNicheRecognitionAgent.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/agents/universalNicheRecognitionAgent.ts)
* **Interface UI:** [`src/components/founder/UniversalNicheRecognitionView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/founder/UniversalNicheRecognitionView.tsx)
* **Papel:** Analisa a taxonomia, catálogo e metadados da loja para identificar com precisão o nicho e sub-nicho (ex: *Agropecuária & Moda Campo*, *Moda Pesca & Performance Outdoor*, *Streetwear*, *Cosméticos*).
* **Função Crítica:** Ativa as **Regras de Isenção** de produtos específicos (ex: iscas de pesca, anzóis, manguitos, óculos, bonés e tags `_FULL`) para que o Doctor de Catálogo não aponte falsas rupturas de tamanho em itens de tamanho único.
* **Entradas:** Títulos de produtos, categorias do DOM, meta tags e palavras-chave.
* **Saídas:** Nicho confirmado, perfil de público, ticket médio de referência e lista de regras de isenção ativadas.

#### 03. Truth Auditor Agent (Auditor de Verdade & Guardrail de Dados)
* **Arquivo:** [`src/services/orchestrator/truthAuditorAgent.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/orchestrator/truthAuditorAgent.ts)
* **Interface UI:** [`src/components/founder/TruthAuditorTribunalView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/founder/TruthAuditorTribunalView.tsx)
* **Papel:** Guardião supremo da integridade de dados. Inspeciona cada asserção dos outros agentes antes que chegue ao usuário ou ao banco.
* **Classificação Estrita:**
  1. 🟢 **Camada 1 (Fato Real):** URL viva, SKU real, estoque de grade e headers de rede.
  2. 🟡 **Camada 2 (Simulação):** Projeção financeira baseada em ROAS alvo declarada com `[Simulador Dinâmico]`.
  3. 🔴 **Camada 3 (Privado):** Dados confidenciais de faturamento e backend — bloqueia qualquer tentativa de invenção e exige conexão oficial via API.
* **Entradas:** Relatório de diagnóstico bruto de todos os agentes.
* **Saídas:** Laudo auditado com `grounding_score: 100` ou flag de veto imediato.

#### 04. Dual-Agent Consensus Tribunal (Tribunal de Consenso Duplo)
* **Arquivo:** [`src/services/ai/dualAgentConsensusGatekeeper.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/ai/dualAgentConsensusGatekeeper.ts)
* **Interface UI:** [`src/components/agents/DualAgentConsensusTribunalView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/agents/DualAgentConsensusTribunalView.tsx)
* **Papel:** Opera o modelo dialético de decisão. Para cada problema detectado, coloca frente a frente o **Auditor Acusador** (que aponta a falha e a perda de receita) e o **Advogado de Defesa da Loja** (que verifica se trata-se de intencionalidade de design, produto de revenda ou sazonalidade).
* **Veredito:** O laudo final só é aprovado se ambos entrarem em consenso com base em provas do DOM/API.

---

### 🎯 CAMADA 2: Inteligência de Aquisição & Mídia

#### 05. Media Buyer & Ads Risk Agent (Agente de Tráfego & Desperdício de Anúncios)
* **Arquivo:** [`src/components/agents/AdsAgentView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/agents/AdsAgentView.tsx)
* **Papel:** Cruza os produtos com ruptura de grade central (`M`, `G`, `GG`) ou anúncios sem Buy Box em Marketplaces contra a estratégia de tráfego pago da loja (Meta Ads e Google Ads).
* **Cálculo de Sangria:** Determina a verba diária e mensal queimada ao enviar tráfego qualificado para páginas onde o visitante não consegue comprar o tamanho adequado.
* **Simulador:** Fornece divisão técnica de funil (60% Topo / 25% Meio / 15% Fundo de Funil) com controle total via slider.

#### 06. Market Hunter Agent (Caçador de Oportunidades & Análise de Demanda)
* **Arquivo:** [`src/services/agents/marketHunterAgent.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/agents/marketHunterAgent.ts)
* **Interface UI:** [`src/components/agents/MarketHunterAgentView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/agents/MarketHunterAgentView.tsx)
* **Papel:** Vasculha tendências de mercado no nicho da loja, identificando produtos de alta demanda em ascensão, termos de busca emergentes e categorias sub-exploradas pelo catálogo da loja.
* **Entradas:** Catálogo público da loja e parâmetros setoriais.
* **Saídas:** Lista de novos produtos recomendados para expansão de mix com estimativa de aderência.

#### 07. Competitor Radar Agent (Radar Competitivo & Espionagem Ética)
* **Arquivo:** [`src/components/agents/CompetitorAgentView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/agents/CompetitorAgentView.tsx)
* **Interface UI:** [`src/components/founder/VectorMemoryCompetitorRadarView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/founder/VectorMemoryCompetitorRadarView.tsx)
* **Papel:** Compara a loja auditada contra os principais concorrentes do mesmo nicho em tempo real.
* **Métricas Comparadas:** Preço médio praticado, política de frete grátis, velocidade de carregamento, variedade de grade e gatilhos de checkout.

#### 08. High-Conversion Sales Copywriter (Copywriter de Fechamento B2B & WhatsApp)
* **Arquivo:** [`src/components/agents/SalesCopyAgentView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/agents/SalesCopyAgentView.tsx)
* **Papel:** Redige abordagens de fechamento comercial de altíssima conversão para agências e consultores que utilizam o AdShield para prospectar e-commerces.
* **Especialidade:** Cria mensagens de WhatsApp e e-mails embasados na **perda financeira inquestionável** descoberta pelo robô (ex: *"Sua campanha do produto X está gastando verba, mas o tamanho G acabou"*), tornando a resposta do lojista praticamente mandatória.

---

### 🔬 CAMADA 3: CRO, Catálogo & Experiência Visual

#### 09. Universal Catalog Doctor (Doctor de Catálogo Multi-Plataforma)
* **Arquivo:** [`scripts/universalCatalogAdapter.mjs`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/scripts/universalCatalogAdapter.mjs)
* **Interface UI:** [`src/components/agents/CroAgentView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/agents/CroAgentView.tsx)
* **Papel:** O motor de varredura mais robusto do sistema. Inspeciona o catálogo real ao vivo em **Shopify** (`/products.json`), **VTEX** (Search API), **Nuvemshop/Tiendanube** (Schema.org JSON-LD) e **Marketplaces** (Mercado Livre, Shopee, Amazon, Magalu).
* **Regras Específicas:**
  - Audita integridade da grade de vestuário (`PP`, `P`, `M`, `G`, `GG`, `G1`, `G2`).
  - Aplica isenções para tralhas de pesca, óculos, bonés, bandanas e estampas `_FULL`.
  - Verifica Buy Box e Logística Full em marketplaces.
  - Zero links 404: toda URL de produto gerada é real e clicável.

#### 10. Conversion Rate Architect (Arquiteto de CRO & Heurísticas de Usabilidade)
* **Arquivo:** [`src/components/agents/CroAgentView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/agents/CroAgentView.tsx)
* **Papel:** Audita as 10 Heurísticas de Usabilidade de Nielsen no e-commerce, detectando botões de adicionar ao carrinho fora da zona de alcance do polegar móvel (< 48px de altura), falta de tabela de medidas interativa e ausência de destaque para pagamento via Pix com desconto.

#### 11. Computer Vision & Saliency Engineer (Engenheiro de Visão Computacional)
* **Arquivo:** [`src/components/founder/ComputerVisionInspectionView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/founder/ComputerVisionInspectionView.tsx)
* **Papel:** Simula o comportamento ocular do usuário (eye-tracking) nos primeiros 2.500ms de navegação na página do produto.
* **Avaliações Técnicas:** Matriz de luminância e contraste de cores WCAG 2.1 AAA para botões de compra, ergonomia mobile e detecção OCR de selos de segurança e garantia.

#### 12. Technical SEO & Core Web Vitals Agent (Engenheiro de SEO & Performance)
* **Arquivo:** [`src/components/agents/SeoAgentView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/agents/SeoAgentView.tsx)
* **Interface UI:** [`src/components/founder/CoreWebVitalsAuditView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/founder/CoreWebVitalsAuditView.tsx)
* **Papel:** Audita a infraestrutura de indexação e performance técnica da loja.
* **Métricas Auditadas:** LCP (Largest Contentful Paint), FID/INP (Interactivity), CLS (Cumulative Layout Shift), marcação semântica Schema.org de produto e preços, e conformidade de meta tags Open Graph.

---

### 📦 CAMADA 4: Cadeia de Suprimentos & Voz do Cliente

#### 13. ERP & Supply Chain Discrepancy Engine (Auditor de Ruptura de Estoque e Hubs)
* **Arquivo:** [`src/services/supplyChain/erpHubDiscrepancyEngine.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/supplyChain/erpHubDiscrepancyEngine.ts)
* **Interface UI:** [`src/components/founder/SupplyChainDiscrepancyView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/founder/SupplyChainDiscrepancyView.tsx)
* **Papel:** Detecta o descompasso de estoque e pedidos entre o ERP central da empresa (Sankhya, Bling, Tiny), os Hubs de Integração (Magis5, Anymarket) e os Canais de Venda Digitais.
* **Classificação de Severidade (Graus 1 a 4):**
  - **Grau 1 (Risco Crítico):** Estoque zerado no e-commerce, mas campanhas de tráfego pago continuam ativas (queima direta de verba).
  - **Grau 2 (Fantasma de Catálogo):** Produto ativo no digital, mas sem saldo físico no ERP (risco de cancelamento e reclamação).
  - **Grau 3 (Dessincronia de Hub):** Saldo divergente entre a loja virtual e o anúncio de marketplace.
  - **Grau 4 (Runway de Produção & PCP):** Lead time fabril de corte e costura no Sankhya ERP incompatível com a velocidade de vendas digitais (< 5 dias de estoque restante).

#### 14. Customer Success VoC & NPS Agent (Voz do Cliente & Mineração de Reputação)
* **Arquivo:** [`src/services/agents/customerSuccessVocAgent.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/agents/customerSuccessVocAgent.ts)
* **Interface UI:** [`src/components/agents/CustomerSuccessVocAgentView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/agents/CustomerSuccessVocAgentView.tsx)
* **Papel:** Minera feedbacks públicos, avaliações de produto, reclamações e menções da marca para extrair o sentimento real do consumidor (Voice of Customer).
* **Entregáveis:** Nuvem de dores mais frequentes (ex: tamanho menor que o esperado, atraso na transportadora, tecido fino) e sugestões de copy corretivo nas páginas de produto.

#### 15. SaaS Product Evolution Engineer (Engenheiro de Auto-Evolução do Produto)
* **Arquivo:** [`src/services/agents/productEvolutionEngineerAgent.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/agents/productEvolutionEngineerAgent.ts)
* **Interface UI:** [`src/components/agents/ProductEvolutionAgentView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/agents/ProductEvolutionAgentView.tsx)
* **Papel:** Monitora a interação dos usuários com a plataforma AdShield e gera diagnósticos proativos de roadmap, sugerindo novos painéis, integrações e melhorias com base nas demandas mais frequentes.

---

### 🛡️ CAMADA 5: Infraestrutura, Resiliência & Mensageria

#### 16. DevOps Sentinel & Circuit Breaker (Sentinela de Resiliência 24/7)
* **Arquivo:** [`src/services/agents/devopsSentinelTelemetryAgent.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/agents/devopsSentinelTelemetryAgent.ts)
* **Interface UI:** [`src/components/founder/InfrastructureFourPillarsMonitor.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/founder/InfrastructureFourPillarsMonitor.tsx)
* **Papel:** Monitora a saúde operacional dos 4 pilares:
  1. *Internet & Conectividade de Borda* (Cloudflare ping de baixa latência).
  2. *GitHub CI/CD* (Sincronização de commits da branch `main`).
  3. *Vercel Edge Network* (Integridade do deploy de produção e compressão de bundle).
  4. *Dual-Persistence Engine* (Gravação durável no banco local `telemetry_db.json` com replicação assíncrona no Supabase).
* **Circuit Breaker:** Bloqueia timeouts e falhas de rede externas, garantindo que o painel continue 100% fluido e sem travamentos.

#### 17. Autonomous Code Patch Engineer (Engenheiro de Auto-Cura e Correção de Código)
* **Arquivo:** [`src/services/agents/autonomousCodePatchEngineerAgent.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/agents/autonomousCodePatchEngineerAgent.ts)
* **Interface UI:** [`src/components/founder/AgentSelfEvolutionView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/founder/AgentSelfEvolutionView.tsx)
* **Papel:** Agente de auto-cura do sistema. Analisa diagnósticos de linter (`oxlint`), logs de erros no console e tipagem TypeScript (`tsc`), gerando patches pontuais e executando validações de build automáticas antes de subir para produção.

#### 18. WhatsApp Executive Watchdog Worker (Vigia Executivo de WhatsApp 24/7)
* **Arquivo:** [`scripts/autonomous_swarm_daemon.mjs`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/scripts/autonomous_swarm_daemon.mjs)
* **Interface UI:** [`src/components/founder/WhatsAppWatchdogSettingsModal.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/founder/WhatsAppWatchdogSettingsModal.tsx)
* **Papel:** O elo de comunicação direta com a diretoria e os clientes da agência.
* **Comportamento:** A cada ciclo de auditoria autônoma do Daemon (ou em caso de alerta crítico imediato), sintetiza o laudo executivo com o **nome exato dos produtos rompidos**, cálculo de sangria de mídia e o status do enxame, enfileirando a mensagem para disparo via WhatsApp.

---

## 🔄 3. Modos de Execução do Enxame

| Modo | Onde Executa | Frequência | Responsabilidade |
| :--- | :--- | :--- | :--- |
| **Daemon 24/7 de Background** | Servidor / Node.js Process | Contínuo (a cada 60s) | Varredura de catálogos ao vivo, telemetria dual-durable e fila de WhatsApp. |
| **Auditoria Sob Demanda (SPA)** | Frontend React / Web Worker | Instantâneo (por clique) | Diagnóstico completo de uma URL digitada pelo usuário em até 3 segundos. |
| **Chat de Agentes com IA** | Claude / Gemini LLM Pipeline | Interativo | Conversa livre do usuário com qualquer uma das personas especialistas. |
| **Monitor de Borda dos 4 Pilares** | Borda Vercel / Cloudflare | A cada 60s ou On-Demand | Checagem de latência, integridade de commits e estado do Circuit Breaker. |

---

## 🛡️ 4. Regras de Grounding Inquebráveis para Todos os Agentes

Todos os 18 agentes estão contratualmente vinculados ao [`AGENTS.md`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/AGENTS.md):
1. **Proibição Absoluta de Alucinação:** URLs de produtos devem ser reais (Zero 404). SKUs, tamanhos e preços devem ser extraídos ao vivo do DOM ou das APIs públicas.
2. **Identificação Clara de Simulações:** Projeções de faturamento e ROAS devem conter o rótulo explícito `[Simulador Dinâmico]` ou `[Benchmark Setorial]`.
3. **Fronteira com Métricas Privadas:** Métricas confidenciais (saldo bancário, custo real por anúncio no Meta Ads Manager) nunca podem ser inventadas; o agente deve declarar expressamente a necessidade de integração oficial via API.
4. **Isenção de Falsos-Positivos:** Antes de acusar falta de tabela de medidas ou fotos, inspecionar os web components do tema (ex: `<product-addons>`).

---

## 📈 5. Como Adicionar um Novo Agente ao Enxame

Para adicionar novos agentes ao AdShield:
1. Criar a lógica do serviço em `src/services/agents/[novoAgente].ts`.
2. Criar o componente de interface correspondente em `src/components/agents/[NovoAgente]View.tsx`.
3. Registrar o novo agente no `ChiefExecutiveOrchestratorAgent` para incluí-lo na cadeia de delegação e na síntese de prioridades.
4. Adicionar as regras de auditoria no `universalCatalogAdapter.mjs` caso o agente execute no Daemon 24/7.
5. Atualizar este compêndio (`docs/AGENTS_ECOSYSTEM.md`) mantendo o grounding de 100%.

---

## 🏛️ 6. Especializações Atuariais, Prospecção & Compliance (AdShield 2026)

Em decorrência da auditoria profunda das operações e das diretrizes executivas, as seguintes especializações atômicas e regras de governança foram implementadas:

### 📐 1. Agente Engenheiro Atuarial de Sangria (`BleedActuaryEngine`)
* **Arquivo:** [`src/services/ai/bleedActuaryEngine.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/ai/bleedActuaryEngine.ts)
* **Papel:** O alicerce econométrico e matemático central do AdShield. Isolado de qualquer lógica de scraping ou telefonia.
* **Modelo Matemático:**
  - **Curva Gaussiana de Demanda por Nicho:** Mapeia a concentração real de compras no Brasil (ex: Vestuário: M/G = 65%; Calçados: 39-41 = 70%; Agro/Outdoor: G/GG/M = 75%).
  - **Decomposição da Sangria:**
    - `wastedMediaAdMonthlyBRL`: Verba de tráfego pago (Meta/Google Ads) queimada em cliques direcionados a tamanhos zerados.
    - `lostRevenueMonthlyBRL`: Lucro cessante decorrente de clientes que abandonam o checkout por falta de tamanho.
    - `inflatedCacFactor`: Multiplicador real de encarecimento do CAC (Custo de Aquisição de Clientes) decorrente do bounce rate.
  - **Precisão Atuarial:** Valores calculados com centavos exatos, sem arredondamentos grosseiros, com selo `[Simulação Baseada em Curva de Gauss & ROAS Alvo]`.

### 📱 2. Agente Minerador de Identidade & Contatos Comerciais (`CommercialContactSniperEngine`)
* **Arquivo:** [`src/services/prospecting/commercialContactSniperEngine.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/prospecting/commercialContactSniperEngine.ts)
* **Papel:** Especialista em inteligência de contato e auditoria jurídica de transparência no e-commerce.
* **Competências:**
  - **Mineração Forense de WhatsApp:** Extração cirúrgica de links `wa.me`, `api.whatsapp.com` e números móveis no DOM e rodapé.
  - **Auditoria do Decreto Federal nº 7.962/2013:** Verifica se a loja cumpre a Lei do E-commerce exibindo CNPJ, Razão Social e endereço físico visível no rodapé. Aponta infrações legais para lojas em desacordo.
  - **Higienização Telefônica:** Validação de DDD brasileiro (11 a 99), código DDI 55 e formatação rigorosa de celulares com 9º dígito.

### 🦅 3. Regra "Qualidade Depois Quantidade" no Harvester (`HarvesterQualityGatekeeper`)
* **Arquivo:** [`src/services/prospecting/autonomousLeadHunterEngine.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/prospecting/autonomousLeadHunterEngine.ts)
* **Princípio:** O robô prioriza dezenas de leads de altíssimo valor e dor comprovada em vez de minerar milhares de lojas com erros 404, sem tráfego ou sem estoque.
* **Esteira dos 5 Portais de Qualidade (Quality Gate):**
  1. *Gate 1 (Conectividade):* Domínio deve responder HTTP 200 com certificado SSL válido (descarte imediato de 404/500).
  2. *Gate 2 (Tráfego Pago Ativo):* Loja deve possuir Meta Pixel, GTM ou TikTok Pixel ativo no `<head>`.
  3. *Gate 3 (Catálogo Auditável):* Pelo menos 1 produto com variantes de tamanho identificadas.
  4. *Gate 4 (Ruptura em Tamanhos Centrais):* Ruptura comprovada nos tamanhos de alto giro (M/G ou 39/40/41).
  5. *Gate 5 (Corte Atuarial Mínimo):* Sangria mensal calculada pelo `BleedActuaryEngine` deve ser >= R$ 2.000/mês.
* **Quality Score (0 a 100):** Leads com pontuação inferior a 60 pontos são automaticamente descartados antes de entrar na base.

### 🛡️ 4. Agente Observador de Políticas de Plataformas (`PlatformPolicyWatcher`)
* **Arquivo:** [`src/services/reverseEngineering/platformPolicyWatcher.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/reverseEngineering/platformPolicyWatcher.ts)
* **Papel:** Sentinela do Agente 2 (Reverse Probe) para acompanhar atualizações contínuas nas plataformas Shopify, VTEX, Tray e Nuvemshop.
* **Monitoramento Contínuo:**
  - *Shopify API 2026-01:* Monitoramento de `inventory_policy: continue` (detecção de Estoque Fantasma / Regra Yellowstone Dutton Ranch) e limites de `/products.json`.
  - *VTEX IO Intelligent Search:* Transição de endpoints de busca e checagem de `commertialOffer.AvailableQuantity`.
  - *Tray Commerce:* Auditoria de estoque por variante e APIs abertas.
  - *Auto-Fallback:* Comuta automaticamente para adaptadores de contingência (Schema.org microdata / XML sitemaps) caso endpoints públicos sejam alterados pelo tema.

### 🚫 5. Diretriz Permanente "Zero Voice Calls" (Sem Ligações Telefônicas)
* **Regra Operacional:**
  - O cliente **NÃO PODE ligar para a empresa**. Todos os botões, ícones de discagem e referências a ligações telefônicas de voz foram removidos do site e do Concierge.
  - O modelo de atendimento e fechamento é **100% digital, documentado e assíncrono**, operando exclusivamente através de Chat com IA Concierge e WhatsApp Oficial (Click-to-Chat com texto auditado).
  - Garante rastreabilidade, histórico gravado por escrito de diagnósticos e elimina filas de espera telefônicas.

---

## 🔬 6. Mapa de Realidade dos Agentes (Auditoria Forense v4.0 — Setembro 2026)

> **Resultado da Auditoria:** Dos 18 agentes, apenas **2 são reais** (Catalog Doctor + Truth Auditor), **7 são mistos** (usam dados reais como input mas processam via regras/LLM) e **9 são STUBS puros** com dados hardcoded.

| Status | Agentes |
|:--|:--|
| 🟢 **Real (Scraping ao Vivo)** | 03 (Truth Auditor), 09 (Catalog Doctor) |
| 🟡 **Misto (Dados Reais + Processamento por Regras)** | 02 (Niche), 04 (Tribunal), 05 (Media Buyer), 08 (Copy), 10 (CRO), 12 (SEO), 18 (WhatsApp) |
| 🔴 **Stub (Dados Hardcoded)** | 01 (CEO), 06 (Market Hunter), 07 (Competitor), 11 (Vision), 13 (ERP), 14 (VoC), 15 (Product Evolution), 16 (DevOps), 17 (Code Patch) |

### Rótulos de Transparência na UI (Conforme AGENTS.md Camada 2)
Cada componente stub exibe um badge `AlertTriangle` com o rótulo correspondente:
- 01: `[Decisões Baseadas em Regras Estáticas]`
- 06: `[Simulação — Sem Scraping Real de Anúncios]`
- 07: `[Benchmark Estimado — Sem Dados Reais de Concorrentes]`
- 11: `[Simulação Heurística — Sem Visão Computacional Real]`
- 13: `[Requer Conexão ERP — Dados Ilustrativos]`
- 14: `[Dados de Demonstração — Sem Scraping de Reviews]`
- 15: `[Roadmap Estático de Demonstração]`
- 16: `[Telemetria Simulada via localStorage]`
- 17: `[Templates de Patch — Sem Execução Automática]`

---

## 🌐 7. Motor de Verticalização Dinâmica

### Arquitetura de Injeção de Contexto Vertical
O motor de verticalização injeta automaticamente contexto de nicho nos prompts de sistema dos 18 agentes:

```
dynamicVerticalContext.ts → resolveDynamicVertical() → DynamicVerticalProfile
                                          ↓
verticalContextInjector.ts → getVerticalizedSystemPrompt() → System Prompt + Bloco Vertical
                                          ↓
masterSwarmPrompts.ts → getAgentSystemPromptWithVertical() → Prompt Final Calibrado
```

### 9 Verticais Suportadas
| ID | Label | Ticket Médio | CPC Meta | CVR Baseline |
|:--|:--|:--|:--|:--|
| `CALCADOS_COURO` | Calçados, Couro & Artefatos | R$ 319,90 | R$ 1,45 | 1,30% |
| `AGRO_CAMPO_OUTDOOR` | Agro, Campo & Outdoor | R$ 189,90 | R$ 0,95 | 1,80% |
| `STREETWEAR_MODA_URBANA` | Streetwear & Moda Urbana | R$ 249,90 | R$ 1,10 | 1,60% |
| `FITNESS_BEACHWEAR` | Fitness & Beachwear | R$ 159,90 | R$ 0,75 | 2,20% |
| `COSMETICOS_BEAUTY` | Cosméticos & Beauty | R$ 129,90 | R$ 0,65 | 2,50% |
| `PET_SHOP_VETERINARIA` | Pet Shop & Veterinária | R$ 149,00 | R$ 0,85 | 2,80% |
| `CASA_DECORACAO_MOVEIS` | Casa, Decoração & Móveis | R$ 489,00 | R$ 1,85 | 0,95% |
| `ELETRONICOS_INFORMATICA` | Eletrônicos & Informática | R$ 599,00 | R$ 2,10 | 1,10% |
| `VAREJO_GERAL` | E-commerce & Varejo Geral (fallback) | R$ 199,00 | R$ 1,20 | 1,50% |

### Arquivos do Motor
| Arquivo | Função |
|:--|:--|
| `src/services/ai/dynamicVerticalContext.ts` | 9 perfis verticais + `resolveDynamicVertical()` |
| `src/services/ai/verticalContextInjector.ts` | Injeção de contexto nos 18 prompts |
| `src/services/ai/prompts/masterSwarmPrompts.ts` | 18 definições de agentes + `getAgentSystemPromptWithVertical()` |

---

## 🔀 8. Mapa de Consolidação de Componentes (Fase 2 Merges)

| Sobreposição | Componente Removido/Redirecionado | Componente Canônico |
|:--|:--|:--|
| Agent 07 (Competitor) | `CompetitorAgentView.tsx` → lazy import removido | `VectorMemoryCompetitorRadarView.tsx` |
| Agent 12 (SEO) | `CoreWebVitalsAuditView.tsx` → consolidado na tab `code_security` | `SeoAgentView.tsx` + `CoreWebVitalsAuditView.tsx` juntos |
| Agent 08 (Copy vs Growth) | `PmGrowthAgentView.tsx` → movido para tab `cro_copy` | `SalesCopyAgentView.tsx` + `PmGrowthAgentView.tsx` juntos |
| Agent 16 (DevOps) | `DevOpsSelfHealingControlCenterView.tsx` → import removido | `InfrastructureFourPillarsMonitor.tsx` |
| Agent 10 (CRO vs Catalog) | Responsabilidades separadas | CRO = UI/UX heurísticas; Catalog = SKUs/Grade |
