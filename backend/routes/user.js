import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/user/profile - Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
        currency: user.currency,
        minimumBalanceThreshold: user.minimumBalanceThreshold,
        monthlySavingsFloor: user.monthlySavingsFloor,
        riskTolerance: user.riskTolerance,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user profile',
    });
  }
});

// PUT /api/user/profile - Update user profile
router.put('/profile', async (req, res) => {
  try {
    const { 
      name, 
      monthlyIncome, 
      currency, 
      minimumBalanceThreshold, 
      monthlySavingsFloor, 
      riskTolerance,
      onboardingCompleted
    } = req.body;

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Update fields
    if (name) user.name = name;
    if (monthlyIncome !== undefined) user.monthlyIncome = monthlyIncome;
    if (currency) user.currency = currency;
    if (minimumBalanceThreshold !== undefined) user.minimumBalanceThreshold = minimumBalanceThreshold;
    if (monthlySavingsFloor !== undefined) user.monthlySavingsFloor = monthlySavingsFloor;
    if (riskTolerance) user.riskTolerance = riskTolerance;
    if (onboardingCompleted !== undefined) user.onboardingCompleted = onboardingCompleted;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        monthlyIncome: user.monthlyIncome,
        currency: user.currency,
        minimumBalanceThreshold: user.minimumBalanceThreshold,
        monthlySavingsFloor: user.monthlySavingsFloor,
        riskTolerance: user.riskTolerance,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
    });
  }
});

export default router;
