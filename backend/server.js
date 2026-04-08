require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection (safe)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/notes', require('./routes/notes'));

// ✅ Root route FIRST
app.get('/', (req, res) => {
  res.send('Backend is LIVE 🚀');
});

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Catch-all (must be LAST)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});

// ✅ FIXED PORT (VERY IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});