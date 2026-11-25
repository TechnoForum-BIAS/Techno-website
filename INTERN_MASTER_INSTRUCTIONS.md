# 🚀 Technoforum BIAS: Master Intern Implementation Guide & AI Assistant Directive
### Centralized Engineering Platform • Birla Institute of Applied Sciences (BIAS), Bhimtal
**Repository**: `https://github.com/TechnoForum-BIAS/Techno-website.git`  
**Primary Integration Branch**: `develop` | **Production Branch**: `main`

---

```
╔══════════════════════════════════════════════════════════════════════════════════════════════════════╗
║  🤖 SPECIAL AI ASSISTANT DIRECTIVE (IF THIS FILE IS FED INTO CHATGPT, CLAUDE, GEMINI, CURSOR, ETC.) ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════╝

IF A USER LOADS OR PASTES THIS FILE INTO ANY AI CODING ASSISTANT, THE AI MUST STRICTLY ADHERE TO THIS PROTOCOL:

1. DO NOT GENERATE RANDOM, MONOLITHIC, OR GENERIC CODE IMMEDIATELY.
2. FIRST, PROMPT THE USER WITH THIS EXACT ONBOARDING QUESTION:
   "👋 Welcome to the Technoforum Engineering Team!
    Which Intern are you? (Please enter Intern 1, 2, 3, 4, 5, or 6, or your assigned Group 1, 2, or 3)"

3. ONCE THE USER IDENTIFIES THEIR NUMBER OR GROUP:
   a. Look up their exact assigned branch, module, and files in Section 2 (File Ownership Matrix).
   b. Explicitly confirm their assigned files and remind them of the strict boundaries:
      "⚠️ STRICT MERGE-CONFLICT GUARDRAILS:
       You must ONLY edit your assigned feature components in 'client/src/features/' and your assigned backend handlers.
       NEVER modify App.jsx, Navbar.jsx, server/src/index.js, or other interns' files."
   c. Ask:
      "Are you working on:
       [1] Core Mandatory Requirements (P0 Must-Haves)
       [2] Self-Implemented Bonus Features (P1 Add-Ons)
       Tell me which specific feature from your checklist you want to build right now!"
   d. Guide them step-by-step, generating code that strictly conforms to the project's Cyber Theme:
      - Backgrounds: Dark Cyber Navy (#070B19, #0D1527)
      - Accents: Electric Cyan (#38BDF8), Deep Blue (#2563EB), Neon Emerald (#10B981), Amber (#F59E0B)
      - Icons: Lucide React only
      - Tailwind CSS utility classes
      - API response standard: { success: boolean, message: string, data?: any }
```

---

## 1. Quick Project & Tech Stack Architecture

* **Client**: React 18 (Vite), Tailwind CSS, Lucide React, Three.js, Canvas API, Confetti Canvas (Port `5173`).
* **Server**: Node.js & Express REST API, PostgreSQL / Supabase, `pdf-lib`, `bwip-js`, `google-auth-library`, Brevo SMTP (Port `5000`).
* **Database**: PostgreSQL on Supabase (`database/supabase_schema.sql`).
* **Zero-Setup Offline Fallback**: If you do not have live cloud API keys, the backend runs in a resilient mock mode with in-memory persistence. You can write, test, and preview all frontend features immediately!

### 1-Command Local Setup:
```bash
# 1. Clone repository
git clone https://github.com/TechnoForum-BIAS/Techno-website.git
cd Techno-website

# 2. Switch to the develop integration branch
git checkout develop

# 3. Switch to your team's assigned branch
# Group 1: git checkout feat/g1-landing-events
# Group 2: git checkout feat/g2-inventory-scanner
# Group 3: git checkout feat/g3-certificates-studio

# 4. Install dependencies and start client + server concurrently
npm run install:all
npm run dev
```

---

## 2. File Ownership Matrix (Zero Merge Conflicts)

To guarantee that all 6 interns can develop in parallel without encountering git merge conflicts, **each intern is assigned isolated subcomponent files**. The main parent pages (`EventsPage.jsx`, `InventoryPage.jsx`, `CertificateStudioPage.jsx`) simply render these subcomponents as containers.

