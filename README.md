# 🏥 Hospital Operating Room Scheduler &  Intelligent Conflict Resolution

A full-stack web-based platform engineered to manage, optimize, and intelligently schedule hospital operating rooms while preventing conflicts and enforcing priority-based surgical allocation.

Built for Webathon 2026 – Devcon-MCS,NUST

---

# 🔐 SYSTEM ACCESS FLOW

## 1️⃣ LOGIN MODULE

The system begins at the `/login` route.

### Features:
- Email authentication
- Password authentication
- Biometric login option (UI supported)
- Secure form validation
- Role-based access redirection
- Navigation to registration page

After successful authentication:
- Admin → Full Dashboard Access
- Surgeon → Surgery + Queue access
- OR Coordinator → Scheduling & Resource access

---

## 2️⃣ REGISTRATION MODULE

Accessible via `/register`

### Fields:
- Full Name
- Email
- Password
- Role Selection:
  - Surgeon
  - OR Coordinator
  - Admin
- Hospital Name

This module integrates with backend RBAC (Role-Based Access Control).

---

# 🧭 APPLICATION LAYOUT SYSTEM

After login, all protected routes are wrapped inside:

`AppLayout`

## Layout Components

### Sidebar Navigation
Includes links to:
- Dashboard
- Surgery Requests
- Scheduler
- Priority Queue
- Equipment
- Surgeons
- Operating Rooms
- Notifications
- Analytics

### Topbar
- System title
- Logged-in user badge
- Hospital name display

### Main Content Area
Dynamic rendering based on selected module.

---

# 📊 DASHBOARD MODULE

Route: `/`

The dashboard acts as the operational command center.

## A. OR Utilization Card
- Displays current OR usage %
- Idle OR count
- Maintenance OR count
- Target ≥ 85%

## B. Active Cases Card
- In-progress surgeries
- Emergency count
- Urgent count

## C. Average Wait Time Card
- Emergency SLA indicator (< 90 min)
- Urgent SLA indicator (24–32 hours)

## D. Conflict Summary Card
- Hard conflicts count
- Soft conflicts count

## E. GanttSchedule Component
- Multi-OR timeline visualization
- Displays time-blocked surgeries
- Visual scheduling overview

## F. Priority Snapshot Panel
Shows:
- Emergency queue count
- Urgent queue count
- Elective pipeline count
- SLA breach warnings
- Queue aging indicators

## G. Top Conflict Drivers
- Surgeon double-booking
- Equipment sterilization overlap
- Post-op bed unavailability

---

# 📄 SURGERY REQUESTS MODULE

Route: `/surgery-requests`

Handles intake of surgical cases before scheduling.

## Functionalities:
- View surgery requests
- Create new request
- Assign priority:
  - Emergency
  - Urgent
  - Elective
- Track request status
- Structured case submission

Backend processes:
- Priority tagging
- Validation
- Scheduling eligibility

---

# 🧠 INTELLIGENT SCHEDULER MODULE

Route: `/scheduler`

Core scheduling engine interface.

## Functional Capabilities:

- Multi-OR Gantt timeline
- Visual schedule allocation
- Drag-and-drop architecture (UI-ready)
- Conflict-aware scheduling
- SLA-based placement logic

Scheduler validates:

- OR availability
- Surgeon availability
- Equipment availability
- Maintenance windows
- Priority urgency

---

# ⚠ CONFLICT DETECTION SYSTEM

Integrated across scheduler and dashboard.

## Hard Conflicts:
- Surgeon double-booked
- Same OR overlapping cases
- Equipment unavailable
- OR under maintenance

## Soft Conflicts:
- Minor overlaps
- Suboptimal resource allocation
- Optimization inefficiencies

System tracks:
- Total conflicts
- Type distribution
- Conflict origin drivers

---

# 📌 PRIORITY QUEUE MODULE

Route: `/priority-queue`

Implements structured triage-based scheduling.

## Priority Levels:

| Priority   | SLA Target |
|------------|------------|
| Emergency  | < 2 Hours  |
| Urgent     | 24–48 Hours|
| Elective   | Scheduled  |

## Features:
- Queue aging tracking
- Escalation monitoring
- Dynamic reprioritization
- SLA breach warnings
- Queue snapshot analytics

---

# 🛠 EQUIPMENT MANAGEMENT MODULE

Route: `/equipment`

Tracks surgical resource allocation.

## Capabilities:
- Equipment inventory tracking
- Availability monitoring
- Sterilization cycle conflict detection
- Maintenance status
- OR compatibility validation

Prevents:
- Equipment double booking
- Overlapping sterilization windows

---

# 🧑‍⚕️ SURGEONS MODULE

Route: `/surgeons`

Tracks surgical workforce availability.

## Features:
- Surgeon profiles
- Workload monitoring
- Assigned surgeries
- Availability calendar
- Specialization tracking

Prevents:
- Double booking
- Overload scheduling

---

# 🏥 OPERATING ROOMS MODULE

Route: `/operating-rooms`

Monitors all OR infrastructure.

## Tracks:
- OR capability
- Active/Idle state
- Maintenance schedule
- Utilization rate
- Compatibility with surgery types

Prevents:
- OR overlap
- Maintenance scheduling conflicts

---

# 🔔 NOTIFICATIONS MODULE

Route: `/notifications`

Centralized alert management system.

## Alerts Include:
- Conflict detection alerts
- SLA breach warnings
- Emergency additions
- Schedule updates

Supports:
- Mark-as-read
- Clear all
- Real-time monitoring architecture

---

# 📈 ANALYTICS MODULE

Route: `/analytics`

Provides operational insights.

## Metrics:
- OR utilization trends
- Average wait time analysis
- Conflict frequency distribution
- Surgeon workload statistics
- Resource bottleneck detection

Supports export-ready reporting architecture.

---

# 🔐 SECURITY ARCHITECTURE

- Role-Based Access Control (RBAC)
- Protected routes via AppLayout
- Modular component isolation
- Authentication-based routing
- Structured permission layers

---

# 🏗 TECHNICAL ARCHITECTURE

## Frontend
- React
- TypeScript
- React Router DOM
- Modular page-based architecture
- Gantt-based scheduling visualization
- Component-driven layout

## Backend
- RESTful API
- Scheduling engine logic
- Conflict detection module
- Priority queue algorithm
- Notification system
- Persistent database integration

---

# 🚀 APPLICATION FLOW SUMMARY

1. User logs in
2. Role-based access granted
3. Dashboard displays live hospital metrics
4. Surgery request submitted
5. Case enters priority queue
6. Scheduler allocates OR & resources
7. Conflict detection validates allocation
8. Notifications triggered if necessary
9. Analytics reflect operational performance

---

# 🎯 SYSTEM IMPACT

This platform transforms:

Manual scheduling → Intelligent scheduling  
Conflict-prone workflows → Automated validation  
Unstructured prioritization → SLA-based triage  
Resource inefficiency → Optimized allocation  

---

# COLLABORATIONS

  -Hasham Tanveer
  -Usman Bukhari
  -Muhammad Mujtaba
  -Salman Ali Malik
  
# 🏁 CONCLUSION

The Hospital Operating Room Scheduler is a complete end-to-end surgical operations management system that combines:

- Intelligent conflict resolution
- Priority-based queue management
- Resource optimization
- Real-time monitoring
- Modular scalable architecture

Designed for production scalability and healthcare modernization.

---

## Webathon 2026 Submission  
Healthcare Innovation Category
