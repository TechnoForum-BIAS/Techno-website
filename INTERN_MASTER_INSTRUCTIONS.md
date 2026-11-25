# 🚀 Technoforum BIAS: Master Engineering Documentation & Intern Implementation Guide
### Centralized Campus Engineering Platform • Birla Institute of Applied Sciences (BIAS), Bhimtal
**Repository**: `https://github.com/TechnoForum-BIAS/Techno-website.git`  
**Primary Integration Branch**: `develop` | **Production Branch**: `main`

---

```
╔══════════════════════════════════════════════════════════════════════════════════════════════════════╗
║  🤖 SPECIAL AI ASSISTANT DIRECTIVE (IF THIS FILE IS FED INTO CHATGPT, CLAUDE, GEMINI, CURSOR, ETC.) ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════╝

IF A USER LOADS OR PASTES THIS FILE INTO ANY AI CODING ASSISTANT, THE AI MUST STRICTLY ADHERE TO THIS PROTOCOL:

1. DO NOT GENERATE RANDOM, MONOLITHIC, OR UNCOORDINATED CODE IMMEDIATELY.
2. FIRST, PROMPT THE USER WITH THIS EXACT ONBOARDING QUESTION:
   "👋 Welcome to the Technoforum Engineering Team!
    Which Intern are you? (Please enter Intern 1, 2, 3, 4, 5, or 6, or your assigned Group 1, 2, or 3)"

3. ONCE THE USER IDENTIFIES THEIR NUMBER OR GROUP:
   a. Look up their exact assigned branch, module, and files in Section 3 (File Ownership Matrix).
   b. Explicitly confirm their assigned files and remind them of the strict boundaries:
      "⚠️ STRICT MERGE-CONFLICT GUARDRAILS:
       You must ONLY edit your assigned feature components in 'client/src/features/' and your assigned backend handlers.
       NEVER modify App.jsx, Navbar.jsx, server/src/index.js, or other interns' files."
   c. Display what has been implemented so far in Section 1, and review what needs improvement in Section 2.
   d. Ask:
      "Are you working on:
       [1] Core Mandatory Requirements (P0 Must-Haves)
       [2] Self-Implemented Bonus Features (P1 Add-Ons)
       Tell me which specific feature from your checklist in Section 4 you want to build right now!"
   e. Guide them step-by-step, generating code that strictly conforms to the project's Cyber Theme:
      - Backgrounds: Dark Cyber Navy (#070B19, #0D1527)
      - Accents: Electric Cyan (#38BDF8), Deep Blue (#2563EB), Neon Emerald (#10B981), Amber (#F59E0B)
      - Icons: Lucide React only
      - Tailwind CSS utility classes
      - API response standard: { success: boolean, message: string, data?: any }
```

---

## 1. 🏆 Current Project State: What Has Been Implemented Till Now

The core platform architecture, authentication, role control, master navigation, and notice management are **100% completed, tested, and pushed to GitHub**:

### A. Authentication & Role-Based Access Control (RBAC)
* **Google OAuth & Native Credentials**: Verified authentication via Google Identity Services (`google-auth-library`) and JWT sessions.
* **Student Default Guardrail**: All new public sign-ups and Google OAuth logins strictly default to `user` (Student Member). No public role selection exists on login/signup screens.
* **Super Admin Account**: `techno_forum@birlainstitute.co.in` is the official master admin pre-seeded in the database with role `admin`.
* **Administrative Role Manager (`/admin/users`)**: Dedicated management dashboard for the Super Admin to search any user by name/email, view sign-in history, and assign roles (`user`, `coordinator`, `admin`) via live dropdowns with protection preventing self-demotion.

### B. Amazon-Style Dual-Tier Navigation Bar (`Navbar.jsx`)
* **Row 1 (Utility Bar)**:
  * Institute Branding (`TECHNOFORUM BIAS`) linking to `/`.
  * Campus Status Indicator: `📍 BIAS Campus • Lab Open 9AM–8PM` with live green pulse.
  * Real Full-Width Search Bar with `Ctrl + K` / `⌘K` Spotlight Command Palette (`CommandPalette.jsx`) that searches events, hardware components, roll numbers, and quick actions.
  * Campus Notifications Bell (`NotificationCenter.jsx`) with live unread badge for circulars and loan return deadlines.
  * Amazon-style **Account & Access** Dropdown:
    * *Logged Out*: High-contrast Sign-In CTA + quick visitor links.
    * *Logged In*: 2-column layout showing "Your Activity" (loans, registrations, certs) and "Account & Tools" (dashboard, role management, cert studio, sign out).
  * Conditional **Inventory** Shortcut: Only visible after user logs in; hidden on the main landing page for visitors.
