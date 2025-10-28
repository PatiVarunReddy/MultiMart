const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['customer','vendor','admin'], default: 'customer' },
  paymentMethods: [{ type: Object }],
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifsc: String
  },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', UserSchema);
