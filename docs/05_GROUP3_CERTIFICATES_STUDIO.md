# 👥 Group 3 Implementation Guide: E-Certificate Studio & Verification Hub

**Domain**: Visual Certificate Template Designer, CSV Bulk Roster Parser, Coordinate Mapping Engine, Vector PDF Generator & Public Verification  
**Assigned Interns**: **Intern 5** (Template Uploader & CSV Parser) & **Intern 6** (Canvas Coordinate Studio, Batch PDF Generator & Public Verification)  
**Parent Pages**: `client/src/pages/CertificateStudioPage.jsx`, `client/src/pages/CertificateVerifyPage.jsx`

---

## 🎯 Executive Overview & User Journey

Group 3 builds the **automated credentialing and certificate generation powerhouse**:
1. Society coordinators upload a single blank certificate background image (PNG/PDF) into the **Studio**.
2. They upload a **CSV participant roster** exported from Google Forms or Excel containing student names, roll numbers, and event titles.
3. In the **Visual Coordinate Canvas**, coordinators drag placeholder tags (`{Name}`, `{RollNumber}`, `{Event}`, `{Position}`, `{Date}`, `{CertificateId}`) directly onto the certificate image, adjusting font size, color, and alignment in real time.
4. Clicking **"Generate Batch"** converts web canvas coordinates to vector PDF coordinates, generates individual signed PDFs with unique IDs (`TF-2026-XXXXXX`), and streams a combined `.zip` archive for immediate download.
5. In the **Public Verification Portal**, any student, employer, or university registrar can type a Certificate ID or Roll Number to instantly verify credential authenticity.

---

## 1. 🛠️ Intern 5 Ownership & Tasks

* **Assigned Branch**: `feat/intern5-template-csv`
* **Owned Files**:
  * `client/src/features/group3_certificates/TemplateUploader.jsx` (Template File Ingestion & Preview)
  * `client/src/features/group3_certificates/CsvRosterUploader.jsx` (CSV Roster Parser & Data Grid)
  * `server/src/routes/certificates.routes.js` (Certificate Routes)

### 📌 Task 1.1: Certificate Template Ingestion (`TemplateUploader.jsx`)
* **Objective**: Provide a drag-and-drop zone for uploading the certificate background design with automatic dimension detection.
* **Component Props**:
  * `templateFile`: Currently selected File object.
  * `templatePreviewUrl`: Object URL string for previewing image.
  * `onTemplateUpload`: `(event) => void`
  * `onNext`: `() => void`
* **Step-by-Step Implementation**:
  1. **Upload Dropzone**:
     * Support `image/png`, `image/jpeg`, and `application/pdf`.
     * Styled dashed border (`border-2 border-dashed border-brand-border hover:border-brand-cyan`).
  2. **Image Dimension Extraction**:
     * When an image is loaded, instantiate an `Image()` object in JavaScript to extract natural dimensions (`img.naturalWidth`, `img.naturalHeight`):
       ```javascript
       const img = new Image();
       img.onload = () => {
         setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
       };
       img.src = previewUrl;
       ```
     * Standard dimensions are typically `1920x1080` (16:9) or `842x595` (A4 Landscape at 72dpi).
  3. **High-Definition Preview Window**:
     * Display a scaled thumbnail preview of the template with a filename badge and dimension readout.
* **Expected Output**: An intuitive file uploader that loads the certificate template, displays its native dimensions, and transitions smoothly to Step 2.

---

### 📌 Task 1.2: CSV Roster Ingestion & Parser (`CsvRosterUploader.jsx`)
* **Objective**: Parse bulk participant data files in the browser and validate required column headers.
* **Component Props**:
  * `csvData`: Array of parsed student row objects.
  * `onCsvParsed`: `(data, headers) => void`
  * `onBack`: `() => void`
  * `onNext`: `() => void`
