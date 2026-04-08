// routes/payment.js
const router = require('express').Router();
const Razorpay = require('razorpay');

// Initialize Razorpay only if valid credentials are provided
let instance = null;

if (process.env.RAZORPAY_KEY && process.env.RAZORPAY_KEY !== 'your_razorpay_key_id') {
  instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
  });
}

router.post('/create-order', async (req,res)=>{
  if (!instance) {
    return res.status(503).json({ 
      error: 'Payment gateway not configured',
      message: 'Please configure Razorpay credentials in .env file'
    });
  }

  const options = {
    amount: req.body.amount * 100,
    currency: 'INR'
  };

  try {
    const order = await instance.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;