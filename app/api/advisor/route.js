import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import FinancialProfile from '@/models/FinancialProfile';
import Transaction from '@/models/Transaction';
import Goal from '@/models/Goal';
import { requireAuth } from '@/lib/auth';
import { generateRecommendations, calculateRiskScore, simulateCashFlow } from '@/lib/financialEngine';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// POST chat with AI financial copilot
export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    if (!genAI) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please set GEMINI_API_KEY.' },
        { status: 503 }
      );
    }

    await connectDB();

    const data = await request.json();
    const { message, includeContext = true } = data;

    if (!message) {
      return NextResponse.json(
        { error: 'Please provide a message' },
        { status: 400 }
      );
    }

    // Get user financial context
    const user = await User.findById(auth.userId);
    const financialProfile = await FinancialProfile.findOne({ userId: auth.userId });
    
    if (!user || !financialProfile) {
      return NextResponse.json(
        { error: 'Please complete onboarding first' },
        { status: 400 }
      );
    }

    // Get recent transactions
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const transactions = await Transaction.find({
      userId: auth.userId,
      date: { $gte: startOfMonth },
    }).sort({ date: -1 }).limit(50);

    // Calculate current balance
    let currentBalance = 0;
    transactions.forEach(t => {
      if (t.type === 'income') {
        currentBalance += t.amount;
      } else if (t.type === 'expense') {
        currentBalance -= t.amount;
      }
    });

    // Get active goals
    const goals = await Goal.find({ userId: auth.userId, status: 'active' });

    // Calculate financial metrics
    const totalFixedExpenses = financialProfile.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalVariableExpenses = financialProfile.variableExpenseCategories.reduce((sum, e) => sum + e.monthlyBudget, 0);
    const totalMonthlyExpenses = totalFixedExpenses + totalVariableExpenses;

    const emergencyBuffer = financialProfile.safetyBuffers?.minimumBalance || 10000;

    // Calculate risk score
    const riskScore = calculateRiskScore({
      currentBalance,
      monthlyIncome: user.monthlyIncome,
      monthlyExpenses: totalMonthlyExpenses,
      emergencyBuffer,
    });

    // Generate cash flow projection
    const income = [{ id: 1, name: 'Monthly Income', amount: user.monthlyIncome, dayOfMonth: 1, type: 'fixed' }];
    const fixedExpenses = financialProfile.fixedExpenses.map((exp, idx) => ({
      id: idx + 1,
      name: exp.name,
      amount: exp.amount,
      dayOfMonth: exp.dayOfMonth,
      category: exp.category,
    }));
    const variableExpenses = financialProfile.variableExpenseCategories.map((exp, idx) => ({
      id: idx + 1,
      name: exp.name,
      amount: exp.monthlyBudget,
      category: exp.category,
    }));

    const today = new Date();
    const projections = simulateCashFlow({
      startBalance: currentBalance,
      startDate: today.toISOString().split('T')[0],
      days: 30,
      income,
      fixedExpenses,
      variableExpenses,
      emergencyBuffer,
    });

    // Generate recommendations
    const recommendations = generateRecommendations(
      {
        currentBalance,
        monthlyIncome: user.monthlyIncome,
        monthlyExpenses: totalMonthlyExpenses,
        emergencyBuffer,
        variableExpenses,
        goals,
      },
      projections
    );

    // Build context for AI
    let contextPrompt = '';
    if (includeContext) {
      contextPrompt = `
You are a helpful financial advisor AI. You have access to the user's financial data and must provide accurate, helpful advice based ONLY on this data. Never invent numbers or make assumptions beyond what's provided.

IMPORTANT RULES:
1. You are explaining financial calculations that have already been done by the backend system
2. DO NOT calculate or predict any financial numbers yourself
3. Use ONLY the data provided below to answer questions
4. Be conversational, empathetic, and helpful
5. Explain financial concepts in simple terms
6. When discussing risks or recommendations, refer to the data provided

USER'S FINANCIAL CONTEXT:
- Monthly Income: ${user.currency} ${user.monthlyIncome.toLocaleString()}
- Current Balance: ${user.currency} ${currentBalance.toLocaleString()}
- Total Monthly Expenses: ${user.currency} ${totalMonthlyExpenses.toLocaleString()}
  - Fixed Expenses: ${user.currency} ${totalFixedExpenses.toLocaleString()}
  - Variable Expenses: ${user.currency} ${totalVariableExpenses.toLocaleString()}
- Monthly Savings: ${user.currency} ${(user.monthlyIncome - totalMonthlyExpenses).toLocaleString()}
- Emergency Buffer Target: ${user.currency} ${emergencyBuffer.toLocaleString()}
- Risk Tolerance: ${financialProfile.riskTolerance}

FINANCIAL HEALTH:
- Risk Score: ${riskScore.score}/100 (${riskScore.level})
- Risk Breakdown:
  - Balance Adequacy: ${riskScore.breakdown.balanceAdequacy}/40
  - Income Stability: ${riskScore.breakdown.incomeStability}/30
  - Expense Predictability: ${riskScore.breakdown.expensePredictability}/20
  - Safety Margin: ${riskScore.breakdown.safetyMargin}/10

ACTIVE GOALS:
${goals.map(g => `- ${g.name}: ${g.currentAmount}/${g.targetAmount} (${g.progressPercentage.toFixed(1)}% complete)`).join('\n')}

RECOMMENDATIONS FROM SYSTEM:
${recommendations.map(r => `- [${r.priority}] ${r.title}: ${r.description}`).join('\n')}

RECENT TRANSACTIONS (last ${transactions.length}):
${transactions.slice(0, 10).map(t => `- ${t.date.toLocaleDateString()}: ${t.type === 'income' ? '+' : '-'}${user.currency} ${t.amount} (${t.category}) - ${t.description}`).join('\n')}

END-OF-MONTH PROJECTION:
- Projected Balance: ${user.currency} ${projections[projections.length - 1]?.balance.toLocaleString() || 'N/A'}
- Days in Risk Zone: ${projections.filter(p => p.isRiskZone).length} out of ${projections.length}

Now, answer the user's question using this context. Be helpful, clear, and empathetic.
`;
    }

    // Get AI response
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const fullPrompt = contextPrompt + '\n\nUSER QUESTION: ' + message;
    const result = await chat.sendMessage(fullPrompt);
    const response = result.response;
    const aiResponse = response.text();

    return NextResponse.json(
      {
        success: true,
        response: aiResponse,
        context: includeContext ? {
          currentBalance,
          monthlyIncome: user.monthlyIncome,
          monthlyExpenses: totalMonthlyExpenses,
          riskScore,
          recommendations: recommendations.slice(0, 3), // Top 3 recommendations
        } : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('AI Advisor error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}

// GET recommendations without AI chat
export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    // Get user financial data
    const user = await User.findById(auth.userId);
    const financialProfile = await FinancialProfile.findOne({ userId: auth.userId });

    if (!user || !financialProfile) {
      return NextResponse.json(
        { error: 'Please complete onboarding first' },
        { status: 400 }
      );
    }

    // Get recent transactions
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const transactions = await Transaction.find({
      userId: auth.userId,
      date: { $gte: startOfMonth },
    });

    // Calculate current balance
    let currentBalance = 0;
    transactions.forEach(t => {
      if (t.type === 'income') {
        currentBalance += t.amount;
      } else if (t.type === 'expense') {
        currentBalance -= t.amount;
      }
    });

    // Get active goals
    const goals = await Goal.find({ userId: auth.userId, status: 'active' });

    // Calculate financial metrics
    const totalFixedExpenses = financialProfile.fixedExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalVariableExpenses = financialProfile.variableExpenseCategories.reduce((sum, e) => sum + e.monthlyBudget, 0);
    const totalMonthlyExpenses = totalFixedExpenses + totalVariableExpenses;
    const emergencyBuffer = financialProfile.safetyBuffers?.minimumBalance || 10000;

    // Generate projections
    const income = [{ id: 1, name: 'Monthly Income', amount: user.monthlyIncome, dayOfMonth: 1, type: 'fixed' }];
    const fixedExpenses = financialProfile.fixedExpenses.map((exp, idx) => ({
      id: idx + 1,
      name: exp.name,
      amount: exp.amount,
      dayOfMonth: exp.dayOfMonth,
      category: exp.category,
    }));
    const variableExpenses = financialProfile.variableExpenseCategories.map((exp, idx) => ({
      id: idx + 1,
      name: exp.name,
      amount: exp.monthlyBudget,
      category: exp.category,
    }));

    const today = new Date();
    const projections = simulateCashFlow({
      startBalance: currentBalance,
      startDate: today.toISOString().split('T')[0],
      days: 30,
      income,
      fixedExpenses,
      variableExpenses,
      emergencyBuffer,
    });

    // Generate recommendations
    const recommendations = generateRecommendations(
      {
        currentBalance,
        monthlyIncome: user.monthlyIncome,
        monthlyExpenses: totalMonthlyExpenses,
        emergencyBuffer,
        variableExpenses,
        goals,
      },
      projections
    );

    return NextResponse.json(
      {
        success: true,
        recommendations,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get recommendations error:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
