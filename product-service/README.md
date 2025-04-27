# Product Service

This microservice manages product details for the e-commerce platform.

## Features

- CRUD operations for products
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
docker build -t product-service .
docker run -p 4001:4001 --env-file .env product-service
```

## API Endpoints

- `POST   /api/products` Create a product
- `GET    /api/products` List all products
- `GET    /api/products/:id` Get product by ID
- `PUT    /api/products/:id` Update product
- `DELETE /api/products/:id` Delete product
