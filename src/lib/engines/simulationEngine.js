/**
 * Simulation Engine
 * Handles temporary "what-if" scenarios without mutating actual data
 * Allows users to test financial decisions before committing
 */

import { ForecastEngine } from './forecastEngine.js';
import { RuleEngine } from './ruleEngine.js';

export class SimulationEngine {
  constructor(userProfile, fixedExpenses, historicalExpenses, incomes, savingsGoals) {
    this.userProfile = userProfile;
    this.fixedExpenses = fixedExpenses;
    this.historicalExpenses = historicalExpenses;
    this.incomes = incomes;
    this.savingsGoals = savingsGoals;
  }

  /**
   * Simulate a one-time purchase
   */
  simulatePurchase(amount, dateOffset = 0) {
    const today = new Date();
    const purchaseDate = new Date(today);
    purchaseDate.setDate(purchaseDate.getDate() + dateOffset);

    // Create temporary expense
    const tempExpense = {
      amount,
      date: purchaseDate,
      category: 'simulation',
      description: 'Simulated purchase',
    };

    // Create forecast with and without the purchase
    const baselineForecast = new ForecastEngine(
      this.userProfile,
      this.fixedExpenses,
      this.historicalExpenses,
      this.incomes
    );

    const simulatedForecast = new ForecastEngine(
      this.userProfile,
      this.fixedExpenses,
      [...this.historicalExpenses, tempExpense],
      this.incomes
    );

    const baselineEnd = baselineForecast.predictEndOfMonth();
    const simulatedEnd = simulatedForecast.predictEndOfMonth();

    // Calculate goal impact
    const goalImpact = this.calculateGoalImpact(amount);

    // Safe percentage calculation
    const percentChange = baselineEnd.currentBalance > 0 
      ? ((simulatedEnd.predictedEndBalance - baselineEnd.predictedEndBalance) / baselineEnd.currentBalance) * 100
      : 0;

    return {
      baseline: baselineEnd,
      simulated: simulatedEnd,
      impact: {
        balanceChange: simulatedEnd.predictedEndBalance - baselineEnd.predictedEndBalance,
        percentChange,
        goalDaysDelayed: goalImpact.daysDelayed,
        goalNames: goalImpact.affectedGoals,
      },
      riskChange: this.calculateRiskChange(baselineForecast, simulatedForecast),
    };
  }

  /**
   * Simulate adding a subscription
   */
  simulateSubscription(amount, dueDay, duration = 3) {
    const tempFixedExpense = {
      name: 'Simulated Subscription',
      amount,
      dueDay,
      category: 'subscriptions',
      isActive: true,
    };

    const baselineForecast = new ForecastEngine(
      this.userProfile,
      this.fixedExpenses,
      this.historicalExpenses,
      this.incomes
    );

    const simulatedForecast = new ForecastEngine(
      this.userProfile,
      [...this.fixedExpenses, tempFixedExpense],
      this.historicalExpenses,
      this.incomes
    );

    const baselineMonths = baselineForecast.predictNextMonths(duration);
    const simulatedMonths = simulatedForecast.predictNextMonths(duration);

    return {
      baseline: baselineMonths,
      simulated: simulatedMonths,
      impact: {
        totalCost: amount * duration,
        monthlyImpact: amount,
        durationMonths: duration,
      },
    };
  }

  /**
   * Simulate changing monthly spending in a category
   */
  simulateSpendingChange(categoryChange, durationDays = 30) {
    // categoryChange: { category: 'food', changeAmount: 5000, type: 'increase' | 'decrease' }
    const multiplier = categoryChange.type === 'increase' ? 1 : -1;
    const dailyChange = (categoryChange.changeAmount / 30) * multiplier;

    const baselineForecast = new ForecastEngine(
      this.userProfile,
      this.fixedExpenses,
      this.historicalExpenses,
      this.incomes
    );

    // Simulate by adjusting average daily spending
    const tempExpenses = [];
    const today = new Date();
    
    for (let i = 0; i < durationDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      tempExpenses.push({
        amount: dailyChange,
        date,
        category: categoryChange.category,
        description: 'Simulated spending change',
      });
    }

    const simulatedForecast = new ForecastEngine(
      this.userProfile,
      this.fixedExpenses,
      [...this.historicalExpenses, ...tempExpenses],
      this.incomes
    );

    const baselineEnd = baselineForecast.predictEndOfMonth();
    const simulatedEnd = simulatedForecast.predictEndOfMonth();

    return {
      baseline: baselineEnd,
      simulated: simulatedEnd,
      impact: {
        totalChange: categoryChange.changeAmount * multiplier,
        category: categoryChange.category,
        durationDays,
      },
    };
  }

