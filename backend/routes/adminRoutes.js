const express = require('express');
const router = express.Router();
const { sendNotificationToRecipient } = require('../controllers/admin-controller');

// Example endpoint for sending notification
router.post('/sendNotification', sendNotificationToRecipient);

module.exports = router;
