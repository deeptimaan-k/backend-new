const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin', 
        required: true
    },
    month: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    amountRefunded: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentId: {
        type: String,
        required: false, // Change this to false
        unique: true
    },
    orderId: {
        type: String,
        required: true
    },
    transactionId: {
        type: String
    },
    receipt: {
        type: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending'
    },
    method: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Wallet'],
        default: 'Credit Card'
    },
    notes: {
        type: Map,
        of: String
    }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
