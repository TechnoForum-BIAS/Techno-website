const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcements.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');

// Public route: Everyone can view notices with or without login
router.get('/', getAnnouncements);

// Protected routes: Only coordinators and administrators can create, update, or delete notices
router.post('/', verifyToken, requireRole('coordinator', 'admin'), createAnnouncement);
router.put('/:id', verifyToken, requireRole('coordinator', 'admin'), updateAnnouncement);
router.delete('/:id', verifyToken, requireRole('coordinator', 'admin'), deleteAnnouncement);

module.exports = router;
