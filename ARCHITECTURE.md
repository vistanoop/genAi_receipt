# FlowCast Architecture Documentation

## Overview

FlowCast is a production-grade FinTech platform focused on future cash-flow visibility and financial decision simulation. It predicts, simulates, and explains future cash flow - not just tracking past expenses.

## Core Principles

1. **Page Responsibilities NEVER Overlap** - Each page has a distinct purpose
2. **No Hardcoded Values** - All financial rules are user-defined
3. **AI Explains, Never Calculates** - Deterministic backend, AI for explanations
4. **Modular Backend** - Separate engines for each concern
5. **Authentication Mandatory** - All protected routes require auth
6. **Docker-Ready** - Environment variables for deployment

## System Architecture

### Backend Layer

#### Models (`/models`)
- `User.js` - User profile with financial settings (income, currency, risk tolerance, safety buffers)
- `Expense.js` - Variable expenses (food, shopping, etc.)
- `FixedExpense.js` - Recurring expenses (rent, EMI, subscriptions)
- `Income.js` - Income sources (salary, freelance, etc.)
- `SavingsGoal.js` - User financial goals

#### Engines (`/lib/engines`)

**1. Rule Engine** (`ruleEngine.js`)
- Manages user-defined safety buffers and thresholds
- Calculates risk levels based on user preferences
- Validates spending decisions
- NO hardcoded percentages

**2. Forecast Engine** (`forecastEngine.js`)
- Predicts end-of-month balance
- Generates day-by-day cash flow timeline
- Projects next 3 months
- Uses time-series logic, not assumptions

**3. Simulation Engine** (`simulationEngine.js`)
- Tests "what-if" scenarios
- Simulates purchases, subscriptions, spending changes
- Calculates goal impact
- **DOES NOT** mutate actual data

**4. Recommendation Engine** (`recommendationEngine.js`)
- Generates logic-based financial recommendations
- Risk scoring (0-100)
- Priority-based suggestions
- NO AI involved - pure deterministic logic

**5. AI Explanation Layer** (`aiEngine.js`)
- Converts structured backend output to natural language
- Uses Google Gemini AI
- **NEVER** calculates or invents numbers
- Only explains results from other engines

### API Routes (`/app/api`)

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

#### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/onboarding` - Save onboarding data

#### Transactions
- `GET /api/expenses` - Get expenses (already exists)
- `POST /api/expenses` - Create expense (already exists)
- `DELETE /api/expenses/[id]` - Delete expense (already exists)

#### Forecasting
- `GET /api/forecast/current-month` - End-of-month prediction
- `GET /api/forecast/timeline` - Day-by-day timeline + 3-month projection

#### Simulation
- `POST /api/simulate/purchase` - Simulate one-time purchase
- (Extensible for subscriptions, category changes, etc.)

#### AI Advisor
- `POST /api/advisor/chat` - Natural language Q&A

#### Goals
- `GET /api/goals` - Get savings goals
- `POST /api/goals` - Create savings goal

### Frontend Pages (`/app`)

#### Public Pages
1. **Landing (/)** 
   - Marketing + onboarding only
   - ❌ NO analytics, charts, or calculations
   - ✅ Problem statement, features, CTAs

#### Protected Pages
2. **Signup (/signup)**
   - User registration
   - Redirects to onboarding

3. **Login (/login)**
   - User authentication

4. **Onboarding (/onboarding)**
   - First-login only
   - Collects income, currency, safety buffers, risk tolerance
   - ALL rules are user-defined

5. **Dashboard (/dashboard)**
   - Past + Present visibility ONLY
   - Current balance, expenses, savings progress
   - ❌ NO future predictions here

6. **Cash-Flow Forecast (/forecast)**
   - Future prediction engine
   - End-of-month balance
   - Day-by-day timeline
   - Next 3 months projection
   - Risk zones visualization

7. **Simulation Lab (/simulate)**
   - "What if I buy this?" testing
   - Shows impact on balance, risk, goals
   - AI explanation of impact
   - Does NOT commit changes

8. **AI Financial Copilot (/advisor)**
   - Natural language chat interface
   - Answers financial questions
   - Explains recommendations
   - Uses context from all engines

