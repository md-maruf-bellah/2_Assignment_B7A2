

#  DevPulse – Backend API

A collaborative **Tech Issue Tracker System** built with Node.js, TypeScript, Express, and PostgreSQL.

It allows teams to report bugs, suggest features, and manage software issues efficiently.

---

#  Live URL

```
https://devpulse-api.vercel.app
```

---

#  GitHub Repository

```
https://github.com/yourusername/devpulse
```

---

#  Features

* User authentication (Signup/Login)
* JWT-based secure authentication
* Role-based access control (Contributor / Maintainer)
* Create bug or feature requests
* View all issues with filtering & sorting
* View single issue details
* Update issues with permission rules
* Delete issues (maintainer only)
* PostgreSQL raw SQL (no ORM)
* Clean modular architecture
* Centralized error handling

---

#  Tech Stack

* Node.js (LTS)
* Express.js
* TypeScript
* PostgreSQL (pg driver)
* bcrypt (password hashing)
* jsonwebtoken (JWT)
* dotenv

---

#  Database Schema

##  users table

| Field      | Type      | Description              |
| ---------- | --------- | ------------------------ |
| id         | SERIAL    | Primary Key              |
| name       | VARCHAR   | Full name                |
| email      | VARCHAR   | Unique email             |
| password   | TEXT      | Hashed password          |
| role       | VARCHAR   | contributor / maintainer |
| created_at | TIMESTAMP | Created time             |
| updated_at | TIMESTAMP | Updated time             |

---

## 🐞 issues table

| Field       | Type         | Description                   |
| ----------- | ------------ | ----------------------------- |
| id          | SERIAL       | Primary Key                   |
| title       | VARCHAR(150) | Issue title                   |
| description | TEXT         | Issue details                 |
| type        | VARCHAR      | bug / feature_request         |
| status      | VARCHAR      | open / in_progress / resolved |
| reporter_id | INTEGER      | User ID                       |
| created_at  | TIMESTAMP    | Created time                  |
| updated_at  | TIMESTAMP    | Updated time                  |

---

#  Authentication Flow

```
Signup → Password Hash (bcrypt)
→ Login → JWT Token Generate
→ Client stores token
→ Protected routes verify token
```

---

#  API Endpoints

---

##  Authentication

### Register User

```
POST /api/auth/signup
```

### Login User

```
POST /api/auth/login
```

---

##  Issues

---

### Create Issue

```
POST /api/issues
Authorization: <JWT_TOKEN>
```

---

### Get All Issues

```
GET /api/issues?sort=newest&type=bug&status=open
```

### Query Parameters

| Param  | Values                      | Default |
| ------ | --------------------------- | ------- |
| sort   | newest, oldest              | newest  |
| type   | bug, feature_request        | none    |
| status | open, in_progress, resolved | none    |

---

### Get Single Issue

```
GET /api/issues/:id
```

---

### Update Issue

```
PATCH /api/issues/:id
Authorization: <JWT_TOKEN>
```

---

### Delete Issue

```
DELETE /api/issues/:id
Authorization: <JWT_TOKEN>
```

---

#  Roles & Permissions

##  Contributor

* Register/Login
* Create issue
* View issues
* Update own issue (if status = open)

## 🧑‍🔧 Maintainer

* All contributor permissions
* Update any issue
* Delete any issue
* Manage issue workflow

---

# ⚙️ Setup Instructions

## 1. Clone repository

```
git clone https://github.com/yourusername/devpulse.git
cd devpulse
```

---

## 2. Install dependencies

```
npm install
```

---

## 3. Setup environment variables

```
PORT=5000
DATABASE_URL=your_postgres_url
JWT_SECRET=your_secret_key
```

---

## 4. Run project

```
npm run dev
```

---

## 5. Build project

```
npm run build
```

---

#  Deployment

* Backend: Vercel / Render / Railway
* Database: NeonDB / Supabase / ElephantSQL

---

#  Key Learnings

* JWT Authentication system
* Role-based authorization
* PostgreSQL raw SQL queries
* Filtering & sorting logic
* Clean modular architecture
* Error handling best practices

---

#  API Response Format

## Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": {}
}
```

---

#  Author

**Maruf Bellah**

