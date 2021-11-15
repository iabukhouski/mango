import { describe, test, expect } from '@jest/globals';
import { isListReviewsPayload } from './ws';

describe(
  `Testing 'isListReviewsPayload`,
  () => {

    test(
      `Should return 'false' is supplied with 'null'`,
      () => {
        expect(isListReviewsPayload(null)).toBe(false);
      },
    );

    test(
      `Should return 'false' is supplied with 'true'`,
      () => {
        expect(isListReviewsPayload(true)).toBe(false);
      },
    );

    test(
      `Should return 'true' is supplied with actuall 'ListReviews' payload`,
      () => {
        const payload = {
          method: `LIST`,
          url: `reviews`,
          params: {
            productId: `product_one`,
          },
        };

        expect(isListReviewsPayload(payload)).toBe(true);
      },
    );
  },
);
