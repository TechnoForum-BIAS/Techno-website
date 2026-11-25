# 👥 Group 3 Implementation Guide: E-Certificate Studio & Verification Hub

**Domain**: Universal Certificate Generator, Standardized ID Engine, Client-Side Vector PDFs, Normalized Database Storage & Public Verification  
**Assigned Interns**: **Intern 5** (Multi-Format Templates, Smart CSV Parser & ID Sequence Engine) & **Intern 6** (Canvas Studio, QR Positioner, Client-Side JSZip Engine & Verification Portal)  
**Parent Pages**: `client/src/pages/CertificateStudioPage.jsx`, `client/src/pages/CertificateVerifyPage.jsx`, `client/src/pages/ProfilePage.jsx`

---

## 🎯 Executive Overview & Real-World Society Workflow

Group 3 builds the **automated credentialing powerhouse** designed to serve both TechnoForum and any other campus society (GDSC, Robotics Club, ACM, Cultural):

```
[1. Upload Template] ──> PNG, JPEG, SVG, or single-page PDF (High-DPI extraction)
                              │
                              ▼
[2. Choose Data Source] ──> Option A: Universal CSV / Excel Upload (Any campus club)
                        ──> Option B: 1-Click Pull from TechnoForum Events (In-house)
                              │
                              ▼
[3. Smart ID Check] ──> Does CSV have Certificate IDs?
                        ├── YES: Validates format & checks duplicates
                        └── NO: Prompts coordinator to enter prefix:
                                `BIAS-<SOCIETY>-<EVENT>-<YEAR>`
                                Auto-generates sequence: -001, -002, -003...
                              │
                              ▼
[4. Canvas Designer] ──> Draggable tags auto-generated from CSV headers
                     ──> Draggable Verification QR Code [Toggle ON/OFF]
                              │
                              ▼
[5. 100% Client-Side Generation] ──> Browser pdf-lib & JSZip generate vector PDFs
                                 ──> Downloads .zip directly to coordinator's computer (0 bytes on server!)
                                 ──> Saves normalized batch metadata into Supabase to save space
                                 ──> Coordinator uploads the generated PDFs to their Google Drive
                              │
                              ▼
[6. Public Verification] ──> Scanning QR code or searching ID opens instant verified card
                         ──> Shows student name, event, date, position & link to Google Drive archive
                         ──> Student can "Bookmark / Showcase" certificate on profile with legal disclaimer
```

---

## 1. 🛠️ Intern 5 Ownership & Tasks

* **Assigned Branch**: `feat/intern5-template-csv`
* **Owned Files**:
  * `client/src/features/group3_certificates/TemplateUploader.jsx` (Multi-Format Template Ingestion)
  * `client/src/features/group3_certificates/CsvRosterUploader.jsx` (Smart CSV Parser & Sequence Engine)
  * `client/src/features/group3_certificates/CertificateIdModal.jsx` (Prefix Generator Modal)
  * `server/src/routes/certificates.routes.js` (Batch Verification Routes)

### 📌 Task 1.1: Multi-Format High-DPI Template Ingestion (`TemplateUploader.jsx`)
* **Objective**: Ingest certificate background designs in maximum native resolution without quality loss.
* **Supported File Extensions**:
  * `image/png`, `image/jpeg`, `image/svg+xml`, and `application/pdf` (single-page vector template).
* **Extraction Quality**:
  * Canvas renders at natural native DPI (`img.naturalWidth`, `img.naturalHeight`).
  * No lossy compression or resizing. Preserves crisp borders and gold seals.

---

### 📌 Task 1.2: Smart CSV Parser & Standardized ID Engine (`CsvRosterUploader.jsx`)
* **Objective**: Ingest participant data from CSV or in-house events, and enforce standardized Certificate IDs.
* **Standardized Certificate ID Pattern**:
  $$\text{BIAS}-\langle\text{SOCIETY}\rangle-\langle\text{EVENT}\rangle-\langle\text{YEAR}\rangle-\langle\text{SEQ}\rangle$$
  * *Examples*:
    * `BIAS-TF-FF-2026-001` (Technoforum Flagship Fest)
    * `BIAS-TF-RC-2026-124` (Technoforum RC Car Race)
    * `BIAS-GDSC-HACK-2026-042` (GDSC Hackathon)
