#!/usr/bin/env bash
# ==============================================================================
# 🚀 ADSHIELD OS — 1-CLICK VPS DEPLOYMENT & PROVISIONING SCRIPT (UBUNTU 24.04 LTS)
# ==============================================================================
# Uso na VPS recém-criada:
# curl -fsSL https://raw.githubusercontent.com/.../setup_vps_ubuntu.sh | bash
# ou clone o repositório e execute:
# chmod +x scripts/deploy/setup_vps_ubuntu.sh && ./scripts/deploy/setup_vps_ubuntu.sh
# ==============================================================================

set -e

echo "=========================================================================="
echo "🛡️ INICIANDO PROVISIONAMENTO AUTOMÁTICO ADSHIELD OS EM UBUNTU 24.04 LTS"
echo "=========================================================================="

# 1. Verificar se é root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Por favor, execute como root ou utilize sudo: sudo bash $0"
  exit 1
fi

# 2. Atualizar sistema operacional
echo "\n📦 [1/6] Atualizando pacotes do sistema Ubuntu..."
apt-get update -y && apt-get upgrade -y
apt-get install -y ca-certificates curl gnupg lsb-release git ufw fail2ban htop

# 3. Configurar 4GB de memória Swap (Anti-OOM para Chromium Headless)
echo "\n🧠 [2/6] Configurando 4GB de Swapfile de contingência..."
if [ ! -f /swapfile ]; then
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  echo "vm.swappiness=10" >> /etc/sysctl.conf
  sysctl -p
  echo "✅ 4GB de Swap ativado com sucesso!"
else
  echo "ℹ️ Swapfile já existente. Mantendo configuração."
fi

# 4. Instalar Docker Engine Oficial e Docker Compose Plugin
echo "\n🐳 [3/6] Instalando Docker Engine Oficial..."
if ! command -v docker &> /dev/null; then
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
  chmod a+r /etc/apt/keyrings/docker.asc

  echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
    $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    tee /etc/apt/sources.list.d/docker.list > /dev/null

  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  systemctl enable docker
  systemctl start docker
  echo "✅ Docker instalado com sucesso: $(docker --version)"
else
  echo "ℹ️ Docker já está instalado: $(docker --version)"
fi

# 5. Configurar Firewall UFW
echo "\n🛡️ [4/6] Configurando Firewall UFW de Produção..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp comment 'SSH'
ufw allow 80/tcp comment 'HTTP Nginx'
ufw allow 443/tcp comment 'HTTPS SSL'
ufw --force enable
echo "✅ Firewall UFW ativado (Portas 22, 80 e 443 liberadas)!"

# 6. Build e Subida dos Contêineres
echo "\n🚀 [5/6] Construindo e iniciando a stack de contêineres Docker..."
cd "$(dirname "$0")/../.." # Navega para a raiz do repositório
docker compose down || true
docker compose build --pull
docker compose up -d

# 7. Verificação de Saúde
echo "\n🩺 [6/6] Verificando status dos serviços..."
sleep 5
docker compose ps

echo "\n=========================================================================="
echo "🎉 ADSHIELD OS INSTALADO E OPERACIONAL NA VPS!"
echo "=========================================================================="
echo "🌐 Acesso Web: http://$(curl -s ifconfig.me)"
echo "🤖 Healthcheck API: http://$(curl -s ifconfig.me):3001/healthz"
echo "📜 Logs em Tempo Real: docker compose logs -f"
echo "=========================================================================="
