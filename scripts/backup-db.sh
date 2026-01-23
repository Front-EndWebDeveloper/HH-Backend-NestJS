#!/bin/bash

# Database backup script for HH Backend
# Usage: ./scripts/backup-db.sh
# Recommended: Add to crontab for daily backups
# Example: 0 2 * * * /var/www/hh-backend/scripts/backup-db.sh

set -e

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/hh-backend}"
DB_NAME="${DB_NAME:-hh_backend}"
DB_USER="${DB_USERNAME:-hh_backend_user}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/hh_backend_${TIMESTAMP}.sql.gz"

echo "🗄️  Starting database backup..."
echo "Database: $DB_NAME"
echo "Backup file: $BACKUP_FILE"

# Perform backup
PGPASSWORD="$DB_PASSWORD" pg_dump -h localhost -U "$DB_USER" -d "$DB_NAME" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup completed successfully: $BACKUP_FILE"
    
    # Get backup size
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "📦 Backup size: $BACKUP_SIZE"
    
    # Remove old backups (older than RETENTION_DAYS)
    echo "🧹 Cleaning up old backups (older than $RETENTION_DAYS days)..."
    find "$BACKUP_DIR" -name "hh_backend_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
    echo "✅ Cleanup completed"
else
    echo "❌ Backup failed!"
    exit 1
fi

