import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['income', 'expense'],
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: [
        // Income categories
        'salary',
        'freelance',
        'investment',
        'bonus',
        'other-income',
        // Expense categories
        'housing',
        'transportation',
        'groceries',
        'utilities',
        'entertainment',
        'food',
        'shopping',
        'healthcare',
        'education',
        'personal',
        'travel',
        'insurance',
        'gifts',
        'bills',
        'emi',
        'subscription',
        'other-expense',
      ],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide a date'],
      default: Date.now,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', null],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, type: 1, date: -1 });
TransactionSchema.index({ userId: 1, category: 1 });

export default mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
