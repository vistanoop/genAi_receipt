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

// Index for faster queries
FixedExpenseSchema.index({ userId: 1, isActive: 1 });

export default mongoose.models.FixedExpense || mongoose.model('FixedExpense', FixedExpenseSchema);
