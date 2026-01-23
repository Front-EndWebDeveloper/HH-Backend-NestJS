#!/bin/bash

# Server initialization script for HH Backend
# Run this script on a fresh Ubuntu 22.04 EC2 instance
# Usage: sudo bash scripts/setup-server.sh

set -e

echo "🚀 Starting server setup for HH Backend..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Update system
echo "📦 Updating system packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y

# Install essential packages
echo "📦 Installing essential packages..."
apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban

# Install Node.js 20.x
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ Node.js $NODE_VERSION installed${NC}"
echo -e "${GREEN}✓ npm $NPM_VERSION installed${NC}"

# Install PM2 globally
echo "📦 Installing PM2..."
npm install -g pm2

# Install PostgreSQL
echo "📦 Installing PostgreSQL..."
sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
apt-get update
apt-get install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
systemctl start postgresql
systemctl enable postgresql

# Install Nginx
echo "📦 Installing Nginx..."
apt-get install -y nginx

# Start and enable Nginx
systemctl start nginx
systemctl enable nginx

# Install Certbot for SSL
echo "📦 Installing Certbot..."
apt-get install -y certbot python3-certbot-nginx

# Configure UFW Firewall
echo "🔥 Configuring firewall..."
ufw --force enable
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw reload

echo -e "${GREEN}✓ Firewall configured${NC}"

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/hh-backend
mkdir -p /var/www/hh-backend/logs
mkdir -p /var/backups/hh-backend
chown -R $SUDO_USER:$SUDO_USER /var/www/hh-backend
chown -R $SUDO_USER:$SUDO_USER /var/backups/hh-backend

echo -e "${GREEN}✓ Application directory created${NC}"

# Setup PM2 to start on boot
echo "⚙️  Configuring PM2 startup..."
pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER

echo ""
echo -e "${GREEN}✅ Server setup completed successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. Run scripts/setup-postgres.sh to configure PostgreSQL"
echo "2. Clone your repository to /var/www/hh-backend"
echo "3. Create .env file from .env.example"
echo "4. Install dependencies: npm ci"
echo "5. Build application: npm run build"
echo "6. Start with PM2: pm2 start ecosystem.config.js"
echo "7. Configure Nginx (see DEPLOYMENT.md)"
echo "8. Setup SSL with Certbot"

