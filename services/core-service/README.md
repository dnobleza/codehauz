# core-service

Main API for the Codehaus client portal: authentication, project requests and portfolio.

## Tech stack

- Node.js 22+, Express 5 (JavaScript, CommonJS)
- bcryptjs (password hashing), jsonwebtoken (JWT)
- winston (logging)

## Getting started

```bash
cd services/core-service
npm install
npm run dev
```

The server runs on `http://localhost:3000`.

> Data is stored in memory for now (PostgreSQL comes later), so users are lost when the server restarts.

## Project structure

```
src/
├── config/        env.js: reads and checks environment variables
├── controllers/   read the request, call a service, send the response
├── middleware/    requestLogger, notFound, errorHandler
├── models/        store and find data (in-memory for now)
├── routes/        map URLs to controllers
├── services/      business rules (validation, duplicates, hashing, tokens)
├── utils/         AppError, logger, validation, regex, token helpers
├── app.js         builds the Express app
└── server.js      starts the server
```

A request flows: `route -> controller -> service -> model`. Errors thrown as `AppError` are turned into JSON by `errorHandler`.

## Environment variables

Create a `.env` file in `services/core-service`:

| Variable      | Required | Description                    | Example  |
| ------------- | -------- | ------------------------------ | -------- |
| `PORT`        | yes      | Port the server listens on     | `3000`   |
| `JWT_SECRET`  | yes      | Secret used to sign JWT tokens | (random) |
| `JWT_EXPIRES` | no       | Token lifetime (default `1d`)  | `1d`     |
| `LOG_LEVEL`   | no       | Log level (default `info`)     | `debug`  |

The server will not start if a required variable is missing.

## Endpoints

### GET /v1/health

Checks that the service is running.

**Success `200`**

```json
{ "status": "ok", "service": "core-service" }
```

---

### POST /v1/auth/register

Creates a new client account.

**Request body**

```json
{
  "name": "Juan Dela Cruz",
  "mobile": "09171234567",
  "email": "dan@test.com",
  "password": "secret123"
}
```

- `mobile`: PH mobile number, `09XXXXXXXXX` or `+639XXXXXXXXX`. Saved as `+639XXXXXXXXX`.
- `email`: saved in lowercase.
- `password`: at least 8 characters. Stored as a bcrypt hash, never as plain text.
- Any other fields (for example `id` or `role`) are ignored.

**Example**

```bash
curl -X POST http://localhost:3000/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Dela Cruz","mobile":"09171234567","email":"dan@test.com","password":"secret123"}'
```

**Success `201`**

```json
{
  "message": "User registered successfully",
  "token": "<JWT>",
  "user": {
    "id": 1,
    "name": "Juan Dela Cruz",
    "mobile": "+639171234567",
    "email": "dan@test.com",
    "role": "client",
    "createdAt": "2026-11-10T10:00:00.000Z"
  }
}
```

The response never includes the password or its hash. The role is always `client`.
`token` is a JWT signed with `JWT_SECRET`, expiring after `JWT_EXPIRES` (default `1d`). Its payload holds only `sub` (user id) and `role`.

**Errors**

| Status | Message                                         | When                          |
| ------ | ----------------------------------------------- | ----------------------------- |
| `400`  | `Name, mobile, email and password are required` | a field is missing or empty   |
| `400`  | `Invalid email format`                          | email fails the format check  |
| `400`  | `Invalid mobile number`                         | not `09` or `+639` + 9 digits |
| `400`  | `Password must be at least 8 characters`        | password shorter than 8       |
| `409`  | `Email already registered`                      | email is already used         |
| `409`  | `Mobile number already registered`              | mobile is already used        |

## Errors (all endpoints)

All errors use the format: `{ "error": "message" }`

| Status | Message                                | When                          |
| ------ | -------------------------------------- | ----------------------------- |
| `400`  | `Invalid JSON format in request body`  | the request body is not valid JSON |
| `404`  | `Route <METHOD> <path> not found`      | the URL does not exist        |
| `500`  | `Internal server error`                | unexpected error (details are logged, never sent) |
