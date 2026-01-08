import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false, // Don't return password by default
    },
    // Financial Profile
    monthlyIncome: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'],
    },
    // User-defined safety rules
    minimumBalanceThreshold: {
      type: Number,
      default: 5000,
    },
    monthlySavingsFloor: {
      type: Number,
      default: 5000,
    },
    riskTolerance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    // Onboarding completion flag
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    // User Activity Tracking
    lastLoginAt: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    // User Preferences
    notifications: {
      email: {
        type: Boolean,
        default: true,
      },
      weeklyReport: {
        type: Boolean,
        default: true,
      },
      savingsReminder: {
        type: Boolean,
        default: true,
      },
    },
    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'deleted'],
      default: 'active',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries on email (unique already creates an index)
UserSchema.index({ email: 1 });

// Index for active users
UserSchema.index({ isActive: 1, accountStatus: 1 });

// Index for user statistics
UserSchema.index({ createdAt: -1 });

// Hash password before saving
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to update last login
UserSchema.methods.recordLogin = async function () {
  this.lastLoginAt = new Date();
  this.loginCount = (this.loginCount || 0) + 1;
  await this.save();
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
