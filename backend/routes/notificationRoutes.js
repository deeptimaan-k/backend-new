const express = require('express');
const router = express.Router();
const { sendNotification, getNotifications } = require('../controllers/notificationController');

// Send notification
router.post('/sendNotification', async (req, res) => {
    const { recipientType, recipientId, message } = req.body;
    try {
        const notification = await sendNotification(recipientType, recipientId, message);
        res.status(201).json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send notification' });
    }
});

// Get notifications for a recipient
router.get('/notifications/:recipientType/:recipientId', async (req, res) => {
    const { recipientType, recipientId } = req.params;
    try {
        const notifications = await getNotifications(recipientType, recipientId);
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch notifications' });
    }
});

module.exports = router;