* **Step-by-Step Implementation**:
  1. **In-Browser CSV Parsing via PapaParse**:
     * Parse `.csv` files client-side:
       ```javascript
       Papa.parse(file, {
         header: true,
         skipEmptyLines: true,
         complete: (results) => {
           onCsvParsed(results.data, results.meta.fields);
         }
       });
       ```
  2. **Column Header Detection**:
     * Detect standard fields: `Name`, `RollNumber`, `Event`, `Position`, `Date`, `Email`.
     * If headers differ (e.g. `Student Name` or `Roll_No`), provide a dropdown mapper so coordinators can match columns easily.
  3. **Data Preview Table**:
     * Render a clean preview table displaying the first 5 parsed student rows with row counters (e.g., *"Showing first 5 of 142 participants"*).
     * Show green badge for valid rows and red badge for rows missing required fields.
* **Expected Output**: Instant client-side CSV parsing with a data preview table and extracted placeholder tags ready for coordinate mapping.

---

### 🌟 Intern 5 Bonus / Add-On Enhancements (P1 Distinction)
* **Editable Preview Table**: Allow coordinators to click directly into a student's name or roll number in the preview table to fix typos before generating PDFs.
* **Download Sample CSV Template**: Add a "Download Sample CSV" link that generates a pre-formatted template with dummy rows.

---

## 2. 🛠️ Intern 6 Ownership & Tasks

* **Assigned Branch**: `feat/intern6-canvas-pdf-engine`
* **Owned Files**:
  * `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx` (Interactive Visual Studio)
  * `client/src/features/group3_certificates/BatchZipGenerator.jsx` (Batch Progress & ZIP Downloader)
  * `client/src/pages/CertificateVerifyPage.jsx` (Public Verification Portal)
  * `server/src/utils/pdfGenerator.js` (Vector PDF-Lib Engine)
  * `server/src/controllers/certificates.controller.js` (Batch Generation & Verification Logic)

### 📌 Task 2.1: Visual Canvas Coordinate Editor (`CanvasCoordinateEditor.jsx`)
* **Objective**: A WYSIWYG visual editor where coordinators drag placeholder tags onto the certificate template.
* **Step-by-Step Implementation**:
  1. **Interactive Canvas Viewport**:
     * Render the certificate template image inside a responsive relative container.
  2. **Draggable Text Badges**:
     * Render draggable tags: `{Name}`, `{RollNumber}`, `{Event}`, `{Position}`, `{Date}`, `{CertificateId}`.
     * Support mouse drag-and-drop or coordinate slider controls (`X: 0 to 1920`, `Y: 0 to 1080`).
  3. **Typography & Styling Controls Per Tag**:
     * Font Size slider (`12px` to `72px`).
     * Color Picker (Hex codes: e.g. Gold `#D97706`, White `#FFFFFF`, Dark Slate `#0F172A`).
     * Text Alignment pills (`Left`, `Center`, `Right`).
  4. **Live Coordinate Telemetry**:
     * Display a floating HUD showing the active `(X, Y)` position in pixels.
* **Expected Output**: A draggable canvas where moving `{Name}` to the certificate line immediately updates its coordinate state in real time.

---

### 📌 Task 2.2: Vector PDF-Lib Engine & ZIP Streamer (`pdfGenerator.js` & `BatchZipGenerator.jsx`)
* **Objective**: Take the coordinate mappings and student roster, generate individual vector PDF certificates using `pdf-lib`, and bundle them into a downloadable `.zip`.
* **The Mathematical Coordinate Conversion Formula**:
  * Web browsers measure `(X, Y)` from the **top-left corner**: `(0, 0)` is top-left, with Y increasing downwards.
  * PDF-Lib and PostScript measure `(X, Y)` from the **bottom-left corner**: `(0, 0)` is bottom-left, with Y increasing upwards!
  * **Conversion Equation**:
    $$\text{pdfY} = \text{templateHeight} - \text{canvasY} - \text{fontSize}$$
