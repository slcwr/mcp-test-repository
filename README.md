# MCP Test Node.js Application

This is a simple Node.js application created via MCP (Model Context Protocol) that demonstrates basic Express.js server functionality.

## Features

- Express.js web server
- REST API endpoints
- JSON responses
- Error handling
- Health check endpoint
- Graceful shutdown

## API Endpoints

### GET /
Returns a welcome message with timestamp and version information.

```json
{
  "message": "Hello World from MCP Node.js App!",
  "timestamp": "2025-06-15T07:05:25.000Z",
  "version": "1.0.0"
}
```

### GET /api/health
Health check endpoint that returns server status and uptime.

```json
{
  "status": "OK",
  "uptime": 123.456,
  "timestamp": "2025-06-15T07:05:25.000Z"
}
```

### GET /api/users
Returns a list of sample users.

```json
[
  { "id": 1, "name": "Alice", "email": "alice@example.com" },
  { "id": 2, "name": "Bob", "email": "bob@example.com" },
  { "id": 3, "name": "Charlie", "email": "charlie@example.com" }
]
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/slcwr/mcp-test-repository.git
cd mcp-test-repository
```

2. Install dependencies:
```bash
npm install
```

## Usage

### Development
Run the application in development mode with auto-restart:
```bash
npm run dev
```

### Production
Run the application in production mode:
```bash
npm start
```

The server will start on port 3000 (or the port specified in the PORT environment variable).

## Environment Variables

- `PORT`: Server port (default: 3000)

## Dependencies

- **express**: Fast, unopinionated, minimalist web framework for Node.js
- **nodemon**: Utility that monitors for changes and automatically restarts the server (dev dependency)

## License

MIT