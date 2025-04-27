# Order Service

This microservice manages orders for the e-commerce platform.

## Features

- CRUD operations for orders
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
docker build -t order-service .
docker run -p 4002:4002 --env-file .env order-service
```

## API Endpoints

- `POST   /api/orders` Create an order
- `GET    /api/orders` List all orders
- `GET    /api/orders/:id` Get order by ID
- `PUT    /api/orders/:id` Update order
- `DELETE /api/orders/:id` Delete order
