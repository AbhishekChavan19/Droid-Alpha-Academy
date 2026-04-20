const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const Announcement = require('../models/Announcement');

router.get('/', async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ publishedAt: -1 })
      .limit(20);
    return res.json(announcements);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load announcements' });
  }
});

router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: 'Title and body are required' });
    }

    const announcement = await Announcement.create({
      title,
      body,
      createdByAdminId: req.admin._id
    });
    return res.status(201).json(announcement);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to create announcement' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Announcement not found' });
    }
    return res.json({ message: 'Announcement deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to delete announcement' });
  }
});

module.exports = router;
