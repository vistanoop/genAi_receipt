# FlowCast - AI-Powered Financial Expense Manager 💰

**Track your spending, scan receipts with AI, and understand your financial patterns.**

FlowCast is an intelligent expense management platform that helps you track your spending, categorize expenses, and gain insights into your financial habits with AI-powered receipt scanning.

## 🚀 Complete Setup Guide

### Prerequisites

Before starting, ensure you have:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/downloads)

### Step 1: Clone the Repository

```bash
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt
```

### Step 2: Backend Setup

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

```env
# MongoDB Connection
# Local MongoDB (make sure MongoDB is running on your machine)
MONGODB_URI=mongodb://localhost:27017/genai-receipt

# JWT Secret (IMPORTANT: Change this to a strong random string)
# Generate a secure secret: openssl rand -base64 32
JWT_SECRET=your-very-strong-secret-key-change-this-in-production

# Server Configuration
PORT=5001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Important Notes:**
- Make sure MongoDB is installed and running before starting the backend
- To start MongoDB locally: `mongod` or `brew services start mongodb-community` (macOS)
- Change `JWT_SECRET` to a strong random string for security
- Default port is 5001, change if needed

#### Start the Backend Server

```bash
# From the backend directory
npm run dev
```

You should see:
```
Server running on port 5001
Environment: development
MongoDB Connected: localhost
```

### Step 3: Frontend Setup

```bash
# Go back to the root directory
cd ..

# Install frontend dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

#### Configure Frontend Environment Variables

Edit `.env.local` in the root directory:

```env
# MongoDB Connection (for Next.js API routes, if used)
MONGODB_URI=mongodb://localhost:27017/genai-receipt

# JWT Secret (must match backend JWT_SECRET)
JWT_SECRET=your-very-strong-secret-key-change-this-in-production

# Optional: Google Gemini AI API Key for receipt scanning
# Get your API key from: https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here
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

### Step 4: Verify Setup

1. **Backend is running**: [http://localhost:5001](http://localhost:5001) should show API information
2. **Frontend is running**: [http://localhost:3000](http://localhost:3000) should show the login page
3. **MongoDB is connected**: Backend console should show "MongoDB Connected"

### Troubleshooting

#### MongoDB Connection Issues
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

## ✨ Key Features

### 🔐 Authentication System
- Secure user signup and login
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and sessions

### 💰 Expense Management
- Add expenses manually with detailed information
- Categorize spending (groceries, food, shopping, etc.)
- View real-time expense statistics
- Delete and manage existing expenses
- Visual spending breakdown with charts

### 📊 Analytics & Insights
- Total spending overview
- Spending by category (pie chart visualization)
- Average expense calculation
- Transaction history timeline

### 🤖 AI-Powered Features (Optional)
- Receipt scanning with Google Gemini AI
- Automatic expense extraction from receipts
- Smart categorization

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
