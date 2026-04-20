const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const isValid = await bcrypt.compare(password, admin.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const adminToken = jwt.sign({ adminId: admin._id, role: 'admin' }, process.env.JWT_SECRET);
    return res.json({ adminToken, name: admin.name || 'Admin' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Admin login failed' });
  }
});

module.exports = router;
