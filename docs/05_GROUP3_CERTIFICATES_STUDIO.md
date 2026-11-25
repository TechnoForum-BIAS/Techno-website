# 👥 Group 3 Implementation Guide: E-Certificate Studio & Verification Hub

**Domain**: Universal Certificate Generator, Dynamic CSV Column Tags, Draggable QR Code, Batch PDF Engine, Google Drive Integration & Public Verification  
**Assigned Interns**: **Intern 5** (Multi-Format Template Ingestion, CSV Parser & Event Integration) & **Intern 6** (Canvas Coordinate Studio, QR Engine, Batch PDF-Lib Generator & Public Verification)  
**Parent Pages**: `client/src/pages/CertificateStudioPage.jsx`, `client/src/pages/CertificateVerifyPage.jsx`, `client/src/pages/ProfilePage.jsx`

---

## 🎯 Executive Overview & Real-World Society Workflow

Group 3 builds the **official automated certificate generation and verification engine**:

```
[1. Template Upload] ──> PNG, JPG, SVG, or single-page PDF (High-DPI extraction)
                              │
                              ▼
[2. Choose Data Source] ──> Option A: Universal CSV Upload (Any college society/club)
                        ──> Option B: 1-Click Pull from TechnoForum Events (In-house)
                              │
                              ▼
[3. Dynamic Canvas Studio] ──> Tags auto-generated from CSV column headers
                           ──> Optional: "Include Verification QR Code? [Yes/No]"
                           ──> Drag, resize, and color placeholders + QR Code freely
                              │
                              ▼
[4. Batch Generation & ZIP] ──> Vector PDF-Lib generates signed certificates
                            ──> Streams .zip archive to coordinator (Zero server storage waste)
                            ──> Stores metadata in Supabase `certificates` for instant search
                            ──> Coordinator uploads batch folder to Google Drive
                              │
                              ▼
[5. Public Verification] ──> Scanning QR code or searching Certificate ID/Roll Number
                         ──> Auto-opens verified card with digital seal & Google Drive link
                         ──> Student can "Link Certificate to Profile" via Certificate ID
```

---

## 1. 🛠️ Intern 5 Ownership & Tasks

* **Assigned Branch**: `feat/intern5-template-csv`
* **Owned Files**:
  * `client/src/features/group3_certificates/TemplateUploader.jsx` (Multi-Format File Ingestion)
  * `client/src/features/group3_certificates/CsvRosterUploader.jsx` (CSV Parser & Event Ingestion)
  * `server/src/routes/certificates.routes.js` (Certificate Routes)

### 📌 Task 1.1: Multi-Format Template Ingestion (`TemplateUploader.jsx`)
* **Objective**: Ingest certificate background designs in maximum native resolution without quality loss.
* **Supported File Extensions**:
  * `image/png`, `image/jpeg`, `image/svg+xml`, and `application/pdf` (single-page vector template).
* **High-DPI Extraction**:
  * If Image: Load into HTML5 canvas at natural dimensions (`img.naturalWidth`, `img.naturalHeight`).
  * If PDF: Use `pdfjs-dist` to render Page 1 to an off-screen canvas at 2x scale (`viewport.scale = 2.0`) to preserve ultra-sharp vector lines.
* **Template Preview**:
  * High-definition preview canvas with zoom controls and detected resolution badge (e.g. `1920 × 1080 Landscape`).

---

### 📌 Task 1.2: Dual Participant Data Ingestion (`CsvRosterUploader.jsx`)
* **Objective**: Allow flexible participant data loading for both external college societies and in-house TechnoForum hackathons.
* **Mode 1: Universal CSV / Excel Upload (For All Societies)**:
  * Parse uploaded `.csv` using `PapaParse` with `{ header: true, skipEmptyLines: true }`.
  * **Dynamic Column Tag Extraction**:
    * Dynamically extract whatever columns are in the file: e.g. `Student Name`, `Roll Number`, `College`, `Event`, `Award Position`, `Date`.
    * Use the **first student row** as real preview text on the canvas so coordinators see realistic text instead of dummy code.
  * Preview table showing the first 5 student rows with a total count badge.
* **Mode 2: 1-Click Pull from TechnoForum Events (In-House Events)**:
  * Dropdown listing past events from Group 1.
  * Selecting an event pulls the registered students directly from the database—zero manual CSV export/import needed!

---

## 2. 🛠️ Intern 6 Ownership & Tasks

* **Assigned Branch**: `feat/intern6-canvas-pdf-engine`
* **Owned Files**:
  * `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx` (Visual Studio & QR Positioner)
  * `client/src/features/group3_certificates/BatchZipGenerator.jsx` (Batch Generator & Google Drive Linker)
  * `client/src/pages/CertificateVerifyPage.jsx` (Public Verification Hub & Confetti)
  * `server/src/utils/pdfGenerator.js` (Vector PDF-Lib Engine)
  * `server/src/controllers/certificates.controller.js` (Batch Generation & Verification Logic)

### 📌 Task 2.1: Visual Coordinate Canvas & QR Positioner (`CanvasCoordinateEditor.jsx`)
* **Objective**: WYSIWYG visual design studio where coordinators position dynamic text placeholders and an optional verification QR code.
* **Workflow & Controls**:
  1. **Dynamic Tag Palette**:
     * A chip button for each detected column from Step 2 (e.g. `{Student Name}`, `{Roll Number}`, `{Position}`, `{Date}`).
     * Clicking a chip adds that draggable placeholder badge onto the certificate canvas.
     * Typography controls per tag: Font Size slider (`12px` to `72px`), Color picker (Hex code), Text Alignment (`Left`, `Center`, `Right`).
  2. **Digital Verification QR Code Toggle**:
     * A clean toggle switch: *"Include Digital Verification QR Code? [Yes / No]"*.
     * **If Yes**: A draggable, resizable QR box appears on the canvas. Coordinators can drag the QR code to the bottom-left, bottom-right, or wherever it best fits their certificate layout.
     * **If No**: No QR code is added; only text tags will be printed.

