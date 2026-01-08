/**
 * Recommendation Engine
 * Generates logic-based financial recommendations and risk classifications
 * NO AI here - pure deterministic logic
 */

import { RuleEngine } from './ruleEngine.js';

export class RecommendationEngine {
  constructor(userProfile, fixedExpenses, historicalExpenses, incomes, savingsGoals, forecastEngine) {
    this.userProfile = userProfile;
    this.fixedExpenses = fixedExpenses;
    this.historicalExpenses = historicalExpenses;
    this.incomes = incomes;
    this.savingsGoals = savingsGoals;
    this.forecastEngine = forecastEngine;
    this.ruleEngine = new RuleEngine(userProfile);
  }

  /**
   * Generate all recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Analyze current state
    const endOfMonth = this.forecastEngine.predictEndOfMonth();
    const burnRate = this.forecastEngine.calculateBurnRate();
    const riskLevel = this.ruleEngine.calculateRiskLevel(
      endOfMonth.currentBalance,
      this.userProfile.monthlyIncome,
      this.forecastEngine.calculateAverageMonthlyVariableExpenses()
    );

    // Check for critical issues first
    if (endOfMonth.predictedEndBalance < this.userProfile.minimumBalanceThreshold) {
      recommendations.push({
        id: 'critical_balance',
        priority: 'high',
        type: 'warning',
        title: 'Critical Balance Alert',
        message: 'Your predicted end-of-month balance is below your safety threshold',
        impact: {
          balanceImprovement: this.userProfile.minimumBalanceThreshold - endOfMonth.predictedEndBalance,
          riskReduction: 'Moves from danger to safe zone',
        },
        actions: [
          'Reduce discretionary spending by 30%',
          'Delay non-essential purchases',
          'Review and cancel unused subscriptions',
        ],
        confidence: 0.95,
      });
    }

    // High burn rate recommendations
    if (burnRate.status === 'high') {
      recommendations.push(this.generateBurnRateRecommendation(burnRate));
    }

    // Category-specific recommendations
    const categoryRecommendations = this.analyzeCategorySpending();
    recommendations.push(...categoryRecommendations);

    // Savings goal recommendations
    const goalRecommendations = this.analyzeSavingsGoals();
    recommendations.push(...goalRecommendations);

    // Fixed expense recommendations
    const fixedExpenseRecommendations = this.analyzeFixedExpenses();
    recommendations.push(...fixedExpenseRecommendations);

    // Positive reinforcement
    if (riskLevel === 'safe' && burnRate.status === 'low') {
      recommendations.push({
        id: 'positive_feedback',
        priority: 'low',
        type: 'success',
        title: 'Great Financial Health!',
        message: 'You\'re managing your finances well. Keep up the good work!',
        impact: {
          balanceImprovement: 0,
          riskReduction: 'Maintaining safe zone',
        },
        actions: [
          'Consider increasing savings goals',
          'Explore investment opportunities',
        ],
        confidence: 1.0,
      });
    }

    // Sort by priority
    return this.sortByPriority(recommendations);
  }

  /**
   * Generate burn rate recommendation
   */
  generateBurnRateRecommendation(burnRate) {
    const reductionNeeded = (burnRate.projectedMonthlyBurn - this.userProfile.monthlyIncome * 0.8) / 30;

    return {
      id: 'high_burn_rate',
      priority: 'high',
      type: 'warning',
      title: 'High Spending Rate Detected',
      message: `You're spending ${burnRate.burnRatio.toFixed(0)}% of your income. Consider reducing daily spending.`,
      impact: {
        balanceImprovement: reductionNeeded * 30,
        riskReduction: 'Moves from high to moderate burn rate',
      },
      actions: [
        `Reduce daily spending by ₹${Math.ceil(reductionNeeded)}`,
        'Track discretionary expenses more carefully',
        'Set daily spending limits',
      ],
      confidence: 0.85,
    };
  }

