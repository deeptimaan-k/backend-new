const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  dateIssued: {
    type: Date,
    required: true,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending"
  }
});

const feesSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sclass",
    required: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    required: true
  },
  amountDue: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "Paid", "Overdue"],
    default: "Pending"
  },
  paymentMethod: {
    type: String,
    enum: ["Credit Card", "Debit Card", "Net Banking", "UPI", "Wallet", "Cash"],
    default: "Cash"
  },
  transactionId: {
    type: String
  },
  receipt: {
    type: String
  },
  invoice: invoiceSchema // Embedding the Invoice schema here
}, { timestamps: true });

module.exports = mongoose.model("Fees", feesSchema);
