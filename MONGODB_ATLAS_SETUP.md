# MongoDB Atlas Setup Guide 🌐

This guide will walk you through setting up MongoDB Atlas (cloud database) for FlowCast.

## Why MongoDB Atlas?

MongoDB Atlas is recommended for production deployments because it offers:
- ✅ **Free Tier** - 512MB storage at no cost
- ✅ **No Maintenance** - Fully managed service
- ✅ **Automatic Backups** - Daily backups with point-in-time recovery
- ✅ **High Availability** - Built-in redundancy and failover
- ✅ **Global Distribution** - Deploy closer to your users
- ✅ **Security** - Enterprise-grade security features
- ✅ **Monitoring** - Built-in performance monitoring

## Step-by-Step Setup

### 1. Create Account

1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google account
3. Verify your email address

### 2. Create a Cluster

1. After login, click **"Build a Cluster"** or **"Create"**
2. Select **"Shared"** (Free tier - M0 Sandbox)
3. Choose your cloud provider:
   - AWS, Google Cloud, or Azure
   - Select a region closest to your users
4. Cluster Name: Keep default or name it (e.g., `flowcast-cluster`)
5. Click **"Create Cluster"** (takes 3-5 minutes to provision)

### 3. Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**
3. Authentication Method: Select **"Password"**
4. Username: Enter a username (e.g., `flowcast-admin`)
5. Password:
   - Click **"Autogenerate Secure Password"**
   - **IMPORTANT**: Copy and save this password securely
   - Or create your own strong password
6. Database User Privileges: Select **"Read and write to any database"**
7. Click **"Add User"**

**⚠️ Security Note**: Save your password now! You won't be able to see it again.

### 4. Configure Network Access

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Choose based on your needs:

   **For Development:**
   - Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (any IP can connect)
   - ⚠️ Not recommended for production

   **For Production:**
   - Click **"Add Current IP Address"** (your current IP)
   - Or manually enter your server's IP address
   - Click **"Confirm"**

4. Add a description (e.g., "Development Access" or "Production Server")

### 5. Get Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Driver: Select **"Node.js"**
5. Version: Select latest version
6. Copy the connection string

**Connection String Format:**
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 6. Prepare Your Connection String

Modify the connection string:

1. Replace `<username>` with your database username (e.g., `flowcast-admin`)
2. Replace `<password>` with your database password
3. Add your database name after `.net/` (e.g., `genai-receipt`)
4. Keep the query parameters (`?retryWrites=true&w=majority`)

**Final Connection String Example:**
```
mongodb+srv://flowcast-admin:Abc123Xyz@cluster0.abc123.mongodb.net/genai-receipt?retryWrites=true&w=majority
```

**⚠️ Special Characters in Password:**
If your password contains special characters like `@`, `#`, `$`, etc., you need to URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `:` becomes `%3A`
- `/` becomes `%2F`

Example with special chars:
```
# Original password: MyP@ss#123
# Encoded password: MyP%40ss%23123
mongodb+srv://flowcast-admin:MyP%40ss%23123@cluster0.abc123.mongodb.net/genai-receipt?retryWrites=true&w=majority
```

### 7. Update Environment Variables

#### Backend Configuration

Edit `backend/.env`:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://flowcast-admin:YourPassword@cluster0.xxxxx.mongodb.net/genai-receipt?retryWrites=true&w=majority
MONGODB_TIMEOUT=10000

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-very-strong-secret-key-change-this

# Server Configuration
PORT=5001
NODE_ENV=production

