import rateLimit from 'express-rate-limit';

// General API rate limiter (if needed in future)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests from this IP, please try again later' }
});

export { generalLimiter };
