# ⚡ LEAKFINDER SAAS — Auditoria, Telemetria & Remediação de E-Commerce

<p align="center">
  <strong>Plataforma autônoma de diagnóstico com inteligência multi-agente, telemetria comportamental e gerador de scripts (.liquid e CSS) para otimização de conversão no e-commerce.</strong>
</p>

<p align="center">
  <a href="#-visão-geral">Visão Geral</a> •
  <a href="#-arquitetura--c4-model">Arquitetura & C4 Model</a> •
  <a href="#-os-8-agentes-especialistas">Esquadrão de Agentes</a> •
  <a href="#-integridade-de-dados">Integridade de Dados</a> •
  <a href="#-como-executar">Como Executar</a>
</p>

---

## 🌟 Visão Geral

O **LeakFinder** é uma solução de auditoria profunda e remediação instantânea que inspeciona o código-fonte, o DOM, a telemetria do Microsoft Clarity e o catálogo de lojas virtuais (Shopify, VTEX, Nuvemshop, WooCommerce e Enterprise Headless como Nike e Adidas).

Ao contrário de scanners teóricos, o LeakFinder fecha o ciclo de otimização entregando o **código exato (.liquid e CSS)** pronto para copiar e colar no tema da loja, eliminando gargalos de conversão em minutos.

---

## 🏛️ Arquitetura & C4 Model

A arquitetura completa do sistema está documentada no padrão **C4 Model (Context, Containers, Components, Code)**:

👉 **[Consulte a Arquitetura Completa em ARCHITECTURE.md](./ARCHITECTURE.md)**

```
┌────────────────────────────────────────────────────────┐
│                      LEAKFINDER                        │
│                 ARQUITETURA C4 MODEL                   │
└────────────────────────────────────────────────────────┘
  Nível 1: Contexto Global (Usuário & Ecossistema)
  Nível 2: Contêineres (SPA, Web Workers, Supabase, APIs)
  Nível 3: Componentes (8 Agentes Autônomos & Motores)
  Nível 4: Código & Fluxo de Telemetria e Remediação
```

---

## 🤖 Enxame Autônomo de 18 Agentes Especialistas

O LeakFinder opera um ecossistema com **18 Agentes de IA Especialistas**, organizados em 5 camadas funcionais coordenadas pelo **CEO Orchestrator** e reguladas pelo **Tribunal de Consenso Duplo**:

| Camada | Agentes | Responsabilidade Principal |
| :--- | :--- | :--- |
| **1. Governança & Orquestração** | `CEO Orchestrator`, `Universal Niche Recognition`, `Truth Auditor`, `Dual-Agent Consensus Tribunal` | Priorização ICE Score, DNA do nicho, grounding e eliminação de falsos-positivos. |
| **2. Aquisição & Mídia** | `Media Buyer & Ads Risk`, `Market Hunter`, `Competitor Radar`, `High-Conversion Sales Copywriter` | Sangria de verba em anúncios, gaps de mercado, benchmarking e copy B2B. |
| **3. CRO & Catálogo** | `Universal Catalog Doctor`, `Conversion Rate Architect`, `Computer Vision & Saliency`, `Technical SEO` | Grade `PP a G2` (Shopify, VTEX, Nuvemshop, Marketplaces), usabilidade, contraste WCAG e Core Web Vitals. |
| **4. Supply Chain & VoC** | `ERP & Supply Chain Discrepancy Engine`, `Customer Success VoC & NPS`, `SaaS Product Evolution` | Rupturas ERP (Sankhya/Bling) vs Hubs (Magis5), runway de PCP, Reclame Aqui e melhoria contínua. |
| **5. DevOps & Resiliência** | `DevOps Sentinel & Circuit Breaker`, `Autonomous Code Patch Engineer`, `WhatsApp Watchdog Worker` | Monitor 360º dos 4 pilares, auto-cura de código e alertas executivos 24/7 no WhatsApp. |

👉 **[Consulte o Dossiê Técnico Completo dos 18 Agentes em docs/AGENTS_ECOSYSTEM.md](./docs/AGENTS_ECOSYSTEM.md)**

---

## 🛡️ Integridade de Dados & Grounding

O LeakFinder opera sob o protocolo rigoroso estabelecido em **[`AGENTS.md`](./AGENTS.md)**:
* **Zero Alucinação:** URLs de produtos, SKUs e dados de grade vêm diretamente da API pública ou do DOM ao vivo.
* **Transparência de Métricas:** Valores projetados são explicitamente identificados com selo `[Simulador Dinâmico]`.
* **Respeito aos Limites de Privacidade:** Declara com honestidade quando uma métrica exige conexão com a API da Shopify Admin ou Clarity.

---

## 🚀 Como Executar o Projeto

## 📚 Documentação Central & Governança

* 🏛️ **[Arquitetura Global & C4 Model (ARCHITECTURE.md)](./ARCHITECTURE.md)**
* 🤖 **[Dossiê Completo dos 18 Agentes (docs/AGENTS_ECOSYSTEM.md)](./docs/AGENTS_ECOSYSTEM.md)**
* 🧭 **[Fluxo de Projeto & Workflow dos Agentes (docs/PROJECT_WORKFLOW_AND_GOVERNANCE.md)](./docs/PROJECT_WORKFLOW_AND_GOVERNANCE.md)**
* 💼 **[Plano de Negócios & Pricing SaaS (docs/BUSINESS_PLAN_LEAKFINDER_SAAS.md)](./docs/BUSINESS_PLAN_LEAKFINDER_SAAS.md)**
* ⚖️ **[Conformidade Legal & Tributária (docs/LEGAL_AND_TAX_COMPLIANCE.md)](./docs/LEGAL_AND_TAX_COMPLIANCE.md)**
* 🎯 **[Campanha Piloto Outbound B2B (docs/DOSSIE_CAMPANHA_OUTBOUND_PILOTO.md)](./docs/DOSSIE_CAMPANHA_OUTBOUND_PILOTO.md)**
* 🛡️ **[Protocolo de Integridade de Dados (AGENTS.md)](./AGENTS.md)**

---

## 🛠️ Comandos de Engenharia & Qualidade

```bash
# Executa servidor de desenvolvimento local (Porta 3000)
npm run dev

# Validação estrita de lint e tipagem TypeScript
npm run check

# Bateria completa de 50 testes de segurança, SSRF e integridade
npm run audit:system

# Compilação e empacotamento de produção (Vite + Rollup)
npm run build
```

---

## 📦 Stack Tecnológica

* **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, FontAwesome, Canvas Confetti.
* **Build Tool:** Vite 8.2 & Rollup.
* **Linter & Qualidade:** Oxlint + TypeScript Compiler (`tsc`).
* **Database & Auth:** Supabase PostgreSQL.
* **Multi-threading & Scraping:** Web Workers (`siteInspectorWorker.ts`) + Chromium Headless em contêiner Docker.


---

<p align="center">
  Desenvolvido com foco em alta performance e integridade técnica.
</p>
