const mongoose = require("mongoose");

const revenueSchema = new mongoose.Schema({
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
  source: {
    type: String,
    required: true,
    enum: ["Tuition Fees", "Donations", "Grants", "Miscellaneous"],
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Revenue", revenueSchema);
