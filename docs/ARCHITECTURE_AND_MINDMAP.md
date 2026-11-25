# 🏗️ Technoforum BIAS: Industry Architecture & Mind Map
### System Design, Data Models, Workflows & Engineering Protocols

This document serves as the **Master Engineering Architecture Blueprint** for the Technoforum Centralized Platform. All 6 interns and group leads should study these diagrams to understand how their assigned micro-modules interconnect.

---

## 1. High-Level System Architecture

```mermaid
flowchart TD
    subgraph ClientTier ["Frontend Tier (Client - React + Vite + Tailwind CSS)"]
        UI["Cyberpunk UI (#070B19, #0D1527, #38BDF8)"]
        ThreeJS["Hero3D (Three.js Visual Core)"]
        AuthContext["Auth Context & Session Manager"]
        CartContext["Hardware Loan Cart"]
        CertStudioCanvas["Interactive Canvas Placeholder Editor"]
    end

    subgraph GatewayTier ["Backend API Gateway (Server - Node.js + Express)"]
        Router["Express API Router (/api)"]
        RateLimiter["express-rate-limit (Brute Force Guard)"]
        AuthGuard["JWT & RBAC Middleware (admin | coordinator | user)"]
        Multer["Multer (Template & Flyer Uploads)"]
        PdfEngine["pdf-lib Vector PDF Engine"]
        ZipEngine["archiver (Batch ZIP Packaging)"]
        BarcodeEngine["bwip-js (Code-128 & QR Generator)"]
        FallbackMock["Local Mock In-Memory Store (Offline Dev)"]
    end

    subgraph ServiceTier ["External Services & Database"]
        SupabaseDB[("Supabase PostgreSQL DB")]
        BrevoSMTP["Brevo SMTP (6-Digit OTP & Password Reset)"]
        GoogleOAuth["Google Identity Services (GSI)"]
        GeminiVision["Google Gemini Vision AI (Component Scanner)"]
    end

    UI --> Router
    ThreeJS --> UI
    AuthContext --> UI
    CartContext --> UI
    CertStudioCanvas --> UI

    Router --> RateLimiter
    RateLimiter --> AuthGuard
    AuthGuard --> Multer
    AuthGuard --> PdfEngine
    AuthGuard --> ZipEngine
    AuthGuard --> BarcodeEngine

    AuthGuard --> SupabaseDB
    AuthGuard -.-> FallbackMock
    AuthGuard --> BrevoSMTP
    AuthGuard --> GoogleOAuth
    AuthGuard --> GeminiVision
```

---

## 2. Database Entity-Relationship Diagram (ERD)

The relational schema created by `database/supabase_schema.sql`:

```mermaid
erDiagram
    users ||--o{ event_registrations : registers
    users ||--o{ inventory_transactions : borrows
    users ||--o{ events : creates
    events ||--o{ event_registrations : contains
    inventory_items ||--o{ inventory_tracked_units : owns
    inventory_items ||--o{ inventory_transactions : logged_in
    inventory_tracked_units ||--o{ inventory_transactions : tracked_by

    users {
        UUID id PK
        VARCHAR name
        VARCHAR email UK
        VARCHAR roll_number UK
        VARCHAR password_hash
        VARCHAR role "user | coordinator | admin"
        BOOLEAN is_verified
        VARCHAR auth_provider "local | google"
        TEXT avatar_url
        TIMESTAMP created_at
    }

    events {
        UUID id PK
        VARCHAR title
        VARCHAR category
        DATE date
        VARCHAR venue
        TEXT description
        INTEGER max_participants
        VARCHAR status "upcoming | ongoing | completed"
        UUID created_by FK
        TIMESTAMP created_at
    }

    event_registrations {
        UUID id PK
        UUID event_id FK
        VARCHAR student_name
        VARCHAR roll_number
        VARCHAR email
        VARCHAR phone
        JSONB team_members
        TIMESTAMP registered_at
    }

    inventory_items {
        UUID id PK
        VARCHAR name
        VARCHAR category
        INTEGER quantity_total
        INTEGER quantity_available
        VARCHAR unit
        VARCHAR serial_prefix
        VARCHAR status "available | maintenance | out_of_stock"
        TIMESTAMP created_at
    }

    inventory_tracked_units {
        UUID id PK
        UUID item_id FK
        VARCHAR serial_number UK
        VARCHAR condition "working | damaged | missing"
        TIMESTAMP created_at
    }

    inventory_transactions {
        UUID id PK
        UUID item_id FK
        VARCHAR serial_number
        VARCHAR student_roll_number
        VARCHAR student_name
        DATE issue_date
        DATE return_deadline
        DATE actual_return_date
        VARCHAR status "issued | returned | overdue | missing"
        VARCHAR condition_on_return
        UUID approved_by FK
    }

    certificates {
        UUID id PK
        VARCHAR certificate_id UK
        VARCHAR student_name
        VARCHAR roll_number
        VARCHAR event_title
        VARCHAR position
        DATE issue_date
        VARCHAR file_url
        VARCHAR status
        TIMESTAMP created_at
    }

    announcements {
        UUID id PK
        VARCHAR title
        TEXT content
        VARCHAR category
        VARCHAR flyer_url
        BOOLEAN is_pinned
        TIMESTAMP created_at
    }
```