9. **Settings (/settings)**
   - Update income, currency
   - Modify safety buffers
   - Change risk tolerance

## Data Flow

### User Journey

```
1. Signup → 2. Onboarding → 3. Dashboard
                                    ↓
                    4. Choose Feature:
                       - Forecast (see future)
                       - Simulate (test decisions)
                       - Advisor (ask questions)
                       - Settings (update rules)
```

### Forecast Generation

```
User Request → API → Forecast Engine
                       ↓
              (Fetch: User, Expenses, Fixed, Income)
                       ↓
              Calculate:
                - Current balance
                - Daily spending rate
                - Fixed expenses remaining
                - Predicted end balance
                - Day-by-day timeline
                       ↓
              Return structured data
```

### Simulation Flow

```
User Input (amount) → API → Simulation Engine
                               ↓
                       Create temp expense
                               ↓
                       Run baseline forecast
                       Run simulated forecast
                               ↓
                       Calculate differences:
                         - Balance change
                         - Risk change
                         - Goal delay
                               ↓
                       AI Engine → Natural explanation
                               ↓
                       Return: numbers + explanation
```

### AI Advisor Flow

```
User Question → API → Build Financial Context
                         ↓
                  (Gather: balance, forecast, goals)
                         ↓
                  AI Engine (Gemini)
                         ↓
                  Prompt: "Use ONLY this data: {...}"
                         ↓
                  AI generates explanation
                         ↓
                  Return natural language answer
```

## Security

### Authentication
- JWT tokens stored in HTTP-only cookies
- bcrypt password hashing (10 rounds)
- Protected routes verified on every request

### Data Isolation
- All queries filtered by `userId`
- User cannot access other user's data

### Environment Variables
- Secrets in environment, never in code
- `.env.example` for documentation
- Validation on startup

## Deployment

### Requirements
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key (optional for AI features)

### Environment Setup

```bash
# Copy and fill environment variables
cp .env.example .env.local

# Install dependencies
npm install

# Run development server
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Docker (Future)
- Dockerfile ready
- docker-compose.yml for services
- Environment variables via Docker secrets

## Testing Strategy

### Unit Tests (Recommended)
- Test each engine independently
- Mock data for predictable results
- Validate calculations

### Integration Tests (Recommended)
- Test API routes end-to-end
- Verify auth middleware
- Check data isolation

### E2E Tests (Recommended)
- Full user flows
- Signup → Onboarding → Features
- Verify UI interactions

## Extensibility

### Adding New Features

**1. New Simulation Type (e.g., Subscription)**
```javascript
// lib/engines/simulationEngine.js
simulateSubscription(amount, frequency) {
  // Implementation
}
```
```javascript
// app/api/simulate/subscription/route.js
export async function POST(request) {
  // Call simulationEngine.simulateSubscription()
}
```

**2. New Financial Rule**
```javascript
// lib/engines/ruleEngine.js
checkCustomRule(value, threshold) {
  // User-defined rule logic
}
```

**3. New AI Question Type**
```javascript
// lib/engines/aiEngine.js
explainCustomScenario(data) {
  // Build prompt with structured data
  // Call Gemini API
}
```

## Monitoring & Observability

### Logging (Recommended)
- Request/response logging
- Error tracking (Sentry, etc.)
- Performance metrics

### Analytics (Recommended)
- User behavior tracking
- Feature usage stats
- Conversion funnels

### Alerts (Recommended)
- API error rates
- Slow queries
- Failed auth attempts

## Future Enhancements

1. **Bank Integration** - Connect real accounts
2. **Recurring Expense Detection** - Auto-identify fixed expenses
3. **Budget Tracking** - Monthly budget vs actual
4. **Multi-Currency** - Real-time exchange rates
5. **Family Accounts** - Shared finances
6. **Mobile App** - React Native
7. **Email/SMS Alerts** - Threshold notifications
8. **Export Reports** - PDF, CSV downloads
9. **Investment Tracking** - Portfolio management
10. **Tax Optimization** - Smart tax suggestions

## Contributing

See main README.md for contribution guidelines.

## License

See LICENSE file.

---

Built with ❤️ for better financial intelligence.
