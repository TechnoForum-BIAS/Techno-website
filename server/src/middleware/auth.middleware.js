const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'technoforum_super_secret_jwt_key_2026';

const normalizeRole = (role) => {
  if (!role) return 'user';
  const r = role.toLowerCase().trim();
  if (r === 'admin' || r === 'super_admin') return 'admin';
  if (r === 'coordinator') return 'coordinator';
  return 'user';
};

/**
 * Verify JWT token from Authorization header (Bearer <token>)
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = {
      ...decoded,
      role: normalizeRole(decoded.role)
    };
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

/**
 * Role-Based Access Control Middleware
 * Supports: 'admin', 'coordinator', 'user' (plus legacy aliases 'super_admin', 'student')
 */
const requireRole = (...allowedRoles) => {
  const normalizedAllowed = allowedRoles.map(r => normalizeRole(r));

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    const userRole = normalizeRole(req.user.role);
    if (!normalizedAllowed.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${userRole}' does not have permission. Allowed roles: ${normalizedAllowed.join(', ')}`
      });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole, JWT_SECRET, normalizeRole };
