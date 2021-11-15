import { Product } from '../products.d';
import { read, readWS } from '../../dal';

/**
 * List Products
 */
export const listProducts =
  async (): Promise<Product[]> => {

    const response = await read<Product[]>(`products`);

    return response.data;
  };

/**
 * Read Product
 */
export const readProduct =
  (productId: Product['id']) => {

    return readWS(`products`)({ productId });
  };
