# User Service

This microservice manages user profiles for the e-commerce platform.

## Features

- CRUD operations for users
- MongoDB for data storage
- RESTful API

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set your environment variables.
3. Start the service:
   ```bash
   npm run dev
   ```

## Docker

Build and run with Docker:

```bash
docker build -t user-service .
docker run -p 4003:4003 --env-file .env user-service
```

## API Endpoints

- `POST   /api/users` Create a user
- `GET    /api/users` List all users
- `GET    /api/users/:id` Get user by ID
- `PUT    /api/users/:id` Update user
- `DELETE /api/users/:id` Delete user
