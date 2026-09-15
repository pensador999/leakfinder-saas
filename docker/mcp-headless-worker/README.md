# 🐳 AdShield Cloud MCP Headless Worker (Docker & SSE)

Worker profissional e autônomo para inspeção e auditoria profunda de lojas virtuais via **Chromium Headless** com suporte oficial ao protocolo **Model Context Protocol (MCP)** sobre **Server-Sent Events (SSE)** e API REST.

---

## 🏗️ 1. Arquitetura do Worker

* **Base:** Node.js 20 (Debian Bookworm Slim) + Chromium Nativo do Linux.
* **Gerenciador de Processos:** `dumb-init` (previne processos zumbis de abas do Chromium).
* **Protocolos Suportados:**
  1. **MCP via SSE (`/sse` e `/messages`):** Conecta agentes de IA e clientes MCP em streaming bidirecional em tempo real.
  2. **REST API (`/health` e `/api/audit`):** Endpoint direto de alta performance para chamadas HTTP diretas do frontend ou backend.
* **Pool de Concorrência (`BrowserPool`):**
  - Limite ajustável de páginas simultâneas (padrão: 4).
  - Reciclagem automática do Chromium a cada 100 requisições para evitar vazamentos de memória (RAM).
  - Bloqueio inteligente de mídias pesadas (`.mp4`, `.woff2`) para economizar largura de banda e acelerar o FCP.

---

## 🚀 2. Como Rodar Localmente com Docker

### Passo 1: Build da Imagem
```bash
docker build -t adshield-mcp-worker ./docker/mcp-headless-worker
```

### Passo 2: Execução do Container
```bash
docker run -d \
  --name adshield-mcp-worker \
  -p 3001:3001 \
  -e PORT=3001 \
  -e MAX_CONCURRENT_PAGES=4 \
  -e MCP_API_KEY=sua-chave-secreta-mcp \
  --restart unless-stopped \
  adshield-mcp-worker
```

### Passo 3: Teste do Healthcheck
```bash
curl http://localhost:3001/health
```

---

## ☁️ 3. Deploy em Nuvem (1-Clique)

### Opção A: Deploy na Railway
1. Conecte seu repositório GitHub à [Railway.app](https://railway.app).
2. Selecione a pasta raiz como `docker/mcp-headless-worker` ou configure o **Dockerfile Path** para `docker/mcp-headless-worker/Dockerfile`.
3. Configure as variáveis de ambiente:
   - `PORT=3001`
   - `MCP_API_KEY=seu-token-super-seguro`
   - `MAX_CONCURRENT_PAGES=4`
4. A Railway gerará automaticamente uma URL pública HTTPS (ex: `https://adshield-worker.up.railway.app`).

### Opção B: Deploy no Fly.io
```bash
cd docker/mcp-headless-worker
fly launch --name adshield-mcp-worker
fly secrets set MCP_API_KEY="seu-token-super-seguro"
fly deploy
```

### Opção C: Deploy no Render
1. Crie um novo **Web Service** apontando para o repositório.
2. Ambiente: **Docker**.
3. Docker Context: `docker/mcp-headless-worker`.
4. Dockerfile Path: `docker/mcp-headless-worker/Dockerfile`.

---

## 📡 4. Especificação dos Endpoints

| Método | Rota | Descrição | Autenticação |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | Status de saúde, memória RAM (MB), uptime e conexões ativas do Chromium. | Pública |
| `GET` | `/sse` | Inicia stream SSE oficial do protocolo MCP. | `Bearer <MCP_API_KEY>` |
| `POST` | `/messages` | Envia mensagens e requisições JSON-RPC de ferramentas MCP. | `Bearer <MCP_API_KEY>` |
| `POST` | `/api/audit` | Auditoria direta de loja via REST. Body: `{"url": "https://loja.com.br", "includeScreenshot": true}` | `Bearer <MCP_API_KEY>` |

---

## 🛠️ 5. Ferramentas MCP Expostas pelo Worker

1. **`inspect_ecommerce_store`:**
   - Inspeciona o DOM hidratado da loja.
   - Detecta Meta Pixel (`fbq`), GTM, TikTok Pixel, GA4.
   - Analisa botões de compra, termos Pix e frete grátis.
   - Flagrante de furos de grade nos tamanhos M, G, GG, 40-42.
   - Minera WhatsApp e links de atendimento.
2. **`get_worker_health`:**
   - Retorna métricas do pool de navegação para a governança do enxame.
