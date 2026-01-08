import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import FinancialProfile from '@/models/FinancialProfile';
import { requireAuth } from '@/lib/auth';

// GET user profile with financial data
export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const user = await User.findById(auth.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const financialProfile = await FinancialProfile.findOne({ userId: auth.userId });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          monthlyIncome: user.monthlyIncome,
          currency: user.currency,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
          createdAt: user.createdAt,
        },
        financialProfile: financialProfile || null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// PUT update user profile
export async function PUT(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const updates = await request.json();
    const { monthlyIncome, currency } = updates;

    // Validate updates
    const allowedUpdates = {};
    if (monthlyIncome !== undefined) {
      if (monthlyIncome < 0) {
        return NextResponse.json(
          { error: 'Monthly income must be positive' },
          { status: 400 }
        );
      }
      allowedUpdates.monthlyIncome = monthlyIncome;
    }
    if (currency !== undefined) {
      allowedUpdates.currency = currency;
    }

    const user = await User.findByIdAndUpdate(
      auth.userId,
      allowedUpdates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          monthlyIncome: user.monthlyIncome,
          currency: user.currency,
          hasCompletedOnboarding: user.hasCompletedOnboarding,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
