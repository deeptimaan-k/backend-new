const mongoose = require("mongoose")


const examResultSchema = new mongoose.Schema({
    subName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
    },
    marksObtained: {
        type: Number,
        default: 0,
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Exam",
    },
});

const newStudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "newStudent"
    },
    examResult: [examResultSchema],
});

module.exports = mongoose.model("newStudent", newStudentSchema);