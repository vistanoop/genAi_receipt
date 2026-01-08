import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import FinancialProfile from '@/models/FinancialProfile';
import Transaction from '@/models/Transaction';
import Simulation from '@/models/Simulation';
import Goal from '@/models/Goal';
import { requireAuth } from '@/lib/auth';
import {
  simulateCashFlow,
  calculateRiskScore,
  calculateStressLevel,
  calculateGoalImpact,
  explainImpact,
} from '@/lib/financialEngine';

// POST run a what-if simulation
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
      type,
      amount,
      frequency = 'one-time',
      duration = 30,
      category,
      startDate,
      saveSimulation = false,
    } = data;

    // Validate input
    if (!name || !type || !amount) {
      return NextResponse.json(
        { error: 'Please provide name, type, and amount' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Get user financial data
    const user = await User.findById(auth.userId);
    const financialProfile = await FinancialProfile.findOne({ userId: auth.userId });

    if (!user || !financialProfile) {
      return NextResponse.json(
        { error: 'Please complete onboarding first' },
        { status: 400 }
      );
    }

    // Get current balance from recent transactions
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const transactions = await Transaction.find({
      userId: auth.userId,
      date: { $gte: startOfMonth },
    });

    let currentBalance = 0;
    transactions.forEach(t => {
      if (t.type === 'income') {
        currentBalance += t.amount;
      } else if (t.type === 'expense') {
        currentBalance -= t.amount;
      }
    });

    // Prepare income and expense data
    const income = [
      { id: 1, name: 'Monthly Income', amount: user.monthlyIncome, dayOfMonth: 1, type: 'fixed' },
    ];

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

    const emergencyBuffer = financialProfile.safetyBuffers?.minimumBalance || 10000;
    const totalMonthlyExpenses =
      fixedExpenses.reduce((sum, e) => sum + e.amount, 0) +
      variableExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Run baseline simulation (no hypothetical spend)
    const baselineConfig = {
      startBalance: currentBalance,
      startDate: startDate || new Date().toISOString().split('T')[0],
      days: duration,
      income,
      fixedExpenses,
      variableExpenses,
      emergencyBuffer,
    };
    const baselineProjections = simulateCashFlow(baselineConfig);

    // Calculate hypothetical spend based on frequency
    let totalHypotheticalSpend = amount;
    if (frequency === 'monthly') {
      totalHypotheticalSpend = amount * Math.ceil(duration / 30);
    } else if (frequency === 'weekly') {
      totalHypotheticalSpend = amount * Math.ceil(duration / 7);
    } else if (frequency === 'daily') {
      totalHypotheticalSpend = amount * duration;
    }

    // Run what-if simulation
    const whatIfConfig = {
      ...baselineConfig,
      hypotheticalSpend: { amount: totalHypotheticalSpend, day: 0 },
    };
    const whatIfProjections = simulateCashFlow(whatIfConfig);

    // Calculate impact
    const baselineEndBalance = baselineProjections[baselineProjections.length - 1]?.balance || currentBalance;
    const whatIfEndBalance = whatIfProjections[whatIfProjections.length - 1]?.balance || currentBalance;
    const balanceChange = whatIfEndBalance - baselineEndBalance;

    // Calculate risk scores
    const baselineRiskScore = calculateRiskScore({
      currentBalance: baselineEndBalance,
      monthlyIncome: user.monthlyIncome,
      monthlyExpenses: totalMonthlyExpenses,
      emergencyBuffer,
    });

    const whatIfRiskScore = calculateRiskScore({
      currentBalance: whatIfEndBalance,
      monthlyIncome: user.monthlyIncome,
      monthlyExpenses: totalMonthlyExpenses,
      emergencyBuffer,
    });

    // Calculate stress levels
    const baselineStress = calculateStressLevel(baselineRiskScore.score);
    const whatIfStress = calculateStressLevel(whatIfRiskScore.score);

    // Calculate goal impact
    const goals = await Goal.find({ userId: auth.userId, status: 'active' });
    const goalsImpacted = [];
    
    if (goals.length > 0) {
      for (const goal of goals) {
        const goalImpact = calculateGoalImpact(
          {
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            monthlyContribution: goal.monthlyContribution,
            targetDate: goal.targetDate,
          },
          totalHypotheticalSpend,
          currentBalance
        );
        
        if (goalImpact.delayDays > 0) {
          goalsImpacted.push({
            goalId: goal._id,
            goalName: goal.name,
            delayDays: goalImpact.delayDays,
            originalDate: goalImpact.originalDate,
            newDate: goalImpact.newDate,
          });
        }
      }
    }

    // Calculate savings impact
    const baselineSavings = user.monthlyIncome - totalMonthlyExpenses;
    const whatIfSavings = baselineSavings - (totalHypotheticalSpend / Math.ceil(duration / 30));

    // Generate explanation
    const explanation = explainImpact({
      balanceChange,
      riskLevelChange: whatIfRiskScore.score - baselineRiskScore.score,
      stressChange: baselineStress.level !== whatIfStress.level ? 1 : 0,
      goalImpact: goalsImpacted.length > 0 ? goalsImpacted[0] : null,
    });

    // Save simulation if requested
    let savedSimulation = null;
    if (saveSimulation) {
      savedSimulation = await Simulation.create({
        userId: auth.userId,
        name,
        description,
        type,
        hypotheticalSpending: {
          amount,
          frequency,
          duration,
          category,
          startDate: startDate || new Date(),
        },
        results: {
          baselineEndBalance,
          simulatedEndBalance: whatIfEndBalance,
          balanceChange,
          riskLevelBefore: baselineRiskScore.level,
          riskLevelAfter: whatIfRiskScore.level,
          savingsImpact: whatIfSavings - baselineSavings,
          goalsImpacted: goalsImpacted.map(g => ({
            goalId: g.goalId,
            delayDays: g.delayDays,
          })),
        },
        status: 'draft',
      });
    }

    return NextResponse.json(
      {
        success: true,
        simulation: {
          name,
          type,
          hypotheticalSpending: {
            amount,
            frequency,
            duration,
            totalImpact: totalHypotheticalSpend,
          },
          baseline: {
            endBalance: baselineEndBalance,
            riskScore: baselineRiskScore,
            stressLevel: baselineStress,
            monthlySavings: baselineSavings,
          },
          whatIf: {
            endBalance: whatIfEndBalance,
            riskScore: whatIfRiskScore,
            stressLevel: whatIfStress,
            monthlySavings: whatIfSavings,
          },
          impact: {
            balanceChange,
            riskChange: whatIfRiskScore.score - baselineRiskScore.score,
            savingsChange: whatIfSavings - baselineSavings,
            goalsImpacted,
            explanation,
          },
          savedSimulationId: savedSimulation?._id,
        },
        projections: {
          baseline: baselineProjections,
          whatIf: whatIfProjections,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Simulation error:', error);
    return NextResponse.json(
      { error: 'Failed to run simulation' },
      { status: 500 }
    );
  }
}

// GET list saved simulations
export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const simulations = await Simulation.find({ userId: auth.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json(
      {
        success: true,
        simulations: simulations.map(sim => ({
          id: sim._id,
          name: sim.name,
          type: sim.type,
          status: sim.status,
          hypotheticalSpending: sim.hypotheticalSpending,
          results: sim.results,
          createdAt: sim.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get simulations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch simulations' },
      { status: 500 }
    );
  }
}
