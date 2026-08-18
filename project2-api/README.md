# Backend API Development - Project 3

A simple backend API connected to a SQLite database with complete CRUD functionality — submitted as the third milestone of the DecodeLabs Full Stack Industrial Training Kit (Batch 2026).

## Overview

This API manages `tasks` — a simple to-do item resource stored permanently in a SQLite database.

### Task Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | auto | Unique identifier (auto-generated) |
| `title` | string | yes | Task title (non-empty) |
| `completed` | boolean | no | Completion status (defaults to `false`) |
| `created_at` | datetime | auto | Timestamp when the task was created |
| `updated_at` | datetime | auto | Timestamp when the task was last updated |

## Technologies Used

- **Node.js** — JavaScript runtime
- **Express.js** — Web framework
- **SQLite** (via sql.js) — Lightweight embedded database
- **dotenv** — Environment variable management

## Setup

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

```bash
cd project2-api
npm install
```

### Environment Setup

Create a `.env` file in the project root (or copy from `.env.example`):

```bash
cp .env.example .env
```

**Available environment variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `DB_PATH` | `./data/database.sqlite` | Path to SQLite database file |

**Never commit your `.env` file.** It is already included in `.gitignore`.

### Running the Server

```bash
npm start
```

The server will:
1. Connect to the SQLite database (creates the file if it does not exist)
2. Initialize the database schema
3. Start listening on `http://localhost:3000`

## Project Structure

```
project2-api/
├── server.js              # Entry point - starts server, mounts routes
├── config/
│   └── database.js        # Database connection and schema setup
├── routes/
│   └── tasks.js           # Route handlers for /api/tasks
├── data/
│   ├── store.js           # Database query functions (CRUD)
│   └── database.sqlite    # SQLite database file (auto-created)
├── middleware/
│   └── validateTask.js    # Request validation middleware
├── .env                   # Environment variables (not committed)
├── .env.example           # Example environment file
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

All endpoints are prefixed with `/api/tasks`.

### Response Format

**Success:**
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Clear description of the error"
}
```

---

### GET /api/tasks

Retrieve all tasks.

**Response:** `200 OK`

**Example:**
```bash
curl http://localhost:3000/api/tasks
```

**Response Body:**
```json
{
  "success": true,
  "message": "Tasks retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Learn Express.js",
      "completed": false,
      "created_at": "2026-08-18 17:20:01",
      "updated_at": "2026-08-18 17:20:01"
    }
  ]
}
```

---

### GET /api/tasks/:id

Retrieve a single task by ID.

**Parameters:**
- `id` (path) — Task ID (integer)

**Responses:**
- `200 OK` — Task found
- `400 Bad Request` — Invalid ID
- `404 Not Found` — Task not found

**Example:**
```bash
curl http://localhost:3000/api/tasks/1
```

**Success Response:**
```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": 1,
    "title": "Learn Express.js",
    "completed": false,
    "created_at": "2026-08-18 17:20:01",
    "updated_at": "2026-08-18 17:20:01"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### POST /api/tasks

Create a new task.

**Request Body:**
- `title` (string, required) — Task title (non-empty)
- `completed` (boolean, optional) — Completion status (defaults to `false`)

**Responses:**
- `201 Created` — Task created successfully
- `400 Bad Request` — Invalid or missing input

**Example:**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn database integration"}'
```

**Success Response:**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 2,
    "title": "Learn database integration",
    "completed": false,
    "created_at": "2026-08-18 17:30:00",
    "updated_at": "2026-08-18 17:30:00"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Title is required"
}
```

```json
{
  "success": false,
  "message": "Title cannot be empty"
}
```

---

### PUT /api/tasks/:id

Update an existing task.

**Parameters:**
- `id` (path) — Task ID (integer)

**Request Body:**
- `title` (string, required) — Task title (non-empty)
- `completed` (boolean, optional) — Completion status

**Responses:**
- `200 OK` — Task updated successfully
- `400 Bad Request` — Invalid input or ID
- `404 Not Found` — Task not found

**Example:**
```bash
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Master CRUD operations", "completed": true}'
```

**Success Response:**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": 1,
    "title": "Master CRUD operations",
    "completed": true,
    "created_at": "2026-08-18 17:20:01",
    "updated_at": "2026-08-18 17:35:00"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

### DELETE /api/tasks/:id

Delete a task.

**Parameters:**
- `id` (path) — Task ID (integer)

**Responses:**
- `200 OK` — Task deleted successfully
- `400 Bad Request` — Invalid ID
- `404 Not Found` — Task not found

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

**Success Response:**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Task not found"
}
```

---

## Error Handling

| Situation | Status | Example Message |
|-----------|--------|-----------------|
| Missing input | `400 Bad Request` | Title is required |
| Invalid input | `400 Bad Request` | Title must be a string |
| Empty body | `400 Bad Request` | Request body is required |
| Invalid ID | `400 Bad Request` | Invalid task ID |
| Record not found | `404 Not Found` | Task not found |
| Route not found | `404 Not Found` | Route not found |
| Invalid JSON | `400 Bad Request` | Invalid JSON in request body |
| Unexpected error | `500 Internal Server Error` | Internal server error |

The server will **not** crash due to normal invalid requests.

## Data Persistence

Data is stored in a SQLite database file (`data/database.sqlite`). Unlike in-memory storage:

- Data persists across server restarts
- The database file is auto-created on first run
- The database file is included in `.gitignore`

## Manual Testing

Test every endpoint using `curl`, Postman, Thunder Client, or Insomnia.

**Quick test sequence:**
```bash
# Create a task
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test task"}'

# Get all tasks
curl http://localhost:3000/api/tasks

# Get single task
curl http://localhost:3000/api/tasks/1

# Update a task
curl -X PUT http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated task","completed":true}'

# Delete a task
curl -X DELETE http://localhost:3000/api/tasks/1
```

## License

MIT
