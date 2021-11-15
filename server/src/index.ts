import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

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