| Intern | Group | Assigned Git Branch | Assigned Frontend Files | Assigned Backend Files |
| :--- | :--- | :--- | :--- | :--- |
| **Intern 1** | **Group 1** | `feat/g1-landing-events` | `client/src/components/Hero3D.jsx`<br>`client/src/features/group1_events/EventCard.jsx` | `server/src/routes/events.routes.js` |
| **Intern 2** | **Group 1** | `feat/g1-landing-events` | `client/src/features/group1_events/EventRegistrationModal.jsx`<br>`client/src/pages/AnnouncementsPage.jsx` | `server/src/controllers/events.controller.js`<br>`server/src/controllers/announcements.controller.js` |
| **Intern 3** | **Group 2** | `feat/g2-inventory-scanner` | `client/src/features/group2_inventory/InventoryItemCard.jsx`<br>`client/src/features/group2_inventory/BarcodeModal.jsx` | `server/src/utils/barcodeGenerator.js`<br>`server/src/routes/inventory.routes.js` |
| **Intern 4** | **Group 2** | `feat/g2-inventory-scanner` | `client/src/features/group2_inventory/AiTableScannerModal.jsx`<br>`client/src/features/group2_inventory/IssueCartDrawer.jsx` | `server/src/controllers/inventory.controller.js` |
| **Intern 5** | **Group 3** | `feat/g3-certificates-studio` | `client/src/features/group3_certificates/TemplateUploader.jsx`<br>`client/src/features/group3_certificates/CsvRosterUploader.jsx` | `server/src/routes/certificates.routes.js` |
| **Intern 6** | **Group 3** | `feat/g3-certificates-studio` | `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx`<br>`client/src/features/group3_certificates/BatchZipGenerator.jsx`<br>`client/src/pages/CertificateVerifyPage.jsx` | `server/src/utils/pdfGenerator.js`<br>`server/src/controllers/certificates.controller.js` |

> [!CAUTION]
> **PROTECTED SYSTEM FILES (DO NOT EDIT)**:  
> `client/src/App.jsx`, `client/src/components/Navbar.jsx`, `client/src/components/Footer.jsx`, `server/src/index.js`, `.env`.  
> Editing these files will break other teams' builds and cause merge conflicts.

---

## 3. Deep Dive: Group 1 — Landing Experience, Events & Notices
**Git Branch**: `feat/g1-landing-events`  
**Team**: Intern 1 & Intern 2

### 📌 Intern 1 Ownership & Tasks
* **Files**: `client/src/components/Hero3D.jsx`, `client/src/features/group1_events/EventCard.jsx`, `server/src/routes/events.routes.js`

#### ✅ Core Mandatory Requirements (P0 Must-Haves):
1. **Interactive 3D Visual Hero (`Hero3D.jsx`)**:
   - Initialize a Three.js scene featuring a glowing geometric wireframe mesh (Icosahedron / Torus Knot) rendered in `#38BDF8` cyan and `#2563EB` blue.
   - Implement mouse move listener: tilt and rotate the mesh smoothly towards the cursor position with damping.
   - Performance guard: auto-pause the animation loop when the canvas is scrolled out of viewport using `IntersectionObserver`.
2. **Dynamic Event Card (`EventCard.jsx`)**:
   - Receive `event` object and `onRegister` callback as props.
   - Render Category Badges with distinctive cyber colors:
     - *Hackathon*: Cyan pill (`bg-cyan-950/60 text-cyan-400 border border-cyan-800`)
     - *Robotics*: Purple pill (`bg-purple-950/60 text-purple-400 border border-purple-800`)
     - *Workshop*: Blue pill (`bg-blue-950/60 text-blue-400 border border-blue-800`)
     - *Coding*: Emerald pill (`bg-emerald-950/60 text-emerald-400 border border-emerald-800`)
   - Display formatted Date, Time, Venue, and Capacity metrics.
   - Status badge: `upcoming` (green glow) vs `completed` (dimmed slate).
   - "Register Participation" trigger button that executes `onRegister(event)`.

#### 💡 Self-Implemented Add-On Features (P1 Bonus Ideas):
* **Add-On 1.1: Live Countdown Timer**: Render a ticking `DD : HH : MM : SS` countdown badge on upcoming flagship events.
* **Add-On 1.2: Add to Calendar Button**: Generate a `.ics` calendar invite or 1-click Google Calendar link with event title, venue, and description.
* **Add-On 1.3: Event Social Share Pill**: Quick copy-link or WhatsApp share button with pre-filled event summary.

---

### 📌 Intern 2 Ownership & Tasks
* **Files**: `client/src/features/group1_events/EventRegistrationModal.jsx`, `client/src/pages/AnnouncementsPage.jsx`, `server/src/controllers/events.controller.js`

