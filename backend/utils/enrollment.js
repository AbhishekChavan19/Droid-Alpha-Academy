const User = require('../models/User');
const Course = require('../models/Course');

async function enrollUserInCourse(userId, courseId) {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error('Course not found');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  if (!user.enrolledCourses.some((id) => id.toString() === course._id.toString())) {
    user.enrolledCourses.push(course._id);
    await user.save();
  }

  return course;
}

module.exports = { enrollUserInCourse };
