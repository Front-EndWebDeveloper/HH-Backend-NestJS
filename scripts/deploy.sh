#!/bin/bash

# Manual deployment script for HH Backend
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Warning: .env file not found. Please create it from .env.example${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment check passed${NC}"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build application
echo "🔨 Building application..."
npm run build

# Run database migrations (if typeorm CLI is available)
if command -v typeorm &> /dev/null || npm list -g typeorm &> /dev/null; then
    echo "🗄️  Running database migrations..."
    npm run typeorm migration:run || echo "No migrations to run"
else
    echo -e "${YELLOW}⚠ TypeORM CLI not found. Skipping migrations.${NC}"
fi

# Reload PM2
if command -v pm2 &> /dev/null; then
    echo "🔄 Reloading PM2..."
    pm2 reload ecosystem.config.js --update-env
    echo -e "${GREEN}✓ Application reloaded${NC}"
    pm2 status
else
    echo -e "${YELLOW}⚠ PM2 not found. Please start the application manually.${NC}"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

