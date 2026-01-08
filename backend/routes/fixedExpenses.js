import express from 'express';
import FixedExpense from '../models/FixedExpense.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/fixed-expenses - Get all fixed expenses for logged-in user
router.get('/', async (req, res) => {
  try {
    const fixedExpenses = await FixedExpense.find({ userId: req.userId })
      .sort({ dueDay: 1 })
      .lean();

    res.status(200).json({
      success: true,
      count: fixedExpenses.length,
      fixedExpenses: fixedExpenses.map(expense => ({
        id: expense._id,
        name: expense.name,
        amount: expense.amount,
        category: expense.category,
        dueDay: expense.dueDay,
        description: expense.description,
        isActive: expense.isActive,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get fixed expenses error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch fixed expenses',
    });
  }
});

// POST /api/fixed-expenses - Create a new fixed expense
router.post('/', async (req, res) => {
  try {
    const { name, amount, category, dueDay, description } = req.body;

    // Validate input
    if (!name || !amount || !category || !dueDay) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, amount, category, and due day',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0',
      });
    }

    if (dueDay < 1 || dueDay > 31) {
      return res.status(400).json({
        success: false,
        error: 'Due day must be between 1 and 31',
      });
    }

    // Create fixed expense
    const fixedExpense = await FixedExpense.create({
      userId: req.userId,
      name,
      amount: parseFloat(amount),
      category,
      dueDay: parseInt(dueDay),
      description: description || '',
    });

    res.status(201).json({
      success: true,
      message: 'Fixed expense added successfully',
      fixedExpense: {
        id: fixedExpense._id,
        name: fixedExpense.name,
        amount: fixedExpense.amount,
        category: fixedExpense.category,
        dueDay: fixedExpense.dueDay,
        description: fixedExpense.description,
        isActive: fixedExpense.isActive,
        createdAt: fixedExpense.createdAt,
        updatedAt: fixedExpense.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create fixed expense error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create fixed expense',
    });
  }
});

// PUT /api/fixed-expenses/:id - Update a fixed expense
router.put('/:id', async (req, res) => {
  try {
    const { name, amount, category, dueDay, description, isActive } = req.body;

    const fixedExpense = await FixedExpense.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!fixedExpense) {
      return res.status(404).json({
        success: false,
        error: 'Fixed expense not found',
      });
    }

    // Update fields with validation
    if (name) fixedExpense.name = name;
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be greater than 0',
        });
      }
      fixedExpense.amount = amount;
    }
    if (category) fixedExpense.category = category;
    if (dueDay !== undefined) {
      if (dueDay < 1 || dueDay > 31) {
        return res.status(400).json({
          success: false,
          error: 'Due day must be between 1 and 31',
        });
      }
      fixedExpense.dueDay = dueDay;
    }
    if (description !== undefined) fixedExpense.description = description;
    if (isActive !== undefined) fixedExpense.isActive = isActive;

    await fixedExpense.save();

    res.status(200).json({
      success: true,
      message: 'Fixed expense updated successfully',
      fixedExpense: {
        id: fixedExpense._id,
        name: fixedExpense.name,
        amount: fixedExpense.amount,
        category: fixedExpense.category,
        dueDay: fixedExpense.dueDay,
        description: fixedExpense.description,
        isActive: fixedExpense.isActive,
        createdAt: fixedExpense.createdAt,
        updatedAt: fixedExpense.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update fixed expense error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update fixed expense',
    });
  }
});

// DELETE /api/fixed-expenses/:id - Delete a fixed expense
router.delete('/:id', async (req, res) => {
  try {
    const fixedExpense = await FixedExpense.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!fixedExpense) {
      return res.status(404).json({
        success: false,
        error: 'Fixed expense not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fixed expense deleted successfully',
    });
  } catch (error) {
    console.error('Delete fixed expense error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete fixed expense',
    });
  }
});

export default router;
