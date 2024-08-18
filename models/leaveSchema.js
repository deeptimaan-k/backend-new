const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const leaveSchema = new Schema({
    studentId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Student",
    },
    reason: {
        type: String,
        required: true,
    },
    leaveFrom: {
        type: Date,
        required: true,
    },
    leaveTo: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    });

const ApplyLeave = mongoose.model("Leave", leaveSchema);
module.exports = ApplyLeave;