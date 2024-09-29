const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Classroom',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: String,
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;