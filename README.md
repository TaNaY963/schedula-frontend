# Schedula — Doctor Appointment & Clinic Management Platform

Schedula is a healthcare appointment management platform built to simplify the process of discovering doctors, booking appointments, managing availability, handling appointments, and accessing prescriptions.

The application provides dedicated **User and Doctor portals** with role-specific workflows, appointment scheduling, calendar management, prescription management, notifications, and an interactive assistant to make common actions easier to access.

---

## 🌐 Live Demo

**Live Application:** [https://schedula-frontend-gpgyi8tdi-tanay20.vercel.app/]

## 🎥 Project Walkthrough

**Loom Demo:** [WATCH THE PROJECT WALKTHROUGH](https://www.loom.com/share/d9e82225587242828b09783efdd42114)

The walkthrough demonstrates the major User and Doctor workflows, including doctor discovery, appointment booking, availability management, calendar management, prescriptions, notifications, and the Schedula Assistant.

---

## ✨ Features

### 👤 User Portal

* User login and authentication
* User dashboard
* Doctor listing
* Doctor search and discovery
* Doctor details
* View available appointment slots
* Select appointment date and time
* Book appointments
* Appointment confirmation
* My Appointments
* Appointment status tracking
* View completed appointments
* View cancelled and missed appointments
* View prescriptions
* Download prescription PDFs
* Review doctors
* Rebook appointments
* User profile management
* Appointment-related notifications
* Interactive Schedula Assistant

### 👨‍⚕️ Doctor Portal

* Doctor registration
* Doctor login
* Registration and login validation
* Error handling
* Doctor dashboard
* Upcoming appointment overview
* Doctor profile
* Update doctor information
* Appointment availability management
* Create available date/time slots
* Recurring availability
* View existing availability
* Manage availability slots
* All Appointments page
* Appointment search and filtering
* Appointment details
* Prescription management
* Calendar-based appointment management

---

# 📅 Appointment Management

Schedula provides a complete appointment lifecycle for both doctors and users.

### Appointment statuses

* Pending
* Confirmed
* Upcoming
* Completed
* Cancelled
* Missed

### Doctor actions

For pending appointments:

* Confirm
* Decline

For confirmed/upcoming appointments:

* Reschedule
* Cancel

After the appointment time:

* Mark as Completed
* Mark as Missed

Completed, cancelled, and missed appointments are treated as read-only where appropriate.

---

# 🗓️ Doctor Calendar

The Doctor Portal includes a calendar for managing appointments and availability.

### Calendar views

* Day
* Week
* Month

### Calendar capabilities

* Display upcoming appointments
* Display doctor availability
* Drag and drop appointment rescheduling
* Prevent scheduling into unavailable slots
* Prevent double booking
* Update appointment date/time after rescheduling
* Reflect appointment changes in the appointment list
* Keep completed, cancelled, and missed appointments read-only

---

# ⏰ Doctor Availability

Doctors can manage their appointment availability directly from their profile.

### Supported functionality

* Create date-specific availability
* Add start and end times
* Create multiple available slots
* Create recurring availability
* Daily recurring availability
* Weekly recurring availability
* View existing slots
* Manage/remove available slots
* Prevent users from selecting unavailable slots

### Availability flow

```text
Doctor
   ↓
Profile
   ↓
Appointment Availability
   ↓
Create Slot
   ↓
Available on User Portal
   ↓
User Selects Doctor
   ↓
User Selects Date & Time
   ↓
Appointment Booked
```

Only available and unbooked slots can be selected by users.

---

# 📋 All Appointments

Doctors have a dedicated appointments page for managing their complete appointment history.

Appointments can be viewed by:

```text
All
Pending
Confirmed
Upcoming
Completed
Cancelled
Missed
```

The appointment page also supports:

* Search
* Status filtering
* Date filtering
* Appointment details
* Appointment actions based on current status

---

# 💊 Prescription Management

Doctors can create and manage prescriptions associated with completed appointments.

### Prescription information

* Diagnosis
* Medicines
* Dosage
* Duration
* Instructions

Doctors can:

* Create prescriptions
* View prescriptions
* Edit prescriptions
* Update prescription information

Changes to a prescription are reflected in the corresponding completed appointment for the user.

### User prescription flow

```text
Doctor Completes Appointment
          ↓
Doctor Creates Prescription
          ↓
Prescription Linked to Appointment
          ↓
User Opens Completed Appointment
          ↓
View Prescription
          ↓
Download Prescription PDF
```

Users can also access prescriptions from their dedicated prescription history/menu.

---

# 👤 User Profile

The User Portal provides a centralized profile for managing personal and healthcare-related information.

### Profile information

* Personal information
* Physical details
* Medical conditions
* Allergies
* Current medications
* Insurance details
* Emergency contact

### Profile summary

The profile also provides summary information such as:

* Total Prescriptions
* Completed Appointments
* Test Reports

---

# 🔔 Notifications

Schedula includes appointment-related notifications to keep users informed about important changes.

Notifications cover:

* New appointment booking
* Appointment confirmation
* Appointment rescheduling
* Appointment cancellation
* Appointment reminders
* Missed appointments
* Completed appointments
* Prescription availability

---

# 🤖 Schedula Assistant

Schedula includes an interactive assistant designed to improve navigation and make frequently used actions easier to access.

### User Assistant

Users can quickly access actions such as:

```text
How can I help you?

[Find a Doctor]
[Book Appointment]
[My Appointments]
[Prescriptions]
```

### Doctor Assistant

Doctors can quickly access:

```text
How can I help you?

[Today's Appointments]
[Calendar]
[Manage Availability]
[Appointments]
[Prescriptions]
[Profile]
```

The assistant is designed as a **navigation and usability feature** and is not intended to provide medical diagnosis or medical advice.

---

# 🔄 Complete Application Flow

## User Flow

```text
User Login
     ↓
Doctor Listing
     ↓
Doctor Details
     ↓
Available Slots
     ↓
Select Date & Time
     ↓
Book Appointment
     ↓
Booking Confirmation
     ↓
Doctor Confirms
     ↓
Appointment
     ↓
Completed / Missed
     ↓
Prescription / Review / Rebook
```

## Doctor Flow

```text
Doctor Registration
     ↓
Doctor Login
     ↓
Dashboard
     ↓
Profile
     ↓
Create Availability
     ↓
Manage Slots
     ↓
Appointments
     ↓
Confirm / Decline
     ↓
Reschedule / Cancel
     ↓
Complete / Miss Appointment
     ↓
Create / Manage Prescription
```

## Complete Healthcare Flow

```text
Doctor Availability
        ↓
User Books Appointment
        ↓
Doctor Confirms
        ↓
Appointment
        ↓
Completed / Missed
        ↓
Prescription
        ↓
Review / Rebook
```

---

# 🛠️ Tech Stack

## Frontend

* **Next.js** — App Router
* **React**
* **TypeScript**
* **Tailwind CSS**
* **FullCalendar**

## Backend / API

* Next.js Route Handlers
* REST-style API endpoints
* Typed API contracts
* Mock data/API implementation

## Development Tools

* ESLint
* Git
* GitHub
* VS Code
* npm

---

# 🏗️ Architecture

The application follows a feature-oriented frontend architecture with reusable components and typed data boundaries.

```text
src/
│
├── app/
│   ├── api/
│   │   ├── appointments/
│   │   ├── availability/
│   │   └── ...
│   │
│   ├── doctor/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── appointments/
│   │   ├── calendar/
│   │   └── ...
│   │
│   ├── user/
│   │   ├── dashboard/
│   │   ├── appointments/
│   │   ├── prescriptions/
│   │   ├── profile/
│   │   └── ...
│   │
│   ├── booking/
│   └── ...
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── ...
│
├── features/
│   ├── appointments/
│   ├── doctors/
│   ├── prescriptions/
│   ├── notifications/
│   └── ...
│
├── lib/
│   ├── mock-data/
│   └── utils/
│
└── types/
    ├── appointment.ts
    ├── doctor.ts
    └── ...
```

---

# 🔌 API Architecture

The application uses Next.js Route Handlers as the API boundary.

The general data flow is:

```text
Browser
   ↓
Feature / API Client
   ↓
Next.js Route Handler
   ↓
Mock Data
   ↓
Response
   ↓
UI
```

Appointment and availability data are handled through typed API contracts rather than being directly coupled to individual UI components.

This architecture keeps the frontend ready for future integration with a production backend and database.

---

# 📦 Getting Started

## Prerequisites

Make sure you have installed:

* Node.js 20.9 or later
* npm
* Git

## Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd schedula-frontend
```

## Install dependencies

```bash
npm install
```

## Start the development server

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

---

# 📜 Available Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run lint`  | Run ESLint                   |
| `npm run build` | Create a production build    |
| `npm run start` | Start the production build   |

Before deployment, run:

```bash
npm run lint
npm run build
```

---

# 🎨 UX & UI

Schedula focuses on a clean, responsive and healthcare-friendly experience.

### UI principles

* Responsive design
* Reusable components
* Consistent navigation
* Clear appointment statuses
* Simple booking experience
* Accessible interactions
* Form validation
* Loading states
* Error states
* Empty states
* Mobile-friendly layouts
* Responsive calendar
* Clear user feedback after important actions

The interface is designed to make complex appointment workflows easy to understand for both doctors and patients.

---

# 🔐 Validation & Error Handling

Forms throughout the application include validation for required and invalid inputs.

The application handles common states including:

* Loading
* Empty data
* API errors
* Invalid form input
* Invalid appointment actions
* Unavailable slots
* Already-booked slots
* Missing prescriptions
* Empty appointment history

---

# 🚀 Deployment

The application is built with Next.js and can be deployed to a Next.js-compatible hosting platform such as Vercel.

### Production build

```bash
npm run build
```

### Run production build locally

```bash
npm run start
```

### Live Application

**[Open Schedula](YOUR_DEPLOYED_URL)**

---

# 🎥 Project Demo

**[▶ Watch the Complete Schedula Walkthrough on Loom](YOUR_LOOM_URL)**

The Loom walkthrough demonstrates:

* User authentication
* Doctor registration and login
* Doctor listing
* Doctor availability
* Recurring slots
* Appointment booking
* Doctor dashboard
* Appointment management
* Calendar
* Appointment rescheduling
* Prescription management
* User prescriptions
* Prescription PDF download
* User profile
* Notifications
* Schedula Assistant

---

# 🌱 Future Improvements

The current implementation uses a mock API/data layer. Possible future improvements include:

* Production backend integration
* Database integration
* JWT/session-based authentication
* Role-based access control
* Real-time notifications
* Email/SMS appointment reminders
* Online consultation/video appointments
* Payment integration
* Medical report management
* Advanced doctor search
* Admin dashboard
* Real-time calendar synchronization
* Production-grade security and data protection

---

# 🌿 Git Workflow

The project uses focused branches and meaningful commits.

### Branch naming

```text
feat/<scope>
fix/<scope>
docs/<scope>
chore/<scope>
```

Examples:

```text
feat/prescription-menu
feat/doctor-calendar
fix/booking-slot-selection
docs/readme
```

### Commit examples

```bash
git commit -m "feat(appointments): add doctor appointment management"

git commit -m "feat(prescriptions): add user prescription menu"

git commit -m "feat(assistant): add quick action navigation"

git commit -m "fix(booking): prevent unavailable slot selection"

git commit -m "docs(readme): update project documentation"
```

Commits should be:

* Small
* Focused
* Descriptive
* Easy to review
* Easy to revert

Avoid generic commit messages such as:

```text
update
changes
final
wip
all work
```

---

# 👨‍💻 Author

## Tanay Pant

B.Tech — Computer Science & Engineering

**Full Stack Developer**

### Skills

* Java
* Spring Boot
* JavaScript
* TypeScript
* React.js
* Next.js
* Node.js
* Express.js
* REST APIs
* MySQL
* Tailwind CSS
* Git & GitHub

---

## 📄 License

This project was developed as part of a frontend internship project and is intended for educational, demonstration, and portfolio purposes.
