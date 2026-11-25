# 👥 Group 1 Implementation Guide: Landing Experience, Events & Notices

**Domain**: Visual 3D Landing Page, Hackathons & Tech Events, Team Registration System & Campus Notices  
**Assigned Interns**: **Intern 1** (Hero, 3D Mesh, Event Cards) & **Intern 2** (Registration Engine, Notices & Announcements)  
**Parent Pages**: `client/src/pages/HomePage.jsx`, `client/src/pages/EventsPage.jsx`, `client/src/pages/AnnouncementsPage.jsx`

---

## 🎯 Executive Overview & User Journey

Group 1 owns the **front door of TechnoForum**. When a student or faculty member visits the website:
1. They are greeted by an interactive, glowing **3D wireframe mesh** that reacts to their mouse movement.
2. They browse **upcoming hackathons, robotics challenges, and workshops** with category badges, dates, venues, and live countdown timers.
3. Clicking **"Register Participation"** opens an interactive modal supporting **solo or multi-member team registrations** with instant validation.
4. In the **Notices section**, visitors read official society circulars, view high-res flyers in a lightbox modal, and search circulars by category.

---

## 1. 🛠️ Intern 1 Ownership & Tasks

* **Assigned Branch**: `feat/intern1-hero-events`
* **Owned Files**:
  * `client/src/components/Hero3D.jsx` (Interactive Three.js Canvas)
  * `client/src/features/group1_events/EventCard.jsx` (Dynamic Event Card)
  * `server/src/routes/events.routes.js` (Events REST Route)

### 📌 Task 1.1: Interactive 3D Cyber Mesh (`Hero3D.jsx`)
* **Objective**: Render a lightweight, responsive 3D geometric shape (Icosahedron or Torus Knot) using Three.js that floats seamlessly behind the landing page hero copy.
* **Step-by-Step Implementation**:
  1. **Canvas Initialization**:
     * In a `useEffect` hook, initialize a `THREE.Scene`, `THREE.PerspectiveCamera`, and `THREE.WebGLRenderer` with `{ alpha: true, antialias: true }`.
     * Attach the renderer DOM element to a container `div` referenced via `useRef`.
  2. **Geometry & Glowing Wireframe Material**:
     * Create an `IcosahedronGeometry(2.2, 2)` or `TorusKnotGeometry(1.5, 0.4, 100, 16)`.
     * Use `MeshStandardMaterial` or `MeshBasicMaterial` with `{ wireframe: true, color: 0x38BDF8 }` (Cyan) with a secondary inner mesh or point light colored `0x2563EB` (Blue).
  3. **Mouse Tracking & Damping**:
     * Add a `mousemove` listener to `window`. Record normalized cursor coordinates: `mouseX = (e.clientX / window.innerWidth) * 2 - 1`.
     * In the `requestAnimationFrame` loop, gently interpolate mesh rotation toward cursor position:
       ```javascript
       mesh.rotation.y += (targetRotationY - mesh.rotation.y) * 0.05;
       mesh.rotation.x += (targetRotationX - mesh.rotation.x) * 0.05;
       ```
  4. **Performance & Viewport Optimization**:
     * Use `IntersectionObserver` to pause the animation loop when the user scrolls past the hero section to keep CPU/GPU usage at 0%.
     * Handle window resizing via `window.addEventListener('resize', onResize)`.
* **Expected Output**: A smooth, glowing 60fps cyan/blue wireframe structure floating behind the "Ignite Innovation" hero text that rotates as the visitor moves their mouse.

---

### 📌 Task 1.2: Dynamic Event Card (`EventCard.jsx`)
* **Objective**: Build a modular, interactive card representing an event with real-time metadata.
* **Component Props**:
  * `event`: `{ id, title, category, date, time, venue, description, maxParticipants, bannerUrl, status }`
  * `onRegister`: Callback function invoked when user clicks the register button.
* **Step-by-Step Implementation**:
  1. **Category Pills**: Render distinctive cyber badge styles based on `event.category`:
     * Hackathon: `bg-cyan-950/60 text-cyan-400 border border-cyan-800`
     * Robotics: `bg-purple-950/60 text-purple-400 border border-purple-800`
     * Workshop: `bg-blue-950/60 text-blue-400 border border-blue-800`
     * Coding: `bg-emerald-950/60 text-emerald-400 border border-emerald-800`
  2. **Status Badge**: Show `Upcoming` (green) or `Ongoing` (amber) with pulse animation.
  3. **Event Metadata Grid**:
     * Formatted Date & Time with `Calendar` icon.
     * Venue name with `MapPin` icon.
     * Registered vs Max Capacity indicator with `Users` icon.
  4. **Action Trigger**: "Register Participation" button with hover glow (`bg-brand-blue hover:bg-blue-600 glow-blue`).
* **Expected Output**: A glassmorphic card with dark cyber styling (`#0D1527`), crisp typography, truncated 3-line description, and a responsive register button.

---

