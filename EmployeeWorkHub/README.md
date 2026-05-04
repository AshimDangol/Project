# EmployeeWorkHub

A backend REST API for employee management with JWT authentication and profile image upload.

## Technologies Used

- Node.js + Express.js — server framework
- MongoDB + Mongoose — database and ODM
- bcryptjs — password hashing (10 salt rounds)
- jsonwebtoken (JWT) — token-based authentication
- Multer — file upload middleware
- Jest + Supertest + mongodb-memory-server — testing

## Features Implemented

- User registration with input validation (email format, password min 8 chars)
- User login returning a signed JWT (7-day expiry)
- Password hashing with bcrypt
- Role field on User model (employee, manager, admin) — default: employee
- Role embedded in JWT payload for stateless authorization
- Protected routes via Bearer token middleware
- Role-based authorization middleware
- Profile avatar upload (JPEG, PNG, WebP — max 2MB)
- Old avatar cleanup on re-upload
- Static file serving for uploaded images
- 17 passing tests

## Project Structure

```
EmployeeWorkHub/
├── controllers/
│   ├── authController.js      # register & login
│   └── userController.js      # getProfile & uploadAvatar
├── middleware/
│   ├── authMiddleware.js      # JWT Bearer verification
│   ├── roleMiddleware.js      # role-based authorization
│   └── uploadMiddleware.js    # Multer config (2MB, images only)
├── models/
│   └── User.js                # Mongoose schema
├── routes/
│   ├── authRoutes.js          # /api/auth
│   └── userRoutes.js          # /api/users
├── tests/unit/
│   ├── auth.test.js
│   ├── middleware.test.js
│   └── upload.test.js
├── uploads/profile-images/    # stored avatars
├── app.js
├── server.js
├── .env.example
└── package.json
```

## Setup Instructions

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Set the following in `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/employeeworkhub
JWT_SECRET=your_strong_secret_here
```

### 3. Run the server

```bash
npm start        # production
npm run dev      # development with nodemon
```

### 4. Run tests

```bash
npm test
```

## API Endpoints

### POST /api/auth/register

Register a new user.

Request body:

```json
{
  "displayName": "Alice Smith",
  "email": "alice@example.com",
  "password": "securepass"
}
```

Responses:

| Status | Meaning |
|--------|---------|
| 201 | User created — returns { id, displayName, email } |
| 400 | Missing fields / invalid email / password < 8 chars |
| 409 | Email already in use |

---

### POST /api/auth/login

Login and receive a JWT token.

Request body:

```json
{
  "email": "alice@example.com",
  "password": "securepass"
}
```

Responses:

| Status | Meaning |
|--------|---------|
| 200 | Returns { token, id, displayName, email, role } |
| 400 | Missing email or password |
| 401 | Invalid credentials |

---

### GET /api/users/:id — requires auth

Get a user profile.

Headers: `Authorization: Bearer <token>`

Responses:

| Status | Meaning |
|--------|---------|
| 200 | Returns { id, displayName, email, role, profileImage } |
| 401 | Missing or invalid token |
| 404 | User not found |

---

### POST /api/users/:id/avatar — requires auth

Upload a profile avatar. Form field name: `avatar`.

Headers: `Authorization: Bearer <token>`

Body: multipart/form-data with field `avatar` (JPEG, PNG, or WebP — max 2MB)

Responses:

| Status | Meaning |
|--------|---------|
| 200 | Returns { profileImageUrl } |
| 400 | Invalid file type or file exceeds 2MB |
| 401 | Missing or invalid token |
| 404 | User not found |

---

## Role-Based Authorization

The `authorize` middleware guards routes by role. Roles: `employee` (default), `manager`, `admin`.

```js
const { authorize } = require('./middleware/roleMiddleware');

// only managers and admins can access
router.delete('/:id', authenticate, authorize('manager', 'admin'), deleteUser);
```
