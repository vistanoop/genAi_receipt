import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import FinancialProfile from '@/models/FinancialProfile';
import Transaction from '@/models/Transaction';
import { requireAuth } from '@/lib/auth';
import { simulateCashFlow, calculateRiskScore, calculateStressLevel } from '@/lib/financialEngine';

// POST generate cash flow forecast
export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const data = await request.json();
    const { months = 1, includeProjections = true } = data;

    // Validate months parameter
    if (months < 1 || months > 12) {
      return NextResponse.json(
        { error: 'Months must be between 1 and 12' },
        { status: 400 }
      );
    }

    // Get user financial data
    const user = await User.findById(auth.userId);
    const financialProfile = await FinancialProfile.findOne({ userId: auth.userId });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!financialProfile) {
      return NextResponse.json(
        { error: 'Please complete onboarding first' },
        { status: 400 }
      );
    }

    // Get recent transactions to calculate current balance
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const transactions = await Transaction.find({
      userId: auth.userId,
      date: { $gte: startOfMonth },
    });

    // Calculate current balance (income - expenses this month)
    let currentBalance = 0;
    transactions.forEach(t => {
      if (t.type === 'income') {
        currentBalance += t.amount;
      } else if (t.type === 'expense') {
        currentBalance -= t.amount;
      }
    });

    // Prepare income data
    const income = [
      {
        id: 1,
        name: 'Monthly Income',
        amount: user.monthlyIncome,
        dayOfMonth: 1,
        type: 'fixed',
      },
    ];

    // Prepare expense data
    const fixedExpenses = financialProfile.fixedExpenses.map((exp, idx) => ({
      id: idx + 1,
      name: exp.name,
      amount: exp.amount,
      dayOfMonth: exp.dayOfMonth,
      category: exp.category,
    }));

    const variableExpenses = financialProfile.variableExpenseCategories.map((exp, idx) => ({
      id: idx + 1,
      name: exp.name,
      amount: exp.monthlyBudget,
      category: exp.category,
    }));

    // Calculate total monthly expenses
    const totalFixedExpenses = fixedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalVariableExpenses = variableExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalMonthlyExpenses = totalFixedExpenses + totalVariableExpenses;

    // Get emergency buffer from safety buffers
    const emergencyBuffer = financialProfile.safetyBuffers?.minimumBalance || 10000;

    // Generate projections if requested
    let projections = [];
    if (includeProjections) {
      const today = new Date();
      const config = {
        startBalance: currentBalance,
        startDate: today.toISOString().split('T')[0],
        days: months * 30,
        income,
        fixedExpenses,
        variableExpenses,
        emergencyBuffer,
      };

      projections = simulateCashFlow(config);
    }

    // Calculate end-of-month balance
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const endOfMonthProjection = projections.find(p => p.day === daysInMonth) || projections[projections.length - 1];
    const endOfMonthBalance = endOfMonthProjection?.balance || (currentBalance + user.monthlyIncome - totalMonthlyExpenses);

    // Calculate risk score
    const riskScoreData = calculateRiskScore({
      currentBalance,
      monthlyIncome: user.monthlyIncome,
      monthlyExpenses: totalMonthlyExpenses,
      emergencyBuffer,
    });

    // Calculate stress level
    const stressLevel = calculateStressLevel(riskScoreData.score);

    // Identify risk zones
    const riskDays = projections.filter(p => p.isRiskZone).length;
    const safeZoneDays = projections.filter(p => p.riskLevel === 'safe').length;

    // Generate warnings
    const warnings = [];
    if (endOfMonthBalance < emergencyBuffer) {
      warnings.push({
        type: 'critical',
        message: 'End-of-month balance will fall below your minimum balance threshold',
        impact: 'high',
      });
    }
    if (riskDays > 5) {
      warnings.push({
        type: 'warning',
        message: `You'll be in a risk zone for ${riskDays} days this month`,
        impact: 'medium',
      });
    }

    const monthlySavingsFloor = financialProfile.safetyBuffers?.monthlySavingsFloor || 0;
    const projectedSavings = user.monthlyIncome - totalMonthlyExpenses;
    if (projectedSavings < monthlySavingsFloor) {
      warnings.push({
        type: 'warning',
        message: 'Projected savings below your monthly savings floor',
        impact: 'medium',
      });
    }

    return NextResponse.json(
      {
        success: true,
        forecast: {
          currentBalance,
          endOfMonthBalance,
          projectedSavings,
          totalIncome: user.monthlyIncome,
          totalExpenses: totalMonthlyExpenses,
          breakdown: {
            fixedExpenses: totalFixedExpenses,
            variableExpenses: totalVariableExpenses,
          },
          riskScore: riskScoreData,
          stressLevel,
          zones: {
            safeZoneDays,
            riskZoneDays: riskDays,
            totalDays: projections.length,
          },
          warnings,
        },
        projections: includeProjections ? projections : undefined,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Forecast error:', error);
    return NextResponse.json(
      { error: 'Failed to generate forecast' },
      { status: 500 }
    );
  }
}
