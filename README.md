# FlowCast - AI-Powered Financial Expense Manager 💰

**Track your spending, scan receipts with AI, forecast cash flow, and make informed financial decisions.**

FlowCast is an intelligent expense management platform that helps you track your spending, categorize expenses, predict future cash flow, simulate purchase decisions, and set savings goals with comprehensive financial analytics.

## ✨ Complete Features

### 🎯 Core Features
- **Complete Onboarding** - Step-by-step setup with financial profile and safety rules
- **Expense Tracking** - Add, categorize, and manage expenses with detailed analytics
- **Visual Analytics** - Interactive pie charts and spending visualizations
- **Smart Dashboard** - Real-time financial overview with insights
- **Cash-Flow Forecast** - Predict month-end balance with day-by-day timeline
- **Simulate & Decide** - Test "what-if" scenarios before making purchases
- **Savings Goals** - Set and track multiple financial goals
- **AI-Powered Receipt Scanning** - Extract expenses from receipts automatically

### 💡 Advanced Features
- User activity tracking and login history
- Multi-currency support (INR, USD, EUR, GBP, etc.)
- Fixed/recurring expense management
- Income tracking with multiple sources
- Risk tolerance customization
- Monthly savings goals and thresholds
- Account status management

## 🚀 Complete Setup Guide

### Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB Atlas Account** (Recommended - Free tier available) OR **Local MongoDB** (v6 or higher)
- **Git** - [Download here](https://git-scm.com/downloads)

### Step 1: Clone the Repository

```bash
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt
```

### Step 2: Database Setup (Choose One)

#### Option A: MongoDB Atlas (Recommended for Production) ☁️

MongoDB Atlas is a cloud-based MongoDB service that's perfect for production deployments. It offers:
- Automatic backups and disaster recovery
- Global distribution and high availability
- No server maintenance required
- Free tier with 512MB storage

**Setup Steps:**

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   - Sign up for a free account
   - Verify your email

2. **Create a Cluster**
   - Click "Build a Cluster" or "Create"
   - Choose the **FREE** tier (M0 Sandbox)
   - Select your preferred cloud provider and region (choose closest to your users)
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Set username (e.g., `flowcast-admin`)
   - Click "Autogenerate Secure Password" and **SAVE IT**
   - Set "Database User Privileges" to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Choose one option:
     - **For Development**: Click "Allow Access from Anywhere" (0.0.0.0/0)
     - **For Production**: Enter your server's IP address
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Select "Node.js" as driver and latest version
   - Copy the connection string (looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add your database name after `.net/` (e.g., `genai-receipt`)

   **Final format:**
   ```
   mongodb+srv://flowcast-admin:YourPassword123@cluster0.xxxxx.mongodb.net/genai-receipt?retryWrites=true&w=majority
   ```

#### Option B: Local MongoDB (Development Only) 💻

**Setup Steps:**

1. **Install MongoDB**
   - macOS: `brew install mongodb-community`
   - Windows: [Download MongoDB Installer](https://www.mongodb.com/try/download/community)
   - Linux: Follow [official guide](https://docs.mongodb.com/manual/administration/install-on-linux/)

2. **Start MongoDB**
   - macOS: `brew services start mongodb-community`
   - Windows: Start MongoDB service from Services
   - Linux: `sudo systemctl start mongod`

3. **Verify MongoDB is Running**
   ```bash
   mongosh
   # or
   mongo
   ```

Your connection string will be:
```
mongodb://localhost:27017/genai-receipt
```

### Step 3: Backend Setup

The backend is a standalone Node.js/Express server that handles all API requests and database operations.

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

#### Configure Backend Environment Variables

Edit `backend/.env` with your configuration:

**For MongoDB Atlas:**
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://flowcast-admin:YourPassword123@cluster0.xxxxx.mongodb.net/genai-receipt?retryWrites=true&w=majority
MONGODB_TIMEOUT=10000

# JWT Secret (IMPORTANT: Change this to a strong random string)
# Generate a secure secret: openssl rand -base64 32
JWT_SECRET=your-very-strong-secret-key-change-this-in-production

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**For Local MongoDB:**
```env
# Local MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/genai-receipt
MONGODB_TIMEOUT=10000

# JWT Secret (IMPORTANT: Change this to a strong random string)
JWT_SECRET=your-very-strong-secret-key-change-this-in-production

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Important Security Notes:**
- ⚠️ **NEVER** commit `.env` files to version control
- ⚠️ Generate a strong JWT_SECRET using: `openssl rand -base64 32`
- ⚠️ Change default passwords and secrets in production
- ⚠️ For MongoDB Atlas, keep your database password secure

#### Start the Backend Server

```bash
# From the backend directory
npm run dev
```

**Expected Output:**
```
Server running on port 5001
Environment: development
→ Connecting to MongoDB...
✓ MongoDB Atlas (Cloud) Connected: cluster0-shard-00-00.xxxxx.mongodb.net
✓ Database: genai-receipt
```

### Step 4: Frontend Setup

```bash
# Go back to the root directory
cd ..

# Install frontend dependencies
npm install

# Create environment file
cp .env.example .env.local
```

#### Configure Frontend Environment Variables

Edit `.env.local` in the root directory:

**For MongoDB Atlas:**
```env
# MongoDB Atlas Connection (for Next.js API routes)
MONGODB_URI=mongodb+srv://flowcast-admin:YourPassword123@cluster0.xxxxx.mongodb.net/genai-receipt?retryWrites=true&w=majority

# JWT Secret (must match backend JWT_SECRET)
JWT_SECRET=your-very-strong-secret-key-change-this-in-production

# Optional: Google Gemini AI API Key for receipt scanning
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**For Local MongoDB:**
```env
# Local MongoDB Connection (for Next.js API routes)
MONGODB_URI=mongodb://localhost:27017/genai-receipt
JWT_SECRET=your-very-strong-secret-key-change-this-in-production

# Optional: Google Gemini AI API Key for receipt scanning
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here

# Next.js Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

**Important Notes:**
- The `JWT_SECRET` must match the one in `backend/.env`
- `GEMINI_API_KEY` is optional - the app works without AI features
- MongoDB URI should point to the same database as backend

#### Start the Frontend Server

```bash
# From the root directory
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app!

### Step 5: Verify Setup

1. **Backend is running**: [http://localhost:5001](http://localhost:5001) should show API information
2. **Frontend is running**: [http://localhost:3000](http://localhost:3000) should show the landing page
3. **MongoDB is connected**: Backend console should show:
   - For Atlas: `✓ MongoDB Atlas (Cloud) Connected: cluster0-xxxxx.mongodb.net`
   - For Local: `✓ MongoDB (Local) Connected: localhost`

### Troubleshooting

#### MongoDB Atlas Connection Issues

**"Authentication failed"**
- Double-check your username and password in the connection string
- Ensure password doesn't contain special characters (or URL-encode them)
- Verify the database user has "Read and write to any database" privileges

**"Network timeout" or "Cannot reach server"**
- Go to Atlas "Network Access" and add your IP address
- For development, use "Allow Access from Anywhere" (0.0.0.0/0)
- Check your firewall settings

**"Unable to connect to server"**
- Verify your connection string format is correct
- Ensure you added the database name after `.net/`
- Check that your cluster is running (not paused)

#### Local MongoDB Connection Issues

```bash
# Check if MongoDB is running
mongosh  # or mongo (depending on version)

# If not running, start MongoDB:
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Port Already in Use
If port 5001 or 3000 is already in use, change it in the respective `.env` files.

#### Module Not Found Errors
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 📊 Complete Feature List

### 🎯 Complete Onboarding
- Step-by-step financial profile setup
- Monthly income and currency selection
- Safety buffer configuration (minimum balance, savings floor)
- Risk tolerance assessment
- Personalized financial rules

### 💰 Expense Tracking
- Add expenses manually with detailed information
- Categorize spending (15+ categories including housing, food, transportation, etc.)
- Edit and delete expenses
- Real-time expense statistics
- Transaction history with filtering
- Visual spending breakdown with charts

### 📈 Visual Analytics
- Interactive pie charts for spending breakdown
- Category-wise expense visualization
- Total spending overview
- Average expense calculation
- Transaction timeline
- Multi-dimensional data insights

### 🎯 Smart Dashboard
- Real-time financial overview
- Total expenses and statistics
- Active spending categories counter
- Quick expense entry form
- Recent transactions list with details

### 📅 Cash-Flow Forecast
- Month-end balance prediction based on spending patterns
- Day-by-day timeline visualization
- Current vs predicted balance comparison
- Burn rate calculation (spending as % of income)
- Next 3 months projection
- Risk zone indicators (safe/warning/danger)

### 🧪 Simulate & Decide
- Test "what-if" purchase scenarios before spending
- Impact analysis on month-end balance
- Balance change predictions
- Risk level assessment (how purchase affects your safety)
- Goal delay calculations (how many days goals are pushed back)
- AI-powered recommendations and explanations

### 🎯 Savings Goals
- Create and track multiple savings goals
- Set target amounts and target dates
- Progress tracking with status indicators
- Priority-based goal management (high/medium/low)
- Goal types (emergency fund, long-term savings, purchase, investment, other)
- Monthly contribution planning
- Current amount vs target tracking

### 🔐 Authentication System
- Secure user signup and login
- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected routes and sessions
- Login history tracking
- Account status management

### 👤 User Profile Management
- Update personal information
- Modify financial profile
- Adjust safety rules and thresholds
- Change risk tolerance settings
- Notification preferences
- Activity tracking (login count, last login)

### 💳 Income Tracking
- Add income from multiple sources
- Source types (salary, freelance, business, investment, rental, other)
- Recurring vs one-time income tracking
- Frequency management (monthly, quarterly, yearly)
- Income date tracking

### 🔁 Fixed Expenses Management
- Recurring expense tracking (rent, EMI, subscriptions, etc.)
- Due date tracking (1-31 of month)
- Category-based organization
- Active/inactive status for temporary pauses
- Monthly obligation calculations

### 🤖 AI-Powered Features (Optional)
- Receipt scanning with Google Gemini AI
- Automatic expense extraction from images
- Smart category suggestions

## 🌟 Core Philosophy

### Key Principles

- **User-Centric Design** - Clean, intuitive interface for everyone
- **Real Data, Real Insights** - Connect with actual user expenses
- **Privacy First** - Your data stays secure with you
- **Progressive Enhancement** - Core features work without AI
- **No Judgment** - The system helps, never criticizes

## 📱 User Journey

1. **Sign Up** - Create your account in seconds
2. **Add Expenses** - Manually enter or scan receipts with AI
3. **View Insights** - See spending patterns and statistics
4. **Manage Money** - Delete expenses, track categories
5. **Stay Informed** - Real-time notifications for all actions

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: 
  - Next.js API Routes (hybrid approach)
  - **Standalone Node.js/Express Backend** (separate server in `/backend` directory)
- **Database**: MongoDB with Mongoose ODM (local storage)
- **Authentication**: JWT tokens, bcryptjs
- **Charts**: Recharts
- **AI**: Google Gemini AI (optional)
- **UI Components**: Radix UI, Framer Motion

## 📖 Additional Documentation

For more detailed information:
- **API Endpoints**: Backend exposes RESTful APIs at `http://localhost:5001/api/`
  - `/api/auth` - Authentication (signup, login, logout)
  - `/api/user` - User profile management
  - `/api/expenses` - Expense tracking
  - `/api/income` - Income management
  - `/api/fixed-expenses` - Fixed/recurring expenses
  - `/api/goals` - Financial goals

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- HTTP-only cookies for token storage
- Protected API routes
- Input validation and sanitization
- MongoDB injection prevention

## 🚧 Roadmap

- [x] User authentication (signup/login)
- [x] Expense management (add/delete)
- [x] Dashboard with statistics
- [x] Visual analytics (pie chart)
- [x] AI receipt scanning
- [ ] Budget setting and tracking
- [ ] Monthly/yearly reports
- [ ] Export data (CSV/PDF)
- [ ] Mobile app
- [ ] Multi-currency support

## 📝 Environment Variables Reference

### Backend Environment Variables (`backend/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string | `mongodb://localhost:27017/genai-receipt` |
| `JWT_SECRET` | Yes | Secret key for JWT tokens (use a strong random string) | Generate with: `openssl rand -base64 32` |
| `PORT` | No | Backend server port (default: 5001) | `5001` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |
| `FRONTEND_URL` | Yes | Frontend URL for CORS | `http://localhost:3000` |

### Frontend Environment Variables (`.env.local`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `MONGODB_URI` | Yes | MongoDB connection string (same as backend) | `mongodb://localhost:27017/genai-receipt` |
| `JWT_SECRET` | Yes | JWT secret (must match backend) | Same as backend JWT_SECRET |
| `GEMINI_API_KEY` | No | Google Gemini AI API key for receipt scanning | Get from https://makersuite.google.com/app/apikey |
| `PORT` | No | Frontend server port (default: 3000) | `3000` |
| `NODE_ENV` | No | Environment mode | `development` or `production` |
| `FRONTEND_URL` | No | Frontend URL | `http://localhost:3000` |

**⚠️ Security Warning**: Never commit `.env` or `.env.local` files to git. They contain sensitive information.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for receipt scanning capabilities
- Next.js team for the amazing framework
- All contributors and users

---

**Made with ❤️ by the FlowCast Team**
