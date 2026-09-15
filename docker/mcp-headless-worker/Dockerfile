# ==============================================================================
# 🐳 ADSHIELD CLOUD MCP HEADLESS WORKER DOCKERFILE
# Node.js 20 + Chromium + Dumb-Init + Non-Root User + SSE Support
# Optimized for Railway, Fly.io, Render, AWS ECS, DigitalOcean & Docker Compose
# ==============================================================================

FROM node:20-bookworm-slim AS base

# 1. Instala Chromium nativo, fontes e bibliotecas gráficas do Linux
RUN apt-get update && apt-get install -y --no-install-recommends \
    chromium \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-freefont-ttf \
    libnss3 \
    libatk-bridge2.0-0 \
    libx11-xcb1 \
    libdrm2 \
    libxkbcommon0 \
    libasound2 \
    libgbm1 \
    dumb-init \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 2. Configura variáveis de ambiente do Puppeteer e Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium \
    CHROMIUM_PATH=/usr/bin/chromium \
    NODE_ENV=production \
    PORT=3001

WORKDIR /app

# 3. Instala dependências
COPY package*.json ./
RUN npm install

# 4. Copia código-fonte e compila TypeScript
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# 5. Remove dependências de compilação para reduzir tamanho da imagem
RUN npm prune --production

# 6. Permissões de usuário não-root para segurança
RUN chown -R node:node /app
USER node

EXPOSE 3001

# 7. Healthcheck contínuo do container
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# 8. Entrypoint com dumb-init para gerenciamento adequado de processos Chromium zumbis
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.js"]
