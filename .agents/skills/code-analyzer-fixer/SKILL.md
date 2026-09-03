---
name: code-analyzer-fixer
description: >-
  Audita sistematicamente a base de código do projeto, identifica bugs críticos,
  gargalos de performance, falhas de segurança e code smells, e aplica correções
  diretas e automáticas nos arquivos com validação de build e testes.
---

# 🛠️ Code Analyzer & Auto-Fixer Skill

## 🎯 Context & Purpose
Esta skill é ativada sempre que o usuário solicitar uma análise de código, revisão de bugs, refatoração estrutural ou auditoria contínua de qualidade de software. O objetivo é analisar rigorosamente os arquivos do projeto, diagnosticar falhas de lógica, tipos ou runtime e **aplicar a correção diretamente no código**, validando a compilação com `npm run build` ou `tsc --noEmit`.

## ⚡ Activation Triggers
- "analise o código e corrija os erros"
- "faça uma revisão e conserte os bugs do arquivo X"
- "refatore e aplique melhorias no código"
- "auditoria de código com correção automática"
- "limpe o código, otimize a performance e valide o build"

## 🔍 Operational Guidelines

### Fase 1: Análise Estrita em 4 Pilares
1. **Critical Bugs:**
   - Erros de TypeScript/JavaScript, imports inexistentes, valores `undefined` não tratados e referências nulas.
   - Discrepâncias de tipos entre os componentes e as interfaces de `types/index.ts`.
2. **Performance & Bundle:**
   - Loops assíncronos ineficientes, re-renders desnecessários no React e falta de memoização em cálculos pesados.
   - Chunks que ultrapassam o limite recomendado pelo bundler Vite/Rolldown.
3. **Security & Grounding:**
   - Proibição absoluta de dados fabricados ou números inventados (Regra `AGENTS.md`).
   - Proteção de variáveis sensíveis e tokens de API no frontend.
4. **Code Smells & Clean Architecture:**
   - Componentes gigantes sem divisão de responsabilidades.
   - Falta de fallbacks defensivos em chamadas de rede externas.

### Fase 2: Diagnóstico Executivo Direto
- Apresente um resumo executivo objetivo dos problemas encontrados com marcadores claros antes de executar o patch:
  - `🔴 Crítico`: Erros de runtime ou build.
  - `🟡 Otimização`: Performance, re-renders e redução de bundle.
  - `🟢 Arquitetura`: Tipagem TypeScript e separação de camadas.

### Fase 3: Auto-Fix Imediato (Correção Direta no Arquivo)
- **Não apenas sugira o código:** Utilize as ferramentas de edição para reescrever e corrigir o arquivo imediatamente.
- Mantenha estritamente a compatibilidade com os outros componentes do ecossistema.
- Execute imediatamente os comandos de validação no terminal:
  - `npx tsc --project tsconfig.app.json --noEmit`
  - `npm run build`
- Garanta **Zero Erros** e **Zero Warnings Bloqueantes** antes de concluir a tarefa.

## 💡 Exemplos de Refatoração Obrigatória

```typescript
// ❌ RUIM: Tratamento frouxo, risco de runtime error e dados inventados
const brokenCount = issues.length || 3; // Fallback inventado viola Rule 1!
const product = issues[0];
const title = product.productTitle; // Quebra se issues[0] for undefined

// ✅ BOM: Tipagem defensiva, grounded e sem alucinação
const brokenCount = issues.filter(i => !i.isFullPrintExempt && i.missingSizes.length > 0).length;
const product = issues[0] ?? null;
const title = product?.productTitle || 'Produto Auditado';
```
