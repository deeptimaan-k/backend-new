const mongoose = require('mongoose');

const financeSchema = new mongoose.Schema({
    totalIncome: {
        type: Number,
        required: true,
    },
    totalExpense: {
        type: Number,
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("finance", financeSchema);
