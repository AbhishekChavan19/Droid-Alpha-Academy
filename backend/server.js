require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');



const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(()=>console.log('MongoDB Connected'))
  .catch(err=>console.log(err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/notes', require('./routes/notes'));

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle client-side routing - send all non-API requests to index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});

app.listen(process.env.PORT, ()=>console.log(`Server running on port ${process.env.PORT}`));
