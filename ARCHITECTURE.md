# 🏛️ ADSHIELD / LEAKFINDER SAAS — ESPECIFICAÇÃO ARQUITETURAL GLOBAL & MODELO C4 (V4.0)

> **Documento Oficial de Engenharia, Arquitetura de Software e Governança Multi-Agente**  
> **Versão:** 4.0.0 (Enterprise Swarm Ready) • **Topologia:** Enxame Híbrido Bimodal (Passivo + Caçador Ativo)  
> **Grounding:** 100% Live Real-Time Data (Protocolo `AGENTS.md`)  
> **Repositório:** `https://github.com/pensador999/leakfinder-saas`

---

## 📑 Sumário Executivo
1. [🎯 1. Visão Geral do Sistema & Proposta de Valor](#-1-visão-geral-do-sistema--proposta-de-valor)
2. [📐 2. Modelo C4 de Arquitetura](#-2-modelo-c4-de-arquitetura)
   - [C4 Nível 1: Diagrama de Contexto do Sistema (System Context)](#c4-nível-1-diagrama-de-contexto-do-sistema-system-context)
   - [C4 Nível 2: Diagrama de Contêineres (Containers Architecture)](#c4-nível-2-diagrama-de-contêineres-containers-architecture)
   - [C4 Nível 3: Diagrama de Componentes (Os 18 Agentes & Orquestração Dual)](#c4-nível-3-diagrama-de-componentes-os-18-agentes--orquestração-dual)
   - [C4 Nível 4: Diagrama de Execução & Fluxo de Código (Code & Sequence)](#c4-nível-4-diagrama-de-execução--fluxo-de-código-code--sequence)
3. [🛡️ 3. Protocolo de Integridade de Dados & Grounding (3 Camadas)](#-3-protocolo-de-integridade-de-dados--grounding)
4. [🐳 4. Infraestrutura MCP (Model Context Protocol) em Nuvem (Docker & SSE)](#-4-infraestrutura-mcp-model-context-protocol-em-nuvem-docker--sse)
5. [🦅 5. Arquitetura do Enxame Caçador Ativo (Outbound Sniper & Outreach)](#-5-arquitetura-do-enxame-caçador-ativo-outbound-sniper--outreach)
6. [🛠️ 6. Stack Tecnológica, Banco de Dados & Resiliência](#-6-stack-tecnológica-banco-de-dados--resiliência)

---

## 🎯 1. Visão Geral do Sistema & Proposta de Valor

O **AdShield / LeakFinder** é uma plataforma SaaS de alta tecnologia voltada para proteção de orçamento de mídia, diagnóstico de conversão (CRO) e prospecção autônoma para e-commerces.

### O Modelo Bimodal Híbrido:
* **Modo Passivo (Profundidade & Retenção):** O lojista ou auditor insere a URL da loja e recebe um diagnóstico profundo em 18 dimensões com mapa de calor de atenção visual (WCAG 2.1 AAA), teste de Core Web Vitals, verificação de ERP/Hub e geração de código `.liquid` de remediação imediata.
* **Modo Caçador Ativo (Throughput & Prospecção Outbound):** O enxame autônomo navega de forma headless pela web em nichos pré-selecionados, identifica lojas investindo em tráfego (Meta Pixel ativo), flagra produtos com furos graves de estoque (M/G esgotados), extrai o WhatsApp oficial e gera pitches de 3 passos para envio com 1 clique ou via webhook automatizado.

---

## 📐 2. Modelo C4 de Arquitetura

Adotamos o framework **C4 Model** estruturado em 4 níveis progressivos de abstração:

---

### C4 Nível 1: Diagrama de Contexto do Sistema (System Context)

Posiciona o AdShield em relação aos atores humanos e todos os serviços externos conectados.

```mermaid
graph TD
    UserLojista["👤 Lojista / CMO<br/>(Visualiza Diagnóstico, Corrige Temas & Salva Verba)"]
    UserAgencia["🏢 Gestor de Agência / Closer<br/>(Usa o Caçador Ativo para Prospecção B2B)"]

    subgraph SystemBoundary["🏛️ Limite do Sistema: ADSHIELD / LEAKFINDER ECOSYSTEM"]
        AdShieldCore["⚡ AdShield SaaS & Swarm Engine<br/>(Orquestração Bimodal de 18 Agentes Autônomos)"]
    end

    TargetStores["🏬 Lojas Virtuais Alvo (Web Pública)<br/>(Shopify, VTEX, Nuvemshop, WooCommerce, Headless)"]
    MetaAds["📢 Meta Ads Library<br/>(Validação de Anúncios Ativos no Facebook/Instagram)"]
    Clarity["🎥 Microsoft Clarity<br/>(Gravações de Sessões, Rage Clicks e Mapas de Calor)"]
    SupabaseDB["🗄️ Supabase Cloud<br/>(PostgreSQL, Auth, Fila de Leads & Snapshots)"]
    WhatsAppGW["💬 Evolution API / Z-API<br/>(Gateway de Mensageria com Proteção Anti-Ban)"]
    MCPWorker["🐳 Cloud MCP Headless Worker<br/>(Container Docker com Chromium & SSE)"]

    UserLojista -->|"Solicita auditoria profunda e copia scripts .liquid"| AdShieldCore
    UserAgencia -->|"Aciona o Radar Caçador Ativo e dispara abordagens"| AdShieldCore

    AdShieldCore -->|"Navega de forma silenciosa ou visual"| MCPWorker
    MCPWorker -->|"Extrai DOM hidratado, tags e fotos de produtos"| TargetStores
    AdShieldCore -->|"Gera links canônicos de verificação de criativos"| MetaAds
    AdShieldCore -->|"Cruza dados com o projeto configurado"| Clarity
    AdShieldCore -->|"Persiste histórico diário, CRM e configurações"| SupabaseDB
    AdShieldCore -->|"Dispara mensagens com delays humanos (15s a 45s)"| WhatsAppGW
```

---

### C4 Nível 2: Diagrama de Contêineres (Containers Architecture)

Demonstra a distribuição física dos contêineres de execução, armazenamento e comunicação.

```mermaid
graph TD
    subgraph ClientBrowser["💻 Navegador do Usuário / Frontend SPA"]
        SPA["🌐 Single Page Application (SPA)<br/>React 19 + TypeScript + Vite + Tailwind CSS<br/>(Porta 3000)"]
        LocalClient["📡 Remote MCP Client Bridge<br/>(src/services/mcp/remoteMcpClient.ts)"]
        SPA --> LocalClient
    end

    subgraph DockerHost["🐳 Docker Container Environment (Railway / Fly.io / Compose)"]
        MCPContainer["📦 adshield-mcp-headless-worker<br/>Node.js 20 Bookworm Slim + Chromium Linux<br/>(Porta 3001)"]
        ExpressServer["⚡ Express HTTP Server (/health, /api/audit)"]
        SSETransport["📡 SSEServerTransport (/sse, /messages)"]
        BrowserPool["🏊 BrowserPool Manager (Semáforo de Concorrência)"]
        LinuxChromium["🌐 Linux Chromium Headless (dumb-init)"]

        MCPContainer --> ExpressServer
        MCPContainer --> SSETransport
        ExpressServer --> BrowserPool
        SSETransport --> BrowserPool
        BrowserPool --> LinuxChromium
    end

    subgraph CloudStorage["☁️ Backend as a Service (BaaS)"]
        SupaPostgres[("🗄️ Supabase PostgreSQL<br/>- store_daily_snapshots<br/>- swarm_prospect_leads<br/>- swarm_outreach_queue")]
        SupaAuth["🔐 Supabase Auth (JWT & RLS)"]
    end

    subgraph MessagingExternal["📱 Mensageria & Gateways"]
        EvoAPI["💬 Evolution API / Z-API Server<br/>(Webhooks de WhatsApp)"]
    end

    LocalClient -->|"Stream SSE / HTTP POST (Porta 3001)"| ExpressServer
    LocalClient -->|"Fallback local de scraping (se worker offline)"| SPA
    SPA -->|"Gravação de telemetria e leads"| SupaPostgres
    SPA -->|"Autenticação do operador"| SupaAuth
    SPA -->|"Fila anti-ban de disparos"| EvoAPI
```

---

### C4 Nível 3: Diagrama de Componentes (Os 18 Agentes & Orquestração Dual)

Representa a estrutura de governança do enxame de 18 agentes divididos em 5 camadas funcionais com Orquestração Bimodal:

```mermaid
graph TD
    subgraph DUAL_ORCHESTRATOR ["00. Torre de Controle & Orquestração Bimodal"]
        OrchPassive["👑 01. Chief Executive Orchestrator<br/>(Modo Passivo: Análise Profunda & ICE Score)"]
        OrchActive["🦅 Novo: Autonomous Outbound Hunter<br/>(Modo Ativo: Triagem Rápida Fail-Fast)"]
    end

    subgraph CAMADA_1 ["1. Governança, Consenso & Grounding"]
        A02["02. Universal Niche Recognition<br/>(Regras de Isenção de Grade)"]
        A03["03. Truth Auditor Engine<br/>(Guardrail das 3 Camadas de Dados)"]
        A04["04. Dual-Agent Consensus Tribunal<br/>(Dialética: Acusação vs Defesa)"]
    end

    subgraph CAMADA_2 ["2. Inteligência de Aquisição & Mídia"]
        A05["05. Media Buyer & Ads Risk<br/>(Meta Pixel & Cálculo de Desperdício)"]
        A06["06. Market Hunter Agent<br/>(Varredura de Sementes & Tendências)"]
        A07["07. Competitor Radar Agent<br/>(Benchmarking Técnico Factual)"]
        A08["08. High-Conversion Sales Copywriter<br/>(Pitches em 3 Passos para WhatsApp)"]
    end

    subgraph CAMADA_3 ["3. Catálogo, CRO & Engenharia Visual"]
        A09["09. Universal Catalog Doctor<br/>(Grade PP ao G2, Regra _FULL)"]
        A10["10. Conversion Rate Architect<br/>(Heurísticas de Nielsen, Thumb Zone)"]
        A11["11. Computer Vision & Saliency<br/>(WCAG 2.1 AAA, Mapa de Atenção 2.500ms)"]
        A12["12. Technical SEO & Core Web Vitals<br/>(LCP, INP, CLS & Google Shopping)"]
    end

    subgraph CAMADA_4 ["4. Cadeia de Suprimentos & Voz do Cliente"]
        A13["13. ERP/Hub Discrepancy Engine<br/>(Sankhya, Bling, Tiny, Magis5)"]
        A14["14. Customer Success VoC Agent<br/>(Mineração de Objeções B2B)"]
        A15["15. SaaS Product Evolution Engineer<br/>(Auto-auditoria do Bundle & Índices)"]
    end

    subgraph CAMADA_5 ["5. Resiliência, Infra & Mensageria"]
        A16["16. DevOps Sentinel & Circuit Breaker<br/>(Telemetria de Erros & Fail-Safe)"]
        A17["17. Autonomous Code Patch Engineer<br/>(Auto-Remediação de Scripts)"]
        A18["18. WhatsApp Watchdog & Outreach<br/>(Fila Anti-Ban de 15s a 45s)"]
    end

    OrchPassive --> A02 --> A09 --> A10 --> A11 --> A12 --> A13 --> A04 --> A03
    OrchActive --> A02 --> A09 --> A05 --> A08 --> A03 --> A18
```

---

### C4 Nível 4: Diagrama de Execução & Fluxo de Código (Code & Sequence)

#### Fluxo 4.1: O Caçador Ativo em Ação (Outbound Sniper)
Demonstra o caminho de dados ultra-rápido quando o enxame varre a internet procurando novos clientes:

```mermaid
sequenceDiagram
    autonumber
    actor Operator as Operador / Cron 24h
    participant RadarUI as Terminal do Radar Live
    participant Hunter as autonomousLeadHunterEngine
    participant MCP as Docker MCP Worker
    participant Target as Loja Virtual Alvo
    participant Truth as Truth Auditor Agent
    participant Closer as Copywriter Outbound
    participant Queue as Fila WhatsApp Anti-Ban

    Operator->>RadarUI: Inicia Varredura (ex: Nicho Moda Campo)
    RadarUI->>Hunter: startAutonomousHuntingSession()
    Hunter->>RadarUI: Evento RADAR_STARTED (5%)
    
    loop Para cada Loja Semente no Nicho
        Hunter->>MCP: POST /api/audit (URL)
        MCP->>Target: Inspeciona DOM hidratado & Scripts
        Target-->>MCP: Retorna HTML, Meta Pixel, CTAs e WhatsApp
        
        alt Loja Não Possui Meta Pixel ou Sem Furos
            MCP-->>Hunter: Descarte Imediato (Fail-Fast em ~1.2s)
            Hunter->>RadarUI: Evento STORE_SKIPPED
        else Meta Pixel Ativo + Furo de Grade M/G Identificado
            MCP-->>Hunter: Retorna SKU, foto, preço e WhatsApp minerado
            Hunter->>Truth: Valida Fatos Reais (Zero Alucinação)
            Truth-->>Hunter: Aprovado (Camada 1: Dado Factual)
            Hunter->>Closer: Gera Pitches em 3 Passos (Dono / Gestor / Áudio)
            Closer-->>Hunter: Pitches formatados
            Hunter->>Queue: Enfileira Lead com delay humano (15s a 45s)
            Hunter->>RadarUI: Eventos STOCK_RUPTURE_FOUND e LEAD_QUALIFIED (100%)
        end
    end
    
    Operator->>RadarUI: Clica em "Disparar WhatsApp (1-Clique)" ou aciona Webhook
```

---

## 🛡️ 3. Protocolo de Integridade de Dados & Grounding

O sistema obedece rigorosamente às diretrizes documentadas em [`AGENTS.md`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/AGENTS.md). Cada informação gerada na tela pertence obrigatoriamente a uma das 3 camadas:

```
┌────────────────────────────────────────────────────────────────────────┐
│             AS 3 CAMADAS DE INTEGRIDADE DE DADOS DO ADSHIELD           │
├──────────────────────┬──────────────────────────┬──────────────────────┤
│ Camada               │ Critério de Verdade      │ Exibição na Interface│
├──────────────────────┼──────────────────────────┼──────────────────────┤
│ 🟢 CAMADA 1: Fatos   │ Dados observáveis no     │ Selo de Dado         │
│ Reais & Auditados    │ DOM/API (SKU, links vivos│ Verificado ao Vivo   │
│                      │ sem 404, Meta Pixel).    │ (Zero Alucinação).   │
├──────────────────────┼──────────────────────────┼──────────────────────┤
│ 🟡 CAMADA 2:         │ Cálculos matemáticos de  │ Rótulo Obrigatório:  │
│ Simulações & Cenários│ simulação baseados em    │ [Simulador Dinâmico] │
│                      │ benchmarks de mercado.   │ ou [Benchmark].      │
├──────────────────────┼──────────────────────────┼──────────────────────┤
│ 🔴 CAMADA 3:         │ Dados internos confiden- │ Declaração honesta de│
│ Métricas Privadas    │ ciais (saldo, lucro real)│ necessidade de API   │
│                      │ sem acesso externo.      │ da Shopify/Clarity.  │
└──────────────────────┴──────────────────────────┴──────────────────────┘
```

---

## 🐳 4. Infraestrutura MCP (Model Context Protocol) em Nuvem

* **Container Docker:** [`docker/mcp-headless-worker/`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/docker/mcp-headless-worker)
* **Transporte SSE Oficial:** Rotas `/sse` e `/messages` para conexão bidirecional em streaming.
* **Segurança Criptográfica:** Autenticação via `MCP_API_KEY` gerada com chave de alta entropia de 256 bits (`d2c4b969b83b3fdfe6ccf6371971bca5ea6382b717ce68cd87e9fafb44cdead2`).
* **Proteção de Recursos:** Reciclagem automática do Chromium a cada 100 auditorias e bloqueio de downloads desnecessários de fontes e mídias.

---

## 🦅 5. Arquitetura do Enxame Caçador Ativo

* **Motor Autônomo:** [`src/services/prospecting/autonomousLeadHunterEngine.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/prospecting/autonomousLeadHunterEngine.ts)
* **Disparador Anti-Ban:** [`src/services/prospecting/outboundWebhookDispatcher.ts`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/services/prospecting/outboundWebhookDispatcher.ts)
* **Interface do Radar:** [`src/components/prospecting/AutonomousOutboundRadarView.tsx`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/src/components/prospecting/AutonomousOutboundRadarView.tsx)
* **Fórmula do Gancho em 3 Passos (WhatsApp Closer):**
  1. *Gancho do Flagrante:* *"Vimos que vocês anunciam no Meta Ads para o produto X, mas os tamanhos M e G estão esgotados no site."*
  2. *Custo da Inação:* *"Como M e G representam ~65% das vendas, a cada R$ 1.000 investidos, cerca de R$ 650 viram cliques perdidos (sangria de ~R$ X.XXX,XX/mês)."*
  3. *CTA Sem Fricção:* *"Tenho o dossiê confidencial de 1 página pronto com os links para pausar o anúncio ou repor o estoque. Posso te enviar aqui pelo WhatsApp? É só responder 'QUERO'."*

---

## 🛠️ 6. Stack Tecnológica, Banco de Dados & Resiliência

* **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Vite 8.2.
* **Worker Headless:** Node.js 20 Bookworm Slim, Chromium Linux Nativo, Puppeteer-Core, Dumb-Init.
* **Protocolo de Agentes:** Model Context Protocol (MCP SDK 1.6.1) com Server-Sent Events (SSE).
* **Banco de Dados & Auth:** Supabase PostgreSQL com Row Level Security (RLS) e índices compostos.
* **Compilação e Tipagem:** TypeScript 5.7 em modo estrito (`tsc -b`), zero erros em build de produção.

---

> 🔒 *Documento oficial de engenharia atualizado e mantido na raiz do projeto em [`ARCHITECTURE.md`](file:///c:/Users/lucas/OneDrive/Documentos/WORKER/ARCHITECTURE.md).*
