---
name: production-scaling-devops
description: >-
  Diretrizes e automações para deploy contínuo, infraestrutura serverless na Vercel,
  integração com banco Supabase, políticas de cache, rate-limiting e otimização
  extrema de performance de borda para SaaS de alto tráfego.
---

# 🚀 Production Scaling & SaaS DevOps Skill

## 🎯 Context & Purpose
Esta skill governa a escalabilidade técnica do AdShield / LeakFinder como SaaS comercial. Garante que o aplicativo suporte milhares de auditorias simultâneas, execute rotinas Edge sem estouro de memória, mantenha conexões seguras com o Supabase e entregue o menor bundle size possível no carregamento inicial.

## ⚡ Activation Triggers
- "prepare o projeto para deploy de produção"
- "otimize a performance de carregamento e o tamanho do bundle"
- "configure ou valide as tabelas do Supabase"
- "audite a resiliência dos proxies e endpoints de borda"
- "implemente rate-limiting e proteção contra bloqueios"

## 🛡️ Operational Guidelines

### 1. Bundle Splitting & Otimização Vite
- Monitore o peso dos chunks gerados no `npm run build`.
- Implemente lazy loading (`React.lazy` e `Suspense`) para componentes pesados de modais e gráficos (Ex: Flowcharts, Modais de Checkout, Heatmaps visuais).
- Garanta que a página inicial (Home / Scanner) carregue em menos de 1 segundo em conexões 4G.

### 2. Resiliência de Proxies & Scrapers
- Toda chamada externa a sites de clientes deve utilizar o pool de proxies resilientes (`edgeProxyService.ts`), respeitando timeouts de 8s e fallbacks transparentes caso um nó sofra rate limit ou Cloudflare challenge.
- Nunca expor chaves de serviço do Supabase (`service_role`) no client-side.

### 3. Banco de Dados & Supabase
- Mantenha esquemas SQL versionados e índices adequados para consultas por domínio (`store_domain`) e status de alerta (`dispatch_status`).
