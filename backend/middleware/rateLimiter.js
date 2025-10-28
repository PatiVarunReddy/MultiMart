const rateLimit = require('express-rate-limit');

// Limit to 5 requests per 15 minutes per IP by default
const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: 'Too many OTP requests from this IP, please try again later' }
});

module.exports = { otpRequestLimiter };
