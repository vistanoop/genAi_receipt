# GenAI Receipt - Backend API

Node.js/Express backend server for the GenAI Receipt expense tracking application.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas connection string)

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong secret key for JWT tokens
   - `PORT`: Server port (default: 5001)
   - `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)

4. **Start MongoDB** (if running locally):
   ```bash
   # On Linux/Mac
   sudo systemctl start mongod
   
   # Or using MongoDB Compass
   # Start MongoDB Compass application
   ```

5. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5001` (or the port specified in .env)

## 📚 API Documentation

### Base URL
```
http://localhost:5001/api
```

### Authentication Endpoints

#### POST /api/auth/signup
Register a new user
```json
Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user
```json
Request Body:
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/logout
Logout user (clears token cookie)

#### GET /api/auth/me
Get current logged-in user (requires authentication)

### User Endpoints

#### GET /api/user/profile
Get user profile (requires authentication)

#### PUT /api/user/profile
Update user profile (requires authentication)
```json
Request Body:
{
  "name": "John Doe",
  "monthlyIncome": 50000,
  "currency": "INR",
  "minimumBalanceThreshold": 5000,
  "monthlySavingsFloor": 5000,
  "riskTolerance": "medium",
  "onboardingCompleted": true
}
```

### Expense Endpoints

#### GET /api/expenses
Get all expenses for the logged-in user (requires authentication)

#### GET /api/expenses/:id
Get a specific expense by ID (requires authentication)

#### POST /api/expenses
Create a new expense (requires authentication)
```json
Request Body:
{
  "amount": 1500,
  "category": "groceries",
  "description": "Monthly groceries",
  "date": "2024-01-15"
}
```

#### PUT /api/expenses/:id
Update an expense (requires authentication)

#### DELETE /api/expenses/:id
Delete an expense (requires authentication)

### Income Endpoints

#### GET /api/income
Get all income records (requires authentication)

#### POST /api/income
Create a new income record (requires authentication)
```json
Request Body:
{
  "amount": 50000,
  "source": "salary",
  "description": "Monthly salary",
  "frequency": "monthly",
  "isRecurring": true,
  "date": "2024-01-01"
}
```

#### DELETE /api/income/:id
Delete an income record (requires authentication)

### Fixed Expense Endpoints

#### GET /api/fixed-expenses
Get all fixed expenses (requires authentication)

#### POST /api/fixed-expenses
Create a new fixed expense (requires authentication)
```json
Request Body:
{
  "name": "Rent",
  "amount": 15000,
  "category": "rent",
  "dueDay": 1,
  "description": "Monthly rent"
}
```

#### PUT /api/fixed-expenses/:id
Update a fixed expense (requires authentication)

#### DELETE /api/fixed-expenses/:id
Delete a fixed expense (requires authentication)

### Savings Goal Endpoints

#### GET /api/goals
Get all savings goals (requires authentication)

#### POST /api/goals
Create a new savings goal (requires authentication)
```json
Request Body:
{
  "name": "Emergency Fund",
  "targetAmount": 100000,
  "currentAmount": 20000,
  "monthlyContribution": 5000,
  "targetDate": "2025-12-31",
  "priority": "high",
  "type": "emergency-fund"
}
```

#### PUT /api/goals/:id
Update a savings goal (requires authentication)

#### DELETE /api/goals/:id
Delete a savings goal (requires authentication)

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Tokens are stored in HTTP-only cookies for security.

**To authenticate requests:**
- The token is automatically sent via cookies for same-origin requests
- For cross-origin requests, include the token in the Authorization header:
  ```
  Authorization: Bearer <your-token>
  ```

## 📦 Tech Stack

- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🗂️ Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── middleware/
│   └── auth.js            # Authentication middleware
├── models/
│   ├── User.js            # User model
│   ├── Expense.js         # Expense model
│   ├── Income.js          # Income model
│   ├── FixedExpense.js    # Fixed expense model
│   └── SavingsGoal.js     # Savings goal model
├── routes/
│   ├── auth.js            # Auth routes
│   ├── user.js            # User routes
│   ├── expenses.js        # Expense routes
│   ├── income.js          # Income routes
│   ├── fixedExpenses.js   # Fixed expense routes
│   └── goals.js           # Savings goal routes
├── utils/
│   └── jwt.js             # JWT utilities
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore file
├── package.json           # Dependencies
├── README.md              # Documentation
└── server.js              # Main server file
```

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token-based authentication
- HTTP-only cookies for token storage
- CORS protection
- Input validation
- MongoDB injection prevention

## 🧪 Testing

You can test the API using:
- **Postman** - Import the API endpoints
- **cURL** - Command line testing
- **Thunder Client** (VS Code extension)

### Example cURL Request:
```bash
# Signup
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get expenses (with token)
curl -X GET http://localhost:5001/api/expenses \
  -H "Authorization: Bearer <your-token>"
```

## 🚧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env` file
- Verify MongoDB is accessible on the specified port

### Port Already in Use
- Change the PORT in `.env` file
- Kill existing process: `lsof -ti:5001 | xargs kill -9`

### CORS Errors
- Update `FRONTEND_URL` in `.env` to match your frontend URL
- Ensure credentials are included in frontend requests

## 📝 License

MIT License

---

**Made with ❤️ for GenAI Receipt**
