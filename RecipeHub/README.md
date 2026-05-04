# RecipeHub

A backend REST API for recipe management with JWT authentication and profile image upload, plus a React client.

## Technologies Used

- Node.js + Express.js — server framework
- MongoDB + Mongoose — database and ODM
- bcryptjs — password hashing (10 salt rounds)
- jsonwebtoken (JWT) — token-based authentication
- Multer — file upload middleware
- React — frontend client
- Axios — HTTP client with interceptors
- Jest + Supertest + mongodb-memory-server — testing

## Features Implemented

- User registration with input validation (email format, password min 8 chars)
- User login returning a signed JWT (7-day expiry)
- Password hashing with bcrypt
- Protected routes via Bearer token middleware
- Profile image upload (JPEG, PNG, WebP — max 5MB)
- MIME type and file extension mismatch detection (anti-spoofing)
- Static file serving for uploaded images
- React AuthContext with localStorage persistence and rehydration
- Axios instance with auto-attached Bearer token and 401 redirect
- 43 passing tests (unit + integration)

## Project Structure

```
RecipeHub/
├── src/
│   ├── app.js                     # Express app entry point
│   ├── errors.js                  # Custom error classes
│   ├── middleware/
│   │   ├── auth.middleware.js     # JWT Bearer verification
│   │   └── upload.middleware.js   # Multer config (5MB, images only)
│   ├── routes/
│   │   ├── auth.routes.js         # /api/auth
│   │   └── upload.routes.js       # /api/upload
│   └── services/
│       ├── auth.service.js        # register & login logic
│       ├── file.service.js        # profile image persistence
│       └── token.service.js       # JWT sign & verify
├── models/
│   └── User.js                    # Mongoose schema
├── client/src/
│   ├── api/axiosInstance.js       # configured Axios instance
│   └── context/AuthContext.jsx    # React auth context
├── tests/
│   ├── fixtures/test.jpg          # test image fixture
│   └── unit/
│       ├── auth.service.test.js
│       ├── auth.middleware.test.js
│       ├── token.service.test.js
│       └── routes.integration.test.js
├── uploads/                       # stored uploaded files
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
MONGO_URI=mongodb://localhost:27017/recipehub
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
  "displayName": "Bob",
  "email": "bob@example.com",
  "password": "securepass"
}
```

Responses:

| Status | Meaning |
|--------|---------|
| 201 | User created — returns { id, displayName, email } |
| 400 | Missing fields / invalid email / password < 8 chars |
| 409 | Email already registered |

---

### POST /api/auth/login

Login and receive a JWT token.

Request body:

```json
{
  "email": "bob@example.com",
  "password": "securepass"
}
```

Responses:

| Status | Meaning |
|--------|---------|
| 200 | Returns { token, id, displayName, email } |
| 400 | Missing email or password |
| 401 | Invalid credentials |

---

### POST /api/upload/profile — requires auth

Upload a profile image. Form field name: `image`.

Headers: `Authorization: Bearer <token>`

Body: multipart/form-data with field `image` (JPEG, PNG, or WebP — max 5MB)

Responses:

| Status | Meaning |
|--------|---------|
| 200 | Returns { url } — path to the uploaded file |
| 400 | Invalid file type or MIME/extension mismatch |
| 401 | Missing or invalid token |
| 413 | File exceeds 5MB limit |

---

## Client (React)

The `client/` folder contains React utilities for consuming the API:

- `axiosInstance.js` — pre-configured Axios with base URL, auto Bearer token injection from localStorage, and automatic redirect to `/login` on 401
- `AuthContext.jsx` — React context providing `user`, `token`, `login()`, and `logout()` with localStorage persistence across page refreshes
