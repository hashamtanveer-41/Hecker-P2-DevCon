# 🏥 Hospital Management & Surgery Scheduling System

A full-stack web-based Hospital Operating Room (OR) Scheduling System designed to optimize surgical workflows, eliminate scheduling conflicts, and improve operating room utilization through intelligent prioritization and real-time monitoring.

Built for Webathon 2026 🚀

🔐 Demo Login Credentials

Use the following credentials to access different modules of the system:

👨‍⚕️ Admin

Email: admin@hospital.org

Password: Admin@123

Access: Full system access (Dashboard, Scheduler, ORs, Surgeons, Equipment, Analytics, Notifications)

🧑‍⚕️ Surgeon

Email: surgeon@hospital.org

Password: Surgeon@123

Access: Surgery Requests, Scheduler (view), Priority Queue, Notifications

🗂 OR Coordinator

Email: coordinator@hospital.org

Password: Coordinator@123

Access: Scheduler, OR Management, Equipment, Priority Queue

📌 Project Overview

The Hospital OR Scheduler is a modern web application that manages:

Operating Room scheduling

Surgery request processing

Priority-based intelligent queue

Conflict detection & resolution

Equipment allocation

Surgeon workload tracking

Real-time notifications

OR analytics & utilization metrics

The system is designed to:

Increase OR utilization (Target ≥ 85%)

Reduce scheduling conflicts

Minimize patient wait times

Provide SLA-based prioritization (Emergency, Urgent, Elective)

Improve hospital resource optimization

🏗 System Architecture

This is a Full-Stack Web Application

🖥 Frontend

React + TypeScript

React Router DOM

Component-based architecture

Modular page structure

Clean hospital-themed UI

Responsive layout

Gantt-based scheduling visualization

⚙ Backend

RESTful API architecture

Authentication & role-based access

Scheduler logic engine

Conflict detection module

Priority queue algorithm

Real-time notification handling

Database integration (for surgeries, ORs, surgeons, equipment)

📂 Frontend Architecture
frontend/
 └── src/
      ├── pages/
      ├── components/
      ├── layout/
      ├── App.tsx
      ├── main.tsx

🔹 Routing (App.tsx)

The application uses React Router DOM for client-side routing.

Routes include:

/login

/register

/

/surgery-requests

/scheduler

/priority-queue

/equipment

/surgeons

/operating-rooms

/notifications

/analytics

All protected routes are wrapped inside:

<AppLayout>

🧩 Core Modules & Functionalities
1️⃣ Authentication Module
Login Page

Email & Password authentication

Biometric login option

Secure form validation

Redirect on successful login

Register Page

Name

Email

Password

Role selection:

Surgeon

OR Coordinator

Admin

Hospital association

2️⃣ Dashboard Module

Displays real-time hospital metrics:

Metrics Cards

OR Utilization %

Active Surgical Cases

Emergency / Urgent counts

Average Wait Time

Hard & Soft Conflicts

Priority Snapshot

Emergency Queue (SLA monitoring)

Urgent Queue

Elective Pipeline

Conflict driver breakdown

Gantt Schedule Preview

Multi-OR timeline

Time-blocked surgeries

Visual conflict indicators

3️⃣ Surgery Requests Module

Create new surgery request

Filter by:

Priority

Surgeon

Department

Status

View request table

Edit / Cancel request

Assign urgency:

Emergency

Urgent

Elective

Backend handles:

Validation

Priority tagging

Scheduling readiness

4️⃣ Intelligent Scheduler Module

Core engine of the system.

Features:

Multi-OR Gantt timeline

Drag & Drop scheduling

Conflict detection:

Surgeon double booking

Equipment overlap

OR maintenance clash

Post-op bed availability

Hard vs Soft conflict classification

Automatic schedule suggestions

Algorithm factors:

OR availability

Surgeon availability

Equipment readiness

Priority weight

SLA deadlines

5️⃣ Priority Queue Engine

Three-level priority classification:

Priority	SLA
Emergency	< 2 Hours
Urgent	24–48 Hours
Elective	Scheduled

Queue supports:

Aging detection

Escalation logic

Real-time reorder

Dynamic reprioritization

6️⃣ Equipment Management

Tracks:

Equipment inventory

Availability

Sterilization cycles

Maintenance state

OR compatibility

Prevents:

Equipment double booking

Sterilization overlaps

7️⃣ Surgeons Module

Tracks:

Surgeon profiles

Workload

Availability calendar

Specializations

Assigned surgeries

Prevents:

Double booking

Overload scheduling

8️⃣ Operating Rooms Module

Tracks:

OR list

Capability (Cardiac, Neuro, Ortho, etc.)

Maintenance state

Active / Idle status

Utilization rate

9️⃣ Notifications Module

Real-time alert system:

Conflict alerts

SLA breach warnings

Emergency additions

Schedule updates

Mark-as-read

Clear all

🔟 Analytics Module

Provides insights:

OR utilization trends

Average wait times

Conflict frequency

Surgeon workload distribution

Equipment bottlenecks

Export reports (CSV / PDF)

⚡ Intelligent Conflict Resolution

The system detects:

Hard Conflicts

Surgeon double-booked

Same OR at same time

Equipment unavailable

Soft Conflicts

Minor time overlaps

Resource optimization issues

Resolution Strategies:

Auto-reschedule suggestions

Priority-based override

Alternate OR recommendation

Time slot optimization

🎨 UI/UX Design

Design inspired by:

Clean hospital dashboard aesthetic

Soft blue/white medical palette

Card-based metric display

Minimal cognitive load

Accessible typography

Badge-based priority visualization

Color Indicators:

🔴 Emergency

🟠 Urgent

🔵 Elective

🟢 Available

🟡 Maintenance

🔐 Security Features

Role-Based Access Control (RBAC)

Secure authentication

Route protection

Input validation

Backend API validation

Modular architecture for scalability

🚀 How to Run the Project
Frontend
cd frontend
npm install
npm run dev


Runs on:

http://localhost:5173

Backend
cd backend
npm install
npm start


Make sure:

Database is connected

Environment variables are configured

🧠 Future Improvements

AI-based predictive scheduling

Machine learning for OR utilization optimization

Real-time WebSocket updates

Mobile application

HL7 / FHIR hospital system integration

Multi-hospital network support

Advanced analytics dashboard

📊 Problem We Solved

Hospitals face:

OR underutilization

Scheduling conflicts

Equipment overlap

Surgeon double-booking

SLA violations

Long patient wait times

Our system provides:

✅ Intelligent scheduling
✅ Conflict prevention
✅ Priority-based optimization
✅ Real-time monitoring
✅ Data-driven decisions

👥 Team & Webathon Submission

Project built for Webathon 2026
Category: Healthcare Innovation

A scalable, modular, production-ready OR scheduling platform designed to modernize surgical workflow management.

🏁 Conclusion

The Hospital Operating Room Scheduler is a comprehensive digital solution that transforms manual, error-prone OR scheduling into a smart, optimized, and intelligent workflow management system.

It combines:

Real-time analytics

Intelligent prioritization

Conflict detection

Resource optimization

Clean UI architecture

Making hospital surgical operations more efficient, safer, and data-driven.
