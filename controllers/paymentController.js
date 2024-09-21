const Razorpay = require('razorpay');
const Payment = require('../models/paymentSchema');
const Admin = require('../models/adminSchema');
const crypto = require('crypto');
require('dotenv').config();


const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const verifyPayment = async (req, res) => {
    const { schoolId } = req.params; 
    const {
        paymentId,
        amount,
        currency,
        status,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature
    } = req.body;

    console.log('Request Body:', req.body); 

    try {
        // Find the school by ID
        const school = await Admin.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        
        const body = `${razorpayOrderId}|${razorpayPaymentId}`;
        console.log('Body:', body); 

        
        const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        console.log('Generated Signature:', generatedSignature); 
        console.log('Razorpay Signature:', razorpaySignature);

        
        if (generatedSignature === razorpaySignature) {
            
            const payment = await Payment.findOneAndUpdate(
                { paymentId: razorpayPaymentId },
                { status: 'Completed' },
                { new: true }
            );

            if (!payment) {
                return res.status(404).json({ status: 'Payment not found' });
            }

            res.json({ status: 'Payment verified successfully' });
        } else {
            res.status(400).json({ status: 'Invalid payment signature' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create Payment
const createPayment = async (req, res) => {
    const { schoolId } = req.params;
    const {
        month,
        amount,
        orderId,
        paymentId,
        transactionId,
        receipt,
        currency = 'INR',
        method = 'Credit Card'
    } = req.body;

    try {
        const school = await Admin.findById(schoolId);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        const payment = new Payment({
            school: school._id,
            month,
            amount,
            orderId,
            paymentId,
            transactionId,
            receipt,
            currency,
            method
        });

        await payment.save();
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    verifyPayment,
    createPayment
}