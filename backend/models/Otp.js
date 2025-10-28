import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  identifier: { // email or phone (normalized)
    type: String,
    required: true,
    index: true,
  },
  code: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['login', 'verifyEmail'],
    default: 'login'
  },
  attempts: {
    type: Number,
    default: 0
  },
  blockedUntil: {
    type: Date,
    default: null,
    index: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }
  },
  verified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

export default mongoose.model('Otp', otpSchema);
