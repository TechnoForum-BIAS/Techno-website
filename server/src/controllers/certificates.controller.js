const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');
const archiver = require('archiver');
const { generateCertificatePdf } = require('../utils/pdfGenerator');
const { supabase } = require('../config/supabase');

// Mock verified certificates store
let mockCertificates = [
  {
    certificateId: 'TF-2026-TH-001',
    studentName: 'Aarav Sharma',
    rollNumber: '230101',
    eventTitle: 'TechnoHacks 2026: Flagship Hackathon',
    position: 'First Runner Up',
    issueDate: '2026-11-20',
    verificationUrl: '/verify/TF-2026-TH-001',
    status: 'Verified Valid'
  },
  {
    certificateId: 'TF-2026-RQ-042',
    studentName: 'Priya Verma',
    rollNumber: '230142',
    eventTitle: 'RoboQuest 2026',
    position: 'Participant',
    issueDate: '2026-11-15',
    verificationUrl: '/verify/TF-2026-RQ-042',
    status: 'Verified Valid'
  }
];

// Parse uploaded CSV and return column headers & rows
const parseCsv = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

// Upload Certificate Template (PNG or PDF)
const uploadTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Template file (PNG or PDF) required.' });
    }
    const templatePath = `/uploads/templates/${req.file.filename}`;
    res.json({
      success: true,
      message: 'Template uploaded successfully',
      filename: req.file.filename,
      url: templatePath,
      isImage: req.file.mimetype.startsWith('image/')
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload CSV and return preview of headers and first few rows
const uploadAndPreviewCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'CSV file required.' });
    }

    const rows = await parseCsv(req.file.path);
    if (!rows || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Uploaded CSV is empty.' });
    }

    const columns = Object.keys(rows[0]);
    res.json({
      success: true,
      filename: req.file.filename,
      filePath: req.file.path,
      totalRows: rows.length,
      columns,
      preview: rows.slice(0, 5) // Send top 5 rows for preview
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to parse CSV: ' + error.message });
  }
};

// Batch Generate Certificates and Download ZIP
// (Adapts the core logic of MailMyCertificate from Python to Node.js)
const generateBatchCertificates = async (req, res) => {
  try {
    const { templateFilename, csvPath, placeholders, eventCode } = req.body;
    // placeholders: [{ column: 'Name', x: 250, y: 350, fontSize: 24, fromTop: true }, ...]

    if (!templateFilename || !csvPath || !placeholders) {
      return res.status(400).json({
        success: false,
        message: 'templateFilename, csvPath, and placeholders mapping are required.'
      });
    }

    const fullTemplatePath = path.join(__dirname, '../../uploads/templates', templateFilename);
    if (!fs.existsSync(fullTemplatePath)) {
      return res.status(404).json({ success: false, message: 'Template file not found on server.' });
    }

    const rows = await parseCsv(csvPath);
    const templateBytes = fs.readFileSync(fullTemplatePath);
    const isImage = templateFilename.endsWith('.png') || templateFilename.endsWith('.jpg') || templateFilename.endsWith('.jpeg');

    // Setup ZIP streaming
    const zipName = `certificates-${Date.now()}.zip`;
    res.attachment(zipName);
    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      throw err;
    });
    archive.pipe(res);

    const code = eventCode || 'TF';
    let count = 1;

    for (const row of rows) {
      const certId = `${code}-2026-${String(count).padStart(4, '0')}`;
      count++;

      // Construct placeholders for this specific student row
      const mappedPlaceholders = placeholders.map(p => ({
        ...p,
        text: p.column === 'CertificateId' ? certId : (row[p.column] || '')
      }));

      // Generate single PDF buffer
      const pdfBytes = await generateCertificatePdf(templateBytes, mappedPlaceholders, isImage);

      // Add to ZIP (Filename = Certificate_ID.pdf)
      archive.append(Buffer.from(pdfBytes), { name: `${certId}.pdf` });

      // Save record in mock registry for public verification
      mockCertificates.push({
        certificateId: certId,
        studentName: row['Name'] || row['student_name'] || 'Student',
        rollNumber: row['RollNumber'] || row['roll_no'] || '',
        eventTitle: row['Event'] || row['event_name'] || 'Technoforum Event',
        position: row['Position'] || row['status'] || 'Participant',
        issueDate: new Date().toISOString().split('T')[0],
        verificationUrl: `/verify/${certId}`,
        status: 'Verified Valid'
      });
    }

    await archive.finalize();
  } catch (error) {
    console.error('Batch generation error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Batch generation failed: ' + error.message });
    }
  }
};

// Public Certificate Verification Endpoint
const verifyCertificate = async (req, res) => {
  try {
    const { query } = req.query; // Certificate ID, Student Name, or Roll Number

    if (!query) {
      return res.status(400).json({ success: false, message: 'Query parameter (Certificate ID or Roll Number) required.' });
    }

    const q = query.trim().toLowerCase();

    // Look up in mock registry
    const match = mockCertificates.find(c =>
      c.certificateId.toLowerCase() === q ||
      c.rollNumber.toLowerCase() === q ||
      c.studentName.toLowerCase().includes(q)
    );

    if (!match) {
      return res.status(404).json({
        success: false,
        verified: false,
        message: 'No verified certificate found matching this query. Please check Certificate ID.'
      });
    }

    res.json({
      success: true,
      verified: true,
      certificate: match
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadTemplate,
  uploadAndPreviewCsv,
  generateBatchCertificates,
  verifyCertificate,
  mockCertificates
};
