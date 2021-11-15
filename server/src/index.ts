import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

/**
 * Products
 */
import { router as productsRouter } from './products';

/**
 * Reviews
 */
import { router as reviewsRouter } from './reviews';

app.use(
  '/api',
  [
    productsRouter,
    reviewsRouter,
  ],
);

/**
 * Init
 */
(
  async () => {

    await createConnection();

    app.listen(
      port,
      () => {
        console.log(`Example app listening at http://localhost:${port}`);
      },
    );
  }
)();
