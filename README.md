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

## 🤖 Esquadrão de 8 Agentes Especialistas

| Agente | Especialidade | Entregáveis Principais |
| :--- | :--- | :--- |
| 📦 **Doctor de Catálogo** | SKUs & Grade de Tamanhos | Auditoria de grade `PP ao G2`, regra `_FULL`, fotos e widget de medidas. |
| 👁️ **Visão Computacional** | Eye-Tracking & Saliência | Mapas de calor, contraste WCAG 2.1 AAA e ergonomia de polegar (48px). |
| 📊 **Telemetria & Clarity** | Comportamento do Usuário | Deep links de rage clicks e tabela de perda financeira por SKU furado. |
| 💻 **Gerador de Scripts** | Remediação Automática | Códigos prontos (.liquid/CSS) para Sticky Buy Button, Pix 10% e Tabnabbing. |
| 🛡️ **Segurança & Legal** | Conformidade Brasileira | Auditoria de CNPJ no rodapé, CDC Art. 49 e LGPD. |
| 🎯 **Arquiteto de CRO** | Funis de Conversão | Fórmulas de lift de receita e fricção de checkout. |
| 📈 **Mídia Paga (Ads)** | Gestão de Tráfego | Simulador de verba e divisão técnica de funil (60/25/15). |
| 🕵️ **Espião de Rivais** | Benchmarking Competitivo | Comparativo de velocidade, frete e vitrines contra marcas concorrentes. |

---

## 🛡️ Integridade de Dados & Grounding

O LeakFinder opera sob o protocolo rigoroso estabelecido em **[`AGENTS.md`](./AGENTS.md)**:
* **Zero Alucinação:** URLs de produtos, SKUs e dados de grade vêm diretamente da API pública ou do DOM ao vivo.
* **Transparência de Métricas:** Valores projetados são explicitamente identificados com selo `[Simulador Dinâmico]`.
* **Respeito aos Limites de Privacidade:** Declara com honestidade quando uma métrica exige conexão com a API da Shopify Admin ou Clarity.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* Node.js 18+ instalado
* Git

### Instalação e Execução Local
```bash
# 1. Clone o repositório
git clone https://github.com/pensador999/leakfinder-saas.git

# 2. Acesse a pasta do projeto
cd leakfinder-saas

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **`http://localhost:3000`** no seu navegador.

---

## 📦 Stack Tecnológica

* **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti.
* **Build Tool:** Vite 8.2.
* **Database & Auth:** Supabase PostgreSQL.
* **Multi-threading:** Web Workers (`siteInspectorWorker.ts`).

---

<p align="center">
  Desenvolvido com foco em alta performance e integridade técnica.
</p>
