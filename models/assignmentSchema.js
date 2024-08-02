const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
    title: String,
    classId: {
        type: Schema.Types.ObjectId,
        ref: 'AiClassS'
    },
    subject: String,
    chapter: String,
    topic: String,
    questions: [
        {
            question: String,
            options: [String],
            correctAnswer: String,
            questionType: { type: String, enum: ['mcq', 'fill', 'short', 'long', 'T/F'] }
        }
    ]
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
