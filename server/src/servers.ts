/**
 * REST
 */
import { createServer } from 'http';
import { app } from './presentation';

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

export const server = createServer(app);

/**
 * WebSockets
 *
 * Simple routing for `ws` server
 */
import { JSON } from './index.d';
import { isReadProductPayload, broadcastProduct } from './products';
import { isListReviewsPayload, broadcastReviews } from './reviews';

const onConnection =
  (payload: JSON) => {
    if (isReadProductPayload(payload)) {

      broadcastProduct(payload.params.productId);
    }

    if (isListReviewsPayload(payload)) {

      broadcastReviews(payload.params.productId);
    }
  };

import { configureWebSocketsServer } from './presentation';

export const startWebSocketsServer = configureWebSocketsServer({ server })(onConnection);
