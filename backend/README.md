
# Chatbot Backend API

Express.js REST API for the chatbot application. This API connects to a PostgreSQL database hosted on Supabase.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env` in the `backend` folder. (**Note:** This is a separate `.env` file from the one in the `frontend` folder.)

Edit `backend/.env` and add your Supabase database connection string:

```env
DATABASE_URL=postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-1-eu-north-1.pooler.supabase.com:6543/postgres
PORT=3000
```

To find your DATABASE_URL:

1. Go to your Supabase project dashboard
2. Click the **Connect** button in the header
3. Under **Connection String** > **URI**, copy the connection string listed under **Transaction pooler**.
4. Replace `[YOUR-PASSWORD]` with your database password

### 3. Start the Server

Development mode (with auto-restart on file changes):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### GET /

Health check endpoint to verify the server is running.

**Response:**

```json
{
  "message": "Chatbot API Server",
  "version": "1.0.0"
}
```

### GET /api/threads

Fetches all chat threads, ordered by creation date (newest first).

**Response:**

```json
[
  {
    "id": "uuid",
    "title": "Thread title",
    "created_at": "2025-10-13T10:30:00Z"
  }
]
```

### POST /api/threads

Creates a new thread with an initial message. This is a compound operation that creates both the thread and its first message in a single request.

**Request Body:**

```json
{
  "title": "Thread title",
  "content": "First message content"
}
```

**Request Body Fields:**

- `title` (required) - The thread title (cannot be empty)
- `content` (required) - The initial message text (cannot be empty)

**Response (201 Created):**

```json
{
  "thread": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Thread title",
    "created_at": "2025-10-13T10:30:00Z"
  },
  "message": {
    "id": "789e4567-e89b-12d3-a456-426614174000",
    "thread_id": "123e4567-e89b-12d3-a456-426614174000",
    "type": "user",
    "content": "First message content",
    "created_at": "2025-10-13T10:30:00Z"
  }
}
```

**Response (400 Bad Request):**

```json
{
  "error": "Both 'title' and 'content' are required"
}
```

or

```json
{
  "error": "Title cannot be empty"
}
```

or

```json
{
  "error": "Content cannot be empty"
}
```

**Note:** This endpoint performs two database operations: it creates the thread first, then creates the initial message. Both operations are done in sequence within the same request to ensure consistency.

### POST /api/threads/:id/messages

Creates a new message in a thread.

**URL Parameters:**

- `id` - The UUID of the thread

**Request Body:**

```json
{
  "type": "user",
  "content": "This is my message"
}
```

**Request Body Fields:**

- `type` (required) - Must be either `"user"` or `"bot"`
- `content` (required) - The message text (cannot be empty)

**Response (201 Created):**

```json
{
  "id": "789e4567-e89b-12d3-a456-426614174000",
  "thread_id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "user",
  "content": "This is my message",
  "created_at": "2025-10-13T10:35:00Z"
}
```

**Response (400 Bad Request):**

```json
{
  "error": "Both 'type' and 'content' are required"
}
```

or

```json
{
  "error": "Type must be either 'user' or 'bot'"
}
```

or

```json
{
  "error": "Content cannot be empty"
}
```

### PATCH /api/threads/:id

Updates a thread's title. This is a partial update - only the title field is modified.

**URL Parameters:**

- `id` - The UUID of the thread to update

**Request Body:**

```json
{
  "title": "Updated thread title"
}
```

**Request Body Fields:**

- `title` (required) - The new thread title (cannot be empty)

**Response (200 OK):**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Updated thread title",
  "created_at": "2025-10-13T10:30:00Z"
}
```

**Response (400 Bad Request):**

```json
{
  "error": "Title is required"
}
```

or

```json
{
  "error": "Title cannot be empty"
}
```

**Response (404 Not Found):**

```json
{
  "error": "Thread not found"
}
```

**Note:** This endpoint uses PATCH (not PUT) because it only updates specific fields rather than replacing the entire resource. Other fields like `created_at` remain unchanged.

### DELETE /api/threads/:id

Deletes a thread and all its associated messages. The database CASCADE constraint automatically removes all messages when a thread is deleted.

**URL Parameters:**

- `id` - The UUID of the thread to delete

**Response (200 OK):**

```json
{
  "message": "Thread deleted successfully",
  "deletedId": "123e4567-e89b-12d3-a456-426614174000"
}
```

**Response (404 Not Found):**

```json
{
  "error": "Thread not found"
}
```

**Note:** This is a destructive operation that cannot be undone. All messages in the thread will be permanently deleted due to the `ON DELETE CASCADE` constraint in the database schema.

## Testing

### Test with curl

```bash
# Health check
curl http://localhost:3000/

# Get all threads
curl http://localhost:3000/api/threads

# Create a new thread with initial message (POST request)
curl -X POST http://localhost:3000/api/threads \
  -H "Content-Type: application/json" \
  -d '{"title":"My new thread","content":"This is the first message"}'

# Test validation - missing content (should return 400)
curl -X POST http://localhost:3000/api/threads \
  -H "Content-Type: application/json" \
  -d '{"title":"Thread without message"}'

# Test validation - empty title (should return 400)
curl -X POST http://localhost:3000/api/threads \
  -H "Content-Type: application/json" \
  -d '{"title":"   ","content":"Message with empty title"}'

# Create a new message (POST request)
curl -X POST http://localhost:3000/api/threads/123e4567-e89b-12d3-a456-426614174000/messages \
  -H "Content-Type: application/json" \
  -d '{"type":"user","content":"Hello from curl!"}'

# Test validation - missing content (should return 400)
curl -X POST http://localhost:3000/api/threads/123e4567-e89b-12d3-a456-426614174000/messages \
  -H "Content-Type: application/json" \
  -d '{"type":"user"}'

# Test validation - invalid type (should return 400)
curl -X POST http://localhost:3000/api/threads/123e4567-e89b-12d3-a456-426614174000/messages \
  -H "Content-Type: application/json" \
  -d '{"type":"admin","content":"This should fail"}'

# Delete a thread (DELETE request)
curl -X DELETE http://localhost:3000/api/threads/123e4567-e89b-12d3-a456-426614174000

# Test deleting a non-existent thread (should return 404)
curl -X DELETE http://localhost:3000/api/threads/00000000-0000-0000-0000-000000000000

### Test with Browser

GET endpoints can be tested in the browser:

- `http://localhost:3000/` - Should show the welcome message
- `http://localhost:3000/api/threads` - Should show the list of threads

POST endpoints require a tool like:
- curl (see examples above)
- Postman
- Thunder Client (VS Code extension)
- Or test through your frontend application

## Project Structure

```
backend/
├── .env              # Environment variables
├── .gitignore        # Git ignore rules
├── db.js             # Database connection setup
├── package.json      # Node.js dependencies and scripts
├── server.js         # Express server and API routes
└── README.md         # This file
```

## Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Postgres.js Documentation](https://github.com/porsager/postgres)
