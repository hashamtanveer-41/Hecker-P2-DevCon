
```

/api/v1

```

### Required Headers

```

Authorization: Bearer <JWT>
X-Hospital-ID: <uuid>
Content-Type: application/json

```

### Standard Response Envelope

```json
{
    "success": true,
    "data": {},
    "errors": null,
    "meta": {
        "timestamp": "2026-02-10T12:00:00Z"
    }
}
```

---

## 3. Authentication & Security (WebAuthn + JWT)

### Register Biometric Credential

```
POST /auth/webauthn/register/options
POST /auth/webauthn/register/verify
```

**Sample Verify Response**

```json
{
    "success": true,
    "data": {
        "jwt": "eyJhbGciOiJIUzI1NiIsInR..."
    }
}
```

### Login with Biometrics

```
POST /auth/webauthn/login/options
POST /auth/webauthn/login/verify
```

### Session Audit

```
GET /auth/audit-logs
```

---

## 4. Multi-Tenant Hospital Management

### Create Hospital

```
POST /hospitals
```

**Request**

```json
{
    "name": "NUST Teaching Hospital",
    "location": "Islamabad"
}
```

**Response**

```json
{
    "id": "hosp_001",
    "name": "NUST Teaching Hospital"
}
```

---

## 5. Operating Rooms (ORs)

```
GET  /operating-rooms
POST /operating-rooms
```

**Request**

```json
{
    "name": "OR-Cardiac-1",
    "type": "cardiac",
    "capabilities": ["bypass", "angioplasty"]
}
```

---

## 6. Staff Management (Surgeons, Nurses, Anesthesiologists)

```
GET  /staff
POST /staff
```

**Request**

```json
{
    "name": "Dr. Ayesha Khan",
    "specialization": "Cardiac Surgery",
    "max_hours_per_day": 12
}
```

**Response**

```json
{
    "id": "staff_123",
    "workload_today": 6
}
```

---

## 7. Surgery Request Management

```
GET  /surgery-requests
POST /surgery-requests
```

**Request**

```json
{
    "patient_name": "Ali Raza",
    "procedure": "Coronary Artery Bypass",
    "complexity_level": 5,
    "priority": "URGENT",
    "required_specialization": "Cardiac Surgery",
    "estimated_duration_minutes": 240,
    "equipment_required": ["Heart-Lung Machine"],
    "anesthesia_type": "General"
}
```

**Response**

```json
{
    "id": "surg_req_789",
    "status": "PENDING"
}
```

### Bulk Import

```
POST /surgery-requests/bulk-import
```

---

## 8. Intelligent Scheduler Engine

### Generate Optimal Schedule

```
POST /scheduler/run
```

**Response**

```json
{
    "schedule": [
        {
            "surgery_id": "surg_req_789",
            "or_id": "or_001",
            "start_time": "2026-02-11T08:00:00Z",
            "end_time": "2026-02-11T12:00:00Z"
        }
    ],
    "optimality_score": 0.94,
    "soft_violations": ["Preferred surgeon unavailable"]
}
```

### Emergency Override

```
POST /scheduler/emergency
```

**Request**

```json
{
    "surgery_request_id": "surg_req_999"
}
```

**Response**

```json
{
    "rescheduled": true,
    "affected_surgeries": 3
}
```

---

## 9. Priority Queue & Waitlist

```
GET /priority-queue
```

**Response**

```json
[
    {
        "surgery_id": "surg_req_999",
        "priority": "EMERGENCY",
        "deadline_hours": 2
    }
]
```

Automatic escalation is applied based on wait time.

---

## 10. Calendar & Drag-and-Drop Scheduling

```
GET   /calendar/day
PATCH /schedule/{surgery_id}/reschedule
```

**Reschedule Request**

```json
{
    "new_start_time": "2026-02-11T10:00:00Z"
}
```

**Conflict Response**

```json
{
    "success": false,
    "errors": [
        {
            "type": "HARD_CONSTRAINT",
            "message": "Required equipment not sterilized"
        }
    ]
}
```

---

## 11. Equipment & Resource Management

```
GET  /equipment
POST /equipment
```

**Request**

```json
{
    "name": "Heart-Lung Machine",
    "sterilization_cycle_hours": 3
}
```

### Sterilization Scheduling

```
POST /equipment/{id}/sterilize
```

---

## 12. Real-Time Notifications

### WebSocket

```
wss://api.example.com/ws/notifications
```

**Event Payload**

```json
{
    "event": "EMERGENCY_CREATED",
    "surgery_id": "surg_req_999"
}
```

---

## 13. Search, Filters & Export

```
GET /search/surgeries?priority=EMERGENCY
GET /export/surgeries?format=csv
```

Supports pagination for 10,000+ records.

---

## 14. Offline-First Sync APIs

### Initial Sync

```
GET /sync/bootstrap
```

### Push Offline Changes

```
POST /sync/push
```

**Conflict Resolution**

```json
{
    "conflict": true,
    "resolution_strategy": "SERVER_WINS"
}
```

Encrypted local storage using Web Crypto API.

---

## 15. Access Control Summary

| Feature              | ADMIN |
| -------------------- | ----- |
| Hospital Management  | ✅    |
| Staff Management     | ✅    |
| Scheduling           | ✅    |
| Emergency Override   | ✅    |
| Equipment Management | ✅    |
| Audit Logs           | ✅    |

---

## 16. Non-Functional Guarantees

- FIDO2-compliant biometric authentication
- Real-time conflict detection
- Intelligent constraint satisfaction
- Emergency-safe cascade rescheduling
- Offline access with secure sync

---

**End of API Specification**
