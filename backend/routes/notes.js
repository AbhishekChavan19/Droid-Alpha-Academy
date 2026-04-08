// routes/notes.js
const router = require('express').Router();
const Notes = require('../models/Notes');

router.post('/', async(req,res)=>{
  const note = new Notes(req.body);
  await note.save();
  res.json(note);
});

router.get('/:courseId', async(req,res)=>{
  const notes = await Notes.find({courseId:req.params.courseId});
  res.json(notes);
});

module.exports = router;