import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Expense from '@/models/Expense';
import FixedExpense from '@/models/FixedExpense';
import Income from '@/models/Income';
import SavingsGoal from '@/models/SavingsGoal';
import { verifyAuth } from '@/lib/auth';
import { ForecastEngine } from '@/lib/engines/forecastEngine';

/**
 * GET /api/forecast/current-month
 * Predict end-of-month balance and cash flow
 */
export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Fetch all required data
    const [userProfile, expenses, fixedExpenses, incomes] = await Promise.all([
      User.findById(user.userId).select('-password'),
      Expense.find({ userId: user.userId }).sort({ date: -1 }),
      FixedExpense.find({ userId: user.userId, isActive: true }),
      Income.find({ userId: user.userId }).sort({ date: -1 }),
    ]);

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize forecast engine
    const forecastEngine = new ForecastEngine(
      userProfile,
      fixedExpenses,
      expenses,
      incomes
    );

    // Get predictions
    const endOfMonthPrediction = forecastEngine.predictEndOfMonth();
    const burnRate = forecastEngine.calculateBurnRate();

    return NextResponse.json({
      success: true,
      forecast: {
        currentBalance: endOfMonthPrediction.currentBalance,
        predictedEndBalance: endOfMonthPrediction.predictedEndBalance,
        breakdown: endOfMonthPrediction.breakdown,
        burnRate,
      },
    });
  } catch (error) {
    console.error('Error generating forecast:', error);
    return NextResponse.json(
      { error: 'Failed to generate forecast' },
      { status: 500 }
    );
  }
}
