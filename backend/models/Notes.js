const mongoose = require('mongoose');

const notesSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    pdfUrl: { type: String, required: true, trim: true },
    uploadedByAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }
  },
  { timestamps: true }
);
module.exports = mongoose.model('Notes', notesSchema);
