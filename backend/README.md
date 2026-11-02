# 🌱 Greenfield School Management System — Backend

The backend API for the Greenfield School Management System, built with Node.js, Express.js, and PostgreSQL.

It provides authentication, administrative authorisation, student management, teacher management, and database connectivity for the frontend application.

---

## 🛠️ Technologies

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| PostgreSQL | Relational database |
| Neon | Hosted PostgreSQL |
| JWT | Authentication |
| bcrypt | Password hashing |
| Resend | Password reset emails |
| dotenv | Environment configuration |
| CORS | Cross-origin request handling |

---

## 📁 Backend Structure

```text
backend/
│
├── config/
│   └── database.js
│
├── data/
│   └── teachers.json
│
├── database/
│   └── schema.sql
│
├── middleware/
│   └── auth.js
│
├── routes/
│   ├── auth.js
│   ├── students.js
│   └── teachers.js
│
├── scripts/
│   ├── apply-schema.js
│   ├── create-admin.js
│   ├── import-students.js
│   └── seedTeachers.js
│
├── server.js
├── test-db.js
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

The backend exposes REST API endpoints under `/api`.

### General

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API status |
| GET | `/api/health` | Database health check |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Authenticate an existing account |
| POST | `/api/auth/signup` | Register a regular Staff account |
| POST | `/api/auth/register` | Register a regular Staff account |
| GET | `/api/auth/me` | Retrieve the authenticated administrator |
| POST | `/api/auth/forgot-password` | Request a password reset |
| POST | `/api/auth/reset-password` | Reset a password using a valid reset token |

### Students

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Retrieve student records |
| GET | `/api/students/:id` | Retrieve a student by database ID |
| POST | `/api/students` | Create a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### Teachers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/teachers` | Retrieve teacher records |
| GET | `/api/teachers/:id` | Retrieve a teacher by ID |
| POST | `/api/teachers` | Create a teacher |
| PUT | `/api/teachers/:id` | Update a teacher |
| DELETE | `/api/teachers/:id` | Delete a teacher |

---

## 🔐 Authentication and Authorisation

The backend uses JSON Web Tokens (JWT) to authenticate administrators.

After a successful login, the API returns an authentication token.

Protected requests must include the token in the HTTP Authorization header:

```http
Authorization: Bearer <token>
```

### Administrative Roles

The application supports three administrative roles:

| Role | Description |
|---|---|
| `super_admin` | Full administrative privileges for authorised operations |
| `staff` | Restricted administrative access |
| `viewer` | Read-only administrative access where permitted |

### Role Protection

- Protected API routes require authentication.
- Administrative permissions are checked on the backend.
- Only `super_admin` can create, update, or delete student records.
- Only `super_admin` can create, update, or delete teacher records.
- Public signup creates a `staff` account and cannot grant elevated privileges.

The backend enforces permissions independently of frontend visibility restrictions.

---

## 🗄️ Database

Greenfield uses PostgreSQL for persistent data storage.

The application connects to PostgreSQL through a database connection pool configured in:

```text
config/database.js
```

The database schema is maintained in:

```text
database/schema.sql
```

The schema includes tables for:

- Students.
- Teachers.
- Administrators.
- Password reset tokens.

Database indexes and constraints help maintain data integrity and improve query performance.

Neon provides the hosted PostgreSQL database used in production.

---

## 🚀 Local Setup

### Prerequisites

- Node.js 20 or newer.
- npm.
- PostgreSQL or a Neon database.
- Git.

### 1. Install dependencies

Navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the backend directory.

Example:

```env
PORT=5000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secure_random_secret
FRONTEND_URL=http://localhost:5173
RESEND_API_KEY=your_resend_api_key
```

Configure any additional variables required by the application and deployment environment.

Never commit `.env` files or publish secret credentials.

### 3. Apply the database schema

Run:

```bash
npm run db:schema
```

This applies the database schema defined in `database/schema.sql`.

### 4. Create the initial administrator

Run:

```bash
npm run admin:create
```

Follow the prompts to create the initial administrator account.

### 5. Start the backend server

Run:

```bash
npm start
```

The backend should be available at:

```text
http://localhost:5000
```

Check the API health endpoint:

```text
http://localhost:5000/api/health
```

---

## 🌍 Production Deployment

The backend is deployed on Render.

Production configuration includes:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Hosted PostgreSQL connection string |
| `DATABASE_SSL` | Database TLS configuration, when required |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `CORS_ORIGINS` | Allowed frontend origins |
| `NODE_ENV` | Application environment |
| `RESEND_API_KEY` | Email service API key |
| `PORT` | Server port, supplied by the hosting environment when applicable |

### Deployment Checklist

1. Configure the production environment variables in Render.
2. Connect the backend to the Neon PostgreSQL database.
3. Ensure the database schema has been applied.
4. Configure the allowed production frontend origin.
5. Set the production start command to:

```bash
npm start
```

6. Configure the frontend API URL to point to the deployed backend.

Do not use `localhost` as the API URL in the production frontend.

---

## 🔒 Security Practices

- Passwords are hashed before being stored.
- JWT authentication protects private API endpoints.
- Role-based middleware restricts sensitive operations.
- Public registration cannot grant Super Admin privileges.
- Environment variables are used for sensitive configuration.
- CORS restricts requests to configured frontend origins.
- Password reset tokens are stored as hashes and have expiry information.

Never commit:

- `.env` files.
- Database connection strings.
- JWT secrets.
- Email service API keys.
- Other private credentials.

If a credential is accidentally exposed, rotate it immediately.

---

## 🎯 Backend Objectives

The backend was developed to:

1. Provide a reliable API for the frontend.
2. Manage student and teacher records.
3. Authenticate administrative users.
4. Enforce role-based permissions.
5. Store application data in PostgreSQL.
6. Support password recovery through email.
7. Provide a maintainable foundation for future development.

---

## 👩‍💻 Developer

**Muhammad Rahmah**

GitHub: [@rahmah2009](https://github.com/rahmah2009)
