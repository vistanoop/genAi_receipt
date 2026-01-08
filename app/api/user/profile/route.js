import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { verifyAuth } from '@/lib/auth';

/**
 * GET /api/user/profile
 * Get user profile with financial settings
 */
export async function GET(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const userProfile = await User.findById(user.userId).select('-password');
    
    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: userProfile,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/user/profile
 * Update user profile and financial settings
 */
export async function PUT(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      monthlyIncome,
      currency,
      minimumBalanceThreshold,
      monthlySavingsFloor,
      riskTolerance,
    } = body;

    await connectDB();

    const updateData = {};
    if (name) updateData.name = name;
    if (monthlyIncome !== undefined) updateData.monthlyIncome = monthlyIncome;
    if (currency) updateData.currency = currency;
    if (minimumBalanceThreshold !== undefined) updateData.minimumBalanceThreshold = minimumBalanceThreshold;
    if (monthlySavingsFloor !== undefined) updateData.monthlySavingsFloor = monthlySavingsFloor;
    if (riskTolerance) updateData.riskTolerance = riskTolerance;

    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    return NextResponse.json({
      success: true,
      profile: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
