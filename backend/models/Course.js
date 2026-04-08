const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  duration: String,
  level: String
});
module.exports = mongoose.model('Course', courseSchema);

// models/Payment.js
