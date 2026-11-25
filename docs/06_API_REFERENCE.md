# 🌐 Technoforum BIAS: Complete REST API Reference

All API endpoints run on `http://localhost:5000` (automatically proxied by Vite via relative `/api` paths). Standard JSON response format:
```json
{
  "success": true,
  "message": "Operation status description",
  "data": {}
}
```

---

## 1. Events API (`server/src/routes/events.routes.js`)

### `GET /api/events`
* **Access**: Public
* **Response**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "evt-001",
        "title": "TechnoHacks 2026: Annual Flagship Hackathon",
        "category": "Hackathon",
        "date": "2026-12-15",
        "time": "10:00 AM - 10:00 PM",
        "venue": "BIAS Auditorium & Lab Complex",
        "maxParticipants": 120,
        "status": "upcoming"
      }
    ]
  }
  ```

### `POST /api/events/register`
* **Access**: Public / Logged In
* **Request Body**:
  ```json
  {
    "eventId": "evt-001",
    "studentName": "Kabir Sharma",
    "rollNumber": "230101",
    "email": "kabir@birlainstitute.co.in",
    "phone": "9876543210",
    "teamMembers": "Aarav (230102), Priya (230142)"
  }
  ```
* **Response**: `{ "success": true, "message": "Registration confirmed", "registrationId": "reg-1732549200" }`

---

## 2. Hardware Inventory API (`server/src/routes/inventory.routes.js`)

### `GET /api/inventory/items`
* **Access**: Public
* **Response**:
  ```json
  {
    "success": true,
    "items": [
      {
        "id": "inv-001",
        "name": "Arduino Uno R3 Dev Board",
        "category": "Microcontrollers",
        "quantityTotal": 25,
        "quantityAvailable": 18,
        "unit": "pcs",
        "serialPrefix": "BIAS-ARD",
        "trackedSerials": ["BIAS-ARD-001", "BIAS-ARD-002", "BIAS-ARD-003"]
      }
    ]
  }
  ```

### `GET /api/inventory/barcode/:serial`
* **Access**: Public
* **Response**: `{ "success": true, "serial": "BIAS-ARD-001", "barcodeBase64": "data:image/png;base64,...", "qrBase64": "data:image/png;base64,..." }`

### `POST /api/inventory/scan-ai`
* **Access**: Public
* **Request Body**: `{ "imageBase64": "data:image/jpeg;base64,..." }`
* **Response**:
  ```json
  {
    "success": true,
    "detectedItems": [
      { "name": "HC-SR04 Ultrasonic Sensor", "count": 2, "confidence": 0.94, "matchedInventoryId": "inv-003" },
      { "name": "10k Ohm Resistors", "count": 5, "confidence": 0.91, "matchedInventoryId": "inv-004" }
    ]
  }
  ```

### `POST /api/inventory/checkout`
* **Access**: Logged In / Public with Roll Number
* **Request Body**:
  ```json
  {
    "rollNumber": "230101",
    "items": [
      { "id": "inv-002", "serialNumber": "BIAS-EXT-002", "quantity": 1 }
    ],
    "returnDeadline": "2026-11-28"
  }
  ```
* **Response**: `{ "success": true, "transactionId": "tx-1732549200", "message": "Equipment checkout completed" }`

---

## 3. E-Certificates API (`server/src/routes/certificates.routes.js`)

### `POST /api/certificates/generate-batch`
* **Access**: Coordinator / Admin
* **Request Body**:
  ```json
  {
    "templateBase64": "data:image/png;base64,...",
    "students": [
      { "Name": "Kabir Sharma", "RollNumber": "230101", "Event": "TechnoHacks 2026", "Position": "Winner" }
    ],
    "mappings": {
      "Name": { "x": 421, "y": 280, "size": 32, "color": "#FFFFFF", "align": "center" }
    }
  }
  ```
* **Response**: Streams binary `application/zip` download.

### `GET /api/certificates/verify?query=:id`
* **Access**: Public
* **Response**:
  ```json
  {
    "success": true,
    "certificate": {
      "certificateId": "TF-2026-981245",
      "studentName": "Kabir Sharma",
      "rollNumber": "230101",
      "eventName": "TechnoHacks 2026",
      "issueDate": "2026-11-25",
      "verified": true
    }
  }
  ```

---

## 4. Announcements & Circulars API (`server/src/routes/announcements.routes.js`)

* `GET /api/announcements` — Public list of notices.
* `POST /api/announcements` — *(Coordinators & Admins)* Create notice.
* `PUT /api/announcements/:id` — *(Coordinators & Admins)* Update notice.
* `DELETE /api/announcements/:id` — *(Coordinators & Admins)* Delete notice.
