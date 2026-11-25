const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement } = require('../controllers/announcements.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', getAnnouncements);
router.post('/', verifyToken, requireRole('coordinator', 'admin'), upload.single('flyer'), createAnnouncement);

module.exports = router;
