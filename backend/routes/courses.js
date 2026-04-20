const router2 = require('express').Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');
const Payment = require('../models/Payment');
const { enrollUserInCourse } = require('../utils/enrollment');

router2.post('/', auth, async(req,res)=>{
  const course = new Course(req.body);
  await course.save();
  res.json(course);
});

router2.get('/', async(req,res)=>{
  const courses = await Course.find();
  res.json(courses);
});

router2.get('/enrolled', auth, async(req,res)=>{
  const user = await User.findById(req.user.id).populate('enrolledCourses');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user.enrolledCourses || []);
});

router2.post('/enroll/:courseId', auth, async(req,res)=>{
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.enrolledCourses.some((id) => id.toString() === course._id.toString())) {
      return res.status(200).json({ message: 'Already enrolled in this course', course });
    }

    const paidRecord = await Payment.findOne({
      userId: req.user.id,
      courseId,
      status: 'paid'
    });
    if (!paidRecord) {
      return res.status(402).json({ message: 'Payment required before enrollment' });
    }

    const enrolledCourse = await enrollUserInCourse(req.user.id, courseId);
    return res.json({ message: 'Enrolled successfully', course: enrolledCourse });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Enrollment failed' });
  }
});

module.exports = router2;
