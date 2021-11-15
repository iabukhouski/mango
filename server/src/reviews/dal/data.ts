import { getRepository } from 'typeorm';
import * as R from 'ramda';
import { Review } from './entity';

/**
 * List Reviews
 */
export const listReviews =
  async (productId: Review['productId']): Promise<Review[]> => {

    const repository = getRepository(Review);

    return await repository
      .find(
        {
          where: {
            productId,
          },
        },
      );
  }

/**
 * Create Review
 */
export const createReview =
  (productId: Review['productId']) =>
    async (partialReview: Pick<Review, 'score' | 'description'>): Promise<Review | undefined> => {

      const repository = getRepository(Review);

      return await repository
        .save(
          {
            productId,
            score: partialReview.score,
            description: partialReview.description,
          },
        );
    }

/**
 * Read Review
 */
export const readReview =
  async (reviewId: Review['id']): Promise<Review | undefined> => {

    const repository = getRepository(Review);

    return await repository.findOne(reviewId);
  }

/**
 * Update Review
 */
export const updateReview =
  (reviewId: Review['id']) =>
    async (partialReview: Pick<Review, 'score' | 'description'>): Promise<Review | undefined> => {

      const repository = getRepository(Review);

      const review = await repository.findOne(reviewId);

      if (R.isNil(review)) {

        return undefined;
      }

      return await repository.save(
        {
          ...review,
          score: partialReview.score,
          description: partialReview.description,
        },
      );
    }

/**
 * Delete Review
 */
export const deleteReview =
  async (reviewId: Review['id']): Promise<Review | undefined> => {

    const repository = getRepository(Review);

    const review = await repository.findOne(reviewId);

    if (R.isNil(review)) {

      return undefined;
    }

    return await repository.remove(review);
  }
