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

app.use(
  '/api',
  [
    productsRouter,
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
