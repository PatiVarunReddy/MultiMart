const express = require('express');
const router = express.Router();
const { register, login, getMe, requestOtp, verifyOtp } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { otpRequestLimiter } = require('../middleware/rateLimiter');
const { validate, registerSchema, loginSchema, requestOtpSchema, verifyOtpSchema } = require('../middleware/validation');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/request-otp', otpRequestLimiter, validate(requestOtpSchema), requestOtp);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.get('/me', protect, getMe);

module.exports = router;
