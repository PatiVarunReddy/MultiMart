const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mvmp');
    console.log('[SUCCESS] Connected to MongoDB database');
  } catch (err) {
    console.error('[ERROR] MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    const email = '23eg107e46@anurag.edu.in';
    const password = '12345678';
    const name = 'Admin User';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('[INFO] Admin user already exists');
      process.exit(0);
    }

    // Create admin user (password will be hashed by pre-save hook)
    const adminUser = new User({
      name,
      email,
      password, // Don't hash here, let the pre-save hook do it
      role: 'admin',
      isEmailVerified: true, // Set to true for admin
      isActive: true
    });

    await adminUser.save();
    console.log('[SUCCESS] Admin user created successfully');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('Role: admin');

  } catch (error) {
    console.error('[ERROR] Failed to create admin user:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('[INFO] Database connection closed');
  }
};

createAdmin();