const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'technoforum_super_secret_jwt_key_2026';

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
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

/**
 * Role-Based Access Control Middleware
 * @param  {...string} allowedRoles ('student', 'coordinator', 'super_admin')
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Role '${req.user.role}' does not have permission. Allowed roles: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};

module.exports = { verifyToken, requireRole, JWT_SECRET };