#### ✅ Core Mandatory Requirements (P0 Must-Haves):
1. **Event Registration Engine (`EventRegistrationModal.jsx`)**:
   - Controlled modal overlay triggered when user clicks "Register" on any event.
   - Auto-fill student profile data if logged in (`user.name`, `user.rollNumber`, `user.email`).
   - Required input fields:
     - Student Full Name (`string`, required)
     - University Roll Number (`string`, required, validated against BIAS format `e.g. 230101`)
     - College Email (`email`, required)
     - WhatsApp Phone Number (`tel`, 10 digits required)
     - Team Size / Member Names (`textarea` or tag chips for hackathons)
   - Connect submit handler to `POST /api/events/register`. Show animated spinner during fetch, followed by a checkmark confirmation screen.
2. **Society Circulars & Notices (`AnnouncementsPage.jsx`)**:
   - Fetch announcements from `GET /api/announcements`.
   - Render notice cards showing:
     - Notice Title, Date published, Priority tag (`CRITICAL`, `ACADEMIC`, `CLUB`).
     - Image flyer preview with full-screen zoom preview modal.
     - "Download Official Circular (PDF/Image)" direct link.

#### 💡 Self-Implemented Add-On Features (P1 Bonus Ideas):
* **Add-On 2.1: Digital Event Pass Generator**: On successful registration, render a downloadable digital ticket with student roll number, event title, and generated QR code pass.
* **Add-On 2.2: Duplicate Registration Guard**: Check if student roll number is already registered for this event; if so, show a warning badge instead of submitting duplicate entries.
* **Add-On 2.3: Notice Filter by Priority**: Add quick filter pills (`All`, `Urgent`, `Workshops`, `Notices`) on `AnnouncementsPage.jsx`.

---

## 4. Deep Dive: Group 2 — Smart Hardware Inventory & AI Vision Scanner
**Git Branch**: `feat/g2-inventory-scanner`  
**Team**: Intern 3 & Intern 4

### 📌 Intern 3 Ownership & Tasks
* **Files**: `client/src/features/group2_inventory/InventoryItemCard.jsx`, `client/src/features/group2_inventory/BarcodeModal.jsx`, `server/src/utils/barcodeGenerator.js`

#### ✅ Core Mandatory Requirements (P0 Must-Haves):
1. **Hardware Catalog Component Card (`InventoryItemCard.jsx`)**:
   - Receive `item`, `onAddToCart`, and `onViewBarcode` props.
   - Display stock availability badges:
     - Stock > 5: Green badge (`Available`)
     - 1 ≤ Stock ≤ 5: Amber badge (`Low Stock: X units left`)
     - Stock = 0: Red badge (`Out of Stock`, disabled cart button)
   - Render tracked individual serial chips (e.g. `BIAS-EXT-001`, `BIAS-EXT-002`, `BIAS-ARD-004`). Clicking any chip opens its barcode modal.
   - "Add to Issue Cart" button with quantity selector.
2. **Barcode & QR Modal Generator (`BarcodeModal.jsx`)**:
   - Modal displaying the generated Code-128 linear barcode and 2D QR code for a given serial number.
   - Fetch or render barcode from `GET /api/inventory/barcode/:serial`.
   - "Print Adhesive Sticker" button with CSS `@media print` styling configured for standard 2" x 1" physical lab inventory labels.

#### 💡 Self-Implemented Add-On Features (P1 Bonus Ideas):
* **Add-On 3.1: Bulk Barcode Sheet Export**: Button that generates a printable A4 grid of 24 barcode stickers for batch labeling lab drawers.
* **Add-On 3.2: Component Datasheet Quick Link**: Add an external datasheet URL link (e.g. Arduino pinout PDF, sensor specs) inside the item card.
* **Add-On 3.3: Low Stock Restock Request**: For coordinators/admins, show a 1-click "Request Restock" button that logs a replenishment ticket.

---

### 📌 Intern 4 Ownership & Tasks
* **Files**: `client/src/features/group2_inventory/AiTableScannerModal.jsx`, `client/src/features/group2_inventory/IssueCartDrawer.jsx`, `server/src/controllers/inventory.controller.js`

#### ✅ Core Mandatory Requirements (P0 Must-Haves):
1. **AI Vision Table Scanner (`AiTableScannerModal.jsx`)**:
   - Photo upload and drag-and-drop zone for lab table photos containing electronic components.
   - Connect to `POST /api/inventory/scan-ai`. Send image payload to Google Gemini Vision AI (`gemini-2.5-flash`).
   - Parse AI structured response and display detected components table:
     - Component Name (e.g. *HC-SR04 Ultrasonic Sensor*, *Resistors 10kΩ*, *Arduino Uno*)
     - Detected Count / Quantity
     - Confidence Score badge
     - Matched Inventory Catalog ID
   - "Add All Detected Components to Cart" 1-click batch button.
