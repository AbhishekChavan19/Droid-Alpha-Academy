const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/signup', async (req,res)=>{
  try {
    const {name,email,password} = req.body;
    const hashed = await bcrypt.hash(password,10);
    const user = new User({name,email,password:hashed});
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Signup failed' });
  }
});

router.post('/login', async (req,res)=>{
  try {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET);
    res.json({token, name: user.name});
  } catch (error) {
    res.status(500).json({ message: error.message || 'Login failed' });
  }
});

module.exports = router;