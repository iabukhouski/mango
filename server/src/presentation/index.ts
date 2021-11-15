/**
 * This module contains common functions which simplify implementation of
 * `Presentation` layers per domain modules (e.g. Products, Reviews)
 */

/**************
 * PUBLIC API *
 **************/

/**
 * Rest Server
 */
export {
  app,
} from './rest';

/**
 * WebSockets Server
 */
export {
  configureWebSocketsServer,
  broadcast,
} from './ws';
