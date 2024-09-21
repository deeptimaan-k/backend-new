const mongoose = require('mongoose');

const adminAccountSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin', // Reference to the Admin model
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true, // Ensures that account numbers are unique
    },
    ifscCode: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      default: 0, // Default balance set to 0
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const AdminAccount = mongoose.model('AdminAccount', adminAccountSchema);

module.exports = AdminAccount;
