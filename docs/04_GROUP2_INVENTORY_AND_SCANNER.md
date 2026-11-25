# 👥 Group 2 Implementation Guide: Smart Hardware Inventory & AI Scanner
**Git Branch**: `feat/g2-inventory-scanner`  
**Team**: Intern 3 & Intern 4

---

## 1. Intern 3 Ownership & Tasks

* **Assigned Files**:
  * `client/src/features/group2_inventory/InventoryItemCard.jsx`
  * `client/src/features/group2_inventory/BarcodeModal.jsx`
  * `server/src/utils/barcodeGenerator.js`
  * `server/src/routes/inventory.routes.js`

### ✅ Must-Have Core Requirements (P0):
1. **Hardware Catalog Component Card (`InventoryItemCard.jsx`)**:
   - Receive `item`, `onAddToCart`, and `onViewBarcode` props.
   - Display stock status badges:
     - Stock > 5: Green badge (`Available`)
     - 1 ≤ Stock ≤ 5: Amber badge (`Low Stock: X left`)
     - Stock = 0: Red badge (`Out of Stock`, disabled cart button)
   - Render tracked individual serial chips (e.g. `BIAS-EXT-001`, `BIAS-ARD-004`). Clicking opens its barcode modal.
   - "Add to Issue Cart" button with quantity selector.
2. **Barcode & QR Modal Generator (`BarcodeModal.jsx`)**:
   - Modal displaying the generated Code-128 linear barcode and 2D QR code for a given serial number via `server/src/utils/barcodeGenerator.js`.
   - "Print Adhesive Sticker" button with CSS `@media print` formatted for physical 2" x 1" laboratory equipment labels.

### 💡 Self-Implemented Add-On Ideas (P1 Bonus):
* **Add-On 3.1**: Bulk Barcode Sheet Export button (printable A4 PDF grid of 24 barcode stickers).
* **Add-On 3.2**: Component Datasheet PDF link inside the card.

---

## 2. Intern 4 Ownership & Tasks

* **Assigned Files**:
  * `client/src/features/group2_inventory/AiTableScannerModal.jsx`
  * `client/src/features/group2_inventory/IssueCartDrawer.jsx`
  * `server/src/controllers/inventory.controller.js`

### ✅ Must-Have Core Requirements (P0):
1. **AI Vision Table Scanner (`AiTableScannerModal.jsx`)**:
   - Photo upload and drag-and-drop zone for lab table photos with electronic components.
   - Connect to `POST /api/inventory/scan-ai` (Google Gemini Vision AI).
   - Display detected components table (Component Name, Count, Confidence Score, Matched Catalog ID).
   - "Add All Detected Components to Cart" 1-click batch button.
2. **Issue Cart Checkout Drawer (`IssueCartDrawer.jsx`)**:
   - Slide-out right-side drawer listing selected equipment.
   - Quantity controls with stock maximum ceiling.
   - Return Deadline Selector: quick presets (`3 Days`, `7 Days`, `14 Days` or Custom Date Picker).
   - University Roll Number input and checkout API trigger (`POST /api/inventory/checkout`).

### 💡 Self-Implemented Add-On Ideas (P1 Bonus):
* **Add-On 4.1**: Connect laptop webcam video stream so students can show components directly to camera.
* **Add-On 4.2**: Use HTML5 camera barcode scanner to scan physical barcode stickers directly into the issue cart.
* **Add-On 4.3**: Calculate automated late return warning badges in coordinator view.

---

## 3. Related API Contracts
* `GET /api/inventory/items` — Returns catalog items with stock counts.
* `GET /api/inventory/barcode/:serial` — Returns Base64 Code-128 and QR codes.
* `POST /api/inventory/scan-ai` — Body: `{ imageBase64 }`
* `POST /api/inventory/checkout` — Body: `{ rollNumber, items: [ { id, serialNumber, quantity } ], returnDeadline }`
