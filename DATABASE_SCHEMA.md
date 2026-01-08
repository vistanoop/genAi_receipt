# Database Schema and Features Documentation

## User Data Tracking

FlowCast now stores comprehensive user information in MongoDB Atlas (or local MongoDB). All user data is properly indexed for optimal performance.

## Collections Overview

### 1. Users Collection

Stores user account and financial profile information.

**Schema Fields:**
```javascript
{
  // Basic Information
  name: String,
  email: String (unique, indexed),
  password: String (hashed with bcrypt),
  
  // Financial Profile
  monthlyIncome: Number,
  currency: String (INR, USD, EUR, GBP, JPY, AUD, CAD),
  minimumBalanceThreshold: Number,
  monthlySavingsFloor: Number,
  riskTolerance: String (low, medium, high),
  
  // Onboarding Status
  onboardingCompleted: Boolean,
  
  // User Activity Tracking (NEW)
  lastLoginAt: Date,
  loginCount: Number,
  
  // User Preferences (NEW)
  notifications: {
    email: Boolean,
    weeklyReport: Boolean,
    savingsReminder: Boolean
  },
  
  // Account Status (NEW)
  isActive: Boolean,
  accountStatus: String (active, suspended, deleted),
  
  // Timestamps
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `email` (unique)
- `isActive + accountStatus` (compound)
- `createdAt` (for user statistics)

### 2. Expenses Collection

Stores all user expense transactions.

**Schema Fields:**
```javascript
{
  userId: ObjectId (ref: User),
  amount: Number,
  category: String (15 categories),
  description: String,
  date: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Categories:**
- housing, transportation, groceries, utilities
- entertainment, food, shopping, healthcare
- education, personal, travel, insurance
- gifts, bills, other-expense

**Indexes:**
- `userId + date` (compound, descending date)
- `userId + category + date` (compound)
- `userId + amount` (for analytics)

### 3. Income Collection

Tracks user income from various sources.

**Schema Fields:**
```javascript
{
  userId: ObjectId (ref: User),
  amount: Number,
  source: String (salary, freelance, business, investment, rental, other),
  description: String,
  frequency: String (one-time, monthly, quarterly, yearly),
  date: Date,
  isRecurring: Boolean,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `userId + date` (compound)
- `userId + isRecurring`
- `userId + frequency`

### 4. FixedExpenses Collection

Manages recurring monthly expenses.

**Schema Fields:**
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  amount: Number,
  category: String (rent, emi, subscriptions, insurance, utilities, internet, phone, other-fixed),
  dueDay: Number (1-31),
  description: String,
  isActive: Boolean,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `userId + isActive` (compound)
- `userId + dueDay + isActive` (for payment reminders)
- `userId + category`

### 5. SavingsGoals Collection

Tracks user financial goals.

**Schema Fields:**
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  targetAmount: Number,
  currentAmount: Number,
  monthlyContribution: Number,
  targetDate: Date,
  priority: String (high, medium, low),
  type: String (emergency-fund, long-term-savings, purchase, investment, other),
  status: String (on-track, at-risk, achieved, abandoned),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- `userId + priority + createdAt` (compound)
- `userId + status`
- `userId + targetDate + status`
- `userId + type`

## Feature Implementation Status

### ✅ Completed Features

1. **Complete Onboarding**
   - Location: `/app/onboarding/page.jsx`
   - API: `/app/api/onboarding/route.js`
   - Multi-step form with financial profile setup
   - Safety rules configuration

2. **Expense Tracking**
   - Location: `/app/dashboard/page.jsx`
   - API: `/app/api/expenses/route.js`
   - Full CRUD operations
   - Real-time statistics

3. **Visual Analytics**
   - Location: `/app/dashboard/page.jsx`
   - Recharts integration
   - Pie charts for category breakdown
   - Real-time calculations

4. **Smart Dashboard**
   - Location: `/app/dashboard/page.jsx`
   - Comprehensive financial overview
   - Quick expense entry
   - Recent transactions

5. **Cash-Flow Forecast**
   - Location: `/app/forecast/page.jsx`
   - API: `/app/api/forecast/current-month/route.js`
   - API: `/app/api/forecast/timeline/route.js`
   - Month-end prediction
   - 3-month projection

6. **Simulate & Decide**
   - Location: `/app/simulate/page.jsx`
   - API: `/app/api/simulate/purchase/route.js`
   - What-if scenarios
   - Impact analysis

7. **Savings Goals**
   - API: `/app/api/goals/route.js`
   - Goal tracking
   - Progress monitoring

8. **User Authentication**
   - APIs: `/app/api/auth/[signup|login|logout|me]/route.js`
   - JWT-based
   - Secure password hashing

## Database Connection

### Connection Files

**Backend:**
- File: `/backend/config/db.js`
- Features:
  - Auto-detects Atlas vs Local MongoDB
  - Connection pooling (min: 2, max: 10)
  - Enhanced error messages
  - Reconnection handling

**Frontend:**
- File: `/src/lib/db.js`
- Features:
  - Connection caching
  - Singleton pattern
  - Same Atlas/Local detection

### Connection Options

Both connections use optimized settings:
```javascript
{
  serverSelectionTimeoutMS: 10000,
  maxPoolSize: 10,
  minPoolSize: 2,
  socketTimeoutMS: 45000,
  family: 4 // IPv4
}
```

## Data Storage Best Practices

### 1. User Privacy
- Passwords are hashed (bcrypt, 10 rounds)
- Sensitive data never logged
- JWT tokens for authentication
- No password reset tokens stored

### 2. Data Integrity
- All references use ObjectId
- Cascading deletes not implemented (manual cleanup)
- Validation at model level
- Timestamps automatically tracked

### 3. Performance
- All collections properly indexed
- Compound indexes for common queries
- Connection pooling enabled
- Query optimization through indexes

### 4. Scalability
- MongoDB Atlas auto-scaling
- Indexes support large datasets
- Efficient query patterns
- Connection pooling

## API Routes

### Authentication
- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - Login
- POST `/api/auth/logout` - Logout
- GET `/api/auth/me` - Get current user

### Onboarding
- POST `/api/onboarding` - Complete onboarding

### Expenses
- GET `/api/expenses` - List expenses
- POST `/api/expenses` - Add expense
- DELETE `/api/expenses/[id]` - Delete expense

### Goals
- GET `/api/goals` - List goals
- POST `/api/goals` - Create goal

### Forecast
- GET `/api/forecast/current-month` - Current month prediction
- GET `/api/forecast/timeline` - Day-by-day timeline

### Simulation
- POST `/api/simulate/purchase` - Simulate purchase

### User Profile
- GET `/api/user/profile` - Get profile
- PUT `/api/user/profile` - Update profile

## Environment Variables

### Required for Both Environments

**Backend (`backend/.env`):**
```env
MONGODB_URI=<connection-string>
MONGODB_TIMEOUT=10000
JWT_SECRET=<strong-secret>
PORT=5001
NODE_ENV=development|production
FRONTEND_URL=<frontend-url>
```

**Frontend (`.env.local`):**
```env
MONGODB_URI=<connection-string>
JWT_SECRET=<same-as-backend>
GEMINI_API_KEY=<optional>
NEXT_PUBLIC_API_URL=<api-url>
```

## Data Migration

### From Local to Atlas

1. **Export Local Data:**
   ```bash
   mongodump --db genai-receipt --out ./backup
   ```

2. **Import to Atlas:**
   ```bash
   mongorestore --uri "mongodb+srv://user:pass@cluster.net" \
     --db genai-receipt ./backup/genai-receipt
   ```

3. **Verify:**
   - Check collection counts
   - Test application features
   - Verify indexes were created

## Monitoring

### Key Metrics to Watch

1. **Connection Pool Usage**
   - Monitor in Atlas dashboard
   - Watch for connection spikes

2. **Query Performance**
   - Slow query logs in Atlas
   - Index usage statistics

3. **Storage Usage**
   - Free tier: 512MB limit
   - Monitor in Atlas dashboard

4. **User Activity**
   - Login counts
   - Active users
   - Feature usage

## Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] HTTPS in production
- [ ] IP whitelist for Atlas
- [ ] Regular password rotation
- [ ] Environment variables never committed
- [ ] Database user has minimal privileges
- [ ] MFA enabled on Atlas account
- [ ] Regular backups configured
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints

## Future Enhancements

Potential improvements for data management:

1. **Data Export**
   - CSV/PDF export for users
   - Custom date range selection

2. **Advanced Analytics**
   - Monthly/yearly reports
   - Spending trends
   - Category predictions

3. **Data Archival**
   - Auto-archive old transactions
   - Soft delete with recovery

4. **Audit Logging**
   - Track all data changes
   - User action history

5. **Data Sync**
   - Real-time updates
   - Offline support
   - Conflict resolution

---

**Note**: All features are production-ready and fully integrated with MongoDB Atlas support.
