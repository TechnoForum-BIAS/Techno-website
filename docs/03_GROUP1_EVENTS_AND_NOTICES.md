# 👥 Group 1 Implementation Guide: Landing Experience, Events & Notices

**Domain**: Official 3D Society Emblem, Flagship Event Spotlight, Dynamic Event Form Builder, Roster CSV Export & Campus Notice Ticker  
**Assigned Interns**: **Intern 1** (Hero 3D Emblem, Event Cards, Countdown & Ticker) & **Intern 2** (Dynamic Form Builder, Roster Table, CSV Exporter & Notice CRUD)  
**Parent Pages**: `client/src/pages/HomePage.jsx`, `client/src/pages/EventsPage.jsx`, `client/src/pages/AnnouncementsPage.jsx`

---

## 🎯 Executive Overview & User Journey

Group 1 owns the **visual identity and event management engine of TechnoForum**:
1. **Interactive 3D Circuit Emblem**: Visitors are greeted by the official TechnoForum circuit logo rendered as a 3D rotating emblem tracking the mouse cursor in real time.
2. **Breaking Notice Ticker**: A live, glowing cyber ticker bar at the top of the homepage showcases urgent campus notices with 1-click full details.
3. **Flagship Event Showcase**: A prominent countdown spotlight banner for the annual hackathon + a 3-card grid of upcoming events with category badges, venues, deadlines, and prize pools.
4. **Dynamic Registration Form Builder**: Coordinators and admins can design custom event registration forms (Solo vs. Team, custom questions, GitHub links), publish them per event, view isolated registration rosters, export them to **CSV in 1 click**, and clear/delete event records to save database storage.
5. **Streamlined Registration**: Students can register with 1-click auto-fill if logged in, or as guests. On submit, an instant on-screen success receipt is displayed without consuming email quota.

---

## 🖼️ Official Brand Assets & Logo Locations

The official TechnoForum circuit logos are saved in `client/public/assets/`:
* `/assets/logo-dark.jpg` — Glowing cyan circuit emblem on deep blue (Primary for 3D & Navbar)
* `/assets/logo-white.jpg` — Clean black circuit emblem on white (For print & light badges)
* `/assets/logo-split.jpg` — The iconic split black & white TechnoForum emblem

---

## 1. 🛠️ Intern 1 Ownership & Tasks

* **Assigned Branch**: `feat/intern1-hero-events`
* **Owned Files**:
  * `client/src/components/Hero3D.jsx` (Interactive 3D Emblem Canvas)
  * `client/src/features/group1_events/EventCard.jsx` (Dynamic Event Card)
  * `client/src/components/NoticeTickerBar.jsx` (Breaking Notice Ticker Bar)
  * `client/src/pages/HomePage.jsx` (Flagship Spotlight & Event Grid)

### 📌 Task 1.1: Interactive 3D TechnoForum Circuit Emblem (`Hero3D.jsx`)
* **Objective**: Render an interactive 3D floating emblem of the official TechnoForum circuit logo using Three.js that tilts smoothly as the visitor moves their mouse.
* **Step-by-Step Implementation**:
  1. **Three.js Scene Setup**:
     * In a `useEffect` hook, create `THREE.Scene`, `THREE.PerspectiveCamera`, and `THREE.WebGLRenderer` with `{ alpha: true, antialias: true }`.
     * Attach renderer canvas to a container `div` referenced via `useRef`.
  2. **3D Circuit Texture Plane / Emblem Geometry**:
     * Load the official texture: `new THREE.TextureLoader().load('/assets/logo-dark.jpg')`.
     * Create a rounded cylinder emblem or double-sided plane geometry: `new THREE.PlaneGeometry(3.5, 3.5)`.
     * Add an outer glowing ring or wireframe torus geometry (`THREE.TorusGeometry(2.2, 0.05, 16, 100)`) in brand cyan (`#38BDF8`).
  3. **Mouse Tracking & Smooth Damping**:
     * Track window mouse position: `targetRotationY = mouseX * 0.4`, `targetRotationX = -mouseY * 0.4`.
     * In the `requestAnimationFrame` loop, apply damping:
       ```javascript
       mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;
       mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
       ```
  4. **Performance Optimization**:
     * Use `IntersectionObserver` to pause rendering when the user scrolls past the hero section.

---

### 📌 Task 1.2: Flagship Spotlight & Event Cards (`EventCard.jsx`)
* **Objective**: Build the homepage event showcase featuring a flagship countdown banner + a 3-card grid of upcoming events.
* **Component Requirements**:
  1. **Flagship Countdown Banner**:
     * Prominently display the next major hackathon with a live ticking countdown timer (`DD : HH : MM : SS`).
  2. **Event Card Metadata**:
     * Category badge: Hackathon (`cyan`), Robotics (`purple`), Workshop (`blue`), Coding (`emerald`).
     * Date, Time, Venue, Registration Deadline, and Entry Type ("Free" or Prize Pool).
     * "Register" action button triggering the registration modal.

