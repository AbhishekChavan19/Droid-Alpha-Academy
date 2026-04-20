const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');

router.get('/', adminAuth, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('enrolledCourses', 'title price level')
      .sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load users' });
  }
});

router.get('/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('enrolledCourses', 'title price level');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load user' });
  }
});

module.exports = router;
