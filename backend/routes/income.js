import express from 'express';
import Income from '../models/Income.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/income - Get all income records for logged-in user
router.get('/', async (req, res) => {
  try {
    const incomes = await Income.find({ userId: req.userId })
      .sort({ date: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: incomes.length,
      incomes: incomes.map(income => ({
        id: income._id,
        amount: income.amount,
        source: income.source,
        description: income.description,
        frequency: income.frequency,
        isRecurring: income.isRecurring,
        date: income.date,
        createdAt: income.createdAt,
        updatedAt: income.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Get income error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch income records',
    });
  }
});

// POST /api/income - Create a new income record
router.post('/', async (req, res) => {
  try {
    const { amount, source, description, frequency, isRecurring, date } = req.body;

    // Validate input
    if (!amount || !source) {
      return res.status(400).json({
        success: false,
        error: 'Please provide amount and source',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Amount must be greater than 0',
      });
    }

    // Create income
    const income = await Income.create({
      userId: req.userId,
      amount: parseFloat(amount),
      source,
      description: description || '',
      frequency: frequency || 'monthly',
      isRecurring: isRecurring || false,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Income added successfully',
      income: {
        id: income._id,
        amount: income.amount,
        source: income.source,
        description: income.description,
        frequency: income.frequency,
        isRecurring: income.isRecurring,
        date: income.date,
        createdAt: income.createdAt,
        updatedAt: income.updatedAt,
      },
    });
  } catch (error) {
    console.error('Create income error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create income',
    });
  }
});

// DELETE /api/income/:id - Delete an income record
router.delete('/:id', async (req, res) => {
  try {
    const income = await Income.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!income) {
      return res.status(404).json({
        success: false,
        error: 'Income record not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Income deleted successfully',
    });
  } catch (error) {
    console.error('Delete income error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete income',
    });
  }
});

export default router;
