# FlowCast Deployment Guide

## Quick Start (Development)

### Prerequisites
- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Google Gemini API key (optional, for AI features)

### Setup Steps

1. **Clone and Install**
```bash
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# Required
MONGODB_URI=mongodb://localhost:27017/flowcast
JWT_SECRET=your-strong-random-secret-key-here

# Optional (for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
NODE_ENV=development
```

3. **Start MongoDB** (if using local)
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

Or use MongoDB Atlas (cloud):
1. Create free cluster at https://cloud.mongodb.com
2. Get connection string
3. Update MONGODB_URI in .env.local

4. **Get Gemini API Key** (optional)
1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Create API key
4. Add to .env.local

5. **Run Development Server**
```bash
npm run dev
```

6. **Access Application**
- Open http://localhost:3000
- Click "Get Started Free" to create account
- Complete onboarding (3-step financial profile)
- Explore features!

## Testing the Application

### User Flow
1. **Signup** → Create account at `/signup`
2. **Onboarding** → Set income, buffers, risk tolerance at `/onboarding`
3. **Dashboard** → View current state at `/dashboard`
4. **Forecast** → See future predictions at `/forecast`
5. **Simulate** → Test spending decisions at `/simulate`
6. **AI Advisor** → Ask financial questions at `/advisor`
7. **Settings** → Update preferences at `/settings`

### Test Scenarios

**Scenario 1: Basic Setup**
- Signup with email
- Set monthly income: ₹50,000
- Set minimum balance: ₹5,000
- Set savings floor: ₹5,000
- Choose risk tolerance: Medium

**Scenario 2: Add Expenses**
- Go to Dashboard
- Add sample expenses (food, shopping, etc.)
- Observe balance changes

**Scenario 3: View Forecast**
- Navigate to Forecast page
- See end-of-month prediction
- View day-by-day timeline
- Check 3-month projection

**Scenario 4: Simulate Purchase**
- Go to Simulation Lab
- Enter amount: ₹15,000
- Choose timing: Today
- Click "Simulate Impact"
- Review balance change, risk change, goal impact
- See AI explanation (if API key configured)

**Scenario 5: Ask AI**
- Go to AI Advisor
- Ask: "How is my financial health?"
- Ask: "Can I afford ₹10,000?"
- Ask: "What's my month-end balance?"

## Production Deployment

### Environment Configuration

**Required Variables:**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/flowcast?retryWrites=true&w=majority
JWT_SECRET=<generate-strong-32-char-random-string>
NODE_ENV=production
```

**Optional Variables:**
```env
GEMINI_API_KEY=<your-api-key>
NEXT_PUBLIC_APP_URL=https://yourapp.com
```

### Deployment Platforms

#### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel
```

3. **Add Environment Variables**
- Go to Vercel Dashboard → Project Settings → Environment Variables
- Add all variables from .env.example
- Redeploy

4. **Connect MongoDB Atlas**
- Use MongoDB Atlas for production database
- Whitelist Vercel IPs or allow all (0.0.0.0/0)

#### Option 2: Docker

1. **Create Dockerfile** (add to project root)
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

2. **Create docker-compose.yml**
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/flowcast
      - JWT_SECRET=${JWT_SECRET}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - mongo
  
  mongo:
    image: mongo:7
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

3. **Build and Run**
```bash
docker-compose up -d
```

#### Option 3: Traditional Hosting (VPS)

1. **Server Setup**
```bash
# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
sudo apt-get install -y mongodb

# Install PM2
npm install -g pm2
```

2. **Deploy Application**
```bash
# Clone repo
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "flowcast" -- start
pm2 save
pm2 startup
```

3. **Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name yourapp.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Database Setup

### MongoDB Atlas (Cloud)

1. Create account at https://cloud.mongodb.com
2. Create new cluster (free tier available)
3. Create database user
4. Whitelist IP addresses
5. Get connection string
6. Update MONGODB_URI in environment

### Local MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Install with default settings
3. MongoDB runs as Windows Service

## Security Checklist

Before going to production:

- [ ] Change JWT_SECRET to strong random string (32+ characters)
- [ ] Use MongoDB Atlas with password authentication
- [ ] Enable MongoDB IP whitelisting
- [ ] Set NODE_ENV=production
- [ ] Never commit .env.local to git
- [ ] Use HTTPS (SSL certificate)
- [ ] Enable rate limiting (add middleware)
- [ ] Set secure HTTP headers
- [ ] Monitor error logs
- [ ] Backup database regularly
- [ ] Test all API endpoints
- [ ] Validate user inputs
- [ ] Sanitize database queries (Mongoose does this)
- [ ] Keep dependencies updated

## Monitoring & Maintenance

### Recommended Tools

**Error Tracking:**
- Sentry (https://sentry.io)
- LogRocket (https://logrocket.com)

**Performance Monitoring:**
- Vercel Analytics (built-in if using Vercel)
- Google Analytics
- PostHog (https://posthog.com)

**Database Monitoring:**
- MongoDB Atlas built-in monitoring
- MongoDB Compass (desktop GUI)

**Uptime Monitoring:**
- UptimeRobot (https://uptimerobot.com)
- Pingdom (https://www.pingdom.com)

### Backup Strategy

**MongoDB Atlas:**
- Automatic daily backups (built-in)
- Point-in-time recovery available

**Self-Hosted:**
```bash
# Daily backup script
mongodump --uri="mongodb://localhost:27017/flowcast" --out=/backups/$(date +%Y%m%d)

# Restore from backup
mongorestore --uri="mongodb://localhost:27017/flowcast" /backups/20240115
```

## Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**MongoDB Connection Error:**
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify MONGODB_URI in .env.local
- Check network/firewall settings

**AI Features Not Working:**
- Verify GEMINI_API_KEY is set
- Check API key is valid
- AI features are optional, app works without them

**Authentication Issues:**
- Clear browser cookies
- Verify JWT_SECRET is set
- Check cookie settings in production

**Port Already in Use:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Performance Optimization

### Build Optimization
Already optimized:
- ✅ Code splitting (Next.js automatic)
- ✅ Tree shaking (webpack)
- ✅ Image optimization (Next.js Image component)
- ✅ CSS minification
- ✅ First Load JS: 102 KB

### Runtime Optimization
Recommendations:
- [ ] Add Redis for session caching
- [ ] Implement API response caching
- [ ] Use CDN for static assets
- [ ] Enable compression middleware
- [ ] Lazy load heavy components
- [ ] Implement pagination for large lists

### Database Optimization
Current setup:
- ✅ Indexes on userId for all models
- ✅ Compound indexes for common queries
- ✅ Mongoose query optimization

Additional:
- [ ] Add indexes based on query patterns
- [ ] Monitor slow queries
- [ ] Archive old data periodically

## Scaling Strategy

### Horizontal Scaling
- Use serverless functions (Vercel/Netlify)
- Stateless architecture (already implemented)
- Session in JWT tokens (no server state)

### Database Scaling
- MongoDB Atlas auto-scaling
- Read replicas for high traffic
- Sharding for very large datasets

### Caching Strategy
- API response caching (Redis/Vercel KV)
- CDN for static assets
- Browser caching headers

## Support & Resources

**Documentation:**
- Architecture: See ARCHITECTURE.md
- API Reference: Check /app/api/* files
- Component Docs: Inline JSDoc comments

**Community:**
- GitHub Issues: Report bugs/features
- Discussions: Ask questions

**Professional Support:**
- Custom deployment assistance
- Feature development
- Architecture consulting

## License

See LICENSE file in repository.

---

**Built with ❤️ for better financial intelligence**

Need help? Open an issue on GitHub!
