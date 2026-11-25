const express = require('express');
const router = express.Router();
const { getEvents, createEvent, registerForEvent } = require('../controllers/events.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', getEvents);
router.post('/', verifyToken, requireRole('coordinator', 'admin'), upload.single('flyer'), createEvent);
router.post('/register', registerForEvent);

module.exports = router;
