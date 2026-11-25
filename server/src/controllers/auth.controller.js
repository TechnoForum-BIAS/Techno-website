const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { supabase } = require('../config/supabase');
const { JWT_SECRET } = require('../middleware/auth.middleware');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailService');

// Official Platform Super Admin
const OFFICIAL_ADMIN_EMAIL = 'techno_forum@birlainstitute.co.in';

// Normalize roles into: 'admin', 'coordinator', 'user'
const normalizeRole = (role, email = '') => {
  if (email && email.toLowerCase().trim() === OFFICIAL_ADMIN_EMAIL) {
    return 'admin';
  }
  if (!role) return 'user';
  const r = role.toLowerCase().trim();
  if (r === 'admin' || r === 'super_admin') return 'admin';
  if (r === 'coordinator') return 'coordinator';
  return 'user';
};

// Initial Mock Store for local fallback development
const mockUsers = [
  {
    id: 'usr-admin-01',
    name: 'Technoforum Admin',
    email: OFFICIAL_ADMIN_EMAIL,
    rollNumber: 'TF-ADMIN-01',
    role: 'admin',
    is_verified: true,
    passwordHash: '$2a$10$6ehHp2dnXPzE.gU5804yfOsnram.NQ7qF3/roLEarrmq3E40ZU1jG', // Admin@BIAS2026
    auth_provider: 'local',
    created_at: new Date().toISOString()
  }
];

