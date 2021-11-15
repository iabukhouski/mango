import { describe, test, expect } from '@jest/globals';
import { isReadProductPayload } from './ws';

describe(
  `Testing 'isReadProductPayload`,
  () => {

    test(
      `Should return 'false' is supplied with 'null'`,
      () => {
        expect(isReadProductPayload(null)).toBe(false);
      },
    );

    test(
      `Should return 'false' is supplied with 'true'`,
      () => {
        expect(isReadProductPayload(true)).toBe(false);
      },
    );

    test(
      `Should return 'true' is supplied with actuall 'ListReviews' payload`,
      () => {
        const payload = {
          method: `GET`,
          url: `products`,
          params: {
            productId: `product_one`,
          },
        };

        expect(isReadProductPayload(payload)).toBe(true);
      },
    );
  },
);
