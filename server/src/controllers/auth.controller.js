const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const { JWT_SECRET } = require('../middleware/auth.middleware');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// Normalize roles into: 'admin', 'coordinator', 'user'
const normalizeRole = (role) => {
  if (!role) return 'user';
  const r = role.toLowerCase().trim();
  if (r === 'admin' || r === 'super_admin') return 'admin';
  if (r === 'coordinator') return 'coordinator';
  return 'user';
};

// Initial Mock Users with 3 Roles: admin, coordinator, user
const mockUsers = [
  {
    id: 'usr-admin-01',
    name: 'Technoforum Admin',
    email: 'admin@bias.ac.in',
    rollNumber: 'FAC-ADMIN-01',
    role: 'admin',
    is_verified: true,
    passwordHash: bcrypt.hashSync('admin123', 8),
    created_at: new Date().toISOString()
  },
  {
    id: 'usr-coord-01',
    name: 'Hardware & Events Coordinator',
    email: 'coordinator@bias.ac.in',
    rollNumber: 'FAC-COORD-01',
    role: 'coordinator',
    is_verified: true,
    passwordHash: bcrypt.hashSync('coord123', 8),
    created_at: new Date().toISOString()
  },
  {
    id: 'usr-user-01',
    name: 'Aarav Sharma (Student)',
    email: 'aarav.2023@bias.ac.in',
    rollNumber: '230101',
    role: 'user',
    is_verified: true,
    passwordHash: bcrypt.hashSync('user123', 8),
    created_at: new Date().toISOString()
  }
];

// Helper to generate 6-digit OTP code
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Register a new user
 * Sends Brevo SMTP verification email with 6-digit OTP
 */
