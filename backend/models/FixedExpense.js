import mongoose from 'mongoose';

const FixedExpenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide an expense name'],
      trim: true,
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
        'rent',
        'emi',
        'subscriptions',
        'insurance',
        'utilities',
        'internet',
        'phone',
        'other-fixed',
      ],
    },
    dueDay: {
      type: Number,
      min: 1,
      max: 31,
      required: [true, 'Please provide a due day'],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries by user and active status
FixedExpenseSchema.index({ userId: 1, isActive: 1 });

// Index for due day queries (for upcoming payments)
FixedExpenseSchema.index({ userId: 1, dueDay: 1, isActive: 1 });

// Index for category-based queries
FixedExpenseSchema.index({ userId: 1, category: 1 });

export default mongoose.models.FixedExpense || mongoose.model('FixedExpense', FixedExpenseSchema);
