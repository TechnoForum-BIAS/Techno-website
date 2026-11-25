# 🚀 Technoforum BIAS: Master Intern Implementation Guide & AI Assistant Prompt
### Centralized Society Platform • Birla Institute of Applied Sciences (BIAS), Bhimtal

---

```
╔══════════════════════════════════════════════════════════════════════════════════════════════╗
║  🤖 SPECIAL AI ASSISTANT DIRECTIVE (IF THIS FILE IS FED INTO CHATGPT, CLAUDE, GEMINI, ETC.) ║
╚══════════════════════════════════════════════════════════════════════════════════════════════╝

IF A USER LOADS OR PASTES THIS FILE INTO ANY AI CODING ASSISTANT, THE AI MUST STRICTLY ADHERE TO THIS PROTOCOL:

1. DO NOT GENERATE RANDOM OR GENERIC CODE IMMEDIATELY.
2. FIRST, ASK THE USER THIS EXACT ONBOARDING QUESTION:
   "👋 Welcome to the Technoforum Engineering Team!
    Which Intern are you? (Please enter 1, 2, 3, 4, 5, or 6)"

3. ONCE THE USER REPLIES WITH THEIR INTERN NUMBER:
   a. Look up their exact assigned module and files in Section 2 (File Ownership Matrix).
   b. Explicitly confirm their assigned files and remind them:
      "⚠️ STRICT GUARDRAILS: You must ONLY write/modify code inside your assigned files.
       NEVER edit App.jsx, Navbar.jsx, server/src/index.js, or other interns' files, as this causes merge conflicts."
   c. Display their task checklist from Section 3.
   d. Ask: "Which specific task would you like to build right now?"
   e. When writing code, generate production-ready code that matches the project's exact Tech Stack:
      - Dark Blue Cyber Theme (#070B19, #0D1527, #38BDF8, #2563EB)
      - Tailwind CSS utility classes
      - Lucide React icons
      - JSON API response format: { success: boolean, message: string, data?: any }
```

---

## 1. Quick Project & Tech Stack Overview

* **Monorepo Architecture**:
  * `/client`: React 18, Vite, Tailwind CSS, Lucide Icons, Three.js (Port 5173).
  * `/server`: Node.js, Express, PostgreSQL / Supabase, pdf-lib, bwip-js, Brevo SMTP (Port 5000).
  * `/database`: Master SQL schema (`supabase_schema.sql`) and sample student roster (`sample_students.csv`).
* **1-Command Setup**:
  ```bash
  git clone <repo-url>
  cd Technoforum-website
  git checkout develop
  npm run install:all
  npm run dev
  ```
* **Offline Mock Fallback**: If you do not have live Supabase or Brevo keys, the backend runs in zero-dependency in-memory mock mode. You can code and test your frontend features immediately.

---

## 2. Strict File Ownership Matrix (Zero Merge Conflicts)

To ensure all 6 interns can work simultaneously without stepping on each other's code, **you are strictly restricted to your assigned files**:

| Intern | Module | Assigned Frontend Files | Assigned Backend Files |
|---|---|---|---|
| **Intern 1** | **Group 1: 3D Visuals & Event Showcase** | `client/src/components/Hero3D.jsx`<br>`client/src/features/group1_events/EventCard.jsx` | `server/src/routes/events.routes.js` |
| **Intern 2** | **Group 1: Event Registration & Flyers** | `client/src/features/group1_events/EventRegistrationModal.jsx`<br>`client/src/pages/AnnouncementsPage.jsx` | `server/src/controllers/events.controller.js`<br>`server/src/controllers/announcements.controller.js` |
| **Intern 3** | **Group 2: Hardware Catalog & Barcodes** | `client/src/features/group2_inventory/InventoryItemCard.jsx`<br>`client/src/features/group2_inventory/BarcodeModal.jsx` | `server/src/utils/barcodeGenerator.js`<br>`server/src/routes/inventory.routes.js` |
| **Intern 4** | **Group 2: AI Table Scanner & Loan Cart** | `client/src/features/group2_inventory/AiTableScannerModal.jsx`<br>`client/src/features/group2_inventory/IssueCartDrawer.jsx` | `server/src/controllers/inventory.controller.js` |
| **Intern 5** | **Group 3: Certificate Template & CSV Engine** | `client/src/features/group3_certificates/TemplateUploader.jsx`<br>`client/src/features/group3_certificates/CsvRosterUploader.jsx` | `server/src/routes/certificates.routes.js` |
| **Intern 6** | **Group 3: Canvas Coordinates & PDF-Lib Engine** | `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx`<br>`client/src/features/group3_certificates/BatchZipGenerator.jsx`<br>`client/src/pages/CertificateVerifyPage.jsx` | `server/src/utils/pdfGenerator.js`<br>`server/src/controllers/certificates.controller.js` |