* **Backend PDF Generation Workflow**:
  1. Load template into `PDFDocument.load(templateBytes)`.
  2. Embed standard fonts: `doc.embedFont(StandardFonts.HelveticaBold)`.
  3. Draw text using the converted coordinates:
     ```javascript
     page.drawText(student.name, {
       x: mapping.Name.x,
       y: templateHeight - mapping.Name.y - mapping.Name.size,
       size: mapping.Name.size,
       color: rgb(r, g, b)
     });
     ```
  4. Stream the generated PDF documents into an `archiver('zip')` stream.
* **Expected Output**: A batch progress bar in the UI (`Generating 42 of 120...`) that triggers an automatic `.zip` download when complete.

---

### 📌 Task 2.3: Public Verification Portal (`CertificateVerifyPage.jsx`)
* **Objective**: A public page where anyone can enter a Certificate ID or Roll Number to verify authenticity.
* **Step-by-Step Implementation**:
  1. **Search Bar**:
     * Input accepting Certificate ID (e.g. `TF-2026-TH-001`) or Roll Number (e.g. `230101`).
  2. **API Verification Query**:
     * Call `GET /api/certificates/verify?query=:id`.
  3. **Verification Certificate Card**:
     * Show official green badge: `VERIFIED AUTHENTIC CREDENTIAL`.
     * Student Full Name, University Roll Number, Event Title, Award/Position, and Issue Date.
     * Digital Authenticity Hash seal.
  4. **Celebration Effect**:
     * Trigger a burst of confetti using `canvas-confetti` when a valid certificate is verified!
* **Expected Output**: A verification page with search, certificate authenticity card, and confetti celebration on success.

---

### 🌟 Intern 6 Bonus / Add-On Enhancements (P1 Distinction)
* **Dynamic QR Code on Certificate**: Use `qrcode` to generate a 2D QR code vector and embed it on the bottom corner of each PDF, pointing directly to the public verification URL.
* **LinkedIn Credential Share Button**: On `CertificateVerifyPage.jsx`, add a "Add to LinkedIn Profile" button that opens LinkedIn's pre-filled certification URL (`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME...`).

---

## 3. 📡 API Contract Reference

### `POST /api/certificates/generate-batch`
* **Request Body**:
  ```json
  {
    "templateUrl": "/uploads/templates/sample-cert.png",
    "students": [
      {
        "name": "Aarav Sharma",
        "rollNumber": "230101",
        "event": "TechnoHacks 2026",
        "position": "Winner",
        "date": "2026-11-20"
      }
    ],
    "mappings": {
      "Name": { "x": 450, "y": 320, "size": 36, "color": "#0F172A", "align": "center" },
      "RollNumber": { "x": 450, "y": 380, "size": 18, "color": "#2563EB", "align": "center" },
      "Event": { "x": 450, "y": 440, "size": 24, "color": "#0F172A", "align": "center" }
    }
  }
  ```
* **Response**: Binary stream of `certificates-2026.zip`.

### `GET /api/certificates/verify?query=TF-2026-TH-001`
* **Response**:
  ```json
  {
    "success": true,
    "certificate": {
      "certificateId": "TF-2026-TH-001",
      "studentName": "Aarav Sharma",
      "rollNumber": "230101",
      "eventTitle": "TechnoHacks 2026: Flagship Hackathon",
      "position": "First Runner Up",
      "issueDate": "2026-11-20",
      "status": "Verified Valid"
    }
  }
  ```

---

## 4. 🧪 Local Testing & Verification Checklist

1. [ ] Run `npm run dev` and navigate to `http://localhost:5173/certificates/studio`.
2. [ ] Upload a sample certificate background image. Verify natural dimensions are detected.
3. [ ] Upload a test CSV with student names and roll numbers. Verify preview table renders.
4. [ ] In the canvas editor, drag the `{Name}` placeholder. Verify coordinates update smoothly.
5. [ ] Navigate to `/certificates/verify` and search `TF-2026-TH-001`. Verify the certificate card renders with the confetti celebration effect!
