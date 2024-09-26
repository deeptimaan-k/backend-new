const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    }, // assuming you have a User model
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true }, // the teacher or admin
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