2. **Issue Cart Checkout Drawer (`IssueCartDrawer.jsx`)**:
   - Slide-out right-side drawer listing selected equipment.
   - Quantity increment/decrement buttons with stock maximum ceiling.
   - Return Deadline Selector: quick presets (`3 Days`, `7 Days`, `14 Days` or Custom Date Picker).
   - University Roll Number verification input.
   - "Confirm Checkout" button triggering `POST /api/inventory/checkout`.

#### 💡 Self-Implemented Add-On Features (P1 Bonus Ideas):
* **Add-On 4.1: Live Webcam Scanner**: Enable live video feed from laptop webcam so students can place components directly in front of camera without taking manual photos.
* **Add-On 4.2: Barcode Camera Reader**: Use HTML5 camera scanner to scan physical barcode stickers directly into the issue cart.
* **Add-On 4.3: Return Overdue Fine Calculator**: In coordinator view, calculate automated late return warnings based on return deadline dates.

---

## 5. Deep Dive: Group 3 — E-Certificate Studio & Verification Hub
**Git Branch**: `feat/g3-certificates-studio`  
**Team**: Intern 5 & Intern 6

### 📌 Intern 5 Ownership & Tasks
* **Files**: `client/src/features/group3_certificates/TemplateUploader.jsx`, `client/src/features/group3_certificates/CsvRosterUploader.jsx`, `server/src/routes/certificates.routes.js`

#### ✅ Core Mandatory Requirements (P0 Must-Haves):
1. **Certificate Template Ingestion (`TemplateUploader.jsx`)**:
   - Drag-and-drop file upload for high-res PNG or PDF certificate templates.
   - Client-side image dimension detection (calculates pixel width & height, e.g. `1920 x 1080` or A4 landscape `842 x 595`).
   - High-definition template preview canvas with zoom controls.
   - Pass template file and dimensions up to parent state (`CertificateStudioPage.jsx`).
2. **CSV Participant Roster Parser (`CsvRosterUploader.jsx`)**:
   - Ingestion of `.csv` or `.xlsx` event participant files.
   - Parse CSV rows in real-time using `PapaParse` or built-in parser.
   - Extract column headers (e.g. `Name`, `RollNumber`, `Event`, `Position`, `Date`, `Email`).
   - Render a data preview table showing the first 5 parsed student rows with row counter badge (`Total Participants: 142`).
   - Provide available placeholder tags to the coordinate editor.

#### 💡 Self-Implemented Add-On Features (P1 Bonus Ideas):
* **Add-On 5.1: CSV Column Auto-Mapper**: Automatically detect common column synonyms (e.g. `Full Name`, `Student_Name` -> `{Name}`).
* **Add-On 5.2: In-Browser Row Editor**: Allow correcting typos in student names directly in the preview table before generating PDFs.
* **Add-On 5.3: Duplicate Roll Number Checker**: Flag duplicate entries in CSV with a warning pill.

---

### 📌 Intern 6 Ownership & Tasks
* **Files**: `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx`, `client/src/features/group3_certificates/BatchZipGenerator.jsx`, `client/src/pages/CertificateVerifyPage.jsx`, `server/src/utils/pdfGenerator.js`

#### ✅ Core Mandatory Requirements (P0 Must-Haves):
1. **Visual Canvas Coordinate Editor (`CanvasCoordinateEditor.jsx`)**:
   - Visual interactive workspace rendering the uploaded certificate template.
   - Draggable text placeholder badges: `{Name}`, `{RollNumber}`, `{Event}`, `{Position}`, `{Date}`, `{CertificateId}`.
   - Styling controls per placeholder:
     - Font Size (slider `12px` to `72px`)
     - Font Color picker (Hex code input + palette)
     - Text Alignment (Left, Center, Right)
   - Real-time coordinate readout `(X, Y)` updating on drag or manual coordinate nudge arrows.
2. **Vector PDF-Lib Engine & ZIP Streamer (`pdfGenerator.js` & `BatchZipGenerator.jsx`)**:
   - Convert Web Canvas top-left coordinates `(0, 0)` to PDF-Lib bottom-left vector space:
     $$\text{pdfY} = \text{templateHeight} - \text{canvasY} - \text{fontSize}$$
   - Generate unique cryptographic certificate ID for each student: `TF-2026-XXXXXX`.
   - Call `POST /api/certificates/generate-batch` to generate individual PDFs and stream a combined `.zip` file.
   - Progress bar showing generation progress (`Generated 45 / 150...`).
