---
name: autonomous-agent-orchestrator
description: >-
  Coordena enxames de agentes autônomos, gerencia background tasks assíncronas,
  dispara rotinas de cron agendadas, delega tarefas para subagentes especializados
  e unifica a comunicação inter-agentes no AdShield.
---

# 🤖 Autonomous Agent Orchestration Skill

## 🎯 Context & Purpose
Esta skill é acionada para gerenciar equipes de múltiplos agentes de IA trabalhando em paralelo, orquestrar tarefas assíncronas em segundo plano (background tasks), delegar investigações complexas a subagentes via `invoke_subagent` e coordenar o ciclo diário de auditoria contínua (ex: despertador das 07:00).

## ⚡ Activation Triggers
- "orquestre o time de agentes para executar X"
- "rode essa varredura em segundo plano"
- "delegue essa pesquisa para um subagente especializado"
- "configure o cron job do enxame para monitoramento"
- "gerencie os workers concorrentes do LeakFinder"

## ⚙️ Operational Guidelines

### 1. Divisão e Conquista (Parallel Subagents)
- Quando uma tarefa envolver múltiplas lojas ou auditorias independentes, divida a carga entre subagentes especializados (`research`, auditor de código, analista de tráfego).
- Utilize `invoke_subagent` com papéis bem definidos e prompts com critérios objetivos de aceite.
- Deixe o sistema reagir reativamente aos eventos de conclusão sem recorrer a loops de espera vazios (pollings manuais).

### 2. Monitoramento de Tarefas em Segundo Plano (Background Tasks)
- Ao executar builds, compilações pesadas ou testes extensivos, configure `WaitMsBeforeAsync` adequadamente.
- Utilize `manage_task` para verificar status e gerenciar a fila quando necessário.

### 3. Orquestração Diária (Cron & Triggers)
- Estruture disparos pontuais ou recorrentes utilizando `schedule` para que os agentes acordem no horário comercial (ex: 07:00) e realizem as varreduras de estoque matinais antes da abertura das lojas.