* **Row 2 (Sub-Navigation Bar)**:
  * **100% Direct Single-Click Navigation**: Zero annoying popup dropdowns!
  * `All Events` (`/events`)
  * `Hardware Lab` (`/inventory`)
  * `Notices` (`/announcements`)
  * `Verify Certificate` (`/certificates/verify`)
  * `Certificate Studio` (`/certificates/studio`) *(Coordinators & Admins)*
  * `Manage Users & Roles` (`/admin/users`) *(Super Admin)*

### C. Full Notice & Announcement Management System (CRUD)
* **Full RESTful API**:
  * `GET /api/announcements`: Publicly accessible with or without login.
  * `POST /api/announcements`: Protected by `verifyToken` and `requireRole('coordinator', 'admin')`.
  * `PUT /api/announcements/:id`: Update existing notice.
  * `DELETE /api/announcements/:id`: Delete notice.
* **Professional Notice Fields (`NoticeModal.jsx`)**:
  * Title, Category dropdown (Academic Circular, Hackathons, Hardware Lab, Recruitment, Urgent), Priority (Normal, High, Urgent), Calendar Date selection (`<input type="date" />`), Publish Time, Target Audience, Description, Pin to Top toggle, Flyer URL.
* **Integrated Everywhere**:
  * **Main Landing Page (`HomePage.jsx`)**: Dedicated "Latest Campus Notices & Circulars" bulletin.
  * **Full Notice Board (`AnnouncementsPage.jsx`)**: Live search, category filter pills, Edit & Delete buttons for coordinators/admins.
  * **User Profile (`ProfilePage.jsx`)**: Circulars card embedded in every user profile dashboard.

### D. Dynamic Role-Adaptive Profile Page (`ProfilePage.jsx`)
* **Student View (`user`)**: Hardware borrowed tracker (serials, return deadlines, active status), registered events, verified credentials, and campus circulars.
* **Coordinator View (`coordinator`)**: Campus hardware loans audit tracker, audit return inspector, quick event/flyer actions, and notice broadcaster.
* **Super Admin View (`admin`)**: Official Platform Root Console banner, system-wide metrics, direct button to Supabase Cloud, and shortcut to `/admin/users`.

### E. Zero-Merge-Conflict Modular Subcomponents (`client/src/features/`)
* Decomposed monolithic pages into 10 isolated feature files assigned 1:1 to intern ownership.

---

## 2. ⚠️ What Needs Improvement (Known Engineering Gaps & Opportunities)

While the core platform is stable and fully functional, the following areas have been identified for interns to refine and enhance:

1. **Duplicate Registration & Checkout Guards**:
   * *Gap*: An event registration can currently be submitted multiple times with the same roll number.
   * *Improvement*: Check if a student roll number is already registered for that `eventId` and show a "Already Registered" badge.
   * *Gap*: An individual serial (e.g. `BIAS-EXT-001`) can theoretically be added to cart even if already issued to another student.
   * *Improvement*: Validate that `trackedSerials` are verified against active transactions in `POST /api/inventory/checkout`.
2. **AI Vision Table Scanner Live Viewfinder**:
   * *Gap*: The scanner modal currently accepts file uploads and photo drag-and-drop.
   * *Improvement*: Connect the device webcam using the HTML5 `navigator.mediaDevices.getUserMedia` API so students can hold components directly in front of their laptop camera.
3. **Automated Brevo SMTP Notifications**:
   * *Gap*: Transactions and registrations are logged in the database, but email confirmations are not dispatched automatically.
   * *Improvement*: Trigger automated confirmation emails with QR passes when an event is registered or hardware is issued.
4. **Certificate Canvas Coordinate Scaling**:
   * *Gap*: Non-standard certificate dimensions (e.g. custom square templates) need proportional vector coordinate scaling when rendering in `pdf-lib`.
   * *Improvement*: Implement scale ratio normalization: $\text{scaleX} = \frac{\text{pdfWidth}}{\text{canvasWidth}}$, $\text{scaleY} = \frac{\text{pdfHeight}}{\text{canvasHeight}}$.