---

### 📌 Task 2.2: Vector PDF-Lib Engine & Storage-Smart Generation (`pdfGenerator.js`)
* **Objective**: Generate signed vector PDFs and package them into a `.zip` without consuming server disk space.
* **How QR Code Verification Works**:
  1. For each student, generate a unique Certificate ID: `TF-2026-XXXXXX` (e.g., `TF-2026-RQ-042`).
  2. The embedded QR code encodes the direct verification URL:
     `https://technoforum.edu/certificates/verify?id=TF-2026-RQ-042`
  3. When anyone scans the QR code with a phone camera, it instantly opens the verification page, automatically loads the certificate ID, and displays the verified details!
* **Vector Coordinate Conversion Formula**:
  $$\text{pdfY} = \text{templateHeight} - \text{canvasY} - \text{fontSize}$$
* **Batch Progress & Google Drive Integration (`BatchZipGenerator.jsx`)**:
  * Streams a combined `.zip` file directly to the coordinator's computer.
  * **Google Drive Archive URL Field**: Coordinator can paste their shared Google Drive folder link for this batch (where they host the generated PDFs).
  * Saves certificate metadata (ID, Name, Roll, Event, Position, Date, Google Drive URL) to the Supabase `certificates` table (uses < 1KB per record, saving database storage).

---

### 📌 Task 2.3: Public Certificate Verification Portal (`CertificateVerifyPage.jsx`)
* **Objective**: Public credential verification portal for employers, universities, and students.
* **Auto-Search via QR Code**:
  * If opened with a query parameter (e.g., `/certificates/verify?id=TF-2026-RQ-042`), automatically triggers search on page load.
* **Manual Search Bar**:
  * Visitors can also manually type a Certificate ID or Roll Number.
* **Verified Credential Card**:
  * Student Name, University Roll Number, Event Title, Position, Issue Date.
  * Glowing green **"VERIFIED AUTHENTIC CREDENTIAL"** badge with a digital authenticity seal.
  * **"Open Official Google Drive Archive"** button: Links directly to the coordinator's shared Google Drive folder so visitors can download or inspect the original high-res PDF.
  * **Celebration Confetti**: Burst of `canvas-confetti` when a genuine certificate is verified!

---

### 📌 Task 2.4: Student Profile Certificate Claiming (`ProfilePage.jsx`)
* **Objective**: Solves the issue where students were guests or only the team leader registered.
* **Feature**:
  * In the student's Profile dashboard, under *"My Earned Certificates"*, provide a **"Claim / Link Certificate"** input.
  * Student enters their Certificate ID (e.g. `TF-2026-RQ-042`).
  * If the student's name/roll matches, the certificate is permanently linked to their profile dashboard for easy 1-click access anytime.

---

## 3. 📡 API Contract Reference

### `POST /api/certificates/generate-batch`
* **Request Body**:
  ```json
  {
    "templateUrl": "/uploads/templates/cert-base.png",
    "includeQr": true,
    "qrPosition": { "x": 1720, "y": 880, "size": 120 },
    "googleDriveUrl": "https://drive.google.com/drive/folders/1abcXYZ...",
    "students": [
      {
        "Student Name": "Aarav Sharma",
        "Roll Number": "230101",
        "Event": "TechnoHacks 2026",
        "Position": "Winner",
        "Date": "2026-11-20"
      }
    ],
    "mappings": {
      "Student Name": { "x": 960, "y": 480, "size": 36, "color": "#0F172A", "align": "center" },
      "Position": { "x": 960, "y": 550, "size": 24, "color": "#2563EB", "align": "center" }
    }
  }
  ```
* **Response**: Binary stream of `certificates-batch.zip`.

### `GET /api/certificates/verify?query=TF-2026-RQ-042`
* **Response**:
  ```json
  {
    "success": true,
    "certificate": {
      "certificateId": "TF-2026-RQ-042",
      "studentName": "Priya Verma",
      "rollNumber": "230142",
      "eventTitle": "RoboQuest 2026 Autonomous Robotics",
      "position": "Participant",
      "issueDate": "2026-11-15",
      "googleDriveUrl": "https://drive.google.com/drive/folders/1abcXYZ...",
      "status": "Verified Valid"
    }
  }
  ```

---

## 4. 🧪 Local Testing & Verification Checklist

1. [ ] Navigate to `http://localhost:5173/certificates/studio`.
2. [ ] Test uploading PNG, JPG, and PDF background templates. Verify high-resolution rendering.
3. [ ] Upload a test CSV with custom column headers. Verify dynamic tags are extracted and Row 1 preview text appears.
4. [ ] Toggle "Include Verification QR Code" to **Yes**. Drag the QR box to the bottom-right corner.
5. [ ] Position the text tags and click "Generate Batch". Verify the `.zip` file downloads.
6. [ ] Open `http://localhost:5173/certificates/verify?id=TF-2026-RQ-042`. Verify the certificate is instantly found, displays the verified card with the Google Drive link, and triggers the confetti burst!
