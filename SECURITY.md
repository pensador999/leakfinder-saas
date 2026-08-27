# 🛡️ SECURITY & COMPLIANCE POLICY (LEAKFINDER SAAS)

## 🏛️ 1. Security Architecture Overview
LeakFinder SaaS implements **Defense-in-Depth** across all layers of the application stack:

```mermaid
graph TD
    A[Client Web / Mobile] -->|TLS 1.3 HTTPS| B[Cloudflare Edge Firewall & DDoS Shield]
    B --> C[Vite / React 19 Frontend SPA]
    C -->|AES-256 Auth & Strict RLS| D[Supabase PostgreSQL Database]
    C -->|Read-Only Edge Calls| E[Jina AI Edge Reader Tier 2]
    C -->|Encrypted OAuth Tokens| F[Shopify / Meta Read-Only APIs]
```

---

## 🔒 2. Data Grounding & Privacy Guarantees

1. **Read-Only API Scopes:** LeakFinder NEVER requests write or modify permissions for connected stores. All integrations operate exclusively under `read_orders`, `read_products`, and `ads_read`.
2. **Encryption in Transit & at Rest:** All sensitive tokens and payloads are encrypted using AES-256 and transmitted over TLS 1.3.
3. **Multi-Tenant Isolation:** Database access is strictly governed by PostgreSQL Row Level Security (`database/schema.sql`). No tenant can access another tenant's audit reports or credentials.
4. **LGPD & GDPR Compliance:** Dedicated DPO contact channel (`dpo@leakfinder.ai`), automated user data deletion, and transparent cookie consent.

---

## 🚨 3. Vulnerability Disclosure Policy
Security researchers and buyers can report vulnerabilities to `security@leakfinder.ai`. All valid disclosures will be acknowledged within 24 hours.