5. **Mobile Viewport Optimization on Heavy Modals**:
   * *Gap*: The Canvas Coordinate Editor and Barcode Sticker layout require horizontal scrolling on narrow smartphone screens.
   * *Improvement*: Add responsive touch controls and zoom presets for mobile screen sizes.

---

## 3. Strict File Ownership Matrix (Zero Merge Conflicts)

To guarantee that all 6 interns can develop in parallel without merge conflicts, **you must strictly modify only your assigned files**:

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

## 4. Detailed Task Roadmaps per Intern

### 👥 Group 1: Landing Experience, Events & Announcements
**Git Branch**: `feat/g1-landing-events`  
**Team**: Intern 1 & Intern 2

#### 📌 Intern 1 Tasks (3D Visuals & Dynamic Event Cards)
* **Assigned Files**: `client/src/components/Hero3D.jsx`, `client/src/features/group1_events/EventCard.jsx`, `server/src/routes/events.routes.js`
* **Must-Have Tasks (P0)**:
  - [ ] **Task 1.1**: Refine `Hero3D.jsx` using Three.js with an interactive glowing geometric wireframe (Icosahedron/Torus Knot in `#38BDF8` cyan and `#2563EB` blue) that reacts smoothly to cursor tilt.
  - [ ] **Task 1.2**: In `EventCard.jsx`, display Category Badges with distinctive cyber colors (Hackathon: cyan, Robotics: purple, Workshop: blue, Coding: green).
  - [ ] **Task 1.3**: Display formatted event Date, Time, Venue, and Capacity metrics. Connect the "Register Participation" trigger button to `onRegister(event)`.
* **Add-On Tasks (P1 Bonus Ideas)**:
  - [ ] **Add-On 1.1**: Build a live ticking `DD : HH : MM : SS` countdown badge for upcoming flagship hackathons.
  - [ ] **Add-On 1.2**: Add 1-click Google Calendar / `.ics` export with pre-filled title and venue.
  - [ ] **Add-On 1.3**: Add a quick WhatsApp / Social share button with pre-filled event summary.

#### 📌 Intern 2 Tasks (Registration Form & Society Notices)
* **Assigned Files**: `client/src/features/group1_events/EventRegistrationModal.jsx`, `client/src/pages/AnnouncementsPage.jsx`, `server/src/controllers/events.controller.js`
* **Must-Have Tasks (P0)**:
  - [ ] **Task 2.1**: In `EventRegistrationModal.jsx`, validate inputs (Roll Number format `230101`, College Email, WhatsApp number, and team member chips).
  - [ ] **Task 2.2**: Auto-fill student profile data if logged in (`user.name`, `user.rollNumber`, `user.email`).
  - [ ] **Task 2.3**: Connect submission to `POST /api/events/register` with animated checkmark confirmation.
  - [ ] **Task 2.4**: Connect `AnnouncementsPage.jsx` to `GET /api/announcements` and ensure circular flyer preview modals open with zoom view.
* **Add-On Tasks (P1 Bonus Ideas)**:
  - [ ] **Add-On 2.1**: Generate a downloadable digital event entry pass with student roll number, event title, and generated QR code.
  - [ ] **Add-On 2.2**: Implement duplicate registration prevention by checking if the roll number is already registered.

---

### 👥 Group 2: Smart Hardware Inventory & AI Vision Scanner
**Git Branch**: `feat/g2-inventory-scanner`  
**Team**: Intern 3 & Intern 4

#### 📌 Intern 3 Tasks (Hardware Catalog & Physical Barcode Labels)
* **Assigned Files**: `client/src/features/group2_inventory/InventoryItemCard.jsx`, `client/src/features/group2_inventory/BarcodeModal.jsx`, `server/src/utils/barcodeGenerator.js`
* **Must-Have Tasks (P0)**:
  - [ ] **Task 3.1**: In `InventoryItemCard.jsx`, display stock availability badges (`Available`, `Low Stock: X left`, `Out of Stock`), tracked unique serial chips (e.g. `BIAS-EXT-001`, `BIAS-ARD-004`), and "Add to Issue Cart" button.
  - [ ] **Task 3.2**: In `BarcodeModal.jsx`, render Code-128 linear barcode and 2D QR generator via `server/src/utils/barcodeGenerator.js`.
  - [ ] **Task 3.3**: Configure "Print Adhesive Label" button with CSS `@media print` formatted for physical 2" x 1" equipment stickers.