> [!CAUTION]
> **DO NOT EDIT**: `App.jsx`, `Navbar.jsx`, `server/src/index.js`, or database migrations. They are already fully connected. Touching them will cause merge conflicts.

---

## 3. Detailed Sprint Task Checklists per Intern

### 👥 Group 1: 3D Experience, Events & Announcements

#### Intern 1 Tasks (3D Core & Event Cards)
* **Branch**: `feat/g1-hero-events`
* **Files**: `client/src/components/Hero3D.jsx`, `client/src/features/group1_events/EventCard.jsx`, `server/src/routes/events.routes.js`
- [ ] **Task 1.1**: Enhance `Hero3D.jsx` using Three.js with an interactive glowing geometric wireframe that reacts smoothly to cursor tilt.
- [ ] **Task 1.2**: In `EventCard.jsx`, format event dates, venue badges, category pill colors (Hackathon: cyan, Robotics: purple, Workshop: blue), and capacity counters.
- [ ] **Task 1.3**: Add category filter pills and search by event title/venue.

#### Intern 2 Tasks (Registration Form & Society Circulars)
* **Branch**: `feat/g1-registration-notices`
* **Files**: `client/src/features/group1_events/EventRegistrationModal.jsx`, `client/src/pages/AnnouncementsPage.jsx`, `server/src/controllers/events.controller.js`
- [ ] **Task 2.1**: In `EventRegistrationModal.jsx`, validate inputs (Roll Number format, Email, WhatsApp number, Team member chips).
- [ ] **Task 2.2**: Connect submission to `POST /api/events/register` and show instant confirmation checkmark.
- [ ] **Task 2.3**: In `AnnouncementsPage.jsx`, display official society flyers with direct PDF/image download buttons.

---

### 👥 Group 2: Smart Hardware & AI Table Scanner

#### Intern 3 Tasks (Inventory Catalog & Barcode Stickers)
* **Branch**: `feat/g2-catalog-barcodes`
* **Files**: `client/src/features/group2_inventory/InventoryItemCard.jsx`, `client/src/features/group2_inventory/BarcodeModal.jsx`, `server/src/utils/barcodeGenerator.js`
- [ ] **Task 3.1**: In `InventoryItemCard.jsx`, display stock status badges (`Available`, `Low Stock`, `Out of Stock`), serial prefix tags, and unique tracked serial chips (e.g. `BIAS-EXT-001`).
- [ ] **Task 3.2**: In `BarcodeModal.jsx`, render Code-128 and QR barcodes generated by `server/src/utils/barcodeGenerator.js`.
- [ ] **Task 3.3**: Add "Print Sticker Label" button formatted for physical adhesive labels (standard 2" x 1" sticker format).

#### Intern 4 Tasks (AI Table Scanner & Student Loan Cart)
* **Branch**: `feat/g2-ai-scanner-cart`
* **Files**: `client/src/features/group2_inventory/AiTableScannerModal.jsx`, `client/src/features/group2_inventory/IssueCartDrawer.jsx`, `server/src/controllers/inventory.controller.js`
- [ ] **Task 4.1**: In `AiTableScannerModal.jsx`, build photo capture/upload for electronic components laid on a lab table.
- [ ] **Task 4.2**: In `server/src/controllers/inventory.controller.js`, connect `POST /api/inventory/scan-ai` to Google Gemini Vision AI to identify resistors, capacitors, ICs, and sensor boards with counts.
- [ ] **Task 4.3**: Provide "Add All Detected Components to Cart" button in the scanner modal.
- [ ] **Task 4.4**: In `IssueCartDrawer.jsx`, allow setting automated return deadlines and checking out to the student's Roll Number (`POST /api/inventory/checkout`).

