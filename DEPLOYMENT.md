# Complete AWS EC2 Deployment Guide for HH Backend

This guide provides step-by-step instructions for deploying the HH Backend NestJS application to AWS EC2 with PostgreSQL, Nginx, PM2, and automated CI/CD via GitHub Actions.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: AWS Infrastructure Setup](#phase-1-aws-infrastructure-setup)
4. [Phase 2: Server Configuration](#phase-2-server-configuration)
5. [Phase 3: Application Deployment](#phase-3-application-deployment)
6. [Phase 4: SSL Certificate Setup](#phase-4-ssl-certificate-setup)
7. [Phase 5: GitHub Actions CI/CD](#phase-5-github-actions-cicd)
8. [Phase 6: S3 File Storage Setup](#phase-6-s3-file-storage-setup)
9. [Troubleshooting](#troubleshooting)
10. [Maintenance & Operations](#maintenance--operations)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Internet Users                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │   CloudFlare/   │
            │   Route 53 DNS  │
            └────────┬─────────┘
                     │
                     ▼
            ┌─────────────────┐
            │   Elastic IP     │
            │  (Static IP)     │
            └────────┬─────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │    AWS EC2 Instance        │
        │   Ubuntu 22.04 LTS         │
        │                            │
        │  ┌──────────────────────┐  │
        │  │   Nginx (80/443)    │  │
        │  │   Reverse Proxy     │  │
        │  └──────────┬───────────┘  │
        │             │              │
        │  ┌──────────▼───────────┐  │
        │  │   PM2 Process       │  │
        │  │   NestJS App :3000  │  │
        │  └──────────┬───────────┘  │
        │             │              │
        │  ┌──────────▼───────────┐  │
        │  │   PostgreSQL 14+    │  │
        │  │   localhost:5432    │  │
        │  └─────────────────────┘  │
        └────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │   Amazon S3 Bucket         │
        │   File Storage             │
        └────────────────────────────┘
```

**Components:**
- **EC2**: Ubuntu 22.04 LTS (t3.small or t3.medium recommended)
- **PostgreSQL**: 14+ running on EC2
- **NestJS**: Running on port 3000 (internal)
- **Nginx**: Reverse proxy on ports 80/443
- **PM2**: Process manager for zero-downtime deployments
- **S3**: File storage bucket
- **GitHub Actions**: Automated CI/CD pipeline

---

## Prerequisites

- AWS Account with appropriate permissions
- Domain name (for SSL certificate)
- GitHub account and repository access
- Basic knowledge of Linux command line
- SSH client installed locally

---

## Phase 1: AWS Infrastructure Setup

### Step 1.1: Install and Configure AWS CLI

**Windows:**
```powershell
# Download AWS CLI v2 installer
# Visit: https://awscli.amazonaws.com/AWSCLIV2.msi
# Or use winget:
winget install Amazon.AWSCLI

# Verify installation
aws --version
```

**macOS:**
```bash
# Install via Homebrew
brew install awscli

# Or download from: https://awscli.amazonaws.com/AWSCLIV2.pkg
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Configure AWS CLI:**
```bash
aws configure
```

You'll be prompted for:
- **AWS Access Key ID**: Get from AWS IAM Console
- **AWS Secret Access Key**: Get from AWS IAM Console
- **Default region**: e.g., `us-east-1`
- **Default output format**: `json`

**Verify Configuration:**
```bash
aws sts get-caller-identity
```

### Step 1.2: Create Security Group

```bash
# Create security group
aws ec2 create-security-group \
    --group-name hh-backend-sg \
    --description "Security group for HH Backend application" \
    --region us-east-1

# Note the GroupId from output, then:
SECURITY_GROUP_ID="sg-xxxxxxxxx"  # Replace with actual ID

# Allow SSH (port 22)
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0 \
    --region us-east-1

# Allow HTTP (port 80)
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0 \
    --region us-east-1

# Allow HTTPS (port 443)
aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0 \
    --region us-east-1
```

### Step 1.3: Create SSH Key Pair

```bash
# Create key pair
aws ec2 create-key-pair \
    --key-name hh-backend-keypair \
    --query 'KeyMaterial' \
    --output text > hh-backend-keypair.pem \
    --region us-east-1

# Set proper permissions (Linux/macOS)
chmod 400 hh-backend-keypair.pem

# Windows: Right-click file → Properties → Security → Remove all users except yourself
```

**Save the key file securely!** You'll need it to SSH into the server.

### Step 1.4: Launch EC2 Instance

```bash
# Get Ubuntu 22.04 AMI ID (us-east-1)
AMI_ID="ami-0c55b159cbfafe1f0"  # Ubuntu 22.04 LTS

# Launch instance
aws ec2 run-instances \
    --image-id $AMI_ID \
    --instance-type t3.small \
    --key-name hh-backend-keypair \
    --security-group-ids $SECURITY_GROUP_ID \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=hh-backend}]' \
    --region us-east-1

# Note the InstanceId from output
INSTANCE_ID="i-xxxxxxxxx"  # Replace with actual ID

# Wait for instance to be running
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region us-east-1

# Get public IP
aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text \
    --region us-east-1
```

### Step 1.5: Allocate Elastic IP (Recommended)

```bash
# Allocate Elastic IP
aws ec2 allocate-address \
    --domain vpc \
    --region us-east-1

# Note the AllocationId from output
ALLOCATION_ID="eipalloc-xxxxxxxxx"  # Replace with actual ID

# Associate Elastic IP with instance
aws ec2 associate-address \
    --instance-id $INSTANCE_ID \
    --allocation-id $ALLOCATION_ID \
    --region us-east-1

# Get Elastic IP
aws ec2 describe-addresses \
    --allocation-ids $ALLOCATION_ID \
    --query 'Addresses[0].PublicIp' \
    --output text \
    --region us-east-1
```

**Update your domain's A record to point to this Elastic IP.**

### Step 1.6: Create S3 Bucket

```bash
# Create S3 bucket (bucket names must be globally unique)
BUCKET_NAME="hh-backend-uploads-$(date +%s)"  # Add timestamp for uniqueness

aws s3 mb s3://$BUCKET_NAME --region us-east-1

# Enable versioning (optional but recommended)
aws s3api put-bucket-versioning \
    --bucket $BUCKET_NAME \
    --versioning-configuration Status=Enabled \
    --region us-east-1

# Block public access (security best practice)
aws s3api put-public-access-block \
    --bucket $BUCKET_NAME \
    --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
    --region us-east-1
```

### Step 1.7: Create IAM User for S3 Access

```bash
# Create IAM user
aws iam create-user --user-name hh-backend-s3-user

# Create access key
aws iam create-access-key --user-name hh-backend-s3-user

# Note the AccessKeyId and SecretAccessKey - you'll need these for .env

# Create policy for S3 access
cat > s3-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::${BUCKET_NAME}",
                "arn:aws:s3:::${BUCKET_NAME}/*"
            ]
        }
    ]
}
EOF

# Create policy
aws iam create-policy \
    --policy-name hh-backend-s3-policy \
    --policy-document file://s3-policy.json

# Note the PolicyArn from output, then attach to user
POLICY_ARN="arn:aws:iam::ACCOUNT_ID:policy/hh-backend-s3-policy"  # Replace ACCOUNT_ID

aws iam attach-user-policy \
    --user-name hh-backend-s3-user \
    --policy-arn $POLICY_ARN
```

---

## Phase 2: Server Configuration

### Step 2.1: SSH into Server

```bash
# Linux/macOS
ssh -i hh-backend-keypair.pem ubuntu@YOUR_ELASTIC_IP

# Windows (PowerShell)
ssh -i hh-backend-keypair.pem ubuntu@YOUR_ELASTIC_IP
```

### Step 2.2: Run Server Setup Script

```bash
# Clone repository (temporarily, to get scripts)
cd /tmp
git clone https://github.com/Front-EndWebDeveloper/HH-Backend-NestJS.git
cd HH-Backend-NestJS

# Make scripts executable
chmod +x scripts/*.sh

# Run server setup (requires sudo)
sudo bash scripts/setup-server.sh
```

This script installs:
- Node.js 20.x
- PostgreSQL 14+
- Nginx
- PM2
- Certbot
- UFW firewall
- Essential system packages

### Step 2.3: Configure PostgreSQL

```bash
# Run PostgreSQL setup script
sudo bash scripts/setup-postgres.sh
```

**Important:** Save the database password that's displayed! You'll need it for your `.env` file.

The script:
- Creates database and user
- Sets secure password
- Configures local access
- Sets up daily backup cron job

### Step 2.4: Configure Firewall

The setup script configures UFW, but verify:

```bash
# Check firewall status
sudo ufw status

# Should show:
# Status: active
# 22/tcp    ALLOW
# 80/tcp    ALLOW
# 443/tcp   ALLOW
```

---

## Phase 3: Application Deployment

### Step 3.1: Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www/hh-backend
sudo chown -R $USER:$USER /var/www/hh-backend

# Clone repository
cd /var/www
git clone https://github.com/Front-EndWebDeveloper/HH-Backend-NestJS.git hh-backend
cd hh-backend
```

### Step 3.2: Create Environment File

```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env
```

**Required Environment Variables:**

```bash
# Application
NODE_ENV=production
PORT=3000
API_PREFIX=v1/api

# Database (from setup-postgres.sh output)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=hh_backend_user
DB_PASSWORD=your_password_from_setup_script
DB_NAME=hh_backend
DB_SYNCHRONIZE=false
DB_LOGGING=false
DB_MIGRATIONS_RUN=true

# JWT (generate secure secrets)
JWT_SECRET=your_32_character_secret_here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_32_character_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=30d

# Email (configure with your SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Health Hub

# URLs (replace with your domain)
EMAIL_VERIFICATION_URL=https://yourdomain.com/verify-email
EMAIL_PASSWORD_RESET_URL=https://yourdomain.com/reset-password
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# AWS S3 (from Phase 1.6 and 1.7)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET_NAME=your_bucket_name
STORAGE_TYPE=s3
```

**Generate JWT Secrets:**
```bash
# On server, generate secure secrets
openssl rand -base64 32
```

**Secure the .env file:**
```bash
chmod 600 .env
```

### Step 3.3: Install Dependencies and Build

```bash
# Install dependencies
npm ci --production

# Build application
npm run build
```

### Step 3.4: Run Database Migrations

If you have migrations:
```bash
# TypeORM migrations (if configured)
npm run typeorm migration:run
```

### Step 3.5: Start with PM2

```bash
# Start application
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Check status
pm2 status
pm2 logs hh-backend
```

---

## Phase 4: SSL Certificate Setup

### Step 4.1: Configure Nginx

```bash
# Copy Nginx configuration
sudo cp nginx/hh-backend.conf /etc/nginx/sites-available/hh-backend

# Edit configuration (replace yourdomain.com)
sudo nano /etc/nginx/sites-available/hh-backend

# Create symlink
sudo ln -s /etc/nginx/sites-available/hh-backend /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 4.2: Obtain SSL Certificate

```bash
# Replace yourdomain.com with your actual domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)
```

Certbot will automatically:
- Obtain certificate
- Configure Nginx
- Set up auto-renewal

### Step 4.3: Verify Auto-Renewal

```bash
# Test renewal
sudo certbot renew --dry-run

# Check renewal timer
systemctl status certbot.timer
```

---

## Phase 5: GitHub Actions CI/CD

### Step 5.1: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

1. **EC2_HOST**: Your Elastic IP or domain name
2. **EC2_USERNAME**: `ubuntu` (or your SSH user)
3. **EC2_SSH_KEY**: Contents of your `hh-backend-keypair.pem` file
4. **EC2_SSH_PORT**: `22` (default)

**To get SSH key content:**
```bash
# On your local machine
cat hh-backend-keypair.pem
# Copy entire output including -----BEGIN RSA PRIVATE KEY----- and -----END RSA PRIVATE KEY-----
```

### Step 5.2: Test Deployment

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is already configured. It will:

1. Build on push to `master` or `main` branch
2. Run linter
3. Build application
4. Deploy to EC2 via SSH
5. Pull latest code
6. Install dependencies
7. Build application
8. Run migrations
9. Reload PM2 (zero-downtime)

**Trigger deployment:**
```bash
# Push to master/main branch
git push origin master
```

Monitor deployment in GitHub → Actions tab.

---

## Phase 6: S3 File Storage Setup

### Step 6.1: Verify S3 Configuration

The application is already configured to use S3. Ensure your `.env` has:

```bash
STORAGE_TYPE=s3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET_NAME=your_bucket_name
```

### Step 6.2: Test File Upload

After deployment, test file upload functionality through your API endpoints.

---

## Troubleshooting

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs hh-backend

# Check application logs
tail -f /var/www/hh-backend/logs/pm2-error.log

# Check if port 3000 is in use
sudo netstat -tulpn | grep 3000

# Restart PM2
pm2 restart hh-backend
```

### Database Connection Issues

```bash
# Test PostgreSQL connection
sudo -u postgres psql -c "\l"

# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
sudo -u postgres psql -c "SELECT datname FROM pg_database;"

# Test connection with app credentials
PGPASSWORD=your_password psql -h localhost -U hh_backend_user -d hh_backend -c "SELECT version();"
```

### Nginx Issues

```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/hh-backend-error.log

# Check access logs
sudo tail -f /var/log/nginx/hh-backend-access.log

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Check certificate expiration
sudo certbot certificates

# Renew certificate manually
sudo certbot renew

# Check Nginx SSL configuration
sudo nginx -T | grep ssl
```

### GitHub Actions Deployment Fails

1. **SSH Connection Issues:**
   - Verify EC2_HOST, EC2_USERNAME, EC2_SSH_KEY secrets
   - Check security group allows SSH from GitHub Actions IPs
   - Test SSH manually: `ssh -i key.pem ubuntu@YOUR_IP`

2. **Permission Issues:**
   - Ensure `/var/www/hh-backend` is owned by correct user
   - Check file permissions: `ls -la /var/www/hh-backend`

3. **Build Failures:**
   - Check GitHub Actions logs
   - Verify all dependencies in package.json
   - Test build locally: `npm run build`

### PM2 Zero-Downtime Reload Issues

```bash
# Check PM2 status
pm2 status

# Check if app is listening
pm2 logs hh-backend --lines 50

# Manual reload
pm2 reload hh-backend

# If reload fails, restart
pm2 restart hh-backend
```

### High Memory Usage

```bash
# Check PM2 memory usage
pm2 monit

# Restart if needed
pm2 restart hh-backend

# Adjust max_memory_restart in ecosystem.config.js if needed
```

---

## Maintenance & Operations

### Daily Backups

Database backups run automatically via cron (configured in `setup-postgres.sh`):
- **Location**: `/var/backups/hh-backend/`
- **Schedule**: Daily at 2 AM
- **Retention**: 7 days (configurable in `scripts/backup-db.sh`)

**Manual Backup:**
```bash
cd /var/www/hh-backend
bash scripts/backup-db.sh
```

### Application Updates

**Automatic (via GitHub Actions):**
- Push to `master`/`main` branch triggers deployment

**Manual:**
```bash
cd /var/www/hh-backend
git pull origin master
npm ci --production
npm run build
pm2 reload ecosystem.config.js
```

### Monitoring

```bash
# PM2 Monitoring
pm2 monit

# Check application status
pm2 status

# View logs
pm2 logs hh-backend

# System resources
htop
df -h
free -h
```

### Log Management

```bash
# PM2 logs location
/var/www/hh-backend/logs/

# Nginx logs
/var/log/nginx/hh-backend-access.log
/var/log/nginx/hh-backend-error.log

# System logs
journalctl -u nginx
journalctl -u postgresql
```

### Scaling Considerations

For production with higher traffic:
1. Upgrade EC2 instance type (t3.medium → t3.large)
2. Add CloudFront CDN for static assets
3. Consider RDS for database (separate from EC2)
4. Implement Redis for caching
5. Add Application Load Balancer for multiple instances

---

## Security Best Practices

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Regular security audits:**
   ```bash
   sudo apt install unattended-upgrades
   ```

3. **Monitor logs for suspicious activity:**
   ```bash
   sudo tail -f /var/log/auth.log
   ```

4. **Use strong passwords:**
   - Database passwords
   - JWT secrets
   - Email passwords

5. **Restrict SSH access:**
   - Use key-based authentication only
   - Consider changing SSH port
   - Use fail2ban (installed by setup script)

6. **Regular backups:**
   - Database backups (automated)
   - Application code (Git repository)
   - Environment files (store securely)

---

## Cost Estimation

**Monthly costs (approximate):**
- EC2 t3.small: ~$15-20/month
- Elastic IP: Free (if attached to instance)
- S3 Storage: ~$0.023/GB/month
- Data Transfer: First 100GB free, then ~$0.09/GB
- **Total: ~$20-30/month** (for low to moderate traffic)

---

## Support & Resources

- **NestJS Documentation**: https://docs.nestjs.com
- **PM2 Documentation**: https://pm2.keymetrics.io/docs
- **Nginx Documentation**: https://nginx.org/en/docs/
- **AWS Documentation**: https://docs.aws.amazon.com
- **Let's Encrypt**: https://letsencrypt.org/docs/

---

## Quick Reference Commands

```bash
# Application
pm2 start ecosystem.config.js
pm2 stop hh-backend
pm2 restart hh-backend
pm2 reload hh-backend
pm2 logs hh-backend
pm2 status

# Database
sudo -u postgres psql
bash scripts/backup-db.sh

# Nginx
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl restart nginx

# SSL
sudo certbot renew
sudo certbot certificates

# Deployment
cd /var/www/hh-backend
git pull
npm ci --production
npm run build
pm2 reload ecosystem.config.js
```

---

**Last Updated**: January 2026
**Version**: 1.0.0

