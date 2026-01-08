import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Expense from '@/models/Expense';
import FixedExpense from '@/models/FixedExpense';
import Income from '@/models/Income';
import { verifyAuth } from '@/lib/auth';
import { ForecastEngine } from '@/lib/engines/forecastEngine';

/**
 * GET /api/forecast/timeline
 * Get day-by-day cash flow timeline for current month
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

    // Generate daily timeline
    const timeline = forecastEngine.generateDailyTimeline();

    // Get next 3 months prediction
    const nextMonths = forecastEngine.predictNextMonths(3);

    return NextResponse.json({
      success: true,
      timeline,
      nextMonths,
    });
  } catch (error) {
    console.error('Error generating timeline:', error);
    return NextResponse.json(
      { error: 'Failed to generate timeline' },
      { status: 500 }
    );
  }
}
