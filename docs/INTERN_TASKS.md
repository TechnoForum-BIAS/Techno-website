# 🚀 Technoforum BIAS: Intern Tasks & Conflict-Free Roadmap

Welcome to the **Technoforum Technical Society Engineering Team**! This guide outlines the modular tasks, branches, endpoints, and **strict file ownership** for **6 Interns across 3 Groups (2 interns per group)**.

---

## 🛡️ Anti-Conflict Golden Rules (Read Before Coding!)

To prevent merge conflicts completely:
1. **Never edit `App.jsx`, `Navbar.jsx`, or `server/src/index.js`**: They are already pre-wired and routed.
2. **Work strictly inside your assigned feature files**: Each intern owns isolated components inside `client/src/features/` and specific backend files.
3. **Always branch off `develop`**:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feat/your-group-name
   ```
4. **Before opening a Pull Request**, always rebase with develop:
   ```bash
   git pull origin develop --rebase
   ```

---

## 👥 Intern File Ownership Matrix

| Group & Intern | Role & Assignment | Isolated Frontend File(s) | Isolated Backend File(s) |
|---|---|---|---|
| **Group 1 - Intern 1** | 3D Visuals & Event Showcase | `client/src/components/Hero3D.jsx`<br>`client/src/features/group1_events/EventCard.jsx` | `server/src/routes/events.routes.js` |
| **Group 1 - Intern 2** | Event Registrations & Flyers | `client/src/features/group1_events/EventRegistrationModal.jsx`<br>`client/src/pages/AnnouncementsPage.jsx` | `server/src/controllers/events.controller.js`<br>`server/src/controllers/announcements.controller.js` |
| **Group 2 - Intern 3** | Hardware Catalog & Barcodes | `client/src/features/group2_inventory/InventoryItemCard.jsx`<br>`client/src/features/group2_inventory/BarcodeModal.jsx` | `server/src/utils/barcodeGenerator.js`<br>`server/src/routes/inventory.routes.js` |
| **Group 2 - Intern 4** | AI Table Scanner & Loan Cart | `client/src/features/group2_inventory/AiTableScannerModal.jsx`<br>`client/src/features/group2_inventory/IssueCartDrawer.jsx` | `server/src/controllers/inventory.controller.js` |
| **Group 3 - Intern 5** | Certificate Template & CSV Engine | `client/src/features/group3_certificates/TemplateUploader.jsx`<br>`client/src/features/group3_certificates/CsvRosterUploader.jsx` | `server/src/routes/certificates.routes.js` |
| **Group 3 - Intern 6** | Canvas Coordinates & PDF-Lib Engine | `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx`<br>`client/src/features/group3_certificates/BatchZipGenerator.jsx`<br>`client/src/pages/CertificateVerifyPage.jsx` | `server/src/utils/pdfGenerator.js`<br>`server/src/controllers/certificates.controller.js` |

---

## 👥 Group 1: Main Website, 3D Experience & Events Platform
> **Intern 1 (Frontend & 3D)** + **Intern 2 (Events & Registration Fullstack)**

### Primary Objectives
1. Build a responsive, dark blue cyber-aesthetic landing page for Technoforum with interactive Three.js visuals.
2. Build the event showcase platform where students can browse hackathons, workshops, and robotics contests.
3. Implement student entry forms with validation, storing registrations in Supabase.

### Step-by-Step Task Checklist
- [ ] **Task 1.1 (3D Hero)**: In `Hero3D.jsx`, enhance Three.js glowing nodes and subtle mouse rotation.
- [ ] **Task 1.2 (Events Catalog)**: In `EventCard.jsx`, enhance visual badges, category pills (Hackathons, Workshops, Robotics), and venue details.
- [ ] **Task 1.3 (Entry Registration Modal)**: In `EventRegistrationModal.jsx`, allow students to register with Full Name, Roll Number, College Email, WhatsApp Phone, and Team Members.
- [ ] **Task 1.4 (Coordinator Event Creation)**: Allow logged-in coordinators to publish new events with poster/flyer image upload (`POST /api/events`).
- [ ] **Task 1.5 (Announcements & Flyers)**: In `AnnouncementsPage.jsx`, connect with `GET /api/announcements` so students can download circular flyers.

### API Contracts
* `GET /api/events` -> Returns list of active and upcoming events.
* `POST /api/events` -> Creates a new event (Multipart form data with flyer image).
* `POST /api/events/register` -> Submits a student/team registration.

---

## 👥 Group 2: Smart Hardware & AI Table Scanner
> **Intern 3 (Inventory & Barcodes)** + **Intern 4 (AI Scanner & Loan Cart)**

### Primary Objectives
1. Build a hardware catalog (Arduinos, sensors, extension boards, soldering stations).
2. Generate and display Code-128 / QR barcodes for equipment with unique serial numbers (e.g. `BIAS-EXT-001`, `BIAS-EXT-002`).
3. Build the **AI Vision Table Scanner**: students snap a photo of components laid out on a table; the system recognizes resistors, capacitors, and sensor boards, counts them, and adds them to the issue cart.
4. Implement the Issue Cart system where components are checked out to a specific Student Roll Number with an automated return deadline.

### Step-by-Step Task Checklist
- [ ] **Task 2.1 (Inventory Card)**: In `InventoryItemCard.jsx`, display stock badges (In Stock vs Low Stock), serial prefixes, and individual tracked serial chips.
- [ ] **Task 2.2 (Barcode Modal)**: In `BarcodeModal.jsx`, render barcodes for unique items using `GET /api/inventory/barcode/:serial`. Add a "Print Sticker Label" button.
- [ ] **Task 2.3 (AI Vision Scanner Modal)**:
  - In `AiTableScannerModal.jsx`, allow uploading or capturing an image of electronic components on a workbench.
  - Send image to `POST /api/inventory/scan-ai`.
  - Display recognized items card list with confidence score and detected counts.
  - Implement "Add All Detected Components to Cart" button.
- [ ] **Task 2.4 (Component Issue Cart)**:
  - In `IssueCartDrawer.jsx`, allow adjusting quantities and setting the return deadline date.
  - Submit checkout to `POST /api/inventory/checkout` tied to the logged-in student's Roll Number.
- [ ] **Task 2.5 (Coordinator Audit & Return)**:
  - In `server/src/controllers/inventory.controller.js`, build return handler (`PATCH /api/inventory/audit/:transactionId`) where coordinators can mark items as `returned`, `damaged`, or `missing`.

### API Contracts
* `GET /api/inventory/items` -> List all hardware components and stock count.
* `GET /api/inventory/barcode/:serial` -> Returns Base64 PNG data URL of Code-128 or QR barcode.
* `POST /api/inventory/scan-ai` -> Vision AI component analyzer.
* `POST /api/inventory/checkout` -> Issues cart items to student Roll Number with return deadline.
* `PATCH /api/inventory/audit/:transactionId` -> Updates item condition (`working`, `damaged`, `missing`).

---

## 👥 Group 3: E-Certificate Batch Studio & Public Verification
> **Intern 5 (Template & CSV Ingestion)** + **Intern 6 (Canvas Designer & PDF Engine)**

### Primary Objectives
1. Adapt the mechanics of [MailMyCertificate](https://github.com/akshatthakur22/MailMyCertificate) from Python into Node.js.
2. Build an intuitive 4-step studio wizard:
   - **Step 1 (Intern 5)**: `TemplateUploader.jsx` - Upload 1 base template image (PNG/JPG) or PDF.
   - **Step 2 (Intern 5)**: `CsvRosterUploader.jsx` - Upload participant CSV and preview columns.
   - **Step 3 (Intern 6)**: `CanvasCoordinateEditor.jsx` - Interactive visual canvas to drag, position, and resize placeholders (`{Name}`, `{RollNumber}`, `{Event}`, `{Date}`, `{CertificateId}`).
   - **Step 4 (Intern 6)**: `BatchZipGenerator.jsx` - Batch generate vector PDFs, name each file `<Certificate_ID>.pdf`, bundle them into a ZIP archive, and trigger auto-download.
3. In `CertificateVerifyPage.jsx`, allow entering Certificate ID or Roll Number to verify authenticity with confetti celebration.

### Step-by-Step Task Checklist
- [ ] **Task 3.1 (Template & CSV Ingestion)**: In `TemplateUploader.jsx` and `CsvRosterUploader.jsx`, implement drag-and-drop file uploaders and preview tables.
- [ ] **Task 3.2 (Visual Canvas Designer)**: In `CanvasCoordinateEditor.jsx`, allow moving placeholders for `{Name}`, `{Event}`, `{Date}`, `{CertificateId}` and tuning font sizes.
- [ ] **Task 3.3 (Batch Generator Engine)**: In `BatchZipGenerator.jsx` and `server/src/utils/pdfGenerator.js`, use `pdf-lib` to overlay high-resolution vector text and stream into a `.zip` archive using `archiver`.
- [ ] **Task 3.4 (Public Verification Portal)**: In `CertificateVerifyPage.jsx`, query `GET /api/certificates/verify?query=...` and display verified badges.

### API Contracts
* `POST /api/certificates/upload-template` -> Saves certificate template file.
* `POST /api/certificates/upload-csv` -> Parses CSV and returns detected column headers.
* `POST /api/certificates/batch-generate` -> Returns streaming ZIP containing all generated PDFs.
* `GET /api/certificates/verify?query=:id` -> Public verification endpoint.

---

## 🧪 Acceptance Criteria Before Creating Pull Requests

1. **No Lint or Build Errors**: `npm run build:client` and `node --check server/src/index.js` must pass without errors.
2. **Proper Error Handling**: Display clear error toast / message if an API fails.
3. **No Hardcoded Secrets**: Never commit passwords, tokens, or personal API keys.
4. **Follow Branching Protocol**: All PRs must target `develop` (never `main`).
