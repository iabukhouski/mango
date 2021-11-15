import { getRepository } from 'typeorm';
import * as R from 'ramda';
import { Product } from './entity';
import { Review } from '../../reviews/dal/entity';

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
  async (partialProduct: Pick<Product, `name`>): Promise<Product | undefined> => {

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
type ProductComputedValues = {
  avgScore?: number;
};

type ProductReadView =
  & Product
  & ProductComputedValues;

export const readProduct =
  async (productId: Product['id']): Promise<ProductReadView | undefined> => {

    const repository = getRepository(Product);

    const rawAndEntities = await repository
      .createQueryBuilder(`product`)
      .addSelect(
        (subQuery) => {

          return subQuery
            .select(`ROUND(AVG(review.score), 1)`)
            .from(Review, `review`)
            .where(`review.productId = :productId`, { productId });
        },
        `avgScore`,
      )
      .leftJoinAndSelect(`product.reviews`, `review`)
      .where(`product.id = :productId`, { productId })
      .orderBy(`review.createdAt`, `DESC`)
      /**
       * @see https://github.com/typeorm/typeorm/issues/296
       * Unfortunately, TypeORM does not support yet somethink like `addSelectAndMap` or `ComputedColumn`
       */
      .getRawAndEntities();

    const entity = rawAndEntities.entities[0];
    const raw = rawAndEntities.raw[0];

    if (R.isNil(entity) || R.isNil(raw)) {

      return undefined;
    }

    /**
     * `raw.avgScore` is `null` if the product has 0 reviews
     */
    const avgScore =
      R.isNil(raw.avgScore)
        ? undefined
        : parseFloat(raw.avgScore);

    return {
      ...entity,
      avgScore,
    };
  }

/**
 * Update Product
 */
export const updateProduct =
  (productId: Product['id']) =>
    async (partialProduct: Pick<Product, `name`>): Promise<Product | undefined> => {

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
