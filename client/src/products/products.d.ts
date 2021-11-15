export type Product = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * Read Product
 */
import { ReviewType } from '../reviews';

export type ReadProduct =
  & Product
  & {
    reviews: ReviewType[];

    /**
     * `avgScore` may be `undefined` if there are no reviews for the product yet
     */
    avgScore?: number;
  };
