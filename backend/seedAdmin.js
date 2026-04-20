require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || 'Super Admin';

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const exists = await Admin.findOne({ email: email.toLowerCase() });
  if (exists) {
    console.log('Admin already exists');
    await mongoose.disconnect();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await Admin.create({
    name,
    email: email.toLowerCase(),
    password: hashedPassword
  });

  console.log('Admin created successfully');
  await mongoose.disconnect();
}

seedAdmin().catch(async (err) => {
  console.error('Failed to seed admin:', err.message);
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  process.exit(1);
});