const register = async (req, res) => {
  try {
    const { name, email, rollNumber, password, role } = req.body;

    if (!name || !email || !rollNumber || !password) {
      return res.status(400).json({ success: false, message: 'All fields (name, email, rollNumber, password) are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const assignedRole = normalizeRole(role);
    const otpCode = generateOTP();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins
    const passwordHash = await bcrypt.hash(password, 10);

    // If Supabase is connected:
    if (supabase) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email, roll_number')
        .or(`email.eq.${email.toLowerCase()},roll_number.eq.${rollNumber}`)
        .single();

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email or Roll Number is already registered.' });
      }

      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          name,
          email: email.toLowerCase(),
          roll_number: rollNumber,
          password_hash: passwordHash,
          role: assignedRole,
          is_verified: false,
          verification_code: otpCode,
          verification_token: verificationToken,
          verification_expires: verificationExpires
        }])
        .select()
        .single();

      if (error) throw error;

      // Send verification email via Brevo
      await sendVerificationEmail(email.toLowerCase(), name, otpCode, verificationToken);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! A 6-digit verification code has been sent to your email.',
        email: email.toLowerCase(),
        requiresVerification: true
      });
    }

    // In-memory Fallback
    const exists = mockUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase() || u.rollNumber.toLowerCase() === rollNumber.toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email or Roll Number already registered in mock database.' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: email.toLowerCase(),
      rollNumber,
      role: assignedRole,
      passwordHash,
      is_verified: false,
      verification_code: otpCode,
      verification_token: verificationToken,
      verification_expires: verificationExpires,
      created_at: new Date().toISOString()
    };
    mockUsers.push(newUser);

    // Dispatch email
    await sendVerificationEmail(email.toLowerCase(), name, otpCode, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful! A 6-digit verification code has been sent to your email.',
      email: email.toLowerCase(),
      requiresVerification: true
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Verify Email using 6-digit OTP code or Token
 */
const verifyEmail = async (req, res) => {
  try {
    const { email, code, token } = req.body;

    if (!email || (!code && !token)) {
      return res.status(400).json({ success: false, message: 'Email and verification code/token are required.' });
    }

    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.is_verified) {
        return res.json({ success: true, message: 'Email is already verified. You can log in.' });
      }

      // Check expiry
      if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
        return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new code.' });
      }

      const isValidCode = code && user.verification_code === code.trim();
      const isValidToken = token && user.verification_token === token.trim();

      if (!isValidCode && !isValidToken) {
        return res.status(400).json({ success: false, message: 'Invalid verification code.' });
      }

      // Update to verified
      await supabase
        .from('users')
        .update({
          is_verified: true,
          verification_code: null,
          verification_token: null,
          verification_expires: null
        })
        .eq('id', user.id);

      const authToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role, rollNumber: user.roll_number, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Email verified successfully! Welcome to Technoforum.',
        token: authToken,
        user: { id: user.id, name: user.name, email: user.email, rollNumber: user.roll_number, role: user.role }
      });
    }

    // Fallback Mock
    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in mock store.' });
    }

    if (user.is_verified) {
      return res.json({ success: true, message: 'Email is already verified. You can log in.' });
    }

    if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
      return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new code.' });
    }

    const isValidCode = code && user.verification_code === code.trim();
    const isValidToken = token && user.verification_token === token.trim();

    if (!isValidCode && !isValidToken) {
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    user.is_verified = true;
    user.verification_code = null;
    user.verification_token = null;
    user.verification_expires = null;

    const authToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role, rollNumber: user.rollNumber, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Email verified successfully! Welcome to Technoforum.',
      token: authToken,
      user: { id: user.id, name: user.name, email: user.email, rollNumber: user.rollNumber, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Resend Verification Code
 */
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const otpCode = generateOTP();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, is_verified')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.is_verified) {
        return res.status(400).json({ success: false, message: 'This email is already verified. Please sign in.' });
      }

      await supabase
        .from('users')
        .update({
          verification_code: otpCode,
          verification_token: verificationToken,
          verification_expires: verificationExpires
        })
        .eq('id', user.id);

      await sendVerificationEmail(email.toLowerCase(), user.name, otpCode, verificationToken);
      return res.json({ success: true, message: 'A new 6-digit verification code has been dispatched.' });
    }

    const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found in mock store.' });
    }

    if (user.is_verified) {
      return res.status(400).json({ success: false, message: 'This email is already verified. Please sign in.' });
    }

    user.verification_code = otpCode;
    user.verification_token = verificationToken;
    user.verification_expires = verificationExpires;

    await sendVerificationEmail(email.toLowerCase(), user.name, otpCode, verificationToken);
    res.json({ success: true, message: 'A new 6-digit verification code has been dispatched.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Login User (Validates email/rollNumber + password + is_verified)
 */
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email/Roll Number and Password.' });
    }

    const cleanId = identifier.trim().toLowerCase();

    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.ilike.${cleanId},roll_number.ilike.${cleanId}`)
        .single();

      if (error || !user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      }

      // Check email verification status
      if (user.is_verified === false) {
        return res.status(403).json({
          success: false,
          notVerified: true,
          email: user.email,
          message: 'Your email is not verified yet. Please enter the OTP code sent to your email.'
        });
      }

      const userRole = normalizeRole(user.role);
      const token = jwt.sign(
        { id: user.id, email: user.email, role: userRole, rollNumber: user.roll_number, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, rollNumber: user.roll_number, role: userRole }
      });
    }

    // In-memory fallback
    const user = mockUsers.find(
      u => u.email.toLowerCase() === cleanId || u.rollNumber.toLowerCase() === cleanId
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    // Check email verification status
    if (user.is_verified === false) {
      return res.status(403).json({
        success: false,
        notVerified: true,
        email: user.email,
        message: 'Your email is not verified yet. Please enter the OTP code sent to your email.'
      });
    }

    const userRole = normalizeRole(user.role);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: userRole, rollNumber: user.rollNumber, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, rollNumber: user.rollNumber, role: userRole }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Forgot Password - Generates reset OTP and dispatches email via Brevo
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your account email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const resetCode = generateOTP();
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    if (supabase) {
      const { data: user } = await supabase
        .from('users')
        .select('id, name')
        .eq('email', cleanEmail)
        .single();

      if (user) {
        await supabase
          .from('users')
          .update({
            reset_code: resetCode,
            reset_token: resetToken,
            reset_expires: resetExpires
          })
          .eq('id', user.id);

        await sendPasswordResetEmail(cleanEmail, user.name, resetCode, resetToken);
      }
      return res.json({
        success: true,
        message: 'If an account exists with this email, a 6-digit password reset code has been sent.'
      });
    }

    const user = mockUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (user) {
      user.reset_code = resetCode;
      user.reset_token = resetToken;
      user.reset_expires = resetExpires;
      await sendPasswordResetEmail(cleanEmail, user.name, resetCode, resetToken);
    }

    res.json({
      success: true,
      message: 'If an account exists with this email, a 6-digit password reset code has been sent.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Reset Password with OTP Code
 */
const resetPassword = async (req, res) => {
  try {
    const { email, code, token, newPassword } = req.body;

    if (!email || (!code && !token) || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email, reset code/token, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(newPassword, 10);

    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (error || !user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.reset_expires && new Date(user.reset_expires) < new Date()) {
        return res.status(400).json({ success: false, message: 'Password reset code has expired. Please request a new one.' });
      }

      const isValidCode = code && user.reset_code === code.trim();
      const isValidToken = token && user.reset_token === token.trim();

      if (!isValidCode && !isValidToken) {
        return res.status(400).json({ success: false, message: 'Invalid reset code or token.' });
      }

      await supabase
        .from('users')
        .update({
          password_hash: passwordHash,
          reset_code: null,
          reset_token: null,
          reset_expires: null
        })
        .eq('id', user.id);

      return res.json({ success: true, message: 'Password reset successful! You can now sign in with your new password.' });
    }

    const user = mockUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.reset_expires && new Date(user.reset_expires) < new Date()) {
      return res.status(400).json({ success: false, message: 'Password reset code has expired. Please request a new one.' });
    }

    const isValidCode = code && user.reset_code === code.trim();
    const isValidToken = token && user.reset_token === token.trim();

    if (!isValidCode && !isValidToken) {
      return res.status(400).json({ success: false, message: 'Invalid reset code or token.' });
    }

    user.passwordHash = passwordHash;
    user.reset_code = null;
    user.reset_token = null;
    user.reset_expires = null;

    res.json({ success: true, message: 'Password reset successful! You can now sign in with your new password.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Me / Profile
 */
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  mockUsers,
  normalizeRole
};
