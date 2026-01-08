# �� SpendAhead - Complete Documentation

**AI-Powered Financial Intelligence Platform**

> A comprehensive expense tracking and financial planning application with AI-powered receipt scanning, predictive analytics, and smart recommendations.

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [System Architecture](#system-architecture)
5. [Database Schema](#database-schema)
6. [Authentication Flow](#authentication-flow)
7. [API Documentation](#api-documentation)
8. [Frontend Structure](#frontend-structure)
9. [Setup & Installation](#setup--installation)
10. [Development Workflow](#development-workflow)
11. [Deployment Guide](#deployment-guide)
12. [Feature Descriptions](#feature-descriptions)
13. [Security Considerations](#security-considerations)
14. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**SpendAhead** is a modern, full-stack financial management platform that helps users track expenses, set financial goals, and make informed spending decisions using AI-powered insights. The application combines real-time expense tracking with predictive analytics to provide users with a comprehensive view of their financial health.

### Target Audience
- Individuals looking to manage personal finances
- Users who want AI-powered insights on spending patterns
- People setting and tracking financial goals
- Anyone seeking better financial awareness and control

### Core Value Proposition
- **AI-Powered Receipt Scanning**: Automatically extract expense data from receipt images
- **Predictive Analytics**: Forecast future spending patterns based on historical data
- **Smart Recommendations**: Get personalized financial advice
- **Goal Tracking**: Set and monitor progress toward financial goals
- **Real-time Insights**: Visualize spending with interactive charts and dashboards

---

## ✨ Key Features

### 1. 🔐 User Authentication & Authorization
- JWT-based authentication with secure HTTP-only cookies
- Password hashing using bcrypt (10 salt rounds)
- Email validation and strong password requirements
- User registration and login
- Secure logout functionality
- Profile management
- Session persistence (7-day token expiration)

### 2. 💰 Expense Management
- Create, read, update, and delete expenses
- Categorized expense tracking (15+ categories)
- Receipt image storage and linking
- Date-based expense filtering
- User-specific expense isolation
- Bulk expense operations

### 3. 🎯 Goal Planning
- Set financial goals with target amounts
- Track progress toward goals
- Monthly contribution tracking
- Priority-based goal management
- Target date monitoring
- Visual progress indicators

### 4. 🤖 AI-Powered Receipt Scanning
- Google Gemini AI integration for receipt analysis
- Automatic extraction of:
  - Total amount
  - Merchant name
  - Date
  - Category suggestion
- Validation and error handling
- Direct database integration

### 5. 📊 Analytics & Visualization
- Real-time spending charts
- Category-wise expense breakdown
- Monthly trend analysis
- Cash flow timeline
- Financial health snapshot
- Predictive spending forecasts

### 6. 💡 Smart Recommendations
- AI-powered financial suggestions
- Spending pattern analysis
- Budget optimization tips
- Personalized advice based on user behavior
- Actionable insights

### 7. 🎮 What-If Simulator
- Test financial scenarios
- Predict impact of spending changes
- Goal timeline adjustments
- Budget scenario planning

---

## 🛠 Technology Stack

### Frontend
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

### Backend
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

## 🏗 System Architecture

### High-Level Architecture Diagram

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
        G[Express Server :5000]
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

### Component Architecture

```mermaid
graph LR
    subgraph "Frontend Components"
        A[App Pages]
        B[Dashboard Components]
        C[Shared Components]
        D[UI Components]
    end
    
    subgraph "State Management"
        E[React State]
        F[Cookies]
        G[Local Storage]
    end
    
    subgraph "API Layer"
        H[Next.js API Routes]
        I[Backend API]
    end
    
    A --> B
    B --> C
    C --> D
    A --> E
    E --> F
    E --> G
    A --> H
    H --> I
    
    style A fill:#FFE5E5
    style B fill:#E5F3FF
    style C fill:#E5FFE5
    style H fill:#FFFFE5
    style I fill:#FFE5FF
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

## 💾 Database Schema

### ER Diagram

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

#### User Schema
```javascript
{
  _id: ObjectId,
  name: String (required, trimmed),
  email: String (required, unique, lowercase, validated),
  password: String (required, min 8 chars, hashed, not selected by default),
  monthlyIncome: Number (optional),
  currentBalance: Number (optional),
  monthlyExpenses: Number (optional),
  spendingGoal: Number (optional),
  plannerCompleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- email (unique)

**Methods:**
- comparePassword(password): Compare entered password with hashed password

**Hooks:**
- pre('save'): Hash password before saving

#### Expense Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  amount: Number (required, min: 0),
  description: String (required, trimmed),
  category: String (required, enum: [
    'housing', 'transportation', 'groceries', 
    'utilities', 'entertainment', 'food', 
    'shopping', 'healthcare', 'education', 
    'personal', 'travel', 'insurance', 
    'gifts', 'bills', 'other-expense'
  ]),
  date: Date (default: now),
  receipt: String (optional, URL or path),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- { user: 1, date: -1 } (compound index for efficient queries)

#### Goal Schema
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required, indexed),
  name: String (required, trimmed),
  targetAmount: Number (required, min: 0),
  currentAmount: Number (default: 0, min: 0),
  monthlyContribution: Number (required, min: 0),
  targetDate: Date (required),
  priority: String (enum: ['high', 'medium', 'low'], default: 'medium'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- { user: 1, createdAt: -1 } (compound index)

### Data Relationships

```mermaid
graph TD
    U[User Document] -->|One-to-Many| E[Expense Documents]
    U -->|One-to-Many| G[Goal Documents]
    E -->|References| U
    G -->|References| U
    
    style U fill:#FFE5E5
    style E fill:#E5FFE5
    style G fill:#E5E5FF
```

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
    
    Note over U,DB: Logout Process
    U->>F: Click logout
    F->>B: POST /api/auth/logout
    B-->>F: Clear cookie
    F-->>U: Redirect to login
```

### Password Requirements

```
┌─────────────────────────────────────────────┐
│  Password Strength Requirements             │
├─────────────────────────────────────────────┤
│  ✓ Minimum 8 characters                     │
│  ✓ At least 1 uppercase letter (A-Z)       │
│  ✓ At least 1 lowercase letter (a-z)       │
│  ✓ At least 1 number (0-9)                 │
│  ✓ Hashed using bcrypt (10 salt rounds)    │
└─────────────────────────────────────────────┘
```

### Token Structure

```javascript
JWT Token Payload:
{
  userId: "user_object_id",
  iat: 1234567890,      // Issued at
  exp: 1234567890 + 604800  // Expires in 7 days
}

Cookie Configuration:
{
  httpOnly: true,         // Not accessible via JavaScript
  secure: true,           // HTTPS only (production)
  sameSite: 'strict',     // CSRF protection
  maxAge: 7 days
}
```

### Authorization Middleware Flow

```mermaid
graph TD
    A[Request Received] --> B{Cookie Present?}
    B -->|No| C[Return 401 Unauthorized]
    B -->|Yes| D{Valid JWT?}
    D -->|No| E[Return 401 Invalid Token]
    D -->|Yes| F[Extract User ID]
    F --> G{User Exists?}
    G -->|No| H[Return 401 User Not Found]
    G -->|Yes| I[Attach User to Request]
    I --> J[Continue to Route Handler]
    
    style A fill:#E5E5FF
    style C fill:#FFE5E5
    style E fill:#FFE5E5
    style H fill:#FFE5E5
    style J fill:#E5FFE5
```

---

## 📡 API Documentation

### Base URLs
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000/api`

### Authentication Endpoints

#### 1. Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

Request Body:
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
    "email": "john@example.com",
    "plannerCompleted": false
  }
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

Response (200):
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "plannerCompleted": false
  }
}
```

#### 3. Get Current User
```http
GET /api/auth/me
Cookie: token=jwt_token

Response (200):
{
  "success": true,
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "monthlyIncome": 5000,
    "currentBalance": 1200,
    "plannerCompleted": true
  }
}
```

#### 4. Update Profile
```http
PUT /api/auth/update-profile
Cookie: token=jwt_token
Content-Type: application/json

Request Body:
{
  "name": "John Updated",
  "monthlyIncome": 6000,
  "currentBalance": 1500,
  "spendingGoal": 4000
}

Response (200):
{
  "success": true,
  "user": { /* updated user object */ }
}
```

#### 5. Logout
```http
POST /api/auth/logout
Cookie: token=jwt_token

Response (200):
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Expense Endpoints

#### 1. Get All Expenses
```http
GET /api/expenses
Cookie: token=jwt_token

Response (200):
{
  "success": true,
  "count": 15,
  "expenses": [
    {
      "_id": "expense_id",
      "user": "user_id",
      "amount": 50.00,
      "description": "Grocery shopping",
      "category": "groceries",
      "date": "2024-01-15T10:30:00.000Z",
      "receipt": null,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

#### 2. Create Expense
```http
POST /api/expenses
Cookie: token=jwt_token
Content-Type: application/json

Request Body:
{
  "amount": 75.50,
  "description": "Monthly internet bill",
  "category": "utilities",
  "date": "2024-01-15"
}

Response (201):
{
  "success": true,
  "expense": { /* created expense object */ }
}
```

#### 3. Update Expense
```http
PUT /api/expenses/:id
Cookie: token=jwt_token
Content-Type: application/json

Request Body:
{
  "amount": 80.00,
  "description": "Updated description"
}

Response (200):
{
  "success": true,
  "expense": { /* updated expense object */ }
}
```

#### 4. Delete Expense
```http
DELETE /api/expenses/:id
Cookie: token=jwt_token

Response (200):
{
  "success": true,
  "message": "Expense deleted successfully"
}
```

### Goal Endpoints

#### 1. Get All Goals
```http
GET /api/goals
Cookie: token=jwt_token

Response (200):
{
  "success": true,
  "goals": [
    {
      "_id": "goal_id",
      "user": "user_id",
      "name": "Emergency Fund",
      "targetAmount": 10000,
      "currentAmount": 3500,
      "monthlyContribution": 500,
      "targetDate": "2024-12-31",
      "priority": "high"
    }
  ]
}
```

#### 2. Create Goal
```http
POST /api/goals
Cookie: token=jwt_token
Content-Type: application/json

Request Body:
{
  "name": "Vacation Fund",
  "targetAmount": 3000,
  "monthlyContribution": 250,
  "targetDate": "2024-08-01",
  "priority": "medium"
}

Response (201):
{
  "success": true,
  "goal": { /* created goal object */ }
}
```

#### 3. Update Goal
```http
PUT /api/goals/:id
Cookie: token=jwt_token
Content-Type: application/json

Request Body:
{
  "currentAmount": 4000,
  "monthlyContribution": 600
}

Response (200):
{
  "success": true,
  "goal": { /* updated goal object */ }
}
```

#### 4. Delete Goal
```http
DELETE /api/goals/:id
Cookie: token=jwt_token

Response (200):
{
  "success": true,
  "message": "Goal deleted successfully"
}
```

### AI Receipt Scanning

```http
POST /api/scan-receipt
Content-Type: multipart/form-data
Cookie: token=jwt_token

Request Body:
{
  "image": File (image/jpeg, image/png)
}

Response (200):
{
  "success": true,
  "expense": {
    "_id": "expense_id",
    "amount": 125.50,
    "description": "Extracted from receipt",
    "category": "groceries",
    "date": "2024-01-15",
    "receipt": "image_url"
  }
}
```

### Error Responses

```http
400 Bad Request:
{
  "success": false,
  "error": "Validation error message"
}

401 Unauthorized:
{
  "success": false,
  "error": "Not authorized to access this route"
}

404 Not Found:
{
  "success": false,
  "error": "Resource not found"
}

500 Internal Server Error:
{
  "success": false,
  "error": "Server error message"
}
```

---

## 🎨 Frontend Structure

### Directory Layout

```
app/
├── api/                    # Next.js API routes
│   ├── auth/
│   │   ├── login/         # Login endpoint
│   │   ├── signup/        # Signup endpoint
│   │   ├── logout/        # Logout endpoint
│   │   └── me/            # Get current user
│   ├── expenses/
│   │   ├── route.js       # GET & POST expenses
│   │   └── [id]/          # PUT & DELETE by ID
│   └── scan-receipt/      # AI receipt scanning
├── dashboard/             # Protected dashboard pages
│   ├── page.jsx           # Main dashboard
│   ├── layout.jsx         # Dashboard layout
│   ├── analytics/         # Analytics page
│   ├── transactions/      # Transactions page
│   ├── goals/             # Goals page
│   ├── settings/          # Settings page
│   ├── what-if/           # What-if simulator
│   └── recommendations/   # Smart recommendations
├── login/                 # Login page
├── signup/                # Signup page
├── planner/               # Financial planner
├── page.js                # Landing page
├── layout.js              # Root layout
└── globals.css            # Global styles

components/
├── ui/                    # Radix UI components
│   ├── button.jsx
│   ├── card.jsx
│   ├── dialog.jsx
│   ├── input.jsx
│   └── ...
├── navbar.jsx             # Main navigation
├── dashboard-navbar.jsx   # Dashboard navigation
├── financial-health-snapshot.jsx
├── cash-flow-timeline.jsx
├── goals-planning.jsx
├── enhanced-analytics.jsx
├── smart-recommendations.jsx
├── what-if-simulator.jsx
├── ai-financial-copilot.jsx
└── theme-provider.jsx

lib/
├── apiConfig.js           # API configuration
└── utils.js               # Utility functions

backend/
├── config/
│   ├── database.js        # MongoDB connection
│   └── jwt.js             # JWT configuration
├── controllers/
│   ├── authController.js  # Auth logic
│   ├── expenseController.js
│   └── goalController.js
├── middleware/
│   ├── auth.js            # Authentication middleware
│   └── errorHandler.js    # Error handling
├── models/
│   ├── User.js            # User schema
│   ├── Expense.js         # Expense schema
│   └── Goal.js            # Goal schema
├── routes/
│   ├── authRoutes.js      # Auth routes
│   ├── expenseRoutes.js   # Expense routes
│   ├── goalRoutes.js      # Goal routes
│   └── googleAuthRoutes.js
└── server.js              # Express app entry
```

### Component Hierarchy

```mermaid
graph TD
    A[App Layout] --> B[Navbar]
    A --> C[Landing Page]
    A --> D[Auth Pages]
    A --> E[Dashboard Layout]
    
    D --> F[Login]
    D --> G[Signup]
    
    E --> H[Dashboard Navbar]
    E --> I[Main Dashboard]
    E --> J[Analytics]
    E --> K[Transactions]
    E --> L[Goals]
    E --> M[Settings]
    E --> N[What-If Simulator]
    E --> O[Recommendations]
    
    I --> P[Financial Health Snapshot]
    I --> Q[Cash Flow Timeline]
    I --> R[Applied Recommendations]
    
    J --> S[Enhanced Analytics]
    J --> T[Dashboard Analytics]
    
    L --> U[Goals Planning]
    
    N --> V[What-If Simulator Component]
    
    O --> W[Smart Recommendations]
    
    style A fill:#E5E5FF
    style E fill:#FFE5E5
    style I fill:#E5FFE5
    style J fill:#FFFFE5
```

### Page Routes

```
Public Routes:
├── /                      # Landing page
├── /login                 # Login page
└── /signup                # Signup page

Protected Routes (require authentication):
├── /dashboard             # Main dashboard
├── /dashboard/analytics   # Analytics & insights
├── /dashboard/transactions # Expense transactions
├── /dashboard/goals       # Financial goals
├── /dashboard/settings    # User settings
├── /dashboard/what-if     # What-if simulator
└── /dashboard/recommendations # Smart recommendations
```

### Key Frontend Components

#### 1. Financial Health Snapshot
- Displays current financial status
- Shows monthly income, expenses, and balance
- Spending progress bars
- Smart warning messages
- Real-time updates

#### 2. Cash Flow Timeline
- Visual timeline of expenses
- Monthly trend charts
- Category breakdowns
- Future projections

#### 3. Enhanced Analytics
- Interactive charts (Recharts)
- Category-wise spending
- Trend analysis
- Comparative insights

#### 4. Goals Planning
- Goal creation and tracking
- Progress visualization
- Monthly contribution tracking
- Priority management

#### 5. What-If Simulator
- Scenario testing
- Financial forecasting
- Budget impact analysis
- Interactive sliders

#### 6. Smart Recommendations
- AI-powered suggestions
- Spending optimization tips
- Personalized advice
- Actionable insights

---

## ⚙️ Setup & Installation

### Prerequisites

```bash
# Required Software
- Node.js (v18 or higher)
- MongoDB (v6 or higher) or MongoDB Atlas account
- npm or yarn package manager
- Git
```

### Step 1: Clone Repository

```bash
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt
```

### Step 2: Install Frontend Dependencies

```bash
# Install frontend packages
npm install
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to backend directory
cd backend

# Install backend packages
npm install

cd ..
```

### Step 4: Environment Configuration

#### Frontend Environment (.env.local)

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

#### Backend Environment (backend/.env)

Create `.env` in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/spendahead
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spendahead?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Step 5: Start MongoDB

#### Option A: Local MongoDB
```bash
# Start MongoDB service
mongod

# Or on macOS with Homebrew
brew services start mongodb-community
```

#### Option B: MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com
2. Create a new cluster (free tier available)
3. Get connection string
4. Update MONGODB_URI in .env files

### Step 6: Start Development Servers

#### Terminal 1: Start Backend
```bash
cd backend
npm run dev
```

Expected output:
```
🚀 Server running on port 5000
📡 Environment: development
🌐 API URL: http://localhost:5000/api
✅ MongoDB connected successfully
```

#### Terminal 2: Start Frontend
```bash
# From root directory
npm run dev
```

Expected output:
```
▲ Next.js 15.5.9
- Local:        http://localhost:3000
- Ready in 2.3s
```

### Step 7: Verify Installation

1. Open browser and visit `http://localhost:3000`
2. Click "Sign Up" to create an account
3. Fill in registration form
4. Verify successful login and dashboard access

### Getting Google Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add to `.env.local` as `GEMINI_API_KEY`

---
## 🔄 Development Workflow

### Project Scripts

#### Frontend Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

#### Backend Scripts
```bash
npm start                    # Start production server
npm run dev                  # Start with hot reload
npm run delete-all-accounts  # Delete all user accounts (dev only)
```

### Development Process

```mermaid
graph LR
    A[Write Code] --> B[Test Locally]
    B --> C[Lint Code]
    C --> D{Tests Pass?}
    D -->|No| A
    D -->|Yes| E[Commit Changes]
    E --> F[Push to Repository]
    F --> G[Deploy]
    
    style A fill:#E5E5FF
    style D fill:#FFFFE5
    style G fill:#E5FFE5
```

### Code Style Guidelines

```javascript
// Use ES6+ features
import { useState, useEffect } from 'react';

// Functional components with hooks
export default function Component() {
  const [state, setState] = useState(null);
  
  useEffect(() => {
    // Side effects
  }, []);
  
  return <div>Content</div>;
}

// API routes with try-catch
export async function POST(request) {
  try {
    // Handle request
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request on GitHub
```

### Testing Checklist

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

#### Step 1: Prepare for Deployment
```bash
# Build locally to test
npm run build

# Fix any build errors
npm run lint
```

#### Step 2: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Step 3: Configure Environment Variables

In Vercel dashboard:
1. Go to Project Settings > Environment Variables
2. Add:
   - `GEMINI_API_KEY`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

### Backend Deployment (Railway/Heroku)

#### Option A: Railway

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

#### Option B: Heroku

```bash
# Install Heroku CLI
# Download from https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create spendahead-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Database Deployment (MongoDB Atlas)

#### Step 1: Create Cluster
1. Visit https://cloud.mongodb.com
2. Click "Build a Cluster"
3. Select "Shared" (Free tier)
4. Choose cloud provider and region
5. Create cluster

#### Step 2: Configure Access
1. Database Access > Add Database User
2. Network Access > Add IP Address (0.0.0.0/0 for anywhere)

#### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your password
5. Update MONGODB_URI in environment variables

### Environment Variables Checklist

```bash
Production Environment Variables:

Frontend (.env.production):
✓ GEMINI_API_KEY
✓ MONGODB_URI
✓ JWT_SECRET
✓ NODE_ENV=production

Backend (.env):
✓ PORT=5000
✓ NODE_ENV=production
✓ MONGODB_URI
✓ JWT_SECRET
✓ JWT_EXPIRE=7d
✓ FRONTEND_URL=https://your-vercel-domain.vercel.app
✓ BACKEND_URL=https://your-railway-app.railway.app
```

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
- [ ] Error monitoring configured

### Monitoring & Maintenance

```bash
# Check backend health
curl https://your-backend-url.com/api/health

# Monitor logs (Vercel)
vercel logs

# Monitor logs (Railway)
railway logs

# Monitor logs (Heroku)
heroku logs --tail
```

---

## 🎯 Feature Descriptions

### 1. AI-Powered Receipt Scanning

#### How It Works

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant API as API Route
    participant AI as Gemini AI
    participant DB as Database
    
    U->>F: Upload receipt image
    F->>API: POST /api/scan-receipt
    API->>AI: Send image for analysis
    AI->>AI: Extract text & data
    AI-->>API: Return parsed data
    API->>API: Validate & format
    API->>DB: Save expense
    DB-->>API: Confirm saved
    API-->>F: Return expense data
    F-->>U: Display extracted info
```

#### Features
- **Multi-format Support**: JPEG, PNG, PDF receipts
- **Smart Extraction**: Automatically extracts amount, merchant, date, category
- **Validation**: Ensures valid amounts and prevents $0 expenses
- **Category Suggestion**: AI suggests appropriate expense category
- **Error Handling**: Graceful fallback for unclear receipts

#### Usage
1. Click "Scan Receipt" button
2. Select receipt image
3. AI extracts data automatically
4. Review and edit if needed
5. Confirm to save expense

### 2. Financial Health Snapshot

#### Components
- **Income vs. Expenses**: Visual comparison
- **Current Balance**: Real-time balance display
- **Spending Progress**: Progress bar with percentage
- **Smart Warnings**: Context-aware spending alerts
- **Monthly Summary**: Quick overview of financial health

#### Warning Levels

```javascript
Spending Levels:
├── Low (<50%): "All good! Your wallet is still smiling ��"
├── Moderate (50-80%): "Careful… month end is watching you 👀"
└── High (>80%): "Salary left the chat 😭"
```

### 3. Cash Flow Timeline

#### Features
- **Visual Timeline**: See expenses over time
- **Daily Breakdown**: Expenses grouped by date
- **Category Colors**: Color-coded by expense category
- **Trend Analysis**: Identify spending patterns
- **Projections**: Forecast future spending

### 4. Goal Planning & Tracking

#### Goal Types
- Emergency Fund
- Vacation Savings
- Debt Repayment
- Investment Goals
- Custom Goals

#### Features
- **Progress Tracking**: Visual progress bars
- **Target Dates**: Set goal deadlines
- **Monthly Contributions**: Track regular savings
- **Priority Levels**: High, Medium, Low priorities
- **Achievement Alerts**: Notifications on goal completion

### 5. What-If Simulator

#### Simulation Types
1. **Spending Changes**: What if I reduce category spending by X%?
2. **Income Changes**: What if I get a raise/bonus?
3. **Goal Adjustments**: What if I increase monthly contribution?
4. **Budget Scenarios**: Test different budget allocations

#### Benefits
- **Risk-Free Testing**: Experiment without actual changes
- **Future Planning**: Plan for major purchases
- **Goal Optimization**: Find best path to goals
- **Decision Making**: Make informed financial decisions

### 6. Smart Recommendations

#### Recommendation Types

```
Category-Based:
├── Overspending Alerts: "You're spending 40% more on dining out"
├── Savings Opportunities: "Switch to cheaper gym membership"
└── Budget Adjustments: "Consider increasing food budget"

Pattern-Based:
├── Recurring Expenses: "Identify subscription you don't use"
├── Seasonal Trends: "Holiday spending is approaching"
└── Unusual Activity: "Unusual spike in entertainment spending"

Goal-Based:
├── Contribution Optimization: "Increase savings by 10% to reach goal faster"
├── Timeline Adjustments: "Reduce dining out to meet vacation goal on time"
└── Priority Suggestions: "Focus on high-priority goals first"
```

### 7. Enhanced Analytics

#### Chart Types
- **Line Charts**: Spending trends over time
- **Bar Charts**: Category comparisons
- **Pie Charts**: Category distribution
- **Area Charts**: Cumulative spending
- **Comparison Charts**: Month-over-month analysis

#### Metrics
- Total spending by period
- Average daily spending
- Category percentages
- Spending velocity
- Budget utilization

---

## 🔒 Security Considerations

### Authentication Security

```mermaid
graph TD
    A[User Credentials] --> B[HTTPS Encryption]
    B --> C[Password Hashing - bcrypt]
    C --> D[JWT Token Generation]
    D --> E[HTTP-only Cookie]
    E --> F[Secure Cookie Flags]
    F --> G[Token Verification]
    G --> H[User Authorization]
    
    style A fill:#FFE5E5
    style C fill:#E5FFE5
    style E fill:#E5E5FF
    style H fill:#FFFFE5
```

### Security Best Practices

#### 1. Password Security
```javascript
✓ Minimum 8 characters
✓ Complexity requirements (uppercase, lowercase, number)
✓ bcrypt hashing with 10 salt rounds
✓ Password not returned in API responses
✓ No password hints or recovery questions
```

#### 2. Token Security
```javascript
✓ JWT tokens with 7-day expiration
✓ HTTP-only cookies (not accessible via JavaScript)
✓ Secure flag in production (HTTPS only)
✓ SameSite=strict for CSRF protection
✓ Token invalidation on logout
```

#### 3. API Security
```javascript
✓ Authentication required for protected routes
✓ User-specific data isolation
✓ Input validation on all endpoints
✓ SQL injection prevention (MongoDB parameterized queries)
✓ Rate limiting (recommended for production)
```

#### 4. Data Security
```javascript
✓ User data isolation by userId
✓ No sensitive data in logs
✓ Environment variables for secrets
✓ CORS configured for specific origins
✓ Error messages don't leak information
```

#### 5. Frontend Security
```javascript
✓ XSS prevention (React auto-escaping)
✓ CSRF protection (SameSite cookies)
✓ Content Security Policy headers
✓ HTTPS enforced in production
✓ Secure dependencies (no known vulnerabilities)
```

### Security Checklist

```
Production Security:
├── [ ] Strong JWT_SECRET set
├── [ ] MongoDB authentication enabled
├── [ ] HTTPS enforced
├── [ ] CORS origins whitelisted
├── [ ] Environment variables secured
├── [ ] API rate limiting enabled
├── [ ] Security headers configured
├── [ ] Dependencies updated
├── [ ] Logs sanitized
└── [ ] Backup strategy implemented
```

### Common Vulnerabilities Prevented

1. **SQL Injection**: ✅ Using MongoDB with parameterized queries
2. **XSS**: ✅ React auto-escaping, no dangerouslySetInnerHTML
3. **CSRF**: ✅ SameSite cookies, token-based auth
4. **Man-in-the-Middle**: ✅ HTTPS in production
5. **Session Hijacking**: ✅ HTTP-only secure cookies
6. **Password Attacks**: ✅ bcrypt hashing, complexity requirements
7. **Unauthorized Access**: ✅ JWT verification on all protected routes

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. MongoDB Connection Failed

**Problem**: `Error: MONGODB_URI is not set` or connection timeout

**Solutions**:
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# Verify .env file exists and has correct URI
cat backend/.env | grep MONGODB_URI

# For MongoDB Atlas, check:
# - IP whitelist includes your IP (0.0.0.0/0 for all)
# - Database user credentials are correct
# - Connection string has correct format
```

#### 2. JWT Token Invalid

**Problem**: `401 Unauthorized` or `Invalid token` errors

**Solutions**:
```bash
# Verify JWT_SECRET is set
cat backend/.env | grep JWT_SECRET

# Clear browser cookies
# In Chrome: DevTools > Application > Cookies > Clear

# Check token expiration (default 7 days)
# If expired, log in again

# Ensure backend and frontend JWT_SECRET match
```

#### 3. CORS Errors

**Problem**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions**:
```javascript
// backend/server.js
// Verify CORS configuration includes your frontend URL
const corsOptions = {
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
};

// Check FRONTEND_URL in backend/.env
FRONTEND_URL=http://localhost:3000

// For production, update to actual domain
```

#### 4. API Routes Not Found

**Problem**: `404 Not Found` on API calls

**Solutions**:
```bash
# Verify backend is running
curl http://localhost:5000/api/health

# Check if port is correct
cat backend/.env | grep PORT

# Verify API routes are registered
# Check backend/server.js for route registration

# Update frontend API base URL
# Check lib/apiConfig.js
```

#### 5. Build Errors

**Problem**: `npm run build` fails

**Solutions**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version (requires 18+)
node --version

# Fix linting errors
npm run lint

# Check for missing dependencies
npm audit fix
```

#### 6. Image Upload Fails

**Problem**: Receipt scanning returns error

**Solutions**:
```bash
# Verify GEMINI_API_KEY is set
cat .env.local | grep GEMINI_API_KEY

# Check file size (max 4MB recommended)
# Check file format (JPEG, PNG supported)

# Test API key
curl -H "x-goog-api-key: YOUR_KEY"   https://generativelanguage.googleapis.com/v1/models

# Check console for specific error message
```

#### 7. Dark Mode Not Working

**Problem**: Theme toggle doesn't work

**Solutions**:
```javascript
// Check ThemeProvider is wrapping app
// app/layout.js should have:
<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>

// Clear browser cache
// Reload page

// Check localStorage
localStorage.getItem('theme')
```

#### 8. Dashboard Shows No Data

**Problem**: Dashboard loads but shows empty state

**Solutions**:
```bash
# Check authentication
# Open DevTools > Application > Cookies
# Verify 'token' cookie exists

# Verify API endpoints work
curl http://localhost:5000/api/expenses   -H "Cookie: token=YOUR_TOKEN"

# Check MongoDB for data
mongo spendahead
db.expenses.find()

# Check browser console for errors
```

### Debugging Tips

#### Enable Detailed Logging

**Backend:**
```javascript
// Add to backend/server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Body:', req.body);
  console.log('Cookies:', req.cookies);
  next();
});
```

**Frontend:**
```javascript
// Add to any component
console.log('State:', state);
console.log('API Response:', response);
```

#### Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check API calls:
   - Status codes (200, 401, 500)
   - Request headers
   - Response data
   - Timing

#### Verify Environment Variables

```bash
# Backend
cd backend
node -e "require('dotenv').config(); console.log(process.env)"

# Frontend
# Check .env.local exists in root
ls -la .env.local
```

### Getting Help

```
Support Resources:
├── GitHub Issues: Report bugs and feature requests
├── Documentation: This comprehensive guide
├── Code Comments: Inline documentation in source
└── Community: Stack Overflow, Discord, Reddit
```

### Error Codes Reference

```
Status Codes:
├── 200: Success
├── 201: Created
├── 400: Bad Request (validation error)
├── 401: Unauthorized (not logged in)
├── 403: Forbidden (insufficient permissions)
├── 404: Not Found (resource doesn't exist)
├── 500: Internal Server Error (server problem)
└── 503: Service Unavailable (database down)
```

---

## 📈 Future Enhancements

### Planned Features

1. **Multi-Currency Support**
   - Currency conversion
   - International expense tracking
   - Exchange rate integration

2. **Bank Integration**
   - Plaid API integration
   - Automatic transaction import
   - Bank account synchronization

3. **Mobile Application**
   - React Native iOS/Android app
   - Mobile-optimized UI
   - Push notifications

4. **Advanced Analytics**
   - Machine learning predictions
   - Anomaly detection
   - Spending forecasts

5. **Collaborative Budgets**
   - Family/household budgets
   - Shared expense tracking
   - Multi-user access

6. **Export & Reporting**
   - PDF reports
   - CSV export
   - Tax-ready summaries

### Contributing

```bash
# Fork repository
# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and commit
git commit -m 'feat: add amazing feature'

# Push to branch
git push origin feature/amazing-feature

# Open Pull Request
```

---

## 📞 Support & Contact

### Project Information
- **Repository**: https://github.com/vistanoop/genAi_receipt
- **License**: ISC
- **Version**: 1.0.0

### Documentation
- **This File**: Complete technical documentation
- **README**: Quick start guide
- **API Docs**: Endpoint specifications (this file)
- **Code Comments**: Inline documentation

---

## 📝 Conclusion

SpendAhead is a comprehensive financial management platform that combines modern web technologies with AI-powered insights to help users take control of their finances. This documentation provides everything needed to understand, develop, deploy, and maintain the application.

### Key Takeaways

✅ **Full-Stack Architecture**: Next.js frontend + Express backend + MongoDB
✅ **Secure Authentication**: JWT-based with bcrypt password hashing
✅ **AI Integration**: Google Gemini for receipt scanning
✅ **Rich Features**: Expenses, goals, analytics, simulations, recommendations
✅ **Production Ready**: Comprehensive security and deployment guides
✅ **Well Documented**: Detailed documentation with diagrams

### Quick Reference Links

- 🚀 [Setup Guide](#setup--installation)
- 📡 [API Documentation](#api-documentation)
- 🔐 [Authentication Flow](#authentication-flow)
- 🏗 [System Architecture](#system-architecture)
- 🔧 [Troubleshooting](#troubleshooting)

---

**Built with ❤️ using Next.js, React, Express, MongoDB, and Google Gemini AI**

*Last Updated: January 2024*
