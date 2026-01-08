import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema(
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
    source: {
      type: String,
      required: [true, 'Please provide an income source'],
      trim: true,
      enum: ['salary', 'freelance', 'business', 'investment', 'rental', 'other'],
    },
    description: {
      type: String,
      trim: true,
    },
    frequency: {
      type: String,
      enum: ['one-time', 'monthly', 'quarterly', 'yearly'],
      default: 'monthly',
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
  },
  {
    timestamps: true,
  }
);

// Compound index for faster queries by user and date
IncomeSchema.index({ userId: 1, date: -1 });

// Index for recurring income queries
IncomeSchema.index({ userId: 1, isRecurring: 1 });

// Index for frequency-based queries
IncomeSchema.index({ userId: 1, frequency: 1 });

export default mongoose.models.Income || mongoose.model('Income', IncomeSchema);
