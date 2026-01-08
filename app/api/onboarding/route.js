import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

/**
 * POST /api/onboarding
 * Save user's financial onboarding data
 */
export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      monthlyIncome,
      currency,
      minimumBalanceThreshold,
      monthlySavingsFloor,
      riskTolerance,
    } = body;

    // Validation
    if (!monthlyIncome || monthlyIncome <= 0) {
      return NextResponse.json(
        { error: 'Valid monthly income is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      {
        monthlyIncome,
        currency: currency || 'INR',
        minimumBalanceThreshold: minimumBalanceThreshold || monthlyIncome * 0.1,
        monthlySavingsFloor: monthlySavingsFloor || monthlyIncome * 0.1,
        riskTolerance: riskTolerance || 'medium',
        onboardingCompleted: true,
      },
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      message: 'Onboarding completed successfully',
      profile: updatedUser,
    });
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    return NextResponse.json(
      { error: 'Failed to save onboarding data' },
      { status: 500 }
    );
  }
}
