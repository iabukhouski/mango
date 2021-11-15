import express from 'express';
import * as R from 'ramda';

export const router = express.Router();

/**
 * List Reviews
 */
import { listReviews } from './data';

router.get(
  '/products/:productId/reviews',
  async (req, res): Promise<void> => {

    const reviews = await listReviews(req.params.productId);

    res
      .status(200)
      .send(reviews);
  },
);

/**
 * Create Review
 */
import { createReview } from './data';

router.post(
  '/products/:productId/reviews',
  async (req, res): Promise<void> => {

    const review = await createReview(req.params.productId)(req.body);

    res
      .status(201)
      .send(review);
  },
);

/**
 * Read Review
 */
import { readReview } from './data';

router.get(
  '/products/:productId/reviews/:reviewId',
  async (req, res) => {

    const review = await readReview(req.params.reviewId);

    if (R.isNil(review)) {

      res
        .status(404)
        .send(`Not Found`);

      return;
    }

    res
      .status(200)
      .send(review);
  },
);

/**
 * Update Review
 */
import { updateReview } from './data';

router.patch(
  '/products/:productId/reviews/:reviewId',
  async (req, res) => {

    const review = await updateReview(req.params.reviewId)(req.body);

    if (R.isNil(review)) {

      res
        .status(404)
        .send(`Not Found`);

      return;
    }

    res
      .status(200)
      .send(review);
  },
);


/**
 * Delete Review
 */
import { deleteReview } from './data';

router.delete(
  '/products/:productId/reviews/:reviewId',
  async (req, res) => {

    const review = await deleteReview(req.params.reviewId);

    if (R.isNil(review)) {

      res
        .status(404)
        .send(`Not Found`);

      return;
    }

    res
      .status(204)
      .send();
  },
);

