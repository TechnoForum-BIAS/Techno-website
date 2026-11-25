# 👥 Group 3 Implementation Guide: E-Certificate Studio & Verification Hub
**Group Domain**: Template Ingestion, CSV Parser, Canvas Visual Editor & Batch PDF-Lib Engine  
**Assigned Interns**: Intern 5 & Intern 6

---

## 1. Intern 5 Ownership & Tasks
* **Dedicated Branch**: `feat/intern5-template-csv`
* **Assigned Files**:
  * `client/src/features/group3_certificates/TemplateUploader.jsx`
  * `client/src/features/group3_certificates/CsvRosterUploader.jsx`
  * `server/src/routes/certificates.routes.js`

### ✅ Must-Have Core Requirements (P0):
1. **Certificate Template Ingestion (`TemplateUploader.jsx`)**:
   - Drag-and-drop PNG/PDF certificate background template upload.
   - Automatic dimension detection (pixel width & height, e.g. `1920x1080` or A4 landscape `842x595`).
   - High-definition template preview canvas with zoom controls.
2. **CSV Participant Roster Parser (`CsvRosterUploader.jsx`)**:
   - Ingestion of `.csv` or `.xlsx` event participant files.
   - Parse CSV rows in real-time using `PapaParse`.
   - Extract column headers (`Name`, `RollNumber`, `Event`, `Position`, `Date`, `Email`).
   - Render a data preview table showing the first 5 parsed student rows with row counter badge.
   - Provide available placeholder tags to the coordinate editor.

### 💡 Self-Implemented Add-On Ideas (P1 Bonus):
* **Add-On 5.1**: Automatically detect common column synonyms (e.g. `Full Name`, `Student_Name` -> `{Name}`).
* **Add-On 5.2**: In-browser row editor to fix typos in student names directly in the preview table.

---

## 2. Intern 6 Ownership & Tasks
* **Dedicated Branch**: `feat/intern6-canvas-pdf-engine`
* **Assigned Files**:
  * `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx`
  * `client/src/features/group3_certificates/BatchZipGenerator.jsx`
  * `client/src/pages/CertificateVerifyPage.jsx`
  * `server/src/utils/pdfGenerator.js`
  * `server/src/controllers/certificates.controller.js`

### ✅ Must-Have Core Requirements (P0):
1. **Visual Canvas Coordinate Editor (`CanvasCoordinateEditor.jsx`)**:
   - Interactive canvas workspace rendering the uploaded template.
   - Draggable text placeholder badges: `{Name}`, `{RollNumber}`, `{Event}`, `{Position}`, `{Date}`, `{CertificateId}`.
   - Controls per placeholder: Font Size slider, Color picker (Hex code + palette), Text Alignment (Left, Center, Right).
   - Real-time `(X, Y)` coordinate readout updating on drag or manual coordinate nudge arrows.
2. **Vector PDF-Lib Engine & ZIP Streamer (`pdfGenerator.js` & `BatchZipGenerator.jsx`)**:
   - Convert Web Canvas top-left coordinates `(0, 0)` to PDF-Lib bottom-left vector space:
     $$\text{pdfY} = \text{templateHeight} - \text{canvasY} - \text{fontSize}$$
   - Generate unique cryptographic certificate ID for each student: `TF-2026-XXXXXX`.
   - Call `POST /api/certificates/generate-batch` to generate individual vector PDFs and stream a combined `.zip` file with progress bar.
3. **Public Certificate Verification Portal (`CertificateVerifyPage.jsx`)**:
   - Search bar accepting `Certificate ID` or `University Roll Number`.
   - Query `GET /api/certificates/verify?query=:id`.
   - Render official verified certificate badge with student name, event, issue date, and authenticity seal.
   - Trigger celebration confetti (`canvas-confetti`) on valid verification!

### 💡 Self-Implemented Add-On Ideas (P1 Bonus):
* **Add-On 6.1**: Render a 2D QR code onto the generated certificate bottom corner pointing to the public verification URL.
* **Add-On 6.2**: "Preview 1st Certificate" button to inspect a 1-page sample PDF before batch generating 200 certificates.
* **Add-On 6.3**: 1-click button on `CertificateVerifyPage.jsx` pre-filling the credential URL for LinkedIn Licenses & Certifications.

---

## 3. Related API Contracts
* `POST /api/certificates/generate-batch` — Body: `{ templateBase64, students: [...], mappings: { Name: { x, y, size, color, align } } }`
* `GET /api/certificates/verify?query=:id` — Returns verified certificate details.
