// assignmentSchema.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssignmentSchema = new Schema({
    title: String,
    classId: { type: Schema.Types.ObjectId, ref: 'AiClassS' },
    subject: String,
    chapter: String,
    topic: String,
    questions: [{
        question: String,
        options: [String],
        correct: String
    }]
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
