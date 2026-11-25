# 📂 Technoforum BIAS: Strict File Ownership & 1:1 Branch Matrix

To guarantee that all 6 interns can write code simultaneously without causing git merge conflicts, **each intern has their own dedicated feature branch and assigned subcomponent files**:

---

## 1. Intern 1:1 Branch & File Assignment Matrix

| Intern | Group | Dedicated Git Branch | Assigned Frontend Files | Assigned Backend Files |
| :--- | :--- | :--- | :--- | :--- |
| **Intern 1** | **Group 1** | `feat/intern1-hero-events` | `client/src/components/Hero3D.jsx`<br>`client/src/features/group1_events/EventCard.jsx` | `server/src/routes/events.routes.js` |
| **Intern 2** | **Group 1** | `feat/intern2-registration-notices` | `client/src/features/group1_events/EventRegistrationModal.jsx`<br>`client/src/pages/AnnouncementsPage.jsx` | `server/src/controllers/events.controller.js`<br>`server/src/controllers/announcements.controller.js` |
| **Intern 3** | **Group 2** | `feat/intern3-catalog-barcodes` | `client/src/features/group2_inventory/InventoryItemCard.jsx`<br>`client/src/features/group2_inventory/BarcodeModal.jsx` | `server/src/utils/barcodeGenerator.js`<br>`server/src/routes/inventory.routes.js` |
| **Intern 4** | **Group 2** | `feat/intern4-scanner-cart` | `client/src/features/group2_inventory/AiTableScannerModal.jsx`<br>`client/src/features/group2_inventory/IssueCartDrawer.jsx` | `server/src/controllers/inventory.controller.js` |
| **Intern 5** | **Group 3** | `feat/intern5-template-csv` | `client/src/features/group3_certificates/TemplateUploader.jsx`<br>`client/src/features/group3_certificates/CsvRosterUploader.jsx` | `server/src/routes/certificates.routes.js` |
| **Intern 6** | **Group 3** | `feat/intern6-canvas-pdf-engine` | `client/src/features/group3_certificates/CanvasCoordinateEditor.jsx`<br>`client/src/features/group3_certificates/BatchZipGenerator.jsx`<br>`client/src/pages/CertificateVerifyPage.jsx` | `server/src/utils/pdfGenerator.js`<br>`server/src/controllers/certificates.controller.js` |

---

## 2. Why 1 Branch Per Intern Eliminates Teammate Conflicts

* **No Shared Pushes**: Intern 1 pushes to `feat/intern1-hero-events` and Intern 2 pushes to `feat/intern2-registration-notices`. They never push to the same branch, so Git will never reject their push.
* **Independent PRs**: Each intern opens their own Pull Request against `develop`.
* **Zero Collision on Merge**: Because Intern 1 and Intern 2 edit completely different files, GitHub merges both PRs into `develop` cleanly with **100% zero merge conflicts**.

---

## 3. Protected System Files (DO NOT EDIT)

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