* **Smart ID Detection Workflow**:
  1. **Case A: CSV Already Has Certificate IDs**:
     * System checks the column values against existing database IDs. If unique, accepts them directly.
  2. **Case B: No Certificate ID Column in CSV**:
     * System opens the **CertificateIdModal**:
       * Prompts coordinator: *"No Certificate ID column found. Generate verified credentials?"*
       * Coordinator enters prefix: e.g. `BIAS-TF-RC-2026`.
       * System automatically adds a new `CertificateId` column and appends zero-padded sequences (`-001`, `-002`, `-003`...).
       * If coordinator chooses *"Skip ID Generation"*, display a clear warning:
         > ⚠️ **Warning**: *"Without Certificate IDs, verification QR codes cannot be printed and these certificates cannot be verified on the public portal."*

---

## 2. 🛠️ Intern 6 Ownership & Tasks

* **Assigned Branch**: `feat/intern6-canvas-pdf-engine`
* **Owned Files**:
  * `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx` (Visual Studio & QR Positioner)
  * `client/src/features/group3_certificates/BatchZipGenerator.jsx` (Client-Side JSZip Streamer & Drive Linker)
  * `client/src/pages/CertificateVerifyPage.jsx` (Public Verification Hub & Confetti)
  * `client/src/pages/ProfilePage.jsx` (Student Certificate Showcase Panel)
  * `server/src/controllers/certificates.controller.js` (Normalized Batch Database Logic)

### 📌 Task 2.1: Visual Coordinate Canvas & QR Positioner (`CanvasCoordinateEditor.jsx`)
* **Objective**: WYSIWYG visual design studio where coordinators position dynamic text placeholders and an optional verification QR code.
* **Workflow & Controls**:
  1. **Dynamic Tag Palette**:
     * Auto-generates a draggable chip for each column detected in the CSV (e.g. `{Student Name}`, `{Position}`, `{CertificateId}`).
     * Renders **Row 1 sample data** on the canvas so coordinators see real names and sizing instead of placeholders.
  2. **Digital Verification QR Code Toggle**:
     * Toggle: *"Include Digital Verification QR Code? [Yes / No]"*.
     * **If Yes**: A resizable, draggable QR placeholder box appears on the canvas. Coordinator can place it anywhere on the design (bottom-right, bottom-left, etc.).
     * **If No**: No QR code is printed; only text tags will be applied.

---

### 📌 Task 2.2: 100% Client-Side Vector PDF & JSZip Generator (`BatchZipGenerator.jsx`)
* **Objective**: Zero server storage waste! All PDF generation and ZIP packaging happen directly in the coordinator's browser using client-side JavaScript.
* **How It Works**:
  1. Client-side `pdf-lib` creates the vector PDF pages for each student directly in the browser's memory.
  2. For each student, it generates the unique QR code pointing to:
     `https://technoforum.edu/certificates/verify?id=BIAS-TF-RC-2026-001`
  3. Client-side `JSZip` bundles all PDFs into a single `.zip` file.
  4. Triggers direct browser download (`FileSaver.js` / browser anchor download).
  5. **Server Storage Used**: **0 BYTES!** Zero server bandwidth, zero cloud storage costs, zero timeout risk for 500+ certificates.

---

### 📌 Task 2.3: Normalized Space-Saving Database Storage (`certificates.controller.js`)
* **Objective**: Store verification metadata without duplicating event names, dates, or Google Drive links 500 times.
* **Database Architecture**:
  1. **`certificate_batches` Table** (Stores shared data **once** per batch):
     * `id`: e.g. `BIAS-TF-RC-2026`
     * `society_name`: "Technoforum"
     * `event_title`: "RC Car Sprint 2026"
     * `issue_date`: "2026-11-20"
     * `google_drive_url`: Shared Google Drive folder URL where coordinator uploaded the batch
  2. **`certificates` Table** (Minimal student records):
     * `certificate_id`: `BIAS-TF-RC-2026-001`
     * `batch_id`: References `certificate_batches(id)`
     * `student_name`: "Aarav Sharma"
     * `position`: "Winner"
     * `roll_number`: "230101" (optional)
* **Space Saved**: Reduces database footprint by **over 80%**! Storing 1,000 certificates takes less than 200 KB in total.