---

## 3. Modular Engineering Mind Maps

### Module A: Authentication, RBAC & Role Management
```mermaid
flowchart LR
    A["New User Sign Up / Google OAuth"] --> B{"Is Official Admin Email?"}
    B -- Yes --> C["Role = admin"]
    B -- No --> D["Role = user (Student Member)"]
    D --> E["Student Dashboard (/profile)"]
    C --> F["Admin Hub & Users Directory (/admin/users)"]
    F --> G["Admin Dropdown Role Upgrade"]
    G --> H["Promote to Coordinator or Admin in Supabase"]
```

### Module B: Smart Hardware & AI Vision Scanner
```mermaid
flowchart TD
    Step1["Student takes phone photo of components on lab workbench"] --> Step2["Client sends Base64 image to /api/inventory/scan-ai"]
    Step2 --> Step3["Google Gemini Vision API identifies components (resistors, ICs, sensors)"]
    Step3 --> Step4["Client renders detected component cards with count adjusters"]
    Step4 --> Step5["1-Click: Add Detected Components to Issue Cart"]
    Step5 --> Step6["Checkout: Assigns unique serials (BIAS-EXT-001) to Student Roll No"]
    Step6 --> Step7["Coordinator audits return: Marks working, damaged, or missing"]
```

### Module C: E-Certificate Studio Engine
```mermaid
flowchart LR
    T["1. Base Template (PNG/PDF)"] & C["2. Student Roster (CSV)"] --> Canvas["3. Drag & Drop Coordinate Canvas"]
    Canvas --> Calc["4. Coordinate Translation (Web Canvas Top-Left to PDF Bottom-Left)"]
    Calc --> PDF["5. pdf-lib Vector Generation"]
    PDF --> ZIP["6. archiver Bundling into .zip (<CertificateId>.pdf)"]
    ZIP --> DL["7. Direct Download & Public Verification (/certificates/verify)"]
```

---

## 4. Git Collaboration Protocol (Git Flow)

To ensure 6 interns working concurrently do not step on each other's code or create catastrophic merge conflicts, follow this strict Git Flow:

```mermaid
gitGraph
    commit id: "Initial Scaffold"
    branch develop
    checkout develop
    commit id: "Integration Staging"
    
    branch feat/g1-events
    checkout feat/g1-events
    commit id: "feat: add 3D hero tilt"
    commit id: "feat: events registration modal"
    
    checkout develop
    branch feat/g2-inventory
    checkout feat/g2-inventory
    commit id: "feat: barcode sticker print modal"
    commit id: "feat: AI table scanner"
    
    checkout develop
    branch feat/g3-certificates
    checkout feat/g3-certificates
    commit id: "feat: CSV student parser"
    commit id: "feat: batch PDF zip download"
    
    checkout develop
    merge feat/g1-events
    merge feat/g2-inventory
    merge feat/g3-certificates
    
    checkout main
    merge develop tag: "v1.0.0-PROD"
```

### Branching Rules
1. **`main`**: Protected production branch. **Direct pushes are forbidden**.
2. **`develop`**: Central integration branch. All feature branches branch off `develop`.
3. **Feature Branches**:
   - Group 1: `feat/g1-landing-3d`, `feat/g1-events`
   - Group 2: `feat/g2-inventory`, `feat/g2-ai-scanner`
   - Group 3: `feat/g3-certificate-studio`, `feat/g3-verification`

### Conventional Commit Standards
All commits must follow standard prefixes:
* `feat:` A new user-facing feature (e.g., `feat(inventory): add barcode print modal`)
* `fix:` A bug fix (e.g., `fix(auth): handle expired token redirect`)
* `docs:` Documentation changes (e.g., `docs(readme): add setup guide`)
* `style:` Formatting, indentation, missing semi-colons (no code logic change)
* `refactor:` Code restructuring without changing behavior

---

## 5. Definition of Done (DoD) for Pull Requests

Before an intern submits a Pull Request to `develop`, they must verify:
- [ ] Code builds without errors (`npm run build:client` and `node --check server/src/index.js`).
- [ ] No hardcoded passwords, tokens, or personal API keys in the code.
- [ ] All API responses adhere to the standard JSON envelope: `{ success: boolean, message: string, data?: any }`.
- [ ] Responsive design verified on both Desktop (1920x1080) and Mobile (375x667).
- [ ] Dark blue cyber aesthetic maintained (`#070B19`, `#0D1527`, `#38BDF8`).
- [ ] Clear PR description referencing the Group Task ID from `docs/INTERN_TASKS.md`.