### 🌟 Intern 1 Bonus / Add-On Enhancements (P1 Distinction)
* **Live Ticking Countdown Timer**: If `event.date` is in the future, display a real-time `DD : HH : MM : SS` countdown badge on the card using a `setInterval` hook.
* **Google Calendar / .ics Export**: Add a small calendar icon button on the card that opens a pre-filled Google Calendar URL:
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formattedDate}&details=${description}&location=${venue}`.
* **Category Filter Bar**: In `EventsPage.jsx`, add 1-click filter tabs: `[All]`, `[Hackathons]`, `[Robotics]`, `[Workshops]`.

---

## 2. 🛠️ Intern 2 Ownership & Tasks

* **Assigned Branch**: `feat/intern2-registration-notices`
* **Owned Files**:
  * `client/src/features/group1_events/EventRegistrationModal.jsx` (Registration Engine)
  * `client/src/pages/AnnouncementsPage.jsx` (Society Notices Hub)
  * `server/src/controllers/events.controller.js` (Event Registration API Logic)

### 📌 Task 2.1: Event Registration Engine (`EventRegistrationModal.jsx`)
* **Objective**: An interactive modal allowing individual or team registrations for any event, with instant client-side validation and feedback.
* **Component Props**:
  * `event`: Selected event object.
  * `isOpen`: Boolean.
  * `onClose`: Callback function to close modal.
* **Step-by-Step Implementation**:
  1. **Form Fields**:
     * **Full Name** (`text`, required)
     * **University Roll Number** (`text`, required, e.g. `230101` — regex: `/^\d{6}$/`)
     * **College Email** (`email`, required, e.g. `student@birlainstitute.co.in`)
     * **WhatsApp Contact Number** (`tel`, 10 digits)
     * **Registration Type Toggle**: Radio pill between `Solo Participant` and `Team Registration`.
     * **Dynamic Team Members Section**: If "Team" is selected, allow adding up to 3 teammate names and roll numbers dynamically.
  2. **Auto-Fill for Logged-In Users**:
     * Import `useAuth()`. If `user` exists in context, auto-populate Name, Email, and Roll Number so students don't re-type them!
  3. **API Submission**:
     * On submit, send `POST /api/events/register` with JSON payload:
       ```json
       {
         "eventId": "evt-001",
         "studentName": "Aarav Sharma",
         "rollNumber": "230101",
         "email": "aarav@birlainstitute.co.in",
         "phone": "9876543210",
         "teamMembers": ["Priya Verma (230142)", "Rohan Joshi (230115)"]
       }
       ```
  4. **Success State**: Display an animated green checkmark with a confirmation badge: *"Registration Confirmed! Your pass has been recorded."*
* **Expected Output**: A clean, accessible modal with blur backdrop, validation error messages, and loading states on submit.

---

### 📌 Task 2.2: Campus Notices & Circulars Viewer (`AnnouncementsPage.jsx`)
* **Objective**: Display all official department circulars, lab guidelines, and recruitment alerts with search, category filters, and flyer modal previews.
* **Step-by-Step Implementation**:
  1. **Fetch Notices**: Call `GET /api/announcements` on page mount.
  2. **Pinned Notice Callout**: Give pinned notices (`is_pinned: true`) a prominent gold/cyan border and badge at the top of the feed.
  3. **Flyer Lightbox Modal**: When clicking an announcement flyer thumbnail, open a full-resolution modal preview with a download button.
  4. **Search & Filter**: Provide search by notice title/content and filter by category (`All`, `Hackathons`, `Lab Rules`, `Recruitment`).
* **Expected Output**: A responsive bulletin board page showing notices in chronological order, with high-res flyer image zoom and category filtering.

---

### 🌟 Intern 2 Bonus / Add-On Enhancements (P1 Distinction)
* **Downloadable Digital Event Pass**: On successful registration, offer a "Download Event Pass" button generating a small PNG ticket containing event title, student roll number, and a QR code with `canvas`.
* **Duplicate Registration Guard**: Verify if the student's roll number is already registered for this event; if so, show a helpful message: *"You are already registered for this event!"*.

---

## 3. 📡 API Contract Reference

### `GET /api/events`
* **Response**:
  ```json
  {
    "success": true,
    "count": 3,
    "events": [
      {
        "id": "evt-001",
        "title": "TechnoHacks 2026: Flagship Hackathon",
        "category": "Hackathon",
        "date": "2026-12-15",
        "time": "10:00 AM - 10:00 PM",
        "venue": "BIAS Auditorium & Lab Complex",
        "description": "36-hour non-stop innovation sprint solving real campus challenges.",
        "maxParticipants": 120,
        "status": "upcoming"
      }
    ]
  }
  ```

### `POST /api/events/register`
* **Request Body**:
  ```json
  {
    "eventId": "evt-001",
    "studentName": "Aarav Sharma",
    "rollNumber": "230101",
    "email": "aarav@birlainstitute.co.in",
    "phone": "9876543210",
    "teamMembers": ["Priya Verma (230142)"]
  }
  ```
* **Response**:
  ```json
  {
    "success": true,
    "message": "Successfully registered for TechnoHacks 2026",
    "registrationId": "reg-1795600000"
  }
  ```

---

## 4. 🧪 Local Testing & Verification Checklist

1. [ ] Run `npm run dev` in the project root.
2. [ ] Open `http://localhost:5173`. Verify the 3D mesh loads smoothly behind the hero copy and moves with your mouse.
3. [ ] Navigate to `/events`. Verify that all sample events render with appropriate category colors.
4. [ ] Click "Register Participation". Verify modal opens, accepts roll number, validates inputs, and submits successfully.
5. [ ] Navigate to `/announcements`. Verify that pinned notices appear first and clicking a flyer opens the lightbox preview.
