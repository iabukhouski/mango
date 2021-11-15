# Mango Server

## API Reference

### Products
type Product = {
  id: string;
  name: string;
};

GET /products - Returns a list of products
GET /product/:productId - Returns a particular product