  /**
   * Simulate changing savings goal
   */
  simulateSavingsGoalChange(goalId, newMonthlyContribution) {
    const goal = this.savingsGoals.find(g => g._id.toString() === goalId);
    if (!goal) return null;

    const currentContribution = goal.monthlyContribution;
    const difference = newMonthlyContribution - currentContribution;

    // This affects disposable income
    const baselineForecast = new ForecastEngine(
      this.userProfile,
      this.fixedExpenses,
      this.historicalExpenses,
      this.incomes
    );

    const modifiedProfile = {
      ...this.userProfile,
      monthlyIncome: this.userProfile.monthlyIncome - difference,
    };

    const simulatedForecast = new ForecastEngine(
      modifiedProfile,
      this.fixedExpenses,
      this.historicalExpenses,
      this.incomes
    );

    const baselineMonths = baselineForecast.predictNextMonths(3);
    const simulatedMonths = simulatedForecast.predictNextMonths(3);

    // Calculate new goal timeline
    const remaining = goal.targetAmount - goal.currentAmount;
    const monthsToGoal = newMonthlyContribution > 0 ? Math.ceil(remaining / newMonthlyContribution) : Infinity;

    return {
      baseline: baselineMonths,
      simulated: simulatedMonths,
      goalImpact: {
        originalMonthlyContribution: currentContribution,
        newMonthlyContribution,
        difference,
        monthsToGoal,
        newTargetDate: new Date(Date.now() + monthsToGoal * 30 * 24 * 60 * 60 * 1000),
      },
    };
  }

  /**
   * Calculate impact on savings goals
   */
  calculateGoalImpact(spendAmount) {
    const affectedGoals = [];
    let maxDaysDelayed = 0;

    this.savingsGoals.forEach(goal => {
      if (goal.monthlyContribution > 0) {
        const daysDelayed = Math.ceil((spendAmount / goal.monthlyContribution) * 30);
        if (daysDelayed > 0) {
          affectedGoals.push({
            name: goal.name,
            daysDelayed,
            priority: goal.priority,
          });
          maxDaysDelayed = Math.max(maxDaysDelayed, daysDelayed);
        }
      }
    });

    return {
      daysDelayed: maxDaysDelayed,
      affectedGoals: affectedGoals.map(g => g.name),
      details: affectedGoals,
    };
  }

  /**
   * Calculate risk change between baseline and simulation
   */
  calculateRiskChange(baselineForecast, simulatedForecast) {
    const ruleEngine = new RuleEngine(this.userProfile);

    const baselineEnd = baselineForecast.predictEndOfMonth();
    const simulatedEnd = simulatedForecast.predictEndOfMonth();

    const baselineRisk = ruleEngine.calculateRiskLevel(
      baselineEnd.predictedEndBalance,
      this.userProfile.monthlyIncome,
      baselineForecast.calculateAverageMonthlyVariableExpenses()
    );

    const simulatedRisk = ruleEngine.calculateRiskLevel(
      simulatedEnd.predictedEndBalance,
      this.userProfile.monthlyIncome,
      simulatedForecast.calculateAverageMonthlyVariableExpenses()
    );

    return {
      before: baselineRisk,
      after: simulatedRisk,
      changed: baselineRisk !== simulatedRisk,
    };
  }

  /**
   * Explain simulation impact in structured format (for AI to convert to natural language)
   */
  explainImpact(simulationResult) {
    return {
      balanceChange: simulationResult.impact.balanceChange,
      percentChange: simulationResult.impact.percentChange,
      riskChange: simulationResult.riskChange,
      goalImpact: simulationResult.impact.goalDaysDelayed > 0 ? {
        delayed: true,
        days: simulationResult.impact.goalDaysDelayed,
        goals: simulationResult.impact.goalNames,
      } : {
        delayed: false,
      },
      recommendation: this.generateRecommendation(simulationResult),
    };
  }

  /**
   * Generate structured recommendation
   */
  generateRecommendation(simulationResult) {
    const riskIncreased = simulationResult.riskChange.changed && 
                          ['danger', 'risk'].includes(simulationResult.riskChange.after);
    const significantDelay = simulationResult.impact.goalDaysDelayed > 30;

    if (riskIncreased && significantDelay) {
      return {
        action: 'avoid',
        reason: 'high_risk_and_goal_impact',
        severity: 'high',
      };
    } else if (riskIncreased) {
      return {
        action: 'delay',
        reason: 'increased_financial_risk',
        severity: 'medium',
      };
    } else if (significantDelay) {
      return {
        action: 'consider_alternatives',
        reason: 'significant_goal_delay',
        severity: 'medium',
      };
    }
    return {
      action: 'proceed_with_caution',
      reason: 'manageable_impact',
      severity: 'low',
    };
  }
}
