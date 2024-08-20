const Expense = require("../models/expenseSchema");
const Revenue = require("../models/revenueSchema");

// Create a new expense entry
exports.createExpense = async (req, res) => {
  try {
    const { description, amount, date, category, schoolId } = req.body;

    const newExpense = new Expense({
      description,
      amount,
      date,
      category,
      school: schoolId,
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all expenses
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().populate("school");
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate total expenses
exports.getTotalExpenses = async (req, res) => {
  try {
    const totalExpenses = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
        },
      },
    ]);

    res.status(200).json(totalExpenses[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new revenue entry
exports.createRevenue = async (req, res) => {
  try {
    const { description, amount, date, source, schoolId } = req.body;

    const newRevenue = new Revenue({
      description,
      amount,
      date,
      source,
      school: schoolId,
    });

    await newRevenue.save();
    res.status(201).json(newRevenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all revenues
exports.getRevenues = async (req, res) => {
  try {
    const revenues = await Revenue.find().populate("school");
    res.status(200).json(revenues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate total revenue
exports.getTotalRevenue = async (req, res) => {
  try {
    const totalRevenue = await Revenue.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          totalAmount: 1,
        },
      },
    ]);

    res.status(200).json(totalRevenue[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
