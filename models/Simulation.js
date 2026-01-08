import mongoose from 'mongoose';

const SimulationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a simulation name'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['purchase', 'subscription', 'expense-change', 'income-change', 'goal-adjustment'],
    },
    // What-if parameters
    hypotheticalSpending: {
      amount: {
        type: Number,
        default: 0,
      },
      frequency: {
        type: String,
        enum: ['one-time', 'daily', 'weekly', 'monthly', 'yearly'],
        default: 'one-time',
      },
      duration: {
        type: Number, // in days
        default: 30,
      },
      category: {
        type: String,
      },
      startDate: {
        type: Date,
        default: Date.now,
      },
    },
    // Simulation results
    results: {
      baselineEndBalance: {
        type: Number,
      },
      simulatedEndBalance: {
        type: Number,
      },
      balanceChange: {
        type: Number,
      },
      riskLevelBefore: {
        type: String,
        enum: ['safe', 'moderate', 'high', 'critical'],
      },
      riskLevelAfter: {
        type: String,
        enum: ['safe', 'moderate', 'high', 'critical'],
      },
      savingsImpact: {
        type: Number,
      },
      goalsImpacted: [{
        goalId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Goal',
        },
        delayDays: {
          type: Number,
        },
      }],
    },
    status: {
      type: String,
      enum: ['draft', 'confirmed', 'cancelled'],
      default: 'draft',
    },
    confirmedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
SimulationSchema.index({ userId: 1, status: 1 });
SimulationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Simulation || mongoose.model('Simulation', SimulationSchema);
