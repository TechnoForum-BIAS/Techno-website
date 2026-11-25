# 👥 Group 2 Implementation Guide: Smart Hardware Inventory & AI Scanner

**Domain**: Laboratory Component Catalog, Unique Serial Tracking, Barcode Generation, AI Table Scanner & Issue Cart  
**Assigned Interns**: **Intern 3** (Catalog Cards & Barcode Generation) & **Intern 4** (AI Vision Scanner & Issue Cart Drawer)  
**Parent Pages**: `client/src/pages/InventoryPage.jsx`, `client/src/context/CartContext.jsx`

---

## 🎯 Executive Overview & User Journey

Group 2 builds the **smart laboratory hardware inventory system** for TechnoForum:
1. Students and coordinators browse available hardware components (Arduino boards, extension cords, sensors, resistors) with **live stock status badges**.
2. Each tracked piece of equipment has a **unique serial number** (e.g., `BIAS-EXT-001`, `BIAS-ARD-004`). Clicking any serial opens a **printable Code-128 linear barcode sticker** modal.
3. Students can take a photo of their lab workbench and upload it to the **AI Vision Table Scanner**. Google Gemini Vision AI detects all components on the table and matches them to the catalog.
4. Students add components to their **Issue Cart Drawer**, choose a return deadline (e.g. 7 days), enter their roll number, and submit a hardware loan request.

---

## 1. 🛠️ Intern 3 Ownership & Tasks

* **Assigned Branch**: `feat/intern3-catalog-barcodes`
* **Owned Files**:
  * `client/src/features/group2_inventory/InventoryItemCard.jsx` (Hardware Component Card)
  * `client/src/features/group2_inventory/BarcodeModal.jsx` (Barcode & QR Sticker Generator)
  * `server/src/utils/barcodeGenerator.js` (Backend Code-128 SVG & PNG Generator)
  * `server/src/routes/inventory.routes.js` (Inventory REST Routes)

### 📌 Task 1.1: Hardware Component Card (`InventoryItemCard.jsx`)
* **Objective**: Display an individual hardware item with visual stock status, tracked serial chips, and quantity selection.
* **Component Props**:
  * `item`: `{ id, name, category, quantityTotal, quantityAvailable, unit, serialPrefix, imageUrl, status, trackedSerials }`
  * `onAddToCart`: `(item, quantity) => void`
  * `onViewBarcode`: `(serialNumber) => void`
* **Step-by-Step Implementation**:
  1. **Stock Availability Badges**:
     * `quantityAvailable > 5`: Green badge (`Available • X pcs left`) — `bg-emerald-950/60 text-emerald-400 border border-emerald-800`
     * `1 <= quantityAvailable <= 5`: Amber badge (`Low Stock • X pcs left`) — `bg-amber-950/60 text-amber-400 border border-amber-800`
     * `quantityAvailable === 0`: Red badge (`Out of Stock`) — `bg-rose-950/60 text-rose-400 border border-rose-800`
  2. **Tracked Serial Chips**:
     * If `item.trackedSerials` has entries (e.g., extension cords `BIAS-EXT-001`, `BIAS-EXT-002`), render them as clickable monospace chips with a small `Barcode` icon.
     * Clicking any serial chip invokes `onViewBarcode(serial)`.
  3. **Interactive Cart Controls**:
     * Quantity selector (`+` / `-` buttons, bounded between `1` and `quantityAvailable`).
     * "Add to Issue Cart" button. Automatically disable with `opacity-50` when `quantityAvailable === 0`.
* **Expected Output**: A cyber-themed hardware card displaying clear component details, active stock indicators, serial badges, and immediate cart interaction.

---

### 📌 Task 1.2: Barcode & QR Sticker Generator (`BarcodeModal.jsx`)
* **Objective**: Render a modal displaying a scannable linear Code-128 barcode and 2D QR code for physical equipment labeling.
* **Step-by-Step Implementation**:
  1. **Fetch Barcode Asset**:
     * Call `GET /api/inventory/barcode/:serial` or use the client-side library `jsbarcode` / `react-barcode` / `qrcode.react`.
  2. **Physical Label Layout**:
     * Format the sticker preview to match standard physical 2" x 1" adhesive laboratory labels:
       * Top: College Header `"BIAS TECHNOFORUM LAB"`
       * Middle: Crisp Code-128 Barcode with human-readable serial text underneath (e.g. `BIAS-EXT-001`).
       * Right side: 2D QR Code linking to `https://technoforum.edu/inventory?serial=BIAS-EXT-001`.
  3. **1-Click Print Button**:
     * Implement `window.print()` with CSS `@media print` rules that hide all background UI and print only the 2" x 1" barcode sticker.
* **Expected Output**: A clean modal showing high-contrast, sharp vector barcode and QR code, with a functional "Print Sticker" button.

---

### 🌟 Intern 3 Bonus / Add-On Enhancements (P1 Distinction)
* **Bulk Barcode Sheet Export**: Add a button to export an A4 printable sheet (grid of 24 barcode stickers) for new batch lab equipment.
* **Datasheet PDF Link**: Add a small "Datasheet ↗" link on components like Arduino and Sensors opening their official pinout PDF in a new tab.

---

## 2. 🛠️ Intern 4 Ownership & Tasks

* **Assigned Branch**: `feat/intern4-scanner-cart`
* **Owned Files**:
  * `client/src/features/group2_inventory/AiTableScannerModal.jsx` (AI Vision Table Scanner)
  * `client/src/features/group2_inventory/IssueCartDrawer.jsx` (Slide-Out Hardware Cart)
  * `server/src/controllers/inventory.controller.js` (Inventory Controller & Checkout Logic)

