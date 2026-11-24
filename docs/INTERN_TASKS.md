# 🚀 Technoforum BIAS: Intern Tasks & Roadmap

Welcome to the **Technoforum Technical Society Engineering Team**! This guide outlines the modular tasks, branches, endpoints, and acceptance criteria for **6 Interns across 3 Groups (2 interns per group)**.

---

## 🛠️ Repository Architecture Overview

We are using a **Modular Monorepo**:
```
Technoforum-website/
├── client/     # Vite + React 18 + Tailwind CSS (Dark Blue Cyber Theme)
├── server/     # Node.js + Express + Supabase Postgres REST API
├── database/   # Supabase SQL Schema (supabase_schema.sql)
└── docs/       # Task guides, FAQs, and API specs
```

### Git Branching Protocol
* `main`: Locked production branch. Never push directly to `main`.
* `develop`: Integration staging branch.
* Every group must create feature branches off `develop`:
  * Group 1: `feat/g1-landing-3d` or `feat/g1-events-portal`
  * Group 2: `feat/g2-inventory-catalog` or `feat/g2-ai-scanner`
  * Group 3: `feat/g3-certificate-studio` or `feat/g3-verification`

---

## 👥 Group 1: Main Website, 3D Experience & Events Platform
> **Intern 1 (Frontend & 3D)** + **Intern 2 (Events & Registration Fullstack)**

### Primary Objectives
1. Build a responsive, dark blue cyber-aesthetic landing page for Technoforum with interactive Three.js visuals.
2. Build the event showcase platform where students can browse hackathons, workshops, and robotics contests.
3. Implement student entry forms with validation, storing registrations in Supabase.

### Assigned Files
* **Frontend**: `client/src/pages/HomePage.jsx`, `client/src/pages/EventsPage.jsx`, `client/src/components/Hero3D.jsx`
* **Backend**: `server/src/routes/events.routes.js`, `server/src/controllers/events.controller.js`

### Step-by-Step Task Checklist
- [ ] **Task 1.1 (3D Hero)**: Enhance `Hero3D.jsx` with Three.js glowing nodes and subtle mouse rotation.
- [ ] **Task 1.2 (Events Catalog)**: Display dynamic events fetched from `GET /api/events` with category filter pills (Hackathons, Workshops, Robotics).
- [ ] **Task 1.3 (Entry Registration Modal)**: Allow students to register with Full Name, Roll Number, College Email, WhatsApp Phone, and Team Members.
- [ ] **Task 1.4 (Coordinator Event Creation)**: Allow logged-in coordinators to publish new events with poster/flyer image upload (`POST /api/events`).
- [ ] **Task 1.5 (Announcements & Flyers)**: Connect `AnnouncementsPage.jsx` with `GET /api/announcements` so students can download circular flyers.

### API Contracts
* `GET /api/events` -> Returns list of active and upcoming events.
* `POST /api/events` -> Creates a new event (Multipart form data with flyer image).
* `POST /api/events/register` -> Submits a student/team registration.

---

## 👥 Group 2: Smart Inventory & Hardware Management
> **Intern 3 (Inventory UI & Scanner)** + **Intern 4 (Barcodes, Serials & Backend Logic)**

### Primary Objectives
1. Build a hardware catalog (Arduinos, sensors, extension boards, soldering stations).
2. Generate and display Code-128 / QR barcodes for equipment with unique serial numbers (e.g. `BIAS-EXT-001`, `BIAS-EXT-002`).
3. Build the **AI Vision Table Scanner**: students snap a photo of components laid out on a table; the system recognizes resistors, capacitors, and sensor boards, counts them, and adds them to the issue cart.
4. Implement the Issue Cart system where components are checked out to a specific Student Roll Number with an automated return deadline.

### Assigned Files
* **Frontend**: `client/src/pages/InventoryPage.jsx`, `client/src/context/CartContext.jsx`
* **Backend**: `server/src/routes/inventory.routes.js`, `server/src/controllers/inventory.controller.js`, `server/src/utils/barcodeGenerator.js`

### Step-by-Step Task Checklist
- [ ] **Task 2.1 (Inventory Grid)**: Fetch items from `GET /api/inventory/items`. Show stock badges (In Stock vs Low Stock), serial prefixes, and category filters.
- [ ] **Task 2.2 (Barcode Modal)**: Render barcodes for unique items using `GET /api/inventory/barcode/:serial`. Add a "Print Sticker Label" button for lab coordinators to stick on hardware.
- [ ] **Task 2.3 (AI Vision Scanner Modal)**:
  - Allow uploading or capturing an image of electronic components on a workbench.
  - Send image to `POST /api/inventory/scan-ai`.
  - Display recognized items card list with confidence score and detected counts.
  - Implement "Add All Detected Components to Cart" button.
