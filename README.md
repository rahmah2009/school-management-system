# 🌱 Greenfield School Management System

A full-stack school management system built to simplify school administration, student and teacher management, academic records, and result processing.

Greenfield School Management System provides an organised platform for managing essential school activities through a user-friendly interface and a secure backend.

🔗 **Live Website:** https://school-management-system-2shg.vercel.app

---

## 📸 Website Overview

![Greenfield School Management System Website Overview](src/assets/WEBSITE%20OVERVIEW.jpeg)

---

## ✨ Features

### 🌐 Public Website
- School homepage and introduction
- About the school
- Academic information
- Teachers directory
- Contact page
- Admin login and account registration

### 🔐 Authentication & Security
- Admin authentication
- Role-based access control
- Protected admin routes
- Forgot password functionality
- Email-based password reset
- Secure password hashing
- JWT-based authentication

### 📊 Admin Dashboard
- Overview of school activities
- Student and teacher statistics
- Administrative navigation

### 👨‍🎓 Student Management
- Add new students
- View student records
- Edit student information
- Delete student records
- Database-backed student management

### 👩‍🏫 Teacher Management
- Manage teacher records
- View teacher information
- Organise teacher information by department

### 📚 Academic Management
- Class management
- Academic sessions
- Result recording
- Result submission and approval workflow
- Configurable grading system
- Student report cards
- Class positions and remarks

### ⚙️ Administration
- School settings
- Role-based administrative permissions
- Messages and notifications

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React | Frontend development |
| Vite | Development server and build tool |
| Tailwind CSS | Styling and responsive design |
| React Router | Client-side routing |
| Node.js | Backend runtime |
| Express.js | Backend API |
| PostgreSQL | Database |
| Neon | Hosted PostgreSQL database |
| JWT | Authentication |
| bcrypt | Password hashing |
| Resend | Password reset emails |
| Vercel | Frontend deployment |
| Render | Backend deployment |

---

## 🏗️ Project Architecture

The application is organised into two main parts:

```text
school-management-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── database/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── index.css
│
├── public/
├── index.html
├── package.json
├── vercel.json
└── README.md
```

*Note: This is a high-level overview. Individual folders may contain additional files.*

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- PostgreSQL database or a Neon database account
- Git

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

### 5. Configure environment variables

Create a `.env` file inside the `backend` directory.

Configure the required variables using your own credentials:

```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secure_jwt_secret
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=your_resend_api_key
```

Never commit your `.env` file or expose your credentials publicly.

Create a frontend `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

### 6. Start the backend

From the `backend` directory:

```bash
npm run dev
```

### 7. Start the frontend

Open another terminal, navigate to the project root, and run:

```bash
npm run dev
```

The application should be available at:

**http://localhost:5173**

---

## 🌍 Deployment

The application is deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** Neon PostgreSQL

---

## 🔒 Security

- Environment variables are used for sensitive configuration.
- Passwords are hashed before storage.
- JWT tokens are used to authenticate protected requests.
- Administrative permissions are enforced through roles.

---

## 🎯 Project Goal

Greenfield School Management System was developed to demonstrate the practical application of frontend and backend development in building a real-world school administration platform.

The project focuses on creating a maintainable, organised, and user-friendly system while applying modern web development technologies.

---

## 👩‍💻 Developer

**Muhammad Rahmah**

Frontend and Backend Development

- GitHub: [@rahmah2009](https://github.com/rahmah2009)

---

## 📄 License

This project is developed for educational and portfolio purposes.