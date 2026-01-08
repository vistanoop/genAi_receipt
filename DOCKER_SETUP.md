# 🐳 Docker Setup Guide for SpendAhead

This guide will help you set up and run SpendAhead using Docker and Docker Compose.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup Instructions](#detailed-setup-instructions)
4. [Environment Configuration](#environment-configuration)
5. [Docker Commands Reference](#docker-commands-reference)
6. [Troubleshooting](#troubleshooting)
7. [Architecture](#architecture)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher

### Installation Links

- **Docker Desktop** (includes Docker Compose):
  - [Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [macOS](https://docs.docker.com/desktop/install/mac-install/)
  - [Linux](https://docs.docker.com/desktop/install/linux-install/)

- **Docker Engine** (Linux alternative):
  - [Installation Guide](https://docs.docker.com/engine/install/)

### Verify Installation

```bash
# Check Docker version
docker --version
# Expected output: Docker version 20.10.x or higher

# Check Docker Compose version
docker compose version
# Expected output: Docker Compose version v2.x.x or higher

# Verify Docker is running
docker ps
# Should show an empty list or running containers
```

---

## Quick Start

Get SpendAhead running with Docker in just 3 steps!

### Step 1: Clone the Repository

```bash
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt
```

### Step 2: Configure Environment Variables

```bash
# Copy the environment template
cp .env.docker.template .env

# Edit .env file with your values
# At minimum, you need to set:
# - GEMINI_API_KEY (get from https://makersuite.google.com/app/apikey)
# - JWT_SECRET (use a secure random string)
```

### Step 3: Start the Application

```bash
# Build and start all services
docker compose up -d

# Wait for services to be healthy (may take 1-2 minutes)
docker compose ps
```

### Access the Application

Once all services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **MongoDB**: localhost:27017

🎉 **That's it!** Your SpendAhead application is now running in Docker!

---

## Detailed Setup Instructions

### Architecture Overview

The Docker setup includes three main services:

```
┌─────────────────────────────────────────────┐
│  Docker Compose                             │
├─────────────────────────────────────────────┤
│                                             │
│  ┌──────────────┐   ┌──────────────┐      │
│  │  Frontend    │   │   Backend    │      │
│  │  Next.js     │──▶│   Express    │      │
│  │  Port: 3000  │   │   Port: 5000 │      │
│  └──────────────┘   └──────┬───────┘      │
│                             │               │
│                      ┌──────▼───────┐      │
│                      │   MongoDB    │      │
│                      │   Port: 27017│      │
│                      └──────────────┘      │
│                                             │
└─────────────────────────────────────────────┘
```

### Service Details

#### 1. MongoDB (Database)

- **Image**: mongo:8.0
- **Port**: 27017
- **Data Persistence**: Uses Docker volumes for persistent storage
- **Database Name**: spendahead

#### 2. Backend (Express API)

- **Built from**: ./backend/Dockerfile
- **Port**: 5000
- **Dependencies**: MongoDB
- **Health Check**: Monitors API availability

#### 3. Frontend (Next.js)

- **Built from**: ./Dockerfile
- **Port**: 3000
- **Dependencies**: Backend API, MongoDB
- **Environment**: Production optimized

### Building the Application

```bash
# Build all services (without starting)
docker compose build

# Build a specific service
docker compose build frontend
docker compose build backend

# Build with no cache (fresh build)
docker compose build --no-cache

# Build and start in one command
docker compose up --build
```

### Starting the Application

```bash
# Start all services in detached mode (background)
docker compose up -d

# Start and view logs in real-time
docker compose up

# Start specific services
docker compose up -d mongodb backend

# Start with automatic rebuild if code changed
docker compose up --build -d
```

### Stopping the Application

```bash
# Stop all services (keeps containers)
docker compose stop

# Stop and remove all containers
docker compose down

# Stop, remove containers, and delete volumes (ALL DATA LOST)
docker compose down -v

# Stop, remove containers, networks, and images
docker compose down --rmi all
```

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory with these variables:

```bash
# .env file

# Google Gemini AI API Key (REQUIRED)
GEMINI_API_KEY=AIza...your-actual-key

# JWT Secret (REQUIRED)
JWT_SECRET=generate-a-secure-random-string-here
```

### Generating a Secure JWT Secret

```bash
# Method 1: Using OpenSSL (recommended)
openssl rand -base64 32

# Method 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Method 3: Using Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env` file

### Optional Environment Variables

```bash
# Google OAuth (if using Google Sign-In)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Environment Files Location

```
genAi_receipt/
├── .env                    # Main environment file (create this)
├── .env.docker.template    # Template with examples
└── backend/
    └── .env                # Not needed with Docker (optional)
```

---

## Docker Commands Reference

### Viewing Logs

```bash
# View logs from all services
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View logs from a specific service
docker compose logs frontend
docker compose logs backend
docker compose logs mongodb

# Follow logs for specific service
docker compose logs -f backend

# View last 100 lines
docker compose logs --tail=100

# View logs with timestamps
docker compose logs -t
```

### Checking Service Status

```bash
# List all services and their status
docker compose ps

# Detailed information about services
docker compose ps -a

# Check if services are healthy
docker compose ps --format table
```

### Accessing Service Shells

```bash
# Access backend container shell
docker compose exec backend sh

# Access frontend container shell
docker compose exec frontend sh

# Access MongoDB shell
docker compose exec mongodb mongosh

# Run a one-off command
docker compose exec backend npm run dev
```

### Managing Data

```bash
# List volumes
docker volume ls

# Inspect a volume
docker volume inspect genai_receipt_mongodb_data

# Backup MongoDB data
docker compose exec mongodb mongodump --out=/data/backup

# Restore MongoDB data
docker compose exec mongodb mongorestore /data/backup
```

### Rebuilding Services

```bash
# Rebuild all services
docker compose build

# Rebuild specific service
docker compose build frontend

# Rebuild and restart
docker compose up --build -d

# Force rebuild without cache
docker compose build --no-cache
```

### Cleaning Up

```bash
# Remove stopped containers
docker compose rm

# Remove all stopped containers, networks, and orphan containers
docker compose down

# Remove everything including volumes (DELETES ALL DATA)
docker compose down -v

# Remove unused Docker resources system-wide
docker system prune

# Remove unused images
docker image prune

# Remove all unused containers, networks, images, and volumes
docker system prune -a --volumes
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue 1: Port Already in Use

**Problem**: Error message: "port is already allocated"

**Solution**:
```bash
# Check what's using the port
# On Linux/Mac:
lsof -i :3000
lsof -i :5000
lsof -i :27017

# On Windows:
netstat -ano | findstr :3000

# Kill the process or change port in docker-compose.yml
# To change ports, edit docker-compose.yml:
ports:
  - "3001:3000"  # Use 3001 instead of 3000
```

#### Issue 2: Services Not Starting

**Problem**: Services fail to start or exit immediately

**Solution**:
```bash
# Check logs for errors
docker compose logs backend

# Check service health
docker compose ps

# Restart specific service
docker compose restart backend

# Remove and recreate containers
docker compose down
docker compose up -d
```

#### Issue 3: MongoDB Connection Failed

**Problem**: Backend can't connect to MongoDB

**Solution**:
```bash
# Check if MongoDB is healthy
docker compose ps mongodb

# Check MongoDB logs
docker compose logs mongodb

# Verify network connectivity
docker compose exec backend ping mongodb

# Restart services in order
docker compose restart mongodb
docker compose restart backend
```

#### Issue 4: Environment Variables Not Working

**Problem**: GEMINI_API_KEY or other variables not being read

**Solution**:
```bash
# Verify .env file exists
ls -la .env

# Check if variables are set
docker compose config

# Rebuild with new environment variables
docker compose down
docker compose up --build -d

# Check environment inside container
docker compose exec backend env | grep GEMINI_API_KEY
```

#### Issue 5: Image Build Fails

**Problem**: Docker build fails with errors

**Solution**:
```bash
# Clean Docker build cache
docker builder prune

# Rebuild without cache
docker compose build --no-cache

# Check Docker disk space
docker system df

# Clean up unused resources
docker system prune -a
```

#### Issue 6: Container Keeps Restarting

**Problem**: Service container continuously restarts

**Solution**:
```bash
# Check why it's restarting
docker compose logs backend --tail=50

# Check container exit code
docker compose ps

# Remove health check temporarily (edit docker-compose.yml)
# Comment out healthcheck section and restart

# Check resource usage
docker stats
```

#### Issue 7: Can't Access Application from Browser

**Problem**: http://localhost:3000 not accessible

**Solution**:
```bash
# Verify containers are running
docker compose ps

# Check if ports are mapped correctly
docker compose port frontend 3000

# Test with curl
curl http://localhost:3000

# Check firewall settings
# Windows: Check Windows Firewall
# Mac: Check System Preferences > Security
# Linux: Check iptables/ufw

# Try using 127.0.0.1 instead of localhost
http://127.0.0.1:3000
```

#### Issue 8: Data Persists After Restart

**Problem**: Need to reset database completely

**Solution**:
```bash
# Stop and remove everything including volumes
docker compose down -v

# Verify volumes are deleted
docker volume ls

# Start fresh
docker compose up -d
```

### Health Check Verification

```bash
# Check if all services are healthy
docker compose ps

# Expected output should show (healthy) status:
# NAME                      STATUS
# spendahead-backend        Up (healthy)
# spendahead-frontend       Up
# spendahead-mongodb        Up (healthy)

# Manual health check
curl http://localhost:5000/api/health
```

### Performance Issues

```bash
# Check resource usage
docker stats

# Limit resources in docker-compose.yml:
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M

# Check Docker Desktop settings:
# Windows/Mac: Docker Desktop > Settings > Resources
```

---

## Production Deployment

### Building for Production

```bash
# Build production images
docker compose -f docker-compose.yml build

# Tag images for registry
docker tag spendahead-frontend:latest your-registry/spendahead-frontend:v1.0
docker tag spendahead-backend:latest your-registry/spendahead-backend:v1.0

# Push to registry
docker push your-registry/spendahead-frontend:v1.0
docker push your-registry/spendahead-backend:v1.0
```

### Production Considerations

1. **Use Production MongoDB**:
   - Use MongoDB Atlas or managed MongoDB service
   - Update MONGODB_URI in environment variables

2. **Secure Environment Variables**:
   - Use Docker secrets or environment variable management
   - Never commit .env files to version control

3. **Enable HTTPS**:
   - Use reverse proxy (Nginx, Traefik)
   - Configure SSL certificates

4. **Set Resource Limits**:
   - Define memory and CPU limits
   - Configure restart policies

5. **Implement Monitoring**:
   - Use container monitoring tools
   - Set up logging aggregation

---

## Advanced Configuration

### Custom docker-compose Override

Create `docker-compose.override.yml` for local customizations:

```yaml
version: '3.8'

services:
  backend:
    volumes:
      - ./backend:/app
    environment:
      - NODE_ENV=development
    command: npm run dev
```

### Using Different MongoDB Version

Edit docker-compose.yml:
```yaml
mongodb:
  image: mongo:7.0  # Change version here
```

### Expose MongoDB Externally

```yaml
mongodb:
  ports:
    - "27017:27017"  # Already exposed by default
```

### Development Mode with Hot Reload

```yaml
services:
  backend:
    volumes:
      - ./backend:/app
      - /app/node_modules
    command: npm run dev
```

---

## Additional Resources

### Useful Docker Commands

```bash
# View Docker disk usage
docker system df

# Clean up everything
docker system prune -a --volumes

# Export/Import images
docker save spendahead-frontend > frontend.tar
docker load < frontend.tar

# Copy files from container
docker compose cp backend:/app/logs ./logs

# Execute commands in running container
docker compose exec backend npm install new-package
```

### Documentation Links

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Documentation](https://nextjs.org/docs/deployment#docker-image)
- [MongoDB Docker Hub](https://hub.docker.com/_/mongo)

---

## Summary

### Start Application
```bash
docker compose up -d
```

### Stop Application
```bash
docker compose down
```

### View Logs
```bash
docker compose logs -f
```

### Rebuild After Code Changes
```bash
docker compose up --build -d
```

### Reset Everything
```bash
docker compose down -v
docker compose up -d
```

---

**Need Help?**

- Check logs: `docker compose logs -f`
- Verify status: `docker compose ps`
- Review this guide's [Troubleshooting](#troubleshooting) section

**Built with 🐳 Docker for easy deployment and development**

*Last Updated: January 2026*
