import { broadcast } from '../../presentation';
import { Review } from '../dal/entity';

/**
 * Is List Review Payload Type Guard
 */
import { JSON } from '../../index.d';

type ListReviewsPayload = {
  method: `LIST`;
  url: `reviews`;
  params: {
    productId: Review['productId'];
  };
};

/**
 * A very simple validation of `ws` request payload
 */
export const isListReviewsPayload =
  (payload: JSON | ListReviewsPayload): payload is ListReviewsPayload => {

    if (typeof payload !== `object` || payload === null) {

      return false;
    }

    if (!(`url` in payload) || payload.url !== `reviews`) {

      return false;
    }

    if (!(`params` in payload) || typeof payload.params !== `object`) {

      return false;
    }

    return `productId` in payload.params;
  };

/**
 * Broadcast Reviews
 */
import { listReviews } from '../dal/data';

export const broadcastReviews =
  async (productId: Review['productId']) => {

    const reviews = await listReviews(productId);

    const payload = {
      method: `LIST` as const,
      url: `reviews`,
      params: {
        productId,
      },
    };

    await broadcast(payload)(reviews);
  };
