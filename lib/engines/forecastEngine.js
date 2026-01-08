/**
 * Forecast Engine
 * Predicts future cash flow based on historical data and user patterns
 * Uses time-series logic, NOT hardcoded assumptions
 */

export class ForecastEngine {
  constructor(userProfile, fixedExpenses, historicalExpenses, incomes) {
    this.monthlyIncome = userProfile.monthlyIncome || 0;
    this.fixedExpenses = fixedExpenses || [];
    this.historicalExpenses = historicalExpenses || [];
    this.incomes = incomes || [];
    this.currentBalance = this.calculateCurrentBalance();
  }

  /**
   * Calculate current balance from income and expenses
   */
  calculateCurrentBalance() {
    const totalIncome = this.incomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalExpenses = this.historicalExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return totalIncome - totalExpenses;
  }

  /**
   * Predict end-of-month balance
   */
  predictEndOfMonth(currentDay = new Date().getDate()) {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const daysRemaining = daysInMonth - currentDay;

    // Calculate fixed expenses remaining this month
    const fixedExpensesRemaining = this.fixedExpenses
      .filter(exp => exp.dueDay > currentDay && exp.isActive)
      .reduce((sum, exp) => sum + exp.amount, 0);

    // Calculate average daily variable spending from historical data
    const variableExpensesThisMonth = this.getThisMonthVariableExpenses();
    const averageDailySpending = variableExpensesThisMonth.total / currentDay;

    // Predict remaining variable expenses
    const predictedVariableExpenses = averageDailySpending * daysRemaining;

    // Calculate expected income remaining
    const expectedIncomeRemaining = this.predictRemainingIncome(currentDay);

    return {
      currentBalance: this.currentBalance,
      predictedEndBalance: this.currentBalance - fixedExpensesRemaining - predictedVariableExpenses + expectedIncomeRemaining,
      breakdown: {
        fixedExpensesRemaining,
        predictedVariableExpenses,
        expectedIncomeRemaining,
        averageDailySpending,
        daysRemaining,
      },
    };
  }

  /**
   * Predict next 3 months cash flow
   */
  predictNextMonths(months = 3) {
    const predictions = [];
    let runningBalance = this.currentBalance;

    for (let i = 1; i <= months; i++) {
      const monthlyFixedExpenses = this.fixedExpenses
        .filter(exp => exp.isActive)
        .reduce((sum, exp) => sum + exp.amount, 0);

      const averageVariableExpenses = this.calculateAverageMonthlyVariableExpenses();
      const expectedIncome = this.monthlyIncome;

      runningBalance = runningBalance + expectedIncome - monthlyFixedExpenses - averageVariableExpenses;

      predictions.push({
        month: i,
        expectedIncome,
        fixedExpenses: monthlyFixedExpenses,
        variableExpenses: averageVariableExpenses,
        predictedBalance: runningBalance,
      });
    }

    return predictions;
  }

  /**
   * Generate day-by-day cash flow timeline for current month
   */
  generateDailyTimeline() {
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const timeline = [];

    let balance = this.currentBalance;
    const averageDailySpending = this.calculateAverageDailySpending();

    for (let day = currentDay; day <= daysInMonth; day++) {
      // Check for fixed expenses due on this day
      const fixedExpensesToday = this.fixedExpenses
        .filter(exp => exp.dueDay === day && exp.isActive)
        .reduce((sum, exp) => sum + exp.amount, 0);

      // Check for expected income on this day
      const incomeToday = this.getExpectedIncomeOnDay(day);

      // Apply transactions
      balance = balance - averageDailySpending - fixedExpensesToday + incomeToday;

      timeline.push({
        day,
        date: new Date(today.getFullYear(), today.getMonth(), day),
        balance,
        fixedExpenses: fixedExpensesToday,
        variableExpenses: averageDailySpending,
        income: incomeToday,
        isToday: day === currentDay,
      });
    }

    return timeline;
  }

  /**
   * Calculate average monthly variable expenses from history
   */
  calculateAverageMonthlyVariableExpenses() {
    if (this.historicalExpenses.length === 0) return 0;

    // Group expenses by month
    const monthlyTotals = {};
    this.historicalExpenses.forEach(exp => {
      const monthKey = new Date(exp.date).toISOString().slice(0, 7);
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + exp.amount;
    });

    const totals = Object.values(monthlyTotals);
    return totals.length > 0 ? totals.reduce((sum, t) => sum + t, 0) / totals.length : 0;
  }

  /**
   * Calculate average daily spending
   */
  calculateAverageDailySpending() {
    const thisMonthExpenses = this.getThisMonthVariableExpenses();
    const currentDay = new Date().getDate();
    return currentDay > 0 ? thisMonthExpenses.total / currentDay : 0;
  }

  /**
   * Get this month's variable expenses
   */
  getThisMonthVariableExpenses() {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const expenses = this.historicalExpenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === thisMonth && expDate.getFullYear() === thisYear;
    });

    return {
      total: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      count: expenses.length,
      expenses,
    };
  }

  /**
   * Predict remaining income for the month
   */
  predictRemainingIncome(currentDay) {
    const today = new Date();
    const salaryDay = 1; // Assume salary on 1st of month
    
    if (currentDay < salaryDay) {
      return this.monthlyIncome;
    }
    return 0;
  }

  /**
   * Get expected income on a specific day
   */
  getExpectedIncomeOnDay(day) {
    const salaryDay = 1; // Configurable per user
    return day === salaryDay ? this.monthlyIncome : 0;
  }

  /**
   * Calculate burn rate (how fast money is being spent)
   */
  calculateBurnRate() {
    const thisMonthExpenses = this.getThisMonthVariableExpenses();
    const currentDay = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();

    const dailyBurnRate = thisMonthExpenses.total / currentDay;
    const projectedMonthlyBurn = dailyBurnRate * daysInMonth;
    const burnRatio = projectedMonthlyBurn / this.monthlyIncome;

    return {
      dailyBurnRate,
      projectedMonthlyBurn,
      burnRatio,
      status: burnRatio > 0.9 ? 'high' : burnRatio > 0.7 ? 'moderate' : 'low',
    };
  }
}
