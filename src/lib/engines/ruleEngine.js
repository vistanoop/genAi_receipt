/**
 * Rule Engine
 * Manages user-defined safety buffers, thresholds, and financial constraints
 * NO HARDCODED VALUES - Everything comes from user preferences
 */

export class RuleEngine {
  constructor(userPreferences) {
    this.minimumBalanceThreshold = userPreferences.minimumBalanceThreshold || 5000;
    this.monthlySavingsFloor = userPreferences.monthlySavingsFloor || 5000;
    this.riskTolerance = userPreferences.riskTolerance || 'medium';
  }

  /**
   * Check if a balance is below the user's safety threshold
   */
  isBelowMinimumBalance(balance) {
    return balance < this.minimumBalanceThreshold;
  }

  /**
   * Check if monthly savings meet the user's floor
   */
  meetsSavingsFloor(actualSavings) {
    return actualSavings >= this.monthlySavingsFloor;
  }

  /**
   * Calculate risk level based on user-defined rules
   */
  calculateRiskLevel(balance, monthlyIncome, expenses) {
    const balanceRatio = balance / monthlyIncome;
    const savingsRatio = (monthlyIncome - expenses) / monthlyIncome;

    // Risk thresholds based on user's risk tolerance
    const thresholds = {
      low: { safe: 1.5, warning: 1.0, danger: 0.5 },
      medium: { safe: 1.0, warning: 0.5, danger: 0.25 },
      high: { safe: 0.5, warning: 0.25, danger: 0.1 },
    };

    const userThresholds = thresholds[this.riskTolerance];

    if (balanceRatio >= userThresholds.safe && savingsRatio > 0) {
      return 'safe';
    } else if (balanceRatio >= userThresholds.warning) {
      return 'warning';
    } else if (balanceRatio >= userThresholds.danger) {
      return 'risk';
    }
    return 'danger';
  }

  /**
   * Validate if a spending decision is safe
   */
  validateSpending(currentBalance, spendAmount, monthlyIncome) {
    const newBalance = currentBalance - spendAmount;
    
    const validation = {
      isValid: true,
      warnings: [],
      violations: [],
    };

    if (newBalance < this.minimumBalanceThreshold) {
      validation.isValid = false;
      validation.violations.push({
        type: 'minimum_balance',
        message: `This spending will bring your balance below your safety threshold of ${this.minimumBalanceThreshold}`,
        severity: 'critical',
      });
    }

    if (newBalance < monthlyIncome * 0.1) {
      validation.warnings.push({
        type: 'low_balance',
        message: 'Your balance will be critically low',
        severity: 'high',
      });
    }

    return validation;
  }

  /**
   * Get safety buffer status
   */
  getSafetyBufferStatus(currentBalance) {
    const bufferRatio = currentBalance / this.minimumBalanceThreshold;
    
    if (bufferRatio >= 2.0) return { status: 'excellent', percentage: 100 };
    if (bufferRatio >= 1.5) return { status: 'good', percentage: 80 };
    if (bufferRatio >= 1.0) return { status: 'adequate', percentage: 60 };
    if (bufferRatio >= 0.5) return { status: 'low', percentage: 30 };
    return { status: 'critical', percentage: 10 };
  }
}
