/**************
 * PUBLIC API *
 **************/

/**
 * Components
 */
export { Product } from './presentation/Product';

/**
 * Reducer
 */
export { default as productsReducer } from './slice';

/**
 * Types
 */
export type { Product as ProductType } from './products.d';
