require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: '*' }));

// ✅ Root route (must exist)
app.get('/', (req, res) => {
  res.send('Server is LIVE 🚀');
});

// ✅ Start server FIRST (IMPORTANT for Render)
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ Connect MongoDB AFTER server starts (prevents crash)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB Error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin/auth', require('./routes/adminAuth'));
app.use('/api/admin/users', require('./routes/adminUsers'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/announcements', require('./routes/announcements'));