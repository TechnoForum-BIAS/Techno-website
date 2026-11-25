# 👥 Group 2 Implementation Guide: Smart Hardware Inventory & Lab Loan System

**Domain**: Laboratory Component Catalog, Item ID Barcodes, AI Vision Table Scanner, In-Person Issue & Loan Management  
**Assigned Interns**: **Intern 3** (Catalog, Clean Barcodes & Student Profile Loan Tracking) & **Intern 4** (Dual-Mode AI Scanner & Coordinator Loan Management Console)  
**Parent Pages**: `client/src/pages/InventoryPage.jsx`, `client/src/pages/ProfilePage.jsx`, `client/src/context/CartContext.jsx`

---

## 🎯 Executive Overview & Real-World Lab Workflow

Group 2 builds the **hardware borrowing and laboratory management engine** for TechnoForum. Instead of an automated e-commerce checkout, it reflects the **actual physical workflow of an engineering college laboratory**:

```
[1. Student Cart] ──> Submits Hardware Request (Items + purpose)
                             │
                             ▼
[2. In-Person Lab Visit] ──> Student visits lab & meets Coordinator
                             │
                             ▼
[3. Coordinator Portal] ──> Coordinator verifies hardware, assigns serials, sets 14-Day Deadline
                             │
                             ▼
[4. Active Loan on Profile] ──> Student sees issued items, countdown, and "Request Extension" button
                             │
                             ▼
[5. Return & Inspection] ──> Coordinator inspects parts:
                             ├── All Working: Clicks "Confirm Return" -> Restores Stock
                             └── Damaged/Missing: Adds red alert note (e.g. "Pin 13 burned")
```

---

## 1. 🛠️ Intern 3 Ownership & Tasks

* **Assigned Branch**: `feat/intern3-catalog-barcodes`
* **Owned Files**:
  * `client/src/features/group2_inventory/InventoryItemCard.jsx` (Component Catalog Card)
  * `client/src/features/group2_inventory/BarcodeModal.jsx` (Clean Item ID Barcode Generator)
  * `client/src/features/group2_inventory/StudentLoansPanel.jsx` (Profile Hardware Loans Section)
  * `server/src/routes/inventory.routes.js` (Inventory & Loan Routes)

### 📌 Task 1.1: Component Catalog Card (`InventoryItemCard.jsx`)
* **Objective**: Display hardware with live stock badges, serial prefixes, and request selection.
* **Component Specs**:
  1. **Stock Indicators**:
     * `Available`: Green badge (`> 5 pcs available`)
     * `Low Stock`: Amber badge (`1 to 5 pcs left`)
     * `Out of Stock`: Red badge (`0 pcs`, "Request" button disabled)
  2. **Tracked Serial Chips**:
     * Displays tracked unit prefixes (e.g. `BIAS-EXT-001`, `BIAS-ARD-004`).
     * Clicking an Item ID / Serial opens its clean barcode label.
  3. **"Add to Request Queue"**:
     * Quantity stepper (`1` to available quantity). Adds item to student's pending issue request cart.

---

### 📌 Task 1.2: Clean Item ID Barcode Label Generator (`BarcodeModal.jsx`)
* **Objective**: A simplified, non-intrusive barcode tool for labeling lab hardware.
* **Requirements**:
  * Takes the unique **Item ID / Serial Number** (e.g., `TF-INV-001` or `BIAS-ARD-004`).
  * Renders a clean 2" × 1" physical laboratory adhesive sticker:
    * Top: `"BIAS TECHNOFORUM LAB"`
    * Center: Sharp Code-128 linear barcode + human-readable Item ID underneath.
    * 1-Click "Print Sticker" button formatted with `@media print`.

---

### 📌 Task 1.3: Student Profile Loan Dashboard (`StudentLoansPanel.jsx`)
* **Objective**: Embedded in `ProfilePage.jsx` so students can track all their active and past hardware borrowings with 100% transparency.
* **Displayed Information Per Borrowing**:
  * **Component Names & Serials**: e.g. *Arduino Uno R3 (`BIAS-ARD-002`), Ultrasonic Sensor (`BIAS-SEN-005`)*.
  * **Issue Date & Max 14-Day Deadline**: Countdown badge showing days remaining until the 14-day limit.
  * **Status Badges**:
    * `Requested` (Amber - awaiting in-person lab pickup)
    * `Issued` (Emerald - active loan)
    * `Pending Return` (Blue - student has submitted return request)
    * `Returned` (Slate - completed)
    * `Overdue` (Red pulse)
  * **"Request Extension" Button**:
    * Allows the student to submit a 7-day extension request with a brief explanation. Shows *"Extension Requested (Pending Coordinator Review)"*.
  * **Damage / Loss Alert Note**:
    * If the coordinator recorded damages, display a **prominent red callout box** with the coordinator's note.

---

## 2. 🛠️ Intern 4 Ownership & Tasks