* **Add-On Tasks (P1 Bonus Ideas)**:
  - [ ] **Add-On 3.1**: Add a button that generates a printable A4 PDF sheet of 24 barcode stickers for batch labeling lab drawers.
  - [ ] **Add-On 3.2**: Add an external datasheet URL link (e.g. Arduino pinout PDF, sensor specs) inside the item card.

#### 📌 Intern 4 Tasks (AI Table Scanner & Hardware Loan Cart)
* **Assigned Files**: `client/src/features/group2_inventory/AiTableScannerModal.jsx`, `client/src/features/group2_inventory/IssueCartDrawer.jsx`, `server/src/controllers/inventory.controller.js`
* **Must-Have Tasks (P0)**:
  - [ ] **Task 4.1**: In `AiTableScannerModal.jsx`, build photo upload and drag-and-drop zone connected to `POST /api/inventory/scan-ai` (Google Gemini Vision AI).
  - [ ] **Task 4.2**: Parse detected components table (Component Name, Count, Confidence Score, Matched Catalog ID) and provide an "Add All Detected Components to Cart" button.
  - [ ] **Task 4.3**: In `IssueCartDrawer.jsx`, build quantity controls, return deadline selector (`3 Days`, `7 Days`, `14 Days`), student roll number verification, and checkout API trigger (`POST /api/inventory/checkout`).
* **Add-On Tasks (P1 Bonus Ideas)**:
  - [ ] **Add-On 4.1**: Connect laptop webcam video feed so students can show components directly to camera.
  - [ ] **Add-On 4.2**: Use HTML5 camera barcode scanner to scan physical barcode stickers directly into the issue cart.
  - [ ] **Add-On 4.3**: Calculate automated late return warning badges in coordinator view.

---

### 👥 Group 3: E-Certificate Studio & Verification Hub
**Git Branch**: `feat/g3-certificates-studio`  
**Team**: Intern 5 & Intern 6

#### 📌 Intern 5 Tasks (Certificate Template Ingestion & CSV Parser)
* **Assigned Files**: `client/src/features/group3_certificates/TemplateUploader.jsx`, `client/src/features/group3_certificates/CsvRosterUploader.jsx`, `server/src/routes/certificates.routes.js`
* **Must-Have Tasks (P0)**:
  - [ ] **Task 5.1**: In `TemplateUploader.jsx`, build drag-and-drop PNG/PDF certificate template upload with automatic dimension detection (e.g. `1920x1080` or A4 landscape `842x595`) and high-res preview canvas.
  - [ ] **Task 5.2**: In `CsvRosterUploader.jsx`, parse `.csv`/`.xlsx` participant sheets (`Name`, `RollNumber`, `Event`, `Position`, `Date`) using `PapaParse` and display a 5-row preview table with participant counts.
  - [ ] **Task 5.3**: Extract and provide detected CSV column headers to the placeholder mapper.
* **Add-On Tasks (P1 Bonus Ideas)**:
  - [ ] **Add-On 5.1**: Automatically detect common column synonyms (e.g. `Full Name`, `Student_Name` -> `{Name}`).
  - [ ] **Add-On 5.2**: Allow correcting typos in student names directly in the preview table before generating PDFs.

#### 📌 Intern 6 Tasks (Visual Canvas Coordinate Designer & Batch PDF-Lib Engine)
* **Assigned Files**: `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx`, `client/src/features/group3_certificates/BatchZipGenerator.jsx`, `client/src/pages/CertificateVerifyPage.jsx`, `server/src/utils/pdfGenerator.js`
* **Must-Have Tasks (P0)**:
  - [ ] **Task 6.1**: In `CanvasCoordinateEditor.jsx`, enable drag-and-drop or coordinate nudge inputs for text placeholders `{Name}`, `{RollNumber}`, `{Event}`, `{Position}`, `{Date}`, `{CertificateId}` with font size, color, and alignment controls.
  - [ ] **Task 6.2**: In `server/src/utils/pdfGenerator.js`, map Web Canvas top-left coordinates `(0, 0)` to PDF-Lib bottom-left vector space:
    $$\text{pdfY} = \text{templateHeight} - \text{canvasY} - \text{fontSize}$$
  - [ ] **Task 6.3**: In `BatchZipGenerator.jsx`, assign unique cryptographic IDs (`TF-2026-XXXXXX`), call `POST /api/certificates/generate-batch`, and stream a bundled `.zip` file with progress bar.
  - [ ] **Task 6.4**: In `CertificateVerifyPage.jsx`, search by Certificate ID or Roll Number, query `GET /api/certificates/verify?query=:id`, display verified credential card, and trigger celebration confetti!