- [ ] **Task 2.4 (Component Issue Cart)**:
  - Allow adjusting quantities.
  - Set Return Deadline Date.
  - Submit checkout to `POST /api/inventory/checkout` tied to the logged-in student's Roll Number.
- [ ] **Task 2.5 (Coordinator Audit & Return)**:
  - Build return handler (`PATCH /api/inventory/audit/:transactionId`) where coordinators can mark items as `returned`, `damaged`, or `missing`.

### API Contracts
* `GET /api/inventory/items` -> List all hardware components and stock count.
* `GET /api/inventory/barcode/:serial` -> Returns Base64 PNG data URL of Code-128 or QR barcode.
* `POST /api/inventory/scan-ai` -> Vision AI component analyzer.
* `POST /api/inventory/checkout` -> Issues cart items to student Roll Number with return deadline.
* `PATCH /api/inventory/audit/:transactionId` -> Updates item condition (`working`, `damaged`, `missing`).

---

## 👥 Group 3: E-Certificate Batch Studio & Public Verification
> **Intern 5 (Certificate Canvas Designer & Verification UI)** + **Intern 6 (CSV Ingestion, PDF-Lib & Batch ZIP Engine)**

### Primary Objectives
1. Adapt the mechanics of [MailMyCertificate](https://github.com/akshatthakur22/MailMyCertificate) from Python into Node.js.
2. Build an intuitive 4-step studio wizard:
   - **Step 1**: Upload a single base template image (PNG/JPG) or PDF.
   - **Step 2**: Upload a CSV file containing participant records.
   - **Step 3**: Interactive visual canvas to drag, position, and resize placeholders (`{Name}`, `{RollNumber}`, `{Event}`, `{Date}`, `{CertificateId}`).
   - **Step 4**: Batch generate vector PDFs, name each file `<Certificate_ID>.pdf`, bundle them into a ZIP archive, and trigger auto-download.
3. Build the public instant verification portal where anyone can enter a Certificate ID or Roll Number to verify authenticity.

### Assigned Files
* **Frontend**: `client/src/pages/CertificateStudioPage.jsx`, `client/src/pages/CertificateVerifyPage.jsx`
* **Backend**: `server/src/routes/certificates.routes.js`, `server/src/controllers/certificates.controller.js`, `server/src/utils/pdfGenerator.js`

### Step-by-Step Task Checklist
- [ ] **Task 3.1 (Template & CSV Ingestion)**:
  - Implement drag-and-drop file uploaders for PNG/PDF templates and `.csv` files.
  - Display parsed CSV columns in a clean preview table.
- [ ] **Task 3.2 (Visual Canvas Designer)**:
  - Render the template preview.
  - Allow moving placeholders for `{Name}`, `{Event}`, `{Date}`, `{CertificateId}`.
  - Provide controls to tune font size, coordinates (X, Y), and CSV column mapping.
- [ ] **Task 3.3 (Batch Generator Engine)**:
  - Send template path, CSV path, and placeholder coordinate mapping to `POST /api/certificates/batch-generate`.
  - Use `pdf-lib` to overlay high-resolution text onto the template.
  - Stream all generated PDFs into a `.zip` archive using `archiver`.
- [ ] **Task 3.4 (Public Verification Portal)**:
  - In `CertificateVerifyPage.jsx`, allow entering Certificate ID or Roll Number.
  - Call `GET /api/certificates/verify?query=...`.
  - If valid, display the official verified green shield badge, student name, event title, and trigger celebration confetti!

### API Contracts
* `POST /api/certificates/upload-template` -> Saves certificate template file.
* `POST /api/certificates/upload-csv` -> Parses CSV and returns detected column headers.
* `POST /api/certificates/batch-generate` -> Returns streaming ZIP containing all generated PDFs.
* `GET /api/certificates/verify?query=:id` -> Public verification endpoint.

---

## 🧪 Acceptance Criteria Before Creating Pull Requests

1. **No Lint or Build Errors**: `npm run build` inside both `client` and `server` must pass without errors.
2. **Proper Error Handling**: Display clear error toast / message if an API fails.
3. **Responsive UI**: Check pages on both desktop (1920x1080) and mobile (375x667).
4. **Git Branch Cleanliness**: Never commit `node_modules` or `.env` files.
