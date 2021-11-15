# Mango Server

## API Reference

### Products
type Product = {
  id: string;
  name: string;
};

GET /products - Returns a list of products
GET /product/:productId - Returns a particular product

### Reviews
type Review = {
  id: string;
  productId: string;
  score: number;
  description: string;
  createdAt: string;
  updatedAt: string
};

GET /products/:productId/reviews - Returns a list of reviews of a particular product
POST /products/:productId/reviews - Create a new review of a particular product

## Build Docker Image
```sh
  docker build . \
    --tag mango-server
```

## Run Docker Image
```sh
  docker run \
    --interactive \
    --tty \
    --env PORT=3001 \
    --env-file .env \
    --publish 3000:3001 \
    mango-server
```
