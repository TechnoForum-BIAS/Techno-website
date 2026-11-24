const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');
const { JWT_SECRET } = require('../middleware/auth.middleware');

// Local fallback user mock database for immediate intern testing
const mockUsers = [
  {
    id: 'usr-001',
    name: 'Admin Coordinator',
    email: 'coordinator@bias.ac.in',
    rollNumber: 'FAC-2024-01',
    role: 'coordinator',
    passwordHash: bcrypt.hashSync('admin123', 8),
    created_at: new Date().toISOString()
  },
  {
    id: 'usr-002',
    name: 'Aarav Sharma',
    email: 'aarav.2023@bias.ac.in',
    rollNumber: '230101',
    role: 'student',
    passwordHash: bcrypt.hashSync('student123', 8),
    created_at: new Date().toISOString()
  }
];

// Register User
const register = async (req, res) => {
  try {
    const { name, email, rollNumber, password, role } = req.body;

    if (!name || !email || !rollNumber || !password) {
      return res.status(400).json({ success: false, message: 'All fields (name, email, rollNumber, password) are required.' });
    }

    const assignedRole = ['coordinator', 'super_admin'].includes(role) ? role : 'student';

    // If Supabase is connected:
    if (supabase) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${email},roll_number.eq.${rollNumber}`)
        .single();

      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email or Roll Number already registered.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const { data: newUser, error } = await supabase
        .from('users')
        .insert([{ name, email, roll_number: rollNumber, password_hash: passwordHash, role: assignedRole }])
        .select()
        .single();

      if (error) throw error;

      const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, rollNumber: newUser.roll_number, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({ success: true, message: 'Registration successful', token, user: newUser });
    }

    // In-memory fallback
    const exists = mockUsers.find(u => u.email === email || u.rollNumber === rollNumber);
    if (exists) {
      return res.status(400).json({ success: false, message: 'Email or Roll Number already registered in mock database.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      rollNumber,
      role: assignedRole,
      passwordHash,
      created_at: new Date().toISOString()
    };
    mockUsers.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role, rollNumber: newUser.rollNumber, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      success: true,
      message: 'Registration successful (Fallback Mode)',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, rollNumber: newUser.rollNumber, role: newUser.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User (Roll Number or Email)
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be rollNumber or email

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email/Roll Number and Password.' });
    }

    if (supabase) {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${identifier},roll_number.eq.${identifier}`)
        .single();

      if (error || !user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role, rollNumber: user.roll_number, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ success: true, message: 'Login successful', token, user });
    }

    // In-memory fallback
    const user = mockUsers.find(u => u.email.toLowerCase() === identifier.toLowerCase() || u.rollNumber.toLowerCase() === identifier.toLowerCase());
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, rollNumber: user.rollNumber, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, rollNumber: user.rollNumber, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user profile
const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { register, login, getMe, mockUsers };
