const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    createdByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    publishedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Announcement', announcementSchema);
