import express from 'express';
import SavingsGoal from '../models/SavingsGoal.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/goals - Get all savings goals for logged-in user
router.get('/', async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.userId })
      .sort({ priority: -1, targetDate: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: goals.length,
      goals: goals.map(goal => ({
        id: goal._id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        monthlyContribution: goal.monthlyContribution,
        targetDate: goal.targetDate,
        priority: goal.priority,
        type: goal.type,
        status: goal.status,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch savings goals',
    });
  }
});

// POST /api/goals - Create a new savings goal
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      targetAmount, 
      currentAmount, 
      monthlyContribution, 
      targetDate, 
      priority, 
      type 
    } = req.body;

    // Validate input
    if (!name || !targetAmount || !targetDate) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, target amount, and target date',
      });
    }

    if (targetAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Target amount must be greater than 0',
      });
    }

    // Create goal
    const goal = await SavingsGoal.create({
      userId: req.userId,
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
      monthlyContribution: monthlyContribution ? parseFloat(monthlyContribution) : 0,
      targetDate: new Date(targetDate),
      priority: priority || 'medium',
      type: type || 'other',
    });

    res.status(201).json({
      success: true,
      message: 'Savings goal added successfully',
      goal: {
        id: goal._id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        monthlyContribution: goal.monthlyContribution,
        targetDate: goal.targetDate,
        priority: goal.priority,
        type: goal.type,
        status: goal.status,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create savings goal',
    });
  }
});

// PUT /api/goals/:id - Update a savings goal
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, 
      targetAmount, 
      currentAmount, 
      monthlyContribution, 
      targetDate, 
      priority, 
      type,
      status
    } = req.body;

    const goal = await SavingsGoal.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Savings goal not found',
      });
    }

    // Update fields
    if (name) goal.name = name;
    if (targetAmount !== undefined) goal.targetAmount = targetAmount;
    if (currentAmount !== undefined) goal.currentAmount = currentAmount;
    if (monthlyContribution !== undefined) goal.monthlyContribution = monthlyContribution;
    if (targetDate) goal.targetDate = new Date(targetDate);
    if (priority) goal.priority = priority;
    if (type) goal.type = type;
    if (status) goal.status = status;

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Savings goal updated successfully',
      goal: {
        id: goal._id,
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        monthlyContribution: goal.monthlyContribution,
        targetDate: goal.targetDate,
        priority: goal.priority,
        type: goal.type,
        status: goal.status,
        createdAt: goal.createdAt,
        updatedAt: goal.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update savings goal',
    });
  }
});

// DELETE /api/goals/:id - Delete a savings goal
router.delete('/:id', async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        error: 'Savings goal not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Savings goal deleted successfully',
    });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete savings goal',
    });
  }
});

export default router;