* **Add-On Tasks (P1 Bonus Ideas)**:
  - [ ] **Add-On 6.1**: Render a 2D QR code onto the generated certificate bottom corner pointing to the public verification URL.
  - [ ] **Add-On 6.2**: Add a "Preview 1st Certificate" button to inspect a 1-page sample PDF before batch generating 200 certificates.
  - [ ] **Add-On 6.3**: Add a 1-click button on `CertificateVerifyPage.jsx` pre-filling the certificate URL for LinkedIn Licenses & Certifications.

---

## 5. Complete API Contracts Reference

### Events API (`Group 1`)
* `GET /api/events` — Returns list of events.
  - *Response*: `{ success: true, data: [ { id, title, description, category, date, time, venue, maxParticipants, status } ] }`
* `POST /api/events/register` — Submit student registration.
  - *Body*: `{ eventId, studentName, rollNumber, email, phone, teamMembers }`
  - *Response*: `{ success: true, message: "Registration confirmed", registrationId: "reg-123" }`

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

### Announcements & Notices API (Master Core)
* `GET /api/announcements` — Returns all notices (public).
  - *Response*: `{ success: true, count, announcements: [ { id, title, category, priority, date, time, author, content, isPinned, flyerUrl, targetAudience } ] }`
* `POST /api/announcements` — Publish notice *(Coordinators & Admins Only)*.
* `PUT /api/announcements/:id` — Update notice *(Coordinators & Admins Only)*.
* `DELETE /api/announcements/:id` — Delete notice *(Coordinators & Admins Only)*.

---

## 6. Git Flow & PR Instructions

1. **Pull the latest develop branch**:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. **Switch to your group's feature branch**:
   - Group 1: `git checkout feat/g1-landing-events`
   - Group 2: `git checkout feat/g2-inventory-scanner`
   - Group 3: `git checkout feat/g3-certificates-studio`
3. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(module): descriptive message of your work"
   ```
4. **Before pushing, rebase with develop**:
   ```bash
   git fetch origin
   git rebase origin/develop
   ```
5. **Verify client build**:
   ```bash
   npm --prefix client run build
   ```
6. **Push to remote**:
   ```bash
   git push origin <your-branch-name>
   ```
7. **Open a Pull Request on GitHub against `develop`** (Never create PRs against `main` directly).

---

## 7. 🛡️ Git Merge Conflict Prevention & Step-by-Step Resolution Guide

Merge conflicts occur when two or more developers edit the exact same lines of code in the same file and Git cannot automatically decide which version to keep. Follow these guidelines to prevent and resolve them.

### A. The 5 Golden Rules to Completely Avoid Conflicts
1. **Never Touch Shared Core Files**:
   Do NOT edit `App.jsx`, `Navbar.jsx`, `Footer.jsx`, `server/src/index.js`, or root `package.json`. Your subcomponents in `client/src/features/` are already wired into these files.
2. **One Feature, One File**:
   Interns work strictly within their assigned files listed in Section 3 (File Ownership Matrix). If Intern 1 is working on `EventCard.jsx`, Intern 2 must work on `EventRegistrationModal.jsx`.
3. **Daily Sync First Thing in the Morning**:
   Before writing any code, always sync your branch with `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout <your-branch-name>
   git merge develop
   ```
4. **Make Small, Atomic Commits**:
   Do not accumulate 20 changes over 3 days without committing. Commit small, logical chunks (e.g. "feat: add date picker to registration modal").
5. **Always Pull with Rebase Before Pushing**:
   ```bash
   git fetch origin
   git rebase origin/develop
   ```

---

### B. Step-by-Step: How to Solve a Merge Conflict When It Occurs

If Git alerts you with `CONFLICT (content): Merge conflict in ...` during a `merge` or `rebase`, **do not panic**. Follow this 6-step protocol:

#### Step 1: Identify Conflicted Files
Run:
```bash
git status
```
Git will list conflicted files in red under `Unmerged paths:`, for example:
```text
both modified:   client/src/features/group1_events/EventCard.jsx
```

#### Step 2: Open the Conflicted File in VS Code
Open the file. Git marks the collision with standard conflict markers:
```javascript
<<<<<<< HEAD (Current Change - Your Local Code)
<button className="px-4 py-2 bg-brand-blue text-white rounded-xl">
  Register for Event
