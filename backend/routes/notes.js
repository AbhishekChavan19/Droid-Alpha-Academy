// routes/notes.js
const router = require('express').Router();
const Notes = require('../models/Notes');
const adminAuth = require('../middleware/adminAuth');

router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, courseId, pdfUrl } = req.body;
    if (!title || !courseId || !pdfUrl) {
      return res.status(400).json({ message: 'Title, courseId and pdfUrl are required' });
    }

    const note = await Notes.create({
      title,
      courseId,
      pdfUrl,
      uploadedByAdminId: req.admin._id
    });
    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to create note' });
  }
});

router.get('/:courseId', async (req, res) => {
  try {
    const notes = await Notes.find({ courseId: req.params.courseId }).sort({ createdAt: -1 });
    return res.json(notes);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Failed to load notes' });
  }
});

module.exports = router;