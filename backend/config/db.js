const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = () => {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mvmpDB";

  mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err));
};

module.exports = connectDB;
