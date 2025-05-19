# Smart-Campus-Services-Portal

The Smart Campus Services Portal is a centralized, web and mobile application designed to enhance access to essential campus services in a university or college environment. The portal streamlines the management of core services such as room bookings, timetable viewing, maintenance requests, announcements, and more. With an intuitive interface and flexible permissions system, the portal ensures a seamless user experience for students, lecturers, and administrative staff.

## Software Requirements Specification (SRS)
### Purpose
This document outlines the requirements, design, and functional overview of the Smart Campus Services Portal. It is intended to guide stakeholders, developers, testers, and project managers throughout the software development lifecycle. The key objectives of the system include:
-	Simplifying service access and request handling for all campus users.
-	Enabling real-time communication and updates through notifications.
-	Providing administrative oversight and system usage analytics.
-	Supporting flexible access control through a permission-based model.

### Scope
The Smart Campus Services Portal is designed to be accessible via modern web browsers. It utilizes a permission-based access control system, allowing specific features and functions to be enabled or restricted per user based on granted permissions, rather than relying on static user roles.

This approach offers greater flexibility and scalability, enabling users to be assigned custom capabilities (e.g., viewing timetables, booking rooms, managing issues, or accessing analytics) according to their responsibilities, without being confined to predefined roles such as “Student” or “Admin.”
Key features include:
-	User authentication with permissions management
-	Booking system for services such as study rooms and appointments
-	Timetable viewer for academic schedules
-	Maintenance request submission and tracking
-	Centralized notification center
-	Administrative dashboard with analytics and permission configuration

### Intended Audience
-	Students: Book rooms, book lecturer appointment, view or download timetable, report issues
-	Lecturers: Book rooms, manage appointments, report issues
-	Admins: Manage users, view analytics, approve bookings, handle maintenance requests, manage users account

### Funtional Requirements

#### Student:
-	Register and select course/modules upon signup
-	Login/logout functionality
-	View registered course and modules
-	Book rooms (study rooms/labs)
-	Submit maintenance requests
-	Book appointments with lecturers
-	View/download timetable
-	View notifications

  
#### Lecturer:
-	Login/logout
-	View assigned courses/modules
-	Book lab rooms only
-	Report maintenance issues
-	View/approve/decline student appointments
-	Post/view notifications
-	View/download timetable

  
#### Admin:
- Login/logout
-	View system statistics: total users, maintenance requests, room bookings
-	Approve/decline room bookings
-	Assign maintenance jobs to technicians
-	Post general notifications/announcements
-	Lock/unlock user accounts

## System Architecture
- Frontend: React.js
- Backend: ASP.NET Core Web API (.NET 8)
- Authentication: .NET Core Identity
- ORM: Dapper
- Database: SQL Server
- Runtime: Node.js, .NET 8

### Project Structure

<img width="764" alt="Screenshot 2025-05-19 at 10 43 28" src="https://github.com/user-attachments/assets/e8b5a3ab-895d-4c4b-979d-1b958dd98b7d" />

### Prerequisites
- Node.js (v18+ recommended)
- .NET 8 SDK
- SQL Server running instance
- Visual Studio / VS Code / JetBrains Rider

### Environment Configuration
`
"ConnectionStrings": {
  "SmartCampusDb": "Server=YOUR_SERVER;Database=YOUR_DB;User ID=YOUR_USER;Password=YOUR_PASSWORD;Encrypt=true;Connection Timeout=30;"
}
`

## Running the Project
- Clone the Repository
- Set Up User Secrets for DB Connection
- cd SmartCampusServicesPortal.Client
   - npm install
- dotnet run --project SmartCampusServicesPortal.Server 
  - Since the App uses SPA proxying to serve react app it will launch the frontend no need to run it

## Build & Deployment
The project uses SPA proxying to serve the React app via the ASP.NET Core backend.

To build for production:
` npm run build        # Frontend
  dotnet publish       # Backend
`

## Features

✅ User Authentication and permisons requests

✅ Stakeholder Management

✅ Room and Course Scheduling

✅ TimeTable download

✅ Booking and Availability Checks

✅ In-App Notification System




