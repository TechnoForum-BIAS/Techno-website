const express = require('express');
const router = express.Router();
const {
  getItems,
  addItem,
  getBarcodeImage,
  checkoutItems,
  auditReturnItem,
  scanComponentsAI
} = require('../controllers/inventory.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/items', getItems);
router.post('/items', verifyToken, requireRole('coordinator', 'admin'), upload.single('component'), addItem);
router.get('/barcode/:serial', getBarcodeImage);
router.post('/checkout', verifyToken, checkoutItems);
router.patch('/audit/:transactionId', verifyToken, requireRole('coordinator', 'admin'), auditReturnItem);
router.post('/scan-ai', upload.single('component'), scanComponentsAI);

module.exports = router;
