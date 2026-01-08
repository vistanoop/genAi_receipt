import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Expense from '@/models/Expense';
import FixedExpense from '@/models/FixedExpense';
import Income from '@/models/Income';
import SavingsGoal from '@/models/SavingsGoal';
import { verifyAuth } from '@/lib/auth';
import { SimulationEngine } from '@/lib/engines/simulationEngine';
import { AIExplanationEngine } from '@/lib/engines/aiEngine';

/**
 * POST /api/simulate/purchase
 * Simulate a one-time purchase impact
 */
export async function POST(request) {
  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { amount, dateOffset = 0, duration = 30 } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch all required data
    const [userProfile, expenses, fixedExpenses, incomes, savingsGoals] = await Promise.all([
      User.findById(user.userId).select('-password'),
      Expense.find({ userId: user.userId }).sort({ date: -1 }),
      FixedExpense.find({ userId: user.userId, isActive: true }),
      Income.find({ userId: user.userId }).sort({ date: -1 }),
      SavingsGoal.find({ userId: user.userId }),
    ]);

    if (!userProfile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Initialize simulation engine
    const simulationEngine = new SimulationEngine(
      userProfile,
      fixedExpenses,
      expenses,
      incomes,
      savingsGoals
    );

    // Run simulation
    const simulationResult = simulationEngine.simulatePurchase(amount, dateOffset);
    const explanation = simulationEngine.explainImpact(simulationResult);

    // Get AI explanation if API key available
    let aiExplanation = null;
    if (process.env.GEMINI_API_KEY) {
      const aiEngine = new AIExplanationEngine(process.env.GEMINI_API_KEY);
      const userContext = {
        monthlyIncome: userProfile.monthlyIncome,
        riskTolerance: userProfile.riskTolerance,
      };
      aiExplanation = await aiEngine.explainSimulationImpact(simulationResult, userContext);
    }

    return NextResponse.json({
      success: true,
      simulation: {
        ...simulationResult,
        explanation,
        aiExplanation,
      },
    });
  } catch (error) {
    console.error('Error running simulation:', error);
    return NextResponse.json(
      { error: 'Failed to run simulation' },
      { status: 500 }
    );
  }
}
