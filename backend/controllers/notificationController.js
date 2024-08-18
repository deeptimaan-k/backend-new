// controllers/notificationController.js

const Notification = require('../models/notificationSchema');

// Send notification to a recipient
const sendNotification = async (recipientType, recipientId, message) => {
    try {
        const notification = new Notification({
            recipientType,
            recipientId,
            message
        });
        await notification.save();
        return notification;
    } catch (error) {
        throw error;
    }
};

// Get notifications for a recipient
const getNotifications = async (recipientType, recipientId) => {
    try {
        const notifications = await Notification.find({ recipientType, recipientId })
            .sort({ createdAt: -1 })
            .exec();
        return notifications;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    sendNotification,
    getNotifications
};
