const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

module.exports = async function adminAuth(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ message: 'Admin access denied' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload.adminId) {
      return res.status(403).json({ message: 'Invalid admin token' });
    }

    const admin = await Admin.findById(payload.adminId).select('-password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(400).json({ message: 'Invalid admin token' });
  }
};
