import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { server, startWebSocketsServer } from './servers';

/**
 * Init
 */
(
  async () => {

    const port = process.env.PORT || 3000;

    await createConnection();

    startWebSocketsServer();

    server.listen(
      port,
      () => {
        console.log(`Listening at http://localhost:${port}`);
      },
    );
  }
)();
