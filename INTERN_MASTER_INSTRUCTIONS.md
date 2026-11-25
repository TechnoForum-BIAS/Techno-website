# 🚀 Technoforum BIAS: Master Engineering Hub & AI Assistant Directive
### Centralized Engineering Platform • Birla Institute of Applied Sciences (BIAS), Bhimtal
**Repository**: `https://github.com/TechnoForum-BIAS/Techno-website.git`  
**Primary Integration Branch**: `develop` | **Production Branch**: `main`

---

```
╔══════════════════════════════════════════════════════════════════════════════════════════════════════╗
║  🤖 SPECIAL AI ASSISTANT DIRECTIVE (IF THIS FILE IS FED INTO CHATGPT, CLAUDE, GEMINI, CURSOR, ETC.) ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════════╝

IF A USER LOADS OR PASTES THIS FILE INTO ANY AI CODING ASSISTANT, THE AI MUST STRICTLY ADHERE TO THIS PROTOCOL:

1. DO NOT GENERATE RANDOM OR UNCOORDINATED CODE IMMEDIATELY.
2. FIRST, PROMPT THE USER WITH THIS EXACT ONBOARDING QUESTION:
   "👋 Welcome to the Technoforum Engineering Team!
    Which Intern are you? (Please enter Intern 1, 2, 3, 4, 5, or 6, or your assigned Group 1, 2, or 3)"

3. ONCE THE USER REPLIES WITH THEIR NUMBER OR GROUP:
   a. Look up their exact assigned files in `docs/02_FILE_OWNERSHIP_MATRIX.md`.
   b. Explicitly confirm their assigned files and remind them:
      "⚠️ STRICT MERGE-CONFLICT GUARDRAILS:
       You must ONLY edit your assigned feature components in 'client/src/features/' and your assigned backend handlers.
       NEVER modify App.jsx, Navbar.jsx, server/src/index.js, or other interns' files."
   c. Refer to their group task file:
      - Intern 1 & 2: `docs/03_GROUP1_EVENTS_AND_NOTICES.md`
      - Intern 3 & 4: `docs/04_GROUP2_INVENTORY_AND_SCANNER.md`
      - Intern 5 & 6: `docs/05_GROUP3_CERTIFICATES_STUDIO.md`
   d. Ask:
      "Are you working on:
       [1] Core Mandatory Requirements (P0 Must-Haves)
       [2] Self-Implemented Bonus Features (P1 Add-Ons)
       Tell me which specific feature from your checklist you want to build right now!"
   e. Guide them step-by-step, generating code that strictly conforms to the project's Cyber Theme:
      - Backgrounds: Dark Cyber Navy (#070B19, #0D1527)
      - Accents: Electric Cyan (#38BDF8), Deep Blue (#2563EB), Neon Emerald (#10B981), Amber (#F59E0B)
      - Icons: Lucide React only
      - Tailwind CSS utility classes
      - API response standard: { success: boolean, message: string, data?: any }
```

---

## 📚 Modular Documentation Directory

To make reading quick, focused, and easy, documentation has been separated into dedicated modular guides:

| Guide | Description | Target Audience |
| :--- | :--- | :--- |
| [**01. Onboarding & Setup**](./docs/01_ONBOARDING_AND_SETUP.md) | 1-command setup, ports, dependencies, and offline mock engine. | **All Interns** |
| [**02. File Ownership Matrix**](./docs/02_FILE_OWNERSHIP_MATRIX.md) | Strict 1:1 file boundaries to guarantee zero merge conflicts. | **All Interns** |
| [**03. Group 1: Events & Notices**](./docs/03_GROUP1_EVENTS_AND_NOTICES.md) | 3D Hero, Event Cards, Registration Modal, and Circulars. | **Intern 1 & 2** |
| [**04. Group 2: Hardware & Scanner**](./docs/04_GROUP2_INVENTORY_AND_SCANNER.md) | Hardware Catalog, Barcodes, AI Vision Scanner, and Issue Cart. | **Intern 3 & 4** |
| [**05. Group 3: Certificates Studio**](./docs/05_GROUP3_CERTIFICATES_STUDIO.md) | Template Ingestion, CSV Parser, Canvas Editor, PDF Engine, Verify. | **Intern 5 & 6** |
| [**06. API Reference**](./docs/06_API_REFERENCE.md) | Complete REST API endpoint contracts and request/response shapes. | **All Interns** |
| [**07. Git Flow & Conflict Guide**](./docs/07_GIT_WORKFLOW_AND_CONFLICTS.md) | 5 conflict prevention rules, 6-step resolution, and safe aborts. | **All Interns** |
| [**08. Troubleshooting & FAQs**](./docs/08_TROUBLESHOOTING_AND_FAQS.md) | Instant solutions for PowerShell, ports, stash, and mock data. | **All Interns** |

---

## ⚡ 1-Minute Quick Start

```bash
# 1. Clone & enter repository
git clone https://github.com/TechnoForum-BIAS/Techno-website.git
cd Techno-website

# 2. Checkout your dedicated personal branch:
# Intern 1: git checkout feat/intern1-hero-events
# Intern 2: git checkout feat/intern2-registration-notices
# Intern 3: git checkout feat/intern3-catalog-barcodes
# Intern 4: git checkout feat/intern4-scanner-cart
# Intern 5: git checkout feat/intern5-template-csv
# Intern 6: git checkout feat/intern6-canvas-pdf-engine

# 3. Install & run
npm run install:all
npm run dev
```

* **Client**: [http://localhost:5173](http://localhost:5173)  
* **Backend API**: [http://localhost:5000](http://localhost:5000)
