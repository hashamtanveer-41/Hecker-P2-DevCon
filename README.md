🏥 Hospital Management & Surgery Scheduling System
An intelligent, React-based enterprise solution designed to streamline hospital operations, manage medical staff, and optimize surgical scheduling through an automated, constraint-aware engine.

🚀 Overview
This application provides a comprehensive suite of tools for hospital administrators and medical staff to manage the lifecycle of surgical procedures—from initial request and equipment sterilization to automated scheduling and audit logging.

✨ Key Features
📊 Centralized Dashboard
Get real-time insights into hospital operations, including the number of active Operating Rooms (ORs), available staff, pending surgery requests, and today's schedule.

🤖 Intelligent Scheduler
The core engine of the system that automates surgery assignments by checking:

Surgeon Match: Ensures the right specialist is assigned to the procedure.

OR Availability: Prevents double-booking of surgical suites.

Equipment Verification: Validates that necessary tools are sterilized and available.

Emergency Handling: Includes a dedicated "Emergency Schedule" function to prioritize critical cases and automatically adjust lower-priority bookings.

📋 Surgery & Queue Management
Surgery Requests: Create and track surgery requests with detailed metadata such as complexity level, estimated duration, and required equipment.

Priority Queue: A real-time queue that monitors patient waiting times and categorizes cases by urgency (Emergency, Urgent, Normal).

🏥 Resource Management
Hospital Selection: Multi-hospital support allows users to select and manage different facilities.

Operating Rooms (OR): Track OR capabilities and statuses.

Medical Staff: Manage staff profiles, specialties, and maximum daily work hours.

Equipment Tracking: Monitor sterilization cycles and maintenance status of surgical equipment.

🗓️ Calendar & Auditing
Visual Calendar: View schedules in both daily and weekly formats.

Audit Logs: A complete history of system actions (Create, Update, Delete, Login) with filtering capabilities for accountability and security.

🛠️ Tech Stack
Frontend: React.js

State Management: Context API (HospitalContext)

Form Handling: React Hook Form

Styling: Custom CSS-in-JS and modern gradients

API Layer: Modular API services (syncAPI, schedulerAPI, orAPI, etc.)

📂 Project Structure
Plaintext
src/
├── api/             # Modular API service handlers
├── context/         # HospitalContext for global state
├── pages/           # Page components (Dashboard, Staff, Scheduler, etc.)
├── utils/           # Global constants and helper functions
└── App.js           # Root component and routing
⚙️ Future Implementation
The project is currently configured with a mock data API for development. Ready-to-use hooks for axiosInstance and API_ENDPOINTS are included in the source code to facilitate a seamless transition to a live backend.
