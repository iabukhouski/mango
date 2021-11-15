import { broadcast } from '../../presentation';
import { Product } from '../dal/entity';

/**
 * Is Read Review Payload Type Guard
 */
import { JSON } from '../../index.d';

type ReadProductPayload = {
  method: `GET`;
  url: `products`;
  params: {
    productId: Product['id'];
  };
};

/**
 * A very simple validation of `ws` request payload
 */
export const isReadProductPayload =
  (payload: JSON | ReadProductPayload): payload is ReadProductPayload => {

    if (typeof payload !== `object` || payload === null) {

      return false;
    }

    if (!(`method` in payload) || payload.method !== `GET`) {

      return false;
    }

    if (!(`url` in payload) || payload.url !== `products`) {

      return false;
    }

    if (!(`params` in payload) || typeof payload.params !== `object`) {

      return false;
    }

    return `productId` in payload.params;
  };

/**
 * Broadcast Product
 */
import { readProduct } from '../dal/data';

export const broadcastProduct =
  async (productId: Product['id']) => {

    const product = await readProduct(productId);

    const payload = {
      method: `GET` as const,
      url: `products`,
      params: {
        productId,
      },
    };

    await broadcast(payload)(product);
  };