</button>
=======
<button className="px-4 py-2 bg-gradient-to-r from-brand-blue to-cyan-500 text-white rounded-xl font-bold">
  Register Participation Now
</button>
>>>>>>> develop (Incoming Change - Remote Code)
```

#### Step 3: Choose the Correct Code
In VS Code, you will see clickable buttons above the conflict:
* **Accept Current Change**: Keeps your local code and discards incoming remote code.
* **Accept Incoming Change**: Takes the remote code from `develop` and discards your local lines.
* **Accept Both Changes**: Keeps both blocks sequentially.
* **Manual Edit (Recommended)**: Delete the `<<<<<<<`, `=======`, and `>>>>>>>` lines manually and combine the best of both blocks into clean, valid code.

#### Step 4: Verify that All Conflict Markers Are Gone
Search your file for `<<<<<<<`. If any markers remain, the code will fail to compile.

#### Step 5: Stage the Resolved Files
```bash
git add client/src/features/group1_events/EventCard.jsx
```

#### Step 6: Complete the Merge or Rebase
* If you were in a **rebase** (`git rebase origin/develop`):
  ```bash
  git rebase --continue
  ```
  *(Repeat Steps 2–5 if multiple commits had conflicts until Git says `Successfully rebased`).*
* If you were in a **merge** (`git merge develop`):
  ```bash
  git commit -m "merge: resolve conflicts with develop"
  ```

#### 🚨 Emergency Escape Hatch: If You Get Stuck or Made a Mistake
If you make an error while resolving conflicts and want to safely return your repository to the exact state it was before you started:
```bash
# If rebasing:
git rebase --abort

# If merging:
git merge --abort
```
This cancels the operation and returns your repository to a clean state without losing any of your previously committed code!

---

## 8. 🛠️ Comprehensive Engineering Troubleshooting Guide (All Known Errors & Fixes)

| Error / Issue | Root Cause | Exact Solution |
| :--- | :--- | :--- |
| **`npm : File ... npm.ps1 cannot be loaded because running scripts is disabled`** | Windows PowerShell security execution policy blocks script execution. | Run PowerShell as Administrator or run: <br>`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`<br>Or run commands with `npm.cmd` instead of `npm`. |
| **`error: Your local changes to the following files would be overwritten by merge/checkout`** | You modified local files without committing or stashing before pulling. | Run:<br>`git stash`<br>`git pull origin develop`<br>`git stash pop` |
| **`fatal: refusing to merge unrelated histories`** | Remote branch and local branch were created independently with different commit trees. | Run:<br>`git pull origin develop --allow-unrelated-histories` |
| **`Error: listen EADDRINUSE: address already in use :::5000` or `:::5173`** | An old Node.js or Vite process is still running in the background and holding the port. | **Windows (PowerShell)**:<br>`netstat -ano \| findstr :5000`<br>`taskkill /PID <PID_NUMBER> /F`<br>**Mac / Linux**:<br>`kill -9 $(lsof -t -i:5000)` |
| **`Cannot find module 'lucide-react'` or missing dependencies** | Dependencies were not installed in both client and server directories. | Run from the repository root:<br>`npm run install:all`<br>This automatically runs `npm install` across root, `client/`, and `server/`. |
| **`fetch('/api/...') returns 404 Not Found` or `ECONNREFUSED`** | The Express backend server is not running on port 5000. | Start the server in a separate terminal: <br>`npm run server`<br>Or start both concurrently: `npm run dev`. |
| **Supabase or Brevo API keys missing in `.env`** | You do not have access to live cloud keys yet. | **Do NOT worry!** The platform has an automatic in-memory mock engine. It seamlessly provides mock events, mock inventory, and mock notices with zero cloud dependencies so you can build and test your frontend features immediately. |
| **`npm run build` fails with `Failed to resolve import`** | Case-sensitivity typo in a component file path (e.g. `eventCard.jsx` vs `EventCard.jsx`). | Git on Windows is case-insensitive, but Linux production environments are case-sensitive. Always verify exact file casing matching the filesystem. |
