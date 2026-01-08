import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Transaction from '@/models/Transaction';
import { requireAuth } from '@/lib/auth';

// GET all transactions for the logged-in user
export async function GET(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'income' or 'expense'
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit')) || 100;

    // Build query
    const query = { userId: auth.userId };
    if (type) query.type = type;
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(limit)
      .lean();

    // Calculate summary statistics
    const summary = {
      totalIncome: 0,
      totalExpenses: 0,
      netCashFlow: 0,
      transactionCount: transactions.length,
    };

    transactions.forEach(t => {
      if (t.type === 'income') {
        summary.totalIncome += t.amount;
      } else if (t.type === 'expense') {
        summary.totalExpenses += t.amount;
      }
    });
    summary.netCashFlow = summary.totalIncome - summary.totalExpenses;

    return NextResponse.json(
      {
        success: true,
        transactions: transactions.map(t => ({
          id: t._id.toString(),
          type: t.type,
          amount: t.amount,
          category: t.category,
          description: t.description,
          date: t.date,
          isRecurring: t.isRecurring,
          recurringFrequency: t.recurringFrequency,
        })),
        summary,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST create a new transaction
export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const data = await request.json();
    const {
      type,
      amount,
      category,
      description,
      date,
      isRecurring,
      recurringFrequency,
    } = data;

    // Validate input
    if (!type || !amount || !category || !description) {
      return NextResponse.json(
        { error: 'Please provide type, amount, category, and description' },
        { status: 400 }
      );
    }

    if (!['income', 'expense'].includes(type)) {
      return NextResponse.json(
        { error: 'Type must be either "income" or "expense"' },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId: auth.userId,
      type,
      amount: parseFloat(amount),
      category,
      description,
      date: date ? new Date(date) : new Date(),
      isRecurring: isRecurring || false,
      recurringFrequency: recurringFrequency || null,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${type === 'income' ? 'Income' : 'Expense'} added successfully`,
        transaction: {
          id: transaction._id.toString(),
          type: transaction.type,
          amount: transaction.amount,
          category: transaction.category,
          description: transaction.description,
          date: transaction.date,
          isRecurring: transaction.isRecurring,
          recurringFrequency: transaction.recurringFrequency,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
