// routes/payment.js
const router = require('express').Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const { enrollUserInCourse } = require('../utils/enrollment');

// Initialize Razorpay only if valid credentials are provided
let instance = null;
const razorpayKeyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

if (razorpayKeyId && razorpayKeySecret) {
  instance = new Razorpay({
    key_id: razorpayKeyId,
    key_secret: razorpayKeySecret
  });
}

router.post('/create-order', auth, async (req, res) => {
  if (!instance) {
    return res.status(503).json({
      error: 'Payment gateway not configured',
      message: 'Please configure Razorpay credentials in .env file'
    });
  }

  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ message: 'courseId is required' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const options = {
      amount: Math.round((course.price || 0) * 100),
      currency: 'INR',
      receipt: `${req.user.id}-${course._id}-${Date.now()}`
    };
    const order = await instance.orders.create(options);

    await Payment.create({
      userId: req.user.id,
      courseId: course._id,
      amount: course.price || 0,
      currency: options.currency,
      razorpayOrderId: order.id,
      status: 'created'
    });

    return res.json({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency,
      courseId: course._id,
      courseTitle: course.title,
      key: razorpayKeyId
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification fields are required' });
    }

    const payment = await Payment.findOne({
      razorpayOrderId,
      userId: req.user.id
    });
    if (!payment) {
      return res.status(404).json({ message: 'Payment order not found' });
    }

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(payload)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      payment.status = 'failed';
      payment.razorpayPaymentId = razorpayPaymentId;
      payment.razorpaySignature = razorpaySignature;
      await payment.save();
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    payment.status = 'paid';
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    await payment.save();

    const course = await enrollUserInCourse(req.user.id, payment.courseId);
    return res.json({
      message: 'Payment verified and enrollment successful',
      course
    });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Payment verification failed' });
  }
});

module.exports = router;