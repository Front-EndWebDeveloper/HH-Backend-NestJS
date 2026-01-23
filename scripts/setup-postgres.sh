#!/bin/bash

# PostgreSQL setup script for HH Backend
# Run this script after setup-server.sh
# Usage: sudo bash scripts/setup-postgres.sh

set -e

echo "🗄️  Setting up PostgreSQL for HH Backend..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration (modify these as needed)
DB_NAME="${DB_NAME:-hh_backend}"
DB_USER="${DB_USER:-hh_backend_user}"

# Generate secure password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

echo "📝 Database Configuration:"
echo "   Database Name: $DB_NAME"
echo "   Database User: $DB_USER"
echo "   Database Password: $DB_PASSWORD"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Save this password! You'll need it for your .env file.${NC}"
echo ""

# Switch to postgres user and create database and user
sudo -u postgres psql <<EOF
-- Create database
CREATE DATABASE $DB_NAME;

-- Create user
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Grant schema privileges (for TypeORM)
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

\q
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database and user created successfully!${NC}"
    echo ""
    echo "Add these to your .env file:"
    echo "DB_HOST=localhost"
    echo "DB_PORT=5432"
    echo "DB_USERNAME=$DB_USER"
    echo "DB_PASSWORD=$DB_PASSWORD"
    echo "DB_NAME=$DB_NAME"
    echo "DB_SYNCHRONIZE=false"
    echo "DB_MIGRATIONS_RUN=true"
    echo ""
    
    # Configure pg_hba.conf for local connections
    echo "⚙️  Configuring PostgreSQL access..."
    
    # Backup pg_hba.conf
    cp /etc/postgresql/*/main/pg_hba.conf /etc/postgresql/*/main/pg_hba.conf.backup
    
    # Ensure local connections use md5 (password authentication)
    sed -i 's/local   all             all                                     peer/local   all             all                                     md5/' /etc/postgresql/*/main/pg_hba.conf
    
    # Restart PostgreSQL
    systemctl restart postgresql
    
    echo -e "${GREEN}✅ PostgreSQL configured and restarted${NC}"
    
    # Test connection
    echo "🧪 Testing database connection..."
    PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database connection test successful!${NC}"
    else
        echo -e "${RED}❌ Database connection test failed${NC}"
        exit 1
    fi
    
    # Setup backup cron job
    echo "📅 Setting up daily backup cron job..."
    CRON_CMD="0 2 * * * /var/www/hh-backend/scripts/backup-db.sh >> /var/log/hh-backend-backup.log 2>&1"
    (crontab -l 2>/dev/null | grep -v "backup-db.sh"; echo "$CRON_CMD") | crontab -
    
    echo -e "${GREEN}✅ Backup cron job configured (runs daily at 2 AM)${NC}"
    
else
    echo -e "${RED}❌ Failed to create database and user${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ PostgreSQL setup completed!${NC}"

