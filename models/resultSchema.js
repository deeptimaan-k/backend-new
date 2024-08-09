const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignmentResultSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    assignmentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment'
    },
    questions: [
        {
            questionId: {
                type: Schema.Types.ObjectId,
                required: true
            },
            correct: {
                type: Boolean,
                required: true
            },
            attempted: {
                type: Boolean,
                required: true
            }
        }
    ]
});

const AssignmentResult = mongoose.model('AssignmentResult', assignmentResultSchema);
module.exports = AssignmentResult;
