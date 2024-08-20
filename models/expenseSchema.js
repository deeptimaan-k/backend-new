const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  category: {
    type: String,
    required: true,
    enum: ["Salary", "Utilities", "Maintenance", "Miscellaneous"],
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