---

### 👥 Group 3: E-Certificate Studio & Verification Hub

#### Intern 5 Tasks (Template Upload & CSV Roster Parser)
* **Branch**: `feat/g3-template-csv`
* **Files**: `client/src/features/group3_certificates/TemplateUploader.jsx`, `client/src/features/group3_certificates/CsvRosterUploader.jsx`, `server/src/routes/certificates.routes.js`
- [ ] **Task 5.1**: In `TemplateUploader.jsx`, handle drag-and-drop PNG/PDF certificate background template upload with high-res preview.
- [ ] **Task 5.2**: In `CsvRosterUploader.jsx`, parse uploaded `.csv` student files (`Name`, `RollNumber`, `Event`, `Date`, `Position`) and display first 5 parsed rows.
- [ ] **Task 5.3**: Extract and provide detected CSV column headers to the placeholder mapper.

#### Intern 6 Tasks (Visual Canvas Designer & Batch PDF Engine)
* **Branch**: `feat/g3-canvas-pdf-engine`
* **Files**: `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx`, `client/src/features/group3_certificates/BatchZipGenerator.jsx`, `client/src/pages/CertificateVerifyPage.jsx`, `server/src/utils/pdfGenerator.js`
- [ ] **Task 6.1**: In `CanvasCoordinateEditor.jsx`, enable interactive drag/nudge controls to position placeholders (`{Name}`, `{RollNumber}`, `{Event}`, `{Date}`, `{CertificateId}`) over the template.
- [ ] **Task 6.2**: In `server/src/utils/pdfGenerator.js`, map web canvas top-left coordinates `(0, 0)` to PDF-Lib bottom-left vector coordinates `(0, 0)`:
  $$\text{pdfY} = \text{height} - \text{webY}$$
- [ ] **Task 6.3**: In `BatchZipGenerator.jsx`, stream batch generated vector PDFs bundled into a single `.zip` file where each certificate is named `<Certificate_ID>.pdf`.
- [ ] **Task 6.4**: In `CertificateVerifyPage.jsx`, allow entering Certificate ID or Roll Number, query `GET /api/certificates/verify`, and trigger celebration confetti on valid certificates!

---

## 4. API Endpoints Reference

| Method | Endpoint | Group Owned | Description |
|---|---|---|---|
| `GET` | `/api/events` | Group 1 | Fetch all active and upcoming society events |
| `POST` | `/api/events/register` | Group 1 | Submit student participation registration |
| `GET` | `/api/announcements` | Group 1 | Fetch society circular flyers and notices |
| `GET` | `/api/inventory/items` | Group 2 | Fetch hardware component catalog with stock counts |
| `GET` | `/api/inventory/barcode/:serial` | Group 2 | Returns Base64 PNG barcode for a serial |
| `POST` | `/api/inventory/scan-ai` | Group 2 | Vision AI component table photo analyzer |
| `POST` | `/api/inventory/checkout` | Group 2 | Issues cart hardware to student Roll Number |
| `POST` | `/api/certificates/generate-batch`| Group 3 | Generates bulk vector PDFs and streams ZIP |
| `GET` | `/api/certificates/verify?query=:id`| Group 3 | Public verification endpoint |

---

## 5. Git Flow & PR Instructions

1. **Pull the latest develop branch**:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. **Create your feature branch**:
   ```bash
   git checkout -b feat/your-group-and-task
   ```
3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(module): descriptive message of your work"
   ```
4. **Before pushing, rebase with develop**:
   ```bash
   git pull origin develop --rebase
   git push -u origin feat/your-group-and-task
   ```
5. **Open a Pull Request on GitHub against `develop`** (never merge to `main`).

---

## 6. Common Roadblocks & Quick Fixes

* **CORS Error on `/api`**: Call relative URLs like `/api/events`. The Vite client proxies `/api` to `localhost:5000` automatically.
* **PDF Coordinates**: Web canvas starts top-left `(0, 0)`. PDF coordinates start bottom-left `(0, 0)`. Use `pdfY = height - webY`.
* **Missing Keys**: If you don't have Supabase/Brevo keys yet, the backend automatically runs in local mock mode. Do not let missing keys block your frontend work!
