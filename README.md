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

4. **Role-Based Access Control**:
   - Roles: `student`, `coordinator`, `super_admin`.
   - Log in using University Roll Number or College Email.

---

## 📁 Repository Structure

```
Technoforum-website/
├── client/                     # Frontend (Vite + React 18 + Tailwind CSS)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, Hero3D
│   │   ├── context/            # AuthContext, CartContext
│   │   ├── pages/              # Home, Events, Inventory, Cert Studio, Verify, Announcements, Login
│   │   └── App.jsx
│   └── vite.config.js          # Pre-configured with /api proxy to localhost:5000
│
├── server/                     # Backend (Node.js + Express + Supabase Postgres)
│   ├── src/
│   │   ├── config/             # Supabase client (with local mock fallback)
│   │   ├── controllers/        # Auth, Events, Inventory, Certificates, Announcements
│   │   ├── middleware/         # JWT Auth, Role verification, Multer upload
│   │   ├── routes/             # REST endpoints
│   │   └── utils/              # Barcode generator (bwip-js), PDF generator (pdf-lib)
│   └── .env.example
│
├── database/
│   └── supabase_schema.sql     # Ready-to-run PostgreSQL schema for Supabase
│
└── docs/
    ├── INTERN_TASKS.md         # Detailed checklist for Groups 1, 2, and 3
    └── FAQ_AND_TROUBLESHOOTING.md # Solutions to rookie intern issues
```

---

## 🚀 Quick Start Guide for Interns

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### 2. Installation
Clone the repository and install dependencies in both folders:
```bash
# Clone the repository
git clone <repo-url>
cd Technoforum-website

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cp .env.example .env
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Running Locally
You can run both Frontend and Backend concurrently with one command from the project root:
```bash
npm run dev
```

Or run them in separate terminal windows:
* **Terminal 1 (Backend API)**:
  ```bash
  cd server
  npm run dev
  # Server runs on: http://localhost:5000
  # Healthcheck: http://localhost:5000/api/health
  ```
* **Terminal 2 (Frontend Client)**:
  ```bash
  cd client
  npm run dev
  # Web application runs on: http://localhost:5173
  ```

---

## 👥 Intern Group Assignments

| Group | Focus Area | Primary Files | Branch Prefix |
| :--- | :--- | :--- | :--- |
| **Group 1** | Portal, 3D Hero, Events & Flyers | `client/src/pages/HomePage.jsx`, `EventsPage.jsx`, `server/src/controllers/events.controller.js` | `feat/g1-*` |
| **Group 2** | Smart Inventory, Barcodes & AI Scanner | `client/src/pages/InventoryPage.jsx`, `server/src/controllers/inventory.controller.js` | `feat/g2-*` |
| **Group 3** | E-Certificate Studio & Verification | `client/src/pages/CertificateStudioPage.jsx`, `CertificateVerifyPage.jsx`, `server/src/controllers/certificates.controller.js` | `feat/g3-*` |

> 📖 **Full Task Checklist**: See [docs/INTERN_TASKS.md](docs/INTERN_TASKS.md)  
> 💡 **Troubleshooting & FAQs**: See [docs/FAQ_AND_TROUBLESHOOTING.md](docs/FAQ_AND_TROUBLESHOOTING.md)

---

## 🛡️ License & Credit
Maintained by **Technoforum**, Technical Student Society of Birla Institute of Applied Sciences (BIAS), Bhimtal, Uttarakhand.
