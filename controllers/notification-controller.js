const Notification = require('../models/notificationSchema');

const User = require('../models/adminSchema');
//school schema bane ke baad link krna hai
// const School = require('../models/');

const sendNotification = async (req, res) => {
    const { senderId, title, message } = req.body;

    try {
        const sender = await User.findById(senderId);
        if (!sender || sender.role !== 'Admin') {
            return res.status(403).json({ message: 'Only admins are allowed to send notifications' });
        }

        const school = await User.findOne({ admin: senderId });
        if (!school) {
            return res.status(404).json({ message: 'School not found for this admin' });
        }

        const recipients = await User.find({ school: school._id });
        if (recipients.length === 0) {
            return res.status(404).json({ message: 'No users found in this school' });
        }

        const notifications = await Promise.all(recipients.map(async (recipient) => {
            const newNotification = new Notification({
                sender: senderId,
                recipient: recipient._id,
                title,
                message
            });
            return await newNotification.save();
        }));

        res.status(201).json({
            message: 'Notifications sent to all school members successfully',
            notifications
        });
    } catch (error) {
        console.error('Error sending notifications:', error);
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