  /**
   * Analyze category spending patterns
   */
  analyzeCategorySpending() {
    const recommendations = [];
    const categoryTotals = {};

    // Calculate category totals for this month
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    this.historicalExpenses
      .filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === thisMonth && expDate.getFullYear() === thisYear;
      })
      .forEach(exp => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      });

    // Define category budgets as % of income (user can override)
    const categoryBudgets = {
      food: 0.20,
      shopping: 0.15,
      entertainment: 0.10,
      travel: 0.10,
    };

    Object.entries(categoryTotals).forEach(([category, amount]) => {
      const budgetPercent = categoryBudgets[category];
      if (budgetPercent) {
        const budgetAmount = this.userProfile.monthlyIncome * budgetPercent;
        if (amount > budgetAmount) {
          const excess = amount - budgetAmount;
          recommendations.push({
            id: `category_${category}`,
            priority: 'moderate',
            type: 'suggestion',
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Spending High`,
            message: `You've spent ₹${amount} on ${category}, which is ${((amount/budgetAmount - 1) * 100).toFixed(0)}% over recommended.`,
            impact: {
              balanceImprovement: excess,
              riskReduction: 'Moderate improvement',
            },
            actions: [
              `Reduce ${category} spending by ₹${Math.ceil(excess)}`,
              `Set a weekly ${category} budget`,
            ],
            confidence: 0.75,
          });
        }
      }
    });

    return recommendations;
  }

  /**
   * Analyze savings goals
   */
  analyzeSavingsGoals() {
    const recommendations = [];

    this.savingsGoals.forEach(goal => {
      const remaining = goal.targetAmount - goal.currentAmount;
      const monthsRemaining = Math.ceil((goal.targetDate - Date.now()) / (30 * 24 * 60 * 60 * 1000));
      const requiredMonthlyContribution = remaining / monthsRemaining;

      if (requiredMonthlyContribution > goal.monthlyContribution) {
        const shortfall = requiredMonthlyContribution - goal.monthlyContribution;
        recommendations.push({
          id: `goal_${goal._id}`,
          priority: goal.priority === 'high' ? 'high' : 'moderate',
          type: 'suggestion',
          title: `${goal.name} Goal At Risk`,
          message: `You need to increase contributions by ₹${Math.ceil(shortfall)}/month to meet your goal on time.`,
          impact: {
            balanceImprovement: 0,
            riskReduction: 'Improves goal achievement',
          },
          actions: [
            `Increase monthly contribution to ₹${Math.ceil(requiredMonthlyContribution)}`,
            'Extend target date by a few months',
            'Identify areas to cut spending',
          ],
          confidence: 0.90,
        });
      }
    });

    return recommendations;
  }

  /**
   * Analyze fixed expenses for optimization
   */
  analyzeFixedExpenses() {
    const recommendations = [];
    const totalFixed = this.fixedExpenses
      .filter(exp => exp.isActive)
      .reduce((sum, exp) => sum + exp.amount, 0);

    const fixedRatio = totalFixed / this.userProfile.monthlyIncome;

    // If fixed expenses are too high (>50% of income)
    if (fixedRatio > 0.5) {
      recommendations.push({
        id: 'high_fixed_expenses',
        priority: 'moderate',
        type: 'suggestion',
        title: 'High Fixed Expenses',
        message: `Your fixed expenses are ${(fixedRatio * 100).toFixed(0)}% of income. Consider optimization.`,
        impact: {
          balanceImprovement: (fixedRatio - 0.4) * this.userProfile.monthlyIncome,
          riskReduction: 'Significant improvement',
        },
        actions: [
          'Review all subscriptions and cancel unused ones',
          'Negotiate better rates for utilities/internet',
          'Consider refinancing loans for lower EMIs',
        ],
        confidence: 0.80,
      });
    }

    // Check for subscription overload
    const subscriptions = this.fixedExpenses.filter(exp => exp.category === 'subscriptions');
    if (subscriptions.length > 5) {
      recommendations.push({
        id: 'subscription_overload',
        priority: 'low',
        type: 'suggestion',
        title: 'Multiple Subscriptions Detected',
        message: `You have ${subscriptions.length} active subscriptions. Review for unused services.`,
        impact: {
          balanceImprovement: subscriptions.reduce((sum, sub) => sum + sub.amount, 0) * 0.3,
          riskReduction: 'Minor improvement',
        },
        actions: [
          'List all subscriptions and usage frequency',
          'Cancel services used less than once a month',
          'Look for cheaper alternatives',
        ],
        confidence: 0.70,
      });
    }

    return recommendations;
  }

  /**
   * Sort recommendations by priority
   */
  sortByPriority(recommendations) {
    const priorityOrder = { high: 3, moderate: 2, low: 1 };
    return recommendations.sort((a, b) => {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Get risk score (0-100)
   */
  calculateRiskScore() {
    const endOfMonth = this.forecastEngine.predictEndOfMonth();
    const burnRate = this.forecastEngine.calculateBurnRate();

    // Balance adequacy (40 points)
    const balanceRatio = endOfMonth.currentBalance / this.userProfile.monthlyIncome;
    const balanceScore = Math.min(40, balanceRatio * 40);

    // Income stability (30 points) - simplified, assumes stable
    const incomeScore = 30;

    // Expense predictability (20 points)
    const expenseVariability = this.calculateExpenseVariability();
    const expenseScore = Math.max(0, 20 - expenseVariability * 10);

    // Safety margin (10 points)
    const bufferStatus = this.ruleEngine.getSafetyBufferStatus(endOfMonth.currentBalance);
    const safetyScore = bufferStatus.percentage / 10;

    return Math.round(balanceScore + incomeScore + expenseScore + safetyScore);
  }

  /**
   * Calculate expense variability
   */
  calculateExpenseVariability() {
    if (this.historicalExpenses.length < 2) return 0;

    const monthlyTotals = {};
    this.historicalExpenses.forEach(exp => {
      const monthKey = new Date(exp.date).toISOString().slice(0, 7);
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + exp.amount;
    });

    const totals = Object.values(monthlyTotals);
    if (totals.length < 2) return 0;

    const avg = totals.reduce((sum, t) => sum + t, 0) / totals.length;
    const variance = totals.reduce((sum, t) => sum + Math.pow(t - avg, 2), 0) / totals.length;
    const stdDev = Math.sqrt(variance);

    return stdDev / avg; // Coefficient of variation
  }
}