# Frontend URL
FRONTEND_URL=https://your-frontend-domain.com
```

#### Frontend Configuration

Edit `.env.local`:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://flowcast-admin:YourPassword@cluster0.xxxxx.mongodb.net/genai-receipt?retryWrites=true&w=majority

# JWT Secret (must match backend)
JWT_SECRET=your-very-strong-secret-key-change-this

# Optional: Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# Next.js Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### 8. Test Connection

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Look for connection messages:
   ```
   Server running on port 5001
   → Connecting to MongoDB...
   ✓ MongoDB Atlas (Cloud) Connected: cluster0-shard-00-00.xxxxx.mongodb.net
   ✓ Database: genai-receipt
   ```

3. If successful, you're connected! 🎉

## Troubleshooting

### Error: "Authentication failed"

**Problem**: Username or password is incorrect

**Solutions**:
1. Verify your username in Database Access
2. Check your password (remember URL-encoding for special characters)
3. Regenerate password if needed:
   - Go to Database Access
   - Click "Edit" on your user
   - Click "Edit Password"
   - Generate new password and update `.env`

### Error: "Network timeout" or "Cannot reach server"

**Problem**: IP address is not whitelisted

**Solutions**:
1. Go to Network Access
2. Check if your IP is listed
3. For development: Add `0.0.0.0/0` (Allow Access from Anywhere)
4. For production: Add your server's specific IP
5. If behind a router: Check your public IP at [whatismyip.com](https://www.whatismyip.com)

### Error: "Invalid connection string"

**Problem**: Connection string format is wrong

**Solutions**:
1. Ensure format: `mongodb+srv://username:password@cluster.net/database?params`
2. Check that database name is included after `.net/`
3. Verify no extra spaces or line breaks
4. URL-encode special characters in password

### Error: "Server selection timeout"

**Problem**: Cannot connect to cluster

**Solutions**:
1. Check if cluster is running (not paused)
2. Verify network connectivity
3. Try increasing `MONGODB_TIMEOUT` in `.env`
4. Check firewall settings on your machine

### Error: "Cluster is paused"

**Problem**: Free tier clusters auto-pause after inactivity

**Solutions**:
1. Go to your cluster in Atlas dashboard
2. Click "Resume" button
3. Wait 1-2 minutes for cluster to resume
4. Try connecting again

## Database Management

### View Your Data

1. Go to **"Database"** in Atlas dashboard
2. Click **"Browse Collections"**
3. Select your database (`genai-receipt`)
4. View collections (users, expenses, goals, etc.)
5. Browse, search, and edit documents

### Monitor Performance

1. Go to **"Metrics"** tab
2. View:
   - Connection count
   - Operations per second
   - Network usage
   - Storage size

### Backup and Restore

Free tier includes:
- Daily automated backups (retained for 2 days)
- Point-in-time recovery

To restore:
1. Go to **"Backup"** tab
2. Select snapshot
3. Click **"Restore"**

## Best Practices

### Security
- ✅ Use strong passwords (20+ characters with mixed characters)
- ✅ Enable MFA (Multi-Factor Authentication) on Atlas account
- ✅ Use specific IP whitelisting in production
- ✅ Rotate database passwords regularly
- ✅ Never commit `.env` files to git
- ✅ Use environment variables for secrets

### Performance
- ✅ Create appropriate indexes (already done in FlowCast models)
- ✅ Monitor slow queries in Atlas dashboard
- ✅ Use connection pooling (already configured)
- ✅ Close unused connections
- ✅ Choose a region close to your users

### Cost Management
- ✅ Free tier (M0) provides 512MB storage
- ✅ Monitor storage usage in Atlas dashboard
- ✅ Upgrade to M2/M5 if you exceed limits
- ✅ Set up billing alerts

## Migration from Local MongoDB

If you're currently using local MongoDB and want to migrate to Atlas:

### Option 1: Manual Migration (Recommended for development)

1. Export local data:
   ```bash
   mongodump --db genai-receipt --out ./backup
   ```

2. Update `.env` files with Atlas connection string

3. Import to Atlas:
   ```bash
   mongorestore --uri "mongodb+srv://user:pass@cluster.net" --db genai-receipt ./backup/genai-receipt
   ```

### Option 2: Atlas Migration Tool

1. Go to Atlas dashboard
2. Click **"..." menu** on your cluster
3. Select **"Migrate Data to this Cluster"**
4. Follow the guided migration process

## Support Resources

- 📚 [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- 💬 [MongoDB Community Forums](https://www.mongodb.com/community/forums/)
- 🎓 [MongoDB University](https://university.mongodb.com/) (Free courses)
- 📧 Atlas Support: Available in paid tiers

## Summary Checklist

- [ ] Created MongoDB Atlas account
- [ ] Created free M0 cluster
- [ ] Created database user with strong password
- [ ] Configured network access (IP whitelist)
- [ ] Got connection string
- [ ] Updated both `.env` files (backend and frontend)
- [ ] Tested connection successfully
- [ ] Data is syncing properly

---

**🎉 Congratulations!** Your FlowCast app is now connected to MongoDB Atlas and ready for production use!

For questions or issues, please open an issue on the [GitHub repository](https://github.com/vistanoop/genAi_receipt/issues).
