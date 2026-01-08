import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SavingsGoal from '@/models/SavingsGoal';
import { verifyAuth } from '@/lib/auth';

/**
 * GET /api/goals
 * Get all savings goals for the user
 */
export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const goals = await SavingsGoal.find({ userId: user.userId }).sort({ priority: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      goals,
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/goals
 * Create a new savings goal
 */
export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      targetAmount,
      currentAmount = 0,
      monthlyContribution = 0,
      targetDate,
      priority = 'medium',
      type = 'other',
    } = body;

    // Validation
    if (!name || !targetAmount || !targetDate) {
      return NextResponse.json(
        { error: 'Name, target amount, and target date are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const goal = await SavingsGoal.create({
      userId: user.userId,
      name,
      targetAmount,
      currentAmount,
      monthlyContribution,
      targetDate,
      priority,
      type,
    });

    return NextResponse.json({
      success: true,
      goal,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}
