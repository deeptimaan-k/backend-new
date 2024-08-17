const Notification = require('../models/notificationSchema');

const sendNotification = async (req, res) => {
    const { senderId, recipientId, title, message } = req.body;
    try {
        const newNotification = new Notification({
            sender: senderId,
            recipient: recipientId,
            title,
            message
        });
        const savedNotification = await newNotification.save();
        res.status(201).json(savedNotification);
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getNotifications = async (req, res) => {
    const { userId } = req.params;
    try {
        const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json(notification);
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    sendNotification,
    getNotifications,
    markAsRead
};
