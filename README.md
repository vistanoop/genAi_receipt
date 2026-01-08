# FlowCast - AI-Powered Financial Expense Manager 💰

**Track your spending, scan receipts with AI, and understand your financial patterns.**

FlowCast is an intelligent expense management platform that helps you track your spending, categorize expenses, and gain insights into your financial habits with AI-powered receipt scanning.

## 🚀 Quick Start

**[📖 Read the Complete Setup Guide](./SETUP_GUIDE.md)**

### Frontend Quick Installation

```bash
# Clone the repository
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt

# Install dependencies
npm install

# Setup environment variables
cp .env.local.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# Run the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to get started!

### Backend Quick Installation (Standalone Server)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret

# Run the backend server
npm run dev
```

Backend API will be available at [http://localhost:5001](http://localhost:5001)

**[📖 Read Backend Documentation](./backend/README.md)** for detailed API reference.

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

## 📖 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Complete installation instructions
- **[Backend Documentation](./backend/README.md)** - Standalone backend setup and API reference
- **[Backend Implementation Summary](./BACKEND_IMPLEMENTATION.md)** - Complete backend architecture overview

- **[Setup Guide](./SETUP_GUIDE.md)** - Complete installation instructions
- **[API Documentation](./API_DOCS.md)** - Backend API reference (coming soon)

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

## 📝 Environment Variables

Required variables in `.env.local`:

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/genai-receipt

# JWT secret for authentication
JWT_SECRET=your-secret-key-here

# Optional: Gemini AI for receipt scanning
GEMINI_API_KEY=your-gemini-api-key
```

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