3. **Public Certificate Verification Portal (`CertificateVerifyPage.jsx`)**:
   - Search bar accepting `Certificate ID` (e.g. `TF-2026-981245`) or `University Roll Number`.
   - Query `GET /api/certificates/verify?query=:id`.
   - Render official verified certificate badge with student name, event, issue date, and institute authenticity seal.
   - Fire celebratory confetti canvas (`canvas-confetti`) when a genuine certificate is verified!

#### 💡 Self-Implemented Add-On Features (P1 Bonus Ideas):
* **Add-On 6.1: Verification QR Code Burned on PDF**: Render a small 2D QR code onto the generated certificate bottom corner pointing to the public verification URL.
* **Add-On 6.2: Single Sample PDF Preview**: "Preview 1st Certificate" button to instantly inspect a 1-page sample PDF before generating all 200 certificates.
* **Add-On 6.3: Add to LinkedIn Certifications Button**: 1-click button on `CertificateVerifyPage.jsx` that formats the credential URL for LinkedIn's certification portal.

---

## 6. Complete API Contracts Reference

### Events API (`Group 1`)
* `GET /api/events` — Returns list of events.
  - *Response*: `{ success: true, data: [ { id, title, description, category, date, time, venue, maxParticipants, status } ] }`
* `POST /api/events/register` — Submit student registration.
  - *Body*: `{ eventId, studentName, rollNumber, email, phone, teamMembers }`
  - *Response*: `{ success: true, message: "Registration confirmed", registrationId: "reg-123" }`
* `GET /api/announcements` — Returns circular notices.
  - *Response*: `{ success: true, data: [ { id, title, description, category, date, flyerUrl } ] }`

### Inventory API (`Group 2`)
* `GET /api/inventory/items` — Returns catalog items with stock.
  - *Response*: `{ success: true, items: [ { id, name, category, quantityTotal, quantityAvailable, unit, serialPrefix, trackedSerials } ] }`
* `GET /api/inventory/barcode/:serial` — Generates Code-128 & QR barcode.
  - *Response*: `{ success: true, serial, barcodeBase64, qrBase64 }`
* `POST /api/inventory/scan-ai` — Gemini Vision photo component detection.
  - *Body*: `{ imageBase64: string }`
  - *Response*: `{ success: true, detectedItems: [ { name, count, confidence, matchedInventoryId } ] }`
* `POST /api/inventory/checkout` — Issue hardware to student.
  - *Body*: `{ rollNumber, items: [ { id, serialNumber, quantity } ], returnDeadline }`
  - *Response*: `{ success: true, transactionId, message: "Checkout complete" }`

### Certificate Studio API (`Group 3`)
* `POST /api/certificates/generate-batch` — Bulk vector PDF and ZIP generation.
  - *Body*: `{ templateBase64, students: [...], mappings: { Name: { x, y, size, color, align }, ... } }`
  - *Response*: Streams binary `application/zip` download.
* `GET /api/certificates/verify?query=:id` — Public credential lookup.
  - *Response*: `{ success: true, certificate: { certificateId, studentName, rollNumber, eventName, issueDate, verified: true } }`

---

## 7. Git Workflow & Merge Hygiene

1. **Always start by syncing with `develop`**:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. **Switch to your group's feature branch**:
   ```bash
   # Group 1
   git checkout feat/g1-landing-events
   # Group 2
   git checkout feat/g2-inventory-scanner
   # Group 3
   git checkout feat/g3-certificates-studio
   ```
3. **Commit often with clear, standard commit messages**:
   ```bash
   git add .
   git commit -m "feat(events): add live countdown timer to EventCard"
   ```
4. **Before opening a Pull Request, rebase with `develop`**:
   ```bash
   git fetch origin
   git rebase origin/develop
   ```
5. **Push to remote branch**:
   ```bash
   git push origin <your-branch-name>
   ```
6. **Open Pull Request on GitHub against `develop`** (Never create PRs against `main` directly).

---

## 8. Verification & Pre-Push Checklist

Before pushing your branch, execute this check in your terminal:
```bash
# Verify client build compiles with 0 errors
npm --prefix client run build
```
If Vite outputs `✓ built in ...ms` with **0 errors**, your code is clean and safe to push! 🚀
