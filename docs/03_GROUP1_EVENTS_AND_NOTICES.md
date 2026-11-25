# 👥 Group 1 Implementation Guide: Landing Experience, Events & Notices
**Group Domain**: 3D Visuals, Hackathons, Team Registration & Circulars  
**Assigned Interns**: Intern 1 & Intern 2

---

## 1. Intern 1 Ownership & Tasks
* **Dedicated Branch**: `feat/intern1-hero-events`
* **Assigned Files**:
  * `client/src/components/Hero3D.jsx`
  * `client/src/features/group1_events/EventCard.jsx`
  * `server/src/routes/events.routes.js`

### ✅ Must-Have Core Requirements (P0):
1. **Interactive 3D Visual Mesh (`Hero3D.jsx`)**:
   - Initialize a Three.js scene featuring a glowing geometric wireframe mesh (Icosahedron or Torus Knot in `#38BDF8` cyan and `#2563EB` blue).
   - Implement mouse cursor tracking: rotate the mesh smoothly with damping as the cursor moves across the viewport.
   - Auto-pause the animation loop when scrolled out of view using `IntersectionObserver`.
2. **Dynamic Event Card (`EventCard.jsx`)**:
   - Receive `event` object and `onRegister` callback as props.
   - Display category badges with distinctive cyber colors:
     - Hackathon: `bg-cyan-950/60 text-cyan-400 border border-cyan-800`
     - Robotics: `bg-purple-950/60 text-purple-400 border border-purple-800`
     - Workshop: `bg-blue-950/60 text-blue-400 border border-blue-800`
     - Coding: `bg-emerald-950/60 text-emerald-400 border border-emerald-800`
   - Render formatted Date, Time, Venue, and Capacity counters.
   - Connect "Register Participation" trigger button to execute `onRegister(event)`.

### 💡 Self-Implemented Add-On Ideas (P1 Bonus):
* **Add-On 1.1**: Real-time ticking `DD : HH : MM : SS` countdown badge for upcoming flagship hackathons.
* **Add-On 1.2**: 1-click Google Calendar / `.ics` export button.
* **Add-On 1.3**: Social share button with pre-filled title and link.

---

## 2. Intern 2 Ownership & Tasks
* **Dedicated Branch**: `feat/intern2-registration-notices`
* **Assigned Files**:
  * `client/src/features/group1_events/EventRegistrationModal.jsx`
  * `client/src/pages/AnnouncementsPage.jsx`
  * `server/src/controllers/events.controller.js`

### ✅ Must-Have Core Requirements (P0):
1. **Participation & Team Registration Engine (`EventRegistrationModal.jsx`)**:
   - Input validation:
     - Student Full Name (`required`)
     - University Roll Number (`required`, e.g. `230101`)
     - College Email (`email`, `required`)
     - WhatsApp Phone Number (`tel`, 10 digits)
     - Team Size / Member Names (`textarea` or tag chips)
   - Auto-fill student profile details if logged in (`user.name`, `user.rollNumber`, `user.email`).
   - Connect form submission to `POST /api/events/register`. Show animated checkmark confirmation on success.
2. **Society Notices & Circulars (`AnnouncementsPage.jsx`)**:
   - Connect to `GET /api/announcements`.
   - Ensure high-resolution flyer image previews open with zoom view modals.

### 💡 Self-Implemented Add-On Ideas (P1 Bonus):
* **Add-On 2.1**: Downloadable digital event pass with student roll number, event title, and generated QR code pass.
* **Add-On 2.2**: Duplicate registration prevention by verifying roll number against event roster before submitting.

---

## 3. Related API Contracts
* `GET /api/events` — Returns all active events list.
* `POST /api/events/register` — Body: `{ eventId, studentName, rollNumber, email, phone, teamMembers }`
* `GET /api/announcements` — Returns society circulars and notices.
