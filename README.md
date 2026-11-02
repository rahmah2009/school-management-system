# 🌱 Greenfield School Management System

A full-stack web application designed to simplify school administration and academic record management.

Greenfield School Management System provides a public-facing school website and a secure administrative dashboard where authorised users can manage student records, teacher information, classes, academic sessions, results, and other school activities.

🔗 **Live Website:** https://school-management-system-2shg.vercel.app

🔗 **Backend API:** https://school-management-system-fk0d.onrender.com

🐙 **GitHub Repository:** https://github.com/rahmah2009/school-management-system

---

## 📸 Website Overview

![Greenfield School Management System Website Overview](src/assets/WEBSITE%20OVERVIEW.jpeg)

---

## ✨ Key Features

### 🌐 Public Website
- Responsive school homepage.
- About the school.
- Academic information.
- Teachers directory.
- Contact page.
- Admin login and account registration.

### 🔐 Authentication and Security
- JWT-based authentication.
- Secure password hashing.
- Protected administrative routes.
- Role-based access control.
- Super Admin, Staff, and Viewer roles.
- Forgot password and email-based password reset.
- Frontend inactivity-based session timeout.
- Restricted administrative operations based on user roles.

### 📊 Admin Dashboard
- Overview of school activities.
- Student and teacher statistics.
- Centralised administrative navigation.
- Role-aware dashboard functionality.

### 👨‍🎓 Student Management
- Add new students.
- View student records.
- Edit student information.
- Delete student records.
- Database-backed student management.

### 👩‍🏫 Teacher Management
- Manage teacher records.
- View teacher information.
- Organise teachers by department.

### 📚 Academic Management
- Class management.
- Academic session management.
- Result recording.
- Result submission and approval workflow.
- Configurable grading system.
- Student report cards.
- Class positions and remarks.

### ⚙️ Administration
- School settings.
- Administrative role restrictions.
- Messages and notifications.
- Custom access-denied and error pages.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| Vite | Development server and build tool |
| JavaScript | Application functionality |
| Tailwind CSS | Responsive styling |
| React Router | Client-side navigation |
| Node.js | Backend runtime |
| Express.js | REST API development |
| PostgreSQL | Relational database |
| Neon | Hosted PostgreSQL database |
| JSON Web Tokens (JWT) | Authentication |
| bcrypt | Password hashing |
| Resend | Password reset emails |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## 🏗️ Project Architecture

Greenfield uses a client-server architecture.

- **Frontend:** Handles the user interface, navigation, forms, and user interactions.
- **Backend:** Handles API requests, authentication, authorisation, validation, and database operations.
- **Database:** Stores application records using PostgreSQL.
- **Deployment:** The frontend and backend are deployed separately.

### Project Structure

```text
school-management-system/
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── data/
│   │   └── teachers.json
│   ├── database/
│   │   └── schema.sql
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js
│   │   └── teachers.js
│   ├── scripts/
│   │   ├── apply-schema.js
│   │   ├── create-admin.js
│   │   ├── import-students.js
│   │   └── seedTeachers.js
│   ├── server.js
│   ├── test-db.js
│   ├── package.json
│   └── README.md
│
├── public/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── vercel.json
└── README.md
```

*This is a simplified overview of the project structure.*

---

## 🚀 Getting Started

Follow these instructions to run the application locally.

### Prerequisites

Ensure you have installed:

- Node.js 20 or newer.
- npm.
- Git.
- Access to a PostgreSQL database or Neon database.

### 1. Clone the repository

```bash
git clone https://github.com/rahmah2009/school-management-system.git
```

### 2. Navigate to the project

```bash
cd school-management-system
```

### 3. Install frontend dependencies

```bash
npm install
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

### 5. Configure backend environment variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=your_resend_api_key
```

Use the additional variables required by your deployment configuration, such as `CORS_ORIGINS` and `DATABASE_SSL`, where applicable.

Never commit your `.env` file or expose your credentials.

### 6. Configure frontend environment variables

Return to the project root:

```bash
cd ..
```

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### 7. Prepare the database

From the backend directory, apply the database schema:

```bash
npm run db:schema
```

Create the initial administrator using the backend's administrator creation script:

```bash
npm run admin:create
```

Follow the script's prompts and configure the appropriate administrative role.

### 8. Start the backend

Open a terminal in the `backend` directory:

```bash
npm start
```

### 9. Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

The application should now be available at:

**http://localhost:5173**

---

## 🌍 Deployment

Greenfield School Management System is deployed using the following services:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend API | Render |
| Database | Neon PostgreSQL |

### Production Configuration

The frontend uses the deployed backend API through the `VITE_API_URL` environment variable.

The backend uses environment variables for database connectivity, authentication secrets, email configuration, and allowed frontend origins.

---

## 🔒 Security Considerations

- Passwords are hashed before storage.
- JWT tokens authenticate protected API requests.
- Role-based permissions restrict administrative operations.
- Backend middleware protects restricted endpoints.
- Environment variables keep sensitive credentials out of source code.
- Frontend inactivity timeout helps protect unattended administrative sessions.

---

## 🎯 Project Objectives

The Greenfield School Management System was developed to:

1. Simplify school administrative activities.
2. Improve the organisation of student and teacher records.
3. Provide a centralised platform for academic management.
4. Demonstrate practical full-stack web development.
5. Apply authentication, authorisation, and database management concepts.
6. Build a responsive and maintainable web application.

---

## 👩‍💻 Developer

**Muhammad Rahmah**

Full-Stack Web Development Project

- GitHub: [@rahmah2009](https://github.com/rahmah2009)

---

## 📄 Project Information

Developed for educational, practical, and portfolio purposes.