### 📌 Task 2.1: AI Vision Table Scanner (`AiTableScannerModal.jsx`)
* **Objective**: Allow students or lab coordinators to upload a photo of a messy lab table and let AI identify all components.
* **Step-by-Step Implementation**:
  1. **Image Dropzone & Capture**:
     * Drag-and-drop file uploader supporting PNG, JPG, and WEBP.
     * Render instant image preview in the modal.
  2. **API Connection (`POST /api/inventory/scan-ai`)**:
     * Convert the image to Base64 and send to `POST /api/inventory/scan-ai`.
     * Show a pulsing radar scan animation over the image while awaiting response.
  3. **Detected Components Table**:
     * Render the detected list returned by Google Gemini Vision:
       * Component Name (e.g. `Arduino Uno`, `Jumper Wires`, `Ultrasonic Sensor`)
       * Detected Quantity count
       * Confidence Score percentage badge (`95% Match`)
       * Matched Catalog Item ID
  4. **Batch Add to Cart**:
     * Provide an "Add All Detected Components to Cart" button that merges the scanned items directly into `CartContext`.
* **Expected Output**: An AI-powered vision scanner modal with a scanning animation, confidence scores, and a 1-click button to populate the cart.

---

### 📌 Task 2.2: Issue Cart Checkout Drawer (`IssueCartDrawer.jsx`)
* **Objective**: A slide-out right drawer where students review selected equipment, set a return deadline, and complete checkout.
* **Step-by-Step Implementation**:
  1. **Slide-Out Transition**:
     * Fixed right drawer with backdrop blur (`z-50 bg-[#0D1527] border-l border-brand-border`).
  2. **Cart Item List**:
     * List selected items with thumbnail, unit quantity stepper, remove button, and individual serial assignment.
  3. **Return Deadline Presets**:
     * Quick selection pills: `[3 Days]` | `[7 Days (Recommended)]` | `[14 Days]` | Custom Date Picker.
  4. **Student Identification**:
     * University Roll Number input (auto-filled if student is logged in).
     * Terms acknowledgment checkbox: *"I agree to return hardware in working condition by the deadline."*
  5. **Checkout Submission**:
     * On submit, send `POST /api/inventory/checkout`:
       ```json
       {
         "rollNumber": "230101",
         "studentName": "Aarav Sharma",
         "items": [
           { "id": "inv-001", "quantity": 1, "serialNumber": "BIAS-ARD-001" },
           { "id": "inv-002", "quantity": 1, "serialNumber": "BIAS-EXT-002" }
         ],
         "returnDeadline": "2026-12-02T18:00:00.000Z"
       }
       ```
* **Expected Output**: A responsive drawer showing the item breakdown, return deadline calculator, and a clear confirmation receipt on successful checkout.

---

### 🌟 Intern 4 Bonus / Add-On Enhancements (P1 Distinction)
* **Live Webcam Scanner**: Connect the laptop webcam so students can scan components or hold physical barcode stickers in front of the camera using `html5-qrcode` or `@zxing/library`.
* **Student Quota Guard**: Display a warning badge if a student tries to add more than 3 active items simultaneously without returning previous issues.

---

## 3. 📡 API Contract Reference

### `GET /api/inventory/items`
* **Response**:
  ```json
  {
    "success": true,
    "count": 4,
    "items": [
      {
        "id": "inv-001",
        "name": "Arduino Uno R3 Dev Board",
        "category": "Microcontrollers",
        "quantityTotal": 25,
        "quantityAvailable": 18,
        "unit": "pcs",
        "serialPrefix": "BIAS-ARD",
        "status": "available",
        "trackedSerials": ["BIAS-ARD-001", "BIAS-ARD-002"]
      }
    ]
  }
  ```

### `POST /api/inventory/scan-ai`
* **Request Body**: `{ "imageBase64": "data:image/jpeg;base64,..." }`
* **Response**:
  ```json
  {
    "success": true,
    "detectedItems": [
      { "name": "Arduino Uno R3", "count": 2, "confidence": 0.96, "catalogId": "inv-001" },
      { "name": "HC-SR04 Ultrasonic", "count": 1, "confidence": 0.92, "catalogId": "inv-003" }
    ]
  }
  ```

### `POST /api/inventory/checkout`
* **Request Body**:
  ```json
  {
    "rollNumber": "230101",
    "studentName": "Aarav Sharma",
    "items": [{ "id": "inv-001", "quantity": 1, "serialNumber": "BIAS-ARD-001" }],
    "returnDeadline": "2026-12-05T18:00:00Z"
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Equipment checkout successful. Transaction ID: TX-17956000",
    "transactionId": "TX-17956000"
  }
  ```

---

## 4. 🧪 Local Testing & Verification Checklist

1. [ ] Start dev servers via `npm run dev`.
2. [ ] Open `http://localhost:5173/inventory`. Verify sample items (Arduino, Extension Cord, Sensors) render with proper stock badges.
3. [ ] Click on a serial chip (e.g. `BIAS-EXT-001`). Verify barcode modal displays the Code-128 linear barcode.
4. [ ] Click "Add to Issue Cart". Verify the cart badge in Navbar increments.
5. [ ] Open the Issue Cart Drawer. Verify item quantity controls, return deadline selector, and successful checkout flow.
