# ⚡ Technoforum BIAS: Onboarding & 1-Command Local Setup

Welcome to the Technoforum engineering team at Birla Institute of Applied Sciences (BIAS), Bhimtal! This guide walks you through getting the entire platform running locally on your computer in under 2 minutes.

---

## 1. Tech Stack Overview

* **Frontend (`/client`)**: React 18, Vite, Tailwind CSS, Lucide React, Three.js, Canvas API, Confetti Canvas (Runs on Port `5173`).
* **Backend (`/server`)**: Node.js & Express REST API, PostgreSQL / Supabase, `pdf-lib`, `bwip-js`, `google-auth-library`, Brevo SMTP (Runs on Port `5000`).
* **Database (`/database`)**: PostgreSQL schema (`database/supabase_schema.sql`) and sample student roster (`sample_students.csv`).

---

## 2. 1-Command Local Setup

Open your terminal or PowerShell and run:

```bash
# 1. Clone the repository
git clone https://github.com/TechnoForum-BIAS/Techno-website.git
cd Techno-website

# 2. Switch to the develop integration branch
git checkout develop

# 3. Switch to your team's assigned feature branch:
# Group 1: git checkout feat/g1-landing-events
# Group 2: git checkout feat/g2-inventory-scanner
# Group 3: git checkout feat/g3-certificates-studio

# 4. Install all dependencies across root, client, and server with 1 command:
npm run install:all

# 5. Start both client and server concurrently:
npm run dev
```

* **Vite Client URL**: Open [http://localhost:5173](http://localhost:5173) in your browser.
* **Express API URL**: [http://localhost:5000](http://localhost:5000) (The Vite client automatically proxies all `/api` calls).

---

## 3. Zero-Setup Offline Mock Engine

> [!NOTE]
> **No API Keys Needed to Start Coding!**  
> If you do not have live Supabase or Brevo keys in your `.env` file, the backend automatically runs in a resilient **in-memory mock mode**. It provides mock events, mock hardware items, and mock notices with zero cloud dependencies. You can code and test your frontend features immediately!

---

## 4. Next Steps
* Open [02_FILE_OWNERSHIP_MATRIX.md](./02_FILE_OWNERSHIP_MATRIX.md) to check your assigned files.
* Open your group's specific task guide:
  * [Group 1: Landing, Events & Notices](./03_GROUP1_EVENTS_AND_NOTICES.md)
  * [Group 2: Hardware Catalog & AI Scanner](./04_GROUP2_INVENTORY_AND_SCANNER.md)
  * [Group 3: E-Certificate Studio](./05_GROUP3_CERTIFICATES_STUDIO.md)
