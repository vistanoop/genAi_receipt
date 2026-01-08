import mongoose from 'mongoose';

const FinancialProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    // Fixed monthly expenses (rent, EMI, subscriptions)
    fixedExpenses: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          min: 0,
        },
        dayOfMonth: {
          type: Number,
          min: 1,
          max: 31,
          default: 1,
        },
        category: {
          type: String,
          enum: ['housing', 'utilities', 'insurance', 'emi', 'subscription', 'other-fixed'],
          default: 'other-fixed',
        },
      },
    ],
    // Variable expense categories (food, travel, shopping)
    variableExpenseCategories: [
      {
        name: {
          type: String,
          required: true,
        },
        monthlyBudget: {
          type: Number,
          required: true,
          min: 0,
        },
        category: {
          type: String,
          enum: ['groceries', 'food', 'transportation', 'entertainment', 'shopping', 'travel', 'other-variable'],
          default: 'other-variable',
        },
      },
    ],
    // Savings goals
    savingsGoals: [
      {
        name: {
          type: String,
          required: true,
        },
        targetAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        currentAmount: {
          type: Number,
          default: 0,
          min: 0,
        },
        monthlyContribution: {
          type: Number,
          required: true,
          min: 0,
        },
        targetDate: {
          type: Date,
        },
        priority: {
          type: String,
          enum: ['high', 'medium', 'low'],
          default: 'medium',
        },
        type: {
          type: String,
          enum: ['emergency', 'long-term', 'short-term'],
          default: 'short-term',
        },
      },
    ],
    // Risk comfort level
    riskTolerance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    // Safety buffers (user-defined constraints)
    safetyBuffers: {
      minimumBalance: {
        type: Number,
        default: 10000,
        min: 0,
      },
      monthlySavingsFloor: {
        type: Number,
        default: 5000,
        min: 0,
      },
      emergencyFundTarget: {
        type: Number,
        default: 50000,
        min: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
FinancialProfileSchema.index({ userId: 1 });

export default mongoose.models.FinancialProfile || mongoose.model('FinancialProfile', FinancialProfileSchema);
