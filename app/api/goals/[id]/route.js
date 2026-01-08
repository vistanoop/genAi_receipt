import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Goal from '@/models/Goal';
import { requireAuth } from '@/lib/auth';
import mongoose from 'mongoose';

// GET single goal
export async function GET(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid goal ID' },
        { status: 400 }
      );
    }

    const goal = await Goal.findOne({ _id: id, userId: auth.userId });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
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
          estimatedCompletionDate: goal.estimatedCompletionDate,
          createdAt: goal.createdAt,
          updatedAt: goal.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get goal error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goal' },
      { status: 500 }
    );
  }
}

// PUT update goal
export async function PUT(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid goal ID' },
        { status: 400 }
      );
    }

    const updates = await request.json();
    const allowedUpdates = [
      'name',
      'description',
      'targetAmount',
      'currentAmount',
      'monthlyContribution',
      'targetDate',
      'priority',
      'type',
      'status',
    ];

    const updateData = {};
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    // Validate amounts
    if (updateData.targetAmount !== undefined && updateData.targetAmount <= 0) {
      return NextResponse.json(
        { error: 'Target amount must be positive' },
        { status: 400 }
      );
    }

    if (updateData.currentAmount !== undefined && updateData.currentAmount < 0) {
      return NextResponse.json(
        { error: 'Current amount cannot be negative' },
        { status: 400 }
      );
    }

    if (updateData.monthlyContribution !== undefined && updateData.monthlyContribution < 0) {
      return NextResponse.json(
        { error: 'Monthly contribution cannot be negative' },
        { status: 400 }
      );
    }

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId: auth.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // If goal is completed, set completion date
    if (updateData.status === 'completed' && !goal.completedDate) {
      goal.completedDate = new Date();
      await goal.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Goal updated successfully',
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
      { status: 200 }
    );
  } catch (error) {
    console.error('Update goal error:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

// DELETE goal
export async function DELETE(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid goal ID' },
        { status: 400 }
      );
    }

    const goal = await Goal.findOneAndDelete({ _id: id, userId: auth.userId });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Goal deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete goal error:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}
