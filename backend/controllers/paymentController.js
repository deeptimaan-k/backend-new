const Razorpay = require('razorpay');
const Payment = require('../models/paymentSchema');
const Admin = require('../models/adminSchema');
const crypto = require('crypto');
require('dotenv').config();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});
exports.createPayment = async (req, res) => {
    const { schoolId } = req.params;
    const {
        month,
        amount,
        currency = 'INR',
        method = 'Credit Card'
    } = req.body;

    try {
        const school = await Admin.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Create Razorpay order
        const order = await razorpay.orders.create({
            amount: amount * 100, // Amount in paise
            currency,
            receipt: `receipt_${new Date().getTime()}`,
        });

        const payment = new Payment({
            school: school._id,
            month,
            amount,
            orderId: order.id,
            paymentId: null, // Will be set after verification
            transactionId: null, // Will be set after verification
            receipt: order.receipt,
            currency,
            method,
            status: 'Pending' // Initial status
        });

        await payment.save();

        res.status(201).json({
            order,
            payment
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.verifyPayment = async (req, res) => {
    const { schoolId } = req.params;
    const {
        paymentId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
    } = req.body;

    try {
        const school = await Admin.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        // Create a string to verify the signature
        const body = `${razorpayOrderId}|${razorpayPaymentId}`;
        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        // Compare generated signature with Razorpay signature
        if (generatedSignature === razorpaySignature) {
            const payment = await Payment.findOneAndUpdate(
                { orderId: razorpayOrderId },
                {
                    paymentId: razorpayPaymentId,
                    status: 'Completed'
                },
                { new: true }
            );

            if (!payment) {
                return res.status(404).json({ status: 'Payment not found' });
            }

            res.json({ status: 'Payment verified successfully', payment });
        } else {
            res.status(400).json({ status: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
