# ⚡ Technoforum — Centralized Student Society Platform
### Birla Institute of Applied Sciences (BIAS), Bhimtal

Welcome to the central platform for **Technoforum**, the premier technical student society of BIAS Bhimtal. This repository powers event launches, student registrations, hardware inventory with unique barcodes and AI vision scanning, e-certificate batch generation, and public verification.

---

## 🌟 Key Features

1. **Technoforum Portal & 3D Visual Experience**:
   - Cyber-aesthetic dark blue palette (`#070B19`, `#0D1527`, `#38BDF8`).
   - Interactive Three.js geometric core with cursor-reactive particle fields.
   - Event listing, participation entry forms, and society circular flyers.

2. **Smart Hardware Inventory Management**:
   - Hardware component catalog (Arduino, sensors, extension boards, soldering stations).
   - Unique Code-128 and QR barcode generation with printable sticker labels.
   - **AI Vision Table Scanner**: Snap a phone photo of components on a table; AI detects resistors, capacitors, and microcontrollers with quantities and adds them to cart!
   - Issue Cart tied to student Roll Number with return deadlines and condition audit (`working`, `damaged`, `missing`).

3. **E-Certificate Studio & Verification Hub**:
   - Inspired by [*MailMyCertificate*](https://github.com/akshatthakur22/MailMyCertificate) architecture, adapted from Python to pure Node.js (`pdf-lib`).
   - Upload 1 base template image (PNG/PDF) + student CSV.
   - Visual canvas editor with drag-and-drop placeholder coordinates (`{Name}`, `{Event}`, `{Date}`, `{CertificateId}`).
   - Bulk vector PDF generation bundled into a downloadable `.zip` file (filename = Certificate ID).
   - Public instant verification endpoint with green shield badge and celebration confetti.

4. **Security & Role-Based Access Control**:
   - Roles: `user` (Student Member), `coordinator` (Events/Hardware), `admin` (Administrator).
   - 1-Click Google OAuth & Brevo SMTP email OTP verification.
   - Dedicated Admin Console & User Role Directory (`/admin/users`).

---

## 📁 Repository Structure

```
Technoforum-website/
├── client/                     # Frontend (Vite + React 18 + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Hero3D
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── features/           # Modular Intern Subcomponents (Zero Merge Conflicts)
│   │   │   ├── group1_events/  # EventCard, EventRegistrationModal
│   │   │   ├── group2_inventory/# InventoryItemCard, BarcodeModal, AiScanner, IssueCart
│   │   │   └── group3_certificates/# TemplateUploader, CsvUploader, CanvasEditor, BatchZip
│   │   ├── pages/              # Orchestrated Views (DO NOT MODIFY DIRECTLY)
│   │   └── App.jsx
│   └── vite.config.js          # Pre-configured with /api proxy to localhost:5000
│
├── server/                     # Backend (Node.js + Express + Supabase Postgres)
│   ├── src/
│   │   ├── config/             # Supabase client (with local mock fallback)
│   │   ├── controllers/        # Auth, Events, Inventory, Certificates, Announcements
│   │   ├── middleware/         # JWT Auth, Role verification, Rate limiter, Multer upload
│   │   ├── routes/             # REST endpoints
│   │   └── utils/              # Barcode generator (bwip-js), PDF generator (pdf-lib)
│   └── .env.example
│
├── database/
│   ├── supabase_schema.sql     # Ready-to-run PostgreSQL schema for Supabase
│   └── sample_students.csv     # Sample student roster for certificate testing
│
└── INTERN_MASTER_INSTRUCTIONS.md # The Complete Intern Implementation & AI Prompt File
```

---

## 🚀 Quick Start Guide (1-Command Setup)

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Git**: Installed and configured

### 2. 1-Command Installation
Clone the repository and install all dependencies (root, server, and client) at once:
```bash
# 1. Clone the repository
git clone <repo-url>
cd Technoforum-website

# 2. Checkout develop staging branch
git checkout develop

# 3. Install all dependencies across the entire monorepo in one command:
npm run install:all

# 4. Copy environment template files:
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### 3. Running Locally
Run both Frontend (Port 5173) and Backend (Port 5000) concurrently with one command from the project root:
```bash
npm run dev
```

* **Frontend Client**: `http://localhost:5173`
* **Backend API**: `http://localhost:5000/api`
* **Healthcheck**: `http://localhost:5000/api/health`

---

## 👥 Intern Task Roadmap & AI Assistant Directive

For all task details, assigned file ownership, API specifications, and Git flow protocols:

👉 **Please read [INTERN_MASTER_INSTRUCTIONS.md](INTERN_MASTER_INSTRUCTIONS.md)**

> [!TIP]
> **Using an AI Coding Assistant (ChatGPT, Claude, Cursor, Gemini)?**  
> Simply feed or paste `INTERN_MASTER_INSTRUCTIONS.md` into your AI assistant. The AI will ask which intern you are (1 to 6) and strictly guide your assigned tasks without editing shared files or causing merge conflicts!

---

## 🛡️ License & Credit
Maintained by **Technoforum**, Technical Student Society of Birla Institute of Applied Sciences (BIAS), Bhimtal, Uttarakhand.
