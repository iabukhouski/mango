import express from 'express';
import * as R from 'ramda';
import { broadcastProduct } from '../../products';
import { broadcastReviews } from './ws';

export const router = express.Router();

/**
 * List Reviews
 */
import { listReviews } from '../dal/data';

router.get(
  `/products/:productId/reviews`,
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
import { createReview } from '../dal/data';

router.post(
  `/products/:productId/reviews`,
  async (req, res): Promise<void> => {

    const productId = req.params.productId;

    const review = await createReview(productId)(req.body);

    await broadcastReviews(productId);
    await broadcastProduct(productId);

    res
      .status(201)
      .send(review);
  },
);

/**
 * Read Review
 */
import { readReview } from '../dal/data';

router.get(
  `/products/:productId/reviews/:reviewId`,
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
import { updateReview } from '../dal/data';

router.patch(
  `/products/:productId/reviews/:reviewId`,
  async (req, res) => {

    const review = await updateReview(req.params.reviewId)(req.body);

    if (R.isNil(review)) {

      res
        .status(404)
        .send(`Not Found`);

      return;
    }

    const productId = req.params.productId;

    await broadcastReviews(productId);
    await broadcastProduct(productId);

    res
      .status(200)
      .send(review);
  },
);


/**
 * Delete Review
 */
import { deleteReview } from '../dal/data';

router.delete(
  `/products/:productId/reviews/:reviewId`,
  async (req, res) => {

    const review = await deleteReview(req.params.reviewId);

    if (R.isNil(review)) {

      res
        .status(404)
        .send(`Not Found`);

      return;
    }

    const productId = req.params.productId;

    await broadcastReviews(productId);
    await broadcastProduct(productId);

    res
      .status(204)
      .send();
  },
);
