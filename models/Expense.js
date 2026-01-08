import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
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
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries by user and date (descending)
ExpenseSchema.index({ userId: 1, date: -1 });

// Compound index for category-based queries
ExpenseSchema.index({ userId: 1, category: 1, date: -1 });

// Index for amount range queries (for analytics)
ExpenseSchema.index({ userId: 1, amount: -1 });

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
