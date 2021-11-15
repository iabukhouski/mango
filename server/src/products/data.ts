import { getRepository } from 'typeorm';
import * as R from 'ramda';
import { Product } from './entity';

/**
 * List Products
 */
export const listProducts =
  async (): Promise<Product[]> => {

    const repository = getRepository(Product);

    return await repository
      .find();
  }

/**
 * Create Product
 */
export const createProduct =
  async (partialProduct: Pick<Product, 'name'>): Promise<Product | undefined> => {

    const repository = getRepository(Product);

    return await repository
      .save(
        {
          name: partialProduct.name,
        },
      );
  }

/**
 * Read Product
 */
export const readProduct =
  async (productId: Product['id']): Promise<Product | undefined> => {

    const repository = getRepository(Product);

    const product = await repository
      .createQueryBuilder(`product`)
      .where(`product.id = :productId`, { productId })
      .findOne();

    return product;
  }

/**
 * Update Product
 */
export const updateProduct =
  (productId: Product['id']) =>
    async (partialProduct: Pick<Product, 'name'>): Promise<Product | undefined> => {

      const repository = getRepository(Product);

      const product = await repository.findOne(productId);

      if (R.isNil(product)) {

        return undefined;
      }

      return await repository.save(
        {
          ...product,
          name: partialProduct.name,
        },
      );
    }

/**
 * Delete Product
 */
export const deleteProduct =
  async (productId: Product['id']): Promise<Product | undefined> => {

    const repository = getRepository(Product);

    const product = await repository.findOne(productId);

    if (R.isNil(product)) {

      return undefined;
    }

    return await repository.remove(product);
  }
