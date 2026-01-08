# 🚀 SpendAhead - AI-Powered Financial Intelligence Platform

> A comprehensive expense tracking and financial planning application with AI-powered receipt scanning, predictive analytics, and smart recommendations.

![Next.js](https://img.shields.io/badge/Next.js-15.5.9-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green?logo=mongodb)
![Express](https://img.shields.io/badge/Express-4.18-lightgrey?logo=express)

---

## 📖 Complete Documentation

**[→ View Complete Documentation (DOCUMENTATION.md)](./DOCUMENTATION.md)**

The comprehensive documentation includes:

- 🎯 **Project Overview** - Detailed project description and goals
- ✨ **Key Features** - All features with detailed explanations
- 🛠 **Technology Stack** - Complete tech stack breakdown
- 🏗 **System Architecture** - Architecture diagrams and data flow
- 💾 **Database Schema** - ER diagrams and schema details
- 🔐 **Authentication Flow** - Security and authentication diagrams
- 📡 **API Documentation** - Complete API endpoint reference
- 🎨 **Frontend Structure** - Component hierarchy and routing
- ⚙️ **Setup & Installation** - Step-by-step installation guide
- 🔄 **Development Workflow** - Development best practices
- 🚀 **Deployment Guide** - Production deployment instructions
- 🎯 **Feature Descriptions** - Detailed feature breakdowns
- 🔒 **Security Considerations** - Security best practices
- 🔧 **Troubleshooting** - Common issues and solutions

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB 6+
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/vistanoop/genAi_receipt.git
cd genAi_receipt

# Install dependencies
npm install
cd backend && npm install && cd ..

# Configure environment variables
# Create .env.local in root
# Create .env in backend/

# Start MongoDB
mongod

# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
npm run dev
```

### Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🌟 Key Features

- 🔐 **Secure Authentication** - JWT-based auth with bcrypt hashing
- 💰 **Expense Tracking** - Full CRUD operations with categorization
- 🎯 **Goal Planning** - Set and track financial goals
- 🤖 **AI Receipt Scanning** - Google Gemini AI-powered extraction
- 📊 **Analytics & Visualization** - Interactive charts and insights
- 💡 **Smart Recommendations** - Personalized financial advice
- 🎮 **What-If Simulator** - Test financial scenarios
- 🌙 **Dark Mode** - Full theme support

---

## 📚 Technology Stack

**Frontend:**
- Next.js 15.5.9 with App Router
- React 19
- Tailwind CSS
- Framer Motion
- Recharts

**Backend:**
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Google Gemini AI

---

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Login page
│   └── signup/           # Signup page
├── backend/               # Express backend
│   ├── controllers/      # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   └── middleware/      # Auth middleware
├── components/           # React components
├── lib/                 # Utility functions
└── DOCUMENTATION.md     # Complete documentation
```

---

## 🔗 Links

- **[Complete Documentation](./DOCUMENTATION.md)** - Comprehensive guide with diagrams
- **[GitHub Repository](https://github.com/vistanoop/genAi_receipt)** - Source code
- **[Setup Guide](./DOCUMENTATION.md#setup--installation)** - Detailed setup instructions
- **[API Reference](./DOCUMENTATION.md#api-documentation)** - Complete API docs
- **[Troubleshooting](./DOCUMENTATION.md#troubleshooting)** - Common issues and solutions

---

## 🤝 Contributing

Contributions are welcome! Please read the [complete documentation](./DOCUMENTATION.md) first.

```bash
# Fork the repository
# Create feature branch
git checkout -b feature/amazing-feature

# Commit changes
git commit -m 'feat: add amazing feature'

# Push and create PR
git push origin feature/amazing-feature
```

---

## 📄 License

ISC License - See LICENSE file for details

---

## 📞 Support

For detailed information, troubleshooting, and guides, please refer to:

**[→ DOCUMENTATION.md](./DOCUMENTATION.md)**

---

**Built with ❤️ using Next.js, React, Express, MongoDB, and Google Gemini AI**
