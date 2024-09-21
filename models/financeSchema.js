const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Expense", "Revenue"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Finance", financeSchema);
