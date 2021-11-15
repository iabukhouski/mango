import { Review, PartialReview } from '../reviews.d';
import { create, listWS } from '../../dal';

/**
 * Create Review
 */
export const createReview =
  (productId: Review['productId']) =>
    async (partialReview: PartialReview): Promise<void> => {

      await create(
        `products/${productId}/reviews`,
        partialReview,
      );
    };

/**
 * List Reviews By Product Id
 */
export const listReviewsByProductId =
  (productId: Review['productId']) => {

    return listWS(`reviews`)({ productId });
  };
