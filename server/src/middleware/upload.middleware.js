const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure base upload directories exist
const uploadDirs = ['uploads/templates', 'uploads/flyers', 'uploads/csv', 'uploads/components'];
uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '../../', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Disk storage engine with dynamic destination based on upload type
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = 'uploads/templates';
    if (file.fieldname === 'flyer') dest = 'uploads/flyers';
    if (file.fieldname === 'csv') dest = 'uploads/csv';
    if (file.fieldname === 'component') dest = 'uploads/components';
    cb(null, path.join(__dirname, '../../', dest));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 } // 25 MB max limit
});

module.exports = upload;
