const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classroomSchema = new Schema({
    class: String,
    subject: String,
    chapters: [
        {
            title: String,
            topics: [String],
            assignments: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Assignment'
                }
            ],
            notes: [String]
        }
    ]
});

const AiClassS = mongoose.model('AiClassS', classroomSchema);
module.exports = AiClassS;