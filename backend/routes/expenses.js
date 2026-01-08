import express from 'express';
import Expense from '../models/Expense.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/expenses - Get all expenses for logged-in user
router.get('/', async (req, res) => {
  try {
    // Get expenses for this user, sorted by date (newest first)
    const expenses = await Expense.find({ userId: req.userId })
      .sort({ date: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses: expenses.map(expense => ({
        id: expense._id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expenses',
    });
  }
});

// GET /api/expenses/:id - Get a specific expense
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      expense: {
        id: expense._id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      },
    });
  } catch (error) {
    console.error('Get expense error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch expense',
    });
  }
});

// POST /api/expenses - Create a new expense
router.post('/', async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    // Validate input
    if (!amount || !category || !description) {
      return res.status(400).json({
        success: false,
        error: 'Please provide amount, category, and description',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0',
      });
    }

    // Create expense
    const expense = await Expense.create({
      userId: req.userId,
      amount: parseFloat(amount),
      category,
      description,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      expense: {
        id: expense._id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create expense error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create expense',
    });
  }
});

// PUT /api/expenses/:id - Update an expense
router.put('/:id', async (req, res) => {
  try {
    const { amount, category, description, date } = req.body;

    // Find expense
    const expense = await Expense.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found',
      });
    }

    // Update fields
    if (amount !== undefined) expense.amount = amount;
    if (category) expense.category = category;
    if (description) expense.description = description;
    if (date) expense.date = new Date(date);

    await expense.save();

    res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      expense: {
        id: expense._id,
        amount: expense.amount,
        category: expense.category,
        description: expense.description,
        date: expense.date,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update expense error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update expense',
    });
  }
});

// DELETE /api/expenses/:id - Delete an expense
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        error: 'Expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
    });
  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete expense',
    });
  }
});

export default router;