* **Assigned Branch**: `feat/intern4-scanner-cart`
* **Owned Files**:
  * `client/src/features/group2_inventory/AiTableScannerModal.jsx` (Dual-Mode Table Scanner)
  * `client/src/features/group2_inventory/IssueRequestCartModal.jsx` (Student Issue Request Modal)
  * `client/src/features/group2_inventory/CoordinatorLoanConsole.jsx` (Coordinator Loan Management)
  * `server/src/controllers/inventory.controller.js` (Loan Lifecycles & Gemini Vision Logic)

### 📌 Task 2.1: Dual-Mode AI Vision Table Scanner (`AiTableScannerModal.jsx`)
* **Objective**: Uses Google Gemini Vision AI to identify workbench components. Serves two specific users:
  1. **Coordinators**: Point laptop/phone camera at the lab counter during in-person checkout to rapidly identify and log parts without typing.
  2. **Students**: Upload workbench photos or turn on camera to discover component names, pinouts, and availability in the catalog.
* **Dual-Mode Controls**:
  * **Mode A: File Upload**: Drag-and-drop or gallery file picker (PNG, JPG, WEBP).
  * **Mode B: Live Camera Toggle**: Real-time webcam video stream with a "Capture & Analyze" shutter button.
* **Scan Results View**:
  * Detected components list (Name, Count, Confidence percentage).
  * "Add Detected Items to Request" button.

---

### 📌 Task 2.2: Student Issue Request Modal (`IssueRequestCartModal.jsx`)
* **Objective**: Where the student submits their list of requested components for in-person collection.
* **Workflow**:
  * Lists requested items and quantities.
  * Auto-fills student Roll Number, Name, and Email if logged in (or allows guest entry).
  * Notes field: *"Purpose of issue (e.g. Major Project, Hackathon prototype)"*.
  * On submit, sets status to `Requested` and advises student: *"Please visit the Hardware Lab with your student ID to collect your components."*

---

### 📌 Task 2.3: Coordinator Loan Management Console (`CoordinatorLoanConsole.jsx`)
* **Objective**: The central management screen for lab coordinators to track and control all borrowings.
* **Key Coordinator Actions**:
  1. **Assign & Issue (In-Person Handover)**:
     * When student arrives at the lab, coordinator views the request, scans or selects physical serials (`BIAS-ARD-001`), sets the **14-day deadline**, and clicks **"Confirm Issue"**.
  2. **Review Extension Requests**:
     * 1-click **"Approve Extension (+7 Days)"** or **"Reject Extension"**.
  3. **Inspect & Confirm Return**:
     * When student returns hardware, coordinator clicks **"Confirm Return"**, which automatically restores available stock in the catalog.
  4. **Record Damaged / Missing Hardware**:
     * If an item is damaged or missing, coordinator clicks *"Flag Damaged/Missing"*:
       * Adds a **red alert remark** (e.g., *"Breadboard melted; 2 jumper wires missing"*).
       * Marks status as `Damaged` or `Missing` so it stays permanently recorded on the student's profile without corrupting stock counts.

---

## 3. 📡 API Contract Reference

### `POST /api/inventory/request-issue`
* **Student submits request**:
  ```json
  {
    "rollNumber": "230101",
    "studentName": "Aarav Sharma",
    "purpose": "Robotics Maze Solver Prototype",
    "items": [
      { "itemId": "inv-001", "quantity": 1 },
      { "itemId": "inv-003", "quantity": 2 }
    ]
  }
  ```

### `PUT /api/inventory/loans/:id/assign` *(Coordinator Only)*
* **Coordinator completes in-person handover**:
  ```json
  {
    "assignedSerials": ["BIAS-ARD-001", "BIAS-SEN-004", "BIAS-SEN-005"],
    "deadlineDays": 14
  }
  ```

### `POST /api/inventory/loans/:id/extend` *(Student Only)*
* **Student requests deadline extension**:
  ```json
  {
    "reason": "Need 5 more days for final testing before evaluation."
  }
  ```

### `PUT /api/inventory/loans/:id/return` *(Coordinator Only)*
* **Coordinator signs off on return**:
  ```json
  {
    "status": "returned",
    "condition": "working",
    "damageRemarks": null
  }
  ```
* *If damaged:*
  ```json
  {
    "status": "returned_damaged",
    "condition": "damaged",
    "damageRemarks": "Microcontroller USB-B port damaged by student."
  }
  ```

---

## 4. 🧪 Local Testing & Verification Checklist

1. [ ] Open `http://localhost:5173/inventory`. Add Arduino and Resistors to your request queue.
2. [ ] Submit the request. Open `ProfilePage.jsx` and verify the borrowing appears under **Hardware Loans** as `Requested`.
3. [ ] Log in as coordinator. In `CoordinatorLoanConsole`, view the pending request, assign serial `BIAS-ARD-001`, and click "Confirm Issue".
4. [ ] In student profile, verify status changes to `Issued` with the active **14-day countdown**.
5. [ ] Click "Request Extension". Verify coordinator sees the extension request and can approve/reject it.
6. [ ] Test return flow: Coordinator signs off on return with a damage note and verifies stock restores correctly.
