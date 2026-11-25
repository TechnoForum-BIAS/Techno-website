# 📂 Technoforum BIAS: Strict File Ownership Matrix

To guarantee that all 6 interns can write code simultaneously without causing git merge conflicts, the codebase is modularized into subcomponents under `client/src/features/`.

---

## 1. Intern File Assignment Matrix

| Intern | Group | Assigned Git Branch | Assigned Frontend Files | Assigned Backend Files |
| :--- | :--- | :--- | :--- | :--- |
| **Intern 1** | **Group 1** | `feat/g1-landing-events` | `client/src/components/Hero3D.jsx`<br>`client/src/features/group1_events/EventCard.jsx` | `server/src/routes/events.routes.js` |
| **Intern 2** | **Group 1** | `feat/g1-landing-events` | `client/src/features/group1_events/EventRegistrationModal.jsx`<br>`client/src/pages/AnnouncementsPage.jsx` | `server/src/controllers/events.controller.js`<br>`server/src/controllers/announcements.controller.js` |
| **Intern 3** | **Group 2** | `feat/g2-inventory-scanner` | `client/src/features/group2_inventory/InventoryItemCard.jsx`<br>`client/src/features/group2_inventory/BarcodeModal.jsx` | `server/src/utils/barcodeGenerator.js`<br>`server/src/routes/inventory.routes.js` |
| **Intern 4** | **Group 2** | `feat/g2-inventory-scanner` | `client/src/features/group2_inventory/AiTableScannerModal.jsx`<br>`client/src/features/group2_inventory/IssueCartDrawer.jsx` | `server/src/controllers/inventory.controller.js` |
| **Intern 5** | **Group 3** | `feat/g3-certificates-studio` | `client/src/features/group3_certificates/TemplateUploader.jsx`<br>`client/src/features/group3_certificates/CsvRosterUploader.jsx` | `server/src/routes/certificates.routes.js` |
| **Intern 6** | **Group 3** | `feat/g3-certificates-studio` | `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx`<br>`client/src/features/group3_certificates/BatchZipGenerator.jsx`<br>`client/src/pages/CertificateVerifyPage.jsx` | `server/src/utils/pdfGenerator.js`<br>`server/src/controllers/certificates.controller.js` |

---

## 2. Protected System Files (DO NOT EDIT)

> [!CAUTION]
> **NEVER MODIFY THESE SHARED FILES**:
> * `client/src/App.jsx`
> * `client/src/components/Navbar.jsx`
> * `client/src/components/Footer.jsx`
> * `server/src/index.js`
> * `package.json`
> * `.env` or `.env.example`
> 
> These files are already fully connected. Modifying them will cause merge conflicts with other teams.

---

## 3. How Subcomponents Work

The parent pages (`EventsPage.jsx`, `InventoryPage.jsx`, `CertificateStudioPage.jsx`) act purely as containers that import and render your subcomponents.

* **Example**: `EventsPage.jsx` renders `EventCard.jsx` (Intern 1) and opens `EventRegistrationModal.jsx` (Intern 2).
* Intern 1 can edit `EventCard.jsx` without touching Intern 2's `EventRegistrationModal.jsx`.
* Result: **Zero merge conflicts!**
