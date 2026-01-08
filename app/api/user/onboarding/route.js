import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import FinancialProfile from '@/models/FinancialProfile';
import { requireAuth } from '@/lib/auth';

// POST complete onboarding and create financial profile
export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const data = await request.json();
    const {
      fixedExpenses,
      variableExpenseCategories,
      savingsGoals,
      riskTolerance,
      safetyBuffers,
    } = data;

    // Validate required fields
    if (!fixedExpenses || !variableExpenseCategories || !savingsGoals || !riskTolerance) {
      return NextResponse.json(
        { error: 'Please provide all required onboarding information' },
        { status: 400 }
      );
    }

    // Check if user already has a financial profile
    let financialProfile = await FinancialProfile.findOne({ userId: auth.userId });

    if (financialProfile) {
      // Update existing profile
      financialProfile.fixedExpenses = fixedExpenses;
      financialProfile.variableExpenseCategories = variableExpenseCategories;
      financialProfile.savingsGoals = savingsGoals;
      financialProfile.riskTolerance = riskTolerance;
      if (safetyBuffers) {
        financialProfile.safetyBuffers = safetyBuffers;
      }
      await financialProfile.save();
    } else {
      // Create new profile
      financialProfile = await FinancialProfile.create({
        userId: auth.userId,
        fixedExpenses,
        variableExpenseCategories,
        savingsGoals,
        riskTolerance,
        safetyBuffers: safetyBuffers || {
          minimumBalance: 10000,
          monthlySavingsFloor: 5000,
          emergencyFundTarget: 50000,
        },
      });
    }

    // Mark user as having completed onboarding
    await User.findByIdAndUpdate(auth.userId, {
      hasCompletedOnboarding: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Onboarding completed successfully',
        financialProfile: {
          id: financialProfile._id,
          fixedExpenses: financialProfile.fixedExpenses,
          variableExpenseCategories: financialProfile.variableExpenseCategories,
          savingsGoals: financialProfile.savingsGoals,
          riskTolerance: financialProfile.riskTolerance,
          safetyBuffers: financialProfile.safetyBuffers,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}

// GET check onboarding status
export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const user = await User.findById(auth.userId).select('hasCompletedOnboarding');
    const financialProfile = await FinancialProfile.findOne({ userId: auth.userId });

    return NextResponse.json(
      {
        success: true,
        hasCompletedOnboarding: user?.hasCompletedOnboarding || false,
        hasFinancialProfile: !!financialProfile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Check onboarding error:', error);
    return NextResponse.json(
      { error: 'Failed to check onboarding status' },
      { status: 500 }
    );
  }
}
