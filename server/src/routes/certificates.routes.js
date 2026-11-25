const express = require('express');
const router = express.Router();
const {
  uploadTemplate,
  uploadAndPreviewCsv,
  generateBatchCertificates,
  verifyCertificate
} = require('../controllers/certificates.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/upload-template', verifyToken, requireRole('coordinator', 'admin'), upload.single('template'), uploadTemplate);
router.post('/upload-csv', verifyToken, requireRole('coordinator', 'admin'), upload.single('csv'), uploadAndPreviewCsv);
router.post('/batch-generate', verifyToken, requireRole('coordinator', 'admin'), generateBatchCertificates);
router.get('/verify', verifyCertificate);

module.exports = router;
