# ⚡ Technoforum BIAS: Onboarding & 1-Command Local Setup

Welcome to the Technoforum engineering team at Birla Institute of Applied Sciences (BIAS), Bhimtal! This guide walks you through getting the entire platform running locally on your computer in under 2 minutes.

---

## 1. Clone vs Fork: Which Should Interns Use?

> [!TIP]
> **Recommended Industry Practice: DIRECT CLONE (as Collaborators)**  
> 
> * **Direct Clone (Recommended)**: You are added as a Collaborator to `https://github.com/TechnoForum-BIAS/Techno-website.git`. You clone once, switch to your dedicated branch, and push directly. There are no multiple remotes (`origin` vs `upstream`) to manage, and branch protection rules prevent any accidental pushes to `main`.
> * **Fork**: If an intern does not have write access yet, they can fork to their GitHub profile, clone their fork, push there, and open a PR back to `develop`.

---

## 2. 1-Command Local Setup (Direct Clone)

Open your terminal or PowerShell and run:

```bash
# 1. Clone the repository
git clone https://github.com/TechnoForum-BIAS/Techno-website.git
cd Techno-website

# 2. Switch directly to your personal assigned branch:
# Intern 1: git checkout feat/intern1-hero-events
# Intern 2: git checkout feat/intern2-registration-notices
# Intern 3: git checkout feat/intern3-catalog-barcodes
# Intern 4: git checkout feat/intern4-scanner-cart
# Intern 5: git checkout feat/intern5-template-csv
# Intern 6: git checkout feat/intern6-canvas-pdf-engine

# 3. Install all dependencies across root, client, and server with 1 command:
npm run install:all

# 4. Start both client and server concurrently:
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