// Helper to generate 6-digit OTP code
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * Register a new user
 * STRICT: requires actual Brevo email verification. is_verified starts FALSE.
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

    const cleanEmail = email.toLowerCase().trim();
    // Public registrations are always 'user' (student). Only the official admin email receives 'admin'.
    const assignedRole = cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';
    const otpCode = generateOTP();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins
    const passwordHash = await bcrypt.hash(password, 10);

    // If Supabase is connected:
    if (supabase) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email, roll_number')
        .or(`email.eq.${cleanEmail},roll_number.eq.${rollNumber}`)
        .single();

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email or Roll Number is already registered.' });
      }

      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
          name,
          email: cleanEmail,
          roll_number: rollNumber,
          password_hash: passwordHash,
          role: assignedRole,
          is_verified: false,
          verification_code: otpCode,
          verification_token: verificationToken,
          verification_expires: verificationExpires,
          auth_provider: 'local'
        }])
        .select()
        .single();

      if (error) throw error;

      // Send actual Brevo SMTP verification email
      await sendVerificationEmail(cleanEmail, name, otpCode, verificationToken);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! A 6-digit verification code has been dispatched to your email via Brevo.',
        email: cleanEmail,
        requiresVerification: true
      });
    }

    // In-memory fallback
    const exists = mockUsers.find(
      u => u.email.toLowerCase() === cleanEmail || (u.rollNumber && u.rollNumber.toLowerCase() === rollNumber.toLowerCase())
    );
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email or Roll Number is already registered.' });
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email: cleanEmail,
      rollNumber,
      role: assignedRole,
      passwordHash,
      is_verified: false,
      verification_code: otpCode,
      verification_token: verificationToken,
      verification_expires: verificationExpires,
      auth_provider: 'local',
      created_at: new Date().toISOString()
    };
    mockUsers.push(newUser);

    // Dispatch email via Brevo
    await sendVerificationEmail(cleanEmail, name, otpCode, verificationToken);

    res.status(201).json({
      success: true,
      message: 'Registration successful! A 6-digit verification code has been dispatched to your email via Brevo.',
      email: cleanEmail,
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

    const cleanEmail = email.toLowerCase().trim();

    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (error || !user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (user.is_verified) {
        return res.json({ success: true, message: 'Email is already verified. You can now log in.' });
      }

      if (user.verification_expires && new Date(user.verification_expires) < new Date()) {
        return res.status(400).json({ success: false, message: 'Verification code has expired. Please request a new code.' });
      }

      const isValidCode = code && user.verification_code === code.trim();
      const isValidToken = token && user.verification_token === token.trim();

      if (!isValidCode && !isValidToken) {
        return res.status(400).json({ success: false, message: 'Invalid verification code.' });
      }

      // Mark verified
      await supabase
        .from('users')
        .update({
          is_verified: true,
          verification_code: null,
          verification_token: null,
          verification_expires: null
        })
        .eq('id', user.id);

      const userRole = normalizeRole(user.role, user.email);
      const authToken = jwt.sign(
        { id: user.id, email: user.email, role: userRole, rollNumber: user.roll_number, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Email verified successfully! Welcome to Technoforum.',
        token: authToken,
        user: { id: user.id, name: user.name, email: user.email, rollNumber: user.roll_number, role: userRole }
      });
    }

    // Mock store
    const user = mockUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.is_verified) {
      return res.json({ success: true, message: 'Email is already verified. You can now log in.' });
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

    const userRole = normalizeRole(user.role, user.email);
    const authToken = jwt.sign(
      { id: user.id, email: user.email, role: userRole, rollNumber: user.rollNumber, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Email verified successfully! Welcome to Technoforum.',
      token: authToken,
      user: { id: user.id, name: user.name, email: user.email, rollNumber: user.rollNumber, role: userRole }
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

    const cleanEmail = email.toLowerCase().trim();
    const otpCode = generateOTP();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, is_verified')
        .eq('email', cleanEmail)
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

      await sendVerificationEmail(cleanEmail, user.name, otpCode, verificationToken);
      return res.json({ success: true, message: 'A new 6-digit verification code has been dispatched.' });
    }

    const user = mockUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (user.is_verified) {
      return res.status(400).json({ success: false, message: 'This email is already verified. Please sign in.' });
    }

    user.verification_code = otpCode;
    user.verification_token = verificationToken;
    user.verification_expires = verificationExpires;

    await sendVerificationEmail(cleanEmail, user.name, otpCode, verificationToken);
    res.json({ success: true, message: 'A new 6-digit verification code has been dispatched.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Strict Login User (Validates email/rollNumber + password + is_verified)
 * Rejects unverified accounts without bypass!
 */
const login = async (req, res) => {
  try {
    const { identifier, password, role } = req.body;

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

      // STRICT: Must be verified
      if (user.is_verified === false) {
        return res.status(403).json({
          success: false,
          notVerified: true,
          email: user.email,
          message: 'Your email is not verified yet. Please enter the 6-digit verification code sent via Brevo.'
        });
      }

      const userRole = normalizeRole(user.role, user.email);

      // Role check if user selected a role in dropdown
      if (role && role !== 'all' && normalizeRole(role) !== userRole) {
        return res.status(403).json({
          success: false,
          message: `Account role mismatch. This account is registered as '${userRole}', not '${role}'.`
        });
      }

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

    // Fallback Mock
    const user = mockUsers.find(
      u => u.email.toLowerCase() === cleanId || (u.rollNumber && u.rollNumber.toLowerCase() === cleanId)
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    // STRICT: Must be verified
    if (user.is_verified === false) {
      return res.status(403).json({
        success: false,
        notVerified: true,
        email: user.email,
        message: 'Your email is not verified yet. Please enter the 6-digit verification code sent via Brevo.'
      });
    }

    const userRole = normalizeRole(user.role, user.email);

    if (role && role !== 'all' && normalizeRole(role) !== userRole) {
      return res.status(403).json({
        success: false,
        message: `Account role mismatch. This account is registered as '${userRole}', not '${role}'.`
      });
    }

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
 * Google OAuth Fast Login / Signup Endpoint
 * Automatically logs in existing accounts or creates new verified accounts without a password
 */
const googleAuth = async (req, res) => {
  try {
    let { email, name, picture, credential, accessToken, role } = req.body;

    // 1. If accessToken is passed, fetch verified Google profile from Google API
    if (!email && accessToken) {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (userInfoRes.ok) {
          const profile = await userInfoRes.json();
          email = profile.email;
          name = profile.name || name;
          picture = profile.picture || picture;
        }
      } catch (fetchErr) {
        console.warn('Failed to fetch Google userinfo from accessToken:', fetchErr.message);
      }
    }

    // 2. Decode Google ID Token if passed from Google Identity Services (GSI)
    if (!email && credential) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
          if (payload.email) {
            email = payload.email;
            name = payload.name || name;
            picture = payload.picture || picture;
          }
        }
      } catch (tokenErr) {
        console.warn('Failed to decode Google credential payload:', tokenErr.message);
      }
    }

    if (!email) {
      return res.status(400).json({ success: false, message: 'Valid Google email is required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    // Public Google registrations are strictly 'user' (student) by default.
    // Only the official ADMIN_EMAIL automatically receives 'admin'.
    const assignedRole = cleanEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

    if (supabase) {
      // Check if user already exists
      let { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (!user) {
        // -------------------------------------------------------------
        // NEW USER: Create account directly, pre-verified, no password needed
        // -------------------------------------------------------------
        const generatedRoll = `G-${Date.now().toString().slice(-6)}`;
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert([{
            name: name || cleanEmail.split('@')[0],
            email: cleanEmail,
            roll_number: generatedRoll,
            role: assignedRole,
            is_verified: true, // Google accounts are pre-verified
            auth_provider: 'google',
            avatar_url: picture || ''
          }])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating Google user in Supabase:', insertError);
          throw insertError;
        }
        user = newUser;
      } else {
        // -------------------------------------------------------------
        // EXISTING USER: Directly log in! Update avatar and ensure verified
        // -------------------------------------------------------------
        const { data: updatedUser } = await supabase
          .from('users')
          .update({
            is_verified: true,
            avatar_url: picture || user.avatar_url,
            auth_provider: user.auth_provider || 'google'
          })
          .eq('id', user.id)
          .select()
          .single();

        if (updatedUser) {
          user = updatedUser;
        }
      }

      const finalRole = normalizeRole(user.role, user.email);
      const token = jwt.sign(
        { id: user.id, email: user.email, role: finalRole, rollNumber: user.roll_number, name: user.name },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        message: 'Google authentication successful',
        token,
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          rollNumber: user.roll_number, 
          role: finalRole, 
          avatarUrl: user.avatar_url 
        }
      });
    }

    // Fallback Mock (when Supabase is in local in-memory fallback)
    let user = mockUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      const generatedRoll = `G-${Date.now().toString().slice(-6)}`;
      user = {
        id: `usr-g-${Date.now()}`,
        name: name || cleanEmail.split('@')[0],
        email: cleanEmail,
        rollNumber: generatedRoll,
        role: assignedRole,
        is_verified: true,
        auth_provider: 'google',
        avatar_url: picture || '',
        created_at: new Date().toISOString()
      };
      mockUsers.push(user);
    } else {
      user.is_verified = true;
      user.avatar_url = picture || user.avatar_url;
    }

    const finalRole = normalizeRole(user.role, user.email);
    const token = jwt.sign(
      { id: user.id, email: user.email, role: finalRole, rollNumber: user.rollNumber, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        rollNumber: user.rollNumber, 
        role: finalRole, 
        avatarUrl: user.avatar_url 
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
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
        message: 'If an account exists with this email, a 6-digit password reset code has been dispatched via Brevo.'
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
      message: 'If an account exists with this email, a 6-digit password reset code has been dispatched via Brevo.'
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

/**
 * Get All Users (Admin Only)
 * Returns complete user directory with roles and statuses
 */
const getAllUsers = async (req, res) => {
  try {
    if (supabase) {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, name, email, roll_number, role, is_verified, auth_provider, avatar_url, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return res.json({ success: true, users: users || [] });
    }

    // Fallback Mock Users
    const sanitizedMock = mockUsers.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      roll_number: u.rollNumber || u.roll_number,
      role: u.role,
      is_verified: u.isVerified || u.is_verified,
      auth_provider: u.authProvider || u.auth_provider || 'local',
      avatar_url: u.avatarUrl || u.avatar_url || '',
      created_at: u.created_at || new Date().toISOString()
    }));

    return res.json({ success: true, users: sanitizedMock });
  } catch (err) {
    console.error('getAllUsers error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch users: ' + err.message });
  }
};

/**
 * Update User Role (Admin Only)
 * Can promote/demote to 'admin', 'coordinator', 'user'. Protects super admin.
 */
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'coordinator', 'user'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role. Must be admin, coordinator, or user.' });
    }

    if (supabase) {
      // 1. Fetch user to verify existence and check if it's the primary super admin
      const { data: targetUser, error: fetchErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchErr || !targetUser) {
        return res.status(404).json({ success: false, message: 'Target user not found.' });
      }

      // Safeguard: Cannot demote the official super administrator
      if (targetUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Cannot demote the official super administrator.' });
      }

      // 2. Update role
      const { data: updated, error: updateErr } = await supabase
        .from('users')
        .update({ role, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id, name, email, roll_number, role, is_verified, auth_provider, avatar_url, updated_at')
        .single();

      if (updateErr) throw updateErr;

      return res.json({
        success: true,
        message: `Role for ${updated.name} updated to "${role}" successfully.`,
        user: updated
      });
    }

    // Mock Fallback
    const targetUser = mockUsers.find(u => u.id === id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Target user not found in mock store.' });
    }

    if (targetUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Cannot demote the official super administrator.' });
    }

    targetUser.role = role;
    return res.json({
      success: true,
      message: `Role for ${targetUser.name} updated to "${role}" successfully.`,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role
      }
    });
  } catch (err) {
    console.error('updateUserRole error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update user role: ' + err.message });
  }
};

module.exports = {
  register,
  verifyEmail,
  resendVerification,
  login,
  googleAuth,
  forgotPassword,
  resetPassword,
  getMe,
  getAllUsers,
  updateUserRole,
  mockUsers,
  normalizeRole,
  OFFICIAL_ADMIN_EMAIL
};
