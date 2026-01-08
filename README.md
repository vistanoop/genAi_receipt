# 🚀 SpendAhead - AI-Powered Financial Intelligence Platform

> Take control of your financial future with SpendAhead - the smart way to track expenses, plan goals, and make informed spending decisions using AI-powered insights.

![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey?logo=express)

---

## 🎯 What is SpendAhead?

**SpendAhead** is a modern, full-stack financial management platform that transforms how you manage your money. Unlike traditional expense trackers, SpendAhead combines real-time expense tracking with AI-powered insights to help you not just see where your money goes, but plan where it *should* go.

### Why SpendAhead?

In today's fast-paced world, managing finances can be overwhelming. SpendAhead solves this by:

- **📸 Instant Receipt Scanning**: Just snap a photo of your receipt, and Google Gemini AI automatically extracts the amount, merchant, date, and suggests the right category - no manual typing required!

- **🔮 Predictive Intelligence**: Don't just track spending - predict it! SpendAhead analyzes your spending patterns to forecast future expenses, helping you stay ahead of your budget.

- **🎯 Smart Goal Planning**: Set financial goals and let SpendAhead guide you there. Whether it's building an emergency fund, planning a vacation, or paying off debt, get personalized recommendations on how to achieve your targets.

- **🎮 What-If Scenarios**: Test financial decisions before making them. Want to know how reducing dining expenses by 20% affects your savings goal? SpendAhead shows you instantly.

- **💡 Personalized Recommendations**: Get AI-powered advice tailored to your spending habits. From identifying subscription services you barely use to suggesting budget adjustments, SpendAhead acts as your personal financial advisor.

### Who is it for?

- **Individuals** seeking better control over personal finances
- **Budget-conscious users** who want to maximize savings
- **Goal-oriented savers** planning for major life events
- **Anyone** tired of manual expense tracking and spreadsheets

### The SpendAhead Difference

Traditional expense trackers show you the past. SpendAhead helps you shape your financial future by combining:
- ✅ **Real-time tracking** with historical data
- ✅ **AI automation** with human control
- ✅ **Visual insights** with actionable recommendations
- ✅ **Current state** with future projections

---

## 📑 Table of Contents

