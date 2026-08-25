---
name: software-architecture
description: >-
  Expert guidelines and design patterns for scalable SaaS, Clean Architecture,
  resilient API scraping, strict TypeScript typing, and modular state management.
---

# 🏛️ Software Architecture Expert Skill

## 1. Core Principles
- **Clean Architecture & Domain Separation:** UI components must never perform direct raw fetches without going through dedicated service layers (`services/`).
- **Resilience & Graceful Degradation:** All external network calls (Jina AI, Google PSI, Shopify APIs) must implement timeout controllers, abort signals, and non-blocking fallbacks.
- **Zero Hallucination Policy:** Every data point displayed (product titles, URLs, SKUs, prices) must be extracted from actual DOM or live API responses. Never generate synthetic slugs that cause 404 errors.
- **Strict Typing:** All interfaces in `types/index.ts` must maintain strict field consistency without loose `any` casts.

## 2. High Performance Standards
- **DOM Parsing:** Use single-pass parsing with cached selectors.
- **Image & Bundle Optimization:** Prefer WebP/AVIF formats, ensure chunk size remains under 800 KB, and code-split heavy components where needed.
- **State Flow:** Keep state unidirectional and use memoization or callbacks for heavy computations.
