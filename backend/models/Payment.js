const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: String,
  courseId: String,
  status: String
});
module.exports = mongoose.model('Payment', paymentSchema);