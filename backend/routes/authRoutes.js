import express from 'express';
const router = express.Router();
import { register, login, getMe, requestOtp, verifyOtp } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { otpRequestLimiter } from '../middleware/rateLimiter.js';
import { validate, registerSchema, loginSchema, requestOtpSchema, verifyOtpSchema } from '../middleware/validation.js';

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/request-otp', otpRequestLimiter, validate(requestOtpSchema), requestOtp);
router.post('/verify-otp', validate(verifyOtpSchema), verifyOtp);
router.get('/me', protect, getMe);

export default router;
