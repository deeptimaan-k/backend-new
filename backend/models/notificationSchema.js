// models/notificationSchema.js

const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientType: { type: String, enum: ['teacher', 'student'], required: true },
    recipientId: { type: mongoose.Schema.Types.ObjectId, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', notificationSchema);
