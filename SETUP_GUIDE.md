# FlowCast Setup Guide

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Git installed

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and configure the following:

#### MongoDB Connection

**Option A: Local MongoDB (Recommended for Development)**

```env
MONGODB_URI=mongodb://localhost:27017/genai-receipt
```

**Option B: MongoDB Atlas (Cloud)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace the connection string in `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/genai-receipt?retryWrites=true&w=majority
```

#### JWT Secret

Generate a secure random string for JWT authentication:

```env
JWT_SECRET=your-super-secret-key-change-this-in-production
```

You can generate a random key using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Gemini AI API Key (Optional)

The receipt scanning feature uses Google's Gemini AI. To enable it:

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to `.env.local`:

```env
GEMINI_API_KEY=your-gemini-api-key-here
```

> **Note**: The app works without the Gemini API key, but receipt scanning will not be available.

### 4. Start MongoDB (if using local)

If you're using local MongoDB, make sure it's running:

**MacOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
```bash
net start MongoDB
```

### 5. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## First Time Setup

### Create Your Account

1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Get Started" or navigate to `/signup`
3. Fill in your details:
   - Full Name
   - Email Address
   - Password (minimum 8 characters, must include uppercase, lowercase, and number)
4. Click "Create Account"

You'll be automatically logged in and redirected to your dashboard.

### Add Your First Expense

1. On the dashboard, use the "Add New Expense" form
2. Fill in:
   - **Amount**: The expense amount in ₹
   - **Category**: Select from the dropdown (groceries, food, shopping, etc.)
   - **Description**: Brief description of the expense
   - **Date**: Date of the expense
3. Click "Add Expense"

### View Your Spending

- **Stats Cards**: See total expenses, number of categories, and average expense
- **Pie Chart**: Visual breakdown of spending by category
- **Recent Expenses List**: All your expenses with delete option

## Building for Production

```bash
npm run build
npm start
```

## Common Issues

### MongoDB Connection Error

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**Solution**: 
- Make sure MongoDB is running
- Check your connection string in `.env.local`
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Kill the process using port 3000
npx kill-port 3000
# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found

**Error**: `Module not found: Can't resolve '@/...'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Project Structure

```
genAi_receipt/
├── app/
│   ├── api/           # API routes
│   │   ├── auth/      # Authentication endpoints
│   │   └── expenses/  # Expense management endpoints
│   ├── dashboard/     # Dashboard page
│   ├── login/         # Login page
│   ├── signup/        # Signup page
│   └── page.js        # Landing page
├── components/        # React components
├── lib/              # Utilities and libraries
│   ├── db.js         # MongoDB connection
│   ├── auth.js       # Authentication middleware
│   └── jwt.js        # JWT token handling
├── models/           # Mongoose models
│   ├── User.js       # User model
│   └── Expense.js    # Expense model
└── public/           # Static assets
```

## Features

### Authentication
- ✅ User signup with email and password
- ✅ Secure login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Protected dashboard routes

### Expense Management
- ✅ Add expenses with amount, category, description, and date
- ✅ View all expenses in a clean list
- ✅ Delete expenses with confirmation
- ✅ Real-time expense statistics
- ✅ Visual spending breakdown (pie chart)

### User Experience
- ✅ Modern, responsive UI with dark mode support
- ✅ Toast notifications for all actions
- ✅ Loading states and error handling
- ✅ Form validation

### AI Features (Optional)
- 📸 Receipt scanning with Gemini AI (requires API key)
- 🤖 Automatic expense extraction from receipts

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/vistanoop/genAi_receipt/issues)
- Review this documentation
- Check the console for error messages

## License

MIT License - See LICENSE file for details
