import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema(
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
    description: {
      type: String,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please provide a target amount'],
      min: [0, 'Target amount must be positive'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount must be positive'],
    },
    monthlyContribution: {
      type: Number,
      required: [true, 'Please provide a monthly contribution'],
      min: [0, 'Monthly contribution must be positive'],
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
      enum: ['emergency', 'long-term', 'short-term'],
      default: 'short-term',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'cancelled'],
      default: 'active',
    },
    completedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
GoalSchema.index({ userId: 1, status: 1 });
GoalSchema.index({ userId: 1, priority: -1 });

// Calculate progress percentage
GoalSchema.virtual('progressPercentage').get(function () {
  if (this.targetAmount === 0) return 0;
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});

// Calculate remaining amount
GoalSchema.virtual('remainingAmount').get(function () {
  return Math.max(this.targetAmount - this.currentAmount, 0);
});

// Calculate estimated completion date based on current contribution rate
GoalSchema.virtual('estimatedCompletionDate').get(function () {
  if (this.monthlyContribution === 0 || this.currentAmount >= this.targetAmount) {
    return null;
  }
  const remainingAmount = this.targetAmount - this.currentAmount;
  const monthsRequired = Math.ceil(remainingAmount / this.monthlyContribution);
  const estimatedDate = new Date();
  estimatedDate.setMonth(estimatedDate.getMonth() + monthsRequired);
  return estimatedDate;
});

// Ensure virtuals are included in JSON output
GoalSchema.set('toJSON', { virtuals: true });
GoalSchema.set('toObject', { virtuals: true });

export default mongoose.models.Goal || mongoose.model('Goal', GoalSchema);
