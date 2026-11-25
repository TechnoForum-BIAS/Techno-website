const rateLimit = require('express-rate-limit');

/**
 * Standard Auth Limiter (Prevents brute force on login and register)
 * 15 minutes window, max 15 requests per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
  }
});

/**
 * Strict Limiter for OTP and Password Reset requests
 * 15 minutes window, max 5 requests per IP
 */
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many verification/reset requests. Please wait 15 minutes before requesting another OTP.'
  }
});

module.exports = { authLimiter, otpLimiter };
