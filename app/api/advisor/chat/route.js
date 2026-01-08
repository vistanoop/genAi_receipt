import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Expense from '@/models/Expense';
import FixedExpense from '@/models/FixedExpense';
import Income from '@/models/Income';
import SavingsGoal from '@/models/SavingsGoal';
import { verifyAuth } from '@/lib/auth';
import { ForecastEngine } from '@/lib/engines/forecastEngine';
import { AIExplanationEngine } from '@/lib/engines/aiEngine';

/**
 * POST /api/advisor/chat
 * AI Financial Copilot - Answer user questions
 */
export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { question } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      );
    }

    await connectDB();

    // Fetch all financial context
    const [userProfile, expenses, fixedExpenses, incomes, savingsGoals] = await Promise.all([
      User.findById(user.userId).select('-password'),
      Expense.find({ userId: user.userId }).sort({ date: -1 }),
      FixedExpense.find({ userId: user.userId, isActive: true }),
      Income.find({ userId: user.userId }).sort({ date: -1 }),
      SavingsGoal.find({ userId: user.userId }),
    ]);

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Generate forecast for context
    const forecastEngine = new ForecastEngine(
      userProfile,
      fixedExpenses,
      expenses,
      incomes
    );

    const endOfMonth = forecastEngine.predictEndOfMonth();
    const burnRate = forecastEngine.calculateBurnRate();

    // Build financial context for AI
    const aiEngine = new AIExplanationEngine(process.env.GEMINI_API_KEY);
    const financialContext = aiEngine.buildFinancialContext(
      userProfile,
      expenses,
      incomes,
      savingsGoals,
      {
        ...endOfMonth,
        burnRate,
        riskLevel: 'moderate', // Would come from RuleEngine
      }
    );

    // Get AI response
    const answer = await aiEngine.answerFinancialQuestion(question, financialContext);

    return NextResponse.json({
      success: true,
      answer,
      context: financialContext,
    });
  } catch (error) {
    console.error('Error in AI advisor:', error);
    return NextResponse.json(
      { error: 'Failed to process question' },
      { status: 500 }
    );
  }
}
