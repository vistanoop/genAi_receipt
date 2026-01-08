import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Goal from '@/models/Goal';
import { requireAuth } from '@/lib/auth';

// GET all goals for the logged-in user
export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query = { userId: auth.userId };
    if (status) query.status = status;

    const goals = await Goal.find(query).sort({ priority: -1, targetDate: 1 });

    return NextResponse.json(
      {
        success: true,
        goals: goals.map(goal => ({
          id: goal._id,
          name: goal.name,
          description: goal.description,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          monthlyContribution: goal.monthlyContribution,
          targetDate: goal.targetDate,
          priority: goal.priority,
          type: goal.type,
          status: goal.status,
          progressPercentage: goal.progressPercentage,
          remainingAmount: goal.remainingAmount,
          estimatedCompletionDate: goal.estimatedCompletionDate,
          createdAt: goal.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get goals error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

// POST create a new goal
export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const data = await request.json();
    const {
      name,
      description,
      targetAmount,
      currentAmount,
      monthlyContribution,
      targetDate,
      priority,
      type,
    } = data;

    // Validate input
    if (!name || !targetAmount || !monthlyContribution || !targetDate) {
      return NextResponse.json(
        { error: 'Please provide name, target amount, monthly contribution, and target date' },
        { status: 400 }
      );
    }

    if (targetAmount <= 0 || monthlyContribution < 0) {
      return NextResponse.json(
        { error: 'Amounts must be positive' },
        { status: 400 }
      );
    }

    // Create goal
    const goal = await Goal.create({
      userId: auth.userId,
      name,
      description,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      monthlyContribution: parseFloat(monthlyContribution),
      targetDate: new Date(targetDate),
      priority: priority || 'medium',
      type: type || 'short-term',
      status: 'active',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Goal created successfully',
        goal: {
          id: goal._id,
          name: goal.name,
          description: goal.description,
          targetAmount: goal.targetAmount,
          currentAmount: goal.currentAmount,
          monthlyContribution: goal.monthlyContribution,
          targetDate: goal.targetDate,
          priority: goal.priority,
          type: goal.type,
          status: goal.status,
          progressPercentage: goal.progressPercentage,
          remainingAmount: goal.remainingAmount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create goal error:', error);
    return NextResponse.json(
      { error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}
