const mongoose = require('mongoose');

const substitutionSchema = new mongoose.Schema({
    originalTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },
    substituteTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Substitution', substitutionSchema);
