const express = require('express');
const router = express.Router();
const {
  register,
  verifyEmail,
  resendVerification,
  login,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');

// Authentication & Registration with Rate Limiting
router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);

// Email Verification with OTP & Resend with Rate Limiting
router.post('/verify-email', otpLimiter, verifyEmail);
router.post('/resend-verification', otpLimiter, resendVerification);

// Forgot & Reset Password with Rate Limiting
router.post('/forgot-password', otpLimiter, forgotPassword);
router.post('/reset-password', otpLimiter, resetPassword);

// Profile
router.get('/me', verifyToken, getMe);

module.exports = router;
