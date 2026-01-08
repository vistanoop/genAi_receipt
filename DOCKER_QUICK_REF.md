# 🐳 Docker Quick Reference

Quick commands for running SpendAhead with Docker.

## First Time Setup

```bash
# 1. Ensure Docker is installed
docker --version
docker compose version

# 2. Clone repository
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt

# 3. Create environment file
cp .env.docker.template .env

# 4. Edit .env and add:
#    - GEMINI_API_KEY (from https://makersuite.google.com/app/apikey)
#    - JWT_SECRET (generate with: openssl rand -base64 32)

# 5. Start everything
docker compose up -d
```

## Daily Use

```bash
# Start application
docker compose up -d

# Stop application
docker compose down

# View logs
docker compose logs -f

# Check status
docker compose ps
```

## After Code Changes

```bash
# Rebuild and restart
docker compose up --build -d
```

## Troubleshooting

```bash
# View backend logs
docker compose logs backend -f

# View frontend logs
docker compose logs frontend -f

# Restart a service
docker compose restart backend

# Reset everything
docker compose down -v
docker compose up -d
```

## Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api
- MongoDB: localhost:27017

## Need More Help?

See [DOCKER_SETUP.md](DOCKER_SETUP.md) for complete documentation.
