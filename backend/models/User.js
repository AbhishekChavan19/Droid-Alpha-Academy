const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: { type: String, default: 'student' },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
  },
  { timestamps: true }
);
module.exports = mongoose.model('User', userSchema);