1. [Key Features](#-key-features)
2. [Quick Start](#-quick-start)
3. [Docker Setup](#-docker-setup)
4. [Technology Stack](#-technology-stack)
5. [System Architecture](#-system-architecture)
6. [Database Schema](#-database-schema)
7. [Authentication Flow](#-authentication-flow)
8. [API Documentation](#-api-documentation)
9. [Frontend Structure](#-frontend-structure)
10. [Setup & Installation](#-setup--installation)
11. [Development Workflow](#-development-workflow)
12. [Deployment Guide](#-deployment-guide)
13. [Feature Descriptions](#-feature-descriptions)
14. [Security Considerations](#-security-considerations)
15. [Troubleshooting](#-troubleshooting)

---

## ⚡ Quick Start

Get SpendAhead running on your machine in minutes!

### 🐳 Option 1: Using Docker (Recommended)

**The easiest way to get started!** No need to install Node.js or MongoDB.

```bash
# Prerequisites: Docker and Docker Compose installed
# Get Docker: https://docs.docker.com/get-docker/

# 1. Clone repository
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt

# 2. Configure environment variables
cp .env.docker.template .env
# Edit .env and add your GEMINI_API_KEY and JWT_SECRET

# 3. Start the application
docker compose up -d

# That's it! 🎉
```

**Access Application**:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api

📖 **For detailed Docker instructions, see [DOCKER_SETUP.md](DOCKER_SETUP.md)**

### 💻 Option 2: Manual Installation

#### Prerequisites

```bash
# Required Software
- Node.js (v18 or higher)
- MongoDB (v6 or higher) or MongoDB Atlas account
- npm or yarn package manager
- Git
```

#### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend && npm install && cd ..

# 4. Start MongoDB
mongod
# Or on macOS: brew services start mongodb-community

# 5. Configure environment variables (see detailed setup below)

# 6. Start backend (Terminal 1)
cd backend && npm run dev

# 7. Start frontend (Terminal 2)
npm run dev
```

#### Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001/api

### First Steps After Installation
1. Visit http://localhost:3000
2. Click "Sign Up" to create your account
3. Complete the financial planner to set your budget
4. Start adding expenses or scan your first receipt!

---

## 🌟 Key Features

### 1. 🔐 Secure Authentication & Authorization
- **JWT-based authentication** with secure HTTP-only cookies
- **Password hashing** using bcrypt (10 salt rounds)
- Email validation and strong password requirements
- User registration and login with session persistence (7-day token expiration)
- Secure logout functionality and profile management

### 2. 💰 Expense Management
- **Full CRUD operations** - Create, read, update, and delete expenses
- **15+ expense categories** - housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, and more
- **Receipt image storage** - Link receipts to expenses
- **Date-based filtering** - Find expenses by date range
- **User-specific isolation** - Your data is yours alone

### 3. 🎯 Goal Planning & Tracking
- **Set financial goals** with target amounts and deadlines
- **Track progress visually** with progress indicators
- **Monthly contribution tracking** - See how you're doing
- **Priority-based management** - Focus on what matters most (high, medium, low)
- **Target date monitoring** - Stay on track to meet deadlines

### 4. 🤖 AI-Powered Receipt Scanning
- **Google Gemini AI integration** for intelligent receipt analysis
- **Automatic extraction** of:
  - Total amount (with validation)
  - Merchant name
  - Transaction date
  - Suggested category
- **Error handling** - Graceful fallback for unclear receipts
- **Direct database integration** - Expenses created automatically

### 5. 📊 Analytics & Visualization
- **Real-time spending charts** - See your expenses at a glance
- **Category-wise breakdown** - Know where your money goes
- **Monthly trend analysis** - Identify spending patterns
- **Cash flow timeline** - Visual expense history
- **Financial health snapshot** - Quick overview of your finances
- **Predictive spending forecasts** - See what's coming

### 6. 💡 Smart Recommendations
- **AI-powered financial suggestions** based on your behavior
- **Spending pattern analysis** - Identify problem areas
- **Budget optimization tips** - Save more, spend smarter
- **Personalized advice** - Tailored to your unique situation
- **Actionable insights** - Real steps you can take today

### 7. 🎮 What-If Simulator
- **Test financial scenarios** risk-free
- **Predict impact** of spending changes
- **Goal timeline adjustments** - See how changes affect your goals
- **Budget scenario planning** - Make informed decisions

### 8. 🌙 Modern User Experience
- **Dark mode support** - Easy on the eyes
- **Responsive design** - Works on all devices
- **Smooth animations** - Polished, professional interface
- **Intuitive navigation** - Find what you need quickly

---

## 🐳 Docker Setup

SpendAhead fully supports Docker and Docker Compose for easy deployment and development!

### Why Use Docker?

✅ **No Manual Installation** - No need to install Node.js, MongoDB, or other dependencies  
✅ **Consistent Environment** - Works the same on all machines  
✅ **Quick Setup** - Get running in minutes  
✅ **Easy Cleanup** - Remove everything with one command  
✅ **Production Ready** - Same setup for development and production

### Quick Docker Start

```bash
# 1. Install Docker Desktop from https://docs.docker.com/get-docker/

# 2. Clone and navigate to repository
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt

# 3. Set up environment variables
cp .env.docker.template .env
# Edit .env and add your GEMINI_API_KEY and JWT_SECRET

# 4. Start all services
docker compose up -d

# 5. Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5001/api
# MongoDB: localhost:27017
```

### Docker Services

The Docker setup includes three services:

- **Frontend** (Next.js) - Port 3000
- **Backend** (Express) - Port 5001
- **MongoDB** (Database) - Port 27017

All services automatically connect and communicate with each other!

### Common Docker Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# Rebuild after code changes
docker compose up --build -d

# Reset everything (deletes all data)
docker compose down -v
```

### 📖 Detailed Docker Documentation

For complete Docker setup instructions, troubleshooting, and advanced configuration, see:

**[📘 DOCKER_SETUP.md](DOCKER_SETUP.md)**

This comprehensive guide includes:
- Prerequisites and installation
- Detailed configuration options
- Troubleshooting common issues
- Production deployment tips
- Docker commands reference

---

## 📚 Technology Stack

SpendAhead is built with modern, production-ready technologies:

### Frontend Technologies
```
┌─────────────────────────────────────────────┐
│  Framework & Libraries                      │
├─────────────────────────────────────────────┤
│  • Next.js 15.5.9 (React Framework)        │
│  • React 19.0.0-rc (UI Library)            │
│  • Tailwind CSS 3.4.1 (Styling)            │
│  • Framer Motion 12.24.11 (Animations)     │
│  • Recharts 3.6.0 (Charts & Graphs)        │
│  • Lucide React 0.462.0 (Icons)            │
│  • Radix UI (Component Library)            │
│  • next-themes 0.4.6 (Dark Mode)           │
│  • Sonner 1.7.0 (Toast Notifications)      │
│  • date-fns 4.1.0 (Date Formatting)        │
└─────────────────────────────────────────────┘
```

### Backend Technologies
```
┌─────────────────────────────────────────────┐
│  Framework & Libraries                      │
├─────────────────────────────────────────────┤
│  • Node.js (Runtime)                        │
│  • Express.js 4.18.2 (Web Framework)       │
│  • Mongoose 8.0.3 (MongoDB ODM)            │
│  • JWT 9.0.2 (Authentication)              │
│  • bcryptjs 2.4.3 (Password Hashing)       │
│  • dotenv 16.3.1 (Environment Variables)   │
│  • cors 2.8.5 (Cross-Origin Requests)      │
│  • cookie-parser 1.4.6 (Cookie Handling)   │
└─────────────────────────────────────────────┘
```

### Database
```
┌─────────────────────────────────────────────┐
│  MongoDB (NoSQL Database)                   │
├─────────────────────────────────────────────┤
│  • Document-based storage                   │
│  • Mongoose ODM for schema validation      │
│  • Indexed queries for performance         │
│  • Connection pooling                       │
└─────────────────────────────────────────────┘
```

### AI & External Services
```
┌─────────────────────────────────────────────┐
│  Google Gemini AI                           │
├─────────────────────────────────────────────┤
│  • @google/generative-ai 0.21.0            │
│  • Receipt text extraction                  │
│  • Intelligent data parsing                 │
│  • Category suggestion                      │
└─────────────────────────────────────────────┘
```

---

---

## 🏗 System Architecture

### High-Level Architecture

SpendAhead follows a modern three-tier architecture:

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Mobile Browser]
    end
    
    subgraph "Frontend - Next.js"
        C[Next.js App Router]
        D[React Components]
        E[API Routes /app/api]
        F[UI Components]
    end
    
    subgraph "Backend - Express API"
        G[Express Server :5001]
        H[Auth Routes]
        I[Expense Routes]
        J[Goal Routes]
        K[Middleware]
    end
    
    subgraph "External Services"
        L[Google Gemini AI]
    end
    
    subgraph "Data Layer"
        M[(MongoDB Database)]
    end
    
    A --> C
    B --> C
    C --> D
    C --> E
    D --> F
    E --> G
    G --> H
    G --> I
    G --> J
    G --> K
    H --> M
    I --> M
    J --> M
    E --> L
    
    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#fff4e1
    style G fill:#ffe1f5
    style M fill:#e1ffe1
    style L fill:#f5e1ff
```

### Request Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (Next.js)
    participant A as API Routes
    participant B as Backend (Express)
    participant D as Database (MongoDB)
    participant AI as Google Gemini AI
    
    Note over U,AI: User Authentication Flow
    U->>F: Visit app
    F->>A: GET /api/auth/me
    A->>B: Forward request with cookie
    B->>D: Verify user & fetch data
    D-->>B: Return user data
    B-->>A: User authenticated
    A-->>F: User info
    F-->>U: Display dashboard
    
    Note over U,AI: Expense Creation Flow
    U->>F: Add expense
    F->>A: POST /api/expenses
    A->>B: Create expense
    B->>D: Save to database
    D-->>B: Confirm saved
    B-->>A: Success response
    A-->>F: Updated data
    F-->>U: Show success message
    
    Note over U,AI: Receipt Scanning Flow
    U->>F: Upload receipt image
    F->>A: POST /api/scan-receipt
    A->>AI: Extract data from image
    AI-->>A: Parsed receipt data
    A->>B: POST /api/expenses
    B->>D: Save expense
    D-->>B: Confirm saved
    B-->>A: Success
    A-->>F: Expense created
    F-->>U: Show extracted data
```

---

---

## 💾 Database Schema

### Entity-Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ EXPENSE : has
    USER ||--o{ GOAL : has
    
    USER {
        ObjectId _id PK
        string name
        string email UK
        string password
        number monthlyIncome
        number currentBalance
        number monthlyExpenses
        number spendingGoal
        boolean plannerCompleted
        datetime createdAt
        datetime updatedAt
    }
    
    EXPENSE {
        ObjectId _id PK
        ObjectId user FK
        number amount
        string description
        string category
        date date
        string receipt
        datetime createdAt
        datetime updatedAt
    }
    
    GOAL {
        ObjectId _id PK
        ObjectId user FK
        string name
        number targetAmount
        number currentAmount
        number monthlyContribution
        date targetDate
        string priority
        datetime createdAt
        datetime updatedAt
    }
```

### Schema Details

#### User Collection
- **Authentication**: Email (unique), hashed password
- **Financial Profile**: Monthly income, current balance, spending goals
- **Status**: Planner completion flag
- **Security**: Password not returned in API responses

#### Expense Collection
- **Categories**: housing, transportation, groceries, utilities, entertainment, food, shopping, healthcare, education, personal, travel, insurance, gifts, bills, other-expense
- **Tracking**: Amount, description, date, optional receipt
- **Isolation**: User-specific data via foreign key

#### Goal Collection
- **Planning**: Target amount, current amount, monthly contribution
- **Timeline**: Target date for goal completion
- **Priority**: high, medium, low
- **Progress**: Calculated from current vs. target amount

---

## 🔐 Authentication Flow

### JWT Authentication Process

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    
    Note over U,DB: Sign Up Process
    U->>F: Enter credentials
    F->>B: POST /api/auth/signup
    B->>B: Validate email format
    B->>B: Check password strength
    B->>B: Hash password (bcrypt)
    B->>DB: Create user document
    DB-->>B: User created
    B->>B: Generate JWT token
    B-->>F: Set HTTP-only cookie + user data
    F-->>U: Redirect to dashboard
    
    Note over U,DB: Login Process
    U->>F: Enter email & password
    F->>B: POST /api/auth/login
    B->>DB: Find user by email
    DB-->>B: User document (with password)
    B->>B: Compare passwords (bcrypt)
    B->>B: Generate JWT token
    B-->>F: Set HTTP-only cookie + user data
    F-->>U: Redirect to dashboard
    
    Note over U,DB: Protected Route Access
    U->>F: Access protected page
    F->>B: Request with cookie
    B->>B: Verify JWT token
    B->>B: Extract user ID from token
    B->>DB: Fetch user data
    DB-->>B: User document
    B-->>F: Authorized response
    F-->>U: Display content
```

### Security Features

**Password Requirements:**
- ✓ Minimum 8 characters
- ✓ At least 1 uppercase letter (A-Z)
- ✓ At least 1 lowercase letter (a-z)
- ✓ At least 1 number (0-9)
- ✓ Hashed using bcrypt (10 salt rounds)

**Token Security:**
- ✓ JWT tokens with 7-day expiration
- ✓ HTTP-only cookies (not accessible via JavaScript)
- ✓ Secure flag in production (HTTPS only)
- ✓ SameSite=strict for CSRF protection
- ✓ Token invalidation on logout

---

## 📡 API Documentation

### Base URLs
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5001/api`

### Authentication Endpoints

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (201):
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User
```http
GET /api/auth/me
Cookie: token=jwt_token
```

#### Update Profile
```http
PUT /api/auth/update-profile
Cookie: token=jwt_token

{
  "name": "John Updated",
  "monthlyIncome": 6000,
  "currentBalance": 1500
}
```

#### Logout
```http
POST /api/auth/logout
Cookie: token=jwt_token
```

### Expense Endpoints

#### Get All Expenses
```http
GET /api/expenses
Cookie: token=jwt_token
```

#### Create Expense
```http
POST /api/expenses
Cookie: token=jwt_token

{
  "amount": 75.50,
  "description": "Monthly internet bill",
  "category": "utilities",
  "date": "2024-01-15"
}
```

#### Update Expense
```http
PUT /api/expenses/:id
Cookie: token=jwt_token

{
  "amount": 80.00,
  "description": "Updated description"
}
```

#### Delete Expense
```http
DELETE /api/expenses/:id
Cookie: token=jwt_token
```

### Goal Endpoints

#### Get All Goals
```http
GET /api/goals
Cookie: token=jwt_token
```

#### Create Goal
```http
POST /api/goals
Cookie: token=jwt_token

{
  "name": "Vacation Fund",
  "targetAmount": 3000,
  "monthlyContribution": 250,
  "targetDate": "2024-08-01",
  "priority": "medium"
}
```

#### Update Goal
```http
PUT /api/goals/:id
Cookie: token=jwt_token

{
  "currentAmount": 4000,
  "monthlyContribution": 600
}
```

#### Delete Goal
```http
DELETE /api/goals/:id
Cookie: token=jwt_token
```

### AI Receipt Scanning

```http
POST /api/scan-receipt
Content-Type: multipart/form-data
Cookie: token=jwt_token

Body: { "image": File }

Response (200):
{
  "success": true,
  "expense": {
    "amount": 125.50,
    "description": "Extracted from receipt",
    "category": "groceries",
    "date": "2024-01-15"
  }
}
```

### Error Responses

- **400 Bad Request**: Validation error
- **401 Unauthorized**: Not authenticated
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server problem

---

## 🎨 Frontend Structure

### Directory Layout

```
app/
├── api/                    # Next.js API routes
│   ├── auth/              # Authentication endpoints
│   ├── expenses/          # Expense CRUD
│   └── scan-receipt/      # AI receipt scanning
├── dashboard/             # Protected dashboard pages
│   ├── page.jsx           # Main dashboard
│   ├── analytics/         # Analytics page
│   ├── transactions/      # Transactions page
│   ├── goals/             # Goals page
│   ├── settings/          # Settings page
│   ├── what-if/           # What-if simulator
│   └── recommendations/   # Smart recommendations
├── login/                 # Login page
├── signup/                # Signup page
├── page.js                # Landing page
└── layout.js              # Root layout

components/
├── ui/                    # Radix UI components
├── navbar.jsx             # Main navigation
├── dashboard-navbar.jsx   # Dashboard navigation
├── financial-health-snapshot.jsx
├── cash-flow-timeline.jsx
├── goals-planning.jsx
├── enhanced-analytics.jsx
├── smart-recommendations.jsx
└── what-if-simulator.jsx

backend/
├── config/                # Configuration files
├── controllers/           # Route controllers
├── middleware/            # Auth middleware
├── models/                # Mongoose schemas
├── routes/                # API routes
└── server.js              # Express app entry
```

### Page Routes

**Public Routes:**
- `/` - Landing page
- `/login` - Login page
- `/signup` - Signup page

**Protected Routes:**
- `/dashboard` - Main dashboard
- `/dashboard/analytics` - Analytics & insights
- `/dashboard/transactions` - Expense transactions
- `/dashboard/goals` - Financial goals
- `/dashboard/settings` - User settings
- `/dashboard/what-if` - What-if simulator
- `/dashboard/recommendations` - Smart recommendations

---

## ⚙️ Setup & Installation

### Detailed Setup Guide

#### Step 1: Environment Configuration

**Frontend Environment (.env.local)**

Create `.env.local` in the root directory:

```env
# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/spendahead

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Environment
NODE_ENV=development
```

**Backend Environment (backend/.env)**

Create `.env` in the backend directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/spendahead
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spendahead

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5001

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

#### Step 2: MongoDB Setup

**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod

# Or on macOS with Homebrew
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
1. Create account at https://cloud.mongodb.com
2. Create a new cluster (free tier available)
3. Get connection string
4. Update MONGODB_URI in .env files

#### Step 3: Getting Google Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add to `.env.local` as `GEMINI_API_KEY`

#### Step 4: Verify Installation

1. Open browser and visit `http://localhost:3000`
2. Click "Sign Up" to create an account
3. Fill in registration form
4. Verify successful login and dashboard access
5. Try scanning a receipt to test AI integration

---

## 🔄 Development Workflow

### Project Scripts

**Frontend Scripts:**
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

**Backend Scripts:**
```bash
npm start                    # Start production server
npm run dev                  # Start with hot reload
npm run delete-all-accounts  # Delete all user accounts (dev only)
```

### Testing Checklist

Before deploying or creating a pull request:

- [ ] Authentication flow (signup, login, logout)
- [ ] Expense CRUD operations
- [ ] Goal management
- [ ] Receipt scanning with AI
- [ ] Dashboard data loading
- [ ] Analytics charts rendering
- [ ] What-if simulator calculations
- [ ] Recommendations generation
- [ ] Error handling
- [ ] Responsive design
- [ ] Dark mode toggle
- [ ] Browser compatibility

---

## 🚀 Deployment Guide

### Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        A[Vercel - Frontend]
        B[Railway/Heroku - Backend]
        C[MongoDB Atlas - Database]
        D[Google Cloud - Gemini AI]
    end
    
    A --> B
    B --> C
    A --> D
    
    style A fill:#FFE5E5
    style B fill:#E5FFE5
    style C fill:#E5E5FF
    style D fill:#FFFFE5
```

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

**Environment Variables in Vercel:**
- `GEMINI_API_KEY`
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV=production`

### Backend Deployment (Railway)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

### Database Deployment (MongoDB Atlas)

1. Visit https://cloud.mongodb.com
2. Create cluster (Free tier available)
3. Configure access (Database user + Network access)
4. Get connection string
5. Update MONGODB_URI in environment variables

### Post-Deployment Checklist

- [ ] All environment variables set correctly
- [ ] Frontend builds successfully
- [ ] Backend starts without errors
- [ ] Database connection established
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] CORS configured properly
- [ ] HTTPS enabled
- [ ] Health check endpoint accessible

---

## 🎯 Feature Descriptions

### AI-Powered Receipt Scanning

**How It Works:**

1. User uploads receipt image (JPEG, PNG)
2. Frontend sends image to API route
3. Google Gemini AI analyzes the receipt
4. AI extracts: amount, merchant, date, category
5. Data is validated and formatted
6. Expense is automatically created in database
7. User sees extracted information

**Features:**
- Multi-format support
- Smart category suggestion
- Validation (prevents $0 expenses)
- Error handling for unclear receipts
- Direct database integration

### Financial Health Snapshot

**Components:**
- Income vs. Expenses comparison
- Current balance display
- Spending progress bar
- Smart warnings based on spending level
- Monthly summary

**Warning Levels:**
- **Low (<50%)**: "All good! Your wallet is still smiling 😊"
- **Moderate (50-80%)**: "Careful… month end is watching you 👀"
- **High (>80%)**: "Salary left the chat 😭"

### What-If Simulator

**Simulation Types:**
1. Spending Changes - What if I reduce category spending by X%?
2. Income Changes - What if I get a raise/bonus?
3. Goal Adjustments - What if I increase monthly contribution?
4. Budget Scenarios - Test different budget allocations

**Benefits:**
- Risk-free testing
- Future planning
- Goal optimization
- Informed decision making

### Smart Recommendations

**Recommendation Types:**

**Category-Based:**
- Overspending alerts
- Savings opportunities
- Budget adjustments

**Pattern-Based:**
- Recurring expense analysis
- Seasonal trends
- Unusual activity detection

**Goal-Based:**
- Contribution optimization
- Timeline adjustments
- Priority suggestions

---

## 🔒 Security Considerations

### Security Best Practices

**Password Security:**
- ✓ Minimum 8 characters with complexity requirements
- ✓ bcrypt hashing with 10 salt rounds
- ✓ Password not returned in API responses
- ✓ No password hints or recovery questions

**Token Security:**
- ✓ JWT tokens with 7-day expiration
- ✓ HTTP-only cookies (JavaScript cannot access)
- ✓ Secure flag in production (HTTPS only)
- ✓ SameSite=strict for CSRF protection
- ✓ Token invalidation on logout

**API Security:**
- ✓ Authentication required for protected routes
- ✓ User-specific data isolation
- ✓ Input validation on all endpoints
- ✓ MongoDB parameterized queries prevent injection
- ✓ CORS configured for specific origins

**Data Security:**
- ✓ User data isolated by userId
- ✓ No sensitive data in logs
- ✓ Environment variables for secrets
- ✓ Error messages don't leak information

### Common Vulnerabilities Prevented

1. **SQL Injection**: ✅ MongoDB with parameterized queries
2. **XSS**: ✅ React auto-escaping
3. **CSRF**: ✅ SameSite cookies
4. **Man-in-the-Middle**: ✅ HTTPS in production
5. **Session Hijacking**: ✅ HTTP-only secure cookies
6. **Password Attacks**: ✅ bcrypt hashing
7. **Unauthorized Access**: ✅ JWT verification

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### MongoDB Connection Failed

**Problem**: `Error: MONGODB_URI is not set` or connection timeout

**Solutions:**
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# Verify .env file
cat backend/.env | grep MONGODB_URI

# For MongoDB Atlas:
# - Check IP whitelist (0.0.0.0/0 for all)
# - Verify database credentials
# - Check connection string format
```

#### JWT Token Invalid

**Problem**: `401 Unauthorized` or `Invalid token` errors

**Solutions:**
```bash
# Verify JWT_SECRET is set
cat backend/.env | grep JWT_SECRET

# Clear browser cookies
# Chrome: DevTools > Application > Cookies > Clear

# Ensure backend and frontend JWT_SECRET match
```

#### CORS Errors

**Problem**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions:**
```javascript
// Verify CORS configuration in backend/server.js
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
};

// Check FRONTEND_URL in backend/.env
```

#### API Routes Not Found

**Problem**: `404 Not Found` on API calls

**Solutions:**
```bash
# Verify backend is running
curl http://localhost:5001/api/health

# Check port configuration
cat backend/.env | grep PORT

# Verify API base URL in frontend
```

#### Build Errors

**Problem**: `npm run build` fails

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version (requires 18+)
node --version

# Fix linting errors
npm run lint
```

#### Receipt Scanning Fails

**Problem**: Receipt scanning returns error

**Solutions:**
```bash
# Verify GEMINI_API_KEY is set
cat .env.local | grep GEMINI_API_KEY

# Check file size (max 4MB recommended)
# Check file format (JPEG, PNG supported)

# Test API key validity
```

#### Dashboard Shows No Data

**Problem**: Dashboard loads but shows empty state

**Solutions:**
```bash
# Check authentication cookie
# DevTools > Application > Cookies > verify 'token' exists

# Verify API endpoints work
curl http://localhost:5001/api/expenses -H "Cookie: token=YOUR_TOKEN"

# Check browser console for errors
```

### Debugging Tips

**Enable Detailed Logging:**
```javascript
// Backend: Add to server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});

// Frontend: Add to components
console.log('State:', state);
console.log('API Response:', response);
```

**Check Network Requests:**
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check API calls for status codes and responses

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

```bash
# 1. Fork the repository

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Make changes and commit
git commit -m 'feat: add amazing feature'

# 4. Push to branch
git push origin feature/amazing-feature

# 5. Open Pull Request
```

### Contribution Guidelines

- Follow existing code style
- Write descriptive commit messages
- Test your changes thoroughly
- Update documentation if needed
- Keep changes focused and minimal

---

## 📈 Future Enhancements

### Planned Features

- **Multi-Currency Support** - International expense tracking
- **Bank Integration** - Automatic transaction import via Plaid
- **Mobile Application** - React Native iOS/Android app
- **Advanced Analytics** - Machine learning predictions
- **Collaborative Budgets** - Family/household budgets
- **Export & Reporting** - PDF reports and CSV export

---

## 📄 License

ISC License - See LICENSE file for details

---

## 📞 Support

### Project Information
- **Repository**: https://github.com/vistanoop/genAi_receipt
- **License**: ISC
- **Version**: 1.0.0

### Get Help
- **GitHub Issues**: Report bugs and request features
- **Documentation**: This comprehensive guide
- **Code Comments**: Inline documentation in source files

---

## 📝 Conclusion

**SpendAhead** is your complete financial management solution. With AI-powered insights, intuitive design, and comprehensive features, it transforms how you manage money - from tracking expenses to achieving financial goals.

### Quick Reference

- 🚀 [Quick Start](#-quick-start) - Get started in minutes
- 📡 [API Documentation](#-api-documentation) - Complete API reference
- 🔐 [Authentication](#-authentication-flow) - Security implementation
- 🏗 [Architecture](#-system-architecture) - System design
- 🔧 [Troubleshooting](#-troubleshooting) - Problem solving

---

**Built with ❤️ using Next.js, React, Express, MongoDB, and Google Gemini AI**

*Last Updated: January 2026*
