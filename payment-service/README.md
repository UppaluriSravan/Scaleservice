# Payment Service

This microservice processes payments for the e-commerce platform.

## Features

- CRUD operations for payments
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
docker build -t payment-service .
docker run -p 4004:4004 --env-file .env payment-service
```

## API Endpoints

- `POST   /api/payments` Create a payment
- `GET    /api/payments` List all payments
- `GET    /api/payments/:id` Get payment by ID
- `PUT    /api/payments/:id` Update payment
- `DELETE /api/payments/:id` Delete payment
