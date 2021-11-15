import express from 'express';
import * as R from 'ramda';
import { broadcastProduct } from './ws';

export const router = express.Router();

/**
 * List Products
 */
import { listProducts } from '../dal/data';

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
import { createProduct } from '../dal/data';

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
import { readProduct } from '../dal/data';

router.get(
  `/products/:productId`,
  async (req, res) => {

    const productId = req.params.productId;

    const product = await readProduct(productId);

    if (R.isNil(product)) {

      res
        .status(404)
        .send(`Not Found`);

      return;
    }

    res
      .status(200)
      .send(product);

    await broadcastProduct(productId);
  },
);

/**
 * Update Product
 */
import { updateProduct } from '../dal/data';

router.patch(
  `/products/:productId`,
  async (req, res) => {

    const productId = req.params.productId;

    const product = await updateProduct(productId)(req.body);

    if (R.isNil(product)) {

      res
        .status(404)
        .send(`Not Found`);

      return;
    }

    res
      .status(200)
      .send(product);

    await broadcastProduct(productId);
  },
);

/**
 * Delete Product
 */
import { deleteProduct } from '../dal/data';

router.delete(
  `/products/:productId`,
  async (req, res) => {

    const productId = req.params.productId;

    const product = await deleteProduct(productId);

    if (R.isNil(product)) {

      res
        .status(404)
        .send(`Not Found`);

      return;
    }

    res
      .status(204)
      .send();

    await broadcastProduct(productId);
  },
);
