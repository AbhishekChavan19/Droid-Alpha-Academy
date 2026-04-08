require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('Error: Missing JWT_SECRET in backend/.env. Add JWT_SECRET=<your-secret> and restart the server.');
  process.exit(1);
}

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

app.listen(process.env.PORT, ()=>console.log(`Server running on port ${process.env.PORT}`));
