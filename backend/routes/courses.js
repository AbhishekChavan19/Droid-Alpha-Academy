const router2 = require('express').Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course');
const User = require('../models/User');

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
  const courseId = req.params.courseId;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.enrolledCourses.includes(course._id)) {
    return res.status(200).json({ message: 'Already enrolled in this course', course });
  }

  user.enrolledCourses.push(course._id);
  await user.save();

  res.json({ message: 'Enrolled successfully', course });
});

module.exports = router2;
