import mongoose from 'mongoose';

const SavingsGoalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a goal name'],
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please provide a target amount'],
      min: [0, 'Amount must be positive'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Amount must be positive'],
    },
    monthlyContribution: {
      type: Number,
      default: 0,
      min: [0, 'Amount must be positive'],
    },
    targetDate: {
      type: Date,
      required: [true, 'Please provide a target date'],
    },
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium',
    },
    type: {
      type: String,
      enum: ['emergency-fund', 'long-term-savings', 'purchase', 'investment', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['on-track', 'at-risk', 'achieved', 'abandoned'],
      default: 'on-track',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
SavingsGoalSchema.index({ userId: 1, priority: -1 });

export default mongoose.models.SavingsGoal || mongoose.model('SavingsGoal', SavingsGoalSchema);