---

### 📌 Task 2.4: Public Verification Portal (`CertificateVerifyPage.jsx`)
* **Objective**: Public portal where any employer, university, or recruiter verifies credentials.
* **How It Works**:
  1. **Direct QR Code Scan**:
     * If opened via QR scan (`/certificates/verify?id=BIAS-TF-RC-2026-001`), the page automatically queries the database and renders the verified card immediately.
  2. **Manual Search**:
     * Search bar accepting Certificate ID or Roll Number.
  3. **Verified Credential Card**:
     * Student Name, Event Title, Award Position, Issue Date, Society Name.
     * Glowing green **"VERIFIED AUTHENTIC CREDENTIAL"** badge with a digital authenticity seal.
     * **"Open Official Google Drive Archive ↗"** button: Links directly to the coordinator's verified Google Drive folder for inspecting or downloading the original high-res PDF.
     * **Celebration Confetti**: Burst of `canvas-confetti` when a genuine certificate is verified!

---

### 📌 Task 2.5: Student Profile Certificate Showcase & Legal Disclaimer (`ProfilePage.jsx`)
* **Objective**: Allows students to showcase their certificates on their profile dashboard without requiring strict permanent ownership locking.
* **Workflow**:
  1. **"Add Certificate to My Showcase"**:
     * In `ProfilePage.jsx`, student types any Certificate ID (e.g. `BIAS-TF-RC-2026-001`) to pin it to their profile.
     * They can unpin or remove it anytime.
  2. **Official Disclaimer Notice**:
     * A prominent, clear advisory box is displayed in the profile showcase:
       > ⚠️ **Official Verification Notice**: *"Listing a certificate in your personal profile showcase is for portfolio reference and quick access. Legal authenticity and credential ownership are strictly determined by the official recipient name on the issued certificate and the public verification ledger."*

---

## 3. 📡 API Contract Reference

### `POST /api/certificates/publish-batch`
* **Coordinator uploads batch metadata to cloud ledger after generating ZIP**:
  ```json
  {
    "batchId": "BIAS-TF-RC-2026",
    "societyName": "Technoforum",
    "eventTitle": "Autonomous RC Car Sprint 2026",
    "issueDate": "2026-11-20",
    "googleDriveUrl": "https://drive.google.com/drive/folders/1abcXYZ...",
    "certificates": [
      {
        "certificateId": "BIAS-TF-RC-2026-001",
        "studentName": "Aarav Sharma",
        "position": "First Place",
        "rollNumber": "230101"
      },
      {
        "certificateId": "BIAS-TF-RC-2026-002",
        "studentName": "Priya Verma",
        "position": "Participant"
      }
    ]
  }
  ```

### `GET /api/certificates/verify?id=BIAS-TF-RC-2026-001`
* **Response**:
  ```json
  {
    "success": true,
    "certificate": {
      "certificateId": "BIAS-TF-RC-2026-001",
      "studentName": "Aarav Sharma",
      "position": "First Place",
      "rollNumber": "230101",
      "eventTitle": "Autonomous RC Car Sprint 2026",
      "issueDate": "2026-11-20",
      "societyName": "Technoforum",
      "googleDriveUrl": "https://drive.google.com/drive/folders/1abcXYZ...",
      "status": "Verified Valid"
    }
  }
  ```

---

## 4. 🧪 Local Testing & Verification Checklist

1. [ ] Open `http://localhost:5173/certificates/studio`.
2. [ ] Upload a certificate background (PNG, JPG, or PDF).
3. [ ] Upload a test CSV without Certificate IDs. Verify the Prefix Modal prompts for `BIAS-TF-RC-2026` and auto-generates `-001`, `-002`...
4. [ ] Toggle "Include Verification QR Code" to **Yes**. Drag the QR box to the desired position.
5. [ ] Click "Generate Batch". Verify the browser generates vector PDFs and downloads the `.zip` locally with 0 server memory used.
6. [ ] Open `http://localhost:5173/certificates/verify?id=BIAS-TF-RC-2026-001`. Verify the certificate is immediately loaded, displays the verified card with the Google Drive link, and triggers the confetti burst!
7. [ ] In `ProfilePage.jsx`, test claiming a certificate by ID and verify the official disclaimer appears.
