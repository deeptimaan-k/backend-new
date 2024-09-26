const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analysisSchema = new Schema({
    question: {
        type: String,
        required: [true, 'Question text is required']
    },
    studentAnswer: {
        type: Schema.Types.Mixed,
    },
    correctAnswer: {
        type: Schema.Types.Mixed,
    },
    advice: [String],
    improvement: [String]
}, { _id: false });

const assignmentResultSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    assignmentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment'
    },
    results: [
        {
            question: {
                type: String,
                required: [true, 'Question text is required']
            },
            userAnswer: {
                type: Schema.Types.Mixed,
            },
            correct: {
                type: Boolean,
            },
            attempted: {
                type: Boolean,
            }
        }
    ],
    totalMarks: {
        type: Number,
        required: [true, 'Total marks are required']
    },
    analyse: [analysisSchema]
}, { timestamps: true });

const AssignmentResult = mongoose.model('AssignmentResult', assignmentResultSchema);
module.exports = AssignmentResult;
