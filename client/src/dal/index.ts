/**
 * This module contains common functions which simplify implementation of
 * `DAL` layers per domain modules (e.g. Products, Reviews)
 */

/**************
 * PUBLIC API *
 **************/

/**
 * Rest
 */
export {
  create,
  read,
} from './rest';

/**
 * WS
 */
export {
  getServerURL,
  list as listWS,
  read as readWS,
} from './ws';
