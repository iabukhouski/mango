import express from 'express';
import * as R from 'ramda';

export const router = express.Router();

/**
 * List Products
 */
import { listProducts } from './data';

router.get(
  `/products`,
  async (_, res) => {

    const products = await listProducts();

    res
      .status(200)
      .send(products);
  },
);

/**
 * Create Product
 */
import { createProduct } from './data';

router.post(
  `/products`,
  async (req, res) => {

    const product = await createProduct({
      name: req.body.name,
    });

    res
      .status(201)
      .send(product);
  },
);

/**
 * Read Product
 */
import { readProduct } from './data';

router.get(
  '/products/:productId',
  async (req, res) => {

    const product = await readProduct(req.params.productId);

    if (R.isNil(product)) {

      res
        .status(404)
        .send(`Not Found`);

      return;
    }

    res
      .status(200)
      .send(product);
  },
);

/**
 * Update Product
 */
import { updateProduct } from './data';

router.patch(
  '/products/:productId',
  async (req, res) => {

    const product = await updateProduct(req.params.productId)(req.body);

    if (R.isNil(product)) {

      res
        .status(404)
        .send(`Not Found`);

      return;
    }

    res
      .status(200)
      .send(product);
  },
);


/**
 * Delete Product
 */
import { deleteProduct } from './data';

router.delete(
  '/products/:productId',
  async (req, res) => {

    const product = await deleteProduct(req.params.productId);

    if (R.isNil(product)) {

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