---

### 📌 Task 1.3: Campus Notice Ticker Bar (`NoticeTickerBar.jsx`)
* **Objective**: A sleek, animated breaking circulars ticker at the top of the homepage.
* **Behavior**:
  * Shows the latest urgent notices in an animated marquee or carousel.
  * Clicking any notice item opens a slide-over drawer or modal displaying the complete circular text and flyer.

---

## 2. 🛠️ Intern 2 Ownership & Tasks

* **Assigned Branch**: `feat/intern2-registration-notices`
* **Owned Files**:
  * `client/src/features/group1_events/EventFormBuilderModal.jsx` (Custom Registration Form Builder)
  * `client/src/features/group1_events/EventRegistrationModal.jsx` (Student Registration Form)
  * `client/src/features/group1_events/EventRosterModal.jsx` (Isolated Roster & CSV Downloader)
  * `client/src/components/NoticeModal.jsx` (Notice CRUD Modal)
  * `server/src/controllers/events.controller.js` (Form Schemas & Registration Endpoints)

### 📌 Task 2.1: Custom Event Registration Form Builder (`EventFormBuilderModal.jsx`)
* **Objective**: Allow coordinators and admins to create dynamic, tailored registration forms for different events (e.g. Solo vs. Team, custom questions, GitHub links).
* **Step-by-Step Implementation**:
  1. **Template Selection**:
     * Preset templates: `Standard Solo Form`, `Hackathon Team Form (2-4 Members)`, `Workshop Feedback Form`.
  2. **Dynamic Field Builder**:
     * Allow coordinators to toggle or add custom fields:
       * Team Name & Teammates (names + roll numbers)
       * GitHub / Portfolio URL
       * Year & Branch selection
       * Short answer questions (e.g. *"What is your tech stack?"*)
  3. **Publish Schema**:
     * Saves the form schema to the event record (`custom_form_schema` JSON in database).

---

### 📌 Task 2.2: Student Event Registration Modal (`EventRegistrationModal.jsx`)
* **Objective**: Dynamically render the form designed by the coordinator for that specific event.
* **Behavior**:
  * Auto-populates student details (Name, Email, Roll Number) if the user is logged in.
  * Allows guests to enter details manually if not logged in.
  * Validates all required fields according to the event's custom schema.
  * On submit, saves the registration and shows an **instant on-screen confirmation receipt** (no SMTP email sent, preserving email quotas).

---

### 📌 Task 2.3: Isolated Event Roster & CSV Export (`EventRosterModal.jsx`)
* **Objective**: Allow coordinators to inspect registered participants for any event in an isolated table, download a clean CSV, and clear records to save space.
* **Key Actions**:
  1. **View Roster**: Table showing registered students, roll numbers, submission time, and custom answers.
  2. **1-Click Download CSV**: Export the entire participant list for that event as a `.csv` file.
  3. **Delete Roster / Clear Storage**: A "Clear Event Registrations" button with a confirmation prompt allowing coordinators to purge registration data once an event concludes to conserve database space.

---

### 📌 Task 2.4: Notice Management (CRUD) (`NoticeModal.jsx`)
* **Objective**: Provide full CRUD for campus notices with calendar date picking, time selection, priority, category, audience, and pin-to-top.
* **Permissions**: Accessible only to users with role `coordinator` or `admin`.

---

## 3. 📡 API Contract Reference

### `GET /api/events`
* Returns all active events with their custom form schemas and registration counts.

### `POST /api/events/:id/register`
* **Request Body**:
  ```json
  {
    "studentName": "Aarav Sharma",
    "email": "aarav@birlainstitute.co.in",
    "rollNumber": "230101",
    "isGuest": false,
    "formResponses": {
      "teamName": "CyberKnights",
      "teamMembers": ["Priya Verma (230142)", "Rohan Joshi (230115)"],
      "githubUrl": "https://github.com/aarav"
    }
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Registration confirmed successfully! See you at the event.",
    "registrationId": "reg-1795600123"
  }
  ```

### `GET /api/events/:id/roster/export-csv`
* Returns a downloadable `.csv` file containing all registered students and their form responses for that event.

### `DELETE /api/events/:id/roster`
* Purges all registration records for the specified event to free database space.

---

## 4. 🧪 Local Testing & Verification Checklist

1. [ ] Start dev servers (`npm run dev`).
2. [ ] Open `http://localhost:5173`. Verify the 3D circuit emblem rotates smoothly tracking your cursor.
3. [ ] Check the top notice ticker bar: click an alert to view full circular details.
4. [ ] Check the Flagship countdown timer: verify `DD : HH : MM : SS` updates every second.
5. [ ] Log in as coordinator/admin. Click "+ Add Event Form" to configure fields for a new hackathon.
6. [ ] Register for the event: verify auto-fill works for logged-in students and guests can type manually.
7. [ ] In coordinator view, open the event roster: verify participant data displays, click "Export CSV" to verify file download, and test clearing records.
